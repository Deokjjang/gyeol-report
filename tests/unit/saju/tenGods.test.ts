import { describe, expect, it } from "vitest";

import { getTenGod } from "@/lib/saju/tenGods";
import type { HeavenlyStem, TenGod } from "@/lib/saju/types";

const stems: readonly HeavenlyStem[] = [
  "甲",
  "乙",
  "丙",
  "丁",
  "戊",
  "己",
  "庚",
  "辛",
  "壬",
  "癸",
];

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

describe("Ten Gods mapping", () => {
  it("maps all target stems for 甲 day stem", () => {
    const gapExpected: Array<{
      targetStem: HeavenlyStem;
      expected: TenGod;
    }> = [
      { targetStem: "甲", expected: "比肩" },
      { targetStem: "乙", expected: "劫財" },
      { targetStem: "丙", expected: "食神" },
      { targetStem: "丁", expected: "傷官" },
      { targetStem: "戊", expected: "偏財" },
      { targetStem: "己", expected: "正財" },
      { targetStem: "庚", expected: "偏官" },
      { targetStem: "辛", expected: "正官" },
      { targetStem: "壬", expected: "偏印" },
      { targetStem: "癸", expected: "正印" },
    ];

    for (const item of gapExpected) {
      expect(getTenGod("甲", item.targetStem)).toBe(item.expected);
    }
  });

  it("maps all target stems for 乙 day stem", () => {
    const eulExpected: Array<{
      targetStem: HeavenlyStem;
      expected: TenGod;
    }> = [
      { targetStem: "甲", expected: "劫財" },
      { targetStem: "乙", expected: "比肩" },
      { targetStem: "丙", expected: "傷官" },
      { targetStem: "丁", expected: "食神" },
      { targetStem: "戊", expected: "正財" },
      { targetStem: "己", expected: "偏財" },
      { targetStem: "庚", expected: "正官" },
      { targetStem: "辛", expected: "偏官" },
      { targetStem: "壬", expected: "正印" },
      { targetStem: "癸", expected: "偏印" },
    ];

    for (const item of eulExpected) {
      expect(getTenGod("乙", item.targetStem)).toBe(item.expected);
    }
  });

  it("maps all target stems for 丙 day stem", () => {
    const byeongExpected: Array<{
      targetStem: HeavenlyStem;
      expected: TenGod;
    }> = [
      { targetStem: "甲", expected: "偏印" },
      { targetStem: "乙", expected: "正印" },
      { targetStem: "丙", expected: "比肩" },
      { targetStem: "丁", expected: "劫財" },
      { targetStem: "戊", expected: "食神" },
      { targetStem: "己", expected: "傷官" },
      { targetStem: "庚", expected: "偏財" },
      { targetStem: "辛", expected: "正財" },
      { targetStem: "壬", expected: "偏官" },
      { targetStem: "癸", expected: "正官" },
    ];

    for (const item of byeongExpected) {
      expect(getTenGod("丙", item.targetStem)).toBe(item.expected);
    }
  });

  it("produces valid Ten Gods for every day stem and target stem", () => {
    for (const dayStem of stems) {
      for (const targetStem of stems) {
        const result = getTenGod(dayStem, targetStem);

        expect(result).toBeDefined();
        expect(tenGods).toContain(result);
      }
    }
  });

  it("returns deterministic results", () => {
    expect(getTenGod("甲", "庚")).toBe(getTenGod("甲", "庚"));
    expect(getTenGod("辛", "丙")).toBe(getTenGod("辛", "丙"));
  });
});
