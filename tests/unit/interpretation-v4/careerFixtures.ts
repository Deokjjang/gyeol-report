import { NARRATIVE_FIXTURES, fixtureInput } from "./narrativeFixtures";

/** Six women / two men; real calendar inputs, never edited calculation evidence. */
export const CAREER_FIXTURES = [
  { ...NARRATIVE_FIXTURES[9], id: "01-minjae" },
  { ...NARRATIVE_FIXTURES[10], id: "02-doyun", context: { ...NARRATIVE_FIXTURES[10].context, jobStatus: "business_owner" as const, detailJob: "온라인 교육사업 대표" } },
  { ...NARRATIVE_FIXTURES[1], id: "03-seoyun" },
  { ...NARRATIVE_FIXTURES[7], id: "04-yujin", context: { ...NARRATIVE_FIXTURES[7].context, jobStatus: "student" as const, detailJob: "컴퓨터공학 전공" } },
  { ...NARRATIVE_FIXTURES[8], id: "05-harin", context: { ...NARRATIVE_FIXTURES[8].context, jobStatus: "job_seeker" as const, detailJob: "IT 서비스 기획" } },
  { ...NARRATIVE_FIXTURES[11], id: "06-chaewon", name: "채원", gender: "FEMALE" as const },
  { ...NARRATIVE_FIXTURES[6], id: "07-nayeong", context: { ...NARRATIVE_FIXTURES[6].context, jobStatus: "employee" as const, detailJob: "검색 서비스 개발 연구원" } },
  { ...NARRATIVE_FIXTURES[0], id: "08-seojin" },
];
export const careerInputs = () => CAREER_FIXTURES.map(f => ({ fixture: f, input: fixtureInput(f) }));
