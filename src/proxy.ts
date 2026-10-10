import { NextResponse, type NextRequest } from "next/server";

export const ADMIN_GATE_HEADER = "x-admin-gate";

// 관리자 페이지(/manage)는 비밀 주소(ADMIN_PATH)로만 열림. /manage 로 직접 들어오면 404
// 비밀 주소로 들어온 요청에만 내부 헤더(x-admin-gate)를 붙여 관리자로 인정. 외부에서 보낸 같은 헤더는 지움
export function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.delete(ADMIN_GATE_HEADER);

  const { pathname, search } = request.nextUrl;
  const secret = (process.env.ADMIN_PATH ?? "").replace(/^\/+|\/+$/g, "");

  if (pathname === "/manage" || pathname.startsWith("/manage/")) {
    return new NextResponse("Not Found", { status: 404 });
  }

  if (secret && (pathname === `/${secret}` || pathname.startsWith(`/${secret}/`))) {
    const url = request.nextUrl.clone();
    url.pathname = "/manage" + pathname.slice(secret.length + 1);
    url.search = search;
    headers.set(ADMIN_GATE_HEADER, secret);
    const response = NextResponse.rewrite(url, { request: { headers } });
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }

  return NextResponse.next({ request: { headers } });
}

export const config = {
  // 정적 파일은 제외
  matcher: ["/((?!_next/static|_next/image|images/|bulletins/|pdfjs/|files/|icon.png).*)"],
};
