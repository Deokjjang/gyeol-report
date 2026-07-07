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

describe("Toss payment success deferred page", () => {
  it("renders received state without exposing full payment key", async () => {
    const fullPaymentKey = "pay_full_payment_key_value_must_not_render";
    const html = await renderSuccessPage({
      paymentKey: fullPaymentKey,
      orderId: "provider_order_toss_success_test",
      amount: "1290",
    });

    expect(html).toContain("결제 정보 확인 완료");
    expect(html).toContain("리포트 생성과 최종 승인 처리는 다음 단계에서 연결됩니다.");
    expect(html).toContain("provider_order_toss_success_test");
    expect(html).toContain("1,290원");
    expect(html).toContain("confirm deferred");
    expect(html).toContain("결제 승인 확인 후 리포트 생성 연결 예정");
    expect(html).toContain("다른 리포트 보기");
    expect(html).not.toContain(fullPaymentKey);
    expect(html).not.toContain("/api/payments/toss/confirm");
  });

  it("shows missing state when payment params are incomplete", async () => {
    const html = await renderSuccessPage({
      orderId: "provider_order_toss_success_test",
      amount: "1290",
    });

    expect(html).toContain("결제 정보가 부족합니다.");
    expect(html).toContain("결제 승인에 필요한 정보가 누락되었습니다.");
  });

  it("shows amount mismatch state for non-1290 amount", async () => {
    const html = await renderSuccessPage({
      paymentKey: "pay_wrong_amount",
      orderId: "provider_order",
      amount: "990",
    });

    expect(html).toContain("결제 금액이 올바르지 않습니다.");
    expect(html).toContain("결제 승인 요청 금액을 다시 확인해 주세요.");
    expect(html).toContain("990");
  });

  it("keeps confirm and report generation calls out of the success page", () => {
    const blockedMarkers = [
      "/api/payments/toss/confirm",
      "/api/reports/create",
      "fetch(",
      "dangerouslySetInnerHTML",
      "payment" + "KeyReceived",
      "fulfillment",
      "reportSnapshot",
      "share" + "Token",
      "access" + "TokenHash",
    ];

    for (const marker of blockedMarkers) {
      expect(successPageSource).not.toContain(marker);
    }

    expect(successPageSource).toContain(
      "TOSS_CONFIRM_DEFERRED_UNTIL_REPORT_FULFILLMENT",
    );
    expect(successPageSource).toContain("requiredPaymentAmount = 1290");
  });
});
