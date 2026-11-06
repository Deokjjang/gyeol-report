"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { MARKETING_CONSENT_LABEL, validateContact } from "../../lib/account/contact";
import { productLabel, seoulDateTime, type OrderSummary, type PendingBook } from "../../lib/ops/orders/summary";
import { OrderRequestForm, OrderSummaryCard } from "./OrderParts";
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
        <label>이메일(필수)<input type="email" value={v.email} maxLength={254} autoComplete="email" onChange={e => setV({ ...v, email: e.target.value })} /></label>
        <label>이메일 확인(필수)<input type="email" value={v.emailConfirm} maxLength={254} autoComplete="off" onChange={e => setV({ ...v, emailConfirm: e.target.value })} /></label>
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

/** 서재 구매 내역(P6d-ops 4) + 제본 중인 이용권 Book. */
export function PurchaseHistory({ base = "/auth" }: { base?: string }) {
  const [data, setData] = useState<{ orders: OrderSummary[]; pending: PendingBook[] } | null>(null), [error, setError] = useState(false);
  useEffect(() => {
    const load = () => void fetch(`${base}/orders`, { cache: "no-store" }).then(async r => { const b = await r.json(); if (!r.ok) { setError(true); return; } setData({ orders: b.orders ?? [], pending: b.pending ?? [] }); setError(false); }).catch(() => setError(true));
    load(); const timer = setInterval(() => { if (!document.hidden) load(); }, 30_000);
    return () => clearInterval(timer);
  }, [base]);
  if (error) return <section className={s.section}><h2>구매 내역</h2><p role="alert">구매 내역을 불러오지 못했어요. 새로고침해 주세요.</p></section>;
  if (!data) return null;
  return <>
    {data.pending.length ? <section className={s.section} aria-labelledby="pending-title" data-pending-books><h2 id="pending-title">제본 중인 책</h2><p>책을 만들고 있어요. 이 화면을 나갔다 와도 계속 만들어지고, 완성되면 위 서재에 꽂혀요.</p>
      <ul className={s.list}>{data.pending.map(b => <li key={b.reportId} className={s.order}><b>{productLabel(b.productType)}</b> · {b.displayName || "내 책"}<br /><span className={s.hint}>{seoulDateTime(b.createdAt)} 접수 · 제본 중</span></li>)}</ul></section> : null}
    <section className={s.section} aria-labelledby="orders-title" data-purchase-history><h2 id="orders-title">구매 내역</h2>
      {data.orders.length ? <ul className={s.list}>{data.orders.map(o => <li key={o.orderCode}><OrderSummaryCard order={o} bookHref={o.reportId && o.paymentStatus === "paid" && o.bookStatus !== "EXPIRED" ? `/reports/${o.reportId}` : null}><OrderRequestForm orderCode={o.orderCode} endpoint={`${base}/orders`} /></OrderSummaryCard></li>)}</ul> : <p>아직 결제한 주문이 없어요.</p>}
    </section>
  </>;
}

/**
 * 보상 이용권 안내 한 줄(P6e-ops 5): 서재 맨 위. A(결제 후 환불한 고객)는 사과·감사, B(기존 무료 이벤트 가입자)는 업그레이드 안내.
 * 문구는 서버가 src/lib/ops/compMessages.ts에서 만들어 준다. 켜져 있지 않거나 대상이 아니면 fallback(예: 기존 "업그레이드 대상" 한 줄)만 보인다.
 * 서재를 열 때마다 서버가 멱등으로 지급을 시도하므로(가입 정보를 마친 계정만), 가입 정보 저장 뒤 key를 바꿔 다시 마운트하면 바로 반영된다.
 */
export function CompNotice({ base = "/auth", className, fallback = null }: { base?: string; className?: string; fallback?: ReactNode }) {
  const [state, setState] = useState<{ show: true; tier: string; notice: string } | { show: false } | null>(null);
  useEffect(() => {
    let alive = true;
    void fetch(`${base}/comp`, { cache: "no-store" }).then(async r => {
      const b = await r.json().catch(() => null) as { show?: boolean; tier?: string; notice?: string } | null;
      if (alive) setState(r.ok && b?.show === true && typeof b.notice === "string" ? { show: true, tier: String(b.tier), notice: b.notice } : { show: false });
    }).catch(() => { if (alive) setState({ show: false }); });
    return () => { alive = false; };
  }, [base]);
  if (!state) return null;
  return state.show ? <p className={className} data-comp-notice={state.tier}>{state.notice}</p> : <>{fallback}</>;
}

