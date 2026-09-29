import { ReportCover, ReportContents } from "../../../components/report/ReportReadingFrame";
import { buildAnnualV3, annualTime, type AnnualV3Draft, type AnnualBlock } from "../../../lib/interpretation-v3/annualEditorial";
import type { AnnualV3Evidence } from "../../../lib/report-generation/annualV3Generation";
import type { AnnualFortuneReportDraft } from "../../../lib/report-generation/annualFortuneReportDraftTypes";
import { annualRelationLabel } from "../../../lib/report-knowledge/annualFortuneReading";
import { buildCanonicalManseRyeokTableData } from "../../../lib/report-tables/manseRyeokTableData";
import { getMbtiSourceByType, buildMbtiCommonProfileTableData } from "../../../lib/report-tables";
import { StoryTables } from "./ComprehensiveReportV3View";

const period = (start: string, end: string) => `${start.slice(5, 19).replace("T", " ")} ~ ${end.slice(5, 19).replace("T", " ")} 전`;
const timeLabel = { past: "돌아보기", current: "지금", future: "앞으로" };
const elementColor = { wood: "#35734d", fire: "#ad453b", earth: "#89692a", metal: "#696979", water: "#365e83" };
function Prose({ paragraphs }: { paragraphs: readonly string[] }) {
  return <div className="space-y-5">{paragraphs.map((p, i) => <p key={i} className="break-keep text-[16px] leading-8 text-[#443931] [overflow-wrap:anywhere]">{p}</p>)}</div>;
}
function Chips({ labels }: { labels: readonly string[] }) {
  return <div className="mt-5 flex flex-wrap gap-1.5" aria-label="해석 근거">{labels.slice(0, 3).map(label => <span key={label} className="max-w-full break-words rounded-full border border-[#ded2c2] px-3 py-1 text-xs text-[#756658]">{label}</span>)}{labels.length > 3 ? <details className="w-full text-xs leading-6 text-[#756658]"><summary className="cursor-pointer py-2">근거 더 보기</summary>{labels.slice(3).map(label => <p key={label}>{label}</p>)}</details> : null}</div>;
}
function Block({ block }: { block: AnnualBlock }) {
  return <section id={`annual-${block.id}`} data-editorial-form={block.form} className="scroll-mt-5 border-t border-[#e5dacb] py-10">
    <h2 className="mb-6 font-sans text-2xl font-semibold leading-snug text-[#6f1d35] sm:text-3xl">{block.title}</h2>
    <div className={block.form === "scene" ? "border-l-2 border-[#cbb589] pl-5" : block.form === "gift" ? "rounded-sm bg-[#fbf5eb] p-5" : ""}><Prose paragraphs={block.paragraphs} /></div><Chips labels={block.labels} />
  </section>;
}

