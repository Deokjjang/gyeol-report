import { describe, expect, it } from "vitest";

import {
  MBTI_TRAITS,
  MBTI_TYPES,
  getMbtiProfile,
  type MbtiTraitCode,
  type MbtiType,
} from "@/lib/mbti/types";

function getTraitCodes(type: MbtiType): MbtiTraitCode[] {
  return getMbtiProfile(type).traits.map((trait) => trait.code);
}

describe("MBTI trait mapping", () => {
  it("supports all 16 MBTI types", () => {
    const expectedTypes: readonly MbtiType[] = [
      "INTJ",
      "INTP",
      "ENTJ",
      "ENTP",
      "INFJ",
      "INFP",
      "ENFJ",
      "ENFP",
      "ISTJ",
      "ISFJ",
      "ESTJ",
      "ESFJ",
      "ISTP",
      "ISFP",
      "ESTP",
      "ESFP",
    ];

    expect(MBTI_TYPES).toEqual(expectedTypes);
  });

  it("returns a profile for every MBTI type", () => {
    for (const type of MBTI_TYPES) {
      const profile = getMbtiProfile(type);

      expect(profile.type).toBe(type);
      expect(profile.traits.length).toBeGreaterThanOrEqual(4);
    }
  });

  it("includes axis traits first", () => {
    expect(getTraitCodes("INTJ").slice(0, 4)).toEqual([
      "INTROVERSION",
      "INTUITION",
      "THINKING",
      "JUDGING",
    ]);
    expect(getTraitCodes("ENTP").slice(0, 4)).toEqual([
      "EXTRAVERSION",
      "INTUITION",
      "THINKING",
      "PERCEIVING",
    ]);
    expect(getTraitCodes("ISFJ").slice(0, 4)).toEqual([
      "INTROVERSION",
      "SENSING",
      "FEELING",
      "JUDGING",
    ]);
    expect(getTraitCodes("ESFP").slice(0, 4)).toEqual([
      "EXTRAVERSION",
      "SENSING",
      "FEELING",
      "PERCEIVING",
    ]);
  });

  it("returns exact ENTJ trait mapping", () => {
    expect(getTraitCodes("ENTJ")).toEqual([
      "EXTRAVERSION",
      "INTUITION",
      "THINKING",
      "JUDGING",
      "DIRECT_DECISION",
      "SYSTEM_BUILDING",
      "EFFICIENCY_ORIENTATION",
      "CONFLICT_DIRECTNESS",
    ]);
  });

  it("returns exact INFP trait mapping", () => {
    expect(getTraitCodes("INFP")).toEqual([
      "INTROVERSION",
      "INTUITION",
      "FEELING",
      "PERCEIVING",
      "EMOTIONAL_ATTUNEMENT",
      "INTERNAL_PROCESSING",
      "EXPLORATION_DRIVE",
    ]);
  });

  it("returns exact ESTP trait mapping", () => {
    expect(getTraitCodes("ESTP")).toEqual([
      "EXTRAVERSION",
      "SENSING",
      "THINKING",
      "PERCEIVING",
      "SPONTANEOUS_ACTION",
      "DIRECT_DECISION",
      "DETAIL_GROUNDING",
    ]);
  });

  it("does not include duplicate traits per profile", () => {
    for (const type of MBTI_TYPES) {
      const codes = getTraitCodes(type);

      expect(new Set(codes).size).toBe(codes.length);
    }
  });

  it("provides metadata for every referenced trait", () => {
    for (const type of MBTI_TYPES) {
      const profile = getMbtiProfile(type);

      for (const trait of profile.traits) {
        expect(MBTI_TRAITS[trait.code]).toBeDefined();
        expect(trait.labelKo).toBeTruthy();
        expect(trait.descriptionKo).toBeTruthy();
      }
    }
  });

  it("uses safe trait descriptions", () => {
    const forbiddenWords = [
      "무" + "조건",
      "반" + "드시",
      "운" + "명",
      "타고" + "났다",
      "절" + "대",
      "항" + "상",
    ];

    for (const trait of Object.values(MBTI_TRAITS)) {
      for (const word of forbiddenWords) {
        expect(trait.descriptionKo).not.toContain(word);
      }
    }
  });

  it("returns deterministic profiles", () => {
    expect(getMbtiProfile("ENTJ")).toEqual(getMbtiProfile("ENTJ"));
    expect(getMbtiProfile("INFP")).toEqual(getMbtiProfile("INFP"));
  });
});
