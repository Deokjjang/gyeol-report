import { Cover, MbtiPage, NatalTable, ShareIcon } from "./BookPages";
import { BOOKS } from "./model";
import type { BookData, BookNote, BookPage } from "./bookTypes";
import s from "./book.module.css";
import type { ReactNode } from "react";

export function BookInputSummary({ data }: { data: BookData }) {
  return <><div className={s.personSpread} data-pair={data.people.length === 2}>{data.people.map(p => <section key={p.role}><p className={s.micro}>{p.role}</p><h2>{p.name}</h2><dl className={s.coreSummary}>
    <div><dt>생년월일</dt><dd>{p.birth}</dd></div><div><dt>출생시간</dt><dd>{p.timeLabel}</dd></div><div><dt>MBTI</dt><dd>{p.mbti || "모름"}</dd></div>
    <div><dt>성별</dt><dd>{p.gender === "FEMALE" ? "여성" : p.gender === "MALE" ? "남성" : "미선택"}</dd></div>
  </dl></section>)}</div><dl className={s.coreSummary}>{data.context.filter(c => c.value).map(c => <div key={c.label}><dt>{c.label}</dt><dd>{c.value}</dd></div>)}</dl></>;
}

export function BookReader({ data, page, onNote, onShare, onPage, backAction }: { data: BookData; page: BookPage; onNote: (note: BookNote) => void; onShare: (text: string) => void; onPage: (page: number) => void; backAction?: ReactNode }) {
  const book = BOOKS.find(b => b.id === data.bookId)!;
  if (page.kind === "cover") return <div className={s.readerCover}><Cover book={book} title={data.title} name={data.names} /><h1>{page.headline}</h1></div>;
  if (page.kind === "input") return <><p className={s.eyebrow}>PERSONAL EDITION</p><h1>{page.title}</h1><BookInputSummary data={data} /></>;
  if (page.kind === "manse") return <><p className={s.eyebrow}>{data.people[page.person].timeLabel}</p><h1 className={s.dataTitle}>{page.title}</h1><NatalTable data={data.people[page.person].table} /></>;
  if (page.kind === "mbti") return <MbtiPage data={data.people[page.person].table.mbti} name={data.people[page.person].name} />;
  if (page.kind === "pair") return <><p className={s.eyebrow}>{page.category} · {data.names}</p><h1>{page.title}</h1><BookInputSummary data={data} /><div className={s.pairPortraits}>{page.characters.map(p => <section key={p.name}><h2>{p.name}</h2><p>{p.core}</p><p>{p.strength}</p><p>{p.relationship}</p></section>)}</div>
    <p className={s.hint}>두 사람 사이의 기운 · {page.relations.join(" · ") || "서로에게 주는 영향"}</p><ol className={s.transitions}>{page.directions.map(d => <li key={d.title}><button onClick={() => onPage(d.page)}><strong>{d.title} ↗</strong><span>{d.effect}</span></button></li>)}</ol></>;
  if (page.kind === "timeline") return <><p className={s.eyebrow}>{page.years[0].year} — {page.years.at(-1)!.year}</p><h1>{page.title}</h1><p className={s.hint}>최근 3년 · 지금 · 앞으로 10년</p>
    <ol className={s.transitions}>{page.transitions.map((t, i) => <li key={i}><button onClick={() => onPage(t.page)}><strong>{t.date}</strong><span>{t.before} → {t.after} · 전환 이야기 ↗</span></button></li>)}</ol>
    <ol className={s.yearLedger}>{page.years.map(y => <li key={y.year} data-year={y.year} data-now={y.time === "지금"}><div><b>{y.year}</b><span>{y.age}세 · {y.time}</span></div><section><p className={s.hint}>대운 {y.cycle} · 세운 {y.annual}</p><button onClick={() => onPage(y.page)}>{y.title} ↗</button><p>{y.theme}</p><p className={s.hint}>좋은 힘 · {y.good}</p>{y.caution ? <p className={s.hint}>살필 점 · {y.caution}</p> : null}{y.transition ? <strong className={s.transitionLabel}>{y.transition} · 대운 전환</strong> : null}</section></li>)}</ol></>;
  if (page.kind === "months") return <><p className={s.eyebrow}>{data.title}</p><h1>{page.title}</h1><ol className={s.monthLedger}>{page.months.map(m => <li key={m.month} data-month={m.month} data-now={m.time === "지금"}><div><b>{m.month}월</b><span>{m.time}</span></div><section><button onClick={() => onPage(m.page)}>{m.title} ↗</button><p>{m.theme}</p><p className={s.hint}>{m.ganji} · {m.gods}</p>{m.markers.length ? <p className={s.hint}>{m.markers.join(" · ")}</p> : null}</section></li>)}</ol></>;
  if (page.kind === "appendix") return <><p className={s.eyebrow}>APPENDIX · {page.from}–{page.from + page.items.length - 1} / {page.total}</p><h1>{page.title}</h1><ol start={page.from} className={s.glossary}>{page.items.map((item, i) => <li key={i}><span className={s.micro}>{String(page.from + i).padStart(2, "0")}</span><div>{data.people.length > 1 ? <small>{item.person}</small> : null}<h2>{item.name}</h2><p>{item.meaning}</p><p>{item.manifestation}</p></div></li>)}</ol></>;
  if (page.kind === "back") return <div className={s.backContent}><span className={s.micro}>PERSONAL EDITION / FIN</span><h1>{data.title}</h1><p data-final-line>{page.finalLine}</p><section className={s.sharePreview} aria-label="이 책 공유하기 미리보기"><h2>이 책 공유하기</h2><p className={s.shareTitle}>{data.share.title}</p><div>{["카카오톡", "공유", "링크 복사"].map((label, i) => <button type="button" key={label} onClick={() => onShare(`${data.share.title} · ${label} 미리보기입니다. 실제 공유나 복사는 실행하지 않습니다.`)}><ShareIcon kind={i} /><span>{label}</span></button>)}</div></section>{backAction}<span className={s.micro}>END OF BOOK</span></div>;
  const titleLines = page.title.split("\n");
  return <><p className={s.eyebrow}>{titleLines.length > 1 ? titleLines[0] : `PERSONAL EDITION / ${data.names}`}</p><h1>{titleLines.length > 1 ? titleLines.slice(1).join("\n") : page.title}</h1><div className={s.prose}>{page.paragraphs.map((p, i) => <p key={i} data-narrative-paragraph>{p.text}{p.notes.map(n => <sup key={n}><button type="button" onClick={() => onNote(page.notes[n - 1])} aria-label={`각주 ${n} ${page.notes[n - 1].name}`}>{n}</button></sup>)}</p>)}</div>
    {page.notes.length ? <section className={s.chapterNotes} aria-label="이 장의 각주"><ol>{page.notes.map((note, i) => <li key={i}><span>{i + 1}.</span><div><strong>{note.name}</strong><p>{note.text}</p></div></li>)}</ol></section> : null}</>;
}
