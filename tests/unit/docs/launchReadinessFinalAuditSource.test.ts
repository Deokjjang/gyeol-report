import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readDoc(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

const finalAudit = readDoc("docs/launch/LAUNCH_READINESS_FINAL_AUDIT.md");

describe("launch readiness final audit source", () => {
  it("includes required sections", () => {
    const headings = [
      "# 결리포트 Launch Readiness Final Audit",
      "## 1. 목적",
      "## 2. 현재 완료된 기반",
      "## 3. 아직 완료되지 않은 항목",
      "## 4. 출시 가능 범위",
      "## 5. 출시 불가 범위",
      "## 6. 자동 검증 상태",
      "## 7. 수동 QA 필요 항목",
      "## 8. 결제 상태 판정",
      "## 9. 저장소 상태 판정",
      "## 10. 정책/고객지원 상태 판정",
      "## 11. 주요 리스크",
      "## 12. Go/No-Go 기준",
      "## 13. 다음 개발 Task 제안",
    ];

    for (const heading of headings) {
      expect(finalAudit).toContain(heading);
    }
  });

  it("separates preview launch from paid launch", () => {
    const markers = [
      "preview launch",
      "paid launch",
      "internal/dev preview",
      "private QA",
      "paid public launch",
      "real purchase/unlock",
    ];

    for (const marker of markers) {
      expect(finalAudit).toContain(marker);
    }
  });

  it("locks completed foundations", () => {
    const markers = [
      "report generation preview",
      "policy placeholder pages",
      "payment inactive UI guard",
      "provider-neutral payment types",
      "provider-neutral persistence types",
      "tests",
      "lint",
      "build",
    ];

    for (const marker of markers) {
      expect(finalAudit).toContain(marker);
    }
  });

  it("locks incomplete items", () => {
    const markers = [
      "real payment provider",
      "production persistence provider",
      "final legal/policy copy",
      "production hosting/deployment",
      "manual QA execution",
      "refund/support operation process",
      "pricing final confirmation",
    ];

    for (const marker of markers) {
      expect(finalAudit).toContain(marker);
    }
  });

  it("locks automated verification commands", () => {
    const commands = [
      "pnpm test",
      "pnpm lint",
      "pnpm build",
      "pnpm release:check",
    ];

    for (const command of commands) {
      expect(finalAudit).toContain(command);
    }
  });

  it("locks payment storage and policy status", () => {
    const markers = [
      "in-memory adapter",
      "tests/dev only",
      "real payment provider는 활성화되어 있지 않다",
      "paid unlock",
      "production DB는 활성화되어 있지 않다",
      "access token/hash strategy",
      "official@dvem.ai",
    ];

    for (const marker of markers) {
      expect(finalAudit).toContain(marker);
    }
  });

  it("locks Go and No-Go criteria", () => {
    const markers = [
      "Go",
      "No-Go",
      "release check",
      "manual QA",
      "payment",
      "persistence",
      "policy",
      "support",
      "refund",
    ];

    for (const marker of markers) {
      expect(finalAudit).toContain(marker);
    }
  });

  it("avoids completion or approval claims", () => {
    const completionClaims = [
      "launch approved",
      "paid launch approved",
      "결제 연동 완료",
      "production DB 구현 완료",
      "법률 검토 완료",
    ];

    for (const claim of completionClaims) {
      expect(finalAudit).not.toContain(claim);
    }
  });
});
