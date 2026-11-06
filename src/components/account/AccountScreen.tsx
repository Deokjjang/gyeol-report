"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ACCOUNT_POLICY_VERSIONS, type AccountProvider } from "../../lib/account/policy";
import { externalBrowserUrl, IN_APP_MENU_HINT, inAppBrowser, type InAppKind } from "../../lib/account/inAppBrowser";
import { DetailSheet, LegalDocument, LEGAL_TITLES } from "../../app/dev/book-preview/BookLegal";
import { announceAccountChange, useAccountSession } from "./AccountSession";
import s from "./account.module.css";
import { Library } from "./Library";
import { LibraryHome, startLibraryHome } from "./LibraryHome";
import { interaction } from "../../lib/analytics/client";
import { KakaoChannelPrompt } from "./KakaoChannelPrompt";
import { MarketingPanel, ProfileForm, WithdrawPanel } from "../ops/AccountOps";

/** 선물 링크로 로그인·가입을 시작한 경우(P 추가 F): 가입 정보까지 마치면 그 선물 화면으로 돌아가 자동으로 받는다(10분 돌아오기 쿠키가 지나도). */
export const GIFT_PENDING_KEY = "gyeol-gift-pending-v1";
function pendingGiftPath(): string | null {
  try {
    const raw = localStorage.getItem(GIFT_PENDING_KEY); if (!raw) return null;
    const v = JSON.parse(raw) as { token?: string; at?: number };
    if (typeof v.token !== "string" || !/^[A-Za-z0-9_-]{32}$/.test(v.token) || typeof v.at !== "number" || Date.now() - v.at > 86_400_000) { localStorage.removeItem(GIFT_PENDING_KEY); return null; }
    return `/gift/${v.token}`;
  } catch { return null; }
}

/** 결제하기 → 로그인을 거친 입력 사본(BookCheckout, 30분)이 있으면 그 상품 결제 화면으로 돌아간다(돌아오기 쿠키가 지나도). */
function pendingCheckoutPath(): string | null {
  try {
    const v = JSON.parse(localStorage.getItem("gyeol-book-return-backup-v1") ?? "null") as { productKey?: string; at?: number } | null;
    return v && typeof v.productKey === "string" && /^[a-z_]{3,40}$/.test(v.productKey) && typeof v.at === "number" && Date.now() - v.at < 30 * 60_000 ? `/report/new?product=${v.productKey}` : null;
  } catch { return null; }
}

