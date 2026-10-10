import { randomUUID,createHash } from "node:crypto";
import { readFileSync,mkdirSync,writeFileSync } from "node:fs";
import { beforeAll,beforeEach,afterAll,describe,expect,it,vi } from "vitest";
import { NextRequest } from "next/server";
import type { PGlite } from "@electric-sql/pglite";
vi.mock("server-only",()=>({}));
import { createCouponTestDatabase,seedCouponFixtures,sqlCouponStore,sqlCouponReliability } from "../../../src/lib/coupons/localDatabase";
import { quoteCoupon,reserveCouponOrder,confirmCouponOrder,localCouponCheckout,type CouponIdentity,type CouponStore } from "../../../src/lib/coupons/service";
import { handleLocalCoupons } from "../../../src/lib/coupons/handler";
import { confirmTossPayment } from "../../../src/lib/payment/tossConfirmClient";
import { runPaidReportJob } from "../../../src/lib/payment/paidReportReliability";
import { generateV4ShadowReport } from "../../../src/lib/interpretation-v4/runtimeShadow";
import { validateV4Publication } from "../../../src/lib/interpretation-v4/runtimeProjection";
import { getReportProductCatalog } from "../../../src/lib/payment/reportProductCatalog";
import { createCheckoutConsentAssertion } from "../../../src/lib/payment/checkoutConsent";
import { confirmedAdultDevTossCheckoutLegalConfirmations } from "../../../src/components/payment/DevTossCheckoutLauncher";
import { RUNTIME_FIXTURES } from "../interpretation-v4/runtimeFixtures";
import { ACCOUNT_POLICY_VERSIONS, safeAccountNext } from "../../../src/lib/account/policy";
import type { AccountPort } from "../../../src/lib/account/handler";
import { libraryItem, type LibraryRow } from "../../../src/lib/library/model";
import { handleTickets } from "../../../src/lib/tickets/handler";
import type { TossConfirmRequest,TossConfirmClientResult } from "../../../src/lib/payment/tossConfirmTypes";
const A="11111111-1111-4111-8111-111111111111",B="22222222-2222-4222-8222-222222222222";
const member=(user=A):CouponIdentity=>({user,actor:`user:${user}`}),guest=(char="a"):CouponIdentity=>({user:null,actor:`guest:${char.repeat(64)}`});
const now=new Date(),consent=createCheckoutConsentAssertion(confirmedAdultDevTossCheckoutLegalConfirmations);
const fixtures=RUNTIME_FIXTURES.map(f=>({...f,payload:f.id==="annual"?{...f.payload,productOptions:{...("productOptions" in f.payload?f.payload.productOptions:{}),selectedYear:String(now.getFullYear())}}:f.payload}));
let db:PGlite,store:CouponStore;
const reserve=(code="GYEOL300",identity=member(),requestId=randomUUID(),payload:unknown=fixtures[0].payload)=>reserveCouponOrder(store,identity,{requestId,payload,consent,selection:{code},claimHash:identity.user?null:createHash("sha256").update(`${identity.actor}:${requestId}`).digest("hex")},now);
const quote=(code="GYEOL300",identity=member(),product="saju_mbti_full")=>quoteCoupon(store,identity,product,{code});
const mock=vi.fn(async(payment:TossConfirmRequest):Promise<TossConfirmClientResult>=>confirmTossPayment({...payment,expectedAmount:payment.amount,secretKey:"MOCK_ONLY",fetchImpl:async(_url,init)=>{
  expect(JSON.parse(String(init.body)).amount).toBe(payment.amount);
  return {ok:true,status:200,json:async()=>({orderId:payment.orderId,totalAmount:payment.amount,currency:"KRW",status:"DONE",approvedAt:now.toISOString()})};
}}));
const complete=(orderId:string,identity=member())=>confirmCouponOrder(store,identity,orderId,`mock-${orderId}`,mock);
beforeAll(async()=>{db=await createCouponTestDatabase();await db.query("insert into auth.users values($1),($2)",[A,B]);store=sqlCouponStore(db);
  if(process.env.COUPON_REVIEW_EXPORT){mkdirSync(process.env.COUPON_REVIEW_EXPORT,{recursive:true});writeFileSync(`${process.env.COUPON_REVIEW_EXPORT}/fixtures.json`,JSON.stringify(fixtures));writeFileSync(`${process.env.COUPON_REVIEW_EXPORT}/consent.json`,JSON.stringify(consent));}
},30000);
beforeEach(async()=>{await db.exec("reset role;truncate coupon_definitions,payment_orders cascade;");await seedCouponFixtures(db);await db.exec("set role service_role");mock.mockClear();});
afterAll(async()=>{await db?.close();});
describe("coupon pricing / SQL authority",()=>{
  it("no coupon remains 1490 for all six; quote never reserves",async()=>{
    for(const p of getReportProductCatalog())expect(await quoteCoupon(store,guest(),p.productType)).toMatchObject({originalAmount:1490,discountAmount:0,finalAmount:1490});
    expect((await db.query("select * from coupon_redemptions")).rows).toHaveLength(0);
  });
  it.each(getReportProductCatalog())("$productType fixed 300 and 20 percent",async p=>{
    expect(await quote("GYEOL300",guest(),p.productType)).toMatchObject({originalAmount:1490,discountAmount:300,finalAmount:1190});
    expect(await quote("20PERCENT",member(),p.productType)).toMatchObject({discountAmount:298,finalAmount:1192});
  });
  it("percentage floor in integer KRW and max_discount",async()=>{
    await db.exec("update coupon_definitions set discount_value=33 where code='20PERCENT'");
    expect(await quote("20PERCENT")).toMatchObject({discountAmount:491,finalAmount:999});
    await db.exec("update coupon_definitions set max_discount=200 where code='20PERCENT'");
    expect(await quote("20PERCENT")).toMatchObject({discountAmount:200,finalAmount:1290});
  });
  it("zero/free/below CARD minimum are rejected, never converted to tickets",async()=>{
    for(const amount of [1391,1490,1500]){await db.query("update coupon_definitions set discount_value=$1 where code='GYEOL300'",[amount]);expect(await quote()).toMatchObject({ok:false,code:"MINIMUM_PAYMENT"});}
    await db.exec("update coupon_definitions set discount_value=1390 where code='GYEOL300'");expect(await quote()).toMatchObject({finalAmount:100});
    expect((await db.query("select * from report_ticket_ledger")).rows).toHaveLength(0);
  });
  it("product scope, min order, inactive/start/end",async()=>{
    expect(await quote("CAREER_ONLY")).toMatchObject({code:"PRODUCT_INELIGIBLE"});expect((await quote("CAREER_ONLY",member(),"career_money_study")).ok).toBe(true);
    expect(await quote("EXPIRED")).toMatchObject({code:"COUPON_EXPIRED"});
    await db.exec("update coupon_definitions set min_order_amount=2000 where code='GYEOL300'");expect(await quote()).toMatchObject({code:"MIN_ORDER_AMOUNT"});
    await db.exec("update coupon_definitions set is_active=false where code='GYEOL300'");expect(await quote()).toMatchObject({code:"COUPON_INACTIVE"});
    await db.exec("update coupon_definitions set is_active=true,starts_at=now()+interval '1 day' where code='GYEOL300'");expect(await quote()).toMatchObject({code:"COUPON_NOT_STARTED"});
  });
  it("member/public ownership, claim idempotency and source binding",async()=>{
    expect(await quote("MEMBER_ONLY",guest())).toMatchObject({code:"MEMBER_REQUIRED"});expect((await quote("GYEOL300",guest())).ok).toBe(true);
    const first=await store.call("claim",member(),{code:"MEMBER_ONLY"}),again=await store.call("claim",member(),{code:"MEMBER_ONLY"});expect(first.grantId).toBe(again.grantId);
    expect((await store.call("list",member())).items).toEqual([expect.objectContaining({grantId:first.grantId,name:"회원 300원 할인"})]);
    expect(await quoteCoupon(store,member(B),"saju_mbti_full",{grantId:String(first.grantId)})).toMatchObject({code:"COUPON_NOT_FOUND"});
    expect((await quoteCoupon(store,member(),"saju_mbti_full",{grantId:String(first.grantId)})).ok).toBe(true);
    const d=(await db.query<{id:string}>("select id from coupon_definitions where code='GYEOL300'")).rows[0].id;
    const data={couponId:d,sourceType:"manual",sourceRef:"one-source",key:"one-key"};
    expect((await store.call("grant",member(),data)).ok).toBe(true);expect((await store.call("grant",member(),data)).ok).toBe(true);expect((await store.call("grant",member(B),data)).ok).toBe(false);
  });
  it("grant override cannot extend definition expiry; expired override denied",async()=>{
    const d=(await db.query<{id:string}>("select id from coupon_definitions where code='GYEOL300'")).rows[0].id;
    const g=await store.call("grant",member(),{couponId:d,sourceType:"manual",sourceRef:"override",key:"override",expiresAt:new Date(now.getTime()-1000).toISOString()});
    expect(await quoteCoupon(store,member(),"saju_mbti_full",{grantId:String(g.grantId)})).toMatchObject({code:"COUPON_EXPIRED"});
  });
  it("private code-null grant stays account-bound and effective expiry uses the earlier date",async()=>{
    const d=(await db.query<{id:string;expires_at:string}>("update coupon_definitions set code=null where code='MEMBER_ONLY' returning id,expires_at::text")).rows[0];
    const g=await store.call("grant",member(),{couponId:d.id,sourceType:"manual",sourceRef:"private",key:"private",expiresAt:new Date(now.getTime()+30*86400000).toISOString()});
    const q=await quoteCoupon(store,member(),"saju_mbti_full",{grantId:String(g.grantId)});
    expect(q).toMatchObject({ok:true,finalAmount:1190});
    expect(Date.parse((q.coupon as {expiresAt:string}).expiresAt)).toBe(Date.parse(d.expires_at));
    expect(await quoteCoupon(store,member(B),"saju_mbti_full",{grantId:String(g.grantId)})).toMatchObject({ok:false});
    expect(await quote("MEMBER_ONLY")).toMatchObject({ok:false});
  });
  it("first purchase based on successful paid_at including refunded history, not signup/ticket",async()=>{
    await db.exec("update coupon_definitions set first_purchase_only=true,member_only=true where code='GYEOL300'");
    expect((await quote()).ok).toBe(true);const r=await reserve();expect(r.ok).toBe(true);
    expect(await reserve("GYEOL300")).toMatchObject({code:"FIRST_PURCHASE_ONLY"});
    await complete(r.orderId!);expect(await quote()).toMatchObject({code:"FIRST_PURCHASE_ONLY"});
    await db.query("update payment_orders set status='refunded',refunded_at=now() where payment_order_id=$1",[r.orderId]);
    expect(await quote()).toMatchObject({code:"FIRST_PURCHASE_ONLY"});
  });
});
describe("reserve/redeem/release and monetary snapshots",()=>{
  it("last usage slot, duplicate request, retries; immutable paid amount",async()=>{
    await db.exec("update coupon_definitions set total_usage_limit=1 where code='GYEOL300'");
    const [a,b]=await Promise.all([reserve(),reserve("GYEOL300",member(B))]);expect([a,b].filter(r=>r.ok)).toHaveLength(1);
    const r=a.ok?a:b,id=a.ok?member():member(B);expect((await complete(r.orderId!,id)).state).toBe("REDEEMED");
    expect((await complete(r.orderId!,id)).state).toBe("REDEEMED");expect(mock).toHaveBeenCalledTimes(1);
    await expect(db.query("update payment_orders set amount=1290 where payment_order_id=$1",[r.orderId])).rejects.toThrow(/COUPON_PRICE_IMMUTABLE/);
    expect((await db.query("select * from coupon_redemptions")).rows).toHaveLength(1);
  });
  it("same order idempotency and different input/product conflict",async()=>{
    const key=randomUUID(),a=await reserve("GYEOL300",member(),key),b=await reserve("GYEOL300",member(),key);expect(a.orderId).toBe(b.orderId);
    expect(await reserve("GYEOL300",member(),key,fixtures[1].payload)).toMatchObject({code:"REQUEST_CONFLICT"});
    expect((await db.query("select * from payment_orders")).rows).toHaveLength(1);
  });
  it("per-user limit counts reservations; guests limited only per cookie identity",async()=>{
    await db.exec("update coupon_definitions set per_user_limit=1 where code='GYEOL300'");
    await reserve();expect(await reserve()).toMatchObject({code:"USAGE_LIMIT"});expect((await reserve("GYEOL300",member(B))).ok).toBe(true);
    await reserve("GYEOL300",guest());expect(await reserve("GYEOL300",guest())).toMatchObject({code:"USAGE_LIMIT"});expect((await reserve("GYEOL300",guest("b"))).ok).toBe(true);
  });
  it("cancel/fail release once, cannot complete released order, another account blocked",async()=>{
    const r=await reserve();expect(await store.call("release",member(B),{orderId:r.orderId})).toMatchObject({ok:false});
    const rs=await Promise.all([store.call("release",member(),{orderId:r.orderId}),store.call("release",member(),{orderId:r.orderId})]);expect(rs.every(r=>r.state==="RELEASED")).toBe(true);
    expect((await complete(r.orderId!)).ok).toBe(false);expect(mock).not.toHaveBeenCalled();expect((await reserve()).ok).toBe(true);
  });
  it("reserved definition expiry/settings changes freeze quote for short completion window",async()=>{
    const r=await reserve();await db.exec("update coupon_definitions set discount_value=400,is_active=false,expires_at=now()-interval '1 second' where code='GYEOL300'");
    expect((await complete(r.orderId!)).state).toBe("REDEEMED");expect(mock.mock.calls[0][0].amount).toBe(1190);
    expect((await db.query<{amount:number}>("select amount from payment_orders")).rows[0].amount).toBe(1190);
  });
  it("abandon expiry releases without extending expired definition; late confirm blocked",async()=>{
    const r=await reserve();await db.exec("reset role;alter table coupon_redemptions disable trigger coupon_redemption_audit;update coupon_redemptions set reserved_at=reserved_at-interval '11 minutes',reserve_until=reserve_until-interval '11 minutes';alter table coupon_redemptions enable trigger coupon_redemption_audit;set role service_role;");
    expect((await complete(r.orderId!)).state).toBe("RELEASED");expect(mock).not.toHaveBeenCalled();
  });
  it("definitive confirm fail releases; network uncertainty holds (no accidental free paid purchase)",async()=>{
    const failed=await reserve();expect(await confirmCouponOrder(store,member(),failed.orderId!,"declined",async()=>({ok:false,error:{code:"TOSS_CONFIRM_PROVIDER_ERROR",message:"declined"},definitiveFailure:true}))).toMatchObject({state:"RELEASED"});
    const pending=await reserve();expect(await confirmCouponOrder(store,member(),pending.orderId!,"unknown",async()=>{throw new Error("NETWORK_TIMEOUT");})).toMatchObject({code:"PAYMENT_RECONCILIATION_REQUIRED"});
    expect(await store.call("release",member(),{orderId:pending.orderId})).toMatchObject({code:"PAYMENT_RECONCILIATION_REQUIRED"});
    expect((await db.query<{state:string}>("select state from coupon_redemptions where payment_order_id=$1",[pending.orderId])).rows[0].state).toBe("RESERVED");
  });
  it("client amount ignored at confirm service; provider wrong amount cannot redeem",async()=>{
    const r=await reserve();expect(await confirmCouponOrder(store,member(),r.orderId!,"wrong",async p=>({ok:true,confirm:{provider:"toss",paymentKeyReceived:true,orderId:p.orderId,amount:1,status:"DONE"}}))).toMatchObject({code:"PAYMENT_RECONCILIATION_REQUIRED"});
    expect((await db.query<{state:string}>("select state from coupon_redemptions")).rows[0].state).toBe("RESERVED");
  });
  it("lost commit acknowledgement retries without another provider call or redemption",async()=>{
    const r=await reserve();let lose=true;
    const lost:CouponStore={async call(action,id,data){const result=await store.call(action,id,data);if(action==="finish_confirm"&&lose){lose=false;throw new Error("LOCAL_ACK_LOST");}return result;}};
    expect(await confirmCouponOrder(lost,member(),r.orderId!,`mock-${r.orderId}`,mock)).toMatchObject({code:"PAYMENT_RECONCILIATION_REQUIRED"});
    expect(await complete(r.orderId!)).toMatchObject({state:"REDEEMED"});expect(mock).toHaveBeenCalledTimes(1);
    expect((await db.query("select * from coupon_redemptions where state='REDEEMED'")).rows).toHaveLength(1);
  });
  it("unknown provider outcome keeps its slot beyond expiry; same order can reconcile after confirm lease",async()=>{
    await db.exec("update coupon_definitions set total_usage_limit=1 where code='GYEOL300'");
    const r=await reserve();await confirmCouponOrder(store,member(),r.orderId!,`mock-${r.orderId}`,async()=>{throw new Error("LOCAL_TIMEOUT");});
    await db.exec("reset role;alter table coupon_redemptions disable trigger coupon_redemption_audit;update coupon_redemptions set reserved_at=reserved_at-interval '11 minutes',reserve_until=reserve_until-interval '11 minutes';alter table coupon_redemptions enable trigger coupon_redemption_audit;update payment_orders set confirm_lease_until=now()-interval '1 second';set role service_role;");
    expect(await quote("GYEOL300",member(B))).toMatchObject({code:"USAGE_LIMIT"});
    expect(await complete(r.orderId!)).toMatchObject({state:"REDEEMED"});
  });
  it("paid generation failure NEVER releases coupon; existing paid recovery owns it",async()=>{
    const r=await reserve();await complete(r.orderId!);
    await runPaidReportJob(sqlCouponReliability(db),{enabled:false,reason:"flag_disabled"},async()=>({ok:false,error:{code:"INVALID_REPORT_INPUT",message:"LOCAL_FAILURE"}}));
    expect(await store.call("release",member(),{orderId:r.orderId})).toMatchObject({state:"REDEEMED"});
    expect((await db.query<{state:string}>("select state from coupon_redemptions")).rows[0].state).toBe("REDEEMED");
  });
  it.each(fixtures)("$id coupon → paid worker → unchanged real V4 content/library",async f=>{
    const r=await reserve("GYEOL300",member(),randomUUID(),f.payload);expect(r.ok).toBe(true);
    expect(localCouponCheckout(f.payload.productKey,r)?.requestPayment.amount).toEqual({currency:"KRW",value:1190});
    const c=await complete(r.orderId!);expect(c.state).toBe("REDEEMED");expect(mock.mock.calls[0][0].amount).toBe(1190);
    const generated=await generateV4ShadowReport(f.payload,{evaluatedAt:now.toISOString(),policyDate:now.toISOString()});expect(generated.ok).toBe(true);
    const finish=await runPaidReportJob(sqlCouponReliability(db),{enabled:false,reason:"flag_disabled"},async()=>generated,validateV4Publication);expect(finish.ok).toBe(true);
    const read=await sqlCouponReliability(db).call("read_report",{reportId:c.reportId});expect(read.status).toBe("COMPLETED");
    const snapshot=read.snapshot as {draft:unknown;evidencePacket:unknown};expect(snapshot.draft).toEqual(generated.ok&&generated.draft);expect(snapshot.evidencePacket).toEqual(generated.ok&&generated.evidencePacket);
    const library=(await db.query<{items:LibraryRow[]}>("select list_account_reports($1) items",[A])).rows[0].items;
    expect(library).toHaveLength(1);
    expect(libraryItem(library[0],true)?.accessURL).toBe(`/dev/book-flow/report/${c.reportId}`);
    expect(safeAccountNext(`/dev/book-flow/report/${c.reportId}`,true)).toBe(`/dev/book-flow/report/${c.reportId}`);
    expect(safeAccountNext(`/dev/book-flow/report/${c.reportId}`,false)).toBe("/account");
    if(f.id==="major")expect((snapshot.draft as {major:{years:unknown[]}}).major.years).toHaveLength(14);
    if(f.id==="annual")expect((snapshot.draft as {annual:{months:unknown[]}}).annual.months).toHaveLength(12);
  });
  it("a successfully paid guest book claimed by a member counts as a previous purchase",async()=>{
    const key=randomUUID(),r=await reserve("GYEOL300",guest(),key),c=await complete(r.orderId!,guest());
    const generated=await generateV4ShadowReport(fixtures[0].payload,{evaluatedAt:now.toISOString(),policyDate:now.toISOString()});
    await runPaidReportJob(sqlCouponReliability(db),{enabled:false,reason:"flag_disabled"},async()=>generated,validateV4Publication);
    const hash=createHash("sha256").update(`${guest().actor}:${key}`).digest("hex");
    expect((await db.query<{state:string}>("select claim_report_account($1,$2,$3,true) state",[c.reportId,A,hash])).rows[0].state).toBe("owned");
    await db.exec("update coupon_definitions set first_purchase_only=true,member_only=true where code='GYEOL300'");
    expect(await quote()).toMatchObject({code:"FIRST_PURCHASE_ONLY"});
  });
  it("RLS/privileges deny client reads/mutations/RPC and monetary constraints protect rows",async()=>{
    const r=await reserve();await expect(db.query("update coupon_redemptions set discount_amount=0 where payment_order_id=$1",[r.orderId])).rejects.toThrow();
    for(const role of ["anon","authenticated"]){await db.exec(`reset role;set role ${role}`);
      for(const table of ["coupon_definitions","coupon_grants","coupon_redemptions"])for(const q of [`select * from ${table}`,`delete from ${table}`,`update ${table} set id=id`])await expect(db.exec(q)).rejects.toThrow(/permission denied/);
      await expect(quote()).rejects.toThrow(/permission denied/);
    }
    await db.exec("reset role");expect((await db.query<{relrowsecurity:boolean}>("select relrowsecurity from pg_class where relname in ('coupon_definitions','coupon_grants','coupon_redemptions')")).rows.every(r=>r.relrowsecurity)).toBe(true);
  });
});

