// Explicit opt-in, isolated local Docker only. No connection strings or secrets.
// node scripts/verify-ticket-commerce-postgres.mjs --isolated-local
import { spawnSync, spawn } from 'node:child_process';
import { readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import assert from 'node:assert/strict';
const container = 'gyeol-commerce04a-pg';
assert(process.argv.includes('--isolated-local'), 'Explicit local opt-in required');
const inspect = JSON.parse(spawnSync('docker', ['inspect', container], { encoding: 'utf8' }).stdout)[0];
assert.equal(inspect.HostConfig.NetworkMode, 'none');
assert(inspect.Config.Image.startsWith('postgres:16-alpine'));
assert(inspect.HostConfig.Tmpfs['/var/lib/postgresql/data']);
assert.equal(inspect.HostConfig.Binds?.length ?? 0, 0);
const output = '/private/tmp/gyeol-v4-commerce-04a';
mkdirSync(output, { recursive: true });
const pids = new Set(), durations = [], results = [];
function sql(query, role = '', database = 'commerce04a') {
  const start = performance.now();
  return new Promise((resolve, reject) => {
    const p = spawn('docker', ['exec', '-i', container, 'psql', '-X', '-qAt', '-v', 'ON_ERROR_STOP=1', '-U', 'postgres', '-d', database]);
    let out = '', err = '';
    p.stdout.on('data', d => out += d); p.stderr.on('data', d => err += d);
    p.on('close', code => { durations.push(performance.now() - start); if (code) reject(new Error(err)); else resolve(out.trim()); });
    p.stdin.end(`${role ? `set role ${role};` : ''} set statement_timeout='15s'; set lock_timeout='10s'; ${query}`);
  });
}
const quote = v => `'${String(v).replaceAll("'", "''")}'`;
const json = v => `${quote(JSON.stringify(v))}::jsonb`;
const A = '11111111-1111-4111-8111-111111111111', B = '22222222-2222-4222-8222-222222222222';
async function rpc(fn, action, user = A, data = {}, hold = false) {
  const raw = await sql(`begin; select json_build_object('pid',pg_backend_pid(),'r',${fn}(${quote(action)},${user ? quote(user) + '::uuid' : 'null'},${json(data)})); ${hold ? 'select pg_sleep(0.15);' : ''} commit;`, 'service_role');
  const value = JSON.parse(raw.split('\n').find(l => l.startsWith('{'))); pids.add(value.pid); return value.r;
}
const ticket = (...a) => rpc('report_tickets', ...a), queue = (...a) => rpc('report_ticket_publication', ...a), bundle = (...a) => rpc('ticket_bundle_commerce', ...a);
const policy = { terms: '2026-06-14.1', privacy: '2026-09-22.1' };
const input = (requestId = randomUUID()) => ({ requestId, inputHash: 'a'.repeat(64), reportId: `report_${randomUUID().replaceAll('-', '')}`, productType: 'saju_mbti_full', input: {}, displayName: '격리 SQL 검수', consentEvidence: { version: 'checkout-consent-v1' }, policyAt: new Date().toISOString() });
const grant = (n = 1, sourceType = 'manual') => ticket('grant', A, { quantity: n, sourceType, sourceRef: randomUUID(), key: randomUUID(), reason: 'ISOLATED_SQL_QA' });
const reset = () => sql('truncate ticket_bundle_orders,report_ticket_grants,payment_orders cascade;');
const count = async (table, where = 'true') => Number(await sql(`select count(*) from ${table} where ${where};`));
async function check(name, run) { const t = performance.now(); await reset(); await run(); results.push({ name, pass: true, ms: Math.round(performance.now() - t) }); process.stdout.write(`PASS ${name}\n`); }
async function prepare() { const r = await bundle('prepare', A, { bundleId: 'PACK_5', quantity: 5, amount: 6890, currency: 'KRW', requestId: randomUUID(), consent: policy }); assert(r.ok); return r.order; }
async function approve(o, c) { return bundle('approved', A, { orderId: o.orderId, token: c.token, paymentKey: `local-${o.orderId}`, provider: 'toss', providerOrderId: o.providerOrderId, amount: o.amount, currency: 'KRW', status: 'DONE', paidAt: '2026-10-10T00:00:00Z' }); }
async function paid() { const o = await prepare(); const c = await bundle('claim', A, { orderId: o.orderId, amount: o.amount, paymentKey: `local-${o.orderId}` }); assert((await approve(o, c)).ok); assert((await bundle('grant', A, { orderId: o.orderId })).ok); return o; }
async function publish(c) { return queue('publish', A, { redemptionId: c.redemptionId, token: c.token, gateVersion: 'paid-report-v1', snapshot: { reportId: c.reportId, productType: c.productType, productVersion: 'v4', draft: {}, evidencePacket: {} } }); }
try {
  // Fresh DB only. Never drop/reinitialize an existing database.
  await sql('create database commerce04a;', '', 'postgres');
  await sql('create role anon; create role authenticated; create role service_role bypassrls;');
  const migrations = readdirSync('supabase/migrations');
  const files = migrations.filter(n => /^\d{4}_.*\.sql$/.test(n)).sort().map(n => `supabase/migrations/${n}`);
  files.push('supabase/migrations/20260920163924_production_reliability_reconcile.sql', ...['paid_report_quarantine_recovery_patch','paid_payment_confirm_recovery_queue_patch','paid_report_publish_expiry_patch','paid_report_external_call_guard_patch','paid_checkout_consent_evidence_patch','paid_report_one_call_delivery_patch','paid_worker_expiry_cost_guard_patch'].map(n => `scripts/${n}.sql`));
  for (const f of files) await sql(readFileSync(f, 'utf8').replace(/^\uFEFF/, ''));
  await sql("create schema auth; create table auth.users(id uuid primary key,created_at timestamptz default now()); grant usage on schema public,auth to anon,authenticated,service_role; create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;");
  const memberFiles = ['supabase/migrations/20260929113608_report_share_links.sql', ...migrations.filter(n => n.startsWith('20261003')).sort().map(n => `supabase/migrations/${n}`), 'supabase/migrations/20261010095005_v4_ticket_bundle_commerce.sql', 'scripts/report_ticket_publication_queue_patch.sql'];
  for (const f of memberFiles) await sql(readFileSync(f, 'utf8'));
  await sql(`insert into auth.users(id) values('${A}'),('${B}');`);
  for (const u of [A, B]) await sql(`select record_account_consent('${u}','${randomUUID()}','격리 SQL','google','first_login',${json(Object.entries(policy).map(([consent_type, document_version]) => ({ consent_type, document_version, is_agreed: true, required: true })))});`, 'service_role');
  await check('A independent last-ticket race', async () => {
    await grant(); const r = await Promise.all([queue('enqueue', A, input(), true), queue('enqueue', A, input(), true)]);
    assert.equal(r.filter(x => x.ok).length, 1); assert.equal(r.filter(x => x.code === 'NO_USABLE_TICKET').length, 1);
    assert.equal(await count('report_ticket_ledger', "event_type='REDEEM'"), 1); assert.equal((await ticket('summary')).quantity, 0);
  });
  await check('B 100 retries / 10 simultaneous independent backends', async () => {
    await grant(); const d = input(), all = [];
    for (let i = 0; i < 10; i++) all.push(...await Promise.all(Array.from({ length: 10 }, () => queue('enqueue', A, d, true))));
    assert(all.every(x => x.ok)); assert.equal(new Set(all.map(x => x.redemptionId)).size, 1);
    const c = await queue('claim', null); assert.equal((await publish(c)).state, 'COMPLETED');
    assert.equal((await queue('enqueue', A, d)).state, 'COMPLETED');
    for (const t of ['report_ticket_redemptions','paid_report_snapshots','report_account_links']) assert.equal(await count(t), 1);
    assert.equal(await count('report_ticket_ledger', "event_type='REDEEM'"), 1);
  });
  await check('C concurrent claim / approval / grant / recovery and owner isolation', async () => {
    const o = await prepare(), d = { orderId: o.orderId, amount: o.amount, paymentKey: `local-${o.orderId}` };
    const cs = await Promise.all(Array.from({ length: 10 }, () => bundle('claim', A, d, true)));
    assert.equal(cs.filter(c => c.token).length, 1);
    const c = cs.find(c => c.token); const as = await Promise.all(Array.from({ length: 8 }, () => approve(o, c))); assert(as.every(r => r.ok));
    const gs = await Promise.all(Array.from({ length: 10 }, (_, i) => bundle(i % 2 ? 'recover' : 'grant', A, { orderId: o.orderId }, true))); assert(gs.every(r => r.ok));
    assert.equal(await count('report_ticket_ledger', "event_type='GRANT'"), 1); assert.equal((await ticket('summary')).quantity, 5);
    assert.equal((await bundle('read', B, { orderId: o.orderId })).code, 'ORDER_NOT_FOUND');
    assert.equal(await count('ticket_bundle_orders', 'paid_at is not null'), 1);
  });
  await check('D worker lease fence, publish once, expired recovery', async () => {
    await grant(2); await queue('enqueue', A, input());
    const cs = await Promise.all(Array.from({ length: 8 }, () => queue('claim', null, {}, true))); assert.equal(cs.filter(x => x.token).length, 1);
    const c = cs.find(x => x.token);
    assert.equal((await publish({ ...c, token: randomUUID() })).code, 'STALE_LEASE');
    const ps = await Promise.all(Array.from({ length: 5 }, () => publish(c))); assert(ps.every(x => x.state === 'COMPLETED'));
    await queue('reverse', A, { redemptionId: c.redemptionId, token: c.token }); assert.equal(await count('report_ticket_ledger', "event_type='REVERSAL'"), 0);
    await queue('enqueue', A, input()); const stale = await queue('claim', null);
    await sql(`update report_ticket_redemptions set lease_until=now()-interval '1 minute' where id='${stale.redemptionId}';`);
    await queue('claim', null); assert.equal((await publish(stale)).state, 'REVERSED');
    assert.equal(await count('report_ticket_ledger', "event_type='REVERSAL'"), 1); assert.equal((await ticket('summary')).quantity, 1);
  });
  await check('E refund hold vs redeem serialized by account lock', async () => {
    const o = await paid(); const r = await Promise.all([bundle('refund_hold', A, { orderId: o.orderId, requestId: randomUUID() }, true), queue('enqueue', A, input(), true)]);
    assert(r[0].ok); assert(r[1].ok || r[1].code === 'REFUND_HOLD');
    assert.equal((await queue('enqueue', A, input())).code, 'REFUND_HOLD');
    const used = await count('report_ticket_ledger', "event_type='REDEEM'"); assert(used <= 1); assert.equal((await ticket('summary')).quantity, 5 - used);
    const review = await bundle('refund_review', A, { orderId: o.orderId }); assert.equal(review.remaining, 5 - used);
  });
  await check('RLS / least privilege / append-only ledger', async () => {
    await paid();
    for (const role of ['anon', 'authenticated']) {
      for (const query of ["select ticket_bundle_commerce('grant',null,'{}');", "select report_tickets('grant',null,'{}');", "select report_ticket_publication('enqueue',null,'{}');", 'select * from ticket_bundle_orders;', 'update report_ticket_ledger set quantity_delta=100;']) await assert.rejects(sql(query, role), /permission denied/);
    }
    await assert.rejects(sql('update report_ticket_ledger set quantity_delta=100;', 'service_role'), /permission denied|IMMUTABLE/);
    const flags = await sql("select bool_and(relrowsecurity) from pg_class where relname in ('ticket_bundle_orders','report_ticket_grants','report_ticket_ledger','report_ticket_redemptions');"); assert.equal(flags, 't');
    assert.equal((await bundle('history', B)).orders.length, 0);
  });
  const deadlocks = Number(await sql("select deadlocks from pg_stat_database where datname=current_database();")); assert.equal(deadlocks, 0);
  const result = { kind: 'POSTGRES_REAL_CONNECTION_PASS', version: await sql('select version();'), independentBackendCount: pids.size, maxConcurrent: 10, migrations: [...files, ...memberFiles], deadlocks, queryMs: { max: Math.round(Math.max(...durations)), average: Math.round(durations.reduce((a,b)=>a+b,0)/durations.length) }, results, note: 'SQL publish snapshot is minimal by design; actual six-product writer/Book parity is tested separately. Provider calls are not executed.' };
  writeFileSync(`${output}/postgres-concurrency.json`, JSON.stringify(result, null, 2));
  process.stdout.write(JSON.stringify({ pass: results.length, independentBackends: pids.size, deadlocks }) + '\n');
} catch (e) {
  writeFileSync(`${output}/postgres-concurrency.json`, JSON.stringify({ kind: 'FAIL', results, error: String(e) }, null, 2));
  process.stderr.write(String(e) + '\n'); process.exitCode = 1;
}
