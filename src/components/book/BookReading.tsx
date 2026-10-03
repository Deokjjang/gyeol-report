"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { BookReader } from "../../app/dev/book-preview/BookReader";
import { DetailSheet } from "../../app/dev/book-preview/BookLegal";
import type { BookData, BookNote } from "../../app/dev/book-preview/bookTypes";
import type { BookShareModel } from "../../lib/book/shareModel";
import { BOOKS } from "../../lib/book/product";
import s from "../../app/dev/book-preview/book.module.css";
import { SaveToLibrary } from "../account/SaveToLibrary";

export function BookReading({ data, share, home = "/", saveToLibrary }: { data: BookData; share: BookShareModel; home?: string; saveToLibrary?: { reportId: string; local?: boolean } }) {
  const [page, setPage] = useState(0), [note, setNote] = useState<BookNote | null>(null), [message, setMessage] = useState("");
  const scroll = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null), gesture = useRef<{ x: number; y: number } | null>(null);
  const [turning, setTurning] = useState<number | null>(null);
  const book = BOOKS.find(b => b.id === data.bookId)!;
  useEffect(() => { scroll.current?.scrollTo({ top: 0 }); scroll.current?.focus({ preventScroll: true }); }, [page]);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const turn = (n: number) => {
    if (timer.current || n < 0 || n >= data.pages.length || n === page) return;
    setTurning(n > page ? 1 : -1); setPage(n); setNote(null);
    timer.current = setTimeout(() => { timer.current = null; setTurning(null); }, matchMedia("(prefers-reduced-motion: reduce)").matches ? 20 : 510);
  };
  return <main className={s.root} data-book-report style={{ "--cover": book.color, "--ink": book.ink } as CSSProperties} onKeyDown={e => { if ((e.target as Element).closest("dialog,input,select,textarea")) return; if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); turn(page + (e.key === "ArrowRight" ? 1 : -1)); } }}>
    <header className={s.header}><a className={s.wordmark} href={home}><b>결리포트</b><span>GYEOL REPORT</span></a><a href={home} className={s.close}>닫기 ×</a></header>
    <section className={`${s.bookShell} ${data.pages[page].kind === "back" ? s.backShell : ""}`} onPointerDown={e => { if ((e.target as Element).closest("button,a,input,select,dialog")) return; gesture.current = { x: e.clientX, y: e.clientY }; }} onPointerCancel={() => { gesture.current = null; }} onPointerUp={e => { const p = gesture.current; gesture.current = null; if (p && Math.abs(e.clientX - p.x) > 45 && Math.abs(e.clientX - p.x) > Math.abs(e.clientY - p.y) * 1.5) turn(page + (e.clientX < p.x ? 1 : -1)); }}>
      <div className={s.pageScroll} ref={scroll} tabIndex={-1} role="region" aria-label="책 내용" data-page={data.pages[page].kind} data-page-number={page + 1}>
        <BookReader data={data} page={data.pages[page]} onNote={setNote} onPage={turn} onShare={() => setMessage(`${share.displayTitle} · 공유 연결 준비 중입니다. 실제 공유는 실행하지 않습니다.`)}
          backAction={data.pages[page].kind === "back" && saveToLibrary ? <SaveToLibrary {...saveToLibrary} /> : undefined} />
      </div>
      <nav className={s.pageNav} aria-label="책 읽기 위치"><button aria-label="이전 페이지" disabled={!page} onClick={() => turn(page - 1)}>←</button><span><strong>{data.title}</strong><span>{String(page + 1).padStart(2, "0")} / {data.pages.length}</span></span><button aria-label="다음 페이지" disabled={page === data.pages.length - 1} onClick={() => turn(page + 1)}>→</button></nav>
      {turning ? <div className={s.turnLeaf} data-direction={turning} aria-hidden="true"><span>GYEOL REPORT / PERSONAL EDITION</span><div className={s.turnLines}><i /><i /><i /><i /></div></div> : null}
    </section>
    {note ? <DetailSheet title={note.name} onClose={() => setNote(null)}><p>{note.text}</p></DetailSheet> : null}
    {message ? <div className={s.toast} role="status"><span>{message}</span><button onClick={() => setMessage("")}>닫기</button></div> : null}
  </main>;
}
