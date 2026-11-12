/** AM2-5(호출 0): 판독용 작가 카드(인물 · 근거 · 짝 · 설계도)와 묶음 메시지를 그 책 폴더 card.txt로. 개발 세트·P5 처음 보는 입력 모두. */
import { writeFileSync } from "node:fs";
import { payloadFor } from "./am2-6-books";
import { intakeOf } from "./am2-brief";
import { chunkPlan, chunkRules, chunkUser, renderCard, ruleCtxOf } from "../../src/lib/writer/chunked/prompt";
const [id, out] = process.argv.slice(2);
const payload = payloadFor(id); // AM2-6: P6 처음 보는 입력(FRESH6)까지
const { intake } = intakeOf(payload);
writeFileSync(out, [renderCard(intake), "", "==== 묶음 ====", ...chunkPlan(intake).map(c => `\n--- ${c.id} ${c.chars.join("~")}\n${chunkUser(intake, c)}`), "", "==== 작가 규칙(이 책) ====", chunkRules(ruleCtxOf(intake))].join("\n"));
console.log(out);
