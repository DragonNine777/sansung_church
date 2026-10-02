import { list } from "@vercel/blob";
import { unstable_cache } from "next/cache";

// 관리자 페이지에서 올린 주보·소식. Vercel Blob 의 posts/{id}.json 에 하나씩 저장
export type PostKind = "bulletin" | "news";

export type Post = {
  id: string;
  kind: PostKind;
  title: string;
  date: string; // "2026.10.04"
  body?: string;
  images: string[];
  file?: string; // 주보 PDF
  createdAt: string;
};

export const POSTS_TAG = "posts";
export const POST_PREFIX = "posts/";

// Blob 파일 주소인지 확인 (다른 사이트 주소가 저장되지 않도록)
export const isBlobUrl = (url: string) => {
  try {
    const u = new URL(url);
    return u.protocol === "https:" && u.hostname.endsWith(".public.blob.vercel-storage.com");
  } catch {
    return false;
  }
};

async function readPosts(): Promise<Post[]> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return [];
  try {
    const { blobs } = await list({ prefix: POST_PREFIX, limit: 1000 });
    const files = blobs.filter((b) => b.pathname.endsWith(".json"));
    const posts = await Promise.all(
      files.map(async (b) => {
        const res = await fetch(b.url, { cache: "no-store" });
        return res.ok ? ((await res.json()) as Post) : null;
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
const cachedPosts = unstable_cache(readPosts, ["posts-v1", process.env.BLOB_READ_WRITE_TOKEN ? "on" : "off"], {
  tags: [POSTS_TAG],
  revalidate: 3600,
});

export async function getPosts(kind?: PostKind) {
  const posts = await cachedPosts();
  return kind ? posts.filter((p) => p.kind === kind) : posts;
}
