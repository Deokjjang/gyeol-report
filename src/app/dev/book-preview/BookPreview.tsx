"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent, type KeyboardEvent } from "react";
import { Cover, Receipt, Publishing, PreviewFooter } from "./BookPages";
import { BookReader, BookInputSummary } from "./BookReader";
import { DetailSheet } from "./BookLegal";
import { BOOKS, PUBLISHING_STATES, coverOffset, wrapBook, requiredConsents } from "./model";
import { createCoverflowAuto } from "./coverflowAuto";
import type { BookLibrary, BookNote } from "./bookTypes";
import s from "./book.module.css";
import { canStartReadingGesture, hasReadingSelection, readingGestureDirection } from "../../../components/book/readingGesture";

type Stage = "home" | "opening-input" | "input" | "receipt" | "publishing" | "complete" | "opening-reader" | "reader";
const isField = (target: EventTarget) => target instanceof Element && Boolean(target.closest("input,select,textarea,a,button"));

export default function BookPreview({ library, initialBook, initialRead = false }: { library: BookLibrary; initialBook?: string; initialRead?: boolean }) {
  const [stage, setStage] = useState<Stage>(initialRead ? "reader" : "home");
  const [current, setCurrent] = useState(Math.max(0, BOOKS.findIndex(b => b.id === initialBook)));
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [member, setMember] = useState(false);
  const [consents, setConsents] = useState<Record<string, boolean>>({});
  const [publication, setPublication] = useState(0);
  const [page, setPage] = useState(0);
  const [turn, setTurn] = useState<null | { direction: number; label: string }>(null);
  const [note, setNote] = useState<BookNote | null>(null);
  const [message, setMessage] = useState("");
  const auto = useRef<ReturnType<typeof createCoverflowAuto> | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const gesture = useRef<{ x: number; y: number; startedAt: number } | null>(null);
  const wheelTime = useRef(0);
  const dragged = useRef(false);
  const turnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const book = BOOKS[current];
  const data = library.books[current], person = data.people[0], pages = data.pages;
  const opening = stage === "opening-input" || stage === "opening-reader";

  useEffect(() => {
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(q.matches);
    sync(); q.addEventListener("change", sync);
    const visibility = () => setVisible(!document.hidden);
    const back = () => { setStage("home"); setPage(0); setNote(null); };
    document.addEventListener("visibilitychange", visibility); window.addEventListener("popstate", back); visibility();
    auto.current = createCoverflowAuto(() => setCurrent(c => wrapBook(c + 1)));
    return () => { q.removeEventListener("change", sync); document.removeEventListener("visibilitychange", visibility); window.removeEventListener("popstate", back); auto.current?.dispose(); if (turnTimer.current) clearTimeout(turnTimer.current); turnTimer.current = null; };
  }, []);
  useEffect(() => {
    auto.current?.setActive(stage === "home" && !hovered && !reduced && visible);
  }, [stage, hovered, reduced, visible]);
  useEffect(() => {
    if (!opening) return;
    const id = setTimeout(() => { setStage(stage === "opening-input" ? "input" : "reader"); }, reduced ? 30 : 880);
    return () => clearTimeout(id);
  }, [opening, stage, reduced]);
  useEffect(() => {
    if (stage !== "publishing") return;
    const id = setTimeout(() => {
      if (publication === 4) setStage("complete"); else setPublication(p => p + 1);
    }, reduced ? 400 : 900);
    return () => clearTimeout(id);
  }, [stage, publication, reduced]);
  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 });
    if (stage === "input" || stage === "reader" || stage === "receipt") scroller.current?.focus({ preventScroll: true });
  }, [stage, page]);

  const select = (index: number) => { auto.current?.interact(); setCurrent(wrapBook(index)); };
  const animateTurn = (direction: number, action: () => void) => {
    if (turnTimer.current) return;
    setTurn({ direction, label: stage === "reader" ? "GYEOL REPORT / PERSONAL EDITION" : "GYEOL REPORT / YOUR STORY" });
    action();
    turnTimer.current = setTimeout(() => { turnTimer.current = null; setTurn(null); }, reduced ? 20 : 510);
  };
  const next = () => {
    if (stage === "home") select(current + 1);
    else if (stage === "input") animateTurn(1, () => setStage("receipt"));
    else if (stage === "reader" && page < pages.length - 1) animateTurn(1, () => setPage(p => p + 1));
  };
  const previous = () => {
    if (stage === "home") select(current - 1);
    else if (stage === "input") setStage("home");
    else if (stage === "receipt") animateTurn(-1, () => setStage("input"));
    else if (stage === "reader" && page > 0) animateTurn(-1, () => setPage(p => p - 1));
  };
  const keyboard = (event: KeyboardEvent) => {
    if (event.target instanceof Element && event.target.closest("dialog")) return;
    if (event.target instanceof Element && event.target.closest("input,select,textarea")) return;
    if (event.key === "ArrowRight") { event.preventDefault(); next(); }
    if (event.key === "ArrowLeft") { event.preventDefault(); previous(); }
  };
  const pointerStart = (e: PointerEvent) => {
    dragged.current = false;
    if (stage !== "home" && isField(e.target)) return;
    if (stage === "reader" && !canStartReadingGesture(e.target as Element, hasReadingSelection(window.getSelection()))) { gesture.current = null; return; }
    gesture.current = { x: e.clientX, y: e.clientY, startedAt: e.timeStamp };
  };
  const pointerEnd = (e: PointerEvent) => {
    const start = gesture.current; gesture.current = null;
    if (!start) return;
    if (stage === "reader") { const direction = readingGestureDirection(start, e.clientX, e.clientY, e.timeStamp, hasReadingSelection(window.getSelection())); if (direction) { dragged.current = true; if (direction > 0) next(); else previous(); } return; }
    const x = e.clientX - start.x, y = e.clientY - start.y;
    if (Math.abs(x) > 45 && Math.abs(x) > Math.abs(y) * 1.5) { dragged.current = true; if (x < 0) next(); else previous(); }
  };
  const begin = () => { auto.current?.interact(); setConsents({}); setStage("opening-input"); window.history.pushState({ bookPreview: true }, "", "#book"); };
  const publish = () => {
    const gate = requiredConsents(member, person.birth);
    if (!gate.allowed || !gate.items.every(c => consents[c.id])) return;
    setPublication(0); setStage("publishing");
  };
  const closeBook = () => { setStage("home"); setMessage(""); setNote(null); auto.current?.interact(); if (window.history.state?.bookPreview) window.history.back(); };
  const openNote = (entry: BookNote) => {
    // Native modal restoration must not auto-scroll an inline superscript in
    // the perspective reader. Return to the stable reading region instead.
    scroller.current?.focus({ preventScroll: true });
    setNote(entry);
  };
  const closeNote = () => {
    setNote(null);
  };

  return <main lang="ko" className={s.root} data-book-preview data-stage={stage} data-reduced-motion={reduced} style={{ "--cover": book.color, "--ink": book.ink } as CSSProperties} onKeyDown={keyboard}>
    <header className={s.header}><button className={s.wordmark} aria-label="결리포트 책장으로" onClick={closeBook}><b>결리포트</b><span>GYEOL REPORT</span></button>
      {stage === "home" ? <button className={s.login} onClick={() => { setMember(m => !m); setMessage(member ? "비회원 미리보기로 전환했습니다." : "회원 미리보기입니다. 실제 로그인은 하지 않습니다."); }}>{member ? "로그아웃" : "로그인"}</button> : <button className={s.close} aria-label="책 닫기" onClick={closeBook}>닫기 <span aria-hidden="true">×</span></button>}
    </header>
    {stage === "home" || stage === "opening-input" ? <>
      <section className={s.home} data-depart={stage === "opening-input"} inert={stage === "opening-input"} aria-label="여섯 권의 책 고르기" onPointerDown={pointerStart} onPointerUp={pointerEnd} onPointerCancel={() => { gesture.current = null; }} onPointerEnter={e => { if (e.pointerType === "mouse" && window.matchMedia("(hover: hover)").matches) setHovered(true); }} onPointerLeave={() => setHovered(false)} onWheel={e => { if (Math.abs(e.deltaX) > 20 && Math.abs(e.deltaX) > Math.abs(e.deltaY) && e.timeStamp - wheelTime.current > 500) { wheelTime.current = e.timeStamp; select(current + Math.sign(e.deltaX)); } }}>
        <h1 className={s.srOnly}>나에 관한 한 권을 고르세요</h1>
        <div className={s.coverflow} role="group" aria-label="책 표지" aria-roledescription="회전 책장">
          {BOOKS.map((b, i) => { const offset = coverOffset(i, current); return <button key={b.id} className={s.bookSlot} style={{ "--offset": offset, "--distance": Math.abs(offset), zIndex: 10 - Math.abs(offset) } as CSSProperties} data-center={i === current} aria-label={`${b.title.replace("\n", " ")}${i === current ? " 펼치기" : " 선택"}`} aria-current={i === current ? "true" : undefined} tabIndex={Math.abs(offset) < 3 ? 0 : -1} onClick={() => { if (dragged.current) return; if (i === current) begin(); else select(i); }}><Cover book={b} /></button>; })}
        </div>
        <div className={s.carouselControls}><button onClick={previous} aria-label="이전 책">←</button><span className={s.micro} aria-live="polite">{book.issue} / 06</span><button onClick={next} aria-label="다음 책">→</button></div>
      </section>{stage === "home" ? <><details className={s.fixtureSelector}><summary>개발 검수 입력 · {data.names}</summary><p>기존 V4 검증 입력으로 생성한 실제 책입니다. 기준일 {data.readingDate}.</p><nav aria-label="검수 입력 선택">{library.fixtures.filter(f => f.bookId === book.id).map(f => <a key={f.id} href={`?fixture=${f.id}&book=${f.bookId}&read=1`}>{f.label} ↗</a>)}</nav><button onClick={() => { setPage(0); setStage("reader"); }}>현재 책 본문 바로 보기 →</button></details><PreviewFooter /></> : null}
    </> : null}
    {opening ? <div className={s.opening} aria-label="책 펼치는 중"><div className={s.openPaper}><span>GYEOL REPORT</span><span>당신의 이야기를<br />시작합니다.</span></div><div className={s.openCover}><Cover book={book} name={stage === "opening-reader" ? person.name : undefined} /></div></div> : null}
    {stage === "publishing" ? <Publishing book={book} name={person.name} state={PUBLISHING_STATES[publication]} /> : null}
    {stage === "complete" ? <section className={s.completed}><p className={s.micro}>PERSONAL EDITION / READY TO READ</p><button className={s.completedBook} onClick={() => { setPage(0); setStage("opening-reader"); }} aria-label="완성된 책 펼치기"><Cover book={book} title={data.title} name={data.names} /></button><h1>{data.names}님의 책이<br />준비되었습니다.</h1></section> : null}
    {["input", "receipt", "reader"].includes(stage) ? <section className={`${s.bookShell} ${stage === "reader" && pages[page].kind === "back" ? s.backShell : ""}`} onPointerDown={pointerStart} onPointerUp={pointerEnd} onPointerCancel={() => { gesture.current = null; }}>
      <div className={s.pageScroll} role="region" ref={scroller} tabIndex={-1} aria-label="책 내용" data-page={stage === "reader" ? pages[page].kind : stage} data-page-number={stage === "reader" ? page + 1 : undefined}>
        {stage === "input" ? <><p className={s.eyebrow}>검수 입력 / 기준일 {data.readingDate}</p><h1>이 책의 주인공</h1><BookInputSummary data={data} /><p className={s.hint}>선택한 검증 입력 그대로 만든 책입니다. 다른 입력은 책장의 검수 입력에서 선택할 수 있습니다.</p></> : null}
        {stage === "receipt" ? <Receipt book={book} title={data.title} person={{ ...person, time: person.precision === "approximate" ? person.timeLabel.replace("대략 · ", "") : person.time }} member={member} setMember={setMember} consents={consents} setConsents={setConsents} /> : null}
        {stage === "reader" ? <BookReader data={data} page={pages[page]} onNote={openNote} onShare={setMessage} onPage={target => animateTurn(target > page ? 1 : -1, () => setPage(target))} /> : null}
      </div>
      <div className={s.pageNav} aria-label="책 읽기 위치"><button onClick={previous} disabled={stage === "reader" && page === 0} aria-label="이전 페이지">←</button><span><strong>{data.title}</strong><span>{String(stage === "reader" ? page + 1 : stage === "receipt" ? 2 : 1).padStart(2, "0")} / {String(stage === "reader" ? pages.length : 2).padStart(2, "0")}</span></span>
        {stage === "receipt" ? <button className={s.orderButton} onClick={publish} disabled={!requiredConsents(member, person.birth).allowed || !requiredConsents(member, person.birth).items.every(c => consents[c.id])}>발행 체험 →</button> : stage === "reader" && page === pages.length - 1 ? <button onClick={closeBook}>책장 ↗</button> : <button onClick={next} aria-label="다음 페이지">→</button>}
      </div>
      {turn ? <div className={s.turnLeaf} data-direction={turn.direction} aria-hidden="true"><span>{turn.label}</span><div className={s.turnLines}><i /><i /><i /><i /></div></div> : null}
    </section> : null}
    {note !== null ? <DetailSheet title={note.name} onClose={closeNote} closeLabel="각주 닫기"><div className={s.noteCopy}><p>{note.text}</p></div></DetailSheet> : null}
    {message ? <div className={s.toast} role="status"><span>{message}</span><button onClick={() => setMessage("")} aria-label="안내 닫기">×</button></div> : null}
  </main>;
}
