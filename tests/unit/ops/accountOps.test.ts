// P6d-ops 1·2·3: 가입 정보 검사, 카카오 사실(이메일 확정·채널), 로그인 콜백(이메일 추가 동의·정보 화면), 결제·이용권 게이트, 판매 중지.
import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { NextRequest } from "next/server";
import { MARKETING_CONSENT_VERSION, validateContact, normalizePhone } from "@/lib/account/contact";
import { kakaoFacts, kakaoUnlink, KAKAO_LOGIN_SCOPE } from "@/lib/account/kakaoLogin";
import { handleAccount, type AccountPort } from "@/lib/account/handler";
import { handleProfile } from "@/lib/account/profile";
import { accountSession, ACCOUNT_POLICY_VERSIONS, type AccountSnapshot } from "@/lib/account/policy";
import { resolveBuyer } from "@/lib/ops/orders/buyer";
import { closedSaleProducts, giftEventConfig, productOnSale } from "@/lib/ops/config";
import { enqueueTicketPublication } from "@/lib/tickets/publication";
import { handleTicketPublication } from "@/lib/tickets/publicHandler";

const ORIGIN = "https://www.gyeolreport.com";
const consents = Object.entries(ACCOUNT_POLICY_VERSIONS).map(([consent_type, document_version]) => ({ consent_type: consent_type as "terms" | "privacy", document_version, is_agreed: true, required: true, recorded_at: "2026-11-01T00:00:00Z" }));
const user = { id: "11111111-1111-4111-8111-111111111111", displayName: "하람", provider: "kakao" as const, kakaoId: "1234567" };
function port(snapshot: Partial<AccountSnapshot> = {}, extra: Partial<AccountPort> = {}): AccountPort & { started: string[] } {
  const started: string[] = [];
  return { started, authorizationOrigin: "https://supabase.example", currentUser: async () => user, read: async () => ({ profile: user, consents, ...snapshot }),
    start: async (_p, cb, scope) => { started.push(scope ?? "default"); return `https://supabase.example/auth/v1/authorize?redirect_to=${encodeURIComponent(cb)}`; },
    exchange: async () => true, logout: async () => true, consent: async () => true, finish: r => r, ...extra };
}
const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status });
afterEach(() => { delete process.env.FORTUNE_SALES_OPEN; });

describe("가입 정보 검사", () => {
  it("이름·이메일 두 번·휴대폰(선택), 공급자 이메일은 서버 확정값과 같을 때만", () => {
    expect(validateContact({ name: "하람", email: "A@B.co", emailConfirm: "a@b.co" })).toMatchObject({ ok: true, value: { email: "a@b.co", phone: null, emailSource: "typed" } });
    expect(validateContact({ name: "하람", email: "a@b.co", emailConfirm: "x@b.co" })).toMatchObject({ ok: false, field: "emailConfirm" });
    expect(validateContact({ name: "", email: "a@b.co", emailConfirm: "a@b.co" })).toMatchObject({ ok: false, field: "name" });
    expect(validateContact({ name: "하람", email: "a@b", emailConfirm: "a@b" })).toMatchObject({ ok: false, field: "email" });
    expect(validateContact({ name: "하람", email: "a@b.co", emailSource: "provider" }, { email: "a@b.co", emailTrusted: false })).toMatchObject({ ok: false });
    expect(validateContact({ name: "하람", email: "a@b.co", emailSource: "provider" }, { email: "a@b.co", emailTrusted: true })).toMatchObject({ ok: true, value: { emailSource: "provider" } });
    expect(normalizePhone("010-1234-5678")).toBe("01012345678"); expect(normalizePhone("12345")).toBeUndefined(); expect(normalizePhone("")).toBeNull();
  });
});

