/**
 * 측정 재판정(호출 0): 검수 원문(.cache/writer, 같은 실행 이름)에 지금 안전장치(guardReview)를 다시 적용하고, 결정론 깃발을 지금 코드로 다시 계산한다.
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/final3/reguard.ts <모델> <실행 꼬리표>
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { guardReview } from "../../src/lib/writer/review";
import { lintStored, type Snap } from "../final/replay";

const [model, tag] = process.argv.slice(2);
const file = `.cache/final3/review-${model}.json`;
const rows = JSON.parse(readFileSync(file, "utf8")) as { book: string; numbered: { n: number; text: string }[]; kept: unknown; direct: unknown; dropped: unknown; flags: unknown; formatError?: boolean }[];
const run = `review-measure-${model}${tag ? `-${tag}` : ""}`;
const entries = readdirSync(".cache/writer").filter(f => f.endsWith(".json")).map(f => JSON.parse(readFileSync(join(".cache/writer", f), "utf8")) as { run?: string; user?: string; entry: { text: string } }).filter(e => e.run === run);
const ids = new Set(["fs:people", "fs:standards", "fs:pair.common", "fs:pair.relations", "fs:pair.score"]);
for (const r of rows) {
  const snap = JSON.parse(readFileSync(`.cache/final3/stored/${r.book}.snapshot.json`, "utf8")) as Snap;
  r.flags = lintStored(snap).flags.map(f => ({ at: `${f.chapter}.${f.section}.${f.paragraph}`, rule: f.rule, detail: f.detail ?? "", sentence: f.sentence }));
  const probe = r.numbered.slice(1, 4).map(x => x.text);
  const e = entries.find(x => probe.every(p => x.user?.includes(p)));
  if (!e) { console.log(`${r.book}: 원문 없음`); continue; }
  const g = guardReview(e.entry.text, r.numbered as never, ids, 40, snap.draft.productType);
  r.kept = g?.kept ?? null; r.direct = g?.direct ?? null; r.dropped = g?.dropped ?? null; r.formatError = g === null;
}
writeFileSync(file, JSON.stringify(rows, null, 1));
console.log(`재판정 ${rows.length}권 (원문 ${entries.length})`);
