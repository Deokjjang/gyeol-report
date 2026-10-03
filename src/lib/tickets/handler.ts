import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { accountSession } from "../account/policy";
import type { AccountPort } from "../account/handler";
import { createCheckoutConsentEvidence } from "../payment/checkoutConsent";
import { isRecord } from "../report-generation/productPublishGate";
import { redeemReportTicket, type TicketStore } from "./service";

export async function handleTickets(request: NextRequest, action: string, auth: AccountPort, store: TicketStore) {
  const json = (body: object, status = 200) => auth.finish(NextResponse.json(body, { status, headers: { "Cache-Control": "private, no-store", "Vary": "Cookie", "Referrer-Policy": "no-referrer" } }));
  if (!["summary", "history", "redeem"].includes(action)) return json({}, 404);
  if (request.method !== (action === "redeem" ? "POST" : "GET")) return json({}, 405);
  const url = new URL(request.url); if (request.headers.get("host")) url.host = request.headers.get("host")!;
  if (action === "redeem" && request.headers.get("origin") !== url.origin) return json({}, 403);
  try {
    const user = await auth.currentUser(), snapshot = user ? await auth.read(user) : null;
    if (!user || !snapshot || accountSession(user, snapshot).status !== "member") return json({}, 401);
    if (action !== "redeem") {
      const result = await store.call(action, user.id);
      return result.ok ? json({ quantity: result.quantity, ...(result.referralNotice ? { referralNotice: result.referralNotice } : {}), ...(action === "history" ? { history: result.history } : {}) }) : json({}, 503);
    }
    const raw = await request.text(); if (raw.length > 16384) return json({}, 413);
    let b: unknown; try { b = JSON.parse(raw); } catch { return json({}, 400); }
    if (!isRecord(b) || Object.keys(b).some(k => !["requestId", "payload", "consent"].includes(k)) || typeof b.requestId !== "string" || !isRecord(b.payload)) return json({}, 400);
    const person = isRecord(b.payload.person) ? b.payload.person : b.payload.personA;
    const consent = isRecord(person) && typeof person.birthDate === "string" ? createCheckoutConsentEvidence(b.consent, person.birthDate, new Date()) : null;
    if (!consent) return json({ error: "필수 동의를 확인해 주세요." }, 400);
    // Recheck immediately before consuming: stale UI/session is not authority.
    if ((await auth.currentUser())?.id !== user.id) return json({}, 401);
    const result = await redeemReportTicket(store, user.id, b.requestId, b.payload, { local: true, consentEvidence: consent });
    const completed = result.ok && result.state === "COMPLETED";
    return json({ ok: completed, state: result.state, ...(completed ? { reportUrl: `/dev/book-flow/report/${result.reportId}`, message: "이용권으로 책을 만들었습니다." } : { error: result.state === "REVERSED" ? "책을 만들지 못해 이용권을 복구했습니다." : result.state === "RUNNING" ? "발행 결과를 확인 중입니다. 같은 요청으로 다시 확인해 주세요." : "사용할 수 있는 리포트 이용권을 확인해 주세요." }) }, completed || result.state === "REVERSED" ? 200 : result.state === "RUNNING" ? 202 : 400);
  } catch { return json({ error: "이용권 상태를 확인하지 못했습니다. 잠시 후 다시 확인해 주세요." }, 503); }
}