describe("카카오 사실", () => {
  it("scope는 콘솔 동의 항목 셋만", () => expect(KAKAO_LOGIN_SCOPE).toBe("account_email,profile_nickname,plusfriends"));
  it("is_email_valid·is_email_verified 둘 다 참일 때만 확정, 채널 ADDED·403 미확인·토큰 없음", async () => {
    const f = (me: unknown, ch: Response) => (async (url: string) => url.includes("/user/me") ? json(me) : ch) as unknown as typeof fetch;
    expect(await kakaoFacts("t", "_gyeol", f({ kakao_account: { email: "A@b.co", is_email_valid: true, is_email_verified: true } }, json({ channels: [{ channel_public_id: "_gyeol", relation: "ADDED" }] }))))
      .toEqual({ email: "a@b.co", trusted: true, needsAgreement: false, channel: "added" });
    expect(await kakaoFacts("t", "_gyeol", f({ kakao_account: { email: "a@b.co", is_email_valid: true, is_email_verified: false } }, json({ msg: "insufficient scopes" }, 403))))
      .toEqual({ email: "a@b.co", trusted: false, needsAgreement: false, channel: null });
    expect(await kakaoFacts("t", "_gyeol", f({ kakao_account: { email_needs_agreement: true } }, json({ channels: [] }))))
      .toMatchObject({ email: null, needsAgreement: true, channel: "none" });
    expect(await kakaoFacts(null, "_gyeol")).toEqual({ email: null, trusted: false, needsAgreement: false, channel: undefined });
  });
  it("탈퇴 연결 끊기: 어드민 키가 없으면 skipped", async () => {
    expect(await kakaoUnlink("123", undefined)).toBe("skipped");
    let body = ""; expect(await kakaoUnlink("123", "admin", (async (_u: string, init: RequestInit) => { body = String(init.body); return new Response("{}"); }) as unknown as typeof fetch)).toBe("done");
    expect(body).toBe("target_id_type=user_id&target_id=123");
  });
});

describe("로그인 콜백", () => {
  const callback = (cookieFlow: object) => {
    const state = "a".repeat(64);
    const r = new NextRequest(`${ORIGIN}/auth/callback?flow=${state}&code=c`);
    r.cookies.set("gyeol-auth-flow", JSON.stringify({ state, next: "/report/new?product=saju-mbti-full", expires: Date.now() + 60_000, ...cookieFlow }));
    return r;
  };
  it("카카오 이메일이 없으면 account_email만 한 번 더 인가(재시도 표시)", async () => {
    const p = port({ contact: null }, { afterLogin: async () => ({ askEmail: true }) });
    const res = await handleAccount(callback({}), "callback", p);
    expect(res.headers.get("location")).toContain("supabase.example/auth/v1/authorize");
    expect(p.started).toEqual(["account_email"]);
    expect(JSON.parse(decodeURIComponent(res.cookies.get("gyeol-auth-flow")!.value)).emailRetry).toBe(true);
  });
  it("재시도 뒤(거부)에는 다시 묻지 않고 가입 정보 화면으로, 돌아갈 곳은 쿠키에", async () => {
    const p = port({ contact: null }, { afterLogin: async () => ({ askEmail: true }) });
    const res = await handleAccount(callback({ emailRetry: true }), "callback", p);
    expect(new URL(res.headers.get("location")!).pathname).toBe("/account");
    expect(p.started).toEqual([]);
    expect(res.cookies.get("gyeol-account-return")?.value).toBe("/report/new?product=saju-mbti-full");
  });
  it("가입 정보가 있으면 원래 가던 곳으로", async () => {
    const res = await handleAccount(callback({}), "callback", port({ contact: { name: "하람", email: "a@b.co" } }, { afterLogin: async () => ({ askEmail: false }) }));
    expect(res.headers.get("location")).toBe(`${ORIGIN}/report/new?product=saju-mbti-full`);
  });
  it("세션: 회원이면 profile required/complete, 업그레이드 자격", () => {
    expect(accountSession(user, { profile: user, consents, contact: null })).toMatchObject({ status: "member", profile: "required" });
    expect(accountSession(user, { profile: user, consents, contact: { name: "a", email: "a@b.co", upgradeState: "eligible" } })).toMatchObject({ profile: "complete", upgradeState: "eligible" });
    expect(accountSession(user, { profile: user, consents })).not.toHaveProperty("profile"); // 저장소가 모르면 막지 않는다
  });
});

