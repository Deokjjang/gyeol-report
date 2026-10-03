import "server-only";
import { randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import type { AccountPort } from "../account/handler";
import { ACCOUNT_POLICY_VERSIONS, accountSession } from "../account/policy";
import { attributeReferral, referralCookie, referralHash, validReferralSnapshot, type ReferralStore } from "../referrals/service";
import type { TicketStore } from "../tickets/service";
import { BOOK_SHARE_HEADERS } from "../book/shareServer";
import { CAMPAIGN_SLUG, campaignUtm, type CampaignPresentation } from "./model";
import { getReportProductCatalog } from "../payment/reportProductCatalog";
export type CampaignResult = { ok: boolean; settled?: boolean; maxAge?: number; notice?: string | null;
  presentation?: CampaignPresentation; contexts?: Array<{kind:"campaign"|"referral";hash:string;acquiredAt:string}>;
  items?: Array<{reportId:string;snapshot:unknown}> };
export type CampaignStore = {call(action:string,user:string|null,data?:Record<string,unknown>):Promise<CampaignResult>};
export const campaignCookie = (local:boolean) => local ? "gyeol-local-campaign" : "__Host-gyeol-campaign";
export async function campaignPresentation(store:CampaignStore,slug:string) {
  if (!CAMPAIGN_SLUG.test(slug)) return null;
  const result=await store.call("presentation",null,{slug});return result.ok ? result.presentation ?? null : null;
}
export async function captureCampaign(request:NextRequest,auth:AccountPort,store:CampaignStore,local=false) {
  const json=(body:object,status=200)=>auth.finish(NextResponse.json(body,{status,headers:BOOK_SHARE_HEADERS}));
  const url=new URL(request.url);if(local&&request.headers.get("host"))url.host=request.headers.get("host")!;
  if(request.method!=="POST"||request.headers.get("origin")!==(local?url.origin:"https://gyeolreport.com"))return json({},403);
  try {
    const raw=await request.text();if(raw.length>2048)return json({},413);
    const b=JSON.parse(raw);
    if(!b||typeof b!=="object"||Array.isArray(b)||Object.keys(b).some(k=>!["slug","utm"].includes(k))||typeof b.slug!=="string"||!CAMPAIGN_SLUG.test(b.slug)
      ||(b.utm!==undefined&&(!b.utm||typeof b.utm!=="object"||Array.isArray(b.utm))))return json({},400);
    const home=local?"/dev/book-flow":"/";
    if(await auth.currentUser())return json({next:home});
    const c=await campaignPresentation(store,b.slug);
    if(!c?.active)return json({next:home,unavailable:true});
    const candidate=request.cookies.get(campaignCookie(local))?.value;
    const cookie=candidate&&/^[a-f0-9]{64}$/.test(candidate)&&(await store.call("context_valid",null,{contextHash:referralHash(candidate)})).ok?candidate:null;
    const secret=randomBytes(32).toString("hex");
    const captured=cookie ? {ok:true,maxAge:600} : await store.call("capture",null,{slug:b.slug,contextHash:referralHash(secret),utm:campaignUtm(b.utm??{})});
    if(!captured.ok)return json({next:home,unavailable:true});
    const response=json({next:local?"/dev/account?view=login":"/login"});
    if(!cookie)response.cookies.set(campaignCookie(local),secret,{httpOnly:true,secure:!local,sameSite:"lax",path:"/",maxAge:captured.maxAge});
    return response;
  }catch{return json({error:"캠페인 참여 상태를 확인하지 못했습니다. 다시 시도해 주세요."},503);}
}
export async function settleAcquisition(campaigns:CampaignStore,referrals:ReferralStore,user:string,hashes:{campaignHash?:string;referralHash?:string},consented:boolean) {
  const choices=await campaigns.call("contexts",user,hashes);
  if(!choices.ok||choices.settled)return choices;
  // Within the supplied server contexts: oldest valid first. Once committed, the
  // SQL authority junction is immutable even across tabs/old callback versions.
  for(const context of choices.contexts??[]) {
    if(context.kind==="referral") {
      const source=await referrals.call("context",user,{contextHash:context.hash});
      if(!source.ok||(!source.attributed&&!validReferralSnapshot(source.snapshot)))continue;
      const result=consented?await attributeReferral(referrals,user,context.hash):await referrals.call("bind",user,{contextHash:context.hash});
      if(result.ok)return result;
    }else{
      const result=await campaigns.call(consented?"attribute":"bind",user,{contextHash:context.hash,versions:ACCOUNT_POLICY_VERSIONS,
        products:getReportProductCatalog().filter(p=>p.isPurchasable).map(p=>({productType:p.productType,originalAmount:p.amount}))});
      if(result.ok)return result;
    }
  }
  return {ok:false};
}
export function withAcquisitionAccount(request:NextRequest,auth:AccountPort,campaigns:CampaignStore,referrals:ReferralStore,local=false):AccountPort {
  const hash=(name:string)=>{const s=request.cookies.get(name)?.value;return s&&/^[a-f0-9]{64}$/.test(s)?referralHash(s):undefined;};
  const hashes={campaignHash:hash(campaignCookie(local)),referralHash:hash(referralCookie(local))};
  const settle=(user:string,consented:boolean)=>settleAcquisition(campaigns,referrals,user,hashes,consented);
  return {...auth,async read(user){const snapshot=await auth.read(user);if(hashes.campaignHash||hashes.referralHash)await settle(user.id,!!snapshot&&accountSession(user,snapshot).status==="member");return snapshot;},
    async consent(user,id,source){const ok=await auth.consent(user,id,source);if(ok&&(hashes.campaignHash||hashes.referralHash))await settle(user.id,true);return ok;}};
}
export async function reconcileCampaigns(store:CampaignStore,user:string|null=null) {
  const pending=await store.call("candidates",user);if(!pending.ok)return false;
  for(const item of pending.items??[])if(validReferralSnapshot(item.snapshot)&&!(await store.call("publish",null,item)).ok)return false;
  return true;
}
export function withCampaignTickets(tickets:TicketStore,campaigns:CampaignStore):TicketStore {
  return {async call(action,user,data){
    if(["summary","history","library"].includes(action))await reconcileCampaigns(campaigns,user);
    const result=await tickets.call(action,user,data);
    if(result.ok&&["redeem","publish","reverse","status"].includes(action)){try{await reconcileCampaigns(campaigns,user);}catch{/* Durable next-visit retry. */}}
    if(result.ok&&action==="summary")return {...result,campaignNotice:(await campaigns.call("feedback",user)).notice??null};
    return result;
  }};
}
