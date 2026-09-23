import { withReportInputEvidence } from "./reportInputEvidence";
import { getMbtiSourceProfile, type MbtiTraitArea } from "../report-knowledge/mbti/sourceRuntimeAdapter";
import { withBirthTimeEvidence } from "../saju/birthTimePrecisionTypes";
import {
  buildComprehensiveReportEvidencePacketFromComputedFacts,
} from "../report-knowledge/comprehensiveReportEvidenceInputBuilder";
import type {
  ComprehensiveReportEvidencePacket,
} from "../report-knowledge/comprehensiveReportEvidenceTypes";
import type { MbtiType } from "../report-knowledge/mbtiKnowledgeTypes";
import type {
  ComputedGwiinId,
  ComputedSajuFacts,
  ComputedSajuSpecialPatternId,
  ComputedSinsalId,
  ComputedTenGodSignal,
  ComputedTenGodSignalStrength,
  KoreanEarthlyBranch,
  KoreanGanji,
  KoreanHeavenlyStem,
} from "../report-knowledge/sajuComputedFactsTypes";
import type {
  FiveElement as KnowledgeFiveElement,
  TenGod as KnowledgeTenGod,
} from "../report-knowledge/sajuKnowledgeTypes";
import { calculateSaju } from "../saju/calculateSaju";
import {
  BRANCH_MAIN_ELEMENT,
  STEM_ELEMENT,
} from "../saju/constants";
import type {
  EarthlyBranch,
  FiveElement as SajuCalcFiveElement,
  Gender as SajuCalcGender,
  HeavenlyStem,
  Pillar,
  SajuCalcResult,
  TenGod as SajuCalcTenGod,
} from "../saju/types";
import {
  buildComprehensiveReportV2ProfileTable,
} from "./comprehensiveReportProfileTableBuilder";
import type {
  ComprehensiveReportV2Chapter,
  ComprehensiveReportV2ChapterId,
  ComprehensiveReportV2Draft,
  ComprehensiveReportV2LongformReading,
  ComprehensiveReportV2LongformReadingId,
  ComprehensiveReportV2ProfileTable,
  ComprehensiveReportV2SajuFeatureChapter,
} from "./comprehensiveReportDraftTypes";
import {
  COMPREHENSIVE_REPORT_V2_CHAPTER_IDS,
  COMPREHENSIVE_REPORT_V2_LONGFORM_READING_IDS,
  isComprehensiveReportV2Draft,
} from "./comprehensiveReportDraftTypes";
import {
  validateComprehensiveReportDraft,
} from "./comprehensiveReportDraftValidator";
import {
  buildDeterministicSajuFeatureChapter,
  normalizeSajuFeatureChapter,
  generateComprehensiveReportDraft,
} from "./openaiComprehensiveReportWriter";
import type { ComprehensiveV2ProductPreviewDraft } from "./productPreviewSnapshot";
import type { SinglePersonGenerationInput } from "./reportInputAdapter";

export type ComprehensiveV2GenerationErrorCode =
  | "COMPREHENSIVE_V2_GENERATION_FAILED"
  | "COMPREHENSIVE_V2_DRAFT_INVALID"
  | "INVALID_REPORT_INPUT";

export type ComprehensiveV2GenerationResult =
  | {
      readonly ok: true;
      readonly kind: "comprehensiveV2";
      readonly draft: ComprehensiveV2ProductPreviewDraft;
      readonly evidencePacket: ComprehensiveReportEvidencePacket;
    }
  | {
      readonly ok: false;
      readonly kind: "comprehensiveV2";
      readonly error: {
        readonly code: ComprehensiveV2GenerationErrorCode;
        readonly message: string;
      };
    };

export type ComprehensiveV2GenerationHandlerOptions = {
  readonly writer?: {
    readonly enabled: boolean;
    readonly config?: Parameters<typeof generateComprehensiveReportDraft>[0]["config"];
  };
};



const tenGodByCalc = {
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
} as const satisfies Record<SajuCalcTenGod, KnowledgeTenGod>;

const knowledgeElementByCalc = {
  WOOD: "wood",
  FIRE: "fire",
  EARTH: "earth",
  METAL: "metal",
  WATER: "water",
} as const satisfies Record<SajuCalcFiveElement, KnowledgeFiveElement>;

