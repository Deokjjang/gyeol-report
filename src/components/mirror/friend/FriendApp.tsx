"use client";
/**
 * 친구 응답 흐름(D3, SPEC 「친구 응답 흐름」): 링크 랜딩 → 친밀도 → 묶음(12 · 아는 사이 10) → 체크포인트 → 이야기(선택) → 별이 날아가 달림 → 결과 → 「나도 해 보기」.
 * 로그인 없이 기기 토큰(쿠키)으로 이어서 한다. 주인 본인이면 "내 페이지예요", 비공개면 "지금은 답을 받지 않고 있어요".
 * 문구는 SPEC 「문구 정리표」 그대로(해요체). 이름 조사는 받침에 맞춘다.
 */
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { STORY_COUNT_FROM, STORY_KINDS, STORY_MAX, type StoryKind } from "../../../data/mirror/stories";
import { josa } from "../../../lib/brief/labels";
import type { ConstellationShape } from "../../../lib/mirror/constellation";
import { constellationSvg } from "../../../lib/mirror/constellationSvg";
import { seededRandom } from "../../../lib/mirror/hash";
import type { Closeness } from "../../../lib/mirror/engine";
import type { FriendItem } from "../../../lib/mirror/social";
import { charCount, normalizeStory, storyProblem } from "../../../lib/mirror/storyFilter";
import { mirrorApi, useHideSiteFooter } from "../client";
import { Wordmark } from "../screens";
import s from "../mirror.module.css";
import f from "../social.module.css";

type Summary = { closeness: Closeness; asked: number; open: number; perBundle: number; ended: boolean; golden: boolean; hasStory: boolean };
type Landing =
  | { state: "owner" | "closed"; owner: { name: string; handle: string; line: string | null } }
  | { state: "open"; owner: { name: string; handle: string; line: string | null }; viewer: { loggedIn: boolean; canShowHandle: boolean }; session: Summary | null };
type Result = { know: number | null; rank: { rank: number; total: number } | null; golden: boolean; session: Summary; storySaved: boolean };
type Step = "boot" | "owner" | "closed" | "landing" | "closeness" | "quiz" | "checkpoint" | "story" | "fly" | "result" | "error";

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");
const batchim = (w: string) => josa(w, "이가").slice(-1) === "이";
/** 「민지랑」 · 「서연이랑」 */
const rang = (w: string) => w + (batchim(w) ? "이랑" : "랑");
export const landingTitle = (name: string, line: string | null) => line ?? `${josa(name, "은는")} 어떤 사람일까?`;
const CLOSENESS: readonly { id: Closeness; label: string; hint: string }[] = [
  { id: 1, label: "아는 사이", hint: "얼굴과 이름 정도" },
  { id: 2, label: "친구", hint: "같이 놀고 연락해요" },
  { id: 3, label: "가까운 사이", hint: "가족 · 연인 · 오래된 단짝" },
];

