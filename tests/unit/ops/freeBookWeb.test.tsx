// F 화면·경로: 퍼널 API(단계 목록·유입 정리·시험 제외·식별자 저장 0), 브라우저 단계 1회 처리, 세션 「시험」 표시, 메타 픽셀·상태 조회 차단, /free 화면(혜택·회원·종료), 로그인 한 줄.
import { readFileSync } from "node:fs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
const hits = vi.hoisted(() => ({ calls: [] as Record<string, unknown>[], user: null as null | { id: string } }));
vi.mock("@/lib/ops/store", () => ({ createOpsStores: () => ({ funnel: { call: async (a: string, d: Record<string, unknown>) => { hits.calls.push({ a, ...d }); return { ok: true }; } }, signup: { call: async () => ({ ok: true, on: true }) } }) }));
vi.mock("@/lib/account/supabase", () => ({ createAccountPort: () => ({ currentUser: async () => hits.user }) }));
vi.mock("@/lib/ops/notify/deps", () => ({ testAccountIds: () => ["00000000-0000-4000-8000-00000000a001"], liveTestAccountIds: async () => new Set(["00000000-0000-4000-8000-00000000a001"]) }));
import { NextRequest } from "next/server";
import { renderToStaticMarkup } from "react-dom/server";
import { POST as funnelPost } from "@/app/api/funnel/route";
import { GET as pixelGet } from "@/app/api/analytics/meta/pixel/route";
import { GET as metaGet } from "@/app/api/analytics/meta/route";
import { handleAccount, type AccountPort } from "@/lib/account/handler";
import { ACCOUNT_POLICY_VERSIONS } from "@/lib/account/policy";
import { FUNNEL_STEPS, TEST_BROWSER_COOKIE, FUNNEL_LOGIN_COOKIE } from "@/lib/analytics/funnelModel";
import { FREE_COPY } from "@/lib/growth/model";
import { freeExamples, FREE_EXAMPLE_PICKS } from "@/lib/book/example";
import { signupPublicView, giftEventPublicView } from "@/lib/ops/config";

const ORIGIN = "https://www.gyeolreport.com";
const post = (body: unknown, cookie = "", origin = ORIGIN) => funnelPost(new NextRequest(`${ORIGIN}/api/funnel`, { method: "POST", body: JSON.stringify(body), headers: { origin, ...(cookie ? { cookie } : {}) } }));
beforeEach(() => { hits.calls.length = 0; hits.user = null; });
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); vi.resetModules(); });

describe("퍼널 API(/api/funnel)", () => {
  it("단계 목록만 받고 유입 값은 정리해서 「단계 × 유입」만 넘긴다(사용자 id·IP·쿠키 식별자 없음). 응답은 늘 204", async () => {
    const r = await post({ step: "free_view", source: "META", campaign: "free_book_1111", userId: "u-1", ip: "1.2.3.4", email: "a@b.c" }, "sb-x-auth-token=abc; other=1");
    expect(r.status).toBe(204);
    expect(hits.calls).toEqual([{ a: "hit", step: "free_view", source: "meta", campaign: "free_book_1111" }]);
    expect(Object.keys(hits.calls[0]).sort()).toEqual(["a", "campaign", "source", "step"]);
    expect((await post({ step: "drop_table" })).status).toBe(204);
    expect((await post({ step: "free_view", source: "<script>" })).status).toBe(204);
    expect(hits.calls.slice(1)).toEqual([{ a: "hit", step: "free_view", source: "-", campaign: "-" }]);
    expect((await post({ step: "free_view" }, "", "https://evil.example")).status).toBe(403);
  });
  it("「시험」 브라우저 표시가 있으면 세지 않는다", async () => {
    await post({ step: "home_view", source: "x" }, `${TEST_BROWSER_COOKIE}=1`);
    expect(hits.calls).toEqual([]);
  });
  it("회원 단계는 로그인 계정이 시험 계정이면 세지 않고 브라우저에 「시험」 표시를 남긴다(값 1뿐)", async () => {
    hits.user = { id: "00000000-0000-4000-8000-00000000a001" };
    const r = await post({ step: "paid", source: "meta" }, "sb-x-auth-token=abc");
    expect(hits.calls).toEqual([]);
    expect(r.headers.get("set-cookie")).toMatch(new RegExp(`^${TEST_BROWSER_COOKIE}=1;`));
    hits.user = { id: "00000000-0000-4000-8000-00000000b002" };
    await post({ step: "paid", source: "meta" }, "sb-x-auth-token=abc");
    expect(hits.calls).toEqual([{ a: "hit", step: "paid", source: "meta", campaign: "-" }]);
  });
  it("단계 목록이 SQL 목록과 같다", () => {
    const sql = readFileSync("supabase/migrations/20261111090000_v5_free_book.sql", "utf8");
    for (const step of FUNNEL_STEPS) expect(sql).toContain(`'${step}'`);
  });
});

