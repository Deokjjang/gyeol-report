/**
 * calc-audit 1-a 2부: 엔진(src/lib/saju) ↔ 독립 기준 계산기(reference.ts) 대조.
 * 실행: pnpm exec tsx scripts/calc-audit/compare.ts   (출력: docs/v5/calc-audit/*.csv·json, 네트워크·DB·API 호출 0)
 *
 * 1) 런타임 시간대 자료(ICU) ↔ tzdata 원문 해석: 1900~2040 매시 + 전환 앞뒤 ±3시간 매분
 * 2) 표본: 시기 경계 앞뒤, 시주 경계 ±40분, 출생지 경도, 회귀 표본, 무작위, 절입 앞뒤
 * 3) 대운: 순역·대운수(전통 A-3)·교운 시각
 * 4) 「고정 +9」·「KASI 역서 이력」으로 계산했다면 무엇이 달라지는지
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { calculateSaju } from "../../src/lib/saju/calculateSaju";
import { calculateCustomerDayun } from "../../src/lib/saju/customerDayun";
import { calculateTraditionalDaeunsu } from "../../src/lib/saju/traditionalDaeunsu";
import { civilToUtc as engineCivilToUtc, utcOffsetMinutesAt } from "../../src/lib/saju/solarTime";
import { FIXED9, KASI, TZDATA, civilToUtc, jieAround, offsetAt, reference, termOfYear } from "./reference";

const OUT = new URL("../../docs/v5/calc-audit/", import.meta.url);
mkdirSync(OUT, { recursive: true });
const MIN = 60_000, HOUR = 60 * MIN, DAY = 24 * HOUR;
const pad = (n: number) => String(n).padStart(2, "0");
const wallParts = (wallMs: number) => { const d = new Date(wallMs); return { date: d.toISOString().slice(0, 10), time: d.toISOString().slice(11, 16) }; };
const csv = (rows: Record<string, unknown>[]) => rows.length ? [Object.keys(rows[0]).join(","), ...rows.map((r) => Object.values(r).map((v) => (typeof v === "string" && /[,"]/.test(v) ? `"${v.replace(/"/g, '""')}"` : String(v ?? ""))).join(","))].join("\n") + "\n" : "";
let seed = 20261106;
const rand = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };

// ───────── 1) 런타임 ICU ↔ tzdata 원문 ─────────
const transitionsUtc = TZDATA.periods.filter((p) => Number.isFinite(p.startUtc)).map((p) => p.startUtc);
let icuChecks = 0;
const icuMismatch: Record<string, unknown>[] = [];
const checkIcu = (utc: number) => {
  icuChecks++;
  const icu = utcOffsetMinutesAt(utc, "Asia/Seoul"), ref = offsetAt(TZDATA, utc).offsetSec / 60;
  if (Math.abs(icu - ref) > 1e-6 && icuMismatch.length < 50) icuMismatch.push({ utc: new Date(utc).toISOString(), icu, ref });
};
for (let t = Date.UTC(1900, 0, 1); t < Date.UTC(2041, 0, 1); t += HOUR) checkIcu(t);
for (const t of transitionsUtc) for (let d = -3 * HOUR; d <= 3 * HOUR; d += MIN) checkIcu(t + d);
// 엔진의 시계 시각 → UTC(없는·두 번 있는 시각 처리 포함) ↔ 기준 계산기, 전환 앞뒤 벽시계 ±3시간 매분.
let civilChecks = 0;
const civilMismatch: Record<string, unknown>[] = [];
for (const t of transitionsUtc) {
  const wall0 = t + offsetAt(TZDATA, t - 1).offsetSec * 1000;
  for (let d = -3 * HOUR; d <= 3 * HOUR; d += MIN) {
    const { date, time } = wallParts(wall0 + d);
    const e = engineCivilToUtc(date, time, "Asia/Seoul"), r = civilToUtc(TZDATA, date, time);
    civilChecks++;
    const ek = e.nonexistent ? "nonexistent" : e.ambiguous ? "ambiguous" : "normal";
    if (e.utcMs !== r.utcMs || ek !== r.kind) civilMismatch.push({ date, time, engineUtc: new Date(e.utcMs).toISOString(), engineKind: ek, refUtc: new Date(r.utcMs).toISOString(), refKind: r.kind });
  }
}

// ───────── 2) 표본 ─────────
type Sample = { set: string; date: string; time: string; lon?: number; gender: "MALE" | "FEMALE"; note?: string };
const samples: Sample[] = [];
const add = (s: Sample) => samples.push(s);
const g = (i: number): "MALE" | "FEMALE" => (i % 2 ? "FEMALE" : "MALE");

// A. 시기 경계 앞뒤: tzdata·KASI 두 이력의 모든 전환. 벽시계 ±3시간 5분 간격 + ±60분 매분, 그리고 전날·다음날 대표 시각.
const boundaryWalls = new Map<string, number>();
for (const model of [TZDATA, KASI]) for (const p of model.periods) if (Number.isFinite(p.startUtc)) {
  const wall = p.startUtc + offsetAt(model, p.startUtc - 1).offsetSec * 1000;
  boundaryWalls.set(`${model.name}:${new Date(wall).toISOString().slice(0, 16)}`, wall);
}
let ai = 0;
for (const [key, wall] of boundaryWalls) {
  const seen = new Set<string>();
  for (let d = -3 * HOUR; d <= 3 * HOUR; d += (Math.abs(d) <= HOUR ? MIN : 5 * MIN)) {
    const { date, time } = wallParts(wall + d);
    if (!seen.has(date + time)) { seen.add(date + time); add({ set: "A-boundary", date, time, gender: g(ai++), note: key }); }
  }
  for (const shift of [-DAY, DAY]) for (const time of ["00:10", "06:00", "12:00", "18:00", "23:50"]) add({ set: "A-boundary-day", date: wallParts(wall + shift).date, time, gender: g(ai++), note: key });
}

// B. 시주 경계 ±40분(시기별 대표 날짜, 서울 기준 기본 경도 127.5°).
const REP_DATES = ["1910-06-15", "1930-06-15", "1949-07-15", "1952-07-15", "1956-07-15", "1958-01-15", "1975-06-15", "1987-07-15", "1988-07-15", "2000-05-11"];
const hourBoundarySamples = (set: string, dates: string[], lon: number) => {
  for (const date of dates) {
    const noonUtc = civilToUtc(TZDATA, date, "12:00");
    const offset = noonUtc.offsetMin;
    for (let solarHour = 1; solarHour <= 23; solarHour += 2) {
      // 태양시 경계(홀수 시 정각) → 그날 시계 시각: 태양시 − 경도×4분 + 당시 UTC 오프셋.
      const civilBoundary = solarHour * 60 - lon * 4 + offset;
      for (let k = -40; k <= 40; k++) {
        const m = Math.round(civilBoundary + k);
        const wall = Date.parse(`${date}T00:00:00Z`) + m * MIN;
        const p = wallParts(wall);
        add({ set, date: p.date, time: p.time, lon: lon === 127.5 ? undefined : lon, gender: g(k + 40), note: `solar ${pad(solarHour)}:00 ${k >= 0 ? "+" : ""}${k}m` });
      }
    }
  }
};
hourBoundarySamples("B-hour±40", REP_DATES, 127.5);
// C. 출생지 경도(엔진 입력 birthLongitude 지원 범위 124~132°E).
const PLACES: Record<string, number> = { 서울: 126.978, 부산: 129.0756, 목포: 126.3922, 강릉: 128.8961, 제주: 126.5312, 서쪽끝124: 124, 동쪽끝132: 132 };
for (const [, lon] of Object.entries(PLACES)) hourBoundarySamples("C-birthplace", ["1956-07-15", "1975-06-15", "2000-05-11"], lon);
// D. 회귀 표본(고객 문의 사례).
add({ set: "D-regression", date: "2000-05-11", time: "17:05", gender: "FEMALE", note: "고객 문의 사례" });
// E. 무작위 3,000건(1930~2025).
for (let i = 0; i < 3000; i++) {
  const t = Date.UTC(1930, 0, 1) + Math.floor(rand() * (Date.UTC(2026, 0, 1) - Date.UTC(1930, 0, 1)) / MIN) * MIN;
  const p = wallParts(t);
  add({ set: "E-random", date: p.date, time: p.time, gender: rand() < 0.5 ? "MALE" : "FEMALE" });
}
// G. 절입 앞뒤(±1·2·5·10·30분). 5년 간격 + 영향 시기 전부.
const JIE_YEARS = [...new Set([...Array.from({ length: 20 }, (_, i) => 1930 + i * 5), 1948, 1949, 1950, 1951, 1954, 1955, 1956, 1957, 1958, 1959, 1960, 1961, 1987, 1988, 2000, 2024, 2025])].sort();
for (const y of JIE_YEARS) for (const k of [21, 23, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19]) {
  const jie = termOfYear(y, k);
  for (const off of [-30, -10, -5, -2, -1, 1, 2, 5, 10, 30]) {
    const utc = jie + off * MIN;
    const wall = Math.floor((utc + offsetAt(TZDATA, utc).offsetSec * 1000) / MIN) * MIN;
    const p = wallParts(wall);
    add({ set: "G-jie±30", date: p.date, time: p.time, gender: g(off + 100), note: `jie${k * 15}° ${off >= 0 ? "+" : ""}${off}m` });
  }
}

// ───────── 3) 실행 ─────────
type Row = Record<string, string | number | boolean>;
const rows: Row[] = [];
const P = ["year", "month", "day", "hour"] as const;
const DAYUN_SETS = new Set(["A-boundary", "D-regression", "E-random", "G-jie±30"]);
let engineErrors = 0;
for (const s of samples) {
  const base = { birthDate: s.date, birthTime: s.time, birthTimeUnknown: false, calendarType: "SOLAR" as const, gender: s.gender, timezone: "Asia/Seoul" as const, ...(s.lon !== undefined ? { birthLongitude: s.lon } : {}) };
  let engine: ReturnType<typeof calculateSaju> | null = null;
  try { engine = calculateSaju(base); } catch { engineErrors++; }
  const ref = reference({ date: s.date, time: s.time, longitude: s.lon, gender: s.gender });
  const fixed = reference({ date: s.date, time: s.time, longitude: s.lon, gender: s.gender }, FIXED9);
  const kasi = reference({ date: s.date, time: s.time, longitude: s.lon, gender: s.gender }, KASI);
  const ep = engine ? Object.fromEntries(P.map((k) => [k, engine!.pillars[k] ? engine!.pillars[k]!.stem + engine!.pillars[k]!.branch : ""])) : {};
  const eUtc = engine ? Date.parse(engine.birthTimeContext!.range.startKst) : NaN;
  const row: Row = {
    set: s.set, date: s.date, time: s.time, lon: s.lon ?? 127.5, gender: s.gender, note: s.note ?? "",
    e_offset: engine?.birthTimeContext?.timeBasis?.utcOffsetMinutes ?? "", e_corr: engine?.birthTimeContext?.timeBasis?.solarTimeCorrectionMinutes ?? "",
    e_kind: engine?.birthTimeContext?.timeBasis?.nonexistent ? "nonexistent" : engine?.birthTimeContext?.timeBasis?.ambiguous ? "ambiguous" : "normal",
    e_Y: ep.year ?? "", e_M: ep.month ?? "", e_D: ep.day ?? "", e_H: ep.hour ?? "",
    r_offset: ref.civil.offsetMin, r_corr: ref.correctionMin, r_kind: ref.civil.kind,
    r_Y: ref.pillars.year, r_M: ref.pillars.month, r_D: ref.pillars.day, r_H: ref.pillars.hour,
    same_instant: eUtc === ref.civil.utcMs,
    match: engine ? P.every((k) => ep[k] === ref.pillars[k]) : false,
    f9_D: fixed.pillars.day, f9_H: fixed.pillars.hour, f9_Y: fixed.pillars.year, f9_M: fixed.pillars.month,
    f9_differs: P.some((k) => fixed.pillars[k] !== ref.pillars[k]),
    k_offset: kasi.civil.offsetMin, k_D: kasi.pillars.day, k_H: kasi.pillars.hour,
    k_differs: P.some((k) => kasi.pillars[k] !== ref.pillars[k]),
  };
  // 년·월이 다르면 절입 순간과의 거리(분)를 남긴다.
  const near = jieAround(ref.civil.utcMs);
  row.jie_dist_min = Math.round(Math.min(ref.civil.utcMs - near.prev.utc, near.next.utc - ref.civil.utcMs) / 6000) / 10;
  if (DAYUN_SETS.has(s.set) && engine) {
    const d = calculateCustomerDayun({ ...base, name: "audit" });
    const t = calculateTraditionalDaeunsu({ ...base, name: "audit" });
    row.e_dir = d.ok ? d.value.direction : `ERR:${d.ok ? "" : d.error}`;
    row.e_daeunsu = t.ok ? t.value.daeunsu : "";
    row.e_firstStartKst = d.ok ? d.value.cycles[0].startSolarKst ?? "" : "";
    row.e_firstGanji = d.ok ? d.value.cycles[0].ganji : "";
    row.e_firstStartYearMinusBirth = d.ok ? d.value.cycles[0].startYear - Number(s.date.slice(0, 4)) : "";
    row.r_dir = ref.dayun!.direction; row.r_daeunsu = ref.dayun!.daeunsu; row.r_days = ref.dayun!.days;
    row.r_startKst = new Date(ref.dayun!.startUtc + 9 * HOUR).toISOString().slice(0, 16);
    row.dayun_start_diff_h = d.ok && d.value.cycles[0].startSolarKst ? Math.round((Date.parse(d.value.cycles[0].startSolarKst) - ref.dayun!.startUtc) / HOUR * 10) / 10 : "";
    row.dayun_match = d.ok && t.ok && d.value.direction === ref.dayun!.direction && t.value.daeunsu === ref.dayun!.daeunsu;
  }
  rows.push(row);
}

// ───────── 4) 정리 ─────────
const bySet = new Map<string, Row[]>();
for (const r of rows) bySet.set(r.set as string, [...(bySet.get(r.set as string) ?? []), r]);
const mismatches = rows.filter((r) => !r.match);
const dayunRows = rows.filter((r) => r.dayun_match !== undefined);
const dayunMismatch = dayunRows.filter((r) => !r.dayun_match);
const startDiffs = dayunRows.map((r) => Math.abs(Number(r.dayun_start_diff_h))).filter(Number.isFinite);
const era = (r: Row) => Number(r.r_offset) === 600 || Number(r.r_offset) === 570 ? "서머타임" : Number(r.r_offset) === 510 ? "UTC+8:30" : Number(r.r_offset) === 540 ? "UTC+9" : "기타";
const summary = {
  generatedAt: new Date().toISOString(),
  runtime: { node: process.version, icu: process.versions.icu, icuTz: process.versions.tz },
  tzdata: "2026f (Asia/Seoul identical since 2019c)",
  icuVsTzdata: { checks: icuChecks, mismatches: icuMismatch.length, examples: icuMismatch.slice(0, 5) },
  engineCivilToUtcVsReference: { checks: civilChecks, mismatches: civilMismatch.length, examples: civilMismatch.slice(0, 10) },
  samples: rows.length, engineErrors,
  bySet: Object.fromEntries([...bySet].map(([k, v]) => [k, {
    n: v.length, engineEqualsReference: v.filter((r) => r.match).length,
    fixed9Differs: v.filter((r) => r.f9_differs).length, kasiDiffers: v.filter((r) => r.k_differs).length,
  }])),
  fixed9DiffersByEra: Object.fromEntries(["UTC+9", "UTC+8:30", "서머타임", "기타"].map((e) => { const v = rows.filter((r) => era(r) === e && r.set === "E-random"); return [e, `${v.filter((r) => r.f9_differs).length}/${v.length}`]; })),
  mismatches: mismatches.length,
  mismatchCauses: Object.fromEntries(Object.entries(mismatches.reduce<Record<string, number>>((acc, r) => {
    const cause = !r.same_instant ? "instant(시간대)" : (r.e_Y !== r.r_Y || r.e_M !== r.r_M) ? `jie(절입 ${Number(r.jie_dist_min) <= 2 ? "2분 안" : "2분 밖"})` : "day/hour";
    acc[cause] = (acc[cause] ?? 0) + 1; return acc;
  }, {}))),
  dayun: { n: dayunRows.length, mismatch: dayunMismatch.length, mismatchNearJie2min: dayunMismatch.filter((r) => Number(r.jie_dist_min) <= 2).length,
    startDiffHoursMaxAbs: Math.max(...startDiffs), startDiffHoursOver6: startDiffs.filter((x) => x > 6).length,
    // 절입 2분 밖(절입 시각 차이가 순역·절 선택을 바꾸지 않는 출생): 교운 시각 차이 = 두 계산기 절입 시각 차이(분) × 2시간.
    awayFromJie: (() => { const v = dayunRows.filter((r) => Number(r.jie_dist_min) > 2 && r.dayun_match).map((r) => Math.abs(Number(r.dayun_start_diff_h))).filter(Number.isFinite);
      return { n: v.length, startDiffHoursMaxAbs: Math.max(...v), within2h: v.filter((x) => x <= 2).length, within4h: v.filter((x) => x <= 4).length }; })(),
    traditionalVsStartYearMinusBirth: { n: dayunRows.length, differ: dayunRows.filter((r) => r.e_daeunsu !== "" && Number(r.e_daeunsu) !== Number(r.e_firstStartYearMinusBirth)).length } },
};
writeFileSync(new URL("summary.json", OUT), JSON.stringify(summary, null, 2) + "\n");
writeFileSync(new URL("engine-vs-reference-mismatches.csv", OUT), csv(mismatches));
writeFileSync(new URL("dayun-mismatches.csv", OUT), csv(dayunMismatch));
writeFileSync(new URL("kasi-history-differs.csv", OUT), csv(rows.filter((r) => r.k_differs && (r.set === "A-boundary" || r.set === "A-boundary-day"))));
writeFileSync(new URL("fixed9-differs-random.csv", OUT), csv(rows.filter((r) => r.f9_differs && r.set === "E-random").map((r) => ({ date: r.date, time: r.time, era: era(r), engine: `${r.e_Y} ${r.e_M} ${r.e_D} ${r.e_H}`, fixed9: `${r.f9_Y} ${r.f9_M} ${r.f9_D} ${r.f9_H}` }))));
writeFileSync(new URL("regression-2000-05-11.json", OUT), JSON.stringify(rows.filter((r) => r.set === "D-regression"), null, 2) + "\n");
// 표본 표: 시기 경계 날짜 앞뒤·회귀·절입 앞뒤만 싣는다(시주 경계 ±40분·출생지 표본 3만 건은 같은 명령으로 다시 만들 수 있어 요약만 남긴다).
writeFileSync(new URL("samples.csv", OUT), csv(rows.filter((r) => r.set === "A-boundary-day" || r.set === "D-regression" || r.set === "G-jie±30").map(({ set, date, time, lon, gender, note, e_offset, e_corr, e_kind, e_Y, e_M, e_D, e_H, r_offset, r_kind, r_Y, r_M, r_D, r_H, match, f9_D, f9_H, k_offset, k_D, k_H }) => ({ set, date, time, lon, gender, note, e_offset, e_corr, e_kind, e_Y, e_M, e_D, e_H, r_offset, r_kind, r_Y, r_M, r_D, r_H, match, f9_D, f9_H, k_offset, k_D, k_H }))));
console.log(JSON.stringify(summary, null, 2));
