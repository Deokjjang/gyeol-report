import { NextResponse, type NextRequest } from "next/server";
import { isPublicSameOrigin } from "../../../lib/account/origin";
import { FUNNEL_SOURCE_COOKIE, funnelTag, isFunnelStep, MEMBER_FUNNEL_STEPS, parseFunnelSource, SERVER_FUNNEL_STEPS, TEST_BROWSER_COOKIE } from "../../../lib/analytics/funnelModel";

/**
 * F 퍼널 익명 집계: POST {step, source, campaign, content} → 「날짜 × 단계 × 유입」 칸 +1(ops_funnel 'hit'). 응답은 늘 204(본문 없음).
 * 유입은 「유입 표시」 쿠키(처음 유입, 30일)를 먼저 쓴다. 서버만 세는 단계(신규 가입·가입 이용권·무료 책)는 받지 않는다.
 * 저장하지 않는 것: 사용자 id·IP·쿠키 식별자. 같은 단계 1번은 브라우저 세션 저장소가 맡는다.
 * 시험 제외: 「시험」 브라우저 표시가 있으면 세지 않는다. 회원 단계는 로그인 계정이 시험 계정(관리자·누나 계정 + DB 「시험 계정 표」)이면 세지 않고 표시를 남긴다.
 */
export const dynamic = "force-dynamic";
const done = () => new NextResponse(null, { status: 204, headers: { "cache-control": "no-store" } });
export async function POST(request: NextRequest) {
  if (!isPublicSameOrigin(request)) return new NextResponse(null, { status: 403 });
  try {
    const raw = await request.text();
    if (raw.length > 512) return done();
    const b = JSON.parse(raw) as Record<string, unknown>;
    // 서버만 세는 단계(신규 가입·가입 이용권·무료 책)는 받지 않는다(두 번 세지 않게).
    if (!b || typeof b !== "object" || !isFunnelStep(b.step) || SERVER_FUNNEL_STEPS.includes(b.step)) return done();
    if (request.cookies.get(TEST_BROWSER_COOKIE)?.value === "1") return done();
    if (MEMBER_FUNNEL_STEPS.includes(b.step) && request.cookies.getAll().some(c => c.name.startsWith("sb-"))) {
      const { createAccountPort } = await import("../../../lib/account/supabase");
      const { liveTestAccountIds } = await import("../../../lib/ops/notify/deps");
      const user = await createAccountPort(request)?.currentUser().catch(() => null);
      if (user && (await liveTestAccountIds()).has(user.id.toLowerCase())) {
        const r = done(); r.cookies.set(TEST_BROWSER_COOKIE, "1", { httpOnly: true, sameSite: "lax", secure: true, path: "/", maxAge: 365 * 86_400 }); return r;
      }
    }
    const { createOpsStores } = await import("../../../lib/ops/store");
    // 유입: 「유입 표시」 쿠키(처음 유입)가 있으면 그 값, 없으면 화면이 보낸 값(정리).
    const src = parseFunnelSource(request.cookies.get(FUNNEL_SOURCE_COOKIE)?.value) ?? { source: funnelTag(b.source, 40), campaign: funnelTag(b.campaign, 64), content: funnelTag(b.content, 64) };
    await createOpsStores().funnel.call("hit", { step: b.step, ...src });
  } catch { /* 집계 실패는 화면에 영향 없음 */ }
  return done();
}
