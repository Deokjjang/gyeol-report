import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const viewSource = readFileSync(
  join(process.cwd(), "src/app/reports/[reportId]/AnnualFortuneReportView.tsx"),
  "utf8",
);

describe("AnnualFortuneReportView source", () => {
  it("renders annual fortune hero and year structure table labels", () => {
    expect(viewSource).toContain("세운 리포트");
    expect(viewSource).toContain("overflow-x-hidden break-words");
    expect(viewSource).toContain("max-w-4xl break-words");
    expect(viewSource).not.toContain("세운 리포트 v1.0");
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
    expect(viewSource).toContain("직업·일");
    expect(viewSource).toContain("돈·자원");
    expect(viewSource).toContain("관계·연애");
    expect(viewSource).toContain("건강관리·생활 리듬");
    expect(viewSource).toContain("사회·가족");
    expect(viewSource).toContain("공부·성장");
    expect(viewSource).toContain("renderYearAccessNotice");
    expect(viewSource).toContain("조회 가능 연도 안내");
    expect(viewSource).toContain("renderCommonFoundation");
    expect(viewSource).toContain("ManseRyeokCommonTable");
    expect(viewSource).toContain("MbtiCommonProfileTable");
    expect(viewSource).toContain('className="max-w-full overflow-x-auto"');
    expect(viewSource).toContain("defaultOpen={false}");
    expect(viewSource).toContain("buildAnnualFortuneReportManseRyeokTableData");
    expect(viewSource).toContain("buildAnnualFortuneReportMbtiProfileTableData");
    expect(viewSource).toContain("renderAnnualFortuneSummary");
    expect(viewSource).toContain("renderMajorAnnualCross");
    expect(viewSource).toContain("renderNatalAnnualRelations");
    expect(viewSource).toContain("SaeunFortuneTable");
    expect(viewSource).toContain("buildSaeunFortuneTableData");
    expect(viewSource).toContain("renderSaeunFortuneTable");
    expect(viewSource).toContain("draft.yearSummary.ganji.length === 0");
    expect(viewSource).toContain("annualFortune");
    expect(viewSource).toContain("majorAnnualCross");
    expect(viewSource).toContain("natalAnnualRelations");
    expect(viewSource).toContain("monthlyFortunes");
    expect(viewSource).toContain("domainFlows");
    expect(viewSource).toContain("draft.chapters.map");
    expect(viewSource).toContain("chapter.likelyScenes");
    expect(viewSource).toContain("chapter.practicalAdvice");
    expect(viewSource).toContain("draft.monthlyFlow.map");
    expect(viewSource).toContain("월운 12개월 흐름");
    expect(viewSource).toContain("월별 운영 리듬");
    expect(viewSource).toContain("renderMonthlyFortuneReading");
    expect(viewSource).toContain("getMonthlyBasisDisplayLabel");
    expect(viewSource).toContain("getAnnualMonthlyCardBasisLabel");
    expect(viewSource).toContain("getAnnualMonthlySectionBasisNote");
    expect(viewSource).toContain("getAnnualMonthlySectionBasisNote");
    expect(viewSource).toContain("getMonthlyBasisDisplayLabel(flow.monthlyBasis)");
    expect(viewSource).toContain("flow.monthGanji === null ? undefined");
    expect(viewSource).toContain("{renderSaeunFortuneTable(draft, evidencePacket)}");
    expect(viewSource).not.toContain(
      "기준: 월별 흐름은 달력월 기준 운영 가이드입니다",
    );
    expect(viewSource).not.toContain("추후 고도화");
    expect(viewSource).toContain("원국과 세운 관계");
    expect(viewSource).not.toContain("calendar_month_approximation");
    expect(viewSource).toContain("buildAnnualDomainLockedFinalAdvice");
    expect(viewSource).toContain("domainLockedFinalAdvice.map");
    expect(viewSource).toContain("renderRiskAndActionSections");
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
    expect(viewSource).toContain("shouldRenderOpeningTitle");
    expect(viewSource).toContain("renderOpeningTitle");
    expect(viewSource).toContain("heroPersonLabel");
    expect(viewSource).toContain("getHeroDayMasterLabel");
    expect(viewSource).toContain("甲(갑목) 일간");
    expect(viewSource).toContain("선택 연도 흐름과 현재 대운 교차를 함께 읽는 리포트");
    expect(viewSource).toContain("draft.yearSummary.displayTitle");
    expect(viewSource).toContain("draft.yearSummary.modeLabel");
    expect(viewSource).not.toContain("개발·서비스 기획 직장인 · 甲(갑목) 일간 · 직장인");
    expect(viewSource).not.toContain("甲일간 직장인");
    expect(viewSource).not.toContain("{heroPersonLabel}\n            </span>");
    expect(viewSource.match(/heroPersonLabel/g)?.length ?? 0).toBeLessThanOrEqual(3);
    expect(viewSource).toContain("userContextSummary");
    expect(viewSource).not.toContain("세운 흐름 점수");
    expect(viewSource).not.toContain("draft.scoreSummary.totalScore");
    expect(viewSource).not.toContain("관심영역");
    expect(viewSource).toContain("영역별 흐름");
    expect(viewSource).toContain("MBTI 성향 발현 방식");
    expect(viewSource).toContain("조심할 패턴");
    expect(viewSource).toContain("실행 기준");
    expect(viewSource).not.toContain("bridgeEvidence");
    expect(viewSource).not.toContain("productKey");
    expect(viewSource).not.toContain("source registry");
  });
});
