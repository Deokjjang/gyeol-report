// Independent manseryeok oracle for tests. It must not import src/lib/saju: every rule is
// re-derived from public facts so the engine and the oracle can disagree.
//   civil time -> UTC : Node ICU tzdata for Asia/Seoul (no offsets written in code)
//   day pillar        : Julian Day Number, (JDN + 49) mod 60 (0 = 甲子)
//   year / month      : apparent solar longitude from astronomy-engine (立春 315°, a 節 every 30°)
//   hour pillar       : local mean solar time = UTC + longitude / 15 h, 五鼠遁 stems
//   lunar date        : KST (135°E) date of the new moon starts a month; months are numbered by 中氣
import * as Astronomy from "astronomy-engine";

export const STEMS = [..."甲乙丙丁戊己庚辛壬癸"];
export const BRANCHES = [..."子丑寅卯辰巳午未申酉戌亥"];
const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const mod = (value: number, modulo: number) => ((value % modulo) + modulo) % modulo;
export const ganji = (index: number) => STEMS[mod(index, 10)] + BRANCHES[mod(index, 12)];
const isoDate = (wallMs: number) => new Date(wallMs).toISOString().slice(0, 10);

// a) Civil time. The wall clock is read field by field (not the engine's offset string).
const seoulFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Seoul", hourCycle: "h23",
  year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric",
});

export function seoulWallClockMs(utcMs: number): number {
  const field = Object.fromEntries(seoulFormatter.formatToParts(new Date(utcMs)).map((part) => [part.type, Number(part.value)]));
  return Date.UTC(field.year, field.month - 1, field.day, field.hour, field.minute, field.second);
}

export function seoulOffsetMinutes(utcMs: number): number {
  const whole = utcMs - mod(utcMs, 1000);
  return (seoulWallClockMs(whole) - whole) / MINUTE;
}

export type OracleInstant = { utcMs: number; offsetMinutes: number; kind: "normal" | "ambiguous" | "nonexistent" };

// Policy shared with the engine (docs/manseryeok-policy.md §1.1): a skipped wall time uses the offset
// before the transition; a repeated one uses the earlier instant.
export function civilToUtc(date: string, time: string): OracleInstant {
  const wall = Date.parse(`${date}T${time}:00Z`);
  const guess = wall - 9 * HOUR;
  const offsets = new Set([-2 * DAY, 0, 2 * DAY].map((shift) => seoulOffsetMinutes(guess + shift)));
  const hits = [...offsets].map((offset) => wall - offset * MINUTE).filter((utcMs) => seoulWallClockMs(utcMs) === wall).sort((a, b) => a - b);
  if (hits.length === 0) {
    const before = seoulOffsetMinutes(guess - 2 * DAY);
    return { utcMs: wall - before * MINUTE, offsetMinutes: before, kind: "nonexistent" };
  }
  return { utcMs: hits[0], offsetMinutes: seoulOffsetMinutes(hits[0]), kind: hits.length > 1 ? "ambiguous" : "normal" };
}

