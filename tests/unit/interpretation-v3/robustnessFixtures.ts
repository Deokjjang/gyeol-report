const person = (name: string, gender: string, birthDate: string, birthTime: string, mbtiType: string, slot = "") => ({ name, gender, birthDate, birthTime, mbtiType, birthTimePrecision: slot ? "approximate" : birthTime ? "exact" : "unknown", birthTimeUnknown: !birthTime && !slot, approximateBirthTimeSlot: slot });
const single = (productKey: string, productSlug: string, p: ReturnType<typeof person>, jobStatus: string, detailJob: string, relationshipStatus: string) => ({ productKey, productSlug, person: p, userContext: { jobStatus, detailJob, relationshipStatus, focusAreas: [] }, productOptions: { contentVersion: "v3", ...(productKey === "annual_fortune" ? { selectedYear: "2026" } : {}) } });
export const ROBUSTNESS_FIXTURES = {
  comprehensive: single("saju_mbti_full", "saju-mbti-full", person("서윤", "FEMALE", "1994-11-18", "07:42", "ENFP"), "freelancer", "브랜드 디자이너", "single"),
  career: single("career_money_study", "career-money-study", person("민재", "MALE", "1988-03-22", "14:10", "ISTJ"), "employee", "제조업 재무기획 과장", "married"),
  love: single("love_marriage_child", "love-marriage-child", person("지아", "FEMALE", "1997-08-05", "", "ISFP"), "employee", "병원 행정직", "dating"),
  compatibility: { productKey: "saju_mbti_compatibility", productSlug: "compatibility", relationshipType: "love", compatibilityRoleVersion: "compatibility-fixed-ab-v1", personA: person("현우", "MALE", "1992-12-14", "22:30", "INTP"), personB: person("소연", "FEMALE", "1995-04-09", "09:15", "ESFJ") },
  major: single("major_fortune", "major-fortune", person("도윤", "MALE", "1985-06-30", "", "INFJ", "MYOSI"), "business_owner", "온라인 교육사업 대표", "married"),
  annual: single("annual_fortune", "annual-fortune", person("하린", "FEMALE", "2001-01-27", "18:20", "ESTP"), "job_seeker", "IT 서비스 기획 직무 준비", "some"),
};
export const ROBUSTNESS_COUNTEREXAMPLES = {
  loveApproximate: { ...ROBUSTNESS_FIXTURES.love, person: person("지아", "FEMALE", "1997-08-05", "", "ISFP", "SASI") },
  studentCareer: single("career_money_study", "career-money-study", person("예준", "MALE", "2004-05-12", "11:20", "INTP"), "student", "컴퓨터공학", "single"),
  ownerCareer: single("career_money_study", "career-money-study", person("수민", "FEMALE", "1989-10-16", "10:00", "ENTJ"), "business_owner", "온라인 교육사업 대표", "married"),
  unknownMbti: { ...ROBUSTNESS_FIXTURES.love, person: { ...ROBUSTNESS_FIXTURES.love.person, mbtiType: "" } },
  nonOfficeCareer: single("career_money_study", "career-money-study", person("지훈", "MALE", "1991-07-16", "16:20", "ISTP"), "employee", "제조업 생산관리", "dating"),
  highRelationPair: { ...ROBUSTNESS_FIXTURES.compatibility, personB: { ...ROBUSTNESS_FIXTURES.compatibility.personA, name: "윤슬", gender: "FEMALE", mbtiType: "ENFJ" } },
};