export default function FriendApp({ handle, name, line, shape, appPath = "/" }: { handle: string; name: string; line: string | null; shape: ConstellationShape | null; appPath?: "/" | "/start" }) {
  const [step, setStep] = useState<Step>("boot"), [landing, setLanding] = useState<Landing | null>(null);
  const [session, setSession] = useState<Summary | null>(null), [bundle, setBundle] = useState<FriendItem[]>([]), [qi, setQi] = useState(0);
  const [picked, setPicked] = useState<Record<string, 0 | 1 | 2>>({}), [busy, setBusy] = useState(false), [toast, setToast] = useState("");
  const [result, setResult] = useState<Result | null>(null), [error, setError] = useState("");
  const toastTimer = useRef(0);
  const say = (m: string) => { setToast(m); clearTimeout(toastTimer.current); toastTimer.current = window.setTimeout(() => setToast(""), 2600); };
  const ownerName = landing?.owner.name ?? name;
  useHideSiteFooter();

  useEffect(() => {
    document.documentElement.style.overflow = "hidden"; document.body.style.overflow = "hidden";
    void mirrorApi<Landing>("friend", { query: `?handle=${encodeURIComponent(handle)}` }).then(r => {
      if (!r.ok) { setError(r.data.error ?? "잠시 후 다시 시도해 주세요."); setStep("error"); return; }
      setLanding(r.data);
      if (r.data.state !== "open") { setStep(r.data.state); return; }
      setSession(r.data.session); setStep("landing");
    });
    return () => { document.documentElement.style.overflow = ""; document.body.style.overflow = ""; };
  }, [handle]);

  async function begin(closeness?: Closeness) {
    if (busy) return; setBusy(true);
    const r = await mirrorApi<{ session: Summary; bundle: FriendItem[] }>("friend-start", { method: "POST", body: { handle, closeness } });
    setBusy(false);
    if (!r.ok) { say(r.data.error ?? "잠시 후 다시 시도해 주세요."); return; }
    setSession(r.data.session);
    if (!r.data.bundle.length) { setStep(r.data.session.hasStory ? "fly" : "story"); if (r.data.session.hasStory) void finish(null); return; }
    setBundle(r.data.bundle); setQi(0); setPicked({}); setStep("quiz");
  }
  async function more() {
    if (busy) return; setBusy(true);
    const r = await mirrorApi<{ session: Summary; bundle: FriendItem[] }>("friend-bundle", { method: "POST", body: { handle } });
    setBusy(false);
    if (!r.ok) { say(r.data.error ?? "잠시 후 다시 시도해 주세요."); return; }
    setSession(r.data.session);
    if (!r.data.bundle.length) { toStoryOrFinish(r.data.session); return; }
    setBundle(r.data.bundle); setQi(0); setPicked({}); setStep("quiz");
  }
  function toStoryOrFinish(sum: Summary) {
    if (sum.hasStory) { setStep("fly"); void finish(null); } else setStep("story");
  }
  async function answer(choice: 0 | 1 | 2) {
    const item = bundle[qi];
    if (!item || busy || !session) return;
    setBusy(true);
    const wasNew = picked[item.id] === undefined;
    setPicked(p => ({ ...p, [item.id]: choice }));
    try { navigator.vibrate?.(8); } catch { /* 진동 없는 기기 */ }
    const [r] = await Promise.all([mirrorApi<{ asked: number }>("friend-answer", { method: "POST", body: { handle, itemId: item.id, version: item.version, choice } }), new Promise(res => setTimeout(res, 450))]);
    setBusy(false);
    if (!r.ok) { setPicked(p => { const n = { ...p }; if (wasNew) delete n[item.id]; return n; }); say(r.data.error ?? "저장하지 못했어요. 다시 눌러 주세요."); return; }
    const next = { ...session, asked: r.data.asked };
    setSession(next);
    if (qi + 1 < bundle.length) { setQi(qi + 1); return; }
    // 묶음 끝: 열린 문항을 다 했으면 바로 다음 단계, 아니면 체크포인트.
    if (next.asked >= next.open) toStoryOrFinish(next); else setStep("checkpoint");
  }

  async function finish(story: { kind: StoryKind; body: string; showHandle: boolean } | null): Promise<string | null> {
    setBusy(true);
    const r = await mirrorApi<Result>("friend-finish", { method: "POST", body: { handle, ...(story ? { story } : {}) } });
    setBusy(false);
    if (!r.ok) {
      if (r.data.code === "STORY_FILTER" || r.data.code === "STORY_INVALID") return r.data.error ?? "이야기를 다시 확인해 주세요.";
      say(r.data.error ?? "잠시 후 다시 시도해 주세요."); setStep("story"); return null;
    }
    setResult(r.data); setSession(r.data.session); setStep("fly");
    return null;
  }

  const svg = useMemo(() => shape ? constellationSvg(shape, { size: 320, background: null, lineOpacity: .5 }) : "", [shape]);
  const dim = step !== "landing" && step !== "owner" && step !== "closed" && step !== "boot" && step !== "error";
  return <div className={s.root} data-mirror-friend={step}>
    <div className={cx(f.fsky, dim && f.dim)} aria-hidden="true">
      <Field />
      {svg ? <div className={f.fshape} dangerouslySetInnerHTML={{ __html: svg }} /> : null}
    </div>
    {step === "owner" ? <Frame><div className={f.mid}><p className={f.fsub}>내 페이지예요</p><Link className={cx(s.cta, s.press)} href={`${appPath}?ask=1`} style={{ display: "grid", placeItems: "center", textDecoration: "none", width: "100%" }}>친구에게 물어보기</Link></div></Frame> : null}
    {step === "closed" ? <Frame><div className={f.mid}><h1 className={f.ftitle}>지금은 답을 받지 않고 있어요</h1></div></Frame> : null}
    {step === "error" ? <Frame><div className={f.mid}><p className={f.fsub}>{error}</p></div></Frame> : null}
    {step === "landing" && landing ? <Frame>
      <h1 className={f.ftitle}>{landingTitle(ownerName, landing.owner.line ?? line)}</h1>
      <p className={f.fsub}>질문 12개 · 1분 · 이름은 남지 않아요</p>
      {session && session.asked >= session.open
        ? <button className={cx(s.cta, s.press)} type="button" disabled={busy} onClick={() => { setStep("fly"); void finish(null); }}>결과 보기</button>
        : <button className={cx(s.cta, s.press)} type="button" disabled={busy} onClick={() => session ? void begin() : setStep("closeness")}>{session && session.asked > 0 ? "이어서 답하기" : `${ownerName}에 대해 답하기`}</button>}
    </Frame> : null}
    {step === "closeness" ? <Frame>
      <h1 className={f.ftitle}>{josa(ownerName, "과와")} 나는</h1>
      <div className={f.choices}>{CLOSENESS.map(c => <button key={c.id} type="button" className={cx(f.choice, s.press)} disabled={busy} data-closeness={c.id} onClick={() => void begin(c.id)}><b>{c.label}</b><span>{c.hint}</span></button>)}</div>
    </Frame> : null}
    {step === "quiz" && bundle[qi] ? <Frame top>
      <div className={s.qhead}><span data-friend-count>{ownerName}에 대한 질문 {qi + 1} / {bundle.length}</span><div className={s.qbar} aria-hidden="true"><i style={{ transform: `scaleX(${(qi + (picked[bundle[qi].id] !== undefined ? 1 : 0)) / bundle.length})` }} /></div></div>
      <div className={s.qspace} />
      <div className={s.qin} key={bundle[qi].id} data-item={bundle[qi].id}>
        <h2 className={s.qtitle}>{bundle[qi].situation}</h2>
        <div className={s.opts}>{bundle[qi].order.map((c, k) => <button key={c} type="button" className={cx(s.opt, s.press, picked[bundle[qi].id] === c && s.picked)} disabled={busy} data-choice={c} onClick={() => void answer(c)}>
          <b>{k === 0 ? "A" : "B"}</b><span>{c === 0 ? bundle[qi].a : bundle[qi].b}</span></button>)}</div>
      </div>
      <div className={s.qfoot}>
        <button className={s.link} type="button" onClick={() => setQi(i => Math.max(0, i - 1))} disabled={qi === 0 || busy}>이전</button>
        <button className={s.link} type="button" style={{ opacity: 1 }} disabled={busy} data-choice="skip" onClick={() => void answer(2)}>잘 모르겠어요</button>
      </div>
    </Frame> : null}
    {step === "checkpoint" && session ? <Frame>
      <div className={f.mid}><h1 className={f.ftitle}>{session.asked}개 다 답했어요</h1></div>
      <button className={cx(s.cta, s.press)} type="button" disabled={busy} onClick={() => toStoryOrFinish(session)}>질문 끝내기</button>
      <button className={cx(f.ghost, s.press)} type="button" disabled={busy} onClick={() => void more()}>더 답하기 · 황금별까지 {session.open - session.asked}개</button>
    </Frame> : null}
    {step === "story" && landing?.state === "open" ? <StoryStep name={ownerName} canShowHandle={landing.viewer.canShowHandle} busy={busy} onSend={finish} /> : null}
    {step === "fly" ? <Fly golden={!!result?.golden} ready={!!result} onDone={() => setStep("result")} /> : null}
    {step === "result" && result ? <Frame>
      <div className={cx(f.mid, f.result)} data-result-golden={result.golden}>
        <p className={cx(f.fsub, result.golden && f.gold)}>{result.golden ? `${ownerName}에게 황금별을 달아 줬어요` : `${ownerName} 별자리에 내 별이 달렸어요`}</p>
        {result.know !== null ? <p className={f.big} data-know={result.know}>{josa(ownerName, "을를")} <b>{result.know}%</b><br />알고 있어요</p> : null}
        {result.rank ? <p className={f.fsub} data-rank={`${result.rank.rank}/${result.rank.total}`}>지금까지 답한 친구 {result.rank.total}명 중 {result.rank.rank}등</p> : null}
      </div>
      <Link className={cx(s.cta, s.press)} href={appPath} style={{ display: "grid", placeItems: "center", textDecoration: "none" }} data-try-me>나도 해 보기</Link>
      <p className={f.note}>내 링크를 만들어 {ownerName}에게도 물어볼 수 있어요</p>
      {result.session.asked < result.session.open ? <div className={f.minor}><button className={s.link} type="button" disabled={busy} onClick={() => void more()}>더 답하기 · 황금별까지 {result.session.open - result.session.asked}개</button></div> : null}
    </Frame> : null}
    <div className={`${s.toast} ${toast ? s.toastOn : ""}`} role="status" aria-live="polite">{toast}</div>
  </div>;
}

