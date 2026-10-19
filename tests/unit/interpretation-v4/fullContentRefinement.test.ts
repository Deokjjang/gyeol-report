import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { generateV4ShadowReport } from "../../../src/lib/interpretation-v4/runtimeShadow";
import { projectBook } from "../../../src/app/dev/book-preview/bookProjection";
import { validateV4Publication, type V4RuntimeEvidence } from "../../../src/lib/interpretation-v4/runtimeProjection";
import { RUNTIME_FIXTURES, SHADOW_CLOCK } from "./runtimeFixtures";
import { READER_INNER_PORTRAIT, READER_TALENT_PORTRAIT, READER_PORTRAIT_ENDING } from "../../../src/lib/interpretation-v4/comprehensivePortraitMaterials";

describe("full content refinement uses the actual publication path", () => {
  it("each existing portrait facet has different inner, talent and ending material", () => {
    for (const facet of Object.keys(READER_INNER_PORTRAIT)) {
      const lines = [...READER_INNER_PORTRAIT[facet], ...READER_TALENT_PORTRAIT[facet], ...READER_PORTRAIT_ENDING[facet]];
      expect(new Set(lines).size).toBe(9);
      expect(lines.every(s => !/반드시|무조건|해왔|겪었/.test(s))).toBe(true);
    }
  });
  it("comprehensive keeps the complete book and closes with a portrait, with original proof", async () => {
    const payload = RUNTIME_FIXTURES.find(f => f.id === "comprehensive")!.payload;
    const g = await generateV4ShadowReport(payload, SHADOW_CLOCK);
    expect(g.ok).toBe(true); if (!g.ok) return;
    expect(validateV4Publication("saju_mbti_full", g.draft, g.evidencePacket).ok).toBe(true);
    const book = projectBook(g.evidencePacket as V4RuntimeEvidence)!;
    const paragraphs = book.pages.flatMap(p => p.kind === "narrative" ? p.paragraphs : []);
    expect(paragraphs).toHaveLength(52);
    expect(book.pages.at(-1)?.kind).toBe("back");
    const back = book.pages.at(-1);
    if (back?.kind === "back") expect(back.finalLine).not.toMatch(/하세요|해보세요|고르세요/);
    expect(g.externalCalls).toEqual([]);
  }, 120000);
});
