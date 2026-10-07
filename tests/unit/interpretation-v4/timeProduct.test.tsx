import { afterAll, expect, it, vi } from "vitest";
import { mkdirSync, writeFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
vi.mock("server-only", () => ({}));
import { generateV4ShadowReport } from "../../../src/lib/interpretation-v4/runtimeShadow";
import { v4Digest, validateV4Publication, type V4RuntimeEvidence } from "../../../src/lib/interpretation-v4/runtimeProjection";
import { composeMajorFortuneNarrative } from "../../../src/lib/interpretation-v4/majorComposer";
import { composeAnnualFortuneNarrative } from "../../../src/lib/interpretation-v4/annualComposer";
import { createTimeProductContext } from "../../../src/lib/interpretation-v4/timeProductContext";
import { projectBook } from "../../../src/app/dev/book-preview/bookProjection";
import { BookReader } from "../../../src/app/dev/book-preview/BookReader";
import { storedBook } from "../../../src/lib/book/storedReport";
import { createProductPreviewSnapshot, type ProductPreviewSnapshotDraft } from "../../../src/lib/report-generation/productPreviewSnapshot";
import { MAJOR_NARRATIVE_FIXTURES, MAJOR_EVALUATED_AT } from "./majorFixtures";
import { ANNUAL_NARRATIVE_FIXTURES } from "./annualFixtures";
import type { NarrativeBlock, NarrativeSection } from "../../../src/lib/interpretation-v4/narrativeTypes";

const root = "/private/tmp/gyeol-13d7c8-release";
const rows: Record<string, unknown[]> = { major: [], annual: [] };
const noop = () => {};
function verify(id: string, e: V4RuntimeEvidence, draft: unknown) {
  const book = projectBook(e); if (!book) return expect.unreachable();
  const n = e.composition.result.narrative as { headline: string; opening: readonly NarrativeBlock[]; sections: readonly NarrativeSection[]; finalLine: string };
  expect(validateV4Publication(e.productType, draft, e)).toEqual({ ok: true, errors: [] });
  const chapters = book.pages.filter(p => p.kind === "narrative");
  expect(chapters.flatMap(p => p.paragraphs.map(b => b.text))).toEqual([...n.opening, ...n.sections.flatMap(s => s.blocks)].map(b => b.text));
  for (const p of book.pages) {
    const html = renderToStaticMarkup(createElement(BookReader, { data: book, page: p, onNote: noop, onPage: noop, onShare: noop }));
    expect(html).not.toMatch(/sourceRefs|semanticTheme|natalBuilds|timeEvidence|MYEONGLI_PATTERN|NaN|\[object Object\]/);
    if (p.kind === "narrative") { expect(p.paragraphs.length).toBeGreaterThan(0); for (const b of p.paragraphs) expect(html).toContain(renderToStaticMarkup(createElement("span", null, b.text)).slice(6, -7)); }
    if (p.kind === "contents") for (const row of p.entries) expect(book.pages[row.page].id === row.targetId || book.pages[row.page].anchors?.includes(row.targetId)).toBe(true);
  }
  expect(book.pages.at(-1)).toMatchObject({ kind: "back", finalLine: n.finalLine });
  expect(book.pages.some(p => p.kind === "appendix")).toBe(true);
  const made = createProductPreviewSnapshot({ reportId: `time-${id}`, createdAtIso: e.generatedAt, productKey: e.input.productKey,
    productSlug: e.input.productSlug, draft: draft as ProductPreviewSnapshotDraft, evidencePacket: e });
  if (!made.ok) return expect.unreachable(JSON.stringify(made));
  const saved = JSON.parse(JSON.stringify(made.value));
  expect(storedBook(saved)?.data).toEqual(book);
  expect(storedBook(saved, "https://gyeolreport.com/r/abcdefghijklmnopqrstuvwx")?.data).toEqual(book);
  const product = e.productType === "major_fortune" ? "major" : "annual";
  const row = { id, input: e.input, pages: book.pages.length, chapters: n.sections.map(s => s.id),
    integration: "integration" in e.composition.result ? e.composition.result.integration : null,
    completeness: "completeness" in e.composition.result ? e.composition.result.completeness : null, editorial: e.composition.result.editorial };
  rows[product].push(row);
  if (process.env.TIME_PRODUCT_EXPORT) {
    mkdirSync(`${root}/${product}`, { recursive: true });
    writeFileSync(`${root}/${product}/${id}.json`, JSON.stringify({ snapshot: saved, book, row }, null, 2));
    writeFileSync(`${root}/${product}/${id}.txt`, [n.headline, ...chapters.flatMap(p => [p.title, ...p.paragraphs.map(b => b.text)]), n.finalLine].join("\n\n"));
  }
}
afterAll(() => { if (process.env.TIME_PRODUCT_EXPORT) for (const [product, summary] of Object.entries(rows)) writeFileSync(`${root}/${product}/summary.json`, JSON.stringify(summary, null, 2)); });

it.each([0, 1, 4])("Major fixture %s actual entry, canonical parity, 14/14, reopen/share", async i => {
  const f = MAJOR_NARRATIVE_FIXTURES[i];
  const legacy = await composeMajorFortuneNarrative(f.payload, MAJOR_EVALUATED_AT);
  const actual = await generateV4ShadowReport(f.payload, { evaluatedAt: MAJOR_EVALUATED_AT });
  if (!actual.ok || !legacy.ok) return expect.unreachable(JSON.stringify(actual));
  const e = actual.evidencePacket as V4RuntimeEvidence;
  if (e.composition.product !== "major_fortune" || !("integration" in e.composition.result)) return expect.unreachable();
  const r = e.composition.result;
  expect(actual.externalCalls).toEqual([]);
  expect(r.evidence).toEqual(JSON.parse(JSON.stringify(legacy.evidence)));
  expect(r.narrative.sections.map(s => s.id)).toEqual(legacy.narrative.sections.map(s => s.id));
  expect(r.years.map(y => [y.year, y.age, y.cycle, y.annual])).toEqual(legacy.years.map(y => [y.year, y.age, y.cycle, y.annual]));
  expect(r.years).toHaveLength(14); expect(r.years.filter(y => y.timePosition === "future")).toHaveLength(10);
  expect(r.integration.natalBuilds).toBe(1); expect(r.integration.represented.length).toBeGreaterThan(0);
  expect(r.integration.timeClaimSource).toBe("canonical-period-only");
  expect(r.editorial.filter(x => x.severity !== "Minor")).toEqual([]);
  if (!f.payload.person.mbtiType) expect(r.integration.represented.flatMap(p => p.mbtiNodes)).toEqual([]);
  verify(f.id, e, actual.draft);
  expect(await generateV4ShadowReport(f.payload, { evaluatedAt: MAJOR_EVALUATED_AT })).toEqual(actual);
}, 120000);

it.each([0, 2, 4])("Annual fixture %s actual entry, selected year/Jie parity, 12/12, reopen/share", async i => {
  const f = ANNUAL_NARRATIVE_FIXTURES[i], clock = { evaluatedAt: f.clock.currentDate, ...(f.clock.policyDate ? { policyDate: f.clock.policyDate } : {}) };
  const legacy = await composeAnnualFortuneNarrative(f.payload, f.clock), actual = await generateV4ShadowReport(f.payload, clock);
  if (!actual.ok || !legacy.ok) return expect.unreachable(JSON.stringify(actual));
  const e = actual.evidencePacket as V4RuntimeEvidence;
  if (e.composition.product !== "annual_fortune" || !("integration" in e.composition.result)) return expect.unreachable();
  const r = e.composition.result;
  expect(actual.externalCalls).toEqual([]);
  expect(r.evidence).toEqual(JSON.parse(JSON.stringify(legacy.evidence)));
  expect(r.narrative.sections.map(s => s.id)).toEqual(legacy.narrative.sections.map(s => s.id));
  expect(r.months.map(m => [m.month, m.focus, m.provenance])).toEqual(legacy.months.map(m => [m.month, m.focus, m.provenance]));
  expect(r.months.map(m => m.month)).toEqual(Array.from({ length: 12 }, (_, n) => n + 1));
  expect(r.integration.natalBuilds).toBe(1); expect(r.integration.represented.length).toBeGreaterThan(0);
  expect(r.integration.timeClaimSource).toBe("canonical-period-only");
  expect(r.editorial.filter(x => x.severity !== "Minor")).toEqual([]);
  if (!f.payload.person.mbtiType) expect(r.integration.represented.flatMap(p => p.mbtiNodes)).toEqual([]);
  verify(f.id, e, actual.draft);
  expect(await generateV4ShadowReport(f.payload, clock)).toEqual(actual);
}, 120000);

it("time relevance never promotes natal fortune, invents time support or changes the frozen profile", async () => {
  const r = await composeMajorFortuneNarrative(MAJOR_NARRATIVE_FIXTURES[1].payload, MAJOR_EVALUATED_AT);
  if (!r.ok) return expect.unreachable();
  const ctx = createTimeProductContext(r.evidence.input, "test");
  if (!ctx.ok) return expect.unreachable();
  const p = { id: "test-year", label: "2026년", kind: "year" as const, tenGod: r.years[3].annual.tenGod, sourceRefs: r.years[3].annual.evidenceIds };
  const view = ctx.project(p), before = v4Digest(view.natalProfile);
  expect(view.supportedClaims.every(c => !c.fortune && !c.factBomb)).toBe(true);
  expect(ctx.project({ ...p, sourceRefs: [] }).supportedClaims).toEqual([]);
  expect(ctx.render(ctx.project({ ...p, sourceRefs: [] }))).toBeUndefined();
  ctx.render(view); expect(v4Digest(view.natalProfile)).toBe(before);
  expect(ctx.represented.every(x => x.timeEvidence.length && x.natalEvidence.length)).toBe(true);
}, 120000);

it.each(["unknown", "approximate"])("time precision %s stays canonical without invented hour", async precision => {
  const p = MAJOR_NARRATIVE_FIXTURES[0].payload;
  const payload = { ...p, person: { ...p.person, birthTime: "", birthTimeUnknown: precision === "unknown", birthTimePrecision: precision,
    approximateBirthTimeSlot: precision === "approximate" ? "MYOSI" : "", mbtiType: "" } };
  const actual = await generateV4ShadowReport(payload, { evaluatedAt: MAJOR_EVALUATED_AT });
  expect(actual.ok, JSON.stringify(actual)).toBe(true);
  if (actual.ok) verify(`precision-${precision}`, actual.evidencePacket as V4RuntimeEvidence, actual.draft);
}, 120000);
