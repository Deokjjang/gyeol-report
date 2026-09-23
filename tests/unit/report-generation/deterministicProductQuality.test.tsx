import { createHash } from "node:crypto";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { generateProductReport } from "../../../src/lib/report-generation/generateProductReport";
import { validateNewProductPublication } from "../../../src/lib/report-generation/productPublishGate";
import type { ProductGenerationSuccessResult } from "../../../src/lib/report-generation/productGenerationDispatcher";
import { ComprehensiveReportV2View } from "../../../src/app/reports/[reportId]/ComprehensiveReportV2View";
import { CareerReportView } from "../../../src/app/reports/[reportId]/CareerReportView";
import { LoveMarriageChildReportView } from "../../../src/app/reports/[reportId]/LoveMarriageChildReportView";
import { CompatibilityReportView } from "../../../src/app/reports/[reportId]/CompatibilityReportView";
import { MajorFortuneReportView } from "../../../src/app/reports/[reportId]/MajorFortuneReportView";
import { AnnualFortuneReportView } from "../../../src/app/reports/[reportId]/AnnualFortuneReportView";
import { buildAnnualFortuneReportCommonTablesData } from "../../../src/lib/report-tables/saeunFortuneTableData";
import { getMbtiSourceProfile } from "../../../src/lib/report-knowledge/mbti/sourceRuntimeAdapter";
import { contextualTenGodReading, selectReportActivity } from "../../../src/lib/report-knowledge/reportContextScenes";
import type { AnnualFortuneEvidencePacket } from "../../../src/lib/report-knowledge/annualFortuneEvidence";
import type { CareerReportEvidencePacket } from "../../../src/lib/report-knowledge/careerReportTypes";
import type { CompatibilityEvidencePacket } from "../../../src/lib/report-knowledge/compatibilityEvidenceBuilder";

