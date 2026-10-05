import { MATERIAL_BY_FEATURE } from "./materialRegistry";
import { proof, particle } from "./copyRealizer";
import type { NarrativeState } from "./narrativeTypes";
import type { SemanticTag } from "./types";
import type { CareerRecommendation } from "./careerNarrativeTypes";
import type { selectCareerVoice } from "./careerVoices";
import type { careerWorkNarrative } from "./careerWorkNarrative";
import { CAREER_ROLE_SCENES, CAREER_ENVIRONMENT_COST } from "./careerRoleScenes";
import { getMbtiSourceProfile } from "../report-knowledge/mbti/sourceRuntimeAdapter";
import { materialLabel } from "./contentEvidence";
import { chapterMbtiReadings } from "./contentMbti";

type JobHint = { job: string; matchingTraits: string[]; matchingMyeongliSignals: string[] };
const records = (value: unknown): Record<string, unknown>[] => Array.isArray(value) ? value.filter((v): v is Record<string, unknown> => typeof v === "object" && v !== null) : [];
const strings = (value: unknown): string[] => Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
const canonicalLabel = (label: string) => ({ 도화: "도화살", 홍염: "홍염살", 문창: "문창귀인", 학당: "학당귀인", 역마: "역마살", 현침: "현침살" }[label] ?? label);
const JOB_ROLE: Record<string, RegExp> = { review: /검토|검사|품질|재무|회계|법|판사/, investigate: /연구|분석|개발|과학|전략|번역/, create: /콘텐츠|디자인|작가|창작|브랜드|마케팅/, teach: /교육|교사|강사|상담|훈련/, lead: /CEO|경영|관리자|리더|책임|정치|감독/, manage: /운영|행정|관리|회계|공공|공무/, market: /영업|사업|판매|거래|창업|시장/, experience: /행사|서비스|여행|예술|공연|방송/ };

type Route = { id: string; tags: readonly SemanticTag[]; roles: readonly string[]; task: string; environment: string; avoid: string; functions: readonly string[] };
export const CAREER_ROUTES: readonly Route[] = [
  { id: "review", tags: ["precision"], roles: ["품질 검토", "재무 검토", "서비스 점검"], task: "겉으로는 괜찮아 보이는 결과에서 오류와 빠진 조건을 찾아내는 일", environment: "확인할 자료와 고칠 권한이 함께 있는 곳", avoid: "검토할 시간을 주지 않고 틀리면 검토한 사람만 탓하는 곳", functions: ["finance_planning", "field_operations", "administration"] },
  { id: "investigate", tags: ["inquiry"], roles: ["개발·연구", "자료 조사", "전문 분야 분석"], task: "원인이 분명하지 않은 문제를 나누어 조사하고 설명하는 일", environment: "깊게 생각할 시간과 다른 가설을 확인할 자료가 있는 곳", avoid: "이유를 묻는 것 자체를 느리다고 취급하는 곳", functions: ["engineering", "language_mediation"] },
  { id: "create", tags: ["expression", "experimentation"], roles: ["콘텐츠 기획", "브랜드 제작", "설명 자료 개발"], task: "아직 모양이 없는 생각을 사람이 이해하고 반응할 결과로 만드는 일", environment: "초안을 보여주고 선택의 이유를 함께 논의할 수 있는 곳", avoid: "무엇을 원하는지 말하지 않고 완성한 뒤 취향으로만 뒤집는 곳", functions: ["design", "planning", "teaching"] },
  { id: "teach", tags: ["learning", "help"], roles: ["교육 기획", "사용 안내", "동료 교육"], task: "알고 있는 내용을 상대가 스스로 해볼 수 있게 나누어 전하는 일", environment: "설명 뒤에 실제로 이해했는지 확인할 수 있는 곳", avoid: "도움을 주는 사람의 준비와 회복 시간을 당연하게 가져가는 곳", functions: ["teaching", "care_operations", "caregiving"] },
  { id: "lead", tags: ["leadership", "status"], roles: ["프로젝트 책임", "운영 조정", "팀 리더"], task: "여러 사람이 기다리는 결정을 내리고 역할을 이어주는 일", environment: "책임만큼 결정할 범위도 분명하게 주어지는 곳", avoid: "결정은 남이 하는데 결과의 책임만 혼자 받는 곳", functions: ["business_operations", "sales_operations"] },
  { id: "manage", tags: ["consistency", "accumulation"], roles: ["운영 기획", "예산 관리", "장기 고객 관리"], task: "한 번 잘된 일을 반복할 수 있도록 약속과 흐름을 지키는 일", environment: "꾸준히 지킨 품질과 누적된 경험을 평가하는 곳", avoid: "기준을 매번 바꾸면서 이전 약속은 없던 일로 하는 곳", functions: ["finance_planning", "retail_operations", "administration"] },
  { id: "market", tags: ["wealth", "mobility"], roles: ["고객 제안", "사업 기획", "새 거래처 개발"], task: "사람이 필요한 것과 제공할 수 있는 것을 맞춰 거래로 잇는 일", environment: "바깥 반응을 듣고 제안이나 가격을 조정할 수 있는 곳", avoid: "지킬 수 없는 약속까지 매출이라는 이유로 밀어붙이는 곳", functions: ["business_operations", "sales_operations", "retail_operations"] },
  { id: "experience", tags: ["sociability", "first-attraction", "practical-learning"], roles: ["고객 경험 기획", "행사 운영", "제품 체험 설계"], task: "사람이 직접 만나고 사용하며 보이는 반응을 더 좋은 경험으로 바꾸는 일", environment: "현장에서 관찰한 것을 다음 시도에 반영하는 곳", avoid: "실제 반응은 듣지 않고 겉으로 보기 좋은 보고만 요구하는 곳", functions: ["customer_service", "design"] },
];

