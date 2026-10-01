import { useEffect, useRef, useState, Fragment, type CSSProperties } from "react";
import type { ReportTableElementColorToken } from "../../../lib/report-tables/types";
import { prePaymentRefundNoticeKo } from "../../../lib/legal/refundPolicy";
import { prePaymentPrivacyNoticeKo } from "../../../lib/legal/privacyPolicy";
import fixture from "./fixture.json";
import { CONSENT_SHORT_LABELS, MBTI, NOTES, requiredConsents, toggleAll, type Book, type Person, type PublishingState } from "./model";
import { BusinessDetails, DetailSheet, LegalAccordion, SUPPORT_COPY } from "./BookLegal";
import s from "./book.module.css";

export function Cover({ book, name, back = false }: { book: Book; name?: string; back?: boolean }) {
  return <div className={`${s.cover} ${back ? s.backCover : ""}`} style={{ "--cover": book.color, "--ink": book.ink } as CSSProperties}>
    <div className={s.coverTop}><span>GYEOL<br />REPORT</span><span>ISSUE<br />{book.issue}</span></div>
    <div className={s.coverTitle}>{book.title}</div>
    <div className={s.coverBottom}><span>PERSONAL<br />EDITION</span><span>{name ? `${name}의 책` : "한 사람, 한 권."}</span></div>
    <span className={s.spine} aria-hidden="true" />
  </div>;
}

export function PersonFields({ person, onChange, prefix, label }: { person: Person; onChange: (v: Person) => void; prefix: string; label: string }) {
  const field = (key: keyof Person, value: string) => onChange({ ...person, [key]: value });
  return <div className={s.fields}>
    <label htmlFor={`${prefix}-name`}>{label} 이름<input id={`${prefix}-name`} value={person.name} maxLength={30} required autoComplete="off" onChange={e => field("name", e.target.value)} /></label>
    <label htmlFor={`${prefix}-birth`}>생년월일<input id={`${prefix}-birth`} type="date" min="1900-01-01" max="2026-10-01" value={person.birth} required onChange={e => field("birth", e.target.value)} /></label>
    <label htmlFor={`${prefix}-gender`}>성별<select id={`${prefix}-gender`} value={person.gender} onChange={e => field("gender", e.target.value)}><option value="FEMALE">여성</option><option value="MALE">남성</option></select></label>
    <fieldset className={s.wide}><legend>출생시간</legend><div className={s.choices}>{[["exact", "정확"], ["approximate", "대략"], ["unknown", "모름"]].map(([value, text]) => <label key={value}><input type="radio" name={`${prefix}-precision`} checked={person.precision === value} onChange={() => field("precision", value)} />{text}</label>)}</div></fieldset>
    {person.precision !== "unknown" ? <label className={s.wide} htmlFor={`${prefix}-time`}>{person.precision === "exact" ? "태어난 시각" : "기억하는 대략적인 시각"}<input id={`${prefix}-time`} type="time" value={person.time} required onChange={e => field("time", e.target.value)} /></label> : <p className={`${s.hint} ${s.wide}`}>기억나지 않아도 괜찮습니다.</p>}
  </div>;
}

export function MbtiField({ value, onChange, id = "mbti" }: { value: string; onChange: (v: string) => void; id?: string }) {
  return <label htmlFor={id}>MBTI<select id={id} value={value} onChange={e => onChange(e.target.value)}>{MBTI.map(m => <option key={m}>{m}</option>)}<option value="">모름</option></select></label>;
}

