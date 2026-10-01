import type { Metadata } from "next";
import { ministries, social } from "@/data/church";
import { formatDate, getLatestVideos } from "@/lib/youtube";
import { ChannelEmbed, Container, PageHero, VideoCard } from "@/components/ui";
import { ExternalIcon, YoutubeIcon } from "@/components/icons";

export const metadata: Metadata = { title: "설교·영상" };
export const revalidate = 600;

export default async function SermonsPage() {
  const videos = await getLatestVideos(social.youtubeChannelId);
  const [latest, ...rest] = videos;
  const youthYoutube = ministries.flatMap((m) => m.links).find((l) => l.type === "youtube");

  return (
    <>
      <PageHero eyebrow="SERMON" title="설교·영상" description="예배 실황과 설교 말씀을 유튜브 ‘산성의 빛 TV’에서 만나보세요." />

      <section className="py-16 md:py-24">
        <Container>
          {latest ? (
            <>
              <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr] lg:items-center lg:gap-8">
                <div className="-mx-5 aspect-video overflow-hidden bg-ink shadow-lg sm:mx-0 sm:rounded-2xl">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${latest.id}`}
                    title={latest.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    className="h-full w-full"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold tracking-[0.2em] text-brand-600">LATEST</p>
                  <h2 className="mt-2 font-serif text-xl leading-snug font-bold md:text-2xl">{latest.title}</h2>
                  <p className="mt-2 text-muted">{formatDate(latest.published)}</p>
                </div>
              </div>

              <h2 className="mt-12 mb-6 font-serif text-2xl font-bold md:mt-16 md:mb-8">지난 영상</h2>
              <div className="grid gap-5 md:grid-cols-2 md:gap-x-6 md:gap-y-10 lg:grid-cols-3">
                {rest.map((v) => (
                  <VideoCard key={v.id} video={v} />
                ))}
              </div>
            </>
          ) : (
            <ChannelEmbed channelId={social.youtubeChannelId} title="산성의 빛 TV 최근 영상" />
          )}

          <div className="mt-14 flex flex-wrap justify-center gap-3">
            <a
              href={social.youtube}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-brand-600 px-6 font-semibold text-white transition-colors hover:bg-brand-700"
            >
              <YoutubeIcon /> 산성의 빛 TV 채널 <ExternalIcon width={16} height={16} />
            </a>
            {youthYoutube && (
              <a
                href={youthYoutube.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center gap-2 rounded-full border border-line px-6 font-semibold text-ink transition-colors hover:border-brand-200 hover:text-brand-600"
              >
                <YoutubeIcon /> 아델포스 청년회 채널 <ExternalIcon width={16} height={16} />
              </a>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
