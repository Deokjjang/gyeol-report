import type { JobStatus, RelationshipStatus, ReportPersonInputPayload } from "../../../src/lib/report-generation/reportInputTypes";
export const MAJOR_EVALUATED_AT = "2026-10-01T12:00:00+09:00";
const fixture = (id: string, name: string, birthDate: string, birthTime: string, mbtiType: ReportPersonInputPayload["mbtiType"], gender: ReportPersonInputPayload["gender"], jobStatus: JobStatus, detailJob: string, relationshipStatus: RelationshipStatus) => ({ id,
  payload: { productKey: "major_fortune", productSlug: "major-fortune", person: { name, birthDate, birthTime, mbtiType, gender, birthTimeUnknown: false, birthTimePrecision: "exact", approximateBirthTimeSlot: "" }, userContext: { jobStatus, detailJob, relationshipStatus, focusAreas: [] }, productOptions: { contentVersion: "v3" } } });
export const MAJOR_NARRATIVE_FIXTURES = [
  fixture("01-business", "도윤", "1985-06-30", "06:00", "INFJ", "MALE", "business_owner", "온라인 교육사업 대표", "married"),
  fixture("02-employee", "서진", "1990-07-18", "05:30", "ENTJ", "FEMALE", "employee", "B2B SaaS 영업기획", "dating"),
  fixture("03-freelance", "서윤", "1994-11-18", "07:42", "ENFP", "FEMALE", "freelancer", "브랜드 디자이너", "single"),
  fixture("04-student", "하린", "2001-01-27", "18:20", "ESTP", "FEMALE", "student", "체육 전공", "some"),
  fixture("05-unknown", "준서", "1987-05-18", "09:30", "", "MALE", "unemployed", "이전 직업 바리스타 · 이직 준비", ""),
  fixture("06-transition", "나영", "1984-07-27", "15:30", "INTP", "FEMALE", "employee", "제조업 재무기획 과장", "marriage_preparing"),
];
