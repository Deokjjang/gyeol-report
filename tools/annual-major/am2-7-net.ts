/**
 * AM2-7 6부 1 다시 쓰기 순익(호출 0): am2-6-net의 맞춤을 고쳤다 — 첫 원고 묶음의 소제목 번호를 책 번호(발행 원고의 소제목 순서)로 바꾼 뒤,
 * 깃발을 (규칙, 장, 문장 글자)로 맞댄다. 같은 문장에 같은 규칙이 남으면 「남음」, 첫 원고에만 있으면 「고침」, 발행에만 있으면 「만듦」.
 * (am2-6-net은 (규칙, 장.소제목) 개수 차이로 셌다 — 문단을 나누거나 묶음마다 번호가 0부터면 같은 깃발이 고침 · 만듦에 한 번씩 잡혔다.)
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/annual-major/am2-7-net.ts P6-annual-1 [P6-…] [--list]
 */
import { netOf } from "./am2-6-net";
import { CUT_ONLY_RULES, FIX_BOUNDARY, FIX_RULES, MINOR_RULES, PIGGYBACK_RULES, type ChunkFlag } from "../../src/lib/writer/chunked/check";
const tier = (r: string) => (FIX_BOUNDARY.has(r) ? "경계" : FIX_RULES.has(r) ? "알림" : PIGGYBACK_RULES.has(r) || CUT_ONLY_RULES.has(r) || MINOR_RULES.has(r) ? "경미" : "차단");
const TIERS = ["차단", "경계", "알림", "경미"] as const;
const key = (f: ChunkFlag) => `${f.rule}|${f.chapter}|${f.sentence.replace(/\([^)]*\)/g, "").replace(/[^가-힣A-Za-z0-9]/g, "").slice(0, 40)}`;
export function net7(folder: string) {
  const r = netOf(folder), first = [...r.fixedAll, ...r.keptAll], final = [...r.madeAll, ...r.keptFinal];
  const A = new Map(first.map(f => [key(f), f])), B = new Map(final.map(f => [key(f), f]));
  const rows = Object.fromEntries(TIERS.map(t => [t, { first: 0, final: 0, fixed: 0, made: 0, kept: 0 }])) as Record<string, { first: number; final: number; fixed: number; made: number; kept: number }>;
  const made: ChunkFlag[] = [], fixed: ChunkFlag[] = [];
  for (const [k, f] of A) { const t = rows[tier(f.rule)]; t.first++; if (B.has(k)) t.kept++; else { t.fixed++; fixed.push(f); } }
  for (const [k, f] of B) { const t = rows[tier(f.rule)]; t.final++; if (!A.has(k)) { t.made++; made.push(f); } }
  return { id: folder, rows, made, fixed };
}
if (process.argv[1]?.endsWith("am2-7-net.ts")) {
  const list = process.argv.includes("--list");
  console.log("| 책 | 차단 첫 원고 → 발행(고침 · 만듦) | 경계 | 알림 | 경미 |\n|---|---|---|---|---|");
  for (const folder of process.argv.slice(2).filter(a => !a.startsWith("--"))) { const x = net7(folder);
    console.log(`| ${x.id} | ${TIERS.map(t => { const v = x.rows[t]; return `${v.first} → ${v.final} (${v.fixed} · ${v.made})`; }).join(" | ")} |`);
    if (list) for (const f of x.made.filter(m => tier(m.rule) !== "경미")) console.log(`  만듦 ${tier(f.rule)} ${f.chapter}.${f.section}.${f.paragraph} ${f.rule}: ${f.sentence.slice(0, 100)}`); }
}
