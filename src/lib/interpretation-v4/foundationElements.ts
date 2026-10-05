import type { FiveElement } from "../saju/types";
import { FOUNDATION_VERSION, type EvidenceAtom, type InterpretationContext, type SemanticSignature } from "./semanticCore";

export const FOUNDATION_ELEMENTS = ["WOOD", "FIRE", "EARTH", "METAL", "WATER"] as const satisfies readonly FiveElement[];
export type ElementKey = typeof FOUNDATION_ELEMENTS[number];
export const ELEMENT_STATE_MULTIPLIERS = { VERY_STRONG: 1.5, STRONG: 1, BALANCED: 0.5, WEAK: 0.15, VERY_WEAK: 0 } as const;
export type FoundationElementState = keyof typeof ELEMENT_STATE_MULTIPLIERS;
export type FoundationElementInput = {
  state: FoundationElementState;
  /** Read from the canonical engine, used only for unique max/min. */
  weightedScore: number;
  metadata?: Record<string, unknown>;
};
type ElementDefinition = {
  axes: SemanticSignature;
  contexts: readonly InterpretationContext[];
  easyMeaning: string;
  humanDescription: string;
  positiveMeaning: string;
  shadowMeaning: string;
  weakDescription: string;
  weakSecondary?: string;
  scene?: string;
};
export const FOUNDATION_ELEMENT_REGISTRY = {
  WOOD: {
    axes: { INITIATIVE: 1, GOAL_DRIVE: 1, EXPANSION: 2, PERSISTENCE: 1, ADAPTABILITY: 1 },
    contexts: ["identity", "work", "learning"],
    easyMeaning: "앞으로 나아가고 지금보다 더 커지고 싶어 하는 기운입니다.",
    humanDescription: "앞으로 나아가고 지금보다 더 성장하고 싶은 마음이 강합니다.",
    positiveMeaning: "목표가 보이면 그 방향으로 계속 키워가는 데 강점이 있습니다.",
    shadowMeaning: "한번 방향을 정한 뒤에는 생각보다 고집이 세질 수 있습니다.",
    scene: "지금 하는 일이 몇 년 뒤에도 똑같을 것 같으면 답답하게 느낄 수 있습니다.",
    weakDescription: "무작정 시작하기보다 왜 이걸 해야 하는지 방향이 잡혀야 움직이기 쉬운 편입니다.",
  },
  FIRE: {
    axes: { ENERGY_DIRECTION: 2, EXPRESSION: 2, CHARISMA: 2, CREATION: 1, INITIATIVE: 1 },
    contexts: ["identity", "work", "social", "love"],
    easyMeaning: "생각이나 감정을 밖으로 보여주는 기운입니다.",
    humanDescription: "생각이나 감정이 밖으로 드러나는 속도가 빠른 편입니다.",
    positiveMeaning: "말하고 보여주고 사람의 반응을 끌어내는 데 강점이 있습니다.",
    shadowMeaning: "기분이 올라왔을 때 말이나 행동까지 같이 빨라질 수 있습니다.",
    scene: "재미있는 일이 생기면 혼자 알고 있기보다 말하고 보여주고 함께 즐기고 싶어 합니다.",
    weakDescription: "아는 것과 그것을 다른 사람에게 보여주는 것 사이에 시간이 걸릴 수 있습니다.",
    weakSecondary: "머릿속에서는 이미 답이 있는데 설명하거나 공개하는 마지막 단계가 늦어질 수 있습니다.",
  },
  EARTH: {
    axes: { STRUCTURE_STYLE: 2, STABILITY: 2, PRACTICALITY: 2, PERSISTENCE: 1, DUTY: 1, RESOURCE_SENSE: 1 },
    contexts: ["identity", "work", "money", "recovery"],
    easyMeaning: "현실에서 오래 굴러갈 수 있는지를 중요하게 보는 기운입니다.",
    humanDescription: "좋은 생각이라도 돈, 시간, 생활이 실제로 감당되는지 같이 보는 편입니다.",
    positiveMeaning: "한번 만든 것을 오래 유지하고 현실에 자리 잡게 하는 데 강점이 있습니다.",
    shadowMeaning: "이미 오래 해왔다는 이유만으로 놓지 못할 수 있습니다.",
    weakDescription: "새로운 생각을 매일 반복할 생활 구조로 만드는 데는 의식적인 관리가 필요할 수 있습니다.",
    weakSecondary: "시작은 했는데 수면, 일정, 기록, 정리 같은 단순한 관리가 뒤로 밀릴 수 있습니다.",
  },
  METAL: {
    axes: { STRUCTURE_STYLE: 2, DECISION_STYLE: 1, COMMUNICATION_STYLE: 1, PRECISION: 2, BOUNDARY: 2, STRATEGY: 1, PRACTICALITY: 1 },
    contexts: ["identity", "work", "learning", "social"],
    easyMeaning: "필요한 것과 필요 없는 것을 가르고 기준을 세우는 기운입니다.",
    humanDescription: "애매한 설명이나 앞뒤가 맞지 않는 말을 그냥 넘어가기 어려운 편입니다.",
    positiveMeaning: "작은 오류를 보고 기준을 세워 정리하는 데 강점이 있습니다.",
    shadowMeaning: "사람에게까지 같은 기준을 적용하면 까다롭게 보일 수 있습니다.",
    weakDescription: "정답을 빨리 고르기보다 여러 선택지를 조금 더 오래 열어두는 편일 수 있습니다.",
  },
  WATER: {
    axes: { ACTION_TEMPO: -1, ENERGY_DIRECTION: -1, STRUCTURE_STYLE: -1, DEPTH: 2, ADAPTABILITY: 2, PATTERN_SENSE: 1, CURIOSITY: 1, LEARNING: 1, RECOVERY_NEED: 1 },
    contexts: ["identity", "work", "learning", "recovery"],
    easyMeaning: "하나를 보고도 생각을 더 이어가고 다른 것과 연결하는 기운입니다.",
    humanDescription: "하나를 보고도 머릿속에서 다음 생각이 계속 이어지는 편입니다.",
    positiveMeaning: "정보를 깊게 보고 여러 가능성을 연결하는 데 강점이 있습니다.",
    shadowMeaning: "생각할 재료가 많아져 오히려 답을 늦게 고를 수 있습니다.",
    scene: "검색 하나를 시작했다가 관련된 내용까지 계속 찾아볼 수 있습니다.",
    weakDescription: "계속 생각만 하기보다 일단 해보면서 답을 찾는 쪽이 더 편할 수 있습니다.",
  },
} as const satisfies Record<ElementKey, ElementDefinition>;

