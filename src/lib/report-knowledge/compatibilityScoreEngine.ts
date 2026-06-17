import type {
  CompatibilityRelationshipType,
  CompatibilityScoreBreakdown,
  CompatibilityScoreResult,
} from "./compatibilityTypes";
import type { CompatibilityMbtiBridgeResult } from "./compatibilityMbtiBridge";
import type { CompatibilitySajuBridgeResult } from "./compatibilitySajuBridge";
import type {
  CompatibilityDeepSajuBridgeResult,
  CompatibilityDeepSajuLayer,
} from "./compatibilityDeepSajuBridge";

export type ScoreCompatibilityInput = {
  readonly sajuBridge: CompatibilitySajuBridgeResult;
  readonly deepSajuBridge?: CompatibilityDeepSajuBridgeResult;
  readonly mbtiBridge: CompatibilityMbtiBridgeResult;
  readonly relationshipType: CompatibilityRelationshipType;
  readonly birthTimeConfidence: {
    readonly personA: "known" | "unknown";
    readonly personB: "known" | "unknown";
  };
};

const scoreCaution =
  "이 점수는 관계의 성공이나 실패를 단정하는 값이 아니라, 두 사람의 사주·MBTI 구조에서 잘 맞는 지점과 조정이 필요한 지점을 보기 쉽게 정리한 값입니다.";

function clampScore(score: number): number {
  return Math.max(35, Math.min(95, Math.round(score)));
}

function getScoreLabel(totalScore: number): string {
  if (totalScore >= 85) {
    return "강한 끌림과 보완이 있는 궁합";
  }
  if (totalScore >= 75) {
    return "잘 맞는 지점이 분명한 궁합";
  }
  if (totalScore >= 65) {
    return "맞는 부분과 조정할 부분이 함께 있는 궁합";
  }
  if (totalScore >= 55) {
    return "조율 장치가 필요한 궁합";
  }

  return "감정만으로 밀면 피로가 커질 수 있는 궁합";
}

function sumImpacts(
  input: ScoreCompatibilityInput,
  sections: readonly string[],
): number {
  const sajuImpact = input.sajuBridge.evidenceItems
    .filter((item) => sections.includes(item.section))
    .reduce((sum, item) => sum + item.scoreImpact, 0);
  const mbtiImpact = input.mbtiBridge.evidenceItems
    .filter((item) => sections.includes(item.section))
    .reduce((sum, item) => sum + item.scoreImpact, 0);

  return sajuImpact + mbtiImpact;
}

function sumDeepImpacts(
  input: ScoreCompatibilityInput,
  layers: readonly CompatibilityDeepSajuLayer[],
): number {
  return (
    input.deepSajuBridge?.notes
      .filter((note) => layers.includes(note.layer))
      .reduce((sum, note) => sum + note.scoreImpact, 0) ?? 0
  );
}

function hasDeepLayer(
  input: ScoreCompatibilityInput,
  layer: CompatibilityDeepSajuLayer,
): boolean {
  return input.deepSajuBridge?.notes.some((note) => note.layer === layer) ?? false;
}

function mbtiSpeedMismatchPenalty(input: ScoreCompatibilityInput): number {
  return input.mbtiBridge.pairLabel === "ENTJ + INTP" ||
    input.mbtiBridge.pairLabel === "INTP + ENTJ"
    ? -5
    : 0;
}

function unknownTimePenalty(input: ScoreCompatibilityInput): number {
  const unknownCount = [
    input.birthTimeConfidence.personA,
    input.birthTimeConfidence.personB,
  ].filter((value) => value === "unknown").length;

  return unknownCount * 2;
}

export function scoreCompatibility(
  input: ScoreCompatibilityInput,
): CompatibilityScoreResult {
  const confidencePenalty = unknownTimePenalty(input);
  const relationshipBonus =
    input.relationshipType === "marriage" ? 1 : input.relationshipType === "some" ? 0 : 2;

  const breakdown: CompatibilityScoreBreakdown = {
    attraction: clampScore(
      65 +
        relationshipBonus +
        sumImpacts(input, ["attraction", "overview", "two_charts", "strengths"]) +
        sumDeepImpacts(input, [
          "day_master_relation",
          "cross_ten_god",
          "branch_trine",
        ]),
    ),
    communication: clampScore(
      65 +
        sumImpacts(input, ["communication", "relationship_scenes"]) +
        sumDeepImpacts(input, ["cross_ten_god"]) +
        mbtiSpeedMismatchPenalty(input),
    ),
    lifestyleRhythm: clampScore(
      65 +
        sumImpacts(input, ["money_lifestyle", "two_charts"]) +
        sumDeepImpacts(input, [
          "combined_element_climate",
          "month_rhythm",
          "hour_life_rhythm",
        ]) -
        confidencePenalty,
    ),
    conflictRecovery: clampScore(
      65 +
        sumImpacts(input, ["frictions", "conflict_recovery", "communication"]) +
        sumDeepImpacts(input, ["branch_clash", "branch_harm", "spouse_palace"]),
    ),
    longTermStability: clampScore(
      65 +
        sumImpacts(input, ["long_term", "money_lifestyle"]) +
        sumDeepImpacts(input, [
          "element_complement",
          "branch_trine",
          "combined_element_climate",
        ]) -
        confidencePenalty,
    ),
    growthComplement: clampScore(
      65 +
        sumImpacts(input, ["strengths", "final_advice"]) +
        sumDeepImpacts(input, ["element_complement", "day_master_relation"]) +
        (hasDeepLayer(input, "element_complement") ? 0 : relationshipBonus),
    ),
  };

  const totalScore = clampScore(
    breakdown.attraction * 0.18 +
      breakdown.communication * 0.18 +
      breakdown.lifestyleRhythm * 0.16 +
      breakdown.conflictRecovery * 0.16 +
      breakdown.longTermStability * 0.18 +
      breakdown.growthComplement * 0.14,
  );

  return {
    totalScore,
    breakdown,
    scoreLabel: getScoreLabel(totalScore),
    scoreCaution,
  };
}
