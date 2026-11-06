"use client";
import { useEffect, useRef, useState } from "react";
import { MARKETING_CONSENT_LABEL, validateContact } from "../../lib/account/contact";
import { seoulDateTime } from "../../lib/ops/orders/summary";
import s from "./ops.module.css";

type Prefill = { name: string; email: string; emailLocked: boolean; emailFrom?: string | null; emailNotice: string | null };

/** 가입 정보 화면(P6d-ops 2). 로그인 직후 서재 위에 보인다. 마치기 전에도 서재·책 열람은 된다(결제·이용권 사용만 막힘). */
export function ProfileForm({ base = "/auth", onSaved }: { base?: string; onSaved: (next?: string) => void }) {
  const [prefill, setPrefill] = useState<Prefill | null>(null), [error, setError] = useState("");
  const [v, setV] = useState({ name: "", email: "", emailConfirm: "", phone: "", marketing: false }), [useProvider, setUseProvider] = useState(false), [busy, setBusy] = useState(false);
  const requestId = useRef("");
  useEffect(() => {
    void fetch(`${base}/profile`, { cache: "no-store" }).then(async r => {
      const b = await r.json(); if (!r.ok || !b.prefill) { setError(b.error ?? "가입 정보를 불러오지 못했어요. 새로고침해 주세요."); return; }
      setPrefill(b.prefill); setUseProvider(Boolean(b.prefill.emailLocked));
      setV(x => ({ ...x, name: b.prefill.name ?? "", email: b.prefill.emailLocked ? b.prefill.email : (b.prefill.email ?? "") }));
    }).catch(() => setError("가입 정보를 불러오지 못했어요. 새로고침해 주세요."));
  }, [base]);
  async function submit() {
    if (busy) return;
    const body = { ...v, emailSource: useProvider ? "provider" : "typed" };
    const checked = validateContact(body, useProvider ? { email: prefill?.email, emailTrusted: true } : null);
    if (!checked.ok) { setError(checked.message); return; }
    setBusy(true); setError("");
    requestId.current ||= crypto.randomUUID();
    try {
      const r = await fetch(`${base}/profile`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...body, requestId: requestId.current }) });
      const b = await r.json();
      if (!r.ok) { setError(b.error ?? "저장하지 못했어요."); return; }
      onSaved(typeof b.next === "string" ? b.next : undefined);
    } catch { setError("저장하지 못했어요. 다시 시도해 주세요."); }
    finally { setBusy(false); }
  }
  return <section className={s.section} aria-labelledby="profile-title" data-profile-form>
    <h2 id="profile-title">가입 정보</h2>
    <p>주문 확인과 환불 안내를 위해 한 번만 입력해 주세요. 입력 전에도 서재와 책은 그대로 볼 수 있어요.</p>
    {!prefill && !error ? <p role="status">불러오는 중</p> : null}
    {prefill ? <div className={s.form}>
      <label>이름(필수)<input type="text" value={v.name} maxLength={40} autoComplete="name" onChange={e => setV({ ...v, name: e.target.value })} /></label>
      {useProvider ? <div><span className={s.hint}>이메일(필수) · {prefill.emailFrom === "google" ? "Google" : "카카오"} 계정에서 확인된 이메일</span><div className={s.locked}>{prefill.email}</div><button type="button" className={`${s.button} ${s.link}`} onClick={() => { setUseProvider(false); setV({ ...v, email: "", emailConfirm: "" }); }}>다른 이메일 쓰기</button></div> : <>
        <label>이메일(필수)<input type="email" inputMode="email" autoCapitalize="none" autoCorrect="off" spellCheck={false} enterKeyHint="next" value={v.email} maxLength={254} autoComplete="email" onChange={e => setV({ ...v, email: e.target.value.trim() })} /></label>
        <label>이메일 확인(필수)<input type="email" inputMode="email" autoCapitalize="none" autoCorrect="off" spellCheck={false} enterKeyHint="next" value={v.emailConfirm} maxLength={254} autoComplete="off" onChange={e => setV({ ...v, emailConfirm: e.target.value.trim() })} /></label>
        {prefill.emailNotice ? <p className={s.hint}>{prefill.emailNotice}</p> : null}
      </>}
      <label>휴대폰(선택)<input type="tel" inputMode="numeric" value={v.phone} maxLength={13} placeholder="010-0000-0000" autoComplete="tel" onChange={e => setV({ ...v, phone: e.target.value })} /></label>
      <label className={s.check}><input type="checkbox" checked={v.marketing} onChange={e => setV({ ...v, marketing: e.target.checked })} />{MARKETING_CONSENT_LABEL}</label>
      <p className={s.hint}>이름·이메일·휴대폰은 회원 확인, 주문 확인, 환불 안내, 서비스 공지에 씁니다. 마케팅 소식은 따로 동의한 경우에만 보냅니다. <a className={s.link} href="/privacy" target="_blank" rel="noopener">개인정보처리방침 보기</a></p>
      <button type="button" className={`${s.button} ${s.dark}`} disabled={busy} onClick={() => void submit()}>저장하고 계속하기 →</button>
    </div> : null}
    {error ? <p className={s.message} role="alert">{error}</p> : null}
  </section>;
}

