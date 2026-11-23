/**
 * ZW-1 자미 날짜 · 한국 음력 · 윤달 규칙(서버 · 시험에서 쓴다).
 * - 자미 날짜와 시진은 사주 엔진 함수(태양시 · 통자시)를 그대로 불러 만든다. 사주 엔진 파일은 바꾸지 않는다.
 * - 음력은 한국 음력(KASI 표, korean-lunar-calendar 0.4.0). 사주 엔진의 음력 입력 경로(lunar-javascript, 중국 농력)와는
 *   1900~2050년 1,978일이 다르다(고객 경로는 양력만 — tests/unit/ziwei/lunarSource.test.ts가 목록을 고정한다).
 * - 윤달 규칙은 effectiveLunarMonth 한 곳에만 둔다.
 */
import KoreanLunarCalendar from "korean-lunar-calendar";
import { DEFAULT_SAJU_TIME_POLICY, withBirthLongitude, type SajuTimePolicy } from "@/lib/saju/calcPolicy";
import { resolveBirthTimeCalculation } from "@/lib/saju/birthTimePrecision";
import type { BirthTimeInput } from "@/lib/saju/birthTimePrecisionTypes";
import { createSajuCalendarContext } from "@/lib/saju/lunarJavascriptPillars";
import { getDayPillarFromSolarDate } from "@/lib/saju/pillars";
import { BRANCHES, type Branch } from "./ids";
import type { KoreanLunarDate } from "./types";

/** 한국 음력 변환 범위(변환 표 끝 2050-12-31, 시작은 음력 1900-01-01). */
export const ZIWEI_SOLAR_RANGE = Object.freeze({ min: "1900-01-31", max: "2050-12-31" });

export class ZiweiDateRangeError extends Error {
  constructor(readonly date: string) {
    super(`자미두수는 ${ZIWEI_SOLAR_RANGE.min}~${ZIWEI_SOLAR_RANGE.max} 사이 날짜만 계산합니다: ${date}`);
    this.name = "ZiweiDateRangeError";
  }
}

const DAY_MS = 86_400_000;
export const nextIsoDate = (iso: string) => new Date(Date.parse(`${iso}T00:00:00Z`) + DAY_MS).toISOString().slice(0, 10);

/** 양력 → 한국 음력. 범위 밖이거나 없는 날짜면 ZiweiDateRangeError. */
export function solarToKoreanLunar(iso: string): KoreanLunarDate {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m || iso < ZIWEI_SOLAR_RANGE.min || iso > ZIWEI_SOLAR_RANGE.max) throw new ZiweiDateRangeError(iso);
  const c = new KoreanLunarCalendar();
  if (!c.setSolarDate(Number(m[1]), Number(m[2]), Number(m[3]))) throw new ZiweiDateRangeError(iso);
  const l = c.getLunarCalendar();
  return { year: l.year, month: l.month, day: l.day, leap: l.intercalation === true };
}

/** 한국 음력 → 양력(없는 날이면 null). */
export function koreanLunarToSolar(l: KoreanLunarDate): string | null {
  const c = new KoreanLunarCalendar();
  if (!c.setLunarDate(l.year, l.month, l.day, l.leap)) return null;
  const s = c.getSolarCalendar();
  return `${s.year}-${String(s.month).padStart(2, "0")}-${String(s.day).padStart(2, "0")}`;
}

/**
 * 윤달 규칙(이곳 한 곳): 윤달 1~15일은 그 달, 16일부터는 다음 달. 윤12월 16일~은 다음 해 정월(달 1)로 넘어가지만
 * 해 간지는 태어난 음력 해 그대로다(설 전에 태어났으므로). 1900~2050년 한국 음력에 윤12월은 없다(시험이 센다).
 */
export function effectiveLunarMonth(l: KoreanLunarDate): { readonly month: number; readonly rolledToNextYear: boolean } {
  if (!l.leap || l.day <= 15) return { month: l.month, rolledToNextYear: false };
  return l.month === 12 ? { month: 1, rolledToNextYear: true } : { month: l.month + 1, rolledToNextYear: false };
}

export type ZiweiBirthInput = BirthTimeInput & { readonly birthDate: string };
export type ZiweiDayAndHour = {
  readonly precision: "exact" | "approximate";
  /** 자미 날짜(양력) = 사주 일주가 가리키는 날. */
  readonly date: string;
  readonly hourBranch: Branch;
  readonly hourIndex: number;
  /** 사주 엔진이 정한 일주 · 시주 · 해(입춘 경계) 간지 — 불변식 대조용. */
  readonly saju: { readonly day: string; readonly hour: string; readonly year: string };
};

export class ZiweiTimeUnknownError extends Error {
  constructor() {
    super("태어난 시각을 전혀 모르면 자미두수 명반을 만들 수 없습니다.");
    this.name = "ZiweiTimeUnknownError";
  }
}

/**
 * 사주 엔진 경로로 자미 날짜 · 시진을 정한다.
 * - 정확한 시각: 사주 엔진이 정한 순간의 태양시 날짜 · 시각. 태양시 23시대는 통자시(사주 정책 ziHourRule unified)로 다음 날.
 * - 시진만: 입력한 생일과 그 시진(사주 엔진 정의상 자시는 끝나는 날 = 생일에 속한다).
 * - 시각 완전 미상: ZiweiTimeUnknownError(입력 단계에서 막는다 — readiness.ts).
 * 어느 경우든 「자미 날짜의 일진 = 사주 일주」 · 「시진 = 사주 시지」를 확인하고, 다르면 오류(버그)다.
 */
export function ziweiDayAndHour(input: ZiweiBirthInput, basePolicy: SajuTimePolicy = DEFAULT_SAJU_TIME_POLICY): ZiweiDayAndHour {
  const ctx = resolveBirthTimeCalculation(input, basePolicy);
  const policy = withBirthLongitude(basePolicy, input.birthLongitude);
  if (ctx.birthTimePrecision === "unknown") throw new ZiweiTimeUnknownError();
  const { day, hour, year } = ctx.confirmed;
  if (!day || !hour || !year) throw new Error("사주 엔진이 일주 · 시주 · 연주를 하나로 정하지 못했습니다.");
  let date: string;
  if (ctx.birthTimePrecision === "exact") {
    const c = createSajuCalendarContext(ctx.range.startKst, policy);
    const lateZi = c.solarTime.startsWith("23:") && policy.ziHourRule === "unified";
    date = lateZi ? nextIsoDate(c.solarDate) : c.solarDate;
  } else {
    date = input.birthDate;
  }
  const dayPillar = getDayPillarFromSolarDate(date);
  if (dayPillar.stem !== day.stem || dayPillar.branch !== day.branch) throw new Error(`자미 날짜 ${date}의 일진이 사주 일주와 다릅니다.`);
  const hourIndex = BRANCHES.indexOf(hour.branch as Branch);
  if (hourIndex < 0) throw new Error("사주 시지를 읽을 수 없습니다.");
  return {
    precision: ctx.birthTimePrecision, date, hourBranch: hour.branch as Branch, hourIndex,
    saju: { day: day.stem + day.branch, hour: hour.stem + hour.branch, year: year.stem + year.branch },
  };
}
