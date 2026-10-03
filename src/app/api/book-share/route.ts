import { NextRequest } from "next/server";
import { bookExperiencePublicEnabled } from "../../../lib/book/publicGate";
import { accountPublicEnabled } from "../../../lib/account/gate";
export async function POST(request: NextRequest) {
  if (!bookExperiencePublicEnabled() || !accountPublicEnabled()) return new Response(null, { status: 404 });
  const { createAccountPort } = await import("../../../lib/account/supabase");
  const { createLibraryPort } = await import("../../../lib/library/supabase");
  const { prepareBookShare } = await import("../../../lib/book/shareServer");
  const auth = createAccountPort(request);
  return auth ? prepareBookShare(request, auth, createLibraryPort()) : new Response(null, { status: 503 });
}