type Gift = { id: string; status: string; expiresAt: string; orderCode: string | null; kind?: "event" | "comp"; giftOnly?: boolean; bonus: boolean };
/**
 * 이벤트 이용권(P6d-ops 6): 결제 1건마다 1장. 내가 쓰거나 선물 링크로 보낸다. 이벤트가 꺼져 있고 받은 것도 없으면 안 보인다.
 * 보상 이용권(v5 최종 2-3)도 같은 목록·같은 버튼이다(장마다 내가 쓰기 / 선물 링크 만들기). 예전에 지급한 선물 링크 전용(giftOnly)만 내가 쓰기를 숨긴다.
 */
export function GiftPanel({ base = "/auth" }: { base?: string }) {
  const [state, setState] = useState<{ gifts: Gift[]; active: boolean; max: number } | null>(null), [message, setMessage] = useState(""), [link, setLink] = useState("");
  const load = () => void fetch(`${base}/gift`, { cache: "no-store" }).then(async r => { const b = await r.json(); if (r.ok) setState({ gifts: b.gifts ?? [], active: Boolean(b.event?.active), max: Number.isInteger(b.event?.maxPerAccount) ? b.event.maxPerAccount : 2 }); }).catch(() => undefined);
  useEffect(load, [base]);
  async function act(op: "use_self" | "link", giftId: string) {
    setMessage("");
    const r = await fetch(`${base}/gift`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ op, giftId }) });
    const b = await r.json();
    if (!r.ok) { setMessage(b.message ?? "처리하지 못했어요."); return; }
    // 선물해도 기한은 처음 받은 날 기준 그대로(최종3) — 고른 장의 기한을 함께 알린다.
    const gift = state?.gifts.find(g => g.id === giftId), until = gift ? ` ${seoulDateTime(gift.expiresAt)}까지 쓸 수 있어요.` : "";
    if (op === "link") { const url = `${location.origin}${b.url}`; setLink(url); try { await navigator.clipboard.writeText(url); setMessage(`선물 링크를 복사했어요. 친구에게 보내 주세요. 받은 친구도${until || " 같은 기한까지 쓸 수 있어요."}`); } catch { setMessage("아래 선물 링크를 복사해 친구에게 보내 주세요."); } }
    else setMessage(`이용권 1장을 넣었어요.${until}`);
    load();
  }
  if (!state || (!state.active && !state.gifts.length)) return null;
  const label: Record<string, string> = { available: "사용 가능", used_self: "내가 사용", gifted: "선물 링크 보냄", claimed: "친구가 받음", expired: "기간 종료", revoked: "환불로 회수" };
  const onlyComp = !state.active && state.gifts.every(g => g.kind === "comp");
  return <section id="gifts" className={s.section} aria-labelledby="gift-title" data-gift-panel><h2 id="gift-title">{onlyComp ? "보상 이용권" : "이벤트 이용권"}</h2>
    {onlyComp ? <p>한 장마다 내가 쓰거나, 선물 링크를 만들어 친구에게 보낼 수 있어요.</p> : <p>결제 1건마다 이용권 1장(계정당 {state.max}회). 내가 쓰거나 친구에게 선물할 수 있어요. 선물받은 친구가 첫 결제를 하면 1장을 더 드려요.</p>}
    <p className={s.hint}>이용권은 받은 날부터 30일 동안 쓸 수 있어요. 선물해도 기한은 그대로예요. 현금으로 바꾸거나 환불할 수 없어요.</p>
    {state.gifts.length ? <ul className={s.list}>{state.gifts.map(g => <li key={g.id} className={s.order}><span className={s.badge}>{label[g.status] ?? g.status}</span> {g.kind === "comp" ? "보상 이용권" : `주문 ${g.orderCode}`} · {seoulDateTime(g.expiresAt)}까지{g.bonus ? " · 보너스 1장 받음" : ""}
      {g.status === "available" || g.status === "gifted" ? <div className={s.actions}>{g.status === "available" && !g.giftOnly ? <button type="button" className={s.button} onClick={() => void act("use_self", g.id)}>내가 쓰기</button> : null}<button type="button" className={s.button} onClick={() => void act("link", g.id)}>{g.status === "gifted" ? "새 선물 링크" : "선물 링크 만들기"}</button></div> : null}</li>)}</ul> : <p className={s.hint}>이벤트 기간에 결제하면 여기에 이용권이 생겨요.</p>}
    {link ? <p className={s.locked}>{link}</p> : null}
    {message ? <p className={s.message} role="status">{message}</p> : null}
  </section>;
}

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
