import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readDoc(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

const decisionRecord = readDoc(
  "docs/launch/CONCRETE_PERSISTENCE_PROVIDER_DECISION_RECORD.md",
);

describe("concrete persistence provider decision record source", () => {
  it("includes required sections", () => {
    const headings = [
      "# 결리포트 Concrete Persistence Provider Decision Record",
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
      "in-memory adapter",
      "tests/dev only",
      "production DB",
      "access token hash utility",
      "payment는 비활성 상태다.",
    ];

    for (const marker of markers) {
      expect(decisionRecord).toContain(marker);
    }
  });

  it("compares candidates", () => {
    const markers = [
      "Supabase",
      "Postgres",
      "Firebase",
      "Firestore",
      "structured query",
      "schema clarity",
      "Next.js",
      "small-scale",
      "backup/export",
      "access control",
      "future payment linkage",
    ];

    for (const marker of markers) {
      expect(decisionRecord).toContain(marker);
    }
  });

  it("locks first recommendation without implementation claims", () => {
    expect(decisionRecord).toContain(
      "Supabase/Postgres를 1차 production persistence 후보로 둔다.",
    );

    const implementationClaims = [
      "production DB is implemented",
      "Supabase implemented",
      "DB 구현 완료",
    ];

    for (const claim of implementationClaims) {
      expect(decisionRecord).not.toContain(claim);
    }
  });

  it("locks selection reasons", () => {
    const markers = [
      "report, order, payment linkage",
      "관계형",
      "schema draft",
      "table field",
      "admin, export, query",
      "SQL",
      "provider-neutral adapter",
      "low-scale launch",
    ];

    for (const marker of markers) {
      expect(decisionRecord).toContain(marker);
    }
  });

  it("locks implementation and exclusion scope", () => {
    const markers = [
      "reports table",
      "payment linkage fields",
      "accessTokenHash fields",
      "`create`, `update`, `find`, `softDelete`, `list` adapter",
      "typed error mapping",
      "adapter tests",
      "payment provider implementation",
      "paid unlock API",
      "admin console",
      "analytics",
      "final policy copy replacement",
      "raw card data storage",
    ];

    for (const marker of markers) {
      expect(decisionRecord).toContain(marker);
    }
  });

  it("locks risks and pre-decision checks", () => {
    const markers = [
      "migration design",
      "env/secrets separation",
      "retention/deletion policy",
      "backup/export plan",
      "adapter interface",
      "Supabase project setup",
      "production environment variables",
      "access policy",
      "local/dev test strategy",
      "release check",
      "manual QA",
    ];

    for (const marker of markers) {
      expect(decisionRecord).toContain(marker);
    }
  });

  it("locks next tasks", () => {
    const markers = [
      "58B",
      "58C",
      "58D",
      "58E",
      "59A",
      "Supabase schema migration draft",
      "Supabase persistence adapter skeleton",
      "Supabase persistence adapter tests",
      "choose concrete payment provider",
    ];

    for (const marker of markers) {
      expect(decisionRecord).toContain(marker);
    }
  });
});
