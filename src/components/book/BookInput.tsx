"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties, type ReactElement } from "react";
import { BOOKS, bookForProduct, fortuneIntro, readerTitle, ZIWEI_COVER_LINE, ZIWEI_GENDER_MESSAGE, ZIWEI_PREPARING_LINE, ZIWEI_TIME_UNKNOWN_MESSAGE, type Book } from "../../lib/book/product";
import { formatKrw, majorHalfPriceKrw, reportPriceKrw } from "../../lib/payment/reportProductCatalog";
import { bookInputPayload, emptyBookForm, personErrors, restoreBookForm, type BookFormState } from "../../lib/book/form";
import { ANNUAL_WISH_MAX, type PersonInputState } from "../../lib/report-generation/reportInputPresentation";
import { MBTI_TYPES, compatibilityRoleLabels, type CompatibilityRelationshipType } from "../../lib/report-generation/reportInputTypes";
import { birthTimeSlotOptions } from "../../lib/saju/birthTimePrecisionTypes";
import { getAnnualFortuneCommerceYearPolicy } from "../../lib/report-knowledge/annualFortuneYearRules";
import { JOBS, RELATIONSHIPS, CATEGORIES, PUBLISHING_STATES } from "../../app/dev/book-preview/model";
import { Publishing } from "../../app/dev/book-preview/BookPages";
import { BookCheckout, CHECKOUT_RETURN_BACKUP_KEY, type MajorDiscountView } from "./BookCheckout";
import s from "../../app/dev/book-preview/book.module.css";
import f from "./flow.module.css";
import { interaction } from "../../lib/analytics/client";
import { checkoutReturnKey, ticketPendingKey } from "./useTicketPublication";
import { bundleReturnKey } from "../../lib/tickets/shopContract";
import { AccountChannelOnboarding } from "../account/AccountSession";
import { FORTUNE_REOPEN_LINE, annualProductYear } from "../../lib/ops/config";
import { useSalesPaused } from "./useSalesPaused";
import { EventPopupHost } from "../event/EventPopup";
import { webEvent } from "../../lib/analytics/web";

export function Fields({ person, change, prefix, role, errors, now, requiredGender }: { person: PersonInputState; change: (value: PersonInputState) => void; prefix: string; role: string; errors: Record<string, string>; now: string; requiredGender: boolean }) {
  const error = (key: string) => errors[`${prefix}.${key}`] ? <small id={`${prefix}-${key}-error`} role="alert" className={f.error}>{errors[`${prefix}.${key}`]}</small> : null;
  const a11y = (key: string) => ({ "aria-invalid": Boolean(errors[`${prefix}.${key}`]), "aria-describedby": errors[`${prefix}.${key}`] ? `${prefix}-${key}-error` : undefined });
  return <fieldset className={s.fields}><legend>{role}</legend>
    <label>{role} 이름<input id={`${prefix}-name`} value={person.name} maxLength={30} autoComplete="off" {...a11y("name")} onChange={e => change({ ...person, name: e.target.value })} />{error("name")}</label>
    <label>생년월일<input id={`${prefix}-birthDate`} type="date" min="1900-01-01" max={now.slice(0, 10)} value={person.birthDate} {...a11y("birthDate")} onChange={e => change({ ...person, birthDate: e.target.value })} />{error("birthDate")}</label>
    <label>성별{requiredGender ? " (필수)" : ""}<select id={`${prefix}-gender`} value={person.gender} {...a11y("gender")} onChange={e => change({ ...person, gender: e.target.value })}><option value="">미선택</option><option value="FEMALE">여성</option><option value="MALE">남성</option></select>{error("gender")}</label>
    <fieldset className={s.wide}><legend>출생시간</legend><div className={s.choices}>{[["exact", "정확"], ["approximate", "대략"], ["unknown", "모름"]].map(([value, label]) => <label key={value}><input type="radio" name={`${prefix}-precision`} checked={person.paidBirthTimeMode === value} onChange={() => change({ ...person, paidBirthTimeMode: value as PersonInputState["paidBirthTimeMode"], birthTime: "", timeBranch: "", birthTimeUnknown: value === "unknown" })} />{label}</label>)}</div></fieldset>
    {person.paidBirthTimeMode === "exact" ? <label className={s.wide}>태어난 시각<input id={`${prefix}-birthTime`} type="time" value={person.birthTime} {...a11y("birthTime")} onChange={e => change({ ...person, birthTime: e.target.value })} />{error("birthTime")}</label> : person.paidBirthTimeMode === "approximate" ? <label className={s.wide}>대략적인 시간대<select id={`${prefix}-birthTime`} value={person.timeBranch} {...a11y("birthTime")} onChange={e => change({ ...person, timeBranch: e.target.value as PersonInputState["timeBranch"] })}><option value="">시간대 선택</option>{/* 운영 Q 8-2: 시각은 입력한 생년월일의 당시 시계(서머타임·옛 표준시) 기준. 날짜 전에는 지금 시계 */}{birthTimeSlotOptions(person.birthDate).map(slot => <option key={slot.value} value={slot.value}>{slot.labelKo}</option>)}</select>{error("birthTime")}</label> : null}
  </fieldset>;
}

