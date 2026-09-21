import { afterEach, describe, expect, it, vi } from "vitest";
import { SAJU_CALENDAR_VERSION } from "../../../src/lib/saju/calendarVersion";
import { prepareProductGenerationFromPayload } from "../../../src/lib/report-generation/productGenerationDispatcher";
import { validateProductPublication } from "../../../src/lib/report-generation/productPublishGate";
import { createProductPreviewSnapshot, isProductPreviewSnapshot, type ProductPreviewSnapshotDraft } from "../../../src/lib/report-generation/productPreviewSnapshot";
import type { ReportInputPayload } from "../../../src/lib/report-generation/reportInputAdapter";

const person = {
  name: "달력 검증", birthDate: "2024-02-04", birthTime: "17:28",
  birthTimeUnknown: false, approximateBirthTimeSlot: "", gender: "MALE", mbtiType: "ENTJ",
} as const;
// HKO date/term golden + existing product hour rule, NOT generated expectations.
const expectedPillars = { year: "甲辰", month: "丙寅", day: "戊戌", hour: "辛酉" };
const products = [
  ["saju_mbti_full", "saju-mbti-full"],
  ["career_money_study", "career-money-study"],
  ["love_marriage_child", "love-marriage-child"],
  ["saju_mbti_compatibility", "compatibility"],
  ["major_fortune", "major-fortune"],
  ["annual_fortune", "annual-fortune"],
] as const;

afterEach(() => vi.unstubAllGlobals());

describe("canonical calendar through six deterministic product pipelines", () => {
  it.each(products)("preserves corrected pillars/version in %s snapshot", async (productKey, productSlug) => {
    const fetchSpy = vi.fn(() => { throw new Error("TEST_NETWORK_FORBIDDEN"); });
    vi.stubGlobal("fetch", fetchSpy);
    const payload: ReportInputPayload = productKey === "saju_mbti_compatibility" ? {
      productKey, productSlug: "compatibility", relationshipType: "love",
      personA: person,
      personB: { ...person, name: "B", birthDate: "1996-12-06", birthTime: "14:15" },
    } : {
      productKey, productSlug: productSlug as Exclude<typeof productSlug, "compatibility">, person,
      userContext: { relationshipStatus: "single", jobStatus: "employee", detailJob: "서비스 기획자", focusAreas: ["직업", "돈"] },
      productOptions: productKey === "annual_fortune" ? { selectedYear: "2026" } : {},
    };
    const result = await prepareProductGenerationFromPayload(payload, {
      careerMoneyStudy: { writer: { enabled: false } },
      loveMarriageChild: { writer: { enabled: false } },
      compatibility: { writer: { enabled: false } },
      comprehensiveV2: { writer: { enabled: false } },
      majorFortune: { writer: { enabled: false } },
      annualFortune: { writer: { enabled: false }, now: () => new Date("2026-09-21T00:00:00Z") },
    });
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("Expected deterministic generation success");
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(validateProductPublication(productKey, result.draft, result.evidencePacket)).toEqual({ ok: true, errors: [] });
    expect(result.evidencePacket).toMatchObject({ calendarCalculationVersion: SAJU_CALENDAR_VERSION });
    if (productKey === "saju_mbti_full") {
      expect(result.draft).toMatchObject({ profileTable: {
        yearPillar: "갑진", monthPillar: "병인", dayPillar: "무술일주", hourPillar: "신유",
      } });
    } else if (productKey === "love_marriage_child") {
      expect(result.evidencePacket).toMatchObject({ sajuBasis: {
        dayPillar: "戊戌", fullPillars: Object.entries(expectedPillars).map(([key, pillar]) => ({ key, pillar })),
      } });
    } else if (productKey === "saju_mbti_compatibility") {
      expect(result.evidencePacket).toMatchObject({ participants: {
        a: { pillars: expectedPillars },
        b: { pillars: { year: "丙子", month: "己亥", day: "丁丑", hour: "丁未" } },
      } });
    } else {
      // Only natal pillars are asserted here; major-cycle fixtures are a separate P0.
      expect(result.evidencePacket).toMatchObject({ userPillars: expectedPillars });
    }
    const params = {
      reportId: "calendar-test", createdAtIso: "2026-09-21T00:00:00Z",
      productKey, productSlug, draft: result.draft as ProductPreviewSnapshotDraft,
    };
    const snapshot = createProductPreviewSnapshot({ ...params, evidencePacket: result.evidencePacket });
    expect(snapshot.ok).toBe(true);
    if (!snapshot.ok) throw new Error("Expected snapshot success");
    const persisted = JSON.parse(JSON.stringify(snapshot.value));
    expect(isProductPreviewSnapshot(persisted)).toBe(true);
    expect(persisted.calendarCalculationVersion).toBe(SAJU_CALENDAR_VERSION);
    expect(persisted.evidencePacket).toEqual(result.evidencePacket);
    expect(persisted.draft).toEqual(JSON.parse(JSON.stringify(result.draft)));

    // Rewrapping unversioned historical evidence must not claim a new engine.
    const legacy = createProductPreviewSnapshot({ ...params, evidencePacket: { historical: true } });
    expect(legacy.ok).toBe(true);
    if (legacy.ok) expect(legacy.value).not.toHaveProperty("calendarCalculationVersion");
  });
});
