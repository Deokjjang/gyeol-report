import { ReportCover, ReportContents } from "../../../components/report/ReportReadingFrame";
import styles from "../../../components/report/v3Narrative.module.css";
import type { MajorFortuneV3Draft } from "../../../lib/interpretation-v3/majorFortuneEditorial";
import type { MajorHorizon, HorizonCycle } from "../../../lib/interpretation-v3/majorFortuneHorizon";
import type { Evidence } from "../../../lib/interpretation-v3/types";
import type { SajuCalcResult } from "../../../lib/saju/types";
import type { MajorFortuneEvidencePacket } from "../../../lib/report-knowledge/majorFortuneTypes";
import { buildCanonicalManseRyeokTableData } from "../../../lib/report-tables/manseRyeokTableData";
import { buildMbtiCommonProfileTableData, getMbtiSourceByType } from "../../../lib/report-tables";
import { StoryTables } from "./ComprehensiveReportV3View";

const prose = "break-keep text-[15px] leading-8 text-[#443931] [overflow-wrap:anywhere] sm:text-base";
function Cycle({ cycle, label }: { cycle: HorizonCycle; label: string }) {
  return <div className="min-w-0 space-y-2"><p className="text-xs text-[#756658]">{label}</p><p className="text-2xl font-semibold text-[#6f1d35]">{cycle.ganji}</p><p className="text-sm text-[#756658]">{cycle.tenGod} · {cycle.elements.join("·")}</p><p className="break-keep text-base font-medium [overflow-wrap:anywhere]">{cycle.theme}</p></div>;
}
function Chips({ items }: { items: readonly string[] }) {
  return <p aria-label="해석 근거" className="mt-4 flex flex-wrap gap-2 text-xs text-[#756658]">{items.map(item => <span key={item} className="rounded-full border border-[#ded2c2] px-2 py-1">{item}</span>)}</p>;
}

