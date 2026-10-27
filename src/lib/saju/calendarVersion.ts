// Calendar-only version; product prose, report schemas and Yun policy are separate.
export const SAJU_CALENDAR_VERSION = "saju-calendar-kst-v2" as const;
export const DAYUN_CALCULATION_VERSION = "dayun-kst-sect2-v1" as const;
export const DAYUN_ACTUAL_CYCLE_COUNT = 12;
// Versions written by the v5-lmt engine. New reports keep the versions above; these are accepted
// on read only, so returning to this code after a v5 release never strands a v5 report.
export const SAJU_CALENDAR_V5_LMT = "saju-calendar-v5-lmt" as const;
export const DAYUN_CALCULATION_V5_LMT = "dayun-utc-sect2-v2" as const;
// timeBasis.calcVersion of v5-lmt birth time contexts.
export const SAJU_CALC_VERSION_V5_LMT = "v5-lmt-2" as const;
export type SajuCalendarVersion = typeof SAJU_CALENDAR_VERSION | typeof SAJU_CALENDAR_V5_LMT;

const readableCalendarVersions: readonly string[] = [SAJU_CALENDAR_VERSION, SAJU_CALENDAR_V5_LMT];
const readableDayunVersions: readonly string[] = [DAYUN_CALCULATION_VERSION, DAYUN_CALCULATION_V5_LMT];
const readableCalcVersionIds: readonly string[] = [SAJU_CALC_VERSION_V5_LMT];
// Read paths accept every known stored version; new generation must use the current one.
export function isReadableSajuCalendarVersion(value: unknown): value is SajuCalendarVersion {
  return typeof value === "string" && readableCalendarVersions.includes(value);
}
export function isReadableDayunCalculationVersion(value: unknown): boolean {
  return typeof value === "string" && readableDayunVersions.includes(value);
}

// Calculation versions anywhere in a stored snapshot that this code does not know. Any value
// means a newer engine wrote it: readers keep the snapshot instead of quarantining it.
export function unknownCalculationVersions(snapshot: unknown): string[] {
  const unknown = new Set<string>();
  const visit = (value: unknown, key: string) => {
    if (Array.isArray(value)) { value.forEach((item) => visit(item, key)); return; }
    if (value !== null && typeof value === "object") {
      for (const [k, v] of Object.entries(value)) visit(v, k);
      return;
    }
    if (typeof value !== "string" || !/version$/iu.test(key)) return;
    if (key === "calcVersion" ? !readableCalcVersionIds.includes(value)
      : value.startsWith("saju-calendar-") ? !isReadableSajuCalendarVersion(value)
      : value.startsWith("dayun-") && !isReadableDayunCalculationVersion(value)) unknown.add(value);
  };
  visit(snapshot, "");
  return [...unknown];
}
