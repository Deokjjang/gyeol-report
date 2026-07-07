import type { AnnualFortuneReportDraft } from "./annualFortuneReportDraftTypes";
import type { CareerReportDraft } from "./careerReportDraftTypes";
import type { ComprehensiveReportV2Draft } from "./comprehensiveReportDraftTypes";
import type { CompatibilityReportDraft } from "./compatibilityReportDraftTypes";
import type { LoveMarriageChildReportDraft } from "./loveMarriageChildReportDraftTypes";
import type { MajorFortuneReportDraft } from "./majorFortuneReportDraftTypes";
import type {
  ReportProductKey,
  ReportProductSlug,
} from "./reportInputTypes";

export const PRODUCT_PREVIEW_PRODUCT_TYPES = [
  "career_money_study",
  "love_marriage_child",
  "saju_mbti_compatibility",
  "major_fortune",
  "annual_fortune",
  "saju_mbti_full",
] as const;

export type ProductPreviewProductType =
  (typeof PRODUCT_PREVIEW_PRODUCT_TYPES)[number];

export type ComprehensiveV2ProductPreviewDraft =
  ComprehensiveReportV2Draft & {
    readonly productVersion: "v2";
  };

export type ProductPreviewSnapshotDraft =
  | CareerReportDraft
  | LoveMarriageChildReportDraft
  | CompatibilityReportDraft
  | MajorFortuneReportDraft
  | AnnualFortuneReportDraft
  | ComprehensiveV2ProductPreviewDraft;

export type ProductPreviewSnapshotAccess = {
  readonly mode: "preview";
  readonly isPaid: false;
  readonly isUnlocked: false;
};

export type ProductPreviewSnapshot = {
  readonly id: string;
  readonly reportId: string;
  readonly createdAtIso: string;
  readonly productKey: ProductPreviewProductType;
  readonly productSlug: ReportProductSlug;
  readonly productType: ProductPreviewProductType;
  readonly productVersion: string;
  readonly draft: ProductPreviewSnapshotDraft;
  readonly evidencePacket?: unknown;
  readonly access: ProductPreviewSnapshotAccess;
};

export type ProductPreviewSnapshotErrorCode =
  | "INVALID_PRODUCT_KEY"
  | "INVALID_PRODUCT_SLUG"
  | "INVALID_PRODUCT_TYPE"
  | "PRODUCT_IDENTITY_MISMATCH"
  | "DRAFT_PRODUCT_TYPE_MISMATCH"
  | "DRAFT_VERSION_MISSING"
  | "DRAFT_PRODUCT_VERSION_MISSING";

export type ProductPreviewSnapshotResult =
  | {
      readonly ok: true;
      readonly value: ProductPreviewSnapshot;
    }
  | {
      readonly ok: false;
      readonly error: ProductPreviewSnapshotErrorCode;
    };

export type CreateProductPreviewSnapshotParams = {
  readonly id?: string;
  readonly reportId: string;
  readonly createdAtIso: string;
  readonly productKey: ProductPreviewProductType;
  readonly productSlug: ReportProductSlug;
  readonly draft: ProductPreviewSnapshotDraft;
  readonly evidencePacket?: unknown;
};

const productSlugByType = {
  career_money_study: "career-money-study",
  love_marriage_child: "love-marriage-child",
  saju_mbti_compatibility: "compatibility",
  major_fortune: "major-fortune",
  annual_fortune: "annual-fortune",
  saju_mbti_full: "saju-mbti-full",
} as const satisfies Record<ProductPreviewProductType, ReportProductSlug>;

export function createProductPreviewSnapshot(
  params: CreateProductPreviewSnapshotParams,
): ProductPreviewSnapshotResult {
  if (!isProductPreviewProductType(params.productKey)) {
    return { ok: false, error: "INVALID_PRODUCT_KEY" };
  }

  const productType = getDraftProductType(params.draft);
  if (!isProductPreviewProductType(productType)) {
    return { ok: false, error: "INVALID_PRODUCT_TYPE" };
  }

  if (params.productKey !== productType) {
    return { ok: false, error: "PRODUCT_IDENTITY_MISMATCH" };
  }

  if (params.productSlug !== productSlugByType[params.productKey]) {
    return { ok: false, error: "INVALID_PRODUCT_SLUG" };
  }

  if (productType !== params.draft.productType) {
    return { ok: false, error: "DRAFT_PRODUCT_TYPE_MISMATCH" };
  }

  if (typeof params.draft.version !== "string" || params.draft.version.trim() === "") {
    return { ok: false, error: "DRAFT_VERSION_MISSING" };
  }

  if (
    typeof params.draft.productVersion !== "string" ||
    params.draft.productVersion.trim() === ""
  ) {
    return { ok: false, error: "DRAFT_PRODUCT_VERSION_MISSING" };
  }

  return {
    ok: true,
    value: {
      id: params.id ?? params.reportId,
      reportId: params.reportId,
      createdAtIso: params.createdAtIso,
      productKey: params.productKey,
      productSlug: params.productSlug,
      productType,
      productVersion: params.draft.productVersion,
      draft: params.draft,
      ...(params.evidencePacket === undefined
        ? {}
        : { evidencePacket: params.evidencePacket }),
      access: {
        mode: "preview",
        isPaid: false,
        isUnlocked: false,
      },
    },
  };
}

export function isProductPreviewSnapshot(
  value: unknown,
): value is ProductPreviewSnapshot {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.reportId === "string" &&
    typeof value.createdAtIso === "string" &&
    isProductPreviewProductType(value.productKey) &&
    isProductPreviewProductType(value.productType) &&
    value.productKey === value.productType &&
    value.productSlug === productSlugByType[value.productType] &&
    typeof value.productVersion === "string" &&
    isProductPreviewDraft(value.draft) &&
    value.draft.productType === value.productType &&
    value.draft.productVersion === value.productVersion &&
    isRecord(value.access) &&
    value.access.mode === "preview" &&
    value.access.isPaid === false &&
    value.access.isUnlocked === false
  );
}

function isProductPreviewDraft(value: unknown): value is ProductPreviewSnapshotDraft {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isProductPreviewProductType(value.productType) &&
    typeof value.version === "string" &&
    typeof value.productVersion === "string"
  );
}

function getDraftProductType(draft: ProductPreviewSnapshotDraft): unknown {
  return draft.productType;
}

function isProductPreviewProductType(
  value: unknown,
): value is ProductPreviewProductType {
  return (
    value === "career_money_study" ||
    value === "love_marriage_child" ||
    value === "saju_mbti_compatibility" ||
    value === "major_fortune" ||
    value === "annual_fortune" ||
    value === "saju_mbti_full"
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export type { ReportProductKey, ReportProductSlug };
