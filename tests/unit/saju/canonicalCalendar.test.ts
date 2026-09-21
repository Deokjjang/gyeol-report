import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { calculateSaju } from "../../../src/lib/saju/calculateSaju";
import { createSajuCalendarContext } from "../../../src/lib/saju/lunarJavascriptPillars";
import { SAJU_CALENDAR_VERSION } from "../../../src/lib/saju/calendarVersion";
import { analyzeFullElements, analyzeFullTenGods, analyzeVisibleYinYang } from "../../../src/lib/saju/analyze";
import { CANONICAL_CALENDAR_GOLDENS } from "../../fixtures/saju/canonicalCalendarGoldens";
import type { Pillar, SajuCalcInput } from "../../../src/lib/saju/types";

const format = (p: Pillar) => p.stem + p.branch;
function inputFor(civil: string): SajuCalcInput {
  return { birthDate: civil.slice(0, 10), birthTime: civil.slice(11, 16),
    birthTimeUnknown: false, calendarType: "SOLAR", timezone: "Asia/Seoul", gender: "MALE" };
}
function parts(iso: string) {
  const { year, month, day, hour } = createSajuCalendarContext(iso).pillars;
  return [year, month, day, hour].map(format);
}
function addSeconds(iso: string, seconds: number) {
  return new Date(Date.parse(iso) + 9 * 3600000 + seconds * 1000).toISOString().slice(0, 19) + "+09:00";
}

