/**
 * ZW-1 1부 · 운반 날짜 74일 전수 + 경계 입력.
 * - 운반 날짜: 한국 음력(윤달 규칙 적용) 날짜가 중국 농력에 없는 날(1900~2050년 74일)은 같은 간지 해로 옮겨 별만 배치한다.
 *   74일 × 12시진을 소형 검증기와 맞대고, 대한 연도 · 지금 대한이 실제 출생 해로 계산되는지 본다(덕짱 수정 2).
 * - 경계: 윤달 15 · 16 · 30일, 한중 설이 다른 날, 설과 입춘 사이(양쪽), 밤 11시대 · 자정 전후, 서머타임, 옛 표준시(UTC+8:30), 시진만, 윤년 2월 말.
 */
import { describe, expect, it } from "vitest";
import { resolveBirthTimeCalculation } from "@/lib/saju/birthTimePrecision";
import { BIRTH_TIME_SLOT_DEFINITIONS } from "@/lib/saju/birthTimePrecisionTypes";
import { lunarToSolarDate } from "@/lib/saju/solarTerms";
import { computeZiweiChart, type ZiweiChartInput } from "@/lib/ziwei/chart";
import { BRANCHES } from "@/lib/ziwei/ids";
import { effectiveLunarMonth, koreanLunarToSolar, solarToKoreanLunar, ZIWEI_SOLAR_RANGE } from "@/lib/ziwei/lunar";
import { compareWithVerifier, invariantViolations } from "./helpers";

const DAY = 86_400_000;
const AS_OF = "2026-11-24";
const slotInput = (birthDate: string, hour: number, gender: "MALE" | "FEMALE" = "MALE"): ZiweiChartInput =>
  ({ birthDate, birthTime: "", birthTimeUnknown: false, approximateBirthTimeSlot: BIRTH_TIME_SLOT_DEFINITIONS[hour].value, gender }) as ZiweiChartInput;
const exactInput = (birthDate: string, birthTime: string, gender: "MALE" | "FEMALE" = "FEMALE"): ZiweiChartInput =>
  ({ birthDate, birthTime, birthTimeUnknown: false, gender }) as ZiweiChartInput;
const check = (input: ZiweiChartInput) => {
  const c = computeZiweiChart(input, AS_OF);
  const ctx = resolveBirthTimeCalculation(input);
  const saju = { hour: ctx.confirmed.hour!.stem + ctx.confirmed.hour!.branch, day: ctx.confirmed.day!.stem + ctx.confirmed.day!.branch };
  expect([...compareWithVerifier(c), ...invariantViolations(c, saju)], `${input.birthDate} ${input.birthTime || input.approximateBirthTimeSlot}`).toEqual([]);
  return c;
};

describe("운반 날짜(중국 농력에 없는 한국 음력 날짜) 전수", () => {
  it("1900~2050년 74일 × 12시진이 소형 검증기와 같고, 대한 연도는 실제 출생 해로 센다", () => {
    const days: string[] = [];
    for (let t = Date.parse(`${ZIWEI_SOLAR_RANGE.min}T00:00:00Z`); t <= Date.parse(`${ZIWEI_SOLAR_RANGE.max}T00:00:00Z`); t += DAY) {
      const iso = new Date(t).toISOString().slice(0, 10);
      const l = solarToKoreanLunar(iso);
      const eff = effectiveLunarMonth(l);
      try { lunarToSolarDate(`${l.year}-${String(eff.month).padStart(2, "0")}-${String(l.day).padStart(2, "0")}`, false); } catch { days.push(iso); }
    }
    expect(days).toHaveLength(74);
    let charts = 0;
    for (const [i, iso] of days.entries()) {
      for (let h = 0; h < 12; h++) {
        const c = check(slotInput(iso, h, (i + h) % 2 ? "MALE" : "FEMALE"));
        expect(c.birth.lunar.year).toBe(solarToKoreanLunar(iso).year);
        expect(c.decadals[0].startYear).toBe(c.birth.lunar.year + c.fiveClass.number - 1);
        charts++;
      }
    }
    expect(charts).toBe(74 * 12);
  }, 600_000);
});

