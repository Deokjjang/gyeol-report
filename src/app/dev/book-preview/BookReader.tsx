import { readableBookText } from "../../../lib/book/readerCopy";
import { Cover, MbtiPage, NatalTable, ShareIcon } from "./BookPages";
import { BOOKS } from "./model";
import type { BookData, BookNote, BookPage, BookPerson, BookTimelineCard } from "./bookTypes";
import s from "./book.module.css";
import type { CSSProperties, ReactNode } from "react";
import { PeriodGanji } from "./BookPeriodData";
import GLOSSARY from "../../../data/book-pages/glossary.json";

const DATE = /(\d{4})\D+(\d{1,2})\D+(\d{1,2})/;
/** 양력 표기. 입력은 양력만 받는다. */
const solarDate = (birth: string) => { const m = birth.match(DATE); return m ? `${m[1]}년 ${Number(m[2])}월 ${Number(m[3])}일 (양력)` : birth; };
/** 태양시 보정 한 줄: "태양시 보정 −30분 → 09:00 기준 계산". 정확한 시각일 때만 계산 기준 시각을 함께 쓴다. */
function correctionLine(p: BookPerson) {
  const note = p.table.manse.timeCorrectionNote;
  if (!note || p.precision === "unknown") return null;
  const m = note.match(/([-−+])?\s?(\d+)\s?분/), t = p.time.match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return note;
  const minutes = (m[1] === "-" || m[1] === "−" ? -1 : 1) * Number(m[2]);
  if (p.precision !== "exact" || !t) return `태양시 보정 ${minutes < 0 ? "−" : "+"}${Math.abs(minutes)}분 적용`;
  const total = ((Number(t[1]) * 60 + Number(t[2]) + minutes) % 1440 + 1440) % 1440;
  return `태양시 보정 ${minutes < 0 ? "−" : "+"}${Math.abs(minutes)}분 → ${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")} 기준 계산`;
}
const timeText = (p: BookPerson) => p.precision === "unknown" ? "모름" : p.precision === "approximate" ? `${p.timeLabel.replace(/^대략\s*·\s*/, "")} (대략)` : p.time || p.timeLabel;

export function BookInputSummary({ data }: { data: BookData }) {
  return <><div className={s.personSpread} data-pair={data.people.length === 2}>{data.people.map(p => { const fix = correctionLine(p); return <section key={p.role}>{data.people.length > 1 ? <p className={s.micro}>{p.role}</p> : null}<h2>{p.name}</h2><dl className={s.coreSummary}>
    <div><dt>생년월일</dt><dd>{solarDate(p.birth)}</dd></div><div><dt>태어난 시각</dt><dd>{timeText(p)}{fix ? <small>{fix}</small> : null}</dd></div><div><dt>MBTI</dt><dd>{p.mbti || "모름"}</dd></div>
    <div><dt>성별</dt><dd>{p.gender === "FEMALE" ? "여성" : p.gender === "MALE" ? "남성" : "선택 안 함"}</dd></div>
  </dl></section>; })}</div>{data.context.some(c => c.value) ? <dl className={s.coreSummary}>{data.context.filter(c => c.value).map(c => <div key={c.label}><dt>{c.label.replace(/^현재\s/, "")}</dt><dd>{c.value}</dd></div>)}</dl> : null}</>;
}

/** 목차·쪽 머리글의 장 번호: 본문 장과 연대표 쪽만 센다(표·주인공·부록 쪽은 번호 없음). 대운·세운 연·월 본문은 장으로 세지 않는다. */
function chapterNumbers(data: BookData) {
  const keyed = new Set((data.timeline ?? []).map(c => c.page));
  const numbers = new Map<number, number>();
  data.pages.forEach((p, i) => { if ((p.kind === "narrative" && !keyed.has(i)) || p.kind === "timeline" || p.kind === "months") numbers.set(i, numbers.size + 1); });
  return numbers;
}

const TERMS = GLOSSARY.terms as unknown as Record<string, [string, string, string] | undefined>;
/** 부록 항목: "쉬운 이름(용어 漢字) + 이미지 한 줄". 지식 DB에 없는 항목은 저장된 설명을 그대로 쓴다. */
function glossaryEntry(name: string, meaning: string) {
  const term = name.replace(/^[甲乙丙丁戊己庚辛壬癸]\s+/, "").trim();
  const hit = TERMS[term];
  return hit ? { title: hit[0], term: `${name} ${hit[1]}`, line: hit[2] } : { title: name, term: "", line: meaning };
}

