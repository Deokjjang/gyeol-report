"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { BookReader } from "../../app/dev/book-preview/BookReader";
import { DetailSheet } from "../../app/dev/book-preview/BookLegal";
import type { BookData, BookNote } from "../../app/dev/book-preview/bookTypes";
import { readerBook } from "../../app/dev/book-preview/readerLayout";
import type { BookShareModel } from "../../lib/book/shareModel";
import { BOOKS } from "../../lib/book/product";
import s from "../../app/dev/book-preview/book.module.css";
import { SaveToLibrary } from "../account/SaveToLibrary";
import { BookShareActions } from "./BookShareActions";
import { KeywordCardActions } from "./KeywordCardActions";
import { bookShareEvent } from "../../lib/book/shareEvents";
import shareStyle from "./bookShare.module.css";
import { canStartReadingGesture, hasReadingSelection, hasReadingHorizontalScroll, moveReadingGesture, readingGestureDirection, type ReadingGesture } from "./readingGesture";
import { ReferralBookCta } from "./ReferralBookCta";
import { interaction } from "../../lib/analytics/client";
import { readableBookText } from "../../lib/book/readerCopy";

/** F 책 끝 연결(주인 화면만 — 받은 사람의 공유 화면·예시에는 없다). 공유 버튼(링크 복사·카카오톡·공유하기)은 그대로 두고 그 아래에 둔다. */
export const BOOK_END_SIGNUP_LINE = "무료로 받은 책은 어떠셨나요? 마음에 드셨다면 다른 이야기도 만나 보세요.";
/** 1+1 기간 줄(2026-11-10 정정: 「증정」 표현, 날짜는 서버 설정값 — 1+1 끝). */
export const bookEndEventLine = (until: string) => `${until ? `${until}까지 ` : ""}한 권 결제하면 이용권 1장을 증정해요. 친구에게 선물할 수도 있어요.`;
export const BOOK_END_CTA = "다른 책 고르기";
export type BookEndNoticeView = { event: boolean; signup: boolean; eventUntil?: string };
export function BookEndNotice({ view, home = "/" }: { view: BookEndNoticeView; home?: string }) {
  if (!view.event && !view.signup) return null;
  return <section className={shareStyle.endNotice} aria-label="다른 책 고르기" data-book-end-notice={view.signup ? "signup" : "paid"}>
    {view.signup ? <p data-book-end-signup>{BOOK_END_SIGNUP_LINE}</p> : null}
    {view.event ? <p data-book-end-event>{bookEndEventLine(view.eventUntil ?? "")}</p> : null}
    <a className={shareStyle.endCta} href={home} data-book-end-cta>{BOOK_END_CTA}</a>
  </section>;
}

/** example(최종 A 15, /example): 맨 위 작은 회색 표시(tag)와 끝 쪽 버튼(cta)만 바꾼다 — 공유·서재 저장은 없음.
 * endNotice(F): 주인 화면 마지막 쪽의 1+1·가입 이용권 책 안내(서버가 지금 이벤트 기간·이 책이 가입 이용권 책인지 정해 넘긴다). */
