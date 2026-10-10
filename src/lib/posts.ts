import { get, list } from "@vercel/blob";
import { unstable_cache } from "next/cache";

// 관리자 페이지에서 올린 주보·소식. Vercel Blob(비공개 저장소)의 posts/{id}.json 에 하나씩 저장
export type PostKind = "bulletin" | "news";

export type Post = {
  id: string;
  kind: PostKind;
  title: string;
  date: string; // "2026.10.04"
  body?: string;
  images: string[]; // 저장소 경로 (예: "bulletin/2026-10-04-1-abc.jpg")
  file?: string; // 주보 PDF 저장소 경로
  createdAt: string;
  updatedAt?: string;
};

export const POSTS_TAG = "posts";
export const POST_PREFIX = "posts/";

// 업로드 파일이 들어가는 폴더. /files/ 로는 이 폴더의 파일만 보여줌
export const UPLOAD_FOLDERS = ["bulletin/", "news/"] as const;

export const isUploadPath = (pathname: string) =>
  UPLOAD_FOLDERS.some((f) => pathname.startsWith(f)) && !pathname.includes("..") && /^[\w\-./]+$/.test(pathname);

export { fileUrl } from "./files";

// 저장소 연결 여부: 토큰 방식 또는 OIDC 방식(BLOB_STORE_ID)
export const storageConfigured = () => !!(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);

async function readPosts(): Promise<Post[]> {
  if (!storageConfigured()) return [];
  try {
    const { blobs } = await list({ prefix: POST_PREFIX, limit: 1000 });
    const files = blobs.filter((b) => b.pathname.endsWith(".json"));
    const posts = await Promise.all(
      files.map(async (b) => {
        const res = await get(b.pathname, { access: "private", useCache: false });
        if (!res || res.statusCode !== 200) return null;
        return (await new Response(res.stream).json()) as Post;
      }),
    );
    return posts
      .filter((p): p is Post => !!p)
      .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
  } catch {
    return [];
  }
}

// 글을 올리거나 지울 때 updateTag(POSTS_TAG) 로 즉시 갱신. 그 외에는 캐시를 사용해 Blob 호출을 줄임
const cachedPosts = unstable_cache(readPosts, ["posts-v2", storageConfigured() ? "on" : "off"], {
  tags: [POSTS_TAG],
  revalidate: 3600,
});

export async function getPosts(kind?: PostKind) {
  const posts = await cachedPosts();
  return kind ? posts.filter((p) => p.kind === kind) : posts;
}
