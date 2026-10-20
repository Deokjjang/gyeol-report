import { conversationalVoice } from "../../../src/lib/interpretation-v4/contentSynthesis";
import { beforeAll, expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
vi.mock("server-only", () => ({}));
import { generateV4ShadowReport } from "../../../src/lib/interpretation-v4/runtimeShadow";
import { validateV4Publication, type V4RuntimeEvidence } from "../../../src/lib/interpretation-v4/runtimeProjection";
import { projectBook } from "../../../src/app/dev/book-preview/bookProjection";
import { BookReader } from "../../../src/app/dev/book-preview/BookReader";
import { ANNUAL_MONTH_STORIES } from "../../../src/lib/interpretation-v4/annualStories";
import { MAJOR_SAFETY_CASES, MAJOR_SAFETY_CLOCK } from "./majorEditorialSafetyFixtures";
const samples = new Map<string, V4RuntimeEvidence>();
const payload = (f: typeof MAJOR_SAFETY_CASES[number]) => ({ ...f.payload, productKey: "annual_fortune", productSlug: "annual-fortune", productOptions: { contentVersion: "v4", selectedYear: "2026" } });
beforeAll(async () => {
  for (const f of MAJOR_SAFETY_CASES) {
    const p = payload(f), g = await generateV4ShadowReport(p, MAJOR_SAFETY_CLOCK);
    expect(g.ok, f.id).toBe(true); if (!g.ok) continue;
    expect(validateV4Publication("annual_fortune", g.draft, g.evidencePacket).ok).toBe(true);
    expect(g.externalCalls).toEqual([]);
    samples.set(f.id, g.evidencePacket as V4RuntimeEvidence);
  }
}, 120000);
it.each(MAJOR_SAFETY_CASES)("$id keeps twelve real months, aligned core titles and complete friendly Reader", ({ id }) => {
  const e = samples.get(id)!;
  if (e.composition.product !== "annual_fortune") return expect.unreachable();
  const r = e.composition.result, book = projectBook(e)!;
  expect(r.writerVersion).toBe("annual-full-content-refinement-01-v2");
  expect(r.months).toHaveLength(12); expect(r.editorial).toEqual([]);
  expect(book.pages.at(-1)?.kind).toBe("back");
  for (const m of r.months) {
    const story = ANNUAL_MONTH_STORIES[m.god][m.occurrence % 2];
    expect(m.title).toBe(story.title);
    const text = m.blocks.map(b => b.text).join(" ");
    expect([story.use, ...[0, 1, 2].map(offset => conversationalVoice(story.use, offset))].some(copy => text.includes(copy))).toBe(true);
    expect(m.focus).toEqual(r.evidence.months[m.month - 1].focus);
    expect(m.boundary.segments).toEqual(r.evidence.months[m.month - 1].segments.map(s => ({ start: s.startKst, end: s.endKstExclusive, ganji: s.monthPillar.stem + s.monthPillar.branch })));
  }
  for (const page of book.pages.filter(p => p.kind === "months" || p.kind === "narrative")) {
    const html = renderToStaticMarkup(createElement(BookReader, { data: book, page, onPage() {}, onNote() {}, onShare() {} }));
    // A natural work scene such as 마감 직전 is not a timestamp ledger.
    expect(html).not.toMatch(/\d{4}-\d\d-\d\dT|\+09:00|KST|직전까지|sourceRefs/);
  }
});
it("before a real Jie, current focus stays on the supplied earlier segment", async () => {
  const p = payload(MAJOR_SAFETY_CASES[0]);
  const g = await generateV4ShadowReport(p, { evaluatedAt: "2026-03-01T12:00:00+09:00" });
  expect(g.ok).toBe(true); if (!g.ok) return;
  const e = g.evidencePacket as V4RuntimeEvidence;
  if (e.composition.product !== "annual_fortune") return expect.unreachable();
  const march = e.composition.result.months[2], source = e.composition.result.evidence.months[2];
  expect(march.focus).toEqual(source.segments[0]);
  expect(march.boundary.explanation).toContain("경칩");
  expect(march.boundary.explanation).toContain("경계를 지나기 전");
  expect(march.blocks.some(b => b.id.endsWith("next-jie") && b.text.includes("경칩"))).toBe(true);
}, 120000);
