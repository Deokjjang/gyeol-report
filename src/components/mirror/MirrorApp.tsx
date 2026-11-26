"use client";
/**
 * 「남이 본 나」 한 화면 앱(D2): 로그인 → 프로필 → 자가 질문지 60개(답마다 서버 저장 · 이전 · 이어서 하기 · 12개마다 이정표) → 붕괴 → 빅뱅 → 홈.
 * 연출은 docs/mirror/prototype-v4.html 그대로, 별자리 모양은 D0(selfConstellation)에서 나온다.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { inAppBrowser } from "../../lib/account/inAppBrowser";
import { selfConstellation } from "../../lib/mirror/constellation";
import { selfAnsweredCount, selfComplete, type Choice } from "../../lib/mirror/engine";
import { selfQuizOrder } from "../../lib/mirror/order";
import { copyText, mirrorApi, myLink, type SessionView } from "./client";
import { EmptyPage, HomeScreen, IntroScreen, LoginScreen, MILESTONES, ProfileScreen, QuizScreen, type PageKey } from "./screens";
import { Sky, type SkyHandle } from "./sky/Sky";
import s from "./mirror.module.css";

type Phase = "boot" | "login" | "profile" | "intro" | "quiz" | "collapse" | "home";
type Member = Extract<SessionView, { account: "needs_consent" | "member" }>;
const SEEN_KEY = "gyeol-mirror-seen-v1";

function phaseFor(view: SessionView): Phase {
  if (view.account === "guest") return "login";
  if (!view.profile || view.account === "needs_consent") return "profile";
  return view.self.completedAt ? "home" : "intro";
}

export default function MirrorApp() {
  const [session, setSession] = useState<SessionView | null>(null), [phase, setPhase] = useState<Phase>("boot");
  const [answers, setAnswers] = useState<Record<string, Choice>>({}), [qi, setQi] = useState(0), [busy, setBusy] = useState(false);
  const [milestone, setMilestone] = useState<string | null>(null), [page, setPage] = useState<PageKey | null>(null);
  const [toast, setToast] = useState<string | null>(null), [newFrom, setNewFrom] = useState(0);
  const sky = useRef<SkyHandle>(null), toastTimer = useRef(0), mileTimer = useRef(0);
  const reduce = typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

  const say = useCallback((m: string) => { setToast(m); clearTimeout(toastTimer.current); toastTimer.current = window.setTimeout(() => setToast(null), 2600); }, []);
  const apply = useCallback((view: SessionView) => {
    setSession(view);
    if (view.account !== "guest") setAnswers(view.self.answers);
  }, []);
  /** 홈으로: 지난번에 본 친구 별 수 다음부터 날아와 달린다(이 기기에 센 수만 남긴다). */
  const enter = useCallback((next: Phase, view: SessionView | null) => {
    if (next === "home" && view && view.account !== "guest" && view.profile) {
      const key = `${SEEN_KEY}:${view.profile.handle}`, total = view.home?.stars.length ?? 0;
      let seen = 0;
      try { seen = Number(localStorage.getItem(key) ?? "0") || 0; localStorage.setItem(key, String(total)); } catch { /* 저장소 없음 */ }
      setNewFrom(Math.min(seen, total));
    }
    setPhase(next);
  }, []);
  const latestSession = useRef<SessionView | null>(null), phaseRef = useRef<Phase>("boot");
  useEffect(() => { latestSession.current = session; phaseRef.current = phase; }, [session, phase]);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden"; document.body.style.overflow = "hidden";
    // 인앱 → 기본 브라우저로 넘어온 경우: 주소의 일회용 토큰으로 이전 기기 상태를 잇는다(인앱 안에서는 쓰지 않는다).
    const h = new URLSearchParams(location.search).get("h");
    if (h && /^[A-Za-z0-9_-]{43}$/.test(h) && !inAppBrowser(navigator.userAgent)) { location.replace(`/api/mirror/handoff?t=${h}`); return; }
    void mirrorApi<SessionView>("session").then(r => {
      if (!r.ok) { setPhase("login"); say(r.data.error ?? "잠시 후 다시 시도해 주세요."); return; }
      apply(r.data); enter(phaseFor(r.data), r.data);
    });
    return () => { document.documentElement.style.overflow = ""; document.body.style.overflow = ""; };
  }, [apply, enter, say]);

  const member = session && session.account !== "guest" ? session as Member : null;
  const seed = member?.self.seed ?? "guest";
  const order = useMemo(() => selfQuizOrder(seed), [seed]);
  const done = selfAnsweredCount(answers);
  const complete = selfComplete(answers) && !!member?.self.completedAt;
  const shape = useMemo(() => (complete ? selfConstellation(answers) : null), [complete, answers]);
  const stars = useMemo(() => member?.home?.stars ?? [], [member?.home]);
  const firstOpen = useCallback((a: Record<string, Choice>) => { const i = order.findIndex(it => a[it.id] === undefined); return i < 0 ? order.length : i; }, [order]);


  function beam(from: HTMLElement, onHit: () => void) {
    const r = from.getBoundingClientRect(), x0 = r.left + r.width * .5, y0 = r.top + r.height * .5, [x1, y1] = sky.current?.orbScreen() ?? [innerWidth / 2, innerHeight * .4];
    const [cr, cg, cb] = (sky.current?.heatColor() ?? [1, .8, .6]).map(v => Math.round(v * 255));
    const mx = (x0 + x1) / 2 + (Math.random() - .5) * 140, my = (y0 + y1) / 2 + (Math.random() - .5) * 60, dur = reduce ? 200 : 760 + Math.random() * 120;
    for (let k = 0; k < 7; k++) {
      const el = document.createElement("span"); el.className = s.beam; const sz = 1 - k * .12;
      el.style.background = `radial-gradient(circle, rgba(255,255,255,${(.95 * sz).toFixed(2)}) 0%, rgba(${cr},${cg},${cb},${(.7 * sz).toFixed(2)}) 35%, rgba(${cr},${cg},${cb},0) 70%)`;
      el.style.width = el.style.height = `${(14 * sz).toFixed(1)}px`; document.body.appendChild(el);
      const a = el.animate([{ transform: `translate(${x0}px,${y0}px)`, opacity: 0 }, { transform: `translate(${mx}px,${my}px)`, opacity: .95 * sz, offset: .45 }, { transform: `translate(${x1}px,${y1}px)`, opacity: .9 * sz }], { duration: dur, delay: k * 26, easing: "cubic-bezier(.55,0,.75,.35)", fill: "forwards" });
      a.onfinish = () => { el.remove(); if (k === 0) onHit(); };
    }
  }

  async function pick(choice: Choice, el: HTMLElement) {
    if (busy || !member) return;
    const item = order[qi], before = done, prev = answers[item.id];
    const next = { ...answers, [item.id]: choice }, after = selfAnsweredCount(next);
    setBusy(true); setAnswers(next);
    try { navigator.vibrate?.(10); } catch { /* 진동 없는 기기 */ }
    beam(el, () => {
      sky.current?.pulse();
      const m = Math.floor(after / 12) * 12;
      if (after > before && after % 12 === 0 && MILESTONES[m]) {
        sky.current?.ring(); setMilestone(MILESTONES[m]); clearTimeout(mileTimer.current); mileTimer.current = window.setTimeout(() => setMilestone(null), 2200);
      }
    });
    const [saved] = await Promise.all([mirrorApi("answer", { method: "POST", body: { itemId: item.id, version: item.version, choice } }), new Promise(r => setTimeout(r, reduce ? 80 : 420))]);
    if (!saved.ok) {
      setAnswers(a => { const b = { ...a }; if (prev === undefined) delete b[item.id]; else b[item.id] = prev; return b; });
      say(saved.data.error ?? "저장하지 못했어요. 다시 눌러 주세요."); setBusy(false); return;
    }
    const open = firstOpen(next);
    if (open >= order.length) { await finish(); return; }
    setQi(open); setBusy(false);
  }
  async function finish() {
    const r = await mirrorApi<SessionView>("complete", { method: "POST", body: {} });
    if (!r.ok) { say(r.data.error ?? "저장하지 못했어요. 다시 시도해 주세요."); setBusy(false); return; }
    apply(r.data); setBusy(false);
    window.setTimeout(() => { setPhase("collapse"); try { navigator.vibrate?.([20, 60, 30]); } catch { /* */ } }, reduce ? 100 : 650);
  }
  const onHome = useCallback(() => {
    if (phaseRef.current !== "collapse") return;
    say("내 별자리가 생겼어요"); enter("home", latestSession.current);
  }, [enter, say]);

  async function ask() {
    if (!member?.profile) return;
    say(await copyText(myLink(member.profile.handle)) ? "복사했어요" : "링크를 복사하지 못했어요");
  }

  const skyPhase = phase === "quiz" ? "quiz" : phase === "collapse" ? "collapse" : phase === "home" ? "home" : "idle";
  return <div className={s.root} data-mirror-phase={phase}>
    <Sky ref={sky} phase={skyPhase} heat={phase === "quiz" || phase === "collapse" ? done / 60 : 0} shape={shape} stars={phase === "home" ? stars : []} newFrom={newFrom} onHome={onHome} />
    {phase === "login" ? <LoginScreen /> : null}
    {phase === "profile" && member ? <ProfileScreen session={member} onSaved={view => { apply(view); enter(phaseFor(view), view); }} /> : null}
    {phase === "intro" ? <IntroScreen answered={done} onStart={() => { setQi(firstOpen(answers) % order.length); setPhase("quiz"); }} /> : null}
    {phase === "quiz" && order[qi] ? <QuizScreen item={order[qi]} seed={seed} done={done} picked={answers[order[qi].id]} milestone={milestone} busy={busy}
      onPick={pick} canBack={qi > 0} onBack={() => setQi(i => Math.max(0, i - 1))} /> : null}
    {phase === "home" && member?.profile && member.home ? <HomeScreen profile={member.profile} home={member.home} onOpen={setPage} onAsk={ask} /> : null}
    {page ? <EmptyPage page={page} onBack={() => setPage(null)} /> : null}
    <div className={`${s.toast} ${toast ? s.toastOn : ""}`} role="status" aria-live="polite">{toast}</div>
  </div>;
}
