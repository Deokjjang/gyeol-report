import { a, claim, risk, fusion, limited, existing } from "./personalResonanceRules";
import type { ResonanceCondition } from "./personalResonanceCore";
import { GUIDANCE_PROBLEMS, type GuidanceCondition, type GuidanceProblemDefinition, type GuidanceStrategyId } from "./guidanceCore";
import type { InterpretationContext } from "./semanticCore";

const e = (condition: ResonanceCondition): GuidanceCondition => ({ kind: "existing", condition });
const pr = (...ids: string[]): GuidanceCondition => ({ kind: "resonance", ids });
const behavior = (key: string): GuidanceCondition => ({ kind: "behavior", key });
const all = (...conditions: GuidanceCondition[]): GuidanceCondition => ({ kind: "all", conditions });
const any = (...conditions: GuidanceCondition[]): GuidanceCondition => ({ kind: "any", conditions });
const axis = (...args: Parameters<typeof a>) => e(a(...args));
const fact = (prefix: string, level: 2 | 3 = 2) => e(claim(prefix, level));
const delay = e(existing({ kind: "delay" }));
const d = (index: number, text: string, required: GuidanceCondition, strategies: GuidanceStrategyId[], contexts: InterpretationContext[] = ["identity", "work", "learning"], forbidden?: GuidanceCondition): GuidanceProblemDefinition => ({
  id: `G${String(index).padStart(2, "0")}`, problem: GUIDANCE_PROBLEMS[index - 1], humanProblemDescription: text, required, candidateStrategies: strategies, contexts, ...(forbidden ? { forbidden } : {}),
});
const relational: InterpretationContext[] = ["social", "love", "work", "identity"];
const recovery: InterpretationContext[] = ["recovery", "stress", "identity", "work"];
const money: InterpretationContext[] = ["money", "identity", "work"];

/** Forty separate problems. Explicit missing behavior sources stay suppressed;
 * no opposite-of-a-strength inference, no job/status field in any activation. */
