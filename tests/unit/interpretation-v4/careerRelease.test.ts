import { describe, expect, it, vi } from "vitest";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
vi.mock("server-only", () => ({}));
import { generateV4ShadowReport } from "../../../src/lib/interpretation-v4/runtimeShadow";
import { validateV4Publication, v4Digest, type V4RuntimeEvidence } from "../../../src/lib/interpretation-v4/runtimeProjection";
import { CAREER_READER_CHAPTERS, CAREER_RELEASE_VERSION, type CareerReleaseDraft } from "../../../src/lib/interpretation-v4/careerReleaseContracts";
import { compareCareerReaders, validateCareerRelease } from "../../../src/lib/interpretation-v4/careerReleaseValidator";
import { buildV4CareerProduct } from "../../../src/lib/interpretation-v4/careerProductAdapter";
import { composeCareerNarrative } from "../../../src/lib/interpretation-v4/careerComposer";
import { projectBook } from "../../../src/app/dev/book-preview/bookProjection";
import { storedBook } from "../../../src/lib/book/storedReport";
import { createProductPreviewSnapshot, type ProductPreviewSnapshotDraft } from "../../../src/lib/report-generation/productPreviewSnapshot";
import { buildIntegratedMyeongliProfile } from "../../../src/lib/interpretation-v4/foundationIntegratedProfile";
import { selectCareerProductSources } from "../../../src/lib/interpretation-v4/careerProductSelection";
import { schedulerInputs } from "./comprehensiveSchedulerFixtures";
import { NARRATIVE_FIXTURES, fixtureInput } from "./narrativeFixtures";
import { RUNTIME_FIXTURES, SHADOW_CLOCK, singleRuntimeInput } from "./runtimeFixtures";
import releaseLocks from "./careerReleaseLocks.json";
import { CAREER_STUDY_BRIDGES } from "../../../src/lib/interpretation-v4/careerStudy";
import { CAREER_STATUS_COPY, careerStatusCopy } from "../../../src/lib/interpretation-v4/careerReleaseContext";
const A = NARRATIVE_FIXTURES[0];
export const CAREER_RELEASE_FIXTURES = [
  { ...A, id: "A" }, { ...NARRATIVE_FIXTURES[1], id: "B" },
  { ...A, id: "C", mbti: "INFP" }, { ...NARRATIVE_FIXTURES[3], id: "D", context: A.context },
  { ...NARRATIVE_FIXTURES[7], id: "E", context: { ...A.context, jobStatus: "student" as const, detailJob: "컴퓨터공학 전공" } },
  { ...NARRATIVE_FIXTURES[6], id: "F" },
  { ...NARRATIVE_FIXTURES[8], id: "G", context: { ...A.context, jobStatus: "job_seeker" as const, detailJob: "서비스 운영 준비" } },
  { ...NARRATIVE_FIXTURES[11], id: "H", time: undefined },
];
const root = "/tmp/gyeol-career-release";
const readers: { id: string; draft: CareerReleaseDraft }[] = [];
describe("Career editorial reader edition", () => {
  it.each(CAREER_RELEASE_FIXTURES)("$id actual manuscript and saved Book", async f => {
    const payload = singleRuntimeInput("career_money_study", "career-money-study", f), before = structuredClone(payload);
    const generated = await generateV4ShadowReport(payload, SHADOW_CLOCK);
    expect(generated.ok, JSON.stringify(generated.ok ? null : generated.error)).toBe(true); if (!generated.ok) return;
    expect(payload).toEqual(before); expect(generated.externalCalls).toEqual([]);
    const e = generated.evidencePacket as V4RuntimeEvidence;
    if (e.composition.product !== "career_money_study" || !("integration" in e.composition.result)) return expect.unreachable();
    const r = e.composition.result, draft = r.integration.readerEdition, book = projectBook(e)!;
    const snapshot = createProductPreviewSnapshot({ reportId: `career-editorial-${f.id}`, createdAtIso: e.generatedAt, productKey: e.input.productKey, productSlug: e.input.productSlug, draft: generated.draft as unknown as ProductPreviewSnapshotDraft, evidencePacket: e });
    if (process.env.CAREER_EDITORIAL_EXPORT === "1") {
      mkdirSync(root + "/manuscripts", { recursive: true });
      writeFileSync(`${root}/manuscripts/${f.id}.txt`, draft.chapters.map(c => `${c.id} ${c.title}\n\n${c.paragraphs.map(p => `${p.id} ${p.purpose}\n${p.text}`).join("\n\n")}`).join("\n\n"));
      writeFileSync(`${root}/manuscripts/${f.id}.json`, JSON.stringify({ draft, validation: r.integration.readerValidation, publishedEdition: r.integration.publishedEdition, recommendations: r.narrative.recommendations, studyBasis: r.studyBasis, snapshot: snapshot.ok ? snapshot.value : null, book }, null, 2));
    }
    readers.push({ id: f.id, draft });
    expect(r.writerVersion).toBe(CAREER_RELEASE_VERSION);
    expect(r.integration.readerValidation.hardErrors).toEqual([]);
    expect(r.integration.publishedEdition).toBe(CAREER_RELEASE_VERSION);
    expect(draft.chapters.map(c => c.id)).toEqual(CAREER_READER_CHAPTERS.map(c => c.id));
    expect(draft.chapters.flatMap(c => c.paragraphs.map(p => p.text)).join("\n")).not.toMatch(/undefined|\[object Object\]|니다는|니다라는|평가을|통로이|작업가/);
    if (f.mbti && f.time) {
      expect(draft.chapters.every(c => c.paragraphs.length === 4), JSON.stringify(r.integration.readerValidation)).toBe(true);
      expect(draft.bodyLength).toBeGreaterThanOrEqual(8000); expect(draft.bodyLength).toBeLessThanOrEqual(10000);
      expect(r.integration.readerValidation.qualityIssues).toEqual([]);
    }
    const legacy = composeCareerNarrative(fixtureInput(f)); expect(legacy.ok).toBe(true);
    if (legacy.ok) {
      expect(r.narrative.recommendations.map(r => [r.id, r.roleExamples])).toEqual(legacy.narrative.recommendations.map(r => [r.id, r.roleExamples]));
      expect(r.narrative.avoidEnvironments).toEqual(legacy.narrative.avoidEnvironments);
    }
    expect(validateV4Publication("career_money_study", generated.draft, e)).toEqual({ ok: true, errors: [] });
    expect(snapshot.ok).toBe(true);
    if (snapshot.ok) {
      const saved = JSON.parse(JSON.stringify(snapshot.value));
      expect(storedBook(saved)?.data).toEqual(book); expect(storedBook(saved, "https://example.test/r/career-synthetic")?.data).toEqual(book);
    }
    const contents = book.pages.find(p => p.id === "contents");
    expect(contents?.kind === "contents" && contents.entries.map(e => e.title)).toEqual(CAREER_READER_CHAPTERS.filter(c => draft.chapters.find(d => d.id === c.id)?.paragraphs.length).map(c => c.title));
    for (const page of book.pages) if (page.kind === "contents") for (const entry of page.entries) expect(book.pages[entry.page].id === entry.targetId || book.pages[entry.page].anchors?.includes(entry.targetId)).toBe(true);
    if (!f.mbti) expect(draft.chapters.flatMap(c => c.paragraphs.flatMap(p => p.sentences)).every(s => !s.mbtiSourceNodeIds.length && !s.fusionIds.length)).toBe(true);
  }, 120000);
  it("records cross-reader common copy", () => {
    if (readers.length < 4) return;
    const comparisons = compareCareerReaders(readers.slice(0, 4));
    if (process.env.CAREER_EDITORIAL_EXPORT === "1") writeFileSync(root + "/cross-reader.json", JSON.stringify(comparisons, null, 2));
    for (const b of ["B", "C", "D"]) expect(comparisons.find(c => c.left === "A" && c.right === b)?.chapters[0].firstSentenceEqual).toBe(false);
  });
  it.each(Object.keys(CAREER_STUDY_BRIDGES))("%s retains its actual study source in the new edition", mbti => {
    const r = buildV4CareerProduct(fixtureInput({ ...A, mbti })); if (!r.ok) return expect.unreachable(JSON.stringify(r));
    const d = r.integration.readerEdition, study = d.chapters.find(c => c.id === "CH07")!;
    if (process.env.CAREER_EDITORIAL_EXPORT === "1") {
      mkdirSync(root + "/study-types", { recursive: true });
      writeFileSync(`${root}/study-types/${mbti}.json`, JSON.stringify({ length: d.bodyLength, counts: d.chapters.map(c => c.paragraphs.length), study, validation: r.integration.readerValidation }, null, 2));
    }
    expect(r.integration.readerValidation.hardErrors).toEqual([]);
    expect(study.paragraphs).toHaveLength(4);
    expect(d.chapters.every(c => c.paragraphs.length === 4), JSON.stringify(r.integration.readerValidation)).toBe(true);
    expect(d.bodyLength).toBeGreaterThanOrEqual(8000); expect(d.bodyLength).toBeLessThanOrEqual(10000);
    expect(r.integration.readerValidation.qualityIssues).toEqual([]);
    expect(study.paragraphs[0].sentences.some(s => s.provenance.sourceRefs.includes(`mbti:${mbti}:traits:study:${CAREER_STUDY_BRIDGES[mbti].trait}`))).toBe(true);
    expect(study.paragraphs[2].sentences[0].provenance.sourceRefs).toContain(`mbti:${mbti}:traits:study:${CAREER_STUDY_BRIDGES[mbti].trait}:risk`);
  }, 120000);
  it.each(Object.keys(CAREER_STATUS_COPY) as (keyof typeof CAREER_STATUS_COPY)[])("exact input status %s has its own current/next contract", jobStatus => {
    const input = fixtureInput({ ...A, context: { ...A.context, jobStatus } });
    expect(careerStatusCopy(input)).toBe(CAREER_STATUS_COPY[jobStatus]);
    expect(careerStatusCopy(input)).toHaveLength(4);
    if (jobStatus !== "employee") expect(careerStatusCopy(input).join(" ")).not.toMatch(/승진|상사|부하 직원|현재 회사/);
  });
  it("unknown roots, reversed signs and fabricated recommendations are rejected without a paid gate", () => {
    const input = fixtureInput(A), m = buildIntegratedMyeongliProfile(input.calculation); if (!m.ok) return expect.unreachable();
    const p = schedulerInputs(m.value, A.mbti, A.context), candidates = selectCareerProductSources(p).candidates;
    const r = buildV4CareerProduct(input); if (!r.ok) return expect.unreachable();
    const broken = structuredClone(r.integration.readerEdition); broken.chapters[0].paragraphs[0].sentences[0].evidenceIds = ["invented-root"];
    expect(validateCareerRelease(broken, p, candidates, r.narrative).hardErrors).toContain("CH01.P1:UNKNOWN_MYEONGLI_PROOF");
    const reversed = structuredClone(r.integration.readerEdition), s = reversed.chapters[0].paragraphs[0].sentences[0];
    s.provenance.direction = s.provenance.direction === 1 ? -1 : 1;
    expect(validateCareerRelease(reversed, p, candidates, r.narrative).hardErrors).toContain("CH01.P1:UNSUPPORTED_SIGNED_AXIS");
    const inventedRoute = structuredClone(r.integration.readerEdition);
    inventedRoute.chapters[2].paragraphs[1].sentences[0].sourceCandidateId = "career-route:invented";
    expect(validateCareerRelease(inventedRoute, p, candidates, r.narrative).hardErrors).toContain("CH03.P2:UNKNOWN_RECOMMENDATION");
  }, 120000);
  it.each(RUNTIME_FIXTURES)("$id previous saved edition remains identical", async f => {
    if (f.id === "career") {
      const old = JSON.parse(readFileSync("tests/fixtures/completed-report/career-editorial-base.json", "utf8"));
      expect(storedBook(old.snapshot)?.data).toEqual(old.book);
      expect(storedBook(structuredClone(old.snapshot), "https://example.test/r/old-career")?.data).toEqual(old.book);
    }
    if (f.id !== "career") {
      const generated = await generateV4ShadowReport(f.payload, SHADOW_CLOCK); if (!generated.ok) return expect.unreachable();
      expect([v4Digest(generated.draft), v4Digest(generated.evidencePacket), v4Digest(projectBook(generated.evidencePacket as V4RuntimeEvidence))]).toEqual(releaseLocks[f.id as keyof typeof releaseLocks]);
    }
  }, 120000);
});
