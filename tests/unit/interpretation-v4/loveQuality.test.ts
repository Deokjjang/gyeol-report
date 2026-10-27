import { editorialLocks, expectEditorialFoundations } from "./productWideAssertions";
import { beforeAll, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { readFileSync } from "node:fs";
import { generateV4ShadowReport } from "../../../src/lib/interpretation-v4/runtimeShadow";
import { validateV4Publication, v4Digest, type V4RuntimeEvidence } from "../../../src/lib/interpretation-v4/runtimeProjection";
import { projectBook } from "../../../src/app/dev/book-preview/bookProjection";
import { createProductPreviewSnapshot, type ProductPreviewSnapshotDraft } from "../../../src/lib/report-generation/productPreviewSnapshot";
import { storedBook } from "../../../src/lib/book/storedReport";
import { buildRelationshipProfiles, projectRelationshipView } from "../../../src/lib/interpretation-v4/relationshipProductView";
import * as loveSources from "../../../src/lib/interpretation-v4/loveReleaseSources";
import { renderLoveRelease } from "../../../src/lib/interpretation-v4/loveReleaseRenderer";
import { LOVE_RELEASE_VERSION } from "../../../src/lib/interpretation-v4/loveReleaseContracts";
import fixtures from "./loveQualityFixtures.json";
import locks from "./loveQualityLocks.json";
import { expectLock } from "../../helpers/v5LmtLocks";

const clock = { evaluatedAt: "2026-10-12T12:00:00+09:00" };
type Generated = Extract<Awaited<ReturnType<typeof generateV4ShadowReport>>, { ok: true }>;
const runs = new Map<string, Generated>();
describe("Love quality edition: actual paid generator without external calls", () => {
  beforeAll(async () => {
    for (const f of fixtures) {
      const r = await generateV4ShadowReport(f.payload, clock);
      expect(r.ok).toBe(true);
      if (r.ok) runs.set(f.id, r);
    }
  }, 120000);
  it.each(fixtures)("$id keeps structure, factual sources, tables and saved reading", f => {
    const r = runs.get(f.id)!, e = r.evidencePacket as V4RuntimeEvidence;
    if (e.composition.product !== "love_marriage_child" || !("integration" in e.composition.result)) return expect.unreachable();
    const result = e.composition.result, d = result.integration.readerEdition;
    expect(result.integration.publishedEdition).toBe(LOVE_RELEASE_VERSION);
    expect(result.integration.readerValidation).toEqual({ hardErrors: [], qualityIssues: [] });
    expect(d.chapters.map(c => c.paragraphs.length)).toEqual(Array(9).fill(4));
    expect(d.bodyLength).toBeGreaterThanOrEqual(8000); expect(d.bodyLength).toBeLessThanOrEqual(10000);
    const baseline = locks[f.id as "A" | "B" | "C" | "D" | "E" | "F"];
    expectLock(v4Digest(e.calculations), baseline.calculations);
    expectLock(v4Digest(e.mbtiTables), baseline.mbtiTables);
    expectLock(v4Digest(e.natalTableEvidence), baseline.natalTableEvidence);
    expectLock(result.integration.personalDigest, baseline.personalDigest);
    expect(r.externalCalls).toEqual([]);
    const sentences = d.chapters.flatMap(c => c.paragraphs.flatMap(p => p.sentences));
    const text = sentences.map(s => s.text).join("\n");
    expect(text).not.toMatch(/양육 자료|관계 자료|MBTI 관계 근거|실제 연애 자료|sourceCandidateId|notablePairs|DB|모름이라|확인하지 못했다면|성질[’']의 성질/);
    expect(text).not.toMatch(/정확한 말이면 상처도 정당|목의 가지|수의 여유를 사람 이미지|함께 사는 현재 생활에서는.*솔로/);
    expect(text).not.toMatch(/당신의 아이는|자녀가 있|이미 겪었|애착 유형|외도를 했|반드시 결혼/);
    expect(new Set(sentences.map(s => s.text)).size).toBe(sentences.length);
    expect(sentences.some(s => s.provenance.materialId.includes("symbolic-balance"))).toBe(false);
    if (!f.payload.person.mbtiType) expect(sentences.flatMap(s => s.mbtiSourceNodeIds)).toEqual([]);
    if (f.payload.person.birthTimeUnknown) expect(sentences.flatMap(s => s.evidenceIds).join()).not.toMatch(/hour/);
    const book = projectBook(e);
    expect(book?.pages.flatMap(p => p.kind === "narrative" ? p.paragraphs.map(p => p.text) : [])).toEqual(d.chapters.flatMap(c => c.paragraphs.map(p => p.text)));
    expect(validateV4Publication("love_marriage_child", r.draft, e)).toEqual({ ok: true, errors: [] });
    const snapshot = createProductPreviewSnapshot({ reportId: `love-quality-${f.id}`, createdAtIso: clock.evaluatedAt,
      productKey: e.input.productKey, productSlug: e.input.productSlug, draft: r.draft as ProductPreviewSnapshotDraft, evidencePacket: e });
    expect(snapshot.ok).toBe(true);
    if (snapshot.ok) {
      const saved = JSON.parse(JSON.stringify(snapshot.value));
      expect(storedBook(saved)?.data).toEqual(book);
      expect(storedBook(saved, "https://example.test/r/love-quality")?.data).toEqual(book);
    }
    const built = buildRelationshipProfiles({ calculation: e.calculations.person, name: f.payload.person.name,
      mbti: f.payload.person.mbtiType, context: e.input.kind !== "compatibility" ? e.input.userContext : expect.unreachable() });
    expect(built.ok).toBe(true); if (!built.ok) return;
    const profiles = built.profiles;
    for (const s of sentences) for (const id of s.fusionIds) {
      // Retained fortune assets preserve a union of the original block's
      // sources. Its IDs are not a Cartesian claim about every node/Fusion.
      // The strict two-sided check below covers newly realized Fusion lines.
      if (s.provenance.materialId.startsWith("asset:")) continue;
      const fusion = [...profiles.fusion.reinforce, ...profiles.fusion.complements, ...profiles.fusion.tensions].find(x => x.id === id);
      expect(fusion).toBeDefined(); if (!fusion) continue;
      for (const nodeId of s.mbtiSourceNodeIds) {
        expect(fusion.mbti.sourceNodeIds).toContain(nodeId);
        expect(profiles.mbti.annotations.some(a => a.sourceNodeId === nodeId && a.annotationConfidence !== "REFERENCE_ONLY"
          && (a.axes[fusion.mbti.side.axis] ?? 0) * fusion.mbti.side.direction > 0)).toBe(true);
      }
      for (const root of s.evidenceIds) expect(profiles.myeongli.evidence.some(a => a.id === root
        && fusion.myeongli.evidenceIds.includes(root) && (a.axes[fusion.myeongli.side.axis] ?? 0) * fusion.myeongli.side.direction > 0)).toBe(true);
    }
  }, 120000);
  it("uses different current-relationship questions for single, dating and married readers", () => {
    const current = (id: string) => {
      const e = runs.get(id)!.evidencePacket as V4RuntimeEvidence;
      if (e.composition.product !== "love_marriage_child" || !("integration" in e.composition.result)) return expect.unreachable();
      return e.composition.result.integration.readerEdition.chapters[3];
    };
    expect(current("A").paragraphs[0].text).toContain("지금 솔로");
    expect(current("B").paragraphs[0].text).toContain("연애 중인 지금");
    expect(current("C").paragraphs[0].text).toContain("기혼인 지금");
    expect(current("C").paragraphs.map(p => p.purpose + p.text).join()).not.toMatch(/썸|첫 만남|현재 솔로|새로운 관계를 시작/);
  });
  it.each(["A", "F"])("%s remains deterministic including full Book and evidence", async id => {
    const f = fixtures.find(f => f.id === id)!;
    const again = await generateV4ShadowReport(f.payload, clock), first = runs.get(id)!;
    expect(again).toEqual(first);
  }, 120000);
  it("reopens the saved previous love edition without invoking this renderer", () => {
    const old = JSON.parse(readFileSync("tests/fixtures/completed-report/love-editorial-base.json", "utf8"));
    expect(storedBook(old.snapshot)?.data).toEqual(old.book);
    expect(storedBook(old.snapshot, "https://example.test/r/old-love")?.data).toEqual(old.book);
  });
  it("does not attach a Fusion node merely because it belongs to a related relationship domain", () => {
    const e = runs.get("A")!.evidencePacket as V4RuntimeEvidence;
    if (e.composition.product !== "love_marriage_child" || !("integration" in e.composition.result) || e.input.kind === "compatibility") return expect.unreachable();
    const input = { calculation: e.calculations.person, name: e.input.person.name, mbti: e.input.person.mbtiType, context: e.input.userContext };
    const built = buildRelationshipProfiles(input); if (!built.ok) return expect.unreachable();
    const view = projectRelationshipView(built.profiles), nodeId = "mbti:INFP:traits:relationships:boundary_against_cruelty:plainKo";
    view.profiles.mbti.annotations = view.profiles.mbti.annotations.filter(a => a.sourceNodeId !== nodeId);
    const rendered = renderLoveRelease(input, view, e.composition.result.narrative, e.composition.result.materials);
    expect(rendered.draft.chapters.flatMap(c => c.paragraphs.flatMap(p => p.sentences)).filter(s => s.fusionIds.length)
      .flatMap(s => s.mbtiSourceNodeIds)).not.toContain(nodeId);
  });
  it.each(["01-comprehensive", "02-career", "04-compatibility", "05-major-fortune", "06-annual-fortune"] as const)("%s keeps engine baseline and reviewed common narrative/Book", async id => {
    const baseline = locks[id], r = await generateV4ShadowReport(baseline.input, clock);
    expect(r.ok).toBe(true); if (!r.ok) return;
    expectEditorialFoundations(r.evidencePacket as V4RuntimeEvidence, baseline.input, clock);
    expectLock([v4Digest(r.draft), v4Digest(r.evidencePacket), v4Digest(projectBook(r.evidencePacket as V4RuntimeEvidence))],editorialLocks.groups.love[id], undefined, `love:${id}`);
  }, 120000);
});


describe("Final assembly retains Love questions when novelty slots are exhausted", () => {
  const payload = { ...fixtures[0].payload,
    person: { ...fixtures[0].payload.person, name: "이소율", birthDate: "1990-02-08", birthTime: "16:10", gender: "FEMALE", mbtiType: "ESFP" },
    userContext: { ...fixtures[0].payload.userContext, jobStatus: "employee", detailJob: "문화행사 기획자", relationshipStatus: "dating" },
  };
  it("keeps all 36 existing question texts with actual eligible evidence", async () => {
    const generated = await generateV4ShadowReport(payload, clock);
    if (!generated.ok) return expect.unreachable(JSON.stringify(generated));
    const e = generated.evidencePacket as V4RuntimeEvidence;
    if (e.composition.product !== "love_marriage_child" || !("integration" in e.composition.result) || e.input.kind === "compatibility") return expect.unreachable();
    const result = e.composition.result, edition = result.integration.readerEdition;
    expect(result.integration.readerValidation).toEqual({ hardErrors: [], qualityIssues: [] });
    expect(edition.chapters.map(c => c.paragraphs.length)).toEqual(Array(9).fill(4));
    expect(edition.chapters[3].paragraphs.map(p => p.id)).toContain("CH04.P3");
    expect(edition.chapters[7].paragraphs.map(p => p.id)).toEqual(["CH08.P1", "CH08.P2", "CH08.P3", "CH08.P4"]);
    const built = buildRelationshipProfiles({ calculation: e.calculations.person, name: e.input.person.name, mbti: e.input.person.mbtiType, context: e.input.userContext });
    if (!built.ok) return expect.unreachable();
    const atoms = new Set(built.profiles.myeongli.evidence.map(a => a.id));
    const sentences = edition.chapters.flatMap(c => c.paragraphs.flatMap(p => p.sentences));
    expect(sentences.flatMap(s => s.evidenceIds).every(id => atoms.has(id))).toBe(true);
    expect(new Set(sentences.map(s => s.text)).size).toBe(sentences.length);
    const book = projectBook(e);
    expect(book?.pages.flatMap(p => p.kind === "narrative" ? p.paragraphs.map(p => p.text) : []))
      .toEqual(edition.chapters.flatMap(c => c.paragraphs.map(p => p.text)));
    expect(validateV4Publication("love_marriage_child", generated.draft, e)).toEqual({ ok: true, errors: [] });
  }, 120000);
  it("does not manufacture source-based paragraphs when no eligible source exists", () => {
    const e = runs.get("A")!.evidencePacket as V4RuntimeEvidence;
    if (e.composition.product !== "love_marriage_child" || e.input.kind === "compatibility") return expect.unreachable();
    const input = { calculation: e.calculations.person, name: e.input.person.name, mbti: e.input.person.mbtiType, context: e.input.userContext };
    const built = buildRelationshipProfiles(input); if (!built.ok) return expect.unreachable();
    const spy = vi.spyOn(loveSources, "loveReleaseSources").mockReturnValue([]);
    try {
      const release = renderLoveRelease(input, projectRelationshipView(built.profiles), e.composition.result.narrative, e.composition.result.materials);
      expect(release.draft.shortages.length).toBeGreaterThan(0);
      // Independently supported Fusion can remain. The empty source pool
      // must not manufacture the identity question's source-based paragraph.
      expect(release.draft.chapters[0].paragraphs.map(p => p.id)).not.toContain("CH01.P1");
      expect(release.draft.shortages).toContain("CH01.P1:NO_INDEPENDENT_IDENTITY_MATERIAL");
    } finally { spy.mockRestore(); }
  });
});
