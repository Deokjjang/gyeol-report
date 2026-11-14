"use client";
import { useEffect, useState } from "react";
import { SALES_PAUSED_MESSAGE } from "../../lib/ops/config";

/**
 * W3 P0: 4종 판매 중지 상태(/api/sales, 서버가 10초 기억). 읽기 전·못 읽으면 null(판매 중) — 실제 차단은 서버 결제·이용권 API가 한다.
 * W4 Q0: 멈춤이면 서버가 준 고객 문구(이유대로 — AI 서버 점검 / 기존 문구)를 돌려준다.
 */
export function useSalesPaused(): string | null {
  const [message, setMessage] = useState<string | null>(null);
  useEffect(() => {
    const abort = new AbortController();
    void (async () => {
      try {
        const r = await fetch("/api/sales", { cache: "no-store", signal: abort.signal });
        const body = r.ok ? await r.json() as { paused?: unknown; message?: unknown } : null;
        if (body?.paused === true) setMessage(typeof body.message === "string" && body.message ? body.message : SALES_PAUSED_MESSAGE);
      } catch { /* 판매 중으로 둔다 */ }
    })();
    return () => abort.abort();
  }, []);
  return message;
}
