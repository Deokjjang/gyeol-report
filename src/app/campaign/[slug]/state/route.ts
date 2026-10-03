import { NextRequest, NextResponse } from "next/server";
import { bookExperiencePublicEnabled } from "../../../../lib/book/publicGate";
import { accountPublicEnabled } from "../../../../lib/account/gate";
export const dynamic = "force-dynamic";
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!bookExperiencePublicEnabled() || !accountPublicEnabled()) return new Response(null, { status: 404 });
  const { createAccountPort } = await import("../../../../lib/account/supabase");
  const { measurementStore } = await import("../../../../lib/analytics/server");
  const { campaignView } = await import("../../../../lib/growth/presentation");
  const user = await createAccountPort(request)?.currentUser();
  const c = await campaignView(measurementStore(), (await params).slug, user?.id ?? null);
  return NextResponse.json(c, { status: c ? 200 : 404, headers: { "cache-control": "no-store" } });
}
