import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readScript(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

const source = readScript("scripts/smoke_supabase_paid_report_storage.ts");

describe("supabase paid report storage smoke script source", () => {
  it("is env-gated and uses paid storage boundary with fake payment metadata", () => {
    const requiredMarkers = [
      "REPORT_PERSISTENCE_MODE",
      "SUPABASE_URL",
      "SUPABASE_ANON_KEY",
      "SUPABASE_PAID_SMOKE",
      "persistPaidFullReport",
      "paymentStatus",
      "paid",
      "1290",
      "KRW",
      "smoke",
      "created paid report id",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }
  });

  it("does not expose secret, payment-provider, unlock, or access-token markers", () => {
    const rejectedMarkers = [
      "service" + "_role",
      "SUPABASE" + "_SERVICE" + "_ROLE",
      "/api/" + "payments",
      "/api/" + "reports/unlock",
      "check" + "out",
      "To" + "ss",
      "Kakao" + "Pay",
      "access" + "_token" + "_hash",
      "access" + "Token" + "Hash",
    ];

    for (const marker of rejectedMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
