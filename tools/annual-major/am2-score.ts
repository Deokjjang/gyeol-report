/**
 * AM2 결정론 점수(호출 0): 분량 · 반복률 · 근거 수 · 생활 장면 수 · 다른 고객과 겹치지 않는 문장 비율 — 새 판과 옛 판(AM 확인 생성)을 나란히.
 *   NODE_PATH=tools/quality/shim pnpm exec tsx tools/annual-major/am2-score.ts <이름=snapshot.json> …
 */
import { readFileSync } from "node:fs";
import { measureBooks, type RatchetBook } from "../quality/ratchet";
import { writerKnowledge } from "../../src/lib/writer/publish";
import { styleScore } from "../../src/lib/writer/safety/style";
import type { FinalChapter } from "../../src/lib/writer/safety";

const books: RatchetBook[] = process.argv.slice(2).map(a => { const [id, f] = a.split("="); return { id, snap: JSON.parse(readFileSync(f, "utf8")) }; });
const m = measureBooks(books, writerKnowledge().k);
for (const b of books) {
  const d = b.snap.draft, finals = d.chapters.map(ch => ({ n: ch.n, id: ch.id, title: ch.title, source: "writer", chars: 0, sections: ch.sections.map(s => ({ heading: s.heading, paragraphs: [...s.paragraphs] })) })) as unknown as FinalChapter[];
  const st = styleScore(finals), x = m[b.id];
  console.log(`${b.id}: 본문 ${x.chars}자 · 근거 ${x.evidence.total}(명리 ${x.evidence.saju} · MBTI 기능 ${x.evidence.mbtiFn} · 성향 ${x.evidence.mbtiTrait} · 짝 ${x.evidence.fusion}) · 장면 ${x.scenes}/${x.sentences}문장 · 고유 ${Math.round(x.uniqueRatio * 1000) / 10}% · 반복률 ${st.repeatRate}% · 시작 다양성 ${st.startDiversity}% · lint ${x.lint}(사실·금지 ${x.lintHard})`);
}
