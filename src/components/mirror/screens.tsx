"use client";
/** 「남이 본 나」 화면들: 로그인 · 프로필 설정 · 자가 질문지 시작 · 질문 · 홈 · 빈 화면 층. 문구는 SPEC 「문구 정리표」 그대로(해요체). */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { externalBrowserUrl, IN_APP_MENU_HINT, inAppBrowser, type InAppKind } from "../../lib/account/inAppBrowser";
import type { MirrorItem } from "../../data/mirror/items";
import type { Choice } from "../../lib/mirror/engine";
import { optionOrder } from "../../lib/mirror/order";
import { birthProblem, handleProblem, HANDLE_MESSAGES, nameProblem, normalizeHandle, normalizeName } from "../../lib/mirror/profileRules";
import type { HomeView } from "../../lib/mirror/home";
import { copyText, displayLink, mirrorApi, type ProfileView, type SessionView } from "./client";
import { BusinessLine } from "./BusinessLine";
import s from "./mirror.module.css";
import sf from "./social.module.css";

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");
export function Wordmark({ size, sweep = false }: { size: "sm" | "lg"; sweep?: boolean }) {
  return <div className={cx(s.wordmark, s[size])} aria-label="결리포트 GYEOL REPORT"><b className={sweep ? s.sweep : undefined}>결리포트</b><span className={sweep ? s.sweep : undefined}>GYEOL REPORT</span></div>;
}

/* ---------- 로그인 ---------- */
/** next: 로그인 뒤 돌아올 곳(이 서비스 시작 주소 또는 /me). */
export function LoginScreen({ next = "/", extra }: { next?: "/" | "/start" | "/me"; extra?: ReactNode }) {
  // 이 화면은 브라우저에서만 그려진다(MirrorEntry ssr:false) — 첫 그림에서 바로 판별한다.
  const [inApp] = useState<{ kind: InAppKind; ua: string } | null>(() => { const ua = navigator.userAgent, kind = inAppBrowser(ua); return kind ? { kind, ua } : null; });
  const [busy, setBusy] = useState(false), [message, setMessage] = useState("");
  const [handoff, setHandoff] = useState<string | null>(null), [help, setHelp] = useState(false);
  useEffect(() => {
    // 바로 넘길 수 없는 앱(아이폰 인스타 등): 메뉴의 「외부 브라우저로 열기」가 이 주소를 그대로 열므로, 일회용 토큰을 주소에 실어 둔다.
    if (inApp && !externalBrowserUrl(inApp.kind, inApp.ua, location.href)) void mint().then(p => { if (p) { const u = new URL(location.href); u.searchParams.set("h", p.token); history.replaceState(null, "", u); } });
  }, [inApp]);
  async function mint(): Promise<{ url: string; token: string } | null> {
    const r = await mirrorApi<{ path: string }>("handoff", { method: "POST", body: { next: location.pathname } });
    if (!r.ok) return null;
    const url = new URL(r.data.path, location.origin).toString(); setHandoff(url);
    return { url, token: new URL(url).searchParams.get("t") ?? "" };
  }
  async function start(provider: "kakao" | "google") {
    if (busy) return; setBusy(true); setMessage("");
    try {
      const r = await fetch("/auth/start", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ provider, next }) });
      const data = await r.json().catch(() => ({}));
      if (r.ok && typeof data.url === "string") { location.assign(data.url); return; }
      setMessage(data.error ?? "로그인을 시작하지 못했어요. 다시 시도해 주세요.");
    } catch { setMessage("로그인을 시작하지 못했어요. 다시 시도해 주세요."); }
    setBusy(false);
  }
  async function openBrowser() {
    if (!inApp) return;
    const m = handoff ? { url: handoff } : await mint();
    const target = m ? m.url : location.href, ext = externalBrowserUrl(inApp.kind, inApp.ua, target);
    if (ext) { location.href = ext; return; }
    setHelp(true);
  }
  return <section className={s.scene} data-mirror-screen="login"><div className={cx(s.wrap, s.center)}>
    <div className={s.logoIn}><Wordmark size="lg" sweep /></div>
    <p className={s.tagline}>나의 모든 결</p>
    <div className={s.auth}>
      <button className={cx(s.kakao, s.press)} type="button" disabled={busy} onClick={() => start("kakao")}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3C6.5 3 2 6.5 2 10.8c0 2.7 1.8 5 4.5 6.5L5.4 21l4.4-2.5c.7.1 1.4.2 2.2.2 5.5 0 10-3.5 10-7.9S17.5 3 12 3Z" /></svg>카카오로 시작하기</button>
      {inApp ? <div className={s.inApp} data-in-app={inApp.kind}>
        <p>Google은 기본 브라우저에서 열려요</p>
        <button className={cx(s.inAppBtn, s.press)} type="button" onClick={openBrowser}>브라우저로 열기</button>
        {help ? <><p>{IN_APP_MENU_HINT[inApp.kind]}</p><button className={cx(s.inAppBtn, s.press)} type="button" onClick={async () => setMessage(await copyText(handoff ?? location.href) ? "복사했어요" : "주소를 복사하지 못했어요")}>링크 복사</button></> : null}
      </div> : <button className={cx(s.google, s.press)} type="button" disabled={busy} onClick={() => start("google")}><span className={s.gmark} aria-hidden="true">G</span>Google로 시작하기</button>}
      {message ? <p className={s.error} role="status">{message}</p> : null}
      {extra}
      {process.env.NODE_ENV === "development" ? <p className={s.fine}><a href={`/dev/v5-login?next=${encodeURIComponent(next)}`} data-dev-login>로컬 검수 계정으로 들어가기</a></p> : null}
    </div>
  </div><div className={sf.bizLogin}><BusinessLine /></div></section>;
}

