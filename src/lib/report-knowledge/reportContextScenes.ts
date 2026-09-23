import type { UserContextProfile } from "./userContextTypes";
import type { TenGod } from "./annualFortuneTypes";
import { withKoreanParticle } from "./koreanCopyUtils";

// These are possible activities, not facts inferred about someone's actual job.
// The caller selects the ten-god from validated evidence, never from job keywords.
export function selectReportActivity(context: Pick<UserContextProfile, "lifeStatus" | "fieldLabel">) {
  const field = context.fieldLabel?.trim() ?? "";
  if (context.lifeStatus === "student" || context.lifeStatus === "exam_certificate") return {
    id: "study", label: "학습·과제", output: "발표 자료와 과제 초안", review: "과목별 평가 기준과 풀이 과정", resource: "교재·자격 준비 비용과 사용 시간", collaboration: "팀 프로젝트의 분담과 제출 일정",
    jobs: ["교육 기획자", "리서치 담당자", "프로젝트 코디네이터"], fields: ["전공 적용 과제", "관심 인턴 직무의 기초", "지원 자격의 시험 과목"],
  };
  if (/영업|세일즈|sales|CRM|거래처/iu.test(field)) return {
    id: "sales_operations", label: "영업·거래 운영", output: "고객 제안서와 영업 보고서", review: "CRM 기록과 제안의 근거", resource: "계약 범위·정산일·성과 보상 조건", collaboration: "영업·개발·지원 사이의 인수인계",
    jobs: ["영업 운영", "거래처 관리", "운영 기획자", "프로젝트 매니저", "서비스 기획자", "기술 문서 담당"], fields: ["CRM 데이터 정리", "영업 보고를 위한 데이터·SQL 기초", "계약·정산 흐름", "제안서 구조화"],
  };
  if (/품질|제조|생산|공정/u.test(field)) return {
    id: "quality_operations", label: "품질·운영", output: "검사 결과와 개선안", review: "판정 기준과 재현 기록", resource: "재작업 비용과 투입 시간", collaboration: "생산·검사 담당자 사이의 승인과 인계",
    jobs: ["품질 관리", "운영 기획자", "프로젝트 매니저", "데이터 분석 보조"], fields: ["품질 지표 분석", "공정 기록과 원인 검토", "개선 과제 보고"],
  };
  if (/디자인|콘텐츠|브랜드|마케|기획|개발|소프트웨어|\b(?:software|UX|IT)\b/iu.test(field)) return {
    id: "project_creation", label: "기획·제작", output: "기획안과 시험 가능한 시안", review: "요구사항과 피드백 기록", resource: "제작 시간·수정 범위·견적", collaboration: "기획·제작·검토 담당자의 작업 경계",
    jobs: ["서비스 기획자", "콘텐츠 기획자", "운영 기획자", "프로젝트 매니저"], fields: ["요구사항 정리", "작은 시제품 검증", "포트폴리오 사례 작성"],
  };
  return { id: "general", label: "현재 활동", output: "완성해 공유할 결과물", review: "판단 근거와 실제 결과", resource: "사용할 시간과 비용", collaboration: "함께 맡을 일과 각자의 책임", jobs: [] as string[], fields: [] as string[] };
}

