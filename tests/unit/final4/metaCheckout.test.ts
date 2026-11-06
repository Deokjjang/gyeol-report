/**
 * 최종 A 20: Meta 이벤트 확인.
 * - InitiateCheckout: 동의한 경우에만, 토스 결제창을 여는 순간 1회(주문서를 여는 때가 아님). 동의 전에 중복 방지 표시를 남기지 않는다.
 * - Purchase: 유료 결제 1건당 1회(주문 id로 중복 제거), 값 = 주문 금액(새 주문 3,900 KRW). 이용권·보상은 Purchase가 아니다.
 */
import { readdirSync, readFileSync } from "node:fs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { metaProduct, metaPurchase } from "../../../src/lib/analytics/events";

const storage = () => { const values = new Map<string, string>(); return { keys: () => [...values.keys()], getItem: (k: string) => values.get(k) ?? null, setItem: (k: string, v: string) => values.set(k, v), removeItem: (k: string) => values.delete(k), clear: () => values.clear() }; };
beforeEach(() => {
  vi.resetModules();
  vi.stubGlobal("sessionStorage", storage()); vi.stubGlobal("localStorage", storage());
  vi.stubGlobal("window", { location: { origin: "https://www.gyeolreport.com", hostname: "www.gyeolreport.com", pathname: "/report/new", search: "", hash: "" }, dispatchEvent: () => true });
  vi.stubGlobal("fetch", vi.fn(async () => ({ ok: true, json: async () => ({ ok: true }) })));
  vi.stubEnv("NODE_ENV", "production");
});
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });
const metaCalls = () => vi.mocked(fetch).mock.calls.filter(([url]) => url === "/api/analytics/meta").map(([, init]) => JSON.parse(String(init?.body)));

describe("InitiateCheckout", () => {
  it("동의 전에는 안 나가고 표시도 남기지 않는다 → 같은 탭에서 동의 뒤 결제창을 열면 한 번 나간다", async () => {
    const client = await import("../../../src/lib/analytics/client");
    client.interaction("checkout_started", "saju_mbti_full");
    expect(metaCalls()).toHaveLength(0);
    expect((sessionStorage as unknown as { keys(): string[] }).keys().filter(k => k.startsWith("gyeol:event:"))).toEqual([]);
    client.setMetaChoice(true);
    client.interaction("checkout_started", "saju_mbti_full");
    client.interaction("checkout_started", "saju_mbti_full");
    expect(metaCalls()).toEqual([{ event: "InitiateCheckout", productType: "saju_mbti_full", requestId: expect.any(String) }]);
  });
  it("값은 상품 표 가격(출시 4종 3,900 KRW, num_items 1)", () => {
    expect(metaProduct("InitiateCheckout", "career_money_study")).toEqual({ event: "InitiateCheckout", params: { content_ids: ["career_money_study"], content_type: "product", value: 3900, currency: "KRW", num_items: 1 } });
  });
  it("결제창을 여는 순간에만: 준비 성공 → onCheckoutWindow 1회 → 토스 창. 준비 실패면 0회", async () => {
    const { runDevTossCheckout } = await import("../../../src/components/payment/DevTossCheckoutLauncher");
    const snap = { displayName: "검사", birthDate: "1990-01-01", calendarType: "SOLAR", timezone: "Asia/Seoul", birthTime: "", birthTimeUnknown: true, approximateBirthTimeSlot: "", gender: "FEMALE", mbtiType: "" } as never;
    const all = { inputAccuracy: true, digitalReportStart: true, refundRestriction: true, policyAgreement: true, age14OrOlder: true, minorLegalRepresentative: false };
    const order: string[] = [];
    const runtime = (ok: boolean) => ({
      fetch: async () => ({ ok, json: async () => ok ? { ok: true, tossCheckoutRequest: { x: 1 } } : { ok: false } }),
      loadTossPayments: async () => ({}) as never,
      launchTossCheckout: async () => { order.push("window"); return { ok: true, status: "redirect_requested" } as never; },
    });
    const onCheckoutWindow = vi.fn(() => order.push("initiate"));
    await runDevTossCheckout(snap, all, runtime(true) as never, { productType: "saju_mbti_full", easyPay: "TOSSPAY", onCheckoutWindow });
    expect(onCheckoutWindow).toHaveBeenCalledTimes(1); expect(order).toEqual(["initiate", "window"]);
    onCheckoutWindow.mockClear(); order.length = 0;
    await runDevTossCheckout(snap, all, runtime(false) as never, { productType: "saju_mbti_full", easyPay: "TOSSPAY", onCheckoutWindow });
    expect(onCheckoutWindow).not.toHaveBeenCalled(); expect(order).toEqual([]);
  });
  it("주문서·옛 결제 화면은 열릴 때 checkout_started를 부르지 않는다(결제창 열 때만)", () => {
    for (const f of ["src/components/book/BookCheckout.tsx", "src/components/payment/DevTossCheckoutLauncher.tsx"]) {
      const src = readFileSync(f, "utf8");
      expect(src).not.toMatch(/useEffect\([^)]*checkout_started/);
      expect(src).toMatch(/onCheckoutWindow: \(\) => interaction\("checkout_started"/);
    }
  });
});

describe("Purchase", () => {
  it("값은 서버가 준 주문 금액 그대로(새 주문 3,900 / 예전 주문 1,490), 이벤트 id 모양이 맞아야 함", () => {
    expect(metaPurchase({ eventId: `purchase_${"a".repeat(32)}`, productType: "saju_mbti_full", value: 3900, currency: "KRW" })!.params).toMatchObject({ value: 3900, currency: "KRW", num_items: 1 });
    expect(metaPurchase({ eventId: `purchase_${"b".repeat(32)}`, productType: "saju_mbti_full", value: 1490, currency: "KRW" })!.params.value).toBe(1490);
    expect(metaPurchase({ eventId: "ticket_x", productType: "saju_mbti_full", value: 3900, currency: "KRW" })).toBeNull();
  });
  it("브라우저가 직접 보내는 Purchase는 막힌다(서버 확인 사실만)", async () => {
    const client = await import("../../../src/lib/analytics/client"); client.setMetaChoice(true);
    client.sendMeta({ event: "Purchase", params: { value: 3900 } }, "fake");
    expect(metaCalls()).toHaveLength(0);
  });
  it("SQL: 토스 유료 결제 주문만, 주문 id로 1회, 값 = o.amount — 이용권·보상 지급 경로는 Purchase를 만들지 않는다", () => {
    const sql = readFileSync("supabase/migrations/20261020062611_v4_meta_registration_delivery.sql", "utf8");
    const fn = sql.slice(sql.indexOf("create function public.queue_meta_purchase"), sql.indexOf("create function public.meta_delivery_batch"));
    expect(fn).toMatch(/status='paid'[\s\S]*provider='toss'[\s\S]*amount>0[\s\S]*refunded_at is null/);
    expect(fn).toContain("'purchase_'||md5('gyeol:paid-order:'||o.payment_order_id)");
    expect(fn).toContain("on conflict(order_id) do nothing");
    expect(fn).toContain("jsonb_build_object('value',o.amount,'currency','KRW'");
    for (const dir of ["src/lib/tickets", "src/lib/ops/gift", "src/lib/ops/comp"]) {
      const files = (readdirSync(dir, { recursive: true }) as string[]).filter(f => /\.tsx?$/.test(f));
      expect(files.length).toBeGreaterThan(0);
      for (const f of files) expect(readFileSync(`${dir}/${f}`, "utf8")).not.toMatch(/queue_meta_purchase|"Purchase"|dispatchPurchase/);
    }
  });
});
