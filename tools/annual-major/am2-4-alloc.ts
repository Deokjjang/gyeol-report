/**
 * AM2-4 2부 배분표(호출 0): 처방 종류(카드 할 일 · 장) · 근거의 집 장 · 장면 씨앗(묶음당 하나) · key 핵심 · 화면 「뜻」 한 줄.
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/annual-major/am2-4-alloc.ts annual-1 major-1
 */
import { coreOf, coreRowLine } from "../../src/lib/brief/core";
import { rxKindsOf } from "../../src/lib/brief/prescriptions";
import { cases } from "./final";
import { intakeOf } from "./am2-brief";

for (const id of process.argv.slice(2)) {
  const { brief, intake } = intakeOf(cases().find(x => x.id === id)!.payload);
  console.log(`\n### ${id}\n\n| 자리 | 처방 종류 | 할 일·처방 |\n|---|---|---|`);
  for (const e of brief.timeline!.entries.filter(x => x.todo && x.period !== "past")) console.log(`| ${e.kind === "month" ? e.label.split(" (")[0] : `${e.key}년`} 카드 | ${rxKindsOf(e.todo!).join("·") || "사전 밖"} | ${e.todo} |`);
  for (const c of intake.chapters.filter(x => x.sections)) console.log(`| ${c.n}장 ${c.title} | ${c.rx?.use ?? "사전 밖"} | 금지 ${c.rx?.forbid.length ?? 0}종 |`);
  const away = intake.chapters.flatMap(c => Object.entries(c.away ?? {}).map(([lid, h]) => `${lid}(${h}장 집 → ${c.n}장 한 줄)`));
  console.log(`\n- 근거의 집: 다른 장이 집인 근거 ${away.length}개 — ${away.slice(0, 12).join(" · ")}${away.length > 12 ? " …" : ""}`);
  const scenes = intake.chapters.flatMap(c => [...(c.scenes ?? []).map(s => `${c.n}장`), ...(c.sections ?? []).filter(s => s.scene).map(() => `${c.n}장 절`), ...(c.keys ?? []).filter(k => k.scene).map(k => k.label)]);
  console.log(`- 장면 씨앗(묶음당 하나): ${scenes.length}개 — ${scenes.join(" · ")}`);
  const kp = intake.chapters.find(c => c.keys)!.keys!;
  console.log(`- key 핵심(엔진 가중치) · 반드시 쓸 것 · 화면 「뜻」:\n${kp.map(k => { const e = brief.timeline!.entries.find(x => x.key === k.key)!; return `  - ${k.label}: 핵심 ${(k.core ?? []).join(" / ")} · 반드시 ${(k.must ?? []).map(m => m.what).join(" / ") || "없음(머리 문장)"} · 뜻 「${coreRowLine(coreOf(e))}」 · 근거 ${k.lines.length}줄`; }).join("\n")}`);
}
