import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readDoc(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

const decisionRecord = readDoc(
  "docs/launch/CONCRETE_PAYMENT_PROVIDER_DECISION_RECORD.md",
);

describe("concrete payment provider decision record source", () => {
  it("includes required sections", () => {
    const headings = [
      "# 결리포트 Concrete Payment Provider Decision Record",
      "## 1. 목적",
      "## 2. 현재 전제",
      "## 3. 후보 비교 요약",
      "## 4. 1차 권장 선택",
      "## 5. 선택 이유",
      "## 6. 선택 시 구현 범위",
      "## 7. 선택하지 않는 범위",
      "## 8. 리스크와 보완책",
      "## 9. 결정 전 확인 사항",
      "## 10. 다음 개발 Task 제안",
    ];

    for (const heading of headings) {
      expect(decisionRecord).toContain(heading);
    }
  });

  it("locks current assumptions", () => {
    const markers = [
      "provider-neutral",
      "payment adapter interface",
      "in-memory payment adapter",
      "tests/dev only",
      "real payment provider",
      "paid unlock API",
      "payment는 UI에서 비활성 상태다.",
      "production persistence",
    ];

    for (const marker of markers) {
      expect(decisionRecord).toContain(marker);
    }
  });

  it("compares payment candidates", () => {
    const markers = [
      "Toss Payments",
      "KakaoPay PG",
      "Paddle",
      "manual/internal only",
      "Korean domestic checkout fit",
      "developer integration complexity",
      "settlement/tax/admin burden",
      "refund handling",
      "mobile UX",
      "future Japan/global expansion",
      "policy/support readiness",
      "persistence/payment linkage",
    ];

    for (const marker of markers) {
      expect(decisionRecord).toContain(marker);
    }
  });

  it("locks first recommendation and boundaries", () => {
    expect(decisionRecord).toContain(
      "Toss Payments를 한국 V1 유료 결제의 1차 payment provider 후보로 둔다.",
    );

    const boundaryMarkers = [
      "manual/internal only",
      "paid public launch",
      "Paddle",
      "Japan/global",
      "KakaoPay PG",
      "secondary/alternative",
    ];

    for (const marker of boundaryMarkers) {
      expect(decisionRecord).toContain(marker);
    }

    const implementationClaims = [
      "payment is implemented",
      "paid launch ready",
      "Toss implemented",
      "결제 연동 완료",
      "유료 출시 준비 완료",
      "Toss 구현 완료",
    ];

    for (const claim of implementationClaims) {
      expect(decisionRecord).not.toContain(claim);
    }
  });

  it("locks selection reasons", () => {
    const markers = [
      "KR-first launch",
      "card/mobile checkout",
      "provider-neutral payment adapter",
      "payment order ID",
      "provider payment ID",
      "Supabase/Postgres",
      "payment metadata",
      "small-scale launch",
      "운영 복잡도",
    ];

    for (const marker of markers) {
      expect(decisionRecord).toContain(marker);
    }
  });

  it("locks implementation and exclusion scope", () => {
    const markers = [
      "create payment session",
      "confirm payment",
      "cancel/refund",
      "webhook handling design",
      "payment order persistence linkage",
      "paid unlock transition",
      "typed error mapping",
      "tests",
      "raw card data",
      "Japan/global payment support",
      "Paddle integration",
      "KakaoPay PG integration",
      "admin console automation",
      "accounting automation",
      "final legal/support policy replacement",
    ];

    for (const marker of markers) {
      expect(decisionRecord).toContain(marker);
    }
  });

  it("locks risks and pre-decision checks", () => {
    const markers = [
      "provider contract/account setup",
      "webhook verification",
      "refund/support flow",
      "failure, retry, idempotency",
      "policy/legal copy review",
      "persistence dependency",
      "payment inactive",
      "Toss account/project setup",
      "test keys/secrets management",
      "webhook endpoint plan",
      "redirect/callback URL plan",
      "refund policy copy",
      "privacy/terms/payment copy",
      "persistence linkage ready",
      "release check",
      "manual QA",
    ];

    for (const marker of markers) {
      expect(decisionRecord).toContain(marker);
    }
  });

  it("locks next tasks", () => {
    const markers = [
      "59B",
      "59C",
      "59D",
      "59E",
      "60A",
      "Toss payment integration task spec",
      "paid unlock API implementation plan",
      "payment webhook design draft",
      "production persistence adapter implementation plan",
    ];

    for (const marker of markers) {
      expect(decisionRecord).toContain(marker);
    }
  });
});
