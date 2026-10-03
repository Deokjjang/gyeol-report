"use client";
import { useEffect, useState } from "react";
export function TicketSummary({ local = false }: { local?: boolean }) {
  const [quantity, setQuantity] = useState<number | null>(null), [error,setError] = useState(false);
  const [notice,setNotice] = useState("");
  useEffect(() => {
    let controller: AbortController | null = null;
    const refresh = () => {
      controller?.abort(); const current = new AbortController(); controller=current;
      void fetch(`${local ? "/dev/account/api" : "/auth"}/ticket-summary`, { cache: "no-store", signal: current.signal })
        .then(async r => { const data=await r.json(); if (!current.signal.aborted) { setQuantity(r.ok&&Number.isInteger(data.quantity)?data.quantity:null);setError(!r.ok||!Number.isInteger(data.quantity));setNotice(r.ok?[data.referralNotice,data.campaignNotice].filter(v=>typeof v==="string").join(" "):""); } }).catch(() => { if(!current.signal.aborted)setError(true); });
    };
    refresh(); window.addEventListener("focus",refresh);
    return () => { controller?.abort();window.removeEventListener("focus",refresh); };
  }, [local]);
  return <div aria-live="polite" data-ticket-summary style={{ fontSize: 13, margin: "4px 0 24px" }}><p>리포트 이용권 <strong>{error ? "확인하지 못했습니다" : quantity === null ? "확인 중" : `${quantity}장`}</strong></p>{notice ? <p style={{fontSize:12}}>{notice}</p> : null}</div>;
}