export function AccountScreen({ local = false, loginError = false, next, ticketShopEnabled = false, prefetchLibrary = false }: { local?: boolean; loginError?: boolean; next?: string; ticketShopEnabled?: boolean; prefetchLibrary?: boolean }) {
  // P 속도: 서재 화면(/account)에서는 서재 묶음 조회를 로그인 상태 확인과 동시에 출발시킨다(회원이 아니면 401로 끝나고 버린다). 로그인 화면(/login)은 하지 않는다.
  useEffect(() => { if (!local && prefetchLibrary) void startLibraryHome(); }, [local, prefetchLibrary]);
  const { session, loaded, error, refresh, base, verifying } = useAccountSession(local);
  const [checked, setChecked] = useState({ terms: false, privacy: false }), [detail, setDetail] = useState<number | null>(null), [message, setMessage] = useState(loginError ? "로그인을 완료하지 못했어요. 다시 시도해 주세요." : ""), [busy, setBusy] = useState(false);
  const [inApp, setInApp] = useState<{ kind: InAppKind; ua: string; href: string } | null>(null), [googleHelp, setGoogleHelp] = useState(false), [infoOpen, setInfoOpen] = useState(false);
  const all = checked.terms && checked.privacy, some = checked.terms || checked.privacy, allRef = useRef<HTMLInputElement>(null), lock = useRef(false), requestId = useRef("");
  useEffect(() => { if (allRef.current) allRef.current.indeterminate = some && !all; }, [all, some, session.status]);
  const guest = local ? "/dev/book-flow" : "/";
  async function post(action: string, body: object) {
    const response = await fetch(`${base}/${action}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    const data = await response.json();
    return { response, data };
  }
  async function run(action: "start" | "consent" | "logout", provider?: AccountProvider) {
    if (lock.current) return;
    // 인앱 브라우저에서는 Google 로그인이 막힌다(Google 정책) → 바로 「기본 브라우저로 열기」 안내.
    if (action === "start" && provider === "google") {
      const kind = inAppBrowser(navigator.userAgent);
      if (kind) { setInApp({ kind, ua: navigator.userAgent, href: window.location.href }); setGoogleHelp(true); return; }
    }
    lock.current = true; setBusy(true); setMessage("");
    if (action === "start") interaction("signup_started");
    try {
      if (!requestId.current) requestId.current = crypto.randomUUID();
      const body = action === "start" ? { provider, ...(next ? { next } : {}) } : action === "consent" ? { requestId: requestId.current, ...checked, versions: ACCOUNT_POLICY_VERSIONS } : {};
      const { response, data } = await post(action, body);
      if (!response.ok) { setMessage(data.error ?? "다시 시도해 주세요."); return; }
      if (action === "start" && typeof data.url === "string") { window.location.assign(data.url); return; }
      if (action === "consent" && typeof data.next === "string") { window.location.assign(data.next); return; }
      requestId.current = ""; setChecked({ terms: false, privacy: false }); announceAccountChange(); await refresh();
    } catch { setMessage("요청을 완료하지 못했어요. 다시 시도해 주세요."); }
    finally { lock.current = false; setBusy(false); }
  }
  const external = inApp ? externalBrowserUrl(inApp.kind, inApp.ua, inApp.href) : null;
  return <main className={s.root}><header className={s.header}><Link href={guest}>결리포트</Link><Link href={local ? "/dev/account" : session.status === "member" ? "/account" : "/login"}>{session.status === "member" ? "내 서재" : "로그인"}</Link></header>
    <section className={`${s.sheet} ${session.status === "member" ? s.librarySheet : ""}`} aria-busy={busy || !loaded}>
      {local ? <p className={s.note}>로컬 인증 검수 · 실제 소셜 로그인 아님</p> : null}
      {!loaded ? <p role="status">로그인 상태 확인 중</p> : session.status === "guest" ? <>
        <p className={s.eyebrow}>GYEOL REPORT</p><h1>내 이야기를 이어서</h1><p>카카오 또는 Google 계정으로 로그인하세요.</p>
        <div className={s.providers}><button disabled={busy} onClick={() => run("start", "kakao")}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3C6.5 3 2 6.5 2 10.8c0 2.7 1.8 5 4.5 6.5L5.4 21l4.4-2.5c.7.1 1.4.2 2.2.2 5.5 0 10-3.5 10-7.9S17.5 3 12 3Z" /></svg>카카오로 계속하기</button>
          <button disabled={busy} onClick={() => run("start", "google")}><span className={s.google} aria-hidden="true">G</span>Google로 계속하기</button></div>
        {googleHelp && inApp ? <div className={s.inApp} role="alert" data-in-app-help={inApp.kind}>
          <b>이 앱 안에서는 Google 로그인이 안 돼요</b>
          <p>카카오로 계속하거나, 기본 브라우저(사파리·크롬)로 열어 Google로 로그인해 주세요.{external ? "" : ` ${IN_APP_MENU_HINT[inApp.kind]}`}</p>
          {external ? <a className={s.primary} href={external}>기본 브라우저로 열기</a> : null}
          <button type="button" className={s.small} onClick={() => { void navigator.clipboard?.writeText(inApp.href).then(() => setMessage("주소를 복사했어요. 기본 브라우저에 붙여 넣어 주세요."), () => undefined); }}>주소 복사</button>
        </div> : null}
      </> : session.status === "needs_consent" ? <>
        {session.compWaiting ? <p className={s.compWaiting} data-comp-waiting>업그레이드 기념 이용권이 서재에서 기다리고 있어요</p> : null}
        <p className={s.eyebrow}>WELCOME</p><h1>시작하기 전에</h1><p>{session.displayName}님, 현재 이용약관과 개인정보처리방침을 확인해 주세요.</p>
        <fieldset className={s.consents} disabled={busy}><legend className={s.srOnly}>가입 필수 동의</legend><label className={s.all}><input ref={allRef} type="checkbox" checked={all} onChange={e => setChecked({ terms: e.target.checked, privacy: e.target.checked })} />전체 동의</label>
          {(["terms", "privacy"] as const).map((key, i) => <div key={key} className={s.row}><label><input type="checkbox" checked={checked[key]} onChange={e => setChecked({ ...checked, [key]: e.target.checked })} />[필수] {LEGAL_TITLES[i]} 동의</label><button type="button" onClick={() => setDetail(i)} aria-label={`${LEGAL_TITLES[i]} 상세 보기`}>보기 ›</button></div>)}
        </fieldset><button className={s.primary} disabled={!all || busy} onClick={() => run("consent")}>동의하고 계속하기 →</button>
        <button className={s.small} disabled={busy} onClick={() => run("logout")}>로그아웃</button>
      </> : <>
        <p className={s.eyebrow}>ACCOUNT</p><h1>내 서재</h1>
        {!local && session.profile === "required" ? <ProfileForm onSaved={next => { const to = next ?? pendingGiftPath() ?? pendingCheckoutPath(); if (to) { window.location.assign(to); return; } announceAccountChange(); void refresh(); }} /> : null}
        {local || ticketShopEnabled ? <nav aria-label="내 계정"><Link href={local ? "/dev/account" : "/account"} aria-current="page">내 서재</Link> · <Link href={local ? "/dev/account/tickets" : "/account/tickets"}>내 이용권 →</Link></nav> : null}
        {local ? <Library local /> : <LibraryHome />}
        <details className={s.accountInfo} onToggle={e => setInfoOpen(e.currentTarget.open)}><summary>계정 정보</summary><p>{session.displayName}</p>{!local && infoOpen && session.profile === "complete" ? <MarketingPanel /> : null}<p><a href="/privacy">개인정보처리방침</a></p>{!local ? <WithdrawPanel onDone={() => { announceAccountChange(); window.location.assign("/"); }} /> : null}</details>
        <button className={s.small} disabled={busy} onClick={() => run("logout")}>로그아웃</button>
      </>}
      {message || error ? <p className={s.error} role="alert">{message || "로그인 상태를 확인하지 못했어요. 다시 시도해 주세요."}</p> : null}
      {session.status !== "member" ? <Link className={s.guest} href={guest}>로그인 없이 둘러보기 →</Link> : null}
    </section>
    {detail !== null ? <DetailSheet title={LEGAL_TITLES[detail]} onClose={() => setDetail(null)}><LegalDocument index={detail} onNavigate={setDetail} /></DetailSheet> : null}
    <KakaoChannelPrompt session={session} local={local} enabled={loaded && !verifying && !error && !busy && detail === null} />
  </main>;
}
