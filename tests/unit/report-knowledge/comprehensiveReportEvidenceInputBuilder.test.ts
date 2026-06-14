import { describe, expect, it } from "vitest";

import { buildComprehensiveReportEvidencePacketFromComputedFacts } from "../../../src/lib/report-knowledge/comprehensiveReportEvidenceInputBuilder";
import { COMPREHENSIVE_REPORT_SECTION_IDS } from "../../../src/lib/report-knowledge/reportSectionSchema";
import { validateComprehensiveEvidencePacket } from "../../../src/lib/report-knowledge/knowledgeValidators";
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

function getSection(
  result: ReturnType<typeof buildComprehensiveReportEvidencePacketFromComputedFacts>,
  sectionId: string,
) {
  const section = result.packet.sections.find((item) => item.sectionId === sectionId);

  if (section === undefined) {
    throw new Error(`missing section: ${sectionId}`);
  }

  return section;
}

function getFeatureEvidence(
  result: ReturnType<typeof buildComprehensiveReportEvidencePacketFromComputedFacts>,
  chapterId: string,
) {
  const evidence = result.packet.selectedSajuFeatureEvidence?.find(
    (item) => item.chapterId === chapterId,
  );

  if (evidence === undefined) {
    throw new Error(`missing selected feature evidence: ${chapterId}`);
  }

  return evidence;
}

function getAllSelectedFeatureIds(
  result: ReturnType<typeof buildComprehensiveReportEvidencePacketFromComputedFacts>,
): readonly string[] {
  return (
    result.packet.selectedSajuFeatureEvidence?.flatMap((chapter) =>
      chapter.features.map((feature) => feature.id),
    ) ?? []
  );
}

