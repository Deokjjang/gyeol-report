/** Fictional editorial audit inputs. No production records or payment transport. */
const person = (name: string, birthDate: string, birthTime: string, gender: "FEMALE" | "MALE", mbtiType: string) => ({
  name, birthDate, birthTime, gender, mbtiType, birthTimeUnknown: !birthTime,
  birthTimePrecision: birthTime ? "exact" : "unknown", approximateBirthTimeSlot: "",
});
const payload = (p: ReturnType<typeof person>) => ({ productKey: "saju_mbti_full", productSlug: "saju-mbti-full", person: p,
  userContext: { jobStatus: "", detailJob: "", relationshipStatus: "", focusAreas: [] }, productOptions: { contentVersion: "v4" } });
export const QUALITY_CLOCK = { evaluatedAt: "2026-10-12T12:00:00+09:00" };
export const COMPREHENSIVE_QUALITY_CASES = [
  { id: "A", payload: payload(person("김하린", "1992-03-17", "09:20", "FEMALE", "ENFJ")) },
  { id: "B", payload: payload(person("박도윤", "1988-11-06", "16:45", "MALE", "ISTJ")) },
  { id: "C", payload: payload(person("최서아", "1996-05-24", "22:10", "FEMALE", "INFP")) },
  { id: "D", payload: payload(person("김하린", "1992-03-17", "", "FEMALE", "ENFJ")) },
  { id: "E", payload: payload(person("김하린", "1992-03-17", "09:20", "FEMALE", "")) },
  { id: "F", payload: payload(person("김하린", "1992-03-17", "", "FEMALE", "")) },
];
