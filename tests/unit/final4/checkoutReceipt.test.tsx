/**
 * 최종 A 16: 발행 주문서 — 3,900원(가격 표), 이벤트 기간만 1+1 줄, 결제 동의 한 칸 「주문 내용과 환불 안내를 확인했어요」,
 * 맨 아래 작은 회색 두 줄(환불 · 예시 보기 / AI 작성), 동의 기록에 화면 판·문구·체크 시각.
 */
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { AccountSession } from "../../../src/lib/account/policy";
const state = vi.hoisted(() => ({ session: { status: "guest" } as AccountSession, pending: false }));
const hooks = vi.hoisted(() => ({ slots: [] as unknown[], index: 0, effects: [] as (() => void | (() => void))[] }));
vi.mock("react", async original => ({ ...await original<typeof import("react")>(),
  useState: (initial: unknown) => { const i = hooks.index++; if (!(i in hooks.slots)) hooks.slots[i] = typeof initial === "function" ? initial() : initial; return [hooks.slots[i], (v: unknown) => { hooks.slots[i] = typeof v === "function" ? v(hooks.slots[i]) : v; }]; },
  useRef: (initial: unknown) => { const i = hooks.index++; if (!(i in hooks.slots)) hooks.slots[i] = { current: initial }; return hooks.slots[i]; },
  useEffect: (fn: () => void | (() => void)) => { hooks.effects.push(fn); },
}));
vi.mock("../../../src/components/account/AccountSession", () => ({ useAccountSession: () => ({ session: state.session, loaded: true, error: false, refresh: vi.fn() }) }));
vi.mock("../../../src/components/book/useTicketPublication", () => ({ checkoutReturnKey: () => "return", useTicketPublication: () => ({ pending: state.pending, loaded: true, message: "", retryable: false, revision: 0, submitting: false, completedUrl: null, submit: vi.fn() }) }));
const interaction = vi.hoisted(() => vi.fn());
vi.mock("../../../src/lib/analytics/client", () => ({ interaction, syncLocalFacts: vi.fn() }));
import { BookCheckout, GIFT_EVENT_RECEIPT_GUEST_LINE, GIFT_EVENT_RECEIPT_LINE } from "../../../src/components/book/BookCheckout";
import { RUNTIME_FIXTURES } from "../interpretation-v4/runtimeFixtures";
import type { ReportInputPayload } from "../../../src/lib/report-generation/reportInputTypes";
import { AI_WRITTEN_RECEIPT_LINE_KO, RECEIPT_REFUND_LINE_KO, RECEIPT_TICKET_REFUND_LINE_KO } from "../../../src/lib/legal/aiNotice";
import { CHECKOUT_CONSENT_UI_VERSION, createCheckoutConsentAssertion, createCheckoutConsentEvidence, ORDER_REFUND_CONSENT_TEXT } from "../../../src/lib/payment/checkoutConsent";
import { RECEIPT_CONSENTS } from "../../../src/app/dev/book-preview/model";
import { isDevTossCheckoutLegalConfirmationComplete, emptyDevTossCheckoutLegalConfirmations } from "../../../src/components/payment/DevTossCheckoutLauncher";

const payload = RUNTIME_FIXTURES[0].payload as ReportInputPayload;
const base = { payload, now: "2026-11-08T00:00:00Z", internal: false, authEnabled: true, v5Book: true, onError() {}, onPublishing() {} };
const render = (extra: Record<string, unknown> = {}) => { hooks.index = 0; hooks.effects = []; return renderToStaticMarkup(<BookCheckout {...base} {...extra} />); };
const text = (html: string) => html.replace(/<[^>]+>/g, "");
beforeEach(() => { hooks.slots = []; state.session = { status: "guest" }; state.pending = false; interaction.mockClear(); });
afterEach(() => { vi.unstubAllGlobals(); });

