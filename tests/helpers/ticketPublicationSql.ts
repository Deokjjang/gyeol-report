import { readFileSync, readdirSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { paidWorkerSql } from "./paidWorkerSql";
import type { AccountPort } from "../../src/lib/account/handler";
import { ACCOUNT_POLICY_VERSIONS } from "../../src/lib/account/policy";
import type { TicketPublicationStore } from "../../src/lib/tickets/publication";
import type { TicketResult } from "../../src/lib/tickets/service";
import { sqlTicketStore } from "../../src/lib/tickets/localDatabase";
export const TICKET_A = "11111111-1111-4111-8111-111111111111", TICKET_B = "22222222-2222-4222-8222-222222222222";
export function ticketAuth(user: string | null = TICKET_A, consent = true): AccountPort {
  const identity = user ? { id: user, displayName: "검수", provider: "google" as const } : null;
  return { currentUser: async () => identity, read: async () => ({ profile: identity, consents: consent ? Object.entries(ACCOUNT_POLICY_VERSIONS).map(([consent_type, document_version]) => ({ consent_type: consent_type as "terms" | "privacy", document_version, is_agreed: true, required: true, recorded_at: new Date().toISOString() })) : [] }), start: async () => null, exchange: async () => false, logout: async () => true, consent: async () => true, authorizationOrigin: "https://example.invalid", finish: r => r };
}
export async function ticketPublicationSql() {
  const { db, store: paid } = await paidWorkerSql();
  await db.exec("alter role service_role bypassrls; create schema auth; create table auth.users(id uuid primary key,created_at timestamptz default now()); grant usage on schema public,auth to anon,authenticated,service_role; create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;");
  await db.exec(readFileSync("supabase/migrations/20260929113608_report_share_links.sql", "utf8"));
  for (const f of readdirSync("supabase/migrations").filter(n => n.startsWith("20261003")).sort()) await db.exec(readFileSync(`supabase/migrations/${f}`, "utf8"));
  for (const f of ["supabase/migrations/20261010095005_v4_ticket_bundle_commerce.sql", "scripts/report_ticket_publication_queue_patch.sql"]) await db.exec(readFileSync(f, "utf8"));
  await db.query("insert into auth.users(id) values($1),($2)", [TICKET_A, TICKET_B]);
  await db.exec("set role service_role");
  for (const user of [TICKET_A, TICKET_B]) await db.query("select record_account_consent($1,$2,'로컬','google','first_login',$3::jsonb)", [user, randomUUID(), JSON.stringify(Object.entries(ACCOUNT_POLICY_VERSIONS).map(([consent_type, document_version]) => ({ consent_type, document_version, is_agreed: true, required: true })))]);
  const queue: TicketPublicationStore = { async call(action, user, data = {}) { return (await db.query<{ r: TicketResult }>("select report_ticket_publication($1,$2,$3::jsonb) r", [action, user, JSON.stringify(data)])).rows[0].r; } };
  return { db, queue, tickets: sqlTicketStore(db), paid };
}
