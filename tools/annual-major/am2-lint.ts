/** AM2 판독 보조(호출 0): 발행된 책 본문(머리 문장·안내 줄·결정론 장 포함)에 지금 검사를 다시 대어 사실·금지 깃발을 장별로 보인다. */
import { readFileSync } from "node:fs";
import { buildBrief } from "../../src/lib/brief";
import { payloadToBriefInput } from "../../src/lib/writer/book";
import { buildWriterPrompt } from "../../src/lib/writer/prompt";
import { kstDate, lintContext, writerKnowledge } from "../../src/lib/writer/publish";
import { HARD_RULES, lintBook } from "../../src/lib/writer/safety/p6c";
import type { FinalChapter } from "../../src/lib/writer/safety";
const snap = JSON.parse(readFileSync(process.argv[2], "utf8"));
const { k } = writerKnowledge(), input = snap.evidencePacket.input;
const brief = buildBrief(payloadToBriefInput(input, kstDate(snap.evidencePacket.generatedAt)) as never, k), plan = buildWriterPrompt(brief, { knowledge: k }).chapters;
const src = new Map((snap.evidencePacket.meta.chapters as { n: number; source: string }[]).map(c => [c.n, c.source]));
const chapters = snap.draft.chapters.map((ch: FinalChapter) => ({ ...ch, source: "writer", chars: 0 })) as FinalChapter[];
for (const f of lintBook(chapters, lintContext(brief, k, plan, [])).filter(f => HARD_RULES.has(f.rule))) console.log(`${f.chapter}장(${src.get(f.chapter)}) ${f.chapter}.${f.section}.${f.paragraph}${f.card ? `:${f.card}` : ""} ${f.rule}${f.detail ? `(${f.detail})` : ""}: ${f.sentence.slice(0, 140)}`);
