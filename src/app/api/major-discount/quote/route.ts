import { NextResponse } from "next/server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
/**
 * AM2-14 4부 세운 → 대운 반값(표시용 판정 — 쓰기 없음): 이 계정에 안 쓴 자격이 있으면 반값 금액과(세운 책에서 왔으면) 그 세운의 입력을 돌려준다.
 * from = 세운 책 id(서재 카드) 또는 "annual"(책 끝 · 대운 결제 화면 — 책 id를 링크에 싣지 않는다). 입력 미리 채우기는 화면이 링크로 왔을 때만 쓴다. 금액은 표시용 — 결제 준비가 같은 판정을 다시 하고 서버 금액으로 주문을 만든다.
 */
export async function GET(request: Request) {
  const from = new URL(request.url).searchParams.get("from") ?? "annual";
  if (from !== "annual" && !/^report_[a-z0-9]{13,64}$/.test(from)) return NextResponse.json({ ok: false, code: "INVALID" }, { status: 400, headers: { "cache-control": "no-store" } });
  const { createOpsStores } = await import("../../../../lib/ops/store");
  const { resolveBuyer, accountPortFor } = await import("../../../../lib/ops/orders/buyer");
  const { createAccountPort } = await import("../../../../lib/account/supabase");
  const { accountPublicEnabled } = await import("../../../../lib/account/gate");
  const ops = createOpsStores();
  const resolved = await resolveBuyer(request, undefined, { port: accountPublicEnabled() ? accountPortFor(request, createAccountPort) : null, account: ops.account });
  const userId = resolved.ok ? resolved.buyer.userId : null;
  const { createHalfPort, quoteHalf } = await import("../../../../lib/payment/majorDiscount");
  const q = await quoteHalf(createHalfPort(ops.db), { userId, from });
  if (!q.ok) return NextResponse.json({ ok: false, code: q.code, message: q.message }, { status: 409, headers: { "cache-control": "no-store" } });
  const input = (q.input ?? {}) as { person?: unknown; userContext?: unknown };
  return NextResponse.json({ ok: true, amount: q.amount, original: q.original, person: input.person ?? null, userContext: input.userContext ?? null }, { headers: { "cache-control": "no-store" } });
}