describe("comprehensive report evidence input builder", () => {
  it("builds mapped Saju input and a valid packet from computed facts", () => {
    const result = buildComprehensiveReportEvidencePacketFromComputedFacts({
      mbtiType: "ENTJ",
      sajuFacts: deokminSampleFacts,
    });

    expect(result.mappedSaju.sajuEntryIds).toEqual(
      expect.arrayContaining([
        "day_master_gabmok",
        "day_pillar_gapsin",
        "element_earth_excess",
        "element_fire_missing",
        "element_water_missing",
        "ten_god_pian_cai",
        "ten_god_zheng_cai",
        "ten_god_zheng_guan",
        "ten_god_qi_sha",
        "pattern_jaeda_sinyak",
        "pattern_no_resource",
        "pattern_no_output",
        "sinsal_hyeonchim",
        "sinsal_hongyeom",
        "sinsal_gwimun",
        "sinsal_wonjin",
        "gwiin_jaego",
      ]),
    );
    expect(result.mappedFeatures.featureIds).toEqual(
      expect.arrayContaining([
        "day_pillar_gapsin",
        "element_earth_excess",
        "element_fire_missing",
        "element_water_missing",
        "ten_god_pian_cai",
        "ten_god_zheng_cai",
        "ten_god_zheng_guan",
        "ten_god_qi_sha",
        "structure_jaeda_sinyak",
        "structure_no_resource",
        "structure_no_output",
        "sinsal_hyeonchim",
        "sinsal_hongyeom",
        "sinsal_gwimun",
        "sinsal_wonjin",
        "gwiin_jaego",
      ]),
    );
    expect(result.packet.sections.map((section) => section.sectionId)).toEqual(
      COMPREHENSIVE_REPORT_SECTION_IDS,
    );
    expect(validateComprehensiveEvidencePacket(result.packet)).toEqual({
      ok: true,
      errors: [],
    });
  });

  it("adds selected chapter-level Saju feature evidence from computed facts only", () => {
    const result = buildComprehensiveReportEvidencePacketFromComputedFacts({
      mbtiType: "ENTJ",
      sajuFacts: deokminSampleFacts,
    });
    const allFeatureIds = getAllSelectedFeatureIds(result);
    const identity = getFeatureEvidence(result, "saju_identity");
    const workMoneyStudy = getFeatureEvidence(result, "work_money_study");
    const love = getFeatureEvidence(result, "love_relationships");
    const risk = getFeatureEvidence(result, "risk_and_growth");
    const finalMessage = getFeatureEvidence(result, "final_message");

    expect(result.packet.selectedSajuFeatureEvidence?.map((item) => item.chapterId)).toEqual([
      "opening",
      "saju_identity",
      "personality_pattern",
      "work_money_study",
      "love_relationships",
      "people_family_environment",
      "risk_and_growth",
      "final_message",
    ]);
    expect(allFeatureIds).toEqual(
      expect.arrayContaining([
        "day_pillar_gapsin",
        "element_fire_missing",
        "element_water_missing",
        "element_earth_excess",
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
      ]),
    );
    expect(allFeatureIds).not.toContain("sinsal_dohwa");
    expect(allFeatureIds).not.toContain("twelve_sinsal_banan");
    expect(allFeatureIds).not.toContain("gwiin_cheoneul");
    expect(identity.features.map((feature) => feature.id)).toContain(
      "day_pillar_gapsin",
    );
    expect(workMoneyStudy.features.map((feature) => feature.id)).toEqual(
      expect.arrayContaining([
        "ten_god_pian_cai",
        "ten_god_zheng_cai",
        "gwiin_jaego",
      ]),
    );
    expect(love.features.map((feature) => feature.id)).toEqual(
      expect.arrayContaining(["sinsal_hongyeom", "sinsal_wonjin"]),
    );
    expect(risk.features.map((feature) => feature.id)).toEqual(
      expect.arrayContaining([
        "element_water_missing",
        "element_fire_missing",
        "element_earth_excess",
        "structure_jaeda_sinyak",
      ]),
    );
    expect(finalMessage.features.some((feature) => feature.polarity === "positive")).toBe(
      true,
    );
    expect(
      finalMessage.features.some(
        (feature) => feature.polarity === "mixed" || feature.polarity === "warning",
      ),
    ).toBe(true);
    expect(result.packet.selectedSajuFeatureEvidence?.[0]?.features.length).toBeLessThanOrEqual(
      4,
    );
    for (const chapter of result.packet.selectedSajuFeatureEvidence ?? []) {
      const expectedMax = chapter.chapterId === "opening"
        ? 4
        : chapter.chapterId === "final_message"
          ? 5
          : 6;

      expect(chapter.features.length).toBeLessThanOrEqual(expectedMax);
    }
  });

  it("builds Saju primary, ENTJ support, and fusion evidence in major sections", () => {
    const result = buildComprehensiveReportEvidencePacketFromComputedFacts({
      mbtiType: "ENTJ",
      sajuFacts: deokminSampleFacts,
    });
    const personality = getSection(result, "personality");
    const career = getSection(result, "work_career");
    const money = getSection(result, "money_asset");
    const love = getSection(result, "love_relationship");
    const humanRelations = getSection(result, "human_relations");
    const weaknesses = getSection(result, "weaknesses");
    const fusion = getSection(result, "saju_mbti_fusion");

    expect(personality.primarySaju.length).toBeGreaterThan(0);
    expect(personality.supportingMbti.map((item) => item.sourceLabelKo)).toContain(
      "ENTJ",
    );
    expect(career.fusion.map((item) => item.sourceLabelKo)).toContain(
      "편관/정관 + ENTJ 리더십",
    );
    expect(money.fusion.map((item) => item.sourceLabelKo)).toEqual(
      expect.arrayContaining([
        "재성 강함 + ENTJ 성취욕",
        "재고귀인 + ENTJ 자산화",
      ]),
    );
    expect(love.primarySaju.map((item) => item.sourceId)).toEqual(
      expect.arrayContaining([
        "sinsal_hongyeom",
        "element_water_missing",
        "element_fire_missing",
      ]),
    );
    expect(humanRelations.fusion.map((item) => item.sourceLabelKo)).toContain(
      "현침살 + ENTJ 직설성",
    );
    expect(weaknesses.primarySaju.map((item) => item.sourceId)).toEqual(
      expect.arrayContaining([
        "pattern_no_resource",
        "pattern_no_output",
        "pattern_jaeda_sinyak",
      ]),
    );
    expect(fusion.fusion.length).toBeGreaterThan(0);
  });

  it("flows mapper warnings into packet global warnings", () => {
    const result = buildComprehensiveReportEvidencePacketFromComputedFacts({
      mbtiType: "ENTJ",
      sajuFacts: {
        ...deokminSampleFacts,
        dayPillar: "을축",
        excessiveElements: ["metal"],
      },
    });

    expect(result.mappedSaju.warnings.length).toBeGreaterThan(0);
    expect(result.packet.globalWarnings).toEqual(
      expect.arrayContaining(result.mappedSaju.warnings),
    );
  });

  it("does not generate final prose or call OpenAI", () => {
    const serialized = JSON.stringify(
      buildComprehensiveReportEvidencePacketFromComputedFacts({
        mbtiType: "ENTJ",
        sajuFacts: deokminSampleFacts,
      }),
    );

    expect(serialized).not.toContain("finalReportBody");
    expect(serialized).not.toContain("generatedReport");
    expect(serialized).not.toContain("OpenAI");
  });
});
