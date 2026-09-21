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
const cache = new Map<string, ProductGenerationSuccessResult>();
async function fallback(p = payload()) {
  const key = JSON.stringify(p);
  if (!cache.has(key)) {
    const r = await generateProductReport(p, disabled, "deterministic_fallback");
    expect(r.ok, JSON.stringify(r)).toBe(true);
    if (!r.ok) throw new Error("local fallback failed");
    cache.set(key, r);
  }
  return structuredClone(cache.get(key)!);
}
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
beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(new Date("2026-09-21T12:00:00+09:00")); });
afterEach(() => { expect(fetch).not.toHaveBeenCalled(); vi.useRealTimers(); });

describe("deterministic evidence → publish → actual renderer", () => {
  it.each(people.flatMap(person => [...MBTI_TYPES.filter(Boolean), ""].map(mbtiType => ({ ...person, mbtiType }))))("comprehensive $birthDate / $mbtiType", async person => {
    const p = payload("saju_mbti_full", person), r = await fallback(p);
    expect(validateProductPublication(p.productKey, r.draft, r.evidencePacket, p)).toEqual({ ok: true, errors: [] });
    const html = render(p.productKey, r);
    expect(html).toContain(person.name);
    expect(html).not.toMatch(/리포트를 준비하고|fixture|fallback|placeholder|deokmin|INTERNAL_META/iu);
    if (person.mbtiType === "") {
      expect(JSON.stringify(r.draft)).toContain("MBTI 미입력");
      expect(JSON.stringify(r)).not.toContain("ENTJ");
    }
  });
  it.each(products.filter(p => p !== "saju_mbti_full").flatMap(product => people.map(person => ({ product, person }))))("$product / $person.name preserves customer facts and renders", async ({ product, person }) => {
    const p = payload(product, person), r = await fallback(p);
    expect(validateProductPublication(product, r.draft, r.evidencePacket, p)).toEqual({ ok: true, errors: [] });
    expect(render(product, r)).toContain(person.name);
  });
  it.each(["2021", "2025", "2026"])("historical/current/transition annual %s renders", async year => {
    const p = payload("annual_fortune", people[0], year), r = await fallback(p);
    expect(render(p.productKey, r)).toContain(year);
    const evidence = r.evidencePacket as unknown as { dayunSelection: { selectedCycle: { ganji: string }; transition: unknown } };
    expect(evidence.dayunSelection.selectedCycle.ganji).toBe(year === "2026" ? "辛卯" : "壬辰");
    expect(Boolean(evidence.dayunSelection.transition)).toBe(year === "2026");
  });
  it("type differences come from MBTI source content, not just a renamed type", async () => {
    const a = await fallback(payload("saju_mbti_full", { ...people[0], mbtiType: "ISFJ" }));
    const b = await fallback(payload("saju_mbti_full", { ...people[0], mbtiType: "ENFP" }));
    const bodies = (r: ProductGenerationSuccessResult) => JSON.stringify(r.draft).replace(/ISFJ|ENFP/g, "TYPE");
    expect(bodies(a)).not.toBe(bodies(b));
  });
  it("uses actual 목0 화4 토3 금0 수1 counts without invented fire/water deficiency", async () => {
    const r = await fallback(payload("saju_mbti_full", { ...people[0], birthDate: "1977-06-10", birthTime: "01:30" }));
    const draft = r.draft as unknown as { profileTable: { fiveElementSummary: string[] }; longformReadings: { body: string }[] };
    expect(draft.profileTable.fiveElementSummary).toEqual(["목 0", "화 4", "토 3", "금 0", "수 1"]);
    const bodies = draft.longformReadings.map(x => x.body).join(" ");
    expect(bodies).toContain("목·금 항목이 0으로 집계됩니다");
    expect(bodies).not.toContain("비어 있는 화와 수");
    expect(bodies).not.toContain("화 부족");
  });
});