const koreanStemByHanja = {
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

const koreanBranchByHanja = {
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
} as const satisfies Record<EarthlyBranch, KoreanEarthlyBranch>;

const sinsalIdByCode: Partial<
  Record<SajuCalcResult["shinsal"][number]["code"], ComputedSinsalId>
> = {
  HYEONCHIMSAL: "hyeonchim",
  HONGYEOMSAL: "hongyeom",
  BAEKHODAESAL: "baekho",
  MANGSINSAL: "mangsin",
  YEOKMASAL: "yeokma",
  DOHWASAL: "dohwa",
  HWAGAE: "hwagae",
  TWELVE_WOLSAL: "wolsal",
  TWELVE_MANGSINSAL: "mangsin",
  TWELVE_JANGSEONGSAL: "jangseong",
  TWELVE_BANANSAL: "banan",
  TWELVE_YEOKMASAL: "yeokma",
  TWELVE_HWAGAE: "hwagae",
};

const gwiinIdByCode: Partial<
  Record<SajuCalcResult["shinsal"][number]["code"], ComputedGwiinId>
> = {
  CHEON_EUL_GWIIN: "cheon_eul",
  TAEGEUK_GWIIN: "taegeuk",
  MUN_CHANG_GWIIN: "munchang",
  WOL_DEOK_GWIIN: "wol_deok",
  CHEON_DEOK_GWIIN: "cheon_deok",
};

const chapterTitleById = {
  opening: "전체 성향 핵심",
  saju_identity: "사주가 보여주는 기본 형상",
  personality_pattern: "명리와 MBTI가 만나는 판단 방식",
  work_money_study: "일·돈·공부",
  love_relationships: "연애·관계",
  people_family_environment: "사람·가족·환경",
  risk_and_growth: "리스크·성장",
  final_message: "오늘부터 바꿀 기준",
} as const satisfies Record<ComprehensiveReportV2ChapterId, string>;

const longformTitleById = {
  opening: "전체 성향 핵심",
  baseSajuReading: "사주 골격 해석",
  sajuFeatureReading: "내 사주의 주요 표식 해석",
  mbtiReading: "MBTI 성향 발현",
  sajuMbtiBridgeReading: "명리×MBTI 연결",
  workMoneyStudyReading: "일·돈·공부",
  loveRelationshipReading: "연애·관계",
  peopleFamilyEnvironmentReading: "사람·가족·환경",
  riskGrowthReading: "리스크·성장",
  finalMessage: "오늘부터 바꿀 기준",
} as const satisfies Record<ComprehensiveReportV2LongformReadingId, string>;

export async function generateComprehensiveV2ProductDraft(
  input: SinglePersonGenerationInput,
  options: ComprehensiveV2GenerationHandlerOptions = {},
): Promise<ComprehensiveV2GenerationResult> {
  if (input.kind !== "comprehensiveV2") {
    return comprehensiveV2Failure({
      code: "INVALID_REPORT_INPUT",
      message: "Comprehensive V2 generation requires comprehensiveV2 input.",
    });
  }

  let evidence: {
    readonly packet: ComprehensiveReportEvidencePacket;
    readonly facts: ComputedSajuFacts;
  };

  try {
    evidence = buildComprehensiveV2EvidenceFromGenerationInput(input);
  } catch (error) {
    return comprehensiveV2Failure({
      code: "COMPREHENSIVE_V2_GENERATION_FAILED",
      message: getErrorMessage(error),
    });
  }

  const profileTable = buildComprehensiveReportV2ProfileTable({
    evidencePacket: evidence.packet,
    mbtiType: evidence.packet.mbtiType || "미입력",
    sajuFacts: evidence.facts,
  });

  let draft: ComprehensiveReportV2Draft;

  try {
    draft =
      options.writer?.enabled === true && options.writer.config !== undefined
        ? await generateWriterDraft({
            input,
            evidencePacket: evidence.packet,
            profileTable,
            config: options.writer.config,
          })
        : buildLocalComprehensiveV2Draft({
            input,
            evidencePacket: evidence.packet,
            profileTable,
          });
  } catch (error) {
    return comprehensiveV2Failure({
      code: "COMPREHENSIVE_V2_GENERATION_FAILED",
      message: getErrorMessage(error),
    });
  }

  const validation = validateComprehensiveReportDraft(draft);
  if (!validation.ok || validation.value === undefined) {
    return comprehensiveV2Failure({
      code: "COMPREHENSIVE_V2_DRAFT_INVALID",
      message: validation.errors.join("; "),
    });
  }

  if (!isComprehensiveReportV2Draft(validation.value)) {
    return comprehensiveV2Failure({
      code: "COMPREHENSIVE_V2_DRAFT_INVALID",
      message: "Comprehensive V2 handler produced a non-V2 draft.",
    });
  }

  return {
    ok: true,
    kind: "comprehensiveV2",
    draft: {
      ...validation.value,
      productVersion: "v2",
    },
    evidencePacket: withReportInputEvidence(evidence.packet, input),
  };
}

function buildComprehensiveV2EvidenceFromGenerationInput(
  input: SinglePersonGenerationInput,
): {
  readonly packet: ComprehensiveReportEvidencePacket;
  readonly facts: ComputedSajuFacts;
} {
  const saju = calculateComprehensiveSaju(input.person);
  const facts = toComputedSajuFacts(saju);
  const mbtiType = toMbtiType(input.person.mbtiType);
  const { packet } = buildComprehensiveReportEvidencePacketFromComputedFacts({
    mbtiType,
    sajuFacts: facts,
  });

  return { packet: withBirthTimeEvidence(packet, { person: saju.birthTimeContext }), facts };
}

async function generateWriterDraft(input: {
  readonly input: SinglePersonGenerationInput;
  readonly evidencePacket: ComprehensiveReportEvidencePacket;
  readonly profileTable: ComprehensiveReportV2ProfileTable;
  readonly config: Parameters<typeof generateComprehensiveReportDraft>[0]["config"];
}): Promise<ComprehensiveReportV2Draft> {
  const result = await generateComprehensiveReportDraft({
    userDisplayName: input.input.person.name,
    mbtiType: input.evidencePacket.mbtiType,
    evidencePacket: input.evidencePacket,
    profileTable: input.profileTable,
    config: input.config,
  });

  if (!isComprehensiveReportV2Draft(result.draft)) {
    throw new Error("Comprehensive writer returned a non-V2 draft.");
  }

  return result.draft;
}

function calculateComprehensiveSaju(
  person: SinglePersonGenerationInput["person"],
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

function toComputedSajuFacts(result: SajuCalcResult): ComputedSajuFacts {
  const pillars = [
    result.pillars.year,
    result.pillars.month,
    result.pillars.day,
    result.pillars.hour,
  ].filter((pillar): pillar is Pillar => pillar !== undefined);
  const fiveElementCounts = countVisibleElements(pillars);
  const tenGodSignals = toTenGodSignals(result.tenGods.distribution);

  return {
    yearPillar: formatKoreanPillar(result.pillars.year),
    monthPillar: formatKoreanPillar(result.pillars.month),
    ...(result.pillars.hour === undefined
      ? {}
      : { hourPillar: formatKoreanPillar(result.pillars.hour) }),
    heavenlyStems: pillars.map((pillar) => pillar.stem),
    earthlyBranches: pillars.map((pillar) => pillar.branch),
    dayMaster: koreanStemByHanja[result.dayMaster],
    dayPillar: formatKoreanPillar(result.pillars.day),
    fiveElementCounts,
    excessiveElements: getExcessiveElements(fiveElementCounts),
    missingElements: getMissingElements(fiveElementCounts),
    usefulElements: getMissingElements(fiveElementCounts),
    tenGodSignals,
    specialPatterns: toSpecialPatterns(result, tenGodSignals, fiveElementCounts),
    sinsal: uniqueValues(
      result.shinsal
        .map((detection) => sinsalIdByCode[detection.code])
        .filter((id): id is ComputedSinsalId => id !== undefined),
    ),
    gwiin: uniqueValues(
      result.shinsal
        .map((detection) => gwiinIdByCode[detection.code])
        .filter((id): id is ComputedGwiinId => id !== undefined),
    ),
  };
}

function countVisibleElements(
  pillars: readonly Pillar[],
): ComputedSajuFacts["fiveElementCounts"] {
  const counts: ComputedSajuFacts["fiveElementCounts"] = {
    wood: 0,
    fire: 0,
    earth: 0,
    metal: 0,
    water: 0,
  };

  for (const pillar of pillars) {
    counts[knowledgeElementByCalc[STEM_ELEMENT[pillar.stem]]]++;
    counts[knowledgeElementByCalc[BRANCH_MAIN_ELEMENT[pillar.branch]]]++;
  }

  return counts;
}

function getExcessiveElements(
  counts: ComputedSajuFacts["fiveElementCounts"],
): readonly KnowledgeFiveElement[] {
  return (Object.entries(counts) as Array<[KnowledgeFiveElement, number]>)
    .filter(([, count]) => count >= 4)
    .map(([element]) => element);
}

function getMissingElements(
  counts: ComputedSajuFacts["fiveElementCounts"],
): readonly KnowledgeFiveElement[] {
  return (Object.entries(counts) as Array<[KnowledgeFiveElement, number]>)
    .filter(([, count]) => count === 0)
    .map(([element]) => element);
}

function toTenGodSignals(
  distribution: SajuCalcResult["tenGods"]["distribution"],
): readonly ComputedTenGodSignal[] {
  return (Object.entries(distribution) as Array<[SajuCalcTenGod, number]>).map(
    ([tenGod, count]) => ({
      tenGod: tenGodByCalc[tenGod],
      strength: getTenGodStrength(count),
    }),
  );
}

function getTenGodStrength(count: number): ComputedTenGodSignalStrength {
  if (count <= 0) return "missing";
  if (count === 1) return "present";
  if (count === 2) return "strong";
  return "excessive";
}

function toSpecialPatterns(
  result: SajuCalcResult,
  tenGodSignals: readonly ComputedTenGodSignal[],
  counts: ComputedSajuFacts["fiveElementCounts"],
): readonly ComputedSajuSpecialPatternId[] {
  const patterns: ComputedSajuSpecialPatternId[] = [];
  const codeByStructure: Partial<
    Record<
      SajuCalcResult["structureAnalysis"]["patterns"][number]["code"],
      ComputedSajuSpecialPatternId
    >
  > = {
    WEAK_DAYMASTER_WITH_STRONG_WEALTH: "jaeda_sinyak",
    WEAK_DAYMASTER_WITH_STRONG_OUTPUT: "no_output",
    WEAK_DAYMASTER_WITH_STRONG_OFFICER: "weak_day_master",
    MIXED_OFFICER_KILLING: "gwansal_mixed",
    RESOURCE_SUPPORTS_DAYMASTER: "salin_sangsaeng",
    OUTPUT_GENERATES_WEALTH: "siksang_saengjae",
    WEALTH_GENERATES_OFFICER: "jaesaenggwan",
  };

  for (const pattern of result.structureAnalysis.patterns) {
    const id = codeByStructure[pattern.code];
    if (id !== undefined) {
      patterns.push(id);
    }
  }

  if (
    result.structureAnalysis.dayMasterStrength.level === "STRONG" ||
    result.structureAnalysis.dayMasterStrength.level === "VERY_STRONG"
  ) {
    patterns.push("strong_day_master");
  }
  if (
    result.structureAnalysis.dayMasterStrength.level === "WEAK" ||
    result.structureAnalysis.dayMasterStrength.level === "VERY_WEAK"
  ) {
    patterns.push("weak_day_master");
  }
  if (tenGodSignals.some((signal) => signal.tenGod === "zheng_yin" && signal.strength === "missing")) {
    patterns.push("no_resource");
  }
  if (tenGodSignals.some((signal) => signal.tenGod === "shi_shen" && signal.strength === "missing")) {
    patterns.push("no_output");
  }
  if (counts.earth >= 4 && counts.metal > 0) {
    patterns.push("earth_excess_buries_metal");
  }

  return uniqueValues(patterns);
}

function buildLocalComprehensiveV2Draft(input: {
  readonly input: SinglePersonGenerationInput;
  readonly evidencePacket: ComprehensiveReportEvidencePacket;
  readonly profileTable: ComprehensiveReportV2ProfileTable;
}): ComprehensiveReportV2Draft {
  const calculatedFeatures = buildDeterministicSajuFeatureChapter(input.evidencePacket);
  if (!calculatedFeatures) throw new Error("COMPREHENSIVE_FEATURE_EVIDENCE_REQUIRED");
  const featureChapter = normalizeSajuFeatureChapter(calculatedFeatures);
  const primaryTerms = getPrimarySajuTerms(input.profileTable, featureChapter);
  const mbtiType = input.evidencePacket.mbtiType;

  return {
    version: "comprehensive_v2_draft",
    productType: "saju_mbti_full",
    openingTitle: `${input.input.person.name}님의 사주×MBTI 종합 리포트`,
    openingSummary:
      `${input.input.person.name}님의 원국은 「${primaryTerms.slice(0, 3).join(", ")}」 표식을 중심으로 읽습니다. MBTI는 원인이 아니라 이 구조가 생활에서 드러나는 행동 방식으로만 연결합니다.`,
    coreLine:
      `${primaryTerms[0]}에 담긴 선택 기준을 읽고, ${mbtiType ? mbtiType + "의 실제 성향 자료와 함께" : "MBTI를 추정하지 않고"} 일과 관계에서 쓸 방법을 찾습니다.`,
    profileTable: input.profileTable,
    ...(input.evidencePacket.sajuSymbolicNickname === undefined
      ? {}
      : { sajuSymbolicNickname: input.evidencePacket.sajuSymbolicNickname }),
    ...(input.evidencePacket.sajuFeatureSpotlight === undefined
      ? {}
      : { sajuFeatureSpotlight: input.evidencePacket.sajuFeatureSpotlight }),
    ...(input.evidencePacket.sajuSignatureScenes === undefined
      ? {}
      : { sajuSignatureScenes: input.evidencePacket.sajuSignatureScenes }),
    ...(input.evidencePacket.reportDifferentiationModules === undefined
      ? {}
      : {
          reportDifferentiationModules:
            input.evidencePacket.reportDifferentiationModules,
        }),
    sajuFeatureChapter: featureChapter,
    chapters: COMPREHENSIVE_REPORT_V2_CHAPTER_IDS.map((chapterId) =>
      buildLocalChapter({
        chapterId,
        mbtiType,
        primaryTerms,
        profileTable: input.profileTable,
        evidencePacket: input.evidencePacket,
      }),
    ),
    longformReadings: COMPREHENSIVE_REPORT_V2_LONGFORM_READING_IDS.map((readingId) =>
      buildLocalLongformReading({
        readingId,
        mbtiType,
        primaryTerms,
        profileTable: input.profileTable,
        evidencePacket: input.evidencePacket,
      }),
    ),
    finalAdvice:
      "오늘부터는 더 세게 밀어붙이는 것보다 기준, 돈의 방어선, 관계의 말 순서, 회복 루틴을 함께 운영하는 쪽이 오래 갑니다. 이 리포트는 확정 예언이 아니라 자기이해와 선택 기준을 위한 참고 자료입니다.",
    safetyNotes: [
      "이 리포트는 특정 사건, 날짜, 합격, 승진, 이직, 결혼, 임신, 출산을 확정하지 않습니다.",
      "건강은 질병 예측이 아니라 생활 리듬과 회복 루틴의 관점으로만 읽어 주세요.",
      "돈과 투자는 수익을 약속하지 않으며, 기록과 기준을 세우는 참고 정보로만 활용해 주세요.",
    ],
  };
}

function buildLocalChapter(input: {
  readonly chapterId: ComprehensiveReportV2ChapterId;
  readonly mbtiType: string;
  readonly primaryTerms: readonly string[];
  readonly profileTable: ComprehensiveReportV2ProfileTable;
  readonly evidencePacket: ComprehensiveReportEvidencePacket;
}): ComprehensiveReportV2Chapter {
  const titleKo = chapterTitleById[input.chapterId];
  const body = buildChapterBody({
    titleKo,
    chapterId: input.chapterId,
    mbtiType: input.mbtiType,
    primaryTerms: input.primaryTerms,
    profileTable: input.profileTable,
  }) + " " + featureReading(input.evidencePacket, COMPREHENSIVE_REPORT_V2_CHAPTER_IDS.indexOf(input.chapterId));

  return {
    chapterId: input.chapterId,
    titleKo,
    headline: buildChapterHeadline(titleKo, input.primaryTerms),
    hitReadingLines: buildHitReadingLines(input.chapterId),
    body,
    solutionLines: buildSolutionLines(input.chapterId),
    keyPhrases: [titleKo, ...input.primaryTerms.slice(0, 2)],
    sajuTermsUsed: input.primaryTerms.slice(0, 2),
    mbtiTermsUsed: input.mbtiType ? [input.mbtiType] : [],
  };
}

function buildChapterBody(input: {
  readonly titleKo: string;
  readonly chapterId: ComprehensiveReportV2ChapterId;
  readonly mbtiType: string;
  readonly primaryTerms: readonly string[];
  readonly profileTable: ComprehensiveReportV2ProfileTable;
}): string {
  const [firstTerm, secondTerm] = input.primaryTerms;
  const elementSummary = input.profileTable.fiveElementSummary.join(" · ");
  const contextLine = getContextLine(input.chapterId);

  return [
    `${input.titleKo}에서는 ${firstTerm}라는 표식을 중심으로 보되, ${secondTerm}까지 함께 만들어내는 반응 속도를 같이 읽습니다. ${input.titleKo}의 「${firstTerm}」 표식은 이름만 외우는 표식이 아니라 실제 선택의 방향을 잡는 기준입니다.`,
    getLongformMbtiLine(chapterReadingId[input.chapterId], input.mbtiType),
    `${input.titleKo}의 오행 분포는 ${elementSummary}입니다. ${input.titleKo}에서 이 분포는 사건을 맞히는 표가 아니라 책임, 표현 온도, 회복 루틴을 어디서 의식적으로 보완해야 하는지 알려주는 생활 기준입니다.`,
    contextLine,
    `${input.titleKo}에서 표식 「${firstTerm}」은 실제 경험과 대조할 기준입니다. ${reflectionByReading[chapterReadingId[input.chapterId]]}`,
  ].join(" ");
}

function buildChapterHeadline(
  titleKo: string,
  primaryTerms: readonly string[],
): string {
  return `${titleKo}: 「${primaryTerms[0]}」, 「${primaryTerms[1]}」 표식을 현실 장면으로 번역하는 장입니다.`;
}

function buildHitReadingLines(
  chapterId: ComprehensiveReportV2ChapterId,
): readonly string[] {
  if (chapterId === "work_money_study") {
    return [
      "프로젝트를 보면 아이디어보다 수익화, 정산일, 책임 범위가 먼저 떠오를 수 있습니다.",
      "돈은 감보다 숫자와 기준이 있어야 마음이 놓이는 편입니다.",
      "공부도 써먹을 장면이 보여야 오래 붙습니다.",
    ];
  }
  if (chapterId === "love_relationships") {
    return [
      "책임 없이 말만 많은 사람에게는 호감이 있어도 마음이 빨리 식을 수 있습니다.",
      "연인이나 가까운 상대가 감정을 말할 때 해결책보다 내 편이라는 확인이 먼저 필요할 수 있습니다.",
      "일에서는 빠른 판단이 실력이지만, 관계에서는 순서를 틀리면 상처가 됩니다.",
    ];
  }
  if (chapterId === "risk_and_growth") {
    return [
      "쉬라는 말만 들으면 잘 못 쉬고, 쉬는 이유와 구조가 있어야 쉬는 편입니다.",
      "버티는 힘은 강하지만 중단 기준을 늦게 잡으면 피로가 누적됩니다.",
    ];
  }
  if (chapterId === "final_message") {
    return [
      "오래 가는 힘은 더 강하게 밀어붙이는 쪽보다, 기준과 회복을 같이 운영하는 쪽에서 나옵니다.",
    ];
  }
  if (chapterId === "opening") {
    return [
      "처음에는 판단 속도와 책임감이 같이 보이고, 쉬는 기준은 뒤로 밀릴 수 있습니다.",
      "큰 방향을 잡을 때는 빠르지만, 감정 온도를 따로 챙겨야 오래 갑니다.",
    ];
  }
  if (chapterId === "saju_identity") {
    return [
      "압박이 걸리는 자리에서 오히려 기준을 빨리 세우고 판을 정리하려는 모습이 나올 수 있습니다.",
      "겉으로는 단단해 보이지만 안쪽에서는 역할과 책임의 무게를 계속 계산합니다.",
    ];
  }
  if (chapterId === "personality_pattern") {
    return [
      "카톡 설명을 듣다가 틀린 부분이 먼저 보이면 표정 관리가 어려울 수 있습니다.",
      "조언을 해준다고 생각하지만 상대는 평가받는다고 느낄 수 있습니다.",
      "회의에서 반대 의견을 말하기 전에 상대의 설명을 한 문장으로 확인하면 대화의 오해를 줄일 수 있습니다.",
    ];
  }
  if (chapterId === "people_family_environment") {
    return [
      "가족 부탁이나 팀 역할이 들어오면 먼저 범위와 마감선을 정해야 마음이 놓입니다.",
      "도움을 요청하기 전까지 혼자 버티려는 습관이 피로를 키울 수 있습니다.",
      "가족 부탁과 팀 업무가 겹치는 날에는 먼저 약속한 일정이 무엇인지 기록으로 확인하세요.",
    ];
  }

  return [
    "설명을 듣다가 핵심 오류가 먼저 보이면 말의 순서를 따로 잡아야 합니다.",
    "강점은 줄이는 것이 아니라 장면에 맞게 전달 방식을 바꾸면 살아납니다.",
  ];
}

function buildSolutionLines(
  chapterId: ComprehensiveReportV2ChapterId,
): readonly string[] {
  if (chapterId === "opening") return [];
  if (chapterId === "final_message") {
    return [
      "일과 공부는 2주 단위 목표와 기록으로 관리하세요.",
      "돈은 정산일, 비용 상한선, 철수 기준을 먼저 적으세요.",
      "관계에서는 해결책 전에 상대의 감정을 한 문장으로 확인하세요.",
      "회복은 밤 산책, 수면, 기록처럼 일정에 넣어 운영하세요.",
      "가족과 팀 부탁은 맡을 범위와 마감을 먼저 정하세요.",
    ];
  }
  if (chapterId === "work_money_study") {
    return [
      "외부 제안과 프로젝트는 시작 전에 정산일과 권한을 기록으로 남기세요.",
      "포트폴리오와 자격증 공부는 실제 쓰임이 보이는 순서로 쪼개세요.",
      "전문서와 직무 학습은 2주 단위 결과물로 연결하세요.",
      "사업 학습은 수익화 아이디어보다 비용 상한선부터 정하세요.",
    ];
  }
  if (chapterId === "love_relationships") {
    return [
      "맞는 상대는 감정 표현을 천천히 풀어주면서 약속과 생활 리듬이 안정적인 사람입니다.",
      "피해야 할 상대는 감정 기복이 크고 책임이 흐릿한 패턴입니다.",
      "보완 기운은 실제 오행 분포와 함께 읽고, 관계에서는 감정 완충과 표현 온도를 서로 조율하세요.",
      "MBTI만으로 궁합을 단정하지 말고 대화 속도와 약속 습관을 함께 보세요.",
    ];
  }
  if (chapterId === "risk_and_growth") {
    return [
      "번아웃 전 중단 기준을 숫자와 일정으로 정하세요.",
      "수분, 수면, 밤 산책, 기록을 식히는 루틴으로 고정하세요.",
      "햇빛과 가벼운 운동을 생활 리듬에 맞춰 회복 시간으로 정하세요.",
      "책임 덜어내기와 경계선 정리로 일정에 쌓인 부담을 낮추세요.",
    ];
  }

  return [
    "결론을 바로 던지기 전에 질문을 하나 넣으세요.",
    "역할과 책임 범위를 문장으로 남기세요.",
  ];
}

function getContextLine(chapterId: ComprehensiveReportV2ChapterId): string {
  if (chapterId === "work_money_study") {
    return "일·돈·공부에서는 프로젝트, 포트폴리오, 외부 제안, 수익화, 자격증, 전문서 학습이 한 흐름으로 묶입니다. 열정이 아니라 계약 조건, 정산일, 비용 상한선, 철수 기준이 먼저 있어야 실력이 손해로 바뀌지 않습니다.";
  }
  if (chapterId === "love_relationships") {
    return "연애와 관계에서는 연인과 카톡을 주고받는 속도, 말의 온도, 애정 확인 방식, 책임감 없는 상대에 대한 피로가 중요합니다. 감정이 없는 사람이 아니라 감정을 부드럽게 꺼내는 통로가 늦게 열리는 쪽으로 읽는 편이 정확합니다.";
  }
  if (chapterId === "people_family_environment") {
    return "사람·가족·환경에서는 가족 부탁, 팀 역할, 친구 고민, 공개적인 자리에서 맡게 되는 정리 역할이 반복될 수 있습니다. 도움을 주기 전에 범위와 마감을 정하면 책임이 혼자에게 몰리는 일을 줄일 수 있습니다.";
  }
  if (chapterId === "risk_and_growth") {
    return "리스크와 성장은 겁주는 예언이 아니라 운영법입니다. 밤 산책, 기록, 수면, 물 마시는 루틴, 맡을 일과 버릴 일의 구분이 강한 책임감을 오래 쓰게 만드는 장치가 됩니다.";
  }
  if (chapterId === "final_message") {
    return "오늘부터 바꿀 기준은 거창할 필요가 없습니다. 회의 전 질문 하나, 계좌와 예산 분리, 잠들기 전 기록 닫기, 부탁받은 일의 범위 확인처럼 작은 장치가 오래 가는 힘을 만듭니다.";
  }

  return `${chapterTitleById[chapterId]}에서는 큰 방향, 빠른 판단, 책임을 떠안는 습관이 같이 보입니다. ${chapterTitleById[chapterId]}의 힘은 성과로 쓰면 강점이지만, 쉬는 기준이 늦어지면 마음도 몸도 무거워질 수 있습니다.`;
}

function buildLocalLongformReading(input: {
  readonly readingId: ComprehensiveReportV2LongformReadingId;
  readonly mbtiType: string;
  readonly primaryTerms: readonly string[];
  readonly profileTable: ComprehensiveReportV2ProfileTable;
  readonly evidencePacket: ComprehensiveReportEvidencePacket;
}): ComprehensiveReportV2LongformReading {
  const titleKo = longformTitleById[input.readingId];
  const linkedChapterIds = getLinkedChapterIds(input.readingId);
  const chapterByReading: Partial<Record<ComprehensiveReportV2LongformReadingId, ComprehensiveReportV2ChapterId>> = {
    opening: "opening", baseSajuReading: "saju_identity", sajuMbtiBridgeReading: "personality_pattern",
    workMoneyStudyReading: "work_money_study", loveRelationshipReading: "love_relationships",
    peopleFamilyEnvironmentReading: "people_family_environment", riskGrowthReading: "risk_and_growth", finalMessage: "final_message",
  };
  const linkedScene = chapterByReading[input.readingId];
  const bridgeScenes = (input.evidencePacket.sajuMbtiBridgeEvidence ?? []).filter(scene => scene.chapterId === linkedScene);
  const sceneReading = bridgeScenes.map(scene => [scene.sentenceSeed, scene.sceneSeed, scene.strength, scene.fatiguePoint, scene.practicalSwitch].filter(Boolean).join(" ")).join("\n\n");
  const body = (input.readingId === "sajuMbtiBridgeReading" && sceneReading ? sceneReading : buildLongformBody({
    titleKo,
    readingId: input.readingId,
    mbtiType: input.mbtiType,
    primaryTerms: input.primaryTerms,
    profileTable: input.profileTable,
  })) + (sceneReading && input.readingId !== "sajuMbtiBridgeReading" ? "\n\n" + sceneReading : "") + "\n\n" + featureReading(input.evidencePacket, COMPREHENSIVE_REPORT_V2_LONGFORM_READING_IDS.indexOf(input.readingId)) + (linkedScene ? "\n\n" + buildHitReadingLines(linkedScene).join(" ") : "");

  return {
    readingId: input.readingId,
    titleKo,
    body,
    linkedChapterIds,
    sajuTermsUsed: input.primaryTerms.slice(0, 2),
    mbtiTermsUsed: input.mbtiType ? [input.mbtiType] : [],
  };
}

function buildLongformBody(input: {
  readonly titleKo: string;
  readonly readingId: ComprehensiveReportV2LongformReadingId;
  readonly mbtiType: string;
  readonly primaryTerms: readonly string[];
  readonly profileTable: ComprehensiveReportV2ProfileTable;
}): string {
  const [firstTerm, secondTerm] = input.primaryTerms;
  const elementSummary = input.profileTable.fiveElementSummary.join(" · ");
  const domainLine = getDomainLongformLine(input.readingId);
  const mbtiLine = getLongformMbtiLine(input.readingId, input.mbtiType);
  const elementLine = getLongformElementLine(input.readingId, elementSummary);
  const closingLine = getLongformClosingLine({
    readingId: input.readingId,
    firstTerm,
    mbtiType: input.mbtiType,
  });

  return [
    `${input.titleKo}에서는 「${firstTerm}」과 「${secondTerm}」의 긴장과 보완 지점을 함께 봅니다. ${input.titleKo}의 핵심은 용어를 외우게 하는 것이 아니라 실제 말투, 돈 관리, 관계 피로, 회복 루틴으로 번역하는 데 있습니다.`,
    mbtiLine,
    elementLine,
    domainLine,
    closingLine,
  ].join(" ");
}

const chapterReadingId: Record<ComprehensiveReportV2ChapterId, ComprehensiveReportV2LongformReadingId> = {
  opening: "opening", saju_identity: "baseSajuReading", personality_pattern: "sajuMbtiBridgeReading", work_money_study: "workMoneyStudyReading",
  love_relationships: "loveRelationshipReading", people_family_environment: "peopleFamilyEnvironmentReading", risk_and_growth: "riskGrowthReading", final_message: "finalMessage",
};
function featureReading(packet: ComprehensiveReportEvidencePacket, index: number): string {
  const entries = packet.sajuFeatureDictionary ?? [];
  const entry = entries[index % entries.length];
  if (!entry) return "";
  return `원국에서 확인한 「${entry.rawLabel}」의 뜻은 다음과 같습니다. ${entry.plainMeaning} ${entry.howItShowsInYou} 강점으로 쓰이는 장면: ${entry.strength} 피로로 바뀌는 장면: ${entry.fatiguePoint} 실제 적용 기준: ${entry.practicalUse}`;
}
function getLongformElementLine(readingId: ComprehensiveReportV2LongformReadingId, elementSummary: string): string {
  const counts = [...elementSummary.matchAll(/([목화토금수])\s*(\d+)/gu)].map(m => ({ label: m[1], count: Number(m[2]) }));
  const missing = counts.filter(e => e.count === 0).map(e => e.label);
  const max = Math.max(...counts.map(e => e.count));
  const dominant = counts.filter(e => e.count === max).map(e => e.label);
  return `${longformTitleById[readingId]}의 오행 근거는 ${elementSummary}입니다. 확인된 기둥에서 ${missing.length ? missing.join("·") + " 항목이 0으로 집계됩니다" : "다섯 오행이 모두 나타납니다"}. 가장 많이 나타나는 항목은 ${dominant.join("·")}입니다. 이 숫자는 원국의 구성 비중이며 건강이나 성과의 점수가 아닙니다. 부족한 항목을 성격의 결함으로 단정하기보다, ${readingId === "workMoneyStudyReading" ? "공부 계획과 돈 관리에서 실행·기록·휴식 중 무엇이 빠지는지" : readingId === "loveRelationshipReading" ? "연인과 대화할 때 표현과 경청의 균형이 어떤지" : longformTitleById[readingId] + "에서 실제 선택과 회복의 균형이 어떤지"} 확인하는 기준으로 사용하세요.`;
}
function getLongformMbtiLine(readingId: ComprehensiveReportV2LongformReadingId, mbtiType: string): string {
  const source = getMbtiSourceProfile(mbtiType);
  const areaByReading: Record<ComprehensiveReportV2LongformReadingId, MbtiTraitArea> = {
    opening: "identity", baseSajuReading: "thinkingStyle", sajuFeatureReading: "strengths", mbtiReading: "communication", sajuMbtiBridgeReading: "workplace",
    workMoneyStudyReading: "career", loveRelationshipReading: "love", peopleFamilyEnvironmentReading: "relationships", riskGrowthReading: "risks", finalMessage: "growth",
  };
  if (!source) return `${longformTitleById[readingId]}에는 MBTI 미입력을 반영하여 확인된 명리 근거와 생활 경험을 중심으로 살펴봅니다.`;
  const functionTraits = readingId === "mbtiReading"
    ? (source.traits?.thinkingStyle ?? []).filter(t => Object.values(source.functionStack ?? {}).some(code =>
      [t.id, t.label, t.plainKo].some(text => text && new RegExp(`(?:^|[^a-z])${code}(?=$|[^a-z])`, "iu").test(text))))
    : [];
  const traits = functionTraits.length ? functionTraits : source.traits?.[areaByReading[readingId]] ?? [];
  const lines = traits.slice(0, 2).flatMap(t => [t.plainKo, t.strongLine, t.positiveUse, t.risk]).filter((v): v is string => typeof v === "string" && v.length > 0);
  const description = (lines.length ? [...new Set(lines)].join(" ") : source.oneLine).replace(/진단/gu, "점검").replace(/문서/gu, "업무 기록").replace(/보장/gu, "확보").replace(/물리치료/gu, "재활 지원").replace(/치료 보조/gu, "돌봄 지원").replace(/스포트라이트/gu, "무대의 관심");
  return `${longformTitleById[readingId]}에서 입력한 MBTI ${source.type}의 성향을 함께 봅니다. ${description}`;
}
const reflectionByReading: Record<ComprehensiveReportV2LongformReadingId, string> = {
  opening: "처음 읽을 때는 가장 익숙한 장면 하나와 낯선 장면 하나를 골라 보세요. 익숙하다는 느낌만으로 모든 해석을 받아들이기보다, 실제로 언제 누구와 그런 일이 있었는지 떠올리는 편이 좋습니다. 상대가 보는 모습과 혼자 있을 때의 차이도 중요한 단서입니다.",
  baseSajuReading: "원국의 구성은 바뀌지 않지만 같은 조건을 사용하는 방식은 달라질 수 있습니다. 최근 맡은 역할에서 힘이 났던 일과 부담스러웠던 일을 나누어 적어 보세요. 두 목록의 차이를 보면 자신에게 필요한 환경을 더 구체적으로 설명할 수 있습니다.",
  sajuFeatureReading: "표식은 이름의 인상보다 풀이와 적용 장면을 함께 읽어야 합니다. 도움이 됐던 인연, 갈등이 줄었던 말, 일이 잘 풀렸던 준비 과정을 각각 떠올려 보세요. 맞지 않는 경험은 지우지 말고 해석의 한계로 남겨 두는 것이 좋습니다.",
  mbtiReading: "유형을 입력하지 않았다면 외향·내향이나 인지 기능을 추정하지 않습니다. 대화를 시작할 때 무엇을 먼저 묻는지, 결정을 내릴 때 어떤 정보를 찾는지 관찰해 보세요. 여유 있을 때와 급한 상황에서의 차이를 비교하면 유형명 없이도 자신을 설명할 수 있습니다.",
  sajuMbtiBridgeReading: "명리의 표현과 행동 성향은 같은 뜻으로 바꿔 쓸 수 없습니다. 업무 요청을 받을 때 생각한 이유와 실제로 한 말을 따로 적어 보세요. 의도와 전달 사이의 차이를 발견하면 자신의 강점을 상황에 맞게 사용하는 연습을 할 수 있습니다.",
  workMoneyStudyReading: "일에서는 맡을 범위와 마감, 돈에서는 지출 한도와 정산일, 학습에서는 확인할 결과물을 먼저 정해 보세요. 좋은 계획도 사용 가능한 시간보다 커지면 실행하기 어렵습니다. 일주일 동안 유지할 수 있는 가장 작은 단위로 줄여 시작하는 편이 도움이 됩니다.",
  loveRelationshipReading: "가까운 관계에서는 상대에게 기대한 행동을 구체적으로 말해 보세요. 연락 횟수 자체보다 약속을 바꿀 때 알리는 방식과 갈등 뒤 다시 대화하는 태도를 함께 살피는 것이 좋습니다. 서로 편안했던 상황을 공유하면 원하는 관계의 기준이 선명해집니다.",
  peopleFamilyEnvironmentReading: "가족의 부탁과 팀의 요청이 겹치면 먼저 한 약속부터 확인하세요. 도울 수 있는 시간과 어려운 범위를 함께 말하면 관계를 끊지 않고도 부담을 조정할 수 있습니다. 누구에게 어떤 도움을 받을 수 있는지 적어 두는 일도 환경을 바꾸는 작은 시작입니다.",
  riskGrowthReading: "피로할 때 반복하는 선택을 알아두면 중단 시점을 놓치지 않을 수 있습니다. 일정이 밀릴 때 수면과 식사까지 줄이는지, 답장을 미루는지 관찰해 보세요. 해야 할 일의 양을 줄이거나 도움을 청할 기준을 미리 정하면 회복을 뒤로 미루는 일을 줄일 수 있습니다.",
  finalMessage: "이번 주에 바꿀 행동은 하나면 충분합니다. 일에서는 약속 범위, 돈에서는 사용 한도, 관계에서는 요청하는 말, 회복에서는 쉬는 시간을 기준으로 삼아 보세요. 다음 주에는 잘 지킨 횟수보다 그 행동이 생활을 얼마나 편하게 만들었는지 돌아보세요.",
};
function getLongformClosingLine(input: { readonly readingId: ComprehensiveReportV2LongformReadingId; readonly firstTerm: string; readonly mbtiType: string }): string {
  return reflectionByReading[input.readingId];
}

function getDomainLongformLine(
  readingId: ComprehensiveReportV2LongformReadingId,
): string {
  if (readingId === "opening") {
    return "전체 성향에서는 원국의 구성과 입력한 행동 성향을 구분해 읽습니다. 어떤 자리에 힘이 모이는지 살펴본 뒤 일과 관계에서 그 힘이 도움이 된 경험을 확인하세요.";
  }
  if (readingId === "baseSajuReading") {
    return "사주 골격에서는 일간, 일주, 오행, 십성의 균형을 먼저 읽습니다. 이 골격은 성격을 단정하는 말이 아니라 어디서 기준이 빨라지고 어디서 부담이 쌓이는지 보여주는 지도에 가깝습니다.";
  }
  if (readingId === "sajuFeatureReading") {
    return "주요 표식은 신살과 귀인의 이름을 외우는 장이 아니라 실제 생활에서 어떻게 체감되는지 확인하는 장입니다. 도움을 받는 통로, 날카로운 말, 책임의 누적, 회복의 빈자리를 각각 다른 장면으로 풀어 읽습니다.";
  }
  if (readingId === "mbtiReading") {
    return "MBTI 성향은 명리 구조를 덮어쓰지 않습니다. 표에 있는 성향과 실제 대화, 공부, 의사결정 사례를 비교하고, 다른 경험은 그대로 남겨 두세요. 자기보고 유형도 상황과 경험에 따라 다르게 느껴질 수 있습니다.";
  }
  if (readingId === "workMoneyStudyReading") {
    return "일·돈·공부에서는 아이디어를 떠올리면 이걸 어떻게 팔지까지 빨리 가는 편입니다. 수익화 감각이 빠른 사람일수록 정산일, 권한, 책임 범위를 늦게 쓰면 손해를 봅니다. 프로젝트를 시작할 때는 열정이 아니라 기록과 조건 합의가 먼저이고, 공부는 자격증과 전문서를 실제 포트폴리오에 붙일 때 집중력이 살아납니다.";
  }
  if (readingId === "loveRelationshipReading") {
    return "연애와 관계에서는 감정이 깊어도 상대가 무책임하면 마음이 빠르게 식을 수 있습니다. 말로 사랑한다고 해도 행동 기준이 흐리면 신뢰가 쌓이지 않습니다. 상대가 감정을 말할 때 해결책을 주고 싶겠지만, 그 순간 상대가 원하는 것은 답보다 내 편이라는 확인일 수 있습니다.";
  }
  if (readingId === "peopleFamilyEnvironmentReading") {
    return "사람·가족·환경에서는 가족 부탁, 팀의 빈자리, 친구의 고민을 보면 내가 정리해야겠다는 감각이 먼저 올라올 수 있습니다. 공개적인 자리에서는 말과 행동이 빠르게 퍼질 수 있으므로 기준을 세우되 표현의 선을 같이 잡아야 합니다. 도움을 요청하는 쪽도 약점이 아니라 통로를 여는 기술로 읽어야 합니다.";
  }
  if (readingId === "riskGrowthReading") {
    return "리스크와 성장은 겁주는 말이 아니라 운영법입니다. 밤 산책, 수면, 기록, 물 마시기처럼 식히는 루틴을 일정에 넣고, 맡을 일과 버릴 일을 분리해야 합니다. 번아웃 전에는 몸이 먼저 신호를 보내기보다 짜증, 말투, 표정에서 먼저 날카로움이 올라올 수 있습니다.";
  }
  if (readingId === "sajuMbtiBridgeReading") {
    return "명리와 MBTI가 비슷하게 설명하는 부분은 반복되는 선택을 관찰하는 출발점입니다. 서로 다르게 설명하는 부분도 오류라고 단정하지 말고, 회의·카톡·가족 부탁처럼 환경이 달랐던 사례를 나누어 보세요. 명리는 계산된 구조를, MBTI는 사용자가 알려 준 행동 성향을 읽습니다. 어느 한쪽만으로 다른 쪽의 값을 추정하거나 실제 경험보다 우선하지 않습니다.";
  }
  if (readingId === "finalMessage") {
    return "마지막 기준은 더 많은 의지를 요구하지 않습니다. 일과 돈은 기록으로 묶고, 가까운 관계에서는 감정 확인을 먼저 두며, 회복은 일정으로 넣는 작은 장치를 반복하는 것이 이 구조를 오래 쓰는 방법입니다.";
  }

  return "이 섹션은 원국의 다른 면을 생활 언어로 옮기는 보조 장입니다.";
}

function getLinkedChapterIds(
  readingId: ComprehensiveReportV2LongformReadingId,
): readonly ComprehensiveReportV2ChapterId[] {
  if (readingId === "workMoneyStudyReading") return ["work_money_study"];
  if (readingId === "loveRelationshipReading") return ["love_relationships"];
  if (readingId === "peopleFamilyEnvironmentReading") {
    return ["people_family_environment"];
  }
  if (readingId === "riskGrowthReading") return ["risk_and_growth"];
  if (readingId === "finalMessage") return ["final_message"];
  return ["saju_identity", "personality_pattern"];
}

function getPrimarySajuTerms(
  profileTable: ComprehensiveReportV2ProfileTable,
  featureChapter: ComprehensiveReportV2SajuFeatureChapter,
): readonly string[] {
  return uniqueValues([
    profileTable.dayPillar,
    profileTable.dayMaster,
    ...profileTable.excessiveElements,
    ...profileTable.missingElements,
    ...profileTable.tenGodSummary,
    ...profileTable.specialPatterns,
    ...profileTable.sinsal,
    ...profileTable.gwiin,
    ...featureChapter.items.map((item) => item.rawLabel),
  ]).slice(0, 6);
}

function toMbtiType(value: string): MbtiType | "" {
  return value as MbtiType | "";
}

function toSajuGender(
  gender: SinglePersonGenerationInput["person"]["gender"],
): SajuCalcGender {
  if (gender === "MALE" || gender === "FEMALE") {
    return gender;
  }

  return "OTHER_OR_UNSPECIFIED";
}

function formatKoreanPillar(pillar: Pillar): KoreanGanji {
  return `${koreanStemByHanja[pillar.stem]}${koreanBranchByHanja[pillar.branch]}`;
}

function uniqueValues<T extends string>(values: readonly (T | undefined)[]): readonly T[] {
  return [...new Set(values.filter((value): value is T => typeof value === "string" && value.trim().length > 0))];
}

function comprehensiveV2Failure(input: {
  readonly code: ComprehensiveV2GenerationErrorCode;
  readonly message: string;
}): ComprehensiveV2GenerationResult {
  return {
    ok: false,
    kind: "comprehensiveV2",
    error: input,
  };
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Unknown comprehensive V2 generation error.";
}
