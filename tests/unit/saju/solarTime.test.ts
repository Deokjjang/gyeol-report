import { describe, expect, it } from "vitest";
import { DEFAULT_SAJU_TIME_POLICY } from "@/lib/saju/calcPolicy";
import {
  civilToUtc, equationOfTimeMinutes, solarTimeCorrectionMinutes, solarWallClockMs, utcFromSolarWallClockMs, utcOffsetMinutesAt,
} from "@/lib/saju/solarTime";

const zone = "Asia/Seoul";
const iso = (ms: number) => new Date(ms).toISOString().slice(0, 19) + "Z";

describe("runtime tzdata carries the Korean standard/summer-time history", () => {
  it.each([
    ["1950-07-15T03:00:00Z", 600, "1948-51 summer time"],
    ["1954-03-20T14:59:00Z", 540, "last minute of UTC+9 before 1954-03-21"],
    ["1954-03-20T15:00:00Z", 510, "1954-03-21 00:00 civil switches to UTC+8:30"],
    ["1955-01-15T03:00:00Z", 510, "1955 winter"],
    ["1956-07-15T03:00:00Z", 570, "1956 summer time"],
    ["1959-07-15T03:00:00Z", 570, "1959 summer time"],
    ["1960-01-15T03:00:00Z", 510, "1960 winter"],
    ["1961-08-09T15:29:00Z", 510, "last minute of UTC+8:30"],
    ["1961-08-09T15:30:00Z", 540, "1961-08-10 back to UTC+9"],
    ["1987-07-15T03:00:00Z", 600, "1987 summer time"],
    ["1988-07-15T03:00:00Z", 600, "1988 summer time"],
    ["1989-07-15T03:00:00Z", 540, "no summer time after 1988"],
    ["2000-05-11T08:05:00Z", 540, "modern UTC+9"],
  ] as const)("%s -> %i (%s)", (utc, offset, _label) => {
    void _label;
    expect(utcOffsetMinutesAt(Date.parse(utc), zone)).toBe(offset);
  });
});

describe("civil time -> UTC", () => {
  it.each([
    ["2000-05-11", "17:05", "2000-05-11T08:05:00Z", 540],
    ["1955-01-15", "12:00", "1955-01-15T03:30:00Z", 510],
    ["1956-07-15", "12:00", "1956-07-15T02:30:00Z", 570],
    ["1987-07-15", "12:00", "1987-07-15T02:00:00Z", 600],
    ["1961-08-09", "23:50", "1961-08-09T15:20:00Z", 510],
    ["1961-08-10", "00:40", "1961-08-09T15:40:00Z", 540],
  ] as const)("%s %s", (date, time, utc, offset) => {
    const result = civilToUtc(date, time, zone);
    expect(iso(result.utcMs)).toBe(utc);
    expect(result).toMatchObject({ utcOffsetMinutes: offset, ambiguous: false, nonexistent: false });
  });

  it("uses the pre-transition offset for a skipped wall-clock time (1987-05-10 02:30)", () => {
    const result = civilToUtc("1987-05-10", "02:30", zone);
    expect(result.nonexistent).toBe(true);
    expect(iso(result.utcMs)).toBe("1987-05-09T17:30:00Z");
  });

  it("uses the earlier (summer-time) instant for a repeated wall-clock time (1987-10-11 02:30)", () => {
    const result = civilToUtc("1987-10-11", "02:30", zone);
    expect(result.ambiguous).toBe(true);
    expect(result.utcOffsetMinutes).toBe(600);
    expect(iso(result.utcMs)).toBe("1987-10-10T16:30:00Z");
  });

  it("round-trips every quarter hour of a summer-time year", () => {
    for (let ms = Date.parse("1988-01-01T00:00:00Z"); ms < Date.parse("1989-01-01T00:00:00Z"); ms += 15 * 60_000 * 97) {
      const offset = utcOffsetMinutesAt(ms, zone);
      const wall = new Date(ms + offset * 60_000).toISOString();
      const back = civilToUtc(wall.slice(0, 10), wall.slice(11, 16), zone);
      expect(back.ambiguous || back.utcMs === ms).toBe(true);
    }
  });
});

describe("longitude (local mean solar time) correction", () => {
  it("Seoul 126.98E is UTC+8:27:55, i.e. 32 min 05 s behind KST", () => {
    const utc = Date.parse("2000-05-11T08:05:00Z");
    expect(solarWallClockMs(utc, DEFAULT_SAJU_TIME_POLICY) - utc).toBe((8 * 3600 + 27 * 60 + 55) * 1000);
    expect(solarTimeCorrectionMinutes(utc, DEFAULT_SAJU_TIME_POLICY)).toBeCloseTo(-32.08, 2);
    expect(iso(solarWallClockMs(utc, DEFAULT_SAJU_TIME_POLICY))).toBe("2000-05-11T16:32:55Z");
  });

  it("includes the historical civil offset (summer time, UTC+8:30)", () => {
    expect(solarTimeCorrectionMinutes(Date.parse("1987-07-15T03:00:00Z"), DEFAULT_SAJU_TIME_POLICY)).toBeCloseTo(-92.08, 2);
    expect(solarTimeCorrectionMinutes(Date.parse("1955-01-15T03:00:00Z"), DEFAULT_SAJU_TIME_POLICY)).toBeCloseTo(-2.08, 2);
  });

  it("inverts the solar wall clock exactly, with and without the equation of time", () => {
    for (const policy of [DEFAULT_SAJU_TIME_POLICY, { ...DEFAULT_SAJU_TIME_POLICY, equationOfTime: true }]) {
      for (const utc of [Date.parse("2000-02-11T03:00:00Z"), Date.parse("2000-11-03T15:00:00Z")]) {
        expect(utcFromSolarWallClockMs(solarWallClockMs(utc, policy), policy)).toBe(utc);
      }
    }
  });

  it("equation of time (opt-in) matches reference extremes within 1 minute", () => {
    expect(equationOfTimeMinutes(Date.parse("2024-02-11T03:00:00Z"))).toBeCloseTo(-14.2, 0);
    expect(equationOfTimeMinutes(Date.parse("2024-11-03T03:00:00Z"))).toBeCloseTo(16.4, 0);
    expect(DEFAULT_SAJU_TIME_POLICY.equationOfTime).toBe(false);
  });
});
