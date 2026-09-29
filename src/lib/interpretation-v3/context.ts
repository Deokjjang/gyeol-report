import type { UserContextProfile, UserLifeStatus, UserRelationshipStatus } from "../report-knowledge/userContextTypes";

export type CareerContext = {
  readonly function?: string;
  readonly seniority?: string;
  readonly workMode?: string;
  readonly industry: string;
  readonly roleFamily: string;
  readonly customerFacing: boolean | null;
  readonly analysisIntensity: Intensity;
  readonly creativeIntensity: Intensity;
  readonly salesIntensity: Intensity;
  readonly operationsIntensity: Intensity;
  readonly ruleIntensity: Intensity;
  readonly leadershipIntensity: Intensity;
  readonly physicalIntensity: Intensity;
  readonly keyWorkModes: readonly string[];
  readonly outputTypes: readonly string[];
  readonly successMetrics: readonly string[];
  readonly stakeholders: readonly string[];
};
type Intensity = "unknown" | "low" | "medium" | "high";
/** Future optional enrichment boundary ONLY. No provider, network call or caller. */
export interface CareerContextEnricher { enrich(text: string, baseline: CareerContext): Promise<CareerContext> }
const unknown: CareerContext = { industry: "unknown", roleFamily: "unknown", customerFacing: null,
  analysisIntensity: "unknown", creativeIntensity: "unknown", salesIntensity: "unknown", operationsIntensity: "unknown", ruleIntensity: "unknown", leadershipIntensity: "unknown", physicalIntensity: "unknown",
  keyWorkModes: [], outputTypes: [], successMetrics: [], stakeholders: [] };
// Job TAXONOMY descriptors, not claims about a person's ability or natal chart.
export const CAREER_RULES: readonly { id: string; pattern: RegExp; fields: Partial<CareerContext> }[] = [
  { id: "software", pattern: /소프트웨어|개발|\bsoftware\b|\bit\b/i, fields: { industry: "software", analysisIntensity: "high", keyWorkModes: ["설계", "검증"], outputTypes: ["설계안", "기능 결과물"], successMetrics: ["요구사항 충족"], stakeholders: ["사용자", "협업팀"] } },
  { id: "manufacturing", pattern: /제조|생산|공정|품질/, fields: { industry: "manufacturing", operationsIntensity: "high", ruleIntensity: "high", outputTypes: ["품질 기준표"], successMetrics: ["불량률", "납기"], stakeholders: ["생산팀", "고객사"] } },
  { id: "creative", pattern: /디자인|콘텐츠|브랜드|마케|기획|\bux\b/i, fields: { roleFamily: "project_creation", creativeIntensity: "high", keyWorkModes: ["기획", "초안 검토"], outputTypes: ["기획안", "콘텐츠"], successMetrics: ["결과물 완성도"], stakeholders: ["협업팀", "의뢰인"] } },
  { id: "sales", pattern: /영업|세일즈|거래처|\bsales\b|\bcrm\b/i, fields: { roleFamily: "sales_operations", customerFacing: true, salesIntensity: "high", keyWorkModes: ["제안", "협상", "후속 관리"], outputTypes: ["제안서", "계약", "영업 보고서"], successMetrics: ["계약 전환", "회수 일정"], stakeholders: ["고객", "영업팀"] } },
  { id: "quality", pattern: /품질|공정/, fields: { roleFamily: "quality_operations", analysisIntensity: "high", ruleIntensity: "high" } },
  { id: "lead", pattern: /책임자|팀장|대표|\blead\b/i, fields: { leadershipIntensity: "high" } },
];
export function interpretCareerContext(text: string): CareerContext {
  return CAREER_RULES.reduce<CareerContext>((result, rule) => rule.pattern.test(text) ? { ...result, ...rule.fields } : result, { ...unknown });
}
export const LIFE_SCENES: Record<UserLifeStatus, string> = {
  employee: "조직의 담당 업무와 승인 범위", business_owner: "고객 약속과 운영 자원", freelancer: "의뢰 범위와 납품 기준",
  student: "수업 과제와 팀 프로젝트", exam_certificate: "학습 계획과 오답 정리", job_seeker: "지원 직무와 포트폴리오", resting: "회복 시간과 생활 리듬", other: "현재 맡고 있는 일",
};
export const RELATIONSHIP_SCENES: Record<UserRelationshipStatus, string> = {
  single: "새 만남의 대화와 거리", dating: "둘의 약속과 감정 표현", married: "공동 생활의 역할과 자원", unknown: "가까운 관계의 대화",
};
export function normalizeContext(input: { lifeStatus?: string; relationshipStatus?: string; fieldLabel?: string }): UserContextProfile {
  const aliases: Record<string, UserLifeStatus> = { unemployed: "resting", "job-seeker": "job_seeker", business: "business_owner", "self-employed": "business_owner", self_employed: "business_owner" };
  const status = input.lifeStatus ? aliases[input.lifeStatus] ?? input.lifeStatus : undefined;
  return { lifeStatus: status && Object.hasOwn(LIFE_SCENES, status) ? status as UserLifeStatus : "other",
    relationshipStatus: input.relationshipStatus && Object.hasOwn(RELATIONSHIP_SCENES, input.relationshipStatus) ? input.relationshipStatus as UserRelationshipStatus : "unknown",
    fieldLabel: input.fieldLabel?.trim() ?? null };
}
const resourceDirections: Record<UserLifeStatus, string> = {
  employee: "새 성과를 기록하고 보상·연봉·성과급 협상에서 제시할 기준을 정하세요.",
  business_owner: "신규 매출 기회를 계약·정산·반복 수익의 운영 구조로 연결하세요.",
  freelancer: "새 고객을 확보하는 일과 단가·계약 범위·정산일을 정하는 일을 함께 하세요.",
  student: "새 기회에 필요한 시간과 비용을 비교해 현실적인 선택 기준을 만드세요.",
  exam_certificate: "학습 자료와 준비 비용을 나누고 사용할 자료의 우선순위를 정하세요.",
  job_seeker: "거래와 자원 관리 감각을 사용할 직무를 찾고 실제 역할 조건을 비교하세요.",
  resting: "현실적인 자원 여유를 확인하고 거래·관리 감각을 쓸 작은 역할부터 탐색하세요.",
  other: "새 기회에 쓸 자원과 생활을 유지할 자원을 구분하세요.",
};
export function routeDirective(ruleId: string, baseline: string, context: UserContextProfile): string {
  return ruleId === "pair:pian_cai+zheng_cai" ? resourceDirections[context.lifeStatus] : baseline;
}
export function contextScene(context: UserContextProfile, relationship = false): string {
  if (relationship) return RELATIONSHIP_SCENES[context.relationshipStatus ?? "unknown"];
  const job = interpretCareerContext(context.fieldLabel ?? "");
  return [LIFE_SCENES[context.lifeStatus], ...job.outputTypes.slice(0, 1)].join(" · ");
}
