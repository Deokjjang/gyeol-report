/**
 * AM2-3 5부(덕짱님과 정한 시안) — 세운·대운 화면: 흐름표 · 앞으로 10년표 · 달·해 카드 · 평생 대운 지도 띠.
 * 색은 오행 칸에만(목 초록 · 화 빨강 · 토 황토 · 금 은회색 · 수 남색, 밝은 바탕 + 진한 글씨 / 다크는 진한 바탕 + 연한 글씨).
 * 흐름 점·오름·살필·지금·★은 흑백 + 글자(색만으로 뜻을 전하지 않는다). 간지는 한자를 오행 색 칸으로.
 */
import type { ReactNode } from "react";
import type { AmEl, AmRow, BookPage } from "./bookTypes";
import a from "./bookAm.module.css";

const EL_KO: Readonly<Record<AmEl, string>> = { wood: "목", fire: "화", earth: "토", metal: "금", water: "수" };
/** 간지 칸: 한자를 오행 색 칸에(글자 옆 작은 오행 이름 — 색만으로 뜻을 전하지 않는다). */
export function ElCells({ ganji, els, big }: { ganji: string; els: readonly AmEl[]; big?: boolean }) {
  return <span className={a.cells} data-big={big ? "" : undefined}>{[...ganji].slice(0, 2).map((ch, i) => <span key={i} className={a.cell} data-el={els[i]} title={EL_KO[els[i]]}><b>{ch}</b><small>{EL_KO[els[i]]}</small></span>)}</span>;
}
/** 흐름: 점 5개 + 단어(잔잔·느림·보통·활발·거셈). */
export function FlowDots({ value, word }: { value: number; word: string }) {
  return <span className={a.flow} role="img" aria-label={`흐름 ${word}`}><span aria-hidden="true">{[1, 2, 3, 4, 5].map(i => <i key={i} data-on={i <= value} />)}</span><b>{word}</b></span>;
}
const Signals = ({ ups, cautions }: { ups: readonly string[]; cautions: readonly string[] }) => (ups.length || cautions.length ? <span className={a.signals}>{ups.map(x => <span key={`u${x}`} data-sig="up">{x} 오름</span>)}{cautions.map(x => <span key={`c${x}`} data-sig="watch">{x} 살필</span>)}</span> : null);

function Rows({ rows, onPage, text }: { rows: readonly AmRow[]; onPage: (p: number) => void; text: (v: string) => string }) {
  return <ol className={a.rows}>{rows.map(r => <li key={r.key} data-now={r.now ? "" : undefined} data-past={r.past ? "" : undefined}>
    {r.divider ? <p className={a.divider} role="separator">{text(r.divider)}</p> : null}
    <button type="button" onClick={() => onPage(r.page)} className={a.row} aria-label={`${r.name} 카드 열기`}>
      <span className={a.when}><b>{r.name}{r.star ? <span className={a.star} aria-label="가장 오르는 때">{"\u00a0★"}</span> : null}</b><small>{r.sub}{r.now ? <em className={a.nowTag}>지금</em> : null}</small></span>
      <ElCells ganji={r.ganji} els={r.els} />
      <span className={a.main}><span className={a.line}>{text(r.line)}</span><span className={a.gods}>하늘 {r.sky} · 땅 {r.ground}<Signals ups={r.ups} cautions={r.cautions} /></span></span>
      <FlowDots value={r.flow} word={r.flowWord} />
    </button></li>)}</ol>;
}
const Dict = ({ dict }: { dict: readonly { name: string; line: string }[] }) => (dict.length ? <dl className={a.dict}>{dict.map(x => <div key={x.name}><dt>{x.name}</dt><dd>{x.line}</dd></div>)}</dl> : null);

