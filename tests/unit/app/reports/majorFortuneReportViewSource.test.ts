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
    expect(viewSource).toContain("기초 만세력");
    expect(viewSource).toContain("MBTI 성향표");
    expect(viewSource).toContain("MBTI는 대운의 원인이 아니라");
    expect(viewSource).toContain("items-start");
    expect(viewSource).toContain("입력된 대운표 기준");
    expect(viewSource).not.toContain("draft 기준");
    expect(viewSource).not.toContain("공통 만세력표");
    expect(viewSource).not.toContain("공통 MBTI표");
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

  it("keeps DaeunFortuneTable connected after the ten-year summary", () => {
    expect(viewSource).toContain("DaeunFortuneTable");
    expect(viewSource).toContain("buildDaeunFortuneTableData");
    expect(viewSource).toContain("renderDaeunFortuneTable");
    expect(viewSource).toContain("buildCurrentDaeunCycleInput");
    expect(viewSource).toContain("buildTimelineYearInputs");
    expect(viewSource).toContain("buildAnnualFortuneInputs");
    expect(viewSource).toContain("row.majorGanji");
    expect(viewSource).toContain("row.annualGanji");
    expect(viewSource.indexOf("{renderDaeunFortuneTable(draft, evidencePacket)}")).toBeLessThan(
      viewSource.indexOf("{renderAnnualCross(draft, evidencePacket)}"),
    );
  });

  it("renders six domain flow labels and MBTI expression section", () => {
    expect(viewSource).toContain("직업/일");
    expect(viewSource).toContain("돈/자원");
    expect(viewSource).toContain("관계/연애");
    expect(viewSource).toContain("건강관리/생활 리듬");
    expect(viewSource).toContain("사회/가족");
    expect(viewSource).toContain("공부/성장");
    expect(viewSource).toContain("renderDomainFlows");
    expect(viewSource).toContain("domainFlows[key]");
    expect(viewSource).toContain("MBTI 성향 발현 방식");
    expect(viewSource).toContain("명리는 긴 흐름의 방향을 잡고");
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
  });
});
