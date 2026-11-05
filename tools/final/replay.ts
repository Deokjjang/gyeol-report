/**
 * pnpm book:replay <책> [--out <dir>] [--flags]   (최종판 0-3, 호출 0. --flags = 발행 본문의 남은 깃발 문장)
 *  <책> = 스냅샷 파일(*.snapshot.json) 또는 로컬 DB reportId(report_…).
 *  - 원문이 있는 책(meta.raw, 제6판): 저장 원문으로 같은 발행 함수(buildV5Snapshot)를 replay 모드로 다시 돌린다 — 작가·수리 원문은 저장본에서만,
 *    저장본이 없는 호출은 부르지 않는다(거절 stream). 검사·표기·렌더가 바뀐 경우 이 경로만 쓴다. 결과: <out>/<id>.snapshot.json · .final.md · .replay.json
 *  - 원문이 없는 옛 책(P6d·P6e): 저장된 본문에 새 정리·검사만 돌려 수리 대상(규칙·문장)을 보여 준다(수리는 하지 않는다).
 * 어느 쪽이든 LLM 호출 0(거절 stream이 부르면 기록하고 실패로 끝낸다).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { buildBrief } from "../../src/lib/brief";
import type { BriefInput } from "../../src/lib/brief/buildBrief";
import type { Brief } from "../../src/lib/brief/schema";
import { buildFactSheet, type FactSheet } from "../../src/lib/factsheet/build";
import type { streamCompletion } from "../../src/lib/llm";
import { rawCache } from "../../src/lib/ops/generation/supervisor";
import { normalizeReportInputPayload } from "../../src/lib/report-generation/reportInputAdapter";
import type { ReportInputPayload } from "../../src/lib/report-generation/reportInputTypes";
import { payloadToBriefInput, type V5BookDraft, type WriterMeta } from "../../src/lib/writer/book";
import { renderChapter } from "../../src/lib/writer/format";
import { buildWriterPrompt } from "../../src/lib/writer/prompt";
import { buildV5Snapshot, kstDate, lintContext, writerKnowledge } from "../../src/lib/writer/publish";
import type { RawEntry } from "../../src/lib/writer/runner";
import { peopleOf } from "../../src/lib/writer/prior";
import type { FinalChapter } from "../../src/lib/writer/safety";
import { lintBook, tidyBook, type LintFlag } from "../../src/lib/writer/safety/p6c";
import { loadDevEnv, ROOT } from "../llm/env";

type Snap = { reportId?: string; productVersion: string; draft: V5BookDraft; evidencePacket: { input: ReportInputPayload; generatedAt: string; meta?: WriterMeta & { raw?: RawEntry[] } } };

export async function loadSnap(arg: string): Promise<{ id: string; snap: Snap }> {
  if (existsSync(arg)) return { id: basename(arg).replace(/\.snapshot\.json$/, ""), snap: JSON.parse(readFileSync(arg, "utf8")) as Snap };
  loadDevEnv();
  const url = process.env.SUPABASE_URL ?? "", key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (!/127\.0\.0\.1|localhost/.test(url)) throw new Error("로컬 DB 주소가 아닙니다");
  const r = await createClient(url, key, { auth: { persistSession: false } }).from("paid_report_snapshots").select("snapshot_json").eq("report_id", arg).single();
  if (r.error || !r.data?.snapshot_json) throw new Error(`Book 없음: ${arg}`);
  return { id: arg, snap: r.data.snapshot_json as Snap };
}

/** 저장본 입력 → 브리프 입력(기준일 = 발행일 KST). */
export function inputOfSnap(s: Snap): BriefInput {
  const n = normalizeReportInputPayload(s.evidencePacket.input as never, { now: () => new Date(s.evidencePacket.generatedAt) });
  if (!n.ok) throw new Error(String(n.error));
  return payloadToBriefInput(n.value as never, kstDate(s.evidencePacket.generatedAt)) as unknown as BriefInput;
}
export function briefOfSnap(s: Snap): Brief {
  // 최종판2 1-1: 이미지 대장에서 그 책 자신과 그 뒤에 만든 책은 뺀다(자기 표지가 피할 이미지가 되지 않게).
  return buildBrief({ ...inputOfSnap(s), ledgerView: { ...(s.reportId ? { exclude: s.reportId } : {}), before: s.evidencePacket.generatedAt,
    self: { people: peopleOf(s.evidencePacket.input), product: s.draft.productType } } } as never, writerKnowledge().k);
}
/** 최종판3 1: 저장본 입력으로 만든 정답지(엔진 출력만, 호출 0). */
export const factSheetOfSnap = (s: Snap, brief: Brief = briefOfSnap(s)): FactSheet => buildFactSheet(inputOfSnap(s), brief, writerKnowledge().k);
export type { Snap };

/** 저장된 본문(옛 책)에 새 정리·검사: 수리 대상 깃발. */
export function lintStored(s: Snap): { flags: LintFlag[]; brief: Brief } {
  const brief = briefOfSnap(s), { k } = writerKnowledge(), plan = buildWriterPrompt(brief, { knowledge: k }).chapters;
  const finals: FinalChapter[] = s.draft.chapters.map(c => ({ n: c.n, id: c.id, title: c.title, source: "writer", chars: 0, sections: c.sections.map(x => ({ heading: x.heading, paragraphs: [...x.paragraphs] })), ...(c.keys ? { keys: c.keys } : {}) }));
  const ctx = lintContext(brief, k, plan, [], undefined, factSheetOfSnap(s, brief));
  return { flags: lintBook(tidyBook(finals, ctx).chapters, ctx), brief };
}

