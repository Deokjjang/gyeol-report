import type { BridgeRule } from "./types";

export const BRIDGE_RULES = [
  {
    id: "DIRECTNESS_OVERLAP",
    direction: "OVERLAP",
    strength: "MEDIUM",
    confidence: "MEDIUM",
    requiredSajuTags: ["BRANCH_CLASH_PRESENT"],
    requiredMbtiTraits: ["DIRECT_DECISION", "CONFLICT_DIRECTNESS"],
    titleKo: "직선성과 충돌 민감성의 겹침",
    summaryKo:
      "지지충의 긴장 구조와 MBTI의 직선적 의사결정 성향이 겹쳐, 문제를 빠르게 지적하고 정면으로 다루는 흐름으로 나타날 수 있습니다.",
  },
  {
    id: "DIRECTNESS_TENSION",
    direction: "TENSION",
    strength: "MEDIUM",
    confidence: "MEDIUM",
    requiredSajuTags: ["BRANCH_CLASH_PRESENT"],
    requiredMbtiTraits: ["RELATION_HARMONY", "EMOTIONAL_ATTUNEMENT"],
    titleKo: "관계 조율 욕구와 내적 긴장의 차이",
    summaryKo:
      "관계 조화를 중시하는 자기인식과 지지충의 긴장 구조가 함께 있어, 겉으로는 맞추려 하지만 안쪽에서는 변화 압력을 크게 느낄 수 있습니다.",
  },
  {
    id: "STRUCTURE_OVERLAP",
    direction: "OVERLAP",
    strength: "MEDIUM",
    confidence: "MEDIUM",
    requiredSajuTags: ["OFFICER_PRESSURE_HIGH"],
    requiredMbtiTraits: ["JUDGING", "STRUCTURE_PREFERENCE"],
    titleKo: "구조와 기준을 중시하는 흐름",
    summaryKo:
      "관성 압박 후보와 판단형·구조 선호 성향이 겹쳐, 기준·책임·일정·체계를 중요하게 두는 흐름으로 볼 수 있습니다.",
  },
  {
    id: "STRUCTURE_TENSION",
    direction: "TENSION",
    strength: "MEDIUM",
    confidence: "MEDIUM",
    requiredSajuTags: ["OFFICER_PRESSURE_HIGH"],
    requiredMbtiTraits: ["PERCEIVING", "EXPLORATION_DRIVE"],
    titleKo: "규칙 압박과 탐색 욕구의 긴장",
    summaryKo:
      "관성의 기준·책임 흐름과 탐색형 자기인식이 함께 있어, 정해진 틀을 따르면서도 자유롭게 바꾸고 싶은 긴장이 생길 수 있습니다.",
  },
  {
    id: "RESOURCE_COMPENSATION",
    direction: "COMPENSATION",
    strength: "MEDIUM",
    confidence: "MEDIUM",
    requiredSajuTags: ["RESOURCE_SUPPORT_MISSING"],
    requiredMbtiTraits: ["INTERNAL_PROCESSING", "ABSTRACT_PATTERNING"],
    titleKo: "부족한 인성 흐름을 사고 정리로 보완",
    summaryKo:
      "인성 부족 후보가 있어도 내향적 처리와 추상 패턴화 성향이 함께 있으면, 스스로 사고를 정리하며 회복과 학습 방식을 만들 수 있습니다.",
  },
  {
    id: "OUTPUT_COMPENSATION",
    direction: "COMPENSATION",
    strength: "MEDIUM",
    confidence: "MEDIUM",
    requiredSajuTags: ["EXPRESSION_OUTPUT_MISSING"],
    requiredMbtiTraits: ["EXTRAVERSION", "SPONTANEOUS_ACTION"],
    titleKo: "부족한 식상 흐름을 행동성으로 보완",
    summaryKo:
      "식상 부족 후보가 있어도 외향성과 즉흥적 행동 성향이 함께 있으면, 표현과 실행을 실제 행동으로 끌어내는 보완 흐름이 생길 수 있습니다.",
  },
  {
    id: "OFFICER_PRESSURE_WITH_JUDGING",
    direction: "OVERLAP",
    strength: "HIGH",
    confidence: "MEDIUM",
    requiredSajuTags: ["OFFICER_PRESSURE_HIGH"],
    requiredMbtiTraits: ["JUDGING", "EFFICIENCY_ORIENTATION"],
    titleKo: "책임 압박과 효율 지향의 결합",
    summaryKo:
      "관성 압박 후보와 효율 지향이 함께 나타나면, 책임을 빠르게 구조화하고 성과 기준으로 정리하려는 흐름이 강해질 수 있습니다.",
  },
  {
    id: "WEALTH_REALITY_WITH_EFFICIENCY",
    direction: "OVERLAP",
    strength: "HIGH",
    confidence: "MEDIUM",
    requiredSajuTags: ["WEALTH_OVERLOAD"],
    requiredMbtiTraits: ["EFFICIENCY_ORIENTATION", "DIRECT_DECISION"],
    titleKo: "현실 책임과 효율 지향의 겹침",
    summaryKo:
      "재성 과다 후보와 효율·결정 성향이 겹치면, 현실 문제와 책임을 빠르게 판단하고 성과 중심으로 처리하려는 흐름으로 나타날 수 있습니다.",
  },
  {
    id: "RELATION_HARMONY_WITH_BRANCH_COMBINATION",
    direction: "OVERLAP",
    strength: "LOW",
    confidence: "MEDIUM",
    requiredSajuTags: ["BRANCH_COMBINATION_PRESENT"],
    requiredMbtiTraits: ["RELATION_HARMONY", "EMOTIONAL_ATTUNEMENT"],
    titleKo: "관계 조율과 지지합 흐름",
    summaryKo:
      "지지합의 연결 구조와 관계 조율 성향이 겹치면, 사람과 환경 사이의 흐름을 부드럽게 맞추려는 방식으로 나타날 수 있습니다.",
  },
  {
    id: "CONFLICT_DIRECTNESS_WITH_BRANCH_CLASH",
    direction: "OVERLAP",
    strength: "HIGH",
    confidence: "MEDIUM",
    requiredSajuTags: ["BRANCH_CLASH_PRESENT"],
    requiredMbtiTraits: ["CONFLICT_DIRECTNESS", "DIRECT_DECISION"],
    titleKo: "갈등을 정면으로 다루는 구조",
    summaryKo:
      "지지충의 긴장 구조와 갈등을 직접 다루는 성향이 겹치면, 불편한 문제를 피하기보다 바로 확인하려는 흐름으로 나타날 수 있습니다.",
  },
  {
    id: "INTERNAL_PROCESSING_WITH_RESOURCE",
    direction: "OVERLAP",
    strength: "LOW",
    confidence: "MEDIUM",
    requiredSajuTags: ["RESOURCE_OVERLOAD"],
    requiredMbtiTraits: ["INTERNAL_PROCESSING", "INTROVERSION"],
    titleKo: "내적 처리와 인성 흐름의 겹침",
    summaryKo:
      "인성 과다 후보와 내향적 처리 성향이 겹치면, 바깥으로 바로 드러내기보다 안에서 해석하고 정리하는 흐름이 강해질 수 있습니다.",
  },
  {
    id: "EXPLORATION_WITH_OUTPUT",
    direction: "OVERLAP",
    strength: "LOW",
    confidence: "MEDIUM",
    requiredSajuTags: ["FOOD_WEALTH_FLOW"],
    requiredMbtiTraits: ["EXPLORATION_DRIVE", "SPONTANEOUS_ACTION"],
    titleKo: "탐색성과 생산 흐름의 연결",
    summaryKo:
      "식상생재 흐름 후보와 탐색·행동 성향이 함께 있으면, 아이디어를 시도하고 현실 결과로 연결하려는 흐름으로 나타날 수 있습니다.",
  },
] as const satisfies readonly BridgeRule[];
