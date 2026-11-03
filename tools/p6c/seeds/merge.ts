/**
 * P6c A1 변환 결과 합치기: pnpm exec tsx tools/p6c/seeds/merge.ts <작업 폴더>
 * batch-*.json(원문)과 out-*.json(결과)을 짝지어 check.ts 규칙으로 거르고, 통과한 것만 src/data/knowledge-v5/materials.json(원문 sha1 앞 12자 → 재료)에 쓴다.
 * 이미 있는 재료는 지우지 않는다(같은 키면 새 결과로 덮는다). 위반·누락 수를 출력한다.
 */
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { problems } from "./check";
import { KNOW, type Item } from "./extract";

const dir = process.argv[2]; if (!dir) throw new Error("작업 폴더");
const key = (t: string) => createHash("sha1").update(t).digest("hex").slice(0, 12);
const OUT = join(KNOW, "materials.json");
const prev = existsSync(OUT) ? (JSON.parse(readFileSync(OUT, "utf8")) as { items: Record<string, string> }).items : {};
const items: Record<string, string> = { ...prev };
let ok = 0, bad = 0, missing = 0;
for (const f of readdirSync(dir).filter(x => /^batch-.+\.json$/.test(x)).sort()) {
  const outFile = join(dir, f.replace(/^batch-/, "out-"));
  const batch = JSON.parse(readFileSync(join(dir, f), "utf8")) as Item[];
  if (!existsSync(outFile)) { missing += batch.length; console.log(`${f}: 결과 없음`); continue; }
  const out = JSON.parse(readFileSync(outFile, "utf8")) as Record<string, string>;
  let fb = 0;
  for (const b of batch) {
    const v = out[b.id];
    if (v === undefined) { missing++; continue; }
    const p = problems(b, v);
    if (p.length) { bad++; fb++; if (fb <= 3) console.log(`  ${b.id}: ${p.join(" / ")}`); continue; }
    items[key(b.text)] = v.trim(); ok++;
  }
  console.log(`${f}: ${batch.length - fb}/${batch.length}`);
}
const sorted = Object.fromEntries(Object.entries(items).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync(OUT, JSON.stringify({ version: "materials-v1", note: "P6c A1: 원문 sha1 앞 12자 → 작가 재료(상황 씨앗·적용 방향·핵심 뜻·MBTI 기능 '쉬운 이름 | 방향'). tools/p6c/seeds로 만든다.", items: sorted }, null, 0).replace(/","/g, '",\n"') + "\n");
console.log(JSON.stringify({ ok, bad, missing, total: Object.keys(sorted).length }));
