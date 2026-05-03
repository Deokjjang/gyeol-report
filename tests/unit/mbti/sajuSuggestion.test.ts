import { describe, expect, it } from "vitest";
import { evaluateSajuMbtiSuggestion } from "@/lib/mbti/sajuSuggestion";
import type { MbtiType } from "@/lib/mbti/types";
import type { SajuTag, SajuTagCode } from "@/lib/saju/tags";

function createTag(code: SajuTagCode, labelKo?: string): SajuTag {
  return {
    code,
    category: "ADVANCED_PATTERN",
    severity: "MEDIUM",
    confidence: "MEDIUM",
    labelKo: labelKo ?? code,
    descriptionKo: `${labelKo ?? code} 설명`,
    evidence: [`tag:${code}`],
  };
}

function evaluate(tags: readonly SajuTag[], userType: MbtiType) {
  return evaluateSajuMbtiSuggestion({
    sajuTags: tags,
    userType,
  });
}

const fullTypeTags = [
  createTag("TEN_GOD_OUTPUT_STRONG"),
  createTag("EARTH_STRONG"),
  createTag("OFFICER_PRESSURE_HIGH"),
  createTag("SHINSAL_YEOKMASAL"),
];

describe("evaluateSajuMbtiSuggestion", () => {
  it("returns UNRESOLVED when no rules match", () => {
    const result = evaluate([], "ENTJ");

    expect(result.axisSuggestions).toEqual([]);
    expect(result.typeSuggestion).toBeUndefined();
    expect(result.comparison.direction).toBe("UNRESOLVED");
    expect(result.comparison.summaryKo).toBe(
      "현재 사주 태그만으로는 MBTI 축을 충분히 좁히기 어렵습니다.",
    );
    expect(result.notices).toContain(
      "입력한 MBTI는 사용자의 자기보고 정보로 존중하며, 사주 기반 제안은 보조 해석으로만 사용합니다.",
    );
  });

  it("matches required tags only", () => {
    const result = evaluate([createTag("TEN_GOD_OUTPUT_STRONG")], "ENTJ");

    expect(result.axisSuggestions).toHaveLength(1);
    expect(result.axisSuggestions[0]?.axis).toBe("EI");
    expect(result.axisSuggestions[0]?.suggestedSide).toBe("E");
  });

  it("orders evidence with required tags before supporting tags", () => {
    const result = evaluate(
      [
        createTag("TEN_GOD_OUTPUT_STRONG"),
        createTag("SHINSAL_DOHWASAL"),
        createTag("SHINSAL_HONGYEOMSAL"),
      ],
      "ENTJ",
    );
    const suggestion = result.axisSuggestions.find(
      (item) => item.axis === "EI" && item.suggestedSide === "E",
    );

    expect(suggestion?.evidence.map((item) => item.sajuTagCode)).toEqual([
      "TEN_GOD_OUTPUT_STRONG",
      "SHINSAL_DOHWASAL",
      "SHINSAL_HONGYEOMSAL",
    ]);
    expect(suggestion?.confidence).toBe("HIGH");
  });

  it("creates full type suggestion when all four axes are selected", () => {
    const result = evaluate(fullTypeTags, "ESTJ");

    expect(result.typeSuggestion?.suggestedType).toBe("ESTJ");
    expect(result.typeSuggestion?.matchedAxes).toEqual([
      "EI",
      "SN",
      "TF",
      "JP",
    ]);
    expect(result.typeSuggestion?.unresolvedAxes).toEqual([]);
  });

  it("returns MATCH when suggested type matches user type", () => {
    const result = evaluate(fullTypeTags, "ESTJ");

    expect(result.comparison.direction).toBe("MATCH");
    expect(result.comparison.matchingAxes).toHaveLength(4);
    expect(result.comparison.tensionAxes).toEqual([]);
  });

  it("returns TENSION when no axis matches", () => {
    const result = evaluate(fullTypeTags, "INFP");

    expect(result.comparison.direction).toBe("TENSION");
    expect(result.comparison.matchingAxes).toEqual([]);
    expect(result.comparison.tensionAxes).toEqual(["EI", "SN", "TF", "JP"]);
  });

  it("returns PARTIAL_MATCH when some axes match and some differ", () => {
    const result = evaluate(fullTypeTags, "ENTJ");

    expect(result.comparison.direction).toBe("PARTIAL_MATCH");
    expect(result.comparison.matchingAxes).toEqual(["EI", "TF", "JP"]);
    expect(result.comparison.tensionAxes).toEqual(["SN"]);
  });

  it("returns partial match when selected axes do not form a full type", () => {
    const result = evaluate([createTag("TEN_GOD_OUTPUT_STRONG")], "ENTP");

    expect(result.axisSuggestions).toHaveLength(1);
    expect(result.typeSuggestion).toBeUndefined();
    expect(result.comparison.direction).toBe("PARTIAL_MATCH");
  });

  it("uses rule order as duplicate axis tie-breaker on equal strength and confidence", () => {
    const result = evaluate(
      [
        createTag("TEN_GOD_OUTPUT_STRONG"),
        createTag("EARTH_STRONG"),
        createTag("SHINSAL_HWAGAE"),
        createTag("OFFICER_PRESSURE_HIGH"),
        createTag("SHINSAL_YEOKMASAL"),
      ],
      "ESTJ",
    );

    expect(result.typeSuggestion?.suggestedType).toBe("ESTJ");
  });

  it("lets stronger supporting evidence beat rule order by confidence", () => {
    const result = evaluate(
      [
        createTag("TEN_GOD_OUTPUT_STRONG"),
        createTag("EARTH_STRONG"),
        createTag("SHINSAL_HWAGAE"),
        createTag("SHINSAL_MUN_CHANG_GWIIN"),
        createTag("SHINSAL_HAK_DANG_GWIIN"),
        createTag("OFFICER_PRESSURE_HIGH"),
        createTag("SHINSAL_YEOKMASAL"),
        createTag("SHINSAL_DOHWASAL"),
        createTag("WATER_STRONG"),
      ],
      "ENTP",
    );

    expect(result.typeSuggestion).toBeDefined();
    expect(result.typeSuggestion?.suggestedType).toBe("ENTP");
  });

  it("deduplicates notices", () => {
    const result = evaluate(fullTypeTags, "ESTJ");

    expect(new Set(result.notices).size).toBe(result.notices.length);
    expect(result.notices).toContain(
      "사주 기반 MBTI 후보는 확정 판정이 아니라 자기이해를 돕기 위한 비교 기준입니다.",
    );
  });

  it("uses safe wording", () => {
    const forbiddenWords = [
      "\uBB34\uC870\uAC74",
      "\uBC18\uB4DC\uC2DC",
      "\uC6B4\uBA85",
      "\uC8FD\uC74C",
      "\uC0AC\uACE0\uAC00 \uB09C\uB2E4",
      "\uBC14\uB78C\uAE30\uAC00 \uC788\uB2E4",
      "\uB3C8\uBCF5\uC774 \uC788\uB2E4",
      "\uACB0\uD63C\uD55C\uB2E4",
      "\uB9DD\uD55C\uB2E4",
      "\uC808\uB300",
      "\uD56D\uC0C1",
      "\uD2C0\uB838\uB2E4",
    ];
    const result = evaluate(
      [
        createTag("TEN_GOD_OUTPUT_STRONG"),
        createTag("EARTH_STRONG"),
        createTag("SHINSAL_HWAGAE"),
        createTag("SHINSAL_MUN_CHANG_GWIIN"),
        createTag("SHINSAL_HAK_DANG_GWIIN"),
        createTag("OFFICER_PRESSURE_HIGH"),
        createTag("SHINSAL_HONGYEOMSAL"),
        createTag("SHINSAL_YEOKMASAL"),
        createTag("SHINSAL_DOHWASAL"),
        createTag("WATER_STRONG"),
      ],
      "ENTJ",
    );
    const texts = [
      ...result.axisSuggestions.flatMap((item) => [
        item.titleKo,
        item.summaryKo,
      ]),
      ...(result.typeSuggestion ? [result.typeSuggestion.summaryKo] : []),
      result.comparison.summaryKo,
      ...result.notices,
    ];

    for (const text of texts) {
      for (const word of forbiddenWords) {
        expect(text).not.toContain(word);
      }
    }
  });

  it("is deterministic", () => {
    expect(evaluate(fullTypeTags, "ESTJ")).toEqual(
      evaluate(fullTypeTags, "ESTJ"),
    );
  });
});
