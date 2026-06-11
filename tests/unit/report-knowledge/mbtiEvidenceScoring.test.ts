import { describe, expect, it } from "vitest";

import { scoreMbtiEvidenceForTopic } from "../../../src/lib/report-knowledge/mbtiEvidenceScoring";
import { MBTI_KNOWLEDGE_BY_TYPE } from "../../../src/lib/report-knowledge/mbtiKnowledgeBase";
import type { MbtiType } from "../../../src/lib/report-knowledge/mbtiKnowledgeTypes";

function getEntry(type: MbtiType) {
  const entry = MBTI_KNOWLEDGE_BY_TYPE.get(type);

  if (entry === undefined) {
    throw new Error(`Missing MBTI entry: ${type}`);
  }

  return entry;
}

describe("mbti evidence scoring", () => {
  it("scores ENTJ high for work money and strengths", () => {
    const entj = getEntry("ENTJ");

    expect(
      scoreMbtiEvidenceForTopic({ entry: entj, topic: "work_career" }),
    ).toBeGreaterThan(scoreMbtiEvidenceForTopic({ entry: entj, topic: "study_growth" }));
    expect(
      scoreMbtiEvidenceForTopic({ entry: entj, topic: "money_asset" }),
    ).toBeGreaterThan(scoreMbtiEvidenceForTopic({ entry: entj, topic: "family_independence" }));
    expect(
      scoreMbtiEvidenceForTopic({ entry: entj, topic: "strengths" }),
    ).toBeGreaterThan(0.8);
  });

  it("scores INFP and ENFP high for relation topics", () => {
    const infp = getEntry("INFP");
    const enfp = getEntry("ENFP");

    expect(
      scoreMbtiEvidenceForTopic({ entry: infp, topic: "love_relationship" }),
    ).toBeGreaterThan(scoreMbtiEvidenceForTopic({ entry: infp, topic: "work_career" }));
    expect(
      scoreMbtiEvidenceForTopic({ entry: infp, topic: "human_relations" }),
    ).toBeGreaterThan(0.9);
    expect(
      scoreMbtiEvidenceForTopic({ entry: enfp, topic: "love_relationship" }),
    ).toBeGreaterThan(0.9);
    expect(
      scoreMbtiEvidenceForTopic({ entry: enfp, topic: "human_relations" }),
    ).toBeGreaterThan(0.9);
  });

  it("scores ISTJ high for work money and stability", () => {
    const istj = getEntry("ISTJ");

    expect(
      scoreMbtiEvidenceForTopic({ entry: istj, topic: "work_career" }),
    ).toBeGreaterThan(0.8);
    expect(
      scoreMbtiEvidenceForTopic({ entry: istj, topic: "money_asset" }),
    ).toBeGreaterThan(0.8);
  });

  it("raises weaknesses score from risk tags and matched tags", () => {
    const entj = getEntry("ENTJ");
    const baseScore = scoreMbtiEvidenceForTopic({
      entry: entj,
      topic: "weaknesses",
    });
    const boostedScore = scoreMbtiEvidenceForTopic({
      entry: entj,
      topic: "weaknesses",
      matchedTags: ["emotional_dryness", "direct_speech"],
    });

    expect(baseScore).toBeGreaterThan(0.9);
    expect(boostedScore).toBeGreaterThan(baseScore);
  });
});