export function Receipt({ book, person, member, setMember, consents, setConsents }: { book: Book; person: Person; member: boolean; setMember: (v: boolean) => void; consents: Record<string, boolean>; setConsents: (v: Record<string, boolean>) => void }) {
  const { items, allowed } = requiredConsents(member, person.birth);
  const all = items.every(c => consents[c.id]);
  const some = items.some(c => consents[c.id]);
  const allInput = useRef<HTMLInputElement>(null);
  const [detail, setDetail] = useState<string | null>(null);
  useEffect(() => { if (allInput.current) allInput.current.indeterminate = some && !all; }, [some, all]);
  const selected = items.find(c => c.id === detail);
  return <>
    <div className={s.modeSwitch} role="group" aria-label="영수증 체험 상태">{[false, true].map(m => <button type="button" key={String(m)} aria-pressed={member === m} onClick={() => setMember(m)}>{m ? "회원" : "비회원"}</button>)}</div>
    <div className={s.receipt}>
      <p className={s.micro}>GYEOL REPORT</p><h1>발행 주문서</h1><p className={s.micro}>PUBLISHING ORDER — PREVIEW</p>
      <dl>{[["TITLE", book.title.replace("\n", " ")], ["ISSUED TO", person.name], ["BIRTH", `${person.birth.replaceAll("-", ".")} / ${person.precision === "unknown" ? "시간 모름" : person.time + (person.precision === "approximate" ? "경" : "")}`], ["MBTI", person.mbti || "모름"], ["PRICE", "₩1,290"]].map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl>
      <p className={s.receiptNote}>입력값 기반 자동 생성 디지털 리포트 · 사람 상담 아님<br />결제 완료 후 즉시 생성, 최대 24시간 이내 제공<br />생성일로부터 90일 · 결제 후 온라인 열람</p>
      {member ? <p className={s.receiptNote}>회원 미리보기 · 가입 약관 동의 가정, 실제 적용 전 검토 필요.</p> : null}
      <fieldset className={s.consents}><legend className={s.srOnly}>약관 및 개인정보 동의</legend>
        <label className={s.allConsent}><input ref={allInput} type="checkbox" checked={all} disabled={!allowed} onChange={e => setConsents(toggleAll(items.map(c => c.id), e.target.checked, consents))} />전체 동의</label>
        {items.map(c => <div className={s.consentRow} key={c.id}><label><input type="checkbox" checked={Boolean(consents[c.id])} disabled={!allowed} onChange={e => setConsents({ ...consents, [c.id]: e.target.checked })} />[필수] {CONSENT_SHORT_LABELS[c.id]}</label><button type="button" aria-label={`${CONSENT_SHORT_LABELS[c.id]} 상세 보기`} onClick={() => setDetail(c.id)}>보기 <span aria-hidden="true">›</span></button></div>)}
      </fieldset>
      {!allowed ? <p role="alert">만 14세 이상만 이용할 수 있습니다.</p> : null}
      <div className={s.legalLinks}><button type="button" onClick={() => setDetail("purchase")}>구매 전 안내 보기 ›</button><button type="button" onClick={() => setDetail("policies")}>정책 전문 보기 ›</button></div>
      <p className={s.receiptNote}>체험용 주문서입니다. 결제·저장되지 않습니다.</p>
    </div>
    {detail !== null ? <DetailSheet title={selected ? CONSENT_SHORT_LABELS[selected.id] : detail === "purchase" ? "구매 전 안내" : "정책 전문"} onClose={() => setDetail(null)}>
      {selected ? <p className={s.consentFull}>{selected.label}</p> : null}
      {detail === "purchase" || detail === "refundRestriction" || detail === "digitalReportStart" ? <div className={s.legalDocument}><h3>환불 및 청약철회 안내</h3><p>{prePaymentRefundNoticeKo}</p></div> : null}
      {detail === "purchase" || detail === "policyAgreement" ? <div className={s.legalDocument}><h3>개인정보 처리 안내</h3><p>{prePaymentPrivacyNoticeKo}</p></div> : null}
      <LegalAccordion />
    </DetailSheet> : null}
  </>;
}

export function Publishing({ book, name, state }: { book: Book; name: string; state: PublishingState }) {
  return <div className={s.publishing} data-publishing={state}>
    <div className={s.press} style={{ "--cover": book.color, "--ink": book.ink } as CSSProperties} aria-hidden="true">
      {[0, 1, 2, 3].map(i => <div key={i} className={s.sheet} style={{ "--sheet": i } as CSSProperties}><i /><i /><i /><i /></div>)}
      <div className={s.binding} /><div className={s.printedCover}><Cover book={book} name={state === "complete" ? name : undefined} /></div>
    </div>
    <h1 aria-live="polite">{name}님의 책을<br />출판하고 있습니다.</h1>
    <p className={s.micro}>A PERSONAL EDITION, IN THE MAKING.</p>
    <p className={s.hint}>출판 과정 미리보기 · 실제 생성 아님</p>
  </div>;
}

export function ReaderContent({ page, onNote, onShare }: { page: string; onNote: (n: number) => void; onShare: (n: string) => void }) {
  if (page === "opening") return <><p className={s.eyebrow}>PROLOGUE / 서진이라는 사람</p><h1>{fixture.headline}</h1><div className={s.prose}>{fixture.opening.map((p, i) => <p key={i}>{p}{i === 0 ? <sup><button onClick={() => onNote(0)} aria-label="각주 1 현침살">1</button></sup> : null}</p>)}</div></>;
  if (page === "manse") return <><p className={s.eyebrow}>THE ORIGINAL / 1990.07.18 05:30</p><h1 className={s.dataTitle}>나의 만세력</h1><p className={s.hint}>서진의 고정 샘플 · 입력값을 바꿔도 재계산하지 않습니다.</p><NatalTable /></>;
  if (page === "mbti") return <MbtiPage />;
  if (page === "glossary") return <><p className={s.eyebrow}>INDEX OF THIS EDITION</p><h1>이 책에<br />사용된 기운</h1><ol className={s.glossary}>{NOTES.map((n, i) => <li key={n.name}><span className={s.micro}>0{i + 1}</span><div><h2>{n.name}</h2><p>{n.image}</p><p>{n.text}</p></div></li>)}</ol></>;
  if (page === "back") return <div className={s.backContent}><span className={s.micro}>PERSONAL EDITION / FIN</span><h1>한 권을 덮고,<br />나를 조금 더<br />좋아하게 되기를.</h1><p>{fixture.finalLine}</p><section className={s.sharePreview} aria-label="이 책 공유하기 미리보기"><h2>이 책 공유하기</h2><div>{["카카오톡", "공유", "링크 복사"].map((label, i) => <button type="button" key={label} onClick={() => onShare(`${label} 미리보기입니다. 실제 공유나 복사는 실행하지 않습니다.`)}><ShareIcon kind={i} /><span>{label}</span></button>)}</div></section><span className={s.micro}>END OF BOOK</span></div>;
  const index = Number(page.split("-")[1]);
  const chapter = fixture.chapters[index];
  return <><p className={s.eyebrow}>CHAPTER {String(index + 1).padStart(2, "0")}</p><h1>{chapter.title}</h1><div className={s.prose}>{chapter.paragraphs.map((p, i) => <p key={i}>{p}</p>)}{index === 6 ? <p>{NOTES[2].text}<sup><button onClick={() => onNote(2)} aria-label="각주 3 홍염살">3</button></sup></p> : null}{index === 5 ? <p>{NOTES[1].text}<sup><button onClick={() => onNote(1)} aria-label="각주 2 도화살">2</button></sup></p> : null}</div></>;
}

// Semantic tokens from the canonical table contract, independent of cover color.
export const ELEMENT_LABELS = { "wood-green": "목 木", "fire-red": "화 火", "earth-soil": "토 土", "metal-gold": "금 金", "water-sky": "수 水" } satisfies Record<ReportTableElementColorToken, string>;
// Verbatim SVG geometry from ReportShareActions; no production actions/SDK imported.
function ShareIcon({ kind }: { kind: number }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" focusable="false">
    {kind === 0 ? <path fill="currentColor" stroke="none" d="M12 4C6.8 4 2.6 7.28 2.6 11.32c0 2.6 1.74 4.88 4.36 6.18l-.9 3.3c-.08.3.26.54.52.36l3.92-2.6c.5.06 1 .1 1.5.1 5.2 0 9.4-3.28 9.4-7.34S17.2 4 12 4Z" /> : kind === 1 ? <><circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="m8.2 10.8 7.6-4.5M8.2 13.2l7.6 4.5" /></> : <><rect x="8" y="8" width="10" height="10" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></>}
  </svg>;
}
function NatalTable() {
  const t = fixture.tables.manse;
  const keys = t.columns.map(c => c.key as keyof typeof t.stemRow);
  return <div className={s.tables}><table><caption>서진의 만세력</caption><thead><tr><th scope="col">구분</th>{t.columns.map(c => <th scope="col" key={c.key}>{c.label}</th>)}</tr></thead><tbody>
    {[["천간", t.stemRow], ["지지", t.branchRow]].map(([label, row]) => <Fragment key={String(label)}><tr><th scope="row">{String(label)}</th>{keys.map(key => { const cell = (row as typeof t.stemRow)[key]; return <td key={key}><strong data-element={cell.colorToken}>{cell.hanja}</strong><span>{cell.ko} · {ELEMENT_LABELS[cell.colorToken as ReportTableElementColorToken]} · {cell.yinYang === "yin" ? "음" : "양"}</span></td>; })}</tr><tr><th scope="row">십성</th>{keys.map(key => <td key={key}>{(row as typeof t.stemRow)[key].tenGod}</td>)}</tr></Fragment>)}
    {t.detailRows.map(row => <tr key={row.key}><th scope="row">{row.key === "interactions" ? <abbr title={row.label}>합·충</abbr> : row.label}</th>{keys.map(key => <td key={key}>{row.cells[key].length ? row.cells[key].map((text, i) => <span key={i}>{text}</span>) : "—"}</td>)}</tr>)}
    </tbody></table><h2>오행의 구성</h2><p className={s.hint}>{t.fiveElementDistribution.basisLabel} / 지장간 포함 가중</p><div className={s.elements}>{fixture.tables.elements.map((e, i) => <div key={e.label}><b data-element={t.fiveElementDistribution.items[i].colorToken}>{ELEMENT_LABELS[t.fiveElementDistribution.items[i].colorToken as ReportTableElementColorToken]}</b><span>{e.visible} / {Number(e.weighted.toFixed(2))}</span></div>)}</div></div>;
}
function MbtiPage() {
  const m = fixture.tables.mbti;
  return <><p className={s.eyebrow}>WAYS OF BEING / 나의 MBTI</p><h1 className={s.mbtiTitle}>{m.type}<span>{m.titleKo}</span></h1><p className={s.archetype}>{m.archetype}</p><p className={s.profileLead}>{m.oneLine}</p><div className={s.profile}>
    <h2>선호지표</h2><div className={s.axes}>{m.preferenceRows.map(r => <section key={r.axisKey} aria-label={r.label}><h3>{r.label}</h3><div>{[r.left, r.right].map(v => <div key={v.code} data-selected={v.selected}><b>{v.code}</b><span><strong>{v.nameKo}{v.selected ? " ✓" : ""}</strong><small>{v.nameEn}</small><span>{v.description}</span></span></div>)}</div></section>)}</div>
    <h2>기능서열</h2><table className={s.functions}><caption className={s.srOnly}>기능서열</caption><colgroup><col style={{ width: 56 }} /><col style={{ width: 38 }} /><col /></colgroup><thead className={s.srOnly}><tr><th scope="col">순서</th><th scope="col">기능</th><th scope="col">설명</th></tr></thead><tbody>{m.functionRows.map(r => <tr key={r.code}><th scope="row">{r.label}</th><td>{r.code}</td><td><strong>{r.nameKo}</strong><small>{r.attitude} · {r.domain}</small><p>{r.description}</p></td></tr>)}</tbody></table>
    <h2>핵심 요약</h2><dl className={s.coreSummary}>{m.coreSummary.map(r => <div key={r.key}><dt>{r.label}</dt><dd>{r.text}</dd></div>)}</dl>
    <h2>가까운 키워드</h2><p>{m.closeKeywords.join(" · ")}</p><h2>먼 키워드</h2><p>{m.farKeywords.join(" · ")}</p>
  </div></>;
}

export function PreviewFooter() {
  const [legal, setLegal] = useState(false);
  return <footer className={s.siteFooter}><div className={s.footerTop}><span className={s.micro}>GYEOL REPORT<br />PERSONAL PUBLISHING</span><nav aria-label="소셜과 고객 문의">
    <a href="https://www.instagram.com/gyeolreport/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="18" cy="6" r="1" /></svg></a>
    <a href="http://pf.kakao.com/_sbHaX/chat" target="_blank" rel="noopener noreferrer" aria-label="카카오톡 고객 문의"><svg width="21" height="21" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3C6 3 2 6.5 2 11c0 3 2 5 5 6.5L6 21l4-2.5h2c6 0 10-3.5 10-7.5S18 3 12 3Z" /></svg></a>
    <a href="http://pf.kakao.com/_sbHaX" target="_blank" rel="noopener noreferrer">채널 보기</a>
    </nav></div><p>{SUPPORT_COPY}</p><p>전화 상담은 제공하지 않습니다.</p>
    <details data-business><summary>사업자 정보 <span aria-hidden="true">+</span></summary><BusinessDetails /></details>
    <nav className={s.legalLinks} aria-label="정책 링크"><button type="button" onClick={() => setLegal(true)}>이용약관 · 개인정보처리방침 · 환불정책 ›</button></nav><p className={s.micro}>© GYEOL REPORT</p>
    {legal ? <DetailSheet title="이용약관과 정책" onClose={() => setLegal(false)}><LegalAccordion /></DetailSheet> : null}
  </footer>;
}
