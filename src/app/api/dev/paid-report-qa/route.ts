import { NextResponse } from "next/server";
import { runLocalPaidReportQa } from "../../../../lib/payment/localPaidReportQa";
import { resolveReportWriterRuntime } from "../../../../lib/report-generation/reportWriterRuntime";

export async function POST(request: Request) {
  if (!(process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") || process.env.REPORT_PERSISTENCE_MODE !== "preview_memory" || process.env.PAID_REPORT_RELIABILITY_ENABLED === "1") {
    return NextResponse.json({ ok: false, code: "UNAVAILABLE" }, { status: 404 });
  }
  let payload: unknown;
  try { payload = await request.json(); }
  catch { return NextResponse.json({ ok: false, code: "INVALID_REPORT_INPUT" }, { status: 400 }); }
  const result = await runLocalPaidReportQa(payload, resolveReportWriterRuntime());
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
