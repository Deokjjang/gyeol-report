// v5 최종3 배포 차단 위험 2·3: WRITER_V5_PRODUCTS 서버 시작 경고, 대운·세운 승인 전 차단, 배포 빌드의 /dev/* 404.
import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LAUNCH_V5_PRODUCTS_VALUE, writerV5Products, writerV5ProductsWarning } from "../../../src/lib/writer/flags";
import { register } from "../../../src/instrumentation";
import { devRoutesBlocked, isDevPath } from "../../../src/lib/devRouteGate";
import { config, proxy } from "../../../src/proxy";
import { closedProductOrder, confirmPaidReport } from "../../../src/lib/payment/paidReportReliability";
import type { ReliabilityStore } from "../../../src/lib/payment/paidReportReliabilityStore";

afterEach(() => { vi.unstubAllEnvs(); vi.restoreAllMocks(); });

describe("WRITER_V5_PRODUCTS (운영 값 = 출시 4종)", () => {
  it("정확한 값 문자열: 쉼표 구분 상품 키 4개", () => {
    // AM: 12/1부터 대운·세운도 v5(판매는 별도 설정값).
    expect(LAUNCH_V5_PRODUCTS_VALUE).toBe("saju_mbti_full,career_money_study,love_marriage_child,saju_mbti_compatibility,major_fortune,annual_fortune");
    expect(writerV5Products({ WRITER_V5_PRODUCTS: LAUNCH_V5_PRODUCTS_VALUE })).toEqual(["saju_mbti_full", "career_money_study", "love_marriage_child", "saju_mbti_compatibility", "major_fortune", "annual_fortune"]);
    expect(writerV5ProductsWarning({ WRITER_V5_PRODUCTS: LAUNCH_V5_PRODUCTS_VALUE })).toBeNull();
    // 순서·공백은 상관없다(코드가 trim·중복 제거).
    expect(writerV5ProductsWarning({ WRITER_V5_PRODUCTS: " annual_fortune,major_fortune,saju_mbti_compatibility, love_marriage_child,career_money_study ,saju_mbti_full,saju_mbti_full" })).toBeNull();
  });
  it.each([
    // AM: 운영 값이 6상품(대운·세운 v5)이 됐다 — 출시 4종만 넣은 지금 운영 값은 경고(배포 때 바꾼다, 9부 계획).
    ["비어 있음", undefined, { parsed: [], missing: 6, extra: [], ignored: [] }, "6상품 모두 V4"],
    ["빈 문자열", "", { parsed: [], missing: 6, extra: [], ignored: [] }, "6상품 모두 V4"],
    ["상품 이름 대신 주소 조각(slug)", "saju-mbti-full,career-money-study", { parsed: [], missing: 6, extra: [], ignored: ["saju-mbti-full", "career-money-study"] }, "6상품 모두 V4"],
    ["출시 4종만(지금 운영 값)", "saju_mbti_full,career_money_study,love_marriage_child,saju_mbti_compatibility", { missing: 2, extra: [], ignored: [] }, "운영 값(6상품)과 다릅니다"],
    ["3종만", "saju_mbti_full,career_money_study,love_marriage_child", { missing: 3, extra: [], ignored: [] }, "빠진 상품은 V4"],
  ])("%s → 경고 한 줄", (_label, value, shape, words) => {
    const line = writerV5ProductsWarning(value === undefined ? {} : { WRITER_V5_PRODUCTS: value });
    expect(line).not.toBeNull();
    const w = JSON.parse(line!) as { event: string; message: string; expected: string; parsed: string[]; missing: string[]; extra: string[]; ignored: string[] };
    expect(w.event).toBe("WRITER_V5_PRODUCTS_MISMATCH");
    expect(w.expected).toBe(LAUNCH_V5_PRODUCTS_VALUE);
    expect(w.message).toContain(words);
    if ("parsed" in shape) expect(w.parsed).toEqual(shape.parsed);
    expect(w.missing).toHaveLength(shape.missing);
    expect(w.extra).toEqual(shape.extra);
    expect(w.ignored).toEqual(shape.ignored);
  });
  it("서버 시작(instrumentation register): 다르면 console.warn 한 번, 같으면 없음, edge 런타임은 건너뜀", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.stubEnv("NEXT_RUNTIME", "nodejs");
    vi.stubEnv("WRITER_V5_PRODUCTS", "");
    await register();
    expect(warn).toHaveBeenCalledTimes(1);
    expect(JSON.parse(String(warn.mock.calls[0][0]))).toMatchObject({ event: "WRITER_V5_PRODUCTS_MISMATCH", parsed: [] });
    warn.mockClear();
    vi.stubEnv("WRITER_V5_PRODUCTS", LAUNCH_V5_PRODUCTS_VALUE);
    await register();
    expect(warn).not.toHaveBeenCalled();
    vi.stubEnv("NEXT_RUNTIME", "edge"); vi.stubEnv("WRITER_V5_PRODUCTS", "");
    await register();
    expect(warn).not.toHaveBeenCalled();
  });
});

