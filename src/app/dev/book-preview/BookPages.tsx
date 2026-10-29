import Image from "next/image";
import { useEffect, useRef, useState, Fragment, type CSSProperties } from "react";
import { REPORT_PRICE_LABEL_KO } from "../../../lib/payment/reportProductCatalog";
import type { ReportTableElementColorToken } from "../../../lib/report-tables/types";
import { prePaymentRefundNoticeKo } from "../../../lib/legal/refundPolicy";
import { prePaymentPrivacyNoticeKo } from "../../../lib/legal/privacyPolicy";
import type { V4CustomerTables } from "../../../lib/interpretation-v4/runtimeTypes";
import { CONSENT_SHORT_LABELS, MBTI, requiredConsents, toggleAll, type Book, type Person, type PublishingState } from "./model";
import { BusinessDetails, DetailSheet, LegalAccordion, SUPPORT_COPY } from "./BookLegal";
import s from "./book.module.css";
import MetaSettingsLink from "../../../components/analytics/MetaSettingsLink";
import { SocialLinks } from "../../../components/brand/SocialLinks";
import MBTI_PAGES from "../../../data/book-pages/mbti.json";

// 버튼 안에도 들어가므로 span으로 그린다(표지 6종 공용: 홈·책 첫 쪽·서재·공유 입구).
export function Cover({ book, name, title, back = false }: { book: Book; name?: string; title?: string; back?: boolean }) {
  return <span className={`${s.cover} ${back ? s.backCover : ""}`} style={{ "--cover": book.color, "--cover-ink": book.ink } as CSSProperties}>
    <span className={s.coverTop}><span>결리포트</span><span>{book.issue}</span></span>
    <span className={s.coverTitle}>{title ?? book.title}</span>
    <span className={s.coverBottom}>{name ? <span>{name}의 책</span> : null}</span>
    <span className={s.spine} aria-hidden="true" />
  </span>;
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

export function Receipt({ book, person, title, member, setMember, consents, setConsents }: { book: Book; person: Person; title?: string; member: boolean; setMember: (v: boolean) => void; consents: Record<string, boolean>; setConsents: (v: Record<string, boolean>) => void }) {
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
      <h1>발행 주문서</h1>
      <dl>{[["책", title ?? book.title.replace("\n", " ")], ["받는 분", person.name], ["생년월일", `${person.birth.replaceAll("-", ".")} / ${person.precision === "unknown" ? "시간 모름" : person.time + (person.precision === "approximate" ? "경" : "")}`], ["MBTI", person.mbti || "모름"], ["금액", REPORT_PRICE_LABEL_KO]].map(([key, value]) => <div key={key} className={key === "금액" ? s.total : undefined}><dt>{key}</dt><dd>{value}</dd></div>)}</dl>
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

export function Publishing({ book, name, state, notice = "출판 과정 미리보기 · 결제·저장 없음", visualOnly = false }: { book?: Book; name?: string; state: PublishingState; notice?: string; visualOnly?: boolean }) {
  return <div className={s.publishing} data-publishing={state}>
    <div className={s.press} style={{ "--cover": book?.color ?? "#111111", "--cover-ink": book?.ink ?? "#FFFFFF" } as CSSProperties} aria-hidden="true">
      {[0, 1, 2, 3].map(i => <div key={i} className={s.sheet} style={{ "--sheet": i } as CSSProperties}><i /><i /><i /><i /></div>)}
      <div className={s.binding} /><div className={s.printedCover}>{book ? <Cover book={book} name={state === "complete" ? name : undefined} /> : <div className={s.cover} />}</div>
    </div>
    {!visualOnly ? <><h1 aria-live="polite">{name ? `${name}님의 책을` : "책을"}<br />출판하고 있습니다.</h1>
    <p className={s.hint}>{notice}</p></> : null}
  </div>;
}


// Semantic tokens from the canonical table contract, independent of cover color.
export const ELEMENT_LABELS = { "wood-green": "목 木", "fire-red": "화 火", "earth-soil": "토 土", "metal-gold": "금 金", "water-sky": "수 水" } satisfies Record<ReportTableElementColorToken, string>;
// Official Kakao resource; other action geometry and preview-only behavior stay unchanged.
export function ShareIcon({ kind }: { kind: number }) {
  if (kind === 0) return <Image src="/brand/kakao-talk-share.svg" width="24" height="25" alt="" aria-hidden="true" />;
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" focusable="false">
    {kind === 1 ? <><circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="m8.2 10.8 7.6-4.5M8.2 13.2l7.6 4.5" /></> : <><rect x="8" y="8" width="10" height="10" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></>}
  </svg>;
}
const ELEMENT_KO = { "wood-green": "목", "fire-red": "화", "earth-soil": "토", "metal-gold": "금", "water-sky": "수" } satisfies Record<ReportTableElementColorToken, string>;
/** 십이운성 한글 → 한자 병기. 오행 '쇠(금)'과 헷갈리지 않게 衰를 함께 쓴다. */
const STAGE_HANJA: Record<string, string> = { 장생: "長生", 목욕: "沐浴", 관대: "冠帶", 건록: "建祿", 임관: "臨官", 제왕: "帝旺", 쇠: "衰", 병: "病", 사: "死", 묘: "墓", 절: "絶", 태: "胎", 양: "養" };
const withStageHanja = (text: string) => STAGE_HANJA[text] ? `${text}(${STAGE_HANJA[text]})` : text;
/** 오행 막대의 쉬운 표시. 내부 가중 수치는 보이지 않고, 없는 오행을 '약함'으로 부르지 않는다. */
export function elementLevel(e: { state?: string | null; weighted: number }) {
  if (!(e.weighted > 0)) return "없음";
  return /강|과다|많/.test(e.state ?? "") ? "많음" : /약|부족|적/.test(e.state ?? "") ? "적음" : "보통";
}
export type BookRelation = { pair: string; text: string };

export function NatalTable({ data, relations }: { data: V4CustomerTables[number]; relations?: readonly BookRelation[] }) {
  const t = data.manse;
  const keys = t.columns.map(c => c.key as keyof typeof t.stemRow);
  const characters = [t.stemRow, t.branchRow].flatMap(row => keys.flatMap(key => row[key] ? [row[key]!] : []));
  const yin = characters.filter(c => c.yinYang === "yin").length;
  // v5 Book은 엔진이 감지한 관계 전부(기둥 쌍 포함), 과거 v4 Book은 저장된 합·충 칸 그대로(재계산 없음).
  const stored = t.detailRows.find(r => r.key === "interactions");
  const relationList = relations ?? [...new Set(keys.flatMap(key => stored?.cells[key] ?? []))].map(text => ({ pair: "", text }));
  const max = Math.max(...data.elements.map(e => e.weighted), 1);
  return <div className={s.tables}><table><caption className={s.srOnly}>{data.name}의 만세력</caption><thead><tr><th scope="col"><span className={s.srOnly}>구분</span></th>{t.columns.map(c => <th scope="col" key={c.key}>{c.label}</th>)}</tr></thead><tbody>
    {[["천간", t.stemRow], ["지지", t.branchRow]].map(([label, row]) => <Fragment key={String(label)}><tr><th scope="row">{String(label)}</th>{keys.map(key => { const cell = (row as typeof t.stemRow)[key]; return <td key={key}>{cell ? <><strong data-element={cell.colorToken}>{cell.hanja}</strong><small>{cell.ko}</small><small>{cell.yinYang === "yin" ? "음" : "양"} · {ELEMENT_KO[cell.colorToken]}</small></> : <small>모름</small>}</td>; })}</tr><tr><th scope="row">십성</th>{keys.map(key => <td key={key}>{(row as typeof t.stemRow)[key]?.tenGod ?? "—"}</td>)}</tr></Fragment>)}
    {t.detailRows.filter(row => row.key !== "interactions").map(row => <tr key={row.key}><th scope="row">{row.key === "sinsalAndGwiin" ? "신살·귀인" : row.label}</th>{keys.map(key => <td key={key}>{row.cells[key].length ? row.cells[key].map((text, i) => <span key={i}>{row.key === "twelveLifeStage" ? withStageHanja(text) : text}</span>) : "—"}</td>)}</tr>)}
    </tbody></table><p className={s.hint}>음 {yin} · 양 {characters.length - yin}{characters.length === 8 ? "" : " · 확인된 기둥 기준"}{t.timeCorrectionNote ? ` · ${t.timeCorrectionNote}` : ""}</p>
    <h2>합·충</h2>{relationList.length ? <ul className={s.relations}>{relationList.map(r => <li key={r.pair + r.text}>{r.pair ? <><span>{r.pair}</span><span>{r.text}</span></> : <span style={{ gridColumn: "1 / -1", color: "inherit" }}>{r.text}</span>}</li>)}</ul> : <p className={s.hint}>원국 안에서 서로 합하거나 부딪치는 관계가 없습니다.</p>}
    <h2>오행</h2><div className={s.elements}>{data.elements.map((e, i) => { const token = t.fiveElementDistribution.items[i].colorToken; return <div key={e.label} data-element={token}><b>{ELEMENT_LABELS[token]}</b><span className={s.bar} aria-hidden="true"><i style={{ "--w": `${Math.round(e.weighted / max * 100)}%` } as CSSProperties} /></span><span>{elementLevel(e)}</span></div>; })}</div></div>;
}
export function MbtiPage({ data: m, name }: { data: V4CustomerTables[number]["mbti"]; name: string }) {
  if (!m) return <><p className={s.eyebrow}>{name}의 MBTI</p><h1>MBTI 모름</h1><p className={s.profileLead}>입력하지 않은 유형은 추정하지 않습니다. 이 책은 확인된 명리 데이터를 기준으로 읽을 수 있습니다.</p></>;
  const view = (MBTI_PAGES.types as Record<string, (typeof MBTI_PAGES.types)[keyof typeof MBTI_PAGES.types] | undefined>)[m.type];
  return <><p className={s.eyebrow}>{name}의 MBTI</p><h1 className={s.mbtiTitle}>{m.type}{view ? <span>{view.name}</span> : null}</h1>{view ? <p className={s.profileLead}>{view.oneLiner}</p> : null}<div className={s.profile}>
    <h2>선호지표</h2><div className={s.axes}>{m.preferenceRows.map(r => <section key={r.axisKey} aria-label={r.label}>{[r.left, r.right].map(v => <div key={v.code} data-selected={v.selected}><b>{v.code}</b><small>{v.nameKo}{v.selected ? <span className={s.srOnly}> (선택)</span> : null}</small></div>)}</section>)}</div>
    {view ? <><h2>핵심 요약</h2><ol className={s.summaryLines}>{view.summary.map(line => <li key={line.label}><small>{line.label}</small><p>{line.text}</p></li>)}</ol>
    <h2>대표 키워드</h2><ul className={s.keywords}>{view.keywords.map(k => <li key={k}>{k}</li>)}</ul></> : null}
  </div></>;
}

export function PreviewFooter({ publicPresentation = false }: { publicPresentation?: boolean }) {
  const [legal, setLegal] = useState(false);
  return <footer className={s.siteFooter}><div className={s.footerTop}><span className={s.wordmark}><b>결리포트</b><span>GYEOL REPORT</span></span><SocialLinks className={s.social} /></div>
    <p>{SUPPORT_COPY}</p><p>전화 상담은 제공하지 않습니다.</p>
    <details data-business><summary>사업자 정보 <span aria-hidden="true">+</span></summary><BusinessDetails /></details>
    <nav className={s.legalLinks} aria-label="정책 링크"><button type="button" onClick={() => setLegal(true)}>이용약관 · 개인정보처리방침 · 환불정책</button><MetaSettingsLink /></nav><p className={s.micro}>© 결리포트</p>
    {legal ? <DetailSheet title="이용약관과 정책" onClose={() => setLegal(false)}><LegalAccordion publicPresentation={publicPresentation} /></DetailSheet> : null}
  </footer>;
}
