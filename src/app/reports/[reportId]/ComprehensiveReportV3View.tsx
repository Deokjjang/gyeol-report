import { ReportCover, ReportContents } from "../../../components/report/ReportReadingFrame";
import { hasNarrativeEdition, hasDetailNarrative } from "../../../lib/interpretation-v3/narrativeEdition";
import narrativeStyles from "../../../components/report/v3Narrative.module.css";
import { V3NarrativeIdentity } from "../../../components/report/V3NarrativeIdentity";
import { ManseRyeokCommonTable, MbtiCommonProfileTable } from "../../../components/report-tables";
import { buildCanonicalManseRyeokTableData, withConsistentNatalMarkers } from "../../../lib/report-tables/manseRyeokTableData";
import { buildMbtiCommonProfileTableData, getMbtiSourceByType } from "../../../lib/report-tables";
import { validateProductPublication } from "../../../lib/report-generation/productPublishGate";
import type { ComprehensiveV3Block, ComprehensiveV3Draft } from "../../../lib/interpretation-v3/comprehensive";
import type { SajuCalcResult } from "../../../lib/saju/types";
import type { Evidence } from "../../../lib/interpretation-v3/types";
import { ENRICHED_COMPREHENSIVE_VERSION } from "../../../lib/interpretation-v3/comprehensiveComposition";
import { STORY_COMPREHENSIVE_VERSION } from "../../../lib/interpretation-v3/comprehensiveStorytelling";
import { FINAL_COMPREHENSIVE_VERSION } from "../../../lib/interpretation-v3/comprehensiveExperience";
import { DEPTH_COMPREHENSIVE_VERSION } from "../../../lib/interpretation-v3/comprehensiveDepth";
import { customerEvidenceLabels, groupPublicRelations, publicSignalRows, type PublicSignalRow, type PublicSignalUsage } from "../../../lib/interpretation-v3/comprehensivePublicSignals";
import type { ManseRyeokCommonTableData, MbtiCommonProfileTableData } from "../../../lib/report-tables/types";

