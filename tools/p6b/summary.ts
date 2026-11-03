/**
 * P6b 시험 요약: docs/v5/trial/p6b/*.metrics.json·*.final.md → 지표 표(표준 출력, 보고서용) + docs/v5/p6b-read.md(로컬 열람 링크).
 * 같은 고객의 상품 간 겹침(E-1): 같은 사람이 든 책끼리 같은 문장(20자 이상) 수와 14자 이상 같은 구절이 있는 문장 비율.
 *   pnpm exec tsx tools/p6b/summary.ts [--base http://localhost:3100]
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { splitSentences } from "../../src/lib/writer/safety/patterns";
import { norm } from "../../src/lib/writer/safety/sentences";
import { KRW_PER_USD } from "../p6/metrics";
import { buildBrief, loadKnowledge } from "../../src/lib/brief";
import { normalizeReportInputPayload } from "../../src/lib/report-generation/reportInputAdapter";
import { payloadToBriefInput } from "../../src/lib/writer/book";
import { parseChapters } from "../../src/lib/writer/format";
import { p6bMetric } from "../../src/lib/writer/safety/metrics";
import { FAMILY_MEMBER, RURAL_PROP } from "../../src/lib/writer/safety/patterns";
import { P6B_CASES } from "./cases";

const ROOT = resolve(import.meta.dirname, "../..");
const DIR = join(ROOT, "docs/v5/trial/p6b");
const BASE = process.argv.includes("--base") ? process.argv[process.argv.indexOf("--base") + 1] : "http://localhost:3100";
type M = { case: string; label: string; reportId: string; chars: number; wallMs: number; costUsd: number; tokens: { input: number; cachedInput: number; output: number }; deletions: number; deterministicChapters: string[]; priorBooks: number; fallback: unknown; writer?: { model: string } | null;
  p6b: { chars: number; target: [number, number]; inTarget: boolean; similes: { n: number; count: number }[]; maxSimile: number; chaptersOverSimile: number; banned: Record<string, number>; bannedSamples: string[]; termFirst: { terms: number; ok: number; rate: number; misses: readonly string[] } | null; subheadingsOk: number; structure: unknown[]; paragraphsOk: number; sectionsTotal: number; byRule: Record<string, number>; coreImage: string } };
const books = P6B_CASES.map(c => join(DIR, `${c.id}.metrics.json`)).filter(existsSync).map(p => JSON.parse(readFileSync(p, "utf8")) as M).filter(m => m.reportId && m.p6b);
// 첫 등장 형식·비유 수는 최종 원고로 다시 잰다(지표 정의를 고친 뒤에도 같은 기준으로 비교, 브리프는 결정론으로 다시 만든다).
const k = loadKnowledge(join(ROOT, "src/data/knowledge-v5"));
for (const m of books) {
  const c = P6B_CASES.find(x => x.id === m.case)!;
  const n = normalizeReportInputPayload(c.payload, { now: () => new Date("2026-11-03T03:00:00Z") });
  if (!n.ok) continue;
  const brief = buildBrief(payloadToBriefInput(n.value as never, "2026-11-03") as never, k);
  const r = p6bMetric(brief, parseChapters(readFileSync(join(DIR, `${m.case}.final.md`), "utf8")), [RURAL_PROP, ...(m.case.startsWith("pair") ? [] : [FAMILY_MEMBER]), /배지|제시되지 않/, /\*\*/]);
  m.p6b.termFirst = r.termFirst;
}
const text = (id: string) => readFileSync(join(DIR, `${id}.final.md`), "utf8").split("\n").filter(l => !l.startsWith("#")).join("\n");
const sentences = (id: string) => splitSentences(text(id)).map(norm).filter(s => s.length >= 20);

// 같은 사람이 든 책(이름 기준): c1 하람 = 종합·커리어·궁합, c2 서윤 = 궁합·세운.
const PERSON: Record<string, string[]> = { "c1-full": ["하람"], "c1-career": ["하람"], "pair-love": ["하람", "서윤"], "c2-annual": ["서윤"], "y-love": ["도현"], "x-major": ["수진"], "me-full": ["장덕민"] };
const pairs: { a: string; b: string; same: number; run14: number; of: number }[] = [];
for (let i = 0; i < books.length; i++) for (let j = i + 1; j < books.length; j++) {
  const a = books[i].case, b = books[j].case;
  if (!PERSON[a]?.some(p => PERSON[b]?.includes(p))) continue;
  const sa = sentences(a), sb = sentences(b), setA = new Set(sa);
  const grams = new Set<string>(); for (const s of sa) for (let k = 0; k + 14 <= s.length; k++) grams.add(s.slice(k, k + 14));
  pairs.push({ a, b, same: sb.filter(s => setA.has(s)).length, run14: sb.filter(s => { for (let k = 0; k + 14 <= s.length; k++) if (grams.has(s.slice(k, k + 14))) return true; return false; }).length, of: sb.length });
}

