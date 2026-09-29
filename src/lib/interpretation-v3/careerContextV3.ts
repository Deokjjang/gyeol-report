import { CAREER_RULES, interpretCareerContext, type CareerContext } from "./context";
import type { UserContextProfile } from "../report-knowledge/userContextTypes";
import { careerEditorialScenes } from "./careerEditorialScenes";

// V3-only taxonomy extension. The default interpreter (and frozen Phase B)
// deliberately keep their original output. These describe work, NOT ability.
const rules: typeof CAREER_RULES = [
  { id: "saas", pattern: /\bsaas\b|\bb2b\b/i, fields: { industry: "software", analysisIntensity: "high", keyWorkModes: ["고객 요구 분석", "CRM 검토"], outputTypes: ["고객별 전환 분석"], successMetrics: ["재계약", "계약 전환"], stakeholders: ["고객사", "제품팀"] } },
  { id: "engineering", pattern: /개발자|프로그래머|엔지니어|백엔드|프론트엔드|\bdeveloper\b/i, fields: { roleFamily: "engineering", industry: "software", analysisIntensity: "high", keyWorkModes: ["코드 리뷰", "문제 재현"], outputTypes: ["코드", "테스트"], successMetrics: ["서비스 안정성", "요구사항 충족"], stakeholders: ["리뷰 동료", "사용자"] } },
  { id: "care", pattern: /간호|의료|병원|치료|보건/, fields: { industry: "healthcare", roleFamily: "care_operations", customerFacing: true, ruleIntensity: "high", physicalIntensity: "high", operationsIntensity: "high", keyWorkModes: ["상태 확인", "인계"], outputTypes: ["인계 기록", "처치 확인"], successMetrics: ["안전", "누락 없는 인계"], stakeholders: ["환자", "보호자", "다음 근무자"] } },
  { id: "education", pattern: /교사|교수|교육|강사|학원/, fields: { industry: "education", roleFamily: "teaching", customerFacing: true, creativeIntensity: "high", keyWorkModes: ["설명", "이해 확인"], outputTypes: ["수업 자료", "피드백"], successMetrics: ["이해의 변화", "학습 지속"], stakeholders: ["학습자", "보호자"] } },
  { id: "finance_rules", pattern: /세무|회계|감사|법무|공무원|행정/, fields: { industry: "professional_services", roleFamily: "regulated_analysis", analysisIntensity: "high", ruleIntensity: "high", keyWorkModes: ["증빙 대조", "기준 검토"], outputTypes: ["검토 자료", "처리 기록"], successMetrics: ["기한 준수", "오류 예방"], stakeholders: ["의뢰인", "검토 담당자"] } },
  { id: "public", pattern: /공무원|행정|공공/, fields: { industry: "public_service", customerFacing: true, keyWorkModes: ["민원 확인"], outputTypes: ["처리 근거"], stakeholders: ["민원인", "협조 부서"] } },
  { id: "service", pattern: /카페|식당|음식|요식|네일|미용|헤어|매장|공방/, fields: { industry: "local_service", roleFamily: "customer_service", customerFacing: true, operationsIntensity: "high", physicalIntensity: "high", salesIntensity: "medium", keyWorkModes: ["응대", "예약·주문 관리"], outputTypes: ["고객 경험", "완성 서비스"], successMetrics: ["재방문", "고객 만족", "원가"], stakeholders: ["단골", "신규 고객"] } },
  { id: "visual", pattern: /크리에이터|영상|디자이너|작가|일러스트|네일|미용|헤어/, fields: { creativeIntensity: "high", keyWorkModes: ["시안 제작", "수정"], outputTypes: ["작업물", "포트폴리오"], successMetrics: ["완성도", "재의뢰"] } },
  { id: "production", pattern: /생산관리|현장|물류|공정|설비/, fields: { roleFamily: "field_operations", operationsIntensity: "high", physicalIntensity: "high", keyWorkModes: ["작업 순서 조정", "이상 확인"], outputTypes: ["작업 기록", "인수인계"], successMetrics: ["안전", "납기", "재작업 감소"], stakeholders: ["현장 작업자", "다음 공정"] } },
];
const arrayKeys = ["keyWorkModes", "outputTypes", "successMetrics", "stakeholders"] as const;
export function interpretCareerContextV3(text: string, robust = false, status = ""): CareerContext {
  let result = interpretCareerContext("");
  // Merge list-valued descriptors rather than letting 영업 overwrite 기획/IT.
  for (const rule of [...CAREER_RULES, ...rules]) if (rule.pattern.test(text)) {
    const before = result;
    result = { ...result, ...rule.fields };
    for (const key of arrayKeys) result = { ...result, [key]: [...new Set([...before[key], ...(rule.fields[key] ?? [])])] };
  }
  if (!robust) return result; // Frozen snapshot replay.
  const industry = /제조|공정|생산/.test(text) ? "manufacturing" : /교육|강사|교사|튜터|학원/.test(text) ? "education" : /병원|의료|간호/.test(text) ? "healthcare" : result.industry;
  const seniority = /대표|사업주|사장/.test(text) || status === "business_owner" ? "owner" : /과장|팀장|부장|관리자/.test(text) ? "manager" : "unspecified";
  const functionName = /재무|회계|원가|예산|경영기획|FP&A/i.test(text) ? "finance_planning"
    : /강사|교사|튜터|강의|교수/.test(text) ? "teaching"
    : /행정|총무|사무/.test(text) ? "administration"
    : /간호|치료|의사/.test(text) ? "care_operations"
    : /생산관리|품질|공정|현장|물류|설비/.test(text) ? "field_operations"
    : /디자인|디자이너|일러스트/.test(text) ? "design"
    : ["engineering", "sales_operations", "customer_service"].includes(result.roleFamily) ? result.roleFamily
    : seniority === "owner" ? "business_operations" : ["teaching", "care_operations"].includes(result.roleFamily) ? "unknown" : result.roleFamily;
  const descriptors: Partial<CareerContext> = functionName === "finance_planning" ? {
    analysisIntensity: "high", creativeIntensity: "unknown", physicalIntensity: "low", operationsIntensity: "medium",
    keyWorkModes: ["예산 편성", "실적과 계획 비교", "투자안 검토"], outputTypes: ["손익 전망", "경영진 보고"], successMetrics: ["예측 정확도", "비용 구조 개선"], stakeholders: ["부서 담당자", "경영진"],
  } : functionName === "business_operations" ? {
    operationsIntensity: "high", salesIntensity: "high", keyWorkModes: ["상품 설계", "고객 획득", "운영 조율"], outputTypes: ["상품", "사업계획"], successMetrics: ["현금흐름", "재구매", "수익성"], stakeholders: ["고객", "팀", "파트너"],
  } : functionName === "administration" ? {
    physicalIntensity: "low", keyWorkModes: ["일정 조율", "서류 확인"], outputTypes: ["처리 기록", "안내 자료"], successMetrics: ["정확한 안내", "누락 예방"], stakeholders: ["이용자", "담당 부서"],
  } : {};
  // Industry supplies a setting, not evidence of a person's day-to-day function.
  return { ...result, ...descriptors, industry, function: functionName, roleFamily: functionName, seniority,
    workMode: status === "freelancer" ? "independent" : seniority === "owner" ? "owner" : status || "unspecified" };
}

