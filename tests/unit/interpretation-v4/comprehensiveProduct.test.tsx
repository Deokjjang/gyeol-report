import { afterAll, describe, expect, it, vi } from "vitest";
import { mkdirSync, writeFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
vi.mock("server-only", () => ({}));
import { generateV4ShadowReport } from "../../../src/lib/interpretation-v4/runtimeShadow";
import { v4Digest, validateV4Publication, projectV4Composition, type V4RuntimeEvidence } from "../../../src/lib/interpretation-v4/runtimeProjection";
import { createProductPreviewSnapshot, type ProductPreviewSnapshotDraft } from "../../../src/lib/report-generation/productPreviewSnapshot";
import { storedBook } from "../../../src/lib/book/storedReport";
import { projectBook } from "../../../src/app/dev/book-preview/bookProjection";
import { BookReader } from "../../../src/app/dev/book-preview/BookReader";
import { buildIntegratedMyeongliProfile } from "../../../src/lib/interpretation-v4/foundationIntegratedProfile";
import { renderComprehensiveManuscript } from "../../../src/lib/interpretation-v4/comprehensiveManuscriptRenderer";
import { composeComprehensiveNarrative } from "../../../src/lib/interpretation-v4/comprehensiveComposer";
import { schedulerInputs, schedulerPlan } from "./comprehensiveSchedulerFixtures";
import { NARRATIVE_FIXTURES } from "./narrativeFixtures";
import { SHADOW_CLOCK, singleRuntimeInput } from "./runtimeFixtures";

const root = "/private/tmp/gyeol-13d6b-comprehensive";
const rows: unknown[] = [];
const noop = () => {};
const labels = ["나를 읽는 두 가지 결", "내가 가진 힘과 좋은 패", "사람 사이에서, 사랑 안에서", "일과 돈에 드러나는 나", "나를 지치게 하는 습관", "이런 나를 오래 잘 쓰는 법"];
const payload = (f = NARRATIVE_FIXTURES[0]) => singleRuntimeInput("saju_mbti_full", "saju-mbti-full", f);
const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));
const unsafe = /\b(?:C(?:10|[1-9])|PR\d+|GS?\d+|SU?\d+|M\d+|F\d+|A\d+|P\d+|C0\d+|Fe|Fi|Te|Ti|Ne|Ni|Se|Si)\b|sourceNodeId|SemanticAxis|Claim Level|\[object Object\]|\b(?:undefined|null|NaN)\b/;
function snapshot(e: V4RuntimeEvidence, draft = projectV4Composition(e.composition)) {
  const s = createProductPreviewSnapshot({ reportId: "integration-local", createdAtIso: e.generatedAt, productKey: "saju_mbti_full", productSlug: "saju-mbti-full", draft: draft as unknown as ProductPreviewSnapshotDraft, evidencePacket: e });
  if (!s.ok) return expect.unreachable(JSON.stringify(s));
  return clone(s.value);
}
afterAll(() => {
  if (!process.env.COMPREHENSIVE_INTEGRATION_EXPORT) return;
  mkdirSync(root, { recursive: true });
  writeFileSync(`${root}/integration-summary.json`, JSON.stringify(rows, null, 2));
});