export const GUIDANCE_PROBLEM_REGISTRY: readonly GuidanceProblemDefinition[] = [
  d(1, "잘하고 싶은 마음 때문에 완성도를 너무 신경 쓰다 시작하거나 끝내는 시점이 늦어질 수 있습니다.", { kind: "delayQualifiedClaim" }, ["DEFINE_DONE", "LIMIT_REVISION", "PRIORITIZE_CRITICAL_ERRORS", "ITERATE_WHEN_SAFE", "SELECTIVE_FEEDBACK", "TIMEBOX_THINKING"]),
  d(2, "충분히 생각해야 마음이 놓이지만, 생각이 너무 길어지면 움직일 시간이 줄어들 수 있습니다.", any(fact("F05"), all(pr("PR004", "PR007"), delay)), ["TIMEBOX_THINKING", "STOP_RULE", "DECISION_EXECUTION_SPLIT", "ITERATE_WHEN_SAFE"]),
  d(3, "가능성을 많이 보는 장점 때문에 하나를 고르는 순간이 늦어질 수 있습니다.", pr("PR005"), ["STOP_RULE", "PRIORITIZE_BY_IMPACT", "REMOVE_BEFORE_ADD"]),
  d(4, "한번 마음에 걸린 일은 끝난 뒤에도 머릿속에서 다시 돌려볼 때가 있습니다.", any(pr("PR080"), all(e(risk("RUMINATION")), axis("DEPTH"))), ["SEPARATE_FACT_INTERPRETATION", "STOP_RULE", "COMMUNICATE_STATE", "EXTERNALIZE_MEMORY"], relational),
  d(5, "알아볼수록 새로운 정보가 계속 보여 오히려 결정을 내리기 어려워질 수 있습니다.", all(axis("CURIOSITY"), any(axis("PATTERN_SENSE"), axis("DEPTH")), any(delay, pr("PR005"))), ["STOP_RULE", "TIMEBOX_THINKING", "PRIORITIZE_BY_IMPACT"]),
  d(6, "답을 빨리 정하는 편이라 다른 가능성을 보기 전에 움직일 때가 있습니다.", fact("F06"), ["ONE_OPPOSING_VIEW", "DECISION_EXECUTION_SPLIT", "PRIORITIZE_CRITICAL_ERRORS"]),
  d(7, "시작할 때는 힘이 잘 붙지만 재미가 떨어진 뒤 마무리까지 끌고 가는 건 별개의 문제일 수 있습니다.", pr("PR014"), ["DEFINE_DONE", "STOP_RULE", "EXTERNALIZE_MEMORY"]),
  d(8, "하고 싶은 일이 생길 때마다 시작해서 벌여놓은 일이 많아질 수 있습니다.", any(pr("PR020"), all(axis("INITIATIVE"), any(fact("F08"), fact("M10")))), ["REMOVE_BEFORE_ADD", "CAP_COMMITMENTS", "PRIORITIZE_BY_IMPACT"]),
  d(9, "움직이는 속도가 너무 빠르면 확인해야 할 것을 뒤늦게 볼 수 있습니다.", all(axis("ACTION_TEMPO", "STRONG"), axis("RISK_STYLE"), behavior("IMPULSIVE_ACTION")), ["ONE_OPPOSING_VIEW", "PRIORITIZE_CRITICAL_ERRORS", "DECISION_EXECUTION_SPLIT"]),
  d(10, "새로운 일에는 힘이 잘 붙지만 반복되는 관리가 뒤로 밀릴 수 있습니다.", behavior("ROUTINE_DROP"), ["EXTERNALIZE_MEMORY", "PRIORITIZE_BY_IMPACT", "DEFINE_DONE"]),
  d(11, "익숙해지면 실제로 문제가 없는데도 새로운 것을 찾고 싶어질 수 있습니다.", all(axis("CHANGE_ORIENTATION", "STRONG"), any(fact("F08"), behavior("CHANGE_CHASING"))), ["SMALL_EXPERIMENT", "STOP_RULE", "PRIORITIZE_BY_IMPACT"]),
  d(12, "잘 굴러가던 방식을 바꿔야 할 때도 오래 붙잡을 수 있습니다.", all(axis("STABILITY", "STRONG"), axis("CHANGE_ORIENTATION", "MAIN", -1), behavior("CHANGE_RESISTANCE")), ["SMALL_EXPERIMENT", "ONE_OPPOSING_VIEW", "PRIORITIZE_BY_IMPACT"]),
  d(13, "내가 할 수 있다는 이유로 필요 이상으로 일을 떠맡을 때가 있습니다.", pr("PR026"), ["DEFINE_RESPONSIBILITY", "SET_BOUNDARY", "DELEGATE_BY_OUTCOME", "CAP_COMMITMENTS"], ["work", "identity", "stress"]),
  d(14, "내가 하는 게 더 빠르다고 생각하면 다른 사람에게 맡기기 어려울 수 있습니다.", any(all(pr("PR026"), axis("LEADERSHIP")), e(risk("OVERCONTROL"))), ["DELEGATE_BY_OUTCOME", "DEFINE_RESPONSIBILITY", "PERSON_VS_PROBLEM"], ["work", "identity"]),
  d(15, "결과만 확인하면 되는 일도 과정까지 자기 방식대로 맞추고 싶어질 수 있습니다.", all(any(axis("LEADERSHIP", "STRONG"), axis("STRUCTURE_STYLE", "STRONG"), axis("BOUNDARY", "STRONG")), behavior("PROCESS_CONTROL")), ["DELEGATE_BY_OUTCOME", "DEFINE_RESPONSIBILITY", "PRIORITIZE_BY_IMPACT"], ["work", "identity", "stress"]),
  d(16, "일이 끝나도 머리는 다음 할 일을 계속 생각할 수 있습니다.", any(fact("F04"), pr("PR074")), ["EXTERNALIZE_MEMORY", "RECOVERY_BLOCK", "STOP_RULE"], recovery),
  d(17, "본인에게 당연한 기준을 다른 사람에게도 같은 속도로 요구할 수 있습니다.", all(axis("PRECISION", "STRONG"), any(axis("DUTY"), axis("LEADERSHIP")), behavior("OTHERS_STANDARD")), ["PERSON_VS_PROBLEM", "DELEGATE_BY_OUTCOME", "PRIORITIZE_CRITICAL_ERRORS"], relational),
  d(18, "급할수록 본인은 더 빨라져 주변 사람에게는 압박으로 느껴질 수 있습니다.", all(axis("ACTION_TEMPO", "STRONG"), any(axis("LEADERSHIP"), axis("COMMUNICATION_STYLE")), behavior("URGENCY_PRESSURE")), ["PERSON_VS_PROBLEM", "PRIORITIZE_BY_IMPACT", "COMMUNICATE_STATE"], relational),
  d(19, "틀린 부분이 빨리 보이는 만큼 말도 바로 나갈 수 있습니다.", any(fact("F02"), pr("PR054"), all(e(fusion("C060")), axis("PRECISION"), axis("COMMUNICATION_STYLE"))), ["PERSON_VS_PROBLEM", "PRIORITIZE_BY_IMPACT"], relational),
  d(20, "불편한 말을 바로 하지 않고 쌓아두었다가 나중에 한꺼번에 말할 수 있습니다.", all(axis("COMMUNICATION_STYLE", "MAIN", -1), behavior("CONFLICT_AVOIDANCE")), ["COMMUNICATE_STATE", "SET_BOUNDARY", "PERSON_VS_PROBLEM"], relational),
  d(21, "상대가 알아주길 바라면서도 정작 원하는 것은 바로 말하지 않을 때가 있습니다.", pr("PR067"), ["COMMUNICATE_STATE", "SEPARATE_FACT_INTERPRETATION", "DEFINE_RESPONSIBILITY"], relational),
  d(22, "정확하게 이해시키고 싶은 마음이 커서 설명이 너무 길어질 때가 있습니다.", pr("PR060"), ["PRIORITIZE_BY_IMPACT", "DEFINE_DONE"], relational),
  d(23, "사람 기분을 잘 알아차리는 만큼 거절을 늦게 할 수 있습니다.", all(any(axis("CARE", "STRONG"), axis("SOCIAL_ATTUNEMENT", "STRONG")), behavior("PEOPLE_PLEASING")), ["SET_BOUNDARY", "DEFINE_RESPONSIBILITY", "COMMUNICATE_STATE"], relational),
  d(24, "도와주다 보면 어디까지가 내 몫인지 흐려질 수 있습니다.", all(any(fact("F07"), pr("PR056")), any(e(limited("BOUNDARY")), behavior("PEOPLE_PLEASING"))), ["DEFINE_RESPONSIBILITY", "SET_BOUNDARY"], relational, any(e(fusion("C053")), axis("BOUNDARY", "STRONG"))),
  d(25, "사람들 앞에서는 괜찮아 보여도 끝난 뒤 한꺼번에 피곤해질 수 있습니다.", pr("PR058", "PR073", "PR076"), ["RECOVERY_BLOCK", "CAP_COMMITMENTS"], recovery),
  d(26, "말 한마디나 표정 하나를 필요 이상으로 오래 생각할 수 있습니다.", pr("PR068"), ["SEPARATE_FACT_INTERPRETATION", "COMMUNICATE_STATE", "STOP_RULE"], relational),
  d(27, "힘들수록 혼자 정리하려고 해서 가까운 사람은 이유를 모를 수 있습니다.", all(axis("ENERGY_DIRECTION", "MAIN", -1), any(axis("RECOVERY_NEED"), axis("DEPTH")), behavior("WITHDRAWAL")), ["COMMUNICATE_STATE", "RECOVERY_BLOCK"], ["identity", "social", "love", "recovery", "stress"]),
  d(28, "상대의 문제까지 자기 문제처럼 들고 갈 수 있습니다.", all(axis("CARE", "STRONG"), any(axis("DUTY"), axis("SOCIAL_ATTUNEMENT")), fact("F07", 3)), ["DEFINE_RESPONSIBILITY", "SET_BOUNDARY"], relational),
  d(29, "돈이 될 기회가 여러 개 보여 하나에 충분히 집중하지 못할 수 있습니다.", any(fact("M10"), fact("F08")), ["REMOVE_BEFORE_ADD", "PRIORITIZE_BY_IMPACT", "STOP_RULE"], money),
  d(30, "돈을 지키는 데 집중하다 필요한 경험까지 줄일 수 있습니다.", all(any(axis("RESOURCE_SENSE", "STRONG"), axis("STABILITY", "STRONG")), axis("RISK_STYLE", "MAIN", -1), behavior("RESTRICTIVE_SAVING")), ["BUDGET_BUCKETS", "VALUE_AND_PRICE_SEPARATE"], money),
  d(31, "기분이 올라오거나 좋은 기회처럼 보일 때 지출도 함께 빨라질 수 있습니다.", all(behavior("IMPULSE_SPENDING"), any(axis("RISK_STYLE"), axis("ACTION_TEMPO"))), ["SPEND_DELAY", "BUDGET_BUCKETS", "SEPARATE_FACT_INTERPRETATION"], money),
  d(32, "돈과 결과를 너무 앞세우면 잘해도 일이 공허하게 느껴질 수 있습니다.", all(axis("RESOURCE_SENSE", "STRONG"), axis("MEANING"), behavior("MONEY_OVER_MEANING")), ["VALUE_AND_PRICE_SEPARATE", "PRIORITIZE_BY_IMPACT"], money),
  d(33, "좋아하고 의미 있는 일이라는 이유로 내 시간과 돈의 가치를 너무 낮게 잡을 수 있습니다.", any(pr("PR045"), all(axis("MEANING", "STRONG"), behavior("UNDERPRICING"))), ["VALUE_AND_PRICE_SEPARATE", "BUDGET_BUCKETS"], money),
  d(34, "남에게 어떻게 보이는지가 중요한 시기에는 필요 이상으로 돈을 쓸 수 있습니다.", all(axis("STATUS_DRIVE", "STRONG"), behavior("STATUS_SPENDING")), ["SEPARATE_FACT_INTERPRETATION", "SPEND_DELAY", "BUDGET_BUCKETS"], money),
  d(35, "쉬고 있으면 해야 할 일을 안 하고 있다는 느낌이 들 수 있습니다.", pr("PR082"), ["RECOVERY_BLOCK", "EXTERNALIZE_MEMORY", "CAP_COMMITMENTS"], recovery),
  d(36, "몸은 쉬고 있어도 머리는 일을 계속할 수 있습니다.", pr("PR074", "PR079"), ["EXTERNALIZE_MEMORY", "STOP_RULE", "RECOVERY_BLOCK"], recovery),
  d(37, "할 수 있을 것 같아서 일과 약속을 너무 빽빽하게 잡을 수 있습니다.", pr("PR083"), ["CAP_COMMITMENTS", "RECOVERY_BLOCK", "PRIORITIZE_BY_IMPACT"], recovery),
  d(38, "혼자 정리하는 시간이 길어지면 오히려 같은 생각 안에 더 오래 머물 수 있습니다.", pr("PR080"), ["COMMUNICATE_STATE", "SMALL_EXPERIMENT", "STOP_RULE"], recovery),
  d(39, "남들이 충분히 잘했다고 해도 본인은 부족한 점부터 먼저 볼 수 있습니다.", any(pr("PR003", "PR091"), fact("F03")), ["DEFINE_DONE", "PRIORITIZE_CRITICAL_ERRORS", "CELEBRATE_AND_REVIEW"]),
  d(40, "하나를 해내자마자 다음 목표를 잡아서 성취를 느낄 시간이 짧을 수 있습니다.", pr("PR028"), ["CELEBRATE_AND_REVIEW", "STOP_RULE", "RECOVERY_BLOCK"], ["identity", "work", "recovery"]),
];
