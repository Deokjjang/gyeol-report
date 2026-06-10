import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const migrationSource = readFileSync(
  join(
    process.cwd(),
    "supabase/migrations/0006_update_ready_payment_order_rpc_launch_price.sql",
  ),
  "utf8",
);

describe("update ready payment order RPC launch price migration source", () => {
  it("updates ready order amount validation to the launch price", () => {
    const requiredMarkers = [
      "create or replace function public.create_ready_payment_order",
      "p_amount <> 990",
      "990",
      "KRW",
      "ready",
      "saju_mbti_full",
      "toss",
      "kakao_pay",
      "security definer",
      "grant execute on function public.create_ready_payment_order",
    ];

    for (const marker of requiredMarkers) {
      expect(migrationSource).toContain(marker);
    }
  });

  it("does not include previous amount validation or unsafe behavior", () => {
    const blockedMarkers = [
      "p_amount <> 1290",
      "values ( p_payment_order_id, p_product_type, p_provider, 1290",
      "status = 'paid'",
      "payment_status = 'paid'",
      "provider" + "_payment" + "_id in returns",
      "input" + "_snapshot in returns",
      "grant insert on table public.payment_orders to anon",
      "create policy",
      "service" + "_role",
      "SUPABASE" + "_SERVICE" + "_ROLE",
      "TOSS" + "_SECRET" + "_KEY",
    ];

    for (const marker of blockedMarkers) {
      expect(migrationSource).not.toContain(marker);
    }
  });
});
