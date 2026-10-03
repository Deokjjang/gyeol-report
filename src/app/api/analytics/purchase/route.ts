import { NextRequest, NextResponse } from "next/server";
import { claimPurchase, measurementOrigin, measurementStore } from "../../../../lib/analytics/server";
export async function POST(request: NextRequest) {
  const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { "cache-control": "no-store", "referrer-policy": "no-referrer" } });
  if (process.env.NODE_ENV !== "production") return json({}, 404);
  if (!measurementOrigin(request, false)) return json({}, 403);
  try {
    const raw = await request.text(); if (raw.length > 192) return json({}, 413);
    const body = JSON.parse(raw);
    if (!body || Object.keys(body).length !== 1 || typeof body.reportId !== "string" || !/^report_[a-z0-9_-]{13,80}$/i.test(body.reportId)) return json({}, 400);
    // Existing report URL is the guest bearer capability; a share token is never accepted.
    return json(await claimPurchase(measurementStore(), body.reportId));
  } catch { return json({}, 503); }
}
