// P3.6 궁합 시험용 가상 인물(브리프 입력 형식). 절입일을 피해 시간 미상이어도 원국이 정해지는 날짜.
import type { BriefPersonInput } from "../../src/lib/brief/buildBrief";

export const P36_PEOPLE: Record<"parent" | "child" | "boss", BriefPersonInput> = {
  // 부모: 50대 여성, ESTJ, 기혼, 회사원
  parent: { name: "정희", gender: "FEMALE", birthDate: "1971-05-14", birthTime: "07:40", birthTimeUnknown: false, mbtiType: "ESTJ", context: { relationshipStatus: "married", jobStatus: "employee", detailJob: "회계 담당" } },
  // 자녀: 20대 남성, INFP, 싱글, 대학생
  child: { name: "지우", gender: "MALE", birthDate: "2001-09-03", birthTime: "22:10", birthTimeUnknown: false, mbtiType: "INFP", context: { relationshipStatus: "single", jobStatus: "student", detailJob: "대학생" } },
  // 상사: 40대 남성, ISTJ, 기혼, 팀장(c1 하람의 상사)
  boss: { name: "태호", gender: "MALE", birthDate: "1982-11-20", birthTime: "16:30", birthTimeUnknown: false, mbtiType: "ISTJ", context: { relationshipStatus: "married", jobStatus: "employee", detailJob: "서비스 기획 팀장" } },
};
