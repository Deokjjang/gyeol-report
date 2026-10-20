import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { generateV4ShadowReport } from "../../../src/lib/interpretation-v4/runtimeShadow";
import { projectBook } from "../../../src/app/dev/book-preview/bookProjection";
import { validateV4Publication, type V4RuntimeEvidence } from "../../../src/lib/interpretation-v4/runtimeProjection";
import { RUNTIME_FIXTURES, SHADOW_CLOCK, singleRuntimeInput } from "./runtimeFixtures";
import { NARRATIVE_FIXTURES } from "./narrativeFixtures";
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
  it("a photographer receives a full career book with distinct production, value and learning scenes", async () => {
    const payload = singleRuntimeInput("career_money_study", "career-money-study", NARRATIVE_FIXTURES[9]);
    Object.assign(payload.person, { name: "검수 사진가", birthDate: "1987-09-14", birthTime: "17:40", mbtiType: "ISFJ" });
    Object.assign(payload.userContext, { jobStatus: "freelancer", detailJob: "프리랜서 사진작가" });
    const g = await generateV4ShadowReport(payload, SHADOW_CLOCK);
    expect(g.ok).toBe(true); if (!g.ok) return;
    const e = g.evidencePacket as V4RuntimeEvidence;
    expect(validateV4Publication("career_money_study", g.draft, e).ok).toBe(true);
    const book = projectBook(e)!;
    const paragraphs = book.pages.flatMap(p => p.kind === "narrative" ? p.paragraphs : []);
    expect(paragraphs).toHaveLength(36);
    const text = paragraphs.map(p => p.text).join("\n");
    for (const word of ["촬영", "후보정", "납품", "수정 범위", "인접 확장", "새 직업·역할"]) expect(text).toContain(word);
    expect(paragraphs.filter(p => /촬영|사진|후보정/.test(p.text)).length).toBeGreaterThanOrEqual(12);
    expect(text).not.toMatch(/당신은 촬영을 해왔|현재 회사|부하 직원|무조건 성공/);
    expect(g.externalCalls).toEqual([]);
  }, 120000);

  it("dating love keeps the whole book and separates first charm, private joy and recovery", async () => {
    const payload = singleRuntimeInput("love_marriage_child", "love-marriage-child", NARRATIVE_FIXTURES[0]);
    Object.assign(payload.person, { name: "검수 연애인", birthDate: "1998-07-21", birthTime: "22:15", mbtiType: "ESFP" });
    Object.assign(payload.userContext, { jobStatus: "employee", detailJob: "문화행사 기획자", relationshipStatus: "dating" });
    const g = await generateV4ShadowReport(payload, SHADOW_CLOCK);
    expect(g.ok).toBe(true); if (!g.ok) return;
    const e = g.evidencePacket as V4RuntimeEvidence;
    if (e.composition.product !== "love_marriage_child" || !("integration" in e.composition.result)) return expect.unreachable();
    const d = e.composition.result.integration.readerEdition;
    expect(e.composition.result.integration.readerValidation.hardErrors).toEqual([]);
    expect(d.chapters.flatMap(c => c.paragraphs)).toHaveLength(36);
    const first = d.chapters.find(c => c.id === "CH02")!.paragraphs[0];
    const privateSelf = d.chapters.find(c => c.id === "CH05")!.paragraphs[0];
    expect(first.text).not.toBe(privateSelf.text);
    expect(privateSelf.text).toMatch(/즐거|반가|기쁨|재미|친밀|설렘/);
    const text = d.chapters.flatMap(c => c.paragraphs.map(p => p.text)).join("\n");
    expect(text).not.toMatch(/지금 솔로|당신의 자녀는|당신의 배우자는/);
    expect(d.chapters.find(c => c.id === "CH06")?.paragraphs).toHaveLength(4);
    expect(projectBook(e)?.pages.at(-1)?.kind).toBe("back");
  }, 120000);

});
