/** AM2-5 오탐 검토(호출 0): 저장 원고 18권(AM-01 세운 6·대운 4 · P~P4 두 권씩)에 AM2-5 새 규칙만 댄다. 깃발마다 한 줄. */
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { am25Flags, valueFlags } from "../../src/lib/writer/chunked/check";
import { blockCtxFor } from "../../src/lib/writer/chunked/publish";
import { writerKnowledge } from "../../src/lib/writer/publish";
import type { FinalChapter } from "../../src/lib/writer/safety";
import { cases } from "./final";
import { stripHanja } from "../../src/lib/writer/safety/p6e";
import { intakeOf } from "./am2-brief";
const R = join(homedir(), "Desktop", "gyeol-review");
const books = [...cases().filter(c => c.product !== "launch").map(c => ({ name: `AM-${c.id}`, path: join(R, "annual-major", c.id, "snapshot.json"), id: c.id })),
  ...["P", "P2", "P3", "P4"].flatMap(st => ["annual-1", "major-1"].map(id => ({ name: `${st}-${id}`, path: join(R, "annual-major-02", `${st}-${id}`, "snapshot.json"), id })))];
const { k } = writerKnowledge(); const tally: Record<string, number> = {};
for (const bk of books) {
  if (!existsSync(bk.path)) { console.log(`(없음) ${bk.name}`); continue; }
  const snap = JSON.parse(readFileSync(bk.path, "utf8")), c = cases().find(x => x.id === bk.id)!; const { brief, intake } = intakeOf(c.payload);
  // 머리 문장(시스템)은 빼고 본다.
  const heads = new Set(intake.chapters.flatMap(ch => (ch.keys ?? []).map(kp => kp.head.replace(/[^가-힣]/g, ""))));
  const chs: FinalChapter[] = snap.draft.chapters.map((ch: { n: number; id: string; title: string; sections: { heading: string; paragraphs: string[] }[]; keys?: string[] }) => ({ n: ch.n, id: ch.id, title: ch.title, source: "writer", chars: 0, ...(ch.keys ? { keys: ch.keys } : {}),
    sections: ch.sections.map(s => ({ heading: s.heading, paragraphs: s.paragraphs.map(p0 => stripHanja(p0).text).map((p, i) => (i === 0 && ch.keys ? p.split(/(?<=[.!?])\s+/).filter(x => !heads.has(x.replace(/\([^)]*\)/g, "").replace(/[^가-힣]/g, ""))).join(" ") : p)).filter(Boolean) })) }));
  const b = blockCtxFor(brief, k, intake);
  for (const f of [...am25Flags(chs, b), ...valueFlags(chs, b)]) { tally[f.rule] = (tally[f.rule] ?? 0) + 1; console.log(`${bk.name} ${f.chapter}.${f.section}.${f.paragraph} ${f.rule}${f.detail ? `(${f.detail})` : ""} | ${f.sentence.slice(0, 150)}`); }
}
console.log(JSON.stringify(tally));
