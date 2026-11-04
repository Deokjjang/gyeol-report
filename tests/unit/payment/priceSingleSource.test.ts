/**
 * P6e-ops 6: 상품 가격은 한 곳(src/lib/payment/reportProductCatalog.ts 의 REPORT_PRICE_KRW)에서만 바뀌고,
 * 결제 금액은 서버가 그 값으로 검증한다. 가격을 바꾸는 위치·검증 지점은 docs/v5/p6e-ops-report.md 6절.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { preparePaymentCheckoutSession } from "../../../src/lib/payment/paymentCheckoutSessionBoundary";
import { getReportProduct, isDirectReportPaymentAmount, REPORT_PRICE_KRW, REPORT_PRICE_LABEL_KO } from "../../../src/lib/payment/reportProductCatalog";
import { reportProductTypes } from "../../../src/lib/payment/reportProductTypes";

const walk = (dir: string): string[] => readdirSync(dir).flatMap(n => { const p = join(dir, n); return statSync(p).isDirectory() ? walk(p) : /\.(ts|tsx)$/.test(n) ? [p] : []; });

describe("가격 단일 출처", () => {
  it("모든 상품의 금액·표시 가격이 REPORT_PRICE_KRW에서 나온다", () => {
    for (const type of reportProductTypes) {
      const p = getReportProduct(type)!;
      expect(p.amount).toBe(REPORT_PRICE_KRW);
      expect(p.priceLabelKo).toBe(REPORT_PRICE_LABEL_KO);
    }
    expect(REPORT_PRICE_LABEL_KO).toBe(`${REPORT_PRICE_KRW.toLocaleString("ko-KR")}원`);
  });

  it("소스에 가격 숫자(1,490 · 1,290)를 직접 적은 곳은 카탈로그 한 파일뿐이다(레거시 1290 허용값 포함)", () => {
    const hits = ["src/app", "src/components", "src/lib/payment", "src/lib/tickets", "src/lib/ops", "src/lib/account", "src/lib/legal"].flatMap(walk).filter(f => /(?<![\d{,])1,?[24]90(?![\d}])/.test(readFileSync(f, "utf8").replace(/\/\/.*$/gm, "")));
    expect(hits.map(f => f.replaceAll("\\", "/"))).toEqual(["src/lib/payment/reportProductCatalog.ts"]);
  });

  it("서버(결제 준비)는 화면이 보낸 금액을 카탈로그 금액과 대조한다 — 다르면 거절", () => {
    const base = { paymentOrderId: "po", providerOrderId: "provider_order_x", productType: "saju_mbti_full", provider: "toss", currency: "KRW", status: "ready" } as const;
    expect(preparePaymentCheckoutSession({ ...base, amount: REPORT_PRICE_KRW }).ok).toBe(true);
    for (const amount of [REPORT_PRICE_KRW + 100, REPORT_PRICE_KRW - 100, 0, 100]) {
      expect(preparePaymentCheckoutSession({ ...base, amount })).toMatchObject({ ok: false, error: { code: "PAYMENT_CHECKOUT_AMOUNT_MISMATCH" } });
    }
  });

  it("승인 단계는 카탈로그 가격(또는 이미 판매한 직전 가격)만 받는다", () => {
    expect(isDirectReportPaymentAmount(REPORT_PRICE_KRW)).toBe(true);
    expect(isDirectReportPaymentAmount(REPORT_PRICE_KRW + 1)).toBe(false);
    expect(isDirectReportPaymentAmount(1)).toBe(false);
    expect(isDirectReportPaymentAmount("1490")).toBe(false);
  });
});
