import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const viewSource = readFileSync(
  join(process.cwd(), "src/app/reports/[reportId]/MajorFortuneReportView.tsx"),
  "utf8",
);

describe("MajorFortuneReportView source", () => {
  it("renders the major fortune hero and cycle structure table", () => {
    expect(viewSource).toContain("대운 리포트 v1.0");
    expect(viewSource).toContain("대운 기준과 현재 위치");
    expect(viewSource).toContain("대운");
    expect(viewSource).toContain("대운 순번");
    expect(viewSource).toContain("현재 위치");
    expect(viewSource).toContain("나이 구간");
    expect(viewSource).toContain("연도 구간");
    expect(viewSource).toContain("천간");
    expect(viewSource).toContain("지지");
    expect(viewSource).toContain("오행");
    expect(viewSource).toContain("십성");
    expect(viewSource).toContain("계산 기준");
    expect(viewSource).toContain("draft.calculationBasis.explanation");
    expect(viewSource).toContain("draft.calculationBasis.note");
    expect(viewSource).toContain("draft.cycleSummary.ganji");
    expect(viewSource).toContain("draft.cycleSummary.tenGodLabel");
  });

  it("renders all report sections", () => {
    expect(viewSource).toContain("draft.bigThemes.map");
    expect(viewSource).toContain("draft.previousToCurrentShift.plain");
    expect(viewSource).toContain("draft.previousToCurrentShift.whatChanged");
    expect(viewSource).toContain("draft.decadeCards.map");
    expect(viewSource).toContain("draft.keySignals.map");
    expect(viewSource).toContain("draft.majorStructure.ganjiExplanation");
    expect(viewSource).toContain("draft.cycleChapters.map");
    expect(viewSource).toContain("chapter.likelyScenes");
    expect(viewSource).toContain("chapter.practicalAdvice");
    expect(viewSource).toContain("draft.phaseTimeline.map");
    expect(viewSource).toContain("draft.cycleYearTimeline.map");
    expect(viewSource).toContain("year.plainInterpretation");
    expect(viewSource).toContain("year.strategicFocus");
    expect(viewSource).toContain("year.whyItMatters");
    expect(viewSource).toContain("draft.strongYears.map");
    expect(viewSource).toContain("draft.finalAdvice.map");
    expect(viewSource).toContain("draft.safetyNotes");
  });

  it("renders phase timeline and strong years labels", () => {
    expect(viewSource).toContain("10년 핵심 테마");
    expect(viewSource).toContain("이전 대운에서 이번 대운으로 바뀐 점");
    expect(viewSource).toContain("10년 흐름 지도");
    expect(viewSource).toContain("특히 강하게 체감될 수 있는 해 TOP 5");
    expect(viewSource).toContain("영역별 장기 전략");
    expect(viewSource).toContain("getPhaseDisplayLabel");
    expect(viewSource).toContain("초반 1~3년");
    expect(viewSource).toContain("중반 4~7년");
    expect(viewSource).toContain("후반 8~10년");
    expect(viewSource).toContain("반복될 수 있는 장면");
    expect(viewSource).toContain("실전 조언");
  });

  it("does not render raw fixture/precomputed wording", () => {
    expect(viewSource).toContain("sanitizeMajorFortuneVisibleText");
    expect(viewSource).toContain("입력된 대운표 기준");
    expect(viewSource).not.toContain("대운 흐름 지표");
    expect(viewSource).not.toContain("fixture_precomputed");
    expect(viewSource).not.toContain("precomputed");
  });

  it("renders relationship context and strategic big-picture sections", () => {
    expect(viewSource).toContain("관계 상태:");
    expect(viewSource).toContain("대운 기준과 현재 위치");
    expect(viewSource).toContain("이 10년의 결론");
    expect(viewSource).toContain("대운 유형");
    expect(viewSource).toContain("핵심 방향");
  });
});
