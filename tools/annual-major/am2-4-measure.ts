/**
 * AM2-4 1부(호출 0): 역할 나누기 전후 글자 수 실측 — 저장된 책(P3)의 달·해 key 본문에서 화면이 맡게 된 사실(흐름 말 · 오행 채움 · 핵심 밖 관계 · 카드 할 일 · 행동)과
 * 4영역 나열·머리 뒤 되풀이 문장을 빼고 남는 글자(= 새 역할의 「핵심 + 의미」 몫)를 잰다. 새 key 목표 분량의 근거.
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/annual-major/am2-4-measure.ts <snapshot.json>…
 */
import { readFileSync } from "node:fs";
import type { V5BookDraft, V5Evidence } from "../../src/lib/writer/book";
import { buildWriterPrompt } from "../../src/lib/writer/prompt";
import { briefFor, writerKnowledge } from "../../src/lib/writer/publish";
import type { FinalChapter } from "../../src/lib/writer/safety";
import { splitSentences } from "../../src/lib/writer/safety/patterns";
import { buildIntake } from "../../src/lib/writer/chunked/intake";
import { am24Flags } from "../../src/lib/writer/chunked/check";
import { blockCtxFor } from "../../src/lib/writer/chunked/publish";

const q = (xs: number[], p: number) => { const s = [...xs].sort((a, b) => a - b); return s[Math.min(s.length - 1, Math.max(0, Math.round((s.length - 1) * p)))] ?? 0; };
for (const file of process.argv.slice(2)) {
  const snap = JSON.parse(readFileSync(file, "utf8")) as { draft: V5BookDraft; evidencePacket: V5Evidence & { input: unknown }; createdAtIso: string };
  const payload = snap.evidencePacket.input as never, at = snap.createdAtIso, { k } = writerKnowledge();
  const brief = briefFor(payload, at, undefined, undefined, k), plan = buildWriterPrompt(brief, { knowledge: k }).chapters;
  const intake = buildIntake(brief, k, plan, ((payload as { productOptions?: { wish?: string } }).productOptions)?.wish);
  const heads = new Map((brief.timeline?.entries ?? []).map(e => [e.key, (e.head ?? "").replace(/\([一-鿿]+\)/g, "")] as const));
  const keyed = snap.draft.chapters.find(c => c.keys)!;
  const fc: FinalChapter[] = [{ n: keyed.n, id: keyed.id, title: keyed.title, source: "writer", chars: 0, keys: keyed.keys, sections: keyed.sections.map(s => ({ heading: s.heading, paragraphs: s.paragraphs.map(p => p.replace(/\([一-鿿]+\)/g, "")).map((p, i) => { const h = heads.get(s.heading) ?? ""; return i === 0 && h && p.startsWith(h) ? p.slice(h.length).trim() : p; }).filter(Boolean) })) }];
  const flags = am24Flags(fc, blockCtxFor(brief, k, intake));
  const DOMAIN = /(일에서는|일 쪽에서는|돈에서는|돈은 |관계에서는|사람 사이에서는|연애에서는|컨디션은|몸은)/;
  const before: number[] = [], after: number[] = [];
  for (const [si, s] of fc[0].sections.entries()) {
    const sens = s.paragraphs.flatMap((p, pi) => splitSentences(p).map(t => ({ t: t.replace(/[⟪⟫]/g, ""), pi })));
    const kp = intake.chapters.flatMap(c => c.keys ?? []).find(x => x.key === s.heading);
    let domains = 0;
    const kept = sens.filter(x => { if (flags.some(f => f.section === si && f.rule === "screen_repeat" && f.sentence === x.t)) return false; if (DOMAIN.test(x.t) && ++domains > 2) return false; return true; });
    before.push(sens.reduce((a, x) => a + x.t.length, 0)); after.push(kept.reduce((a, x) => a + x.t.length, 0));
    void kp;
  }
  console.log(`${file.split("/").slice(-2).join("/")}: key ${before.length} · 전(머리 문장 뺀 본문) 평균 ${Math.round(before.reduce((a, b) => a + b, 0) / before.length)}자 [p25 ${q(before, 0.25)} · p50 ${q(before, 0.5)} · p75 ${q(before, 0.75)}] → 후(화면 사실·4영역 나열 뺌) 평균 ${Math.round(after.reduce((a, b) => a + b, 0) / after.length)}자 [p25 ${q(after, 0.25)} · p50 ${q(after, 0.5)} · p75 ${q(after, 0.75)}]`);
  console.log(`  key별 전→후: ${before.map((b, i) => `${b}→${after[i]}`).join(" · ")}`);
}
