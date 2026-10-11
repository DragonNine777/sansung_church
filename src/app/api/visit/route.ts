import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminPath } from "@/lib/admin";
import { recordVisit, statsConfigured } from "@/lib/stats";

// 페이지를 볼 때마다 브라우저가 보내는 방문 기록 (src/components/VisitTracker.tsx)
// IP 는 저장하지 않고, 브라우저에 둔 무작위 방문자 번호(쿠키)로 오늘 처음 온 사람인지만 셈
const VISITOR_COOKIE = "sl_vid";
const BOT = /bot|crawl|spider|slurp|facebookexternalhit|headless|lighthouse|preview|curl|wget/i;

export async function POST(request: Request) {
  if (!statsConfigured()) return new NextResponse(null, { status: 204 });
  if (BOT.test(request.headers.get("user-agent") ?? "")) return new NextResponse(null, { status: 204 });

  const { path } = (await request.json().catch(() => ({}))) as { path?: string };
  if (typeof path !== "string" || !path.startsWith("/") || path.length > 200) {
    return new NextResponse(null, { status: 204 });
  }
  // 관리자 페이지 방문은 세지 않음
  const secret = adminPath();
  if (secret && (path === `/${secret}` || path.startsWith(`/${secret}/`))) return new NextResponse(null, { status: 204 });

  const jar = await cookies();
  let visitor = jar.get(VISITOR_COOKIE)?.value;
  if (!visitor || !/^[\w-]{8,64}$/.test(visitor)) {
    visitor = randomUUID();
    jar.set(VISITOR_COOKIE, visitor, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 365 });
  }

  await recordVisit(path, visitor).catch(() => {});
  return new NextResponse(null, { status: 204 });
}
