import { calculateSaju } from "../saju/calculateSaju";
import type {
  ElementLabel,
  FiveElement as SajuCalcElement,
  Gender as SajuCalcGender,
  HeavenlyStem,
  SajuCalcResult,
  TenGod as SajuCalcTenGod,
} from "../saju/types";
import {
  buildCompatibilityEvidencePacket,
  type CompatibilityEvidencePacket,
} from "../report-knowledge/compatibilityEvidenceBuilder";
import {
  getCompatibilityRelationshipTypeFocus,
  getCompatibilityRelationshipTypeLabel,
  normalizeCompatibilityRelationCategory,
  type CompatibilityInput,
  type CompatibilityPersonInput,
} from "../report-knowledge/compatibilityTypes";
import type {
  ComputedSajuFacts,
  ComputedSajuSpecialPatternId,
  ComputedSinsalId,
  KoreanEarthlyBranch,
  KoreanGanji,
  KoreanHeavenlyStem,
} from "../report-knowledge/sajuComputedFactsTypes";
import type { FiveElement, TenGod } from "../report-knowledge/sajuKnowledgeTypes";
import {
  COMPATIBILITY_REPORT_CHAPTER_IDS,
  type CompatibilityReportChapterId,
  type CompatibilityReportDraft,
} from "./compatibilityReportDraftTypes";
import {
  validateCompatibilityReportDraft,
} from "./compatibilityReportDraftValidator";
import {
  generateCompatibilityReportDraft,
  type CompatibilityReportWriterResult,
} from "./openaiCompatibilityReportWriter";
import {
  deriveAllowedCompatibilityMbtiTerms,
  deriveAllowedCompatibilitySajuTerms,
} from "./openaiCompatibilityReportWriterPrompt";
import type { OpenAIReportWriterClientConfig } from "./openaiReportWriterClient";
import type { CompatibilityGenerationInput } from "./reportInputAdapter";

export type CompatibilityGenerationErrorCode =
  | "COMPATIBILITY_GENERATION_FAILED"
  | "COMPATIBILITY_DRAFT_INVALID"
  | "INVALID_REPORT_INPUT";

export type CompatibilityGenerationResult =
  | {
      readonly ok: true;
      readonly kind: "compatibility";
      readonly draft: CompatibilityReportDraft;
      readonly evidencePacket: CompatibilityEvidencePacket;
    }
  | {
      readonly ok: false;
      readonly kind: "compatibility";
      readonly error: {
        readonly code: CompatibilityGenerationErrorCode;
        readonly message: string;
      };
    };

export type CompatibilityGenerationHandlerOptions = {
  readonly writer?: {
    readonly enabled: boolean;
    readonly config?: OpenAIReportWriterClientConfig;
  };
};

const stemKoByHanja = {
  甲: "갑",
  乙: "을",
  丙: "병",
  丁: "정",
  戊: "무",
  己: "기",
  庚: "경",
  辛: "신",
  壬: "임",
  癸: "계",
} as const satisfies Record<HeavenlyStem, KoreanHeavenlyStem>;

const branchKoByHanja = {
  子: "자",
  丑: "축",
  寅: "인",
  卯: "묘",
  辰: "진",
  巳: "사",
  午: "오",
  未: "미",
  申: "신",
  酉: "유",
  戌: "술",
  亥: "해",
} as const satisfies Record<string, KoreanEarthlyBranch>;

const elementBySajuElement = {
  WOOD: "wood",
  FIRE: "fire",
  EARTH: "earth",
  METAL: "metal",
  WATER: "water",
} as const satisfies Record<SajuCalcElement, FiveElement>;

const tenGodBySajuTenGod = {
  比肩: "bijian",
  劫財: "jie_cai",
  食神: "shi_shen",
  傷官: "shang_guan",
  偏財: "pian_cai",
  正財: "zheng_cai",
  偏官: "qi_sha",
  正官: "zheng_guan",
  偏印: "pian_yin",
  正印: "zheng_yin",
} as const satisfies Record<SajuCalcTenGod, TenGod>;

const specialPatternByStructureCode: Partial<
  Record<string, ComputedSajuSpecialPatternId>
