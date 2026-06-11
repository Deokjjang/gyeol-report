import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(process.cwd(), "src/app/payments/toss/success/page.tsx"),
  "utf8",
);

describe("Toss payment success page source", () => {
  it("auto-confirms through the server confirm route and renders safe states", () => {
    const requiredMarkers = [
      "/api/payments/toss/confirm",
      "결제 승인 처리 중",
      "Toss 결제 인증을 서버에서 승인하고 있습니다.",
      "결제 승인 완료",
      "리포트 생성이 완료되었습니다.",
      "결제 승인 실패",
      "서버 승인 처리 중 문제가 발생했습니다.",
      "결제 정보가 부족합니다.",
      "결제 금액이 올바르지 않습니다.",
      "fulfillment",
      "reportId",
    ];
    const blockedMarkers = [
      "서버 승인 단계는 아직 " + "연결되지 않았습니다",
      "개발 검증용 임시 화면",
      "/v1/" + "payments/confirm",
      "TOSS" + "_SECRET" + "_KEY",
      "NEXT" + "_PUBLIC" + "_TOSS" + "_SECRET" + "_KEY",
      "create" + "Report",
      "generate" + "Report",
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
