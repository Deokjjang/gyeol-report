import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readScript(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

const source = readScript("scripts/smoke_supabase_paid_share_token_storage.ts");

describe("supabase paid share token storage smoke script source", () => {
  it("is env-gated and combines share token issue with paid storage", () => {
    const requiredMarkers = [
      "REPORT_PERSISTENCE_MODE",
      "SUPABASE_URL",
      "SUPABASE_ANON_KEY",
      "SUPABASE_SHARE_SMOKE",
      "issueReportShareToken",
      "persistPaidFullReport",
      "paymentStatus",
      "paid",
      "1290",
      "KRW",
      "smoke_order_share_token_storage",
      "smoke_payment_share_token_storage",
      "issued share token: yes",
      "share path format: ok",
      "created paid report id",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }
  });

  it("does not expose secret, payment-provider, unlock, or unsafe print markers", () => {
    const rejectedMarkers = [
      "service" + "_role",
      "SUPABASE" + "_SERVICE" + "_ROLE",
      "/api/" + "payments",
      "/api/" + "reports/unlock",
      "check" + "out",
      "To" + "ss",
      "Kakao" + "Pay",
      "console.log(" + "shareToken",
      "console.log(" + "sharePath",
      "access" + "_token" + "_hash",
    ];

    for (const marker of rejectedMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
