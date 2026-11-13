/**
 * AM2-6 9부 다시 쓰기 순익(호출 0): 한 권의 첫 원고(meta.raw kind=first)와 발행 원고에 같은 검사를 대어,
 * 고친 결함(첫 원고에 있고 발행에 없음)과 만든 결함(발행에 있고 첫 원고에 없음)을 층(차단 · 경계 · 알림 · 경미)마다 센다.
 * 맞춤은 (규칙, 장.소제목) 묶음의 개수 차이다 — 같은 자리에서 문장이 바뀌어도 같은 규칙이 남으면 「남음」으로 본다.
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/annual-major/am2-6-net.ts P6-annual-1 [P6-… ] [--list]
 */
import { join } from "node:path";
import { parseChapters } from "../../src/lib/writer/format";
import { adjacentRepeats, adviceRepeats, blockFlags, crossRepeats, CUT_ONLY_RULES, endingCaps, FIX_BOUNDARY, FIX_RULES, MINOR_RULES, PIGGYBACK_RULES, rxRepeats, valueFlags, type ChunkFlag } from "../../src/lib/writer/chunked/check";
import { blockCtxFor } from "../../src/lib/writer/chunked/publish";
import { lintBook } from "../../src/lib/writer/safety/p6c";
import { stripHanja } from "../../src/lib/writer/safety/p6e";
import { lintContext, writerKnowledge } from "../../src/lib/writer/publish";
import type { FinalChapter } from "../../src/lib/writer/safety";
import { loadSaved, OUT2 } from "./am2-6-books";

type Raw = { kind: string; text: string };
const tier = (r: string) => (FIX_BOUNDARY.has(r) ? "경계" : FIX_RULES.has(r) ? "알림" : PIGGYBACK_RULES.has(r) || CUT_ONLY_RULES.has(r) || MINOR_RULES.has(r) ? "경미" : "차단");
const TIERS = ["차단", "경계", "알림", "경미"] as const;

