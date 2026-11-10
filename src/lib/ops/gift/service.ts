/**
 * 이벤트(P6d-ops 6, 설정값으로 켜고 끔): 결제 1건마다 이용권 1장(P 추가 C: 계정당 상한 없음, 친구 첫 결제 보너스 없음).
 * 결제 화면에서 바로 쓰거나(ops_gift 'spend') 선물 링크로 보낸다. 받은 친구는 정보 화면을 마쳐야 받을 수 있다.
 * 기한(P 추가 D): cfg.ticketExpiresAt — 이번 이벤트는 2026-11-30 23:59:59 KST.
 */
import { createHash, createHmac, randomBytes } from "node:crypto";
import { signupCampaignConfig, type GiftEventConfig } from "../config";
import type { OpsStore } from "../generation/sinks";

export const giftTokenHash = (token: string) => createHash("sha256").update(token).digest("hex");
export function newGiftToken() { const token = randomBytes(24).toString("base64url"); return { token, hash: giftTokenHash(token) }; }
export const validGiftToken = (v: unknown): v is string => typeof v === "string" && /^[A-Za-z0-9_-]{32}$/.test(v);

/** 결제 완료 주문 1건 → 이벤트 이용권(조건이 안 맞으면 issued:false). 같은 주문은 한 번만. */
export async function issueGiftForOrder(gift: OpsStore, paymentOrderId: string, cfg: GiftEventConfig, now = Date.now()) {
  if (!cfg.active) return { ok: true, issued: false, code: "EVENT_OFF" };
  void now;
  return gift.call("issue", { paymentOrderId, start: cfg.start, end: cfg.end, products: cfg.products, expiresAt: cfg.ticketExpiresAt });
}

/** 결제 완료 직후(결제 완료 화면·크론 공통): 이벤트 이용권 발급. 실패해도 결제·발행은 그대로다. */
export async function afterPaidOrder(gift: OpsStore, paymentOrderId: string, cfg: GiftEventConfig, now = Date.now()) {
  try { return { issued: await issueGiftForOrder(gift, paymentOrderId, cfg, now) }; }
  catch { return null; }
}

/** 이용권 지갑(서재 이용권 줄·결제 화면). SQL ops_gift('wallet'). */
/** expiresAt = 가장 빠른 기한(서재 한 줄) · usableExpiresAt = 결제 화면에서 쓸 수 있는 이용권 중 가장 빠른 기한(먼저 쓰는 장). */
/** giftExpiresAt(F) = 선물할 수 있는 이용권 중 가장 빠른 기한(가입 이용권 제외 — 선물하기 창의 「○월 ○일까지」). */
export type TicketWallet = { ledger: number; giftable: number; usable: number; total: number; expiresAt: string | null; usableExpiresAt: string | null; giftExpiresAt: string | null; sent: number; recipients: number };
export async function readWallet(gift: OpsStore, userId: string): Promise<TicketWallet | null> {
  const r = await gift.call("wallet", { userId });
  if (!r.ok) return null;
  const n = (v: unknown) => (Number.isInteger(v) && (v as number) >= 0 ? (v as number) : 0);
  return { ledger: n(r.ledger), giftable: n(r.giftable), usable: n(r.usable), total: n(r.total), expiresAt: typeof r.expiresAt === "string" ? r.expiresAt : null, usableExpiresAt: typeof r.usableExpiresAt === "string" ? r.usableExpiresAt : null, giftExpiresAt: typeof r.giftExpiresAt === "string" ? r.giftExpiresAt : null, sent: n(r.sent), recipients: n(r.recipients) };
}

/**
 * F: 신규 가입 이용권. 지급 기록에는 「로그인 제공자 + 제공자 사용자 id」의 HMAC만 남긴다(원문 id·이메일·계정 id 없음).
 * 열쇠는 서버 전용 비밀값 REPORT_ADMIN_SECRET에서 용도 이름으로 파생한다(덕짱님 결정 2026-11-10 — 새 env 없음, 텔레그램 웹훅 비밀값과 같은 방식).
 * 그 비밀값을 바꾸면 예전 기록과 대조되지 않는다(탈퇴 후 재가입자가 한 번 더 받을 수 있다). 비밀값이나 제공자 id가 없으면 null → 지급하지 않는다.
 */
