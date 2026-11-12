import "server-only";
import { SALES_CLOSED_CODE, SALES_CLOSED_MESSAGE, TICKET_PRODUCT_CODE, TICKET_PRODUCT_MESSAGE } from "../ops/config";
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
  QUEUED: "책을 제본하고 있습니다. 나갔다 와도 내 서재에서 이어서 볼 수 있어요.", RUNNING: "책을 제본하고 있습니다.", COMPLETED: "책이 완성되었습니다.",
  REVERSED: "책을 완성하지 못했습니다. 사용한 이용권은 복구되었습니다.",
  // AM2-3 6-1: 정식본·임시본 시도가 실패해 다시 쓰는 중(결제 책의 「지연」 안내와 같은 뜻).
  DELAYED: "평소보다 조금 더 걸리고 있어요. 책을 다시 이어서 만들고 있습니다. 완성되면 내 서재에서 바로 열 수 있어요.",
  NO_USABLE_TICKET: "사용 가능한 이용권이 없습니다. 보유 내역을 다시 확인해 주세요.", REFUND_HOLD: "이용권 확인이 필요합니다.",
  [SALES_CLOSED_CODE]: SALES_CLOSED_MESSAGE,
  [TICKET_PRODUCT_CODE]: TICKET_PRODUCT_MESSAGE,
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
      const code = ["INVALID_INPUT", "REQUEST_CONFLICT", "NOT_FOUND", "NO_USABLE_TICKET", "REFUND_HOLD", SALES_CLOSED_CODE, TICKET_PRODUCT_CODE].includes(result.code ?? "") ? result.code! : "STORAGE_UNAVAILABLE";
      return json({ ok: false, code, message: messages[code] ?? "발행 상태를 확인 중입니다." }, code === "STORAGE_UNAVAILABLE" ? 503 : code === "NOT_FOUND" ? 404 : 409);
    }
    const state = result.state;
    if (!state || !messages[state] || !validTicketRequestId(result.redemptionId)) return json({ ok: false, code: "STORAGE_UNAVAILABLE" }, 503);
    const completed = state === "COMPLETED" && typeof result.reportId === "string" && /^report_[a-f0-9]{32}$/.test(result.reportId);
    // AM 4부: 만드는 중이면 진짜 진행률·남은 시간·1장 미리보기(이 상태 조회는 로그인한 본인 이용권만 답한다 — 주인 확인).
    let progress: Record<string, unknown> | undefined;
    if (state === "RUNNING" && action === "status") try {
      const { createOpsStores } = await import("../ops/store"), { etaOf } = await import("../../components/report/generationProgress");
      const p = await createOpsStores().progress.call("read", { redemptionId: result.redemptionId });
      if (p.ok === true) { const done = Number(p.done) || 0, total = typeof p.total === "number" ? p.total : null; progress = { done, total, etaMs: etaOf(typeof p.medianMs === "number" ? p.medianMs : null, done, total), ...(p.first ? { first: p.first } : {}) }; }
    } catch { progress = undefined; }
    // AM2-3 6-1: 감독이 실패 뒤 다시 쓰는 중이면 지연 안내(결정론 대체본은 내보내지 않는다 — 기다리는 동안 이 문구).
    let delayed = false;
    if ((state === "RUNNING" || state === "QUEUED") && action === "status" && typeof result.reportId === "string" && /^report_[a-z0-9]{13,64}$/.test(result.reportId)) try {
      const { createOpsStores } = await import("../ops/store");
      const g = await createOpsStores().generation.call("state", { reportId: result.reportId });
      delayed = g.ok === true && Number((g.state as { failures?: number } | undefined)?.failures ?? 0) > 0;
    } catch { delayed = false; }
    return json({ ok: true, state, redemptionId: result.redemptionId, message: delayed ? messages.DELAYED : messages[state], ...(delayed ? { delayed: true } : {}), ...(progress ? { progress } : {}), ...(completed ? { reportUrl: `/reports/${result.reportId}` } : {}) }, ["QUEUED", "RUNNING"].includes(state) ? 202 : 200);
  } catch { return json({ ok: false, code: "STORAGE_UNAVAILABLE", message: "발행 상태를 확인 중입니다." }, 503); }
}
