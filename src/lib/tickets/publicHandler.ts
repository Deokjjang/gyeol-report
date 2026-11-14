import "server-only";
import { SALES_CLOSED_CODE, SALES_CLOSED_MESSAGE, SALES_PAUSED_CODE, SALES_PAUSED_MESSAGE, salesPausedMessage, TICKET_PRODUCT_CODE, TICKET_PRODUCT_MESSAGE } from "../ops/config";
import { PROFILE_REQUIRED_CODE, PROFILE_REQUIRED_MESSAGE } from "../account/profile";
import { NextRequest, NextResponse } from "next/server";
import { accountSession } from "../account/policy";
import type { AccountPort } from "../account/handler";
import { publicRequestOrigin, isPublicSameOrigin } from "../account/origin";
import { createCheckoutConsentEvidence } from "../payment/checkoutConsent";
import { isRecord } from "../report-generation/productPublishGate";
import { enqueueTicketPublication, validTicketRequestId, type TicketPublicationStore } from "./publication";
import type { TicketResult } from "./service";
import { createHash } from "node:crypto";

const messages: Record<string, string> = {
  // W3 P2: 접수되면 화면은 바로 책 만드는 화면(/reports/<id>)으로 간다. 아래 문구는 넘어가기 전 잠깐만 보인다.
  QUEUED: "책을 쓰기 시작했어요. 책 만드는 화면으로 이어져요.", RUNNING: "책을 쓰고 있어요. 책 만드는 화면으로 이어져요.", COMPLETED: "책이 완성되었습니다.",
  REVERSED: "책을 끝까지 만들지 못했어요. 쓰신 이용권은 돌려드렸어요.",
  NO_USABLE_TICKET: "사용 가능한 이용권이 없습니다. 보유 내역을 다시 확인해 주세요.", REFUND_HOLD: "이용권 확인이 필요합니다.",
  [SALES_CLOSED_CODE]: SALES_CLOSED_MESSAGE, [SALES_PAUSED_CODE]: SALES_PAUSED_MESSAGE,
  [TICKET_PRODUCT_CODE]: TICKET_PRODUCT_MESSAGE,
};
async function pausedMessage(): Promise<string> {
  try { const { readSalesPause, SALES_PAUSE_CACHE_MS } = await import("../ops/salesPause"); return salesPausedMessage((await readSalesPause({ maxAgeMs: SALES_PAUSE_CACHE_MS }))?.reason); }
  catch { return SALES_PAUSED_MESSAGE; }
}
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
    const expected = request.headers.get("x-ticket-account");
    if (expected && expected !== createHash("sha256").update(`bundle-ui-v1:${user.id}`).digest("hex")) return json({ ok: false, code: "ACCOUNT_CHANGED", message: "원래 계정으로 로그인한 뒤 발행 상태를 확인해 주세요." }, 409);
    const account = await auth.read(user);
    if (account === null) return json({ ok: false, code: "STORAGE_UNAVAILABLE" }, 503);
    if (account.profile?.id !== user.id || accountSession(user, account).status !== "member") return json({ ok: false, code: "MEMBER_CONSENT_REQUIRED" }, 401);
    // P6d-ops 2: 가입 정보(이름·이메일)를 마치기 전에는 이용권을 쓸 수 없다(상태 확인은 된다).
    if (action === "redeem" && account.contact === null) return json({ ok: false, code: PROFILE_REQUIRED_CODE, message: PROFILE_REQUIRED_MESSAGE }, 403);
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
      const code = ["INVALID_INPUT", "REQUEST_CONFLICT", "NOT_FOUND", "NO_USABLE_TICKET", "REFUND_HOLD", SALES_CLOSED_CODE, SALES_PAUSED_CODE, TICKET_PRODUCT_CODE].includes(result.code ?? "") ? result.code! : "STORAGE_UNAVAILABLE";
      // W4 Q0: 판매 멈춤 문구는 멈춘 이유대로(막기 판단이 방금 읽은 값을 10초 기억에서 다시 쓴다).
      const message = code === SALES_PAUSED_CODE ? await pausedMessage() : messages[code];
      return json({ ok: false, code, message: message ?? "발행 상태를 확인 중입니다." }, code === "STORAGE_UNAVAILABLE" ? 503 : code === "NOT_FOUND" ? 404 : 409);
    }
    const state = result.state;
    if (!state || !messages[state] || !validTicketRequestId(result.redemptionId)) return json({ ok: false, code: "STORAGE_UNAVAILABLE" }, 503);
    // W3 P2: 만드는 중(QUEUED·RUNNING)에도 책 주소를 준다 — 화면이 바로 같은 대기 화면(/reports/<id>, 주인만)으로 간다. 로그인한 본인 접수만 답한다.
    // 진행률·지연 안내는 그 대기 화면이 서버 상태(/api/reports/<id>/progress)로 보인다(예전 결제 화면 안 진행률은 없앴다).
    const addressable = ["COMPLETED", "QUEUED", "RUNNING"].includes(state) && typeof result.reportId === "string" && /^report_[a-f0-9]{32}$/.test(result.reportId);
    return json({ ok: true, state, redemptionId: result.redemptionId, message: messages[state], ...(addressable ? { reportUrl: `/reports/${result.reportId}` } : {}) }, ["QUEUED", "RUNNING"].includes(state) ? 202 : 200);
  } catch { return json({ ok: false, code: "STORAGE_UNAVAILABLE", message: "발행 상태를 확인 중입니다." }, 503); }
}
