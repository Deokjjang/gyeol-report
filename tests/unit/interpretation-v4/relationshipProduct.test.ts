import { afterAll, expect, it, vi } from "vitest";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
vi.mock("server-only", () => ({}));
import { buildV4LoveProduct } from "../../../src/lib/interpretation-v4/loveProductAdapter";
import { buildV4CompatibilityProduct } from "../../../src/lib/interpretation-v4/compatibilityProductAdapter";
import { generateV4ShadowReport } from "../../../src/lib/interpretation-v4/runtimeShadow";
import { loveInputs, LOVE_FIXTURES } from "./loveFixtures";
import { COMPATIBILITY_NARRATIVE_FIXTURES } from "./compatibilityFixtures";
import { singleRuntimeInput, SHADOW_CLOCK } from "./runtimeFixtures";
import { v4Digest, validateV4Publication, type V4RuntimeEvidence } from "../../../src/lib/interpretation-v4/runtimeProjection";
import { projectBook } from "../../../src/app/dev/book-preview/bookProjection";
import { BookReader } from "../../../src/app/dev/book-preview/BookReader";
import { storedBook } from "../../../src/lib/book/storedReport";
import { createProductPreviewSnapshot, type ProductPreviewSnapshotDraft } from "../../../src/lib/report-generation/productPreviewSnapshot";
import { composeCompatibilityNarrative } from "../../../src/lib/interpretation-v4/compatibilityComposer";
import { buildMbtiSemanticProfile, projectMbtiSemanticProfile } from "../../../src/lib/interpretation-v4/mbtiSemanticProfile";
import { buildRelationshipProfiles, projectRelationshipView } from "../../../src/lib/interpretation-v4/relationshipProductView";
import type { NarrativeSection, NarrativeBlock } from "../../../src/lib/interpretation-v4/narrativeTypes";

const root = "/private/tmp/gyeol-13d7b-relationship";
const summaries: Record<string, unknown[]> = { love: [], compatibility: [] };
const noop = () => {};
function verifyBook(id: string, product: "love" | "compatibility", e: V4RuntimeEvidence, draft: unknown, durationMs: number) {
  const book = projectBook(e);
  if (!book) return expect.unreachable();
  const n = e.composition.result.narrative as { headline: string; opening: readonly NarrativeBlock[]; sections: readonly NarrativeSection[]; finalLine: string };
  expect(validateV4Publication(e.productType, draft, e)).toEqual({ ok: true, errors: [] });
  const chapters = book.pages.filter(p => p.kind === "narrative");
  expect(chapters.flatMap(p => p.paragraphs.map(p => p.text))).toEqual([...n.opening, ...n.sections.flatMap(s => s.blocks)].map(b => b.text));
  for (const page of book.pages) {
    const html = renderToStaticMarkup(createElement(BookReader, { data: book, page, onNote: noop, onPage: noop, onShare: noop }));
    expect(html).not.toMatch(/editorial:|sourceNodeId|confidence|guidance:|SemanticAxis|MYEONGLI_PATTERN/);
    if (page.kind === "narrative") for (const p of page.paragraphs) expect(html).toContain(renderToStaticMarkup(createElement("span", null, p.text)).slice(6, -7));
    if (page.kind === "contents") for (const row of page.entries) expect(book.pages[row.page].id === row.targetId || book.pages[row.page].anchors?.includes(row.targetId)).toBe(true);
  }
  expect(book.pages.at(-1)).toMatchObject({ kind: "back", finalLine: n.finalLine });
  const made = createProductPreviewSnapshot({ reportId: `relationship-${id}`, createdAtIso: e.generatedAt, productKey: e.input.productKey,
    productSlug: e.input.productSlug, draft: draft as ProductPreviewSnapshotDraft, evidencePacket: e });
  if (!made.ok) return expect.unreachable(JSON.stringify(made));
  const saved = JSON.parse(JSON.stringify(made.value));
  expect(storedBook(saved)?.data).toEqual(book);
  expect(storedBook(saved, "https://gyeolreport.com/r/abcdefghijklmnopqrstuvwx")?.data).toEqual(book);
  const row = { id, input: e.input, durationMs, pages: book.pages.length, chapters: n.sections.map(s => s.id),
    appendix: book.pages.filter(p => p.kind === "appendix").flatMap(p => p.items).length,
    integration: "integration" in e.composition.result ? e.composition.result.integration : null,
    editorial: e.composition.result.editorial, digest: v4Digest(draft), final: n.finalLine };
  summaries[product].push(row);
  if (process.env.RELATIONSHIP_INTEGRATION_EXPORT) {
    for (const dir of ["plain-text", "customer-packets"]) mkdirSync(`${root}/${product}/${dir}`, { recursive: true });
    writeFileSync(`${root}/${product}/customer-packets/${id}.json`, JSON.stringify({ snapshot: saved, book, row }, null, 2));
    writeFileSync(`${root}/${product}/plain-text/${id}.txt`, [n.headline, ...chapters.flatMap(p => [p.title, ...p.paragraphs.map(b => b.text)]), n.finalLine].join("\n\n"));
  }
}
afterAll(() => {
  if (!process.env.RELATIONSHIP_INTEGRATION_EXPORT) return;
  for (const [product, rows] of Object.entries(summaries)) writeFileSync(`${root}/${product}/integration-summary.json`, JSON.stringify(rows, null, 2));
  writeFileSync(`${root}/compatibility/type-coverage.json`, JSON.stringify(COMPATIBILITY_NARRATIVE_FIXTURES.map(f => ({ id: f.id, category: f.payload.relationshipType, result: "PASS" })), null, 2));
});

