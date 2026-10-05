import type { TenGod } from "../saju/types";
import type { NatalSemanticDefinition } from "./foundationPillars";

export const TEN_GOD_FAMILIES = ["PEER", "OUTPUT", "WEALTH", "OFFICER", "RESOURCE"] as const;
export type TenGodFamily = typeof TEN_GOD_FAMILIES[number];
export const TEN_GOD_SEMANTICS = {
  比肩: {
    label: "비견", family: "PEER",
    easyMeaning: "남이 정한 답보다 자기 힘과 판단을 믿으려는 성질",
    humanDescription: "남이 정해주기보다 직접 판단하고 자기 방식대로 해보고 싶은 마음이 강합니다.",
    positiveMeaning: "혼자서도 버티고 자기 기준을 지키는 데 강점이 있습니다.",
    shadowMeaning: "도움을 받을 수 있는데도 혼자 하려고 할 수 있습니다.",
    axes: { AUTONOMY: 2, PERSISTENCE: 1, BOUNDARY: 1, COMPETITION: 1 }, contexts: ["identity", "work", "social"],
  },
  劫財: {
    label: "겁재", family: "PEER",
    easyMeaning: "사람과 부딪치거나 경쟁하면서 더 크게 움직이려는 성질",
    humanDescription: "혼자 할 때보다 경쟁자나 함께 움직일 사람이 있을 때 더 자극받을 수 있습니다.",
    positiveMeaning: "경쟁과 협력 속에서 추진력을 끌어올리는 데 강점이 있습니다.",
    shadowMeaning: "경쟁이 강해지면 내 몫과 남의 몫을 지나치게 의식할 수 있습니다.",
    axes: { COMPETITION: 2, EXPANSION: 1, INITIATIVE: 1 }, contexts: ["identity", "work", "social"],
  },
  食神: {
    label: "식신", family: "OUTPUT",
    easyMeaning: "내가 가진 것을 자연스럽게 결과물로 꺼내는 성질",
    humanDescription: "생각만 하고 끝내기보다 직접 만들고 보여줘야 만족하는 편입니다.",
    positiveMeaning: "말, 글, 제품, 서비스처럼 눈에 보이는 결과를 만드는 데 강점이 있습니다.",
    shadowMeaning: "편하고 익숙한 방식에 머무르면 도전이 줄어들 수 있습니다.",
    axes: { CREATION: 2, EXPRESSION: 2, CARE: 1 }, contexts: ["identity", "work", "learning", "love"],
  },
  傷官: {
    label: "상관", family: "OUTPUT",
    easyMeaning: "기존 답의 문제를 보고 다른 답을 꺼내는 성질",
    humanDescription: "남들이 당연하다고 하는 방식에도 왜 그래야 하는지 한번 더 묻는 편입니다.",
    positiveMeaning: "문제를 찾고 더 나은 방법을 만드는 데 강점이 있습니다.",
    shadowMeaning: "답답한 규칙이나 설명이 부족한 지시에는 반발이 커질 수 있습니다.",
    axes: { CHANGE_ORIENTATION: 1, EXPRESSION: 2, CURIOSITY: 1, PRECISION: 1, AUTONOMY: 1 }, contexts: ["identity", "work", "social"],
  },
  正財: {
    label: "정재", family: "WEALTH",
    easyMeaning: "꾸준히 들어오고 실제로 남는 돈과 생활을 중요하게 보는 성질",
    humanDescription: "한 번 큰돈보다 꾸준히 들어오고 실제로 남는 돈을 중요하게 보는 편입니다.",
    positiveMeaning: "돈과 생활을 현실적으로 관리하고 쌓는 데 강점이 있습니다.",
    shadowMeaning: "안정을 너무 중요하게 보면 좋은 기회에도 지나치게 조심할 수 있습니다.",
    axes: { RESOURCE_SENSE: 2, PRACTICALITY: 2, STABILITY: 2, DUTY: 1 }, contexts: ["identity", "work", "money"],
  },
  偏財: {
    label: "편재", family: "WEALTH",
    easyMeaning: "바깥의 사람과 기회에서 돈과 자원을 찾는 성질",
    humanDescription: "익숙한 한곳보다 새로운 사람이나 기회에서 돈의 가능성을 찾는 편입니다.",
    positiveMeaning: "거래, 기회, 새로운 시장을 보는 데 강점이 있습니다.",
    shadowMeaning: "기회가 많이 보이면 한 가지를 오래 붙잡기 어려울 수 있습니다.",
    axes: { OPPORTUNITY_SENSE: 2, RESOURCE_SENSE: 2, EXPANSION: 1, ADAPTABILITY: 1 }, contexts: ["identity", "work", "money", "social"],
  },
  正官: {
    label: "정관", family: "OFFICER",
    easyMeaning: "기준과 책임을 지키며 신뢰와 인정을 쌓으려는 성질",
    humanDescription: "약속과 책임을 지키고 제대로 인정받는 것을 중요하게 생각합니다.",
    positiveMeaning: "신뢰를 쌓고 책임 있는 일을 꾸준히 해내는 데 강점이 있습니다.",
    shadowMeaning: "해야 한다는 기준이 너무 강하면 스스로를 압박할 수 있습니다.",
    axes: { STRUCTURE_STYLE: 2, DUTY: 2, STATUS_DRIVE: 2, BOUNDARY: 1 }, contexts: ["identity", "work", "social", "stress"],
  },
  偏官: {
    label: "편관", family: "OFFICER",
    easyMeaning: "압박이 있을 때 책임지고 결정을 내려야 하는 성질",
    humanDescription: "상황이 어려워지면 피하기보다 직접 판단하고 책임지려는 면이 있습니다.",
    positiveMeaning: "압박이 큰 상황에서 결정을 내리고 앞에 서는 데 강점이 있습니다.",
    shadowMeaning: "책임을 지나치게 많이 떠안거나 자신과 남을 몰아붙일 수 있습니다.",
    axes: { DECISION_STYLE: 1, DUTY: 2, LEADERSHIP: 2, GOAL_DRIVE: 1 }, contexts: ["identity", "work", "stress"],
  },
  正印: {
    label: "정인", family: "RESOURCE",
    easyMeaning: "차근차근 배우고 받아들여 자기 것으로 쌓는 성질",
    humanDescription: "충분히 배우고 이해한 뒤 움직여야 마음이 놓이는 편입니다.",
    positiveMeaning: "배운 것을 안정적으로 쌓고 사람을 이해하는 데 강점이 있습니다.",
    shadowMeaning: "준비가 충분해야 한다는 생각 때문에 행동이 늦어질 수 있습니다.",
    axes: { LEARNING: 2, CARE: 2, STABILITY: 1, MEANING: 1 }, contexts: ["identity", "learning", "social", "recovery"],
  },
  偏印: {
    label: "편인", family: "RESOURCE",
    easyMeaning: "남들이 지나친 이유나 다른 관점을 깊게 파고드는 성질",
    humanDescription: "대충 이해하고 넘어가기보다 왜 그런지 자기 방식으로 끝까지 확인하려는 편입니다.",
    positiveMeaning: "남들이 놓친 연결과 이유를 깊게 파는 데 강점이 있습니다.",
    shadowMeaning: "생각이 길어지면 시작이나 결정이 늦어질 수 있습니다.",
    axes: { DEPTH: 2, CURIOSITY: 2, PATTERN_SENSE: 2, AUTONOMY: 1 }, contexts: ["identity", "learning", "work", "recovery"],
  },
} as const satisfies Record<TenGod, NatalSemanticDefinition & { label: string; family: TenGodFamily }>;

