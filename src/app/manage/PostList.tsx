"use client";

import { useState } from "react";
import { fileUrl } from "@/lib/files";
import type { Post } from "@/lib/posts";
import DeleteButton from "./DeleteButton";
import UploadForm from "./UploadForm";

// 올린 글 목록. '수정'을 누르면 그 자리에서 수정 화면이 열림
export default function PostList({ posts }: { posts: Post[] }) {
  const [editing, setEditing] = useState<string | null>(null);

  if (posts.length === 0) {
    return <p className="rounded-2xl border border-dashed border-line bg-white p-8 text-center text-muted">아직 올린 글이 없습니다.</p>;
  }

  return (
    <ul className="space-y-3">
      {posts.map((p) =>
        editing === p.id ? (
          <li key={p.id}>
            <UploadForm post={p} onDone={() => setEditing(null)} />
          </li>
        ) : (
          <li key={p.id} className="flex items-center gap-4 rounded-xl border border-line bg-white p-3 pr-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-paper">
              {p.images[0] ? (
                // eslint-disable-next-line @next/next/no-img-element -- 관리 화면 작은 미리보기
                <img src={fileUrl(p.images[0])} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full items-center justify-center text-xs font-semibold text-muted">{p.file ? "PDF" : "글"}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-brand-600">
                {p.kind === "bulletin" ? "주보" : "소식"} · <span className="tabular-nums">{p.date}</span>
              </p>
              <p className="truncate font-semibold text-ink">{p.title}</p>
            </div>
            <button
              type="button"
              onClick={() => setEditing(p.id)}
              aria-label={`${p.title} 수정`}
              className="h-10 rounded-lg px-3 text-sm font-semibold text-brand-600 hover:bg-brand-50"
            >
              수정
            </button>
            <DeleteButton id={p.id} title={p.title} />
          </li>
        ),
      )}
    </ul>
  );
}
