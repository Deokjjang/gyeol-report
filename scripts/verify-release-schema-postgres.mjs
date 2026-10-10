// Catalog-only Production export -> isolated PG17. Never uses customer rows or credentials.
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
assert(process.argv.includes('--isolated-local'));
const container = 'gyeol-release-final-pg17', database = 'release_catalog_rehearsal';
const inspect = JSON.parse(spawnSync('docker', ['inspect', container], { encoding: 'utf8' }).stdout)[0];
assert.equal(inspect.Config.Image, 'postgres:17-alpine');
assert.equal(inspect.HostConfig.NetworkMode, 'none');
assert.equal(inspect.HostConfig.Binds?.length ?? 0, 0);
assert(Object.hasOwn(inspect.HostConfig.Tmpfs, '/var/lib/postgresql/data'));
assert.equal(Object.keys(inspect.HostConfig.PortBindings ?? {}).length, 0);
const m = JSON.parse(readFileSync('/private/tmp/gyeol-release-production-schema.json', 'utf8'));
const ident = s => '"' + s.replaceAll('"', '""') + '"';
function sql(query, db = database) {
  const p = spawnSync('docker', ['exec', '-i', container, 'psql', '-X', '-qAt', '-U', 'postgres', '-d', db, '-v', 'ON_ERROR_STOP=1'],
    { input: `set statement_timeout='30s';set lock_timeout='5s';${query}`, encoding: 'utf8', maxBuffer: 5 * 1024 ** 2 });
  if (p.status) throw new Error(p.stderr);
  return p.stdout.trim();
}
const steps = [];
try {
  sql(`create database ${database};`, 'postgres'); // Fail if present; never reset an existing DB.
  sql('create role anon;create role authenticated;create role service_role bypassrls;create role dashboard_user;create role supabase_admin;');
  sql("create extension if not exists pgcrypto;create extension if not exists \"uuid-ossp\";create schema auth;create table auth.users(id uuid primary key,created_at timestamptz default now());grant usage on schema public,auth to anon,authenticated,service_role;create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;");
  for (const table of m.tables) {
    const cols = m.columns.filter(c => c.table_name === table.relname).map(c => {
      const type = m.columnTypes.find(t => t.table_name === c.table_name && t.column_name === c.column_name).sql_type;
      return `${ident(c.column_name)} ${type}${c.column_default ? ` default ${c.column_default}` : ''}${c.is_nullable === 'NO' ? ' not null' : ''}`;
    });
    sql(`create table public.${ident(table.relname)}(${cols.join(',')});`);
  }
  for (const c of [...m.constraints].sort((a, b) => Number(a.contype === 'f') - Number(b.contype === 'f')))
    sql(`alter table public.${ident(c.table_name)} add constraint ${ident(c.conname)} ${c.definition};`);
  for (const idx of m.indexes) if (!m.constraints.some(c => c.conname === idx.indexname)) sql(idx.indexdef);
  for (const fn of m.functions) {
    sql(fn.definition);
    const signature = `public.${ident(fn.proname)}(${fn.args})`;
    sql(`revoke all on function ${signature} from public;`);
    for (const acl of fn.proacl ?? []) {
      const [role, permissions] = acl.split('=');
      if (permissions.startsWith('X')) sql(`grant execute on function ${signature} to ${role ? ident(role) : 'public'};`);
    }
  }
  for (const t of m.tables) if (t.relrowsecurity) sql(`alter table public.${ident(t.relname)} enable row level security;`);
  for (const g of m.grants) sql(`grant ${g.privilege_type} on public.${ident(g.table_name)} to ${ident(g.grantee)};`);
  for (const p of m.policies ?? []) sql(`create policy ${ident(p.policyname)} on public.${ident(p.tablename)} as ${p.permissive} for ${p.cmd} to ${p.roles.map(r => r === 'public' ? r : ident(r)).join(',')}${p.qual ? ` using (${p.qual})` : ''}${p.with_check ? ` with check (${p.with_check})` : ''};`);
  for (const t of m.triggers ?? []) sql(t.definition);
  steps.push({ step: 'production_catalog_clone', tables: m.tables.length, columns: m.columns.length, functions: m.functions.length });
  const existing = sql("select md5(pg_get_functiondef('public.paid_report_reliability(text,jsonb)'::regprocedure));");
  // Live catalog already includes expiry/external-call/consent/one-call delivery.
  // Historical full-body replacements and destructive cleanup are deliberately excluded.
  const chain = ['scripts/paid_worker_expiry_cost_guard_patch.sql',
    'supabase/migrations/20261003094827_v4_account_foundation.sql',
    'supabase/migrations/20261003104500_v4_report_library.sql',
    'supabase/migrations/20261003114045_v4_report_tickets.sql',
    'supabase/migrations/20261003123157_v4_coupon_foundation.sql',
    'supabase/migrations/20261003143822_v4_friend_referrals.sql',
    'supabase/migrations/20261003154955_v4_growth_campaign_acquisition.sql',
    'supabase/migrations/20261003165059_v4_growth_measurement.sql',
    'supabase/migrations/20261010095005_v4_ticket_bundle_commerce.sql', 'scripts/report_ticket_publication_queue_patch.sql',
    'supabase/migrations/20261010132645_v4_launch_event.sql',
    'supabase/migrations/20261010135755_v4_launch_event_schedule_fix.sql',
    'supabase/migrations/20261010143147_v4_ticket_refunds.sql'];
  for (const file of chain) { sql(readFileSync(file, 'utf8')); steps.push({ step: file, pass: true }); }
  const first = sql("select md5(pg_get_functiondef('public.paid_report_reliability(text,jsonb)'::regprocedure));");
  assert.notEqual(first, existing);
  sql(readFileSync(chain[0], 'utf8'));
  assert.equal(sql("select md5(pg_get_functiondef('public.paid_report_reliability(text,jsonb)'::regprocedure));"), first);
  assert.equal(sql("select bool_and(c.relrowsecurity) from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relkind='r';"), 't');
  for (const fn of ['report_tickets', 'report_ticket_publication', 'ticket_bundle_commerce', 'ticket_bundle_refunds_rpc']) {
    const sig = `${fn}(text,uuid,jsonb)`;
    assert.equal(sql(`select has_function_privilege('anon','${sig}','execute') or has_function_privilege('authenticated','${sig}','execute');`), 'f');
    assert.equal(sql(`select has_function_privilege('service_role','${sig}','execute');`), 't');
  }
  const report = { pass: true, version: sql('select version();'), steps, costPatchIdempotent: true, leastPrivilege: true,
    note: 'Catalog-only rehearsal, no customer rows. auth.users/uid are stubs; platform Auth/Vault/storage/live backfill are not simulated.' };
  writeFileSync('/private/tmp/gyeol-release-schema-result.json', JSON.stringify(report, null, 2));
  process.stdout.write(JSON.stringify(report) + '\n');
} catch (error) {
  writeFileSync('/private/tmp/gyeol-release-schema-result.json', JSON.stringify({ pass: false, steps, error: String(error) }, null, 2));
  process.stderr.write(String(error) + '\n'); process.exitCode = 1;
}
