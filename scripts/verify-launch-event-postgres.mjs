// Opt-in, isolated local Docker PostgreSQL. No URL/env/Production connection.
// node scripts/verify-launch-event-postgres.mjs --isolated-local
import { spawn, spawnSync } from 'node:child_process';
import { readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { randomUUID, randomBytes } from 'node:crypto';
import assert from 'node:assert/strict';
const container = 'gyeol-launch-event-pg', database = 'launch_event_01';
assert(process.argv.includes('--isolated-local'));
const inspect = JSON.parse(spawnSync('docker', ['inspect', container], {encoding:'utf8'}).stdout)[0];
assert.equal(inspect.HostConfig.NetworkMode,'none'); assert(inspect.Config.Image.startsWith('postgres:16-alpine'));
assert(Object.hasOwn(inspect.HostConfig.Tmpfs,'/var/lib/postgresql/data')); assert.equal(inspect.HostConfig.Binds?.length??0,0);
assert.equal(Object.keys(inspect.HostConfig.PortBindings??{}).length,0);
const output='/private/tmp/gyeol-v4-launch-event-01'; mkdirSync(output,{recursive:true});
const pids=new Set(), results=[];
const q=v=>`'${String(v).replaceAll("'","''")}'`, j=v=>`${q(JSON.stringify(v))}::jsonb`;
const start='2026-10-28T15:00:00Z', end='2026-10-31T15:00:00Z';
const versions={terms:'2026-06-14.1',privacy:'2026-09-22.1'};
const hash=()=>randomBytes(32).toString('hex');
function sql(query,role='',db=database) {
  return new Promise((resolve,reject)=>{
    const p=spawn('docker',['exec','-i',container,'psql','-X','-qAt','-v','ON_ERROR_STOP=1','-U','postgres','-d',db]);
    let out='',err='';p.stdout.on('data',d=>out+=d);p.stderr.on('data',d=>err+=d);
    p.on('close',code=>code?reject(new Error(err)):resolve(out.trim()));
    p.stdin.end(`${role?`set role ${role};`:''} set statement_timeout='20s'; set lock_timeout='15s'; ${query}`);
  });
}
async function rpc(fn,action,user=null,data={},hold=false) {
  const raw=await sql(`begin; select json_build_object('pid',pg_backend_pid(),'r',${fn}(${q(action)},${user?`${q(user)}::uuid`:'null'},${j(data)})); ${hold?'select pg_sleep(0.05);':''} commit;`,'service_role');
  const v=JSON.parse(raw.split('\n').find(s=>s.startsWith('{')));pids.add(v.pid);return v.r;
}
const ticket=(...a)=>rpc('report_tickets',...a),campaign=(...a)=>rpc('growth_campaign',...a),referral=(...a)=>rpc('book_referrals',...a);
const count=async(table,where='true')=>Number(await sql(`select count(*) from ${table} where ${where};`));
async function clock(at) {await sql(`update launch_test_clock set value=${q(at)};`);}
async function user() {
  const u=randomUUID();await sql(`insert into auth.users(id,created_at) values(${q(u)},launch_test_now());
    select record_account_consent(${q(u)},${q(randomUUID())},'로컬','google','first_login',${j(Object.entries(versions).map(([consent_type,document_version])=>({consent_type,document_version,required:true,is_agreed:true})))});`);
  return u;
}
async function setupAcquisition() {
  const contextHash=hash();assert((await campaign('capture',null,{slug:'launch-local',contextHash})).ok);
  const u=await user();return {user:u,data:{contextHash,versions}};
}
async function acquire() {const a=await setupAcquisition();assert((await campaign('attribute',a.user,a.data)).ok);return a.user;}
async function reserve(u) {return ticket('redeem',u,{requestId:randomUUID(),reportId:`report_${randomUUID().replaceAll('-','')}`,inputHash:hash(),productType:'saju_mbti_full',input:{},displayName:'격리 SQL'});}
async function publish(u,r) {
  assert(r.ok);const snapshot={reportId:r.reportId,productType:'saju_mbti_full',productVersion:'v4',draft:{},evidencePacket:{}};
  assert.equal((await ticket('publish',u,{redemptionId:r.redemptionId,token:r.token,gateVersion:'paid-report-v1',snapshot})).state,'COMPLETED');
  return {reportId:r.reportId,snapshot:JSON.parse(await sql(`select snapshot_json from paid_report_snapshots where report_id=${q(r.reportId)};`))};
}
async function invite(u,p) {
  const shareToken=`gr_${randomBytes(24).toString('base64url')}`,tokenHash=hash();
  await sql(`insert into report_share_links(report_id,token) values(${q(p.reportId)},${q(shareToken)});`);
  assert((await referral('create',u,{...p,shareToken,tokenHash})).ok);return {shareToken,tokenHash};
}
async function setupReferred(i) {
  const contextHash=hash();assert((await referral('capture',null,{...i,contextHash})).ok);
  const u=await user(), c=await referral('context',u,{contextHash});assert(c.ok);
  return {user:u,data:{contextHash,versions,sourceSnapshot:c.snapshot}};
}
async function referred(i) {const b=await setupReferred(i);assert((await referral('attribute',b.user,b.data)).ok);return b.user;}
async function check(name,run) {
  await sql('truncate launch_event_policy,growth_campaigns,report_ticket_grants,referral_invites,campaign_attributions,new_user_acquisitions cascade;');
  await clock(start);
  await sql(`insert into growth_campaigns(public_slug,name,message,status,starts_at,ends_at,offer_type,ticket_quantity) values('launch-local','ISOLATED ONLY','로컬 검수','SCHEDULED',${q(start)},${q(end)},'REPORT_TICKET',1);
    insert into launch_event_policy(id,campaign_id,total_limit,campaign_limit,referral_limit,inviter_limit,approved_at) select 'launch-20261029',id,100,100,100,100,launch_test_now()-interval '1 day' from growth_campaigns;`);
  await run();results.push({name,pass:true});process.stdout.write(`PASS ${name}\n`);
}
try {
  await sql(`create database ${database};`,'','postgres'); // Refuses an existing DB; no destructive reset.
  await sql('create role anon;create role authenticated;create role service_role bypassrls;');
  const migrations=readdirSync('supabase/migrations');
  const files=migrations.filter(n=>/^\d{4}_.*\.sql$/.test(n)).sort().map(n=>`supabase/migrations/${n}`);
  files.push('supabase/migrations/20260920163924_production_reliability_reconcile.sql',...['paid_report_quarantine_recovery_patch','paid_payment_confirm_recovery_queue_patch','paid_report_publish_expiry_patch','paid_report_external_call_guard_patch','paid_checkout_consent_evidence_patch','paid_report_one_call_delivery_patch','paid_worker_expiry_cost_guard_patch'].map(n=>`scripts/${n}.sql`));
  for(const f of files)await sql(readFileSync(f,'utf8').replace(/^\uFEFF/,''));
  await sql("create schema auth;create table auth.users(id uuid primary key,created_at timestamptz default now());grant usage on schema public,auth to anon,authenticated,service_role;create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;");
  const member=['supabase/migrations/20260929113608_report_share_links.sql',...migrations.filter(n=>n.startsWith('20261003')).sort().map(n=>`supabase/migrations/${n}`),'supabase/migrations/20261010095005_v4_ticket_bundle_commerce.sql','scripts/report_ticket_publication_queue_patch.sql','supabase/migrations/20261010132645_v4_launch_event.sql'];
  for(const f of member)await sql(readFileSync(f,'utf8'));
  // Only this isolated DB receives a clock shim. Shipped SQL always uses DB clock.
  await sql(`create table launch_test_clock(value timestamptz);insert into launch_test_clock values(${q(start)});grant select on launch_test_clock to service_role;create function launch_test_now() returns timestamptz language sql volatile as $$ select value from public.launch_test_clock $$;`);
  const defs=JSON.parse(await sql("select json_agg(pg_get_functiondef(p.oid)) from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname<>'launch_test_now' and p.prokind='f';"));
  for(const def of defs)if(/clock_timestamp\(\)|\bnow\(\)/.test(def))await sql(def.replace(/(?:pg_catalog\.)?clock_timestamp\(\)|\bnow\(\)/g,'public.launch_test_now()'));
  const defaults=JSON.parse(await sql("select json_agg(c) from (select table_schema,table_name,column_name,column_default from information_schema.columns where table_schema in ('public','auth') and column_default ~ '(clock_timestamp|now)\\(\\)' and data_type='timestamp with time zone') c;"));
  for(const d of defaults)await sql(`alter table ${d.table_schema}.${d.table_name} alter column ${d.column_name} set default ${d.column_default.replace(/(?:pg_catalog\.)?clock_timestamp\(\)|\bnow\(\)/g,'public.launch_test_now()')};`);
  await check('100 concurrent callback retries / one acquisition',async()=>{
    const a=await setupAcquisition();
    for(let n=0;n<10;n++)assert((await Promise.all(Array.from({length:10},()=>campaign('attribute',a.user,a.data,true)))).every(r=>r.ok));
    assert.equal(await count('report_ticket_grants'),1);assert.equal(await count('new_user_acquisitions'),1);
  });
  await check('campaign and referral race: first committed source only',async()=>{
    const a=await acquire(),i=await invite(a,await publish(a,await reserve(a)));
    const ch=hash(),rh=hash();await campaign('capture',null,{slug:'launch-local',contextHash:ch});await referral('capture',null,{...i,contextHash:rh});
    const b=await user(),source=await referral('context',b,{contextHash:rh});
    await Promise.all([campaign('attribute',b,{contextHash:ch,versions},true),referral('attribute',b,{contextHash:rh,versions,sourceSnapshot:source.snapshot},true)]);
    assert.equal(await count('report_ticket_grants',`user_id=${q(b)}`),1);assert.equal(await count('new_user_acquisitions',`user_id=${q(b)}`),1);
  });
  await check('independent accounts compete for final TOTAL budget slot',async()=>{
    const as=await Promise.all(Array.from({length:10},()=>setupAcquisition()));await sql('update launch_event_policy set total_limit=1;');
    const rs=await Promise.all(as.map(a=>campaign('attribute',a.user,a.data,true)));
    assert.equal(rs.filter(r=>r.ok).length,1);assert.equal(await count('report_ticket_grants'),1);
  });
  await check('referral sub-budget competition + same inviter lifetime cap + capped inviter still admits friend',async()=>{
    const a=await acquire(),i=await invite(a,await publish(a,await reserve(a)));
    const bs=await Promise.all(Array.from({length:5},()=>setupReferred(i)));await sql('update launch_event_policy set referral_limit=2;');
    const rr=await Promise.all(bs.map(b=>referral('attribute',b.user,b.data,true)));assert.equal(rr.filter(r=>r.ok).length,2);
    const winners=bs.filter((_,n)=>rr[n].ok);const ps=await Promise.all(winners.map(async b=>publish(b.user,await reserve(b.user))));
    await Promise.all(ps.map(p=>referral('qualify',null,p,true)));
    assert.equal(await count('report_ticket_grants',`user_id=${q(a)} and reward_family='INVITER_REWARD'`),1);
    assert.equal(await count('report_ticket_grants',`user_id=${q(a)}`),2);
    await sql('update launch_event_policy set referral_limit=100;');const d=await referred(i);assert.equal((await ticket('summary',d)).quantity,1);
    const dp=await publish(d,await reserve(d));assert.equal((await referral('qualify',null,dp)).rewarded,false);
  });
  await check('different inviters race last inviter budget; B → C chain preserved',async()=>{
    const a=await acquire(),ai=await invite(a,await publish(a,await reserve(a))),b=await referred(ai),bp=await publish(b,await reserve(b));
    const bi=await invite(b,bp),c=await referred(bi),cp=await publish(c,await reserve(c));
    await sql('update launch_event_policy set inviter_limit=1;');
    const rs=await Promise.all([referral('qualify',null,bp,true),referral('qualify',null,cp,true)]);
    assert.equal(rs.filter(r=>r.rewarded).length,1);assert.equal(await count('report_ticket_grants',"reward_source='inviter'"),1);
  });
  await check('expiry vs redeem after lock wait / existing reservation publishes / expired reversal / paid isolation',async()=>{
    const a=await acquire(),b=await acquire(),c=await acquire();await clock('2026-10-31T14:59:58Z');
    const ar=await reserve(a),br=await reserve(b);
    // A lock-holder crosses the simulated boundary. Waiting redeem must re-read time.
    const holding=sql(`begin; select pg_advisory_xact_lock(hashtextextended(${q(c)},10));update launch_test_clock set value=${q(end)};select pg_sleep(0.5);commit;`);
    await new Promise(r=>setTimeout(r,100));const cr=reserve(c);await holding;assert.equal((await cr).code,'NO_USABLE_TICKET');
    const ap=await publish(a,ar);assert.equal((await ticket('read',a,{reportId:ap.reportId})).status,'COMPLETED');
    assert.equal(await sql(`select extract(epoch from(expires_at-published_at))/3600=2160 from paid_report_snapshots where report_id=${q(ap.reportId)};`),'t');
    assert.equal((await ticket('reverse',b,{redemptionId:br.redemptionId,token:br.token,reason:'LOCAL_FAIL'})).state,'REVERSED');
    assert.equal((await ticket('summary',b)).quantity,0);assert.equal(await count('report_ticket_ledger',"event_type='EXPIRE'"),2);
    await ticket('grant',b,{quantity:10,sourceType:'purchase',sourceRef:'test-paid',key:'test-paid',reason:'LOCAL_PURCHASE'});assert.equal((await ticket('summary',b)).quantity,10);
  });
  await check('RLS, service-only mutation, no seed approval default, grant append-only',async()=>{
    await acquire();for(const role of ['anon','authenticated'])for(const query of ["select launch_event_state();","select book_referrals('attribute',null,'{}');","select * from launch_event_policy;","select report_tickets('grant',null,'{}');"])
      await assert.rejects(sql(query,role),/permission denied/);
    await assert.rejects(sql('update report_ticket_grants set expires_at=null;','service_role'),/permission denied|IMMUTABLE/);
    await sql('update launch_event_policy set approved_at=null,total_limit=null;');assert.equal(JSON.parse(await sql('select launch_event_state();')).state,'PAUSED');
  });
  const deadlocks=Number(await sql('select deadlocks from pg_stat_database where datname=current_database();'));assert.equal(deadlocks,0);
  const report={kind:'POSTGRES_REAL_CONNECTION_PASS',version:await sql('select version();'),independentBackends:pids.size,maxConcurrent:10,deadlocks,results,note:'Clock simulation only in isolated SQL DB. Minimal publication snapshots exercise SQL ownership/expiry. Real six-product completeness is tested separately.'};
  writeFileSync(`${output}/postgres-concurrency.json`,JSON.stringify(report,null,2));process.stdout.write(JSON.stringify({pass:results.length,independentBackends:pids.size,deadlocks})+'\n');
}catch(e){writeFileSync(`${output}/postgres-concurrency.json`,JSON.stringify({kind:'FAIL',results,error:String(e)},null,2));process.stderr.write(String(e)+'\n');process.exitCode=1;}
