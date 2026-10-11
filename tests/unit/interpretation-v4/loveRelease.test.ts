import { describe, it, expect, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { generateV4ShadowReport } from "../../../src/lib/interpretation-v4/runtimeShadow";
import { v4Digest, validateV4Publication, type V4RuntimeEvidence } from "../../../src/lib/interpretation-v4/runtimeProjection";
import { buildV4LoveProduct } from "../../../src/lib/interpretation-v4/loveProductAdapter";
import { buildRelationshipProfiles, projectRelationshipView } from "../../../src/lib/interpretation-v4/relationshipProductView";
import { LOVE_RELEASE_VERSION, LOVE_READER_CHAPTERS, type LoveReleaseDraft } from "../../../src/lib/interpretation-v4/loveReleaseContracts";
import { compareLoveReaders, validateLoveRelease } from "../../../src/lib/interpretation-v4/loveReleaseValidator";
import { projectBook } from "../../../src/app/dev/book-preview/bookProjection";
import { loveReaderPages } from "../../../src/lib/book/loveBookAdapter";
import { storedBook } from "../../../src/lib/book/storedReport";
import { createProductPreviewSnapshot, type ProductPreviewSnapshotDraft } from "../../../src/lib/report-generation/productPreviewSnapshot";
import { NARRATIVE_FIXTURES, fixtureInput } from "./narrativeFixtures";
import { RUNTIME_FIXTURES, SHADOW_CLOCK, singleRuntimeInput } from "./runtimeFixtures";
import { MBTI_SOURCE_TYPES } from "../../../src/lib/report-knowledge/mbti/sourceRuntimeAdapter";
import { RELATIONSHIP_STATUSES } from "../../../src/lib/report-generation/reportInputTypes";
import locks from "./loveReleaseLocks.json";
const A = NARRATIVE_FIXTURES[0];
export const LOVE_RELEASE_FIXTURES = [
  { ...A, id: "A" }, { ...NARRATIVE_FIXTURES[1], id: "B", context: A.context },
  { ...A, id: "C", mbti: "INFP" }, { ...NARRATIVE_FIXTURES[3], id: "D", context: A.context },
  { ...A, id: "E", context: { ...A.context, relationshipStatus: "single" as const } },
  { ...NARRATIVE_FIXTURES[1], id: "F", context: { ...A.context, relationshipStatus: "some" as const } },
  { ...NARRATIVE_FIXTURES[9], id: "G" }, { ...NARRATIVE_FIXTURES[11], id: "H", time: undefined },
];
const root = "/tmp/gyeol-love-release", readers: { id: string; draft: LoveReleaseDraft }[] = [];
describe("Love reader edition", () => {
  it.each(LOVE_RELEASE_FIXTURES)("$id actual manuscript and frozen Book", async f => {
    const input = singleRuntimeInput("love_marriage_child", "love-marriage-child", f), before = structuredClone(input);
    const generated = await generateV4ShadowReport(input, SHADOW_CLOCK);
    expect(generated.ok, JSON.stringify(generated.ok ? null : generated.error)).toBe(true); if (!generated.ok) return;
    const e = generated.evidencePacket as V4RuntimeEvidence; expect(input).toEqual(before); expect(generated.externalCalls).toEqual([]);
    if (e.composition.product !== "love_marriage_child" || !("integration" in e.composition.result)) return expect.unreachable();
    const r = e.composition.result, d = r.integration.readerEdition, book = projectBook(e);
    readers.push({ id: f.id, draft: d });
    if (process.env.LOVE_EDITORIAL_EXPORT === "1") {
      mkdirSync(root + "/manuscripts", { recursive: true });
      writeFileSync(`${root}/manuscripts/${f.id}.txt`, d.chapters.map(c => `${c.id} ${c.title}\n\n${c.paragraphs.map(p => `${p.id} ${p.purpose}\n${p.text}`).join("\n\n")}`).join("\n\n"));
      writeFileSync(`${root}/manuscripts/${f.id}.json`, JSON.stringify({ draft: d, validation: r.integration.readerValidation, publishedEdition: r.integration.publishedEdition, editorial: r.integration.readerEditorial, selection: r.selection, book }, null, 2));
    }
    expect(r.writerVersion).toBe(LOVE_RELEASE_VERSION); expect(r.integration.readerValidation.hardErrors).toEqual([]);
    expect(r.integration.publishedEdition, JSON.stringify(r.integration.readerEditorial)).toBe(LOVE_RELEASE_VERSION);
    expect(d.chapters.map(c => c.id)).toEqual(LOVE_READER_CHAPTERS.map(c => c.id));
    if (f.mbti && f.time) {
      expect(d.chapters.map(c => c.paragraphs.length), JSON.stringify(r.integration.readerValidation)).toEqual(Array(9).fill(4));
      expect(d.bodyLength).toBeGreaterThanOrEqual(8000); expect(d.bodyLength).toBeLessThanOrEqual(10000);
      expect(r.integration.readerValidation.qualityIssues).toEqual([]);
    }
    expect(validateV4Publication("love_marriage_child", generated.draft, e)).toEqual({ ok: true, errors: [] });
    expect(book).not.toBeNull(); if (!book) return;
    const prose = d.chapters.flatMap(c => c.paragraphs.map(p => p.text));
    expect(book.pages.flatMap(p => p.kind === "narrative" ? p.paragraphs.map(p => p.text) : [])).toEqual(prose);
    expect(prose.join("\n")).not.toMatch(/undefined|\[object Object\]|notablePairs|당신의 자녀는|자녀가 태어날|이 유형과 결혼|실제로 헤어졌|sourceCandidateId|별도 궁합 점수/);
    const contents = book.pages.find(p => p.id === "contents");
    expect(contents?.kind === "contents" && contents.entries).toHaveLength(9);
    const paragraphs = book.pages.flatMap(p => p.kind === "narrative" ? p.paragraphs : []);
    expect(paragraphs.map(p => p.heading)).toEqual(d.chapters.flatMap(c => c.paragraphs.map(p => p.purpose)));
    expect(new Set(paragraphs.map(p => p.anchorId)).size).toBe(prose.length);
    const detail = book.pages.find(p => p.id === "read-again");
    expect(detail?.kind === "contents" && detail.entries.filter(e => e.targetId.startsWith("love-ch"))).toHaveLength(prose.length);
    for (const p of book.pages) if (p.kind === "contents") for (const v of p.entries) expect(book.pages[v.page].id === v.targetId || book.pages[v.page].anchors?.includes(v.targetId)).toBe(true);
    const snapshot = createProductPreviewSnapshot({ reportId: `love-release-${f.id}`, createdAtIso: e.generatedAt, productKey: e.input.productKey, productSlug: e.input.productSlug, draft: generated.draft as unknown as ProductPreviewSnapshotDraft, evidencePacket: e });
    expect(snapshot.ok).toBe(true); if (snapshot.ok) {
      const saved = JSON.parse(JSON.stringify(snapshot.value)); expect(storedBook(saved)?.data).toEqual(book); expect(storedBook(saved, "https://example.test/r/synthetic-love")?.data).toEqual(book);
    }
    if (!f.mbti) expect(d.chapters.flatMap(c => c.paragraphs.flatMap(p => p.sentences)).every(s => !s.mbtiSourceNodeIds.length)).toBe(true);
    if (!f.time) expect(d.chapters.flatMap(c => c.paragraphs.flatMap(p => p.sentences.flatMap(s => s.evidenceIds)))).not.toContainEqual(expect.stringMatching(/hour/));
  }, 120000);
  it("records actual common copy across A-D", () => {
    if (readers.length < 4) return;
    const comparisons = compareLoveReaders(readers.slice(0, 4));
    if (process.env.LOVE_EDITORIAL_EXPORT === "1") writeFileSync(root + "/cross-reader.json", JSON.stringify(comparisons, null, 2));
    for (const b of ["B", "C", "D"]) {
      const a = readers.find(r => r.id === "A")!.draft, other = readers.find(r => r.id === b)!.draft;
      for (const c of a.chapters) expect(c.paragraphs.map(p => p.text).join("\n")).not.toBe(other.chapters.find(d => d.id === c.id)!.paragraphs.map(p => p.text).join("\n"));
      if (b !== "D") expect(a.chapters[0].paragraphs[1].sentences.flatMap(s => s.mbtiSourceNodeIds).join()).not.toBe(other.chapters[0].paragraphs[1].sentences.flatMap(s => s.mbtiSourceNodeIds).join());
    }
  });
  it.each(MBTI_SOURCE_TYPES)("%s uses real relationship and own-parenting data", mbti => {
    const result = buildV4LoveProduct(fixtureInput({ ...A, mbti })); expect(result.ok).toBe(true); if (!result.ok) return;
    const d = result.integration.readerEdition;
    if (process.env.LOVE_EDITORIAL_EXPORT === "1") { mkdirSync(root + "/types", { recursive: true }); writeFileSync(`${root}/types/${mbti}.json`, JSON.stringify({ length: d.bodyLength, counts: d.chapters.map(c => c.paragraphs.length), validation: result.integration.readerValidation, parenting: d.chapters[7] }, null, 2)); }
    expect(result.integration.publishedEdition).toBe(LOVE_RELEASE_VERSION); expect(result.integration.readerValidation).toEqual({ hardErrors: [], qualityIssues: [] });
    expect(d.chapters.map(c => c.paragraphs.length)).toEqual(Array(9).fill(4)); expect(d.bodyLength).toBeGreaterThanOrEqual(8000); expect(d.bodyLength).toBeLessThanOrEqual(10000);
    expect(d.chapters[7].paragraphs.some(p => p.sentences.some(s => s.mbtiSourceNodeIds.some(id => id.includes(`mbti:${mbti}:traits:parenting:`))))).toBe(true);
  }, 120000);
  it.each(RELATIONSHIP_STATUSES)("status %s changes application, not the frozen personal profile", relationshipStatus => {
    const r = buildV4LoveProduct(fixtureInput({ ...A, context: { ...A.context, relationshipStatus } })); expect(r.ok).toBe(true); if (!r.ok) return;
    const baseline = buildV4LoveProduct(fixtureInput(A)); if (!baseline.ok) return expect.unreachable();
    expect(r.integration.personalDigest).toBe(baseline.integration.personalDigest);
    expect(r.integration.readerValidation.hardErrors).toEqual([]); expect(r.integration.publishedEdition).toBe(LOVE_RELEASE_VERSION);
    if (relationshipStatus !== "dating") expect(r.integration.readerEdition.chapters[3].paragraphs[0].text).not.toBe(baseline.integration.readerEdition.chapters[3].paragraphs[0].text);
    const text = r.integration.readerEdition.chapters.map(c => c.paragraphs.map(p => p.text).join(" ")).join("\n");
    if (relationshipStatus !== "married") expect(text).not.toMatch(/현재 배우자|함께 사는 현재 생활/);
    expect(text).not.toMatch(/자녀가 있|당신의 아이는|지난 이별|외도를 했/);
    if (process.env.LOVE_EDITORIAL_EXPORT === "1") { mkdirSync(root + "/states", { recursive: true }); writeFileSync(`${root}/states/${relationshipStatus || 'unknown'}.json`, JSON.stringify({ personalDigest: r.integration.personalDigest, status: relationshipStatus, current: r.integration.readerEdition.chapters[3], home: r.integration.readerEdition.chapters[6], validation: r.integration.readerValidation }, null, 2)); }
  }, 120000);
  it.each(RUNTIME_FIXTURES)("$id remains identical at the release boundary", async f => {
    if (f.id === "compatibility") {
      // The next pair release has its own new-output locks. Retain this
      // release boundary as an exact replay check for the saved prior edition.
      const old = JSON.parse(readFileSync("tests/fixtures/completed-report/compatibility-editorial-base.json", "utf8"));
      expect(v4Digest(storedBook(old.snapshot)?.data)).toBe(locks.compatibility[2]);
      expect(storedBook(old.snapshot, "https://example.test/r/old-pair")?.data).toEqual(old.book);
      return;
    }
    if (f.id === "love") {
      const old = JSON.parse(readFileSync("tests/fixtures/completed-report/love-editorial-base.json", "utf8"));
      expect(storedBook(old.snapshot)?.data).toEqual(old.book); expect(storedBook(structuredClone(old.snapshot), "https://example.test/r/old-love")?.data).toEqual(old.book);
      const fresh = await generateV4ShadowReport(f.payload, SHADOW_CLOCK); if (!fresh.ok) return expect.unreachable();
      const book = projectBook(fresh.evidencePacket as V4RuntimeEvidence); if (!book) return expect.unreachable();
      const preserved = new Set(["cover", "input", "manse", "mbti", "back"]);
      expect(book.pages.filter(p => preserved.has(p.kind))).toEqual(old.book.pages.filter((p: { kind: string }) => preserved.has(p.kind)));
      // The inventory/copy is frozen; `core` is the edition's actual body-use
      // marker, so an old unused hero must not be relabeled as new evidence.
      const inventory = (pages: typeof book.pages) => pages.flatMap(p => p.kind === "appendix" ? p.items.map(item => { const copy = { ...item }; delete copy.core; return copy; }) : []);
      expect(inventory(book.pages)).toEqual(inventory(old.book.pages));
      for (const key of ["bookId", "title", "names", "people", "context", "share", "readingDate"] as const) expect(book[key]).toEqual(old.book[key]);
      return;
    }
    const r = await generateV4ShadowReport(f.payload, SHADOW_CLOCK); if (!r.ok) return expect.unreachable();
    expect([v4Digest(r.draft), v4Digest(r.evidencePacket), v4Digest(projectBook(r.evidencePacket as V4RuntimeEvidence))]).toEqual(locks[f.id as keyof typeof locks]);
  }, 120000);
  it("rejects invented roots, child inference and reversed axes without changing the paid gate", () => {
    const input = fixtureInput(A), built = buildRelationshipProfiles(input), r = buildV4LoveProduct(input); if (!built.ok || !r.ok) return expect.unreachable();
    const view = projectRelationshipView(built.profiles), broken = structuredClone(r.integration.readerEdition), first = broken.chapters[0].paragraphs[0].sentences[0];
    first.evidenceIds = ["invented-root"];
    expect(validateLoveRelease(broken, view, r.materials, {}).hardErrors).toContain("CH01.P1:UNKNOWN_MYEONGLI");
    const reversed = structuredClone(r.integration.readerEdition), s = reversed.chapters[0].paragraphs[0].sentences[0];
    s.provenance.direction = s.provenance.direction === 1 ? -1 : 1;
    expect(validateLoveRelease(reversed, view, r.materials, {}).hardErrors).toContain("CH01.P1:UNSUPPORTED_SIGNED_AXIS");
    first.provenance.sourceRefs.push("mbti:ENTJ:traits:child:invented");
    expect(validateLoveRelease(broken, view, r.materials, {}).hardErrors).toContain("CH01.P1:PEER_OR_CHILD_INFERENCE");
  }, 120000);
  it("CH09 segment joining retains every paragraph, note and old anchor", () => {
    const draft = { version: LOVE_RELEASE_VERSION, chapters: [{ id: "CH09", key: "direction", title: "closing", paragraphs: [] }], bodyLength: 0, shortages: [] };
    const result = loveReaderPages([{ kind: "narrative", id: "chapter-fortune", title: "good", paragraphs: [{ text: "a", notes: [1] }], notes: [{ name: "a", text: "aa" }] }, { kind: "narrative", id: "chapter-direction", title: "closing", paragraphs: [{ text: "b", notes: [1] }], notes: [{ name: "b", text: "bb" }] }], draft);
    expect(result).toHaveLength(1); const p = result[0]; if (p.kind !== "narrative") return expect.unreachable();
    expect(p.paragraphs.map(p => p.text)).toEqual(["a", "b"]); expect(p.paragraphs.map(p => p.notes)).toEqual([[1], [2]]); expect(p.anchors).toContain("chapter-fortune");
  });
});
