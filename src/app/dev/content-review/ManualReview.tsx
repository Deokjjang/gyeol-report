"use client";
import { useEffect, useRef, useState } from "react";
import { Fields, MbtiInput } from "../../../components/book/BookInput";
import { bookInputPayload, type BookFormState } from "../../../lib/book/form";
import { readerTitle } from "../../../lib/book/product";
import { FOCUS_AREAS, compatibilityRoleLabels, type CompatibilityRelationshipType } from "../../../lib/report-generation/reportInputTypes";
import { getAnnualFortuneCommerceYearPolicy } from "../../../lib/report-knowledge/annualFortuneYearRules";
import { JOBS, RELATIONSHIPS, CATEGORIES } from "../book-preview/model";
import { CASES, applyReviewEvent, emptyReview, reviewContext, reviewHref, type ReviewCase, type ReviewEvent } from "./model";
import { loadReview, saveReviewCase } from "./storage";
import s from "./review.module.css";

export function ManualReview({ now }: { now: string }) {
  const policy = getAnnualFortuneCommerceYearPolicy(new Date(now));
  const [cases, setCases] = useState(() => emptyReview(policy.currentYear)), [loaded, setLoaded] = useState(false), [notice, setNotice] = useState("");
  const latest = useRef(cases), controllers = useRef<Record<string, AbortController>>({});
  useEffect(() => {
    let alive = true;
    loadReview(policy.currentYear).then(state => { if (alive) { latest.current = state; setCases(state); } }).catch(() => { if (alive) setNotice("브라우저 저장소를 사용할 수 없습니다. 이 탭의 입력만 유지되며 새 탭 열기는 불가합니다."); }).finally(() => { if (alive) setLoaded(true); });
    const running = controllers.current;
    return () => { alive = false; Object.values(running).forEach(c => c.abort()); };
  }, [policy.currentYear]);
  const put = (id: string, value: ReviewCase) => {
    latest.current = { ...latest.current, [id]: value };
    if (value.phase !== "ready") setCases(latest.current);
    return saveReviewCase(id, value).then(() => {
      // Do not expose a new-tab link before the complete book has been saved.
      if (latest.current[id] === value) setCases({ ...latest.current });
    }).catch(() => {
      setNotice("저장 실패: 입력은 이 탭에 남아 있습니다. 브라우저 저장소를 확인한 뒤 다시 생성하세요.");
      if (latest.current[id] === value && value.phase === "ready") {
        latest.current = { ...latest.current, [id]: { ...value, phase: "failed", result: undefined, error: "storage: SAVE_FAILED" } };
        setCases(latest.current);
      }
    });
  };
  const update = (id: string, form: BookFormState) => {
    controllers.current[id]?.abort();
    void put(id, { form, phase: "not-generated" });
  };
  const reset = (id: string) => update(id, emptyReview(policy.currentYear)[id].form);
  const generate = async (id: string) => {
    controllers.current[id]?.abort();
    const control = new AbortController(); controllers.current[id] = control;
    const form = latest.current[id].form, generationId = crypto.randomUUID();
    void put(id, { form, generationId, phase: "validating" });
    const accept = (event: ReviewEvent) => {
      if (event.caseId !== id || latest.current[id].generationId !== generationId || control.signal.aborted) return;
      void put(id, applyReviewEvent(latest.current[id], event));
    };
    try {
      const response = await fetch("/dev/content-review/api", { method: "POST", headers: { "content-type": "application/json" }, signal: control.signal,
        body: JSON.stringify({ caseId: id, generationId, payload: bookInputPayload(CASES.find(c => c.id === id)!.book, form) }) });
      if (!response.ok || !response.body) { accept({ caseId: id, generationId, phase: "failed", error: `validation: HTTP_${response.status}` }); return; }
      const reader = response.body.getReader(), decoder = new TextDecoder(); let buffer = "";
      while (true) {
        const { value, done } = await reader.read(); buffer += decoder.decode(value, { stream: !done });
        const lines = buffer.split("\n"); buffer = lines.pop() ?? "";
        for (const line of lines) if (line.trim()) accept(JSON.parse(line));
        if (done) break;
      }
      if (!["ready", "failed"].includes(latest.current[id].phase)) accept({ caseId: id, generationId, phase: "failed", error: "generation: STREAM_INCOMPLETE" });
    } catch { if (!control.signal.aborted) accept({ caseId: id, generationId, phase: "failed", error: "generation: REQUEST_FAILED" }); }
  };
  const copy = async (id: string) => {
    const result = latest.current[id].result;
    if (!result) return;
    try { await navigator.clipboard.writeText(reviewContext(result)); setNotice(`CASE ${id} 검수 정보를 복사했습니다.`); } catch { setNotice("복사 권한이 없습니다. 검수 정보를 펼쳐 직접 선택해 주세요."); }
  };
  return <main className={s.root}>
    <header><p>LOCAL / DEV ONLY · 본문 변경 없음</p><h1>V4 CONTENT REVIEW</h1><p>여섯 입력은 서로 독립적입니다. 생성할 때만 계산합니다. 실제 개인정보 대신 검수용 값을 입력하세요.</p>
      <a href="/dev/content-review/experience">로그인부터 전체 기능·UI/UX 검수 →</a>
      <p>이 화면: 결제·이용권·쿠폰·서재·보상·분석 이벤트 저장 없음. 입력/책은 이 브라우저의 검수 전용 저장소에만 보존됩니다.</p>
      <button disabled={!loaded} onClick={() => { if (window.confirm("여섯 검수 입력과 생성 결과를 모두 지울까요? 실제 계정 데이터에는 영향이 없습니다.")) CASES.forEach(c => reset(c.id)); }}>전체 Reset</button>
    </header>
    <p role="status">{!loaded ? "검수 입력 복구 중…" : notice}</p>
    {CASES.map(({ id, book }) => {
      const entry = cases[id], form = entry.form, pair = book.id === "compatibility", roles = compatibilityRoleLabels(form.category);
      const change = (next: BookFormState) => update(id, next);
      const context = (field: string, value: string) => change({ ...form, person: { ...form.person, [field]: value } });
      const busy = ["validating", "generating", "validating-output"].includes(entry.phase);
      return <section key={id} data-review-case={id} className={s.case}>
        <h2>CASE {id} — {readerTitle(book, form.person.selectedYear)}</h2><p role="status" data-phase={entry.phase}>{entry.phase.toUpperCase()}</p>
        <details open><summary>입력 수정</summary><fieldset disabled={!loaded} className={s.inputs}>
          {pair && <label>관계 유형<select value={form.category} onChange={e => change({ ...form, category: e.target.value as CompatibilityRelationshipType })}>{CATEGORIES.map(([v, label]) => <option key={v} value={v}>{label}</option>)}</select></label>}
          <Fields person={form.person} change={p => change({ ...form, person: { ...form.person, ...p } })} prefix={`${id}-a`} role={pair ? roles.personA : "주인공"} errors={{}} now={now} requiredGender={["major", "annual"].includes(book.id)} />
          <MbtiInput person={form.person} change={p => change({ ...form, person: { ...form.person, ...p } })} role={pair ? roles.personA : ""} />
          {pair ? <><Fields person={form.personB} change={p => change({ ...form, personB: p })} prefix={`${id}-b`} role={roles.personB} errors={{}} now={now} requiredGender={false} /><MbtiInput person={form.personB} change={p => change({ ...form, personB: p })} role={roles.personB} /><p>A/B 역할은 관계 유형 계약에 따라 고정됩니다. 부모자녀: A 부모/B 자녀, 상사팀원: A 상사/B 팀원.</p></> : <div className={s.context}>
            <label>현재 상태<select value={form.person.jobStatus} onChange={e => context("jobStatus", e.target.value)}><option value="">미선택</option>{JOBS.map(([v, label]) => <option key={v} value={v}>{label}</option>)}<option value="other">기타</option></select></label>
            <label>상세 직업<input maxLength={200} value={form.person.detailedJob} onChange={e => context("detailedJob", e.target.value)} /></label>
            <label>관계 상태<select value={form.person.relationshipStatus} onChange={e => context("relationshipStatus", e.target.value)}>{RELATIONSHIPS.map(([v, label]) => <option key={v} value={v}>{label}</option>)}</select></label>
            {book.id === "annual" && <label>선택 연도<select value={form.person.selectedYear} onChange={e => context("selectedYear", e.target.value)}>{policy.selectableYears.map(y => <option key={y}>{y}</option>)}</select></label>}
            <fieldset><legend>관심 분야 (선택)</legend>{FOCUS_AREAS.map(area => <label key={area} className={s.check}><input type="checkbox" checked={form.person.focusAreas.includes(area)} onChange={e => change({ ...form, person: { ...form.person, focusAreas: e.target.checked ? [...form.person.focusAreas, area] : form.person.focusAreas.filter(a => a !== area) } })} />{area}</label>)}</fieldset>
          </div>}
        </fieldset></details>
        <div className={s.actions}><button disabled={!loaded || busy} onClick={() => void generate(id)}>{entry.result ? "다시 생성" : "책 생성"}</button><button disabled={!loaded} onClick={() => reset(id)}>Case Reset</button>
          {entry.result && entry.phase === "ready" && <><a href={reviewHref(entry.result)}>책 펼쳐보기</a><a href={reviewHref(entry.result)} target="_blank" rel="noopener noreferrer">새 탭에서 열기</a><button onClick={() => void copy(id)}>검수 정보 복사</button></>}
        </div>
        {entry.error && <p role="alert">CASE {id} · {entry.error}</p>}
        {entry.result && <details><summary>검수 정보 › · {entry.result.facts.chapterCount}장 · completeness PASS</summary><pre>{reviewContext(entry.result)}</pre></details>}
      </section>;
    })}
  </main>;
}
