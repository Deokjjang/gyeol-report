/** 새 4권 브리프 점검(최종판3 2, 호출 0). NODE_PATH=tools/llm/shim pnpm exec tsx tools/final3/brief-check.ts */
import { normalizeReportInputPayload } from "../../src/lib/report-generation/reportInputAdapter";
import { buildBrief } from "../../src/lib/brief";
import { payloadToBriefInput } from "../../src/lib/writer/book";
import { renderWriterBrief } from "../../src/lib/writer/prompt";
import { writerKnowledge } from "../../src/lib/writer/publish";
import { FINAL3_CASES } from "./cases";
const { k } = writerKnowledge();
for (const c of FINAL3_CASES) {
  const n = normalizeReportInputPayload(c.payload as never, { now: () => new Date("2026-11-05T09:00:00Z") }); if (!n.ok) throw new Error(c.id);
  const b = buildBrief(payloadToBriefInput(n.value as never, "2026-11-05") as never, k);
  const w = renderWriterBrief(b, { knowledge: k }) as Record<string, unknown>;
  const ch = (w.chapters as { title: string; sceneHint?: string[]; sections?: { act?: string }[] }[]);
  const acts = ch.flatMap(x => (x.sections ?? []).map(s => s.act).filter(Boolean));
  console.log(`\n== ${c.label}`);
  console.log("traits:", b.traits.map(t => `${t.name}${t.strength === "strong" ? "*" : ""}`).join(", "));
  console.log("bookRules:", (w.bookRules as string[]).length, "| acts:", acts.length, "고유", new Set(acts).size, "|", acts.slice(0, 4).join(" / "));
  console.log("sceneHint 1장:", JSON.stringify(ch[0].sceneHint ?? []), "| person.workScenes:", Boolean((w.person as { workScenes?: unknown }).workScenes));
  if (b.compatibility) console.log("commonTraits:", JSON.stringify((w.commonTraits as { items: string[] } | undefined)?.items ?? []), "| profiles:", b.compatibility.profiles?.map(p => p.line).join(" || "));
  console.log("groups:", b.chart.groups?.line, "| strength:", b.chart.strength.label);
}
