import type { Metadata } from "next";
import { isAdmin, passwordConfigured } from "@/lib/admin";
import { getPosts, storageConfigured } from "@/lib/posts";
import { logout } from "./actions";
import LoginForm from "./LoginForm";
import PostList from "./PostList";
import UploadForm from "./UploadForm";

export const metadata: Metadata = {
  title: "관리자",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ManagePage() {
  const admin = await isAdmin();
  const storage = storageConfigured();
  const posts = admin && storage ? await getPosts() : [];

  return (
    <section className="min-h-[70vh] bg-paper pt-24 pb-16 md:pt-32">
      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] text-brand-600">ADMIN</p>
            <h1 className="mt-1 font-serif text-3xl font-bold">주보 · 소식 관리</h1>
          </div>
          {admin && passwordConfigured() && (
            <form action={logout}>
              <button type="submit" className="h-11 rounded-lg border border-line bg-white px-4 text-sm font-semibold text-ink hover:border-brand-200">
                로그아웃
              </button>
            </form>
          )}
        </div>

        {!admin ? (
          <LoginForm />
        ) : !storage ? (
          <div role="alert" className="mt-10 rounded-2xl border border-amber-300 bg-amber-50 p-6 leading-relaxed text-amber-900">
            <p className="font-bold">파일 저장소가 아직 연결되지 않았습니다.</p>
            <p className="mt-2">
              Vercel 프로젝트 → Storage → Blob 저장소를 만들어 이 프로젝트에 연결한 뒤 다시 배포해 주세요.
              (BLOB_STORE_ID 가 자동으로 설정됩니다)
            </p>
          </div>
        ) : (
          <>
            <div className="mt-8">
              <UploadForm />
            </div>

            <h2 className="mt-14 mb-4 text-xl font-bold">올린 글 ({posts.length})</h2>
            <PostList posts={posts} />
          </>
        )}
      </div>
    </section>
  );
}
