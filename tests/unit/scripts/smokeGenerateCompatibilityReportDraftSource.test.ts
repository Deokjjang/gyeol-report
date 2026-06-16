import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(process.cwd(), "scripts/smoke_generate_compatibility_report_draft.ts"),
  "utf8",
);

describe("smoke_generate_compatibility_report_draft source", () => {
  it("supports the deokmin-sodam compatibility fixture and safe skip output", () => {
    expect(source).toContain("--fixture");
    expect(source).toContain("--print-body");
    expect(source).toContain("--body");
    expect(source).toContain("--print");
    expect(source).toContain("deokmin-sodam-love");
    expect(source).toContain("compatibility fixture:");
    expect(source).toContain("relationship type:");
    expect(source).toContain("score total:");
    expect(source).toContain("schema approx chars:");
    expect(source).toContain("formatCompatibilityOpenAIRequestDiagnostics");
    expect(source).toContain("CompatibilityReportWriterFailure");
    expect(source).toContain("SKIPPED, OpenAI writer not enabled");
    expect(source).toContain("draft version:");
    expect(source).toContain("if (printBody)");
    expect(source).toContain("writeCompatibilityReportBody(result.draft)");
    expect(source).toContain("COMPATIBILITY REPORT BODY START");
    expect(source).toContain("COMPATIBILITY REPORT BODY END");
    expect(source).toContain("draft.openingTitle");
    expect(source).toContain("종합 궁합 점수:");
    expect(source).toContain("끌림:");
    expect(source).toContain("대화:");
    expect(source).toContain("생활 리듬:");
    expect(source).toContain("갈등 회복:");
    expect(source).toContain("장기 안정성:");
    expect(source).toContain("성장 보완:");
    expect(source).toContain("핵심 포인트");
    expect(source).toContain("draft.chapters");
    expect(source).toContain("chapter.directHitScenes");
    expect(source).toContain("chapter.practicalAdvice");
    expect(source).toContain("draft.finalAdvice");
    expect(source).toContain("draft.safetyNotes");
    expect(source).toContain("done");
    expect(source).not.toContain("writeLine(`OPENAI_API_KEY");
    expect(source).not.toContain("writeLine(\"OPENAI_API_KEY");
    expect(source).not.toContain("Authorization");
  });
});
