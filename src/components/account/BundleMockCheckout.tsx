"use client";
import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import s from "./ticketShop.module.css";
export function BundleMockCheckout() {
  const params = useSearchParams(), lock = useRef(false), [message, setMessage] = useState("");
  async function finish(outcome: string) {
    if (lock.current) return;
    lock.current = true; setMessage("모의 결과 전달 중");
    try {
      const r = await fetch("/dev/account/tickets/api/mock", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ orderId: params.get("orderId"), outcome }) });
      const result = await r.json();
      if (!r.ok) { setMessage("원래 계정의 주문을 확인해 주세요."); return; }
      const query = new URLSearchParams({ orderId: result.orderId, amount: String(result.amount), paymentKey: result.paymentKey });
      window.location.assign(`/dev/account/tickets/checkout/${outcome === "ABORTED" ? "fail" : "success"}?${query}`);
    } catch { setMessage("모의 결과를 전달하지 못했습니다."); }
    finally { lock.current = false; }
  }
  return <main className={s.root}><section className={s.sheet}><p className={s.eyebrow}>LOCAL MOCK / NO CHARGE</p><h1>묶음 결제 검수</h1><p>실제 Toss SDK·과금은 실행하지 않습니다.</p><button onClick={() => void finish("DONE")}>모의 승인</button> <button onClick={() => void finish("ABORTED")}>모의 결제 취소</button> <button onClick={() => void finish("PENDING")}>승인 응답 지연</button> <button onClick={() => void finish("GRANT_PENDING")}>승인 후 지급 지연</button><p role="status">{message}</p></section></main>;
}
