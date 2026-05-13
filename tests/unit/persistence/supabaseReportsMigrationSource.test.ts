import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readFile(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

const migrationSql = readFile(
  "supabase/migrations/0001_create_reports_table.sql",
);

describe("supabase reports migration source", () => {
  it("creates public reports table", () => {
    expect(migrationSql).toContain("create table if not exists public.reports");
    expect(migrationSql).toContain(
      "constraint reports_pkey primary key (report_id)",
    );
  });

  it("contains required report columns", () => {
    const columns = [
      "report_id",
      "status",
      "access_mode",
      "input_snapshot",
      "report_snapshot",
      "report_version",
      "calculation_version",
      "locale",
      "access_token_hash",
      "access_token_created_at",
      "access_token_rotated_at",
      "access_token_version",
      "payment_order_id",
      "payment_provider",
      "payment_provider_payment_id",
      "payment_status",
      "payment_amount",
      "payment_currency",
      "payment_paid_at",
      "payment_refunded_at",
      "created_at",
      "updated_at",
      "deleted_at",
    ];

    for (const column of columns) {
      expect(migrationSql).toContain(column);
    }
  });

  it("contains required column types and timestamp defaults", () => {
    const typeMarkers = ["jsonb", "numeric", "timestamptz", "text"];

    for (const marker of typeMarkers) {
      expect(migrationSql).toContain(marker);
    }

    expect(migrationSql).toContain(
      "created_at timestamptz not null default now()",
    );
    expect(migrationSql).toContain(
      "updated_at timestamptz not null default now()",
    );
  });

  it("contains status access and payment constraints", () => {
    const valueMarkers = [
      "draft",
      "generated",
      "paid_unlocked",
      "deleted",
      "preview",
      "paid",
      "not_required",
      "pending",
      "failed",
      "refunded",
      "KRW",
      "JPY",
      "USD",
    ];

    for (const marker of valueMarkers) {
      expect(migrationSql).toContain(marker);
    }

    const constraintMarkers = [
      "check",
      "status",
      "access_mode",
      "payment_status",
      "payment_currency",
    ];

    for (const marker of constraintMarkers) {
      expect(migrationSql).toContain(marker);
    }
  });

  it("contains required indexes", () => {
    const indexMarkers = [
      "create index if not exists reports_status_idx",
      "create index if not exists reports_access_mode_idx",
      "create index if not exists reports_created_at_idx",
      "create unique index if not exists reports_payment_order_id_unique_idx",
      "where payment_order_id is not null",
      "create index if not exists reports_payment_provider_payment_id_idx",
    ];

    for (const marker of indexMarkers) {
      expect(migrationSql).toContain(marker);
    }
  });

  it("contains RLS access safety comments", () => {
    const comments = [
      "RLS policy is intentionally not finalized",
      "Public client access must not be granted directly to all reports",
      "Server-side routes should mediate report lookup and paid unlock flows",
    ];

    for (const comment of comments) {
      expect(migrationSql).toContain(comment);
    }
  });

  it("contains sensitive data safety comments", () => {
    const comments = [
      "Do not store plaintext access tokens",
      "Do not store raw card data",
      "Do not store raw sensitive provider payloads by default",
    ];

    for (const comment of comments) {
      expect(migrationSql).toContain(comment);
    }
  });

  it("omits live secrets and provider client code", () => {
    const blockedMarkers = [
      "service" + "_role",
      "SUPABASE_SERVICE" + "_ROLE",
      "SUPABASE_ANON" + "_KEY",
      "password" + " =",
      "@" + "supabase/supabase-js",
      "create" + "Client",
    ];

    for (const marker of blockedMarkers) {
      expect(migrationSql).not.toContain(marker);
    }
  });
});
