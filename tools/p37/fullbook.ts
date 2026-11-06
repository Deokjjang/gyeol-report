/**
 * P3.7 1-6 결과 문서 조립: pnpm exec tsx tools/p37/fullbook.ts <round> <머리말 md 파일> [대운 연도 키 JSON]
 * → docs/v5/p37-fullbook.md = 머리말(채점·지표) + 대운(X) 연도 2개 + 다음 대운 전환 장 + 연애(Y) 3장(추천 상대·밀당·만남)
 *   + 커리어(c1) 4장(직무 추천·지금 일·돈 버는 방식·돈 굴리는 원칙) + 부모·자녀 9장 전체.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
const [round = "r1", headPath, yearsJson] = process.argv.slice(2);
const dir = join(ROOT, "docs/v5/trial/p37", round);
const book = (name: string) => readFileSync(join(dir, `${name}.final.md`), "utf8").trim();
const split = (text: string) => text.split(/\n(?=## \d+\. )/);
const chapters = (text: string, ns: readonly number[]) => split(text).filter(c => ns.includes(Number(c.match(/^## (\d+)\./)?.[1]))).join("\n\n");
const major = book("x-major");
const yearChapter = split(major).find(c => /\n### \d{4}/.test(c)) ?? "";
const years: string[] = yearsJson ? JSON.parse(yearsJson) : ["2026", "2027"];
const yearParts = yearChapter.split(/\n(?=### )/);
const yearText = [yearParts[0].split("\n")[0], ...yearParts.filter(p => years.some(y => p.startsWith(`### ${y}`)))].join("\n\n");
const transition = split(major).find(c => /^## \d+\. .*(넘어가|전환|바뀌)/.test(c)) ?? chapters(major, [4]);
const out = [
  readFileSync(headPath, "utf8").trim(), "",
  "---", "", `# 대운 · X 수진(기혼 간호사) 연도 ${years.join("·")} + 다음 대운 전환 장 (${round})`, "", yearText, "", transition, "",
  "---", "", "# 연애·결혼·자녀 · Y 도현(대학생 싱글) 3장: 추천 상대·밀당·만남", "", chapters(book("y-love"), [3, 4, 9]), "",
  "---", "", "# 커리어·돈·학업 · c1 하람(서비스 기획자 29세) 4장: 직무 추천·지금 일·돈 버는 방식·돈 굴리는 원칙", "", chapters(book("c1-career"), [4, 5, 6, 8]), "",
  "---", "", `# 궁합 부모·자녀 · 정희(50대) × 지우(20대) 9장 전체`, "", book("pair-parent"), "",
].join("\n");
writeFileSync(join(ROOT, "docs/v5/p37-fullbook.md"), out + "\n");
console.log("docs/v5/p37-fullbook.md", out.length, "chars");
