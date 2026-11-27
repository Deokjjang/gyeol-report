"use client";
/**
 * 새 내 계정 /me(명령 3 D7, docs/mirror/SPEC.md 「내 계정 — 프로필 · 내 리포트 · 설정」).
 * 첫 화면은 프로필 한 덩어리 + 「내 리포트 ›」 + 「설정 ›」 두 줄. 안쪽 화면은 주소 끝(#reports · #settings · #edit · #report-N)으로 나눠 뒤로 가기가 된다.
 *
 * 기존 고객 원칙(명령 3 추가 지시 2): 로그인만으로 들어온다 — 아이디 · 질문지를 요구하지 않는다. 아이디가 없으면 프로필 칸은 계정 정보(이름 · 가린 이메일)와
 * 「내 별 만들기」 카드 하나(강제하지 않음). 서재는 기존 그대로(LibraryHome · /auth/library-home · LibraryPort — 책 주소 · 권한 · 스냅샷 변경 0).
 * 기존 /account가 하던 일(동의 · 가입 정보 · 가입 이용권 팝업 · 카카오 채널 안내 · 혜택 알림 · 탈퇴 · 로그아웃 · 이용권 · 선물 · 주문 요청)은 같은 부품을 그대로 쓴다.
 */
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ACCOUNT_POLICY_VERSIONS } from "../../../lib/account/policy";
import type { BoardView } from "../../../lib/mirror/boardView";
import { birthProblem, handleProblem, HANDLE_MESSAGES, nameProblem, normalizeHandle, normalizeName } from "../../../lib/mirror/profileRules";
import type { IssueRow } from "../../../lib/mirror/social";
import type { ReportSnapshot } from "../../../lib/mirror/report/types";
import { SUPPORT_CHAT_URL } from "../../../lib/legal/socialLinks";
import { legalLinks } from "../../legal/LegalPageLayout";
import { announceAccountChange, useAccountSession } from "../../account/AccountSession";
import { LOGIN_CHANNEL_NOTE, pendingCheckoutPath, pendingGiftPath } from "../../account/AccountScreen";
import { LibraryHome, startLibraryHome } from "../../account/LibraryHome";
import { KakaoChannelPrompt } from "../../account/KakaoChannelPrompt";
import { MarketingPanel, ProfileForm, WithdrawPanel, type ProfileSaved } from "../../ops/AccountOps";
import { EventPopup } from "../../event/EventPopup";
import { rememberPopup } from "../../../lib/ops/comp/popupSelect";
import { displayLink, mirrorApi, useHideSiteFooter, type SessionView } from "../client";
import { LoginScreen } from "../screens";
import { ReportView } from "../report/ReportView";
import s from "../mirror.module.css";
import f from "../social.module.css";
import m from "./me.module.css";

