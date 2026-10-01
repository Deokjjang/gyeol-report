"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent, type KeyboardEvent } from "react";
import { Cover, PersonFields, MbtiField, Receipt, Publishing, ReaderContent, PreviewFooter } from "./BookPages";
import { BOOKS, PUBLISHING_STATES, INITIAL_PERSON, JOBS, RELATIONSHIPS, CATEGORIES, NOTES, coverOffset, wrapBook, inputPageCount, readerPages, requiredConsents, roleNames, type Person } from "./model";
import fixture from "./fixture.json";
import s from "./book.module.css";

type Stage = "home" | "opening-input" | "input" | "receipt" | "publishing" | "complete" | "opening-reader" | "reader";
const pages = readerPages(fixture.chapters.length);
const isField = (target: EventTarget) => target instanceof Element && Boolean(target.closest("input,select,textarea,a,button"));

export default function BookPreview() {
  const [stage, setStage] = useState<Stage>("home");
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [inputPage, setInputPage] = useState(0);
  const [person, setPerson] = useState<Person>(INITIAL_PERSON);
  const [other, setOther] = useState<Person>({ ...INITIAL_PERSON, name: "유나", birth: "1993-10-17", time: "13:20", mbti: "INFJ" });
  const [job, setJob] = useState("employee");
  const [detail, setDetail] = useState("B2B SaaS 영업기획");
  const [relationship, setRelationship] = useState("dating");
  const [category, setCategory] = useState("love");
  const [year, setYear] = useState("2026");
  const [member, setMember] = useState(false);
  const [consents, setConsents] = useState<Record<string, boolean>>({});
  const [publication, setPublication] = useState(0);
  const [page, setPage] = useState(0);
  const [turn, setTurn] = useState<null | { direction: number; label: string }>(null);
  const [note, setNote] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const form = useRef<HTMLFormElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const noteDialog = useRef<HTMLDialogElement>(null);
  const gesture = useRef<{ x: number; y: number } | null>(null);
  const wheelTime = useRef(0);
  const dragged = useRef(false);
  const turnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const book = BOOKS[current];
  const opening = stage === "opening-input" || stage === "opening-reader";

  useEffect(() => {
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(q.matches);
    sync(); q.addEventListener("change", sync);
    return () => { q.removeEventListener("change", sync); if (turnTimer.current) clearTimeout(turnTimer.current); };
  }, []);
  useEffect(() => {
    if (stage !== "home" || paused || hovered || focused || reduced) return;
    const id = setInterval(() => { if (!document.hidden) setCurrent(c => wrapBook(c + 1)); }, 6500);
    return () => clearInterval(id);
  }, [stage, paused, hovered, focused, reduced]);
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
  }, [stage, inputPage, page]);
  useEffect(() => {
    if (note !== null) noteDialog.current?.showModal();
    else noteDialog.current?.close();
  }, [note]);

  const select = (index: number) => { setPaused(true); setCurrent(wrapBook(index)); };
  const animateTurn = (direction: number, action: () => void) => {
    if (turn) return;
    setTurn({ direction, label: stage === "reader" ? "GYEOL REPORT / PERSONAL EDITION" : "GYEOL REPORT / YOUR STORY" });
    action();
    turnTimer.current = setTimeout(() => setTurn(null), reduced ? 20 : 510);
  };
  const next = () => {
    if (stage === "home") select(current + 1);
    else if (stage === "input" && form.current?.reportValidity()) animateTurn(1, () => inputPage + 1 < inputPageCount(book.id) ? setInputPage(p => p + 1) : setStage("receipt"));
    else if (stage === "reader" && page < pages.length - 1) animateTurn(1, () => setPage(p => p + 1));
  };
  const previous = () => {
    if (stage === "home") select(current - 1);
    else if (stage === "input") { if (inputPage > 0) animateTurn(-1, () => setInputPage(p => p - 1)); else setStage("home"); }
    else if (stage === "receipt") animateTurn(-1, () => setStage("input"));
    else if (stage === "reader" && page > 0) animateTurn(-1, () => setPage(p => p - 1));
  };
  const keyboard = (event: KeyboardEvent) => {
    if (event.target instanceof Element && event.target.closest("input,select,textarea")) return;
    if (event.key === "ArrowRight") { event.preventDefault(); next(); }
    if (event.key === "ArrowLeft") { event.preventDefault(); previous(); }
  };
  const pointerStart = (e: PointerEvent) => {
    dragged.current = false;
    if (stage !== "home" && isField(e.target)) return;
    gesture.current = { x: e.clientX, y: e.clientY };
  };
  const pointerEnd = (e: PointerEvent) => {
    const start = gesture.current; gesture.current = null;
    if (!start) return;
    const x = e.clientX - start.x, y = e.clientY - start.y;
    if (Math.abs(x) > 45 && Math.abs(x) > Math.abs(y) * 1.5) { dragged.current = true; if (x < 0) next(); else previous(); }
  };
  const begin = () => { setPaused(true); setInputPage(0); setConsents({}); setStage("opening-input"); };
  const publish = () => {
    const gate = requiredConsents(member, person.birth);
    if (!gate.allowed || !gate.items.every(c => consents[c.id])) return;
    setPublication(0); setStage("publishing");
  };
  const closeBook = () => { setStage("home"); setMessage(""); setPaused(true); };

  return <main lang="ko" className={s.root} data-book-preview data-stage={stage} data-reduced-motion={reduced} style={{ "--cover": book.color, "--ink": book.ink } as CSSProperties} onKeyDown={keyboard}>
    <header className={s.header}><button className={s.wordmark} aria-label="결리포트 책장으로" onClick={closeBook}><b>결리포트</b><span>GYEOL REPORT</span></button>
      {stage === "home" ? <button className={s.login} onClick={() => { setMember(m => !m); setMessage(member ? "비회원 미리보기로 전환했습니다." : "회원 미리보기입니다. 실제 로그인은 하지 않습니다."); }}>{member ? "로그아웃" : "로그인"}</button> : <button className={s.close} aria-label="책 닫기" onClick={closeBook}>닫기 <span aria-hidden="true">×</span></button>}
    </header>
    {stage === "home" || stage === "opening-input" ? <>
      <section className={s.home} data-depart={stage === "opening-input"} inert={stage === "opening-input"} aria-label="여섯 권의 책 고르기" onPointerDown={pointerStart} onPointerUp={pointerEnd} onPointerCancel={() => { gesture.current = null; }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocus={() => setFocused(true)} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false); }} onWheel={e => { if (Math.abs(e.deltaX) > 20 && Math.abs(e.deltaX) > Math.abs(e.deltaY) && Date.now() - wheelTime.current > 500) { wheelTime.current = Date.now(); select(current + Math.sign(e.deltaX)); } }}>
        <h1 className={s.srOnly}>나에 관한 한 권을 고르세요</h1>
        <div className={s.coverflow} role="group" aria-label="책 표지" aria-roledescription="회전 책장">
          {BOOKS.map((b, i) => { const offset = coverOffset(i, current); return <button key={b.id} className={s.bookSlot} style={{ "--offset": offset, "--distance": Math.abs(offset), zIndex: 10 - Math.abs(offset) } as CSSProperties} data-center={i === current} aria-label={`${b.title.replace("\n", " ")}${i === current ? " 펼치기" : " 선택"}`} aria-current={i === current ? "true" : undefined} tabIndex={Math.abs(offset) < 3 ? 0 : -1} onClick={() => { if (dragged.current) return; if (i === current) begin(); else select(i); }}><Cover book={b} /></button>; })}
        </div>
        <div className={s.carouselControls}><button onClick={previous} aria-label="이전 책">←</button><span className={s.micro} aria-live="polite">{book.issue} / 06</span><button onClick={next} aria-label="다음 책">→</button></div>
        <button className={s.autoControl} onClick={() => setPaused(p => !p)} aria-label={paused ? "책 자동 회전 켜기" : "책 자동 회전 멈춤"}>{paused ? "▷" : "Ⅱ"}</button>
      </section>{stage === "home" ? <PreviewFooter /> : null}
    </> : null}
    {opening ? <div className={s.opening} aria-label="책 펼치는 중"><div className={s.openPaper}><span>GYEOL REPORT</span><span>당신의 이야기를<br />시작합니다.</span></div><div className={s.openCover}><Cover book={book} name={stage === "opening-reader" ? person.name : undefined} /></div></div> : null}
    {stage === "publishing" ? <Publishing book={book} name={person.name} state={PUBLISHING_STATES[publication]} /> : null}
    {stage === "complete" ? <section className={s.completed}><p className={s.micro}>PERSONAL EDITION / READY TO READ</p><button className={s.completedBook} onClick={() => { setPage(0); setStage("opening-reader"); }} aria-label="완성된 책 펼치기"><Cover book={book} name={person.name} /></button><h1>{person.name}님의 책이<br />완성되었습니다.</h1><p className={s.hint}>독서 화면은 서진의 V4 샘플입니다.</p></section> : null}
    {["input", "receipt", "reader"].includes(stage) ? <section className={`${s.bookShell} ${stage === "reader" && pages[page] === "back" ? s.backShell : ""}`} onPointerDown={pointerStart} onPointerUp={pointerEnd} onPointerCancel={() => { gesture.current = null; }}>
      <div className={s.pageScroll} role="region" ref={scroller} tabIndex={-1} aria-label="책 내용" data-page={stage === "reader" ? pages[page] : `${stage}-${inputPage}`}>
        {stage === "input" ? <form ref={form} onSubmit={e => { e.preventDefault(); next(); }}>
          <p className={s.eyebrow}>PERSONAL EDITION / {String(inputPage + 1).padStart(2, "0")}</p><h1>{inputPage === 0 ? "이 책의 주인공" : inputPage === 1 ? "지금의 나" : book.id === "compatibility" ? "함께 쓰는 이야기" : book.id === "annual" ? "기억하고 싶은 해" : "지금, 사랑은"}</h1>
          <p className={s.hint}>입력 체험용 · 정보는 저장하거나 전송하지 않습니다.</p>
          {inputPage === 0 ? <PersonFields person={person} onChange={setPerson} prefix="person" label={book.id === "compatibility" ? roleNames(category)[0] : "주인공"} /> : null}
          {inputPage === 1 ? <div className={s.fields}><MbtiField value={person.mbti} onChange={mbti => setPerson({ ...person, mbti })} /><label htmlFor="job">현재 상태<select id="job" value={job} onChange={e => setJob(e.target.value)}>{JOBS.map(([v, l]) => <option value={v} key={v}>{l}</option>)}</select></label><label htmlFor="detail-job" className={s.wide}>지금 하는 일<input id="detail-job" value={detail} maxLength={200} onChange={e => setDetail(e.target.value)} /></label>{book.id === "compatibility" ? <label className={s.wide} htmlFor="category">두 사람의 관계<select id="category" value={category} onChange={e => setCategory(e.target.value)}>{CATEGORIES.map(([v, l]) => <option value={v} key={v}>{l}</option>)}</select></label> : null}</div> : null}
          {inputPage === 2 && book.id === "love" ? <div className={s.fields}><label className={s.wide} htmlFor="relationship">현재 관계<select id="relationship" value={relationship} onChange={e => setRelationship(e.target.value)}>{RELATIONSHIPS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label></div> : null}
          {inputPage === 2 && book.id === "annual" ? <div className={s.fields}><label className={s.wide} htmlFor="year">선택 연도<select id="year" value={year} onChange={e => setYear(e.target.value)}>{[2025, 2026, 2027].map(v => <option key={v}>{v}</option>)}</select></label><p className={s.hint}>표지와 본문은 2026 디자인 샘플입니다.</p></div> : null}
          {inputPage === 2 && book.id === "compatibility" ? <><p className={s.hint}>{roleNames(category)[0]} · {person.name} / {roleNames(category)[1]} · {other.name}</p><PersonFields person={other} onChange={setOther} prefix="other" label={roleNames(category)[1]} /><div className={s.fields}><MbtiField id="other-mbti" value={other.mbti} onChange={mbti => setOther({ ...other, mbti })} /></div></> : null}
          <button type="submit" className={s.srOnly}>입력 다음 페이지</button>
        </form> : null}
        {stage === "receipt" ? <Receipt book={book} person={person} member={member} setMember={setMember} consents={consents} setConsents={setConsents} /> : null}
        {stage === "reader" ? <ReaderContent page={pages[page]} onNote={setNote} onShare={setMessage} /> : null}
      </div>
      <div className={s.pageNav}><button onClick={previous} disabled={stage === "reader" && page === 0} aria-label="이전 페이지">←</button><span className={s.micro}>GYEOL REPORT<span>{String(stage === "reader" ? page + 1 : inputPage + 1).padStart(2, "0")} / {String(stage === "reader" ? pages.length : inputPageCount(book.id)).padStart(2, "0")}</span></span>
        {stage === "receipt" ? <button className={s.orderButton} onClick={publish} disabled={!requiredConsents(member, person.birth).allowed || !requiredConsents(member, person.birth).items.every(c => consents[c.id])}>발행 체험 →</button> : stage === "reader" && page === pages.length - 1 ? <button onClick={closeBook}>책장 ↗</button> : <button onClick={next} aria-label="다음 페이지">→</button>}
      </div>
      {turn ? <div className={s.turnLeaf} data-direction={turn.direction} aria-hidden="true"><span>{turn.label}</span><div className={s.turnLines}><i /><i /><i /><i /></div></div> : null}
    </section> : null}
    <dialog className={s.noteDialog} ref={noteDialog} onCancel={() => setNote(null)} onClose={() => setNote(null)} onClick={e => { if (e.target === e.currentTarget) setNote(null); }} aria-labelledby="note-title">
      {note !== null ? <div><div className={s.noteTop}><span className={s.micro}>FOOTNOTE / 0{note + 1}</span><button onClick={() => setNote(null)} aria-label="각주 닫기">×</button></div><h2 id="note-title">{NOTES[note].name}</h2><p>{NOTES[note].image}</p><p>{NOTES[note].text}</p></div> : null}
    </dialog>
    {message ? <div className={s.toast} role="status"><span>{message}</span><button onClick={() => setMessage("")} aria-label="안내 닫기">×</button></div> : null}
  </main>;
}
