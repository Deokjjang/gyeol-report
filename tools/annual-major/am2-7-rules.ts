/** AM2-7 4부(호출 0): 작가 시스템 글(규칙 + 문체 예시)의 줄 수 · 꺾쇠 〈〉 수 · 글자째 틀 수. 옛 코드 worktree에서도 같은 파일로 잰다. */
import { chunkRules, ruleCtxOf } from "../../src/lib/writer/chunked/prompt";
import { intakeOf } from "./am2-brief";
import { cases } from "./final";
const TEMPLATES = [/과 같은 [^.」]{0,12}자리지만 이번엔/, /와 같은 쪽으로 겹쳐요/, /와 부딪치는 결이라/, /을 …이 채워 줘요/, /N월 · 간지월/, /핵심 관계 이름 한 번/, /핵심 이름이 이 사람의 어느 자리에/];
for (const id of ["annual-1", "major-1"]) {
  const c = cases().find(x => x.id === id)!; const { intake } = intakeOf(c.payload);
  const t = chunkRules(ruleCtxOf(intake)), rules = t.split("# 문체 예시")[0];
  console.log(`${id}: 규칙 줄 ${rules.split("\n").filter(l => /^- /.test(l.trim())).length} · 전체 줄 ${t.split("\n").length} · 꺾쇠 〈〉 ${(t.match(/[〈〉]/g) ?? []).length / 2} · 글자째 틀 ${TEMPLATES.filter(re => re.test(t)).length}`);
}
