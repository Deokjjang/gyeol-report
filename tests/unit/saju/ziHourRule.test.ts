import { describe, expect, it } from "vitest";
import { resolveBirthTimeCalculation } from "@/lib/saju/birthTimePrecision";
import { DEFAULT_SAJU_TIME_POLICY, type ZiHourRule } from "@/lib/saju/calcPolicy";
import { createSajuCalendarContext } from "@/lib/saju/lunarJavascriptPillars";
import { getDayHourPillarsFromSolarTime } from "@/lib/saju/pillars";

const format = (p: { stem: string; branch: string }) => p.stem + p.branch;
const policy = (ziHourRule: ZiHourRule) => ({ ...DEFAULT_SAJU_TIME_POLICY, ziHourRule });
function chart(birthDate: string, birthTime: string, ziHourRule: ZiHourRule) {
  const c = resolveBirthTimeCalculation({ birthDate, birthTime }, policy(ziHourRule)).confirmed;
  return [c.year!, c.month!, c.day!, c.hour!].map(format).join(" ");
}

// 2000-05-11 is 己巳, 2000-05-12 is 庚午. Seoul solar time = KST - 32:05.
describe("23시 rule on solar time", () => {
  it.each([
    // civil, unified, split
    ["2000-05-11", "23:10", "庚辰 辛巳 己巳 乙亥", "庚辰 辛巳 己巳 乙亥"], // solar 22:38 亥: no 子 yet
    ["2000-05-11", "23:40", "庚辰 辛巳 庚午 丙子", "庚辰 辛巳 己巳 丙子"], // solar 23:08 子: unified next day, split 야자시
    ["2000-05-12", "00:20", "庚辰 辛巳 庚午 丙子", "庚辰 辛巳 己巳 丙子"], // solar 05-11 23:48: split keeps 05-11
    ["2000-05-12", "01:20", "庚辰 辛巳 庚午 丙子", "庚辰 辛巳 庚午 丙子"], // solar 00:48 조자시: both 庚午
  ] as const)("%s %s", (date, time, unified, split) => {
    expect(chart(date, time, "unified")).toBe(unified);
    expect(chart(date, time, "split")).toBe(split);
  });

  it("splits the 子 hour by stem only under split (야자시 uses the next day's 子 stem)", () => {
    const late = Date.parse("2000-05-11T23:30:00Z");
    const early = Date.parse("2000-05-12T00:30:00Z");
    expect(format(getDayHourPillarsFromSolarTime(late, "split").day)).toBe("己巳");
    expect(format(getDayHourPillarsFromSolarTime(late, "split").hour)).toBe("丙子");
    expect(format(getDayHourPillarsFromSolarTime(early, "split").hour)).toBe("丙子");
    expect(format(getDayHourPillarsFromSolarTime(late, "unified").day)).toBe("庚午");
  });
});

describe("solar-term boundaries use the absolute instant, not solar time", () => {
  // 2024 입춘 = 17:27:07 KST (lunar-javascript, UTC+8 16:27:07). The longitude correction never moves it.
  it.each(["unified", "split"] as const)("입춘 ±1 s under %s", (rule) => {
    expect(format(createSajuCalendarContext("2024-02-04T17:27:06+09:00", policy(rule)).pillars.year)).toBe("癸卯");
    expect(format(createSajuCalendarContext("2024-02-04T17:27:07+09:00", policy(rule)).pillars.year)).toBe("甲辰");
  });

  it("1960 입춘 in the UTC+8:30 era is compared at the real instant", () => {
    // Civil 03:53:09 (UTC+8:30) = 1960-02-04T19:23:09Z. The fixed-KST engine read 04:03 as before 입춘.
    expect(chart("1960-02-05", "03:43", "unified").split(" ").slice(0, 2).join(" ")).toBe("己亥 丁丑");
    expect(chart("1960-02-05", "04:03", "unified").split(" ").slice(0, 2).join(" ")).toBe("庚子 戊寅");
  });
});
