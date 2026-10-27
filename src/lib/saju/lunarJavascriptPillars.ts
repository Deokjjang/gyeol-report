import { SAJU_CALENDAR_VERSION } from "./calendarVersion";
import { DEFAULT_SAJU_TIME_POLICY, type SajuTimePolicy } from "./calcPolicy";
import { getDayHourPillarsFromSolarTime, getDayPillarFromSolarDate } from "./pillars";
import { solarTimeCorrectionMinutes, solarWallClockMs, utcOffsetMinutesAt } from "./solarTime";
import { getSolarTermContext, UnsupportedSolarTermYearError } from "./solarTerms";
import type { Pillar } from "./types";

export type LunarJavascriptPillarSet = {
  readonly year: Pillar;
  readonly month: Pillar;
  readonly day: Pillar;
  readonly hour: Pillar;
};

// All products use this boundary. No raw Solar/EightChar object escapes it.
// The +09:00 string is only a fixed rendering of an absolute instant (not the civil clock).
// Year/month: the instant against JieQi instants. Day/hour: the local solar wall clock.
export function createSajuCalendarContext(instantKst: string, policy: SajuTimePolicy = DEFAULT_SAJU_TIME_POLICY) {
  const match = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}):\d{2}\+09:00$/.exec(instantKst);
  if (!match) {
    throw new Error("Invalid KST date-time format. Expected YYYY-MM-DDTHH:mm:ss+09:00.");
  }
  const year = Number(match[1].slice(0, 4));
  if (year < 1) {
    throw new UnsupportedSolarTermYearError(year);
  }
  // Validates the calendar date first ("Invalid calendar date.") as before.
  getDayPillarFromSolarDate(match[1]);
  const solarTerm = getSolarTermContext(instantKst);
  const utcMs = Date.parse(instantKst);
  const { day, hour, solarDate, solarTime } = getDayHourPillarsFromSolarTime(solarWallClockMs(utcMs, policy), policy.ziHourRule);
  return {
    calculationVersion: SAJU_CALENDAR_VERSION,
    instantKst,
    utcOffsetMinutes: utcOffsetMinutesAt(utcMs, policy.zone),
    solarDate,
    solarTime,
    solarTimeCorrectionMinutes: solarTimeCorrectionMinutes(utcMs, policy),
    solarTermComparisonDateTime: solarTerm.comparisonDateTimeUtc8,
    pillars: { year: solarTerm.year, month: solarTerm.month, day, hour },
  };
}

// Kept for existing server callers; returns the same canonical policy.
export function getLunarJavascriptPillarsFromSolarDateTime(
  instantKst: string,
): LunarJavascriptPillarSet {
  return createSajuCalendarContext(instantKst).pillars;
}
