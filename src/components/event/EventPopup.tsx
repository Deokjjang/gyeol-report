"use client";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  eventRangeLabel, expiryLabel, isPopupState, popupAllowedPath, popupHidden, remainingLabel, rememberPopup, selectPopup, timesLabel,
  type PopupId, type PopupState,
} from "../../lib/ops/comp/popupSelect";
import s from "./eventPopup.module.css";

const storages = () => {
  let local: Storage | null = null, session: Storage | null = null;
  try { local = window.localStorage; } catch { /* 저장소를 못 쓰면 기억 없이 */ }
  try { session = window.sessionStorage; } catch { /* 같음 */ }
  return { local, session };
};

/** 서버 상태 읽기: 회원·보상 이용권은 /auth/event-popup(읽기 전용), 실패하면 공개 기간 정보만(/api/gift-event). */
async function loadPopupState(): Promise<PopupState | null> {
  try {
    const r = await fetch("/auth/event-popup", { cache: "no-store" });
    const b: unknown = r.ok ? await r.json() : null;
    if (isPopupState(b)) return b;
  } catch { /* 공개 정보로 */ }
  try {
    const r = await fetch("/api/gift-event", { cache: "no-store" });
    const e = r.ok ? await r.json() : null;
    return e && typeof e.phase === "string" ? { member: false, comp: null, event: e } : null;
  } catch { return null; }
}

/**
 * 메인·상품 화면 팝업(최종 A 14). 상황마다 하나만 고르고(selectPopup), 「오늘 하루 보지 않기」는 팝업 id마다 따로 기억한다.
 * 닫기·ESC·바깥 누르기로 닫힌다. 같은 탭에서는 닫은 뒤 다시 뜨지 않는다. 리포트 읽는 화면에서는 아무것도 하지 않는다.
 */
export function EventPopupHost() {
  const [popup, setPopup] = useState<{ id: PopupId; state: PopupState; clock: () => number } | null>(null);
  useEffect(() => {
    if (!popupAllowedPath(window.location.pathname)) return;
    let alive = true;
    const requested = performance.now();
    void loadPopupState().then(state => {
      if (!alive || !state) return;
      // 서버 시각 + 그 뒤 흐른 시간(벽시계를 바꿔도 흔들리지 않음). 서버 시각이 없으면 브라우저 시계.
      const serverNow = Date.parse(state.event?.serverNow ?? "");
      const clock = Number.isFinite(serverNow) ? () => serverNow + Math.max(0, performance.now() - requested) : () => Date.now();
      const now = clock(), id = selectPopup(state, window.location.pathname, now);
      const { local, session } = storages();
      if (id && !popupHidden(id, now, local, session)) setPopup({ id, state, clock });
    });
    return () => { alive = false; };
  }, []);
  if (!popup) return null;
  return createPortal(<EventPopup id={popup.id} state={popup.state} clock={popup.clock} onDone={how => {
    const { local, session } = storages(); rememberPopup(popup.id, how, popup.clock(), local, session); setPopup(null);
  }} />, document.body);
}

