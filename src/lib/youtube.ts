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

function toVideo(id: string, rawTitle: string, published: string): Video {
  return {
    id,
    title: decode(rawTitle).trim(),
    published,
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