type View = "main" | "reports" | "settings" | "edit" | `report-${number}`;
type Member = Extract<SessionView, { account: "needs_consent" | "member" }>;
const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");
const mdLabel = (iso: string) => { const d = new Date(iso); return `${d.getMonth() + 1}월 ${d.getDate()}일`; };
const viewOf = (hash: string): View => { const h = hash.replace(/^#/, ""); return h === "reports" || h === "settings" || h === "edit" || /^report-\d+$/.test(h) ? h as View : "main"; };
const PROVIDER = { kakao: "카카오", google: "Google" } as const;

export default function MeApp({ appPath, ticketShop }: { appPath: "/" | "/start"; ticketShop: boolean }) {
  useHideSiteFooter();
  // 서재 묶음 조회는 로그인 확인과 동시에 출발시킨다(기존 /account와 같다 — 회원이 아니면 401로 끝나고 버린다).
  useEffect(() => { void startLibraryHome(); }, []);
  const { session: acct, loaded, error, refresh, verifying } = useAccountSession(false);
  const [mirror, setMirror] = useState<Member | null>(null), [view, setView] = useState<View>("main"), [toast, setToast] = useState<string | null>(null);
  const [welcome, setWelcome] = useState<{ gift: NonNullable<ProfileSaved["signupGift"]>; to: string | null; pick: string } | null>(null);
  const timer = useRef(0);
  const say = useCallback((t: string) => { setToast(t); clearTimeout(timer.current); timer.current = window.setTimeout(() => setToast(null), 2600); }, []);
  const loadMirror = useCallback(() => mirrorApi<SessionView>("session").then(r => { if (r.ok && r.data.account !== "guest") setMirror(r.data as Member); }), []);
  useEffect(() => { if (loaded && acct.status === "member") void loadMirror(); }, [loaded, acct.status, loadMirror]);
  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    const on = () => setView(viewOf(location.hash));
    on(); window.addEventListener("popstate", on);
    return () => { document.documentElement.style.overflow = ""; window.removeEventListener("popstate", on); };
  }, []);
  const go = (v: View) => { setView(v); history.pushState(null, "", v === "main" ? "/me" : `/me#${v}`); document.querySelector(`.${s.page}`)?.scrollTo(0, 0); };
  const back = () => (history.length > 1 && view !== "main" ? history.back() : go("main"));

  // 가입 정보 저장 뒤(기존 /account와 같은 순서): 돌아갈 곳(서버 next · 선물 · 결제하려던 상품) → 가입 이용권 팝업 → 새로고침.
  const saved = (next?: string, joined?: ProfileSaved) => {
    const to = next ?? pendingGiftPath() ?? pendingCheckoutPath();
    if (joined?.signupGift) { setWelcome({ gift: joined.signupGift, to: to ?? null, pick: pendingCheckoutPath() ?? "/products" }); return; }
    if (to) { window.location.assign(to); return; }
    announceAccountChange(); void refresh();
  };
  const leaveWelcome = (target: string | null) => {
    try { rememberPopup("signup", "close", Date.now(), window.localStorage, window.sessionStorage); } catch { /* 기억 못 해도 */ }
    setWelcome(null);
    if (target) { window.location.assign(target); return; }
    announceAccountChange(); void refresh();
  };

  let body: ReactNode;
  if (!loaded) body = <Page title="내 계정" onBack={null}><p className={s.sub} role="status">로그인 상태 확인 중</p></Page>;
  // 로그인 전: 기존 /account처럼 카카오 채널 안내 한 줄 · 「로그인 없이 둘러보기」(상품 목록).
  else if (acct.status === "guest") return <div className={s.root} data-me="guest"><LoginScreen next="/me" extra={<>
    <p className={s.fine} data-login-channel-note>{LOGIN_CHANNEL_NOTE}</p>
    {error ? <p className={s.error} role="alert">로그인 상태를 확인하지 못했어요. 다시 시도해 주세요.</p> : null}
    <p className={s.fine}><a href="/products" data-me-browse>로그인 없이 둘러보기 →</a></p>
  </>} /></div>;
  else if (acct.status === "needs_consent") body = <Consent compWaiting={acct.compWaiting === true} name={acct.displayName ?? ""} onDone={() => { announceAccountChange(); void refresh(); }} />;
  else if (view === "reports") body = <Reports mirror={mirror} appPath={appPath} ticketShop={ticketShop} onBack={back} onOpen={no => go(`report-${no}`)} say={say} />;
  else if (view === "settings") body = <Settings mirror={mirror} onBack={back} say={say} onPublic={v => setMirror(x => x && x.profile ? { ...x, profile: { ...x.profile, isPublic: v } } : x)} />;
  else if (view === "edit" && mirror?.profile) body = <Edit mirror={mirror} onBack={back} onSaved={v => { setMirror(v); say("저장했어요"); back(); }} />;
  else if (view.startsWith("report-")) body = <OneReport no={Number(view.slice(7))} appPath={appPath} onBack={back} />;
  else body = <Page title="내 계정" onBack={null} home={mirror?.profile && mirror.self.completedAt ? appPath : "/products"} homeLabel={mirror?.profile && mirror.self.completedAt ? "내 별" : "결리포트"}>
    <Profile mirror={mirror} acctName={acct.displayName ?? ""} appPath={appPath} onEdit={() => go("edit")} />
    {acct.profile === "required" ? <div className={m.paper} data-me-contact-required><ProfileForm onSaved={saved} /></div> : null}
    <div className={f.group}>
      <button type="button" className={f.item} onClick={() => go("reports")} data-me-row="reports"><span>내 리포트</span><small>›</small></button>
      <button type="button" className={f.item} onClick={() => go("settings")} data-me-row="settings"><span>설정</span><small>›</small></button>
    </div>
  </Page>;

  return <div className={cx(s.root, m.root)} data-me={view}>
    {body}
    {welcome ? <EventPopup id="signup" state={{ member: true, comp: null, event: welcome.gift.event, signup: { active: true, mine: { status: "available", expiresAt: welcome.gift.expiresAt } } }}
      onDone={() => leaveWelcome(welcome.to)} onPick={() => leaveWelcome(welcome.pick)} /> : null}
    {acct.status === "member" ? <KakaoChannelPrompt session={acct} enabled={loaded && !verifying && !error} /> : null}
    <div className={`${s.toast} ${toast ? s.toastOn : ""}`} role="status" aria-live="polite">{toast}</div>
  </div>;
}

