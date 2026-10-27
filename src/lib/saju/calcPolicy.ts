// Time policy for the v5-lmt calendar. The intake form does not collect a birthplace
// (docs/ssot/04_TECH_SPEC.md), so the longitude defaults to 127.5°E (KST - 30 minutes, the Korean
// 만세력 convention). A birthplace longitude in the input replaces it (withBirthLongitude).
// Every field is recorded in BirthTimeCalculationContext.timeBasis.
export type ZiHourRule = "unified" | "split";
export type LongitudeSource = "default-127.5" | "birthplace";
export type SajuTimePolicy = {
  readonly zone: "Asia/Seoul";
  readonly longitude: number;
  readonly longitudeSource: LongitudeSource;
  // unified: the day changes at 23:00 solar time. split: 야자시(23시대, next day's 子 stem) / 조자시.
  readonly ziHourRule: ZiHourRule;
  // Apparent solar time (equation of time). Off by default; local mean solar time only.
  readonly equationOfTime: boolean;
};
export const DEFAULT_SAJU_TIME_POLICY: SajuTimePolicy = Object.freeze({
  zone: "Asia/Seoul",
  longitude: 127.5,
  longitudeSource: "default-127.5",
  ziHourRule: "unified",
  equationOfTime: false,
});
// The zone is fixed to Asia/Seoul, so a birthplace must lie within Korean longitudes.
export const BIRTH_LONGITUDE_RANGE = Object.freeze({ min: 124, max: 132 });

export class InvalidBirthLongitudeError extends Error {
  constructor() {
    super("출생지 경도를 확인해 주세요.");
    this.name = "InvalidBirthLongitudeError";
  }
}

// No birthLongitude keeps the policy as is; any other value must be a number within the range.
export function withBirthLongitude(policy: SajuTimePolicy, birthLongitude: unknown): SajuTimePolicy {
  if (birthLongitude === undefined || birthLongitude === null) return policy;
  if (typeof birthLongitude !== "number" || !Number.isFinite(birthLongitude) ||
      birthLongitude < BIRTH_LONGITUDE_RANGE.min || birthLongitude > BIRTH_LONGITUDE_RANGE.max) {
    throw new InvalidBirthLongitudeError();
  }
  return { ...policy, longitude: birthLongitude, longitudeSource: "birthplace" };
}
