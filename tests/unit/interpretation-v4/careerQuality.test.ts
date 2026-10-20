import { editorialLocks, expectEditorialFoundations } from "./productWideAssertions";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { generateV4ShadowReport } from "../../../src/lib/interpretation-v4/runtimeShadow";
import { validateV4Publication, type V4RuntimeEvidence } from "../../../src/lib/interpretation-v4/runtimeProjection";
import { projectBook } from "../../../src/app/dev/book-preview/bookProjection";
import { storedBook } from "../../../src/lib/book/storedReport";
import { CAREER_RELEASE_VERSION, type CareerReleaseDraft } from "../../../src/lib/interpretation-v4/careerReleaseContracts";
import { buildV4CareerProduct } from "../../../src/lib/interpretation-v4/careerProductAdapter";
import { fixtureInput, NARRATIVE_FIXTURES } from "./narrativeFixtures";
import { CAREER_QUALITY_CASES, CAREER_QUALITY_CLOCK } from "./careerQualityFixtures";
const fixture = (name: string) => JSON.parse(readFileSync(new URL(`../../fixtures/career-quality-01/${name}.json`, import.meta.url), "utf8"));
const hash = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const readers = new Map<string, CareerReleaseDraft>();

describe("career specialist questions, actual occupation and source boundaries", () => {
  it.each(CAREER_QUALITY_CASES)("$id real publication remains complete and deterministic", async ({ id, payload }) => {
    const before = structuredClone(payload), generated = await generateV4ShadowReport(payload, CAREER_QUALITY_CLOCK);
    expect(generated.ok).toBe(true); if (!generated.ok) return;
    const e = generated.evidencePacket as V4RuntimeEvidence;
    if (e.composition.product !== "career_money_study" || !("integration" in e.composition.result)) return expect.unreachable();
    const r = e.composition.result, d = r.integration.readerEdition;
    readers.set(id, d);
    expect(r.integration.publishedEdition).toBe(CAREER_RELEASE_VERSION);
    expect(d.chapters.map(c => c.paragraphs.map(p => p.id))).toEqual(Array.from({ length: 9 }, (_, c) => Array.from({ length: 4 }, (_, p) => `CH0${c + 1}.P${p + 1}`)));
    expect(r.integration.readerValidation.hardErrors).toEqual([]);
    expect(r.integration.readerValidation.qualityIssues.filter(x => x !== "BODY_LENGTH")).toEqual([]);
    if (["A", "B", "C"].includes(id)) { expect(d.bodyLength).toBeGreaterThanOrEqual(8000); expect(d.bodyLength).toBeLessThanOrEqual(10000); }
    expect(hash(e.calculations)).toBe(fixture("engine-locks").find((f: { id: string }) => f.id === id).calculationsSha256);
    expect(hash(r.narrative.recommendations.map(({ id, roleExamples, proof }) => ({ id, roleExamples, proof })))).toBe(fixture("engine-locks").find((f: { id: string }) => f.id === id).recommendationProofsSha256);
    expect(generated.externalCalls).toEqual([]); expect(payload).toEqual(before);
    expect(await generateV4ShadowReport(payload, CAREER_QUALITY_CLOCK)).toEqual(generated);
    expect(validateV4Publication("career_money_study", generated.draft, e)).toEqual({ ok: true, errors: [] });
    const paragraphs = d.chapters.flatMap(c => c.paragraphs), sentences = paragraphs.flatMap(p => p.sentences);
    const text = paragraphs.map(p => p.text).join("\n");
    expect(text).not.toMatch(/\d순위|기운입니다’의 뜻|만들어야 한다|안정된다’|undefined|\[object Object\]/);
    expect(d.chapters[2].paragraphs[1].text).toContain("탐색 후보");
    expect(d.chapters[7].paragraphs[2].text).toMatch(/약점|경계|과하게|과사용/);
    if (id === "A") expect(d.chapters[4].paragraphs[2].text).toContain("새 일을 시작할 때에는 첫 번째 반응을, 생활을 유지할 때에는 두 번째 선호");
    if (id === "B") expect(d.chapters[4].paragraphs[2].text).toContain("유지할 때에는 첫 번째 반응을, 시작할 때에는 두 번째 선호");
    if (id === "A") expect(d.chapters[5].paragraphs[0].text).toContain("편재에서 읽는 기회 감각");
    if (id === "C") expect(d.chapters[5].paragraphs[0].text).toContain("정재에서 읽는 축적의 방향");
    expect(d.chapters[1].paragraphs[3].sentences[0].evidenceIds).toEqual(d.chapters[1].paragraphs[0].sentences[0].evidenceIds);
    const introduced = new Set(d.chapters.slice(0, 8).flatMap(c => c.paragraphs.flatMap(p => p.sentences.flatMap(s => s.evidenceIds))));
    expect(d.chapters[8].paragraphs.flatMap(p => p.sentences).every(s => s.evidenceIds.every(id => introduced.has(id)))).toBe(true);
    expect(new Set(sentences.map(s => s.text)).size).toBe(sentences.length);
    if (!payload.person.mbtiType) expect(sentences.every(s => !s.mbtiSourceNodeIds.length && !s.fusionIds.length)).toBe(true);
    if (!payload.person.birthTime) { expect(e.calculations.person?.pillars).not.toHaveProperty("hour"); expect(sentences.flatMap(s => s.evidenceIds).some(id => /natal:hour:/.test(id))).toBe(false); }
    if (payload.userContext.jobStatus === "") {
      expect(text).not.toMatch(/직장인으로|현재 회사|상사|연봉|매출의 크기|서비스를 만드는 능력/);
      expect(d.chapters[4].paragraphs[0].text).toContain("개발자");
      expect(d.chapters[4].paragraphs[1].text).toMatch(/개발|코드|구현|테스트|기능/);
      expect(d.chapters[5].paragraphs[0].text).toMatch(/[정편]재/);
      expect(d.chapters[5].paragraphs[0].sentences.some(s => s.evidenceIds.some(id => id.startsWith("natal:ten-god:")))).toBe(true);
    }
  }, 120000);
  it("different jobs and charts change the actual scenes, learning and strategy", () => {
    for (const [a, b] of [["A", "B"], ["A", "C"], ["B", "C"]]) {
      for (const index of [1, 4, 5, 6, 7, 8]) expect(readers.get(a)!.chapters[index].paragraphs.map(p => p.text)).not.toEqual(readers.get(b)!.chapters[index].paragraphs.map(p => p.text));
    }
    expect(readers.get("B")!.chapters[4].paragraphs[1].text).toMatch(/디자인|시안|매체|제작/);
    expect(readers.get("C")!.chapters[4].paragraphs[1].text).toMatch(/영업|고객|제안|거래/);
  });
  it("occupation changes scenes without changing semantic profiles or pretending to rank aptitude", () => {
    const base = NARRATIVE_FIXTURES[9];
    const results = ["개발자", "브랜드 디자이너", "영업기획"].map(detailJob => buildV4CareerProduct(fixtureInput({ ...base, context: { ...base.context, jobStatus: "", detailJob } })));
    for (const r of results) expect(r.ok).toBe(true);
    if (results.some(r => !r.ok)) return;
    const valid = results.filter(r => r.ok);
    expect(new Set(valid.map(r => JSON.stringify(r.integration.profileDigests))).size).toBe(1);
    expect(new Set(valid.map(r => r.integration.readerEdition.chapters[0].paragraphs[0].text)).size).toBe(3);
    expect(valid.every(r => r.narrative.recommendations.every(r => !/\d순위/.test(r.reason)))).toBe(true);
  }, 120000);
  it("the previous paid career Book reopens verbatim for owner and shared readers", () => {
    const old = fixture("previous-book"), before = JSON.stringify(old.snapshot);
    expect(storedBook(old.snapshot)?.data).toEqual(old.book);
    expect(storedBook(old.snapshot, "https://example.test/r/previous-career-token")?.data).toEqual(old.book);
    expect(JSON.stringify(old.snapshot)).toBe(before);
  });
  it.each(fixture("other-products") as { id: string; payload: unknown; sha256: string }[])("$id full result matches the reviewed common edition; engine baseline stays fixed", async ({ id, payload }) => {
    const generated = await generateV4ShadowReport(payload, CAREER_QUALITY_CLOCK);
    expect(generated.ok).toBe(true);
    if (generated.ok) expectEditorialFoundations(generated.evidencePacket as V4RuntimeEvidence, payload, CAREER_QUALITY_CLOCK);
    expect(hash({ generated, book: generated.ok ? projectBook(generated.evidencePacket as V4RuntimeEvidence) : null })).toBe(editorialLocks.groups.career[id as keyof typeof editorialLocks.groups.career]);
  }, 120000);
});
