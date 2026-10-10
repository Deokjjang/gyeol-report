"use client";
import { useEffect, useState } from "react";
import { isLaunchEventView, launchCountdown, launchRemaining, LAUNCH_NOTICE, type LaunchEventView } from "../../lib/growth/launchEvent";
import s from "./launchCountdown.module.css";

export function useLaunchEvent(local: boolean, enabled = true) {
  const [view, setView] = useState<LaunchEventView | null>(null), [remaining, setRemaining] = useState<number | null>(null);
  useEffect(() => {
    if (!enabled) return;
    let live = true, pending = false, anchor = 0, snapshot: LaunchEventView | null = null;
    const abort = new AbortController();
    const refresh = async () => {
      if (pending || document.hidden) return;
      pending = true;
      const requested = performance.now();
      try {
        const response = await fetch(local ? "/dev/launch-event" : "/api/launch-event", { cache: "no-store", signal: abort.signal });
        const data: unknown = response.ok ? await response.json() : null;
        if (live) {
          snapshot = isLaunchEventView(data) ? data : null; anchor = requested;
          setView(snapshot); setRemaining(snapshot ? launchRemaining(snapshot, performance.now() - anchor) : null);
        }
      } catch { if (live) { snapshot = null; setView(null); setRemaining(null); } }
      finally { pending = false; }
    };
    const visible = () => { if (!document.hidden) void refresh(); };
    void refresh();
    const tick = setInterval(() => { if (snapshot) setRemaining(launchRemaining(snapshot, performance.now() - anchor)); }, 1000);
    const poll = setInterval(() => void refresh(), 20_000);
    window.addEventListener("focus", visible); document.addEventListener("visibilitychange", visible);
    return () => { live = false; abort.abort(); clearInterval(tick); clearInterval(poll); window.removeEventListener("focus", visible); document.removeEventListener("visibilitychange", visible); };
  }, [local, enabled]);
  return { view, remaining };
}
export function LaunchCountdown({ local = false }: { local?: boolean }) {
  const { view, remaining } = useLaunchEvent(local);
  // A countdown can remove a benefit, but cannot promote SCHEDULED to ACTIVE.
  const state = view?.state === "ACTIVE" && remaining === 0 ? "ENDED" : view?.state;
  const label = state === "SCHEDULED" ? "이벤트 시작까지" : state === "ACTIVE" ? "이벤트 종료까지" : state === "ENDED" ? "이벤트가 종료되었습니다" : state === "PAUSED" ? "이벤트 혜택이 잠시 중단되었습니다" : "이벤트 혜택 상태를 확인하고 있습니다";
  const eligible = state === "ACTIVE" && remaining !== null && remaining > 0 && view?.campaignAvailable && view.budgetApproved && view.campaignSlug;
  return <section className={s.event} aria-label="3일 한정 이벤트" data-launch-state={state ?? "UNAVAILABLE"}>
    <div className={s.heading}><p>GYEOL REPORT <span>LIMITED EVENT</span></p><h2>단 3일, 나의 결을 발견하는 시간</h2><small>10.29 — 10.31</small></div>
    <div className={s.clock}><p role="status">{label}</p>{remaining !== null && (state === "SCHEDULED" || state === "ACTIVE") ? <>
      <time aria-hidden="true" dateTime={state === "SCHEDULED" ? view?.startsAt : view?.endsAt}>{launchCountdown(remaining)}</time>
      <span className={s.srOnly}>{state === "SCHEDULED" ? "10월 29일 00:00" : "11월 1일 00:00"} KST 기준</span>
    </> : <small>책 선택과 유료 구매는 계속 이용할 수 있습니다.</small>}</div>
    <details className={s.notice}><summary>기간·혜택 안내</summary><p>{LAUNCH_NOTICE}</p><p>자격과 남은 이벤트 예산을 서버에서 확인한 뒤 지급합니다. 카카오톡 채널 친구 추가는 필수 조건이 아닙니다.</p></details>
    {eligible ? <a className={s.entry} href={`${local ? "/dev" : ""}/campaign/${view.campaignSlug}`}>이벤트 참여 안내 →</a> : null}
  </section>;
}
