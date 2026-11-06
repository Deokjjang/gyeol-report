/**
 * P3.6 B 미검증 상품 전체 원고 시험(API 비용 0, Claude Code 서브에이전트가 작가 역할).
 *   pnpm exec tsx tools/p36/trial.ts prep <round>     → docs/v5/trial/p36/<round>/<case>.system.md · .user.md (지침 v5-6 + 브리프)
 *   pnpm exec tsx tools/p36/trial.ts check <round>    → <case>.out.md를 안전망에 통과시켜 <case>.final.md + <case>.metrics.json
 *   pnpm exec tsx tools/p36/trial.ts overlap <round>  → 이번 6권 + P3.5 r2 4권, 고객 간 20자 이상 같은 문장 비율(쌍별)
 * 사례: c1 커리어(서비스 기획자 29세), y 연애(대학생 싱글), x 대운(기혼 간호사), c2 세운 2026(시간 미상·연애 중·프리랜서),
 *       궁합 부모·자녀(가상 50대 부모 × 20대 자녀), 궁합 상사·팀원(가상 상사 × c1).
 * 대운·세운은 원고의 "### key"가 브리프 키와 맞는 비율(keyMatch)과 흐름 세기 근거 표(flow)를 함께 낸다.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { buildBrief, loadKnowledge, type BriefInput } from "../../src/lib/brief";
import { chapterChars, parseChapters, renderChapter } from "../../src/lib/writer/format";
import { buildWriterPrompt } from "../../src/lib/writer/prompt";
import { applySafetyNet, splitSentences, type DraftChapter } from "../../src/lib/writer/safety";
import { norm } from "../../src/lib/writer/safety/sentences";
import { PEOPLE } from "../p35/people";
import { P36_PEOPLE } from "./people";

const ROOT = resolve(import.meta.dirname, "../..");
const BASE = "2026-10-29";
/** case → [브리프 입력, 고객(같은 고객끼리는 고객 간 비교에서 뺀다)]. */
export const CASES: Record<string, { input: BriefInput; customers: readonly string[] }> = {
  "c1-career": { input: { product: "career_money_study", baseDate: BASE, person: PEOPLE.c1 }, customers: ["c1"] },
  "y-love": { input: { product: "love_marriage_child", baseDate: BASE, person: PEOPLE.y }, customers: ["y"] },
  "x-major": { input: { product: "major_fortune", baseDate: BASE, person: PEOPLE.x }, customers: ["x"] },
  "c2-annual": { input: { product: "annual_fortune", baseDate: BASE, person: PEOPLE.c2, selectedYear: 2026 }, customers: ["c2"] },
  "pair-parent": { input: { product: "saju_mbti_compatibility", baseDate: BASE, person: P36_PEOPLE.parent, partner: P36_PEOPLE.child, relationshipType: "parentChild" }, customers: ["parent", "child"] },
  "pair-boss": { input: { product: "saju_mbti_compatibility", baseDate: BASE, person: P36_PEOPLE.boss, partner: PEOPLE.c1, relationshipType: "managerReport" }, customers: ["boss", "c1"] },
};
/** 고객 간 비교에 넣는 P3.5 r2 원고. */
const P35_BOOKS: Record<string, readonly string[]> = { "c1-full": ["c1"], "x-full": ["x"], "y-full": ["y"], "pair-love": ["c1", "c2"] };

const k = loadKnowledge(join(ROOT, "src/data/knowledge-v5"));
const [cmd, round = "r1"] = process.argv.slice(2);
const dir = join(ROOT, "docs/v5/trial/p36", round);
mkdirSync(dir, { recursive: true });

/** 책 A 문장 중 공백·문장부호 뺀 20자 창이 책 B에도 있는 문장 수. */
function overlap(a: string, b: string): { sentences: number; matched: number } {
  const wb = new Set<string>(); const nb = norm(b); for (let i = 0; i + 20 <= nb.length; i++) wb.add(nb.slice(i, i + 20));
  const sents = a.split("\n").filter(l => !l.startsWith("#")).flatMap(l => splitSentences(l)).map(norm).filter(s => s.length >= 20);
  let matched = 0; for (const s of sents) { for (let i = 0; i + 20 <= s.length; i++) if (wb.has(s.slice(i, i + 20))) { matched++; break; } }
  return { sentences: sents.length, matched };
}

if (cmd === "overlap") {
  const books = [
    ...Object.entries(CASES).map(([n, c]) => [n, join(dir, `${n}.final.md`), c.customers] as const),
    ...Object.entries(P35_BOOKS).map(([n, cs]) => [`p35:${n}`, join(ROOT, "docs/v5/trial/p35/r2", `${n}.final.md`), cs] as const),
  ].filter(([, p]) => existsSync(p)).map(([n, p, cs]) => ({ n, text: readFileSync(p, "utf8"), cs }));
  const rows = [];
  for (let i = 0; i < books.length; i++) for (let j = i + 1; j < books.length; j++) {
    const A = books[i], B = books[j];
    const ab = overlap(A.text, B.text), ba = overlap(B.text, A.text);
    rows.push({ pair: `${A.n} × ${B.n}`, sameCustomer: A.cs.some(c => B.cs.includes(c)), sentences: ab.sentences + ba.sentences, matched: ab.matched + ba.matched, ratio: +((ab.matched + ba.matched) / (ab.sentences + ba.sentences)).toFixed(4) });
  }
  const cross = rows.filter(r => !r.sameCustomer);
  const summary = { books: books.length, crossPairs: cross.length, crossMatched: cross.reduce((a, r) => a + r.matched, 0), crossSentences: cross.reduce((a, r) => a + r.sentences, 0), maxCross: cross.reduce((m, r) => r.ratio > m.ratio ? r : m, { pair: "-", ratio: 0 } as { pair: string; ratio: number }) };
  console.log(JSON.stringify({ summary, rows: rows.filter(r => r.matched) }, null, 1));
  writeFileSync(join(dir, "overlap.json"), JSON.stringify({ summary, rows }, null, 1) + "\n");
  process.exit(0);
}

