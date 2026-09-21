import { SAJU_CALENDAR_VERSION } from "./calendarVersion";
import { createSajuCalendarContext } from "./lunarJavascriptPillars";
import { getSolarTermInstants } from "./solarTerms";
import { HOUR_BRANCH_RANGES } from "./constants";
import {
  BIRTH_TIME_SLOT_DEFINITIONS, PILLAR_KEYS, normalizeBirthTimePrecision,
  type BirthTimeInput, type BirthTimeCalculationContext,
} from "./birthTimePrecisionTypes";

const MINUTE = 60_000;
const DAY = 1440 * MINUTE;
function kst(ms: number) {
  return new Date(ms + 9 * 60 * MINUTE).toISOString().slice(0, 19) + "+09:00";
}
export class UncertainBirthTimeError extends Error {
  constructor(readonly context: BirthTimeCalculationContext) {
    super("출생시간 범위에 따라 원국이 달라집니다. 시간을 더 구체적으로 확인해 주세요.");
    this.name = "UncertainBirthTimeError";
  }
}
export function resolveBirthTimeCalculation(input: BirthTimeInput & { birthDate: string }): BirthTimeCalculationContext {
  const parsed = normalizeBirthTimePrecision(input);
  if (!parsed.ok) throw new Error("출생시간 입력을 확인해 주세요.");
  // Also validates the civil date without host-local timezone parsing.
  const exact = parsed.precision === "exact";
  const anchor = createSajuCalendarContext(`${input.birthDate}T${exact ? parsed.time : "00:00"}:00+09:00`);
  const midnight = Date.parse(`${input.birthDate}T00:00:00+09:00`);
  const slot = BIRTH_TIME_SLOT_DEFINITIONS.find((value) => value.value === parsed.slot);
  const start = exact ? Date.parse(anchor.solarDateTimeKst) : midnight + (slot?.startMinute ?? 0) * MINUTE;
  const end = exact ? start + MINUTE : midnight + (slot?.endMinute ?? 1440) * MINUTE;
  const contexts = [anchor];
  if (!exact) {
    contexts.length = 0;
    const points = new Set([start, end - 1000]);
    // All pillars can change only at a JieQi instant, KST midnight or hour branch boundary.
    // Include both sides of each event (second precision), not a representative minute.
    for (let date = midnight - DAY; date < end; date += DAY) {
      for (const hour of [0, ...HOUR_BRANCH_RANGES.map((range) => range.startHour)]) {
        const event = date + hour * 60 * MINUTE;
        if (event > start && event < end) { points.add(event - 1000); points.add(event); }
      }
    }
    for (const event of getSolarTermInstants(kst(start), kst(end - 1000))) {
      if (event > start && event < end) { points.add(event - 1000); points.add(event); }
    }
    for (const point of [...points].sort((a, b) => a - b)) contexts.push(createSajuCalendarContext(kst(point)));
  }
  const result: BirthTimeCalculationContext = {
    calendarVersion: SAJU_CALENDAR_VERSION, birthTimePrecision: parsed.precision, birthDate: input.birthDate,
    ...(slot ? { approximateBirthTimeSlot: slot.value } : {}),
    range: { startKst: kst(start), endKstExclusive: kst(end) },
    stable: { year: false, month: false, day: false, hour: false },
    candidates: { year: [], month: [], day: [], hour: [] }, confirmed: {},
  };
  for (const key of PILLAR_KEYS) {
    const unique = new Map(contexts.map((context) => {
      const pillar = context.pillars[key];
      return [pillar.stem + pillar.branch, pillar];
    }));
    result.candidates[key] = [...unique.values()];
    result.stable[key] = unique.size === 1 && !(key === "hour" && parsed.precision === "unknown");
    if (result.stable[key]) result.confirmed[key] = result.candidates[key][0];
  }
  return result;
}
