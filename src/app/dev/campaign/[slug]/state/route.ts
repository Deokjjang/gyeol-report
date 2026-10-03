import { NextRequest, NextResponse } from "next/server";
import { localAccountAllowed } from "../../../../../lib/account/gate";
export const dynamic = "force-dynamic";
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!localAccountAllowed(request)) return new Response(null, { status: 404 });
  const { localMeasurementDatabase, sqlMeasurementStore, measurementIdentity } = await import("../../../../../lib/analytics/localReview");
  const { campaignView } = await import("../../../../../lib/growth/presentation");
  const db = await localMeasurementDatabase();
  const c = db ? await campaignView(sqlMeasurementStore(db), (await params).slug, await measurementIdentity(request)) : null;
  return NextResponse.json(c, { status: c ? 200 : 404, headers: { "cache-control": "no-store" } });
}
