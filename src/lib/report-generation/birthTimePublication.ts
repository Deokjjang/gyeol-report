import { SAJU_CALC_VERSION_ID, SAJU_CALENDAR_VERSION, isReadableSajuCalendarVersion } from "../saju/calendarVersion";
import { BIRTH_TIME_SLOT_DEFINITIONS, PILLAR_KEYS, type BirthTimeContexts } from "../saju/birthTimePrecisionTypes";
import { normalizeGanji } from "../report-knowledge/sajuFeatureExtractionRules";

function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function pillar(value: unknown): string | undefined {
  if (!record(value) || typeof value.stem !== "string" || typeof value.branch !== "string") return;
  return normalizeGanji(value.stem + value.branch);
}
// Validate stored calculation metadata without importing the server calendar into readers.
// Absence remains legacy; it never authorizes an incomplete four-pillar report.
// Every readable calendar version is accepted so stored reports stay readable after an engine change.
export function publicationBirthTimeContexts(evidence: unknown): BirthTimeContexts | null {
  if (!record(evidence) || !isReadableSajuCalendarVersion(evidence.calendarVersion) || !record(evidence.birthTimeContexts)) return null;
  const contexts = evidence.birthTimeContexts;
  const roles = evidence.productType === "saju_mbti_compatibility" ? ["personA", "personB"] : ["person"];
  if (Object.keys(contexts).length !== roles.length) return null;
  for (const role of roles) {
    const context = contexts[role];
    if (!record(context) || context.calendarVersion !== evidence.calendarVersion ||
      !["exact", "approximate", "unknown"].includes(String(context.birthTimePrecision)) ||
      !record(context.stable) || !record(context.confirmed) || !record(context.candidates) || !record(context.range)) return null;
    const precision = roles.length === 1 ? evidence.birthTimePrecision
      : record(evidence.birthTimePrecision) ? evidence.birthTimePrecision[role] : undefined;
    if (precision !== context.birthTimePrecision) return null;
    if (typeof context.birthDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/u.test(context.birthDate) ||
      typeof context.range.startKst !== "string" || typeof context.range.endKstExclusive !== "string" ||
      !context.range.startKst.endsWith("+09:00") || !context.range.endKstExclusive.endsWith("+09:00")) return null;
    const midnight = Date.parse(context.birthDate + "T00:00:00+09:00");
    const start = Date.parse(context.range.startKst);
    const end = Date.parse(context.range.endKstExclusive);
    if (![midnight, start, end].every(Number.isFinite)) return null;
    const slot = BIRTH_TIME_SLOT_DEFINITIONS.find((s) => s.value === context.approximateBirthTimeSlot);
    if (context.calendarVersion === SAJU_CALENDAR_VERSION) {
      if (!validCurrentRange(context, precision, slot, midnight, start, end)) return null;
    } else if (!validLegacyRange(context, precision, slot, midnight, start, end)) return null;
    for (const key of PILLAR_KEYS) {
      const candidates = context.candidates[key];
      if (!Array.isArray(candidates) || candidates.length === 0 || candidates.some((p) => !pillar(p))) return null;
      if (key === "hour" && precision === "unknown") {
        if (context.stable.hour !== false || context.confirmed.hour !== undefined) return null;
      } else if (context.stable[key] !== true || candidates.length !== 1 ||
        !pillar(context.confirmed[key]) || pillar(context.confirmed[key]) !== pillar(candidates[0])) return null;
    }
  }
  return contexts as BirthTimeContexts;
}

export function publishedPillarMatches(value: unknown, expected: unknown): boolean {
  return typeof value === "string" && normalizeGanji(value.replace(/일주$/u, "")) === pillar(expected);
}

export function birthTimePromptContext(evidence: unknown) {
  const contexts = publicationBirthTimeContexts(evidence);
  if (!contexts) return {};
  return { birthTimeCalculation: {
    rule: "확정된 기둥만 해석 근거로 사용합니다. 대략적인 시간대를 정확한 출생시각으로 표현하거나, 미확정 시주와 시주 의존 특징을 추정하지 않습니다.",
    people: Object.fromEntries(Object.entries(contexts).map(([role, context]) => [role, {
      precision: context.birthTimePrecision, range: context.range,
      stable: context.stable, confirmedPillars: context.confirmed,
    }])),
  } };
}

// v5-lmt: the range is an absolute instant; slots are solar-time 시진 and the civil input lives in timeBasis.
function validCurrentRange(context: Record<string, unknown>, precision: unknown, slot: { startMinute: number; endMinute: number } | undefined,
  midnight: number, start: number, end: number): boolean {
  const basis = context.timeBasis;
  if (!record(basis) || basis.calcVersion !== SAJU_CALC_VERSION_ID || typeof basis.civilDateTime !== "string" ||
    typeof basis.solarTimeCorrectionMinutes !== "number" || typeof basis.utcOffsetMinutes !== "number") return false;
  const near = (value: number) => Math.abs(value - midnight) <= 86_400_000 * 2;
  if (!near(start) || !near(end) || end <= start) return false;
  if (precision === "approximate") {
    return !!slot && basis.civilDateTime === context.birthDate && Math.abs(end - start - (slot.endMinute - slot.startMinute) * 60_000) <= 60_000;
  }
  if (context.approximateBirthTimeSlot !== undefined) return false;
  if (precision === "unknown") return basis.civilDateTime === context.birthDate && end - start >= 23 * 3_600_000 && end - start <= 25 * 3_600_000;
  return /^\d{4}-\d{2}-\d{2}T([01]\d|2[0-3]):[0-5]\d$/u.test(basis.civilDateTime) && basis.civilDateTime.startsWith(`${String(context.birthDate)}T`) && end === start + 60_000;
}

// saju-calendar-kst-v2: fixed +09:00 civil range, unchanged for stored reports.
function validLegacyRange(context: Record<string, unknown>, precision: unknown, slot: { startMinute: number; endMinute: number } | undefined,
  midnight: number, start: number, end: number): boolean {
  if (precision === "approximate") {
    if (!slot || start !== midnight + slot.startMinute * 60_000 || end !== midnight + slot.endMinute * 60_000) return false;
  } else if (context.approximateBirthTimeSlot !== undefined) return false;
  if (precision === "unknown" && (start !== midnight || end !== midnight + 86_400_000)) return false;
  if (precision === "exact" && (start < midnight || start >= midnight + 86_400_000 || end !== start + 60_000)) return false;
  return true;
}
