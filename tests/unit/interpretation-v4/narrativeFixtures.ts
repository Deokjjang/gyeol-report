import { calculateSaju } from "../../../src/lib/saju/calculateSaju";
import type { NarrativeInput } from "../../../src/lib/interpretation-v4/narrativeTypes";

type Fixture = { id: string; name: string; date: string; time?: string; gender: "FEMALE" | "MALE"; mbti: string | null; context: NarrativeInput["context"] };
export const NARRATIVE_FIXTURES: readonly Fixture[] = [
  { id: "01-seojin", name: "서진", date: "1990-07-18", time: "05:30", gender: "FEMALE", mbti: "ENTJ", context: { jobStatus: "employee", detailJob: "B2B SaaS 영업기획", relationshipStatus: "dating" } },
  { id: "02-seoyun", name: "서윤", date: "1994-11-18", time: "07:42", gender: "FEMALE", mbti: "ENFP", context: { jobStatus: "freelancer", detailJob: "브랜드 디자이너", relationshipStatus: "single" } },
  { id: "03-jia", name: "지아", date: "1997-08-05", gender: "FEMALE", mbti: "ISFP", context: { jobStatus: "employee", detailJob: "병원 행정직", relationshipStatus: "dating" } },
  { id: "04-daeun", name: "다은", date: "1984-03-18", time: "05:30", gender: "FEMALE", mbti: "ENTJ", context: { jobStatus: "business_owner", detailJob: "온라인 교육사업 대표", relationshipStatus: "married" } },
  { id: "05-sua", name: "수아", date: "1990-03-18", time: "01:30", gender: "FEMALE", mbti: "INFJ", context: { jobStatus: "employee", detailJob: "전시 기획자", relationshipStatus: "some" } },
  { id: "06-yerin", name: "예린", date: "1984-09-27", time: "13:30", gender: "FEMALE", mbti: "ISFJ", context: { jobStatus: "homemaker", detailJob: "가정 돌봄", relationshipStatus: "married" } },
  { id: "07-nayeong", name: "나영", date: "1984-07-27", time: "15:30", gender: "FEMALE", mbti: "INTP", context: { jobStatus: "freelancer", detailJob: "기술 문서 번역가", relationshipStatus: "single" } },
  { id: "08-yujin", name: "유진", date: "1999-12-06", time: "01:30", gender: "FEMALE", mbti: "ENTP", context: { jobStatus: "job_seeker", detailJob: "IT 서비스 기획", relationshipStatus: "some" } },
  { id: "09-harin", name: "하린", date: "2001-01-27", time: "18:20", gender: "FEMALE", mbti: "ESTP", context: { jobStatus: "student", detailJob: "체육학", relationshipStatus: "single" } },
  { id: "10-minjae", name: "민재", date: "1988-03-22", time: "14:10", gender: "MALE", mbti: "ISTJ", context: { jobStatus: "employee", detailJob: "제조업 재무기획 과장", relationshipStatus: "married" } },
  { id: "11-doyun", name: "도윤", date: "1985-06-30", time: "06:00", gender: "MALE", mbti: "INFJ", context: { jobStatus: "self_employed", detailJob: "독립서점 운영", relationshipStatus: "marriage_preparing" } },
  { id: "12-junseo", name: "준서", date: "1987-05-18", time: "09:30", gender: "MALE", mbti: null, context: { jobStatus: "unemployed", detailJob: "이전 직업 바리스타", relationshipStatus: "" } },
];
export function fixtureInput(f: Fixture): NarrativeInput {
  return { calculation: calculateSaju({ birthDate: f.date, birthTime: f.time, birthTimeUnknown: !f.time, calendarType: "SOLAR", gender: f.gender, timezone: "Asia/Seoul" }),
    name: f.name, mbti: f.mbti, context: f.context };
}
