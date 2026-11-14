/** AM2-3 확인(호출 0): 사례 하나의 브리프 검사 위반을 문맥(음양·동률·화면 카드)까지 보인다. */
import { cases } from "./final";
import { intakeOf } from "./am2-brief";
import { briefCheck } from "../../src/lib/writer/chunked/check";
import { briefCtxFor } from "../../src/lib/writer/chunked/publish";
import { safetyFacts } from "../../src/lib/writer/safety";
for (const id of process.argv.slice(2)) {
  const c = cases().find(x => x.id === id)!; const { brief, intake } = intakeOf(c.payload);
  const v = briefCheck(intake, safetyFacts(brief).nicknames ?? [], briefCtxFor(brief));
  console.log(`${id}: ${v.length}`); for (const x of v) console.log(`- [${x.rule}] ${x.where}: ${x.text.slice(0, 200)}`);
}
