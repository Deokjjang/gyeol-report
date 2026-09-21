import { SAJU_CALENDAR_VERSION } from "../saju/calendarVersion";
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
export function publicationBirthTimeContexts(evidence: unknown): BirthTimeContexts | null {
  if (!record(evidence) || evidence.calendarVersion !== SAJU_CALENDAR_VERSION || !record(evidence.birthTimeContexts)) return null;
  const contexts = evidence.birthTimeContexts;
  const roles = evidence.productType === "saju_mbti_compatibility" ? ["personA", "personB"] : ["person"];
  if (Object.keys(contexts).length !== roles.length) return null;
  for (const role of roles) {
    const context = contexts[role];
    if (!record(context) || context.calendarVersion !== SAJU_CALENDAR_VERSION ||
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
    if (precision === "approximate") {
      if (!slot || start !== midnight + slot.startMinute * 60_000 || end !== midnight + slot.endMinute * 60_000) return null;
    } else if (context.approximateBirthTimeSlot !== undefined) return null;
    if (precision === "unknown" && (start !== midnight || end !== midnight + 86_400_000)) return null;
    if (precision === "exact" && (start < midnight || start >= midnight + 86_400_000 || end !== start + 60_000)) return null;
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
