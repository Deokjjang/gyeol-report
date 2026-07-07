import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

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
      userTitle: expect.stringMatching(/말|판단|분석|날카|바늘/),
      plainMeaning: expect.stringMatching(/말|판단|분석|날카/),
      howItShowsInYou: expect.any(String),
      strength: expect.stringMatching(/분석|교정|기획|문장|기술|정밀/),
      fatiguePoint: expect.stringMatching(/차갑|상처|표현|온도/),
      description: expect.stringMatching(/판단|분석|말|날카|정밀/),
    });
    expect(hyeonchim?.strengths.join("\n")).not.toHaveLength(0);
    expect(hyeonchim?.fatiguePoints.join("\n")).not.toHaveLength(0);
    expect(hiddenStem).toMatchObject({
      rawLabel: expect.stringContaining("지장간"),
      userTitle: "겉 기운 안에 숨어 있는 역할",
      plainMeaning: expect.stringContaining("욕구"),
      howItShowsInYou: expect.stringContaining("회복"),
      interpretationTitle: "겉 기운 안에 숨어 있는 역할",
      description: expect.stringContaining("욕구"),
    });
    for (const entry of dictionary) {
      expect(entry.userTitle.trim().length).toBeGreaterThan(6);
      expect(entry.plainMeaning.trim().length).toBeGreaterThan(10);
      expect(entry.howItShowsInYou.trim().length).toBeGreaterThan(10);
      expect(entry.strength.trim().length).toBeGreaterThan(6);
      expect(entry.fatiguePoint.trim().length).toBeGreaterThan(6);
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

  it("keeps the common ManseRyeok table as evidence and the Saju feature chapter as interpretation", () => {
    const typeSource = readFileSync(
      "src/lib/report-generation/comprehensiveReportDraftTypes.ts",
      "utf8",
    );
    const manseTableSource = readFileSync(
      "src/components/report-tables/ManseRyeokCommonTable.tsx",
      "utf8",
    );

    expect(typeSource).toContain("sajuFeatureChapter");
    expect(typeSource).toContain("명리 특징 해석");
    expect(typeSource).toContain("plainMeaning");
    expect(typeSource).toContain("howItShowsInYou");
    expect(manseTableSource).toContain("visibleDetailRows");
    expect(manseTableSource).not.toContain("sajuFeatureChapter");
    expect(manseTableSource).not.toContain("명리 특징 해석");
  });
});