describe("대운·세운 판매 중지: 승인 전 주문은 토스 승인을 부르지 않는다", () => {
  const order = (product_type: string, status = "ready") => ({ ok: true, order: { provider_order_id: "o-1", status, product_type } });
  const storeWith = (found: unknown) => { const call = vi.fn(async (action: string) => action === "find_order" ? found : action === "confirm_claim" ? { ok: true, token: "t" } : { ok: true, reportId: "r-1" }); return { call } as unknown as ReliabilityStore & { call: typeof call }; };
  it.each([
    ["major_fortune", "ready", undefined, true], ["annual_fortune", "ready", undefined, true],
    ["saju_mbti_full", "ready", undefined, false], ["major_fortune", "paid", undefined, false], ["annual_fortune", "ready", "1", false],
  ] as const)("%s(%s, FORTUNE_SALES_OPEN=%s) → 막음 %s", async (product, status, open, blocked) => {
    if (open) { vi.stubEnv("FORTUNE_SALES_OPEN", open); vi.stubEnv("FORTUNE_SALES_OPEN_AT_TEST", "2000-01-01T00:00:00+09:00"); vi.stubEnv("FORTUNE_PRICE_MAJOR_KRW", "5900"); vi.stubEnv("FORTUNE_PRICE_ANNUAL_KRW", "3900"); }
    const store = storeWith(order(product, status)), confirm = vi.fn(async () => ({ ok: true as const, confirm: { provider: "toss" as const, paymentKeyReceived: true as const, orderId: "o-1", amount: 1490, status: "DONE" } }));
    expect(await closedProductOrder(store, "o-1")).toBe(blocked);
    store.call.mockClear();
    const result = await confirmPaidReport({ orderId: "o-1", paymentKey: "k", amount: 1490 }, store, confirm, id => closedProductOrder(store, id));
    if (blocked) { expect(result).toEqual({ ok: false, code: "PRODUCT_SALES_CLOSED" }); expect(confirm).not.toHaveBeenCalled(); expect(store.call.mock.calls.map(([a]) => a)).toEqual(["find_order"]); }
    else expect(store.call.mock.calls.map(([a]) => a)).toEqual(["find_order", "confirm_claim", "confirm_finish"]);
  });
  it("주문 조회 실패·다른 주문 번호는 막지 않는다(기존 흐름)", async () => {
    expect(await closedProductOrder(storeWith({ ok: false, code: "DURABLE_STORAGE_FAILED" }), "o-1")).toBe(false);
    expect(await closedProductOrder(storeWith({ ok: true, order: { provider_order_id: "other", status: "ready", product_type: "major_fortune" } }), "o-1")).toBe(false);
    expect(await closedProductOrder({ call: async () => { throw new Error("down"); } }, "o-1")).toBe(false);
  });
  it("salesGate를 넘기지 않는 내부 호출(결제 복구·시험 도구)은 기존과 같다", async () => {
    const store = storeWith(order("major_fortune"));
    await confirmPaidReport({ orderId: "o-1", paymentKey: "k", amount: 1490 }, store, async () => ({ ok: true as const, confirm: { provider: "toss" as const, paymentKeyReceived: true as const, orderId: "o-1", amount: 1490, status: "DONE" } }));
    expect(store.call.mock.calls.map(([a]) => a)).toEqual(["confirm_claim", "confirm_finish"]);
  });
});

describe("/dev/* : 배포 빌드(NODE_ENV=production)에서는 404, 로컬 개발은 그대로", () => {
  it("판정 함수: production만 막는다(요청 값으로 못 연다)", () => {
    expect(devRoutesBlocked({ NODE_ENV: "production" })).toBe(true);
    expect(devRoutesBlocked({ NODE_ENV: "production", COMPREHENSIVE_DEV_PREVIEW_ENABLED: "1", MAJOR_FORTUNE_DEV_PREVIEW_ENABLED: "1" })).toBe(true);
    expect(devRoutesBlocked({ NODE_ENV: "development" })).toBe(false);
    expect(devRoutesBlocked({ NODE_ENV: "test" })).toBe(false);
    expect(["/dev", "/dev/", "/dev/v5-login", "/dev/book-preview", "/dev/account/api/x"].every(isDevPath)).toBe(true);
    expect(["/developer", "/devices", "/reports/report_x", "/r/token", "/"].some(isDevPath)).toBe(false);
  });
  it("proxy: matcher는 /dev/:path*만, production에서 /dev/* 404, 개발에서는 통과", () => {
    expect(config).toEqual({ matcher: ["/dev/:path*"] });
    vi.stubEnv("NODE_ENV", "production");
    for (const path of ["/dev/v5-login?next=/reports/x", "/dev/book-preview", "/dev/account/api/ticket-redeem", "/dev"]) {
      const r = proxy(new NextRequest(`https://www.gyeolreport.com${path}`));
      expect(r.status).toBe(404);
      expect(r.headers.get("x-middleware-next")).toBeNull();
    }
    // 리더·공유 주소는 matcher 밖이지만, 넓혀도 막지 않는다.
    expect(proxy(new NextRequest("https://www.gyeolreport.com/reports/report_abcdef0123456789")).headers.get("x-middleware-next")).toBe("1");
    vi.stubEnv("NODE_ENV", "development");
    expect(proxy(new NextRequest("http://localhost:3800/dev/v5-login")).headers.get("x-middleware-next")).toBe("1");
  });
});
