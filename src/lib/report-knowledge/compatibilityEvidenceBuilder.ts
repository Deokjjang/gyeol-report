import { buildCompatibilityMbtiBridge } from "./compatibilityMbtiBridge";
import type { CompatibilityMbtiBridgeResult } from "./compatibilityMbtiBridge";
import { buildCompatibilitySajuBridge } from "./compatibilitySajuBridge";
import type { CompatibilitySajuBridgeResult } from "./compatibilitySajuBridge";
import type { CompatibilityDeepSajuBridgeResult } from "./compatibilityDeepSajuBridge";
import { scoreCompatibility } from "./compatibilityScoreEngine";
import {
  requireCompatibilityFixture,
  type CompatibilityFixture,
} from "./compatibilityFixtureMatrix";
import type {
  CompatibilityBridgeCompatibility,
  CompatibilityCanonicalRelationshipType,
  CompatibilityCategoryLens,
  CompatibilityDirectFinding,
  CompatibilityEvidenceItem,
  CompatibilityEvidenceSection,
  CompatibilityInput,
  CompatibilityMbtiCompatibility,
  CompatibilityEvidenceParticipant,
  CompatibilityPersonChartSummary,
  CompatibilityPersonInput,
  CompatibilityPillars,
  CompatibilityRelationshipType,
  CompatibilitySajuCompatibility,
  CompatibilityScoreResult,
} from "./compatibilityTypes";
import {
  getCompatibilityRelationshipTypeFocus,
  normalizeCompatibilityRelationCategory,
} from "./compatibilityTypes";
import {
  getMbtiRelationshipPair,
  type MbtiRelationshipPair,
} from "./mbti/sourceRuntimeAdapter";
import { isMbtiTypeCode } from "./mbtiTypeKnowledgeBase";
import {
  getSajuFeatureDisplayPolicy,
  shouldShowFeatureInNarrative,
} from "./sajuFeatureDisplayPolicy";
import { mapComputedSajuFactsToFeatureIds } from "./sajuComputedFactsMapper";
import type { ComputedSajuFacts } from "./sajuComputedFactsTypes";
import { requireSajuFeatureEntry } from "./sajuFeatureTaxonomy";

export type BuildCompatibilityEvidenceInput = {
  readonly input: CompatibilityInput;
  readonly personASajuFacts: ComputedSajuFacts;
  readonly personBSajuFacts: ComputedSajuFacts;
  readonly expectedPillars?: {
    readonly personA: CompatibilityPillars;
    readonly personB: CompatibilityPillars;
  };
};

export type CompatibilityEvidencePacket = {
  readonly productType: CompatibilityInput["productType"];
  readonly relationshipType: CompatibilityCanonicalRelationshipType;
  readonly participants: {
    readonly a: CompatibilityEvidenceParticipant;
    readonly b: CompatibilityEvidenceParticipant;
  };
  readonly sajuCompatibility: CompatibilitySajuCompatibility;
  readonly mbtiCompatibility: CompatibilityMbtiCompatibility;
  readonly bridgeCompatibility: CompatibilityBridgeCompatibility;
  readonly categoryLens: CompatibilityCategoryLens;
  readonly directFindings: readonly CompatibilityDirectFinding[];
  readonly strengths: readonly string[];
  readonly frictionPoints: readonly string[];
  readonly repairStrategies: readonly string[];
  readonly safetyNotes: readonly string[];
  readonly input: CompatibilityInput;
  readonly personAChartSummary: CompatibilityPersonChartSummary;
  readonly personBChartSummary: CompatibilityPersonChartSummary;
  readonly sajuBridge: CompatibilitySajuBridgeResult;
  readonly deepSajuBridge?: CompatibilityDeepSajuBridgeResult;
  readonly mbtiBridge: CompatibilityMbtiBridgeResult;
  readonly score: CompatibilityScoreResult;
  readonly evidenceBySection: Record<
    CompatibilityEvidenceSection,
    readonly CompatibilityEvidenceItem[]
  >;
  readonly warnings: readonly string[];
};

