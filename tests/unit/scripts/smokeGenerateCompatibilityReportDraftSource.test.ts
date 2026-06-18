import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(process.cwd(), "scripts/smoke_generate_compatibility_report_draft.ts"),
  "utf8",
);
const categoryMatrixSource = readFileSync(
  join(process.cwd(), "scripts/smoke_generate_compatibility_category_matrix.ts"),
  "utf8",
);

describe("smoke_generate_compatibility_report_draft source", () => {
  it("supports the deokmin-sodam compatibility fixture and safe skip output", () => {
    expect(source).toContain("--fixture");
    expect(source).toContain("--print-body");
    expect(source).toContain("--body");
    expect(source).toContain("--print");
    expect(source).toContain("--write-preview");
    expect(source).toContain("deokmin-sodam-love");
    expect(source).toContain("compatibility fixture:");
    expect(source).toContain("relationship type:");
    expect(source).toContain("relationship label:");
    expect(source).toContain("getCompatibilityRelationshipTypeLabel");
    expect(source).toContain("score labels:");
    expect(source).toContain("getCompatibilityScoreDisplayLabels");
    expect(source).toContain("business-work-partner-sample");
    expect(source).toContain("expected deep layer hints:");
    expect(source).toContain("writeExpectedDeepLayerHints(fixture.id)");
    expect(source).toContain("무토 -> 경금");
    expect(source).toContain("식신/편인");
    expect(source).toContain("계수 -> 무토");
    expect(source).toContain("정관/정재");
    expect(source).toContain("score total:");
    expect(source).toContain("deep saju layers:");
    expect(source).toContain("note.layer");
    expect(source).toContain("note.relationLabel");
    expect(source).toContain("plain:");
    expect(source).toContain("note.plainKoreanSummary");
    expect(source).toContain("branch_trine");
    expect(source).toContain("cross_ten_god");
    expect(source).not.toContain("mutual element complement");
    expect(source).toContain("deepSajuBridge: packet.deepSajuBridge");
    expect(source).toContain("schema approx chars:");
    expect(source).toContain("formatCompatibilityOpenAIRequestDiagnostics");
    expect(source).toContain("CompatibilityReportWriterFailure");
    expect(source).toContain("SKIPPED, OpenAI writer not enabled");
    expect(source).toContain("draft version:");
    expect(source).toContain("if (printBody)");
    expect(source).toContain("writeCompatibilityReportBody({");
    expect(source).toContain("COMPATIBILITY REPORT BODY START");
    expect(source).toContain("COMPATIBILITY REPORT BODY END");
    expect(source).toContain("draft.openingTitle");
    expect(source).toContain("종합 궁합 점수:");
    expect(source).toContain("score label:");
    expect(source).toContain("score caution:");
    expect(source).toContain("scoreLabels.attraction");
    expect(source).toContain("scoreLabels.communication");
    expect(source).toContain("scoreLabels.lifestyleRhythm");
    expect(source).toContain("scoreLabels.conflictRecovery");
    expect(source).toContain("scoreLabels.longTermStability");
    expect(source).toContain("scoreLabels.growthComplement");
    expect(source).toContain("핵심 포인트");
    expect(source).toContain("draft.chapters");
    expect(source).toContain("chapter.directHitScenes");
    expect(source).toContain("반복될 수 있는 장면:");
    expect(source).not.toContain("찔리는 장면:");
    expect(source).toContain("chapter.practicalAdvice");
    expect(source).toContain("draft.finalAdvice");
    expect(source).toContain("normalizeCompatibilityFinalAdviceItemForValidation");
    expect(source).toContain("normalized.label");
    expect(source).toContain("validation.value ?? result.draft");
    expect(source).toContain("오늘부터 할 일");
    expect(source).toContain("draft.safetyNotes");
    expect(source).toContain("quality warnings:");
    expect(source).toContain("writeQualityWarnings(validation.warnings)");
    expect(source).toContain("- none");
    expect(source).toContain("validateCompatibilityReportDraft");
    expect(source).toContain("writeCompatibilityPreviewSnapshot");
    expect(source).toContain("getCompatibilityPreviewSnapshotRelativePath");
    expect(source).toContain("getCompatibilityPreviewUrl");
    expect(source).toContain("preview snapshot written:");
    expect(source).toContain("Open in browser:");
    expect(source).toContain("getCompatibilityPreviewUrl(fixture.id)");
    expect(source).toContain("PASS");
    expect(source).toContain("FAIL");
    expect(source).toContain("done");
    expect(source).not.toContain("writeLine(`OPENAI_API_KEY");
    expect(source).not.toContain("writeLine(\"OPENAI_API_KEY");
    expect(source).not.toContain("Authorization");
  });

  it("supports a six-category differentiation matrix smoke", () => {
    expect(categoryMatrixSource).toContain(
      "compatibilityCategoryMatrixFixtureIds",
    );
    expect(categoryMatrixSource).toContain("deokmin-sodam-love");
    expect(categoryMatrixSource).toContain("deokmin-sodam-marriage");
    expect(categoryMatrixSource).toContain("unknown-time-some");
    expect(categoryMatrixSource).toContain("friendship-mbti-known");
    expect(categoryMatrixSource).toContain("family-unknown-mbti");
    expect(categoryMatrixSource).toContain("business-work-partner-sample");
    expect(categoryMatrixSource).toContain("relationship label:");
    expect(categoryMatrixSource).toContain("score labels:");
    expect(categoryMatrixSource).toContain("assertCategoryDifferentiation");
    expect(categoryMatrixSource).toContain("score labels did not differ");
    expect(categoryMatrixSource).toContain("first chapters are identical");
    expect(categoryMatrixSource).toContain("business_work_partner");
    expect(categoryMatrixSource).toContain("family");
    expect(categoryMatrixSource).toContain("love finalAdvice");
    expect(categoryMatrixSource).toContain(
      "generation: skipped, OpenAI writer env incomplete or disabled",
    );
    expect(categoryMatrixSource).toContain("shouldPrintPreviewUrl(row)");
    expect(categoryMatrixSource).toContain("row.status === \"pass\"");
    expect(categoryMatrixSource).toContain("writeCompatibilityPreviewSnapshot");
    expect(categoryMatrixSource).toContain("getCompatibilityPreviewUrl");
    expect(categoryMatrixSource).not.toContain("writeLine(`OPENAI_API_KEY");
    expect(categoryMatrixSource).not.toContain("Authorization");
  });
});
