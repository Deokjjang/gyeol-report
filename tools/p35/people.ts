// P3.5 시험 고객(c1·c2는 P3와 같음, X·Y는 고객 간 비교용 가상 고객). 브리프 입력 형식.
import type { BriefPersonInput } from "../../src/lib/brief/buildBrief";

export const PEOPLE: Record<"c1" | "c2" | "x" | "y", BriefPersonInput> = {
  c1: { name: "하람", gender: "MALE", birthDate: "1996-12-06", birthTime: "09:30", birthTimeUnknown: false, mbtiType: "ENTJ", context: { relationshipStatus: "single", jobStatus: "employee", detailJob: "서비스 기획자" } },
  c2: { name: "서윤", gender: "FEMALE", birthDate: "1989-03-21", birthTime: "", birthTimeUnknown: true, mbtiType: "INFP", context: { relationshipStatus: "dating", jobStatus: "freelancer", detailJob: "일러스트레이터" } },
  // X: c1과 같은 丁丑 일주(戊辰 乙丑 丁丑 丁未), ISFJ, 여성, 기혼, 간호사
  x: { name: "수진", gender: "FEMALE", birthDate: "1989-01-17", birthTime: "14:20", birthTimeUnknown: false, mbtiType: "ISFJ", context: { relationshipStatus: "married", jobStatus: "employee", detailJob: "간호사" } },
  // Y: 천문성·정관 보유(c1과 공유, 甲申 丙寅 己卯 己巳), ENFP, 남성, 대학생
  y: { name: "도현", gender: "MALE", birthDate: "2004-03-01", birthTime: "11:10", birthTimeUnknown: false, mbtiType: "ENFP", context: { relationshipStatus: "single", jobStatus: "student", detailJob: "대학생" } },
};
