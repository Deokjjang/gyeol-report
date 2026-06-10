import { readFileSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import TossPaymentFailPage from "../../../src/app/payments/toss/fail/page";

const failPageSource = readFileSync(
  join(process.cwd(), "src/app/payments/toss/fail/page.tsx"),
  "utf8",
);

async function renderFailPage(query: {
  readonly code?: string;
  readonly message?: string;
  readonly orderId?: string;
}): Promise<string> {
  const element = await TossPaymentFailPage({
    searchParams: Promise.resolve(query),
  });

  return renderToStaticMarkup(element);
}

describe("Toss payment fail placeholder page", () => {
  it("renders safe failure placeholder fields", async () => {
    const html = await renderFailPage({
      code: "PAY_PROCESS_CANCELED",
      message: "사용자가 결제를 취소했습니다.",
      orderId: "provider_order_toss_fail_test",
    });

    expect(html).toContain("결제 실패 또는 취소");
    expect(html).toContain("PAY_PROCESS_CANCELED");
    expect(html).toContain("사용자가 결제를 취소했습니다.");
    expect(html).toContain("provider_order_toss_fail_test");
  });

  it("renders missing values safely", async () => {
    const html = await renderFailPage({});

    expect(html).toContain("결제 실패 또는 취소");
    expect(html).toContain("not provided");
  });

  it("source contains placeholder copy and no payment completion behavior", () => {
    const requiredMarkers = [
      "결제 실패 또는 취소",
      "Toss 결제창에서 실패 또는 취소로 돌아온 상태입니다",
      "검증용 임시 화면",
      "code",
      "message",
      "orderId",
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
      expect(failPageSource).toContain(marker);
    }

    for (const marker of blockedMarkers) {
      expect(failPageSource).not.toContain(marker);
    }
  });
});
