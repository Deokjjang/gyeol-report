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
    expect(viewSource).toContain("모드");
    expect(viewSource).toContain("draft.yearSummary.ganji");
    expect(viewSource).toContain("draft.yearSummary.tenGodLabel");
  });

  it("renders report sections, monthly flow, final advice, and safety notes", () => {
    expect(viewSource).toContain("draft.flowCards.map");
    expect(viewSource).toContain("draft.keySignals.map");
    expect(viewSource).toContain("draft.annualStructure.ganjiExplanation");
    expect(viewSource).toContain("draft.chapters.map");
    expect(viewSource).toContain("chapter.likelyScenes");
    expect(viewSource).toContain("chapter.practicalAdvice");
    expect(viewSource).toContain("draft.monthlyFlow.map");
    expect(viewSource).toContain("월별 흐름");
    expect(viewSource).toContain("draft.finalAdvice.map");
    expect(viewSource).toContain("안전 안내");
  });
});
