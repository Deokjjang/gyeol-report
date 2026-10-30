/** 브리프 절별 재료 요약(개발용). pnpm exec tsx tools/p38/dump.ts <case...> */
import { join, resolve } from "node:path";
import { buildBrief, loadKnowledge } from "../../src/lib/brief";
import type { Material } from "../../src/lib/brief/schema";
import { CASES } from "./cases";

const ROOT = resolve(import.meta.dirname, "../..");
const k = loadKnowledge(join(ROOT, "src/data/knowledge-v5"));
const short = (m: Material) => m.kind === "trait" ? `T:${m.traitId}/${m.angle === "first" ? "소개" : "적용"}${m.scene ? "+장면" : ""}` : m.kind === "ref" ? `R:${m.ref}` : m.kind === "evidence" ? `E:${m.key}` : m.kind === "mbti" ? `M:${m.domain}` : m.kind === "rel" ? `REL:${m.topic}` : `TL:${m.entryKey}`;
for (const name of process.argv.slice(2)) {
  const b = buildBrief(CASES[name].input, k);
  console.log(`=== ${name} tokens ${b.budget.estimatedTokens}`);
  console.log(b.traits.map(t => `${t.id}:${t.easyName}(${t.name}) ${t.sameImageAs ? "~" + t.sameImageAs : ""}`).join(" | "));
  console.log("plan:", JSON.stringify(b.plan));
  for (const c of b.chapters) {
    if (c.sections) { console.log(`${c.index} ${c.id}`); for (const s of c.sections) console.log(`   · ${s.q} [${s.materials.map(short).join(" ")}]`); }
    else console.log(`${c.index} ${c.id} [${c.materials.map(short).join(" ")}]`);
  }
}
