export const COMPREHENSIVE_V3_FIXTURES = [
  ["A", "가온", "1996-12-06", "09:30", "ENTJ", "employee", "소프트웨어 기획", "dating"],
  ["B", "나래", "1989-09-07", "07:24", "INFP", "freelancer", "브랜드 디자인", "single"],
  ["C", "다온", "1984-06-15", "14:20", "ISTP", "business_owner", "제조 품질 책임자", "married"],
  ["D", "라온", "2003-03-22", "18:10", "ENFJ", "student", "콘텐츠 디자인", "single"],
  ["E", "마루", "1999-11-02", "05:45", "", "job_seeker", "", "single"],
  ["F", "이든", "1992-02-08", "15:30", "ESTP", "freelancer", "외부 프로젝트 영업", "dating"],
] as const;
export function comprehensiveFixture(row: readonly string[]) {
  const [id, name, birthDate, birthTime, mbtiType, jobStatus, detailJob, relationshipStatus] = row;
  return { id, payload: { productKey: "saju_mbti_full", productSlug: "saju-mbti-full",
    person: { name, birthDate, birthTime, birthTimeUnknown: false, approximateBirthTimeSlot: "", gender: "MALE", mbtiType },
    userContext: { jobStatus, detailJob, relationshipStatus, focusAreas: [] }, productOptions: {} } };
}
