import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readDoc(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("payment inactive API contract source", () => {
  const docPath = "docs/launch/PAYMENT_INACTIVE_API_CONTRACT.md";

  it("includes required sections", () => {
    const doc = readDoc(docPath);
    const headings = [
      "# 결리포트 Payment Inactive API Contract",
      "## 1. 목적",
      "## 2. 현재 전제",
      "## 3. Launch flag 기본값",
      "## 4. Toss webhook route 현재 계약",
      "## 5. Paid unlock route 현재 계약",
      "## 6. 현재 금지 동작",
      "## 7. 향후 활성화 전 변경 조건",
      "## 8. 테스트 기준",
      "## 9. 다음 개발 Task 제안",
    ];

    for (const heading of headings) {
      expect(doc).toContain(heading);
    }
  });

  it("locks current assumptions", () => {
    const doc = readDoc(docPath);
    const markers = [
      "payment remains inactive",
      "real payment provider is not implemented",
      "production persistence is not connected",
      "webhook route is skeleton only",
      "paid unlock route is skeleton only",
    ];

    for (const marker of markers) {
      expect(doc).toContain(marker);
    }
  });

  it("locks launch flag defaults", () => {
    const doc = readDoc(docPath);
    const markers = [
      "PAYMENT_ENABLED=false",
      "PAID_UNLOCK_ENABLED=false",
      "PUBLIC_PAID_LAUNCH_ENABLED=false",
      "INTERNAL_PREVIEW_ENABLED=true",
    ];

    for (const marker of markers) {
      expect(doc).toContain(marker);
    }
  });

  it("locks Toss webhook disabled API contract", () => {
    const doc = readDoc(docPath);
    const markers = [
      "POST /api/payments/toss/webhook",
      "HTTP 503",
      "ok: false",
      "code: PAYMENT_DISABLED",
      "messageKo: 현재 결제 기능은 활성화되어 있지 않습니다.",
      "no request body parsing",
      "no provider verification",
      "no persistence mutation",
      "no report unlock",
    ];

    for (const marker of markers) {
      expect(doc).toContain(marker);
    }
  });

  it("locks paid unlock disabled API contract", () => {
    const doc = readDoc(docPath);
    const markers = [
      "POST /api/reports/unlock",
      "HTTP 503",
      "ok: false",
      "code: PAID_UNLOCK_DISABLED",
      "messageKo: 현재 유료 리포트 잠금 해제 기능은 활성화되어 있지 않습니다.",
      "no request body parsing",
      "no payment verification",
      "no persistence mutation",
      "no access token issuance",
    ];

    for (const marker of markers) {
      expect(doc).toContain(marker);
    }
  });

  it("locks prohibited current behaviors", () => {
    const doc = readDoc(docPath);
    const markers = [
      "no payment checkout",
      "no provider API call",
      "no webhook processing",
      "no paid unlock execution",
      "no production persistence write",
      "no plaintext access token issuance",
      "no raw card data storage",
    ];

    for (const marker of markers) {
      expect(doc).toContain(marker);
    }
  });

  it("locks future activation conditions", () => {
    const doc = readDoc(docPath);
    const markers = [
      "production persistence ready",
      "payment provider test flow verified",
      "webhook verification implemented",
      "paid unlock verification implemented",
      "policy/refund/support copy reviewed",
      "release check pass",
      "manual QA pass",
      "launch flag switch reviewed",
    ];

    for (const marker of markers) {
      expect(doc).toContain(marker);
    }
  });

  it("locks test standards", () => {
    const doc = readDoc(docPath);
    const markers = [
      "launch flag utility tests",
      "source tests for webhook route",
      "source tests for paid unlock route",
      "runtime tests for disabled route responses",
      "UI boundary tests for payment inactive notices",
      "release check",
    ];

    for (const marker of markers) {
      expect(doc).toContain(marker);
    }
  });

  it("locks next tasks and avoids implementation claims", () => {
    const doc = readDoc(docPath);
    const nextTaskMarkers = [
      "61L",
      "62A",
      "62B",
      "62C",
      "63A",
      "Supabase row mapper task spec",
      "Supabase row mapper implementation",
      "Supabase row mapper tests",
      "production Supabase adapter implementation",
    ];
    const overclaimMarkers = [
      "payment is implemented",
      "paid launch ready",
      "production persistence is implemented",
      "결제 연동 완료",
      "유료 출시 준비 완료",
      "production DB 구현 완료",
    ];

    for (const marker of nextTaskMarkers) {
      expect(doc).toContain(marker);
    }

    for (const marker of overclaimMarkers) {
      expect(doc).not.toContain(marker);
    }
  });
});