describe("발행 주문서 (최종 A 16)", () => {
  it("가격은 상품 표 3,900원, 이벤트 밖이면 1+1 줄 없음", () => {
    const html = render();
    expect(payload.productKey).toBe("saju_mbti_full");
    expect(text(html)).toContain("3,900원"); expect(html).not.toContain("1,490원");
    expect(html).not.toContain("data-gift-event-line"); expect(html).not.toContain("1+1");
  });
  it("이벤트 기간만 한 줄: 회원은 「1+1 · 결제 후 무료 이용권 1장」, 비회원은 로그인 조건", () => {
    expect(text(render({ giftEventProducts: ["saju_mbti_full"] }))).toContain(GIFT_EVENT_RECEIPT_GUEST_LINE);
    hooks.slots = []; state.session = { status: "member", profile: "complete" } as AccountSession;
    const member = render({ giftEventProducts: ["saju_mbti_full"] });
    expect(GIFT_EVENT_RECEIPT_LINE).toBe("1+1 · 결제 후 무료 이용권 1장");
    // 회원은 이용권 잔액 확인 전까지 결제 방법이 정해지지 않았어도 직접 결제 기본 → 줄이 보인다.
    expect(text(member)).toContain(GIFT_EVENT_RECEIPT_LINE);
    hooks.slots = []; expect(render({ giftEventProducts: ["career_money_study"] })).not.toContain("data-gift-event-line");
  });
  it("결제 동의 칸 하나로 합침: 세 확인 칸이 사라지고 「주문 내용과 환불 안내를 확인했어요」 한 칸", () => {
    const t = text(render());
    expect(t).toContain(`[필수] ${ORDER_REFUND_CONSENT_TEXT}`);
    for (const gone of ["[필수] 입력 정보 확인", "[필수] 디지털 리포트 생성 시작", "[필수] 청약철회 제한"]) expect(t).not.toContain(gone);
    expect(t).toContain("[필수] 이용약관·개인정보·환불정책 동의"); expect(t).toContain("[필수] 만 14세 이상");
    expect((render().match(/type="checkbox"/g) ?? []).length).toBe(4); // 전체 동의 + 3칸
  });
  it("한 칸이 세 확인을 덮고, 세 칸 모두 체크해야 결제 가능", () => {
    const order = RECEIPT_CONSENTS.find(c => c.id === "orderAndRefund")!;
    expect(order.covers).toEqual(["inputAccuracy", "digitalReportStart", "refundRestriction"]);
    const snap = { displayName: "가격검사", birthDate: "1990-01-01", calendarType: "SOLAR", timezone: "Asia/Seoul", birthTimeUnknown: true, birthTime: "", approximateBirthTimeSlot: "", gender: "FEMALE", mbtiType: "" } as never;
    const all = Object.fromEntries(RECEIPT_CONSENTS.filter(c => c.id !== "minorLegalRepresentative").flatMap(c => c.covers.map(id => [id, true])));
    expect(isDevTossCheckoutLegalConfirmationComplete(snap, { ...emptyDevTossCheckoutLegalConfirmations, ...all }, new Date("2026-11-08T00:00:00Z"))).toBe(true);
    expect(isDevTossCheckoutLegalConfirmationComplete(snap, { ...emptyDevTossCheckoutLegalConfirmations, ...all, refundRestriction: false }, new Date("2026-11-08T00:00:00Z"))).toBe(false);
  });
  it("맨 아래 작은 회색 두 줄(굵은 글씨 없음), 예시 보기는 /example 텍스트 링크", () => {
    const html = render();
    expect(html).not.toMatch(/<b>[^<]*환불/);
    const tail = html.slice(html.indexOf("결제하기"));
    expect(text(tail)).toContain(`${RECEIPT_REFUND_LINE_KO} · 예시 보기`);
    expect(text(tail)).toContain(AI_WRITTEN_RECEIPT_LINE_KO);
    expect(RECEIPT_REFUND_LINE_KO).toBe("결제하면 바로 생성이 시작돼 단순 변심 환불은 어려워요");
    expect(AI_WRITTEN_RECEIPT_LINE_KO).toBe("명리 계산과 MBTI 자료를 바탕으로 AI가 작성해요");
    expect(tail).toMatch(/<a href="\/example"[^>]*>예시 보기<\/a>/);
    hooks.slots = []; expect(render({ v5Book: false })).not.toContain(AI_WRITTEN_RECEIPT_LINE_KO);
  });
  it("이용권 결제 줄은 환불 대신 재생성 안내", () => {
    state.session = { status: "member", profile: "complete" } as AccountSession; state.pending = true;
    const t = text(render());
    expect(t).toContain(RECEIPT_TICKET_REFUND_LINE_KO); expect(t).not.toContain(RECEIPT_REFUND_LINE_KO);
  });
  it("주문서를 여는 것만으로는 InitiateCheckout(checkout_started)을 보내지 않는다", () => {
    render(); for (const fx of hooks.effects) { try { fx(); } catch { /* fetch 없는 효과 */ } }
    expect(interaction).not.toHaveBeenCalledWith("checkout_started", expect.anything());
  });
});

