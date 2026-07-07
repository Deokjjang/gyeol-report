import {
  BIRTH_TIME_SLOTS,
  COMPATIBILITY_RELATIONSHIP_TYPES,
  FOCUS_AREAS,
  GENDER_VALUES,
  JOB_STATUSES,
  MBTI_TYPES,
  RELATIONSHIP_STATUSES,
  type BirthTimeSlot,
  type CompatibilityRelationshipType,
  type FocusArea,
  type JobStatus,
  type MbtiType,
  type RelationshipStatus,
  type ReportGender,
  type ReportProductKey,
  type ReportProductSlug,
  type SinglePersonReportProductKey,
  type SinglePersonReportProductSlug,
} from "./reportInputTypes";

export type ReportProductKind =
  | "careerMoneyStudy"
  | "loveMarriageChild"
  | "majorFortune"
  | "annualFortune"
  | "comprehensiveV2"
  | "compatibility";

export type ReportInputAdapterErrorCode =
  | "INVALID_PAYLOAD"
  | "UNKNOWN_PRODUCT_KEY"
  | "INVALID_PRODUCT_SLUG"
  | "INVALID_PERSON_NAME"
  | "INVALID_PERSON_BIRTH_DATE"
  | "INVALID_USER_CONTEXT"
  | "SELECTED_YEAR_REQUIRED"
  | "RELATIONSHIP_TYPE_REQUIRED";

export type ReportInputAdapterResult<T> =
  | {
      readonly ok: true;
      readonly value: T;
    }
  | {
      readonly ok: false;
      readonly error: ReportInputAdapterErrorCode;
    };

export type GenerationPersonInput = {
  readonly name: string;
  readonly birthDate: string;
  readonly birthTime: string;
  readonly birthTimeUnknown: boolean;
  readonly approximateBirthTimeSlot: BirthTimeSlot;
  readonly gender: ReportGender;
  readonly mbtiType: MbtiType;
  readonly calendarType: "solar";
  readonly timezone: "Asia/Seoul";
};

export type SinglePersonGenerationInput = {
  readonly kind: Exclude<ReportProductKind, "compatibility">;
  readonly productKey: SinglePersonReportProductKey;
  readonly productSlug: SinglePersonReportProductSlug;
  readonly person: GenerationPersonInput;
  readonly userContext: {
    readonly relationshipStatus: RelationshipStatus;
    readonly jobStatus: JobStatus;
    readonly detailJob: string;
    readonly focusAreas: readonly FocusArea[];
  };
  readonly productOptions:
    | Record<string, never>
    | {
        readonly selectedYear: string;
      };
};

export type CompatibilityGenerationInput = {
  readonly kind: "compatibility";
  readonly productKey: "saju_mbti_compatibility";
  readonly productSlug: "compatibility";
  readonly relationshipType: CompatibilityRelationshipType;
  readonly personA: GenerationPersonInput;
  readonly personB: GenerationPersonInput;
  readonly productOptions: Record<string, never>;
};

export type ReportGenerationInput =
  | SinglePersonGenerationInput
  | CompatibilityGenerationInput;

const PRODUCT_KIND_BY_KEY = {
  career_money_study: "careerMoneyStudy",
  love_marriage_child: "loveMarriageChild",
  major_fortune: "majorFortune",
  annual_fortune: "annualFortune",
  saju_mbti_full: "comprehensiveV2",
  saju_mbti_compatibility: "compatibility",
} as const satisfies Record<ReportProductKey, ReportProductKind>;

const PRODUCT_SLUG_BY_KEY = {
  career_money_study: "career-money-study",
  love_marriage_child: "love-marriage-child",
  major_fortune: "major-fortune",
  annual_fortune: "annual-fortune",
  saju_mbti_full: "saju-mbti-full",
  saju_mbti_compatibility: "compatibility",
} as const satisfies Record<ReportProductKey, ReportProductSlug>;

