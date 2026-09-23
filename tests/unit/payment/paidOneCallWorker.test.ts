import { PGlite } from "@electric-sql/pglite";
import { readFileSync, readdirSync } from "node:fs";
import { beforeAll, beforeEach, afterAll, afterEach, expect, it, vi } from "vitest";
import { confirmPaidReport, runPaidReportJob } from "../../../src/lib/payment/paidReportReliability";
import type { ReliabilityResult, ReliabilityStore } from "../../../src/lib/payment/paidReportReliabilityStore";
import * as dispatcher from "../../../src/lib/report-generation/productGenerationDispatcher";
import { createAnnualCommerceAcceptance } from "../../../src/lib/payment/annualPurchasePolicy";
const products = ["saju_mbti_full", "career_money_study", "love_marriage_child", "saju_mbti_compatibility", "major_fortune", "annual_fortune"];
const person = { name: "김도윤", birthDate: "1996-12-06", birthTime: "14:15", gender: "MALE", mbtiType: "ENTJ", birthTimeUnknown: false, approximateBirthTimeSlot: "" };
const runtime = (fetchImpl: typeof fetch) => ({ enabled: true as const, config: { enabled: true as const, apiKey: "mock-only", model: "mock-model", fetchImpl } });
let db: PGlite, store: ReliabilityStore;
async function rows(table: string) { return (await db.query(`select * from ${table}`)).rows as Record<string, unknown>[]; }
async function paid(product = "saju_mbti_full") {
  const personB = { ...person, name: "상대", gender: "FEMALE", mbtiType: "INTP", birthDate: "1998-03-14" };
  const payload = { productKey: product, productSlug: product === "saju_mbti_full" ? "saju-mbti-full" : product === "saju_mbti_compatibility" ? "compatibility" : product.replaceAll("_", "-"),
    ...(product === "saju_mbti_compatibility" ? {personA:person, personB, relationshipType:"love"} : {person}),
    userContext:{relationshipStatus:"single",jobStatus:"employee",detailJob:"기획",focusAreas:[]}, productOptions: product === "annual_fortune" ? {selectedYear:"2026"} : {} };
  expect(await store.call("create_order", {paymentOrderId:"po",providerOrderId:"provider",productType:product,provider:"toss",amount:1290,
    inputSnapshot:{reportInputPayload:payload, ...(product === "annual_fortune" ? {annualCommerceAcceptance:createAnnualCommerceAcceptance(2026,new Date("2026-09-24T00:00:00Z"))}: {})}})).toMatchObject({ok:true});
  return confirmPaidReport({orderId:"provider",paymentKey:"mock-key",amount:1290}, store, async()=>({ok:true,confirm:{provider:"toss",paymentKeyReceived:true,orderId:"provider",amount:1290,status:"DONE"}}));
}
beforeAll(async()=>{
  db=new PGlite(); await db.exec("create role anon; create role authenticated; create role service_role;");
  for(const name of readdirSync("supabase/migrations").filter(n=>/^\d{4}_.*\.sql$/.test(n)).sort()) await db.exec(readFileSync(`supabase/migrations/${name}`,"utf8").replace(/^\uFEFF/u,""));
  for(const name of ["supabase/migrations/20260920163924_production_reliability_reconcile.sql","scripts/paid_report_quarantine_recovery_patch.sql","scripts/paid_payment_confirm_recovery_queue_patch.sql","scripts/paid_report_publish_expiry_patch.sql","scripts/paid_report_external_call_guard_patch.sql","scripts/paid_checkout_consent_evidence_patch.sql","scripts/paid_report_one_call_delivery_patch.sql"]) await db.exec(readFileSync(name,"utf8"));
  store={async call(action,data={}){return (await db.query<{value:ReliabilityResult}>("select public.paid_report_reliability($1,$2::jsonb) as value",[action,JSON.stringify(data)])).rows[0].value;}};
},30000);
beforeEach(async()=>{await db.exec("truncate payment_orders cascade");});
afterEach(()=>{vi.restoreAllMocks();expect(fetch).not.toHaveBeenCalled();});
afterAll(async()=>{await db?.close();});
it.each(products)("%s: 100 cron invocations with invalid output cost one call and COMPLETE once",async product=>{
  await paid(product);
  const transport=vi.fn<typeof fetch>(async()=>Response.json({output_text:"{broken",usage:{input_tokens:15,output_tokens:2,total_tokens:17}}));
  for(let i=0;i<100;i++) {await db.exec("update report_generation_jobs set next_retry_at=now()-interval '1 second'");await runPaidReportJob(store,runtime(transport));}
  expect(transport).toHaveBeenCalledTimes(1);
  expect((await rows("paid_report_snapshots"))[0].status).toBe("COMPLETED");
  const attempts=await rows("report_generation_attempts"); expect(attempts).toHaveLength(1);
  expect(attempts[0]).toMatchObject({strategy:"normal_writer",external_calls:[{outcome:"malformed",totalTokens:17}],delivery_audit:{preflight:"pass",fallbackUsed:true,publish:"pass",failureCode:"OPENAI_MALFORMED"}});
  expect((await rows("payment_orders"))[0].status).toBe("paid");
});
it("crash / unknown usage spends no more calls after lease expiry",async()=>{
  await paid(); await store.call("claim_job",{model:"unknown-usage"});
  await db.exec("update report_generation_jobs set lease_until=now()-interval '1 second'");
  const transport=vi.fn<typeof fetch>();
  expect(await runPaidReportJob(store,runtime(transport))).toMatchObject({status:"COMPLETED"});
  expect(transport).not.toHaveBeenCalled();
  expect((await rows("report_generation_attempts"))[1]).toMatchObject({strategy:"deterministic_fallback",external_calls:[]});
});
it("concurrent workers and a failed finish cannot buy another response",async()=>{
  await paid(); let failed=false;
  const transient:ReliabilityStore={call:async(action,data)=>{
    if(action==="finish_job" && !failed){failed=true;return {ok:false,code:"DURABLE_STORAGE_FAILED"};}
    return store.call(action,data);
  }};
  const transport=vi.fn<typeof fetch>(async()=>Response.json({output_text:"{broken"}));
  await Promise.all([runPaidReportJob(transient,runtime(transport)),runPaidReportJob(transient,runtime(transport))]);
  await db.exec("update report_generation_jobs set lease_until=now()-interval '1 second'");
  expect(await runPaidReportJob(store,runtime(transport))).toMatchObject({status:"COMPLETED"});
  expect(transport).toHaveBeenCalledTimes(1);
});
it.each(products)("%s corrupted fallback preflight -> zero calls + attention; explicit admin opens new run",async product=>{
  const order=await paid(product);
  const actual=dispatcher.prepareProductGenerationFromPayload;
  const spy=vi.spyOn(dispatcher,"prepareProductGenerationFromPayload").mockImplementation(async(...args)=>{
    const result=await actual(...args);return result.ok?{...result,evidencePacket:{}}:result;
  });
  const transport=vi.fn<typeof fetch>(async()=>Response.json({output_text:"{bad"}));
  expect(await runPaidReportJob(store,runtime(transport))).toMatchObject({status:"FAILED_REQUIRES_ATTENTION"});
  expect(transport).not.toHaveBeenCalled();
  expect((await rows("paid_report_snapshots"))[0]).toMatchObject({snapshot_json:null});
  expect((await rows("payment_orders"))[0].status).toBe("paid");
  spy.mockRestore();
  expect(await store.call("admin_retry",{reportId:order.reportId})).toMatchObject({ok:true});
  expect(await runPaidReportJob(store,runtime(transport))).toMatchObject({status:"COMPLETED"});
  expect(transport).toHaveBeenCalledTimes(1);
  expect((await rows("report_generation_attempts"))[1]).toMatchObject({run_number:2,attempt:1});
});
it("new patch is idempotent; keeps consent, expiry and audit contracts and filters private metadata",async()=>{
  await paid();
  const claim=await store.call("claim_job"), job=claim.job as Record<string,unknown>;
  await store.call("finish_job",{jobId:job.job_id,token:job.lease_token,success:false,code:"INFRASTRUCTURE_FAILED",delivery:{preflight:"fail",failureCode:"PRIVATE secret",issues:["INVALID","PRIVATE prompt text"],rescueKinds:["CANONICAL_PRESENTATION","PRIVATE"],rawPrompt:"PRIVATE"}});
  const before=await rows("report_generation_attempts");
  expect(JSON.stringify(before[0].delivery_audit)).not.toContain("PRIVATE");
  await db.exec(readFileSync("scripts/paid_report_one_call_delivery_patch.sql","utf8"));
  expect(await rows("report_generation_attempts")).toEqual(before);
  for(const file of ["paid_report_one_call_delivery_verify.sql","paid_report_publish_expiry_verify.sql","paid_report_external_call_guard_verify.sql","paid_checkout_consent_evidence_verify.sql"]) {
    const checked=await db.query<{pass:boolean}>(readFileSync(`scripts/${file}`,"utf8"));expect(checked.rows.every(r=>r.pass),file).toBe(true);
  }
  const final=await db.query<Record<string,unknown>>(readFileSync("scripts/paid_report_production_postflight_single_result.sql","utf8"));
  expect(final.rows.filter(row=>row.pass === false)).toEqual([]);
  expect(final.rows.find(row=>row.category === "POSTFLIGHT_00_SUMMARY")?.detail).toMatch(/failed=0/);
});
