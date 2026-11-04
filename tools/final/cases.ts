/**
 * 최종판 사례(최종판 3·4): P6d 4명(브리프 표·저장본 검사용, 생성하지 않음) + 생성할 4권 입력 + 직업 입력 10개(직군 표).
 * 생성 4권: 종합 장소담(P6d 입력 그대로, 연애 상태만 솔로 → 연애 중) · 커리어 장덕민 · 연애 장덕민 · 궁합 장덕민×최지우(연애).
 */
import { P6D_CASES, P6D_PEOPLE } from "../p6d/cases";

const person = (name: string, birthDate: string, birthTime: string, gender: "MALE" | "FEMALE", mbtiType: string) => ({ name, birthDate, birthTime, birthTimeUnknown: false, approximateBirthTimeSlot: "", gender, mbtiType });
export const DEOKMIN = person("장덕민", "1999-07-31", "08:27", "MALE", "ENTJ");
export const JIWOO = person("최지우", "2006-09-07", "16:30", "FEMALE", "ISTJ");
const sodamP6d = P6D_CASES.find(c => c.id === "sodam-full")!.payload as { userContext: Record<string, unknown> };

export type FinalCase = { readonly id: string; readonly label: string; readonly payload: unknown; readonly generate?: boolean; readonly p6d?: string };
export const FINAL_CASES: readonly FinalCase[] = [
  ...P6D_CASES.map(c => ({ ...c, p6d: c.id })),
  { id: "sodam-full-dating", label: "종합 · 장소담(카페 사장·INTP·연애 중)", generate: true, p6d: "sodam-full",
    payload: { productKey: "saju_mbti_full", productSlug: "saju-mbti-full", person: P6D_PEOPLE.sodam, userContext: { ...sodamP6d.userContext, relationshipStatus: "dating" }, productOptions: {} } },
  { id: "deokmin-career", label: "커리어 · 장덕민(IT 서비스 창업·ENTJ·솔로)", generate: true,
    payload: { productKey: "career_money_study", productSlug: "career-money-study", person: DEOKMIN, userContext: { relationshipStatus: "single", jobStatus: "business_owner", detailJob: "IT 서비스 창업(대표·개발)", focusAreas: [] }, productOptions: {} } },
  { id: "deokmin-love", label: "연애 · 장덕민(솔로)", generate: true,
    payload: { productKey: "love_marriage_child", productSlug: "love-marriage-child", person: DEOKMIN, userContext: { relationshipStatus: "single", jobStatus: "business_owner", detailJob: "IT 서비스 창업(대표·개발)", focusAreas: [] }, productOptions: {} } },
  { id: "deokmin-jiwoo", label: "궁합 연애 · 장덕민(ENTJ)×최지우(ISTJ)", generate: true,
    payload: { productKey: "saju_mbti_compatibility", productSlug: "compatibility", relationshipType: "love", compatibilityRoleVersion: "compatibility-fixed-ab-v1", personA: DEOKMIN, personB: JIWOO } },
];

/** 직업 입력 10개(최종판 3 직군 표): [입력, 상태]. 사람은 권태오(P6d 커리어) 출생 정보로 고정한다. */
export const JOB_INPUTS: readonly (readonly [string, string])[] = [
  ["마케팅 취준", "job_seeker"], ["마케팅 직무 재취업준비", "job_seeker"], ["공무원 준비", "job_seeker"], ["개발자 이직 준비", "employee"], ["간호사 취업 준비", "job_seeker"],
  ["디자인 전공 졸업 예정", "student"], ["카페 사장", "self_employed"], ["육아휴직 중", "employee"], ["대학원 준비", "student"], ["프리랜서 영상 편집", "freelancer"],
];
export const jobCase = (detailJob: string, jobStatus: string): FinalCase => ({ id: `job:${detailJob}`, label: `커리어 · ${detailJob}`,
  payload: { productKey: "career_money_study", productSlug: "career-money-study", person: P6D_PEOPLE.taeo, userContext: { relationshipStatus: "single", jobStatus, detailJob, focusAreas: [] }, productOptions: {} } });
