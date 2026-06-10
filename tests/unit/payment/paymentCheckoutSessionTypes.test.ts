import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import type {
  KakaoPayCheckoutProviderPayload,
  PaymentCheckoutProviderPayload,
  PaymentCheckoutSessionDraft,
  TossCheckoutProviderPayload,
} from "../../../src/lib/payment/paymentCheckoutSessionTypes";

function readSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

const tossPayload = {
  provider: "toss",
  orderId: "provider_order_toss_type_test",
  orderName: "사주×MBTI 전체 리포트",
  amount: 1290,
  currency: "KRW",
  customerNameLabel: "결리포트 고객",
} as const satisfies TossCheckoutProviderPayload;

const kakaoPayPayload = {
  provider: "kakao_pay",
  partnerOrderId: "provider_order_kakao_type_test",
  itemName: "사주×MBTI 전체 리포트",
  quantity: 1,
  totalAmount: 1290,
  currency: "KRW",
} as const satisfies KakaoPayCheckoutProviderPayload;

const session = {
  paymentOrderId: "payment_order_type_test",
  providerOrderId: "provider_order_toss_type_test",
  productType: "saju_mbti_full",
  productLabelKo: "사주×MBTI 전체 리포트",
  provider: "toss",
  amount: 1290,
  currency: "KRW",
  status: "prepared",
  checkoutMode: "provider_redirect_pending",
  providerPayload: tossPayload,
} as const satisfies PaymentCheckoutSessionDraft;

describe("payment checkout session types", () => {
  it("models prepared provider redirect pending sessions", () => {
    expect(session.status).toBe("prepared");
    expect(session.checkoutMode).toBe("provider_redirect_pending");
  });

  it("models Toss and KakaoPay provider payloads only", () => {
    const payloads: readonly PaymentCheckoutProviderPayload[] = [
      tossPayload,
      kakaoPayPayload,
    ];

    expect(payloads.map((payload) => payload.provider)).toEqual([
      "toss",
      "kakao_pay",
    ]);
  });

  it("source avoids unsupported product and payment model terms", () => {
    const source = readSource(
      "src/lib/payment/paymentCheckoutSessionTypes.ts",
    );
    const blockedMarkers = [
      "wall" + "et",
      "re" + "charge",
      "point " + "balance",
      "credit " + "balance",
      "package " + "products",
      "bundle",
      "충" + "전",
      "포" + "인트",
      "잔" + "액",
    ];

    for (const marker of blockedMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
