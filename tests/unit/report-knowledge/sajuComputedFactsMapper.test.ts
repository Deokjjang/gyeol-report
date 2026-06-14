import { describe, expect, it } from "vitest";

import {
  mapComputedSajuFactsToFeatureIds,
  mapComputedSajuFactsToKnowledgeEntryIds,
  type MappedSajuKnowledgeInput,
} from "../../../src/lib/report-knowledge/sajuComputedFactsMapper";
import { SAJU_FEATURE_EXTRACTION_RULESET_VERSION } from "../../../src/lib/report-knowledge/sajuFeatureExtractionRules";
import type { ComputedSajuFacts } from "../../../src/lib/report-knowledge/sajuComputedFactsTypes";

const deokminSampleFacts = {
  dayMaster: "갑",
  dayPillar: "갑신",
  fiveElementCounts: {
    wood: 2,
    fire: 0,
    earth: 4,
    metal: 2,
    water: 0,
  },
  excessiveElements: ["earth"],
  missingElements: ["fire", "water"],
  usefulElements: ["water", "wood"],
  tenGodSignals: [
    { tenGod: "pian_cai", strength: "strong" },
    { tenGod: "zheng_cai", strength: "present" },
    { tenGod: "zheng_guan", strength: "strong" },
    { tenGod: "qi_sha", strength: "strong" },
    { tenGod: "zheng_yin", strength: "missing" },
    { tenGod: "shi_shen", strength: "missing" },
  ],
  specialPatterns: ["jaeda_sinyak", "no_resource", "no_output"],
  sinsal: ["hyeonchim", "hongyeom", "gwimun", "wonjin"],
  gwiin: ["jaego"],
} as const satisfies ComputedSajuFacts;

function expectIncludes(input: MappedSajuKnowledgeInput, ids: readonly string[]): void {
  expect(input.sajuEntryIds).toEqual(expect.arrayContaining(ids));
}

