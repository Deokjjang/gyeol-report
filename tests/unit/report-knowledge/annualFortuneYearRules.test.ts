import { describe, expect, it } from "vitest";

import {
  getAnnualBranchInteractions,
  getAnnualFortuneYearAccess,
  getAnnualGanjiInfo,
  getTenGodForStemPair,
} from "../../../src/lib/report-knowledge/annualFortuneYearRules";

describe("annualFortuneYearRules", () => {
  it("calculates annual ganji for the supported v1 review window", () => {
    expect(getAnnualGanjiInfo(2021).ganji).toBe("辛丑");
    expect(getAnnualGanjiInfo(2022).ganji).toBe("壬寅");
    expect(getAnnualGanjiInfo(2023).ganji).toBe("癸卯");
    expect(getAnnualGanjiInfo(2024).ganji).toBe("甲辰");
    expect(getAnnualGanjiInfo(2025).ganji).toBe("乙巳");
    expect(getAnnualGanjiInfo(2026).ganji).toBe("丙午");
    expect(getAnnualGanjiInfo(2027).ganji).toBe("丁未");
  });

  it("maps annual stem and branch elements", () => {
    const year2026 = getAnnualGanjiInfo(2026);
    const year2024 = getAnnualGanjiInfo(2024);

    expect(year2026.stemElement).toBe("fire");
    expect(year2026.branchElement).toBe("fire");
    expect(year2024.stemElement).toBe("wood");
    expect(year2024.branchElement).toBe("earth");
  });

  it("applies annual fortune year access policy", () => {
    const june2026 = new Date("2026-06-18T00:00:00+09:00");
    const november2026 = new Date("2026-11-30T00:00:00+09:00");
    const december2026 = new Date("2026-12-01T00:00:00+09:00");

    expect(
      getAnnualFortuneYearAccess({
        targetYear: 2021,
        currentDate: june2026,
      }),
    ).toMatchObject({ isSelectable: true, mode: "past_review" });
    expect(
      getAnnualFortuneYearAccess({
        targetYear: 2026,
        currentDate: june2026,
      }),
    ).toMatchObject({ isSelectable: true, mode: "current_year" });
    expect(
      getAnnualFortuneYearAccess({
        targetYear: 2027,
        currentDate: november2026,
      }),
    ).toMatchObject({ isSelectable: false, mode: "locked_future" });
    expect(
      getAnnualFortuneYearAccess({
        targetYear: 2027,
        currentDate: december2026,
      }),
    ).toMatchObject({ isSelectable: true, mode: "new_year_preview" });
    expect(
      getAnnualFortuneYearAccess({
        targetYear: 2028,
        currentDate: december2026,
      }),
    ).toMatchObject({ isSelectable: false, mode: "locked_future" });
    expect(
      getAnnualFortuneYearAccess({
        targetYear: 2020,
        currentDate: june2026,
      }),
    ).toMatchObject({ isSelectable: false, mode: "locked_future" });
  });

  it("calculates ten-god relationship from day master to annual stem", () => {
    expect(getTenGodForStemPair("甲", "丙")).toBe("식신");
    expect(getTenGodForStemPair("甲", "丁")).toBe("상관");
    expect(getTenGodForStemPair("甲", "甲")).toBe("비견");
    expect(getTenGodForStemPair("甲", "乙")).toBe("겁재");
    expect(getTenGodForStemPair("甲", "戊")).toBe("편재");
    expect(getTenGodForStemPair("甲", "己")).toBe("정재");
    expect(getTenGodForStemPair("甲", "庚")).toBe("편관");
    expect(getTenGodForStemPair("甲", "辛")).toBe("정관");
    expect(getTenGodForStemPair("甲", "壬")).toBe("편인");
    expect(getTenGodForStemPair("甲", "癸")).toBe("정인");
  });

  it("detects annual branch interactions with natal branches", () => {
    const deokminNatalBranches = ["卯", "未", "申", "辰"] as const;
    const year2026 = getAnnualBranchInteractions({
      annualBranch: "午",
      natalBranches: deokminNatalBranches,
    });
    const year2024 = getAnnualBranchInteractions({
      annualBranch: "辰",
      natalBranches: deokminNatalBranches,
    });

    expect(year2026).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "육합",
          branches: ["午", "未"],
          affectedPillars: ["month"],
        }),
      ]),
    );
    expect(year2024).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "형",
          branches: ["辰", "辰"],
          affectedPillars: ["hour"],
        }),
        expect.objectContaining({
          type: "반합",
          branches: expect.arrayContaining(["辰", "申"]),
        }),
      ]),
    );
  });
});
