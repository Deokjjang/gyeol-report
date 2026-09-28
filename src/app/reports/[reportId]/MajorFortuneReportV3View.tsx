import { ReportCover, ReportContents } from "../../../components/report/ReportReadingFrame";
import { ManseRyeokCommonTable, MbtiCommonProfileTable } from "../../../components/report-tables";
import type { MajorFortuneV3Draft, MajorFortuneV3Section } from "../../../lib/interpretation-v3/majorFortuneEditorial";
import type { MajorFortuneEvidencePacket } from "../../../lib/report-knowledge/majorFortuneTypes";
import { buildMajorFortuneReportManseRyeokTableData, buildMajorFortuneReportMbtiProfileTableData } from "../../../lib/report-tables";

const sectionClass = "space-y-5 border-t border-[#e5dacb] py-10 first:border-t-0";

function Section({ section }: { readonly section: MajorFortuneV3Section }) {
  const special = section.mode === "good-fortune" || section.mode === "contrast";
  return <section id={`major-${section.id}`} tabIndex={-1} data-reading-section className={sectionClass}>
    <p className="text-xs font-semibold tracking-[0.16em] text-[#9f7a2d]">{section.mode === "good-fortune" ? "GOOD FORTUNE" : section.mode === "strategy" ? "REALITY CHECK" : "TEN-YEAR STORY"}</p>
    <h2 className="font-serif text-2xl font-semibold leading-snug text-[#6f1d35] sm:text-3xl">{section.title}</h2>
    <div className={special ? "rounded-sm border border-[#ded2c2] bg-[#fbf6ed] px-5 py-6" : "space-y-5"}>
      {section.paragraphs.map((paragraph, index) => <p key={index} className="break-keep text-[15px] leading-8 text-[#443931] [overflow-wrap:anywhere]">{paragraph}</p>)}
      <p className="pt-1 text-xs leading-6 text-[#8b796a]">{section.evidence.join(" · ")}</p>
    </div>
  </section>;
}

