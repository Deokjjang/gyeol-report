/**
 * 저장본 깃발 덤프(최종판2 3, 호출 0): 스냅샷 폴더의 책마다 지금 정리·검사(lintStored)가 잡는 문장을 JSON으로 낸다.
 * 같은 파일을 기준 트리(시작 커밋)와 이 트리에서 돌려 차이 = 새 검사가 잡은 문장(tools/final2/stored-diff.ts).
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/final2/stored-flags.ts <스냅샷 폴더> <출력.json>
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { lintStored } from "../final/replay";

const [dir, out] = process.argv.slice(2);
const rows: { book: string; rule: string; detail: string; at: string; sentence: string }[] = [];
for (const f of readdirSync(dir).filter(x => x.endsWith(".snapshot.json")).sort()) {
  const snap = JSON.parse(readFileSync(join(dir, f), "utf8"));
  const { flags } = lintStored(snap);
  for (const x of flags) rows.push({ book: f.replace(/\.snapshot\.json$/, ""), rule: x.rule, detail: x.detail ?? "", at: `${x.chapter}.${x.section}.${x.paragraph}`, sentence: x.sentence });
}
writeFileSync(out, JSON.stringify(rows, null, 1));
console.log(`책 ${new Set(rows.map(r => r.book)).size} · 깃발 ${rows.length}`);
