import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { storedBook } from "@/lib/book/storedReport";
import { projectV4Tables, type V4RuntimeEvidence } from "@/lib/interpretation-v4/runtimeProjection";
import { publicationBirthTimeContexts } from "@/lib/report-generation/birthTimePublication";
import { validateNewProductPublication } from "@/lib/report-generation/productPublishGate";
import { buildAnnualMonthCalendar } from "@/lib/report-knowledge/annualMonthJie";
import { resolveBirthTimeCalculation } from "@/lib/saju/birthTimePrecision";
import { birthTimeSlotLabel, solarTimeCorrectionNote } from "@/lib/saju/birthTimePrecisionTypes";
import {
  LEGACY_SAJU_CALENDAR_VERSIONS, SAJU_CALENDAR_VERSION, isReadableDayunCalculationVersion, isReadableSajuCalendarVersion,
} from "@/lib/saju/calendarVersion";
import { calculateCustomerDayun } from "@/lib/saju/customerDayun";
import { buildCanonicalNatalTable } from "@/lib/report-knowledge/natalTableEvidence";
import { buildCanonicalManseRyeokTableData } from "@/lib/report-tables/manseRyeokTableData";

// Stored customer Books are snapshots computed by saju-calendar-kst-v2. The v5-lmt engine must never
// change how they render or let a read gate quarantine them (quarantine nulls snapshot_json).
const LEGACY_BOOKS = [
  "tests/fixtures/completed-report/career-editorial-base.json",
  "tests/fixtures/completed-report/love-editorial-base.json",
  "tests/fixtures/completed-report/compatibility-editorial-base.json",
  "tests/fixtures/comprehensive-quality-01/previous-book.json",
  "tests/fixtures/career-quality-01/previous-book.json",
];

describe("legacy (saju-calendar-kst-v2) Books stay readable and unchanged", () => {
  it.each(LEGACY_BOOKS)("%s renders exactly the saved Book", (file) => {
    const saved = JSON.parse(readFileSync(file, "utf8"));
    const calculations = Object.values(saved.snapshot.evidencePacket.calculations) as { calculationVersion: string }[];
    expect(calculations.every((c) => c.calculationVersion === "saju-calendar-kst-v2")).toBe(true);
    expect(storedBook(saved.snapshot)?.data).toEqual(saved.book);
    const tables = projectV4Tables(saved.snapshot.evidencePacket as V4RuntimeEvidence);
    expect(tables.every((t) => t.manse.timeCorrectionNote === undefined)).toBe(true);
  });

  it("accepts legacy versions on read only", () => {
    expect(LEGACY_SAJU_CALENDAR_VERSIONS).toContain("saju-calendar-kst-v2");
    expect(isReadableSajuCalendarVersion("saju-calendar-kst-v2")).toBe(true);
    expect(isReadableSajuCalendarVersion(SAJU_CALENDAR_VERSION)).toBe(true);
    expect(isReadableSajuCalendarVersion("saju-calendar-kst-v9")).toBe(false);
    expect(isReadableDayunCalculationVersion("dayun-kst-sect2-v1")).toBe(true);
  });
});

const legacyContext = {
  calendarVersion: "saju-calendar-kst-v2", birthTimePrecision: "exact", birthDate: "1996-12-06",
  range: { startKst: "1996-12-06T14:15:00+09:00", endKstExclusive: "1996-12-06T14:16:00+09:00" },
  stable: { year: true, month: true, day: true, hour: true },
  candidates: { year: [{ stem: "丙", branch: "子" }], month: [{ stem: "己", branch: "亥" }], day: [{ stem: "丁", branch: "丑" }], hour: [{ stem: "丁", branch: "未" }] },
  confirmed: { year: { stem: "丙", branch: "子" }, month: { stem: "己", branch: "亥" }, day: { stem: "丁", branch: "丑" }, hour: { stem: "丁", branch: "未" } },
};
const evidenceFor = (context: unknown, calendarVersion: string) =>
  ({ productType: "career_money_study", calendarVersion, birthTimePrecision: "exact", birthTimeContexts: { person: context } });

describe("V3 read gate is version-dispatched", () => {
  it("keeps accepting a stored kst-v2 context", () => {
    expect(publicationBirthTimeContexts(evidenceFor(legacyContext, "saju-calendar-kst-v2"))).not.toBeNull();
    expect(solarTimeCorrectionNote(legacyContext)).toBeUndefined();
  });

  it("rejects an unknown version and a version mixed across packet and context", () => {
    expect(publicationBirthTimeContexts(evidenceFor({ ...legacyContext, calendarVersion: "saju-calendar-kst-v9" }, "saju-calendar-kst-v9"))).toBeNull();
    expect(publicationBirthTimeContexts(evidenceFor(legacyContext, SAJU_CALENDAR_VERSION))).toBeNull();
  });

  it.each([
    ["2000-05-11", "17:05", undefined],
    ["1987-07-15", "00:20", undefined], // summer time: the instant is the previous KST day
    ["2000-05-11", "", "YUSI"],
  ] as const)("accepts a v5-lmt context %s %s %s and rejects a tampered civil time", (birthDate, birthTime, slot) => {
    const context = resolveBirthTimeCalculation({ birthDate, birthTime, approximateBirthTimeSlot: slot ?? "" });
    const evidence = { ...evidenceFor(context, SAJU_CALENDAR_VERSION), birthTimePrecision: context.birthTimePrecision };
    expect(publicationBirthTimeContexts(evidence)).not.toBeNull();
    const tampered = { ...context, timeBasis: { ...context.timeBasis!, civilDateTime: "1999-01-01T00:00" } };
    expect(publicationBirthTimeContexts({ ...evidence, birthTimeContexts: { person: tampered } })).toBeNull();
  });

  it("refuses to publish NEW reports with a legacy calendar version", () => {
    const result = validateNewProductPublication("career_money_study", {}, evidenceFor(legacyContext, "saju-calendar-kst-v2"));
    expect(result.errors).toContain("SAJU_CALENDAR_CURRENT_REQUIRED");
  });
});

