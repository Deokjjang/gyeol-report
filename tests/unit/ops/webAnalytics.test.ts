// OPS-1: Web Analytics beforeSend(쿼리·id·토큰 지움, 막는 화면) · 이벤트 속성(상품 키·채널만) · 공유 링크 from=share.
import { afterEach, describe, expect, it, vi } from "vitest";
const va = vi.hoisted(() => ({ track: vi.fn() }));
vi.mock("@vercel/analytics", () => ({ track: va.track }));
import { sanitizeAnalyticsUrl, webEvent, webEventOnce, webEventProps, withShareFrom, WEB_EVENTS } from "../../../src/lib/analytics/web";

const O = "https://www.gyeol-report.com";

describe("beforeSend 주소 정리", () => {
  it("쿼리를 지우고 from=share만 남긴다", () => {
    expect(sanitizeAnalyticsUrl(`${O}/report/new?product=love-marriage-child&utm_source=x`)).toBe(`${O}/report/new`);
    expect(sanitizeAnalyticsUrl(`${O}/r/AbC123token?from=share&ref=zz#k`)).toBe(`${O}/r/[token]?from=share`);
    expect(sanitizeAnalyticsUrl(`${O}/?from=evil`)).toBe(`${O}/`);
  });
  it("동적 경로 id · 토큰을 자리표시로", () => {
    expect(sanitizeAnalyticsUrl(`${O}/reports/rep_3b02d8abc`)).toBe(`${O}/reports/[reportId]`);
    expect(sanitizeAnalyticsUrl(`${O}/gift/g_TOKEN123`)).toBe(`${O}/gift/[token]`);
    expect(sanitizeAnalyticsUrl(`${O}/r/tok/book-og`)).toBe(`${O}/r/[token]/book-og`);
  });
  it("관리자 · API · 개발 · 결제 콜백은 보내지 않는다", () => {
    for (const p of ["/admin/orders/GR-6AA2", "/api/funnel", "/dev/book-flow", "/payments/toss/success?paymentKey=k&orderId=o", "/account/tickets/checkout/success"])
      expect(sanitizeAnalyticsUrl(`${O}${p}`)).toBeNull();
    expect(sanitizeAnalyticsUrl(`${O}/account`)).toBe(`${O}/account`);
  });
});

describe("이벤트 속성", () => {
  it("7개 이벤트 이름", () => expect([...WEB_EVENTS]).toEqual(["cover_open", "input_done", "checkout_open", "paid", "book_open", "share_click", "share_landing"]));
  it("상품 키만(모르는 값 other), share_click만 channel", () => {
    expect(webEventProps("cover_open", { product: "love_marriage_child" })).toEqual({ product: "love_marriage_child" });
    expect(webEventProps("paid", { product: "홍길동 1990-01-01" })).toEqual({ product: "other" });
    expect(webEventProps("share_click", { product: "annual_fortune", channel: "kakao" })).toEqual({ product: "annual_fortune", channel: "kakao" });
    expect(webEventProps("share_click", { product: "annual_fortune", channel: "me@x.com" })).toEqual({ product: "annual_fortune", channel: "other" });
    expect(webEventProps("book_open", { product: "saju_mbti_full", channel: "kakao" })).toEqual({ product: "saju_mbti_full" });
  });
});

describe("공유 링크 from=share", () => {
  it("붙이고 다른 쿼리는 그대로, 잘못된 주소는 그대로", () => {
    expect(withShareFrom(`${O}/r/tok`)).toBe(`${O}/r/tok?from=share`);
    expect(withShareFrom(`${O}/r/tok?ref=abc`)).toBe(`${O}/r/tok?ref=abc&from=share`);
    expect(withShareFrom("")).toBe("");
    expect(withShareFrom("not a url")).toBe("not a url");
  });
});

describe("보내기(track)", () => {
  afterEach(() => { vi.unstubAllGlobals(); va.track.mockReset(); });
  const browserLike = (tester = false) => { const m = new Map<string, string>(); const store = { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), removeItem: (k: string) => void m.delete(k) };
    vi.stubGlobal("window", { localStorage: store, sessionStorage: store }); vi.stubGlobal("localStorage", store); vi.stubGlobal("sessionStorage", store); if (tester) store.setItem("gyeol-test-browser-v1", "1"); };
  it("7개 이벤트가 정해진 속성만으로 track에 넘어간다", () => {
    browserLike();
    for (const name of WEB_EVENTS) webEvent(name, { product: "career_money_study", channel: "copy", name: "홍길동", email: "a@b.co" } as never);
    expect(va.track.mock.calls).toEqual(WEB_EVENTS.map(n => [n, n === "share_click" ? { product: "career_money_study", channel: "copy" } : { product: "career_money_study" }]));
  });
  it("한 번만(같은 키) · 시험 브라우저 · 서버에서는 보내지 않는다", () => {
    browserLike();
    expect(webEventOnce("share_landing", { product: "annual_fortune" }, "tok")).toBe(true);
    expect(webEventOnce("share_landing", { product: "annual_fortune" }, "tok")).toBe(false);
    vi.unstubAllGlobals(); browserLike(true);
    expect(webEvent("paid", { product: "annual_fortune" })).toBe(false);
    vi.unstubAllGlobals();
    expect(webEvent("paid", { product: "annual_fortune" })).toBe(false);
    expect(va.track).toHaveBeenCalledTimes(1);
  });
});
