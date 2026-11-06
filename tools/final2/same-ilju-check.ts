/**
 * 같은 일주 다른 고객 책과 공백 뺀 12자 이상 같은 구절(최종판2 5 판정, 호출 0, 글자 그대로 대조): 이미지 대장의 같은 일주 책(다른 사람, 이 책보다 앞)과 견준다.
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/final2/same-ilju-check.ts <reportId…>
 */
import { loadFileLedger } from "../final/fileLedger";
const IMAGE_LEDGER = loadFileLedger();
import { splitSentences } from "../../src/lib/writer/safety/patterns";
import { peopleOf } from "../../src/lib/writer/prior";
import { briefOfSnap, loadSnap } from "../final/replay";

const squash = (s: string) => s.replace(/[\s"“”'‘’「」『』()（）*]/g, "");
async function main() {
  for (const id of process.argv.slice(2)) {
    const { snap } = await loadSnap(id); const b = briefOfSnap(snap), me = peopleOf(snap.evidencePacket.input), at = snap.evidencePacket.generatedAt;
    const pillars = [b.chart.pillars.day.hanja, ...(b.partner ? [b.partner.chart.pillars.day.hanja] : [])];
    const others = [...new Set(pillars.flatMap(p => (IMAGE_LEDGER.byDayPillar[p] ?? []).filter(x => x.book && x.at && x.at < at && !(x.people ?? []).some(q => me.includes(q))).map(x => x.book!)))];
    const grams = new Map<string, string>();
    for (const o of others) { try { const { snap: s } = await loadSnap(o); for (const c of s.draft.chapters) for (const sec of c.sections) for (const p of sec.paragraphs) for (const t of splitSentences(p)) { const q = squash(t); for (let j = 0; j + 12 <= q.length; j++) grams.set(q.slice(j, j + 12), `${o.slice(0, 15)}: ${t}`); } } catch { /* 저장소에 없는 시험본 */ } }
    const finalLine = (snap.draft as { finalLine?: string }).finalLine;
    const hits = snap.draft.chapters.flatMap(c => c.sections.flatMap(s => s.paragraphs.flatMap(p => splitSentences(p)))).filter(s => s !== finalLine).flatMap(s => { const q = squash(s); for (let j = 0; j + 12 <= q.length; j++) { const g = grams.get(q.slice(j, j + 12)); if (g) return [`- ${s.slice(0, 110)}\n  ⟵ ${g.slice(0, 120)}`]; } return []; });
    console.log(`\n## ${snap.draft.productType} ${id} — 같은 일주(${pillars.join("·")}) 다른 고객 앞 책 ${others.length}권\n12자 이상 같은 구절 ${hits.length}\n${hits.join("\n")}`);
  }
}
void main();
