import { createRequire } from "node:module";
import { SAJU_CALENDAR_VERSION, DAYUN_CALCULATION_VERSION, DAYUN_ACTUAL_CYCLE_COUNT } from "./calendarVersion";
import { createSajuCalendarContext } from "./lunarJavascriptPillars";
import { resolveBirthTimeCalculation } from "./birthTimePrecision";
import { normalizeBirthTimePrecision, type BirthTimeInput, type BirthTimeCalculationContext } from "./birthTimePrecisionTypes";
import { hydrateMajorFortuneCycle } from "../report-knowledge/majorFortuneRules";
import type { MajorFortuneCycle } from "../report-knowledge/majorFortuneTypes";

export { DAYUN_CALCULATION_VERSION, DAYUN_ACTUAL_CYCLE_COUNT } from "./calendarVersion";
export const DAYUN_UNCERTAIN_MESSAGE = "선택하신 출생시간 정보로는 대운 기준이 하나로 확정되지 않습니다. 정확한 출생시간을 입력해 주세요.";
export type CustomerDayunInput = BirthTimeInput & { birthDate: string; gender: unknown; name?: string };
export type DayunTimeRange = { earliestKst: string; latestKst: string };
export type CustomerDayunCycle = MajorFortuneCycle & {
  startSolarKst: string | null;
  startSolarRange: DayunTimeRange;
};
export type CustomerDayun = {
  calculationVersion: typeof DAYUN_CALCULATION_VERSION;
  calendarVersion: typeof SAJU_CALENDAR_VERSION;
  libraryVersion: "1.7.7";
  yunSect: 2;
  direction: "forward" | "reverse";
  customerInput: {
    name: string; birthDate: string; gender: "MALE" | "FEMALE";
    birthTime: string; birthTimeUnknown: boolean;
    birthTimePrecision: BirthTimeCalculationContext["birthTimePrecision"];
    approximateBirthTimeSlot: string;
  };
  calendarContext: BirthTimeCalculationContext;
  precision: BirthTimeCalculationContext["birthTimePrecision"];
  stable: true;
  startSolarKst: string | null;
  startSolarRange: DayunTimeRange;
  startOffset: { years: number; months: number; days: number; hours: number } | null;
  ageConvention: "kst_cycle_year_minus_birth_year_plus_one";
  cycles: CustomerDayunCycle[];
};
export type DayunSelection = {
  calculationVersion: typeof DAYUN_CALCULATION_VERSION;
  targetYear: number;
  selectedCycle: CustomerDayunCycle;
  transition: null | {
    transitionYear: true;
    startSolarKst: string | null;
    startSolarRange: DayunTimeRange;
    beforeCycle: CustomerDayunCycle | null;
    afterCycle: CustomerDayunCycle;
  };
  evaluatedAtKst: string | null;
  activeCycleAtEvaluation: number | null;
  notice: string;
};
type Solar = {
  toYmdHms(): string;
  nextYear(years: number): Solar;
  getLunar(): { getEightChar(): {
    getYear(): string; getMonth(): string;
    getYun(gender: number, sect: number): Yun;
  } };
};
type Yun = {
  isForward(): boolean;
  getStartSolar(): Solar;
  getStartYear(): number; getStartMonth(): number; getStartDay(): number; getStartHour(): number;
  getDaYun(count: number): { getIndex(): number; getGanZhi(): string }[];
};
const nodeRequire = createRequire(import.meta.url);
const library = nodeRequire("lunar-javascript") as {
  Solar: { fromYmdHms(y: number, m: number, d: number, h: number, min: number, s: number): Solar };
};
const libraryVersion = (nodeRequire("lunar-javascript/package.json") as { version: string }).version;
const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
export function formatDayunKst(instant: number): string {
  return new Date(instant + 9 * HOUR).toISOString().slice(0, 19) + "+09:00";
}
function solarKst(solar: Solar): string {
  return formatDayunKst(Date.parse(solar.toYmdHms().replace(" ", "T") + "+08:00"));
}
function solarAtInstant(instant: number): Solar {
  const d = new Date(instant + 8 * HOUR);
  return library.Solar.fromYmdHms(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes(), 0);
}
type Failure = { ok: false; error: "DAYUN_GENDER_REQUIRED" | "DAYUN_UNCERTAIN" | "DAYUN_INVALID_INPUT" | "DAYUN_CALENDAR_MISMATCH" | "DAYUN_CYCLE_UNAVAILABLE" };

