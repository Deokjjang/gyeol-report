import { COMPATIBILITY_ROLE_VERSION, type CompatibilityRelationshipType, type ReportPersonInputPayload } from "../../../src/lib/report-generation/reportInputTypes";
const person = (name: string, birthDate: string, birthTime: string, mbtiType: ReportPersonInputPayload["mbtiType"], gender: ReportPersonInputPayload["gender"] = "FEMALE"): ReportPersonInputPayload =>
  ({ name, birthDate, birthTime, mbtiType, gender, birthTimeUnknown: !birthTime, birthTimePrecision: birthTime ? "exact" : "unknown", approximateBirthTimeSlot: "" });
const pair = (id: string, category: CompatibilityRelationshipType, personA: ReportPersonInputPayload, personB: ReportPersonInputPayload) =>
  ({ id, payload: { productKey: "saju_mbti_compatibility" as const, productSlug: "compatibility" as const, compatibilityRoleVersion: COMPATIBILITY_ROLE_VERSION, relationshipType: category, personA, personB } });
export const COMPATIBILITY_NARRATIVE_FIXTURES = [
  pair("01-love", "love", person("현우", "1992-12-14", "22:30", "INTP", "MALE"), person("소연", "1995-04-08", "09:15", "ESFJ")),
  pair("02-marriage", "marriage", person("민재", "1988-03-22", "14:10", "ISTJ", "MALE"), person("서윤", "1994-11-18", "07:42", "ENFP")),
  pair("03-parent", "parentChild", person("예린", "1984-09-27", "13:30", "ISFJ"), person("지우", "2012-06-17", "10:20", "ENTP")),
  pair("04-coworker", "coworker", person("서진", "1990-07-18", "05:30", "ENTJ"), person("나영", "1984-07-27", "15:30", "INTP")),
  pair("05-manager", "managerReport", person("도윤", "1985-06-30", "06:00", "INFJ", "MALE"), person("하린", "2001-01-27", "18:20", "ESTP")),
  pair("06-business", "businessPartner", person("다은", "1984-03-18", "05:30", "ENTJ"), person("준호", "1986-05-12", "11:20", "ISTJ", "MALE")),
  pair("07-friend", "friendship", person("지아", "1997-08-05", "", "ISFP"), person("유진", "1999-12-06", "01:30", "ENFP")),
  pair("08-love", "love", person("수아", "1990-03-18", "01:30", "INFJ"), { ...person("정우", "1987-05-18", "", "ISTP", "MALE"), birthTimeUnknown: false, birthTimePrecision: "approximate" as const, approximateBirthTimeSlot: "SASI" as const }),
];
