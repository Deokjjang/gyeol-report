/**
 * W3 P2 마감 청소(1분 크론 report-jobs가 결제 작업 묶음 앞에서 부른다). 생성 감독이 25분에 스스로 결론을 내지만, 워커가 죽거나 큐가 멈춘 주문도
 * 시작(결제 확정·이용권 접수) + 30분 안에 결론이 나게 하는 마지막 안전장치다. 돈이 움직이는 일은 기존 경로만 쓴다(환불 요청 → 토스 취소 → 같은 Idempotency-Key).
 * - 결제: 미발행·환불 요청 없음 ·
 *   - FAILED_REQUIRES_ATTENTION(lease 3번 만료 등)이고 2차를 할 시간이 남았으면 다시 큐로(admin_retry), 아니면 자동 환불.
 *   - 그 밖(QUEUED·RETRYING·RUNNING)은 시작 + 28분(SWEEP_AFTER_MS)이 지나면 워커 상태와 상관없이 자동 환불.
 * - 이용권: 미발행(QUEUED·RUNNING)이 시작 + 28분을 지나면 lease를 지금으로 끝내고 기존 정산(reconcile)으로 이용권을 돌려준다.
 * 감독이 결론을 냈으면(환불 요청·반환이 이미 있음) 건드리지 않는다. 실패는 삼키고 다음 분에 다시 본다.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import type { OpsStore } from "./sinks";
import type { ConclusionNote } from "./alerts";
import { GIVE_UP_AFTER_MS, MIN_ATTEMPT_MS, SWEEP_AFTER_MS } from "./policy";

export type SweepDeps = {
  readonly db: SupabaseClient;
  /** paid_report_reliability(admin_retry). */
  readonly reliability: { call(action: string, data?: Record<string, unknown>): Promise<Record<string, unknown>> };
  /** ops_order(refund_request). */
  readonly order: OpsStore;
  /** report_ticket_publication(status — lease가 끝난 RUNNING을 SQL이 정산·반환). */
  readonly ticket: { call(action: string, user: string | null, data?: Record<string, unknown>): Promise<Record<string, unknown>> };
  readonly audit: (e: { actor: "system"; action: string; target: string; detail?: Record<string, unknown> }) => Promise<boolean>;
  readonly refundNow?: (paymentOrderId: string) => Promise<unknown>;
  readonly concluded?: (n: ConclusionNote) => Promise<unknown>;
  /** v5 작가 상품(WRITER_V5_PRODUCTS). 그 밖(v4 결제·이용권)은 건드리지 않는다. */
  readonly v5Products: readonly string[];
  readonly now?: () => number;
};
export const SWEEP_LOOKBACK_MS = 48 * 3_600_000;
export const AUTO_REFUND_REASON_SWEEP = "30분 안에 책을 완성하지 못해 자동 환불";
const iso = (t: number) => new Date(t).toISOString();
const ms = (v: unknown) => (typeof v === "string" ? Date.parse(v) : NaN);

/** 판단만(순수): 결제 작업 하나를 어떻게 할지. */
export function paidSweepAction(a: { status: string; startedAt: number; now: number; refunded: boolean; published: boolean }): "none" | "requeue" | "refund" {
  if (a.refunded || a.published || a.status === "COMPLETED" || a.status === "EXPIRED") return "none";
  const elapsed = a.now - a.startedAt;
  if (a.status === "FAILED_REQUIRES_ATTENTION") return elapsed + MIN_ATTEMPT_MS <= GIVE_UP_AFTER_MS ? "requeue" : "refund";
  return elapsed >= SWEEP_AFTER_MS ? "refund" : "none";
}
/** 판단만(순수): 이용권 하나를 돌려줄 때인가. */
export function ticketSweepDue(a: { state: string; startedAt: number; now: number }): boolean {
  return (a.state === "QUEUED" || a.state === "RUNNING") && a.now - a.startedAt >= SWEEP_AFTER_MS;
}

