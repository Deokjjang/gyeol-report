import "server-only";
import { createHash } from "node:crypto";
import { buildIntegratedMyeongliProfile } from "./foundationIntegratedProfile";
import { buildMbtiSemanticProfile } from "./mbtiSemanticProfile";
import { buildMyeongliMbtiFusion } from "./fusionSemanticProfile";
import { buildClaimProfile } from "./claimProfile";
import { buildPersonalResonanceProfile } from "./personalResonanceProfile";
import { buildContextualGuidanceProfile } from "./guidanceProfile";
import { buildComprehensiveEditorialPlan } from "./comprehensiveEditorialPlan";
import { renderComprehensiveManuscript } from "./comprehensiveManuscriptRenderer";
import { COMPREHENSIVE_SECTIONS } from "./comprehensivePlanCore";
import { buildMyeongliMaterialPacket } from "./materialPacket";
import type { NarrativeInput, NarrativeBlock, NarrativeSection, ComprehensiveNarrative, NarrativeProof } from "./narrativeTypes";

export const COMPREHENSIVE_PRODUCT_VERSION = "comprehensive-product-13d-6b-v1";
const fail = (error: string) => ({ ok: false as const, errors: [error] });

/** One generation-time orchestration boundary. Frozen engines supply every
 * sentence; existing narrative/storage contracts carry the result. Readers do
 * not import this module, and old persisted compositions are never regenerated. */
export function buildV4ComprehensiveProduct(input: NarrativeInput) {
  const m = buildIntegratedMyeongliProfile(input.calculation);
  if (!m.ok) return fail("COMPREHENSIVE_SEMANTIC_INVALID");
  // The persisted input contract uses an empty string for 모름; the frozen
  // semantic boundary uses null. Neither representation implies a type.
  const b = buildMbtiSemanticProfile(input.mbti || null);
  if (!b.ok) return fail("COMPREHENSIVE_MBTI_INVALID");
  const f = buildMyeongliMbtiFusion(m.value, b.value);
  if (!f.ok) return fail("COMPREHENSIVE_FUSION_INVALID");
  const c = buildClaimProfile(m.value, b.value, f.value);
  if (!c.ok) return fail("COMPREHENSIVE_CLAIMS_INVALID");
  const r = buildPersonalResonanceProfile(m.value, b.value, f.value, c.value);
  if (!r.ok) return fail("COMPREHENSIVE_RESONANCE_INVALID");
  const inputs = { myeongli: m.value, mbti: b.value, fusion: f.value, claims: c.value, resonance: r.value };
  const g = buildContextualGuidanceProfile(inputs, input.context);
  if (!g.ok) return fail("COMPREHENSIVE_CONTEXT_INVALID");
  const profiles = { ...inputs, guidance: g.value };
  const plan = buildComprehensiveEditorialPlan(profiles);
  if (!plan.ok) return fail("COMPREHENSIVE_PLAN_INVALID");
  // Explicit ordered input fields: no ambient time, report ID or object-key-order seed.
  const reportStableKey = createHash("sha256").update(JSON.stringify([COMPREHENSIVE_PRODUCT_VERSION,
    input.name, input.calculation.pillars, input.calculation.birthTimeContext,
    input.mbti ?? null, input.context.jobStatus, input.context.detailJob, input.context.relationshipStatus])).digest("hex");
  const rendered = renderComprehensiveManuscript({ profiles, plan: plan.value, reportStableKey });
  if (!rendered.ok) return fail(rendered.error);
  const draft = rendered.draft;
  if (draft.validation.hardViolations.length) return fail("COMPREHENSIVE_MANUSCRIPT_UNSAFE");
  const sections: NarrativeSection[] = [];
  const represented: { unit: string; chapter: string; primary: string[]; rendered: string[]; headings: string[] }[] = [];
  const ids = { C1: "core", C2: "portrait", C3: "why", C4: "strengths", C5: "fortune", C6: "fact-bomb", C7: "relationships", C8: "work", C9: "shadow", C10: "direction" } as const;
  const domains = { C1: "identity", C2: "identity", C3: "identity", C4: "strengths", C5: "success/fortune", C6: "weaknesses", C7: "relationships", C8: "work", C9: "relationships", C10: "strengths" } as const;
  const proof = (evidenceIds: readonly string[], fusionIds: readonly string[] = []): NarrativeProof =>
    ({ features: [], seedIds: [], fusionIds: [...fusionIds], sourceRefs: [...evidenceIds] });
  let opening: NarrativeBlock[] = [];
  for (const id of COMPREHENSIVE_SECTIONS) {
    const section = draft.sections[id];
    if (!section.blocks.length) continue; // No heading-only pages or invented filler.
    const blocks: NarrativeBlock[] = section.blocks.map((block, i) => ({
      id: `${ids[id]}-${i}`, text: block.plainText, mode: "prose", tone: id === "C6" ? "shadow" : id === "C10" ? "direction" : "positive",
      proof: proof(block.sentences.flatMap(s => s.evidenceIds), block.sentences.flatMap(s => s.fusionIds)),
    }));
    // Bridges are optional connective copy, not primary material. Keep every
    // selected paragraph atomic, including tension sides and fortune reasons.
    represented.push({ unit: id, chapter: ids[id], primary: plan.value.sections[id].primaryCandidateIds,
      rendered: section.blocks.flatMap(block => block.sourceUnitIds),
      headings: section.blocks.map(block => section.operatingRules?.find(rule => block.sourceUnitIds.includes(rule.candidateId))?.source?.shortTitle ?? "") });
    if (id === "C1") opening = blocks;
    else sections.push({ id: ids[id], title: section.title, domain: domains[id], blocks });
  }
  const last = draft.sections.C10.blocks.at(-1);
  // Sparse/unknown-MBTI manuscripts may close with an approved operating rule
  // rather than core recall. Keep that frozen sentence; never invent a closer.
  const finalLine = last?.sentences.find(s => s.sourcePhraseId.endsWith(":core-recall"))?.text ?? last?.sentences.at(-1)?.text;
  if (!opening.length || !finalLine || !sections.some(s => s.id === "direction")) return fail("COMPREHENSIVE_PRIMARY_CONTENT_MISSING");
  const narrative = { version: "v4-comprehensive-narrative-1", headline: draft.sections.C1.title,
    opening, sections, finalLine, finalProof: proof(last!.sentences.flatMap(s => s.evidenceIds)) } satisfies ComprehensiveNarrative;
  return { ok: true as const, writerVersion: COMPREHENSIVE_PRODUCT_VERSION, narrative,
    // Existing appendix material selection is retained, not used to write prose.
    materials: buildMyeongliMaterialPacket({ calculation: input.calculation, mbti: input.mbti }), editorial: [],
    integration: { reportStableKey, manuscriptVersion: draft.version, coreGyeol: draft.coreGyeol.text, context: g.value.context,
      explicitMbtiUsage: draft.explicitMbtiUsage, represented, hardViolations: draft.validation.hardViolations,
      suppressed: draft.diagnostics.suppressed } };
}
export type ComprehensiveProduct = Extract<ReturnType<typeof buildV4ComprehensiveProduct>, { ok: true }>;
