/**
 * P3.5 A9 결과 문서 조립: pnpm exec tsx tools/p35/fullbook.ts <round> <머리말 md 파일>
 * → docs/v5/p35-fullbook.md = 머리말(채점·지표, 사람이 씀) + c1 종합 전체 + X 1·2·8장 + Y 1·2·8장 + 궁합 연인 9장(결론).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
const [round = "r2", headPath] = process.argv.slice(2);
const dir = join(ROOT, "docs/v5/trial/p35", round);
const book = (name: string) => readFileSync(join(dir, `${name}.final.md`), "utf8").trim();
const chapters = (text: string, ns: readonly number[]) => text.split(/\n(?=## \d+\. )/).filter(c => ns.includes(Number(c.match(/^## (\d+)\./)?.[1]))).join("\n\n");
const chars = (t: string) => t.length;
const c1 = book("c1-full"), x = book("x-full"), y = book("y-full"), pair = book("pair-love");
const out = [
  readFileSync(headPath, "utf8").trim(), "",
  "---", "", `# c1 하람 · 종합 「나라는 사람」 (${round} 최종, 제목 포함 ${chars(c1).toLocaleString()}자)`, "", c1, "",
  "---", "", "# X 수진 · 종합 1·2·8장 (c1과 같은 丁丑 일주 · ISFJ · 여성 · 기혼 · 간호사)", "", chapters(x, [1, 2, 8]), "",
  "---", "", "# Y 도현 · 종합 1·2·8장 (c1과 천문성·정관 공유 · ENFP · 남성 · 대학생)", "", chapters(y, [1, 2, 8]), "",
  "---", "", "# 궁합 연인 하람 × 서윤 · 9장(결론)", "", chapters(pair, [9]), "",
].join("\n");
writeFileSync(join(ROOT, "docs/v5/p35-fullbook.md"), out + "\n");
console.log("docs/v5/p35-fullbook.md", out.length, "chars");