const compatibilitySections = [
  "overview",
  "two_charts",
  "attraction",
  "strengths",
  "frictions",
  "communication",
  "relationship_scenes",
  "long_term",
  "money_lifestyle",
  "conflict_recovery",
  "final_advice",
] as const satisfies readonly CompatibilityEvidenceSection[];

function toPillars(
  facts: ComputedSajuFacts,
  expected?: CompatibilityPillars,
): CompatibilityPillars {
  return {
    year: expected?.year ?? facts.yearPillar ?? "-",
    month: expected?.month ?? facts.monthPillar ?? "-",
    day: expected?.day ?? facts.dayPillar ?? "-",
    hour: expected?.hour ?? facts.hourPillar,
  };
}

function normalizeMbti(value: string | null | undefined): CompatibilityPersonChartSummary["mbti"] {
  if (value === undefined || value === null) {
    return undefined;
  }

  const upper = value.toUpperCase();
  return isMbtiTypeCode(upper) ? upper : undefined;
}

function buildChartSummary(input: {
  readonly person: CompatibilityPersonInput;
  readonly facts: ComputedSajuFacts;
  readonly expectedPillars?: CompatibilityPillars;
}): CompatibilityPersonChartSummary {
  const mapped = mapComputedSajuFactsToFeatureIds(input.facts);
  const visibleFeatures = mapped.featureIds
    .map((featureId) => ({
      featureId,
      entry: requireSajuFeatureEntry(featureId),
    }))
    .filter(({ featureId }) => shouldShowFeatureInNarrative(featureId));
  const diagnosticFeatureLabels = mapped.featureIds
    .map((featureId) => ({
      featureId,
      entry: requireSajuFeatureEntry(featureId),
    }))
    .filter(
      ({ featureId }) =>
        getSajuFeatureDisplayPolicy(featureId)?.visibility === "diagnostic",
    )
    .map(({ entry }) => entry.labelKo);

  return {
    role: input.person.role,
    displayName: input.person.displayName,
    mbti: normalizeMbti(input.person.mbti),
    birthTimeConfidence: input.person.birthTimeKnown ? "known" : "unknown",
    pillars: toPillars(input.facts, input.expectedPillars),
    dayMaster: input.facts.dayMaster,
    dayPillar: input.facts.dayPillar,
    featureIds: visibleFeatures.map(({ featureId }) => featureId),
    featureLabels: visibleFeatures.map(({ entry }) => entry.labelKo),
    diagnosticFeatureLabels,
    sajuFacts: input.facts,
  };
}

function buildWarnings(input: {
  readonly compatibilityInput: CompatibilityInput;
  readonly personA: CompatibilityPersonChartSummary;
  readonly personB: CompatibilityPersonChartSummary;
}): readonly string[] {
  const warnings: string[] = [];

  if (!input.compatibilityInput.personA.birthTimeKnown) {
    warnings.push("personA birth time unknown");
  }
  if (!input.compatibilityInput.personB.birthTimeKnown) {
    warnings.push("personB birth time unknown");
  }
  if (input.personA.mbti === undefined) {
    warnings.push("personA MBTI missing");
  }
  if (input.personB.mbti === undefined) {
    warnings.push("personB MBTI missing");
  }
  if (
    input.personA.diagnosticFeatureLabels.length > 0 ||
    input.personB.diagnosticFeatureLabels.length > 0
  ) {
    warnings.push("diagnostic features excluded");
  }

  return warnings.length === 0 ? ["none"] : warnings;
}

function groupEvidenceBySection(
  items: readonly CompatibilityEvidenceItem[],
): Record<CompatibilityEvidenceSection, readonly CompatibilityEvidenceItem[]> {
  const grouped: Record<CompatibilityEvidenceSection, readonly CompatibilityEvidenceItem[]> = {
    overview: [],
    two_charts: [],
    attraction: [],
    strengths: [],
    frictions: [],
    communication: [],
    relationship_scenes: [],
    long_term: [],
    money_lifestyle: [],
    conflict_recovery: [],
    final_advice: [],
  };

  for (const section of compatibilitySections) {
    grouped[section] = items.filter((item) => item.section === section);
  }

  return grouped;
}

