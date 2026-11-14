/**
 * AM2-6 8부 오탐 검토(호출 0): 저장 원고 22권(AM-01 10 · P~P4 8 · P5 4)에 AM2-6 새 규칙만 댄다(am26Flags · 소제목 같은 처방 · 끝말 · 이름).
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/annual-major/am2-6-fp.ts [--rule r]
 * 깃발마다 한 줄 — 사람이 하나씩 보아 참 · 오탐을 가른다(보고 16-5).
 */
import { am26Flags } from "../../src/lib/writer/chunked/check";
import { blockCtxFor } from "../../src/lib/writer/chunked/publish";
import { writerKnowledge } from "../../src/lib/writer/publish";
import { loadSaved, SAVED } from "./am2-6-books";
const only = process.argv.includes("--rule") ? process.argv[process.argv.indexOf("--rule") + 1] : null;
const { k } = writerKnowledge(); const tally: Record<string, number> = {};
for (const bk of SAVED) {
  const got = loadSaved(bk.path, bk.id); if (!got) { console.log(`(없음) ${bk.name}`); continue; }
  const b = blockCtxFor(got.brief, k, got.intake);
  for (const f of am26Flags(got.chs, b)) { if (only && f.rule !== only) continue; tally[f.rule] = (tally[f.rule] ?? 0) + 1; console.log(`${bk.name} ${f.chapter}.${f.section}.${f.paragraph} ${f.rule}${f.detail ? `(${f.detail})` : ""} | ${f.sentence.slice(0, 170)}`); }
}
console.log(JSON.stringify(tally));
