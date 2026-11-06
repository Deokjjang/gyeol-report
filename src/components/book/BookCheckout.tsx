"use client";
import { useEffect, useRef, useState } from "react";
import { getReportProduct } from "../../lib/payment/reportProductCatalog";
import { CHECKOUT_CONSENT_UI_VERSION, createCheckoutConsentAssertion, getCheckoutAgeGateStatus, MEMBER_SIGNUP_CONSENT_TEXT, type CheckoutConsentUiClaim, type CheckoutLegalConfirmations } from "../../lib/payment/checkoutConsent";
import { emptyDevTossCheckoutLegalConfirmations, isDevTossCheckoutLegalConfirmationComplete, runDevTossCheckout } from "../payment/DevTossCheckoutLauncher";
import { CONSENTS, CONSENT_SHORT_LABELS, RECEIPT_CONSENTS, RECEIPT_DETAIL_TEXTS } from "../../app/dev/book-preview/model";
import { DetailSheet, LegalDocument, LEGAL_TITLES } from "../../app/dev/book-preview/BookLegal";
import { prePaymentRefundNoticeKo } from "../../lib/legal/refundPolicy";
import { prePaymentPrivacyNoticeKo } from "../../lib/legal/privacyPolicy";
import { AI_WRITTEN_RECEIPT_LINE_KO, RECEIPT_REFUND_LINE_KO, RECEIPT_TICKET_REFUND_LINE_KO } from "../../lib/legal/aiNotice";
import type { ReportInputPayload } from "../../lib/report-generation/reportInputTypes";
import { bookCheckoutSnapshot } from "../../lib/book/form";
import { BOOK_CHAPTER_TITLES, bookForProduct, readerTitle } from "../../lib/book/product";
import { CONSENT_LINK_LABELS } from "../../lib/legal/socialLinks";
import { BIRTH_TIME_SLOT_DEFINITIONS } from "../../lib/saju/birthTimePrecisionTypes";
import s from "../../app/dev/book-preview/book.module.css";
import { useAccountSession } from "../account/AccountSession";
import type { AccountSession } from "../../lib/account/policy";
import { CouponChooser, type CouponChoice } from "./CouponChooser";
import { interaction, syncLocalFacts } from "../../lib/analytics/client";
import { checkoutReturnKey, useTicketPublication } from "./useTicketPublication";
import { recordBookReturn } from "../../lib/tickets/shopClient";
import { receiptMethodKey } from "../../lib/tickets/shopContract";
import { PROFILE_REQUIRED_MESSAGE } from "../../lib/account/contact";
import { kstMonthDayLabel } from "../../lib/ops/config";

/** v5Book: 이 상품이 v5(AI 작가)로 발행됨 — 열람 "탈퇴 전까지 계속"·AI 작성 고지. 아니면 v5 이전 규칙(생성일로부터 90일).
 * giftEventProducts: 지금(서버 시각) 1+1 이벤트가 걸린 상품 키 — 이벤트 기간이 아니면 빈 배열(giftEventConfig). */
type CheckoutProps = { payload: ReportInputPayload; now: string; internal: boolean; authEnabled?: boolean; ticketShopEnabled?: boolean; v5Book?: boolean; giftEventProducts?: readonly string[]; onPublishing: () => void; onError: (message: string) => void };
type ReceiptConsentId = typeof RECEIPT_CONSENTS[number]["id"];
/** 최종 A 16: 1+1 영수증 줄. P 추가 A: 결제는 로그인한 회원만 하므로(비회원 결제 없음) 한 줄뿐이다. */
export const GIFT_EVENT_RECEIPT_LINE = "이벤트 · 결제 후 이용권 1장 증정";
/** P 추가 A: 결제하기를 누른 비회원은 로그인(신규면 가입 동의·정보 입력)을 마치고 돌아오면 입력값과 상품이 그대로 복원된다.
 * 같은 탭은 sessionStorage(기존 복원 경로), 로그인이 다른 탭·앱 전환을 거쳐도 되도록 같은 기기 localStorage에 30분만 함께 둔다(복원하면 지운다). */
