/**
 * 책 부록 "내 모든 기운"의 쉬운 이름·이미지 한 줄(P5). 지식 DB(knowledge-v5/myeongri)는 읽기만 한다.
 *   pnpm exec tsx tools/p5/build-glossary.ts → src/data/book-pages/glossary.json
 * 키: 용어 한글 이름(괄호 앞, 예 "현침살", "제왕", "편인", "갑목", 일주는 "갑신일주"). 값: [쉬운 이름, 한자, 이미지 한 줄(oneLiner)].
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
const SRC = join(ROOT, "src/data/knowledge-v5/myeongri");
// 부록 묶음(신살·귀인, 십성, 십이운성, 일간·일주, 지장간)에 나오는 가족만. 같은 이름이면 앞 가족이 이긴다(일간은 dayMaster).
const FAMILIES = ["shinsal", "gwiin", "tenGod", "twelveStage", "dayMaster", "dayPillar", "relation"];
type Feature = { id: string; name: string; easyName: string; oneLiner: string };
const out: Record<string, [string, string, string]> = {};
const files = readdirSync(SRC).filter(f => f.endsWith(".json")).map(f => JSON.parse(readFileSync(join(SRC, f), "utf8")) as { family: string; features: Feature[] });
for (const family of FAMILIES) for (const file of files.filter(f => f.family === family)) for (const f of file.features) {
  const m = f.name.match(/^([^(（]+)[(（]([^)）]+)[)）]/);
  if (!m) continue;
  const term = m[1].trim(), hanja = m[2].trim();
  const key = family === "dayPillar" ? `${term}일주` : term;
  out[key] ??= [f.easyName, hanja, f.oneLiner];
}
writeFileSync(join(ROOT, "src/data/book-pages/glossary.json"), JSON.stringify({ version: "book-glossary-1", source: `knowledge-v5/myeongri ${FAMILIES.join("·")} easyName·oneLiner`, terms: out }) + "\n");
console.log(Object.keys(out).length, "terms", JSON.stringify(out).length, "bytes");
