import { afterAll, expect, it, vi } from "vitest";
import { mkdirSync, writeFileSync } from "node:fs";
vi.mock("server-only", () => ({}));
import { generateV4ShadowReport } from "../../../src/lib/interpretation-v4/runtimeShadow";
import { validateV4Publication, type V4RuntimeEvidence } from "../../../src/lib/interpretation-v4/runtimeProjection";
import { projectBook } from "../../../src/app/dev/book-preview/bookProjection";
import { storedBook } from "../../../src/lib/book/storedReport";
import { createProductPreviewSnapshot, type ProductPreviewSnapshotDraft } from "../../../src/lib/report-generation/productPreviewSnapshot";
import { RUNTIME_FIXTURES, SHADOW_CLOCK } from "./runtimeFixtures";

const root = "/private/tmp/gyeol-13d7c8-release", rows: unknown[] = [];
const cases = [...RUNTIME_FIXTURES, ...RUNTIME_FIXTURES.slice(0, 4).map(f => {
  const payload = JSON.parse(JSON.stringify(f.payload));
  (payload.person ?? payload.personA).mbtiType = "";
  if (f.id === "career") payload.userContext = { ...payload.userContext, jobStatus: "unemployed", detailJob: "번역 업무 복귀 준비" };
  if (f.id === "love") payload.userContext.relationshipStatus = "single";
  return { id: `${f.id}-edge`, payload };
})];
afterAll(() => { if (process.env.TIME_PRODUCT_EXPORT) writeFileSync(`${root}/six-product-smoke.json`, JSON.stringify(rows, null, 2)); });
it.each(cases)("$id actual generation → sealed snapshot → direct/shared Book", async f => {
  const r = await generateV4ShadowReport(f.payload, SHADOW_CLOCK);
  if (!r.ok) return expect.unreachable(JSON.stringify(r));
  expect(r.externalCalls).toEqual([]);
  const e = r.evidencePacket as V4RuntimeEvidence, book = projectBook(e);
  expect(validateV4Publication(e.productType, r.draft, e)).toEqual({ ok: true, errors: [] });
  if (!book) return expect.unreachable();
  expect(book.pages.some(p => p.kind === "timeline")).toBe(e.productType === "major_fortune");
  expect(book.pages.some(p => p.kind === "months")).toBe(e.productType === "annual_fortune");
  expect(book.pages.some(p => p.kind === "pair")).toBe(e.productType === "saju_mbti_compatibility");
  const text = book.pages.flatMap(p => p.kind === "narrative" ? p.paragraphs.map(b => b.text) : []).join("\n");
  expect(text).not.toMatch(/반드시 부자|무조건 성공|수익 보장|확실히 결혼|반드시 이혼|sourceRefs|semanticTheme|MYEONGLI_PATTERN|timeEvidence|\[object Object\]/);
  expect(book.pages.at(-1)?.kind).toBe("back");
  expect(book.pages.some(p => p.kind === "appendix")).toBe(true);
  for (const p of book.pages) {
    if (p.kind === "narrative") expect(p.paragraphs.length).toBeGreaterThan(0);
    if (p.kind === "contents") for (const row of p.entries) expect(book.pages[row.page].id === row.targetId || book.pages[row.page].anchors?.includes(row.targetId)).toBe(true);
    if (p.kind === "timeline") expect(p.years).toHaveLength(14);
    if (p.kind === "months") expect(p.months).toHaveLength(12);
  }
  const snapshot = createProductPreviewSnapshot({ reportId: `sale-${f.id}`, productKey: e.input.productKey, productSlug: e.input.productSlug,
    createdAtIso: e.generatedAt, draft: r.draft as unknown as ProductPreviewSnapshotDraft, evidencePacket: e });
  if (!snapshot.ok) return expect.unreachable(JSON.stringify(snapshot));
  const saved = JSON.parse(JSON.stringify(snapshot.value));
  expect(storedBook(saved)?.data).toEqual(book);
  expect(storedBook(saved, "https://gyeolreport.com/r/abcdefghijklmnopqrstuvwx")?.data).toEqual(book);
  rows.push({ id: f.id, product: e.productType, input: e.input, generation: "PASS", completeness: "PASS", book: "PASS", reopen: "PASS", sharedRead: "PASS", pages: book.pages.length, externalCalls: 0 });
  if (process.env.TIME_PRODUCT_EXPORT) {
    mkdirSync(`${root}/six-product`, { recursive: true });
    writeFileSync(`${root}/six-product/${f.id}.json`, JSON.stringify({ snapshot: saved, book, input: e.input }));
  }
}, 120000);
