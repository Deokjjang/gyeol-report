import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { generateProductReport } from "../../../src/lib/report-generation/generateProductReport";
import type { ProductGenerationSuccessResult } from "../../../src/lib/report-generation/productGenerationDispatcher";
import { validateProductPublication } from "../../../src/lib/report-generation/productPublishGate";
import { MBTI_TYPES } from "../../../src/lib/report-generation/reportInputTypes";
import { ComprehensiveReportV2View } from "../../../src/app/reports/[reportId]/ComprehensiveReportV2View";
import { CareerReportView } from "../../../src/app/reports/[reportId]/CareerReportView";
import { LoveMarriageChildReportView } from "../../../src/app/reports/[reportId]/LoveMarriageChildReportView";
import { CompatibilityReportView } from "../../../src/app/reports/[reportId]/CompatibilityReportView";
import { MajorFortuneReportView } from "../../../src/app/reports/[reportId]/MajorFortuneReportView";
import { AnnualFortuneReportView } from "../../../src/app/reports/[reportId]/AnnualFortuneReportView";
import { LoveMarriageChildReportManseRyeokTable, LoveMarriageChildReportMbtiProfileTable } from "../../../src/components/report-tables";
import type { LoveMarriageChildReportEvidencePacket } from "../../../src/lib/report-knowledge/loveMarriageChildReportTypes";

const disabled = { enabled: false as const, reason: "flag_disabled" as const };
const people = [
  { name: "지민", birthDate: "2001-06-22", birthTime: "13:30", gender: "MALE", mbtiType: "ISFJ", birthTimeUnknown: false, approximateBirthTimeSlot: "" },
  { name: "수연", birthDate: "1980-03-09", birthTime: "13:30", gender: "FEMALE", mbtiType: "ENFP", birthTimeUnknown: false, approximateBirthTimeSlot: "" },
  { name: "서진", birthDate: "1999-07-31", birthTime: "13:30", gender: "MALE", mbtiType: "INTP", birthTimeUnknown: false, approximateBirthTimeSlot: "" },
];
const products = ["saju_mbti_full", "career_money_study", "love_marriage_child", "major_fortune", "annual_fortune", "saju_mbti_compatibility"];
const payload = (product = "saju_mbti_full", person = people[0], selectedYear = "2026") => ({
  productKey: product, productSlug: product === "saju_mbti_full" ? "saju-mbti-full" : product === "saju_mbti_compatibility" ? "compatibility" : product.replaceAll("_", "-"),
  ...(product === "saju_mbti_compatibility" ? { personA: person, personB: people[1], relationshipType: "love" } : { person }),
  userContext: { relationshipStatus: "single", jobStatus: "employee", detailJob: "기획", focusAreas: [] },
  productOptions: product === "annual_fortune" ? { selectedYear } : {},
});
function render(product: string, r: ProductGenerationSuccessResult) {
  const props = { draft: r.draft, evidencePacket: r.evidencePacket, reportId: "report-correctness-local" };
  switch (product) {
    case "saju_mbti_full": return renderToStaticMarkup(createElement(ComprehensiveReportV2View, props as Parameters<typeof ComprehensiveReportV2View>[0]));
    case "career_money_study": return renderToStaticMarkup(createElement(CareerReportView, props as Parameters<typeof CareerReportView>[0]));
    case "love_marriage_child": {
      const evidence = r.evidencePacket as LoveMarriageChildReportEvidencePacket;
      return renderToStaticMarkup(createElement(LoveMarriageChildReportView, { ...props as Parameters<typeof LoveMarriageChildReportView>[0],
        manseRyeokTable: createElement(LoveMarriageChildReportManseRyeokTable, { evidence }), mbtiProfileTable: createElement(LoveMarriageChildReportMbtiProfileTable, { evidence }) }));
    }
    case "major_fortune": return renderToStaticMarkup(createElement(MajorFortuneReportView, props as Parameters<typeof MajorFortuneReportView>[0]));
    case "annual_fortune": return renderToStaticMarkup(createElement(AnnualFortuneReportView, props as Parameters<typeof AnnualFortuneReportView>[0]));
    default: return renderToStaticMarkup(createElement(CompatibilityReportView, props as Parameters<typeof CompatibilityReportView>[0]));
  }
}
beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(new Date("2026-09-23T12:00:00+09:00")); });
afterEach(() => { expect(fetch).not.toHaveBeenCalled(); vi.useRealTimers(); });



import { getMbtiSourceProfile, getMbtiProductTraits, getMbtiFortuneBasis } from "../../../src/lib/report-knowledge/mbti/sourceRuntimeAdapter";
import type { ComprehensiveReportEvidencePacket } from "../../../src/lib/report-knowledge/comprehensiveReportEvidenceTypes";
import type { CareerReportEvidencePacket } from "../../../src/lib/report-knowledge/careerReportTypes";
import type { CompatibilityEvidencePacket } from "../../../src/lib/report-knowledge/compatibilityEvidenceBuilder";
import type { MajorFortuneEvidencePacket } from "../../../src/lib/report-knowledge/majorFortuneTypes";
import type { AnnualFortuneEvidencePacket } from "../../../src/lib/report-knowledge/annualFortuneEvidence";

