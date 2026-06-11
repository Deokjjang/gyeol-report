import { describe, expect, it } from "vitest";

import type {
  ComprehensiveReportEvidencePacket,
  ComprehensiveReportSectionEvidence,
  EvidenceRole,
} from "../../../src/lib/report-knowledge/comprehensiveReportEvidenceTypes";

describe("comprehensive report evidence types", () => {
  it("represents primary, supporting, and fusion evidence roles", () => {
    const roles = [
      "primary_saju",
      "supporting_mbti",
      "fusion_reinforcement",
      "fusion_contrast",
      "fusion_compensation",
      "topic_specialization",
    ] as const satisfies readonly EvidenceRole[];

    expect(roles).toEqual(
      expect.arrayContaining([
        "primary_saju",
        "supporting_mbti",
        "fusion_reinforcement",
        "fusion_contrast",
        "fusion_compensation",
        "topic_specialization",
      ]),
    );
  });

  it("can represent section evidence and full packet structure", () => {
    const section = {
      sectionId: "personality",
      titleKo: "성격",
      primarySaju: [
        {
          role: "primary_saju",
          sourceId: "day_pillar_gapsin",
          sourceLabelKo: "갑신일주",
          summary: "사주 1차 근거",
          topic: "personality",
          tags: ["leadership"],
          priority: 201,
        },
      ],
      supportingMbti: [
        {
          role: "supporting_mbti",
          sourceId: "mbti_ENTJ_personality",
          sourceLabelKo: "ENTJ",
          summary: "MBTI 보조 근거",
          topic: "personality",
          tags: ["leadership"],
          priority: 101,
        },
      ],
      fusion: [
        {
          role: "fusion_reinforcement",
          sourceId: "fusion_gapsin_entj_leadership_control",
          sourceLabelKo: "갑신일주 + ENTJ leadership/control",
          summary: "결합 근거",
          topic: "personality",
          tags: ["leadership"],
          priority: 99,
        },
      ],
      warnings: [],
    } satisfies ComprehensiveReportSectionEvidence;
    const packet = {
      mbtiType: "ENTJ",
      sajuEntryIds: ["day_pillar_gapsin"],
      sections: [section],
      globalWarnings: [],
    } satisfies ComprehensiveReportEvidencePacket;

    expect(packet.sections[0].primarySaju[0].role).toBe("primary_saju");
    expect(packet.sections[0].supportingMbti[0].role).toBe("supporting_mbti");
    expect(packet.sections[0].fusion[0].role).toBe("fusion_reinforcement");
  });
});