export function manuscript(d: V5BookDraft): string {
  const body = d.chapters.map(ch => renderChapter({ n: ch.n, title: ch.title, sections: ch.sections.map(s => ({ heading: s.heading, paragraphs: [...s.paragraphs] })) }));
  return `[표지] ${d.coverLine ?? d.coreImage?.line ?? d.pairImage?.line ?? ""}\n\n${body.join("\n\n")}\n`;
}

async function main() {
  const args = process.argv.slice(2), target = args.find(a => !a.startsWith("--"));
  if (!target) { console.error("사용: pnpm book:replay <스냅샷 파일|reportId> [--out <dir>]"); process.exit(2); }
  const out = args.includes("--out") ? args[args.indexOf("--out") + 1] : join(ROOT, ".cache/replay");
  const { id, snap } = await loadSnap(target);
  const raw = snap.evidencePacket.meta?.raw;
  if (!raw?.length) {
    const { flags } = lintStored(snap);
    console.log(`${id}: 원문 없음(옛 책) → 저장 본문 새 검사만. 수리 대상 ${flags.length}`);
    const by: Record<string, number> = {}; for (const f of flags) by[f.rule] = (by[f.rule] ?? 0) + 1;
    console.log(JSON.stringify(by));
    for (const f of flags) console.log(`  ${f.chapter}.${f.section}.${f.paragraph} ${f.rule}${f.detail ? `(${f.detail})` : ""}: ${f.sentence.slice(0, 90)}`);
    return;
  }
  // 원문이 있는 책: 같은 발행 함수를 replay 모드로(저장본에 없는 호출은 거절 = 호출 0).
  // 작가 원고는 입력 해시가 바뀌어도(브리프 코드 수정) 저장된 원문을 차례대로 쓴다. 수리·재작성·표지 수리는 같은 입력 해시만(검사가 바뀌면 그 수리는 저장본이 없다 = 부르지 않음).
  const refused: string[] = [];
  const writerRaw = { first: raw.filter(e => e.kind === "first"), continuation: raw.filter(e => e.kind === "continuation") };
  const zero = { inputTokens: 0, cachedInputTokens: 0, outputTokens: 0 };
  const refuse: typeof streamCompletion = async input => {
    if (input.system.startsWith("너는 결리포트의 작가다")) {
      const e = (/남은 장만 이어서/.test(input.user) ? writerRaw.continuation : writerRaw.first).shift();
      if (e) { input.onText?.(e.text); return { text: e.text, finishReason: e.finish, usage: zero, costUsd: 0, requestId: "replay" }; }
    }
    refused.push(input.system.slice(0, 20));
    return { text: "", finishReason: "error", usage: zero, costUsd: 0, requestId: null, error: { code: "replay_no_call", message: "replay" } };
  };
  const chapters = new Map<number, { n: number; chapter: never; source: "writer" }>();
  const sink = { async save() { return true; }, async load() { return [...chapters.values()]; } };
  const writer = snap.evidencePacket.meta?.writer;
  const built = await buildV5Snapshot({ payload: snap.evidencePacket.input, reportId: id, policyAt: snap.evidencePacket.generatedAt, sink: sink as never,
    deps: { provider: (writer?.provider ?? "anthropic") as never, model: writer?.model ?? "claude-sonnet-5-5", fallback: null, stream: refuse, cache: rawCache(raw), replay: true, people: async () => (snap.evidencePacket as unknown as { people: never[] }).people ?? [] } });
  mkdirSync(out, { recursive: true });
  writeFileSync(join(out, `${id}.snapshot.json`), JSON.stringify(built.snapshot));
  writeFileSync(join(out, `${id}.final.md`), manuscript(built.snapshot.draft as unknown as V5BookDraft));
  const p6c = built.meta.safety.metrics?.p6c;
  const calls = built.meta.calls.filter(c => !c.cached && c.error !== "replay_no_call" && c.requestId !== "replay");
  const summary = { id, calls: built.meta.calls.length, cached: built.meta.calls.filter(c => c.cached || c.requestId === "replay").length, paidCalls: calls.length, refused: refused.length, costUsd: built.meta.costUsd, remaining: p6c?.remaining, droppedSections: p6c?.droppedSections?.length ?? 0, cover: p6c?.cover };
  writeFileSync(join(out, `${id}.replay.json`), JSON.stringify(summary, null, 1));
  console.log(JSON.stringify(summary));
  // --flags: 발행된 본문(렌더 뒤)에 새 검사를 돌려 남은 깃발 문장을 보여 준다(판정용, 호출 0).
  if (args.includes("--flags")) for (const f of lintStored(built.snapshot as never).flags) console.log(`  ${f.chapter}.${f.section}.${f.paragraph} ${f.rule}${f.detail ? `(${f.detail})` : ""}: ${f.sentence.slice(0, 160)}`);
  if (summary.paidCalls || summary.costUsd) { console.error("replay가 실호출을 했다(있으면 안 됨)"); process.exit(1); }
}
if (process.argv[1]?.endsWith("replay.ts")) void main().catch(e => { console.error(String(e instanceof Error ? e.message : e)); process.exit(1); });
