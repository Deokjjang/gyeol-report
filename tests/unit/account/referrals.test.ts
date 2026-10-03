import { randomBytes, randomUUID } from "node:crypto";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import type { PGlite } from "@electric-sql/pglite";
import { RUNTIME_FIXTURES } from "../interpretation-v4/runtimeFixtures";
import { createLocalShareFixture, sqlBookShareLibrary, sqlBookSharePort } from "../../../src/lib/book/shareLocalReview";
import { localReferralDatabase, sqlReferralStore } from "../../../src/lib/referrals/localReview";
import { claimHash } from "../../../src/lib/library/server";
import { localTicketUserId, sqlTicketStore } from "../../../src/lib/tickets/localDatabase";
import { issuePublishedReportShare } from "../../../src/lib/sharing/reportShareStore";
import { validateBookPublication, storedBook } from "../../../src/lib/book/storedReport";
import { loadBookShare } from "../../../src/lib/book/shareServer";
import { attachReferral, attributeReferral, captureReferral, referralHash, referralCookie, referralPresentation, reconcileReferrals, withReferralTickets, withReferralAccount, type ReferralStore } from "../../../src/lib/referrals/service";
import { ACCOUNT_POLICY_VERSIONS, type AccountIdentity } from "../../../src/lib/account/policy";
import type { AccountPort } from "../../../src/lib/account/handler";
import { redeemReportTicket } from "../../../src/lib/tickets/service";
import { POST as publicCapture } from "../../../src/app/api/book-referral/route";
import type { BookShareModel } from "../../../src/lib/book/shareModel";
import { bookNativeData, bookKakaoCard, bookShareMetadata } from "../../../src/lib/book/shareModel";
import { confirmPaidReport } from "../../../src/lib/payment/paidReportReliability";
import { runLocalBookJob } from "../../../src/lib/book/localReview";
import { withReferralPublication } from "../../../src/lib/referrals/service";
const origin="http://127.0.0.1:3189", A=localTicketUserId("inviter"), anonymous:AccountPort={currentUser:async()=>null,start:async()=>null,exchange:async()=>false,logout:async()=>true,read:async()=>({profile:null,consents:[]}),consent:async()=>false,authorizationOrigin:origin,finish:r=>r};
let db:PGlite, store:ReferralStore, reportId:string, model:BookShareModel, snapshot:unknown;
const request=(body:unknown,cookie="",source=origin)=>new NextRequest(`${origin}/dev/book-flow/referral`,{method:"POST",headers:{host:"127.0.0.1:3189",origin:source,cookie},body:JSON.stringify(body)});
const identity=(id:string):AccountIdentity=>({id,provider:"kakao",displayName:"회원"});
const auth=(id:string):AccountPort=>({...anonymous,currentUser:async()=>identity(id),read:async()=>({profile:identity(id),consents:Object.entries(ACCOUNT_POLICY_VERSIONS).map(([consent_type,document_version])=>({consent_type:consent_type as "terms"|"privacy",document_version,is_agreed:true,required:true,recorded_at:new Date().toISOString()}))})});
async function consent(id:string) { return db.query("select record_account_consent($1,$2,'회원','kakao','first_login',$3::jsonb)",[id,randomUUID(),JSON.stringify(Object.entries(ACCOUNT_POLICY_VERSIONS).map(([consent_type,document_version])=>({consent_type,document_version,is_agreed:true,required:true})))]); }
async function invite(owner=A) {return attachReferral(model,reportId,snapshot,auth(owner),store);}
async function context(link:BookShareModel) {
  const r=await captureReferral(request({shareToken:link.shareToken,ref:link.referral?.token}),anonymous,store,true);
  expect(r.status).toBe(200); const secret=r.cookies.get(referralCookie(true))?.value; expect(secret).toBeTruthy(); return secret!;
}
async function user(secret:string,existing=false) {
  const id=randomUUID(); await db.query("insert into auth.users(id,created_at) values($1,clock_timestamp()+($2||' seconds')::interval)",[id,existing?-3600:0]);
  await consent(id);return {id,contextHash:referralHash(secret)};
}
const attribute=(b:{id:string;contextHash:string})=>attributeReferral(store,b.id,b.contextHash);
const balance=async(id:string)=>(await sqlTicketStore(db).call("summary",id)).quantity;
beforeAll(async()=>{
  db=(await localReferralDatabase())!; store=sqlReferralStore(db);
  const f=RUNTIME_FIXTURES[0], made=await createLocalShareFixture(request({}),f.payload);
  expect(made.status).toBe(200);reportId=(await made.json()).reportId;
  const secret=made.cookies.getAll()[0].value;
  expect(await sqlBookShareLibrary(db).claim(reportId,"inviter",claimHash(secret),true)).toBe("owned");await consent(A);
  const issued=await issuePublishedReportShare(reportId,validateBookPublication,sqlBookSharePort(db));expect(issued.ok).toBe(true);
  if(!issued.ok)return;
  const shared=(await loadBookShare(new URL(issued.data.url).pathname.slice(3),sqlBookSharePort(db)))!;model=shared.model;snapshot=shared.snapshot;
  if(process.env.REFERRAL_REVIEW_EXPORT){mkdirSync(process.env.REFERRAL_REVIEW_EXPORT,{recursive:true});writeFileSync(`${process.env.REFERRAL_REVIEW_EXPORT}/fixtures.json`,JSON.stringify(RUNTIME_FIXTURES));}
},30000);
afterAll(async()=>{await db?.close();});
describe("11B actual SQL + existing ticket ledger",()=>{
  it("owner account only; opaque credentials separate; social metadata unchanged",async()=>{
    const link=await invite();expect(link.referral?.token).toMatch(/^rf_[A-Za-z0-9_-]{43}$/);expect(link.referral?.token).not.toBe(link.shareToken);
    expect((await invite(randomUUID())).referral).toBeUndefined();expect((await attachReferral(model,reportId,snapshot,anonymous,store)).referral).toBeUndefined();
    expect(bookNativeData(link).url).toBe(link.referral?.url);expect(bookKakaoCard(link).buttons[0].link.webUrl).toBe(link.referral?.url);
    expect(JSON.stringify(bookShareMetadata(link))).not.toContain("?ref=");expect(JSON.stringify(link)).not.toMatch(new RegExp(`${A}|${reportId}`));
    expect((await referralPresentation(model,link.referral!.token,auth(A),store)).referral?.mayJoin).toBe(false);
  });
  it("first context wins through OAuth cookie; no click-only grant; forgery and redirect fields rejected",async()=>{
    const link=await invite(), secret=await context(link), second=await invite();
    const repeat=await captureReferral(request({shareToken:second.shareToken,ref:second.referral!.token},`${referralCookie(true)}=${secret}`),anonymous,store,true);
    expect(repeat.cookies.getAll()).toHaveLength(0);expect((await balance(A))).toBe(0);
    for(const ref of [model.shareToken,`rf_${randomBytes(32).toString("base64url")}`]) expect((await captureReferral(request({shareToken:model.shareToken,ref}),anonymous,store,true)).cookies.getAll()).toHaveLength(0);
    expect((await captureReferral(request({shareToken:model.shareToken,ref:link.referral!.token,next:"https://evil.example"}),anonymous,store,true)).status).toBe(400);
    expect((await captureReferral(request({shareToken:model.shareToken,ref:link.referral!.token},"","https://evil.example"),anonymous,store,true)).status).toBe(403);
    expect((await publicCapture(request({}))).status).toBe(404);
  });
  it("new verified identity + current consent, callback/consent retries B+1 exactly once; no A at signup",async()=>{
    const secret=await context(await invite()), id=randomUUID();await db.query("insert into auth.users(id) values($1)",[id]);
    expect((await store.call("bind",id,{contextHash:referralHash(secret)})).ok).toBe(true);
    expect((await attribute({id,contextHash:referralHash(secret)})).ok).toBe(false);
    const original={...auth(id),consent:async()=>{await consent(id);return true;}};
    const port=withReferralAccount(request({},`${referralCookie(true)}=${secret}`),original,store,true);
    await Promise.all(Array.from({length:8},()=>port.consent(identity(id),randomUUID(),"first_login")));
    expect(await balance(id)).toBe(1);expect(await balance(A)).toBe(0);
    expect((await db.query("select 1 from referral_attributions where referred_user_id=$1",[id])).rows).toHaveLength(1);
    expect((await db.query("select 1 from report_ticket_ledger where user_id=$1 and event_type='GRANT'",[id])).rows).toHaveLength(1);
  });
  it("existing account, self, previous purchase/ownership/ticket activity cannot become new",async()=>{
    const link=await invite(), old=await user(await context(link),true);expect((await attribute(old)).ok).toBe(false);
    expect((await attribute({id:A,contextHash:referralHash(await context(link))})).ok).toBe(false);
    const b=await user(await context(link));await sqlTicketStore(db).call("grant",b.id,{quantity:1,sourceType:"manual",sourceRef:b.id,key:b.id,reason:"TEST"});expect((await attribute(b)).ok).toBe(false);
    expect((await captureReferral(request({shareToken:link.shareToken,ref:link.referral!.token}),auth(old.id),store,true)).cookies.getAll()).toHaveLength(0);
  });
  it("one B cannot switch to another invite, concurrent attribution cannot double grant",async()=>{
    const first=await context(await invite()),second=await context(await invite()),b=await user(first);
    const r=await Promise.all(Array.from({length:8},()=>attribute(b)));expect(r.every(x=>x.ok)).toBe(true);
    expect((await attribute({id:b.id,contextHash:referralHash(second)})).ok).toBe(false);expect(await balance(b.id)).toBe(1);
  });
  it("expired/revoked invite, lost ownership, revoked share and context expiry deny attribution",async()=>{
    for(const change of ["expires_at=clock_timestamp()-interval '1 second'","revoked_at=clock_timestamp()"]){
      const link=await invite(), b=await user(await context(link));await db.query(`update referral_invites set ${change} where token_hash=$1`,[referralHash(link.referral!.token)]);expect((await attribute(b)).ok).toBe(false);
    }
    const link=await invite(),b=await user(await context(link));await db.query("update report_account_links set revoked_at=now() where report_id=$1",[reportId]);expect((await attribute(b)).ok).toBe(false);await db.query("update report_account_links set revoked_at=null where report_id=$1",[reportId]);
    await db.query("update report_share_links set revoked_at=now() where report_id=$1",[reportId]);expect((await attribute(b)).ok).toBe(false);await db.query("update report_share_links set revoked_at=null where report_id=$1",[reportId]);
    await db.query("update referral_contexts set expires_at=now()-interval '1 second' where secret_hash=$1",[b.contextHash]);expect((await attribute(b)).ok).toBe(false);
  });
  it.each(RUNTIME_FIXTURES)("$id valid first ticket publication qualifies once; full completeness",async(f)=>{
    const b=await user(await context(await invite()));expect((await attribute(b)).ok).toBe(true);const before=Number(await balance(A));
    const tickets=withReferralTickets(sqlTicketStore(db),store),payload=f.payload.productKey==="annual_fortune" ? {...structuredClone(f.payload),productOptions:{selectedYear:String(new Date().getFullYear())}} : structuredClone(f.payload);
    const requestId=randomUUID();const published=await redeemReportTicket(tickets,b.id,requestId,payload);
    expect(published.state).toBe("COMPLETED");expect(await balance(b.id)).toBe(0);expect(await balance(A)).toBe(before+1);
    const read=await tickets.call("read",b.id,{reportId:published.reportId}), book=storedBook(read.snapshot)!;expect(book).toBeTruthy();
    if(f.id==="major"){const p=book.data.pages.find(p=>p.kind==="timeline");expect(p?.kind==="timeline"&&p.years).toHaveLength(14);}
    if(f.id==="annual"){const p=book.data.pages.find(p=>p.kind==="months");expect(p?.kind==="months"&&p.months).toHaveLength(12);}
    if(f.id==="compatibility"){const p=book.data.pages.find(p=>p.kind==="pair");expect(p?.kind==="pair"&&p.directions).toHaveLength(2);}
    await Promise.all(Array.from({length:8},()=>reconcileReferrals(store)));expect(await balance(A)).toBe(before+1);
    expect((await redeemReportTicket(tickets,b.id,requestId,payload)).reportId).toBe(published.reportId);expect(await balance(A)).toBe(before+1);
  },30000);
  it("failed/incomplete generation reverses B ticket and never qualifies",async()=>{
    const b=await user(await context(await invite()));await attribute(b);const before=await balance(A);
    const result=await redeemReportTicket(withReferralTickets(sqlTicketStore(db),store),b.id,randomUUID(),RUNTIME_FIXTURES[0].payload,{generate:async()=>{throw new Error("TEST_ONLY");}});
    expect(result.state).toBe("REVERSED");expect(await balance(b.id)).toBe(1);expect(await balance(A)).toBe(before);
    expect((await db.query<{status:string}>("select status from referral_attributions where referred_user_id=$1",[b.id])).rows[0].status).toBe("REFERRED_REWARD_GRANTED");
  });
  it("concurrent first-publish recovery, second book and source expiry after attribution",async()=>{
    const link=await invite(),b=await user(await context(link));await attribute(b);const before=Number(await balance(A));
    await db.query("update referral_invites set revoked_at=now(),expires_at=now()-interval '1 second' where token_hash=$1",[referralHash(link.referral!.token)]);
    const tickets=sqlTicketStore(db), result=await redeemReportTicket(tickets,b.id,randomUUID(),RUNTIME_FIXTURES[0].payload);
    expect(result.state).toBe("COMPLETED");expect(await balance(A)).toBe(before);
    // Eight observers all see a durable first publication, without a volatile job flag.
    await Promise.all(Array.from({length:8},()=>reconcileReferrals(store)));expect(await balance(A)).toBe(before+1);
    await tickets.call("grant",b.id,{quantity:1,sourceType:"manual",sourceRef:b.id,key:b.id,reason:"SECOND_BOOK_TEST"});
    expect((await redeemReportTicket(withReferralTickets(tickets,store),b.id,randomUUID(),RUNTIME_FIXTURES[1].payload)).state).toBe("COMPLETED");
    expect(await balance(A)).toBe(before+1);
  });
  it("ordinary paid publication qualifies, not checkout/start; no ticket/coupon mixing",async()=>{
    const b=await user(await context(await invite()));await attribute(b);const before=Number(await balance(A)), order=`referral-paid-${randomUUID()}`;
    const paid=withReferralPublication({call:sqlBookSharePort(db).read},store),payload=RUNTIME_FIXTURES[0].payload;
    expect((await paid.call("create_order",{paymentOrderId:order,providerOrderId:order,productType:payload.productKey,provider:"toss",amount:1290,inputSnapshot:{reportInputPayload:payload}})).ok).toBe(true);
    await db.query("select bind_report_purchase($1,$2,null,'회원',null)",[order,b.id]);
    const confirmed=await confirmPaidReport({orderId:order,paymentKey:`MOCK_${order}`,amount:1290},paid,async()=>({ok:true,confirm:{provider:"toss",paymentKeyReceived:true,orderId:order,amount:1290,status:"DONE"}}));
    expect(confirmed.ok).toBe(true);expect(await balance(A)).toBe(before);
    await runLocalBookJob(paid);expect(await balance(A)).toBe(before+1);expect(await balance(b.id)).toBe(1);
  });
  it("incomplete persisted draft or missing ownership cannot qualify; exact valid snapshot retry recovers",async()=>{
    const b=await user(await context(await invite()));await attribute(b);const before=await balance(A),tickets=sqlTicketStore(db);
    const report=await redeemReportTicket(tickets,b.id,randomUUID(),RUNTIME_FIXTURES[0].payload);
    const original=(await tickets.call("read",b.id,{reportId:report.reportId})).snapshot;
    await db.query("update paid_report_snapshots set snapshot_json=jsonb_set(snapshot_json,'{draft}','{}') where report_id=$1",[report.reportId]);
    await reconcileReferrals(store);expect(await balance(A)).toBe(before);
    await db.query("update paid_report_snapshots set snapshot_json=$1::jsonb where report_id=$2",[JSON.stringify(original),report.reportId]);
    await db.query("update report_account_links set revoked_at=now() where report_id=$1",[report.reportId]);await reconcileReferrals(store);expect(await balance(A)).toBe(before);
    await db.query("update report_account_links set revoked_at=null where report_id=$1",[report.reportId]);
    await reconcileReferrals(store);expect(await balance(A)).toBe(Number(before)+1);
  });
  it("two actual inviters competing for one new identity: one B grant and one attribution",async()=>{
    const made=await createLocalShareFixture(request({}),RUNTIME_FIXTURES[1].payload),id=(await made.json()).reportId;
    const owner=localTicketUserId("other-inviter");
    expect(await sqlBookShareLibrary(db).claim(id,"other-inviter",claimHash(made.cookies.getAll()[0].value),true)).toBe("owned");await consent(owner);
    const issued=await issuePublishedReportShare(id,validateBookPublication,sqlBookSharePort(db));expect(issued.ok).toBe(true);if(!issued.ok)return;
    const shared=(await loadBookShare(new URL(issued.data.url).pathname.slice(3),sqlBookSharePort(db)))!;
    const other=await attachReferral(shared.model,id,shared.snapshot,auth(owner),store);
    const one=await context(await invite()),two=await context(other),b=await user(one);
    const attempts=await Promise.all([attribute(b),attribute({...b,contextHash:referralHash(two)})]);
    expect(attempts.filter(x=>x.ok)).toHaveLength(1);expect(await balance(b.id)).toBe(1);
    expect((await db.query("select 1 from referral_attributions where referred_user_id=$1",[b.id])).rows).toHaveLength(1);
  });
  it("source becoming incomplete after capture cannot grant B; source changes during validation fail closed",async()=>{
    const b=await user(await context(await invite()));
    await db.query("update paid_report_snapshots set snapshot_json=jsonb_set(snapshot_json,'{draft}','{}') where report_id=$1",[reportId]);
    expect((await attribute(b)).ok).toBe(false);expect(await balance(b.id)).toBe(0);
    expect((await store.call("attribute",b.id,{contextHash:b.contextHash,versions:ACCOUNT_POLICY_VERSIONS,sourceSnapshot:snapshot})).ok).toBe(false);
    await db.query("update paid_report_snapshots set snapshot_json=$1::jsonb where report_id=$2",[JSON.stringify(snapshot),reportId]);
    expect((await attribute(b)).ok).toBe(true);expect(await balance(b.id)).toBe(1);
  });
  it("recovery skips an invalid first snapshot and qualifies the next actually complete book",async()=>{
    const b=await user(await context(await invite()));await attribute(b);const before=Number(await balance(A)),tickets=sqlTicketStore(db);
    const first=await redeemReportTicket(tickets,b.id,randomUUID(),RUNTIME_FIXTURES[0].payload);
    await db.query("update paid_report_snapshots set snapshot_json=jsonb_set(snapshot_json,'{draft}','{}') where report_id=$1",[first.reportId]);
    await tickets.call("grant",b.id,{quantity:1,sourceType:"manual",sourceRef:b.id,key:b.id,reason:"RECOVERY_TEST"});
    const second=await redeemReportTicket(tickets,b.id,randomUUID(),RUNTIME_FIXTURES[1].payload);
    await reconcileReferrals(store);expect(await balance(A)).toBe(before+1);
    expect((await db.query<{qualified_report_id:string}>("select qualified_report_id from referral_attributions where referred_user_id=$1",[b.id])).rows[0].qualified_report_id).toBe(second.reportId);
  });
  it("RLS/privileges deny clients; no new reward ledger/coupon side effects",async()=>{
    for(const role of ["anon","authenticated"]){await db.exec(`set role ${role}`);await expect(db.query("select * from referral_attributions")).rejects.toBeTruthy();await expect(db.query("select book_referrals('attribute',null,'{}')")).rejects.toBeTruthy();await db.exec("reset role");}
    const sql=readFileSync("supabase/migrations/20261003143822_v4_friend_referrals.sql","utf8");expect(sql).not.toMatch(/security definer|create table public.*ledger|coupon_definitions/i);expect(sql).toContain("public.report_tickets('grant'");
    expect((await db.query("select 1 from report_ticket_grants where source_type='referral' and quantity<>1")).rows).toHaveLength(0);
  });
});
