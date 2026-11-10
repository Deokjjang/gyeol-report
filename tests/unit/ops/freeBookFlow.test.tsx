// F 흐름: 신규 가입(필수 동의 + 가입 정보 첫 저장) → 가입 이용권 1장(같은 요청 두 번·동시에도 1장) → 그 이용권으로 책 생성(실제 발행 경로, 목업 작가)
// → 책 끝 「무료로 받은 책」 줄. 기존 회원·재가입 미지급. 팝업 선택·시간 이동(캠페인 끝 전후, 1+1 연장 한 설정)·해시. PGlite·외부 호출 0.
import { randomUUID, createHash } from "node:crypto";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { NextRequest } from "next/server";
import { renderToStaticMarkup } from "react-dom/server";
import { handleProfile } from "@/lib/account/profile";
import { ACCOUNT_POLICY_VERSIONS, type AccountIdentity } from "@/lib/account/policy";
import type { AccountPort } from "@/lib/account/handler";
import { grantSignupTicket, readWallet, signupProviderHash, SIGNUP_HASH_LABEL } from "@/lib/ops/gift/service";
import { giftEventConfig, giftEventPublicView, signupCampaignConfig, signupPublicView, SIGNUP_TICKET_DAYS } from "@/lib/ops/config";
import { selectPopup, signupPopupDue, type PopupState } from "@/lib/ops/comp/popupSelect";
import { signupStripVisible } from "@/components/growth/GiftEventCountdown";
import { BookEndNotice, BOOK_END_EVENT_LINE, BOOK_END_SIGNUP_LINE, BOOK_END_CTA } from "@/components/book/BookReading";
import { normalizeReportInputPayload } from "@/lib/report-generation/reportInputAdapter";
import { runTicketPublicationJob } from "@/lib/tickets/publicationWorker";
import { llmDeps, mockTextFor, opsStoreOf, RAW_FULL } from "../../helpers/v5Scenarios";
import { opsNotifySql } from "../../helpers/opsNotify";

const ORIGIN = "https://www.gyeolreport.com";
const T = (iso: string) => Date.parse(iso);
let h: Awaited<ReturnType<typeof opsNotifySql>>;
const consents = Object.entries(ACCOUNT_POLICY_VERSIONS).map(([consent_type, document_version]) => ({ consent_type: consent_type as "terms" | "privacy", document_version, is_agreed: true, required: true, recorded_at: new Date().toISOString() }));
const env = () => ({ GIFT_EVENT_ENABLED: "1", SIGNUP_CAMPAIGN_START: new Date(Date.now() - 3_600_000).toISOString(), GIFT_EVENT_END: new Date(Date.now() + 86_400_000).toISOString(), REPORT_ADMIN_SECRET: "test-secret" });
const signup = () => h.rpcOf("ops_signup");
const accountStore = () => ({ call: (action: string, user: string, data: Record<string, unknown> = {}) => h.rpc("ops_account", action, user, data) });

/** 실제 DB를 읽는 계정 포트(가입 정보는 ops_account로 저장된 값). */
function dbPort(user: AccountIdentity): AccountPort {
  return { authorizationOrigin: "https://supabase.example", currentUser: async () => user,
    read: async () => { const c = await accountStore().call("read", user.id); return { profile: user, consents, contact: c.contact ? { name: String((c.contact as { name: string }).name), email: String((c.contact as { email: string }).email) } : null }; },
    start: async () => null, exchange: async () => true, logout: async () => true, consent: async () => true, finish: r => r };
}
async function consented(user: AccountIdentity) {
  await h.exec("insert into auth.users(id) values($1) on conflict do nothing", [user.id]);
  await h.exec("insert into account_profiles(user_id,display_name,provider) values($1,'회원',$2) on conflict do nothing", [user.id, user.provider]);
}
const profilePost = (user: AccountIdentity, deps: Parameters<typeof handleProfile>[3]) => handleProfile(new NextRequest(`${ORIGIN}/auth/profile`, { method: "POST", headers: { origin: ORIGIN },
  body: JSON.stringify({ requestId: randomUUID(), name: "가입자", email: `${user.id.slice(-6)}@example.com`, emailConfirm: `${user.id.slice(-6)}@example.com` }) }), "profile", dbPort(user), deps);
const depsFor = (e = env()) => ({ ops: accountStore(), audit: async () => true, unlinkKakao: async () => "skipped" as const, deleteUser: async () => true,
  signupGrant: (u: AccountIdentity) => grantSignupTicket(signup(), u, e) });
