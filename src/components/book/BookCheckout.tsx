"use client";
import { useEffect, useRef, useState } from "react";
import { getReportProduct } from "../../lib/payment/reportProductCatalog";
import { createCheckoutConsentAssertion, getCheckoutAgeGateStatus, type CheckoutLegalConfirmations } from "../../lib/payment/checkoutConsent";
import { emptyDevTossCheckoutLegalConfirmations, isDevTossCheckoutLegalConfirmationComplete, runDevTossCheckout } from "../payment/DevTossCheckoutLauncher";
import { CONSENTS, CONSENT_SHORT_LABELS } from "../../app/dev/book-preview/model";
import { DetailSheet, LegalDocument, LEGAL_TITLES } from "../../app/dev/book-preview/BookLegal";
import { prePaymentRefundNoticeKo } from "../../lib/legal/refundPolicy";
import { prePaymentPrivacyNoticeKo } from "../../lib/legal/privacyPolicy";
import type { ReportInputPayload } from "../../lib/report-generation/reportInputTypes";
import { bookCheckoutSnapshot } from "../../lib/book/form";
import { bookForProduct, readerTitle } from "../../lib/book/product";
import { BIRTH_TIME_SLOT_DEFINITIONS } from "../../lib/saju/birthTimePrecisionTypes";
import s from "../../app/dev/book-preview/book.module.css";
import { useAccountSession } from "../account/AccountSession";
import { purchasePolicyLabel, type AccountSession } from "../../lib/account/policy";
import { CouponChooser, type CouponChoice } from "./CouponChooser";
import { interaction, syncLocalFacts } from "../../lib/analytics/client";
import { checkoutReturnKey, useTicketPublication } from "./useTicketPublication";
import { recordBookReturn } from "../../lib/tickets/shopClient";
import { receiptMethodKey } from "../../lib/tickets/shopContract";

