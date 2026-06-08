import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readMigration(): string {
  return readFileSync(
    join(
      process.cwd(),
      "supabase/migrations/0003_find_paid_report_by_access_token_hash_rpc.sql",
    ),
    "utf8",
  );
}

const source = readMigration();

describe("find paid report by access-token-hash RPC migration", () => {
  it("defines a narrow security-definer paid lookup RPC", () => {
    const requiredMarkers = [
      "create or replace function public.find_paid_report_by_access_token_hash",
      "p_access_token_hash text",
      "security definer",
      "set search_path = public",
      "where reports.access_token_hash = p_access_token_hash",
      "reports.status = 'paid_unlocked'",
      "reports.access_mode = 'paid'",
      "reports.payment_status = 'paid'",
      "reports.deleted_at is null",
      "grant execute on function public.find_paid_report_by_access_token_hash(text) to anon",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }
  });

  it("does not add broad table select or return restricted fields", () => {
    const returnedFieldsStart = source.indexOf("returns table (");
    const returnedFieldsEnd = source.indexOf(")\nlanguage sql", returnedFieldsStart);
    const selectListStart = source.indexOf("  select");
    const selectListEnd = source.indexOf("  from public.reports", selectListStart);
    const returnedFields = source.slice(returnedFieldsStart, returnedFieldsEnd);
    const selectedFields = source.slice(selectListStart, selectListEnd);
    const rejectedMarkers = [
      "grant select on table public.reports to anon",
      "for select",
      "using (true)",
      "service" + "_role",
      "postgresql://",
      "payment_provider_payment_id",
      "access_token_created_at",
      "access_token_version",
    ];

    expect(returnedFieldsStart).toBeGreaterThanOrEqual(0);
    expect(returnedFieldsEnd).toBeGreaterThan(returnedFieldsStart);
    expect(selectListStart).toBeGreaterThanOrEqual(0);
    expect(selectListEnd).toBeGreaterThan(selectListStart);
    expect(returnedFields).not.toContain("access_token_hash");
    expect(selectedFields).not.toContain("access_token_hash");

    for (const marker of rejectedMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
