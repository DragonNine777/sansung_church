import { NextResponse, type NextRequest } from "next/server";

// 관리자 페이지(/manage)는 비밀 주소(ADMIN_PATH)로만 열림. /manage 로 직접 들어오면 404
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const secret = (process.env.ADMIN_PATH ?? "").replace(/^\/+|\/+$/g, "");

  if (pathname === "/manage" || pathname.startsWith("/manage/")) {
    return new NextResponse("Not Found", { status: 404 });
  }

  if (secret && (pathname === `/${secret}` || pathname.startsWith(`/${secret}/`))) {
    const url = request.nextUrl.clone();
    url.pathname = "/manage" + pathname.slice(secret.length + 1);
    url.search = search;
    const response = NextResponse.rewrite(url);
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  // 정적 파일은 제외
  matcher: ["/((?!_next/static|_next/image|images/|bulletins/|pdfjs/|icon.png).*)"],
};
