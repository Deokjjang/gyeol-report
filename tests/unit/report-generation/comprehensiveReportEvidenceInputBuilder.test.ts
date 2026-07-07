import { describe, expect, it } from "vitest";

import { buildComprehensiveReportEvidencePacketFromComputedFacts } from "../../../src/lib/report-knowledge/comprehensiveReportEvidenceInputBuilder";
import type { ComputedSajuFacts } from "../../../src/lib/report-knowledge/sajuComputedFactsTypes";

const deokminSampleFacts = {
  yearPillar: "병자",
  monthPillar: "기해",
  hourPillar: "정미",
  earthlyBranches: ["子", "亥", "申", "未"],
  heavenlyStems: ["丙", "己", "甲", "丁"],
  dayMaster: "갑",
  dayPillar: "갑신",
  fiveElementCounts: {
    wood: 2,
    fire: 0,
    earth: 4,
    metal: 2,
    water: 0,
  },
  excessiveElements: ["earth"],
  missingElements: ["fire", "water"],
  usefulElements: ["water", "wood"],
  tenGodSignals: [
    { tenGod: "pian_cai", strength: "strong" },
    { tenGod: "zheng_cai", strength: "present" },
    { tenGod: "zheng_guan", strength: "strong" },
    { tenGod: "qi_sha", strength: "strong" },
    { tenGod: "zheng_yin", strength: "missing" },
    { tenGod: "shi_shen", strength: "missing" },
  ],
  specialPatterns: ["jaeda_sinyak", "no_resource", "no_output"],
  sinsal: ["hyeonchim", "hongyeom", "gwimun", "wonjin"],
  gwiin: ["jaego"],
} as const satisfies ComputedSajuFacts;

describe("comprehensive V2 evidence input contract", () => {
  it("marks the packet as the saju_mbti_full product contract", () => {
    const { packet } = buildComprehensiveReportEvidencePacketFromComputedFacts({
      mbtiType: "ENTJ",
      sajuFacts: deokminSampleFacts,
    });

    expect(packet.productKey).toBe("saju_mbti_full");
    expect(packet.productSlug).toBe("saju-mbti-full");
    expect(packet.productType).toBe("saju_mbti_full");
  });

  it("includes deep MBTI source basis for comprehensive prose generation", () => {
    const { packet } = buildComprehensiveReportEvidencePacketFromComputedFacts({
      mbtiType: "ENTJ",
      sajuFacts: deokminSampleFacts,
    });
    const traitAreas = packet.mbtiBasis?.traitAreas.map((area) => area.area) ?? [];

    expect(packet.mbtiBasis).toMatchObject({
      type: "ENTJ",
      titleKo: expect.any(String),
      archetype: expect.any(String),
      oneLine: expect.any(String),
    });
    expect(packet.mbtiBasis?.closeKeywords.length).toBeGreaterThan(0);
    expect(packet.mbtiBasis?.farKeywords.length).toBeGreaterThan(0);
    expect(packet.mbtiBasis?.functionStack.length).toBeGreaterThan(0);
    expect(packet.mbtiBasis?.reportUseCases.length).toBeGreaterThan(0);
    expect(packet.mbtiBasis?.myeongliBridgeHints.length).toBeGreaterThan(0);
    expect(traitAreas).toEqual(
      expect.arrayContaining([
        "identity",
        "thinkingStyle",
        "career",
        "money",
        "study",
        "love",
        "relationships",
        "communication",
        "risks",
        "growth",
      ]),
    );
  });

  it("adds a user-language dictionary for Saju features and hidden stems", () => {
    const { packet } = buildComprehensiveReportEvidencePacketFromComputedFacts({
      mbtiType: "ENTJ",
      sajuFacts: deokminSampleFacts,
    });
    const dictionary = packet.sajuFeatureDictionary ?? [];
    const hyeonchim = dictionary.find((entry) => entry.rawLabel === "현침살");
    const hiddenStem = dictionary.find((entry) => entry.category === "hidden_stem");

    expect(hyeonchim).toMatchObject({
      rawLabel: "현침살",
      category: "sinsal",
      description: expect.stringMatching(/판단|분석|말|날카|정밀/),
    });
    expect(hyeonchim?.strengths.join("\n")).not.toHaveLength(0);
    expect(hyeonchim?.fatiguePoints.join("\n")).not.toHaveLength(0);
    expect(hiddenStem).toMatchObject({
      rawLabel: expect.stringContaining("지장간"),
      interpretationTitle: "겉 기운 안에 숨어 있는 역할",
      description: expect.stringContaining("욕구"),
    });
    for (const entry of dictionary) {
      expect(entry.description.trim().length).toBeGreaterThan(12);
      expect(entry.strengths.length + entry.fatiguePoints.length).toBeGreaterThan(0);
    }
  });

  it("adds interpreted Saju-MBTI bridge evidence with fatigue and use guidance", () => {
    const { packet } = buildComprehensiveReportEvidencePacketFromComputedFacts({
      mbtiType: "ENTJ",
      sajuFacts: deokminSampleFacts,
    });

    expect(packet.sajuMbtiBridgeEvidence).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          mbti: "ENTJ",
          relatedSajuFeatureIds: expect.arrayContaining(["gwiin_jaego"]),
        }),
      ]),
    );
    expect(packet.interpretedSajuMbtiBridgeEvidence).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          mbti: "ENTJ",
          myeongliSignalLabels: expect.arrayContaining(["재고귀인"]),
          interpretation: expect.stringContaining("신호는"),
          fatiguePoint: expect.any(String),
          practicalUse: expect.any(String),
        }),
      ]),
    );
  });
});