const cases = products.flatMap(product => people.flatMap(person => [...MBTI_TYPES.filter(Boolean), ""].map(mbtiType => ({product,person:{...person,mbtiType}}))));
describe("source MBTI knowledge: 51 customers x six paid products", () => {
  it.each(cases)("$product / $person.birthDate / $person.mbtiType: generate → publish → SSR", async ({product,person}) => {
    const p = payload(product,person);
    const result = await generateProductReport(p,disabled,"deterministic_fallback");
    expect(result.ok, result.ok ? "" : result.error.message).toBe(true); if (!result.ok) return;
    expect(result.externalCalls).toEqual([]);
    expect(validateProductPublication(product,result.draft,result.evidencePacket,p)).toEqual({ok:true,errors:[]});
    const html = render(product,result);
    expect(html).toContain(person.name);
    expect(html).not.toMatch(/지원 범위 밖|지원하지 않는 MBTI|core_identity 상황|placeholder|writer|fallback/iu);
    const source = getMbtiSourceProfile(person.mbtiType);
    const serialized = JSON.stringify(result.evidencePacket);
    // Source references may name the second person only in the pair product.
    const permitted = new Set([person.mbtiType,...(product === "saju_mbti_compatibility" ? [people[1].mbtiType] : [])]);
    for (const match of serialized.matchAll(/(?:^|[":])mbti:([A-Z]{4}):/g)) expect(permitted.has(match[1]),match[0]).toBe(true);
    if (product === "saju_mbti_full") {
      const e = result.evidencePacket as ComprehensiveReportEvidencePacket;
      if (!source) { expect(e.mbtiBasis).toBeUndefined(); expect(e.sajuMbtiBridgeEvidence ?? []).toEqual([]); return; }
      expect(e.mbtiBasis?.type).toBe(source.type);
      expect(e.mbtiBasis?.functionStack.map(s=>s.code)).toEqual(Object.values(source.functionStack!));
      for (const seed of e.mbtiBasis!.selectedTraitSeeds) expect(seed.sourceEvidenceId).toMatch(new RegExp(`^mbti:${source.type}:traits:`));
      for (const scene of e.sajuMbtiBridgeEvidence ?? []) {
        if (!scene.interaction?.interactionId.startsWith("bridge-v2:")) continue;
        expect(scene.interaction.mbtiEvidenceIds.every(id=>id.startsWith(`mbti:${source.type}:traits:`))).toBe(true);
        expect(scene.interaction.myeongliEvidenceIds.every(id=>e.bridgeFactIds?.includes(id))).toBe(true);
        expect(JSON.stringify(result.draft)).toContain(scene.sceneSeed);
      }
      if (person.mbtiType === "INTP") expect(html).toContain(source.traits!.thinkingStyle![0].plainKo!);
    } else if (product === "career_money_study") {
      const e = result.evidencePacket as CareerReportEvidencePacket;
      expect(e.mbtiType).toBe(source?.type ?? null);
      if (!source) { expect(e.mbtiSourceSelection?.type).toBeNull(); expect(Object.values(e.mbtiSourceSelection!.traitIds).every(ids=>ids.length===0)).toBe(true); return; }
      expect(e.mbtiSourceSelection?.type).toBe(source.type);
      for (const area of ["career","workplace","money","investment","study"] as const) {
        const ids=e.mbtiSourceSelection!.traitIds[area];
        expect(ids.length).toBeGreaterThan(0);
        expect(ids.every(id=>source.traits![area]!.some(t=>t.id===id))).toBe(true);
      }
      expect(e.recommendedJobs.some(j=>j.evidenceIds?.some(id=>id.startsWith(`mbti:${source.type}:recommendedJobs:`)))).toBe(true);
      expect(e.workRiskWarnings.some(j=>j.evidenceIds?.some(id=>id.startsWith(`mbti:${source.type}:avoidJobsOrEnvironments:`)))).toBe(true);
    } else if (product === "love_marriage_child") {
      const e=result.evidencePacket as LoveMarriageChildReportEvidencePacket;
      expect(e.personContext.mbtiType).toBe(source?.type ?? null);
      if (!source) { expect(Object.values(e.mbtiBasis).every(v=>v.length===0)).toBe(true); return; }
      for (const field of ["loveTraits","marriageTraits","communicationTraits","relationshipTraits","parentingTraits","growth"] as const) {
        expect(e.mbtiBasis[field].length).toBeGreaterThan(0);
        // Growth assets for work/study remain available but are not copied into relationship recovery.
        const reading = field === "growth" ? e.relationshipReading!.recoveryTraits[0] : e.mbtiBasis[field][0];
        if (reading) expect(html).toContain(renderToStaticMarkup(createElement("span", null, reading.plain)).slice(6, -7));
      }
    } else if (product === "saju_mbti_compatibility") {
      const e=result.evidencePacket as CompatibilityEvidencePacket;
      const profile=e.directionEvidence!.persons.personA;
      expect(profile.mbti).toBe(source?.type ?? null);
      expect(profile.traits.length).toBe(getMbtiProductTraits(person.mbtiType,"compatibilityReport",1).length);
      if (!source) expect(e.directionEvidence!.aToB.mbtiPair).toBeNull();
      else {
        expect(e.directionEvidence!.aToB.mbtiPair?.sourceType).toBe(source.type);
        expect(e.directionEvidence!.bToA.mbtiPair?.targetType).toBe(source.type);
      }
    } else {
      const e=result.evidencePacket as MajorFortuneEvidencePacket | AnnualFortuneEvidencePacket;
      expect(e.mbtiBasis).toEqual(getMbtiFortuneBasis(person.mbtiType,product === "major_fortune" ? "daeunReport" : "saeunReport"));
      expect(e.mbtiBasis.coreTraits.length).toBe(source ? 3 : 0);
    }
  });
});
