/** P3.8 재시험 사례: 커리어 c1, 궁합 부모·자녀, 대운 X, 종합 c1(반복 회귀 확인). */
import type { BriefInput } from "../../src/lib/brief";
import { PEOPLE } from "../p35/people";
import { P36_PEOPLE } from "../p36/people";

const BASE = "2026-10-30";
export const CASES: Record<string, { input: BriefInput; customers: readonly string[] }> = {
  "c1-career": { input: { product: "career_money_study", baseDate: BASE, person: PEOPLE.c1 }, customers: ["c1"] },
  "pair-parent": { input: { product: "saju_mbti_compatibility", baseDate: BASE, person: P36_PEOPLE.parent, partner: P36_PEOPLE.child, relationshipType: "parentChild" }, customers: ["parent", "child"] },
  "x-major": { input: { product: "major_fortune", baseDate: BASE, person: PEOPLE.x }, customers: ["x"] },
  "c1-full": { input: { product: "saju_mbti_full", baseDate: BASE, person: PEOPLE.c1 }, customers: ["c1"] },
};
