/** AM2-5 탐색(호출 0): key마다 핵심 관계·자리·영역 신호·장면 재료·하늘 십성. */
import { cases } from "./final";
import { intakeOf } from "./am2-brief";
import { coreOf } from "../../src/lib/brief/core";
const ids = process.argv.slice(2);
for (const c of cases().filter(x => x.product !== "launch" && (!ids.length || ids.includes(x.id)))) {
  const { brief, intake } = intakeOf(c.payload);
  console.log(`\n=== ${c.id} ${brief.person.facts.relationship} ${brief.person.facts.job.status} mbti=${brief.mbti?.type ?? "-"} children=${brief.person.facts.children} time=${brief.person.facts.birthTimeKnown} wish=${intake.wish ?? "-"}`);
  const yearE = brief.timeline?.entries.find(e => e.kind === "year");
  if (brief.product === "annual_fortune") console.log(`year ${yearE?.key} ${yearE?.ganji.hangul} badges=${yearE?.badges.map(b => `${b.label}@${b.with}`).join(", ")}`);
  console.log("cd", brief.chart.currentDayun?.ganji.hangul, brief.chart.currentDayun?.tenGod);
  for (const k of intake.chapters.flatMap(ch => ch.keys ?? [])) {
    const e = brief.timeline!.entries.find(x => x.key === k.key)!;
    const core = coreOf(e, {});
    console.log(`${k.label} | sky ${e.tenGod.stem} ground ${e.tenGod.branch} | core ${core.map(x => x.kind === "rel" ? `${x.name}@${x.badge.with ?? "-"}` : x.name).join(" / ")} | badges ${e.badges.map(b => `${b.label}@${b.with ?? "-"}`).join(", ")} | sig ${e.signals ? Object.entries(e.signals).map(([a, b]) => `${a}${b}`).join(" ") : "-"} | scene ${e.material.scene ? "Y" : "-"} | kscene ${k.scene ? "Y" : "-"}`);
  }
  console.log("lines with wish:", intake.lines.filter(l => l.subject === "input").map(l => `${l.id} ${l.value}: ${l.meaning}`).join(" || "));
}
