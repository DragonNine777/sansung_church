import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// 관리자 설정은 모두 환경변수로 (저장소가 공개라 코드에 비밀값을 두지 않음)
//  ADMIN_PATH      관리자 페이지 비밀 주소. 예: "sl-admin-x7k2q9" → https://사이트/sl-admin-x7k2q9
//  ADMIN_PASSWORD  관리자 비밀번호
//  BLOB_READ_WRITE_TOKEN  Vercel Blob 저장소 (Vercel에서 Blob 저장소를 연결하면 자동 설정)

export const ADMIN_COOKIE = "sl_admin";
export const adminPath = () => (process.env.ADMIN_PATH ?? "").replace(/^\/+|\/+$/g, "");
export const passwordConfigured = () => !!process.env.ADMIN_PASSWORD;
export const storageConfigured = () => !!process.env.BLOB_READ_WRITE_TOKEN;

// 쿠키에는 비밀번호에서 만든 서명값만 저장 (비밀번호를 바꾸면 기존 로그인은 모두 해제됨)
export function sessionToken() {
  return createHmac("sha256", process.env.ADMIN_PASSWORD ?? "").update("sansung-admin-session-v1").digest("hex");
}

const same = (a: string, b: string) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

export const checkPassword = (input: string) => passwordConfigured() && same(input, process.env.ADMIN_PASSWORD!);

export async function isAdmin() {
  if (!passwordConfigured()) return false;
  const value = (await cookies()).get(ADMIN_COOKIE)?.value;
  return !!value && same(value, sessionToken());
}
