// v5 최종3 배포 차단 위험 2·3(AM2-14 5부로 고침): v5 작가 상품 상수, 대운·세운 승인 전 차단, 배포 빌드의 /dev/* 404.
import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { LAUNCH_V5_PRODUCTS_VALUE, writerV5Products } from "../../../src/lib/writer/flags";
import { devRoutesBlocked, isDevPath } from "../../../src/lib/devRouteGate";
import { config, proxy } from "../../../src/proxy";
import { closedProductOrder, confirmPaidReport } from "../../../src/lib/payment/paidReportReliability";
import type { ReliabilityStore } from "../../../src/lib/payment/paidReportReliabilityStore";

afterEach(() => { vi.unstubAllEnvs(); vi.restoreAllMocks(); });

// AM2-14 5부(덕짱님 결정 2026-11-24): v5 작가 상품은 코드 상수(6상품) — 운영 env WRITER_V5_PRODUCTS를 읽지 않고, 서버 시작 경고(instrumentation)도 없다.
describe("v5 작가 상품 = 코드 상수 6상품", () => {
  it("env가 없거나 4종만 담겨 있어도 6상품", () => {
    expect(LAUNCH_V5_PRODUCTS_VALUE).toBe("saju_mbti_full,career_money_study,love_marriage_child,saju_mbti_compatibility,major_fortune,annual_fortune");
    for (const v of [undefined, "", "saju_mbti_full,career_money_study,love_marriage_child,saju_mbti_compatibility", "saju-mbti-full"]) {
      if (v === undefined) vi.stubEnv("WRITER_V5_PRODUCTS", undefined as never); else vi.stubEnv("WRITER_V5_PRODUCTS", v);
      expect(writerV5Products()).toEqual(["saju_mbti_full", "career_money_study", "love_marriage_child", "saju_mbti_compatibility", "major_fortune", "annual_fortune"]);
    }
  });
  it("서버 시작 경고(WRITER_V5_PRODUCTS_MISMATCH · instrumentation)는 없앴다", () => {
    expect(existsSync("src/instrumentation.ts")).toBe(false);
    expect(readFileSync("src/lib/writer/flags.ts", "utf8")).not.toMatch(/process\.env|WRITER_V5_PRODUCTS_MISMATCH/);
  });
});

describe("대운·세운 판매 중지: 승인 전 주문은 토스 승인을 부르지 않는다", () => {
  const order = (product_type: string, status = "ready") => ({ ok: true, order: { provider_order_id: "o-1", status, product_type } });
  const storeWith = (found: unknown) => { const call = vi.fn(async (action: string) => action === "find_order" ? found : action === "confirm_claim" ? { ok: true, token: "t" } : { ok: true, reportId: "r-1" }); return { call } as unknown as ReliabilityStore & { call: typeof call }; };
  it.each([
    ["major_fortune", "ready", undefined, true], ["annual_fortune", "ready", undefined, true],
    ["saju_mbti_full", "ready", undefined, false], ["major_fortune", "paid", undefined, false], ["annual_fortune", "ready", "1", false],
  ] as const)("%s(%s, 판매 시작 지남=%s) → 막음 %s", async (product, status, open, blocked) => {
    // AM2-14 5부: 판매는 시각만으로 열린다(시험용 시각 바꾸기 — 운영 빌드는 읽지 않는다).
    vi.stubEnv("FORTUNE_SALES_OPEN_AT_TEST", open ? "2000-01-01T00:00:00+09:00" : "2099-01-01T00:00:00+09:00");
    const store = storeWith(order(product, status)), confirm = vi.fn(async () => ({ ok: true as const, confirm: { provider: "toss" as const, paymentKeyReceived: true as const, orderId: "o-1", amount: 1490, status: "DONE" } }));
    expect(await closedProductOrder(store, "o-1", async () => false)).toBe(blocked ? "PRODUCT_SALES_CLOSED" : null);
    store.call.mockClear();
    const result = await confirmPaidReport({ orderId: "o-1", paymentKey: "k", amount: 1490 }, store, confirm, id => closedProductOrder(store, id, async () => false));
    if (blocked) { expect(result).toEqual({ ok: false, code: "PRODUCT_SALES_CLOSED" }); expect(confirm).not.toHaveBeenCalled(); expect(store.call.mock.calls.map(([a]) => a)).toEqual(["find_order"]); }
    else expect(store.call.mock.calls.map(([a]) => a)).toEqual(["find_order", "confirm_claim", "confirm_finish"]);
  });
  it("주문 조회 실패·다른 주문 번호는 막지 않는다(기존 흐름)", async () => {
    expect(await closedProductOrder(storeWith({ ok: false, code: "DURABLE_STORAGE_FAILED" }), "o-1", async () => true)).toBeNull();
    expect(await closedProductOrder(storeWith({ ok: true, order: { provider_order_id: "other", status: "ready", product_type: "major_fortune" } }), "o-1", async () => true)).toBeNull();
    expect(await closedProductOrder({ call: async () => { throw new Error("down"); } }, "o-1", async () => true)).toBeNull();
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
