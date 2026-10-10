"use client";
import { useEffect, useRef, useState } from "react";
import { refundReasons, refundStateText, refundPolicyCopy, refundRightsCopy, type RefundReason, type RefundResult } from "../../lib/tickets/refundContract";
import s from "./ticketShop.module.css";

type Request = (action: string, body?: object, account?: string, signal?: AbortSignal) => Promise<{ r: Response; data: RefundResult & { scope?: string } }>;
const won = (n: number) => `${n.toLocaleString("ko-KR")}원`;
export function TicketRefund({ orderId, scope, request, changed }: { orderId: string; scope: string; request: Request; changed: () => void }) {
  const [open,setOpen]=useState(false), [result,setResult]=useState<RefundResult | null>(null), [busy,setBusy]=useState(false), [message,setMessage]=useState("");
  const [reason,setReason]=useState<RefundReason>("UNUSED"), [confirm,setConfirm]=useState(false);
  const [submitted,setSubmitted]=useState(false);
  const lock=useRef(false), pending=useRef<string | null>(null), controller=useRef<AbortController | null>(null);
  useEffect(()=>()=>controller.current?.abort(),[]);
  async function run(action: "quote" | "request" | "withdraw") {
    if(lock.current) return;
    lock.current=true; setBusy(true); setMessage("");
    const abort=new AbortController(); controller.current=abort;
    const timer=setTimeout(()=>abort.abort(),25000);
    try {
      if(action==="request") setSubmitted(true);
      const body=action==="request" ? { bundleOrderId:orderId,requestId:pending.current ??= crypto.randomUUID(),reasonCode:reason }
        : action==="withdraw" ? { bundleOrderId:orderId,requestId:result?.refund?.requestId } : { bundleOrderId:orderId };
      const response=await request(`refund-${action}`,body,scope,abort.signal);
      const check=await request("state",undefined,scope,abort.signal);
      if(abort.signal.aborted || !check.r.ok || check.data.scope!==scope) { setResult(null); return; }
      if(!response.r.ok || !response.data.ok) {
        setMessage(response.data.code==="FINANCIAL_REVIEW_PENDING" ? "결제 취소 결과 확인 중에는 철회할 수 없습니다. 고객센터에서 확인해 드립니다." : "요청 상태를 확인하지 못했습니다. 상태를 다시 확인해 주세요. 중복 환불은 진행하지 않습니다.");
        return;
      }
      // Always re-quote committed facts, never render a pre-settlement balance.
      const latest=action==="quote" ? response : await request("refund-quote",{ bundleOrderId:orderId },scope,abort.signal);
      if(!abort.signal.aborted) {
        setResult(latest.data); setConfirm(false);
        if(latest.data.refund?.state==="WITHDRAWN") { pending.current=null; setSubmitted(false); }
        if(action!=="quote") changed();
      }
    } catch { if(!abort.signal.aborted) setMessage("연결이 끊겼습니다. 구매 내역에서 요청 상태를 다시 확인해 주세요."); }
    finally { clearTimeout(timer); lock.current=false; if(controller.current===abort) { setBusy(false); if(abort.signal.aborted) setMessage("확인이 지연되고 있습니다. 상태를 다시 확인해 주세요."); } }
  }
  const q=result?.quote, f=result?.refund, active=f && f.state!=="WITHDRAWN";
  return <div className={s.refund}>
    <button aria-expanded={open} onClick={()=>{ setOpen(!open); if(!open) void run("quote"); }}>환불·미사용 내역 {open ? "−" : "+"}</button>
    {open ? <div>
      {q ? <dl><dt>원래 구매</dt><dd>{q.purchased}장 · {won(q.paidAmount)}</dd><dt>사용 완료</dt><dd>{q.used}장</dd><dt>발행 진행 중</dt><dd>{q.pending}장</dd><dt>미사용 잔여</dt><dd>{q.remaining}장</dd><dt>이미 환불된 수량</dt><dd>{q.refunded}장</dd><dt>{f?.state==="COMPLETED" ? "확인된 환불금액" : "미사용분 예상 환불금액"}</dt><dd><strong>{f?.state==="COMPLETED" && f.amount!==null ? won(f.amount) : q.estimate===null ? "개별 확인 필요" : won(q.estimate)}</strong></dd></dl> : <p>{busy ? "원래 구매의 사용 내역을 확인 중입니다." : "내역을 다시 확인해 주세요."}</p>}
      {f ? <p role="status">{refundStateText[f.state]}{f.state==="COMPLETED" ? ` ${f.partial ? "부분 취소" : "전액 취소"} · ${f.quantity}장 회수` : ""}</p> : null}
      {q?.held ? <p>이 구매의 이용권은 사용 보류 중입니다. 소비 순서상 이 구매가 먼저이면 다른 이용권이 있어도 발행이 보류될 수 있습니다. 다른 원천을 임의로 대신 사용하지 않습니다.</p> : null}
      {q && q.pending>0 ? <p>진행 중인 발행이 완료되거나 복구된 뒤 수량과 환불액을 다시 확인합니다.</p> : null}
      {q && !active ? <>
        <label className={s.refundReason}>환불 사유<select value={reason} disabled={busy || submitted} onChange={e=>{ setReason(e.target.value as RefundReason); setConfirm(false); }}>{Object.entries(refundReasons).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
        <p>{refundPolicyCopy}</p><p>{refundRightsCopy}</p>
        <p>요청 접수 시 이 구매의 남은 이용권은 사용 보류되며, 환불이 확정되면 사용할 수 없습니다. 이미 완성된 책의 기존 90일 열람은 유지됩니다.</p>
        <label className={s.consent}><input type="checkbox" checked={confirm} disabled={busy} onChange={e=>setConfirm(e.target.checked)} />예상 금액과 사용 보류를 확인하고 환불 검토를 요청합니다.</label>
        <button disabled={!confirm || busy} onClick={()=>void run("request")}>환불 요청 접수</button>
      </> : null}
      {f?.canWithdraw ? <button disabled={busy} onClick={()=>void run("withdraw")}>환불 요청 철회 · 사용 보류 해제</button> : null}
      <button disabled={busy} onClick={()=>void run("quote")}>처리 상태 다시 확인</button>
      <p aria-live="polite">{message}</p>
      <p className={s.note}>개별 사유와 결제수단에 따른 추가 검토는 <a href="http://pf.kakao.com/_sbHaX/chat" target="_blank" rel="noopener noreferrer">고객센터</a>에서 안내합니다.</p>
    </div> : null}
  </div>;
}