const uid = () => randomUUID();

beforeAll(async () => { h = await opsNotifySql({ freeBook: true }); }, 240_000);
afterAll(async () => { await h?.db.close(); });
afterEach(() => { vi.useRealTimers(); });

describe("신규 가입 → 이용권 1장 → 책 생성 → 책 끝 줄", () => {
  const user: AccountIdentity = { id: uid(), provider: "kakao", displayName: "가입자", providerUserId: "3801234567" };
  it("가입 정보 첫 저장(가입 완료) 직후 1장, 응답에 팝업용 기한(+7일)·1+1 공개 정보. 같은 요청이 동시에 두 번 와도 1장", async () => {
    await consented(user);
    vi.stubEnv("GIFT_EVENT_ENABLED", "1"); // 운영 설정과 같게(1+1 켜짐)
    const [a, b] = await Promise.all([profilePost(user, depsFor()), profilePost(user, depsFor())]);
    vi.unstubAllEnvs();
    const bodies = [await a.json(), await b.json()];
    for (const body of bodies) expect(body).toMatchObject({ ok: true, joined: true, signupGift: { expiresAt: expect.any(String), event: { phase: "during" } } });
    const rows = await h.all<{ kind: string; status: string }>("select kind,status from gift_rewards where owner_user_id=$1", [user.id]);
    expect(rows).toEqual([{ kind: "signup", status: "available" }]);
    const exp = Date.parse(bodies[0].signupGift.expiresAt);
    expect(Math.round((exp - Date.now()) / 86_400_000)).toBe(SIGNUP_TICKET_DAYS);
    // 다시 저장(가입 정보 수정)은 가입 완료가 아니다 → 지급 요청도 없다.
    const again = await (await profilePost(user, depsFor())).json();
    expect(again).toMatchObject({ ok: true }); expect(again.joined).toBeUndefined(); expect(again.signupGift).toBeUndefined();
    expect(await readWallet(h.rpcOf("ops_gift"), user.id)).toMatchObject({ total: 1, usable: 1, giftable: 0 });
  });
  it("그 이용권으로 책 생성(실제 발행 경로) → 발행 → 책 끝 판정 signup:true, 1+1 기간이면 1+1 줄도", async () => {
    const payload = (() => { const n = normalizeReportInputPayload(RAW_FULL, { now: () => new Date("2026-10-27T03:00:00.000Z") }); if (!n.ok) throw new Error("payload"); return n.value; })();
    const requestId = randomUUID();
    expect(await h.rpc("ops_gift", "spend", { userId: user.id, productType: payload.productKey, requestId })).toMatchObject({ ok: true, moved: true });
    const reportId = `report_${randomUUID().replaceAll("-", "")}`;
    const q = await h.queue.call("enqueue", user.id, { requestId, input: payload, productType: payload.productKey, inputHash: createHash("sha256").update(JSON.stringify(payload)).digest("hex"),
      reportId, policyAt: "2026-10-27T03:00:00.000Z", consentEvidence: { version: "checkout-consent-v1" }, displayName: "가입자" });
    expect(q).toMatchObject({ ok: true });
    const { text } = mockTextFor(payload);
    const { deps } = llmDeps([{ text }]);
    await runTicketPublicationJob(h.queue, undefined, { ...deps, ops: opsStoreOf(h), openAiKey: null });
    const snap = await h.one<{ status: string; ticket_redemption_id: string | null }>("select status,ticket_redemption_id from paid_report_snapshots where report_id=$1", [reportId]);
    expect(snap).toMatchObject({ status: "COMPLETED" }); expect(snap.ticket_redemption_id).toBeTruthy();
    expect(await h.rpc("ops_signup", "book_kind", { reportId })).toEqual({ ok: true, signup: true });
    expect((await h.one<{ status: string }>("select status from gift_rewards where owner_user_id=$1", [user.id])).status).toBe("used_self");
    const html = renderToStaticMarkup(<BookEndNotice view={{ event: true, signup: true }} />);
    expect(html.indexOf(BOOK_END_SIGNUP_LINE)).toBeGreaterThanOrEqual(0);
    expect(html.indexOf(BOOK_END_SIGNUP_LINE)).toBeLessThan(html.indexOf(BOOK_END_EVENT_LINE));
    expect(html).toContain(`>${BOOK_END_CTA}</a>`);
  }, 60_000);
  it("결제 책은 1+1 줄만, 1+1 기간이 아니면 결제 책엔 아무것도 없다(가입 이용권 책은 가입 줄만)", () => {
    const paid = renderToStaticMarkup(<BookEndNotice view={{ event: true, signup: false }} />);
    expect(paid).toContain(BOOK_END_EVENT_LINE); expect(paid).not.toContain(BOOK_END_SIGNUP_LINE);
    expect(renderToStaticMarkup(<BookEndNotice view={{ event: false, signup: false }} />)).toBe("");
    const after = renderToStaticMarkup(<BookEndNotice view={{ event: false, signup: true }} />);
    expect(after).toContain(BOOK_END_SIGNUP_LINE); expect(after).not.toContain(BOOK_END_EVENT_LINE);
  });
  it("결제 책·다른 계정 책은 가입 이용권 책이 아니다(book_kind false)", async () => {
    const p = await h.pay(`fb-paid-${randomUUID().slice(0, 8)}`, null);
    expect(await h.rpc("ops_signup", "book_kind", { reportId: p.report_id })).toEqual({ ok: true, signup: false });
  });
});

