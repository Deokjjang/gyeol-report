import { describe, expect, it } from "vitest";

import {
  DEOKMIN_REPORT_SMOKE_FIXTURE_ID,
  DEFAULT_REPORT_SMOKE_FIXTURE_ID,
  getReportQualitySmokeSampleFixtures,
  getReportSmokeFixture,
  getReportSmokeFixtureIdFromArgs,
  getReportSmokeFixtureMatrixModeFromArgs,
  REPORT_QUALITY_FIXTURE_MATRIX,
} from "../../../src/lib/report-knowledge/reportQualityFixtureMatrix";

describe("report quality fixture matrix", () => {
  it("contains broad Saju and MBTI coverage", () => {
    const uniqueMbtiTypes = new Set(
      REPORT_QUALITY_FIXTURE_MATRIX.map((fixture) => fixture.mbti),
    );
    const uniqueDayMasters = new Set(
      REPORT_QUALITY_FIXTURE_MATRIX.map((fixture) => fixture.sajuFacts.dayMaster),
    );

    expect(REPORT_QUALITY_FIXTURE_MATRIX.length).toBeGreaterThanOrEqual(12);
    expect(uniqueMbtiTypes.size).toBeGreaterThanOrEqual(10);
    expect(uniqueDayMasters.size).toBeGreaterThanOrEqual(8);
    for (const mbti of [
      "ENTJ",
      "INFP",
      "ISTJ",
      "ENFP",
      "ESTP",
      "INFJ",
      "ISFJ",
      "INTJ",
      "ESFP",
      "ENTP",
      "ISFP",
      "ESTJ",
    ]) {
      expect(uniqueMbtiTypes.has(mbti)).toBe(true);
    }
  });

  it("separates default and deokmin smoke fixtures", () => {
    const defaultFixture = getReportSmokeFixture("default");
    const deokminFixture = getReportSmokeFixture("deokmin");

    expect(defaultFixture.id).toBe(DEFAULT_REPORT_SMOKE_FIXTURE_ID);
    expect(defaultFixture.expectedPillars).toEqual({
      year: "丙子",
      month: "己亥",
      day: "甲申",
      hour: "丁未",
    });
    expect(deokminFixture.id).toBe(DEOKMIN_REPORT_SMOKE_FIXTURE_ID);
    expect(deokminFixture.expectedPillars).toEqual({
      year: "己卯",
      month: "辛未",
      day: "甲申",
      hour: "戊辰",
    });
    expect(deokminFixture.sajuFacts).toMatchObject({
      yearPillar: "기묘",
      monthPillar: "신미",
      dayPillar: "갑신",
      hourPillar: "무진",
    });
    expect(deokminFixture.mbti).toBe("ENTJ");
    expect(defaultFixture.expectedPillars).not.toEqual(
      deokminFixture.expectedPillars,
    );
  });

  it("parses smoke fixture flags with default fallback", () => {
    expect(getReportSmokeFixtureIdFromArgs([])).toBe("default");
    expect(getReportSmokeFixtureIdFromArgs(["--fixture", "default"])).toBe(
      "default",
    );
    expect(getReportSmokeFixtureIdFromArgs(["--fixture", "deokmin"])).toBe(
      "deokmin",
    );
    expect(getReportSmokeFixtureIdFromArgs(["--fixture=deokmin"])).toBe(
      "deokmin",
    );
    expect(getReportSmokeFixtureIdFromArgs(["--fixture", "unknown"])).toBe(
      "default",
    );
  });

  it("provides a sample quality matrix smoke subset with non-ENTJ coverage", () => {
    const fixtures = getReportQualitySmokeSampleFixtures();
    const mbtiTypes = new Set(fixtures.map((fixture) => fixture.mbti));

    expect(fixtures).toHaveLength(5);
    expect(fixtures.map((fixture) => fixture.id)).toEqual(
      expect.arrayContaining([
        DEOKMIN_REPORT_SMOKE_FIXTURE_ID,
        "reflective-water-infp",
        "money-resource-estp",
        "responsibility-earth-istj",
        "growth-wood-infj",
      ]),
    );
    expect(mbtiTypes.size).toBeGreaterThanOrEqual(5);
    expect(mbtiTypes.has("ENTJ")).toBe(true);
    expect(mbtiTypes.has("INFP")).toBe(true);
    expect(mbtiTypes.has("ESTP")).toBe(true);
    expect(mbtiTypes.has("ISTJ")).toBe(true);
    expect(mbtiTypes.has("INFJ")).toBe(true);
    expect(fixtures.some((fixture) => fixture.mbti !== "ENTJ")).toBe(true);
    expect(getReportSmokeFixtureMatrixModeFromArgs(["--fixture-matrix", "sample"])).toBe(
      "sample",
    );
    expect(getReportSmokeFixtureMatrixModeFromArgs(["--fixture-matrix=sample"])).toBe(
      "sample",
    );
    expect(getReportSmokeFixtureMatrixModeFromArgs(["--fixture-matrix", "all"])).toBe(
      undefined,
    );
  });

  it("covers positive mixed warning and product quality focus areas", () => {
    const serializedLabels = REPORT_QUALITY_FIXTURE_MATRIX.flatMap(
      (fixture) => fixture.expectedFeatureLabels,
    ).join("\n");
    const focusTags = new Set(
      REPORT_QUALITY_FIXTURE_MATRIX.flatMap((fixture) => fixture.qualityFocus),
    );

    expect(serializedLabels).toContain("천을귀인");
    expect(serializedLabels).toContain("재고귀인");
    expect(serializedLabels).toContain("원진살");
    expect(serializedLabels).toContain("백호대살");
    expect(serializedLabels).toContain("공망");
    for (const focus of ["money", "work", "love", "study", "growth"]) {
      expect(focusTags.has(focus)).toBe(true);
    }
    expect(focusTags.has("positive")).toBe(true);
    expect(focusTags.has("mixed")).toBe(true);
    expect(focusTags.has("warning")).toBe(true);
    expect(JSON.stringify(REPORT_QUALITY_FIXTURE_MATRIX)).not.toContain("덕민");
  });
});
