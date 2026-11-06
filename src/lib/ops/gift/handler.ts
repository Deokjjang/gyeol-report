import { NextResponse, type NextRequest } from "next/server";
import type { AccountPort } from "../../account/handler";
import { accountSession } from "../../account/policy";
import { giftEventConfig } from "../config";
import { opsOriginAllowed, opsSameOrigin } from "../origin";
import type { OpsStores } from "../store";
import { giftTokenHash, newGiftToken, validGiftToken } from "./service";

const messages: Record<string, string> = {
  GIFT_NOT_FOUND: "선물 링크를 찾지 못했어요. 주소가 맞는지 확인해 주세요. 보낸 분의 주문이 환불되어 선물이 회수됐을 수도 있어요.", GIFT_USED: "이미 사용했거나 받은 선물이에요.", GIFT_EXPIRED: "선물 기간이 지났어요.",
  GIFT_SELF: "내가 보낸 선물은 받을 수 없어요. 링크를 친구에게 보내 주세요.", PROFILE_REQUIRED: "선물을 받으려면 가입 정보(이름·이메일)를 먼저 입력해 주세요.",
  MEMBER_REQUIRED: "로그인한 뒤 받을 수 있어요.", GIFT_LINK_ONLY: "이 이용권은 친구에게 선물하는 용도예요. 선물 링크를 만들어 보내 주세요.", GRANT_FAILED: "이용권을 넣지 못했어요. 잠시 후 다시 시도해 주세요.",
};

/** 이벤트 이용권(P6d-ops 6). GET: 내 이벤트 이용권 목록(+ ?token= 선물 확인), POST {op}: use_self·link·claim. */
export async function handleGift(request: NextRequest, port: AccountPort, ops: Pick<OpsStores, "gift">): Promise<NextResponse> {
  const json = (body: object, status = 200) => port.finish(NextResponse.json(body, { status, headers: { "Cache-Control": "private, no-store", Vary: "Cookie", "Referrer-Policy": "no-referrer" } }));
  if (!["GET", "POST"].includes(request.method)) return json({}, 405);
  if (request.method === "POST" ? !opsSameOrigin(request) : !opsOriginAllowed(request)) return json({}, 403);
  try {
    const user = await port.currentUser();
    const snapshot = user ? await port.read(user) : null;
    const member = user && snapshot && accountSession(user, snapshot).status === "member" ? user : null;
    const cfg = giftEventConfig();
    if (request.method === "GET") {
      const token = new URL(request.url).searchParams.get("token");
      if (token !== null) {
        if (!validGiftToken(token)) return json({ ok: false, code: "GIFT_NOT_FOUND", message: messages.GIFT_NOT_FOUND }, 404);
        const peek = await ops.gift.call("peek", { tokenHash: giftTokenHash(token), userId: member?.id ?? "" });
        return json(peek.ok ? { ok: true, status: peek.status, expiresAt: peek.expiresAt, mine: peek.mine === true, received: peek.received === true, member: Boolean(member), profile: snapshot?.contact ? "complete" : "required" } : { ok: false, code: peek.code, message: messages[String(peek.code)] ?? messages.GIFT_NOT_FOUND }, peek.ok ? 200 : 404);
      }
      if (!member) return json({ ok: false, code: "MEMBER_REQUIRED" }, 401);
      const list = await ops.gift.call("list", { userId: member.id });
      return json({ ok: list.ok === true, gifts: list.gifts ?? [], event: { active: cfg.active, end: cfg.end, maxPerAccount: cfg.maxPerAccount } });
    }
    const raw = await request.text();
    if (raw.length > 2048) return json({}, 413);
    let body: Record<string, unknown>; try { body = JSON.parse(raw); } catch { return json({}, 400); }
    if (!member) return json({ ok: false, code: "MEMBER_REQUIRED", message: messages.MEMBER_REQUIRED }, 401);
    const id = typeof body.giftId === "string" && /^[0-9a-f-]{36}$/i.test(body.giftId) ? body.giftId : null;
    if (body.op === "use_self" && id) { const r = await ops.gift.call("use_self", { userId: member.id, giftId: id }); return json(r.ok ? { ok: true, status: r.status } : { ok: false, code: r.code, message: messages[String(r.code)] ?? "처리하지 못했어요." }, r.ok ? 200 : 409); }
    if (body.op === "link" && id) {
      const t = newGiftToken();
      const r = await ops.gift.call("link", { userId: member.id, giftId: id, tokenHash: t.hash });
      return json(r.ok ? { ok: true, url: `/gift/${t.token}` } : { ok: false, code: r.code, message: messages[String(r.code)] ?? "처리하지 못했어요." }, r.ok ? 200 : 409);
    }
    if (body.op === "claim" && validGiftToken(body.token)) {
      const r = await ops.gift.call("claim", { userId: member.id, tokenHash: giftTokenHash(body.token) });
      return json(r.ok ? { ok: true, status: r.status } : { ok: false, code: r.code, message: messages[String(r.code)] ?? "받지 못했어요." }, r.ok ? 200 : r.code === "PROFILE_REQUIRED" ? 403 : 409);
    }
    return json({}, 400);
  } catch { return json({ ok: false, code: "STORAGE_UNAVAILABLE", message: "잠시 후 다시 시도해 주세요." }, 503); }
}
