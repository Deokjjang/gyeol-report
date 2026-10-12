import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { generateV4ShadowReport } from "../../../src/lib/interpretation-v4/runtimeShadow";
import { projectBook } from "../../../src/app/dev/book-preview/bookProjection";
import { storedBook } from "../../../src/lib/book/storedReport";
import { validateV4Publication, type V4RuntimeEvidence } from "../../../src/lib/interpretation-v4/runtimeProjection";
import type { ReleaseDraft } from "../../../src/lib/interpretation-v4/comprehensiveReleaseRenderer";
import { COMPREHENSIVE_QUALITY_CASES, QUALITY_CLOCK } from "./comprehensiveQualityFixtures";
const fixture = (name: string) => JSON.parse(readFileSync(new URL(`../../fixtures/comprehensive-quality-01/${name}.json`, import.meta.url), "utf8"));
const hash = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const readers = new Map<string, ReleaseDraft>();

describe("comprehensive reader questions and proof preservation", () => {
  it.each(COMPREHENSIVE_QUALITY_CASES)("$id retains 13/52, real proof and deterministic publication", async ({ id, payload }) => {
    const inputBefore = JSON.stringify(payload);
    const generated = await generateV4ShadowReport(payload, QUALITY_CLOCK);
    expect(generated.ok).toBe(true);
    if (!generated.ok) return;
    const e = generated.evidencePacket as V4RuntimeEvidence;
    if (e.composition.product !== "saju_mbti_full" || !("integration" in e.composition.result)) return expect.unreachable();
    const { readerEdition: draft, readerValidation: validation } = e.composition.result.integration;
    readers.set(id, draft);
    expect(draft.chapters.map(c => c.paragraphs.length)).toEqual(Array(13).fill(4));
    expect(validation.hardErrors).toEqual([]);
    expect(validation.qualityIssues).toEqual([]);
    expect(draft.bodyLength).toBeGreaterThanOrEqual(9000);
    expect(draft.bodyLength).toBeLessThanOrEqual(11000);
    expect(hash(e.calculations)).toBe(fixture("engine-locks").find((row: { id: string }) => row.id === id).calculationsSha256);
    expect(generated.externalCalls).toEqual([]);
    expect(validateV4Publication("saju_mbti_full", generated.draft, e)).toEqual({ ok: true, errors: [] });
    expect(JSON.stringify(payload)).toBe(inputBefore);
    expect(await generateV4ShadowReport(payload, QUALITY_CLOCK)).toEqual(generated);
    const chapters = draft.chapters;
    const p = (chapter: number, paragraph: number) => chapters[chapter - 1].paragraphs[paragraph - 1];
    // First-impression and friendship scenes cannot silently become job advice.
    expect(p(4, 1).text).not.toMatch(/업무|직무/);
    expect(p(12, 2).text).not.toMatch(/직장|동료|업무|회의/);
    expect(chapters[4].paragraphs.slice(0, 3).map(p => p.semanticKey.split(":")[1])).toHaveLength(3);
    expect(new Set(chapters[4].paragraphs.slice(0, 3).map(p => p.semanticKey))).toHaveProperty("size", 3);
    expect(p(5, 4).sentences[0].evidenceIds).toEqual(p(5, 1).sentences[0].evidenceIds);
    const introduced = new Set(chapters.slice(0, 12).flatMap(c => c.paragraphs.flatMap(p => p.sentences.flatMap(s => s.evidenceIds))));
    expect(chapters[12].paragraphs.flatMap(p => p.sentences).every(s => s.provenance.application === "RECALL" && s.evidenceIds.every(id => introduced.has(id)))).toBe(true);
    expect(p(13, 4).text).toMatch(/일에서는.+돈에서는.+관계에서는/);
    expect(chapters.flatMap(c => c.paragraphs).map(p => p.text).join("\n")).not.toMatch(/임수은|사화은|기운 면|사람 같은 면|수업에서 적극적으로 답하고/);
    if (!payload.person.mbtiType) {
      expect(chapters.flatMap(c => c.paragraphs.flatMap(p => p.sentences)).every(s => !s.mbtiSourceNodeIds.length && !s.fusionIds.length)).toBe(true);
    } else {
      expect(chapters[2].paragraphs.every(p => p.sentences.some(s => s.fusionIds.length && s.mbtiSourceNodeIds.length))).toBe(true);
    }
    if (!payload.person.birthTime) {
      expect(e.calculations.person?.pillars).not.toHaveProperty("hour");
      expect(chapters[1].paragraphs[0].text).toContain("시주를 보태어");
    }
  }, 120000);

  it("different customers retain distinct talent, risk, money and closing combinations", () => {
    for (const [left, right] of [["A", "B"], ["A", "C"], ["B", "C"]]) {
      const a = readers.get(left)!, b = readers.get(right)!;
      for (const index of [2, 4, 5, 7, 8, 9, 12]) {
        expect(a.chapters[index].paragraphs.map(p => p.text)).not.toEqual(b.chapters[index].paragraphs.map(p => p.text));
      }
    }
    expect(readers.get("A")!.chapters[5].paragraphs[0].semanticKey).not.toBe(readers.get("B")!.chapters[5].paragraphs[0].semanticKey);
    expect(new Set(["A", "B", "C"].map(id => readers.get(id)!.chapters[8].paragraphs[2].text)).size).toBe(3);
    for (const id of ["A", "B"]) expect(readers.get(id)!.chapters[8].paragraphs[1].text).toMatch(/재물과 연결해 읽는 근거는.+[정편]재/);
  });

  it("the previous paid edition reopens verbatim for owner and shared readers", () => {
    const old = fixture("previous-book"), before = JSON.stringify(old.snapshot);
    expect(storedBook(old.snapshot)?.data).toEqual(old.book);
    expect(storedBook(old.snapshot, "https://example.test/r/existing-token")?.data).toEqual(old.book);
    expect(JSON.stringify(old.snapshot)).toBe(before);
  });

  it.each(fixture("other-products") as { id: string; payload: unknown; sha256: string }[])("$id keeps its baseline full result and Book", async ({ payload, sha256 }) => {
    const generated = await generateV4ShadowReport(payload, QUALITY_CLOCK);
    expect(generated.ok).toBe(true);
    expect(hash({ generated, book: generated.ok ? projectBook(generated.evidencePacket as V4RuntimeEvidence) : null })).toBe(sha256);
  }, 120000);
});
