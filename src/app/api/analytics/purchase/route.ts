import { NextRequest, NextResponse } from "next/server";
import { createAccountPort } from "../../../../lib/account/supabase";
import { createSupabaseServerClient } from "../../../../lib/db/supabaseServer";
import { claimMetaBrowserEvents, metaBrowserKey, metaDeliveryReady, metaPublicRequest, metaRequestConsent, metaRequestData } from "../../../../lib/analytics/metaDelivery";
export async function POST(request: NextRequest) {
  const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { "cache-control": "no-store", "referrer-policy": "no-referrer" } });
  if (process.env.NODE_ENV !== "production") return json({}, 404);
  if (!metaPublicRequest(request)) return json({}, 403);
  try {
    const raw = await request.text(); if (raw.length > 256) return json({}, 413);
    const body = JSON.parse(raw);
    if (!body?.requestId) return json({ ok: false, error: "REQUEST_ID_REQUIRED" }, 400);
    if (typeof body.requestId !== "string" || !/^[a-f0-9-]{36}$/.test(body.requestId) || Object.keys(body).some(k => !["reportId", "requestId"].includes(k)) || typeof body.reportId !== "string" || !/^report_[a-z0-9_-]{13,80}$/i.test(body.reportId)) return json({}, 400);
    // 기본 허용(덕짱님 결정 A): 거부한 브라우저만 막는다. 설정 기록이 없는 브라우저는 SQL이 「로그인한 구매 회원 본인·그 회원이 거부 안 함」을 다시 본다.
    if (!metaDeliveryReady() || await metaRequestConsent(request) === false) return json({ ok: false }, 202);
    const data = metaRequestData(request); if (!data) return json({ ok: false }, 202);
    const auth = createAccountPort(request), user = await auth?.currentUser();
    // The existing guest report bearer capability is accepted for an opted-in browser; never a share token.
    // Price, payment evidence and product come exclusively from payment_orders.
    const result = await createSupabaseServerClient().rpc("queue_meta_purchase", { p_report: body.reportId, p_browser: metaBrowserKey(request), p_ip: data.client_ip_address, p_agent: data.client_user_agent, p_user: user?.id ?? null });
    const ok = !result.error && result.data === true;
    // 픽셀 거울(같은 event id)을 이 응답으로 바로 준다 — 기본 허용 브라우저는 5초 주기 확인을 하지 않는다.
    const events = ok ? await claimMetaBrowserEvents(request, user?.id ?? null) : [];
    return auth?.finish(json({ ok, events })) ?? json({ ok, events });
  } catch { return json({}, 503); }
}
