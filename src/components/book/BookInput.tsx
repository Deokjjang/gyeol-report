"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { BOOKS, bookForProduct, readerTitle } from "../../lib/book/product";
import { bookInputPayload, emptyBookForm, personErrors, restoreBookForm, type BookFormState } from "../../lib/book/form";
import type { PersonInputState } from "../../lib/report-generation/reportInputPresentation";
import { MBTI_TYPES, FOCUS_AREAS, compatibilityRoleLabels, type CompatibilityRelationshipType } from "../../lib/report-generation/reportInputTypes";
import { BIRTH_TIME_SLOT_DEFINITIONS } from "../../lib/saju/birthTimePrecisionTypes";
import { getAnnualFortuneCommerceYearPolicy } from "../../lib/report-knowledge/annualFortuneYearRules";
import { JOBS, RELATIONSHIPS, CATEGORIES, PUBLISHING_STATES } from "../../app/dev/book-preview/model";
import { Publishing } from "../../app/dev/book-preview/BookPages";
import { BookCheckout } from "./BookCheckout";
import s from "../../app/dev/book-preview/book.module.css";
import f from "./flow.module.css";
import { interaction } from "../../lib/analytics/client";

function Fields({ person, change, prefix, role, errors, now, requiredGender }: { person: PersonInputState; change: (value: PersonInputState) => void; prefix: string; role: string; errors: Record<string, string>; now: string; requiredGender: boolean }) {
  const error = (key: string) => errors[`${prefix}.${key}`] ? <small id={`${prefix}-${key}-error`} role="alert" className={f.error}>{errors[`${prefix}.${key}`]}</small> : null;
  const a11y = (key: string) => ({ "aria-invalid": Boolean(errors[`${prefix}.${key}`]), "aria-describedby": errors[`${prefix}.${key}`] ? `${prefix}-${key}-error` : undefined });
  return <fieldset className={s.fields}><legend>{role}</legend>
    <label>{role} 이름<input id={`${prefix}-name`} value={person.name} maxLength={30} autoComplete="off" {...a11y("name")} onChange={e => change({ ...person, name: e.target.value })} />{error("name")}</label>
    <label>생년월일<input id={`${prefix}-birthDate`} type="date" min="1900-01-01" max={now.slice(0, 10)} value={person.birthDate} {...a11y("birthDate")} onChange={e => change({ ...person, birthDate: e.target.value })} />{error("birthDate")}</label>
    <label>성별{requiredGender ? " (필수)" : ""}<select id={`${prefix}-gender`} value={person.gender} {...a11y("gender")} onChange={e => change({ ...person, gender: e.target.value })}><option value="">미선택</option><option value="FEMALE">여성</option><option value="MALE">남성</option></select>{error("gender")}</label>
    <fieldset className={s.wide}><legend>출생시간</legend><div className={s.choices}>{[["exact", "정확"], ["approximate", "대략"], ["unknown", "모름"]].map(([value, label]) => <label key={value}><input type="radio" name={`${prefix}-precision`} checked={person.paidBirthTimeMode === value} onChange={() => change({ ...person, paidBirthTimeMode: value as PersonInputState["paidBirthTimeMode"], birthTime: "", timeBranch: "", birthTimeUnknown: value === "unknown" })} />{label}</label>)}</div></fieldset>
    {person.paidBirthTimeMode === "exact" ? <label className={s.wide}>태어난 시각<input id={`${prefix}-birthTime`} type="time" value={person.birthTime} {...a11y("birthTime")} onChange={e => change({ ...person, birthTime: e.target.value })} />{error("birthTime")}</label> : person.paidBirthTimeMode === "approximate" ? <label className={s.wide}>대략적인 시간대<select id={`${prefix}-birthTime`} value={person.timeBranch} {...a11y("birthTime")} onChange={e => change({ ...person, timeBranch: e.target.value as PersonInputState["timeBranch"] })}><option value="">시간대 선택</option>{BIRTH_TIME_SLOT_DEFINITIONS.map(slot => <option key={slot.value} value={slot.value}>{slot.labelKo}</option>)}</select>{error("birthTime")}</label> : null}
  </fieldset>;
}

function MbtiInput({ person, change, role }: { person: PersonInputState; change: (p: PersonInputState) => void; role: string }) {
  return <label>{role} MBTI<select value={person.mbtiType} onChange={e => change({ ...person, mbtiType: e.target.value })}>{MBTI_TYPES.map(v => <option key={v} value={v}>{v || "모름"}</option>)}</select></label>;
}

