import { describe, expect, it } from "vitest";
import { resolveBirthTimeCalculation } from "@/lib/saju/birthTimePrecision";
import { SAJU_CALENDAR_VERSION } from "@/lib/saju/calendarVersion";
import { detectShinsal } from "@/lib/saju/shinsal";
import { shinsalRulesFor } from "@/lib/saju/shinsalConstants";
import type { ShinsalCode } from "@/lib/saju/shinsalTypes";
import { buildCanonicalNatalTable, validateNatalTableEvidence } from "@/lib/report-knowledge/natalTableEvidence";

// Hand-written from the classical tables, not generated:
// 亡神 三命通會 卷三 論劫煞亡神 — 申子辰以亥, 寅午戌以巳, 巳酉丑以申, 亥卯未以寅.
// 孤辰寡宿 三命通會 卷三 論孤辰寡宿 — 方(亥子丑·寅卯辰·巳午未·申酉戌), 進前一辰為孤, 退後一辰為寡.
const MANGSIN = { 申: "亥", 子: "亥", 辰: "亥", 寅: "巳", 午: "巳", 戌: "巳", 巳: "申", 酉: "申", 丑: "申", 亥: "寅", 卯: "寅", 未: "寅" };
const GOSIN = { 亥: "寅", 子: "寅", 丑: "寅", 寅: "巳", 卯: "巳", 辰: "巳", 巳: "申", 午: "申", 未: "申", 申: "亥", 酉: "亥", 戌: "亥" };
const GWASUK = { 亥: "戌", 子: "戌", 丑: "戌", 寅: "丑", 卯: "丑", 辰: "丑", 巳: "辰", 午: "辰", 未: "辰", 申: "未", 酉: "未", 戌: "未" };
// The saju-calendar-kst-v2 tables stored reports were computed with (亡神 = 劫煞 table, 孤寡 by 三合).
const LEGACY_MANGSIN = { 亥: "申", 卯: "申", 未: "申", 寅: "亥", 午: "亥", 戌: "亥", 巳: "寅", 酉: "寅", 丑: "寅", 申: "巳", 子: "巳", 辰: "巳" };
const LEGACY_GOSIN = { 亥: "寅", 卯: "寅", 未: "寅", 寅: "巳", 午: "巳", 戌: "巳", 巳: "申", 酉: "申", 丑: "申", 申: "亥", 子: "亥", 辰: "亥" };
const LEGACY_GWASUK = { 亥: "戌", 卯: "戌", 未: "戌", 寅: "丑", 午: "丑", 戌: "丑", 巳: "辰", 酉: "辰", 丑: "辰", 申: "未", 子: "未", 辰: "未" };

function table(calendarVersion: unknown, code: ShinsalCode) {
  const rule = shinsalRulesFor(calendarVersion).find((r) => r.code === code)!;
  if (rule.source.kind !== "YEAR_BRANCH_TO_BRANCH") throw new Error(code);
  return Object.fromEntries(Object.entries(rule.source.table).map(([key, value]) => [key, value.join("")]));
}

describe("shinsal tables follow the calendar version that computed the report", () => {
  it("v5-lmt uses the classical 亡神 and 孤辰·寡宿 tables", () => {
    expect(table(SAJU_CALENDAR_VERSION, "MANGSINSAL")).toEqual(MANGSIN);
    expect(table(SAJU_CALENDAR_VERSION, "GOSINSAL")).toEqual(GOSIN);
    expect(table(SAJU_CALENDAR_VERSION, "GWASUKSAL")).toEqual(GWASUK);
  });
  it("stored kst-v2 reports keep the tables they were computed with", () => {
    expect(table("saju-calendar-kst-v2", "MANGSINSAL")).toEqual(LEGACY_MANGSIN);
    expect(table("saju-calendar-kst-v2", "GOSINSAL")).toEqual(LEGACY_GOSIN);
    expect(table("saju-calendar-kst-v2", "GWASUKSAL")).toEqual(LEGACY_GWASUK);
    // Every other rule is shared.
    const others = (version: string) => shinsalRulesFor(version).filter((r) => !["MANGSINSAL", "GOSINSAL", "GWASUKSAL"].includes(r.code));
    expect(others("saju-calendar-kst-v2")).toEqual(others(SAJU_CALENDAR_VERSION));
  });
  it("庚辰 辛巳 己巳 壬申: 亡神 is no longer the 劫煞 position", () => {
    const pillars = { year: { stem: "庚", branch: "辰" }, month: { stem: "辛", branch: "巳" }, day: { stem: "己", branch: "巳" }, hour: { stem: "壬", branch: "申" } } as const;
    const positions = (version: string, code: ShinsalCode) => detectShinsal(pillars, version).filter((d) => d.code === code).flatMap((d) => d.positions);
    expect(positions("saju-calendar-kst-v2", "MANGSINSAL")).toEqual(["month", "day"]);
    expect(positions(SAJU_CALENDAR_VERSION, "MANGSINSAL")).toEqual([]);
    expect(positions(SAJU_CALENDAR_VERSION, "TWELVE_GEOPSAL")).toEqual(["month", "day"]);
    // 辰 year is 寅卯辰: 孤辰 巳, 寡宿 丑 (三合 grouping gave 亥 / 未).
    expect(positions(SAJU_CALENDAR_VERSION, "GOSINSAL")).toEqual(["month", "day"]);
    expect(positions(SAJU_CALENDAR_VERSION, "GWASUKSAL")).toEqual([]);
  });
  it("a stored kst-v2 natal table still validates on read; a v5-lmt one is corrected", () => {
    const p = (stem: string, branch: string) => ({ stem, branch });
    const confirmed = { year: p("庚", "辰"), month: p("辛", "巳"), day: p("己", "巳"), hour: p("癸", "酉") };
    const legacy = {
      calendarVersion: "saju-calendar-kst-v2", birthTimePrecision: "exact", birthDate: "2000-05-11",
      range: { startKst: "2000-05-11T17:05:00+09:00", endKstExclusive: "2000-05-11T17:06:00+09:00" },
      stable: { year: true, month: true, day: true, hour: true },
      candidates: { year: [confirmed.year], month: [confirmed.month], day: [confirmed.day], hour: [confirmed.hour] }, confirmed,
    } as unknown as Parameters<typeof buildCanonicalNatalTable>[0];
    const stored = buildCanonicalNatalTable(legacy)!;
    expect(stored.features.some((f) => f.label === "망신살" && f.positions.includes("day"))).toBe(true);
    const evidence = { productType: "career_money_study", calendarVersion: "saju-calendar-kst-v2", birthTimePrecision: "exact",
      birthTimeContexts: { person: legacy }, natalTableEvidence: { person: stored } };
    expect(validateNatalTableEvidence(evidence)).toEqual([]);
    const current = buildCanonicalNatalTable({ ...legacy, calendarVersion: SAJU_CALENDAR_VERSION })!;
    expect(current.features.some((f) => f.label === "망신살")).toBe(false);
    // The current engine itself gives this input a 壬申 hour; the table above only isolates the shinsal rules.
    expect(resolveBirthTimeCalculation({ birthDate: "2000-05-11", birthTime: "17:05" }).confirmed.hour).toEqual(p("壬", "申"));
  });
});
