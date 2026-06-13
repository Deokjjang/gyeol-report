import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(
    process.cwd(),
    "supabase/migrations/0012_support_comprehensive_v2_report_snapshot.sql",
  ),
  "utf8",
);

describe("support comprehensive V2 report snapshot RPC migration source", () => {
  it("extends snapshot save RPC for V1 and V2 draft versions", () => {
    const requiredMarkers = [
      "create or replace function public.save_comprehensive_report_draft_snapshot",
      "p_report_snapshot jsonb",
      "p_generation_version text default 'comprehensive_v2_draft'",
      "comprehensive_v1_draft",
      "comprehensive_v2_draft",
      "p_report_snapshot ->> 'productType' <> 'saju_mbti_full'",
      "v_order.status <> 'paid'",
      "v_order.amount <> 990",
      "v_order.currency <> 'KRW'",
      "v_report.report_snapshot ->> 'version'",
      "grant execute on function public.save_comprehensive_report_draft_snapshot",
      "to anon",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }
  });

  it("extends generated result read RPC with safe V1 and V2 snapshot metadata", () => {
    const requiredMarkers = [
      "drop function if exists public.get_generated_comprehensive_report_result(text)",
      "create or replace function public.get_generated_comprehensive_report_result",
      "snapshot_version text",
      "report_snapshot jsonb",
      "reports.report_snapshot ->> 'version' in ('comprehensive_v1_draft', 'comprehensive_v2_draft')",
      "payment_orders.status = 'paid'",
      "payment_orders.product_type = 'saju_mbti_full'",
      "payment_orders.amount = 990",
      "payment_orders.currency = 'KRW'",
      "grant execute on function public.get_generated_comprehensive_report_result",
      "to anon",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }
  });

  it("does not grant direct table access or return private fields", () => {
    const blockedMarkers = [
      "grant select on table",
      "grant update on table",
      "create policy",
      "using (true)",
      "with check (true)",
      "provider_payment_id",
      "input_snapshot",
      "payment_key",
      "access_token_hash",
      "share_token",
      "SUPABASE" + "_SERVICE" + "_ROLE",
      "service" + "_role",
    ];

    for (const marker of blockedMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