// All possible input minutes are checked. Sect2 ignores seconds in its interval;
// within one minute only the returned start timestamp's seconds vary (not its year).
export function calculateCustomerDayun(input: CustomerDayunInput): { ok: true; value: CustomerDayun } | Failure {
  if (input.gender !== "MALE" && input.gender !== "FEMALE") return { ok: false, error: "DAYUN_GENDER_REQUIRED" };
  const parsed = normalizeBirthTimePrecision(input);
  if (!parsed.ok || libraryVersion !== "1.7.7") return { ok: false, error: "DAYUN_INVALID_INPUT" };
  try {
    const context = resolveBirthTimeCalculation(input);
    if (!context.confirmed.year || !context.confirmed.month || !context.confirmed.day) return { ok: false, error: "DAYUN_UNCERTAIN" };
    const expectedYear = context.confirmed.year.stem + context.confirmed.year.branch;
    const expectedMonth = context.confirmed.month.stem + context.confirmed.month.branch;
    const forward = ("甲丙戊庚壬".includes(context.confirmed.year.stem)) === (input.gender === "MALE");
    const start = Date.parse(context.range.startKst);
    const end = Date.parse(context.range.endKstExclusive);
    if (!Number.isFinite(start) || end <= start || end - start > 1440 * MINUTE) return { ok: false, error: "DAYUN_INVALID_INPUT" };
    const cycleRanges = Array.from({ length: DAYUN_ACTUAL_CYCLE_COUNT }, () => ({ min: Infinity, max: -Infinity }));
    let baseYun: Yun | undefined;
    let baseYear: number | undefined;
    let baseGanji: string | undefined;
    for (let instant = start; instant < end; instant += MINUTE) {
      const calendar = createSajuCalendarContext(formatDayunKst(instant));
      const eight = solarAtInstant(instant).getLunar().getEightChar();
      const yun = eight.getYun(input.gender === "MALE" ? 1 : 0, 2);
      if (eight.getYear() !== expectedYear || eight.getMonth() !== expectedMonth ||
          calendar.pillars.year.stem + calendar.pillars.year.branch !== expectedYear ||
          calendar.pillars.month.stem + calendar.pillars.month.branch !== expectedMonth || yun.isForward() !== forward) {
        return { ok: false, error: "DAYUN_CALENDAR_MISMATCH" };
      }
      const solar = yun.getStartSolar();
      const year = Number(solarKst(solar).slice(0, 4));
      const ganji = yun.getDaYun(2)[1].getGanZhi();
      if (baseYear !== undefined && (year !== baseYear || ganji !== baseGanji)) return { ok: false, error: "DAYUN_UNCERTAIN" };
      baseYear = year; baseGanji = ganji; baseYun ??= yun;
      // Track every cycle's extrema independently: nextYear can clamp February 29.
      cycleRanges.forEach((range, i) => {
        const ms = Date.parse(solarKst(solar.nextYear(i * 10)));
        range.min = Math.min(range.min, ms);
        range.max = Math.max(range.max, ms);
      });
    }
    if (!baseYun) return { ok: false, error: "DAYUN_INVALID_INPUT" };
    const exact = parsed.precision === "exact";
    const birthYear = Number(input.birthDate.slice(0, 4));
    const cycles = baseYun.getDaYun(DAYUN_ACTUAL_CYCLE_COUNT + 1).filter((c) => c.getIndex() >= 1).map((cycle) => {
      const range = cycleRanges[cycle.getIndex() - 1];
      const earliestKst = formatDayunKst(range.min);
      const latestKst = formatDayunKst(range.max + (exact ? 0 : 59_000));
      const startYear = Number(earliestKst.slice(0, 4));
      return {
        ...hydrateMajorFortuneCycle({ index: cycle.getIndex(), ganji: cycle.getGanZhi(), startYear, endYear: startYear + 9, startAge: startYear - birthYear + 1, endAge: startYear - birthYear + 10 }),
        startSolarKst: exact ? earliestKst : null,
        startSolarRange: { earliestKst, latestKst },
      };
    });
    if (cycles.length !== DAYUN_ACTUAL_CYCLE_COUNT || cycles.some((c) => Number(c.startSolarRange.latestKst.slice(0, 4)) !== c.startYear)) return { ok: false, error: "DAYUN_UNCERTAIN" };
    return { ok: true, value: {
      calculationVersion: DAYUN_CALCULATION_VERSION, calendarVersion: SAJU_CALENDAR_VERSION,
      libraryVersion: "1.7.7", yunSect: 2, direction: forward ? "forward" : "reverse",
      customerInput: { name: input.name?.trim() ?? "", birthDate: input.birthDate, gender: input.gender, birthTime: parsed.time, birthTimeUnknown: parsed.precision === "unknown", birthTimePrecision: parsed.precision, approximateBirthTimeSlot: parsed.slot },
      calendarContext: context, precision: parsed.precision, stable: true,
      startSolarKst: cycles[0].startSolarKst, startSolarRange: cycles[0].startSolarRange,
      startOffset: exact ? { years: baseYun.getStartYear(), months: baseYun.getStartMonth(), days: baseYun.getStartDay(), hours: baseYun.getStartHour() } : null,
      ageConvention: "kst_cycle_year_minus_birth_year_plus_one", cycles,
    } };
  } catch {
    return { ok: false, error: "DAYUN_INVALID_INPUT" };
  }
}

