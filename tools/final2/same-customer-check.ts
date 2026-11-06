/**
 * 같은 고객 책끼리 겹침(최종판2 5 판정, 호출 0): 새 책마다 같은 고객의 앞 책(발행 시각 순)과
 *  ① 이미지 줄(표지·관계 그림) 겹침(공백 뺀 8자 또는 같은 머리 명사) ② 본문 문장의 공백 뺀 12자 이상 같은 구간을 모두 낸다.
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/final2/same-customer-check.ts <reportId…(앞 책부터)>
 */
import { avoidOverlaps } from "../../src/lib/brief/imageLedger";
import { imageLinesOf } from "../../src/lib/writer/prior";
import { splitSentences } from "../../src/lib/writer/safety/patterns";
import { loadSnap } from "../final/replay";

const squash = (s: string) => s.replace(/[\s"“”'‘’「」『』()（）*]/g, "");
async function main() {
  const ids = process.argv.slice(2);
  const books = await Promise.all(ids.map(async id => { const { snap } = await loadSnap(id); const d = snap.draft; return { id, product: d.productType, images: imageLinesOf(d), sentences: d.chapters.flatMap(c => c.sections.flatMap(s => s.paragraphs.flatMap(p => splitSentences(p)))), finalLine: (d as { finalLine?: string }).finalLine ?? "" }; }));
  for (let i = 1; i < books.length; i++) {
    const me = books[i], prior = books.slice(0, i);
    const img = me.images.flatMap(line => avoidOverlaps(line, prior.flatMap(p => p.images)).map(x => `「${line}」 ↔ 「${x}」`));
    const grams = new Map<string, string>();
    for (const p of prior) for (const s of p.sentences) { if (s === p.finalLine) continue; const q = squash(s); for (let j = 0; j + 12 <= q.length; j++) grams.set(q.slice(j, j + 12), `${p.product}: ${s}`); }
    const hits = me.sentences.filter(s => s !== me.finalLine).flatMap(s => { const q = squash(s); for (let j = 0; j + 12 <= q.length; j++) { const g = grams.get(q.slice(j, j + 12)); if (g) return [`- ${s.slice(0, 110)}\n  ⟵ ${g.slice(0, 110)}`]; } return []; });
    console.log(`\n## ${me.product} ${me.id} ↔ 앞 ${prior.length}권(${prior.map(p => p.product).join(", ")})\n이미지 겹침 ${img.length}${img.length ? `: ${img.join(" · ")}` : ""}\n12자 이상 같은 구절 ${hits.length}\n${hits.join("\n")}`);
  }
}
void main();
