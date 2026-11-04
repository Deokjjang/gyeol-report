"use client";
import { useState } from "react";
import { orderStatusLabel, productLabel, REQUEST_REASONS, seoulDateTime, won, type OrderSummary } from "../../lib/ops/orders/summary";
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

/** 문의·환불 요청: 주문이 자동으로 붙는다. 회원은 orderCode, 비회원(결제 완료 화면)은 토스 orderId + paymentKey. */
export function OrderRequestForm({ orderCode, guest, endpoint = "/auth/orders" }: { orderCode?: string; guest?: { providerOrderId: string; paymentKey: string }; endpoint?: string }) {
  const [open, setOpen] = useState(false), [reason, setReason] = useState(""), [memo, setMemo] = useState(""), [busy, setBusy] = useState(false), [message, setMessage] = useState("");
  async function submit() {
    if (!reason || busy) return;
    setBusy(true); setMessage("");
    try {
      const r = await fetch(endpoint, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ op: "request", reason, memo, ...(guest ?? { orderCode }) }) });
      const b = await r.json();
      setMessage(b.message ?? b.error ?? (r.ok ? "접수했어요." : "다시 시도해 주세요."));
      if (r.ok) { setOpen(false); setReason(""); setMemo(""); }
    } catch { setMessage("요청을 보내지 못했어요. 다시 시도해 주세요."); }
    finally { setBusy(false); }
  }
  return <>
    {!open ? <button type="button" className={s.button} onClick={() => setOpen(true)}>문의·환불 요청</button> : null}
    {open ? <div className={s.form} role="group" aria-label={`${orderCode ?? "이 주문"} 문의`}>
      <label>사유<select value={reason} onChange={e => setReason(e.target.value)}><option value="">고르기</option>{REQUEST_REASONS.map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
      <label>메모(선택)<textarea maxLength={1000} value={memo} onChange={e => setMemo(e.target.value)} placeholder="계산이 이상한 부분, 열리지 않는 화면 등을 적어 주세요." /></label>
      <p className={s.hint}>디지털 콘텐츠라 단순 변심 환불은 제한돼요. 계산 오류가 확인되면 다시 만들어 드리거나 환불해 드려요.</p>
      <div className={s.actions}><button type="button" className={`${s.button} ${s.dark}`} disabled={!reason || busy} onClick={() => void submit()}>요청 보내기</button><button type="button" className={s.button} onClick={() => setOpen(false)}>닫기</button></div>
    </div> : null}
    {message ? <p className={s.message} role="status">{message}</p> : null}
  </>;
}
