export const CAREER_V3_FIXTURES = [
  ["A", "가온", "1996-12-06", "09:30", "MALE", "ENTJ", "employee", "B2B SaaS 영업기획"],
  ["B", "도윤", "1989-09-07", "07:24", "MALE", "INTJ", "employee", "백엔드 개발자"],
  ["C", "서연", "1984-06-15", "14:20", "FEMALE", "ISFJ", "employee", "병원 간호사"],
  ["D", "나래", "1992-02-08", "15:30", "FEMALE", "ENFJ", "employee", "중학교 교사"],
  ["E", "다온", "1999-11-02", "05:45", "FEMALE", "ESFP", "self_employed", "카페 사장"],
  ["F", "이든", "1989-09-07", "07:24", "MALE", "ENFP", "freelancer", "영상 크리에이터 디자이너"],
  ["G", "수현", "1996-12-06", "09:30", "FEMALE", "ISTJ", "employee", "세무 회계 전문직"],
  ["H", "라온", "2006-03-22", "18:10", "MALE", "INFP", "student", "콘텐츠 디자인"],
  ["I", "마루", "2001-04-12", "10:10", "FEMALE", "INTP", "job_seeker", ""],
  ["J", "지온", "1992-02-08", "15:30", "MALE", "", "employee", "생산관리"],
  ["K", "유나", "1993-10-17", "13:20", "FEMALE", "ISFP", "business_owner", "네일아티스트 매장 대표"],
  ["L", "하람", "1997-08-22", "08:10", "MALE", "ESTJ", "employee", "행정 공무원"],
] as const;
export function careerFixture(row: readonly string[]) {
  const [id, name, birthDate, birthTime, gender, mbtiType, jobStatus, detailJob] = row;
  return { id, payload: { productKey: "career_money_study", productSlug: "career-money-study", person: { name, birthDate, birthTime, birthTimeUnknown: false, approximateBirthTimeSlot: "", gender, mbtiType }, userContext: { jobStatus, detailJob, relationshipStatus: "single", focusAreas: [] }, productOptions: { contentVersion: "v3" } } };
}
