import type { Metadata } from "next";
import { campuses, discipleship, library, serviceGroups } from "@/data/church";
import { Container, MoreLink, PageHero } from "@/components/ui";
import { BookOpenIcon, ClockIcon, MapPinIcon } from "@/components/icons";

export const metadata: Metadata = { title: "예배 및 모임 안내" };

export default function WorshipPage() {
  return (
    <>
      <PageHero
        eyebrow="WORSHIP"
        title="예배 및 모임 안내"
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
                <table className="w-full table-fixed text-left">
                  <thead className="bg-paper text-sm text-muted">
                    <tr>
                      <th scope="col" className="px-5 py-3.5 font-semibold sm:w-[40%] sm:px-6">예배</th>
                      <th scope="col" className="w-36 px-5 py-3.5 text-right font-semibold sm:w-[30%] sm:px-6 sm:text-left">시간</th>
                      <th scope="col" className="hidden px-6 py-3.5 font-semibold sm:table-cell sm:w-[30%]">비고</th>
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

      {/* 제자훈련 · 예꿈도서관 */}
      <section className="border-t border-line py-16 md:py-24">
        <Container>
          <h2 className="font-serif text-2xl font-bold md:text-3xl">제자훈련</h2>
          <p className="mt-2 text-muted">말씀으로 세워지는 제자, 삶으로 전하는 증인을 길러 냅니다.</p>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {discipleship.map((d, i) => (
              <div key={d.level} className="overflow-hidden rounded-2xl border border-line">
                <h3
                  className={`px-6 py-4 text-lg font-bold ${
                    i === 0 ? "bg-brand-50 text-brand-700" : "bg-brand-600 text-white"
                  }`}
                >
                  {d.level}
                </h3>
                <ul className="divide-y divide-line">
                  {d.courses.map((c) => (
                    <li key={c.name} className="flex items-center justify-between px-6 py-3.5">
                      <span className="font-medium text-ink">{c.name}</span>
                      <span className="text-sm font-semibold text-brand-600">{c.period}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl bg-leaf-50 px-6 py-5 md:px-8">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <BookOpenIcon className="text-leaf-700" /> {library.name}
            </h2>
            <p className="font-semibold text-leaf-700 tabular-nums">{library.hours}</p>
          </div>
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
