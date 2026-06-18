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
    expect(source).toContain("category quality checks failed");
    expect(source).toContain("SKIPPED OpenAI generation");
    expect(source).toContain("shouldPrintPreviewUrl(row)");
    expect(source).toContain("row.status === \"pass\"");
    expect(source).not.toContain("writeLine(`OPENAI_API_KEY");
    expect(source).not.toContain("Authorization");
  });
});
