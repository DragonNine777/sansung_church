"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useState, type FormEvent } from "react";
import { createPost, updatePost } from "./actions";
import { fileUrl } from "@/lib/files";
import type { Post, PostKind } from "@/lib/posts";

const today = () => {
  // 한국 시간 기준 오늘 (YYYY-MM-DD)
  const d = new Date(Date.now() + 9 * 3600 * 1000);
  return d.toISOString().slice(0, 10);
};

const bulletinTitle = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return y ? `${y}년 ${m}월 ${d}일 주일 주보` : "";
};

// 큰 사진은 올리기 전에 줄임 (Vercel 요청 한도 4.5MB). 긴 변 최대 2400px, JPEG 품질 0.88
async function shrink(file: File): Promise<File> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return file;
  const img = await createImageBitmap(file);
  const scale = Math.min(1, 2400 / Math.max(img.width, img.height));
  if (scale === 1 && file.size <= 3.5 * 1024 * 1024) return file;
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.88));
  return blob ? new File([blob], file.name.replace(/\.\w+$/, ".jpg"), { type: "image/jpeg" }) : file;
}

type Props = {
  // 있으면 수정 모드: 기존 글 내용을 채워서 시작
  post?: Post;
  onDone?: () => void;
};

export default function UploadForm({ post, onDone }: Props) {
  const router = useRouter();
  const uid = useId();
  const editing = !!post;
  const [kind, setKind] = useState<PostKind>(post?.kind ?? "bulletin");
  const [date, setDate] = useState(() => (post ? post.date.replaceAll(".", "-") : today()));
  const [title, setTitle] = useState(post?.title ?? "");
  const [titleEdited, setTitleEdited] = useState(editing);
  const [body, setBody] = useState(post?.body ?? "");
  const [keptImages, setKeptImages] = useState<string[]>(post?.images ?? []);
  const [keptFile, setKeptFile] = useState<string | undefined>(post?.file);
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<{ type: "idle" | "busy" | "done" | "error"; message?: string }>({ type: "idle" });

  // 주보 제목은 날짜에 맞춰 자동으로 채움 (직접 고치면 그대로 둠)
  const shownTitle = kind === "bulletin" && !titleEdited ? bulletinTitle(date) : title;

  const previews = useMemo(() => files.map((f) => (f.type.startsWith("image/") ? URL.createObjectURL(f) : "")), [files]);
  useEffect(() => () => previews.forEach((u) => u && URL.revokeObjectURL(u)), [previews]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const total = keptImages.length + (keptFile ? 1 : 0) + files.length;
    if (kind === "bulletin" && total === 0) return setStatus({ type: "error", message: "주보 이미지나 PDF를 선택해 주세요." });
    if (!shownTitle.trim()) return setStatus({ type: "error", message: "제목을 입력해 주세요." });

    try {
      // 업로드 주소: 현재 관리자 비밀 주소 + /upload
      const base = window.location.pathname.replace(/\/+$/, "");
      const images = [...keptImages];
      let file = keptFile;
      for (const [i, original] of files.entries()) {
        setStatus({ type: "busy", message: `파일 올리는 중… (${i + 1}/${files.length})` });
        const f = await shrink(original);
        const payload = new FormData();
        payload.append("file", f);
        payload.append("kind", kind);
        payload.append("date", date);
        payload.append("index", String(images.length + 1));
        const res = await fetch(`${base}/upload`, { method: "POST", body: payload });
        const data = (await res.json().catch(() => ({}))) as { pathname?: string; type?: string; error?: string };
        if (!res.ok || !data.pathname) throw new Error(data.error ?? `오류 ${res.status}`);
        if (data.type === "application/pdf") file = data.pathname;
        else images.push(data.pathname);
      }
      setStatus({ type: "busy", message: "저장하는 중…" });
      const input = {
        kind,
        title: shownTitle,
        date: date.replaceAll("-", "."),
        body: kind === "news" ? body : undefined,
        images,
        file,
      };
      const result = post ? await updatePost(post.id, input) : await createPost(input);
      if (!result.ok) return setStatus({ type: "error", message: result.error });
      router.refresh();
      if (post) return onDone?.();
      setStatus({ type: "done", message: "올렸습니다. 교회소식 페이지에 바로 반영됩니다." });
      setFiles([]);
      setBody("");
      setTitle("");
      setTitleEdited(false);
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setStatus({ type: "error", message: `${editing ? "저장하" : "올리"}지 못했습니다: ${(err as Error).message}` });
    }
  };

  const busy = status.type === "busy";
  const field = "mt-2 block w-full rounded-lg border border-line px-4 text-base focus:border-brand-500";
  const kept = [
    ...keptImages.map((path) => ({ path, pdf: false })),
    ...(keptFile ? [{ path: keptFile, pdf: true }] : []),
  ];

  return (
    <form
      onSubmit={onSubmit}
      aria-label={post ? `${post.title} 수정` : "새 글 올리기"}
      className={`space-y-6 rounded-2xl border bg-white p-6 md:p-8 ${editing ? "border-brand-200 shadow-md" : "border-line"}`}
    >
      {editing && <p className="text-sm font-bold text-brand-600">글 수정</p>}
      <fieldset>
        <legend className="font-semibold text-ink">종류</legend>
        <div className="mt-2 grid grid-cols-2 gap-3">
          {(
            [
              ["bulletin", "주보", "주보 이미지(JPG) 또는 PDF"],
              ["news", "소식 · 포스터", "포스터 이미지와 안내 글"],
            ] as const
          ).map(([value, label, hint]) => (
            <label
              key={value}
              className={`flex cursor-pointer flex-col rounded-xl border px-4 py-3 ${
                kind === value ? "border-brand-500 bg-brand-50" : "border-line"
              }`}
            >
              <span className="flex items-center gap-2 font-semibold text-ink">
                <input
                  type="radio"
                  name={`${uid}-kind`}
                  value={value}
                  checked={kind === value}
                  onChange={() => setKind(value)}
                  className="h-4 w-4 accent-brand-600"
                />
                {label}
              </span>
              <span className="mt-1 text-sm text-muted">{hint}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-6 md:grid-cols-[200px_1fr]">
        <div>
          <label htmlFor={`${uid}-date`} className="font-semibold text-ink">
            날짜
          </label>
          <input
            id={`${uid}-date`}
            data-field="date"
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={`${field} h-12`}
          />
        </div>
        <div>
          <label htmlFor={`${uid}-title`} className="font-semibold text-ink">
            제목
          </label>
          <input
            id={`${uid}-title`}
            data-field="title"
            required
            value={shownTitle}
            onChange={(e) => {
              setTitle(e.target.value);
              setTitleEdited(true);
            }}
            placeholder={kind === "news" ? "예) 2026 생명축제 안내" : ""}
            className={`${field} h-12`}
          />
        </div>
      </div>

      {kind === "news" && (
        <div>
          <label htmlFor={`${uid}-body`} className="font-semibold text-ink">
            내용 <span className="font-normal text-muted">(선택)</span>
          </label>
          <textarea
            id={`${uid}-body`}
            data-field="body"
            rows={5}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className={`${field} py-3 leading-relaxed`}
          />
        </div>
      )}

      {kept.length > 0 && (
        <div>
          <p className="font-semibold text-ink">
            올려둔 파일 <span className="font-normal text-muted">(빼려면 ‘빼기’를 누르세요)</span>
          </p>
          <ul className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {kept.map((k, i) => (
              <li key={k.path} className="overflow-hidden rounded-lg border border-line bg-paper text-xs">
                {k.pdf ? (
                  <div className="flex aspect-[3/4] items-center justify-center font-semibold text-muted">PDF</div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element -- 관리 화면 미리보기
                  <img src={fileUrl(k.path)} alt={`${i + 1}번 파일`} className="aspect-[3/4] w-full object-cover" />
                )}
                <div className="flex items-center justify-between px-2 py-1.5">
                  <span className="text-muted">{i + 1}</span>
                  <button
                    type="button"
                    onClick={() =>
                      k.pdf ? setKeptFile(undefined) : setKeptImages((list) => list.filter((p) => p !== k.path))
                    }
                    className="rounded px-2 py-1 font-semibold text-red-700 hover:bg-red-50"
                    aria-label={`${i + 1}번 파일 빼기`}
                  >
                    빼기
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <label htmlFor={`${uid}-files`} className="font-semibold text-ink">
          {editing ? "파일 추가" : kind === "bulletin" ? "주보 파일" : "포스터 이미지"}{" "}
          <span className="font-normal text-muted">
            {editing
              ? "(새 파일은 올려둔 파일 뒤에 붙습니다)"
              : kind === "bulletin"
                ? "(JPG 여러 장은 순서대로 선택, 또는 PDF 1개)"
                : "(선택, 여러 장 가능)"}
          </span>
        </label>
        <input
          id={`${uid}-files`}
          data-field="files"
          type="file"
          multiple
          accept={kind === "bulletin" ? "image/jpeg,image/png,image/webp,application/pdf" : "image/jpeg,image/png,image/webp,image/gif"}
          onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
          className="mt-2 block w-full text-sm file:mr-4 file:h-11 file:cursor-pointer file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:font-semibold file:text-brand-700"
        />
        {files.length > 0 && (
          <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {files.map((f, i) => (
              <li key={f.name + i} className="overflow-hidden rounded-lg border border-line bg-paper text-xs">
                {previews[i] ? (
                  // eslint-disable-next-line @next/next/no-img-element -- 업로드 전 로컬 미리보기
                  <img src={previews[i]} alt="" className="aspect-[3/4] w-full object-cover" />
                ) : (
                  <div className="flex aspect-[3/4] items-center justify-center font-semibold text-muted">PDF</div>
                )}
                <p className="truncate px-2 py-1.5 text-muted">
                  {kept.length + i + 1}. {f.name}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={busy}
          className="h-12 rounded-lg bg-brand-600 px-8 font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
        >
          {busy ? (editing ? "저장하는 중…" : "올리는 중…") : editing ? "수정 저장" : "올리기"}
        </button>
        {editing && (
          <button
            type="button"
            disabled={busy}
            onClick={onDone}
            className="h-12 rounded-lg border border-line px-6 font-semibold text-ink hover:border-brand-200 disabled:opacity-50"
          >
            취소
          </button>
        )}
        {status.message && (
          <p
            role={status.type === "error" ? "alert" : "status"}
            className={`text-sm font-medium ${
              status.type === "error" ? "text-red-700" : status.type === "done" ? "text-leaf-700" : "text-muted"
            }`}
          >
            {status.message}
          </p>
        )}
      </div>
    </form>
  );
}
