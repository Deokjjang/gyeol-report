"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { BOOKS, bookForProduct, readerTitle } from "../../lib/book/product";
import { bookInputPayload, emptyBookForm, personErrors, restoreBookForm, type BookFormState } from "../../lib/book/form";
import type { PersonInputState } from "../../lib/report-generation/reportInputPresentation";
import { compatibilityRoleLabels, type CompatibilityRelationshipType } from "../../lib/report-generation/reportInputTypes";
import { BIRTH_TIME_SLOT_DEFINITIONS } from "../../lib/saju/birthTimePrecisionTypes";
import { getAnnualFortuneCommerceYearPolicy } from "../../lib/report-knowledge/annualFortuneYearRules";
import { RELATIONSHIPS, CATEGORIES, PUBLISHING_STATES } from "../../app/dev/book-preview/model";
import PRODUCTS from "../../data/book-pages/products.json";
import { Publishing } from "../../app/dev/book-preview/BookPages";
import { BookCheckout } from "./BookCheckout";
import s from "../../app/dev/book-preview/book.module.css";
import f from "./flow.module.css";
import { interaction } from "../../lib/analytics/client";
import { checkoutReturnKey, ticketPendingKey } from "./useTicketPublication";
import { bundleReturnKey } from "../../lib/tickets/shopContract";
import { AccountChannelOnboarding } from "../account/AccountSession";

const pad = (v: string) => v.padStart(2, "0");
/** 생년월일 숫자 3칸(숫자 키패드, 다 차면 다음 칸). 세 칸이 모두 맞을 때만 YYYY-MM-DD로 올린다. */
function DateDigits({ id, value, onChange, invalid, describedBy }: { id: string; value: string; onChange: (v: string) => void; invalid: boolean; describedBy?: string }) {
  const [parts, setParts] = useState(() => { const m = value.match(/^(\d{4})-(\d{2})-(\d{2})$/); return m ? [m[1], String(Number(m[2])), String(Number(m[3]))] : ["", "", ""]; });
  const refs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
  const set = (i: number, raw: string) => {
    const v = raw.replace(/\D/g, "").slice(0, i ? 2 : 4), next = parts.map((p, j) => j === i ? v : p);
    setParts(next);
    onChange(next[0].length === 4 && next[1] && next[2] ? `${next[0]}-${pad(next[1])}-${pad(next[2])}` : "");
    if ((i === 0 && v.length === 4) || (i === 1 && (v.length === 2 || Number(v) > 1))) refs[i + 1].current?.focus();
  };
  return <div className={s.digits} role="group" aria-labelledby={`${id}-label`}>{(["년", "월", "일"] as const).map((unit, i) => <label key={unit}><input ref={refs[i]} id={i ? `${id}-${i}` : id} inputMode="numeric" pattern="[0-9]*" autoComplete={["bday-year", "bday-month", "bday-day"][i]} placeholder={["1994", "3", "17"][i]} value={parts[i]} aria-label={unit === "년" ? "태어난 해" : unit === "월" ? "태어난 달" : "태어난 날"} aria-invalid={invalid} aria-describedby={describedBy} onChange={e => set(i, e.target.value)} /><span aria-hidden="true">{unit}</span></label>)}</div>;
}
/** 태어난 시각 시·분 숫자 2칸(24시간). 둘 다 맞을 때만 HH:MM으로 올린다. */
function TimeDigits({ id, value, onChange, invalid, describedBy }: { id: string; value: string; onChange: (v: string) => void; invalid: boolean; describedBy?: string }) {
  const [parts, setParts] = useState(() => { const m = value.match(/^(\d{2}):(\d{2})$/); return m ? [m[1], m[2]] : ["", ""]; });
  const minute = useRef<HTMLInputElement>(null);
  const set = (i: number, raw: string) => {
    const v = raw.replace(/\D/g, "").slice(0, 2), next = parts.map((p, j) => j === i ? v : p);
    setParts(next);
    const ok = next[0] !== "" && next[1].length === 2 && Number(next[0]) < 24 && Number(next[1]) < 60;
    onChange(ok ? `${pad(next[0])}:${next[1]}` : "");
    if (i === 0 && (v.length === 2 || Number(v) > 2)) minute.current?.focus();
  };
  return <div className={`${s.digits} ${s.time}`} role="group" aria-labelledby={`${id}-label`}>{(["시", "분"] as const).map((unit, i) => <label key={unit}><input ref={i ? minute : undefined} id={i ? `${id}-m` : id} inputMode="numeric" pattern="[0-9]*" placeholder={i ? "27" : "8"} value={parts[i]} aria-label={unit === "시" ? "시" : "분"} aria-invalid={invalid} aria-describedby={describedBy} onChange={e => set(i, e.target.value)} /><span aria-hidden="true">{unit}</span></label>)}</div>;
}
function Segment<T extends string>({ label, value, options, onChange, id, even = false, labelId }: { label?: string; value: T | ""; options: readonly (readonly [T, string])[]; onChange: (v: T) => void; id?: string; even?: boolean; labelId?: string }) {
  return <div className={`${s.segment} ${even ? s.even : ""}`} role="group" aria-label={labelId ? undefined : label} aria-labelledby={labelId}>{options.map(([v, text], i) => <button type="button" key={v} id={i === 0 ? id : undefined} aria-pressed={value === v} onClick={() => onChange(v)}>{text}</button>)}</div>;
}

