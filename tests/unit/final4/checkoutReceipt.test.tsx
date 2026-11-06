/**
 * 최종 A 16 → 배포 명령 0-3: 발행 주문서 — 3,900원(가격 표), 이벤트 기간만 1+1 줄, 환불 칸 하나 「주문 내용과 환불정책을 확인하고 동의해요」,
 * 맨 아래 작은 회색 두 줄(환불 / AI 작성), 동의 기록에 화면 판·문구·체크 시각.
 * 운영 Q: 「예시 보기」는 동의 칸 바로 옆 링크 둘(환불정책 · 예시 리포트 보기)로 옮겼고, 「이 책의 차례」(접힘)를 보인다.
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
import { BookCheckout, GIFT_EVENT_RECEIPT_LINE } from "../../../src/components/book/BookCheckout";
import { RUNTIME_FIXTURES } from "../interpretation-v4/runtimeFixtures";
import type { ReportInputPayload } from "../../../src/lib/report-generation/reportInputTypes";
import { AI_WRITTEN_RECEIPT_LINE_KO, RECEIPT_REFUND_LINE_KO, RECEIPT_TICKET_REFUND_LINE_KO } from "../../../src/lib/legal/aiNotice";
import { CHECKOUT_CONSENT_UI_VERSION, CHECKOUT_CONSENT_UI_VERSION_V1, consentLayoutMatchesBuyer, createCheckoutConsentAssertion, createCheckoutConsentEvidence, ORDER_REFUND_CONSENT_TEXT } from "../../../src/lib/payment/checkoutConsent";
import { RECEIPT_CONSENTS } from "../../../src/app/dev/book-preview/model";
import { BOOK_CHAPTER_TITLES } from "../../../src/lib/book/product";
import { CONSENT_LINK_LABELS } from "../../../src/lib/legal/socialLinks";
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
  it("이벤트 기간만 한 줄 「이벤트 · 결제 후 이용권 1장 증정」(2026-11-06 4번: 「증정」, 묶음 판매로 읽히는 「1+1」 없음)(P 추가 A: 비회원 결제가 없어 비회원 전용 줄도 없다)", () => {
    expect(text(render({ giftEventProducts: ["saju_mbti_full"] }))).toContain(GIFT_EVENT_RECEIPT_LINE);
    expect(text(render({ giftEventProducts: ["saju_mbti_full"] }))).not.toContain("로그인하고 결제하면");
    hooks.slots = []; state.session = { status: "member", profile: "complete" } as AccountSession;
    const member = render({ giftEventProducts: ["saju_mbti_full"] });
    expect(GIFT_EVENT_RECEIPT_LINE).toBe("이벤트 · 결제 후 이용권 1장 증정");
    // 회원은 이용권 잔액 확인 전까지 결제 방법이 정해지지 않았어도 직접 결제 기본 → 줄이 보인다.
    expect(text(member)).toContain(GIFT_EVENT_RECEIPT_LINE);
    hooks.slots = []; expect(render({ giftEventProducts: ["career_money_study"] })).not.toContain("data-gift-event-line");
  });
  it("비회원(P 추가 A): 동의 칸·구매자 정보 칸 없이 주문 내용과 「결제하기」 하나 — 누르면 로그인으로(동의는 로그인 뒤 회원 주문서에서)", () => {
    const html = render(), t = text(html);
    expect(ORDER_REFUND_CONSENT_TEXT).toBe("주문 내용과 환불정책을 확인하고 동의해요");
    expect(html).toContain("data-login-first"); expect(t).toContain("결제하기");
    for (const gone of ["[필수]", "이용약관·개인정보 동의", "구매자 정보", "data-buyer-fields", "로그인하고 이어서 구매하기"]) expect(html).not.toContain(gone);
    expect((html.match(/type="checkbox"/g) ?? []).length).toBe(0);
  });
  it("회원: 환불 칸 하나 + 만 14세(약관·개인정보는 가입 때 동의 — 주문서 칸 없음)", () => {
    state.session = { status: "member", profile: "complete" } as AccountSession;
    const html = render(), t = text(html);
    expect(t).toContain(`[필수] ${ORDER_REFUND_CONSENT_TEXT}`); expect(t).toContain("[필수] 만 14세 이상");
    for (const gone of ["[필수] 환불정책 동의", "[필수] 이용약관", "주문 내용과 환불 안내를 확인했어요"]) expect(t).not.toContain(gone);
    expect((html.match(/\[필수\][^<]*/g) ?? []).filter(l => l.includes("환불"))).toEqual([`[필수] ${ORDER_REFUND_CONSENT_TEXT}`]);
    expect((html.match(/type="checkbox"/g) ?? []).length).toBe(3); // 전체 동의 + 2칸
  });
  it("한 칸이 네 확인(입력·생성 시작·청약철회 제한·환불정책)을 덮고, 칸을 모두 체크해야 결제 가능", () => {
    const order = RECEIPT_CONSENTS.find(c => c.id === "orderAndRefund")!;
    expect(order.covers).toEqual(["inputAccuracy", "digitalReportStart", "refundRestriction", "refundPolicyAgreement"]);
    const snap = { displayName: "가격검사", birthDate: "1990-01-01", calendarType: "SOLAR", timezone: "Asia/Seoul", birthTimeUnknown: true, birthTime: "", approximateBirthTimeSlot: "", gender: "FEMALE", mbtiType: "" } as never;
    const all = Object.fromEntries(RECEIPT_CONSENTS.filter(c => c.id !== "minorLegalRepresentative").flatMap(c => c.covers.map(id => [id, true])));
    const at = new Date("2026-11-08T00:00:00Z"), base = { ...emptyDevTossCheckoutLegalConfirmations, refundPolicyAgreement: false };
    expect(isDevTossCheckoutLegalConfirmationComplete(snap, { ...base, ...all }, at)).toBe(true);
    expect(isDevTossCheckoutLegalConfirmationComplete(snap, { ...base, ...all, refundRestriction: false }, at)).toBe(false);
    expect(isDevTossCheckoutLegalConfirmationComplete(snap, { ...base, ...all, refundPolicyAgreement: false }, at)).toBe(false);
    expect(isDevTossCheckoutLegalConfirmationComplete(snap, { ...base, ...all, policyAgreement: false }, at)).toBe(false); // 비회원 약관 칸
    // 예전 화면(환불정책 칸 따로 없음)은 policyAgreement가 덮는다.
    expect(isDevTossCheckoutLegalConfirmationComplete(snap, { inputAccuracy: true, digitalReportStart: true, refundRestriction: true, policyAgreement: true, age14OrOlder: true, minorLegalRepresentative: false }, at)).toBe(true);
  });
  it("맨 아래 작은 회색 두 줄(굵은 글씨 없음): 환불 한 줄 / AI 작성 — 예시 링크는 동의 칸 옆으로 옮겨 여기엔 없다(운영 Q)", () => {
    const html = render();
    expect(html).not.toMatch(/<b>[^<]*환불/);
    const tail = html.slice(html.indexOf("data-refund-notice"));
    expect(text(tail)).toContain(RECEIPT_REFUND_LINE_KO);
    expect(text(tail)).not.toContain("예시 보기");
    expect(text(tail)).toContain(AI_WRITTEN_RECEIPT_LINE_KO);
    expect(RECEIPT_REFUND_LINE_KO).toBe("결제하면 바로 생성이 시작돼 단순 변심 환불은 되지 않아요");
    expect(AI_WRITTEN_RECEIPT_LINE_KO).toBe("명리 계산과 MBTI 자료를 바탕으로 AI가 작성해요");
    expect(tail).not.toContain('href="/example"');
    hooks.slots = []; expect(render({ v5Book: false })).not.toContain(AI_WRITTEN_RECEIPT_LINE_KO);
  });
  it("운영 Q ④: 동의 문구는 그대로, 바로 옆에 「환불정책」(/refund)·「예시 리포트 보기」(/example) 링크 — 예시 링크는 주문서에 한 번만", () => {
    expect(CONSENT_LINK_LABELS).toEqual({ refund: "환불정책", example: "예시 리포트 보기" });
    state.session = { status: "member", profile: "complete" } as AccountSession;
    for (const html of [render(), (hooks.slots = [], state.session = { status: "guest" }, render())]) {
      const links = html.match(/<p[^>]*data-consent-links[^>]*>[\s\S]*?<\/p>/)![0];
      expect(links).toMatch(/<a href="\/refund" target="_blank" rel="noopener"[^>]*>환불정책<\/a>/);
      expect(links).toMatch(/<a href="\/example" target="_blank" rel="noopener"[^>]*>예시 리포트 보기<\/a>/);
      expect(html.match(/href="\/example"/g)).toHaveLength(1);
    }
    // 회원 주문서: 동의 칸(fieldset) 바로 다음이 링크 줄이고, 동의 문구는 바뀌지 않았다.
    hooks.slots = []; state.session = { status: "member", profile: "complete" } as AccountSession;
    const member = render();
    expect(text(member)).toContain(`[필수] ${ORDER_REFUND_CONSENT_TEXT}`);
    expect(member.indexOf("data-consent-links")).toBeGreaterThan(member.lastIndexOf("</fieldset>"));
    expect(member.slice(member.lastIndexOf("</fieldset>"), member.indexOf("data-consent-links"))).toMatch(/^<\/fieldset><p[^>]*$/);
  });
  it("운영 Q 9부: 「이 책의 차례 · N장」(접힘) — 판매 중인 4종 모두, 궁합은 A·B가 누구인지", () => {
    for (const fixture of RUNTIME_FIXTURES.slice(0, 4)) {
      hooks.slots = [];
      const p = fixture.payload as ReportInputPayload, titles = BOOK_CHAPTER_TITLES[p.productKey]!;
      const html = render({ payload: p }), block = html.match(/<details[^>]*data-book-chapters[^>]*>[\s\S]*?<\/details>/)![0];
      expect(block).not.toMatch(/<details[^>]*open/);
      expect(text(block)).toContain(`이 책의 차례 · ${titles.length}장`);
      expect(block.match(/<li>/g)).toHaveLength(titles.length);
      for (const title of titles) expect(block).toContain(`<li>${title}</li>`);
      if (p.productKey === "saju_mbti_compatibility") expect(text(block)).toContain(`A: ${p.personA.name} · B: ${p.personB.name}`);
      else expect(text(block)).not.toContain("A: ");
    }
    // 판매하지 않는 대운·세운은 목록이 없다(상수에 없음).
    hooks.slots = []; expect(render({ payload: RUNTIME_FIXTURES[4].payload })).not.toContain("data-book-chapters");
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
  const confirmed = { inputAccuracy: true, digitalReportStart: true, refundRestriction: true, policyAgreement: true, refundPolicyAgreement: true, age14OrOlder: true, minorLegalRepresentative: false };
  const at = new Date("2026-11-08T03:00:00Z");
  const SEVEN = { inputAccuracy: true, digitalReportStart: true, refundRestriction: true, termsAccepted: true, privacyAccepted: true, refundAccepted: true, age14OrOlder: true, minorLegalRepresentative: false };
  it("비회원 배치: 일곱 확인 모두 기록 + 칸 문구(서버 상수)·덮는 확인·체크 시각", () => {
    const sent = createCheckoutConsentAssertion(confirmed, undefined, { version: CHECKOUT_CONSENT_UI_VERSION, layout: "guest", checkedAt: "2026-11-08T02:59:10.000Z" });
    const ev = createCheckoutConsentEvidence(JSON.parse(JSON.stringify(sent)), "1990-01-01", at)!;
    expect(ev.assertions).toEqual(SEVEN);
    expect(ev.ui).toEqual({ version: "final4-order-refund-v2", layout: "guest", checkedAt: "2026-11-08T02:59:10.000Z", boxes: [
      { text: "주문 내용과 환불정책을 확인하고 동의해요", covers: ["inputAccuracy", "digitalReportStart", "refundRestriction", "refundAccepted"] },
      { text: "이용약관·개인정보 동의", covers: ["termsAccepted", "privacyAccepted"] },
      { text: "만 14세 이상", covers: ["age14OrOlder"] }] });
    // 기록이 덮는 확인 = 일곱 확인 전부(빠진 것 없음).
    expect(new Set(ev.ui!.boxes.flatMap(b => b.covers))).toEqual(new Set(Object.keys(SEVEN).filter(k => k !== "minorLegalRepresentative")));
  });
  it("회원 배치: 약관·개인정보는 가입 동의(via signup)로, 일곱 확인 그대로. 결제 준비는 실제 회원일 때만 받는다", () => {
    const ev = createCheckoutConsentEvidence(createCheckoutConsentAssertion(confirmed, undefined, { version: CHECKOUT_CONSENT_UI_VERSION, layout: "member" }), "1990-01-01", at)!;
    expect(ev.assertions).toEqual(SEVEN);
    expect(ev.ui).toMatchObject({ layout: "member", checkedAt: null, boxes: [
      { text: "주문 내용과 환불정책을 확인하고 동의해요", covers: ["inputAccuracy", "digitalReportStart", "refundRestriction", "refundAccepted"] },
      { text: "회원 가입 때 동의한 이용약관·개인정보처리방침", covers: ["termsAccepted", "privacyAccepted"], via: "signup" },
      { text: "만 14세 이상", covers: ["age14OrOlder"] }] });
    expect(consentLayoutMatchesBuyer(ev, true)).toBe(true);
    expect(consentLayoutMatchesBuyer(ev, false)).toBe(false);
    const guest = createCheckoutConsentEvidence(createCheckoutConsentAssertion(confirmed, undefined, { version: CHECKOUT_CONSENT_UI_VERSION, layout: "guest" }), "1990-01-01", at)!;
    expect([consentLayoutMatchesBuyer(guest, true), consentLayoutMatchesBuyer(guest, false)]).toEqual([true, true]);
  });
  it("미성년자는 법정대리인 칸까지 기록", () => {
    const ev = createCheckoutConsentEvidence(createCheckoutConsentAssertion({ ...confirmed, minorLegalRepresentative: true }, undefined, { version: CHECKOUT_CONSENT_UI_VERSION, layout: "guest" }), "2010-01-01", at)!;
    expect(ev.ageBand).toBe("minor"); expect(ev.assertions.minorLegalRepresentative).toBe(true);
    expect(ev.ui!.boxes.at(-1)).toEqual({ text: "미성년자 법정대리인 동의", covers: ["minorLegalRepresentative"] });
  });
  it("배포 직전 판(v1) 화면에서 온 주문도 그 화면 그대로 기록, 모르는 판·배치는 ui 없이", () => {
    const v1 = createCheckoutConsentEvidence({ ...createCheckoutConsentAssertion(confirmed), ui: { version: CHECKOUT_CONSENT_UI_VERSION_V1, policyText: "환불정책 동의", checkedAt: "2026-11-08T02:59:10.000Z" } }, "1990-01-01", at)!;
    expect(v1.ui).toEqual({ version: "final4-order-refund-v1", checkedAt: "2026-11-08T02:59:10.000Z", boxes: [
      { text: "주문 내용과 환불 안내를 확인했어요", covers: ["inputAccuracy", "digitalReportStart", "refundRestriction"] },
      { text: "환불정책 동의", covers: ["termsAccepted", "privacyAccepted", "refundAccepted"] },
      { text: "만 14세 이상", covers: ["age14OrOlder"] }] });
    const old = createCheckoutConsentEvidence(createCheckoutConsentAssertion(confirmed), "1990-01-01", at)!;
    expect(old).not.toHaveProperty("ui");
    expect(createCheckoutConsentEvidence({ ...createCheckoutConsentAssertion(confirmed), ui: { version: "x" } }, "1990-01-01", at)).not.toHaveProperty("ui");
    expect(createCheckoutConsentEvidence({ ...createCheckoutConsentAssertion(confirmed), ui: { version: CHECKOUT_CONSENT_UI_VERSION, layout: "<script>" } }, "1990-01-01", at)).not.toHaveProperty("ui");
    const odd = createCheckoutConsentEvidence({ ...createCheckoutConsentAssertion(confirmed), ui: { version: CHECKOUT_CONSENT_UI_VERSION, layout: "guest", checkedAt: "2026-11-01T00:00:00.000Z" } }, "1990-01-01", at)!;
    expect(odd.ui!.checkedAt).toBeNull();
  });
  it("한 칸 체크 = 네 확인 모두 참일 때만 기록(하나라도 빠지면 거절)", () => {
    expect(createCheckoutConsentEvidence(createCheckoutConsentAssertion({ ...confirmed, refundRestriction: false }), "1990-01-01", at)).toBeNull();
    expect(createCheckoutConsentEvidence(createCheckoutConsentAssertion({ ...confirmed, refundPolicyAgreement: false }), "1990-01-01", at)).toBeNull();
    // 예전 화면 값(환불정책 칸 따로 없음)은 policyAgreement가 refundAccepted까지 덮는다.
    const legacy = { inputAccuracy: true, digitalReportStart: true, refundRestriction: true, policyAgreement: true, age14OrOlder: true, minorLegalRepresentative: false };
    expect(createCheckoutConsentAssertion(legacy).assertions.refundAccepted).toBe(true);
  });
});
