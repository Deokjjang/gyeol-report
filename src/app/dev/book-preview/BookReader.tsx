import { readableBookText } from "../../../lib/book/readerCopy";
import { termPattern } from "../../../lib/book/terms";
import { Cover, MbtiPage, MbtiProfile, NatalTable, ShareIcon } from "./BookPages";
import { BOOKS } from "./model";
import type { BookData, BookNote, BookPage, BookParagraph, BookRowExtras } from "./bookTypes";
import s from "./book.module.css";
import { useState, type ReactNode } from "react";
import { FlowBar, GanjiChip } from "./BookPeriodData";

export function BookInputSummary({ data }: { data: BookData }) {
  return <><div className={s.personSpread} data-pair={data.people.length === 2}>{data.people.map(p => <section key={p.role}><p className={s.micro}>{p.role}</p><h2>{p.name}</h2><dl className={s.coreSummary}>
    <div><dt>생년월일</dt><dd>{p.birth}</dd></div><div><dt>출생시간</dt><dd>{p.timeLabel}</dd></div><div><dt>MBTI</dt><dd>{p.mbti || "모름"}</dd></div>
    <div><dt>성별</dt><dd>{p.gender === "FEMALE" ? "여성" : p.gender === "MALE" ? "남성" : "미선택"}</dd></div>
  </dl></section>)}</div><dl className={s.coreSummary}>{data.context.filter(c => c.value).map(c => <div key={c.label}><dt>{c.label}</dt><dd>{c.value}</dd></div>)}</dl></>;
}

/** 주인공 쪽(궁합은 관계 쪽)에 합친 사람별 표: MBTI는 접고, 만세력·오행은 펼친다.
 * v5 최종 1-17: 만세력 아래 "내 사주의 다른 기운들 보기" 바로가기는 뺐다(책 끝의 부록 쪽과 목차의 부록 줄은 그대로). */
function PersonTables({ data }: { data: BookData }) {
  const pair = data.people.length > 1;
  return <>{data.people.map(p => <section key={p.role} className={s.personTables}>
    {p.table.mbti ? <details className={s.fold}><summary>{pair ? `${p.name}의 ` : ""}MBTI {p.table.mbti.type} · {p.table.mbti.titleKo} 자세히<span aria-hidden="true">+</span></summary><MbtiProfile data={p.table.mbti} /></details>
      : <p className={s.hint}>{pair ? `${p.name}님의 ` : ""}MBTI는 입력하지 않아 추정하지 않습니다.</p>}
    <h2 className={s.personTableTitle}>{p.name}의 만세력</h2><p className={s.hint}>{p.timeLabel}</p><NatalTable data={p.table} />
  </section>)}</>;
}

/** 상세의 관계 줄(P6c-ui2 i): 쉬운 문장(relationsPlain)이 있으면 그 문장을, 배지 이름(원어)은 아래 작은 글씨로. 없으면 예전 배지 목록. */
function RowRelations({ row, text }: { row: BookRowExtras; text: (value: string) => string }) {
  if (row.relationsPlain?.length) return <>{row.relationsPlain.map(line => <p key={line} className={s.hint}>관계 · {text(line)}</p>)}{row.badges?.length ? <p className={s.rowTerms}>{row.badges.map(b => b.label).join(" · ")}</p> : null}</>;
  return row.badges?.length ? <ul className={s.rowBadges}>{row.badges.map((b, i) => <li key={i}><b>{b.label}</b>{b.with ? ` · ${b.with}` : ""} — {text(b.line)}</li>)}</ul> : null;
}

/** 본문 문단(P6c-ui2 g): 핵심 구절(keySpan)은 굵게 + 옅은 밑줄, 용어(glossary: 십성·신살·귀인·십이운성)는 이 장의 첫 등장만 은은하게,
 * 누르면 지식 DB 뜻 한 줄이 작은 팝오버로 뜬다. 두 필드가 없는 Book은 예전과 같은 글자 그대로. */
