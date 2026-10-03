import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { notFound } from "next/navigation";
import { localAccountAllowed } from "../../../../lib/account/gate";
export const dynamic="force-dynamic";
export const metadata={robots:{index:false,follow:false},referrer:"no-referrer" as const};
export default async function Page({params,searchParams}:{params:Promise<{slug:string}>;searchParams:Promise<Record<string,string|string[]|undefined>>}){
  const request=new NextRequest("http://localhost/dev/campaign",{headers:await headers()});if(!localAccountAllowed(request))notFound();
  const {localMeasurementDatabase,sqlMeasurementStore,measurementIdentity}=await import("../../../../lib/analytics/localReview");
  const {campaignView}=await import("../../../../lib/growth/presentation");
  const {campaignUtm}=await import("../../../../lib/growth/model");
  const {createLocalAccountPort}=await import("../../../../lib/account/localReview");
  const {CampaignLanding}=await import("../../../../components/growth/CampaignLanding");
  const db=await localMeasurementDatabase(),c=db?await campaignView(sqlMeasurementStore(db),(await params).slug,await measurementIdentity(request)):null;if(!c)notFound();
  return <CampaignLanding local campaign={c} utm={campaignUtm(await searchParams)} member={!!await createLocalAccountPort(request)?.currentUser()} />;
}
