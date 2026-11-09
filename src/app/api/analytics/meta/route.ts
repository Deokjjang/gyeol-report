import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createAccountPort } from "../../../../lib/account/supabase";
import { META_CONSENT_COOKIE, META_CONSENT_VERSION, metaConsentValue, metaDefaultOn, metaMaySend, metaOrigin, metaLocalReview, metaCookieName } from "../../../../lib/analytics/metaConsent";
import { browserMetaEvent, claimMetaBrowserEvents, metaAccountChoice, metaDeliveryReady, metaPublicRequest, metaRequestConsent, metaRequestData, metaUserMatch, recordMetaConsent, transmitMeta } from "../../../../lib/analytics/metaDelivery";
const json = (body: object, status = 200) => NextResponse.json(body, { status, headers: { "cache-control": "private, no-store", "referrer-policy": "no-referrer" } });
export async function GET(request: NextRequest) {
  const local = metaLocalReview(new URL(request.url));
  if (!local && !metaOrigin(new URL(request.url).origin)) return json({}, 404);
  if (!request.headers.get("x-request-id")) return json({ ok: false, error: "REQUEST_ID_REQUIRED" }, 400);
  // optout = 기본 측정 시행 여부(서버 시계, 덕짱님 결정 2026-11-09). 화면은 이 값으로 카드 판(시행일 전: 동의·거부·자세히 / 뒤: 거부·자세히·확인)과 전송 여부를 정한다.
  const optout = metaDefaultOn();
  if (local) return json({ choice: metaConsentValue(request.cookies.get(metaCookieName(true))?.value), ready: true, optout });
  const ready = metaDeliveryReady(), choice = await metaRequestConsent(request);
  // 시행일 뒤, 설정 쿠키 없는 브라우저(기본 허용)에 로그인 세션이 있으면 그 계정이 다른 곳에서 거부했는지 본다. 거부면 이 브라우저에도 거부 쿠키를 남긴다(DB 기록은 이미 있음).
  // 시행일 전에는 기록 없음 = 보내지 않음이라 볼 필요가 없다(예전 그대로 — DB 호출도 예전과 같음).
  if (!ready || !optout || choice !== null || request.cookies.get(META_CONSENT_COOKIE) || !request.cookies.getAll().some(c => c.name.startsWith("sb-"))) return json({ choice, ready, optout });
  const auth = createAccountPort(request), user = await auth?.currentUser();
  const account = auth && user ? await metaAccountChoice(user.id) : null;
  // 계정 설정을 못 읽으면 이번 화면에서는 보내지 않는다(쿠키는 남기지 않음 — 다음 화면에서 다시 확인).
  if (account !== false) return auth?.finish(json({ choice: account === undefined ? false : choice, ready, optout })) ?? json({ choice, ready, optout });
  const response = auth!.finish(json({ choice: false, ready, optout }));
  response.cookies.set(META_CONSENT_COOKIE, `${META_CONSENT_VERSION}:no:${randomUUID()}`, { secure: true, httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 365 });
  return response;
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
    if (typeof body.agreed === "boolean" && Object.keys(body).every(k => ["agreed", "measurement", "metaUse", "overseas", "requestId"].includes(k))) {
      if (body.agreed && (body.measurement !== true || body.metaUse !== true || body.overseas !== true)) return json({ ok: false, error: "SEPARATE_CONSENTS_REQUIRED" }, 400);
      const previous = request.cookies.get(metaCookieName(local))?.value;
      const visitor = metaConsentValue(previous) === null ? randomUUID() : previous!.split(":")[2];
      const value = `${META_CONSENT_VERSION}:${body.agreed ? "yes" : "no"}:${visitor}`;
      if (local) {
        const response = json({ ok: true, choice: body.agreed });
        response.cookies.set(metaCookieName(true), value, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 365 });
        return response; // Isolated UI adapter: NO production DB or vendor network.
      }
      request.cookies.set(META_CONSENT_COOKIE, value);
      const auth = createAccountPort(request), user = await auth?.currentUser();
      if (!await recordMetaConsent(request, user?.id ?? null)) return json({ ok: false }, 503);
      const response = auth?.finish(json({ ok: true, choice: body.agreed })) ?? json({ ok: true, choice: body.agreed });
      response.cookies.set(META_CONSENT_COOKIE, value, { secure: true, httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 365 });
      return response;
    }
    // 시행일 전: 동의한 브라우저만(예전 그대로). 시행일 뒤(덕짱님 결정 A): 거부한 브라우저만 막는다.
    // 개인 식별 정보는 선택 동의(choice === true)한 로그인 회원에게만 붙인다(시행일 전에는 DB meta_user_match가 빈 값).
    const choice = metaDeliveryReady() ? await metaRequestConsent(request) : false;
    if (!metaMaySend(choice, metaDefaultOn())) return json({ ok: false, ready: false, choice: choice === false ? false : null }, 202);
    if (body.poll === true && Object.keys(body).every(k => ["poll", "requestId"].includes(k))) {
      const auth = createAccountPort(request), user = await auth?.currentUser();
      return auth?.finish(json({ ok: true, events: await claimMetaBrowserEvents(request, user?.id ?? null) })) ?? json({ ok: true, events: [] });
    }
    const event = browserMetaEvent(body), userData = metaRequestData(request);
    if (!event) return json({}, 400);
    if (!userData) return json({ ok: false }, 202);
    const eventId = body.requestId;
    const auth = choice === true ? createAccountPort(request) : null, user = await auth?.currentUser();
    const match = user ? await metaUserMatch(user.id) : {};
    const ok = await transmitMeta({ event_name: event.event, event_id: eventId, event_time: Math.floor(Date.now() / 1000), user_data: { ...userData, ...match }, custom_data: event.params });
    return auth?.finish(json({ ok, pixel: { ...event, eventId } })) ?? json({ ok, pixel: { ...event, eventId } });
  } catch { return json({ ok: false }, 503); }
}
