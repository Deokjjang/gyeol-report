import { NextResponse, type NextRequest } from "next/server";
import type { AccountPort } from "../../account/handler";
import { accountSession } from "../../account/policy";
import { compConfig, compSyncArgs } from "../config";
import { compNoticeText } from "../compMessages";
import { opsOriginAllowed } from "../origin";
import type { OpsStores } from "../store";

const kstMonthDay = new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", month: "long", day: "numeric" });

/** 서재 맨 위 보상 안내(P6e-ops). GET /auth/comp: 로그인한 회원 본인만. 서재를 열 때마다 멱등으로 등급 판정·지급을 시도한다(가입 정보를 마친 계정만 지급). */
export async function handleComp(request: NextRequest, port: AccountPort, ops: Pick<OpsStores, "comp">, env: Readonly<Record<string, string | undefined>> = process.env): Promise<NextResponse> {
  const json = (body: object, status = 200) => port.finish(NextResponse.json(body, { status, headers: { "Cache-Control": "private, no-store", Vary: "Cookie", "Referrer-Policy": "no-referrer" } }));
  if (request.method !== "GET") return json({}, 405);
  if (!opsOriginAllowed(request)) return json({}, 403);
  try {
    const user = await port.currentUser();
    const snapshot = user ? await port.read(user) : null;
    if (!user || !snapshot || accountSession(user, snapshot).status !== "member") return json({ ok: false, code: "MEMBER_REQUIRED" }, 401);
    const cfg = compConfig(env);
    const r = await ops.comp.call("sync", { userId: user.id, ...compSyncArgs(cfg) });
    if (!r.ok) return json({ ok: false, code: r.code ?? "STORAGE_FAILED" }, r.code === "COMP_CONFIG_INVALID" ? 200 : 503);
    const tier = r.tier === "A" || r.tier === "B" ? r.tier : null, state = r.state;
    if (!cfg.enabled || !tier || (state !== "granted" && state !== "waiting_profile")) return json({ ok: true, show: false });
    const quantity = tier === "A" ? cfg.aQty : cfg.bQty;
    const granted = state === "granted";
    const until = granted && typeof r.expiresAt === "string" && Number.isFinite(Date.parse(r.expiresAt)) ? `${kstMonthDay.format(new Date(r.expiresAt))}까지` : "";
    const total = granted && typeof r.quantity === "number" ? r.quantity : quantity;
    return json({ ok: true, show: true, tier, state, fresh: r.fresh === true, notice: compNoticeText(tier, state, { quantity: total, until }) });
  } catch { return json({ ok: false, code: "STORAGE_UNAVAILABLE" }, 503); }
}
