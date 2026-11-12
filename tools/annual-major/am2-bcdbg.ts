/** AM2-3 확인(호출 0): 무작위 입력 브리프 검사 위반을 규칙·질문별로 센다(원인 찾기용). */
import { intakeOf, randomPayload } from "./am2-brief";
import { briefCheck } from "../../src/lib/writer/chunked/check";
import { briefCtxFor } from "../../src/lib/writer/chunked/publish";
import { safetyFacts } from "../../src/lib/writer/safety";
import { isNoticeSentence } from "../../src/lib/writer/safety/p6e";
const N = Number(process.argv[2] ?? 300), tally = new Map<string, number>(), ex = new Map<string, string>();
for (const p of ["annual_fortune", "major_fortune"] as const) for (let i = 0; i < N; i++) {
  try { const { brief, intake } = intakeOf(randomPayload(i, p, 7));
    for (const v of briefCheck(intake, safetyFacts(brief).nicknames ?? [], briefCtxFor(brief))) {
      let k = `${v.rule} ${v.rule === "plan_basis" ? v.where.replace(/^\d+장 /, "") + " " + v.text.slice(0, 30) : ""}`;
      if (v.rule === "notice") { const line = intake.lines.find(l => v.where.startsWith(l.id + " ")); const t = line ? (v.where.endsWith("값") ? line.value : line.meaning) : ""; const sen = t.split(/(?<=[.!?])\s+| · /).find(x => isNoticeSentence(x)) ?? t.slice(0, 80); k = `notice ${sen.slice(0, 70)}`; }
      tally.set(k, (tally.get(k) ?? 0) + 1); if (!ex.has(k)) ex.set(k, `${p}#${i} ${v.where}: ${v.text.slice(0, 140)}`);
    } } catch { /* 만세력이 받지 않는 시각 */ }
}
for (const [k, n] of [...tally].sort((a, b) => b[1] - a[1]).slice(0, 40)) console.log(`${n}\t${k}\n\t${ex.get(k)}`);