export function MbtiInput({ person, change, role }: { person: PersonInputState; change: (p: PersonInputState) => void; role: string }) {
  return <label>{role} MBTI<select value={person.mbtiType} onChange={e => change({ ...person, mbtiType: e.target.value })}>{MBTI_TYPES.map(v => <option key={v} value={v}>{v || "모름"}</option>)}</select></label>;
}

/** v5Products(서버 writer/flags 상수 — AM2-14 5부부터 6상품): 이 상품이 v5(AI 작가)로 발행되는지 — 결제 직전 열람 기간(탈퇴 전까지 / 90일)과 AI 작성 고지를 고른다(최종3). */
export function BookInput({ internal, now, initial, authEnabled = internal, ticketShopEnabled = false, closed = [], v5Products = [], giftEventProducts = [] }: { internal: boolean; now: string; initial?: BookFormState; authEnabled?: boolean; ticketShopEnabled?: boolean; closed?: readonly string[]; v5Products?: readonly string[]; giftEventProducts?: readonly string[] }) {
  const params = useSearchParams(), book = bookForProduct(params.get("product") ?? "") ?? BOOKS[0], paused = useSalesPaused();
  // P6d-ops 1: 판매를 잠시 닫은 책(대운·세운)은 입력·결제 대신 공개 안내. 서버(결제·이용권 API)도 같은 설정으로 거절한다.
  // 최종 A 14: 상품 화면 팝업(내부 검수 화면 제외).
  const popup = internal ? null : <EventPopupHost />;
  const withPopup = (page: ReactElement) => (popup ? <>{page}{popup}</> : page);
  if (closed.includes(book.productKey)) return withPopup(<SalesClosedNotice book={book} home={internal ? "/dev/book-flow" : "/"} />);
  // W3 P0: 4종 판매 중지(DB 스위치) — 입력·결제 대신 잠시 멈춤 안내. 결제 준비·주문·승인·이용권 API도 같은 스위치로 거절한다.
  if (paused) return withPopup(<SalesPausedNotice book={book} home={internal ? "/dev/book-flow" : "/"} message={paused} />);
  // Product is the component key supplied by the wrapper below via navigation;
  // drafts are additionally namespaced per product and cannot activate routes.
  return withPopup(<BookForm key={book.id} book={book} internal={internal} now={now} initial={initial} authEnabled={authEnabled} ticketShopEnabled={ticketShopEnabled} v5Book={v5Products.includes(book.productKey)} giftEventProducts={giftEventProducts} />);
}
/** AM2-14 1부: 판매 화면의 책 이름 — 세운은 신년판 연도(「나의 2027」). */
const saleTitle = (book: Book) => readerTitle(book, String(annualProductYear()));
/**
 * AM2-14 1부: 세운 · 대운 소개 한 줄. 입력 첫 쪽은 이름 · 가격과 함께(판매가 열린 화면), 닫힘 안내는 소개만.
 * 가격 = 결제 카탈로그(세운 · 대운 정가, 세운을 산 회원의 대운 반값).
 */
