import { NextResponse } from "next/server";
/**
 * AM 4부 「1장 먼저 읽기」(결제 책 · W3 P2부터 이용권 책도): 주인 확인(책 열람과 같은 canReadPurchasedBook · 이용권 접수 주인) 뒤에만 1장 미리보기를 돌려준다.
 * 미리보기는 장이 저장될 때 결정론 정리·검사(호출 0)로 사실·금지 규칙 문장을 가린 것이다. 완성되면 최종본이 대신한다.
 */
export const dynamic = "force-dynamic";
export async function GET(_request: Request, context: { params: Promise<{ reportId: string }> }) {
  const reportId = (await context.params).reportId ?? "";
  const headers = { "cache-control": "no-store" };
  if (!/^report_[a-z0-9]{13,64}$/.test(reportId)) return NextResponse.json({ ok: false }, { status: 400, headers });
  const { canReadPurchasedBook, ownedPendingTicketRedemption, purchaserOf } = await import("../../../../../lib/book/ownerAccess");
  const { createOpsStores } = await import("../../../../../lib/ops/store");
  // W3 P2: 만드는 중인 이용권 책도 같은 대기 화면에서 1장을 먼저 읽는다 — 로그인한 주인의 접수일 때만(장 저장 행은 접수 id로 읽는다).
  const redemptionId = await ownedPendingTicketRedemption(reportId);
  if (redemptionId) {
    const t = await createOpsStores().progress.call("read", { redemptionId });
    return NextResponse.json(t.ok === true && t.first ? { ok: true, chapter: t.first } : { ok: false }, { headers });
  }
  // 완성된 책은 열람과 같은 확인. 생성 중인 책은 claim_report_account가 늘 unavailable이라(AM 7부 로컬 실화면에서 403) 구매 묶음으로 확인한다(am_writer_progress owner).
  const finished = await canReadPurchasedBook(reportId);
  const who = finished ? { userId: null, claimHash: null } : await purchaserOf(reportId);
  if (!finished && !who.userId && !who.claimHash) return NextResponse.json({ ok: false }, { status: 403, headers });
  const p = await createOpsStores().progress.call("read", { reportId, ...who });
  if (!finished && p.owner !== true) return NextResponse.json({ ok: false }, { status: 403, headers });
  return NextResponse.json(p.ok === true && p.first ? { ok: true, chapter: p.first } : { ok: false }, { headers });
}
