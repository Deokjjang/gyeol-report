import { NextRequest, NextResponse } from "next/server";
import { localAccountAllowed } from "../../../lib/account/gate";
import { validInteraction, funnelCounts } from "../../../lib/analytics/events";
import { measurementFacts, measurementOrigin, claimPurchase } from "../../../lib/analytics/server";
export const dynamic = "force-dynamic";
const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { "cache-control": "no-store", "referrer-policy": "no-referrer" } });
export async function GET(request: NextRequest) {
  if (!localAccountAllowed(request)) return json({}, 404);
  const { localMeasurementDatabase, sqlMeasurementStore, measurementIdentity, localInteractions } = await import("../../../lib/analytics/localReview");
  const db = await localMeasurementDatabase(); if (!db) return json({}, 503);
  const port = sqlMeasurementStore(db), user = await measurementIdentity(request);
  const url = new URL(request.url);
  if (url.searchParams.get("aggregate") === "1") {
    const events = [...localInteractions(), ...await measurementFacts(port, null)];
    const campaigns = [...new Set(events.flatMap(e => e.campaign ? [e.campaign] : []))];
    return json({ counts: funnelCounts(events), campaigns: Object.fromEntries(campaigns.map(c => [c, funnelCounts(events.filter(e => e.campaign === c))])), downstream: events.filter(e => "downstreamCampaign" in e).map(e => ({ event: e.event, eventId: e.eventId, campaign: (e as { downstreamCampaign?: string }).downstreamCampaign })), scope: "local process interactions + durable local business facts" });
  }
  const events = user ? await measurementFacts(port, user) : [];
  // Only an authenticated owner gets recovery hints, including paid-but-failed generation.
  const purchases = user ? (await db.query<{ reportId: string }>("select o.report_id as \"reportId\" from payment_orders o join report_purchase_bindings b on b.order_id=o.payment_order_id left join meta_purchase_dispatches d on d.order_id=o.payment_order_id where b.buyer_id=$1 and o.status='paid' and o.paid_at is not null and d.order_id is null", [user])).rows : [];
  return json({ events, purchases });
}
export async function POST(request: NextRequest) {
  if (!localAccountAllowed(request)) return json({}, 404);
  if (!measurementOrigin(request, true)) return json({}, 403);
  try {
    const raw = await request.text(); if (raw.length > 768) return json({}, 413);
    const body = JSON.parse(raw);
    const { localMeasurementDatabase, sqlMeasurementStore, collectInteraction } = await import("../../../lib/analytics/localReview");
    if (body && Object.keys(body).length === 1 && typeof body.reportId === "string" && /^(?:report_[a-z0-9_-]{13,80}|book-local-[a-f0-9-]{36})$/i.test(body.reportId)) {
      const db = await localMeasurementDatabase(); return json(db ? await claimPurchase(sqlMeasurementStore(db), body.reportId) : {}, db ? 200 : 503);
    }
    if (!validInteraction(body)) return json({}, 400);
    await collectInteraction(request, body); return json({ ok: true });
  } catch { return json({}, 503); }
}