export function MajorFortuneHorizonView({ draft, horizon, evidencePacket, facts, calculation }: {
  draft: MajorFortuneV3Draft; horizon: MajorHorizon; evidencePacket: MajorFortuneEvidencePacket; facts: readonly Evidence[]; calculation: SajuCalcResult;
}) {
  const outlook = draft.version === "major_fortune_v3.0-editorial.4", futureCount = outlook ? 10 : 6;
  const age = (year: number) => outlook ? draft.editorialYears.find(y => y.year === year)?.ageLabel : undefined;
  const source = getMbtiSourceByType(evidencePacket.mbtiBasis.type), mbti = source ? buildMbtiCommonProfileTableData(source) : undefined;
  const manse = buildCanonicalManseRyeokTableData(evidencePacket, draft.personLabel);
  const contents = [...draft.editorialSections.map(s => ({ id: `horizon-${s.id}`, label: s.title })), { id: "horizon-years", label: `올해와 앞으로 ${futureCount}년` }];
  return <article className={`${styles.edition} min-w-0 rounded-[8px] border border-[#ded2c2] bg-[#fffdf8] text-[#2b211b]`} data-report-version={draft.version}>
    <div className="px-4 sm:px-6"><ReportCover product="대운 전망 리포트" title={draft.title} summary={`최근 3년은 짧게, ${horizon.currentYear}년과 앞으로 ${futureCount}년은 깊게. ${horizon.from}~${horizon.through}년의 변화를 읽습니다.`} /></div>
    <section aria-label={`${draft.personLabel}님의 입력 정보`} className="mx-4 my-6 rounded-sm border border-[#ded2c2] bg-[#f8f3eb] p-4 sm:mx-6">
      <p className="mb-3 text-sm font-semibold text-[#6f1d35]">{draft.personLabel}님의 입력 정보</p><dl className="grid min-w-0 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">{draft.inputSummary.map(r => <div key={r.label} className="flex min-w-0 gap-2"><dt className="shrink-0 text-[#756658]">{r.label} ·</dt><dd className="min-w-0 break-words [overflow-wrap:anywhere]">{r.value}</dd></div>)}</dl>
    </section>
    <section aria-label={outlook ? "최근 3년과 앞으로 10년 타임라인" : "10년 타임라인"} className="mx-4 my-8 sm:mx-6" data-horizon-timeline>
      <p className="text-xs font-semibold tracking-[.16em] text-[#9f7a2d]">{outlook ? "TEN-YEAR OUTLOOK" : "TEN-YEAR TIMELINE"}</p><h2 className="mt-2 font-semibold text-[#6f1d35]">{horizon.from}–{horizon.through}, 지나온 길과 앞으로의 길</h2>
      {horizon.activeCycle ? <p className="mt-3 text-sm text-[#756658]">지금 지나고 있는 대운 · {horizon.activeCycle.ganji} · {horizon.activeCycle.tenGod}</p> : <p className="mt-3 text-sm text-[#756658]">교운 경계는 아래 날짜 범위로 나누어 읽습니다.</p>}
      {outlook ? <p className="mt-3 text-xs text-[#756658]">나이 기준 · 세는나이. 지난 3년 · 올해 · 다음 해부터 10년</p> : null}
      <ol className={`mt-5 grid min-w-0 grid-cols-2 gap-2 ${outlook ? "sm:grid-cols-4 lg:grid-cols-7" : "sm:grid-cols-5"}`}>{horizon.rows.map(row => <li key={row.year} className={`min-w-0 rounded-sm border p-3 ${row.year === horizon.currentYear ? "border-[#6f1d35] bg-[#6f1d35] text-white" : "border-[#ded2c2] bg-[#fffaf1]"}`}>
        <p className="text-[11px] opacity-75">{row.year < horizon.currentYear ? "지난 흐름" : row.year === horizon.currentYear ? "지금" : "앞으로"}</p>
        <a className="inline-block py-2 text-base font-semibold underline-offset-4 hover:underline focus-visible:outline-2" href={`#year-${row.year}`}>{row.year}년{age(row.year) ? ` · ${age(row.year)}` : ""}</a>
        <p className="text-xs leading-5">{row.beforeCycle ? `${row.beforeCycle.ganji} → ` : ""}{row.cycle.ganji} 대운</p>
        {row.transitionDate ? <p className="mt-2 text-[11px]">대운 전환</p> : null}
      </li>)}</ol>
    </section>
    <section aria-label="대운 전환" className="mx-4 space-y-5 sm:mx-6" data-horizon-transition>
      {horizon.transitions.length ? horizon.transitions.map(t => <div key={t.year} className="rounded-sm border border-[#cbb589] bg-[#fbf6ed] p-5 sm:p-7">
        <p className="mb-5 text-xs font-semibold tracking-wider text-[#9f7a2d]">{t.year}년{age(t.year) ? ` · ${age(t.year)}` : ""} · 대운 전환</p>
        <div className="grid min-w-0 items-center gap-5 sm:grid-cols-[1fr_auto_1fr]"><Cycle cycle={t.before} label="전환 전" /><span aria-hidden="true" className="text-xl text-[#9f7a2d]"><span className="sm:hidden">↓</span><span className="hidden sm:inline">→</span></span><Cycle cycle={t.after} label="전환 후" /></div>
        <p className="mt-6 border-t border-[#ded2c2] pt-4 text-xs leading-6 text-[#756658]">전환 기준 · {t.dateLabel}</p>
        <h2 className="mt-7 font-semibold text-[#6f1d35]">{t.title}</h2><div className="mt-5 space-y-5">{t.paragraphs.map((p, i) => <p key={i} className={prose}>{p}</p>)}</div>
      </div>) : <p className={`${prose} rounded-sm border border-[#ded2c2] bg-[#fbf6ed] p-5`}>이 10년 창 안에서는 대운이 바뀌지 않습니다. 같은 흐름을 쌓아가며 해마다 달라지는 기회를 살펴봅니다.</p>}
    </section>
    <section aria-label="운이 이렇게 바뀝니다" className="mx-4 my-9 sm:mx-6"><h2 className="font-semibold text-[#6f1d35]">운이 이렇게 바뀝니다</h2><div className="mt-5 grid min-w-0 gap-3 sm:grid-cols-2">{draft.fortuneSignals?.map(s => <div key={s.title} className="min-w-0 border-l-2 border-[#cbb589] bg-[#fffaf1] p-4"><h3 className="font-semibold text-[#6f1d35]">{s.title}</h3><p className="mt-3 break-keep text-sm leading-7 [overflow-wrap:anywhere]">{s.body}</p></div>)}</div></section>
    <StoryTables facts={facts} calculation={calculation} manse={manse} mbti={mbti} draft={{ opening: [], sections: [] }} compactMbti detailMbti={outlook} />
    <div className="mx-auto max-w-[46rem] px-4 sm:px-6"><ReportContents items={contents} />
      <section className="space-y-5 pb-9" data-major-opening><p className="text-xs font-semibold tracking-[.16em] text-[#9f7a2d]">CURRENT CHAPTER</p><h2 className="font-semibold text-[#6f1d35]">{draft.chapterTitle}</h2>{draft.opening.map((p, i) => <p key={i} className={prose}>{p}</p>)}</section>
      {draft.editorialSections.map(s => <section id={`horizon-${s.id}`} key={s.id} tabIndex={-1} data-reading-section className={`space-y-5 border-t border-[#ded2c2] py-9 ${s.mode === "good-fortune" ? "border-[#cbb589]" : ""}`}>
        <h2 className="font-semibold text-[#6f1d35]">{s.title}</h2><div className={s.mode === "contrast" ? "grid gap-5 sm:grid-cols-2" : s.mode === "scene" ? "space-y-5 border-l-2 border-[#cbb589] pl-4" : "space-y-5"}>{s.paragraphs.map((p, i) => <p key={i} className={prose}>{p}</p>)}</div><Chips items={s.evidence} />
      </section>)}
      <section aria-label="최근 3년 돌아보기" className="border-t border-[#ded2c2] py-9"><p className="text-xs tracking-wider text-[#9f7a2d]">LOOKING BACK</p><h2 className="mt-2 font-semibold text-[#6f1d35]">지금의 나에게 이어진 최근 3년</h2>{draft.editorialYears.filter(y => y.timePosition === "past").map(y => <section key={y.year} id={`year-${y.year}`} tabIndex={-1} className="mt-6 space-y-3"><p className="text-xs font-semibold text-[#9f7a2d]">{y.year}{age(y.year) ? ` · ${age(y.year)}` : ""} · {y.ganji} · {y.tenGod}</p><h3 className="font-semibold">{y.title}</h3>{y.paragraphs.map((p, i) => <p key={i} className={prose}>{p}</p>)}</section>)}</section>
      <section id="horizon-years" tabIndex={-1} className="border-t border-[#ded2c2] py-9"><p className="text-xs tracking-wider text-[#9f7a2d]">NOW & AHEAD</p><h2 className="mt-2 font-semibold text-[#6f1d35]">올해와 앞으로 {futureCount}년, 다른 질문이 기다립니다</h2>{draft.editorialYears.filter(y => y.timePosition !== "past").map(y => <section id={`year-${y.year}`} key={y.year} tabIndex={-1} data-year-position={y.timePosition} className={`mt-8 space-y-5 border-t py-7 ${y.isCurrentYear ? "border-[#6f1d35]" : "border-[#ded2c2]"}`}>
        <p className="text-xs font-semibold tracking-wide text-[#9f7a2d]">{y.isCurrentYear ? "지금" : "앞으로"} · {y.year}{age(y.year) ? ` · ${age(y.year)}` : ""} · {y.ganji} · {y.tenGod}</p><h2 className="font-semibold text-[#6f1d35]">{y.title}</h2>{y.paragraphs.map((p, i) => <p key={i} className={prose}>{p}</p>)}<Chips items={y.evidence} />
      </section>)}</section>
      <section aria-label="이 시간을 지나며 남을 나" className="mb-9 space-y-5 border border-[#cbb589] bg-[#f8f0e5] p-5 sm:p-7" data-major-finale>{draft.finale.map((p, i) => <p key={i} className={i === draft.finale.length - 1 ? "border-t border-[#cbb589] pt-5 text-xl font-semibold leading-relaxed text-[#6f1d35]" : prose}>{p}</p>)}</section>
    </div>
  </article>;
}
