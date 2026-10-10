import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import type { AccountPort } from "../account/handler";
import { ACCOUNT_POLICY_VERSIONS, accountSession } from "../account/policy";
import { isProductPreviewSnapshot } from "../report-generation/productPreviewSnapshot";
import { validateBookPublication } from "../book/storedReport";
import { BOOK_SHARE_HEADERS } from "../book/shareServer";
import type { BookShareModel } from "../book/shareModel";
import { SHARE_TOKEN_PATTERN } from "../sharing/reportShareMetadata";
import type { TicketStore } from "../tickets/service";
import type { ReliabilityStore } from "../payment/paidReportReliabilityStore";
import { isPublicSameOrigin } from "../account/origin";

export type ReferralResult = { ok: boolean; attributed?: boolean; rewardAvailable?: boolean; launchEvent?: boolean; items?: Array<{ reportId: string; snapshot: unknown }>; snapshot?: unknown; referred?: boolean; inviter?: boolean };
export type ReferralStore = { call(action: string, user: string | null, data?: Record<string, unknown>): Promise<ReferralResult> };
export const REFERRAL_TOKEN = /^rf_[A-Za-z0-9_-]{43}$/;
export const referralHash = (value: string) => createHash("sha256").update(value).digest("hex");
export const referralCookie = (local: boolean) => local ? "gyeol-local-referral" : "__Host-gyeol-referral";
export const REFERRAL_EVENTS = ["referral_link_created", "referral_landing_opened", "referral_cta_clicked", "referral_attributed", "referral_referred_ticket_granted", "referral_qualified", "referral_inviter_ticket_granted"] as const;
export function validReferralSnapshot(snapshot: unknown) {
  return isProductPreviewSnapshot(snapshot) && snapshot.access.mode === "paid" && snapshot.access.isPaid && snapshot.access.isUnlocked
    && validateBookPublication(snapshot.productType, snapshot.draft, snapshot.evidencePacket).ok;
}
export async function attachReferral(model: BookShareModel, reportId: string, snapshot: unknown, auth: AccountPort, store: ReferralStore): Promise<BookShareModel> {
  const user = await auth.currentUser(), account = user ? await auth.read(user) : null;
  if (!user || !account || accountSession(user, account).status !== "member" || !model.shareToken || !validReferralSnapshot(snapshot)) return model;
  const token = `rf_${randomBytes(32).toString("base64url")}`;
  const result = await store.call("create", user.id, { reportId, snapshot, shareToken: model.shareToken, tokenHash: referralHash(token) });
  return result.ok ? { ...model, referral: { token, url: `${model.shareUrl}?ref=${token}`, mayJoin: false, launchEvent: result.launchEvent } } : model;
}
export async function referralPresentation(model: BookShareModel, token: unknown, auth: AccountPort, store: ReferralStore) {
  if (typeof token !== "string" || !REFERRAL_TOKEN.test(token)) return model;
  const checked = await store.call("inspect", null, { tokenHash: referralHash(token), shareToken: model.shareToken });
  if (!checked.ok || !validReferralSnapshot(checked.snapshot)) return model;
  return { ...model, referral: { token, url: `${model.shareUrl}?ref=${token}`, mayJoin: checked.rewardAvailable !== false && !await auth.currentUser(), launchEvent: checked.launchEvent } };
}
// The only browser mutation is capture. No grant/qualify/user ID fields accepted.
export async function captureReferral(request: NextRequest, auth: AccountPort, store: ReferralStore, local = false) {
  const json = (body: object, status = 200) => auth.finish(NextResponse.json(body, { status, headers: BOOK_SHARE_HEADERS }));
  const url = new URL(request.url); if (local && request.headers.get("host")) url.host = request.headers.get("host")!;
  if (request.method !== "POST" || !(local ? request.headers.get("origin") === url.origin : isPublicSameOrigin(request))) return json({}, 403);
  try {
    const raw = await request.text(); if (raw.length > 512) return json({}, 413);
    const body = JSON.parse(raw);
    if (!body || typeof body !== "object" || Object.keys(body).some(k => !["shareToken", "ref"].includes(k)) || !SHARE_TOKEN_PATTERN.test(body.shareToken) || !REFERRAL_TOKEN.test(body.ref)) return json({}, 400);
    const user = await auth.currentUser();
    if (user) return json({ next: local ? "/dev/book-flow" : "/" });
    const cookie = request.cookies.get(referralCookie(local))?.value;
    // First context wins while its HttpOnly cookie lives; no link replacement/TTL extension.
    const secret = randomBytes(32).toString("hex");
    const data = { tokenHash: referralHash(body.ref), shareToken: body.shareToken, contextHash: referralHash(secret) };
    const checked = await store.call("inspect", null, data);
    if (!checked.ok || checked.rewardAvailable === false || !validReferralSnapshot(checked.snapshot)) return json({ next: local ? "/dev/book-flow" : "/" });
    if (!cookie && !(await store.call("capture", null, data)).ok) return json({}, 503);
    const response = json({ next: local ? "/dev/account?view=login" : "/login" });
    if (!cookie) response.cookies.set(referralCookie(local), secret, { httpOnly: true, secure: !local, sameSite: "lax", path: "/", maxAge: 600 });
    return response;
  } catch { return json({ error: "초대 정보를 확인하지 못했습니다. 다시 시도해 주세요." }, 503); }
}
export async function attributeReferral(store: ReferralStore, user: string, contextHash: string): Promise<ReferralResult> {
  const source = await store.call("context", user, { contextHash });
  if (!source.ok || source.attributed) return source;
  if (!validReferralSnapshot(source.snapshot)) return { ok: false };
  return store.call("attribute", user, { contextHash, versions: ACCOUNT_POLICY_VERSIONS, sourceSnapshot: source.snapshot });
}
export function withReferralAccount(request: NextRequest, auth: AccountPort, store: ReferralStore, local = false): AccountPort {
  const secret = request.cookies.get(referralCookie(local))?.value;
  const contextHash = secret && /^[a-f0-9]{64}$/.test(secret) ? referralHash(secret) : null;
  const attribute = async (user: string) => contextHash ? attributeReferral(store, user, contextHash) : { ok: false };
  return { ...auth,
    async read(user) {
      const result = await auth.read(user);
      if (contextHash) {
        // Callback binds the opaque context to the verified new OAuth identity.
        await store.call("bind", user.id, { contextHash });
        if (result && accountSession(user, result).status === "member") await attribute(user.id);
      }
      return result;
    },
    async consent(user, id, source) {
      const ok = await auth.consent(user, id, source);
      if (ok && contextHash) await attribute(user.id);
      return ok;
    },
  };
}
// Server-only recovery. Validates the EXACT persisted snapshot, then SQL compares it
// again while granting. Never trusts a browser's "complete"/"qualified" assertion.
export async function reconcileReferrals(store: ReferralStore, user: string | null = null) {
  const pending = await store.call("candidates", user);
  if (!pending.ok) return false;
  for (const item of pending.items ?? []) if (validReferralSnapshot(item.snapshot)) {
    if (!(await store.call("qualify", null, item)).ok) return false;
  }
  return true;
}
export function withReferralTickets(tickets: TicketStore, referrals: ReferralStore): TicketStore {
  return { async call(action, user, data) {
    if (["summary", "history", "library"].includes(action)) await reconcileReferrals(referrals, user);
    const result = await tickets.call(action, user, data);
    // publish call has committed, released ticket locks and attached ownership.
    if (result.ok && ["publish", "reverse", "status"].includes(action)) {
      try { await reconcileReferrals(referrals, user); } catch { /* Durable next-visit/background retry. No generation reversal. */ }
    }
    if (action === "summary" && result.ok) {
      const feedback = await referrals.call("feedback", user);
      return { ...result, referralNotice: feedback.referred ? "친구 초대로 리포트 이용권 1장을 받았습니다." : feedback.inviter ? "친구가 첫 책을 완성해 이용권 1장이 추가되었습니다." : null };
    }
    return result;
  } };
}
export function withReferralPublication(paid: ReliabilityStore, referrals: ReferralStore): ReliabilityStore {
  return { async call(action, data) {
    const result = await paid.call(action, data);
    if (result.ok && action === "finish_job" && data?.success === true) {
      try { await reconcileReferrals(referrals); } catch { /* Durable recovery on next account visit. */ }
    }
    return result;
  } };
}
