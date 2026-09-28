import { ReportCover, ReportContents } from "../../../components/report/ReportReadingFrame";
import { buildCanonicalManseRyeokTableData } from "../../../lib/report-tables/manseRyeokTableData";
import { buildMbtiCommonProfileTableData, getMbtiSourceByType } from "../../../lib/report-tables";
import ManseRyeokCommonTable from "../../../components/report-tables/ManseRyeokCommonTable";
import { validateProductPublication } from "../../../lib/report-generation/productPublishGate";
import { COMPATIBILITY_V3_POLISHED_VERSION, type CompatibilityV3Draft } from "../../../lib/interpretation-v3/compatibilityEditorial";
import { compactCompatibilityLabels } from "../../../lib/interpretation-v3/compatibilityPolished";
import { CATEGORY_LABELS } from "../../../lib/interpretation-v3/compatibilityEditorialCopy";
import { PAIR_SLOTS, type PairCalculations } from "../../../lib/interpretation-v3/compatibilityEditorialEvidence";
import { factLabel } from "../../../lib/interpretation-v3/comprehensiveStoryEvidence";
import type { EditorialScene } from "../../../lib/interpretation-v3/editorialComposer";
import type { Evidence } from "../../../lib/interpretation-v3/types";
import { StoryTables } from "./ComprehensiveReportV3View";

function PairReading({ scene, final, labels }: { scene: EditorialScene; final: boolean; labels: readonly string[] }) {
  const quote = scene.form === "quote", punch = scene.form === "punchline";
  const content = <>
    <h3 className={quote || punch ? "font-serif text-xl leading-relaxed text-[#6f1d35] sm:text-2xl" : "text-lg font-semibold text-[#6f1d35]"}>{scene.headline}</h3>
    <div className="space-y-5">{scene.parts.map((part, i) => <p key={i} className={final && i === scene.parts.length - 1 ? "border-t border-[#cbb589] pt-6 font-serif text-xl font-semibold leading-relaxed text-[#6f1d35] sm:text-2xl" : ""}>{part.text}</p>)}</div>
    {!final && labels.length ? <p className="text-xs leading-6 text-[#756658]" aria-label="해석 근거">{labels.join(" · ")}</p> : null}
  </>;
  const classes = `space-y-4 ${quote ? "border-l-2 border-[#cbb589] pl-5" : scene.form === "tip" ? "rounded-sm bg-[#f6f0e6] px-4 py-5" : ""}`;
  return quote ? <blockquote className={classes} data-editorial-form={scene.form}>{content}</blockquote> : <div className={classes} data-editorial-form={scene.form}>{content}</div>;
}

