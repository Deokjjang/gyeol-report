// node scripts/verify-ticket-refunds-postgres.mjs --isolated-local
// Disposable PostgreSQL 16 only, no ports, volumes, network or provider calls.
import { spawn, spawnSync } from 'node:child_process';
import { readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import assert from 'node:assert/strict';
import ts from 'typescript';
assert(process.argv.includes('--isolated-local'), 'Explicit local opt-in required');
const container='gyeol-refund-04b-pg', database='refund04b';
const inspect=JSON.parse(spawnSync('docker',['inspect',container],{encoding:'utf8'}).stdout)[0];
assert.equal(inspect.HostConfig.NetworkMode,'none'); assert.equal(inspect.Config.Image,'postgres:16-alpine');
assert(Object.hasOwn(inspect.HostConfig.Tmpfs,'/var/lib/postgresql/data')); assert.equal(inspect.HostConfig.Binds?.length??0,0);
const output='/private/tmp/gyeol-v4-commerce-04b'; mkdirSync(output,{recursive:true});
const pids=new Set(),results=[];
const q=v=>`'${String(v).replaceAll("'","''")}'`, j=v=>`${q(JSON.stringify(v))}::jsonb`;
const A='11111111-1111-4111-8111-111111111111',B='22222222-2222-4222-8222-222222222222';
function sql(query,role='',db=database) { return new Promise((resolve,reject)=>{
  const p=spawn('docker',['exec','-i',container,'psql','-X','-qAt','-v','ON_ERROR_STOP=1','-U','postgres','-d',db]);let out='',err='';
  p.stdout.on('data',d=>out+=d);p.stderr.on('data',d=>err+=d);p.on('close',code=>code?reject(new Error(err)):resolve(out.trim()));
  p.stdin.end(`${role?`set role ${role};`:''}set statement_timeout='20s';set lock_timeout='15s';${query}`);
}); }
async function rpc(fn,a,u=A,d={}) { const raw=await sql(`begin;select json_build_object('pid',pg_backend_pid(),'r',${fn}(${q(a)},${u?q(u)+'::uuid':'null'},${j(d)}));commit;`,'service_role');
  const r=JSON.parse(raw.split('\n').find(l=>l.startsWith('{')));pids.add(r.pid);return r.r; }
const ticket=(...a)=>rpc('report_tickets',...a),bundle=(...a)=>rpc('ticket_bundle_commerce',...a),refund=(...a)=>rpc('ticket_bundle_refunds_rpc',...a),queue=(...a)=>rpc('report_ticket_publication',...a);
const policy={terms:'2026-06-14.1',privacy:'2026-09-22.1'};
const operatorRef='isolated-review-04b';
// Run the actual TypeScript coordinator against independent PostgreSQL connections.
// Only the Next server-only marker is omitted in this standalone local runner.
const moduleUrl=source=>'data:text/javascript;base64,'+Buffer.from(ts.transpileModule(source.replace('import "server-only";',''),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText).toString('base64');
const providerUrl=moduleUrl(readFileSync('src/lib/payment/tossRefundClient.ts','utf8'));
const {createTossRefundProvider}=await import(providerUrl);
const {processApprovedRefund}=await import(moduleUrl(readFileSync('src/lib/tickets/refundService.ts','utf8').replace('"../payment/tossRefundClient"',JSON.stringify(providerUrl))));
const refundStore={call:(action,user,data)=>refund(action,user,data)};
function isolatedProvider(o) {
  let canceled=false,postCount=0,readCount=0,losePost=false,loseRead=false;
  let cancelEntry;
  const provider=createTossRefundProvider('isolated-not-a-real-secret',async(_url,init)=>{
    if(init.method==='POST'){
      postCount++;assert(!canceled,'A second financial POST is forbidden in this recovery scenario');
      const body=JSON.parse(init.body);canceled=true;cancelEntry={transactionKey:randomUUID(),cancelAmount:body.cancelAmount,cancelReason:body.cancelReason,cancelStatus:'DONE',canceledAt:new Date().toISOString()};
      if(losePost)throw new Error('mock response lost after financial success');
    } else {readCount++;if(canceled&&loseRead){loseRead=false;throw new Error('mock reconciliation timeout');}}
    return new Response(JSON.stringify({paymentKey:`mock-${o.orderId}`,orderId:o.providerOrderId,currency:'KRW',totalAmount:o.amount,balanceAmount:o.amount-(cancelEntry?.cancelAmount??0),status:canceled?(cancelEntry.cancelAmount===o.amount?'CANCELED':'PARTIAL_CANCELED'):'DONE',method:'카드',isPartialCancelable:true,cancels:cancelEntry?[cancelEntry]:[]}),{status:200});
  });
  return {provider,counts:()=>({postCount,readCount}),loseReplies(){losePost=true;loseRead=true;}};
}
async function paid(quantity=10,amount=13400) {
  const bundleId={1:'SINGLE_1',3:'PACK_3',5:'PACK_5',10:'PACK_10'}[quantity];
  const p=await bundle('prepare',A,{bundleId,quantity,amount,currency:'KRW',requestId:randomUUID(),consent:policy});assert(p.ok);
  const o=p.order,c=await bundle('claim',A,{orderId:o.orderId,amount,paymentKey:`mock-${o.orderId}`});assert(c.token);
  assert((await bundle('approved',A,{orderId:o.orderId,token:c.token,paymentKey:`mock-${o.orderId}`,provider:'toss',providerOrderId:o.providerOrderId,amount,currency:'KRW',status:'DONE',paidAt:new Date().toISOString()})).ok);
  const g=await bundle('grant',A,{orderId:o.orderId});assert(g.ok);return g.order;
}
const input=()=>({requestId:randomUUID(),inputHash:'a'.repeat(64),reportId:`report_${randomUUID().replaceAll('-','')}`,productType:'saju_mbti_full',input:{},displayName:'격리 환불 검증',consentEvidence:{version:'checkout-consent-v1'},policyAt:new Date().toISOString()});
async function finish(reverse=false){const c=await queue('claim',null);assert(c.token);const r=await queue(reverse?'reverse':'publish',A,{redemptionId:c.redemptionId,token:c.token,gateVersion:'paid-report-v1',snapshot:{reportId:c.reportId,productType:c.productType,productVersion:'v4',draft:{},evidencePacket:{}}});assert(r.ok);return r;}
async function request(o){const d={bundleOrderId:o.orderId,requestId:randomUUID(),reasonCode:'UNUSED',operatorRef};assert((await refund('request',A,d)).ok);return d;}
async function approve(d){const r=await refund('quote',A,d);assert((await refund('approve',A,{...d,approvedAmount:r.quote.estimate,approvedQuantity:r.quote.remaining})).ok);}
async function confirm(d,i){return refund('confirm',A,{...d,token:i.token,paymentKey:i.paymentKey,providerOrderId:i.providerOrderId,currency:'KRW',totalAmount:i.originalAmount,balanceAmount:i.originalAmount-i.amount,transactionKey:randomUUID(),cancelAmount:i.amount,cancelReason:i.cancelReason,cancelStatus:'DONE',canceledAt:new Date().toISOString()});}
const count=async(event)=>Number(await sql(`select count(*) from report_ticket_ledger where event_type=${q(event)};`));
async function check(name,run){await sql('truncate ticket_bundle_orders,report_ticket_grants,payment_orders cascade;');await run();results.push(name);process.stdout.write(`PASS ${name}\n`);}
try {
  await sql(`create database ${database};`,'','postgres');await sql('create role anon;create role authenticated;create role service_role bypassrls;');
  const migrations=readdirSync('supabase/migrations');
  const base=migrations.filter(n=>/^\d{4}_.*\.sql$/.test(n)).sort().map(n=>`supabase/migrations/${n}`);
  base.push('supabase/migrations/20260920163924_production_reliability_reconcile.sql',...['paid_report_quarantine_recovery_patch','paid_payment_confirm_recovery_queue_patch','paid_report_publish_expiry_patch','paid_report_external_call_guard_patch','paid_checkout_consent_evidence_patch','paid_report_one_call_delivery_patch','paid_worker_expiry_cost_guard_patch'].map(n=>`scripts/${n}.sql`));
  for(const f of base)await sql(readFileSync(f,'utf8').replace(/^\uFEFF/,''));
  await sql("create schema auth;create table auth.users(id uuid primary key,created_at timestamptz default now());grant usage on schema public,auth to anon,authenticated,service_role;create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;");
  const member=['supabase/migrations/20260929113608_report_share_links.sql',...migrations.filter(n=>n.startsWith('20261003')).sort().map(n=>`supabase/migrations/${n}`),'supabase/migrations/20261010095005_v4_ticket_bundle_commerce.sql','scripts/report_ticket_publication_queue_patch.sql',...migrations.filter(n=>/^20261010.*(launch_event|ticket_refunds).*sql$/.test(n)).sort().map(n=>`supabase/migrations/${n}`)];
  for(const f of member)await sql(readFileSync(f,'utf8'));
  await sql(`insert into auth.users(id) values('${A}'),('${B}');`);
  for(const u of [A,B])await sql(`select record_account_consent('${u}','${randomUUID()}','격리 SQL','google','first_login',${j(Object.entries(policy).map(([consent_type,document_version])=>({consent_type,document_version,is_agreed:true,required:true})))});`,'service_role');
  await check('100 requests / 10 independent simultaneous connections / one durable hold',async()=>{
    const o=await paid(),d=await request(o),all=[];
    for(let i=0;i<10;i++)all.push(...await Promise.all(Array.from({length:10},()=>refund('request',A,d))));
    assert(all.every(r=>r.ok&&r.refund.requestId===d.requestId));
    assert.equal(await sql('select count(*) from ticket_bundle_refunds;'),'1');
    assert.equal((await refund('request',A,{...d,requestId:randomUUID()})).code,'REFUND_ALREADY_REQUESTED');
    assert.equal((await refund('quote',B,d)).code,'ORDER_NOT_FOUND');
  });
  await check('hold vs enqueue race / no FEFO bypass / pending re-quote',async()=>{
    const o=await paid(3,4290);await paid(5,6890);
    const d={bundleOrderId:o.orderId,requestId:randomUUID(),reasonCode:'UNUSED',operatorRef};
    const [held,use]=await Promise.all([refund('request',A,d),queue('enqueue',A,input())]);assert(held.ok);assert(use.ok||use.code==='REFUND_HOLD');
    assert.equal((await queue('enqueue',A,input())).code,'REFUND_HOLD');
    if(use.ok){const estimate=(await refund('quote',A,d)).quote;assert.equal(estimate.pending,1);assert(!(await refund('approve',A,{...d,approvedAmount:estimate.estimate,approvedQuantity:estimate.remaining})).ok);await finish(true);}
    assert.equal((await ticket('summary')).quantity,5);assert.equal((await ticket('summary')).heldQuantity,3);
    assert((await refund('withdraw',A,d)).ok);assert.equal((await ticket('summary')).quantity,8);
  });
  await check('PG-confirmed partial refund / concurrent settlement / Books and free lots retained',async()=>{
    const o=await paid();for(let i=0;i<2;i++){assert((await queue('enqueue',A,input())).ok);await finish();}
    assert((await ticket('grant',A,{quantity:2,sourceType:'promotion',sourceRef:'unrelated-free',key:'unrelated-free',reason:'LOCAL'})).ok);
    const d=await request(o);await approve(d);
    const claims=await Promise.all(Array.from({length:10},()=>refund('claim',A,d)));const c=claims.find(r=>r.intent);assert.equal(claims.filter(r=>r.intent).length,1);assert.equal(c.intent.amount,10720);
    assert(!(await refund('withdraw',A,d)).ok);
    assert((await confirm(d,c.intent)).ok);
    const settled=await Promise.all(Array.from({length:10},()=>refund('settle',A,d)));assert(settled.every(r=>r.ok));
    assert.equal(await count('REFUND'),1);assert.equal(await sql("select quantity_delta from report_ticket_ledger where event_type='REFUND';"),'-8');
    const completes=await Promise.all(Array.from({length:10},()=>refund('complete',A,d)));assert(completes.every(r=>r.refund.state==='COMPLETED'&&r.refund.partial));
    assert.equal((await ticket('summary')).quantity,2);assert.equal((await ticket('library')).items.length,2);
    assert.equal(await sql("select bool_and(expires_at=published_at+interval '2160 hours') from paid_report_snapshots;"),'t');
    assert.equal((await refund('request',A,{...d,requestId:randomUUID()})).code,'REFUND_ALREADY_REQUESTED');
  });
  await check('unknown financial outcome durable across connections / 15-day no blind retry',async()=>{
    const o=await paid(),d=await request(o);await approve(d);const c=await refund('claim',A,d);
    assert(!(await refund('withdraw',A,d)).ok);assert.equal(await count('REFUND'),0);assert.equal((await refund('claim',A,d)).code,'REFUND_BUSY');
    // Test-only state-time fixture: change the operator function clock, not durable facts or host clock.
    await sql(`create function public.refund_test_now() returns timestamptz language sql as $$select clock_timestamp()+interval '16 days'$$;
      do $patch$ declare b text;begin b:=pg_get_functiondef('public.ticket_bundle_refunds_rpc(text,uuid,jsonb)'::regprocedure);execute replace(b,'stamp:=clock_timestamp();','stamp:=public.refund_test_now();');end $patch$;`);
    const recovery=await refund('claim',A,d);assert.equal(recovery.intent.canPost,false);assert.equal(recovery.intent.idempotencyKey,c.intent.idempotencyKey);
    assert((await refund('attention',A,{...d,token:recovery.intent.token,code:'IDEMPOTENCY_EXPIRED'})).ok);
    assert.equal((await refund('quote',A,d)).refund.state,'MANUAL_SETTLEMENT_REQUIRED');assert.equal(await count('REFUND'),0);
    await sql(`do $patch$ declare b text;begin b:=pg_get_functiondef('public.ticket_bundle_refunds_rpc(text,uuid,jsonb)'::regprocedure);execute replace(b,'stamp:=public.refund_test_now();','stamp:=clock_timestamp();');end $patch$;`);
  });
  await check('transaction rollback / confirmed fact retained / duplicate financial reference / forged event',async()=>{
    const o=await paid(),d=await request(o);await approve(d);const c=await refund('claim',A,d);assert((await confirm(d,c.intent)).ok);
    await assert.rejects(sql(`begin;set local role service_role;select ticket_bundle_refunds_rpc('settle','${A}',${j(d)});select 1/0;commit;`),/division by zero/);
    assert.equal(await count('REFUND'),0);assert.equal((await refund('quote',A,d)).refund.state,'PG_CANCEL_CONFIRMED');
    assert((await refund('settle',A,d)).ok);assert((await refund('complete',A,d)).ok);
    const tx=await sql('select provider_cancel_ref from ticket_bundle_refunds;');
    const o2=await paid(1,1490),d2=await request(o2);await approve(d2);const c2=await refund('claim',A,d2),i=c2.intent;
    await assert.rejects(refund('confirm',A,{...d2,token:i.token,paymentKey:i.paymentKey,providerOrderId:i.providerOrderId,currency:'KRW',totalAmount:i.originalAmount,balanceAmount:0,transactionKey:tx,cancelAmount:i.amount,cancelReason:i.cancelReason,cancelStatus:'DONE',canceledAt:new Date().toISOString()}),/unique constraint/);
    assert.equal(await count('REFUND'),1);
    await assert.rejects(sql("update report_ticket_ledger set quantity_delta=100;",'service_role'),/permission denied|IMMUTABLE/);
    for(const role of ['anon','authenticated'])for(const query of ['select * from ticket_bundle_refunds;','select * from ticket_bundle_refund_audit;',`select ticket_bundle_refunds_rpc('approve','${A}',${j(d)});`])await assert.rejects(sql(query,role),/permission denied/);
  });
  await check('actual coordinator + mock Toss: lost POST and GET replies / restart / one cancellation',async()=>{
    const o=await paid(),d=await request(o);await approve(d);const p=isolatedProvider(o);p.loseReplies();
    const run=()=>processApprovedRefund(refundStore,p.provider,A,o.orderId,d.requestId,operatorRef);
    assert.equal((await run()).code,'PROVIDER_OUTCOME_UNKNOWN');assert.equal(await count('REFUND'),0);
    assert.equal((await refund('withdraw',A,d)).code,'FINANCIAL_REVIEW_PENDING');
    await sql("update ticket_bundle_refunds set claim_until=clock_timestamp()-interval '1 second';",'service_role');
    assert.equal((await run()).refund.state,'COMPLETED');assert.equal(p.counts().postCount,1);assert.equal(await count('REFUND'),1);
    assert.equal((await queue('enqueue',A,input())).code,'NO_USABLE_TICKET');
  });
  for(const failedAction of ['claim','confirm','settle','complete'])await check(`actual coordinator: database ${failedAction} failure and recovery`,async()=>{
    const o=await paid(),d=await request(o);await approve(d);const p=isolatedProvider(o);let fail=true;
    const broken={call:async(action,u,data)=>{if(action===failedAction&&fail){fail=false;throw new Error('isolated storage unavailable');}return refund(action,u,data);}};
    assert.equal((await processApprovedRefund(broken,p.provider,A,o.orderId,d.requestId,operatorRef)).ok,false);
    if(failedAction==='claim')assert.deepEqual(p.counts(),{postCount:0,readCount:0});
    await sql("update ticket_bundle_refunds set claim_until=clock_timestamp()-interval '1 second';",'service_role');
    assert.equal((await processApprovedRefund(refundStore,p.provider,A,o.orderId,d.requestId,operatorRef)).refund.state,'COMPLETED');
    assert.equal(p.counts().postCount,1);assert.equal(await count('REFUND'),1);
  });
  await check('ten simultaneous actual coordinators / one provider POST / one REFUND',async()=>{
    const o=await paid(),d=await request(o);await approve(d);const p=isolatedProvider(o);
    const replies=await Promise.all(Array.from({length:10},()=>processApprovedRefund(refundStore,p.provider,A,o.orderId,d.requestId,operatorRef)));
    assert(replies.some(r=>r.refund?.state==='COMPLETED'));assert.equal(p.counts().postCount,1);assert.equal(await count('REFUND'),1);
    assert.equal(await sql("select bool_and(actor_ref='isolated-review-04b') from ticket_bundle_refund_audit where to_state in ('APPROVED','PG_CANCEL_PENDING','PG_CANCEL_CONFIRMED','LEDGER_SETTLED','COMPLETED');"),'t');
  });
  assert.equal(await sql(`select deadlocks from pg_stat_database where datname=current_database();`),'0');
  const report={pass:results.length,results,independentBackendCount:pids.size,maxConcurrent:10,version:await sql('select version();'),deadlocks:0,provider:'actual refund coordinator + actual Toss adapter with injected local mock transport; no network',production:false};
  writeFileSync(`${output}/postgres-concurrency.json`,JSON.stringify(report,null,2));process.stdout.write(JSON.stringify(report)+'\n');
} catch(e){writeFileSync(`${output}/postgres-concurrency.json`,JSON.stringify({results,error:String(e)},null,2));process.stderr.write(String(e)+'\n');process.exitCode=1;}