export const CHECKOUT_RETURN_BACKUP_KEY = "gyeol-book-return-backup-v1";
export function loginToCheckout(productKey: string, internal: boolean) {
  const next = `${internal ? "/dev/book-flow/input" : "/report/new"}?product=${productKey}`;
  try {
    sessionStorage.setItem(checkoutReturnKey(productKey), "1");
    const draft = sessionStorage.getItem(`gyeol-book-input-v1:${productKey}`);
    if (draft) localStorage.setItem(CHECKOUT_RETURN_BACKUP_KEY, JSON.stringify({ productKey, draft, at: Date.now() }));
  } catch { /* 입력 복원은 선택 — 실패해도 로그인은 계속 */ }
  window.location.assign(`${internal ? "/dev/account" : "/login"}?next=${encodeURIComponent(next)}`);
}
/** 주문서 처음 상태: 환불정책 동의 칸을 따로 둔다(예전 공용 빈 값에는 없다 — 옛 결제 화면은 policyAgreement가 덮음). */
const EMPTY_RECEIPT_CONSENTS: CheckoutLegalConfirmations = { ...emptyDevTossCheckoutLegalConfirmations, refundPolicyAgreement: false };
export function BookCheckout(props: CheckoutProps) {
  const authEnabled = props.authEnabled ?? props.internal;
  const { session, loaded, error, refresh } = useAccountSession(props.internal, authEnabled);
  if (authEnabled && !loaded) return <p role="status">로그인 상태를 확인하고 있어요.</p>;
  if (authEnabled && error) return <div role="alert">로그인 상태를 확인하지 못했어요. <button onClick={() => void refresh()}>다시 확인</button></div>;
  // A status change remounts the receipt; prior consent is never silently carried over.
  return <BookCheckoutReceipt key={session.status} {...props} authEnabled={authEnabled} session={session} />;
}
function BookCheckoutReceipt({ payload, now, internal, onPublishing, onError, session, authEnabled, ticketShopEnabled = false, v5Book = false, giftEventProducts = [] }: CheckoutProps & { session: AccountSession }) {
  // 최종 A 20: InitiateCheckout은 주문서를 여는 때가 아니라 토스 결제창을 여는 순간에 한 번(아래 onCheckoutWindow).
  // 배포 명령 0-3: 환불 칸은 「주문 내용과 환불정책을 확인하고 동의해요」 하나. 약관·개인정보는 가입 때 동의(P 추가 A: 결제는 회원만 — 비회원은 결제하기에서 로그인으로 간다).
  const member = session.status === "member";
  // P 추가 A: 로그인 전(비회원·재동의 전)에는 동의 칸 없이 주문 내용만 보이고 결제하기 = 로그인. 내부 모의 화면은 예전 그대로.
  const loginFirst = !internal && authEnabled && !member;
  const label = (id: ReceiptConsentId) => CONSENT_SHORT_LABELS[id];
  const [consents, setConsents] = useState<CheckoutLegalConfirmations>(EMPTY_RECEIPT_CONSENTS), [detail, setDetail] = useState<string | null>(null), [busy, setBusy] = useState(false);
  // 증명용: 「주문 내용과 환불 안내」 칸을 체크한 시각(동의 기록 ui.checkedAt). 해제하면 지운다.
  const [orderCheckedAt, setOrderCheckedAt] = useState<string | null>(null);
  const lock = useRef(false), allRef = useRef<HTMLInputElement>(null);
  const ticketRequest = useRef<string | null>(null);
  const couponRequest = useRef<string | null>(null);
  const chosenMethod = useRef(false);
  const accountScope = useRef("");
  const [couponOrder,setCouponOrder] = useState<string | null>(null);
  const [coupon,setCoupon] = useState<CouponChoice>({quote:null});
  const [tickets, setTickets] = useState<number | null>(null), [ticketUntil, setTicketUntil] = useState(""), [method, setMethod] = useState<"payment" | "ticket">("payment");
  const [balanceError, setBalanceError] = useState(false), [balanceRetry, setBalanceRetry] = useState(0);
  const [accountChanged, setAccountChanged] = useState(false);
  // P 추가 G: 결제위젯 연동 키면 「결제하기」를 누른 뒤 이 시트 안에 토스 결제위젯(수단: 어드민 설정 = 토스페이·카카오페이)을 그린다.

  const profileRequired = !internal && session.status === "member" && session.profile === "required";
  const publication = useTicketPublication(payload.productKey, !internal && session.status === "member");
  useEffect(() => {
    if (session.status !== "member") return;
    const abort = new AbortController();
    const refresh = () => {
      if (document.hidden) return;
      // P 추가 E: 결제 화면의 「리포트 이용권 N장」은 쓸 수 있는 모든 이용권(일반 + 남은 이벤트·보상, 선물받은 것 포함) — /auth/gift?view=wallet.
      void fetch(ticketShopEnabled ? `${internal ? "/dev/account/tickets/api" : "/api/ticket-bundles"}/state` : internal ? "/dev/account/api/ticket-summary" : "/auth/gift?view=wallet", { cache: "no-store", signal: abort.signal }).then(async r => {
        const raw = await r.json(); if (abort.signal.aborted) return;
        const b = !ticketShopEnabled && !internal ? { ...raw, quantity: raw?.wallet?.usable } : raw;
        if (!r.ok || !Number.isInteger(b.quantity) || b.quantity < 0) { setBalanceError(true); return; }
        setBalanceError(false); setTickets(b.quantity); setTicketUntil(!ticketShopEnabled && !internal ? kstMonthDayLabel(raw?.wallet?.usableExpiresAt) : "");
        if (ticketShopEnabled) {
          if (accountScope.current && accountScope.current !== b.scope) { setConsents(EMPTY_RECEIPT_CONSENTS); setAccountChanged(true); setBalanceError(true); return; }
          accountScope.current = b.scope;
          if (!chosenMethod.current) { try {
            const saved = JSON.parse(sessionStorage.getItem(receiptMethodKey(payload.productKey)) ?? "null");
            if (saved?.scope === b.scope && ["ticket", "payment"].includes(saved.method)) { chosenMethod.current = true; setMethod(saved.method); }
          } catch { /* optional method preference */ } }
        }
        if (!chosenMethod.current && !lock.current) setMethod(b.quantity > 0 ? "ticket" : "payment");
      }).catch(() => { if (!abort.signal.aborted) setBalanceError(true); });
    };
    refresh(); window.addEventListener("focus", refresh);
    const channel = typeof BroadcastChannel === "undefined" ? null : new BroadcastChannel("gyeol-account"); if (channel) channel.onmessage = refresh;
    const timer = setInterval(refresh, 60_000);
    return () => { abort.abort(); channel?.close(); clearInterval(timer); window.removeEventListener("focus", refresh); };
  }, [internal, session.status, balanceRetry, publication.revision, ticketShopEnabled, payload.productKey]);
  function choose(next: "ticket" | "payment") {
    chosenMethod.current = true; setMethod(next);
    if (ticketShopEnabled && accountScope.current) try { sessionStorage.setItem(receiptMethodKey(payload.productKey), JSON.stringify({ scope: accountScope.current, method: next })); } catch { /* preference only */ }
  }
  async function visitShop() {
    if (lock.current) return;
    lock.current = true; setBusy(true);
    try {
      const r = await fetch(`${internal ? "/dev/account/tickets/api" : "/api/ticket-bundles"}/state`, { cache: "no-store", signal: AbortSignal.timeout(15_000) }), b = await r.json();
      if (!r.ok || b.scope !== accountScope.current || !recordBookReturn(sessionStorage, payload.productKey, b.scope)) { onError("계정과 입력 저장 상태를 다시 확인해 주세요."); return; }
      sessionStorage.setItem(checkoutReturnKey(payload.productKey), "1");
      window.location.assign(internal ? "/dev/account/tickets" : "/account/tickets");
    } catch { onError("입력 내용을 보존하지 못했어요. 다시 시도해 주세요."); }
    finally { lock.current = false; setBusy(false); }
  }
  const snapshot = bookCheckoutSnapshot(payload), book = bookForProduct(payload.productKey)!, product = getReportProduct(payload.productKey)!;
  const age = getCheckoutAgeGateStatus(snapshot.birthDate, new Date(now)), allowed = age === "adult" || age === "minor";
  const items = RECEIPT_CONSENTS.filter(c => (c.id !== "minorLegalRepresentative" || age === "minor") && (c.id !== "policyAgreement" || !(member || loginFirst)));
  // 회원의 약관·개인정보 확인(policyAgreement)은 가입 동의에서 온다 — 기록(assertions)은 일곱 확인 그대로.
  const effective: CheckoutLegalConfirmations = member ? { ...consents, policyAgreement: true } : consents;
  const isChecked = (c: typeof items[number]) => c.covers.every(id => consents[id]);
  const all = items.every(isChecked), some = items.some(c => c.covers.some(id => consents[id]));
  const check = (rows: readonly typeof items[number][], value: boolean) => {
    setConsents(prev => ({ ...prev, ...Object.fromEntries(rows.flatMap(c => c.covers.map(id => [id, value]))) }));
    if (rows.some(c => c.id === "orderAndRefund")) setOrderCheckedAt(value ? new Date().toISOString() : null);
  };
  const consentUi: CheckoutConsentUiClaim = { version: CHECKOUT_CONSENT_UI_VERSION, layout: member ? "member" : "guest", ...(orderCheckedAt ? { checkedAt: orderCheckedAt } : {}) };
  const giftEventLine = giftEventProducts.includes(payload.productKey) ? GIFT_EVENT_RECEIPT_LINE : null;
  useEffect(() => { if (allRef.current) allRef.current.indeterminate = some && !all; }, [some, all]);
  const ready = isDevTossCheckoutLegalConfirmationComplete(snapshot, effective, new Date(now));
  const checkingBalance = session.status === "member" && (tickets === null || balanceError);
  const ticketPending = !internal && publication.pending;
  const ticketSelected = ticketPending || method === "ticket";
  const blocked = busy || publication.submitting || ticketPending || checkingBalance || accountChanged || (!internal && !publication.loaded) || session.status === "needs_consent" || profileRequired;
  const selected = items.find(c => c.id === detail);
  const submit = async () => {
    if (loginFirst) { loginToCheckout(payload.productKey, internal); return; }
    if (lock.current || blocked || !ready || (method === "ticket" && !tickets) || (internal&&method==="payment"&&!coupon.quote&&!couponOrder)) return;
    if (ticketShopEnabled && session.status === "member") {
      lock.current = true; setBusy(true);
      try {
        const r = await fetch(`${internal ? "/dev/account/tickets/api" : "/api/ticket-bundles"}/state`, { cache: "no-store", headers: { "x-ticket-account": accountScope.current }, signal: AbortSignal.timeout(15_000) });
        const current = await r.json();
        if (!r.ok || current.scope !== accountScope.current) { setAccountChanged(true); setConsents(EMPTY_RECEIPT_CONSENTS); return; }
      } catch { setBalanceError(true); return; }
      finally { lock.current = false; setBusy(false); }
    }
    if (!internal && method === "ticket") {
      // Synchronous lock covers the async fingerprint before pending is set.
      lock.current = true; chosenMethod.current = true; setBusy(true); onError("");
      try { await publication.submit(payload, effective, accountScope.current || undefined, consentUi); }
      finally { lock.current = false; setBusy(false); }
      return;
    }
    lock.current = true; setBusy(true); onError("");
    if (!internal) {
      // Reuse the existing production prepare + validated Toss SDK launcher(회원만 — 구매자 정보는 서버가 가입 정보에서 쓴다).
      // Local preview below still requires its explicit mock runtime.
      // 2026-11-06: 결제창 기본 화면(method CARD·flowMode DEFAULT, easyPay 없음) — 토스 결제창 안에서 고객이 토스페이·카카오페이 중 고른다.
      const result = await runDevTossCheckout(snapshot, effective, undefined, { productType: payload.productKey, consentUi, onCheckoutWindow: () => interaction("checkout_started", payload.productKey) });
      if (!result.ok) { onError(result.messageKo); lock.current = false; setBusy(false); }
      return;
    }
    if (method === "ticket") {
      ticketRequest.current ??= crypto.randomUUID();
      try {
        const response = await fetch("/dev/account/api/ticket-redeem", { method: "POST", headers: { "content-type": "application/json", ...(accountScope.current ? { "x-ticket-account": accountScope.current } : {}) }, body: JSON.stringify({ requestId: ticketRequest.current, payload, consent: createCheckoutConsentAssertion(effective, undefined, consentUi) }) });
        const b = await response.json();
        if (response.ok && b.ok && typeof b.reportUrl === "string" && b.reportUrl.startsWith("/dev/book-flow/report/")) { window.location.assign(b.reportUrl); return; }
        onError(b.error ?? "이용권 상태를 다시 확인해 주세요.");
        if (b.state === "REVERSED") ticketRequest.current = null;
      } catch { onError("발행 결과를 확인하지 못했습니다. 같은 요청으로 다시 확인해 주세요."); }
      lock.current = false; setBusy(false); return;
    }
    if (coupon.selection || couponOrder) {
      couponRequest.current ??= crypto.randomUUID();
      let orderId=couponOrder;
      try {
        if (!orderId) {
          const r=await fetch("/dev/account/api/coupon-prepare",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({requestId:couponRequest.current,payload,consent:createCheckoutConsentAssertion(effective,undefined,consentUi),selection:coupon.selection})});
          const b=await r.json();
          if (!r.ok || !b.ok || typeof b.orderId!=="string") { onError(b.error??"쿠폰 상태를 확인해 주세요.");lock.current=false;setBusy(false);return; }
          if(b.finalAmount!==coupon.quote?.finalAmount){
            await fetch("/dev/account/api/coupon-release",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({orderId:b.orderId})});
            couponRequest.current=null;setCoupon({selection:coupon.selection,quote:b});
            onError("쿠폰 적용 금액이 변경됐습니다. 금액을 확인하고 다시 진행해 주세요.");lock.current=false;setBusy(false);return;
          }
          orderId=b.orderId;setCouponOrder(orderId);
        }
        onPublishing();
        const r=await fetch("/dev/account/api/coupon-complete",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({orderId})});
        const b=await r.json();
        await syncLocalFacts();
        if(r.ok&&b.ok&&typeof b.reportUrl==="string"&&b.reportUrl.startsWith("/dev/book-flow/report/")){window.location.assign(b.reportUrl);return;}
        onError(b.error??"모의 결제·발행 결과를 다시 확인해 주세요.");
      }catch{onError("결제 결과를 확인하지 못했습니다. 같은 요청으로 다시 확인해 주세요.");}
      lock.current=false;setBusy(false);return;
    }
    let orderId = "";
    // Mandatory local mock runtime. Never omit this third argument and never
    // call the provider/prepare endpoint from this integration phase.
    const result = await runDevTossCheckout(snapshot, effective, {
      fetch: async (path, init) => {
        if (path !== "/api/payment-checkout/prepare") return { ok: false, json: async () => ({}) };
        const response = await fetch("/dev/book-flow/api", { ...init, body: JSON.stringify({ operation: "prepare", request: JSON.parse(String(init.body)), memberGeneralConsent: session.status === "member" }) });
        const body = await response.json(); orderId = body.orderId ?? "";
        return { ok: response.ok, json: async () => body };
      },
      loadTossPayments: async () => ({ payment: () => ({ requestPayment: async () => undefined }) }),
      launchTossCheckout: async () => {
        onPublishing();
        const response = await fetch("/dev/book-flow/api", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ operation: "publish", orderId }) });
        const body = await response.json();
        if (!response.ok || !body.ok || typeof body.reportUrl !== "string" || !body.reportUrl.startsWith("/dev/book-flow/report/")) return { ok: false, status: "failed_to_launch", error: { code: "TOSS_CLIENT_CHECKOUT_INVALID_REQUEST", messageKo: body.error ?? "책을 생성하지 못했습니다." } };
        window.location.assign(body.reportUrl);
        return { ok: true, status: "redirect_requested" };
      },
    }, { productType: payload.productKey, consentUi });
    if (!result.ok) { onError("입력 또는 모의 발행 결과를 확인해 주세요. 실제 결제는 실행하지 않았습니다."); lock.current = false; setBusy(false); }
  };
  return <div className={s.receipt} data-book-checkout><p className={s.micro}>GYEOL REPORT</p><h1>발행 주문서</h1><p className={s.micro}>PUBLISHING ORDER</p>
    <dl>{[["TITLE", readerTitle(book, payload.productKey !== "saju_mbti_compatibility" && "selectedYear" in payload.productOptions ? payload.productOptions.selectedYear : "")], ["ISSUED TO", snapshot.displayName ?? ""], ["PRICE", ticketSelected ? "리포트 이용권 1장" : `${(coupon.quote?.finalAmount??product.amount).toLocaleString("ko-KR")}원`]].map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl>
    {giftEventLine && !ticketSelected ? <p className={s.receiptNote} data-gift-event-line>{giftEventLine}</p> : null}
    {method==="payment"&&coupon.selection&&coupon.quote?<dl aria-label="쿠폰 적용 금액"><div><dt>상품 금액</dt><dd>₩{coupon.quote.originalAmount.toLocaleString("ko-KR")}</dd></div><div><dt>쿠폰 할인</dt><dd>−₩{coupon.quote.discountAmount.toLocaleString("ko-KR")}</dd></div><div><dt>결제 금액</dt><dd>₩{coupon.quote.finalAmount.toLocaleString("ko-KR")}</dd></div></dl>:null}
    <dl>{(payload.productKey === "saju_mbti_compatibility" ? [payload.personA, payload.personB] : [payload.person]).map((p, i) => <div key={i}><dt>{p.name}</dt><dd>{p.birthDate} · {p.birthTimeUnknown ? "시간 모름" : p.birthTime || `대략 · ${BIRTH_TIME_SLOT_DEFINITIONS.find(s => s.value === p.approximateBirthTimeSlot)?.labelKo ?? "미확인"}`} · {p.mbtiType || "MBTI 모름"}</dd></div>)}</dl>
    <p className={s.receiptNote}>입력값 기반 자동 생성 디지털 리포트 · 사람 상담 아님<br />{ticketSelected ? "이용권 사용 후 즉시 생성" : "결제 완료 후 즉시 생성, 최대 24시간 이내 제공"}<br />{v5Book ? "탈퇴 전까지 계속 열람" : "생성일로부터 90일"} · {ticketSelected ? "온라인 열람" : "결제 후 온라인 열람"}</p>
    {/* P 추가 E: 이용권이 0장이면 이용권 칸 자체를 숨기고 결제만 보인다(묶음 판매가 켜졌을 때만 구매 버튼 때문에 남긴다). */}
    {session.status === "member" && (accountChanged || checkingBalance || ticketPending || (tickets ?? 0) > 0 || ticketShopEnabled) ? <fieldset className={s.consents} data-ticket-method><legend>발행 방법</legend>
      {accountChanged ? <p role="alert">계정이 바뀌었어요. <a href={`${internal ? "/dev/book-flow/input" : "/report/new"}?product=${payload.productKey}`}>입력부터 다시 확인해 주세요.</a></p> : null}
      {checkingBalance ? <p role={balanceError ? "alert" : "status"}>{balanceError ? "이용권을 확인하지 못했어요." : "이용권을 확인하고 있어요."}{balanceError ? <button onClick={() => setBalanceRetry(n => n + 1)}>다시 확인</button> : null}</p> : <>
        {(tickets ?? 0) > 0 || ticketPending ? <>
          <label><input type="radio" name="method" checked={ticketSelected} disabled={blocked || !tickets || couponOrder !== null} onChange={() => { choose("ticket"); interaction("ticket_selected", payload.productKey); }} />리포트 이용권 1장 쓰기 · 남은 이용권 {tickets}장{ticketUntil ? ` · ${ticketUntil}까지` : ""}</label>
          <label><input type="radio" name="method" checked={!ticketSelected} disabled={blocked || couponOrder !== null} onChange={() => choose("payment")} />{product.amount.toLocaleString("ko-KR")}원 결제하기</label>
        </> : null}
        {ticketShopEnabled && !ticketPending ? <button type="button" disabled={blocked} onClick={() => void visitShop()}>묶음 이용권 구매하기 →</button> : null}
      </>}
    </fieldset> : null}
    {profileRequired ? <p role="alert">{PROFILE_REQUIRED_MESSAGE} <a href="/account">가입 정보 입력하기 →</a></p> : null}
    {!internal && publication.message ? <p role="status">{publication.message}</p> : null}
    {ticketPending && publication.retryable ? <button disabled={!ready || publication.submitting || accountChanged} onClick={() => void publication.submit(payload, effective, accountScope.current || undefined, consentUi)}>같은 발행 요청 다시 확인</button> : null}
    {!internal && publication.completedUrl ? <a href={publication.completedUrl}>완성된 책 펼쳐보기</a> : null}
    {internal?<CouponChooser productType={payload.productKey} disabled={busy||method==="ticket"||couponOrder!==null} ticketSelected={method==="ticket"} member={session.status==="member"} onChange={setCoupon} />:null}
    {loginFirst ? <p className={s.receiptNote} data-login-first>결제는 로그인한 뒤에 할 수 있어요. 결제하기를 누르면 카카오·Google 로그인으로 이어지고, 입력한 내용은 그대로 남아요.</p> : <fieldset className={s.consents}><legend className={s.srOnly}>구매 동의</legend><label className={s.allConsent}><input ref={allRef} type="checkbox" checked={all} disabled={!allowed || busy} onChange={e => check(items, e.target.checked)} />전체 동의</label>
      {items.map(c => <div className={s.consentRow} key={c.id}><label><input type="checkbox" checked={isChecked(c)} disabled={!allowed || busy} onChange={e => check([c], e.target.checked)} />[필수] {label(c.id)}</label><button type="button" onClick={() => setDetail(c.id)} aria-label={`${label(c.id)} 상세 보기`}>보기 ›</button></div>)}
    </fieldset>}
    {/* 운영 Q 1부 ④: 동의 칸 바로 옆 링크 둘(동의 문구는 그대로). 새 탭이라 주문서 입력이 남는다. */}
    <p className={s.receiptNote} data-consent-links><a href="/refund" target="_blank" rel="noopener" className={s.quietLink}>{CONSENT_LINK_LABELS.refund}</a> · <a href="/example" target="_blank" rel="noopener" className={s.quietLink}>{CONSENT_LINK_LABELS.example}</a></p>
    <BookChapterList payload={payload} />
    {!allowed ? <p role="alert">만 14세 이상만 이용할 수 있어요.</p> : null}
    <p className={s.receiptNote}><a href="/privacy" target="_blank" rel="noopener">개인정보처리방침 보기 ›</a></p>
    <button type="button" className={s.orderButton} disabled={loginFirst ? !allowed : !ready || blocked || (method === "ticket" && !tickets) || (internal&&method==="payment"&&!coupon.quote&&!couponOrder)} onClick={submit}>{ticketPending ? "책 발행 상태 확인 중" : busy && method === "ticket" ? "이용권으로 책을 만드는 중" : method === "ticket" ? "이용권 1장으로 책 발행하기" : internal ? "모의 결제 · 책 발행" : "결제하기"} →</button>
    <p className={s.receiptNote} data-refund-notice>{ticketSelected ? RECEIPT_TICKET_REFUND_LINE_KO : RECEIPT_REFUND_LINE_KO}{v5Book ? <><br /><span data-ai-notice>{AI_WRITTEN_RECEIPT_LINE_KO}</span></> : null}</p>
    {detail ? <DetailSheet title={selected ? label(selected.id) : "구매 안내"} onClose={() => setDetail(null)}>{selected ? selected.covers.map(id => <p key={id}>{RECEIPT_DETAIL_TEXTS[id] ?? CONSENTS.find(c => c.id === id)!.label}</p>) : null}{selected?.id === "orderAndRefund" && member ? <p>{MEMBER_SIGNUP_CONSENT_TEXT}은 가입할 때 따로 받았어요.</p> : null}<p>{prePaymentRefundNoticeKo}</p><p>{prePaymentPrivacyNoticeKo}</p>{LEGAL_TITLES.map((title, i) => <details key={title} open={detail === `policy-${i}`}><summary>{title} +</summary><LegalDocument index={i} onNavigate={n => setDetail(`policy-${n}`)} /></details>)}</DetailSheet> : null}
  </div>;
}

/** 운영 Q 9부: 결제 전에 이 책의 장 목록을 볼 수 있게(접힘, 동의 칸 옆). 궁합의 A·B는 두 사람(책에서는 호칭으로 바뀐다). 판매하지 않는 상품은 목록 없음. */
function BookChapterList({ payload }: { payload: ReportInputPayload }) {
  const chapters = BOOK_CHAPTER_TITLES[payload.productKey];
  if (!chapters) return null;
  return <details className={`${s.receiptNote} ${s.receiptChapters}`} data-book-chapters><summary>이 책의 차례 · {chapters.length}장</summary><ol>{chapters.map(title => <li key={title}>{title}</li>)}</ol>
    {payload.productKey === "saju_mbti_compatibility" ? <p>A: {payload.personA.name} · B: {payload.personB.name}</p> : null}</details>;
}
