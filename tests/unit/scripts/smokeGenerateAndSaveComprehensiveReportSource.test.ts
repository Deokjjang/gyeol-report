import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(process.cwd(), "scripts/smoke_generate_and_save_comprehensive_report.ts"),
  "utf8",
);
const debugHelperSource = readFileSync(
  join(process.cwd(), "src/lib/report-knowledge/sajuFeatureEvidenceDebug.ts"),
  "utf8",
);

describe("generate and save comprehensive report smoke source", () => {
  it("uses required server env and orchestration boundary", () => {
    const requiredMarkers = [
      "OPENAI_REPORT_WRITER_ENABLED",
      "OPENAI_API_KEY",
      "OPENAI_REPORT_MODEL",
      "SUPABASE_URL",
      "SUPABASE_ANON_KEY",
      "buildSafeSajuFeatureEvidenceDebugSummary",
      "formatSafeSajuFeatureEvidenceDebugSummary",
      "generateAndPersistComprehensiveReport",
      "result url:",
      "http://localhost:3000/reports/",
      "quality guard: passed",
      "quality repair: attempted",
      "quality repair:",
      "warnings:",
      "draft version:",
      "chapters:",
      "isSafeReportGenerationError",
      "OPENAI_REPORT_WRITER_DEBUG_SAFE",
      "OpenAI request debug:",
      "input message count",
      "approx prompt chars",
      "response format",
      "schema keys",
      "getReportSmokeFixture",
      "getReportSmokeFixtureIdFromArgs",
      "fixture.sajuFacts",
      "report fixture:",
      "failed",
      "code:",
      "stage:",
      "status:",
      "errorType:",
      "errorCode:",
      "message:",
      "requestId:",
      "errors:",
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

  it("keeps smoke output safe and avoids hardcoded models", () => {
    const blockedMarkers = [
      "rawText",
      "report" + "_snapshot",
      "full draft body",
      "payment" + "Key",
      "provider" + "Payment" + "Id",
      "provider" + "_payment" + "_id",
      "input" + "Snapshot",
      "input" + "_snapshot",
      "share" + "Token",
      "access" + "TokenHash",
      "TOSS" + "_SECRET" + "_KEY",
      "SUPABASE" + "_SERVICE" + "_ROLE",
      "gpt-",
    ];
    const blockedPrintMarkers = [
      "writeStatus(apiKey",
      "writeStatus(supabaseAnonKey",
      "writeStatus(`OPENAI_API_KEY",
      "writeStatus(`SUPABASE_ANON_KEY",
      "writeStatus(generated.coreLine + generated.openingTitle)",
      "writeStatus(messages.system",
      "writeStatus(messages.developer",
      "writeStatus(messages.user",
      "Authorization",
    ];

    for (const marker of blockedMarkers) {
      expect(source).not.toContain(marker);
    }

    for (const marker of blockedPrintMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
