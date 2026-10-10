import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { PGlite } from "@electric-sql/pglite";
import { launchSql, launchHelpers, START, END, versions } from "../../helpers/launchEventSql";
import { randomUUID } from "node:crypto";
import { RUNTIME_FIXTURES } from "../interpretation-v4/runtimeFixtures";
import { redeemReportTicket } from "../../../src/lib/tickets/service";
import { sqlTicketStore } from "../../../src/lib/tickets/localDatabase";
import { storedBook } from "../../../src/lib/book/storedReport";
import { TICKET_A } from "../../helpers/ticketPublicationSql";
import { sqlReferralStore } from "../../../src/lib/referrals/localReview";
import { withReferralTickets, validReferralSnapshot } from "../../../src/lib/referrals/service";
let db: PGlite, h: ReturnType<typeof launchHelpers>;
beforeAll(async () => { ({db,h}=await launchSql()); },30000);
afterAll(async () => { await db?.close(); });
beforeEach(async () => {
  await db.exec("truncate launch_event_policy,growth_campaigns,report_ticket_grants,referral_invites,campaign_attributions,new_user_acquisitions cascade");
  await h.clock(START); await h.policy();
});
describe("operator-activated launch with fixed end (isolated SQL clock, not OS/client time)", () => {
  it.each([
    ["2026-10-10T23:59:59+09:00","SCHEDULED"], ["2026-10-11T00:00:00+09:00","ACTIVE"],
    ["2026-10-12T12:00:00+09:00","ACTIVE"], ["2026-10-29T00:00:00+09:00","ACTIVE"],
    ["2026-10-31T23:59:59+09:00","ACTIVE"], ["2026-11-01T00:00:00+09:00","ENDED"], ["2026-11-01T00:00:01+09:00","ENDED"],
  ])("%s is %s with no browser authority", async (at,state) => {
    await h.clock(at); expect((await h.state()).state).toBe(state);
    const a=await h.acquisition(); expect(a.result.ok).toBe(state==="ACTIVE");
    expect(await h.count("report_ticket_grants")).toBe(state==="ACTIVE"?1:0);
  });
  it("exact UTC/KST floor, missing approval/budget, PAUSED and end priority, immutable window",async () => {
    expect(START).toBe("2026-10-10T15:00:00Z"); expect(END).toBe("2026-10-31T15:00:00Z");
    await h.policy(null); expect((await h.state()).state).toBe("SCHEDULED"); expect((await h.acquisition()).result.ok).toBe(false);
    await db.exec("update growth_campaigns set status='PAUSED'"); await h.clock("2026-10-10T14:59:59Z"); expect((await h.state()).state).toBe("PAUSED");
    await h.clock(END); expect((await h.state()).state).toBe("ENDED");
    await expect(db.exec("update growth_campaigns set ends_at=ends_at+interval '1 day'")).rejects.toThrow(/LAUNCH_CAMPAIGN_CONTRACT/);
    await expect(db.exec("update growth_campaigns set ticket_quantity=2")).rejects.toThrow(/LAUNCH_CAMPAIGN_CONTRACT/);
    await expect(db.exec("update growth_campaigns set starts_at='2026-10-28T15:00:00Z'")).rejects.toThrow(/LAUNCH_CAMPAIGN_CONTRACT/);
  });
  it("a schedule, missing policy or future approval never activates; explicit late activation does not move end",async()=>{
    for(const status of ["DRAFT","SCHEDULED"]){
      await db.query("update growth_campaigns set status=$1",[status]);
      await h.clock("2026-10-12T12:00:00+09:00");
      expect(await h.state()).toMatchObject({state:"SCHEDULED",campaignAvailable:false,referralAvailable:false,inviterAvailable:false});
      expect((await h.acquisition()).result.ok).toBe(false);
    }
    await h.clock("2026-10-30T12:00:00+09:00"); await db.exec("update growth_campaigns set status='ACTIVE'");
    expect(await h.state()).toMatchObject({state:"ACTIVE",startsAt:START,endsAt:END});
    expect((await h.acquisition()).result.ok).toBe(true);
    await db.exec("update launch_event_policy set approved_at='2026-10-31T14:00:00Z'");
    expect((await h.state()).state).toBe("SCHEDULED"); expect((await h.acquisition()).result.ok).toBe(false);
    await db.exec("truncate launch_event_policy cascade");
    expect((await h.state()).state).toBe("SCHEDULED");
    await h.clock(END); expect((await h.state()).state).toBe("ENDED");
  });
  it("Oct 11 and Oct 30 grants expire together; Oct 29 neither resets state nor expiry",async()=>{
    const early=await h.acquisition();
    await h.clock("2026-10-28T14:59:59Z"); const before=await h.state();
    await h.clock("2026-10-28T15:00:00Z"); const after=await h.state();
    expect(before.state).toBe("ACTIVE"); expect(after.state).toBe("ACTIVE"); expect(after.startsAt).toBe(before.startsAt); expect(after.endsAt).toBe(before.endsAt);
    await h.clock("2026-10-30T12:00:00+09:00"); const late=await h.acquisition();
    expect(await h.count("report_ticket_grants",`expires_at='${END}'`)).toBe(2);
    await h.clock(END);
    for(const u of [early.user,late.user])expect((await h.reserve(u)).code).toBe("NO_USABLE_TICKET");
    expect((await h.acquisition()).result.ok).toBe(false);
  });
  it("schedule migration only moves an existing campaign floor; policy, grants and guards retained",async()=>{
    let policyBefore: unknown, guardsBefore: unknown;
    const old=await launchSql(undefined,async existing=>{
      await existing.exec(`insert into growth_campaigns(public_slug,name,message,status,starts_at,ends_at,offer_type,ticket_quantity)
        values('launch-20261029','LOCAL TEST','이벤트 안내','PAUSED','2026-10-28T15:00:00Z','${END}','REPORT_TICKET',1);
        insert into launch_event_policy(id,campaign_id) select 'launch-20261029',id from growth_campaigns where public_slug='launch-20261029';`);
      policyBefore=(await existing.query("select to_jsonb(p) v from launch_event_policy p")).rows;
      guardsBefore=(await existing.query("select proname,prosrc from pg_proc where proname in ('launch_reward_guard','report_tickets','book_referrals') order by proname")).rows;
    });
    try{
      expect((await old.db.query("select to_jsonb(p) v from launch_event_policy p")).rows).toEqual(policyBefore);
      expect((await old.db.query("select proname,replace(prosrc,'public.launch_test_now()','clock_timestamp()') prosrc from pg_proc where proname in ('launch_reward_guard','report_tickets','book_referrals') order by proname")).rows).toEqual(guardsBefore);
      expect((await old.db.query("select status,starts_at,ends_at from growth_campaigns where public_slug='launch-20261029'")).rows[0]).toEqual({status:"PAUSED",starts_at:new Date(START),ends_at:new Date(END)});
      expect(await old.h.count("report_ticket_grants")).toBe(0);
    }finally{await old.db.close();}
  },30000);
  it("100 callback retries yield one immutable acquisition/one grant; unconsented and old accounts denied",async () => {
    const a=await h.acquisition(); expect(a.result.ok).toBe(true);
    for(let i=0;i<100;i++) expect((await h.campaign("attribute",a.user,{contextHash:a.contextHash,versions})).ok).toBe(true);
    expect(await h.count("report_ticket_grants")).toBe(1); expect(await h.count("new_user_acquisitions")).toBe(1);
    expect((await h.acquisition(await h.user(true))).result.ok).toBe(false);
    expect((await h.acquisition(await h.user(false,false))).result.ok).toBe(false);
    await expect(db.exec("update new_user_acquisitions set user_id=user_id")).rejects.toThrow(/IMMUTABLE/);
  });
  it("A campaign → B referral → C referral; capped A can invite D; new links/reports do not reset cap",async () => {
    const a=await h.acquisition(), ap=await h.publish(a.user,await h.reserve(a.user)); expect(ap.result.state).toBe("COMPLETED");
    const ai=await h.invite(a.user,ap.reportId,ap.snapshot); expect(ai.result.ok).toBe(true);
    const b=await h.referred(ai); expect(b.result.ok).toBe(true);
    expect((await h.tickets("summary",a.user)).quantity).toBe(0);
    const bp=await h.publish(b.user,await h.reserve(b.user));
    expect((await h.referral("qualify",null,bp)).rewarded).toBe(true);
    const bi=await h.invite(b.user,bp.reportId,bp.snapshot), c=await h.referred(bi); expect(c.result.ok).toBe(true);
    const cp=await h.publish(c.user,await h.reserve(c.user)); expect((await h.referral("qualify",null,cp)).rewarded).toBe(true);
    const ap2=await h.publish(a.user,await h.reserve(a.user));
    const d=await h.referred(await h.invite(a.user,ap2.reportId,ap2.snapshot)); expect(d.result.ok).toBe(true);
    const dp=await h.publish(d.user,await h.reserve(d.user)); expect((await h.referral("qualify",null,dp)).rewarded).toBe(false);
    for(let i=0;i<10;i++) await h.referral("qualify",null,dp);
    for(const u of [a.user,b.user]) expect(await h.count("report_ticket_grants",`user_id='${u}' and reward_family is not null`)).toBe(2);
    expect(await h.count("report_ticket_grants",`user_id='${d.user}'`)).toBe(1);
    expect(await h.count("report_account_links")).toBe(5);
    await h.tickets("grant",a.user,{quantity:10,sourceType:"purchase",sourceRef:"test-paid-ten",key:"test-paid-ten",reason:"LOCAL_PAID"});
    expect((await h.tickets("summary",a.user)).quantity).toBe(10);
  });
  it("acquisition junction rejects campaign + referral duplication in either order; self-referral denied",async () => {
    const a=await h.acquisition(), ap=await h.publish(a.user,await h.reserve(a.user)), inv=await h.invite(a.user,ap.reportId,ap.snapshot);
    const contextHash=h.hash(); await h.referral("capture",null,{...inv,contextHash});
    expect((await h.referral("context",a.user,{contextHash})).ok).toBe(false);
    const b=await h.acquisition(); expect((await h.referral("attribute",b.user,{contextHash,versions,sourceSnapshot:ap.snapshot})).ok).toBe(false);
    const c=await h.referred(inv); expect(c.result.ok).toBe(true); expect((await h.acquisition(c.user)).result.ok).toBe(false);
    expect(await h.count("report_ticket_grants",`user_id in ('${b.user}','${c.user}')`)).toBe(2);
  });
  it("budget total and independent source caps, rollback leaves no partial acquisition",async () => {
    await h.policy(1); expect((await h.acquisition()).result.ok).toBe(true); expect((await h.acquisition()).result.ok).toBe(false);
    expect(await h.count("report_ticket_grants")).toBe(1); expect(await h.count("new_user_acquisitions")).toBe(1);
    await h.policy(10); await db.exec("update launch_event_policy set campaign_limit=1");
    expect((await h.acquisition()).result.ok).toBe(false); expect((await h.state()).referralAvailable).toBe(true);
  });
  it("all three sources share fixed expiry; last-second reservation publishes after end with 90-day access but no new inviter reward",async () => {
    const a=await h.acquisition(), ap=await h.publish(a.user,await h.reserve(a.user)), inv=await h.invite(a.user,ap.reportId,ap.snapshot);
    const b=await h.referred(inv), bp=await h.publish(b.user,await h.reserve(b.user)); await h.referral("qualify",null,bp);
    const d=await h.referred(await h.invite(b.user,bp.reportId,bp.snapshot));
    await h.clock("2026-10-31T14:59:58Z"); const pending=await h.reserve(d.user); expect(pending.ok).toBe(true);
    const cookie=h.hash(); await h.referral("capture",null,{...inv,contextHash:cookie}); const late=await h.user();
    await h.clock("2026-10-31T15:00:05Z"); const dp=await h.publish(d.user,pending); expect(dp.result.state).toBe("COMPLETED");
    expect((await h.referral("qualify",null,dp)).rewarded).toBe(false);
    expect((await h.referral("attribute",late,{contextHash:cookie,versions,sourceSnapshot:ap.snapshot})).ok).toBe(false);
    expect((await h.referral("inspect",null,inv)).rewardAvailable).toBe(false);
    expect((await h.referral("inspect",null,inv)).ok).toBe(true);
    expect((await h.tickets("read",d.user,{reportId:dp.reportId})).status).toBe("COMPLETED");
    expect((await db.query<{hours:number}>("select extract(epoch from(expires_at-published_at))/3600 hours from paid_report_snapshots where report_id=$1",[dp.reportId])).rows[0].hours).toBe("2160.0000000000000000");
    const lots=(await db.query<{end:boolean}>("select bool_and(expires_at='2026-10-31T15:00:00Z') as end from report_ticket_grants where launch_event_id is not null")).rows[0]; expect(lots.end).toBe(true);
    expect((await h.reserve(a.user)).code).toBe("NO_USABLE_TICKET"); expect((await h.tickets("summary",a.user)).quantity).toBe(0);
  });
  it("failure reversal returns to original expired lot; purchased/manual/old non-event lots unaffected",async () => {
    const a=await h.acquisition(), pending=await h.reserve(a.user);
    await h.clock(END); expect((await h.tickets("reverse",a.user,{redemptionId:pending.redemptionId,token:pending.token,reason:"LOCAL_FAIL"})).state).toBe("REVERSED");
    expect((await h.tickets("summary",a.user)).quantity).toBe(0);
    expect(await h.count("report_ticket_ledger","event_type='REVERSAL'")).toBe(1); expect(await h.count("report_ticket_ledger","event_type='EXPIRE'")).toBe(1);
    for(const sourceType of ["purchase","manual","promotion"]) await h.tickets("grant",a.user,{quantity:10,sourceType,sourceRef:`non-event-${sourceType}`,key:`non-event-${sourceType}`,reason:"NON_EVENT"});
    expect((await h.tickets("summary",a.user)).quantity).toBe(30); expect((await h.reserve(a.user)).ok).toBe(true);
    expect(await h.count("report_ticket_grants","expires_at is null and launch_event_id is null")).toBe(3);
  });
  it("forged publication, unowned report, direct invented reward and client fields cannot grant",async () => {
    const a=await h.acquisition(), r=await h.reserve(a.user);
    expect((await h.referral("qualify",null,{reportId:r.reportId,snapshot:{}})).ok).toBe(false);
    await expect(h.tickets("grant",a.user,{quantity:1,sourceType:"referral",sourceRef:"inviter:fake",key:"fake",reason:"FAKE",expiresAt:"2099-01-01"})).rejects.toThrow(/EVIDENCE_REQUIRED/);
    expect(await h.count("report_ticket_grants")).toBe(1);
    await h.clock(END); expect((await h.campaign("capture",null,{slug:"launch-20261029",contextHash:h.hash(),serverNow:START})).ok).toBe(false);
  });
  it("existing grants unchanged byte-for-byte (apart from null additive columns); historic inviter reward still consumes lifetime cap",async()=>{
    let original: unknown;
    const old=await launchSql(async existing=>{
      const store=sqlTicketStore(existing);
      for(const [sourceType,sourceRef] of [["purchase","legacy-purchase"],["manual","legacy-compensation"],["referral","inviter:legacy"]])
        await store.call("grant",TICKET_A,{quantity:1,sourceType,sourceRef,key:sourceRef,reason:"PRE_EVENT"});
      original=(await existing.query("select to_jsonb(g) v from report_ticket_grants g order by id")).rows;
    });
    try {
      expect((await old.db.query("select to_jsonb(g)-'launch_event_id'-'reward_family'-'reward_source' v from report_ticket_grants g order by id")).rows).toEqual(original);
      await old.h.policy();const pub=await old.h.publish(TICKET_A,await old.h.reserve(TICKET_A));
      const b=await old.h.referred(await old.h.invite(TICKET_A,pub.reportId,pub.snapshot));expect(b.result.ok).toBe(true);
      const bp=await old.h.publish(b.user,await old.h.reserve(b.user));expect((await old.h.referral("qualify",null,bp)).rewarded).toBe(false);
      expect(await old.h.count("report_ticket_grants",`user_id='${TICKET_A}'`)).toBe(3);
      await old.h.clock(END);expect((await old.h.tickets("summary",TICKET_A)).quantity).toBe(2);
    } finally { await old.db.close(); }
  },30000);
  it("RLS/service-only, no client clock overrides, no mutation of grant/ledger history",async () => {
    await h.acquisition();
    for(const role of ["anon","authenticated"]) {
      await db.exec(`set role ${role}`);
      for(const sql of ["select launch_event_state()", "select * from launch_event_policy", "select book_referrals('qualify',null,'{}')", "select report_tickets('grant',null,'{}')"])
        await expect(db.exec(sql)).rejects.toThrow(/permission denied/);
      await db.exec("reset role");
    }
    await expect(db.exec("update report_ticket_grants set expires_at=now()+interval '1 year'")).rejects.toThrow(/IMMUTABLE/);
    await expect(db.exec("delete from report_ticket_ledger")).rejects.toThrow(/IMMUTABLE/);
    expect((await db.query<{b:boolean}>("select relrowsecurity b from pg_class where relname='launch_event_policy'")).rows[0].b).toBe(true);
  });
  it.each(RUNTIME_FIXTURES)("$id event grant → real writer/completeness → stored Book, original product structure",async f=>{
    const a=await h.acquisition(), store=sqlTicketStore(db), raw=structuredClone(f.payload);
    const payload=raw.productKey==="annual_fortune"?{...raw,productOptions:{...raw.productOptions,selectedYear:String(new Date().getFullYear())}}:raw;
    const result=await redeemReportTicket(store,a.user,randomUUID(),payload);expect(result.state).toBe("COMPLETED");
    const book=storedBook((await store.call("read",a.user,{reportId:result.reportId})).snapshot)!;expect(book).toBeTruthy();
    if(f.id==="major"){const p=book.data.pages.find(p=>p.kind==="timeline");expect(p?.kind==="timeline"&&p.years).toHaveLength(14);}
    if(f.id==="annual"){const p=book.data.pages.find(p=>p.kind==="months");expect(p?.kind==="months"&&p.months).toHaveLength(12);}
    if(f.id==="compatibility"){const p=book.data.pages.find(p=>p.kind==="pair");expect(p?.kind==="pair"&&p.directions).toHaveLength(2);}
    expect((await h.tickets("summary",a.user)).quantity).toBe(0);
  },30000);
  it("actual complete free Books drive A → B → C rewards through service reconciliation, not fabricated publish events",async()=>{
    const store=withReferralTickets(sqlTicketStore(db),sqlReferralStore(db));
    const full=async (user:string,index:number)=>{
      const result=await redeemReportTicket(store,user,randomUUID(),RUNTIME_FIXTURES[index].payload);
      expect(result.state).toBe("COMPLETED");
      const snapshot=(await store.call("read",user,{reportId:result.reportId})).snapshot;
      expect(validReferralSnapshot(snapshot)).toBe(true);
      return {reportId:result.reportId,snapshot};
    };
    const a=await h.acquisition(),ap=await full(a.user,0),ai=await h.invite(a.user,ap.reportId,ap.snapshot);
    const b=await h.referred(ai);expect(b.result.ok).toBe(true);
    const bp=await full(b.user,1);expect((await store.call("summary",a.user)).quantity).toBe(1);
    const c=await h.referred(await h.invite(b.user,bp.reportId,bp.snapshot));expect(c.result.ok).toBe(true);
    await full(c.user,2);expect((await store.call("summary",b.user)).quantity).toBe(1);
    const d=await h.referred(ai);expect(d.result.ok).toBe(true);
    expect(await h.count("referral_attributions","status='INVITER_REWARD_GRANTED'")).toBe(2);
    for(const user of [a.user,b.user])expect(await h.count("report_ticket_grants",`user_id='${user}'`)).toBe(2);
  },60000);
});
