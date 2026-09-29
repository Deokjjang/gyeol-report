export const annualFixturePayload = (options: { year?: string; job?: string; status?: string; relationship?: string; mbti?: string; birthDate?: string; birthTime?: string; gender?: string } = {}) => ({
  productKey: "annual_fortune", productSlug: "annual-fortune",
  person: { name: "가온", birthDate: options.birthDate ?? "1992-08-21", birthTime: options.birthTime ?? "09:30", birthTimeUnknown: false, approximateBirthTimeSlot: "", gender: options.gender ?? "MALE", mbtiType: options.mbti ?? "ENTJ" },
  userContext: { relationshipStatus: options.relationship ?? "single", jobStatus: options.status ?? "employee", detailJob: options.job ?? "B2B SaaS 영업기획", focusAreas: [] },
  productOptions: { selectedYear: options.year ?? "2026", contentVersion: "v3" },
});
export const ANNUAL_V3_FIXTURES = [
  { id: "gaon", input: annualFixturePayload() },
  { id: "business", input: annualFixturePayload({ status: "business_owner", job: "동네 베이커리 운영", mbti: "ESTJ" }) },
  { id: "freelancer", input: annualFixturePayload({ status: "freelancer", job: "브랜드 디자이너", mbti: "INFP" }) },
  { id: "student", input: annualFixturePayload({ status: "student", job: "컴퓨터공학", birthDate: "2005-03-14", mbti: "ENFP" }) },
  { id: "jobseeker", input: annualFixturePayload({ status: "job_seeker", job: "콘텐츠 마케팅", mbti: "INFJ" }) },
  { id: "single", input: annualFixturePayload({ birthDate: "1993-10-17", birthTime: "13:20", gender: "FEMALE", mbti: "ISFJ" }) },
  { id: "dating", input: annualFixturePayload({ relationship: "dating", job: "백엔드 개발자", mbti: "INTP" }) },
  { id: "married", input: annualFixturePayload({ relationship: "married", job: "초등교사", mbti: "ESFJ" }) },
  { id: "unknown-mbti", input: annualFixturePayload({ mbti: "" }) },
  { id: "charm", input: annualFixturePayload({ birthDate: "2001-08-20", birthTime: "16:20", mbti: "ENFP" }) },
  { id: "harmony", input: annualFixturePayload({ birthDate: "1980-05-15", birthTime: "09:30", mbti: "ISTJ" }) },
  { id: "friction", input: annualFixturePayload({ birthDate: "1996-12-06", birthTime: "09:30", mbti: "ENTP" }) },
] as const;