/** top: 질문 화면처럼 머리줄을 맨 위에 두고 아래를 채운다(자가 질문지와 같은 배치). */
function Frame({ children, top = false }: { children: React.ReactNode; top?: boolean }) {
  return <section className={s.scene}><div className={cx(s.wrap, f.fwrap)}>
    <div className={s.hbar}><Wordmark size="sm" /></div>
    {top ? null : <div className={s.qspace} />}
    {children}
  </div></section>;
}

/** 배경 잔별(정해진 시드 — 화면마다 같다). */
function Field() {
  const dots = useMemo(() => { const r = seededRandom(20261128); return Array.from({ length: 140 }, () => ({ x: r() * 100, y: r() * 100, r: .4 + Math.pow(r(), 6) * 1.6, o: .2 + .7 * Math.pow(r(), 2) })); }, []);
  return <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">{dots.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.r * .18} fill="#fff" fillOpacity={d.o} />)}</svg>;
}

function StoryStep({ name, canShowHandle, busy, onSend }: { name: string; canShowHandle: boolean; busy: boolean; onSend: (story: { kind: StoryKind; body: string; showHandle: boolean } | null) => Promise<string | null> }) {
  const [kind, setKind] = useState<StoryKind | null>(null), [body, setBody] = useState(""), [showHandle, setShowHandle] = useState(false), [problem, setProblem] = useState("");
  const n = charCount(body);
  async function send() {
    const text = normalizeStory(body);
    if (!kind) { setProblem("어떤 이야기인지 골라 주세요."); return; }
    if (!text) { setProblem("이야기를 적어 주세요."); return; }
    const p = storyProblem(text);
    if (p) { setProblem(p.message); return; }
    setProblem("");
    const err = await onSend({ kind, body: text, showHandle });
    if (err) setProblem(err);
  }
  return <section className={cx(s.scene, s.scroll)} data-friend-step="story"><div className={cx(s.wrap, f.fwrap)}>
    <div className={s.qspace} />
    <h1 className={f.ftitle}>{rang(name)} 있었던 일, 하나만 남겨 줄래요?</h1>
    <div className={f.kinds} role="radiogroup" aria-label="이야기 종류">{STORY_KINDS.map(k => <button key={k.id} type="button" role="radio" aria-checked={kind === k.id} className={cx(f.kind, kind === k.id && f.kindOn)} onClick={() => setKind(k.id)}>{k.label}</button>)}</div>
    <textarea className={f.area} value={body} maxLength={STORY_MAX + 40} placeholder="그때 무슨 일이 있었는지 편하게 적어 주세요" onChange={e => { setBody(e.target.value); setProblem(""); }} aria-label="이야기" name="story" />
    {n >= STORY_COUNT_FROM ? <span className={cx(f.count, n > STORY_MAX && f.countOver)}>{n} / {STORY_MAX}</span> : null}
    <p className={f.fsub}>{josa(name, "이가")} 고르면 「모두의 이야기」에 올라갈 수 있어요</p>
    {canShowHandle ? <label className={s.check}><input type="checkbox" checked={showHandle} onChange={e => setShowHandle(e.target.checked)} />내 아이디 보이기</label> : null}
    {problem ? <p className={s.error} role="alert">{problem}</p> : null}
    <button className={cx(s.cta, s.press)} type="button" disabled={busy || n > STORY_MAX || !body.trim()} onClick={() => void send()}>보내기</button>
    <button className={cx(f.ghost, s.press)} type="button" disabled={busy} onClick={() => void onSend(null)}>건너뛰고 보내기</button>
  </div></section>;
}

