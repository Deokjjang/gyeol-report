import { NextRequest, NextResponse } from "next/server";
import { ticketShopEnabled } from "../../../../lib/tickets/shopGate";
import { publicRequestOrigin } from "../../../../lib/account/origin";

export const runtime = "nodejs";
async function handle(request: NextRequest, context: { params: Promise<{ action: string }> }) {
  if (!ticketShopEnabled()) return new NextResponse(null, { status: 404, headers: { "Cache-Control": "private, no-store" } });
  const origin = publicRequestOrigin(request);
  if (!origin) return new NextResponse(null, { status: 403 });
  const { createAccountPort } = await import("../../../../lib/account/supabase");
  const { createBundleStore, createRefundStore } = await import("../../../../lib/tickets/bundleSupabase");
  const { createTicketStore } = await import("../../../../lib/tickets/supabase");
  const { handleBundleCommerce } = await import("../../../../lib/tickets/bundleHandler");
  const { confirmTossBundlePayment, lookupTossBundleOrder } = await import("../../../../lib/payment/tossConfirmClient");
  try {
    const auth = createAccountPort(request);
    if (!auth) return NextResponse.json({ ok: false }, { status: 503 });
    return await handleBundleCommerce(request, (await context.params).action, auth, createBundleStore(),
      (input, recovery) => confirmTossBundlePayment({ ...input, secretKey: process.env.TOSS_PAYMENTS_SECRET_KEY ?? "" }, recovery),
      { clientKey: process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY ?? "", successUrl: `${origin}/account/tickets/checkout/success`, failUrl: `${origin}/account/tickets/checkout/fail` }, {
        tickets: createTicketStore(),
        refunds: createRefundStore(),
        lookup: order => lookupTossBundleOrder({ orderId: order.providerOrderId, amount: order.amount, secretKey: process.env.TOSS_PAYMENTS_SECRET_KEY ?? "" }),
      });
  } catch { return NextResponse.json({ ok: false, code: "STORAGE_UNAVAILABLE" }, { status: 503, headers: { "Cache-Control": "private, no-store" } }); }
}
export const GET = handle;
export const POST = handle;