export function Fields({ person, change, prefix, role, errors, now, requiredGender, pair = false }: { person: PersonInputState; change: (value: PersonInputState) => void; prefix: string; role: string; errors: Record<string, string>; now: string; requiredGender: boolean; pair?: boolean }) {
  const error = (key: string) => errors[`${prefix}.${key}`] ? <small id={`${prefix}-${key}-error`} role="alert" className={f.error}>{errors[`${prefix}.${key}`]}</small> : null;
  const invalid = (key: string) => Boolean(errors[`${prefix}.${key}`]), described = (key: string) => errors[`${prefix}.${key}`] ? `${prefix}-${key}-error` : undefined;
  void now;
  return <fieldset className={s.fields}><legend className={pair ? undefined : s.srOnly}>{role}</legend>
    <div className={s.field}><label className={s.fieldLabel} htmlFor={`${prefix}-name`}>이름</label><input className={s.textInput} id={`${prefix}-name`} value={person.name} maxLength={30} autoComplete="off" placeholder="책에 들어갈 이름이나 별명" aria-invalid={invalid("name")} aria-describedby={described("name")} onChange={e => change({ ...person, name: e.target.value })} />{error("name")}</div>
    <div className={s.field}><span className={s.fieldLabel} id={`${prefix}-birthDate-label`}>생년월일 (양력)</span><DateDigits id={`${prefix}-birthDate`} value={person.birthDate} invalid={invalid("birthDate")} describedBy={described("birthDate")} onChange={birthDate => change({ ...person, birthDate })} />{error("birthDate")}</div>
    <div className={s.field}><span className={s.fieldLabel} id={`${prefix}-gender-label`}>성별{requiredGender ? " (필수)" : ""}</span><Segment id={`${prefix}-gender`} labelId={`${prefix}-gender-label`} value={person.gender as "FEMALE" | "MALE" | ""} options={[["FEMALE", "여성"], ["MALE", "남성"]]} even onChange={gender => change({ ...person, gender })} />{error("gender")}</div>
    <div className={s.field}><span className={s.fieldLabel} id={`${prefix}-precision-label`}>태어난 시각</span><Segment labelId={`${prefix}-precision-label`} value={person.paidBirthTimeMode as "exact" | "approximate" | "unknown"} options={[["exact", "정확"], ["approximate", "대략"], ["unknown", "모름"]]} even onChange={value => change({ ...person, paidBirthTimeMode: value as PersonInputState["paidBirthTimeMode"], birthTime: "", timeBranch: "", birthTimeUnknown: value === "unknown" })} />
      {person.paidBirthTimeMode === "exact" ? <><span className={s.srOnly} id={`${prefix}-birthTime-label`}>태어난 시각 시와 분</span><TimeDigits key="exact" id={`${prefix}-birthTime`} value={person.birthTime} invalid={invalid("birthTime")} describedBy={described("birthTime")} onChange={birthTime => change({ ...person, birthTime })} /></>
        : person.paidBirthTimeMode === "approximate" ? <select className={s.textInput} id={`${prefix}-birthTime`} aria-label="대략적인 시간대(시진)" value={person.timeBranch} aria-invalid={invalid("birthTime")} aria-describedby={described("birthTime")} onChange={e => change({ ...person, timeBranch: e.target.value as PersonInputState["timeBranch"] })}><option value="">시간대 고르기</option>{BIRTH_TIME_SLOT_DEFINITIONS.map(slot => <option key={slot.value} value={slot.value}>{slot.labelKo}</option>)}</select>
        : <p className={s.fieldNote}>모르면 태어난 시각 없이 계산합니다. 시주는 쓰지 않아요.</p>}{error("birthTime")}</div>
  </fieldset>;
}

