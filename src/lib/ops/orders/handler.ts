import { NextResponse, type NextRequest } from "next/server";
import type { AccountPort } from "../../account/handler";
import { accountSession } from "../../account/policy";
import { opsOriginAllowed, opsSameOrigin } from "../origin";
import type { OpsStores } from "../store";
import { isRequestReason, publicSummary } from "./summary";

/**
 * 고객 구매 내역·문의(P6d-ops 4). GET: 회원 구매 내역 + 제본 중인 이용권 Book. POST {op:"request"}: 주문을 붙인 문의·환불 요청.
 * 비회원은 결제 완료 화면의 토스 orderId + paymentKey로 자기 주문에만 요청할 수 있다.
 */
export async function handleOrders(request: NextRequest, port: AccountPort, ops: Pick<OpsStores, "order" | "audit">): Promise<NextResponse> {
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
    const memo = typeof body.memo === "string" ? body.memo.replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, "").trim().slice(0, 1000) : "";
    let paymentOrderId: string | null = null;
    if (typeof body.providerOrderId === "string" && typeof body.paymentKey === "string" && body.providerOrderId.length <= 120 && body.paymentKey.length <= 200) {
      const found = await ops.order.call("find_paid", { providerOrderId: body.providerOrderId, paymentKey: body.paymentKey });
      paymentOrderId = found.ok ? String(found.paymentOrderId) : null;
    } else if (member && typeof body.orderCode === "string") {
      const mine = await ops.order.call("summary", { userId: member.id });
      const hit = (mine.orders as { orderCode: string; paymentOrderId: string }[] | undefined)?.find(o => o.orderCode === body.orderCode);
      paymentOrderId = hit?.paymentOrderId ?? null;
    }
    if (!paymentOrderId) return json({ ok: false, error: "주문을 확인하지 못했어요. 로그인한 계정 또는 결제 완료 화면에서 요청해 주세요." }, 404);
    const r = await ops.order.call("request", { paymentOrderId, userId: member?.id ?? null, reason: body.reason, memo });
    if (!r.ok) return json({ ok: false, error: r.code === "TOO_MANY_REQUESTS" ? "이미 접수된 요청이 있어요. 확인 후 연락드릴게요." : "요청을 접수하지 못했어요. 잠시 후 다시 시도해 주세요." }, r.code === "TOO_MANY_REQUESTS" ? 429 : 503);
    await ops.audit({ actor: "system", action: "request_created", target: paymentOrderId, detail: { reason: body.reason, member: Boolean(member) } });
    return json({ ok: true, message: "요청을 접수했어요. 영업일 기준 1~2일 안에 이메일로 안내드릴게요." });
  } catch { return json({ ok: false, error: "잠시 후 다시 시도해 주세요." }, 503); }
}
