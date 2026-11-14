/**
 * AM2-8 새 검사 오탐 훑기(호출 0): 기록된 책(발행본, 머리 문장 · 한자 뗌)에 AM2-8 규칙을 대어 걸린 문장을 모두 적는다.
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/annual-major/am2-8-sweep.ts [P7 P6]
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { am28Flags } from "../../src/lib/writer/chunked/check8";
import { blockCtxFor } from "../../src/lib/writer/chunked/publish";
import { writerKnowledge } from "../../src/lib/writer/publish";
import type { FinalChapter } from "../../src/lib/writer/safety";
import { OUT2, payloadFor } from "./am2-6-books";
import { intakeOf } from "./am2-brief";
import { BOOKS } from "./am2-7-repro";
const strip = (t: string) => t.replace(/\s?\([一-鿿·\s]+\)/g, "");
const srcs = process.argv.slice(2).length ? process.argv.slice(2) : ["P7"];
const want = new Set(["screen_copy6", "mbti_trait", "rel_subject_time", "template_third", "cross_copy8", "advice_cliche"]);
const tally: Record<string, number> = {};
for (const src of srcs) for (const id of BOOKS) {
  const snap = JSON.parse(readFileSync(join(OUT2, `${src}-${id}`, "snapshot.json"), "utf8"));
  const { brief, intake } = intakeOf(payloadFor(id)); const { k } = writerKnowledge();
  const heads = new Map(intake.chapters.flatMap(c => (c.keys ?? []).map(kk => [kk.key, kk] as const)));
  const chs: FinalChapter[] = snap.draft.chapters.map((c: { n: number; title: string; sections: { heading: string; paragraphs: string[] }[] }) => ({ n: c.n, id: intake.chapters.find(p => p.n === c.n)?.id ?? "", title: c.title, source: "writer", chars: 0,
    ...(intake.chapters.find(p => p.n === c.n)?.keys ? { keys: intake.chapters.find(p => p.n === c.n)!.keys!.map(kk => kk.key) } : {}),
    sections: c.sections.map(s => ({ heading: s.heading, paragraphs: s.paragraphs.map((p, pi) => (pi === 0 && heads.has(s.heading) ? strip(p).replace(/^[^.?!]*하늘에, [^.?!]*땅에 들어오는 (달|해)[^.?!]*[.?!]\s*/, "") : strip(p))) })) }));
  const fs = am28Flags(chs, blockCtxFor(brief, k, intake)).filter(f => want.has(f.rule));
  for (const f of fs) { tally[`${src}:${f.rule}`] = (tally[`${src}:${f.rule}`] ?? 0) + 1; console.log(`${src}-${id} ${f.chapter}.${f.section}.${f.paragraph} ${f.rule} [${(f.detail ?? "").slice(0, 30)}] ${f.sentence.slice(0, 90)}`); }
}
console.log(JSON.stringify(tally));
