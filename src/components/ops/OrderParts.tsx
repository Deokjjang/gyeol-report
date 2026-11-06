"use client";
import { useState } from "react";
import { REQUEST_COPY, REQUEST_WINDOW_LINE, SUPPORT_CHAT_LABEL, SUPPORT_CHAT_URL } from "../../lib/legal/socialLinks";
import { orderStatusLabel, productLabel, seoulDateTime, won, type OrderSummary } from "../../lib/ops/orders/summary";
import s from "./ops.module.css";

/** 주문 한 건(주문코드·상품·일시·금액·상태·영수증). 결제 완료 화면과 서재가 같이 쓴다. */
export function OrderSummaryCard({ order, bookHref, children }: { order: OrderSummary; bookHref?: string | null; children?: React.ReactNode }) {
  return <div className={s.order} data-order-code={order.orderCode}>
    <dl>
      <dt>주문코드</dt><dd><b>{order.orderCode}</b></dd>
      <dt>상품</dt><dd>{productLabel(order.productType)}</dd>
      <dt>결제 일시</dt><dd>{seoulDateTime(order.paidAt ?? order.createdAt)}</dd>
      <dt>금액</dt><dd>{won(order.amount)}</dd>
      <dt>상태</dt><dd>{orderStatusLabel(order)}{order.openRequests ? " · 문의 접수됨" : ""}</dd>
      <dt>영수증</dt><dd>{order.receiptUrl ? <a className={s.link} href={order.receiptUrl} target="_blank" rel="noopener noreferrer">영수증 보기 ↗</a> : "토스 결제 내역에서 확인할 수 있어요"}</dd>
    </dl>
    <div className={s.actions}>{bookHref ? <a className={`${s.button} ${s.dark}`} href={bookHref}>{order.bookStatus === "COMPLETED" ? "책 펼치기 →" : "제본 상태 보기 →"}</a> : null}{children}</div>
  </div>;
}

/**
 * 문의·환불 요청(운영 Q 2부). 확인 없이 바로 처리할 수 있는 것만 사이트에서 접수하고, 판단·대화가 필요한 것은 카카오톡 채널로 보낸다.
 * 사유 셋: ① 책이 안 나오거나 안 열려요(접수, 결제 30분 안 만드는 중이면 기다려 달라고만) ② 같은 걸 두 번 결제했어요(서버가 찾으면 접수)
 * ③ 계산이나 내용이 이상해요(접수하지 않음 — 안내 한 줄 + 카카오톡 채널). 기기·브라우저 정보는 서버가 붙인다. 메모 칸은 없다.
 * 회원은 orderCode(이용권 책은 reportId), 비회원(결제 완료 화면)은 토스 orderId + paymentKey.
 */
type Reason = "" | "not_open" | "double_paid" | "calc";
export function OrderRequestForm({ orderCode, reportId, guest, endpoint = "/auth/orders", startOpen = false, submitted = false, making = false, ticketBook = false, onClose, onSubmitted }: {
  orderCode?: string; reportId?: string; guest?: { providerOrderId: string; paymentKey: string }; endpoint?: string; startOpen?: boolean;
  /** 이 주문(책)에 열린 요청이 있으면 「접수됨」만 보인다. */ submitted?: boolean;
  /** 결제(접수) 뒤 30분 안이고 아직 만드는 중. */ making?: boolean;
  /** 이용권으로 만든 책: 두 번 결제 사유가 없다. */ ticketBook?: boolean;
  onClose?: () => void; onSubmitted?: () => void;
}) {
  const [open, setOpen] = useState(startOpen), [reason, setReason] = useState<Reason>(""), [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(""), [channel, setChannel] = useState(false), [done, setDone] = useState(submitted);
  const options: [Reason, string][] = [["not_open", REQUEST_COPY.notOpen], ...(ticketBook ? [] : [["double_paid", REQUEST_COPY.doublePaid] as [Reason, string]]), ["calc", REQUEST_COPY.calc]];
  async function submit() {
    if ((reason !== "not_open" && reason !== "double_paid") || busy) return;
    setBusy(true); setMessage(""); setChannel(false);
    try {
      const r = await fetch(endpoint, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ op: "request", reason, ...(guest ?? (orderCode ? { orderCode } : { reportId })) }) });
      const b = await r.json().catch(() => ({})) as { message?: string; error?: string; submitted?: boolean; channel?: boolean };
      setMessage(b.message ?? b.error ?? (r.ok ? REQUEST_COPY.accepted : "다시 시도해 주세요."));
      setChannel(b.channel === true);
      if (r.ok || b.submitted) { setDone(true); setOpen(false); onSubmitted?.(); }
    } catch { setMessage("요청을 보내지 못했어요. 다시 시도해 주세요."); }
    finally { setBusy(false); }
  }
  const chat = (label: string, dark = false) => <a className={`${s.button}${dark ? ` ${s.dark}` : ""}`} href={SUPPORT_CHAT_URL} target="_blank" rel="noopener noreferrer">{label}</a>;
  const submitButton = <button type="button" className={`${s.button} ${s.dark}`} disabled={busy} onClick={() => void submit()}>{REQUEST_COPY.submit}</button>;
  if (done) return <>
    <button type="button" className={s.button} disabled aria-disabled="true" data-request-submitted>{REQUEST_COPY.submitted}</button>
    {message ? <p className={s.message} role="status">{message}</p> : null}
  </>;
  return <>
    {!open ? <button type="button" className={s.button} onClick={() => setOpen(true)}>문의·환불 요청</button> : null}
    {open ? <div className={s.form} role="group" aria-label={`${orderCode ?? "이 책"} 문의`} data-request-form>
      <fieldset className={s.reasons}><legend>어떤 문제인가요?</legend>
        {options.map(([k, label]) => <label key={k} className={s.check}><input type="radio" name={`reason-${orderCode ?? reportId ?? "order"}`} value={k} checked={reason === k}
          onChange={() => { setReason(k); setMessage(""); setChannel(false); }} />{label}</label>)}
      </fieldset>
      {reason === "not_open" ? (making ? <p className={s.message} role="status" data-request-making>{REQUEST_COPY.making}</p>
        : <><p className={s.hint}>{REQUEST_COPY.notOpenHint}</p><div className={s.actions}>{submitButton}</div></>) : null}
      {reason === "double_paid" ? <div className={s.actions}>{submitButton}</div> : null}
      {reason === "calc" ? <><p className={s.hint}>{REQUEST_COPY.calcGuide}</p><p className={s.hint}>{REQUEST_COPY.calcSend}</p><div className={s.actions}>{chat(REQUEST_COPY.calcButton, true)}</div></> : null}
      {message ? <p className={s.message} role="status">{message}</p> : null}
      {channel ? <div className={s.actions}>{chat(SUPPORT_CHAT_LABEL)}</div> : null}
      <p className={s.hint} data-request-window-line>{REQUEST_WINDOW_LINE}</p>
      <p className={s.hint}><a className={s.link} href={SUPPORT_CHAT_URL} target="_blank" rel="noopener noreferrer">{REQUEST_COPY.otherLink}</a></p>
      <div className={s.actions}><button type="button" className={s.button} onClick={() => { setOpen(false); onClose?.(); }}>닫기</button></div>
    </div> : null}
    {!open && message ? <p className={s.message} role="status">{message}</p> : null}
  </>;
}
