import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import type {
  TossCheckoutRequestDraft,
  TossPaymentWindowMethod,
} from "../../../src/lib/payment/tossCheckoutRequestTypes";

const source = readFileSync(
  join(process.cwd(), "src/lib/payment/tossCheckoutRequestTypes.ts"),
  "utf8",
);

describe("Toss checkout request types", () => {
  it("models a client-safe Toss request draft", () => {
    const draft = {
      provider: "toss",
      clientKey: "test_client_key",
      requestPayment: {
        method: "CARD",
        orderId: "provider_order_toss_type_test",
        orderName: "사주×MBTI 종합 리포트",
        amount: {
          currency: "KRW",
          value: 1290,
        },
        successUrl: "https://gyeol.example/payments/toss/success",
        failUrl: "https://gyeol.example/payments/toss/fail",
        customerName: "결리포트 고객",
      },
      metadata: {
        paymentOrderId: "payment_order_toss_type_test",
        productType: "saju_mbti_full",
      },
    } as const satisfies TossCheckoutRequestDraft;

    expect(draft.provider).toBe("toss");
    expect(draft.requestPayment.method).toBe("CARD");
    expect(draft.requestPayment).not.toHaveProperty("flow" + "Mode");
    expect(draft.requestPayment.amount).toEqual({
      currency: "KRW",
      value: 1290,
    });
    expect(draft.metadata.productType).toBe("saju_mbti_full");
  });

  it("limits payment window method fields to card only", () => {
    const method: TossPaymentWindowMethod = "CARD";

    expect(method).toBe("CARD");
    expect(source).toContain("TossPaymentWindowMethod");
    expect(source).toContain('"CARD"');
    expect(source).not.toContain("EASY_PAY");
    expect(source).not.toContain("flow" + "Mode");
  });

  it("source contains request fields but no secret or confirm-stage markers", () => {
    const requiredMarkers = [
      "TossCheckoutRequestDraft",
      "requestPayment",
      "method",
      "CARD",
      "clientKey",
      "orderId",
      "orderName",
      "successUrl",
      "failUrl",
      "customerName",
      "paymentOrderId",
      "productType",
    ];
    const blockedMarkers = [
      "TOSS" + "_SECRET" + "_KEY",
      "NEXT" + "_PUBLIC" + "_TOSS" + "_SECRET" + "_KEY",
      "secret" + "Key",
      "client" + "Secret",
      "payment" + "Key",
      "provider" + "Payment" + "Id",
      "provider" + "_payment" + "_id",
      "checkout" + "Url",
      "/v1/" + "payments/confirm",
      "To" + "ss" + "Payments(",
      "@toss" + "payments",
      "fe" + "tch(",
      "ax" + "ios",
      "share" + "Token",
      "access" + "TokenHash",
      "report" + "_snapshot",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }

    for (const marker of blockedMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
