import { describe, expect, it } from "vitest";

import {
  analyzeRelations,
  type PillarSetForRelations,
} from "@/lib/saju/relations";

describe("relations analysis", () => {
  it("returns empty arrays when no relations exist", () => {
    const noRelationFixture: PillarSetForRelations = {
      year: { stem: "甲", branch: "寅" },
      month: { stem: "丙", branch: "辰" },
      day: { stem: "丁", branch: "未" },
    };

    expect(analyzeRelations(noRelationFixture)).toEqual({
      stemCombinations: [],
      branchCombinations: [],
      branchClashes: [],
    });
  });

  it("detects stem combinations", () => {
    const stemCombinationFixture: PillarSetForRelations = {
      year: { stem: "甲", branch: "寅" },
      month: { stem: "己", branch: "辰" },
      day: { stem: "庚", branch: "申" },
    };
    const result = analyzeRelations(stemCombinationFixture);

    expect(result.stemCombinations).toEqual([
      {
        type: "STEM_COMBINATION",
        pair: ["甲", "己"],
        positions: ["year", "month"],
      },
    ]);
  });

  it("detects reversed stem combinations with canonical pairs", () => {
    const reversedStemFixture: PillarSetForRelations = {
      year: { stem: "己", branch: "寅" },
      month: { stem: "甲", branch: "辰" },
      day: { stem: "庚", branch: "申" },
    };
    const result = analyzeRelations(reversedStemFixture);

    expect(result.stemCombinations).toEqual([
      {
        type: "STEM_COMBINATION",
        pair: ["甲", "己"],
        positions: ["year", "month"],
      },
    ]);
  });

  it("detects branch combinations", () => {
    const branchCombinationFixture: PillarSetForRelations = {
      year: { stem: "甲", branch: "子" },
      month: { stem: "丙", branch: "丑" },
      day: { stem: "庚", branch: "申" },
    };
    const result = analyzeRelations(branchCombinationFixture);

    expect(result.branchCombinations).toEqual([
      {
        type: "BRANCH_COMBINATION",
        pair: ["子", "丑"],
        positions: ["year", "month"],
      },
    ]);
  });

  it("detects reversed branch combinations with canonical pairs", () => {
    const reversedBranchCombinationFixture: PillarSetForRelations = {
      year: { stem: "甲", branch: "丑" },
      month: { stem: "丙", branch: "子" },
      day: { stem: "庚", branch: "申" },
    };
    const result = analyzeRelations(reversedBranchCombinationFixture);

    expect(result.branchCombinations).toEqual([
      {
        type: "BRANCH_COMBINATION",
        pair: ["子", "丑"],
        positions: ["year", "month"],
      },
    ]);
  });

  it("detects branch clashes", () => {
    const branchClashFixture: PillarSetForRelations = {
      year: { stem: "甲", branch: "子" },
      month: { stem: "丙", branch: "午" },
      day: { stem: "庚", branch: "申" },
    };
    const result = analyzeRelations(branchClashFixture);

    expect(result.branchClashes).toEqual([
      {
        type: "BRANCH_CLASH",
        pair: ["子", "午"],
        positions: ["year", "month"],
      },
    ]);
  });

  it("detects reversed branch clashes with canonical pairs", () => {
    const reversedBranchClashFixture: PillarSetForRelations = {
      year: { stem: "甲", branch: "午" },
      month: { stem: "丙", branch: "子" },
      day: { stem: "庚", branch: "申" },
    };
    const result = analyzeRelations(reversedBranchClashFixture);

    expect(result.branchClashes).toEqual([
      {
        type: "BRANCH_CLASH",
        pair: ["子", "午"],
        positions: ["year", "month"],
      },
    ]);
  });

  it("includes hour position when present", () => {
    const hourFixture: PillarSetForRelations = {
      year: { stem: "甲", branch: "寅" },
      month: { stem: "丙", branch: "辰" },
      day: { stem: "庚", branch: "申" },
      hour: { stem: "己", branch: "亥" },
    };
    const result = analyzeRelations(hourFixture);

    expect(result.stemCombinations).toEqual([
      {
        type: "STEM_COMBINATION",
        pair: ["甲", "己"],
        positions: ["year", "hour"],
      },
    ]);
    expect(result.branchCombinations).toEqual([
      {
        type: "BRANCH_COMBINATION",
        pair: ["寅", "亥"],
        positions: ["year", "hour"],
      },
    ]);
  });

  it("excludes hour position when hour is missing", () => {
    const fixtureWithoutHour: PillarSetForRelations = {
      year: { stem: "甲", branch: "寅" },
      month: { stem: "丙", branch: "辰" },
      day: { stem: "庚", branch: "申" },
    };
    const result = analyzeRelations(fixtureWithoutHour);
    const allPositions = [
      ...result.stemCombinations.flatMap((item) => item.positions),
      ...result.branchCombinations.flatMap((item) => item.positions),
      ...result.branchClashes.flatMap((item) => item.positions),
    ];

    expect(allPositions).not.toContain("hour");
  });

  it("preserves deterministic scan order", () => {
    const orderFixture: PillarSetForRelations = {
      year: { stem: "甲", branch: "子" },
      month: { stem: "己", branch: "丑" },
      day: { stem: "乙", branch: "午" },
      hour: { stem: "庚", branch: "戌" },
    };
    const result = analyzeRelations(orderFixture);

    expect(result.stemCombinations).toEqual([
      {
        type: "STEM_COMBINATION",
        pair: ["甲", "己"],
        positions: ["year", "month"],
      },
      {
        type: "STEM_COMBINATION",
        pair: ["乙", "庚"],
        positions: ["day", "hour"],
      },
    ]);
    expect(result.branchCombinations).toEqual([
      {
        type: "BRANCH_COMBINATION",
        pair: ["子", "丑"],
        positions: ["year", "month"],
      },
    ]);
    expect(result.branchClashes).toEqual([
      {
        type: "BRANCH_CLASH",
        pair: ["子", "午"],
        positions: ["year", "day"],
      },
    ]);
  });

  it("returns deterministic relation analysis results", () => {
    const orderFixture: PillarSetForRelations = {
      year: { stem: "甲", branch: "子" },
      month: { stem: "己", branch: "丑" },
      day: { stem: "乙", branch: "午" },
      hour: { stem: "庚", branch: "戌" },
    };

    expect(analyzeRelations(orderFixture)).toEqual(
      analyzeRelations(orderFixture),
    );
  });
});
