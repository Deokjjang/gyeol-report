import { describe, expect, it } from "vitest";

import { FUSION_KNOWLEDGE_BASE } from "../../../src/lib/report-knowledge/fusionKnowledgeBase";
import { SAJU_KNOWLEDGE_BY_ID } from "../../../src/lib/report-knowledge/sajuKnowledgeBase";

describe("fusion knowledge base", () => {
  it("contains at least 20 typed fusion rules", () => {
    expect(FUSION_KNOWLEDGE_BASE.length).toBeGreaterThanOrEqual(20);
    expect(new Set(FUSION_KNOWLEDGE_BASE.map((rule) => rule.kind))).toEqual(
      new Set([
        "reinforcement",
        "contrast",
        "compensation",
        "topic_specialization",
      ]),
    );
  });

  it("contains required ENTJ sample rules", () => {
    const summaries = FUSION_KNOWLEDGE_BASE.map((rule) => rule.summary);

    expect(summaries).toEqual(
      expect.arrayContaining([
        "재성 강함 + ENTJ 성취욕",
        "현침살 + ENTJ 직설성",
        "수 부족 + ENTJ 감정 건조함",
        "화 부족 + ENTJ 외향성 contrast",
        "홍염살 + ENTJ 카리스마",
      ]),
    );
  });

  it("references valid saju entries and numeric priorities", () => {
    for (const rule of FUSION_KNOWLEDGE_BASE) {
      expect(typeof rule.priority).toBe("number");
      expect(Number.isFinite(rule.priority)).toBe(true);
      expect(rule.sajuEntryIds.length).toBeGreaterThan(0);

      for (const id of rule.sajuEntryIds) {
        expect(SAJU_KNOWLEDGE_BY_ID.has(id)).toBe(true);
      }
    }
  });
});
