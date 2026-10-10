import { createHash, randomUUID } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { beforeAll, beforeEach, afterAll, describe, expect, it, vi } from "vitest";
import type { PGlite } from "@electric-sql/pglite";
import { NextRequest } from "next/server";
import { paidWorkerSql } from "../../helpers/paidWorkerSql";
import { ACCOUNT_POLICY_VERSIONS, type AccountIdentity } from "../../../src/lib/account/policy";
import type { AccountPort } from "../../../src/lib/account/handler";
import { TICKET_BUNDLES, ticketBundleCommerceEnabled, AUTOMATIC_BUNDLE_REFUND_ENABLED } from "../../../src/lib/tickets/bundleCatalog";
import { prepareBundleOrder, confirmBundleOrder, recoverBundleOrder, bundleCheckout, type BundleProvider } from "../../../src/lib/tickets/bundleService";
import { handleBundleCommerce } from "../../../src/lib/tickets/bundleHandler";
import type { BundleStore, BundleResult, BundleOrder } from "../../../src/lib/tickets/bundleTypes";
import { sqlTicketStore } from "../../../src/lib/tickets/localDatabase";
import { confirmTossBundlePayment } from "../../../src/lib/payment/tossConfirmClient";
import { getReportProductCatalog, REPORT_PRICE_KRW } from "../../../src/lib/payment/reportProductCatalog";
import { GYEOL_PRODUCTS } from "../../../src/lib/product/gyeolProducts";
import { termsPolicySections } from "../../../src/lib/legal/termsPolicy";
import { metaProduct, metaPurchase } from "../../../src/lib/analytics/events";
import { GET, POST } from "../../../src/app/api/ticket-bundles/[action]/route";
import { accountPublicEnabled } from "../../../src/lib/account/gate";
import { confirmPaidReport } from "../../../src/lib/payment/paidReportReliability";
import type { ReliabilityStore } from "../../../src/lib/payment/paidReportReliabilityStore";