function unique(values: readonly (string | null | undefined)[]): readonly string[] {
  return [...new Set(values.filter((value): value is string => Boolean(value?.trim())))];
}

function buildParticipant(input: {
  readonly label: "A" | "B";
  readonly person: CompatibilityPersonInput;
  readonly chartSummary: CompatibilityPersonChartSummary;
}): CompatibilityEvidenceParticipant {
  return {
    role: input.person.role,
    label: input.label,
    name: input.person.displayName,
    gender: input.person.gender,
    mbtiType: input.chartSummary.mbti ?? null,
    dayMaster: input.chartSummary.dayMaster,
    dayPillar: input.chartSummary.dayPillar,
    pillars: input.chartSummary.pillars,
    sajuFacts: input.chartSummary.sajuFacts,
  };
}

const earthlyBranchChars = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"] as const;

function extractPillarBranches(pillars: CompatibilityPillars): ReadonlySet<string> {
  return new Set(
    [pillars.year, pillars.month, pillars.day, pillars.hour]
      .flatMap((pillar) =>
        pillar === undefined
          ? []
          : earthlyBranchChars.filter((branch) => pillar.includes(branch)),
      ),
  );
}

function isSupportedBranchRelationLabel(
  label: string,
  supportedBranches: ReadonlySet<string>,
): boolean {
  const labelBranches = earthlyBranchChars.filter((branch) => label.includes(branch));

  return (
    labelBranches.length === 0 ||
    labelBranches.every((branch) => supportedBranches.has(branch))
  );
}

function buildSajuCompatibility(input: {
  readonly personA: CompatibilityPersonChartSummary;
  readonly personB: CompatibilityPersonChartSummary;
  readonly sajuBridge: CompatibilitySajuBridgeResult;
  readonly deepSajuBridge?: CompatibilityDeepSajuBridgeResult;
}): CompatibilitySajuCompatibility {
  const notes = input.deepSajuBridge?.notes ?? [];
  const dayMaster = notes.find((note) => note.layer === "day_master_relation");
  const tenGod = notes.find((note) => note.layer === "cross_ten_god");
  const dayBranch = notes.find((note) => note.layer === "spouse_palace");
  const elementNotes = notes.filter((note) =>
    ["combined_element_climate", "element_complement"].includes(note.layer),
  );
  const branchRelationNotes = notes.filter((note) =>
    ["branch_trine", "branch_clash", "branch_harm", "spouse_palace"].includes(
      note.layer,
    ),
  );
  const supportedBranches = new Set([
    ...extractPillarBranches(input.personA.pillars),
    ...extractPillarBranches(input.personB.pillars),
  ]);
  const branchInteractions = unique(
    branchRelationNotes
      .map((note) => note.relationLabel)
      .filter((label) => isSupportedBranchRelationLabel(label, supportedBranches)),
  );
  const gwiinSupport = unique(
    [...input.personA.featureLabels, ...input.personB.featureLabels].filter((label) =>
      label.includes("귀인"),
    ),
  );
  const sinsalFriction = unique(
    [...input.personA.featureLabels, ...input.personB.featureLabels].filter(
      (label) => label.endsWith("살") && !label.includes("귀인"),
    ),
  );

  return {
    dayMasterRelation: dayMaster?.plainKoreanSummary ?? dayMaster?.summary ?? null,
    dayBranchRelation: dayBranch?.plainKoreanSummary ?? dayBranch?.summary ?? null,
    elementBalance: unique([
      ...input.sajuBridge.complementaryElementNotes,
      ...elementNotes.map((note) => note.plainKoreanSummary),
    ]),
    tenGodRelation: tenGod?.plainKoreanSummary ?? tenGod?.summary ?? null,
    branchInteractions,
    supportSignals: unique([
      ...input.sajuBridge.attractionNotes,
      ...input.sajuBridge.longTermNotes,
      ...input.sajuBridge.complementaryElementNotes,
      ...gwiinSupport.map((label) => `${label}은 관계의 완충과 도움 신호로만 참고합니다.`),
    ]),
    frictionSignals: unique([
      ...input.sajuBridge.frictionNotes,
      ...notes
        .filter((note) => note.scoreImpact < 0)
        .map((note) => note.riskExpression),
      ...sinsalFriction.map((label) => `${label}은 가까워질수록 말과 반응을 조심할 신호입니다.`),
    ]),
    roleBalance: tenGod?.practicalMeaning ?? null,
    gwiinSupport,
    sinsalFriction,
    timingHints: unique(
      notes
        .filter((note) => ["month_rhythm", "hour_life_rhythm"].includes(note.layer))
        .map((note) => note.actionRule),
    ),
  };
}

