import { afterAll, expect, it, vi } from "vitest";
import { writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
vi.mock("server-only", () => ({}));
import { generateV4ShadowReport } from "../../../src/lib/interpretation-v4/runtimeShadow";
import * as manuscript from "../../../src/lib/interpretation-v4/comprehensiveManuscriptRenderer";
import * as scheduler from "../../../src/lib/interpretation-v4/comprehensiveEditorialPlan";
import { COMPREHENSIVE_SECTIONS } from "../../../src/lib/interpretation-v4/comprehensivePlanCore";
import { validateV4Publication, type V4RuntimeEvidence } from "../../../src/lib/interpretation-v4/runtimeProjection";
import { projectBook } from "../../../src/app/dev/book-preview/bookProjection";
import { storedBook } from "../../../src/lib/book/storedReport";
import { createProductPreviewSnapshot, type ProductPreviewSnapshotDraft } from "../../../src/lib/report-generation/productPreviewSnapshot";
import { normalizeReportInputPayload } from "../../../src/lib/report-generation/reportInputAdapter";
import { SHADOW_CLOCK } from "./runtimeFixtures";
import { stabilityFixtures, STABILITY_SEED } from "./stabilityFixtures";

const cohort = process.env.STABILITY_COHORT === "holdout" ? "holdout" : "training";
const rows: unknown[] = [];
const hash = (value: unknown) => createHash("sha256").update(JSON.stringify(value ?? null)).digest("hex");
afterAll(() => {
  // Synthetic case IDs + diagnostics only: no names, DOB, job text or manuscript.
  const phase = process.env.STABILITY_BASELINE === "1" ? "before" : "after";
  const trace = process.env.STABILITY_TRACE === "1" ? "-trace" : "";
  writeFileSync(`/private/tmp/gyeol-stability-${cohort}-${phase}${trace}.json`, JSON.stringify({ seed: STABILITY_SEED, cohort, rows }, null, 2));
});
it.each(stabilityFixtures(cohort))("$id $precision publishes with actual roles, evidence and stored Book", async f => {
  // Independently establish the existing purchase-boundary rejection before
  // invoking the writer. Never whitelist manuscript/generation failures.
  const normalized = normalizeReportInputPayload(f.payload, { now: () => new Date(SHADOW_CLOCK.evaluatedAt) });
  const expectedRejection = !normalized.ok && normalized.error === "BIRTH_TIME_UNCERTAIN";
  const spy = vi.spyOn(manuscript, "renderComprehensiveManuscript");
  const planSpy = vi.spyOn(scheduler, "buildComprehensiveEditorialPlan");
  const result = await generateV4ShadowReport(f.payload, SHADOW_CLOCK);
  const input = spy.mock.calls.at(-1)?.[0];
  const rendered = spy.mock.results.at(-1)?.value as ReturnType<typeof manuscript.renderComprehensiveManuscript> | undefined;
  const planned = planSpy.mock.results.at(-1)?.value as ReturnType<typeof scheduler.buildComprehensiveEditorialPlan> | undefined;
  spy.mockRestore();
  planSpy.mockRestore();
  const draft = rendered?.ok ? rendered.draft : undefined;
  const effectivePlan = rendered?.ok ? rendered.plan : input?.plan;
  const sections = draft ? COMPREHENSIVE_SECTIONS.map(s => draft.sections[s]) : [];
  const sentences = sections.flatMap(s => s.blocks.flatMap(b => b.sentences));
  // C10 is compiled from introduced evidence into operating-rule IDs, not the
  // scheduler's guidance candidate IDs. Audit its presence separately.
  const missing = effectivePlan ? sections.filter(s => s.sectionId !== "C10").flatMap(s => effectivePlan.sections[s.sectionId].primaryCandidateIds.filter(id => !s.sourceCandidateIds.includes(id)).map(id => ({ section: s.sectionId, candidate: id }))) : [];
  const row = { id: f.id, product: "saju_mbti_full", precision: f.precision, mbti: f.payload.person.mbtiType || "unknown",
    inputDigest: hash(f.payload), status: result.ok ? "SUPPORTED_PUBLICATION_PASS" : expectedRejection ? "EXPECTED_PREPAYMENT_REJECTION" : "UNEXPECTED_PUBLICATION_FAILURE",
    stage: result.ok ? "published" : draft ? draft.validation.hardViolations.length ? "manuscript" : "publication" : "upstream",
    violations: result.ok ? [] : "validationErrors" in result.error ? result.error.validationErrors : [result.error.code], hard: draft?.validation.hardViolations,
    plannerErrors: planned?.ok === false ? planned.diagnostics.hardErrors : [],
    sectionCoverage: sections.filter(s => s.blocks.length).map(s => s.sectionId), missingPrimary: missing,
    roles: sections.map(s => ({ section: s.sectionId, roles: s.blocks.map(b => b.sentenceRoles) })),
    exactDuplicates: sentences.length - new Set(sentences.map(s => s.text)).size,
    evidenceOwnership: effectivePlan?.qualityAudit.exactEvidenceOveruse,
    semanticOveruse: effectivePlan?.qualityAudit.semanticThemeOveruse,
    renderability: rendered?.ok ? rendered.renderability : undefined,
    evidenceDigest: hash(input?.profiles.myeongli), draftDigest: hash(result.ok ? result.draft : null),
    suppressed: draft?.diagnostics.suppressed,
    sourceRoles: draft ? missing.map(m => {
      const a = draft.debug.sources[`${m.section}:${m.candidate}`] as { source?: { phrases: { id: string; text: string; role: string }[] }; attempts?: { pattern: string; errors: unknown[] }[] } | undefined;
      return { ...m, phrases: a?.source?.phrases.map(p => ({ id: p.id, role: p.role, textDigest: hash(p.text) })),
        attempts: a?.attempts?.map(a => ({ pattern: a.pattern, errors: a.errors })) };
    }) : [],
    // Phrase IDs and roles permit tracing cross-candidate collisions without logging copy.
    collisions: draft ? Object.entries(draft.debug.sources).flatMap(([key, adapted]) => {
      const a = adapted as { source?: { phrases: { id: string; text: string; role: string }[] } };
      return (a.source?.phrases ?? []).flatMap(p => sentences.filter(s => s.text === p.text && !s.sourceUnitIds.some(id => key.endsWith(id))).map(s => ({ planned: key, phrase: p.id, role: p.role, consumedBy: s.sourceUnitIds, consumedPhrase: s.sourcePhraseId })));
    }) : [],
    book: false, stored: false,
  };
  rows.push(row);
  if (expectedRejection) {
    expect(result).toMatchObject({ ok: false, externalCalls: [], error: { validationErrors: ["BIRTH_TIME_UNCERTAIN"] } });
    expect(input).toBeUndefined(); // No planner/renderer and no Book are claimed.
    return;
  }
  if (!result.ok) { expect(row.status, `${f.id}: ${JSON.stringify({ stage: row.stage, violations: row.violations, hard: row.hard })}`).toBe("SUPPORTED_PUBLICATION_PASS"); return; }
  const e = result.evidencePacket as V4RuntimeEvidence, book = projectBook(e);
  expect(validateV4Publication(e.productType, result.draft, e)).toEqual({ ok: true, errors: [] });
  expect(!!book).toBe(true); row.book = !!book;
  expect(draft?.validation.hardViolations).toEqual([]);
  expect(missing).toEqual([]);
  expect(rendered?.ok && rendered.renderability.passes <= 4).toBe(true);
  expect(row.exactDuplicates).toBe(0);
  expect(row.evidenceOwnership).toEqual([]);
  expect(row.semanticOveruse).toEqual([]);
  expect(sentences.every(s => s.evidenceIds.length > 0)).toBe(true);
  if (!f.payload.person.mbtiType) expect(sentences.every(s => !s.mbtiSourceNodeIds.length && !s.explicitMbtiMention)).toBe(true);
  if (f.precision === "unknown") expect(sentences.every(s => s.evidenceIds.every(id => !id.includes(":hour:")))).toBe(true);
  const snapshot = createProductPreviewSnapshot({ reportId: f.id, productKey: e.input.productKey, productSlug: e.input.productSlug,
    createdAtIso: e.generatedAt, draft: result.draft as unknown as ProductPreviewSnapshotDraft, evidencePacket: e });
  expect(snapshot.ok).toBe(true);
  if (snapshot.ok) {
    const saved = JSON.parse(JSON.stringify(snapshot.value));
    row.stored = JSON.stringify(storedBook(saved)?.data) === JSON.stringify(book)
      && JSON.stringify(storedBook(saved, "http://localhost/r/local-review")?.data) === JSON.stringify(book);
    expect(row.stored).toBe(true);
  }
  expect(book?.pages.at(-1)?.kind).toBe("back");
}, 120000);
