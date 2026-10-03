import { NextRequest } from "next/server";
import { localAccountAllowed } from "../../../../lib/account/gate";
import { measurementOrigin } from "../../../../lib/analytics/server";
// Explicit local fixture edits, no arbitrary configuration or reward grant.
export async function POST(request: NextRequest) {
  if (!localAccountAllowed(request)) return new Response(null, { status: 404 });
  if (!measurementOrigin(request,true)) return new Response(null, { status: 403 });
  const scenario = await request.text();
  if (!["countdown", "short", "extend", "long-copy"].includes(scenario)) return new Response(null, { status: 400 });
  const { localMeasurementDatabase } = await import("../../../../lib/analytics/localReview");
  const db = await localMeasurementDatabase(); if (!db) return new Response(null, { status: 503 });
  if (scenario === "countdown") await db.exec("update growth_campaigns set ends_at=clock_timestamp()+interval '1 hour' where public_slug in ('book-ticket','book-coupon')");
  if (scenario === "short") await db.exec("update growth_campaigns set ends_at=clock_timestamp()+interval '10 seconds' where public_slug='book-none'");
  if (scenario === "extend") await db.exec("update growth_campaigns set ends_at=clock_timestamp()+interval '1 hour' where public_slug='book-none'");
  if (scenario === "long-copy") await db.exec("update growth_campaigns set message='내가 어떤 사람인지, 어떤 일과 사랑이 나에게 맞는지, 앞으로의 시간이 궁금해지는 날에 펼쳐보는 한 권의 책' where public_slug='book-none'");
  return Response.json({ok:true},{headers:{"cache-control":"no-store"}});
}
