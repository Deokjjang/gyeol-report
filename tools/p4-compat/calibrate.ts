// C2 매듭 계산·분포 측정: pnpm exec tsx tools/p4-compat/calibrate.ts [n] [--measure]
// 무작위 n쌍(시드 20261029) × 7유형의 원점수 분위 [0,10,50,90,100]%를 출력한다(score.ts RAW_KNOTS에 고정).
// --measure: 고정된 매듭으로 최종 점수 분포·구간 비율·구성요소 수준을 잰다(별도 시드 20261030으로 표본 밖 확인 포함).
import type { MbtiType } from "../../src/data/knowledge-v5/schema";
import { loadKnowledge } from "../../src/lib/brief";
import { calculateSaju } from "../../src/lib/saju/calculateSaju";
import { computeCompatScore, type CompatCategory, type ConventionalFit } from "../../src/lib/compat/score";
import { CATEGORIES, randomPairs, stats, type RandPerson } from "./pairs";

const n = Number(process.argv[2] ?? 1000), measure = process.argv.includes("--measure");
const k = loadKnowledge();
export const conventional: ConventionalFit = (a, b) => k.mbti.get(a)?.conventionalCompat.find(c => c.type === b)?.fit ?? null;
const saju = (p: RandPerson) => calculateSaju({ birthDate: p.birthDate, birthTime: p.birthTime, birthTimeUnknown: p.birthTimeUnknown, approximateBirthTimeSlot: "" as never, calendarType: "SOLAR", gender: p.gender, timezone: "Asia/Seoul" });
function run(seed: number) {
  const raw: Record<string, number[]> = {}, total: Record<string, number[]> = {}, all: number[] = [];
  const levels: Record<string, Record<string, number>> = {}; let bandViolations = 0;
  for (const [a, b] of randomPairs(n, seed)) {
    let sa, sb;
    try { sa = saju(a); sb = saju(b); } catch { continue; } // 절기 경계일 + 시간 미상(원국 불확정)은 제외
    for (const c of CATEGORIES) {
      const s = computeCompatScore(c as CompatCategory, { saju: sa, name: "A님", mbti: (a.mbtiType || null) as MbtiType | null }, { saju: sb, name: "B님", mbti: (b.mbtiType || null) as MbtiType | null }, { conventional });
      (raw[c] ??= []).push(s.raw); (total[c] ??= []).push(s.total); all.push(s.total);
      for (const comp of s.components) { const l = (levels[comp.key] ??= {}); l[comp.level] = (l[comp.level] ?? 0) + 1; }
      if ((s.total >= 75 && !s.components.some(x => x.level === "좋음")) || (s.total < 45 && !s.components.some(x => x.level === "조율"))) bandViolations++;
    }
  }
  return { raw, total, all, levels, bandViolations };
}
const r = run(20261029);
const q = (xs: number[], p: number) => { const s = [...xs].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(p * (s.length - 1)))]; };
if (!measure) {
  console.log(JSON.stringify(Object.fromEntries(CATEGORIES.map(c => [c, [0, 0.1, 0.5, 0.9, 1].map(p => q(r.raw[c], p))])), null, 0));
} else {
  const out = (x: ReturnType<typeof run>) => ({ overall: stats(x.all), byCategory: Object.fromEntries(CATEGORIES.map(c => [c, stats(x.total[c])])),
    bands: Object.fromEntries([[90, 101], [75, 90], [60, 75], [45, 60], [0, 45]].map(([lo, hi]) => [`${lo}-${hi - 1}`, +(x.all.filter(t => t >= lo && t < hi).length / x.all.length).toFixed(3)])),
    componentLevels: x.levels, bandViolations: x.bandViolations });
  console.log(JSON.stringify({ calibration: out(r), holdout: out(run(20261030)) }, null, 1));
}