function EvidenceLine({ labels }: { readonly labels: readonly string[] }) {
  const publicLabels = customerEvidenceLabels(labels).slice(0, 3);
  return publicLabels.length ? <p className="mt-3 text-xs tracking-wide text-[#846829]" data-evidence-line>{publicLabels.join(" · ")}</p> : null;
}
function Reading({ block, opening = false }: { readonly block: ComprehensiveV3Block; readonly opening?: boolean }) {
  if (block.editorialForm) {
    const quote = block.editorialForm === "quote", punch = block.editorialForm === "punchline", compact = block.editorialForm === "tip";
    const body = <>
      <h3 className={punch || quote ? "font-serif text-xl leading-relaxed text-[#6f1d35] sm:text-2xl" : "text-lg font-semibold text-[#6f1d35]"}>{block.headline}</h3>
      <div className={block.editorialForm === "observations" ? "grid min-w-0 gap-x-7 gap-y-4 sm:grid-cols-2" : "space-y-5"}>
        {block.paragraphs?.map((p, i) => <p key={i} className={block.editorialRoles?.[i] === "explanation" ? "text-sm leading-7 text-[#756658] sm:col-span-2" : ""}>{p}</p>)}
      </div>
      {block.action ? <p className="text-[0.95rem] leading-8 text-[#665448]">{block.action}</p> : null}
    </>;
    const classes = `space-y-4 ${quote ? "border-l-2 border-[#cbb589] pl-5" : compact ? "rounded-sm bg-[#f6f0e6] px-4 py-5" : ""}`;
    return quote ? <blockquote className={classes} data-editorial-form={block.editorialForm} data-writing-mode={block.writingMode}>{body}</blockquote>
      : <div className={classes} data-editorial-form={block.editorialForm} data-writing-mode={block.writingMode}>{body}</div>;
  }
  if (block.writingMode) return <div className={`space-y-4 ${block.writingMode === "criterion" ? "border-l-2 border-[#cbb589] pl-4" : ""}`} data-writing-mode={block.writingMode}>
    {block.headline ? <h3 className={block.writingMode === "question" ? "font-serif text-xl leading-relaxed text-[#6f1d35]" : "text-lg font-semibold text-[#6f1d35]"}>{block.headline}</h3> : null}
    {block.paragraphs?.map((p, i) => <p key={i} className={block.writingMode === "image" && i === 0 ? "font-serif text-[#665035]" : ""}>{p}</p>)}
    {block.action ? <p className={block.writingMode === "closing" || block.writingMode === "criterion" ? "font-medium" : ""}>{block.action}</p> : null}
    {block.ideas ? <ul className="list-disc space-y-3 pl-5 marker:text-[#846829]">{block.ideas.map(idea => <li key={idea}>{idea}</li>)}</ul> : null}
    <EvidenceLine labels={block.labels} />
  </div>;
  if (block.paragraphs) return <div className={block.kind === "context" ? "space-y-3 border-l-2 border-[#cbb589] pl-4" : "space-y-4"} data-v3-kind={block.kind} data-v3-format={block.format}>
    {block.headline ? <h3 className="text-lg font-semibold text-[#6f1d35]">{block.headline}</h3> : null}
    {block.paragraphs.map((p, i) => <p key={i} className={block.format === "gift" && i === 0 ? "font-medium text-[#846829]" : ""}>{p}</p>)}
    {block.action ? <p className={block.format === "strategy" ? "font-medium" : ""}>{block.action}</p> : null}
    {block.ideas ? <ul className="list-disc space-y-3 pl-5 marker:text-[#846829]">{block.ideas.map(idea => <li key={idea}>{idea}</li>)}</ul> : null}
    <EvidenceLine labels={block.labels} />
  </div>;
  return <div className="space-y-3" data-v3-kind={block.kind}>
    {block.headline ? opening ? <p className="font-semibold text-[#6f1d35]">{block.headline}</p> : <h3 className="text-lg font-semibold text-[#6f1d35]">{block.headline}</h3> : null}
    {block.reading ? <p>{block.reading}</p> : null}
    {block.action ? <p className="font-medium">{block.action}</p> : null}
    {block.why ? block.why.split(/(?<=다\.)\s+(?=[가-힣]+(?:은|는))/u).map((p, i) => <p key={i} className="text-[#756658]">{p}</p>) : null}
    <EvidenceLine labels={block.labels} />
  </div>;
}
export function ComprehensiveReportV3View({ draft, evidencePacket }: { readonly draft: ComprehensiveV3Draft; readonly evidencePacket?: unknown }) {
  if (!validateProductPublication("saju_mbti_full", draft, evidencePacket).ok) return <p>리포트를 준비하고 있습니다. 잠시 후 다시 확인해 주세요.</p>;
  const { calculation, facts } = (evidencePacket as { comprehensiveV3: { calculation: SajuCalcResult; facts: readonly Evidence[] } }).comprehensiveV3;
  const manse = buildCanonicalManseRyeokTableData(evidencePacket, draft.personLabel);
  const source = getMbtiSourceByType(draft.profileTable.mbti);
  const mbti = source ? buildMbtiCommonProfileTableData(source) : undefined;
  const items = [{ id: "v3-core", label: "핵심 결" }, ...draft.sections.map(s => ({ id: `v3-${s.id}`, label: s.title })),
    { id: "v3-patterns", label: "나를 망치기 쉬운 패턴" }, { id: "v3-direction", label: "앞으로 이렇게 살아가세요" }];
  if (draft.version === ENRICHED_COMPREHENSIVE_VERSION || draft.version === STORY_COMPREHENSIVE_VERSION || draft.version === FINAL_COMPREHENSIVE_VERSION || draft.version === DEPTH_COMPREHENSIVE_VERSION) {
    const depth = draft.version === DEPTH_COMPREHENSIVE_VERSION;
    return <article className={`min-w-0 overflow-hidden rounded-[8px] border border-[#ded2c2] bg-[#fffdf8] text-[#2b211b] ${hasNarrativeEdition(draft) ? narrativeStyles.edition : ""}`} data-report-version={draft.version}>
      <ReportCover product="사주×MBTI 종합 리포트" title={draft.title} summary="나를 관통하는 성격과 이미 가진 좋은 패, 앞으로의 선택을 읽습니다." />
      <ReportContents items={items} />
      <StoryTables facts={facts} calculation={calculation} manse={manse} mbti={mbti} draft={draft} compactMbti={hasNarrativeEdition(draft)} detailMbti={hasDetailNarrative(draft)} />
      <div className="mx-auto max-w-[44rem] break-keep px-4 [overflow-wrap:anywhere] sm:px-6">
        <section id="v3-core" tabIndex={-1} data-reading-section className="space-y-6">
          <h2 className="text-2xl font-semibold">핵심 결</h2>
          {depth ? draft.opening.map((b, i) => <Reading key={i} block={b} opening />) : <>
            {draft.opening.flatMap(b => b.paragraphs ?? []).map((p, i) => <p key={i} className={i === 0 ? "text-lg font-medium text-[#6f1d35]" : ""}>{p}</p>)}
            <EvidenceLine labels={[...new Set(draft.opening.flatMap(b => b.labels))]} />
          </>}
        </section>
        {draft.sections.map(section => <section id={`v3-${section.id}`} tabIndex={-1} key={section.id} data-reading-section className="space-y-8">
          <h2 className="text-2xl font-semibold">{section.title}</h2>
          <div className={depth ? "space-y-10" : "divide-y divide-[#eadfce]"}>{section.blocks.map((b, i) => <div key={i} className={depth ? "min-w-0" : "py-6 first:pt-0 last:pb-0"}><Reading block={b} /></div>)}</div>
        </section>)}
        <section id="v3-patterns" tabIndex={-1} data-reading-section className="space-y-7">
          <h2 className="text-2xl font-semibold">나를 망치기 쉬운 패턴</h2>
          {draft.patterns.map(p => <div key={p.risk} className="space-y-3 border-l-2 border-[#cbb589] pl-4">{!depth ? <p className="text-sm text-[#846829]">잘 쓰면 · {p.strength}</p> : null}<h3 className="text-lg font-semibold">{p.risk}</h3>{(p.why ?? "").split("\n\n").map((text, i) => <p key={i}>{text}</p>)}<p className="font-medium">{p.repair}</p>{!depth ? <EvidenceLine labels={p.labels} /> : null}</div>)}
        </section>
        <section id="v3-direction" tabIndex={-1} data-reading-section className="space-y-6">
          <h2 className="text-2xl font-semibold">앞으로 이렇게 살아가세요</h2>
          {draft.direction.split("\n\n").map((p, i, ps) => <p key={i} className={depth && i === ps.length - 1 ? "border-t border-[#cbb589] pt-6 font-serif text-xl font-semibold leading-relaxed text-[#6f1d35] sm:text-2xl" : i === 0 ? "font-medium text-[#6f1d35]" : ""}>{p}</p>)}
        </section>
      </div>
    </article>;
  }
  return <article className={`min-w-0 overflow-hidden rounded-[8px] border border-[#ded2c2] bg-[#fffdf8] text-[#2b211b] ${hasNarrativeEdition(draft) ? narrativeStyles.edition : ""}`} data-report-version={draft.version}>
    <ReportCover product="사주×MBTI 종합 리포트" title={draft.title} summary="이미 가진 좋은 힘을 알아보고, 일과 관계에서 쓰는 나만의 방향." />
    <ReportContents items={items} />
    <StoryTables facts={facts} calculation={calculation} manse={manse} mbti={mbti} draft={draft} compactMbti={hasNarrativeEdition(draft)} detailMbti={hasDetailNarrative(draft)} />
    <div className="mx-auto max-w-[44rem] break-keep px-4 [overflow-wrap:anywhere] sm:px-6">
      <section id="v3-core" tabIndex={-1} data-reading-section className="space-y-7">
        <h2 className="text-2xl font-semibold">핵심 결</h2>
        {draft.opening.map(b => <Reading key={b.id} block={b} opening />)}
        <p className="border-l-2 border-[#6f1d35] pl-4 font-medium">{draft.openingContext}</p>
      </section>
      {draft.sections.map(section => <section id={`v3-${section.id}`} tabIndex={-1} key={section.id} data-reading-section className="space-y-8">
        <h2 className="text-2xl font-semibold">{section.title}</h2>
        {section.blocks.map(b => <Reading key={b.id} block={b} />)}
      </section>)}
      <section id="v3-patterns" tabIndex={-1} data-reading-section className="space-y-7">
        <h2 className="text-2xl font-semibold">나를 망치기 쉬운 패턴</h2>
        {draft.patterns.map(p => <div key={p.risk} className="space-y-2"><h3 className="text-lg font-semibold">{p.risk}</h3><p>{p.repair}</p><EvidenceLine labels={p.labels} /></div>)}
      </section>
      <section id="v3-direction" tabIndex={-1} data-reading-section className="space-y-4">
        <h2 className="text-2xl font-semibold">앞으로 이렇게 살아가세요</h2><p className="font-medium text-[#6f1d35]">{draft.direction}</p>
      </section>
    </div>
  </article>;
}

