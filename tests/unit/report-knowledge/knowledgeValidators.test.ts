import { describe, expect, it } from "vitest";

import { FUSION_KNOWLEDGE_BASE } from "../../../src/lib/report-knowledge/fusionKnowledgeBase";
import { MBTI_KNOWLEDGE_BASE } from "../../../src/lib/report-knowledge/mbtiKnowledgeBase";
import { SAJU_KNOWLEDGE_BASE } from "../../../src/lib/report-knowledge/sajuKnowledgeBase";
import { buildComprehensiveReportEvidencePacket } from "../../../src/lib/report-knowledge/comprehensiveReportEvidenceBuilder";
import {
  validateComprehensiveEvidencePacket,
  validateFusionKnowledgeDensity,
  validateMbtiKnowledgeDensity,
  validateReportKnowledgeBase,
  validateSajuKnowledgeDensity,
  type ReportKnowledgeValidationInput,
} from "../../../src/lib/report-knowledge/knowledgeValidators";
import type { ComprehensiveReportEvidencePacket } from "../../../src/lib/report-knowledge/comprehensiveReportEvidenceTypes";
import type { MbtiKnowledgeEntry } from "../../../src/lib/report-knowledge/mbtiKnowledgeTypes";
import type { SajuKnowledgeEntry } from "../../../src/lib/report-knowledge/sajuKnowledgeTypes";

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

