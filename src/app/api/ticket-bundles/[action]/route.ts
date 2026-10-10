import { NextResponse } from "next/server";
import { ticketBundleCommerceEnabled } from "../../../../lib/tickets/bundleCatalog";

export const runtime = "nodejs";
// Foundation only. No provider/auth/DB construction, no query/env/cookie bypass.
// COMMERCE-03/04 must wire the reviewed handler + dedicated return URLs after
// bundle purchase consent/refund policy and Production approval. Never use the
// direct-report success callback for ticket orders.
function unavailable() {
  void ticketBundleCommerceEnabled();
  return new NextResponse(null, { status: 404, headers: { "Cache-Control": "private, no-store" } });
}
export const GET = unavailable;
export const POST = unavailable;
