import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(process.cwd(), "src/app/reports/[reportId]/CareerReportView.tsx"),
  "utf8",
);

describe("CareerReportView source", () => {
  it("renders product title without visible v1.0", () => {
    expect(source).toContain("직업·커리어·금전·학업 리포트");
    expect(source).not.toContain("직업·커리어·금전·학업 리포트 v1.0");
  });

  it("renders main career report sections", () => {
    expect(source).toContain("잘 맞는 직업 추천");
    expect(source).toContain("덜 맞는 직무·환경");
    expect(source).toContain("돈 버는 방식");
    expect(source).toContain("투자·저축 성향");
    expect(source).toContain("학업·자격증·포트폴리오 전략");
    expect(source).toContain("바로 실행할 액션 플랜");
  });

  it("renders investment disclaimer and action plan labels", () => {
    expect(source).toContain("investmentAndSavingStyle.forbiddenNote");
    expect(source).toContain("draft.actionPlan.map");
    expect(source).toContain("첫 행동:");
  });

  it("does not render hard deterministic claim examples", () => {
    expect(source).not.toContain("반드시");
    expect(source).not.toContain("무조건");
    expect(source).not.toContain("돈을 법니다");
    expect(source).not.toContain("투자 수익이 납니다");
  });
});
