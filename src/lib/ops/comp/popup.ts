import { NextResponse, type NextRequest } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { AccountPort } from "../../account/handler";
import { accountSession } from "../../account/policy";
import { withDeadline } from "../../network/withDeadline";
import { giftEventPublicView, signupPublicView } from "../config";
import { signupState } from "../gift/service";
import type { OpsStore } from "../generation/sinks";
import { opsOriginAllowed } from "../origin";
import type { PopupComp } from "./popupSelect";

/** 보상 캠페인 저장소(service_role, ops_comp_campaign). 환경이 없으면 STORAGE_UNAVAILABLE. */
export function compCampaignStore(db: SupabaseClient | null): OpsStore {
  return {
    async call(action, data = {}) {
      if (!db) return { ok: false, code: "STORAGE_UNAVAILABLE" };
      try {
        const r = await withDeadline(async signal => await db.rpc("ops_comp_campaign", { p_action: action, p_data: data }).abortSignal(signal), 10_000);
        return !r.error && r.data && typeof r.data === "object" && !Array.isArray(r.data) ? r.data as Record<string, unknown> : { ok: false, code: "STORAGE_FAILED" };
      } catch { return { ok: false, code: "STORAGE_FAILED" }; }
    },
  };
}

/**
 * 메인·상품 화면 팝업 상태(최종 A 14). GET /auth/event-popup.
 * - 공개 이벤트 정보(기간·서버 시각)는 누구에게나. 보상 이용권 정보는 로그인한 회원 본인에게만(서버 지급 기록 기준, 화면이 보낸 값은 받지 않는다).
 * - 읽기만 한다: 보상 지급(ops_comp 'sync')·만료 처리를 부르지 않는다.
 */
/** signup(F): 가입 이용권 저장소(ops_signup) — 캠페인 켜짐/꺼짐과 그 회원의 가입 이용권. 없으면 가입 팝업 없음. */
export async function handleEventPopup(request: NextRequest, port: AccountPort, campaign: OpsStore, env: Readonly<Record<string, string | undefined>> = process.env, now = Date.now(), signup?: OpsStore): Promise<NextResponse> {
  const json = (body: object, status = 200) => port.finish(NextResponse.json(body, { status, headers: { "Cache-Control": "private, no-store", Vary: "Cookie", "Referrer-Policy": "no-referrer" } }));
  if (request.method !== "GET") return json({}, 405);
  if (!opsOriginAllowed(request, env)) return json({ ok: false }, 403);
  const base = giftEventPublicView(env, now);
  try {
    const user = await port.currentUser();
    const snapshot = user ? await port.read(user) : null;
    const member = Boolean(user && snapshot && accountSession(user, snapshot).status === "member");
    const st = signup ? await signupState(signup, member ? user!.id : null, now) : { on: false, mine: null };
    const view = signupPublicView(st.on, env, now), event = { ...base, signup: view };
    if (!member) return json({ ok: true, member: false, comp: null, event, signup: { active: view.active, mine: null } });
    const r = await campaign.call("popup", { userId: user!.id });
    const comp: PopupComp | null = r.ok === true && (r.tier === "A" || r.tier === "B") && typeof r.unused === "number" && r.unused > 0 && typeof r.expiresAt === "string" && Date.parse(r.expiresAt) > now
      ? { tier: r.tier, quantity: typeof r.quantity === "number" ? r.quantity : r.unused, unused: r.unused, expiresAt: new Date(r.expiresAt).toISOString() } : null;
    return json({ ok: true, member: true, comp, event, signup: { active: view.active, mine: st.mine } });
  } catch { return json({ ok: true, member: false, comp: null, event: base }); }
}
