"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAccountSession, announceAccountChange } from "./AccountSession";
import type { ClaimState } from "../../lib/library/model";
import s from "./library.module.css";

// Mounted ONLY on a direct purchased report, never /r or a share projection.
export function SaveToLibrary({ reportId, local = false }: { reportId: string; local?: boolean }) {
  const { session, base, loaded } = useAccountSession(local);
  const [state, setState] = useState<ClaimState>("unavailable"), [saved, setSaved] = useState(false), [error, setError] = useState(false), [busy, setBusy] = useState(false);
  const lock = useRef(false);
  useEffect(() => {
    if (!loaded) return;
    const abort = new AbortController();
    void fetch(`${base}/library-status?reportId=${encodeURIComponent(reportId)}`, { cache: "no-store", signal: abort.signal }).then(async r => {
      const data = await r.json(); if (!abort.signal.aborted) setState(r.ok ? data.state : "unavailable");
    }).catch(() => { if (!abort.signal.aborted) setState("unavailable"); });
    return () => abort.abort();
  }, [base, reportId, session.status, loaded]);
  async function save() {
    if (lock.current) return;
    lock.current = true; setBusy(true); setError(false);
    try {
      const r = await fetch(`${base}/library-claim`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ reportId }) });
      if (r.ok) { setSaved(true); setState("owned"); announceAccountChange(); } else setError(true);
    } catch { setError(true); }
    finally { lock.current = false; setBusy(false); }
  }
  if (saved && state === "owned" && session.status === "member") return <div className={s.save} role="status">내 서재에 보관했습니다. <Link href={local ? "/dev/account" : "/account"}>내 서재 →</Link></div>;
  if (state !== "claimable") return null;
  const next = `${local ? "/dev/book-flow/report" : "/reports"}/${reportId}`;
  return <div className={s.save}>{session.status === "member" ? <button disabled={busy} onClick={save}>내 서재에 보관하기</button>
    : <Link href={`${local ? "/dev/account" : "/login"}?next=${encodeURIComponent(next)}`}>내 서재에 보관하기 →</Link>}
    <small>구매한 브라우저에서 7일 안에 저장할 수 있습니다. 열람기간은 그대로입니다.</small>{error ? <p role="alert">저장하지 못했습니다. 로그인 상태와 열람기간을 확인해 주세요.</p> : null}</div>;
}
