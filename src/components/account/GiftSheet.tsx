"use client";
import { useEffect, useRef, useState } from "react";
import type { TicketWallet } from "../../lib/ops/gift/service";
import { announceAccountChange } from "./AccountSession";
import s from "./libraryHome.module.css";

/** 선물 토큰(서버 발급과 같은 모양: 24바이트 → base64url 32자). 서버는 해시만 둔다. */
export function newGiftToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
const post = (body: object) => fetch("/auth/gift", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) })
  .then(async r => ({ ok: r.ok, body: await r.json().catch(() => ({})) as { message?: string } }))
  .catch(() => ({ ok: false, body: {} as { message?: string } }));
const kstDay = (iso: string | null) => { const ms = Date.parse(iso ?? ""); if (!Number.isFinite(ms)) return ""; const d = new Date(ms + 9 * 3_600_000); return `${d.getUTCMonth() + 1}월 ${d.getUTCDate()}일`; };

/**
 * 선물하기 창(P 추가 F). 링크는 [공유하기]·[링크 복사]를 누르는 순간 만든다(창을 열기만 하면 이용권을 쓰지 않는다).
 * 공유 창은 사용자 동작 안에서 바로 열어야 해서(모바일 Safari) 토큰을 화면에서 만들고 링크 등록은 함께 보낸다.
 * 공유 창을 그냥 닫으면 그 링크의 이용권을 되돌린다(unlink). 휴대폰은 [공유하기]+[링크 복사], 데스크톱은 [링크 복사]만.
 */
export function GiftSheet({ wallet, onClose, onChanged }: { wallet: TicketWallet; onClose: () => void; onChanged: () => void }) {
  const [busy, setBusy] = useState(false), [message, setMessage] = useState(""), [manual, setManual] = useState("");
  // 이 창은 누른 뒤에만 열려(서버 렌더 없음) 처음 값에서 바로 판단한다.
  const [canShare] = useState(() => typeof navigator !== "undefined" && typeof navigator.share === "function" && window.matchMedia("(pointer: coarse)").matches), [counts, setCounts] = useState({ sent: wallet.sent, recipients: wallet.recipients, giftable: wallet.giftable });
  const dialog = useRef<HTMLDivElement>(null);
  useEffect(() => {
    dialog.current?.focus();
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);
  const done = (text: string) => { setMessage(text); setCounts(c => ({ ...c, sent: c.sent + 1, giftable: Math.max(0, c.giftable - 1) })); announceAccountChange(); onChanged(); };

  async function share() {
    if (busy || counts.giftable < 1) return;
    setBusy(true); setMessage(""); setManual("");
    const token = newGiftToken(), url = `${location.origin}/gift/${token}`;
    const link = post({ op: "link_next", token });
    try {
      await navigator.share({ title: "결리포트 이용권 선물", text: "결리포트 이용권 1장을 선물해요. 링크를 열고 로그인하면 받을 수 있어요.", url });
      const r = await link;
      if (r.ok) done("선물 링크를 보냈어요.");
      else setMessage(r.body.message ?? "링크를 만들지 못했어요. 다시 시도해 주세요.");
    } catch {
      // 공유 창을 닫았거나 공유하지 못함 → 이용권을 되돌린다(받기 전이라 그대로 남는다).
      const r = await link;
      if (r.ok) await post({ op: "unlink", token });
    } finally { setBusy(false); }
  }
  async function copy() {
    if (busy || counts.giftable < 1) return;
    setBusy(true); setMessage(""); setManual("");
    const token = newGiftToken(), url = `${location.origin}/gift/${token}`;
    const link = post({ op: "link_next", token });
    let copied = false;
    try { await navigator.clipboard.writeText(url); copied = true; } catch { copied = false; }
    const r = await link;
    if (!r.ok) { setMessage(r.body.message ?? "링크를 만들지 못했어요. 다시 시도해 주세요."); setBusy(false); return; }
    if (copied) done("링크를 복사했어요. 친구에게 보내 주세요.");
    else { setManual(url); done("아래 링크를 길게 눌러 복사해 친구에게 보내 주세요."); }
    setBusy(false);
  }
  return <div className={s.backdrop} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <div className={s.sheet} role="dialog" aria-modal="true" aria-labelledby="gift-sheet-title" tabIndex={-1} ref={dialog} data-gift-sheet>
      <button type="button" className={s.close} aria-label="닫기" onClick={onClose}>×</button>
      <h2 id="gift-sheet-title">이용권 1장을 선물해요</h2>
      <p>링크를 받은 분이 로그인하면 이용권이 그분 서재로 옮겨가요. {kstDay(wallet.giftExpiresAt ?? wallet.expiresAt) || "기한"}까지 쓸 수 있어요.</p>
      <div className={s.sheetActions}>
        {canShare ? <button type="button" className={s.dark} disabled={busy || counts.giftable < 1} onClick={() => void share()}>공유하기</button> : null}
        <button type="button" className={canShare ? undefined : s.dark} disabled={busy || counts.giftable < 1} onClick={() => void copy()}>링크 복사</button>
      </div>
      {manual ? <input className={s.manual} readOnly value={manual} onFocus={e => e.currentTarget.select()} aria-label="선물 링크" /> : null}
      {message ? <p role="status" className={s.sheetMessage}>{message}</p> : null}
      <p className={s.sheetStats}>보낸 선물 {counts.sent}장 · 받은 분 {counts.recipients}명</p>
    </div>
  </div>;
}
