"use client";
import { useEffect, useState } from "react";
type Lot = { quantity: number; expiresAt: string | null };
const kstDay = new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", month: "long", day: "numeric" });
/** 남은 이용권 묶음(만료 이른 순): "1장 · 12월 5일까지". 기한이 없는 예전 이용권은 "기한 없음". */
export function ticketLotLine(lot: Lot): string {
  const at = lot.expiresAt ? Date.parse(lot.expiresAt) : NaN;
  return `${lot.quantity}장 · ${Number.isFinite(at) ? `${kstDay.format(new Date(at))}까지` : "기한 없음"}`;
}
export function TicketSummary({ local = false }: { local?: boolean }) {
  const [quantity, setQuantity] = useState<number | null>(null), [error,setError] = useState(false);
  const [notice,setNotice] = useState(""), [lots, setLots] = useState<Lot[]>([]);
  useEffect(() => {
    let controller: AbortController | null = null;
    const refresh = () => {
      controller?.abort(); const current = new AbortController(); controller=current;
      setQuantity(null); setError(false); setNotice(""); setLots([]);
      void fetch(`${local ? "/dev/account/api" : "/auth"}/ticket-summary`, { cache: "no-store", signal: current.signal })
        .then(async r => { const data=await r.json(); if (!current.signal.aborted) { setQuantity(r.ok&&Number.isInteger(data.quantity)?data.quantity:null);setError(!r.ok||!Number.isInteger(data.quantity));setNotice(r.ok?[data.referralNotice,data.campaignNotice].filter(v=>typeof v==="string").join(" "):""); setLots(r.ok&&Array.isArray(data.lots)?data.lots.filter((l: Lot)=>Number.isInteger(l?.quantity)&&l.quantity>0):[]); } }).catch(() => { if(!current.signal.aborted)setError(true); });
    };
    const timer = setTimeout(refresh, 0); window.addEventListener("focus",refresh);
    const channel = typeof BroadcastChannel === "undefined" ? null : new BroadcastChannel("gyeol-account");
    if (channel) channel.onmessage = refresh;
    return () => { clearTimeout(timer); controller?.abort();window.removeEventListener("focus",refresh);channel?.close(); };
  }, [local]);
  return <div aria-live="polite" data-ticket-summary style={{ fontSize: 13, margin: "4px 0 24px" }}><p>리포트 이용권 <strong>{error ? "확인하지 못했습니다" : quantity === null ? "확인 중" : `${quantity}장`}</strong></p>{!error && quantity ? (lots.length ? <p style={{fontSize:12}} data-ticket-lots>{lots.slice(0, 3).map(ticketLotLine).join(" / ")}{lots.length > 3 ? ` 외 ${lots.length - 3}묶음` : ""}</p> : null) : null}{notice ? <p style={{fontSize:12}}>{notice}</p> : null}</div>;
}
