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
    relationLabel: "mutual element complement",
    emotionalMeaning:
      "서로에게 없는 온도, 완충, 방향, 정리 감각을 상대가 일부 채워 줄 수 있습니다.",
    practicalMeaning:
      "상대가 내 빈칸을 대신 책임져 준다고 보기보다, 서로의 강한 영역을 역할로 나누는 편이 좋습니다.",
    scoreImpact: 4,
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
