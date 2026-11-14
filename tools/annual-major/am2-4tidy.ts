/** AM2-3 6-2 확인(호출 0): 발행된 4종 원고에 지금 tidy(거의 같은 문장 연속)·lint(지시어 고아·작성 지시)를 대어, 바뀌는 문장과 새 깃발을 보인다. */
import { readFileSync } from "node:fs";
import type { V5BookDraft, V5Evidence } from "../../src/lib/writer/book";
import { buildWriterPrompt } from "../../src/lib/writer/prompt";
import { factSheetFor, lintContext, writerKnowledge, briefFor } from "../../src/lib/writer/publish";
import type { FinalChapter } from "../../src/lib/writer/safety";
import { lintBook, tidyBook } from "../../src/lib/writer/safety/p6c";
import { splitSentences } from "../../src/lib/writer/safety/patterns";
for (const file of process.argv.slice(2)) {
  const snap = JSON.parse(readFileSync(file, "utf8")) as { draft: V5BookDraft; evidencePacket: V5Evidence & { input: unknown }; createdAtIso: string };
  const payload = snap.evidencePacket.input as never, at = snap.createdAtIso, { k } = writerKnowledge();
  const brief = briefFor(payload, at, undefined, undefined, k), plan = buildWriterPrompt(brief, { knowledge: k }).chapters;
  const lctx = lintContext(brief, k, plan, [], undefined, factSheetFor(payload, at, brief, k));
  const chs: FinalChapter[] = snap.draft.chapters.map(ch => ({ n: ch.n, id: ch.id, title: ch.title, source: "writer", chars: 0, ...(ch.keys ? { keys: ch.keys } : {}), sections: ch.sections.map(s => ({ heading: s.heading, paragraphs: [...s.paragraphs] })) }));
  const t = tidyBook(chs, lctx).chapters;
  console.log(`## ${file.split("/").slice(-2, -1)[0]}`);
  chs.forEach((c, ci) => c.sections.forEach((s, si) => s.paragraphs.forEach((p, pi) => { const a = splitSentences(p), b = splitSentences(t[ci]?.sections[si]?.paragraphs[pi] ?? ""); const gone = a.filter(x => !b.some(y => y.replace(/[^가-힣]/g, "") === x.replace(/[^가-힣]/g, ""))); for (const g of gone) if (b.length < a.length) console.log(`- tidy ${c.n}.${si}.${pi} 뺌: ${g.slice(0, 140)}`); })));
  for (const f of lintBook(t, lctx).filter(f => f.rule === "orphan_start" || f.rule === "guide_copy")) console.log(`- ${f.rule} ${f.chapter}.${f.section}.${f.paragraph}: ${f.sentence.slice(0, 140)}`);
}
