import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readDoc(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

const preparationDoc = readDoc("docs/launch/FINAL_POLICY_COPY_PREPARATION.md");

describe("final policy copy preparation source", () => {
  it("includes required sections", () => {
    const headings = [
      "# 결리포트 Final Policy Copy Preparation",
      "## 1. 목적",
      "## 2. 현재 상태",
      "## 3. 이용약관 준비 항목",
      "## 4. 개인정보 처리방침 준비 항목",
      "## 5. 환불 안내 준비 항목",
      "## 6. 결제/영수증 문구 준비 항목",
      "## 7. 고객지원 문구 준비 항목",
      "## 8. 리포트 해석 고지 문구 준비 항목",
      "## 9. 출시 전 검토 체크리스트",
      "## 10. 페이지 반영 전 차단 조건",
      "## 11. 다음 개발 Task 제안",
    ];

    for (const heading of headings) {
      expect(preparationDoc).toContain(heading);
    }
  });

  it("locks current placeholder and payment state", () => {
    const markers = [
      "placeholder",
      "payment는 비활성 상태",
      "production persistence",
      "official@dvem.ai",
      "final legal, payment, refund review",
    ];

    for (const marker of markers) {
      expect(preparationDoc).toContain(marker);
    }
  });

  it("locks terms preparation scope", () => {
    const markers = [
      "service description",
      "user input responsibility",
      "digital content",
      "account 또는 payment access",
      "service limitation",
      "support/contact",
    ];

    for (const marker of markers) {
      expect(preparationDoc).toContain(marker);
    }
  });

  it("locks privacy preparation scope", () => {
    const markers = [
      "birth date",
      "birth time",
      "calendar type",
      "optional gender",
      "optional MBTI",
      "report generation",
      "payment provider",
      "raw card data",
      "retention/deletion",
      "third-party/provider",
    ];

    for (const marker of markers) {
      expect(preparationDoc).toContain(marker);
    }
  });

  it("locks refund and receipt scope", () => {
    const markers = [
      "payment failure",
      "paid report",
      "duplicate payment",
      "refund request",
      "refund processing window",
      "digital content",
      "provider name",
      "orderId",
      "reportId",
      "amount/currency",
      "paidAt",
      "refundedAt",
      "receipt/support",
    ];

    for (const marker of markers) {
      expect(preparationDoc).toContain(marker);
    }
  });

  it("locks support and report interpretation notice scope", () => {
    const markers = [
      "official@dvem.ai",
      "reportId",
      "orderId",
      "issue description",
      "response time policy",
      "manual support",
      "reference와 self-understanding",
      "medical, legal, financial advice",
      "Saju/MBTI",
      "major decisions",
    ];

    for (const marker of markers) {
      expect(preparationDoc).toContain(marker);
    }
  });

  it("locks blockers and next tasks", () => {
    const markers = [
      "payment provider",
      "production persistence",
      "retention/deletion policy",
      "refund process",
      "support process",
      "release check",
      "manual QA",
      "55A",
      "final public policy page replacement",
    ];

    for (const marker of markers) {
      expect(preparationDoc).toContain(marker);
    }
  });

  it("avoids final approval claims", () => {
    const finalApprovalClaims = [
      "legal review complete",
      "paid launch ready",
      "final approval complete",
      "법률 검토 완료",
      "유료 출시 준비 완료",
      "정책 최종 승인 완료",
    ];

    for (const claim of finalApprovalClaims) {
      expect(preparationDoc).not.toContain(claim);
    }
  });
});