describe("동의 기록(증명용) ui", () => {
  const confirmed = { inputAccuracy: true, digitalReportStart: true, refundRestriction: true, policyAgreement: true, age14OrOlder: true, minorLegalRepresentative: false };
  const at = new Date("2026-11-08T03:00:00Z");
  it("화면 판·칸 문구(서버 상수)·덮는 확인·체크 시각을 남긴다", () => {
    const sent = createCheckoutConsentAssertion(confirmed, undefined, { version: CHECKOUT_CONSENT_UI_VERSION, policyText: "환불정책 동의", checkedAt: "2026-11-08T02:59:10.000Z" });
    const ev = createCheckoutConsentEvidence(JSON.parse(JSON.stringify(sent)), "1990-01-01", at)!;
    expect(ev.assertions).toMatchObject({ inputAccuracy: true, digitalReportStart: true, refundRestriction: true });
    expect(ev.ui).toEqual({ version: "final4-order-refund-v1", checkedAt: "2026-11-08T02:59:10.000Z", boxes: [
      { text: "주문 내용과 환불 안내를 확인했어요", covers: ["inputAccuracy", "digitalReportStart", "refundRestriction"] },
      { text: "환불정책 동의", covers: ["termsAccepted", "privacyAccepted", "refundAccepted"] },
      { text: "만 14세 이상", covers: ["age14OrOlder"] }] });
  });
  it("모르는 판은 ui 없이(예전 화면), 이상한 문구·시각은 서버 값으로", () => {
    const old = createCheckoutConsentEvidence(createCheckoutConsentAssertion(confirmed), "1990-01-01", at)!;
    expect(old).not.toHaveProperty("ui");
    expect(createCheckoutConsentEvidence({ ...createCheckoutConsentAssertion(confirmed), ui: { version: "x" } }, "1990-01-01", at)).not.toHaveProperty("ui");
    const odd = createCheckoutConsentEvidence({ ...createCheckoutConsentAssertion(confirmed), ui: { version: CHECKOUT_CONSENT_UI_VERSION, policyText: "<script>", checkedAt: "2026-11-01T00:00:00.000Z" } }, "1990-01-01", at)!;
    expect(odd.ui!.boxes[1].text).toBe("이용약관·개인정보·환불정책 동의"); expect(odd.ui!.checkedAt).toBeNull();
  });
  it("한 칸 체크 = 세 확인 모두 참일 때만 기록(하나라도 빠지면 거절, 예전과 같다)", () => {
    expect(createCheckoutConsentEvidence(createCheckoutConsentAssertion({ ...confirmed, refundRestriction: false }), "1990-01-01", at)).toBeNull();
  });
});
