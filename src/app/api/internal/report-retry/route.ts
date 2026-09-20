import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { createPaidReportReliabilityStore } from "../../../../lib/payment/paidReportReliabilityStore";
import { isRecord } from "../../../../lib/report-generation/productPublishGate";
function authorized(request: Request) {
  const expected = `Bearer ${process.env.REPORT_ADMIN_SECRET ?? ""}`;
  const actual = request.headers.get("authorization") ?? "";
  return Boolean(process.env.REPORT_ADMIN_SECRET) && Buffer.byteLength(actual) === Buffer.byteLength(expected) && timingSafeEqual(Buffer.from(actual), Buffer.from(expected));
}
export async function GET(request: Request) {
  if (!authorized(request)) return NextResponse.json({ ok: false }, { status: 401 });
  const result = await createPaidReportReliabilityStore().call("attention");
  return NextResponse.json(result, { status: result.ok ? 200 : 503 });
}
export async function POST(request: Request) {
  if (!authorized(request)) return NextResponse.json({ ok: false }, { status: 401 });
  const body: unknown = await request.json().catch(() => null);
  if (!isRecord(body) || typeof body.reportId !== "string") return NextResponse.json({ ok: false }, { status: 400 });
  const result = await createPaidReportReliabilityStore().call("admin_retry", { reportId: body.reportId });
  return NextResponse.json({ ok: result.ok }, { status: result.ok ? 202 : 409 });
}
