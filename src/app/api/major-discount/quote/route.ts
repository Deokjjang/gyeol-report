import { NextResponse } from "next/server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
/**
 * AM 3부 세운 → 대운 이어 보기: 세운 책 주인이 대운 결제 화면으로 바로 가도록 할인 판정과 세운 입력(같은 사람)을 돌려준다.
 * 금액은 표시용일 뿐이다 — 결제 준비가 같은 판정을 다시 하고 서버 금액으로 주문을 만든다.
 */
export async function GET(request: Request) {
  const from = new URL(request.url).searchParams.get("from") ?? "";
  if (!/^report_[a-z0-9]{13,64}$/.test(from)) return NextResponse.json({ ok: false, code: "INVALID" }, { status: 400, headers: { "cache-control": "no-store" } });
  const { createOpsStores } = await import("../../../../lib/ops/store");
  const { resolveBuyer, accountPortFor } = await import("../../../../lib/ops/orders/buyer");
  const { createAccountPort } = await import("../../../../lib/account/supabase");
  const { accountPublicEnabled } = await import("../../../../lib/account/gate");
  const ops = createOpsStores();
  const resolved = await resolveBuyer(request, undefined, { port: accountPublicEnabled() ? accountPortFor(request, createAccountPort) : null, account: ops.account });
  const userId = resolved.ok ? resolved.buyer.userId : null;
  const { quoteMajorDiscount } = await import("../../../../lib/payment/majorDiscount");
  const { reportPriceKrw } = await import("../../../../lib/payment/reportProductCatalog");
  const q = await quoteMajorDiscount(ops.discount, { annualReportId: from, userId, price: reportPriceKrw("major_fortune") });
  if (!q.ok) return NextResponse.json({ ok: false, code: q.code, message: q.message }, { status: 409, headers: { "cache-control": "no-store" } });
  const input = q.input as { person?: unknown; userContext?: unknown };
  return NextResponse.json({ ok: true, amount: q.amount, original: q.original, rate: q.rate, until: q.until, person: input.person ?? null, userContext: input.userContext ?? null }, { headers: { "cache-control": "no-store" } });
}
