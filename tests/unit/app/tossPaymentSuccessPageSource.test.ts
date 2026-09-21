import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(process.cwd(), "src/app/payments/toss/success/page.tsx"),
  "utf8",
);

describe("Toss payment success page source", () => {
  it("confirms paid orders server-side before report generation", () => {
    const requiredMarkers = [
      "TOSS_CONFIRM_API_ENABLED",
      "TOSS_PAYMENTS_SECRET_KEY",
      "confirmTossPayment",
      "confirmPaidReport",
      "createPaidReportReliabilityStore",
      "redirect(`/reports/${finalState.redirectReportId}`)",
      "결제 상태를 확인해 주세요.",
      "결제 상태 확인이 더 필요합니다.",
      "결제 정보가 부족합니다.",
      "결제 금액이 올바르지 않습니다.",
      "ReportStatusView",
      "requiredPaymentAmount = 1290",
    ];
    const blockedMarkers = [
      "개발 검증용 임시 화면",
      "/api/payments/toss/confirm",
      "/api/reports/create",
      "fetch(",
      "dangerouslySetInnerHTML",
      "NEXT" + "_PUBLIC" + "_TOSS" + "_SECRET" + "_KEY",
      "share" + "Token",
      "access" + "TokenHash",
      "input" + "Snapshot",
      "report" + "_snapshot",
      "service" + "_role",
      "SUPABASE" + "_SERVICE" + "_ROLE",
      "현" + "침살",
      "망" + "신살",
      "백" + "호대살",
      "홍" + "염살",
      "재" + "다신약",
      "제" + "다신약",
      "바" + "넘",
      "Bar" + "num",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }

    for (const marker of blockedMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
