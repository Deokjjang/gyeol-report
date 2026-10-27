import type { SajuTimePolicy } from "./calcPolicy";

// The only place where civil time, UTC and solar time are converted.
// Standard-time and summer-time history comes from the runtime IANA tzdata, never from constants.
const MINUTE = 60_000;
const DAY = 1440 * MINUTE;
const formatters = new Map<string, Intl.DateTimeFormat>();

function offsetFormatter(zone: string): Intl.DateTimeFormat {
  let formatter = formatters.get(zone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat("en-US", { timeZone: zone, timeZoneName: "longOffset" });
    formatters.set(zone, formatter);
  }
  return formatter;
}

// Minutes east of UTC (seconds kept as a fraction for pre-1908 LMT offsets).
export function utcOffsetMinutesAt(utcMs: number, zone: string): number {
  const name = offsetFormatter(zone).formatToParts(new Date(utcMs)).find((part) => part.type === "timeZoneName")?.value;
  if (name === "GMT") return 0;
  const match = /^GMT([+-])(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(name ?? "");
  if (!match) throw new Error(`Unsupported time zone offset: ${name}`);
  const [, sign, hours, minutes, seconds] = match;
  const value = Number(hours) * 60 + Number(minutes) + Number(seconds ?? 0) / 60;
  return sign === "-" ? -value : value;
}

// Civil wall clock read as if it were UTC; years 1-9999 without the Date.UTC two-digit-year quirk.
export function civilWallClockMs(date: string, time: string): number {
  const ms = Date.parse(`${date}T${time}:00Z`);
  if (!Number.isFinite(ms)) throw new Error("Invalid civil date-time.");
  return ms;
}

export type CivilInstant = {
  readonly utcMs: number;
  readonly utcOffsetMinutes: number;
  // Summer-time end repeats a wall-clock hour; the earlier (summer-time) instant is used.
  readonly ambiguous: boolean;
  // Summer-time start (or 1961-08-10) skips a wall-clock range; the pre-transition offset is used.
  readonly nonexistent: boolean;
};

export function civilToUtc(date: string, time: string, zone: string): CivilInstant {
  const wall = civilWallClockMs(date, time);
  // Korean transitions are months apart, so the offsets one day either side bracket any transition.
  const before = utcOffsetMinutesAt(wall - DAY, zone);
  const after = utcOffsetMinutesAt(wall + DAY, zone);
  const valid = [...new Set([before, after])]
    .map((offset) => wall - offset * MINUTE)
    .filter((utcMs) => Math.abs(civilWallClockOf(utcMs, zone) - wall) < 1000)
    .sort((a, b) => a - b);
  if (valid.length === 0) {
    const utcMs = wall - before * MINUTE;
    return { utcMs, utcOffsetMinutes: before, ambiguous: false, nonexistent: true };
  }
  const utcMs = valid[0];
  return { utcMs, utcOffsetMinutes: utcOffsetMinutesAt(utcMs, zone), ambiguous: valid.length > 1, nonexistent: false };
}

function civilWallClockOf(utcMs: number, zone: string): number {
  return utcMs + utcOffsetMinutesAt(utcMs, zone) * MINUTE;
}

// NOAA (Spencer) equation of time in minutes; apparent minus mean solar time.
export function equationOfTimeMinutes(utcMs: number): number {
  const date = new Date(utcMs);
  const yearStart = new Date(0);
  yearStart.setUTCFullYear(date.getUTCFullYear(), 0, 1);
  yearStart.setUTCHours(0, 0, 0, 0);
  const dayOfYear = Math.floor((utcMs - yearStart.getTime()) / DAY);
  const hour = date.getUTCHours() + date.getUTCMinutes() / 60;
  const gamma = (2 * Math.PI / 365) * (dayOfYear + (hour - 12) / 24);
  return 229.18 * (0.000075 + 0.001868 * Math.cos(gamma) - 0.032077 * Math.sin(gamma)
    - 0.014615 * Math.cos(2 * gamma) - 0.040849 * Math.sin(2 * gamma));
}

// Solar-time offset from UTC in minutes: longitude/15 hours, plus the equation of time if enabled.
export function solarOffsetMinutesAt(utcMs: number, policy: SajuTimePolicy): number {
  return policy.longitude * 4 + (policy.equationOfTime ? equationOfTimeMinutes(utcMs) : 0);
}

// Whole seconds, so instants survive the second-precision +09:00 renderings used across the engine.
function solarOffsetMs(utcMs: number, policy: SajuTimePolicy): number {
  return Math.round(solarOffsetMinutesAt(utcMs, policy) * 60) * 1000;
}

// Solar wall clock as an epoch number: read it with getUTC* only.
export function solarWallClockMs(utcMs: number, policy: SajuTimePolicy): number {
  return utcMs + solarOffsetMs(utcMs, policy);
}

// Inverse of solarWallClockMs for a solar wall clock (two fixed-point steps cover the equation of time).
export function utcFromSolarWallClockMs(solarMs: number, policy: SajuTimePolicy): number {
  let utcMs = solarMs - Math.round(policy.longitude * 240) * 1000;
  for (let i = 0; i < 2; i++) utcMs = solarMs - solarOffsetMs(utcMs, policy);
  return utcMs;
}

// Solar time minus civil time, in minutes (negative = the clock runs ahead of the sun).
export function solarTimeCorrectionMinutes(utcMs: number, policy: SajuTimePolicy): number {
  return solarOffsetMinutesAt(utcMs, policy) - utcOffsetMinutesAt(utcMs, policy.zone);
}
