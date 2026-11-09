"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { pageView, syncLocalFacts, setMetaChoice, setMetaFrame, syncMetaFacts } from "../../lib/analytics/client";
import { META_NOTICE_VERSION, metaOrigin, metaPiiNotice, metaTrackingNotice, metaTransferNotice, metaLocalReview, META_AVAILABLE_EVENT, META_CARD_SEEN_KEY, META_SETTINGS_EVENT } from "../../lib/analytics/metaConsent";
import styles from "./metaConsent.module.css";

// The notice card is shown once per notice version. Seen-state lives in localStorage AND a plain 1-year cookie so that either one surviving is enough.
const SEEN_MAX_AGE = 60 * 60 * 24 * 365, SEEN_COOKIE = "gyeol_meta_card_seen";
const cardSeen = () => {
  try { const at = Number(localStorage.getItem(META_CARD_SEEN_KEY)); if (at === 1 || at > Date.now() - SEEN_MAX_AGE * 1000) return true; } catch { /* blocked storage */ }
  return document.cookie.split("; ").includes(`${SEEN_COOKIE}=${META_NOTICE_VERSION}`);
};
const markCardSeen = () => {
  try { localStorage.setItem(META_CARD_SEEN_KEY, String(Date.now())); } catch { /* blocked storage: cookie below */ }
  try { document.cookie = `${SEEN_COOKIE}=${META_NOTICE_VERSION}; Max-Age=${SEEN_MAX_AGE}; Path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`; } catch { /* blocked cookies: once per page load */ }
};

// Third-party SDK is confined to an opaque sandbox with no parent DOM/URL access.
// 광고 설정(덕짱님 결정 A, 2026-11-09): choice true = 선택 동의, null = 기본 허용(행태정보만), false = 거부, undefined = 서버 답 전(보내지 않음).
export default function MetaPixel() {
  const pathname = usePathname();
  const bundleCallback = pathname?.startsWith("/account/tickets/checkout/") || pathname?.startsWith("/dev/account/tickets/");
  const [choice, setChoice] = useState<boolean | null | undefined>(undefined), [open, setOpen] = useState(false), [card, setCard] = useState(false), [available, setAvailable] = useState(false);
  const allowed = choice !== undefined && choice !== false;
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
      const known = result.choice === true ? true : result.choice === false ? false : null;
      setMetaChoice(result.ready === true ? known : false); setChoice(known); setReady(result.ready === true); setAvailable(true);
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
    if (bundleCallback || !allowed || !ready || !metaOrigin(window.location.origin)) return;
    // 서버 사실(가입 완료·결제) 주기 확인은 선택 동의 브라우저만. 기본 허용 브라우저의 결제는 결제 완료 화면 응답이 바로 준다(client.dispatchPurchase).
    const explicit = choice === true;
    const receive = (event: MessageEvent) => {
      if (event.source !== frame.current?.contentWindow || event.origin !== "null" || event.data?.type !== "gyeol:pixel-ready") return;
      setMetaFrame(frame.current.contentWindow); if (explicit) void syncMetaFacts();
    };
    window.addEventListener("message", receive);
    const timer = explicit ? setInterval(() => { if (document.visibilityState === "visible") void syncMetaFacts(); }, 5000) : undefined;
    return () => { window.removeEventListener("message", receive); clearInterval(timer); setMetaFrame(null); };
  }, [allowed, choice, ready, bundleCallback]);
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
  // 결정 A부터 닫기·확인은 선택이 아니다(기본 허용 그대로). 안내를 봤다는 것만 기억한다.
  const dismiss = () => { markCardSeen(); setCard(false); setOpen(false); };
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
    {!bundleCallback && allowed && ready && <iframe ref={frame} src="/api/analytics/meta/pixel" sandbox="allow-scripts" referrerPolicy="no-referrer" title="광고 성과 측정" hidden />}
    {open ? <div className={styles.panel}><strong>광고 설정</strong><p>{metaTrackingNotice}</p><p>{metaPiiNotice}</p>
      <details><summary>Meta 제공·국외 이전 상세 고지</summary><p>{metaTransferNotice}</p><a href="https://www.facebook.com/legal/technology_terms" target="_blank" rel="noreferrer">Meta 비즈니스 도구 약관</a> · <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noreferrer">Meta 개인정보처리방침</a></details>
      <p>지금 설정: {choice === false ? "거부(보내지 않음)" : choice === true ? "선택 동의(해시값 포함)" : "기본(행태정보만)"}</p>
      <label><input type="checkbox" checked={consents.measurement} onChange={e => setConsents({ ...consents, measurement: e.target.checked })} /> [선택] 이메일·휴대폰 번호 해시값과 가입 완료 여부의 광고 측정 수집·이용에 동의</label>
      <label><input type="checkbox" checked={consents.metaUse} onChange={e => setConsents({ ...consents, metaUse: e.target.checked })} /> [선택] 위 정보의 Meta 제공 및 Meta의 광고·서비스 개선 이용에 동의</label>
      <label><input type="checkbox" checked={consents.overseas} onChange={e => setConsents({ ...consents, overseas: e.target.checked })} /> [선택] 위 정보의 미국 이전에 별도 동의</label>
      <a href="/privacy">개인정보처리방침</a>
      <div className={styles.actions}><button disabled={busy} onClick={() => void choose(false)}>거부</button><button disabled={busy || !Object.values(consents).every(Boolean)} onClick={() => void choose(true)}>선택 동의</button><button disabled={busy} onClick={dismiss}>닫기</button></div>
      {failed ? <p role="alert">설정을 저장하지 못했습니다. 다시 시도해 주세요.</p> : null}</div>
      : card ? <div className={styles.card} ref={cardNode}><strong>광고 성과 측정 안내</strong><p>광고 성과를 재려고 방문·상품 조회·결제 여부 같은 행동 정보를 Meta에 보냅니다. 이름·이메일·전화번호는 보내지 않습니다. 원하지 않으면 거부를 누르세요. 거부해도 이용에 영향이 없고, 페이지 맨 아래 ‘광고 설정’에서 언제든 바꿀 수 있습니다.</p>
        <div><button disabled={busy} onClick={() => void choose(false)}>거부</button><button disabled={busy} onClick={() => { setCard(false); setOpen(true); }}>자세히</button><button disabled={busy} onClick={dismiss}>확인</button></div>
        {failed ? <p role="alert">설정을 저장하지 못했습니다. 다시 시도해 주세요.</p> : null}</div> : null}
  </aside>;
}