export function FortuneIntro({ book, withPrice }: { book: Book; withPrice: boolean }) {
  // ZW-2 1부: 자미 「나의 열두 서가」는 판매 닫힘 — 소개 한 줄만(가격 없음).
  if (book.productKey === "ziwei_full") return <p className={s.wide} data-ziwei-intro><b>{saleTitle(book)}</b><br />{ZIWEI_COVER_LINE}</p>;
  const intro = fortuneIntro(book.productKey, annualProductYear());
  if (!intro) return null;
  const price = book.productKey === "annual_fortune" ? formatKrw(reportPriceKrw("annual_fortune")) : `${formatKrw(reportPriceKrw("major_fortune"))} · 세운을 산 분은 ${formatKrw(majorHalfPriceKrw())}`;
  return withPrice ? <p className={s.wide} data-fortune-intro><b>{saleTitle(book)} · {price}</b><br />{intro}</p> : <p data-fortune-intro>{intro}</p>;
}
function SalesClosedNotice({ book, home }: { book: Book; home: string }) {
  useEffect(() => { interaction("book_viewed", book.productKey); }, [book.productKey]);
  return <main className={`${s.root} ${f.flow}`} data-book-input data-sales-closed style={{ "--cover": book.color, "--ink": book.ink } as CSSProperties}>
    <header className={s.header}><a href={home} className={s.wordmark}><b>결리포트</b><span>GYEOL REPORT</span></a><a href={home} className={s.close}>닫기 ×</a></header>
    <section className={s.bookShell}><div className={s.pageScroll} role="region" aria-label="공개 안내">
      <p className={s.eyebrow}>{saleTitle(book)} / NOTICE</p><h1>2027 신년판으로 새로 단장하고 있어요</h1>
      <p><b>{FORTUNE_REOPEN_LINE}</b></p>
      <FortuneIntro book={book} withPrice={false} />
      <p>대운(앞으로의 나)과 세운(나의 {annualProductYear()})은 2027년 흐름을 담아 12월 1일에 새로 공개해요. 그때까지는 새로 구매하거나 이용권으로 만들 수 없어요.</p>
      <p>이미 받은 책은 내 서재에서 그대로 열 수 있어요.</p>
      <p><a href={home}>다른 책 고르기 →</a></p><p><a href="/account">내 서재 →</a></p>
    </div></section>
  </main>;
}
function SalesPausedNotice({ book, home, message }: { book: Book; home: string; message: string }) {
  return <main className={`${s.root} ${f.flow}`} data-book-input data-sales-paused style={{ "--cover": book.color, "--ink": book.ink } as CSSProperties}>
    <header className={s.header}><a href={home} className={s.wordmark}><b>결리포트</b><span>GYEOL REPORT</span></a><a href={home} className={s.close}>닫기 ×</a></header>
    <section className={s.bookShell}><div className={s.pageScroll} role="region" aria-label="잠시 멈춤 안내">
      <p className={s.eyebrow}>{saleTitle(book)} / NOTICE</p><h1>지금은 책 만들기를 잠시 멈췄어요</h1>
      <p>{message}</p>
      <p>이미 받은 책은 내 서재에서 그대로 열 수 있어요.</p>
      <p><a href="/account">내 서재 →</a></p>
    </div></section>
  </main>;
}
/** ZW-2 1부: 자미 결제 단계 — 판매 닫힘이라 주문서(가격 · 결제) 대신 준비 중 안내(서버 결제 준비도 409). */
function ZiweiPreparing({ home }: { home: string }) {
  return <div data-ziwei-preparing data-sales-closed><p className={s.micro}>GYEOL REPORT</p><h1>준비 중</h1><p>{ZIWEI_PREPARING_LINE}</p><p><a href={home}>다른 책 고르기 →</a></p></div>;
}
// AM 2부: 세운 신년판은 한 해만 판다 — 빈 폼·저장된 초안 모두 신년판 연도로(입력 변환 bookInputPayload는 상태 그대로).
const pinAnnualYear = (bookId: string, f: BookFormState): BookFormState => bookId === "annual" ? { ...f, person: { ...f.person, selectedYear: String(annualProductYear()) } } : f;
function BookForm({ book, internal, now, initial, authEnabled, ticketShopEnabled, v5Book, giftEventProducts }: { book: Book; internal: boolean; now: string; initial?: BookFormState; authEnabled: boolean; ticketShopEnabled: boolean; v5Book: boolean; giftEventProducts: readonly string[] }) {
  useEffect(() => { interaction("book_viewed", book.productKey); }, [book.productKey]);
  const policy = getAnnualFortuneCommerceYearPolicy(new Date(now)), key = `gyeol-book-input-v1:${book.productKey}`;
  const [state, setState] = useState(pinAnnualYear(book.id, initial ?? emptyBookForm(policy.currentYear))), [step, setStep] = useState(0), [ready, setReady] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({}), [message, setMessage] = useState(""), [checking, setChecking] = useState(false), [publishing, setPublishing] = useState(false), [decoration, setDecoration] = useState(0);
  // AM2-4 7부: 대운을 정할 수 없는 생일 — 세운을 권하는 링크(결제 단계로 가지 않는다).
  const [annualLink, setAnnualLink] = useState(false);
  // ZW-2 1부: 자미 — 시간을 전혀 모르는 분께 「나라는 사람」을 권하는 링크.
  const [fullLink, setFullLink] = useState(false);
  const scroll = useRef<HTMLDivElement>(null), validationId = useRef(0), reachedStep = useRef(0);
  const draftWritable = useRef(true);
  const total = ["love", "annual"].includes(book.id) ? 3 : 2, receipt = step === total;
  const pair = book.id === "compatibility", roles = compatibilityRoleLabels(state.category), requiredGender = ["major", "annual", "ziwei"].includes(book.id), ziwei = book.id === "ziwei";
  const genderMessage = ziwei ? ZIWEI_GENDER_MESSAGE : undefined;
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
        // P 추가 A: 결제하기 → 로그인을 다른 탭·앱 전환으로 마치고 돌아온 경우 같은 기기에 30분 둔 사본에서 입력·상품을 복원한다(복원 뒤 지운다).
        try {
          const backup = JSON.parse(localStorage.getItem(CHECKOUT_RETURN_BACKUP_KEY) ?? "null") as { productKey?: string; draft?: string; at?: number } | null;
          if (backup && (typeof backup.at !== "number" || Date.now() - backup.at > 30 * 60_000)) localStorage.removeItem(CHECKOUT_RETURN_BACKUP_KEY);
          else if (backup?.productKey === book.productKey && typeof backup.draft === "string") {
            if (!sessionStorage.getItem(key)) sessionStorage.setItem(key, backup.draft);
            sessionStorage.setItem(checkoutReturnKey(book.productKey), "1");
            localStorage.removeItem(CHECKOUT_RETURN_BACKUP_KEY);
          }
        } catch { /* 사본 복원은 선택 */ }
        const restored = restoreBookForm(JSON.parse(sessionStorage.getItem(key) ?? "null"), policy.currentYear), saved = restored ? pinAnnualYear(book.id, restored) : null;
        if (saved) {
          setState(saved);
          const returnToReceipt = sessionStorage.getItem(checkoutReturnKey(book.productKey)) === "1" || sessionStorage.getItem(ticketPendingKey(book.productKey)) !== null;
          const persons = pair ? [saved.person, saved.personB] : [saved.person];
          if (returnToReceipt && persons.every(p => Object.keys(personErrors(p, now, requiredGender, genderMessage)).length === 0)) {
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
  }, [key, policy.currentYear, initial, book.id, book.productKey, now, pair, requiredGender, genderMessage, total, internal, ticketShopEnabled]);
  useEffect(() => { if (ready && draftWritable.current) { try { sessionStorage.setItem(key, JSON.stringify({ version: 1, state })); } catch { /* optional local draft */ } } }, [state, ready, key]);
  useEffect(() => { scroll.current?.scrollTo({ top: 0 }); scroll.current?.focus({ preventScroll: true }); }, [step]);
  useEffect(() => { if (!publishing) return; const timer = setInterval(() => setDecoration(n => Math.min(3, n + 1)), 1000); return () => clearInterval(timer); }, [publishing]);
  // AM2-14 4부 세운 → 대운 반값: 대운 입력은 회원이면 자격을 늘 조회한다(금액은 서버 판정). 세운 책 끝 · 서재 버튼(?from=)으로 왔으면 그 세운의 사람을
  // 미리 채운다 — 첫 쪽부터, 바꿀 수 있다(같은 사람 조건 없음). 링크 없이 들어왔으면 채우지 않고 반값만 보인다.
  const [discount, setDiscount] = useState<MajorDiscountView | null>(null);
  useEffect(() => {
    // 초안 복원(ready) 뒤에 — 같은 탭에 남은 대운 초안이 미리 채운 세운 사람을 덮지 않게.
    if (book.productKey !== "major_fortune" || typeof window === "undefined" || !authEnabled || !ready) return;
    const link = new URLSearchParams(window.location.search).get("from"), from = link ?? "annual";
    let live = true;
    void fetch(`/api/major-discount/quote?from=${encodeURIComponent(from)}`, { cache: "no-store" }).then(r => r.json()).then((r: { ok?: boolean; code?: string; message?: string; amount?: number; original?: number; person?: Record<string, unknown> | null; userContext?: Record<string, unknown> | null }) => {
      if (!live) return;
      if (!r.ok) { if (link && r.message && r.code !== "LOGIN") setMessage(r.message); return; }
      setDiscount({ from, amount: Number(r.amount), original: Number(r.original) });
      if (!link || !r.person) return;
      const p = r.person, c = r.userContext ?? {};
      const mode = p.birthTimeUnknown === true ? "unknown" : p.birthTime ? "exact" : p.approximateBirthTimeSlot ? "approximate" : "unknown";
      setState(st => ({ ...st, person: { ...st.person, name: String(p.name ?? ""), birthDate: String(p.birthDate ?? ""), birthTime: String(p.birthTime ?? ""), birthTimeUnknown: p.birthTimeUnknown === true, paidBirthTimeMode: mode, timeBranch: (p.approximateBirthTimeSlot ?? "") as never,
        gender: String(p.gender ?? ""), mbtiType: String(p.mbtiType ?? ""), relationshipStatus: String(c.relationshipStatus ?? ""), jobStatus: String(c.jobStatus ?? ""), detailedJob: String(c.detailJob ?? "") } }));
    }).catch(() => undefined);
    return () => { live = false; };
  }, [book.productKey, authEnabled, ready]);
  const update = (next: BookFormState) => {
    if (!draftWritable.current) {
      // Only an explicit new edit may replace a draft whose owner was not verified.
      draftWritable.current = true;
      try { sessionStorage.removeItem(bundleReturnKey); sessionStorage.removeItem(checkoutReturnKey(book.productKey)); } catch { /* optional local hint */ }
    }
    interaction("input_started", book.productKey); validationId.current++; setState(next); setErrors({}); setMessage(""); setAnnualLink(false); setFullLink(false);
  };
  const next = async () => {
    if (checking) return;
    interaction("input_started", book.productKey);
    const found: Record<string, string> = {};
    for (const [slot, person] of pair ? [["a", state.person], ["b", state.personB]] as const : [["a", state.person]] as const) for (const [field, text] of Object.entries(personErrors(person, now, requiredGender, genderMessage))) found[`${slot}.${field}`] = text;
    if (Object.keys(found).length) { setStep(0); setErrors(found); setTimeout(() => document.getElementById(Object.keys(found)[0].replace(".", "-"))?.focus(), 0); return; }
    // ZW-2 1부(덕짱님 결정 2026-11-26): 자미두수는 시간대가 있어야 한다 — 시각 「모름」이면 첫 쪽에서 막고 시간 없이도 읽는 책을 권한다(결제 단계로 가지 않는다).
    if (step === 0 && ziwei && state.person.paidBirthTimeMode === "unknown") { setMessage(ZIWEI_TIME_UNKNOWN_MESSAGE); setFullLink(true); return; }
    // AM2-4 7부(덕짱님 결정 2026-11-12): 대운 첫 쪽에서 출생 시각이 「모름·대략」이면 엔진이 대운을 정할 수 있는지 먼저 본다 —
    // 대략 시간대로 정해지면 시간대를 묻고(선택지), 그래도 정할 수 없으면 「이 생일은 대운을 정확히 계산할 수 없어요」 + 세운을 권한다(결제 전 단계에서 멈춤).
    if (step === 0 && book.productKey === "major_fortune" && state.person.paidBirthTimeMode !== "exact") {
      setChecking(true); const attempt = ++validationId.current;
      try {
        const p = state.person;
        const r = await (await fetch("/api/reports/dayun-readiness", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ birthDate: p.birthDate, birthTime: "", birthTimeUnknown: p.paidBirthTimeMode === "unknown", approximateBirthTimeSlot: p.paidBirthTimeMode === "approximate" ? p.timeBranch : "", gender: p.gender }) })).json() as { ok: boolean; code?: string; message?: string; slots?: { value: string; label: string }[] };
        if (attempt !== validationId.current) return;
        if (!r.ok && r.code === "DAYUN_NEED_SLOT") {
          setState(st => ({ ...st, person: { ...st.person, paidBirthTimeMode: "approximate", birthTimeUnknown: false, birthTime: "", timeBranch: "" } }));
          setMessage(`${r.message ?? ""}${r.slots?.length ? ` (계산할 수 있는 시간대: ${r.slots.map(x => x.label).join(", ")})` : ""}`); setAnnualLink(false); return;
        }
        if (!r.ok && r.code === "DAYUN_UNDETERMINABLE") { setMessage(r.message ?? "이 생일은 대운을 정확히 계산할 수 없어요."); setAnnualLink(true); return; }
      } catch { setMessage("입력을 확인하지 못했습니다. 다시 시도해 주세요."); return; }
      finally { setChecking(false); }
    }
    if (step === total - 1 && (internal || requiredGender || pair)) {
      setChecking(true); const attempt = ++validationId.current;
      try {
        const localValidation = internal && !requiredGender;
        const response = await fetch(localValidation ? "/dev/book-flow/api" : "/api/reports/validate-input", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(localValidation ? { operation: "validate", payload } : payload) });
        // Public preflight endpoint accepts Dayun products and compatibility;
        // other public products are checked by the unchanged checkout server.
        const result = await response.json();
        if (attempt !== validationId.current) return;
        if (!result.ok) { setMessage(typeof result.message === "string" ? result.message : typeof result.error === "string" ? result.error : "입력 정보를 확인해 주세요."); setAnnualLink(result.code === "DAYUN_UNDETERMINABLE"); setFullLink(result.code === "ZIWEI_NEED_SLOT"); return; }
      } catch { setMessage("입력을 확인하지 못했습니다. 다시 시도해 주세요."); return; }
      finally { setChecking(false); }
    }
    const nextStep = Math.min(total, step + 1);
    if (nextStep === total) { interaction("input_completed", book.productKey); webEvent("input_done", { product: book.productKey }); }
    reachedStep.current = Math.max(reachedStep.current, nextStep);
    setStep(nextStep); window.history.pushState({ ...window.history.state, bookInputProduct: book.id, bookInputPage: nextStep }, "", `#page-${nextStep + 1}`);
  };
  const relation = <label>관계 상태<select value={state.person.relationshipStatus} onChange={e => update({ ...state, person: { ...state.person, relationshipStatus: e.target.value } })}>{RELATIONSHIPS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>;
  const home = internal ? "/dev/book-flow" : "/";
  return <main className={`${s.root} ${f.flow}`} data-book-input data-step={step} style={{ "--cover": book.color, "--ink": book.ink } as CSSProperties}>
    {authEnabled && ready && !receipt && !publishing && !checking ? <AccountChannelOnboarding local={internal} /> : null}
    <header className={s.header}><a href={home} className={s.wordmark}><b>결리포트</b><span>GYEOL REPORT</span></a><a href={home} className={s.close}>닫기 ×</a></header>
    {internal && publishing ? <div data-observed-status="REQUESTED" data-intermediate-states="decorative"><Publishing book={book} name={state.person.name} state={PUBLISHING_STATES[decoration]} notice="내부 검수 · 실제 결제 없음" /><p className={f.status} role="status">책을 생성하고 있습니다. 종이·제본 움직임은 연출이며 진행률이 아닙니다.</p></div> : null}
    <section className={s.bookShell} hidden={publishing}><div className={s.pageScroll} ref={scroll} tabIndex={-1} role="region" aria-label="책 입력">
      {!ready ? <p role="status">입력 준비 중</p> : receipt && ziwei ? <ZiweiPreparing home={home} /> : receipt ? <BookCheckout payload={payload} now={now} internal={internal} {...(discount ? { discount } : {})} authEnabled={authEnabled} ticketShopEnabled={ticketShopEnabled} v5Book={v5Book} giftEventProducts={giftEventProducts} onPublishing={() => { if (internal) { setDecoration(0); setPublishing(true); } }} onError={text => { if (text) setPublishing(false); setMessage(text); }} /> : <form noValidate onSubmit={e => { e.preventDefault(); void next(); }}>
        <p className={s.eyebrow}>{title} / {String(step + 1).padStart(2, "0")}</p><h1>{step === 0 ? "이 책의 주인공" : step === 1 ? "지금의 나" : book.id === "annual" ? "읽고 싶은 한 해" : "지금의 관계"}</h1>
        {step === 0 ? <FortuneIntro book={book} withPrice /> : null}
        {step === 0 ? <>{pair ? <label>관계 유형<select value={state.category} onChange={e => update({ ...state, category: e.target.value as CompatibilityRelationshipType })}>{CATEGORIES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label> : null}<Fields person={state.person} change={p => update({ ...state, person: { ...state.person, ...p } })} prefix="a" role={pair ? roles.personA : "주인공"} errors={errors} now={now} requiredGender={requiredGender} />{pair ? <Fields person={state.personB} change={p => update({ ...state, personB: p })} prefix="b" role={roles.personB} errors={errors} now={now} requiredGender={false} /> : null}</> : null}
        {step === 1 ? <div className={s.fields}><MbtiInput person={state.person} change={p => update({ ...state, person: { ...state.person, ...p } })} role={pair ? roles.personA : ""} />{pair ? <MbtiInput person={state.personB} change={p => update({ ...state, personB: p })} role={roles.personB} /> : <>
          <label>현재 상태<select value={state.person.jobStatus} onChange={e => update({ ...state, person: { ...state.person, jobStatus: e.target.value } })}><option value="">미선택</option>{JOBS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}<option value="other">기타</option></select></label>
          <label className={s.wide}>현재 직업<input value={state.person.detailedJob} maxLength={200} onChange={e => update({ ...state, person: { ...state.person, detailedJob: e.target.value } })} /></label>{book.id !== "love" ? relation : null}
          {ziwei ? <label>자녀<select value={state.person.children ?? ""} data-ziwei-children onChange={e => update({ ...state, person: { ...state.person, children: e.target.value } })}><option value="">안 적음</option><option value="has">있음</option><option value="none">없음</option></select></label> : null}
        </>}</div> : null}
        {step === 2 ? book.id === "love" ? relation : book.id === "annual" ? <div className={s.fields}>
          {/* AM 2부: 신년판은 한 해(설정값)만. 소망은 선택, 200자, 자료로만 쓰인다. */}
          <p className={s.wide}><b>{annualProductYear()}년 신년판</b> · 입춘부터 다음 입춘까지 열두 절기월과 1월 다리를 담아요.</p>
          <label className={s.wide}>{annualProductYear()}년에 이루고 싶은 것이나 요즘 고민(선택)<textarea value={state.person.wish ?? ""} maxLength={ANNUAL_WISH_MAX} rows={4} data-annual-wish onChange={e => update({ ...state, person: { ...state.person, wish: e.target.value.slice(0, ANNUAL_WISH_MAX) } })} />
            <small>건강·금융처럼 민감한 내용은 적지 않아도 돼요. {(state.person.wish ?? "").length}/{ANNUAL_WISH_MAX}</small></label>
        </div> : <label>선택 연도<select value={state.person.selectedYear} onChange={e => update({ ...state, person: { ...state.person, selectedYear: e.target.value } })}>{policy.selectableYears.map(year => <option key={year}>{year}</option>)}</select></label> : null}
        <button type="submit" className={f.next} disabled={checking}>{checking ? "입력 확인 중" : "다음 페이지"} →</button>
      </form>}
      {message ? <p className={f.error} role="alert">{message}</p> : null}
      {fullLink ? <a className={f.next} href={internal ? "/dev/book-flow" : "/report/new?product=saju-mbti-full"} data-full-recommend>나라는 사람으로 가기 →</a> : null}
      {annualLink ? <a className={f.next} href={internal ? "/dev/book-flow" : "/report/new?product=annual-fortune"} data-annual-recommend>세운(나의 {annualProductYear()})으로 가기 →</a> : null}
    </div><nav className={s.pageNav} aria-label="입력 페이지"><button aria-label="이전 페이지" disabled={!step || checking} onClick={() => window.history.back()}>←</button><span><strong>{title}</strong><span>{step + 1} / {total + 1}</span></span><a href={home}>책장 ↗</a></nav></section>
  </main>;
}
