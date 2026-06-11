import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(
    process.cwd(),
    "supabase/migrations/0010_save_comprehensive_report_draft_snapshot_rpc.sql",
  ),
  "utf8",
);

describe("save comprehensive report draft snapshot RPC migration source", () => {
  it("defines a security definer RPC that validates paid linked orders", () => {
    const requiredMarkers = [
      "create or replace function public.save_comprehensive_report_draft_snapshot",
      "security definer",
      "set search_path = public",
      "p_report_id text",
      "p_provider_order_id text",
      "p_report_snapshot jsonb",
      "comprehensive_v1_draft",
      "saju_mbti_full",
      "payment_orders",
      "report_id",
      "provider_order_id",
      "v_order.status <> 'paid'",
      "v_order.amount <> 990",
      "v_order.currency <> 'KRW'",
      "grant execute on function public.save_comprehensive_report_draft_snapshot",
      "to anon",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }
  });

  it("does not grant direct table access or return private fields", () => {
    const blockedMarkers = [
      "grant update on table",
      "grant select on table",
      "create policy",
      "using (true)",
      "with check (true)",
      "provider_payment_id",
      "input_snapshot",
      "share" + "Token",
      "access" + "TokenHash",
      "SUPABASE" + "_SERVICE" + "_ROLE",
      "service" + "_role",
    ];

    for (const marker of blockedMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
