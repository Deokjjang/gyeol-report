"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { pageView, syncLocalFacts, setMetaChoice, setMetaFrame, syncMetaFacts } from "../../lib/analytics/client";
import { META_CONSENT_VERSION, metaOrigin, metaTrackingNotice, metaTransferNotice, metaLocalReview, META_AVAILABLE_EVENT, META_CARD_SEEN_KEY, META_SETTINGS_EVENT } from "../../lib/analytics/metaConsent";
import styles from "./metaConsent.module.css";

// The card is asked once. Seen-state lives in localStorage AND a plain 1-year cookie so that either one surviving is enough.
const SEEN_MAX_AGE = 60 * 60 * 24 * 365, SEEN_COOKIE = "gyeol_meta_card_seen";
const cardSeen = () => {
  try { const at = Number(localStorage.getItem(META_CARD_SEEN_KEY)); if (at === 1 || at > Date.now() - SEEN_MAX_AGE * 1000) return true; } catch { /* blocked storage */ }
  return document.cookie.split("; ").includes(`${SEEN_COOKIE}=${META_CONSENT_VERSION}`);
};
const markCardSeen = () => {
  try { localStorage.setItem(META_CARD_SEEN_KEY, String(Date.now())); } catch { /* blocked storage: cookie below */ }
  try { document.cookie = `${SEEN_COOKIE}=${META_CONSENT_VERSION}; Max-Age=${SEEN_MAX_AGE}; Path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`; } catch { /* blocked cookies: once per page load */ }
};