describe("canonical fixed-KST calendar", () => {
  it.each(CANONICAL_CALENDAR_GOLDENS)("matches independent golden %s (%s, %s)", (civil, expected) => {
    const result = calculateSaju(inputFor(civil));
    expect([result.pillars.year, result.pillars.month, result.pillars.day, result.pillars.hour!].map(format).join(" ")).toBe(expected);
    expect(parts(civil.replace(" ", "T") + "+09:00").join(" ")).toBe(expected);
    expect(result.calculationVersion).toBe(SAJU_CALENDAR_VERSION);
  });

  // Package second precision, not independently verified astronomical seconds.
  // HKO minute values: 2024 17:27 / 2025 23:10 / 2026 05:02 KST.
  it.each([
    ["2024-02-04T17:27:07+09:00", "癸卯 乙丑", "甲辰 丙寅"],
    ["2025-02-03T23:10:28+09:00", "甲辰 丁丑", "乙巳 戊寅"],
    ["2026-02-04T05:02:08+09:00", "乙巳 己丑", "丙午 庚寅"],
  ])("changes year/month at package boundary %s", (boundary, before, after) => {
    for (const seconds of [-3600, -60, -1, 0, 1, 60, 3600]) {
      expect(parts(addSeconds(boundary, seconds)).slice(0, 2).join(" ")).toBe(seconds < 0 ? before : after);
    }
  });

  // Audit-frozen package JieQi instants. HKO independently checks minute-level
  // Feb/Mar/Apr/May/Dec terms; all twelve are tested for coordinate consistency.
  it.each([
    ["2024-01-06T05:49:22+09:00", "甲子", "乙丑"],
    ["2024-02-04T17:27:07+09:00", "乙丑", "丙寅"],
    ["2024-03-05T11:22:45+09:00", "丙寅", "丁卯"],
    ["2024-04-04T16:02:17+09:00", "丁卯", "戊辰"],
    ["2024-05-05T09:10:05+09:00", "戊辰", "己巳"],
    ["2024-06-05T13:09:54+09:00", "己巳", "庚午"],
    ["2024-07-06T23:20:03+09:00", "庚午", "辛未"],
    ["2024-08-07T09:09:16+09:00", "辛未", "壬申"],
    ["2024-09-07T12:11:20+09:00", "壬申", "癸酉"],
    ["2024-10-08T03:59:57+09:00", "癸酉", "甲戌"],
    ["2024-11-07T07:20:04+09:00", "甲戌", "乙亥"],
    ["2024-12-07T00:17:03+09:00", "乙亥", "丙子"],
  ])("changes month around Jie %s", (boundary, before, after) => {
    expect(parts(addSeconds(boundary, -60))[1]).toBe(before);
    expect(parts(addSeconds(boundary, 60))[1]).toBe(after);
  });

  it("keeps the KST date/hour separate from the comparison coordinate", () => {
    const context = createSajuCalendarContext("2024-12-07T00:16:00+09:00");
    expect(context.solarDate).toBe("2024-12-07");
    expect(context.civilTime).toBe("00:16");
    expect(context.fixedOffsetMinutes).toBe(540);
    expect(context.solarTermComparisonDateTime).toBe("2024-12-06T23:16:00+08:00");
    expect(format(context.pillars.day)).toBe("乙巳");
    expect(format(context.pillars.hour)).toBe("丙子");
  });

  it("uses the same KST day's stem at 23:30, not the raw library hour", () => {
    expect(parts("1988-02-15T23:30:00+09:00").join(" ")).toBe("戊辰 甲寅 庚子 丙子");
  });

  it.each([1983, 1984, 1996, 1999, 2023, 2024, 2025, 2026, 2027])("uses one boundary for former table/non-table year %s", (year) => {
    const civil = year + "-06-01 12:00:00";
    const result = calculateSaju(inputFor(civil));
    expect(result.calculationVersion).toBe(SAJU_CALENDAR_VERSION);
    expect(result.pillars).toEqual(createSajuCalendarContext(civil.replace(" ", "T") + "+09:00").pillars);
  });

  it("preserves unknown time with a corrected day and no hour", () => {
    const result = calculateSaju({ ...inputFor("2024-02-04 12:00:00"), birthTime: undefined, birthTimeUnknown: true });
    expect(result.pillars).toEqual({ year: { stem: "癸", branch: "卯" }, month: { stem: "乙", branch: "丑" }, day: { stem: "戊", branch: "戌" } });
    expect(result.notices).toContain("출생시간을 모르면 년·월·일주 중심으로 분석됩니다.");
  });

  it("derives elements/ten gods/yin-yang from the corrected pillars", () => {
    const result = calculateSaju(inputFor("2024-02-04 17:28:00"));
    const pillars = { year: { stem: "甲", branch: "辰" }, month: { stem: "丙", branch: "寅" },
      day: { stem: "戊", branch: "戌" }, hour: { stem: "辛", branch: "酉" } } as const;
    expect(result.dayMaster).toBe("戊");
    expect(result.elements).toEqual(analyzeFullElements(pillars));
    expect(result.tenGods).toEqual(analyzeFullTenGods(pillars));
    expect(result.yinYang).toEqual(analyzeVisibleYinYang(pillars));
  });

  it("runs all 26 goldens in three host timezones without network access", () => {
    const script = "const fs=require(\"node:fs\"),ts=require(\"typescript\"),url=require(\"node:url\");\nrequire.extensions[\".ts\"]=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,\"utf8\").replaceAll(\"import.meta.url\",JSON.stringify(url.pathToFileURL(f).href)),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,f);\nglobal.fetch=()=>{throw Error(\"TEST_NETWORK_FORBIDDEN\")};\nconst {calculateSaju}=require(\"./src/lib/saju/calculateSaju.ts\");\nconst {CANONICAL_CALENDAR_GOLDENS}=require(\"./tests/fixtures/saju/canonicalCalendarGoldens.ts\");\nconsole.log(JSON.stringify(CANONICAL_CALENDAR_GOLDENS.map(([civil])=>{\nconst r=calculateSaju({birthDate:civil.slice(0,10),birthTime:civil.slice(11,16),birthTimeUnknown:false,calendarType:\"SOLAR\",gender:\"MALE\",timezone:\"Asia/Seoul\"});\nreturn [\"year\",\"month\",\"day\",\"hour\"].map(k=>r.pillars[k].stem+r.pillars[k].branch).join(\" \");\n})));";
    for (const TZ of ["UTC", "Asia/Seoul", "America/New_York"]) {
      const output = execFileSync(process.execPath, ["-e", script], { cwd: process.cwd(), env: { ...process.env, TZ }, encoding: "utf8" });
      expect(JSON.parse(output)).toEqual(CANONICAL_CALENDAR_GOLDENS.map(([, pillars]) => pillars));
    }
  });
});
