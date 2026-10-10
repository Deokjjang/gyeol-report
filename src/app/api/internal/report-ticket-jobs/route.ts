import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { bookExperiencePublicEnabled } from "../../../../lib/book/publicGate";
import { accountPublicEnabled } from "../../../../lib/account/gate";

export const runtime = "nodejs";
export const maxDuration = 300;
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET, actual = request.headers.get("authorization") ?? "", expected = `Bearer ${secret ?? ""}`;
  if (!secret || Buffer.byteLength(actual) !== Buffer.byteLength(expected) || !timingSafeEqual(Buffer.from(actual), Buffer.from(expected))) return NextResponse.json({ ok: false }, { status: 401 });
  if (!bookExperiencePublicEnabled() || !accountPublicEnabled()) return new NextResponse(null, { status: 404 });
  try {
    const { createTicketPublicationStore } = await import("../../../../lib/tickets/supabase");
    const { runTicketPublicationBatch } = await import("../../../../lib/tickets/publicationWorker");
    const result = await runTicketPublicationBatch(createTicketPublicationStore());
    return NextResponse.json({ ok: result.ok }, { status: result.ok ? 200 : 503, headers: { "Cache-Control": "no-store" } });
  } catch { return NextResponse.json({ ok: false }, { status: 503 }); }
}
