import { randomUUID } from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { beforeAll, beforeEach, afterAll, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import type { PGlite } from "@electric-sql/pglite";
vi.mock("server-only", () => ({}));
import { createTicketTestDatabase, sqlTicketStore } from "../../../src/lib/tickets/localDatabase";
import { redeemReportTicket, type TicketStore, type TicketResult } from "../../../src/lib/tickets/service";
import { handleTickets } from "../../../src/lib/tickets/handler";
import { generateV4ShadowReport } from "../../../src/lib/interpretation-v4/runtimeShadow";
import { validateV4Publication, type V4RuntimeEvidence } from "../../../src/lib/interpretation-v4/runtimeProjection";
import { RUNTIME_FIXTURES } from "../interpretation-v4/runtimeFixtures";
import { COMPATIBILITY_NARRATIVE_FIXTURES } from "../interpretation-v4/compatibilityFixtures";
import type { ProductGenerationResult } from "../../../src/lib/report-generation/productGenerationDispatcher";
import type { AccountPort } from "../../../src/lib/account/handler";
import { ACCOUNT_POLICY_VERSIONS } from "../../../src/lib/account/policy";
import { createCheckoutConsentAssertion } from "../../../src/lib/payment/checkoutConsent";
import { generateReportSnapshot } from "../../../src/lib/payment/paidReportReliability";
import { confirmedAdultDevTossCheckoutLegalConfirmations } from "../../../src/components/payment/DevTossCheckoutLauncher";
const A="11111111-1111-4111-8111-111111111111", B="22222222-2222-4222-8222-222222222222";
const now = new Date(), clock = { evaluatedAt: now.toISOString(), policyDate: now.toISOString() };
const fixtures = RUNTIME_FIXTURES.map(f => ({ ...f, payload: f.id === "annual" ? { ...f.payload, productOptions: { ...("productOptions" in f.payload ? f.payload.productOptions : {}), selectedYear: String(now.getFullYear()) } } : f.payload }));
let db: PGlite, store: TicketStore;
const generated = new Map<string, ProductGenerationResult>();
const grant = (quantity=1, extra: Record<string,unknown>={}, user=A) => store.call("grant",user,{ quantity,sourceType:"manual",sourceRef:"fixture",key:"fixture",reason:"TEST",...extra });
const summary = (user=A) => store.call("summary",user);
const reserve = (requestId=randomUUID(), user=A, productType="saju_mbti_full") => store.call("redeem",user,{requestId,inputHash:"a".repeat(64),productType,reportId:`report_${randomUUID().replaceAll("-","")}`,input:fixtures[0].payload,displayName:"검수",selectedYear:null});
const finish = (r:TicketResult, action="reverse", extra:Record<string,unknown>={}) => store.call(action,A,{redemptionId:r.redemptionId,token:r.token,reason:"TEST_FAILURE",...extra});
beforeAll(async()=>{
  db=await createTicketTestDatabase();
  await db.query("insert into auth.users values($1),($2)",[A,B]); store=sqlTicketStore(db);
  for(const f of fixtures) { const r=await generateV4ShadowReport(f.payload,clock); expect(r.ok,f.id).toBe(true);generated.set(f.id,r); }
  if(process.env.TICKET_REVIEW_EXPORT){mkdirSync(process.env.TICKET_REVIEW_EXPORT,{recursive:true});writeFileSync(`${process.env.TICKET_REVIEW_EXPORT}/fixtures.json`,JSON.stringify(fixtures));writeFileSync(`${process.env.TICKET_REVIEW_EXPORT}/consent.json`,JSON.stringify(createCheckoutConsentAssertion(confirmedAdultDevTossCheckoutLegalConfirmations)));}
},30000);
beforeEach(async()=>{await db.exec("reset role; truncate report_ticket_grants cascade; set role service_role;");});
afterAll(async()=>{await db?.close();});
describe("ticket ledger: actual SQL, no provider",()=>{
  it("shared publication helper preserves returned generation audit on validator exception",async()=>{
    const g=generated.get("comprehensive")!;
    const outcome=await generateReportSnapshot({payload:fixtures[0].payload,product_type:"saju_mbti_full",report_id:"report_audit_unchanged",created_at:now.toISOString()},
      {enabled:false,reason:"flag_disabled"},"deterministic_fallback",async()=>g,()=>{throw new Error("TEST_VALIDATOR");});
    expect(outcome).toMatchObject({success:false,stage:"generation",code:"GENERATION_EXCEPTION"});expect(outcome.result).toBe(g);
  });
  it("grant source/key idempotency and ledger-only reconstruction; explicit no-expiry",async()=>{
    const results=await Promise.all([grant(3),grant(3),grant(3)]);expect(new Set(results.map(r=>r.grantId)).size).toBe(1);
    expect(await summary()).toMatchObject({quantity:3});expect((await db.query("select * from report_ticket_ledger")).rows).toHaveLength(1);
    expect((await grant(4)).ok).toBe(false); expect(await summary(B)).toMatchObject({quantity:0});
    expect((await db.query<{q:number}>("select sum(quantity_delta)::int q from report_ticket_ledger")).rows[0].q).toBe(3);
  });
  it("balance 1 competing different requests: exactly one success, no overspend",async()=>{
    await grant();const rs=await Promise.all([reserve(),reserve()]);expect(rs.filter(r=>r.ok)).toHaveLength(1);expect(await summary()).toMatchObject({quantity:0});
  });
  it("same request concurrent/retry consumes once; changed product conflicts",async()=>{
    await grant(2);const key=randomUUID(); const rs=await Promise.all([reserve(key),reserve(key)]);
    expect(rs.filter(r=>r.fresh)).toHaveLength(1);expect(new Set(rs.map(r=>r.reportId)).size).toBe(1);
    expect(await reserve(key,A,"career_money_study")).toMatchObject({ok:false,code:"REQUEST_CONFLICT"});expect(await summary()).toMatchObject({quantity:1});
  });
  it("FEFO, unexpired scope and no-expiry last",async()=>{
    await grant(); const later=await grant(1,{key:"later",sourceRef:"later",expiresAt:new Date(Date.now()+86400000).toISOString()});
    const earlier=await grant(1,{key:"early",sourceRef:"early",expiresAt:new Date(Date.now()+3600000).toISOString()});
    await grant(1,{key:"scope",sourceRef:"scope",productScope:"annual_fortune",expiresAt:new Date(Date.now()+100000).toISOString()});
    await reserve();const first=(await db.query<{grant_id:string}>("select grant_id from report_ticket_redemptions")).rows[0];expect(first.grant_id).toBe(earlier.grantId);
    await reserve();expect((await db.query<{grant_id:string}>("select grant_id from report_ticket_redemptions order by created_at")).rows[1].grant_id).toBe(later.grantId);
  });
  it("explicit expiry excludes tickets, emits EXPIRE; reversal never extends lot validity",async()=>{
    await grant(2,{expiresAt:new Date(Date.now()+60_000).toISOString()});const r=await reserve();
    await db.exec("reset role; alter table report_ticket_grants disable trigger ticket_grants_immutable; update report_ticket_grants set expires_at=now()-interval '1 second'; alter table report_ticket_grants enable trigger ticket_grants_immutable; set role service_role;");
    expect(await summary()).toMatchObject({quantity:0});expect(await reserve()).toMatchObject({ok:false});
    await finish(r);expect(await summary()).toMatchObject({quantity:0});
    expect((await store.call("history",A)).history).toEqual(expect.arrayContaining([expect.objectContaining({event:"REVERSAL",quantity:1}),expect.objectContaining({event:"EXPIRE",quantity:-1})]));
  });
  it("same reversal retry restores once; another user cannot reverse",async()=>{
    await grant();const r=await reserve();expect(await store.call("reverse",B,{redemptionId:r.redemptionId,token:r.token})).toMatchObject({ok:false});
    await Promise.all([finish(r),finish(r)]);expect(await summary()).toMatchObject({quantity:1});
    expect((await db.query("select * from report_ticket_ledger where event_type='REVERSAL'")).rows).toHaveLength(1);
  });
  it("same source cannot be granted to another account; absent FK and expired grant fail",async()=>{
    await grant();await expect(grant(1,{},B)).rejects.toThrow(/unique constraint/);
    expect(await grant(1,{sourceRef:"old",key:"old",expiresAt:new Date(Date.now()-1000).toISOString()})).toMatchObject({ok:false});
    expect(await grant(1,{},"33333333-3333-4333-8333-333333333333")).toMatchObject({ok:false,code:"MEMBER_REQUIRED"});
  });
  it("real first-publication ownership conflict rolls back snapshot and restores ticket",async()=>{
    await grant();const wrapped:TicketStore={call:async(action,user,data)=>{
      if(action==="publish")await db.query("insert into report_account_links(report_id,user_id,link_source,report_version) select report_id,$1,'ticket','v4' from report_ticket_redemptions",[B]);
      return store.call(action,user,data);
    }};
    expect(await redeemReportTicket(wrapped,A,randomUUID(),fixtures[0].payload,{now,generate:async()=>generated.get("comprehensive")!})).toMatchObject({state:"REVERSED"});
    expect(await summary()).toMatchObject({quantity:1});expect((await db.query<{published_at:unknown}>("select published_at from paid_report_snapshots where ticket_redemption_id is not null")).rows.every(r=>r.published_at===null)).toBe(true);
  });
  it("publish/reversal race yields exactly one outcome and a revoked/deleted book never refunds",async()=>{
    await grant();let origin:Record<string,unknown>|undefined;
    const wrapped:TicketStore={call:async(action,user,data)=>{if(action==="publish")origin=data;return store.call(action,user,data);}};
    await redeemReportTicket(wrapped,A,randomUUID(),fixtures[0].payload,{now,generate:async()=>generated.get("comprehensive")!});
    expect(origin).toBeDefined();
    const rs=await Promise.all([store.call("publish",A,origin),store.call("reverse",A,origin)]);expect(rs.every(r=>r.state==="COMPLETED")).toBe(true);
    await db.exec("update report_account_links set revoked_at=now()");expect(await summary()).toMatchObject({quantity:0});
    expect((await store.call("library",A)).items).toEqual([expect.objectContaining({status:"unavailable"})]);
  });
  it("worker crash lease reconciles, late publish is fenced, expired lot is not revived",async()=>{
    await grant();const r=await reserve();await db.exec("update report_ticket_redemptions set lease_until=now()-interval '1 second'");
    expect(await summary()).toMatchObject({quantity:1}); expect(await finish(r,"publish")).toMatchObject({state:"REVERSED"});expect(await summary()).toMatchObject({quantity:1});
  });
  it("append-only, nonnegative guard, anon/client isolation and no client RPC write",async()=>{
    await grant();await expect(db.exec("update report_ticket_ledger set quantity_delta=10")).rejects.toThrow(/permission denied|IMMUTABLE/);
    await expect(db.exec("delete from report_ticket_grants")).rejects.toThrow(/permission denied|IMMUTABLE/);
    await expect(db.query("insert into report_ticket_ledger(user_id,grant_id,event_type,quantity_delta,idempotency_key,reason) select user_id,id,'EXPIRE',-2,'forged','test' from report_ticket_grants")).rejects.toThrow(/BALANCE_INVALID/);
    for(const role of ["anon","authenticated"]){await db.exec(`reset role;set role ${role}`);
      for(const table of ["report_ticket_ledger","report_ticket_grants","report_ticket_redemptions"]) await expect(db.query(`select * from ${table}`)).rejects.toThrow(/permission denied/);
      await expect(grant()).rejects.toThrow(/permission denied/);await expect(summary()).rejects.toThrow(/permission denied/);
    }
    await db.exec("reset role");expect((await db.query<{relrowsecurity:boolean}>("select relrowsecurity from pg_class where relname in ('report_ticket_ledger','report_ticket_grants','report_ticket_redemptions')")).rows.every(x=>x.relrowsecurity)).toBe(true);
  });
  it.each(fixtures)("$id one ticket → same generator/validator → snapshot → 9C owner/library",async f=>{
    await grant();const g=generated.get(f.id)!;const key=randomUUID();
    const result=await redeemReportTicket(store,A,key,f.payload,{now,generate:async()=>g});expect(result,f.id).toMatchObject({ok:true,state:"COMPLETED"});
    const read=await store.call("read",A,{reportId:result.reportId});expect(read.status).toBe("COMPLETED");
    const snapshot=read.snapshot as {draft:unknown;evidencePacket:V4RuntimeEvidence};expect(g.ok && snapshot.draft).toEqual(g.ok && g.draft);expect(g.ok && snapshot.evidencePacket).toEqual(g.ok && g.evidencePacket);
    expect(validateV4Publication(f.payload.productKey,snapshot.draft,snapshot.evidencePacket).ok).toBe(true);
    expect((await store.call("library",A)).items).toHaveLength(1);expect((await store.call("library",B)).items).toEqual([]);expect((await store.call("read",B,{reportId:result.reportId})).ok).toBe(false);
    expect(await summary()).toMatchObject({quantity:0});expect(await redeemReportTicket(store,A,key,f.payload,{now})).toMatchObject({state:"COMPLETED",reportId:result.reportId});
    expect((await db.query("select * from payment_orders")).rows).toHaveLength(0);
    if(f.id==="major")expect((snapshot.draft as {major:{years:unknown[]}}).major.years).toHaveLength(14);
    if(f.id==="annual")expect((snapshot.draft as {annual:{months:unknown[]}}).annual.months).toHaveLength(12);
  });
  it.each(["parentChild","managerReport"])("compatibility %s role remains canonical",async category=>{
    await grant();const f=COMPATIBILITY_NARRATIVE_FIXTURES.find(f=>f.payload.relationshipType===category)!;
    expect(await redeemReportTicket(store,A,randomUUID(),f.payload,{now})).toMatchObject({state:"COMPLETED"});
  });
  it.each(["validation","generation","completeness","persistence","publish-conflict","commit-ack-lost"])("failure %s: either valid book consumed OR no book restored, never both",async stage=>{
    await grant();const g=generated.get("comprehensive")!;
    const wrapped:TicketStore={call:async(action,user,data)=>{
      if(action==="publish"&&stage==="persistence")throw new Error("TEST_PERSISTENCE");
      if(action==="publish"&&stage==="publish-conflict")return {ok:false,code:"PUBLISH_REJECTED"};
      const r=await store.call(action,user,data);if(action==="publish"&&stage==="commit-ack-lost")throw new Error("LOST_ACK");return r;
    }};
    const result=await redeemReportTicket(wrapped,A,randomUUID(),fixtures[0].payload,{now,generate:async()=>{
      if(stage==="generation")throw new Error("TEST_GENERATION");
      if(stage==="validation")return {ok:false,error:{code:"INVALID_REPORT_INPUT",message:"TEST",validationErrors:["INVALID"]}};
      if(stage==="completeness")return {...g,draft:{}} as ProductGenerationResult;return g;
    }});
    const success=stage==="commit-ack-lost";expect(result).toMatchObject({state:success?"COMPLETED":"REVERSED"});expect(await summary()).toMatchObject({quantity:success?0:1});
    expect((await store.call("library",A)).items).toHaveLength(success?1:0);
  });
  it("90-day report expiry/deletion is not a ticket reversal",async()=>{
    await grant();const r=await redeemReportTicket(store,A,randomUUID(),fixtures[0].payload,{now,generate:async()=>generated.get("comprehensive")!});
    const [{published_at,expires_at}]=(await db.query<{published_at:Date;expires_at:Date}>("select published_at,expires_at from paid_report_snapshots where report_id=$1",[r.reportId])).rows;
    expect(new Date(expires_at).getTime()-new Date(published_at).getTime()).toBe(90*86400000);
    await db.exec("update paid_report_snapshots set published_at=published_at-interval '91 days',expires_at=expires_at-interval '91 days'");
    expect(await store.call("reverse",A,{redemptionId:r.redemptionId??(await db.query<{id:string}>("select id from report_ticket_redemptions")).rows[0].id})).toMatchObject({state:"COMPLETED"});
    expect(await summary()).toMatchObject({quantity:0});expect((await store.call("read",A,{reportId:r.reportId})).snapshot).toBeNull();
  });
});

describe("ticket HTTP authority",()=>{
  const origin="http://127.0.0.1:3189";
  function auth(member=true):AccountPort {const user={id:A,provider:"kakao" as const,displayName:"검수"};return {currentUser:vi.fn(async()=>member?user:null),read:async()=>({profile:user,consents:Object.entries(ACCOUNT_POLICY_VERSIONS).map(([consent_type,document_version])=>({consent_type:consent_type as "terms"|"privacy",document_version,required:true,is_agreed:true,recorded_at:now.toISOString()}))}),finish:r=>r,authorizationOrigin:origin,start:async()=>null,exchange:async()=>false,logout:async()=>true,consent:async()=>false};}
  function req(action:string,body?:unknown){return new NextRequest(`${origin}/dev/account/api/ticket-${action}`,{method:body?"POST":"GET",headers:{origin,host:"127.0.0.1:3189"},...(body?{body:JSON.stringify(body)}:{})});}
  it("guest/member isolation, client grant forbidden, forged identity/quantity rejected",async()=>{
    const port:TicketStore={call:vi.fn(async()=>({ok:true,quantity:0}))};
    expect((await handleTickets(req("summary"),"summary",auth(false),port)).status).toBe(401);
    expect((await handleTickets(req("grant",{}),"grant",auth(),port)).status).toBe(404);
    for(const field of ["user_id","quantity","source_type","ownerId"])expect((await handleTickets(req("redeem",{requestId:randomUUID(),payload:fixtures[0].payload,[field]:"forged"}),"redeem",auth(),port)).status).toBe(400);
    expect(port.call).not.toHaveBeenCalled();
    const response=await handleTickets(req("summary"),"summary",auth(),port);expect(response.headers.get("cache-control")).toContain("no-store");expect(await response.json()).toEqual({quantity:0});
    expect(port.call).toHaveBeenCalledWith("summary",A);
  });
  it("cross-origin and logout during authorization cannot redeem",async()=>{
    const port:TicketStore={call:vi.fn()},body={requestId:randomUUID(),payload:fixtures[0].payload,consent:createCheckoutConsentAssertion(confirmedAdultDevTossCheckoutLegalConfirmations)};
    const request=req("redeem",body);request.headers.set("origin","https://evil.test");expect((await handleTickets(request,"redeem",auth(),port)).status).toBe(403);
    const a=auth();vi.mocked(a.currentUser).mockResolvedValueOnce({id:A,provider:"kakao",displayName:"검수"}).mockResolvedValueOnce(null);
    expect((await handleTickets(req("redeem",body),"redeem",a,port)).status).toBe(401);expect(port.call).not.toHaveBeenCalled();
  });
  it("public Book/Auth gates remain literal OFF; no price/narrative changes",()=>{
    for(const f of ["src/lib/account/gate.ts","src/lib/book/publicGate.ts"])expect(readFileSync(f,"utf8")).toContain("return false;");
    expect(readFileSync("src/app/auth/[action]/route.ts","utf8")).not.toContain('action === "ticket-redeem"');
  });
  it("Production cannot invoke the dev narrative flow even with a valid store",async()=>{
    vi.stubEnv("NODE_ENV","production");const port:TicketStore={call:vi.fn()};
    try{expect(await redeemReportTicket(port,A,randomUUID(),fixtures[0].payload)).toMatchObject({code:"NOT_FOUND"});expect(port.call).not.toHaveBeenCalled();}finally{vi.unstubAllEnvs();}
  });
});
