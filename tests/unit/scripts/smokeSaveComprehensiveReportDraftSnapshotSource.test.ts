import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(process.cwd(), "scripts/smoke_save_comprehensive_report_draft_snapshot.ts"),
  "utf8",
);

describe("save comprehensive report draft snapshot smoke script source", () => {
  it("uses anon Supabase env and the snapshot persistence boundary", () => {
    const requiredMarkers = [
      "SUPABASE_URL",
      "SUPABASE_ANON_KEY",
      "createReadyPaymentOrder",
      "markTossPaymentOrderPaid",
      "fulfillPaidPaymentOrder",
      "saveComprehensiveReportDraftSnapshot",
      "created ready payment order id",
      "marked paid payment order id",
      "fulfilled report id",
      "saved snapshot report id",
      "snapshot version",
      "status",
      "done",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }
  });

  it("does not require OpenAI env or print private fields and full body", () => {
    const blockedMarkers = [
      "OPENAI" + "_API" + "_KEY",
      "OPENAI" + "_REPORT" + "_MODEL",
      "writeStatus(createFixtureDraft",
      "writeStatus(`body",
      "writeStatus(result.draft",
      "writeStatus(`report" + "_snapshot",
      "writeStatus(report" + "_snapshot",
      "writeStatus(`provider" + "_payment" + "_id",
      "writeStatus(provider" + "_payment" + "_id",
      "writeStatus(`payment" + "Key",
      "writeStatus(payment" + "Key",
      "console.log",
    ];

    for (const marker of blockedMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