function findMbtiRelationshipPair(
  aType: string | null | undefined,
  bType: string | null | undefined,
): MbtiRelationshipPair | null {
  return (
    getMbtiRelationshipPair(aType, bType) ??
    getMbtiRelationshipPair(bType, aType)
  );
}

function buildMbtiCompatibility(input: {
  readonly personA: CompatibilityPersonChartSummary;
  readonly personB: CompatibilityPersonChartSummary;
  readonly mbtiBridge: CompatibilityMbtiBridgeResult;
}): CompatibilityMbtiCompatibility {
  const pair = findMbtiRelationshipPair(input.personA.mbti, input.personB.mbti);
  const hasA = input.personA.mbti !== undefined;
  const hasB = input.personB.mbti !== undefined;

  if (pair !== null) {
    return {
      aType: input.personA.mbti ?? null,
      bType: input.personB.mbti ?? null,
      sharedGround: pair.sharedGround,
      friction: pair.friction,
      positiveInfluence: pair.positiveInfluence,
      communicationPattern: input.mbtiBridge.communicationNotes,
      repairStrategy: pair.repairStrategy,
      pairLabel: input.mbtiBridge.pairLabel,
      reportLine: pair.reportLine,
      source: "notablePairs",
    };
  }

  return {
    aType: input.personA.mbti ?? null,
    bType: input.personB.mbti ?? null,
    sharedGround: input.mbtiBridge.sharedTraits,
    friction: input.mbtiBridge.frictionRisks,
    positiveInfluence: input.mbtiBridge.complementaryTraits,
    communicationPattern: input.mbtiBridge.communicationNotes,
    repairStrategy: input.mbtiBridge.conflictRecoveryNotes,
    pairLabel: hasA || hasB ? input.mbtiBridge.pairLabel : null,
    reportLine: null,
    source: hasA && hasB ? "fallback" : hasA || hasB ? "partial" : "unknown",
  };
}

function buildBridgeCompatibility(input: {
  readonly sajuCompatibility: CompatibilitySajuCompatibility;
  readonly mbtiCompatibility: CompatibilityMbtiCompatibility;
}): CompatibilityBridgeCompatibility {
  return {
    agreementSignals: unique([
      input.sajuCompatibility.dayMasterRelation,
      ...input.sajuCompatibility.supportSignals.slice(0, 2),
      ...input.mbtiCompatibility.positiveInfluence.slice(0, 2),
    ]),
    tensionSignals: unique([
      input.sajuCompatibility.tenGodRelation,
      ...input.sajuCompatibility.frictionSignals.slice(0, 2),
      ...input.mbtiCompatibility.friction.slice(0, 2),
    ]),
    amplificationSignals: unique([
      input.mbtiCompatibility.reportLine,
      input.sajuCompatibility.roleBalance,
    ]),
    cautionSignals: unique([
      ...input.sajuCompatibility.branchInteractions,
      ...input.mbtiCompatibility.repairStrategy.slice(0, 2),
    ]),
    interpretationMode:
      "명리는 두 사람 사이에서 반복되는 구조를 보고, MBTI는 그 구조가 대화와 행동으로 드러나는 방식을 보조 근거로만 사용합니다.",
  };
}