describe("가입 정보 저장", () => {
  const ops = (calls: unknown[]) => ({ call: async (action: string, _u: string, data?: Record<string, unknown>) => { calls.push([action, data]); return action === "facts_read" ? { ok: true, facts: { email: "k@kakao.com", emailTrusted: true } } : action === "read" ? { ok: true, contact: null } : { ok: true, contact: { name: "하람" } }; } });
  const deps = (calls: unknown[]) => ({ ops: ops(calls), audit: async () => true, unlinkKakao: async () => "skipped" as const, deleteUser: async () => true });
  it("GET: 카카오 확정 이메일을 미리 채우고 잠근다", async () => {
    const res = await handleProfile(new NextRequest(`${ORIGIN}/auth/profile`), "profile", port({ contact: null }), deps([]));
    expect((await res.json()).prefill).toMatchObject({ email: "k@kakao.com", emailLocked: true });
  });
  it("POST: 다른 출처는 403, 같은 출처는 저장 + 마케팅 동의 버전", async () => {
    const calls: unknown[] = [];
    const body = JSON.stringify({ requestId: crypto.randomUUID(), name: "하람", email: "k@kakao.com", emailSource: "provider", marketing: true });
    expect((await handleProfile(new NextRequest(`${ORIGIN}/auth/profile`, { method: "POST", body, headers: { origin: "https://evil.example" } }), "profile", port({ contact: null }), deps(calls))).status).toBe(403);
    const ok = await handleProfile(new NextRequest(`${ORIGIN}/auth/profile`, { method: "POST", body, headers: { origin: ORIGIN } }), "profile", port({ contact: null }), deps(calls));
    expect(ok.status).toBe(200);
    expect(calls.find(c => (c as [string])[0] === "save")).toMatchObject(["save", { email: "k@kakao.com", emailSource: "provider", marketing: true, marketingVersion: MARKETING_CONSENT_VERSION }]);
  });
  it("마이페이지 혜택 알림(최종3): 저장된 가입 정보 그대로 동의만 바꾸고, 마지막 동의·철회 일시를 돌려준다", async () => {
    const saved = { name: "하람", email: "h@b.co", emailSource: "typed", phone: null, marketing: false };
    const calls: unknown[] = [];
    const marketingOps = { call: async (action: string, _u: string, data?: Record<string, unknown>) => { calls.push([action, data]);
      return action === "facts_read" ? { ok: true, facts: null } : action === "read" ? { ok: true, contact: saved } : { ok: true, contact: { ...saved, marketing: data?.marketing } }; } };
    const consentsAfter = [{ consent_type: "marketing" as const, document_version: MARKETING_CONSENT_VERSION, is_agreed: true, required: false, recorded_at: "2026-11-05T06:00:00Z" }, ...consents];
    const p = port({ contact: { name: "하람", email: "h@b.co" }, consents: consentsAfter });
    const deps = { ops: marketingOps, audit: async () => true, unlinkKakao: async () => "skipped" as const, deleteUser: async () => true };
    const body = JSON.stringify({ op: "marketing", marketing: true, requestId: crypto.randomUUID() });
    const res = await handleProfile(new NextRequest(`${ORIGIN}/auth/profile`, { method: "POST", body, headers: { origin: ORIGIN } }), "profile", p, deps);
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ ok: true, marketing: { agreed: true, at: "2026-11-05T06:00:00Z" } });
    expect(calls.find(c => (c as [string])[0] === "save")).toMatchObject(["save", { name: "하람", email: "h@b.co", emailSource: "typed", marketing: true, marketingVersion: MARKETING_CONSENT_VERSION }]);
    const bad = await handleProfile(new NextRequest(`${ORIGIN}/auth/profile`, { method: "POST", body: JSON.stringify({ op: "marketing", marketing: "yes", requestId: crypto.randomUUID() }), headers: { origin: ORIGIN } }), "profile", p, deps);
    expect(bad.status).toBe(400);
    const got = await (await handleProfile(new NextRequest(`${ORIGIN}/auth/profile`), "profile", p, deps)).json();
    expect(got.marketing).toEqual({ agreed: false, at: null }); // 저장값(false)과 마지막 기록(true)이 다르면 일시를 붙이지 않는다
  });
  it("Google 확인 이메일: 미리 채운 값 그대로 저장되고(화면과 저장이 같은 기준), 확인 안 된 이메일은 직접 입력", async () => {
    const google = (emailVerified: boolean) => { const p = port({ contact: null }); const g = { ...user, provider: "google" as const, email: "G.User@Gmail.com", emailVerified }; return { ...p, currentUser: async () => g, read: async () => ({ profile: g, consents, contact: null }) }; };
    const noFacts = (calls: unknown[]) => ({ ...deps(calls), ops: { call: async (action: string, _u: string, data?: Record<string, unknown>) => { calls.push([action, data]); return action === "facts_read" ? { ok: true, facts: null } : action === "read" ? { ok: true, contact: null } : { ok: true, contact: { name: "하람" } }; } } });
    const got = await (await handleProfile(new NextRequest(`${ORIGIN}/auth/profile`), "profile", google(true), noFacts([]))).json();
    expect(got.prefill).toMatchObject({ email: "g.user@gmail.com", emailLocked: true, emailFrom: "google" });
    const body = JSON.stringify({ requestId: crypto.randomUUID(), name: "하람", email: "g.user@gmail.com", emailSource: "provider" });
    const calls: unknown[] = [];
    expect((await handleProfile(new NextRequest(`${ORIGIN}/auth/profile`, { method: "POST", body, headers: { origin: ORIGIN } }), "profile", google(true), noFacts(calls))).status).toBe(200);
    expect(calls.find(c => (c as [string])[0] === "save")).toMatchObject(["save", { email: "g.user@gmail.com", emailSource: "provider" }]);
    expect((await handleProfile(new NextRequest(`${ORIGIN}/auth/profile`, { method: "POST", body, headers: { origin: ORIGIN } }), "profile", google(false), noFacts([]))).status).toBe(400);
  });
});

