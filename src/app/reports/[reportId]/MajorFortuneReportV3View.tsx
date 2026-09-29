import { ReportCover, ReportContents } from "../../../components/report/ReportReadingFrame";
import { ManseRyeokCommonTable, MbtiCommonProfileTable } from "../../../components/report-tables";
import { isDeepMajorFortuneV3Draft, type MajorFortuneV3Draft, type MajorFortuneV3Section } from "../../../lib/interpretation-v3/majorFortuneEditorial";
import type { Evidence } from "../../../lib/interpretation-v3/types";
import type { MajorFortuneEvidencePacket } from "../../../lib/report-knowledge/majorFortuneTypes";
import type { SajuCalcResult } from "../../../lib/saju/types";
import { buildCanonicalManseRyeokTableData } from "../../../lib/report-tables/manseRyeokTableData";
import { buildMajorFortuneReportManseRyeokTableData, buildMajorFortuneReportMbtiProfileTableData, buildMbtiCommonProfileTableData, getMbtiSourceByType } from "../../../lib/report-tables";
import { StoryTables } from "./ComprehensiveReportV3View";
import { MajorFortuneHorizonView } from "./MajorFortuneHorizonView";

const sectionClass = "space-y-5 border-t border-[#e5dacb] py-10 first:border-t-0";

function EvidenceChips({ labels }: { readonly labels: readonly string[] }) {
  return <div className="flex flex-wrap gap-1.5 pt-1" aria-label="해석 근거">{labels.map(label => <span key={label} className="rounded-full border border-[#ded2c2] bg-[#fffaf1] px-2.5 py-1 text-[11px] text-[#756658]">{label}</span>)}</div>;
}

function Section({ section }: { readonly section: MajorFortuneV3Section }) {
  const kicker = section.mode === "good-fortune" ? "GOOD FORTUNE" : section.mode === "strategy" ? "REALITY CHECK" : section.mode === "contrast" ? "THEN & NOW" : section.mode === "scene" ? "REAL LIFE" : "TEN-YEAR STORY";
  const title = <h2 className="font-serif text-2xl font-semibold leading-snug text-[#6f1d35] sm:text-3xl">{section.title}</h2>;
  if (section.mode === "scene") return <section id={`major-${section.id}`} tabIndex={-1} data-reading-section data-editorial-form="scene" className={sectionClass}>
    <p className="text-xs font-semibold tracking-[0.16em] text-[#9f7a2d]">{kicker}</p>{title}
    <div className="border-l-2 border-[#cbb589] pl-5"><div className="space-y-5">{section.paragraphs.map((paragraph, index) => <p key={index} className={index === 0 ? "font-serif text-[17px] leading-8 text-[#5e3540]" : "break-keep text-[15px] leading-8 text-[#443931] [overflow-wrap:anywhere]"}>{paragraph}</p>)}</div><EvidenceChips labels={section.evidence} /></div>
  </section>;
  if (section.mode === "good-fortune") return <section id={`major-${section.id}`} tabIndex={-1} data-reading-section data-editorial-form="gift" className={sectionClass}>
    <div className="rounded-sm border border-[#cbb589] bg-[#fbf6ed] px-5 py-7"><p className="text-xs font-semibold tracking-[0.16em] text-[#9f7a2d]">{kicker}</p><div className="mt-2">{title}</div><div className="mt-5 space-y-5">{section.paragraphs.map((paragraph, index) => <p key={index} className={index === 0 ? "font-medium leading-8 text-[#6f1d35]" : "break-keep text-[15px] leading-8 text-[#443931]"}>{paragraph}</p>)}</div><EvidenceChips labels={section.evidence} /></div>
  </section>;
  if (section.mode === "strategy") return <section id={`major-${section.id}`} tabIndex={-1} data-reading-section data-editorial-form="tip" className={sectionClass}>
    <p className="text-xs font-semibold tracking-[0.16em] text-[#9f7a2d]">{kicker}</p>{title}<div className="rounded-sm bg-[#f6f0e6] px-5 py-6 space-y-5">{section.paragraphs.map((paragraph, index) => <p key={index} className="break-keep text-[15px] leading-8 text-[#443931]">{paragraph}</p>)}<EvidenceChips labels={section.evidence} /></div>
  </section>;
  return <section id={`major-${section.id}`} tabIndex={-1} data-reading-section data-editorial-form={section.mode} className={sectionClass}>
    <p className="text-xs font-semibold tracking-[0.16em] text-[#9f7a2d]">{kicker}</p>{title}
    <div className={section.mode === "contrast" ? "grid min-w-0 gap-5 sm:grid-cols-2" : "space-y-5"}>{section.paragraphs.map((paragraph, index) => <p key={index} className="break-keep text-[15px] leading-8 text-[#443931] [overflow-wrap:anywhere]">{paragraph}</p>)}</div><EvidenceChips labels={section.evidence} />
  </section>;
}