/** 화면 틀: 위 왼쪽 뒤로(안쪽 화면) 또는 「내 별 · 결리포트」(첫 화면), 제목. */
function Page({ title, onBack, home, homeLabel, children }: { title: string; onBack: (() => void) | null; home?: string; homeLabel?: string; children: ReactNode }) {
  const arrow = <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M9 2L4 7l5 5" fill="none" stroke="#F4F4F7" strokeWidth="1.4" /></svg>;
  return <section className={s.page} aria-label={title} data-me-page={title}><div className={s.pg}>
    <div className={s.pghead}>
      {onBack ? <button className={cx(s.back, s.press)} type="button" onClick={onBack}>{arrow}뒤로</button> : home ? <a className={cx(s.back, s.press, m.home)} href={home}>{arrow}{homeLabel}</a> : null}
      <h2>{title}</h2>
    </div>
    {children}
  </div></section>;
}

/** 프로필 한 덩어리: 아이디가 있으면 이니셜 · 이름 · @아이디 · 로그인 · 「프로필 편집」, 없으면 계정 이름 · 로그인 + 「내 별 만들기」 카드(강제하지 않음). */
function Profile({ mirror, acctName, appPath, onEdit }: { mirror: Member | null; acctName: string; appPath: string; onEdit: () => void }) {
  const p = mirror?.profile, name = p?.name ?? mirror?.who.name ?? acctName;
  const login = mirror ? `${PROVIDER[mirror.provider]} 로그인${mirror.who.email ? ` · ${mirror.who.email}` : ""}` : "";
  return <>
    <div className={m.profile} data-me-profile={p ? "mirror" : "account"}>
      <span className={f.avatar}>{[...name][0] ?? "나"}</span>
      <div className={m.who}>
        <b>{name || "회원"}</b>
        {p ? <span>@{p.handle}</span> : null}
        {login ? <small data-me-login>{login}</small> : null}
      </div>
      {p ? <button type="button" className={m.edit} onClick={onEdit} data-me-edit>프로필 편집</button> : null}
    </div>
    {mirror && !p ? <a className={m.star} href={appPath} data-me-make-star>
      <b>내 별 만들기</b><span>질문 60개에 답하면 내 별자리가 생기고, 친구에게 「나는 어떤 사람이야?」를 물어볼 수 있어요.</span><small>무료 · 약 7분 ›</small>
    </a> : null}
  </>;
}

