"use client";
import { useEffect, useState } from "react";
import { eventRangeLabel, eventStartLabel, timesLabel, type PopupEvent } from "../../lib/ops/comp/popupSelect";
import s from "./launchCountdown.module.css";

/**
 * 1+1 이벤트 기간 정보(최종 A 13) — 서버 시각(/api/gift-event)을 기준으로 시작·종료를 판단한다.
 * 받은 서버 시각에 그 뒤 흐른 시간(performance.now, 벽시계를 바꿔도 흔들리지 않음)을 더해 「지금」을 센다. 꺼짐이면 view.phase = off.
 */
export function useGiftEvent(enabled = true) {
  const [view, setView] = useState<PopupEvent | null>(null), [serverNow, setServerNow] = useState(Number.NaN);
  useEffect(() => {
    if (!enabled) return;
    let live = true, anchor: { server: number; perf: number } | null = null;
    const abort = new AbortController();
    const refresh = async () => {
      const requested = performance.now();
      try {
        const r = await fetch("/api/gift-event", { cache: "no-store", signal: abort.signal });
        const b = r.ok ? await r.json() as PopupEvent : null;
        if (!live) return;
        if (b && typeof b.phase === "string" && Number.isFinite(Date.parse(b.serverNow))) {
          anchor = { server: Date.parse(b.serverNow), perf: requested };
          setView(b); setServerNow(anchor.server + Math.max(0, performance.now() - requested));
        } else { anchor = null; setView(null); }
      } catch { if (live) { anchor = null; setView(null); } }
    };
    void refresh();
    const tick = setInterval(() => { if (anchor) setServerNow(anchor.server + Math.max(0, performance.now() - anchor.perf)); }, 1000);
    const poll = setInterval(() => { if (!document.hidden) void refresh(); }, 60_000);
    const visible = () => { if (!document.hidden) void refresh(); };
    document.addEventListener("visibilitychange", visible);
    return () => { live = false; abort.abort(); clearInterval(tick); clearInterval(poll); document.removeEventListener("visibilitychange", visible); };
  }, [enabled]);
  return { view, serverNow };
}

/** 서버가 켠 기간을 서버 시각으로 다시 나눈다: 시작 전 / 진행 중 / 끝(사라짐). */
export function giftEventPhaseAt(view: PopupEvent | null, serverNow: number): "before" | "during" | null {
  if (!view || view.phase === "off" || view.phase === "after") return null;
  const a = Date.parse(view.startsAt), b = Date.parse(view.endsAt);
  if (!Number.isFinite(a) || !Number.isFinite(b) || !Number.isFinite(serverNow)) return null;
  return serverNow < a ? "before" : serverNow < b ? "during" : null;
}

const pad = (n: number) => String(n).padStart(2, "0");
/** 「11월 16일 23시 59분 종료」(끝 경계 1초 앞, KST). */
function endLabel(endsAt: string) { const d = new Date(Date.parse(endsAt) - 1000 + 9 * 3_600_000); return `${d.getUTCMonth() + 1}월 ${d.getUTCDate()}일 ${pad(d.getUTCHours())}시 ${pad(d.getUTCMinutes())}분 종료`; }
function parts(ms: number) {
  const t = Math.max(0, Math.floor(ms / 1000));
  return [[String(Math.floor(t / 86400)), "일"], [pad(Math.floor(t % 86400 / 3600)), "시간"], [pad(Math.floor(t % 3600 / 60)), "분"], [pad(t % 60), "초"]] as const;
}

/** 메인 화면 1+1 배너 + 타이머(최종 A 13). 지난 오픈 이벤트 블록(LaunchCountdown)과 같은 구조·같은 CSS. 끝나면 자동으로 사라진다. */
export function GiftEventCountdown() {
  const { view, serverNow } = useGiftEvent();
  const phase = giftEventPhaseAt(view, serverNow);
  if (!view || !phase) return null;
  const target = Date.parse(phase === "before" ? view.startsAt : view.endsAt), remaining = target - serverNow;
  const range = eventRangeLabel(view), start = eventStartLabel(view.startsAt);
  const clockLabel = phase === "before" ? "시작까지" : "종료까지";
  return <section className={`${s.event} ${s.gift}`} aria-label="1+1 이벤트" data-gift-event={phase}>
    <div className={s.heading}>
      <p>1+1 EVENT<span>{range}</span></p>
      <h2>한 권을 펼치면, 한 권이 더</h2>
      <p className={s.benefit}>리포트를 한 권 결제하면 무료 이용권 한 장을 더 드려요.</p>
      <small>{phase === "before" ? start : `한 계정에 ${timesLabel(view.maxPerAccount)}까지 · 이용권은 받은 날부터 ${view.validDays}일`}</small>
    </div>
    <div className={s.clock}>
      <p>{clockLabel}</p>
      <time aria-hidden="true" dateTime={new Date(target).toISOString()}>{parts(remaining).map(([v, u]) => <span key={u}><b>{v}</b>{u}</span>)}</time>
      <span className={s.srOnly}>{phase === "before" ? start : endLabel(view.endsAt)}</span>
    </div>
  </section>;
}
