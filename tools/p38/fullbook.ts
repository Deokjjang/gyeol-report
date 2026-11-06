/**
 * P3.8 6 결과 문서 조립: pnpm exec tsx tools/p38/fullbook.ts <round> <머리말 md 파일> [종합 장 번호 JSON]
 * → docs/v5/p38-fullbook.md = 머리말(채점·지표) + 책별 특성 언급 수 표 + 커리어(c1) 4·5장 + 부모·자녀 2·9장 + 대운(X) 전환 장 + 종합(c1) 3장.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
const [round = "r1", headPath, fullJson] = process.argv.slice(2);
const dir = join(ROOT, "docs/v5/trial/p38", round);
const book = (name: string) => readFileSync(join(dir, `${name}.final.md`), "utf8").trim();
const split = (text: string) => text.split(/\n(?=## \d+\. )/);
const chapters = (text: string, ns: readonly number[]) => split(text).filter(c => ns.includes(Number(c.match(/^## (\d+)\./)?.[1]))).join("\n\n");
const major = book("x-major");
const transition = split(major).find(c => /^## \d+\. 흐름이 바뀌는 해/.test(c)) ?? chapters(major, [4]);
const fullNs: number[] = fullJson ? JSON.parse(fullJson) : [3, 6, 9];

type Use = { id: string; name: string; sections: number; chapters: number; maxInChapter: number; planned: number };
const table = (name: string, label: string) => {
  const m = JSON.parse(readFileSync(join(dir, `${name}.metrics.json`), "utf8")) as { traitUse?: { traits: Use[]; axes: Record<string, number>; warnings: string[] } };
  const u = m.traitUse;
  if (!u) return `### ${label}\n(지표 없음)`;
  const over = Object.entries(u.axes).filter(([, n]) => n > 3).map(([a, n]) => `${a} ${n}`);
  return [`### ${label}`, "", "| trait | 쉬운 이름 | 배정(소개+적용) | 원고 소제목 | 원고 장 | 한 장 최대 |", "|---|---|---|---|---|---|",
    ...u.traits.map(t => `| ${t.id} | ${t.name} | ${t.planned} | ${t.sections} | ${t.chapters} | ${t.maxInChapter} |`),
    "", `같은 축 소제목 3개 초과: ${over.length ? over.join(", ") : "없음"} · 경고 ${u.warnings.length}건${u.warnings.length ? `(${u.warnings.join("; ")})` : ""}`].join("\n");
};

const out = [
  readFileSync(headPath, "utf8").trim(), "",
  "## 책별 특성 언급 수 (안전망 측정: 소제목 단위, 상한 = 소개 1 + 적용 2 = 3, 한 장 1)", "",
  table("c1-career", "커리어 c1 하람"), "", table("pair-parent", "궁합 부모·자녀 정희 × 지우"), "", table("x-major", "대운 X 수진"), "", table("c1-full", "종합 c1 하람"), "",
  "---", "", `# 커리어·돈·학업 · c1 하람(서비스 기획자 29세) 4·5장: 직무 추천·지금 일 (${round})`, "", chapters(book("c1-career"), [4, 5]), "",
  "---", "", "# 궁합 부모·자녀 · 정희(50대) × 지우(20대) 2·9장", "", chapters(book("pair-parent"), [2, 9]), "",
  "---", "", "# 대운 · X 수진(기혼 간호사) 흐름이 바뀌는 해(전환 장)", "", transition, "",
  "---", "", `# 종합 · c1 하람 ${fullNs.join("·")}장(반복 회귀 확인)`, "", chapters(book("c1-full"), fullNs), "",
].join("\n");
writeFileSync(join(ROOT, "docs/v5/p38-fullbook.md"), out + "\n");
console.log("docs/v5/p38-fullbook.md", out.length, "chars");
