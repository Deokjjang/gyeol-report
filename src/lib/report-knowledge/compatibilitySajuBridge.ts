import type {
  CompatibilityEvidenceItem,
  CompatibilityPersonChartSummary,
} from "./compatibilityTypes";
import {
  buildCompatibilityDeepSajuBridge,
  type CompatibilityDeepSajuBridgeResult,
  type CompatibilityDeepSajuLayer,
  type CompatibilityDeepSajuNote,
} from "./compatibilityDeepSajuBridge";

export type CompatibilitySajuBridgeResult = {
  readonly deepSajuBridge: CompatibilityDeepSajuBridgeResult;
  readonly sharedFeatureLabels: readonly string[];
  readonly complementaryElementNotes: readonly string[];
  readonly frictionNotes: readonly string[];
  readonly attractionNotes: readonly string[];
  readonly longTermNotes: readonly string[];
  readonly moneyLifestyleNotes: readonly string[];
  readonly evidenceItems: readonly CompatibilityEvidenceItem[];
};

type BuildCompatibilitySajuBridgeInput = {
  readonly personA: CompatibilityPersonChartSummary;
  readonly personB: CompatibilityPersonChartSummary;
};

function sharedValues(
  left: readonly string[],
  right: readonly string[],
): readonly string[] {
  const rightSet = new Set(right);
  return [...new Set(left.filter((value) => rightSet.has(value)))];
}

function hasFeature(
  person: CompatibilityPersonChartSummary,
  label: string,
): boolean {
  return person.featureLabels.includes(label);
}

function getFeatureIdsByLabel(
  person: CompatibilityPersonChartSummary,
  label: string,
): readonly string[] {
  return person.featureIds.filter((featureId, index) => {
    const featureLabel = person.featureLabels[index];
    return featureLabel === label;
  });
}

function item(input: {
  readonly section: CompatibilityEvidenceItem["section"];
  readonly title: string;
  readonly summary: string;
  readonly personAFeatureIds?: readonly string[];
  readonly personBFeatureIds?: readonly string[];
  readonly sceneSeeds?: readonly string[];
  readonly practicalSwitches?: readonly string[];
  readonly scoreImpact: number;
}): CompatibilityEvidenceItem {
  return {
    section: input.section,
    title: input.title,
    summary: input.summary,
    personAFeatureIds: input.personAFeatureIds ?? [],
    personBFeatureIds: input.personBFeatureIds ?? [],
    mbtiTraitIds: [],
    sceneSeeds: input.sceneSeeds ?? [],
    practicalSwitches: input.practicalSwitches ?? [],
    scoreImpact: input.scoreImpact,
  };
}

function deepNoteSection(
  layer: CompatibilityDeepSajuLayer,
): CompatibilityEvidenceItem["section"] {
  const sectionByLayer = {
    day_master_relation: "overview",
    cross_ten_god: "communication",
    combined_element_climate: "money_lifestyle",
    element_complement: "strengths",
    branch_trine: "attraction",
    branch_clash: "frictions",
    branch_harm: "conflict_recovery",
    spouse_palace: "relationship_scenes",
    month_rhythm: "money_lifestyle",
    hour_life_rhythm: "long_term",
  } as const satisfies Record<
    CompatibilityDeepSajuLayer,
    CompatibilityEvidenceItem["section"]
  >;

  return sectionByLayer[layer];
}

function deepNoteEvidenceItem(note: CompatibilityDeepSajuNote): CompatibilityEvidenceItem {
  return {
    section: deepNoteSection(note.layer),
    title: note.title,
    summary: `${note.summary} ${note.emotionalMeaning}`,
    deepSajuLayer: note.layer,
    personAFeatureIds: [],
    personBFeatureIds: [],
    mbtiTraitIds: [],
    sceneSeeds: [note.emotionalMeaning],
    practicalSwitches: [note.practicalMeaning],
    scoreImpact: 0,
  };
}

function hasAnyFeature(
  person: CompatibilityPersonChartSummary,
  labels: readonly string[],
): boolean {
  return labels.some((label) => hasFeature(person, label));
}

