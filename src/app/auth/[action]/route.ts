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
  if (!original) return NextResponse.json({ error: "로그인 준비 중입니다. 로그인 없이 계속할 수 있습니다." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  if (ticketPublication) {
    const { handleTicketPublication } = await import("../../../lib/tickets/publicHandler");
    const { createTicketPublicationStore } = await import("../../../lib/tickets/supabase");
    try { return await handleTicketPublication(request, action.slice(7), original, createTicketPublicationStore()); }
    catch { return original.finish(NextResponse.json({ ok: false, code: "STORAGE_UNAVAILABLE", message: "발행 상태를 확인 중입니다." }, { status: 503, headers: { "Cache-Control": "private, no-store" } })); }
  }
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
export const GET = handle;
export const POST = handle;
