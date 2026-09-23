import { buildCompatibilityCategoryReading } from "../report-knowledge/compatibilityCategoryReading";
import { withReportInputEvidence } from "./reportInputEvidence";
import { withBirthTimeEvidence } from "../saju/birthTimePrecisionTypes";
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
    evidencePacket,
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
    evidencePacket: withReportInputEvidence(evidencePacket, input),
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

  return withBirthTimeEvidence(buildCompatibilityEvidencePacket({
    input: compatibilityInput,
    personASajuFacts: toComputedSajuFacts(personASaju),
    personBSajuFacts: toComputedSajuFacts(personBSaju),
    expectedPillars: {
      personA: toCompatibilityPillars(personASaju),
      personB: toCompatibilityPillars(personBSaju),
    },
  }), { personA: personASaju.birthTimeContext, personB: personBSaju.birthTimeContext });
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
    birthTimePrecision: person.birthTimePrecision,
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
    birthTimeUnknown: person.birthTimeUnknown,
    birthTimePrecision: person.birthTimePrecision,
    approximateBirthTimeSlot: person.approximateBirthTimeSlot,
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
  const { personA, personB } = packet.directionEvidence.persons;
  const reading = packet.categoryReading ?? buildCompatibilityCategoryReading(packet);
  const [contact, support, pace, sharing, recovery, resources, boundaries, lasting] = reading.scenes;
  const analysis = {
    connectionSummary: [
      `${aName}님의 일주 ${personA.dayPillar}, ${bName}님의 일주 ${personB.dayPillar}: ${packet.sajuCompatibility.dayMasterRelation}`,
      packet.sajuCompatibility.dayBranchRelation,
      `이 ${relationshipLabel} 해석은 아래의 실제 관계 작용을 출발점으로 삼습니다. 성향이 드러날 수 있는 장면과 두 사람이 선택할 운영 방법을 구분해서 읽어 주세요.`,
    ].filter(Boolean).join("\n\n"),
    firstImpression: contact.reading,
    stayingPower: support.reading,
    frictionPoints: [pace.caution, sharing.caution, resources.caution],
    categoryReading: `${pace.reading}\n\n${sharing.reading}`,
    aToBFatigue: packet.directionEvidence.aToB.fatigue,
    bToAFatigue: packet.directionEvidence.bToA.fatigue,
    communicationRecovery: recovery.reading,
    roleMoneyLifeRhythm: `${resources.reading}\n\n${boundaries.reading}`,
    categorySpecificAdvice: [lasting.reading],
    // Event-based review points, not unsupported predictions about future years.
    timingCautions: [boundaries.caution, lasting.caution],
    repairStrategy: [recovery.action, lasting.action],
    riskManagement: [contact.caution, support.caution, recovery.caution],
  } satisfies CompatibilityReportDraft["relationshipAnalysis"];

  return {
    version: "compatibility_v1_draft",
    productType: "saju_mbti_compatibility",
    productVersion: "1.0",
    relationshipType: relationshipType as CompatibilityReportDraft["relationshipType"],
    personALabel: aName,
    personBLabel: bName,
    openingTitle: `${aName}님과 ${bName}님의 ${relationshipLabel} 궁합`,
    openingSummary: `가장 잘 맞는 부분: ${reading.conclusions.fit}\n\n가장 부딪히는 부분: ${reading.conclusions.friction}\n\n유지하는 핵심 조건: ${reading.conclusions.condition}`,
    coreLine:
      `${relationshipLabel}의 핵심은 ${support.title}입니다. ${packet.sajuCompatibility.dayMasterRelation} ${pace.caution}`,
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
      attractionPoints: [contact.action],
      strengthPoints: [support.action],
      frictionPoints: analysis.frictionPoints,
      relationshipRules: analysis.repairStrategy,
    },
    relationshipAnalysis: analysis,
    chapters: buildFallbackChapters(analysis, packet),
    finalAdvice: [contact.action, resources.action, lasting.action],
    safetyNotes: packet.safetyNotes,
  };
}

function buildFallbackChapters(
  analysis: CompatibilityReportDraft["relationshipAnalysis"],
  packet: CompatibilityEvidencePacket,
): CompatibilityReportDraft["chapters"] {
  const scenes = (packet.categoryReading ?? buildCompatibilityCategoryReading(packet)).scenes;
  const entries = [
    ["overview", "두 사람 연결 요약", analysis.connectionSummary, 0],
    ["attraction", scenes[0].title, analysis.firstImpression, 0],
    ["strengths", scenes[1].title, analysis.stayingPower, 1],
    ["frictions", scenes[2].title, analysis.categoryReading, 2],
    ["communication", scenes[4].title, analysis.communicationRecovery, 4],
    ["relationship_scenes", "서로에게 주는 피로", `${analysis.aToBFatigue}\n\n${analysis.bToAFatigue}`, 3],
    ["money_lifestyle", scenes[5].title, analysis.roleMoneyLifeRhythm, 5],
    ["conflict_recovery", "회복 뒤 바꿀 행동", analysis.repairStrategy.join("\n\n"), 6],
    ["long_term_rules", scenes[7].title, analysis.categorySpecificAdvice.join("\n\n"), 7],
  ] as const;
  return entries.map(([id, title, body, sceneIndex]) => ({
    id, title, body, headline: scenes[sceneIndex].title,
    directHitScenes: [scenes[sceneIndex].scene], practicalAdvice: [scenes[sceneIndex].action],
  }));
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
