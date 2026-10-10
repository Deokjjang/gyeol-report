import { randomUUID, randomBytes } from "node:crypto";
import assert from "node:assert/strict";
import { beforeAll, afterAll, describe, it, expect } from "vitest";
import type { PGlite } from "@electric-sql/pglite";
import { localMeasurementDatabase, sqlMeasurementStore } from "../../../src/lib/analytics/localReview";
import { measurementFacts, claimPurchase, type MeasurementPort } from "../../../src/lib/analytics/server";
import { metaPurchase, metaProduct, validInteraction, funnelCounts } from "../../../src/lib/analytics/events";
import { campaignView } from "../../../src/lib/growth/presentation";
import { campaignRemaining, campaignCountdown, campaignOffer } from "../../../src/lib/growth/model";
import { localCampaignDatabase, seedCampaignFixtures, sqlCampaignStore } from "../../../src/lib/growth/localReview";
import { settleAcquisition, reconcileCampaigns, type CampaignStore } from "../../../src/lib/growth/service";
import { sqlReferralStore } from "../../../src/lib/referrals/localReview";
import { ACCOUNT_POLICY_VERSIONS } from "../../../src/lib/account/policy";
import { sqlTicketStore } from "../../../src/lib/tickets/localDatabase";
import { redeemReportTicket } from "../../../src/lib/tickets/service";
import { createCheckoutConsentAssertion } from "../../../src/lib/payment/checkoutConsent";
import { confirmedAdultDevTossCheckoutLegalConfirmations } from "../../../src/components/payment/DevTossCheckoutLauncher";
import { reserveCouponOrder, confirmCouponOrder } from "../../../src/lib/coupons/service";
import { sqlCouponStore, sqlCouponReliability } from "../../../src/lib/coupons/localDatabase";
import { runLocalBookJob } from "../../../src/lib/book/localReview";
import { confirmPaidReport } from "../../../src/lib/payment/paidReportReliability";
import { RUNTIME_FIXTURES } from "../interpretation-v4/runtimeFixtures";
let db: PGlite, port: MeasurementPort, campaigns: CampaignStore, legacyReport: string;
async function user() {
  const id = randomUUID(); await db.query("insert into auth.users(id) values($1)", [id]);
  const records = Object.entries(ACCOUNT_POLICY_VERSIONS).map(([consent_type, document_version]) => ({ consent_type, document_version, is_agreed: true, required: true }));
  await db.query("select record_account_consent($1,$2,'회원','kakao','first_login',$3::jsonb)", [id, randomUUID(), JSON.stringify(records)]); return id;
}
async function acquired(slug: string) {
  const hash = randomBytes(32).toString("hex"); expect((await campaigns.call("capture", null, { slug, contextHash: hash })).ok).toBe(true);
  const id = await user(); expect((await settleAcquisition(campaigns, sqlReferralStore(db), id, { campaignHash: hash }, true)).ok).toBe(true); return id;
}
beforeAll(async () => {
  db = (await localCampaignDatabase())!;
  const paid=sqlCouponReliability(db),order=`legacy-${randomUUID()}`,payload=RUNTIME_FIXTURES[0].payload;
  await paid.call("create_order",{paymentOrderId:order,providerOrderId:order,productType:payload.productKey,provider:"toss",amount:1290,inputSnapshot:{reportInputPayload:payload}});
  const result=await confirmPaidReport({orderId:order,paymentKey:`MOCK_${order}`,amount:1290},paid,async()=>({ok:true,confirm:{provider:"toss",paymentKeyReceived:true,orderId:order,amount:1290,status:"DONE"}}));
  assert.ok(typeof result.reportId === "string");
  legacyReport=result.reportId!;
  db = (await localMeasurementDatabase())!; await seedCampaignFixtures(db); port = sqlMeasurementStore(db); campaigns = sqlCampaignStore(db);
}, 30000);
afterAll(async () => { await db?.close(); });
describe("12B server campaign and measurement authority", () => {
  it("migration suppresses historical V3 replay without removing the paid fact", async () => {
    expect((await claimPurchase(port,legacyReport)).duplicate).toBe(true);
    expect((await measurementFacts(port,null)).some(e=>e.event==="payment_succeeded"&&e.value===1290)).toBe(true);
    // Drain this independent legacy fixture using the real worker contract.
    await runLocalBookJob(sqlCouponReliability(db));
  });
  it("all six effective states, real quantity, real coupon, existing/already granted", async () => {
    for (const [slug,state] of [["book-ticket","ACTIVE_ELIGIBLE"],["book-coupon","ACTIVE_ELIGIBLE"],["book-none","ACTIVE_ELIGIBLE"],["book-future","SCHEDULED"],["book-paused","PAUSED"],["book-ended","ENDED"]]) expect((await campaignView(port,slug,null))?.state).toBe(state);
    expect(await campaignView(port,"book-draft",null)).toBeNull();
    expect((await campaignView(port,"book-ticket",await user()))?.state).toBe("ACTIVE_INELIGIBLE");
    const id = await acquired("book-ticket"), c = (await campaignView(port,"book-ticket",id))!;
    expect(c.state).toBe("BENEFIT_ALREADY_GRANTED"); expect(c.quantity).toBe(1);
    expect(campaignOffer(c)).toContain("1장"); expect(campaignOffer((await campaignView(port,"book-coupon",null))!)).toContain("300원");
    expect(JSON.stringify(c)).not.toMatch(/context_hash|grant_id|user_id|coupon_id/);
  });
  it("server absolute deadline, refresh no reset, manual end changes, starts/ends boundary", async () => {
    await db.exec("update growth_campaigns set ends_at=clock_timestamp()+interval '60 seconds' where public_slug='book-none'");
    const first = (await campaignView(port,"book-none",null))!;
    expect(campaignRemaining(first,1000)).toBe(campaignRemaining(first,0)!-1000);
    const refreshed = (await campaignView(port,"book-none",null))!;
    expect(campaignRemaining(refreshed,0)).toBeLessThanOrEqual(campaignRemaining(first,0)!);
    expect(campaignRemaining(first,120000)).toBe(0); expect(campaignCountdown(1000)).toBe("00:00:01");
    await db.exec("update growth_campaigns set ends_at=clock_timestamp()+interval '2 minutes' where public_slug='book-none'");
    expect(campaignRemaining((await campaignView(port,"book-none",null))!,0)).toBeGreaterThan(110000);
    await db.exec("update growth_campaigns set ends_at=clock_timestamp()-interval '1 second' where public_slug='book-none'");
    expect((await campaignView(port,"book-none",null))?.state).toBe("ENDED");
    expect((await campaigns.call("capture",null,{slug:"book-none",contextHash:randomBytes(32).toString("hex")})).ok).toBe(false);
  });
  it("untrusted browser facts/PII are rejected; exact Meta allowlist and positive paid amount", () => {
    const id = `${randomUUID()}:input_started:saju_mbti_full`;
    expect(validInteraction({event:"input_started",eventId:id,productType:"saju_mbti_full"})).toBe(true);
    for (const key of ["name","email","birthDate","mbti","answers","narrative","value","ref","utm_source"]) expect(validInteraction({event:"input_started",eventId:id,[key]:"secret"})).toBe(false);
    for (const event of ["payment_succeeded","report_published","campaign_benefit_granted"]) expect(validInteraction({event,eventId:id})).toBe(false);
    expect(metaPurchase({eventId:`purchase_${"a".repeat(32)}`,productType:"saju_mbti_full",value:0,currency:"KRW"})).toBeNull();
    expect(metaProduct("ViewContent","bogus")).toBeNull();
    expect(Object.keys(metaProduct("ViewContent","saju_mbti_full")!.params).sort()).toEqual(["content_ids","content_type","currency","value"]);
    const landing = {event:"campaign_landing_opened" as const,eventId:`${randomUUID()}:campaign_landing_opened`};
    expect(funnelCounts([{...landing,campaign:"book-ticket"},{...landing,campaign:"book-coupon"},{...landing,campaign:"book-coupon"}]).campaign_landing_opened).toBe(2);
  });
  it("ticket publication in all six products is real/complete, never Purchase; stable facts", async () => {
    const id = await acquired("book-other");
    await sqlTicketStore(db).call("grant",id,{quantity:6,sourceType:"manual",sourceRef:randomUUID(),key:randomUUID(),reason:"LOCAL_TEST"});
    for (const fixture of RUNTIME_FIXTURES.slice(0,6)) {
      const original = structuredClone(fixture.payload);
      const payload = original.productKey === "annual_fortune" ? { ...original, productOptions: { selectedYear: String(new Date().getFullYear()) } } : original;
      const result = await redeemReportTicket(sqlTicketStore(db),id,randomUUID(),payload);
      expect(result.state,fixture.id+JSON.stringify(result)).toBe("COMPLETED"); expect((await claimPurchase(port,result.reportId!)).purchase).toBeUndefined();
    }
    await reconcileCampaigns(campaigns,id);
    const facts = await measurementFacts(port,id), count = funnelCounts(facts);
    expect(count.report_published).toBe(6); expect(count.ticket_redeemed).toBe(6); expect(count.payment_succeeded).toBe(0); expect(count.publishing_started).toBe(6);
    expect(count.campaign_benefit_granted).toBe(1); expect(facts).toEqual(await measurementFacts(port,id));
    expect(JSON.stringify(facts)).not.toMatch(/snapshot|birthDate|mbtiType|personA|displayName|context_hash/);
  },30000);
  it("coupon Purchase actual 1190, before generation; concurrent callbacks/refresh/tabs once", async () => {
    const id = await acquired("book-coupon");
    const grant = (await db.query<{coupon_grant_id:string}>("select coupon_grant_id from campaign_attributions where user_id=$1",[id])).rows[0].coupon_grant_id;
    const identity = {user:id,actor:`user:${id}`}, store = sqlCouponStore(db);
    const reserve = await reserveCouponOrder(store,identity,{requestId:randomUUID(),payload:RUNTIME_FIXTURES[0].payload,selection:{grantId:grant},consent:createCheckoutConsentAssertion(confirmedAdultDevTossCheckoutLegalConfirmations),claimHash:null});
    expect(reserve.ok).toBe(true);
    const paid = await confirmCouponOrder(store,identity,reserve.orderId!,`mock-${reserve.orderId}`,async p=>({ok:true,confirm:{provider:"toss",paymentKeyReceived:true,orderId:p.orderId,amount:p.amount,status:"DONE",approvedAt:new Date().toISOString()}}));
    expect(paid.ok).toBe(true);
    const facts = await measurementFacts(port,id); expect(facts.find(f=>f.event==="payment_succeeded")?.value).toBe(1190);
    expect(facts.some(f=>f.event==="report_published")).toBe(false);
    const claims = await Promise.all(Array.from({length:12},()=>claimPurchase(port,paid.reportId!)));
    const only = claims.flatMap(c=>c.purchase?[c.purchase]:[]); expect(only).toHaveLength(1); expect(only[0].value).toBe(1190);
    expect(metaPurchase(only[0])?.params.value).toBe(1190); expect(only[0].eventId).toBe(facts.find(f=>f.event==="payment_succeeded")?.eventId);
    await runLocalBookJob(sqlCouponReliability(db));
    expect((await claimPurchase(port,paid.reportId!)).duplicate).toBe(true);
    const complete = await measurementFacts(port,id); expect(funnelCounts(complete).report_published).toBe(1);
    expect(funnelCounts([...complete,...complete]).payment_succeeded).toBe(1);
  },30000);
  it("RLS / grants deny anon and authenticated; public gates remain off", async () => {
    for (const role of ["anon","authenticated"]) await expect(db.transaction(async tx => {await tx.exec(`set local role ${role}`);await tx.query("select claim_meta_purchase('report_fake')");})).rejects.toThrow(/permission denied/);
    for (const role of ["anon","authenticated"]) await expect(db.transaction(async tx => {await tx.exec(`set local role ${role}`);await tx.query("select * from meta_purchase_dispatches");})).rejects.toThrow(/permission denied/);
  });
  it("ordinary paid 1290 is authoritative before delivery; unpaid/refunded/unverified never dispatch", async () => {
    const paid = sqlCouponReliability(db), payload = RUNTIME_FIXTURES[0].payload;
    const makeOrder = async () => {
      const order = `measurement-${randomUUID()}`;
      expect((await paid.call("create_order", {paymentOrderId:order,providerOrderId:order,productType:payload.productKey,provider:"toss",amount:1290,inputSnapshot:{reportInputPayload:payload}})).ok).toBe(true);
      return order;
    };
    const order = await makeOrder();
    const report = (await db.query<{report_id:string}>("select report_id from payment_orders where payment_order_id=$1", [order])).rows[0].report_id;
    expect((await claimPurchase(port, report)).purchase).toBeUndefined();
    const confirmed = await confirmPaidReport({orderId:order,paymentKey:`MOCK_${order}`,amount:1290},paid,async()=>({ok:true,confirm:{provider:"toss",paymentKeyReceived:true,orderId:order,amount:1290,status:"DONE"}}));
    expect(confirmed.ok).toBe(true);
    assert.ok(typeof confirmed.reportId === "string");
    // Payment remains true even when delivery is not yet complete.
    const claimed = await claimPurchase(port, confirmed.reportId!);
    expect(metaPurchase(claimed.purchase!)?.params).toMatchObject({value:1290,currency:"KRW"});
    expect((await claimPurchase(port, confirmed.reportId!)).duplicate).toBe(true);
    for (const mutation of ["refunded_at=clock_timestamp()", "canceled_at=clock_timestamp()", "deleted_at=clock_timestamp()", "provider_payment_id=null"]) {
      const next = await makeOrder();
      const result = await confirmPaidReport({orderId:next,paymentKey:`MOCK_${next}`,amount:1290},paid,async()=>({ok:true,confirm:{provider:"toss",paymentKeyReceived:true,orderId:next,amount:1290,status:"DONE"}}));
      expect(result.ok).toBe(true);
      assert.ok(typeof result.reportId === "string");
      await db.query(`update payment_orders set ${mutation} where payment_order_id=$1`, [next]);
      expect((await claimPurchase(port, result.reportId!)).purchase, mutation).toBeUndefined();
    }
  });
});
