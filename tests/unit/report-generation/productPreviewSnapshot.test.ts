import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  createProductPreviewSnapshot,
  isProductPreviewSnapshot,
  PRODUCT_PREVIEW_PRODUCT_TYPES,
  type ProductPreviewSnapshotDraft,
} from "../../../src/lib/report-generation/productPreviewSnapshot";
import type { CompatibilityReportDraft } from "../../../src/lib/report-generation/compatibilityReportDraftTypes";

const sourcePath = join(
  process.cwd(),
  "src/lib/report-generation/productPreviewSnapshot.ts",
);
const source = readFileSync(sourcePath, "utf8");

const compatibilityDraft = {
  version: "compatibility_v1_draft",
  productType: "saju_mbti_compatibility",
  productVersion: "1.0",
  relationshipType: "love",
  personALabel: "A",
  personBLabel: "B",
  openingTitle: "A님과 B님의 궁합",
  openingSummary: "요약",
  coreLine: "핵심",
  scoreSummary: {
    totalScore: 70,
    scoreLabel: "조율형",
    scoreCaution: "참고값",
    breakdown: {
      attraction: 70,
      communication: 70,
      lifestyleRhythm: 70,
      conflictRecovery: 70,
      longTermStability: 70,
      growthComplement: 70,
    },
  },
  chartComparison: {
    personA: {},
    personB: {},
  },
  keyCompatibilityPoints: {
    attractionPoints: ["끌림"],
    strengthPoints: ["강점"],
    frictionPoints: ["마찰"],
    relationshipRules: ["규칙"],
  },
  relationshipAnalysis: {
    connectionSummary: "연결",
    firstImpression: "첫인상",
    stayingPower: "지속력",
    frictionPoints: ["마찰"],
    categoryReading: "관계 해석",
    aToBFatigue: "A 피로",
    bToAFatigue: "B 피로",
    communicationRecovery: "회복",
    roleMoneyLifeRhythm: "생활",
    categorySpecificAdvice: ["조언"],
    timingCautions: ["타이밍"],
    repairStrategy: ["유지"],
    riskManagement: ["리스크"],
  },
  chapters: [],
  finalAdvice: ["조언"],
  safetyNotes: ["안내"],
} as unknown as CompatibilityReportDraft;

function createCompatibilitySnapshot() {
  return createProductPreviewSnapshot({
    reportId: "preview-report-1",
    createdAtIso: "2026-07-07T00:00:00.000Z",
    productKey: "saju_mbti_compatibility",
    productSlug: "compatibility",
    draft: compatibilityDraft,
  });
}

describe("product preview snapshot contract", () => {
  it("supports expected product types", () => {
    expect(PRODUCT_PREVIEW_PRODUCT_TYPES).toEqual([
      "career_money_study",
      "love_marriage_child",
      "saju_mbti_compatibility",
      "major_fortune",
      "annual_fortune",
    ]);
  });

  it("creates a compatibility preview snapshot", () => {
    const result = createCompatibilitySnapshot();

    expect(result).toEqual({
      ok: true,
      value: {
        id: "preview-report-1",
        reportId: "preview-report-1",
        createdAtIso: "2026-07-07T00:00:00.000Z",
        productKey: "saju_mbti_compatibility",
        productSlug: "compatibility",
        productType: "saju_mbti_compatibility",
        productVersion: "1.0",
        draft: compatibilityDraft,
        access: {
          mode: "preview",
          isPaid: false,
          isUnlocked: false,
        },
      },
    });
  });

  it("rejects product key, slug, and type mismatches", () => {
    expect(
      createProductPreviewSnapshot({
        reportId: "preview-report-1",
        createdAtIso: "2026-07-07T00:00:00.000Z",
        productKey: "career_money_study",
        productSlug: "compatibility",
        draft: compatibilityDraft,
      }),
    ).toEqual({
      ok: false,
      error: "PRODUCT_IDENTITY_MISMATCH",
    });

    expect(
      createProductPreviewSnapshot({
        reportId: "preview-report-1",
        createdAtIso: "2026-07-07T00:00:00.000Z",
        productKey: "saju_mbti_compatibility",
        productSlug: "annual-fortune",
        draft: compatibilityDraft,
      }),
    ).toEqual({
      ok: false,
      error: "INVALID_PRODUCT_SLUG",
    });
  });

  it("rejects draft productType mismatch and missing version markers", () => {
    expect(
      createProductPreviewSnapshot({
        reportId: "preview-report-1",
        createdAtIso: "2026-07-07T00:00:00.000Z",
        productKey: "saju_mbti_compatibility",
        productSlug: "compatibility",
        draft: {
          ...compatibilityDraft,
          productType: "annual_fortune",
        } as ProductPreviewSnapshotDraft,
      }),
    ).toEqual({
      ok: false,
      error: "PRODUCT_IDENTITY_MISMATCH",
    });

    expect(
      createProductPreviewSnapshot({
        reportId: "preview-report-1",
        createdAtIso: "2026-07-07T00:00:00.000Z",
        productKey: "saju_mbti_compatibility",
        productSlug: "compatibility",
        draft: {
          ...compatibilityDraft,
          productVersion: "",
        } as ProductPreviewSnapshotDraft,
      }),
    ).toEqual({
      ok: false,
      error: "DRAFT_PRODUCT_VERSION_MISSING",
    });
  });

  it("keeps evidencePacket optional but preserved when provided", () => {
    const withoutEvidence = createCompatibilitySnapshot();
    const withEvidence = createProductPreviewSnapshot({
      reportId: "preview-report-2",
      createdAtIso: "2026-07-07T00:00:00.000Z",
      productKey: "saju_mbti_compatibility",
      productSlug: "compatibility",
      draft: compatibilityDraft,
      evidencePacket: {
        productType: "saju_mbti_compatibility",
      },
    });

    expect(withoutEvidence.ok).toBe(true);
    if (withoutEvidence.ok) {
      expect(withoutEvidence.value).not.toHaveProperty("evidencePacket");
    }
    expect(withEvidence).toMatchObject({
      ok: true,
      value: {
        evidencePacket: {
          productType: "saju_mbti_compatibility",
        },
      },
    });
  });

  it("guards product preview snapshot shape", () => {
    const result = createCompatibilitySnapshot();

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(isProductPreviewSnapshot(result.value)).toBe(true);
    expect(
      isProductPreviewSnapshot({
        ...result.value,
        access: {
          mode: "preview",
          isPaid: true,
          isUnlocked: false,
        },
      }),
    ).toBe(false);
    expect(
      isProductPreviewSnapshot({
        version: "v1",
        title: "종합 리포트",
        sections: [],
      }),
    ).toBe(false);
  });

  it("does not import API, persistence, payment, supabase, writer, or call Date.now", () => {
    const forbiddenMarkers = [
      "api/reports",
      "persistence",
      "payment",
      "supabase",
      "openai",
      "Date.now",
    ];

    for (const marker of forbiddenMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
