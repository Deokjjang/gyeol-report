/**
 * 최종판3 13: 저장본 1권으로 운영 워커 경로 재생(작가 재호출 없이). 발행하지 않는다(생성 상태는 메모리, 결과는 .cache/final3/replay-worker/).
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/final3/worker-rerun.ts <reportId> --budget <USD>
 * - 같은 진입 함수(superviseQueueJob → attempt → buildV5Snapshot), 같은 주문 입력(report_input_snapshots)·같은 이전 책(paidPriorBooks, 로컬 DB 읽기).
 * - 원문 저장소: 그 주문이 실제 생성 때 받는 즉시 저장한 ops_writer_raw 행(로컬 DB 읽기)을 그대로 준다 → 같은 입력이면 저장본, 바뀐 입력만 예산 관문으로 새로 부른다.
 * - 작가(first·continuation) 호출이 저장본이 아니면 실패로 끝낸다(작가 재호출 금지).
 * - 새로 부른 검수·수리 원문은 예산 관문 캐시(gate.cache)에도 남긴다 → 다시 돌려도 같은 입력은 저장본(최종판3: 처음 두 번째 실행이 캐시 없이 검수를 다시 불러 $0.0043 헛씀).
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { superviseQueueJob, type Decision } from "../../src/lib/ops/generation/supervisor";
import { memorySink, type OpsStore } from "../../src/lib/ops/generation/sinks";
import { opsRawCache } from "../../src/lib/ops/generation/sinks";
import { paidPriorBooks } from "../../src/lib/ops/generation/paidPrior";
import { HARD_RULES } from "../../src/lib/writer/safety/p6c";
import { budgetArg, budgetGate, ensureScope } from "../llm/budget";
import { loadDevEnv, ROOT } from "../llm/env";
import { lintStored, manuscript } from "../final/replay";
import { memoryOpsStore } from "../../tests/helpers/opsMocks";

const psql = (q: string) => execFileSync("docker", ["exec", "supabase_db_gyeol-report", "psql", "-U", "postgres", "-At", "-c", q], { encoding: "utf8" }).trim();

async function main() {
  const reportId = process.argv[2];
  if (!/^report_[a-z0-9]+$/.test(reportId ?? "")) { console.error("사용: worker-rerun.ts <reportId> --budget <USD>"); process.exit(2); }
  const budget = budgetArg(process.argv);
  loadDevEnv();
  const url = process.env.SUPABASE_URL ?? "", key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (!/127\.0\.0\.1|localhost/.test(url)) throw new Error("로컬 DB 주소가 아닙니다");
  const db = createClient(url, key, { auth: { persistSession: false } });
  const orderId = psql(`select payment_order_id from payment_orders where report_id='${reportId}'`);
  const raw = JSON.parse(psql(`select payload_json from report_input_snapshots where order_id='${orderId}'`) || "null");
  const policyAt = psql(`select snapshot_json->'evidencePacket'->>'generatedAt' from paid_report_snapshots where report_id='${reportId}'`);
  // 운영 결제 워커와 같은 꼴: 주문 입력의 reportInputPayload를 그대로 넘긴다(paidProductReportFulfillment getReportInputPayload).
  const n = { value: (raw as { reportInputPayload?: unknown } | null)?.reportInputPayload as never };
  if (!n.value) throw new Error("주문 입력(reportInputPayload)이 없다");
  // 실제 생성 때 저장된 원문(ops_writer_raw) → 메모리 저장소(같은 RPC 모양: raw_load/raw_save, 처음 받은 원문을 덮지 않는다).
  const rows = JSON.parse(psql(`select coalesce(json_agg(entry order by created_at),'[]') from ops_writer_raw where report_id='${reportId}'`)) as { key: string; kind: string }[];
  const saved = new Map(rows.map(e => [e.key, e]));
  const rawStore: OpsStore = { async call(action, data) {
    if (action === "raw_load") return { ok: true, entries: [...saved.values()] };
    if (action === "raw_save") { const e = data.entry as { key: string }; if (!saved.has(e.key)) saved.set(e.key, e as never); return { ok: true }; }
    return { ok: false, code: "UNKNOWN_ACTION" };
  } };
  const prior = await paidPriorBooks(db as never, orderId, reportId, n.value);
  ensureScope("final3", 4.0, "최종판3 명령 전체 합계 상한(덕짱님 지시 2026-11-05)");
  const gate = budgetGate({ scope: "final3", run: `worker-replay-${reportId}`, runBudget: budget, stage: "최종판3 13 운영 워커 경로 재생(작가 저장본)" });
  const writerLive: string[] = [];
  const stream: typeof gate.stream = async input => {
    if (input.system.startsWith("너는 결리포트의 작가다")) { writerLive.push(input.model); return { text: "", finishReason: "error", usage: { inputTokens: 0, cachedInputTokens: 0, outputTokens: 0 }, costUsd: 0, requestId: null, error: { code: "no_writer_call", message: "작가는 다시 부르지 않는다" } }; }
    return gate.stream(input);
  };
  const ops = memoryOpsStore({ now: Date.now });
  const job = { reportId, origin: "paid" as const, originRef: orderId, payload: n.value, policyAt, sink: memorySink(), budgetMs: 480_000, raw: opsRawCache(rawStore, reportId, "replay"), ...(prior?.books ? { prior } : {}) };
  let published: Decision | null = null;
  const r = await superviseQueueJob(job, { store: ops.store, now: Date.now, openAiKey: null, deps: { stream, cache: gate.cache, reviewModel: "claude-haiku-5-5" } as never }, async d => { published = d; return { ok: true }; });
  const d = r.decision;
  const out = join(ROOT, ".cache/final3/replay-worker"); mkdirSync(out, { recursive: true });
  if (d.kind !== "publish") { console.log(JSON.stringify({ reportId, decision: d.kind, reason: (d as { reason?: string }).reason ?? null, writerLive: writerLive.length })); process.exit(4); }
  const snap = d.snapshot as never as Parameters<typeof lintStored>[0];
  writeFileSync(join(out, `${reportId}.snapshot.json`), JSON.stringify(snap)); writeFileSync(join(out, `${reportId}.md`), manuscript((snap as unknown as { draft: never }).draft));
  const meta = d.meta as unknown as { calls: { kind: string; cached?: boolean; costUsd: number | null; finish: string }[]; review?: { kept?: unknown[]; skipped?: string | null; repair?: { applied?: unknown[]; reverted?: unknown[] } } };
  const left = lintStored(snap).flags.filter(f => HARD_RULES.has(f.rule));
  console.log(JSON.stringify({ reportId, decision: d.kind, writerLive: writerLive.length, calls: meta.calls.map(c => `${c.kind}${c.cached ? "(저장본)" : ""} ${c.finish} $${(c.costUsd ?? 0).toFixed(4)}`),
    review: { kept: meta.review?.kept?.length ?? 0, skipped: meta.review?.skipped ?? null }, repair: { applied: meta.review?.repair?.applied?.length ?? 0, reverted: meta.review?.repair?.reverted?.length ?? 0 }, leftHard: left.length, paidUsd: Number(gate.runSpent().toFixed(6)), published: !!published }));
  for (const f of left) console.log(`  남음 ${f.chapter}.${f.section}.${f.paragraph} ${f.rule}: ${f.sentence.slice(0, 120)}`);
}
void main().catch(e => { console.error(String(e instanceof Error ? e.stack ?? e.message : e)); process.exit(1); });