describe("knowledge validators", () => {
  it("validates the default report knowledge base", () => {
    expect(validateReportKnowledgeBase()).toEqual({
      ok: true,
      errors: [],
    });
  });

  it("validates the default saju density pack", () => {
    expect(validateSajuKnowledgeDensity()).toEqual({
      ok: true,
      errors: [],
    });
  });

  it("validates the default mbti density pack", () => {
    expect(validateMbtiKnowledgeDensity()).toEqual({
      ok: true,
      errors: [],
    });
  });

  it("validates the default fusion density pack", () => {
    expect(validateFusionKnowledgeDensity()).toEqual({
      ok: true,
      errors: [],
    });
  });

  it("validates the default comprehensive evidence packet", () => {
    const packet = buildComprehensiveReportEvidencePacket({
      mbtiType: "ENTJ",
      sajuEntryIds: sampleDeokminSajuIds,
    });

    expect(validateComprehensiveEvidencePacket(packet)).toEqual({
      ok: true,
      errors: [],
    });
  });

  it("detects duplicate ids in a test fixture", () => {
    const duplicate = SAJU_KNOWLEDGE_BASE[0];
    const result = validateReportKnowledgeBase({
      sajuEntries: [duplicate, duplicate],
    });

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("duplicate id");
  });

  it("detects invalid fusion references in a test fixture", () => {
    const [rule] = FUSION_KNOWLEDGE_BASE;
    const result = validateReportKnowledgeBase({
      fusionRules: [
        {
          ...rule,
          id: "fixture_invalid_reference",
          sajuEntryIds: ["missing_saju_basis"],
        },
      ],
    });

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("unknown saju id");
  });

  it("detects insufficient fusion count", () => {
    const result = validateFusionKnowledgeDensity(FUSION_KNOWLEDGE_BASE.slice(0, 5));

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("at least 60");
  });

  it("detects non-Saju-gated fusion rules", () => {
    const [rule] = FUSION_KNOWLEDGE_BASE;
    const result = validateFusionKnowledgeDensity([
      {
        ...rule,
        id: "fixture_non_saju_gated",
        sajuEntryIds: [],
        requiredSajuTags: undefined,
      },
    ]);

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("needs saju basis");
  });

  it("detects invalid MBTI type in fusion rules", () => {
    const [rule] = FUSION_KNOWLEDGE_BASE;
    const result = validateFusionKnowledgeDensity([
      {
        ...rule,
        id: "fixture_invalid_mbti_type",
        mbtiTypes: ["XXXX"],
      } as unknown as typeof rule,
    ]);

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("unknown MBTI type");
  });

  it("detects invalid Saju reference in fusion density", () => {
    const [rule] = FUSION_KNOWLEDGE_BASE;
    const result = validateFusionKnowledgeDensity([
      {
        ...rule,
        id: "fixture_invalid_saju_id",
        sajuEntryIds: ["missing_saju_basis"],
      },
    ]);

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("unknown saju id");
  });

  it("detects missing fusion phrase seeds", () => {
    const [rule] = FUSION_KNOWLEDGE_BASE;
    const result = validateFusionKnowledgeDensity([
      {
        ...rule,
        id: "fixture_missing_fusion_phrase_seed",
        phraseSeeds: [],
      },
    ]);

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("missing phrase seeds");
  });

  it("detects missing MBTI type in a test fixture", () => {
    const result = validateReportKnowledgeBase({
      mbtiEntries: MBTI_KNOWLEDGE_BASE.filter((entry) => entry.type !== "ENTJ"),
    });

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("missing MBTI type: ENTJ");
  });

  it("detects bad MBTI function stack", () => {
    const invalidEntry = {
      ...MBTI_KNOWLEDGE_BASE[0],
      functionStack: ["Ni", "Te", "Fi"],
    } satisfies MbtiKnowledgeEntry;
    const result = validateReportKnowledgeBase({
      mbtiEntries: [invalidEntry],
    });

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("function stack");
  });

  it("detects forbidden prediction phrase in a test fixture", () => {
    const unsafeSajuEntry = {
      ...SAJU_KNOWLEDGE_BASE[0],
      id: "fixture_forbidden_prediction",
      meaning: "이 구조는 " + "반드시 " + "결혼한다",
    };
    const input: ReportKnowledgeValidationInput = {
      sajuEntries: [unsafeSajuEntry],
    };
    const result = validateReportKnowledgeBase(input);

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("forbidden prediction phrase");
  });

  it("detects empty topic weights", () => {
    const result = validateReportKnowledgeBase({
      sajuEntries: [
        {
          ...SAJU_KNOWLEDGE_BASE[0],
          id: "fixture_empty_topic_weights",
          topicWeights: {},
        },
      ],
    });

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("empty topic weights");
  });

  it("detects empty MBTI topic weights", () => {
    const result = validateReportKnowledgeBase({
      mbtiEntries: [
        {
          ...MBTI_KNOWLEDGE_BASE[0],
          topicWeights: {},
        },
      ],
    });

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("empty topic weights");
  });

  it("detects missing MBTI topic interpretation", () => {
    const result = validateReportKnowledgeBase({
      mbtiEntries: [
        {
          ...MBTI_KNOWLEDGE_BASE[0],
          topicInterpretations: {},
        },
      ],
    });

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("missing topic interpretations");
  });

  it("detects invalid element values in matching hints", () => {
    const invalidElementEntry = {
      ...SAJU_KNOWLEDGE_BASE[0],
      id: "fixture_invalid_element",
      matchingHints: {
        helpfulElements: ["invalid_element"],
      },
    } as unknown as SajuKnowledgeEntry;
    const result = validateReportKnowledgeBase({
      sajuEntries: [invalidElementEntry],
    });

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("invalid element");
  });

  it("detects missing phrase seed density", () => {
    const result = validateReportKnowledgeBase({
      sajuEntries: [
        {
          ...SAJU_KNOWLEDGE_BASE[0],
          id: "fixture_missing_phrase_seed",
          phraseSeeds: {
            analytical: [],
            conversational: ["fixture"],
            caution: ["fixture"],
            advice: ["fixture"],
          },
        },
      ],
    });

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("missing phrase seeds");
  });

  it("detects invalid tag ids", () => {
    const invalidTagEntry = {
      ...SAJU_KNOWLEDGE_BASE[0],
      id: "fixture_invalid_tag",
      positiveTags: ["missing_tag"],
    } as unknown as SajuKnowledgeEntry;
    const result = validateReportKnowledgeBase({
      sajuEntries: [invalidTagEntry],
    });

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("unknown tag");
  });

  it("detects invalid MBTI tag ids", () => {
    const invalidTagEntry = {
      ...MBTI_KNOWLEDGE_BASE[0],
      traitTags: ["missing_tag"],
    } as unknown as MbtiKnowledgeEntry;
    const result = validateReportKnowledgeBase({
      mbtiEntries: [invalidTagEntry],
    });

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("unknown tag");
  });

  it("detects overlong MBTI phrase seed", () => {
    const result = validateReportKnowledgeBase({
      mbtiEntries: [
        {
          ...MBTI_KNOWLEDGE_BASE[0],
          phraseSeeds: {
            ...MBTI_KNOWLEDGE_BASE[0].phraseSeeds,
            analytical: [
              "fixture ".repeat(30),
              ...MBTI_KNOWLEDGE_BASE[0].phraseSeeds.analytical,
            ],
          },
        },
      ],
    });

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("overlong phrase seed");
  });

  it("detects forbidden MBTI prophecy phrase", () => {
    const result = validateReportKnowledgeBase({
      mbtiEntries: [
        {
          ...MBTI_KNOWLEDGE_BASE[0],
          summary: "이 유형은 " + "100% " + "이런 사람",
        },
      ],
    });

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("forbidden prediction phrase");
  });

  it("detects missing required saju density entries", () => {
    const result = validateSajuKnowledgeDensity(
      SAJU_KNOWLEDGE_BASE.filter((entry) => entry.id !== "day_master_gabmok"),
    );

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("day_master_gabmok");
  });

  it("detects missing required mbti density entries", () => {
    const result = validateMbtiKnowledgeDensity(
      MBTI_KNOWLEDGE_BASE.filter((entry) => entry.type !== "ENTJ"),
    );

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("missing MBTI type: ENTJ");
  });

  it("detects private payment fields in an evidence packet fixture", () => {
    const packet = buildComprehensiveReportEvidencePacket({
      mbtiType: "ENTJ",
      sajuEntryIds: sampleDeokminSajuIds,
    });
    const unsafePacket = {
      ...packet,
      paymentKey: "fixture_private_value",
    } as unknown as ComprehensiveReportEvidencePacket;
    const result = validateComprehensiveEvidencePacket(unsafePacket);

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("private field marker");
  });

  it("detects forbidden prophecy phrase in an evidence packet fixture", () => {
    const packet = buildComprehensiveReportEvidencePacket({
      mbtiType: "ENTJ",
      sajuEntryIds: sampleDeokminSajuIds,
    });
    const [firstSection, ...remainingSections] = packet.sections;
    const [firstEvidence, ...remainingEvidence] = firstSection.primarySaju;
    const unsafePacket = {
      ...packet,
      sections: [
        {
          ...firstSection,
          primarySaju: [
            {
              ...firstEvidence,
              summary: "이 구조는 " + "100% " + "확정",
            },
            ...remainingEvidence,
          ],
        },
        ...remainingSections,
      ],
    };
    const result = validateComprehensiveEvidencePacket(unsafePacket);

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("forbidden prediction phrase");
  });
});
