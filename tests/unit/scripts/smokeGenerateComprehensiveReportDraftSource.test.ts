import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(process.cwd(), "scripts/smoke_generate_comprehensive_report_draft.ts"),
  "utf8",
);

describe("generate comprehensive report draft smoke script source", () => {
  it("uses explicit OpenAI report writer envs and sample evidence builder", () => {
    const requiredMarkers = [
      "OPENAI_REPORT_WRITER_ENABLED",
      "OPENAI_API_KEY",
      "OPENAI_REPORT_MODEL",
      "buildComprehensiveReportEvidencePacketFromComputedFacts",
      "generateComprehensiveReportDraft",
      "isComprehensiveReportV2Draft",
      "isSafeReportGenerationError",
      "OPENAI_REPORT_WRITER_DEBUG_SAFE",
      "OpenAI request debug:",
      "input message count",
      "approx prompt chars",
      "response format",
      "schema keys",
      "draft version",
      "product type",
      "chapters",
      "core line",
      "first chapter",
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
