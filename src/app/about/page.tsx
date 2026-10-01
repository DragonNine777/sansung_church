import type { Metadata } from "next";
import Image from "next/image";
import { church, history, motto, pastor, values } from "@/data/church";
import { Container, PageHero, SectionTitle } from "@/components/ui";

export const metadata: Metadata = { title: "교회소개" };

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="ABOUT" title="교회소개" description={`${church.denomination} 소속, ${church.founded}년에 설립된 교회입니다.`} />

      {/* 인사말 */}
      <section className="py-16 md:py-24">
        <Container className="grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
          <div className="md:self-start">
            <div className="relative mx-auto max-w-xs overflow-hidden rounded-2xl bg-gradient-to-b from-brand-100 to-brand-50 md:max-w-none">
              <Image
                src={pastor.photo}
                alt={`${pastor.name} ${pastor.title}`}
                width={2048}
                height={2048}
                sizes="(min-width: 768px) 400px, 80vw"
                className="translate-y-4"
              />
            </div>
            <p className="mt-5 text-center font-serif text-lg text-ink">
              {pastor.title} <strong className="font-bold">{pastor.name}</strong>
            </p>

            <dl className="mx-auto mt-8 max-w-sm space-y-6 border-t border-line pt-8 md:max-w-none">
              {pastor.profile.map((section) => (
                <div key={section.title}>
                  <dt className="text-sm font-bold tracking-wide text-brand-600">{section.title}</dt>
                  <dd className="mt-2">
                    <ul className="space-y-1.5">
                      {section.items.map((item) => (
                        <li key={item} className="flex gap-2.5 text-[15px] leading-relaxed text-body">
                          <span aria-hidden="true" className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-leaf-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <p className="text-sm font-semibold tracking-[0.2em] text-brand-600">GREETING</p>
            <h2 className="mt-2 font-serif text-2xl leading-snug font-bold md:text-3xl">담임목사 인사말</h2>
            <div className="mt-8 space-y-5 text-[17px] leading-loose">
              {pastor.greeting.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            <ul className="mt-10 space-y-3">
              {values.map((v) => (
                <li key={v.title} className="flex gap-4 rounded-xl bg-paper px-5 py-4">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf-500" aria-hidden="true" />
                  <p className="leading-relaxed">
                    <strong className="block font-semibold text-ink sm:inline">{v.title}</strong>
                    <span className="mx-2 hidden text-line sm:inline" aria-hidden="true">|</span>
                    {v.text}
                  </p>
                </li>
              ))}
            </ul>

          </div>
        </Container>
      </section>

      {/* 비전과 표어 */}
      <section className="bg-brand-700 py-16 text-white md:py-24">
        <Container className="grid gap-12 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] text-brand-200">VISION</p>
            <h2 className="mt-3 font-serif text-2xl leading-snug font-bold text-white md:text-3xl">
              순결한 신부의 세대,
              <br />
              열방을 비추는 산성의 빛
            </h2>
            <p className="mt-5 leading-loose text-white/85">
              그리스도의 십자가 복음을 열방에 전하여 이방의 빛이 되는 것, 이것이 {church.name}가 품은 비전입니다.
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 p-7 md:p-9">
            <p className="text-sm font-semibold tracking-[0.2em] text-brand-200">{motto.year} 표어</p>
            <p className="mt-3 font-serif text-3xl font-bold text-white">{motto.title}</p>
            <p className="mt-2 text-lg text-white/85">{motto.keywords.join(" · ")}</p>
            <blockquote className="mt-6 border-l-2 border-leaf-500 pl-4 leading-loose text-white/85">
              “{motto.verse}”
              <footer className="mt-1 text-sm font-semibold text-white">{motto.reference}</footer>
            </blockquote>
          </div>
        </Container>
      </section>

      {/* 연혁 */}
      <section className="py-16 md:py-24">
        <Container className="max-w-3xl">
          <SectionTitle eyebrow="HISTORY" title="교회 연혁" />
          <ol className="relative border-l-2 border-brand-100 pl-8">
            {history.map((h) => (
              <li key={h.year} className="relative pb-10 last:pb-0">
                <span
                  aria-hidden="true"
                  className="absolute top-1.5 -left-[41px] h-4 w-4 rounded-full border-4 border-white bg-brand-500 shadow"
                />
                <p className="font-serif text-2xl font-bold text-brand-600">{h.year}</p>
                <p className="mt-1 text-lg text-ink">{h.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>
    </>
  );
}
