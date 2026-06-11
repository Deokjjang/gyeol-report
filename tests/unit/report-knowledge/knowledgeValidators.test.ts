import { describe, expect, it } from "vitest";

import { FUSION_KNOWLEDGE_BASE } from "../../../src/lib/report-knowledge/fusionKnowledgeBase";
import { MBTI_KNOWLEDGE_BASE } from "../../../src/lib/report-knowledge/mbtiKnowledgeBase";
import { SAJU_KNOWLEDGE_BASE } from "../../../src/lib/report-knowledge/sajuKnowledgeBase";
import {
  validateReportKnowledgeBase,
  validateSajuKnowledgeDensity,
  type ReportKnowledgeValidationInput,
} from "../../../src/lib/report-knowledge/knowledgeValidators";
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

  it("detects missing required saju density entries", () => {
    const result = validateSajuKnowledgeDensity(
      SAJU_KNOWLEDGE_BASE.filter((entry) => entry.id !== "day_master_gabmok"),
    );

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("day_master_gabmok");
  });
});
