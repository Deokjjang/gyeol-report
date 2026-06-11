import { readFileSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import TossPaymentSuccessPage from "../../../src/app/payments/toss/success/page";

const successPageSource = readFileSync(
  join(process.cwd(), "src/app/payments/toss/success/page.tsx"),
  "utf8",
);

async function renderSuccessPage(query: {
  readonly paymentKey?: string;
  readonly orderId?: string;
  readonly amount?: string;
}): Promise<string> {
  const element = await TossPaymentSuccessPage({
    searchParams: Promise.resolve(query),
  });

  return renderToStaticMarkup(element);
}

describe("Toss payment success placeholder page", () => {
  it("renders safe success placeholder fields", async () => {
    const fullPaymentKey = "pay_full_payment_key_value_must_not_render";
    const html = await renderSuccessPage({
      paymentKey: fullPaymentKey,
      orderId: "provider_order_toss_success_test",
      amount: "990",
    });

    expect(html).toContain("결제 승인 대기");
    expect(html).toContain("provider_order_toss_success_test");
    expect(html).toContain("990");
    expect(html).toContain("paymentKeyReceived");
    expect(html).toContain("yes");
    expect(html).not.toContain(fullPaymentKey);
  });

  it("shows payment key absence without exposing a value", async () => {
    const html = await renderSuccessPage({
      orderId: "provider_order_toss_success_no_key",
      amount: "990",
    });

    expect(html).toContain("paymentKeyReceived");
    expect(html).toContain("no");
    expect(html).not.toContain("pay_");
  });

  it("source contains placeholder copy and no payment completion behavior", () => {
    const requiredMarkers = [
      "결제 승인 대기",
      "서버 승인 단계는 아직 연결되지",
      "개발 검증용 임시 화면",
      "orderId",
      "amount",
      "paymentKeyReceived",
    ];
    const blockedMarkers = [
      "/v1/" + "payments/confirm",
      "TOSS" + "_SECRET" + "_KEY",
      "NEXT" + "_PUBLIC" + "_TOSS" + "_SECRET" + "_KEY",
      "secret" + "Key",
      "client" + "Secret",
      "mark" + "Paid",
      "payment_order " + "paid",
      "share" + "Token",
      "access" + "TokenHash",
      "report" + "_snapshot",
      "provider" + "_payment" + "_id",
      "service" + "_role",
      "SUPABASE" + "_SERVICE" + "_ROLE",
      "wall" + "et",
      "re" + "charge",
      "point " + "balance",
      "credit " + "balance",
      "충" + "전",
      "포" + "인트",
      "잔" + "액",
    ];

    for (const marker of requiredMarkers) {
      expect(successPageSource).toContain(marker);
    }

    for (const marker of blockedMarkers) {
      expect(successPageSource).not.toContain(marker);
    }
  });
});