const disabled = { enabled: false as const, reason: "flag_disabled" as const };
const products = ["saju_mbti_full", "career_money_study", "love_marriage_child", "saju_mbti_compatibility", "major_fortune", "annual_fortune"] as const;
const profiles = [
  { name: "현우", birthDate: "1989-09-07", birthTime: "07:24", gender: "MALE", mbtiType: "INFP", jobStatus: "employee", detailJob: "B2B 소프트웨어 영업기획" },
  { name: "지아", birthDate: "2002-02-17", birthTime: "19:53", gender: "FEMALE", mbtiType: "ESTP", jobStatus: "student", detailJob: "경영학 전공 대학생" },
  { name: "준혁", birthDate: "1979-11-08", birthTime: "13:26", gender: "MALE", mbtiType: "ISFJ", jobStatus: "employee", detailJob: "제조업 품질관리 책임자" },
];
const person = (i: number) => { const { jobStatus: _job, detailJob: _detail, ...p } = profiles[i]; void _job; void _detail; return { ...p, birthTimeUnknown: false, approximateBirthTimeSlot: "" }; };
const payload = (product: string, i = 0) => ({ productKey: product, productSlug: product === "saju_mbti_compatibility" ? "compatibility" : product.replaceAll("_", "-"),
  ...(product === "saju_mbti_compatibility" ? { personA: person(i), personB: person((i + 1) % 3), relationshipType: "businessPartner" } : { person: person(i) }),
  userContext: { relationshipStatus: "single", jobStatus: profiles[i].jobStatus, detailJob: profiles[i].detailJob, focusAreas: [] },
  productOptions: product === "annual_fortune" ? { selectedYear: "2026" } : {},
});
async function generate(p: ReturnType<typeof payload>) {
  const r = await generateProductReport(p, disabled, "deterministic_fallback");
  expect(r.ok, JSON.stringify(r.ok ? {} : r.error)).toBe(true);
  if (!r.ok) throw new Error("local deterministic generation failed");
  expect(r.externalCalls).toEqual([]);
  expect(validateNewProductPublication(p.productKey, r.draft, r.evidencePacket, p)).toEqual({ ok: true, errors: [] });
  return r;
}
function render(product: string, r: ProductGenerationSuccessResult) {
  const props = { draft: r.draft, evidencePacket: r.evidencePacket, reportId: "local-quality" };
  switch (product) {
    case "saju_mbti_full": return renderToStaticMarkup(createElement(ComprehensiveReportV2View, props as Parameters<typeof ComprehensiveReportV2View>[0]));
    case "career_money_study": return renderToStaticMarkup(createElement(CareerReportView, props as Parameters<typeof CareerReportView>[0]));
    case "love_marriage_child": return renderToStaticMarkup(createElement(LoveMarriageChildReportView, props as Parameters<typeof LoveMarriageChildReportView>[0]));
    case "major_fortune": return renderToStaticMarkup(createElement(MajorFortuneReportView, props as Parameters<typeof MajorFortuneReportView>[0]));
    case "annual_fortune": return renderToStaticMarkup(createElement(AnnualFortuneReportView, props as Parameters<typeof AnnualFortuneReportView>[0]));
    default: return renderToStaticMarkup(createElement(CompatibilityReportView, props as Parameters<typeof CompatibilityReportView>[0]));
  }
}
function canonicalHash(packet: unknown) {
  const e = packet as Record<string, unknown>;
  return createHash("sha256").update(JSON.stringify({ basis:e.inputBasis,natal:e.natalTableEvidence,pillars:e.userPillars,dayun:e.customerDayun,annual:e.annualFortune,months:e.calendarMonths })).digest("hex");
}
// Captured from 1d75784 BEFORE the interpretation edits. No expected fact is
// recomputed with the implementation under test. Includes every V2 month segment.
const sameNatal = ["3662fab21c9efc302c6b6b015785496f8ca9ed6b41640e5d4ef4932e27bb80ac", "ae9f981834007ae81e14f27ab9f55f7efa2f9bb8be371dfe38300c6a0f68f020", "d5ac8f2295344cccbb0ef19c6efa340833a60c0c5a1cd2aaa97c16b76c7a060c"];
const canonicalGolden: Record<string, readonly (string | null)[]> = {
  saju_mbti_full: sameNatal, love_marriage_child: sameNatal,
  career_money_study: ["ca1f67667899e94d30304e9eab68ece86d99e98e447f56c14ae3aaa12c32fab0", "6291e9c25b820df94dd456a6887c7c5b2cd681103544e3dcc3025a78435d15a9", "da05bc171818228fb4559615e4fb50e06ab9cb0d46e4b5327c619217aba21fdd"],
  // INFP/ESTP originally failed on a negated absolute word. Other pairs establish the baseline.
  saju_mbti_compatibility: [null, "0e02ccf458b2e5478def2cb7c618caa19078eb668974c220ade29cfe908bf09f", "2d0f686a34f23ae60354a0e875d52fccf4b4e218917ec62a1ac1900531a2e83f"],
  major_fortune: ["14484b6924591e4c054d2ba717af189f2dd8d0bbb12283bdf38e34137e23a770", "f1e6c32fece55351b27d6631694c0c30b7a5bf30f20bc25176c55231d00fd9b7", "a106170acc260e091e0013ecf4b9edd4b9b239e145bd454cc8c0ede7a6a24f74"],
  annual_fortune: ["b4656036389edae4d91334b4b1b4eb59bc05526a3ef3b5405944eb62dbc101fa", "5e7b55c4de21606a567df13ec66e077946248746adc43f2a0fe97e81c9d7be76", "b259b3d6806f2394788e97aba9037ab158b96df3a850cf970a623e8ece6d9006"],
};
beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(new Date("2026-09-24T03:00:00Z")); });
afterEach(() => { expect(fetch).not.toHaveBeenCalled(); vi.useRealTimers(); });

