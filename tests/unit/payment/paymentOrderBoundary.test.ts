import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  createPaymentOrderDraft,
  parseReportProductType,
} from "../../../src/lib/payment/paymentOrderBoundary";

const boundarySource = readFileSync(
  join(process.cwd(), "src/lib/payment/paymentOrderBoundary.ts"),
  "utf8",
);
const typesSource = readFileSync(
  join(process.cwd(), "src/lib/payment/paymentOrderTypes.ts"),
  "utf8",
);
const paymentSource = [
  boundarySource,
  typesSource,
  readFileSync(
    join(process.cwd(), "src/lib/payment/reportProductTypes.ts"),
    "utf8",
  ),
  readFileSync(
    join(process.cwd(), "src/lib/payment/reportProductCatalog.ts"),
    "utf8",
  ),
].join("\n");

const inputSnapshot = {
  displayName: "PAYMENT_ORDER_TEST",
  birthDate: "1996-12-06",
};

describe("payment order boundary", () => {
  it("creates ready payment order for saju mbti full with Toss", () => {
    const result = createPaymentOrderDraft({
      productType: "saju_mbti_full",
      provider: "toss",
      inputSnapshot,
      nowIso: "2026-01-01T00:00:00.000Z",
    });

    expect(result).toMatchObject({
      ok: true,
      order: {
        productType: "saju_mbti_full",
        provider: "toss",
        amount: 1290,
        currency: "KRW",
        status: "ready",
        inputSnapshot,
        createdAt: "2026-01-01T00:00:00.000Z",
      },
    });

    expect(result.ok && result.order.paymentOrderId.startsWith("payment_order_")).toBe(
      true,
    );
  });

  it("creates ready payment order for saju mbti full with KakaoPay", () => {
    const result = createPaymentOrderDraft({
      productType: "saju_mbti_full",
      provider: "kakao_pay",
      inputSnapshot,
    });

    expect(result).toMatchObject({
      ok: true,
      order: {
        productType: "saju_mbti_full",
        provider: "kakao_pay",
        amount: 1290,
        currency: "KRW",
        status: "ready",
      },
    });
  });

  it("defaults missing product type to saju mbti full", () => {
    const result = createPaymentOrderDraft({
      provider: "toss",
      inputSnapshot,
    });

    expect(result).toMatchObject({
      ok: true,
      order: {
        productType: "saju_mbti_full",
        amount: 1290,
        currency: "KRW",
      },
    });
  });

  it("uses server-side catalog amount currency and ready status", () => {
    const result = createPaymentOrderDraft({
      productType: "saju_mbti_full",
      provider: "toss",
      inputSnapshot,
      requestedAmount: 999999,
      requestedCurrency: "USD",
      requestedStatus: "paid",
    });

    expect(result).toMatchObject({
      ok: true,
      order: {
        amount: 1290,
        currency: "KRW",
        status: "ready",
      },
    });
  });

  it("rejects unsupported product", () => {
    expect(
      createPaymentOrderDraft({
        productType: "unknown_product",
        provider: "toss",
        inputSnapshot,
      }),
    ).toEqual({
      ok: false,
      error: {
        code: "PAYMENT_PRODUCT_UNSUPPORTED",
        messageKo: "지원하지 않는 리포트 상품입니다.",
      },
    });
  });

  it("creates ready payment orders for every launch product", () => {
    const launchProductTypes = [
      "career_money_study",
      "love_marriage_child",
      "saju_mbti_compatibility",
      "major_fortune",
      "annual_fortune",
    ];

    for (const productType of launchProductTypes) {
      expect(
        createPaymentOrderDraft({
          productType,
          provider: "toss",
          inputSnapshot,
        }),
      ).toMatchObject({
        ok: true,
        order: {
          productType,
          amount: 1290,
          currency: "KRW",
          status: "ready",
        },
      });
    }
  });

  it("rejects unsupported provider", () => {
    expect(
      createPaymentOrderDraft({
        productType: "saju_mbti_full",
        provider: "payco",
        inputSnapshot,
      }),
    ).toEqual({
      ok: false,
      error: {
        code: "PAYMENT_ORDER_INVALID_PROVIDER",
        messageKo: "지원하지 않는 결제 수단입니다.",
      },
    });
  });

  it("rejects missing input snapshot", () => {
    expect(
      createPaymentOrderDraft({
        productType: "saju_mbti_full",
        provider: "toss",
        inputSnapshot: null,
      }),
    ).toEqual({
      ok: false,
      error: {
        code: "PAYMENT_ORDER_INVALID_INPUT",
        messageKo: "결제 주문을 시작할 입력 정보가 필요합니다.",
      },
    });
  });

  it("creates unique order ids across calls", () => {
    const first = createPaymentOrderDraft({
      productType: "saju_mbti_full",
      provider: "toss",
      inputSnapshot,
    });
    const second = createPaymentOrderDraft({
      productType: "saju_mbti_full",
      provider: "toss",
      inputSnapshot,
    });

    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);

    if (first.ok && second.ok) {
      expect(first.order.paymentOrderId).not.toBe(second.order.paymentOrderId);
    }
  });

  it("reuses report product parsing from the boundary export", () => {
    expect(parseReportProductType("saju_mbti_full")).toBe("saju_mbti_full");
    expect(parseReportProductType("unknown_product")).toBeNull();
  });

  it("does not generate reports store paid reports or issue share tokens", () => {
    const blockedMarkers = [
      "persistPaidFullReport",
      "issueReportShareToken",
      "buildReportPersistencePayload",
      "createReportApiEnvelopeFromJson",
      "/api/" + "payments",
      "/api/" + "reports/unlock",
      "To" + "ss" + "Payments",
      "KakaoPay" + " API",
      "service" + "_role",
      "SUPABASE" + "_SERVICE" + "_ROLE",
      "access" + "TokenHash",
      "payment" + "Provider" + "Payment" + "Id",
    ];

    for (const marker of blockedMarkers) {
      expect(paymentSource).not.toContain(marker);
    }
  });

  it("does not add stored-value or package source concepts", () => {
    const blockedMarkers = [
      ["wall", "et"].join(""),
      ["re", "charge"].join(""),
      "point " + "balance",
      "credit " + "balance",
      "package products enabled",
      "충" + "전",
      "포" + "인트",
      "잔" + "액",
    ];

    for (const marker of blockedMarkers) {
      expect(paymentSource).not.toContain(marker);
    }
  });
});
