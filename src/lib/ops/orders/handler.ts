import { NextResponse, type NextRequest } from "next/server";
import type { AccountPort } from "../../account/handler";
import { accountSession } from "../../account/policy";
import { REQUEST_COPY } from "../../legal/socialLinks";
import { uaSummary } from "../notify/render";
import { opsOriginAllowed, opsSameOrigin } from "../origin";
import type { OpsStores } from "../store";
import { isRequestReason, publicSummary } from "./summary";

/**
 * 고객 구매 내역·문의(P6d-ops 4 → 운영 Q 2부). GET: 회원 구매 내역 + 제본 중인 이용권 Book. POST {op:"request"}: 주문(또는 이용권 책)을 붙인 문의.
 * - 사유는 둘만: not_open(책이 안 나오거나 안 열려요) · double_paid(같은 걸 두 번 결제했어요). 계산 문의는 화면이 카카오톡 채널로 보낸다.
 * - 접수할 때 기기·브라우저(user agent 요약)만 자동으로 붙인다. 메모 칸은 없앴다(개인정보 없음).
 * - 주문·책마다 열린 요청 1개, 계정당 하루 3건, 결제 30분 안 만드는 중이면 접수하지 않음, 두 번 결제는 서버가 찾은 경우만 — 모두 DB(ops_notify 'submit')가 판정한다.
 * 비회원은 결제 완료 화면의 토스 orderId + paymentKey로 자기 주문에만 요청할 수 있다.
 */
const REPORT_ID_RE = /^report_[A-Za-z0-9_-]{8,112}$/;
const SUBMIT_ERRORS: Record<string, [number, string, Record<string, unknown>?]> = {
  MAKING: [409, REQUEST_COPY.making, { making: true }],
  NO_DOUBLE: [409, REQUEST_COPY.noDouble, { channel: true }],
  ALREADY_OPEN: [409, "이미 접수된 요청이 있어요. 확인 후 이 책 카드에서 결과를 알려 드릴게요.", { submitted: true }],
  DAILY_LIMIT: [429, REQUEST_COPY.dailyLimit, { channel: true }],
  ORDER_NOT_FOUND: [404, "주문을 확인하지 못했어요. 로그인한 계정 또는 결제 완료 화면에서 요청해 주세요."],
  TARGET_REQUIRED: [404, "주문을 확인하지 못했어요. 로그인한 계정 또는 결제 완료 화면에서 요청해 주세요."],
  REASON_INVALID: [400, "문의 사유를 골라 주세요."],
};
export async function handleOrders(request: NextRequest, port: AccountPort, ops: Pick<OpsStores, "order" | "notify" | "audit">): Promise<NextResponse> {
  const json = (body: object, status = 200) => port.finish(NextResponse.json(body, { status, headers: { "Cache-Control": "private, no-store", Vary: "Cookie", "Referrer-Policy": "no-referrer" } }));
  if (!["GET", "POST"].includes(request.method)) return json({}, 405);
  if (request.method === "POST" ? !opsSameOrigin(request) : !opsOriginAllowed(request)) return json({}, 403);
  try {
    const user = await port.currentUser();
    const snapshot = user ? await port.read(user) : null;
    const member = user && snapshot && accountSession(user, snapshot).status === "member" ? user : null;
    if (request.method === "GET") {
      if (!member) return json({ ok: false, code: "MEMBER_REQUIRED" }, 401);
      const [orders, pending] = await Promise.all([ops.order.call("summary", { userId: member.id }), ops.order.call("pending_books", { userId: member.id })]);
      if (!orders.ok) return json({ ok: false, code: "STORAGE_UNAVAILABLE" }, 503);
      return json({ ok: true, orders: (orders.orders as Record<string, unknown>[]).map(publicSummary), pending: pending.ok ? pending.books : [] });
    }
    const raw = await request.text();
    if (raw.length > 4096) return json({}, 413);
    let body: Record<string, unknown>; try { body = JSON.parse(raw); } catch { return json({}, 400); }
    if (body.op !== "request" || !isRequestReason(body.reason)) return json({ ok: false, error: "문의 사유를 골라 주세요." }, 400);
    let paymentOrderId: string | null = null, reportId: string | null = null;
    if (typeof body.providerOrderId === "string" && typeof body.paymentKey === "string" && body.providerOrderId.length <= 120 && body.paymentKey.length <= 200) {
      const found = await ops.order.call("find_paid", { providerOrderId: body.providerOrderId, paymentKey: body.paymentKey });
      paymentOrderId = found.ok ? String(found.paymentOrderId) : null;
    } else if (member && typeof body.orderCode === "string") {
      const mine = await ops.order.call("summary", { userId: member.id });
      const hit = (mine.orders as { orderCode: string; paymentOrderId: string }[] | undefined)?.find(o => o.orderCode === body.orderCode);
      paymentOrderId = hit?.paymentOrderId ?? null;
    } else if (member && typeof body.reportId === "string" && REPORT_ID_RE.test(body.reportId)) {
      reportId = body.reportId; // 이용권 책: 소유는 DB가 이용권 접수 기록(user_id)으로 확인한다.
    }
    if (!paymentOrderId && !reportId) return json({ ok: false, error: SUBMIT_ERRORS.ORDER_NOT_FOUND[1] }, 404);
    const device = uaSummary(request.headers.get("user-agent"));
    const r = await ops.notify.call("submit", { userId: member?.id ?? null, paymentOrderId, reportId, reason: body.reason, device });
    if (r.ok !== true) {
      const [status, error, extra] = SUBMIT_ERRORS[String(r.code)] ?? [503, "요청을 접수하지 못했어요. 잠시 후 다시 시도해 주세요."];
      return json({ ok: false, code: r.code ?? "SUBMIT_FAILED", error, ...(extra ?? {}) }, status);
    }
    await ops.audit({ actor: "system", action: "request_created", target: paymentOrderId ?? reportId!, detail: { reason: body.reason, member: Boolean(member), ...(reportId ? { ticketBook: true } : {}) } });
    return json({ ok: true, submitted: true, message: REQUEST_COPY.accepted });
  } catch { return json({ ok: false, error: "잠시 후 다시 시도해 주세요." }, 503); }
}
