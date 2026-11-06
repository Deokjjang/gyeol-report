// A7 결정론 작가 장 분량 측정: pnpm exec tsx tools/p35/det-chars.ts
// 6상품 + 궁합 7유형, 고정 입력 5명. 비반복 장의 글자 수(chapterChars) 분포와 900자 미만 장 수.
import { buildBrief, loadKnowledge } from "../../src/lib/brief";
import { applySafetyNet } from "../../src/lib/writer/safety";
import { buildWriterPrompt } from "../../src/lib/writer/prompt";
import { chapterChars } from "../../src/lib/writer/format";
import { PEOPLE } from "./people";

const k = loadKnowledge();
const rows: { case: string; n: number; chars: number }[] = [];
const run = (label: string, input: Parameters<typeof buildBrief>[0]) => {
  const brief = buildBrief(input, k), plan = buildWriterPrompt(brief).chapters;
  const { chapters } = applySafetyNet(brief, plan, new Map());
  for (const c of chapters) if (!c.keys) rows.push({ case: label, n: c.n, chars: chapterChars({ n: c.n, title: c.title, sections: c.sections }) });
};
const base = "2026-10-29";
for (const [name, p] of Object.entries(PEOPLE)) for (const product of ["saju_mbti_full", "career_money_study", "love_marriage_child", "major_fortune", "annual_fortune"] as const) run(`${name}/${product}`, { product, person: p, baseDate: base });
for (const rel of ["love", "marriage", "parentChild", "coworker", "managerReport", "businessPartner", "friendship"] as const) run(`pair/${rel}`, { product: "saju_mbti_compatibility", person: PEOPLE.c1, partner: PEOPLE.y, relationshipType: rel, baseDate: base });
const xs = rows.map(r => r.chars).sort((a, b) => a - b);
console.log(JSON.stringify({ chapters: xs.length, min: xs[0], p10: xs[Math.floor(xs.length * 0.1)], median: xs[Math.floor(xs.length / 2)], under900: rows.filter(r => r.chars < 900).length }));
if (process.argv.includes("--list")) rows.filter(r => r.chars < 900).forEach(r => console.log(r.case, r.n, r.chars));