function buildCategoryLens(
  relationshipType: CompatibilityCanonicalRelationshipType,
): CompatibilityCategoryLens {
  const lensByCategory = {
    love: {
      focus: ["끌림", "감정 표현", "속도", "갈등 회복"],
      strengthFocus: "서로에게 끌리는 지점과 대화 온도를 먼저 본다.",
      frictionFocus: "속도 차이와 애정 확인 방식이 피로로 바뀌는 지점을 본다.",
      repairFocus: "감정이 올라온 뒤 바로 결론을 내지 않고 다시 말할 순서를 둔다.",
      safetyFocus: "관계의 결말을 단정하지 않고 현재 조율 포인트만 본다.",
    },
    marriage: {
      focus: ["생활 리듬", "돈", "역할 분담", "장기 책임"],
      strengthFocus: "장기 생활에서 서로 맡을 역할과 안정감을 본다.",
      frictionFocus: "돈, 집안일, 가족 책임이 한쪽으로 몰리는 지점을 본다.",
      repairFocus: "역할·예산·일정을 숫자와 문서로 맞춘다.",
      safetyFocus: "결혼 여부나 장기 결과를 단정하지 않는다.",
    },
    parentChild: {
      focus: ["권위", "기대", "정서 안전감", "독립성"],
      strengthFocus: "서로에게 안정감과 기준을 주는 방식을 본다.",
      frictionFocus: "기대와 통제가 섞여 말의 통로가 막히는 지점을 본다.",
      repairFocus: "역할보다 감정 확인과 경계선을 먼저 정리한다.",
      safetyFocus: "가족 관계를 좋고 나쁨으로 판정하지 않는다.",
    },
    coworker: {
      focus: ["업무 속도", "피드백", "책임 범위", "협업 피로"],
      strengthFocus: "같이 일할 때 역할과 속도가 맞는 지점을 본다.",
      frictionFocus: "확인 주기, 피드백 온도, 책임 경계가 흐려지는 지점을 본다.",
      repairFocus: "작업 기준과 승인선을 먼저 맞춘다.",
      safetyFocus: "성과나 평판을 보장하지 않는다.",
    },
    managerReport: {
      focus: ["지시/평가", "권한 거리", "피드백 수용성", "신뢰 관리"],
      strengthFocus: "권한과 책임이 맞을 때 신뢰가 생기는 지점을 본다.",
      frictionFocus: "지시가 통제로, 피드백이 공격으로 들리는 지점을 본다.",
      repairFocus: "기대치, 보고 주기, 피드백 형식을 분리한다.",
      safetyFocus: "승진, 평가, 조직 결과를 예언하지 않는다.",
    },
    businessPartner: {
      focus: ["돈", "리스크", "의사결정", "신뢰 경계"],
      strengthFocus: "역할과 자원이 맞을 때 성과로 이어지는 지점을 본다.",
      frictionFocus: "돈, 권한, 결정권이 흐려질 때 피로가 커지는 지점을 본다.",
      repairFocus: "투입 한도, 회수 기준, 결정권을 문서로 남긴다.",
      safetyFocus: "수익이나 사업 결과를 보장하지 않는다.",
    },
    friendship: {
      focus: ["거리감", "의리", "감정 부담", "오래 가는 리듬"],
      strengthFocus: "서로 부담 없이 오래 가는 거리와 도움 방식을 본다.",
      frictionFocus: "의리와 간섭, 무심함과 거리감이 헷갈리는 지점을 본다.",
      repairFocus: "도움의 범위와 연락 리듬을 가볍게 정한다.",
      safetyFocus: "친구 관계를 좋고 나쁨으로 판정하지 않는다.",
    },
  } as const satisfies Record<
    CompatibilityCanonicalRelationshipType,
    Omit<CompatibilityCategoryLens, "relationshipType">
  >;

  return {
    relationshipType,
    ...lensByCategory[relationshipType],
  };
}

