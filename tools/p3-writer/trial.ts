/**
 * P3 I 전체 원고 시험(API 비용 0, Claude Code 서브에이전트가 작가 역할).
 *   pnpm exec tsx tools/p3-writer/trial.ts prep <round>    → docs/v5/trial/p3/<round>/<case>.system.md · .user.md (실제 지침 + 브리프)
 *   pnpm exec tsx tools/p3-writer/trial.ts check <round>   → <case>.out.md를 안전망에 통과시켜 <case>.final.md + 지표(stdout)
 * 사례: c1 종합(하람·정시·ENTJ·싱글·회사원), c2 연애(서윤·시간 미상·INFP·연애 중·프리랜서).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { buildBrief, loadKnowledge, type BriefInput } from "../../src/lib/brief";
import { parseChapters, renderChapter } from "../../src/lib/writer/format";
import { buildWriterPrompt } from "../../src/lib/writer/prompt";
import { applySafetyNet, type DraftChapter } from "../../src/lib/writer/safety";

const ROOT = resolve(import.meta.dirname, "../..");
const ev = JSON.parse(readFileSync(join(ROOT, "docs/eval/inputs.json"), "utf8"));
const person = (key: string, ctx: string) => { const p = ev.persons[key], c = ev.contexts[ctx]; return { name: p.name, gender: p.gender, birthDate: p.birthDate, birthTime: p.birthTime, birthTimeUnknown: p.birthTimeUnknown, approximateBirthTimeSlot: p.approximateBirthTimeSlot, mbtiType: p.mbtiType, context: { relationshipStatus: c.relationshipStatus, jobStatus: c.jobStatus, detailJob: c.detailJob } }; };
const CASES: Record<string, BriefInput> = {
  "c1-saju_mbti_full": { product: "saju_mbti_full", baseDate: "2026-10-27", person: person("haram", "c1") },
  "c2-love_marriage_child": { product: "love_marriage_child", baseDate: "2026-10-27", person: person("seoyun", "c2") },
};
const k = loadKnowledge(join(ROOT, "src/data/knowledge-v5"));
const [cmd, round = "r1"] = process.argv.slice(2);
const dir = join(ROOT, "docs/v5/trial/p3", round);
mkdirSync(dir, { recursive: true });

for (const [name, input] of Object.entries(CASES)) {
  const brief = buildBrief(input, k);
  const prompt = buildWriterPrompt(brief);
  if (cmd === "prep") {
    writeFileSync(join(dir, `${name}.system.md`), prompt.system + "\n");
    writeFileSync(join(dir, `${name}.user.md`), prompt.user + "\n");
    console.log(name, "chapters", prompt.chapters.length);
    continue;
  }
  const out = join(dir, `${name}.out.md`);
  if (!existsSync(out)) { console.log(name, "원고 없음"); continue; }
  const raw = readFileSync(out, "utf8");
  const parsed = parseChapters(raw);
  const drafts = new Map<number, DraftChapter>(parsed.filter(c => prompt.chapters.some(p => p.n === c.n)).map(c => [c.n, { chapter: c, source: "writer" as const }]));
  const { chapters, report } = applySafetyNet(brief, prompt.chapters, drafts);
  const text = chapters.map(c => renderChapter({ n: c.n, title: c.title, sections: c.sections })).join("\n\n");
  writeFileSync(join(dir, `${name}.final.md`), text + "\n");
  const total = chapters.reduce((s, c) => s + c.chars, 0);
  console.log(JSON.stringify({ name, chapters: chapters.length, parsed: parsed.length, total, perChapter: chapters.map(c => c.chars), sources: chapters.map(c => c.source[0]).join(""),
    deletions: report.deletions, warnings: report.warnings.map(w => `${w.chapter}:${w.kind}:${w.text.slice(0, 40)}`) }, null, 1));
}
