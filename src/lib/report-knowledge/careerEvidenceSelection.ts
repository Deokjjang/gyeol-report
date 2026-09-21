import { getMbtiSourceProfile, type MbtiSourceTraitItem } from "./mbti/sourceRuntimeAdapter";
import type { CareerReportEvidencePacket } from "./careerReportTypes";

// A negative label is not evidence for its positive counterpart (무인성 ≠ 인성).
export function careerSignalMatches(labels: readonly string[], target: string): boolean {
  return labels.some((label) => label === target ||
    (!label.startsWith("무") && !/부족|없음|미확정/u.test(label) &&
      (label.startsWith(`${target} `) || label === `${target}살` || label === `${target}귀인`)));
}

export function selectCareerMbti(type: string | null | undefined, labels: readonly string[]) {
  const profile = getMbtiSourceProfile(type);
  function traits(area: "career" | "workplace" | "money" | "investment" | "study") {
    return [...(profile?.traits?.[area] ?? [])].sort((a, b) =>
      matches(b).length - matches(a).length).slice(0, 3);
  }
  function matches(item: MbtiSourceTraitItem) {
    return (item.matchingMyeongliSignals ?? []).filter((s) => careerSignalMatches(labels, s));
  }
  return { profile, career: traits("career"), workplace: traits("workplace"),
    money: traits("money"), investment: traits("investment"), study: traits("study"),
    reportUseCases: profile?.reportUseCases?.careerReport ?? [], matches };
}
export type CareerMbtiSelection = ReturnType<typeof selectCareerMbti>;
export function traitText(traits: readonly MbtiSourceTraitItem[], field: "plainKo" | "positiveUse" | "risk") {
  return traits.flatMap((t) => typeof t[field] === "string" && t[field]!.trim() ? [t[field]!] : []);
}

// Roles precede job examples; these are interpretation angles, not calculations.
const roleRules = [
  { role: "자원·거래 조율", signals: ["정재", "편재", "재성"], environment: "정산과 계약 범위가 보이는 환경",
    plain: "자원 배분과 대가를 비교하는 관점입니다. 거래 성사보다 범위와 회수 조건을 설명하는 역할부터 살펴보세요.",
    jobs: ["구매 담당자", "영업 운영", "예산 담당자", "거래처 관리"],
    tasks: ["납기와 단가를 함께 비교하는 구매 업무", "계약부터 정산까지 인수인계를 정리하는 영업 지원", "계획 비용과 실제 집행을 대조하는 예산 업무", "상대의 요구와 제공 범위를 합의하는 거래처 업무"], fatigue: "회수 조건 없이 거래 규모만 늘리는 환경" },
  { role: "운영·책임 관리", signals: ["정관", "편관", "관성"], environment: "책임과 결정 권한이 함께 정해진 조직",
    plain: "규칙과 평가를 역할의 기준으로 읽는 관점입니다. 조직 이름보다 책임을 조정할 권한이 있는지가 중요합니다.",
    jobs: ["운영 기획자", "프로젝트 매니저", "품질 관리", "정책 운영"],
    tasks: ["예외 상황의 처리 기준을 만드는 운영 업무", "일정과 승인 권한을 조율하는 프로젝트 업무", "합의한 기준으로 결과를 검사하는 품질 업무", "규칙과 실제 사례의 차이를 정리하는 정책 업무"], fatigue: "결정권 없이 결과 책임만 지는 환경" },
  { role: "표현·결과물 제작", signals: ["식신", "상관", "식상"], environment: "완성한 결과물로 피드백을 받는 환경",
    plain: "생각을 밖으로 꺼내 검증하는 관점입니다. 표현의 자유와 수정 기준이 함께 있는 역할을 비교해 보세요.",
    jobs: ["콘텐츠 기획자", "교육 콘텐츠 제작", "서비스 기획자", "브랜드 콘텐츠 담당"],
    tasks: ["아이디어를 편집 가능한 구성으로 만드는 콘텐츠 업무", "이해한 내용을 예시와 실습으로 전달하는 교육 제작", "사용자 요구를 시험 가능한 화면과 흐름으로 바꾸는 기획", "전달할 메시지를 실제 제작물로 표현하는 브랜드 업무"], fatigue: "제안과 제작을 요구하면서 피드백은 주지 않는 환경" },
  { role: "분석·지식 축적", signals: ["정인", "편인", "인성", "문창", "현침"], environment: "자료를 검토하고 기준을 설명할 시간이 있는 환경",
    plain: "이해와 검증을 쌓아 전문성을 만드는 관점입니다. 깊이 파는 시간과 그 결과를 적용할 접점이 모두 필요합니다.",
    jobs: ["리서치 담당자", "교육 기획자", "기술 문서 담당", "데이터 분석 보조"],
    tasks: ["자료의 출처와 해석을 구분하는 조사 업무", "학습 목표와 평가 과제를 연결하는 교육 기획", "복잡한 기능을 재현 가능한 설명으로 정리하는 문서 업무", "수집한 수치를 검증하고 판단 근거를 남기는 분석 보조"], fatigue: "검토 시간 없이 즉답만 요구하는 환경" },
  { role: "협업·독립 실행", signals: ["비견", "겁재", "비겁"], environment: "협업 범위 안에서 자기 판단을 실행하는 환경",
    plain: "동료와 자기 기준을 조율하는 관점입니다. 독립 여부보다 기여 범위와 성과 배분을 정할 수 있는지 보세요.",
    jobs: ["프로젝트 코디네이터", "협업 운영", "파트너십 담당", "독립 프로젝트 실무자"],
    tasks: ["참여자의 작업 경계를 조율하는 프로젝트 지원", "팀 사이의 인수인계와 기여를 정리하는 협업 업무", "서로 제공할 자원과 책임을 협의하는 파트너십 업무", "범위를 정하고 납품 결과를 책임지는 독립 실무"], fatigue: "기여와 보상 기준이 불분명한 경쟁 환경" },
] as const;