describe("브라우저 퍼널(1회 처리·유입·시험)", () => {
  const storage = () => { const m = new Map<string, string>(); return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), removeItem: (k: string) => void m.delete(k), m }; };
  const setup = (search = "") => {
    const session = storage(), local = storage(), fetches: { url: string; body: Record<string, unknown> }[] = [];
    vi.stubGlobal("window", { location: { search, pathname: "/free", protocol: "https:" }, sessionStorage: session, localStorage: local });
    vi.stubGlobal("fetch", vi.fn(async (url: string, init: RequestInit) => { fetches.push({ url, body: JSON.parse(String(init.body)) }); return new Response(null, { status: 204 }); }));
    vi.stubEnv("NODE_ENV", "production");
    return { session, local, fetches };
  };
  it("같은 단계는 세션에 1번, 유입(utm_source·utm_campaign)만 붙인다", async () => {
    const { fetches } = setup("?utm_source=meta&utm_medium=paid&utm_campaign=free_book_1111&fbclid=secret");
    const f = await import("@/lib/analytics/funnel");
    f.captureUtm();
    expect(f.funnel("free_view")).toBe(true); expect(f.funnel("free_view")).toBe(false);
    expect(fetches).toEqual([{ url: "/api/funnel", body: { step: "free_view", source: "meta", campaign: "free_book_1111" } }]);
  });
  it("유입이 없으면 direct, 「시험」 브라우저면 보내지 않는다", async () => {
    const { fetches, local } = setup();
    const f = await import("@/lib/analytics/funnel");
    f.funnel("home_view");
    expect(fetches.at(-1)!.body).toEqual({ step: "home_view", source: "direct", campaign: "-" });
    f.markTesterBrowser(); expect(local.m.get("gyeol-test-browser-v1")).toBe("1");
    expect(f.funnel("product_view")).toBe(false); expect(fetches).toHaveLength(1);
  });
  it("주소별 조회 단계", async () => {
    setup(); const f = await import("@/lib/analytics/funnel");
    expect([f.viewStep("/free"), f.viewStep("/"), f.viewStep("/products"), f.viewStep("/report/new"), f.viewStep("/account")]).toEqual(["free_view", "home_view", "home_view", "product_view", null]);
  });
});

describe("세션·로그인 콜백의 「시험」 표시", () => {
  const consents = Object.entries(ACCOUNT_POLICY_VERSIONS).map(([consent_type, document_version]) => ({ consent_type: consent_type as "terms" | "privacy", document_version, is_agreed: true, required: true, recorded_at: "2026-11-01T00:00:00Z" }));
  const port = (id: string): AccountPort => ({ authorizationOrigin: "https://supabase.example", currentUser: async () => ({ id, provider: "kakao", displayName: "a" }),
    read: async () => ({ profile: { id, provider: "kakao", displayName: "a" }, consents, contact: { name: "a", email: "a@b.co" } }), start: async () => null, exchange: async () => true, logout: async () => true, consent: async () => true, finish: r => r });
  it("시험 계정 세션은 tester:true + 표시 쿠키(값 1), 일반 회원은 없음", async () => {
    const isTester = (id: string) => id === "t";
    const t = await handleAccount(new NextRequest(`${ORIGIN}/auth/session`), "session", port("t"), false, { isTester });
    expect(await t.json()).toMatchObject({ status: "member", tester: true });
    expect(t.headers.get("set-cookie")).toContain(`${TEST_BROWSER_COOKIE}=1`);
    const m = await handleAccount(new NextRequest(`${ORIGIN}/auth/session`), "session", port("m"), false, { isTester });
    const mb = await m.json(); expect(mb.tester).toBeUndefined(); expect(m.headers.get("set-cookie") ?? "").not.toContain(TEST_BROWSER_COOKIE);
  });
  it("기존 회원 로그인 완료 → 화면이 읽는 신호 쿠키(member, 2분), 시험 계정은 신호 대신 「시험」 표시", async () => {
    const state = "a".repeat(64), flow = JSON.stringify({ state, next: "/", expires: Date.now() + 60_000 });
    const cb = (id: string) => handleAccount(new NextRequest(`${ORIGIN}/auth/callback?flow=${state}&code=c`, { headers: { cookie: `gyeol-auth-flow=${encodeURIComponent(flow)}` } }), "callback", port(id), false, { isTester: x => x === "t" });
    const m = (await cb("m")).headers.get("set-cookie") ?? "";
    expect(m).toContain(`${FUNNEL_LOGIN_COOKIE}=member`); expect(m).not.toContain(`${TEST_BROWSER_COOKIE}=1`);
    const t = (await cb("t")).headers.get("set-cookie") ?? "";
    expect(t).toContain(`${TEST_BROWSER_COOKIE}=1`); expect(t).not.toContain(`${FUNNEL_LOGIN_COOKIE}=member`);
  });
});

