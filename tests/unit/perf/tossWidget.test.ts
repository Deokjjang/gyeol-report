// P 추가 G: 결제 실행기의 키 종류 분기(대역 SDK, 외부 호출 0).
// 지금 키(API 개별 연동 ck) = 예전 그대로 토스페이 결제창, 위젯 연동 키(gck) = 우리 시트 안 결제위젯(수단은 토스 어드민 설정).
import { describe, expect, it, vi } from "vitest";
import { isTossWidgetClientKey, launchTossCheckout, TOSS_WIDGET_ANONYMOUS } from "@/lib/payment/tossClientCheckoutLauncher";

const request = (clientKey: string) => ({ provider: "toss", clientKey, requestPayment: { method: "CARD", orderId: "gyeol_order_123456", orderName: "사주×MBTI 종합 리포트", amount: { currency: "KRW", value: 3900 },
  successUrl: "https://www.gyeolreport.com/payments/toss/success", failUrl: "https://www.gyeolreport.com/payments/toss/fail", customerName: "하람", customerEmail: "a@b.co" }, metadata: { paymentOrderId: "po_123", productType: "saju_mbti_full" } });
function sdk() {
  const calls: string[] = [];
  const widgets = { setAmount: vi.fn(async () => { calls.push("setAmount"); }), renderPaymentMethods: vi.fn(async () => { calls.push("methods"); }), renderAgreement: vi.fn(async () => { calls.push("agreement"); }), requestPayment: vi.fn(async () => { calls.push("request"); }) };
  const windowPay = { requestPayment: vi.fn(async () => { calls.push("window"); }) };
  return { calls, widgets, windowPay, client: { payment: vi.fn(() => windowPay), widgets: vi.fn(() => widgets) } };
}
const sheet = (go: boolean) => ({ open: vi.fn(async () => ({ methods: "#m", agreement: "#a" })), waitForPay: vi.fn(async () => go), close: vi.fn() });

describe("토스 결제 실행기 키 분기", () => {
  it("위젯 연동 키 판별: test_gck_/live_gck_만", () => {
    expect(isTossWidgetClientKey("test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm")).toBe(true);
    expect(isTossWidgetClientKey("live_gck_abc")).toBe(true);
    expect(isTossWidgetClientKey("test_ck_abc")).toBe(false);
    expect(isTossWidgetClientKey("live_ck_abc")).toBe(false);
  });
  it("지금 키(ck): 예전 그대로 결제창 + 토스페이 바로(위젯·시트를 쓰지 않는다)", async () => {
    const s = sdk(), sh = sheet(true);
    const r = await launchTossCheckout({ tossCheckoutRequest: request("test_ck_abc"), customerKey: "gyeol_local_test_customer", easyPay: "TOSSPAY", loadTossPayments: async () => s.client, widgetSheet: sh });
    expect(r).toEqual({ ok: true, status: "redirect_requested" });
    expect(s.windowPay.requestPayment).toHaveBeenCalledWith(expect.objectContaining({ orderId: "gyeol_order_123456", card: { flowMode: "DIRECT", easyPay: "TOSSPAY" } }));
    expect(s.client.widgets).not.toHaveBeenCalled(); expect(sh.open).not.toHaveBeenCalled();
  });
  it("위젯 키(gck): 금액 먼저 → 결제수단·약관 그리기 → 시트의 결제하기 → 서버가 준비한 주문번호·금액 그대로 요청", async () => {
    const s = sdk(), sh = sheet(true);
    const r = await launchTossCheckout({ tossCheckoutRequest: request("test_gck_abc"), customerKey: "gyeol_local_test_customer", easyPay: "TOSSPAY", loadTossPayments: async () => s.client, widgetSheet: sh });
    expect(r).toEqual({ ok: true, status: "redirect_requested" });
    expect(s.client.widgets).toHaveBeenCalledWith({ customerKey: TOSS_WIDGET_ANONYMOUS });
    expect(s.calls[0]).toBe("setAmount");
    expect(s.widgets.setAmount).toHaveBeenCalledWith({ currency: "KRW", value: 3900 });
    expect(s.widgets.renderPaymentMethods).toHaveBeenCalledWith({ selector: "#m", variantKey: "DEFAULT" });
    expect(s.widgets.renderAgreement).toHaveBeenCalledWith({ selector: "#a", variantKey: "AGREEMENT" });
    expect(s.calls.at(-1)).toBe("request");
    expect(s.widgets.requestPayment).toHaveBeenCalledWith({ orderId: "gyeol_order_123456", orderName: "사주×MBTI 종합 리포트", successUrl: "https://www.gyeolreport.com/payments/toss/success", failUrl: "https://www.gyeolreport.com/payments/toss/fail", customerEmail: "a@b.co", customerName: "하람" });
    expect(s.windowPay.requestPayment).not.toHaveBeenCalled();
  });
  it("위젯 키: 시트를 닫으면 결제를 요청하지 않고 취소로 끝난다, 시트가 없으면 위젯 키로는 결제하지 않는다", async () => {
    const s = sdk(), sh = sheet(false);
    const r = await launchTossCheckout({ tossCheckoutRequest: request("test_gck_abc"), customerKey: "k".repeat(22), easyPay: "TOSSPAY", loadTossPayments: async () => s.client, widgetSheet: sh });
    expect(r).toMatchObject({ ok: false, error: { code: "TOSS_CLIENT_CHECKOUT_CANCELED" } });
    expect(s.widgets.requestPayment).not.toHaveBeenCalled(); expect(sh.close).toHaveBeenCalled();
    const s2 = sdk();
    expect(await launchTossCheckout({ tossCheckoutRequest: request("test_gck_abc"), customerKey: "k".repeat(22), easyPay: "TOSSPAY", loadTossPayments: async () => s2.client })).toMatchObject({ ok: false, error: { code: "TOSS_CLIENT_CHECKOUT_REQUEST_FAILED" } });
    expect(s2.windowPay.requestPayment).not.toHaveBeenCalled();
  });
});
