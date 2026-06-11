import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(process.cwd(), "src/app/payments/toss/success/page.tsx"),
  "utf8",
);

describe("Toss payment success page source", () => {
  it("remains a placeholder without automatic confirm", () => {
    const requiredMarkers = [
      "결제 승인 대기",
      "서버 승인 단계는 아직 연결되지",
      "개발 검증용 임시 화면",
      "orderId",
      "amount",
      "paymentKeyReceived",
    ];
    const blockedMarkers = [
      "/api/payments/toss/confirm",
      "/v1/" + "payments/confirm",
      "fetch" + "(",
      "TOSS" + "_SECRET" + "_KEY",
      "NEXT" + "_PUBLIC" + "_TOSS" + "_SECRET" + "_KEY",
      "mark" + "Paid",
      "share" + "Token",
      "access" + "TokenHash",
      "report" + "_snapshot",
      "service" + "_role",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }

    for (const marker of blockedMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
