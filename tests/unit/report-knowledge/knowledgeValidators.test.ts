import { describe, expect, it } from "vitest";

import { FUSION_KNOWLEDGE_BASE } from "../../../src/lib/report-knowledge/fusionKnowledgeBase";
import { MBTI_KNOWLEDGE_BASE } from "../../../src/lib/report-knowledge/mbtiKnowledgeBase";
import { SAJU_KNOWLEDGE_BASE } from "../../../src/lib/report-knowledge/sajuKnowledgeBase";
import {
  validateReportKnowledgeBase,
  type ReportKnowledgeValidationInput,
} from "../../../src/lib/report-knowledge/knowledgeValidators";

describe("knowledge validators", () => {
  it("validates the default report knowledge base", () => {
    expect(validateReportKnowledgeBase()).toEqual({
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
});
