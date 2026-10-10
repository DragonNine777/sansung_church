import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";

// 관리자 설정은 모두 환경변수로 (저장소가 공개라 코드에 비밀값을 두지 않음)
//  ADMIN_PATH      관리자 페이지 비밀 주소(필수). 이 주소를 아는 사람이 관리자. 길고 추측하기 어렵게
//  ADMIN_PASSWORD  (선택) 설정하면 비밀 주소 + 비밀번호 로그인까지 요구
//  BLOB_STORE_ID (또는 BLOB_READ_WRITE_TOKEN)  Vercel Blob 저장소 (Vercel에서 저장소를 연결하면 자동 설정)

export const ADMIN_COOKIE = "sl_admin";
export const adminPath = () => (process.env.ADMIN_PATH ?? "").replace(/^\/+|\/+$/g, "");
export const passwordConfigured = () => !!process.env.ADMIN_PASSWORD;
export { storageConfigured } from "./posts";

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

// 비밀 주소로 들어온 요청인지 (src/proxy.ts 가 붙인 내부 헤더 확인)
export async function viaAdminPath() {
  const secret = adminPath();
  const gate = (await headers()).get("x-admin-gate") ?? "";
  return secret.length >= 12 && same(gate, secret);
}

export async function isAdmin() {
  if (!(await viaAdminPath())) return false;
  if (!passwordConfigured()) return true;
  const value = (await cookies()).get(ADMIN_COOKIE)?.value;
  return !!value && same(value, sessionToken());
}