export function MajorFortuneReportV3View({ draft, evidencePacket }: { readonly draft: MajorFortuneV3Draft; readonly evidencePacket: MajorFortuneEvidencePacket }) {
  const mbti = buildMajorFortuneReportMbtiProfileTableData(evidencePacket);
  const contents = [
    ...draft.editorialSections.map(section => ({ id: `major-${section.id}`, label: section.title })),
    { id: "major-years", label: "10년, 해마다 달라지는 장면" },
    { id: "major-next", label: "다음 대운으로 가져갈 것" },
  ];
  return <article className="min-w-0 overflow-hidden rounded-[8px] border border-[#ded2c2] bg-[#fffdf8] text-[#2b211b]" data-report-version={draft.version}>
    <ReportCover product="대운 리포트" title={draft.title} summary="한 사람의 다음 10년을 일·돈·관계·사랑·배움의 실제 장면으로 읽습니다." core={draft.chapterTitle} />

    <section aria-label={`${draft.personLabel}님의 입력 정보`} className="mx-4 mb-8 rounded-sm border border-[#ded2c2] bg-[#f8f3eb] px-4 py-4 sm:mx-6">
      <h2 className="mb-3 text-sm font-semibold text-[#6f1d35]">{draft.personLabel}님의 입력 정보</h2>
      <dl className="grid min-w-0 gap-x-6 gap-y-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
        {draft.inputSummary.map(row => <div key={row.label} className="flex min-w-0 items-baseline gap-2"><dt className="shrink-0 text-[#756658]">{row.label}</dt><dd className="min-w-0 break-words [overflow-wrap:anywhere]"><span aria-hidden="true">· </span>{row.value}</dd></div>)}
      </dl>
    </section>

    <section aria-label="10년 타임라인" className="mx-4 mb-8 sm:mx-6">
      <div className="mb-3 flex items-end justify-between gap-3"><div><p className="text-xs font-semibold tracking-[0.16em] text-[#9f7a2d]">TEN-YEAR TIMELINE</p><h2 className="mt-1 text-xl font-semibold">{draft.cycleSummary.yearRangeLabel}</h2></div><p className="text-xs text-[#756658]">현재 연도는 와인색으로 표시</p></div>
      <ol className="grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-5">
        {draft.editorialYears.map(year => <li key={year.year} className={`min-w-0 rounded-sm border px-3 py-3 ${year.isCurrentYear ? "border-[#6f1d35] bg-[#6f1d35] text-white" : "border-[#ded2c2] bg-[#fffaf1]"}`}>
          <p className="text-sm font-semibold">{year.year}</p><p className="mt-1 text-xs opacity-80">{year.ganji} · {year.tenGod}</p>{year.ageLabel ? <p className="mt-2 break-words text-[11px] opacity-75">{year.ageLabel}</p> : null}
        </li>)}
      </ol>
    </section>

    <section aria-label="현재 대운" className="mx-4 mb-10 grid gap-3 rounded-sm border border-[#cbb589] bg-[#fbf6ed] p-5 sm:mx-6 sm:grid-cols-3">
      <div><p className="text-xs text-[#756658]">현재 대운</p><p className="mt-1 text-lg font-semibold text-[#6f1d35]">{draft.cycleSummary.ganji} 대운</p></div>
      <div><p className="text-xs text-[#756658]">나이 구간</p><p className="mt-1 font-semibold">{draft.cycleSummary.ageRangeLabel}</p></div>
      <div><p className="text-xs text-[#756658]">현재 위치</p><p className="mt-1 text-sm leading-6">{draft.cycleSummary.currentPositionLabel}</p></div>
    </section>

    <div className="mx-auto max-w-[44rem] px-4 sm:px-6">
      <section className="pb-10" data-major-opening>
        <p className="text-xs font-semibold tracking-[0.16em] text-[#9f7a2d]">YOUR NEXT CHAPTER</p>
        <h2 className="mt-2 font-serif text-3xl font-semibold leading-snug text-[#6f1d35]">{draft.chapterTitle}</h2>
        <div className="mt-7 space-y-5">{draft.opening.map((paragraph, index) => <p key={index} className="break-keep text-[16px] leading-8 text-[#443931] [overflow-wrap:anywhere]">{paragraph}</p>)}</div>
      </section>
    </div>

    <ReportContents items={contents} />

    <section aria-label="해석 근거" className="mx-4 mb-12 space-y-4 sm:mx-6">
      <h2 className="text-xl font-semibold">계산표와 주요 기운</h2>
      <p className="text-sm leading-7 text-[#756658]">본문의 숫자와 간지는 기존 만세력·대운 계산 결과를 그대로 사용합니다. 자세한 표는 필요할 때 펼쳐 보세요.</p>
      <ManseRyeokCommonTable data={buildMajorFortuneReportManseRyeokTableData(evidencePacket)} defaultOpen={false} />
      <details className="rounded-lg border border-[#ded2c2] bg-[#fffaf1] p-4">
        <summary className="min-h-11 cursor-pointer font-semibold text-[#6f1d35]">이번 10년의 주요 기운 펼치기</summary>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">{draft.keySignals.map(signal => <div key={`${signal.title}-${signal.evidenceLabel}`} className="rounded-sm border border-[#eadfce] bg-white p-4"><h3 className="font-semibold">{signal.title}</h3><p className="mt-2 text-sm leading-7 text-[#51463c]">{signal.body}</p><p className="mt-2 text-xs text-[#8b796a]">{signal.evidenceLabel}</p></div>)}</div>
      </details>
      {mbti ? <MbtiCommonProfileTable data={mbti} defaultOpen={false} variant="compact" /> : <div className="rounded-lg border border-[#ded2c2] bg-[#fffaf1] p-4"><h3 className="font-semibold">MBTI · 모름</h3><p className="mt-2 text-sm leading-7 text-[#756658]">유형을 추정하지 않고 명리 흐름과 입력한 생활 맥락만으로 읽었습니다.</p></div>}
    </section>

    <div className="mx-auto max-w-[44rem] px-4 sm:px-6">
      {draft.editorialSections.map(section => <Section key={section.id} section={section} />)}
      <section id="major-years" tabIndex={-1} className={sectionClass}>
        <p className="text-xs font-semibold tracking-[0.16em] text-[#9f7a2d]">YEAR BY YEAR</p><h2 className="font-serif text-3xl font-semibold text-[#6f1d35]">10년, 같은 운 안에서도 장면은 해마다 달라집니다</h2>
        <div className="space-y-3">{draft.editorialYears.map(year => <details key={year.year} open={year.isCurrentYear} className={`rounded-sm border p-4 ${year.isCurrentYear ? "border-[#6f1d35] bg-[#fbf6ed]" : "border-[#ded2c2] bg-[#fffdf8]"}`}>
          <summary className="min-h-11 cursor-pointer list-none pr-2"><span className="text-sm font-semibold text-[#9f7a2d]">{year.year} · {year.ganji} · {year.tenGod}{year.isCurrentYear ? " · 올해" : ""}</span><h3 className="mt-1 font-serif text-xl font-semibold leading-relaxed text-[#6f1d35]">{year.title}</h3></summary>
          <div className="mt-5 space-y-4 border-t border-[#e5dacb] pt-5">{year.paragraphs.map((paragraph, index) => <p key={index} className="break-keep text-[15px] leading-8 text-[#443931] [overflow-wrap:anywhere]">{paragraph}</p>)}<p className="text-xs text-[#8b796a]">{year.evidence.join(" · ")}</p></div>
        </details>)}</div>
      </section>
      <section id="major-next" tabIndex={-1} className={sectionClass}><p className="text-xs font-semibold tracking-[0.16em] text-[#9f7a2d]">NEXT CYCLE</p><h2 className="font-serif text-3xl font-semibold text-[#6f1d35]">다음 대운으로 가져갈 것</h2><div className="space-y-5">{draft.nextChapter.map((paragraph, index) => <p key={index} className="break-keep text-[15px] leading-8 text-[#443931]">{paragraph}</p>)}</div></section>
      <section className="mb-10 rounded-sm border border-[#cbb589] bg-[#f8f0e5] px-5 py-8" data-major-finale>{draft.finale.map((paragraph, index) => <p key={index} className={index === draft.finale.length - 1 ? "mt-6 border-t border-[#cbb589] pt-6 font-serif text-xl font-semibold leading-relaxed text-[#6f1d35] sm:text-2xl" : "mt-4 break-keep text-[16px] leading-8 text-[#443931]"}>{paragraph}</p>)}</section>
    </div>
  </article>;
}
