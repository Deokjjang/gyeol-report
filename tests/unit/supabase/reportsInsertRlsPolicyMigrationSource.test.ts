import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readMigration(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

const migration = readMigration(
  "supabase/migrations/0002_reports_insert_rls_policy.sql",
);

describe("reports insert rls policy migration source", () => {
  it("enables rls and grants anon insert only", () => {
    const requiredMarkers = [
      "alter table public.reports enable row level security",
      "grant usage on schema public to anon",
      "grant insert on table public.reports to anon",
      "create policy reports_insert_anon",
      "for insert",
      "to anon",
      "with check (true)",
    ];

    for (const marker of requiredMarkers) {
      expect(migration).toContain(marker);
    }
  });

  it("does not weaken rls or add non-insert policies", () => {
    const rejectedMarkers = [
      "disable row level security",
      "for " + "select",
      "for " + "update",
      "for " + "delete",
      "service" + "_role",
      "postgresql" + "://",
    ];

    for (const marker of rejectedMarkers) {
      expect(migration).not.toContain(marker);
    }
  });
});
