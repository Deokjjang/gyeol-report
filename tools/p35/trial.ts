/**
 * P3.5 A9·P4 C5 전체 원고 시험(API 비용 0, Claude Code 서브에이전트가 작가 역할).
 *   pnpm exec tsx tools/p35/trial.ts prep <round>     → docs/v5/trial/p35/<round>/<case>.system.md · .user.md (실제 지침 v5-4 + 브리프)
 *   pnpm exec tsx tools/p35/trial.ts check <round>    → <case>.out.md를 안전망에 통과시켜 <case>.final.md + 지표 JSON(<case>.metrics.json)
 *   pnpm exec tsx tools/p35/trial.ts overlap <round>  → 책끼리 20자 이상 같은 문장 비율(쌍별)
 * 사례: c1 종합(하람), x 종합(수진: c1과 같은 丁丑 일주·ISFJ·기혼·간호사), y 종합(도현: 천문성·정관 공유·ENFP·대학생), pair 궁합 연인(하람×서윤).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { buildBrief, loadKnowledge, type BriefInput } from "../../src/lib/brief";
import { chapterChars, parseChapters, renderChapter } from "../../src/lib/writer/format";
import { buildWriterPrompt } from "../../src/lib/writer/prompt";
import { applySafetyNet, splitSentences, type DraftChapter } from "../../src/lib/writer/safety";
import { norm } from "../../src/lib/writer/safety/sentences";
import { PEOPLE } from "./people";

const ROOT = resolve(import.meta.dirname, "../..");
const BASE = "2026-10-29";
export const CASES: Record<string, BriefInput> = {
  "c1-full": { product: "saju_mbti_full", baseDate: BASE, person: PEOPLE.c1 },
  "x-full": { product: "saju_mbti_full", baseDate: BASE, person: PEOPLE.x },
  "y-full": { product: "saju_mbti_full", baseDate: BASE, person: PEOPLE.y },
  "pair-love": { product: "saju_mbti_compatibility", baseDate: BASE, person: PEOPLE.c1, partner: PEOPLE.c2, relationshipType: "love" },
};
const k = loadKnowledge(join(ROOT, "src/data/knowledge-v5"));
const [cmd, round = "r1"] = process.argv.slice(2);
const dir = join(ROOT, "docs/v5/trial/p35", round);
mkdirSync(dir, { recursive: true });

/** 책 A 문장 중 공백·문장부호 뺀 20자 창이 책 B에도 있는 문장 수. */
function overlap(a: string, b: string): { sentences: number; matched: number } {
  const wb = new Set<string>(); const nb = norm(b); for (let i = 0; i + 20 <= nb.length; i++) wb.add(nb.slice(i, i + 20));
  const sents = a.split("\n").filter(l => !l.startsWith("#")).flatMap(l => splitSentences(l)).map(norm).filter(s => s.length >= 20);
  let matched = 0; for (const s of sents) { for (let i = 0; i + 20 <= s.length; i++) if (wb.has(s.slice(i, i + 20))) { matched++; break; } }
  return { sentences: sents.length, matched };
}

if (cmd === "overlap") {
  const books = Object.keys(CASES).filter(n => n.endsWith("-full")).map(n => [n, join(dir, `${n}.final.md`)] as const).filter(([, p]) => existsSync(p)).map(([n, p]) => [n, readFileSync(p, "utf8")] as const);
  const rows = [];
  for (let i = 0; i < books.length; i++) for (let j = i + 1; j < books.length; j++) {
    const ab = overlap(books[i][1], books[j][1]), ba = overlap(books[j][1], books[i][1]);
    rows.push({ pair: `${books[i][0]} × ${books[j][0]}`, sentences: ab.sentences + ba.sentences, matched: ab.matched + ba.matched, ratio: +((ab.matched + ba.matched) / (ab.sentences + ba.sentences)).toFixed(3) });
  }
  console.log(JSON.stringify(rows, null, 1));
  writeFileSync(join(dir, "overlap.json"), JSON.stringify(rows, null, 1) + "\n");
  process.exit(0);
}

for (const [name, input] of Object.entries(CASES)) {
  const brief = buildBrief(input, k);
  const prompt = buildWriterPrompt(brief);
  if (cmd === "prep") {
    writeFileSync(join(dir, `${name}.system.md`), prompt.system + "\n");
    writeFileSync(join(dir, `${name}.user.md`), prompt.user + "\n");
    console.log(name, "chapters", prompt.chapters.length, "score", brief.compatibility ? `${brief.compatibility.score.value} ${brief.compatibility.score.band.label}` : "-");
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
  const job = brief.person.facts.job.detail;
  const metrics = {
    case: name, chapters: chapters.length, sources: chapters.reduce<Record<string, number>>((a, c) => ({ ...a, [c.source]: (a[c.source] ?? 0) + 1 }), {}),
    chars: chapters.map(c => chapterChars({ n: c.n, title: c.title, sections: c.sections })), total: chapters.reduce((n, c) => n + chapterChars({ n: c.n, title: c.title, sections: c.sections }), 0),
    deletions: report.deletions.length, byRule, deleted: report.deletions.map(d => `${d.chapter} ${d.rule}: ${d.sentence}`),
    warnings: report.warnings.map(w => `${w.chapter} ${w.kind}: ${w.text}`),
    briefCopy: report.metrics?.briefCopy, connectors: report.metrics?.connectors, merged: report.metrics?.merged, backrefFixed: report.metrics?.backrefFixed,
    jobMentions: job ? finalText.split(job.replace(/\s+/g, " ")).length - 1 : 0, sceneHintsUsed: `${usedHints.length}/${new Set(hints).size}`,
    ...(brief.compatibility ? { score: brief.compatibility.score.value, band: brief.compatibility.score.band.label } : {}),
  };
  writeFileSync(join(dir, `${name}.metrics.json`), JSON.stringify(metrics, null, 1) + "\n");
  console.log(JSON.stringify({ ...metrics, deleted: metrics.deleted.length, warnings: metrics.warnings.length }));
}