export function careerRecommendations(state: NarrativeState, voice: ReturnType<typeof selectCareerVoice>, context: ReturnType<typeof careerWorkNarrative>) {
  const profile = getMbtiSourceProfile(state.input.mbti);
  const traitIds = new Set(Object.values(profile?.traits ?? {}).flatMap(area => area?.map(t => t.id).filter(Boolean) ?? []));
  const jobs: JobHint[] = records(profile?.recommendedJobs).flatMap(h => typeof h.job === "string" && ["direct", "inferred"].includes(String(h.sourceCoverage)) && strings(h.matchingTraits).some(t => traitIds.has(t))
    ? [{ job: h.job, matchingTraits: strings(h.matchingTraits), matchingMyeongliSignals: strings(h.matchingMyeongliSignals).map(canonicalLabel) }] : []);
  const candidates = CAREER_ROUTES.flatMap(route => {
    const materials = state.packet.selected.filter(m => MATERIAL_BY_FEATURE.get(m.feature)?.semanticTags.some(tag => route.tags.includes(tag)));
    if (!materials.length) return [];
    const fusions = state.packet.fusions.filter(f => materials.some(m => f.myeongliEvidence.some(d => d.evidence.feature === m.feature)) &&
      ["work", "study", "strengths", "identity", "money", "success/fortune"].includes(f.domain));
    const matchedJobs = jobs.filter(j => JOB_ROLE[route.id].test(j.job) && materials.some(m => j.matchingMyeongliSignals.includes(materialLabel(m))));
    return [{ route, materials, fusions, matchedJobs, significance: (fusions.length ? 3 : 0) + (matchedJobs.length ? 2 : 0) + (route.functions.includes(context.workFunction) ? 3 : 0) + Math.min(2, materials.length) }];
  }).sort((a, b) => b.significance - a.significance || a.route.id.localeCompare(b.route.id));
  const chosen = candidates.slice(0, 3);
  const usedJobs = new Set<string>();
  const recommendations: CareerRecommendation[] = chosen.map(({ route, materials, fusions, matchedJobs }, index) => {
    const authored = CAREER_ROLE_SCENES[voice.id]?.[route.id] ?? CAREER_ROLE_SCENES.natal[route.id];
    const routeProof = proof(materials.slice(0, 2), [], fusions.slice(0, 2), [...context.sourceRefs, ...voice.proof.sourceRefs, `v4:career-route:${route.id}`,
      ...matchedJobs.map(j => `mbti:${profile!.type}:recommendedJobs:${j.job}`)]);
    const basis = `${materials.slice(0, 2).map(materialLabel).join("·")}에서 볼 수 있는 장점을 ${route.task}에 쓰는 방향이에요.`;
    const examples = matchedJobs.filter(j => !usedJobs.has(j.job)).slice(0, 2); examples.forEach(j => usedJobs.add(j.job));
    const bridge = examples.length ? ` ${profile!.type}의 직업 자료에서도 ${examples.map(j => j.job).join("·")}처럼 이 힘을 쓰는 예를 찾을 수 있습니다.` : "";
    return {
      id: route.id, roleExamples: authored?.[2] ?? route.roles,
      reason: `${index + 1}순위 · ${route.roles.join("·")} — ${authored?.[0] ?? `${route.task}에서 힘을 쓸 수 있습니다.`} ${basis}${bridge}`,
      environment: authored?.[1] ?? `${route.environment}이라면 내 방식이 실제로 도움이 되는지 작은 경험으로 확인하기 좋습니다.`,
      basis: "supported-tendency", proof: { ...routeProof, features: [...new Set([...routeProof.features, ...voice.proof.features])], fusionIds: [...new Set([...routeProof.fusionIds, ...voice.proof.fusionIds])] },
    };
  });
  // Sparse charts: do not invent additional talents to reach a numeric quota.
  if (recommendations.length < 3) {
    const work = state.pillar.material.seeds.find(s => s.role === "work");
    if (work) recommendations.push({ id: "sample-first", roleExamples: ["관심 분야의 작은 실습"], basis: "explore-with-sample",
      reason: `${work.text} 아직 해보지 않은 직무까지 이름만으로 확정하기보다는, 작은 과제를 맡아 어떤 부분이 재미있었는지 확인할 만합니다.`,
      environment: "곁에서 실제 일을 보여주고 내 결과에 구체적으로 반응해주는 사람이 있는 환경부터 살펴볼 수 있습니다.", proof: proof([state.pillar], [work], [], ["v4:career-route:sparse-evidence"]) });
  }
  const avoidHints = records(profile?.avoidJobsOrEnvironments).filter(h => strings(h.riskTraits).some(t => traitIds.has(t)));
  const avoid = chosen.slice(0, 3).map(({ route, materials }, index) => {
    const readings = chapterMbtiReadings(state.input.mbti, materials, "work", new Set());
    const boundTraits = new Set(readings.map(r => r.id.split(":")[1]));
    const hint = avoidHints.find(h => strings(h.riskTraits).some(t => boundTraits.has(t)));
    return {
    text: `${route.avoid}에서는 ${particle(CAREER_ENVIRONMENT_COST[voice.id]?.[index] ?? CAREER_ENVIRONMENT_COST.natal[index], "이", "가")} 커집니다.`,
    proof: proof(materials.slice(0, 1), [], [], [...voice.proof.sourceRefs, `v4:career-route:${route.id}:environment`, ...(hint ? [`mbti:${profile!.type}:avoidJobsOrEnvironments:${String(hint.name)}`, ...readings.map(r => r.provenance)] : [])]),
  }; });
  return { recommendations, avoid };
}
