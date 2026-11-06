import { NextRequest, NextResponse } from "next/server";
import { accountPublicEnabled } from "../../../lib/account/gate";
import { bookExperiencePublicEnabled } from "../../../lib/book/publicGate";

async function handle(request: NextRequest, context: { params: Promise<{ action: string }> }) {
  if (!accountPublicEnabled()) return new NextResponse(null, { status: 404 });
  const action = (await context.params).action;
  const ticketPublication = action === "ticket-redeem" || action === "ticket-status";
  if (ticketPublication && !bookExperiencePublicEnabled()) return new NextResponse(null, { status: 404 });
  const { createAccountPort } = await import("../../../lib/account/supabase");
  const original = createAccountPort(request);
  if (!original) return NextResponse.json({ code: "ACCOUNT_CONFIG_UNAVAILABLE", error: "로그인 준비 중이에요. 잠시 후 다시 시도해 주세요." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  if (ticketPublication) {
    const { handleTicketPublication } = await import("../../../lib/tickets/publicHandler");
    const { createTicketPublicationStore } = await import("../../../lib/tickets/supabase");
    try { return await handleTicketPublication(request, action.slice(7), original, createTicketPublicationStore()); }
    catch { return original.finish(NextResponse.json({ ok: false, code: "STORAGE_UNAVAILABLE", message: "발행 상태를 확인 중입니다." }, { status: 503, headers: { "Cache-Control": "private, no-store" } })); }
  }
  if (action === "event-popup") {
    // 최종 A 14: 메인·상품 화면 팝업(읽기 전용, 보상 정보는 회원 본인에게만).
    const { handleEventPopup, compCampaignStore } = await import("../../../lib/ops/comp/popup");
    const { createOpsStores } = await import("../../../lib/ops/store");
    return handleEventPopup(request, original, compCampaignStore(createOpsStores().db));
  }
  if (action === "library-home") {
    // P 속도: 서재 한 번에 받기(로그인 확인 1번 + 조회 4개 동시).
    const { handleLibraryHome } = await import("../../../lib/library/home");
    const { createLibraryPort } = await import("../../../lib/library/supabase");
    const { createOpsStores } = await import("../../../lib/ops/store");
    return handleLibraryHome(request, original, createLibraryPort(), createOpsStores());
  }
  // P 추가 F: 서재의 옛 보상 안내 한 줄(/auth/comp, ops_comp 'sync' 꺼짐 표시)은 없앴다 — 보상 이용권은 서재 이용권 줄·팝업 ②③이 보여 준다.
  if (action === "profile" || action === "withdraw" || action === "gift" || action === "orders") return opsAccountAction(request, action, original);
  const { createReferralStore } = await import("../../../lib/referrals/supabase");
  const { withReferralTickets } = await import("../../../lib/referrals/service");
  const { withAcquisitionAccount, withCampaignTickets } = await import("../../../lib/growth/service");
  const { createCampaignStore } = await import("../../../lib/growth/supabase");
  const referrals = createReferralStore(), campaigns=createCampaignStore(), port = withAcquisitionAccount(request,original,campaigns,referrals);
  if (action === "ticket-summary" || action === "ticket-history") {
    const { handleTickets } = await import("../../../lib/tickets/handler");
    const { createTicketStore } = await import("../../../lib/tickets/supabase");
    return handleTickets(request, action.slice(7), port, withCampaignTickets(withReferralTickets(createTicketStore(),referrals),campaigns));
  }
  if (action.startsWith("library-")) {
    const { handleLibrary } = await import("../../../lib/library/server");
    const { createLibraryPort } = await import("../../../lib/library/supabase");
    return handleLibrary(request, action.slice(8), port, createLibraryPort());
  }
  const { handleAccount } = await import("../../../lib/account/handler");
  if (action !== "session") return handleAccount(request, action, port);
  // 재동의 화면 맨 위 한 줄(P 본문 3): 안 쓴 보상 이용권이 있는 기존 회원에게만(읽기 전용 ops_comp_campaign 'popup').
  const { compCampaignStore } = await import("../../../lib/ops/comp/popup");
  const { createOpsStores } = await import("../../../lib/ops/store");
  return handleAccount(request, action, port, false, { compWaiting: async userId => {
    const r = await compCampaignStore(createOpsStores().db).call("popup", { userId });
    return r.ok === true && typeof r.unused === "number" && r.unused > 0 && typeof r.expiresAt === "string" && Date.parse(r.expiresAt) > Date.now();
  } });
}
/** P6d-ops: 가입 정보·탈퇴·선물(회원 본인 요청). */
async function opsAccountAction(request: NextRequest, action: "profile" | "withdraw" | "gift" | "orders", port: NonNullable<ReturnType<typeof import("../../../lib/account/supabase").createAccountPort>>) {
  const { createOpsStores } = await import("../../../lib/ops/store");
  const ops = createOpsStores();
  if (action === "orders") {
    const { handleOrders } = await import("../../../lib/ops/orders/handler");
    return handleOrders(request, port, ops);
  }
  if (action === "gift") {
    const { handleGift } = await import("../../../lib/ops/gift/handler");
    return handleGift(request, port, ops);
  }
  const { handleProfile } = await import("../../../lib/account/profile");
  const { kakaoUnlink } = await import("../../../lib/account/kakaoLogin");
  return handleProfile(request, action, port, {
    ops: ops.account, audit: e => ops.audit(e),
    unlinkKakao: id => kakaoUnlink(id, process.env.KAKAO_ADMIN_KEY),
    deleteUser: async id => { if (!ops.db) return false; const { error } = await ops.db.auth.admin.deleteUser(id, true); return !error; },
  });
}
export const GET = handle;
export const POST = handle;