export function EventPopup({ id, state, clock = Date.now, onDone }: { id: PopupId; state: PopupState; clock?: () => number; onDone: (how: "close" | "today") => void }) {
  const ref = useRef<HTMLDialogElement>(null), titleId = useId(), bodyId = useId();
  const [now, setNow] = useState(clock);
  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) { if (typeof d.showModal === "function") d.showModal(); else d.setAttribute("open", ""); }
    // 열릴 때 초점은 대화상자 자체에(제목·설명을 읽어 준다). Tab으로 닫기·버튼으로 이동한다.
    d?.focus?.();
    return () => { if (d?.open && typeof d.close === "function") d.close(); };
  }, []);
  const event = state.event, eventOn = event?.phase === "during" && Date.parse(event.endsAt) > now;
  useEffect(() => {
    if (id !== "event-1plus1") return;
    const t = setInterval(() => setNow(clock()), 1000);
    return () => clearInterval(t);
  }, [id, clock]);
  // 기간이 끝나면 ①은 스스로 닫힌다(기억은 남기지 않음).
  useEffect(() => { if (id === "event-1plus1" && !eventOn) ref.current?.close?.(); }, [id, eventOn]);
  const done = (how: "close" | "today") => { if (ref.current?.open && typeof ref.current.close === "function") ref.current.close(); onDone(how); };
  const comp = state.comp;
  return <dialog ref={ref} className={s.dialog} tabIndex={-1} aria-modal="true" aria-labelledby={titleId} aria-describedby={bodyId} data-event-popup={id}
    onCancel={e => { e.preventDefault(); done("close"); }}
    onClick={e => { if (e.target === e.currentTarget) done("close"); }}>
    <div className={s.card}>
      <button type="button" className={s.close} aria-label="닫기" onClick={() => done("close")}><span aria-hidden="true">×</span></button>
      {id === "event-1plus1" && event ? <>
        <p className={s.eyebrow}>{eventRangeLabel(event)}</p>
        <h2 id={titleId} className={s.title}>한 권을 펼치면, 한 권이 더</h2>
        <p id={bodyId} className={s.body}>리포트를 한 권 결제하면 무료 이용권 한 장을 더 드려요. 나를 한 권 더 읽거나, 소중한 사람에게 선물해 보세요.</p>
        <p className={s.timer}><span>남은 시간</span><b>{remainingLabel(Date.parse(event.endsAt) - now)}</b></p>
        <p className={s.small}>한 계정에 {timesLabel(event.maxPerAccount)}까지 · 이용권은 받은 날부터 {event.validDays}일</p>
        <div className={s.actions}>
          <a className={s.secondary} href="/example" onClick={() => done("close")}>예시 먼저 보기</a>
          <Link className={s.primary} href="/" onClick={e => { if (/^\/(products)?\/?$/.test(window.location.pathname)) e.preventDefault(); done("close"); }}>리포트 고르기</Link>
        </div>
      </> : comp ? <>
        <p className={s.eyebrow}>새로 쓴 결리포트</p>
        {id === "comp-a" ? <>
          <h2 id={titleId} className={s.title}>믿고 먼저 결제해 주셔서 고맙습니다</h2>
          <p id={bodyId} className={s.body}>아직 부족했던 결리포트를 믿어 주신 덕분에 처음부터 다시 쓸 수 있었어요. 만세력은 더 정확하게, 해석은 더 깊게, 문장은 더 내 이야기처럼. 고마운 마음을 담아 이용권 두 장을 드려요.</p>
        </> : <>
          <h2 id={titleId} className={s.title}>결리포트를 처음부터 다시 썼어요</h2>
          <p id={bodyId} className={s.body}>만세력은 더 정확하게, 사주와 MBTI를 잇는 해석은 더 깊게, 문장은 더 내 이야기처럼. 먼저 찾아 주신 분께 새 결리포트를 읽어 볼 이용권을 드려요.</p>
        </>}
        <p className={s.ticket}><b>무료 이용권 {comp.unused}장</b><span>{expiryLabel(comp.expiresAt)}까지</span></p>
        <p className={s.small}>{id === "comp-a" ? "한 장은 나에게, 한 장은 소중한 사람에게." : "직접 읽거나, 소중한 사람에게 선물할 수 있어요."}</p>
        {id === "comp-b" && eventOn ? <p className={s.small}>지금은 1+1 기간이에요. 결제 1건마다 1장을 더 드려요.</p> : null}
        <div className={s.actions}><a className={s.primary} href="/account#gifts" onClick={() => done("close")}>이용권으로 만들기</a></div>
      </> : null}
      <button type="button" className={s.today} onClick={() => done("today")}>오늘 하루 보지 않기</button>
    </div>
  </dialog>;
}