describe("13D-6B actual customer generation to persisted Book", () => {
  it.each(NARRATIVE_FIXTURES)("$id canonical input, selected text, tables, immutable reopen", async f => {
    const input = payload(f), before = clone(input), start = performance.now();
    const generated = await generateV4ShadowReport(input, SHADOW_CLOCK);
    expect(generated, generated.ok ? undefined : JSON.stringify(generated)).toMatchObject({ ok: true, externalCalls: [] });
    if (!generated.ok) return;
    const durationMs = Math.round(performance.now() - start), e = generated.evidencePacket as V4RuntimeEvidence;
    if (e.composition.product !== "saju_mbti_full" || !("integration" in e.composition.result)) return expect.unreachable();
    const result = e.composition.result, original = clone(e), data = projectBook(e)!;
    expect(input).toEqual(before); expect(e).toEqual(original);
    expect(result.writerVersion).toBe("comprehensive-product-13d-6b-v1");
    expect(validateV4Publication("saju_mbti_full", generated.draft, e)).toEqual({ ok: true, errors: [] });
    expect(result.integration.context.rawJobText).toBe(f.context.detailJob);
    const natal = buildIntegratedMyeongliProfile(e.calculations.person);
    if (!natal.ok) return expect.unreachable();
    const profiles = schedulerInputs(natal.value, f.mbti, f.context);
    const plan = schedulerPlan(profiles);
    const manuscript = renderComprehensiveManuscript({ profiles, plan, reportStableKey: result.integration.reportStableKey });
    if (!manuscript.ok) return expect.unreachable();
    for (const unit of result.integration.represented) {
      const id = unit.unit as keyof typeof manuscript.draft.sections;
      expect(unit.primary).toEqual(plan.sections[id].primaryCandidateIds);
      expect(unit.rendered).toEqual(manuscript.draft.sections[id].blocks.flatMap(b => b.sourceUnitIds));
      // The frozen C10 builder selects its own operating rules. Compare that
      // final selection, not unselected preliminary scheduler suggestions.
      if (id === "C10") expect(unit.rendered).toEqual(manuscript.draft.sections.C10.operatingRules!.map(r => r.candidateId));
      else for (const primary of unit.primary) {
        expect(unit.rendered.includes(primary) || manuscript.draft.diagnostics.suppressed.some(s => s.sectionId === id && s.candidateId === primary), primary).toBe(true);
      }
    }
    const chapters = data.pages.filter(p => p.kind === "narrative");
    const texts = chapters.flatMap(p => p.paragraphs.map(b => b.text));
    expect(texts).toEqual(Object.values(manuscript.draft.sections).flatMap(s => s.blocks.map(b => b.plainText)));
    expect(texts.join("\n")).not.toMatch(unsafe);
    expect(data.pages.filter(p => p.kind === "contents").find(p => p.id === "contents")?.entries.map(e => e.title)).toEqual(labels);
    for (const page of data.pages) {
      if (page.kind === "contents") for (const entry of page.entries) {
        expect(data.pages[entry.page].id === entry.targetId || data.pages[entry.page].anchors?.includes(entry.targetId), entry.targetId).toBe(true);
      }
      if (page.kind === "narrative") { expect(page.paragraphs.length).toBeGreaterThan(0); expect(page.paragraphs.every(p => p.text.trim())).toBe(true); }
      const html = renderToStaticMarkup(<BookReader data={data} page={page} onNote={noop} onPage={noop} onShare={noop} />);
      if (page.kind === "narrative") for (const p of page.paragraphs) expect(html).toContain(renderToStaticMarkup(<span>{p.text}</span>).slice(6, -7));
    }
    const saved = snapshot(e);
    expect(storedBook(saved)?.data).toEqual(data);
    expect(storedBook(clone(saved), "http://localhost/r/local-only")?.data).toEqual(data);
    expect(data.pages.filter(p => p.kind === "appendix").flatMap(p => p.items).length).toBeGreaterThan(10);
    expect(data.pages.at(-1)).toMatchObject({ kind: "back", finalLine: result.narrative.finalLine });
    const closing = chapters.find(p => p.id === "chapter-direction")!;
    expect(closing).toBeDefined();
    for (const title of result.integration.represented.find(u => u.unit === "C10")!.headings.filter(Boolean)) {
      expect([closing.title, ...closing.paragraphs.map(p => p.heading)]).toContain(title);
    }
    result.integration.represented.find(u => u.unit === "C10")!.headings.forEach((title, i) => {
      if (title && (i > 0 || title !== closing.title)) expect(closing.paragraphs[i].heading).toBe(title);
    });
    if (!f.mbti) { expect(result.integration.explicitMbtiUsage).toBe(0); expect(texts.join("\n")).not.toMatch(/\b[EI][SN][TF][JP]\b|MBTI를 입력/); }
    const row = { id: f.id, name: f.name, durationMs, pages: data.pages.length, paragraphs: texts.length, appendix: data.pages.filter(p => p.kind === "appendix").flatMap(p => p.items).length, empty: 0, omittedUnits: Object.values(manuscript.draft.sections).filter(s => !s.blocks.length).map(s => s.sectionId), hard: manuscript.draft.validation.hardViolations, digest: v4Digest(data), input };
    rows.push(row);
    if (process.env.COMPREHENSIVE_INTEGRATION_EXPORT) {
      for (const dir of ["customer-packets", "plain-text"]) mkdirSync(`${root}/${dir}`, { recursive: true });
      writeFileSync(`${root}/customer-packets/${f.id}.json`, JSON.stringify({ snapshot: saved, book: data, row }, null, 2));
      writeFileSync(`${root}/plain-text/${f.id}.txt`, [data.names, ...chapters.flatMap(p => [p.title, ...p.paragraphs.flatMap(b => [b.heading ?? "", b.text])]), result.narrative.finalLine].join("\n\n"));
    }
  }, 120000);
  it("same input/key is deterministic and old comprehensive reopen never upgrades", async () => {
    const input = payload(), a = await generateV4ShadowReport(input, SHADOW_CLOCK), b = await generateV4ShadowReport(clone(input), SHADOW_CLOCK);
    if (!a.ok || !b.ok) return expect.unreachable(JSON.stringify([a, b]));
    expect(b).toEqual(a);
    const e = clone(a.evidencePacket) as V4RuntimeEvidence;
    const legacy = composeComprehensiveNarrative({ calculation: e.calculations.person, name: input.person.name, mbti: input.person.mbtiType, context: input.userContext });
    if (!legacy.ok) return expect.unreachable();
    const { contentDigest: _digest, ...body } = { ...e, composition: { product: "saju_mbti_full" as const, result: legacy } };
    void _digest;
    const old = { ...body, contentDigest: v4Digest(body) };
    expect(validateV4Publication("saju_mbti_full", projectV4Composition(old.composition), old).ok).toBe(true);
    const stored = storedBook(snapshot(old))!;
    expect(stored.data.pages.filter(p => p.kind === "narrative").flatMap(p => p.paragraphs.map(b => b.text))).toEqual([...legacy.narrative.opening, ...legacy.narrative.sections.flatMap(s => s.blocks)].map(b => b.text));
    expect(storedBook(clone(snapshot(old)))?.data).toEqual(stored.data);
  }, 120000);
  it.each([undefined, null, "", "직장인"])("canonical context normalization, not new inference: %s", async value => {
    const p = payload();
    Object.assign(p.userContext, { jobStatus: value, detailJob: value, relationshipStatus: value });
    const r = await generateV4ShadowReport(p, SHADOW_CLOCK);
    expect(r).toMatchObject({ ok: true });
    if (r.ok) expect((r.evidencePacket as V4RuntimeEvidence).input).toMatchObject({ userContext: { jobStatus: "", relationshipStatus: "", detailJob: typeof value === "string" ? value : "" } });
  }, 120000);
  it("publishing editor context and approximate time survive the actual boundary", async () => {
    const input = singleRuntimeInput("saju_mbti_full", "saju-mbti-full", { ...NARRATIVE_FIXTURES[4], name: "은서",
      context: { jobStatus: "employee", detailJob: "출판사 편집자", relationshipStatus: "" } }, "MYOSI");
    input.person.birthTime = "";
    const generated = await generateV4ShadowReport(input, SHADOW_CLOCK);
    if (!generated.ok) return expect.unreachable(JSON.stringify(generated));
    const e = generated.evidencePacket as V4RuntimeEvidence, book = projectBook(e)!;
    expect(book.people[0].timeLabel).toBe("대략 · 묘시 05:00~06:59");
    expect(e.input).toMatchObject({ userContext: { detailJob: "출판사 편집자", relationshipStatus: "" } });
    if (e.composition.product !== "saju_mbti_full" || !("integration" in e.composition.result)) return expect.unreachable();
    expect(e.composition.result.integration.context.rawJobText).toBe("출판사 편집자");
    expect(storedBook(snapshot(e))?.data).toEqual(book);
    if (process.env.COMPREHENSIVE_INTEGRATION_EXPORT) {
      writeFileSync(`${root}/customer-packets/13-editor-approximate.json`, JSON.stringify({ snapshot: snapshot(e), book, row: { id: "13-editor-approximate", input } }, null, 2));
      writeFileSync(`${root}/plain-text/13-editor-approximate.txt`, book.pages.filter(p => p.kind === "narrative").flatMap(p => [p.title, ...p.paragraphs.map(b => b.text)]).join("\n\n"));
    }
  }, 120000);
});
