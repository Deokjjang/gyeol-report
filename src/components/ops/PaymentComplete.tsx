import "server-only";
import Link from "next/link";
import MetaPurchaseTracker from "../analytics/MetaPurchaseTracker";
import { FunnelPing } from "../analytics/FunnelTracker";
import { createOpsStores } from "../../lib/ops/store";
import { giftEventConfig } from "../../lib/ops/config";
import { afterPaidOrder } from "../../lib/ops/gift/service";
import { ORDER_STATE_LINES, orderBookState, orderStillMaking, publicSummary } from "../../lib/ops/orders/summary";
import { AutoOpen, OrderRequestForm, OrderSummaryCard } from "./OrderParts";
import styles from "../report/reportStatus.module.css";
import s from "./ops.module.css";

/**
 * 결제 완료 화면(P6d-ops 4). 결제한 사람만 아는 토스 orderId + paymentKey로 주문을 찾는다.
 * 영수증 주소 저장·이벤트 이용권 발급(설정값으로 켬)도 여기서 한 번(실패해도 화면은 그대로, 크론이 다시 한다).
 * W3 P2: 상태는 주문 요약의 실제 값(만드는 중 · 결과 확인 중 · 결제 취소 중 · 결제 취소 완료 · 책 완성)이고, 약 3초 뒤 책 화면으로 넘어간다.
 */
/** F 퍼널: 결제 완료 = 결제 완료 + 책 생성 시작(세션당 1번). */
const PAID_STEPS = ["paid", "book_start"] as const;
export async function PaymentCompleteView(a: { providerOrderId: string; paymentKey: string; reportId: string; receiptUrl?: string }) {
  const ops = createOpsStores();
  const found = await ops.order.call("find_paid", { providerOrderId: a.providerOrderId, paymentKey: a.paymentKey });
  if (!found.ok) return null;
  if (a.receiptUrl) await ops.order.call("receipt", { providerOrderId: a.providerOrderId, receiptUrl: a.receiptUrl });
  await afterPaidOrder(ops.gift, String(found.paymentOrderId), giftEventConfig());
  const summary = await ops.order.call("summary", { providerOrderId: a.providerOrderId });
  const row = Array.isArray(summary.orders) ? (summary.orders as Record<string, unknown>[])[0] : null;
  if (!row) return null;
  const order = publicSummary(row), state = orderBookState(order), bookHref = `/reports/${a.reportId}`;
  return <main className={styles.page} data-payment-complete data-order-state={state}>
    <div className={styles.container}>
      <p className={styles.brand}><Link href="/" aria-label="결리포트 홈">GYEOL REPORT</Link></p>
      <section className={styles.content} aria-labelledby="payment-complete-title">
        <div className={styles.body}>
          <h1 id="payment-complete-title" className={styles.title}>결제가 완료됐어요</h1>
          <p className={styles.message} role="status">{ORDER_STATE_LINES[state]}</p>
          <OrderSummaryCard order={order} bookHref={bookHref}><OrderRequestForm guest={{ providerOrderId: a.providerOrderId, paymentKey: a.paymentKey }} submitted={order.openRequests > 0}
            making={orderStillMaking(order)} /></OrderSummaryCard>
          <p className={s.hint}>내 서재에서 다시 볼 수 있어요.</p>
        </div>
      </section>
    </div>
    {state === "refunded" ? null : <MetaPurchaseTracker reportId={a.reportId} />}
    <FunnelPing steps={PAID_STEPS} />
    <AutoOpen href={bookHref} />
  </main>;
}
