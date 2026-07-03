import { describe, expect, it } from "vitest";

import {
  getMbtiMyeongliBridgeHints,
  getMbtiRelationshipPair,
  getMbtiReportUseCase,
  getMbtiSourceProfile,
  getMbtiTraitArea,
  MBTI_REPORT_USE_CASE_KEYS,
  MBTI_SOURCE_TYPES,
  MBTI_TRAIT_AREAS,
} from "../../../../src/lib/report-knowledge/mbti";

describe("MBTI source runtime adapter", () => {
  it("loads all 16 MBTI source profiles", () => {
    expect(MBTI_SOURCE_TYPES).toHaveLength(16);

    for (const type of MBTI_SOURCE_TYPES) {
      const profile = getMbtiSourceProfile(type);

      expect(profile?.type).toBe(type);
      expect(profile?.titleKo).toBeTypeOf("string");
      expect(profile?.archetype).toBeTypeOf("string");
      expect(profile?.oneLine).toBeTypeOf("string");
    }
  });

  it("normalizes type input and returns null for unknown type", () => {
    expect(getMbtiSourceProfile(" entj ")?.type).toBe("ENTJ");
    expect(getMbtiSourceProfile("unknown")).toBeNull();
    expect(getMbtiSourceProfile(null)).toBeNull();
  });

  it("returns all six report use case keys for every source type", () => {
    expect(MBTI_REPORT_USE_CASE_KEYS).toEqual([
      "generalReport",
      "careerReport",
      "loveMarriageChildReport",
      "compatibilityReport",
      "daeunReport",
      "saeunReport",
    ]);

    for (const type of MBTI_SOURCE_TYPES) {
      for (const reportKey of MBTI_REPORT_USE_CASE_KEYS) {
        const useCase = getMbtiReportUseCase(type, reportKey);

        expect(useCase).not.toBeNull();
        expect(useCase?.length).toBeGreaterThan(0);
      }
    }
  });

  it("returns null for unknown report use case keys", () => {
    expect(getMbtiReportUseCase("ENTJ", "unknownReport")).toBeNull();
    expect(getMbtiReportUseCase("unknown", "generalReport")).toBeNull();
  });

  it("returns trait areas from the source profile", () => {
    expect(MBTI_TRAIT_AREAS).toEqual([
      "identity",
      "thinkingStyle",
      "career",
      "workplace",
      "money",
      "investment",
      "study",
      "love",
      "marriage",
      "parenting",
      "child",
      "relationships",
      "communication",
      "strengths",
      "risks",
      "growth",
    ]);

    for (const area of MBTI_TRAIT_AREAS) {
      const traits = getMbtiTraitArea("ENTJ", area);

      expect(traits).not.toBeNull();
      expect(traits?.length).toBeGreaterThan(0);
    }
  });

  it("returns null for unknown trait areas", () => {
    expect(getMbtiTraitArea("ENTJ", "unknownArea")).toBeNull();
    expect(getMbtiTraitArea("unknown", "identity")).toBeNull();
  });

  it("finds relationship pairs by withType", () => {
    const pair = getMbtiRelationshipPair("ENTJ", "isfp");

    expect(pair).toMatchObject({
      withType: "ISFP",
    });
    expect(pair?.sharedGround.length).toBeGreaterThan(0);
    expect(pair?.friction.length).toBeGreaterThan(0);
    expect(pair?.positiveInfluence.length).toBeGreaterThan(0);
    expect(pair?.repairStrategy.length).toBeGreaterThan(0);
    expect(pair?.reportLine).toBeTypeOf("string");
  });

  it("returns null for unknown relationship pair input", () => {
    expect(getMbtiRelationshipPair("ENTJ", "unknown")).toBeNull();
    expect(getMbtiRelationshipPair("unknown", "ENTJ")).toBeNull();
  });

  it("returns myeongli bridge hints", () => {
    const hints = getMbtiMyeongliBridgeHints("entj");

    expect(hints).not.toBeNull();
    expect(hints?.length).toBeGreaterThan(0);
    expect(hints?.[0]?.signal).toBeTypeOf("string");
    expect(hints?.[0]?.reason).toBeTypeOf("string");
    expect(Array.isArray(hints?.[0]?.relatedTraits)).toBe(true);
    expect(Array.isArray(hints?.[0]?.productDomains)).toBe(true);
  });

  it("returns null for bridge hints when type is unknown", () => {
    expect(getMbtiMyeongliBridgeHints("unknown")).toBeNull();
  });
});
