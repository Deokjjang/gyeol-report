import { ReportCover, ReportContents } from "../../../components/report/ReportReadingFrame";
import { hasNarrativeEdition, hasDetailNarrative } from "../../../lib/interpretation-v3/narrativeEdition";
import narrativeStyles from "../../../components/report/v3Narrative.module.css";
import { buildCanonicalManseRyeokTableData } from "../../../lib/report-tables/manseRyeokTableData";
import { buildMbtiCommonProfileTableData, getMbtiSourceByType } from "../../../lib/report-tables";
import { validateProductPublication } from "../../../lib/report-generation/productPublishGate";
import { LOVE_STATUS_LABELS } from "../../../lib/interpretation-v3/loveEditorialContext";
import { LOVE_V3_POLISH_VERSION, type LoveV3Draft } from "../../../lib/interpretation-v3/loveEditorial";
import { factLabel } from "../../../lib/interpretation-v3/comprehensiveStoryEvidence";
import type { EditorialScene } from "../../../lib/interpretation-v3/editorialComposer";
import type { Evidence } from "../../../lib/interpretation-v3/types";
import type { SajuCalcResult } from "../../../lib/saju/types";
import { StoryTables } from "./ComprehensiveReportV3View";

function loveEvidenceLabel(fact: Evidence): string {
  if (fact.kind === "relation" && fact.value && typeof fact.value === "object" && "participants" in fact.value && Array.isArray(fact.value.participants)) {
    const kind = fact.featureId.includes("BRANCH_COMBINATION") ? "육합" : fact.featureId.includes("STEM_COMBINATION") ? "천간합" : fact.featureId.includes("CLASH") ? "충" : "";
    if (kind && fact.value.participants.every(p => typeof p === "string")) return `${fact.value.participants.join("")} ${kind}`;
  }
  return factLabel(fact);
}

function LoveReading({ scene, final, labels }: { readonly scene: EditorialScene; readonly final: boolean; readonly labels: readonly string[] }) {
  const quote = scene.form === "quote", punch = scene.form === "punchline", tip = scene.form === "tip";
  const content = <>
    <h3 className={quote || punch ? "font-serif text-xl leading-relaxed text-[#6f1d35] sm:text-2xl" : "text-lg font-semibold text-[#6f1d35]"}>{scene.headline}</h3>
    <div className={scene.form === "observations" ? "grid min-w-0 gap-x-7 gap-y-4 sm:grid-cols-2" : "space-y-5"}>
      {scene.parts.map((part, i) => <p key={i} className={final && i === scene.parts.length - 1 ? "border-t border-[#cbb589] pt-6 font-serif text-xl font-semibold leading-relaxed text-[#6f1d35] sm:text-2xl" : part.role === "explanation" ? "text-sm leading-7 text-[#756658] sm:col-span-2" : ""}>{part.text}</p>)}
    </div>
    {!final && labels.length > 0 ? <p className="text-xs leading-6 text-[#756658]" aria-label="해석 근거">{labels.join(" · ")}</p> : null}
  </>;
  const classes = `space-y-4 ${quote ? "border-l-2 border-[#cbb589] pl-5" : tip ? "rounded-sm bg-[#f6f0e6] px-4 py-5" : ""}`;
  return quote ? <blockquote className={classes} data-editorial-form={scene.form}>{content}</blockquote> : <div className={classes} data-editorial-form={scene.form}>{content}</div>;
}

export function LoveReportV3View({ draft, evidencePacket }: { readonly draft: LoveV3Draft; readonly evidencePacket: unknown }) {
  if (!validateProductPublication("love_marriage_child", draft, evidencePacket).ok) return <p>리포트를 준비하고 있습니다. 잠시 후 다시 확인해 주세요.</p>;
  const { facts, calculation } = (evidencePacket as { loveV3: { facts: readonly Evidence[]; calculation: SajuCalcResult } }).loveV3;
  const manse = buildCanonicalManseRyeokTableData(evidencePacket, draft.personLabel);
  const source = getMbtiSourceByType(draft.mbti), mbti = source ? buildMbtiCommonProfileTableData(source) : undefined;
  const usage = { opening: [], sections: draft.chapters.map(c => ({ blocks: c.scenes })) };
  // Validation binds these values to raw inputBasis, never inferred taxonomy.
  const inputRows = [["관계 상태", LOVE_STATUS_LABELS[draft.relationshipStatus]], ["MBTI", draft.mbti || "모름"], ...(draft.familyFocus ? [["관심 분야", "가족"]] : [])];
  return <article className={`min-w-0 overflow-hidden rounded-[8px] border border-[#ded2c2] bg-[#fffdf8] text-[#2b211b] ${hasNarrativeEdition(draft) ? narrativeStyles.edition : ""}`} data-report-version={draft.version}>
    <ReportCover product="연애·결혼·자녀 리포트" title={draft.title} summary="좋아할 때 달라지는 나, 이미 가진 매력, 가까운 생활에 남는 사랑을 읽습니다." />
    <section aria-label={`${draft.personLabel}님의 입력 정보`} data-love-input className="mx-4 mb-7 rounded-sm border border-[#ded2c2] bg-[#f8f3eb] px-4 py-4 sm:mx-6">
      <h2 className="mb-3 text-sm font-semibold text-[#6f1d35]">{draft.personLabel}님의 입력 정보</h2>
      <dl className="grid min-w-0 gap-x-6 gap-y-2 text-sm sm:grid-cols-2 lg:grid-cols-3">{inputRows.map(([label, value]) => <div key={label} className="flex min-w-0 items-baseline gap-2">
        <dt className="shrink-0 text-[#756658]">{label}</dt><dd className="min-w-0 break-words [overflow-wrap:anywhere]"><span aria-hidden="true">· </span>{value}</dd>
      </div>)}</dl>
    </section>
    <ReportContents items={draft.chapters.map(c => ({ id: `love-${c.id}`, label: c.title }))} />
    <StoryTables facts={facts} calculation={calculation} manse={manse} mbti={mbti} draft={usage} compactMbti={hasNarrativeEdition(draft)} detailMbti={hasDetailNarrative(draft)} />
    <div className="mx-auto max-w-[44rem] break-keep px-4 [overflow-wrap:anywhere] sm:px-6">
      {draft.chapters.map((chapter, i) => {
        const contents = <div className="space-y-10">{chapter.scenes.map((scene, j) => {
          // Display labels only. Internal references stay on this server boundary.
          const labels = [...new Set(facts.filter(f => scene.evidenceRefs.includes(f.id)).map(draft.version === LOVE_V3_POLISH_VERSION ? loveEvidenceLabel : factLabel))];
          return <LoveReading key={j} scene={scene} final={chapter.id === "direction"} labels={labels} />;
        })}</div>;
        return <section id={`love-${chapter.id}`} tabIndex={-1} key={i} data-reading-section className="space-y-8">
          {chapter.collapsed ? <details className="rounded-sm border border-[#ded2c2] p-4" data-love-parent>
            <summary className="min-h-11 cursor-pointer pb-4 text-xl font-semibold text-[#6f1d35] focus-visible:outline-2 focus-visible:outline-[#7f1d38]">{chapter.title}</summary>{contents}
          </details> : <><h2 className="text-2xl font-semibold">{chapter.title}</h2>{contents}</>}
        </section>;
      })}
    </div>
  </article>;
}
