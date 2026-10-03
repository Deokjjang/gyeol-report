import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { beforeAll, afterAll, describe, expect, it } from "vitest";

const A = "11111111-1111-4111-8111-111111111111", B = "22222222-2222-4222-8222-222222222222";
let db: PGlite;
const records = [{ consent_type: "terms", document_version: "v1", is_agreed: true, required: true }, { consent_type: "privacy", document_version: "v1", is_agreed: true, required: true }];
async function save(user: string, id: number, values: object[] = records, source = "first_login") {
  const result = await db.query<{ ok: boolean }>("select public.record_account_consent($1,$2,$3,$4,$5,$6::jsonb) as ok", [user, `33333333-3333-4333-8333-${String(id).padStart(12, "0")}`, "검수 회원", "kakao", source, JSON.stringify(values)]);
  return result.rows[0].ok;
}
beforeAll(async () => {
  db = new PGlite();
  await db.exec(`create role anon; create role authenticated; create role service_role bypassrls;
    create schema auth; create table auth.users(id uuid primary key);
    create function auth.uid() returns uuid language sql stable as 'select nullif(current_setting(''request.jwt.claim.sub'', true), '''')::uuid';
    grant usage on schema auth, public to anon, authenticated, service_role;
    grant execute on function auth.uid() to authenticated;
    insert into auth.users values ('${A}'),('${B}');
    alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
    alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;`);
  await db.exec(readFileSync("supabase/migrations/20261003094827_v4_account_foundation.sql", "utf8"));
}, 20000);
afterAll(async () => { await db?.close(); });
describe("local Postgres migration: real SQL, no Production connection", () => {
  it("service writes atomically and idempotently; mismatched retry rejected", async () => {
    await db.exec("set role service_role");
    expect(await save(A, 1)).toBe(true); expect(await save(A, 1)).toBe(true);
    expect(await save(A, 1, records.map(r => ({ ...r, document_version: "v2" })))).toBe(false);
    expect((await db.query("select * from public.account_consent_events")).rows).toHaveLength(2);
    expect(await save(B, 2)).toBe(true); await db.exec("reset role");
  });
  it("anon cannot read; authenticated reads only own profile/history and cannot mutate or call RPC", async () => {
    await db.exec("set role anon");
    await expect(db.query("select * from public.account_profiles")).rejects.toThrow(/permission denied/);
    await expect(db.query("select * from public.account_consent_events")).rejects.toThrow(/permission denied/);
    await db.exec(`reset role; set role authenticated; set request.jwt.claim.sub='${A}'`);
    expect((await db.query<{ user_id: string }>("select user_id from public.account_profiles")).rows).toEqual([{ user_id: A }]);
    expect((await db.query("select * from public.account_consent_events")).rows).toHaveLength(2);
    await expect(save(B, 3)).rejects.toThrow(/permission denied/);
    await expect(db.query("update public.account_profiles set display_name='forged'")).rejects.toThrow(/permission denied/);
    await db.exec("reset role");
  });
  it("missing required consent does not activate; reconsent appends history", async () => {
    await db.exec("set role service_role");
    expect(await save(A, 3, records.slice(0, 1))).toBe(false);
    expect(await save(A, 4, records.map(r => ({ ...r, document_version: "v2" })), "reconsent")).toBe(true);
    expect((await db.query("select * from public.account_consent_events where user_id=$1", [A])).rows).toHaveLength(4);
    await db.exec("reset role");
  });
  it("optional marketing decline/withdrawal is append-only and never blocks required terms", async () => {
    await db.exec("set role service_role");
    expect(await save(B, 5, [...records, { consent_type: "marketing", document_version: "future-only", is_agreed: false, required: false }])).toBe(true);
    expect(await save(B, 6, [{ consent_type: "marketing", document_version: "future-only", is_agreed: false, required: false }], "withdrawal")).toBe(true);
    expect(await save(B, 6, [{ consent_type: "marketing", document_version: "future-only", is_agreed: false, required: false }], "withdrawal")).toBe(true);
    await expect(db.query("delete from public.account_consent_events")).rejects.toThrow(/permission denied/);
    await expect(db.query("update public.account_consent_events set is_agreed=true")).rejects.toThrow(/permission denied/);
    await db.exec("reset role");
  });
  it("function is invoker, profile has FK, new tables RLS enabled; no existing commerce table modified", async () => {
    expect((await db.query<{ prosecdef: boolean }>("select prosecdef from pg_proc where proname='record_account_consent'")).rows[0].prosecdef).toBe(false);
    expect((await db.query<{ relrowsecurity: boolean }>("select relrowsecurity from pg_class where relname in ('account_profiles','account_consent_events')")).rows.every(r => r.relrowsecurity)).toBe(true);
    const sql = readFileSync("supabase/migrations/20261003094827_v4_account_foundation.sql", "utf8");
    expect(sql).not.toMatch(/payment_orders|paid_report_snapshots|report_share_links/);
  });
});
