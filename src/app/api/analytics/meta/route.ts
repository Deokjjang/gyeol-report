import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createAccountPort } from "../../../../lib/account/supabase";
import { META_CONSENT_COOKIE, META_CONSENT_VERSION, metaConsentValue, metaOrigin, metaLocalReview, metaCookieName } from "../../../../lib/analytics/metaConsent";
import { browserMetaEvent, metaDeliveryReady, metaPublicRequest, metaRequestData, recordMetaConsent, transmitMeta } from "../../../../lib/analytics/metaDelivery";
const json = (body: object, status = 200) => NextResponse.json(body, { status, headers: { "cache-control": "private, no-store", "referrer-policy": "no-referrer" } });
export async function GET(request: NextRequest) {
  const local = metaLocalReview(new URL(request.url));
  if (!local && !metaOrigin(new URL(request.url).origin)) return json({}, 404);
  if (!request.headers.get("x-request-id")) return json({ ok: false, error: "REQUEST_ID_REQUIRED" }, 400);
  return json({ choice: metaConsentValue(request.cookies.get(metaCookieName(local))?.value), ready: local || metaDeliveryReady() });
}
export async function POST(request: NextRequest) {
  const local = metaLocalReview(new URL(request.url));
  const localUrl = new URL(request.url);
  if (local && request.headers.get("host")) localUrl.host = request.headers.get("host")!;
  if (!metaPublicRequest(request) && !(local && request.headers.get("origin") === localUrl.origin)) return json({}, 403);
  try {
    const text = await request.text(); if (text.length > 512) return json({}, 413);
    const body = JSON.parse(text);
    if (!body?.requestId) return json({ ok: false, error: "REQUEST_ID_REQUIRED" }, 400);
    if (typeof body.requestId !== "string" || !/^[a-f0-9-]{36}$/.test(body.requestId)) return json({}, 400);
    if (typeof body.agreed === "boolean" && Object.keys(body).every(k => ["agreed", "requestId"].includes(k))) {
      const previous = request.cookies.get(metaCookieName(local))?.value;
      const visitor = metaConsentValue(previous) === null ? randomUUID() : previous!.split(":")[2];
      const value = `${META_CONSENT_VERSION}:${body.agreed ? "yes" : "no"}:${visitor}`;
      if (local) {
        const response = json({ ok: true, choice: body.agreed });
        response.cookies.set(metaCookieName(true), value, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 180 });
        return response; // Isolated UI adapter: NO production DB or vendor network.
      }
      request.cookies.set(META_CONSENT_COOKIE, value);
      const auth = createAccountPort(request), user = await auth?.currentUser();
      if (!await recordMetaConsent(request, user?.id ?? null)) return json({ ok: false }, 503);
      const response = auth?.finish(json({ ok: true, choice: body.agreed })) ?? json({ ok: true, choice: body.agreed });
      response.cookies.set(META_CONSENT_COOKIE, value, { secure: true, httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 180 });
      return response;
    }
    if (metaConsentValue(request.cookies.get(META_CONSENT_COOKIE)?.value) !== true || !metaDeliveryReady()) return json({ ok: false, ready: false }, 202);
    const event = browserMetaEvent(body), userData = metaRequestData(request);
    if (!event) return json({}, 400);
    if (!userData) return json({ ok: false }, 202);
    return json({ ok: await transmitMeta({ event_name: event.event, event_id: randomUUID(), event_time: Math.floor(Date.now() / 1000), user_data: userData, custom_data: event.params }) });
  } catch { return json({ ok: false }, 503); }
}
