import { describe, expect, it } from "vitest";

import { scoreSajuEvidenceForTopic } from "../../../src/lib/report-knowledge/sajuEvidenceScoring";
import { SAJU_KNOWLEDGE_BY_ID } from "../../../src/lib/report-knowledge/sajuKnowledgeBase";

function getEntry(id: string) {
  const entry = SAJU_KNOWLEDGE_BY_ID.get(id);

  if (entry === undefined) {
    throw new Error(`Missing saju entry: ${id}`);
  }

  return entry;
}

describe("saju evidence scoring", () => {
  it("ranks topic-relevant entries higher", () => {
    const moneyScore = scoreSajuEvidenceForTopic({
      entry: getEntry("ten_god_pian_cai"),
      topic: "money_asset",
    });
    const unrelatedMoneyScore = scoreSajuEvidenceForTopic({
      entry: getEntry("sinsal_hwagae"),
      topic: "money_asset",
    });

    expect(moneyScore).toBeGreaterThan(unrelatedMoneyScore);
  });

  it("prioritizes money love career and weakness signals by topic", () => {
    expect(
      scoreSajuEvidenceForTopic({
        entry: getEntry("ten_god_zheng_cai"),
        topic: "money_asset",
      }),
    ).toBeGreaterThan(
      scoreSajuEvidenceForTopic({
        entry: getEntry("ten_god_zheng_cai"),
        topic: "love_relationship",
      }),
    );
    expect(
      scoreSajuEvidenceForTopic({
        entry: getEntry("sinsal_hongyeom"),
        topic: "love_relationship",
      }),
    ).toBeGreaterThan(
      scoreSajuEvidenceForTopic({
        entry: getEntry("sinsal_hongyeom"),
        topic: "money_asset",
      }),
    );
    expect(
      scoreSajuEvidenceForTopic({
        entry: getEntry("ten_god_qi_sha"),
        topic: "work_career",
      }),
    ).toBeGreaterThan(
      scoreSajuEvidenceForTopic({
        entry: getEntry("ten_god_qi_sha"),
        topic: "love_relationship",
      }),
    );
    expect(
      scoreSajuEvidenceForTopic({
        entry: getEntry("pattern_no_resource"),
        topic: "weaknesses",
      }),
    ).toBeGreaterThan(
      scoreSajuEvidenceForTopic({
        entry: getEntry("pattern_no_resource"),
        topic: "strengths",
      }),
    );
  });

  it("uses matched tags as a secondary boost", () => {
    const baseScore = scoreSajuEvidenceForTopic({
      entry: getEntry("sinsal_hyeonchim"),
      topic: "work_career",
    });
    const boostedScore = scoreSajuEvidenceForTopic({
      entry: getEntry("sinsal_hyeonchim"),
      topic: "work_career",
      matchedTags: ["sharp_analysis", "precision_skill"],
    });

    expect(boostedScore).toBeGreaterThan(baseScore);
  });
});
