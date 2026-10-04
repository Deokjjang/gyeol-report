import { mkdirSync, writeFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { BOOK_FIXTURES, loadRuntimeBook } from "../../../../src/app/dev/book-preview/runtimeBooks";
import { projectBook, bookFeatureInventory } from "../../../../src/app/dev/book-preview/bookProjection";
import { BookReader } from "../../../../src/app/dev/book-preview/BookReader";
import type { BookData } from "../../../../src/app/dev/book-preview/bookTypes";
import { generateV4ShadowReport } from "../../../../src/lib/interpretation-v4/runtimeShadow";
import { projectV4Composition, projectV4Tables, v4Digest, type V4RuntimeEvidence } from "../../../../src/lib/interpretation-v4/runtimeProjection";
import { MATERIAL_BY_FEATURE, canonicalV4Feature } from "../../../../src/lib/interpretation-v4/materialRegistry";
import { depthFeature } from "../../../../src/lib/interpretation-v4/materialDepth";
import { SHADOW_CLOCK } from "../../interpretation-v4/runtimeFixtures";
const samples = new Map<string, { evidence: V4RuntimeEvidence; data: BookData }>();
const noop = () => {};
beforeAll(async () => {
  vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new Error("NETWORK_FORBIDDEN"))));
  for (const f of BOOK_FIXTURES) {
    const generated = await generateV4ShadowReport(f.payload, SHADOW_CLOCK);
    expect(generated, f.id).toMatchObject({ ok: true, externalCalls: [] });
    if (!generated.ok) continue;
    const evidence = generated.evidencePacket as V4RuntimeEvidence;
    const before = v4Digest(evidence), data = projectBook(evidence);
    expect(data, f.id).not.toBeNull();
    expect(v4Digest(evidence), "projection must not mutate frozen evidence/copy").toBe(before);
    samples.set(f.id, { evidence, data: data! });
  }
  expect(fetch).not.toHaveBeenCalled();
}, 60000);
afterAll(() => vi.unstubAllGlobals());

