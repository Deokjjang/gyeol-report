import { readFileSync } from "node:fs";
import { randomUUID, randomBytes } from "node:crypto";
import { beforeAll, afterAll, beforeEach, describe, it, expect } from "vitest";
import type { PGlite } from "@electric-sql/pglite";
import { sqlCouponReliability } from "../../../src/lib/coupons/localDatabase";
import { confirmPaidReport } from "../../../src/lib/payment/paidReportReliability";
import { RUNTIME_FIXTURES } from "../interpretation-v4/runtimeFixtures";
import { launchSql, launchHelpers, START, END, versions } from "../../helpers/launchEventSql";
let db: PGlite, h: ReturnType<typeof launchHelpers>;
const browser = () => randomBytes(32).toString("hex");
const sql = readFileSync("supabase/migrations/20261020062611_v4_meta_registration_delivery.sql", "utf8");
async function consent(id: string | null, agreed = true, key = browser()) {
  await db.query("select record_meta_consent($1,$2,$3,'meta-20261020-v2','192.0.2.1','isolated-test')", [id, key, agreed]); return key;
}
async function acquire(optIn = true, id?: string) {
  const hash = h.hash(); await h.campaign("capture", null, { slug: "gyeol-opening-2026", contextHash: hash });
  const user = id ?? await h.user(); if (optIn) await consent(user);
  return { user, hash, result: await h.campaign("attribute", user, { contextHash: hash, versions }) };
}
const count = async () => (await db.query<{n:number}>("select count(*)::int n from meta_conversion_outbox")).rows[0].n;
const batch = async (action = "claim", event: string | null = null, lease: string | null = null) => (await db.query<{r: unknown}>("select meta_delivery_batch($1,$2,$3) r", [action,event,lease])).rows[0].r;
beforeAll(async () => { ({db,h}=await launchSql()); await db.exec(sql.replaceAll("clock_timestamp()", "public.launch_test_now()")); }, 30000);
beforeEach(async () => {
  await db.exec("truncate meta_conversion_outbox,meta_tracking_consents,launch_event_policy,growth_campaigns,report_ticket_grants,referral_invites,campaign_attributions,new_user_acquisitions cascade");
  await h.clock(START); await h.policy(); await db.exec("update growth_campaigns set public_slug='gyeol-opening-2026'");
});
afterAll(async () => { await db?.close(); });
describe("campaign-qualified Meta registration, isolated SQL only", () => {
  it("only the authenticated grant browser claims one Pixel mirror across tabs, with the CAPI event ID", async () => {
    const a=await acquire(); const row=(await db.query<{browser_key:string;event_id:string}>("select browser_key,event_id from meta_conversion_outbox")).rows[0];
    const claim=async(key:string,user:string)=>(await db.query<{r:unknown[]}>("select claim_meta_browser_events($1,$2) r",[key,user])).rows[0].r;
    expect(await claim(browser(),a.user)).toEqual([]); expect(await claim(row.browser_key,await h.user())).toEqual([]);
    const claims=await Promise.all(Array.from({length:12},()=>claim(row.browser_key,a.user)));
    expect(claims.flat()).toEqual([{event:"CompleteRegistration",eventId:row.event_id,params:{}}]);
    expect((await batch() as Array<{event_id:string}>)[0].event_id).toBe(row.event_id);
    expect(await claim(row.browser_key,a.user)).toEqual([]);
    await consent(a.user,false,row.browser_key); expect(await claim(row.browser_key,a.user)).toEqual([]);
    expect(await h.count("report_ticket_grants")).toBe(1);
  });
  it("180-day measurement cleanup removes local identifiers and receipts without touching rewards", async () => {
    await acquire(); await h.clock(new Date(new Date(START).getTime()+181*86400000).toISOString()); await batch("cleanup");
    expect(await count()).toBe(0);expect((await db.query("select * from meta_tracking_consents")).rows).toHaveLength(0);
    expect(await h.count("report_ticket_grants")).toBe(1);
  });
  it("grant and conversion commit atomically, 100 OAuth/consent retries and another browser share one opaque event", async () => {
    const a = await acquire(); expect(a.result.ok).toBe(true); expect(await count()).toBe(1);
    for (let i=0;i<100;i++) await h.campaign("attribute",a.user,{contextHash:a.hash,versions});
    await consent(a.user); await h.campaign("contexts",a.user,{});
    expect(await count()).toBe(1); expect(await h.count("report_ticket_grants")).toBe(1);
    const row = (await db.query<{event_id:string}>("select event_id from meta_conversion_outbox")).rows[0];
    expect(row.event_id).toMatch(/^registration_[a-f0-9]{32}$/); expect(row.event_id).not.toContain(a.user.replaceAll("-",""));
    const first = await batch() as Array<{event_id:string;lease:string;event_name:string}>;
    expect(first).toHaveLength(1); expect(first[0].event_name).toBe("CompleteRegistration");
    expect(JSON.stringify(first)).not.toMatch(/user_id|acquisition_id|browser_key|birth|email|mbti|source_metadata/);
    expect(await batch()).toEqual([]); // Lease prevents concurrent workers.
    expect(await batch("sent",first[0].event_id,randomUUID())).toBe(false);
    expect(await batch("retry",first[0].event_id,first[0].lease)).toBe(true);
    await db.exec("update meta_conversion_outbox set next_at=public.launch_test_now()-interval '1 second'");
    const again = await batch() as typeof first; expect(again[0].event_id).toBe(first[0].event_id);
    expect(await batch("sent",again[0].event_id,again[0].lease)).toBe(true); expect(await batch()).toEqual([]);
    expect((await db.query("select ip,agent from meta_conversion_outbox")).rows[0]).toEqual({ip:null,agent:null});
  });
  it("no opt-in or required consent, old member, click-only, referral winner never count; late opt-in does not replay",async()=>{
    const a=await acquire(false); expect(a.result.ok).toBe(true); expect(await count()).toBe(0);
    await consent(a.user); await h.campaign("attribute",a.user,{contextHash:a.hash,versions}); expect(await count()).toBe(0);
    expect((await acquire(true,await h.user(true))).result.ok).toBe(false);
    expect((await acquire(true,await h.user(false,false))).result.ok).toBe(false);
    await h.campaign("capture",null,{slug:"gyeol-opening-2026",contextHash:h.hash()}); expect(await count()).toBe(0);
    const ap=await h.publish(a.user,await h.reserve(a.user)), invitation=await h.invite(a.user,ap.reportId,ap.snapshot);
    const referred=await h.referred(invitation); await consent(referred.user);
    expect((await acquire(true,referred.user)).result.ok).toBe(false); expect(await count()).toBe(0);
  });
  it("denial cancels leased events and re-opt-in cannot recreate; original rewards stay valid",async()=>{
    const a=await acquire(); const first=await batch() as Array<{event_id:string;lease:string}>;
    await consent(a.user,false);
    expect(await batch("allowed",first[0].event_id,first[0].lease)).toBe(false);
    await consent(a.user,true); await h.campaign("attribute",a.user,{contextHash:a.hash,versions});
    expect(await batch()).toEqual([]); expect(await count()).toBe(1); expect(await h.count("report_ticket_grants")).toBe(1);
  });
  it("queue insertion failure rolls back both fact and grant",async()=>{
    await db.exec("create function fail_meta_test() returns trigger language plpgsql as $$ begin raise exception 'ISOLATED_ROLLBACK'; end $$; create trigger fail_meta before insert on meta_conversion_outbox for each row execute function fail_meta_test()");
    try { await expect(acquire()).rejects.toThrow("ISOLATED_ROLLBACK"); expect(await count()).toBe(0); expect(await h.count("report_ticket_grants")).toBe(0); } finally { await db.exec("drop trigger fail_meta on meta_conversion_outbox; drop function fail_meta_test()"); }
  });
  it("free benefit/unpaid order never Purchase; confirmed paid amount queues once and refund suppresses sending",async()=>{
    const a=await acquire(), key=await consent(a.user), paid=sqlCouponReliability(db), order=`meta-${randomUUID()}`, payload=RUNTIME_FIXTURES[0].payload;
    expect((await paid.call("create_order",{paymentOrderId:order,providerOrderId:order,productType:payload.productKey,provider:"toss",amount:1290,inputSnapshot:{reportInputPayload:payload}})).ok).toBe(true);
    let report=(await db.query<{report_id:string}>("select report_id from payment_orders where payment_order_id=$1",[order])).rows[0].report_id;
    const queue=async()=> (await db.query<{r:boolean}>("select queue_meta_purchase($1,$2,'192.0.2.1','isolated-test') r",[report,key])).rows[0].r;
    expect(await queue()).toBe(false);expect((await db.query("select * from meta_conversion_outbox where event_name='Purchase'")).rows).toHaveLength(0);
    const confirmed=await confirmPaidReport({orderId:order,paymentKey:`MOCK_${order}`,amount:1290},paid,async()=>({ok:true,confirm:{provider:"toss",paymentKeyReceived:true,orderId:order,amount:1290,status:"DONE"}}));
    expect(confirmed.ok).toBe(true); expect(typeof confirmed.reportId).toBe("string"); report=confirmed.reportId as string;expect(await queue()).toBe(true);
    await Promise.all(Array.from({length:12},()=>queue()));
    const purchases=(await db.query<{event_id:string;custom_data:object}>("select event_id,custom_data from meta_conversion_outbox where event_name='Purchase'")).rows;
    expect(purchases).toHaveLength(1);expect(purchases[0].custom_data).toMatchObject({value:1290,currency:"KRW"});
    const leases=await batch() as Array<{event_id:string;lease:string}>; const item=leases.find(e=>e.event_id===purchases[0].event_id)!;
    await db.query("update payment_orders set refunded_at=public.launch_test_now() where payment_order_id=$1",[order]);
    expect(await batch("allowed",item.event_id,item.lease)).toBe(false);
  });
  it("uncertain acknowledgement never retries beyond the 24-hour dedup safety window",async()=>{
    await acquire(); const first=await batch() as Array<{event_id:string;lease:string}>;
    await db.exec("update meta_conversion_outbox set first_attempt_at=public.launch_test_now()-interval '25 hours',lease_until=null");
    expect(await batch()).toEqual([]);expect((await db.query("select state,ip,agent from meta_conversion_outbox")).rows[0]).toEqual({state:"EXPIRED",ip:null,agent:null});
    expect(await batch("sent",first[0].event_id,first[0].lease)).toBe(false);
  });
  it("non-service roles cannot read identifiers, forge facts or use the delivery functions",async()=>{
    for (const role of ["anon","authenticated"]) for(const query of ["select * from meta_conversion_outbox","select * from meta_tracking_consents","select meta_delivery_batch('claim')","select record_meta_consent(null,'"+browser()+"',true,'meta-20261020-v2')"])
      await expect(db.transaction(async tx=>{await tx.exec(`set local role ${role}`);await tx.query(query);})).rejects.toThrow(/permission denied/);
  });
  it("event expiration and 7-day cleanup do not change event/ticket deadlines",async()=>{
    await acquire(); await db.exec("update meta_conversion_outbox set occurred_at=public.launch_test_now()-interval '8 days'");
    await batch("cleanup"); expect(await batch()).toEqual([]);
    expect((await db.query("select state,ip,agent from meta_conversion_outbox")).rows[0]).toEqual({state:"EXPIRED",ip:null,agent:null});
    expect((await db.query<{expires_at:Date}>("select expires_at from report_ticket_grants")).rows[0].expires_at.toISOString()).toBe(new Date(END).toISOString());
  });
});