/* ---------- 프로필 설정 ---------- */
export function ProfileScreen({ session, onSaved }: { session: Extract<SessionView, { account: "needs_consent" | "member" }>; onSaved: (next: SessionView) => void }) {
  const [name, setName] = useState(session.prefillName ?? ""), [handle, setHandle] = useState(""), [age14, setAge14] = useState(false);
  const [terms, setTerms] = useState(false), [privacy, setPrivacy] = useState(false), [birthDate, setBirthDate] = useState(""), [birthTime, setBirthTime] = useState("");
  const [check, setCheck] = useState<{ handle: string; available: boolean; message?: string } | null>(null), [busy, setBusy] = useState(false), [error, setError] = useState("");
  const requestId = useRef("");
  const needsConsent = session.account === "needs_consent";
  const h = normalizeHandle(handle), localProblem = h ? handleProblem(h) : null;
  useEffect(() => {
    if (!h || localProblem) return;
    const timer = window.setTimeout(async () => {
      const r = await mirrorApi<{ handle: string; available: boolean; message?: string }>("handle", { query: `?value=${encodeURIComponent(h)}` });
      if (r.ok) setCheck(r.data);
    }, 300);
    return () => clearTimeout(timer);
  }, [h, localProblem]);
  const nameErr = name ? nameProblem(normalizeName(name)) : null, birthErr = birthProblem(birthDate || null, birthTime || null);
  const handleOk = !!h && !localProblem && check?.handle === h && check.available;
  const ready = !nameErr && !!name && handleOk && age14 && (!needsConsent || (terms && privacy)) && !birthErr && !busy;
  async function submit() {
    if (!ready) return; setBusy(true); setError("");
    if (!requestId.current) requestId.current = crypto.randomUUID();
    const r = await mirrorApi<SessionView & { ok: true }>("profile", { method: "POST", body: { name: normalizeName(name), handle: h, age14, birthDate: birthDate || null, birthTime: birthTime || null,
      ...(needsConsent ? { consent: { requestId: requestId.current, terms: true, privacy: true, versions: session.policy } } : {}) } });
    setBusy(false);
    if (r.ok) { onSaved(r.data); return; }
    setError(r.data.error ?? "저장하지 못했어요. 다시 시도해 주세요.");
    if (r.data.code === "HANDLE_TAKEN") setCheck({ handle: h, available: false, message: HANDLE_MESSAGES.taken });
  }
  const handleNote = !h ? null : localProblem ? <small className={s.bad}>{HANDLE_MESSAGES[localProblem]}</small>
    : check?.handle === h ? <small className={check.available ? s.ok : s.bad}>{check.available ? "쓸 수 있어요" : check.message}</small> : <small>확인 중…</small>;
  return <section className={cx(s.scene, s.scroll)} data-mirror-screen="profile"><div className={s.wrap}>
    <h1 className={s.title}>어떻게 불러 드릴까요?</h1>
    <form className={s.form} onSubmit={e => { e.preventDefault(); void submit(); }}>
      <label className={s.field}><span>이름</span>
        <input className={s.input} value={name} onChange={e => setName(e.target.value)} maxLength={10} autoComplete="nickname" name="name" />
        {nameErr ? <small className={s.bad}>{nameErr}</small> : <small>친구들에게 보이는 이름</small>}</label>
      <label className={s.field}><span>아이디</span>
        <div className={s.handleBox}><b>@</b><input className={s.input} value={handle} onChange={e => setHandle(e.target.value.replace(/\s/g, ""))} maxLength={21} autoCapitalize="none" autoCorrect="off" spellCheck={false} inputMode="email" name="handle" /></div>
        <small>내 링크가 돼요 · {displayLink(h || "아이디")}</small>{handleNote}</label>
      <label className={s.check}><input type="checkbox" checked={age14} onChange={e => setAge14(e.target.checked)} name="age14" />[필수] 만 14세 이상이에요</label>
      {needsConsent ? <>
        <label className={s.check}><input type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)} name="terms" />[필수] 이용약관 동의<a href="/terms" target="_blank" rel="noreferrer">보기</a></label>
        <label className={s.check}><input type="checkbox" checked={privacy} onChange={e => setPrivacy(e.target.checked)} name="privacy" />[필수] 개인정보처리방침 동의<a href="/privacy" target="_blank" rel="noreferrer">보기</a></label>
      </> : null}
      <div className={s.optional}>
        <p>선택 · 사주 리포트를 볼 때 자동으로 채워져요</p>
        <div className={s.two}>
          <label className={s.field}><span>생년월일</span><input className={s.input} type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} min="1900-01-01" max={new Date().toISOString().slice(0, 10)} name="birthDate" /></label>
          <label className={s.field}><span>출생시간</span><input className={s.input} type="time" value={birthTime} onChange={e => setBirthTime(e.target.value)} name="birthTime" /></label>
        </div>
        {birthErr ? <small className={s.bad}>{birthErr}</small> : null}
      </div>
      {error ? <p className={s.error} role="alert">{error}</p> : null}
      <button className={cx(s.cta, s.press)} type="submit" disabled={!ready}>다음</button>
    </form>
  </div></section>;
}

