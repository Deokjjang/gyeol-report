/**
 * 발행 흐름 재생(최종판3 13): 저장본 1권의 작가 원문(meta.raw first)을 그대로 쓰고(작가 재호출 0), 검수 1회 → 수리 1회 → 재검사 → 발행을 실제로 돌린다.
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/final3/run-pipeline.ts <저장본 이름> --budget 0.15
 * 결과: .cache/final3/replay/<이름>.snapshot.json · .md(원고) · 검수·수리 기록 요약 출력.
 */
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { StreamCompletionInput, StreamCompletionResult } from "../../src/lib/llm";
import { memorySink } from "../../src/lib/ops/generation/sinks";
import { normalizeReportInputPayload } from "../../src/lib/report-generation/reportInputAdapter";
import { WRITER_PREFIX } from "../../src/lib/writer/prompt";
import { buildV5Snapshot } from "../../src/lib/writer/publish";
import type { RawEntry } from "../../src/lib/writer/runner";
import { splitSentences } from "../../src/lib/writer/safety/patterns";
import { budgetArg, budgetGate, ensureScope } from "../llm/budget";
import { loadDevEnv } from "../llm/env";
import { manuscript, type Snap } from "../final/replay";

const argv = process.argv.slice(2), name = argv[0];
const DIR = ".cache/final3/stored", OUT = ".cache/final3/replay";
const load = (n: string) => JSON.parse(readFileSync(join(DIR, `${n}.snapshot.json`), "utf8")) as Snap;
const snap = load(name);
const raw = (snap.evidencePacket.meta?.raw ?? []) as RawEntry[];
const first = raw.find(r => r.kind === "first");
if (!first) throw new Error("작가 원문(first) 없음");
const peopleKey = (s: Snap) => { const i = s.evidencePacket.input as unknown as Record<string, { name: string; birthDate: string }>; return [i.person, i.personA, i.personB].filter(Boolean).map(p => `${p.name}|${p.birthDate}`); };

void (async () => {
  loadDevEnv();
  ensureScope("final3", 4.0, "최종판3(출시 전 마지막)");
  const gate = budgetGate({ scope: "final3", run: `pipeline-replay-${name}`, runBudget: budgetArg(argv), stage: "발행 흐름 재생" });
  let writerServed = 0;
  // 작가 지침이면 저장 원문을 흘려보낸다(호출 0). 나머지(검수·수리)는 예산 관문을 지나 실제로 부른다.
  const stream = async (input: StreamCompletionInput): Promise<StreamCompletionResult> => {
    if (input.system === WRITER_PREFIX) { writerServed++; input.onText?.(first.text); return { text: first.text, finishReason: "complete", usage: { inputTokens: 0, cachedInputTokens: 0, outputTokens: 0 }, costUsd: 0, requestId: "stored-writer" }; }
    return gate.stream(input);
  };
  const n = normalizeReportInputPayload(snap.evidencePacket.input as never, { now: () => new Date(snap.evidencePacket.generatedAt) });
  if (!n.ok) throw new Error(String(n.error));
  const mine = new Set(peopleKey(snap)), at = Date.parse(snap.evidencePacket.generatedAt);
  const priors = readdirSync(DIR).filter(f => f.endsWith(".snapshot.json")).map(f => load(f.replace(/\.snapshot\.json$/, ""))).filter(x => Date.parse(x.evidencePacket.generatedAt) < at && peopleKey(x).some(p => mine.has(p)));
  const prior = { scenes: [], books: priors.length, sentences: priors.flatMap(x => x.draft.chapters.flatMap(c => c.sections.flatMap(s => s.paragraphs.flatMap(p => splitSentences(p))))), covers: priors.map(x => x.draft.coverLine ?? "").filter(Boolean) };
  const t0 = Date.now();
  const built = await buildV5Snapshot({ payload: n.value as never, reportId: `replay_final3_${name}`, policyAt: snap.evidencePacket.generatedAt, sink: memorySink(), prior: prior as never,
    deps: { stream, cache: gate.cache, provider: "anthropic", model: "claude-sonnet-5-5", fallback: null, people: async () => [], costCapUsd: 0.6, testRun: true, reviewModel: "claude-haiku-5-5" } });
  mkdirSync(OUT, { recursive: true });
  writeFileSync(join(OUT, `${name}.snapshot.json`), JSON.stringify(built.snapshot));
  const draft = (built.snapshot as unknown as { draft: Snap["draft"] }).draft;
  writeFileSync(join(OUT, `${name}.md`), manuscript(draft));
  const m = built.meta as unknown as { calls: { kind: string; costUsd: number | null; cached?: boolean; usage: { inputTokens: number; outputTokens: number } }[]; costUsd: number; review?: Record<string, unknown> };
  const rv = m.review as { model: string; skipped: string | null; kept: unknown[]; direct: unknown[]; dropped: unknown[]; repair: { items: number; calls: number; skipped: string | null; applied: { before: string; after: string; source: string[] }[] }; deleted: unknown[]; keptWithRecord: unknown[]; remainingHard: unknown[]; cover: unknown };
  console.log(`작가 저장본 사용 ${writerServed}회 · 호출 ${m.calls.map(c => `${c.kind}${c.cached ? "(저장본)" : ""} $${(c.costUsd ?? 0).toFixed(4)}`).join(", ")} · 합 $${m.costUsd.toFixed(4)} · ${Math.round((Date.now() - t0) / 1000)}초`);
  console.log(`검수 ${rv.model} skipped=${rv.skipped} · 지적 ${rv.kept.length} · 바로 고침 ${rv.direct.length} · 버림 ${rv.dropped.length}`);
  console.log(`수리 항목 ${rv.repair.items} · 호출 ${rv.repair.calls} · 적용 ${rv.repair.applied.length} · skipped=${rv.repair.skipped} · 지움 ${rv.deleted.length} · 남긴 기록 ${rv.keptWithRecord.length} · 남은 차단 ${rv.remainingHard.length}`);
  console.log("표지", JSON.stringify(rv.cover), "→", draft.coverLine);
  for (const a of rv.repair.applied.slice(0, 12)) console.log(` [${a.source.join("+")}] ${a.before.slice(0, 70)} → ${a.after.slice(0, 70) || "(삭제)"}`);
  console.log("남은 차단:", JSON.stringify(rv.remainingHard).slice(0, 600));
})();
