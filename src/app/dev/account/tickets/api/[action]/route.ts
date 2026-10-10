import { NextRequest, NextResponse } from "next/server";
import { localAccountAllowed } from "../../../../../../lib/account/gate";
async function handle(request: NextRequest, context: { params: Promise<{ action: string }> }) {
  if (!localAccountAllowed(request)) return new NextResponse(null, { status: 404 });
  try { const { handleLocalBundle } = await import("../../../../../../lib/tickets/bundleLocalReview"); return await handleLocalBundle(request, (await context.params).action); }
  catch { return NextResponse.json({ ok: false, code: "LOCAL_STORAGE_UNAVAILABLE" }, { status: 503 }); }
}
export const GET = handle;
export const POST = handle;
