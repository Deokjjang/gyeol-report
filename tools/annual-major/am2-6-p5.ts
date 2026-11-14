/**
 * AM2-6 8부 P5 replay(호출 0): P5 네 권의 저장 원문(첫 원고 · 문단 교체 기록)을 새 구조(고리 재료 · 짝 이유 · 사실 고정 · 교체 등급 · 지우기 안전)에 다시 넣는다.
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/annual-major/am2-6-p5.ts [annual-1 …]
 * - 첫 호출: 그 묶음의 P5 첫 원고(meta.raw kind=first)를 그대로 돌려준다.
 * - 문단 교체 호출: 고칠 자리마다 P5 교체 기록([¶장.소제목.문단])의 같은 번호 글을 돌려준다(없으면 그 자리는 비운다 = 교체 없음).
 * 그러면 「사실 고정이 P5 다시 쓰기 회귀(하반기 · 그 불 · 한 번 더 기우는 달 · 9.1 되풀이 · 두 해째 · 축오해)를 되돌리는가」와 「교체 대상이 몇 자리 늘어나는가」를 저장 원고로 본다.
 * 아울러 P5 판독 차단 18곳이 P5 발행 원고에서 새 검사 · 구조에 걸리는지 본다(16-5).
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { memorySink } from "../../src/lib/ops/generation/sinks";
import { buildV5Snapshot, writerKnowledge } from "../../src/lib/writer/publish";
import type { V5BookDraft, V5Evidence } from "../../src/lib/writer/book";
import { parseChapters } from "../../src/lib/writer/format";
import type { StreamCompletionInput, StreamCompletionResult } from "../../src/lib/llm";
import { adjacentRepeats, adviceRepeats, blockFlags, crossRepeats, endingCaps, rxRepeats } from "../../src/lib/writer/chunked/check";
import { blockCtxFor } from "../../src/lib/writer/chunked/publish";
import { lintBook } from "../../src/lib/writer/safety/p6c";
import { lintContext } from "../../src/lib/writer/publish";
import { loadSaved, OUT2, payloadFor } from "./am2-6-books";

type Raw = { kind: string; text: string };
/** --from P6: 같은 다시 돌림을 P6 저장 원고(첫 원고 · 교체 기록)로(P6 annual-1 자동 점검 고침 확인). */
const FROM = process.argv.includes("--from") ? process.argv[process.argv.indexOf("--from") + 1] : "P5";
const norm = (t: string) => t.replace(/\([^)]*\)/g, "").replace(/[^가-힣A-Za-z0-9]/g, "");
export function replayP5(raws: readonly Raw[]) {
  const firsts = raws.filter(r => r.kind === "first");
  const blocks = new Map<string, string[]>();
  for (const r of raws.filter(x => x.kind === "rewrite")) { let cur: string | null = null; const buf: string[] = [];
    const flush = () => { if (cur) blocks.set(cur, [...(blocks.get(cur) ?? []), buf.join("\n").trim()]); buf.length = 0; };
    for (const line of r.text.split("\n")) { const m = /^\[¶([0-9.*]+)\]\s*$/.exec(line.trim()); if (m) { flush(); cur = m[1]; continue; } if (cur) buf.push(line); } flush(); }
  const sig = (t: string) => parseChapters(t).map(c => `${c.n}:${c.sections.map(s => s.heading.trim()).filter(h => /월 · |년 [가-힣]{2}년/.test(h)).join(",")}`).join("|");
  const used: string[] = [], missed: string[] = [];
  const stream = async (input: StreamCompletionInput): Promise<StreamCompletionResult> => {
    const out = (text: string): StreamCompletionResult => { input.onText?.(text); return { text, finishReason: "complete", usage: { inputTokens: 0, cachedInputTokens: 0, outputTokens: Math.ceil(text.length / 1.5) }, costUsd: 0, requestId: "replay" }; };
    if (input.user.includes("\n고칠 자리:\n")) {
      const list = input.user.split("\n고칠 자리:\n")[1]?.split("\n앞 원고:\n")[0] ?? "";
      const ids = [...list.matchAll(/^- \[¶([0-9.*]+)\]/gm)].map(m => m[1]);
      const parts: string[] = [];
      for (const id of ids) { const q = blocks.get(id); if (q?.length) { parts.push(`[¶${id}]\n${q.shift()}`); used.push(id); } else missed.push(id); }
      return out(parts.join("\n\n"));
    }
    const want = input.user.split("이번 묶음의 장 머리글은 아래 그대로입니다.")[1] ?? "";
    const heads = [...want.matchAll(/^## (\d+)\. .*?(?: \(### (.+)\))?$/gm)].map(m => `${m[1]}:${(m[2] ?? "").split(" / ### ").join(",")}`).join("|");
    return out((firsts.find(r => sig(r.text) === heads) ?? firsts.find(r => sig(r.text).split("|")[0].split(":")[0] === heads.split("|")[0].split(":")[0]))?.text ?? "");
  };
  return { stream, used, missed };
}

/** P5 판독 차단 표(「## 2. 차단 표」) 줄: 번호 · 위치 · 인용 · 꼴. */
function blocksOf(id: string): { no: string; at: string; quote: string; kind: string }[] {
  if (!existsSync(join(OUT2, `${FROM}-${id}`, "reading.md"))) return [];
  const r = readFileSync(join(OUT2, `${FROM}-${id}`, "reading.md"), "utf8"), sec = r.split(/\n## /).find(s => /^2\. 차단/.test(s)) ?? "";
  return sec.split("\n").filter(l => /^\| [A-Z]?\d+ \|/.test(l)).map(l => { const c = l.split("|").map(x => x.trim()); return { no: c[1], at: c[2], quote: (c[3].match(/「([^」]+)」/)?.[1] ?? c[3]), kind: c[4] }; });
}

async function main() {
  const ids = process.argv.slice(2).filter(a => !/^--|^\d+$|^P\d$/.test(a)).length ? process.argv.slice(2).filter(a => !/^--|^\d+$|^P\d$/.test(a)) : ["annual-1", "annual-p5", "major-1", "major-p5"], at = "2026-12-02T03:00:00.000Z";
  const { k } = writerKnowledge();
  for (const id of ids) {
    const snap = JSON.parse(readFileSync(join(OUT2, `${FROM}-${id}`, "snapshot.json"), "utf8")) as { evidencePacket: V5Evidence };
    const p5r = snap.evidencePacket.meta.review as Record<string, unknown>;
    const { stream, used, missed } = replayP5(snap.evidencePacket.meta.raw as unknown as Raw[]);
    const built = await buildV5Snapshot({ payload: payloadFor(id) as never, reportId: `report_replay6${id.replace(/[^a-z0-9]/g, "")}000`, policyAt: at, sink: memorySink() as never, deps: { provider: "anthropic", model: "claude-sonnet-5-5", fallback: null, stream: stream as never, people: async () => [] } });
    const d = built.snapshot.draft as unknown as V5BookDraft, r = (built.snapshot.evidencePacket as unknown as V5Evidence).meta.review as Record<string, unknown>;
    const text = d.chapters.flatMap(ch => ch.sections.flatMap(s => s.paragraphs)).join("\n");
    const sum = (rs: unknown) => (rs as { targets: number }[]).reduce((a, x) => a + x.targets, 0);
    console.log(`\n=== ${id}`);
    console.log(`P5 교체: ${JSON.stringify(p5r.rounds)} (자리 ${sum(p5r.rounds)}) · 처리 ${JSON.stringify((p5r.disposition as { counts: unknown }).counts)}`);
    console.log(`replay 교체: ${JSON.stringify(r.rounds)} (자리 ${sum(r.rounds)}) · P5 기록을 쓴 자리 ${used.length} · P5 기록 없는 자리 ${missed.length} · 사실 고정 ${JSON.stringify((r.locks as { kind: string }[]).reduce<Record<string, number>>((o, x) => ({ ...o, [x.kind]: (o[x.kind] ?? 0) + 1 }), {}))} · 되돌림 ${(r.reverted as unknown[]).length} · 지움 ${(r.deleted as unknown[]).length} · 남은 차단 ${(r.remainingHard as unknown[]).length} · 남은 교체 대상 ${(r.remainingFix as unknown[]).length} · 처리 ${JSON.stringify((r.disposition as { counts: unknown }).counts)}`);
    for (const l of (r.locks as { at: string; kind: string; detail: string; round: number }[]).filter(x => x.kind !== "restored").slice(0, 12)) console.log(`   고정 ${l.kind} ${l.at} #${l.round}: ${l.detail.slice(0, 150)}`);
    for (const v of (r.reverted as { at: string; rule: string; sentence: string }[]).slice(0, 12)) console.log(`   되돌림 ${v.at} ${v.rule}: ${v.sentence.slice(0, 120)}`);
    const checks: [string, boolean][] = id === "annual-1" ? [["3장 「하반기」", !/하반기/.test(d.chapters.find(c => c.n === 3)!.sections.flatMap(s => s.paragraphs).join(" "))], ["10장 「그 불」 고아(앞말 없음)", !/그 불을/.test(d.chapters.find(c => c.n === 10)!.sections.flatMap(s => s.paragraphs).join(" ")) || /불이 붙은|불씨|불을 붙/.test(d.chapters.find(c => c.n === 10)!.sections.flatMap(s => s.paragraphs).join(" "))], ["7월 「한 번 더 기우는」", !/한 번 더 기우는/.test(text)], ["7월 「지나왔다면」", !/지나왔다면/.test(text)]]
      : id === "major-1" ? [["9.1 ¶2 「그 힘이 일과 돈을 대하는 당신만의 기준으로」", !/그 힘이 일과 돈을 대하는 당신만의 기준으로/.test(text)]]
      : id === "major-p5" ? [["8.2 「두 해째」", !/두 해째/.test(text)]] : [["2.1 「축오해」", !/축오해/.test(text)]];
    for (const [what, ok] of checks) console.log(`   ${ok ? "되돌려짐 · 막힘" : "남음"} · ${what}`);
    for (const h of (r.remainingHard as { at: string; rule: string; sentence: string }[])) console.log(`   남은 차단 ${h.at} ${h.rule}: ${h.sentence.slice(0, 110)}`);
    if (process.argv.includes("--ch")) { const n = Number(process.argv[process.argv.indexOf("--ch") + 1]); console.log(d.chapters.find(c => c.n === n)!.sections.map(s => `### ${s.heading}\n${s.paragraphs.join("\n")}`).join("\n")); }
    // P5 판독 차단: P5 발행 원고에 새 검사(차단 · 교체 대상)를 대면 걸리는가.
    const saved = loadSaved(join(OUT2, `${FROM}-${id}`, "snapshot.json"), id)!;
    const b = blockCtxFor(saved.brief, k, saved.intake), lctx = { ...lintContext(saved.brief, k, saved.plan, [], undefined, undefined), noCards: true };
    const flags = [...blockFlags(saved.chs, lintBook(saved.chs, lctx as never), b), ...crossRepeats(saved.chs), ...adviceRepeats(saved.chs), ...rxRepeats(saved.chs, saved.intake), ...endingCaps(saved.chs), ...adjacentRepeats(saved.chs)];
    for (const bl of blocksOf(id)) {
      const segs = bl.quote.split("…").map(norm).filter(x => x.length >= 6);
      const hit = flags.filter(f => segs.some(sg => norm(f.sentence).includes(sg.slice(0, 14)) || sg.includes(norm(f.sentence).slice(0, 14))));
      console.log(`   차단 #${bl.no} ${bl.at} ${bl.kind.split(" ")[0]} · ${hit.length ? `걸림 ${[...new Set(hit.map(f => f.rule))].join(",")}` : "안 걸림"} · 「${bl.quote.slice(0, 60)}」`);
    }
  }
}
if (process.argv[1]?.endsWith("am2-6-p5.ts")) void main().catch(e => { console.error(e); process.exit(1); });