describe("deterministic-first quality without changing calculation", () => {
  it.each(products.flatMap(product => profiles.map((_, i) => ({ product, i }))))("$product / $i → publish → SSR", async ({ product, i }) => {
    const r = await generate(payload(product, i));
    const expected = canonicalGolden[product][i];
    if (expected) expect(canonicalHash(r.evidencePacket)).toBe(expected);
    const html = render(product, r);
    expect(html).toContain(profiles[i].name);
    expect(html).not.toMatch(/토을|화을|세운와|대운와|활용가|통제을|영업기획라는|반복 압박|번째 점검/);
    if (product !== "saju_mbti_compatibility") for (const other of profiles.filter((_, j) => j !== i)) expect(html).not.toContain(other.detailJob);
    expect(html.length).toBeGreaterThan(8000);
  });
  it("prioritizes grounded adjacent roles over generic INFP examples and reduces repeated advice", async () => {
    const r = await generate(payload("career_money_study"));
    const e = r.evidencePacket as CareerReportEvidencePacket;
    expect(e.recommendedJobs.slice(0, 3).map(j => j.title)).not.toEqual(expect.arrayContaining(["작가", "배우", "가수·음악가"]));
    expect(e.recommendedJobs[0].evidenceIds).toContain("context:sales_operations");
    expect(e.recommendedJobs[0].evidenceIds?.some(id => id.startsWith("natal:"))).toBe(true);
    expect(e.recommendedJobs.some(j => j.evidenceIds?.some(id => id.startsWith("mbti:INFP:recommendedJobs:")))).toBe(true);
    const html = render("career_money_study", r);
    for (const context of ["CRM", "제안서", "영업 보고서", "계약", "정산", "포트폴리오"]) expect(html).toContain(context);
    const sentences = html.replace(/<[^>]*>/g, "").split(/[.!?。]/u).map(s => s.trim()).filter(s => s.length >= 40);
    const counts = new Map<string, number>(); sentences.forEach(s => counts.set(s, (counts.get(s) ?? 0) + 1));
    expect([...counts.values()].filter(n => n > 1).length).toBeLessThan(5); // Before: five long repeated advice groups.
  });
  it("changing current context changes examples, not natal, year or MBTI sources", async () => {
    const p = payload("career_money_study"); const a = await generate(p);
    const b = await generate({ ...p, userContext: { ...p.userContext, detailJob: "제조업 품질관리 책임자" } });
    const ae = a.evidencePacket as CareerReportEvidencePacket, be = b.evidencePacket as CareerReportEvidencePacket;
    expect(ae.userPillars).toEqual(be.userPillars);
    expect(ae.myeongliCareerBasis).toEqual(be.myeongliCareerBasis);
    expect(ae.manseRyeokPillars).toEqual(be.manseRyeokPillars);
    expect(ae.timingHints).toEqual(be.timingHints);
    expect(ae.mbtiSourceSelection).toEqual(be.mbtiSourceSelection);
    expect(ae.recommendedJobs[0].title).not.toBe(be.recommendedJobs[0].title);
    expect(render("career_money_study", b)).not.toContain("CRM");
  });
  it("student annual reading keeps exact V2 segments, puts foundation early and maps MBTI labels by source", async () => {
    const r = await generate(payload("annual_fortune", 1)); const e = r.evidencePacket as AnnualFortuneEvidencePacket;
    const html = render("annual_fortune", r);
    expect(html.indexOf('id="report-year"')).toBeLessThan(html.indexOf('id="report-foundation"'));
    expect(html.indexOf('id="report-foundation"')).toBeLessThan(html.indexOf('id="report-cross"'));
    expect(html).toContain("팀 프로젝트"); expect(html).toContain("과제 초안");
    const tables = buildAnnualFortuneReportCommonTablesData(e);
    const notes = tables.mbtiProfileTableData?.reportUsageNotes ?? [];
    const source = getMbtiSourceProfile("ESTP")!;
    for (const [label, area] of [["일과 실행", "career"], ["돈과 자원", "money"], ["관계 리듬", "relationships"], ["성장 방식", "study"]] as const) {
      const note = notes.find(n => n.label.startsWith(label));
      expect(note?.plainKo).toBe(source.traits?.[area]?.find(t => t.plainKo)?.plainKo);
    }
  });
  it("retains each person's natal/MBTI facts and both pair directions after swap", async () => {
    const p = payload("saju_mbti_compatibility"); const a = await generate(p);
    if (!("personA" in p)) throw new Error("pair fixture required");
    const b = await generate({ ...p, personA: p.personB, personB: p.personA });
    const ae = (a.evidencePacket as CompatibilityEvidencePacket).directionEvidence!;
    const be = (b.evidencePacket as CompatibilityEvidencePacket).directionEvidence!;
    expect(ae.persons.personA).toEqual(be.persons.personB);
    expect(ae.aToB).toEqual(be.bToA);
    expect(ae.bToA).toEqual(be.aToB);
    expect(render("saju_mbti_compatibility", b)).not.toContain("申亥와 子未처럼");
  });
  it("context never supplies an inferred MBTI or a fabricated ten-god", () => {
    const context = { lifeStatus: "employee" as const, fieldLabel: "B2B 소프트웨어 영업기획" };
    expect(selectReportActivity(context).id).toBe("sales_operations");
    const scene = contextualTenGodReading(context, "정인", "scene");
    expect(scene).toContain("배운 기준"); expect(scene).not.toMatch(/INFP|재성|토 과다|수익 보장/);
    expect(contextualTenGodReading(context, "정인", "action")).not.toBe(scene);
    expect(selectReportActivity({ lifeStatus: "other", fieldLabel: "" }).id).toBe("general");
    expect(selectReportActivity({ lifeStatus: "employee", fieldLabel: "hospitality" }).id).toBe("general");
    expect(selectReportActivity({ lifeStatus: "employee", fieldLabel: "IT 서비스" }).id).toBe("project_creation");
  });
});
