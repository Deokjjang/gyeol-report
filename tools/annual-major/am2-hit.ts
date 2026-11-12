/**
 * AM2-3 7부(호출 0): 저장된 책(발행 원고)에 지금 검사를 대어 ① 판독 결함 하나하나가 어느 검사에 걸리는지(적중) ② 새로 생긴 깃발 전부(오탐 검토용)를 낸다.
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/annual-major/am2-hit.ts <snapshot.json> [--src P2-annual-1] [--flags out.tsv]
 * 발행 원고의 한자 주석·머리 문장(시스템)·책 끝 안내는 떼고 본다(작가 몫만). 화면 카드는 저장된 카드 값으로 brief 검사(screen)에 댄다.
 */
import { readFileSync, writeFileSync } from "node:fs";
import type { V5BookDraft, V5Evidence } from "../../src/lib/writer/book";
import { buildWriterPrompt } from "../../src/lib/writer/prompt";
import { factSheetFor, lintContext, writerKnowledge, briefFor } from "../../src/lib/writer/publish";
import type { FinalChapter } from "../../src/lib/writer/safety";
import { lintBook } from "../../src/lib/writer/safety/p6c";
import { bookNotice } from "../../src/lib/writer/safety/p6e";
import { buildIntake, WISH_MARK } from "../../src/lib/writer/chunked/intake";
import { adjacentRepeats, adviceRepeats, blockFlags, briefCheck, crossRepeats, endingCaps, rxRepeats, type ChunkFlag } from "../../src/lib/writer/chunked/check";
import { blockCtxFor } from "../../src/lib/writer/chunked/publish";
import { DEFECTS as DEFECTS3 } from "./am2-3-defects";
import { DEFECTS4 } from "./am2-4-defects";
const DEFECTS = [...DEFECTS3, ...DEFECTS4] as readonly { id: string; src: string; sev: string; loc: string; frag: string; what: string; det: readonly string[] }[];

const argv = process.argv.slice(2), file = argv[0];
const src = argv.includes("--src") ? argv[argv.indexOf("--src") + 1] : undefined, out = argv.includes("--flags") ? argv[argv.indexOf("--flags") + 1] : undefined;
const snap = JSON.parse(readFileSync(file, "utf8")) as { productType: string; draft: V5BookDraft; evidencePacket: V5Evidence & { input: unknown }; createdAtIso: string };
const payload = snap.evidencePacket.input as never, at = snap.createdAtIso;
const { k } = writerKnowledge();
const brief = briefFor(payload, at, undefined, undefined, k), plan = buildWriterPrompt(brief, { knowledge: k }).chapters;
const wish = ((payload as { productOptions?: { wish?: string } }).productOptions)?.wish;
const intake = buildIntake(brief, k, plan, wish);
const lctx = lintContext(brief, k, plan, [], undefined, factSheetFor(payload, at, brief, k));
const heads = new Set((brief.timeline?.entries ?? []).map(e => (e.head ?? "").replace(/\([一-鿿]+\)/g, "").replace(/[一-鿿]+/g, "")));
// 시스템 끝 안내는 지금 문구·옛 문구(모든 상품) 모두 뗀다(오탐 검토 major: 옛 기본 문구가 걸림).
const notices = ["annual_fortune", "major_fortune", "saju_mbti_full", "career_money_study", "love_marriage_child", "saju_mbti_compatibility"].map(bookNotice);
const notice = bookNotice(brief.product);
// AM2-3 3-2: 발행 원고의 소망 인용은 렌더가 «바람» 표시를 고객 원문으로 바꾼 것이다 — 검사는 표시 꼴로 본다(작가가 원문을 고쳐 쓴 인용만 걸린다).
const wishRendered = wish ? `«${wish}»` : "";
const clean = (t: string) => (wishRendered ? t.split(wishRendered).join(WISH_MARK) : t).replace(/\(([一-鿿]+)\)/g, "").replace(/[一-鿿]+/g, "");
const chapters: FinalChapter[] = snap.draft.chapters.map(ch => ({ n: ch.n, id: ch.id, title: ch.title, source: "writer", chars: 0, ...(ch.keys ? { keys: ch.keys } : {}),
  sections: ch.sections.map(s => ({ heading: s.heading, paragraphs: s.paragraphs.map(p => { let t = clean(p).replace(notice, ""); for (const nt of notices) t = t.replace(nt, ""); t = t.trim(); for (const h of heads) if (h && t.startsWith(h)) t = t.slice(h.length).trim(); return t; }).filter(Boolean) })) }));
