/**
 * 독립 기준 계산기 (calc-audit 1-a 2부). src/** 를 하나도 가져오지 않는다.
 *
 *   시계 시각 → UTC : IANA tzdata 원문(data/tzdata-2026f-korea.zi)을 이 파일이 직접 해석한다.
 *                     런타임 Intl/ICU 시간대 자료는 쓰지 않는다(엔진은 ICU를 쓴다 — 그래서 서로 독립).
 *                     같은 해석기로 KASI 역서 이력(data/kasi-almanac-2023-korea.zi)과 「고정 +9」도 계산한다.
 *   태양시          : 평균태양시 = UTC + 경도 × 4분(균시차 없음). 엔진 기본과 같은 방식(1부 2번).
 *   일주            : 율리우스 적일(JDN, Fliegel–Van Flandern). (JDN + 49) mod 60, 0 = 甲子.
 *   시주            : 태양시의 시(時) → 지지(23·0시 子, 1·2시 丑 …), 천간은 五鼠遁. 23시대는 다음 날(통자시).
 *   년주·월주       : astronomy-engine(VSOP87 + 장동, lunar-javascript와 별개 구현) 태양 겉보기 황경.
 *                     입춘 315°, 절(節) 30°마다. 년 = 지난 입춘의 해.
 *   대운            : 순역 = 년간 음양 × 성별(양남·음녀 순행). 대운수 = 출생~절입(역행은 절입~출생) 온전한 날수 ÷ 3,
 *                     나머지 2는 올림, 0·1은 버림, 1~10으로 묶음(최종 A-3 문장 그대로 다시 구현).
 *                     교운 시각 = 출생 + (분 차이를 4320분=1년, 360분=1달, 12분=1일, 1분=2시간으로 바꾼 값).
 */
import { readFileSync } from "node:fs";
import * as Astronomy from "astronomy-engine";

export const STEMS = [..."甲乙丙丁戊己庚辛壬癸"];
export const BRANCHES = [..."子丑寅卯辰巳午未申酉戌亥"];
const SEC = 1000, MIN = 60 * SEC, HOUR = 60 * MIN, DAY = 24 * HOUR;
const mod = (v: number, m: number) => ((v % m) + m) % m;

// ───────────────────────── tzdata(zic) 해석기 ─────────────────────────
type Suffix = "w" | "s" | "u";
type Rule = { from: number; to: number; month: number; on: string; at: number; atSuffix: Suffix; save: number };
type ZoneLine = { stdoff: number; rules: string; until: { y: number; m: number; d: string; at: number; suffix: Suffix } | null };
export type Period = { startUtc: number; offsetSec: number; dst: boolean };
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function hms(text: string): number {
  if (text === "-" || text === "0") return 0;
  const sign = text.startsWith("-") ? -1 : 1;
  const [h, m = "0", s = "0"] = text.replace(/^-/, "").split(":");
  return sign * (Number(h) * 3600 + Number(m) * 60 + Number(s));
}
function timeWithSuffix(text: string): { at: number; suffix: Suffix } {
  const last = text.at(-1)!;
  if (/[wsugz]/.test(last)) return { at: hms(text.slice(0, -1)), suffix: last === "w" ? "w" : last === "s" ? "s" : "u" };
  return { at: hms(text), suffix: "w" };
}
// ON 칸: 숫자, lastSun, Sun>=8, Sat<=25
function dayOfMonth(y: number, m: number, on: string): number {
  if (/^\d+$/.test(on)) return Number(on);
  const last = /^last(\w{3})$/.exec(on);
  const rel = /^(\w{3})([<>]=)(\d+)$/.exec(on);
  const wd = (d: number) => new Date(Date.UTC(y, m, d)).getUTCDay();
  if (last) {
    const want = WEEKDAYS.indexOf(last[1]);
    for (let d = new Date(Date.UTC(y, m + 1, 0)).getUTCDate(); d > 0; d--) if (wd(d) === want) return d;
  }
  if (rel) {
    const want = WEEKDAYS.indexOf(rel[1]), base = Number(rel[3]);
    for (let k = 0; k < 7; k++) { const d = rel[2] === ">=" ? base + k : base - k; if (wd(d) === want) return d; }
  }
  throw new Error(`ON ${on}`);
}
const localSec = (y: number, m: number, d: number, at: number) => Date.UTC(y, m, d) / SEC + at;

