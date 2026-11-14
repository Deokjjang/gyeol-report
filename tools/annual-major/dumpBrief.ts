/** AM2 0단계(호출 0): AM 사례의 작가 사용자 메시지(렌더 브리프)를 파일로 남긴다. NODE_PATH=tools/llm/shim pnpm exec tsx tools/annual-major/dumpBrief.ts <case> <out> */
import { writeFileSync } from "node:fs";
import { buildBrief } from "../../src/lib/brief";
import { normalizeReportInputPayload } from "../../src/lib/report-generation/reportInputAdapter";
import { payloadToBriefInput } from "../../src/lib/writer/book";
import { buildWriterPrompt } from "../../src/lib/writer/prompt";
import { kstDate, writerKnowledge } from "../../src/lib/writer/publish";
import { cases } from "./final";
const [id, out] = process.argv.slice(2);
const c = cases().find(x => x.id === id)!; const at = "2026-12-02T03:00:00.000Z";
const { k } = writerKnowledge();
const n = normalizeReportInputPayload(c.payload as never, { now: () => new Date(at) }); if (!n.ok) throw new Error("input");
const brief = buildBrief(payloadToBriefInput(c.payload as never, kstDate(at), at) as never, k);
const p = buildWriterPrompt(brief, { knowledge: k });
writeFileSync(out, JSON.stringify({ system: p.system, user: p.user, brief }, null, 1));
console.log(id, "system", p.system.length, "user", p.user.length);
