import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(process.cwd(), "scripts/smoke_generate_comprehensive_report_draft.ts"),
  "utf8",
);
const debugHelperSource = readFileSync(
  join(process.cwd(), "src/lib/report-knowledge/sajuFeatureEvidenceDebug.ts"),
  "utf8",
);

describe("generate comprehensive report draft smoke script source", () => {
  it("uses explicit OpenAI report writer envs and sample evidence builder", () => {
    const requiredMarkers = [
      "OPENAI_REPORT_WRITER_ENABLED",
      "OPENAI_API_KEY",
      "OPENAI_REPORT_MODEL",
      "buildComprehensiveReportEvidencePacketFromComputedFacts",
      "buildSafeSajuFeatureEvidenceDebugSummary",
      "formatSafeSajuFeatureEvidenceDebugSummary",
      "generateComprehensiveReportDraft",
      "isComprehensiveReportV2Draft",
      "isSafeReportGenerationError",
      "OPENAI_REPORT_WRITER_DEBUG_SAFE",
      "--write-preview",
      "buildLocalFallbackDraft",
      "buildDeterministicSajuFeatureChapter",
      "validateComprehensiveReportDraft",
      "writer disabled: using local deterministic draft builder.",
      "sajuFeatureChapter",
      "longformReadings",
      "preview snapshot written:",
      ".tmp/comprehensive-report-preview",
      "OpenAI request debug:",
      "input message count",
      "approx prompt chars",
      "response format",
      "schema keys",
      "getReportSmokeFixture",
      "getReportSmokeFixtureIdFromArgs",
      "fixture.sajuFacts",
      "report fixture:",
      "draft version",
      "product type",
      "chapters",
      "core line",
      "first chapter",
      "quality repair: attempted",
      "quality repair:",
      "warnings:",
      "failed",
      "code:",
      "stage:",
      "status:",
      "errorType:",
      "errorCode:",
      "message:",
      "requestId:",
      "done",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }

    for (const marker of [
      "computed saju feature ids",
      "selected saju feature evidence",
      "excluded high scoring features",
      "saju feature spotlight",
      "signature scenes",
      "selected evidence narrowness",
    ]) {
      expect(debugHelperSource).toContain(marker);
    }
  });

  it("keeps writer-disabled fallback preview quality markers in source", () => {
    for (const marker of [
      "공통 만세력표는 근거이고",
      "buildDeterministicSajuFeatureChapter",
      "신살·귀인·합충·지장간",
      "selectedTraitSeeds",
      "myeongliSignalLabels",
      "mbtiTraitTopic",
      "LOCAL_COMPREHENSIVE_DRAFT_INVALID",
      "SAJU_FEATURE_CHAPTER_UNAVAILABLE",
      "getPreviewSnapshotRelativePath",
      "writePreviewSnapshot",
    ]) {
      expect(source).toContain(marker);
    }
  });

  it("does not print raw model output private fields or full report body", () => {
    const blockedMarkers = [
      "writeStatus(result.rawText",
      "writeStatus(`rawText",
      "writeStatus(result.draft.sections[0].body",
      "writeStatus(`body",
      "writeStatus(\"OPENAI_API_KEY",
      "writeStatus(`OPENAI_API_KEY",
      "process.stdout.write(apiKey",
      "writeStatus(messages.system",
      "writeStatus(messages.developer",
      "writeStatus(messages.user",
      "Authorization",
      "console.log",
      "payment" + "Key",
      "provider" + "PaymentId",
      "input" + "Snapshot",
      "share" + "Token",
      "access" + "TokenHash",
    ];

    for (const marker of blockedMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