describe("기존 회원·재가입은 미지급", () => {
  it("캠페인 시작 전에 동의한 회원이 지금 가입 정보를 마쳐도 미지급(응답에 signupGift 없음)", async () => {
    const old: AccountIdentity = { id: uid(), provider: "google", displayName: "기존", providerUserId: "g-old-1" };
    await h.exec("insert into auth.users(id) values($1)", [old.id]);
    await h.exec("insert into account_profiles(user_id,display_name,provider,created_at) values($1,'기존','google',now()-interval '5 days')", [old.id]);
    const body = await (await profilePost(old, depsFor())).json();
    expect(body).toMatchObject({ ok: true, joined: true }); expect(body.signupGift).toBeUndefined();
    expect((await h.one<{ n: number }>("select count(*)::int n from gift_rewards where owner_user_id=$1", [old.id])).n).toBe(0);
  });
  it("탈퇴 후 같은 제공자 id로 새 계정 가입 → 미지급", async () => {
    const first: AccountIdentity = { id: uid(), provider: "kakao", displayName: "a", providerUserId: "9990001" };
    await consented(first); expect((await (await profilePost(first, depsFor())).json()).signupGift).toBeTruthy();
    await h.rpc("ops_account", "withdraw", first.id, { retainUntil: new Date(Date.now() + 5 * 365 * 86_400_000).toISOString() });
    const again: AccountIdentity = { id: uid(), provider: "kakao", displayName: "a", providerUserId: "9990001" };
    await consented(again);
    const body = await (await profilePost(again, depsFor())).json();
    expect(body.joined).toBe(true); expect(body.signupGift).toBeUndefined();
    // 같은 번호라도 제공자가 다르면 다른 사람(구글 sub와 카카오 번호는 겹칠 수 있다).
    expect(signupProviderHash("kakao", "9990001", env())).not.toBe(signupProviderHash("google", "9990001", env()));
  });
});

describe("해시(원문 id 저장 없음)", () => {
  it("HMAC(REPORT_ADMIN_SECRET에서 용도 이름으로 파생) — 같은 입력이면 같고, 비밀값이 없거나 id가 없으면 null(지급 안 함), 맨 SHA-256과 다르다", async () => {
    const e = env();
    const a = signupProviderHash("kakao", "3801234567", e);
    expect(a).toMatch(/^[a-f0-9]{64}$/); expect(signupProviderHash("kakao", "3801234567", e)).toBe(a);
    expect(a).not.toBe(createHash("sha256").update("kakao:3801234567").digest("hex"));
    expect(SIGNUP_HASH_LABEL).toBe("gyeol-signup-grant-v1");
    expect(signupProviderHash("kakao", "3801234567", { ...e, REPORT_ADMIN_SECRET: "" })).toBeNull();
    expect(signupProviderHash("kakao", null, e)).toBeNull();
    expect(await grantSignupTicket(signup(), { id: uid(), provider: "kakao", providerUserId: null }, e)).toMatchObject({ issued: false, code: "HASH_UNAVAILABLE" });
    const stored = await h.all<{ hash: string }>("select hash from signup_grant_hashes");
    expect(stored.every(r => /^[a-f0-9]{64}$/.test(r.hash) && !r.hash.includes("3801234567"))).toBe(true);
  });
});

