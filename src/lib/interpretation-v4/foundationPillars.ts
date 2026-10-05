import type { EarthlyBranch, HeavenlyStem } from "../saju/types";
import type { PillarKey } from "../saju/birthTimePrecisionTypes";
import type { InterpretationContext, SemanticSignature } from "./semanticCore";

export const NATAL_FOUNDATION_VERSION = "semantic-natal-13d-1b-v1" as const;
export type NatalSemanticDefinition = {
  easyMeaning: string;
  humanDescription: string;
  positiveMeaning: string;
  shadowMeaning: string;
  axes: SemanticSignature;
  contexts: readonly InterpretationContext[];
  family: string;
};

export const HEAVENLY_STEM_SEMANTICS = {
  甲: {
    image: "하늘로 곧게 자라는 큰 나무", family: "STEM_WOOD_YANG",
    easyMeaning: "방향을 잡으면 앞으로 자라고 커지려는 성질",
    humanDescription: "목표가 생기면 그 방향으로 계속 앞으로 나아가고 싶어 하는 편입니다.",
    positiveMeaning: "성장할 방향이 보일 때 오래 밀고 가는 데 강점이 있습니다.",
    shadowMeaning: "한번 맞다고 생각한 방향을 너무 오래 고집할 수 있습니다.",
    axes: { ACTION_TEMPO: 1, CHANGE_ORIENTATION: 1, INITIATIVE: 2, GOAL_DRIVE: 2, EXPANSION: 3, PERSISTENCE: 2, AUTONOMY: 1 },
    contexts: ["identity", "work", "learning"],
  },
  乙: {
    image: "막히면 빈틈을 찾아서라도 자라는 덩굴과 풀", family: "STEM_WOOD_YIN",
    easyMeaning: "정면으로 밀기보다 가능한 길을 찾아 계속 자라는 성질",
    humanDescription: "자기 방향은 있지만 방법은 상황에 맞게 바꾸는 편입니다.",
    positiveMeaning: "막히면 다른 방법을 찾아서 계속 가는 데 강점이 있습니다.",
    shadowMeaning: "바로 부딪치기보다 우회하다가 하고 싶은 말을 속에 쌓을 수 있습니다.",
    axes: { STRUCTURE_STYLE: -1, COMMUNICATION_STYLE: -1, ADAPTABILITY: 3, PERSISTENCE: 2, SOCIAL_ATTUNEMENT: 2, EXPANSION: 2, CARE: 1 },
    contexts: ["identity", "work", "social", "love"],
  },
  丙: {
    image: "주변까지 넓게 비추는 태양", family: "STEM_FIRE_YANG",
    easyMeaning: "안에만 머물지 않고 밖으로 밝게 드러나는 성질",
    humanDescription: "좋아하거나 확신하는 것이 생기면 말하고 보여주는 속도가 빠른 편입니다.",
    positiveMeaning: "사람 앞에서 표현하고 분위기를 움직이는 데 강점이 있습니다.",
    shadowMeaning: "기분과 에너지가 올라오면 말이나 행동도 함께 빨라질 수 있습니다.",
    axes: { ENERGY_DIRECTION: 3, ACTION_TEMPO: 2, EXPRESSION: 3, CHARISMA: 3, INITIATIVE: 2, SOCIAL_ATTUNEMENT: 1 },
    contexts: ["identity", "work", "social", "love"],
  },
  丁: {
    image: "가까운 곳을 오래 밝히는 등불", family: "STEM_FIRE_YIN",
    easyMeaning: "넓게 퍼지기보다 필요한 곳에 집중해서 밝히는 성질",
    humanDescription: "모든 곳에 에너지를 쓰기보다 중요한 사람이나 일에 집중하는 편입니다.",
    positiveMeaning: "작은 차이를 살피면서 꾸준히 결과를 다듬는 데 강점이 있습니다.",
    shadowMeaning: "신경 쓰는 대상 하나를 너무 오래 붙잡을 수 있습니다.",
    axes: { ENERGY_DIRECTION: 1, EXPRESSION: 2, CARE: 2, PRECISION: 2, PERSISTENCE: 2, SOCIAL_ATTUNEMENT: 1 },
    contexts: ["identity", "work", "love", "social"],
  },
  戊: {
    image: "쉽게 움직이지 않는 큰 산", family: "STEM_EARTH_YANG",
    easyMeaning: "흔들리기보다 버티고 지키려는 성질",
    humanDescription: "쉽게 결론을 바꾸기보다 한번 정한 것을 오래 지키는 편입니다.",
    positiveMeaning: "압박이 있어도 버티고 맡은 일을 지키는 데 강점이 있습니다.",
    shadowMeaning: "버티는 힘이 강한 만큼 이제 그만할 때도 오래 붙잡을 수 있습니다.",
    axes: { ACTION_TEMPO: -1, CHANGE_ORIENTATION: -2, STABILITY: 3, PERSISTENCE: 3, DUTY: 2, PRACTICALITY: 2, BOUNDARY: 2 },
    contexts: ["identity", "work", "stress"],
  },
  己: {
    image: "사람과 작물을 키우고 정리하는 밭", family: "STEM_EARTH_YIN",
    easyMeaning: "필요한 것을 챙겨 실제 생활이 굴러가게 만드는 성질",
    humanDescription: "사람과 일을 세세하게 챙기면서 실제로 굴러가게 만드는 편입니다.",
    positiveMeaning: "생활과 일을 현실적으로 관리하고 돌보는 데 강점이 있습니다.",
    shadowMeaning: "남의 일까지 자기 몫처럼 챙기다 지칠 수 있습니다.",
    axes: { CARE: 2, PRACTICALITY: 2, STABILITY: 2, ADAPTABILITY: 2, RESOURCE_SENSE: 1, SOCIAL_ATTUNEMENT: 1 },
    contexts: ["identity", "work", "money", "social"],
  },
  庚: {
    image: "필요 없는 것을 잘라내는 큰 칼", family: "STEM_METAL_YANG",
    easyMeaning: "문제가 무엇인지 가르고 결론을 내리려는 성질",
    humanDescription: "문제가 보이면 오래 돌려보기보다 필요한 것과 아닌 것을 빠르게 나누는 편입니다.",
    positiveMeaning: "문제를 정리하고 결정을 내려야 하는 순간에 강점이 있습니다.",
    shadowMeaning: "판단이 빠른 만큼 말이나 기준이 다른 사람에게 세게 느껴질 수 있습니다.",
    axes: { DECISION_STYLE: 3, COMMUNICATION_STYLE: 3, ACTION_TEMPO: 2, PRECISION: 2, BOUNDARY: 3, DUTY: 1 },
    contexts: ["identity", "work", "stress", "social"],
  },
  辛: {
    image: "작은 흠까지 다듬는 정밀한 금속과 보석", family: "STEM_METAL_YIN",
    easyMeaning: "작은 차이와 완성도를 세밀하게 보는 성질",
    humanDescription: "남들이 넘어가는 작은 차이나 부족한 점이 먼저 눈에 들어오는 편입니다.",
    positiveMeaning: "완성도를 높이고 작은 오류를 잡는 데 강점이 있습니다.",
    shadowMeaning: "기준이 높아지면 예민하거나 완벽주의적으로 변할 수 있습니다.",
    axes: { COMMUNICATION_STYLE: 1, PRECISION: 3, BOUNDARY: 2, EXPRESSION: 1, CHARISMA: 1, SOCIAL_ATTUNEMENT: 1 },
    contexts: ["identity", "work", "learning", "social"],
  },
  壬: {
    image: "막혀도 다른 길을 찾아 흐르는 큰 강과 바다", family: "STEM_WATER_YANG",
    easyMeaning: "한 길에 막혀도 다른 가능성과 길을 찾는 성질",
    humanDescription: "한 가지 방법이 막히면 다른 가능성을 찾아 움직이는 편입니다.",
    positiveMeaning: "새로운 정보와 기회를 연결하고 방법을 바꾸는 데 강점이 있습니다.",
    shadowMeaning: "관심과 가능성이 너무 넓어져 한 방향에 집중하기 어려울 수 있습니다.",
    axes: { CHANGE_ORIENTATION: 2, ADAPTABILITY: 3, OPPORTUNITY_SENSE: 2, PATTERN_SENSE: 2, EXPANSION: 2, CURIOSITY: 1 },
    contexts: ["identity", "work", "learning"],
  },
  癸: {
    image: "조용히 스며들어 오래 남는 비와 이슬", family: "STEM_WATER_YIN",
    easyMeaning: "크게 드러나지 않아도 안으로 깊게 스며드는 성질",
    humanDescription: "겉으로 바로 드러내기보다 작은 분위기와 생각을 안에서 오래 받아들이는 편입니다.",
    positiveMeaning: "작은 변화와 연결을 깊게 보고 배우는 데 강점이 있습니다.",
    shadowMeaning: "생각과 감정이 안에서 너무 오래 머물 수 있습니다.",
    axes: { ENERGY_DIRECTION: -2, ACTION_TEMPO: -2, DEPTH: 3, SOCIAL_ATTUNEMENT: 2, PATTERN_SENSE: 2, LEARNING: 2 },
    contexts: ["identity", "learning", "social", "recovery"],
  },
} as const satisfies Record<HeavenlyStem, NatalSemanticDefinition & { image: string }>;