describe("actual V4 packet → book pages; no new calculation or prose", () => {
  it.each(BOOK_FIXTURES)("$id: every original paragraph and final line in original order", ({ id }) => {
    const { evidence, data } = samples.get(id)!;
    const view = projectV4Composition(evidence.composition);
    const chapters = data.pages.filter(p => p.kind === "narrative");
    expect(chapters.map(p => p.title)).toEqual([view.headline, ...view.sections.map(s => s.title)]);
    expect(chapters.flatMap(p => p.paragraphs.map(p => p.text))).toEqual([...view.opening, ...view.sections.flatMap(s => s.paragraphs)]);
    expect(data.pages[0].kind).toBe("cover");
    expect(data.pages.at(-1)).toEqual({ kind: "back", title: "이 책 공유하기", finalLine: view.finalLine });
    expect(JSON.parse(JSON.stringify(data))).toStrictEqual(data);
    expect(JSON.stringify(data)).not.toMatch(/sourceRefs|seedIds|fusionIds|natalEvidence|calendarMonths:|contentDigest|v4_structure:|confidence|망신|MYOSI/);
    for (const page of data.pages) {
      const html = renderToStaticMarkup(<BookReader data={data} page={page} onNote={noop} onPage={noop} onShare={noop} />);
      expect(html).not.toMatch(/sourceRefs|<footer/);
      expect(html.replace(/<[^>]*>/g, "")).not.toMatch(/\b(?:metal|water|career_shift)\b/);
      if (page.kind === "narrative") {
        for (const p of page.paragraphs) {
          expect(html).toContain(renderToStaticMarkup(<span>{p.text}</span>).slice(6, -7));
          expect(p.notes.every(n => n >= 1 && n <= page.notes.length)).toBe(true);
        }
        if (page.notes.length) expect(html).toContain('aria-label="이 장의 각주"');
      }
    }
  });
  it.each(BOOK_FIXTURES)("$id: complete canonical tables, MBTI and untruncated inventory", ({ id }) => {
    const { evidence: e, data } = samples.get(id)!;
    const tables = projectV4Tables(e);
    data.people.forEach((p, i) => {
      expect(p.table.mbti).toEqual(tables[i].mbti);
      expect(p.table.elements).toEqual(tables[i].elements);
      expect(p.table.manse.stemRow).toEqual(tables[i].manse.stemRow);
      expect(p.table.manse.branchRow).toEqual(tables[i].manse.branchRow);
      expect(p.table.manse.fiveElementDistribution).toEqual(tables[i].manse.fiveElementDistribution);
      expect(p.table.manse.detailRows.map(r => r.key)).toEqual(tables[i].manse.detailRows.map(r => r.key));
      p.table.manse.detailRows.forEach((r, row) => {
        for (const key of ["hour", "day", "month", "year"] as const) expect(r.cells[key]).toEqual(tables[i].manse.detailRows[row].cells[key].filter(v => !v.includes("망신")));
      });
    });
    const slots = e.input.kind === "compatibility" ? ["personA", "personB"] as const : ["person"] as const;
    const expected = slots.flatMap((slot, i) => bookFeatureInventory(e, slot, data.people[i].name).map(f => f.display));
    const appendix = data.pages.filter(p => p.kind === "appendix");
    const displayKey = (f: (typeof expected)[number]) => JSON.stringify({ ...f, core: undefined });
    expect(appendix.flatMap(p => p.items).map(displayKey).sort()).toEqual(expected.map(displayKey).sort());
    expect(expected.length).toBeGreaterThan(10);
    expect(new Set(expected.map(f => f.person + f.name)).size).toBe(expected.length);
    expect(expected.every(f => f.name && f.meaning)).toBe(true);
    // Independently require every engine-selected material, not only the
    // inventory adapter's own output. This catches accidental appendix caps.
    const materials = e.composition.product === "saju_mbti_compatibility"
      ? [e.composition.result.persons.personA.materials, e.composition.result.persons.personB.materials]
      : [e.composition.result.materials];
    materials.forEach((packet, i) => packet.selected.forEach(m => {
      const label = MATERIAL_BY_FEATURE.get(depthFeature(canonicalV4Feature(m.feature)))?.label;
      expect(expected.some(f => f.person === data.people[i].name && f.name === label), `${id}: ${m.feature}`).toBe(true);
    }));
    expect(JSON.stringify(expected)).not.toMatch(/망신|문곡|복성|천의성/);
    expect(appendix).toHaveLength(slots.length);
    appendix.forEach((p, i) => {
      expect(p.from).toBe(1 + appendix.slice(0, i).reduce((n, a) => n + a.items.length, 0));
      expect(p.total).toBe(expected.length);
      expect(p.items.length).toBe(expected.filter(f => f.person === data.people[i].name).length);
    });
  });
  it("14 years, 10 future years, all ages, transitions and clickable full narratives", () => {
    const { evidence: e, data } = samples.get("major")!;
    if (e.composition.product !== "major_fortune") return;
    const page = data.pages.find(p => p.kind === "timeline")!;
    expect(page.years).toHaveLength(14);
    expect(page.years.filter(y => y.time === "앞으로")).toHaveLength(10);
    expect(page.transitions.length).toBeGreaterThan(0);
    page.years.forEach((y, i) => {
      const original = e.composition.product === "major_fortune" ? e.composition.result.years[i] : null;
      expect([y.year, y.age, y.cycle, y.annual, y.title]).toEqual([original!.year, original!.age, original!.cycle.ganji, original!.annual.ganji, original!.title]);
      expect(data.pages[y.page].kind).toBe("narrative");
    });
    page.transitions.forEach(t => expect(data.pages[t.page].kind).toBe("narrative"));
  });
  it("12 months and exact canonical Jie ordering remain in the source, never raw timestamps in prose", () => {
    const { evidence: e, data } = samples.get("annual")!;
    if (e.composition.product !== "annual_fortune") return;
    const page = data.pages.find(p => p.kind === "months")!;
    expect(page.months.map(m => m.month)).toEqual(Array.from({ length: 12 }, (_, i) => i + 1));
    expect(page.months.find(m => m.time === "지금")?.month).toBe(10);
    page.months.forEach((m, i) => {
      if (e.composition.product !== "annual_fortune") return;
      const original = e.composition.result.months[i], source = e.composition.result.evidence.months[i];
      expect(m.ganji).toBe(original.focus.monthPillar.stem + original.focus.monthPillar.branch);
      expect(original.provenance).toContain("annual-month-jie-kst-v2");
      expect(source.segments.every((s, j) => Date.parse(s.startKst) < Date.parse(s.endKstExclusive) && (j === 0 || source.segments[j - 1].endKstExclusive === s.startKst))).toBe(true);
      const chapter = data.pages[m.page];
      expect(chapter.kind).toBe("narrative");
      if (chapter.kind === "narrative") expect(chapter.paragraphs.map(p => p.text)).toEqual(original.blocks.map(b => b.text));
    });
    expect(JSON.stringify(data)).not.toMatch(/T\d\d:\d\d:\d\d|calendarMonths:/);
  });
  it("seven categories preserve roles and both actual directional sections without scores", () => {
    const categories = new Set<string>();
    for (const { evidence: e, data } of samples.values()) {
      if (e.input.kind !== "compatibility") continue;
      categories.add(e.input.relationshipType);
      const view = projectV4Composition(e.composition), pair = data.pages.find(p => p.kind === "pair")!;
      expect(data.people.map(p => p.name)).toEqual([e.input.personA.name, e.input.personB.name]);
      expect(pair.directions.map(d => d.title)).toEqual([view.compatibility!.aToB.title, view.compatibility!.bToA.title]);
      expect(view.compatibility!.aToB.paragraphs).not.toEqual(view.compatibility!.bToA.paragraphs);
      pair.directions.forEach((d, i) => {
        const page = data.pages[d.page]; expect(page.kind).toBe("narrative");
        if (page.kind === "narrative") expect(page.paragraphs.map(p => p.text)).toEqual((i === 0 ? view.compatibility!.aToB : view.compatibility!.bToA).paragraphs);
      });
      if (e.input.relationshipType === "parentChild") expect(data.people.map(p => p.role)).toEqual(["부모", "자녀"]);
      if (e.input.relationshipType === "managerReport") expect(data.people.map(p => p.role)).toEqual(["상사", "부하·팀원"]);
      expect(JSON.stringify(data)).not.toMatch(/\d+점|\d+%|[SAB]등급|궁합 점수|★/);
    }
    expect(categories.size).toBe(7);
  });
  it("unknown hour/type never invented; approximate slot uses canonical Korean label", () => {
    const unknown = samples.get("full-unknown")!.data;
    expect(unknown.people[0].table.mbti).toBeNull();
    const love = samples.get("love")!.data;
    expect(love.people[0].table.manse.stemRow.hour).toBeNull();
    expect(love.people[0].table.manse.branchRow.hour).toBeNull();
    expect(love.people[0].timeLabel).toBe("출생시간 모름");
    expect(samples.get("full-approximate")!.data.people[0].timeLabel).toBe("대략 · 묘시 05:00~06:59");
    expect(love.context).toContainEqual({ label: "현재 관계", value: "연애" });
    expect(samples.get("career")!.data.context).toContainEqual({ label: "현재 직업", value: "제조업 재무기획 과장" });
  });
  it("server cache only accepts finite approved fixtures and projection fails closed on tampering", async () => {
    expect(await loadRuntimeBook("arbitrary-input")).toBeNull();
    expect(await loadRuntimeBook("comprehensive")).toEqual(samples.get("comprehensive")!.data);
    const e = JSON.parse(JSON.stringify(samples.get("comprehensive")!.evidence)) as V4RuntimeEvidence;
    Object.assign(e.composition.result.narrative, { finalLine: "changed" });
    expect(projectBook(e)).toBeNull();
    expect(fetch).not.toHaveBeenCalled();
  });
  it("exports reviewer page inventory when explicitly requested", () => {
    if (!process.env.V4_BOOK_EXPORT) return;
    mkdirSync(process.env.V4_BOOK_EXPORT, { recursive: true });
    const manifest = [...samples.entries()].map(([id, { data }]) => {
      writeFileSync(`${process.env.V4_BOOK_EXPORT}/${id}.json`, JSON.stringify(data, null, 2));
      return { id, title: data.title, names: data.names, pages: data.pages.length, appendix: data.pages.flatMap(p => p.kind === "appendix" ? p.items : []).length, notes: data.pages.flatMap(p => p.kind === "narrative" ? p.notes : []).length };
    });
    writeFileSync(`${process.env.V4_BOOK_EXPORT}/manifest.json`, JSON.stringify(manifest, null, 2));
  });
});
