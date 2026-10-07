import type { GuidanceCandidate, GuidanceProblem, GuidanceStrategyId, GuidanceUserContext, LifeStatus, WorkMode, GuidanceRelationshipStatus } from "./guidanceCore";
import { guidanceStrategy } from "./guidanceStrategies";

export type GuidanceContextVariant = { id: string; problems: GuidanceProblem[]; modes?: WorkMode[]; life?: LifeStatus; relationship?: GuidanceRelationshipStatus;
  strategies: GuidanceStrategyId[]; advice: string; why?: string; safety?: boolean };
const v = (id: string, problems: GuidanceProblem[], strategies: GuidanceStrategyId[], advice: string, match: Omit<GuidanceContextVariant, "id" | "problems" | "strategies" | "advice"> = {}): GuidanceContextVariant => ({ id, problems, strategies, advice, ...match });
export const GUIDANCE_CONTEXT_VARIANTS: readonly GuidanceContextVariant[] = [
  v("precision-safety", ["PERFECTIONISM_DELAY", "NEVER_ENOUGH"], ["PRIORITIZE_CRITICAL_ERRORS", "DEFINE_DONE"], "정확성을 낮추는 게 답은 아닙니다. 규정상 필요한 검토는 그대로 지키고, 반드시 다시 확인할 것과 한 번 확인해도 되는 것을 구분해서 중요한 부분에 집중하는 편이 좋습니다.", { modes: ["HIGH_STAKES_PRECISION"], safety: true, why: "정확성을 버리면 안 되는 일이므로 검토를 없애기보다 확인할 기준을 나누는 방식이 맞습니다." }),
  v("perfection-product", ["PERFECTIONISM_DELAY"], ["ITERATE_WHEN_SAFE", "DEFINE_DONE"], "나중에 수정해도 큰 문제가 없는 일이라면 작은 버전을 먼저 내놓고 실제 반응을 확인한 뒤 고치는 편이 좋습니다.", { modes: ["ITERATIVE_PRODUCT"] }),
  v("perfection-craft", ["PERFECTIONISM_DELAY"], ["LIMIT_REVISION", "SELECTIVE_FEEDBACK"], "완성도를 포기할 필요는 없습니다. 수정 횟수와 마감 기준을 먼저 정하고, 외부 의견은 믿을 만한 몇 명에게만 받아 끝없이 손보는 것을 막는 편이 좋습니다.", { modes: ["CRAFT_FINAL_OUTPUT"] }),
  v("perfection-editorial", ["PERFECTIONISM_DELAY"], ["PRIORITIZE_CRITICAL_ERRORS", "DEFINE_DONE"], "모든 문장을 같은 중요도로 고치기보다 독자의 이해에 영향을 주는 문제와 사실 오류부터 먼저 확인하는 편이 좋습니다. 취향의 차이는 어느 시점에서 멈출지 기준을 정해두세요.", { modes: ["EDITORIAL_REVIEW"], why: "독자의 이해와 사실의 정확성은 지키면서 끝없는 취향 수정을 구분할 수 있습니다." }),
  v("research-stop", ["OVERTHINKING", "INFORMATION_OVERLOAD"], ["STOP_RULE", "TIMEBOX_THINKING"], "깊게 파는 능력은 줄일 필요가 없습니다. 조사하기 전에 '이 질문들에 답하면 끝낸다'는 종료 조건과 시간을 먼저 정해두는 편이 좋습니다.", { modes: ["RESEARCH_EXPLORATION"] }),
  v("operations-routine", ["ROUTINE_DROP"], ["EXTERNALIZE_MEMORY", "DEFINE_DONE"], "반복 업무를 기억에 맡기기보다 체크리스트나 정해진 순서로 적어두고, 남는 에너지는 개선할 일에 쓰는 편이 좋습니다.", { modes: ["OPERATIONS_PROCESS"] }),
  v("market-response", ["PERFECTIONISM_DELAY", "OVERTHINKING"], ["ITERATE_WHEN_SAFE"], "머릿속에서 고객 반응을 오래 예상하기보다 위험이 낮은 범위에서는 실제 반응을 작게 확인하는 편이 더 정확한 정보를 줍니다.", { modes: ["SALES_MARKET"] }),
  v("service-boundary", ["PEOPLE_PLEASING", "WEAK_BOUNDARY", "OVER_CARE"], ["SET_BOUNDARY", "DEFINE_RESPONSIBILITY"], "사람을 잘 챙기는 건 장점입니다. 다만 도와주는 것과 그 사람의 문제를 대신 책임지는 것은 구분하는 편이 좋습니다.", { modes: ["PEOPLE_SERVICE"] }),
  v("leader-outcomes", ["OVERRESPONSIBILITY", "DELEGATION_DIFFICULTY", "MICROMANAGEMENT"], ["DELEGATE_BY_OUTCOME", "DEFINE_RESPONSIBILITY"], "내가 가장 빨리 해결할 수 있다고 모든 일을 가져오면 사람이 늘어도 일이 줄지 않습니다. 필요한 결과 기준은 알려주되 방법 전체를 통제하지 말고, 직접 결정할 일과 결과만 확인할 일을 나누는 편이 좋습니다.", { modes: ["LEADERSHIP_MANAGEMENT"] }),
  v("public-recovery", ["SOCIAL_DRAIN", "REST_GUILT", "SCHEDULE_OVERLOAD"], ["RECOVERY_BLOCK", "CAP_COMMITMENTS"], "사람들 앞에서 에너지를 많이 쓰는 날에는 끝난 뒤 회복할 시간까지 일정의 일부로 정해두는 편이 좋습니다.", { modes: ["PERFORMANCE_PUBLIC"] }),
  v("student-practice", ["PERFECTIONISM_DELAY"], ["DEFINE_DONE"], "모든 내용을 완벽하게 이해한 뒤 문제를 풀려고 기다리기보다 공부하면서 연습 문제를 같이 풀어보세요. 오늘 끝낼 범위를 먼저 정하는 편이 좋습니다.", { life: "STUDENT" }),
  v("student-thinking", ["OVERTHINKING"], ["TIMEBOX_THINKING"], "공부할 범위와 끝낼 시간을 먼저 정하고 그 안에서 중요한 질문부터 해결하는 편이 좋습니다.", { life: "STUDENT" }),
  v("applicant-submit", ["PERFECTIONISM_DELAY"], ["DEFINE_DONE"], "지원서의 사실관계는 정확히 확인하되, 제출 가능한 기준을 정하고 실제 지원 반응을 보며 수정하는 편이 좋습니다. 한 지원서를 끝없이 고칠 필요는 없습니다.", { life: "JOB_SEEKER" }),
  v("applicant-worth", ["NEVER_ENOUGH"], ["CELEBRATE_AND_REVIEW"], "지원 결과와 자기 능력을 같은 것으로 보지 말고 이번 지원에서 잘된 점과 바꿀 수 있는 부분을 따로 적어보는 편이 좋습니다.", { life: "JOB_SEEKER" }),
  v("freelance-price", ["MEANING_OVER_MONEY"], ["VALUE_AND_PRICE_SEPARATE"], "좋아하고 의미 있는 일인지와 그 일이 내 시간과 비용에 맞는 가격인지는 따로 계산하는 편이 좋습니다.", { life: "FREELANCER" }),
  v("freelance-scope", ["OVERRESPONSIBILITY"], ["DEFINE_RESPONSIBILITY"], "할 수 있다는 이유로 범위를 계속 넓히기보다 처음 약속한 일과 추가 요청을 구분하는 편이 좋습니다.", { life: "FREELANCER" }),
  v("owner-opportunity", ["OPPORTUNITY_HOPPING"], ["REMOVE_BEFORE_ADD", "PRIORITIZE_BY_IMPACT"], "새로운 사업이나 아이디어는 기대되는 수익뿐 아니라 기존 일에서 빠져나갈 시간까지 같이 계산하세요. 추가하기 전에 끝내거나 뺄 일을 먼저 정하는 편이 좋습니다.", { life: "BUSINESS_OWNER" }),
  v("owner-delegation", ["DELEGATION_DIFFICULTY"], ["DELEGATE_BY_OUTCOME"], "직접 결정해야 할 일과 결과만 확인하면 되는 일을 나누세요. 맡길 일은 필요한 결과와 확인 기준만 알려주고 방법은 맡기는 편이 좋습니다.", { life: "BUSINESS_OWNER" }),
  v("dating-expectation", ["UNSPOKEN_EXPECTATION"], ["COMMUNICATE_STATE"], "상대가 알아서 알아주길 기다리기보다 원하는 행동을 짧고 구체적으로 말하는 편이 좋습니다. '이번에는 먼저 연락해줬으면 좋겠어'처럼요.", { relationship: "DATING" }),
  v("dating-signals", ["OVERREADING_SIGNALS"], ["SEPARATE_FACT_INTERPRETATION"], "답장이 늦었다는 사실과 '마음이 식었다'는 해석을 따로 적어보는 편이 좋습니다.", { relationship: "DATING" }),
  v("married-expectation", ["UNSPOKEN_EXPECTATION", "WEAK_BOUNDARY", "OVER_CARE"], ["DEFINE_RESPONSIBILITY"], "서로 당연히 알고 있을 거라고 넘기기보다 돈, 집안일, 시간처럼 반복되는 기대는 말로 맞춰두고 각자 맡을 범위를 구분하는 편이 좋습니다.", { relationship: "MARRIED" }),
  v("withdrawal-dating", ["EMOTIONAL_WITHDRAWAL"], ["COMMUNICATE_STATE"], "지금 말이 줄어든 이유가 상대 때문인지 아닌지만 짧게 알려두세요. 혼자 정리할 시간이 필요하다는 말도 불필요한 오해를 줄입니다.", { relationship: "DATING" }),
  v("withdrawal-married", ["EMOTIONAL_WITHDRAWAL"], ["COMMUNICATE_STATE"], "지금 말이 줄어든 이유가 상대 때문인지 아닌지만 짧게 알려두고, 혼자 정리한 뒤 다시 이야기할 시간을 정하는 편이 좋습니다.", { relationship: "MARRIED" }),
  v("withdrawal-general", ["EMOTIONAL_WITHDRAWAL"], ["COMMUNICATE_STATE"], "설명할 힘이 없더라도 지금 어떤 상태인지와 조금 혼자 정리할 시간이 필요하다는 정도는 짧게 말해두는 편이 좋습니다."),
  v("explanation-order", ["OVEREXPLAINING"], ["PRIORITIZE_BY_IMPACT"], "설명할 때는 결론부터 말하고, 그다음 이유, 마지막에 세부 내용을 붙이는 편이 좋습니다."),
  v("enough-review", ["NEVER_ENOUGH"], ["CELEBRATE_AND_REVIEW"], "고칠 부분과 이미 잘된 부분을 같은 목록에서 섞어보지 말고 따로 적어보는 편이 좋습니다."),
  v("next-goal-review", ["NEXT_GOAL_TOO_FAST"], ["CELEBRATE_AND_REVIEW"], "다음 목표를 바로 잡기 전에 이번에 실제로 나아진 것과 새로 얻은 것을 한번 적어보는 편이 좋습니다."),
  v("rumination-record", ["RUMINATION"], ["SEPARATE_FACT_INTERPRETATION", "EXTERNALIZE_MEMORY"], "계속 떠오르는 일을 머릿속에서만 되풀이하지 말고 적어보세요. 확인된 사실과 그때 붙인 해석을 나누는 편이 좋습니다."),
];
export function matchingGuidanceVariants(problem: GuidanceProblem, c: GuidanceUserContext): GuidanceContextVariant[] {
  const credible = c.workModes.filter(m => m.confidence >= .6), top = credible[0]?.mode;
  // Student/applicant tasks take precedence over an unconfirmed target job.
  const statusFirst = c.lifeStatus === "STUDENT" || c.lifeStatus === "JOB_SEEKER";
  return GUIDANCE_CONTEXT_VARIANTS.filter(v => v.problems.includes(problem) && (!v.life || v.life === c.lifeStatus) &&
    (!v.relationship || v.relationship === c.relationshipStatus) && (!v.modes || (v.safety ? credible.some(m => v.modes!.includes(m.mode)) : !!top && v.modes.includes(top))))
    .sort((a, b) => score(b) - score(a) || a.id.localeCompare(b.id));
  function score(v: GuidanceContextVariant) { return v.safety ? 100 : v.relationship ? 90 : v.life && statusFirst ? 85 : v.modes ? 80 : v.life ? 70 : 10; }
}
/** Safe strategy-level wording overrides apply even in a secondary precision mode. */
export function safeStrategyAdvice(id: GuidanceStrategyId, c: GuidanceUserContext): Pick<GuidanceCandidate, "customerAdvice"> & { contextVariantId: string } {
  if (c.workModes.some(m => m.mode === "HIGH_STAKES_PRECISION" && m.confidence >= .6)) {
    if (id === "LIMIT_REVISION") return { customerAdvice: "필수 검토와 규정은 그대로 지키고 중요도에 따라 다시 확인할 범위를 나누는 편이 좋습니다.", contextVariantId: "strategy:precision-revision" };
    if (id === "SMALL_EXPERIMENT") return { customerAdvice: "실제 업무의 정확성과 규정을 건드리지 않는 연습 환경에서만 작은 시험 범위를 정하는 편이 좋습니다.", contextVariantId: "strategy:precision-experiment" };
    if (id === "SELECTIVE_FEEDBACK") return { customerAdvice: "필수 검토자와 승인 절차는 그대로 유지하고 추가 의견이 필요한 부분만 구분하는 편이 좋습니다.", contextVariantId: "strategy:precision-feedback" };
  }
  return { customerAdvice: guidanceStrategy(id).generalAdvice, contextVariantId: `general:${id}` };
}
