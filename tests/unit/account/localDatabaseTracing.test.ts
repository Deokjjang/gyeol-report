import { createHash } from "node:crypto";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import { isAbsolute, join, relative } from "node:path";
import { beforeAll, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
const { exec } = vi.hoisted(() => ({ exec: vi.fn().mockResolvedValue(undefined) }));
vi.mock("@electric-sql/pglite", () => ({ PGlite: class { exec = exec; } }));
vi.mock("node:fs/promises", async importOriginal => {
  const original = await importOriginal<typeof import("node:fs/promises")>();
  return { ...original, readFile: vi.fn(original.readFile), readdir: vi.fn(original.readdir) };
});
import { createTicketTestDatabase } from "../../../src/lib/tickets/localDatabase";

const numbered = readdirSync("supabase/migrations").filter(n => /^\d{4}_.*\.sql$/.test(n)).sort();
const expectedFiles = [
  ...numbered.map(n => `supabase/migrations/${n}`),
  "supabase/migrations/20260920163924_production_reliability_reconcile.sql",
  "scripts/paid_report_quarantine_recovery_patch.sql",
  "scripts/paid_payment_confirm_recovery_queue_patch.sql",
  "scripts/paid_report_publish_expiry_patch.sql",
  "supabase/migrations/20261003094827_v4_account_foundation.sql",
  "supabase/migrations/20261003104500_v4_report_library.sql",
  "supabase/migrations/20261003114045_v4_report_tickets.sql",
];
beforeAll(async () => {
  await createTicketTestDatabase();
  if (process.env.TRACE_SQL_CAPTURE) writeFileSync(process.env.TRACE_SQL_CAPTURE, JSON.stringify({
    files: vi.mocked(readFile).mock.calls.map(([file]) => relative(process.cwd(), isAbsolute(String(file)) ? String(file) : join(process.cwd(), String(file)))),
    sqlDigest: createHash("sha256").update(JSON.stringify(exec.mock.calls)).digest("hex"),
  }, null, 2) + "\n");
});
it("preserves the exact local SQL fixture content, order and existing BOM handling", () => {
  const actual = vi.mocked(readFile).mock.calls.map(([file]) => relative(process.cwd(), isAbsolute(String(file)) ? String(file) : join(process.cwd(), String(file))));
  expect(actual).toEqual(expectedFiles);
  expect(exec.mock.calls.slice(2).map(([sql]) => sql)).toEqual(expectedFiles.map((file, i) => {
    const sql = readFileSync(file, "utf8");
    return i < numbered.length ? sql.replace(/^\uFEFF/, "") : sql;
  }));
});
it("bounds every local fixture filesystem read to an absolute SQL subdirectory", () => {
  const files = [...vi.mocked(readFile).mock.calls, ...vi.mocked(readdir).mock.calls].map(([file]) => String(file));
  expect(files.every(isAbsolute)).toBe(true);
  for (const file of files) expect(relative(process.cwd(), file)).toMatch(/^(supabase\/migrations(?:\/|$)|scripts\/)/);
});
