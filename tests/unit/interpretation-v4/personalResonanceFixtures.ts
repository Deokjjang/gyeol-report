import { expect } from "vitest";
import { buildPersonalResonanceProfile } from "../../../src/lib/interpretation-v4/personalResonanceProfile";
import { buildClaimProfile } from "../../../src/lib/interpretation-v4/claimProfile";
import { buildClaimEvidenceView } from "../../../src/lib/interpretation-v4/claimEvidence";
import type { MyeongliSemanticProfile } from "../../../src/lib/interpretation-v4/foundationIntegratedProfile";
import type { MbtiSemanticProfile } from "../../../src/lib/interpretation-v4/mbtiSemanticProfile";
import type { SemanticSignature } from "../../../src/lib/interpretation-v4/semanticCore";
import { realMbti, fuse } from "./fusionSemanticFixtures";

export function resonanceInputs(m: MyeongliSemanticProfile, b: MbtiSemanticProfile = realMbti(null)) {
  const f = fuse(m, b), result = buildClaimProfile(m, b, f);
  if (!result.ok) return expect.unreachable(JSON.stringify(result.diagnostics.hardErrors));
  return { m, b, f, claims: result.value };
}
export function resonance(m: MyeongliSemanticProfile, b: MbtiSemanticProfile = realMbti(null)) {
  const inputs = resonanceInputs(m, b), r = buildPersonalResonanceProfile(inputs.m, inputs.b, inputs.f, inputs.claims);
  if (!r.ok) return expect.unreachable(JSON.stringify(r.diagnostics.hardErrors)); return r.value;
}
export function resonanceScope(m: MyeongliSemanticProfile, b: MbtiSemanticProfile = realMbti(null)) {
  const i = resonanceInputs(m, b); return { myeongli: m, mbti: b, claims: i.claims, view: buildClaimEvidenceView(m, b, i.f) };
}
/** Explicit normalized positives; the real-DOB cohort is tested separately. */
export const RESONANCE_SCENARIOS: [string, SemanticSignature][] = [
  ["PR001", { DEPTH: 2, ACTION_TEMPO: 2 }], ["PR002", { AUTONOMY: 2, BOUNDARY: 2, COMMUNICATION_STYLE: -2 }],
  ["PR003", { PRECISION: 2 }], ["PR004", { DEPTH: 2, CURIOSITY: 2 }], ["PR005", { CURIOSITY: 2, DECISION_STYLE: -2 }],
  ["PR006", { STRATEGY: 2, PRECISION: 2 }], ["PR007", { DEPTH: 2, PRECISION: 2 }], ["PR010", { ACTION_TEMPO: 2, STRATEGY: 2 }],
  ["PR011", { LEARNING: 2, AUTONOMY: 2 }], ["PR012", { CURIOSITY: 2, CREATION: 2 }], ["PR013", { INITIATIVE: 2, PERSISTENCE: 2 }],
  ["PR015", { ACTION_TEMPO: -2, PERSISTENCE: 2 }], ["PR016", { INITIATIVE: 2, ADAPTABILITY: 2 }], ["PR017", { GOAL_DRIVE: 2, ADAPTABILITY: 2 }],
  ["PR018", { EXPANSION: 2, STABILITY: 2 }], ["PR019", { CHANGE_ORIENTATION: 2, STABILITY: 2 }],
  ["PR020", { INITIATIVE: 2, EXPANSION: 2, OPPORTUNITY_SENSE: 2, ADAPTABILITY: 2 }],
  ["PR021", { GOAL_DRIVE: 2, PRACTICALITY: 2 }], ["PR022", { CREATION: 2, EXPRESSION: 2 }], ["PR023", { EXPANSION: 2, PRECISION: 2 }],
  ["PR024", { CHANGE_ORIENTATION: 2, STABILITY: 2 }], ["PR026", { AUTONOMY: 2, DUTY: 2 }], ["PR027", { GOAL_DRIVE: 2, PRACTICALITY: 2 }],
  ["PR028", { GOAL_DRIVE: 2, EXPANSION: 2 }], ["PR029", { STATUS_DRIVE: 2, GOAL_DRIVE: 2 }],
  ["PR032", { COMPETITION: 2, GOAL_DRIVE: 2 }], ["PR034", { AUTONOMY: 2, CREATION: 2 }], ["PR035", { DUTY: 2, PRECISION: 2 }],
  ["PR036", { EXPANSION: 2, OPPORTUNITY_SENSE: 2 }], ["PR037", { RESOURCE_SENSE: 2, MEANING: 2 }], ["PR038", { RESOURCE_SENSE: 2, AUTONOMY: 2 }],
  ["PR039", { RESOURCE_SENSE: 2, STABILITY: 2 }], ["PR040", { RESOURCE_SENSE: 2, OPPORTUNITY_SENSE: 2 }], ["PR041", { RESOURCE_SENSE: 2, RISK_STYLE: -2 }],
  ["PR042", { RESOURCE_SENSE: 2, GOAL_DRIVE: 2, EXPANSION: 2 }], ["PR043", { RESOURCE_SENSE: 2, STATUS_DRIVE: 2 }],
  ["PR044", { STABILITY: 2, RESOURCE_SENSE: 2, DUTY: 2, OPPORTUNITY_SENSE: 2 }], ["PR047", { OPPORTUNITY_SENSE: 2, PRACTICALITY: 2 }],
  ["PR048", { RESOURCE_SENSE: 2, GOAL_DRIVE: 2, EXPANSION: 2, STATUS_DRIVE: 2 }],
  ["PR049", { SOCIAL_ATTUNEMENT: 2, CARE: 2 }], ["PR050", { SOCIAL_ATTUNEMENT: 2, AUTONOMY: 2 }],
  ["PR051", { COMMUNICATION_STYLE: 2, CARE: 2 }], ["PR052", { COMMUNICATION_STYLE: -2, BOUNDARY: 2 }],
  ["PR053", { PRECISION: 2, CARE: 2 }], ["PR054", { PRECISION: 2, COMMUNICATION_STYLE: 2 }], ["PR055", { CARE: 2, BOUNDARY: 2 }],
  ["PR056", { CARE: 2, SOCIAL_ATTUNEMENT: 2 }], ["PR057", { RELATION_STYLE: 2, AUTONOMY: 2 }],
  ["PR058", { ENERGY_DIRECTION: 2, RECOVERY_NEED: 2 }], ["PR059", { LEADERSHIP: 2, SOCIAL_ATTUNEMENT: 2 }],
  ["PR061", { CARE: 2, AUTONOMY: 2 }], ["PR062", { PRECISION: 2, SOCIAL_ATTUNEMENT: 2 }],
  ["PR063", { DEPTH: 2, CARE: 2 }], ["PR064", { STABILITY: 2, CARE: 2 }], ["PR065", { MEANING: 2, CARE: 2 }],
  ["PR066", { RELATION_STYLE: 2, BOUNDARY: 2 }], ["PR068", { SOCIAL_ATTUNEMENT: 2, DEPTH: 2 }], ["PR069", { CARE: 2, EXPRESSION: 2 }],
  ["PR070", { CARE: 2, ENERGY_DIRECTION: -2 }], ["PR071", { STABILITY: 2, CHANGE_ORIENTATION: 2 }], ["PR072", { CARE: 2, AUTONOMY: 2 }],
  ["PR073", { DUTY: 2, RECOVERY_NEED: 2 }], ["PR074", { GOAL_DRIVE: 2, DUTY: 2, DEPTH: 2 }],
  ["PR075", { RECOVERY_NEED: 2, DEPTH: 2 }], ["PR076", { SOCIAL_ATTUNEMENT: 2, RECOVERY_NEED: 2 }],
  ["PR079", { DEPTH: 2, RECOVERY_NEED: 2 }], ["PR081", { ENERGY_DIRECTION: 2, DEPTH: 2, RECOVERY_NEED: 2 }],
  ["PR084", { STABILITY: 2, RECOVERY_NEED: 2 }], ["PR085", { AUTONOMY: 2, ADAPTABILITY: 2 }], ["PR086", { AUTONOMY: 2, RELATION_STYLE: 2 }],
  ["PR087", { ENERGY_DIRECTION: -2, LEADERSHIP: 2 }], ["PR088", { CHARISMA: 2, RECOVERY_NEED: 2 }],
  ["PR089", { CARE: 2, AUTONOMY: 2 }], ["PR090", { STABILITY: 2, CHANGE_ORIENTATION: 2 }], ["PR091", { AUTONOMY: 2, PRECISION: 2 }],
  ["PR092", { CARE: 2, COMMUNICATION_STYLE: 2 }], ["PR093", { MEANING: 2, PRACTICALITY: 2 }], ["PR094", { STATUS_DRIVE: 2, AUTONOMY: 2 }],
  ["PR095", { EXPANSION: 2, PRECISION: 2 }], ["PR096", { DUTY: 2, AUTONOMY: 2 }],
];
