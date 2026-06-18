import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(process.cwd(), "scripts/smoke_generate_compatibility_category_matrix.ts"),
  "utf8",
);

describe("smoke_generate_compatibility_category_matrix source", () => {
  it("prints quality counts for all compatibility v1 category fixtures", () => {
    expect(source).toContain("compatibilityCategoryMatrixFixtureIds");
    expect(source).toContain("deokmin-sodam-love");
    expect(source).toContain("deokmin-sodam-marriage");
    expect(source).toContain("unknown-time-some");
    expect(source).toContain("friendship-mbti-known");
    expect(source).toContain("family-unknown-mbti");
    expect(source).toContain("business-work-partner-sample");
    expect(source).toContain("bad Korean phrases:");
    expect(source).toContain("forbidden category vocabulary:");
    expect(source).toContain("finalAdvice forbidden labels:");
    expect(source).toContain("duplicate finalAdvice labels:");
    expect(source).toContain("internal artifacts:");
    expect(source).toContain("snapshot:");
    expect(source).toContain("url:");
    expect(source).toContain("badKoreanPhrases");
    expect(source).toContain("forbiddenFinalAdviceLabelsByRelationshipType");
    expect(source).toContain("getForbiddenCategoryVocabulary");
    expect(source).toContain("buildQualityCounts");
    expect(source).toContain("readFile(snapshotFilePath");
    expect(source).toContain("getSnapshotVisibleText(savedSnapshot)");
    expect(source).toContain("collectCompatibilityDraftVisibleText");
    expect(source).toContain("collectVisibleDeepSajuBridgeText");
    expect(source).toContain("collectCompatibilityDraftVisibleText(value.draft)");
    expect(source).toContain("note.principleExplanation");
    expect(source).toContain("note.relationshipTranslation");
    expect(source).toContain("note.everydayScene");
    expect(source).toContain("파트너십가");
    expect(source).toContain("관리 부담가");
    expect(source).toContain("Partner A을");
    expect(source).toContain("Partner B을");
    expect(source).toContain("감정을 말로 바로 풀지 못할 때");
    expect(source).toContain("온도를 올려 대화를 열고");
    expect(source).toContain("데이트");
    expect(source).toContain("연애");
    expect(source).toContain("애인");
    expect(source).toContain("설렘");
    expect(source).toContain("호감");
    expect(source).toContain("category quality checks failed");
    expect(source).toContain("SKIPPED OpenAI generation");
    expect(source).toContain("shouldPrintPreviewUrl(row)");
    expect(source).toContain("row.status === \"pass\"");
    expect(source).not.toContain("writeLine(`OPENAI_API_KEY");
    expect(source).not.toContain("Authorization");
  });
});
