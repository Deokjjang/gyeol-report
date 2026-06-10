import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readMigration(): string {
  return readFileSync(
    join(
      process.cwd(),
      "supabase/migrations/0005_create_ready_payment_order_rpc.sql",
    ),
    "utf8",
  );
}

const migration = readMigration();

describe("create ready payment order RPC migration source", () => {
  it("defines a narrow security-definer ready-order RPC", () => {
    const requiredMarkers = [
      "create or replace function public.create_ready_payment_order",
      "security definer",
      "set search_path = public",
      "p_payment_order_id text",
      "p_product_type text",
      "p_provider text",
      "p_amount integer",
      "p_currency text",
      "p_input_snapshot jsonb",
      "p_provider_order_id text",
      "insert into public.payment_orders",
      "status",
      "ready",
      "saju_mbti_full",
      "toss",
      "kakao_pay",
      "1290",
      "KRW",
      "jsonb_typeof",
      "grant execute on function public.create_ready_payment_order",
      "to anon",
    ];

    for (const marker of requiredMarkers) {
      expect(migration).toContain(marker);
    }
  });

  it("returns only safe order fields", () => {
    const returnedFieldsStart = migration.indexOf("returns table (");
    const returnedFieldsEnd = migration.indexOf(")\nlanguage plpgsql", returnedFieldsStart);
    const returningFieldsStart = migration.indexOf("    returning");
    const returningFieldsEnd = migration.indexOf("  )\n  select", returningFieldsStart);
    const returnedFields = migration.slice(returnedFieldsStart, returnedFieldsEnd);
    const returningFields = migration.slice(returningFieldsStart, returningFieldsEnd);
    const restrictedReturnMarkers = [
      "input_snapshot",
      "provider_" + "payment_id",
      "report_id",
      "paid_at",
      "failed_at",
      "canceled_at",
      "refunded_at",
      "deleted_at",
    ];

    expect(returnedFieldsStart).toBeGreaterThanOrEqual(0);
    expect(returnedFieldsEnd).toBeGreaterThan(returnedFieldsStart);
    expect(returningFieldsStart).toBeGreaterThanOrEqual(0);
    expect(returningFieldsEnd).toBeGreaterThan(returningFieldsStart);

    for (const marker of restrictedReturnMarkers) {
      expect(returnedFields).not.toContain(marker);
      expect(returningFields).not.toContain(marker);
    }
  });

  it("does not add table policies, paid transitions, secrets, or stored-value concepts", () => {
    const rejectedMarkers = [
      "grant " + "select on table public.payment_orders to anon",
      "grant " + "insert on table public.payment_orders to anon",
      "grant " + "update on table public.payment_orders to anon",
      "grant " + "delete on table public.payment_orders to anon",
      "create " + "policy",
      "for " + "select",
      "for " + "insert",
      "for " + "update",
      "for " + "delete",
      "using " + "(true)",
      "with check " + "(true)",
      "service" + "_role",
      "SUPABASE" + "_SERVICE" + "_ROLE",
      "mark_" + "paid",
      "mark_" + "refunded",
      "mark_" + "canceled",
      "payment_status = '" + "paid'",
      "status = '" + "paid'",
      "share" + "Token",
      "access" + "TokenHash",
      "provider_" + "payment_id",
      "wall" + "et",
      "re" + "charge",
      "point " + "balance",
      "credit " + "balance",
      "충" + "전",
      "포" + "인트",
      "잔" + "액",
    ];

    for (const marker of rejectedMarkers) {
      expect(migration).not.toContain(marker);
    }
  });
});