export function buildCompatibilitySajuBridge(
  input: BuildCompatibilitySajuBridgeInput,
): CompatibilitySajuBridgeResult {
  const deepSajuBridge = buildCompatibilityDeepSajuBridge(input);
  const sharedFeatureLabels = sharedValues(
    input.personA.featureLabels,
    input.personB.featureLabels,
  );
  const complementaryElementNotes: string[] = [];
  const frictionNotes: string[] = [];
  const attractionNotes: string[] = [];
  const longTermNotes: string[] = [];
  const moneyLifestyleNotes: string[] = [];
  const evidenceItems: CompatibilityEvidenceItem[] = [];

  if (input.personA.dayPillar !== input.personB.dayPillar) {
    attractionNotes.push(
      `${input.personA.displayName}의 ${input.personA.dayPillar}일주와 ${input.personB.displayName}의 ${input.personB.dayPillar}일주는 서로 다른 방식으로 긴장과 안정감을 만듭니다.`,
    );
    evidenceItems.push(
      item({
        section: "two_charts",
        title: "서로 다른 일주 리듬",
        summary:
          "두 사람의 일주가 다르면 끌림과 답답함이 같은 자리에서 동시에 생길 수 있습니다.",
        scoreImpact: 2,
      }),
    );
  }

  if (sharedFeatureLabels.includes("천을귀인")) {
    longTermNotes.push(
      "두 사람 모두 천을귀인이 잡히면 서로가 막힌 문제를 풀어 주는 통로가 될 수 있습니다.",
    );
    evidenceItems.push(
      item({
        section: "strengths",
        title: "함께 열리는 도움의 통로",
        summary:
          "둘 다 천을귀인이 있어 도움과 기회를 여는 감각은 맞지만, 요청이 늦으면 장점도 늦게 열릴 수 있습니다.",
        personAFeatureIds: getFeatureIdsByLabel(input.personA, "천을귀인"),
        personBFeatureIds: getFeatureIdsByLabel(input.personB, "천을귀인"),
        sceneSeeds: ["막힌 일을 각자 끌고 가다가, 늦게 말했을 때 의외로 빨리 풀리는 장면"],
        practicalSwitches: ["문제가 생기면 혼자 정리하기 전에 필요한 도움을 한 문장으로 먼저 공유하세요."],
        scoreImpact: 6,
      }),
    );
  }

  if (sharedFeatureLabels.includes("재고귀인")) {
    moneyLifestyleNotes.push(
      "두 사람 모두 재고귀인이 있으면 돈과 자원을 저장하려는 감각은 맞을 수 있습니다.",
    );
    evidenceItems.push(
      item({
        section: "money_lifestyle",
        title: "돈과 자원을 남기려는 공통 감각",
        summary:
          "둘 다 재고귀인이 있으면 계좌, 기록, 저축 기준은 잘 맞을 수 있지만 각자 통제 방식이 강하면 생활비 기준에서 부딪힐 수 있습니다.",
        personAFeatureIds: getFeatureIdsByLabel(input.personA, "재고귀인"),
        personBFeatureIds: getFeatureIdsByLabel(input.personB, "재고귀인"),
        sceneSeeds: ["돈을 쓸지 말지보다 어디에 묶어둘지를 먼저 이야기하는 장면"],
        practicalSwitches: ["생활비, 저축, 각자 자유비의 기준을 숫자로 합의하세요."],
        scoreImpact: 5,
      }),
    );
  }

  if (
    hasAnyFeature(input.personA, ["수 부족", "화 부족"]) ||
    hasAnyFeature(input.personB, ["화 과다", "수 과다"])
  ) {
    complementaryElementNotes.push(
      "표현 온도와 감정 완충 속도가 서로 다르게 작동할 수 있습니다.",
    );
    evidenceItems.push(
      item({
        section: "communication",
        title: "표현 온도와 완충 속도",
        summary:
          "한쪽은 빨리 정리하려 하고 다른 한쪽은 안에서 더 오래 검토할 수 있어 대화 속도 규칙이 필요합니다.",
        personAFeatureIds: input.personA.featureIds.filter((featureId) =>
          ["element_water_missing", "element_fire_missing"].includes(featureId),
        ),
        personBFeatureIds: input.personB.featureIds.filter((featureId) =>
          ["element_fire_excess", "element_water_excess"].includes(featureId),
        ),
        sceneSeeds: ["한 사람은 바로 정리하고 싶고, 다른 사람은 생각을 더 굴린 뒤 말하고 싶은 장면"],
        practicalSwitches: ["중요한 대화는 바로 결론을 내기보다 생각 시간과 다시 말할 시간을 정하세요."],
        scoreImpact: -3,
      }),
    );
  }

  if (hasFeature(input.personA, "원진살") || hasFeature(input.personB, "원진살")) {
    frictionNotes.push(
      "원진살이 있으면 가까워질수록 작은 결이 크게 느껴질 수 있어 연락과 약속 규칙이 필요합니다.",
    );
    evidenceItems.push(
      item({
        section: "frictions",
        title: "가까울수록 커지는 작은 결",
        summary:
          "원진살은 무섭게 단정할 항목이 아니라, 가까운 관계에서 생활 결이 거슬릴 때 규칙으로 풀어야 하는 신호입니다.",
        personAFeatureIds: getFeatureIdsByLabel(input.personA, "원진살"),
        personBFeatureIds: getFeatureIdsByLabel(input.personB, "원진살"),
        sceneSeeds: ["연락 속도나 약속 방식의 작은 차이가 생각보다 크게 걸리는 장면"],
        practicalSwitches: ["연락 빈도, 약속 변경, 혼자 쉬는 시간을 미리 말로 정하세요."],
        scoreImpact: -5,
      }),
    );
  }

  if (
    input.personA.birthTimeConfidence === "unknown" ||
    input.personB.birthTimeConfidence === "unknown"
  ) {
    longTermNotes.push(
      "출생시간이 모르는 쪽은 시주 기반 해석의 확신도를 낮춰서 봐야 합니다.",
    );
    evidenceItems.push(
      item({
        section: "two_charts",
        title: "출생시간 미상 보정",
        summary:
          "출생시간이 없으면 시주에서 드러나는 후반 운영, 생활 리듬, 세부 신살 해석은 확정하지 않습니다.",
        practicalSwitches: ["시간을 모르는 사람의 시주 기반 판단은 보조 참고로만 보세요."],
        scoreImpact: -2,
      }),
    );
  }

  evidenceItems.push(...deepSajuBridge.notes.map(deepNoteEvidenceItem));

  return {
    deepSajuBridge,
    sharedFeatureLabels,
    complementaryElementNotes,
    frictionNotes,
    attractionNotes,
    longTermNotes,
    moneyLifestyleNotes,
    evidenceItems,
  };
}
