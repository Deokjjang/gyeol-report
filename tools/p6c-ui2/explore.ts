// 점수 v2.1·v2.2 보정 탐색: [TIER_CACHE=<폴더>] pnpm exec tsx tools/p6c-ui2/explore.ts [n=10000] [seed=20261103] [--freq] [--tiers=<json 파일>]
// 무작위 쌍의 항목 단계를 한 번만 구해 두고(compatTiers), 비율표(TIERS)만 바꿔 총점 분포를 빠르게 잰다.
// 총점 = 40 + 항목 점수 합(score.ts itemPoints: 사주 항목은 round(비율 × 만점), MBTI는 세 부분 점수 합; MBTI 없으면 itemMax가 나눈 만점) — score.ts와 같은 식이다.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import type { MbtiType } from "../../src/data/knowledge-v5/schema";
import { calculateSaju } from "../../src/lib/saju/calculateSaju";
import { BASE_SCORE, compatTiers, itemPoints, TIERS, type CompatCategory, type CompatTiers, type ItemKey } from "../../src/lib/compat/score";
import { CATEGORIES, randomPairs, type RandPerson } from "../p4-compat/pairs";

const args = process.argv.slice(2).filter(a => !a.startsWith("--"));
const n = Number(args[0] ?? 10000), seed = Number(args[1] ?? 20261103);
const saju = (p: RandPerson) => calculateSaju({ birthDate: p.birthDate, birthTime: p.birthTime, birthTimeUnknown: p.birthTimeUnknown, approximateBirthTimeSlot: "" as never, calendarType: "SOLAR", gender: p.gender, timezone: "Asia/Seoul" });

// TIER_CACHE=<폴더>: 시드별 단계 표본을 JSON으로 저장·재사용한다(단계는 비율표와 무관해 한 번만 구하면 된다).
export function sampleTiers(count: number, s: number): { tiers: Record<string, CompatTiers[]>; skipped: number } {
  const file = process.env.TIER_CACHE ? join(process.env.TIER_CACHE, `tiers-${count}-${s}.json`) : null;
  if (file && existsSync(file)) return JSON.parse(readFileSync(file, "utf8"));
  const out: Record<string, CompatTiers[]> = {};
  let skipped = 0;
  for (const [a, b] of randomPairs(count, s)) {
    let sa, sb;
    try { sa = saju(a); sb = saju(b); } catch { skipped++; continue; }
    for (const c of CATEGORIES) (out[c] ??= []).push(compatTiers(c as CompatCategory, { saju: sa, name: "가람님", mbti: (a.mbtiType || null) as MbtiType | null, gender: a.gender }, { saju: sb, name: "나래님", mbti: (b.mbtiType || null) as MbtiType | null, gender: b.gender }));
  }
  if (file) { mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, JSON.stringify({ tiers: out, skipped })); }
  return { tiers: out, skipped };
}
// score.ts와 같은 식(itemPoints): MBTI는 세 부분 점수(반올림)의 합.
export const total = (c: CompatCategory, t: CompatTiers, T: typeof TIERS) => BASE_SCORE + Object.values(itemPoints(c, t, T)).reduce((sum, x) => sum + x!, 0);
// 빠른 계산(값은 total과 같다): 항목 점수는 그 항목의 단계와 MBTI 유무(사주 항목 만점이 달라짐)에만 달려 있다.
// 표본마다 항목 단계를 번호로 한 번 바꿔 두고, 비율표마다 (항목, 단계, MBTI 유무) 점수표를 itemPoints로 만들어 더한다.
const ITEMS: readonly ItemKey[] = ["element", "dayMaster", "dayBranch", "yearMonth", "role", "yinYang", "mbti"];
const keyOf = (k: ItemKey, t: CompatTiers) => (k === "yearMonth" ? t.yearMonth.join("|") : k === "mbti" ? JSON.stringify(t.mbti) : String(t[k]));
type Encoded = { idx: Uint16Array[]; examples: CompatTiers[][]; withMbti: Uint8Array };
const encoded = new WeakMap<CompatTiers[], Encoded>();
function encode(list: CompatTiers[]): Encoded {
  const hit = encoded.get(list);
  if (hit) return hit;
  const idx = ITEMS.map(() => new Uint16Array(list.length)), examples: CompatTiers[][] = ITEMS.map(() => []);
  ITEMS.forEach((k, ki) => { const seen = new Map<string, number>(); list.forEach((t, i) => { const key = keyOf(k, t); let j = seen.get(key); if (j === undefined) { seen.set(key, (j = seen.size)); examples[ki].push(t); } idx[ki][i] = j; }); });
  const out = { idx, examples, withMbti: Uint8Array.from(list, t => (t.mbti ? 1 : 0)) };
  encoded.set(list, out);
  return out;
}
const ANY_MBTI = { talk: "talkSame", fn: "golden", rhythm: 0 } as const;
export function totals(c: CompatCategory, list: CompatTiers[], T: typeof TIERS): number[] {
  const e = encode(list);
  // pts[항목][단계 번호 × 2 + MBTI 유무]
  const pts = ITEMS.map((k, ki) => e.examples[ki].flatMap(ex => [0, 1].map(w => (k === "mbti" ? (w && ex.mbti ? itemPoints(c, ex, T).mbti! : 0) : itemPoints(c, { ...ex, mbti: w ? (ex.mbti ?? ANY_MBTI) : null }, T)[k]!))));
  return list.map((_, i) => { let s = BASE_SCORE; for (let ki = 0; ki < ITEMS.length; ki++) s += pts[ki][e.idx[ki][i] * 2 + e.withMbti[i]]; return s; });
}
const q = (s: number[], p: number) => s[Math.min(s.length - 1, Math.floor(p * (s.length - 1)))];
export function distribution(tiers: Record<string, CompatTiers[]>, T: typeof TIERS) {
  return CATEGORIES.map(c => {
    const s = totals(c as CompatCategory, tiers[c], T).sort((x, y) => x - y), pct = (f: (x: number) => boolean) => +(100 * s.filter(f).length / s.length).toFixed(1);
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
