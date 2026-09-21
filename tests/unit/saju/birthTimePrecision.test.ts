import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { resolveBirthTimeCalculation, UncertainBirthTimeError } from "../../../src/lib/saju/birthTimePrecision";
import { BIRTH_TIME_SLOT_DEFINITIONS, normalizeBirthTimePrecision } from "../../../src/lib/saju/birthTimePrecisionTypes";
import { calculateSaju } from "../../../src/lib/saju/calculateSaju";
import { createSajuCalendarContext } from "../../../src/lib/saju/lunarJavascriptPillars";

const base = { birthDate: "1996-12-06", birthTimeUnknown: false, calendarType: "SOLAR", gender: "MALE", timezone: "Asia/Seoul" } as const;
const chars = (values: readonly { stem: string; branch: string }[]) => values.map((p) => p.stem + p.branch);
describe("birth time precision contract", () => {
  it.each([
    { birthTimePrecision: "exact" },
    { birthTimePrecision: "exact", birthTime: "08:00", approximateBirthTimeSlot: "JINSI" },
    { birthTimePrecision: "approximate" },
    { birthTimePrecision: "approximate", birthTime: "08:00", approximateBirthTimeSlot: "JINSI" },
    { birthTimeUnknown: true, birthTime: "08:00" },
    { birthTimeUnknown: true, approximateBirthTimeSlot: "JINSI" },
    { approximateBirthTimeSlot: "NOT_A_SLOT" },
    { birthTime: "24:00" }, { birthTime: "12:60" }, { birthTimeUnknown: "true" },
  ])("rejects contradictory/invalid state %j", (input) => expect(normalizeBirthTimePrecision(input).ok).toBe(false));

  it("keeps exact minute and known golden; stable approximate has no fabricated time", () => {
    const exact = calculateSaju({ ...base, birthTime: "14:15", birthTimePrecision: "exact" });
    expect(chars(Object.values(exact.pillars))).toEqual(["丙子", "己亥", "丁丑", "丁未"]);
    const approximate = calculateSaju({ ...base, approximateBirthTimeSlot: "MISI", birthTimePrecision: "approximate" });
    expect(approximate.pillars).toEqual(exact.pillars);
    expect(approximate.input.birthTime).toBeUndefined();
    expect(approximate.birthTimeContext?.range).toEqual({ startKst: "1996-12-06T13:00:00+09:00", endKstExclusive: "1996-12-06T15:00:00+09:00" });
  });
  it.each(BIRTH_TIME_SLOT_DEFINITIONS)("evaluates $value branch across the entire slot", (slot) => {
    const context = resolveBirthTimeCalculation({ ...base, approximateBirthTimeSlot: slot.value });
    const branch = "子丑寅卯辰巳午未申酉戌亥"[BIRTH_TIME_SLOT_DEFINITIONS.indexOf(slot)];
    expect(context.candidates.hour.every((p) => p.branch === branch)).toBe(true);
    expect(context.stable.day).toBe(slot.value !== "JASI");
  });
  it("preserves both days for Zi, attributed to the ending date", () => {
    const input = { ...base, birthDate: "2024-03-01", approximateBirthTimeSlot: "JASI" as const };
    const context = resolveBirthTimeCalculation(input);
    expect(context.range).toEqual({ startKst: "2024-02-29T23:00:00+09:00", endKstExclusive: "2024-03-01T01:00:00+09:00" });
    expect(chars(context.candidates.day)).toEqual(["癸亥", "甲子"]);
    expect(chars(context.candidates.hour)).toEqual(["壬子", "甲子"]);
    expect(context.confirmed.day).toBeUndefined();
    expect(() => calculateSaju(input)).toThrow(UncertainBirthTimeError);
  });
  it.each([
    ["2024-02-04", "YUSI", ["癸卯", "甲辰"], ["乙丑", "丙寅"]],
    ["2024-03-05", "OSI", ["甲辰"], ["丙寅", "丁卯"]],
  ] as const)("keeps solar-term candidates for %s %s", (birthDate, slot, years, months) => {
    const context = resolveBirthTimeCalculation({ ...base, birthDate, approximateBirthTimeSlot: slot });
    expect(chars(context.candidates.year)).toEqual(years);
    expect(chars(context.candidates.month)).toEqual(months);
    expect(context.stable.month).toBe(false);
  });
  it.each(["1996-12-06", "2024-02-29"])("unknown ordinary date %s retains three pillars only", (birthDate) => {
    const result = calculateSaju({ ...base, birthDate, birthTimeUnknown: true });
    expect(result.birthTimeContext?.stable).toEqual({ year: true, month: true, day: true, hour: false });
    expect(result.pillars.hour).toBeUndefined();
    expect(result.tenGods.stems.hour).toBeUndefined();
    expect(result.birthTimeContext?.confirmed.hour).toBeUndefined();
    expect(result.birthTimeContext?.range).toEqual({ startKst: birthDate + "T00:00:00+09:00", endKstExclusive: birthDate === "2024-02-29" ? "2024-03-01T00:00:00+09:00" : "1996-12-07T00:00:00+09:00" });
  });
  it.each(["2024-02-04", "2024-03-05"])("unknown boundary %s never finalizes noon", (birthDate) => {
    const context = resolveBirthTimeCalculation({ ...base, birthDate, birthTimeUnknown: true });
    expect(context.candidates.month).toHaveLength(2);
    expect(context.confirmed.month).toBeUndefined();
    expect(context.stable.day).toBe(true);
    expect(() => calculateSaju({ ...base, birthDate, birthTimeUnknown: true })).toThrow(UncertainBirthTimeError);
  });
  it("event evaluation agrees with every minute on Ipchun, including non-minute transition", () => {
    const context = resolveBirthTimeCalculation({ ...base, birthDate: "2024-02-04", birthTimeUnknown: true });
    const found = { year: new Set<string>(), month: new Set<string>(), day: new Set<string>(), hour: new Set<string>() };
    for (let minute = 0; minute < 1440; minute++) {
      const time = String(Math.floor(minute / 60)).padStart(2, "0") + ":" + String(minute % 60).padStart(2, "0");
      const { pillars } = createSajuCalendarContext("2024-02-04T" + time + ":00+09:00");
      for (const key of ["year", "month", "day", "hour"] as const) found[key].add(pillars[key].stem + pillars[key].branch);
    }
    for (const key of ["year", "month", "day", "hour"] as const) expect(new Set(chars(context.candidates[key]))).toEqual(found[key]);
  });
  it("is independent of host timezone for Zi and unknown boundary", () => {
    const script = `const fs=require("node:fs"),ts=require("typescript"),url=require("node:url");
      require.extensions[".ts"]=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,"utf8").replaceAll("import.meta.url",JSON.stringify(url.pathToFileURL(f).href)),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,f);
      global.fetch=()=>{throw Error("NETWORK_FORBIDDEN")};
      const {resolveBirthTimeCalculation:r}=require("./src/lib/saju/birthTimePrecision.ts");
      process.stdout.write(JSON.stringify([r({birthDate:"2024-01-01",approximateBirthTimeSlot:"JASI"}),r({birthDate:"2024-02-04",birthTimeUnknown:true})]));`;
    const results = ["UTC", "Asia/Seoul", "America/New_York"].map((TZ) => execFileSync(process.execPath, ["-e", script], { env: { ...process.env, TZ }, encoding: "utf8" }));
    expect(new Set(results).size).toBe(1);
    expect(JSON.parse(results[0])[0].range.startKst).toBe("2023-12-31T23:00:00+09:00");
  });
});