describe("saju computed facts mapper", () => {
  it("maps day master and day pillar to knowledge entries", () => {
    const mapped = mapComputedSajuFactsToKnowledgeEntryIds(deokminSampleFacts);

    expect(mapped.sajuEntryIds.slice(0, 2)).toEqual([
      "day_master_gabmok",
      "day_pillar_gapsin",
    ]);
  });

  it("maps present element facts and excessive or missing balance entries", () => {
    const mapped = mapComputedSajuFactsToKnowledgeEntryIds(deokminSampleFacts);

    expectIncludes(mapped, [
      "element_wood",
      "element_earth",
      "element_metal",
      "element_earth_excess",
      "element_fire_missing",
      "element_water_missing",
    ]);
  });

  it("maps present strong and excessive ten gods but not missing or weak signals", () => {
    const mapped = mapComputedSajuFactsToKnowledgeEntryIds({
      ...deokminSampleFacts,
      tenGodSignals: [
        ...deokminSampleFacts.tenGodSignals,
        { tenGod: "pian_yin", strength: "weak" },
        { tenGod: "jie_cai", strength: "excessive" },
      ],
    });

    expectIncludes(mapped, [
      "ten_god_pian_cai",
      "ten_god_zheng_cai",
      "ten_god_zheng_guan",
      "ten_god_qi_sha",
      "ten_god_jie_cai",
    ]);
    expect(mapped.sajuEntryIds).not.toContain("ten_god_zheng_yin");
    expect(mapped.sajuEntryIds).not.toContain("ten_god_shi_shen");
    expect(mapped.sajuEntryIds).not.toContain("ten_god_pian_yin");
  });

  it("maps special patterns, sinsal, and gwiin", () => {
    const mapped = mapComputedSajuFactsToKnowledgeEntryIds(deokminSampleFacts);

    expectIncludes(mapped, [
      "pattern_jaeda_sinyak",
      "pattern_no_resource",
      "pattern_no_output",
      "sinsal_hyeonchim",
      "sinsal_hongyeom",
      "sinsal_gwimun",
      "sinsal_wonjin",
      "gwiin_jaego",
    ]);
  });

  it("maps feature ids through the versioned computed feature extractor", () => {
    const mapped = mapComputedSajuFactsToFeatureIds({
      ...deokminSampleFacts,
      yearPillar: "병자",
      monthPillar: "기해",
      hourPillar: "정미",
      earthlyBranches: ["子", "亥", "申", "未"],
      heavenlyStems: ["丙", "己", "甲", "丁"],
    });

    expect(SAJU_FEATURE_EXTRACTION_RULESET_VERSION).toBe("v1");
    expect(mapped.featureIds).toEqual(
      expect.arrayContaining([
        "day_pillar_gapsin",
        "element_earth_excess",
        "element_fire_missing",
        "element_water_missing",
        "ten_god_pian_cai",
        "ten_god_zheng_cai",
        "ten_god_qi_sha",
        "ten_god_zheng_guan",
        "structure_jaeda_sinyak",
        "structure_no_resource",
        "structure_no_output",
        "sinsal_hyeonchim",
        "sinsal_hongyeom",
        "sinsal_gwimun",
        "sinsal_wonjin",
        "gwiin_jaego",
        "twelve_sinsal_jisal",
        "twelve_sinsal_jangseong",
        "twelve_sinsal_mangsin",
        "twelve_sinsal_cheonsal",
        "gwiin_cheoneul",
        "gwiin_amrok",
      ]),
    );
    expect(mapped.featureIds).toEqual([...new Set(mapped.featureIds)]);
    expect(mapped.warnings).toEqual([]);
    expect(mapped.unmappedFacts).toEqual([]);
  });

  it("dedupes ids while preserving deterministic Saju-first ordering", () => {
    const mapped = mapComputedSajuFactsToKnowledgeEntryIds({
      ...deokminSampleFacts,
      specialPatterns: ["jaeda_sinyak", "jaeda_sinyak", "no_resource"],
      sinsal: ["hyeonchim", "hyeonchim", "hongyeom"],
      gwiin: ["jaego", "jaego"],
    });

    expect(mapped.sajuEntryIds).toEqual([...new Set(mapped.sajuEntryIds)]);
    expect(mapped.sajuEntryIds.indexOf("day_master_gabmok")).toBeLessThan(
      mapped.sajuEntryIds.indexOf("element_earth_excess"),
    );
    expect(mapped.sajuEntryIds.indexOf("element_earth_excess")).toBeLessThan(
      mapped.sajuEntryIds.indexOf("ten_god_pian_cai"),
    );
    expect(mapped.sajuEntryIds.indexOf("ten_god_pian_cai")).toBeLessThan(
      mapped.sajuEntryIds.indexOf("pattern_jaeda_sinyak"),
    );
    expect(mapped.sajuEntryIds.indexOf("pattern_jaeda_sinyak")).toBeLessThan(
      mapped.sajuEntryIds.indexOf("sinsal_hyeonchim"),
    );
  });

  it("warns on unsupported day pillar without inventing an id", () => {
    const mapped = mapComputedSajuFactsToKnowledgeEntryIds({
      ...deokminSampleFacts,
      dayPillar: "을축",
    });

    expect(mapped.sajuEntryIds).not.toContain("day_pillar_eulchuk");
    expect(mapped.warnings.join("\n")).toContain("dayPillar:을축");
    expect(mapped.unmappedFacts).toContain("dayPillar:을축");
  });

  it("warns when a configured mapping points to a DB entry that does not exist", () => {
    const mapped = mapComputedSajuFactsToKnowledgeEntryIds({
      ...deokminSampleFacts,
      excessiveElements: ["metal"],
    });

    expect(mapped.sajuEntryIds).not.toContain("element_metal_excess");
    expect(mapped.warnings.join("\n")).toContain("element_metal_excess");
    expect(mapped.unmappedFacts).toContain("excessiveElement:metal");
  });
});