type Mutable = Record<string, unknown>;
function change(root: Mutable, path: string, value?: unknown) {
  const keys = path.split(".");
  let node = root;
  for (const key of keys.slice(0, -1)) node = node[key] as Mutable;
  if (value === undefined) delete node[keys.at(-1)!]; else node[keys.at(-1)!] = value;
}
const deletions: Record<string, string[]> = {
  saju_mbti_full: ["sajuFeatureDictionary", "sections", "mbtiBasis", "inputBasis", "birthTimeContexts"],
  career_money_study: ["userPillars", "manseRyeokPillars", "myeongliCareerBasis", "mbtiCareerBasis", "recommendedJobs", "investmentProfile"],
  love_marriage_child: ["sajuBasis.fullPillars", "sajuBasis.spousePalaceSignal", "sajuBasis.loveTenGodSignals", "mbtiBasis", "mbtiBasis.loveTraits"],
  major_fortune: ["customerDayun.cycles", "dayunSelection", "currentCycle", "majorFortuneTimeline", "majorFortuneTimelineRows", "domainFlows"],
  annual_fortune: ["annualFortune", "monthlyFortunes", "monthlyFortunes.0.supportSignals", "monthlyFortunes.0.frictionSignals", "natalAnnualRelations", "natalAnnualRelations.interactions", "baseSaju", "dayunSelection", "yearlyThemeSummary"],
  saju_mbti_compatibility: ["birthTimeContexts", "inputBasis", "participants"],
};
describe("publish rejects evidence mutations before rendering", () => {
  it.each(Object.entries(deletions).flatMap(([product, paths]) => paths.map(path => ({ product, path }))))("$product missing $path", async ({ product, path }) => {
    const r = await fallback(payload(product)); change(r.evidencePacket as Mutable, path);
    expect(validateProductPublication(product, r.draft, r.evidencePacket).ok).toBe(false);
  });
  it.each(products)("%s rejects three-field, wrong version, product, customer, MBTI and input", async product => {
    const p = payload(product), r = await fallback(p);
    expect(validateProductPublication(product, r.draft, { productType: product, productVersion: "v1", personLabel: "지민" }).ok).toBe(false);
    for (const [path, value] of [["calendarVersion", "obsolete"], ["calendarCalculationVersion", "obsolete"], ["productType", "wrong"],
      [product === "saju_mbti_compatibility" ? "inputBasis.personA.mbtiType" : "inputBasis.person.mbtiType", "ENTJ"],
      [product === "saju_mbti_compatibility" ? "inputBasis.personA.birthDate" : "inputBasis.person.birthDate", "1900-01-01"]]) {
      const copy = structuredClone(r); change(copy.evidencePacket as Mutable, path, value);
      expect(validateProductPublication(product, copy.draft, copy.evidencePacket).ok, path).toBe(false);
    }
    expect(validateProductPublication(product, r.draft, r.evidencePacket, payload(product, { ...people[0], name: "다른고객" })).ok).toBe(false);
  });
  it("comprehensive element, MBTI, marker and repeated-feature mutations cannot publish", async () => {
    const r = await fallback();
    for (const [path, value] of [["profileTable.fiveElementSummary", ["목 1", "화 4", "토 3", "금 1", "수 0"]], ["profileTable.mbti", "ENTJ"], ["openingSummary", "INTERNAL_META fixture fallback"]] as const) {
      const copy = structuredClone(r); change(copy.draft as Mutable, path, value);
      expect(validateProductPublication("saju_mbti_full", copy.draft, copy.evidencePacket).ok).toBe(false);
    }
    const copy = structuredClone(r), draft = copy.draft as unknown as { sajuFeatureChapter: { items: { plainMeaning: string }[] } };
    draft.sajuFeatureChapter.items[1].plainMeaning = draft.sajuFeatureChapter.items[0].plainMeaning;
    expect(validateProductPublication("saju_mbti_full", copy.draft, copy.evidencePacket).errors).toContain("GENERIC_FEATURE_REPETITION");
  });
  it.each([
    ["saju_mbti_full", "birthTimeContexts.person.confirmed.day.stem"],
    ["career_money_study", "userPillars.day"],
    ["career_money_study", "manseRyeokPillars.0.heavenlyStem"],
    ["love_marriage_child", "sajuBasis.fullPillars.0.stem"],
    ["major_fortune", "baseSaju.pillars.day"],
    ["annual_fortune", "userPillars.day"],
    ["annual_fortune", "annualFortune.ganji"],
    ["annual_fortune", "monthlyFortunes.0.ganji"],
  ])("%s rejects conflicting %s", async (product, path) => {
    const r = await fallback(payload(product)); change(r.evidencePacket as Mutable, path, "癸亥");
    expect(validateProductPublication(product, r.draft, r.evidencePacket).ok).toBe(false);
  });
  it.each(["fixture", "fallback", "placeholder", "mock", "deokmin", "sample", "sourceStatus", "internal", "validator", "writer"])("rejects internal marker %s", async marker => {
    const r = await fallback(payload("career_money_study")); change(r.draft as Mutable, "openingSummary", marker);
    expect(validateProductPublication("career_money_study", r.draft, r.evidencePacket).errors).toContain("INTERNAL_MARKER");
  });
  it.each(["major_fortune", "annual_fortune"])("%s rejects foreign cycle and target year", async product => {
    for (const path of ["dayunSelection.selectedCycle.ganji", "customerDayun.cycles.0.ganji"]) {
      const r = await fallback(payload(product)); change(r.evidencePacket as Mutable, path, "戊辰");
      expect(validateProductPublication(product, r.draft, r.evidencePacket).ok).toBe(false);
    }
    const r = await fallback(payload("annual_fortune")); change(r.evidencePacket as Mutable, "selectedYear", 2021);
    expect(validateProductPublication("annual_fortune", r.draft, r.evidencePacket).ok).toBe(false);
  });
});

describe("mock writer failures retain the same canonical fallback", () => {
  it.each(products.slice(0, 5).flatMap(product => ["timeout", "malformed", "empty", "invalid"].map(failure => ({ product, failure }))))("$product / $failure", async ({ product, failure }) => {
    const p = payload(product), baseline = await fallback(p);
    const transport = vi.fn<typeof fetch>(async () => {
      if (failure === "timeout") throw new DOMException("mock timeout", "AbortError");
      return Response.json({ output_text: failure === "malformed" ? "{broken" : failure === "empty" ? "" : "{}" });
    });
    const runtime = { enabled: true as const, config: { enabled: true as const, apiKey: "mock-only", model: "mock", fetchImpl: transport } };
    for (const strategy of ["normal_writer", "writer_regeneration"] as const) expect((await generateProductReport(p, runtime, strategy)).ok).toBe(false);
    const calls = transport.mock.calls.length;
    expect(calls).toBeGreaterThanOrEqual(2);
    const repaired = await generateProductReport(p, runtime, "deterministic_fallback");
    expect(repaired.ok, JSON.stringify(repaired)).toBe(true); if (!repaired.ok) return;
    expect(transport).toHaveBeenCalledTimes(calls);
    expect(repaired.evidencePacket).toEqual(baseline.evidencePacket);
    expect(validateProductPublication(product, repaired.draft, repaired.evidencePacket, p)).toEqual({ ok: true, errors: [] });
    expect(render(product, repaired)).toContain(people[0].name);
  });
});
