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
  if (!original) return NextResponse.json({ code: "ACCOUNT_CONFIG_UNAVAILABLE", error: "로그인 준비 중입니다. 로그인 없이 계속할 수 있습니다." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  if (ticketPublication) {
    const { handleTicketPublication } = await import("../../../lib/tickets/publicHandler");
    const { createTicketPublicationStore } = await import("../../../lib/tickets/supabase");
    try { return await handleTicketPublication(request, action.slice(7), original, createTicketPublicationStore()); }
    catch { return original.finish(NextResponse.json({ ok: false, code: "STORAGE_UNAVAILABLE", message: "발행 상태를 확인 중입니다." }, { status: 503, headers: { "Cache-Control": "private, no-store" } })); }
  }
  if (action === "profile" || action === "withdraw" || action === "gift" || action === "orders" || action === "comp") return opsAccountAction(request, action, original);
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
  return handleAccount(request, action, port);
}
/** P6d-ops: 가입 정보·탈퇴·선물(회원 본인 요청). */
async function opsAccountAction(request: NextRequest, action: "profile" | "withdraw" | "gift" | "orders" | "comp", port: NonNullable<ReturnType<typeof import("../../../lib/account/supabase").createAccountPort>>) {
  const { createOpsStores } = await import("../../../lib/ops/store");
  const ops = createOpsStores();
  if (action === "orders") {
    const { handleOrders } = await import("../../../lib/ops/orders/handler");
    return handleOrders(request, port, ops);
  }
  if (action === "comp") {
    const { handleComp } = await import("../../../lib/ops/comp/handler");
    return handleComp(request, port, ops);
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
