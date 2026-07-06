import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const viewSource = readFileSync(
  join(process.cwd(), "src/app/reports/[reportId]/MajorFortuneReportView.tsx"),
  "utf8",
);

describe("MajorFortuneReportView source", () => {
  it("uses the launch header and premium result tone", () => {
    expect(viewSource).toContain("대운 리포트");
    expect(viewSource).toContain("10년 흐름과 올해 세운 교차를 함께 읽는 리포트");
    expect(viewSource).toContain("bg-[#f6f0e7]");
    expect(viewSource).toContain("bg-[#fffaf1]");
    expect(viewSource).toContain("text-[#2b211b]");
    expect(viewSource).not.toContain("대운 리포트 v1.0");
    expect(viewSource).not.toContain("bg-neutral-900");
    expect(viewSource).not.toContain("bg-neutral-950");
  });

  it("renders common foundation table slots with user-facing fallbacks", () => {
    expect(viewSource).toContain("manseRyeokTable?: ReactNode");
    expect(viewSource).toContain("mbtiProfileTable?: ReactNode");
    expect(viewSource).toContain("renderCommonFoundation");
    expect(viewSource).toContain("ManseRyeokCommonTable");
    expect(viewSource).toContain("MbtiCommonProfileTable");
    expect(viewSource).toContain("buildMajorFortuneReportManseRyeokTableData");
    expect(viewSource).toContain("buildMajorFortuneReportMbtiProfileTableData");
    expect(viewSource).toContain("resolvedManseRyeokTable");
    expect(viewSource).toContain("resolvedMbtiProfileTable");
    expect(viewSource).toContain("기초 만세력");
    expect(viewSource).toContain("MBTI 성향표");
    expect(viewSource).toContain("MBTI는 대운의 원인이 아니라");
    expect(viewSource).toContain("items-start");
    expect(viewSource).toContain("대운 해석의 기준이 되는 사주 원국표입니다.");
    expect(viewSource).toContain("원국 데이터가 없는 결과라 대운표와 본문 해석을 중심으로 읽습니다.");
    expect(viewSource).not.toContain("기초 만세력은 입력 원국 데이터가 연결된 결과에서 표시됩니다.");
    expect(viewSource).not.toContain("draft 기준");
    expect(viewSource).not.toContain("공통 만세력표");
    expect(viewSource).not.toContain("공통 MBTI표");
    expect(viewSource).not.toContain("원국표 데이터가 연결되면");
  });

  it("prioritizes the launch evidence contract for the current cycle and annual cross", () => {
    expect(viewSource).toContain("evidencePacket?: MajorFortuneEvidencePacket");
    expect(viewSource).toContain("evidencePacket?.currentMajorFortune");
    expect(viewSource).toContain("현재 대운 요약");
    expect(viewSource).toContain("currentCycle?.keyTheme");
    expect(viewSource).toContain("formatFiveElementValues");
    expect(viewSource).toContain("earth: \"토\"");
    expect(viewSource).toContain("evidencePacket?.currentAnnualCross");
    expect(viewSource).toContain("현재 대운·올해 세운 교차");
    expect(viewSource).toContain("annualCross?.cycleToAnnualRelation");
    expect(viewSource).toContain("annualCross?.natalToAnnualRelation");
  });

  it("renders annual cross before the detailed ten-year table", () => {
    expect(viewSource).toContain("DaeunFortuneTable");
    expect(viewSource).toContain("buildDaeunFortuneTableData");
    expect(viewSource).toContain("renderDaeunFortuneTable");
    expect(viewSource).toContain("buildCurrentDaeunCycleInput");
    expect(viewSource).toContain("buildTimelineYearInputs");
    expect(viewSource).toContain("buildTimelineYearDetail");
    expect(viewSource).toContain("buildAnnualFortuneInputs");
    expect(viewSource).toContain("cycleBasedAge");
    expect(viewSource).toContain("displayAgeLabel");
    expect(viewSource).toContain("row.majorGanji");
    expect(viewSource).toContain("row.annualGanji");
    expect(viewSource.indexOf("{renderAnnualCross(draft, evidencePacket)}")).toBeLessThan(
      viewSource.indexOf("{renderDaeunFortuneTable(draft, evidencePacket)}"),
    );
  });

  it("folds domain flows into long yearly prose and keeps a compact MBTI section", () => {
    expect(viewSource).toContain("coreFlow");
    expect(viewSource).toContain("realWorldScenes");
    expect(viewSource).toContain("cautionPoint");
    expect(viewSource).toContain("getYearMbtiExpression");
    expect(viewSource).toContain("yearDetail");
    expect(viewSource).not.toContain("현실 장면은 따로 움직이지 않습니다");
    expect(viewSource).not.toContain("{renderDomainFlows(draft, evidencePacket)}");
    expect(viewSource).toContain("가 이 대운을 쓰는 방식");
    expect(viewSource).toContain("명리는 긴 흐름의 방향을 잡고");
    expect(viewSource).not.toContain("원국표 데이터가 연결되면");
  });

  it("renders risk, action, myeongli, and safety sections without raw UI labels", () => {
    expect(viewSource).toContain("조심할 패턴");
    expect(viewSource).toContain("실행 기준");
    expect(viewSource).toContain("명리 근거");
    expect(viewSource).toContain("안전 안내");
    expect(viewSource).toContain("백호대살|diagnostic-only|evidence|debug|fixture");
    expect(viewSource).not.toContain("majorFortuneCycles");
    expect(viewSource).not.toContain("source registry");
    expect(viewSource).not.toContain("productKey");
    expect(viewSource).not.toContain("bridgeEvidence.productKey");
    expect(viewSource).toContain("한국나이");
    expect(viewSource).not.toContain("만 나이");
  });
});
