/**
 * P3.6 B 결과 문서 조립: pnpm exec tsx tools/p36/fullbook.ts <round> <머리말 md 파일> [핵심 장 지정 JSON]
 * → docs/v5/p36-fullbook.md = 머리말(채점·지표) + 커리어(c1) 전체 + 대운(X) 전체 + 연애·세운·궁합 2권의 핵심 장 2개씩.
 * 핵심 장 기본값: 연애 [7, 8](추천 상대·만남), 세운 [1, 5](올해 전체·12개월), 부모·자녀 [1, 9], 상사·팀원 [1, 9].
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
const [round = "r1", headPath, pickJson] = process.argv.slice(2);
const dir = join(ROOT, "docs/v5/trial/p36", round);
const book = (name: string) => readFileSync(join(dir, `${name}.final.md`), "utf8").trim();
const chapters = (text: string, ns: readonly number[]) => text.split(/\n(?=## \d+\. )/).filter(c => ns.includes(Number(c.match(/^## (\d+)\./)?.[1]))).join("\n\n");
const pick: Record<string, number[]> = { "y-love": [7, 8], "c2-annual": [1, 5], "pair-parent": [1, 9], "pair-boss": [1, 9], ...(pickJson ? JSON.parse(pickJson) : {}) };
const career = book("c1-career"), major = book("x-major");
const out = [
  readFileSync(headPath, "utf8").trim(), "",
  "---", "", `# 커리어·돈·학업 · c1 하람(서비스 기획자 29세) 전체 (${round}, 제목 포함 ${career.length.toLocaleString()}자)`, "", career, "",
  "---", "", `# 대운 · X 수진(기혼 간호사) 전체 (${round}, 제목 포함 ${major.length.toLocaleString()}자)`, "", major, "",
  "---", "", `# 연애·결혼·자녀 · Y 도현(대학생 싱글) ${pick["y-love"].join("·")}장`, "", chapters(book("y-love"), pick["y-love"]), "",
  "---", "", `# 세운 2026 · c2 서윤(시간 미상·연애 중·프리랜서) ${pick["c2-annual"].join("·")}장`, "", chapters(book("c2-annual"), pick["c2-annual"]), "",
  "---", "", `# 궁합 부모·자녀 · 정희(50대) × 지우(20대) ${pick["pair-parent"].join("·")}장`, "", chapters(book("pair-parent"), pick["pair-parent"]), "",
  "---", "", `# 궁합 상사·팀원 · 태호(팀장) × 하람(팀원) ${pick["pair-boss"].join("·")}장`, "", chapters(book("pair-boss"), pick["pair-boss"]), "",
].join("\n");
writeFileSync(join(ROOT, "docs/v5/p36-fullbook.md"), out + "\n");
console.log("docs/v5/p36-fullbook.md", out.length, "chars");
