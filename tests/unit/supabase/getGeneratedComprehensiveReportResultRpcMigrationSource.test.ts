import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(
    process.cwd(),
    "supabase/migrations/0011_get_generated_comprehensive_report_result_rpc.sql",
  ),
  "utf8",
);

describe("get generated comprehensive report result RPC migration source", () => {
  it("defines a security definer generated report result RPC", () => {
    const requiredMarkers = [
      "create or replace function public.get_generated_comprehensive_report_result",
      "security definer",
      "set search_path = public",
      "p_report_id text",
      "report_id text",
      "product_type text",
      "status text",
      "snapshot_status text",
      "report_snapshot jsonb",
      "created_at timestamptz",
      "updated_at timestamptz",
      "grant execute on function public.get_generated_comprehensive_report_result",
      "to anon",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }
  });

  it("requires a linked paid Toss launch-price report context", () => {
    const requiredMarkers = [
      "REPORT_RESULT_INVALID_REPORT_ID",
      "REPORT_RESULT_NOT_FOUND",
      "comprehensive_v1_draft",
      "saju_mbti_full",
      "payment_orders",
      "payment_orders.report_id = reports.report_id",
      "payment_orders.status = 'paid'",
      "payment_orders.product_type = 'saju_mbti_full'",
      "payment_orders.amount = 990",
      "payment_orders.currency = 'KRW'",
      "reports.status in ('paid_unlocked', 'generated')",
      "reports.payment_status = 'paid'",
      "'generated'::text",
      "'missing'::text",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }
  });

  it("does not grant table access, create policies, or return private fields", () => {
    const returnsSection = source.slice(
      source.indexOf("returns table"),
      source.indexOf("language plpgsql"),
    );
    const blockedSourceMarkers = [
      "grant select on table",
      "grant update on table",
      "create policy",
      "using (true)",
      "with check (true)",
      "share" + "Token",
      "access" + "TokenHash",
      "SUPABASE" + "_SERVICE" + "_ROLE",
      "service" + "_role",
    ];
    const blockedReturnMarkers = [
      "provider" + "_payment" + "_id",
      "input" + "_snapshot",
      "payment" + "_key",
      "access" + "_token" + "_hash",
      "share" + "_token",
    ];

    for (const marker of blockedSourceMarkers) {
      expect(source).not.toContain(marker);
    }

    for (const marker of blockedReturnMarkers) {
      expect(returnsSection).not.toContain(marker);
    }
  });
});
