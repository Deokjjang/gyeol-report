import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const scriptSource = readFileSync(
  join(process.cwd(), "scripts/smoke_generate_major_fortune_report_draft.ts"),
  "utf8",
);

describe("major fortune smoke script source", () => {
  it("supports fixture selection and preview snapshot writing", () => {
    expect(scriptSource).toContain("--fixture");
    expect(scriptSource).toContain("--write-preview");
    expect(scriptSource).toContain("deokmin-current-major-fortune");
    expect(scriptSource).toContain("writeMajorFortunePreviewSnapshot");
    expect(scriptSource).toContain("getMajorFortunePreviewSnapshotRelativePath");
    expect(scriptSource).toContain("getMajorFortunePreviewUrl");
    expect(scriptSource).toContain("url:");
  });

  it("builds a writer-disabled local draft instead of stopping at skip", () => {
    expect(scriptSource).toContain("OPENAI_REPORT_WRITER_ENABLED");
    expect(scriptSource).toContain("buildWriterDisabledMajorFortuneDraft");
    expect(scriptSource).toContain("writer disabled fallback draft: enabled");
    expect(scriptSource).toContain("writer config fallback draft: enabled");
    expect(scriptSource).toContain("validateMajorFortuneReportDraft(draft)");
  });

  it("fills launch draft sections required by the preview view", () => {
    expect(scriptSource).toContain("headline");
    expect(scriptSource).toContain("openingSummary");
    expect(scriptSource).toContain("currentCycleSummary");
    expect(scriptSource).toContain("tenYearTheme");
    expect(scriptSource).toContain("timelineReading");
    expect(scriptSource).toContain("annualCrossReading");
    expect(scriptSource).toContain("careerWorkFlow");
    expect(scriptSource).toContain("moneyResourceFlow");
    expect(scriptSource).toContain("relationshipFlow");
    expect(scriptSource).toContain("healthRoutineFlow");
    expect(scriptSource).toContain("mbtiExpression");
    expect(scriptSource).toContain("riskManagement");
    expect(scriptSource).toContain("actionPlan");
    expect(scriptSource).toContain("safetyNotes");
    expect(scriptSource).toContain("buildContextualYearScene");
    expect(scriptSource).toContain("userContextReading");
    expect(scriptSource).toContain("currentField");
    expect(scriptSource).toContain("focusAreas");
    expect(scriptSource).not.toContain("현실 장면은 따로 움직이지 않습니다");
  });

  it("keeps OpenAI writer dynamically imported only for enabled writer mode", () => {
    expect(scriptSource).not.toContain(
      "from \"../src/lib/report-generation/openaiMajorFortuneReportWriter\"",
    );
    expect(scriptSource).toContain(
      "import(\"../src/lib/report-generation/openaiMajorFortuneReportWriter\")",
    );
  });

  it("does not include user-visible raw or forbidden copy in fallback content", () => {
    expect(scriptSource).not.toContain("source registry");
    expect(scriptSource).not.toContain("placeholder");
    expect(scriptSource).not.toContain("투자 수익 보장");
    expect(scriptSource).not.toContain("합격 확정");
    expect(scriptSource).not.toContain("승진 확정");
    expect(scriptSource).not.toContain("결혼 확정");
    expect(scriptSource).not.toContain("이혼 확정");
    expect(scriptSource).not.toContain("질병/사고/사망 예언");
  });
});
