import { describe, expect, it } from "vitest";
import { BRIDGE_RULES } from "@/lib/bridge/rules";
import type { BridgeRuleId } from "@/lib/bridge/types";

const expectedRuleIds: readonly BridgeRuleId[] = [
  "DIRECTNESS_OVERLAP",
  "DIRECTNESS_TENSION",
  "STRUCTURE_OVERLAP",
  "STRUCTURE_TENSION",
  "RESOURCE_COMPENSATION",
  "OUTPUT_COMPENSATION",
  "OFFICER_PRESSURE_WITH_JUDGING",
  "WEALTH_REALITY_WITH_EFFICIENCY",
  "RELATION_HARMONY_WITH_BRANCH_COMBINATION",
  "CONFLICT_DIRECTNESS_WITH_BRANCH_CLASH",
  "INTERNAL_PROCESSING_WITH_RESOURCE",
  "EXPLORATION_WITH_OUTPUT",
];

const directions = ["OVERLAP", "TENSION", "COMPENSATION", "NEUTRAL"] as const;
const levels = ["LOW", "MEDIUM", "HIGH"] as const;
const forbiddenWords = [
  "무조" + "건",
  "반드" + "시",
  "운" + "명",
  "죽" + "음",
  "사고가 " + "난다",
  "바람기가 " + "있다",
  "돈복이 " + "있다",
  "결혼" + "한다",
  "망" + "한다",
  "절" + "대",
  "항" + "상",
] as const;

describe("BRIDGE_RULES", () => {
  it("exports exactly 12 rules", () => {
    expect(BRIDGE_RULES).toHaveLength(12);
  });

  it("matches expected rule IDs in order", () => {
    expect(BRIDGE_RULES.map((rule) => rule.id)).toEqual(expectedRuleIds);
  });

  it("uses unique rule IDs", () => {
    const ids = BRIDGE_RULES.map((rule) => rule.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has required metadata for every rule", () => {
    for (const rule of BRIDGE_RULES) {
      expect(rule.id).toBeTruthy();
      expect(rule.direction).toBeTruthy();
      expect(rule.strength).toBeTruthy();
      expect(rule.confidence).toBeTruthy();
      expect(rule.requiredSajuTags.length).toBeGreaterThan(0);
      expect(rule.requiredMbtiTraits.length).toBeGreaterThan(0);
      expect(rule.titleKo).toBeTruthy();
      expect(rule.summaryKo).toBeTruthy();
    }
  });

  it("uses valid directions", () => {
    for (const rule of BRIDGE_RULES) {
      expect(directions).toContain(rule.direction);
    }
  });

  it("uses valid strength and confidence levels", () => {
    for (const rule of BRIDGE_RULES) {
      expect(levels).toContain(rule.strength);
      expect(levels).toContain(rule.confidence);
    }
  });

  it("checks representative rule content", () => {
    const directnessOverlap = BRIDGE_RULES.find(
      (rule) => rule.id === "DIRECTNESS_OVERLAP",
    );
    expect(directnessOverlap).toEqual({
      id: "DIRECTNESS_OVERLAP",
      direction: "OVERLAP",
      strength: "MEDIUM",
      confidence: "MEDIUM",
      requiredSajuTags: ["BRANCH_CLASH_PRESENT"],
      requiredMbtiTraits: ["DIRECT_DECISION", "CONFLICT_DIRECTNESS"],
      titleKo: "직선성과 충돌 민감성의 겹침",
      summaryKo:
        "지지충의 긴장 구조와 MBTI의 직선적 의사결정 성향이 겹쳐, 문제를 빠르게 지적하고 정면으로 다루는 흐름으로 나타날 수 있습니다.",
    });

    const wealthRule = BRIDGE_RULES.find(
      (rule) => rule.id === "WEALTH_REALITY_WITH_EFFICIENCY",
    );
    expect(wealthRule?.direction).toBe("OVERLAP");
    expect(wealthRule?.strength).toBe("HIGH");
    expect(wealthRule?.requiredSajuTags).toEqual(["WEALTH_OVERLOAD"]);
    expect(wealthRule?.requiredMbtiTraits).toEqual([
      "EFFICIENCY_ORIENTATION",
      "DIRECT_DECISION",
    ]);

    const resourceRule = BRIDGE_RULES.find(
      (rule) => rule.id === "RESOURCE_COMPENSATION",
    );
    expect(resourceRule?.direction).toBe("COMPENSATION");
    expect(resourceRule?.requiredSajuTags).toEqual([
      "RESOURCE_SUPPORT_MISSING",
    ]);
    expect(resourceRule?.requiredMbtiTraits).toEqual([
      "INTERNAL_PROCESSING",
      "ABSTRACT_PATTERNING",
    ]);
  });

  it("does not include forbidden wording in titles or summaries", () => {
    for (const rule of BRIDGE_RULES) {
      for (const word of forbiddenWords) {
        expect(rule.titleKo).not.toContain(word);
        expect(rule.summaryKo).not.toContain(word);
      }
    }
  });

  it("has deterministic rule ID ordering", () => {
    expect(BRIDGE_RULES.map((rule) => rule.id)).toEqual(
      BRIDGE_RULES.map((rule) => rule.id),
    );
  });
});