export const EARTHLY_BRANCH_SEMANTICS = {
  子: {
    family: "BRANCH_WATER", easyMeaning: "생각과 정보가 계속 이어지는 물",
    humanDescription: "하나를 생각하기 시작하면 그다음 생각까지 자연스럽게 이어지는 편입니다.",
    positiveMeaning: "한 가지 정보를 다른 생각과 이어볼 수 있습니다.", shadowMeaning: "쉬려는 순간에도 생각이 이어질 수 있습니다.",
    axes: { CHANGE_ORIENTATION: 1, DEPTH: 1, PATTERN_SENSE: 1, RECOVERY_NEED: 1 }, contexts: ["identity", "learning", "recovery"],
  },
  丑: {
    family: "BRANCH_EARTH", easyMeaning: "모아두고 오래 버티는 땅",
    humanDescription: "급하게 쓰거나 바꾸기보다 가진 것을 모아두고 오래 유지하려는 편입니다.",
    positiveMeaning: "가진 것을 아끼고 오래 쓰는 데 힘을 보탭니다.", shadowMeaning: "쓸 일이 끝난 것도 오래 두게 될 수 있습니다.",
    axes: { ACTION_TEMPO: -1, STABILITY: 2, RESOURCE_SENSE: 2, PERSISTENCE: 2 }, contexts: ["identity", "work", "money"],
  },
  寅: {
    family: "BRANCH_WOOD", easyMeaning: "겨울 뒤 처음 크게 올라오는 나무",
    humanDescription: "새로운 방향이 보이면 시작할 때 힘이 잘 붙는 편입니다.",
    positiveMeaning: "새로운 일을 시작하는 순간에 활기를 보탭니다.", shadowMeaning: "시작할 일을 너무 많이 고를 수 있습니다.",
    axes: { CHANGE_ORIENTATION: 1, INITIATIVE: 2, EXPANSION: 2, GOAL_DRIVE: 1 }, contexts: ["identity", "work", "learning"],
  },
  卯: {
    family: "BRANCH_WOOD", easyMeaning: "부드럽게 넓어지는 봄의 나무",
    humanDescription: "정면으로 부딪치기보다 자연스럽게 관계와 일을 넓혀가는 편입니다.",
    positiveMeaning: "상대와 상황에 맞춰 방법을 바꾸는 데 힘을 보탭니다.", shadowMeaning: "맞춰주다 보면 내 뜻을 늦게 말할 수 있습니다.",
    axes: { ADAPTABILITY: 2, SOCIAL_ATTUNEMENT: 1, EXPANSION: 1, CARE: 1 }, contexts: ["identity", "work", "social", "love"],
  },
  辰: {
    family: "BRANCH_EARTH", easyMeaning: "여러 기운을 모으면서 다음 변화도 준비하는 땅",
    humanDescription: "지금 가진 것을 챙기면서 다음 변화도 같이 생각하는 편입니다.",
    positiveMeaning: "지킬 것과 바꿀 것을 함께 살펴볼 수 있습니다.", shadowMeaning: "현재 일과 다음 준비를 모두 챙기다 바빠질 수 있습니다.",
    axes: { RESOURCE_SENSE: 1, CHANGE_ORIENTATION: 1, PATTERN_SENSE: 1, STABILITY: 1 }, contexts: ["identity", "work", "money"],
  },
  巳: {
    family: "BRANCH_FIRE", easyMeaning: "안에서 열을 모아 빠르게 쓰는 불",
    humanDescription: "겉으로만 들뜨기보다 안에서 계산한 뒤 필요한 순간에 빠르게 움직이는 편입니다.",
    positiveMeaning: "준비한 생각을 필요한 순간에 꺼내볼 수 있습니다.", shadowMeaning: "생각한 순서와 다르면 급하게 고치려 할 수 있습니다.",
    axes: { STRATEGY: 1, EXPRESSION: 1, INITIATIVE: 1, PRECISION: 1 }, contexts: ["identity", "work"],
  },
  午: {
    family: "BRANCH_FIRE", easyMeaning: "가장 밝게 퍼지는 한낮의 불",
    humanDescription: "좋아하거나 확신하는 것이 생기면 밖으로 표현하고 보여주는 편입니다.",
    positiveMeaning: "마음에 든 것을 함께 즐기고 나누는 데 힘을 보탭니다.", shadowMeaning: "들뜬 만큼 에너지도 빠르게 쓸 수 있습니다.",
    axes: { ENERGY_DIRECTION: 2, EXPRESSION: 2, CHARISMA: 2, INITIATIVE: 1 }, contexts: ["identity", "social", "love"],
  },
  未: {
    family: "BRANCH_EARTH", easyMeaning: "자란 것을 다듬고 생활에 남기는 땅",
    humanDescription: "사람과 생활을 챙기면서 실제로 남는 것을 만들려는 편입니다.",
    positiveMeaning: "작은 돌봄을 일상에 이어가는 데 힘을 보탭니다.", shadowMeaning: "챙길 사람이 늘면 자기 생활을 놓칠 수 있습니다.",
    axes: { CARE: 1, STABILITY: 1, RESOURCE_SENSE: 1, SOCIAL_ATTUNEMENT: 1 }, contexts: ["identity", "social", "love"],
  },
  申: {
    family: "BRANCH_METAL", easyMeaning: "문제를 빠르게 찾아 움직이는 금",
    humanDescription: "문제가 생기면 오래 바라보기보다 해결 방법부터 찾는 편입니다.",
    positiveMeaning: "잘못된 곳을 찾아 다음 방법을 고르는 데 힘을 보탭니다.", shadowMeaning: "다른 사람의 설명이 끝나기 전에 답을 낼 수 있습니다.",
    axes: { DECISION_STYLE: 1, CHANGE_ORIENTATION: 1, PRECISION: 2, STRATEGY: 1 }, contexts: ["identity", "work", "learning"],
  },
  酉: {
    family: "BRANCH_METAL", easyMeaning: "다듬고 완성도를 높이는 금",
    humanDescription: "정리되지 않은 상태보다 깔끔하게 마무리된 결과를 좋아하는 편입니다.",
    positiveMeaning: "마지막 작은 차이까지 정리하는 데 힘을 보탭니다.", shadowMeaning: "끝낸 일도 다시 확인하다 마무리가 늦어질 수 있습니다.",
    axes: { STRUCTURE_STYLE: 1, PRECISION: 2, BOUNDARY: 1, CHARISMA: 1 }, contexts: ["identity", "work"],
  },
  戌: {
    family: "BRANCH_EARTH", easyMeaning: "끝을 정리하고 경계를 지키는 땅",
    humanDescription: "맡은 일을 중간에 놓기보다 끝까지 정리하려는 편입니다.",
    positiveMeaning: "맡은 일의 끝을 챙기고 기준을 지키는 데 힘을 보탭니다.", shadowMeaning: "이미 끝난 책임도 놓지 못할 수 있습니다.",
    axes: { DUTY: 2, BOUNDARY: 2, STABILITY: 1, PERSISTENCE: 1 }, contexts: ["identity", "work", "stress"],
  },
  亥: {
    family: "BRANCH_WATER", easyMeaning: "안쪽으로 깊어지는 큰 물",
    humanDescription: "겉에서 바로 답을 내기보다 안에서 생각을 길게 이어가는 편입니다.",
    positiveMeaning: "궁금한 것을 깊게 살펴보는 데 힘을 보탭니다.", shadowMeaning: "답을 꺼내기 전 생각하는 시간이 길어질 수 있습니다.",
    axes: { DEPTH: 2, CURIOSITY: 1, ADAPTABILITY: 1, RECOVERY_NEED: 1 }, contexts: ["identity", "learning", "recovery"],
  },
} as const satisfies Record<EarthlyBranch, NatalSemanticDefinition>;

/** Editorial importance only, never part of the saju calculation. */
export const PILLAR_CONTENT_WEIGHTS = {
  day: { stem: 5, branch: 4 }, month: { stem: 4, branch: 4 },
  hour: { stem: 2.5, branch: 2.5 }, year: { stem: 2, branch: 2 },
} as const satisfies Record<PillarKey, { stem: number; branch: number }>;
/** Normalize by the declared maximum, not by a chart-dependent count/threshold. */
export function effectivePositionWeight(pillar: PillarKey, slot: "stem" | "branch") {
  return PILLAR_CONTENT_WEIGHTS[pillar][slot] / PILLAR_CONTENT_WEIGHTS.day.stem;
}
