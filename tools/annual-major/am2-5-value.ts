/**
 * AM2-5 3부 가치 지표의 결정론 몫(호출 0): key마다 본문 길이(머리 문장 뺌, 공백 포함) · MBTI 등장 문장 수 · 고리 낌새(자리 뜻 말 + 입력 말) · 장면 낌새(조건 「…할 때」·비유 「…처럼」).
 * 「이 사람만의 문장」 판정은 판독(rubric.md 6절)이 한다 — 이 표는 판독이 맞대는 참고 값이다.
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/annual-major/am2-5-value.ts <case> <snapshot.json> [<snapshot.json> …]
 */
import { readFileSync } from "node:fs";
import { splitSentences } from "../../src/lib/writer/safety/patterns";
import { stripHanja } from "../../src/lib/writer/safety/p6e";
import { cases } from "./final";
import { intakeOf } from "./am2-brief";

const [id, ...paths] = process.argv.slice(2);
const c = cases().find(x => x.id === id)!;
const { brief, intake } = intakeOf(c.payload);
const keys = intake.chapters.flatMap(ch => ch.keys ?? []);
const mbti = brief.mbti?.type;
const SEAT = /가까운 사람|일터|사회생활|윗사람|바깥 모임|배우자|연인|자녀|혼자 쓰는 시간|태어난 (해|달|날|시각) 자리/;
const INPUT = /솔로|직장|회사|프리랜서|사업|자영업|취업|연애 중|기혼|바람|«/;
const SCENE = /(할|하는|한|될|볼|날|때)(\s?때|\s?날이라면|\s?순간)|처럼|듯(이)?\s|라면,/;
const rows = paths.map(p => {
  const snap = JSON.parse(readFileSync(p, "utf8")) as { draft: { chapters: { keys?: string[]; sections: { heading: string; paragraphs: string[] }[] }[] } };
  const ch = snap.draft.chapters.find(x => x.keys)!;
  return keys.map(k => {
    const sec = ch.sections.find(s => s.heading === k.key);
    const head = stripHanja(k.head).text.replace(/[^가-힣]/g, "");
    const sents = (sec?.paragraphs ?? []).flatMap(t => splitSentences(stripHanja(t).text)).filter(s => s.replace(/[^가-힣]/g, "") !== head);
    const body = sents.join(" ");
    return { len: body.length, mbti: mbti ? sents.filter(s => s.includes(mbti)).length : 0, link: sents.filter(s => SEAT.test(s) && INPUT.test(s)).length, scene: sents.filter(s => SCENE.test(s)).length };
  });
});
const label = (p: string) => p.split("/").at(-2) ?? p;
console.log(`| key | ${paths.map(p => `${label(p)} 길이 · MBTI · 고리 낌새 · 장면 낌새`).join(" | ")} |`);
console.log(`|---|${paths.map(() => "---").join("|")}|`);
keys.forEach((k, i) => console.log(`| ${k.label} | ${rows.map(r => `${r[i].len} · ${r[i].mbti} · ${r[i].link} · ${r[i].scene}`).join(" | ")} |`));
console.log(`| **합·평균** | ${rows.map(r => `평균 ${Math.round(r.reduce((a, x) => a + x.len, 0) / r.length)}(최소 ${Math.min(...r.map(x => x.len))}) · MBTI key ${r.filter(x => x.mbti).length} · 고리 낌새 key ${r.filter(x => x.link).length} · 장면 낌새 key ${r.filter(x => x.scene).length}`).join(" | ")} |`);