/* ---------- 내 리포트: 결 보고서 호 목록 · 심층 리포트(기존 서재) · 더 깊이 알아보기 ---------- */
function Reports({ mirror, appPath, ticketShop, onBack, onOpen, say }: { mirror: Member | null; appPath: string; ticketShop: boolean; onBack: () => void; onOpen: (no: number) => void; say: (t: string) => void }) {
  const ready = !!mirror?.profile && !!mirror.self.completedAt;
  const [board, setBoard] = useState<{ answers: number; canIssue: boolean; issues: IssueRow[] } | null>(null), [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!ready) return;
    let live = true;
    void mirrorApi<{ board: BoardView; issues: IssueRow[] }>("board").then(r => { if (live) setBoard(r.ok ? { answers: r.data.board.answers, canIssue: r.data.board.issue.canIssue, issues: r.data.issues } : { answers: 0, canIssue: false, issues: [] }); });
    return () => { live = false; };
  }, [ready]);
  async function issue() {
    if (busy) return; setBusy(true);
    const r = await mirrorApi<{ snapshot: ReportSnapshot }>("report-issue", { method: "POST", body: {} });
    setBusy(false);
    if (!r.ok) { say(r.data.error ?? "보고서를 만들지 못했어요."); return; }
    onOpen(r.data.snapshot.issueNo);
  }
  return <Page title="내 리포트" onBack={onBack}>
    <h3 className={m.h}>결 보고서 <small>무료</small></h3>
    <div className={f.group} data-me-mirror-reports>
      {!mirror?.profile ? <a className={f.item} href={appPath}><span>내 별을 만들면 받아 볼 수 있어요</span><small>내 별 만들기 ›</small></a>
        : !mirror.self.completedAt ? <a className={f.item} href={appPath}><span>질문 60개를 마치면 시작돼요</span><small>이어서 하기 ›</small></a>
        : !board ? <div className={f.item}><span>불러오는 중</span></div>
        : <>
          {board.issues.map(x => <button key={x.issueNo} type="button" className={f.item} onClick={() => onOpen(x.issueNo)} data-me-issue={x.issueNo}><span>결 보고서 {x.issueNo}호<br /><small>{x.title}</small></span><small>{mdLabel(x.issuedAt)} ›</small></button>)}
          {board.canIssue ? <button type="button" className={f.item} disabled={busy} onClick={() => void issue()} data-me-issue-ready><span>{board.issues.length ? "새 호가 나왔어요" : "결 보고서(무료)"}<br /><small>친구 답 {board.answers}개 · 받을 수 있어요</small></span><small>결 보고서 받기 ›</small></button>
            : !board.issues.length ? <a className={f.item} href={`${appPath}?ask=1`} data-me-issue-wait><span>결 보고서(무료)<br /><small>친구 답 60개부터 · 지금 {board.answers}개</small></span><small>친구에게 물어보기 ›</small></a> : null}
        </>}
    </div>
    <h3 className={m.h}>심층 리포트</h3>
    <div className={m.paper} data-me-library>
      <LibraryHome />
      {ticketShop ? <p className={m.paperLink}><a href="/account/tickets">내 이용권 →</a></p> : null}
    </div>
    <div className={f.group}><a className={f.item} href="/products" data-me-more><span>더 깊이 알아보기<br /><small>사주 · 자미두수 · MBTI 심층 리포트</small></span><small>›</small></a></div>
  </Page>;
}

function OneReport({ no, appPath, onBack }: { no: number; appPath: string; onBack: () => void }) {
  const [snap, setSnap] = useState<ReportSnapshot | null>(null), [err, setErr] = useState("");
  useEffect(() => { let live = true; void mirrorApi<{ snapshot: ReportSnapshot }>("reports", { query: `?no=${no}` }).then(r => { if (live) { if (r.ok) setSnap(r.data.snapshot); else setErr(r.data.error ?? "불러오지 못했어요."); } }); return () => { live = false; }; }, [no]);
  return <Page title={`결 보고서 ${no}호`} onBack={onBack}>
    {snap ? <ReportView snapshot={snap} onAsk={() => location.assign(`${appPath}?ask=1`)} /> : <p className={s.sub} role="status">{err || "불러오는 중"}</p>}
  </Page>;
}

/* ---------- 설정: 내 페이지 공개 · 혜택 알림 · 고객센터 · 약관 · 개인정보 · 환불 · 사업자정보 · (맨 아래 작게) 로그아웃 · 탈퇴 ---------- */
function Settings({ mirror, onBack, say, onPublic }: { mirror: Member | null; onBack: () => void; say: (t: string) => void; onPublic: (v: boolean) => void }) {
  const p = mirror?.profile, [isPublic, setIsPublic] = useState(p?.isPublic ?? true), [withdraw, setWithdraw] = useState(false);
  async function togglePublic() {
    const next = !isPublic; setIsPublic(next);
    const r = await mirrorApi("settings", { method: "POST", body: { isPublic: next } });
    if (!r.ok) { setIsPublic(!next); say(r.data.error ?? "저장하지 못했어요."); return; }
    onPublic(next); say(next ? "이제 링크로 답을 받아요" : "이제 링크로 답을 받지 않아요");
  }
  async function logout() {
    const r = await fetch("/auth/logout", { method: "POST", headers: { "content-type": "application/json" }, body: "{}" }).catch(() => null);
    if (r?.ok) { announceAccountChange(); location.replace("/"); } else say("로그아웃하지 못했어요. 다시 시도해 주세요.");
  }
  return <Page title="설정" onBack={onBack}>
    {p ? <div className={f.group}><div className={f.item}><span>내 페이지 공개<br /><small>끄면 링크로 답을 받지 않아요 · {displayLink(p.handle)}</small></span>
      <button type="button" role="switch" aria-checked={isPublic} aria-label="내 페이지 공개" className={cx(f.switch, isPublic && f.switchOn)} onClick={() => void togglePublic()} data-public><i /></button></div></div> : null}
    <h3 className={m.h}>혜택 알림</h3>
    <div className={m.paper} data-me-marketing><MarketingPanel /><p className={m.paperNote}>가입 정보(이름 · 이메일)를 입력한 뒤에 켜고 끌 수 있어요.</p></div>
    <div className={f.group}>
      <a className={f.item} href={SUPPORT_CHAT_URL} target="_blank" rel="noopener noreferrer"><span>고객센터</span><small>카카오톡 채팅 ›</small></a>
      {legalLinks.map(l => <a key={l.href} className={f.item} href={l.href} data-me-legal={l.href}><span>{l.labelKo}</span><small>{l.href === "/business" ? "상호 · 대표자 · 사업자등록번호 ›" : "›"}</small></a>)}
    </div>
    <div className={f.danger}><button type="button" onClick={() => void logout()} data-me-logout>로그아웃</button><button type="button" onClick={() => setWithdraw(w => !w)} data-me-withdraw>탈퇴</button></div>
    {withdraw ? <div className={m.paper} data-me-withdraw-panel><WithdrawPanel onDone={() => { announceAccountChange(); window.location.assign("/"); }} /></div> : null}
  </Page>;
}