export function AmPage({ page, title, onPage, text }: { page: BookPage; title: string; onPage: (p: number) => void; text: (v: string) => string }): ReactNode {
  if (page.kind === "flowTable") {
    const y = page.year, max = Math.max(1, ...page.elements.map(e => e.count));
    return <section className={a.am} data-am="flow-table"><p className={a.eyebrow}>{title}</p><h1>{text(page.title)}</h1>
      {y ? <div className={a.yearHead}><ElCells ganji={y.ganji} els={y.els} big /><div><p className={a.yearName}><b>{y.name}</b>{y.verdict ? ` · ${y.verdict}` : ""}</p>
        <p className={a.yearGods}>하늘 <b>{y.sky}</b> {y.skyLine ? `— ${y.skyLine}` : ""}</p><p className={a.yearGods}>땅 <b>{y.ground}</b> {y.groundLine ? `— ${y.groundLine}` : ""}</p><FlowDots value={y.flow} word={y.flowWord} /></div></div> : null}
      {page.elements.some(e => e.count) ? <section className={a.elBar} aria-label="내 오행"><h2>내 오행과 {y ? `${y.name}에` : "이 해에"} 들어오는 기운</h2>
        <ul>{page.elements.map(e => <li key={e.el}><span className={a.elName} data-el={e.el}>{e.label}</span><span className={a.bar} aria-hidden="true"><i data-el={e.el} style={{ width: `${Math.round(e.count / max * 100)}%` }} /></span><span className={a.count}>{e.count}{e.incoming ? <em> · 들어옴</em> : null}</span></li>)}</ul>
        <p className={a.hint}>막대는 태어난 사주에 보이는 오행 글자 수예요. 「들어옴」은 이 해의 하늘·땅 글자가 가진 오행이에요.</p></section> : null}
      <p className={a.hint}>줄을 누르면 그 달 카드로 가요. ★은 흐름이 가장 오르는 달, 「지금」은 오늘이 든 달이에요.</p>
      <Rows rows={page.rows} onPage={onPage} text={text} /><Dict dict={page.dict} /></section>;
  }
  if (page.kind === "decadeTable") return <section className={a.am} data-am="decade-table"><p className={a.eyebrow}>{title}</p><h1>{text(page.title)}</h1><p className={a.hint}>{text(page.head)} · ★은 이 10년에서 눈여겨볼 해예요. 줄을 누르면 그 해 카드로 가요.</p>
    <Rows rows={page.rows} onPage={onPage} text={text} /><Dict dict={page.dict} /></section>;
  if (page.kind === "periodCard") return <article className={a.am} data-am="period-card" data-past={page.past ? "" : undefined}>
    <p className={a.eyebrow}>{text(page.eyebrow)}</p>
    <header className={a.cardHead}><ElCells ganji={page.ganji} els={page.els} big /><div><h1>{text(page.title)}{page.star ? <span className={a.star} aria-label="가장 오르는 때">{"\u00a0★"}</span> : null}</h1><p className={a.cardSub}>{page.sub}{page.now ? <em className={a.nowTag}>지금</em> : null}{page.past ? <em className={a.pastTag}>지난 {page.unit}</em> : null}</p><FlowDots value={page.flow} word={page.flowWord} /></div></header>
    <p className={a.oneLine}>{text(page.line)}</p>
    {page.good || page.caution ? <div className={a.pair}>{page.good ? <section><h2>{page.good.label}</h2><p>{text(page.good.text)}</p></section> : null}{page.caution ? <section><h2>살필 점</h2><p>{text(page.caution)}</p></section> : null}</div> : null}
    {page.one ? <section className={a.one}><h2>{page.one.label}</h2><p>{text(page.one.text)}</p></section> : null}
    {page.paragraphs.length ? <div className={a.prose}>{page.paragraphs.map((p, i) => <p key={i}>{p.keySpan ? <>{text(p.text.slice(0, p.keySpan[0]))}<strong>{text(p.text.slice(p.keySpan[0], p.keySpan[1]))}</strong>{text(p.text.slice(p.keySpan[1]))}</> : text(p.text)}</p>)}</div> : null}
    <details className={a.myeongri}><summary>명리로 보면</summary><p>하늘 글자 <b>{page.sky}</b> · 땅 글자 <b>{page.ground}</b></p>
      {page.relations.length ? <ul>{page.relations.map(r => <li key={r.name}><b>{r.name}</b> — {text(r.plain)}</li>)}</ul> : <p className={a.hint}>이 {page.unit}에는 태어난 사주와 걸리는 관계가 없어요.</p>}</details>
  </article>;
  if (page.kind === "lifetime" && page.bands) return <section className={a.am} data-am="lifetime"><p className={a.eyebrow}>{title}</p><h1>{text(page.title)}</h1>{page.head ? <p className={a.hint}>{text(page.head)}</p> : null}
    <ol className={a.bands}>{page.bands.map((b, bi) => <li key={bi} className={a.band}><h2>{text(b.theme)}</h2><ol>{b.cycles.map(i => { const c = page.cycles[i];
      return <li key={c.label} className={a.cycle} data-current={c.current ? "" : undefined} data-past={c.past ? "" : undefined}><span className={a.age}>{c.ages}{c.current ? <em className={a.nowTag}>지금</em> : null}</span>{c.hanja && c.els ? <ElCells ganji={c.hanja} els={c.els} /> : null}<span className={a.cycleGod}>{c.tenGod}</span></li>; })}</ol></li>)}</ol></section>;
  return null;
}