export const SIGNUP_HASH_LABEL = "gyeol-signup-grant-v1";
export function signupProviderHash(provider: string, providerUserId: string | null | undefined, env: Readonly<Record<string, string | undefined>> = process.env): string | null {
  const secret = env.REPORT_ADMIN_SECRET;
  if (!secret || (provider !== "kakao" && provider !== "google") || typeof providerUserId !== "string" || !/^[A-Za-z0-9._:@-]{1,200}$/.test(providerUserId)) return null;
  const key = createHmac("sha256", secret).update(SIGNUP_HASH_LABEL).digest();
  return createHmac("sha256", key).update(`${provider}:${providerUserId}`).digest("hex");
}
export type SignupGrant = { issued: boolean; code: string; status: string | null; expiresAt: string | null };
/**
 * 가입 완료 직후(서버 /auth/profile 첫 저장) 자동 지급. 같은 요청이 두 번 와도 1장(SQL 계정 잠금·유일 색인).
 * 기간 밖·꺼짐·기존 회원·이미 받은 해시면 issued:false. 저장소 오류는 한 번 다시 부르고, 그래도면 null(가입은 그대로 끝난다).
 */
export async function grantSignupTicket(signup: OpsStore, user: { id: string; provider: string; providerUserId?: string | null }, env: Readonly<Record<string, string | undefined>> = process.env, now = Date.now()): Promise<SignupGrant | null> {
  const cfg = signupCampaignConfig(env, now);
  if (!cfg.inWindow) return { issued: false, code: "NOT_IN_PERIOD", status: null, expiresAt: null };
  const providerHash = signupProviderHash(user.provider, user.providerUserId, env);
  if (!providerHash) return { issued: false, code: "HASH_UNAVAILABLE", status: null, expiresAt: null };
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const r = await signup.call("grant", { userId: user.id, providerHash, start: cfg.start, end: cfg.end, days: cfg.days, products: cfg.products });
      if (r.ok === true) return { issued: r.issued === true, code: String(r.code ?? (r.issued ? "ISSUED" : "")), status: typeof r.status === "string" ? r.status : null, expiresAt: typeof r.expiresAt === "string" ? new Date(r.expiresAt).toISOString() : null };
      if (r.code !== "STORAGE_FAILED" && r.code !== "STORAGE_UNAVAILABLE") return null;
    } catch { /* 한 번 더 */ }
  }
  return null;
}
/** 가입 이용권 지급 켜짐/꺼짐(DB). 공개 화면(띠·/free)은 30초 동안 같은 값을 쓴다. 못 읽으면 켜짐으로 본다(지급 자체는 SQL이 다시 확인한다). */
let onCache: { at: number; on: boolean } | null = null;
export async function signupGrantOn(signup: OpsStore, now = Date.now()): Promise<boolean> {
  if (onCache && now - onCache.at < 30_000) return onCache.on;
  try {
    const r = await signup.call("status", {});
    if (r.ok === true && typeof r.on === "boolean") { onCache = { at: now, on: r.on }; return r.on; }
  } catch { /* 켜짐으로 */ }
  return true;
}
export function resetSignupOnCache() { onCache = null; }
/** 그 회원의 가입 이용권(팝업·/free). mine = 안 쓴 장이 있으면 기한. */
export async function signupState(signup: OpsStore, userId: string | null, now = Date.now()): Promise<{ on: boolean; mine: { status: string; expiresAt: string } | null }> {
  try {
    const r = await signup.call("state", userId ? { userId } : {});
    if (r.ok !== true) return { on: true, mine: null };
    const m = r.mine as { status?: unknown; expiresAt?: unknown } | null;
    const mine = m && typeof m.status === "string" && typeof m.expiresAt === "string" ? { status: Date.parse(m.expiresAt) <= now && m.status === "available" ? "expired" : m.status, expiresAt: new Date(m.expiresAt).toISOString() } : null;
    return { on: r.on !== false, mine };
  } catch { return { on: true, mine: null }; }
}
