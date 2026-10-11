import { getStats, kstDay } from "@/lib/stats";

const n = (v: number) => v.toLocaleString("ko-KR");

// 관리자 페이지 접속자 통계: 오늘·누적 방문자, 페이지뷰, 페이지별 조회수
export default async function StatsPanel() {
  const stats = await getStats().catch(() => undefined);

  if (stats === null) {
    return (
      <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm leading-relaxed text-amber-900">
        <p className="font-bold">접속자 통계가 아직 연결되지 않았습니다.</p>
        <p className="mt-1">Vercel 프로젝트 → Storage → Upstash for Redis 를 이 프로젝트에 연결한 뒤 다시 배포해 주세요.</p>
      </div>
    );
  }
  if (!stats) {
    return <p className="rounded-2xl border border-line bg-white p-5 text-sm text-muted">통계를 불러오지 못했습니다. 잠시 후 새로고침해 주세요.</p>;
  }

  const max = Math.max(1, ...stats.pages.map((p) => p.views));
  const cards = [
    { label: "오늘 방문자", value: stats.today.visitors, sub: `오늘 페이지뷰 ${n(stats.today.views)}` },
    { label: "누적 방문자", value: stats.total.visitors, sub: `누적 페이지뷰 ${n(stats.total.views)}` },
  ];

  return (
    <div className="rounded-2xl border border-line bg-white p-6 md:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-xl font-bold">접속자 통계</h2>
        <p className="text-sm text-muted tabular-nums">{kstDay().replaceAll("-", ".")} 기준 · 한국 시간</p>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl bg-brand-50 p-4 md:p-5">
            <dt className="text-sm font-semibold text-brand-700">{c.label}</dt>
            <dd className="mt-1 text-3xl font-bold text-ink tabular-nums md:text-4xl">{n(c.value)}</dd>
            <dd className="mt-1 text-sm text-muted tabular-nums">{c.sub}</dd>
          </div>
        ))}
      </dl>

      <h3 className="mt-8 font-bold">페이지별 조회수 (누적)</h3>
      {stats.pages.length === 0 ? (
        <p className="mt-3 text-sm text-muted">아직 기록이 없습니다.</p>
      ) : (
        <table className="mt-3 w-full table-fixed text-left text-sm">
          <thead className="sr-only">
            <tr>
              <th scope="col">페이지</th>
              <th scope="col">조회수</th>
            </tr>
          </thead>
          <tbody>
            {stats.pages.map((p) => (
              <tr key={p.path} className="border-t border-line">
                <th scope="row" className="w-28 py-2.5 pr-3 font-medium text-ink md:w-36">
                  {p.label}
                </th>
                <td className="py-2.5">
                  <div className="flex items-center gap-3">
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-paper" aria-hidden="true">
                      <div className="h-full rounded-full bg-brand-500" style={{ width: `${(p.views / max) * 100}%` }} />
                    </div>
                    <span className="w-16 text-right font-semibold text-ink tabular-nums">{n(p.views)}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p className="mt-4 text-xs text-muted">같은 사람이 하루에 여러 번 와도 방문자는 1명으로 셉니다. 관리자 페이지 방문과 검색 로봇은 세지 않습니다.</p>
    </div>
  );
}