export const TEN_GOD_FAMILY_SEMANTICS = {
  PEER: {
    members: ["比肩", "劫財"], humanDescription: "남이 정해주는 것보다 직접 판단하고 움직이고 싶은 마음이 강합니다.",
    positiveMeaning: "독립성과 자기주도성이 강점이 될 수 있습니다.", shadowMeaning: "자기 방식에 대한 고집이 세질 수 있습니다.",
  },
  OUTPUT: {
    members: ["食神", "傷官"], humanDescription: "생각을 안에만 두기보다 말이나 결과물로 꺼내고 싶어 합니다.",
    positiveMeaning: "아이디어를 실제 결과로 만드는 데 강점이 있습니다.", shadowMeaning: "정해진 방식보다 자기 방법을 먼저 쓰고 싶어질 수 있습니다.",
  },
  WEALTH: {
    members: ["正財", "偏財"], humanDescription: "현실적으로 무엇이 남는지, 돈과 시간이 실제로 어떻게 쓰이는지를 중요하게 봅니다.",
    positiveMeaning: "돈과 현실 결과를 관리하는 데 관심이 큽니다.", shadowMeaning: "현실적인 결과를 너무 앞세우면 다른 가치가 뒤로 밀릴 수 있습니다.",
  },
  OFFICER: {
    members: ["正官", "偏官"], humanDescription: "책임과 기준, 인정, 높은 직책에 대한 관심이 강하게 나타날 수 있습니다.",
    positiveMeaning: "책임을 맡고 신뢰를 쌓는 데 강점을 보일 수 있습니다.", shadowMeaning: "해야 한다는 압박을 너무 크게 느낄 수 있습니다.",
  },
  RESOURCE: {
    members: ["正印", "偏印"], humanDescription: "이해하고 배우고 충분히 준비해야 마음이 놓이는 편입니다.",
    positiveMeaning: "배우고 깊게 이해해 전문성을 만드는 데 강점이 있습니다.", shadowMeaning: "준비와 생각이 길어지면 행동이 늦어질 수 있습니다.",
  },
} as const satisfies Record<TenGodFamily, {
  members: readonly TenGod[]; humanDescription: string; positiveMeaning: string; shadowMeaning: string;
}>;

/** Explicit producer states, never inferred from occurrence counts. SUPPORT means
 * a verified helpful support state, not a small quantity or the evidence tier. */
export type VerifiedIntensity = {
  state: "HIGH" | "MEANINGFUL" | "SUPPORT" | "WEAK" | "UNCERTAIN";
  evidenceIds: readonly string[];
  provenance: readonly string[];
};
export type NormalizedTenGodStates = {
  families: Partial<Record<TenGodFamily, VerifiedIntensity>>;
  gods: Partial<Record<TenGod, VerifiedIntensity>>;
  dayMaster?: {
    state: "STRONG" | "BALANCED" | "WEAK";
    evidenceIds: readonly string[];
    provenance: readonly string[];
  };
};
