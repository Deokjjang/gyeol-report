import { describe, expect, it } from "vitest";
import {
  civilToUtc, dayCycleIndex, exactPillars, ganji, julianDayNumber, lunarToSolar, OracleLunarDateError,
  seoulOffsetMinutes, solarTermsOfYear,
} from "./oracle";

// The oracle is checked against published facts before it is used to judge the engine.
const at = (iso: string) => seoulOffsetMinutes(Date.parse(iso));
const kst = (utcMs: number) => new Date(utcMs + 9 * 3_600_000).toISOString().slice(0, 16).replace("T", " ");

describe("oracle a) Asia/Seoul civil time (Node ICU tzdata)", () => {
  it("1954-03-21 standard time moved to UTC+8:30 and 1961-08-10 back to UTC+9", () => {
    expect(at("1954-03-15T03:00:00Z")).toBe(540);
    expect(at("1954-03-25T03:00:00Z")).toBe(510);
    expect(at("1955-01-15T03:00:00Z")).toBe(510);
    expect(at("1960-01-15T03:00:00Z")).toBe(510);
    expect(at("1961-08-15T03:00:00Z")).toBe(540);
    // 1961-08-10 00:00 (UTC+8:30) became 00:30: 00:00-00:29 never existed.
    expect(civilToUtc("1961-08-10", "00:10").kind).toBe("nonexistent");
    expect(civilToUtc("1961-08-09", "23:50")).toMatchObject({ kind: "normal", offsetMinutes: 510 });
  });

  it("summer time: 1948-51 UTC+10, 1955-60 UTC+9:30, 1987-88 UTC+10 (Seoul Olympics)", () => {
    for (const year of [1948, 1949, 1950, 1951]) expect(at(`${year}-07-15T03:00:00Z`)).toBe(600);
    for (const year of [1955, 1956, 1957, 1958, 1959, 1960]) expect(at(`${year}-07-15T03:00:00Z`)).toBe(570);
    expect(at("1987-07-15T03:00:00Z")).toBe(600);
    expect(at("1988-07-15T03:00:00Z")).toBe(600);
    expect(at("1989-07-15T03:00:00Z")).toBe(540);
    expect(at("1930-07-15T03:00:00Z")).toBe(540);
    // 1987: 2nd Sunday of May 02:00 -> 03:00, 2nd Sunday of October 03:00 -> 02:00.
    expect(civilToUtc("1987-05-10", "02:30").kind).toBe("nonexistent");
    expect(civilToUtc("1987-10-11", "02:30")).toMatchObject({ kind: "ambiguous", offsetMinutes: 600 });
    expect(civilToUtc("1988-05-08", "02:30").kind).toBe("nonexistent");
    expect(civilToUtc("1988-10-09", "02:30").kind).toBe("ambiguous");
  });
});

describe("oracle b) day pillar anchors (independent facts)", () => {
  it("JDN of 2000-01-01 is 2451545 (J2000.0)", () => {
    expect(julianDayNumber(2000, 1, 1)).toBe(2451545);
  });

  it("2000-01-01 戊午, 1949-10-01 甲子, 2024-02-04 戊戌 (HKO calendar) agree", () => {
    expect(ganji(dayCycleIndex("2000-01-01"))).toBe("戊午");
    expect(ganji(dayCycleIndex("1949-10-01"))).toBe("甲子");
    expect(ganji(dayCycleIndex("2024-02-04"))).toBe("戊戌");
  });
});

describe("oracle c+d) hour, year and month pillars", () => {
  it("required case: 2000-05-11 17:05 -> 庚辰 辛巳 己巳 壬申 (127.5°E)", () => {
    expect(exactPillars("2000-05-11", "17:05", { longitude: 127.5, rule: "unified" })).toBe("庚辰 辛巳 己巳 壬申");
  });

  it("23시대: unified changes the day, split keeps it with the next 子 stem", () => {
    expect(exactPillars("2000-05-11", "23:40", { longitude: 127.5, rule: "unified" })).toBe("庚辰 辛巳 庚午 丙子");
    expect(exactPillars("2000-05-11", "23:40", { longitude: 127.5, rule: "split" })).toBe("庚辰 辛巳 己巳 丙子");
  });

  it("KASI terms: 2024 立春 17:27, 立夏 09:10 KST; 1984 is 甲子 year", () => {
    const terms = solarTermsOfYear(2024);
    expect(terms).toHaveLength(24);
    expect(kst(terms.find((term) => term.longitude === 315)!.utcMs)).toMatch(/^2024-02-04 17:2[67]$/);
    expect(kst(terms.find((term) => term.longitude === 45)!.utcMs)).toMatch(/^2024-05-05 09:(09|10)$/);
    expect(exactPillars("1984-06-01", "12:00", { longitude: 127.5, rule: "unified" }).slice(0, 2)).toBe("甲子");
  });
});

describe("oracle e) Korean lunar dates", () => {
  it("known 설날·윤달 dates", () => {
    expect(lunarToSolar("1990-01-01", false)).toBe("1990-01-27");
    expect(lunarToSolar("2025-01-01", false)).toBe("2025-01-29");
    expect(lunarToSolar("2024-08-15", false)).toBe("2024-09-17");
    expect(lunarToSolar("2023-02-15", true)).toBe("2023-04-05");
    expect(lunarToSolar("2020-04-01", true)).toBe("2020-05-23");
    expect(() => lunarToSolar("2024-03-01", true)).toThrow(OracleLunarDateError);
  });
});