describe("메타: 「시험」 브라우저는 픽셀을 열지 않고 상태 조회도 ready:false", () => {
  it("픽셀 로더 404, 상태 조회 ready:false·tester:true(DB·Meta 호출 없음)", async () => {
    const cookie = `${TEST_BROWSER_COOKIE}=1`;
    expect((await pixelGet(new NextRequest(`${ORIGIN}/api/analytics/meta/pixel`, { headers: { cookie } }))).status).toBe(404);
    const r = await metaGet(new NextRequest(`${ORIGIN}/api/analytics/meta`, { headers: { cookie, "x-request-id": "r-1" } }));
    expect(await r.json()).toMatchObject({ ready: false, tester: true, choice: null });
  });
  it("직접 전송·결제 완료 화면 경로도 같은 표시로 멈춘다(소스 확인), 브라우저 관문 publicMetaAllowed도 시험 브라우저를 뺀다", () => {
    for (const f of ["src/app/api/analytics/meta/route.ts", "src/app/api/analytics/purchase/route.ts", "src/app/api/analytics/meta/pixel/route.ts"]) expect(readFileSync(f, "utf8")).toContain("TEST_BROWSER_COOKIE");
    expect(readFileSync("src/lib/analytics/client.ts", "utf8")).toMatch(/publicMetaAllowed = \(\) => .*&& !testerBrowser\(\);/);
  });
});

describe("/free 화면", () => {
  const event = giftEventPublicView({ GIFT_EVENT_ENABLED: "1" }, Date.parse("2026-11-12T12:00:00+09:00"));
  const render = async (active: boolean, session: { status: string } = { status: "guest" }, loaded = true) => {
    vi.doMock("@/components/account/AccountSession", () => ({ useAccountSession: () => ({ session, loaded }), AccountEntry: () => null }));
    const { FreeLanding } = await import("@/components/growth/FreeLanding");
    return renderToStaticMarkup(<FreeLanding signup={{ ...signupPublicView(true, { GIFT_EVENT_ENABLED: "1" }, Date.parse("2026-11-12T12:00:00+09:00")), active }} event={event} examples={freeExamples()} />);
  };
  it("질문·설명·예시 「한 페이지」 3장(가상 인물 예시 본문 그대로, HTML)·혜택·[가입하고 무료로 받기]→로그인·증정 줄(11월 30일까지)·권유 링크", async () => {
    const html = await render(true);
    for (const t of [FREE_COPY.question, FREE_COPY.lead, FREE_COPY.benefit, "(이용권 1장, 7일)", FREE_COPY.cta, "11월 30일까지 한 권 결제하면 이용권 1장 증정", FREE_COPY.follow]) expect(html).toContain(t);
    expect(html).toContain('href="/login?next=/free"');
    expect((html.match(/data-free-example/g) ?? [])).toHaveLength(3);
    const ex = freeExamples();
    expect(ex).toHaveLength(FREE_EXAMPLE_PICKS.length);
    for (const e of ex) { expect(html).toContain(e.text.replaceAll('"', "&quot;")); expect(e.text).toMatch(/INFJ|Ni|Fe/); expect(e.text).toMatch(/병자일|정관|물 기운|병화|자수/); }
    expect(ex.map(e => e.heading)).toEqual(["속을 읽는 상담가가 얹는 한 겹", "", "처음 만난 자리에서는 조용히 가라앉아 있는 사람"]);
    for (const link of ["https://pf.kakao.com/_sbHaX", "https://www.instagram.com/gyeolreport/", "https://www.threads.com/@gyeolreport", "https://x.com/gyeolreport"]) expect(html).toContain(link);
  });
  it("이미 로그인한 기존 회원: 「이미 회원이시네요. 서재에서 이용권을 확인해 주세요」 + 서재", async () => {
    const html = await render(true, { status: "member" });
    expect(html).toContain(FREE_COPY.memberTitle); expect(html).toContain(FREE_COPY.memberBody); expect(html).toContain('href="/account"');
    expect(html).not.toContain(FREE_COPY.cta);
  });
  it("캠페인 종료·지급 꺼짐: 혜택 문구 없이 일반 소개 + 상품 보기", async () => {
    const html = await render(false);
    expect(html).not.toContain(FREE_COPY.benefit); expect(html).not.toContain(FREE_COPY.cta);
    expect(html).toContain(FREE_COPY.generalCta); expect(html).toContain(FREE_COPY.question);
  });
});

