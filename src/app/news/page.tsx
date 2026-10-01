import type { Metadata } from "next";
import { bulletins, news, social } from "@/data/church";
import { Container, PageHero } from "@/components/ui";
import BulletinViewer from "@/components/BulletinViewer";
import { ExternalIcon, InstagramIcon } from "@/components/icons";

export const metadata: Metadata = { title: "교회소식" };

export default function NewsPage() {
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
          ) : (
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
