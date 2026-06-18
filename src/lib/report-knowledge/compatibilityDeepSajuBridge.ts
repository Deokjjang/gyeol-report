import type {
  CompatibilityBranchRelation,
  CompatibilityBranchRef,
} from "./compatibilityRelationRules";
import {
  createBranchRef,
  detectCrossBranchRelations,
  formatBranchRef,
  getCrossTenGodRelation,
  getDayMasterElementRelation,
} from "./compatibilityRelationRules";
import type { CompatibilityPersonChartSummary } from "./compatibilityTypes";
import type { FiveElement } from "./sajuKnowledgeTypes";

export type CompatibilityDeepSajuLayer =
  | "day_master_relation"
  | "cross_ten_god"
  | "combined_element_climate"
  | "element_complement"
  | "branch_trine"
  | "branch_clash"
  | "branch_harm"
  | "spouse_palace"
  | "month_rhythm"
  | "hour_life_rhythm";

export type CompatibilityDeepSajuNote = {
  readonly layer: CompatibilityDeepSajuLayer;
  readonly title: string;
  readonly summary: string;
  readonly personARefs: readonly string[];
  readonly personBRefs: readonly string[];
  readonly relationLabel: string;
  readonly emotionalMeaning: string;
  readonly practicalMeaning: string;
  readonly scoreImpact: number;
  readonly principleExplanation: string;
  readonly relationshipTranslation: string;
  readonly positiveExpression: string;
  readonly riskExpression: string;
  readonly everydayScene: string;
  readonly actionRule: string;
  readonly plainKoreanSummary: string;
};

export type CompatibilityDeepSajuBridgeResult = {
  readonly notes: readonly CompatibilityDeepSajuNote[];
  readonly attractionNotes: readonly CompatibilityDeepSajuNote[];
  readonly frictionNotes: readonly CompatibilityDeepSajuNote[];
  readonly lifestyleNotes: readonly CompatibilityDeepSajuNote[];
  readonly communicationNotes: readonly CompatibilityDeepSajuNote[];
};

type BuildCompatibilityDeepSajuBridgeInput = {
  readonly personA: CompatibilityPersonChartSummary;
  readonly personB: CompatibilityPersonChartSummary;
};

const elementKo = {
  wood: "목",
  fire: "화",
  earth: "토",
  metal: "금",
  water: "수",
} as const satisfies Record<FiveElement, string>;

function hasKoreanFinalConsonant(value: string): boolean {
  const lastCode = value.charCodeAt(value.length - 1);

  if (lastCode < 0xac00 || lastCode > 0xd7a3) {
    return false;
  }

  return (lastCode - 0xac00) % 28 !== 0;
}

function joinKoreanTermsWithAnd(values: readonly string[]): string {
  if (values.length <= 1) {
    return values[0] ?? "";
  }

  const head = values.slice(0, -1);
  const last = values[values.length - 1];
  const previous = head.join(", ");
  const particle = hasKoreanFinalConsonant(previous) ? "과" : "와";

  return `${previous}${particle} ${last}`;
}

function formatElementFlow(elements: readonly FiveElement[]): string {
  const names = elements.map((element) => elementKo[element]);

  return names.length === 0
    ? "빈 오행의 흐름"
    : `${joinKoreanTermsWithAnd(names)}의 흐름`;
}

function getPillarStem(pillar: string): string {
  return pillar.trim().slice(0, 1);
}

function getPillarBranch(pillar: string): string {
  return pillar.trim().slice(-1);
}

function createBranchRefs(
  person: CompatibilityPersonChartSummary,
): readonly CompatibilityBranchRef[] {
  return [
    createBranchRef({
      person: person.role,
      personLabel: person.displayName,
      position: "year",
      pillar: person.pillars.year,
    }),
    createBranchRef({
      person: person.role,
      personLabel: person.displayName,
      position: "month",
      pillar: person.pillars.month,
    }),
    createBranchRef({
      person: person.role,
      personLabel: person.displayName,
      position: "day",
      pillar: person.pillars.day,
    }),
    createBranchRef({
      person: person.role,
      personLabel: person.displayName,
      position: "hour",
      pillar: person.pillars.hour,
    }),
  ].filter((ref): ref is CompatibilityBranchRef => ref !== undefined);
}

function refsByPerson(
  refs: readonly CompatibilityBranchRef[],
  person: CompatibilityBranchRef["person"],
): readonly string[] {
  return refs.filter((ref) => ref.person === person).map(formatBranchRef);
}

