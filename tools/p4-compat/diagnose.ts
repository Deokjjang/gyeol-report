// C1 진단: 현행 v4 compatibilityIndex.ts 분포와 원인(하위 점수 기준점·상한·요인 빈도). pnpm exec tsx tools/p4-compat/diagnose.ts [n]
import { compatibilityNarrativeEvidence } from "../../src/lib/interpretation-v4/compatibilityEvidence";
import { buildCompatibilityIndex } from "../../src/lib/interpretation-v4/compatibilityIndex";
import { CATEGORIES, randomPairs, stats, toPayload } from "./pairs";

const n = Number(process.argv[2] ?? 1000);
const totals: number[] = [], sub: Record<string, number[]> = {}, factorHits: Record<string, number> = {}, factorSum: Record<string, number> = {};
let failed = 0, zeroFactorSubs = 0, subs = 0;
const byCat: Record<string, number[]> = {};
for (const [a, b] of randomPairs(n)) for (const c of CATEGORIES) {
  const e = compatibilityNarrativeEvidence(toPayload(a, b, c));
  if (!e.ok) { failed++; continue; }
  const idx = buildCompatibilityIndex(e);
  totals.push(idx.total); (byCat[c] ??= []).push(idx.total);
  for (const s of idx.scores) {
    (sub[s.label] ??= []).push(s.value); subs++; if (!s.factors.length) zeroFactorSubs++;
    for (const f of s.factors) { factorHits[f.factor] = (factorHits[f.factor] ?? 0) + 1; factorSum[f.factor] = (factorSum[f.factor] ?? 0) + f.value; }
  }
}
const N = totals.length;
console.log(JSON.stringify({ pairs: n, evaluated: N, failed, total: stats(totals), in50to60: +(totals.filter(t => t >= 50 && t <= 60).length / N).toFixed(3),
  byCategory: Object.fromEntries(Object.entries(byCat).map(([k, v]) => [k, stats(v)])),
  subscores: Object.fromEntries(Object.entries(sub).map(([k, v]) => [k, stats(v)])),
  subscoresWithNoFactor: +(zeroFactorSubs / subs).toFixed(3),
  factors: Object.fromEntries(Object.entries(factorHits).sort((x, y) => y[1] - x[1]).map(([k, v]) => [k, { rate: +(v / N).toFixed(3), avg: +(factorSum[k] / v).toFixed(2) }])) }, null, 1));