export type WorkArena = {
  label: string; stage: string; output: string; people: string; measure: string;
  start: string; pinch: string; praise: string; growth: string; learning: string; next: string;
};
export function careerWorkArena(context: UserContextProfile, work: CareerContext): WorkArena {
  const label = context.fieldLabel || "지금 맡은 일";
  const base: WorkArena = { label, stage: work.keyWorkModes.slice(-2).join("·") || "일의 시작과 마무리", output: work.outputTypes.slice(-2).join("·") || "맡은 결과물", people: work.stakeholders.slice(-2).join("·") || "함께 일하는 사람", measure: work.successMetrics.slice(-2).join("·") || "약속한 결과",
    start: "일을 넘겨받았는데 설명과 실제 해야 할 일이 다를 때", pinch: "끝난 줄 알았던 일에 새로운 조건이 붙을 때", praise: "이 일을 맡기면 끝까지 연결된다는 신뢰", growth: "직접 잘하는 것과 다른 사람도 잘하게 만드는 것의 차이", learning: "최근 막혔던 실제 사례", next: "속도보다 결과를 제대로 알아보는 환경" };
  if (work.roleFamily === "engineering") Object.assign(base, { start: "요구사항을 읽다가 빠진 예외가 먼저 떠오를 때", pinch: "코드 리뷰 중 고친 부분보다 바뀐 요구사항이 더 많을 때", praise: "어려운 문제를 재현하고 다음 장애까지 줄였다는 인정", growth: "기술을 깊게 파는 전문가 경로와 리뷰·협업을 이끄는 관리 경로", learning: "최근 버그의 재현 조건과 설계 이유", next: "리뷰 기준과 기술 부채를 논의할 시간이 있는 팀" });
  else if (work.industry === "healthcare") Object.assign(base, { start: "인계가 끝났는데 환자의 작은 변화가 마음에 걸릴 때", pinch: "보호자의 질문과 다음 처치가 한꺼번에 겹칠 때", praise: "다음 근무자가 안심하고 이어받을 만큼 빠짐없는 인계", growth: "현장 숙련을 키울지 교육·조정 역할까지 맡을지", learning: "익명화한 인계 사례와 놓치기 쉬운 확인 순서", next: "안전 기준과 회복 시간을 실제로 지키는 근무 환경" });
  else if (work.industry === "education") Object.assign(base, { start: "설명은 끝났는데 학습자의 표정이 아직 멈춰 있을 때", pinch: "수업 준비와 개별 질문이 겹쳐 내 준비 시간이 밀릴 때", praise: "어렵던 것을 이해하게 됐다는 학습자의 반응", growth: "수업 전문성을 깊게 할지 교육과정·동료 지원까지 넓힐지", learning: "같은 개념을 다르게 설명한 수업 사례", next: "수업의 질과 준비 시간을 함께 존중하는 환경" });
  else if (work.roleFamily === "regulated_analysis") Object.assign(base, { start: "자료의 합계는 맞는데 증빙 하나가 설명되지 않을 때", pinch: "마감 직전에 누락 자료가 도착하고 검토 시간은 줄어들 때", praise: "문제없어 보이던 자료의 오류를 미리 찾아낸 신뢰", growth: "검토 깊이를 키울지 설명·고객 조정까지 맡을지", learning: "바뀐 기준을 실제 사례에 대입한 검토 과정", next: "검토 시간을 인정하고 애매한 기준을 함께 확인하는 곳" });
  else if (work.roleFamily === "field_operations") Object.assign(base, { start: "앞 공정의 작은 지연이 뒤 일정 전체로 번질 때", pinch: "납기 압박 속에서 현장 확인을 생략하자는 말이 나올 때", praise: "문제가 커지기 전에 이상을 잡고 재작업을 줄인 실력", growth: "직접 해결하는 숙련과 공정 전체를 조정하는 역할의 차이", learning: "실제 이상 사례와 조치 전후의 변화", next: "안전·품질을 납기와 함께 판단하는 현장" });
  else if (work.industry === "local_service") Object.assign(base, { start: "예약이나 주문이 겹치는데 단골의 작은 요청까지 기억날 때", pinch: "손님은 늘었는데 마감 뒤 남는 시간과 돈은 줄어들 때", praise: "다음에도 여기로 오겠다는 고객의 말", growth: "내 손에만 달린 품질과 다른 사람에게 넘길 운영을 가르는 일", learning: "고객 반응과 재방문 이유를 연결한 서비스 실험", next: "고객층·원가·체력을 함께 지킬 수 있는 운영 규모" });
  else if (work.salesIntensity === "high") Object.assign(base, { start: "CRM 숫자는 괜찮은데 실제 계약이 어디서 멈췄는지 궁금할 때", pinch: "고객에게 한 약속과 내부 제품 일정이 어긋날 때", praise: "고객 요구를 내부 실행과 계약 전환으로 연결한 성과", growth: "직접 거래를 만드는 힘과 다른 사람도 재현할 영업 구조의 차이", learning: "성사된 제안과 멈춘 계약의 차이", next: "매출 숫자만이 아니라 재계약과 제품팀 협업까지 보는 곳" });
  else if (work.creativeIntensity === "high") Object.assign(base, { start: "초안을 보여줬는데 좋다는 말보다 미묘한 망설임이 걸릴 때", pinch: "거의 끝난 작업에 취향이 다른 수정 요청이 이어질 때", praise: "내 의도를 정확히 이해해 결과로 보여줬다는 반응", growth: "제작의 깊이와 기획·디렉팅 범위를 어떻게 나눌지", learning: "초안과 최종 작업물 사이에 달라진 선택", next: "시안의 의도와 수정 범위를 대화할 수 있는 작업 환경" });
  if (context.lifeStatus === "student" || context.lifeStatus === "exam_certificate") return { ...base, label: context.fieldLabel || "지금 배우는 분야", stage: "수업·공부·작은 실습", output: "과제·작은 포트폴리오", people: "친구·선생님", measure: "설명할 수 있는 이해와 직접 만든 결과", start: "읽을 때는 알았는데 혼자 문제를 풀면 막힐 때", pinch: "시험이 가까워졌는데 재미있는 부분만 오래 보고 있을 때", praise: "네 설명을 듣고 이해됐다는 친구의 말", growth: "점수로 확인한 실력과 직접 해보며 생긴 취향을 구분하는 일", learning: "틀린 문제의 전제와 직접 해본 과제", next: "수업 밖에서 실제 결과를 만들어 볼 첫 경험" };
  if (["job_seeker", "resting"].includes(context.lifeStatus)) return { ...base, label: context.fieldLabel || "다음에 맡고 싶은 역할", stage: "지원 준비·작은 직무 경험", output: "지원 사례·작업 샘플", people: "현직자·함께 준비하는 사람", measure: "내 강점을 설명하는 구체적 사례", start: "채용 공고를 보다가 내가 실제로 할 하루가 궁금해질 때", pinch: "공고의 멋진 이름과 실제 업무 설명이 다를 때", praise: "왜 그렇게 했는지까지 설명할 수 있는 지원자라는 인상", growth: "준비의 양보다 맡아 본 문제의 깊이를 늘리는 일", learning: "관심 직무의 작은 문제를 직접 풀어본 경험", next: "처음부터 완벽한 경력보다 배울 담당자와 실제 업무가 보이는 곳" };
  if (work.function) {
    const scenes = careerEditorialScenes(context, work);
    return { ...base, start: scenes.entry, pinch: scenes.pressure, praise: scenes.recognition, growth: scenes.handoff, learning: scenes.learning, next: scenes.next };
  }
  return base;
}
