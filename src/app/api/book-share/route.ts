import { NextRequest } from "next/server";
import { bookExperiencePublicEnabled } from "../../../lib/book/publicGate";
import { accountPublicEnabled } from "../../../lib/account/gate";
export async function POST(request: NextRequest) {
  if (!bookExperiencePublicEnabled() || !accountPublicEnabled()) return new Response(null, { status: 404 });
  const { createAccountPort } = await import("../../../lib/account/supabase");
  const { createLibraryPort } = await import("../../../lib/library/supabase");
  const { prepareBookShare } = await import("../../../lib/book/shareServer");
  const auth = createAccountPort(request);
  // hotfix-share: 추천(referral) 저장소를 넘기지 않는다 — 공유 링크는 책 주인 확인 + report_share_links만으로 만든다.
  return auth ? prepareBookShare(request, auth, createLibraryPort()) : new Response(null, { status: 503 });
}
