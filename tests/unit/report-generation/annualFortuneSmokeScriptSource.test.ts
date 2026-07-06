import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const scriptSource = readFileSync(
  join(process.cwd(), "scripts/smoke_generate_annual_fortune_report_draft.ts"),
  "utf8",
);

describe("annual fortune smoke script source", () => {
  it("builds a writer-disabled local draft and still writes preview snapshots", () => {
    expect(scriptSource).toContain("OPENAI_REPORT_WRITER_ENABLED");
    expect(scriptSource).toContain("buildWriterDisabledAnnualFortuneDraft");
    expect(scriptSource).toContain("writer disabled fallback draft: enabled");
    expect(scriptSource).toContain("writer config fallback draft: enabled");
    expect(scriptSource).toContain("validateAnnualFortuneReportDraft(input.draft)");
    expect(scriptSource).toContain("writeAnnualFortunePreviewSnapshot");
    expect(scriptSource).toContain("getAnnualFortunePreviewSnapshotRelativePath");
    expect(scriptSource).toContain("getAnnualFortunePreviewUrl");
  });

  it("fills the launch draft sections used by AnnualFortuneReportView", () => {
    expect(scriptSource).toContain("headline");
    expect(scriptSource).toContain("openingSummary");
    expect(scriptSource).toContain("selectedYearSummary");
    expect(scriptSource).toContain("yearAccessNotice");
    expect(scriptSource).toContain("majorAnnualCrossReading");
    expect(scriptSource).toContain("natalAnnualReading");
    expect(scriptSource).toContain("monthlyFlowReading");
    expect(scriptSource).toContain("monthlyHighlights");
    expect(scriptSource).toContain("careerWorkFlow");
    expect(scriptSource).toContain("moneyResourceFlow");
    expect(scriptSource).toContain("relationshipFlow");
    expect(scriptSource).toContain("healthRoutineFlow");
    expect(scriptSource).toContain("mbtiExpression");
    expect(scriptSource).toContain("riskManagement");
    expect(scriptSource).toContain("actionPlan");
    expect(scriptSource).toContain("safetyNotes");
    expect(scriptSource).toContain("buildMonthlyHighlights");
    expect(scriptSource).toContain("buildMonthlyFlow");
  });

  it("keeps smoke preview copy free of blocked user-facing markers", () => {
    expect(scriptSource).not.toContain("준비 중");
    expect(scriptSource).not.toContain("placeholder");
    expect(scriptSource).not.toContain("calendar_month_approximation");
    expect(scriptSource).not.toContain("투자 수익 보장");
    expect(scriptSource).not.toContain("합격 확정");
    expect(scriptSource).not.toContain("승진 확정");
    expect(scriptSource).not.toContain("이직 확정");
    expect(scriptSource).not.toContain("결혼 확정");
    expect(scriptSource).not.toContain("이혼 확정");
    expect(scriptSource).not.toContain("임신/출산 확정");
    expect(scriptSource).not.toContain("질병/사고/사망 예언");
  });
});
