import { describe, expect, it } from "vitest";

import {
  analyzeVisibleElements,
  analyzeVisibleTenGods,
  analyzeVisibleYinYang,
  createEmptyElementCounts,
  createEmptyTenGodDistribution,
  type PillarSet,
} from "@/lib/saju/analyze";
import type { TenGod } from "@/lib/saju/types";

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

const tenGods: readonly TenGod[] = [
  "比肩",
  "劫財",
  "食神",
  "傷官",
  "偏財",
  "正財",
  "偏官",
  "正官",
  "偏印",
  "正印",
];

describe("visible element analysis", () => {
  it("creates empty element counts", () => {
    expect(createEmptyElementCounts()).toEqual({
      WOOD: 0,
      FIRE: 0,
      EARTH: 0,
      METAL: 0,
      WATER: 0,
    });
  });

  it("counts visible elements with hour pillar", () => {
    const result = analyzeVisibleElements(fixtureWithHour);

    expect(result.visible).toEqual({
      WOOD: 2,
      FIRE: 1,
      EARTH: 2,
      METAL: 2,
      WATER: 1,
    });
    expect(result.weighted).toEqual(result.visible);
    expect(result.labels).toEqual(["FIRE_WEAK", "WATER_WEAK"]);
  });

  it("counts visible elements without hour pillar", () => {
    const result = analyzeVisibleElements(fixtureWithoutHour);
    const total = Object.values(result.visible).reduce(
      (sum, count) => sum + count,
      0,
    );

    expect(total).toBe(6);
    expect(result.visible).toEqual({
      WOOD: 2,
      FIRE: 0,
      EARTH: 2,
      METAL: 1,
      WATER: 1,
    });
    expect(result.weighted).toEqual(result.visible);
    expect(result.labels).toEqual([
      "FIRE_MISSING",
      "METAL_WEAK",
      "WATER_WEAK",
    ]);
  });

  it("labels strong elements", () => {
    const earthStrongFixture: PillarSet = {
      year: { stem: "戊", branch: "辰" },
      month: { stem: "己", branch: "丑" },
      day: { stem: "甲", branch: "申" },
    };
    const result = analyzeVisibleElements(earthStrongFixture);

    expect(result.labels).toContain("EARTH_STRONG");
  });
});

describe("visible Ten Gods analysis", () => {
  it("creates empty Ten God distribution", () => {
    const distribution = createEmptyTenGodDistribution();

    for (const tenGod of tenGods) {
      expect(distribution[tenGod]).toBe(0);
    }
  });

  it("analyzes visible Ten Gods with hour pillar", () => {
    const result = analyzeVisibleTenGods(fixtureWithHour);

    expect(result.stems).toEqual({
      year: "比肩",
      month: "偏財",
      hour: "偏官",
    });
    expect(result.distribution).toEqual({
      比肩: 1,
      劫財: 0,
      食神: 0,
      傷官: 0,
      偏財: 1,
      正財: 0,
      偏官: 1,
      正官: 0,
      偏印: 0,
      正印: 0,
    });
  });

  it("analyzes visible Ten Gods without hour pillar", () => {
    const result = analyzeVisibleTenGods(fixtureWithoutHour);

    expect(result.stems).toEqual({
      year: "比肩",
      month: "偏財",
    });
    expect(result.stems.hour).toBeUndefined();
  });

  it("does not count the day stem as a visible Ten God", () => {
    const result = analyzeVisibleTenGods(fixtureWithHour);
    const total = Object.values(result.distribution).reduce(
      (sum, count) => sum + count,
      0,
    );

    expect(total).toBe(3);
  });
});

describe("visible yin-yang analysis", () => {
  it("analyzes visible yin-yang with hour pillar", () => {
    expect(analyzeVisibleYinYang(fixtureWithHour)).toEqual({
      yin: 0,
      yang: 8,
      label: "YANG_HEAVY",
    });
  });

  it("labels yin-heavy and balanced fixtures", () => {
    const balancedFixture: PillarSet = {
      year: { stem: "乙", branch: "卯" },
      month: { stem: "甲", branch: "子" },
      day: { stem: "丁", branch: "巳" },
    };
    const trueBalancedFixture: PillarSet = {
      year: { stem: "乙", branch: "卯" },
      month: { stem: "甲", branch: "子" },
      day: { stem: "甲", branch: "卯" },
    };

    expect(analyzeVisibleYinYang(balancedFixture)).toEqual({
      yin: 4,
      yang: 2,
      label: "YIN_HEAVY",
    });
    expect(analyzeVisibleYinYang(trueBalancedFixture)).toEqual({
      yin: 3,
      yang: 3,
      label: "BALANCED",
    });
  });
});

describe("visible analysis determinism", () => {
  it("returns deterministic analysis results", () => {
    expect(analyzeVisibleElements(fixtureWithHour)).toEqual(
      analyzeVisibleElements(fixtureWithHour),
    );
    expect(analyzeVisibleTenGods(fixtureWithHour)).toEqual(
      analyzeVisibleTenGods(fixtureWithHour),
    );
    expect(analyzeVisibleYinYang(fixtureWithHour)).toEqual(
      analyzeVisibleYinYang(fixtureWithHour),
    );
  });
});