function relationLabels(
  relations: readonly CompatibilityBranchRelation[],
): string {
  return [...new Set(relations.map((relation) => relation.relationLabel))].join(" · ");
}

function isBranchTrineRelation(relation: CompatibilityBranchRelation): boolean {
  return relation.kind === "three_harmony" || relation.kind === "half_harmony";
}

function hasHourRef(relations: readonly CompatibilityBranchRelation[]): boolean {
  return relations.some((relation) =>
    relation.refs.some((ref) => ref.position === "hour"),
  );
}

function hasMonthRef(relations: readonly CompatibilityBranchRelation[]): boolean {
  return relations.some((relation) =>
    relation.refs.some((ref) => ref.position === "month"),
  );
}

function combinedElementCounts(input: BuildCompatibilityDeepSajuBridgeInput) {
  return {
    wood:
      input.personA.sajuFacts.fiveElementCounts.wood +
      input.personB.sajuFacts.fiveElementCounts.wood,
    fire:
      input.personA.sajuFacts.fiveElementCounts.fire +
      input.personB.sajuFacts.fiveElementCounts.fire,
    earth:
      input.personA.sajuFacts.fiveElementCounts.earth +
      input.personB.sajuFacts.fiveElementCounts.earth,
    metal:
      input.personA.sajuFacts.fiveElementCounts.metal +
      input.personB.sajuFacts.fiveElementCounts.metal,
    water:
      input.personA.sajuFacts.fiveElementCounts.water +
      input.personB.sajuFacts.fiveElementCounts.water,
  } as const satisfies Record<FiveElement, number>;
}

function buildElementComplementNote(
  input: BuildCompatibilityDeepSajuBridgeInput,
): CompatibilityDeepSajuNote | undefined {
  const personAComplemented = input.personA.sajuFacts.missingElements.filter(
    (element) => input.personB.sajuFacts.fiveElementCounts[element] > 0,
  );
  const personBComplemented = input.personB.sajuFacts.missingElements.filter(
    (element) => input.personA.sajuFacts.fiveElementCounts[element] > 0,
  );

  if (personAComplemented.length === 0 && personBComplemented.length === 0) {
    return undefined;
  }

  const personAText = personAComplemented.map((element) => elementKo[element]).join("·");
  const personBText = personBComplemented.map((element) => elementKo[element]).join("·");
  const personAFlowText = formatElementFlow(personAComplemented);
  const personBFlowText = formatElementFlow(personBComplemented);

  return {
    layer: "element_complement",
    title: "오행 보완",
    summary: `${input.personA.displayName}의 ${personAText || "빈 오행"} 부족을 ${input.personB.displayName}이 일부 보태고, ${input.personB.displayName}의 ${personBText || "빈 오행"} 부족을 ${input.personA.displayName}이 일부 보탭니다.`,
    personARefs: input.personA.sajuFacts.missingElements.map(
      (element) => `${input.personA.displayName} ${elementKo[element]} 부족`,
    ),
    personBRefs: input.personB.sajuFacts.missingElements.map(
      (element) => `${input.personB.displayName} ${elementKo[element]} 부족`,
    ),
    relationLabel: "오행 상호 보완",
    emotionalMeaning:
      "서로에게 없는 온도, 완충, 방향, 정리 감각을 상대가 일부 채워 줄 수 있습니다.",
    practicalMeaning:
      "상대가 내 빈칸을 대신 책임져 준다고 보기보다, 서로의 강한 영역을 역할로 나누는 편이 좋습니다.",
    scoreImpact: 4,
    principleExplanation:
      "오행 보완은 한 사람에게 약한 기운을 다른 사람이 어느 정도 자극하거나 보태는 구조입니다. 부족한 오행은 자동으로 잘 켜지지 않는다는 뜻에 가깝습니다.",
    relationshipTranslation: `${input.personA.displayName}은 ${personAFlowText}이 약해 감정의 온도와 부드러운 흐름이 늦게 켜질 수 있고, ${input.personB.displayName}은 그 부분을 자극할 수 있습니다. 반대로 ${input.personB.displayName}은 ${personBFlowText}이 약해 방향 설정과 기준 정리가 흔들릴 수 있는데, ${input.personA.displayName}의 구조가 그 부분을 보완할 수 있습니다.`,
    positiveExpression: `좋게 쓰이면 ${input.personA.displayName}은 방향과 구조를 잡고, ${input.personB.displayName}은 온도와 반응을 살려 관계가 입체적으로 굴러갑니다.`,
    riskExpression:
      "나쁘게 쓰이면 상대가 내 부족한 부분을 알아서 채워 주길 기대하게 되어 부담이 커집니다.",
    everydayScene: `${input.personA.displayName}이 감정을 말로 바로 풀지 못할 때 ${input.personB.displayName}이 온도를 올려 대화를 열고, ${input.personB.displayName}이 방향을 망설일 때 ${input.personA.displayName}이 선택지를 정리해 주는 장면입니다.`,
    actionRule:
      "상대가 내 빈칸을 대신 책임지는 구조로 만들지 말고, 서로의 강한 영역을 역할로 나눠야 합니다.",
    plainKoreanSummary:
      "서로의 약한 기운을 어느 정도 보완하지만, 상대에게 내 부족함을 떠넘기면 피로가 커집니다.",
  };
}

