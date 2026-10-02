import type { Metadata } from "next";
import Image from "next/image";
import { bulletins as staticBulletins, news, social, type Bulletin } from "@/data/church";
import { getPosts } from "@/lib/posts";
import { Container, PageHero } from "@/components/ui";
import BulletinViewer from "@/components/BulletinViewer";
import { ExternalIcon, InstagramIcon } from "@/components/icons";

export const metadata: Metadata = { title: "교회소식" };

export default async function NewsPage() {
  const posts = await getPosts();
  // 관리자 페이지에서 올린 주보가 먼저, 그 다음 data/church.ts 의 주보
  const bulletins: Bulletin[] = [
    ...posts
      .filter((p) => p.kind === "bulletin")
      .map((p) => ({ date: p.date, title: p.title, file: p.file, images: p.images.length ? p.images : undefined })),
    ...staticBulletins,
  ];
  const newsPosts = posts.filter((p) => p.kind === "news");

  return (
    <>
      <PageHero eyebrow="NEWS" title="교회소식 · 주보" description="교회의 소식과 매주 주보를 전해 드립니다." />

      {/* 주보 */}
      <section className="py-16 md:py-24">
        <Container>
          <h2 className="mb-8 font-serif text-2xl font-bold md:text-3xl">주보</h2>
          {bulletins.length > 0 ? (
            <BulletinViewer bulletins={bulletins} />
          ) : (
            <p className="rounded-2xl border border-dashed border-line p-8 text-center text-muted">
              주보가 곧 게시될 예정입니다.
            </p>
          )}
        </Container>
      </section>

      {/* 교회소식 */}
      <section className="border-t border-line bg-paper py-16 md:py-20">
        <Container>
          <h2 className="font-serif text-2xl font-bold md:text-3xl">교회소식</h2>
          {newsPosts.length > 0 && (
            <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {newsPosts.map((p) => (
                <li key={p.id} className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white">
                  {p.images[0] && (
                    <a href={p.images[0]} target="_blank" rel="noreferrer" aria-label={`${p.title} 포스터 크게 보기 (새 창)`}>
                      <Image
                        src={p.images[0]}
                        alt={`${p.title} 포스터`}
                        width={800}
                        height={1100}
                        sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                        className="block h-auto w-full cursor-zoom-in bg-paper"
                      />
                    </a>
                  )}
                  <div className="flex-1 p-5">
                    <p className="text-sm font-medium text-brand-600 tabular-nums">{p.date}</p>
                    <h3 className="mt-1 text-lg font-bold">{p.title}</h3>
                    {p.body && <p className="mt-2 leading-relaxed whitespace-pre-line">{p.body}</p>}
                    {p.images.length > 1 && (
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {p.images.slice(1).map((src, i) => (
                          <li key={src}>
                            <a href={src} target="_blank" rel="noreferrer" className="text-sm font-semibold text-brand-600 hover:underline">
                              이미지 {i + 2} 보기
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
          {news.length > 0 ? (
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {news.map((n) => (
                <li key={n.date + n.title} className="py-6">
                  <p className="text-sm font-medium text-brand-600 tabular-nums">{n.date}</p>
                  <h3 className="mt-1 text-lg font-semibold">{n.title}</h3>
                  <p className="mt-2 leading-relaxed">{n.body}</p>
                </li>
              ))}
            </ul>
          ) : newsPosts.length > 0 ? null : (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-5 rounded-2xl bg-white p-6 md:p-8">
              <p className="leading-relaxed">최근 교회 소식은 공식 인스타그램에서 가장 먼저 전해 드리고 있습니다.</p>
              <a
                href={social.instagram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-brand-600 px-6 font-semibold text-white transition-colors hover:bg-brand-700"
              >
                <InstagramIcon /> @sansunglight_official <ExternalIcon width={16} height={16} />
              </a>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
