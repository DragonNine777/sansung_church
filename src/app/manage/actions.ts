"use server";

import { randomUUID } from "node:crypto";
import { del, put } from "@vercel/blob";
import { revalidatePath, updateTag } from "next/cache";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, adminPath, checkPassword, isAdmin, sessionToken } from "@/lib/admin";
import { getPosts, isUploadPath, POST_PREFIX, POSTS_TAG, type Post, type PostKind } from "@/lib/posts";

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

type Result = { ok: boolean; error?: string };

// 올리기·수정 공통 검사. 통과하면 저장할 값을 돌려줌
function validate(input: NewPost): { error: string } | { data: Omit<Post, "id" | "createdAt"> } {
  const title = input.title.trim();
  const date = input.date.trim();
  if (!title) return { error: "제목을 입력해 주세요." };
  if (!/^\d{4}\.\d{2}\.\d{2}$/.test(date)) return { error: "날짜 형식이 올바르지 않습니다." };
  if (input.kind !== "bulletin" && input.kind !== "news") return { error: "종류가 올바르지 않습니다." };
  const files = [...input.images, ...(input.file ? [input.file] : [])];
  if (!files.every(isUploadPath)) return { error: "업로드한 파일 경로가 올바르지 않습니다." };
  if (input.kind === "bulletin" && files.length === 0) return { error: "주보 이미지나 PDF를 올려 주세요." };
  return {
    data: {
      kind: input.kind,
      title: title.slice(0, 200),
      date,
      body: input.body?.trim().slice(0, 5000) || undefined,
      images: input.images,
      file: input.file,
    },
  };
}

const savePost = (post: Post) =>
  put(`${POST_PREFIX}${post.id}.json`, JSON.stringify(post), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });

export async function createPost(input: NewPost): Promise<Result> {
  if (!(await isAdmin())) return { ok: false, error: "로그인이 필요합니다." };
  const checked = validate(input);
  if ("error" in checked) return { ok: false, error: checked.error };

  const post: Post = {
    id: `${checked.data.date.replaceAll(".", "")}-${randomUUID().slice(0, 8)}`,
    ...checked.data,
    createdAt: new Date().toISOString(),
  };
  await savePost(post);
  refresh();
  return { ok: true };
}

export async function updatePost(id: string, input: NewPost): Promise<Result> {
  if (!(await isAdmin())) return { ok: false, error: "로그인이 필요합니다." };
  const old = (await getPosts()).find((p) => p.id === id);
  if (!old) return { ok: false, error: "글을 찾을 수 없습니다. 새로고침 후 다시 시도해 주세요." };
  const checked = validate(input);
  if ("error" in checked) return { ok: false, error: checked.error };

  const post: Post = { ...old, ...checked.data, updatedAt: new Date().toISOString() };
  await savePost(post);

  // 수정하면서 뺀 파일은 저장소에서도 지움
  const kept = new Set([...post.images, ...(post.file ? [post.file] : [])]);
  const removed = [...old.images, ...(old.file ? [old.file] : [])].filter((f) => !kept.has(f));
  if (removed.length) await del(removed).catch(() => {});
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