// b) Day pillar (Fliegel–Van Flandern Gregorian JDN).
export function julianDayNumber(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

export function dayCycleIndex(date: string): number {
  const [year, month, day] = date.split("-").map(Number);
  return mod(julianDayNumber(year, month, day) + 49, 60);
}

// c) Hour pillar on a solar (or any) wall clock read with getUTC*.
export type ZiRule = "unified" | "split";
export const meanSolarWallClockMs = (utcMs: number, longitude: number) => utcMs + Math.round(longitude * 240) * 1000;

// unified: 23:00 starts the next day (day pillar and 子 stem). split: 23시대 keeps the day pillar but
// takes the next day's 子 stem (야자시); 00시대 is the new day's 子 hour (조자시).
export function dayHourPillars(wallMs: number, rule: ZiRule): { day: string; hour: string } {
  const today = dayCycleIndex(isoDate(wallMs));
  const hour = new Date(wallMs).getUTCHours();
  const late = hour === 23;
  const day = late && rule === "unified" ? today + 1 : today;
  const stemDay = late ? today + 1 : today;
  const branch = Math.floor(((hour + 1) % 24) / 2);
  return { day: ganji(day), hour: STEMS[mod(mod(stemDay, 5) * 2 + branch, 10)] + BRANCHES[branch] };
}

// d) Year and month pillars from the apparent solar longitude (true equinox of date).
export const sunLongitude = (utcMs: number) => Astronomy.SunPosition(new Date(utcMs)).elon;

export function yearMonthPillars(utcMs: number): { year: string; month: string } {
  const monthFromYin = Math.floor(mod(sunLongitude(utcMs) - 315, 360) / 30);
  const utc = new Date(utcMs);
  // Before 立春 in January/February the sun is still in 子 or 丑 month of the previous year.
  const solarYear = utc.getUTCMonth() < 6 && monthFromYin >= 10 ? utc.getUTCFullYear() - 1 : utc.getUTCFullYear();
  const yearIndex = mod(solarYear - 4, 60);
  return { year: ganji(yearIndex), month: STEMS[mod(mod(yearIndex, 5) * 2 + 2 + monthFromYin, 10)] + BRANCHES[mod(monthFromYin + 2, 12)] };
}

// Instant (UTC ms) when the apparent solar longitude reaches `longitude`, searching forward from `fromMs`.
export function sunLongitudeInstant(longitude: number, fromMs: number, limitDays = 40): number {
  const time = Astronomy.SearchSunLongitude(mod(longitude, 360), new Date(fromMs), limitDays);
  if (!time) throw new Error(`No solar longitude ${longitude} within ${limitDays} days.`);
  return time.date.getTime();
}

// The 節 instants before and after a moment.
export function surroundingJie(utcMs: number): { previous: number; next: number } {
  const target = 315 + 30 * Math.floor(mod(sunLongitude(utcMs) - 315, 360) / 30);
  return { previous: sunLongitudeInstant(target, utcMs - 35 * DAY), next: sunLongitudeInstant(target + 30, utcMs) };
}

// All 24 term instants (every 15°) whose instant falls in the Gregorian year (UTC).
export function solarTermsOfYear(year: number): { longitude: number; utcMs: number }[] {
  const terms: { longitude: number; utcMs: number }[] = [];
  let from = Date.UTC(year, 0, 1);
  const end = Date.UTC(year + 1, 0, 1);
  // 小寒 (285°) is the first term of every Gregorian year.
  for (let longitude = 285; ; longitude += 15) {
    const utcMs = sunLongitudeInstant(longitude, from, 20);
    if (utcMs >= end) break;
    terms.push({ longitude: mod(longitude, 360), utcMs });
    from = utcMs + DAY;
  }
  return terms;
}

// Four pillars for an exact civil time under a longitude and 子 rule ("年 月 日 時").
export function exactPillars(date: string, time: string, options: { longitude: number; rule: ZiRule }): string {
  const instant = civilToUtc(date, time);
  const { year, month } = yearMonthPillars(instant.utcMs);
  const { day, hour } = dayHourPillars(meanSolarWallClockMs(instant.utcMs, options.longitude), options.rule);
  return [year, month, day, hour].join(" ");
}

// Settings other Korean 만세력 apps commonly use, for "the result changes in app X" columns.
// tz-aware: civil time goes through tzdata. naive: the typed time is read as +09:00 for everything.
export type AppSetting = { id: string; label: string; rule: ZiRule; kind: "tz-aware" | "naive"; correctionMinutes: number; longitude?: number };
export const APP_SETTINGS: readonly AppSetting[] = [
  { id: "ours", label: "우리 기준(-30, 통자시)", rule: "unified", kind: "tz-aware", correctionMinutes: 0, longitude: 127.5 },
  { id: "ours-split", label: "-30 야자시/조자시", rule: "split", kind: "tz-aware", correctionMinutes: 0, longitude: 127.5 },
  { id: "m32", label: "-32(서울 126.98°E)", rule: "unified", kind: "tz-aware", correctionMinutes: 0, longitude: 126.98 },
  { id: "m32-split", label: "-32 야자시/조자시", rule: "split", kind: "tz-aware", correctionMinutes: 0, longitude: 126.98 },
  { id: "fixed30", label: "-30 고정(서머타임·UTC+8:30 미반영)", rule: "unified", kind: "naive", correctionMinutes: -30 },
  { id: "fixed30-split", label: "-30 고정 야자시/조자시", rule: "split", kind: "naive", correctionMinutes: -30 },
  { id: "none", label: "보정 없음(입력 시각 그대로)", rule: "unified", kind: "naive", correctionMinutes: 0 },
  { id: "none-split", label: "보정 없음 야자시/조자시", rule: "split", kind: "naive", correctionMinutes: 0 },
];

export function pillarsUnderSetting(date: string, time: string, setting: AppSetting): string {
  if (setting.kind === "tz-aware") return exactPillars(date, time, { longitude: setting.longitude!, rule: setting.rule });
  const wall = Date.parse(`${date}T${time}:00Z`);
  const { year, month } = yearMonthPillars(wall - 9 * HOUR);
  const { day, hour } = dayHourPillars(wall + setting.correctionMinutes * MINUTE, setting.rule);
  return [year, month, day, hour].join(" ");
}

// e) Lunar date -> solar date (Korean calendar: month starts on the KST date of the new moon).
// Limits: a month holding two 中氣, or a 無中氣 month that is not the leap month, is not handled.
const kstDate = (utcMs: number) => isoDate(utcMs + 9 * HOUR);
const daysBetween = (from: string, to: string) => Math.round((Date.parse(to) - Date.parse(from)) / DAY);

function monthStartOn(dateOrBefore: string, aroundMs: number): { start: string; next: string } {
  let newMoon = Astronomy.SearchMoonPhase(0, new Date(aroundMs - 35 * DAY), 40)!;
  let start = "";
  for (;;) {
    const date = kstDate(newMoon.date.getTime());
    if (date > dateOrBefore) return { start, next: date };
    start = date;
    newMoon = Astronomy.SearchMoonPhase(0, new Date(newMoon.date.getTime() + DAY), 40)!;
  }
}

export class OracleLunarDateError extends Error {}

export function lunarToSolar(lunarDate: string, isLeapMonth: boolean): string {
  const [year, month, day] = lunarDate.split("-").map(Number);
  // Lunar month m holds the 中氣 at 330° + 30°(m-1): 1월 雨水, 2월 春分 ... 11월 冬至, 12월 大寒.
  const longitude = 330 + 30 * (month - 1);
  const principal = sunLongitudeInstant(longitude, Date.UTC(month === 12 ? year + 1 : year, 0, 1), 370);
  let { start, next } = monthStartOn(kstDate(principal), principal);
  if (isLeapMonth) {
    const following = monthStartOn(next, Date.parse(next) + 2 * DAY);
    // A leap month is the month right after, holding no 中氣.
    if (kstDate(sunLongitudeInstant(longitude + 30, principal + DAY)) < following.next) throw new OracleLunarDateError(lunarDate);
    ({ start, next } = following);
  }
  if (day < 1 || day > daysBetween(start, next)) throw new OracleLunarDateError(lunarDate);
  return isoDate(Date.parse(start) + (day - 1) * DAY);
}
