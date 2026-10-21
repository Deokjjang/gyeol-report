import { preFoundationEvidence } from "../../helpers/versionedEditorialLocks";
import type { ComprehensiveNarrative } from "../../../src/lib/interpretation-v4/narrativeTypes";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { generateV4ShadowReport } from "../../../src/lib/interpretation-v4/runtimeShadow";
import { validateV4Publication, v4Digest, type V4RuntimeEvidence } from "../../../src/lib/interpretation-v4/runtimeProjection";
import { projectBook } from "../../../src/app/dev/book-preview/bookProjection";
import { BookReader } from "../../../src/app/dev/book-preview/BookReader";
import { RUNTIME_FIXTURES, SHADOW_CLOCK, singleRuntimeInput } from "./runtimeFixtures";
import { COMPATIBILITY_NARRATIVE_FIXTURES } from "./compatibilityFixtures";
import { NARRATIVE_FIXTURES } from "./narrativeFixtures";

const cases = [
  ...RUNTIME_FIXTURES,
  ...COMPATIBILITY_NARRATIVE_FIXTURES.slice(0, 7).flatMap(f => [
    { id: `pair-${f.id}`, payload: f.payload },
    { id: `pair-${f.id}-swapped`, payload: { ...f.payload, personA: f.payload.personB, personB: f.payload.personA } },
  ]),
  { id: "unknown", payload: singleRuntimeInput("saju_mbti_full", "saju-mbti-full", { ...NARRATIVE_FIXTURES[0], time: "", mbti: null }) },
  { id: "approximate", payload: singleRuntimeInput("saju_mbti_full", "saju-mbti-full", { ...NARRATIVE_FIXTURES[0], time: "" }, "SASI") },
  { id: "different-mbti", payload: singleRuntimeInput("saju_mbti_full", "saju-mbti-full", { ...NARRATIVE_FIXTURES[0], mbti: "ISFJ" }) },
  { id: "different-chart", payload: singleRuntimeInput("saju_mbti_full", "saju-mbti-full", { ...NARRATIVE_FIXTURES[9], mbti: NARRATIVE_FIXTURES[0].mbti }) },
];
const noop = () => {};
const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

