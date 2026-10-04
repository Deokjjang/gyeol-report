import { emptyReview, CASES } from "../../../../src/app/dev/content-review/model";
import { bookInputPayload } from "../../../../src/lib/book/form";
export const REVIEW_NOW = "2026-10-04T12:00:00.000Z";
export function manualReviewFixtures() {
  const cases = emptyReview(2026);
  const inputs = [
    { name: "서윤", birthDate: "1994-11-18", birthTime: "07:42", gender: "FEMALE", mbtiType: "ENFP", jobStatus: "freelancer", detailedJob: "브랜드 디자이너", relationshipStatus: "single" },
    { name: "민재", birthDate: "1988-03-22", birthTime: "14:10", gender: "MALE", mbtiType: "ISTJ", jobStatus: "employee", detailedJob: "제조업 재무기획 과장", relationshipStatus: "married" },
    { name: "지아", birthDate: "1997-08-05", birthTime: "", gender: "FEMALE", mbtiType: "ISFP", jobStatus: "employee", detailedJob: "병원 행정직", relationshipStatus: "dating", paidBirthTimeMode: "unknown" as const, birthTimeUnknown: true },
    { name: "현우", birthDate: "1992-12-14", birthTime: "22:30", gender: "MALE", mbtiType: "INTP" },
    { name: "도윤", birthDate: "1985-06-30", birthTime: "", gender: "MALE", mbtiType: "INFJ", jobStatus: "business_owner", detailedJob: "온라인 교육사업 대표", relationshipStatus: "married", paidBirthTimeMode: "approximate" as const, timeBranch: "MYOSI" as const },
    { name: "하린", birthDate: "2001-01-27", birthTime: "18:20", gender: "FEMALE", mbtiType: "ESTP", jobStatus: "job_seeker", detailedJob: "IT 서비스 기획 직무 준비", relationshipStatus: "some" },
  ];
  CASES.forEach((c, i) => { cases[c.id].form.person = { ...cases[c.id].form.person, ...inputs[i] }; });
  cases.D.form.personB = { ...cases.D.form.personB, name: "소연", birthDate: "1995-04-09", birthTime: "09:15", gender: "FEMALE", mbtiType: "ESFJ" };
  return CASES.map(c => ({ id: c.id, form: cases[c.id].form, payload: bookInputPayload(c.book, cases[c.id].form) }));
}
