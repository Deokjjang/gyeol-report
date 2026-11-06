import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { resolveBirthTimeCalculation, UncertainBirthTimeError } from "../../../src/lib/saju/birthTimePrecision";
import { BIRTH_TIME_SLOT_DEFINITIONS, birthTimeSlotLabel, birthTimeSlotOptions, datedSlotLabel, normalizeBirthTimePrecision } from "../../../src/lib/saju/birthTimePrecisionTypes";
import { SAJU_CALENDAR_VERSION } from "../../../src/lib/saju/calendarVersion";
import { utcOffsetMinutesAt } from "../../../src/lib/saju/solarTime";
import { calculateSaju } from "../../../src/lib/saju/calculateSaju";
import { createSajuCalendarContext } from "../../../src/lib/saju/lunarJavascriptPillars";
import { DEFAULT_SAJU_TIME_POLICY } from "../../../src/lib/saju/calcPolicy";
import { getDayPillarFromSolarDate } from "../../../src/lib/saju/pillars";

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
    // v5-lmt: MISI is solar 13:00-15:00, i.e. civil 13:30-15:30 at the default 127.5E.
    expect(approximate.birthTimeContext?.range).toEqual({ startKst: "1996-12-06T13:30:00+09:00", endKstExclusive: "1996-12-06T15:30:00+09:00" });
  });
  it.each(BIRTH_TIME_SLOT_DEFINITIONS)("evaluates $value branch across the entire slot", (slot) => {
    const context = resolveBirthTimeCalculation({ ...base, approximateBirthTimeSlot: slot.value });
    const branch = "子丑寅卯辰巳午未申酉戌亥"[BIRTH_TIME_SLOT_DEFINITIONS.indexOf(slot)];
    expect(context.candidates.hour.every((p) => p.branch === branch)).toBe(true);
    // unified 子 rule: the whole solar JASI slot belongs to the ending date.
    expect(context.stable.day).toBe(true);
    const split = resolveBirthTimeCalculation({ ...base, approximateBirthTimeSlot: slot.value }, { ...DEFAULT_SAJU_TIME_POLICY, ziHourRule: "split" });
    expect(split.stable.day).toBe(slot.value !== "JASI");
  });
  it("attributes Zi to the ending date (unified) and keeps both days under split", () => {
    const input = { ...base, birthDate: "2024-03-01", approximateBirthTimeSlot: "JASI" as const };
    const context = resolveBirthTimeCalculation(input);
    expect(context.range).toEqual({ startKst: "2024-02-29T23:30:00+09:00", endKstExclusive: "2024-03-01T01:30:00+09:00" });
    expect(chars(context.candidates.day)).toEqual(["甲子"]);
    expect(chars(context.candidates.hour)).toEqual(["甲子"]);
    expect(calculateSaju(input).pillars.day).toEqual({ stem: "甲", branch: "子" });
    const split = resolveBirthTimeCalculation(input, { ...DEFAULT_SAJU_TIME_POLICY, ziHourRule: "split" });
    expect(chars(split.candidates.day)).toEqual(["癸亥", "甲子"]);
    // 야자시 takes the next day's 子 stem, so both halves are 甲子 hours.
    expect(chars(split.candidates.hour)).toEqual(["甲子"]);
    expect(split.confirmed.day).toBeUndefined();
  });
  it.each([
    // 입춘 17:27 KST = solar 16:57 (SINSI); 경칩 11:23 KST = solar 10:53 (SASI).
    ["2024-02-04", "SINSI", ["癸卯", "甲辰"], ["乙丑", "丙寅"]],
    ["2024-03-05", "SASI", ["甲辰"], ["丙寅", "丁卯"]],
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
    for (const key of ["year", "month", "hour"] as const) expect(new Set(chars(context.candidates[key]))).toEqual(found[key]);
    // Unknown time has no solar anchor: the typed civil date is the day pillar.
    expect(chars(context.candidates.day)).toEqual(chars([getDayPillarFromSolarDate("2024-02-04")]));
  });
  it("is independent of host timezone for Zi and unknown boundary", () => {
    const script = `const fs=require("node:fs"),ts=require("typescript"),url=require("node:url");
      require.extensions[".ts"]=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,"utf8").replaceAll("import.meta.url",JSON.stringify(url.pathToFileURL(f).href)),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,f);
      global.fetch=()=>{throw Error("NETWORK_FORBIDDEN")};
      const {resolveBirthTimeCalculation:r}=require("./src/lib/saju/birthTimePrecision.ts");
      process.stdout.write(JSON.stringify([r({birthDate:"2024-01-01",approximateBirthTimeSlot:"JASI"}),r({birthDate:"2024-02-04",birthTimeUnknown:true})]));`;
    const results = ["UTC", "Asia/Seoul", "America/New_York"].map((TZ) => execFileSync(process.execPath, ["-e", script], { env: { ...process.env, TZ }, encoding: "utf8" }));
    expect(new Set(results).size).toBe(1);
    expect(JSON.parse(results[0])[0].range.startKst).toBe("2023-12-31T23:30:00+09:00");
  });
});

