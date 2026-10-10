import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { accountSession } from "../account/policy";
import type { AccountPort } from "../account/handler";
import { publicRequestOrigin, isPublicSameOrigin } from "../account/origin";
import { createCheckoutConsentEvidence } from "../payment/checkoutConsent";
import { isRecord } from "../report-generation/productPublishGate";
import { enqueueTicketPublication, validTicketRequestId, type TicketPublicationStore } from "./publication";
import type { TicketResult } from "./service";

const messages: Record<string, string> = {
  QUEUED: "책 발행을 준비하고 있습니다.", RUNNING: "책을 만들고 있습니다.", COMPLETED: "책이 완성되었습니다.",
  REVERSED: "책을 완성하지 못했습니다. 사용한 이용권은 복구되었습니다.",
  NO_USABLE_TICKET: "사용 가능한 이용권이 없습니다. 보유 내역을 다시 확인해 주세요.", REFUND_HOLD: "이용권 확인이 필요합니다.",
};
// Only mounted after BOTH server gates. The injectable ports are tests, not an
// HTTP/env/cookie bypass. No provider, promotion or generation runs in this API.
export async function handleTicketPublication(request: NextRequest, action: string, auth: AccountPort, store: TicketPublicationStore) {
  const json = (body: object, status = 200) => auth.finish(NextResponse.json(body, { status, headers: { "Cache-Control": "private, no-store", Vary: "Cookie", "Referrer-Policy": "no-referrer" } }));
  if (!["redeem", "status"].includes(action)) return json({}, 404);
  if (request.method !== (action === "redeem" ? "POST" : "GET")) return json({}, 405);
  if (!publicRequestOrigin(request) || (action === "redeem" && !isPublicSameOrigin(request))) return json({}, 403);
  try {
    const user = await auth.currentUser();
    if (!user) return json({ ok: false, code: "MEMBER_REQUIRED" }, 401);
    const account = await auth.read(user);
    if (account === null) return json({ ok: false, code: "STORAGE_UNAVAILABLE" }, 503);
    if (account.profile?.id !== user.id || accountSession(user, account).status !== "member") return json({ ok: false, code: "MEMBER_CONSENT_REQUIRED" }, 401);
    let result: TicketResult;
    if (action === "status") {
      const params = new URL(request.url).searchParams;
      const keys = [...params.keys()];
      if (keys.length !== 1 || !["redemptionId", "requestId"].includes(keys[0]) || !validTicketRequestId(params.get(keys[0]))) return json({}, 400);
      result = await store.call("status", user.id, { [keys[0]]: params.get(keys[0])!.toLowerCase() });
    } else {
      if (Number(request.headers.get("content-length")) > 16384) return json({}, 413);
      const reader = request.body?.getReader(); if (!reader) return json({}, 400);
      const chunks: Uint8Array[] = []; let size = 0;
      while (true) { const next = await reader.read(); if (next.done) break; size += next.value.byteLength; if (size > 16384) { await reader.cancel(); return json({}, 413); } chunks.push(next.value); }
      let body: unknown; try { body = JSON.parse(Buffer.concat(chunks).toString("utf8")); } catch { return json({}, 400); }
      if (!isRecord(body) || Object.keys(body).some(k => !["requestId", "payload", "consent"].includes(k)) || !validTicketRequestId(body.requestId) || !isRecord(body.payload)) return json({}, 400);
      const person = isRecord(body.payload.person) ? body.payload.person : body.payload.personA;
      const now = new Date(), consent = isRecord(person) && typeof person.birthDate === "string" ? createCheckoutConsentEvidence(body.consent, person.birthDate, now) : null;
      if (!consent) return json({ ok: false, code: "CONSENT_REQUIRED", message: "필수 동의를 확인해 주세요." }, 400);
      if ((await auth.currentUser())?.id !== user.id) return json({}, 401);
      result = await enqueueTicketPublication(store, user.id, body.requestId, body.payload, consent, now);
    }
    if ((await auth.currentUser())?.id !== user.id) return json({}, 401);
    if (!result.ok) {
      const code = ["INVALID_INPUT", "REQUEST_CONFLICT", "NOT_FOUND", "NO_USABLE_TICKET", "REFUND_HOLD"].includes(result.code ?? "") ? result.code! : "STORAGE_UNAVAILABLE";
      return json({ ok: false, code, message: messages[code] ?? "발행 상태를 확인 중입니다." }, code === "STORAGE_UNAVAILABLE" ? 503 : code === "NOT_FOUND" ? 404 : 409);
    }
    const state = result.state;
    if (!state || !messages[state] || !validTicketRequestId(result.redemptionId)) return json({ ok: false, code: "STORAGE_UNAVAILABLE" }, 503);
    const completed = state === "COMPLETED" && typeof result.reportId === "string" && /^report_[a-f0-9]{32}$/.test(result.reportId);
    return json({ ok: true, state, redemptionId: result.redemptionId, message: messages[state], ...(completed ? { reportUrl: `/reports/${result.reportId}` } : {}) }, ["QUEUED", "RUNNING"].includes(state) ? 202 : 200);
  } catch { return json({ ok: false, code: "STORAGE_UNAVAILABLE", message: "발행 상태를 확인 중입니다." }, 503); }
}
