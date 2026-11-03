/**
 * P6c 지표 표: 원고 폴더(기본 P6b 최종 7권)를 measure.ts로 재고 JSON + 표를 낸다.
 *   pnpm exec tsx tools/p6c/baseline.ts                                  → docs/v5/trial/p6c/baseline.json (P6b 최종본)
 *   pnpm exec tsx tools/p6c/baseline.ts --dir docs/v5/trial/p6c/r1 --out after.json
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { P6B_CASES } from "../p6b/cases";
import { caseBrief, crossOverlap, dbCorpora, loadKnowledge, measureBook, readBook, ROOT, type BookMeasure } from "./measure";

const arg = (name: string, d: string) => (process.argv.includes(name) ? process.argv[process.argv.indexOf(name) + 1] : d);
const DIR = join(ROOT, arg("--dir", "docs/v5/trial/p6b/final"));
const OUT = join(ROOT, "docs/v5/trial/p6c", arg("--out", "baseline.json"));
const k = loadKnowledge(join(ROOT, "src/data/knowledge-v5"));
const corp = dbCorpora();
const order = P6B_CASES.map(c => c.id);
const books = new Map<string, ReturnType<typeof readBook>>();
const rows: BookMeasure[] = [];
for (const c of P6B_CASES) {
  const p = join(DIR, `${c.id}.final.md`);
  if (!existsSync(p)) continue;
  const chapters = readBook(p); books.set(c.id, chapters);
  rows.push(measureBook(c.id, chapters, caseBrief(c, k), corp));
}
const cross = crossOverlap(order, books);
mkdirSync(join(ROOT, "docs/v5/trial/p6c"), { recursive: true });
writeFileSync(OUT, JSON.stringify({ dir: DIR.replace(`${ROOT}/`, ""), books: rows, cross }, null, 1) + "\n");
const label = (id: string) => P6B_CASES.find(c => c.id === id)!.label;
console.log("| 권 | 분량 | ① DB 원문 20자(넓게) | ③ 뜻 공식(+그래서 당신에게는) | ④ 명리학에서 · 앞에서 본 | ⑤ 별명 · 학교 · 과거/관계 단정 | 덧: 농사 · 약어 · 음양 · 오행 없음 · 대운 위치 · 1장 그림 |");
console.log("|---|---|---|---|---|---|---|");
for (const r of rows) console.log(`| ${label(r.id)} | ${r.chars.toLocaleString()} | ${r.dbCopy} (${r.dbCopyWide}) | ${r.formula} (${r.fullFormula}) | ${r.myeongriPrefix} · ${r.backref} | ${r.nickname} · ${r.school} · ${r.pastOrPresume} | ${r.extra.farming} · ${r.extra.bareMbtiCode} · ${r.extra.yinYang} · ${r.extra.elementAbsent} · ${r.extra.dayunPhase} · ${r.extra.secondImage} |`);
const sum = (f: (r: BookMeasure) => number) => rows.reduce((a, r) => a + f(r), 0);
console.log(`| 합계 | ${sum(r => r.chars).toLocaleString()} | ${sum(r => r.dbCopy)} (${sum(r => r.dbCopyWide)}) | ${sum(r => r.formula)} (${sum(r => r.fullFormula)}) | ${sum(r => r.myeongriPrefix)} · ${sum(r => r.backref)} | ${sum(r => r.nickname)} · ${sum(r => r.school)} · ${sum(r => r.pastOrPresume)} | ${sum(r => r.extra.farming)} · ${sum(r => r.extra.bareMbtiCode)} · ${sum(r => r.extra.yinYang)} · ${sum(r => r.extra.elementAbsent)} · ${sum(r => r.extra.dayunPhase)} · ${sum(r => r.extra.secondImage)} |`);
console.log("\n② 같은 고객 다른 상품 겹침(뒤 책 문장 기준, 5-gram 자카드 ≥ 0.5):");
for (const x of cross) console.log(`- ${x.a} → ${x.b}: ${x.overlap}/${x.of}`);
if (process.argv.includes("--samples")) for (const r of rows) console.log(`\n## ${r.id}\n${JSON.stringify(r.samples, null, 1)}`);