const AXES = [["E", "I"], ["S", "N"], ["T", "F"], ["J", "P"]] as const;
/** MBTI 4쌍 토글. 네 쌍을 모두 고르면 유형이 정해지고, '모름'은 유형 없이 쓴다(MBTI 근거를 만들지 않음). */
export function MbtiInput({ person, change, role }: { person: PersonInputState; change: (p: PersonInputState) => void; role: string }) {
  const [letters, setLetters] = useState<string[]>(() => /^[EI][SN][TF][JP]$/.test(person.mbtiType) ? person.mbtiType.split("") : ["", "", "", ""]);
  const pick = (i: number, letter: string) => { const next = letters.map((l, j) => j === i ? letter : l); setLetters(next); change({ ...person, mbtiType: next.every(Boolean) ? next.join("") : "" }); };
  const unknown = letters.every(l => !l);
  return <div className={s.field}><span className={s.fieldLabel} id={`mbti-${role || "a"}-label`}>{role ? `${role} MBTI` : "MBTI"}</span>
    <div className={s.mbti} role="group" aria-labelledby={`mbti-${role || "a"}-label`}>{AXES.map((pair, i) => <div key={pair.join("")}>{pair.map(letter => <button type="button" key={letter} aria-pressed={letters[i] === letter} onClick={() => pick(i, letter)}>{letter}</button>)}</div>)}</div>
    <p className={s.fieldNote}>{letters.every(Boolean) ? `${letters.join("")}로 읽습니다.` : unknown ? "모르면 비워 두세요. MBTI 없이 사주로만 씁니다." : "네 쌍을 모두 고르면 유형이 정해집니다."} {!unknown ? <button type="button" className={s.fieldNote} style={{ textDecoration: "underline", textUnderlineOffset: 3 }} onClick={() => { setLetters(["", "", "", ""]); change({ ...person, mbtiType: "" }); }}>모름으로 바꾸기</button> : <a href="https://www.16personalities.com/ko" target="_blank" rel="noopener noreferrer">무료 검사 하러 가기 (새 창)</a>}</p></div>;
}

const STATUS = [["employee", "직장인"], ["student", "학생"], ["freelancer", "프리랜서"], ["self_employed", "자영업"], ["job_seeker", "구직"], ["other", "기타"]] as const;
const PRODUCT_PAGES = PRODUCTS.products as Record<string, { lines: string[]; toc: string[] } | undefined>;