function buildCombinedClimateNote(
  input: BuildCompatibilityDeepSajuBridgeInput,
): CompatibilityDeepSajuNote | undefined {
  const counts = combinedElementCounts(input);
  const heavyElements = Object.entries(counts)
    .filter(([, count]) => count >= 7)
    .map(([element]) => element as FiveElement);

  if (heavyElements.length === 0) {
    return undefined;
  }

  return {
    layer: "combined_element_climate",
    title: "합쳐졌을 때 무거워지는 오행",
    summary: `두 사람 원국을 합치면 ${heavyElements
      .map((element) => elementKo[element])
      .join("·")}가 무거워져 관계가 현실·책임·관리 쪽으로 빨리 기울 수 있습니다.`,
    personARefs: [`${input.personA.displayName} 오행 분포`],
    personBRefs: [`${input.personB.displayName} 오행 분포`],
    relationLabel: heavyElements
      .map((element) => `${elementKo[element]} ${counts[element]}`)
      .join(" · "),
    emotionalMeaning:
      "감정보다 일정, 책임, 돈, 현실 판단이 먼저 올라오면 관계가 빠르게 무거워질 수 있습니다.",
    practicalMeaning:
      "중요한 책임은 함께 정하되, 데이트와 회복 시간은 별도로 확보해야 합니다.",
    scoreImpact: -2,
    principleExplanation:
      "토는 현실, 책임, 보관, 안정, 관리의 기운입니다. 두 사람의 토가 합쳐져 무거워지면 관계가 감정만으로 흐르기보다 생활, 돈, 계획, 책임 쪽으로 빨리 내려앉습니다.",
    relationshipTranslation:
      "두 사람은 감정의 설렘보다 실제로 어떻게 굴릴지, 무엇을 지킬지, 무엇을 남길지를 빨리 생각하게 될 수 있습니다.",
    positiveExpression:
      "좋게 쓰이면 관계가 쉽게 흩어지지 않고, 실질적인 계획과 책임을 만들 수 있습니다.",
    riskExpression:
      "나쁘게 흐르면 연애가 빨리 관리표처럼 느껴지고, 즐거움보다 의무가 먼저 보일 수 있습니다.",
    everydayScene:
      "데이트 이야기를 하다가도 돈, 일정, 책임, 다음 계획 얘기로 금방 내려앉는 장면입니다.",
    actionRule:
      "책임을 정하는 시간과 가볍게 쉬는 시간을 의도적으로 분리해야 합니다.",
    plainKoreanSummary:
      "관계가 안정적으로 굴러갈 수 있지만, 너무 빨리 현실과 책임 쪽으로 무거워질 수 있습니다.",
  };
}

