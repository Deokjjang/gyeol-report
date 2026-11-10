/**
 * P6e-ops 6 + v5 최종 2-4: 상품 가격은 한 곳(src/lib/payment/reportProductCatalog.ts 의 REPORT_PRICE_KRW)에서만 바뀐다.
 * 승인 때 금액 대조는 "주문을 만들 때 서버가 카탈로그 가격으로 저장한 금액 == 토스 금액" 하나뿐이고, 가격 숫자를 고정한 검사는 없다.
 * 그래서 가격을 바꿔도 바꾸기 전에 만든 주문은 승인되고, 저장 금액과 다른 금액(위조)은 거절된다.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import type { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { preparePaymentCheckoutSession } from "../../../src/lib/payment/paymentCheckoutSessionBoundary";
import { confirmPaidReport } from "../../../src/lib/payment/paidReportReliability";
import type { ReliabilityStore } from "../../../src/lib/payment/paidReportReliabilityStore";
import { recoverPendingPayment } from "../../../src/lib/payment/paymentConfirmRecovery";
import { formatKrw, getReportProduct, isDirectReportPaymentAmount, REPORT_PRICE_KRW, REPORT_PRICE_LABEL_KO, REPORT_PRICE_TABLE_KRW } from "../../../src/lib/payment/reportProductCatalog";
import { reportProductTypes } from "../../../src/lib/payment/reportProductTypes";
import type { TossConfirmRequest } from "../../../src/lib/payment/tossConfirmTypes";
import { paidWorkerSql } from "../../helpers/paidWorkerSql";

const walk = (dir: string): string[] => readdirSync(dir).flatMap(n => { const p = join(dir, n); return statSync(p).isDirectory() ? walk(p) : /\.(ts|tsx)$/.test(n) ? [p] : []; });

describe("가격 단일 출처", () => {
  it("모든 상품의 금액·표시 가격이 상품별 표(REPORT_PRICE_TABLE_KRW)에서 나온다", () => {
    for (const type of reportProductTypes) {
      const p = getReportProduct(type)!;
      expect(p.amount).toBe(REPORT_PRICE_TABLE_KRW[type]);
      expect(p.priceLabelKo).toBe(formatKrw(REPORT_PRICE_TABLE_KRW[type]));
    }
    // 최종 A: 출시 4종 3,900원, 대운·세운 4,900원(판매 중지 유지, 값만).
    expect(REPORT_PRICE_TABLE_KRW).toEqual({ saju_mbti_full: 3900, career_money_study: 3900, love_marriage_child: 3900, saju_mbti_compatibility: 3900, major_fortune: 4900, annual_fortune: 4900 });
    expect(REPORT_PRICE_KRW).toBe(REPORT_PRICE_TABLE_KRW.saju_mbti_full);
    expect(REPORT_PRICE_LABEL_KO).toBe("3,900원");
  });

  it("소스에 가격 숫자(1,490 · 1,290 · 3,900 · 4,900)를 직접 적은 곳은 카탈로그 한 파일뿐이다", () => {
    const price = /(?<![\d{,])(?:1,?[24]90|[34],?900)(?![\d}])/g;
    const hits = ["src/app", "src/components", "src/lib/payment", "src/lib/tickets", "src/lib/ops", "src/lib/account", "src/lib/legal", "src/lib/analytics", "src/lib/growth", "src/lib/coupons", "src/lib/product", "src/lib/book"].flatMap(walk).filter(f => new RegExp(price.source).test(readFileSync(f, "utf8").replace(/\/\/.*$/gm, "")));
    expect(hits.map(f => f.replaceAll("\\", "/"))).toEqual(["src/lib/payment/reportProductCatalog.ts"]);
    // 카탈로그에서도 가격 숫자는 출시 4종 4줄 + 대운·세운 자리표시 1개뿐이다(AM 6부: 대운·세운 가격은 설정값 FORTUNE_PRICE_*_KRW).
    const catalog = readFileSync("src/lib/payment/reportProductCatalog.ts", "utf8").replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "");
    expect(catalog.match(price)).toEqual(["4900", "3900", "3900", "3900", "3900"]);
  });

  it("서버(결제 준비)는 화면이 보낸 금액을 카탈로그 금액과 대조한다 — 다르면 거절", () => {
    const base = { paymentOrderId: "po", providerOrderId: "provider_order_x", productType: "saju_mbti_full", provider: "toss", currency: "KRW", status: "ready" } as const;
    expect(preparePaymentCheckoutSession({ ...base, amount: REPORT_PRICE_KRW }).ok).toBe(true);
    for (const amount of [REPORT_PRICE_KRW + 100, REPORT_PRICE_KRW - 100, 0, 100]) {
      expect(preparePaymentCheckoutSession({ ...base, amount })).toMatchObject({ ok: false, error: { code: "PAYMENT_CHECKOUT_AMOUNT_MISMATCH" } });
    }
  });

  it("승인 앞 금액 검사는 모양만 본다(가격 숫자 고정 없음)", () => {
    for (const ok of [REPORT_PRICE_KRW, REPORT_PRICE_KRW + 1, REPORT_PRICE_KRW - 500, 100]) expect(isDirectReportPaymentAmount(ok)).toBe(true);
    for (const bad of [99, 0, -REPORT_PRICE_KRW, REPORT_PRICE_KRW + 0.5, Number.NaN, String(REPORT_PRICE_KRW), null]) expect(isDirectReportPaymentAmount(bad)).toBe(false);
  });
});

describe("가격 변경과 승인 — 실제 SQL(PGlite), 토스는 대역", () => {
  let db: PGlite;
  let store: ReliabilityStore;
  const input = { reportInputPayload: { productKey: "saju_mbti_full", person: { name: "가격검사" } } };
  /** 가격을 바꾸기 전에 만든 주문의 금액(지금 카탈로그 가격과 다르다). */
  const OLD_PRICE = REPORT_PRICE_KRW - 500;
  const done = (p: TossConfirmRequest) => ({ ok: true as const, confirm: { provider: "toss" as const, paymentKeyReceived: true as const, orderId: p.orderId, amount: p.amount, status: "DONE" } });
  const order = async (id: string, amount: number) => expect(await store.call("create_order", { paymentOrderId: id, providerOrderId: `order-${id}`, productType: "saju_mbti_full", provider: "toss", amount, inputSnapshot: input })).toMatchObject({ ok: true });
  const status = async (id: string) => (await db.query<{ status: string }>("select status from payment_orders where payment_order_id=$1", [id])).rows[0]?.status;

  beforeAll(async () => {
    ({ db, store } = await paidWorkerSql());
    // 운영과 같은 상태: v4 이용권 migration이 복구 대기열 가격 검사를 (1290,1490)으로 바꿔 둔 본문.
    await db.exec(`do $p$ declare body text; begin body := pg_get_functiondef('public.paid_report_reliability(text,jsonb)'::regprocedure);
      execute replace(body,'o.amount<>1290','o.amount not in (1290,1490)'); end $p$;`);
    const body = async () => (await db.query<{ b: string }>("select pg_get_functiondef('public.paid_report_reliability(text,jsonb)'::regprocedure) b")).rows[0].b;
    expect(await body()).toContain("o.amount not in (1290,1490)");
    const migration = readFileSync("supabase/migrations/20261105090000_v5_final_payment_recovery_price_free.sql", "utf8");
    await db.exec(migration);
    expect(await body()).not.toMatch(/1290|1490/);
    await db.exec(migration); // 다시 적용해도 그대로(이미 바뀐 본문은 건너뛴다)
  }, 60_000);
  afterAll(async () => { await db?.close(); });
  beforeEach(async () => { await db.exec("truncate payment_orders cascade"); });

  it("가격을 바꾸기 전에 만든 주문은 그 저장 금액으로 승인된다", async () => {
    expect(OLD_PRICE).not.toBe(REPORT_PRICE_KRW);
    await order("old", OLD_PRICE);
    const toss = vi.fn(async (p: TossConfirmRequest) => done(p));
    const result = await confirmPaidReport({ orderId: "order-old", paymentKey: "mock-old", amount: OLD_PRICE }, store, toss);
    expect(result).toMatchObject({ ok: true });
    expect(String(result.reportId)).toMatch(/^report_/);
    expect(toss).toHaveBeenCalledWith({ orderId: "order-old", paymentKey: "mock-old", amount: OLD_PRICE });
    expect(await status("old")).toBe("paid");
  });

  it("저장 금액과 다른 금액(위조)은 토스 승인 전에 거절된다", async () => {
    await order("forged", REPORT_PRICE_KRW);
    const toss = vi.fn(async (p: TossConfirmRequest) => done(p));
    for (const amount of [100, REPORT_PRICE_KRW - 1, REPORT_PRICE_KRW + 1, OLD_PRICE]) {
      expect(await confirmPaidReport({ orderId: "order-forged", paymentKey: "mock-forged", amount }, store, toss)).toMatchObject({ ok: false, code: "PAYMENT_MISMATCH" });
    }
    expect(toss).not.toHaveBeenCalled();
    expect(await status("forged")).toBe("ready");
  });

  it("토스가 승인한 금액이 주문 금액과 다르면 결제 완료로 기록하지 않는다", async () => {
    await order("toss-diff", REPORT_PRICE_KRW);
    const toss = vi.fn(async (p: TossConfirmRequest) => ({ ...done(p), confirm: { ...done(p).confirm, amount: p.amount - 100 } }));
    expect(await confirmPaidReport({ orderId: "order-toss-diff", paymentKey: "mock-toss-diff", amount: REPORT_PRICE_KRW }, store, toss)).toMatchObject({ ok: false, code: "PAYMENT_CONFIRM_PENDING" });
    expect(await status("toss-diff")).toBe("ready");
  });

  it("결제 복구 대기열도 가격 숫자로 막지 않는다: 이전 가격 주문을 저장 금액으로 다시 승인한다", async () => {
    await order("recover", OLD_PRICE);
    expect(await store.call("confirm_claim", { orderId: "order-recover", paymentKey: "mock-recover", amount: OLD_PRICE })).toMatchObject({ ok: true });
    await db.exec("update payment_orders set confirm_lease_until=now()-interval '1 second', recovery_next_retry_at=now()-interval '1 second'");
    const toss = vi.fn(async (p: TossConfirmRequest) => done(p));
    expect(await recoverPendingPayment(store, toss)).toMatchObject({ ok: true });
    expect(toss).toHaveBeenCalledWith({ orderId: "order-recover", paymentKey: "mock-recover", amount: OLD_PRICE }, expect.anything());
    expect(await status("recover")).toBe("paid");
  });
});