/* ---------- 자가 질문지 ---------- */
export function IntroScreen({ answered, onStart }: { answered: number; onStart: () => void }) {
  return <section className={s.scene} data-mirror-screen="intro"><div className={cx(s.wrap, s.intro)}>
    <div className={s.qspace} />
    <h1 className={s.qtitle}>나에 대한 질문 60개 · 약 7분</h1>
    <p className={s.introSub}>둘 다 좋은 답이에요. 더 가까운 쪽을 고르세요.</p>
    <button className={cx(s.cta, s.press)} type="button" onClick={onStart}>{answered > 0 ? "이어서 하기" : "시작하기"}</button>
  </div></section>;
}

export const MILESTONES: Readonly<Record<number, string>> = { 12: "좋아요, 계속", 24: "절반 가까이 왔어요", 36: "절반 넘었어요", 48: "거의 다 왔어요" };
export function QuizScreen({ item, seed, done, picked, milestone, onPick, onBack, canBack, busy }: {
  item: MirrorItem; seed: string; done: number; picked: Choice | undefined; milestone: string | null; busy: boolean;
  onPick: (choice: Choice, el: HTMLElement) => void; onBack: () => void; canBack: boolean;
}) {
  const order = optionOrder(seed, item.id);
  return <section className={s.scene} data-mirror-screen="quiz"><div className={cx(s.wrap, s.quizWrap)}>
    <div className={s.qhead}><span data-quiz-count>답 {done} / 60</span><div className={s.qbar} aria-hidden="true"><i style={{ transform: `scaleX(${done / 60})` }} /></div></div>
    <div className={s.qspace} />
    <p className={cx(s.mile, milestone && s.mileOn)} aria-live="polite">{milestone ?? ""}</p>
    <div className={s.qin} key={item.id} data-item={item.id}>
      <h2 className={s.qtitle}>{item.self.situation}</h2>
      <div className={s.opts}>
        {order.map((choice, k) => <button key={choice} className={cx(s.opt, s.press, picked === choice && s.picked)} type="button" disabled={busy} data-choice={choice} onClick={e => onPick(choice, e.currentTarget)}>
          <b>{k === 0 ? "A" : "B"}</b><span>{choice === 0 ? item.self.a : item.self.b}</span></button>)}
      </div>
    </div>
    <div className={s.qfoot}><button className={s.link} type="button" onClick={onBack} disabled={!canBack || busy}>이전</button></div>
  </div></section>;
}