function buildDayMasterRelationNote(
  input: BuildCompatibilityDeepSajuBridgeInput,
): CompatibilityDeepSajuNote | undefined {
  const relation = getDayMasterElementRelation(
    getPillarStem(input.personA.pillars.day),
    getPillarStem(input.personB.pillars.day),
  );

  if (relation === undefined) {
    return undefined;
  }

  return {
    layer: "day_master_relation",
    title: "일간 관계",
    summary: relation.summary,
    personARefs: [`${input.personA.displayName} 일간 ${relation.sourceStem}`],
    personBRefs: [`${input.personB.displayName} 일간 ${relation.targetStem}`],
    relationLabel: relation.relationLabel,
    emotionalMeaning:
      relation.relation === "generates"
        ? `${input.personA.displayName}이 방향과 연료를 주고 ${input.personB.displayName}이 온도와 표현으로 반응하는 그림이 생길 수 있습니다.`
        : "두 사람의 기본 에너지가 어느 쪽에서 힘을 주고 어느 쪽에서 조절되는지 보여 줍니다.",
    practicalMeaning:
      "한쪽이 계속 밀어 주는 구조가 되지 않도록, 받는 쪽의 반응과 되돌려 주는 방식을 말로 정해야 합니다.",
    scoreImpact: relation.relation === "generates" ? 3 : 1,
    principleExplanation:
      relation.relation === "generates"
        ? "목은 화를 생합니다. 나무가 불을 살리듯, 방향성과 성장의 기운이 표현과 온도의 기운을 키우는 관계입니다."
        : "일간 관계는 두 사람의 기본 기운이 서로 힘을 주는지, 비슷하게 공명하는지, 조절하는지 보는 계산입니다.",
    relationshipTranslation:
      relation.relation === "generates"
        ? `${input.personA.displayName}의 갑목은 ${input.personB.displayName}의 정화를 살리는 쪽으로 작동할 수 있어, ${input.personA.displayName}이 방향을 잡으면 ${input.personB.displayName}의 생각과 감정 표현이 더 선명해질 수 있습니다.`
        : "두 사람 관계에서는 누가 방향을 만들고 누가 반응하는지, 또는 누가 조절과 기준을 세우는지로 나타날 수 있습니다.",
    positiveExpression:
      "좋게 쓰이면 한쪽은 방향과 추진을 주고, 다른 한쪽은 온도와 표현으로 관계를 살아나게 만듭니다.",
    riskExpression:
      "나쁘게 굳으면 한쪽이 계속 밀어 주고, 다른 한쪽은 반응만 하는 구조가 되어 균형이 무너질 수 있습니다.",
    everydayScene: `${input.personA.displayName}이 “이 방향으로 해보자”고 길을 잡으면, ${input.personB.displayName}이 그 안에서 자기 생각을 더 구체적으로 꺼내는 장면입니다.`,
    actionRule:
      "방향을 잡은 사람은 상대가 반응할 시간을 기다려야 하고, 반응하는 사람은 고마움과 자기 의견을 함께 표현해야 합니다.",
    plainKoreanSummary:
      "한쪽의 방향성이 다른 쪽의 표현과 온도를 살리는 관계입니다.",
  };
}

function buildCrossTenGodNote(
  input: BuildCompatibilityDeepSajuBridgeInput,
): CompatibilityDeepSajuNote | undefined {
  const personAToB = getCrossTenGodRelation({
    viewerDayStem: getPillarStem(input.personA.pillars.day),
    targetDayStem: getPillarStem(input.personB.pillars.day),
  });
  const personBToA = getCrossTenGodRelation({
    viewerDayStem: getPillarStem(input.personB.pillars.day),
    targetDayStem: getPillarStem(input.personA.pillars.day),
  });

  if (personAToB === undefined || personBToA === undefined) {
    return undefined;
  }

  return {
    layer: "cross_ten_god",
    title: "서로에게 보이는 십성",
    summary: `${input.personA.displayName}에게 ${input.personB.displayName}은 ${personAToB.tenGodKo}, ${input.personB.displayName}에게 ${input.personA.displayName}은 ${personBToA.tenGodKo} 쪽 자극으로 보일 수 있습니다.`,
    personARefs: [personAToB.relationLabel],
    personBRefs: [personBToA.relationLabel],
    relationLabel: `${personAToB.tenGodKo}/${personBToA.tenGodKo}`,
    emotionalMeaning:
      "한쪽은 생각을 밖으로 꺼내게 하고, 다른 한쪽은 기준과 의미를 보태는 안정감으로 느껴질 수 있습니다.",
    practicalMeaning:
      "대화할 때 표현을 막기보다 먼저 꺼내게 두고, 그 뒤에 기준과 의미를 정리하면 충돌이 줄어듭니다.",
    scoreImpact: 2,
    principleExplanation:
      "상관은 표현, 반응, 기존 틀을 흔들어 밖으로 꺼내는 기운입니다. 정인은 의미, 기준, 보호감, 생각을 정리해 주는 기운입니다.",
    relationshipTranslation: `${input.personA.displayName}에게 ${input.personB.displayName}은 생각과 표현을 더 직접적으로 꺼내게 하는 자극이 될 수 있고, ${input.personB.displayName}에게 ${input.personA.displayName}은 기준과 의미를 보태 주는 안정감으로 느껴질 수 있습니다.`,
    positiveExpression: `좋게 쓰이면 ${input.personA.displayName}은 ${input.personB.displayName} 앞에서 더 솔직하게 표현하고, ${input.personB.displayName}은 ${input.personA.displayName}을 통해 생각을 정리받는 느낌을 받을 수 있습니다.`,
    riskExpression: `나쁘게 흐르면 ${input.personA.displayName}의 표현은 날카로운 지적처럼 보이고, ${input.personB.displayName}은 ${input.personA.displayName}의 기준을 평가나 통제로 느낄 수 있습니다.`,
    everydayScene: `${input.personA.displayName}이 바로 의견을 꺼내면 ${input.personB.displayName}은 그 말의 의미와 전제를 정리하려 하고, 이 과정에서 말의 속도 차이가 생깁니다.`,
    actionRule:
      "표현이 먼저 나온 뒤에는 바로 평가하지 말고, 상대가 어떤 기준으로 받아들였는지 확인하는 순서가 필요합니다.",
    plainKoreanSummary:
      "한쪽은 표현을 꺼내고, 다른 한쪽은 그 표현에 의미와 기준을 붙이는 관계입니다.",
  };
}

