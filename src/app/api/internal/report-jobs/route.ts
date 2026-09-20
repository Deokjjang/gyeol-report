import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { createPaidReportReliabilityStore } from "../../../../lib/payment/paidReportReliabilityStore";
import { confirmPaidReport, runPaidReportJob } from "../../../../lib/payment/paidReportReliability";
import { resolveReportWriterRuntime } from "../../../../lib/report-generation/reportWriterRuntime";
import { confirmTossPayment } from "../../../../lib/payment/tossConfirmClient";
import { isRecord } from "../../../../lib/report-generation/productPublishGate";

export const runtime = "nodejs";
export const maxDuration = 300;
export async function GET(request: Request) {
  const expected = `Bearer ${process.env.CRON_SECRET ?? ""}`;
  const actual = request.headers.get("authorization") ?? "";
  if (!process.env.CRON_SECRET || Buffer.byteLength(actual) !== Buffer.byteLength(expected) || !timingSafeEqual(Buffer.from(actual), Buffer.from(expected))) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const store = createPaidReportReliabilityStore();
  const expired = await store.call("expire");
  if (!expired.ok) return NextResponse.json({ ok: false }, { status: 503 });
  if (process.env.TOSS_CONFIRM_API_ENABLED === "1") {
    const pending = await store.call("pending_payment");
    if (pending.ok && isRecord(pending.order)) {
      const order = pending.order;
      await confirmPaidReport({ orderId: String(order.provider_order_id), paymentKey: String(order.provider_payment_id), amount: Number(order.amount) },
        store, (payment) => confirmTossPayment({ ...payment, secretKey: process.env.TOSS_PAYMENTS_SECRET_KEY ?? "" }));
    }
  }
  const result = await runPaidReportJob(store, resolveReportWriterRuntime());
  return NextResponse.json({ ok: result.ok }, { status: result.ok ? 200 : 503 });
}
