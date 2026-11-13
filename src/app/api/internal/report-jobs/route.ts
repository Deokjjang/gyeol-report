import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { createPaidReportReliabilityStore } from "../../../../lib/payment/paidReportReliabilityStore";
import { runPaidReportBatch } from "../../../../lib/book/paidWorkerBatch";
import { recoverPendingPayment } from "../../../../lib/payment/paymentConfirmRecovery";
import { WRITER_DISABLED_RUNTIME } from "../../../../lib/report-generation/writerDisabled";
import { confirmTossPayment } from "../../../../lib/payment/tossConfirmClient";

export const runtime = "nodejs";
// v5 작가(결제 경로)를 담는다(P3.5 D). 예산 680초 = 작업이 lease를 15분으로 늘렸을 때(HOTFIX-W1), 못 늘리면 480초(claim lease 10분 안).
// claim 창 45초 뒤에는 새 작업을 잡지 않는다 → 45 + 680 + 발행 < 800.
export const maxDuration = 800;
export async function GET(request: Request) {
  const expected = `Bearer ${process.env.CRON_SECRET ?? ""}`;
  const actual = request.headers.get("authorization") ?? "";
  if (!process.env.CRON_SECRET || Buffer.byteLength(actual) !== Buffer.byteLength(expected) || !timingSafeEqual(Buffer.from(actual), Buffer.from(expected))) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const startedAt = performance.now();
  const store = createPaidReportReliabilityStore();
  const expired = await store.call("expire");
  if (!expired.ok) return NextResponse.json({ ok: false }, { status: 503 });
  // Start generation independently: one slow/failed payment must not hold its queue.
  const recovery = process.env.TOSS_CONFIRM_API_ENABLED === "1"
    ? recoverPendingPayment(store, (payment, signal) => confirmTossPayment({ ...payment, signal, secretKey: process.env.TOSS_PAYMENTS_SECRET_KEY ?? "" }))
      .catch(() => ({ ok: false }))
    : Promise.resolve();
  const [result] = await Promise.all([runPaidReportBatch(store, WRITER_DISABLED_RUNTIME, { startedAt }), recovery]);
  return NextResponse.json({ ok: result.ok }, { status: result.ok ? 200 : 503 });
}
