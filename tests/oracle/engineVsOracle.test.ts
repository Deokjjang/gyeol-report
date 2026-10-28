import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { resolveBirthTimeCalculation } from "@/lib/saju/birthTimePrecision";
import { DEFAULT_SAJU_TIME_POLICY } from "@/lib/saju/calcPolicy";
import { getSolarTermInstants, lunarToSolarDate } from "@/lib/saju/solarTerms";
import { MANSERYEOK_GOLDEN_CASES, type ManseryeokGoldenCase } from "../fixtures/saju/manseryeokGoldenCases";
import {
  APP_SETTINGS, civilToUtc, dayCycleIndex, dayHourPillars, ganji, lunarToSolar, meanSolarWallClockMs,
  pillarsUnderSetting, solarTermsOfYear, surroundingJie, yearMonthPillars, type ZiRule,
} from "./oracle";
import { randomCases, type RandomCase } from "./randomCases";

// Engine vs independent oracle (tests/oracle/oracle.ts). ORACLE_WRITE=1 rewrites the oracle columns of
// docs/manseryeok-golden-cases.csv and the generated tables under docs/v5/.
const WRITE = process.env.ORACLE_WRITE === "1";
const DOCS = resolve(__dirname, "../../docs");
const GOLDEN_CSV = resolve(DOCS, "manseryeok-golden-cases.csv");
const RULES: readonly ZiRule[] = ["unified", "split"];
const KEYS = ["year", "month", "day", "hour"] as const;
const LABEL = { year: "년", month: "월", day: "일", hour: "시" } as const;
// 節 instants of lunar-javascript and astronomy-engine must agree this closely (1930-2025: max 55.8 s, mean 11 s).
const JIE_TOLERANCE_SECONDS = 120;
const BOUNDARY_MINUTES = 10;
const MINUTE = 60_000;

