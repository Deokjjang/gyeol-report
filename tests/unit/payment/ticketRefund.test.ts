import { beforeAll, beforeEach, afterAll, describe, expect, it, vi } from "vitest";
import { randomUUID, createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { NextRequest } from "next/server";
import { ticketPublicationSql, ticketAuth, TICKET_A as A, TICKET_B as B } from "../../helpers/ticketPublicationSql";
import { prepareBundleOrder, confirmBundleOrder, type BundleProvider } from "../../../src/lib/tickets/bundleService";
import { ACCOUNT_POLICY_VERSIONS } from "../../../src/lib/account/policy";
import type { BundleStore, BundleResult, BundleOrder } from "../../../src/lib/tickets/bundleTypes";
import { proportionalRefund, type RefundStore, type RefundResult, type RefundIntent } from "../../../src/lib/tickets/refundContract";
import { processApprovedRefund } from "../../../src/lib/tickets/refundService";
import { createTossRefundProvider, refundPayment, type RefundProvider, type RefundPayment } from "../../../src/lib/payment/tossRefundClient";
import { handleBundleCommerce } from "../../../src/lib/tickets/bundleHandler";
import { BUNDLE_PURCHASE_POLICY_VERSION } from "../../../src/lib/tickets/shopContract";
import { AUTOMATIC_BUNDLE_REFUND_ENABLED } from "../../../src/lib/tickets/bundleCatalog";
import { safeBundleOrder } from "../../../src/lib/tickets/shopClient";

let h: Awaited<ReturnType<typeof ticketPublicationSql>>, bundles: BundleStore, refunds: RefundStore;
const operatorRef="local-reviewed-case-04b";
const providerApprove=vi.fn<BundleProvider>(async p=>({ ok:true,confirm:{ provider:"toss",paymentKeyReceived:true,paymentKeyVerified:true,currency:"KRW",orderId:p.orderId,amount:p.amount,status:"DONE",approvedAt:new Date().toISOString() } }));
beforeAll(async()=>{
  h=await ticketPublicationSql();
  await h.db.exec(`reset role; ${readFileSync("supabase/migrations/20261010143147_v4_ticket_refunds.sql","utf8")} set role service_role;`);
  bundles={ async call(a,u,d={}) { return (await h.db.query<{ r:BundleResult }>("select ticket_bundle_commerce($1,$2,$3::jsonb) r",[a,u,JSON.stringify(d)])).rows[0].r; } };
  refunds={ async call(a,u,d) { return (await h.db.query<{ r:RefundResult }>("select ticket_bundle_refunds_rpc($1,$2,$3::jsonb) r",[a,u,JSON.stringify(d)])).rows[0].r; } };
},30000);
beforeEach(async()=>{ await h.db.exec("reset role; truncate ticket_bundle_orders,report_ticket_grants,payment_orders cascade; set role service_role;"); });
afterAll(async()=>{ await h?.db.close(); });
async function paid(bundleId="PACK_10", amount?:number) {
  const o=(await prepareBundleOrder(bundles,A,{ bundleId,requestId:randomUUID() },ACCOUNT_POLICY_VERSIONS)).order!;
  if(amount) { await h.db.exec("reset role; alter table ticket_bundle_orders disable trigger ticket_bundle_order_guard;"); await h.db.query("update ticket_bundle_orders set amount=$1 where id=$2",[amount,o.orderId]); await h.db.exec("alter table ticket_bundle_orders enable trigger ticket_bundle_order_guard; set role service_role;"); o.amount=amount; }
  const r=await confirmBundleOrder(bundles,A,{ orderId:o.orderId,paymentKey:`mock-${o.orderId}`,amount:o.amount },providerApprove);
  expect(r.ok).toBe(true); return r.order!;
}
async function enqueue() { return h.queue.call("enqueue",A,{ requestId:randomUUID(),inputHash:"a".repeat(64),productType:"saju_mbti_full",reportId:`report_${randomUUID().replaceAll("-","")}`,input:{},displayName:"환불 검수",consentEvidence:{ version:"checkout-consent-v1" },policyAt:new Date().toISOString() }); }
async function finish(reverse=false) {
  const c=await h.queue.call("claim",null,{});
  expect(c.token).toBeTruthy();
  return h.queue.call(reverse ? "reverse" : "publish",A,{ redemptionId:c.redemptionId,token:c.token,gateVersion:"paid-report-v1",snapshot:{ reportId:c.reportId,productType:c.productType,productVersion:"v4",draft:{},evidencePacket:{} } });
}
async function requested(o:BundleOrder, reasonCode="UNUSED") {
  const args={ bundleOrderId:o.orderId,requestId:randomUUID(),reasonCode,operatorRef };
  expect((await refunds.call("request",A,args)).ok).toBe(true); return args;
}
async function approved(o:BundleOrder) {
  const args=await requested(o), q=(await refunds.call("quote",A,args)).quote!;
  expect((await refunds.call("approve",A,{ ...args,approvedAmount:q.estimate,approvedQuantity:q.remaining })).ok).toBe(true); return args;
}
function mockProvider() {
  let payment:RefundPayment | undefined;
  const lookup=vi.fn(async(i:RefundIntent)=>({ ok:true as const,payment:payment ?? { paymentKey:i.paymentKey,orderId:i.providerOrderId,currency:"KRW" as const,totalAmount:i.originalAmount,balanceAmount:i.originalAmount,status:"DONE",method:"카드",isPartialCancelable:true,cancels:[] } }));
  const cancel=vi.fn(async(i:RefundIntent)=>{
    payment={ ...(await lookup(i)).payment,balanceAmount:i.originalAmount-i.amount,status:i.amount===i.originalAmount ? "CANCELED" : "PARTIAL_CANCELED",
      cancels:[{ transactionKey:randomUUID(),cancelAmount:i.amount,cancelReason:i.cancelReason,cancelStatus:"DONE",canceledAt:new Date().toISOString() }] };
    return { ok:true as const,payment };
  });
  return { lookup,cancel };
}
const run=(o:BundleOrder,a:{requestId:string},p:RefundProvider,store=refunds)=>processApprovedRefund(store,p,A,o.orderId,a.requestId,operatorRef);
const count=async(event:string)=>(await h.db.query("select * from report_ticket_ledger where event_type=$1",[event])).rows.length;
async function releaseClaim() { await h.db.query("update ticket_bundle_refunds set claim_until=clock_timestamp()-interval '1 second'"); }

describe("proportional paid lot refunds",()=>{
  it.each([[1490,1,1,1490],[4290,3,2,2860],[4290,3,1,1430],[6890,5,4,5512],[6890,5,3,4134],[6890,5,1,1378],[13400,10,9,12060],[13400,10,8,10720],[13400,10,5,6700],[13400,10,1,1340]])("integer %i / %i * %i = %i",(a,n,r,e)=>expect(proportionalRefund(a,n,r)).toBe(e));
  it("rejects fractional, negative, unsafe and unsupported historical rounding",()=>{
    for(const a of [[1490,3,1],[-1,1,1],[1490,1,2],[1490,0,0],[Number.MAX_SAFE_INTEGER+1,1,1]]) expect(proportionalRefund(...a as [number,number,number])).toBeNull();
    expect(proportionalRefund(1490,1,0)).toBe(0);
  });
  it("real completed usage, partial 10720 settlement, immutable ledger and Books retained",async()=>{
    const o=await paid(); for(let i=0;i<2;i++){ await enqueue(); expect((await finish()).state).toBe("COMPLETED"); }
    const a=await approved(o), p=mockProvider();
    expect((await refunds.call("quote",A,a)).quote).toMatchObject({ used:2,remaining:8,estimate:10720,pending:0 });
    expect((await h.tickets.call("summary",A)).quantity).toBe(0);
    const r=await run(o,a,p); expect(r.refund).toMatchObject({ state:"COMPLETED",amount:10720,quantity:8,partial:true });
    expect((await run(o,a,p)).refund?.state).toBe("COMPLETED"); expect(p.cancel).toHaveBeenCalledTimes(1); expect(await count("REFUND")).toBe(1);
    expect((await h.db.query("select quantity_delta from report_ticket_ledger where event_type='REFUND'")).rows[0]).toEqual({quantity_delta:-8});
    expect((await h.tickets.call("library",A)).items).toHaveLength(2);
    expect((await h.db.query<{days:number}>("select extract(epoch from expires_at-published_at)/86400 days from paid_report_snapshots")).rows.every(r=>Number(r.days)===90)).toBe(true);
    await expect(h.db.exec("update report_ticket_ledger set quantity_delta=0")).rejects.toThrow();
  });
  it("stored old price, other purchases and free lots never enter quote",async()=>{
    const o=await paid("PACK_5",6500); expect(safeBundleOrder(o)).toBe(true);
    await enqueue(); await finish();
    await paid("PACK_3"); await h.tickets.call("grant",A,{ quantity:2,sourceType:"promotion",sourceRef:"isolated-free",key:"isolated-free",reason:"LOCAL" });
    const a=await approved(o); expect((await refunds.call("quote",A,a)).quote?.estimate).toBe(5200);
    expect((await run(o,a,mockProvider())).ok).toBe(true); expect((await h.tickets.call("summary",A)).quantity).toBe(5);
  });
  it("queued/running block approval; reversal returns original lot then re-quotes",async()=>{
    const o=await paid("PACK_3"); await enqueue(); const a=await requested(o);
    expect((await refunds.call("quote",A,a)).quote).toMatchObject({ pending:1,remaining:2,estimate:2860 });
    expect((await refunds.call("approve",A,{ ...a,approvedAmount:2860,approvedQuantity:2 })).ok).toBe(false);
    await finish(true); expect((await refunds.call("quote",A,a)).quote).toMatchObject({ pending:0,used:0,remaining:3,estimate:4290 });
    expect((await refunds.call("approve",A,{ ...a,approvedAmount:2860,approvedQuantity:2 })).ok).toBe(false);
    expect((await refunds.call("approve",A,{ ...a,approvedAmount:4290,approvedQuantity:3 })).ok).toBe(true);
  });
  it("hold preserves FEFO even with another usable lot; safe withdrawal restores balance",async()=>{
    const o=await paid("PACK_3"); await paid("PACK_5"); const a=await requested(o);
    expect(await h.tickets.call("summary",A)).toMatchObject({ quantity:5,heldQuantity:3 });
    expect((await enqueue()).code).toBe("REFUND_HOLD"); expect(await count("REDEEM")).toBe(0);
    expect((await refunds.call("withdraw",A,a)).refund?.state).toBe("WITHDRAWN");
    expect((await h.tickets.call("summary",A)).quantity).toBe(8); expect((await enqueue()).ok).toBe(true);
    expect((await refunds.call("request",A,a)).refund?.state).toBe("WITHDRAWN");
    expect((await requested(o)).requestId).not.toBe(a.requestId);
  });
  it("100 requests coalesce, distinct requests cannot double hold, owner and exceptions",async()=>{
    const o=await paid(), a=await requested(o);
    for(let i=0;i<100;i++) expect((await refunds.call("request",A,a)).refund?.requestId).toBe(a.requestId);
    expect((await refunds.call("request",A,{ ...a,requestId:randomUUID() })).code).toBe("REFUND_ALREADY_REQUESTED");
    expect((await refunds.call("request",A,{ ...a,reasonCode:"OTHER" })).code).toBe("REQUEST_CONFLICT");
    expect((await refunds.call("quote",B,a)).code).toBe("ORDER_NOT_FOUND");
    await refunds.call("withdraw",A,a); const exception=await requested(o,"STATUTORY");
    expect((await refunds.call("approve",A,{ ...exception,approvedAmount:13400,approvedQuantity:10 })).code).toBe("REQUOTE_OR_SEPARATE_REVIEW_REQUIRED");
  });
  it("provider response lost: GET confirms same cancel and never sends another POST",async()=>{
    const o=await paid(), a=await approved(o), p=mockProvider(), original=p.cancel.getMockImplementation()!;
    const provider:RefundProvider={ lookup:p.lookup,cancel:async i=>{ await original(i); return {ok:false,code:"PROVIDER_UNKNOWN"}; } };
    expect((await run(o,a,provider)).refund?.state).toBe("COMPLETED"); expect(await count("REFUND")).toBe(1);
  });
  it("DB claim failure causes zero provider calls; timeout holds, restart reconciles",async()=>{
    const o=await paid(), a=await approved(o), p=mockProvider();
    const failed:RefundStore={ call:async()=>{ throw new Error("isolated DB down"); } };
    expect((await run(o,a,p,failed)).code).toBe("REFUND_RECONCILIATION_REQUIRED"); expect(p.lookup).not.toHaveBeenCalled();
    const broken:RefundProvider={ lookup:async()=>({ok:false,code:"PROVIDER_UNKNOWN"}),cancel:p.cancel };
    expect((await run(o,a,broken)).code).toBe("PROVIDER_OUTCOME_UNKNOWN");
    expect((await refunds.call("withdraw",A,a)).code).toBe("FINANCIAL_REVIEW_PENDING");
    await releaseClaim(); expect((await run(o,a,p)).refund?.state).toBe("COMPLETED");
  });
  it.each(["confirm","settle","complete"])("PG success then DB %s fails: recover without financial duplicate",async action=>{
    const o=await paid(), a=await approved(o), p=mockProvider(); let fail=true;
    const store:RefundStore={ call:async(s,u,d)=>{ if(s===action && fail){fail=false;throw new Error("isolated lost DB response");} return refunds.call(s,u,d); } };
    expect((await run(o,a,p,store)).ok).toBe(false); expect(p.cancel).toHaveBeenCalledTimes(1);
    await releaseClaim(); expect((await run(o,a,p)).refund?.state).toBe("COMPLETED"); expect(p.cancel).toHaveBeenCalledTimes(1); expect(await count("REFUND")).toBe(1);
  });
  it("DB success with lost client response is idempotent",async()=>{
    const o=await paid(), a=await approved(o), p=mockProvider(); let fail=true;
    const store:RefundStore={ call:async(s,u,d)=>{ const r=await refunds.call(s,u,d); if(s==="complete" && fail){fail=false;throw new Error("lost reply");} return r; } };
    await run(o,a,p,store); expect((await run(o,a,p)).refund?.state).toBe("COMPLETED"); expect(p.cancel).toHaveBeenCalledTimes(1);
  });
  it("unsupported method/partial capability retains hold, never auto-denies rights",async()=>{
    const o=await paid(), a=await approved(o), p=mockProvider(); const original=p.lookup.getMockImplementation()!;
    const provider:RefundProvider={ ...p,lookup:async i=>{ const r=await original(i); return {...r,payment:{...r.payment,method:"가상계좌"}}; } };
    expect((await run(o,a,provider)).refund?.state).toBe("MANUAL_SETTLEMENT_REQUIRED"); expect(p.cancel).not.toHaveBeenCalled();
  });
  it("PG rejection and unrelated cancel never settle or release hold",async()=>{
    const o=await paid(), a=await approved(o), p=mockProvider();
    const rejected:RefundProvider={ lookup:p.lookup,cancel:async()=>({ok:false,code:"PROVIDER_REJECTED"}) };
    expect((await run(o,a,rejected)).refund?.state).toBe("MANUAL_SETTLEMENT_REQUIRED"); expect(await count("REFUND")).toBe(0);
    expect((await refunds.call("withdraw",A,a)).ok).toBe(false);
  });
  it.each(["different amount","different reason","partial disabled"])("%s cannot approve the wrong provider outcome",async variant=>{
    const o=await paid("PACK_3");await enqueue();await finish();const a=await approved(o),p=mockProvider();
    const original=p.lookup.getMockImplementation()!;
    const provider:RefundProvider={...p,lookup:async i=>{
      const r=await original(i);
      if(variant==="partial disabled")return {...r,payment:{...r.payment,isPartialCancelable:false}};
      const amount=variant==="different amount" ? 1430 : i.amount;
      return {...r,payment:{...r.payment,status:"PARTIAL_CANCELED",balanceAmount:i.originalAmount-amount,cancels:[{transactionKey:randomUUID(),cancelAmount:amount,cancelReason:variant==="different reason" ? "unrelated cancellation" : i.cancelReason,cancelStatus:"DONE",canceledAt:new Date().toISOString()}]}};
    }};
    expect((await run(o,a,provider)).refund?.state).toBe("MANUAL_SETTLEMENT_REQUIRED");expect(p.cancel).not.toHaveBeenCalled();expect(await count("REFUND")).toBe(0);
  });
  it("fully consumed lot still accepts statutory review without inventing unused money",async()=>{
    const o=await paid("SINGLE_1");await enqueue();await finish();const a=await requested(o,"STATUTORY");
    expect((await refunds.call("quote",A,a)).quote).toMatchObject({used:1,remaining:0,estimate:0});
    expect((await refunds.call("approve",A,{...a,approvedAmount:1490,approvedQuantity:1})).ok).toBe(false);
    expect((await h.tickets.call("library",A)).items).toHaveLength(1);
  });
  it("RLS, forged REFUND, immutable audit and approval policy gates remain closed",async()=>{
    const o=await paid(), a=await approved(o);
    const row=(await h.db.query<{id:string;grant_id:string}>("select id,grant_id from ticket_bundle_refunds")).rows[0];
    await expect(h.db.query("insert into report_ticket_ledger(user_id,grant_id,event_type,quantity_delta,refund_id,idempotency_key,reason) values($1,$2,'REFUND',-10,$3,$4,'FORGED')",[A,row.grant_id,row.id,`refund:${row.id}`])).rejects.toThrow("REFUND_EVIDENCE_REQUIRED");
    for(const role of ["anon","authenticated"]) {
      await h.db.exec(`reset role; set role ${role};`);
      await expect(h.db.exec("select * from ticket_bundle_refunds")).rejects.toThrow();
      await expect(h.db.query("select ticket_bundle_refunds_rpc('approve',$1,$2)",[A,JSON.stringify(a)])).rejects.toThrow();
    }
    await h.db.exec("reset role; set role service_role;");
    await expect(h.db.exec("delete from ticket_bundle_refund_audit")).rejects.toThrow();
    expect(BUNDLE_PURCHASE_POLICY_VERSION).toBeNull(); expect(AUTOMATIC_BUNDLE_REFUND_ENABLED).toBe(false);
  });
  it("customer handler validates owner, consent, scope, origin, size and strict whitelist",async()=>{
    vi.stubEnv("NODE_ENV","test");
    try {
      const o=await paid(), scope=createHash("sha256").update(`bundle-ui-v1:${A}`).digest("hex");
      const body={ bundleOrderId:o.orderId,requestId:randomUUID(),reasonCode:"UNUSED" };
      const req=(data:object,origin="http://localhost",extra={})=>new NextRequest("http://localhost/api/ticket-bundles/refund-request",{method:"POST",headers:{origin,"content-type":"application/json","x-ticket-account":scope,...extra},body:JSON.stringify(data)});
      const handle=(r:NextRequest,auth=ticketAuth(),action="refund-request")=>handleBundleCommerce(r,action,auth,bundles,providerApprove,{clientKey:"mock",successUrl:"http://localhost/success",failUrl:"http://localhost/fail"},{refunds,tickets:h.tickets,localOrigin:"http://localhost"});
      expect((await handle(req(body))).status).toBe(200);
      for(const key of ["userId","grantId","paymentKey","refundAmount","unitPrice","arbitraryQuantity","providerCancelId","operatorRef"]) expect((await handle(req({...body,[key]:"forged"}))).status).toBe(400);
      expect((await handle(req(body,"https://evil.invalid"))).status).toBe(403);
      expect((await handle(req(body),ticketAuth(null))).status).toBe(401);
      expect((await handle(req(body),ticketAuth(A,false))).status).toBe(401);
      expect((await handle(req(body),ticketAuth(B))).status).toBe(409);
      expect((await handle(req(body,"http://localhost",{"content-length":"9000"}))).status).toBe(413);
      expect((await handle(req(body),ticketAuth(),"approve")).status).toBe(404);
      expect((await handle(req(body),ticketAuth(),"toString")).status).toBe(404);
      const response=await handle(req(body)); const text=await response.text(); expect(text).not.toMatch(/paymentKey|provider_cancel|transactionKey|idempotencyKey|operatorRef|claim_token/);
    } finally {vi.unstubAllEnvs();}
  });
});

describe("Toss mock transport contract",()=>{
  const intent=():RefundIntent=>({paymentKey:"local/key",providerOrderId:"stored-order",originalAmount:13400,amount:10720,quantity:8,idempotencyKey:`ticket-refund-${randomUUID()}`,cancelReason:"원래 구매 미사용분 mock",firstAttemptAt:new Date().toISOString(),token:randomUUID(),canPost:true});
  it("full/partial explicit integer amount, stable key, GET recovery, no global fetch",async()=>{
    for(const amount of [10720,13400]){
      const i={...intent(),amount}; const p=mockProvider(); const returned=await p.cancel(i);
      const transport=vi.fn<typeof fetch>(async()=>new Response(JSON.stringify(returned.payment),{status:200})); const adapter=createTossRefundProvider("mock-only-not-a-real-key",transport);
      expect((await adapter.cancel(i)).ok).toBe(true); await adapter.cancel(i); await adapter.lookup(i);
      expect(transport.mock.calls[0][0]).toBe("https://api.tosspayments.com/v1/payments/local%2Fkey/cancel");
      expect(JSON.parse(String(transport.mock.calls[0][1]?.body))).toEqual({cancelReason:i.cancelReason,cancelAmount:amount,currency:"KRW"});
      expect(transport.mock.calls[0][1]?.headers).toEqual(transport.mock.calls[1][1]?.headers);
      expect(transport.mock.calls[2][1]?.method).toBe("GET");
      for(const changed of [{paymentKey:"wrong"},{orderId:"wrong"},{currency:"USD"},{totalAmount:14900},{balanceAmount:1},{cancels:[...returned.payment.cancels,...returned.payment.cancels]}]) expect(refundPayment({...returned.payment,...changed},i)).toBeNull();
    }
  });
  it("expired idempotency cannot POST; unknown transport yields uncertain result",async()=>{
    const i=intent(), transport=vi.fn<typeof fetch>(async()=>{throw new Error("mock timeout");}),adapter=createTossRefundProvider("mock",transport);
    expect((await adapter.lookup(i)).ok).toBe(false);
    transport.mockClear(); expect((await adapter.cancel({...i,firstAttemptAt:"2020-01-01T00:00:00Z"})).ok).toBe(false); expect(transport).not.toHaveBeenCalled();
  });
});
