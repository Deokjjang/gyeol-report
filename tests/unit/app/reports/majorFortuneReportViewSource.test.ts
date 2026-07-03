import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const viewSource = readFileSync(
  join(process.cwd(), "src/app/reports/[reportId]/MajorFortuneReportView.tsx"),
  "utf8",
);

describe("MajorFortuneReportView source", () => {
  it("renders the major fortune hero and cycle structure table", () => {
    expect(viewSource).toContain("대운 리포트");
    expect(viewSource).not.toContain("대운 리포트 v1.0");
    expect(viewSource).toContain("대운 기준 요약");
    expect(viewSource).toContain("대운");
    expect(viewSource).toContain("대운 순번");
    expect(viewSource).toContain("현재 위치");
    expect(viewSource).toContain("나이 구간");
    expect(viewSource).toContain("연도 구간");
    expect(viewSource).toContain("천간");
    expect(viewSource).toContain("지지");
    expect(viewSource).toContain("십성");
    expect(viewSource).toContain("계산 기준");
    expect(viewSource).toContain("draft.calculationBasis.explanation");
    expect(viewSource).toContain("draft.calculationBasis.note");
    expect(viewSource).toContain("draft.cycleSummary.ganji");
    expect(viewSource).toContain("draft.cycleSummary.tenGodLabel");
  });

  it("renders compact current situation and timeline sections", () => {
    expect(viewSource).toContain("현재 상황");
    expect(viewSource).toContain("shouldRenderRelationshipStatus");
    expect(viewSource).toContain("relationshipStatusLabel !== \"미입력\"");
    expect(viewSource).toContain("{shouldRenderRelationshipStatus ? (");
    expect(viewSource).toContain("현재 나의 연애");
    expect(viewSource).toContain("현재 하는 일");
    expect(viewSource).toContain("해석 기준");
    expect(viewSource).toContain("DaeunFortuneTable");
    expect(viewSource).toContain("buildDaeunFortuneTableData");
    expect(viewSource).toContain("renderDaeunFortuneTable");
    expect(viewSource).toContain("draft.majorFortuneTimelineRows.length === 0");
    expect(viewSource).toContain("buildCurrentDaeunCycleInput");
    expect(viewSource).toContain("buildTimelineYearInputs");
    expect(viewSource).toContain("buildAnnualFortuneInputs");
    expect(viewSource).toContain("draft.majorFortuneTimelineRows.map");
    expect(viewSource).toContain("row.isCurrentYear");
    expect(viewSource).toContain("row.badges");
    expect(viewSource).toContain("majorGanji: text(row.majorGanji)");
    expect(viewSource).toContain("annualGanji: text(row.annualGanji)");
    expect(viewSource).not.toContain("대운{");
    expect(viewSource).not.toContain("세운{");
    expect(viewSource).toContain("row.strategy");
  });

  it("renders big-picture strategic sections before domain strategy", () => {
    expect(viewSource.indexOf("{renderDaeunFortuneTable(draft)}")).toBeLessThan(
      viewSource.indexOf("현실 전략"),
    );
    expect(viewSource).toContain("이 10년의 한 줄 결론");
    expect(viewSource).toContain("대운 전환 해석: 이전 대운 → 현재 대운");
    expect(viewSource).toContain("핵심 테마 3개");
    expect(viewSource).toContain("draft.bigThemes.slice(0, 3).map");
    expect(viewSource).toContain("draft.previousToCurrentShift.plain");
    expect(viewSource).toContain("draft.previousToCurrentShift.whatChanged");
    expect(viewSource).toContain("현실 전략: 일·돈·연애·관계·몸·학업");
    expect(viewSource).toContain("draft.finalAdvice.map");
  });

  it("renders strong years and expanded myeongli evidence", () => {
    expect(viewSource).toContain("강하게 체감될 해 TOP 5");
    expect(viewSource).toContain("draft.strongYears.map");
    expect(viewSource).toContain("왜 강한가");
    expect(viewSource).toContain("밀어볼 것");
    expect(viewSource).toContain("줄일 것");
    expect(viewSource).toContain("명리 근거");
    expect(viewSource).not.toContain("명리 근거 펼쳐보기");
    expect(viewSource).toContain("draft.myeongliLayers");
    expect(viewSource).toContain("1. 십성");
    expect(viewSource).toContain("2. 오행");
    expect(viewSource).toContain("3. 지지 작용");
    expect(viewSource).toContain("4. 지장간");
    expect(viewSource).toContain("5. 신살·귀인 참고");
    expect(viewSource).toContain("layers.tenGodLayer.plain");
    expect(viewSource).toContain("layers.branchInteractionLayer.interactions");
    expect(viewSource).toContain("layers.hiddenStemLayer.plain");
    expect(viewSource).toContain("생활 장면으로만 조심스럽게 참고합니다");
    expect(viewSource).toContain(".slice(0, 5)");
    expect(viewSource).toContain("draft.safetyNotes");
    expect(viewSource).toContain("!hasMyeongliContent");
    expect(viewSource).toContain("백호대살|diagnostic-only|evidence|debug|fixture");
  });

  it("demotes repeated old sections and removes numeric flow score UI", () => {
    expect(viewSource).not.toContain("draft.keySignals.map");
    expect(viewSource).not.toContain("draft.cycleChapters.map");
    expect(viewSource).not.toContain("draft.decadeCards.map");
    expect(viewSource).not.toContain("draft.phaseTimeline.map");
    expect(viewSource).not.toContain("대운 흐름 지표");
    expect(viewSource).not.toContain("체감 강도");
  });

  it("does not render raw fixture/precomputed wording", () => {
    expect(viewSource).toContain("sanitizeMajorFortuneVisibleText");
    expect(viewSource).toContain("입력된 대운표 기준");
    expect(viewSource).not.toContain("대운 흐름 지표");
    expect(viewSource).not.toContain("fixture_precomputed");
    expect(viewSource).not.toContain("precomputed");
  });

  it("renders relationship context and strategic big-picture sections", () => {
    expect(viewSource).toContain("현재 나의 연애");
    expect(viewSource).toContain("대운 기준 요약");
    expect(viewSource).toContain("이 10년의 한 줄 결론");
    expect(viewSource).toContain("renderDaeunFortuneTable");
    expect(viewSource).toContain("현실 전략");
  });

  it("keeps unknown relationship status only as a pill and strips body limitations", () => {
    expect(viewSource).toContain("relationshipStatusLabel !== \"미입력\"");
    expect(viewSource).toContain("text(relationshipStatusLabel ?? \"\")");
    expect(viewSource).toContain("관계 상태가 미입력이므로");
    expect(viewSource).toContain("연애 상태가 입력되지 않아");
    expect(viewSource).toContain(".replace(/관계 상태가 미입력이므로\\s*/gu, \"\")");
    expect(viewSource).toContain(".replace(/연애 상태가 입력되지 않아\\s*/gu, \"\")");
  });
});
