import { NextRequest } from "next/server";
import { bookExperiencePublicEnabled } from "../../../lib/book/publicGate";
import { accountPublicEnabled } from "../../../lib/account/gate";
export async function POST(request:NextRequest){
  if(!bookExperiencePublicEnabled()||!accountPublicEnabled())return new Response(null,{status:404});
  const {createAccountPort}=await import("../../../lib/account/supabase");
  const {createCampaignStore}=await import("../../../lib/growth/supabase");
  const {captureCampaign}=await import("../../../lib/growth/service");
  const auth=createAccountPort(request);return auth?captureCampaign(request,auth,createCampaignStore()):new Response(null,{status:503});
}
