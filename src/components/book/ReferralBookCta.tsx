"use client";
import { useRef, useState } from "react";
import type { BookShareModel } from "../../lib/book/shareModel";
import s from "./bookShare.module.css";
import { interaction } from "../../lib/analytics/client";
import { LAUNCH_NOTICE } from "../../lib/growth/launchEvent";
import { useLaunchEvent } from "../growth/LaunchCountdown";
export function ReferralBookCta({ share, local, home }: { share: BookShareModel; local: boolean; home: string }) {
  const [busy, setBusy] = useState(false), [error, setError] = useState("");
  const lock = useRef(false);
  const { view, remaining } = useLaunchEvent(local, !!share.referral?.launchEvent);
  const mayJoin = share.referral?.mayJoin && (!share.referral.launchEvent || (view?.state === "ACTIVE" && view.referralAvailable && view.budgetApproved && remaining !== null && remaining > 0));
  const ended = view?.state === "ENDED" || (view?.state === "ACTIVE" && remaining === 0);
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
    {mayJoin ? <p className={s.notice}>처음 가입하고 필수 동의를 마치면 리포트 이용권 1장을 받을 수 있습니다.</p> : null}
    {share.referral?.launchEvent && !mayJoin ? <p className={s.notice}>{ended ? "신규 초대 혜택은 종료되었습니다. 공유된 책은 계속 읽을 수 있습니다." : "지금은 신규 초대 혜택 참여가 불가합니다. 책 선택과 구매는 계속 이용할 수 있습니다."}</p> : null}
    {share.referral?.launchEvent ? <p className={s.notice}>{LAUNCH_NOTICE}</p> : null}
    {error ? <p role="alert">{error}</p> : null}</div>;
}
