import { describe, expect, it } from "vitest";

import { extractSajuTags } from "@/lib/saju/extractTags";
import type { SajuCalcResult, TenGod } from "@/lib/saju/types";

function createBaseResult(
  distributionOverrides: Partial<Record<TenGod, number>>,
): SajuCalcResult {
  return {
    input: {
      birthDate: "2024-02-04",
      birthTime: "17:27",
      birthTimeUnknown: false,
      calendarType: "SOLAR",
      gender: "MALE",
      timezone: "Asia/Seoul",
    },
    converted: {
      solarDate: "2024-02-04",
    },
    pillars: {
      year: { stem: "甲", branch: "辰" },
      month: { stem: "丙", branch: "寅" },
      day: { stem: "丙", branch: "申" },
      hour: { stem: "丁", branch: "酉" },
    },
    dayMaster: "丙",
    tenGods: {
      stems: {},
      hiddenStems: [],
      distribution: {
        比肩: 0,
        劫財: 0,
        食神: 0,
        傷官: 0,
        偏財: 0,
        正財: 0,
        偏官: 0,
        正官: 0,
        偏印: 0,
        正印: 0,
        ...distributionOverrides,
      },
    },
    elements: {
      visible: {
        WOOD: 1,
        FIRE: 2,
        EARTH: 1,
        METAL: 1,
        WATER: 1,
      },
      weighted: {
        WOOD: 1,
        FIRE: 2,
        EARTH: 1,
        METAL: 1,
        WATER: 1,
      },
      labels: [],
    },
    yinYang: {
      yin: 3,
      yang: 3,
      label: "BALANCED",
    },
    relations: {
      stemCombinations: [],
      branchCombinations: [],
      branchClashes: [],
    },
    notices: [],
  };
}

function getCodes(result: SajuCalcResult): string[] {
  return extractSajuTags(result).map((tag) => tag.code);
}