function buildDirectFindings(input: {
  readonly score: CompatibilityScoreResult;
  readonly sajuCompatibility: CompatibilitySajuCompatibility;
  readonly mbtiCompatibility: CompatibilityMbtiCompatibility;
  readonly bridgeCompatibility: CompatibilityBridgeCompatibility;
}): readonly CompatibilityDirectFinding[] {
  const strengthEvidence = unique([
    ...input.sajuCompatibility.supportSignals.slice(0, 2),
    ...input.mbtiCompatibility.positiveInfluence.slice(0, 2),
  ]);
  const frictionEvidence = unique([
    ...input.sajuCompatibility.frictionSignals.slice(0, 2),
    ...input.mbtiCompatibility.friction.slice(0, 2),
  ]);
  const repairEvidence = unique([
    ...input.mbtiCompatibility.repairStrategy.slice(0, 2),
    input.sajuCompatibility.roleBalance,
  ]);

  return [
    {
      type: "strength",
      intensity: input.score.totalScore >= 75 ? "high" : "medium",
      title: "잘 맞는 지점은 분명하지만 자동으로 굴러가지는 않습니다.",
      evidence: strengthEvidence,
      interpretation:
        "좋게 보면 보완이고, 현실적으로 보면 역할과 속도를 맞출 때 장점이 살아나는 조합입니다.",
      safeWording:
        "강점은 관계의 결론이 아니라 잘 써야 살아나는 재료로 봅니다.",
    },
    {
      type: "friction",
      intensity: frictionEvidence.length >= 2 ? "high" : "medium",
      title: "마찰은 성격 문제가 아니라 처리 순서 차이에서 커질 수 있습니다.",
      evidence: frictionEvidence,
      interpretation:
        "한쪽은 바로 정리하려 하고 다른 쪽은 확인 시간이 필요할 수 있어, 대화 순서가 맞지 않으면 피로가 빨리 쌓입니다.",
      safeWording:
        "마찰은 관계 판정이 아니라 조율해야 할 반복 패턴으로만 봅니다.",
    },
    {
      type: "risk",
      intensity: input.bridgeCompatibility.cautionSignals.length >= 2 ? "high" : "medium",
      title: "경계와 책임을 흐리면 좋은 보완도 부담으로 바뀝니다.",
      evidence: input.bridgeCompatibility.cautionSignals,
      interpretation:
        "감정, 돈, 역할, 일정 중 하나라도 기준이 흐려지면 상대의 장점이 압박으로 체감될 수 있습니다.",
      safeWording:
        "위험 신호는 미래 예언이 아니라 미리 관리할 조건입니다.",
    },
    {
      type: "repair",
      intensity: repairEvidence.length >= 2 ? "high" : "medium",
      title: "회복은 감정 설득보다 기준 재정렬에서 빨라집니다.",
      evidence: repairEvidence,
      interpretation:
        "서로를 바꾸려 하기보다 말하는 순서, 책임 범위, 다시 확인할 시간을 정하면 관계 체감이 달라집니다.",
      safeWording:
        "유지 전략은 보장이 아니라 갈등 비용을 낮추는 실행 기준입니다.",
    },
  ];
}

function buildSafetyNotes(
  relationshipType: CompatibilityCanonicalRelationshipType,
): readonly string[] {
  const categoryLabel = getCompatibilityRelationshipTypeFocus(relationshipType);

  return [
    `이 리포트는 ${categoryLabel}을 중심으로 두 사람의 조율 지점을 정리한 참고 자료입니다.`,
    "명리 근거와 MBTI 근거는 서로 다른 언어이며, 같은 원인으로 단정하지 않습니다.",
    "관계의 최종 결론이나 상대의 선택을 대신 판단하지 않습니다.",
    "업무·사업 관계에서는 성과와 금전 결과를 확정하지 않습니다.",
    "의료, 법률, 사건 예측이 필요한 영역은 전문 판단을 우선합니다.",
  ];
}

