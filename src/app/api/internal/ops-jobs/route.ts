import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";

// P6d-ops 운영 크론(5분): ① 정식본 교체 레인(임시본 → Sonnet 정식본, 관리자 재생성) ② 환불 처리·재확인(토스 취소, 같은 Idempotency-Key)
// ③ 이벤트 이용권 발급(결제 완료 화면을 못 본 주문) ④ 열람 기한 지난 보관본·장 원고 정리 ⑤ 작가 원문 작업용 사본 30일 정리(최종 A-18). 각 단계 실패는 다음 단계를 막지 않는다.
export const runtime = "nodejs";
export const maxDuration = 800;
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET, actual = request.headers.get("authorization") ?? "", expected = `Bearer ${secret ?? ""}`;
  if (!secret || Buffer.byteLength(actual) !== Buffer.byteLength(expected) || !timingSafeEqual(Buffer.from(actual), Buffer.from(expected))) return NextResponse.json({ ok: false }, { status: 401 });
  const startedAt = Date.now();
  const { createOpsStores } = await import("../../../../lib/ops/store");
  const ops = createOpsStores();
  const out: Record<string, unknown> = {};
  try {
    const tossSecret = process.env.TOSS_PAYMENTS_SECRET_KEY;
    if (tossSecret) {
      const { processRefunds } = await import("../../../../lib/ops/orders/refund");
      const { createTossRefundProvider } = await import("../../../../lib/payment/tossRefundClient");
      out.refunds = await processRefunds({ order: ops.order, audit: e => ops.audit(e) }, createTossRefundProvider(tossSecret, fetch), { maxJobs: 3 });
    } else out.refunds = "TOSS_SECRET_MISSING";
  } catch { out.refunds = "error"; }
  try {
    const { giftEventConfig } = await import("../../../../lib/ops/config");
    const cfg = giftEventConfig();
    if (cfg.active) {
      const { afterPaidOrder } = await import("../../../../lib/ops/gift/service");
      const pending = await ops.gift.call("pending_orders", { start: cfg.start, end: cfg.end });
      const ids = Array.isArray(pending.orders) ? pending.orders as string[] : [];
      for (const id of ids) await afterPaidOrder(ops.gift, id, cfg);
      out.gifts = ids.length;
    } else out.gifts = "EVENT_OFF";
  } catch { out.gifts = "error"; }
  try { out.purge = (await ops.generation.call("purge", {})).ok === true; } catch { out.purge = "error"; }
  // 최종 A-18: 작가 원문 작업용 사본 정리(발행 30일 뒤·실패는 처리 완료 30일 뒤).
  try { const r = await ops.raw.call("raw_purge", {}); out.rawPurge = r.ok === true ? (r.deleted ?? 0) : "fail"; } catch { out.rawPurge = "error"; }
  try {
    const { runLaneBatch } = await import("../../../../lib/ops/generation/supervisor");
    // HOTFIX-W1 6: 앞 단계(환불·이용권·정리)가 쓴 시간을 빼고 작가 예산을 준다(maxDuration 800초 − 조립·발행 60초 몫, 최대 700초).
    out.lane = await runLaneBatch({ store: ops.generation, laneBudgetMs: () => Math.max(60_000, Math.min(700_000, maxDuration * 1000 - (Date.now() - startedAt) - 60_000)) });
  } catch { out.lane = "error"; }
  return NextResponse.json({ ok: true, ...out }, { headers: { "Cache-Control": "no-store" } });
}