function Prose({ data, page, text, onNote }: { data: BookData; page: Extract<BookPage, { kind: "narrative" }>; text: (value: string) => string; onNote: (note: BookNote) => void }) {
  const [tip, setTip] = useState<{ name: string; top: number; left: number } | null>(null);
  const glossary = data.glossary ?? [], meaning = new Map(glossary.map(t => [t.name, t.meaning]));
  const pattern = glossary.length ? termPattern(glossary.map(t => t.name)) : null, seen = new Set<string>();
  const terms = (value: string, key: string): ReactNode => {
    if (!pattern) return value;
    const out: ReactNode[] = [];
    let last = 0;
    for (const m of value.matchAll(pattern)) {
      const name = m[1];
      if (seen.has(name)) continue;
      seen.add(name);
      out.push(value.slice(last, m.index), <button key={`${key}-${m.index}`} type="button" className={s.term} data-term aria-expanded={tip?.name === name} aria-describedby={tip?.name === name ? "book-term-tip" : undefined} onClick={e => {
        // 팝오버 자리: 본문(.prose, position: relative) 안에서 용어 바로 아래, 오른쪽 끝을 넘지 않게.
        const b = e.currentTarget, box = b.offsetParent as HTMLElement | null;
        setTip(t => t?.name === name ? null : { name, top: b.offsetTop + b.offsetHeight + 6, left: Math.max(0, Math.min(b.offsetLeft, (box?.clientWidth ?? 240) - 240)) });
      }}>{name}</button>);
      last = m.index + name.length;
    }
    return out.length ? [...out, value.slice(last)] : value;
  };
  const body = (p: BookParagraph, i: number): ReactNode => {
    const k = p.keySpan;
    if (!k) return terms(text(p.text), `${i}`);
    return <>{terms(text(p.text.slice(0, k[0])), `${i}a`)}<strong className={s.keySpan}>{terms(text(p.text.slice(k[0], k[1])), `${i}b`)}</strong>{terms(text(p.text.slice(k[1])), `${i}c`)}</>;
  };
  return <div className={s.prose} onClick={e => { if (tip && !(e.target as Element).closest("[data-term]")) setTip(null); }}>{page.paragraphs.map((p, i) => <section key={i} id={p.anchorId}>{p.heading ? <h2>{text(p.heading)}</h2> : null}<p data-narrative-paragraph>{body(p, i)}{p.notes.length ? " " : null}{[...new Set(p.notes)].filter(n => Number.isInteger(n) && n > 0 && page.notes[n - 1]).map(n => <sup key={n}><button type="button" onClick={() => onNote({ name: text(page.notes[n - 1].name), text: text(page.notes[n - 1].text) })} aria-label={`각주 ${n} ${page.notes[n - 1].name}`}>{n}</button></sup>)}</p></section>)}
    {tip ? <span id="book-term-tip" role="tooltip" className={s.termTip} style={{ top: tip.top, left: tip.left }}><b>{tip.name}</b> {meaning.get(tip.name)}</span> : null}</div>;
}

/** 대운·세운 표 한 줄: 시기·간지·십성·흐름 세기·핵심어·기간 배지. 누르면 상세가 열린다. */
function LedgerRow({ when, sub, ganji, row, summary, time, now, impact, mark, children, ...data }: { when: string; sub: string; ganji: string; row: BookRowExtras; summary?: string; time: string; now: boolean; impact?: string; mark?: ReactNode; children: ReactNode; "data-year"?: number; "data-month"?: number }) {
  return <li {...data} data-now={now} data-impact={impact}><details className={s.ledgerRow}><summary>
    <span className={s.rowWhen}><b>{when}</b>{sub ? <small>{sub}</small> : null}</span>
    <span className={s.rowMain}><span className={s.rowLine}><GanjiChip value={ganji} />{row.tenGod ? <span>{row.tenGod}</span> : null}{row.flow ? <FlowBar value={row.flow} /> : null}</span>
      {row.keywords?.length || summary ? <span className={s.rowKeywords}>{row.keywords?.length ? row.keywords.join(" · ") : summary}</span> : null}{mark}</span>
    {time ? <span className={s.rowBadge}>{time}</span> : null}
  </summary><div className={s.rowDetail}>{children}</div></details></li>;
}