export function buildCompatibilityEvidencePacket(
  input: BuildCompatibilityEvidenceInput,
): CompatibilityEvidencePacket {
  const relationCategory = normalizeCompatibilityRelationCategory(
    input.input.relationshipType,
  );
  const normalizedInput: CompatibilityInput = {
    ...input.input,
    relationshipType: relationCategory,
  };
  const personAChartSummary = buildChartSummary({
    person: normalizedInput.personA,
    facts: input.personASajuFacts,
    expectedPillars: input.expectedPillars?.personA,
  });
  const personBChartSummary = buildChartSummary({
    person: normalizedInput.personB,
    facts: input.personBSajuFacts,
    expectedPillars: input.expectedPillars?.personB,
  });
  const sajuBridge = buildCompatibilitySajuBridge({
    personA: personAChartSummary,
    personB: personBChartSummary,
  });
  const mbtiBridge = buildCompatibilityMbtiBridge({
    personA: normalizedInput.personA,
    personB: normalizedInput.personB,
  });
  const deepSajuBridge = sajuBridge.deepSajuBridge;
  const score: CompatibilityScoreResult = scoreCompatibility({
    sajuBridge,
    deepSajuBridge,
    mbtiBridge,
    relationshipType: relationCategory as CompatibilityRelationshipType,
    birthTimeConfidence: {
      personA: personAChartSummary.birthTimeConfidence,
      personB: personBChartSummary.birthTimeConfidence,
    },
  });
  const evidenceItems = [...sajuBridge.evidenceItems, ...mbtiBridge.evidenceItems];
  const participants = {
    a: buildParticipant({
      label: "A",
      person: normalizedInput.personA,
      chartSummary: personAChartSummary,
    }),
    b: buildParticipant({
      label: "B",
      person: normalizedInput.personB,
      chartSummary: personBChartSummary,
    }),
  } as const;
  const sajuCompatibility = buildSajuCompatibility({
    personA: personAChartSummary,
    personB: personBChartSummary,
    sajuBridge,
    deepSajuBridge,
  });
  const mbtiCompatibility = buildMbtiCompatibility({
    personA: personAChartSummary,
    personB: personBChartSummary,
    mbtiBridge,
  });
  const bridgeCompatibility = buildBridgeCompatibility({
    sajuCompatibility,
    mbtiCompatibility,
  });
  const categoryLens = buildCategoryLens(relationCategory);
  const directFindings = buildDirectFindings({
    score,
    sajuCompatibility,
    mbtiCompatibility,
    bridgeCompatibility,
  });

  return {
    productType: normalizedInput.productType,
    relationshipType: relationCategory,
    participants,
    sajuCompatibility,
    mbtiCompatibility,
    bridgeCompatibility,
    categoryLens,
    directFindings,
    strengths: directFindings
      .filter((finding) => finding.type === "strength")
      .map((finding) => finding.interpretation),
    frictionPoints: directFindings
      .filter((finding) => finding.type === "friction" || finding.type === "risk")
      .map((finding) => finding.interpretation),
    repairStrategies: directFindings
      .filter((finding) => finding.type === "repair")
      .map((finding) => finding.interpretation),
    safetyNotes: buildSafetyNotes(relationCategory),
    input: normalizedInput,
    personAChartSummary,
    personBChartSummary,
    sajuBridge,
    deepSajuBridge,
    mbtiBridge,
    score,
    evidenceBySection: groupEvidenceBySection(evidenceItems),
    warnings: buildWarnings({
      compatibilityInput: normalizedInput,
      personA: personAChartSummary,
      personB: personBChartSummary,
    }),
  };
}

export function buildCompatibilityEvidencePacketFromFixture(
  fixture: CompatibilityFixture,
): CompatibilityEvidencePacket {
  return buildCompatibilityEvidencePacket({
    input: fixture.input,
    personASajuFacts: fixture.personASajuFacts,
    personBSajuFacts: fixture.personBSajuFacts,
    expectedPillars: fixture.expectedPillars,
  });
}

export function buildCompatibilityEvidencePacketFromFixtureId(
  fixtureId: string,
): CompatibilityEvidencePacket {
  return buildCompatibilityEvidencePacketFromFixture(
    requireCompatibilityFixture(fixtureId),
  );
}
