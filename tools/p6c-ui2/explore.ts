// 점수 v2.1 보정 탐색: pnpm exec tsx tools/p6c-ui2/explore.ts [n=10000] [seed=20261103] [--freq] [--tiers=<json 파일>]
// 무작위 쌍의 항목 단계를 한 번만 구해 두고(compatTiers), 비율표(TIERS)만 바꿔 총점 분포를 빠르게 잰다.
// 총점 = 40 + Σ round(비율 × 항목 만점)(MBTI 없으면 itemMax가 나눈 만점) — score.ts와 같은 식이다.
import { readFileSync } from "node:fs";
import type { MbtiType } from "../../src/data/knowledge-v5/schema";
import { calculateSaju } from "../../src/lib/saju/calculateSaju";
import { BASE_SCORE, compatTiers, itemFractions, itemMax, TIERS, type CompatCategory, type CompatTiers, type ItemKey } from "../../src/lib/compat/score";
import { CATEGORIES, randomPairs, type RandPerson } from "../p4-compat/pairs";

const args = process.argv.slice(2).filter(a => !a.startsWith("--"));
const n = Number(args[0] ?? 10000), seed = Number(args[1] ?? 20261103);
const saju = (p: RandPerson) => calculateSaju({ birthDate: p.birthDate, birthTime: p.birthTime, birthTimeUnknown: p.birthTimeUnknown, approximateBirthTimeSlot: "" as never, calendarType: "SOLAR", gender: p.gender, timezone: "Asia/Seoul" });

export function sampleTiers(count: number, s: number) {
  const out: Record<string, CompatTiers[]> = {};
  let skipped = 0;
  for (const [a, b] of randomPairs(count, s)) {
    let sa, sb;
    try { sa = saju(a); sb = saju(b); } catch { skipped++; continue; }
    for (const c of CATEGORIES) (out[c] ??= []).push(compatTiers(c as CompatCategory, { saju: sa, name: "가람님", mbti: (a.mbtiType || null) as MbtiType | null, gender: a.gender }, { saju: sb, name: "나래님", mbti: (b.mbtiType || null) as MbtiType | null, gender: b.gender }));
  }
  return { tiers: out, skipped };
}
const total = (c: CompatCategory, t: CompatTiers, T: typeof TIERS) => {
  const f = itemFractions(c, t, T), m = itemMax(c, !!t.mbti);
  return BASE_SCORE + (Object.keys(m) as ItemKey[]).reduce((sum, k) => sum + Math.round(f[k]! * m[k]!), 0);
};
const q = (s: number[], p: number) => s[Math.min(s.length - 1, Math.floor(p * (s.length - 1)))];
export function distribution(tiers: Record<string, CompatTiers[]>, T: typeof TIERS) {
  return CATEGORIES.map(c => {
    const s = tiers[c].map(t => total(c as CompatCategory, t, T)).sort((x, y) => x - y), pct = (f: (x: number) => boolean) => +(100 * s.filter(f).length / s.length).toFixed(1);
    const mean = s.reduce((x, y) => x + y, 0) / s.length, sd = Math.sqrt(s.reduce((x, y) => x + (y - mean) ** 2, 0) / s.length);
    return { type: c, n: s.length, median: q(s, 0.5), p10: q(s, 0.1), p90: q(s, 0.9), min: s[0], max: s.at(-1)!, under50: pct(x => x < 50), over90: pct(x => x >= 90), sd: +sd.toFixed(1) };
  });
}
export const table = (rows: ReturnType<typeof distribution>) => ["| 유형 | n | 중앙값 | p10 | p90 | 최소 | 최대 | 표준편차 | 50 미만 | 90 이상 |", "|---|---|---|---|---|---|---|---|---|---|",
  ...rows.map(r => `| ${r.type} | ${r.n.toLocaleString()} | ${r.median} | ${r.p10} | ${r.p90} | ${r.min} | ${r.max} | ${r.sd} | ${r.under50}% | ${r.over90}% |`)].join("\n");

if (import.meta.url === `file://${process.argv[1]}`) {
  const { tiers, skipped } = sampleTiers(n, seed);
  console.log(`n=${n} seed=${seed} 제외=${skipped}`);
  if (process.argv.includes("--freq")) {
    // 단계 빈도(연애 기준; 역할은 유형마다 다르므로 유형별).
    const freq = (key: (t: CompatTiers) => string, list: CompatTiers[]) => { const m = new Map<string, number>(); for (const t of list) m.set(key(t), (m.get(key(t)) ?? 0) + 1); return Object.fromEntries([...m].sort().map(([k, v]) => [k, +(100 * v / list.length).toFixed(1)])); };
    const love = tiers.love;
    console.log("element", freq(t => t.element, love)); console.log("dayMaster", freq(t => t.dayMaster, love)); console.log("dayBranch", freq(t => t.dayBranch, love));
    console.log("year", freq(t => t.yearMonth[0], love)); console.log("month", freq(t => t.yearMonth[1], love)); console.log("yinYang", freq(t => String(t.yinYang), love));
    console.log("mbti talk", freq(t => t.mbti?.talk ?? "-", love)); console.log("mbti fn", freq(t => t.mbti?.fn ?? "-", love)); console.log("mbti rhythm", freq(t => String(t.mbti?.rhythm ?? "-"), love));
    for (const c of CATEGORIES) console.log("role", c, freq(t => t.role, tiers[c]));
  }
  const file = process.argv.find(a => a.startsWith("--tiers="));
  const T = file ? JSON.parse(readFileSync(file.slice(8), "utf8")) as typeof TIERS : TIERS;
  console.log(table(distribution(tiers, T)));
}