> = {
  WEAK_DAYMASTER_WITH_STRONG_WEALTH: "jaeda_sinyak",
  WEAK_DAYMASTER_WITH_STRONG_OUTPUT: "no_resource",
  WEAK_DAYMASTER_WITH_STRONG_OFFICER: "weak_day_master",
  MIXED_OFFICER_KILLING: "gwansal_mixed",
  OUTPUT_GENERATES_WEALTH: "siksang_saengjae",
  WEALTH_GENERATES_OFFICER: "jaesaenggwan",
  RESOURCE_SUPPORTS_DAYMASTER: "salin_sangsaeng",
};

const sinsalByCode: Partial<Record<string, ComputedSinsalId>> = {
  HYEONCHIMSAL: "hyeonchim",
  HONGYEOMSAL: "hongyeom",
  BAEKHODAESAL: "baekho",
  MANGSINSAL: "mangsin",
  YEOKMASAL: "yeokma",
  DOHWASAL: "dohwa",
  HWAGAE: "hwagae",
  TWELVE_MANGSINSAL: "mangsin",
  TWELVE_WOLSAL: "wolsal",
  TWELVE_JANGSEONGSAL: "jangseong",
  TWELVE_BANANSAL: "banan",
  TWELVE_YEOKMASAL: "yeokma",
  TWELVE_HWAGAE: "hwagae",
};

export async function generateCompatibilityProductDraft(
  input: CompatibilityGenerationInput,
  options: CompatibilityGenerationHandlerOptions = {},
): Promise<CompatibilityGenerationResult> {
  if (input.kind !== "compatibility") {
    return compatibilityFailure({
      code: "INVALID_REPORT_INPUT",
      message: "Compatibility generation requires compatibility input.",
    });
  }

  let evidencePacket: CompatibilityEvidencePacket;
  try {
    evidencePacket = buildCompatibilityEvidenceFromGenerationInput(input);
  } catch (error) {
    return compatibilityFailure({
      code: "COMPATIBILITY_GENERATION_FAILED",
      message: getErrorMessage(error),
    });
  }

  let draftResult: CompatibilityReportWriterResult;
  try {
    draftResult =
      options.writer?.enabled === true && options.writer.config !== undefined
        ? await generateCompatibilityReportDraft({
            evidencePacket,
            config: options.writer.config,
          })
        : {
            draft: buildCompatibilityFallbackDraft(evidencePacket),
            model: "local-compatibility-fallback",
            repaired: false,
          };
  } catch (error) {
    return compatibilityFailure({
      code: "COMPATIBILITY_GENERATION_FAILED",
      message: getErrorMessage(error),
    });
  }

  const validation = validateCompatibilityReportDraft(draftResult.draft, {
    allowedSajuTerms: deriveAllowedCompatibilitySajuTerms(evidencePacket),
    allowedMbtiTerms: deriveAllowedCompatibilityMbtiTerms(evidencePacket),
  });

  if (!validation.ok || validation.value === undefined) {
    return compatibilityFailure({
      code: "COMPATIBILITY_DRAFT_INVALID",
      message: validation.errors.join("; "),
    });
  }

  return {
    ok: true,
    kind: "compatibility",
    draft: validation.value,
    evidencePacket,
  };
}

function buildCompatibilityEvidenceFromGenerationInput(
  input: CompatibilityGenerationInput,
): CompatibilityEvidencePacket {
  const personAInput = toCompatibilityPersonInput("personA", input.personA);
  const personBInput = toCompatibilityPersonInput("personB", input.personB);
  const personASaju = calculateCompatibilitySaju(input.personA);
  const personBSaju = calculateCompatibilitySaju(input.personB);
  const compatibilityInput: CompatibilityInput = {
    productType: "saju_mbti_compatibility",
    productVersion: "1.0",
    relationshipType: input.relationshipType,
    personA: personAInput,
    personB: personBInput,
  };

  return buildCompatibilityEvidencePacket({
    input: compatibilityInput,
    personASajuFacts: toComputedSajuFacts(personASaju),
    personBSajuFacts: toComputedSajuFacts(personBSaju),
    expectedPillars: {
      personA: toCompatibilityPillars(personASaju),
      personB: toCompatibilityPillars(personBSaju),
    },
  });
}