export function StoryTables({ facts, calculation, manse, mbti, draft, compactMbti = false, detailMbti = false }: { readonly facts: readonly Evidence[]; readonly calculation: SajuCalcResult; readonly manse?: ManseRyeokCommonTableData | null; readonly mbti?: MbtiCommonProfileTableData | null; readonly draft: PublicSignalUsage; readonly compactMbti?: boolean; readonly detailMbti?: boolean }) {
  const colors = ["bg-emerald-50 border-emerald-200", "bg-rose-50 border-rose-200", "bg-amber-50 border-amber-200", "bg-stone-100 border-stone-200", "bg-sky-50 border-sky-200"];
  const elements = [["WOOD", "목"], ["FIRE", "화"], ["EARTH", "토"], ["METAL", "금"], ["WATER", "수"]] as const;
  const rows = groupPublicRelations(publicSignalRows(facts, calculation, draft));
  return <section aria-label="계산된 원국과 성향" className="space-y-5 border-b border-[#eadfce] px-4 py-6 sm:px-6" data-story-tables>
    {manse ? <ManseRyeokCommonTable data={{ ...(detailMbti ? withConsistentNatalMarkers(manse) : manse), natalEvidence: undefined }} defaultOpen={false} elementDistribution={<section key="story-element-distribution" aria-label="오행 분포" className="space-y-3 px-3 py-4" data-story-elements>
      <h3 className="text-sm font-semibold">오행 분포</h3>
      <p className="text-xs text-[#756658]">원국 8글자</p>
      <div className="grid grid-cols-5 gap-1.5">{elements.map(([id, label], i) => <div key={id} className={`min-w-0 rounded-lg border px-1 py-2 text-center ${colors[i]}`}><p className="text-xs">{label}</p><p className="text-xl font-bold">{calculation.elements.visible[id]}</p></div>)}</div>
      <p className="text-xs text-[#756658]">지장간 포함 가중</p>
      <div className="grid grid-cols-5 gap-1.5">{elements.map(([id, label], i) => <div key={id} className={`min-w-0 rounded-lg border px-1 py-2 text-center ${colors[i]}`}><p className="text-xs">{label}</p><p className="text-lg font-semibold">{Number(calculation.elements.weighted[id].toFixed(1))}</p></div>)}</div>
      <p className="text-xs leading-6 text-[#756658]">위는 원국 8글자, 아래는 지장간을 포함한 해석용 가중 분포입니다.</p>
    </section>} /> : null}
    <section className="min-w-0 rounded-lg border border-[#ded2c2] p-3 sm:p-4" data-story-signals aria-label="내 명리에 있는 주요 기운">
      <h2 className="mb-3 font-semibold">내 명리에 있는 주요 기운</h2>
      <PublicSignalTable rows={rows.slice(0, 10)} caption="내 해석에서 중요한 기운부터 쉽고 재미있게 읽어보세요." />
      {rows.length > 10 ? <details className="mt-3 border-t border-[#ded2c2] pt-1" data-all-signals>
        <summary className="min-h-11 cursor-pointer py-3 text-sm font-semibold text-[#6f1d35] focus-visible:outline-2 focus-visible:outline-[#7f1d38]">전체 기운 보기 · 나머지 {rows.length - 10}개</summary>
        <PublicSignalTable rows={rows.slice(10)} caption="앞에서 본 기운 외에 원국에서 확인된 기운입니다." />
      </details> : null}
    </section>
    {compactMbti ? <V3NarrativeIdentity data={mbti} detailed={detailMbti} /> : mbti ? <MbtiCommonProfileTable data={mbti} defaultOpen={false} variant="compact" /> : <p className="text-sm text-[#756658]">MBTI 미입력 · 명리 근거만으로 구성했습니다.</p>}
  </section>;
}

function PublicSignalTable({ rows, caption }: { readonly rows: readonly PublicSignalRow[]; readonly caption: string }) {
  return <table className="w-full table-fixed border-collapse text-left text-xs leading-6 sm:text-sm [overflow-wrap:anywhere]">
    <caption className="pb-3 text-left text-xs text-[#756658]">{caption}</caption>
    <thead><tr className="border-y border-[#ded2c2] text-[#6f1d35]"><th scope="col" className="w-[24%] py-2 pr-2">기운</th><th scope="col" className="w-[36%] py-2 pr-2">쉽게 말하면</th><th scope="col" className="py-2">나에게 쓰이는 힘</th></tr></thead>
    <tbody>{rows.map(row => <tr key={row.label} className="border-b border-[#eadfce] align-top">
      <th scope="row" className="py-3 pr-2 font-semibold">{row.label}</th>
      <td className="py-3 pr-2">{row.meaning}</td><td className="py-3">{row.power}</td>
    </tr>)}</tbody>
  </table>;
}
