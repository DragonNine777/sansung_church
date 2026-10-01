export type Video = {
  id: string;
  title: string;
  published: string;
  thumbnail: string;
};

const REVALIDATE = 600; // 10분

const decode = (s: string) =>
  s
    .replace(/\\u0026/g, "&")
    .replace(/\\"/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

// 제목 앞의 날짜 "2026년 9월30일(수)" 를 찾아 [ISO 날짜, 나머지 제목] 으로 나눔
const DATE_PREFIX = /^\s*(\d{4})\s*년\s*(\d{1,2})\s*월\s*(\d{1,2})\s*일\s*(?:\([^)]*\))?\s*[:\-–·]?\s*/;

function splitDate(title: string): { date: string; rest: string } {
  const m = title.match(DATE_PREFIX);
  if (!m) return { date: "", rest: title.trim() };
  const [, y, mo, d] = m;
  return {
    date: `${y}-${mo.padStart(2, "0")}-${d.padStart(2, "0")}`,
    rest: title.slice(m[0].length).trim() || title.trim(),
  };
}

function toVideo(id: string, rawTitle: string, published: string): Video {
  const { date, rest } = splitDate(decode(rawTitle));
  return {
    id,
    title: rest,
    published: published || date,
    thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
  };
}

// 유튜브 응답이 자주 실패(404/500)하므로 10분 단위로 주소를 바꿔 실패 응답이 오래 캐시되지 않게 함
async function get(url: string, attempt: number) {
  const bucket = Math.floor(Date.now() / (REVALIDATE * 1000));
  const sep = url.includes("?") ? "&" : "?";
  const res = await fetch(`${url}${sep}r=${bucket}-${attempt}`, {
    headers: { "Accept-Language": "ko" },
    next: { revalidate: REVALIDATE },
  });
  return res.ok ? res.text() : null;
}

// 1차: 채널 RSS 피드
async function fromFeed(channelId: string): Promise<Video[]> {
  for (let attempt = 0; attempt < 3; attempt++) {
    const xml = await get(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, attempt).catch(() => null);
    if (!xml) continue;
    const videos = xml
      .split("<entry>")
      .slice(1)
      .map((e) =>
        toVideo(
          e.match(/<yt:videoId>([^<]+)</)?.[1] ?? "",
          e.match(/<title>([^<]*)</)?.[1] ?? "",
          e.match(/<published>([^<]+)</)?.[1] ?? "",
        ),
      )
      .filter((v) => v.id);
    if (videos.length) return videos;
  }
  return [];
}

// 2차: 채널 '동영상' 페이지
async function fromChannelPage(channelId: string): Promise<Video[]> {
  for (let attempt = 0; attempt < 2; attempt++) {
    const html = await get(`https://www.youtube.com/channel/${channelId}/videos`, attempt).catch(() => null);
    if (!html) continue;
    const seen = new Set<string>();
    const videos = html
      .split('"lockupViewModel":{')
      .slice(1)
      .map((chunk) => {
        const id = chunk.match(/"contentId":"([\w-]{11})"/)?.[1] ?? "";
        const title = chunk.match(/"lockupMetadataViewModel":\{"title":\{"content":"((?:[^"\\]|\\.)*)"/)?.[1] ?? "";
        return toVideo(id, title, "");
      })
      .filter((v) => v.id && v.title && !seen.has(v.id) && seen.add(v.id));
    if (videos.length) return videos;
  }
  return [];
}

// 최근 영상 목록. 둘 다 실패하면 빈 배열(화면에서는 재생목록 임베드로 대체)
export async function getLatestVideos(channelId: string, limit = 15): Promise<Video[]> {
  const feed = await fromFeed(channelId);
  const videos = feed.length ? feed : await fromChannelPage(channelId);
  return videos.slice(0, limit);
}

// 채널 업로드 재생목록 임베드 주소 (UC... → UU...)
export const uploadsEmbedUrl = (channelId: string) =>
  `https://www.youtube-nocookie.com/embed/videoseries?list=UU${channelId.slice(2)}`;

export const formatDate = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
};
