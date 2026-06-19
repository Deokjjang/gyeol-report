export type UserLifeStatus =
  | "student"
  | "exam_certificate"
  | "job_seeker"
  | "employee"
  | "freelancer"
  | "business_owner"
  | "resting"
  | "other";

export type UserRelationshipStatus =
  | "single"
  | "dating"
  | "married"
  | "unknown";

export interface UserContextProfile {
  readonly lifeStatus: UserLifeStatus;
  readonly fieldLabel?: string | null;
  readonly relationshipStatus?: UserRelationshipStatus | null;
}

export const USER_LIFE_STATUS_LABELS: Record<UserLifeStatus, string> = {
  student: "학생",
  exam_certificate: "수험생·자격증 준비",
  job_seeker: "취준생",
  employee: "직장인",
  freelancer: "프리랜서",
  business_owner: "사업자·자영업",
  resting: "무직·휴식기",
  other: "기타",
};

export const USER_RELATIONSHIP_STATUS_LABELS: Record<
  UserRelationshipStatus,
  string
> = {
  single: "솔로",
  dating: "연애 중",
  married: "기혼",
  unknown: "미입력",
};