type CheckoutProps = { payload: ReportInputPayload; now: string; internal: boolean; authEnabled?: boolean; ticketShopEnabled?: boolean; onPublishing: () => void; onError: (message: string) => void };
export function BookCheckout(props: CheckoutProps) {
  const authEnabled = props.authEnabled ?? props.internal;
  const { session, loaded, error, refresh } = useAccountSession(props.internal, authEnabled);
  if (authEnabled && !loaded) return <p role="status">로그인 상태를 확인하고 있습니다.</p>;
  if (authEnabled && error) return <div role="alert">로그인 상태를 확인하지 못했습니다. <button onClick={() => void refresh()}>다시 확인</button></div>;
  // A status change remounts the receipt; prior consent is never silently carried over.
  return <BookCheckoutReceipt key={session.status} {...props} authEnabled={authEnabled} session={session} />;
}
function BookCheckoutReceipt({ payload, now, internal, onPublishing, onError, session, authEnabled, ticketShopEnabled = false }: CheckoutProps & { session: AccountSession }) {
  useEffect(() => { interaction("checkout_started", payload.productKey); }, [payload.productKey]);
  const label = (id: keyof CheckoutLegalConfirmations) => id === "policyAgreement" && session.status === "member" ? purchasePolicyLabel(session) : CONSENT_SHORT_LABELS[id];
  const [consents, setConsents] = useState<CheckoutLegalConfirmations>(emptyDevTossCheckoutLegalConfirmations), [detail, setDetail] = useState<string | null>(null), [busy, setBusy] = useState(false);
  const lock = useRef(false), allRef = useRef<HTMLInputElement>(null);
  const ticketRequest = useRef<string | null>(null);
  const couponRequest = useRef<string | null>(null);
  const chosenMethod = useRef(false);
  const accountScope = useRef("");
  const [couponOrder,setCouponOrder] = useState<string | null>(null);
  const [coupon,setCoupon] = useState<CouponChoice>({quote:null});
  const [tickets, setTickets] = useState<number | null>(null), [method, setMethod] = useState<"payment" | "ticket">("payment");
  const [balanceError, setBalanceError] = useState(false), [balanceRetry, setBalanceRetry] = useState(0);
  const [accountChanged, setAccountChanged] = useState(false);
  const publication = useTicketPublication(payload.productKey, !internal && session.status === "member");
  useEffect(() => {
    if (session.status !== "member") return;
    const abort = new AbortController();
    const refresh = () => {
      if (document.hidden) return;
      void fetch(ticketShopEnabled ? `${internal ? "/dev/account/tickets/api" : "/api/ticket-bundles"}/state` : `${internal ? "/dev/account/api" : "/auth"}/ticket-summary`, { cache: "no-store", signal: abort.signal }).then(async r => {
        const b = await r.json(); if (abort.signal.aborted) return;
        if (!r.ok || !Number.isInteger(b.quantity) || b.quantity < 0) { setBalanceError(true); return; }
        setBalanceError(false); setTickets(b.quantity);
        if (ticketShopEnabled) {
          if (accountScope.current && accountScope.current !== b.scope) { setConsents(emptyDevTossCheckoutLegalConfirmations); setAccountChanged(true); setBalanceError(true); return; }
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
    } catch { onError("입력 내용을 보존하지 못했습니다. 다시 시도해 주세요."); }
    finally { lock.current = false; setBusy(false); }
  }
  const snapshot = bookCheckoutSnapshot(payload), book = bookForProduct(payload.productKey)!, product = getReportProduct(payload.productKey)!;
  const age = getCheckoutAgeGateStatus(snapshot.birthDate, new Date(now)), allowed = age === "adult" || age === "minor";
  const items = CONSENTS.filter(c => c.id !== "minorLegalRepresentative" || age === "minor"), all = items.every(c => consents[c.id]), some = items.some(c => consents[c.id]);
  useEffect(() => { if (allRef.current) allRef.current.indeterminate = some && !all; }, [some, all]);
  const ready = isDevTossCheckoutLegalConfirmationComplete(snapshot, consents, new Date(now));
  const checkingBalance = session.status === "member" && (tickets === null || balanceError);
  const ticketPending = !internal && publication.pending;
  const ticketSelected = ticketPending || method === "ticket";
  const blocked = busy || publication.submitting || ticketPending || checkingBalance || accountChanged || (!internal && !publication.loaded) || session.status === "needs_consent";
  const selected = items.find(c => c.id === detail);
  const submit = async () => {
    if (lock.current || blocked || !ready || (method === "ticket" && !tickets) || (internal&&method==="payment"&&!coupon.quote&&!couponOrder)) return;
    if (ticketShopEnabled && session.status === "member") {
      lock.current = true; setBusy(true);
      try {
        const r = await fetch(`${internal ? "/dev/account/tickets/api" : "/api/ticket-bundles"}/state`, { cache: "no-store", headers: { "x-ticket-account": accountScope.current }, signal: AbortSignal.timeout(15_000) });
        const current = await r.json();
        if (!r.ok || current.scope !== accountScope.current) { setAccountChanged(true); setConsents(emptyDevTossCheckoutLegalConfirmations); return; }
      } catch { setBalanceError(true); return; }
      finally { lock.current = false; setBusy(false); }
    }
    if (!internal && method === "ticket") {
      // Synchronous lock covers the async fingerprint before pending is set.
      lock.current = true; chosenMethod.current = true; setBusy(true); onError("");
      try { await publication.submit(payload, consents, accountScope.current || undefined); }
      finally { lock.current = false; setBusy(false); }
      return;
    }
    lock.current = true; setBusy(true); onError("");
    if (!internal) {
      // Reuse the existing production prepare + validated Toss SDK launcher.
      // Local preview below still requires its explicit mock runtime.
      const result = await runDevTossCheckout(snapshot, consents, undefined, { productType: payload.productKey, easyPay: "TOSSPAY" });
      if (!result.ok) { onError(result.messageKo); lock.current = false; setBusy(false); }
      return;
    }
    if (method === "ticket") {
      ticketRequest.current ??= crypto.randomUUID();
      try {
        const response = await fetch("/dev/account/api/ticket-redeem", { method: "POST", headers: { "content-type": "application/json", ...(accountScope.current ? { "x-ticket-account": accountScope.current } : {}) }, body: JSON.stringify({ requestId: ticketRequest.current, payload, consent: createCheckoutConsentAssertion(consents) }) });
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
          const r=await fetch("/dev/account/api/coupon-prepare",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({requestId:couponRequest.current,payload,consent:createCheckoutConsentAssertion(consents),selection:coupon.selection})});
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
    const result = await runDevTossCheckout(snapshot, consents, {
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
    }, { productType: payload.productKey, easyPay: "TOSSPAY" });
    if (!result.ok) { onError("입력 또는 모의 발행 결과를 확인해 주세요. 실제 결제는 실행하지 않았습니다."); lock.current = false; setBusy(false); }
  };
  return <div className={s.receipt} data-book-checkout><p className={s.micro}>GYEOL REPORT</p><h1>발행 주문서</h1><p className={s.micro}>PUBLISHING ORDER</p>
    <dl>{[["TITLE", readerTitle(book, payload.productKey !== "saju_mbti_compatibility" && "selectedYear" in payload.productOptions ? payload.productOptions.selectedYear : "")], ["ISSUED TO", snapshot.displayName ?? ""], ["PRICE", ticketSelected ? "리포트 이용권 1장" : `${(coupon.quote?.finalAmount??product.amount).toLocaleString("ko-KR")}원`]].map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl>
    {method==="payment"&&coupon.selection&&coupon.quote?<dl aria-label="쿠폰 적용 금액"><div><dt>상품 금액</dt><dd>₩{coupon.quote.originalAmount.toLocaleString("ko-KR")}</dd></div><div><dt>쿠폰 할인</dt><dd>−₩{coupon.quote.discountAmount.toLocaleString("ko-KR")}</dd></div><div><dt>결제 금액</dt><dd>₩{coupon.quote.finalAmount.toLocaleString("ko-KR")}</dd></div></dl>:null}
    <dl>{(payload.productKey === "saju_mbti_compatibility" ? [payload.personA, payload.personB] : [payload.person]).map((p, i) => <div key={i}><dt>{p.name}</dt><dd>{p.birthDate} · {p.birthTimeUnknown ? "시간 모름" : p.birthTime || `대략 · ${BIRTH_TIME_SLOT_DEFINITIONS.find(s => s.value === p.approximateBirthTimeSlot)?.labelKo ?? "미확인"}`} · {p.mbtiType || "MBTI 모름"}</dd></div>)}</dl>
    <p className={s.receiptNote}>입력값 기반 자동 생성 디지털 리포트 · 사람 상담 아님<br />{ticketSelected ? "이용권 사용 후 즉시 생성" : "결제 완료 후 즉시 생성, 최대 24시간 이내 제공"}<br />생성일로부터 90일 · {ticketSelected ? "온라인 열람" : "결제 후 온라인 열람"}</p>
    {session.status === "member" ? <fieldset className={s.consents}><legend>발행 방법</legend>
      {accountChanged ? <p role="alert">계정이 변경되었습니다. <a href={`${internal ? "/dev/book-flow/input" : "/report/new"}?product=${payload.productKey}`}>입력부터 다시 확인해 주세요.</a></p> : null}
      {checkingBalance ? <p role={balanceError ? "alert" : "status"}>{balanceError ? "이용권을 확인하지 못했습니다." : "이용권을 확인하고 있습니다."}{balanceError ? <button onClick={() => setBalanceRetry(n => n + 1)}>다시 확인</button> : null}</p> : <>
        <label><input type="radio" name="method" checked={ticketSelected} disabled={blocked || !tickets || couponOrder !== null} onChange={() => { choose("ticket"); interaction("ticket_selected", payload.productKey); }} />리포트 이용권 1장 사용 · 남은 이용권 {tickets}장</label>
        <label><input type="radio" name="method" checked={!ticketSelected} disabled={blocked || couponOrder !== null} onChange={() => choose("payment")} />{product.amount.toLocaleString("ko-KR")}원 직접 결제</label>
        {tickets === 0 && !ticketPending ? <p>보유한 이용권이 없습니다. 단품 결제로 계속할 수 있습니다.</p> : null}
        {ticketShopEnabled && !ticketPending ? <button type="button" disabled={blocked} onClick={() => void visitShop()}>묶음 이용권 구매하기 →</button> : null}
      </>}
    </fieldset> : null}
    {!internal && publication.message ? <p role="status">{publication.message}</p> : null}
    {ticketPending && publication.retryable ? <button disabled={!ready || publication.submitting || accountChanged} onClick={() => void publication.submit(payload, consents, accountScope.current || undefined)}>같은 발행 요청 다시 확인</button> : null}
    {!internal && publication.completedUrl ? <a href={publication.completedUrl}>완성된 책 펼쳐보기</a> : null}
    {internal?<CouponChooser productType={payload.productKey} disabled={busy||method==="ticket"||couponOrder!==null} ticketSelected={method==="ticket"} member={session.status==="member"} onChange={setCoupon} />:null}
    <fieldset className={s.consents}><legend className={s.srOnly}>구매 동의</legend><label className={s.allConsent}><input ref={allRef} type="checkbox" checked={all} disabled={!allowed || busy} onChange={e => setConsents({ ...consents, ...Object.fromEntries(items.map(c => [c.id, e.target.checked])) })} />전체 동의</label>
      {items.map(c => <div className={s.consentRow} key={c.id}><label><input type="checkbox" checked={consents[c.id]} disabled={!allowed || busy} onChange={e => setConsents({ ...consents, [c.id]: e.target.checked })} />[필수] {label(c.id)}</label><button type="button" onClick={() => setDetail(c.id)} aria-label={`${label(c.id)} 상세 보기`}>보기 ›</button></div>)}
    </fieldset>
    {!allowed ? <p role="alert">만 14세 이상만 이용할 수 있습니다.</p> : null}
    {!internal && authEnabled && session.status !== "member" ? <a onClick={() => { try { sessionStorage.setItem(checkoutReturnKey(payload.productKey), "1"); } catch { /* draft remains optional */ } }} href={`/login?next=${encodeURIComponent(`/report/new?product=${payload.productKey}`)}`}>{session.status === "needs_consent" ? "회원 동의 확인 후 이어서 구매하기" : "로그인하고 이어서 구매하기"}</a> : null}
    <button type="button" className={s.orderButton} disabled={!ready || blocked || (method === "ticket" && !tickets) || (internal&&method==="payment"&&!coupon.quote&&!couponOrder)} onClick={submit}>{ticketPending ? "책 발행 상태 확인 중" : busy && method === "ticket" ? "이용권으로 책을 만드는 중" : method === "ticket" ? "이용권 1장으로 책 발행하기" : internal ? "모의 결제 · 책 발행" : "결제하기"} →</button>
    {detail ? <DetailSheet title={selected ? label(selected.id) : "구매 안내"} onClose={() => setDetail(null)}>{selected ? <p>{selected.id === "policyAgreement" && session.status === "member" ? "환불정책을 확인하고 동의합니다." : selected.label}</p> : null}<p>{prePaymentRefundNoticeKo}</p><p>{prePaymentPrivacyNoticeKo}</p>{LEGAL_TITLES.map((title, i) => <details key={title} open={detail === `policy-${i}`}><summary>{title} +</summary><LegalDocument index={i} onNavigate={n => setDetail(`policy-${n}`)} /></details>)}</DetailSheet> : null}
  </div>;
}
