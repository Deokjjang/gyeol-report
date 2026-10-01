import { buildSinglePersonReportInputPayload, buildCompatibilityReportInputPayload, createCheckoutInputSnapshot, createReportPersonInputPayload, type SingleInputState, type PersonInputState } from "../report-generation/reportInputPresentation";
import { type CompatibilityRelationshipType, type ReportInputPayload } from "../report-generation/reportInputTypes";
import { normalizeBirthTimePrecision } from "../saju/birthTimePrecisionTypes";
import { calculateCheckoutAge } from "../payment/checkoutConsent";
import type { Book } from "./product";

export type BookFormState = { person: SingleInputState; personB: PersonInputState; category: CompatibilityRelationshipType };
export function emptyBookForm(year: number): BookFormState {
  const person: SingleInputState = { name: "", birthDate: "", paidBirthTimeMode: "exact", birthTime: "", timeBranch: "", birthTimeUnknown: false, gender: "", mbtiType: "", jobStatus: "", detailedJob: "", relationshipStatus: "", focusAreas: [], selectedYear: String(year) };
  return { person, personB: { ...person }, category: "love" };
}
export function bookInputPayload(book: Book, state: BookFormState): ReportInputPayload {
  return book.id === "compatibility" ? buildCompatibilityReportInputPayload({ relationshipType: state.category, personA: state.person, personB: state.personB }) : buildSinglePersonReportInputPayload(book, state.person);
}
export function bookCheckoutSnapshot(payload: ReportInputPayload) {
  const pair = payload.productKey === "saju_mbti_compatibility", p = pair ? payload.personA : payload.person;
  return createCheckoutInputSnapshot({ displayName: pair ? `${p.name} · ${payload.personB.name}` : p.name, birthDate: p.birthDate, birthTime: p.birthTime, birthTimeUnknown: p.birthTimeUnknown, gender: p.gender, mbtiType: p.mbtiType, reportInputPayload: payload });
}
export function personErrors(person: PersonInputState, now: string, genderRequired: boolean) {
  const errors: Record<string, string> = {};
  if (!person.name.trim()) errors.name = "이름을 입력해 주세요.";
  const age = calculateCheckoutAge(person.birthDate, new Date(now));
  if (age === null || age < 0 || Number(person.birthDate.slice(0, 4)) < 1900) errors.birthDate = "생년월일을 확인해 주세요.";
  if (genderRequired && !person.gender) errors.gender = "대운 계산에 필요한 성별을 선택해 주세요.";
  if (!normalizeBirthTimePrecision(createReportPersonInputPayload(person)).ok) errors.birthTime = "정확한 시각 또는 대략적인 시간대를 선택해 주세요.";
  return errors;
}
// Only known typed input fields can be restored. Stored data cannot carry a
// route gate, version, price, consent, payment status or generation result.
export function restoreBookForm(value: unknown, year: number): BookFormState | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>, base = emptyBookForm(year);
  if (v.version !== 1 || !v.state || typeof v.state !== "object") return null;
  const state = v.state as Record<string, unknown>;
  for (const slot of ["person", "personB"] as const) {
    if (!state[slot] || typeof state[slot] !== "object") return null;
    const src = state[slot] as Record<string, unknown>;
    for (const key of Object.keys(base[slot])) {
      const prior = (base[slot] as unknown as Record<string, unknown>)[key], next = src[key];
      if (typeof prior === "string" && typeof next === "string" && next.length <= 200 || typeof prior === "boolean" && typeof next === "boolean" || key === "focusAreas" && Array.isArray(next) && next.every(x => typeof x === "string")) (base[slot] as unknown as Record<string, unknown>)[key] = next;
    }
  }
  if (["love", "marriage", "parentChild", "coworker", "managerReport", "businessPartner", "friendship"].includes(String(state.category))) base.category = state.category as CompatibilityRelationshipType;
  return base;
}
