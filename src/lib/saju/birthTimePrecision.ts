import { SAJU_CALENDAR_VERSION, SAJU_CALC_VERSION_ID } from "./calendarVersion";
import { DEFAULT_SAJU_TIME_POLICY, withBirthLongitude, type SajuTimePolicy } from "./calcPolicy";
import { createSajuCalendarContext } from "./lunarJavascriptPillars";
import { getDayPillarFromSolarDate } from "./pillars";
import { civilToUtc, solarTimeCorrectionMinutes, solarWallClockMs, utcFromSolarWallClockMs } from "./solarTime";
import { getSolarTermInstants } from "./solarTerms";
import {
  BIRTH_TIME_SLOT_DEFINITIONS, PILLAR_KEYS, normalizeBirthTimePrecision,
  type BirthTimeInput, type BirthTimeCalculationContext,
} from "./birthTimePrecisionTypes";

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 1440 * MINUTE;
function kst(ms: number) {
  return new Date(ms + 9 * 60 * MINUTE).toISOString().slice(0, 19) + "+09:00";
}
function nextDate(date: string) {
  return new Date(Date.parse(`${date}T00:00:00Z`) + DAY).toISOString().slice(0, 10);
}
export class UncertainBirthTimeError extends Error {
  constructor(readonly context: BirthTimeCalculationContext) {
    super("출생시간 범위에 따라 원국이 달라집니다. 시간을 더 구체적으로 확인해 주세요.");
    this.name = "UncertainBirthTimeError";
  }
}
// exact: civil time -> UTC (IANA history). approximate: the slot is a solar-time 시진.
// unknown: the civil day; the day pillar is the typed date and no hour pillar is made.
// A birthplace longitude in the input replaces the policy longitude.
export function resolveBirthTimeCalculation(
  input: BirthTimeInput & { birthDate: string },
  basePolicy: SajuTimePolicy = DEFAULT_SAJU_TIME_POLICY,
): BirthTimeCalculationContext {
  const parsed = normalizeBirthTimePrecision(input);
  if (!parsed.ok) throw new Error("출생시간 입력을 확인해 주세요.");
  const policy = withBirthLongitude(basePolicy, input.birthLongitude);
  // Also validates the civil date without host-local timezone parsing.
  createSajuCalendarContext(`${input.birthDate}T00:00:00+09:00`, policy);
  const slot = BIRTH_TIME_SLOT_DEFINITIONS.find((value) => value.value === parsed.slot);
  const civil = civilToUtc(input.birthDate, parsed.precision === "exact" ? parsed.time : "00:00", policy.zone);
  let start = civil.utcMs;
  let end = start + MINUTE;
  if (parsed.precision === "approximate" && slot) {
    const solarMidnight = Date.parse(`${input.birthDate}T00:00:00Z`);
    start = utcFromSolarWallClockMs(solarMidnight + slot.startMinute * MINUTE, policy);
    end = utcFromSolarWallClockMs(solarMidnight + slot.endMinute * MINUTE, policy);
  } else if (parsed.precision === "unknown") {
    end = civilToUtc(nextDate(input.birthDate), "00:00", policy.zone).utcMs;
  }
  const points = new Set([start, end - 1000]);
  if (parsed.precision !== "exact") {
    // All pillars can change only at a JieQi instant or a solar-time whole hour (day and 時 boundaries).
    // Include both sides of each event (second precision), not a representative minute.
    const firstHour = Math.ceil(solarWallClockMs(start, policy) / HOUR) * HOUR;
    for (let mark = firstHour; mark < solarWallClockMs(end, policy); mark += HOUR) {
      const event = utcFromSolarWallClockMs(mark, policy);
      if (event > start && event < end) { points.add(event - 1000); points.add(event); }
    }
    for (const event of getSolarTermInstants(kst(start), kst(end - 1000))) {
      if (event > start && event < end) { points.add(event - 1000); points.add(event); }
    }
  }
  const contexts = [...points].sort((a, b) => a - b).map((point) => createSajuCalendarContext(kst(point), policy));
  if (parsed.precision === "exact") contexts.length = 1;
  const result: BirthTimeCalculationContext = {
    calendarVersion: SAJU_CALENDAR_VERSION, birthTimePrecision: parsed.precision, birthDate: input.birthDate,
    ...(slot ? { approximateBirthTimeSlot: slot.value } : {}),
    range: { startKst: kst(start), endKstExclusive: kst(end) },
    stable: { year: false, month: false, day: false, hour: false },
    candidates: { year: [], month: [], day: [], hour: [] }, confirmed: {},
    timeBasis: {
      calcVersion: SAJU_CALC_VERSION_ID, zone: policy.zone,
      civilDateTime: parsed.precision === "exact" ? `${input.birthDate}T${parsed.time}` : input.birthDate,
      utcOffsetMinutes: contexts[0].utcOffsetMinutes, ambiguous: civil.ambiguous && parsed.precision === "exact",
      nonexistent: civil.nonexistent && parsed.precision === "exact",
      longitude: policy.longitude, longitudeSource: policy.longitudeSource, equationOfTime: policy.equationOfTime,
      ziHourRule: policy.ziHourRule,
      solarTimeCorrectionMinutes: Math.round(solarTimeCorrectionMinutes(start, policy) * 100) / 100,
      slotBasis: policy.equationOfTime ? "apparent_solar" : "local_mean_solar",
    },
  };
  for (const key of PILLAR_KEYS) {
    // Unknown time has no solar-time boundary to anchor; the typed civil date is the day pillar.
    const pillars = key === "day" && parsed.precision === "unknown"
      ? [getDayPillarFromSolarDate(input.birthDate)]
      : contexts.map((context) => context.pillars[key]);
    const unique = new Map(pillars.map((pillar) => [pillar.stem + pillar.branch, pillar]));
    result.candidates[key] = [...unique.values()];
    result.stable[key] = unique.size === 1 && !(key === "hour" && parsed.precision === "unknown");
    if (result.stable[key]) result.confirmed[key] = result.candidates[key][0];
  }
  return result;
}
