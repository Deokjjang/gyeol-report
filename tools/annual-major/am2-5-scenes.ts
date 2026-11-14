/** AM2-5 탐색(호출 0): key 장면 재료가 왜 빠지는지. */
import { cases } from "./final";
import { intakeOf } from "./am2-brief";
import { say, sceneFits } from "../../src/lib/writer/chunked/intake";
for (const c of cases().filter(x => x.product !== "launch" && process.argv.slice(2).includes(x.id))) {
  const { brief, intake } = intakeOf(c.payload);
  const keys = intake.chapters.flatMap(ch => ch.keys ?? []);
  console.log(`== ${c.id} scenes ${keys.filter(k => k.scene).length}/${keys.length} pairs ${keys.filter(k => k.pair).length}`);
  for (const k of keys) { const e = brief.timeline!.entries.find(x => x.key === k.key)!; console.log(`${k.label} | ${k.scene ? "KEEP" : "-"} | fits=${sceneFits(e.material.scene ?? "", brief)} | ${say(e.material.scene ?? "").slice(0, 90)}`); }
}
