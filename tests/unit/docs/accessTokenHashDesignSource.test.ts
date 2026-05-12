import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readDoc(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

const designDoc = readDoc("docs/launch/ACCESS_TOKEN_HASH_DESIGN.md");

describe("access token hash design source", () => {
  it("includes required sections", () => {
    const headings = [
      "# 결리포트 Access Token Hash Design",
      "## 1. 목적",
      "## 2. 현재 상태",
      "## 3. Access Token 역할",
      "## 4. 저장 원칙",
      "## 5. Hash 전략",
      "## 6. 조회 흐름",
      "## 7. 만료/회전/재발급",
      "## 8. 보안 주의사항",
      "## 9. Persistence Schema 반영 후보",
      "## 10. 구현 전 차단 조건",
      "## 11. 다음 개발 Task 제안",
    ];

    for (const heading of headings) {
      expect(designDoc).toContain(heading);
    }
  });

  it("locks current token state", () => {
    const markers = [
      "createReportAccessToken()",
      "rpat_",
      "token hash",
      "in-memory adapter",
      "production DB",
    ];

    for (const marker of markers) {
      expect(designDoc).toContain(marker);
    }
  });

  it("rejects plaintext production storage", () => {
    const markers = [
      "plaintext",
      "hash만 저장",
      "logs",
      "support 또는 admin view",
    ];

    for (const marker of markers) {
      expect(designDoc).toContain(marker);
    }
  });

  it("locks lookup flow", () => {
    const markers = [
      "reportId",
      "access token",
      "format을 검증",
      "token hash",
      "stored hash",
      "status",
      "accessMode",
      "payment linkage",
      "access denied",
    ];

    for (const marker of markers) {
      expect(designDoc).toContain(marker);
    }
  });

  it("locks rotation and security notes", () => {
    const markers = [
      "token rotation",
      "old hash",
      "deleted report",
      "analytics",
      "HTTPS",
      "rate limiting",
      "payment proof",
    ];

    for (const marker of markers) {
      expect(designDoc).toContain(marker);
    }
  });

  it("locks candidate schema fields and blockers", () => {
    const markers = [
      "accessTokenHash",
      "accessTokenCreatedAt",
      "accessTokenRotatedAt",
      "accessTokenVersion",
      "secret 또는 pepper",
      "logging redaction",
      "test vectors",
      "release check",
    ];

    for (const marker of markers) {
      expect(designDoc).toContain(marker);
    }
  });

  it("avoids implementation claims", () => {
    const implementationClaims = [
      "hash implementation exists",
      "token hash implemented",
      "production token storage complete",
      "토큰 해시 구현 완료",
      "production DB 구현 완료",
    ];

    for (const claim of implementationClaims) {
      expect(designDoc).not.toContain(claim);
    }
  });
});
