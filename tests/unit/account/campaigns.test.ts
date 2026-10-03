import { randomUUID, randomBytes } from "node:crypto";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { beforeAll, afterAll, describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import type { PGlite } from "@electric-sql/pglite";
import type { AccountPort } from "../../../src/lib/account/handler";
import { ACCOUNT_POLICY_VERSIONS } from "../../../src/lib/account/policy";
import { localCampaignDatabase, seedCampaignFixtures, sqlCampaignStore } from "../../../src/lib/growth/localReview";
import { captureCampaign, campaignCookie, campaignPresentation, settleAcquisition, reconcileCampaigns, withAcquisitionAccount, withCampaignTickets, type CampaignStore } from "../../../src/lib/growth/service";
import { CAMPAIGN_EVENTS, campaignUtm } from "../../../src/lib/growth/model";
import { sqlReferralStore } from "../../../src/lib/referrals/localReview";
import { referralHash, captureReferral, referralCookie, attachReferral, attributeReferral, reconcileReferrals, type ReferralStore } from "../../../src/lib/referrals/service";
import { sqlTicketStore } from "../../../src/lib/tickets/localDatabase";
import { redeemReportTicket } from "../../../src/lib/tickets/service";
import { sqlCouponStore, sqlCouponReliability } from "../../../src/lib/coupons/localDatabase";
import { quoteCoupon, reserveCouponOrder, confirmCouponOrder } from "../../../src/lib/coupons/service";
import { getReportProductCatalog } from "../../../src/lib/payment/reportProductCatalog";
import { createCheckoutConsentAssertion } from "../../../src/lib/payment/checkoutConsent";
import { confirmedAdultDevTossCheckoutLegalConfirmations } from "../../../src/components/payment/DevTossCheckoutLauncher";
import { storedBook, validateBookPublication } from "../../../src/lib/book/storedReport";
import { sqlBookSharePort } from "../../../src/lib/book/shareLocalReview";
import { issuePublishedReportShare } from "../../../src/lib/sharing/reportShareStore";
import { loadBookShare } from "../../../src/lib/book/shareServer";
import { runLocalBookJob } from "../../../src/lib/book/localReview";
import { RUNTIME_FIXTURES } from "../interpretation-v4/runtimeFixtures";
import { POST as publicEntry } from "../../../src/app/api/campaign-entry/route";
const origin="http://127.0.0.1:3192";
const anonymous:AccountPort={currentUser:async()=>null,start:async()=>null,exchange:async()=>false,logout:async()=>true,read:async()=>({profile:null,consents:[]}),consent:async()=>false,authorizationOrigin:origin,finish:r=>r};
const identity=(id:string)=>({id,provider:"kakao" as const,displayName:"회원"});
const auth=(id:string):AccountPort=>({...anonymous,currentUser:async()=>identity(id),read:async()=>({profile:identity(id),consents:consentRows.map(v=>({...v,consent_type:v.consent_type as "terms"|"privacy",recorded_at:new Date().toISOString()}))})});
const req=(body:unknown,cookie="",source=origin)=>new NextRequest(`${origin}/dev/campaign/entry`,{method:"POST",headers:{host:"127.0.0.1:3192",origin:source,cookie},body:JSON.stringify(body)});
let db:PGlite,c:CampaignStore,r:ReferralStore;
const products=getReportProductCatalog().filter(p=>p.isPurchasable).map(p=>({productType:p.productType,originalAmount:p.amount}));
const consentRows=Object.entries(ACCOUNT_POLICY_VERSIONS).map(([consent_type,document_version])=>({consent_type,document_version,is_agreed:true,required:true}));
async function consent(id:string){await db.query("select record_account_consent($1,$2,'회원','kakao','first_login',$3::jsonb)",[id,randomUUID(),JSON.stringify(consentRows)]);}
async function newUser(old=false,agreed=true){const id=randomUUID();await db.query("insert into auth.users(id,created_at) values($1,clock_timestamp()+($2||' seconds')::interval)",[id,old?-3600:0]);if(agreed)await consent(id);return id;}
async function capture(slug="book-ticket",utm:Record<string,string>={}){const response=await captureCampaign(req({slug,utm}),anonymous,c,true);expect(response.status).toBe(200);const secret=response.cookies.get(campaignCookie(true))?.value;expect(secret).toBeTruthy();return secret!;}
const hashes=(secret:string)=>({campaignHash:referralHash(secret)});
const settle=(id:string,secret:string)=>settleAcquisition(c,r,id,hashes(secret),true);
const balance=async(id:string)=>(await sqlTicketStore(db).call("summary",id)).quantity;
const attr=async(id:string)=>(await db.query<Record<string,unknown>>("select * from campaign_attributions where user_id=$1",[id])).rows[0];
const payload=(index:number)=>{const p=structuredClone(RUNTIME_FIXTURES[index].payload);return p.productKey==="annual_fortune"?{...p,productOptions:{selectedYear:String(new Date().getFullYear())}}:p;};
beforeAll(async()=>{db=(await localCampaignDatabase())!;await seedCampaignFixtures(db);c=sqlCampaignStore(db);r=sqlReferralStore(db);
  if(process.env.CAMPAIGN_REVIEW_EXPORT){mkdirSync(process.env.CAMPAIGN_REVIEW_EXPORT,{recursive:true});writeFileSync(`${process.env.CAMPAIGN_REVIEW_EXPORT}/fixtures.json`,JSON.stringify(RUNTIME_FIXTURES));}
},30000);
afterAll(async()=>{await db?.close();});
describe("12A actual SQL acquisition authority",()=>{
  it("server presentation and windows: active/NONE, draft, paused, ended, scheduled; public OFF",async()=>{
    expect((await campaignPresentation(c,"book-ticket"))?.active).toBe(true);
    expect((await campaignPresentation(c,"book-none"))?.offer).toBe("NONE");
    for(const slug of ["book-draft","book-paused","book-ended","book-future","unknown-campaign"]){expect((await campaignPresentation(c,slug))?.active??false).toBe(false);expect((await captureCampaign(req({slug}),anonymous,c,true)).cookies.getAll()).toHaveLength(0);}
    expect(await campaignPresentation(c,"book-draft")).toBeNull();expect((await publicEntry(req({}))).status).toBe(404);
    await db.exec("update growth_campaigns set starts_at=now()-interval '1 day' where public_slug='book-future'");expect((await campaignPresentation(c,"book-future"))?.active).toBe(true);
  });
  it("forged authority, unsafe redirect, origin, raw metadata rejected; only approved UTM survives",async()=>{
    for(const key of ["ticket","discount","coupon","reward","userId","next","eligibility"]){expect((await captureCampaign(req({slug:"book-ticket",[key]:100}),anonymous,c,true)).status).toBe(400);}
    expect((await captureCampaign(req({slug:"book-ticket"},"","https://evil.test"),anonymous,c,true)).status).toBe(403);
    const secret=await capture("book-ticket",{utm_source:"instagram",utm_campaign:"book-launch",utm_term:"user@example.com",utm_content:"19901118",fbclid:"secret",name:"홍길동",utm_medium:"unapproved"});
    const data=(await db.query<{source_metadata:unknown}>("select source_metadata from campaign_attributions where context_hash=$1",[referralHash(secret)])).rows[0].source_metadata;
    expect(data).toEqual({utm_source:"instagram",utm_campaign:"book-launch"});expect(campaignUtm({email:"x",utm_term:"hello@x.com"})).toEqual({});
    expect(JSON.stringify(await campaignPresentation(c,"book-coupon"))).not.toMatch(/couponId|user_id|source_ref|grantId/);
  });
  it("first campaign cookie survives OAuth and retry; forged/expired cookie may be replaced",async()=>{
    const secret=await capture();const second=await captureCampaign(req({slug:"book-other"},`${campaignCookie(true)}=${secret}`),anonymous,c,true);expect(second.cookies.getAll()).toHaveLength(0);expect(await second.json()).toEqual({next:"/dev/account?view=login"});
    const forged=await captureCampaign(req({slug:"book-other"},`${campaignCookie(true)}=${randomBytes(32).toString("hex")}`),anonymous,c,true);expect(forged.cookies.getAll()).toHaveLength(1);
    await db.query("update campaign_attributions set context_expires_at=now()-interval '1 second' where context_hash=$1",[referralHash(secret)]);
    expect((await settle(await newUser(),secret)).ok).toBe(false);
    expect((await captureCampaign(req({slug:"book-other"},`${campaignCookie(true)}=${secret}`),anonymous,c,true)).cookies.getAll()).toHaveLength(1);
  });
  it("verified new identity, required current consent, duplicate callback/consent grants exactly once",async()=>{
    const secret=await capture(),id=await newUser(false,false),port=withAcquisitionAccount(req({},`${campaignCookie(true)}=${secret}`),{...auth(id),consent:async()=>{await consent(id);return true;}},c,r,true);
    await Promise.all([port.read(identity(id)),port.read(identity(id))]);expect(await balance(id)).toBe(0);expect((await settle(id,secret)).ok).toBe(false);
    await Promise.all(Array.from({length:12},()=>port.consent(identity(id),randomUUID(),"first_login")));expect(await balance(id)).toBe(1);
    await Promise.all(Array.from({length:12},()=>settle(id,secret)));expect(await balance(id)).toBe(1);
    expect((await db.query("select 1 from report_ticket_ledger where user_id=$1 and event_type='GRANT'",[id])).rows).toHaveLength(1);
    expect((await attr(id)).status).toBe("BENEFIT_GRANTED");
  });
  it("existing account/prior ticket/coupon/ownership cannot claim; member navigation never captures",async()=>{
    const s=await capture(),old=await newUser(true);expect((await settle(old,s)).ok).toBe(false);
    expect((await captureCampaign(req({slug:"book-ticket"}),auth(old),c,true)).cookies.getAll()).toHaveLength(0);
    const t=await capture(),id=await newUser();await sqlTicketStore(db).call("grant",id,{quantity:1,sourceType:"manual",sourceRef:id,key:id,reason:"TEST"});expect((await settle(id,t)).ok).toBe(false);
  });
  it("two campaigns racing/multiple tabs, immutable source and one family only",async()=>{
    const a=await capture(),b=await capture("book-other"),id=await newUser();
    await Promise.all([settle(id,a),settle(id,b),settle(id,a),settle(id,b)]);expect(await balance(id)).toBe(1);
    const before=await attr(id);await settle(id,b);expect((await attr(id)).id).toBe(before.id);
    await expect(db.query("update new_user_acquisitions set user_id=user_id where user_id=$1",[id])).rejects.toThrow(/IMMUTABLE/);
  });
  it("NONE creates attribution with no benefit; single primary offer DB constraint",async()=>{
    const s=await capture("book-none"),id=await newUser();expect((await settle(id,s)).ok).toBe(true);expect(await balance(id)).toBe(0);expect((await attr(id)).status).toBe("ATTRIBUTED");
    await expect(db.exec("update growth_campaigns set offer_type='COUPON' where public_slug='book-ticket'")).rejects.toThrow();
  });
  it("expiry between capture and consent denies new grant; already granted balance preserved",async()=>{
    const before=await capture("book-other"),newer=await capture("book-other"),owner=await newUser();await settle(owner,before);
    await db.exec("update growth_campaigns set ends_at=now()-interval '1 second' where public_slug='book-other'");
    expect((await settle(await newUser(),newer)).ok).toBe(false);expect(await balance(owner)).toBe(1);
    await db.exec("update growth_campaigns set ends_at=null where public_slug='book-other'");
  });
  it("coupon exactly once uses 10B quote; no tickets, valid private ownership and paid publish",async()=>{
    const s=await capture("book-coupon"),id=await newUser();await Promise.all(Array.from({length:8},()=>settle(id,s)));
    const a=await attr(id);expect(a.status).toBe("BENEFIT_GRANTED");expect(await balance(id)).toBe(0);
    expect((await db.query("select 1 from coupon_grants where user_id=$1",[id])).rows).toHaveLength(1);
    const coupons=sqlCouponStore(db),who={user:id,actor:`user:${id}`},selection={grantId:String(a.coupon_grant_id)};
    expect(await quoteCoupon(coupons,who,"saju_mbti_full",selection)).toMatchObject({ok:true,originalAmount:1290,discountAmount:300,finalAmount:990});
    expect((await quoteCoupon(coupons,{user:await newUser(),actor:"other"},"saju_mbti_full",selection)).ok).toBe(false);
    const order=await reserveCouponOrder(coupons,who,{requestId:randomUUID(),payload:payload(0),consent:createCheckoutConsentAssertion(confirmedAdultDevTossCheckoutLegalConfirmations),selection,claimHash:null});expect(order.ok).toBe(true);
    const result=await confirmCouponOrder(coupons,who,order.orderId!,"LOCAL_MOCK",async p=>({ok:true,confirm:{provider:"toss",paymentKeyReceived:true,orderId:p.orderId,amount:p.amount,status:"DONE"}}));expect(result.ok).toBe(true);
    expect((await attr(id)).first_report_id).toBeNull();await runLocalBookJob(sqlCouponReliability(db));await reconcileCampaigns(c,id);expect((await attr(id)).first_report_id).toBe(result.reportId);
  });
  it("invalid/exhausted coupon cannot leave grant or acquisition; original quote checks reused",async()=>{
    await expect(db.exec("update coupon_definitions set product_ids=ARRAY['missing_product'] where campaign_ref='LOCAL_ACQUISITION_TEST'")).rejects.toThrow();
    for(const clause of ["is_active=false","discount_value=1290","min_order_amount=2000"]){
      const s=await capture("book-coupon"),id=await newUser();await db.exec(`update coupon_definitions set ${clause} where campaign_ref='LOCAL_ACQUISITION_TEST'`);
      expect((await settle(id,s)).ok).toBe(false);expect((await db.query("select 1 from coupon_grants where user_id=$1",[id])).rows).toHaveLength(0);
      expect((await db.query("select 1 from new_user_acquisitions where user_id=$1",[id])).rows).toHaveLength(0);
      await db.exec("update coupon_definitions set is_active=true,discount_value=300,min_order_amount=0,product_ids=ARRAY[]::text[] where campaign_ref='LOCAL_ACQUISITION_TEST'");
    }
    await db.exec("update coupon_definitions set total_usage_limit=1 where campaign_ref='LOCAL_ACQUISITION_TEST'");const s=await capture("book-coupon");expect((await settle(await newUser(),s)).ok).toBe(false);await db.exec("update coupon_definitions set total_usage_limit=null where campaign_ref='LOCAL_ACQUISITION_TEST'");
  });
  it.each(RUNTIME_FIXTURES)("$id campaign ticket → unchanged six-product generation → persisted valid conversion",async f=>{
    const s=await capture(),id=await newUser();await settle(id,s);const tickets=withCampaignTickets(sqlTicketStore(db),c),index=RUNTIME_FIXTURES.indexOf(f);
    const result=await redeemReportTicket(tickets,id,randomUUID(),payload(index));expect(result.state).toBe("COMPLETED");expect((await attr(id)).first_report_id).toBe(result.reportId);
    const read=await tickets.call("read",id,{reportId:result.reportId}),book=storedBook(read.snapshot)!;expect(book).toBeTruthy();
    if(f.id==="major"){const p=book.data.pages.find(p=>p.kind==="timeline");expect(p?.kind==="timeline"&&p.years).toHaveLength(14);}
    if(f.id==="annual"){const p=book.data.pages.find(p=>p.kind==="months");expect(p?.kind==="months"&&p.months).toHaveLength(12);}
    if(f.id==="compatibility"){const p=book.data.pages.find(p=>p.kind==="pair");expect(p?.kind==="pair"&&p.directions).toHaveLength(2);}
    await Promise.all(Array.from({length:8},()=>reconcileCampaigns(c,id)));expect((await attr(id)).first_report_id).toBe(result.reportId);
  },30000);
  it("failed/incomplete/unowned publication never converts; complete snapshot recovery only",async()=>{
    const s=await capture(),id=await newUser();await settle(id,s);const t=sqlTicketStore(db);
    expect((await redeemReportTicket(withCampaignTickets(t,c),id,randomUUID(),payload(0),{generate:async()=>{throw new Error("LOCAL_TEST");}})).state).toBe("REVERSED");expect((await attr(id)).published_at).toBeNull();
    const result=await redeemReportTicket(t,id,randomUUID(),payload(0)),read=await t.call("read",id,{reportId:result.reportId});
    await db.query("update paid_report_snapshots set snapshot_json=jsonb_set(snapshot_json,'{draft}','{}') where report_id=$1",[result.reportId]);await reconcileCampaigns(c,id);expect((await attr(id)).published_at).toBeNull();
    await db.query("update paid_report_snapshots set snapshot_json=$1::jsonb where report_id=$2",[JSON.stringify(read.snapshot),result.reportId]);await db.query("update report_account_links set revoked_at=now() where report_id=$1",[result.reportId]);await reconcileCampaigns(c,id);expect((await attr(id)).published_at).toBeNull();
    await db.query("update report_account_links set revoked_at=null where report_id=$1",[result.reportId]);await reconcileCampaigns(c,id);expect((await attr(id)).first_report_id).toBe(result.reportId);
  });
  it("campaign B → ticket Book → full share → C referral plus campaign → C Book → B inviter reward",async()=>{
    const s=await capture(),b=await newUser();await settle(b,s);const t=sqlTicketStore(db),made=await redeemReportTicket(withCampaignTickets(t,c),b,randomUUID(),payload(0));
    const shares=sqlBookSharePort(db),issued=await issuePublishedReportShare(made.reportId!,validateBookPublication,shares);expect(issued.ok).toBe(true);if(!issued.ok)return;
    const shared=(await loadBookShare(new URL(issued.data.url).pathname.slice(3),shares))!;expect(shared).toBeTruthy();
    const link=await attachReferral(shared.model,made.reportId!,shared.snapshot,auth(b),r);expect(link.referral).toBeTruthy();
    const response=await captureReferral(req({shareToken:link.shareToken,ref:link.referral!.token}),anonymous,r,true),ref=response.cookies.get(referralCookie(true))!.value;
    const camp=await capture("book-coupon"),child=await newUser();await settleAcquisition(c,r,child,{...hashes(camp),referralHash:referralHash(ref)},true);
    expect(await balance(child)).toBe(1);expect(await attr(child)).toBeUndefined();expect((await db.query("select 1 from coupon_grants where user_id=$1",[child])).rows).toHaveLength(0);
    expect((await c.call("attribute",child,{contextHash:referralHash(camp),versions:ACCOUNT_POLICY_VERSIONS,products})).ok).toBe(false);
    const next=await redeemReportTicket(t,child,randomUUID(),payload(1));expect(next.state).toBe("COMPLETED");await reconcileReferrals(r);expect(await balance(b)).toBe(1);await reconcileReferrals(r);expect(await balance(b)).toBe(1);
    expect((await attr(b)).share_created_at).toBeTruthy();expect(JSON.stringify(link)).not.toMatch(/campaign:|utm_|campaign_id/);
    // Reverse precedence and a legacy direct 11B race cannot bypass the DB family.
    const first=await capture(),captureRef=await captureReferral(req({shareToken:link.shareToken,ref:link.referral!.token}),anonymous,r,true),ref2=captureRef.cookies.get(referralCookie(true))!.value,u=await newUser();
    await settleAcquisition(c,r,u,{...hashes(first),referralHash:referralHash(ref2)},true);expect((await attr(u)).status).toBe("BENEFIT_GRANTED");
    expect((await attributeReferral(r,u,referralHash(ref2))).ok).toBe(false);expect(await balance(u)).toBe(1);
    const raceCamp=await capture(),raceRef=await captureReferral(req({shareToken:link.shareToken,ref:link.referral!.token}),anonymous,r,true),raceUser=await newUser();
    await Promise.allSettled([settle(raceUser,raceCamp),attributeReferral(r,raceUser,referralHash(raceRef.cookies.get(referralCookie(true))!.value))]);expect(await balance(raceUser)).toBe(1);
  },30000);
  it("funnel read is durable/idempotent, no PII; RLS and immutable family deny direct clients",async()=>{
    const events=await c.call("funnel",null);expect(await c.call("funnel",null)).toEqual(events);expect(CAMPAIGN_EVENTS).toHaveLength(8);
    expect(JSON.stringify(events)).not.toMatch(/displayName|birthDate|snapshot|user_id|email|narrative|context_hash/);
    for(const role of ["anon","authenticated"]){await db.exec(`set role ${role}`);for(const table of ["growth_campaigns","campaign_attributions","new_user_acquisitions"]){for(const sql of [`select * from ${table}`,`update ${table} set ${table==="growth_campaigns"?"status=status":"user_id=user_id"}`,`delete from ${table}`])await expect(db.exec(sql)).rejects.toThrow(/permission denied/);}
      await expect(db.exec("select growth_campaign('attribute',null,'{}')")).rejects.toThrow(/permission denied/);await db.exec("reset role");}
    for(const f of ["src/lib/book/publicGate.ts","src/lib/account/gate.ts"])expect(readFileSync(f,"utf8")).toContain("return false;");
  });
});