const kst = (utcMs: number) => new Date(utcMs + 9 * 3_600_000).toISOString().slice(0, 19) + "+09:00";
const cell = (value: string | number) => /[",\n]/.test(String(value)) ? `"${String(value).replace(/"/g, '""')}"` : String(value);
const csv = (rows: (string | number)[][]) => rows.map((row) => row.map(cell).join(",")).join("\n") + "\n";

function enginePillars(date: string, time: string, rule: ZiRule, extra: Record<string, unknown> = {}): string {
  const r = resolveBirthTimeCalculation({ birthDate: date, birthTime: time, birthTimeUnknown: false, ...extra },
    { ...DEFAULT_SAJU_TIME_POLICY, ziHourRule: rule });
  return KEYS.map((key) => extra.birthTimeUnknown && key === "hour" ? "-"
    : r.stable[key] ? r.candidates[key][0].stem + r.candidates[key][0].branch
      : r.candidates[key].map((p) => p.stem + p.branch).join("/") + "?").join(" ");
}

// Pillars over [startUtc, endUtc) minute by minute, in the engine's "a/b?" notation.
function oracleRange(startUtc: number, endUtc: number, rule: ZiRule, civilDay?: string): string {
  const seen = KEYS.map(() => new Set<string>());
  for (let utc = startUtc; utc < endUtc; utc += MINUTE) {
    const { year, month } = yearMonthPillars(utc);
    const { day, hour } = dayHourPillars(meanSolarWallClockMs(utc, 127.5), rule);
    [year, month, civilDay ? ganji(dayCycleIndex(civilDay)) : day, hour].forEach((value, i) => seen[i].add(value));
  }
  return seen.map((values, i) => civilDay && i === 3 ? "-" : values.size === 1 ? [...values][0] : [...values].join("/") + "?").join(" ");
}

function oracleGolden(c: ManseryeokGoldenCase, rule: ZiRule): string {
  let date = c.date;
  if (c.calendar === "LUNAR") {
    try { date = lunarToSolar(c.date, c.leap); } catch { return "ERROR:InvalidLunarDateError"; }
  }
  if (c.unknown) {
    const next = new Date(Date.parse(date) + 86_400_000).toISOString().slice(0, 10);
    return oracleRange(civilToUtc(date, "00:00").utcMs, civilToUtc(next, "00:00").utcMs, rule, date);
  }
  if (c.slot) {
    const slot = { YUSI: [1020, 1140], JASI: [-60, 60] }[c.slot];
    const solarMidnight = Date.parse(`${date}T00:00:00Z`) - Math.round(127.5 * 240) * 1000;
    return oracleRange(solarMidnight + slot[0] * MINUTE, solarMidnight + slot[1] * MINUTE, rule);
  }
  return pillarsUnderSetting(date, c.time, APP_SETTINGS[rule === "unified" ? 0 : 1]);
}

function otherAppSettings(date: string, time: string): string {
  const ours = pillarsUnderSetting(date, time, APP_SETTINGS[0]);
  return APP_SETTINGS.slice(1).map((setting) => [setting.label, pillarsUnderSetting(date, time, setting)] as const)
    .filter(([, value]) => value !== ours).map(([label, value]) => `${label}=${value}`).join("; ");
}

function engineGolden(c: ManseryeokGoldenCase, rule: ZiRule): string {
  try {
    const date = c.calendar === "LUNAR" ? lunarToSolarDate(c.date, c.leap) : c.date;
    return enginePillars(date, c.time, rule, { birthTimeUnknown: c.unknown, approximateBirthTimeSlot: c.slot });
  } catch (error) {
    return `ERROR:${(error as Error).name}`;
  }
}

type Comparison = RandomCase & {
  rule: ZiRule; engine: string; oracle: string; offset: number; kind: string; jieMinutes: number; diff: (typeof KEYS)[number][];
  category: "" | "가" | "나" | "다"; reason: string;
};

function engineJieNear(utcMs: number): readonly number[] {
  return getSolarTermInstants(kst(utcMs - 86_400_000), kst(utcMs + 86_400_000));
}

function compare(c: RandomCase, rule: ZiRule): Comparison {
  const instant = civilToUtc(c.date, c.time);
  const engine = enginePillars(c.date, c.time, rule);
  const oracle = pillarsUnderSetting(c.date, c.time, APP_SETTINGS[rule === "unified" ? 0 : 1]);
  const jie = surroundingJie(instant.utcMs);
  const jieMinutes = Math.min(instant.utcMs - jie.previous, jie.next - instant.utcMs) / MINUTE;
  const e = engine.split(" ");
  const o = oracle.split(" ");
  const diff = KEYS.filter((_, i) => e[i] !== o[i]);
  let category: Comparison["category"] = "";
  let reason = "";
  if (diff.length > 0) {
    const oracleJie = jieMinutes === (instant.utcMs - jie.previous) / MINUTE ? jie.previous : jie.next;
    const engineJie = engineJieNear(instant.utcMs).reduce((best, t) => Math.abs(t - oracleJie) < Math.abs(best - oracleJie) ? t : best, Infinity);
    const between = (instant.utcMs - oracleJie) * (instant.utcMs - engineJie) <= 0;
    if (diff.every((key) => key === "year" || key === "month") && between && Math.abs(engineJie - oracleJie) <= JIE_TOLERANCE_SECONDS * 1000) {
      category = "나";
      reason = `출생 시각이 두 절입 계산값 사이(차 ${Math.round(Math.abs(engineJie - oracleJie) / 1000)}초)`;
    } else {
      category = "가";
      reason = "설명되지 않는 차이: 조사 필요";
    }
  }
  return { ...c, rule, engine, oracle, offset: instant.offsetMinutes, kind: instant.kind, jieMinutes, diff, category, reason };
}

function jieAgreement(): { count: number; maxSeconds: number; meanSeconds: number; worst: string } {
  const engine = new Set<number>();
  for (let year = 1929; year <= 2026; year++) {
    for (const month of ["03", "09"]) for (const t of getSolarTermInstants(`${year}-${month}-01T12:00:00+09:00`, `${year}-${month}-01T12:00:01+09:00`)) engine.add(t);
  }
  const sorted = [...engine].sort((a, b) => a - b);
  let maxSeconds = 0;
  let total = 0;
  let count = 0;
  let worst = "";
  for (let year = 1930; year <= 2025; year++) {
    for (const term of solarTermsOfYear(year)) {
      const nearest = sorted.reduce((best, t) => Math.abs(t - term.utcMs) < Math.abs(best - term.utcMs) ? t : best, Infinity);
      const seconds = Math.abs(nearest - term.utcMs) / 1000;
      total += seconds;
      count += 1;
      if (seconds > maxSeconds) { maxSeconds = seconds; worst = `${kst(term.utcMs)} (${term.longitude}°)`; }
    }
  }
  return { count, maxSeconds, meanSeconds: total / count, worst };
}

function goldenColumns(): Map<string, { expected: string; other: string }> {
  return new Map(MANSERYEOK_GOLDEN_CASES.map((c) => {
    const unified = oracleGolden(c, "unified");
    const split = oracleGolden(c, "split");
    const exactSolar = c.calendar === "SOLAR" && !c.unknown && !c.slot;
    const other = exactSolar ? otherAppSettings(c.date, c.time) : split !== unified ? `야자시/조자시=${split}` : "";
    return [c.id, { expected: unified, other }];
  }));
}

function parseCsv(text: string): string[][] {
  return text.trim().split("\n").map((row) =>
    row.match(/("([^"]|"")*"|[^,]*)(,|$)/g)!.slice(0, -1).map((v) => v.replace(/,$/, "").replace(/^"|"$/g, "").replace(/""/g, '"')));
}

describe("engine vs independent oracle", () => {
  it("golden cases: engine (unified and split) equals the oracle; CSV oracle columns are current", () => {
    const columns = goldenColumns();
    for (const c of MANSERYEOK_GOLDEN_CASES) {
      for (const rule of RULES) expect(`${c.id} ${rule} ${engineGolden(c, rule)}`).toBe(`${c.id} ${rule} ${oracleGolden(c, rule)}`);
    }
    const [header, ...rows] = parseCsv(readFileSync(GOLDEN_CSV, "utf8"));
    const at = { expected: header.indexOf("expected"), other: header.indexOf("other_app_settings") };
    if (WRITE) {
      const text = readFileSync(GOLDEN_CSV, "utf8").trim().split("\n");
      const out = [text[0], ...rows.map((cells) => {
        const value = columns.get(cells[0])!;
        cells[at.expected] = value.expected;
        cells[at.other] = value.other;
        return cells.map(cell).join(",");
      })];
      writeFileSync(GOLDEN_CSV, out.join("\n") + "\n");
    }
    const current = parseCsv(readFileSync(GOLDEN_CSV, "utf8")).slice(1);
    for (const cells of current) {
      expect({ id: cells[0], expected: cells[at.expected], other: cells[at.other] })
        .toEqual({ id: cells[0], ...columns.get(cells[0])! });
    }
  });

  it("節 instants 1930-2025 agree within the tolerance", () => {
    const agreement = jieAgreement();
    expect(agreement.count).toBe(96 * 24);
    expect(agreement.maxSeconds).toBeLessThanOrEqual(JIE_TOLERANCE_SECONDS);
    if (WRITE) writeFileSync(resolve(DOCS, "v5/oracle-jie-agreement.json"), JSON.stringify(agreement, null, 2) + "\n");
  });

  it("3,000 random solar birth times × 2 子 rules: no unexplained difference", { timeout: 600_000 }, () => {
    const cases = randomCases();
    expect(cases).toHaveLength(3000);
    const results = cases.flatMap((c) => RULES.map((rule) => compare(c, rule)));
    const unexplained = results.filter((r) => r.category === "가");
    if (WRITE) writeGenerated(cases, results);
    expect(unexplained.map((r) => `${r.id} ${r.rule} ${r.date} ${r.time} engine=${r.engine} oracle=${r.oracle}`)).toEqual([]);
  });
});

function period(offset: number): string {
  return offset === 510 ? "UTC+8:30(1954~61)" : offset === 540 ? "일반(UTC+9)" : "서머타임";
}

function writeGenerated(cases: RandomCase[], results: Comparison[]) {
  mkdirSync(resolve(DOCS, "v5"), { recursive: true });
  const mismatches = results.filter((r) => r.diff.length > 0);
  writeFileSync(resolve(DOCS, "v5/oracle-mismatches.csv"), csv([
    ["id", "group", "rule", "date", "time", "utc_offset_min", "kind", "jie_distance_min", "engine", "oracle", "diff", "category", "reason"],
    ...mismatches.map((r) => [r.id, r.group, r.rule, r.date, r.time, r.offset, r.kind, r.jieMinutes.toFixed(1), r.engine, r.oracle,
      r.diff.map((key) => LABEL[key]).join(""), r.category, r.reason]),
  ]));
  const boundary = results.filter((r) => r.rule === "unified" && r.jieMinutes <= BOUNDARY_MINUTES);
  writeFileSync(resolve(DOCS, "v5/oracle-jie-boundary-cases.csv"), csv([
    ["id", "date", "time", "utc_offset_min", "jie_distance_min", "engine", "oracle", "same"],
    ...boundary.map((r) => [r.id, r.date, r.time, r.offset, r.jieMinutes.toFixed(1), r.engine, r.oracle, r.diff.length === 0 ? "Y" : "N"]),
  ]));
  // How often other app settings disagree with ours, by period and by pillar.
  const periods = ["일반(UTC+9)", "UTC+8:30(1954~61)", "서머타임"];
  const ours = new Map(cases.map((c) => [c.id, pillarsUnderSetting(c.date, c.time, APP_SETTINGS[0])]));
  const offsets = new Map(results.filter((r) => r.rule === "unified").map((r) => [r.id, r.offset]));
  const lines = [
    "# 만세력 오라클 비교 — 생성 표 (ORACLE_WRITE=1, tests/oracle/engineVsOracle.test.ts)", "",
    `- 무작위 ${cases.length}건 × 子 규칙 2종 = ${results.length}비교. 불일치 ${mismatches.length}건(가 ${mismatches.filter((r) => r.category === "가").length}, 나 ${mismatches.filter((r) => r.category === "나").length}).`,
    `- 절입 ±${BOUNDARY_MINUTES}분 경계: ${boundary.length}건, 그중 불일치 ${boundary.filter((r) => r.diff.length > 0).length}건 (oracle-jie-boundary-cases.csv).`, "",
    "## 다른 앱 설정과 결과가 달라지는 비율 (무작위 3,000건, 우리 기준 대비)", "",
    `| 설정 | ${periods.map((p) => `${p}`).join(" | ")} | 전체 | 달라지는 기둥(전체 건수) |`,
    `|---|${periods.map(() => "---").join("|")}|---|---|`,
  ];
  for (const setting of APP_SETTINGS.slice(1)) {
    const changed = new Map(periods.map((p) => [p, { n: 0, total: 0 }]));
    const byKey = { year: 0, month: 0, day: 0, hour: 0 };
    for (const c of cases) {
      const bucket = changed.get(period(offsets.get(c.id)!))!;
      bucket.total += 1;
      const a = ours.get(c.id)!.split(" ");
      const b = pillarsUnderSetting(c.date, c.time, setting).split(" ");
      if (a.join() !== b.join()) bucket.n += 1;
      KEYS.forEach((key, i) => { if (a[i] !== b[i]) byKey[key] += 1; });
    }
    const all = [...changed.values()].reduce((s, v) => ({ n: s.n + v.n, total: s.total + v.total }), { n: 0, total: 0 });
    const pct = (v: { n: number; total: number }) => `${(100 * v.n / Math.max(v.total, 1)).toFixed(1)}% (${v.n}/${v.total})`;
    lines.push(`| ${setting.label} | ${periods.map((p) => pct(changed.get(p)!)).join(" | ")} | ${pct(all)} | ${KEYS.map((k) => `${LABEL[k]} ${byKey[k]}`).join(", ")} |`);
  }
  writeFileSync(resolve(DOCS, "v5/oracle-comparison.md"), lines.join("\n") + "\n");
}