/* ---------- 프로필 편집: 이름 · 아이디(30일에 한 번) · 생년월일 · 출생시간(선택) · 로그인 계정(보기만) ---------- */
function Edit({ mirror, onBack, onSaved }: { mirror: Member; onBack: () => void; onSaved: (v: Member) => void }) {
  const p = mirror.profile!;
  const [name, setName] = useState(p.name), [handle, setHandle] = useState(p.handle), [birthDate, setBirthDate] = useState(p.birthDate ?? ""), [birthTime, setBirthTime] = useState(p.birthTime ?? "");
  const [check, setCheck] = useState<{ handle: string; available: boolean; message?: string } | null>(null), [busy, setBusy] = useState(false), [error, setError] = useState("");
  const [locked] = useState(() => !!p.handleChangeAllowedAt && Date.parse(p.handleChangeAllowedAt) > Date.now());
  const h = normalizeHandle(handle), changed = h !== p.handle, localProblem = changed && h ? handleProblem(h) : null;
  useEffect(() => {
    if (!changed || !h || localProblem) return;
    const t = window.setTimeout(async () => { const r = await mirrorApi<{ handle: string; available: boolean; message?: string }>("handle", { query: `?value=${encodeURIComponent(h)}` }); if (r.ok) setCheck(r.data); }, 300);
    return () => clearTimeout(t);
  }, [h, changed, localProblem]);
  const nameErr = name ? nameProblem(normalizeName(name)) : "이름을 써 주세요.", birthErr = birthProblem(birthDate || null, birthTime || null);
  const handleOk = !changed || (!!h && !localProblem && check?.handle === h && check.available);
  const ready = !nameErr && handleOk && !birthErr && !busy;
  async function submit() {
    if (!ready) return; setBusy(true); setError("");
    const r = await mirrorApi<SessionView & { ok: true }>("profile", { method: "POST", body: { name: normalizeName(name), handle: h, birthDate: birthDate || null, birthTime: birthTime || null } });
    setBusy(false);
    if (r.ok && r.data.account !== "guest") { onSaved(r.data as Member); return; }
    setError(r.ok ? "저장하지 못했어요." : r.data.error ?? "저장하지 못했어요. 다시 시도해 주세요.");
  }
  const note = !changed ? <small>내 링크가 돼요 · {displayLink(p.handle)}</small> : localProblem ? <small className={s.bad}>{HANDLE_MESSAGES[localProblem]}</small>
    : check?.handle === h ? <small className={check.available ? s.ok : s.bad}>{check.available ? "쓸 수 있어요" : check.message}</small> : <small>확인 중…</small>;
  return <Page title="프로필 편집" onBack={onBack}>
    <form className={s.form} onSubmit={e => { e.preventDefault(); void submit(); }} data-me-edit-form>
      <label className={s.field}><span>이름</span><input className={s.input} value={name} onChange={e => setName(e.target.value)} maxLength={10} name="name" />{name && nameErr ? <small className={s.bad}>{nameErr}</small> : <small>친구들에게 보이는 이름</small>}</label>
      <label className={s.field}><span>아이디</span>
        <div className={s.handleBox}><b>@</b><input className={s.input} value={handle} disabled={locked} onChange={e => setHandle(e.target.value.replace(/\s/g, ""))} maxLength={21} autoCapitalize="none" autoCorrect="off" spellCheck={false} inputMode="email" name="handle" /></div>
        {note}<small>{locked ? `${mdLabel(p.handleChangeAllowedAt!)}부터 바꿀 수 있어요 · ` : ""}30일에 한 번 바꿀 수 있어요</small></label>
      <div className={s.optional}>
        <p>선택 · 사주 리포트를 볼 때 자동으로 채워져요</p>
        <div className={s.two}>
          <label className={s.field}><span>생년월일</span><input className={s.input} type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} min="1900-01-01" max={new Date().toISOString().slice(0, 10)} name="birthDate" /></label>
          <label className={s.field}><span>출생시간</span><input className={s.input} type="time" value={birthTime} onChange={e => setBirthTime(e.target.value)} name="birthTime" /></label>
        </div>
        {birthErr ? <small className={s.bad}>{birthErr}</small> : null}
      </div>
      <div className={s.field}><span>로그인 계정</span><div className={m.readonly} data-me-login-view>{PROVIDER[mirror.provider]}{mirror.who.email ? ` · ${mirror.who.email}` : ""}</div></div>
      {error ? <p className={s.error} role="alert">{error}</p> : null}
      <button className={cx(s.cta, s.press)} type="submit" disabled={!ready}>저장</button>
    </form>
  </Page>;
}