it.each(loveInputs())("Love $fixture.id actual product entry", async ({ input, fixture }) => {
  const r = buildV4LoveProduct(input);
  expect(r.ok, JSON.stringify(r)).toBe(true);
  if (!r.ok) return;
  expect(r.integration.represented.some(p => p.question === "L1")).toBe(true);
  expect(r.narrative.sections.map(s => s.id)).toEqual(expect.arrayContaining(["current", "home", "parenting", "direction", "fortune"]));
  expect(r.editorial.filter(i => i.severity !== "Minor")).toEqual([]);
  const start = performance.now();
  const actual = await generateV4ShadowReport(singleRuntimeInput("love_marriage_child", "love-marriage-child", fixture, fixture.slot), SHADOW_CLOCK);
  expect(actual.ok, JSON.stringify(actual)).toBe(true);
  expect(actual.externalCalls).toEqual([]);
  if (actual.ok) verifyBook(fixture.id, "love", actual.evidencePacket as V4RuntimeEvidence, actual.draft, Math.round(performance.now() - start));
  expect(r.mbtiBasis?.pairHint ?? null).toBeNull();
  expect(r.integration.represented.every(p => !p.mbtiDomain || ["LOVE", "MARRIAGE", "RELATIONSHIPS", "COMMUNICATION", "IDENTITY", "STRENGTHS", "RISKS", "GROWTH"].includes(p.mbtiDomain))).toBe(true);
  expect(JSON.stringify(r.narrative)).not.toContain("notablePairs");
  for (const claim of r.integration.charmClaims) { expect(claim.level).toBeGreaterThanOrEqual(2); expect(claim.evidence.length).toBeGreaterThan(0); }
}, 120000);

it.each(COMPATIBILITY_NARRATIVE_FIXTURES)("Pair $id actual product entry", async ({ payload, id }) => {
  const r = buildV4CompatibilityProduct(payload);
  expect(r.ok, JSON.stringify(r)).toBe(true);
  if (!r.ok) return;
  expect(r.integration.pair.category).toBe(payload.relationshipType);
  expect(r.integration.represented.personA.length).toBe(1);
  expect(r.integration.represented.personB.length).toBe(1);
  expect(r.editorial.filter(i => i.severity !== "Minor")).toEqual([]);
  const canonical = composeCompatibilityNarrative(payload);
  if (!canonical.ok) return expect.unreachable();
  expect(r.compatibilityIndex).toEqual(canonical.compatibilityIndex);
  expect(r.evidence).toEqual(canonical.evidence);
  expect(r.directions).toEqual(canonical.directions);
  const start = performance.now(), actual = await generateV4ShadowReport(payload, SHADOW_CLOCK);
  expect(actual.ok, JSON.stringify(actual)).toBe(true);
  if (actual.ok) {
    const e = actual.evidencePacket as V4RuntimeEvidence;
    expect(e.composition.result.narrative).toEqual(r.narrative);
    verifyBook(id, "compatibility", e, actual.draft, Math.round(performance.now() - start));
  }
  for (const pair of r.integration.pair.comparisons) {
    expect(pair.personA.evidence.length).toBeGreaterThan(0); expect(pair.personB.evidence.length).toBeGreaterThan(0);
    expect(["MAIN", "STRONG"]).toContain(pair.personA.band); expect(["MAIN", "STRONG"]).toContain(pair.personB.band);
  }
}, 120000);

