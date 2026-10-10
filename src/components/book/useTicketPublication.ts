"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ReportInputPayload } from "../../lib/report-generation/reportInputTypes";
import { createCheckoutConsentAssertion, type CheckoutLegalConfirmations } from "../../lib/payment/checkoutConsent";

type Pending = { requestId: string; fingerprint: string };
const validPending = (v: unknown): v is Pending => !!v && typeof v === "object" && "requestId" in v && "fingerprint" in v && typeof v.requestId === "string" && /^[a-f0-9-]{36}$/i.test(v.requestId) && typeof v.fingerprint === "string" && /^[a-f0-9]{64}$/.test(v.fingerprint);
export const ticketPendingKey = (product: string) => `gyeol-ticket-publication-v1:${product}`;
export const checkoutReturnKey = (product: string) => `gyeol-book-receipt-return-v1:${product}`;

// sessionStorage is a recovery hint only, never payment/owner authority. The
// server rechecks the current member on every status and reservation request.
export function useTicketPublication(product: string, enabled: boolean) {
  const key = ticketPendingKey(product);
  const [pending, setPending] = useState<Pending | null>(null), [loaded, setLoaded] = useState(false), [message, setMessage] = useState("");
  const [retryable, setRetryable] = useState(false), [revision, setRevision] = useState(0), [submitting, setSubmitting] = useState(false);
  const [completedUrl, setCompletedUrl] = useState<string | null>(null);
  const current = useRef<Pending | null>(null), sending = useRef(false), mounted = useRef(false);
  const forget = useCallback(() => {
    try { sessionStorage.removeItem(key); } catch { /* terminal state is confirmed by the server */ }
    current.current = null; setPending(null); setRetryable(false);
  }, [key]);
  const accept = useCallback((body: Record<string, unknown>) => {
    if (body.ok === true && typeof body.state === "string") {
      if (typeof body.message === "string") setMessage(body.message);
      setRetryable(false);
      if (body.state === "COMPLETED" && typeof body.reportUrl === "string" && /^\/reports\/report_[a-f0-9]{32}$/.test(body.reportUrl)) {
        // Terminal server acknowledgement ends recovery. Keep this mounted
        // receipt locked until navigation; a later NEW purchase must not bounce
        // forever to the previous report. No reservation is made on reload.
        try { sessionStorage.removeItem(key); sessionStorage.removeItem(checkoutReturnKey(product)); }
        catch { /* storage becoming unavailable must not hide a completed book */ }
        setCompletedUrl(body.reportUrl);
        window.location.assign(body.reportUrl);
      } else if (body.state === "REVERSED") { forget(); setRevision(n => n + 1); }
      return;
    }
    setMessage(typeof body.message === "string" ? body.message : "발행 상태를 확인 중입니다.");
    if (body.code === "NOT_FOUND") setRetryable(true); // Only a same-key explicit retry, never automatic re-reservation.
  }, [forget, key, product]);
  useEffect(() => {
    mounted.current = true;
    const timer = setTimeout(() => {
      try { const saved: unknown = JSON.parse(sessionStorage.getItem(key) ?? "null"); if (validPending(saved)) { current.current = saved; setPending(saved); } }
      catch { setMessage("발행 복구 정보를 저장할 수 없습니다. 브라우저 저장 공간을 확인해 주세요."); }
      setLoaded(true);
    }, 0);
    return () => { mounted.current = false; clearTimeout(timer); };
  }, [key]);
  useEffect(() => {
    if (!enabled || !pending || completedUrl) return;
    let busy = false, stopped = false, controller: AbortController | null = null;
    let deadline: ReturnType<typeof setTimeout> | undefined;
    const poll = async () => {
      if (document.hidden || busy || sending.current || stopped) return;
      busy = true; controller = new AbortController();
      deadline = setTimeout(() => controller?.abort(), 20_000);
      try {
        const response = await fetch(`/auth/ticket-status?requestId=${encodeURIComponent(pending.requestId)}`, { cache: "no-store", signal: controller.signal });
        const body = await response.json();
        if (!stopped && current.current?.requestId === pending.requestId) accept(body);
      } catch { if (!stopped) setMessage("발행 상태를 확인 중입니다. 잠시 후 다시 확인합니다."); }
      finally { clearTimeout(deadline); busy = false; }
    };
    void poll(); const timer = setInterval(() => void poll(), 5000);
    const focus = () => void poll();
    window.addEventListener("focus", focus); document.addEventListener("visibilitychange", focus);
    return () => { stopped = true; clearInterval(timer); clearTimeout(deadline); controller?.abort(); window.removeEventListener("focus", focus); document.removeEventListener("visibilitychange", focus); };
  }, [enabled, pending, completedUrl, accept]);
  const submit = async (payload: ReportInputPayload, consents: CheckoutLegalConfirmations) => {
    if (!enabled || !loaded || sending.current || completedUrl) return;
    sending.current = true; setSubmitting(true); setRetryable(false);
    const controller = new AbortController();
    const deadline = setTimeout(() => controller.abort(), 20_000);
    try {
      const fingerprint = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(JSON.stringify(payload))))).map(b => b.toString(16).padStart(2, "0")).join("");
      if (current.current && current.current.fingerprint !== fingerprint) { setMessage("이전 발행 결과를 확인 중입니다. 입력을 바꾸어 중복 발행하지 않습니다."); return; }
      const value = current.current ?? { requestId: crypto.randomUUID(), fingerprint };
      // If persistence fails, do not send a reservation that cannot be recovered.
      sessionStorage.setItem(key, JSON.stringify(value));
      sessionStorage.setItem(checkoutReturnKey(product), "1");
      current.current = value; setPending(value); setMessage("책 발행을 준비하고 있습니다.");
      const response = await fetch("/auth/ticket-redeem", { method: "POST", signal: controller.signal, headers: { "content-type": "application/json" }, body: JSON.stringify({ requestId: value.requestId, payload, consent: createCheckoutConsentAssertion(consents) }) });
      const body = await response.json();
      if (!mounted.current) return;
      // Only definitive pre-reservation rejections release the method lock.
      if (!body.ok && ["NO_USABLE_TICKET", "REFUND_HOLD", "INVALID_INPUT", "CONSENT_REQUIRED"].includes(body.code)) { forget(); setRevision(n => n + 1); }
      accept(body);
    } catch { if (mounted.current) setMessage("발행 상태를 확인 중입니다. 같은 요청으로 다시 확인합니다."); }
    finally { clearTimeout(deadline); sending.current = false; if (mounted.current) setSubmitting(false); }
  };
  return { pending: pending !== null, loaded, message, retryable, revision, submitting, completedUrl, submit };
}
