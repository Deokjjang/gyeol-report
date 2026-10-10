import { randomUUID } from "node:crypto";
import { beforeAll, afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { ticketPublicationSql, ticketAuth, TICKET_A as A, TICKET_B as B } from "../../helpers/ticketPublicationSql";
import { prepareBundleOrder, recoverBundleOrder, type BundleOrderLookup, type BundleProvider } from "../../../src/lib/tickets/bundleService";
import { lookupTossBundleOrder } from "../../../src/lib/payment/tossConfirmClient";
import { ACCOUNT_POLICY_VERSIONS } from "../../../src/lib/account/policy";
import type { BundleStore, BundleResult, BundleOrder } from "../../../src/lib/tickets/bundleTypes";
import { handleBundleCommerce } from "../../../src/lib/tickets/bundleHandler";
import { NextRequest } from "next/server";

let local: Awaited<ReturnType<typeof ticketPublicationSql>>, store: BundleStore;
const provider = vi.fn<BundleProvider>();
const lookup = vi.fn<BundleOrderLookup>();
const create = async () => (await prepareBundleOrder(store, A, { bundleId: "PACK_5", requestId: randomUUID() }, ACCOUNT_POLICY_VERSIONS)).order!;
const fact = (o: BundleOrder, status = "DONE") => ({ ok: true as const, paymentKey: `mock-${o.orderId}`, confirm: { provider: "toss" as const, paymentKeyReceived: true as const, paymentKeyVerified: true as const, currency: "KRW" as const, orderId: o.providerOrderId, amount: o.amount, status, approvedAt: "2026-10-10T00:00:00Z" } });
beforeAll(async () => {
  local = await ticketPublicationSql();
  store = { async call(a,u,d={}) { return (await local.db.query<{r:BundleResult}>("select ticket_bundle_commerce($1,$2,$3::jsonb) r", [a,u,JSON.stringify(d)])).rows[0].r; } };
});
beforeEach(async () => { provider.mockReset(); lookup.mockReset(); await local.db.exec("reset role; truncate ticket_bundle_orders,report_ticket_grants,payment_orders cascade; set role service_role;"); });
afterAll(async () => local.db.close());
describe("COMMERCE-04A callback/key lost recovery", () => {
  it("owned READY + verified DONE enters existing claim/approved/grant once, no confirm", async () => {
    const o = await create(); lookup.mockResolvedValue(fact(o));
    const rs = await Promise.all(Array.from({length:10}, () => recoverBundleOrder(store,A,o.orderId,provider,lookup)));
    expect(rs.some(r=>r.order?.status==="GRANTED")).toBe(true);
    expect((await recoverBundleOrder(store,A,o.orderId,provider,lookup)).order?.status).toBe("GRANTED");
    expect(provider).not.toHaveBeenCalled(); expect((await local.tickets.call("summary",A)).quantity).toBe(5);
    expect((await local.db.query("select * from report_ticket_ledger where event_type='GRANT'")).rows).toHaveLength(1);
  });
  it.each(["READY","IN_PROGRESS","UNKNOWN"])("%s is uncertain, not a new approval or FAILED", async status => {
    const o = await create(); lookup.mockResolvedValue(fact(o,status));
    expect(await recoverBundleOrder(store,A,o.orderId,provider,lookup)).toMatchObject({code:"UNKNOWN_PAYMENT_STATE",order:{status:"READY"}});
    expect(provider).not.toHaveBeenCalled(); expect((await local.tickets.call("summary",A)).quantity).toBe(0);
  });
  it("lookup absence/404/unavailable stays READY; foreign owner cannot even query provider", async () => {
    const o = await create(); lookup.mockResolvedValue({ok:false});
    expect((await recoverBundleOrder(store,B,o.orderId,provider,lookup)).code).toBe("ORDER_NOT_FOUND"); expect(lookup).not.toHaveBeenCalled();
    expect((await recoverBundleOrder(store,A,o.orderId,provider,lookup)).code).toBe("UNKNOWN_PAYMENT_STATE");
    lookup.mockRejectedValue(Error("offline")); expect((await recoverBundleOrder(store,A,o.orderId,provider,lookup)).ok).toBe(false);
    expect((await store.call("read",A,{orderId:o.orderId})).order?.status).toBe("READY");
  });
  it.each(["ABORTED","EXPIRED","CANCELED","PARTIAL_CANCELED"])("verified %s has correct ledger meaning", async status => {
    const o = await create(); lookup.mockResolvedValue(fact(o,status)); await recoverBundleOrder(store,A,o.orderId,provider,lookup);
    expect((await store.call("read",A,{orderId:o.orderId})).order?.status).toBe(status.includes("CANCELED")?"REFUND_PENDING":"FAILED");
    expect((await local.tickets.call("summary",A)).quantity).toBe(0); expect(provider).not.toHaveBeenCalled();
  });
  it.each(["orderId","amount","currency","paymentKeyVerified"])("mismatched %s cannot persist key or grant", async field => {
    const o=await create(), f=fact(o); lookup.mockResolvedValue({...f,confirm:{...f.confirm,[field]:field==="amount"?1:"wrong"}});
    expect((await recoverBundleOrder(store,A,o.orderId,provider,lookup)).code).toBe("PROVIDER_MISMATCH");
    expect((await store.call("read",A,{orderId:o.orderId})).order?.status).toBe("READY");
  });
  it("HTTP recovery scrubs key/token even when callback never existed", async () => {
    const o=await create(); lookup.mockResolvedValue(fact(o));
    const req=new NextRequest("https://gyeolreport.com/api/ticket-bundles/recover",{method:"POST",headers:{origin:"https://gyeolreport.com","content-type":"application/json"},body:JSON.stringify({orderId:o.orderId})});
    const r=await handleBundleCommerce(req,"recover",ticketAuth(),store,provider,{clientKey:"mock",successUrl:"https://gyeolreport.com",failUrl:"https://gyeolreport.com"},{lookup});
    expect(r.status).toBe(200); expect(await r.text()).not.toMatch(/paymentKey|mock-bundle|token|user_id/); expect(r.headers.get("Cache-Control")).toContain("no-store");
  });
});
describe("official Toss orderId GET adapter, fetch mocked only", () => {
  const input={orderId:`bundle_toss_${"a".repeat(32)}`,amount:6890,secretKey:"mock-server-only"};
  const body={orderId:input.orderId,totalAmount:6890,currency:"KRW",paymentKey:"mock-key",status:"DONE",approvedAt:"2026-10-10T00:00:00Z"};
  it("GET uses immutable provider order ID, strict identity, no confirm",async()=>{
    const fetchImpl=vi.fn(async()=>({ok:true,status:200,json:async()=>body}));
    expect(await lookupTossBundleOrder({...input,fetchImpl})).toMatchObject({ok:true,paymentKey:"mock-key",confirm:{status:"DONE",paymentKeyVerified:true}});
    expect(fetchImpl).toHaveBeenCalledOnce(); expect(fetchImpl.mock.calls[0]).toEqual([`https://api.tosspayments.com/v1/payments/orders/${input.orderId}`,expect.objectContaining({method:"GET"})]);
  });
  it.each([{orderId:"other"},{totalAmount:1},{currency:"USD"},{paymentKey:""},{paymentKey:null}])("rejects wrong fact %j",async change=>{
    expect(await lookupTossBundleOrder({...input,fetchImpl:async()=>({ok:true,status:200,json:async()=>({...body,...change})})})).toEqual({ok:false});
  });
  it.each([404,401,500])("HTTP %s is unknown, never proof of unpaid",async status=>{
    expect(await lookupTossBundleOrder({...input,fetchImpl:async()=>({ok:false,status,json:async()=>({code:"NOT_FOUND_PAYMENT"})})})).toEqual({ok:false});
  });
});
