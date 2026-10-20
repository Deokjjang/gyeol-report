import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../../lib/db/supabaseServer";
import { META_CONSENT_COOKIE, metaConsentValue } from "../../../../lib/analytics/metaConsent";
import { metaBrowserKey, metaDeliveryReady, metaPublicRequest, metaRequestData } from "../../../../lib/analytics/metaDelivery";
export async function POST(request: NextRequest) {
  const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { "cache-control": "no-store", "referrer-policy": "no-referrer" } });
  if (process.env.NODE_ENV !== "production") return json({}, 404);
  if (!metaPublicRequest(request)) return json({}, 403);
  try {
    const raw = await request.text(); if (raw.length > 256) return json({}, 413);
    const body = JSON.parse(raw);
    if (!body?.requestId) return json({ ok: false, error: "REQUEST_ID_REQUIRED" }, 400);
    if (typeof body.requestId !== "string" || !/^[a-f0-9-]{36}$/.test(body.requestId) || Object.keys(body).some(k => !["reportId", "requestId"].includes(k)) || typeof body.reportId !== "string" || !/^report_[a-z0-9_-]{13,80}$/i.test(body.reportId)) return json({}, 400);
    if (!metaDeliveryReady() || metaConsentValue(request.cookies.get(META_CONSENT_COOKIE)?.value) !== true) return json({ ok: false }, 202);
    const data = metaRequestData(request); if (!data) return json({ ok: false }, 202);
    // The existing guest report bearer capability is accepted; never a share token.
    // Price, payment evidence and product come exclusively from payment_orders.
    const result = await createSupabaseServerClient().rpc("queue_meta_purchase", { p_report: body.reportId, p_browser: metaBrowserKey(request), p_ip: data.client_ip_address, p_agent: data.client_user_agent });
    return json({ ok: !result.error && result.data === true });
  } catch { return json({}, 503); }
}
