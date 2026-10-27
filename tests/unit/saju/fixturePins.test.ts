import { describe, expect, it } from "vitest";
import { calculateSaju } from "@/lib/saju/calculateSaju";

// Lock fixtures were written against saju-calendar-kst-v2 charts. Their birth times are pinned so the
// v5-lmt chart is the same one: +30 min (solar time = the old KST clock), +60 min in 1987 summer time
// (same absolute instant), or a same-date 子 time when 23:30 now starts the next day.
// The charts below are the frozen kst-v2 outputs, not generated here.
const PINS = [
  // [date, original, pinned, kst-v2 chart]
  ["1979-11-08", "13:26", "13:56", "己未 乙亥 己卯 辛未"],
  ["1983-09-02", "05:10", "05:40", "癸亥 庚申 癸巳 乙卯"],
  ["1985-03-06", "23:30", "01:00", "乙丑 己卯 甲辰 甲子"],
  ["1986-05-12", "11:20", "11:50", "丙寅 癸巳 丙辰 甲午"],
  ["1987-05-18", "09:30", "10:30", "丁卯 乙巳 丁卯 乙巳"],
  ["1989-09-07", "07:24", "07:54", "己巳 壬申 庚午 庚辰"],
  ["1990-04-26", "11:10", "11:40", "庚午 庚辰 辛酉 甲午"],
  ["1992-03-17", "09:20", "09:50", "壬申 癸卯 壬辰 乙巳"],
  ["1993-10-17", "13:20", "13:50", "癸酉 壬戌 辛未 乙未"],
  ["1995-04-08", "09:15", "09:45", "乙亥 庚辰 己巳 己巳"],
] as const;

describe("lock fixture pins keep the frozen kst-v2 chart", () => {
  it.each(PINS)("%s %s -> %s", (birthDate, original, birthTime, chart) => {
    const pillars = (time: string) => {
      const r = calculateSaju({ birthDate, birthTime: time, birthTimeUnknown: false, calendarType: "SOLAR", gender: "MALE", timezone: "Asia/Seoul" });
      return (["year", "month", "day", "hour"] as const).map((k) => r.pillars[k]!.stem + r.pillars[k]!.branch).join(" ");
    };
    expect(pillars(birthTime)).toBe(chart);
    // The original time now gives another hour pillar; without the pin the lock would test a different chart.
    expect(pillars(original)).not.toBe(chart);
  });
});
