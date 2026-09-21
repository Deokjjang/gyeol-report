import { describe, it, expect, vi, afterEach } from "vitest";
import { calculateCustomerDayun, selectCustomerDayun, DAYUN_ACTUAL_CYCLE_COUNT } from "../../../src/lib/saju/customerDayun";
import { CUSTOMER_DAYUN_GOLDENS } from "../../fixtures/saju/customerDayunGoldens";
import { createSajuCalendarContext } from "../../../src/lib/saju/lunarJavascriptPillars";

const base = { name: "고객", birthDate: "1999-07-31", birthTime: "07:30", gender: "MALE" };
afterEach(() => vi.unstubAllGlobals());
describe("customer Dayun product contract (not a universal school golden)", () => {
  it.each(CUSTOMER_DAYUN_GOLDENS)("sect2 benchmark $birthDate $gender", (g) => {
    const r = calculateCustomerDayun(g);
    expect(r.ok).toBe(true); if (!r.ok) return;
    expect(r.value.startSolarKst).toBe(g.startSolarKst);
    expect(r.value.direction).toBe(g.direction);
    expect(r.value.startOffset).toEqual({ years: g.offset[0], months: g.offset[1], days: g.offset[2], hours: g.offset[3] });
    expect(r.value.cycles[0]).toMatchObject({ index: 1, ganji: g.firstGanji, startYear: g.startYear, endYear: g.startYear + 9, startAge: g.startAge, endAge: g.startAge + 9 });
    expect(r.value.cycles).toHaveLength(DAYUN_ACTUAL_CYCLE_COUNT);
    expect(r.value.cycles.map(c => c.index)).toEqual([1,2,3,4,5,6,7,8,9,10,11,12]);
    expect(Object.values(createSajuCalendarContext(`${g.birthDate}T13:30:00+09:00`).pillars).map(p => p.stem+p.branch).join(" ")).toBe(g.pillars);
  });
  it("normalizes a UTC8 Dec31 start and library age to KST Jan1", () => {
    // Independently read from raw getYun(1,2): 1985-12-31 23:30 UTC8, raw age4.
    const r = calculateCustomerDayun({ ...base, birthDate: "1982-05-26", birthTime: "14:30" });
    expect(r.ok).toBe(true); if (!r.ok) return;
    expect(r.value.startSolarKst).toBe("1986-01-01T00:30:00+09:00");
    expect(r.value.cycles[0]).toMatchObject({ ganji: "丙午", startYear: 1986, endYear: 1995, startAge: 5, endAge: 14 });
    expect(r.value.cycles[1]).toMatchObject({ startYear: 1996, startAge: 15, startSolarKst: "1996-01-01T00:30:00+09:00" });
  });
  it("preserves KST birth year when the library birth is in the previous year", () => {
    const r = calculateCustomerDayun({ ...base, birthDate: "2000-01-01", birthTime: "00:30" });
    expect(r.ok).toBe(true); if (!r.ok) return;
    expect(r.value.customerInput.birthDate).toBe("2000-01-01");
    expect(r.value.cycles[0].startAge).toBe(r.value.cycles[0].startYear - 2000 + 1);
  });
  it("normalizes Ipchun instants and year/month on both sides", () => {
    for (const [birthTime, year, month, direction] of [["17:26", "癸卯", "乙丑", "reverse"], ["17:28", "甲辰", "丙寅", "forward"]]) {
      const r = calculateCustomerDayun({ ...base, birthDate: "2024-02-04", birthTime });
      expect(r.ok).toBe(true); if (!r.ok) continue;
      const c = r.value.calendarContext.confirmed;
      expect(c.year!.stem+c.year!.branch).toBe(year); expect(c.month!.stem+c.month!.branch).toBe(month);
      expect(r.value.direction).toBe(direction);
    }
  });
  it.each(["approximate", "unknown"] as const)("preserves stable %s range without a representative timestamp", (precision) => {
    const r = calculateCustomerDayun({ ...base, birthTime: "", birthTimeUnknown: precision === "unknown", approximateBirthTimeSlot: precision === "approximate" ? "JINSI" : "" });
    expect(r.ok).toBe(true); if (!r.ok) return;
    expect(r.value.startSolarKst).toBeNull(); expect(r.value.startOffset).toBeNull();
    expect(r.value.cycles[0]).toMatchObject({ ganji: "庚午", startYear: 2007, endYear: 2016, startAge: 9 });
    expect(r.value.startSolarRange).toEqual(precision === "approximate"
      ? { earliestKst: "2007-05-13T07:00:00+09:00", latestKst: "2007-05-23T06:59:59+09:00" }
      : { earliestKst: "2007-04-08T00:00:00+09:00", latestKst: "2007-08-08T21:59:59+09:00" });
    expect(selectCustomerDayun(r.value, 2026)).toMatchObject({ ok: true, value: { selectedCycle: { ganji: "己巳", startYear: 2017 } } });
  });
  it.each([
    { birthDate: "1981-03-03", gender: "FEMALE", approximateBirthTimeSlot: "MISI" },
    { birthDate: "2001-06-22", gender: "MALE", birthTimeUnknown: true },
    { birthDate: "2024-02-04", gender: "MALE", birthTimeUnknown: true },
    { birthDate: "1999-07-31", gender: "MALE", approximateBirthTimeSlot: "JASI" },
  ])("rejects unstable interval %j", input => expect(calculateCustomerDayun(input)).toEqual({ ok: false, error: "DAYUN_UNCERTAIN" }));
  it.each([undefined, "", "male", "OTHER_OR_UNSPECIFIED", 0, 1])("never guesses gender %s", gender => {
    expect(calculateCustomerDayun({ ...base, gender })).toEqual({ ok: false, error: "DAYUN_GENDER_REQUIRED" });
  });
  it("selects historical/current cycles and preserves exact transition rather than claiming all year", () => {
    const r = calculateCustomerDayun({ ...base, birthDate: "2001-06-22", birthTime: "13:30" });
    expect(r.ok).toBe(true); if (!r.ok) return;
    expect(selectCustomerDayun(r.value, 2021)).toMatchObject({ ok: true, value: { selectedCycle: { ganji: "壬辰", startYear: 2016 }, transition: null } });
    const before = selectCustomerDayun(r.value, 2026, new Date("2026-12-30T15:29:59+09:00"));
    const after = selectCustomerDayun(r.value, 2026, new Date("2026-12-30T15:30:00+09:00"));
    expect(before).toMatchObject({ ok: true, value: { selectedCycle: { ganji: "辛卯" }, activeCycleAtEvaluation: 2, transition: { beforeCycle: { ganji: "壬辰" }, afterCycle: { ganji: "辛卯" }, startSolarKst: "2026-12-30T15:30:00+09:00" } } });
    expect(after).toMatchObject({ ok: true, value: { activeCycleAtEvaluation: 3 } });
    expect(selectCustomerDayun(r.value, 2005)).toEqual({ ok: false, error: "DAYUN_CYCLE_UNAVAILABLE" });
    expect(selectCustomerDayun(r.value, 2200).ok).toBe(false);
  });
  it("keeps the active cycle uncertain inside an unknown-time transition window", () => {
    const r = calculateCustomerDayun({ ...base, birthTime: "", birthTimeUnknown: true });
    expect(r.ok).toBe(true); if (!r.ok) return;
    expect(selectCustomerDayun(r.value, 2027, new Date("2027-06-01T12:00:00+09:00"))).toMatchObject({ ok: true, value: {
      activeCycleAtEvaluation: null, transition: { startSolarKst: null, beforeCycle: { ganji: "己巳" }, afterCycle: { ganji: "戊辰" } },
    } });
    expect(selectCustomerDayun(r.value, 2027, new Date("2027-09-01T12:00:00+09:00"))).toMatchObject({ ok: true, value: { activeCycleAtEvaluation: 3 } });
  });
  it("makes no external calls", () => {
    const fetch = vi.fn(() => { throw new Error("external calls forbidden"); }); vi.stubGlobal("fetch", fetch);
    expect(calculateCustomerDayun(base).ok).toBe(true); expect(fetch).not.toHaveBeenCalled();
  });
});
