import { expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import locks from "../../fixtures/six-product-integration-01/source-locks.json";
import editions from "../../fixtures/common-editorial-01/edition-locks.json";
import { generateV4ShadowReport } from "../../../src/lib/interpretation-v4/runtimeShadow";
import { v4Digest, type V4RuntimeEvidence } from "../../../src/lib/interpretation-v4/runtimeProjection";
import { projectBook } from "../../../src/app/dev/book-preview/bookProjection";
import { COMPREHENSIVE_STAGE_MEANINGS } from "../../../src/app/dev/book-preview/comprehensiveBook";
import { createProductPreviewSnapshot, type ProductPreviewSnapshotDraft } from "../../../src/lib/report-generation/productPreviewSnapshot";
import { storedBook } from "../../../src/lib/book/storedReport";
import { editorialInvariants } from "./editorialInvariants";
import type { BookData } from "../../../src/app/dev/book-preview/bookTypes";

const previous = JSON.parse(gunzipSync(readFileSync(new URL("../../fixtures/common-editorial-01/previous-books.json.gz", import.meta.url))).toString()) as { product: string; id: string; snapshot: unknown; book: BookData }[];
// Original source locks remain frozen. The new edition may change prose, but
// never calculation/proof data. Six pre-change Books are replayed, not rebuilt.
it.each(locks)("$product/$id preserves source evidence, structure and saved reader", async f => {
  const g = await generateV4ShadowReport(f.payload, f.clock);
  if (!g.ok) {
    expect(g.error).toEqual(f.expected.error);
    return;
  }
  const lock = editions.find(x => x.product === f.product && x.id === f.id)!;
  const e = g.evidencePacket as V4RuntimeEvidence, r = e.composition.result;
  expect(v4Digest(e.calculations)).toBe(f.expected.hashes!.calculations);
  expect(v4Digest(editorialInvariants(e))).toBe(lock.invariant);
  const book = projectBook(e)!;
  expect(book).toBeTruthy();
  const made = createProductPreviewSnapshot({ reportId: `integration-${f.product}-${f.id}`, createdAtIso: e.generatedAt,
    productKey: e.productType, productSlug: e.input.productSlug, draft: g.draft as ProductPreviewSnapshotDraft, evidencePacket: e });
  expect(made.ok).toBe(true);
  if (!made.ok) return;
  expect({ draft: v4Digest(g.draft), evidence: v4Digest(e), calculations: v4Digest(e.calculations),
    narrative: v4Digest(r.narrative), integration: v4Digest("integration" in r ? r.integration : undefined),
    book: v4Digest(book), snapshot: v4Digest(made.value) }).toEqual(lock.hashes);
  expect(v4Digest(book.pages.map(p => [p.kind, "id" in p ? p.id : null]))).toBe(lock.structure);
  const saved = JSON.parse(JSON.stringify(made.value)), before = v4Digest(saved);
  expect(storedBook(saved)?.data).toEqual(book);
  expect(storedBook(saved, "https://gyeolreport.com/r/abcdefghijklmnopqrstuvwx")?.data).toEqual(book);
  expect(v4Digest(saved)).toBe(before);
  const old = previous.find(x => x.product === f.product && x.id === f.id);
  if (old) {
    const digest = v4Digest(old.snapshot);
    expect(storedBook(old.snapshot)?.data).toEqual(old.book);
    expect(storedBook(old.snapshot, "https://gyeolreport.com/r/abcdefghijklmnopqrstuvwx")?.data).toEqual(old.book);
    expect(v4Digest(old.snapshot)).toBe(digest);
  }
  for (const [i, person] of book.people.entries()) {
    const slot = e.input.kind === "compatibility" ? i ? "personB" : "personA" : "person";
    const actual = [...new Set(e.natalTableEvidence[slot].pillars.flatMap(p => p.twelveLifeStage ?? []))].sort();
    const appendix = book.pages.filter(p => p.kind === "appendix").flatMap(p => p.items)
      .filter(x => x.group === "십이운성" && x.person === person.name);
    expect(appendix.map(x => x.name).sort()).toEqual(actual);
    for (const x of appendix) expect(x.meaning).toBe(COMPREHENSIVE_STAGE_MEANINGS[x.name]);
  }
}, 120000);