/* ---------- 홈 ---------- */
export type PageKey = "stories" | "space" | "me" | "board";
export function HomeScreen({ profile, home, storiesNew = 0, covered = false, onOpen, onAsk }: { profile: ProfileView; home: HomeView; storiesNew?: number; covered?: boolean; onOpen: (p: PageKey) => void; onAsk: () => void }) {
  // 페이지(기록판 · 이야기 · 내 계정)가 위에 열리면 홈 글자는 숨기고 포커스도 막는다 — 별(Sky)만 뒤에 비친다.
  return <section className={s.scene} data-mirror-screen="home" data-friends={home.friends} inert={covered} style={covered ? { visibility: "hidden" } : undefined}><div className={s.wrap}>
    <div className={s.hbar}>
      <Wordmark size="sm" />
      <div className={s.hbarR}>
        <button className={s.icon} type="button" aria-label={storiesNew ? `받은 이야기 · 새 이야기 ${storiesNew}개` : "받은 이야기"} onClick={() => onOpen("stories")} data-stories-new={storiesNew}><svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16v12H4z" fill="none" stroke="#F4F4F7" strokeWidth="1.4" strokeLinejoin="round" /><path d="M4 7l8 6 8-6" fill="none" stroke="#F4F4F7" strokeWidth="1.4" /></svg>{storiesNew ? <span className={s.badge}>{storiesNew > 99 ? "99+" : storiesNew}</span> : null}</button>
        <button className={s.icon} type="button" aria-label="모두의 이야기" onClick={() => onOpen("space")}><svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill="none" stroke="#F4F4F7" strokeWidth="1.4" strokeLinejoin="round" /></svg></button>
        <button className={s.icon} type="button" aria-label="내 계정" onClick={() => onOpen("me")}>{[...profile.name][0] ?? "나"}</button>
      </div>
    </div>
    <button className={s.sync} type="button" aria-label="기록판 열기" onClick={() => onOpen("board")} data-sync={home.sync ?? "none"}>
      <span className={s.lab}>싱크로율</span>
      <b>{home.sync === null ? "?" : home.sync}<small>%</small></b>
      <span className={s.lab}>{home.sync === null ? "친구가 답하면 나와요" : "기록판 보기 ›"}</span>
    </button>
    <div className={s.hspace} />
    <button className={cx(s.cta, s.press)} type="button" onClick={onAsk}>친구에게 물어보기</button>
  </div></section>;
}

const PAGE_TITLES: Readonly<Record<PageKey, string>> = { stories: "받은 이야기", space: "모두의 이야기", me: "내 계정", board: "기록판" };
/** 아이콘 3개 · 싱크로율 뒤의 화면 틀(내용은 pages.tsx). */
export function EmptyPage({ page, onBack, children }: { page: PageKey; onBack: () => void; children?: ReactNode }) {
  return <section className={s.page} aria-label={PAGE_TITLES[page]} data-mirror-page={page}><div className={s.pg}>
    <div className={s.pghead}><button className={cx(s.back, s.press)} type="button" onClick={onBack}><svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M9 2L4 7l5 5" fill="none" stroke="#F4F4F7" strokeWidth="1.4" /></svg>내 별</button><h2>{PAGE_TITLES[page]}</h2></div>
    {children}
  </div></section>;
}