/** 내 별이 날아가 주인 별자리에 달린다(황금별이면 금빛). 결과가 오면 날아가고, 끝나면 결과 화면. */
function Fly({ golden, ready, onDone }: { golden: boolean; ready: boolean; onDone: () => void }) {
  const el = useRef<HTMLSpanElement>(null), done = useRef(onDone);
  useEffect(() => { done.current = onDone; }, [onDone]);
  useEffect(() => {
    if (!ready || !el.current) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tx = (Math.random() - .5) * Math.min(innerWidth * .5, 220), ty = -innerHeight * .58 + (Math.random() - .5) * 60;
    const a = el.current.animate([
      { transform: "translate(0,0) scale(.6)", opacity: 0 },
      { transform: `translate(${tx * .3}px, ${ty * .45}px) scale(1.4)`, opacity: 1, offset: .35 },
      { transform: `translate(${tx}px, ${ty}px) scale(1)`, opacity: 1, offset: .85 },
      { transform: `translate(${tx}px, ${ty}px) scale(2.2)`, opacity: 0 },
    ], { duration: reduce ? 200 : 1500, easing: "cubic-bezier(.55,0,.35,1)", fill: "forwards" });
    a.onfinish = () => done.current();
    return () => a.cancel();
  }, [ready]);
  return <span ref={el} className={cx(f.fly, golden && f.flyGold)} aria-hidden="true" data-fly />;
}
