// 「남이 본 나」 서버 라우트 본체(handleMirror): 관문 · 출처 · 동의 재사용 · 프로필 · 자가 답 · 일회용 토큰. 가짜 계정 포트 · 저장소(외부 호출 0).
import { NextRequest, NextResponse } from "next/server";
import { describe, expect, it, vi } from "vitest";
import { MIRROR_ITEMS } from "../../../src/data/mirror/items";
import type { AccountPort } from "../../../src/lib/account/handler";
import { ACCOUNT_POLICY_VERSIONS, type AccountIdentity, type AccountSnapshot } from "../../../src/lib/account/policy";
import { DEVICE_COOKIE, deviceHash, handleMirror, safeMirrorNext, type MirrorProfile, type MirrorStore } from "../../../src/lib/mirror/api";
import type { Choice, FriendSession } from "../../../src/lib/mirror/engine";

const ORIGIN = "http://localhost:3100";
const USER: AccountIdentity = { id: "u-1", provider: "kakao", displayName: "카카오 민지" };
const consented: AccountSnapshot = { profile: { id: "u-1", provider: "kakao", displayName: "민지" }, consents: Object.entries(ACCOUNT_POLICY_VERSIONS).map(([t, v]) => ({ consent_type: t as "terms", document_version: v, is_agreed: true, required: true, recorded_at: "2026-11-01" })), contact: null };

function fakes(opts: { user?: AccountIdentity | null; snapshot?: AccountSnapshot } = {}) {
  let profile: (MirrorProfile & { handleOwner?: string }) | null = null;
  const self: Record<string, Choice> = {}, devices: string[] = [], handoffs = new Map<string, { deviceToken: string | null; next: string; used: boolean }>();
  let snapshot = opts.snapshot ?? { profile: null, consents: [], contact: null };
  const account: AccountPort = {
    authorizationOrigin: "http://127.0.0.1:54321",
    currentUser: async () => opts.user === undefined ? USER : opts.user,
    read: async () => snapshot,
    consent: vi.fn(async () => { snapshot = consented; return true; }),
    start: async () => null, exchange: async () => false, logout: async () => true,
    finish: (r: NextResponse) => r,
  };
  const board: FriendSession[] = [];
  const store: MirrorStore = {
    profile: async () => profile,
    resolveHandle: async () => null,
    handleTaken: async h => h === "taken.one",
    saveProfile: async (_u, input) => {
      if (input.handle === "taken.one") return { ok: false, code: "HANDLE_TAKEN" };
      if (!profile && !input.age14) return { ok: false, code: "AGE_REQUIRED" };
      profile = { name: input.name, handle: input.handle, handleChangedAt: null, birthDate: input.birthDate, birthTime: input.birthTime, isPublic: true, selfCompletedAt: profile?.selfCompletedAt ?? null };
      return { ok: true };
    },
    selfAnswers: async () => ({ ...self }),
    saveSelfAnswer: async (_u, id, _v, c) => { self[id] = c; return true; },
    completeSelf: async () => { profile = { ...profile!, selfCompletedAt: "2026-11-27T00:00:00.000Z" }; return true; },
    touchDevice: async h => { devices.push(h); },
    board: async () => board,
    contactName: async () => "장민지",
    mintHandoff: async (hash, token, next) => { handoffs.set(hash, { deviceToken: token, next, used: false }); return true; },
    redeemHandoff: async hash => { const h = handoffs.get(hash); if (!h || h.used) return null; h.used = true; const out = { deviceToken: h.deviceToken, next: h.next }; h.deviceToken = null; return out; },
  };
  return { account, store, self, devices, board, getProfile: () => profile };
}
const req = (action: string, init: { method?: string; body?: unknown; origin?: string | null; cookie?: string; query?: string } = {}) => {
  const headers: Record<string, string> = { host: "localhost:3100" };
  if (init.origin !== null) headers.origin = init.origin ?? ORIGIN;
  if (init.cookie) headers.cookie = init.cookie;
  return new NextRequest(`${ORIGIN}/api/mirror/${action}${init.query ?? ""}`, { method: init.method ?? "GET", headers, ...(init.body !== undefined ? { body: JSON.stringify(init.body) } : {}) });
};
const run = (f: ReturnType<typeof fakes>, action: string, init?: Parameters<typeof req>[1], enabled = true) => handleMirror(req(action, init), action, { enabled, account: f.account, store: f.store, dev: true, now: () => new Date("2026-11-27T03:00:00Z") });
const profileBody = (extra: object = {}) => ({ name: "민지", handle: "Minji.K", birthDate: "", birthTime: "", age14: true, ...extra });
const consentBody = { requestId: "0b8f8c8e-1d2a-4c3b-9a8b-7c6d5e4f3a2b", terms: true, privacy: true, versions: ACCOUNT_POLICY_VERSIONS };

