import { describe, expect, it } from "vitest";

import { FUSION_KNOWLEDGE_BASE } from "../../../src/lib/report-knowledge/fusionKnowledgeBase";
import { MBTI_KNOWLEDGE_BASE } from "../../../src/lib/report-knowledge/mbtiKnowledgeBase";
import { SAJU_KNOWLEDGE_BASE } from "../../../src/lib/report-knowledge/sajuKnowledgeBase";
import {
  validateMbtiKnowledgeDensity,
  validateReportKnowledgeBase,
  validateSajuKnowledgeDensity,
  type ReportKnowledgeValidationInput,
} from "../../../src/lib/report-knowledge/knowledgeValidators";
import type { MbtiKnowledgeEntry } from "../../../src/lib/report-knowledge/mbtiKnowledgeTypes";
import type { SajuKnowledgeEntry } from "../../../src/lib/report-knowledge/sajuKnowledgeTypes";

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
});
