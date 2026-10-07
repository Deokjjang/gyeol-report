import { expect } from "vitest";
import { buildComprehensiveEditorialPlan } from "../../../src/lib/interpretation-v4/comprehensiveEditorialPlan";
import type { ComprehensivePlanInputs, EditorialCandidate } from "../../../src/lib/interpretation-v4/comprehensivePlanCore";
import { guidanceInputs, profile } from "./guidanceFixtures";
import { myAtom, myProfile, realMbti } from "./fusionSemanticFixtures";
import { marker, wealth, officer } from "./claimFixtures";
import type { GuidanceContextInput } from "../../../src/lib/interpretation-v4/guidanceContext";
import type { SemanticSignature, InterpretationContext } from "../../../src/lib/interpretation-v4/semanticCore";

export function schedulerInputs(m = richMyeongli(), mbti: unknown = "ENTJ", raw: GuidanceContextInput = { jobStatus: "employee", detailJob: "출판 편집자", relationshipStatus: "dating" }): ComprehensivePlanInputs {
  const i = guidanceInputs(m, realMbti(mbti)); return { ...i, guidance: profile(i, raw) };
}
export function schedulerPlan(i: ComprehensivePlanInputs) {
  const r = buildComprehensiveEditorialPlan(i); if (!r.ok) return expect.unreachable(JSON.stringify(r.diagnostics)); return r.value;
}
export function richMyeongli() {
  // Explicit normalized unit proofs. Actual date-derived cohort is separate.
  const rows: [string, SemanticSignature, InterpretationContext[]][] = [
    ["precise", { PRECISION: 2, STRUCTURE_STYLE: 2, COMMUNICATION_STYLE: 2 }, ["identity", "work", "social"]],
    ["think", { DEPTH: 2, CURIOSITY: 2, ACTION_TEMPO: -2 }, ["identity", "learning", "recovery"]],
    ["move", { ACTION_TEMPO: 2, DECISION_STYLE: 2, INITIATIVE: 2 }, ["identity", "work"]],
    ["care", { CARE: 2, SOCIAL_ATTUNEMENT: 2, RELATION_STYLE: 2 }, ["identity", "social", "love"]],
    ["lead", { LEADERSHIP: 2, DUTY: 2, GOAL_DRIVE: 2, PERSISTENCE: 2 }, ["identity", "work", "stress"]],
    ["money", { RESOURCE_SENSE: 2, PRACTICALITY: 2, MEANING: 2 }, ["identity", "money", "work"]],
    ["recognition", { STATUS_DRIVE: 2, EXPANSION: 2, OPPORTUNITY_SENSE: 2 }, ["identity", "work", "money"]],
    ["charm", { CHARISMA: 2, EXPRESSION: 2, CREATION: 2 }, ["identity", "social", "love"]],
    ["rest", { RECOVERY_NEED: 2, ENERGY_DIRECTION: -2, STABILITY: 2 }, ["identity", "recovery"]],
    ["own", { AUTONOMY: 2, BOUNDARY: 2 }, ["identity", "work", "social"]],
  ];
  return myProfile([...rows.flatMap(([id, axes, contexts]) => [myAtom(`${id}-a`, axes, { contexts }), myAtom(`${id}-b`, axes, { contexts })]), wealth(), officer(), marker("CHEONEUL"), marker("BANAN"), marker("JAEGO"), marker("DOHWA"), marker("HONGYEOM")]);
}
/** Allocation-only fixture, never passed to the profile boundary as real truth. */
export function editorialRow(id: string, extra: Partial<EditorialCandidate> = {}): EditorialCandidate {
  return { id, sourceType: "PERSONAL_RESONANCE", sourceId: id, sourceText: `explicit source ${id}`, semanticTheme: id, broadTheme: id, primaryAxes: ["DEPTH"], contexts: ["identity", "work"], allowedSections: ["C4", "C8"], preferredSections: ["C4"], evidenceIds: [`e:${id}`], underlyingEvidenceIds: [`e:${id}`], myeongliEvidenceIds: [`e:${id}`], mbtiSourceNodeIds: [], fusionIds: [], claimIds: [], resonanceIds: [id], traitArcIds: [], guidanceIds: [], confidence: 1, specificity: .9, emotionalValue: .8, fusionValue: 0, inputFit: .5, evidenceDiversity: 1, positiveValence: 1, negativeValence: 0, genericness: 0, priorityScore: 80, rank: "MAIN", independentEvidenceCount: 1, independentFamilies: [id], emotionTags: ["UPLIFTING"], slots: ["WORK_STYLE", "CURRENT_CONTEXT"], fortune: false, fortuneFamilies: [], compositeFortune: false, factBomb: false, precursorIds: [], guidanceMerged: false, elementComposite: false, strongYinYang: false, primaryEligible: true, invalidReasons: [], ...extra };
}