for (const [name, { input }] of Object.entries(CASES)) {
  const brief = buildBrief(input, k);
  const prompt = buildWriterPrompt(brief);
  if (cmd === "prep") {
    writeFileSync(join(dir, `${name}.system.md`), prompt.system + "\n");
    writeFileSync(join(dir, `${name}.user.md`), prompt.user + "\n");
    console.log(name, "chapters", prompt.chapters.length, "keys", prompt.chapters.flatMap(c => c.keys ?? []).length, "score", brief.compatibility ? `${brief.compatibility.score.value} ${brief.compatibility.score.band.label}` : "-");
    continue;
  }
  const out = join(dir, `${name}.out.md`);
  if (!existsSync(out)) { console.log(name, "원고 없음"); continue; }
  const parsed = parseChapters(readFileSync(out, "utf8"));
  const drafts = new Map<number, DraftChapter>(parsed.filter(c => prompt.chapters.some(p => p.n === c.n)).map(c => [c.n, { chapter: c, source: "writer" as const }]));
  const { chapters, report } = applySafetyNet(brief, prompt.chapters, drafts);
  const finalText = chapters.map(c => renderChapter({ n: c.n, title: c.title, sections: c.sections })).join("\n\n");
  writeFileSync(join(dir, `${name}.final.md`), finalText + "\n");
  const byRule: Record<string, number> = {}; for (const d of report.deletions) byRule[d.rule] = (byRule[d.rule] ?? 0) + 1;
  const hints = brief.chapters.flatMap(c => c.sceneHint ?? []), usedHints = [...new Set(hints)].filter(h => finalText.includes(h));
  // 대운·세운: 작가 원고(안전망 전)의 "### key"가 브리프 키와 글자 그대로 맞는 비율, 결정론 보충 키.
  const keyed = prompt.chapters.filter(c => c.keys?.length);
  const keyMatch = keyed.length ? (() => {
    const want = keyed.flatMap(c => c.keys!.map(key => ({ n: c.n, key })));
    const got = want.filter(w => drafts.get(w.n)?.chapter.sections.some(s => s.heading.trim() === w.key && s.paragraphs.length));
    const filled = chapters.filter(c => c.reason?.startsWith("keys_filled") || (c.keys && c.source === "deterministic")).map(c => `${c.n}:${c.reason}`);
    return { total: want.length, exact: got.length, ratio: +(got.length / want.length).toFixed(3), missing: want.filter(w => !got.includes(w)).map(w => w.key), filled };
  })() : undefined;
  const flow = brief.timeline?.entries.map(e => ({ key: e.key, label: e.label, ganji: `${e.ganji.hanja}(${e.ganji.hangul})`, tenGod: `${e.tenGod.stem}/${e.tenGod.branch}`, score: e.flow.score, flowLabel: e.flow.label, basis: e.flow.basis, fillsLack: e.fillsLack.fills, badges: e.badges.map(b => b.label) }));
  const job = brief.person.facts.job.detail;
  const metrics = {
    case: name, product: brief.product, chapters: chapters.length, sources: chapters.reduce<Record<string, number>>((a, c) => ({ ...a, [c.source]: (a[c.source] ?? 0) + 1 }), {}),
    chars: chapters.map(c => chapterChars({ n: c.n, title: c.title, sections: c.sections })), total: chapters.reduce((n, c) => n + chapterChars({ n: c.n, title: c.title, sections: c.sections }), 0),
    deletions: report.deletions.length, byRule, deleted: report.deletions.map(d => `${d.chapter} ${d.rule}: ${d.sentence}`),
    replacements: (report.replacements ?? []).map(r => `${r.chapter} ${r.from} → ${r.to}`),
    warnings: report.warnings.map(w => `${w.chapter} ${w.kind}: ${w.text}`),
    briefCopy: report.metrics?.briefCopy, connectors: report.metrics?.connectors, merged: report.metrics?.merged, backrefFixed: report.metrics?.backrefFixed,
    props: report.metrics?.props, experience: report.metrics?.experience,
    jobMentions: job ? finalText.split(job.replace(/\s+/g, " ")).length - 1 : 0, sceneHintsUsed: `${usedHints.length}/${new Set(hints).size}`,
    ...(brief.compatibility ? { score: brief.compatibility.score.value, band: brief.compatibility.score.band.label } : {}),
    ...(keyMatch ? { keyMatch } : {}), ...(flow ? { flow } : {}),
  };
  writeFileSync(join(dir, `${name}.metrics.json`), JSON.stringify(metrics, null, 1) + "\n");
  console.log(JSON.stringify({ ...metrics, deleted: metrics.deleted.length, replacements: metrics.replacements.length, warnings: metrics.warnings.length, flow: flow?.length }));
}
