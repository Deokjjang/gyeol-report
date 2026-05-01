import { describe, expect, it } from "vitest";

import {
  analyzeFullElements,
  analyzeFullTenGods,
  analyzeHiddenStems,
  analyzeWeightedElements,
  type PillarSet,
} from "@/lib/saju/analyze";

const fixtureWithHour: PillarSet = {
  year: { stem: "甲", branch: "子" },
  month: { stem: "戊", branch: "辰" },
  day: { stem: "甲", branch: "申" },
  hour: { stem: "庚", branch: "午" },
};

const fixtureWithoutHour: PillarSet = {
  year: { stem: "甲", branch: "子" },
  month: { stem: "戊", branch: "辰" },
  day: { stem: "甲", branch: "申" },
};

function expectFixtureWeightedElements(
  weighted: Record<"WOOD" | "FIRE" | "EARTH" | "METAL" | "WATER", number>,
): void {
  expect(weighted.WOOD).toBeCloseTo(2.3);
  expect(weighted.FIRE).toBeCloseTo(1.6);
  expect(weighted.EARTH).toBeCloseTo(3);
  expect(weighted.METAL).toBeCloseTo(2.6);
  expect(weighted.WATER).toBeCloseTo(2);
}

describe("hidden stem analysis", () => {
  it("returns hidden stems in deterministic order", () => {
    expect(analyzeHiddenStems(fixtureWithHour).entries).toEqual([
      { branch: "子", stem: "癸", tenGod: "正印", weight: 0.6 },
      { branch: "辰", stem: "戊", tenGod: "偏財", weight: 0.6 },
      { branch: "辰", stem: "乙", tenGod: "劫財", weight: 0.3 },
      { branch: "辰", stem: "癸", tenGod: "正印", weight: 0.1 },
      { branch: "申", stem: "庚", tenGod: "偏官", weight: 0.6 },
      { branch: "申", stem: "壬", tenGod: "偏印", weight: 0.3 },
      { branch: "申", stem: "戊", tenGod: "偏財", weight: 0.1 },
      { branch: "午", stem: "丁", tenGod: "傷官", weight: 0.6 },
      { branch: "午", stem: "己", tenGod: "正財", weight: 0.3 },
    ]);
  });

  it("uses fractional weights in hidden Ten God distribution", () => {
    const distribution = analyzeHiddenStems(fixtureWithHour).tenGodDistribution;

    expect(distribution.正印).toBeCloseTo(0.7);
    expect(distribution.偏財).toBeCloseTo(0.7);
    expect(distribution.劫財).toBeCloseTo(0.3);
    expect(distribution.偏官).toBeCloseTo(0.6);
    expect(distribution.偏印).toBeCloseTo(0.3);
    expect(distribution.傷官).toBeCloseTo(0.6);
    expect(distribution.正財).toBeCloseTo(0.3);
    expect(distribution.比肩).toBe(0);
    expect(distribution.食神).toBe(0);
    expect(distribution.正官).toBe(0);
  });

  it("excludes hour branch hidden stems when hour is missing", () => {
    const result = analyzeHiddenStems(fixtureWithoutHour);

    expect(result.entries).toHaveLength(7);
    expect(result.entries.some((entry) => entry.branch === "午")).toBe(false);
  });
});

describe("weighted element analysis", () => {
  it("includes visible elements and hidden stem weights", () => {
    expectFixtureWeightedElements(analyzeWeightedElements(fixtureWithHour));
  });

  it("uses visible counts and weighted counts for full element analysis", () => {
    const result = analyzeFullElements(fixtureWithHour);

    expect(result.visible).toEqual({
      WOOD: 2,
      FIRE: 1,
      EARTH: 2,
      METAL: 2,
      WATER: 1,
    });
    expectFixtureWeightedElements(result.weighted);
    expect(result.labels).toEqual(["EARTH_STRONG"]);
  });
});

describe("full Ten Gods analysis", () => {
  it("combines visible and hidden Ten God distributions", () => {
    const result = analyzeFullTenGods(fixtureWithHour);

    expect(result.distribution.比肩).toBe(1);
    expect(result.distribution.偏財).toBeCloseTo(1.7);
    expect(result.distribution.偏官).toBeCloseTo(1.6);
    expect(result.distribution.正印).toBeCloseTo(0.7);
    expect(result.distribution.劫財).toBeCloseTo(0.3);
    expect(result.distribution.偏印).toBeCloseTo(0.3);
    expect(result.distribution.傷官).toBeCloseTo(0.6);
    expect(result.distribution.正財).toBeCloseTo(0.3);
    expect(result.stems).toEqual({
      year: "比肩",
      month: "偏財",
      hour: "偏官",
    });
    expect(result.hiddenStems).toEqual(
      analyzeHiddenStems(fixtureWithHour).entries,
    );
  });
});

describe("hidden stem analysis determinism", () => {
  it("returns deterministic analysis results", () => {
    expect(analyzeHiddenStems(fixtureWithHour)).toEqual(
      analyzeHiddenStems(fixtureWithHour),
    );
    expect(analyzeWeightedElements(fixtureWithHour)).toEqual(
      analyzeWeightedElements(fixtureWithHour),
    );
    expect(analyzeFullElements(fixtureWithHour)).toEqual(
      analyzeFullElements(fixtureWithHour),
    );
    expect(analyzeFullTenGods(fixtureWithHour)).toEqual(
      analyzeFullTenGods(fixtureWithHour),
    );
  });
});
