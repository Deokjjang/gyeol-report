import "server-only";
import { readFile } from "node:fs/promises";
import type { PGlite } from "@electric-sql/pglite";
import type { NextRequest } from "next/server";
import type { AccountPort } from "../account/handler";
import { localReferralDatabase, localReferralStore, localReferralAccount } from "../referrals/localReview";
import { localCouponDatabase } from "../coupons/localDatabase";
import { localTicketUserId } from "../tickets/localDatabase";
import { withAcquisitionAccount, type CampaignStore, type CampaignResult } from "./service";
export const CAMPAIGN_MIGRATION="supabase/migrations/20261003154955_v4_growth_campaign_acquisition.sql";
export async function installCampaignSchema(db:PGlite){await db.exec(await readFile(CAMPAIGN_MIGRATION,"utf8"));}
export function sqlCampaignStore(db:PGlite):CampaignStore{return {async call(action,user,data={}){return db.transaction(async tx=>{
  await tx.exec("set local role service_role");return (await tx.query<{result:CampaignResult}>("select growth_campaign($1,$2,$3::jsonb) result",[action,user,JSON.stringify(data)])).rows[0].result;
});}};}
const root=globalThis as typeof globalThis & {__campaignReview?:Promise<PGlite|null>};
export async function localCampaignDatabase(){
  if(!["development","test"].includes(process.env.NODE_ENV))return null;
  return root.__campaignReview??=(async()=>{const db=await localReferralDatabase();await localCouponDatabase();if(db)await installCampaignSchema(db);return db;})();
}
export async function localCampaignStore():Promise<CampaignStore|null>{const db=await localCampaignDatabase();if(!db)return null;const s=sqlCampaignStore(db);return {call:(a,u,d)=>s.call(a,u?localTicketUserId(u):null,d)};}
export async function localAcquisitionAccount(request:NextRequest,auth:AccountPort){
  const campaigns=await localCampaignStore(),referrals=await localReferralStore(),port=await localReferralAccount(request,auth,false);
  return campaigns&&referrals?withAcquisitionAccount(request,port,campaigns,referrals,true):port;
}
// Explicit local fixture setup only; no production definitions or monetary policy.
export async function seedCampaignFixtures(db:PGlite){
  const coupon=(await db.query<{id:string}>("insert into coupon_definitions(name,discount_type,discount_value,member_only,starts_at,expires_at,campaign_ref) values('검수용 300원 할인','fixed_amount',300,true,now()-interval '1 day',now()+interval '7 days','LOCAL_ACQUISITION_TEST') returning id")).rows[0].id;
  for(const [slug,offer,status,start,end] of [
    ["book-ticket","REPORT_TICKET","ACTIVE",null,null], ["book-coupon","COUPON","ACTIVE",null,null],
    ["book-none","NONE","ACTIVE",null,null], ["book-other","REPORT_TICKET","ACTIVE",null,null],
    ["book-paused","REPORT_TICKET","PAUSED",null,null], ["book-draft","REPORT_TICKET","DRAFT",null,null],
    ["book-ended","REPORT_TICKET","ACTIVE",null,"past"], ["book-future","REPORT_TICKET","SCHEDULED","future",null],
  ])await db.query("insert into growth_campaigns(public_slug,name,message,status,starts_at,ends_at,offer_type,ticket_quantity,coupon_id,utm_allowlist) values($1,'LOCAL_TEST_ONLY','나에게 궁금한 이야기를 한 권으로',$2,case when $3='future' then now()+interval '1 day' else null end,case when $4='past' then now()-interval '1 day' else null end,$5,$6,$7,$8::jsonb) on conflict(public_slug) do nothing",
    [slug,status,start,end,offer,offer==="REPORT_TICKET"?1:null,offer==="COUPON"?coupon:null,JSON.stringify({utm_source:["instagram","meta"],utm_medium:["cpc","social"],utm_campaign:["book-launch"],utm_content:["cover-a","story"],utm_term:["discovery"]})]);
}
