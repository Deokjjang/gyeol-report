import { expect, it } from "vitest";
import locks from "../../fixtures/six-product-integration-01/source-locks.json";
import { generateV4ShadowReport } from "../../../src/lib/interpretation-v4/runtimeShadow";
import { v4Digest, type V4RuntimeEvidence } from "../../../src/lib/interpretation-v4/runtimeProjection";
import { projectBook } from "../../../src/app/dev/book-preview/bookProjection";
import { createProductPreviewSnapshot, type ProductPreviewSnapshotDraft } from "../../../src/lib/report-generation/productPreviewSnapshot";
import { storedBook } from "../../../src/lib/book/storedReport";

// Expected values were captured from the six exact source SHAs, before merging.
it.each(locks)("$product/$id preserves its final source edition and saved reader", async f => {
  const g = await generateV4ShadowReport(f.payload, f.clock);
  if (!g.ok) {
    expect(g.error).toEqual(f.expected.error);
    return;
  }
  expect(f.expected.hashes).toBeDefined();
  const e = g.evidencePacket as V4RuntimeEvidence, r = e.composition.result;
  const book = projectBook(e);
  expect(book).toBeTruthy();
  const made = createProductPreviewSnapshot({ reportId: `integration-${f.product}-${f.id}`, createdAtIso: e.generatedAt,
    productKey: e.productType, productSlug: e.input.productSlug, draft: g.draft as ProductPreviewSnapshotDraft, evidencePacket: e });
  expect(made.ok).toBe(true);
  if (!made.ok) return;
  expect({ draft: v4Digest(g.draft), evidence: v4Digest(e), calculations: v4Digest(e.calculations),
    narrative: v4Digest(r.narrative), integration: v4Digest("integration" in r ? r.integration : undefined),
    book: v4Digest(book), snapshot: v4Digest(made.value) }).toEqual(f.expected.hashes);
  const saved = JSON.parse(JSON.stringify(made.value)), before = v4Digest(saved);
  expect(storedBook(saved)?.data).toEqual(book);
  expect(storedBook(saved, "https://gyeolreport.com/r/abcdefghijklmnopqrstuvwx")?.data).toEqual(book);
  expect(v4Digest(saved)).toBe(before);
}, 120000);