function TimelineCards({ cards, onPage }: { cards: BookTimelineCard[]; onPage: (page: number) => void }) {
  const hanja = (c: BookTimelineCard) => <><span data-element={c.ganji.stem}>{c.ganji.hanja[0]}</span><span data-element={c.ganji.branch}>{c.ganji.hanja[1]}</span></>;
  return <>
    <div className={s.timelineStrip} role="list" aria-label="한눈에 보는 흐름">{cards.map(c => <button key={c.key} role="listitem" aria-current={c.now ? "date" : undefined} onClick={() => onPage(c.page)} aria-label={`${c.heading} ${c.ganji.hangul}${c.now ? " (지금)" : ""} 본문으로`}><span>{c.kind === "year" ? c.heading.replace("년", "") : c.heading.replace(/일부터$/, "일")}</span><b>{hanja(c)}</b></button>)}</div>
    <ol className={s.cards}>{cards.map(c => <li key={c.key} className={s.card} data-now={c.now}><button onClick={() => onPage(c.page)}>
      <span className={s.cardHead}><span>{c.heading}{c.now ? <em>{c.kind === "year" ? "올해" : "이번 달"}</em> : null}{c.transition ? <em>새 대운</em> : null}</span><span>{c.sub}</span></span>
      <span className={s.cardGanji}><b>{hanja(c)}</b><span>{c.ganji.hangul} · {c.tenGod.stem.replace(/\(.*\)/, "")} / {c.tenGod.branch.replace(/\(.*\)/, "")}</span></span>
      {c.badges.length ? <span className={s.badges}>{c.badges.map(b => <span key={b.label} data-tone={b.tone}><b>{b.label}</b>{b.line}</span>)}</span> : null}
      <span className={s.flow}><span>흐름 세기</span><span className={s.flowBar} aria-hidden="true">{[1, 2, 3, 4, 5].map(i => <i key={i} data-on={i <= c.flow.score} />)}</span><span>{c.flow.label} · 참고</span></span>
      <span className={s.cardText}>{c.keywords.join(" · ")}<small>{c.action}</small></span>
    </button></li>)}</ol>
  </>;
}