function buildBranchTrineNote(
  input: BuildCompatibilityDeepSajuBridgeInput,
  relations: readonly CompatibilityBranchRelation[],
): CompatibilityDeepSajuNote | undefined {
  const trines = relations.filter(
    (relation) => relation.kind === "three_harmony",
  );

  if (trines.length === 0) {
    return undefined;
  }

  return {
    layer: "branch_trine",
    title: "지지 삼합",
    summary: `두 사람 원국을 합치면 ${relationLabels(trines)}이 잡혀 관계 안에서 새로운 흐름이 만들어질 수 있습니다.`,
    personARefs: trines.flatMap((relation) => refsByPerson(relation.refs, "personA")),
    personBRefs: trines.flatMap((relation) => refsByPerson(relation.refs, "personB")),
    relationLabel: relationLabels(trines),
    emotionalMeaning:
      "각자 따로 볼 때보다 둘이 함께 있을 때 생각과 감정의 흐름이 더 크게 이어질 수 있습니다.",
    practicalMeaning:
      "좋은 흐름도 자동으로 좋은 관계가 되는 것은 아니므로, 함께 몰입할 주제와 쉬는 시간을 분리해야 합니다.",
    scoreImpact: 3,
    principleExplanation:
      "삼합은 흩어진 지지가 모여 하나의 큰 오행 흐름을 만드는 구조입니다. 관계에서는 둘이 함께 있을 때 혼자 있을 때보다 특정 기운이 더 크게 살아나는 식으로 볼 수 있습니다. 申子辰의 수는 감정, 생각, 정보, 흐름, 이동성의 기운이고, 亥卯未의 목은 성장, 방향, 확장, 가능성의 기운입니다.",
    relationshipTranslation:
      "두 사람은 함께 있을 때 대화와 감정의 물길이 열리고, 동시에 미래 방향을 키우는 흐름도 생길 수 있습니다.",
    positiveExpression:
      "좋게 쓰이면 같이 공부하거나 이야기하거나 계획을 만들 때 관계가 빠르게 성장합니다.",
    riskExpression:
      "나쁘게 쓰이면 생각과 감정이 너무 길어져 결론이 늦어지거나, 미래 이야기가 부담으로 커질 수 있습니다.",
    everydayScene:
      "가볍게 시작한 대화가 어느새 관계의 방향, 미래, 생활 계획까지 이어지는 장면입니다.",
    actionRule:
      "깊은 대화와 결정은 분리하고, 몰입한 뒤에는 쉬는 시간을 둬야 합니다.",
    plainKoreanSummary:
      "둘이 함께 있으면 대화와 성장의 흐름이 커질 수 있지만, 생각이 길어지고 미래 이야기가 무거워질 수 있습니다.",
  };
}

