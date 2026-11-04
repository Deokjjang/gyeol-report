import "server-only";
import type { RefundProvider } from "../../payment/tossRefundClient";
import type { RefundIntent } from "../../tickets/refundContract";

/**
 * 토스 상태 확인(P6e-ops 4). 조회 API(GET /v1/payments/{paymentKey})만 쓴다 — 취소 호출은 canPost:false라 이 경로에서 만들 수 없다.
 * 과거 환불 일부는 토스 상점관리자에서 직접 처리돼 우리 DB가 결제 완료로 알고 있을 수 있다.
 */
export type TossTarget = { paymentKey: string; providerOrderId: string; amount: number };
export type TossStatus =
  | { kind: "done" }                                                  // 토스도 결제 완료(DONE): 일치
  | { kind: "canceled"; canceledAt: string | null; balanceAmount: number } // 토스가 전액 취소(CANCELED): 외부 환불 후보
  | { kind: "partial"; balanceAmount: number }                        // 일부 취소: 자동 기록하지 않음(수동 확인)
  | { kind: "error"; code: string };                                  // 조회 실패·응답이 우리 주문과 안 맞음

export const TOSS_ERROR_LABEL: Record<string, string> = {
  PROVIDER_UNKNOWN: "토스에 연결하지 못했어요(잠시 뒤 다시)", PROVIDER_REJECTED: "토스가 조회를 거절했어요(결제 키·비밀키 확인)",
  PROVIDER_MISMATCH: "토스 응답이 우리 주문과 맞지 않아요(주문번호·금액)", NO_PAYMENT_KEY: "결제 키가 없어요", TOSS_SECRET_MISSING: "토스 비밀키가 설정되지 않았어요",
};

export async function lookupToss(provider: RefundProvider, t: TossTarget, now = new Date()): Promise<TossStatus> {
  if (!t.paymentKey || !t.providerOrderId || !Number.isSafeInteger(t.amount) || t.amount <= 0) return { kind: "error", code: "NO_PAYMENT_KEY" };
  const intent: RefundIntent = { paymentKey: t.paymentKey, providerOrderId: t.providerOrderId, originalAmount: t.amount, amount: t.amount, quantity: 1,
    idempotencyKey: `order-refund-${crypto.randomUUID()}`, cancelReason: "status-check", firstAttemptAt: now.toISOString(), token: "", canPost: false };
  const r = await provider.lookup(intent);
  if (!r.ok) return { kind: "error", code: r.code };
  const p = r.payment;
  if (p.status === "CANCELED") {
    const last = p.cancels.map(c => c.canceledAt).filter(x => Number.isFinite(Date.parse(x))).sort().at(-1) ?? null;
    return { kind: "canceled", canceledAt: last ? new Date(last).toISOString() : null, balanceAmount: p.balanceAmount };
  }
  if (p.status === "PARTIAL_CANCELED") return { kind: "partial", balanceAmount: p.balanceAmount };
  return { kind: "done" };
}

/** 한 번에 병렬로 조회하는 수(토스 호출을 조용히 유지). */
export const TOSS_BATCH_CONCURRENCY = 5;
export const TOSS_BATCH_LIMIT = 20;
export async function lookupTossMany<T extends TossTarget>(provider: RefundProvider, targets: readonly T[]): Promise<{ target: T; status: TossStatus }[]> {
  const out: { target: T; status: TossStatus }[] = [];
  for (let i = 0; i < targets.length; i += TOSS_BATCH_CONCURRENCY) {
    out.push(...await Promise.all(targets.slice(i, i + TOSS_BATCH_CONCURRENCY).map(async target => ({ target, status: await lookupToss(provider, target) }))));
  }
  return out;
}