export function parseZic(text: string, zoneName = "Asia/Seoul"): Period[] {
  const rules = new Map<string, Rule[]>();
  const zone: ZoneLine[] = [];
  let inZone = false;
  for (const raw of text.split("\n")) {
    const line = raw.replace(/#.*/, "");
    if (!line.trim()) continue;
    const f = line.trim().split(/\s+/);
    if (f[0] === "Rule") {
      inZone = false;
      const [, name, from, to, , inMonth, on, at, save] = f;
      const t = timeWithSuffix(at);
      const list = rules.get(name) ?? [];
      list.push({ from: Number(from), to: to === "only" ? Number(from) : to === "max" ? 2100 : Number(to),
        month: MONTHS.indexOf(inMonth), on, at: t.at, atSuffix: t.suffix, save: hms(save) });
      rules.set(name, list);
      continue;
    }
    let cols: string[];
    if (f[0] === "Zone") { inZone = f[1] === zoneName; cols = f.slice(2); } else if (inZone && /^\s/.test(raw)) cols = f; else { inZone = false; continue; }
    if (!inZone) continue;
    const [stdoff, ruleName, , ...until] = cols;
    let u: ZoneLine["until"] = null;
    if (until.length) {
      const t = timeWithSuffix(until[3] ?? "0:00");
      u = { y: Number(until[0]), m: until[1] ? MONTHS.indexOf(until[1]) : 0, d: until[2] ?? "1", at: t.at, suffix: t.suffix };
    }
    zone.push({ stdoff: hms(stdoff), rules: ruleName, until: u });
  }
  if (!zone.length) throw new Error(`zone ${zoneName} not found`);

  const periods: Period[] = [];
  let startUtc = -Infinity;
  for (const z of zone) {
    const named = rules.get(z.rules);
    const fixedSave = named ? null : hms(z.rules);
    // 이 줄 안의 규칙 전환을 시간 순으로(벽시계는 직전 save로 UTC를 정한다 = zic w 규칙).
    const events = (named ?? []).flatMap((r) => Array.from({ length: r.to - r.from + 1 }, (_, i) => r.from + i)
      .map((y) => ({ y, r, local: localSec(y, r.month, dayOfMonth(y, r.month, r.on), r.at) })))
      .sort((a, b) => a.local - b.local);
    let save = 0;
    const transitions: { utc: number; save: number }[] = [];
    for (const e of events) {
      const utc = e.r.atSuffix === "u" ? e.local : e.r.atSuffix === "s" ? e.local - z.stdoff : e.local - z.stdoff - save;
      transitions.push({ utc, save: e.r.save });
      save = e.r.save;
    }
    const saveAt = (utc: number) => fixedSave ?? transitions.filter((t) => t.utc <= utc).at(-1)?.save ?? 0;
    let untilUtc = Infinity;
    if (z.until) {
      const local = localSec(z.until.y, z.until.m, dayOfMonth(z.until.y, z.until.m, z.until.d), z.until.at);
      untilUtc = z.until.suffix === "u" ? local : local - z.stdoff;
      if (z.until.suffix === "w") untilUtc = local - z.stdoff - saveAt(untilUtc - 1);
    }
    const startSave = Number.isFinite(startUtc) ? saveAt(startUtc / 1) : saveAt(-Infinity);
    periods.push({ startUtc: startUtc * SEC, offsetSec: z.stdoff + startSave, dst: startSave !== 0 });
    for (const t of transitions) if (t.utc > startUtc && t.utc < untilUtc) periods.push({ startUtc: t.utc * SEC, offsetSec: z.stdoff + t.save, dst: t.save !== 0 });
    startUtc = untilUtc;
  }
  // 오프셋이 같은 이웃 구간은 합친다(1945 JST→KST처럼 이름만 바뀐 경우).
  return periods.filter((p, i) => i === 0 || p.offsetSec !== periods[i - 1].offsetSec || p.dst !== periods[i - 1].dst);
}

export type TzModel = { name: string; periods: Period[] };
const here = new URL(".", import.meta.url);
export const TZDATA: TzModel = { name: "tzdata-2026f", periods: parseZic(readFileSync(new URL("data/tzdata-2026f-korea.zi", here), "utf8")) };
export const KASI: TzModel = { name: "kasi-almanac-2023", periods: parseZic(readFileSync(new URL("data/kasi-almanac-2023-korea.zi", here), "utf8")) };
export const FIXED9: TzModel = { name: "fixed+9", periods: [{ startUtc: -Infinity, offsetSec: 9 * 3600, dst: false }] };

export function offsetAt(model: TzModel, utcMs: number): Period {
  let found = model.periods[0];
  for (const p of model.periods) { if (p.startUtc <= utcMs) found = p; else break; }
  return found;
}

export type Instant = { utcMs: number; offsetMin: number; dst: boolean; kind: "normal" | "ambiguous" | "nonexistent"; alternatives: number[] };
// 같은 경계 규칙(엔진 정책 문서 §1.1과 같은 선택): 없는 시각은 전환 직전 오프셋, 두 번 있는 시각은 앞(이른) 시각.
export function civilToUtc(model: TzModel, date: string, time: string): Instant {
  const wall = Date.parse(`${date}T${time}:00Z`);
  const near = model.periods.filter((p) => p.startUtc > wall - 3 * DAY && p.startUtc < wall + 3 * DAY);
  const offsets = [...new Set([offsetAt(model, wall - 3 * DAY).offsetSec, ...near.map((p) => p.offsetSec)])];
  const hits = offsets.map((o) => wall - o * SEC).filter((utc) => offsetAt(model, utc).offsetSec * SEC === wall - utc).sort((a, b) => a - b);
  if (!hits.length) {
    // 벽시계가 건너뛴 구간: 그 틈을 만든 전환 바로 앞 구간의 오프셋.
    const gap = near.find((p) => { const before = offsetAt(model, p.startUtc - 1).offsetSec; return wall - before * SEC >= p.startUtc && wall - p.offsetSec * SEC < p.startUtc; });
    const before = gap ? offsetAt(model, gap.startUtc - 1) : offsetAt(model, wall - 3 * DAY);
    return { utcMs: wall - before.offsetSec * SEC, offsetMin: before.offsetSec / 60, dst: before.dst, kind: "nonexistent", alternatives: [] };
  }
  const p = offsetAt(model, hits[0]);
  return { utcMs: hits[0], offsetMin: p.offsetSec / 60, dst: p.dst, kind: hits.length > 1 ? "ambiguous" : "normal", alternatives: hits.slice(1) };
}

// ───────────────────────── 기둥 ─────────────────────────
export function jdn(y: number, m: number, d: number): number {
  const a = Math.floor((14 - m) / 12), yy = y + 4800 - a, mm = m + 12 * a - 3;
  return d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
}
const ganji = (stem: number, branch: number) => STEMS[mod(stem, 10)] + BRANCHES[mod(branch, 12)];
const dayIndexOfWall = (wallMs: number) => { const d = new Date(wallMs); return mod(jdn(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate()) + 49, 60); };

export type ZiRule = "unified" | "split";
// 태양시 벽시계(getUTC*로 읽음)에서 일주·시주.
export function dayHour(solarWallMs: number, zi: ZiRule = "unified") {
  const h = new Date(solarWallMs).getUTCHours();
  const today = dayIndexOfWall(solarWallMs), late = h === 23;
  const day = late && zi === "unified" ? today + 1 : today;
  const stemDay = late ? today + 1 : today;
  const branch = Math.floor(((h + 1) % 24) / 2);
  return { day: ganji(day, day), hour: ganji(mod(stemDay, 5) * 2 + branch, branch), solarIso: new Date(solarWallMs).toISOString().slice(0, 16) };
}

// 절(節) 황경. index 0 = 立春(寅월 시작).
export const JIE = [
  { name: "입춘", lon: 315 }, { name: "경칩", lon: 345 }, { name: "청명", lon: 15 }, { name: "입하", lon: 45 },
  { name: "망종", lon: 75 }, { name: "소서", lon: 105 }, { name: "입추", lon: 135 }, { name: "백로", lon: 165 },
  { name: "한로", lon: 195 }, { name: "입동", lon: 225 }, { name: "대설", lon: 255 }, { name: "소한", lon: 285 },
] as const;
export const TERMS_24 = ["춘분", "청명", "곡우", "입하", "소만", "망종", "하지", "소서", "대서", "입추", "처서", "백로",
  "추분", "한로", "상강", "입동", "소설", "대설", "동지", "소한", "대한", "입춘", "우수", "경칩"]; // index k → 황경 15k°
const sunLon = (utcMs: number) => Astronomy.SunPosition(new Date(utcMs)).elon;
// 황경 lon°에 태양이 닿는 UTC(ms). 대략 날짜(approxMs) ±20일 안에서 찾는다.
export function termInstant(lon: number, approxMs: number): number {
  const t = Astronomy.SearchSunLongitude(lon, new Date(approxMs - 20 * DAY), 40);
  if (!t) throw new Error(`term ${lon} near ${new Date(approxMs).toISOString()}`);
  return t.date.getTime();
}
const termCache = new Map<string, number>();
// 그레고리력 해 y 안의 황경 15k° 순간(k=0 춘분 … 23 경칩). 춘분은 3월 20일 무렵.
export function termOfYear(y: number, k: number): number {
  const key = `${y}:${k}`;
  let v = termCache.get(key);
  if (v === undefined) {
    const approx = Date.UTC(y, 2, 20) + ((k * 15.2184) % 365.2422) * DAY - (k >= 19 ? 365.2422 * DAY : 0);
    v = termInstant(k * 15, approx);
    termCache.set(key, v);
  }
  return v;
}
const ipchun = (y: number) => termOfYear(y, 21);

export function yearMonth(utcMs: number) {
  const y = new Date(utcMs).getUTCFullYear();
  const sajuYear = utcMs >= ipchun(y) ? y : y - 1;
  const lon = sunLon(utcMs);
  const k = Math.floor(mod(lon - 315, 360) / 30); // 0 = 寅월
  // 절입 바로 근처는 황경 반올림 오차를 피하려고 절입 순간과 직접 비교한다.
  const yearStem = mod(sajuYear - 4, 10);
  const monthStem = mod(mod(yearStem, 5) * 2 + 2 + k, 10);
  return { year: ganji(yearStem, sajuYear - 4), month: ganji(monthStem, 2 + k), sajuYear, monthIndex: k };
}

// 출생 순간 앞뒤의 절(節) 순간.
export function jieAround(utcMs: number): { prev: { name: string; utc: number }; next: { name: string; utc: number } } {
  const y = new Date(utcMs).getUTCFullYear();
  const list = [y - 1, y, y + 1].flatMap((yy) => JIE.map((j) => ({ name: j.name, utc: termOfYear(yy, j.lon / 15) })))
    .sort((a, b) => a.utc - b.utc);
  const i = list.findIndex((j) => j.utc > utcMs);
  return { prev: list[i - 1], next: list[i] };
}

export type ReferenceInput = { date: string; time: string; longitude?: number; gender?: "MALE" | "FEMALE"; zi?: ZiRule };
export function reference(input: ReferenceInput, model: TzModel = TZDATA) {
  const longitude = input.longitude ?? 127.5;
  const civil = civilToUtc(model, input.date, input.time);
  const solar = civil.utcMs + Math.round(longitude * 240) * SEC;
  const dh = dayHour(solar, input.zi ?? "unified");
  const ym = yearMonth(civil.utcMs);
  const correctionMin = Math.round((longitude * 4 - civil.offsetMin) * 100) / 100;
  let dayun: null | { direction: "forward" | "reverse"; days: number; daeunsu: number; jie: string; startUtc: number } = null;
  if (input.gender) {
    const yang = STEMS.indexOf(ym.year[0]) % 2 === 0;
    const forward = yang === (input.gender === "MALE");
    const { prev, next } = jieAround(civil.utcMs);
    const jie = forward ? next : prev;
    // lunar-javascript와 같은 분 단위(초 버림) 차이: 두 순간을 각각 분으로 내린 뒤 뺀다.
    const minuteOf = (ms: number) => Math.floor(ms / MIN);
    const minutes = forward ? minuteOf(jie.utc) - minuteOf(civil.utcMs) : minuteOf(civil.utcMs) - minuteOf(jie.utc);
    const days = Math.floor(minutes / 1440);
    const daeunsu = Math.min(10, Math.max(1, Math.floor(days / 3) + (days % 3 === 2 ? 1 : 0)));
    let m = minutes;
    const yy = Math.floor(m / 4320); m -= yy * 4320;
    const mo = Math.floor(m / 360); m -= mo * 360;
    const dd = Math.floor(m / 12); m -= dd * 12;
    const hh = m * 2;
    // 출생 순간에 년·월·일·시를 더한다(달력 더하기, UTC+8 벽시계 기준 — 라이브러리와 같은 좌표).
    // 해·달을 더할 때 그달에 없는 날(2월 29일, 31일)은 그달 마지막 날로 줄인다.
    const w = new Date(minuteOf(civil.utcMs) * MIN + 8 * HOUR);
    const ty = w.getUTCFullYear() + yy + Math.floor((w.getUTCMonth() + mo) / 12), tm = mod(w.getUTCMonth() + mo, 12);
    const td = Math.min(w.getUTCDate(), new Date(Date.UTC(ty, tm + 1, 0)).getUTCDate());
    const start = Date.UTC(ty, tm, td, w.getUTCHours(), w.getUTCMinutes()) + dd * DAY + hh * HOUR - 8 * HOUR;
    dayun = { direction: forward ? "forward" : "reverse", days, daeunsu, jie: jie.name, startUtc: start };
  }
  return {
    model: model.name, civil, longitude, correctionMin,
    pillars: { year: ym.year, month: ym.month, day: dh.day, hour: dh.hour },
    solarIso: dh.solarIso, dayun,
  };
}