function toCompatibilityPersonInput(
  role: CompatibilityPersonInput["role"],
  person: CompatibilityGenerationInput["personA"],
): CompatibilityPersonInput {
  const birthTime = person.birthTime.trim();

  return {
    role,
    displayName: person.name,
    gender: person.gender === "" ? null : person.gender,
    calendarType: "SOLAR",
    birthDate: person.birthDate,
    birthTime: person.birthTimeUnknown || birthTime.length === 0 ? null : birthTime,
    birthTimeKnown: !person.birthTimeUnknown && birthTime.length > 0,
    timezone: person.timezone,
    mbti: person.mbtiType === "" ? null : person.mbtiType,
  };
}

function calculateCompatibilitySaju(
  person: CompatibilityGenerationInput["personA"],
): SajuCalcResult {
  const birthTime = person.birthTime.trim();

  return calculateSaju({
    birthDate: person.birthDate,
    ...(person.birthTimeUnknown || birthTime.length === 0
      ? {}
      : { birthTime }),
    birthTimeUnknown: person.birthTimeUnknown || birthTime.length === 0,
    calendarType: "SOLAR",
    gender: toSajuGender(person.gender),
    timezone: "Asia/Seoul",
  });
}

function toSajuGender(gender: CompatibilityGenerationInput["personA"]["gender"]): SajuCalcGender {
  if (gender === "MALE" || gender === "FEMALE") {
    return gender;
  }

  return "OTHER_OR_UNSPECIFIED";
}

function toCompatibilityPillars(result: SajuCalcResult): {
  readonly year: string;
  readonly month: string;
  readonly day: string;
  readonly hour?: string;
} {
  return {
    year: formatPillarHanja(result.pillars.year),
    month: formatPillarHanja(result.pillars.month),
    day: formatPillarHanja(result.pillars.day),
    ...(result.pillars.hour === undefined
      ? {}
      : { hour: formatPillarHanja(result.pillars.hour) }),
  };
}

function toComputedSajuFacts(result: SajuCalcResult): ComputedSajuFacts {
  const fiveElementCounts = toFiveElementCounts(result);
  const excessiveElements = getElementsByLabel(result.elements.labels, "STRONG");
  const missingElements = getElementsByLabel(result.elements.labels, "MISSING");
  const structurePatterns = result.structureAnalysis.patterns
    .map((pattern) => specialPatternByStructureCode[pattern.code])
    .filter(
      (pattern): pattern is ComputedSajuSpecialPatternId =>
        pattern !== undefined,
    );
  const dayStrengthPattern =
    result.structureAnalysis.dayMasterStrength.level === "STRONG" ||
    result.structureAnalysis.dayMasterStrength.level === "VERY_STRONG"
      ? "strong_day_master"
      : result.structureAnalysis.dayMasterStrength.level === "WEAK" ||
          result.structureAnalysis.dayMasterStrength.level === "VERY_WEAK"
        ? "weak_day_master"
        : undefined;

  return {
    yearPillar: formatPillarKo(result.pillars.year),
    monthPillar: formatPillarKo(result.pillars.month),
    dayPillar: formatPillarKo(result.pillars.day) as KoreanGanji,
    ...(result.pillars.hour === undefined
      ? {}
      : { hourPillar: formatPillarKo(result.pillars.hour) }),
    dayMaster: stemKoByHanja[result.dayMaster],
    heavenlyStems: getExistingPillars(result).map((pillar) => pillar.stem),
    earthlyBranches: getExistingPillars(result).map((pillar) => pillar.branch),
    fiveElementCounts,
    excessiveElements,
    missingElements,
    usefulElements: missingElements.length > 0 ? missingElements : undefined,
    tenGodSignals: Object.entries(result.tenGods.distribution).map(
      ([tenGod, count]) => ({
        tenGod: tenGodBySajuTenGod[tenGod as SajuCalcTenGod],
        strength: count >= 2 ? "strong" : count === 1 ? "present" : "missing",
      }),
    ),
    specialPatterns: uniqueStrings([
      ...structurePatterns,
      ...(dayStrengthPattern === undefined ? [] : [dayStrengthPattern]),
    ]) as readonly ComputedSajuSpecialPatternId[],
    sinsal: uniqueStrings(
      result.shinsal
        .map((detection) => sinsalByCode[detection.code])
        .filter((signal): signal is ComputedSinsalId => signal !== undefined),
    ) as readonly ComputedSinsalId[],
    gwiin: uniqueStrings(
      result.shinsal.flatMap((detection) => {
        if (detection.code === "CHEON_EUL_GWIIN") return ["cheon_eul"];
        if (detection.code === "TAEGEUK_GWIIN") return ["taegeuk"];
        if (detection.code === "MUN_CHANG_GWIIN") return ["munchang"];
        if (detection.code === "WOL_DEOK_GWIIN") return ["wol_deok"];
        if (detection.code === "CHEON_DEOK_GWIIN") return ["cheon_deok"];
        return [];
      }),
    ) as ComputedSajuFacts["gwiin"],
  };
}

