import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(process.cwd(), "src/app/reports/[reportId]/CareerReportView.tsx"),
  "utf8",
);

describe("CareerReportView source", () => {
  it("renders product title without visible v1.0", () => {
    expect(source).toContain("직업·커리어·돈·학업 리포트");
    expect(source).not.toContain("직업·커리어·돈·학업 리포트 v1.0");
  });

  it("renders launch-ready semantic career report sections", () => {
    const requiredMarkers = [
      'data-career-report-section="report_header"',
      "data-career-report-section={id}",
      "common_tables",
      "핵심 요약",
      "직업 정체성",
      "돈 관리 성향",
      "투자 성향",
      "공부/자격증 전략",
      "추천 직업",
      "피해야 할 직무/환경",
      "action plan",
      "safety notes",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }
  });

  it("keeps common table slots ready without requiring result data yet", () => {
    const requiredMarkers = [
      "manseRyeokTable?: ReactNode",
      "mbtiProfileTable?: ReactNode",
      "renderCommonTableArea",
      "renderTableSlot",
      "공통 만세력표",
      "공통 MBTI표",
      "표 데이터를 prop으로 받으면 그대로 렌더링",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }
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
