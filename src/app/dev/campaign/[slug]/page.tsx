import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { notFound } from "next/navigation";
import { localAccountAllowed } from "../../../../lib/account/gate";
export const dynamic="force-dynamic";
export const metadata={robots:{index:false,follow:false},referrer:"no-referrer" as const};
export default async function Page({params,searchParams}:{params:Promise<{slug:string}>;searchParams:Promise<Record<string,string|string[]|undefined>>}){
  const request=new NextRequest("http://localhost/dev/campaign",{headers:await headers()});if(!localAccountAllowed(request))notFound();
  const {localCampaignStore}=await import("../../../../lib/growth/localReview");
  const {campaignPresentation}=await import("../../../../lib/growth/service");
  const {campaignUtm}=await import("../../../../lib/growth/model");
  const {createLocalAccountPort}=await import("../../../../lib/account/localReview");
  const {CampaignLanding}=await import("../../../../components/growth/CampaignLanding");
  const store=await localCampaignStore(),c=store?await campaignPresentation(store,(await params).slug):null;if(!c)notFound();
  return <CampaignLanding local campaign={c} utm={campaignUtm(await searchParams)} member={!!await createLocalAccountPort(request)?.currentUser()} />;
}
