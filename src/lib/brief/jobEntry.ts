/**
 * 최종 A-7: 커리어 직군 목록에서 나이 제한·긴 훈련·면허 경력이 필요한 직업을 고객 나이와 입력 상황으로 거른다(호출 0, 결정론).
 * 근거(2026-11 기준 공개 채용 규정):
 * - 채용 연령 상한(법령): 경찰공무원 순경·간부후보생 공채 40세 이하(경찰공무원임용령), 소방공무원 공채 40세 이하(소방공무원임용령),
 *   부사관·장교 임용 27세 이하 + 제대군인 최대 3년 연장(군인사법 제15조·시행령) → 30세.
 *   강력계 형사는 경찰관 경력이 먼저라 경찰관과 같은 상한.
 * - 체력 검정 현장직: 경호원(체력 검정 필수) — 40세 이상이면 뺀다(법정 상한은 아님, 새로 들어가는 길로 권하지 않는다).
 * - 긴 훈련(학위·국가전문자격 시험·비행시간 등 여러 해): 의사·약사·수의사·간호사·교사·법조·회계사·세무사·노무사·법무사 등, 항공 조종사(사업용 면허·비행시간).
 *   35세 이상(학생 제외)이거나 재취업 준비면 새로 권하지 않는다.
 * - 운전직(1종 대형·화물운송 자격, 만 20세 이상·운전 경력 1년 이상): 학생·21세 미만이면 뺀다.
 *   재취업 준비인데 목표가 운전·물류가 아니면 뺀다(바로 지원하는 길이 아님).
 * 걸러도 직군마다 3개 이상 남는다(tests/unit/final4/jobEntry.test.ts가 나이 15~75 × 상태 전부로 고정).
 */
export type JobEntryPerson = { readonly age?: number | null; readonly jobStatus?: string; readonly detailJob?: string };
const AGE_CAP: Readonly<Record<string, number>> = { 부사관: 30, "육군 장교": 30, 경찰관: 40, "강력계 형사": 40, "경찰 간부": 40, 소방관: 40 };
const PHYSICAL = new Set(["경호원"]);
const LONG_TRAINING = new Set(["항공 조종사", "외과 전문의", "정형외과 전문의", "정신건강 전문의", "치과의사", "한의사", "약사", "수의사", "간호사",
  "변호사", "사내 변호사", "검사", "판사", "변리사", "법무사", "노무사", "공인회계사", "세무사", "감정평가사", "보험 계리사", "초등학교 교사", "중등 교사", "유치원 교사", "특수 교사", "교장"]);
const DRIVE = new Set(["시내버스 기사", "화물 운송 기사"]);
const DRIVE_TARGET = /운전|기사|물류|운송|배송|택배|화물|버스/;
/** 재취업 준비: 구직·무직·살림 중 35세 이상이거나, 직업 칸에 재취업·복직·경력 단절이 적힌 경우. */
export const reentering = (p: JobEntryPerson) =>
  ["job_seeker", "unemployed", "homemaker"].includes(p.jobStatus ?? "") && ((p.age ?? 0) >= 35 || /재취업|복직|경력 ?단절|경단/.test(p.detailJob ?? ""));
/** 거르는 사유(없으면 null). 나이를 모르면 상황 규칙만 본다. */
export function jobEntryBlock(title: string, p: JobEntryPerson): string | null {
  const age = typeof p.age === "number" && Number.isFinite(p.age) ? p.age : null, student = p.jobStatus === "student";
  if (AGE_CAP[title] !== undefined && age !== null && age > AGE_CAP[title]) return `채용 연령 상한 ${AGE_CAP[title]}세`;
  if (PHYSICAL.has(title) && age !== null && age >= 40) return "체력 검정 현장직";
  if (LONG_TRAINING.has(title) && ((!student && age !== null && age >= 35) || reentering(p))) return "여러 해 훈련·자격";
  if (DRIVE.has(title) && (student || (age !== null && age < 21))) return "운전 면허·경력 요건";
  if (DRIVE.has(title) && reentering(p) && !DRIVE_TARGET.test(p.detailJob ?? "")) return "재취업 목표와 다른 운전직";
  return null;
}
