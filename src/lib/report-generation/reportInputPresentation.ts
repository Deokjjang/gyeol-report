import { annualEditionYear } from "../report-knowledge/annualFortuneYearRules";
import type { DevTossCheckoutInputSnapshot } from "../../components/payment/DevTossCheckoutLauncher";
import { FOCUS_AREAS, COMPATIBILITY_ROLE_VERSION, type ReportPersonInputPayload, type ReportInputPayload, type SinglePersonReportInputPayload, type CompatibilityReportInputPayload, type CompatibilityRelationshipType, type RelationshipStatus, type JobStatus, type FocusArea } from "./reportInputTypes";

export type PersonInputState = { name: string; birthDate: string; paidBirthTimeMode: "exact" | "approximate" | "unknown"; birthTime: string; timeBranch: ReportPersonInputPayload["approximateBirthTimeSlot"]; birthTimeUnknown: boolean; gender: string; mbtiType: string };
/** wish(AM 2부 세운 신년판, 선택): 「이루고 싶은 것이나 요즘 고민」 200자 이내. 다른 입력값과 같은 저장·보관·삭제 규칙. */
export type SingleInputState = PersonInputState & { relationshipStatus: string; jobStatus: string; detailedJob: string; focusAreas: readonly string[]; selectedYear: string; wish?: string };
const isFocusArea = (value: string): value is FocusArea => (FOCUS_AREAS as readonly string[]).includes(value);
const ANNUAL_FORTUNE_PRODUCT_KEY = "annual_fortune", MAJOR_FORTUNE_PRODUCT_KEY = "major_fortune", SAJU_MBTI_FULL_PRODUCT_KEY = "saju_mbti_full", CAREER_MONEY_STUDY_PRODUCT_KEY = "career_money_study", LOVE_MARRIAGE_CHILD_PRODUCT_KEY = "love_marriage_child", COMPATIBILITY_PRODUCT_KEY = "saju_mbti_compatibility", COMPATIBILITY_PRODUCT_SLUG = "compatibility";

// Extracted without behavior changes from the existing production input page.
// Both presentations submit the same V3 input contract; clients never pick V4.
export function createReportPersonInputPayload(
  input: PersonInputState,
): ReportPersonInputPayload {
  return {
    name: input.name.trim(),
    birthDate: input.birthDate.trim(),
    birthTimePrecision: input.paidBirthTimeMode,
    birthTime: input.birthTimeUnknown ? "" : input.birthTime.trim(),
    birthTimeUnknown: input.birthTimeUnknown,
    approximateBirthTimeSlot: input.birthTimeUnknown ? "" : input.timeBranch,
    gender: input.gender as ReportPersonInputPayload["gender"],
    mbtiType: input.mbtiType as ReportPersonInputPayload["mbtiType"],
  };
}

/** AM 2부 세운 소망 칸 최대 글자 수. */
export const ANNUAL_WISH_MAX = 200;
export function createSingleProductOptions(
  productKey: string,
  input: Pick<SingleInputState, "selectedYear" | "wish">,
): SinglePersonReportInputPayload["productOptions"] {
  if (productKey === ANNUAL_FORTUNE_PRODUCT_KEY) {
    const wish = (input.wish ?? "").trim().slice(0, ANNUAL_WISH_MAX);
    // 신년판은 한 해만 판다(annualEditionYear) — 예전 초안의 다른 해가 남아 있어도 그 해로.
    void input.selectedYear;
    return {
      selectedYear: String(annualEditionYear()),
      contentVersion: "v3",
      ...(wish ? { wish } : {}),
    };
  }

  if (
    productKey === MAJOR_FORTUNE_PRODUCT_KEY ||
    productKey === SAJU_MBTI_FULL_PRODUCT_KEY ||
    productKey === CAREER_MONEY_STUDY_PRODUCT_KEY ||
    productKey === LOVE_MARRIAGE_CHILD_PRODUCT_KEY
  ) {
    return { contentVersion: "v3" };
  }

  return {};
}

export function buildSinglePersonReportInputPayload(
  product: { productKey: string; slug: string },
  input: SingleInputState,
): SinglePersonReportInputPayload {
  return {
    productKey: product.productKey as SinglePersonReportInputPayload["productKey"],
    productSlug: product.slug as SinglePersonReportInputPayload["productSlug"],
    person: createReportPersonInputPayload(input),
    userContext: {
      relationshipStatus: input.relationshipStatus as RelationshipStatus,
      jobStatus: input.jobStatus as JobStatus,
      detailJob: input.detailedJob.trim(),
      focusAreas: input.focusAreas.filter(isFocusArea),
    },
    productOptions: createSingleProductOptions(product.productKey, input),
  };
}

export function buildCompatibilityReportInputPayload(input: {
  readonly relationshipType: CompatibilityRelationshipType;
  readonly personA: PersonInputState;
  readonly personB: PersonInputState;
}): CompatibilityReportInputPayload {
  return {
    productKey: COMPATIBILITY_PRODUCT_KEY,
    productSlug: COMPATIBILITY_PRODUCT_SLUG,
    relationshipType: input.relationshipType,
    compatibilityRoleVersion: COMPATIBILITY_ROLE_VERSION,
    personA: createReportPersonInputPayload(input.personA),
    personB: createReportPersonInputPayload(input.personB),
  };
}

export function createCheckoutInputSnapshot(input: {
  readonly displayName: string;
  readonly birthDate: string;
  readonly birthTime: string | undefined;
  readonly birthTimeUnknown: boolean;
  readonly gender: string;
  readonly mbtiType: string;
  readonly reportInputPayload?: ReportInputPayload;
}): DevTossCheckoutInputSnapshot {
  const trimmedDisplayName = input.displayName.trim();

  return {
    mbti: input.mbtiType,
    gender: input.gender,
    timezone: "Asia/Seoul",
    birthDate: input.birthDate,
    birthTime: input.birthTime ?? "",
    calendarType: "SOLAR",
    birthTimeUnknown: input.birthTimeUnknown,
    ...(trimmedDisplayName ? { displayName: trimmedDisplayName } : {}),
    ...(input.reportInputPayload === undefined
      ? {}
      : { reportInputPayload: input.reportInputPayload }),
  };
}
