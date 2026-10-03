import "server-only";
import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import type { PGlite } from "@electric-sql/pglite";
import type { TicketResult, TicketStore } from "./service";

// The dev flow executes the prepared SQL, not a second in-memory ledger algorithm.
// No Supabase client, environment credential or network is constructed here.
export async function createTicketTestDatabase(): Promise<PGlite> {
  const { PGlite: Database } = await import("@electric-sql/pglite");
  const db = new Database();
  await db.exec("create role anon; create role authenticated; create role service_role bypassrls; create schema auth; create table auth.users(id uuid primary key); grant usage on schema public,auth to anon,authenticated,service_role;");
  await db.exec("create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;");
  for (const file of (await readdir("supabase/migrations")).filter(n => /^\d{4}_.*\.sql$/.test(n)).sort()) await db.exec((await readFile(`supabase/migrations/${file}`, "utf8")).replace(/^\uFEFF/, ""));
  for (const file of ["supabase/migrations/20260920163924_production_reliability_reconcile.sql", "scripts/paid_report_quarantine_recovery_patch.sql", "scripts/paid_payment_confirm_recovery_queue_patch.sql", "scripts/paid_report_publish_expiry_patch.sql", "supabase/migrations/20261003094827_v4_account_foundation.sql", "supabase/migrations/20261003104500_v4_report_library.sql", "supabase/migrations/20261003114045_v4_report_tickets.sql"]) await db.exec(await readFile(file, "utf8"));
  return db;
}
export function sqlTicketStore(db: PGlite): TicketStore {
  return { async call(action, user, data = {}) { return (await db.query<{ result: TicketResult }>("select public.report_tickets($1,$2,$3::jsonb) result", [action, user, JSON.stringify(data)])).rows[0].result; } };
}
const state = globalThis as typeof globalThis & { __ticketSqlReview?: Promise<PGlite>; __ticketReviewFailure?: Set<string> };
export function failNextLocalTicketPublish(user: string) {
  if (["test", "development"].includes(process.env.NODE_ENV)) (state.__ticketReviewFailure ??= new Set()).add(user);
}
export const localTicketUserId = (user: string) => {
  const h = createHash("sha256").update(`ticket-review:${user}`).digest("hex");
  return `${h.slice(0,8)}-${h.slice(8,12)}-4${h.slice(13,16)}-a${h.slice(17,20)}-${h.slice(20,32)}`;
};
export async function localTicketStore(): Promise<TicketStore | null> {
  if (!["development", "test"].includes(process.env.NODE_ENV)) return null;
  state.__ticketSqlReview ??= createTicketTestDatabase();
  const db = await state.__ticketSqlReview;
  return { async call(action, user, data) {
    if (action === "publish" && state.__ticketReviewFailure?.delete(user)) return { ok: false, code: "LOCAL_TEST_PUBLISH_FAILURE" };
    const id = localTicketUserId(user);
    return db.transaction(async tx => {
      await tx.query("insert into auth.users(id) values($1) on conflict do nothing", [id]);
      await tx.exec("set local role service_role");
      return (await tx.query<{ result: TicketResult }>("select public.report_tickets($1,$2,$3::jsonb) result", [action,id,JSON.stringify(data??{})])).rows[0].result;
    });
  } };
}
// Explicit fixture helper only. Never runs on login, signup or library visits.
export async function grantTestReportTickets(store: TicketStore, user: string, scenario: "one" | "several") {
  return store.call("grant", user, { quantity: scenario === "one" ? 1 : 6, sourceType: "manual", sourceRef: `local-review-${user}-${scenario}`, key: `local-review-${scenario}`, reason: "LOCAL_TEST_ONLY" });
}
