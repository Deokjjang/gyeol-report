import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { runMetaDeliveries } from "../../../../lib/analytics/metaDelivery";
export const runtime = "nodejs";
export const maxDuration = 60;
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET, actual = request.headers.get("authorization") ?? "", expected = `Bearer ${secret ?? ""}`;
  if (!secret || Buffer.byteLength(actual) !== Buffer.byteLength(expected) || !timingSafeEqual(Buffer.from(actual), Buffer.from(expected))) return NextResponse.json({ ok: false }, { status: 401 });
  if (process.env.VERCEL_ENV !== "production") return NextResponse.json({ ok: false }, { status: 404 });
  try {
    const result = await runMetaDeliveries();
    return NextResponse.json(result, { status: result.failed ? 503 : 200, headers: { "cache-control": "no-store" } });
  } catch { return NextResponse.json({ ok: false }, { status: 503 }); }
}
