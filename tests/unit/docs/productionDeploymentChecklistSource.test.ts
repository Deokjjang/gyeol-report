import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readDoc(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

const checklist = readDoc("docs/launch/PRODUCTION_DEPLOYMENT_CHECKLIST.md");

describe("production deployment checklist source", () => {
  it("includes required sections", () => {
    const headings = [
      "# 결리포트 Production Deployment Checklist",
      "## 1. 목적",
      "## 2. 현재 배포 전제",
      "## 3. 배포 전 필수 확인",
      "## 4. 환경 변수 및 비밀값",
      "## 5. 빌드/테스트 게이트",
      "## 6. 정책 페이지 확인",
      "## 7. 결제 비활성 상태 확인",
      "## 8. 리포트 생성/미리보기 QA",
      "## 9. 개인정보/저장소 경계",
      "## 10. 운영 연락/지원 경계",
      "## 11. 롤백 기준",
      "## 12. 배포 후 확인",
      "## 13. 남은 결정 사항",
      "## 14. 다음 개발 Task 제안",
    ];

    for (const heading of headings) {
      expect(checklist).toContain(heading);
    }
  });

  it("locks build and release commands", () => {
    const commands = [
      "pnpm test",
      "pnpm lint",
      "pnpm build",
      "pnpm release:check",
    ];

    for (const command of commands) {
      expect(checklist).toContain(command);
    }
  });

  it("locks core route coverage", () => {
    expect(checklist).toContain("`/`, `/report/new`, `/terms`, `/privacy`, `/refund`");
    expect(checklist).toContain("`/report/new`");
    expect(checklist).toContain("`/terms`");
    expect(checklist).toContain("`/privacy`");
    expect(checklist).toContain("`/refund`");
  });

  it("locks payment inactive boundary", () => {
    expect(checklist).toContain("실제 결제 unlock과 연결되어 있지 않다");
    expect(checklist).toContain("결제 비활성 상태 확인");
    expect(checklist).toContain("payment");
    expect(checklist).toContain("provider-neutral");
  });

  it("locks support and rollback markers", () => {
    const markers = [
      "official@dvem.ai",
      "롤백",
      "report creation flow가 깨진다",
      "policy routes가 접근되지 않는다",
      "payment/purchase copy가 실제 구매 가능 상태처럼 오해될 수 있다",
      "privacy/storage boundary가 기존 설계와 어긋난다",
    ];

    for (const marker of markers) {
      expect(checklist).toContain(marker);
    }
  });

  it("avoids deployment completion claims", () => {
    expect(checklist).toContain(
      "이 문서는 배포 완료나 법률/결제 검토 완료를 의미하지 않는다.",
    );
    expect(checklist).not.toContain("결제 연동 완료");
  });
});
