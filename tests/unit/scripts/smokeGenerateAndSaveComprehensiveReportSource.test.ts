import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(process.cwd(), "scripts/smoke_generate_and_save_comprehensive_report.ts"),
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
      "generateAndPersistComprehensiveReport",
      "result url:",
      "http://localhost:3000/reports/",
      "quality guard: passed",
      "isSafeReportGenerationError",
      "failed",
      "code:",
      "stage:",
      "errors:",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
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
    ];

    for (const marker of blockedMarkers) {
      expect(source).not.toContain(marker);
    }

    for (const marker of blockedPrintMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