export function getReportProductKind(
  productKey: unknown,
): ReportInputAdapterResult<ReportProductKind> {
  if (!isReportProductKey(productKey)) {
    return { ok: false, error: "UNKNOWN_PRODUCT_KEY" };
  }

  return {
    ok: true,
    value: PRODUCT_KIND_BY_KEY[productKey],
  };
}

export function normalizeReportInputPayload(
  payload: unknown,
): ReportInputAdapterResult<ReportGenerationInput> {
  if (!isRecord(payload)) {
    return { ok: false, error: "INVALID_PAYLOAD" };
  }

  const productKindResult = getReportProductKind(payload.productKey);
  if (!productKindResult.ok) {
    return productKindResult;
  }

  if (productKindResult.value === "compatibility") {
    return toCompatibilityGenerationInput(payload);
  }

  return toSinglePersonGenerationInput(payload);
}

export function toSinglePersonGenerationInput(
  payload: unknown,
): ReportInputAdapterResult<SinglePersonGenerationInput> {
  if (!isRecord(payload) || !isSinglePersonProductKey(payload.productKey)) {
    return { ok: false, error: "UNKNOWN_PRODUCT_KEY" };
  }

  const productSlug = PRODUCT_SLUG_BY_KEY[payload.productKey];
  if (payload.productSlug !== productSlug) {
    return { ok: false, error: "INVALID_PRODUCT_SLUG" };
  }

  const personResult = normalizePerson(payload.person);
  if (!personResult.ok) {
    return personResult;
  }

  const userContextResult = normalizeUserContext(payload.userContext);
  if (!userContextResult.ok) {
    return userContextResult;
  }

  const productOptionsResult = normalizeSingleProductOptions(
    payload.productKey,
    payload.productOptions,
  );
  if (!productOptionsResult.ok) {
    return productOptionsResult;
  }

  return {
    ok: true,
    value: {
      kind: PRODUCT_KIND_BY_KEY[payload.productKey],
      productKey: payload.productKey,
      productSlug,
      person: personResult.value,
      userContext: userContextResult.value,
      productOptions: productOptionsResult.value,
    },
  };
}

export function toCompatibilityGenerationInput(
  payload: unknown,
): ReportInputAdapterResult<CompatibilityGenerationInput> {
  if (
    !isRecord(payload) ||
    payload.productKey !== "saju_mbti_compatibility"
  ) {
    return { ok: false, error: "UNKNOWN_PRODUCT_KEY" };
  }

  if (payload.productSlug !== "compatibility") {
    return { ok: false, error: "INVALID_PRODUCT_SLUG" };
  }

  if (!isCompatibilityRelationshipType(payload.relationshipType)) {
    return { ok: false, error: "RELATIONSHIP_TYPE_REQUIRED" };
  }

  const personAResult = normalizePerson(payload.personA);
  if (!personAResult.ok) {
    return personAResult;
  }

  const personBResult = normalizePerson(payload.personB);
  if (!personBResult.ok) {
    return personBResult;
  }

  return {
    ok: true,
    value: {
      kind: "compatibility",
      productKey: "saju_mbti_compatibility",
      productSlug: "compatibility",
      relationshipType: payload.relationshipType,
      personA: personAResult.value,
      personB: personBResult.value,
      productOptions: {},
    },
  };
}

function normalizePerson(
  value: unknown,
): ReportInputAdapterResult<GenerationPersonInput> {
  if (!isRecord(value)) {
    return { ok: false, error: "INVALID_PAYLOAD" };
  }

  const name = normalizeString(value.name);
  if (!name) {
    return { ok: false, error: "INVALID_PERSON_NAME" };
  }

  const birthDate = normalizeString(value.birthDate);
  if (!birthDate) {
    return { ok: false, error: "INVALID_PERSON_BIRTH_DATE" };
  }

  return {
    ok: true,
    value: {
      name,
      birthDate,
      birthTime: normalizeString(value.birthTime),
      birthTimeUnknown: value.birthTimeUnknown === true,
      approximateBirthTimeSlot: isBirthTimeSlot(
        value.approximateBirthTimeSlot,
      )
        ? value.approximateBirthTimeSlot
        : "",
      gender: isReportGender(value.gender) ? value.gender : "",
      mbtiType: isMbtiType(value.mbtiType) ? value.mbtiType : "",
      calendarType: "solar",
      timezone: "Asia/Seoul",
    },
  };
}