describe("coupon HTTP isolation",()=>{
  const origin="http://127.0.0.1:3190";
  function auth():AccountPort{const user={id:A,provider:"kakao" as const,displayName:"검수"};return {currentUser:async()=>user,read:async()=>({profile:user,consents:Object.entries(ACCOUNT_POLICY_VERSIONS).map(([consent_type,document_version])=>({consent_type:consent_type as "terms"|"privacy",document_version,required:true,is_agreed:true,recorded_at:now.toISOString()}))}),finish:r=>r,authorizationOrigin:origin,start:async()=>null,exchange:async()=>false,logout:async()=>true,consent:async()=>false};}
  function req(body:unknown){return new NextRequest(`${origin}/dev/account/api/coupon-quote`,{method:"POST",headers:{host:"127.0.0.1:3190",origin},body:JSON.stringify(body)});}
  it("amount/owner/expiry/limits/stacking/ticket fields rejected before store; public gate off",async()=>{
    vi.stubEnv("NODE_ENV","development");const port:CouponStore={call:vi.fn(async()=>({ok:true}))};
    try{
      for(const field of ["originalPrice","discount","finalAmount","user_id","ownerId","expires_at","usage_limit","ticket","couponId"]){expect((await handleLocalCoupons(req({productType:"saju_mbti_full",[field]:1}),"quote",auth(),port)).status).toBe(400);}
      expect((await handleLocalCoupons(req({productType:"saju_mbti_full",selection:{code:"GYEOL300",grantId:randomUUID()}}),"quote",auth(),port)).status).toBe(400);
      const cross=req({});cross.headers.set("origin","https://evil.test");expect((await handleLocalCoupons(cross,"quote",auth(),port)).status).toBe(403);
      expect(port.call).not.toHaveBeenCalled();vi.stubEnv("NODE_ENV","production");expect((await handleLocalCoupons(req({}),"quote",auth(),port)).status).toBe(404);
      for(const f of ["src/lib/account/gate.ts","src/lib/book/publicGate.ts"])expect(readFileSync(f,"utf8")).toContain("return false;");
    }finally{vi.unstubAllEnvs();}
  });
  it("ticket redemption rejects coupon selection instead of consuming both",async()=>{
    const port={call:vi.fn(async()=>({ok:true}))};
    const request=req({requestId:randomUUID(),payload:fixtures[0].payload,consent,selection:{code:"GYEOL300"}});
    expect((await handleTickets(request,"redeem",auth(),port)).status).toBe(400);expect(port.call).not.toHaveBeenCalled();
  });
});