/** P 추가 F(2026-11-06): 예전 서재 칸(구매 내역·보상 안내 한 줄·이벤트 이용권 칸)은 서재 한 화면(components/account/LibraryHome.tsx)으로 합쳤다. */
/**
 * 마이페이지 혜택 알림(선택, 최종3): 가입 정보 화면과 같은 동의를 켜고 끈다. 바꾸면 그 일시를 바로 보여 준다(동의·철회 기록은 서버에 남는다).
 * 가입 정보를 아직 입력하지 않았으면 보이지 않는다(가입 정보 화면에서 같이 고른다).
 */
export function MarketingPanel({ base = "/auth" }: { base?: string }) {
  const [state, setState] = useState<{ agreed: boolean; at: string | null } | null>(null), [busy, setBusy] = useState(false), [message, setMessage] = useState("");
  useEffect(() => {
    void fetch(`${base}/profile`, { cache: "no-store" }).then(async r => { const b = await r.json(); if (r.ok && b.contact && b.marketing) setState(b.marketing); }).catch(() => undefined);
  }, [base]);
  async function change(marketing: boolean) {
    if (busy) return;
    setBusy(true); setMessage("");
    try {
      const r = await fetch(`${base}/profile`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ op: "marketing", marketing, requestId: crypto.randomUUID() }) });
      const b = await r.json();
      if (!r.ok || !b.marketing) { setMessage(b.error ?? "저장하지 못했어요. 다시 시도해 주세요."); return; }
      setState(b.marketing);
      setMessage(marketing ? "혜택 알림을 켰어요." : "혜택 알림을 껐어요. 이제 혜택 소식을 보내지 않아요.");
    } catch { setMessage("저장하지 못했어요. 다시 시도해 주세요."); } finally { setBusy(false); }
  }
  if (!state) return null;
  return <div data-marketing-panel>
    <label className={s.check}><input type="checkbox" checked={state.agreed} disabled={busy} onChange={e => void change(e.target.checked)} />{MARKETING_CONSENT_LABEL}</label>
    <p className={s.hint}>{state.at ? `${seoulDateTime(state.at)}에 ${state.agreed ? "동의" : "동의를 거두었"}어요.` : state.agreed ? "동의한 상태예요." : "받지 않는 상태예요."} 서비스 공지(주문·환불·장애 안내)는 이 설정과 상관없이 보내요.</p>
    {message ? <p className={s.message} role="status">{message}</p> : null}
  </div>;
}

/** 회원 탈퇴: 먼저 "열람이 불가해진다"를 알리고, '탈퇴'를 입력해야 진행된다. */
export function WithdrawPanel({ base = "/auth", onDone }: { base?: string; onDone: () => void }) {
  const [open, setOpen] = useState(false), [books, setBooks] = useState<number | null>(null), [confirm, setConfirm] = useState(""), [busy, setBusy] = useState(false), [error, setError] = useState("");
  async function start() { setOpen(true); try { const r = await fetch(`${base}/withdraw`, { cache: "no-store" }); const b = await r.json(); setBooks(r.ok ? Number(b.books ?? 0) : null); } catch { setBooks(null); } }
  async function submit() {
    if (confirm !== "탈퇴" || busy) return;
    setBusy(true); setError("");
    try { const r = await fetch(`${base}/withdraw`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ confirm }) }); const b = await r.json(); if (!r.ok) { setError(b.error ?? "탈퇴하지 못했어요."); return; } onDone(); }
    catch { setError("탈퇴하지 못했어요. 다시 시도해 주세요."); } finally { setBusy(false); }
  }
  return <div className={s.danger} data-withdraw>
    {!open ? <button type="button" className={`${s.button} ${s.link}`} onClick={() => void start()}>회원 탈퇴</button> : <>
      <b>탈퇴하기 전에 확인해 주세요</b>
      <ul>
        <li>구매한 책{books !== null ? ` ${books}권` : ""}은 탈퇴하면 열람이 불가해집니다. 다시 가입해도 되살릴 수 없어요.</li>
        <li>남은 이용권과 이벤트 이용권은 사라집니다.</li>
        <li>계정·연락처·출생 입력은 바로 지웁니다. 주문·결제 기록은 전자상거래법에 따라 5년 동안 따로 보관한 뒤 지웁니다.</li>
        <li>카카오로 가입했다면 결리포트와 카카오 계정 연결도 끊습니다.</li>
      </ul>
      <label className={s.form}>확인을 위해 &apos;탈퇴&apos;를 입력해 주세요<input type="text" value={confirm} onChange={e => setConfirm(e.target.value)} /></label>
      <div className={s.actions}><button type="button" className={`${s.button} ${s.dark}`} disabled={confirm !== "탈퇴" || busy} onClick={() => void submit()}>탈퇴하기</button><button type="button" className={s.button} onClick={() => { setOpen(false); setConfirm(""); }}>취소</button></div>
      {error ? <p className={s.message} role="alert">{error}</p> : null}
    </>}
  </div>;
}
