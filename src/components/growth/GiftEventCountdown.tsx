"use client";
import { useEffect, useState } from "react";
import { eventRangeLabel, eventStartLabel, type PopupEvent } from "../../lib/ops/comp/popupSelect";
import { kstMonthDayLabel } from "../../lib/ops/config";
import { useAccountSession } from "../account/AccountSession";
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

/** F 메인 띠 문구: 로그인하지 않은 방문자에게만, 가입 캠페인이 켜져 있을 때(1+1 기간이면 뒤에 「· 결제 시 이용권 증정」 — 2026-11-10 정정, 「1+1」 표현 금지). */
export const SIGNUP_STRIP_TEXT = "지금 가입하면 내 책 한 권 무료";
export const SIGNUP_STRIP_EVENT = "결제 시 이용권 증정";
export function signupStripVisible(view: PopupEvent | null, serverNow: number, guest: boolean): boolean {
  const end = Date.parse(view?.signup?.endsAt ?? "");
  return guest && view?.signup?.active === true && Number.isFinite(end) && Number.isFinite(serverNow) && serverNow < end;
}
function SignupStrip({ view, serverNow }: { view: PopupEvent | null; serverNow: number }) {
  const { session, loaded, error } = useAccountSession(false);
  if (!signupStripVisible(view, serverNow, loaded && !error && session.status === "guest")) return null;
  const during = giftEventPhaseAt(view, serverNow) === "during";
  return <a className={s.signupStrip} href="/free" data-signup-strip>{SIGNUP_STRIP_TEXT}{during ? <span> · {SIGNUP_STRIP_EVENT}</span> : null}<b aria-hidden="true">→</b></a>;
}

/** 메인 화면 1+1 배너 + 타이머(최종 A 13). 지난 오픈 이벤트 블록(LaunchCountdown)과 같은 구조·같은 CSS. 끝나면 자동으로 사라진다.
 * signupStrip(F): 위에 가입 캠페인 띠 한 줄(로그인하지 않은 방문자에게만, 회원에게는 안 보임). */
export function GiftEventCountdown({ signupStrip = false }: { signupStrip?: boolean } = {}) {
  const { view, serverNow } = useGiftEvent();
  const phase = giftEventPhaseAt(view, serverNow);
  const strip = signupStrip ? <SignupStrip view={view} serverNow={serverNow} /> : null;
  if (!view || !phase) return strip;
  const target = Date.parse(phase === "before" ? view.startsAt : view.endsAt), remaining = target - serverNow;
  const range = eventRangeLabel(view), start = eventStartLabel(view.startsAt), ticketUntil = kstMonthDayLabel(view.ticketExpiresAt);
  const clockLabel = phase === "before" ? "시작까지" : "종료까지";
  return <>{strip}<section className={`${s.event} ${s.gift}`} aria-label="이용권 증정 이벤트" data-gift-event={phase}>
    <div className={s.heading}>
      <p>이용권 증정 EVENT<span>{range}</span></p>
      <h2>한 권을 펼치면, 이용권 한 장</h2>
      {/* 2026-11-06: 이용권은 결제에 따른 무상 증정(약관). 「1+1」·「한 권이 더」처럼 묶음 판매로 읽히는 표현은 쓰지 않는다. */}
      <p className={s.benefit}>리포트를 결제하면 1건마다 이용권 1장을 증정해요.</p>
      {phase === "before" ? <small>{start}</small> : ticketUntil ? <small>{`이용권은 ${ticketUntil}까지 쓸 수 있어요`}</small> : null}
    </div>
    <div className={s.clock}>
      <p>{clockLabel}</p>
      <time aria-hidden="true" dateTime={new Date(target).toISOString()}>{parts(remaining).map(([v, u]) => <span key={u}><b>{v}</b>{u}</span>)}</time>
      <span className={s.srOnly}>{phase === "before" ? start : endLabel(view.endsAt)}</span>
    </div>
  </section></>;
}
