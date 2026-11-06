/**
 * 최종판2 생성 4권(4): 종합 장덕민(솔로) · 커리어 장소담(연애 중) · 연애 장소담(연애 중) · 궁합(연애) 장소담 × 전성민.
 * 장소담은 baseline 입력 그대로(1996-12-06 14:15 여·INTP·카페 사장), 연애 상태만 연애 중.
 */
import { P6D_CASES, P6D_PEOPLE } from "../p6d/cases";
import { DEOKMIN } from "../final/cases";
import type { FinalCase } from "../final/cases";

export const SODAM = P6D_PEOPLE.sodam;
export const SEONGMIN = { name: "전성민", birthDate: "1992-11-09", birthTime: "19:45", birthTimeUnknown: false, approximateBirthTimeSlot: "", gender: "MALE" as const, mbtiType: "ISTJ" };
const sodamCtx = (P6D_CASES.find(c => c.id === "sodam-full")!.payload as { userContext: Record<string, unknown> }).userContext;
const sodamDating = { ...sodamCtx, relationshipStatus: "dating" };
export const FINAL2_CASES: readonly FinalCase[] = [
  { id: "deokmin-full", label: "종합 · 장덕민(IT 서비스 창업(대표·개발)·ENTJ·솔로)", generate: true,
    payload: { productKey: "saju_mbti_full", productSlug: "saju-mbti-full", person: DEOKMIN, userContext: { relationshipStatus: "single", jobStatus: "business_owner", detailJob: "IT 서비스 창업(대표·개발)", focusAreas: [] }, productOptions: {} } },
  { id: "sodam-career", label: "커리어 · 장소담(카페 사장·INTP·연애 중)", generate: true,
    payload: { productKey: "career_money_study", productSlug: "career-money-study", person: SODAM, userContext: sodamDating, productOptions: {} } },
  { id: "sodam-love", label: "연애 · 장소담(카페 사장·INTP·연애 중)", generate: true,
    payload: { productKey: "love_marriage_child", productSlug: "love-marriage-child", person: SODAM, userContext: sodamDating, productOptions: {} } },
  { id: "sodam-seongmin", label: "궁합 연애 · 장소담(INTP)×전성민(ISTJ)", generate: true,
    payload: { productKey: "saju_mbti_compatibility", productSlug: "compatibility", relationshipType: "love", compatibilityRoleVersion: "compatibility-fixed-ab-v1", personA: SODAM, personB: SEONGMIN } },
];
