import type { Metadata } from "next";
import { bulletins, news, social } from "@/data/church";
import { Container, PageHero } from "@/components/ui";
import { ExternalIcon, FileIcon, InstagramIcon } from "@/components/icons";

export const metadata: Metadata = { title: "교회소식" };

export default function NewsPage() {
  return (
    <>
      <PageHero eyebrow="NEWS" title="교회소식 · 주보" description="교회의 소식과 매주 주보를 전해 드립니다." />

      <section className="py-16 md:py-24">
        <Container className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="font-serif text-2xl font-bold">교회소식</h2>
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
              <div className="mt-6 rounded-2xl bg-paper p-8">
                <p className="leading-relaxed">
                  최근 교회 소식은 공식 인스타그램에서 가장 먼저 전해 드리고 있습니다.
                </p>
                <a
                  href={social.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-full bg-brand-600 px-6 font-semibold text-white transition-colors hover:bg-brand-700"
                >
                  <InstagramIcon /> @sansunglight_official <ExternalIcon width={16} height={16} />
                </a>
              </div>
            )}
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold">주보</h2>
            {bulletins.length > 0 ? (
              <ul className="mt-6 space-y-3">
                {bulletins.map((b) => (
                  <li key={b.file}>
                    <a
                      href={b.file}
                      target="_blank"
                      rel="noreferrer"
                      className="flex min-h-14 items-center gap-3 rounded-xl border border-line px-5 py-3 transition-colors hover:border-brand-200 hover:bg-brand-50"
                    >
                      <FileIcon className="shrink-0 text-brand-600" />
                      <span className="flex-1 font-medium text-ink">{b.title}</span>
                      <span className="text-sm text-muted tabular-nums">{b.date}</span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-6 rounded-2xl border border-dashed border-line p-8 text-center text-muted">
                주보가 곧 게시될 예정입니다.
              </p>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