function toFiveElementCounts(result: SajuCalcResult): Record<FiveElement, number> {
  return {
    wood: result.elements.visible.WOOD,
    fire: result.elements.visible.FIRE,
    earth: result.elements.visible.EARTH,
    metal: result.elements.visible.METAL,
    water: result.elements.visible.WATER,
  };
}

function getElementsByLabel(
  labels: readonly ElementLabel[],
  suffix: "STRONG" | "MISSING",
): readonly FiveElement[] {
  return labels
    .filter((label) => label.endsWith(`_${suffix}`))
    .map((label) => label.split("_")[0] as SajuCalcElement)
    .map((element) => elementBySajuElement[element]);
}

function getExistingPillars(result: SajuCalcResult): Array<{
  readonly stem: HeavenlyStem;
  readonly branch: keyof typeof branchKoByHanja;
}> {
  return [
    result.pillars.year,
    result.pillars.month,
    result.pillars.day,
    ...(result.pillars.hour === undefined ? [] : [result.pillars.hour]),
  ];
}

function formatPillarHanja(input: {
  readonly stem: string;
  readonly branch: string;
}): string {
  return `${input.stem}${input.branch}`;
}

function formatPillarKo(input: {
  readonly stem: HeavenlyStem;
  readonly branch: keyof typeof branchKoByHanja;
}): KoreanGanji {
  return `${stemKoByHanja[input.stem]}${branchKoByHanja[input.branch]}` as KoreanGanji;
}

function uniqueStrings(values: readonly string[]): readonly string[] {
  return [...new Set(values)];
}

