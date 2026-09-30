export type Video = {
  id: string;
  title: string;
  published: string;
  thumbnail: string;
};

const decode = (s: string) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

// 유튜브 채널 RSS(최근 15개)를 1시간마다 새로 가져옵니다. 실패하면 빈 배열.
export async function getLatestVideos(channelId: string, limit = 15): Promise<Video[]> {
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];
    const xml = await res.text();
    const entries = xml.split("<entry>").slice(1, limit + 1);
    return entries.map((e) => {
      const id = e.match(/<yt:videoId>([^<]+)</)?.[1] ?? "";
      return {
        id,
        title: decode(e.match(/<title>([^<]*)</)?.[1] ?? ""),
        published: e.match(/<published>([^<]+)</)?.[1] ?? "",
        thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      };
    }).filter((v) => v.id);
  } catch {
    return [];
  }
}

export const formatDate = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
};
