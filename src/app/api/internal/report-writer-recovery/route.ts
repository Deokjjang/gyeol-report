import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { bookExperiencePublicEnabled } from "../../../../lib/book/publicGate";
import { accountPublicEnabled } from "../../../../lib/account/gate";
import { writerV5Products } from "../../../../lib/writer/flags";

// 회수 크론(P3): 작가 lease가 끝난 v5 작업을 저장된 장 + 결정론 작가로 완성한다(LLM 호출 0). 플래그가 비면 아무것도 하지 않는다.
export const runtime = "nodejs";
export const maxDuration = 300;
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET, actual = request.headers.get("authorization") ?? "", expected = `Bearer ${secret ?? ""}`;
  if (!secret || Buffer.byteLength(actual) !== Buffer.byteLength(expected) || !timingSafeEqual(Buffer.from(actual), Buffer.from(expected))) return NextResponse.json({ ok: false }, { status: 401 });
  if (!bookExperiencePublicEnabled() || !accountPublicEnabled() || !writerV5Products().length) return new NextResponse(null, { status: 404 });
  try {
    const { createTicketPublicationStore } = await import("../../../../lib/tickets/supabase");
    const { runV5RecoveryBatch } = await import("../../../../lib/writer/ticketJob");
    const result = await runV5RecoveryBatch(createTicketPublicationStore());
    return NextResponse.json({ ok: result.ok, processed: result.processed }, { status: result.ok ? 200 : 503, headers: { "Cache-Control": "no-store" } });
  } catch { return NextResponse.json({ ok: false }, { status: 503 }); }
}
