/**
 * 결제 경로 v5 작업(P6d-ops 7). claim은 기존 결제 워커(runPaidReportJob)가 하고, 여기서는 감독 결과를 큐 동작으로 옮긴다.
 * 발행 = 기존 finish_job(검증·발행 규칙 그대로), 보류 = paid_defer(시간표), 포기 = paid_give_up + 자동 환불 요청(관리자 확인 없이, 결정 2026-11-04).
 * 비용 상한 보류(최종판 0-6) = paid_defer(30일, COST_CAP_HOLD) — 자동 환불 없음.
 */
import type { ReliabilityResult } from "../../payment/paidReportReliabilityStore";
import { PUBLISH_GATE_VERSION } from "../../report-generation/productPublishGate";
import type { ReportInputPayload } from "../../report-generation/reportInputTypes";
import { opsChapterSink, opsRawCache, type OpsStore } from "./sinks";
import { superviseQueueJob, type GenerationEnv } from "./supervisor";
import { AUTO_REFUND_HOURS_DEFAULT, autoRefundHours } from "./policy";

/** HOTFIX-W1 3부 4: 시간은 설정값(AUTO_REFUND_HOURS, 기본 6시간)을 따른다. */
export const autoRefundReason = (hours: number = autoRefundHours()) => `${hours}시간 안에 책을 완성하지 못해 자동 환불`;
export const AUTO_REFUND_REASON = autoRefundReason(AUTO_REFUND_HOURS_DEFAULT);
/** 보류 사유 코드(report_generation_jobs.last_error_code). */
export const holdCode = (reason: string) => (reason.includes("thinking_exhausted_end") ? "THINKING_HOLD" : "COST_CAP_HOLD");
export type PaidJobOps = { generation: OpsStore; raw?: OpsStore; order: OpsStore; audit(e: { actor: "system"; action: string; target: string; detail?: Record<string, unknown> }): Promise<boolean>;
  /** 최종판2 1-1: 같은 고객의 이전 Book을 읽는 DB(서비스 롤). 없으면(시험) 이전 책 없이 만든다. */
  db?: import("@supabase/supabase-js").SupabaseClient | null };

/** 결제 claim lease(SQL)는 10분이다. 그 안에서 끝나는 작가 예산(옛 값). */
export const PAID_SHORT_BUDGET_MS = 480_000;
/** HOTFIX-W1: 결제 작업이 스스로 늘리는 lease(이용권 작가 lease와 같은 15분 — 함수 800초보다 길다). */
export const PAID_LEASE_MS = 15 * 60_000;

type JobsDb = Pick<import("@supabase/supabase-js").SupabaseClient, "from">;
/** 이 작업의 lease를 지금부터 ms로 늘린다. 같은 토큰·RUNNING인 행 1개가 바뀌었을 때만 true(다른 워커가 이어받았으면 false). */
export async function extendPaidLease(db: JobsDb, jobId: string, token: string, ms = PAID_LEASE_MS, now = Date.now()): Promise<boolean> {
  try {
    const { data, error } = await db.from("report_generation_jobs").update({ lease_until: new Date(now + ms).toISOString() })
      .eq("job_id", jobId).eq("lease_token", token).eq("status", "RUNNING").select("job_id");
    return !error && Array.isArray(data) && data.length === 1;
  } catch { return false; }
}
/** HOTFIX-W1(추가 지시 6): 긴 예산은 lease를 늘렸을 때만. 못 늘리면(또는 DB 없음) 옛 480초 — lease가 작업보다 먼저 끝나 결과를 잃지 않게. */
export async function paidWriterBudget(db: JobsDb | null | undefined, job: { job_id: string; lease_token: string }, want: number): Promise<number> {
  if (want <= PAID_SHORT_BUDGET_MS) return want;
  return db && (await extendPaidLease(db, job.job_id, job.lease_token)) ? want : PAID_SHORT_BUDGET_MS;
}