// 운영 Q 8-2: 「대략」 라벨은 생년월일 당시 시계(tzdata UTC 오프셋 − 경도×4분) 기준. 계산(시진 범위)은 그대로다.
describe("날짜별 대략 시간대 라벨", () => {
  const yusi = (date: string) => datedSlotLabel("YUSI", date);
  it("1948~51·1987~88 여름(UTC+10) +90, 1955~60 여름(UTC+9:30) +60, UTC+8:30 시기 +0, 그 밖 +30", () => {
    expect([yusi("1987-07-15"), yusi("1988-08-01"), yusi("1950-07-01")]).toEqual(["유시 18:30~20:29", "유시 18:30~20:29", "유시 18:30~20:29"]);
    expect([yusi("1955-07-01"), yusi("1960-06-01")]).toEqual(["유시 18:00~19:59", "유시 18:00~19:59"]);
    expect([yusi("1908-06-01"), yusi("1911-12-31"), yusi("1954-03-21"), yusi("1961-08-09")]).toEqual(Array(4).fill("유시 17:00~18:59"));
    expect([yusi("1912-01-02"), yusi("1954-03-19"), yusi("1961-08-11"), yusi("1987-12-01"), yusi("2000-05-11")]).toEqual(Array(5).fill("유시 17:30~19:29"));
    // 자정을 넘는 시진: 「전날」·「다음 날」.
    expect([datedSlotLabel("JASI", "2000-05-11"), datedSlotLabel("JASI", "1957-07-01"), datedSlotLabel("JASI", "1960-01-01"), datedSlotLabel("HAESI", "1987-07-15")])
      .toEqual(["자시 전날 23:30~당일 01:29", "자시 00:00~01:59", "자시 전날 23:00~당일 00:59", "해시 22:30~다음 날 00:29"]);
    // 서머타임 시작 날(1987-05-10 02:00 → 03:00): 축시 시계 범위가 3시간.
    expect(datedSlotLabel("CHUKSI", "1987-05-10")).toBe("축시 01:30~04:29");
  });
  it("라벨 시각 = 엔진이 계산하는 시진 범위를 그 순간의 시계로 읽은 값(전환 날 포함 매 시진)", () => {
    const civil = (iso: string) => { const ms = Date.parse(iso); return new Date(ms + utcOffsetMinutesAt(ms, "Asia/Seoul") * 60_000).toISOString().slice(11, 16); };
    // 1908-04-01 전(지방 평균시 +8:27:52)은 초 단위 오프셋이라 분 라벨과 비교하지 않는다.
    for (const date of ["1908-04-02", "1948-06-01", "1948-09-13", "1951-05-06", "1954-03-21", "1955-05-05", "1957-07-01", "1961-08-10", "1987-05-10", "1987-10-11", "1988-07-01", "2026-11-06"]) {
      for (const slot of BIRTH_TIME_SLOT_DEFINITIONS) {
        const r = resolveBirthTimeCalculation({ birthDate: date, approximateBirthTimeSlot: slot.value }).range;
        const [, from, to] = /(\d{2}:\d{2})~(?:당일 |다음 날 )?(\d{2}:\d{2})$/.exec(datedSlotLabel(slot.value, date)!)!;
        expect([from, to], `${date} ${slot.value}`).toEqual([civil(r.startKst), civil(new Date(Date.parse(r.endKstExclusive) - 60_000).toISOString())]);
      }
    }
  });
  it("날짜 전·이상한 날짜는 지금 시계(UTC+9) 라벨, 옛 계산판 라벨은 그대로", () => {
    expect(birthTimeSlotOptions("").map(s => s.labelKo)).toEqual(BIRTH_TIME_SLOT_DEFINITIONS.map(s => s.labelKo));
    expect(birthTimeSlotOptions("1987-02-30").map(s => s.labelKo)).toEqual(BIRTH_TIME_SLOT_DEFINITIONS.map(s => s.labelKo));
    expect(birthTimeSlotOptions("1987-07-15").find(s => s.value === "YUSI")?.labelKo).toBe("유시 18:30~20:29");
    expect(birthTimeSlotLabel("YUSI", SAJU_CALENDAR_VERSION)).toBe("유시 17:30~19:29");
    expect(birthTimeSlotLabel("YUSI", SAJU_CALENDAR_VERSION, "1987-07-15")).toBe("유시 18:30~20:29");
    expect(birthTimeSlotLabel("YUSI", "saju-calendar-kst-v2", "1987-07-15")).toBe("유시 17:00~18:59");
  });
});
