import { NARRATIVE_FIXTURES } from "./narrativeFixtures";
import { LOVE_FIXTURES } from "./loveFixtures";
import { COMPATIBILITY_NARRATIVE_FIXTURES } from "./compatibilityFixtures";
import { MAJOR_NARRATIVE_FIXTURES, MAJOR_EVALUATED_AT } from "./majorFixtures";
import { ANNUAL_NARRATIVE_FIXTURES } from "./annualFixtures";

export const SHADOW_CLOCK = { evaluatedAt: MAJOR_EVALUATED_AT };
export function singleRuntimeInput(productKey: string, productSlug: string, f = NARRATIVE_FIXTURES[0], slot = "") {
  return { productKey, productSlug, person: { name: f.name, birthDate: f.date, birthTime: f.time ?? "", mbtiType: f.mbti ?? "", gender: f.gender,
    birthTimeUnknown: !f.time && !slot, birthTimePrecision: slot ? "approximate" : f.time ? "exact" : "unknown", approximateBirthTimeSlot: slot },
    userContext: { ...f.context, focusAreas: [] }, productOptions: { contentVersion: "v3" } };
}
export const RUNTIME_FIXTURES = [
  { id: "comprehensive", payload: singleRuntimeInput("saju_mbti_full", "saju-mbti-full") },
  { id: "career", payload: singleRuntimeInput("career_money_study", "career-money-study", NARRATIVE_FIXTURES[9]) },
  { id: "love", payload: singleRuntimeInput("love_marriage_child", "love-marriage-child", LOVE_FIXTURES[0]) },
  { id: "compatibility", payload: COMPATIBILITY_NARRATIVE_FIXTURES[0].payload },
  { id: "major", payload: MAJOR_NARRATIVE_FIXTURES[5].payload },
  { id: "annual", payload: ANNUAL_NARRATIVE_FIXTURES[0].payload },
];
