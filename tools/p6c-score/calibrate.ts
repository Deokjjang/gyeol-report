// 점수 v2 분포 측정: pnpm exec tsx tools/p6c-score/calibrate.ts [n=10000] [seed=20261103] [--json]
// 무작위 n쌍(tools/p4-compat/pairs.ts, 시간 미상 20%·MBTI 없음 10%/사람) × 7유형. 목표: 중앙값 70±3, 50 미만 ≤5%, 90 이상 약 5%.
// 절기 경계일 + 시간 미상(원국 불확정)은 calculateSaju가 throw → 제외(제외 수를 함께 적는다).
import type { MbtiType } from "../../src/data/knowledge-v5/schema";
import { calculateSaju } from "../../src/lib/saju/calculateSaju";
import { computeCompatScore, FLOOR, TIERS, tiersFor, type CompatCategory } from "../../src/lib/compat/score";
import { CATEGORIES, randomPairs, type RandPerson } from "../p4-compat/pairs";

const args = process.argv.slice(2).filter(a => !a.startsWith("--"));
const n = Number(args[0] ?? 10000), seed = Number(args[1] ?? 20261103), json = process.argv.includes("--json");
// --floor=x: 다른 FLOOR로 세부 점수를 다시 내려 잰다(보정 탐색용). 없으면 score.ts의 FLOOR.
const floorArg = process.argv.find(a => a.startsWith("--floor="));
const floor = floorArg ? Number(floorArg.slice(8)) : FLOOR;
Object.assign(TIERS, tiersFor(floor));
const saju = (p: RandPerson) => calculateSaju({ birthDate: p.birthDate, birthTime: p.birthTime, birthTimeUnknown: p.birthTimeUnknown, approximateBirthTimeSlot: "" as never, calendarType: "SOLAR", gender: p.gender, timezone: "Asia/Seoul" });
const q = (s: number[], p: number) => s[Math.min(s.length - 1, Math.floor(p * (s.length - 1)))];
const totals: Record<string, number[]> = {}, items: Record<string, Record<string, number[]>> = {};
let skipped = 0;
for (const [a, b] of randomPairs(n, seed)) {
  let sa, sb;
  try { sa = saju(a); sb = saju(b); } catch { skipped++; continue; }
  for (const c of CATEGORIES) {
    const s = computeCompatScore(c as CompatCategory, { saju: sa, name: "가람님", mbti: (a.mbtiType || null) as MbtiType | null, gender: a.gender }, { saju: sb, name: "나래님", mbti: (b.mbtiType || null) as MbtiType | null, gender: b.gender });
    (totals[c] ??= []).push(s.total);
    for (const it of s.items) ((items[c] ??= {})[it.key] ??= []).push(it.points / it.max);
  }
}
const rows = CATEGORIES.map(c => {
  const s = [...totals[c]].sort((x, y) => x - y), pct = (f: (x: number) => boolean) => +(100 * s.filter(f).length / s.length).toFixed(1);
  return { type: c, n: s.length, median: q(s, 0.5), p10: q(s, 0.1), p90: q(s, 0.9), min: s[0], max: s.at(-1)!, under50: pct(x => x < 50), over90: pct(x => x >= 90),
    items: Object.fromEntries(Object.entries(items[c]).map(([k, v]) => [k, +(v.reduce((x, y) => x + y, 0) / v.length).toFixed(3)])) };
});
if (json) console.log(JSON.stringify({ n, seed, floor, skipped, rows }, null, 1));
else {
  console.log(`n=${n} seed=${seed} FLOOR=${floor} 제외=${skipped}`);
  console.log("| 유형 | n | 중앙값 | p10 | p90 | 최소 | 최대 | 50 미만 | 90 이상 |\n|---|---|---|---|---|---|---|---|---|");
  for (const r of rows) console.log(`| ${r.type} | ${r.n} | ${r.median} | ${r.p10} | ${r.p90} | ${r.min} | ${r.max} | ${r.under50}% | ${r.over90}% |`);
  console.log("항목 평균(만점 대비):"); for (const r of rows) console.log(r.type, JSON.stringify(r.items));
}
