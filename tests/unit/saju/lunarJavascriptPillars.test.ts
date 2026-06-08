import { describe, expect, it } from "vitest";

import { calculateSaju } from "@/lib/saju/calculateSaju";
import { getLunarJavascriptPillarsFromSolarDateTime } from "@/lib/saju/lunarJavascriptPillars";
import { UnsupportedSolarTermYearError } from "@/lib/saju/solarTerms";
import type { Pillar, SajuCalcInput } from "@/lib/saju/types";

type VerifiedParityFixture = {
  readonly name: string;
  readonly input: SajuCalcInput;
  readonly isoDateTimeKst: string;
  readonly expectedYear: Pillar;
  readonly expectedMonth?: Pillar;
};

const verifiedParityFixtures: readonly VerifiedParityFixture[] = [
  {
    name: "2024 IPCHUN full Saju fixture",
    input: {
      birthDate: "2024-02-04",
      birthTime: "17:27",
      birthTimeUnknown: false,
      calendarType: "SOLAR",
      gender: "MALE",
      timezone: "Asia/Seoul",
    },
    isoDateTimeKst: "2024-02-04T17:27:00+09:00",
    expectedYear: { stem: "甲", branch: "辰" },
    expectedMonth: { stem: "丙", branch: "寅" },
  },
  {
    name: "2024 GYEONGCHIP month boundary fixture",
    input: {
      birthDate: "2024-03-05",
      birthTime: "11:23",
      birthTimeUnknown: false,
      calendarType: "SOLAR",
      gender: "MALE",
      timezone: "Asia/Seoul",
    },
    isoDateTimeKst: "2024-03-05T11:23:00+09:00",
    expectedYear: { stem: "甲", branch: "辰" },
    expectedMonth: { stem: "丁", branch: "卯" },
  },
];

function getCalculatedPillarSet(input: SajuCalcInput): {
  readonly year: Pillar;
  readonly month: Pillar;
  readonly day: Pillar;
  readonly hour: Pillar;
} {
  const result = calculateSaju(input);
  const { year, month, day, hour } = result.pillars;

  expect(input.timezone).toBe("Asia/Seoul");
  expect(hour).toBeDefined();
  if (!hour) {
    throw new Error("Expected hour pillar for parity fixture.");
  }

  return {
    year,
    month,
    day,
    hour,
  };
}

describe("getLunarJavascriptPillarsFromSolarDateTime", () => {
  it("returns verified broad-year pillars for the 1996 production payload", () => {
    expect(
      getLunarJavascriptPillarsFromSolarDateTime(
        "1996-12-06T14:15:00+09:00",
      ),
    ).toEqual({
      year: { stem: "丙", branch: "子" },
      month: { stem: "己", branch: "亥" },
      day: { stem: "丁", branch: "丑" },
      hour: { stem: "丁", branch: "未" },
    });
  });

  for (const fixture of verifiedParityFixtures) {
    it(`matches verified-table year-month primary path for ${fixture.name}`, () => {
      const calculatedPillars = getCalculatedPillarSet(fixture.input);
      const lunarJavascriptPillars =
        getLunarJavascriptPillarsFromSolarDateTime(fixture.isoDateTimeKst);

      // The verified solar-term table owns year/month boundary behavior.
      // Existing project tests keep the current day/hour policy fixed separately.
      expect(calculatedPillars.year).toEqual(fixture.expectedYear);
      expect(lunarJavascriptPillars.year).toEqual(fixture.expectedYear);
      if (fixture.expectedMonth) {
        expect(calculatedPillars.month).toEqual(fixture.expectedMonth);
        expect(lunarJavascriptPillars.month).toEqual(fixture.expectedMonth);
      }
      expect(calculatedPillars.day).toBeDefined();
      expect(calculatedPillars.hour).toBeDefined();
      expect(lunarJavascriptPillars.day).toBeDefined();
      expect(lunarJavascriptPillars.hour).toBeDefined();
    });
  }

  it("keeps DAESEOL late-night parity scope at month level", () => {
    const input: SajuCalcInput = {
      birthDate: "2024-12-06",
      birthTime: "23:17",
      birthTimeUnknown: false,
      calendarType: "SOLAR",
      gender: "MALE",
      timezone: "Asia/Seoul",
    };
    const calculatedPillars = getCalculatedPillarSet(input);
    const lunarJavascriptPillars =
      getLunarJavascriptPillarsFromSolarDateTime(
        "2024-12-06T23:17:00+09:00",
      );

    // 23:17 is inside the 子 hour, so this boundary fixture checks the verified
    // solar-term table value and documents the external engine's boundary result
    // without forcing a day-boundary policy decision here.
    expect(calculatedPillars.month).toEqual({ stem: "丙", branch: "子" });
    expect(lunarJavascriptPillars.month).toEqual({
      stem: "乙",
      branch: "亥",
    });
  });

  it("throws honest unsupported-year error outside the engine range", () => {
    expect(() =>
      getLunarJavascriptPillarsFromSolarDateTime(
        "0000-12-06T14:15:00+09:00",
      ),
    ).toThrow(UnsupportedSolarTermYearError);
  });

  it("throws for invalid KST date-time format", () => {
    expect(() =>
      getLunarJavascriptPillarsFromSolarDateTime("1996-12-06T14:15:00Z"),
    ).toThrow("Invalid KST date-time format.");
  });
});
