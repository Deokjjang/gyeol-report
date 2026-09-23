import { LoveMarriageChildReportManseRyeokTable, LoveMarriageChildReportMbtiProfileTable } from "../../../src/components/report-tables/LoveMarriageChildReportCommonTables";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, afterAll, describe, expect, it, vi } from "vitest";
import { generateProductReport } from "../../../src/lib/report-generation/generateProductReport";
import type { ProductGenerationSuccessResult } from "../../../src/lib/report-generation/productGenerationDispatcher";
import { validateProductPublication } from "../../../src/lib/report-generation/productPublishGate";
import { buildPaidWriterRequest } from "../../../src/lib/report-generation/paidWriterRequest";
import { getCanonicalNatalTable, validateNatalFeatureProvenance, validateNatalTableEvidence } from "../../../src/lib/report-knowledge/natalTableEvidence";
import { buildCanonicalManseRyeokTableData } from "../../../src/lib/report-tables/manseRyeokTableData";
import { buildCareerReportManseRyeokTableData } from "../../../src/lib/report-tables/careerReportTablePresenter";
import { buildLoveMarriageChildReportManseRyeokTableData } from "../../../src/lib/report-tables/loveMarriageChildReportTablePresenter";
import { buildMajorFortuneReportManseRyeokTableData } from "../../../src/lib/report-tables/daeunTableData";
import { buildAnnualFortuneReportManseRyeokTableData } from "../../../src/lib/report-tables/saeunFortuneTableData";
import ManseRyeokCommonTable from "../../../src/components/report-tables/ManseRyeokCommonTable";
import { ComprehensiveReportV2View } from "../../../src/app/reports/[reportId]/ComprehensiveReportV2View";
import { CareerReportView } from "../../../src/app/reports/[reportId]/CareerReportView";
import { LoveMarriageChildReportView } from "../../../src/app/reports/[reportId]/LoveMarriageChildReportView";
import { CompatibilityReportView } from "../../../src/app/reports/[reportId]/CompatibilityReportView";
import { MajorFortuneReportView } from "../../../src/app/reports/[reportId]/MajorFortuneReportView";
import { AnnualFortuneReportView } from "../../../src/app/reports/[reportId]/AnnualFortuneReportView";

const products = ["saju_mbti_full", "career_money_study", "love_marriage_child", "saju_mbti_compatibility", "major_fortune", "annual_fortune"] as const;
const person = { name: "윤서", birthDate: "1993-03-18", birthTime: "10:42", birthTimeUnknown: false, approximateBirthTimeSlot: "", gender: "FEMALE", mbtiType: "ISTP" };
const partner = { ...person, name: "도윤", birthDate: "1996-12-06", birthTime: "14:15", gender: "MALE", mbtiType: "ENTJ" };
function payload(key: string, p = person, swap = false) {
  return { productKey: key, productSlug: key === "saju_mbti_full" ? "saju-mbti-full" : key === "saju_mbti_compatibility" ? "compatibility" : key.replaceAll("_", "-"),
    ...(key === "saju_mbti_compatibility" ? { personA: swap ? partner : p, personB: swap ? p : partner, relationshipType: "love" } : { person: p }),
    userContext: { relationshipStatus: "single", jobStatus: "employee", detailJob: "UX 디자이너", focusAreas: [] }, productOptions: key === "annual_fortune" ? { selectedYear: "2026" } : {} };
}
async function generate(key: string, p = person, swap = false) {
  const r = await generateProductReport(payload(key, p, swap), { enabled: false, reason: "flag_disabled" }, "deterministic_fallback");
  expect(r.ok, JSON.stringify(r.ok ? null : r)).toBe(true);
  if (!r.ok) throw new Error("Local generation failed");
  return r;
}
const prepared = new Map<string, Awaited<ReturnType<typeof generate>>>();
beforeAll(async () => {
  vi.useFakeTimers(); vi.setSystemTime(new Date("2026-09-24T12:00:00+09:00"));
  for (const key of products) prepared.set(key, await generate(key));
});
afterAll(() => vi.useRealTimers());
function html(key: string, r: ProductGenerationSuccessResult) {
  // Components retain their product types; this matrix obtains each from the matching generator.
  const props = { draft: r.draft as never, evidencePacket: r.evidencePacket as never };
  if (key === "saju_mbti_full") return renderToStaticMarkup(createElement(ComprehensiveReportV2View, { ...props, displayName: person.name }));
  if (key === "saju_mbti_compatibility") return renderToStaticMarkup(createElement(CompatibilityReportView, props));
  if (key === "career_money_study") return renderToStaticMarkup(createElement(CareerReportView, props));
  if (key === "love_marriage_child") return renderToStaticMarkup(createElement(LoveMarriageChildReportView, { ...props, manseRyeokTable: createElement(LoveMarriageChildReportManseRyeokTable, { evidence: props.evidencePacket }), mbtiProfileTable: createElement(LoveMarriageChildReportMbtiProfileTable, { evidence: props.evidencePacket }) }));
  if (key === "major_fortune") return renderToStaticMarkup(createElement(MajorFortuneReportView, props));
  return renderToStaticMarkup(createElement(AnnualFortuneReportView, props));
}

