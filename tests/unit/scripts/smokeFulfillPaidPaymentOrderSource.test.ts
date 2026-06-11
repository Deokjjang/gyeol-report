import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(process.cwd(), "scripts/smoke_fulfill_paid_payment_order.ts"),
  "utf8",
);

describe("fulfill paid payment order smoke script source", () => {
  it("uses anon Supabase envs and safe paid fulfillment flow", () => {
    const requiredMarkers = [
      "SUPABASE_URL",
      "SUPABASE_ANON_KEY",
      "createReadyPaymentOrder",
      "markTossPaymentOrderPaid",
      "fulfillPaidPaymentOrder",
      "saju_mbti_full",
      "toss",
      "created ready payment order id",
      "marked paid payment order id",
      "fulfilled report id",
      "payment order status",
      "done",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }
  });

  it("does not print private snapshots provider payment id secrets or report body", () => {
    const blockedMarkers = [
      "writeStatus(`providerPaymentId",
      "writeStatus(providerPaymentId",
      "writeStatus(`inputSnapshot",
      "writeStatus(inputSnapshot",
      "writeStatus(`access" + "TokenHash",
      "writeStatus(access" + "TokenHash",
      "writeStatus(`report body",
      "console.log",
      "TOSS" + "_SECRET" + "_KEY",
      "SUPABASE" + "_SERVICE" + "_ROLE",
      "service" + "_role",
      "share" + "Token",
      "access" + "TokenHash",
      "report" + "_snapshot",
      "/api/" + "payments/toss/confirm",
      "/api/" + "reports/unlock",
    ];

    for (const marker of blockedMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
