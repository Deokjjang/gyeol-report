import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readDoc(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

const copyAudit = readDoc("docs/launch/PRODUCTION_COPY_AUDIT.md");

describe("production copy audit source", () => {
  it("includes required sections", () => {
    const headings = [
      "# 결리포트 Production Copy Audit",
      "## 1. 목적",
      "## 2. 현재 카피 전제",
      "## 3. 공통 문구 원칙",
      "## 4. 홈 화면 카피 점검",
      "## 5. 리포트 생성 화면 카피 점검",
      "## 6. 리포트 결과/미리보기 카피 점검",
      "## 7. 정책 페이지 카피 점검",
      "## 8. 결제 비활성 카피 점검",
      "## 9. 금지/주의 표현",
      "## 10. 지원/문의 문구",
      "## 11. 출시 전 수정 후보",
      "## 12. 다음 개발 Task 제안",
    ];

    for (const heading of headings) {
      expect(copyAudit).toContain(heading);
    }
  });

  it("locks pre-launch and payment inactive assumptions", () => {
    const markers = [
      "출시 전",
      "실제 결제",
      "비활성",
      "정책 페이지",
      "placeholder",
    ];

    for (const marker of markers) {
      expect(copyAudit).toContain(marker);
    }
  });

  it("locks report framing", () => {
    const markers = [
      "참고",
      "자기이해",
      "사주",
      "MBTI",
      "고급 용어",
    ];

    for (const marker of markers) {
      expect(copyAudit).toContain(marker);
    }
  });

  it("locks checked surfaces", () => {
    const surfaces = [
      "홈 화면",
      "리포트 생성 화면",
      "리포트 결과/미리보기",
      "정책 페이지",
      "결제 비활성",
    ];

    for (const surface of surfaces) {
      expect(copyAudit).toContain(surface);
    }
  });

  it("locks support and launch revision candidates", () => {
    const markers = [
      "official@dvem.ai",
      "홈 CTA",
      "/report/new",
      "placeholder",
      "disclaimer",
      "모바일 화면",
    ];

    for (const marker of markers) {
      expect(copyAudit).toContain(marker);
    }
  });

  it("avoids completion claims", () => {
    const completionClaims = [
      "카피 검수 완료",
      "출시 승인 완료",
      "결제 활성화 완료",
      "법률 검토 완료",
    ];

    for (const claim of completionClaims) {
      expect(copyAudit).not.toContain(claim);
    }
  });

  it("avoids implementation markers", () => {
    const implementationMarkers = [
      "createPayment",
      "confirmPayment",
      "TossPayments",
      "Paddle",
      "fetch(",
      "process.env",
    ];

    for (const marker of implementationMarkers) {
      expect(copyAudit).not.toContain(marker);
    }
  });
});