/* ---------- 약관 동의(필수 동의가 없거나 새 판일 때 — 기존 /account와 같은 동의 기록 /auth/consent) ---------- */
function Consent({ compWaiting, name, onDone }: { compWaiting: boolean; name: string; onDone: () => void }) {
  const [terms, setTerms] = useState(false), [privacy, setPrivacy] = useState(false), [busy, setBusy] = useState(false), [error, setError] = useState("");
  const requestId = useRef("");
  async function submit() {
    if (!terms || !privacy || busy) return; setBusy(true); setError("");
    requestId.current ||= crypto.randomUUID();
    try {
      const r = await fetch("/auth/consent", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ requestId: requestId.current, terms, privacy, versions: ACCOUNT_POLICY_VERSIONS }) });
      const b = await r.json().catch(() => ({}));
      if (!r.ok) { setError(b.error ?? "다시 시도해 주세요."); return; }
      if (typeof b.next === "string") { window.location.assign(b.next); return; }
      onDone();
    } catch { setError("요청을 완료하지 못했어요. 다시 시도해 주세요."); } finally { setBusy(false); }
  }
  return <Page title="시작하기 전에" onBack={null}>
    {compWaiting ? <p className={m.notice} data-comp-waiting>업그레이드 기념 이용권이 서재에서 기다리고 있어요</p> : null}
    <p className={s.sub}>{name ? `${name}님, ` : ""}지금 이용약관과 개인정보처리방침을 확인해 주세요.</p>
    <div className={s.form} data-me-consent>
      {/* 기존 /account와 같은 「전체 동의」(두 필수 칸을 한 번에). */}
      <label className={cx(s.check, m.all)}><input type="checkbox" checked={terms && privacy} onChange={e => { setTerms(e.target.checked); setPrivacy(e.target.checked); }} name="all" />전체 동의</label>
      <label className={s.check}><input type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)} name="terms" />[필수] 이용약관 동의<a href="/terms" target="_blank" rel="noreferrer">보기</a></label>
      <label className={s.check}><input type="checkbox" checked={privacy} onChange={e => setPrivacy(e.target.checked)} name="privacy" />[필수] 개인정보처리방침 동의<a href="/privacy" target="_blank" rel="noreferrer">보기</a></label>
      {error ? <p className={s.error} role="alert">{error}</p> : null}
      <button className={cx(s.cta, s.press)} type="button" disabled={!terms || !privacy || busy} onClick={() => void submit()}>동의하고 계속하기</button>
      <button className={s.link} type="button" disabled={busy} onClick={() => void fetch("/auth/logout", { method: "POST", headers: { "content-type": "application/json" }, body: "{}" }).then(r => { if (r.ok) { announceAccountChange(); location.replace("/"); } })} data-me-consent-logout>로그아웃</button>
    </div>
  </Page>;
}
