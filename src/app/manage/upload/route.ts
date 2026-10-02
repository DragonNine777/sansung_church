import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";

// 브라우저에서 Vercel Blob 으로 직접 올리기 위한 업로드 토큰 발급 (관리자만)
export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;
  // 토큰 발급 요청은 관리자 로그인 확인부터
  if (body.type === "blob.generate-client-token" && !(await isAdmin())) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }
  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        if (!(await isAdmin())) throw new Error("로그인이 필요합니다.");
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"],
          maximumSizeInBytes: 20 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
    });
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
