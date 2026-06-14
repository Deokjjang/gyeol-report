import { describe, expect, it } from "vitest";

import {
  extractComputedSajuFeatures,
  SAJU_FEATURE_EXTRACTION_RULESET_VERSION,
} from "../../../src/lib/report-knowledge";

function extractFeatureIds(
  input: Parameters<typeof extractComputedSajuFeatures>[0],
): readonly string[] {
  return extractComputedSajuFeatures(input).featureIds;
}

describe("saju computed feature extractor", () => {
  it("uses a versioned deterministic rule set", () => {
    const result = extractComputedSajuFeatures({ dayPillar: "甲申" });

    expect(result.ruleSetVersion).toBe(SAJU_FEATURE_EXTRACTION_RULESET_VERSION);
    expect(result.ruleSetVersion).toBe("v1");
  });

  it("extracts day pillar element ten-god pattern and existing aliases", () => {
    const result = extractComputedSajuFeatures({
      yearPillar: "丙子",
      monthPillar: "己亥",
      dayPillar: "甲申",
      hourPillar: "丁未",
      dayMaster: "甲",
      earthlyBranches: ["子", "亥", "申", "未"],
      heavenlyStems: ["丙", "己", "甲", "丁"],
      excessiveElements: ["earth"],
      missingElements: ["fire", "water"],
      tenGodSignals: [
        { tenGod: "편재", strength: "strong" },
        { tenGod: "정재", strength: "present" },
        { tenGod: "편인", strength: "missing" },
      ],
      specialPatterns: ["재다신약", "무인성", "무식상"],
      existingSinsal: [
        "귀문살",
        "백호살",
        "도화",
        "홍염",
        "반안",
        "장성",
        "역마",
        "화개",
      ],
      existingGwiin: ["천을귀인", "문창", "재고", "금여록", "암록"],
    });

    expect(result.featureIds).toEqual(
      expect.arrayContaining([
        "day_pillar_gapsin",
        "element_earth_excess",
        "element_fire_missing",
        "element_water_missing",
        "ten_god_pian_cai",
        "ten_god_zheng_cai",
        "structure_jaeda_sinyak",
        "structure_no_resource",
        "structure_no_output",
        "sinsal_gwimun",
        "sinsal_baekho",
        "sinsal_dohwa",
        "sinsal_hongyeom",
        "twelve_sinsal_banan",
        "twelve_sinsal_jangseong",
        "twelve_sinsal_yeokma",
        "twelve_sinsal_hwagae",
        "gwiin_cheoneul",
        "gwiin_munchang",
        "gwiin_jaego",
        "gwiin_geumyeorok",
        "gwiin_amrok",
      ]),
    );
    expect(result.featureIds).not.toContain("ten_god_pian_yin");
    expect(result.featureIds).toEqual([...new Set(result.featureIds)]);
    expect(result.details.some((detail) => detail.confidence === "computed")).toBe(
      true,
    );
    expect(
      result.details.some((detail) => detail.confidence === "existing_fact"),
    ).toBe(true);
  });

  it("extracts twelve-sinsal from the sin-ja-jin group", () => {
    expect(
      extractFeatureIds({
        dayPillar: "甲申",
        earthlyBranches: ["子", "丑", "寅", "辰"],
      }),
    ).toEqual(
      expect.arrayContaining([
        "twelve_sinsal_jangseong",
        "twelve_sinsal_banan",
        "twelve_sinsal_yeokma",
        "twelve_sinsal_hwagae",
      ]),
    );
  });

  it("extracts twelve-sinsal from the in-o-sul group", () => {
    expect(
      extractFeatureIds({
        dayPillar: "甲寅",
        earthlyBranches: ["午", "未", "申", "戌"],
      }),
    ).toEqual(
      expect.arrayContaining([
        "twelve_sinsal_jangseong",
        "twelve_sinsal_banan",
        "twelve_sinsal_yeokma",
        "twelve_sinsal_hwagae",
      ]),
    );
  });

  it("extracts twelve-sinsal from the hae-myo-mi group", () => {
    expect(
      extractFeatureIds({
        dayPillar: "乙亥",
        earthlyBranches: ["卯", "辰", "巳", "未"],
      }),
    ).toEqual(
      expect.arrayContaining([
        "twelve_sinsal_jangseong",
        "twelve_sinsal_banan",
        "twelve_sinsal_yeokma",
        "twelve_sinsal_hwagae",
      ]),
    );
  });

  it("extracts twelve-sinsal from the sa-yu-chuk group", () => {
    expect(
      extractFeatureIds({
        dayPillar: "乙巳",
        earthlyBranches: ["酉", "戌", "亥", "丑"],
      }),
    ).toEqual(
      expect.arrayContaining([
        "twelve_sinsal_jangseong",
        "twelve_sinsal_banan",
        "twelve_sinsal_yeokma",
        "twelve_sinsal_hwagae",
      ]),
    );
  });

  it("extracts minimum major gwiin from day master and branch fixtures", () => {
    expect(
      extractFeatureIds({ dayMaster: "甲", earthlyBranches: ["丑"] }),
    ).toContain("gwiin_cheoneul");
    expect(
      extractFeatureIds({ dayMaster: "甲", earthlyBranches: ["巳"] }),
    ).toContain("gwiin_munchang");
    expect(
      extractFeatureIds({ dayMaster: "甲", earthlyBranches: ["辰"] }),
    ).toEqual(expect.arrayContaining(["gwiin_jaego", "gwiin_geumyeorok"]));
    expect(
      extractFeatureIds({ dayMaster: "甲", earthlyBranches: ["亥"] }),
    ).toContain("gwiin_amrok");
  });

  it("extracts major sinsal from stable rule tables and relation pairs", () => {
    expect(extractFeatureIds({ dayPillar: "甲辰" })).toContain("sinsal_baekho");
    expect(extractFeatureIds({ dayPillar: "庚辰" })).toContain("sinsal_goegang");
    expect(
      extractFeatureIds({ dayMaster: "甲", earthlyBranches: ["卯"] }),
    ).toEqual(expect.arrayContaining(["sinsal_yangin", "sinsal_hyeonchim"]));
    expect(
      extractFeatureIds({ dayPillar: "甲申", earthlyBranches: ["酉"] }),
    ).toContain("sinsal_dohwa");
    expect(extractFeatureIds({ earthlyBranches: ["子", "酉"] })).toContain(
      "sinsal_gwimun",
    );
    expect(extractFeatureIds({ earthlyBranches: ["子", "未"] })).toContain(
      "sinsal_wonjin",
    );
  });

  it("does not invent unsupported aliases or duplicate features", () => {
    const result = extractComputedSajuFeatures({
      existingSinsal: ["없는살", "홍염살", "홍염"],
      existingGwiin: ["없는귀인", "천을귀인", "천을"],
    });

    expect(result.featureIds).toEqual(["sinsal_hongyeom", "gwiin_cheoneul"]);
  });
});