/** HOTFIX-W1 3부 3·6: 운영 알림(서비스 롤 DB + 처리 봇). DB가 없으면 없음. */
export async function liveAlerts(db: import("@supabase/supabase-js").SupabaseClient | null | undefined): Promise<Pick<GenerationEnv, "alerts">> {
  if (!db) return {};
  try { const m = await import("./alerts"); return { alerts: m.createGenerationAlerts(db, await m.opsBotSender()) }; } catch { return {}; }
}

export async function runPaidV5Job(job: { payload: unknown; report_id: string; job_id: string; lease_token: string; order_id: string; policyAt: string; budgetMs?: number },
  finish: (data: Record<string, unknown>) => Promise<ReliabilityResult>, opts: { ops?: PaidJobOps; env?: Omit<GenerationEnv, "store"> } = {}): Promise<ReliabilityResult> {
  const ops = opts.ops ?? (await import("../store")).createOpsStores();
  let last: ReliabilityResult = { ok: false, code: "STALE_LEASE" };
  // 최종판2 1-1: 결제 책도 같은 고객(구매자 계정)의 이전 책을 본다 — 이미지·각도·장면을 겹치지 않게(이용권 레인과 같은 규칙).
  const prior = ops.db ? await (await import("./paidPrior")).paidPriorBooks(ops.db, job.order_id, job.report_id, job.payload) : undefined;
  const budgetMs = job.budgetMs ? await paidWriterBudget(ops.db, job, job.budgetMs) : undefined;
  const { decision } = await superviseQueueJob({ reportId: job.report_id, origin: "paid", originRef: job.order_id, payload: job.payload as ReportInputPayload, policyAt: job.policyAt,
    sink: opsChapterSink(ops.generation, job.report_id, job.lease_token), ...(ops.raw ? { raw: opsRawCache(ops.raw, job.report_id, job.lease_token) } : {}), ...(budgetMs ? { budgetMs } : {}), ...(prior?.books ? { prior } : {}) }, { ...opts.env, store: ops.generation, ...(!opts.ops ? { creditAlert: (code: string) => (ops as import("../store").OpsStores).signup.call("credit_alert", { code }), ...(await liveAlerts(ops.db)) } : {}) }, async d => {
    if (d.kind === "publish") last = await finish({ success: true, snapshot: d.snapshot, gateVersion: PUBLISH_GATE_VERSION });
    else if (d.kind === "defer") last = await ops.generation.call("paid_defer", { jobId: job.job_id, token: job.lease_token, until: d.until, code: "V5_DEFERRED" }) as ReliabilityResult;
    // 최종판 0-6: 주문당 비용 상한 — 자동으로 다시 돌리지 않게 길게 보류한다(관리자 지연 목록, 환불은 관리자가 정한다).
    // HOTFIX-W1: 생각 소진이 사다리 끝까지 간 보류는 THINKING_HOLD(같은 30일 보류, 즉시 알림은 감독이 보낸다).
    else if (d.kind === "hold") last = await ops.generation.call("paid_defer", { jobId: job.job_id, token: job.lease_token, until: d.until, code: holdCode(d.reason) }) as ReliabilityResult;
    else if (d.kind === "give_up") {
      last = await ops.generation.call("paid_give_up", { jobId: job.job_id, token: job.lease_token, code: "GENERATION_GAVE_UP" }) as ReliabilityResult;
      if (last.ok) {
        const refund = await ops.order.call("refund_request", { paymentOrderId: job.order_id, source: "auto", reason: autoRefundReason() });
        await ops.audit({ actor: "system", action: "auto_refund_requested", target: job.order_id, detail: { reportId: job.report_id, ok: refund.ok === true, reason: d.reason.slice(0, 120) } });
      }
    }
    return { ok: last.ok === true, ...(last.code ? { code: String(last.code) } : {}) };
  });
  if (decision.kind === "stale") return { ok: false, code: "STALE_LEASE" };
  return last;
}
