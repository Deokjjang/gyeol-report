import { NextRequest } from "next/server";
import { localAccountAllowed } from "../../../../lib/account/gate";
export async function POST(request: NextRequest) {
  if (!localAccountAllowed(request)) return new Response(null,{status:404});
  const { createLocalAccountPort } = await import("../../../../lib/account/localReview");
  const { localReferralStore } = await import("../../../../lib/referrals/localReview");
  const { captureReferral } = await import("../../../../lib/referrals/service");
  const auth = createLocalAccountPort(request), store = await localReferralStore();
  return auth && store ? captureReferral(request,auth,store,true) : new Response(null,{status:404});
}
