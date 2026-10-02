"use client";

import { upload } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { createPost } from "./actions";
import type { PostKind } from "@/lib/posts";

const today = () => {
  // 한국 시간 기준 오늘 (YYYY-MM-DD)
  const d = new Date(Date.now() + 9 * 3600 * 1000);
  return d.toISOString().slice(0, 10);
};

const bulletinTitle = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return y ? `${y}년 ${m}월 ${d}일 주일 주보` : "";
};

export default function UploadForm() {
  const router = useRouter();
  const [kind, setKind] = useState<PostKind>("bulletin");
  const [date, setDate] = useState(today);
  const [title, setTitle] = useState("");
  const [titleEdited, setTitleEdited] = useState(false);
  const [body, setBody] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<{ type: "idle" | "busy" | "done" | "error"; message?: string }>({ type: "idle" });

  // 주보 제목은 날짜에 맞춰 자동으로 채움 (직접 고치면 그대로 둠)
  const shownTitle = kind === "bulletin" && !titleEdited ? bulletinTitle(date) : title;

  const previews = useMemo(() => files.map((f) => (f.type.startsWith("image/") ? URL.createObjectURL(f) : "")), [files]);
  useEffect(() => () => previews.forEach((u) => u && URL.revokeObjectURL(u)), [previews]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (kind === "bulletin" && files.length === 0) return setStatus({ type: "error", message: "주보 이미지나 PDF를 선택해 주세요." });
    if (!shownTitle.trim()) return setStatus({ type: "error", message: "제목을 입력해 주세요." });

    try {
      // 업로드 토큰 주소: 현재 관리자 비밀 주소 + /upload
      const base = window.location.pathname.replace(/\/+$/, "");
      const images: string[] = [];
      let file: string | undefined;
      for (const [i, f] of files.entries()) {
        setStatus({ type: "busy", message: `파일 올리는 중… (${i + 1}/${files.length})` });
        const ext = f.name.split(".").pop()?.toLowerCase() || "jpg";
        const blob = await upload(`${kind}/${date}-${i + 1}.${ext}`, f, {
          access: "public",
          handleUploadUrl: `${base}/upload`,
          contentType: f.type,
        });
        if (f.type === "application/pdf") file = blob.url;
        else images.push(blob.url);
      }
      setStatus({ type: "busy", message: "저장하는 중…" });
      const result = await createPost({ kind, title: shownTitle, date: date.replaceAll("-", "."), body, images, file });
      if (!result.ok) return setStatus({ type: "error", message: result.error });
      setStatus({ type: "done", message: "올렸습니다. 교회소식 페이지에 바로 반영됩니다." });
      setFiles([]);
      setBody("");
      setTitle("");
      setTitleEdited(false);
      (e.target as HTMLFormElement).reset();
      router.refresh();
    } catch (err) {
      setStatus({ type: "error", message: `올리지 못했습니다: ${(err as Error).message}` });
    }
  };

  const busy = status.type === "busy";
  const field = "mt-2 block w-full rounded-lg border border-line px-4 text-base focus:border-brand-500";

  return (
    <form onSubmit={onSubmit} className="space-y-6 rounded-2xl border border-line bg-white p-6 md:p-8">
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
                  name="kind"
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
          <label htmlFor="date" className="font-semibold text-ink">
            날짜
          </label>
          <input id="date" type="date" required value={date} onChange={(e) => setDate(e.target.value)} className={`${field} h-12`} />
        </div>
        <div>
          <label htmlFor="title" className="font-semibold text-ink">
            제목
          </label>
          <input
            id="title"
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
          <label htmlFor="body" className="font-semibold text-ink">
            내용 <span className="font-normal text-muted">(선택)</span>
          </label>
          <textarea id="body" rows={5} value={body} onChange={(e) => setBody(e.target.value)} className={`${field} py-3 leading-relaxed`} />
        </div>
      )}

      <div>
        <label htmlFor="files" className="font-semibold text-ink">
          {kind === "bulletin" ? "주보 파일" : "포스터 이미지"}{" "}
          <span className="font-normal text-muted">
            {kind === "bulletin" ? "(JPG 여러 장은 순서대로 선택, 또는 PDF 1개)" : "(선택, 여러 장 가능)"}
          </span>
        </label>
        <input
          id="files"
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
                  {i + 1}. {f.name}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={busy}
          className="h-12 rounded-lg bg-brand-600 px-8 font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
        >
          {busy ? "올리는 중…" : "올리기"}
        </button>
        {status.message && (
          <p
            role={status.type === "error" ? "alert" : "status"}
            className={`text-sm font-medium ${status.type === "error" ? "text-red-700" : status.type === "done" ? "text-leaf-700" : "text-muted"}`}
          >
            {status.message}
          </p>
        )}
      </div>
    </form>
  );
}