export function netOf(folder: string) {
  const id = folder.replace(/^P\d+-/, "");
  const saved = loadSaved(join(OUT2, folder, "snapshot.json"), id)!;
  const { k } = writerKnowledge();
  const raws = (saved.snap.evidencePacket.meta.raw as Raw[]).filter(r => r.kind === "first");
  const finalBy = new Map(saved.chs.map(c => [c.n, c]));
  // 발행 원고의 key 소제목은 key 값(2027-M01), 첫 원고는 이름(2월 · 임인월) — 같은 key로 맞춘다.
  const keyOfLabel = new Map(saved.intake.chapters.flatMap(c => (c.keys ?? []).map(k2 => [k2.label, k2.key] as const)));
  // 한 장이 여러 묶음에 나뉘어 오면(세운 7장 · 대운 5장) 같은 장 번호로 합치고, 소제목은 발행 원고의 순서로 놓는다
  // (P6 판독 annual-p6a: 묶음마다 소제목 번호가 0부터라 첫 원고 「7.3」과 발행 「7.7」이 같은 key인데 「고침」 · 「만듦」에 한 번씩 잡혔다).
  const parsed = raws.flatMap(r => parseChapters(r.text)), byN = new Map<number, typeof parsed>();
  for (const c of parsed) byN.set(c.n, [...(byN.get(c.n) ?? []), c]);
  const firstChs: FinalChapter[] = [...byN].map(([n, parts]) => {
    const order = (finalBy.get(n)?.sections ?? []).map(s => s.heading);
    const sections = parts.flatMap(c => c.sections).map(s => ({ heading: keyOfLabel.get(s.heading.trim()) ?? s.heading, paragraphs: s.paragraphs.map(p => stripHanja(p).text).filter(Boolean) }));
    const pos = (h: string) => { const i = order.indexOf(h); return i < 0 ? order.length : i; };
    sections.sort((x, y) => pos(x.heading) - pos(y.heading));
    return { n, id: finalBy.get(n)?.id ?? `c${n}`, title: parts[0].title, source: "writer", chars: 0, ...(finalBy.get(n)?.keys ? { keys: finalBy.get(n)!.keys } : {}), sections } as unknown as FinalChapter;
  }).sort((a, b) => a.n - b.n);
  const ns = new Set(firstChs.map(c => c.n));
  const finalChs: FinalChapter[] = saved.chs.filter((c: FinalChapter) => ns.has(c.n));
  const b = blockCtxFor(saved.brief, k, saved.intake), lctx = { ...lintContext(saved.brief, k, saved.plan, [], undefined, undefined), noCards: true };
  const normS = (t: string) => t.replace(/[^가-힣A-Za-z0-9]/g, "");
  const heads = new Set(saved.intake.chapters.flatMap(c => (c.keys ?? []).map(k2 => normS(k2.head))).filter(Boolean));
  const cardValues = saved.intake.lines.map(l => l.value);
  const flagsOf = (chs: readonly FinalChapter[]): ChunkFlag[] => [...blockFlags(chs, lintBook(chs, lctx as never), b), ...crossRepeats(chs, heads), ...adviceRepeats(chs), ...rxRepeats(chs, saved.intake), ...endingCaps(chs, heads), ...adjacentRepeats(chs, cardValues), ...valueFlags(chs)];
  const fa = flagsOf(firstChs), fb = flagsOf(finalChs);
  const bag = (fs: readonly ChunkFlag[]) => { const m = new Map<string, ChunkFlag[]>(); for (const f of fs) { const key = `${f.rule}|${f.chapter}.${f.section}`; m.set(key, [...(m.get(key) ?? []), f]); } return m; };
  const A = bag(fa), B = bag(fb);
  const rows: Record<string, { first: number; final: number; fixed: number; made: number; kept: number }> = Object.fromEntries(TIERS.map(t => [t, { first: 0, final: 0, fixed: 0, made: 0, kept: 0 }]));
  const made: ChunkFlag[] = [], fixed: ChunkFlag[] = [];
  for (const key of new Set([...A.keys(), ...B.keys()])) {
    const a = A.get(key) ?? [], bb = B.get(key) ?? [], t = rows[tier(key.split("|")[0])];
    t.first += a.length; t.final += bb.length; t.kept += Math.min(a.length, bb.length);
    if (a.length > bb.length) { t.fixed += a.length - bb.length; fixed.push(...a.slice(bb.length)); }
    if (bb.length > a.length) { t.made += bb.length - a.length; made.push(...bb.slice(a.length)); }
  }
  const byRule = (fs: readonly ChunkFlag[]) => Object.entries(fs.reduce<Record<string, number>>((o, f) => ({ ...o, [f.rule]: (o[f.rule] ?? 0) + 1 }), {})).sort((x, y) => y[1] - x[1]).map(([r, n]) => `${r} ${n}`).join(" · ");
  // AM2-7 6부: 문장 글자 맞춤(am2-7-net)용 — 첫 원고 · 발행 깃발 전부(소제목 번호는 위에서 책 번호로 바꿨다).
  const fbKeys = new Set(fb.map(f => `${f.rule}|${f.sentence}`)), faKeys = new Set(fa.map(f => `${f.rule}|${f.sentence}`));
  return { id: folder, rows, made, fixed, fixedAll: fa.filter(f => !fbKeys.has(`${f.rule}|${f.sentence}`)), keptAll: fa.filter(f => fbKeys.has(`${f.rule}|${f.sentence}`)), madeAll: fb.filter(f => !faKeys.has(`${f.rule}|${f.sentence}`)), keptFinal: fb.filter(f => faKeys.has(`${f.rule}|${f.sentence}`)), byRuleFirst: byRule(fa), byRuleFinal: byRule(fb), chars: { first: firstChs.flatMap((c: FinalChapter) => c.sections.flatMap(s => s.paragraphs)).join("").length, final: finalChs.flatMap((c: FinalChapter) => c.sections.flatMap(s => s.paragraphs)).join("").length } };
}

if (process.argv[1]?.endsWith("am2-6-net.ts")) {
  const list = process.argv.includes("--list");
  for (const folder of process.argv.slice(2).filter(a => !a.startsWith("--"))) {
    const r = netOf(folder);
    console.log(`\n=== ${r.id} · 글자 첫 원고 ${r.chars.first} → 발행 ${r.chars.final}`);
    console.log(`| 층 | 첫 원고 | 발행 | 고침 | 만듦 | 남음 |\n|---|---|---|---|---|---|`);
    for (const t of TIERS) { const x = r.rows[t]; console.log(`| ${t} | ${x.first} | ${x.final} | ${x.fixed} | ${x.made} | ${x.kept} |`); }
    console.log(`첫 원고 규칙: ${r.byRuleFirst}\n발행 규칙: ${r.byRuleFinal}`);
    if (list) { for (const f of r.made) console.log(`  만듦 ${tier(f.rule)} ${f.chapter}.${f.section}.${f.paragraph} ${f.rule}: ${f.sentence.slice(0, 110)}`); for (const f of r.fixed.filter(x => tier(x.rule) !== "경미")) console.log(`  고침 ${tier(f.rule)} ${f.chapter}.${f.section}.${f.paragraph} ${f.rule}: ${f.sentence.slice(0, 90)}`); }
  }
}