const rows = books.map(m => `| ${m.label} | ${m.p6b.chars.toLocaleString()} (${m.p6b.target.map(x => x / 1000).join("~")}천) ${m.p6b.inTarget ? "✓" : "✗"} | ${m.p6b.maxSimile} (${m.p6b.chaptersOverSimile}장 초과) | ${Object.values(m.p6b.banned).reduce((a, b) => a + b, 0)} | ${m.p6b.termFirst ? `${m.p6b.termFirst.ok}/${m.p6b.termFirst.terms}` : "-"} | ${m.p6b.subheadingsOk}/${m.p6b.structure.length} · ${m.p6b.paragraphsOk}/${m.p6b.sectionsTotal} | ${m.deletions} | ${m.deterministicChapters.length} | ${Math.round(m.wallMs / 1000)}초 | ${m.tokens.input}/${m.tokens.cachedInput}/${m.tokens.output} | $${m.costUsd.toFixed(4)} (${Math.round(m.costUsd * KRW_PER_USD)}원) |`);
console.log(["| 권 | 분량(목표) | 장별 비유 최대(1 초과 장) | 금지어 잔여 | 용어 첫 등장 형식 | 소제목 2~3 · 문단 2~3 | 삭제 | 결정론 장 | 소요 | 입력/캐시/출력 | 원가 |", "|---|---|---|---|---|---|---|---|---|---|---|", ...rows].join("\n"));
console.log("\n같은 고객 상품 간 겹침(뒤 책 문장 기준):");
for (const p of pairs) console.log(`- ${p.a} ↔ ${p.b}: 같은 문장 ${p.same}/${p.of}, 14자 이상 같은 구절이 든 문장 ${p.run14}/${p.of} (${(p.run14 / Math.max(1, p.of) * 100).toFixed(1)}%)`);
const total = books.reduce((a, m) => a + m.costUsd, 0);
console.log(`\n합계 $${total.toFixed(4)} (${Math.round(total * KRW_PER_USD)}원), 권당 평균 ${Math.round(total / Math.max(1, books.length) * KRW_PER_USD)}원`);
for (const m of books) if (m.p6b.termFirst?.misses.length) console.log(`첫 등장 형식 미준수 ${m.case}: ${m.p6b.termFirst.misses.join(", ")}`);
for (const m of books) if (m.p6b.bannedSamples.length) console.log(`금지어 ${m.case}: ${m.p6b.bannedSamples.join(" / ")}`);

writeFileSync(join(ROOT, "docs/v5/p6b-read.md"), [
  "# P6b 읽기 목록",
  "",
  "로컬 서버를 띄운 뒤(`pnpm dev:v5`, 포트 3100) 링크를 엽니다. 링크는 개발 전용 로그인으로 시험 계정 쿠키를 심고 책으로 갑니다.",
  "작가는 모두 Sonnet 5.5(운영 작가)이고 책 한 권 = 호출 1회입니다. 지표는 `p6b-report.md`, 원고 원문은 `docs/v5/trial/p6b/<사례>.final.md`.",
  "",
  "| 상품 | 사례 | 링크 |",
  "|---|---|---|",
  ...books.map(m => `| ${m.label.split(" · ")[0]} | ${m.label.split(" · ").slice(1).join(" · ")} | ${BASE}/dev/v5-login?next=/reports/${m.reportId} |`),
  "",
  "읽으면서 볼 것: 용어를 뜻으로 설명하는지(첫 등장 형식), 그림 별명·옛날 소품이 없는지, 핵심 이미지 한 줄, 장마다 비유 1개 이하, 소제목 2~3개 × 문단 2~3개,",
  "상품별 핵심(커리어 판정·다섯 갈래·3단 추천·재물·명예 / 연애 만날 사람·조합·지향점 / 궁합 결론 먼저·역할 / 대운 지난 3년·10년 설계·연도별 지침 / 세운 설계도·월별·지난 달 돌아보기).",
  "",
].join("\n"));
console.log("\ndocs/v5/p6b-read.md");
