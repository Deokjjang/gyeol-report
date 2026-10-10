import { NextResponse } from "next/server";
import { bookExperiencePublicEnabled } from "../../../lib/book/publicGate";
import { accountPublicEnabled } from "../../../lib/account/gate";
export const dynamic = "force-dynamic";
export async function GET() {
  if (!bookExperiencePublicEnabled() || !accountPublicEnabled()) return new Response(null, { status: 404 });
  const { measurementStore } = await import("../../../lib/analytics/server");
  const { launchEventView } = await import("../../../lib/growth/launchServer");
  const event = await launchEventView(measurementStore());
  return NextResponse.json(event, { status: event ? 200 : 503, headers: { "cache-control": "no-store" } });
}
