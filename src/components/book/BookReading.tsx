"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { BookReader } from "../../app/dev/book-preview/BookReader";
import { DetailSheet } from "../../app/dev/book-preview/BookLegal";
import type { BookData, BookNote } from "../../app/dev/book-preview/bookTypes";
import type { BookShareModel } from "../../lib/book/shareModel";
import { BOOKS } from "../../lib/book/product";
import s from "../../app/dev/book-preview/book.module.css";
import { SaveToLibrary } from "../account/SaveToLibrary";
import { BookShareActions } from "./BookShareActions";
import { bookShareEvent } from "../../lib/book/shareEvents";
import shareStyle from "./bookShare.module.css";
import { canStartReadingGesture, hasReadingSelection, readingGestureDirection, type ReadingGesture } from "./readingGesture";
import { ReferralBookCta } from "./ReferralBookCta";
import { interaction } from "../../lib/analytics/client";

export function BookReading({ data, share, home = "/", saveToLibrary, shareOwner, shared = false, local = false }: { data: BookData; share: BookShareModel; home?: string; saveToLibrary?: { reportId: string; local?: boolean }; shareOwner?: { reportId: string; local?: boolean }; shared?: boolean; local?: boolean }) {
  useEffect(() => { interaction(shared && share.referral ? "referral_landing_opened" : "report_opened", share.productType); }, [shared, share.referral, share.productType]);
  const [page, setPage] = useState(0), [note, setNote] = useState<BookNote | null>(null), [message, setMessage] = useState("");
  const scroll = useRef<HTMLDivElement>(null);
  const [returnPoints, setReturnPoints] = useState<{ page: number; top: number }[]>([]);
  const restoreTop = useRef(0), selectionActive = useRef(false);
  const pendingAnchor = useRef<string | undefined>(undefined);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null), gesture = useRef<ReadingGesture | null>(null);
  const [turning, setTurning] = useState<number | null>(null);
  const book = BOOKS.find(b => b.id === data.bookId)!;
  useEffect(() => {
    scroll.current?.scrollTo({ top: restoreTop.current }); restoreTop.current = 0;
    if (pendingAnchor.current) document.getElementById(pendingAnchor.current)?.scrollIntoView({ block: "start" });
    pendingAnchor.current = undefined; scroll.current?.focus({ preventScroll: true });
  }, [page]);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  useEffect(() => {
    const sync = () => { selectionActive.current = hasReadingSelection(window.getSelection()); if (selectionActive.current) gesture.current = null; };
    document.addEventListener("selectionchange", sync);
    return () => document.removeEventListener("selectionchange", sync);
  }, []);
  const turn = (n: number) => {
    if (timer.current || n < 0 || n >= data.pages.length || n === page) return;
    setTurning(n > page ? 1 : -1); setPage(n); setNote(null);
    timer.current = setTimeout(() => { timer.current = null; setTurning(null); }, matchMedia("(prefers-reduced-motion: reduce)").matches ? 20 : 510);
  };
  const jump = (target: number, anchor?: string) => {
    if (timer.current || target < 0 || target >= data.pages.length) return;
    if (target === page) { if (anchor) document.getElementById(anchor)?.scrollIntoView({ block: "start" }); return; }
    setReturnPoints(points => data.pages[page].kind === "contents" && points.length ? points : [...points, { page, top: scroll.current?.scrollTop ?? 0 }]);
    pendingAnchor.current = anchor;
    turn(target);
  };
  const returnToReading = () => {
    const previous = returnPoints.at(-1);
    if (!previous || timer.current) return;
    restoreTop.current = previous.top; setReturnPoints(points => points.slice(0, -1)); turn(previous.page);
  };
  const contents = data.pages.findIndex(p => p.id === "contents");
  return <main className={s.root} data-book-report style={{ "--cover": book.color, "--ink": book.ink } as CSSProperties} onKeyDown={e => { if ((e.target as Element).closest("dialog,input,select,textarea")) return; if (!hasReadingSelection(window.getSelection()) && (e.key === "ArrowRight" || e.key === "ArrowLeft")) { e.preventDefault(); turn(page + (e.key === "ArrowRight" ? 1 : -1)); } }}>
    <header className={s.header}><a className={s.wordmark} href={home}><b>결리포트</b><span>GYEOL REPORT</span></a><div className={s.readingTools}>{returnPoints.length ? <button onClick={returnToReading}>읽던 곳으로 ↶</button> : null}{contents >= 0 ? <button onClick={() => jump(contents)}>목차</button> : null}<a href={home} className={s.close}>닫기 ×</a></div></header>
    <section className={`${s.bookShell} ${data.pages[page].kind === "back" ? s.backShell : ""}`} onPointerDown={e => { gesture.current = canStartReadingGesture(e.target as Element, selectionActive.current) ? { x: e.clientX, y: e.clientY, startedAt: e.timeStamp } : null; }} onPointerCancel={() => { gesture.current = null; }} onPointerUp={e => { const direction = readingGestureDirection(gesture.current, e.clientX, e.clientY, e.timeStamp, selectionActive.current || hasReadingSelection(window.getSelection())); gesture.current = null; if (direction) turn(page + direction); }}>
      <div className={s.pageScroll} ref={scroll} tabIndex={-1} role="region" aria-label="책 내용" data-page={data.pages[page].kind} data-page-number={page + 1} id={data.pages[page].id} data-chapter-id={data.pages[page].id}>
        <BookReader data={data} page={data.pages[page]} onNote={setNote} onPage={jump} onShare={() => setMessage(`${share.displayTitle} · 공유 연결 준비 중입니다. 실제 공유는 실행하지 않습니다.`)}
          shareActions={shared || shareOwner ? <BookShareActions owner={shared ? undefined : shareOwner} model={shared ? share : undefined} local={local || shareOwner?.local} /> : undefined}
          backAction={shared && share.referral ? <ReferralBookCta share={share} local={local} home={home} /> : shared ? <a className={shareStyle.cta} href={home} onClick={() => bookShareEvent("shared_cta_clicked", share.productType, local)}>나도 내 책 만들기 ↗</a>
            : data.pages[page].kind === "back" && saveToLibrary ? <SaveToLibrary {...saveToLibrary} /> : undefined} />
      </div>
      <nav className={s.pageNav} aria-label="책 읽기 위치"><button aria-label="이전 페이지" disabled={!page} onClick={() => turn(page - 1)}>←</button><span><strong>{data.title}</strong><span>{String(page + 1).padStart(2, "0")} / {data.pages.length}</span></span><button aria-label="다음 페이지" disabled={page === data.pages.length - 1} onClick={() => turn(page + 1)}>→</button></nav>
      {turning ? <div className={s.turnLeaf} data-direction={turning} aria-hidden="true"><span>GYEOL REPORT / PERSONAL EDITION</span><div className={s.turnLines}><i /><i /><i /><i /></div></div> : null}
    </section>
    {note ? <DetailSheet title={note.name} onClose={() => setNote(null)}><p>{note.text}</p></DetailSheet> : null}
    {message ? <div className={s.toast} role="status"><span>{message}</span><button onClick={() => setMessage("")}>닫기</button></div> : null}
  </main>;
}
