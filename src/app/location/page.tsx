import type { Metadata } from "next";
import { campuses, church } from "@/data/church";
import { Container, PageHero } from "@/components/ui";
import { ExternalIcon, MailIcon, MapPinIcon, PhoneIcon } from "@/components/icons";

export const metadata: Metadata = { title: "오시는 길" };

export default function LocationPage() {
  return (
    <>
      <PageHero eyebrow="LOCATION" title="오시는 길" description="성남 성전과 광주 성전, 두 곳에서 예배드립니다." />

      <section className="py-16 md:py-24">
        <Container className="space-y-16">
          {campuses.map((c) => {
            const q = encodeURIComponent(c.address);
            return (
              <article key={c.id} id={c.id} className="grid scroll-mt-28 gap-8 lg:grid-cols-[1fr_1.4fr]">
                <div>
                  <h2 className="font-serif text-3xl font-bold">{c.name}</h2>
                  <dl className="mt-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <dt className="mt-0.5 text-brand-600">
                        <MapPinIcon />
                        <span className="sr-only">주소</span>
                      </dt>
                      <dd className="text-[17px] text-ink">{c.address}</dd>
                    </div>
                    <div className="flex items-center gap-3">
                      <dt className="text-brand-600">
                        <PhoneIcon />
                        <span className="sr-only">전화</span>
                      </dt>
                      <dd>
                        <a href={`tel:${c.phone}`} className="text-[17px] text-ink hover:text-brand-600">
                          {c.phone}
                        </a>
                      </dd>
                    </div>
                  </dl>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <a
                      href={`https://map.naver.com/p/search/${q}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#03C75A] px-5 text-[15px] font-semibold text-white hover:brightness-95"
                    >
                      네이버 지도 <ExternalIcon width={14} height={14} />
                    </a>
                    <a
                      href={`https://map.kakao.com/?q=${q}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#FEE500] px-5 text-[15px] font-semibold text-[#191919] hover:brightness-95"
                    >
                      카카오맵 <ExternalIcon width={14} height={14} />
                    </a>
                  </div>
                </div>
                <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-paper lg:aspect-[16/10]">
                  <iframe
                    src={`https://maps.google.com/maps?q=${q}&hl=ko&z=16&output=embed`}
                    title={`${c.name} 위치 지도`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-full w-full"
                  />
                </div>
              </article>
            );
          })}
        </Container>
      </section>

      <section className="bg-paper py-12">
        <Container>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[17px]">
            <span className="flex items-center gap-3 whitespace-nowrap text-muted">
              <MailIcon className="text-brand-600" /> 이메일 문의
            </span>
            <a href={`mailto:${church.email}`} className="font-semibold break-all text-ink hover:text-brand-600">
              {church.email}
            </a>
          </p>
        </Container>
      </section>
    </>
  );
}