describe("관문 · 출처", () => {
  it("관문이 닫혀 있으면 모든 주소가 404(저장소를 건드리지 않음)", async () => {
    const f = fakes();
    for (const a of ["session", "profile", "answer", "handoff", "nope"]) expect((await run(f, a, {}, false)).status).toBe(404);
  });
  it("POST는 같은 출처만, 모르는 주소 404, 방법 405", async () => {
    const f = fakes({ snapshot: consented });
    expect((await run(f, "profile", { method: "POST", body: profileBody(), origin: "https://evil.example" })).status).toBe(403);
    expect((await run(f, "profile", { method: "POST", body: profileBody(), origin: null })).status).toBe(403);
    expect((await run(f, "nope")).status).toBe(404);
    expect((await run(f, "profile")).status).toBe(405);
  });
});

describe("세션 · 프로필", () => {
  it("로그인 전: guest + 기기 쿠키(httpOnly)", async () => {
    const r = await run(fakes({ user: null }), "session");
    expect(await r.json()).toEqual({ account: "guest" });
    expect(r.headers.get("set-cookie")).toMatch(new RegExp(`${DEVICE_COOKIE}=[A-Za-z0-9_-]{43};.*HttpOnly`, "i"));
    expect(r.headers.get("cache-control")).toContain("no-store");
  });
  it("첫 로그인: 동의 전이면 약관 동의를 함께 받고(기존 record_account_consent 경로), 이름은 가입 정보 이름으로 채워 둔다", async () => {
    const f = fakes();
    const s = await (await run(f, "session")).json();
    expect(s).toMatchObject({ account: "needs_consent", prefillName: "장민지", profile: null, home: null });
    expect(s.self.seed).toMatch(/^[0-9a-z]+$/);
    expect(JSON.stringify(s)).not.toContain("u-1");
    const noConsent = await run(f, "profile", { method: "POST", body: profileBody() });
    expect(noConsent.status).toBe(400);
    expect((await noConsent.json()).code).toBe("CONSENT_REQUIRED");
    const ok = await run(f, "profile", { method: "POST", body: profileBody({ consent: consentBody }) });
    expect(ok.status).toBe(200);
    expect(f.account.consent).toHaveBeenCalledWith(USER, consentBody.requestId, "first_login");
    const saved = await ok.json();
    expect(saved.profile).toMatchObject({ name: "민지", handle: "minji.k", birthDate: null, handleChangeAllowedAt: null });
    // 같은 요청에서 동의를 저장했으므로 응답은 바로 회원 상태(화면이 질문지 시작으로 넘어간다).
    expect(saved.account).toBe("member");
  });
  it("이미 동의한 회원에게는 다시 묻지 않는다 · 만 14세 확인 · 아이디 중복 · 생년월일 형식", async () => {
    const f = fakes({ snapshot: consented });
    expect((await (await run(f, "profile", { method: "POST", body: profileBody({ age14: false }) })).json()).code).toBe("AGE_REQUIRED");
    expect((await run(f, "profile", { method: "POST", body: profileBody({ handle: "taken.one" }) })).status).toBe(409);
    expect((await (await run(f, "profile", { method: "POST", body: profileBody({ birthDate: "2001-02-30" }) })).json()).error).toContain("생년월일");
    expect((await (await run(f, "profile", { method: "POST", body: profileBody({ name: "민" }) })).json()).error).toContain("2~10자");
    const ok = await run(f, "profile", { method: "POST", body: profileBody({ birthDate: "2001-03-04", birthTime: "09:30" }) });
    expect(ok.status).toBe(200);
    expect(f.account.consent).not.toHaveBeenCalled();
  });
  it("아이디 확인: 규칙 · 중복", async () => {
    const f = fakes();
    expect(await (await run(f, "handle", { query: "?value=@Minji.K" })).json()).toEqual({ handle: "minji.k", available: true });
    expect(await (await run(f, "handle", { query: "?value=taken.one" })).json()).toMatchObject({ available: false, message: "이미 쓰고 있는 아이디예요." });
    expect(await (await run(f, "handle", { query: "?value=.minji" })).json()).toMatchObject({ available: false });
    expect(await (await run(f, "handle", { query: "?value=admin" })).json()).toMatchObject({ available: false });
  });
});