/** 표 왼쪽 굵은 줄(data-impact=HIGH) 범례(P6c). v5 표는 흐름 세기 4칸 이상인 줄에 긋는다(writer/book.ts importance). 흐름 막대가 없는 V4 표에는 두지 않는다. */
const legend = (rows: readonly (BookRowExtras & { importance?: string })[], unit: string) =>
  rows.some(r => r.flow && r.importance === "HIGH") ? <p className={s.hint}>왼쪽 굵은 줄은 흐름 세기가 4칸 이상인 {unit}.</p> : null;

/** endNotice(F): 마지막 쪽 공유 버튼 바로 아래 줄(주인 화면의 1+1·가입 이용권 책 안내). 공유 버튼은 그대로. */
export function BookReader({ data, page, onNote, onShare, onPage, backAction, shareActions, endNotice, keywordActions }: { keywordActions?: ReactNode; data: BookData; page: BookPage; onNote: (note: BookNote) => void; onShare: (text: string) => void; onPage: (page: number, anchor?: string) => void; backAction?: ReactNode; shareActions?: ReactNode; endNotice?: ReactNode }) {
  const book = BOOKS.find(b => b.id === data.bookId)!;
  const text = (value: string) => readableBookText(value, data.people.map(p => p.name));
  if (page.kind === "contents") return <><p className={s.eyebrow}>{data.title}</p><h1>{text(page.title)}</h1><ol className={s.bookContents}>{page.entries.map(entry => <li key={entry.targetId}><button onClick={() => onPage(entry.page, entry.targetId)} data-target-chapter={entry.targetId}><span>{text(entry.title)}</span><small>{String(entry.page + 1).padStart(2, "0")} ↗</small></button></li>)}</ol></>;
  if (page.kind === "score") {
    // 항목 이유: v5는 항목마다 저장, v4는 "항목 n/m점 — 이유" 설명 줄에서 찾는다.
    const own = (label: string) => page.explanations?.find(line => line.startsWith(`${label} `) && line.includes(" — "));
    const rest = page.explanations?.filter(line => !page.scores.some(score => own(score.label) === line)) ?? [];
    return <><p className={s.eyebrow}>{data.names}</p><h1>{text(page.title)}</h1><p className={s.compatibilityScore}><strong>{page.total}</strong> / 100</p>{page.band ? <p className={s.scoreBand}>{text(page.band)} 구간</p> : null}<p className={s.profileLead}>{text(page.verdict)}</p>
      <ol className={s.scoreItems} data-score-version={page.scoreVersion?.startsWith("v2") ? "v2" : undefined}>{page.scores.map(score => { const reason = score.reason ?? own(score.label)?.split(" — ").slice(1).join(" — ");
        return <li key={score.label}><div><h2>{score.label}</h2><span>{score.value} / {score.max}</span></div><span className={s.scoreMeter} aria-hidden="true"><i style={{ width: `${Math.round(score.value / score.max * 100)}%` }} /></span>{reason ? <p>{text(reason)}</p> : null}</li>; })}</ol>
      <p className={s.hint}>{text(page.notice)}</p>{page.versionLabel || rest.length || page.limitations.length ? <details className={s.periodDetails}><summary>지수를 읽는 기준</summary>{page.versionLabel ? <p>{text(page.versionLabel)}</p> : null}{rest.map(line => <p key={line}>{text(line)}</p>)}{page.limitations.map(line => <p key={line}>{line}</p>)}</details> : null}</>;
  }
  if (page.kind === "cover") return <div className={s.readerCover}><Cover book={book} title={data.title} name={data.names} /><h1>{text(page.headline)}</h1>{data.edition ? <p className={s.edition}>{data.edition}</p> : null}</div>;
  if (page.kind === "input") return <><p className={s.eyebrow}>PERSONAL EDITION</p><h1>{text(page.title)}</h1><BookInputSummary data={data} /><PersonTables data={data} /></>;
  if (page.kind === "manse") return <><p className={s.eyebrow}>{data.people[page.person].timeLabel}</p><h1 className={s.dataTitle}>{text(page.title)}</h1><NatalTable data={data.people[page.person].table} /></>;
  if (page.kind === "mbti") return <MbtiPage data={data.people[page.person].table.mbti} name={data.people[page.person].name} />;
  // 관계 이미지(pairImage)가 있으면 맨 위 한 줄 + 각자 이미지 두 줄(작게). 관계 기운은 쉬운 문장 목록만(없으면 숨김).
  if (page.kind === "pair") return <><p className={s.eyebrow}>{page.category} · {data.names}</p><h1>{text(page.image ?? page.title)}</h1>
    {page.image ? <ul className={s.pairImages}>{page.characters.map(p => <li key={p.name}><b>{p.name}</b>{text(p.core)}</li>)}</ul> : null}
    <BookInputSummary data={data} />{page.image ? null : <div className={s.pairPortraits}>{page.characters.map(p => <section key={p.name}><h2>{p.name}</h2><p>{text(p.core)}</p><p>{text(p.strength)}</p><p>{text(p.relationship)}</p></section>)}</div>}
    {page.relationsSummary || page.relationsPlain?.length ? <section className={s.pairRelations}><h2>두 사람 사이의 기운</h2>{page.relationsSummary ? <p className={s.hint}>{text(page.relationsSummary)}</p> : null}
      {page.relationsPlain?.length ? <>{page.relationsSummary ? <h3>영향이 큰 {page.relationsPlain.length === 3 ? "세" : page.relationsPlain.length === 2 ? "두" : "한"} 가지</h3> : null}<ul>{page.relationsPlain.map(line => <li key={line}>{text(line)}</li>)}</ul></> : null}
      {page.relationsSummary && (page.relationsTotal ?? 0) > (page.relationsPlain?.length ?? 0) ? <p className={s.hint}>전체 {page.relationsTotal}가지는 책 끝 부록 「두 사람 사이의 모든 기운」에 있어요.</p> : null}</section> : null}<PersonTables data={data} /></>;
  if (page.kind === "timeline") return <><p className={s.eyebrow}>{page.years[0].year} — {page.years.at(-1)!.year}</p><h1>{text(page.title)}</h1><p className={s.hint}>최근 3년 · 지금 · 앞으로 10년</p>
    <ol className={s.transitions}>{page.transitions.map((t, i) => <li key={i}><button onClick={() => onPage(t.page)}><strong>{text(t.date)}</strong><span>{text(t.before)} → {text(t.after)} · 전환 이야기 ↗</span></button>{t.exact && t.exact !== t.date ? <details className={s.periodDetails}><summary>계산 구간 보기</summary><p>{text(t.exact)}</p></details> : null}</li>)}</ol>
    {page.years.some(y => y.flow) ? <p className={s.hint}>줄을 누르면 자세히 열려요. 막대는 흐름 세기(정해진 규칙으로 센 참고 값)예요.</p> : null}{legend(page.years, "해예요")}
    <ol className={s.ledger}>{page.years.map(y => <LedgerRow key={y.year} data-year={y.year} when={String(y.year)} sub={y.ageLabel ?? `${y.age}세`} ganji={y.annual} row={y} summary={text(y.theme)} time={y.time} now={y.time === "지금"} impact={y.importance}
      mark={y.transition ? <strong className={s.transitionLabel}>{text(y.transition)} · 대운 전환</strong> : null}>
      <button onClick={() => onPage(y.page)}>{text(y.title)} ↗</button>{y.cycle ? <div className={s.periodPair}><span>대운 <GanjiChip value={y.cycle.replace(/ 대운$/, "")} /></span></div> : null}
      <p className={s.hint}>{y.goodLabel ?? "좋은 힘"} · {text(y.good)}</p>{y.caution ? <p className={s.hint}>살필 점 · {text(y.caution)}</p> : null}
      <RowRelations row={y} text={text} />
    </LedgerRow>)}</ol></>;
  if (page.kind === "months") return <><p className={s.eyebrow}>{data.title}</p><h1>{text(page.title)}</h1>{page.map?.length ? <dl className={s.yearMap}>{page.map.map(group => <div key={group.label}><dt>{group.label}</dt><dd>{group.months.map(month => <button key={month} onClick={() => onPage(page.months.find(m => m.month === month)!.page)}>{month}월 ↗</button>)}</dd></div>)}</dl> : null}<p className={s.hint}>{page.months.some(m => m.order) ? "달은 절기(절입일)로 나눠요. 지금 지나는 달에 굵은 선을 그었어요. 줄을 누르면 자세히 열려요."
      : `달력 달마다 그 달의 절기월과 날짜를 함께 적었어요.${page.months.some(m => m.time === "지금") ? " 지금 지나는 달에 굵은 선을 그었어요." : ""} 줄을 누르면 자세히 열려요.`}</p>{legend(page.months, "달이에요")}
    <ol className={s.ledger}>{page.months.map(m => <LedgerRow key={m.order ?? m.month} data-month={m.order ?? m.month} when={m.name ?? (m.order ? `${m.order}번째 달` : `${m.month}월`)} sub={m.name ? m.range ?? "" : m.sub ?? m.range ?? ""} ganji={m.ganji} row={{ ...m, tenGod: m.tenGod ?? m.gods }} summary={text(m.theme)} time={m.time} now={m.time === "지금"} impact={m.importance}>
      <button onClick={() => onPage(m.page)}>{text(m.title)} ↗</button>{m.good ? <p className={s.hint}>{m.goodLabel ?? "좋은 힘"} · {text(m.good)}</p> : null}{m.caution ? <p className={s.hint}>살필 점 · {text(m.caution)}</p> : null}
      {m.badges?.length ? <RowRelations row={m} text={text} /> : m.markers.length ? <p className={s.hint}>{m.markers.join(" · ")}</p> : null}
      {m.boundary ? <details className={s.periodDetails}><summary>{text(m.boundary.label)}</summary><p>{text(m.boundary.explanation)}</p></details> : null}
    </LedgerRow>)}</ol></>;
  if (page.kind === "appendix") {
    const stageMeanings = new Set(page.items.filter(item => item.group === "십이운성").map(item => item.meaning));
    const sharedStageMeaning = !page.lead && stageMeanings.size === 1 ? [...stageMeanings][0] : undefined;
    return <><p className={s.eyebrow}>APPENDIX · {page.total}개 기운</p><h1>{text(page.title)}</h1>{page.notes?.map(line => <p key={line} className={s.hint}>{text(line)}</p>)}{page.lead ? <p className={s.hint}>{text(page.lead)}</p> : page.items.some(item => item.group === "지장간") ? <p className={s.hint}>지장간은 지지 안에 담긴 천간입니다. 아래는 각 천간이 내 일간에 대해 갖는 십성의 뜻이에요. 위치는 만세력표에서 볼 수 있습니다.</p> : null}{sharedStageMeaning ? <p className={s.hint}>십이운성 · {text(sharedStageMeaning)}</p> : null}<ol start={page.from} className={s.glossary}>{page.items.map((item, i) => <li key={i}><span className={s.micro}>{String(page.from + i).padStart(2, "0")}</span><div><small>{item.group ?? "명리 기운"}{item.core ? " · 본문 핵심" : ""}</small><h2>{text(item.name)}</h2>{item.group !== "십이운성" || item.meaning !== sharedStageMeaning ? <p>{text(item.meaning)}</p> : null}</div></li>)}</ol></>;
  }
  if (page.kind === "back") return <div className={s.backContent}><span className={s.micro}>PERSONAL EDITION / FIN</span><h1>{data.title}</h1><p data-final-line>{text(page.finalLine)}</p>{shareActions ?? <section className={s.sharePreview} aria-label="이 책 공유하기 미리보기"><h2>이 책 공유하기</h2><p className={s.shareTitle}>{data.share.title}</p><div>{["카카오톡", "공유", "링크 복사"].map((label, i) => <button type="button" key={label} onClick={() => onShare(`${data.share.title} · ${label} 미리보기입니다. 실제 공유나 복사는 실행하지 않습니다.`)}><ShareIcon kind={i} /><span>{label}</span></button>)}</div></section>}{endNotice}{backAction}{page.aiNotice ? <p className={s.aiNotice} data-ai-notice>{page.aiNotice}</p> : null}{data.edition ? <span className={s.edition}>{data.edition}</span> : null}<span className={s.micro}>END OF BOOK</span></div>;
  // AM 2부 세운 신년판·3부 대운 쪽.
  if (page.kind === "keywords") return <><p className={s.eyebrow}>{data.title} · KEYWORDS</p><h1>{text(page.title)}</h1>
    <ol className={s.keywordCard} data-keyword-card>{page.keywords.map(w => <li key={w}>{text(w)}</li>)}</ol>
    {page.line ? <p className={s.profileLead}>{text(page.line)}</p> : null}{page.verdict ? <p className={s.hint}>한 해의 결: {text(page.verdict)}(정해진 규칙으로 센 참고 판정)</p> : null}
    {keywordActions ?? null}</>;
  if (page.kind === "lucky") return <><p className={s.eyebrow}>{data.title}</p><h1>{text(page.title)}</h1><p className={s.profileLead}>{text(page.why)}</p>
    <dl className={s.yearMap}><div><dt>색</dt><dd>{page.colors.join(" · ")}</dd></div><div><dt>방향</dt><dd>{page.direction}</dd></div><div><dt>숫자</dt><dd>{page.numbers.join(" · ")}</dd></div></dl>
    <p className={s.hint}>나를 돕는 기운: {text(page.name)} — 옷·소품·자리 같은 작은 습관으로 곁에 두는 정도면 충분해요.</p>
    {page.samjae ? <section className={s.pairRelations}><h2>{text(page.samjae.zodiac)} · {text(page.samjae.phase)}</h2><p className={s.hint}>{text(page.samjae.line)}</p></section> : null}</>;
  if (page.kind === "continue") return <><p className={s.eyebrow}>{data.title} · NEXT</p><h1>{text(page.title)}</h1><p className={s.profileLead}>{text(page.text)}</p>
    <p><a className={s.continueLink} href={page.href} data-continue-major>대운으로 이어 보기 →</a></p></>;
  if (page.kind === "lifetime") return <><p className={s.eyebrow}>{data.title}</p><h1>{text(page.title)}</h1><p className={s.hint}>대운은 10년마다 바뀌는 큰 흐름이에요. 나이는 만 나이, 대운수는 첫 대운이 시작되는 나이예요.</p>
    <ol className={s.ledger}>{page.cycles.map(c => <li key={c.label} data-current={c.current ? "true" : undefined}><div><strong>{text(c.label)}</strong>{c.current ? <span className={s.transitionLabel}> 지금</span> : null}</div><p className={s.hint}>{c.ages} · {text(c.tenGod)} · {text(c.theme)}</p></li>)}</ol></>;
  const titleLines = text(page.title).split("\n");
  return <><p className={s.eyebrow}>{titleLines.length > 1 ? titleLines[0] : `PERSONAL EDITION / ${data.names}`}</p><h1>{titleLines.length > 1 ? titleLines.slice(1).join("\n") : titleLines[0]}</h1><Prose key={page.id ?? page.title} data={data} page={page} text={text} onNote={onNote} />
    {page.notes.length ? <section className={s.chapterNotes} aria-label="이 장의 각주"><ol>{page.notes.map((note, i) => <li key={i} value={i + 1}><div><strong>{text(note.name)}</strong>{" "}<p>{text(note.text)}</p></div></li>)}</ol></section> : null}</>;
}
