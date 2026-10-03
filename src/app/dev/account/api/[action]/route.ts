import { NextRequest, NextResponse } from "next/server";
import { localAccountAllowed } from "../../../../../lib/account/gate";

async function handle(request: NextRequest, context: { params: Promise<{ action: string }> }) {
  if (!localAccountAllowed(request)) return new NextResponse(null, { status: 404 });
  const { createLocalAccountPort } = await import("../../../../../lib/account/localReview");
  const original = createLocalAccountPort(request);
  if (!original) return new NextResponse(null, { status: 404 });
  const { localReferralAccount, localReferralStore } = await import("../../../../../lib/referrals/localReview");
  const { withReferralTickets, reconcileReferrals } = await import("../../../../../lib/referrals/service");
  const port = await localReferralAccount(request, original), referrals = await localReferralStore();
  const action = (await context.params).action;
  if (action.startsWith("coupon-")) {
    const { localCouponStore } = await import("../../../../../lib/coupons/localDatabase");
    const { handleLocalCoupons } = await import("../../../../../lib/coupons/handler");
    const store = await localCouponStore();
    return store ? handleLocalCoupons(request,action.slice(7),port,store) : new NextResponse(null,{status:404});
  }
  if (action.startsWith("ticket-")) {
    const { localTicketStore, grantTestReportTickets, failNextLocalTicketPublish } = await import("../../../../../lib/tickets/localDatabase");
    const store = await localTicketStore();
    if (!store) return new NextResponse(null, { status: 404 });
    // Explicit localhost fixture only: fixed scenarios, no arbitrary grant API/UI.
    if (action === "ticket-fixture") {
      const url = new URL(request.url); if (request.headers.get("host")) url.host = request.headers.get("host")!;
      if (request.method !== "POST" || request.headers.get("origin") !== url.origin) return new NextResponse(null, { status: 403 });
      const user = await port.currentUser(), snapshot = user ? await port.read(user) : null;
      const { accountSession } = await import("../../../../../lib/account/policy");
      if (!user || !snapshot || accountSession(user,snapshot).status !== "member") return new NextResponse(null, { status: 401 });
      const raw = await request.text(); if (raw.length > 80) return new NextResponse(null, { status: 400 });
      if (raw === "failure") { failNextLocalTicketPublish(user.id); return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "private, no-store" } }); }
      if (raw !== "one" && raw !== "several") return new NextResponse(null, { status: 400 });
      const result = await grantTestReportTickets(store,user.id,raw);
      return NextResponse.json({ ok: result.ok }, { headers: { "Cache-Control": "private, no-store" } });
    }
    const { handleTickets } = await import("../../../../../lib/tickets/handler");
    return handleTickets(request, action.slice(7), port, referrals ? withReferralTickets(store,referrals) : store);
  }
  if (action.startsWith("library-")) {
    const { handleLibrary } = await import("../../../../../lib/library/server");
    const { createLocalLibraryPort } = await import("../../../../../lib/library/localReview");
    const { withLocalCouponLibrary } = await import("../../../../../lib/coupons/localDatabase");
    const library = withLocalCouponLibrary(createLocalLibraryPort());
    const { localTicketStore } = await import("../../../../../lib/tickets/localDatabase");
    return handleLibrary(request, action.slice(8), port, { ...library, async list(user) {
      if (referrals) await reconcileReferrals(referrals,user);
      const paid = await library.list(user), tickets = await (await localTicketStore())?.call("library", user);
      const { listLocalCouponBooks } = await import("../../../../../lib/coupons/localDatabase");
      const { localTicketUserId } = await import("../../../../../lib/tickets/localDatabase");
      const coupons = await listLocalCouponBooks(localTicketUserId(user));
      const { localBookShareDatabase } = await import("../../../../../lib/book/shareLocalReview");
      const db = await localBookShareDatabase();
      const shared = db ? (await db.query<{items: import("../../../../../lib/library/model").LibraryRow[]}>("select list_account_reports($1) items",[localTicketUserId(user)])).rows[0].items : [];
      return paid && tickets?.ok && Array.isArray(tickets.items) ? [...paid, ...tickets.items, ...coupons, ...shared] : null;
    } }, true);
  }
  const { handleAccount } = await import("../../../../../lib/account/handler");
  return handleAccount(request, action, port, true);
}
export const GET = handle;
export const POST = handle;
