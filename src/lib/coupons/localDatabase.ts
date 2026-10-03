import "server-only";
import { readFile } from "node:fs/promises";
import type { PGlite } from "@electric-sql/pglite";
import { createTicketTestDatabase,localTicketUserId } from "../tickets/localDatabase";
import { confirmTossPayment } from "../payment/tossConfirmClient";
import { readPublishedReport } from "../payment/paidReportReliability";
import { validateBookPublication } from "../book/storedReport";
import type { ReliabilityStore, ReliabilityResult } from "../payment/paidReportReliabilityStore";
import type { LibraryRow } from "../library/model";
import type { LibraryPort } from "../library/server";
import { confirmCouponOrder, type CouponStore, type CouponResult, type CouponIdentity } from "./service";

export async function createCouponTestDatabase() {
  const db=await createTicketTestDatabase();
  await db.exec(await readFile("supabase/migrations/20261003123157_v4_coupon_foundation.sql","utf8"));
  return db;
}
export const sqlCouponStore = (db: PGlite): CouponStore => ({ async call(action,identity,data={}) {
  return (await db.query<{result:CouponResult}>("select public.report_coupons($1,$2,$3,$4::jsonb) result",[action,identity.user,identity.actor,JSON.stringify(data)])).rows[0].result;
} });
export const sqlCouponReliability = (db: PGlite): ReliabilityStore => ({async call(action,data={}){
  return (await db.query<{result:ReliabilityResult}>("select public.paid_report_reliability($1,$2::jsonb) result",[action,JSON.stringify(data)])).rows[0].result;
}});
// Explicit fixture setup only; NEVER called by signup, login, quote or checkout.
export async function seedCouponFixtures(db:PGlite) {
  for(const [code,name,type,value,member,products,expired] of [
    ["GYEOL300","300원 할인","fixed_amount",300,false,[],false],
    ["20PERCENT","20% 할인","percentage",20,false,[],false],
    ["CAREER_ONLY","커리어 300원 할인","fixed_amount",300,false,["career_money_study"],false],
    ["EXPIRED","기간이 지난 쿠폰","fixed_amount",300,false,[],true],
    ["MEMBER_ONLY","회원 300원 할인","fixed_amount",300,true,[],false],
  ] as const) await db.query("insert into coupon_definitions(code,name,discount_type,discount_value,member_only,product_ids,starts_at,expires_at,per_user_limit,campaign_ref) values($1,$2,$3,$4,$5,$6,now()-interval '2 days',now()+($7||' days')::interval,20,'LOCAL_TEST_ONLY') on conflict(code) do nothing",[code,name,type,value,member,products,expired?-1:7]);
}
const state=globalThis as typeof globalThis & {__couponSqlReview?:Promise<PGlite>};
export async function localCouponDatabase() {
  if(!["test","development"].includes(process.env.NODE_ENV)) return null;
  return state.__couponSqlReview??=createCouponTestDatabase();
}
export async function localCouponStore():Promise<CouponStore|null> {
  const db=await localCouponDatabase(); if(!db)return null;
  return {async call(action,identity,data={}){return db.transaction(async tx=>{
    if(identity.user)await tx.query("insert into auth.users(id) values($1) on conflict do nothing",[identity.user]);
    await tx.exec("set local role service_role");
    return (await tx.query<{result:CouponResult}>("select public.report_coupons($1,$2,$3,$4::jsonb) result",[action,identity.user,identity.actor,JSON.stringify(data)])).rows[0].result;
  });}};
}
export async function localCouponFixture(identity:CouponIdentity) {
  const db=await localCouponDatabase(); if(!db)return {ok:false};
  await seedCouponFixtures(db);
  if(identity.user){const store=await localCouponStore();await store!.call("claim",identity,{code:"MEMBER_ONLY"});}
  return {ok:true};
}
// Mandatory fetch injection. No real Toss keys/SDK/network or public endpoint.
export async function completeLocalCoupon(store:CouponStore,identity:CouponIdentity,orderId:string) {
  if(!["test","development"].includes(process.env.NODE_ENV))return {ok:false,code:"NOT_FOUND"};
  const result=await confirmCouponOrder(store,identity,orderId,`local-mock-${orderId}`,payment=>confirmTossPayment({
    ...payment,expectedAmount:payment.amount,secretKey:"LOCAL_MOCK_ONLY",fetchImpl:async(_url,init)=>{
      const body=JSON.parse(String(init.body));
      return {ok:true,status:200,json:async()=>({orderId:body.orderId,totalAmount:body.amount,currency:"KRW",status:"DONE",approvedAt:new Date().toISOString()})};
    },
  }));
  if(!result.ok||!result.reportId)return result;
  const db=await localCouponDatabase(); if(!db)return {ok:false};
  const {runLocalBookJob}=await import("../book/localReview");
  // The existing paid worker owns post-payment generation failure and retries.
  await runLocalBookJob(sqlCouponReliability(db));
  const read=await readLocalCouponReport(identity,result.reportId);
  return read ? {ok:true,reportUrl:`/dev/book-flow/report/${result.reportId}`} : {ok:false,code:"DELIVERY_RECOVERY_PENDING",state:"REDEEMED"};
}
export async function readLocalCouponReport(identity:CouponIdentity,reportId:string) {
  const db=await localCouponDatabase();if(!db)return null;
  const permitted=await db.query("select r.id from coupon_redemptions r join payment_orders o on o.payment_order_id=r.payment_order_id join report_purchase_bindings b on b.order_id=o.payment_order_id left join report_account_links l on l.report_id=o.report_id where (r.actor_key=$1 or l.user_id=$3) and o.report_id=$2 and r.state='REDEEMED' and o.status='paid' and o.deleted_at is null and b.revoked_at is null and l.revoked_at is null",[identity.actor,reportId,identity.user]);
  if(!permitted.rows.length)return null;
  const read=await readPublishedReport(sqlCouponReliability(db),reportId,validateBookPublication);
  return read.ok&&read.status==="COMPLETED"?read.snapshot:null;
}
export async function listLocalCouponBooks(user:string):Promise<LibraryRow[]> {
  const db=await localCouponDatabase();if(!db)return [];
  return (await db.query<{items:LibraryRow[]}>("select public.list_account_reports($1) items",[user])).rows[0].items;
}
export function withLocalCouponLibrary(existing:LibraryPort):LibraryPort {
  const order=async(id:string)=>{const db=await localCouponDatabase();return db?(await db.query<{id:string}>("select r.payment_order_id id from coupon_redemptions r join payment_orders o on o.payment_order_id=r.payment_order_id where o.report_id=$1",[id])).rows[0]?.id??null:null;};
  return {...existing,async orderForReport(id){return await existing.orderForReport(id)??await order(id);},async claim(id,user,hash,commit){
    if(!await order(id))return existing.claim(id,user,hash,commit);
    const db=await localCouponDatabase();if(!db)return "unavailable";
    const uid=user?localTicketUserId(user):null;
    if(uid)await db.query("insert into auth.users(id) values($1) on conflict do nothing",[uid]);
    return (await db.query<{state:Awaited<ReturnType<LibraryPort["claim"]>>}>("select public.claim_report_account($1,$2,$3,$4) state",[id,uid,hash,commit])).rows[0].state;
  }};
}
