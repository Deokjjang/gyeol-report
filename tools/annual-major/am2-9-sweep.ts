/**
 * AM2-9 3부(호출 0): 저장 기록 다시 대 보기 — 판독 묶음의 세운·대운 저장 책 전부(AM-01 10 · P~P4 8 · P5 4 · P6 8 · P7 8 · P8 2)를 지금 코드로.
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/annual-major/am2-9-sweep.ts <out.json> [이름 거름(정규식)]
 * 책마다:
 *   pub   = 발행 본문(한자 주석 · 머리 문장 뗌, loadSaved)에 지금 검사(본문 · 교체 · 반복)를 댄 깃발.
 *   first = 장 묶음 원문이 있는 책: 첫 원고(meta.raw kind=first)로 같은 발행 함수를 다시 돌려 첫 검사 깃발(onFlags first).
 *   noRw  = 같은 첫 원고, 다시 쓰기는 빈 답(부르지 않은 것처럼) → 마지막 깃발 · 판정.
 *   rw    = 같은 첫 원고 + 기록된 다시 쓰기 출력(replayP5) → 마지막 깃발 · 판정(3부 (나) 보류율 상한 — 2차 효과 없음).
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { memorySink } from "../../src/lib/ops/generation/sinks";
import { judgeBuild } from "../../src/lib/ops/generation/policy";
import { buildV5Snapshot, writerKnowledge } from "../../src/lib/writer/publish";
import { makeInspector } from "../../src/lib/writer/chunked/publish";
import { replayP5 } from "./am2-6-p5";
import { loadSaved, OUT2, payloadFor, SAVED } from "./am2-6-books";

const AT = "2026-12-02T03:00:00.000Z";
type F = { readonly chapter: number; readonly section: number; readonly paragraph: number; readonly rule: string; readonly sentence: string; readonly detail?: string };
type Chs = readonly { readonly n: number; readonly sections: readonly { readonly heading: string; readonly paragraphs: readonly string[] }[] }[];
/** 네 갈래 깃발에는 판독용 맥락(머리글 · 그 문단 · 앞 문단)을 붙인다. */
const row = (f: F, br?: string | null, chs?: Chs) => { const sec = br && chs ? chs.find(c => c.n === f.chapter)?.sections[f.section] : undefined;
  return { rule: f.rule, ...(br ? { br } : {}), at: `${f.chapter}.${f.section}.${f.paragraph}`, s: f.sentence.slice(0, 220), ...(f.detail ? { d: String(f.detail).slice(0, 140) } : {}),
    ...(sec ? { h: sec.heading, p: (sec.paragraphs[f.paragraph] ?? "").slice(0, 700), pp: (f.paragraph > 0 ? sec.paragraphs[f.paragraph - 1] ?? "" : "").slice(0, 400) } : {}) }; };
const IDS8 = ["annual-1", "annual-p5", "annual-p6a", "annual-p6b", "major-1", "major-p5", "major-p6a", "major-p6b"];
export const SWEEP_BOOKS: readonly { name: string; path: string; id: string }[] = [
  ...SAVED,
  ...["P6", "P7"].flatMap(st => IDS8.map(id => ({ name: `${st}-${id}`, path: join(OUT2, `${st}-${id}`, "snapshot.json"), id }))),
  ...["annual-1", "annual-p6b"].map(id => ({ name: `P8-${id}`, path: join(OUT2, "P8", "_raw", id, "snapshot.json"), id })),
];