export function CompatibilityReportV3View({ draft, evidencePacket }: { draft: CompatibilityV3Draft; evidencePacket: unknown }) {
  if (!validateProductPublication("saju_mbti_compatibility", draft, evidencePacket).ok) return <p>리포트를 준비하고 있습니다. 잠시 후 다시 확인해 주세요.</p>;
  const { calculations, editorial: { facts } } = (evidencePacket as { compatibilityV3: { calculations: PairCalculations; editorial: { facts: Evidence[] } } }).compatibilityV3;
  const usage = { opening: [], sections: draft.chapters.map(c => ({ blocks: c.scenes })) };
  // Reset public label repetition per chapter; all stored evidence stays intact.
  const publicLabels = new Map<string, readonly string[]>();
  if (draft.version === COMPATIBILITY_V3_POLISHED_VERSION) for (const chapter of draft.chapters) {
    const shown = new Set<string>();
    for (const scene of chapter.scenes) {
      const labels = compactCompatibilityLabels(scene, facts, draft.people).filter(label => !shown.has(label));
      labels.forEach(label => shown.add(label));
      publicLabels.set(scene.id, labels);
    }
  }
  const reading = (chapter: CompatibilityV3Draft["chapters"][number]) => <section id={`pair-${chapter.id}`} tabIndex={-1} key={chapter.id} data-reading-section className="space-y-8">
    <h2 className="text-2xl font-semibold">{chapter.title}</h2>
    <div className="space-y-10">{chapter.scenes.map((scene, i) => {
      const labels = publicLabels.get(scene.id) ?? [...new Set(facts.filter(f => scene.evidenceRefs.includes(f.id)).map(f => {
        const label = f.featureId.startsWith("pair:") && f.value && typeof f.value === "object" && "label" in f.value ? String(f.value.label) : factLabel(f);
        return `${f.subject === "personB" ? draft.people.personB.name : draft.people.personA.name} · ${label}`;
      }))];
      return <PairReading key={i} scene={scene} final={chapter.id === "ending"} labels={labels} />;
    })}</div>
  </section>;
  return <article className="min-w-0 overflow-hidden rounded-[8px] border border-[#ded2c2] bg-[#fffdf8] text-[#2b211b]" data-report-version={draft.version}>
    <ReportCover product={`${CATEGORY_LABELS[draft.relationshipType]} 궁합 리포트`} title={draft.title} summary="함께 있을 때 달라지는 반응, 둘 사이의 좋은 힘과 웃기게 엇갈리는 순간을 읽습니다." />
    <section aria-label="두 사람의 입력 정보" data-compatibility-input className="mx-4 mb-7 rounded-sm border border-[#ded2c2] bg-[#f8f3eb] px-4 py-4 sm:mx-6">
      <h2 className="mb-3 text-sm font-semibold text-[#6f1d35]">두 사람의 입력 정보</h2>
      <dl className="grid min-w-0 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
        {PAIR_SLOTS.map(slot => <div key={slot} className="min-w-0"><dt className="text-[#756658]">{draft.people[slot].role} 이름 / MBTI</dt><dd className="break-words [overflow-wrap:anywhere]">{draft.people[slot].name} · {draft.people[slot].mbti || "모름"}</dd></div>)}
        <div><dt className="text-[#756658]">관계 유형</dt><dd>{CATEGORY_LABELS[draft.relationshipType]}</dd></div>
      </dl>
    </section>
    <div className="mx-auto max-w-[44rem] break-keep px-4 [overflow-wrap:anywhere] sm:px-6">{reading(draft.chapters[0])}</div>
    <ReportContents items={draft.chapters.slice(1).map(c => ({ id: `pair-${c.id}`, label: c.title }))} />
    {PAIR_SLOTS.map(slot => {
      const person = draft.people[slot], manse = buildCanonicalManseRyeokTableData(evidencePacket, person.name, slot);
      const source = getMbtiSourceByType(person.mbti), mbti = source ? buildMbtiCommonProfileTableData(source) : undefined;
      // Only the public table crosses client boundaries, never role IDs/facts.
      return <section key={slot} aria-label={`${person.name}님의 원국과 성향`}>
        <h2 className="px-4 pt-6 text-xl font-semibold sm:px-6">{person.role} · {person.name}님의 원국과 성향</h2>
        {manse?.natalEvidence?.precision === "exact" ? <StoryTables facts={facts.filter(f => f.subject === slot && !f.featureId.startsWith("pair:"))} calculation={calculations[slot]} manse={manse} mbti={mbti} draft={usage} />
          : <div className="px-4 py-6 sm:px-6">{manse ? <ManseRyeokCommonTable data={{ ...manse, natalEvidence: undefined }} defaultOpen={false} /> : null}<p className="mt-3 text-sm text-[#756658]">출생시간 범위에서 확인된 원국만 표시합니다. MBTI · {person.mbti || "모름"}</p></div>}
      </section>;
    })}
    <div className="mx-auto max-w-[44rem] break-keep px-4 [overflow-wrap:anywhere] sm:px-6">{draft.chapters.slice(1).map(reading)}</div>
  </article>;
}
