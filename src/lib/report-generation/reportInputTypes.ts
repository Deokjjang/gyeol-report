export const REPORT_PRODUCT_KEYS = [
  "career_money_study",
  "love_marriage_child",
  "major_fortune",
  "annual_fortune",
  "saju_mbti_compatibility",
] as const;

export type ReportProductKey = (typeof REPORT_PRODUCT_KEYS)[number];

export const SINGLE_PERSON_REPORT_PRODUCT_KEYS = [
  "career_money_study",
  "love_marriage_child",
  "major_fortune",
  "annual_fortune",
] as const;

export type SinglePersonReportProductKey =
  (typeof SINGLE_PERSON_REPORT_PRODUCT_KEYS)[number];

export const REPORT_PRODUCT_SLUGS = [
  "career-money-study",
  "love-marriage-child",
  "major-fortune",
  "annual-fortune",
  "compatibility",
] as const;

export type ReportProductSlug = (typeof REPORT_PRODUCT_SLUGS)[number];
export type SinglePersonReportProductSlug = Exclude<
  ReportProductSlug,
  "compatibility"
>;

export const BIRTH_TIME_SLOTS = [
  "",
  "JASI",
  "CHUKSI",
  "INSI",
  "MYOSI",
  "JINSI",
  "SASI",
  "OSI",
  "MISI",
  "SINSI",
  "YUSI",
  "SULSI",
  "HAESI",
] as const;

export type BirthTimeSlot = (typeof BIRTH_TIME_SLOTS)[number];

export const MBTI_TYPES = [
  "",
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

export type MbtiType = (typeof MBTI_TYPES)[number];

export const GENDER_VALUES = ["", "MALE", "FEMALE"] as const;

export type ReportGender = (typeof GENDER_VALUES)[number];

export const RELATIONSHIP_STATUSES = [
  "",
  "single",
  "some",
  "dating",
  "marriage_preparing",
  "married",
] as const;

export type RelationshipStatus = (typeof RELATIONSHIP_STATUSES)[number];

export const JOB_STATUSES = [
  "",
  "student",
  "job_seeker",
  "employee",
  "freelancer",
  "self_employed",
  "business_owner",
  "homemaker",
  "unemployed",
  "other",
] as const;

export type JobStatus = (typeof JOB_STATUSES)[number];

export const FOCUS_AREAS = [
  "직업",
  "돈",
  "연애",
  "관계",
  "건강관리",
  "공부",
  "가족",
  "생활 리듬",
] as const;

export type FocusArea = (typeof FOCUS_AREAS)[number];

export const COMPATIBILITY_RELATIONSHIP_TYPES = [
  "love",
  "marriage",
  "parentChild",
  "coworker",
  "managerReport",
  "businessPartner",
  "friendship",
] as const;

export type CompatibilityRelationshipType =
  (typeof COMPATIBILITY_RELATIONSHIP_TYPES)[number];

export type ReportPersonInputPayload = {
  readonly name: string;
  readonly birthDate: string;
  readonly birthTime: string;
  readonly birthTimeUnknown: boolean;
  readonly approximateBirthTimeSlot: BirthTimeSlot;
  readonly gender: ReportGender;
  readonly mbtiType: MbtiType;
};

export type SinglePersonReportInputPayload = {
  readonly productKey: SinglePersonReportProductKey;
  readonly productSlug: SinglePersonReportProductSlug;
  readonly person: ReportPersonInputPayload;
  readonly userContext: {
    readonly relationshipStatus: RelationshipStatus;
    readonly jobStatus: JobStatus;
    readonly detailJob: string;
    readonly focusAreas: readonly FocusArea[];
  };
  readonly productOptions: Record<string, never> | {
    readonly selectedYear: string;
  };
};

export type CompatibilityReportInputPayload = {
  readonly productKey: "saju_mbti_compatibility";
  readonly productSlug: "compatibility";
  readonly relationshipType: CompatibilityRelationshipType;
  readonly personA: ReportPersonInputPayload;
  readonly personB: ReportPersonInputPayload;
};

export type ReportInputPayload =
  | SinglePersonReportInputPayload
  | CompatibilityReportInputPayload;
