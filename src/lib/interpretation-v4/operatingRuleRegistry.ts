import type { SemanticAxis } from "./semanticCore";
import type { GuidanceStrategyId } from "./guidanceCore";
import type { OperatingSlot } from "./operatingRuleCore";
export const GUIDANCE_SHORT_TITLES:Record<GuidanceStrategyId,string>={
  DEFINE_DONE:"끝낼 기준부터 정하세요",TIMEBOX_THINKING:"생각할 시간에도 끝을 두세요",LIMIT_REVISION:"수정 횟수를 먼저 정하세요",ITERATE_WHEN_SAFE:"안전한 일은 작게 먼저 보여주세요",PRIORITIZE_CRITICAL_ERRORS:"중요한 오류부터 보세요",EXTERNALIZE_MEMORY:"머리 대신 기록에 맡기세요",SET_BOUNDARY:"도울 범위를 먼저 정하세요",DELEGATE_BY_OUTCOME:"결과 기준만 정하고 맡기세요",SEPARATE_FACT_INTERPRETATION:"사실과 해석을 나눠보세요",ONE_OPPOSING_VIEW:"반대 근거 하나는 확인하세요",STOP_RULE:"끝낼 조건부터 정하세요",RECOVERY_BLOCK:"회복 시간도 일정에 넣으세요",REMOVE_BEFORE_ADD:"하나를 더하려면 하나는 빼세요",VALUE_AND_PRICE_SEPARATE:"의미와 가격은 따로 보세요",PERSON_VS_PROBLEM:"사람 말고 문제를 정확히 보세요",DECISION_EXECUTION_SPLIT:"생각할 때와 움직일 때를 나누세요",PRIORITIZE_BY_IMPACT:"결과에 큰 것부터 처리하세요",SELECTIVE_FEEDBACK:"피드백 받을 사람을 고르세요",DEFINE_RESPONSIBILITY:"내 책임과 도움을 나누세요",CAP_COMMITMENTS:"한 번에 맡을 양을 정하세요",SPEND_DELAY:"큰돈은 한 번 더 보고 쓰세요",CELEBRATE_AND_REVIEW:"다음 목표 전에 이번 결과를 보세요",COMMUNICATE_STATE:"상태와 필요한 걸 짧게 말하세요",SMALL_EXPERIMENT:"작은 부분부터 바꿔보세요",BUDGET_BUCKETS:"지킬 돈과 쓸 돈을 나누세요",
};
type UseRule={axis:SemanticAxis;slot:OperatingSlot;title:string;text:string};
export const STRENGTH_USE_RULES:readonly UseRule[]=[
  {axis:"DEPTH",slot:"THINKING",title:"중요한 문제는 깊게 보세요",text:"중요한 문제를 만났을 때는 빨리 답을 정하기보다 이해되지 않는 부분을 다시 보고 확인하는 방식이 잘 맞습니다."},
  {axis:"PRECISION",slot:"WORK_MONEY",title:"정확함이 필요한 곳에 눈을 쓰세요",text:"작은 틀림이 결과를 바꾸는 일에서는 남들이 끝났다고 말한 뒤에도 놓친 부분을 다시 보고 확인하는 눈을 쓰는 편이 좋습니다."},
  {axis:"LEADERSHIP",slot:"EXECUTION",title:"결정할 순간에는 앞에 서세요",text:"여러 사람이 결정을 미룰 때는 먼저 해야 할 일을 생각하고 말하며, 함께 움직일 방향을 정하는 역할이 잘 맞습니다."},
  {axis:"ADAPTABILITY",slot:"EXECUTION",title:"막힐 때는 방법을 바꿔보세요",text:"방법이 막히면 처음 생각만 고집하기보다 지금 할 수 있는 것을 확인하고, 바꿀 부분부터 바꾸며 움직이는 편이 잘 맞습니다."},
  {axis:"CARE",slot:"RELATIONSHIP",title:"필요한 걸 알아보는 눈을 쓰세요",text:"사람을 챙길 때는 막연히 괜찮냐고 말하기보다 무엇이 필요한지 확인하고, 실제로 챙겨줄 수 있는 것을 보는 편이 잘 맞습니다."},
  {axis:"SOCIAL_ATTUNEMENT",slot:"RELATIONSHIP",title:"상대의 반응을 설명에 반영하세요",text:"설명할 때는 상대의 반응을 알아차리는 눈을 써보세요. 어디서 이해가 끊겼는지 보고 다시 말할 수 있습니다."},
  {axis:"GOAL_DRIVE",slot:"EXECUTION",title:"중요한 일은 끝을 정하세요",text:"목표가 분명할수록 잘 움직이는 편이니 중요한 일은 끝이 보이게 목표를 정하는 게 잘 맞습니다."},
  {axis:"RESOURCE_SENSE",slot:"WORK_MONEY",title:"들어온 돈과 남는 돈을 같이 보세요",text:"돈 문제에서는 들어오는 금액뿐 아니라 실제로 남는 돈과 시간을 같이 보는 방식이 잘 맞습니다."},
  {axis:"EXPRESSION",slot:"RELATIONSHIP",title:"생각을 말이나 결과로 보여주세요",text:"전하고 싶은 생각이 생기면 혼자만 가지고 있기보다 말이나 결과로 보여주는 방식을 써보세요."},
  {axis:"RECOVERY_NEED",slot:"RECOVERY",title:"혼자 정리할 시간을 남기세요",text:"바깥일을 마친 뒤에는 조용히 쉬고 생각을 정리할 시간을 남겨두는 편이 잘 맞습니다."},
];
