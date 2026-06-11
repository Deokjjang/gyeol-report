import { describe, expect, it } from "vitest";

import { buildComprehensiveReportEvidencePacket } from "../../../src/lib/report-knowledge/comprehensiveReportEvidenceBuilder";
import { COMPREHENSIVE_REPORT_SECTION_IDS } from "../../../src/lib/report-knowledge/reportSectionSchema";
import { validateComprehensiveEvidencePacket } from "../../../src/lib/report-knowledge/knowledgeValidators";

const sampleDeokminSajuIds = [
  "day_master_gabmok",
  "day_pillar_gapsin",
  "element_earth_excess",
  "element_water_missing",
  "element_fire_missing",
  "ten_god_pian_cai",
  "ten_god_zheng_cai",
  "ten_god_zheng_guan",
  "ten_god_qi_sha",
  "pattern_jaeda_sinyak",
  "pattern_no_resource",
  "pattern_no_output",
  "sinsal_hyeonchim",
  "sinsal_hongyeom",
  "gwiin_jaego",
] as const;

function buildSamplePacket() {
  return buildComprehensiveReportEvidencePacket({
    mbtiType: "ENTJ",
    sajuEntryIds: sampleDeokminSajuIds,
  });
}

function getSection(packet: ReturnType<typeof buildSamplePacket>, sectionId: string) {
  const section = packet.sections.find((item) => item.sectionId === sectionId);

  if (section === undefined) {
    throw new Error(`missing section: ${sectionId}`);
  }

  return section;
}

describe("comprehensive report evidence builder", () => {
  it("builds a packet for every canonical section", () => {
    const packet = buildSamplePacket();

    expect(packet.sections.map((section) => section.sectionId)).toEqual(
      COMPREHENSIVE_REPORT_SECTION_IDS,
    );
    expect(validateComprehensiveEvidencePacket(packet)).toEqual({
      ok: true,
      errors: [],
    });
  });

  it("keeps personality Saju-first with ENTJ supporting and fusion evidence", () => {
    const personality = getSection(buildSamplePacket(), "personality");

    expect(personality.primarySaju.map((item) => item.sourceId)).toEqual(
      expect.arrayContaining([
        "day_pillar_gapsin",
        "ten_god_qi_sha",
        "sinsal_hyeonchim",
      ]),
    );
    expect(personality.supportingMbti.map((item) => item.sourceLabelKo)).toContain(
      "ENTJ",
    );
    expect(personality.fusion.map((item) => item.sourceLabelKo)).toEqual(
      expect.arrayContaining([
        "갑신일주 + ENTJ leadership/control",
        "화 부족 + ENTJ 외향성 contrast",
      ]),
    );
    expect(personality.primarySaju[0].priority).toBeGreaterThan(
      personality.supportingMbti[0].priority,
    );
  });

  it("builds work, money, love, human relation, and weakness fusion packets", () => {
    const packet = buildSamplePacket();
    const work = getSection(packet, "work_career");
    const money = getSection(packet, "money_asset");
    const love = getSection(packet, "love_relationship");
    const humanRelations = getSection(packet, "human_relations");
    const weaknesses = getSection(packet, "weaknesses");

    expect(work.primarySaju.map((item) => item.sourceId)).toEqual(
      expect.arrayContaining([
        "ten_god_qi_sha",
        "ten_god_zheng_guan",
        "sinsal_hyeonchim",
      ]),
    );
    expect(work.fusion.map((item) => item.sourceLabelKo)).toEqual(
      expect.arrayContaining([
        "편관/정관 + ENTJ 리더십",
        "현침살 + ENTJ strategic thinking",
      ]),
    );

    expect(money.primarySaju.map((item) => item.sourceId)).toEqual(
      expect.arrayContaining([
        "ten_god_pian_cai",
        "ten_god_zheng_cai",
        "gwiin_jaego",
      ]),
    );
    expect(money.fusion.map((item) => item.sourceLabelKo)).toEqual(
      expect.arrayContaining([
        "재성 강함 + ENTJ 성취욕",
        "편재/정재 + ENTJ 돈 구조 설계",
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
    expect(love.fusion.map((item) => item.sourceLabelKo)).toEqual(
      expect.arrayContaining([
        "홍염살 + ENTJ 카리스마",
        "수 부족 + ENTJ 감정 건조함",
        "화 부족 + ENTJ 애정표현 contrast",
      ]),
    );

    expect(humanRelations.fusion.map((item) => item.sourceLabelKo)).toEqual(
      expect.arrayContaining([
        "현침살 + ENTJ 직설성",
        "무인성 + ENTJ 들어주는 힘",
      ]),
    );
    expect(weaknesses.primarySaju.map((item) => item.sourceId)).toEqual(
      expect.arrayContaining([
        "pattern_no_resource",
        "pattern_no_output",
        "pattern_jaeda_sinyak",
      ]),
    );
    expect(weaknesses.fusion.map((item) => item.sourceLabelKo)).toEqual(
      expect.arrayContaining([
        "수 부족/무인성 + ENTJ emotional_dryness",
        "재다신약 + ENTJ 워커홀릭",
      ]),
    );
  });

  it("includes reinforcement and contrast in the Saju MBTI fusion section", () => {
    const fusionSection = getSection(buildSamplePacket(), "saju_mbti_fusion");

    expect(fusionSection.fusion.map((item) => item.role)).toEqual(
      expect.arrayContaining(["fusion_reinforcement", "fusion_contrast"]),
    );
    expect(fusionSection.fusion.map((item) => item.sourceLabelKo)).toEqual(
      expect.arrayContaining([
        "재성 강함 + ENTJ 성취욕",
        "화 부족 + ENTJ 외향성 contrast",
      ]),
    );
  });

  it("does not make MBTI primary except in the MBTI core section", () => {
    const packet = buildSamplePacket();

    for (const section of packet.sections) {
      if (section.sectionId !== "mbti_core") {
        expect(section.primarySaju.every((item) => item.role === "primary_saju")).toBe(
          true,
        );
        expect(
          section.primarySaju.every((item) => !item.sourceId.startsWith("mbti_")),
        ).toBe(true);
      }
    }
    expect(getSection(packet, "mbti_core").supportingMbti[0].role).toBe(
      "supporting_mbti",
    );
  });

  it("contains structured evidence only, not final generated report prose", () => {
    const serialized = JSON.stringify(buildSamplePacket());

    expect(serialized).not.toContain("finalReportBody");
    expect(serialized).not.toContain("generatedReport");
    expect(serialized).not.toContain("최종 리포트 본문");
  });
});