export function selectCareerRoles(labels: readonly string[]) {
  return roleRules.flatMap((rule) => {
    const signals = rule.signals.filter((s) => careerSignalMatches(labels, s));
    return signals.length ? [{ ...rule, signals }] : [];
  });
}
export type CareerRoleSelection = ReturnType<typeof selectCareerRoles>;

function records(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? value.filter((v): v is Record<string, unknown> =>
    v !== null && typeof v === "object" && !Array.isArray(v)) : [];
}

export function selectCareerJobs(labels: readonly string[], mbti: CareerMbtiSelection, roles: CareerRoleSelection): CareerReportEvidencePacket["recommendedJobs"] {
  const mbtiJobs = records(mbti.profile?.recommendedJobs).flatMap((job, index) => {
    if (typeof job.job !== "string" || typeof job.reason !== "string") return [];
    const supported = (Array.isArray(job.matchingMyeongliSignals) ? job.matchingMyeongliSignals : [])
      .filter((s): s is string => typeof s === "string" && careerSignalMatches(labels, s));
    const matchedRoles = roles.filter((r) => r.signals.some((s) => supported.includes(s)));
    const shared = supported.length > 0;
    return [{ title: job.job, fit: shared ? "high" as const : "medium" as const,
      reason: `${mbti.profile!.type}의 직무 예시: ${job.reason}${shared ? ` 원국의 ${supported.join("·")} 신호와도 접점이 있습니다.` : " 명리와의 공통 근거가 확인된 추천은 아니므로 실제 업무 조건을 비교하세요."}`,
      caution: matchedRoles[0]?.fatigue ?? "유형만으로 적성을 확정할 수 없습니다. 채용 요건과 실제 업무 경험을 함께 확인하세요.",
      evidenceIds: [`mbti:${mbti.profile!.type}:recommendedJobs:${index}`, ...supported.map((s) => `natal:${s}`)],
      role: matchedRoles[0]?.role ?? "유형 기반 탐색", environment: matchedRoles[0]?.environment ?? "실제 업무 조건 확인 필요" }];
  });
  const roleJobs = roles.flatMap((r) => r.jobs.map((title, index) => ({ title, fit: "medium" as const,
    reason: `${r.tasks[index]}를 비교해 보세요. 근거는 ${r.signals.join("·")}의 ${r.role} 관점입니다.`,
    caution: r.fatigue, role: r.role, environment: r.environment,
    evidenceIds: r.signals.map((s) => `natal:${s}`) })));
  // Sparse/no-MBTI input: comparison examples, never pretend these are proven strengths.
  const comparisons = roleRules.flatMap((r) => r.jobs).map((title) => ({ title, fit: "medium" as const,
    reason: "개인 근거만으로 이 직무의 적합도를 높게 판단할 수 없습니다. 담당 업무와 자격 요건을 비교하는 탐색용 예시입니다.",
    caution: "직업명보다 실제 업무, 권한, 근무 조건을 확인하세요.", evidenceIds: ["comparison-only"] }));
  const sorted = [...mbtiJobs.filter((j) => j.fit === "high"), ...roleJobs, ...mbtiJobs.filter((j) => j.fit !== "high"), ...comparisons];
  const seen = new Set<string>();
  // Keep both source layers visible, even when there are many natal role examples.
  const preferred = [...mbtiJobs.filter((j) => j.fit === "high").slice(0, 3), ...mbtiJobs.filter((j) => j.fit !== "high").slice(0, 1), ...roleJobs, ...sorted];
  return preferred.filter((j) => !seen.has(j.title) && !!seen.add(j.title)).slice(0, 10);
}

export function selectCareerAvoid(mbti: CareerMbtiSelection) {
  return records(mbti.profile?.avoidJobsOrEnvironments).flatMap((item, index) =>
    typeof item.name === "string" && typeof item.reason === "string" ? [{
      type: "career_risk" as const, strength: "medium" as const, title: item.name,
      plain: `${mbti.profile!.type}의 환경 선호 관점에서 ${item.reason}`,
      evidenceIds: [`mbti:${mbti.profile!.type}:avoidJobsOrEnvironments:${index}`],
    }] : []).slice(0, 3);
}
