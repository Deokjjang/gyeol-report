import { afterAll, describe, expect, it, vi } from "vitest";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
vi.mock("server-only", () => ({}));
import { generateV4ShadowReport } from "../../../src/lib/interpretation-v4/runtimeShadow";
import { v4Digest, validateV4Publication, projectV4Composition, type V4RuntimeEvidence } from "../../../src/lib/interpretation-v4/runtimeProjection";
import { buildV4CareerProduct } from "../../../src/lib/interpretation-v4/careerProductAdapter";
import { composeCareerNarrative } from "../../../src/lib/interpretation-v4/careerComposer";
import { buildMbtiSemanticProfile, projectMbtiSemanticProfile } from "../../../src/lib/interpretation-v4/mbtiSemanticProfile";
import { createProductPreviewSnapshot, type ProductPreviewSnapshotDraft } from "../../../src/lib/report-generation/productPreviewSnapshot";
import { storedBook } from "../../../src/lib/book/storedReport";
import { projectBook } from "../../../src/app/dev/book-preview/bookProjection";
import { BookReader } from "../../../src/app/dev/book-preview/BookReader";
import { NARRATIVE_FIXTURES, fixtureInput } from "./narrativeFixtures";
import { CAREER_FIXTURES } from "./careerFixtures";
import { RUNTIME_FIXTURES, SHADOW_CLOCK, singleRuntimeInput } from "./runtimeFixtures";