const A = "11111111-1111-4111-8111-111111111111", B = "22222222-2222-4222-8222-222222222222";
let db: PGlite, store: BundleStore, direct: ReliabilityStore;
const config = { clientKey: "mock-client", successUrl: "https://gyeolreport.com/account", failUrl: "https://gyeolreport.com/account" };
const provider = vi.fn<BundleProvider>(async p => ({ ok: true, confirm: { provider: "toss", paymentKeyReceived: true, paymentKeyVerified: true, currency: "KRW", orderId: p.orderId, amount: p.amount, status: "DONE", approvedAt: new Date().toISOString() } }));
const create = async (bundleId = "PACK_5", user = A, requestId = randomUUID()) => {
  const r = await prepareBundleOrder(store, user, { bundleId, requestId }, ACCOUNT_POLICY_VERSIONS);
  expect(r.ok, JSON.stringify(r)).toBe(true); return r.order!;
};
const pay = (o: BundleOrder, user = A, s = store, key = `mock-${o.orderId}`) => confirmBundleOrder(s, user, { orderId: o.providerOrderId, paymentKey: key, amount: o.amount }, provider);
const balance = async (user = A) => (await sqlTicketStore(db).call("summary", user)).quantity;
const expireLease = () => db.exec("update ticket_bundle_orders set confirm_lease_until=now()-interval '1 second'");
const reserve = (user = A) => sqlTicketStore(db).call("redeem", user, { requestId: randomUUID(), inputHash: "a".repeat(64), productType: "saju_mbti_full", reportId: `report_${randomUUID().replaceAll("-", "")}`, input: {}, displayName: "로컬" });
function auth(user: string | null = A, consent = true): AccountPort {
  const identity: AccountIdentity | null = user ? { id: user, displayName: "검수", provider: "google" } : null;
  return { currentUser: async () => identity, read: async () => ({ profile: identity, consents: consent ? Object.entries(ACCOUNT_POLICY_VERSIONS).map(([consent_type, document_version]) => ({ consent_type: consent_type as "terms" | "privacy", document_version, is_agreed: true, required: true, recorded_at: new Date().toISOString() })) : [] }),
    start: async () => null, exchange: async () => false, logout: async () => true, consent: async () => true, authorizationOrigin: "https://example.invalid", finish: r => r };
}
function request(action: string, body?: unknown, origin = "https://gyeolreport.com") {
  return new NextRequest(`https://gyeolreport.com/api/ticket-bundles/${action}`, { method: action === "history" ? "GET" : "POST", headers: { origin, "content-type": "application/json", "x-ticket-account": createHash("sha256").update(`bundle-ui-v1:${A}`).digest("hex") }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
}
beforeAll(async () => {
  ({ db, store: direct } = await paidWorkerSql());
  await db.exec("alter role service_role bypassrls; create schema auth; create table auth.users(id uuid primary key,created_at timestamptz default now()); grant usage on schema public,auth to anon,authenticated,service_role; create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;");
  await db.exec(readFileSync("supabase/migrations/20260929113608_report_share_links.sql", "utf8"));
  for (const f of readdirSync("supabase/migrations").filter(n => n.startsWith("20261003")).sort()) await db.exec(readFileSync(`supabase/migrations/${f}`, "utf8"));
  await db.exec(readFileSync("supabase/migrations/20261010095005_v4_ticket_bundle_commerce.sql", "utf8"));
  await db.query("insert into auth.users(id) values($1),($2)", [A, B]);
  await db.exec("set role service_role");
  for (const user of [A, B]) await db.query("select record_account_consent($1,$2,'로컬','google','first_login',$3::jsonb)", [user, randomUUID(), JSON.stringify(Object.entries(ACCOUNT_POLICY_VERSIONS).map(([consent_type, document_version]) => ({ consent_type, document_version, is_agreed: true, required: true })))]);
  store = { async call(action, user, data = {}) { return (await db.query<{ r: BundleResult }>("select ticket_bundle_commerce($1,$2,$3::jsonb) r", [action, user, JSON.stringify(data)])).rows[0].r; } };
}, 30000);
beforeEach(async () => { provider.mockClear(); await db.exec("reset role; truncate ticket_bundle_orders,report_ticket_grants,payment_orders cascade; set role service_role;"); });
afterAll(async () => { await db?.close(); });

describe("member bundle commerce: real isolated SQL + mock provider", () => {
  it("catalog, all six new prices and customer/analytics display SSOT; historical Purchase stays 1290", () => {
    expect(TICKET_BUNDLES.map(b => [b.quantity, b.amount])).toEqual([[1,1490],[3,4290],[5,6890],[10,13400]]);
    expect(getReportProductCatalog()).toHaveLength(6);
    expect(GYEOL_PRODUCTS.every(p => p.priceAmount === REPORT_PRICE_KRW && p.priceKo === "1,490원")).toBe(true);
    expect(getReportProductCatalog().every(p => p.amount === 1490 && p.priceLabelKo === "1,490원")).toBe(true);
    expect(JSON.stringify(termsPolicySections)).toContain("1,490원");
    expect(metaProduct("InitiateCheckout", "annual_fortune")?.params.value).toBe(1490);
    expect(metaPurchase({ eventId: `purchase_${"a".repeat(32)}`, productType: "saju_mbti_full", value: 1290, currency: "KRW" })?.params.value).toBe(1290);
  });
  it.each(TICKET_BUNDLES)("$id verifies then grants exactly $quantity, no worker/report/campaign", async bundle => {
    const o = await create(bundle.id); expect(o).toMatchObject({ amount: bundle.amount, quantity: bundle.quantity, status: "READY" });
    expect(await store.call("grant", A, { orderId: o.orderId })).toMatchObject({ ok: false, code: "NOT_PAID" });
    expect(await pay(o)).toMatchObject({ ok: true, order: { status: "GRANTED" } });
    expect(await balance()).toBe(bundle.quantity);
    const grant = (await db.query("select source_type,source_ref,quantity,expires_at,product_scope from report_ticket_grants")).rows[0];
    expect(grant).toMatchObject({ source_type: "purchase", source_ref: o.orderId, quantity: bundle.quantity, expires_at: null, product_scope: null });
    await db.exec("reset role");
    for (const table of ["payment_orders", "report_generation_jobs", "paid_report_snapshots", "coupon_redemptions", "referral_attributions", "campaign_attributions", "meta_purchase_dispatches"]) expect((await db.query(`select * from ${table}`)).rows).toHaveLength(0);
    await db.exec("set role service_role");
  });
  it("100 retries, concurrent confirms and restarted service add only one grant", async () => {
    const o = await create();
    await Promise.all(Array.from({ length: 100 }, () => pay(o)));
    expect(await pay(o)).toMatchObject({ ok: true, order: { status: "GRANTED" } });
    expect(provider).toHaveBeenCalledTimes(1); expect(await balance()).toBe(5);
    expect((await db.query("select * from report_ticket_ledger where event_type='GRANT'")).rows).toHaveLength(1);
  });
  it("request idempotency, different bundles conflict; other orders add and free cap never applies", async () => {
    const id = randomUUID(), o = await create("PACK_10", A, id);
    expect((await create("PACK_10", A, id)).orderId).toBe(o.orderId);
    expect(await prepareBundleOrder(store, A, { bundleId: "PACK_3", requestId: id }, ACCOUNT_POLICY_VERSIONS)).toMatchObject({ ok: false, code: "REQUEST_CONFLICT" });
    await sqlTicketStore(db).call("grant", A, { quantity: 2, sourceType: "promotion", sourceRef: "test-free", key: "test-free", reason: "LOCAL" });
    await pay(o); await pay(await create("PACK_3")); expect(await balance()).toBe(15);
  });
  it("amount, other owner, reused provider key and altered provider identity cannot grant", async () => {
    const o = await create();
    expect((await confirmBundleOrder(store, A, { orderId: o.providerOrderId, paymentKey: "key", amount: 1 }, provider)).ok).toBe(false);
    expect((await pay(o, B)).ok).toBe(false); expect(provider).not.toHaveBeenCalled();
    await pay(o, A, store, "shared-key"); const second = await create();
    expect(await pay(second, A, store, "shared-key")).toMatchObject({ ok: false, code: "DUPLICATE_ORDER_OR_PAYMENT" });
    const third = await create(); const wrong: BundleProvider = async p => ({ ok: true, confirm: { provider: "toss", paymentKeyReceived: true, paymentKeyVerified: true, currency: "KRW", orderId: "wrong", amount: p.amount, status: "DONE" } });
    expect(await confirmBundleOrder(store, A, { orderId: third.providerOrderId, paymentKey: "third", amount: third.amount }, wrong)).toMatchObject({ ok: false, code: "PROVIDER_MISMATCH" });
    expect(await balance()).toBe(5);
  });
  it("order ownership, price, paid receipt and state history cannot be rewritten", async () => {
    const o = await create();
    for (const change of ["amount=1", "quantity=10", `user_id='${B}'`, "status='GRANTED'"]) {
      await expect(db.query(`update ticket_bundle_orders set ${change} where id=$1`, [o.orderId])).rejects.toThrow(/BUNDLE_ORDER_(FACT_IMMUTABLE|STATE_INVALID)/);
    }
    await pay(o);
    for (const change of ["provider_payment_id='different-key'", "paid_at=null", "grant_id=null", "status='FAILED'"]) {
      await expect(db.query(`update ticket_bundle_orders set ${change} where id=$1`, [o.orderId])).rejects.toThrow(/BUNDLE_ORDER_(FACT_IMMUTABLE|STATE_INVALID)/);
    }
    expect(await balance()).toBe(5);
  });
  it("a paid bundle key cannot also fund a direct report", async () => {
    await pay(await create(), A, store, "bundle-first-key");
    await direct.call("create_order", {paymentOrderId:"direct-second",providerOrderId:"direct-second",productType:"saju_mbti_full",provider:"toss",amount:1490,inputSnapshot:{reportInputPayload:{}}});
    const confirm = vi.fn(async () => ({ok:true as const,confirm:{provider:"toss" as const,paymentKeyReceived:true as const,orderId:"direct-second",amount:1490,status:"DONE"}}));
    expect((await confirmPaidReport({orderId:"direct-second",paymentKey:"bundle-first-key",amount:1490},direct,confirm)).ok).toBe(false);
    expect(confirm).not.toHaveBeenCalled(); expect(await balance()).toBe(5);
  });
  it("approved payment + SQL grant failure retains paid fact and retries with no provider call", async () => {
    const o = await create();
    await db.exec("reset role; create function test_grant_failure() returns trigger language plpgsql as $$ begin raise exception 'SIMULATED_DISK_FAILURE'; end $$; create trigger test_grant_failure before insert on report_ticket_ledger for each row execute function test_grant_failure(); set role service_role;");
    expect(await pay(o)).toMatchObject({ ok: false, code: "PAID_PENDING_GRANT" });
    expect(await store.call("read", A, { orderId: o.orderId })).toMatchObject({ order: { status: "PAID_PENDING_GRANT" } });
    expect((await db.query("select * from report_ticket_grants")).rows).toHaveLength(0);
    await db.exec("reset role; drop trigger test_grant_failure on report_ticket_ledger; drop function test_grant_failure(); set role service_role;");
    expect(await recoverBundleOrder(store, A, o.orderId, provider)).toMatchObject({ ok: true, order: { status: "GRANTED" } });
    expect(provider).toHaveBeenCalledTimes(1); expect(await balance()).toBe(5);
  });
  it.each(["approved", "grant"])("lost %s commit acknowledgement recovers without duplicate", async action => {
    const o = await create(); let once = true;
    const flaky: BundleStore = { async call(a, u, d) { const r = await store.call(a,u,d); if (a === action && once) { once = false; throw Error("ACK_LOST"); } return r; } };
    expect((await pay(o, A, flaky)).ok).toBe(false);
    expect(await recoverBundleOrder(store, A, o.orderId, provider)).toMatchObject({ ok: true, order: { status: "GRANTED" } });
    expect(provider).toHaveBeenCalledTimes(1); expect(await balance()).toBe(5);
  });
  it("approval write fails before commit: durable key supports lookup after lease, not a new payment", async () => {
    const o = await create(); const flaky: BundleStore = { call: (a,u,d) => a === "approved" ? Promise.resolve({ ok: false }) : store.call(a,u,d) };
    expect((await pay(o,A,flaky)).ok).toBe(false); await expireLease();
    expect(await recoverBundleOrder(store,A,o.orderId,provider)).toMatchObject({ ok:true,order:{status:"GRANTED"} });
    expect(provider.mock.calls[1][1]).toBe(true); expect(await balance()).toBe(5);
  });
  it("confirmed cancellation blocks late confirm and issues no tickets", async () => {
    const o = await create(); const canceled: BundleProvider = async p => ({ ok:true,confirm:{provider:"toss",paymentKeyReceived:true,paymentKeyVerified:true,currency:"KRW",orderId:p.orderId,amount:p.amount,status:"CANCELED"} });
    expect(await confirmBundleOrder(store,A,{orderId:o.providerOrderId,paymentKey:"cancel-key",amount:o.amount},canceled)).toMatchObject({ok:false,code:"PAYMENT_TERMINAL"});
    expect((await pay(o,A,store,"cancel-key")).ok).toBe(false); expect(await balance()).toBe(0);
  });
  it("refund review traces the original lot, holds concurrent use, never auto allocates partial money", async () => {
    const o=await create(); await pay(o); const use=await reserve();
    const hold=await store.call("refund_hold",A,{orderId:o.orderId,requestId:randomUUID()});
    expect(hold).toMatchObject({ok:true,remaining:4,running:1,consumed:0,order:{status:"REFUND_PENDING"}});
    await expect(reserve()).rejects.toThrow("TICKET_LOT_REFUND_HOLD");
    expect(await sqlTicketStore(db).call("reverse",A,{redemptionId:use.redemptionId,token:use.token,reason:"TEST"})).toMatchObject({ok:true,state:"REVERSED"});
    expect(await store.call("refund_review",A,{orderId:o.orderId})).toMatchObject({remaining:5,running:0});
    expect((await pay(o)).ok).toBe(false); expect(AUTOMATIC_BUNDLE_REFUND_ENABLED).toBe(false);
    expect(await store.call("refund_finalize",A,{orderId:o.orderId})).toMatchObject({ok:false,code:"UNKNOWN_ACTION"});
  });
  it("FEFO unchanged, exact original lot reversal; paid and free share one ledger", async () => {
    await pay(await create("SINGLE_1"));
    const free=await sqlTicketStore(db).call("grant",A,{quantity:1,sourceType:"promotion",sourceRef:"free",key:"free",reason:"TEST",expiresAt:new Date(Date.now()+60000).toISOString()});
    const r=await reserve();expect((await db.query<{grant_id:string}>("select grant_id from report_ticket_redemptions where id=$1",[r.redemptionId])).rows[0].grant_id).toBe(free.grantId);
    await sqlTicketStore(db).call("reverse",A,{redemptionId:r.redemptionId,token:r.token,reason:"TEST"});expect(await balance()).toBe(2);
  });
  it("history is owner-only; RLS/execute/write deny clients, protected ledger immutable", async () => {
    await pay(await create()); expect((await store.call("history",B)).orders).toEqual([]);
    for(const role of ["anon","authenticated"]) {
      await db.exec(`reset role;set role ${role}`);
      await expect(db.exec("select * from ticket_bundle_orders")).rejects.toThrow(/permission denied/);
      await expect(store.call("history",A)).rejects.toThrow(/permission denied/);
      await expect(db.exec("insert into report_ticket_grants(user_id,quantity) values(null,10000)")).rejects.toThrow(/permission denied/);
    }
    await db.exec("reset role;set role service_role");
    await expect(db.exec("delete from ticket_bundle_orders")).rejects.toThrow(/permission denied/);
  });
  it("legacy 1290 and new 1490 direct approvals keep original amounts and worker boundary", async () => {
    for(const amount of [1290,1490]) {
      const id=`direct-${amount}`;
      expect(await direct.call("create_order",{paymentOrderId:id,providerOrderId:id,productType:"saju_mbti_full",provider:"toss",amount,inputSnapshot:{reportInputPayload:{}}})).toMatchObject({ok:true});
      const result=await confirmPaidReport({orderId:id,paymentKey:`direct-key-${amount}`,amount},direct,async p=>({ok:true,confirm:{provider:"toss",paymentKeyReceived:true,orderId:p.orderId,amount:p.amount,status:"DONE"}}));
      expect(result).toMatchObject({ok:true,reportId:expect.any(String)});
    }
    expect((await db.query<{amount:number}>("select amount from payment_orders order by amount")).rows.map(r=>r.amount)).toEqual([1290,1490]);
    await db.exec("reset role");
    expect((await db.query("select * from report_generation_jobs")).rows).toHaveLength(2);
    await db.exec("set role service_role");
    expect(await balance()).toBe(0);
    const o=await create();expect(await pay(o,A,store,"direct-key-1490")).toMatchObject({ok:false,code:"DUPLICATE_ORDER_OR_PAYMENT"});
  });
  it.each([1290,1490])("direct payment recovery accepts the unchanged %s snapshot after the narrow SQL price patch",async amount=>{
    const id=`recovery-${amount}`;
    expect(await direct.call("create_order",{paymentOrderId:id,providerOrderId:id,productType:"saju_mbti_full",provider:"toss",amount,inputSnapshot:{reportInputPayload:{}}})).toMatchObject({ok:true});
    expect((await direct.call("confirm_claim",{orderId:id,paymentKey:`recover-key-${amount}`,amount})).ok).toBe(true);
    await db.query("update payment_orders set recovery_next_retry_at=now()-interval '1 second',confirm_lease_until=now()-interval '1 second' where payment_order_id=$1",[id]);
    expect(await direct.call("claim_payment_recovery")).toMatchObject({ok:true,order:{payment_order_id:id,amount}});
    expect(await balance()).toBe(0);
  });
  it.each([{bundleId:"PACK_5",amount:1},{bundleId:"PACK_5",quantity:10000},{bundleId:"PACK_5",discount:1},{bundleId:"PACK_5",userId:B},{bundleId:"BAD"}])("rejects manipulated prepare %j",async bad=>{
    const response=await handleBundleCommerce(request("prepare",{requestId:randomUUID(),...bad}),"prepare",auth(),store,provider,config);
    expect(response.status).toBe(400);expect((await db.query("select * from ticket_bundle_orders")).rows).toHaveLength(0);
  });
  it("verified session, current consent, exact origin, request bounds and no key leak",async()=>{
    for(const a of [auth(null),auth(A,false)])expect((await handleBundleCommerce(request("prepare",{bundleId:"PACK_3",requestId:randomUUID()}),"prepare",a,store,provider,config)).status).toBe(401);
    expect((await handleBundleCommerce(request("prepare",{},"https://evil.invalid"),"prepare",auth(),store,provider,config)).status).toBe(403);
    expect((await handleBundleCommerce(request("prepare",{huge:"가".repeat(3000)}),"prepare",auth(),store,provider,config)).status).toBe(413);
    const r=await handleBundleCommerce(request("prepare",{bundleId:"PACK_3",requestId:randomUUID(),consent:{version:"test-only",product:true,digitalDelivery:true,purchasePolicy:true}}),"prepare",auth(),store,provider,config,{purchasePolicyVersion:"test-only"});
    const body=await r.json();expect(body.tossCheckoutRequest.requestPayment.amount).toEqual({currency:"KRW",value:4290});
    const paid=await handleBundleCommerce(request("confirm",{orderId:body.order.providerOrderId,paymentKey:"secret-payment",amount:4290}),"confirm",auth(),store,provider,config);
    expect(paid.status).toBe(200);expect(await paid.text()).not.toMatch(/secret-payment|confirm_token|paymentKey|user_id/);
  });
  it("closed routes create no dependencies and never switch public gates",async()=>{
    const context={params:Promise.resolve({action:"prepare"})};
    expect((await GET(request("history"),context)).status).toBe(404);expect((await POST(request("prepare",{}),context)).status).toBe(404);expect(ticketBundleCommerceEnabled()).toBe(false);expect(accountPublicEnabled()).toBe(false);
  });
  it("Toss request uses server order and rejects unsafe redirects",async()=>{
    const o=await create();expect(bundleCheckout(o,config,"회원")?.requestPayment.orderName).toBe("결리포트 이용권 5장");
    expect(bundleCheckout(o,{...config,successUrl:"javascript:alert(1)"},"회원")).toBeNull();
  });
  it("recovery only confirms the same IN_PROGRESS identity and never retries a lookup failure",async()=>{
    const input={orderId:"bundle-recovery",paymentKey:"same-key",amount:1490,secretKey:"test-only"};
    const body={orderId:input.orderId,paymentKey:input.paymentKey,totalAmount:1490,currency:"KRW",status:"IN_PROGRESS"};
    const calls: RequestInit[]=[];
    const fetchImpl=vi.fn(async (_url:string,init:RequestInit)=>{calls.push(init);return {ok:true,status:200,json:async()=>({...body,status:init.method==="POST"?"DONE":"IN_PROGRESS"})};});
    expect((await confirmTossBundlePayment({...input,fetchImpl},true)).ok).toBe(true);
    expect(calls.map(c=>c.method)).toEqual(["GET","POST"]);
    expect(JSON.parse(calls[1].body as string)).toEqual({orderId:input.orderId,paymentKey:input.paymentKey,amount:1490});
    expect(calls[1].headers).toMatchObject({"Idempotency-Key":"confirm-bundle-recovery"});
    const unavailable=vi.fn(async()=>({ok:false,status:503,json:async()=>({})}));
    expect((await confirmTossBundlePayment({...input,fetchImpl:unavailable},true)).ok).toBe(false);
    expect(unavailable).toHaveBeenCalledTimes(1);
  });
  it("strict provider body requires paymentKey/currency/order/total; recovery GET reuses verified DONE",async()=>{
    const input={orderId:"bundle-order",paymentKey:"provider-key",amount:4290,secretKey:"test-only"};
    const valid={orderId:input.orderId,paymentKey:input.paymentKey,totalAmount:4290,currency:"KRW",status:"DONE",approvedAt:new Date().toISOString()};
    for(const change of [{paymentKey:"wrong"},{orderId:"wrong"},{currency:"USD"},{totalAmount:1},{currency:undefined}]) {
      expect((await confirmTossBundlePayment({...input,fetchImpl:async()=>({ok:true,status:200,json:async()=>({...valid,...change})})})).ok).toBe(false);
    }
    const fetchImpl=vi.fn(async()=>({ok:true,status:200,json:async()=>valid}));
    expect(await confirmTossBundlePayment({...input,fetchImpl},true)).toMatchObject({ok:true,confirm:{paymentKeyVerified:true,currency:"KRW"}});
    expect(fetchImpl).toHaveBeenCalledTimes(1);expect(fetchImpl.mock.calls[0]).toEqual([expect.stringContaining("/payments/provider-key"),expect.objectContaining({method:"GET"})]);
  });
});
