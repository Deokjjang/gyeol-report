import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readMigration(): string {
  return readFileSync(
    join(process.cwd(), "supabase/migrations/0004_create_payment_orders_table.sql"),
    "utf8",
  );
}

const migration = readMigration();

describe("payment orders table migration source", () => {
  it("creates a product-aware payment orders table", () => {
    const requiredMarkers = [
      "create table if not exists public.payment_orders",
      "payment_order_id text primary key",
      "product_type text not null",
      "provider text not null",
      "amount integer not null",
      "currency text not null",
      "status text not null",
      "input_snapshot jsonb not null",
      "provider_payment_id text",
      "provider_order_id text",
      "report_id text",
      "paid_at timestamptz",
      "failed_at timestamptz",
      "canceled_at timestamptz",
      "refunded_at timestamptz",
      "deleted_at timestamptz",
      "alter table public.payment_orders enable row level security",
      "saju_mbti_full",
      "saju_basic",
      "saju_full",
      "daewoon",
      "saewoon",
      "compatibility",
      "toss",
      "kakao_pay",
      "KRW",
      "ready",
      "paid",
      "failed",
      "canceled",
      "refunded",
    ];

    for (const marker of requiredMarkers) {
      expect(migration).toContain(marker);
    }
  });

  it("does not add anon policies, secrets, or balance-style concepts", () => {
    const rejectedMarkers = [
      "grant " + "select on table public.payment_orders to anon",
      "grant " + "insert on table public.payment_orders to anon",
      "grant " + "update on table public.payment_orders to anon",
      "grant " + "delete on table public.payment_orders to anon",
      "for " + "select",
      "for " + "insert",
      "for " + "update",
      "for " + "delete",
      "using " + "(true)",
      "with check " + "(true)",
      "service" + "_role",
      "postgresql" + "://",
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
