import "server-only";
import { normalizeReportInputPayload } from "../../../lib/report-generation/reportInputAdapter";
import { generateV4ShadowReport } from "../../../lib/interpretation-v4/runtimeShadow";
import { validateV4Publication, type V4RuntimeEvidence } from "../../../lib/interpretation-v4/runtimeProjection";
import { projectBook } from "../book-preview/bookProjection";
import { projectBookShare } from "../../../lib/book/shareModel";
import { personErrors } from "../../../lib/book/form";
import { CASES, type ReviewEvent } from "./model";

// Direct, pure generation boundary. Deliberately does not call localReview,
// workers, checkout, library persistence or any entitlement/analytics adapter.
export async function generateReview(caseId: string, generationId: string, payload: unknown, now: string, emit: (event: ReviewEvent) => void) {
  if (!["development", "test"].includes(process.env.NODE_ENV)) return;
  let phase = "validating";
  const send = (event: Omit<ReviewEvent, "caseId" | "generationId">) => emit({ ...event, caseId, generationId });
  const fail = (reference: string) => send({ phase: "failed", error: `${phase}: ${reference}` });
  try {
    send({ phase: "validating" });
    const normalized = normalizeReportInputPayload(payload, { now: () => new Date(now) });
    if (!normalized.ok) return fail(normalized.error);
    const people = normalized.value.kind === "compatibility" ? [normalized.value.personA, normalized.value.personB] : [normalized.value.person];
    for (const person of people) {
      const errors = personErrors({ ...person, paidBirthTimeMode: person.birthTimePrecision ?? "exact", timeBranch: person.approximateBirthTimeSlot }, now, ["majorFortune", "annualFortune"].includes(normalized.value.kind));
      if (Object.keys(errors).length) return fail(`INVALID_PERSON: ${Object.values(errors).join(" ")}`);
    }
    const item = CASES.find(c => c.id === caseId);
    if (!item || normalized.value.productKey !== item.book.productKey) return fail("CASE_PRODUCT_MISMATCH");
    phase = "generation"; send({ phase: "generating" });
    const generated = await generateV4ShadowReport(payload, { evaluatedAt: now });
    if (!generated.ok) return fail(`${generated.error.code}: ${generated.error.message}`);
    phase = "completeness"; send({ phase: "validating-output" });
    const evidence = generated.evidencePacket as V4RuntimeEvidence;
    const gate = validateV4Publication(item.book.productKey, generated.draft, evidence);
    if (!gate.ok || !generated.externalCalls || generated.externalCalls.length) return fail(gate.errors.join(", ") || "EXTERNAL_CALL_FORBIDDEN");
    phase = "projection";
    const book = projectBook(evidence);
    if (!book) return fail("BOOK_PROJECTION_FAILED");
    const share = projectBookShare({ productType: item.book.productKey, names: book.names, selectedYear: book.title.match(/\d{4}/)?.[0] });
    if (!share) return fail("SHARE_PROJECTION_FAILED");
    const years = book.pages.find(p => p.kind === "timeline"), months = book.pages.find(p => p.kind === "months");
    if (!book.pages.some(p => p.kind === "back" && p.finalLine) || item.book.id === "major" && years?.years.length !== 14 || item.book.id === "annual" && months?.months.length !== 12) return fail("BOOK_INCOMPLETE");
    send({ phase: "ready", result: { caseId, generationId, book, share, facts: {
      product: item.book.productKey, version: "v4-runtime-shadow-1", generatedAt: now, input: evidence.input,
      chapterCount: book.pages.length, completeness: "PASS", digest: evidence.contentDigest,
      calculation: Object.fromEntries(Object.entries(evidence.calculations).map(([slot, c]) => [slot, { pillars: c.pillars, birthTimeContext: c.birthTimeContext }])),
      years: years?.years.length ?? 0, months: months?.months.length ?? 0,
    } } });
  } catch { fail("REVIEW_GENERATION_FAILED"); }
}
