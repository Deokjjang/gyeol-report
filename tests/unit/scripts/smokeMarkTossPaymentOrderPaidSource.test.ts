import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(process.cwd(), "scripts/smoke_mark_toss_payment_order_paid.ts"),
  "utf8",
);

describe("mark Toss payment order paid smoke script source", () => {
  it("uses anon Supabase envs and paid adapter with safe output", () => {
    const requiredMarkers = [
      "SUPABASE_URL",
      "SUPABASE_ANON_KEY",
      "createReadyPaymentOrder",
      "markTossPaymentOrderPaid",
      "saju_mbti_full",
      "toss",
      "created ready payment order id",
      "marked paid payment order id",
      "status: ${paidResult.order.status}",
      "amount/currency: ${paidResult.order.amount} ${paidResult.order.currency}",
      "done",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }
  });

  it("does not print snapshots provider payment id secrets reports or links", () => {
    const blockedMarkers = [
      "writeStatus(`providerPaymentId",
      "writeStatus(providerPaymentId",
      "writeStatus(`inputSnapshot",
      "writeStatus(inputSnapshot",
      "console.log",
      "TOSS" + "_SECRET" + "_KEY",
      "SUPABASE" + "_SERVICE" + "_ROLE",
      "service" + "_role",
      "share" + "Token",
      "access" + "TokenHash",
      "report" + "_snapshot",
      "/api/" + "payments/toss/confirm",
      "/api/" + "reports/unlock",
      "wall" + "et",
      "re" + "charge",
      "point " + "balance",
      "credit " + "balance",
    ];

    for (const marker of blockedMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
