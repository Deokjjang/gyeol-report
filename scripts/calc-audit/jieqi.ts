/**
 * calc-audit 1-a 2부: 절기 시각 대조.
 *   엔진(lunar-javascript, src/lib/saju/solarTerms.ts getSolarTermInstants)
 *   ↔ 한국천문연구원(2023 역서 1차 자료 + 2000~2027 공공데이터 2차 자료, 분 단위 한국표준시)
 *   ↔ astronomy-engine(독립 천문 계산, 1900~2030 전부)
 * 실행: pnpm exec tsx scripts/calc-audit/jieqi.ts   (출력: docs/v5/calc-audit/jieqi-*.csv·json)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { getSolarTermInstants } from "../../src/lib/saju/solarTerms";
import { TERMS_24, termOfYear } from "./reference";

const here = new URL(".", import.meta.url);
const OUT = new URL("../../docs/v5/calc-audit/", import.meta.url);
const MIN = 60_000, HOUR = 60 * MIN;
const kst = (ms: number) => new Date(ms + 9 * HOUR).toISOString().slice(0, 19);
const readCsv = (name: string) => readFileSync(new URL(`data/${name}`, here), "utf8").split("\n").filter((l) => l && !l.startsWith("#")).slice(1).map((l) => l.split(","));
const JIE = new Set(["입춘", "경칩", "청명", "입하", "망종", "소서", "입추", "백로", "한로", "입동", "대설", "소한"]);

const engineCache = new Map<number, number[]>();
function engineTerms(year: number): number[] {
  let v = engineCache.get(year);
  if (!v) {
    v = [...getSolarTermInstants(`${year}-01-01T00:00:00+09:00`, `${year}-12-31T23:59:59+09:00`)];
    engineCache.set(year, v);
  }
  return v;
}
const nearest = (list: number[], t: number) => list.reduce((b, x) => (Math.abs(x - t) < Math.abs(b - t) ? x : b), list[0]);

// 1) KASI ↔ 엔진
const kasiRows: Record<string, string | number>[] = [];
for (const [file, source] of [["kasi-24terms-2023-almanac.csv", "KASI 2023 역서(1차)"], ["kasi-24terms-2000-2027-relay.csv", "KASI 공공데이터(2차)"]] as const) {
  for (const cols of readCsv(file)) {
    const [year, term] = cols;
    const kstMinute = file.includes("almanac") ? cols[3] : cols[2];
    if (source.includes("2차") && year === "2023") continue; // 2023은 1차 자료로만 센다(두 자료는 24개 모두 같음)
    const kasiStart = Date.parse(`${kstMinute}:00+09:00`);
    const e = nearest(engineTerms(Number(year)), kasiStart);
    const eSec = (e - kasiStart) / 1000; // 엔진 − KASI 분의 시작(초). 0~59면 KASI가 「분 버림」 표기와 일치
    const a = termOfYear(Number(year), TERMS_24.indexOf(term));
    kasiRows.push({ source, year, term, jie: JIE.has(term) ? "節" : "中氣", kasi: kstMinute, engine: kst(e), astro: kst(a), diffSecFromKasiMinuteStart: Math.round(eSec),
      astroSecFromKasiMinuteStart: Math.round((a - kasiStart) / 1000),
      truncMatch: eSec >= 0 && eSec < 60 ? 1 : 0, roundMatch: eSec >= -30 && eSec < 30 ? 1 : 0, engineMinuteDiff: Math.round((Math.floor((e + 9 * HOUR) / MIN) * MIN - (kasiStart + 9 * HOUR)) / MIN) });
  }
}
// 2) astronomy-engine ↔ 엔진(1900~2030, 24기 전부)
const astroRows: { year: number; term: string; jie: boolean; diffSec: number; engine: string; astro: string }[] = [];
for (let y = 1900; y <= 2030; y++) for (let k = 0; k < 24; k++) {
  const a = termOfYear(y, k);
  const e = nearest(engineTerms(new Date(a + 9 * HOUR).getUTCFullYear()), a);
  astroRows.push({ year: y, term: TERMS_24[k], jie: JIE.has(TERMS_24[k]), diffSec: Math.round((e - a) / 100) / 10, engine: kst(e), astro: kst(a) });
}
const maxAbs = (xs: number[]) => xs.reduce((m, x) => Math.max(m, Math.abs(x)), 0);
const kasiDiffMinutes = kasiRows.map((r) => Number(r.engineMinuteDiff));
const summary = {
  kasi: {
    terms: kasiRows.length, years: [...new Set(kasiRows.map((r) => r.year))].length,
    yearList: [...new Set(kasiRows.map((r) => r.year))].join(" "),
    engineMinuteEqualsKasiMinute: kasiDiffMinutes.filter((d) => d === 0).length,
    maxAbsMinuteDiff: maxAbs(kasiDiffMinutes),
    // KASI 분 표기를 「버림」으로 보면 엔진 초가 0~59초 안에 드는 비율, 「반올림」으로 보면 −30~29초.
    truncationFits: kasiRows.reduce((s, r) => s + Number(r.truncMatch), 0), roundingFits: kasiRows.reduce((s, r) => s + Number(r.roundMatch), 0),
    diffSecRange: [Math.min(...kasiRows.map((r) => Number(r.diffSecFromKasiMinuteStart))), Math.max(...kasiRows.map((r) => Number(r.diffSecFromKasiMinuteStart)))],
    jieOnly: { terms: kasiRows.filter((r) => r.jie === "節").length, maxAbsMinuteDiff: maxAbs(kasiRows.filter((r) => r.jie === "節").map((r) => Number(r.engineMinuteDiff))) },
    // KASI를 반올림 표기로 보면 「참값 − KASI 분」은 −30~+30초. 그 밖으로 나간 정도(초)가 실제 오차의 하한이다.
    engineOutsideRoundingSecMax: Math.max(0, ...kasiRows.map((r) => Math.abs(Number(r.diffSecFromKasiMinuteStart)) - 30)),
    astroRoundingFits: kasiRows.filter((r) => Number(r.astroSecFromKasiMinuteStart) >= -30 && Number(r.astroSecFromKasiMinuteStart) < 30).length,
    astroOutsideRoundingSecMax: Math.max(0, ...kasiRows.map((r) => Math.abs(Number(r.astroSecFromKasiMinuteStart)) - 30)),
  },
  astronomyEngine: {
    terms: astroRows.length, years: "1900-2030",
    maxAbsSec: maxAbs(astroRows.map((r) => r.diffSec)),
    jieMaxAbsSec: maxAbs(astroRows.filter((r) => r.jie).map((r) => r.diffSec)),
    byEra: Object.fromEntries([[1900, 1929], [1930, 1959], [1960, 1989], [1990, 2030]].map(([a, b]) => [`${a}-${b}`, maxAbs(astroRows.filter((r) => r.year >= a && r.year <= b).map((r) => r.diffSec))])),
    over60s: astroRows.filter((r) => Math.abs(r.diffSec) > 60).length,
  },
};
const csv = (rows: Record<string, unknown>[]) => [Object.keys(rows[0]).join(","), ...rows.map((r) => Object.values(r).join(","))].join("\n") + "\n";
writeFileSync(new URL("jieqi-kasi-vs-engine.csv", OUT), csv(kasiRows));
writeFileSync(new URL("jieqi-astronomy-vs-engine.csv", OUT), csv(astroRows));
writeFileSync(new URL("jieqi-summary.json", OUT), JSON.stringify(summary, null, 2) + "\n");
console.log(JSON.stringify(summary, null, 2));
