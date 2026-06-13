import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(process.cwd(), "scripts/smoke_openai_report_writer_transport.ts"),
  "utf8",
);

describe("OpenAI report writer transport smoke source", () => {
  it("uses OpenAI envs client boundary and safe diagnostics", () => {
    const requiredMarkers = [
      "OPENAI_REPORT_WRITER_ENABLED",
      "OPENAI_API_KEY",
      "OPENAI_REPORT_MODEL",
      "callOpenAIReportWriter",
      "tinyJsonSchema",
      "transport ok",
      "model:",
      "failed",
      "code:",
      "stage: openai",
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

  it("does not print secrets prompts raw output or hardcode model", () => {
    const blockedMarkers = [
      "rawText",
      "Authorization",
      "process.stdout.write(apiKey",
      "writeStatus(apiKey",
      "writeStatus(`OPENAI_API_KEY",
      "payment" + "Key",
      "provider" + "PaymentId",
      "input" + "Snapshot",
      "share" + "Token",
      "access" + "TokenHash",
      "gpt-",
    ];

    for (const marker of blockedMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
