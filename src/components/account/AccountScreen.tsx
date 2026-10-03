"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ACCOUNT_POLICY_VERSIONS, type AccountProvider } from "../../lib/account/policy";
import { DetailSheet, LegalDocument, LEGAL_TITLES } from "../../app/dev/book-preview/BookLegal";
import { announceAccountChange, useAccountSession } from "./AccountSession";
import s from "./account.module.css";
import { Library } from "./Library";

export function AccountScreen({ local = false, loginError = false, next }: { local?: boolean; loginError?: boolean; next?: string }) {
  const { session, loaded, error, refresh, base } = useAccountSession(local);
  const [checked, setChecked] = useState({ terms: false, privacy: false }), [detail, setDetail] = useState<number | null>(null), [message, setMessage] = useState(loginError ? "로그인을 완료하지 못했습니다. 다시 시도하거나 로그인 없이 계속할 수 있습니다." : ""), [busy, setBusy] = useState(false);
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
    lock.current = true; setBusy(true); setMessage("");
    try {
      if (!requestId.current) requestId.current = crypto.randomUUID();
      const body = action === "start" ? { provider, ...(next ? { next } : {}) } : action === "consent" ? { requestId: requestId.current, ...checked, versions: ACCOUNT_POLICY_VERSIONS } : {};
      const { response, data } = await post(action, body);
      if (!response.ok) { setMessage(data.error ?? "다시 시도해 주세요."); return; }
      if (action === "start" && typeof data.url === "string") { window.location.assign(data.url); return; }
      if (action === "consent" && typeof data.next === "string") { window.location.assign(data.next); return; }
      requestId.current = ""; setChecked({ terms: false, privacy: false }); announceAccountChange(); await refresh();
    } catch { setMessage("요청을 완료하지 못했습니다. 다시 시도하거나 로그인 없이 계속해 주세요."); }
    finally { lock.current = false; setBusy(false); }
  }
  return <main className={s.root}><header className={s.header}><Link href={guest}>결리포트</Link><Link href={local ? "/dev/account" : session.status === "member" ? "/account" : "/login"}>{session.status === "member" ? "내 서재" : "로그인"}</Link></header>
    <section className={`${s.sheet} ${session.status === "member" ? s.librarySheet : ""}`} aria-busy={busy || !loaded}>
      {local ? <p className={s.note}>로컬 인증 검수 · 실제 소셜 로그인 아님</p> : null}
      {!loaded ? <p role="status">로그인 상태 확인 중</p> : session.status === "guest" ? <>
        <p className={s.eyebrow}>GYEOL REPORT</p><h1>내 이야기를 이어서</h1><p>카카오 또는 Google 계정으로 로그인하세요.</p>
        <div className={s.providers}><button disabled={busy} onClick={() => run("start", "kakao")}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3C6.5 3 2 6.5 2 10.8c0 2.7 1.8 5 4.5 6.5L5.4 21l4.4-2.5c.7.1 1.4.2 2.2.2 5.5 0 10-3.5 10-7.9S17.5 3 12 3Z" /></svg>카카오로 계속하기</button>
          <button disabled={busy} onClick={() => run("start", "google")}><span className={s.google} aria-hidden="true">G</span>Google로 계속하기</button></div>
      </> : session.status === "needs_consent" ? <>
        <p className={s.eyebrow}>WELCOME</p><h1>시작하기 전에</h1><p>{session.displayName}님, 현재 이용약관과 개인정보처리방침을 확인해 주세요.</p>
        <fieldset className={s.consents} disabled={busy}><legend className={s.srOnly}>가입 필수 동의</legend><label className={s.all}><input ref={allRef} type="checkbox" checked={all} onChange={e => setChecked({ terms: e.target.checked, privacy: e.target.checked })} />전체 동의</label>
          {(["terms", "privacy"] as const).map((key, i) => <div key={key} className={s.row}><label><input type="checkbox" checked={checked[key]} onChange={e => setChecked({ ...checked, [key]: e.target.checked })} />[필수] {LEGAL_TITLES[i]} 동의</label><button type="button" onClick={() => setDetail(i)} aria-label={`${LEGAL_TITLES[i]} 상세 보기`}>보기 ›</button></div>)}
        </fieldset><button className={s.primary} disabled={!all || busy} onClick={() => run("consent")}>동의하고 계속하기 →</button>
        <button className={s.small} disabled={busy} onClick={() => run("logout")}>로그아웃</button>
      </> : <>
        <p className={s.eyebrow}>ACCOUNT</p><h1>내 서재</h1><p>{session.displayName}님, 반갑습니다.</p>
        <Library local={local} />
        <details className={s.accountInfo}><summary>계정 정보</summary><p>{session.displayName}</p></details>
        <button className={s.small} disabled={busy} onClick={() => run("logout")}>로그아웃</button>
      </>}
      {message || error ? <p className={s.error} role="alert">{message || "로그인 상태를 확인하지 못했습니다. 다시 시도해 주세요."}</p> : null}
      {session.status !== "member" ? <Link className={s.guest} href={guest}>로그인 없이도 책을 만들 수 있습니다. →</Link> : null}
    </section>
    {detail !== null ? <DetailSheet title={LEGAL_TITLES[detail]} onClose={() => setDetail(null)}><LegalDocument index={detail} onNavigate={setDetail} /></DetailSheet> : null}
  </main>;
}
