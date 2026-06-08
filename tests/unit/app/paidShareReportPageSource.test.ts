import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

const pageSource = readSource("src/app/r/[token]/page.tsx");

describe("paid share report page source", () => {
  it("uses the server-side paid lookup boundary and renders share-page states", () => {
    const requiredMarkers = [
      "findPaidReportByShareToken",
      "params",
      "token",
      "공유 링크로 열린 결리포트입니다",
      "사주와 MBTI로 읽는 나의 결",
      "리포트를 열 수 없습니다",
      "링크가 잘못되었거나",
      "주요 섹션",
    ];

    for (const marker of requiredMarkers) {
      expect(pageSource).toContain(marker);
    }
  });

  it("renders common report block kinds without raw JSON dumping", () => {
    const blockKindMarkers = [
      "PARAGRAPH",
      "BULLET_LIST",
      "HIGHLIGHT",
      "KEY_VALUE",
    ];

    for (const marker of blockKindMarkers) {
      expect(pageSource).toContain(marker);
    }
  });

  it("does not expose payment, token, hash, or secret markers", () => {
    const blockedMarkers = [
      "/api/" + "payments",
      "/api/" + "reports/unlock",
      "check" + "out",
      "To" + "ss",
      "Kakao" + "Pay",
      "service" + "_role",
      "SUPABASE" + "_SERVICE" + "_ROLE",
      "console" + ".log",
      "access" + "TokenHash",
      "access" + "_token" + "_hash",
      "payment" + "Provider" + "Payment" + "Id",
      "payment" + "_provider" + "_payment" + "_id",
      "share" + "Path",
      "share" + "Token",
      "JSON" + ".stringify",
    ];

    for (const marker of blockedMarkers) {
      expect(pageSource).not.toContain(marker);
    }
  });
});
