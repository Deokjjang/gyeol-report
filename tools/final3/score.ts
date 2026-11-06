/**
 * 측정 채점(최종판3 5, 호출 0): review-measure 결과 + 알려진 문제 목록 → 범주별 재현율(결정론/검수/합), 목록 밖 지적(오탐 판정용).
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/final3/score.ts claude-haiku-5-5 [--extra]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { splitSentences } from "../../src/lib/writer/safety/patterns";
import { BLOCKING, KNOWN3, knownPrev, type Cat, type Known } from "./known";

type Num = { n: number; chapter: number; section: number; paragraph: number; text: string };
type Issue = { cat: Cat; s: number; quote: string; why: string; ref: string; s2: number; field: string; fix: string };
type Row = { book: string; numbered: Num[]; flags: { rule: string; detail: string; sentence: string }[]; kept: Issue[] | null; direct: Issue[] | null; dropped: { issue: unknown; reason: string }[] | null; cost?: number; ms?: number; formatError?: boolean; usage?: unknown };
const model = process.argv[2] ?? "claude-haiku-5-5";
const rows = JSON.parse(readFileSync(`.cache/final3/review-${model}.json`, "utf8")) as Row[];
const known = [...KNOWN3, ...knownPrev()];
const original = (book: string) => { const s = JSON.parse(readFileSync(`.cache/final3/stored/${book}.snapshot.json`, "utf8")); return [s.draft.coverLine ?? "", ...s.draft.chapters.flatMap((c: { sections: { heading: string; paragraphs: string[] }[] }) => c.sections.flatMap(x => [x.heading, ...x.paragraphs.flatMap(p => splitSentences(p.replace(/[⟪⟫]/g, "")))]))] as string[]; };

type Res = { k: Known; present: boolean; det: string | null; review: string | null };
const results: Res[] = [];
const matchedIssues = new Set<string>();
for (const k of known.filter(x => x.layer === "sentence")) {
  const r = rows.find(x => x.book === k.book); if (!r) continue;
  const orig = original(k.book), present = orig.some(t => k.re.test(t));
  const flag = r.flags.find(f => f.sentence && k.re.test(f.sentence));
  const tidied = present && !r.numbered.some(n => k.re.test(n.text));
  const byN = new Map(r.numbered.map(n => [n.n, n]));
  const iss = [...(r.kept ?? []), ...(r.direct ?? [])].filter(i => k.re.test(byN.get(i.s)?.text ?? "") || ((i.cat === "C" || i.cat === "R") && k.re.test(byN.get(i.s2)?.text ?? "")));
  for (const i of iss) matchedIssues.add(`${r.book}:${i.s}`);
  results.push({ k, present, det: flag ? `${flag.rule}${flag.detail ? `(${flag.detail.slice(0, 40)})` : ""}` : tidied ? "정리(tidy)" : null, review: iss.length ? iss.map(i => `${i.cat}@${i.s}`).join(",") : null });
}
const cats: Cat[] = ["F", "C", "I", "L", "R", "T", "A"];
const lines: string[] = [`# 측정 채점 — 검수 모델 ${model}`, "", `명령: \`NODE_PATH=tools/llm/shim pnpm exec tsx tools/final3/score.ts ${model}\``, ""];
lines.push("## 범주별 재현율(문장 단위 알려진 문제, 책에 있는 것만)", "", "| 범주 | 차단급 | 전체 | 결정론 검사 | 검수 | 합(잡음) | 재현율 |", "|---|---|---|---|---|---|---|");
let bT = 0, bC = 0;
for (const c of cats) {
  const xs = results.filter(r => r.present && r.k.cat === c);
  const caught = xs.filter(r => r.det || r.review).length;
  if (BLOCKING.has(c)) { bT += xs.length; bC += caught; }
  lines.push(`| ${c} | ${BLOCKING.has(c) ? "예" : ""} | ${xs.length} | ${xs.filter(r => r.det).length} | ${xs.filter(r => r.review).length} | ${caught} | ${xs.length ? Math.round(caught / xs.length * 100) : "-"}% |`);
}
lines.push("", `**차단급(F·C·I·L) 재현율: ${bC}/${bT} = ${bT ? Math.round(bC / bT * 1000) / 10 : 0}%**`, "");
lines.push("## 알려진 문제별", "", "| id | 책 | 범주 | 문제 | 결정론 | 검수 |", "|---|---|---|---|---|---|");
for (const r of results) lines.push(`| ${r.k.id} | ${r.k.book} | ${r.k.cat} | ${r.k.label.replace(/\|/g, "/")} | ${r.present ? r.det ?? "—" : "(책에 없음)"} | ${r.present ? r.review ?? "—" : ""} |`);
const cost = rows.reduce((a, r) => a + (r.cost ?? 0), 0), ms = rows.filter(r => r.ms).map(r => r.ms!);
lines.push("", `## 비용·지연`, "", `권 ${rows.length} · 합 $${cost.toFixed(5)} · 권당 평균 $${(cost / Math.max(1, rows.length)).toFixed(5)} · 지연 평균 ${Math.round(ms.reduce((a, b) => a + b, 0) / Math.max(1, ms.length) / 1000)}초(최대 ${Math.round(Math.max(0, ...ms) / 1000)}초) · 형식 오류 ${rows.filter(r => r.formatError).length}`);
const drops = rows.flatMap(r => r.dropped ?? []).reduce<Record<string, number>>((o, d) => ({ ...o, [d.reason]: (o[d.reason] ?? 0) + 1 }), {});
lines.push(`버린 지적: ${JSON.stringify(drops)}`);
// 목록 밖 지적(오탐 판정용): 수리로 갈 지적 전부.
const extra: string[] = [];
for (const r of rows) {
  const byN = new Map(r.numbered.map(n => [n.n, n]));
  for (const i of [...(r.kept ?? []), ...(r.direct ?? [])]) {
    if (matchedIssues.has(`${r.book}:${i.s}`)) continue;
    extra.push(`${r.book}\t${i.cat}\t${i.s}\t${(byN.get(i.s)?.text ?? "").slice(0, 120)}\t${i.why.slice(0, 120)}\t${i.ref || i.field || (i.s2 ? `s2=${i.s2}:${(byN.get(i.s2)?.text ?? "").slice(0, 60)}` : "")}${i.fix ? `\tfix=${i.fix.slice(0, 80)}` : ""}`);
  }
}
writeFileSync(`.cache/final3/extra-${model}.tsv`, extra.join("\n") + "\n");
lines.push(`목록 밖 지적(수리 대상): ${extra.length}건 → .cache/final3/extra-${model}.tsv (직접 판정)`);
writeFileSync(`docs/v5/final3/measure-${model}.md`, lines.join("\n") + "\n");
console.log(lines.slice(4, 14).join("\n")); console.log(lines.find(l => l.startsWith("**차단급"))); console.log(lines.slice(-3).join("\n"));
