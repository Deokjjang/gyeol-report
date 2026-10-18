'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { BookReader } from '../../../../src/app/dev/book-preview/BookReader';
import { DetailSheet } from '../../../../src/app/dev/book-preview/BookLegal';
import { BOOKS } from '../../../../src/lib/book/product';
import type { BookData, BookNote } from '../../../../src/app/dev/book-preview/bookTypes';
import { canStartReadingGesture, hasReadingSelection, readingGestureDirection, type ReadingGesture } from '../../../../src/components/book/readingGesture';
import s from '../../../../src/app/dev/book-preview/book.module.css';
// Reader-only wrapper. BookReading's analytics, owner/share, referral, saving,
// account entry and payment components are deliberately never mounted here.
export function ReviewBook({ data }: { data: BookData }) {
  const [page, setPage] = useState(0), [note, setNote] = useState<BookNote | null>(null), [turning, setTurning] = useState<number | null>(null);
  const scroll = useRef<HTMLDivElement>(null), timer = useRef<ReturnType<typeof setTimeout> | null>(null), gesture = useRef<ReadingGesture | null>(null);
  const anchor = useRef<string | undefined>(undefined), book = BOOKS.find(b => b.id === data.bookId)!;
  useEffect(() => { scroll.current?.scrollTo({ top: 0 }); if (anchor.current) document.getElementById(anchor.current)?.scrollIntoView({ block: 'start' }); anchor.current = undefined; scroll.current?.focus({ preventScroll: true }); }, [page]);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const turn = (target: number, id?: string) => {
    if (timer.current || target < 0 || target >= data.pages.length) return;
    if (target === page) { if (id) document.getElementById(id)?.scrollIntoView(); return; }
    anchor.current = id; setNote(null); setTurning(target > page ? 1 : -1); setPage(target);
    timer.current = setTimeout(() => { timer.current = null; setTurning(null); }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 20 : 510);
  };
  return <main className={s.root} data-review-book style={{ '--cover': book.color, '--ink': book.ink } as CSSProperties} onKeyDown={e => {
    if ((e.target as Element).closest('dialog,input,select,textarea')) return;
    if (!hasReadingSelection(window.getSelection()) && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) { e.preventDefault(); turn(page + (e.key === 'ArrowRight' ? 1 : -1)); }
  }}><header className={s.header}><span className={s.wordmark}><b>결리포트</b><span>GYEOL REPORT</span></span><div className={s.readingTools}><button onClick={() => turn(data.pages.findIndex(p => p.kind === 'contents'))}>목차</button><label>페이지<select aria-label="페이지 이동" value={page} onChange={e => turn(Number(e.target.value))}>{data.pages.map((p, i) => <option key={i} value={i}>{i + 1}. {p.title}</option>)}</select></label></div></header>
    <section data-review-shell className={`${s.bookShell} ${data.pages[page].kind === 'back' ? s.backShell : ''}`} onPointerDown={e => { gesture.current = canStartReadingGesture(e.target as Element, hasReadingSelection(window.getSelection())) ? { x: e.clientX, y: e.clientY, startedAt: e.timeStamp } : null; }} onPointerCancel={() => { gesture.current = null; }} onPointerUp={e => { const direction = readingGestureDirection(gesture.current, e.clientX, e.clientY, e.timeStamp, hasReadingSelection(window.getSelection())); gesture.current = null; if (direction) turn(page + direction); }}>
      <div className={s.pageScroll} ref={scroll} tabIndex={-1} role="region" aria-label="책 내용" data-page={data.pages[page].kind} data-page-number={page + 1} id={data.pages[page].id}>
        <BookReader data={data} page={data.pages[page]} onNote={setNote} onPage={turn} onShare={() => {}} shareActions={<p>검수 전용 · 실제 공유와 저장은 실행하지 않습니다.</p>} />
      </div><nav className={s.pageNav} aria-label="책 읽기 위치"><button aria-label="이전 페이지" disabled={!page} onClick={() => turn(page - 1)}>←</button><span><strong>{data.title}</strong><span>{page + 1} / {data.pages.length}</span></span><button aria-label="다음 페이지" disabled={page === data.pages.length - 1} onClick={() => turn(page + 1)}>→</button></nav>
      {turning ? <div className={s.turnLeaf} data-direction={turning} aria-hidden="true"><span>GYEOL REPORT / PERSONAL EDITION</span><div className={s.turnLines}><i /><i /><i /><i /></div></div> : null}
    </section>{note ? <DetailSheet title={note.name} onClose={() => setNote(null)}><p>{note.text}</p></DetailSheet> : null}</main>;
}
