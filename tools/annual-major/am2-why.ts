/**
 * AM2 판독 보조(호출 0): 저장된 책(snapshot meta.raw)의 묶음 원문을 차례대로 다시 대어, 회차마다 어떤 차단 결함이 있었는지 보인다.
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/annual-major/am2-why.ts <snapshot.json> [<case>]
 */
import { readFileSync } from "node:fs";
import type { V5Evidence } from "../../src/lib/writer/book";
import { buildWriterPrompt } from "../../src/lib/writer/prompt";
import { factSheetFor, lintContext, writerKnowledge, briefFor } from "../../src/lib/writer/publish";
import { applySafetyNet, type DraftChapter } from "../../src/lib/writer/safety";
import { lintBook, tidyBook } from "../../src/lib/writer/safety/p6c";
import { buildIntake } from "../../src/lib/writer/chunked/intake";
import { blockFlags, crossRepeats } from "../../src/lib/writer/chunked/check";
import { chunkPlan } from "../../src/lib/writer/chunked/prompt";
import { mergeParts, partsOf } from "../../src/lib/writer/chunked/run";
import { blockCtxFor } from "../../src/lib/writer/chunked/publish";

const [file] = process.argv.slice(2);
const snap = JSON.parse(readFileSync(file, "utf8")) as { evidencePacket: V5Evidence & { input: unknown }; createdAtIso: string };
const payload = snap.evidencePacket.input as never, at = snap.createdAtIso;
const { k } = writerKnowledge();
const brief = briefFor(payload, at, undefined, undefined, k), plan = buildWriterPrompt(brief, { knowledge: k }).chapters;
const wish = ((payload as { productOptions?: { wish?: string } }).productOptions)?.wish;
const intake = buildIntake(brief, k, plan, wish), chunks = chunkPlan(intake);
const lctx = lintContext(brief, k, plan, [], undefined, factSheetFor(payload, at, brief, k));
const raw = snap.evidencePacket.meta.raw ?? [];
const firsts = raw.filter(r => r.kind === "first"), rewrites = raw.filter(r => r.kind === "rewrite");
const drafts = new Map<number, DraftChapter>();
const owner = (text: string) => chunks.find(c => { const got = partsOf(text, c, plan); return c.parts.every(p => got.has(p.n) && (!p.keys || p.keys.every(kk => got.get(p.n)!.some(s => s.heading === kk)))); });
const show = (label: string) => {
  const chs = tidyBook(applySafetyNet(brief, plan, drafts, { surfaceOnly: true }).chapters, { ...lctx, surfaceOnly: true }).chapters;
  const lint = lintBook(chs, lctx), block = blockFlags(chs, lint, blockCtxFor(brief, k, intake));
  const by = block.reduce<Record<string, number>>((o, f) => ({ ...o, [f.rule]: (o[f.rule] ?? 0) + 1 }), {});
  console.log(`\n## ${label}: 차단 ${block.length} ${JSON.stringify(by)} · 장 사이 반복 ${crossRepeats(chs).length}`);
  for (const f of block) console.log(`- ${f.chapter}.${f.section}.${f.paragraph} ${f.rule}${f.detail ? `(${f.detail})` : ""}: ${f.sentence.slice(0, 150)}`);
};
for (const r of firsts) { const c = owner(r.text); if (c) mergeParts(drafts, partsOf(r.text, c, plan), plan, "writer"); }
show("첫 원고(묶음 6)");
rewrites.forEach((r, i) => { const c = owner(r.text); if (c) { mergeParts(drafts, partsOf(r.text, c, plan), plan, "writer"); show(`다시 쓰기 ${i + 1}(${c.id})`); } });
