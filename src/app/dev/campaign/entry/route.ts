import { NextRequest } from "next/server";
import { localAccountAllowed } from "../../../../lib/account/gate";
export async function POST(request:NextRequest){
  if(!localAccountAllowed(request))return new Response(null,{status:404});
  const {createLocalAccountPort}=await import("../../../../lib/account/localReview");
  const {localCampaignStore}=await import("../../../../lib/growth/localReview");
  const {captureCampaign}=await import("../../../../lib/growth/service");
  const auth=createLocalAccountPort(request),store=await localCampaignStore();return auth&&store?captureCampaign(request,auth,store,true):new Response(null,{status:503});
}
