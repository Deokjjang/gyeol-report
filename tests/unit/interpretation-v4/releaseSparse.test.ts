import { expect, it, vi } from "vitest";
import { writeFileSync } from "node:fs";
vi.mock("server-only", () => ({}));
import { generateV4ShadowReport } from "../../../src/lib/interpretation-v4/runtimeShadow";
import * as manuscript from "../../../src/lib/interpretation-v4/comprehensiveManuscriptRenderer";
import { singleRuntimeInput, SHADOW_CLOCK } from "./runtimeFixtures";
import { validateV4Publication, v4Digest, projectV4Composition, type V4RuntimeEvidence } from "../../../src/lib/interpretation-v4/runtimeProjection";
import { projectBook } from "../../../src/app/dev/book-preview/bookProjection";

it.each([
  { date: "1993-02-06", blocker: false }, { date: "1988-03-22", blocker: false },
  // Additional bounded probe, NOT a publication success. Present at the base
  // too: C7 support spends PR015's sole direct phrase before its C8 primary.
  { date: "1994-11-18", blocker: true },
])("sparse $date (additional unresolved blocker: $blocker)", async ({ date, blocker }) => {
  const render = vi.spyOn(manuscript, "renderComprehensiveManuscript");
  const input = singleRuntimeInput("saju_mbti_full", "saju-mbti-full", {
    id: "release-sparse", name: "출시검수1", date, gender: "FEMALE", mbti: "",
    context: { jobStatus: "", detailJob: "", relationshipStatus: "single" },
  });
  const result = await generateV4ShadowReport(input, SHADOW_CLOCK);
  const source = render.mock.calls.at(-1)![0];
  const rendered = render.mock.results.at(-1)!.value as Extract<ReturnType<typeof manuscript.renderComprehensiveManuscript>, { ok: true }>;
  render.mockRestore();
  if (process.env.RELEASE_SPARSE_EXPORT) writeFileSync(`/private/tmp/gyeol-sparse-${date}.json`, JSON.stringify({ source, rendered, result }, null, 2));
  if (blocker) {
    expect(result).toMatchObject({ ok: false, externalCalls: [], error: { validationErrors: ["COMPREHENSIVE_MANUSCRIPT_UNSAFE"] } });
    expect(rendered.draft.validation.hardViolations).toContainEqual({ code: "PRIMARY_NOT_RENDERED", refs: ["editorial:PERSONAL_RESONANCE:resonance:PR015"] });
    return;
  }
  expect(result, JSON.stringify({ result: result.ok ? true : result, hard: rendered.draft.validation.hardViolations, suppressed: rendered.draft.diagnostics.suppressed })).toMatchObject({ ok: true, externalCalls: [] });
  expect(rendered.draft.validation.hardViolations).toEqual([]);
  expect(Object.keys(source.plan.sections)).toEqual(["C1","C2","C3","C4","C5","C6","C7","C8","C9","C10"]);
  expect(source.profiles.mbti.available).toBe(false);
  expect(source.plan.diagnostics.hardErrors).toEqual([]);
  expect(source.plan.qualityAudit.semanticThemeOveruse).toEqual([]);
  expect(source.plan.qualityAudit.exactEvidenceOveruse).toEqual([]);
  const sentences = Object.values(rendered.draft.sections).flatMap(s => s.blocks.flatMap(b => b.sentences));
  expect(new Set(sentences.map(s => s.text)).size).toBe(sentences.length);
  if (!result.ok) return;
  const e = result.evidencePacket as V4RuntimeEvidence;
  expect(validateV4Publication(e.productType, result.draft, e)).toEqual({ ok: true, errors: [] });
  if (e.composition.product !== "saju_mbti_full") return expect.unreachable();
  expect(e.composition.result.narrative.sections.length).toBeGreaterThanOrEqual(5);
  const shortened = structuredClone(e);
  // Deliberately corrupt a copy, never the frozen generation result.
  Object.assign(shortened.composition.result.narrative, { sections: e.composition.result.narrative.sections.slice(0, 4) });
  const body = Object.fromEntries(Object.entries(shortened).filter(([key]) => key !== "contentDigest"));
  expect(validateV4Publication(e.productType, projectV4Composition(shortened.composition), { ...shortened, contentDigest: v4Digest(body) }).errors).toContain("V4_CONTENT_INCOMPLETE");
  for (const section of e.composition.result.narrative.sections) {
    expect(section.blocks.length).toBeGreaterThan(0);
    for (const b of section.blocks) expect(b.proof.sourceRefs.length).toBeGreaterThan(0);
  }
  const book = projectBook(e)!;
  expect(book.people[0].table.manse.stemRow.hour).toBeNull();
  expect(e.mbtiTables.person).toBeNull();
  if (date === "1993-02-06") {
    expect(e.composition.result.narrative.sections).toHaveLength(5);
    expect(source.plan.sections.C1.supportingCandidateIds).not.toContain("editorial:PERSONAL_RESONANCE:resonance:PR018");
    const shadow = source.plan.sections.C6.placements.find(p => p.candidateId === "editorial:CLAIM:F04_OVERWORK");
    expect(shadow).toMatchObject({ role: "SUPPORT" });
    expect(shadow?.provenanceEvidenceIds).toContain("natal:month:branch:寅");
    expect(shadow?.provenanceEvidenceIds.some(id => id.includes(":hour:"))).toBe(false);
  }
}, 120000);
