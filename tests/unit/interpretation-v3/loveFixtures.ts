import type { RelationshipStatus, ReportGender } from "../../../src/lib/report-generation/reportInputTypes";
// Existing editorial QA dates; expected flags are checked against real facts.
export const LOVE_V3_FIXTURES = [
  ["A", "가온", "1996-12-06", "09:30", "MALE", "ENTJ", "single", false, false],
  ["B", "라온", "2006-03-22", "18:10", "MALE", "ENFP", "single", true, true],
  ["C", "도윤", "1989-09-07", "07:24", "MALE", "ENFP", "dating", true, false],
  ["D", "유나", "1993-10-17", "13:20", "FEMALE", "INFJ", "dating", false, true],
  ["E", "서연", "1984-06-15", "14:20", "FEMALE", "ISFJ", "single", false, false],
  ["F", "수현", "1996-12-06", "09:30", "FEMALE", "ISTJ", "married", false, false],
  ["G", "나래", "1992-02-08", "15:30", "FEMALE", "ENFJ", "marriage_preparing", false, false],
  ["H", "다온", "1999-11-02", "05:45", "FEMALE", "ESFP", "some", true, false],
  ["I", "마루", "2001-04-12", "10:10", "", "", "", false, false],
  ["J", "가온", "1996-12-06", "09:30", "MALE", "INFP", "dating", false, false],
  ["K", "이든", "2006-03-22", "18:10", "MALE", "INFJ", "married", true, true],
  ["L", "하람", "1997-08-22", "08:10", "MALE", "ESTJ", "marriage_preparing", false, false],
] as const;
export function loveFixture(row: readonly [string, string, string, string, ReportGender, string, RelationshipStatus, boolean, boolean]) {
  const [id, name, birthDate, birthTime, gender, mbtiType, relationshipStatus, dohwa, hongyeom] = row;
  return { id, dohwa, hongyeom, payload: { productKey: "love_marriage_child" as const, productSlug: "love-marriage-child" as const,
    person: { name, birthDate, birthTime, birthTimeUnknown: false, approximateBirthTimeSlot: "", gender, mbtiType },
    userContext: { jobStatus: "", detailJob: "", relationshipStatus, focusAreas: id === "F" ? ["가족"] : [] }, productOptions: { contentVersion: "v3" } } };
}
