import { NextResponse } from "next/server";
/**
 * AM 4부 「1장 먼저 읽기」(결제 책): 주인 확인(책 열람과 같은 canReadPurchasedBook) 뒤에만 1장 미리보기를 돌려준다.
 * 미리보기는 장이 저장될 때 결정론 정리·검사(호출 0)로 사실·금지 규칙 문장을 가린 것이다. 완성되면 최종본이 대신한다.
 */
export const dynamic = "force-dynamic";
export async function GET(_request: Request, context: { params: Promise<{ reportId: string }> }) {
  const reportId = (await context.params).reportId ?? "";
  const headers = { "cache-control": "no-store" };
  if (!/^report_[a-z0-9]{13,64}$/.test(reportId)) return NextResponse.json({ ok: false }, { status: 400, headers });
  const { canReadPurchasedBook } = await import("../../../../../lib/book/ownerAccess");
  if (!(await canReadPurchasedBook(reportId))) return NextResponse.json({ ok: false }, { status: 403, headers });
  const { createOpsStores } = await import("../../../../../lib/ops/store");
  const p = await createOpsStores().progress.call("read", { reportId });
  return NextResponse.json(p.ok === true && p.first ? { ok: true, chapter: p.first } : { ok: false }, { headers });
}
