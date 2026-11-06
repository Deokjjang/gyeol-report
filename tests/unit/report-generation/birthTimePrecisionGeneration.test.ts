import type { BirthTimeContexts } from "../../../src/lib/saju/birthTimePrecisionTypes";
import { afterEach, describe, expect, it, vi } from "vitest";
import { prepareProductGenerationFromPayload } from "../../../src/lib/report-generation/productGenerationDispatcher";
import { validateProductPublication } from "../../../src/lib/report-generation/productPublishGate";
import { createProductPreviewSnapshot, type ProductPreviewSnapshotDraft } from "../../../src/lib/report-generation/productPreviewSnapshot";
import { normalizeReportInputPayload } from "../../../src/lib/report-generation/reportInputAdapter";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { ComprehensiveReportV2View } from "../../../src/app/reports/[reportId]/ComprehensiveReportV2View";
import type { ComprehensiveReportV2Draft } from "../../../src/lib/report-generation/comprehensiveReportDraftTypes";

const products = [
  ["saju_mbti_full", "saju-mbti-full"], ["career_money_study", "career-money-study"],
  ["love_marriage_child", "love-marriage-child"], ["saju_mbti_compatibility", "compatibility"],
  ["major_fortune", "major-fortune"], ["annual_fortune", "annual-fortune"],
] as const;
const person = { name: "정밀도 검증", birthDate: "1996-12-06", birthTime: "14:15", birthTimeUnknown: false, approximateBirthTimeSlot: "", gender: "MALE", mbtiType: "ENTJ" };
const options = { annualFortune: { now: () => new Date("2026-09-21T00:00:00Z") } };
function payload(product: typeof products[number], input: object) {
  const [productKey, productSlug] = product;
  return productKey === "saju_mbti_compatibility"
    ? { productKey, productSlug, personA: input, personB: { ...person, name: "B" }, relationshipType: "love" }
    : { productKey, productSlug, person: input, userContext: { relationshipStatus: "single", jobStatus: "employee", detailJob: "기획자", focusAreas: ["직업", "돈"] }, productOptions: { selectedYear: "2026" } };
}
afterEach(() => vi.unstubAllGlobals());
describe("precision through all six product boundaries", () => {
  for (const precision of ["exact", "approximate", "unknown"] as const) {
    it.each(products)(`${precision}: %s preserves evidence and publication requirements`, async (productKey, productSlug) => {
      const network = vi.fn(() => { throw Error("NETWORK_FORBIDDEN"); });
      vi.stubGlobal("fetch", network);
      const input = { ...person, birthTimePrecision: precision, birthTime: precision === "exact" ? "14:15" : "", birthTimeUnknown: precision === "unknown", approximateBirthTimeSlot: precision === "approximate" ? "MISI" : "" };
      const result = await prepareProductGenerationFromPayload(payload([productKey, productSlug] as typeof products[number], input), options);
      expect(result.ok, JSON.stringify(result)).toBe(true);
      if (!result.ok) return;
      expect(validateProductPublication(productKey, result.draft, result.evidencePacket)).toEqual({ ok: true, errors: [] });
      const evidence = result.evidencePacket as {
        birthTimeContexts: BirthTimeContexts;
        participants: { a: { pillars: { hour?: string } } };
        sajuBasis: { fullPillars: { key: string }[] };
        userPillars: { hour?: string };
      };
      const context = evidence.birthTimeContexts[productKey === "saju_mbti_compatibility" ? "personA" : "person"]!;
      expect(context.birthTimePrecision).toBe(precision);
      expect(context.stable.hour).toBe(precision !== "unknown");
      expect(context.confirmed.hour).toEqual(precision === "unknown" ? undefined : { stem: "丁", branch: "未" });
      const snapshot = createProductPreviewSnapshot({ reportId: "precision", createdAtIso: "2026-09-21T00:00:00Z", productKey, productSlug, draft: result.draft as ProductPreviewSnapshotDraft, evidencePacket: evidence });
      expect(snapshot.ok).toBe(true);
      if (snapshot.ok) expect(JSON.parse(JSON.stringify(snapshot.value)).birthTimeContexts).toEqual(evidence.birthTimeContexts);
      if (productKey === "saju_mbti_full") {
        const draft = result.draft as ComprehensiveReportV2Draft;
        expect(Boolean(draft.profileTable.hourPillar)).toBe(precision !== "unknown");
        if (precision === "unknown") {
          const html = renderToStaticMarkup(createElement(ComprehensiveReportV2View, { draft, evidencePacket: evidence }));
          expect(html).toContain("시주는 확정하지 않았습니다");
          expect(html).not.toContain("만세력표는 시주·일주·월주·연주가 모두");
          const forged = { ...draft, profileTable: { ...draft.profileTable, hourPillar: "정미" } };
          expect(validateProductPublication(productKey, forged, evidence).errors).toContain("UNCONFIRMED_HOUR_PUBLISHED");
          const missing = { ...draft, longformReadings: [] };
          expect(validateProductPublication(productKey, missing, evidence).ok).toBe(false);
          expect(validateProductPublication(productKey, draft, { ...evidence, birthTimeContexts: undefined }).ok).toBe(false);
        }
      } else if (productKey === "saju_mbti_compatibility") expect(Boolean(evidence.participants.a.pillars.hour)).toBe(precision !== "unknown");
      else if (productKey === "love_marriage_child") expect(evidence.sajuBasis.fullPillars.some((p: { key: string }) => p.key === "hour")).toBe(precision !== "unknown");
      else expect(Boolean(evidence.userPillars.hour)).toBe(precision !== "unknown");
      expect(network).not.toHaveBeenCalled();
    });
  }
  it.each(products)("%s rejects unstable input before drafting and retains candidates", async (productKey, productSlug) => {
    const network = vi.fn(() => { throw Error("NETWORK_FORBIDDEN"); });
    vi.stubGlobal("fetch", network);
    for (const input of [
      // v5-lmt: JASI is one day under the unified 子 rule; the solar slots holding 입춘/경칩 are SINSI/SASI.
      { ...person, birthDate: "2024-03-05", birthTime: "", approximateBirthTimeSlot: "SASI" },
      { ...person, birthDate: "2024-02-04", birthTime: "", approximateBirthTimeSlot: "SINSI" },
      { ...person, birthDate: "2024-02-04", birthTime: "", birthTimeUnknown: true },
    ]) {
      const result = await prepareProductGenerationFromPayload(payload([productKey, productSlug] as typeof products[number], input), options);
      expect(result).toMatchObject({ ok: false, error: { code: "INVALID_REPORT_INPUT", birthTimeContext: { stable: { hour: expect.any(Boolean) } } } });
      expect(result).not.toHaveProperty("draft");
    }
    expect(network).not.toHaveBeenCalled();
  });
  it.each([
    { birthTimePrecision: "exact", birthTime: "" },
    { birthTimePrecision: "approximate", birthTime: "", approximateBirthTimeSlot: "" },
    { birthTimePrecision: "unknown", birthTimeUnknown: true },
    { approximateBirthTimeSlot: "JINSI" },
  ])("rejects invalid payload combinations on the server %j", (patch) => {
    expect(normalizeReportInputPayload(payload(products[0], { ...person, ...patch }))).toMatchObject({ ok: false, error: "INVALID_BIRTH_TIME_PRECISION" });
  });
});