describe("로그인 화면 한 줄·책 끝 연결 위치", () => {
  it("로그인 화면에 카카오 채널 추가 권유 한 줄", async () => {
    const { LOGIN_CHANNEL_NOTE } = await import("@/components/account/AccountScreen");
    expect(LOGIN_CHANNEL_NOTE).toBe("카카오로 가입할 때 「결리포트 채널 추가」에 체크하면 새 소식을 받아 볼 수 있어요");
    expect(readFileSync("src/components/account/AccountScreen.tsx", "utf8")).toContain("data-login-channel-note");
  });
  it("책 끝 줄은 주인 화면에만(받은 사람 공유 화면·예시 없음), 공유 버튼 바로 아래(공유 버튼은 그대로)", () => {
    const reading = readFileSync("src/components/book/BookReading.tsx", "utf8"), reader = readFileSync("src/app/dev/book-preview/BookReader.tsx", "utf8");
    expect(reading).toContain("endNotice={!example && !shared && shareOwner && endNotice ? <BookEndNotice view={endNotice} home={home} /> : undefined}");
    expect(reader).toContain("</div></section>}{endNotice}{backAction}");
  });
});

describe("2026-11-10 정정: 고객 화면 4곳은 「증정」 표현(「1+1」·「더 드려요」 없음), 날짜는 설정값(1+1 끝)", () => {
  const NOW = Date.parse("2026-11-12T12:00:00+09:00"), ON = { GIFT_EVENT_ENABLED: "1" };
  const banned = /1\+1|더 드려요|한 권이 더/;
  it("가입 팝업·책 끝·메인 띠·/free 작은 줄 — 지시 문구 그대로", async () => {
    const { signupPopupEventLine } = await import("@/components/event/EventPopup");
    const { bookEndEventLine } = await import("@/components/book/BookReading");
    const { SIGNUP_STRIP_TEXT, SIGNUP_STRIP_EVENT } = await import("@/components/growth/GiftEventCountdown");
    const { eventEndDayLabel } = await import("@/lib/ops/config");
    const until = eventEndDayLabel(giftEventPublicView(ON, NOW).endsAt);
    expect(until).toBe("11월 30일");
    const lines = [signupPopupEventLine(until), bookEndEventLine(until), `${SIGNUP_STRIP_TEXT} · ${SIGNUP_STRIP_EVENT}`, FREE_COPY.eventLine(until)];
    expect(lines).toEqual(["11월 30일까지 한 권 결제하면 이용권 1장을 증정해요", "11월 30일까지 한 권 결제하면 이용권 1장을 증정해요. 친구에게 선물할 수도 있어요.",
      "지금 가입하면 내 책 한 권 무료 · 결제 시 이용권 증정", "11월 30일까지 한 권 결제하면 이용권 1장 증정"]);
    for (const l of lines) expect(l).not.toMatch(banned);
  });
  it("가입 팝업 화면: 서버가 준 1+1 끝(설정값)으로 날짜를 그린다 — 끝을 바꾸면 날짜도 바뀐다", async () => {
    const { EventPopup } = await import("@/components/event/EventPopup");
    const draw = (env: Record<string, string>) => renderToStaticMarkup(<EventPopup id="signup" clock={() => NOW} onDone={() => undefined}
      state={{ member: true, comp: null, event: giftEventPublicView(env, NOW), signup: { active: true, mine: { status: "available", expiresAt: new Date(NOW + 7 * 86_400_000).toISOString() } } }} />);
    expect(draw(ON)).toContain("11월 30일까지 한 권 결제하면 이용권 1장을 증정해요");
    expect(draw({ ...ON, GIFT_EVENT_END: "2026-12-15" })).toContain("12월 15일까지 한 권 결제하면 이용권 1장을 증정해요");
    expect(draw(ON)).not.toMatch(banned);
  });
  it("책 끝: 서버(bookEndNotice)가 설정값에서 날짜를 넘기고, 1+1 기간이 아니면 줄 없음", async () => {
    const { bookEndNotice } = await import("@/lib/book/storedReport");
    const { BookEndNotice } = await import("@/components/book/BookReading");
    vi.stubEnv("GIFT_EVENT_ENABLED", "1");
    const view = await bookEndNotice("report_x", false, NOW);
    expect(view).toEqual({ event: true, eventUntil: "11월 30일", signup: false });
    expect(renderToStaticMarkup(<BookEndNotice view={view} />)).toContain("11월 30일까지 한 권 결제하면 이용권 1장을 증정해요. 친구에게 선물할 수도 있어요.");
    vi.stubEnv("GIFT_EVENT_END", "2026-12-15");
    expect((await bookEndNotice("report_x", false, NOW)).eventUntil).toBe("12월 15일");
    expect(await bookEndNotice("report_x", false, Date.parse("2026-12-20T00:00:00+09:00"))).toEqual({ event: false, eventUntil: "", signup: false });
  });
});
