"use client";
import { useEffect, useState } from "react";

/** W3 P0: 4종 판매 중지 상태(/api/sales, 서버가 10초 기억). 읽기 전·못 읽으면 false(판매 중) — 실제 차단은 서버 결제·이용권 API가 한다. */
export function useSalesPaused(): boolean {
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const abort = new AbortController();
    void (async () => {
      try {
        const r = await fetch("/api/sales", { cache: "no-store", signal: abort.signal });
        const body = r.ok ? await r.json() as { paused?: unknown } : null;
        if (body?.paused === true) setPaused(true);
      } catch { /* 판매 중으로 둔다 */ }
    })();
    return () => abort.abort();
  }, []);
  return paused;
}