describe("자가 질문지", () => {
  it("프로필 전에는 답을 받지 않고, 60개를 다 답해야 완료, 완료 뒤에는 답을 바꾸지 않는다", async () => {
    const f = fakes({ snapshot: consented });
    expect((await run(f, "answer", { method: "POST", body: { itemId: "soc-1", version: 1, choice: 0 } })).status).toBe(409);
    await run(f, "profile", { method: "POST", body: profileBody() });
    expect((await run(f, "answer", { method: "POST", body: { itemId: "soc-9", version: 1, choice: 0 } })).status).toBe(400);
    expect((await run(f, "answer", { method: "POST", body: { itemId: "soc-1", version: 2, choice: 0 } })).status).toBe(400);
    expect((await run(f, "answer", { method: "POST", body: { itemId: "soc-1", version: 1, choice: 2 } })).status).toBe(400);
    for (const item of MIRROR_ITEMS.slice(0, 59)) expect((await run(f, "answer", { method: "POST", body: { itemId: item.id, version: 1, choice: 1 } })).status).toBe(200);
    expect((await run(f, "complete", { method: "POST", body: {} })).status).toBe(409);
    await run(f, "answer", { method: "POST", body: { itemId: MIRROR_ITEMS[59].id, version: 1, choice: 0 } });
    const done = await (await run(f, "complete", { method: "POST", body: {} })).json();
    expect(done.self.completedAt).toBe("2026-11-27T00:00:00.000Z");
    expect(done.home).toEqual({ sync: null, answers: 0, completeness: 0, reportReady: false, friends: 0, stage: 0, stars: [] });
    expect((await run(f, "answer", { method: "POST", body: { itemId: "soc-1", version: 1, choice: 0 } })).status).toBe(409);
  });
  it("세션은 로그인한 기기를 기록한다(주인 기기 답 제외용)", async () => {
    const f = fakes({ snapshot: consented });
    const r = await run(f, "session", { cookie: `${DEVICE_COOKIE}=${"D".repeat(43)}` });
    expect(r.headers.get("set-cookie")).toBeNull();
    expect(f.devices).toEqual([deviceHash("D".repeat(43))]);
  });
  it("홈 숫자에는 친구 답 원본 · 세션 id가 실리지 않는다(익명)", async () => {
    const f = fakes({ snapshot: consented });
    await run(f, "profile", { method: "POST", body: profileBody() });
    for (const item of MIRROR_ITEMS) await run(f, "answer", { method: "POST", body: { itemId: item.id, version: 1, choice: 0 } });
    f.board.push({ id: "secret-session-id", closeness: 3, answers: MIRROR_ITEMS.slice(0, 12).map(i => ({ itemId: i.id, choice: 0 as Choice })) });
    const home = (await (await run(f, "complete", { method: "POST", body: {} })).json()).home;
    expect(home).toMatchObject({ sync: 100, answers: 12, friends: 1, stage: 1 });
    expect(JSON.stringify(home)).not.toContain("secret-session-id");
    expect(JSON.stringify(home)).not.toContain("soc-1");
  });
});

describe("다른 브라우저로 넘어가기(일회용 토큰)", () => {
  it("발급 → 새 브라우저에서 한 번 쓰면 같은 기기 쿠키로 이어지고, 두 번째는 그냥 첫 화면", async () => {
    const f = fakes({ user: null }), device = "E".repeat(43);
    const minted = await (await run(f, "handoff", { method: "POST", body: { next: "/@minji.k" }, cookie: `${DEVICE_COOKIE}=${device}` })).json();
    expect(minted.path).toMatch(/^\/api\/mirror\/handoff\?t=[A-Za-z0-9_-]{43}$/);
    const query = minted.path.slice(minted.path.indexOf("?"));
    const first = await run(f, "handoff", { query });
    expect(first.status).toBe(303);
    expect(first.headers.get("location")).toBe(`${ORIGIN}/@minji.k`);
    expect(first.headers.get("set-cookie")).toContain(`${DEVICE_COOKIE}=${device}`);
    const second = await run(f, "handoff", { query });
    expect(second.headers.get("location")).toBe(`${ORIGIN}/`);
    expect(second.headers.get("set-cookie") ?? "").not.toContain(device);
  });
  it("돌아갈 곳은 이 서비스 화면만", () => {
    expect(["/", "/@minji.k", "/u/minji.k"].map(safeMirrorNext)).toEqual(["/", "/@minji.k", "/u/minji.k"]);
    expect(["//evil.example", "https://evil.example", "/account", "/@a", "/@minji.k/../x", 3].map(safeMirrorNext)).toEqual(["/", "/", "/", "/", "/", "/"]);
  });
});