export function AnnualFortuneReportV3View({ draft: saved, evidencePacket: packet, now = new Date() }: { draft: AnnualV3Draft; evidencePacket: AnnualV3Evidence; now?: Date }) {
  const extension = packet.annualV3;
  // Keep stored facts frozen; only temporal realization uses the server clock.
  // No browser-local date and no recalculation of pillars/Jie on a read route.
  const draft = buildAnnualV3({ ...saved, version: "v1", productVersion: "v1" } as AnnualFortuneReportDraft, packet, extension.monthly, extension.facts, now);
  const current = packet.calendarMonths?.flatMap(m => m.segments).find(s => annualTime(s.startKst, s.endKstExclusive, draft.evaluatedAtKst) === "current");
  const source = getMbtiSourceByType(packet.mbtiBasis.type), mbti = source ? buildMbtiCommonProfileTableData(source) : undefined;
  const manse = buildCanonicalManseRyeokTableData(packet, draft.personLabel);
  return <article className="min-w-0 rounded-lg border border-[#ded2c2] bg-[#fffdf8] font-sans text-[#2b211b]" data-report-version={draft.version}>
    <ReportCover product="세운 리포트" title={draft.title} summary="한 해의 나, 그리고 열두 달의 서로 다른 장면" />
    <section className="mx-4 mb-6 rounded-sm border border-[#ded2c2] bg-[#f8f3eb] p-4 sm:mx-6" aria-label={`${draft.personLabel}님의 입력 정보`}>
      <h2 className="mb-3 text-sm font-semibold text-[#6f1d35]">{draft.personLabel}님의 입력 정보</h2><dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">{draft.inputSummary.map(row => <div key={row.label} className="flex min-w-0 gap-2"><dt className="shrink-0 text-[#756658]">{row.label}</dt><dd className="break-words [overflow-wrap:anywhere]">· {row.value}</dd></div>)}</dl>
    </section>
    <section aria-label="한 해의 스포일러" className="mx-4 border-y border-[#cbb589] py-7 sm:mx-6"><p className="text-xs font-semibold tracking-widest text-[#9f7a2d]">YEAR SPOILER</p><h2 className="mt-3 font-sans text-2xl font-semibold leading-snug text-[#6f1d35] sm:text-3xl">{draft.hook}</h2><p className="mt-4 text-sm leading-7 text-[#756658]">{draft.spoiler}</p></section>
    <section aria-label="세운과 대운" className="mx-4 my-6 grid gap-4 rounded-sm bg-[#f8f3eb] p-5 sm:mx-6 sm:grid-cols-2"><div><p className="text-xs text-[#756658]">선택한 한 해</p><p className="mt-2 font-semibold">{packet.selectedYear}년 {packet.annualFortune.ganji} · {packet.annualFortune.stemTenGod}·{packet.annualFortune.branchTenGod}</p></div><div><p className="text-xs text-[#756658]">{current ? "현재 구간의 대운" : "선택 연도의 대운"}</p><p className="mt-2 font-semibold">{current ? [...(current.activeDayunContext.includesBeforeFirstCycle ? ["첫 대운 시작 전"] : []), ...current.activeDayunContext.cycles.map(c => `${c.ganji} 대운`)].join(" / ") : packet.currentMajorFortune?.ganji ? `${packet.currentMajorFortune.ganji} 대운` : "첫 대운 시작 전"}</p>{current?.uncertainty.length ? <p className="mt-2 text-xs leading-6">교운 시각 범위에 걸쳐 두 배경을 함께 살펴봅니다.</p> : null}</div></section>
    <section className="mx-4 mb-10 sm:mx-6" aria-label="12개월 월운표">
      <h2 className="font-sans text-xl font-semibold text-[#6f1d35]">열두 달, 달라지는 기운</h2><p className="mt-2 text-xs leading-6 text-[#756658]">절입 전·후 구간을 구분합니다. 한국 시간 {draft.evaluatedAtKst.slice(0, 16).replace("T", " ")} 기준.</p>
      {[0, 6].map(start => <div key={start} className="mt-5"><h3 className="mb-3 text-sm font-semibold text-[#9f7a2d]">{start + 1}월 — {start + 6}월</h3><ol className="grid min-w-0 grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">{packet.calendarMonths?.slice(start, start + 6).map(month => {
        const extended = extension.monthly.months.find(m => m.month === month.month)!;
        const actual = month.segments.find(s => annualTime(s.startKst, s.endKstExclusive, draft.evaluatedAtKst) === "current");
        const time = annualTime(month.startKst, month.endKstExclusive, draft.evaluatedAtKst);
        return <li key={month.month} className={`min-w-0 rounded-sm border p-3 ${actual ? "border-[#6f1d35] bg-[#f7ecee]" : "border-[#ded2c2] bg-[#fffaf1]"}`}>
          <a href={`#annual-month-${month.month}`} className="flex min-h-11 items-center justify-between gap-2 text-sm font-semibold text-[#6f1d35]"><span>{month.month}월</span><span className="text-xs">{timeLabel[time]}</span></a>
          {month.segments.map(s => { const ext = extended.segments.find(e => e.startKst === s.startKst)!; const isCurrent = s === actual;
            const markers = [...new Set(ext.features.filter(f => f.kind === "shinsal" || f.kind === "noble").map(f => f.label))];
            return <div key={s.startKst} className="border-t border-[#e5dacb] pt-3 pb-2" data-current-jie={isCurrent || undefined}>
              <p className="text-[11px] leading-5 text-[#756658]">{s.startKst.slice(5, 10)}부터</p><p className="mt-1 text-xl font-semibold" style={{ color: elementColor[s.elements[0]] }}>{ext.ganji} {isCurrent ? <span className="text-xs text-[#6f1d35]">지금</span> : null}</p><p className="mt-1 text-xs leading-6">{s.stemTenGod}·{s.branchTenGod}</p>
              <p className="text-xs leading-6">십이운성 · {ext.features.find(f => f.kind === "lifeStage")?.label ?? "미확인"}</p><p className="mt-2 break-keep text-[11px] leading-5 text-[#756658]">{markers.join(" · ") || "확인된 신살·귀인 없음"}</p>
              <details className="mt-2 text-[11px] leading-5 text-[#756658]"><summary className="min-h-8 cursor-pointer py-1">관계·절입 기준</summary><p className="mt-2 break-words">{period(s.startKst, s.endKstExclusive)}</p><p className="mt-2">유효 연주 · {s.effectiveAnnualPillar.stem}{s.effectiveAnnualPillar.branch}</p><p className="mt-1">대운 · {[...(s.activeDayunContext.includesBeforeFirstCycle ? ["시작 전"] : []), ...s.activeDayunContext.cycles.map(c => c.ganji)].join(" / ")}{s.activeDayunContext.status === "transition_uncertain" ? " (전환 범위)" : ""}</p>{s.relationFacts.filter(f => f.source !== "month_natal_element").map((f, index) => <p className="mt-2" key={index}>{annualRelationLabel(f)}</p>)}{ext.features.filter(f => f.kind === "relation").map((f, index) => <p key={index} className="mt-2">{f.label} · 원국 {({ year: "연지", month: "월지", day: "일지", hour: "시지" } as Record<string, string>)[f.basis.anchor.split(".")[1]]}</p>)}</details>
            </div>;
          })}</li>;
      })}</ol></div>)}
    </section>
    <StoryTables facts={extension.facts} calculation={extension.calculation} manse={manse} mbti={mbti} draft={{ opening: [], sections: [] }} compactMbti detailMbti />
    <ReportContents items={[...draft.annualSections.map(s => ({ id: `annual-${s.id}`, label: s.title })), { id: "annual-months", label: "열두 달의 이야기" }, { id: "annual-finale", label: "올해를 잘 쓰는 핵심" }]} />
    <div className="mx-auto max-w-[46rem] px-4 sm:px-6"><section data-annual-opening className="py-10"><h2 className="mb-7 font-sans text-3xl font-semibold leading-snug text-[#6f1d35]">{draft.hook}</h2><Prose paragraphs={draft.opening} /></section>
      {draft.annualSections.map(block => <Block key={block.id} block={block} />)}
      <section aria-label="눈여겨볼 달" className="border-y border-[#cbb589] py-7"><h2 className="font-sans text-xl font-semibold text-[#6f1d35]">이 장면은 한 번 더 기억해두세요</h2><ul className="mt-5 space-y-4">{draft.focusMonths.map(m => <li key={m.month}><a className="font-medium text-[#6f1d35]" href={`#annual-month-${m.month}`}>{m.month}월 · {m.title}</a><p className="mt-1 text-xs leading-6 text-[#756658]">{m.reason}</p></li>)}</ul></section>
      <section id="annual-months" className="py-10"><h2 className="mb-6 font-sans text-3xl font-semibold text-[#6f1d35]">열두 달의 이야기</h2><div className="space-y-4">{draft.editorialMonths.map(month => <details id={`annual-month-${month.month}`} key={month.month} open={month.timePosition === "current"} data-month-position={month.timePosition} className={`scroll-mt-5 rounded-sm border p-5 ${month.timePosition === "current" ? "border-[#6f1d35] bg-[#fbf5eb]" : "border-[#ded2c2]"}`}>
        <summary className="cursor-pointer"><span className="text-xs font-semibold text-[#9f7a2d]">{month.month}월 · {timeLabel[month.timePosition]}</span><h3 className="mt-2 font-sans text-xl font-semibold leading-relaxed text-[#6f1d35]">{month.title}</h3></summary>
        <div className="mt-6 border-t border-[#e5dacb] pt-5"><p className="mb-5 text-xs leading-6 text-[#756658]">{period(month.focusStartKst, month.focusEndKstExclusive)}</p><Prose paragraphs={month.paragraphs} /><Chips labels={month.labels} />{month.segments.map(s => <section key={s.startKst} className="mt-7 border-t border-[#e5dacb] pt-5"><h4 className="mb-4 text-sm font-semibold text-[#6f1d35]">같은 달의 다른 구간 · {s.ganji}</h4><p className="mb-4 text-xs leading-6 text-[#756658]">{period(s.startKst, s.endKstExclusive)}</p><Prose paragraphs={s.paragraphs} /><Chips labels={s.labels} /></section>)}</div>
      </details>)}</div></section>
      <section id="annual-finale" className="mb-10 rounded-sm border border-[#cbb589] bg-[#f8f0e5] p-6" data-annual-finale><h2 className="mb-7 font-sans text-2xl font-semibold text-[#6f1d35]">올해를 잘 쓰는 핵심</h2><Prose paragraphs={draft.finale.slice(0, -1)} /><p className="mt-7 border-t border-[#cbb589] pt-6 font-sans text-xl font-semibold leading-9 text-[#6f1d35]">{draft.finale.at(-1)}</p></section>
    </div>
  </article>;
}