function buildBranchPressureNote(input: {
  readonly layer: "branch_clash" | "branch_harm";
  readonly title: string;
  readonly relations: readonly CompatibilityBranchRelation[];
}): CompatibilityDeepSajuNote | undefined {
  if (input.relations.length === 0) {
    return undefined;
  }

  return {
    layer: input.layer,
    title: input.title,
    summary: `${relationLabels(input.relations)}가 있어 생활 리듬이 어긋날 때 작게 삐걱거릴 수 있습니다.`,
    personARefs: input.relations.flatMap((relation) =>
      refsByPerson(relation.refs, "personA"),
    ),
    personBRefs: input.relations.flatMap((relation) =>
      refsByPerson(relation.refs, "personB"),
    ),
    relationLabel: relationLabels(input.relations),
    emotionalMeaning:
      "충이나 해는 나쁨의 확정이 아니라, 가까워질수록 방식 차이가 빨리 드러나는 신호입니다.",
    practicalMeaning:
      "감정이 올라온 날에는 바로 결론을 내기보다 일정, 연락, 돈, 휴식 기준 중 무엇이 어긋났는지 먼저 분리하세요.",
    scoreImpact: -3,
    principleExplanation:
      input.layer === "branch_clash"
        ? "충은 정면으로 부딪히는 결입니다. 丑未는 둘 다 토의 성격이 있지만 방향이 다른 흙이 부딪히는 그림이라, 서로 안정감을 원해도 안정감을 만드는 방식이 다를 수 있습니다."
        : "해는 겉으로 크게 부딪히기보다 미묘한 피로가 쌓이는 결입니다. 申亥와 子未처럼 작게 어긋나는 결은 처음엔 별일 아닌 차이처럼 보여도 말하지 않고 넘기면 나중에 피로로 쌓일 수 있습니다.",
    relationshipTranslation:
      "두 사람은 큰 감정 싸움보다 생활 방식, 반응 속도, 일정/연락/휴식 기준에서 작게 삐걱거릴 수 있습니다.",
    positiveExpression:
      "좋게 쓰이면 서로의 생활 방식을 일찍 조율해 현실적인 관계 운영이 가능합니다.",
    riskExpression:
      "나쁘게 흐르면 “이 정도는 괜찮겠지” 하고 넘긴 작은 차이가 쌓여 갑자기 크게 느껴질 수 있습니다.",
    everydayScene:
      "한쪽은 이미 정리됐다고 느끼는 일을 다른 한쪽은 아직 마음에 남겨 두고, 시간이 지난 뒤 다시 꺼내는 장면입니다.",
    actionRule:
      "불편함이 작을 때 바로 상황 단위로 말하고, 사람 자체에 대한 평가로 키우지 말아야 합니다.",
    plainKoreanSummary:
      "크게 싸우기보다 작은 생활 차이가 쌓이기 쉬운 구조라, 작을 때 조율하는 게 중요합니다.",
  };
}

function buildSpousePalaceNote(input: {
  readonly personA: CompatibilityPersonChartSummary;
  readonly personB: CompatibilityPersonChartSummary;
  readonly relations: readonly CompatibilityBranchRelation[];
}): CompatibilityDeepSajuNote | undefined {
  const dayBranch = [
    getPillarBranch(input.personA.pillars.day),
    getPillarBranch(input.personB.pillars.day),
  ];
  const dayMonthRelations = input.relations.filter(
    (relation) =>
      relation.refs.some((ref) => ref.position === "day") &&
      relation.refs.some((ref) => ref.position === "month") &&
      (relation.kind === "clash" || relation.kind === "harm"),
  );

  if (dayMonthRelations.length === 0) {
    return undefined;
  }

  return {
    layer: "spouse_palace",
    title: "일지/배우자궁 관계",
    summary: `두 사람의 배우자궁 자체(${dayBranch.join("·")})가 정면으로 충돌하는 그림은 약하지만, 월지와 맞물리면 작은 방식 차이가 커질 수 있습니다.`,
    personARefs: dayMonthRelations.flatMap((relation) =>
      refsByPerson(relation.refs, "personA"),
    ),
    personBRefs: dayMonthRelations.flatMap((relation) =>
      refsByPerson(relation.refs, "personB"),
    ),
    relationLabel: relationLabels(dayMonthRelations),
    emotionalMeaning:
      "좋아하는 마음과 별개로 생활 리듬이나 반응 속도가 가까운 자리에서 민감하게 느껴질 수 있습니다.",
    practicalMeaning:
      "서운함을 성격 문제로 몰기 전에, 어떤 생활 기준이 부딪혔는지 먼저 이름 붙여야 합니다.",
    scoreImpact: -2,
    principleExplanation:
      "일지는 관계에서 가까운 자리와 배우자궁의 반응을 볼 때 중요합니다. 일지 자체보다 월지와 맞물린 충·해가 있으면 가까운 관계에서 생활 방식 차이가 더 민감하게 느껴질 수 있습니다.",
    relationshipTranslation:
      "두 사람은 마음이 맞아도 일상 리듬이나 반응 방식이 가까운 자리에서 크게 느껴질 수 있습니다.",
    positiveExpression:
      "좋게 쓰이면 가까워지기 전에 서로의 생활 기준을 조기에 맞출 수 있습니다.",
    riskExpression:
      "나쁘게 흐르면 작은 생활 차이를 상대의 성격 문제로 받아들여 서운함이 오래 남을 수 있습니다.",
    everydayScene:
      "한쪽은 쉬고 싶어서 말을 줄였는데, 다른 한쪽은 마음이 식었다고 느끼는 장면입니다.",
    actionRule:
      "서운함을 말할 때는 사람 평가가 아니라 일정, 연락, 휴식 같은 생활 기준부터 확인해야 합니다.",
    plainKoreanSummary:
      "가까워질수록 생활 기준 차이가 더 민감해질 수 있어 미리 이름 붙여야 합니다.",
  };
}

