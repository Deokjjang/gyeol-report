import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  createProductPreviewSnapshot,
  isProductPreviewSnapshot,
  PRODUCT_PREVIEW_PRODUCT_TYPES,
  type ComprehensiveV2ProductPreviewDraft,
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

const comprehensiveV2Draft = {
  version: "comprehensive_v2_draft",
  productType: "saju_mbti_full",
  productVersion: "v2",
  openingTitle: "덕민님의 종합 리포트",
  openingSummary: "사주 원국을 먼저 보고 MBTI는 행동 발현 방식으로 연결합니다.",
  coreLine: "명리 구조와 ENTJ 성향이 함께 읽힙니다.",
  profileTable: {
    fiveElementSummary: ["목 2", "화 0", "토 4", "금 2", "수 0"],
    excessiveElements: ["토 과다"],
    missingElements: ["화 부족", "수 부족"],
    tenGodSummary: ["정재", "편재"],
    specialPatterns: ["재다신약"],
    sinsal: ["현침살"],
    gwiin: ["천을귀인"],
    mbti: "ENTJ",
  },
  chapters: [],
  finalAdvice: "자기이해용 참고 기준입니다.",
  safetyNotes: ["확정 예언이 아닙니다."],
} as unknown as ComprehensiveV2ProductPreviewDraft;

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
      "saju_mbti_full",
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

  it("creates a comprehensive V2 preview snapshot", () => {
    const result = createProductPreviewSnapshot({
      reportId: "preview-report-comprehensive-v2",
      createdAtIso: "2026-07-07T00:00:00.000Z",
      productKey: "saju_mbti_full",
      productSlug: "saju-mbti-full",
      draft: comprehensiveV2Draft,
    });

    expect(result).toMatchObject({
      ok: true,
      value: {
        reportId: "preview-report-comprehensive-v2",
        productKey: "saju_mbti_full",
        productSlug: "saju-mbti-full",
        productType: "saju_mbti_full",
        productVersion: "v2",
        draft: {
          version: "comprehensive_v2_draft",
          productType: "saju_mbti_full",
          productVersion: "v2",
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
