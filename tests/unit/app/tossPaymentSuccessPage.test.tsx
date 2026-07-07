import { readFileSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

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

const originalConfirmEnabled = process.env.TOSS_CONFIRM_API_ENABLED;
const originalSecretKey = process.env.TOSS_PAYMENTS_SECRET_KEY;

function restoreOptionalEnv(name: string, value: string | undefined): void {
  if (value === undefined) {
    delete process.env[name];
    return;
  }

  process.env[name] = value;
}

describe("Toss payment success page", () => {
  beforeEach(() => {
    delete process.env.TOSS_CONFIRM_API_ENABLED;
    delete process.env.TOSS_PAYMENTS_SECRET_KEY;
  });

  afterEach(() => {
    restoreOptionalEnv("TOSS_CONFIRM_API_ENABLED", originalConfirmEnabled);
    restoreOptionalEnv("TOSS_PAYMENTS_SECRET_KEY", originalSecretKey);
  });

  it("renders server-disabled received state without exposing full payment key", async () => {
    const fullPaymentKey = "pay_full_payment_key_value_must_not_render";
    const html = await renderSuccessPage({
      paymentKey: fullPaymentKey,
      orderId: "provider_order_toss_success_test",
      amount: "1290",
    });

    expect(html).toContain("결제 정보 확인 완료");
    expect(html).toContain(
      "결제 승인과 리포트 생성 처리는 서버 설정이 켜진 뒤 진행됩니다.",
    );
    expect(html).toContain("provider_order_toss_success_test");
    expect(html).toContain("1,290원");
    expect(html).toContain("confirm_disabled");
    expect(html).toContain("다른 리포트 보기");
    expect(html).not.toContain(fullPaymentKey);
    expect(html).not.toContain("test_toss_secret_key");
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

  it("keeps confirm and report generation server-side only", () => {
    const requiredMarkers = [
      "TOSS_CONFIRM_API_ENABLED",
      "TOSS_PAYMENTS_SECRET_KEY",
      "confirmTossPayment",
      "fulfillPaidProductReport",
      "createPaymentOrderPersistenceRuntime",
      "createReportPersistenceRuntime",
      "resolveReportWriterRuntime",
      "reportExpiresAt",
      "requiredPaymentAmount = 1290",
      "redirect(`/reports/${finalState.redirectReportId}`)",
      paidGenerationFailureMessageSourceMarker(),
    ];
    const blockedMarkers = [
      "/api/payments/toss/confirm",
      "/api/reports/create",
      "fetch(",
      "dangerouslySetInnerHTML",
      "payment" + "KeyReceived",
      "reportSnapshot",
      "share" + "Token",
      "access" + "TokenHash",
      "NEXT" + "_PUBLIC" + "_TOSS" + "_SECRET" + "_KEY",
    ];

    for (const marker of requiredMarkers) {
      expect(successPageSource).toContain(marker);
    }

    for (const marker of blockedMarkers) {
      expect(successPageSource).not.toContain(marker);
    }
  });
});

function paidGenerationFailureMessageSourceMarker(): string {
  return "결제는 완료되었고 리포트 생성 처리 중 문제가 발생했습니다.";
}