function buildMonthRhythmNote(
  relations: readonly CompatibilityBranchRelation[],
): CompatibilityDeepSajuNote | undefined {
  const monthRelations = relations.filter(
    (relation) =>
      hasMonthRef([relation]) &&
      (relation.kind === "clash" ||
        relation.kind === "harm" ||
        isBranchTrineRelation(relation)),
  );

  if (monthRelations.length === 0) {
    return undefined;
  }

  return {
    layer: "month_rhythm",
    title: "월지/생활 리듬 관계",
    summary: `월지와 맞물린 ${relationLabels(monthRelations)} 때문에 데이트, 일상, 사회 리듬을 맞추는 방식이 중요합니다.`,
    personARefs: monthRelations.flatMap((relation) =>
      refsByPerson(relation.refs, "personA"),
    ),
    personBRefs: monthRelations.flatMap((relation) =>
      refsByPerson(relation.refs, "personB"),
    ),
    relationLabel: relationLabels(monthRelations),
    emotionalMeaning:
      "감정보다 일정과 생활 방식의 작은 차이가 먼저 관계 온도에 영향을 줄 수 있습니다.",
    practicalMeaning:
      "약속 변경, 연락 기준, 쉬는 시간을 감정이 상하기 전에 미리 정해 두세요.",
    scoreImpact: -1,
    principleExplanation:
      "월지는 사회 리듬과 생활 리듬을 보는 자리입니다. 월지와 맞물린 합·충·해는 두 사람이 일상 운영 방식을 어떻게 맞추는지에 영향을 줍니다.",
    relationshipTranslation:
      "두 사람에게는 감정 표현보다 데이트 시간, 연락 기준, 쉬는 방식 같은 생활 리듬 조율이 먼저 체감될 수 있습니다.",
    positiveExpression:
      "좋게 쓰이면 관계를 감정 기복보다 운영 규칙으로 안정시킬 수 있습니다.",
    riskExpression:
      "나쁘게 흐르면 약속이나 연락처럼 작은 일상이 관계 온도를 크게 흔들 수 있습니다.",
    everydayScene:
      "한쪽은 일정 변경을 실무적인 조정으로 보는데, 다른 한쪽은 배려가 줄었다고 느끼는 장면입니다.",
    actionRule:
      "생활 리듬은 암묵적으로 맞추려 하지 말고, 변경 기준과 쉬는 시간을 미리 합의해야 합니다.",
    plainKoreanSummary:
      "감정보다 생활 운영 방식이 먼저 부딪히거나 맞아떨어질 수 있습니다.",
  };
}

