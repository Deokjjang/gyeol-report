import type { BipolarAxis, StrengthAxis, SemanticAxis } from "./semanticCore";
export const FUSION_BIPOLAR_MEANINGS = {
  "ACTION_TEMPO": {
    "positive": "결론이 나면 빠르게 움직이는 쪽",
    "negative": "충분히 보고 생각한 뒤 움직이는 쪽"
  },
  "ENERGY_DIRECTION": {
    "positive": "생각과 에너지를 밖으로 표현하는 쪽",
    "negative": "생각과 에너지를 안에서 정리하는 쪽"
  },
  "STRUCTURE_STYLE": {
    "positive": "기준과 계획을 정해놓고 움직이는 쪽",
    "negative": "상황을 보며 방법을 바꾸는 쪽"
  },
  "COMMUNICATION_STYLE": {
    "positive": "핵심을 비교적 바로 말하는 쪽",
    "negative": "상대와 상황을 보며 부드럽게 말하는 쪽"
  },
  "CHANGE_ORIENTATION": {
    "positive": "새로운 변화와 경험을 찾는 쪽",
    "negative": "익숙하고 안정적인 방식을 지키는 쪽"
  },
  "DECISION_STYLE": {
    "positive": "답을 정하고 결론을 내리려는 쪽",
    "negative": "가능성을 조금 더 열어두는 쪽"
  },
  "RELATION_STYLE": {
    "positive": "사람과 연결되고 함께 움직이는 쪽",
    "negative": "자기 공간과 독립성을 지키는 쪽"
  },
  "RISK_STYLE": {
    "positive": "기회를 보면 어느 정도 위험도 감수하는 쪽",
    "negative": "손해와 위험을 먼저 확인하는 쪽"
  }
} as const satisfies Record<BipolarAxis, { positive: string; negative: string }>;
export const FUSION_STRENGTH_MEANINGS = {
  "INITIATIVE": "남이 시작해주길 기다리기보다 먼저 움직이는 성향",
  "GOAL_DRIVE": "목표가 생기면 끝까지 가고 싶어 하는 성향",
  "EXPANSION": "지금보다 더 키우고 넓히고 싶어 하는 성향",
  "PERSISTENCE": "한번 시작한 것을 오래 붙드는 성향",
  "ADAPTABILITY": "막히면 다른 방법을 찾아 바꾸는 성향",
  "DEPTH": "겉만 보고 넘기지 않고 깊게 생각하는 성향",
  "CURIOSITY": "왜 그런지 궁금해하고 계속 알아보는 성향",
  "PATTERN_SENSE": "서로 떨어진 정보에서 연결과 반복을 보는 성향",
  "PRECISION": "작은 오류와 부족한 점을 먼저 보는 성향",
  "LEARNING": "배우고 자기 것으로 쌓으려는 성향",
  "STRATEGY": "지금뿐 아니라 다음 수까지 생각하는 성향",
  "CREATION": "생각을 실제 결과물로 만들고 싶어 하는 성향",
  "EXPRESSION": "생각과 감정을 밖으로 보여주려는 성향",
  "SOCIAL_ATTUNEMENT": "사람의 표정과 반응을 빨리 알아차리는 성향",
  "CARE": "사람을 챙기고 도우려는 성향",
  "CHARISMA": "사람 눈에 들어오고 기억되는 존재감",
  "DUTY": "맡은 일과 약속을 책임지려는 성향",
  "LEADERSHIP": "방향을 정하고 사람을 이끄려는 성향",
  "AUTONOMY": "중요한 것은 직접 고르고 결정하고 싶은 성향",
  "COMPETITION": "경쟁과 비교에서 자극을 받는 성향",
  "BOUNDARY": "내 기준과 선을 분명히 지키는 성향",
  "PRACTICALITY": "실제로 되는지와 결과가 남는지를 보는 성향",
  "RESOURCE_SENSE": "돈과 시간, 자원이 실제로 얼마나 남는지 보는 성향",
  "OPPORTUNITY_SENSE": "새로운 사람과 상황에서 기회를 알아보는 성향",
  "STABILITY": "오래 유지되고 안정적인 상태를 중요하게 보는 성향",
  "STATUS_DRIVE": "인정, 명예, 높은 직책을 중요하게 보는 성향",
  "MEANING": "돈이나 결과뿐 아니라 왜 하는지도 중요하게 보는 성향",
  "RECOVERY_NEED": "혼자 쉬고 생각을 정리할 시간이 필요한 정도"
} as const satisfies Record<StrengthAxis, string>;
export function fusionAxisMeaning(axis: SemanticAxis, direction: number): string {
  return axis in FUSION_BIPOLAR_MEANINGS
    ? FUSION_BIPOLAR_MEANINGS[axis as BipolarAxis][direction > 0 ? "positive" : "negative"]
    : FUSION_STRENGTH_MEANINGS[axis as StrengthAxis];
}
