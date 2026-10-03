import { NextRequest } from "next/server";
import { bookExperiencePublicEnabled } from "../../../lib/book/publicGate";
import { accountPublicEnabled } from "../../../lib/account/gate";
export async function POST(request: NextRequest) {
  if (!bookExperiencePublicEnabled() || !accountPublicEnabled()) return new Response(null, {status:404});
  const { createAccountPort } = await import("../../../lib/account/supabase");
  const { createReferralStore } = await import("../../../lib/referrals/supabase");
  const { captureReferral } = await import("../../../lib/referrals/service");
  const auth = createAccountPort(request);
  return auth ? captureReferral(request,auth,createReferralStore()) : new Response(null,{status:503});
}