describe("결제·이용권 게이트", () => {
  it("대운·세운은 기본 판매 중지, 설정값 하나로 다시 연다", () => {
    expect(closedSaleProducts()).toEqual(["major_fortune", "annual_fortune"]);
    expect(productOnSale("annual_fortune")).toBe(false); expect(productOnSale("saju_mbti_full")).toBe(true);
    process.env.FORTUNE_SALES_OPEN = "1"; expect(productOnSale("annual_fortune")).toBe(true);
  });
  it("이용권 발행 접수도 판매 중지 상품을 거절(저장소 호출 없음)", async () => {
    const store = { call: vi.fn() };
    const payload = { productKey: "major_fortune", productSlug: "major-fortune", person: { name: "하람", birthDate: "1996-12-06", birthTime: "09:30", birthTimeUnknown: false, approximateBirthTimeSlot: "", gender: "MALE", mbtiType: "ENTJ" }, userContext: { relationshipStatus: "single", jobStatus: "employee", detailJob: "기획", focusAreas: [] }, productOptions: {} };
    expect(await enqueueTicketPublication(store, user.id, crypto.randomUUID(), payload, {} as never, new Date("2026-11-04T00:00:00Z"))).toEqual({ ok: false, code: "PRODUCT_SALES_CLOSED" });
    expect(store.call).not.toHaveBeenCalled();
  });
  it("가입 정보 전에는 이용권 사용 403(상태 확인은 된다)", async () => {
    const r = new NextRequest(`${ORIGIN}/auth/ticket-redeem`, { method: "POST", body: "{}", headers: { origin: ORIGIN } });
    const res = await handleTicketPublication(r, "redeem", port({ contact: null }), { call: vi.fn() });
    expect(res.status).toBe(403); expect((await res.json()).code).toBe("PROFILE_REQUIRED");
  });
  it("결제 구매자: 회원은 가입 정보, 없으면 PROFILE_REQUIRED, 비회원은 결제하지 않는다(P 추가 A: LOGIN_REQUIRED, 입력값을 받지 않음)", async () => {
    const account = { call: async () => ({ ok: true, contact: { name: "하람", email: "a@b.co", phone: "01012345678" } }) };
    expect(await resolveBuyer(new Request(ORIGIN), undefined, { port: port({ contact: null }), account })).toMatchObject({ ok: false, code: "PROFILE_REQUIRED", status: 403 });
    expect(await resolveBuyer(new Request(ORIGIN), undefined, { port: port({ contact: { name: "하람", email: "a@b.co" } }), account })).toEqual({ ok: true, buyer: { userId: user.id, name: "하람", email: "a@b.co", phone: "01012345678" } });
    expect(await resolveBuyer(new Request(ORIGIN), { name: "손님", email: "g@b.co", emailConfirm: "x@b.co" }, { port: null, account })).toMatchObject({ ok: false, code: "LOGIN_REQUIRED", status: 401 });
    expect(await resolveBuyer(new Request(ORIGIN), { name: "손님", email: "g@b.co", emailConfirm: "g@b.co", phone: "010 9999 8888" }, { port: null, account })).toMatchObject({ ok: false, code: "LOGIN_REQUIRED", status: 401 });
  });
  it("이벤트 설정: 기본 꺼짐, 켜면 기간·대상(판매 중인 상품만)·기한 11-30(상한 없음)", () => {
    expect(giftEventConfig({}).active).toBe(false);
    const c = giftEventConfig({ GIFT_EVENT_ENABLED: "1", GIFT_EVENT_START: "2026-11-01T00:00:00+09:00", GIFT_EVENT_END: "2026-12-01T00:00:00+09:00" }, Date.parse("2026-11-04T00:00:00Z"));
    expect(c).toMatchObject({ active: true, ticketExpiresAt: "2026-11-30T14:59:59.000Z" });
    expect(c.products).not.toContain("major_fortune");
  });
});
