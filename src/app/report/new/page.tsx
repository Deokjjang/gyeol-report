"use client";

import { use, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";

import DevTossCheckoutLauncher, {
  type DevTossCheckoutInputSnapshot,
  isDevTossCheckoutInputComplete,
} from "../../../components/payment/DevTossCheckoutLauncher";
import { GYEOL_PRODUCTS } from "../../../lib/product/gyeolProducts";
import type {
  CompatibilityRelationshipType,
  CompatibilityReportInputPayload,
  FocusArea,
  JobStatus,
  RelationshipStatus,
  ReportInputPayload,
  ReportPersonInputPayload,
  SinglePersonReportInputPayload,
} from "../../../lib/report-generation/reportInputTypes";

const ACTIVE_REPORT_PRODUCT = GYEOL_PRODUCTS[0];
const CAREER_MONEY_STUDY_PRODUCT_KEY = "career_money_study";
const CAREER_MONEY_STUDY_PRODUCT_SLUG = "career-money-study";
const LOVE_MARRIAGE_CHILD_PRODUCT_KEY = "love_marriage_child";
const LOVE_MARRIAGE_CHILD_PRODUCT_SLUG = "love-marriage-child";
const COMPATIBILITY_PRODUCT_KEY = "saju_mbti_compatibility";
const COMPATIBILITY_PRODUCT_SLUG = "compatibility";
const MAJOR_FORTUNE_PRODUCT_KEY = "major_fortune";
const MAJOR_FORTUNE_PRODUCT_SLUG = "major-fortune";
const ANNUAL_FORTUNE_PRODUCT_KEY = "annual_fortune";
const ANNUAL_FORTUNE_PRODUCT_SLUG = "annual-fortune";
const SAJU_MBTI_FULL_PRODUCT_KEY = "saju_mbti_full";
const SAJU_MBTI_FULL_PRODUCT_SLUG = "saju-mbti-full";
const ACTIVE_REPORT_LIST_PRICE_LABEL_KO = "정가 1,290원";
const ACTIVE_REPORT_SALE_PRICE_LABEL_KO = "런칭가 990원";
const ACTIVE_REPORT_PAYMENT_PRICE_LABEL_KO = "결제금액 990원";
const ACTIVE_REPORT_FORMAT_LABEL_KO = "자동 생성 디지털 리포트";
const CHECKOUT_CTA_LABEL_KO = "990원 결제하고 리포트 생성하기";
const REQUIRED_CHECKOUT_INPUT_MESSAGE_KO =
  "리포트 생성을 위해 필요한 정보를 먼저 입력해 주세요.";
const SINGLE_PRODUCT_CONTEXT_NOTICE_KO =
  "현재 연애 상태, 직업 상태, 세부 직업은 계산 원인이 아니라 해석을 현실 장면으로 바꾸는 참고 정보입니다.";
const COMPATIBILITY_REQUIRED_INPUT_MESSAGE_KO =
  "A/B 이름과 생년월일, 관계 카테고리를 입력해 주세요.";
const COMPATIBILITY_PREVIEW_CREATE_ERROR_MESSAGE_KO =
  "궁합 리포트 미리보기를 생성하지 못했습니다. 잠시 후 다시 시도해 주세요.";
const COMPREHENSIVE_V2_REQUIRED_INPUT_MESSAGE_KO =
  "이름과 생년월일을 입력해 주세요.";
const COMPREHENSIVE_V2_PREVIEW_CREATE_ERROR_MESSAGE_KO =
  "종합 리포트 미리보기를 생성하지 못했습니다. 잠시 후 다시 시도해 주세요.";
const SINGLE_PRODUCT_PREVIEW_CREATE_ERROR_MESSAGE_KO =
  "리포트 미리보기를 생성하지 못했습니다. 잠시 후 다시 시도해 주세요.";
const REPORT_CREATE_API_PATH = "/api/reports/create";
const DEV_TOSS_CHECKOUT_LAUNCHER_UI_ENABLED =
  process.env.NEXT_PUBLIC_TOSS_CHECKOUT_LAUNCHER_UI_ENABLED === "1";

type NewReportPageSearchParams = {
  readonly product?: string | readonly string[];
};

type NewReportPageProps = {
  readonly searchParams?: Promise<NewReportPageSearchParams>;
};

type SelectedReportProduct = {
  readonly productKey: string;
  readonly slug: string;
  readonly nameKo: string;
  readonly fullNameKo: string;
  readonly inputTitleKo: string;
  readonly introKo: string;
  readonly formatLabelKo: string;
  readonly deliveryTypeKo: string;
  readonly statusLabelKo: string;
  readonly isPurchasable: boolean;
  readonly listPriceKo: string | null;
  readonly priceKo: string | null;
};

const EMPTY_REPORT_SEARCH_PARAMS = Promise.resolve(
  {} satisfies NewReportPageSearchParams,
);

const DEFAULT_SELECTED_REPORT_PRODUCT = {
  productKey: ACTIVE_REPORT_PRODUCT.productType,
  slug: ACTIVE_REPORT_PRODUCT.slug,
  nameKo: ACTIVE_REPORT_PRODUCT.nameKo,
  fullNameKo: ACTIVE_REPORT_PRODUCT.fullNameKo,
  inputTitleKo: "종합 리포트 입력",
  introKo:
    "생년월일시와 MBTI를 입력하고 확인한 뒤 990원 결제창으로 이동합니다. 리포트는 결제 승인 후 생성됩니다. 자동 생성 디지털 리포트이며 상담이 아닌 참고용 리포트입니다.",
  formatLabelKo: ACTIVE_REPORT_FORMAT_LABEL_KO,
  deliveryTypeKo: ACTIVE_REPORT_PRODUCT.deliveryTypeKo,
  statusLabelKo: "구매 가능",
  isPurchasable: ACTIVE_REPORT_PRODUCT.isPurchasable,
  listPriceKo: ACTIVE_REPORT_PRODUCT.listPriceKo,
  priceKo: ACTIVE_REPORT_PRODUCT.priceKo,
} as const satisfies SelectedReportProduct;

const CAREER_MONEY_STUDY_SELECTED_REPORT_PRODUCT = {
  productKey: CAREER_MONEY_STUDY_PRODUCT_KEY,
  slug: CAREER_MONEY_STUDY_PRODUCT_SLUG,
  nameKo: "직업·커리어·돈·학업 리포트",
  fullNameKo: "직업·커리어·돈·학업 리포트",
  inputTitleKo: "직업·커리어·돈·학업 리포트 입력",
  introKo:
    `출시 전 미리보기 입력 흐름입니다. ${SINGLE_PRODUCT_CONTEXT_NOTICE_KO}`,
  formatLabelKo: ACTIVE_REPORT_FORMAT_LABEL_KO,
  deliveryTypeKo: "미리보기 입력 흐름",
  statusLabelKo: "준비 중 · 미리보기 가능",
  isPurchasable: false,
  listPriceKo: null,
  priceKo: null,
} as const satisfies SelectedReportProduct;

const LOVE_MARRIAGE_CHILD_SELECTED_REPORT_PRODUCT = {
  productKey: LOVE_MARRIAGE_CHILD_PRODUCT_KEY,
  slug: LOVE_MARRIAGE_CHILD_PRODUCT_SLUG,
  nameKo: "연애·결혼·자녀 리포트",
  fullNameKo: "연애·결혼·자녀 리포트",
  inputTitleKo: "연애·결혼·자녀 리포트 입력",
  introKo:
    `출시 전 미리보기 입력 흐름입니다. ${SINGLE_PRODUCT_CONTEXT_NOTICE_KO}`,
  formatLabelKo: ACTIVE_REPORT_FORMAT_LABEL_KO,
  deliveryTypeKo: "미리보기 입력 흐름",
  statusLabelKo: "준비 중 · 미리보기 가능",
  isPurchasable: false,
  listPriceKo: null,
  priceKo: null,
} as const satisfies SelectedReportProduct;

const COMPATIBILITY_SELECTED_REPORT_PRODUCT = {
  productKey: COMPATIBILITY_PRODUCT_KEY,
  slug: COMPATIBILITY_PRODUCT_SLUG,
  nameKo: "궁합 리포트",
  fullNameKo: "궁합 리포트",
  inputTitleKo: "궁합 리포트 입력",
  introKo:
    "궁합 리포트 입력 흐름 준비 중입니다. 두 사람의 생년월일, 출생시간, MBTI, 관계 카테고리를 입력하는 전용 흐름으로 연결될 예정입니다.",
  formatLabelKo: ACTIVE_REPORT_FORMAT_LABEL_KO,
  deliveryTypeKo: "미리보기 입력 흐름",
  statusLabelKo: "준비 중 · 미리보기 가능",
  isPurchasable: false,
  listPriceKo: null,
  priceKo: null,
} as const satisfies SelectedReportProduct;

const MAJOR_FORTUNE_SELECTED_REPORT_PRODUCT = {
  productKey: MAJOR_FORTUNE_PRODUCT_KEY,
  slug: MAJOR_FORTUNE_PRODUCT_SLUG,
  nameKo: "대운 리포트",
  fullNameKo: "대운 리포트",
  inputTitleKo: "대운 리포트 입력",
  introKo:
    `대운은 입력된 생년월일과 출생시간 기반의 10년 흐름을 보는 리포트입니다. ${SINGLE_PRODUCT_CONTEXT_NOTICE_KO}`,
  formatLabelKo: ACTIVE_REPORT_FORMAT_LABEL_KO,
  deliveryTypeKo: "미리보기 입력 흐름",
  statusLabelKo: "준비 중 · 미리보기 가능",
  isPurchasable: false,
  listPriceKo: null,
  priceKo: null,
} as const satisfies SelectedReportProduct;

const ANNUAL_FORTUNE_SELECTED_REPORT_PRODUCT = {
  productKey: ANNUAL_FORTUNE_PRODUCT_KEY,
  slug: ANNUAL_FORTUNE_PRODUCT_SLUG,
  nameKo: "세운 리포트",
  fullNameKo: "세운 리포트",
  inputTitleKo: "세운 리포트 입력",
  introKo:
    `세운은 선택한 한 해의 흐름을 보는 리포트입니다. ${SINGLE_PRODUCT_CONTEXT_NOTICE_KO}`,
  formatLabelKo: ACTIVE_REPORT_FORMAT_LABEL_KO,
  deliveryTypeKo: "미리보기 입력 흐름",
  statusLabelKo: "준비 중 · 미리보기 가능",
  isPurchasable: false,
  listPriceKo: null,
  priceKo: null,
} as const satisfies SelectedReportProduct;

const SAJU_MBTI_FULL_SELECTED_REPORT_PRODUCT = {
  productKey: SAJU_MBTI_FULL_PRODUCT_KEY,
  slug: SAJU_MBTI_FULL_PRODUCT_SLUG,
  nameKo: "종합 리포트",
  fullNameKo: "사주×MBTI 종합 리포트",
  inputTitleKo: "종합 리포트 입력",
  introKo:
    `명리 구조와 MBTI 행동 패턴을 함께 읽는 종합 V2 미리보기 입력 흐름입니다. ${SINGLE_PRODUCT_CONTEXT_NOTICE_KO}`,
  formatLabelKo: ACTIVE_REPORT_FORMAT_LABEL_KO,
  deliveryTypeKo: "미리보기 입력 흐름",
  statusLabelKo: "준비 중 · 미리보기 가능",
  isPurchasable: false,
  listPriceKo: null,
  priceKo: null,
} as const satisfies SelectedReportProduct;

const mbtiTypes = [
  "INTJ",
  "INTP",
  "ENTJ",
  "ENTP",
  "INFJ",
  "INFP",
  "ENFJ",
  "ENFP",
  "ISTJ",
  "ISFJ",
  "ESTJ",
  "ESFJ",
  "ISTP",
  "ISFP",
  "ESTP",
  "ESFP",
] as const;

type ReportInputStep = 0 | 1 | 2 | 3;
type BirthTimeMode = "exact" | "branch" | "unknown";

const reportInputSteps = [
  { step: 0, labelKo: "1단계", titleKo: "이름·생년월일" },
  { step: 1, labelKo: "2단계", titleKo: "출생시간" },
  { step: 2, labelKo: "3단계", titleKo: "성별·MBTI" },
  { step: 3, labelKo: "4단계", titleKo: "확인 후 결제" },
] as const satisfies readonly {
  readonly step: ReportInputStep;
  readonly labelKo: string;
  readonly titleKo: string;
}[];

const timeBranches = [
  { value: "JASI", labelKo: "자시 23:00~00:59", representativeTime: "00:30" },
  { value: "CHUKSI", labelKo: "축시 01:00~02:59", representativeTime: "02:00" },
  { value: "INSI", labelKo: "인시 03:00~04:59", representativeTime: "04:00" },
  { value: "MYOSI", labelKo: "묘시 05:00~06:59", representativeTime: "06:00" },
  { value: "JINSI", labelKo: "진시 07:00~08:59", representativeTime: "08:00" },
  { value: "SASI", labelKo: "사시 09:00~10:59", representativeTime: "10:00" },
  { value: "OSI", labelKo: "오시 11:00~12:59", representativeTime: "12:00" },
  { value: "MISI", labelKo: "미시 13:00~14:59", representativeTime: "14:00" },
  { value: "SINSI", labelKo: "신시 15:00~16:59", representativeTime: "16:00" },
  { value: "YUSI", labelKo: "유시 17:00~18:59", representativeTime: "18:00" },
  { value: "SULSI", labelKo: "술시 19:00~20:59", representativeTime: "20:00" },
  { value: "HAESI", labelKo: "해시 21:00~22:59", representativeTime: "22:00" },
] as const;

type TimeBranchValue = (typeof timeBranches)[number]["value"];
type TimeBranchSelection = TimeBranchValue | "";

type CompatibilityPersonInputState = {
  readonly name: string;
  readonly birthDate: string;
  readonly birthTime: string;
  readonly timeBranch: TimeBranchSelection;
  readonly birthTimeUnknown: boolean;
  readonly gender: string;
  readonly mbtiType: string;
};

const compatibilityRelationshipOptions = [
  { value: "love", labelKo: "연애" },
  { value: "marriage", labelKo: "결혼" },
  { value: "parentChild", labelKo: "부모·자식" },
  { value: "coworker", labelKo: "직장 동료" },
  { value: "managerReport", labelKo: "상사·부하" },
  { value: "businessPartner", labelKo: "사업·협업" },
  { value: "friendship", labelKo: "친구·인간관계" },
] as const;

type CompatibilityRelationshipTypeSelection =
  CompatibilityRelationshipType;

type AnnualFortuneInputState = {
  readonly name: string;
  readonly birthDate: string;
  readonly birthTime: string;
  readonly timeBranch: TimeBranchSelection;
  readonly birthTimeUnknown: boolean;
  readonly gender: string;
  readonly mbtiType: string;
  readonly relationshipStatus: string;
  readonly jobStatus: string;
  readonly detailedJob: string;
  readonly focusAreas: readonly string[];
  readonly selectedYear: string;
};

type MajorFortuneInputState = Omit<AnnualFortuneInputState, "selectedYear">;
type FortuneBirthTimeSummaryInput = Pick<
  AnnualFortuneInputState,
  "birthTimeUnknown" | "birthTime" | "timeBranch"
>;

const annualRelationshipStatusOptions = [
  { value: "", labelKo: "미입력" },
  { value: "single", labelKo: "솔로" },
  { value: "some", labelKo: "썸" },
  { value: "dating", labelKo: "연애 중" },
  { value: "marriage_preparing", labelKo: "결혼 준비" },
  { value: "married", labelKo: "기혼" },
] as const;

const annualJobStatusOptions = [
  { value: "", labelKo: "미입력" },
  { value: "student", labelKo: "학생" },
  { value: "job_seeker", labelKo: "취준생" },
  { value: "employee", labelKo: "직장인" },
  { value: "freelancer", labelKo: "프리랜서" },
  { value: "self_employed", labelKo: "자영업" },
  { value: "business_owner", labelKo: "사업가" },
  { value: "homemaker", labelKo: "주부" },
  { value: "unemployed", labelKo: "무직" },
  { value: "other", labelKo: "기타" },
] as const;

const annualDetailedJobOptions = [
  "",
  "고등학생",
  "대학생",
  "개발자",
  "서비스 기획자",
  "디자이너",
  "마케터",
  "변호사",
  "의사",
  "교사",
  "유튜버",
  "인플루언서",
  "연예인",
  "자영업자",
  "기타 직접 입력",
] as const;

const annualFocusAreaOptions = [
  "직업",
  "돈",
  "연애",
  "관계",
  "건강관리",
  "공부",
  "가족",
  "생활 리듬",
] as const satisfies readonly FocusArea[];

function createCompatibilityPersonInputState(): CompatibilityPersonInputState {
  return {
    name: "",
    birthDate: "",
    birthTime: "",
    timeBranch: "",
    birthTimeUnknown: false,
    gender: "",
    mbtiType: "",
  };
}

function createAnnualFortuneInputState(): AnnualFortuneInputState {
  return {
    name: "",
    birthDate: "",
    birthTime: "",
    timeBranch: "",
    birthTimeUnknown: false,
    gender: "",
    mbtiType: "",
    relationshipStatus: "",
    jobStatus: "",
    detailedJob: "",
    focusAreas: [],
    selectedYear: String(new Date().getFullYear()),
  };
}

function createMajorFortuneInputState(): MajorFortuneInputState {
  return {
    name: "",
    birthDate: "",
    birthTime: "",
    timeBranch: "",
    birthTimeUnknown: false,
    gender: "",
    mbtiType: "",
    relationshipStatus: "",
    jobStatus: "",
    detailedJob: "",
    focusAreas: [],
  };
}

function getRepresentativeBirthTime(branch: TimeBranchValue): string {
  return (
    timeBranches.find((item) => item.value === branch)?.representativeTime ??
    "00:30"
  );
}

function isMidnightBoundaryTime(value: string): boolean {
  return value.startsWith("23:") || value.startsWith("00:");
}

function formatGenderLabel(value: string): string {
  if (value === "MALE") {
    return "남성";
  }

  if (value === "FEMALE") {
    return "여성";
  }

  return "선택 안 함";
}

function formatCalendarTypeLabel(value: string): string {
  if (value === "SOLAR") {
    return "양력";
  }

  return "선택 안 함";
}

function formatCompatibilityRelationshipLabel(
  value: CompatibilityRelationshipTypeSelection,
): string {
  return (
    compatibilityRelationshipOptions.find((option) => option.value === value)
      ?.labelKo ?? "연애"
  );
}

function formatCompatibilityBirthTimeSummary(
  input: CompatibilityPersonInputState,
): string {
  if (input.birthTimeUnknown) {
    return "출생시간 모름";
  }

  if (input.birthTime.trim().length > 0) {
    return `정확한 시간 · ${input.birthTime}`;
  }

  if (input.timeBranch !== "") {
    return formatBirthTimeSummary("branch", "", input.timeBranch);
  }

  return "미입력";
}

function formatAnnualBirthTimeSummary(
  input: FortuneBirthTimeSummaryInput,
): string {
  if (input.birthTimeUnknown) {
    return "출생시간 모름";
  }

  if (input.birthTime.trim().length > 0) {
    return `정확한 시간 · ${input.birthTime}`;
  }

  if (input.timeBranch !== "") {
    return formatBirthTimeSummary("branch", "", input.timeBranch);
  }

  return "미입력";
}

function formatAnnualRelationshipStatus(value: string): string {
  return (
    annualRelationshipStatusOptions.find((option) => option.value === value)
      ?.labelKo ?? "미입력"
  );
}

function formatAnnualJobStatus(value: string): string {
  return (
    annualJobStatusOptions.find((option) => option.value === value)?.labelKo ??
    "미입력"
  );
}

function isFocusArea(value: string): value is FocusArea {
  return annualFocusAreaOptions.includes(value as FocusArea);
}

function createReportPersonInputPayload(
  input: CompatibilityPersonInputState | AnnualFortuneInputState,
): ReportPersonInputPayload {
  return {
    name: input.name.trim(),
    birthDate: input.birthDate.trim(),
    birthTime: input.birthTimeUnknown ? "" : input.birthTime.trim(),
    birthTimeUnknown: input.birthTimeUnknown,
    approximateBirthTimeSlot: input.birthTimeUnknown ? "" : input.timeBranch,
    gender: input.gender as ReportPersonInputPayload["gender"],
    mbtiType: input.mbtiType as ReportPersonInputPayload["mbtiType"],
  };
}

function createSingleProductOptions(
  productKey: string,
  input: AnnualFortuneInputState,
): SinglePersonReportInputPayload["productOptions"] {
  if (productKey === ANNUAL_FORTUNE_PRODUCT_KEY) {
    return {
      selectedYear: input.selectedYear.trim(),
    };
  }

  return {};
}

function buildSinglePersonReportInputPayload(
  product: SelectedReportProduct,
  input: AnnualFortuneInputState,
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

function buildCompatibilityReportInputPayload(input: {
  readonly relationshipType: CompatibilityRelationshipTypeSelection;
  readonly personA: CompatibilityPersonInputState;
  readonly personB: CompatibilityPersonInputState;
}): CompatibilityReportInputPayload {
  return {
    productKey: COMPATIBILITY_PRODUCT_KEY,
    productSlug: COMPATIBILITY_PRODUCT_SLUG,
    relationshipType: input.relationshipType,
    personA: createReportPersonInputPayload(input.personA),
    personB: createReportPersonInputPayload(input.personB),
  };
}

function buildReportInputPayload(input: {
  readonly selectedProduct: SelectedReportProduct;
  readonly singleProductInput: AnnualFortuneInputState;
  readonly compatibilityPersonA: CompatibilityPersonInputState;
  readonly compatibilityPersonB: CompatibilityPersonInputState;
  readonly compatibilityRelationshipType: CompatibilityRelationshipTypeSelection;
}): ReportInputPayload | null {
  if (isSinglePersonPreviewProduct(input.selectedProduct.productKey)) {
    return buildSinglePersonReportInputPayload(
      input.selectedProduct,
      input.singleProductInput,
    );
  }

  if (input.selectedProduct.productKey === COMPATIBILITY_PRODUCT_KEY) {
    return buildCompatibilityReportInputPayload({
      relationshipType: input.compatibilityRelationshipType,
      personA: input.compatibilityPersonA,
      personB: input.compatibilityPersonB,
    });
  }

  return null;
}

function isCompatibilityPreviewCreateSuccessResponse(
  value: unknown,
): value is {
  readonly ok: true;
  readonly reportId: string;
  readonly snapshotKind: "product_preview";
} {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const response = value as Record<string, unknown>;
  return (
    response.ok === true &&
    typeof response.reportId === "string" &&
    response.reportId.trim().length > 0 &&
    response.snapshotKind === "product_preview"
  );
}

function getCompatibilityPreviewCreateErrorMessage(value: unknown): string {
  return getProductPreviewCreateErrorMessage(
    value,
    COMPATIBILITY_PREVIEW_CREATE_ERROR_MESSAGE_KO,
  );
}

function getProductPreviewCreateErrorMessage(
  value: unknown,
  fallbackMessage: string,
): string {
  if (typeof value !== "object" || value === null) {
    return fallbackMessage;
  }

  const response = value as Record<string, unknown>;
  if (typeof response.message === "string" && response.message.trim() !== "") {
    return response.message;
  }

  if (typeof response.error === "string" && response.error.trim() !== "") {
    return response.error;
  }

  return fallbackMessage;
}

function isCompatibilityPersonRequiredInputComplete(
  input: CompatibilityPersonInputState,
): boolean {
  return input.name.trim().length > 0 && input.birthDate.trim().length > 0;
}

function isAnnualFortuneRequiredInputComplete(
  input: AnnualFortuneInputState,
): boolean {
  return (
    input.name.trim().length > 0 &&
    input.birthDate.trim().length > 0 &&
    input.selectedYear.trim().length > 0
  );
}

function isMajorFortuneRequiredInputComplete(
  input: MajorFortuneInputState,
): boolean {
  return input.name.trim().length > 0 && input.birthDate.trim().length > 0;
}

function getSearchParamValue(
  value: string | readonly string[] | undefined,
): string {
  if (typeof value === "string") {
    return value;
  }

  return value?.[0] ?? "";
}

function resolveSelectedReportProduct(
  searchProduct: string | readonly string[] | undefined,
): SelectedReportProduct {
  const productSlug = getSearchParamValue(searchProduct);

  if (productSlug === CAREER_MONEY_STUDY_PRODUCT_SLUG) {
    return CAREER_MONEY_STUDY_SELECTED_REPORT_PRODUCT;
  }

  if (productSlug === LOVE_MARRIAGE_CHILD_PRODUCT_SLUG) {
    return LOVE_MARRIAGE_CHILD_SELECTED_REPORT_PRODUCT;
  }

  if (productSlug === COMPATIBILITY_PRODUCT_SLUG) {
    return COMPATIBILITY_SELECTED_REPORT_PRODUCT;
  }

  if (productSlug === MAJOR_FORTUNE_PRODUCT_SLUG) {
    return MAJOR_FORTUNE_SELECTED_REPORT_PRODUCT;
  }

  if (productSlug === ANNUAL_FORTUNE_PRODUCT_SLUG) {
    return ANNUAL_FORTUNE_SELECTED_REPORT_PRODUCT;
  }

  if (productSlug === SAJU_MBTI_FULL_PRODUCT_SLUG) {
    return SAJU_MBTI_FULL_SELECTED_REPORT_PRODUCT;
  }

  return DEFAULT_SELECTED_REPORT_PRODUCT;
}

function isSinglePersonPreviewProduct(productKey: string): boolean {
  return (
    productKey === CAREER_MONEY_STUDY_PRODUCT_KEY ||
    productKey === LOVE_MARRIAGE_CHILD_PRODUCT_KEY ||
    productKey === MAJOR_FORTUNE_PRODUCT_KEY ||
    productKey === ANNUAL_FORTUNE_PRODUCT_KEY ||
    productKey === SAJU_MBTI_FULL_PRODUCT_KEY
  );
}

function getSingleProductLeadText(productKey: string): string {
  if (productKey === CAREER_MONEY_STUDY_PRODUCT_KEY) {
    return "직업, 커리어, 돈, 학업 흐름을 한 사람 기준으로 보는 리포트입니다.";
  }

  if (productKey === LOVE_MARRIAGE_CHILD_PRODUCT_KEY) {
    return "나의 연애, 결혼, 부모 역할 성향을 한 사람 기준으로 보는 리포트입니다.";
  }

  if (productKey === MAJOR_FORTUNE_PRODUCT_KEY) {
    return "대운은 입력된 생년월일과 출생시간 기반의 10년 흐름을 보는 리포트입니다.";
  }

  if (productKey === ANNUAL_FORTUNE_PRODUCT_KEY) {
    return "세운은 선택한 한 해의 흐름을 보는 리포트입니다.";
  }

  if (productKey === SAJU_MBTI_FULL_PRODUCT_KEY) {
    return "명리 구조와 MBTI 행동 패턴을 함께 읽는 자기이해 종합 리포트입니다.";
  }

  return "단독 인물 리포트 입력 흐름입니다.";
}

function getSingleProductReadyCtaLabel(productKey: string): string {
  if (productKey === CAREER_MONEY_STUDY_PRODUCT_KEY) {
    return "직업 리포트 미리보기 생성";
  }

  if (productKey === LOVE_MARRIAGE_CHILD_PRODUCT_KEY) {
    return "연애 리포트 미리보기 생성";
  }

  if (productKey === MAJOR_FORTUNE_PRODUCT_KEY) {
    return "대운 리포트 미리보기 생성";
  }

  if (productKey === ANNUAL_FORTUNE_PRODUCT_KEY) {
    return "세운 리포트 미리보기 생성";
  }

  return "종합 리포트 미리보기 생성";
}

function getSingleProductLoadingCtaLabel(productKey: string): string {
  if (productKey === CAREER_MONEY_STUDY_PRODUCT_KEY) {
    return "직업 리포트 생성 중";
  }

  if (productKey === LOVE_MARRIAGE_CHILD_PRODUCT_KEY) {
    return "연애 리포트 생성 중";
  }

  if (productKey === MAJOR_FORTUNE_PRODUCT_KEY) {
    return "대운 리포트 생성 중";
  }

  if (productKey === ANNUAL_FORTUNE_PRODUCT_KEY) {
    return "세운 리포트 생성 중";
  }

  return "종합 리포트 생성 중";
}

function formatBirthTimeSummary(
  mode: BirthTimeMode,
  exactTime: string,
  branch: TimeBranchSelection,
): string {
  if (mode === "unknown") {
    return "출생시간 모름";
  }

  if (mode === "branch") {
    const selectedBranch = timeBranches.find((item) => item.value === branch);

    return selectedBranch
      ? `대략적인 시간대 · ${selectedBranch.labelKo} 기준`
      : "시간대를 선택해 주세요";
  }

  return exactTime ? `정확한 시간 · ${exactTime}` : "정확한 시간 · 미입력";
}

function createCheckoutInputSnapshot(input: {
  readonly displayName: string;
  readonly birthDate: string;
  readonly birthTime: string | undefined;
  readonly birthTimeUnknown: boolean;
  readonly gender: string;
  readonly mbtiType: string;
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
  };
}

function renderCompatibilityPersonInputSection(input: {
  readonly prefix: "personA" | "personB";
  readonly titleKo: string;
  readonly descriptionKo: string;
  readonly value: CompatibilityPersonInputState;
  readonly onChange: (value: CompatibilityPersonInputState) => void;
}) {
  const { prefix, titleKo, descriptionKo, value, onChange } = input;

  return (
    <section className="space-y-5 rounded-lg border border-[#4a3434] bg-[#211817]/90 p-5 shadow-xl shadow-black/20">
      <div className="space-y-2">
        <p className="text-sm font-bold text-[#c79a43]">{titleKo}</p>
        <p className="text-sm leading-6 text-[#cfc5b8]">{descriptionKo}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor={`${prefix}Name`}
            className="block text-sm font-medium text-neutral-200"
          >
            이름
          </label>
          <input
            id={`${prefix}Name`}
            name={`${prefix}Name`}
            type="text"
            value={value.name}
            maxLength={20}
            placeholder={
              prefix === "personA"
                ? "이름을 입력해 주세요"
                : "상대 이름을 입력해 주세요"
            }
            onChange={(event) => onChange({ ...value, name: event.target.value })}
            className="w-full min-w-0 rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-neutral-50 outline-none placeholder:text-neutral-600 focus:border-neutral-400"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor={`${prefix}BirthDate`}
            className="block text-sm font-medium text-neutral-200"
          >
            생년월일
          </label>
          <input
            id={`${prefix}BirthDate`}
            name={`${prefix}BirthDate`}
            type="date"
            value={value.birthDate}
            style={{ colorScheme: "dark" }}
            onChange={(event) =>
              onChange({ ...value, birthDate: event.target.value })
            }
            className="w-full min-w-0 rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-neutral-50 outline-none focus:border-neutral-400"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor={`${prefix}BirthTime`}
            className="block text-sm font-medium text-neutral-200"
          >
            출생시간
          </label>
          <input
            id={`${prefix}BirthTime`}
            name={`${prefix}BirthTime`}
            type="time"
            value={value.birthTime}
            style={{ colorScheme: "dark" }}
            onChange={(event) =>
              onChange({
                ...value,
                birthTime: event.target.value,
                birthTimeUnknown: false,
              })
            }
            className="w-full min-w-0 rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-neutral-50 outline-none focus:border-neutral-400"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor={`${prefix}TimeBranch`}
            className="block text-sm font-medium text-neutral-200"
          >
            대략적인 시간대
          </label>
          <select
            id={`${prefix}TimeBranch`}
            name={`${prefix}TimeBranch`}
            value={value.timeBranch}
            onChange={(event) =>
              onChange({
                ...value,
                timeBranch: event.target.value as TimeBranchSelection,
                birthTimeUnknown: false,
              })
            }
            className="w-full min-w-0 rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-neutral-50 outline-none focus:border-neutral-400"
          >
            <option value="">시간대를 선택해 주세요</option>
            {timeBranches.map((branch) => (
              <option key={branch.value} value={branch.value}>
                {branch.labelKo}
              </option>
            ))}
          </select>
        </div>

        <label className="flex min-h-12 items-center gap-3 rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm font-medium text-neutral-200">
          <input
            type="checkbox"
            name={`${prefix}BirthTimeUnknown`}
            checked={value.birthTimeUnknown}
            onChange={(event) =>
              onChange({
                ...value,
                birthTimeUnknown: event.target.checked,
                birthTime: event.target.checked ? "" : value.birthTime,
                timeBranch: event.target.checked ? "" : value.timeBranch,
              })
            }
            className="h-4 w-4"
          />
          출생시간 모름
        </label>

        <div className="space-y-2">
          <label
            htmlFor={`${prefix}Gender`}
            className="block text-sm font-medium text-neutral-200"
          >
            성별
          </label>
          <select
            id={`${prefix}Gender`}
            name={`${prefix}Gender`}
            value={value.gender}
            onChange={(event) =>
              onChange({ ...value, gender: event.target.value })
            }
            className="w-full min-w-0 rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-neutral-50 outline-none focus:border-neutral-400"
          >
            <option value="">선택</option>
            <option value="MALE">남성</option>
            <option value="FEMALE">여성</option>
          </select>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label
            htmlFor={`${prefix}MbtiType`}
            className="block text-sm font-medium text-neutral-200"
          >
            MBTI
          </label>
          <select
            id={`${prefix}MbtiType`}
            name={`${prefix}MbtiType`}
            value={value.mbtiType}
            onChange={(event) =>
              onChange({ ...value, mbtiType: event.target.value })
            }
            className="w-full min-w-0 rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-neutral-50 outline-none focus:border-neutral-400"
          >
            <option value="">선택</option>
            {mbtiTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}

function renderSingleProductCommonInputSection(input: {
  readonly prefix: string;
  readonly value: AnnualFortuneInputState;
  readonly onChange: (value: AnnualFortuneInputState) => void;
}) {
  const { prefix, value, onChange } = input;

  return (
    <section className="space-y-5 rounded-lg border border-[#ded2c2] bg-[#fffdf8] p-5 shadow-sm shadow-[#6f1d35]/5">
      <div className="space-y-2">
        <p className="text-sm font-bold text-[#c79a43]">기본 정보 입력</p>
        <p className="text-sm leading-6 text-[#6b5a4d]">
          리포트 생성에 필요한 기본 정보를 입력해 주세요.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor={`${prefix}Name`}
            className="block text-sm font-medium text-[#3f3129]"
          >
            이름
          </label>
          <input
            id={`${prefix}Name`}
            name="name"
            type="text"
            value={value.name}
            maxLength={20}
            placeholder="이름을 입력해 주세요"
            onChange={(event) => onChange({ ...value, name: event.target.value })}
            className="w-full min-w-0 rounded-lg border border-[#ded2c2] bg-white px-4 py-3 text-[#2b211b] outline-none placeholder:text-[#9b8a78] focus:border-[#6f1d35]"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor={`${prefix}BirthDate`}
            className="block text-sm font-medium text-[#3f3129]"
          >
            생년월일
          </label>
          <input
            id={`${prefix}BirthDate`}
            name="birthDate"
            type="date"
            value={value.birthDate}
            style={{ colorScheme: "light" }}
            onChange={(event) =>
              onChange({ ...value, birthDate: event.target.value })
            }
            className="w-full min-w-0 rounded-lg border border-[#ded2c2] bg-white px-4 py-3 text-[#2b211b] outline-none focus:border-[#6f1d35]"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor={`${prefix}BirthTime`}
            className="block text-sm font-medium text-[#3f3129]"
          >
            출생시간
          </label>
          <input
            id={`${prefix}BirthTime`}
            name="birthTime"
            type="time"
            value={value.birthTime}
            style={{ colorScheme: "light" }}
            onChange={(event) =>
              onChange({
                ...value,
                birthTime: event.target.value,
                birthTimeUnknown: false,
              })
            }
            className="w-full min-w-0 rounded-lg border border-[#ded2c2] bg-white px-4 py-3 text-[#2b211b] outline-none focus:border-[#6f1d35]"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor={`${prefix}TimeBranch`}
            className="block text-sm font-medium text-[#3f3129]"
          >
            대략적인 시간대
          </label>
          <select
            id={`${prefix}TimeBranch`}
            name="timeBranch"
            value={value.timeBranch}
            onChange={(event) =>
              onChange({
                ...value,
                timeBranch: event.target.value as TimeBranchSelection,
                birthTimeUnknown: false,
              })
            }
            className="w-full min-w-0 rounded-lg border border-[#ded2c2] bg-white px-4 py-3 text-[#2b211b] outline-none focus:border-[#6f1d35]"
          >
            <option value="">시간대를 선택해 주세요</option>
            {timeBranches.map((branch) => (
              <option key={branch.value} value={branch.value}>
                {branch.labelKo}
              </option>
            ))}
          </select>
        </div>

        <label className="flex min-h-12 items-center gap-3 rounded-lg border border-[#ded2c2] bg-[#fffaf1] px-4 py-3 text-sm font-medium text-[#3f3129]">
          <input
            type="checkbox"
            name="birthTimeUnknown"
            checked={value.birthTimeUnknown}
            onChange={(event) =>
              onChange({
                ...value,
                birthTimeUnknown: event.target.checked,
                birthTime: event.target.checked ? "" : value.birthTime,
                timeBranch: event.target.checked ? "" : value.timeBranch,
              })
            }
            className="h-4 w-4"
          />
          출생시간 모름
        </label>

        <div className="space-y-2">
          <label
            htmlFor={`${prefix}Gender`}
            className="block text-sm font-medium text-[#3f3129]"
          >
            성별
          </label>
          <select
            id={`${prefix}Gender`}
            name="gender"
            value={value.gender}
            onChange={(event) => onChange({ ...value, gender: event.target.value })}
            className="w-full min-w-0 rounded-lg border border-[#ded2c2] bg-white px-4 py-3 text-[#2b211b] outline-none focus:border-[#6f1d35]"
          >
            <option value="">선택</option>
            <option value="MALE">남성</option>
            <option value="FEMALE">여성</option>
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor={`${prefix}MbtiType`}
            className="block text-sm font-medium text-[#3f3129]"
          >
            MBTI
          </label>
          <select
            id={`${prefix}MbtiType`}
            name="mbtiType"
            value={value.mbtiType}
            onChange={(event) =>
              onChange({ ...value, mbtiType: event.target.value })
            }
            className="w-full min-w-0 rounded-lg border border-[#ded2c2] bg-white px-4 py-3 text-[#2b211b] outline-none focus:border-[#6f1d35]"
          >
            <option value="">선택</option>
            {mbtiTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor={`${prefix}RelationshipStatus`}
            className="block text-sm font-medium text-[#3f3129]"
          >
            현재 연애 상태
          </label>
          <select
            id={`${prefix}RelationshipStatus`}
            name="relationshipStatus"
            value={value.relationshipStatus}
            onChange={(event) =>
              onChange({ ...value, relationshipStatus: event.target.value })
            }
            className="w-full min-w-0 rounded-lg border border-[#ded2c2] bg-white px-4 py-3 text-[#2b211b] outline-none focus:border-[#6f1d35]"
          >
            {annualRelationshipStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.labelKo}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor={`${prefix}JobStatus`}
            className="block text-sm font-medium text-[#3f3129]"
          >
            직업 상태
          </label>
          <select
            id={`${prefix}JobStatus`}
            name="jobStatus"
            value={value.jobStatus}
            onChange={(event) =>
              onChange({ ...value, jobStatus: event.target.value })
            }
            className="w-full min-w-0 rounded-lg border border-[#ded2c2] bg-white px-4 py-3 text-[#2b211b] outline-none placeholder:text-[#9b8a78] focus:border-[#6f1d35]"
          >
            {annualJobStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.labelKo}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label
            htmlFor={`${prefix}DetailedJob`}
            className="block text-sm font-medium text-[#3f3129]"
          >
            세부 직업
          </label>
          <input
            id={`${prefix}DetailedJob`}
            name="detailedJob"
            type="text"
            value={value.detailedJob}
            list={`${prefix}DetailedJobOptions`}
            placeholder="예: 서비스 기획자"
            onChange={(event) =>
              onChange({ ...value, detailedJob: event.target.value })
            }
            className="w-full min-w-0 rounded-lg border border-[#ded2c2] bg-white px-4 py-3 text-[#2b211b] outline-none placeholder:text-[#9b8a78] focus:border-[#6f1d35]"
          />
          <datalist id={`${prefix}DetailedJobOptions`}>
            {annualDetailedJobOptions.map((option) => (
              <option key={option} value={option} />
            ))}
          </datalist>
          <p className="text-xs leading-5 text-[#7d6d60]">
            예: 고등학생, 대학생, 개발자, 서비스 기획자, 디자이너,
            마케터, 변호사, 의사, 교사, 유튜버, 인플루언서, 연예인,
            자영업자, 기타 직접 입력
          </p>
        </div>

      </div>
    </section>
  );
}

export default function NewReportPage({
  searchParams = EMPTY_REPORT_SEARCH_PARAMS,
}: NewReportPageProps) {
  const router = useRouter();
  const resolvedSearchParams = use(searchParams);
  const selectedProduct = resolveSelectedReportProduct(
    resolvedSearchParams.product,
  );
  const isSelectedProductPurchasable = selectedProduct.isPurchasable;
  const [currentStep, setCurrentStep] = useState<ReportInputStep>(0);
  const [displayName, setDisplayName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthTimeMode, setBirthTimeMode] = useState<BirthTimeMode>("exact");
  const [birthTime, setBirthTime] = useState("");
  const [timeBranch, setTimeBranch] = useState<TimeBranchSelection>("");
  const [gender, setGender] = useState("");
  const [mbtiType, setMbtiType] = useState("");
  const [stepError, setStepError] = useState("");
  const [singleProductInput, setSingleProductInput] =
    useState<AnnualFortuneInputState>(createAnnualFortuneInputState);
  const [compatibilityPersonA, setCompatibilityPersonA] =
    useState<CompatibilityPersonInputState>(createCompatibilityPersonInputState);
  const [compatibilityPersonB, setCompatibilityPersonB] =
    useState<CompatibilityPersonInputState>(createCompatibilityPersonInputState);
  const [compatibilityRelationshipType, setCompatibilityRelationshipType] =
    useState<CompatibilityRelationshipTypeSelection>("love");
  const [isCompatibilitySubmitting, setIsCompatibilitySubmitting] =
    useState(false);
  const [compatibilitySubmitError, setCompatibilitySubmitError] = useState("");
  const [isSingleProductSubmitting, setIsSingleProductSubmitting] =
    useState(false);
  const [singleProductSubmitError, setSingleProductSubmitError] = useState("");
  const [majorFortuneInput, setMajorFortuneInput] =
    useState<MajorFortuneInputState>(createMajorFortuneInputState);
  const [annualFortuneInput, setAnnualFortuneInput] =
    useState<AnnualFortuneInputState>(createAnnualFortuneInputState);

  const selectedStep = reportInputSteps[currentStep];
  const progressPercent = ((currentStep + 1) / reportInputSteps.length) * 100;
  const birthTimeUnknown = birthTimeMode === "unknown";
  const normalizedBirthTime = birthTimeUnknown
    ? undefined
    : birthTimeMode === "branch"
      ? timeBranch
        ? getRepresentativeBirthTime(timeBranch)
        : undefined
      : birthTime;
  const birthTimeSummary = formatBirthTimeSummary(
    birthTimeMode,
    birthTime,
    timeBranch,
  );
  const shouldShowMidnightBoundaryWarning =
    (birthTimeMode === "exact" && isMidnightBoundaryTime(birthTime)) ||
    (birthTimeMode === "branch" && timeBranch === "JASI");
  const checkoutInputSnapshot = createCheckoutInputSnapshot({
    displayName,
    birthDate,
    birthTime: normalizedBirthTime,
    birthTimeUnknown,
    gender,
    mbtiType,
  });
  const isCheckoutInputComplete =
    isDevTossCheckoutInputComplete(checkoutInputSnapshot);
  const isCompatibilityInputReady =
    isCompatibilityPersonRequiredInputComplete(compatibilityPersonA) &&
    isCompatibilityPersonRequiredInputComplete(compatibilityPersonB) &&
    compatibilityRelationshipType.trim().length > 0;
  const compatibilityCtaLabel = isCompatibilitySubmitting
    ? "궁합 리포트 생성 중"
    : isCompatibilityInputReady
      ? "궁합 리포트 미리보기 생성"
      : "필수 정보를 입력해 주세요";
  const compatibilityRelationshipLabel = formatCompatibilityRelationshipLabel(
    compatibilityRelationshipType,
  );
  const isSingleProductAnnual =
    selectedProduct.productKey === ANNUAL_FORTUNE_PRODUCT_KEY;
  const isSingleProductComprehensiveV2 =
    selectedProduct.productKey === SAJU_MBTI_FULL_PRODUCT_KEY;
  const isSingleProductInputReady = isSingleProductAnnual
    ? isAnnualFortuneRequiredInputComplete(singleProductInput)
    : isMajorFortuneRequiredInputComplete(singleProductInput);
  const singleProductCtaLabel = isSingleProductSubmitting
    ? getSingleProductLoadingCtaLabel(selectedProduct.productKey)
    : isSingleProductInputReady
      ? getSingleProductReadyCtaLabel(selectedProduct.productKey)
      : "필수 정보를 입력해 주세요";
  const isMajorFortuneInputReady =
    isMajorFortuneRequiredInputComplete(majorFortuneInput);
  const majorFortuneCtaLabel = isMajorFortuneInputReady
    ? "대운 리포트 미리보기 준비됨"
    : "필수 정보를 입력해 주세요";
  const isAnnualFortuneInputReady =
    isAnnualFortuneRequiredInputComplete(annualFortuneInput);
  const annualFortuneCtaLabel = isAnnualFortuneInputReady
    ? "세운 리포트 미리보기 준비됨"
    : "필수 정보를 입력해 주세요";
  function handlePreviewOnlySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    buildReportInputPayload({
      selectedProduct,
      singleProductInput,
      compatibilityPersonA,
      compatibilityPersonB,
      compatibilityRelationshipType,
    });
  }

  async function handleSingleProductPreviewSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setSingleProductSubmitError("");

    if (!isSingleProductInputReady || isSingleProductSubmitting) {
      setSingleProductSubmitError(COMPREHENSIVE_V2_REQUIRED_INPUT_MESSAGE_KO);
      return;
    }

    const payload = buildSinglePersonReportInputPayload(
      selectedProduct,
      singleProductInput,
    );

    setIsSingleProductSubmitting(true);

    try {
      const response = await fetch(REPORT_CREATE_API_PATH, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const createResult: unknown = await response.json();

      if (
        response.ok &&
        isCompatibilityPreviewCreateSuccessResponse(createResult)
      ) {
        router.push(`/reports/${createResult.reportId}`);
        return;
      }

      setSingleProductSubmitError(
        getProductPreviewCreateErrorMessage(
          createResult,
          isSingleProductComprehensiveV2
            ? COMPREHENSIVE_V2_PREVIEW_CREATE_ERROR_MESSAGE_KO
            : SINGLE_PRODUCT_PREVIEW_CREATE_ERROR_MESSAGE_KO,
        ),
      );
    } catch {
      setSingleProductSubmitError(
        isSingleProductComprehensiveV2
          ? COMPREHENSIVE_V2_PREVIEW_CREATE_ERROR_MESSAGE_KO
          : SINGLE_PRODUCT_PREVIEW_CREATE_ERROR_MESSAGE_KO,
      );
    }

    setIsSingleProductSubmitting(false);
  }

  async function handleCompatibilityPreviewSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setCompatibilitySubmitError("");

    if (!isCompatibilityInputReady || isCompatibilitySubmitting) {
      setCompatibilitySubmitError(COMPATIBILITY_REQUIRED_INPUT_MESSAGE_KO);
      return;
    }

    const payload = buildCompatibilityReportInputPayload({
      relationshipType: compatibilityRelationshipType,
      personA: compatibilityPersonA,
      personB: compatibilityPersonB,
    });

    setIsCompatibilitySubmitting(true);

    try {
      const response = await fetch(REPORT_CREATE_API_PATH, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const createResult: unknown = await response.json();

      if (
        response.ok &&
        isCompatibilityPreviewCreateSuccessResponse(createResult)
      ) {
        router.push(`/reports/${createResult.reportId}`);
        return;
      }

      setCompatibilitySubmitError(
        getCompatibilityPreviewCreateErrorMessage(createResult),
      );
    } catch {
      setCompatibilitySubmitError(
        COMPATIBILITY_PREVIEW_CREATE_ERROR_MESSAGE_KO,
      );
    }

    setIsCompatibilitySubmitting(false);
  }

  if (isSinglePersonPreviewProduct(selectedProduct.productKey)) {
    return (
      <main className="min-h-screen bg-[#f6f0e7] px-5 py-8 text-[#2b211b] sm:px-8 lg:px-10">
        <section className="mx-auto max-w-5xl space-y-8">
          <header className="max-w-3xl space-y-4 animate-[gyeol-reveal_520ms_ease-out]">
            <p className="text-sm font-bold tracking-[0.18em] text-[#c79a43]">
              Gyeol Report
            </p>
            <h1 className="text-4xl font-bold tracking-normal text-[#2b211b]">
              {selectedProduct.inputTitleKo}
            </h1>
            <p className="max-w-2xl text-base leading-8 text-[#5f5045]">
              {getSingleProductLeadText(selectedProduct.productKey)}
            </p>
            <p className="max-w-2xl rounded-lg border border-[#d7b56d]/60 bg-[#fffaf1] px-4 py-3 text-sm leading-6 text-[#5f5045]">
              {isSingleProductComprehensiveV2
                ? "입력한 정보를 바탕으로 종합 미리보기 리포트를 생성합니다. 현재 연애 상태와 직업 정보는 해석을 현실 장면에 맞추는 참고 정보로만 사용됩니다."
                : "입력한 정보를 바탕으로 리포트 입력 정보를 준비합니다. 현재 연애 상태와 직업 정보는 해석을 현실 장면에 맞추는 참고 정보로만 사용됩니다."}
            </p>
          </header>

          <form
            onSubmit={handleSingleProductPreviewSubmit}
            className="grid gap-6"
          >
            <input type="hidden" name="timezone" value="Asia/Seoul" />
            <input type="hidden" name="calendarType" value="SOLAR" />
            <input
              type="hidden"
              name="productKey"
              value={selectedProduct.productKey}
            />
            <input
              type="hidden"
              name="productSlug"
              value={selectedProduct.slug}
            />
            <input
              type="hidden"
              name="productName"
              value={selectedProduct.nameKo}
            />

            {renderSingleProductCommonInputSection({
              prefix: "singleProduct",
              value: singleProductInput,
              onChange: setSingleProductInput,
            })}

            {isSingleProductAnnual ? (
              <section className="space-y-5 rounded-lg border border-[#ded2c2] bg-[#fffdf8] p-5 shadow-sm shadow-[#6f1d35]/5">
                <div className="space-y-2">
                  <p className="text-sm font-bold text-[#c79a43]">
                    세운 전용 조회 연도
                  </p>
                  <p className="text-sm leading-6 text-[#6b5a4d]">
                    기본값은 현재 연도입니다. 과거 5년과 올해를 우선 조회하고,
                    12월 1일 이후에는 다음 해 신년사주 미리보기가 열립니다.
                  </p>
                  <p className="text-sm leading-6 text-[#7d6d60]">
                    2년 이상 미래 조회는 아직 준비 중이며, 과거 10년 조회는
                    2차 확장으로 안내합니다.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                  <div className="space-y-2">
                    <label
                      htmlFor="selectedYear"
                      className="block text-sm font-medium text-[#3f3129]"
                    >
                      조회 연도
                    </label>
                    <input
                      id="selectedYear"
                      name="selectedYear"
                      type="number"
                      inputMode="numeric"
                      value={singleProductInput.selectedYear}
                      onChange={(event) =>
                        setSingleProductInput({
                          ...singleProductInput,
                          selectedYear: event.target.value,
                        })
                      }
                      className="w-full min-w-0 rounded-lg border border-[#ded2c2] bg-white px-4 py-3 text-[#2b211b] outline-none focus:border-[#6f1d35]"
                    />
                  </div>
                </div>
              </section>
            ) : null}

            <div className="space-y-3">
              <button
                type="submit"
                disabled={
                  !isSingleProductInputReady ||
                  isSingleProductSubmitting
                }
                aria-disabled={
                  !isSingleProductInputReady ||
                  isSingleProductSubmitting
                }
                className={
                  isSingleProductInputReady &&
                  !isSingleProductSubmitting
                    ? "min-h-12 rounded-lg border border-[#6f1d35] bg-[#6f1d35] px-5 py-3 text-sm font-bold text-[#fffdf8] transition hover:bg-[#7f2440]"
                    : "min-h-12 rounded-lg border border-[#d7b56d] bg-[#fffaf1] px-5 py-3 text-sm font-bold text-[#8b6d2d]"
                }
              >
                {singleProductCtaLabel}
              </button>
              {singleProductSubmitError ? (
                <p className="rounded-lg border border-[#b94b5a]/40 bg-[#fff1f2] p-4 text-sm font-semibold text-[#8a1d3d]">
                  {singleProductSubmitError}
                </p>
              ) : null}
            </div>
          </form>
        </section>
      </main>
    );
  }

  if (selectedProduct.productKey === MAJOR_FORTUNE_PRODUCT_KEY) {
    return (
      <main className="min-h-screen bg-[#171211] px-5 py-8 text-[#fffaf0] sm:px-8 lg:px-10">
        <section className="mx-auto max-w-5xl space-y-8">
          <header className="max-w-3xl space-y-4 animate-[gyeol-reveal_520ms_ease-out]">
            <p className="text-sm font-bold tracking-[0.18em] text-[#c79a43]">
              Gyeol Report
            </p>
            <h1 className="text-4xl font-bold tracking-normal text-[#fffaf0]">
              대운 리포트 입력
            </h1>
            <p className="max-w-2xl text-base leading-8 text-[#cfc5b8]">
              대운은 입력된 생년월일과 출생시간 기반의 10년 흐름을 보는
              리포트입니다.
            </p>
            <p className="max-w-2xl rounded-lg border border-[#4a3434] bg-[#211817]/80 px-4 py-3 text-sm leading-6 text-[#cfc5b8]">
              {SINGLE_PRODUCT_CONTEXT_NOTICE_KO}
              실제 생성/결제 연결은 준비 중입니다.
            </p>
          </header>

          <form
            onSubmit={handlePreviewOnlySubmit}
            className="grid gap-6"
          >
            <input type="hidden" name="timezone" value="Asia/Seoul" />
            <input type="hidden" name="calendarType" value="SOLAR" />
            <input
              type="hidden"
              name="productKey"
              value={selectedProduct.productKey}
            />
            <input
              type="hidden"
              name="productSlug"
              value={selectedProduct.slug}
            />
            <input
              type="hidden"
              name="productName"
              value={selectedProduct.nameKo}
            />

            <section className="space-y-5 rounded-lg border border-[#4a3434] bg-[#211817]/90 p-5 shadow-xl shadow-black/20">
              <div className="space-y-2">
                <p className="text-sm font-bold text-[#c79a43]">
                  공통 입력값
                </p>
                <p className="text-sm leading-6 text-[#cfc5b8]">
                  모든 단독 인물 리포트가 공유하는 기본 정보입니다.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="majorName"
                    className="block text-sm font-medium text-neutral-200"
                  >
                    이름
                  </label>
                  <input
                    id="majorName"
                    name="name"
                    type="text"
                    value={majorFortuneInput.name}
                    maxLength={20}
                    placeholder="이름을 입력해 주세요"
                    onChange={(event) =>
                      setMajorFortuneInput({
                        ...majorFortuneInput,
                        name: event.target.value,
                      })
                    }
                    className="w-full min-w-0 rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-neutral-50 outline-none placeholder:text-neutral-600 focus:border-neutral-400"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="majorBirthDate"
                    className="block text-sm font-medium text-neutral-200"
                  >
                    생년월일
                  </label>
                  <input
                    id="majorBirthDate"
                    name="birthDate"
                    type="date"
                    value={majorFortuneInput.birthDate}
                    style={{ colorScheme: "dark" }}
                    onChange={(event) =>
                      setMajorFortuneInput({
                        ...majorFortuneInput,
                        birthDate: event.target.value,
                      })
                    }
                    className="w-full min-w-0 rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-neutral-50 outline-none focus:border-neutral-400"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="majorBirthTime"
                    className="block text-sm font-medium text-neutral-200"
                  >
                    출생시간
                  </label>
                  <input
                    id="majorBirthTime"
                    name="birthTime"
                    type="time"
                    value={majorFortuneInput.birthTime}
                    style={{ colorScheme: "dark" }}
                    onChange={(event) =>
                      setMajorFortuneInput({
                        ...majorFortuneInput,
                        birthTime: event.target.value,
                        birthTimeUnknown: false,
                      })
                    }
                    className="w-full min-w-0 rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-neutral-50 outline-none focus:border-neutral-400"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="majorTimeBranch"
                    className="block text-sm font-medium text-neutral-200"
                  >
                    대략적인 시간대
                  </label>
                  <select
                    id="majorTimeBranch"
                    name="timeBranch"
                    value={majorFortuneInput.timeBranch}
                    onChange={(event) =>
                      setMajorFortuneInput({
                        ...majorFortuneInput,
                        timeBranch: event.target.value as TimeBranchSelection,
                        birthTimeUnknown: false,
                      })
                    }
                    className="w-full min-w-0 rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-neutral-50 outline-none focus:border-neutral-400"
                  >
                    <option value="">시간대를 선택해 주세요</option>
                    {timeBranches.map((branch) => (
                      <option key={branch.value} value={branch.value}>
                        {branch.labelKo}
                      </option>
                    ))}
                  </select>
                </div>

                <label className="flex min-h-12 items-center gap-3 rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm font-medium text-neutral-200">
                  <input
                    type="checkbox"
                    name="birthTimeUnknown"
                    checked={majorFortuneInput.birthTimeUnknown}
                    onChange={(event) =>
                      setMajorFortuneInput({
                        ...majorFortuneInput,
                        birthTimeUnknown: event.target.checked,
                        birthTime: event.target.checked
                          ? ""
                          : majorFortuneInput.birthTime,
                        timeBranch: event.target.checked
                          ? ""
                          : majorFortuneInput.timeBranch,
                      })
                    }
                    className="h-4 w-4"
                  />
                  출생시간 모름
                </label>

                <div className="space-y-2">
                  <label
                    htmlFor="majorGender"
                    className="block text-sm font-medium text-neutral-200"
                  >
                    성별
                  </label>
                  <select
                    id="majorGender"
                    name="gender"
                    value={majorFortuneInput.gender}
                    onChange={(event) =>
                      setMajorFortuneInput({
                        ...majorFortuneInput,
                        gender: event.target.value,
                      })
                    }
                    className="w-full min-w-0 rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-neutral-50 outline-none focus:border-neutral-400"
                  >
                    <option value="">선택</option>
                    <option value="MALE">남성</option>
                    <option value="FEMALE">여성</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="majorMbtiType"
                    className="block text-sm font-medium text-neutral-200"
                  >
                    MBTI
                  </label>
                  <select
                    id="majorMbtiType"
                    name="mbtiType"
                    value={majorFortuneInput.mbtiType}
                    onChange={(event) =>
                      setMajorFortuneInput({
                        ...majorFortuneInput,
                        mbtiType: event.target.value,
                      })
                    }
                    className="w-full min-w-0 rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-neutral-50 outline-none focus:border-neutral-400"
                  >
                    <option value="">선택</option>
                    {mbtiTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="majorRelationshipStatus"
                    className="block text-sm font-medium text-neutral-200"
                  >
                    현재 연애 상태
                  </label>
                  <select
                    id="majorRelationshipStatus"
                    name="relationshipStatus"
                    value={majorFortuneInput.relationshipStatus}
                    onChange={(event) =>
                      setMajorFortuneInput({
                        ...majorFortuneInput,
                        relationshipStatus: event.target.value,
                      })
                    }
                    className="w-full min-w-0 rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-neutral-50 outline-none focus:border-neutral-400"
                  >
                    {annualRelationshipStatusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.labelKo}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="majorJobStatus"
                    className="block text-sm font-medium text-neutral-200"
                  >
                    직업 상태
                  </label>
                  <select
                    id="majorJobStatus"
                    name="jobStatus"
                    value={majorFortuneInput.jobStatus}
                    onChange={(event) =>
                      setMajorFortuneInput({
                        ...majorFortuneInput,
                        jobStatus: event.target.value,
                      })
                    }
                    className="w-full min-w-0 rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-neutral-50 outline-none placeholder:text-neutral-600 focus:border-neutral-400"
                  >
                    {annualJobStatusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.labelKo}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label
                    htmlFor="majorDetailedJob"
                    className="block text-sm font-medium text-neutral-200"
                  >
                    세부 직업
                  </label>
                  <input
                    id="majorDetailedJob"
                    name="detailedJob"
                    type="text"
                    value={majorFortuneInput.detailedJob}
                    list="majorDetailedJobOptions"
                    placeholder="예: 서비스 기획자"
                    onChange={(event) =>
                      setMajorFortuneInput({
                        ...majorFortuneInput,
                        detailedJob: event.target.value,
                      })
                    }
                    className="w-full min-w-0 rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-neutral-50 outline-none placeholder:text-neutral-600 focus:border-neutral-400"
                  />
                  <datalist id="majorDetailedJobOptions">
                    {annualDetailedJobOptions.map((option) => (
                      <option key={option} value={option} />
                    ))}
                  </datalist>
                  <p className="text-xs leading-5 text-neutral-500">
                    예: 고등학생, 대학생, 개발자, 서비스 기획자, 디자이너,
                    마케터, 변호사, 의사, 교사, 유튜버, 인플루언서,
                    연예인, 자영업자, 기타 직접 입력
                  </p>
                </div>

              </div>
            </section>

            <section className="space-y-5 rounded-lg border border-[#4a3434] bg-[#211817]/90 p-5 shadow-xl shadow-black/20">
              <div className="space-y-2">
                <p className="text-sm font-bold text-[#c79a43]">
                  대운 리포트 기준
                </p>
                <p className="text-sm leading-6 text-[#cfc5b8]">
                  별도 추가 질문 없이 공통 입력값을 기준으로 10년 흐름
                  리포트 입력 정보를 준비합니다.
                </p>
                <p className="text-sm leading-6 text-[#92877b]">
                  대운은 입력된 생년월일과 출생시간을 바탕으로 큰 흐름을
                  읽고, 현재 맥락 정보는 해석을 현실 장면으로 바꾸는 데만
                  사용합니다.
                </p>
              </div>
              <button
                type="button"
                disabled
                aria-disabled="true"
                className="min-h-12 rounded-lg border border-[#c79a43]/40 bg-[#2c1e1f] px-5 py-3 text-sm font-bold text-[#c79a43]/80"
              >
                {majorFortuneCtaLabel}
              </button>
            </section>

            <section className="space-y-5 rounded-lg border border-[#4a3434] bg-[#211817]/90 p-5 shadow-xl shadow-black/20">
              <div className="space-y-2">
                <p className="text-sm font-bold text-[#c79a43]">
                  입력 확인 요약
                </p>
                <p className="text-sm leading-6 text-[#cfc5b8]">
                  현재 입력값이 대운 리포트에 어떻게 반영되는지 확인합니다.
                </p>
              </div>

              <dl className="grid gap-3 text-sm lg:grid-cols-2">
                <div className="rounded-lg border border-neutral-800 bg-neutral-950/70 p-4">
                  <dt className="font-semibold text-neutral-200">기본 정보</dt>
                  <dd className="mt-2 space-y-1 text-neutral-400">
                    <p>이름: {majorFortuneInput.name.trim() || "미입력"}</p>
                    <p>생년월일: {majorFortuneInput.birthDate || "미입력"}</p>
                    <p>
                      출생시간: {formatAnnualBirthTimeSummary(majorFortuneInput)}
                    </p>
                    <p>성별: {formatGenderLabel(majorFortuneInput.gender)}</p>
                    <p>MBTI: {majorFortuneInput.mbtiType || "미선택"}</p>
                  </dd>
                </div>

                <div className="rounded-lg border border-neutral-800 bg-neutral-950/70 p-4">
                  <dt className="font-semibold text-neutral-200">현재 맥락</dt>
                  <dd className="mt-2 space-y-1 text-neutral-400">
                    <p>
                      현재 연애 상태:{" "}
                      {formatAnnualRelationshipStatus(
                        majorFortuneInput.relationshipStatus,
                      )}
                    </p>
                    <p>
                      직업 상태:{" "}
                      {formatAnnualJobStatus(majorFortuneInput.jobStatus)}
                    </p>
                    <p>
                      세부 직업:{" "}
                      {majorFortuneInput.detailedJob.trim() || "미입력"}
                    </p>
                  </dd>
                </div>

                <div className="rounded-lg border border-neutral-800 bg-neutral-950/70 p-4 lg:col-span-2">
                  <dt className="font-semibold text-neutral-200">
                    선택한 리포트
                  </dt>
                  <dd className="mt-2 space-y-1 text-neutral-400">
                    <p>리포트 종류: {selectedProduct.nameKo}</p>
                    <p>생성 방식: 미리보기 준비</p>
                  </dd>
                </div>
              </dl>

              <p
                className={
                  isMajorFortuneInputReady
                    ? "rounded-lg border border-emerald-900/50 bg-emerald-950/20 p-4 text-sm font-semibold text-emerald-100"
                    : "rounded-lg border border-amber-900/50 bg-amber-950/20 p-4 text-sm font-semibold text-amber-100"
                }
              >
                {majorFortuneCtaLabel}
              </p>
            </section>

            <aside className="space-y-3 rounded-lg border border-[#4a3434] bg-[#171211]/70 p-5 text-sm leading-6 text-[#cfc5b8]">
              <p className="font-semibold text-[#fffaf0]">샘플 보기</p>
              <p>
                현재 화면은 대운 전용 입력 흐름을 연결하기 위한 준비 화면입니다.
                현재 입력값으로 실제 리포트를 생성하지 않습니다.
              </p>
              <p>
                실제 생성, 결제, 저장은 이후 단계에서 연결합니다.
              </p>
              <p className="break-words text-[#c79a43]">
                /dev/major-fortune-preview?fixture=deokmin-current-major-fortune
              </p>
            </aside>
          </form>
        </section>
      </main>
    );
  }

  if (selectedProduct.productKey === ANNUAL_FORTUNE_PRODUCT_KEY) {
    return (
      <main className="min-h-screen bg-[#171211] px-5 py-8 text-[#fffaf0] sm:px-8 lg:px-10">
        <section className="mx-auto max-w-5xl space-y-8">
          <header className="max-w-3xl space-y-4 animate-[gyeol-reveal_520ms_ease-out]">
            <p className="text-sm font-bold tracking-[0.18em] text-[#c79a43]">
              Gyeol Report
            </p>
            <h1 className="text-4xl font-bold tracking-normal text-[#fffaf0]">
              세운 리포트 입력
            </h1>
            <p className="max-w-2xl text-base leading-8 text-[#cfc5b8]">
              세운은 선택한 한 해의 흐름을 보는 리포트입니다.
            </p>
            <p className="max-w-2xl rounded-lg border border-[#4a3434] bg-[#211817]/80 px-4 py-3 text-sm leading-6 text-[#cfc5b8]">
              {SINGLE_PRODUCT_CONTEXT_NOTICE_KO}
              실제 생성/결제 연결은 준비 중입니다.
            </p>
          </header>

          <form
            onSubmit={handlePreviewOnlySubmit}
            className="grid gap-6"
          >
            <input type="hidden" name="timezone" value="Asia/Seoul" />
            <input type="hidden" name="calendarType" value="SOLAR" />
            <input
              type="hidden"
              name="productKey"
              value={selectedProduct.productKey}
            />
            <input
              type="hidden"
              name="productSlug"
              value={selectedProduct.slug}
            />
            <input
              type="hidden"
              name="productName"
              value={selectedProduct.nameKo}
            />

            <section className="space-y-5 rounded-lg border border-[#4a3434] bg-[#211817]/90 p-5 shadow-xl shadow-black/20">
              <div className="space-y-2">
                <p className="text-sm font-bold text-[#c79a43]">
                  공통 입력값
                </p>
                <p className="text-sm leading-6 text-[#cfc5b8]">
                  모든 단독 인물 리포트가 공유하는 기본 정보입니다.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="annualName"
                    className="block text-sm font-medium text-neutral-200"
                  >
                    이름
                  </label>
                  <input
                    id="annualName"
                    name="name"
                    type="text"
                    value={annualFortuneInput.name}
                    maxLength={20}
                    placeholder="이름을 입력해 주세요"
                    onChange={(event) =>
                      setAnnualFortuneInput({
                        ...annualFortuneInput,
                        name: event.target.value,
                      })
                    }
                    className="w-full min-w-0 rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-neutral-50 outline-none placeholder:text-neutral-600 focus:border-neutral-400"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="annualBirthDate"
                    className="block text-sm font-medium text-neutral-200"
                  >
                    생년월일
                  </label>
                  <input
                    id="annualBirthDate"
                    name="birthDate"
                    type="date"
                    value={annualFortuneInput.birthDate}
                    style={{ colorScheme: "dark" }}
                    onChange={(event) =>
                      setAnnualFortuneInput({
                        ...annualFortuneInput,
                        birthDate: event.target.value,
                      })
                    }
                    className="w-full min-w-0 rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-neutral-50 outline-none focus:border-neutral-400"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="annualBirthTime"
                    className="block text-sm font-medium text-neutral-200"
                  >
                    출생시간
                  </label>
                  <input
                    id="annualBirthTime"
                    name="birthTime"
                    type="time"
                    value={annualFortuneInput.birthTime}
                    style={{ colorScheme: "dark" }}
                    onChange={(event) =>
                      setAnnualFortuneInput({
                        ...annualFortuneInput,
                        birthTime: event.target.value,
                        birthTimeUnknown: false,
                      })
                    }
                    className="w-full min-w-0 rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-neutral-50 outline-none focus:border-neutral-400"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="annualTimeBranch"
                    className="block text-sm font-medium text-neutral-200"
                  >
                    대략적인 시간대
                  </label>
                  <select
                    id="annualTimeBranch"
                    name="timeBranch"
                    value={annualFortuneInput.timeBranch}
                    onChange={(event) =>
                      setAnnualFortuneInput({
                        ...annualFortuneInput,
                        timeBranch: event.target.value as TimeBranchSelection,
                        birthTimeUnknown: false,
                      })
                    }
                    className="w-full min-w-0 rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-neutral-50 outline-none focus:border-neutral-400"
                  >
                    <option value="">시간대를 선택해 주세요</option>
                    {timeBranches.map((branch) => (
                      <option key={branch.value} value={branch.value}>
                        {branch.labelKo}
                      </option>
                    ))}
                  </select>
                </div>

                <label className="flex min-h-12 items-center gap-3 rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm font-medium text-neutral-200">
                  <input
                    type="checkbox"
                    name="birthTimeUnknown"
                    checked={annualFortuneInput.birthTimeUnknown}
                    onChange={(event) =>
                      setAnnualFortuneInput({
                        ...annualFortuneInput,
                        birthTimeUnknown: event.target.checked,
                        birthTime: event.target.checked
                          ? ""
                          : annualFortuneInput.birthTime,
                        timeBranch: event.target.checked
                          ? ""
                          : annualFortuneInput.timeBranch,
                      })
                    }
                    className="h-4 w-4"
                  />
                  출생시간 모름
                </label>

                <div className="space-y-2">
                  <label
                    htmlFor="annualGender"
                    className="block text-sm font-medium text-neutral-200"
                  >
                    성별
                  </label>
                  <select
                    id="annualGender"
                    name="gender"
                    value={annualFortuneInput.gender}
                    onChange={(event) =>
                      setAnnualFortuneInput({
                        ...annualFortuneInput,
                        gender: event.target.value,
                      })
                    }
                    className="w-full min-w-0 rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-neutral-50 outline-none focus:border-neutral-400"
                  >
                    <option value="">선택</option>
                    <option value="MALE">남성</option>
                    <option value="FEMALE">여성</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="annualMbtiType"
                    className="block text-sm font-medium text-neutral-200"
                  >
                    MBTI
                  </label>
                  <select
                    id="annualMbtiType"
                    name="mbtiType"
                    value={annualFortuneInput.mbtiType}
                    onChange={(event) =>
                      setAnnualFortuneInput({
                        ...annualFortuneInput,
                        mbtiType: event.target.value,
                      })
                    }
                    className="w-full min-w-0 rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-neutral-50 outline-none focus:border-neutral-400"
                  >
                    <option value="">선택</option>
                    {mbtiTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="annualRelationshipStatus"
                    className="block text-sm font-medium text-neutral-200"
                  >
                    현재 연애 상태
                  </label>
                  <select
                    id="annualRelationshipStatus"
                    name="relationshipStatus"
                    value={annualFortuneInput.relationshipStatus}
                    onChange={(event) =>
                      setAnnualFortuneInput({
                        ...annualFortuneInput,
                        relationshipStatus: event.target.value,
                      })
                    }
                    className="w-full min-w-0 rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-neutral-50 outline-none focus:border-neutral-400"
                  >
                    {annualRelationshipStatusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.labelKo}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="annualJobStatus"
                    className="block text-sm font-medium text-neutral-200"
                  >
                    직업 상태
                  </label>
                  <select
                    id="annualJobStatus"
                    name="jobStatus"
                    value={annualFortuneInput.jobStatus}
                    onChange={(event) =>
                      setAnnualFortuneInput({
                        ...annualFortuneInput,
                        jobStatus: event.target.value,
                      })
                    }
                    className="w-full min-w-0 rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-neutral-50 outline-none placeholder:text-neutral-600 focus:border-neutral-400"
                  >
                    {annualJobStatusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.labelKo}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label
                    htmlFor="annualDetailedJob"
                    className="block text-sm font-medium text-neutral-200"
                  >
                    세부 직업
                  </label>
                  <input
                    id="annualDetailedJob"
                    name="detailedJob"
                    type="text"
                    value={annualFortuneInput.detailedJob}
                    list="annualDetailedJobOptions"
                    placeholder="예: 서비스 기획자"
                    onChange={(event) =>
                      setAnnualFortuneInput({
                        ...annualFortuneInput,
                        detailedJob: event.target.value,
                      })
                    }
                    className="w-full min-w-0 rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-neutral-50 outline-none placeholder:text-neutral-600 focus:border-neutral-400"
                  />
                  <datalist id="annualDetailedJobOptions">
                    {annualDetailedJobOptions.map((option) => (
                      <option key={option} value={option} />
                    ))}
                  </datalist>
                  <p className="text-xs leading-5 text-neutral-500">
                    예: 고등학생, 대학생, 개발자, 서비스 기획자, 디자이너,
                    마케터, 변호사, 의사, 교사, 유튜버, 인플루언서,
                    연예인, 자영업자, 기타 직접 입력
                  </p>
                </div>

              </div>
            </section>

            <section className="space-y-5 rounded-lg border border-[#4a3434] bg-[#211817]/90 p-5 shadow-xl shadow-black/20">
              <div className="space-y-2">
                <p className="text-sm font-bold text-[#c79a43]">
                  세운 전용 조회 연도
                </p>
                <p className="text-sm leading-6 text-[#cfc5b8]">
                  기본값은 현재 연도입니다. 과거 5년과 올해를 우선 조회하고,
                  12월 1일 이후에는 다음 해 신년사주 미리보기가 열립니다.
                </p>
                <p className="text-sm leading-6 text-[#92877b]">
                  2년 이상 미래 조회는 아직 준비 중이며, 과거 10년 조회는
                  2차 확장으로 안내합니다.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                <div className="space-y-2">
                  <label
                    htmlFor="selectedYear"
                    className="block text-sm font-medium text-neutral-200"
                  >
                    조회 연도
                  </label>
                  <input
                    id="selectedYear"
                    name="selectedYear"
                    type="number"
                    inputMode="numeric"
                    value={annualFortuneInput.selectedYear}
                    onChange={(event) =>
                      setAnnualFortuneInput({
                        ...annualFortuneInput,
                        selectedYear: event.target.value,
                      })
                    }
                    className="w-full min-w-0 rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-neutral-50 outline-none focus:border-neutral-400"
                  />
                </div>
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  className="min-h-12 rounded-lg border border-[#c79a43]/40 bg-[#2c1e1f] px-5 py-3 text-sm font-bold text-[#c79a43]/80"
                >
                  {annualFortuneCtaLabel}
                </button>
              </div>
            </section>

            <section className="space-y-5 rounded-lg border border-[#4a3434] bg-[#211817]/90 p-5 shadow-xl shadow-black/20">
              <div className="space-y-2">
                <p className="text-sm font-bold text-[#c79a43]">
                  입력 확인 요약
                </p>
                <p className="text-sm leading-6 text-[#cfc5b8]">
                  현재 입력값이 세운 리포트에 어떻게 반영되는지 확인합니다.
                </p>
              </div>

              <dl className="grid gap-3 text-sm lg:grid-cols-2">
                <div className="rounded-lg border border-neutral-800 bg-neutral-950/70 p-4">
                  <dt className="font-semibold text-neutral-200">기본 정보</dt>
                  <dd className="mt-2 space-y-1 text-neutral-400">
                    <p>이름: {annualFortuneInput.name.trim() || "미입력"}</p>
                    <p>생년월일: {annualFortuneInput.birthDate || "미입력"}</p>
                    <p>
                      출생시간: {formatAnnualBirthTimeSummary(annualFortuneInput)}
                    </p>
                    <p>성별: {formatGenderLabel(annualFortuneInput.gender)}</p>
                    <p>MBTI: {annualFortuneInput.mbtiType || "미선택"}</p>
                  </dd>
                </div>

                <div className="rounded-lg border border-neutral-800 bg-neutral-950/70 p-4">
                  <dt className="font-semibold text-neutral-200">현실 맥락</dt>
                  <dd className="mt-2 space-y-1 text-neutral-400">
                    <p>
                      현재 연애 상태:{" "}
                      {formatAnnualRelationshipStatus(
                        annualFortuneInput.relationshipStatus,
                      )}
                    </p>
                    <p>
                      직업 상태:{" "}
                      {formatAnnualJobStatus(annualFortuneInput.jobStatus)}
                    </p>
                    <p>
                      세부 직업:{" "}
                      {annualFortuneInput.detailedJob.trim() || "미입력"}
                    </p>
                  </dd>
                </div>

                <div className="rounded-lg border border-neutral-800 bg-neutral-950/70 p-4">
                  <dt className="font-semibold text-neutral-200">조회 연도</dt>
                  <dd className="mt-2 text-neutral-400">
                    {annualFortuneInput.selectedYear || "미입력"}
                  </dd>
                </div>

                <div className="rounded-lg border border-neutral-800 bg-neutral-950/70 p-4">
                  <dt className="font-semibold text-neutral-200">
                    선택한 리포트
                  </dt>
                  <dd className="mt-2 space-y-1 text-neutral-400">
                    <p>리포트 종류: {selectedProduct.nameKo}</p>
                    <p>생성 방식: 미리보기 준비</p>
                  </dd>
                </div>
              </dl>

              <p
                className={
                  isAnnualFortuneInputReady
                    ? "rounded-lg border border-emerald-900/50 bg-emerald-950/20 p-4 text-sm font-semibold text-emerald-100"
                    : "rounded-lg border border-amber-900/50 bg-amber-950/20 p-4 text-sm font-semibold text-amber-100"
                }
              >
                {annualFortuneCtaLabel}
              </p>
            </section>

            <aside className="space-y-3 rounded-lg border border-[#4a3434] bg-[#171211]/70 p-5 text-sm leading-6 text-[#cfc5b8]">
              <p className="font-semibold text-[#fffaf0]">샘플 보기</p>
              <p>
                현재 화면은 세운 전용 입력 흐름을 연결하기 위한 준비 화면입니다.
                현재 입력값으로 실제 리포트를 생성하지 않습니다.
              </p>
              <p>
                실제 생성, 결제, 저장은 이후 단계에서 연결합니다.
              </p>
              <p className="break-words text-[#c79a43]">
                /dev/annual-fortune-preview?fixture=deokmin-2026-current
              </p>
            </aside>
          </form>
        </section>
      </main>
    );
  }

  if (selectedProduct.productKey === COMPATIBILITY_PRODUCT_KEY) {
    return (
      <main className="min-h-screen bg-[#171211] px-5 py-8 text-[#fffaf0] sm:px-8 lg:px-10">
        <section className="mx-auto max-w-6xl space-y-8">
          <header className="max-w-3xl space-y-4 animate-[gyeol-reveal_520ms_ease-out]">
            <p className="text-sm font-bold tracking-[0.18em] text-[#c79a43]">
              Gyeol Report
            </p>
            <h1 className="text-4xl font-bold tracking-normal text-[#fffaf0]">
              궁합 리포트 입력
            </h1>
            <p className="max-w-2xl text-base leading-8 text-[#cfc5b8]">
              두 사람의 생년월일, 출생시간, MBTI, 관계 카테고리를
              바탕으로 궁합 리포트를 구성합니다.
            </p>
            <p className="max-w-2xl rounded-lg border border-[#4a3434] bg-[#211817]/80 px-4 py-3 text-sm leading-6 text-[#cfc5b8]">
              상담이나 예언이 아닌 관계 분석용 디지털 리포트입니다.
            </p>
          </header>

          <form onSubmit={handleCompatibilityPreviewSubmit} className="grid gap-6">
            <input type="hidden" name="timezone" value="Asia/Seoul" />
            <input type="hidden" name="calendarType" value="SOLAR" />
            <input
              type="hidden"
              name="productKey"
              value={selectedProduct.productKey}
            />
            <input
              type="hidden"
              name="productSlug"
              value={selectedProduct.slug}
            />
            <input
              type="hidden"
              name="productName"
              value={selectedProduct.nameKo}
            />

            <div className="grid gap-5 lg:grid-cols-2">
              {renderCompatibilityPersonInputSection({
                prefix: "personA",
                titleKo: "A 사람 입력",
                descriptionKo: "첫 번째 사람의 기본 정보를 입력합니다.",
                value: compatibilityPersonA,
                onChange: setCompatibilityPersonA,
              })}
              {renderCompatibilityPersonInputSection({
                prefix: "personB",
                titleKo: "B 사람 입력",
                descriptionKo: "두 번째 사람의 기본 정보를 입력합니다.",
                value: compatibilityPersonB,
                onChange: setCompatibilityPersonB,
              })}
            </div>

            <section className="space-y-5 rounded-lg border border-[#4a3434] bg-[#211817]/90 p-5 shadow-xl shadow-black/20">
              <div className="space-y-2">
                <p className="text-sm font-bold text-[#c79a43]">
                  관계 카테고리
                </p>
                <p className="text-sm leading-6 text-[#cfc5b8]">
                  같은 두 사람이라도 관계 맥락에 따라 해석 초점이 달라집니다.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                <div className="space-y-2">
                  <label
                    htmlFor="relationshipType"
                    className="block text-sm font-medium text-neutral-200"
                  >
                    관계 선택
                  </label>
                  <select
                    id="relationshipType"
                    name="relationshipType"
                    value={compatibilityRelationshipType}
                    onChange={(event) =>
                      setCompatibilityRelationshipType(
                        event.target.value as CompatibilityRelationshipTypeSelection,
                      )
                    }
                    className="w-full min-w-0 rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-neutral-50 outline-none focus:border-neutral-400"
                  >
                    {compatibilityRelationshipOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.labelKo}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={!isCompatibilityInputReady || isCompatibilitySubmitting}
                  aria-disabled={!isCompatibilityInputReady || isCompatibilitySubmitting}
                  className={
                    isCompatibilityInputReady && !isCompatibilitySubmitting
                      ? "min-h-12 rounded-lg border border-[#c79a43] bg-[#c79a43] px-5 py-3 text-sm font-bold text-[#171211] transition hover:bg-[#d8ad58]"
                      : "min-h-12 rounded-lg border border-[#c79a43]/40 bg-[#2c1e1f] px-5 py-3 text-sm font-bold text-[#c79a43]/80"
                  }
                >
                  {compatibilityCtaLabel}
                </button>
              </div>
            </section>

            <section className="space-y-5 rounded-lg border border-[#4a3434] bg-[#211817]/90 p-5 shadow-xl shadow-black/20">
              <div className="space-y-2">
                <p className="text-sm font-bold text-[#c79a43]">
                  입력 확인 요약
                </p>
                <p className="text-sm leading-6 text-[#cfc5b8]">
                  현재 입력값이 궁합 리포트에 어떻게 반영되는지 확인합니다.
                </p>
              </div>

              <dl className="grid gap-3 text-sm lg:grid-cols-2">
                <div className="rounded-lg border border-neutral-800 bg-neutral-950/70 p-4">
                  <dt className="font-semibold text-neutral-200">A 사람</dt>
                  <dd className="mt-2 space-y-1 text-neutral-400">
                    <p>이름: {compatibilityPersonA.name.trim() || "미입력"}</p>
                    <p>생년월일: {compatibilityPersonA.birthDate || "미입력"}</p>
                    <p>
                      출생시간:{" "}
                      {formatCompatibilityBirthTimeSummary(compatibilityPersonA)}
                    </p>
                    <p>성별: {formatGenderLabel(compatibilityPersonA.gender)}</p>
                    <p>MBTI: {compatibilityPersonA.mbtiType || "미선택"}</p>
                  </dd>
                </div>

                <div className="rounded-lg border border-neutral-800 bg-neutral-950/70 p-4">
                  <dt className="font-semibold text-neutral-200">B 사람</dt>
                  <dd className="mt-2 space-y-1 text-neutral-400">
                    <p>이름: {compatibilityPersonB.name.trim() || "미입력"}</p>
                    <p>생년월일: {compatibilityPersonB.birthDate || "미입력"}</p>
                    <p>
                      출생시간:{" "}
                      {formatCompatibilityBirthTimeSummary(compatibilityPersonB)}
                    </p>
                    <p>성별: {formatGenderLabel(compatibilityPersonB.gender)}</p>
                    <p>MBTI: {compatibilityPersonB.mbtiType || "미선택"}</p>
                  </dd>
                </div>

                <div className="rounded-lg border border-neutral-800 bg-neutral-950/70 p-4">
                  <dt className="font-semibold text-neutral-200">
                    관계 카테고리
                  </dt>
                  <dd className="mt-2 text-neutral-400">
                    {compatibilityRelationshipLabel} · {compatibilityRelationshipType}
                  </dd>
                </div>

                <div className="rounded-lg border border-neutral-800 bg-neutral-950/70 p-4">
                  <dt className="font-semibold text-neutral-200">
                    선택한 리포트
                  </dt>
                  <dd className="mt-2 space-y-1 text-neutral-400">
                    <p>리포트 종류: {selectedProduct.nameKo}</p>
                    <p>생성 방식: 입력값 기반 미리보기</p>
                  </dd>
                </div>
              </dl>

              <p
                className={
                  isCompatibilityInputReady
                    ? "rounded-lg border border-emerald-900/50 bg-emerald-950/20 p-4 text-sm font-semibold text-emerald-100"
                    : "rounded-lg border border-amber-900/50 bg-amber-950/20 p-4 text-sm font-semibold text-amber-100"
                }
              >
                {compatibilityCtaLabel}
              </p>
              {compatibilitySubmitError ? (
                <p className="rounded-lg border border-rose-900/50 bg-rose-950/25 p-4 text-sm font-semibold text-rose-100">
                  {compatibilitySubmitError}
                </p>
              ) : null}
            </section>

            <aside className="space-y-3 rounded-lg border border-[#4a3434] bg-[#171211]/70 p-5 text-sm leading-6 text-[#cfc5b8]">
              <p className="font-semibold text-[#fffaf0]">샘플 보기</p>
              <p>
                입력한 정보를 바탕으로 궁합 미리보기 리포트를 생성합니다.
                결제와 유료 저장은 이후 단계에서 연결합니다.
              </p>
              <p>
                아래 링크는 입력과 무관한 샘플 미리보기입니다.
              </p>
              <p className="break-words text-[#c79a43]">
                /dev/compatibility-preview?fixture=deokmin-sodam-love
              </p>
            </aside>
          </form>
        </section>
      </main>
    );
  }

  function isBirthTimeStepValid(): boolean {
    if (birthTimeMode === "unknown") {
      return true;
    }

    if (birthTimeMode === "branch") {
      return timeBranch !== "";
    }

    return /^\d{2}:\d{2}$/.test(birthTime);
  }

  function goToPreviousStep() {
    setStepError("");
    setCurrentStep((step) => Math.max(0, step - 1) as ReportInputStep);
  }

  function goToNextStep() {
    if (
      currentStep === 0 &&
      (displayName.trim().length === 0 || birthDate.trim().length === 0)
    ) {
      setStepError("이름과 생년월일을 입력해 주세요.");
      return;
    }

    if (currentStep === 1 && !isBirthTimeStepValid()) {
      setStepError(
        "출생시간을 입력하거나, 대략적인 시간대 또는 모름을 선택해 주세요.",
      );
      return;
    }

    if (currentStep === 2 && (gender.trim().length === 0 || mbtiType === "")) {
      setStepError("성별과 MBTI를 선택해 주세요.");
      return;
    }

    setStepError("");
    setCurrentStep((step) =>
      Math.min(reportInputSteps.length - 1, step + 1) as ReportInputStep,
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (currentStep !== 3) {
      goToNextStep();
    }
  }

  return (
    <main className="min-h-screen bg-[#171211] px-5 py-8 text-[#fffaf0] sm:px-8 lg:px-10">
      <section className="mx-auto max-w-6xl space-y-8">
        <header className="max-w-3xl space-y-4 animate-[gyeol-reveal_520ms_ease-out]">
          <p className="text-sm font-bold tracking-[0.18em] text-[#c79a43]">
            Gyeol Report
          </p>
          <h1 className="text-4xl font-bold tracking-normal text-[#fffaf0]">
            {selectedProduct.inputTitleKo}
          </h1>
          <p className="max-w-2xl text-base leading-8 text-[#cfc5b8]">
            {selectedProduct.introKo}
          </p>
          <div className="inline-flex flex-wrap items-center gap-2 rounded-lg border border-[#4a3434] bg-[#211817]/80 px-4 py-3 text-sm">
            <span className="font-semibold text-[#92877b]">선택 상품</span>
            <span className="font-bold text-[#fffaf0]">
              {selectedProduct.nameKo}
            </span>
            <span className="rounded-full border border-[#c79a43]/35 px-2 py-0.5 text-xs font-bold text-[#c79a43]">
              {selectedProduct.statusLabelKo}
            </span>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[22rem_1fr] lg:items-start">
          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-lg border border-[#4a3434] bg-[#211817]/90 p-5 shadow-2xl shadow-black/25 lg:sticky lg:top-8"
          >
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-[#fffaf0]">
                {selectedStep.labelKo} · {selectedStep.titleKo}
              </h2>
              <p className="text-sm leading-6 text-[#cfc5b8]">
                입력한 정보는 결제 주문 정보와 함께 보관되어 이후 전체 리포트
                생성에 사용됩니다.
              </p>
            </div>

            <div className="space-y-3 rounded-lg border border-[#4a3434] bg-[#171211]/70 p-4">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-semibold text-[#fffaf0]">
                  {currentStep + 1} / {reportInputSteps.length}
                </p>
                <p className="text-right text-sm text-[#cfc5b8]">
                  {selectedStep.labelKo} · {selectedStep.titleKo}
                </p>
              </div>
              <div
                aria-label="진행률"
                className="h-2 overflow-hidden rounded-full bg-[#3a2c29]"
              >
                <div
                  className="h-full rounded-full bg-[#c79a43] transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <ol className="grid gap-2 text-xs text-[#92877b] sm:grid-cols-4">
                {reportInputSteps.map((step) => (
                  <li
                    key={step.step}
                    className={
                      step.step === currentStep
                        ? "rounded-lg border border-[#c79a43]/60 bg-[#2c1e1f] px-3 py-2 text-[#fffaf0]"
                        : "rounded-lg border border-[#4a3434] px-3 py-2"
                    }
                  >
                    <span className="font-semibold">{step.labelKo}</span>
                    <span className="ml-2">{step.titleKo}</span>
                  </li>
                ))}
              </ol>
            </div>

            <input type="hidden" name="timezone" value="Asia/Seoul" />
            <input type="hidden" name="calendarType" value="SOLAR" />
            <input
              type="hidden"
              name="productKey"
              value={selectedProduct.productKey}
            />
            <input
              type="hidden"
              name="productSlug"
              value={selectedProduct.slug}
            />
            <input
              type="hidden"
              name="productName"
              value={selectedProduct.nameKo}
            />
            <input
              type="hidden"
              name="birthTimeUnknown"
              value={birthTimeUnknown ? "on" : ""}
            />

            {currentStep === 0 ? (
              <div className="space-y-5">
                <div className="space-y-2">
                  <label
                    htmlFor="displayName"
                    className="block text-sm font-medium text-neutral-200"
                  >
                    이름
                  </label>
                  <input
                    id="displayName"
                    name="displayName"
                    type="text"
                    value={displayName}
                    maxLength={20}
                    onChange={(event) => setDisplayName(event.target.value)}
                    placeholder="이름을 입력해 주세요"
                    className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-neutral-50 outline-none placeholder:text-neutral-600 focus:border-neutral-400"
                  />
                  <p className="text-xs leading-5 text-neutral-500">
                    리포트에서 불러드릴 이름입니다. 사주 계산에는 사용하지 않습니다.
                  </p>
                </div>

                <div className="space-y-3 rounded-lg border border-neutral-800 bg-neutral-950/70 p-4">
                  <p className="text-sm font-semibold text-neutral-100">
                    양력 기준 생년월일
                  </p>
                  <p className="text-sm leading-6 text-neutral-400">
                    현재 V1은 양력 기준 생년월일만 지원합니다.
                  </p>
                  <p className="text-sm leading-6 text-neutral-500">
                    음력 생일 입력은 추후 지원 예정입니다.
                  </p>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="birthDate"
                    className="block text-sm font-medium text-neutral-200"
                  >
                    생년월일
                  </label>
                  <div className="relative">
                    <input
                      id="birthDate"
                      name="birthDate"
                      type="date"
                      value={birthDate}
                      onChange={(event) => {
                        setBirthDate(event.target.value);
                        setStepError("");
                      }}
                      style={{ colorScheme: "dark" }}
                      className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 pr-24 text-neutral-50 outline-none focus:border-neutral-400"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs font-medium text-neutral-300">
                      날짜 선택
                    </span>
                  </div>
                  <p className="text-xs leading-5 text-neutral-500">
                    예: 1996-12-06 형식으로 입력해 주세요.
                  </p>
                </div>
              </div>
            ) : null}

            {currentStep === 1 ? (
              <div className="space-y-5">
                <fieldset className="space-y-3">
                  <legend className="text-sm font-medium text-neutral-200">
                    출생시간
                  </legend>
                  <div className="grid gap-3">
                    {[
                      { value: "exact", labelKo: "정확한 시간" },
                      { value: "branch", labelKo: "대략적인 시간대" },
                      { value: "unknown", labelKo: "출생시간 모름" },
                    ].map((mode) => (
                      <label
                        key={mode.value}
                        className="flex items-center gap-3 rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm font-medium text-neutral-200"
                      >
                        <input
                          type="radio"
                          checked={birthTimeMode === mode.value}
                          onChange={() => {
                            setBirthTimeMode(mode.value as BirthTimeMode);
                            setStepError("");
                          }}
                          className="h-4 w-4"
                        />
                        {mode.labelKo}
                      </label>
                    ))}
                  </div>
                </fieldset>

                {birthTimeMode === "exact" ? (
                  <div className="space-y-2">
                    <label
                      htmlFor="birthTime"
                      className="block text-sm font-medium text-neutral-200"
                    >
                      출생시간
                    </label>
                    <div className="relative">
                      <input
                        id="birthTime"
                        name="birthTime"
                        type="time"
                        value={birthTime}
                        onChange={(event) => {
                          setBirthTime(event.target.value);
                          setStepError("");
                        }}
                        style={{ colorScheme: "dark" }}
                        className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 pr-24 text-neutral-50 outline-none focus:border-neutral-400"
                      />
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs font-medium text-neutral-300">
                        시간 선택
                      </span>
                    </div>
                    <p className="text-xs leading-5 text-neutral-500">
                      예: 오후 3시 12분이면 15:12로 입력해 주세요.
                    </p>
                  </div>
                ) : null}

                {birthTimeMode === "branch" ? (
                  <div className="space-y-2">
                    <label
                      htmlFor="timeBranch"
                      className="block text-sm font-medium text-neutral-200"
                    >
                      대략적인 시간대
                    </label>
                    <select
                      id="timeBranch"
                      value={timeBranch}
                      onChange={(event) => {
                        setTimeBranch(event.target.value as TimeBranchSelection);
                        setStepError("");
                      }}
                      className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-neutral-50 outline-none focus:border-neutral-400"
                    >
                      <option value="">시간대를 선택해 주세요</option>
                      {timeBranches.map((branch) => (
                        <option key={branch.value} value={branch.value}>
                          {branch.labelKo}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}

                {birthTimeMode === "unknown" ? (
                  <p className="rounded-lg border border-neutral-800 bg-neutral-950 p-4 text-sm leading-6 text-neutral-400">
                    출생시간을 모르면 시주 없이 일부 해석이 제한될 수 있습니다.
                  </p>
                ) : null}

                {shouldShowMidnightBoundaryWarning ? (
                  <div className="space-y-2 rounded-lg border border-amber-900/50 bg-amber-950/20 p-4 text-sm leading-6 text-amber-100/90">
                    <p>
                      자정 전후 출생은 날짜 기준에 따라 일주·시주 해석이 달라질 수 있습니다.
                    </p>
                    <p>
                      가능하면 가족에게 실제 출생일과 시간을 다시 확인해 주세요.
                    </p>
                  </div>
                ) : null}
              </div>
            ) : null}

            {currentStep === 2 ? (
              <div className="space-y-5">
                <div className="space-y-2">
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium text-neutral-200"
                  >
                    성별
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={gender}
                    onChange={(event) => {
                      setGender(event.target.value);
                      setStepError("");
                    }}
                    className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-neutral-50 outline-none focus:border-neutral-400"
                  >
                    <option value="">선택</option>
                    <option value="MALE">남성</option>
                    <option value="FEMALE">여성</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="mbtiType"
                    className="block text-sm font-medium text-neutral-200"
                  >
                    MBTI
                  </label>
                  <select
                    id="mbtiType"
                    name="mbtiType"
                    value={mbtiType}
                    onChange={(event) => {
                      setMbtiType(event.target.value);
                      setStepError("");
                    }}
                    className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-neutral-50 outline-none focus:border-neutral-400"
                  >
                    <option value="">선택</option>
                    {mbtiTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs leading-5 text-neutral-500">
                    MBTI는 내가 생각하는 나의 모습이 반영될 수 있습니다. 가능하면 여러 번의 검사 결과나 가까운 사람의 피드백도 함께 참고해 주세요.
                  </p>
                </div>
              </div>
            ) : null}

            {currentStep === 3 ? (
              <div className="space-y-5">
                <section className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-950/70 p-4">
                  <div className="space-y-2">
                    <h3 className="text-base font-semibold text-neutral-100">
                      입력값 최종 확인
                    </h3>
                    <p className="text-sm leading-6 text-neutral-400">
                      입력한 정보로 전체 리포트를 생성합니다. 결제 승인 후 리포트가 생성되며, 결과는 온라인 열람 페이지로 제공됩니다.
                    </p>
                  </div>
                  <dl className="grid gap-3 text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="text-neutral-500">선택 상품</dt>
                      <dd className="text-right text-neutral-200">
                        {selectedProduct.nameKo}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-neutral-500">이름</dt>
                      <dd className="text-right text-neutral-200">
                        {displayName.trim() || "미입력"}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-neutral-500">생년월일</dt>
                      <dd className="text-right text-neutral-200">
                        {birthDate || "미입력"}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-neutral-500">출생시간</dt>
                      <dd className="text-right text-neutral-200">
                        {birthTimeSummary}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-neutral-500">성별</dt>
                      <dd className="text-right text-neutral-200">
                        {formatGenderLabel(gender)}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-neutral-500">MBTI</dt>
                      <dd className="text-right text-neutral-200">
                        {mbtiType || "미선택"}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-neutral-500">달력</dt>
                      <dd className="text-right text-neutral-200">
                        {formatCalendarTypeLabel("SOLAR")}
                      </dd>
                    </div>
                  </dl>
                </section>

                <section className="space-y-4 rounded-lg border border-sky-200 bg-white p-4 text-neutral-950">
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-sky-700">
                      {isSelectedProductPurchasable
                        ? "전체 리포트"
                        : "미리보기 상품"}
                    </p>
                    <h3 className="text-xl font-extrabold">
                      {selectedProduct.nameKo}
                    </h3>
                    <p className="text-sm leading-6 text-neutral-600">
                      {selectedProduct.formatLabelKo} ·{" "}
                      {selectedProduct.deliveryTypeKo}
                    </p>
                  </div>
                  {isSelectedProductPurchasable ? (
                    <dl className="grid gap-3 text-sm sm:grid-cols-3">
                      <div
                        aria-label={ACTIVE_REPORT_LIST_PRICE_LABEL_KO}
                        className="rounded-lg border border-neutral-200 bg-neutral-50 p-3"
                      >
                        <dt className="text-neutral-500">정가</dt>
                        <dd className="mt-1 font-semibold text-neutral-400 line-through">
                          {selectedProduct.listPriceKo}
                        </dd>
                      </div>
                      <div
                        aria-label={ACTIVE_REPORT_SALE_PRICE_LABEL_KO}
                        className="rounded-lg border border-rose-200 bg-rose-50 p-3"
                      >
                        <dt className="text-rose-700">런칭가</dt>
                        <dd className="mt-1 text-xl font-extrabold text-rose-700">
                          {selectedProduct.priceKo}
                        </dd>
                      </div>
                      <div
                        aria-label={ACTIVE_REPORT_PAYMENT_PRICE_LABEL_KO}
                        className="rounded-lg border border-neutral-200 bg-neutral-50 p-3"
                      >
                        <dt className="text-neutral-500">결제금액</dt>
                        <dd className="mt-1 font-bold text-neutral-950">
                          {selectedProduct.priceKo}
                        </dd>
                      </div>
                    </dl>
                  ) : (
                    <dl className="grid gap-3 text-sm sm:grid-cols-3">
                      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
                        <dt className="text-neutral-500">상태</dt>
                        <dd className="mt-1 font-bold text-neutral-950">
                          {selectedProduct.statusLabelKo}
                        </dd>
                      </div>
                      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
                        <dt className="text-neutral-500">리포트 종류</dt>
                        <dd className="mt-1 font-bold text-neutral-950">
                          {selectedProduct.nameKo}
                        </dd>
                      </div>
                      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
                        <dt className="text-neutral-500">생성 방식</dt>
                        <dd className="mt-1 font-bold text-neutral-950">
                          미리보기 준비
                        </dd>
                      </div>
                    </dl>
                  )}

                  {isSelectedProductPurchasable && !isCheckoutInputComplete ? (
                    <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-900">
                      {REQUIRED_CHECKOUT_INPUT_MESSAGE_KO}
                    </p>
                  ) : null}

                  {isSelectedProductPurchasable ? (
                    DEV_TOSS_CHECKOUT_LAUNCHER_UI_ENABLED ? (
                      <DevTossCheckoutLauncher
                        inputSnapshot={checkoutInputSnapshot}
                        ctaLabelKo={CHECKOUT_CTA_LABEL_KO}
                        onEditInput={() => {
                          setStepError("");
                          setCurrentStep(0);
                        }}
                      />
                    ) : (
                      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                        <p className="text-sm font-semibold text-neutral-900">
                          정식 결제 연결 준비 중입니다.
                        </p>
                        <p className="mt-2 text-sm leading-6 text-neutral-600">
                          심사 및 결제 승인 연동 후 전체 리포트 구매가 가능합니다.
                        </p>
                      </div>
                    )
                  ) : (
                    <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                      <p className="text-sm font-semibold text-neutral-900">
                        {selectedProduct.nameKo} 생성 준비 흐름입니다.
                      </p>
                      <p className="mt-2 text-sm leading-6 text-neutral-600">
                        입력값과 선택한 리포트 정보를 유지합니다. 정식 결제와
                        유료 생성은 별도 연결 단계에서 활성화합니다.
                      </p>
                    </div>
                  )}
                </section>
              </div>
            ) : null}

            {stepError ? (
              <p className="rounded-lg border border-red-900/60 bg-red-950/30 p-4 text-sm leading-6 text-red-100">
                {stepError}
              </p>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-2">
              {currentStep > 0 ? (
                <button
                  type="button"
                  onClick={goToPreviousStep}
                  className="rounded-lg border border-neutral-700 px-5 py-4 font-semibold text-neutral-200 transition hover:bg-neutral-800"
                >
                  이전
                </button>
              ) : null}
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={goToNextStep}
                  className="rounded-lg bg-neutral-50 px-5 py-4 font-semibold text-neutral-950 transition hover:bg-white"
                >
                  다음
                </button>
              ) : null}
            </div>
          </form>

          <aside className="space-y-5 rounded-lg border border-neutral-800 bg-neutral-900/60 p-6">
            <div className="space-y-3">
              <p className="text-sm font-semibold text-neutral-400">
                선택 상품
              </p>
              <h2 className="text-2xl font-bold text-neutral-50">
                {selectedProduct.nameKo}
              </h2>
              <p className="text-sm leading-6 text-neutral-400">
                {selectedProduct.fullNameKo}
              </p>
            </div>
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div className="rounded-lg border border-neutral-800 bg-neutral-950/70 p-4">
                <dt className="text-neutral-500">형태</dt>
                <dd className="mt-1 font-semibold text-neutral-100">
                  {selectedProduct.formatLabelKo}
                </dd>
              </div>
              <div className="rounded-lg border border-neutral-800 bg-neutral-950/70 p-4">
                <dt className="text-neutral-500">제공 방식</dt>
                <dd className="mt-1 font-semibold text-neutral-100">
                  {selectedProduct.deliveryTypeKo}
                </dd>
              </div>
              <div
                className={
                  isSelectedProductPurchasable
                    ? "rounded-lg border border-neutral-800 bg-neutral-950/70 p-4"
                    : "rounded-lg border border-neutral-800 bg-neutral-950/70 p-4 sm:col-span-2"
                }
              >
                <dt className="text-neutral-500">
                  {isSelectedProductPurchasable ? "정가" : "상태"}
                </dt>
                <dd
                  className={
                    isSelectedProductPurchasable
                      ? "mt-1 font-semibold text-neutral-400 line-through"
                      : "mt-1 font-semibold text-neutral-100"
                  }
                >
                  {isSelectedProductPurchasable
                    ? selectedProduct.listPriceKo
                    : selectedProduct.statusLabelKo}
                </dd>
              </div>
              {isSelectedProductPurchasable ? (
                <div className="rounded-lg border border-rose-900/50 bg-rose-950/20 p-4">
                  <dt className="text-rose-100/80">런칭가</dt>
                  <dd className="mt-1 text-2xl font-extrabold text-rose-100">
                    {selectedProduct.priceKo}
                  </dd>
                </div>
              ) : null}
              <div className="rounded-lg border border-neutral-800 bg-neutral-950/70 p-4 sm:col-span-2">
                <dt className="text-neutral-500">선택한 리포트</dt>
                <dd className="mt-1 font-semibold text-neutral-100">
                  {selectedProduct.nameKo}
                </dd>
              </div>
            </dl>
            <div className="space-y-3 rounded-lg border border-neutral-800 bg-neutral-950/70 p-4 text-sm leading-6 text-neutral-400">
              <p>현재 V1은 양력과 Asia/Seoul 시간대만 지원합니다.</p>
              <p>
                본 리포트는 자기이해를 돕기 위한 참고 콘텐츠이며,
                의료·법률·투자 자문을 제공하지 않습니다.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
