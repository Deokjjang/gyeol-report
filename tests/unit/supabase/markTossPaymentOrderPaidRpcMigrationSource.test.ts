import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(
    process.cwd(),
    "supabase/migrations/0007_mark_toss_payment_order_paid_rpc.sql",
  ),
  "utf8",
);

describe("mark Toss payment order paid RPC migration source", () => {
  it("defines the paid transition RPC with required security and fields", () => {
    const requiredMarkers = [
      "create or replace function public.mark_toss_payment_order_paid",
      "security definer",
      "set search_path = public",
      "p_provider_order_id text",
      "p_provider_payment_id text",
      "p_amount integer",
      "p_currency text",
      "paid",
      "ready",
      "saju_mbti_full",
      "toss",
      "990",
      "KRW",
      "provider_order_id",
      "provider_payment_id",
      "paid_at",
      "grant execute on function public.mark_toss_payment_order_paid",
      "to anon",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }
  });

  it("contains idempotency and invalid-state error markers", () => {
    const requiredMarkers = [
      "PAYMENT_ORDER_NOT_FOUND",
      "PAYMENT_ORDER_PAID_CONFLICT",
      "PAYMENT_ORDER_NOT_READY",
      "v_order.status = 'paid'",
      "v_order.provider_payment_id = v_provider_payment_id",
      "v_order.status <> 'ready'",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }
  });

  it("does not grant table access, create policies, or return unsafe fields", () => {
    const blockedMarkers = [
      "grant update on table public.payment_orders to anon",
      "grant select on table public.payment_orders to anon",
      "create policy",
      "using (true)",
      "with check (true)",
      "input_snapshot in returns",
      "provider_payment_id in returns",
      "share" + "Token",
      "access" + "TokenHash",
      "report" + "_snapshot",
      "service" + "_role",
      "SUPABASE" + "_SERVICE" + "_ROLE",
      "TOSS" + "_SECRET" + "_KEY",
    ];

    for (const marker of blockedMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