export async function sweepDeadlines(d: SweepDeps): Promise<{ refunded: string[]; requeued: string[]; returned: string[]; errors: number }> {
  const now = (d.now ?? Date.now)(), since = iso(now - SWEEP_LOOKBACK_MS), out = { refunded: [] as string[], requeued: [] as string[], returned: [] as string[], errors: 0 };
  const v5 = new Set(d.v5Products);
  // ── 결제 ──
  try {
    const { data: jobs } = await d.db.from("report_generation_jobs").select("job_id,order_id,report_id,status,created_at")
      .in("status", ["QUEUED", "RUNNING", "RETRYING", "FAILED_REQUIRES_ATTENTION"]).gte("created_at", since).order("created_at", { ascending: true }).limit(100);
    const list = (jobs ?? []) as { job_id: string; order_id: string; report_id: string; status: string; created_at: string }[];
    if (list.length) {
      const orderIds = list.map(j => j.order_id), reportIds = list.map(j => j.report_id);
      const [{ data: orders }, { data: refunds }, { data: snaps }] = await Promise.all([
        d.db.from("payment_orders").select("payment_order_id,status,paid_at").in("payment_order_id", orderIds),
        d.db.from("order_refunds").select("payment_order_id").in("payment_order_id", orderIds),
        d.db.from("paid_report_snapshots").select("report_id,product_type,status,published_at").in("report_id", reportIds),
      ]);
      const orderOf = new Map(((orders ?? []) as { payment_order_id: string; status: string; paid_at: string | null }[]).map(o => [o.payment_order_id, o]));
      const refunded = new Set(((refunds ?? []) as { payment_order_id: string }[]).map(r => r.payment_order_id));
      const snapOf = new Map(((snaps ?? []) as { report_id: string; product_type: string; status: string; published_at: string | null }[]).map(s => [s.report_id, s]));
      for (const j of list) {
        const o = orderOf.get(j.order_id), s = snapOf.get(j.report_id);
        if (!o || o.status !== "paid" || !s || !v5.has(s.product_type)) continue;
        const startedAt = Number.isFinite(ms(o.paid_at)) ? ms(o.paid_at) : ms(j.created_at);
        const act = paidSweepAction({ status: j.status, startedAt, now, refunded: refunded.has(j.order_id), published: Boolean(s.published_at) || s.status === "COMPLETED" });
        if (act === "requeue") {
          const r = await d.reliability.call("admin_retry", { reportId: j.report_id });
          await d.audit({ actor: "system", action: "deadline_requeue", target: j.order_id, detail: { reportId: j.report_id, ok: r.ok === true } });
          if (r.ok === true) { out.requeued.push(j.order_id); continue; }
        }
        if (act === "none") continue;
        const refund = await d.order.call("refund_request", { paymentOrderId: j.order_id, source: "auto", reason: AUTO_REFUND_REASON_SWEEP });
        await d.audit({ actor: "system", action: "auto_refund_requested", target: j.order_id, detail: { reportId: j.report_id, ok: refund.ok === true, reason: `deadline_sweep:${j.status}` } });
        if (refund.ok !== true) { out.errors++; continue; }
        out.refunded.push(j.order_id);
        if (d.refundNow) { try { await d.refundNow(j.order_id); } catch { /* 5분 크론이 다시 한다 */ } }
        if (d.concluded) { try { await d.concluded({ origin: "paid", reportId: j.report_id, paymentOrderId: j.order_id, product: s.product_type, cls: "deadline", spentUsd: 0, sweep: true }); } catch { /* 무시 */ } }
      }
    }
  } catch { out.errors++; }
  // ── 이용권 ──
  try {
    const { data: rows } = await d.db.from("report_ticket_redemptions").select("id,user_id,report_id,state,product_type,policy_at,created_at,writer_version")
      .in("state", ["QUEUED", "RUNNING"]).eq("publication_mode", "queue-v1").gte("created_at", since).order("created_at", { ascending: true }).limit(100);
    for (const r of (rows ?? []) as { id: string; user_id: string; report_id: string; state: string; product_type: string; policy_at: string | null; created_at: string; writer_version: string | null }[]) {
      if (!v5.has(r.product_type)) continue;
      const startedAt = Number.isFinite(ms(r.policy_at)) ? ms(r.policy_at) : ms(r.created_at);
      if (!ticketSweepDue({ state: r.state, startedAt, now })) continue;
      // 정산 기한을 지금으로 끝낸다(RUNNING + lease 만료) → 기존 reconcile이 미발행이면 이용권을 돌려준다(REVERSAL +1).
      const past = iso(now - 1000);
      const { error } = await d.db.from("report_ticket_redemptions").update({ state: "RUNNING", lease_until: past, ...(r.writer_version === "v5" ? { writer_lease_until: past } : {}) })
        .eq("id", r.id).in("state", ["QUEUED", "RUNNING"]);
      if (error) { out.errors++; continue; }
      const st = await d.ticket.call("status", r.user_id, { redemptionId: r.id });
      await d.audit({ actor: "system", action: "deadline_ticket_return", target: r.report_id, detail: { redemptionId: r.id, state: typeof st.state === "string" ? st.state : null } });
      if (st.state !== "REVERSED") { out.errors++; continue; }
      out.returned.push(r.report_id);
      if (d.concluded) { try { await d.concluded({ origin: "ticket", reportId: r.report_id, paymentOrderId: null, product: r.product_type, cls: "deadline", spentUsd: 0, sweep: true }); } catch { /* 무시 */ } }
    }
  } catch { out.errors++; }
  return out;
}

/** 운영 기본 의존성으로 한 번(1분 크론). 저장소가 없으면 아무것도 하지 않는다. */
export async function runLiveDeadlineSweep(): Promise<Awaited<ReturnType<typeof sweepDeadlines>> | { skipped: string }> {
  const { createOpsStores } = await import("../store");
  const ops = createOpsStores();
  if (!ops.db) return { skipped: "no_db" };
  const db = ops.db;
  const { createPaidReportReliabilityStore } = await import("../../payment/paidReportReliabilityStore");
  const { createTicketPublicationStore } = await import("../../tickets/supabase");
  const { writerV5Products } = await import("../../writer/flags");
  const alerts = await import("./alerts");
  const send = await alerts.opsBotSender();
  const secret = process.env.TOSS_PAYMENTS_SECRET_KEY;
  return sweepDeadlines({
    db, reliability: createPaidReportReliabilityStore(), order: ops.order, ticket: createTicketPublicationStore(), audit: e => ops.audit(e), v5Products: writerV5Products(),
    concluded: n => alerts.conclusionAlert(db, send, n),
    ...(secret ? { refundNow: async (id: string) => {
      const { processRefunds } = await import("../orders/refund");
      const { createTossRefundProvider } = await import("../../payment/tossRefundClient");
      return processRefunds({ order: ops.order, audit: e => ops.audit(e) }, createTossRefundProvider(secret, fetch), { paymentOrderId: id, maxJobs: 1 });
    } } : {}),
  });
}