export function BookInput({ internal, now, initial }: { internal: boolean; now: string; initial?: BookFormState }) {
  const params = useSearchParams(), book = bookForProduct(params.get("product") ?? "") ?? BOOKS[0];
  // Product is the component key supplied by the wrapper below via navigation;
  // drafts are additionally namespaced per product and cannot activate routes.
  return <BookForm key={book.id} book={book} internal={internal} now={now} initial={initial} />;
}
function BookForm({ book, internal, now, initial }: { book: typeof BOOKS[number]; internal: boolean; now: string; initial?: BookFormState }) {
  useEffect(() => { interaction("book_viewed", book.productKey); }, [book.productKey]);
  const policy = getAnnualFortuneCommerceYearPolicy(new Date(now)), key = `gyeol-book-input-v1:${book.productKey}`;
  const [state, setState] = useState(initial ?? emptyBookForm(policy.currentYear)), [step, setStep] = useState(0), [ready, setReady] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({}), [message, setMessage] = useState(""), [checking, setChecking] = useState(false), [publishing, setPublishing] = useState(false), [decoration, setDecoration] = useState(0);
  const scroll = useRef<HTMLDivElement>(null), validationId = useRef(0), reachedStep = useRef(0);
  const total = ["love", "annual"].includes(book.id) ? 3 : 2, receipt = step === total;
  const pair = book.id === "compatibility", roles = compatibilityRoleLabels(state.category), requiredGender = ["major", "annual"].includes(book.id);
  const payload = bookInputPayload(book, state), title = readerTitle(book, state.person.selectedYear);
  useEffect(() => {
    const restore = setTimeout(() => {
      if (!initial) { try { const saved = restoreBookForm(JSON.parse(sessionStorage.getItem(key) ?? "null"), policy.currentYear); if (saved) setState(saved); } catch { /* unavailable storage does not block input */ } }
      setReady(true);
    }, 0);
    // Preserve Next's history metadata. Browser back/forward restores only a
    // page already reached through validation; a hash cannot skip validation.
    window.history.replaceState({ ...window.history.state, bookInputProduct: book.id, bookInputPage: 0 }, "");
    const back = (event: PopStateEvent) => {
      const value = event.state?.bookInputProduct === book.id ? event.state.bookInputPage : 0;
      setStep(Number.isInteger(value) ? Math.max(0, Math.min(reachedStep.current, value)) : 0);
      setPublishing(false); setMessage("");
    };
    window.addEventListener("popstate", back); return () => { clearTimeout(restore); window.removeEventListener("popstate", back); };
  }, [key, policy.currentYear, initial, book.id]);
  useEffect(() => { if (ready) { try { sessionStorage.setItem(key, JSON.stringify({ version: 1, state })); } catch { /* optional local draft */ } } }, [state, ready, key]);
  useEffect(() => { scroll.current?.scrollTo({ top: 0 }); scroll.current?.focus({ preventScroll: true }); }, [step]);
  useEffect(() => { if (!publishing) return; const timer = setInterval(() => setDecoration(n => Math.min(3, n + 1)), 1000); return () => clearInterval(timer); }, [publishing]);
  const update = (next: BookFormState) => { interaction("input_started", book.productKey); validationId.current++; setState(next); setErrors({}); setMessage(""); };
  const next = async () => {
    if (checking) return;
    interaction("input_started", book.productKey);
    const found: Record<string, string> = {};
    for (const [slot, person] of pair ? [["a", state.person], ["b", state.personB]] as const : [["a", state.person]] as const) for (const [field, text] of Object.entries(personErrors(person, now, requiredGender))) found[`${slot}.${field}`] = text;
    if (Object.keys(found).length) { setStep(0); setErrors(found); setTimeout(() => document.getElementById(Object.keys(found)[0].replace(".", "-"))?.focus(), 0); return; }
    if (step === total - 1 && (internal || requiredGender)) {
      setChecking(true); const attempt = ++validationId.current;
      try {
        const response = await fetch(internal ? "/dev/book-flow/api" : "/api/reports/validate-input", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(internal ? { operation: "validate", payload } : payload) });
        // Public preflight endpoint intentionally accepts only Dayun products;
        // other public products are checked by the unchanged checkout server.
        const result = await response.json();
        if (attempt !== validationId.current) return;
        if (!result.ok) { setMessage(typeof result.error === "string" ? result.error : "입력 정보를 확인해 주세요."); return; }
      } catch { setMessage("입력을 확인하지 못했습니다. 다시 시도해 주세요."); return; }
      finally { setChecking(false); }
    }
    const nextStep = Math.min(total, step + 1);
    if (nextStep === total) interaction("input_completed", book.productKey);
    reachedStep.current = Math.max(reachedStep.current, nextStep);
    setStep(nextStep); window.history.pushState({ ...window.history.state, bookInputProduct: book.id, bookInputPage: nextStep }, "", `#page-${nextStep + 1}`);
  };
  const relation = <label>관계 상태<select value={state.person.relationshipStatus} onChange={e => update({ ...state, person: { ...state.person, relationshipStatus: e.target.value } })}>{RELATIONSHIPS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>;
  const home = internal ? "/dev/book-flow" : "/";
  return <main className={`${s.root} ${f.flow}`} data-book-input data-step={step} style={{ "--cover": book.color, "--ink": book.ink } as CSSProperties}>
    <header className={s.header}><a href={home} className={s.wordmark}><b>결리포트</b><span>GYEOL REPORT</span></a><a href={home} className={s.close}>닫기 ×</a></header>
    {publishing ? <div data-observed-status="REQUESTED" data-intermediate-states="decorative"><Publishing book={book} name={state.person.name} state={PUBLISHING_STATES[decoration]} notice="내부 검수 · 실제 결제 없음" /><p className={f.status} role="status">책을 생성하고 있습니다. 종이·제본 움직임은 연출이며 진행률이 아닙니다.</p></div> : null}
    <section className={s.bookShell} hidden={publishing}><div className={s.pageScroll} ref={scroll} tabIndex={-1} role="region" aria-label="책 입력">
      {!ready ? <p role="status">입력 준비 중</p> : receipt ? <BookCheckout payload={payload} now={now} internal={internal} onPublishing={() => { setDecoration(0); setPublishing(true); }} onError={text => { if (text) setPublishing(false); setMessage(text); }} /> : <form noValidate onSubmit={e => { e.preventDefault(); void next(); }}>
        <p className={s.eyebrow}>{title} / {String(step + 1).padStart(2, "0")}</p><h1>{step === 0 ? "이 책의 주인공" : step === 1 ? "지금의 나" : book.id === "annual" ? "읽고 싶은 한 해" : "지금의 관계"}</h1>
        {step === 0 ? <>{pair ? <label>관계 유형<select value={state.category} onChange={e => update({ ...state, category: e.target.value as CompatibilityRelationshipType })}>{CATEGORIES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label> : null}<Fields person={state.person} change={p => update({ ...state, person: { ...state.person, ...p } })} prefix="a" role={pair ? roles.personA : "주인공"} errors={errors} now={now} requiredGender={requiredGender} />{pair ? <Fields person={state.personB} change={p => update({ ...state, personB: p })} prefix="b" role={roles.personB} errors={errors} now={now} requiredGender={false} /> : null}</> : null}
        {step === 1 ? <div className={s.fields}><MbtiInput person={state.person} change={p => update({ ...state, person: { ...state.person, ...p } })} role={pair ? roles.personA : ""} />{pair ? <MbtiInput person={state.personB} change={p => update({ ...state, personB: p })} role={roles.personB} /> : <>
          <label>현재 상태<select value={state.person.jobStatus} onChange={e => update({ ...state, person: { ...state.person, jobStatus: e.target.value } })}><option value="">미선택</option>{JOBS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}<option value="other">기타</option></select></label>
          <label className={s.wide}>현재 직업<input value={state.person.detailedJob} maxLength={200} onChange={e => update({ ...state, person: { ...state.person, detailedJob: e.target.value } })} /></label>{book.id !== "love" ? relation : null}
          <fieldset className={s.wide}><legend>관심 분야 (선택)</legend><div className={s.choices}>{FOCUS_AREAS.map(area => <label key={area}><input type="checkbox" checked={state.person.focusAreas.includes(area)} onChange={e => update({ ...state, person: { ...state.person, focusAreas: e.target.checked ? [...state.person.focusAreas, area] : state.person.focusAreas.filter(a => a !== area) } })} />{area}</label>)}</div></fieldset>
        </>}</div> : null}
        {step === 2 ? book.id === "love" ? relation : <label>선택 연도<select value={state.person.selectedYear} onChange={e => update({ ...state, person: { ...state.person, selectedYear: e.target.value } })}>{policy.selectableYears.map(year => <option key={year}>{year}</option>)}</select></label> : null}
        <button type="submit" className={f.next} disabled={checking}>{checking ? "입력 확인 중" : "다음 페이지"} →</button>
      </form>}
      {message ? <p className={f.error} role="alert">{message}</p> : null}
    </div><nav className={s.pageNav} aria-label="입력 페이지"><button aria-label="이전 페이지" disabled={!step || checking} onClick={() => window.history.back()}>←</button><span><strong>{title}</strong><span>{step + 1} / {total + 1}</span></span><a href={home}>책장 ↗</a></nav></section>
  </main>;
}