function buildCompatibilityFallbackDraft(
  packet: CompatibilityEvidencePacket,
): CompatibilityReportDraft {
  const aName = packet.personAChartSummary.displayName;
  const bName = packet.personBChartSummary.displayName;
  const relationshipType = normalizeCompatibilityRelationCategory(packet.relationshipType);
  const relationshipLabel = getCompatibilityRelationshipTypeLabel(relationshipType);
  const relationshipFocus = getCompatibilityRelationshipTypeFocus(relationshipType);
  const strengthFinding = packet.directFindings.find(
    (finding) => finding.type === "strength",
  );
  const frictionFinding = packet.directFindings.find(
    (finding) => finding.type === "friction",
  );
  const riskFinding = packet.directFindings.find(
    (finding) => finding.type === "risk",
  );
  const repairFinding = packet.directFindings.find(
    (finding) => finding.type === "repair",
  );
  const analysis = {
    connectionSummary: [
      firstNonEmpty(
        [strengthFinding?.interpretation, packet.mbtiCompatibility.reportLine],
        `${aName}님과 ${bName}님은 ${relationshipLabel} 맥락에서 끌림과 피로가 함께 생기는 조합입니다.`,
      ),
      firstNonEmpty(
        [
          packet.sajuCompatibility.dayMasterRelation,
          packet.sajuCompatibility.dayBranchRelation,
          packet.bridgeCompatibility.interpretationMode,
        ],
        "명리 흐름은 관계의 반복 패턴과 조율 지점을 보여 주고, MBTI는 대화 속도와 반응 방식을 보조로 보여 줍니다.",
      ),
    ].join("\n\n"),
    firstImpression: `${aName}님과 ${bName}님은 처음에는 서로의 처리 방식이 선명하게 보여 접점이 생깁니다. 한쪽은 방향을 먼저 정리하고, 다른 한쪽은 왜 그런 결론이 나오는지 확인하려 합니다.\n\n가까워질수록 같은 차이가 피로가 됩니다. 빠른 정리는 추진력이 되지만 상대에게는 압박으로 들어갈 수 있고, 긴 확인은 신중함이지만 상대에게는 지연처럼 느껴질 수 있습니다.`,
    stayingPower: `${relationshipLabel} 관계에서 오래 가는 힘은 차이를 없애는 데 있지 않습니다. 각자의 속도와 확인 방식을 역할로 나눌 때 장점이 살아납니다.\n\n중요한 결정은 감정 확인, 사실 정리, 실행 합의 순서로 나누는 편이 좋습니다. 그래야 빠른 쪽은 방치되지 않고, 신중한 쪽은 밀린다고 느끼지 않습니다.`,
    frictionPoints: takeNonEmpty(
      [
        frictionFinding?.interpretation,
        riskFinding?.interpretation,
        ...packet.frictionPoints,
        ...packet.mbtiCompatibility.friction,
      ],
      [
        "결론 속도와 확인 방식이 다르면 같은 대화에서도 한쪽은 답답함을, 다른 한쪽은 압박을 느낄 수 있습니다.",
      ],
      4,
    ),
    categoryReading: `${relationshipLabel}에서는 ${relationshipFocus}을 중심으로 읽어야 합니다. 이 조합은 장점만 보면 보완처럼 보이지만, 실제로는 기준을 누가 잡고 누가 확인하는지에 따라 체감이 크게 갈립니다.\n\n명리는 생활 기준과 반복 마찰을, MBTI는 대화 방식과 반응 속도를 보여 줍니다. 두 근거를 같은 원인으로 단정하지 않고, 관계 장면에서 겹치는 부분만 조율 포인트로 봅니다.`,
    aToBFatigue: `${aName}님은 해결을 위해 속도를 내지만, ${bName}님에게는 충분히 생각할 시간을 줄이는 압박으로 느껴질 수 있습니다. 특히 결론을 먼저 요구하면 ${bName}님은 대화가 아니라 평가처럼 받아들일 수 있습니다.`,
    bToAFatigue: `${bName}님은 신중하게 확인하려 하지만, ${aName}님에게는 결정을 미루는 답답함으로 보일 수 있습니다. 반응이 늦어질수록 ${aName}님은 관계의 방향이 흐려진다고 느끼기 쉽습니다.`,
    communicationRecovery: `${relationshipLabel} 관계의 회복은 좋은 말보다 순서가 중요합니다. 먼저 감정을 확인하고, 다음에 사실을 맞추고, 마지막에 다음 행동을 정해야 합니다.\n\n바로 해결책으로 들어가면 빠른 쪽은 시원하지만 느린 쪽은 밀립니다. 계속 생각만 이어가면 신중한 쪽은 안전하지만 빠른 쪽은 방치된다고 느낍니다.`,
    roleMoneyLifeRhythm: `${relationshipLabel}에서도 역할, 일정, 돈, 생활 리듬은 감으로 넘기지 않는 편이 좋습니다. 기준이 흐려지면 좋은 보완도 관리 부담으로 바뀝니다.\n\n각자 맡을 일과 다시 이야기할 시점을 짧게 정해 두면 감정 싸움보다 운영 문제로 다룰 수 있습니다.`,
    categorySpecificAdvice: takeNonEmpty(
      [
        packet.categoryLens.repairFocus,
        packet.categoryLens.frictionFocus,
        packet.categoryLens.safetyFocus,
      ],
      ["중요한 결정은 결론 시간과 확인 시간을 따로 잡아야 합니다."],
      3,
    ),
    timingCautions: takeNonEmpty(
      [
        ...packet.sajuCompatibility.timingHints,
        ...packet.bridgeCompatibility.cautionSignals,
      ],
      ["중요한 약속이나 역할 변경은 바로 결론내지 말고 다시 확인할 시간을 둡니다."],
      3,
    ),
    repairStrategy: takeNonEmpty(
      [
        repairFinding?.interpretation,
        repairFinding?.safeWording,
        ...packet.repairStrategies,
        ...packet.mbtiCompatibility.repairStrategy,
      ],
      ["결론, 검토, 실행을 한 번에 처리하지 말고 순서를 나누세요."],
      4,
    ),
    riskManagement: takeNonEmpty(
      [
        riskFinding?.interpretation,
        ...packet.frictionPoints,
        ...packet.bridgeCompatibility.cautionSignals.map(
          (signal) =>
            `${signal} 이 지점은 감정 설득보다 기준과 순서를 먼저 정해야 관리됩니다.`,
        ),
      ],
      ["기준이 흐려지는 지점을 미리 정리해야 같은 갈등이 반복되지 않습니다."],
      4,
    ),
  } satisfies CompatibilityReportDraft["relationshipAnalysis"];

  return {
    version: "compatibility_v1_draft",
    productType: "saju_mbti_compatibility",
    productVersion: "1.0",
    relationshipType: relationshipType as CompatibilityReportDraft["relationshipType"],
    personALabel: aName,
    personBLabel: bName,
    openingTitle: `${aName}님과 ${bName}님의 ${relationshipLabel} 궁합`,
    openingSummary: `${relationshipLabel} 관계에서 두 사람은 장점과 피로가 함께 드러납니다. 끌림은 있지만 속도, 기준, 확인 방식을 맞추지 않으면 사소한 대화도 빨리 지칠 수 있습니다.`,
    coreLine:
      "좋게 보면 보완이고, 현실적으로 보면 속도와 확정 타이밍을 조율해야 하는 조합입니다.",
    scoreSummary: {
      totalScore: packet.score.totalScore,
      scoreLabel: packet.score.scoreLabel,
      scoreCaution: packet.score.scoreCaution,
      breakdown: packet.score.breakdown,
    },
    chartComparison: {
      personA: packet.personAChartSummary,
      personB: packet.personBChartSummary,
    },
    keyCompatibilityPoints: {
      attractionPoints: takeNonEmpty(
        [
          packet.categoryLens.strengthFocus,
          strengthFinding?.interpretation,
          packet.mbtiCompatibility.reportLine,
        ],
        ["처음에는 서로 다른 처리 방식이 매력으로 보입니다."],
        3,
      ),
      strengthPoints: takeNonEmpty(
        [
          ...packet.strengths,
          ...packet.mbtiCompatibility.positiveInfluence,
        ],
        ["역할이 나뉘면 실행과 검토가 모두 살아납니다."],
        3,
      ),
      frictionPoints: analysis.frictionPoints,
      relationshipRules: analysis.repairStrategy,
    },
    relationshipAnalysis: analysis,
    chapters: buildFallbackChapters(analysis),
    finalAdvice: [
      "대화 규칙: 결론을 내는 시간과 확인하는 시간을 분리하세요.",
      "생활 기준: 역할과 일정을 감으로 넘기지 말고 짧은 기준으로 남기세요.",
      "도움 요청: 혼자 판단하기 전에 필요한 도움과 확인 시간을 먼저 공유하세요.",
    ],
    safetyNotes: packet.safetyNotes,
  };
}

