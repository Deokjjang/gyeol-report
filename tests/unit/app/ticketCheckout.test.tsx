import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { AccountSession } from "../../../src/lib/account/policy";
const state = vi.hoisted(() => ({ session: { status: "guest" } as AccountSession, loaded: true, error: false, pending: false }));
const hooks = vi.hoisted(() => ({ slots: [] as unknown[], index: 0, effects: [] as (() => void | (() => void))[] }));
// Explicit callback/SSR unit runner, not a DOM or hydration simulation.
vi.mock("react", async original => ({ ...await original<typeof import("react")>(),
  useState: (initial: unknown) => { const i = hooks.index++; if (!(i in hooks.slots)) hooks.slots[i] = typeof initial === "function" ? initial() : initial; return [hooks.slots[i], (v: unknown) => { hooks.slots[i] = typeof v === "function" ? v(hooks.slots[i]) : v; }]; },
  useRef: (initial: unknown) => { const i = hooks.index++; if (!(i in hooks.slots)) hooks.slots[i] = { current: initial }; return hooks.slots[i]; },
  useEffect: (fn: () => void | (() => void)) => { hooks.effects.push(fn); },
}));
vi.mock("../../../src/components/account/AccountSession", () => ({ useAccountSession: () => ({ session: state.session, loaded: state.loaded, error: state.error, refresh: vi.fn() }) }));
vi.mock("../../../src/components/book/useTicketPublication", () => ({ checkoutReturnKey: () => "return", useTicketPublication: () => ({ pending: state.pending, loaded: true, message: "", retryable: false, revision: 0, submitting: false, completedUrl: null, submit: vi.fn() }) }));
import { BookCheckout } from "../../../src/components/book/BookCheckout";
import { RUNTIME_FIXTURES } from "../interpretation-v4/runtimeFixtures";
import type { ReportInputPayload } from "../../../src/lib/report-generation/reportInputTypes";
import { formatKrw, getReportProduct } from "../../../src/lib/payment/reportProductCatalog";
const props = { payload: RUNTIME_FIXTURES[0].payload as ReportInputPayload, now: "2026-10-10T00:00:00Z", internal: false, authEnabled: true, onError() {}, onPublishing() {} };
const priceKo = formatKrw(getReportProduct(props.payload.productKey)!.amount);
const render = () => { hooks.index = 0; hooks.effects = []; return renderToStaticMarkup(<BookCheckout {...props} />); };
beforeEach(() => { hooks.slots = []; state.session = { status: "guest" }; state.loaded = true; state.error = false; state.pending = false; });
afterEach(() => { vi.unstubAllGlobals(); });
describe("member-aware receipt SSR boundaries", () => {
  it("guest sees catalog price and one 결제하기 that goes to login (P 추가 A: no guest checkout, no consent/buyer fields)", () => {
    const html = render(); expect(html).toContain(priceKo); expect(html).toContain("결제하기"); expect(html).not.toContain("발행 방법");
    expect(html).toContain("data-login-first"); expect(html).not.toContain("data-buyer-fields"); expect(html).not.toContain("birthDate=");
    expect(html).not.toMatch(/disabled=""[^>]*>결제하기/);
  });
  it("session loading/error never silently becomes guest payment", () => {
    state.loaded = false; expect(render()).toContain("로그인 상태를 확인하고 있어요"); expect(render()).not.toContain("결제하기");
    state.loaded = true; state.error = true; expect(render()).toContain("다시 확인"); expect(render()).not.toContain("결제하기");
  });
  it("member waits for real balance, no assumed zero or fake store URL", () => {
    state.session = { status: "member" }; const html = render(); expect(html).toContain("이용권을 확인하고 있어요");
    expect(html).not.toContain("남은 이용권 0장"); expect(html).not.toContain("묶음 이용권 구매"); expect(html).toMatch(/disabled=""[^>]*>결제하기/);
  });
  it("restored pending reservation remains ticket-priced, blocked, never falls back to payment", () => {
    state.session = { status: "member" }; state.pending = true; const html = render();
    expect(html).toContain("리포트 이용권 1장"); expect(html).toContain("책 발행 상태 확인 중"); expect(html).not.toContain(priceKo);
  });
  it("required member reconsent: 결제하기 goes to the consent screen first (no payment before reconsent)", () => {
    state.session = { status: "needs_consent" }; const html = render();
    expect(html).toContain("data-login-first"); expect(html).not.toContain("발행 방법"); expect(html).not.toContain("[필수]");
  });
  it.each([0, 1, 5])("real balance callback %s selects only the available method", async quantity => {
    state.session = { status: "member" };
    vi.stubGlobal("window", new EventTarget()); vi.stubGlobal("document", { hidden: false });
    // P 추가 E: 결제 화면의 장수 = 지갑의 usable(일반 + 남은 이벤트·보상, 받은 것 포함). 0장이면 이용권 칸을 아예 숨긴다.
    vi.mocked(fetch).mockResolvedValue({ ok: true, json: async () => ({ ok: true, wallet: { usable: quantity } }) } as Response);
    render(); const stop = hooks.effects[0](); for (let i = 0; i < 8; i++) await Promise.resolve();
    try {
      const html = render();
      expect(vi.mocked(fetch).mock.calls[0]?.[0]).toBe("/auth/gift?view=wallet");
      if (quantity) expect(html).toContain(`남은 이용권 ${quantity}장`);
      else { expect(html).not.toContain("발행 방법"); expect(html).not.toContain("남은 이용권"); expect(html).not.toContain("이용권 1장 쓰기"); expect(html).not.toContain("보유한 이용권이 없습니다"); }
      expect(html).toContain(quantity ? "이용권 1장으로 책 발행하기" : "결제하기");
      expect(html).not.toContain("이용권을 확인하고 있어요");
    } finally { stop?.(); }
  });
  it("failed balance callback is an error, not zero tickets or an enabled payment", async () => {
    state.session = { status: "member" }; vi.stubGlobal("window", new EventTarget()); vi.stubGlobal("document", { hidden: false });
    vi.mocked(fetch).mockRejectedValue(Error("OFFLINE")); render(); const stop = hooks.effects[0](); for (let i = 0; i < 8; i++) await Promise.resolve();
    try { const html = render(); expect(html).toContain("이용권을 확인하지 못했어요"); expect(html).not.toContain("남은 이용권 0장"); expect(html).toMatch(/disabled=""[^>]*>결제하기/); }
    finally { stop?.(); }
  });
});
