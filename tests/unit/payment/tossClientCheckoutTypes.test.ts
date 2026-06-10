import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import type { TossCheckoutRequestDraft } from "../../../src/lib/payment/tossCheckoutRequestTypes";
import type {
  TossClientCheckoutLaunchInput,
  TossClientCheckoutLaunchResult,
  TossClientPaymentWindow,
  TossClientSdk,
} from "../../../src/lib/payment/tossClientCheckoutTypes";

const source = readFileSync(
  join(process.cwd(), "src/lib/payment/tossClientCheckoutTypes.ts"),
  "utf8",
);

const requestDraft = {
  provider: "toss",
  clientKey: "test_client_key",
  requestPayment: {
    orderId: "provider_order_toss_client_type_test",
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
    paymentOrderId: "payment_order_toss_client_type_test",
    productType: "saju_mbti_full",
  },
} as const satisfies TossCheckoutRequestDraft;

describe("Toss client checkout types", () => {
  it("models the injected client launcher shape", async () => {
    const paymentWindow: TossClientPaymentWindow = {
      requestPayment: () => undefined,
    };
    const sdk: TossClientSdk = {
      payment: () => paymentWindow,
    };
    const input = {
      tossCheckoutRequest: requestDraft,
      customerKey: "customer_key_type_test",
      loadTossPayments: async () => sdk,
    } satisfies TossClientCheckoutLaunchInput;
    const result = {
      ok: true,
      status: "redirect_requested",
    } as const satisfies TossClientCheckoutLaunchResult;

    await expect(input.loadTossPayments(input.tossCheckoutRequest.clientKey))
      .resolves.toBe(sdk);
    expect(input.customerKey).toBe("customer_key_type_test");
    expect(result.status).toBe("redirect_requested");
  });

  it("source contains client launcher fields and no server-only markers", () => {
    const requiredMarkers = [
      "TossClientCheckoutLaunchInput",
      "TossClientSdkLoader",
      "loadTossPayments",
      "customerKey",
      "requestPayment",
      "redirect_requested",
      "failed_to_launch",
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