function normalizeUserContext(
  value: unknown,
): ReportInputAdapterResult<SinglePersonGenerationInput["userContext"]> {
  if (!isRecord(value)) {
    return { ok: false, error: "INVALID_USER_CONTEXT" };
  }

  if (!isFocusAreaArray(value.focusAreas)) {
    return { ok: false, error: "INVALID_USER_CONTEXT" };
  }

  return {
    ok: true,
    value: {
      relationshipStatus: isRelationshipStatus(value.relationshipStatus)
        ? value.relationshipStatus
        : "",
      jobStatus: isJobStatus(value.jobStatus) ? value.jobStatus : "",
      detailJob: normalizeString(value.detailJob),
      focusAreas: [...value.focusAreas],
    },
  };
}

function normalizeSingleProductOptions(
  productKey: SinglePersonReportProductKey,
  value: unknown,
): ReportInputAdapterResult<SinglePersonGenerationInput["productOptions"]> {
  if (productKey !== "annual_fortune") {
    return { ok: true, value: {} };
  }

  if (!isRecord(value)) {
    return { ok: false, error: "SELECTED_YEAR_REQUIRED" };
  }

  const selectedYear = normalizeString(value.selectedYear);
  if (!selectedYear) {
    return { ok: false, error: "SELECTED_YEAR_REQUIRED" };
  }

  return {
    ok: true,
    value: {
      selectedYear,
    },
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isReportProductKey(value: unknown): value is ReportProductKey {
  return (
    value === "career_money_study" ||
    value === "love_marriage_child" ||
    value === "major_fortune" ||
    value === "annual_fortune" ||
    value === "saju_mbti_full" ||
    value === "saju_mbti_compatibility"
  );
}

function isSinglePersonProductKey(
  value: unknown,
): value is SinglePersonReportProductKey {
  return (
    value === "career_money_study" ||
    value === "love_marriage_child" ||
    value === "major_fortune" ||
    value === "annual_fortune" ||
    value === "saju_mbti_full"
  );
}

function isBirthTimeSlot(value: unknown): value is BirthTimeSlot {
  return BIRTH_TIME_SLOTS.includes(value as BirthTimeSlot);
}

function isReportGender(value: unknown): value is ReportGender {
  return GENDER_VALUES.includes(value as ReportGender);
}

function isMbtiType(value: unknown): value is MbtiType {
  return MBTI_TYPES.includes(value as MbtiType);
}

function isRelationshipStatus(
  value: unknown,
): value is RelationshipStatus {
  return RELATIONSHIP_STATUSES.includes(value as RelationshipStatus);
}

function isJobStatus(value: unknown): value is JobStatus {
  return JOB_STATUSES.includes(value as JobStatus);
}

function isFocusAreaArray(value: unknown): value is readonly FocusArea[] {
  return (
    Array.isArray(value) &&
    value.every((item) => FOCUS_AREAS.includes(item as FocusArea))
  );
}

function isCompatibilityRelationshipType(
  value: unknown,
): value is CompatibilityRelationshipType {
  return COMPATIBILITY_RELATIONSHIP_TYPES.includes(
    value as CompatibilityRelationshipType,
  );
}

export type {
  CompatibilityReportInputPayload,
  ReportInputPayload,
  ReportPersonInputPayload,
  SinglePersonReportInputPayload,
} from "./reportInputTypes";
