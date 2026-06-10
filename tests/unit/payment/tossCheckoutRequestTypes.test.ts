import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import type { TossCheckoutRequestDraft } from "../../../src/lib/payment/tossCheckoutRequestTypes";

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
        orderId: "provider_order_toss_type_test",
        orderName: "사주×MBTI 전체 리포트",
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
    expect(draft.requestPayment.amount).toEqual({
      currency: "KRW",
      value: 1290,
    });
    expect(draft.metadata.productType).toBe("saju_mbti_full");
  });

  it("source contains request fields but no secret or confirm-stage markers", () => {
    const requiredMarkers = [
      "TossCheckoutRequestDraft",
      "requestPayment",
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
