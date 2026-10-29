"use client";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Cover } from "../../app/dev/book-preview/BookPages";
import { createCoverflowAuto } from "../../app/dev/book-preview/coverflowAuto";
import { coverOffset, wrapBook } from "../../app/dev/book-preview/model";
import { BOOKS, readerTitle } from "../../lib/book/product";
import s from "../../app/dev/book-preview/book.module.css";
import { AccountEntry } from "../account/AccountSession";
import { interaction } from "../../lib/analytics/client";
import { LaunchCountdown } from "../growth/LaunchCountdown";

const HINT_KEY = "gyeol-cover-hint-v1";
const hintVisible = () => { try { return !localStorage.getItem(HINT_KEY); } catch { return false; } };

export function BookShelf({ inputPath, year, authEnabled = false }: { inputPath: string; year: number; authEnabled?: boolean }) {
  const [current, setCurrent] = useState(0);
  const auto = useRef<ReturnType<typeof createCoverflowAuto> | null>(null);
  const hovering = useRef(false), dragged = useRef(false), gesture = useRef<{ x: number; y: number; pointerId: number; vertical: boolean } | null>(null);
  const refresh = useRef<() => void>(() => {});
  // 표지를 한 번도 누르지 않은 방문에만 카운터 아래 한 줄 안내. 서버 렌더는 안내 없음, 저장소를 못 쓰면 보이지 않는다.
  const [hint, setHint] = useState(false);
  useEffect(() => { let live = true; queueMicrotask(() => { if (live) setHint(hintVisible()); }); return () => { live = false; }; }, []);
  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)"), hover = matchMedia("(hover: hover) and (pointer: fine)");
    auto.current = createCoverflowAuto(() => setCurrent(c => wrapBook(c + 1)));
    refresh.current = () => {
      if (document.hidden || !hover.matches) hovering.current = false;
      if (document.hidden) gesture.current = null;
      auto.current?.setActive(!motion.matches && !document.hidden && !(hover.matches && hovering.current) && !gesture.current);
    };
    // 모바일 자동 회전(#5): 손가락이 진열 밖에서 떨어지거나 페이지 스크롤로 넘어가면 진열의 pointerup/cancel이 오지 않아
    // 손 떼기 전 상태(gesture)가 남아 자동 회전이 멈춘 채로 있었다. 창 전체에서 손을 떼거나 스크롤하면 풀어 준다.
    const release = () => { if (gesture.current) { gesture.current = null; refresh.current(); } };
    refresh.current(); document.addEventListener("visibilitychange", refresh.current); motion.addEventListener("change", refresh.current); hover.addEventListener("change", refresh.current);
    window.addEventListener("pointerup", release); window.addEventListener("pointercancel", release); window.addEventListener("scroll", release, { passive: true });
    const update = refresh.current;
    return () => { auto.current?.dispose(); document.removeEventListener("visibilitychange", update); motion.removeEventListener("change", update); hover.removeEventListener("change", update); window.removeEventListener("pointerup", release); window.removeEventListener("pointercancel", release); window.removeEventListener("scroll", release); auto.current = null; };
  }, []);
  const select = (n: number) => { auto.current?.interact(); setCurrent(wrapBook(n)); interaction("book_selected", BOOKS[wrapBook(n)].productKey); };
  const open = (slug: string) => { try { localStorage.setItem(HINT_KEY, "1"); } catch { /* optional hint */ } window.location.assign(`${inputPath}?product=${slug}`); };
  return <main className={s.root} data-book-home><header className={s.header}><Link href="/" className={s.wordmark}><b>결리포트</b><span>GYEOL REPORT</span></Link>{authEnabled ? <AccountEntry local={inputPath === "/dev/book-flow/input"} /> : <span className={s.login} aria-label="로그인 준비 중">로그인</span>}</header>
    <LaunchCountdown local={inputPath === "/dev/book-flow/input"} />
    <section className={s.home} aria-label="여섯 권의 책 고르기" tabIndex={0}
      onKeyDown={e => { if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); select(current + (e.key === "ArrowRight" ? 1 : -1)); } }}
      onPointerEnter={e => { if (e.pointerType === "mouse" && matchMedia("(hover: hover) and (pointer: fine)").matches) { hovering.current = true; refresh.current(); } }} onPointerLeave={e => { hovering.current = false; if (e.pointerType === "mouse") { gesture.current = null; dragged.current = true; } refresh.current(); }}
      onPointerDown={e => {
        dragged.current = false;
        if (!e.isPrimary) { gesture.current = null; refresh.current(); return; }
        if (e.pointerType !== "mouse") hovering.current = false;
        gesture.current = { x: e.clientX, y: e.clientY, pointerId: e.pointerId, vertical: false }; auto.current?.interact(); refresh.current();
      }} onPointerMove={e => {
        const p = gesture.current;
        if (p?.pointerId === e.pointerId && Math.abs(e.clientY - p.y) > 12 && Math.abs(e.clientY - p.y) > Math.abs(e.clientX - p.x)) p.vertical = true;
      }} onPointerCancel={() => { gesture.current = null; dragged.current = true; refresh.current(); }}
      onPointerUp={e => {
        const p = gesture.current; gesture.current = null;
        if (p?.pointerId === e.pointerId) {
          dragged.current = p.vertical || Math.hypot(e.clientX - p.x, e.clientY - p.y) > 12;
          if (!p.vertical && Math.abs(e.clientX - p.x) > 45 && Math.abs(e.clientX - p.x) > Math.abs(e.clientY - p.y) * 1.5) select(current + (e.clientX < p.x ? 1 : -1));
        }
        refresh.current();
      }} onClickCapture={e => { if (e.detail && dragged.current) { e.preventDefault(); e.stopPropagation(); } }}>
      <h1 className={s.srOnly}>나에 관한 한 권을 고르세요</h1><div className={s.coverflow} role="group" aria-label="책 표지" aria-roledescription="회전 책장">
        {BOOKS.map((book, i) => { const offset = coverOffset(i, current), title = readerTitle(book, String(year)); return <button key={book.id} className={s.bookSlot} style={{ "--offset": offset, "--distance": Math.abs(offset), zIndex: 10 - Math.abs(offset) } as CSSProperties} data-center={current === i} aria-current={current === i ? "true" : undefined} aria-label={`${title} ${current === i ? "펼치기" : "선택"}`} tabIndex={Math.abs(offset) < 3 ? 0 : -1} onClick={() => { if (dragged.current) return; if (i !== current) select(i); else { auto.current?.interact(); open(book.slug); } }}><Cover book={book} title={book.id === "annual" ? `나의\n${year}` : undefined} /></button>; })}
      </div><div className={s.carouselControls}><button aria-label="이전 책" onClick={() => select(current - 1)}>←</button><span className={s.micro} aria-live="polite">{BOOKS[current].issue} / 06</span><button aria-label="다음 책" onClick={() => select(current + 1)}>→</button></div>
      {hint ? <p className={s.tapHint}>표지를 누르면 펼쳐집니다</p> : null}<p className={s.tagline}>한 사람, 한 권.</p>
    </section></main>;
}
