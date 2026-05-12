import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readDoc(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

const checklist = readDoc("docs/launch/MANUAL_QA_CHECKLIST.md");

describe("manual QA checklist source", () => {
  it("includes required sections", () => {
    const headings = [
      "# 결리포트 Manual QA Checklist",
      "## 1. 목적",
      "## 2. QA 전제",
      "## 3. 실행 전 준비",
      "## 4. 홈 화면 QA",
      "## 5. 리포트 생성 화면 QA",
      "## 6. 입력 검증 QA",
      "## 7. 리포트 결과/미리보기 QA",
      "## 8. 정책 페이지 QA",
      "## 9. 결제 비활성 QA",
      "## 10. 모바일 QA",
      "## 11. 접근성/문구 QA",
      "## 12. 오류/복구 QA",
      "## 13. QA 결과 기록 양식",
      "## 14. 출시 전 차단 조건",
      "## 15. 다음 개발 Task 제안",
    ];

    for (const heading of headings) {
      expect(checklist).toContain(heading);
    }
  });

  it("locks release check command", () => {
    expect(checklist).toContain("pnpm release:check");
  });

  it("locks core route QA", () => {
    expect(checklist).toContain("`/` 경로가 정상적으로 열린다");
    expect(checklist).toContain("`/report/new`");
    expect(checklist).toContain("`/terms`");
    expect(checklist).toContain("`/privacy`");
    expect(checklist).toContain("`/refund`");
  });

  it("locks report creation scenarios", () => {
    const scenarios = [
      "양력 생년월일과 출생시간",
      "출생시간을 모르는 경우",
      "MBTI를 선택",
      "MBTI를 생략",
      "필수 생년월일",
    ];

    for (const scenario of scenarios) {
      expect(checklist).toContain(scenario);
    }
  });

  it("locks payment inactive and mobile QA", () => {
    const markers = [
      "실제 결제 provider 흐름",
      "카드나 결제 정보 입력 UI",
      "paid unlock",
      "360px",
      "가로 overflow",
    ];

    for (const marker of markers) {
      expect(checklist).toContain(marker);
    }
  });

  it("locks QA result table and blockers", () => {
    const markers = [
      "| 날짜 | 환경 | 경로 | 시나리오 | 결과 | 이슈 | 조치 |",
      "release check",
      "리포트 생성 흐름",
      "정책 페이지 라우트",
      "결제 문구",
      "모바일 화면",
      "문의 이메일",
    ];

    for (const marker of markers) {
      expect(checklist).toContain(marker);
    }
  });

  it("avoids QA completion claims", () => {
    const completionClaims = [
      "QA 완료",
      "출시 승인 완료",
      "결제 검수 완료",
    ];

    for (const claim of completionClaims) {
      expect(checklist).not.toContain(claim);
    }
  });
});
