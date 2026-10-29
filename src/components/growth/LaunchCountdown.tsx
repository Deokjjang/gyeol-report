"use client";
import { useEffect, useState } from "react";
import { isLaunchEventView, launchActive, launchCountdown, launchRemaining, type LaunchEventView } from "../../lib/growth/launchEvent";
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
  // The block exists only while the server says ACTIVE and time remains: no loading, scheduled, paused or ended block.
  if (!launchActive(view, remaining)) return null;
  const eligible = view.campaignAvailable && view.budgetApproved && view.campaignSlug;
  // P5: 제목 한 줄 · 혜택 한 줄 · 카운트다운 · 링크 하나(기간·조건 전문은 이벤트 페이지에).
  return <section className={s.event} aria-label="이벤트 카운트다운" data-launch-state="ACTIVE">
    <div className={s.heading}><h2>이벤트 진행 중</h2>{eligible ? <p className={s.benefit}>이벤트 참여 후 처음 가입하면 리포트 1권 무료</p> : <p className={s.benefit}>11월 1일 0시 종료</p>}</div>
    <div className={s.clock}><p role="status">이벤트 종료까지</p>
      <time aria-hidden="true" dateTime={view.endsAt}>{launchCountdown(remaining!)}</time>
      <span className={s.srOnly}>11월 1일 0시 종료</span>
    </div>
    {eligible ? <a className={s.entry} href={`${local ? "/dev" : ""}/campaign/${view.campaignSlug}`}>기간·혜택 자세히 보기</a> : null}
  </section>;
}
