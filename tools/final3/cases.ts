/**
 * 최종판3 11: 무작위 4권(결제 경로) — 종합·커리어·연애·궁합 1권씩. 시드로 결정론 생성(같은 시드 = 같은 4권).
 * 조건: 모두 출생 시각 있음 · MBTI 서로 다름(ENTJ·INTP·ISTJ 제외, 궁합 두 사람 포함 5명) · 연애 상태 1건은 기혼 또는 연애 중 ·
 * 궁합은 연애·결혼이 아닌 관계 유형 · 성별·나이대 분산(20~50대) · 직업 입력 다양. 이름은 지어낸 이름(실존 인물 아님).
 */
import type { FinalCase } from "../final/cases";

export const FINAL3_SEED = 20261105;
function rng(seed: number) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const r = rng(FINAL3_SEED);
const pick = <T>(xs: readonly T[]): T => xs[Math.floor(r() * xs.length)];
const shuffle = <T>(xs: readonly T[]): T[] => { const a = [...xs]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pad = (n: number) => String(n).padStart(2, "0");

const MBTI = shuffle(["ISTP", "ISFJ", "ISFP", "INFJ", "INFP", "INTJ", "ESTP", "ESTJ", "ESFP", "ESFJ", "ENFP", "ENFJ", "ENTP"]).slice(0, 5);
const JOBS = shuffle([
  { jobStatus: "employee", detailJob: "종합병원 간호사" }, { jobStatus: "employee", detailJob: "물류 회사 영업 관리" }, { jobStatus: "freelancer", detailJob: "프리랜서 영상 편집자" },
  { jobStatus: "self_employed", detailJob: "동네 꽃집 운영" }, { jobStatus: "employee", detailJob: "중학교 수학 교사" }, { jobStatus: "job_seeker", detailJob: "회계 사무직 재취업 준비" },
  { jobStatus: "business_owner", detailJob: "인테리어 시공 업체 대표" }, { jobStatus: "homemaker", detailJob: "" },
]).slice(0, 3);
const FAMILY = shuffle(["한", "오", "서", "윤", "임", "백", "남", "조", "황", "송"]), GIVEN = shuffle(["지안", "도윤", "하은", "서진", "유나", "태민", "수아", "정우", "예린", "민재"]);
const PAIR_TYPES = ["parentChild", "coworker", "managerReport", "businessPartner", "friendship"] as const;
export const FINAL3_PAIR_TYPE = pick(PAIR_TYPES);
// 나이대: 20·30·40·50대에서 한 명씩. 부모·자녀 궁합이면 부모가 50대 묶음(자녀는 26~31년 아래 성인).
const DECADES = FINAL3_PAIR_TYPE === "parentChild" ? [...shuffle([1999, 1989, 1979]), 1969] : shuffle([1999, 1989, 1979, 1969]);
const person = (i: number, year: number, gender: "MALE" | "FEMALE") => ({
  name: `${FAMILY[i]}${GIVEN[i]}`, birthDate: `${year + Math.floor(r() * 8)}-${pad(1 + Math.floor(r() * 12))}-${pad(1 + Math.floor(r() * 28))}`,
  birthTime: `${pad(Math.floor(r() * 24))}:${pad(Math.floor(r() * 60))}`, birthTimeUnknown: false, approximateBirthTimeSlot: "", gender, mbtiType: MBTI[i],
});
const genders = shuffle(["MALE", "FEMALE", "MALE", "FEMALE"] as const);
const loveStatus = pick(["dating", "married"] as const);

const full = person(0, DECADES[0], genders[0]), career = person(1, DECADES[1], genders[1]), love = person(2, DECADES[2], genders[2]);
// 궁합: 부모·자녀면 25년 이상 차이, 그 밖은 같은 세대 ±6년.
const pairA = person(3, DECADES[3], genders[3]);
const pairBYear = FINAL3_PAIR_TYPE === "parentChild" ? Number(pairA.birthDate.slice(0, 4)) + 26 + Math.floor(r() * 6) : Number(pairA.birthDate.slice(0, 4)) - 3 + Math.floor(r() * 7);
const pairB = { ...person(4, pairBYear, pick(["MALE", "FEMALE"] as const)), birthDate: `${pairBYear}-${pad(1 + Math.floor(r() * 12))}-${pad(1 + Math.floor(r() * 28))}` };
const ctx = (relationshipStatus: string, j: { jobStatus: string; detailJob: string }) => ({ relationshipStatus, jobStatus: j.jobStatus, detailJob: j.detailJob, focusAreas: [] });

export const FINAL3_CASES: readonly FinalCase[] = [
  { id: "f3-full", label: `종합 · ${full.name}(${full.mbtiType}·${JOBS[0].detailJob || "직업 미입력"}·솔로)`, generate: true,
    payload: { productKey: "saju_mbti_full", productSlug: "saju-mbti-full", person: full, userContext: ctx("single", JOBS[0]), productOptions: {} } },
  { id: "f3-career", label: `커리어 · ${career.name}(${career.mbtiType}·${JOBS[1].detailJob || "직업 미입력"})`, generate: true,
    payload: { productKey: "career_money_study", productSlug: "career-money-study", person: career, userContext: ctx("single", JOBS[1]), productOptions: {} } },
  { id: "f3-love", label: `연애 · ${love.name}(${love.mbtiType}·${loveStatus === "married" ? "기혼" : "연애 중"})`, generate: true,
    payload: { productKey: "love_marriage_child", productSlug: "love-marriage-child", person: love, userContext: ctx(loveStatus, JOBS[2]), productOptions: {} } },
  { id: "f3-pair", label: `궁합 ${FINAL3_PAIR_TYPE} · ${pairA.name}(${pairA.mbtiType})×${pairB.name}(${pairB.mbtiType})`, generate: true,
    payload: { productKey: "saju_mbti_compatibility", productSlug: "compatibility", relationshipType: FINAL3_PAIR_TYPE, compatibilityRoleVersion: "compatibility-fixed-ab-v1", personA: pairA, personB: pairB } },
];

if (process.argv[1]?.endsWith("final3/cases.ts")) console.log(JSON.stringify({ seed: FINAL3_SEED, pairType: FINAL3_PAIR_TYPE, cases: FINAL3_CASES.map(c => ({ id: c.id, label: c.label, payload: c.payload })) }, null, 1));