function buildFallbackChapters(
  analysis: CompatibilityReportDraft["relationshipAnalysis"],
): CompatibilityReportDraft["chapters"] {
  const chapterById: Record<
    Exclude<CompatibilityReportChapterId, "final_message">,
    {
      readonly title: string;
      readonly headline: string;
      readonly body: string;
      readonly directHitScene: string;
      readonly practicalAdvice: string;
    }
  > = {
    overview: {
      title: "두 사람 연결 요약",
      headline: "끌림과 피로가 같은 차이에서 나옵니다.",
      body: analysis.connectionSummary,
      directHitScene: "한쪽은 결론을 보고, 다른 한쪽은 전제를 더 확인합니다.",
      practicalAdvice: "중요한 대화는 감정, 사실, 실행 순서로 나누세요.",
    },
    attraction: {
      title: "첫 인상과 끌림",
      headline: "서로 다른 처리 방식이 처음에는 자극이 됩니다.",
      body: analysis.firstImpression,
      directHitScene: "빠른 정리와 깊은 확인이 서로에게 새롭게 보입니다.",
      practicalAdvice: "끌림이 생겨도 결정 속도는 따로 맞추세요.",
    },
    strengths: {
      title: "오래 가는 힘",
      headline: "차이를 역할로 나누면 보완이 살아납니다.",
      body: analysis.stayingPower,
      directHitScene: "한 사람은 방향을 잡고, 다른 사람은 놓친 조건을 확인합니다.",
      practicalAdvice: "서로의 방식이 필요한 장면을 먼저 정하세요.",
    },
    frictions: {
      title: "자주 부딪히는 지점",
      headline: "속도와 확인 방식이 먼저 부딪힙니다.",
      body: analysis.frictionPoints.join("\n\n"),
      directHitScene: "같은 대화를 해도 한쪽은 결론을, 다른 한쪽은 확인을 원합니다.",
      practicalAdvice: "결론을 낼 대화와 검토할 대화를 분리하세요.",
    },
    communication: {
      title: "대화와 갈등 회복",
      headline: "말의 순서를 바꾸면 회복 비용이 줄어듭니다.",
      body: analysis.communicationRecovery,
      directHitScene: "감정이 올라온 상태에서 바로 해결책을 말하면 상대가 밀립니다.",
      practicalAdvice: "감정 확인 뒤 사실을 맞추고 다음 행동을 정하세요.",
    },
    relationship_scenes: {
      title: "A/B 피로 지점",
      headline: "A가 주는 피로와 B가 주는 피로가 다릅니다.",
      body: `${analysis.aToBFatigue}\n\n${analysis.bToAFatigue}`,
      directHitScene: "한쪽은 기다림이 답답하고, 다른 한쪽은 빠른 결론이 부담스럽습니다.",
      practicalAdvice: "답답함과 부담을 같은 말로 묶지 말고 따로 말하세요.",
    },
    money_lifestyle: {
      title: "돈/역할/생활 리듬",
      headline: "기준이 흐려지면 보완도 부담으로 바뀝니다.",
      body: analysis.roleMoneyLifeRhythm,
      directHitScene: "작은 일정과 역할 문제가 주도권 싸움처럼 커질 수 있습니다.",
      practicalAdvice: "역할, 일정, 돈 기준을 짧게라도 기록하세요.",
    },
    conflict_recovery: {
      title: "유지 전략",
      headline: "회복은 감정 설득보다 기준 재정렬에서 빨라집니다.",
      body: analysis.repairStrategy.join("\n\n"),
      directHitScene: "같은 문제를 다시 말할 때 기준 없이 감정만 반복되면 피로가 커집니다.",
      practicalAdvice: "다음 대화 시간과 바꿀 행동 하나를 정하세요.",
    },
    long_term_rules: {
      title: "리스크 관리",
      headline: "좋은 차이도 관리 기준이 없으면 지칩니다.",
      body: analysis.riskManagement.join("\n\n"),
      directHitScene: "장점으로 보였던 차이가 가까워질수록 압박이나 지연으로 느껴집니다.",
      practicalAdvice: "반복되는 한 가지 기준부터 조정하세요.",
    },
  };

  return COMPATIBILITY_REPORT_CHAPTER_IDS.filter(
    (id): id is Exclude<CompatibilityReportChapterId, "final_message"> =>
      id !== "final_message",
  ).map((id) => ({
    id,
    title: chapterById[id].title,
    headline: chapterById[id].headline,
    body: chapterById[id].body,
    directHitScenes: [chapterById[id].directHitScene],
    practicalAdvice: [chapterById[id].practicalAdvice],
  }));
}

function firstNonEmpty(
  values: readonly (string | undefined | null)[],
  fallback: string,
): string {
  return values.find((value): value is string => Boolean(value?.trim())) ?? fallback;
}

function takeNonEmpty(
  values: readonly (string | undefined | null)[],
  fallback: readonly string[],
  limit: number,
): readonly string[] {
  const filtered = [
    ...new Set(
      values
        .map((value) => value?.trim())
        .filter((value): value is string => Boolean(value)),
    ),
  ];

  return (filtered.length > 0 ? filtered : fallback).slice(0, limit);
}

function compatibilityFailure(input: {
  readonly code: CompatibilityGenerationErrorCode;
  readonly message: string;
}): CompatibilityGenerationResult {
  return {
    ok: false,
    kind: "compatibility",
    error: input,
  };
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