describe("경계 입력", () => {
  it("윤달 15일은 그 달, 16일은 다음 달(2020년 윤4월), 윤달 30일도 다음 달", () => {
    const d15 = koreanLunarToSolar({ year: 2020, month: 4, day: 15, leap: true })!;
    const d16 = koreanLunarToSolar({ year: 2020, month: 4, day: 16, leap: true })!;
    expect(check(slotInput(d15, 6)).birth).toMatchObject({ month: 4, lunar: { leap: true, day: 15 } });
    expect(check(slotInput(d16, 6)).birth).toMatchObject({ month: 5, lunar: { leap: true, day: 16 } });
    // 1900~2050년에서 30일이 있는 첫 한국 윤달.
    let thirty: string | null = null;
    for (let y = 1900; y <= 2050 && !thirty; y++) for (let m = 1; m <= 12 && !thirty; m++) thirty = koreanLunarToSolar({ year: y, month: m, day: 30, leap: true });
    expect(thirty).not.toBeNull();
    expect(check(slotInput(thirty!, 3)).birth.month).toBe(solarToKoreanLunar(thirty!).month + 1);
  });

  it("한국 · 중국 설이 다른 날(1997-02-07): 한국 음력 1996-12-30 병자년(중국 농력이면 정축년)", () => {
    const c = check(exactInput("1997-02-07", "12:00"));
    expect(c.birth.lunar).toEqual({ year: 1996, month: 12, day: 30, leap: false });
    expect(c.year.stem + c.year.branch).toBe("丙子");
    expect(c.year.differsFromSaju).toBe(true);
  });

  it("설과 입춘 사이: 입춘 뒤 · 설 전(2019-02-04)과 설 뒤 · 입춘 전(2023-01-25)", () => {
    const a = check(exactInput("2019-02-04", "15:00"));
    expect(a.year.stem + a.year.branch).toBe("戊戌");
    expect(a.year.differsFromSaju).toBe(true);
    const b = check(exactInput("2023-01-25", "15:00"));
    expect(b.year.stem + b.year.branch).toBe("癸卯");
    expect(b.year.differsFromSaju).toBe(true);
    expect(check(exactInput("2023-03-01", "15:00")).year.differsFromSaju).toBe(false);
  });

  it("밤 11시대 · 자정 전후(2000-06-15, 태양시 30분 보정 + 통자시)", () => {
    const at = (date: string, time: string) => { const c = check(exactInput(date, time)); return `${c.birth.date} ${c.birth.hourBranch}`; };
    expect(at("2000-06-15", "23:29")).toBe("2000-06-15 亥");
    expect(at("2000-06-15", "23:30")).toBe("2000-06-16 子");
    expect(at("2000-06-15", "23:59")).toBe("2000-06-16 子");
    expect(at("2000-06-16", "00:29")).toBe("2000-06-16 子");
    expect(at("2000-06-16", "00:30")).toBe("2000-06-16 子");
    expect(at("2000-06-16", "01:29")).toBe("2000-06-16 子");
    expect(at("2000-06-16", "01:30")).toBe("2000-06-16 丑");
  });

  it("서머타임 · 옛 표준시 연도(사주 엔진 라벨 예와 같은 시진)", () => {
    const hour = (date: string, time: string) => check(exactInput(date, time)).birth.hourBranch;
    // birthTimePrecisionTypes.datedSlotLabel 예: 1987-07-01 유시 18:30~20:29(서머타임 UTC+10), 1957-07-01 유시 18:00~19:59, 1960-01-01 유시 17:00~18:59(UTC+8:30).
    expect([hour("1987-07-01", "18:29"), hour("1987-07-01", "18:30"), hour("1987-07-01", "20:29"), hour("1987-07-01", "20:30")]).toEqual(["申", "酉", "酉", "戌"]);
    expect([hour("1957-07-01", "17:59"), hour("1957-07-01", "18:00"), hour("1957-07-01", "19:59"), hour("1957-07-01", "20:00")]).toEqual(["申", "酉", "酉", "戌"]);
    expect([hour("1960-01-01", "16:59"), hour("1960-01-01", "17:00"), hour("1960-01-01", "18:59"), hour("1960-01-01", "19:00")]).toEqual(["申", "酉", "酉", "戌"]);
    // UTC+8:30 = 동경 127.5도라 보정 없음: 23:10은 자시, 다음 날.
    const c = check(exactInput("1958-03-10", "23:10"));
    expect(`${c.birth.date} ${c.birth.hourBranch}`).toBe("1958-03-11 子");
  });

  it("시진만 입력: 12시진 모두 그 생일 · 그 시진", () => {
    for (let h = 0; h < 12; h++) {
      const c = check(slotInput("2001-05-05", h, h % 2 ? "MALE" : "FEMALE"));
      expect([c.birth.date, c.birth.hourBranch, c.birth.precision]).toEqual(["2001-05-05", BRANCHES[h], "approximate"]);
    }
  });

  it("윤년 2월 말: 2000-02-28 · 02-29 밤 11시 40분은 다음 날 자시", () => {
    const at = (date: string, time: string) => { const c = check(exactInput(date, time)); return `${c.birth.date} ${c.birth.hourBranch}`; };
    expect(at("2000-02-28", "23:40")).toBe("2000-02-29 子");
    expect(at("2000-02-29", "23:40")).toBe("2000-03-01 子");
    expect(at("2000-02-29", "12:00")).toBe("2000-02-29 午");
    expect(at("1900-02-28", "23:40")).toBe("1900-03-01 子");
  });
});
