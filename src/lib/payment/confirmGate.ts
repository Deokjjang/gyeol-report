import "server-only";
/**
 * AM2-14 4부: 승인 직전 문(confirmPaidReport salesGate — 토스 승인 · confirm_claim 전, HTTP 승인 진입점 둘이 같이 쓴다).
 * ① 판매 닫힘 · 판매 멈춤(Q0 · 처리 봇) — closedProductOrder 그대로(4종 · 세운 · 대운 모두). ② 대운 주문만: 저장 금액 = 정가면 통과, 반값이면 자격 소진(원자)에 성공할 때만,
 * 그 밖 금액은 거절(majorHalfGate). 4종 · 세운 주문은 ②를 지나지 않는다(그대로).
 */
import { isRecord } from "../report-generation/productPublishGate";
import { closedProductOrder } from "./paidReportReliability";
import type { ReliabilityStore } from "./paidReportReliabilityStore";
import { createHalfPort, HALF_AMOUNT_CODE, HALF_REFUSED_CODE, majorHalfGate, type HalfPort } from "./majorDiscount";

export async function confirmGate(store: ReliabilityStore, orderId: string, deps: { amount?: number; port?: () => HalfPort; paused?: () => Promise<boolean> } = {}): Promise<string | null> {
  const closed = await closedProductOrder(store, orderId, ...(deps.paused ? [deps.paused] as const : []));
  if (closed) return closed;
  let order: Record<string, unknown> | null = null;
  try { const found = await store.call("find_order", { orderId }); order = found.ok && isRecord(found.order) ? found.order : null; } catch { return null; }
  if (!order || order.provider_order_id !== orderId || order.product_type !== "major_fortune") return null;
  // 대운: 요청 금액이 저장 금액과 다르면(조작 · 오래된 결제창) 자격을 잡기 전에 거절한다 — confirm_claim도 같은 대조로 막지만 그 전에 소진하지 않게.
  if (order.status === "ready" && deps.amount !== undefined && Number(order.amount) !== deps.amount) return HALF_AMOUNT_CODE;
  try {
    const port = deps.port ? deps.port() : createHalfPort((await import("../ops/store")).createOpsStores().db);
    return await majorHalfGate(order, port);
  } catch { return Number(order.amount) > 0 && order.status === "ready" ? HALF_REFUSED_CODE : null; } // 대운 소진을 확인하지 못하면 반값 주문은 승인하지 않는다(정가는 majorHalfGate가 먼저 통과시킨다)
}
