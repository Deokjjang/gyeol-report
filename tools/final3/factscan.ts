/**
 * 저장본 17권 전 문장에 정답지 대조 검사(최종판3 3, 호출 0). 결과 JSON: [{book, at, rule, detail, sentence}].
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/final3/factscan.ts [.cache/final3/stored] [out.json]
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { factCheck, factCtxOf } from "../../src/lib/factsheet/check";
import { writerKnowledge } from "../../src/lib/writer/publish";
import { splitSentences } from "../../src/lib/writer/safety/patterns";
import { briefOfSnap, factSheetOfSnap, type Snap } from "../final/replay";

const dir = process.argv[2] ?? ".cache/final3/stored", out = process.argv[3] ?? ".cache/final3/factscan.json";
const { k } = writerKnowledge();
const rows: { book: string; at: string; rule: string; detail: string; sentence: string }[] = [];
for (const f of readdirSync(dir).filter(x => x.endsWith(".snapshot.json")).sort()) {
  const book = f.replace(/\.snapshot\.json$/, ""), snap = JSON.parse(readFileSync(join(dir, f), "utf8")) as Snap;
  const brief = briefOfSnap(snap), sheet = factSheetOfSnap(snap, brief);
  const names = [brief.person.nameUse, brief.partner?.person.nameUse ?? []].map(x => [...x]);
  if (brief.compatibility) { names[0].push(brief.compatibility.a.callName); names[1].push(brief.compatibility.b.callName); }
  const ctx = factCtxOf(sheet, k, names);
  const cover = snap.draft.coverLine ?? "";
  if (cover) { const h = factCheck(cover, ctx); if (h) rows.push({ book, at: "cover", rule: h.rule, detail: h.detail, sentence: cover }); }
  for (const c of snap.draft.chapters) c.sections.forEach((s, si) => {
    if (s.heading) { const h = factCheck(s.heading, ctx); if (h) rows.push({ book, at: `${c.n}.${si}.h`, rule: h.rule, detail: h.detail, sentence: s.heading }); }
    s.paragraphs.forEach((p, pi) => { for (const sen of splitSentences(p)) { const h = factCheck(sen, ctx, p); if (h) rows.push({ book, at: `${c.n}.${si}.${pi}`, rule: h.rule, detail: h.detail, sentence: sen }); } });
  });
}
writeFileSync(out, JSON.stringify(rows, null, 1));
console.log(`깃발 ${rows.length}`);
for (const r of rows) console.log(`${r.book} ${r.at} ${r.rule} | ${r.detail} | ${r.sentence.slice(0, 110)}`);
