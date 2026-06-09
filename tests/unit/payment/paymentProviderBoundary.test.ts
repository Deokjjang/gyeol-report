import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  assertSupportedPaymentProvider,
  getSupportedPaymentProviders,
  parsePaymentProviderId,
  toMockPaymentProviderStorageId,
} from "../../../src/lib/payment/paymentProviderBoundary";

const source = readFileSync(
  join(process.cwd(), "src/lib/payment/paymentProviderBoundary.ts"),
  "utf8",
);

describe("payment provider boundary", () => {
  it("returns exactly the supported Toss and KakaoPay provider metadata", () => {
    expect(getSupportedPaymentProviders()).toEqual([
      {
        id: "toss",
        labelKo: "Toss",
        descriptionKo: "Toss 결제 선택지입니다.",
      },
      {
        id: "kakao_pay",
        labelKo: "KakaoPay",
        descriptionKo: "KakaoPay 결제 선택지입니다.",
      },
    ]);
  });

  it("parses supported provider ids", () => {
    expect(parsePaymentProviderId("toss")).toBe("toss");
    expect(parsePaymentProviderId("kakao_pay")).toBe("kakao_pay");
  });

  it("rejects unsupported provider ids", () => {
    const unsupportedProviders = [
      "kakao" + "_card",
      "naver" + "_pay",
      "payco",
      "wallet",
      "recharge",
      "point",
      "",
      null,
      undefined,
    ];

    for (const provider of unsupportedProviders) {
      expect(parsePaymentProviderId(provider)).toBeNull();
      expect(assertSupportedPaymentProvider(provider)).toEqual({
        ok: false,
        error: {
          code: "PAYMENT_PROVIDER_UNSUPPORTED",
          messageKo: "지원하지 않는 결제 수단입니다.",
        },
      });
    }
  });

  it("returns a successful assertion result for supported providers", () => {
    expect(assertSupportedPaymentProvider("toss")).toEqual({
      ok: true,
      providerId: "toss",
    });
    expect(assertSupportedPaymentProvider("kakao_pay")).toEqual({
      ok: true,
      providerId: "kakao_pay",
    });
  });

  it("maps supported providers to mock storage provider ids", () => {
    expect(toMockPaymentProviderStorageId("toss")).toBe("mock_toss");
    expect(toMockPaymentProviderStorageId("kakao_pay")).toBe(
      "mock_kakao_pay",
    );
  });

  it("keeps provider boundary source free of live APIs and restricted fields", () => {
    const blockedMarkers = [
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
      expect(source).not.toContain(marker);
    }
  });
});