export function BookReader({ data, page, onNote, onShare, onPage, backAction, shareActions }: { data: BookData; page: BookPage; onNote: (note: BookNote) => void; onShare: (text: string) => void; onPage: (page: number, anchor?: string) => void; backAction?: ReactNode; shareActions?: ReactNode }) {
  const book = BOOKS.find(b => b.id === data.bookId)!;
  const text = (value: string) => readableBookText(value, data.people.map(p => p.name));
  const index = data.pages.indexOf(page), numbers = chapterNumbers(data);
  if (page.kind === "contents") return <><p className={s.eyebrow}>{data.title}</p><h1>{text(page.title)}</h1><ol className={s.bookContents}>{page.entries.map(entry => { const n = numbers.get(entry.page); return <li key={entry.targetId}><button onClick={() => onPage(entry.page, entry.targetId)} data-target-chapter={entry.targetId}><span className={s.tocNo}>{n ?? ""}</span><span className={s.tocTitle}>{text(entry.title)}</span><span className={s.tocLeader} aria-hidden="true" /><span className={s.tocPage}>{entry.page + 1}</span></button></li>; })}</ol></>;
  if (page.kind === "score") {
    const parts = page.verdict.split(" · "), band = parts.length > 1 ? parts[0] : null;
    const lines = new Map((page.explanations ?? []).map(line => { const at = line.indexOf(": "); return [line.slice(0, at), line.slice(at + 2)] as const; }));
    const level = (v: number, max: number) => max === 3 ? ["", "조율", "보통", "좋음"][v] ?? `${v} / ${max}` : `${v} / ${max}`;
    return <><p className={s.eyebrow}>{data.names}</p><h1>{text(page.title)}</h1><p className={s.compatibilityScore}><strong>{page.total}</strong><span>/ 100</span></p>{band ? <p className={s.band}>{text(band)}</p> : null}
      <ul className={s.scoreBars}>{page.scores.map(score => <li key={score.label}><div>{score.label}<span>{level(score.value, score.max)}</span></div><span className={s.bar} aria-hidden="true"><i style={{ "--w": `${Math.round(score.value / score.max * 100)}%` } as CSSProperties} /></span>{lines.get(score.label) ? <p>{text(lines.get(score.label)!)}</p> : null}</li>)}</ul>
      <p className={s.profileLead}>{text(band ? parts.slice(1).join(" · ") : page.verdict)}</p><p className={s.hint} style={{ marginTop: 16 }}>{text(page.notice)}</p>
      {page.versionLabel || page.limitations.length ? <details className={s.periodDetails}><summary>지수를 읽는 기준</summary>{page.versionLabel ? <p>{text(page.versionLabel)}</p> : null}{page.limitations.map(line => <p key={line}>{line}</p>)}</details> : null}</>;
  }
  if (page.kind === "cover") return <div className={s.readerCover}><Cover book={book} title={data.title} name={data.names} /><h1 className={s.srOnly}>{data.title}</h1><p className={s.dedication}>{text(page.headline)}</p></div>;
  if (page.kind === "input") return <><h1>{text(page.title)}</h1><BookInputSummary data={data} /></>;
  if (page.kind === "manse") return <><h1 className={s.dataTitle}>{text(page.title)}</h1><NatalTable data={data.people[page.person].table} relations={data.people[page.person].relations} /></>;
  if (page.kind === "mbti") return <MbtiPage data={data.people[page.person].table.mbti} name={data.people[page.person].name} />;
  if (page.kind === "pair") return <><p className={s.eyebrow}>{page.category} · {data.names}</p><h1>{text(page.title)}</h1><BookInputSummary data={data} /><div className={s.pairPortraits}>{page.characters.map(p => <section key={p.name}><h2>{p.name}</h2><p>{text(p.core)}</p><p>{text(p.strength)}</p><p>{text(p.relationship)}</p></section>)}</div>
<p className={s.hint}>두 사람 사이의 기운 · {page.relations.join(" · ") || "서로에게 주는 영향"}</p><ol className={s.transitions}>{page.directions.map(d => <li key={text(d.title)}><button onClick={() => onPage(d.page)}><strong>{text(d.title)}</strong><span>{text(d.effect)}</span>{d.term && <small>{text(d.term)}</small>}</button></li>)}</ol></>;
  const cards = data.timeline?.filter(c => c.kind === (page.kind === "timeline" ? "year" : "month"));
  if (page.kind === "timeline") return <><p className={s.eyebrow}>{page.years.length ? `${page.years[0].year} — ${page.years.at(-1)!.year}` : cards?.length ? `${cards[0].heading} — ${cards.at(-1)!.heading}` : ""}</p><h1 className={s.chapterTitle}>{text(page.title)}</h1>
    {cards?.length ? <TimelineCards cards={cards} onPage={onPage} /> : <><p className={s.hint}>최근 3년 · 지금 · 앞으로 10년</p>
    <ol className={s.transitions}>{page.transitions.map((t, i) => <li key={i}><button onClick={() => onPage(t.page)}><strong>{text(t.date)}</strong><span>{text(t.before)} → {text(t.after)} · 전환 이야기</span></button>{t.exact && t.exact !== t.date ? <details className={s.periodDetails}><summary>계산 구간 보기</summary><p>{text(t.exact)}</p></details> : null}</li>)}</ol>
    <ol className={s.yearLedger}>{page.years.map(y => <li key={y.year} data-year={y.year} data-now={y.time === "지금"} data-impact={y.importance}><div><b>{y.year}</b><span>{y.age}세 · {y.time}</span></div><section><div className={s.periodPair}><span>대운 <PeriodGanji value={y.cycle} /></span><span>세운 <PeriodGanji value={y.annual} /></span></div><button onClick={() => onPage(y.page)}>{text(y.title)}</button><p>{text(y.theme)}</p><p className={s.hint}>좋은 힘 · {text(y.good)}</p>{y.caution ? <p className={s.hint}>살필 점 · {text(y.caution)}</p> : null}{y.transition ? <strong className={s.transitionLabel}>{text(y.transition)} · 대운 전환</strong> : null}</section></li>)}</ol></>}</>;
  if (page.kind === "months") return <><p className={s.eyebrow}>{data.title}</p><h1 className={s.chapterTitle}>{text(page.title)}</h1>
    {cards?.length ? <><p className={s.hint} style={{ marginBottom: 16 }}>절기로 달을 나눠요. 각 달은 표시한 날부터 시작합니다.</p><TimelineCards cards={cards} onPage={onPage} /></> : <>{page.map?.length ? <dl className={s.yearMap}>{page.map.map(group => <div key={group.label}><dt>{group.label}</dt><dd>{group.months.map(month => <button key={month} onClick={() => onPage(page.months.find(m => m.month === month)!.page)}>{month}월</button>)}</dd></div>)}</dl> : null}<p className={s.hint}>달력월과 절기월은 경계가 달라요. 현재 달은 지금 지나고 있는 구간을 먼저 보여줍니다.</p><ol className={s.monthLedger}>{page.months.map(m => <li key={m.month} data-month={m.month} data-now={m.time === "지금"} data-impact={m.importance}><div><b>{m.month}월</b><span>{m.time}</span></div><section><button onClick={() => onPage(m.page)}>{text(m.title)}</button><p>{text(m.theme)}</p><div className={s.periodPair}><PeriodGanji value={m.ganji} /><span>{m.gods}</span></div>{m.good ? <p className={s.hint}>좋은 힘 · {text(m.good)}</p> : null}{m.caution ? <p className={s.hint}>살필 점 · {text(m.caution)}</p> : null}{m.boundary ? <details className={s.periodDetails}><summary>{text(m.boundary.label)}</summary><p>{text(m.boundary.explanation)}</p></details> : null}{m.markers.length ? <p className={s.hint}>{m.markers.join(" · ")}</p> : null}</section></li>)}</ol></>}</>;
  if (page.kind === "appendix") {
    const groups = [...new Set(page.items.map(item => item.group ?? "명리 기운"))];
    return <><p className={s.eyebrow}>부록</p><h1>{text(page.title)}</h1><p className={s.hint}>이 책에 나온 기운 {page.total}개를 묶음별로 모았어요. 묶음을 누르면 펼쳐집니다. 자리는 만세력 쪽에서 볼 수 있어요.</p>
      <div className={s.glossaryGroups}>{groups.map((group, g) => { const items = page.items.filter(item => (item.group ?? "명리 기운") === group); return <details key={group} open={g === 0}><summary>{group}<span>{items.length}개</span></summary><ul className={s.glossary}>{items.map((item, i) => { const e = glossaryEntry(item.name, item.meaning); return <li key={i}><h2>{text(e.title)}{e.term ? <small>({e.term})</small> : null}{item.core ? <em>본문 핵심</em> : null}</h2><p>{text(e.line)}</p></li>; })}</ul></details>; })}</div></>;
  }
  if (page.kind === "back") return <div className={s.backContent}><h1>{data.title}</h1><p data-final-line>{text(page.finalLine)}</p>{shareActions ?? <section className={s.sharePreview} aria-label="이 책 공유하기 미리보기"><h2>이 책 공유하기</h2><p className={s.shareTitle}>{data.share.title}</p><div>{["카카오톡", "공유", "링크 복사"].map((label, i) => <button type="button" key={label} onClick={() => onShare(`${data.share.title} · ${label} 미리보기입니다. 실제 공유나 복사는 실행하지 않습니다.`)}><ShareIcon kind={i} /><span>{label}</span></button>)}</div></section>}{backAction}</div>;
  const titleLines = text(page.title).split("\n"), card = data.timeline?.find(c => c.page === index);
  const eyebrow = titleLines.length > 1 ? titleLines[0] : card ? `${card.heading} · ${card.ganji.hanja}(${card.ganji.hangul})` : numbers.has(index) ? `제${numbers.get(index)}장` : data.names;
  return <><p className={s.eyebrow}>{eyebrow}</p><h1 className={s.chapterTitle}>{titleLines.length > 1 ? titleLines.slice(1).join("\n") : titleLines[0]}</h1><div className={s.prose}>{page.paragraphs.map((p, i) => <section key={i} id={p.anchorId}>{p.heading ? <h2>{text(p.heading)}</h2> : null}<p data-narrative-paragraph>{text(p.text)}{p.notes.length ? " " : null}{[...new Set(p.notes)].filter(n => Number.isInteger(n) && n > 0 && page.notes[n - 1]).map(n => <sup key={n}><button type="button" onClick={() => onNote({ name: text(page.notes[n - 1].name), text: text(page.notes[n - 1].text) })} aria-label={`각주 ${n} ${page.notes[n - 1].name}`}>{n}</button></sup>)}</p></section>)}</div>
    {page.notes.length ? <section className={s.chapterNotes} aria-label="이 장의 각주"><ol>{page.notes.map((note, i) => <li key={i} value={i + 1}><div><strong>{text(note.name)}</strong>{" "}<p>{text(note.text)}</p></div></li>)}</ol></section> : null}</>;
}
