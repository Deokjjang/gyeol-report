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

/** W3 P2: 30분 결론 — 시작(결제 확정) + 30분 안에 못 만들면 자동 전액 환불. */
export const AUTO_REFUND_REASON = "30분 안에 책을 완성하지 못해 자동 환불";
export const autoRefundReason = () => AUTO_REFUND_REASON;
const productOfPayload = (p: unknown) => { const k = (p as { productKey?: unknown } | null)?.productKey; return typeof k === "string" ? k : null; };
export type PaidJobOps = { generation: OpsStore; raw?: OpsStore; order: OpsStore; audit(e: { actor: "system"; action: string; target: string; detail?: Record<string, unknown> }): Promise<boolean>;
  /** W3 P2: 포기 직후 토스 취소를 바로(5분 크론을 기다리지 않음). 없으면 운영 기본(토스 비밀값이 있을 때만). 시험 주입. */
  refundNow?: (paymentOrderId: string) => Promise<unknown>;
  /** W3 P2: 「↩️ 자동 환불 · GR-… · 사유 · 비용」 한 줄(처리 봇). 시험 주입. */
  concluded?: (a: import("./alerts").ConclusionNote) => Promise<unknown>;
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

/** HOTFIX-W1 3부 3·6: 운영 알림(서비스 롤 DB + 처리 봇). DB가 없으면 없음.
 * W3 P0: 잔액·인증 경보도 여기서 — Anthropic은 판매 자동 멈춤 + 처리 봇(1시간 1번, OpenAI와 쿨다운 따로), OpenAI는 예전 대기표(signup 'credit_alert'). */
export async function liveAlerts(db: import("@supabase/supabase-js").SupabaseClient | null | undefined, signup?: OpsStore | null): Promise<Pick<GenerationEnv, "alerts" | "creditAlert">> {
  if (!db) return {};
  try { const m = await import("./alerts"), send = await m.opsBotSender(); return { alerts: m.createGenerationAlerts(db, send), creditAlert: m.creditAlerter(db, send, signup) }; } catch { return {}; }
}

/** 운영 기본: 포기 직후 그 주문 하나만 토스 취소(같은 Idempotency-Key — 크론과 겹쳐도 한 번). 실패해도 크론이 다시 한다. */
async function liveRefundNow(ops: import("../store").OpsStores, paymentOrderId: string): Promise<unknown> {
  const secret = process.env.TOSS_PAYMENTS_SECRET_KEY;
  if (!secret) return null;
  const { processRefunds } = await import("../orders/refund");
  const { createTossRefundProvider } = await import("../../payment/tossRefundClient");
  return processRefunds({ order: ops.order, audit: e => ops.audit(e) }, createTossRefundProvider(secret, fetch), { paymentOrderId, maxJobs: 1 });
}

export async function runPaidV5Job(job: { payload: unknown; report_id: string; job_id: string; lease_token: string; order_id: string; policyAt: string; budgetMs?: number; created_at?: string; attempt?: number },
  finish: (data: Record<string, unknown>) => Promise<ReliabilityResult>, opts: { ops?: PaidJobOps; env?: Omit<GenerationEnv, "store"> } = {}): Promise<ReliabilityResult> {
  const ops = opts.ops ?? (await import("../store")).createOpsStores();
  let last: ReliabilityResult = { ok: false, code: "STALE_LEASE" };
  // 최종판2 1-1: 결제 책도 같은 고객(구매자 계정)의 이전 책을 본다 — 이미지·각도·장면을 겹치지 않게(이용권 레인과 같은 규칙).
  const prior = ops.db ? await (await import("./paidPrior")).paidPriorBooks(ops.db, job.order_id, job.report_id, job.payload) : undefined;
  const budgetMs = job.budgetMs ? await paidWriterBudget(ops.db, job, job.budgetMs) : undefined;
  const live = opts.ops ? null : ops as import("../store").OpsStores;
  const concluded = opts.ops?.concluded ?? (live?.db ? async (n: import("./alerts").ConclusionNote) => { const m = await import("./alerts"); return m.conclusionAlert(live.db!, await m.opsBotSender(), n); } : null);
  const refundNow = opts.ops?.refundNow ?? (live ? (id: string) => liveRefundNow(live, id) : null);
  // W3 P2: 30분 결론의 시작 = 결제 확정(작업이 만들어진 때). 정산 없이 끝난 claim(함수 죽음)은 시도 한 번으로 센다(paid_defer가 attempt_count를 0으로 되돌린다).
  const { decision } = await superviseQueueJob({ reportId: job.report_id, origin: "paid", originRef: job.order_id, payload: job.payload as ReportInputPayload, policyAt: job.policyAt,
    ...(job.created_at ? { originAt: job.created_at } : {}), ...(typeof job.attempt === "number" && job.attempt > 1 ? { priorClaims: job.attempt - 1 } : {}),
    sink: opsChapterSink(ops.generation, job.report_id, job.lease_token), ...(ops.raw ? { raw: opsRawCache(ops.raw, job.report_id, job.lease_token) } : {}), ...(budgetMs ? { budgetMs } : {}), ...(prior?.books ? { prior } : {}) }, { ...opts.env, store: ops.generation, ...(live ? { creditAlert: (code: string) => live.signup.call("credit_alert", { code }), ...(await liveAlerts(live.db, live.signup)) } : {}) }, async d => {
    if (d.kind === "publish") last = await finish({ success: true, snapshot: d.snapshot, gateVersion: PUBLISH_GATE_VERSION });
    else if (d.kind === "defer") last = await ops.generation.call("paid_defer", { jobId: job.job_id, token: job.lease_token, until: d.until, code: "V5_DEFERRED" }) as ReliabilityResult;
    else if (d.kind === "give_up") {
      // W3 P2: 결론 = 포기 → 자동 환불 요청 → 그 자리에서 토스 취소(크론을 기다리지 않음) → 처리 봇 한 줄.
      last = await ops.generation.call("paid_give_up", { jobId: job.job_id, token: job.lease_token, code: "GENERATION_GAVE_UP" }) as ReliabilityResult;
      if (last.ok) {
        const refund = await ops.order.call("refund_request", { paymentOrderId: job.order_id, source: "auto", reason: AUTO_REFUND_REASON });
        await ops.audit({ actor: "system", action: "auto_refund_requested", target: job.order_id, detail: { reportId: job.report_id, ok: refund.ok === true, reason: d.reason.slice(0, 120) } });
        if (refund.ok === true && refundNow) { try { await refundNow(job.order_id); } catch { /* 5분 크론이 다시 한다 */ } }
        if (concluded) { try { await concluded({ origin: "paid", reportId: job.report_id, paymentOrderId: job.order_id, product: productOfPayload(job.payload), cls: d.cls ?? null, spentUsd: d.spentUsd ?? 0, reason: d.reason }); } catch { /* 알림 실패는 무시 */ } }
      }
    }
    return { ok: last.ok === true, ...(last.code ? { code: String(last.code) } : {}) };
  });
  if (decision.kind === "stale") return { ok: false, code: "STALE_LEASE" };
  return last;
}
