"use client";
import { useRef, useState } from "react";
import type { BookShareModel } from "../../lib/book/shareModel";
import s from "./bookShare.module.css";
import { interaction } from "../../lib/analytics/client";
import { BookEventNotice } from "./BookEventNotice";
import { useLaunchEvent } from "../growth/LaunchCountdown";
export function ReferralBookCta({ share, local, home }: { share: BookShareModel; local: boolean; home: string }) {
  const [busy, setBusy] = useState(false), [error, setError] = useState("");
  const lock = useRef(false);
  const { view, remaining } = useLaunchEvent(local, Boolean(share.referral));
  const mayJoin = share.referral?.mayJoin && view?.state === "ACTIVE" && view.referralAvailable && view.budgetApproved && remaining !== null && remaining > 0;
  async function begin() {
    if (lock.current) return;
    if (share.referral?.launchEvent && !mayJoin) { window.location.assign(home); return; }
    lock.current = true; setBusy(true); setError("");
    interaction("referral_cta_clicked", share.productType);
    try {
      const response = await fetch(local ? "/dev/book-flow/referral" : "/api/book-referral", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ shareToken: share.shareToken, ref: share.referral?.token }) });
      if (!response.ok) { setError("초대 정보를 확인하지 못했습니다. 다시 시도해 주세요."); return; }
      const result = await response.json(), allowed = local ? ["/dev/account?view=login", home] : ["/login", "/"];
      window.location.assign(allowed.includes(result.next) ? result.next : home);
    } catch { setError("잠시 후 다시 시도해 주세요."); }
    finally { lock.current = false; setBusy(false); }
  }
  return <div><button className={s.cta} style={{ background: "none", borderTop: 0, borderLeft: 0, borderRight: 0, cursor: "pointer" }} disabled={busy} onClick={() => void begin()}>나도 내 책 만들기 ↗</button>
    {mayJoin ? <p className={s.notice}>이 초대 링크로 처음 가입하고 필수 동의를 마치면 무료 이용권 1장 대상이 될 수 있어요. 가입 자격과 계정당 한도를 확인합니다.</p> : null}
    <BookEventNotice view={view} remaining={remaining} recipient />
    {error ? <p role="alert">{error}</p> : null}</div>;
}