// Third-party SDK is confined to an opaque sandbox with no parent DOM/URL access.
export default function MetaPixel() {
  const pathname = usePathname();
  const bundleCallback = pathname?.startsWith("/account/tickets/checkout/") || pathname?.startsWith("/dev/account/tickets/");
  const [choice, setChoice] = useState<boolean | null>(null), [open, setOpen] = useState(false), [card, setCard] = useState(false), [available, setAvailable] = useState(false);
  const [failed, setFailed] = useState(false), [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);
  const [consents, setConsents] = useState({ measurement: false, metaUse: false, overseas: false });
  useEffect(() => {
    const withdrawn = () => { setMetaChoice(false); setChoice(false); };
    const settings = () => { setCard(false); setOpen(true); };
    window.addEventListener("gyeol:meta-withdrawn", withdrawn);
    window.addEventListener(META_SETTINGS_EVENT, settings);
    return () => { window.removeEventListener("gyeol:meta-withdrawn", withdrawn); window.removeEventListener(META_SETTINGS_EVENT, settings); };
  }, []);
  useEffect(() => {
    if (!metaLocalReview(new URL(window.location.href)) && (process.env.NODE_ENV !== "production" || !metaOrigin(window.location.origin))) return;
    let current = true;
    void fetch("/api/analytics/meta", { cache: "no-store", headers: { "x-request-id": crypto.randomUUID() } }).then(r => r.ok ? r.json() : null).then(result => {
      if (!current || !result) return;
      setMetaChoice(result.choice === true); setChoice(result.choice); setReady(result.ready === true); setAvailable(true);
      const firstVisit = result.choice === null && result.ready === true && !cardSeen();
      if (firstVisit || result.choice !== null) markCardSeen();
      setCard(firstVisit);
      // 푸터 "광고 설정"은 Meta 픽셀이 실제로 켜져 있을 때(서버 ready)만 보인다. 꺼져 있으면 숨긴다(P6e-ops 9).
      if (result.ready === true) document.documentElement.dataset.metaSettings = "available"; else delete document.documentElement.dataset.metaSettings;
      window.dispatchEvent(new Event(META_AVAILABLE_EVENT));
    }).catch(() => {});
    return () => { current = false; };
  }, []);
  useEffect(() => {
    if (bundleCallback) return;
    if (pathname) pageView(pathname);
    void syncLocalFacts();
  }, [pathname, choice, bundleCallback]);
  useEffect(() => {
    if (bundleCallback || choice !== true || !ready || !metaOrigin(window.location.origin)) return;
    const receive = (event: MessageEvent) => {
      if (event.source !== frame.current?.contentWindow || event.origin !== "null" || event.data?.type !== "gyeol:pixel-ready") return;
      setMetaFrame(frame.current.contentWindow); void syncMetaFacts();
    };
    window.addEventListener("message", receive);
    const timer = setInterval(() => { if (document.visibilityState === "visible") void syncMetaFacts(); }, 5000);
    return () => { window.removeEventListener("message", receive); clearInterval(timer); setMetaFrame(null); };
  }, [choice, ready, bundleCallback]);
  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;
    const channel = new BroadcastChannel("gyeol-meta-choice");
    channel.onmessage = event => { if (event.data === false) { setMetaChoice(false); setChoice(false); } };
    return () => channel.close();
  }, []);
  const cardNode = useRef<HTMLDivElement>(null);
  // The first-visit card sits in the page flow above everything; fixed-height screens subtract --meta-card-h so nothing is pushed under it.
  useEffect(() => {
    const node = cardNode.current, root = document.documentElement;
    if (!card || !node) { root.style.removeProperty("--meta-card-h"); return; }
    const measure = () => root.style.setProperty("--meta-card-h", `${Math.ceil(node.getBoundingClientRect().height)}px`);
    measure();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    observer?.observe(node); window.addEventListener("resize", measure);
    return () => { observer?.disconnect(); window.removeEventListener("resize", measure); root.style.removeProperty("--meta-card-h"); };
  }, [card]);
  // Closing counts as declining: remembered like an explicit choice and never asked again.
  const dismiss = (withChoice: boolean) => { markCardSeen(); setCard(false); setOpen(false); if (withChoice) void choose(false); };
  async function choose(agreed: boolean) {
    setBusy(true); setFailed(false);
    // Stop local dispatch immediately when withdrawing.
    if (!agreed) { setMetaChoice(false); setChoice(false); if (typeof BroadcastChannel !== "undefined") { const channel = new BroadcastChannel("gyeol-meta-choice"); channel.postMessage(false); channel.close(); } }
    try {
      const r = await fetch("/api/analytics/meta", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ agreed, ...(agreed ? consents : {}), requestId: crypto.randomUUID() }) });
      if (!r.ok) { setFailed(true); return; }
      setMetaChoice(agreed); setChoice(agreed); setOpen(false); setCard(false);
    } catch { setFailed(true); } finally { setBusy(false); }
  }
  if (!available) return null;
  return <aside className={styles.root} aria-label="광고 성과 측정 설정">
    {!bundleCallback && choice === true && ready && <iframe ref={frame} src="/api/analytics/meta/pixel" sandbox="allow-scripts" referrerPolicy="no-referrer" title="광고 성과 측정" hidden />}
    {open ? <div className={styles.panel}><strong>광고 성과 측정 (선택)</strong><p>{metaTrackingNotice}</p>
      <details><summary>Meta 제공·국외 이전 상세 고지</summary><p>{metaTransferNotice}</p><a href="https://www.facebook.com/legal/technology_terms" target="_blank" rel="noreferrer">Meta 비즈니스 도구 약관</a> · <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noreferrer">Meta 개인정보처리방침</a></details>
      <label><input type="checkbox" checked={consents.measurement} onChange={e => setConsents({ ...consents, measurement: e.target.checked })} /> [선택] 위 항목의 광고 측정 수집·이용에 동의</label>
      <label><input type="checkbox" checked={consents.metaUse} onChange={e => setConsents({ ...consents, metaUse: e.target.checked })} /> [선택] Meta 제공 및 Meta의 광고·서비스 개선 이용에 동의</label>
      <label><input type="checkbox" checked={consents.overseas} onChange={e => setConsents({ ...consents, overseas: e.target.checked })} /> [선택] 위 항목의 미국 이전에 별도 동의</label>
      <a href="/privacy">개인정보처리방침</a>
      <div className={styles.actions}><button disabled={busy} onClick={() => void choose(false)}>거부</button><button disabled={busy || !Object.values(consents).every(Boolean)} onClick={() => void choose(true)}>동의하고 허용</button><button disabled={busy} onClick={() => dismiss(choice === null)}>닫기</button></div>
      {failed ? <p role="alert">설정을 저장하지 못했습니다. 다시 시도해 주세요.</p> : null}</div>
      : card ? <div className={styles.card} ref={cardNode}><strong>광고 성과 측정 (선택)</strong><p>허용하면 방문·결제 여부 등 일부 정보가 Meta에 전달됩니다. 거부해도 이용에 영향이 없고, 페이지 맨 아래 ‘광고 설정’에서 언제든 바꿀 수 있습니다.</p>
        <div><button disabled={busy} onClick={() => void choose(false)}>거부</button><button disabled={busy} onClick={() => { setCard(false); setOpen(true); }}>자세히 보고 선택</button><button disabled={busy} onClick={() => dismiss(true)}>닫기</button></div>
        {failed ? <p role="alert">설정을 저장하지 못했습니다. 다시 시도해 주세요.</p> : null}</div> : null}
  </aside>;
}
