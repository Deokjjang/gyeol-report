/** P6b 브리프 점검: pnpm exec tsx tools/p6b/brief.ts <caseId> [--writer] — 작가 입력(JSON)을 출력하고 그림 별명·농촌 소품 누출을 센다. */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { buildBrief, loadKnowledge } from "../../src/lib/brief";
import { renderWriterBrief } from "../../src/lib/writer/prompt";
import { payloadToBriefInput } from "../../src/lib/writer/book";
import { RURAL_PROP } from "../../src/lib/writer/safety/patterns";
import { P6B_CASES } from "./cases";

const root = join(import.meta.dirname, "../../src/data/knowledge-v5");
const k = loadKnowledge(root);
const nick = readdirSync(join(root, "myeongri")).flatMap(f => (JSON.parse(readFileSync(join(root, "myeongri", f), "utf8")).features as { easyName: string }[]).map(x => x.easyName));
const id = process.argv[2] ?? "c1-full";
const c = P6B_CASES.find(x => x.id === id)!;
const brief = buildBrief(payloadToBriefInput(c.payload as never, "2026-11-03") as never, k);
const w = JSON.stringify(renderWriterBrief(brief));
const leaks = nick.filter(n => w.includes(n));
const rural = w.match(new RegExp(RURAL_PROP.source, "g")) ?? [];
console.log(JSON.stringify({ id, chars: w.length, nicknames: leaks, rural, coreImage: brief.chart.coreImage, chapters: brief.chapters.map(ch => `${ch.id}:${ch.title}`) }, null, 1));
if (process.argv.includes("--writer")) console.log(w);
if (process.argv.includes("--plan")) for (const ch of brief.chapters) console.log(`${ch.id} [${ch.targetChars}] ${ch.title} | ${(ch.sections ?? []).map(s => `${s.q} <${s.materials.map(m => m.kind === "evidence" ? `ev:${m.key}` : m.kind === "ref" ? m.ref : m.kind === "trait" ? `trait:${m.traitId}/${m.angle}` : m.kind).join(",")}>`).join(" / ")}`);