describe("stored annual month calendars re-validate under the new engine", () => {
  it("builds the same 12 months for a legacy-versioned Dayun (year/month pillars are instant-based)", () => {
    const r = calculateCustomerDayun({ name: "고객", birthDate: "1996-12-06", birthTime: "14:15", gender: "FEMALE" });
    expect(r.ok).toBe(true); if (!r.ok) return;
    const input = { selectedYear: 2026, dayMaster: "丁", natalBranches: ["子", "亥", "丑", "未"], missingElements: [], heavyElements: [] } as const;
    const current = buildAnnualMonthCalendar({ ...input, customerDayun: r.value });
    const legacy = buildAnnualMonthCalendar({ ...input, customerDayun: { ...r.value, calendarVersion: "saju-calendar-kst-v2" as never } });
    expect(current).toHaveLength(12);
    expect(legacy).toEqual(current);
  });
});

describe("customer note", () => {
  it.each([
    ["2000-05-11", "17:05", "기준 경도 동경 127.5°로 시간 보정 -30분 적용"],
    ["1987-07-15", "12:00", "기준 경도 동경 127.5°로 시간 보정 -90분 적용 (당시 서머타임 반영)"],
    ["1955-01-15", "12:00", "기준 경도 동경 127.5°로 시간 보정 없음 (당시 표준시 UTC+8:30 반영)"],
  ])("%s %s", (birthDate, birthTime, note) => {
    expect(solarTimeCorrectionNote(resolveBirthTimeCalculation({ birthDate, birthTime }))).toBe(note);
  });
  it("names the birthplace longitude when one is supplied", () => {
    const context = resolveBirthTimeCalculation({ birthDate: "2000-05-11", birthTime: "17:05", birthLongitude: 126.98 });
    expect(context.timeBasis).toMatchObject({ longitude: 126.98, longitudeSource: "birthplace" });
    expect(solarTimeCorrectionNote(context)).toBe("출생지 경도 동경 126.98°로 시간 보정 -32분 적용");
  });
  it("is omitted when the birth time is unknown", () => {
    expect(solarTimeCorrectionNote(resolveBirthTimeCalculation({ birthDate: "2000-05-11", birthTimeUnknown: true }))).toBeUndefined();
  });
});

describe("manse table data carries the note for new reports only", () => {
  it("reads it from V3 (birthTimeContexts) and V4 (calculations) evidence", () => {
    const context = resolveBirthTimeCalculation({ birthDate: "2000-05-11", birthTime: "17:05" });
    const natalTableEvidence = { person: buildCanonicalNatalTable(context) };
    const v3 = buildCanonicalManseRyeokTableData({ natalTableEvidence, birthTimeContexts: { person: context } }, "고객");
    const v4 = buildCanonicalManseRyeokTableData({ natalTableEvidence, calculations: { person: { birthTimeContext: context } } }, "고객");
    expect(v3?.timeCorrectionNote).toBe("기준 경도 동경 127.5°로 시간 보정 -30분 적용");
    expect(v4?.timeCorrectionNote).toBe("기준 경도 동경 127.5°로 시간 보정 -30분 적용");
    expect(v3?.stemRow.hour?.hanja).toBe("壬");
    expect(v3?.branchRow.hour?.hanja).toBe("申");
  });
});

describe("approximate slot labels follow the engine that computed the report", () => {
  it("keeps civil KST labels for stored kst-v2 Books and solar 시진 labels for v5-lmt", () => {
    expect(birthTimeSlotLabel("MYOSI", "saju-calendar-kst-v2")).toBe("묘시 05:00~06:59");
    expect(birthTimeSlotLabel("JASI", "saju-calendar-kst-v2")).toBe("자시 전날 23:00~당일 00:59");
    expect(birthTimeSlotLabel("MYOSI", SAJU_CALENDAR_VERSION)).toBe("묘시 05:30~07:29");
    expect(birthTimeSlotLabel("JASI", SAJU_CALENDAR_VERSION)).toBe("자시 전날 23:30~당일 01:29");
    expect(birthTimeSlotLabel("NOT_A_SLOT", SAJU_CALENDAR_VERSION)).toBeUndefined();
  });
});