it("unknown MBTI is not guessed", async () => {
  const payload = singleRuntimeInput("love_marriage_child", "love-marriage-child", { ...LOVE_FIXTURES[0], mbti: null });
  const actual = await generateV4ShadowReport(payload, SHADOW_CLOCK);
  expect(actual.ok, JSON.stringify(actual)).toBe(true);
  if (actual.ok) verifyBook("unknown-mbti", "love", actual.evidencePacket as V4RuntimeEvidence, actual.draft, 0);
});

it("status is wording/context, not personality; deterministic product", () => {
  const input = loveInputs()[1].input;
  const single = buildV4LoveProduct(input), married = buildV4LoveProduct({ ...input, context: { ...input.context, relationshipStatus: "married" } });
  if (!single.ok || !married.ok) return expect.unreachable();
  expect(single.integration.personalDigest).toBe(married.integration.personalDigest);
  expect(single.narrative.sections.find(s => s.id === "current")).not.toEqual(married.narrative.sections.find(s => s.id === "current"));
  expect(JSON.stringify(single.narrative)).not.toMatch(/현재 배우자|당신의 배우자|지금 사귀는/);
  expect(buildV4LoveProduct(input)).toEqual(single);
}, 120000);

it("pair reference cannot score or alter personal relationship axes", () => {
  const raw = JSON.parse(readFileSync("docs/product/mbti/source/INTP.json", "utf8").replace(/^\uFEFF/, ""));
  const original = buildMbtiSemanticProfile("INTP");
  raw.relationshipHints.notablePairs = [];
  const changed = projectMbtiSemanticProfile("INTP", raw);
  if (!original.ok || !changed.ok) return expect.unreachable();
  expect(changed.value.generalAxes).toEqual(original.value.generalAxes);
  expect(changed.value.contextAxes).toEqual(original.value.contextAxes);
  expect(changed.value.contributions).toEqual(original.value.contributions);
});

it("A/B swap preserves symmetric facts and reverses independent profiles/directions", () => {
  const payload = COMPATIBILITY_NARRATIVE_FIXTURES[0].payload;
  const a = buildV4CompatibilityProduct(payload), b = buildV4CompatibilityProduct({ ...payload, personA: payload.personB, personB: payload.personA });
  if (!a.ok || !b.ok) return expect.unreachable();
  expect(a.evidence.invariant).toEqual(b.evidence.invariant);
  expect(a.integration.individualDigests.personA).toBe(b.integration.individualDigests.personB);
  expect(a.integration.individualDigests.personB).toBe(b.integration.individualDigests.personA);
  expect(a.evidence.directions.aToB).toEqual(b.evidence.directions.bToA);
  expect(a.integration.pair.sharedGround.map(r => [r.axis, r.personA.direction, r.personB.direction])).toEqual(b.integration.pair.sharedGround.map(r => [r.axis, r.personB.direction, r.personA.direction]));
}, 120000);

it("unknown pair MBTI and absent pair reference preserve canonical generation", async () => {
  const f = COMPATIBILITY_NARRATIVE_FIXTURES[0].payload;
  const payload = { ...f, personA: { ...f.personA, mbtiType: "" } };
  const r = buildV4CompatibilityProduct(payload);
  if (!r.ok) return expect.unreachable(JSON.stringify(r));
  expect(r.integration.pair.pairReference).toEqual([]);
  expect(r.integration.represented.personA[0].mbtiDomain).toBeUndefined();
  const actual = await generateV4ShadowReport(payload, SHADOW_CLOCK);
  expect(actual.ok).toBe(true);
  if (actual.ok) verifyBook("unknown-person-a", "compatibility", actual.evidencePacket as V4RuntimeEvidence, actual.draft, 0);
}, 120000);

it("relationship view excludes parent/child/pair references without changing source profile", () => {
  const built = buildRelationshipProfiles(loveInputs()[1].input);
  if (!built.ok) return expect.unreachable();
  const before = JSON.stringify(built.profiles), view = projectRelationshipView(built.profiles);
  expect(view.nodes.some(n => ["PARENTS", "CHILDREN", "RELATIONSHIP_PAIR", "MYEONGLI_BRIDGE_HINT", "RECOMMENDED_JOBS"].includes(n.sourceDomain ?? ""))).toBe(false);
  expect(JSON.stringify(built.profiles)).toBe(before);
});
