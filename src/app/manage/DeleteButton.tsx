"use client";

import { useTransition } from "react";
import { deletePost } from "./actions";

export default function DeleteButton({ id, title }: { id: string; title: string }) {
  const [pending, start] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!window.confirm(`"${title}"을(를) 삭제할까요?\n올린 이미지도 함께 지워지며 되돌릴 수 없습니다.`)) return;
        start(() => deletePost(id));
      }}
      className="h-10 rounded-lg px-3 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
      aria-label={`${title} 삭제`}
    >
      {pending ? "삭제 중…" : "삭제"}
    </button>
  );
}