async function replay(id: string, raws: { kind: string; text: string }[], withRewrites: boolean, brOf: (f: F) => string | null) {
  const r = replayP5(raws as never);
  const stream = withRewrites ? r.stream : (async (input: { user: string; onText?: (t: string) => void }) => (input.user.includes("\n고칠 자리:\n")
    ? { text: "", finishReason: "complete", usage: { inputTokens: 0, cachedInputTokens: 0, outputTokens: 0 }, costUsd: 0, requestId: "replay" } : r.stream(input as never)));
  const got: { first: F[]; final: F[] } = { first: [], final: [] }, gotChs: { first: Chs; final: Chs } = { first: [], final: [] };
  const built = await buildV5Snapshot({ payload: payloadFor(id) as never, reportId: `report_sweep29${id.replace(/[^a-z0-9]/g, "")}0000`, policyAt: AT, sink: memorySink() as never,
    deps: { provider: "anthropic", model: "claude-sonnet-5-5", fallback: null, stream: stream as never, people: async () => [], onFlags: (st, fs, chs) => { got[st] = [...fs]; gotChs[st] = chs; } } });
  const v = judgeBuild({ meta: built.meta, run: built.run });
  return { first: got.first.map(f => row(f, brOf(f), gotChs.first)), final: got.final.map(f => row(f, brOf(f), gotChs.final)), verdict: v.kind === "incomplete" ? v.reason : v.kind, used: r.used.length, missed: r.missed.length };
}

void (async () => {
  const [out, filter] = process.argv.slice(2);
  const { k } = writerKnowledge();
  const res: Record<string, unknown> = {};
  for (const b of SWEEP_BOOKS.filter(x => !filter || new RegExp(filter).test(x.name))) {
    const t0 = Date.now();
    try {
      const saved = loadSaved(b.path, b.id); if (!saved) { res[b.name] = { missing: true }; console.log(b.name, "없음"); continue; }
      const ins = makeInspector({ payload: payloadFor(b.id) as never, policyAt: AT, brief: saved.brief, k, plan: saved.plan, intake: saved.intake });
      const s0 = ins.inspect(saved.chs);
      const brOf = (f: F) => ins.branch(f as never, saved.chs);
      const pub = [...s0.block, ...s0.minor, ...ins.fixOf(saved.chs, s0), ...ins.repeatsOf(saved.chs)].map(f => row(f, brOf(f), saved.chs));
      const raws = ((saved.snap.evidencePacket?.meta?.raw ?? []) as { kind: string; text: string }[]);
      const chunked = raws.filter(x => x.kind === "first").length >= 3 && (saved.snap.evidencePacket?.meta?.review as { mode?: string } | undefined)?.mode === "chunked";
      const pf = saved.brief.person, it = saved.intake;
      const ctx = { age: pf.age, gender: pf.gender, facts: pf.facts, mbti: saved.brief.mbti?.type ?? null, wish: it.wish ?? null, product: saved.brief.product,
        pairs: it.pairs.map(pp => ({ id: pp.id, why: pp.why, myeongri: it.lines.find(l => l.id === pp.myeongri)?.value ?? pp.myeongri, mbti: it.lines.find(l => l.id === pp.mbti)?.value ?? pp.mbti })),
        keys: it.chapters.flatMap(c => (c.keys ?? []).map(kp => ({ ch: c.n, key: kp.key, label: kp.label, pair: kp.pair ?? null, lines: kp.lines.map(id => { const l = it.lines.find(x => x.id === id); return l ? `${id} ${l.value}: ${l.meaning}`.slice(0, 160) : id; }) }))) };
      const entry: Record<string, unknown> = { id: b.id, ctx, pub };
      if (chunked) { const a = await replay(b.id, raws, false, brOf); entry.first = a.first; entry.noRw = { final: a.final, verdict: a.verdict }; const c = await replay(b.id, raws, true, brOf); entry.rw = { final: c.final, verdict: c.verdict, used: c.used, missed: c.missed }; }
      res[b.name] = entry;
      console.log(b.name, `pub ${pub.length}`, chunked ? `first ${(entry.first as unknown[]).length} · noRw ${(entry.noRw as { verdict: string }).verdict} · rw ${(entry.rw as { verdict: string }).verdict}` : "(원문 없음 — 발행본만)", `${((Date.now() - t0) / 1000).toFixed(0)}s`);
    } catch (e) { res[b.name] = { error: String(e).slice(0, 300) }; console.log(b.name, "ERR", String(e).slice(0, 200)); }
  }
  writeFileSync(out, JSON.stringify(res, null, 1));
})();