export type ReadingIntent = "scene" | "warning" | "action" | "transition";
/** Intent selects a different question, not a random synonym or numbered variant. */
export function contextualTenGodReading(context: Pick<UserContextProfile, "lifeStatus" | "fieldLabel">, god: TenGod, intent: ReadingIntent): string {
  const a = selectReportActivity(context);
  const subject = /재/.test(god) ? a.resource : /관/.test(god) ? a.collaboration : /인/.test(god) ? a.review : /식신|상관/.test(god) ? a.output : a.collaboration;
  const questions: Record<TenGod, { scene: string; warning: string; action: string; transition: string }> = {
    비견: { scene: "각자의 판단과 공동 기준이 어디서 다른지 비교하는 장면", warning: "내 방식에 맞추느라 다른 사람의 기여를 빠뜨리는지", action: "각자 결정할 항목과 공동 검토할 항목을 나눕니다", transition: "혼자 정한 기준 중 다른 사람과 다시 합의할 항목을 남깁니다" },
    겁재: { scene: "공동 성과와 개인의 부담을 나누는 장면", warning: "관계 때문에 맡은 몫을 넘겨 약속하는지", action: "추가 요청을 받기 전에 담당·분담액·완료 조건을 확인합니다", transition: "이전 약속의 미완료분을 새 분담에 포함해 확인합니다" },
    식신: { scene: "작은 완성본을 내고 실제 반응을 받는 장면", warning: "제작량을 늘리느라 검토와 수정 시간을 놓치는지", action: "한 번에 검토 가능한 초안을 만들고 받은 피드백을 기록합니다", transition: "이미 만든 결과에서 재사용할 부분과 수정할 부분을 나눕니다" },
    상관: { scene: "기존 방식의 불편을 대안으로 바꾸어 제안하는 장면", warning: "문제 지적이 담당자에 대한 평가로 들리는지", action: "바꿀 한 항목의 전후 차이를 보여 주고 시험 범위를 합의합니다", transition: "제안만 남은 변경과 검증까지 끝난 변경을 구분합니다" },
    정재: { scene: "반복해서 유지할 조건을 실제 기록과 맞추는 장면", warning: "작은 추가 부담이 누적되는 것을 놓치는지", action: "계획한 양과 실제 사용량을 같은 기간으로 비교합니다", transition: "유지 비용이 달라진 항목부터 다음 계획에 반영합니다" },
    편재: { scene: "외부 제안을 기존 자원으로 감당할 수 있는지 비교하는 장면", warning: "가능한 보상을 이미 확보한 것으로 여기는지", action: "투입 한도와 회수·완료 시점을 확인한 뒤 수락 범위를 정합니다", transition: "아직 회수하지 못한 자원과 새로 쓸 자원을 겹쳐 잡지 않습니다" },
    정관: { scene: "기대받는 역할과 실제 평가 조건을 확인하는 장면", warning: "책임만 추가되고 결정권은 그대로인지", action: "완료 기준·승인자·변경 절차를 함께 확인합니다", transition: "평가 기준이 바뀌었다면 진행 중인 일에 적용할 범위를 합의합니다" },
    편관: { scene: "급한 요청 중 우선 처리할 범위를 정하는 장면", warning: "긴급하다는 이유로 검토를 전부 생략하는지", action: "마감 전에 반드시 확인할 항목과 미룰 항목을 분리합니다", transition: "급히 처리한 항목의 후속 검토를 다음 일정에 남깁니다" },
    정인: { scene: "배운 기준을 도움 없이 적용해 보는 장면", warning: "자료를 갖춘 것을 실제로 할 수 있는 능력과 혼동하는지", action: "참고 자료를 닫고 한 사례를 풀어 본 뒤 막힌 지점을 확인합니다", transition: "쌓은 자료 중 다음 과제에 직접 쓸 근거만 추려 둡니다" },
    편인: { scene: "서로 다른 설명을 작은 사례로 비교하는 장면", warning: "가능한 해석을 늘리며 결정을 미루는지", action: "두 가설을 구분할 확인 질문을 만들고 실제 결과로 좁힙니다", transition: "검증하지 못한 해석은 결론과 분리해 다음 검토로 넘깁니다" },
  };
  const q = questions[god];
  if (intent === "scene") return `${withKoreanParticle(subject, "object")} 다루는 일이 있다면, ${q.scene}에 이 관점을 적용해 볼 수 있습니다.`;
  if (intent === "warning") return `${withKoreanParticle(subject, "object")} 살필 때 ${q.warning} 확인하세요.`;
  if (intent === "transition") return `${subject}에 관해서는 ${q.transition}.`;
  return `${withKoreanParticle(subject, "object")} 실제로 맡는 경우에는 ${q.action}.`;
}
