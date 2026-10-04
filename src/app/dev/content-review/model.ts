import { BOOKS } from "../../../lib/book/product";
import { emptyBookForm, type BookFormState } from "../../../lib/book/form";
import type { BookData } from "../book-preview/bookTypes";
import type { BookShareModel } from "../../../lib/book/shareModel";

export const CASES = BOOKS.map((book, index) => ({ id: "ABCDEF"[index], book }));
export const generationIdValid = (value: unknown): value is string => typeof value === "string" && /^[a-f0-9]{8}-[a-f0-9-]{27}$/.test(value);
export type ReviewPhase = "not-generated" | "validating" | "generating" | "validating-output" | "ready" | "failed";
export type ReviewResult = { caseId: string; generationId: string; book: BookData; share: BookShareModel; facts: {
  product: string; version: string; generatedAt: string; input: unknown; chapterCount: number;
  completeness: "PASS"; digest: string; calculation: unknown; years: number; months: number;
} };
export type ReviewEvent = { phase: ReviewPhase; caseId: string; generationId: string; error?: string; result?: ReviewResult };
export type ReviewCase = { form: BookFormState; phase: ReviewPhase; generationId?: string; result?: ReviewResult; error?: string };
export function emptyReview(year: number): Record<string, ReviewCase> {
  return Object.fromEntries(CASES.map(c => [c.id, { form: emptyBookForm(year), phase: "not-generated" }]));
}
export function applyReviewEvent(current: ReviewCase, event: ReviewEvent): ReviewCase {
  if (current.generationId !== event.generationId) return current;
  return { ...current, phase: event.phase, error: event.error, result: event.phase === "ready" ? event.result : undefined };
}
export function reviewHref(result: ReviewResult) {
  return `/dev/content-review/book?case=${result.caseId}&generation=${result.generationId}`;
}
export function reviewContext(result: ReviewResult) {
  return `CASE ${result.caseId} — ${result.book.title}\n${JSON.stringify(result.facts, null, 2)}`;
}
