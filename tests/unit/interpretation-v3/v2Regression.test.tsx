import { createHash } from "node:crypto";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { generateProductReport } from "../../../src/lib/report-generation/generateProductReport";
import { validateNewProductPublication } from "../../../src/lib/report-generation/productPublishGate";
import { ComprehensiveReportV2View } from "../../../src/app/reports/[reportId]/ComprehensiveReportV2View";
import { CareerReportView } from "../../../src/app/reports/[reportId]/CareerReportView";
import { LoveMarriageChildReportView } from "../../../src/app/reports/[reportId]/LoveMarriageChildReportView";
import { CompatibilityReportView } from "../../../src/app/reports/[reportId]/CompatibilityReportView";
import { MajorFortuneReportView } from "../../../src/app/reports/[reportId]/MajorFortuneReportView";
import { AnnualFortuneReportView } from "../../../src/app/reports/[reportId]/AnnualFortuneReportView";
import { getCanonicalNatalTable } from "../../../src/lib/report-knowledge/natalTableEvidence";
import type { AnnualFortuneEvidencePacket } from "../../../src/lib/report-knowledge/annualFortuneEvidence";
import type { MajorFortuneEvidencePacket } from "../../../src/lib/report-knowledge/majorFortuneTypes";
import { PRODUCTS } from "../../../src/lib/interpretation-v3/types";
import { adaptAnnualFortune, adaptMajorFortune, adaptMbti, adaptMonthSegment, adaptNatalTable, validateEvidence } from "../../../src/lib/interpretation-v3/evidence";
import { interpretV3 } from "../../../src/lib/interpretation-v3/engine";

const p = { name: "기준인", birthDate: "1989-09-07", birthTime: "07:24", birthTimeUnknown: false, approximateBirthTimeSlot: "", gender: "MALE", mbtiType: "INFP" };
const q = { ...p, name: "상대인", birthDate: "2002-02-17", birthTime: "19:53", gender: "FEMALE", mbtiType: "ESTP" };
const hash = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
// Frozen baseline of edacb1b production sources (no production file changed).
// Includes entire draft + entire evidence packet + server-rendered HTML.
const GOLDEN: Record<string, string> = {
  saju_mbti_full: "0d7b5ea13dd5e9c1b15ca8f94253ad4a882df19a34b3f2365e78e6e2639ad2e5",
  career_money_study: "8a2b3dac2f1bf7224652bbb85fb2058b94338efd957e58cb6dc6ad12abae7630",
  love_marriage_child: "0bad2eabd22e1ff5f87ee4549d17f2d7784c8bb6d77b2a43a55aec0e28b24db7",
  saju_mbti_compatibility: "db0dc402f5e2c886b30cac6dcd9012a87525d4b96e525f478b909f34153eede2",
  major_fortune: "5cabed87b1fe378712784066cd20409b2d9c3ad0b818802d1fdeacf291fa7a27",
  annual_fortune: "1ca2abd093deb028a1e015f030e845b7e44bfeeb39fbb29aa2d6e6fae3d0c87b",
};
beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(new Date("2026-09-24T03:00:00Z")); });
afterEach(() => { expect(fetch).not.toHaveBeenCalled(); vi.useRealTimers(); });
it.each(PRODUCTS)("%s: unchanged V2 generate → publish → SSR, V3 consumption cannot mutate it", async product => {
  const payload = { productKey: product, productSlug: product === "saju_mbti_compatibility" ? "compatibility" : product.replaceAll("_", "-"),
    ...(product === "saju_mbti_compatibility" ? { personA: p, personB: q, relationshipType: "businessPartner" } : { person: p }),
    userContext: { relationshipStatus: "single", jobStatus: "employee", detailJob: "B2B 소프트웨어 영업기획", focusAreas: [] }, productOptions: product === "annual_fortune" ? { selectedYear: "2026" } : {} };
  const result = await generateProductReport(payload, { enabled: false, reason: "flag_disabled" }, "deterministic_fallback", undefined, { comprehensiveVersion: "v2" });
  expect(result.ok).toBe(true);
  if (!result.ok) return;
  expect(result.externalCalls).toEqual([]);
  expect(validateNewProductPublication(product, result.draft, result.evidencePacket, payload)).toEqual({ ok: true, errors: [] });
  const props = { draft: result.draft, evidencePacket: result.evidencePacket, reportId: "v3-baseline" };
  const html = (() => {
    switch (product) {
      case "saju_mbti_full": return renderToStaticMarkup(createElement(ComprehensiveReportV2View, props as Parameters<typeof ComprehensiveReportV2View>[0]));
      case "career_money_study": return renderToStaticMarkup(createElement(CareerReportView, props as Parameters<typeof CareerReportView>[0]));
      case "love_marriage_child": return renderToStaticMarkup(createElement(LoveMarriageChildReportView, props as Parameters<typeof LoveMarriageChildReportView>[0]));
      case "major_fortune": return renderToStaticMarkup(createElement(MajorFortuneReportView, props as Parameters<typeof MajorFortuneReportView>[0]));
      case "annual_fortune": return renderToStaticMarkup(createElement(AnnualFortuneReportView, props as Parameters<typeof AnnualFortuneReportView>[0]));
      default: return renderToStaticMarkup(createElement(CompatibilityReportView, props as Parameters<typeof CompatibilityReportView>[0]));
    }
  })();
  const before = hash([result.draft, result.evidencePacket, html]);
  const role = product === "saju_mbti_compatibility" ? "personA" : "person";
  const table = getCanonicalNatalTable(result.evidencePacket, role)!;
  expect(table).toBeDefined();
  const natal = adaptNatalTable(table, role);
  for (const feature of table.features) expect(natal.some(e => e.id === `${role}:natal:${feature.id}`)).toBe(true);
  expect(validateEvidence(natal)).toEqual([]);
  const v3 = interpretV3({ evidence: [...natal, ...adaptMbti("INFP", role)], product, subject: role, context: { lifeStatus: "employee", fieldLabel: "영업" } });
  expect(v3.ok).toBe(true);
  if (product === "annual_fortune") {
    const packet = result.evidencePacket as AnnualFortuneEvidencePacket;
    expect(validateEvidence(adaptAnnualFortune(packet))).toEqual([]);
    for (const month of packet.calendarMonths ?? []) for (const segment of month.segments) {
      const facts = adaptMonthSegment(segment);
      expect(validateEvidence(facts)).toEqual([]);
      for (const relation of segment.relationFacts) expect(facts.some(f => f.sourceRefs.includes(relation.id) && f.certainty === relation.certainty)).toBe(true);
    }
  }
  if (product === "major_fortune") expect(validateEvidence(adaptMajorFortune(result.evidencePacket as MajorFortuneEvidencePacket))).toEqual([]);
  expect(hash([result.draft, result.evidencePacket, html])).toBe(before);
  expect(before, product).toBe(GOLDEN[product]);
  if (product !== "saju_mbti_full") {
    const requestedV3 = await generateProductReport(payload, { enabled: false, reason: "flag_disabled" }, "deterministic_fallback", undefined, { comprehensiveVersion: "v3" });
    expect(requestedV3.ok).toBe(true);
    if (requestedV3.ok) expect(hash([requestedV3.draft, requestedV3.evidencePacket])).toBe(hash([result.draft, result.evidencePacket]));
  }
});
