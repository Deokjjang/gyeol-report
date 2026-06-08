import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readScript(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

const source = readScript("scripts/smoke_supabase_paid_share_lookup.ts");

describe("supabase paid share lookup smoke script source", () => {
  it("is env-gated and verifies paid lookup by issued share token", () => {
    const requiredMarkers = [
      "REPORT_PERSISTENCE_MODE",
      "SUPABASE_URL",
      "SUPABASE_ANON_KEY",
      "SHOW_SHARE_TOKEN_FOR_LOCAL_TEST",
      "SUPABASE_LOOKUP_SMOKE",
      "issueReportShareToken",
      "persistPaidFullReport",
      "findPaidReportByShareToken",
      "smoke_order_share_lookup",
      "smoke_payment_share_lookup",
      "paymentProviderPaymentId",
      "paymentStatus",
      "paid",
      "1290",
      "KRW",
      "stored paid report id",
      "lookup paid report id",
      "safe view: ok",
      "local share path",
      "/r/",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }
  });

  it("does not expose secret, payment-provider, route, or unsafe print markers", () => {
    const rejectedMarkers = [
      "service" + "_role",
      "SUPABASE" + "_SERVICE" + "_ROLE",
      "/api/" + "payments",
      "/api/" + "reports/unlock",
      "check" + "out",
      "To" + "ss",
      "Kakao" + "Pay",
      "console.log(" + "paymentProviderPaymentId",
      "console.log(" + "shareToken",
      "console.log(" + "sharePath",
      "console.log(" + "accessTokenHash",
      "console.log(" + "process.env.SUPABASE_URL",
      "console.log(" + "process.env.SUPABASE_ANON_KEY",
      "access" + "_token" + "_hash",
      "report generation did not return ok true",
    ];

    for (const marker of rejectedMarkers) {
      expect(source).not.toContain(marker);
    }
  });

  it("guards manual share path output behind the local test flag", () => {
    expect(source).toContain('process.env[localSharePathFlagEnv] === "1"');

    const guardIndex = source.indexOf("shouldShowSharePathForLocalTest()");
    const outputIndex = source.indexOf("local share path for manual test");

    expect(guardIndex).toBeGreaterThanOrEqual(0);
    expect(outputIndex).toBeGreaterThan(guardIndex);
  });
});
