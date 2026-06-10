import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readScript(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

const source = readScript("scripts/smoke_create_ready_payment_order.ts");

describe("create ready payment order smoke script source", () => {
  it("uses Supabase ready payment order adapter and prints safe status", () => {
    const requiredMarkers = [
      "SUPABASE_URL",
      "SUPABASE_ANON_KEY",
      "createSupabaseReadyPaymentOrderClient",
      "createReadyPaymentOrder",
      "saju_mbti_full",
      "toss",
      "READY_PAYMENT_ORDER_SMOKE",
      "created ready payment order id",
      "product type",
      "provider",
      "status",
      "amount/currency",
      "done",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }
  });

  it("does not print snapshots, secrets, provider payment ids, reports, or links", () => {
    const rejectedMarkers = [
      "SUPABASE" + "_SERVICE" + "_ROLE",
      "service" + "_role",
      "share" + "Token",
      "access" + "TokenHash",
      "provider_" + "payment_id",
      "provider" + "Payment" + "Id",
      "report_snapshot",
      "writeStatus(`input_snapshot",
      "writeStatus(inputSnapshot",
      "console.log",
      "/api/" + "payments",
      "/api/" + "reports/unlock",
      "To" + "ss" + "Payments",
      "KakaoPay" + " API",
      "wall" + "et",
      "re" + "charge",
      "point " + "balance",
      "credit " + "balance",
      "충" + "전",
      "포" + "인트",
      "잔" + "액",
    ];

    for (const marker of rejectedMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