export function BookReading({ data: stored, edition, today, share, home = "/", saveToLibrary, shareOwner, shared = false, local = false, example, endNotice }: { data: BookData; edition?: string; today?: string; share: BookShareModel; home?: string; saveToLibrary?: { reportId: string; local?: boolean }; shareOwner?: { reportId: string; local?: boolean }; shared?: boolean; local?: boolean; example?: { tag: string; cta: { label: string; href: string } }; endNotice?: BookEndNoticeView }) {
  useEffect(() => { interaction(shared && share.referral ? "referral_landing_opened" : "report_opened", share.productType); }, [shared, share.referral, share.productType]);
  const data = readerBook(edition ? { ...stored, edition } : stored, today);
  const [page, setPage] = useState(0), [note, setNote] = useState<BookNote | null>(null), [message, setMessage] = useState(""), [toc, setToc] = useState(false);
  const scroll = useRef<HTMLDivElement>(null);
  const [returnPoints, setReturnPoints] = useState<{ page: number; top: number }[]>([]);
  const restoreTop = useRef(0), selectionActive = useRef(false);
  const pendingAnchor = useRef<string | undefined>(undefined);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null), gesture = useRef<ReadingGesture | null>(null);
  const pointerDown = useRef<{ x: number; y: number; pointerId: number } | null>(null);
  const swipeClick = useRef<{ x: number; y: number; at: number } | null>(null);
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
    setReturnPoints(points => [...points, { page, top: scroll.current?.scrollTop ?? 0 }]);
    pendingAnchor.current = anchor;
    turn(target);
  };
  const returnToReading = () => {
    const previous = returnPoints.at(-1);
    if (!previous || timer.current) return;
    restoreTop.current = previous.top; setReturnPoints(points => points.slice(0, -1)); turn(previous.page);
  };
  return <main className={s.root} data-book-report data-scheme={data.scheme} data-example-page={example ? "" : undefined} style={{ "--cover": book.color, "--ink": book.ink } as CSSProperties} onKeyDown={e => { if ((e.target as Element).closest("dialog,input,select,textarea")) return; if (!hasReadingSelection(window.getSelection()) && (e.key === "ArrowRight" || e.key === "ArrowLeft")) { e.preventDefault(); turn(page + (e.key === "ArrowRight" ? 1 : -1)); } }}>
    <header className={s.header}><a className={s.wordmark} href={home}><b>결리포트</b><span>GYEOL REPORT</span></a><div className={s.readingTools}>{example ? <span className={s.exampleTag} data-example-tag>{example.tag}</span> : null}{returnPoints.length ? <button onClick={returnToReading}>읽던 곳으로 ↶</button> : null}{data.contents?.length ? <button onClick={() => setToc(true)}>목차</button> : null}<a href={home} className={s.close}>닫기 ×</a></div></header>
    <section className={`${s.bookShell} ${data.pages[page].kind === "back" ? s.backShell : ""}`} onPointerDown={e => {
      gesture.current = null;
      pointerDown.current = e.isPrimary ? { x: e.clientX, y: e.clientY, pointerId: e.pointerId } : null;
      // Leave OS edge navigation, zoom panning, mouse selection and controls alone.
      if (!e.isPrimary || (e.pointerType === "mouse" && (e.target as Element).closest("p,h1,h2,h3,h4,span,strong,b,small,li,td,th,dt,dd,[data-selectable]")) || timer.current || note || e.clientX < 20 || e.clientX > document.documentElement.clientWidth - 20 || (window.visualViewport?.scale ?? 1) > 1) return;
      if (canStartReadingGesture(e.target as Element, selectionActive.current) && !hasReadingHorizontalScroll(e.target as Element, e.currentTarget)) gesture.current = { x: e.clientX, y: e.clientY, startedAt: e.timeStamp, pointerId: e.pointerId, intent: "pending" };
    }} onPointerMove={e => { if (gesture.current?.pointerId === e.pointerId) moveReadingGesture(gesture.current, e.clientX, e.clientY, e.timeStamp); }}
      onPointerCancel={() => { gesture.current = null; pointerDown.current = null; }} onLostPointerCapture={() => { gesture.current = null; pointerDown.current = null; }}
      onPointerUp={e => {
        const origin = pointerDown.current; pointerDown.current = null;
        if (origin?.pointerId === e.pointerId && Math.hypot(e.clientX - origin.x, e.clientY - origin.y) > 12) swipeClick.current = { x: e.clientX, y: e.clientY, at: e.timeStamp };
        const start = gesture.current; gesture.current = null;
        if (start?.pointerId !== e.pointerId) return;
        const direction = readingGestureDirection(start, e.clientX, e.clientY, e.timeStamp, selectionActive.current || hasReadingSelection(window.getSelection()));
        if (direction) { swipeClick.current = { x: e.clientX, y: e.clientY, at: e.timeStamp }; turn(page + direction); }
      }} onClickCapture={e => {
        const click = swipeClick.current; swipeClick.current = null;
        if (click && e.detail && e.timeStamp - click.at < 500 && Math.abs(e.clientX - click.x) < 4 && Math.abs(e.clientY - click.y) < 4) { e.preventDefault(); e.stopPropagation(); }
      }}>
      <div className={s.pageScroll} ref={scroll} onScroll={() => { gesture.current = null; }} tabIndex={-1} role="region" aria-label="책 내용" data-page={data.pages[page].kind} data-page-number={page + 1} id={data.pages[page].id} data-chapter-id={data.pages[page].id}>
        <BookReader data={data} page={data.pages[page]} onNote={setNote} onPage={jump} onShare={() => { if (local) setMessage("미리보기입니다. 실제 공유나 복사는 실행하지 않습니다."); }}
          shareActions={example ? <a className={shareStyle.cta} href={example.cta.href} data-example-end>{example.cta.label}</a> : shared || shareOwner ? <BookShareActions owner={shared ? undefined : shareOwner} model={shared ? share : undefined} local={local || shareOwner?.local} /> : local ? undefined : <p className={shareStyle.notice}>이 책은 공유할 수 없습니다.</p>}
          backAction={example ? undefined : shared && share.referral ? <ReferralBookCta share={share} local={local} home={home} /> : shared ? <a className={shareStyle.cta} href={home} onClick={() => bookShareEvent("shared_cta_clicked", share.productType, local)}>나도 내 책 만들기 ↗</a>
            : data.pages[page].kind === "back" && saveToLibrary ? <SaveToLibrary {...saveToLibrary} /> : undefined}
          endNotice={!example && !shared && shareOwner && endNotice ? <BookEndNotice view={endNotice} home={home} /> : undefined}
          keywordActions={!example && !shared && shareOwner && data.pages[page].kind === "keywords" ? <KeywordCardActions owner={shareOwner} local={local || shareOwner.local} /> : undefined} />
      </div>
      <nav className={s.pageNav} aria-label="책 읽기 위치"><button aria-label="이전 페이지" disabled={!page} onClick={() => turn(page - 1)}>←</button><span><strong>{data.title}</strong><span>{String(page + 1).padStart(2, "0")} / {data.pages.length}</span></span><button aria-label="다음 페이지" disabled={page === data.pages.length - 1} onClick={() => turn(page + 1)}>→</button></nav>
      {turning ? <div className={s.turnLeaf} data-direction={turning} aria-hidden="true"><span>GYEOL REPORT / PERSONAL EDITION</span><div className={s.turnLines}><i /><i /><i /><i /></div></div> : null}
    </section>
    {note ? <DetailSheet title={note.name} onClose={() => setNote(null)}><p>{note.text}</p></DetailSheet> : null}
    {toc ? <DetailSheet title="목차" onClose={() => setToc(false)}><ol className={s.bookContents}>{data.contents!.map(entry => <li key={entry.targetId}><button onClick={() => { setToc(false); jump(entry.page, entry.targetId); }} data-target-chapter={entry.targetId}><span>{readableBookText(entry.title, data.people.map(p => p.name))}</span><small>{String(entry.page + 1).padStart(2, "0")}</small></button></li>)}</ol></DetailSheet> : null}
    {message ? <div className={s.toast} role="status"><span>{message}</span><button onClick={() => setMessage("")}>닫기</button></div> : null}
  </main>;
}