describe("foundation integration: actual generator, complete Book and frozen prior editions", () => {
  it.each(cases)("$id preserves calculated evidence, full structure and publication", async ({ id, payload }) => {
    const generated = await generateV4ShadowReport(payload, SHADOW_CLOCK);
    expect(generated, id).toMatchObject({ ok: true, externalCalls: [] });
    if (!generated.ok) return;
    const e = generated.evidencePacket as V4RuntimeEvidence;
    expect(validateV4Publication(e.productType, generated.draft, e)).toEqual({ ok: true, errors: [] });
    const book = projectBook(e);
    expect(book).not.toBeNull();
    if (!book) return;
    const capture = process.env.FOUNDATION_CAPTURE_DIR;
    if (capture) { mkdirSync(capture, { recursive: true }); writeFileSync(join(capture, `${id}.json`), JSON.stringify({ evidence: e, draft: generated.draft, book }, null, 2)); }
    const n: Pick<ComprehensiveNarrative, "headline" | "opening" | "sections" | "finalLine"> = e.composition.result.narrative;
    // Postgres JSONB can reorder all object keys without changing the data.
    const reordered = JSON.parse(JSON.stringify(e, (_key, value: unknown) => value && typeof value === "object" && !Array.isArray(value)
      ? Object.fromEntries(Object.entries(value).sort(([a], [b]) => b.localeCompare(a))) : value)) as V4RuntimeEvidence;
    expect(validateV4Publication(e.productType, generated.draft, reordered)).toEqual({ ok: true, errors: [] });
    expect(e.foundationRevision).toBe("foundation-engine-01");
    expect(e.foundation?.traces).toHaveLength(n.opening.length + n.sections.reduce((count, section) => count + section.blocks.length, 0));
    expect(e.foundation!.chapters.some(ch => ch.rootedBlocks > 0)).toBe(true);
    if (e.productType === "major_fortune" || e.productType === "annual_fortune") {
      const temporal = e.foundation!.traces.flatMap(t => t.references).filter(r => r.basis === "period");
      expect(temporal.length).toBeGreaterThan(0);
      expect(temporal.every(r => r.period && r.scope !== "natal")).toBe(true);
    }
    if (id === "unknown") expect(e.foundation!.traces.flatMap(t => t.references).some(r => r.basis === "mbti" || r.basis === "fusion")).toBe(false);
    if (id === "comprehensive") {
      const changed = { ...e, foundation: { ...e.foundation!, traces: e.foundation!.traces.map((trace, index) => index === 0 ? { ...trace, references: [] } : trace) } };
      const resealed = { ...changed, contentDigest: v4Digest({ ...changed, contentDigest: undefined }) };
      expect(validateV4Publication(e.productType, generated.draft, resealed).errors).toContain("V4_FOUNDATION_CONTRACT_INVALID");
      expect(() => preFoundationEvidence(resealed)).toThrow();
    }
    const text = [...n.opening, ...n.sections.flatMap(s => s.blocks)].map(b => b.text);
    expect(book.pages.filter(p => p.kind === "narrative").flatMap(p => p.paragraphs.map(b => b.text))).toEqual(text);
    expect(book.pages[0].kind).toBe("cover");
    expect(book.pages.at(-1)).toMatchObject({ kind: "back", finalLine: n.finalLine });
    expect(book.pages.some(p => p.kind === "appendix")).toBe(true);
    if (["saju_mbti_full", "career_money_study", "love_marriage_child", "saju_mbti_compatibility"].includes(e.productType)) {
      const chapters = e.productType === "saju_mbti_full" ? 13 : 9;
      expect(book.pages.filter(p => p.kind === "narrative")).toHaveLength(chapters);
      expect(text).toHaveLength(chapters * 4);
    }
    if (e.composition.product === "major_fortune") expect(e.composition.result.years).toHaveLength(14);
    if (e.composition.product === "annual_fortune") expect(e.composition.result.months.map(m => m.month)).toEqual(Array.from({ length: 12 }, (_, i) => i + 1));
    const html = book.pages.map((page, i) => `<section id="page-${i}"><a href="#top">목차로</a>${renderToStaticMarkup(<BookReader data={book} page={page} onNote={noop} onPage={noop} onShare={noop} />)}</section>`).join("\n");
    expect(html).not.toMatch(/sourceRefs|seedIds|fusionIds|contentDigest/);
    const priorDir = process.env.FOUNDATION_BASELINE_DIR;
    if (priorDir) {
      const prior = JSON.parse(readFileSync(join(priorDir, `${id}.json`), "utf8")) as { evidence: V4RuntimeEvidence; draft: unknown };
      expect(validateV4Publication(prior.evidence.productType, prior.draft, prior.evidence)).toEqual({ ok: true, errors: [] });
      expect(e.calculations).toEqual(prior.evidence.calculations);
      expect(preFoundationEvidence(e)).toEqual(prior.evidence);
      expect(projectBook(prior.evidence)).not.toBeNull();
    }
    const out = process.env.FOUNDATION_CAPTURE_DIR;
    if (out) {
      mkdirSync(out, { recursive: true });
      writeFileSync(join(out, `${id}.json`), JSON.stringify({ evidence: e, draft: generated.draft, book }, null, 2));
      writeFileSync(join(out, `${id}.txt`), [n.headline, ...n.opening.map(b => b.text), ...n.sections.flatMap(s => [s.title, ...s.blocks.map(b => b.text)]), n.finalLine].join("\n\n"));
      writeFileSync(join(out, `${id}.html`), `<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(id)}</title><style>body{margin:0 auto;max-width:850px;padding:24px;font-family:serif;line-height:1.9;color:#111;background:#fff}section{padding:28px 0;border-top:1px solid #bbb}table{width:100%}a{color:inherit}button{display:none}</style><nav id="top">${book.pages.map((p, i) => `<a href="#page-${i}">${escape(p.title)}</a>`).join(" · ")}</nav>${html}</html>`);
      writeFileSync(join(out, `${id}.summary.json`), JSON.stringify({ id, product: e.productType, chapters: book.pages.filter(p => p.kind === "narrative").length, paragraphs: text.length, characters: text.join("").length, pages: book.pages.length, calculationsDigest: v4Digest(e.calculations), narrativeDigest: v4Digest(n), bookDigest: v4Digest(book) }, null, 2));
    }
  }, 120000);
});
