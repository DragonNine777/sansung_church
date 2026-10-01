import Image from "next/image";
import Link from "next/link";
import { campuses, church, ministries, motto, pastor, serviceGroups, social } from "@/data/church";
import { getLatestVideos } from "@/lib/youtube";
import { ChannelEmbed, Container, MoreLink, SectionTitle, VideoCard } from "@/components/ui";
import { ArrowRightIcon, ClockIcon, MapPinIcon, PhoneIcon } from "@/components/icons";

export const revalidate = 600;

export default async function Home() {
  const videos = (await getLatestVideos(social.youtubeChannelId)).slice(0, 3);
  const sunday = serviceGroups[0].services;
  const weekday = [...serviceGroups[1].services, ...serviceGroups[2].services];

  return (
    <>
      {/* 메인 비주얼 */}
      <section className="relative isolate flex h-[92svh] max-h-[860px] min-h-[560px] items-end overflow-hidden bg-brand-900">
        <Image
          src="/images/church-exterior.jpg"
          alt="파란 하늘 아래 산성의빛교회 건물 전경"
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-[62%_80%]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-900/90 via-brand-900/45 to-brand-900/10"
        />
        <Container className="w-full pb-16 md:pb-24">
          <div className="max-w-2xl animate-rise text-white">
            <p className="text-sm font-medium tracking-[0.25em] text-white/80">
              SINCE {church.founded}
              <span className="hidden sm:inline"> · {church.nameEn.toUpperCase()}</span>
            </p>
            <h1 className="mt-4 font-serif text-4xl leading-tight font-bold text-white md:text-6xl md:leading-[1.15]">
              열방을 비추는
              <br />
              {church.name}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
              순결한 신부의 세대가 되어 그리스도의 십자가 복음을 전하는 교회,
              <br className="hidden md:block" /> {church.name}에 오신 것을 환영합니다.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/worship"
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 text-[15px] font-semibold text-brand-700 transition-colors hover:bg-brand-50"
              >
                예배 안내 <ArrowRightIcon width={18} height={18} />
              </Link>
              <Link
                href="/location"
                className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/50 px-6 text-[15px] font-semibold text-white transition-colors hover:bg-white/10"
              >
                오시는 길
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* 올해 표어 */}
      <section className="border-b border-line bg-white py-16 md:py-24">
        <Container className="text-center">
          <p className="text-sm font-semibold tracking-[0.25em] text-brand-600">{motto.year} 교회 표어</p>
          <h2 className="mt-4 font-serif text-4xl font-bold md:text-5xl">{motto.title}</h2>
          <ul className="mt-6 flex items-center justify-center gap-3 text-lg font-medium text-leaf-700 md:text-xl">
            {motto.keywords.map((k, i) => (
              <li key={k} className="flex items-center gap-3">
                {i > 0 && <span aria-hidden="true" className="h-1 w-1 rounded-full bg-leaf-500" />}
                {k}
              </li>
            ))}
          </ul>
          <blockquote className="mx-auto mt-8 max-w-2xl text-base leading-loose text-muted md:text-lg">
            “{motto.verse}”
            <footer className="mt-2 text-sm font-semibold text-body">{motto.reference}</footer>
          </blockquote>
        </Container>
      </section>

      {/* 예배 시간 */}
      <section className="bg-paper py-16 md:py-24">
        <Container>
          <SectionTitle eyebrow="WORSHIP" title="예배 안내" action={<MoreLink href="/worship">전체 예배 시간</MoreLink>} />
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl bg-brand-600 p-6 text-white md:p-9">
              <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                <ClockIcon /> 주일예배
              </h3>
              <ul className="mt-6 divide-y divide-white/15">
                {sunday.map((s) => (
                  <li key={s.name} className="flex items-center justify-between py-3.5">
                    <span className="font-medium">
                      {s.name}
                      {s.note && <span className="ml-2 text-sm text-white/70">{s.note}</span>}
                    </span>
                    <span className="text-lg font-semibold tabular-nums">{s.time}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-line bg-white p-6 md:p-9">
              <h3 className="flex items-center gap-2 text-lg font-bold">
                <ClockIcon className="text-brand-600" /> 주중 · 교회학교
              </h3>
              <ul className="mt-6 divide-y divide-line">
                {weekday.map((s) => (
                  <li key={s.name} className="flex items-center justify-between py-3.5">
                    <span className="font-medium text-ink">
                      {s.name}
                      {s.note && <span className="ml-2 text-sm font-normal text-muted">{s.note}</span>}
                    </span>
                    <span className="text-lg font-semibold text-brand-600 tabular-nums">{s.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* 담임목사 인사말 */}
      <section className="overflow-hidden bg-white py-16 md:py-24">
        <Container className="grid items-center gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
          <div className="relative mx-auto w-full max-w-sm">
            <div aria-hidden="true" className="absolute inset-x-4 top-10 bottom-0 rounded-t-full bg-gradient-to-b from-brand-100 to-brand-50" />
            <Image
              src={pastor.photo}
              alt={`${pastor.name} ${pastor.title}`}
              width={2048}
              height={2048}
              sizes="(min-width: 768px) 384px, 90vw"
              className="relative"
            />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] text-brand-600">GREETING</p>
            <h2 className="mt-2 font-serif text-2xl leading-snug font-bold md:text-3xl">
              진리의 말씀으로
              <br />
              세워져 가는 교회
            </h2>
            <p className="mt-6 leading-loose">{pastor.greeting[0]}</p>
            <p className="mt-3 leading-loose">{pastor.greeting[1]}</p>
            <p className="mt-6 font-serif text-lg text-ink">
              {pastor.title} <strong className="font-bold">{pastor.name}</strong>
            </p>
            <div className="mt-6">
              <MoreLink href="/about">인사말 전체 보기</MoreLink>
            </div>
          </div>
        </Container>
      </section>

      {/* 최근 설교·영상 */}
      <section className="bg-paper py-16 md:py-24">
        <Container>
          <SectionTitle eyebrow="SERMON" title="최근 영상" action={<MoreLink href="/sermons">설교·영상 더 보기</MoreLink>} />
          {videos.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-3 md:gap-8">
              {videos.map((v) => (
                <VideoCard key={v.id} video={v} />
              ))}
            </div>
          ) : (
            <ChannelEmbed channelId={social.youtubeChannelId} title="산성의 빛 TV 최근 영상" />
          )}
        </Container>
      </section>

      {/* 다음 세대 공동체 */}
      <section className="bg-white py-16 md:py-24">
        <Container>
          <SectionTitle eyebrow="NEXT GENERATION" title="다음 세대" action={<MoreLink href="/education">교회학교 안내</MoreLink>} />
          <div className="grid gap-5 md:grid-cols-3">
            {ministries.map((m) => (
              <Link
                key={m.id}
                href={`/education#${m.id}`}
                className="group rounded-2xl border border-line p-7 transition-colors hover:border-brand-200 hover:bg-brand-50 md:p-9"
              >
                <p className="text-sm font-semibold text-leaf-700">{m.subtitle}</p>
                <h3 className="mt-1 font-serif text-2xl font-bold group-hover:text-brand-700">{m.name}</h3>
                <p className="mt-3 leading-relaxed">{m.description}</p>
                <p className="mt-5 flex items-center gap-1.5 text-sm font-medium text-muted">
                  <ClockIcon width={16} height={16} /> {m.time}
                </p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* 두 성전 */}
      <section className="bg-brand-50 py-16 md:py-20">
        <Container>
          <SectionTitle eyebrow="LOCATION" title="두 성전에서 함께 예배합니다" action={<MoreLink href="/location">지도 보기</MoreLink>} />
          <div className="grid gap-5 md:grid-cols-2">
            {campuses.map((c) => (
              <div key={c.id} className="rounded-2xl bg-white p-7 shadow-sm md:p-8">
                <h3 className="text-xl font-bold">{c.name}</h3>
                <p className="mt-4 flex items-start gap-2">
                  <MapPinIcon className="mt-0.5 shrink-0 text-brand-600" /> {c.address}
                </p>
                <p className="mt-2 flex items-center gap-2">
                  <PhoneIcon className="shrink-0 text-brand-600" />
                  <a href={`tel:${c.phone}`} className="hover:text-brand-600">
                    {c.phone}
                  </a>
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