export function selectCustomerDayun(basis: CustomerDayun, targetYear: number, now?: Date): { ok: true; value: DayunSelection } | Failure {
  const selectedCycle = basis.cycles.find((c) => c.startYear <= targetYear && targetYear <= c.endYear);
  if (!selectedCycle) return { ok: false, error: "DAYUN_CYCLE_UNAVAILABLE" };
  const transition = selectedCycle.startYear === targetYear ? {
    transitionYear: true as const, startSolarKst: selectedCycle.startSolarKst,
    startSolarRange: selectedCycle.startSolarRange,
    beforeCycle: basis.cycles.find((c) => c.index === selectedCycle.index - 1) ?? null,
    afterCycle: selectedCycle,
  } : null;
  let activeCycleAtEvaluation: number | null = null;
  if (now) {
    for (const cycle of basis.cycles) {
      if (now.getTime() >= Date.parse(cycle.startSolarRange.latestKst)) activeCycleAtEvaluation = cycle.index;
      else if (now.getTime() >= Date.parse(cycle.startSolarRange.earliestKst)) { activeCycleAtEvaluation = null; break; }
    }
  }
  const notice = transition
    ? `${targetYear}년은 대운이 바뀌는 해입니다. ${transition.beforeCycle ? transition.beforeCycle.ganji + " 대운" : "첫 대운이 시작되기 전"}과 ${selectedCycle.ganji} 대운을 전환 전후로 나누어 읽습니다. 전환 기준은 ${selectedCycle.startSolarKst ? selectedCycle.startSolarKst.slice(0, 10) : selectedCycle.startSolarRange.earliestKst.slice(0, 10) + "~" + selectedCycle.startSolarRange.latestKst.slice(0, 10)}이며, 연초부터 새 대운에 들어선 것으로 단정하지 않습니다.`
    : basis.precision === "exact" ? "" : "대운표의 연도 구간은 출생시간 범위 전체에서 같지만, 정확한 교운일은 하나로 확정하지 않습니다.";
  return { ok: true, value: { calculationVersion: DAYUN_CALCULATION_VERSION, targetYear, selectedCycle, transition, evaluatedAtKst: now ? formatDayunKst(now.getTime()) : null, activeCycleAtEvaluation, notice } };
}
