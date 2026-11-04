// 점수 v2.1·v2.2 단계 비율 탐색(보정 도구, 결과는 score.ts에 손으로 옮긴다):
//   [TIER_CACHE=<폴더>] [BOUNDS=fn.2=0.3:0.6,...] pnpm exec tsx tools/p6c-ui2/optimize.ts [n=10000] [seed=20261103] [iterations=4000]
// 규칙: 항목마다 가장 좋은 단계 = 1(만점), 단계 순서 유지(이웃 단계 사이 최소 MIN_GAP, 기본 0.1), 가장 낮은 단계는 0까지. 총점은 40 + 항목 합 그대로(사후 늘림·줄임 없음).
// 목표(7유형 모두): 중앙값 70, 50 미만 4.5%, 90 이상 4.5% 근처(허용 70±3, 3~6%).
import { TIERS } from "../../src/lib/compat/score";
import { distribution, sampleTiers, table } from "./explore";
import { readFileSync } from "node:fs";
import { rng } from "../p4-compat/pairs";

const args = process.argv.slice(2);
const n = Number(args[0] ?? 10000), seed = Number(args[1] ?? 20261103), iterations = Number(args[2] ?? 4000);
// SEEDS=a,b: 여러 시드를 합쳐 잰다(표본 하나에 맞춘 값이 되지 않게). START=<json>: 시작 비율표(없으면 v2).
const seeds = process.env.SEEDS ? process.env.SEEDS.split(",").map(Number) : [seed];
const tiers: ReturnType<typeof sampleTiers>["tiers"] = {};
for (const sd of seeds) for (const [c, list] of Object.entries(sampleTiers(n, sd).tiers)) (tiers[c] ??= []).push(...list);
if (process.env.START) Object.assign(TIERS, JSON.parse(readFileSync(process.env.START, "utf8")));

// 항목별 단계 순서(좋은 것부터). 같은 칸에 둔 단계는 같은 값(합의 기준에서 같던 단계).
const ORDER = {
  element: [["filled+filled"], ["filled+free"], ["filled+missed", "free+free"], ["free+missed"], ["missed+missed"]],
  dayMaster: [["hap"], ["generate"], ["same"], ["control"]],
  dayBranch: [["hap"], ["hapMixed"], ["none"], ["friction"], ["clash"]],
  yearMonth: [["hap"], ["hapMixed"], ["none"], ["friction"], ["clash"]],
  role: [["exact"], ["near"], ["generate", "peer"], ["other"]],
  yinYang: [["0"], ["1"], ["2"], ["3"]],
  talk: [["talkSame"], ["talkDiff"]],
  fn: [["golden"], ["shared"], ["plain"], ["mirror"]],
  rhythm: [["0"], ["1"], ["2"], ["3"]],
} as const;
type Gaps = Record<keyof typeof ORDER, number[]>;
const MIN_GAP = Number(process.env.MIN_GAP ?? 0.1);
// BOUNDS=<항목>.<칸>=<최소>:<최대>,…: 그 칸(ORDER 순서, 0 = 가장 좋은 단계) 값을 범위 안에 묶는다(v2.2: MBTI '무난'·'E/I만 같음'에 부분 점수, '대화 결 다름' 0 고정).
const BOUNDS = (process.env.BOUNDS ?? "").split(",").filter(Boolean).map(b => { const [, k, j, lo, hi] = b.match(/^(\w+)\.(\d+)=([\d.]+):([\d.]+)$/)!; return { k: k as keyof typeof ORDER, j: Number(j), lo: Number(lo), hi: Number(hi) }; });
const inBounds = (k: keyof typeof ORDER, vals: number[]) => BOUNDS.every(b => b.k !== k || (vals[b.j] >= b.lo - 1e-9 && vals[b.j] <= b.hi + 1e-9));
function build(g: Gaps): typeof TIERS {
  // 비율은 0.01 단위(문서·코드에 그대로 옮길 값을 잰다).
  const values = (k: keyof typeof ORDER) => { let v = 1; return ORDER[k].map((_, i) => (i === 0 ? 1 : Math.round((v = Math.max(0, v - g[k][i - 1])) * 100) / 100)); };
  const obj = (k: keyof typeof ORDER) => Object.fromEntries(ORDER[k].flatMap((names, i) => names.map(name => [name, +values(k)[i].toFixed(3)])));
  const mb = { ...obj("talk"), ...obj("fn"), rhythm: values("rhythm").map(x => +x.toFixed(3)) };
  return { element: obj("element"), dayMaster: obj("dayMaster"), dayBranch: obj("dayBranch"), yearMonth: obj("yearMonth"), role: obj("role"), yinYang: values("yinYang").map(x => +x.toFixed(3)), mbti: mb } as unknown as typeof TIERS;
}
// LOSS=band: 허용 범위(중앙값 67~73, 꼬리 3~6%) 밖으로 벗어난 만큼만 센다(경계 탐색용). 기본: 가운데(70, 4.5%)에 가깝게.
const BAND = (process.env.BAND ?? "3.2,5.8").split(",").map(Number);
// MED=lo,hi: 중앙값 허용 범위(기본 67.5~72.5 = 70±2; v2.2는 68~70을 지키려고 67.6,70.4).
const MED = (process.env.MED ?? "67.5,72.5").split(",").map(Number);
const out = (x: number, lo: number, hi: number) => (x < lo ? lo - x : x > hi ? x - hi : 0);
const loss = (T: typeof TIERS) => distribution(tiers, T).reduce((sum, r) => sum + (process.env.LOSS === "band"
  ? (out(r.median, MED[0], MED[1]) * 3) ** 2 + (out(r.under50, BAND[0], BAND[1]) * 2) ** 2 + (out(r.over90, BAND[0], BAND[1]) * 2) ** 2 + 0.01 * ((r.under50 - 4.5) ** 2 + (r.over90 - 4.5) ** 2)
  : ((r.median - 70) / 1.5) ** 2 + ((r.under50 - 4.5) / 1) ** 2 + ((r.over90 - 4.5) / 1) ** 2), 0);
