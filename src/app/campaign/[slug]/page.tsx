import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { notFound } from "next/navigation";
import { bookExperiencePublicEnabled } from "../../../lib/book/publicGate";
import { accountPublicEnabled } from "../../../lib/account/gate";
export const dynamic="force-dynamic";
export const metadata={robots:{index:false,follow:false},referrer:"no-referrer" as const};
export default async function Page({params,searchParams}:{params:Promise<{slug:string}>;searchParams:Promise<Record<string,string|string[]|undefined>>}){
  if(!bookExperiencePublicEnabled()||!accountPublicEnabled())notFound();
  const {createCampaignStore}=await import("../../../lib/growth/supabase");
  const {campaignPresentation}=await import("../../../lib/growth/service");
  const {campaignUtm}=await import("../../../lib/growth/model");
  const {createAccountPort}=await import("../../../lib/account/supabase");
  const {CampaignLanding}=await import("../../../components/growth/CampaignLanding");
  const c=await campaignPresentation(createCampaignStore(),(await params).slug);if(!c)notFound();
  const auth=createAccountPort(new NextRequest("https://gyeolreport.com/campaign",{headers:await headers()}));
  return <CampaignLanding campaign={c} utm={campaignUtm(await searchParams)} member={!!await auth?.currentUser()} />;
}
