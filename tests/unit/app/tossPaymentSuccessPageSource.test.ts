import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(process.cwd(), "src/app/payments/toss/success/page.tsx"),
  "utf8",
);

describe("Toss payment success page source", () => {
  it("receives Toss return params without running confirm or report generation", () => {
    const requiredMarkers = [
      "TOSS_CONFIRM_DEFERRED_UNTIL_REPORT_FULFILLMENT",
      "결제 정보 확인 완료",
      "리포트 생성과 최종 승인 처리는 다음 단계에서 연결됩니다.",
      "결제 정보가 부족합니다.",
      "결제 금액이 올바르지 않습니다.",
      "다른 리포트 보기",
      "/report/new",
      "requiredPaymentAmount = 1290",
    ];
    const blockedMarkers = [
      "개발 검증용 임시 화면",
      "/api/payments/toss/confirm",
      "/api/reports/create",
      "fetch(",
      "dangerouslySetInnerHTML",
      "/v1/" + "payments/confirm",
      "TOSS" + "_SECRET" + "_KEY",
      "NEXT" + "_PUBLIC" + "_TOSS" + "_SECRET" + "_KEY",
      "create" + "Report",
      "generate" + "Report",
      "fulfillment",
      "reportId",
      "share" + "Token",
      "access" + "TokenHash",
      "provider" + "PaymentId",
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