export function BookInput({ internal, now, initial, authEnabled = internal, ticketShopEnabled = false }: { internal: boolean; now: string; initial?: BookFormState; authEnabled?: boolean; ticketShopEnabled?: boolean }) {
  const params = useSearchParams(), book = bookForProduct(params.get("product") ?? "") ?? BOOKS[0];
  // Product is the component key supplied by the wrapper below via navigation;
  // drafts are additionally namespaced per product and cannot activate routes.
  return <BookForm key={book.id} book={book} internal={internal} now={now} initial={initial} authEnabled={authEnabled} ticketShopEnabled={ticketShopEnabled} />;
}
function BookForm({ book, internal, now, initial, authEnabled, ticketShopEnabled }: { book: typeof BOOKS[number]; internal: boolean; now: string; initial?: BookFormState; authEnabled: boolean; ticketShopEnabled: boolean }) {
  useEffect(() => { interaction("book_viewed", book.productKey); }, [book.productKey]);
  const policy = getAnnualFortuneCommerceYearPolicy(new Date(now)), key = `gyeol-book-input-v1:${book.productKey}`;
  const [state, setState] = useState(initial ?? emptyBookForm(policy.currentYear)), [step, setStep] = useState(0), [ready, setReady] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({}), [message, setMessage] = useState(""), [checking, setChecking] = useState(false), [publishing, setPublishing] = useState(false), [decoration, setDecoration] = useState(0);
  const scroll = useRef<HTMLDivElement>(null), validationId = useRef(0), reachedStep = useRef(0);
  const draftWritable = useRef(true);
  const total = ["love", "annual"].includes(book.id) ? 3 : 2, receipt = step === total;
  const pair = book.id === "compatibility", roles = compatibilityRoleLabels(state.category), requiredGender = ["major", "annual"].includes(book.id);
  const payload = bookInputPayload(book, state), title = readerTitle(book, state.person.selectedYear);
  useEffect(() => {
    let active = true;
    const restore = setTimeout(async () => {
      if (!initial) { try {
        const returnContext = JSON.parse(sessionStorage.getItem(bundleReturnKey) ?? "null");
        if (ticketShopEnabled && returnContext?.product === book.productKey) {
          draftWritable.current = false;
          const r = await fetch(`${internal ? "/dev/account/tickets/api" : "/api/ticket-bundles"}/state`, { cache: "no-store", signal: AbortSignal.timeout(15_000) });
          const current = await r.json();
          if (!active) return;
          if (!r.ok || current.scope !== returnContext.scope) {
            setMessage("원래 계정으로 로그인한 뒤 구매를 이어가 주세요. 이전 계정의 입력은 자동 복원하지 않았습니다."); setReady(true); return;
          }
          draftWritable.current = true;
        }
        const saved = restoreBookForm(JSON.parse(sessionStorage.getItem(key) ?? "null"), policy.currentYear);
        if (saved) {
          setState(saved);
          const returnToReceipt = sessionStorage.getItem(checkoutReturnKey(book.productKey)) === "1" || sessionStorage.getItem(ticketPendingKey(book.productKey)) !== null;
          const persons = pair ? [saved.person, saved.personB] : [saved.person];
          if (returnToReceipt && persons.every(p => Object.keys(personErrors(p, now, requiredGender)).length === 0)) {
            // Local hint only. No restored consent, balance, gate or publication.
            reachedStep.current = total; setStep(total);
            window.history.replaceState({ ...window.history.state, bookInputProduct: book.id, bookInputPage: total }, "");
          }
        }
      } catch { if (active && !draftWritable.current) setMessage("계정을 확인하지 못해 입력을 복원하지 않았습니다. 기존 입력은 보존되어 있습니다. 다시 로그인한 뒤 새로고침해 주세요."); } }
      if (active) setReady(true);
    }, 0);
    // Preserve Next's history metadata. Browser back/forward restores only a
    // page already reached through validation; a hash cannot skip validation.
    window.history.replaceState({ ...window.history.state, bookInputProduct: book.id, bookInputPage: 0 }, "");
    const back = (event: PopStateEvent) => {
      const value = event.state?.bookInputProduct === book.id ? event.state.bookInputPage : 0;
      setStep(Number.isInteger(value) ? Math.max(0, Math.min(reachedStep.current, value)) : 0);
      setPublishing(false); setMessage("");
    };
    window.addEventListener("popstate", back); return () => { active = false; clearTimeout(restore); window.removeEventListener("popstate", back); };
  }, [key, policy.currentYear, initial, book.id, book.productKey, now, pair, requiredGender, total, internal, ticketShopEnabled]);
  useEffect(() => { if (ready && draftWritable.current) { try { sessionStorage.setItem(key, JSON.stringify({ version: 1, state })); } catch { /* optional local draft */ } } }, [state, ready, key]);
  useEffect(() => { window.scrollTo({ top: 0 }); scroll.current?.focus({ preventScroll: true }); }, [step]);
  useEffect(() => { if (!publishing) return; const timer = setInterval(() => setDecoration(n => Math.min(3, n + 1)), 1000); return () => clearInterval(timer); }, [publishing]);
  const update = (next: BookFormState) => {
    if (!draftWritable.current) {
      // Only an explicit new edit may replace a draft whose owner was not verified.
      draftWritable.current = true;
      try { sessionStorage.removeItem(bundleReturnKey); sessionStorage.removeItem(checkoutReturnKey(book.productKey)); } catch { /* optional local hint */ }
    }
    interaction("input_started", book.productKey); validationId.current++; setState(next); setErrors({}); setMessage("");
  };
  const next = async () => {
    if (checking) return;
    interaction("input_started", book.productKey);
    const found: Record<string, string> = {};
    for (const [slot, person] of pair ? [["a", state.person], ["b", state.personB]] as const : [["a", state.person]] as const) for (const [field, text] of Object.entries(personErrors(person, now, requiredGender))) found[`${slot}.${field}`] = text;
    if (Object.keys(found).length) { setStep(0); setErrors(found); setTimeout(() => document.getElementById(Object.keys(found)[0].replace(".", "-"))?.focus(), 0); return; }
    if (step === total - 1 && (internal || requiredGender || pair)) {
      setChecking(true); const attempt = ++validationId.current;
      try {
        const localValidation = internal && !requiredGender;
        const response = await fetch(localValidation ? "/dev/book-flow/api" : "/api/reports/validate-input", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(localValidation ? { operation: "validate", payload } : payload) });
        // Public preflight endpoint accepts Dayun products and compatibility;
        // other public products are checked by the unchanged checkout server.
        const result = await response.json();
        if (attempt !== validationId.current) return;
        if (!result.ok) { setMessage(typeof result.message === "string" ? result.message : typeof result.error === "string" ? result.error : "입력 정보를 확인해 주세요."); return; }
      } catch { setMessage("입력을 확인하지 못했습니다. 다시 시도해 주세요."); return; }
      finally { setChecking(false); }
    }
    const nextStep = Math.min(total, step + 1);
    if (nextStep === total) interaction("input_completed", book.productKey);
    reachedStep.current = Math.max(reachedStep.current, nextStep);
    setStep(nextStep); window.history.pushState({ ...window.history.state, bookInputProduct: book.id, bookInputPage: nextStep }, "", `#page-${nextStep + 1}`);
  };
  const relation = <div className={s.field}><span className={s.fieldLabel} id="relationship-label">지금의 관계</span><Segment labelId="relationship-label" value={state.person.relationshipStatus} options={RELATIONSHIPS.filter(([value]) => value)} onChange={relationshipStatus => update({ ...state, person: { ...state.person, relationshipStatus } })} /></div>;
  const home = internal ? "/dev/book-flow" : "/", library = internal ? "/dev/account" : "/account", intro = PRODUCT_PAGES[book.productKey];
  return <main className={`${s.root} ${f.flow}`} data-book-input data-step={step} style={{ "--cover": book.color, "--cover-ink": book.ink } as CSSProperties}>
    {authEnabled && ready && !receipt && !publishing && !checking ? <AccountChannelOnboarding local={internal} /> : null}
    <header className={s.header}><a href={home} className={s.wordmark}><b>결리포트</b><span>GYEOL REPORT</span></a><a href={home} className={s.close}>닫기</a></header>
    {internal && publishing ? <div data-observed-status="REQUESTED" data-intermediate-states="decorative"><Publishing book={book} name={state.person.name} state={PUBLISHING_STATES[decoration]} notice="내부 검수 · 실제 결제 없음" /><p className={f.status} role="status">책을 생성하고 있습니다. 종이·제본 움직임은 연출이며 진행률이 아닙니다.</p></div> : null}
    <section className={s.bookShell} hidden={publishing}><div className={s.pageScroll} ref={scroll} tabIndex={-1} role="region" aria-label="책 입력">
      {!ready ? <p role="status">입력 준비 중</p> : receipt ? <><button type="button" className={s.close} style={{ marginBottom: 16, justifyContent: "flex-start" }} onClick={() => window.history.back()}>← 입력 고치기</button><BookCheckout payload={payload} now={now} internal={internal} authEnabled={authEnabled} ticketShopEnabled={ticketShopEnabled} onPublishing={() => { if (internal) { setDecoration(0); setPublishing(true); } }} onError={text => { if (text) setPublishing(false); setMessage(text); }} /></> : <form noValidate onSubmit={e => { e.preventDefault(); void next(); }}>
        <p className={s.eyebrow}>{title} · {step + 1} / {total + 1}</p><h1>{step === 0 ? "이 책의 주인공" : step === 1 ? "지금의 나" : book.id === "annual" ? "읽고 싶은 한 해" : "지금의 관계"}</h1>
        {step === 0 && intro ? <section className={s.intro} aria-label="이 책에서 알게 되는 것"><ul>{intro.lines.map(line => <li key={line}>{line}</li>)}</ul><details><summary>목차 미리보기 ({intro.toc.length}장)</summary><ol>{intro.toc.map(t => <li key={t}>{t}</li>)}</ol></details></section> : null}
        {step === 0 ? <>{pair ? <div className={s.field} style={{ marginBottom: 32 }}><span className={s.fieldLabel} id="category-label">두 사람의 관계</span><Segment labelId="category-label" value={state.category} options={CATEGORIES} onChange={category => update({ ...state, category: category as CompatibilityRelationshipType })} /></div> : null}<Fields person={state.person} change={p => update({ ...state, person: { ...state.person, ...p } })} prefix="a" role={pair ? roles.personA : "주인공"} pair={pair} errors={errors} now={now} requiredGender={requiredGender} />{pair ? <Fields person={state.personB} change={p => update({ ...state, personB: p })} prefix="b" role={roles.personB} pair errors={errors} now={now} requiredGender={false} /> : null}</> : null}
        {step === 1 ? <div className={s.fields}><MbtiInput person={state.person} change={p => update({ ...state, person: { ...state.person, ...p } })} role={pair ? roles.personA : ""} />{pair ? <MbtiInput person={state.personB} change={p => update({ ...state, personB: p })} role={roles.personB} /> : <>
          <div className={s.field}><span className={s.fieldLabel} id="job-label">하는 일</span><Segment labelId="job-label" value={state.person.jobStatus} options={STATUS} onChange={jobStatus => update({ ...state, person: { ...state.person, jobStatus } })} />
            <input className={s.textInput} aria-label="직업 (선택)" value={state.person.detailedJob} maxLength={200} placeholder="직업이 있다면 적어 주세요. 예: 서비스 기획자, 간호사" onChange={e => update({ ...state, person: { ...state.person, detailedJob: e.target.value } })} /></div>
          {book.id !== "love" ? relation : null}
        </>}</div> : null}
        {step === 2 ? book.id === "love" ? <div className={s.fields}>{relation}</div> : <div className={s.fields}><div className={s.field}><span className={s.fieldLabel} id="year-label">연도</span><Segment labelId="year-label" value={state.person.selectedYear} options={policy.selectableYears.map(year => [String(year), `${year}년`] as const)} onChange={selectedYear => update({ ...state, person: { ...state.person, selectedYear } })} /></div></div> : null}
        <button type="submit" className={s.primary} disabled={checking}>{checking ? "입력 확인 중" : step === total - 1 ? "주문서 보기" : "다음"}</button>
      </form>}
      {message ? <p className={f.error} role="alert">{message}</p> : null}
    </div>{receipt ? null : <nav className={s.pageNav} aria-label="입력 페이지" style={{ "--progress": `${Math.round((step + 1) / (total + 1) * 100)}%` } as CSSProperties}><button aria-label="이전 페이지" disabled={!step || checking} onClick={() => window.history.back()}>←</button><span><strong>{title}</strong><span>{step + 1} / {total + 1}</span></span><a href={library}>내 서재</a></nav>}</section>
  </main>;
}
