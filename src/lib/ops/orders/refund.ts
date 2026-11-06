/**
 * 결제 주문 환불(P6d-ops 5): 관리자 2단계 확인 또는 24시간 실패 자동 환불. 토스 취소 API는 기존 클라이언트(tossRefundClient)를 쓴다.
 * 순서: 조회(이미 취소됐으면 완료) → 취소(같은 Idempotency-Key) → 결과 저장 → 감사 로그. 결과를 모르면 failed로 두고 5분 뒤 같은 키로 다시 확인한다.
 */
import type { RefundProvider } from "../../payment/tossRefundClient";
import type { RefundIntent } from "../../tickets/refundContract";
import type { OpsStore } from "../generation/sinks";

export type RefundOps = { order: OpsStore; audit(e: { actor: "admin" | "system"; actorUserId?: string | null; action: string; target: string; detail?: Record<string, unknown> }): Promise<boolean> };
type Claimed = { paymentOrderId: string; paymentKey: string; providerOrderId: string; amount: number; originalAmount: number; idempotencyKey: string; reason: string; firstAttemptAt: string; attempts: number; source: string };

export async function processRefunds(ops: RefundOps, provider: RefundProvider, opts: { maxJobs?: number; paymentOrderId?: string } = {}) {
  const done: { paymentOrderId: string; state: string; code?: string }[] = [];
  for (let i = 0; i < (opts.maxJobs ?? 3); i++) {
    const c = await ops.order.call("refund_claim", opts.paymentOrderId ? { paymentOrderId: opts.paymentOrderId } : {});
    if (!c.ok || c.empty || !c.refund) break;
    const r = c.refund as Claimed;
    const intent: RefundIntent = { paymentKey: r.paymentKey, providerOrderId: r.providerOrderId, originalAmount: r.originalAmount, amount: r.amount, quantity: 1,
      idempotencyKey: r.idempotencyKey, cancelReason: r.reason, firstAttemptAt: r.firstAttemptAt, token: "", canPost: true };
    let ok = false, providerStatus: string | undefined, error: string | undefined;
    const looked = await provider.lookup(intent);
    if (looked.ok && looked.payment.status === "CANCELED") { ok = true; providerStatus = "CANCELED"; }
    else {
      const cancel = await provider.cancel(intent);
      if (cancel.ok && (cancel.payment.status === "CANCELED" || cancel.payment.balanceAmount === r.originalAmount - r.amount)) { ok = true; providerStatus = cancel.payment.status; }
      else error = cancel.ok ? "PROVIDER_STATUS_UNEXPECTED" : cancel.code;
    }
    await ops.order.call("refund_finish", { paymentOrderId: r.paymentOrderId, ok, ...(providerStatus ? { providerStatus } : {}), ...(error ? { error } : {}) });
    await ops.audit({ actor: "system", action: ok ? "refund_done" : "refund_failed", target: r.paymentOrderId, detail: { source: r.source, attempts: r.attempts, amount: r.amount, ...(error ? { error } : {}) } });
    done.push({ paymentOrderId: r.paymentOrderId, state: ok ? "done" : "failed", ...(error ? { code: error } : {}) });
    if (opts.paymentOrderId) break;
  }
  return done;
}