export const isStrongElement = (state: FoundationElementState) => state === "STRONG" || state === "VERY_STRONG";
export const isWeakElement = (state: FoundationElementState) => state === "WEAK" || state === "VERY_WEAK";
export const elementEvidenceId = (element: ElementKey, state: FoundationElementState) => `foundation:element:${element}:${state}`;

export function buildElementEvidence(element: ElementKey, input: FoundationElementInput): EvidenceAtom {
  const definition: ElementDefinition = FOUNDATION_ELEMENT_REGISTRY[element];
  const strong = isStrongElement(input.state), weak = isWeakElement(input.state);
  return {
    id: elementEvidenceId(element, input.state), sourceType: "element", sourceKey: element,
    kind: "TRAIT", tier: "SUPPORT", strength: strong ? "STRONG" : weak ? "WEAK" : "MEDIUM",
    weight: ELEMENT_STATE_MULTIPLIERS[input.state], axes: { ...definition.axes },
    contexts: [...definition.contexts], family: `element:${element}`, easyMeaning: definition.easyMeaning,
    ...(strong ? { humanDescription: definition.humanDescription, positiveMeaning: definition.positiveMeaning, shadowMeaning: definition.shadowMeaning } :
      weak ? { humanDescription: definition.weakDescription } : {}),
    metadata: { ...input.metadata, registryVersion: FOUNDATION_VERSION, state: input.state,
      weightedScore: input.weightedScore, mainClaimEligible: strong,
      ...(strong && definition.scene ? { scene: definition.scene } : {}),
      ...(weak && definition.weakSecondary ? { secondaryDescription: definition.weakSecondary } : {}),
    },
  };
}
