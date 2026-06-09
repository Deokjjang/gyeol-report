import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  paymentMethodMetadata,
  paymentProviderIds,
  paymentProviderStatuses,
} from "../../../src/lib/payment/paymentProviderTypes";

const source = readFileSync(
  join(process.cwd(), "src/lib/payment/paymentProviderTypes.ts"),
  "utf8",
);

describe("payment provider types", () => {
  it("defines exactly Toss and KakaoPay providers", () => {
    expect(paymentProviderIds).toEqual(["toss", "kakao_pay"]);
    expect(paymentMethodMetadata.map((provider) => provider.id)).toEqual([
      "toss",
      "kakao_pay",
    ]);
    expect(paymentMethodMetadata.map((provider) => provider.labelKo)).toEqual([
      "Toss",
      "KakaoPay",
    ]);
  });

  it("defines one-report payment statuses without balance states", () => {
    expect(paymentProviderStatuses).toEqual([
      "ready",
      "paid",
      "failed",
      "canceled",
      "refunded",
    ]);
  });

  it("keeps provider type source free of unsupported providers and live APIs", () => {
    const blockedMarkers = [
      "kakao" + "_card",
      "naver" + "_pay",
      "payco",
      "wallet",
      "recharge",
      "point",
      "credit",
      "충" + "전",
      "포" + "인트",
      "잔" + "액",
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
