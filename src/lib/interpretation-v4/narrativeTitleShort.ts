import type { EditorialCandidate } from "./comprehensivePlanCore";
import { GUIDANCE_SHORT_TITLES } from "./operatingRuleRegistry";
import type { GuidanceStrategyId } from "./guidanceCore";
export const SEMANTIC_SHORT_TITLES:Record<string,readonly string[]>={
  DEEP_UNDERSTANDING:["겉보다 안쪽을 깊게 봅니다","왜 그런지가 궁금한 사람"],
  PRECISION_AND_STANDARDS:["작은 차이를 그냥 넘기지 않습니다","내 기준이 분명한 사람"],
  ACTION_AND_INITIATIVE:["생각과 행동 사이의 속도","시작할 때 드러나는 모습"],
  GROWTH_AND_EXPANSION:["지금보다 더 커지고 싶은 마음","해낸 뒤에도 다음을 봅니다"],
  STABILITY_AND_MAINTENANCE:["한번 시작한 것을 오래 지킵니다","지키고 싶은 생활의 기본"],
  EXPRESSION_AND_VISIBILITY:["밖에서 보이는 나와 안쪽의 나","사람 앞에서 드러나는 모습"],
  LEADERSHIP_AND_RESPONSIBILITY:["책임이 생길 때 보이는 모습","함께 움직일 때 잡는 방향"],
  AUTONOMY_AND_SELF_DIRECTION:["중요한 결정은 직접 하고 싶습니다","내가 정하고 싶은 삶의 방향"],
  MONEY_AND_REALITY:["돈과 시간이 실제로 남아야 합니다","좋은 생각도 현실에서 봅니다"],
  LEARNING_AND_EXPERTISE:["배운 것을 자기 실력으로 남깁니다","궁금한 곳에서 시작하는 실력"],
  SOCIAL_ATTUNEMENT_AND_CARE:["사람의 반응을 그냥 지나치지 않습니다","가까운 사람에게 마음을 쓰는 방식"],
  CHANGE_AND_ADAPTATION:["새로움과 안정 사이에서","막혔을 때 다른 길을 찾습니다"],
  RECOVERY_AND_INNER_PROCESS:["밖에서 쓴 에너지를 정리하는 시간","혼자 있을 때 필요한 리듬"],
  STATUS_AND_RECOGNITION:["잘한 만큼 인정도 중요합니다","해낸 일을 알아주길 바라는 마음"],
  CREATION_AND_OUTPUT:["생각을 결과로 보여주는 사람","만들고 전할 때 드러나는 모습"],
  OPPORTUNITY_AND_MOVEMENT:["새로운 만남에서 보이는 가능성","기회를 알아보는 나만의 눈"],
};
export function shortTitleChoices(c:EditorialCandidate):string[]{
  if(c.sourceType==="GUIDANCE")return c.strategyIds?.flatMap(s=>GUIDANCE_SHORT_TITLES[s as GuidanceStrategyId]?[GUIDANCE_SHORT_TITLES[s as GuidanceStrategyId]]:[])??[];
  if(c.conditionSplit?.resolved){const titles:Record<string,string>={BEFORE_AFTER_DECISION:"결정하기 전과 후의 속도가 다릅니다",OUTER_INNER:"밖에서 쓰고 혼자 정리하는 에너지",IDEA_EXECUTION:"생각은 열고 실행은 정하고 싶습니다",START_MAINTAIN:"시작과 유지에 쓰는 속도가 다릅니다",STRANGER_CLOSE:"가까워질수록 달라지는 반응",WORK_PRIVATE:"일할 때와 가까운 사이에서의 나",NORMAL_STRESS:"평소와 급할 때 달라지는 모습",SHORT_LONG_TERM:"당장 할 일과 오래 지킬 일",HEAD_HEART:"맞는 선택과 마음이 가는 선택",DESIRE_BEHAVIOR:"마음이 원하는 것과 실제 행동"};if(c.conditionSplit.type)return[titles[c.conditionSplit.type]];}
  if(c.fortune)return c.sourceText.length<=40?[c.sourceText.replace(/[.]$/,"")]:[];
  return [...(SEMANTIC_SHORT_TITLES[c.broadTheme]??[])];
}
