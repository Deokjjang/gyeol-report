"use client";
import { useEffect, useRef, useState } from "react";
import { getReportProduct } from "../../lib/payment/reportProductCatalog";
import { getCheckoutAgeGateStatus, type CheckoutLegalConfirmations } from "../../lib/payment/checkoutConsent";
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

export function BookCheckout({ payload, now, internal, onPublishing, onError }: { payload: ReportInputPayload; now: string; internal: boolean; onPublishing: () => void; onError: (message: string) => void }) {
  const [consents, setConsents] = useState<CheckoutLegalConfirmations>(emptyDevTossCheckoutLegalConfirmations), [detail, setDetail] = useState<string | null>(null), [busy, setBusy] = useState(false);
  const lock = useRef(false), allRef = useRef<HTMLInputElement>(null);
  const snapshot = bookCheckoutSnapshot(payload), book = bookForProduct(payload.productKey)!, product = getReportProduct(payload.productKey)!;
  const age = getCheckoutAgeGateStatus(snapshot.birthDate, new Date(now)), allowed = age === "adult" || age === "minor";
  const items = CONSENTS.filter(c => c.id !== "minorLegalRepresentative" || age === "minor"), all = items.every(c => consents[c.id]), some = items.some(c => consents[c.id]);
  useEffect(() => { if (allRef.current) allRef.current.indeterminate = some && !all; }, [some, all]);
  const ready = isDevTossCheckoutLegalConfirmationComplete(snapshot, consents, new Date(now));
  const selected = items.find(c => c.id === detail);
  const submit = async () => {
    if (!internal || lock.current || !ready) return;
    lock.current = true; setBusy(true); onError("");
    let orderId = "";
    // Mandatory local mock runtime. Never omit this third argument and never
    // call the provider/prepare endpoint from this integration phase.
    const result = await runDevTossCheckout(snapshot, consents, {
      fetch: async (path, init) => {
        if (path !== "/api/payment-checkout/prepare") return { ok: false, json: async () => ({}) };
        const response = await fetch("/dev/book-flow/api", { ...init, body: JSON.stringify({ operation: "prepare", request: JSON.parse(String(init.body)) }) });
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
    <dl>{[["TITLE", readerTitle(book, payload.productKey !== "saju_mbti_compatibility" && "selectedYear" in payload.productOptions ? payload.productOptions.selectedYear : "")], ["ISSUED TO", snapshot.displayName ?? ""], ["PRICE", `${product.amount.toLocaleString("ko-KR")}원`]].map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl>
    <dl>{(payload.productKey === "saju_mbti_compatibility" ? [payload.personA, payload.personB] : [payload.person]).map((p, i) => <div key={i}><dt>{p.name}</dt><dd>{p.birthDate} · {p.birthTimeUnknown ? "시간 모름" : p.birthTime || `대략 · ${BIRTH_TIME_SLOT_DEFINITIONS.find(s => s.value === p.approximateBirthTimeSlot)?.labelKo ?? "미확인"}`} · {p.mbtiType || "MBTI 모름"}</dd></div>)}</dl>
    <p className={s.receiptNote}>입력값 기반 자동 생성 디지털 리포트 · 사람 상담 아님<br />결제 완료 후 즉시 생성, 최대 24시간 이내 제공<br />생성일로부터 90일 · 결제 후 온라인 열람</p>
    <fieldset className={s.consents}><legend className={s.srOnly}>구매 동의</legend><label className={s.allConsent}><input ref={allRef} type="checkbox" checked={all} disabled={!allowed || busy} onChange={e => setConsents({ ...consents, ...Object.fromEntries(items.map(c => [c.id, e.target.checked])) })} />전체 동의</label>
      {items.map(c => <div className={s.consentRow} key={c.id}><label><input type="checkbox" checked={consents[c.id]} disabled={!allowed || busy} onChange={e => setConsents({ ...consents, [c.id]: e.target.checked })} />[필수] {CONSENT_SHORT_LABELS[c.id]}</label><button type="button" onClick={() => setDetail(c.id)} aria-label={`${CONSENT_SHORT_LABELS[c.id]} 상세 보기`}>보기 ›</button></div>)}
    </fieldset>
    {!allowed ? <p role="alert">만 14세 이상만 이용할 수 있습니다.</p> : null}
    <button type="button" className={s.orderButton} disabled={!ready || busy || !internal} onClick={submit}>{internal ? "모의 결제 · 책 발행" : "결제 연결 준비 중"} →</button>
    {detail ? <DetailSheet title={selected ? CONSENT_SHORT_LABELS[selected.id] : "구매 안내"} onClose={() => setDetail(null)}>{selected ? <p>{selected.label}</p> : null}<p>{prePaymentRefundNoticeKo}</p><p>{prePaymentPrivacyNoticeKo}</p>{LEGAL_TITLES.map((title, i) => <details key={title} open={detail === `policy-${i}`}><summary>{title} +</summary><LegalDocument index={i} onNavigate={n => setDetail(`policy-${n}`)} /></details>)}</DetailSheet> : null}
  </div>;
}