describe("advanced Saju pattern tags", () => {
  it("emits WEALTH_OVERLOAD", () => {
    const result = createBaseResult({
      偏財: 1.5,
      正財: 1.5,
    });
    const tags = extractSajuTags(result);
    const tag = tags.find((item) => item.code === "WEALTH_OVERLOAD");

    expect(tag).toBeDefined();
    expect(tag?.category).toBe("ADVANCED_PATTERN");
    expect(tag?.severity).toBe("HIGH");
    expect(tag?.confidence).toBe("MEDIUM");
    expect(tag?.labelKo).toBe("재성 과다 후보");
    expect(tag?.evidence).toContain("advanced:WEALTH_OVERLOAD");
    expect(
      tag?.evidence.some((value) => value.startsWith("tenGodGroup:WEALTH=")),
    ).toBe(true);
  });

  it("emits WEAK_DAYMASTER_WITH_STRONG_WEALTH", () => {
    const result = createBaseResult({
      偏財: 1.5,
      正財: 1.0,
      比肩: 0.5,
      偏印: 0.5,
    });
    const tag = extractSajuTags(result).find(
      (item) => item.code === "WEAK_DAYMASTER_WITH_STRONG_WEALTH",
    );

    expect(tag).toBeDefined();
    expect(tag?.evidence).toContain(
      "advanced:WEAK_DAYMASTER_WITH_STRONG_WEALTH",
    );
    expect(
      tag?.evidence.some((value) => value.startsWith("supportScore=")),
    ).toBe(true);
  });

  it("emits OFFICER_PRESSURE_HIGH", () => {
    const result = createBaseResult({
      偏官: 1.5,
      正官: 1.0,
    });

    expect(getCodes(result)).toContain("OFFICER_PRESSURE_HIGH");
  });

  it("emits RESOURCE_SUPPORT_MISSING", () => {
    const result = createBaseResult({
      比肩: 1,
      劫財: 1,
      食神: 1,
    });

    expect(getCodes(result)).toContain("RESOURCE_SUPPORT_MISSING");
  });

  it("emits EXPRESSION_OUTPUT_MISSING", () => {
    const result = createBaseResult({
      比肩: 1,
      劫財: 1,
      偏印: 1,
    });

    expect(getCodes(result)).toContain("EXPRESSION_OUTPUT_MISSING");
  });

  it("emits FOOD_WEALTH_FLOW", () => {
    const result = createBaseResult({
      食神: 1.0,
      傷官: 0.5,
      偏財: 1.0,
      正財: 0.5,
    });

    expect(getCodes(result)).toContain("FOOD_WEALTH_FLOW");
  });

  it("emits KILLING_RESOURCE_FLOW", () => {
    const result = createBaseResult({
      偏官: 1.0,
      正官: 0.5,
      偏印: 1.0,
      正印: 0.5,
    });

    expect(getCodes(result)).toContain("KILLING_RESOURCE_FLOW");
  });

  it("emits MIXED_OFFICER_KILLING", () => {
    const result = createBaseResult({
      偏官: 0.5,
      正官: 0.5,
    });

    expect(getCodes(result)).toContain("MIXED_OFFICER_KILLING");
  });

  it("emits HURTING_OFFICER_SEES_OFFICER", () => {
    const result = createBaseResult({
      傷官: 0.5,
      正官: 0.5,
    });

    expect(getCodes(result)).toContain("HURTING_OFFICER_SEES_OFFICER");
  });

  it("emits PEER_OVERLOAD", () => {
    const result = createBaseResult({
      比肩: 1.5,
      劫財: 1.5,
    });

    expect(getCodes(result)).toContain("PEER_OVERLOAD");
  });

  it("emits RESOURCE_OVERLOAD", () => {
    const result = createBaseResult({
      偏印: 1.5,
      正印: 1.5,
    });

    expect(getCodes(result)).toContain("RESOURCE_OVERLOAD");
  });

  it("orders advanced tags before relation tags", () => {
    const result = createBaseResult({
      偏財: 1.5,
      正財: 1.5,
    });
    result.relations.branchClashes = ["year-day:子午"];

    const codes = getCodes(result);

    expect(codes).toContain("WEALTH_OVERLOAD");
    expect(codes).toContain("BRANCH_CLASH_PRESENT");
    expect(codes.indexOf("WEALTH_OVERLOAD")).toBeLessThan(
      codes.indexOf("BRANCH_CLASH_PRESENT"),
    );
  });

  it("uses safe text for all advanced tags", () => {
    const forbiddenWords = [
      "무" + "조건",
      "반" + "드시",
      "운" + "명",
      "죽" + "음",
      "사고가 " + "난다",
      "바람기가 " + "있다",
      "돈복이 " + "있다",
      "결혼" + "한다",
      "망" + "한다",
    ];
    const fixtures = [
      createBaseResult({ 偏財: 1.5, 正財: 1.5 }),
      createBaseResult({ 偏財: 1.5, 正財: 1.0, 比肩: 0.5, 偏印: 0.5 }),
      createBaseResult({ 偏官: 1.5, 正官: 1.0 }),
      createBaseResult({ 比肩: 1, 劫財: 1, 食神: 1 }),
      createBaseResult({ 比肩: 1, 劫財: 1, 偏印: 1 }),
      createBaseResult({ 食神: 1.0, 傷官: 0.5, 偏財: 1.0, 正財: 0.5 }),
      createBaseResult({ 偏官: 1.0, 正官: 0.5, 偏印: 1.0, 正印: 0.5 }),
      createBaseResult({ 偏官: 0.5, 正官: 0.5 }),
      createBaseResult({ 傷官: 0.5, 正官: 0.5 }),
      createBaseResult({ 比肩: 1.5, 劫財: 1.5 }),
      createBaseResult({ 偏印: 1.5, 正印: 1.5 }),
    ];

    for (const result of fixtures) {
      const advancedTags = extractSajuTags(result).filter(
        (tag) => tag.category === "ADVANCED_PATTERN",
      );

      for (const tag of advancedTags) {
        for (const word of forbiddenWords) {
          expect(tag.descriptionKo).not.toContain(word);
        }
      }
    }
  });

  it("extracts advanced tags deterministically", () => {
    const result = createBaseResult({
      偏財: 1.5,
      正財: 1.5,
      偏官: 1.5,
      正官: 1.0,
    });

    expect(extractSajuTags(result)).toEqual(extractSajuTags(result));
  });
});
