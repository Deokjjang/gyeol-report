import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { createPaidReportReliabilityStore } from "../../../../lib/payment/paidReportReliabilityStore";
import { runPaidReportJob } from "../../../../lib/payment/paidReportReliability";
import { recoverPendingPayment } from "../../../../lib/payment/paymentConfirmRecovery";
import { resolveReportWriterRuntime } from "../../../../lib/report-generation/reportWriterRuntime";
import { confirmTossPayment } from "../../../../lib/payment/tossConfirmClient";

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
  // Start generation independently: one slow/failed payment must not hold its queue.
  const recovery = process.env.TOSS_CONFIRM_API_ENABLED === "1"
    ? recoverPendingPayment(store, (payment, signal) => confirmTossPayment({ ...payment, signal, secretKey: process.env.TOSS_PAYMENTS_SECRET_KEY ?? "" }))
      .catch(() => ({ ok: false }))
    : Promise.resolve();
  const [result] = await Promise.all([runPaidReportJob(store, resolveReportWriterRuntime()), recovery]);
  return NextResponse.json({ ok: result.ok }, { status: result.ok ? 200 : 503 });
}
