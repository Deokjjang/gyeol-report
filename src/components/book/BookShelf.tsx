"use client";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Cover } from "../../app/dev/book-preview/BookPages";
import { createCoverflowAuto } from "../../app/dev/book-preview/coverflowAuto";
import { coverOffset, wrapBook } from "../../app/dev/book-preview/model";
import { BOOKS, readerTitle } from "../../lib/book/product";
import s from "../../app/dev/book-preview/book.module.css";

export function BookShelf({ inputPath, year }: { inputPath: string; year: number }) {
  const [current, setCurrent] = useState(0);
  const auto = useRef<ReturnType<typeof createCoverflowAuto> | null>(null);
  const hovering = useRef(false), dragged = useRef(false), gesture = useRef<{ x: number; y: number } | null>(null);
  const refresh = useRef<() => void>(() => {});
  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    auto.current = createCoverflowAuto(() => setCurrent(c => wrapBook(c + 1)));
    refresh.current = () => auto.current?.setActive(!motion.matches && !document.hidden && !hovering.current);
    refresh.current(); document.addEventListener("visibilitychange", refresh.current); motion.addEventListener("change", refresh.current);
    const update = refresh.current;
    return () => { auto.current?.dispose(); document.removeEventListener("visibilitychange", update); motion.removeEventListener("change", update); };
  }, []);
  const select = (n: number) => { auto.current?.interact(); setCurrent(wrapBook(n)); };
  return <main className={s.root} data-book-home><header className={s.header}><Link href="/" className={s.wordmark}><b>결리포트</b><span>GYEOL REPORT</span></Link><span className={s.login} aria-label="로그인 준비 중">로그인</span></header>
    <section className={s.home} aria-label="여섯 권의 책 고르기" tabIndex={0}
      onKeyDown={e => { if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); select(current + (e.key === "ArrowRight" ? 1 : -1)); } }}
      onPointerEnter={e => { if (e.pointerType === "mouse" && matchMedia("(hover: hover)").matches) { hovering.current = true; refresh.current(); } }} onPointerLeave={() => { hovering.current = false; refresh.current(); }}
      onPointerDown={e => { dragged.current = false; gesture.current = { x: e.clientX, y: e.clientY }; }} onPointerCancel={() => { gesture.current = null; }}
      onPointerUp={e => { const p = gesture.current; gesture.current = null; if (p && Math.abs(e.clientX - p.x) > 45 && Math.abs(e.clientX - p.x) > Math.abs(e.clientY - p.y) * 1.5) { dragged.current = true; select(current + (e.clientX < p.x ? 1 : -1)); } }}>
      <h1 className={s.srOnly}>나에 관한 한 권을 고르세요</h1><div className={s.coverflow} role="group" aria-label="책 표지" aria-roledescription="회전 책장">
        {BOOKS.map((book, i) => { const offset = coverOffset(i, current), title = readerTitle(book, String(year)); return <button key={book.id} className={s.bookSlot} style={{ "--offset": offset, "--distance": Math.abs(offset), zIndex: 10 - Math.abs(offset) } as CSSProperties} data-center={current === i} aria-current={current === i ? "true" : undefined} aria-label={`${title} ${current === i ? "펼치기" : "선택"}`} tabIndex={Math.abs(offset) < 3 ? 0 : -1} onClick={() => { if (dragged.current) return; if (i !== current) select(i); else { auto.current?.interact(); window.location.assign(`${inputPath}?product=${book.slug}`); } }}><Cover book={book} title={book.id === "annual" ? `나의\n${year}` : undefined} /></button>; })}
      </div><div className={s.carouselControls}><button aria-label="이전 책" onClick={() => select(current - 1)}>←</button><span className={s.micro} aria-live="polite">{BOOKS[current].issue} / 06</span><button aria-label="다음 책" onClick={() => select(current + 1)}>→</button></div>
    </section></main>;
}
