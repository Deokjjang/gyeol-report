import { NextRequest } from "next/server";
import { bookExperiencePublicEnabled } from "../../../lib/book/publicGate";
import { accountPublicEnabled } from "../../../lib/account/gate";
export async function POST(request: NextRequest) {
  if (!bookExperiencePublicEnabled() || !accountPublicEnabled()) return new Response(null, { status: 404 });
  const { createAccountPort } = await import("../../../lib/account/supabase");
  const { createLibraryPort } = await import("../../../lib/library/supabase");
  const { prepareBookShare } = await import("../../../lib/book/shareServer");
  const { shareFailureAlarm } = await import("../../../lib/ops/notify/views");
  const auth = createAccountPort(request);
  // 운영 Q 추가: 4xx·5xx는 응답 뒤 기록 → 10분 3번이면 처리 봇 「🚨 공유 실패 N건」(같은 원인 1시간 1번).
  if (!auth) { shareFailureAlarm(503, null); return new Response(null, { status: 503 }); }
  // hotfix-share: 추천(referral) 저장소를 넘기지 않는다 — 공유 링크는 책 주인 확인 + report_share_links만으로 만든다.
  return prepareBookShare(request, auth, createLibraryPort(), undefined, false, shareFailureAlarm);
}