const root = "/private/tmp/gyeol-13d7a-career", rows: unknown[] = [];
const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));
const no = () => {};
const fixtures = [
  { ...NARRATIVE_FIXTURES[0], id: "editor", context: { ...NARRATIVE_FIXTURES[0].context, detailJob: "출판사 편집자" } },
  { ...NARRATIVE_FIXTURES[0], id: "developer", context: { ...NARRATIVE_FIXTURES[0].context, detailJob: "소프트웨어 개발자" } },
  ...CAREER_FIXTURES,
  { ...NARRATIVE_FIXTURES[2], id: "unknown-time" },
  { ...NARRATIVE_FIXTURES[11], id: "unknown-context", context: { jobStatus: "" as const, detailJob: "", relationshipStatus: "" as const } },
];
function snapshot(e: V4RuntimeEvidence) {
  const s = createProductPreviewSnapshot({ reportId: "career-integration-local", createdAtIso: e.generatedAt, productKey: "career_money_study", productSlug: "career-money-study",
    draft: projectV4Composition(e.composition) as unknown as ProductPreviewSnapshotDraft, evidencePacket: e });
  if (!s.ok) return expect.unreachable(JSON.stringify(s)); return clone(s.value);
}
afterAll(() => {
  if (!process.env.CAREER_INTEGRATION_EXPORT) return;
  mkdirSync(root, { recursive: true }); writeFileSync(`${root}/integration-summary.json`, JSON.stringify(rows, null, 2));
});
describe("13D-7A Career actual generation and frozen Book", () => {
  it.each(fixtures)("$id: actual customer entry, complete Book and immutable reopen", async f => {
    const input = singleRuntimeInput("career_money_study", "career-money-study", f), original = clone(input), start = performance.now();
    const result = await generateV4ShadowReport(input, SHADOW_CLOCK);
    if (!result.ok) {
      const direct = buildV4CareerProduct(fixtureInput(f));
      return expect.unreachable(JSON.stringify({ result, direct }));
    }
    expect(result.externalCalls).toEqual([]); expect(input).toEqual(original);
    const e = result.evidencePacket as V4RuntimeEvidence;
    if (e.composition.product !== "career_money_study" || !("integration" in e.composition.result)) return expect.unreachable();
    const r = e.composition.result, data = projectBook(e)!;
    expect(r.writerVersion).toBe("career-product-13d-7a-v1");
    expect(validateV4Publication("career_money_study", result.draft, e)).toEqual({ ok: true, errors: [] });
    const text = [...r.narrative.opening, ...r.narrative.sections.flatMap(s => s.blocks)].map(b => b.text).join("\n");
    expect(text).not.toMatch(/SemanticAxis|sourceNodeId|confidence|\bK(?:10|[1-9])\b|PR\d+|guidance:|fusion:|editorial:|궁합 점수|배우자 예측|사업하면 성공|무조건 승진|CEO가 됩니다|큰돈을 법니다/);
    if (f.context.jobStatus !== "employee") expect(text).not.toMatch(/승진|상사|부하 직원|현재 회사/);
    expect(r.narrative.sections.map(s => s.id)).toEqual(expect.arrayContaining(["current", "money", "roles", "study", "direction"]));
    const legacy = composeCareerNarrative(fixtureInput(f));
    if (!legacy.ok) return expect.unreachable();
    expect(r.narrative.recommendations.map(r => [r.id, r.roleExamples])).toEqual(legacy.narrative.recommendations.map(r => [r.id, r.roleExamples]));
    expect(r.narrative.avoidEnvironments).toEqual(legacy.narrative.avoidEnvironments);
    for (const rec of r.integration.recommendationGrounding) expect(rec.sourceIds.length).toBeGreaterThan(0);
    expect(r.integration.represented.flatMap(r => r.mbtiDomains)).not.toContain("STUDY");
    for (const domain of ["LOVE", "MARRIAGE", "PARENTING", "INVESTMENT"]) expect(r.integration.represented.flatMap(r => r.mbtiDomains)).not.toContain(domain);
    for (const fortune of r.integration.fortuneClaims) {
      expect(fortune.id).toMatch(/^(M08|S08|S03|S04|P01)/);
      expect(fortune.level).toBeGreaterThanOrEqual(2);
      expect(fortune.proof.sourceRefs.length).toBeGreaterThan(0);
    }
    if (!f.context.jobStatus) expect(text).not.toMatch(/수입이 잠시 쉬는|지금은 쉬|현재 회사|승진/);
    if (!f.mbti) { expect(r.integration.explicitMbtiUsage).toBe(0); expect(text).not.toMatch(/\b[EI][SN][TF][JP]\b/); }
    const chapters = data.pages.filter(p => p.kind === "narrative");
    expect(chapters.find(p => p.id === "chapter-direction")?.paragraphs.map(p => p.heading)).toEqual(r.integration.ruleHeadings);
    expect(chapters.flatMap(p => p.paragraphs.map(b => b.text))).toEqual([...r.narrative.opening, ...r.narrative.sections.flatMap(s => s.blocks)].map(b => b.text));
    for (const page of data.pages) {
      const html = renderToStaticMarkup(<BookReader data={data} page={page} onNote={no} onPage={no} onShare={no} />);
      if (page.kind === "narrative") { expect(page.paragraphs.length).toBeGreaterThan(0); for (const p of page.paragraphs) expect(html).toContain(renderToStaticMarkup(<span>{p.text}</span>).slice(6, -7)); }
      if (page.kind === "contents") for (const entry of page.entries) expect(data.pages[entry.page].id === entry.targetId || data.pages[entry.page].anchors?.includes(entry.targetId)).toBe(true);
    }
    expect(data.pages.at(-1)).toMatchObject({ kind: "back", finalLine: r.narrative.finalLine });
    const saved = snapshot(e);
    expect(storedBook(saved)?.data).toEqual(data);
    expect(storedBook(clone(saved), "https://gyeolreport.com/r/abcdefghijklmnopqrstuvwx")?.data).toEqual(data);
    const row = { id: f.id, name: f.name, durationMs: Math.round(performance.now() - start), pages: data.pages.length,
      appendix: data.pages.filter(p => p.kind === "appendix").flatMap(p => p.items).length, units: r.narrative.sections.map(s => s.id),
      represented: r.integration.represented.map(r => ({ ...r, text: undefined })), suppressed: r.integration.suppressed,
      explicit: r.integration.explicitMbtiUsage, recommendations: r.integration.recommendationGrounding, profileDigests: r.integration.profileDigests, input };
    rows.push(row);
    if (process.env.CAREER_INTEGRATION_EXPORT) {
      for (const dir of ["customer-packets", "plain-text"]) mkdirSync(`${root}/${dir}`, { recursive: true });
      writeFileSync(`${root}/customer-packets/${f.id}.json`, JSON.stringify({ snapshot: saved, book: data, row }, null, 2));
      writeFileSync(`${root}/plain-text/${f.id}.txt`, [f.name, ...chapters.flatMap(p => [p.title, ...p.paragraphs.map(b => b.text)]), r.narrative.finalLine].join("\n\n"));
    }
  }, 120000);
  it("same person/context does not reverse-infer personality; same input deterministic", () => {
    const a = buildV4CareerProduct(fixtureInput(fixtures[0])), b = buildV4CareerProduct(fixtureInput(fixtures[1]));
    if (!a.ok || !b.ok) return expect.unreachable(JSON.stringify([a, b]));
    expect(a.integration.profileDigests).toEqual(b.integration.profileDigests);
    expect(a.integration.context.workModes).not.toEqual(b.integration.context.workModes);
    expect(a.narrative.sections.find(s => s.id === "current")).not.toEqual(b.narrative.sections.find(s => s.id === "current"));
    expect(buildV4CareerProduct(fixtureInput(fixtures[0]))).toEqual(a);
  }, 120000);
  it("recommendations/avoid references cannot change semantic personality", () => {
    const raw = JSON.parse(readFileSync("docs/product/mbti/source/ENTJ.json", "utf8").replace(/^\uFEFF/, ""));
    const a = buildMbtiSemanticProfile("ENTJ");
    delete raw.recommendedJobs; delete raw.avoidJobsOrEnvironments;
    const b = projectMbtiSemanticProfile("ENTJ", raw);
    if (!a.ok || !b.ok) return expect.unreachable();
    expect(a.value.generalAxes).toEqual(b.value.generalAxes); expect(a.value.contextAxes).toEqual(b.value.contextAxes);
  });
  it.each(["회계사", "법무 담당 변호사", "환자 진료 의사", "안전 설계 엔지니어", "회화 작가"])("%s retains safe guidance and cannot turn craft into MVP", detailJob => {
    const r = buildV4CareerProduct(fixtureInput({ ...fixtures[0], context: { ...fixtures[0].context, detailJob } }));
    if (!r.ok) return expect.unreachable(JSON.stringify(r));
    const manual = r.narrative.sections.find(s => s.id === "direction")!.blocks.map(b => b.text).join(" ");
    expect(manual).not.toMatch(/MVP|작은 버전을 먼저 내놓|일단 출시|검토를 생략/);
    expect(r.integration.ruleHeadings).not.toContain("안전한 일은 작게 먼저 보여주세요");
  }, 120000);
  it("approximate birth time follows canonical generation without invented exact time", async () => {
    const p = singleRuntimeInput("career_money_study", "career-money-study", fixtures[0], "MYOSI");
    p.person.birthTime = "";
    const r = await generateV4ShadowReport(p, SHADOW_CLOCK);
    if (!r.ok) return expect.unreachable(JSON.stringify(r));
    const e = r.evidencePacket as V4RuntimeEvidence;
    expect(JSON.stringify(e.input)).toContain("approximate");
    expect(projectBook(e)).not.toBeNull();
  }, 120000);
  it("only the Career product boundary changes; no Comprehensive scheduler or business IO", () => {
    for (const name of ["careerProductAdapter", "careerProductSelection", "careerProductNarrative"]) {
      const source = readFileSync(`src/lib/interpretation-v4/${name}.ts`, "utf8");
      expect(source).not.toMatch(/from ["'][^"']*(?:comprehensiveScheduler|comprehensiveManuscriptRenderer|comprehensiveComposer|supabase|openai|payment|tickets|coupons)["']|fetch\(|Math\.random|process\.env/);
    }
  });
  it("legacy Career snapshot keeps original content and Book", async () => {
    const p = RUNTIME_FIXTURES[1].payload, generated = await generateV4ShadowReport(p, SHADOW_CLOCK);
    if (!generated.ok) return expect.unreachable();
    const e = generated.evidencePacket as V4RuntimeEvidence;
    const old = composeCareerNarrative({ ...fixtureInput(NARRATIVE_FIXTURES[9]), calculation: e.calculations.person });
    if (!old.ok) return expect.unreachable();
    const { contentDigest: _, ...body } = { ...e, composition: { product: "career_money_study" as const, result: old } }; void _;
    const sealed = { ...body, contentDigest: v4Digest(body) };
    expect(v4Digest(projectV4Composition(sealed.composition))).toBe("da397c9052a3cd3bd8af9941ebe9783eff0c8732bd7abf77a36280b99e72fb99");
    expect(v4Digest(storedBook(snapshot(sealed))!.data)).toBe("648361de2423428cb2524fad6929d89c552355684d9a0b6333662e85fdf13e30");
  }, 120000);
});
