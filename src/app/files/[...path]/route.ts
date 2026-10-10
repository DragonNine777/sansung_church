import { get } from "@vercel/blob";
import { isUploadPath, storageConfigured } from "@/lib/posts";

// 비공개 Blob 저장소의 주보·포스터 파일을 사이트 주소(/files/...)로 전달
// 업로드 폴더(bulletin/, news/) 안의 파일만 허용
export async function GET(_request: Request, ctx: RouteContext<"/files/[...path]">) {
  const { path } = await ctx.params;
  const pathname = path.map(decodeURIComponent).join("/");
  if (!storageConfigured() || !isUploadPath(pathname)) return new Response("Not Found", { status: 404 });

  try {
    const result = await get(pathname, { access: "private" });
    if (!result || result.statusCode !== 200) return new Response("Not Found", { status: 404 });
    return new Response(result.stream, {
      headers: {
        "Content-Type": result.blob.contentType,
        "Content-Length": String(result.blob.size),
        // 업로드 파일 이름에는 무작위 문자열이 붙어 내용이 바뀌지 않으므로 오래 캐시
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not Found", { status: 404 });
  }
}
