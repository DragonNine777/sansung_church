"use server";

import { randomUUID } from "node:crypto";
import { del, put } from "@vercel/blob";
import { revalidatePath, updateTag } from "next/cache";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, adminPath, checkPassword, isAdmin, sessionToken } from "@/lib/admin";
import { getPosts, isBlobUrl, POST_PREFIX, POSTS_TAG, type Post, type PostKind } from "@/lib/posts";

export type LoginState = { error?: string };

export async function login(_: LoginState, form: FormData): Promise<LoginState> {
  const password = String(form.get("password") ?? "");
  if (!checkPassword(password)) {
    // 무차별 대입을 늦추기 위한 지연
    await new Promise((r) => setTimeout(r, 1000));
    return { error: "비밀번호가 올바르지 않습니다." };
  }
  (await cookies()).set(ADMIN_COOKIE, sessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  revalidatePath(`/${adminPath()}`);
  return {};
}

export async function logout() {
  (await cookies()).delete(ADMIN_COOKIE);
  revalidatePath(`/${adminPath()}`);
}

const refresh = () => {
  updateTag(POSTS_TAG);
  revalidatePath("/news");
  revalidatePath("/");
};

export type NewPost = {
  kind: PostKind;
  title: string;
  date: string;
  body?: string;
  images: string[];
  file?: string;
};

export async function createPost(input: NewPost): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAdmin())) return { ok: false, error: "로그인이 필요합니다." };

  const title = input.title.trim();
  const date = input.date.trim();
  if (!title) return { ok: false, error: "제목을 입력해 주세요." };
  if (!/^\d{4}\.\d{2}\.\d{2}$/.test(date)) return { ok: false, error: "날짜 형식이 올바르지 않습니다." };
  if (input.kind !== "bulletin" && input.kind !== "news") return { ok: false, error: "종류가 올바르지 않습니다." };
  const files = [...input.images, ...(input.file ? [input.file] : [])];
  if (!files.every(isBlobUrl)) return { ok: false, error: "업로드한 파일 주소가 올바르지 않습니다." };
  if (input.kind === "bulletin" && files.length === 0) return { ok: false, error: "주보 이미지나 PDF를 올려 주세요." };

  const post: Post = {
    id: `${date.replaceAll(".", "")}-${randomUUID().slice(0, 8)}`,
    kind: input.kind,
    title: title.slice(0, 200),
    date,
    body: input.body?.trim().slice(0, 5000) || undefined,
    images: input.images,
    file: input.file,
    createdAt: new Date().toISOString(),
  };

  await put(`${POST_PREFIX}${post.id}.json`, JSON.stringify(post), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });
  refresh();
  return { ok: true };
}

export async function deletePost(id: string) {
  if (!(await isAdmin())) return;
  const post = (await getPosts()).find((p) => p.id === id);
  if (!post) return;
  await del([`${POST_PREFIX}${post.id}.json`, ...post.images, ...(post.file ? [post.file] : [])].filter(Boolean));
  refresh();
}