// REG: 목표 범위 안에서는 단계가 덜 합쳐지게(이웃 단계 간격이 0.1보다 좁으면 벌점). 결정: 목표 충족이 먼저, 단계 구분은 그다음.
const REG = Number(process.env.REG ?? 0);
const merged = (g: Gaps) => Object.values(g).flat().reduce((sum, x) => sum + Math.max(0, 0.1 - x) ** 2, 0) * 100;
// 시작점: v2(FLOOR 0.36) 단계 간격.
const start = (): Gaps => {
  const gapsOf = (vals: number[]) => vals.slice(1).map((v, i) => Math.max(MIN_GAP, vals[i] - v));
  const T = TIERS;
  return {
    element: gapsOf([T.element["filled+filled"], T.element["filled+free"], T.element["filled+missed"], T.element["free+missed"], T.element["missed+missed"]]),
    dayMaster: gapsOf([T.dayMaster.hap, T.dayMaster.generate, T.dayMaster.same, T.dayMaster.control]),
    dayBranch: gapsOf([T.dayBranch.hap, T.dayBranch.hapMixed, T.dayBranch.none, T.dayBranch.friction, T.dayBranch.clash]),
    yearMonth: gapsOf([T.yearMonth.hap, T.yearMonth.hapMixed, T.yearMonth.none, T.yearMonth.friction, T.yearMonth.clash]),
    role: gapsOf([T.role.exact, T.role.near, T.role.generate, T.role.other]),
    yinYang: gapsOf([...T.yinYang]), talk: gapsOf([T.mbti.talkSame, T.mbti.talkDiff]),
    fn: gapsOf([T.mbti.golden, T.mbti.shared, T.mbti.plain, T.mbti.mirror]), rhythm: gapsOf([...T.mbti.rhythm]),
  };
};
const r = rng(Number(process.env.SEARCH_SEED ?? 7));
const valuesOf = (g: number[]) => { let v = 1; return [1, ...g.map(x => (v -= x))]; };
let best = start();
for (const k of Object.keys(best) as (keyof Gaps)[]) if (!inBounds(k, valuesOf(best[k]))) throw new Error(`시작 비율표가 BOUNDS 밖: ${k} ${valuesOf(best[k])}`);
let bestLoss = loss(build(best)) + REG * merged(best);
for (let i = 0; i < iterations; i++) {
  const next = structuredClone(best) as Gaps, keys = Object.keys(next) as (keyof Gaps)[];
  const k = keys[Math.floor(r() * keys.length)], vals = valuesOf(next[k]), j = 1 + Math.floor(r() * (vals.length - 1));
  // 단계 값 하나를 옮긴다(가장 좋은 단계 1은 고정). 순서·최소 간격·0 이상을 지키지 못하면 버린다.
  vals[j] = Math.round((vals[j] + (r() - 0.5) * 0.3) * 100) / 100;
  if (vals[j] < 0) vals[j] = 0;
  if (vals.slice(1).some((v, x) => vals[x] - v < MIN_GAP - 1e-9) || !inBounds(k, vals)) continue;
  next[k] = vals.slice(1).map((v, x) => vals[x] - v);
  const l = loss(build(next)) + REG * merged(next);
  if (l <= bestLoss) { best = next; bestLoss = l; }
  if (i % 500 === 0) console.error(i, bestLoss.toFixed(2));
}
const T = build(best);
console.log(JSON.stringify(T));
console.log(table(distribution(tiers, T)));