const flags: ChunkFlag[] = [...blockFlags(chapters, lintBook(chapters, lctx), blockCtxFor(brief, k, intake)), ...crossRepeats(chapters), ...adviceRepeats(chapters), ...rxRepeats(chapters, intake), ...endingCaps(chapters), ...adjacentRepeats(chapters, intake.lines.map(l => l.value))];
// 화면 카드(저장된 값).
const cards = (snap.draft as unknown as { timeline?: { cards?: Record<string, unknown>[] } }).timeline?.cards ?? [];
const screen = cards.flatMap(c => ["label", "imageLine", "todo", "review", "caution", "good"].filter(f => typeof c[f] === "string" && c[f]).map(f => ({ where: `${c.key} ${f}`, text: String(c[f]) })));
const screenIssues = briefCheck(intake, [], { screen }).filter(v => v.rule === "screen");
const norm = (t: string) => t.replace(/[^가-힣A-Za-z0-9]/g, "");
if (src) {
  console.log(`## ${src} 적중(판독 결함 ↔ 깃발)`);
  let detN = 0, detHit = 0;
  for (const d of DEFECTS.filter(x => x.src === src)) {
    const f = norm(d.frag);
    const hits = d.loc.startsWith("화면") ? screenIssues.filter(v => norm(v.text).includes(f) || f.includes(norm(v.text))).map(() => "screen")
      : (() => { const at = chapters.flatMap(ch => ch.sections.flatMap((sx, si) => sx.paragraphs.map((p, pi) => ({ n: ch.n, si, pi, t: norm(p), h: norm(sx.heading) })))).find(z => f && (z.t.includes(f) || z.h.includes(f)));
          return flags.filter(x => f && (norm(x.sentence).includes(f) || (norm(x.sentence).length >= 8 && f.includes(norm(x.sentence))) || (at && /domain_list|must_miss/.test(x.rule) && x.chapter === at.n && x.section === at.si && x.paragraph === at.pi))).map(x => x.rule); })();
    const want = d.det.length > 0; if (want) { detN++; if (hits.length) detHit++; }
    const expected = d.det.filter(r => hits.includes(r));
    console.log(`| ${d.id} | ${d.sev} | ${want ? (hits.length ? "적중" : "놓침") : "근원"} | ${[...new Set(hits)].join("·") || "—"}${want && !expected.length && hits.length ? ` (기대 ${d.det.join("·")})` : ""} | ${d.what} |`);
  }
  console.log(`결정론으로 잡을 꼴 ${detN} 가운데 적중 ${detHit}`);
}
// --ctx: 오탐 검토용 문맥(문단 글 · key면 설계도 핵심·화면 사실).
const ctx = argv.includes("--ctx");
const keyPlans = new Map(intake.chapters.flatMap(c => (c.keys ?? []).map(kp => [kp.key, kp] as const)));
const ctxOf = (x: ChunkFlag) => { const ch = chapters.find(c => c.n === x.chapter), sec = ch?.sections[x.section]; const para = x.paragraph >= 0 ? sec?.paragraphs[x.paragraph] ?? "" : sec?.heading ?? ""; const kp = sec && ch?.keys?.includes(sec.heading) ? keyPlans.get(sec.heading) : undefined;
  return `${para.replace(/\s+/g, " ").slice(0, 500)}${kp ? ` ⟦${kp.label} 핵심: ${(kp.core ?? []).join("/")} · 화면: ${(kp.screen ?? []).join(" · ")}⟧` : ""}`; };
const lines = flags.map(x => `${x.rule}\t${x.chapter}.${x.section}.${x.paragraph}\t${x.detail ?? ""}\t${x.sentence.slice(0, 200)}${ctx ? `\t${ctxOf(x)}` : ""}`);
if (out) writeFileSync(out, [...lines, ...screenIssues.map(v => `screen\t${v.where}\t\t${v.text}`)].join("\n"));
const by = flags.reduce<Record<string, number>>((o, x) => ({ ...o, [x.rule]: (o[x.rule] ?? 0) + 1 }), {});
console.log(`깃발 ${flags.length} ${JSON.stringify(by)} · 화면 ${screenIssues.length}`);
