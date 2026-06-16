import { describe, expect, it } from "vitest";

import { selectMbtiKnowledge } from "../../../src/lib/report-knowledge/mbtiKnowledgeSelector";
import { scoreSajuMbtiBridgeEvidence } from "../../../src/lib/report-knowledge/sajuMbtiBridgeScorer";
import type {
  SelectedSajuFeatureEvidence,
  SelectedSajuFeatureEvidenceItem,
} from "../../../src/lib/report-knowledge/comprehensiveReportEvidenceTypes";

function feature(id: string): SelectedSajuFeatureEvidenceItem {
  return {
    id,
    labelKo: id,
    category: id.startsWith("day_pillar")
      ? "day_pillar"
      : id.startsWith("gwiin")
        ? "gwiin"
        : id.startsWith("sinsal")
          ? "sinsal"
          : id.startsWith("ten_god")
            ? "ten_god"
            : "structure",
    polarity: "mixed",
    strength: "high",
    score: 80,
    topics: ["growth"],
    summary: id,
    symbolicImage: id,
    positiveReading: id,
    cautionReading: id,
    practicalUse: id,
    sceneSeeds: [id],
    phraseSeeds: [id],
  };
}

function evidence(featureIds: readonly string[]): readonly SelectedSajuFeatureEvidence[] {
  return [
    {
      chapterId: "risk_and_growth",
      features: featureIds.map(feature),
    },
  ];
}

describe("REPORT-17 Saju-MBTI bridge scorer", () => {
  it("creates INTP support-request bridge from no-resource evidence", () => {
    const selectedMbtiKnowledge = selectMbtiKnowledge({
      mbti: "INTP",
      contexts: ["core_identity", "stress", "growth"],
      productType: "comprehensive",
    });
    const bridge = scoreSajuMbtiBridgeEvidence({
      selectedMbtiKnowledge,
      selectedSajuFeatureEvidence: evidence(["structure_no_resource"]),
      productType: "comprehensive",
    });

    expect(bridge).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          mbti: "INTP",
          bridgeNeed: "support_request",
          relatedSajuFeatureIds: ["structure_no_resource"],
        }),
      ]),
    );
  });

  it("creates INTP money-structure bridge from jaego evidence", () => {
    const selectedMbtiKnowledge = selectMbtiKnowledge({
      mbti: "INTP",
      contexts: ["money", "study", "work"],
      productType: "comprehensive",
    });
    const bridge = scoreSajuMbtiBridgeEvidence({
      selectedMbtiKnowledge,
      selectedSajuFeatureEvidence: evidence(["gwiin_jaego"]),
      productType: "comprehensive",
    });

    expect(bridge[0]).toEqual(
      expect.objectContaining({
        mbti: "INTP",
        bridgeNeed: "money_structure",
      }),
    );
  });

  it("creates ENTJ speed-control bridge from hyeonchim evidence", () => {
    const selectedMbtiKnowledge = selectMbtiKnowledge({
      mbti: "ENTJ",
      contexts: ["communication", "decision", "growth"],
      productType: "comprehensive",
    });
    const bridge = scoreSajuMbtiBridgeEvidence({
      selectedMbtiKnowledge,
      selectedSajuFeatureEvidence: evidence(["sinsal_hyeonchim"]),
      productType: "comprehensive",
    });

    expect(bridge[0]).toEqual(
      expect.objectContaining({
        mbti: "ENTJ",
        bridgeNeed: "speed_control",
      }),
    );
  });

  it("uses actual Saju features only", () => {
    const selectedMbtiKnowledge = selectMbtiKnowledge({
      mbti: "ENTJ",
      contexts: ["money", "work"],
      productType: "comprehensive",
    });
    const bridge = scoreSajuMbtiBridgeEvidence({
      selectedMbtiKnowledge,
      selectedSajuFeatureEvidence: evidence(["gwiin_amrok"]),
      productType: "comprehensive",
    });

    expect(bridge).toEqual([]);
  });
});
