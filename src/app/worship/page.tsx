import type { Metadata } from "next";
import { campuses, serviceGroups } from "@/data/church";
import { Container, MoreLink, PageHero } from "@/components/ui";
import { ClockIcon, MapPinIcon } from "@/components/icons";

export const metadata: Metadata = { title: "예배안내" };

export default function WorshipPage() {
  return (
    <>
      <PageHero
        eyebrow="WORSHIP"
        title="예배안내"
        description="하나님께 드리는 예배의 자리에 여러분을 초대합니다. 처음 오시는 분도 언제든 환영합니다."
      />

      <section className="py-16 md:py-24">
        <Container className="space-y-12">
          {serviceGroups.map((group) => (
            <div key={group.title}>
              <h2 className="flex items-center gap-2 font-serif text-2xl font-bold">
                <ClockIcon className="text-brand-600" width={22} height={22} /> {group.title}
              </h2>
              <div className="mt-5 overflow-x-auto rounded-2xl border border-line">
                <table className="w-full text-left">
                  <thead className="bg-paper text-sm text-muted">
                    <tr>
                      <th scope="col" className="px-5 py-3.5 font-semibold sm:px-6">예배</th>
                      <th scope="col" className="px-5 py-3.5 text-right font-semibold sm:px-6 sm:text-left">시간</th>
                      <th scope="col" className="hidden px-6 py-3.5 font-semibold sm:table-cell">장소</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {group.services.map((s) => (
                      <tr key={s.name}>
                        <th scope="row" className="px-5 py-5 text-[17px] font-semibold text-ink sm:px-6">
                          {s.name}
                          {s.note && <span className="mt-0.5 block text-sm font-normal text-muted sm:hidden">{s.note}</span>}
                        </th>
                        <td className="px-5 py-5 text-right text-[17px] font-semibold whitespace-nowrap text-brand-600 tabular-nums sm:px-6 sm:text-left">
                          {s.time}
                        </td>
                        <td className="hidden px-6 py-5 text-muted sm:table-cell">{s.note ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </Container>
      </section>

      <section className="bg-paper py-14">
        <Container className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-wrap gap-x-10 gap-y-3">
            {campuses.map((c) => (
              <p key={c.id} className="flex items-start gap-2">
                <MapPinIcon className="mt-0.5 shrink-0 text-brand-600" />
                <span>
                  <strong className="font-semibold text-ink">{c.name}</strong> {c.address}
                </span>
              </p>
            ))}
          </div>
          <MoreLink href="/location">오시는 길</MoreLink>
        </Container>
      </section>
    </>
  );
}
