import type { Metadata } from "next";
import { ministries } from "@/data/church";
import { Container, PageHero } from "@/components/ui";
import { ClockIcon, ExternalIcon, InstagramIcon, YoutubeIcon } from "@/components/icons";

export const metadata: Metadata = { title: "교회학교" };

export default function EducationPage() {
  return (
    <>
      <PageHero
        eyebrow="NEXT GENERATION"
        title="교회학교 · 청년부"
        description="자녀들의 신앙과 교육에 관심과 배려를 가진, 미래를 준비하는 교회입니다."
      />

      <section className="py-16 md:py-24">
        <Container className="space-y-8">
          {ministries.map((m, i) => (
            <article
              key={m.id}
              id={m.id}
              className="grid scroll-mt-28 overflow-hidden rounded-2xl border border-line md:grid-cols-[0.8fr_1.2fr]"
            >
              <div
                className={`flex flex-col justify-center p-8 md:p-10 ${
                  i % 2 === 0 ? "bg-leaf-50" : "bg-brand-50"
                }`}
              >
                <p className={`text-sm font-semibold ${i % 2 === 0 ? "text-leaf-700" : "text-brand-600"}`}>
                  {m.subtitle}
                </p>
                <h2 className="mt-1 font-serif text-3xl font-bold">{m.name}</h2>
                <p className="mt-4 flex items-center gap-2 font-medium text-ink">
                  <ClockIcon width={18} height={18} /> {m.time}
                </p>
              </div>
              <div className="p-8 md:p-10">
                <p className="text-[17px] leading-loose">{m.description}</p>
                <ul className="mt-6 flex flex-wrap gap-3">
                  {m.links.map((l) => (
                    <li key={l.href}>
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-5 text-[15px] font-semibold text-ink transition-colors hover:border-brand-200 hover:text-brand-600"
                      >
                        {l.type === "instagram" ? <InstagramIcon /> : <YoutubeIcon />}
                        {l.label}
                        <ExternalIcon width={14} height={14} className="text-muted" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </Container>
      </section>
    </>
  );
}