describe("팝업: 가입 팝업 1개(①을 대신), 멈춤이면 없음", () => {
  const now = T("2026-11-12T12:00:00+09:00");
  const event = giftEventPublicView({ GIFT_EVENT_ENABLED: "1" }, now);
  const mine = { status: "available", expiresAt: new Date(now + 6 * 86_400_000).toISOString() };
  const st = (o: Partial<PopupState>): PopupState => ({ member: true, comp: null, event, signup: { active: true, mine }, ...o });
  it("가입 이용권을 받은 신규 회원 → signup(① 대신), 한 번에 하나", () => {
    expect(selectPopup(st({}), "/", now)).toBe("signup");
    expect(selectPopup(st({}), "/report/new", now)).toBe("signup");
    expect(selectPopup(st({}), `/reports/report_${"a".repeat(32)}`, now)).toBeNull();
  });
  it("지급 꺼짐·기한 지남·다 씀·손님이면 가입 팝업 없음 → 1+1 기간이면 ①", () => {
    expect(selectPopup(st({ signup: { active: false, mine } }), "/", now)).toBe("event-1plus1");
    expect(selectPopup(st({ signup: { active: true, mine: { ...mine, expiresAt: new Date(now - 1).toISOString() } } }), "/", now)).toBe("event-1plus1");
    expect(selectPopup(st({ signup: { active: true, mine: { ...mine, status: "used_self" } } }), "/", now)).toBe("event-1plus1");
    expect(selectPopup(st({ member: false, signup: { active: true, mine: null } }), "/", now)).toBe("event-1plus1");
    expect(signupPopupDue(st({ signup: { active: false, mine } }), now)).toBe(false);
  });
});

describe("시간 이동: 캠페인 끝(= 1+1 끝) 전후, 연장은 설정 하나로", () => {
  const ON = { GIFT_EVENT_ENABLED: "1" } as const;
  const strip = (now: number, on = true) => signupStripVisible({ ...giftEventPublicView(ON, now), signup: signupPublicView(on, ON, now) }, now, true);
  it("기본 설정: 11-30 23:59:59.999 KST까지 지급 요청·띠·/free 혜택·책 끝 1+1 줄, 12-01 00:00부터 없음(저장소를 부르지 않음)", async () => {
    const before = T("2026-11-30T23:59:59.999+09:00"), after = T("2026-12-01T00:00:00+09:00");
    expect(signupCampaignConfig(ON, before)).toMatchObject({ inWindow: true, end: "2026-11-30T15:00:00.000Z" });
    expect(signupPublicView(true, ON, before).active).toBe(true); expect(strip(before)).toBe(true);
    expect(giftEventConfig(ON, before).active).toBe(true);
    expect(signupPublicView(true, ON, after).active).toBe(false); expect(strip(after)).toBe(false);
    expect(giftEventConfig(ON, after).active).toBe(false);
    const store = { call: vi.fn(async () => ({ ok: true, issued: true })) };
    expect(await grantSignupTicket(store, { id: uid(), provider: "kakao", providerUserId: "1" }, { ...ON, REPORT_ADMIN_SECRET: "x" }, after)).toMatchObject({ issued: false, code: "NOT_IN_PERIOD" });
    expect(store.call).not.toHaveBeenCalled();
    // 멈춤이면 기간 안이어도 띠·/free 혜택 없음.
    expect(strip(before, false)).toBe(false);
    // 로그인한 회원에게는 띠가 없다.
    expect(signupStripVisible({ ...giftEventPublicView(ON, before), signup: signupPublicView(true, ON, before) }, before, false)).toBe(false);
  });
  it("1+1 끝을 바꾸면(설정 하나) 1+1 발급·가입 이용권·화면 끝 시각이 함께 바뀐다", () => {
    const longer = { ...ON, GIFT_EVENT_END: "2026-12-15 23:59:59" }, at = T("2026-12-10T12:00:00+09:00");
    const end = "2026-12-15T15:00:00.000Z";
    expect(giftEventConfig(longer, at)).toMatchObject({ active: true, end });
    expect(signupCampaignConfig(longer, at)).toMatchObject({ inWindow: true, end });
    expect(signupPublicView(true, longer, at)).toMatchObject({ active: true, endsAt: end });
    expect(giftEventPublicView(longer, at)).toMatchObject({ phase: "during", endsAt: end });
  });
  it("캠페인 시작 전(배포 전) 가입은 대상이 아니다", () => {
    expect(signupCampaignConfig({ ...ON, SIGNUP_CAMPAIGN_START: "2026-11-20 00:00" }, T("2026-11-19T23:59:59+09:00")).inWindow).toBe(false);
  });
});
