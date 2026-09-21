import { SAJU_CALENDAR_VERSION } from "./calendarVersion";
import { getDayPillarFromSolarDate, getHourPillarFromBirthTime } from "./pillars";
import { getSolarTermContext, UnsupportedSolarTermYearError } from "./solarTerms";
import type { Pillar } from "./types";

export type LunarJavascriptPillarSet = {
  readonly year: Pillar;
  readonly month: Pillar;
  readonly day: Pillar;
  readonly hour: Pillar;
};

// All products use this boundary. No raw Solar/EightChar object escapes it.
export function createSajuCalendarContext(solarDateTimeKst: string) {
  const match = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}):\d{2}\+09:00$/.exec(solarDateTimeKst);
  if (!match) {
    throw new Error("Invalid KST date-time format. Expected YYYY-MM-DDTHH:mm:ss+09:00.");
  }
  const [, solarDate, civilTime] = match;
  const year = Number(solarDate.slice(0, 4));
  if (year < 1) {
    throw new UnsupportedSolarTermYearError(year);
  }
  const day = getDayPillarFromSolarDate(solarDate);
  const hour = getHourPillarFromBirthTime(civilTime, day.stem);
  const solarTerm = getSolarTermContext(solarDateTimeKst);
  return {
    calculationVersion: SAJU_CALENDAR_VERSION,
    solarDateTimeKst,
    solarDate,
    civilTime,
    fixedOffsetMinutes: 540 as const,
    solarTermComparisonDateTime: solarTerm.comparisonDateTimeUtc8,
    pillars: { year: solarTerm.year, month: solarTerm.month, day, hour },
  };
}

// Kept for existing server callers; returns the same canonical V1 policy.
export function getLunarJavascriptPillarsFromSolarDateTime(
  solarDateTimeKst: string,
): LunarJavascriptPillarSet {
  return createSajuCalendarContext(solarDateTimeKst).pillars;
}
