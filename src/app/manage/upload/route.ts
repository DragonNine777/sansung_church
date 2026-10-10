import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";

// 관리자 업로드: 파일을 받아 비공개 Blob 저장소에 저장하고 저장 경로를 돌려줌
// (Vercel 함수 요청 한도 4.5MB 때문에 사진은 브라우저에서 미리 줄여서 보냄)
const MAX_BYTES = 4 * 1024 * 1024;
const TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "application/pdf": "pdf",
};

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });

  const form = await request.formData();
  const file = form.get("file");
  const kind = String(form.get("kind") ?? "");
  const date = String(form.get("date") ?? "");
  const index = Number(form.get("index") ?? 1);

  if (!(file instanceof File)) return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
  if (kind !== "bulletin" && kind !== "news") return NextResponse.json({ error: "종류가 올바르지 않습니다." }, { status: 400 });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return NextResponse.json({ error: "날짜가 올바르지 않습니다." }, { status: 400 });
  const ext = TYPES[file.type];
  if (!ext) return NextResponse.json({ error: "JPG, PNG, WEBP, GIF, PDF 파일만 올릴 수 있습니다." }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "파일이 너무 큽니다 (최대 4MB)." }, { status: 400 });

  try {
    const blob = await put(`${kind}/${date}-${Number.isFinite(index) ? index : 1}.${ext}`, file, {
      access: "private",
      contentType: file.type,
      addRandomSuffix: true,
    });
    return NextResponse.json({ pathname: blob.pathname, type: file.type });
  } catch (e) {
    return NextResponse.json({ error: `저장하지 못했습니다: ${(e as Error).message}` }, { status: 500 });
  }
}