describe("canonical natal evidence across the six paid products", () => {
  it.each(products)("%s publishes and SSR uses the identical stored natal facts", key => {
    const r = prepared.get(key)!, role = key === "saju_mbti_compatibility" ? "personA" : "person";
    const natal = getCanonicalNatalTable(r.evidencePacket, role)!;
    expect(natal).toEqual(getCanonicalNatalTable(prepared.get("saju_mbti_full")!.evidencePacket));
    expect(validateProductPublication(key, r.draft, r.evidencePacket, payload(key))).toEqual({ ok: true, errors: [] });
    const rendered = html(key, r);
    expect(rendered).toContain("전체 원국 표식과 해석 근거");
    for (const label of ["태극귀인", "장성살", "괴강살", "도화살", "천문성", "귀문관살", "화개살", "원진살", "공망"]) expect(rendered).toContain(label);
    expect(r.externalCalls).toEqual([]);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("uses engine hidden stems, per-pillar ten gods, actual noble positions and verified natal relations", () => {
    const n = getCanonicalNatalTable(prepared.get("saju_mbti_full")!.evidencePacket)!;
    expect(n.pillars.map(p => p.pillar)).toEqual(["丁巳", "戊戌", "乙卯", "癸酉"]);
    expect(n.pillars.find(p => p.columnId === "month")?.hiddenStems).toEqual(["乙 정관"]);
    expect(n.pillars.find(p => p.columnId === "year")?.hiddenStems).toEqual(["辛 상관"]);
    expect(n.pillars.find(p => p.columnId === "day")?.gwiin).toContain("태극귀인");
    expect(n.pillars.find(p => p.columnId === "year")?.twelveSinsal).toContain("장성살");
    expect(n.features.find(f => f.id === "twelve_sinsal_hwagae")).toMatchObject({ source: "derived", basis: "일지 기준 십이신살", positions: ["day"] });
    for (const id of ["sinsal_goegang", "sinsal_cheonmunseong", "sinsal_gwimun", "sinsal_wonjin", "sinsal_gongmang"]) {
      expect(n.features.find(f => f.id === id)).toMatchObject({ source: "derived", basis: "원국 전체의 파생 근거" });
      expect(n.features.find(f => f.id === id)?.evidenceIds.length).toBeGreaterThan(0);
    }
    expect(n.relations.map(r => r.label)).toEqual(expect.arrayContaining(["연주·일주 천간합 戊癸", "월주·일주 지지육합 卯戌", "연주·월주 지지충 卯酉"]));
    expect(n.pillars.every(p => (p.twelveLifeStage?.length ?? 0) > 0)).toBe(true);
  });

  it("all four presenter adapters prefer the canonical snapshot over incomplete legacy display arrays", () => {
    const expected = getCanonicalNatalTable(prepared.get("saju_mbti_full")!.evidencePacket);
    const adapters = [
      buildCareerReportManseRyeokTableData(prepared.get("career_money_study")!.evidencePacket as never),
      buildLoveMarriageChildReportManseRyeokTableData(prepared.get("love_marriage_child")!.evidencePacket as never),
      buildMajorFortuneReportManseRyeokTableData(prepared.get("major_fortune")!.evidencePacket as never),
      buildAnnualFortuneReportManseRyeokTableData(prepared.get("annual_fortune")!.evidencePacket as never),
    ];
    for (const table of adapters) expect(table.natalEvidence).toEqual(expected);
  });

  it("A/B swap moves each person's complete table without changing any natal fact", async () => {
    const original = prepared.get("saju_mbti_compatibility")!, swapped = await generate("saju_mbti_compatibility", person, true);
    expect(getCanonicalNatalTable(swapped.evidencePacket, "personB")).toEqual(getCanonicalNatalTable(original.evidencePacket, "personA"));
    expect(getCanonicalNatalTable(swapped.evidencePacket, "personA")).toEqual(getCanonicalNatalTable(original.evidencePacket, "personB"));
    const n = getCanonicalNatalTable(swapped.evidencePacket, "personA")!;
    expect(n.pillars.map(p => p.pillar)).toEqual(["丁未", "丁丑", "己亥", "丙子"]);
    expect(html("saju_mbti_compatibility", swapped)).toContain("윤서님의 만세력");
  });

  it.each(["approximate", "unknown"])("%s preserves precision without inventing an hour", async precision => {
    const p = { ...person, birthTime: "", birthTimeUnknown: precision === "unknown", approximateBirthTimeSlot: precision === "approximate" ? "SASI" : "" };
    const r = await generate("saju_mbti_full", p), n = getCanonicalNatalTable(r.evidencePacket)!;
    expect(n.precision).toBe(precision);
    const table = buildCanonicalManseRyeokTableData(r.evidencePacket)!;
    if (precision === "unknown") {
      expect(n.pillars.some(p => p.columnId === "hour")).toBe(false);
      expect(table.stemRow.hour).toBeNull();
      expect(table.fiveElementDistribution.basisLabel).toContain("6글자");
      expect(n.features.every(f => !f.positions.includes("hour"))).toBe(true);
    } else expect(n.pillars.map(p => p.pillar)).toEqual(getCanonicalNatalTable(prepared.get("saju_mbti_full")!.evidencePacket)!.pillars.map(p => p.pillar));
    expect(html("saju_mbti_full", r)).toContain(precision === "unknown" ? "출생시간 미상" : "선택한 시간대 전체");
  });

  it.each(["feature", "hidden", "relation", "precision"])("rejects tampered canonical %s without changing the snapshot", kind => {
    const r = prepared.get("saju_mbti_full")!, e = structuredClone(r.evidencePacket) as { natalTableEvidence: { person: { features: { label: string }[]; pillars: { hiddenStems: string[] }[]; relations: unknown[]; precision: string } } };
    const n = e.natalTableEvidence.person;
    if (kind === "feature") n.features[0].label = "가짜 귀인";
    if (kind === "hidden") n.pillars[0].hiddenStems = ["甲 편관"];
    if (kind === "relation") n.relations.push({ label: "가짜 삼형" });
    if (kind === "precision") n.precision = "unknown";
    const before = JSON.stringify(e);
    expect(validateProductPublication("saju_mbti_full", r.draft, e).errors).toContain("NATAL_TABLE_EVIDENCE_MISMATCH");
    expect(JSON.stringify(e)).toBe(before);
  });

  it("blocks invented natal claims instead of adding them to the table", () => {
    const r = prepared.get("saju_mbti_full")!, e = structuredClone(r.evidencePacket) as Record<string, unknown>;
    (e.sajuFeatureDictionary as unknown[]).push({ id: "feature_gwiin_cheoneul", sourceFeatureId: "gwiin_cheoneul", rawLabel: "천을귀인" });
    expect(validateProductPublication("saju_mbti_full", r.draft, e).errors).toContain("NATAL_FEATURE_UNSUPPORTED:person:gwiin_cheoneul");
    for (const key of ["career_money_study", "major_fortune", "annual_fortune"]) {
      const p = prepared.get(key)!;
      expect(validateNatalFeatureProvenance(key, p.draft, { ...p.evidencePacket as object, natalLabels: ["천을귀인"] })).toContain("NATAL_LABEL_UNSUPPORTED:person:천을귀인");
    }
  });

  it("accepts reordered JSON object keys and does not backfill legacy snapshots", () => {
    const r = prepared.get("saju_mbti_full")!;
    const reverse = (v: unknown): unknown => Array.isArray(v) ? v.map(reverse) : v !== null && typeof v === "object" ? Object.fromEntries(Object.entries(v).reverse().map(([k,v]) => [k, reverse(v)])) : v;
    expect(validateNatalTableEvidence(reverse(r.evidencePacket))).toEqual([]);
    const legacy = { ...r.evidencePacket as Record<string, unknown> }; delete legacy.natalTableEvidence;
    const before = JSON.stringify(legacy);
    expect(validateProductPublication("saju_mbti_full", r.draft, legacy).ok).toBe(true);
    expect(buildCanonicalManseRyeokTableData(legacy)).toBeUndefined();
    expect(JSON.stringify(legacy)).toBe(before);
  });

  it.each(products)("%s keeps writer transport unchanged by display-only metadata", key => {
    const r = prepared.get(key)!;
    const legacy = { ...r.evidencePacket as Record<string, unknown> }; delete legacy.natalTableEvidence;
    expect(buildPaidWriterRequest(r, person.name)).toEqual(buildPaidWriterRequest({ ...r, evidencePacket: legacy }, person.name));
  });

  it("expanded details retain keyboard access and distinguish natal from fortune facts", () => {
    const data = buildCanonicalManseRyeokTableData(prepared.get("major_fortune")!.evidencePacket)!;
    const rendered = renderToStaticMarkup(createElement(ManseRyeokCommonTable, { data }));
    expect(rendered).toContain("<details"); expect(rendered).toContain("<summary"); expect(rendered).toContain("focus-visible");
    expect(rendered).toContain("일지 기준 십이신살"); expect(rendered).toContain("연지 기준");
    expect(rendered).not.toMatch(/2026|2035|대운 간지|natal:|canonical-natal/);
  });
});
