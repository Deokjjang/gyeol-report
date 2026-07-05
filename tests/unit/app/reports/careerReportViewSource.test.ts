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
      "myeongli_signal_basis",
      "핵심 요약",
      "직업 정체성",
      "돈 관리 성향",
      "투자 성향",
      "공부/자격증 전략",
      "추천 직업",
      "피해야 할 직무/환경",
      "실행 기준",
      "안전 안내",
      "참고 기준",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }
  });

  it("keeps common table slots ready without requiring result data yet", () => {
    const requiredMarkers = [
      "manseRyeokTable?: ReactNode",
      "mbtiProfileTable?: ReactNode",
      "evidencePacket?: CareerReportEvidencePacket",
      "CareerReportManseRyeokTable",
      "CareerReportMbtiProfileTable",
      "resolvedManseRyeokTable",
      "resolvedMbtiProfileTable",
      "renderCommonTableArea",
      "renderTableSlot",
      "공통 만세력표",
      "공통 MBTI표",
      "원국과 MBTI 행동층",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }
  });

  it("renders investment disclaimer and action plan labels", () => {
    expect(source).toContain("investmentAndSavingStyle.forbiddenNote");
    expect(source).toContain("draft.actionPlan.map");
    expect(source).toContain("바로 할 일");
    expect(source).not.toContain("첫 행동:");
  });

  it("uses stable timing keys when a year appears more than once", () => {
    expect(source).toContain("draft.careerTiming.map((timing, index)");
    expect(source).toContain("`${timing.year}-${timing.label}-${index}`");
    expect(source).not.toContain("key={timing.year}");
  });

  it("maps internal classifications to public labels", () => {
    expect(source).toContain("displayArchetypeLabel");
    expect(source).toContain("operator_planner: \"운영형 기획자\"");
    expect(source).toContain("value.includes(\"_\") ? \"직업 성향\" : value");
    expect(source).not.toContain("상품 · career money study");
    expect(source).not.toContain("profile tables");
  });

  it("does not render hard deterministic claim examples", () => {
    expect(source).not.toContain("반드시");
    expect(source).not.toContain("무조건");
    expect(source).not.toContain("돈을 법니다");
    expect(source).not.toContain("투자 수익이 납니다");
  });
});
