import { afterAll, expect, it, vi } from "vitest";
import { writeFileSync } from "node:fs";
vi.mock("server-only", () => ({}));
import { generateV4ShadowReport } from "../../../src/lib/interpretation-v4/runtimeShadow";
import * as manuscript from "../../../src/lib/interpretation-v4/comprehensiveManuscriptRenderer";
import { singleRuntimeInput, SHADOW_CLOCK, RUNTIME_FIXTURES } from "./runtimeFixtures";
import { validateV4Publication, type V4RuntimeEvidence } from "../../../src/lib/interpretation-v4/runtimeProjection";
import { projectBook } from "../../../src/app/dev/book-preview/bookProjection";
import { storedBook } from "../../../src/lib/book/storedReport";
import { createProductPreviewSnapshot, type ProductPreviewSnapshotDraft } from "../../../src/lib/report-generation/productPreviewSnapshot";

const sizes: { product: string; snapshotJsonBytes: number }[] = [];
afterAll(() => {
  if (process.env.RELEASE_QA_SIZES === "1") writeFileSync("/private/tmp/gyeol-release-snapshot-sizes.json", JSON.stringify(sizes, null, 2));
});

it("release P0: translator INTP publishes without weakening manuscript validation", async () => {
  const render = vi.spyOn(manuscript, "renderComprehensiveManuscript");
  const input = singleRuntimeInput("saju_mbti_full", "saju-mbti-full", {
    id: "release-translator", name: "준호", date: "1989-09-21", time: "17:40", gender: "MALE", mbti: "INTP",
    context: { jobStatus: "freelancer", detailJob: "프리랜서 번역가", relationshipStatus: "single" },
  });
  const result = await generateV4ShadowReport(input, SHADOW_CLOCK);
  const rendered = render.mock.results.at(-1)?.value;
  render.mockRestore();
  expect(result, JSON.stringify(rendered?.draft?.validation.hardViolations)).toMatchObject({ ok: true, externalCalls: [] });
  expect(rendered.draft.validation.hardViolations).toEqual([]);
  const strength = rendered.draft.sections.C4.blocks.find((b: { sourceUnitIds: string[] }) => b.sourceUnitIds.includes("editorial:PERSONAL_RESONANCE:resonance:PR009"));
  expect(strength.sentenceRoles).toEqual(expect.arrayContaining(["MYEONGLI_REASON", "CLOSER"]));
  expect(new Set(strength.sentences.map((s: { text: string }) => s.text)).size).toBe(strength.sentences.length);
  expect(rendered.draft.sections.C10.blocks.length).toBeGreaterThan(0);
  if (result.ok) verifyBook(result);
}, 120000);

function verifyBook(r: Extract<Awaited<ReturnType<typeof generateV4ShadowReport>>, { ok: true }>) {
  const e = r.evidencePacket as V4RuntimeEvidence;
  expect(r.externalCalls).toEqual([]);
  expect(validateV4Publication(e.productType, r.draft, e)).toEqual({ ok: true, errors: [] });
  const book = projectBook(e)!;
  expect(book).toBeTruthy();
  expect(book.pages.at(-1)).toMatchObject({ kind: "back", finalLine: expect.any(String) });
  for (const p of book.pages) {
    if (p.kind === "narrative") expect(p.paragraphs.every(b => b.text.trim())).toBe(true);
    if (p.kind === "timeline") expect(p.years).toHaveLength(14);
    if (p.kind === "months") expect(p.months).toHaveLength(12);
    if (p.kind === "contents") for (const row of p.entries) expect(book.pages[row.page].id === row.targetId || book.pages[row.page].anchors?.includes(row.targetId)).toBe(true);
  }
  const snapshot = createProductPreviewSnapshot({ reportId: "release-local", productKey: e.input.productKey,
    productSlug: e.input.productSlug, createdAtIso: e.generatedAt,
    draft: r.draft as unknown as ProductPreviewSnapshotDraft, evidencePacket: e });
  if (!snapshot.ok) return expect.unreachable(JSON.stringify(snapshot));
  const saved = JSON.parse(JSON.stringify(snapshot.value));
  sizes.push({ product: e.productType, snapshotJsonBytes: Buffer.byteLength(JSON.stringify(snapshot.value)) });
  expect(storedBook(saved)?.data).toEqual(book);
  expect(storedBook(saved, "http://localhost/r/local-only")?.data).toEqual(book);
}

// Fixed, bounded input matrix: no synthetic pillars, unbounded search or fixture-only writer.
const edgeCases = RUNTIME_FIXTURES.flatMap((f, index) => ["unknown", "approximate"].map(mode => {
  const payload = structuredClone(f.payload);
  const p = "person" in payload ? payload.person : payload.personA;
  Object.assign(p, { name: `출시검수${index + 1}`, birthDate: ["1993-02-06", "2002-10-09", "1991-06-24", "1987-12-03", "1979-04-17", "1998-08-29"][index],
    birthTime: "", birthTimeUnknown: mode === "unknown", birthTimePrecision: mode,
    approximateBirthTimeSlot: mode === "unknown" ? "" : "YUSI", mbtiType: mode === "unknown" ? "" : ["INTJ", "ESFP", "INFJ", "ENTP", "ISTP", "ENFJ"][index] });
  if ("userContext" in payload) Object.assign(payload.userContext, { jobStatus: "", detailJob: "", relationshipStatus: index % 2 ? "married" : "single" });
  if ("personB" in payload) {
    payload.relationshipType = mode === "unknown" ? "parentChild" : "managerReport";
    Object.assign(payload.personB, { birthDate: "2008-06-03" });
  }
  // Annual uncertainty remains a legitimate pre-purchase rejection; sparse
  // Comprehensive must publish through the unchanged completeness gate.
  const expectedBlocker = mode === "unknown" && f.id === "annual" ? "DAYUN_UNCERTAIN" : null;
  return { id: `${f.id}-${mode}`, payload, expectedBlocker };
}));
it.each(edgeCases)("release bounded edge $id (known blocker: $expectedBlocker)", async ({ payload, expectedBlocker }) => {
  const r = await generateV4ShadowReport(payload, SHADOW_CLOCK);
  if (expectedBlocker) {
    expect(r).toMatchObject({ ok: false, externalCalls: [], error: { validationErrors: [expectedBlocker] } });
    return;
  }
  if (!r.ok) return expect.unreachable(JSON.stringify(r));
  verifyBook(r);
}, 120000);
