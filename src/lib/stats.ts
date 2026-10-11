import { Redis } from "@upstash/redis";
import { nav } from "@/data/church";

// 접속자 통계 (Upstash Redis). Vercel 에서 Upstash for Redis 를 연결하면 환경변수가 자동 설정됨
//  pv:total, uv:total          누적 페이지뷰 / 누적 방문자
//  pv:{날짜}, uv:{날짜}         날짜별 페이지뷰 / 방문자 (한국 시간 기준, 400일 보관)
//  pages                       페이지별 누적 조회수
//  seen:{날짜}:{방문자}         그날 이미 센 방문자 표시 (2일 뒤 자동 삭제)

let client: Redis | null | undefined;

export function redis() {
  if (client !== undefined) return client;
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  client = url && token ? new Redis({ url, token }) : null;
  return client;
}

export const statsConfigured = () => redis() !== null;

// 한국 시간 기준 날짜 (YYYY-MM-DD)
export const kstDay = (offsetDays = 0) =>
  new Date(Date.now() + 9 * 3600 * 1000 - offsetDays * 86400 * 1000).toISOString().slice(0, 10);

// 사이트 메뉴에 있는 페이지만 따로 세고, 나머지는 '기타'
export const PAGE_LABELS: Record<string, string> = {
  "/": "홈",
  ...Object.fromEntries(nav.map((n) => [n.href, n.label])),
};
export const normalizePath = (path: string) => {
  const clean = path.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
  return clean in PAGE_LABELS ? clean : "기타";
};

const DAY_TTL = 400 * 86400;

export async function recordVisit(path: string, visitorId: string) {
  const r = redis();
  if (!r) return;
  const day = kstDay();
  const page = normalizePath(path);

  // 그날 처음 온 방문자인지 (있으면 null)
  const first = await r.set(`seen:${day}:${visitorId}`, 1, { nx: true, ex: 2 * 86400 });

  const p = r.pipeline();
  p.incr("pv:total");
  p.incr(`pv:${day}`);
  p.expire(`pv:${day}`, DAY_TTL);
  p.hincrby("pages", page, 1);
  if (first) {
    p.incr("uv:total");
    p.incr(`uv:${day}`);
    p.expire(`uv:${day}`, DAY_TTL);
  }
  await p.exec();
}

export type Stats = {
  today: { visitors: number; views: number };
  total: { visitors: number; views: number };
  pages: { path: string; label: string; views: number }[];
};

export async function getStats(): Promise<Stats | null> {
  const r = redis();
  if (!r) return null;
  const day = kstDay();
  const [uvToday, pvToday, uvTotal, pvTotal, pages] = await Promise.all([
    r.get<number>(`uv:${day}`),
    r.get<number>(`pv:${day}`),
    r.get<number>("uv:total"),
    r.get<number>("pv:total"),
    r.hgetall<Record<string, number>>("pages"),
  ]);
  return {
    today: { visitors: Number(uvToday ?? 0), views: Number(pvToday ?? 0) },
    total: { visitors: Number(uvTotal ?? 0), views: Number(pvTotal ?? 0) },
    pages: Object.entries(pages ?? {})
      .map(([path, views]) => ({ path, label: PAGE_LABELS[path] ?? path, views: Number(views) }))
      .sort((a, b) => b.views - a.views),
  };
}
