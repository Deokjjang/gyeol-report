// Time policy for the v5-lmt calendar. Birthplace is not collected (docs/ssot/04_TECH_SPEC.md),
// so the longitude defaults to Seoul. Every field is recorded in BirthTimeCalculationContext.timeBasis.
export type ZiHourRule = "unified" | "split";
export type SajuTimePolicy = {
  readonly zone: "Asia/Seoul";
  readonly longitude: number;
  readonly longitudeSource: "default-seoul";
  // unified: the day changes at 23:00 solar time. split: 야자시(23시대, next day's 子 stem) / 조자시.
  readonly ziHourRule: ZiHourRule;
  // Apparent solar time (equation of time). Off by default; local mean solar time only.
  readonly equationOfTime: boolean;
};
export const DEFAULT_SAJU_TIME_POLICY: SajuTimePolicy = Object.freeze({
  zone: "Asia/Seoul",
  longitude: 126.98,
  longitudeSource: "default-seoul",
  ziHourRule: "unified",
  equationOfTime: false,
});
