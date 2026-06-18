import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const viewSource = readFileSync(
  join(process.cwd(), "src/app/reports/[reportId]/AnnualFortuneReportView.tsx"),
  "utf8",
);

describe("AnnualFortuneReportView source", () => {
  it("renders annual fortune hero and year structure table labels", () => {
    expect(viewSource).toContain("세운 리포트 v1.0");
    expect(viewSource).toContain("연도 구조");
    expect(viewSource).toContain("연도");
    expect(viewSource).toContain("간지");
    expect(viewSource).toContain("천간");
    expect(viewSource).toContain("지지");
    expect(viewSource).toContain("오행");
    expect(viewSource).toContain("십성");
    expect(viewSource).toContain("현재 모드");
    expect(viewSource).toContain("丙");
    expect(viewSource).toContain("午");
    expect(viewSource).toContain("양화");
    expect(viewSource).toContain("draft.yearSummary.ganji");
    expect(viewSource).toContain("draft.yearSummary.tenGodLabel");
  });

  it("renders report sections, monthly flow, final advice, and safety notes", () => {
    expect(viewSource).toContain("annualFortuneFlowAreaLabels");
    expect(viewSource).toContain("일·성과");
    expect(viewSource).toContain("돈·현실");
    expect(viewSource).toContain("인간관계");
    expect(viewSource).toContain("연애·가족");
    expect(viewSource).toContain("학업·자격증");
    expect(viewSource).toContain("몸·생활 리듬");
    expect(viewSource).toContain("draft.flowCards.map");
    expect(viewSource).toContain("draft.keySignals.map");
    expect(viewSource).toContain("draft.annualStructure.ganjiExplanation");
    expect(viewSource).toContain("draft.chapters.map");
    expect(viewSource).toContain("chapter.likelyScenes");
    expect(viewSource).toContain("chapter.practicalAdvice");
    expect(viewSource).toContain("draft.monthlyFlow.map");
    expect(viewSource).toContain("월별 운영 가이드");
    expect(viewSource).toContain("월 간지:");
    expect(viewSource).toContain("기준:");
    expect(viewSource).toContain("getMonthlyBasisDisplayLabel");
    expect(viewSource).toContain("달력월 기준 운영 가이드");
    expect(viewSource).toContain("월별 흐름은 달력월 기준 운영 가이드입니다");
    expect(viewSource).toContain(
      "실제 체감 시점은 절기와 개인 일정에 따라 조금 달라질 수 있습니다",
    );
    expect(viewSource).not.toContain("추후 고도화");
    expect(viewSource).toContain("원국과의 작용:");
    expect(viewSource).not.toContain("calendar_month_approximation");
    expect(viewSource).toContain("buildAnnualDomainLockedFinalAdvice");
    expect(viewSource).toContain("domainLockedFinalAdvice.map");
    expect(viewSource).toContain("안전 안내");
  });

  it("renders annual fortune product labels without raw score or signal wording", () => {
    expect(viewSource).toContain("getAnnualFlowIndexHeading");
    expect(viewSource).toContain("올해 흐름 지표");
    expect(viewSource).toContain("회고 흐름 지표");
    expect(viewSource).toContain("신년 흐름 지표");
    expect(viewSource).toContain("draft.scoreSummary.flowIndex");
    expect(viewSource).toContain("draft.scoreSummary.flowTypeLabel");
    expect(viewSource).toContain("draft.scoreSummary.flowIndexCaution");
    expect(viewSource).toContain("getHeroPersonLabel");
    expect(viewSource).toContain("heroPersonLabel");
    expect(viewSource).toContain("getHeroDayMasterLabel");
    expect(viewSource).toContain("甲(갑목) 일간");
    expect(viewSource).toContain("기준으로 해석");
    expect(viewSource).not.toContain("개발·서비스 기획 직장인 · 甲(갑목) 일간 · 직장인");
    expect(viewSource).not.toContain("甲일간 직장인");
    expect(viewSource).toContain("userContextSummary");
    expect(viewSource).not.toContain("세운 흐름 점수");
    expect(viewSource).not.toContain("draft.scoreSummary.totalScore");
    expect(viewSource).not.toContain("관심영역");
    expect(viewSource).toContain("getAnnualFlowMetricLabel");
    expect(viewSource).toContain("활성도");
    expect(viewSource).toContain("주의도");
    expect(viewSource).toContain("getAnnualKeySignalDisplayLabel");
    expect(viewSource).toContain("기회 신호");
    expect(viewSource).toContain("부담 신호");
    expect(viewSource).not.toContain("실행 기준");
  });
});
