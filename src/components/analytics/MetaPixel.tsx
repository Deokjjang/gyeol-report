"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { pageView, syncLocalFacts, setMetaChoice } from "../../lib/analytics/client";
import { metaOrigin, metaTrackingNotice, metaLocalReview } from "../../lib/analytics/metaConsent";
import styles from "./metaConsent.module.css";

// The historical name is retained; no third-party browser SDK/noscript beacon.
// Only first-party allowlisted requests reach the server CAPI adapter.
export default function MetaPixel() {
  const pathname = usePathname();
  const [choice, setChoice] = useState<boolean | null>(null), [open, setOpen] = useState(false), [available, setAvailable] = useState(false);
  const [failed, setFailed] = useState(false), [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!metaLocalReview(new URL(window.location.href)) && (process.env.NODE_ENV !== "production" || !metaOrigin(window.location.origin))) return;
    let current = true;
    void fetch("/api/analytics/meta", { cache: "no-store", headers: { "x-request-id": crypto.randomUUID() } }).then(r => r.ok ? r.json() : null).then(result => {
      if (!current || !result) return;
      setMetaChoice(result.choice === true); setChoice(result.choice); setAvailable(true); setOpen(result.choice === null && result.ready === true);
    }).catch(() => {});
    return () => { current = false; };
  }, []);
  useEffect(() => {
    if (pathname) pageView(pathname);
    void syncLocalFacts();
  }, [pathname, choice]);
  async function choose(agreed: boolean) {
    setBusy(true); setFailed(false);
    // Stop local dispatch immediately when withdrawing.
    if (!agreed) setMetaChoice(false);
    try {
      const r = await fetch("/api/analytics/meta", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ agreed, requestId: crypto.randomUUID() }) });
      if (!r.ok) { setFailed(true); return; }
      setMetaChoice(agreed); setChoice(agreed); setOpen(false);
    } catch { setFailed(true); } finally { setBusy(false); }
  }
  if (!available) return null;
  return <aside className={styles.root} aria-label="광고 성과 측정 설정">
    {open ? <div className={styles.panel}><strong>광고 성과 측정 (선택)</strong><p>{metaTrackingNotice}</p><a href="/privacy">개인정보처리방침</a>
      <div className={styles.actions}><button disabled={busy} onClick={() => void choose(false)}>거부</button><button disabled={busy} onClick={() => void choose(true)}>허용</button><button disabled={busy} onClick={() => setOpen(false)}>닫기</button></div>
      {failed ? <p role="alert">설정을 저장하지 못했습니다. 다시 시도해 주세요.</p> : null}</div> : <button type="button" className={styles.settings} onClick={() => setOpen(true)}>광고 측정 설정{choice === true ? " · 허용" : choice === false ? " · 거부" : ""}</button>}
  </aside>;
}