export function MajorFortuneReportV3View({ draft, evidencePacket }: { readonly draft: MajorFortuneV3Draft; readonly evidencePacket: MajorFortuneEvidencePacket }) {
  const deep = isDeepMajorFortuneV3Draft(draft), extension = (evidencePacket as MajorFortuneEvidencePacket & { majorFortuneV3?: { facts: readonly Evidence[]; calculation: SajuCalcResult } }).majorFortuneV3;
  if (draft.version === "major_fortune_v3.0-editorial.3" && draft.horizon && extension) return <MajorFortuneHorizonView draft={draft} horizon={draft.horizon} evidencePacket={evidencePacket} facts={extension.facts} calculation={extension.calculation} />;
  const source = getMbtiSourceByType(evidencePacket.mbtiBasis.type), commonMbti = source ? buildMbtiCommonProfileTableData(source) : undefined;
  const legacyMbti = buildMajorFortuneReportMbtiProfileTableData(evidencePacket), manse = buildCanonicalManseRyeokTableData(evidencePacket, draft.personLabel);
  const usage = { opening: [], sections: [] };
  const contents = [...draft.editorialSections.map(section => ({ id: `major-${section.id}`, label: section.title })), { id: "major-years", label: "10년, 해마다 달라지는 장면" }, { id: "major-next", label: "다음 대운 미리보기" }];
  const timeLabel = (year: (typeof draft.editorialYears)[number]) => year.timePosition === "past" ? "지난 흐름" : year.timePosition === "future" ? "앞으로" : year.isCurrentYear ? "지금" : "연도";
  return <article className="min-w-0 overflow-hidden rounded-[8px] border border-[#ded2c2] bg-[#fffdf8] text-[#2b211b]" data-report-version={draft.version}>
    <ReportCover product="대운 리포트" title={draft.title} summary={`지금 지나고 있는 ${draft.cycleSummary.yearRangeLabel}을 일·돈·사람·사랑·배움의 실제 장면으로 읽습니다.`} core={draft.chapterTitle} />
    <section aria-label={`${draft.personLabel}님의 입력 정보`} className="mx-4 mb-7 rounded-sm border border-[#ded2c2] bg-[#f8f3eb] px-4 py-4 sm:mx-6">
      <h2 className="mb-3 text-sm font-semibold text-[#6f1d35]">{draft.personLabel}님의 입력 정보</h2><dl className="grid min-w-0 gap-x-6 gap-y-2 text-sm sm:grid-cols-2 lg:grid-cols-4">{draft.inputSummary.map(row => <div key={row.label} className="flex min-w-0 items-baseline gap-2"><dt className="shrink-0 text-[#756658]">{row.label}</dt><dd className="min-w-0 break-words [overflow-wrap:anywhere]"><span aria-hidden="true">· </span>{row.value}</dd></div>)}</dl>
    </section>
    <ReportContents items={contents} />
    {deep && extension ? <StoryTables facts={extension.facts} calculation={extension.calculation} manse={manse} mbti={commonMbti} draft={usage} /> : <section aria-label="계산된 원국과 성향" className="space-y-5 border-b border-[#eadfce] px-4 py-6 sm:px-6"><ManseRyeokCommonTable data={buildMajorFortuneReportManseRyeokTableData(evidencePacket)} defaultOpen={false} />{legacyMbti ? <MbtiCommonProfileTable data={legacyMbti} defaultOpen={false} variant="compact" /> : null}</section>}

    {draft.fortuneSignals?.length ? <section aria-label="이번 10년의 주요 기운" data-major-fortune-signals className="mx-4 my-8 sm:mx-6"><p className="text-xs font-semibold tracking-[0.16em] text-[#9f7a2d]">CURRENT DECADE</p><h2 className="mt-1 text-xl font-semibold">이번 10년에 커지는 힘</h2><div className="mt-4 grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3">{draft.fortuneSignals.map(signal => <article key={signal.title} className={`min-w-0 rounded-sm border p-4 ${signal.tone === "fortune" ? "border-[#cbb589] bg-[#fbf6ed]" : "border-[#ded2c2] bg-[#fffaf1]"}`}><p className="text-xs font-semibold text-[#9f7a2d]">{signal.tone === "fortune" ? "좋은 흐름" : signal.tone === "caution" ? "과해지기 쉬운 힘" : signal.tone === "transition" ? "달라진 점" : signal.tone === "preview" ? "다음 장" : "커지는 힘"}</p><h3 className="mt-2 font-semibold text-[#6f1d35]">{signal.title}</h3><p className="mt-3 text-sm leading-7 text-[#51463c]">{signal.body}</p><EvidenceChips labels={signal.evidence} /></article>)}</div></section> : null}

    <section aria-label="현재 대운" className="mx-4 mb-8 grid gap-3 rounded-sm border border-[#cbb589] bg-[#fbf6ed] p-5 sm:mx-6 sm:grid-cols-3">
      <div><p className="text-xs text-[#756658]">현재 대운</p><p className="mt-1 text-lg font-semibold text-[#6f1d35]">{draft.cycleSummary.ganji} 대운</p></div><div><p className="text-xs text-[#756658]">지금 지나고 있는 기간</p><p className="mt-1 font-semibold">{draft.cycleSummary.yearRangeLabel}</p></div><div><p className="text-xs text-[#756658]">현재 위치</p><p className="mt-1 text-sm leading-6">{draft.cycleSummary.currentPositionLabel}</p></div>
    </section>
    <section aria-label="10년 타임라인" className="mx-4 mb-10 sm:mx-6"><div className="mb-3 flex items-end justify-between gap-3"><div><p className="text-xs font-semibold tracking-[0.16em] text-[#9f7a2d]">TEN-YEAR TIMELINE</p><h2 className="mt-1 text-xl font-semibold">{draft.cycleSummary.yearRangeLabel}</h2></div><p className="text-xs text-[#756658]">지난 흐름 · 지금 · 앞으로</p></div><ol className="grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-5">{draft.editorialYears.map(year => <li key={year.year} className={`min-w-0 rounded-sm border px-3 py-3 ${year.isCurrentYear ? "border-[#6f1d35] bg-[#6f1d35] text-white" : "border-[#ded2c2] bg-[#fffaf1]"}`}><p className="text-[11px] opacity-70">{timeLabel(year)}</p><p className="text-sm font-semibold">{year.year}</p><p className="mt-1 text-xs opacity-80">{year.ganji} · {year.tenGod}</p>{year.ageLabel ? <p className="mt-2 break-words text-[11px] opacity-75">{year.ageLabel}</p> : null}</li>)}</ol></section>

    <div className="mx-auto max-w-[44rem] px-4 sm:px-6"><section className="pb-10" data-major-opening><p className="text-xs font-semibold tracking-[0.16em] text-[#9f7a2d]">CURRENT CHAPTER</p><h2 className="mt-2 font-serif text-3xl font-semibold leading-snug text-[#6f1d35]">{draft.chapterTitle}</h2><div className="mt-7 space-y-5">{draft.opening.map((paragraph, index) => <p key={index} className={index === 1 ? "border-l-2 border-[#cbb589] pl-5 font-serif text-[17px] leading-8 text-[#5e3540]" : "break-keep text-[16px] leading-8 text-[#443931] [overflow-wrap:anywhere]"}>{paragraph}</p>)}</div></section>
      {draft.editorialSections.map(section => <Section key={section.id} section={section} />)}
      <section id="major-years" tabIndex={-1} className={sectionClass}><p className="text-xs font-semibold tracking-[0.16em] text-[#9f7a2d]">YEAR BY YEAR</p><h2 className="font-serif text-3xl font-semibold text-[#6f1d35]">10년의 곡선은 해마다 다른 얼굴을 가집니다</h2><div className="space-y-3">{draft.editorialYears.map(year => <details key={year.year} open={year.isCurrentYear} data-year-position={year.timePosition} className={`rounded-sm border p-4 ${year.isCurrentYear ? "border-[#6f1d35] bg-[#fbf6ed]" : "border-[#ded2c2] bg-[#fffdf8]"}`}><summary className="min-h-11 cursor-pointer list-none pr-2"><span className="text-sm font-semibold text-[#9f7a2d]">{timeLabel(year)} · {year.year} · {year.ganji} · {year.tenGod}</span><h3 className="mt-1 font-serif text-xl font-semibold leading-relaxed text-[#6f1d35]">{year.title}</h3></summary><div className="mt-5 space-y-4 border-t border-[#e5dacb] pt-5">{year.paragraphs.map((paragraph, index) => <p key={index} className={index === 0 ? "font-medium leading-8 text-[#5e3540]" : "break-keep text-[15px] leading-8 text-[#443931] [overflow-wrap:anywhere]"}>{paragraph}</p>)}<EvidenceChips labels={year.evidence} /></div></details>)}</div></section>
      <section id="major-next" tabIndex={-1} className={sectionClass}><p className="text-xs font-semibold tracking-[0.16em] text-[#9f7a2d]">NEXT CYCLE</p><h2 className="font-serif text-3xl font-semibold text-[#6f1d35]">다음 대운 미리보기</h2><div className="space-y-5">{draft.nextChapter.map((paragraph, index) => <p key={index} className="break-keep text-[15px] leading-8 text-[#443931]">{paragraph}</p>)}</div></section>
      <section className="mb-10 rounded-sm border border-[#cbb589] bg-[#f8f0e5] px-5 py-8" data-major-finale>{draft.finale.map((paragraph, index) => <p key={index} className={index === draft.finale.length - 1 ? "mt-6 border-t border-[#cbb589] pt-6 font-serif text-xl font-semibold leading-relaxed text-[#6f1d35] sm:text-2xl" : "mt-4 break-keep text-[16px] leading-8 text-[#443931]"}>{paragraph}</p>)}</section>
    </div>
  </article>;
}
