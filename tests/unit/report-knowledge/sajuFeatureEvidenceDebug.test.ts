import { describe, expect, it } from "vitest";

import { buildComprehensiveReportEvidencePacketFromComputedFacts } from "../../../src/lib/report-knowledge/comprehensiveReportEvidenceInputBuilder";
import {
  buildSafeSajuFeatureEvidenceDebugSummary,
  formatSafeSajuFeatureEvidenceDebugSummary,
} from "../../../src/lib/report-knowledge/sajuFeatureEvidenceDebug";
import type { ComputedSajuFacts } from "../../../src/lib/report-knowledge/sajuComputedFactsTypes";

const baseFacts = {
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
  tenGodSignals: [
    { tenGod: "pian_cai", strength: "strong" },
    { tenGod: "zheng_cai", strength: "present" },
    { tenGod: "zheng_guan", strength: "strong" },
    { tenGod: "qi_sha", strength: "strong" },
  ],
  specialPatterns: ["jaeda_sinyak", "no_resource", "no_output"],
  sinsal: ["hyeonchim", "hongyeom", "gwimun", "wonjin"],
  gwiin: ["jaego"],
} as const satisfies ComputedSajuFacts;

const legacyFeatureIds = new Set([
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
]);

describe("safe Saju feature evidence debug summary", () => {
  it("formats computed and selected feature evidence without private input", () => {
    const result = buildComprehensiveReportEvidencePacketFromComputedFacts({
      mbtiType: "ENTJ",
      sajuFacts: {
        ...baseFacts,
        yearPillar: "병자",
        monthPillar: "기해",
        hourPillar: "정미",
        earthlyBranches: ["子", "亥", "申", "未"],
        heavenlyStems: ["丙", "己", "甲", "丁"],
      },
    });
    const summary = buildSafeSajuFeatureEvidenceDebugSummary({
      computedFeatureIds: result.mappedFeatures.featureIds,
      selectedEvidence: result.packet.selectedSajuFeatureEvidence,
      sajuFeatureSpotlight: result.packet.sajuFeatureSpotlight,
      sajuSignatureScenes: result.packet.sajuSignatureScenes,
    });
    const formatted = formatSafeSajuFeatureEvidenceDebugSummary(summary).join("\n");

    expect(formatted).toContain("computed saju feature ids:");
    expect(formatted).toContain("computed saju feature labels:");
    expect(formatted).toContain("selected saju feature evidence total:");
    expect(formatted).toContain("selected saju feature evidence by chapter:");
    expect(formatted).toContain("excluded high scoring features:");
    expect(formatted).toContain("saju feature spotlight:");
    expect(formatted).toContain("signature scenes:");
    expect(summary.computedFeatureLabels).toEqual(
      expect.arrayContaining(["갑신일주", "장성살", "천을귀인"]),
    );
    expect(summary.spotlightByGroup.map((group) => group.groupId)).toEqual(
      expect.arrayContaining(["good_fortune", "talent", "balance"]),
    );
    expect(summary.signatureSceneTitles.join("\n")).toContain("ENTJ");
    expect(summary.selectedByChapter.map((chapter) => chapter.chapterId)).toEqual(
      expect.arrayContaining(["saju_identity", "work_money_study", "risk_and_growth"]),
    );
    expect(formatted).not.toContain("1996");
    expect(formatted).not.toContain("OPENAI_API_KEY");
    expect(formatted).not.toContain("丙子");
  });

  it("warns when selected evidence stays on the old narrow feature set", () => {
    const result = buildComprehensiveReportEvidencePacketFromComputedFacts({
      mbtiType: "ENTJ",
      sajuFacts: baseFacts,
    });
    const summary = buildSafeSajuFeatureEvidenceDebugSummary({
      computedFeatureIds: result.mappedFeatures.featureIds,
      selectedEvidence: result.packet.selectedSajuFeatureEvidence?.map((chapter) => ({
        ...chapter,
        features: chapter.features.filter((feature) => legacyFeatureIds.has(feature.id)),
      })),
    });

    expect(summary.narrownessWarnings).toEqual(
      expect.arrayContaining([
        "selected evidence narrowness warning: no twelve_sinsal selected",
        "selected evidence narrowness warning: no gwiin/gilshin beyond 재고귀인 selected",
        "selected evidence narrowness warning: no newly extracted feature selected",
      ]),
    );
  });
});
