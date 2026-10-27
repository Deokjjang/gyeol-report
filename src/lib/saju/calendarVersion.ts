// Calendar-only version; product prose, report schemas and Yun policy are separate.
// v5-lmt: civil time -> UTC via IANA Asia/Seoul history; year/month/Yun by absolute instant;
// day/hour by local mean solar time. Legacy versions stay readable for stored reports only.
export const SAJU_CALENDAR_VERSION = "saju-calendar-v5-lmt" as const;
export const LEGACY_SAJU_CALENDAR_VERSIONS = ["saju-calendar-kst-v2"] as const;
export type SajuCalendarVersion = typeof SAJU_CALENDAR_VERSION | (typeof LEGACY_SAJU_CALENDAR_VERSIONS)[number];
export const DAYUN_CALCULATION_VERSION = "dayun-utc-sect2-v2" as const;
export const LEGACY_DAYUN_CALCULATION_VERSIONS = ["dayun-kst-sect2-v1"] as const;
export const DAYUN_ACTUAL_CYCLE_COUNT = 12;
// Customer-facing short id recorded on newly generated reports.
export const SAJU_CALC_VERSION_ID = "v5-lmt" as const;

const readableCalendarVersions: readonly string[] = [SAJU_CALENDAR_VERSION, ...LEGACY_SAJU_CALENDAR_VERSIONS];
const readableDayunVersions: readonly string[] = [DAYUN_CALCULATION_VERSION, ...LEGACY_DAYUN_CALCULATION_VERSIONS];
const readableCalcVersionIds: readonly string[] = [SAJU_CALC_VERSION_ID];
// Read paths accept every stored version; new generation must use the current one.
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
