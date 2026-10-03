import "server-only";
import { createSupabaseServerClient } from "../db/supabaseServer";
import type { CampaignStore, CampaignResult } from "./service";
export function createCampaignStore():CampaignStore {
  const db=createSupabaseServerClient();
  return {async call(action,user,data={}){const r=await db.rpc("growth_campaign",{p_action:action,p_user:user,p_data:data});return !r.error&&r.data?.ok===true?r.data as CampaignResult:{ok:false};}};
}