function buildHourLifeRhythmNote(
  relations: readonly CompatibilityBranchRelation[],
): CompatibilityDeepSajuNote | undefined {
  const hourRelations = relations.filter((relation) => hasHourRef([relation]));

  if (hourRelations.length === 0) {
    return undefined;
  }

  return {
    layer: "hour_life_rhythm",
    title: "시주/생활 후반 리듬",
    summary: `시지가 ${relationLabels(hourRelations)}에 걸려 있어 생활 후반, 회복, 미래 계획을 함께 맞추는 방식도 봐야 합니다.`,
    personARefs: hourRelations.flatMap((relation) =>
      refsByPerson(relation.refs, "personA"),
    ),
    personBRefs: hourRelations.flatMap((relation) =>
      refsByPerson(relation.refs, "personB"),
    ),
    relationLabel: relationLabels(hourRelations),
    emotionalMeaning:
      "처음 끌림보다 오래 반복되는 생활 방식에서 관계의 피로도나 안정감이 갈릴 수 있습니다.",
    practicalMeaning:
      "미래 계획은 한 번에 확정하지 말고, 생활 실험을 해 본 뒤 조정하는 방식이 맞습니다.",
    scoreImpact: 1,
    principleExplanation:
      "시주는 생활 후반, 반복되는 회복 방식, 미래 계획을 볼 때 참고하는 자리입니다. 시지가 관계 구조에 걸리면 오래 반복되는 생활 방식도 궁합 해석에 포함해야 합니다.",
    relationshipTranslation:
      "두 사람은 초반 끌림보다 시간이 지난 뒤 쉬는 방식, 미래 계획, 반복 루틴에서 안정감이 갈릴 수 있습니다.",
    positiveExpression:
      "좋게 쓰이면 미래 계획을 함께 실험하며 현실적인 합의로 발전시킬 수 있습니다.",
    riskExpression:
      "나쁘게 흐르면 아직 살아 보지 않은 미래 계획을 너무 빨리 확정하려다 부담이 커질 수 있습니다.",
    everydayScene:
      "주말을 어떻게 보내는지, 회복 시간을 얼마나 확보하는지 같은 반복 루틴에서 차이가 드러나는 장면입니다.",
    actionRule:
      "미래 계획은 선언보다 짧은 생활 실험으로 확인하고, 맞지 않는 부분은 주기적으로 조정해야 합니다.",
    plainKoreanSummary:
      "오래 갈수록 미래 계획보다 반복되는 생활 루틴을 맞추는 일이 중요해집니다.",
  };
}

function compactNotes(
  notes: readonly (CompatibilityDeepSajuNote | undefined)[],
): readonly CompatibilityDeepSajuNote[] {
  return notes.filter((note): note is CompatibilityDeepSajuNote => note !== undefined);
}

export function buildCompatibilityDeepSajuBridge(
  input: BuildCompatibilityDeepSajuBridgeInput,
): CompatibilityDeepSajuBridgeResult {
  const personARefs = createBranchRefs(input.personA);
  const personBRefs = createBranchRefs(input.personB);
  const branchRelations = detectCrossBranchRelations({
    personARefs,
    personBRefs,
  });
  const clashes = branchRelations.filter((relation) => relation.kind === "clash");
  const harms = branchRelations.filter((relation) => relation.kind === "harm");
  const dayMasterRelation = buildDayMasterRelationNote(input);
  const crossTenGod = buildCrossTenGodNote(input);
  const elementComplement = buildElementComplementNote(input);
  const combinedClimate = buildCombinedClimateNote(input);
  const branchTrine = buildBranchTrineNote(input, branchRelations);
  const branchClash = buildBranchPressureNote({
    layer: "branch_clash",
    title: "지지 충",
    relations: clashes,
  });
  const branchHarm = buildBranchPressureNote({
    layer: "branch_harm",
    title: "지지 해",
    relations: harms,
  });
  const spousePalace = buildSpousePalaceNote({
    personA: input.personA,
    personB: input.personB,
    relations: branchRelations,
  });
  const monthRhythm = buildMonthRhythmNote(branchRelations);
  const hourLifeRhythm = buildHourLifeRhythmNote(branchRelations);
  const notes = compactNotes([
    dayMasterRelation,
    crossTenGod,
    elementComplement,
    combinedClimate,
    branchTrine,
    branchClash,
    branchHarm,
    spousePalace,
    monthRhythm,
    hourLifeRhythm,
  ]);

  return {
    notes,
    attractionNotes: compactNotes([dayMasterRelation, crossTenGod, branchTrine]),
    frictionNotes: compactNotes([branchClash, branchHarm, spousePalace]),
    lifestyleNotes: compactNotes([combinedClimate, monthRhythm, hourLifeRhythm]),
    communicationNotes: compactNotes([crossTenGod, monthRhythm]),
  };
}
