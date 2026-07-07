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
  ComprehensiveReportV2SajuFeatureChapterItem,
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

const defaultMbtiType = "ENTJ" satisfies MbtiType;

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
    mbtiType: evidence.packet.mbtiType,
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
    evidencePacket: evidence.packet,
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

  return { packet, facts };
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
    birthTimeUnknown: person.birthTimeUnknown || birthTime.length === 0,
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
  const featureChapter = normalizeSajuFeatureChapter(
    buildDeterministicSajuFeatureChapter(input.evidencePacket) ??
    buildBasicSajuFeatureChapter(input.profileTable),
  );
  const primaryTerms = getPrimarySajuTerms(input.profileTable, featureChapter);
  const mbtiType = input.evidencePacket.mbtiType;

  return {
    version: "comprehensive_v2_draft",
    productType: "saju_mbti_full",
    openingTitle: `${input.input.person.name}님의 사주×MBTI 종합 리포트`,
    openingSummary:
      `${input.input.person.name}님의 원국은 ${primaryTerms.slice(0, 3).join(", ")}을 중심으로 읽습니다. MBTI는 원인이 아니라 이 구조가 생활에서 드러나는 행동 방식으로만 연결합니다.`,
    coreLine:
      `${primaryTerms[0]}의 방향성과 ${mbtiType}의 실행 감각이 만나면, 기준을 빨리 세우고 책임을 현실 장면으로 옮기는 힘이 강해집니다.`,
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
      }),
    ),
    longformReadings: COMPREHENSIVE_REPORT_V2_LONGFORM_READING_IDS.map((readingId) =>
      buildLocalLongformReading({
        readingId,
        mbtiType,
        primaryTerms,
        profileTable: input.profileTable,
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
}): ComprehensiveReportV2Chapter {
  const titleKo = chapterTitleById[input.chapterId];
  const body = buildChapterBody({
    titleKo,
    chapterId: input.chapterId,
    mbtiType: input.mbtiType,
    primaryTerms: input.primaryTerms,
    profileTable: input.profileTable,
  });

  return {
    chapterId: input.chapterId,
    titleKo,
    headline: buildChapterHeadline(titleKo, input.primaryTerms),
    hitReadingLines: buildHitReadingLines(input.chapterId),
    body,
    solutionLines: buildSolutionLines(input.chapterId),
    keyPhrases: [titleKo, ...input.primaryTerms.slice(0, 2)],
    sajuTermsUsed: input.primaryTerms.slice(0, 2),
    mbtiTermsUsed: [input.mbtiType],
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
    `${input.titleKo}에서는 ${firstTerm}라는 표식을 중심으로 보되, ${secondTerm}까지 함께 만들어내는 반응 속도를 같이 읽습니다. ${input.titleKo}의 ${firstTerm}은 이름만 외우는 표식이 아니라 실제 선택의 방향을 잡는 기준입니다.`,
    `${input.titleKo}에서 ${input.mbtiType} 성향은 이 구조의 원인이 아니라 밖으로 드러나는 방식입니다. ${input.titleKo}의 장면에서는 비효율적인 사람을 그냥 넘기기 어렵고, 책임 없이 말만 많은 구조에는 호감이 있어도 빠르게 식을 수 있습니다.`,
    `${input.titleKo}의 오행 분포는 ${elementSummary}입니다. ${input.titleKo}에서 이 분포는 사건을 맞히는 표가 아니라 책임, 표현 온도, 회복 루틴을 어디서 의식적으로 보완해야 하는지 알려주는 생활 기준입니다.`,
    contextLine,
    `${input.titleKo}에서 ${firstTerm}, 그리고 ${input.mbtiType}의 빠른 결론 성향이 겹치면 핵심 오류를 빨리 잡지만, 관계에서는 평가처럼 들릴 수 있습니다. 그래서 ${input.titleKo}의 기준은 강점을 줄이는 것이 아니라 말의 순서와 역할의 경계선을 먼저 정하는 데 있습니다.`,
  ].join(" ");
}

function buildChapterHeadline(
  titleKo: string,
  primaryTerms: readonly string[],
): string {
  return `${titleKo}은 ${primaryTerms[0]}와 ${primaryTerms[1]}을 현실 장면으로 번역하는 장입니다.`;
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
    ];
  }
  if (chapterId === "people_family_environment") {
    return [
      "가족 부탁이나 팀 역할이 들어오면 먼저 범위와 마감선을 정해야 마음이 놓입니다.",
      "도움을 요청하기 전까지 혼자 버티려는 습관이 피로를 키울 수 있습니다.",
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
      "보완 기운은 수 부족과 화 부족을 채우듯 감정 완충과 표현 온도를 더해 주는 쪽입니다.",
      "MBTI만으로 궁합을 단정하지 말고 대화 속도와 약속 습관을 함께 보세요.",
    ];
  }
  if (chapterId === "risk_and_growth") {
    return [
      "번아웃 전 중단 기준을 숫자와 일정으로 정하세요.",
      "수분, 수면, 밤 산책, 기록을 식히는 루틴으로 고정하세요.",
      "햇빛과 가벼운 운동으로 화 부족의 표현 에너지를 보완하세요.",
      "책임 덜어내기와 경계선 정리로 토 과다의 부담을 낮추세요.",
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
}): ComprehensiveReportV2LongformReading {
  const titleKo = longformTitleById[input.readingId];
  const linkedChapterIds = getLinkedChapterIds(input.readingId);
  const body = buildLongformBody({
    titleKo,
    readingId: input.readingId,
    mbtiType: input.mbtiType,
    primaryTerms: input.primaryTerms,
    profileTable: input.profileTable,
  });

  return {
    readingId: input.readingId,
    titleKo,
    body,
    linkedChapterIds,
    sajuTermsUsed: input.primaryTerms.slice(0, 2),
    mbtiTermsUsed: [input.mbtiType],
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
    `${input.titleKo}에서는 ${firstTerm}과 ${secondTerm}이 만드는 긴장과 보완 지점을 함께 봅니다. ${input.titleKo}의 핵심은 용어를 외우게 하는 것이 아니라 실제 말투, 돈 관리, 관계 피로, 회복 루틴으로 번역하는 데 있습니다.`,
    mbtiLine,
    elementLine,
    domainLine,
    closingLine,
  ].join(" ");
}

function getLongformElementLine(
  readingId: ComprehensiveReportV2LongformReadingId,
  elementSummary: string,
): string {
  if (readingId === "opening") {
    return `오행 분포는 ${elementSummary}입니다. 첫인상에서는 토의 책임감이 먼저 보이고, 화와 수의 빈자리는 표현 온도와 회복 루틴을 따로 만들어야 하는 과제로 남습니다.`;
  }
  if (readingId === "baseSajuReading") {
    return `오행을 보면 ${elementSummary} 흐름입니다. 목은 방향을 세우고 금은 기준을 자르지만, 토가 무거울수록 결정한 일을 오래 끌고 가는 대신 마음의 하중도 같이 커집니다.`;
  }
  if (readingId === "sajuFeatureReading") {
    return `표식 해석에서는 ${elementSummary}의 균형을 함께 봅니다. 신살과 귀인은 이름보다 생활 반응으로 읽고, 부족한 화와 수는 말의 온도와 식히는 장치를 의식적으로 보완해야 합니다.`;
  }
  if (readingId === "mbtiReading") {
    return `MBTI를 볼 때도 ${elementSummary}의 오행 배경을 빼면 설명이 얕아집니다. 토가 강한 책임감은 목표 지향성을 오래 버티게 하지만, 수의 완충이 적으면 머리를 끄는 루틴이 늦게 잡힐 수 있습니다.`;
  }
  if (readingId === "sajuMbtiBridgeReading") {
    return `명리×MBTI 연결에서는 ${elementSummary}가 행동의 배경이 됩니다. 강한 토는 책임을 끝까지 끌고 가게 만들고, 비어 있는 화와 수는 표현과 회복을 자동값이 아니라 운영값으로 바꿉니다.`;
  }
  if (readingId === "workMoneyStudyReading") {
    return `일과 돈에서는 ${elementSummary}가 현실감으로 작동합니다. 토가 강할수록 일을 끝까지 붙잡지만, 회복을 미루면 정산일과 책임 범위를 챙기는 판단도 같이 무거워질 수 있습니다.`;
  }
  if (readingId === "loveRelationshipReading") {
    return `관계에서는 ${elementSummary}가 말의 온도에 영향을 줍니다. 화가 약하면 마음이 없는 것이 아니라 따뜻하게 꺼내는 속도가 늦고, 수가 약하면 감정을 식히는 시간이 따로 필요합니다.`;
  }
  if (readingId === "peopleFamilyEnvironmentReading") {
    return `사람과 환경에서는 ${elementSummary}가 역할 감각으로 드러납니다. 토가 강하면 부탁을 끝까지 처리하지만, 수의 완충이 적으면 도움을 요청하기 전에 혼자 버티는 시간이 길어질 수 있습니다.`;
  }
  if (readingId === "riskGrowthReading") {
    return `리스크 관점에서 ${elementSummary}는 과로의 위치를 보여줍니다. 토가 쌓이면 책임은 버티지만 몸과 말투가 먼저 딱딱해지고, 화와 수의 보완은 산책, 수면, 기록처럼 실제 루틴으로 넣어야 합니다.`;
  }

  return `마지막 기준에서도 ${elementSummary}는 중요합니다. 강한 책임감은 살리되 표현과 회복을 일정으로 보완해야 오래 갑니다.`;
}

function getLongformMbtiLine(
  readingId: ComprehensiveReportV2LongformReadingId,
  mbtiType: string,
): string {
  if (readingId === "opening") {
    return `${mbtiType} 성향은 전체 결을 밖으로 꺼낼 때 빠른 판단과 목표 정리로 나타납니다. 이 리포트에서는 유형 설명을 반복하기보다 원국의 책임감이 실제 선택 속도로 바뀌는 장면을 먼저 봅니다.`;
  }
  if (readingId === "baseSajuReading") {
    return `${mbtiType}는 사주 골격을 대신하지 않고, 그 골격이 말투와 판단 방식으로 드러나는 모습을 돕는 보조 언어입니다. 기본 형상에서는 방향을 잡는 힘과 책임을 떠안는 습관이 먼저 읽힙니다.`;
  }
  if (readingId === "sajuFeatureReading") {
    return `${mbtiType} 성향은 신살과 귀인의 이름을 설명하는 원인이 아니라, 그 표식이 생활 속에서 어떻게 쓰이는지 보여주는 행동 언어입니다. 표식은 사건 예언보다 반복되는 반응과 피로 지점을 읽는 데 초점을 둡니다.`;
  }
  if (readingId === "mbtiReading") {
    return `${mbtiType}는 효율, 기준, 목표 지향성만으로 끝나지 않습니다. 능력 없는 권위에 낮은 인내심을 보이거나, 논쟁을 친밀감처럼 느끼는 결도 사주 구조의 판단 속도와 함께 읽어야 합니다.`;
  }
  if (readingId === "workMoneyStudyReading") {
    return `${mbtiType} 성향은 비효율을 보면 개편안을 먼저 떠올리는 쪽으로 드러납니다. 일에서는 이 감각이 기획력, 협상력, 프로젝트 정리력으로 살아나지만 정산일과 책임 범위를 늦게 쓰면 실력이 손해로 바뀔 수 있습니다.`;
  }
  if (readingId === "loveRelationshipReading") {
    return `${mbtiType} 성향은 관계에서도 막연한 위로보다 해결책을 먼저 찾게 만들 수 있습니다. 상대가 감정을 말하는 순간에는 답을 주기보다 내 편이라는 확인을 먼저 건네야 말의 온도가 살아납니다.`;
  }
  if (readingId === "peopleFamilyEnvironmentReading") {
    return `${mbtiType} 성향은 가족, 팀, 친구 관계에서 역할과 기준을 빨리 세우려는 방식으로 나타납니다. 권위보다 실력을 보려는 감각은 강점이지만, 공개적인 자리에서는 말의 선을 같이 잡아야 주변이 덜 긴장합니다.`;
  }
  if (readingId === "riskGrowthReading") {
    return `${mbtiType} 성향은 목표가 보이면 사람과 자원을 다시 배치하려는 쪽으로 강해집니다. 오래 쓰려면 더 밀어붙이는 기준보다 중단 기준, 수면, 기록, 산책처럼 식히는 장치를 먼저 일정에 넣어야 합니다.`;
  }
  if (readingId === "sajuMbtiBridgeReading") {
    return `${mbtiType}는 사주의 원인을 대신하지 않고 행동으로 드러나는 방식을 설명합니다. 명리의 판단 속도와 책임 위치가 MBTI의 목표 지향성과 만나면, 사용자는 자기 강점과 피로 지점을 더 구체적으로 알아차릴 수 있습니다.`;
  }
  if (readingId === "finalMessage") {
    return `${mbtiType} 성향을 오래 쓰려면 더 강하게 밀어붙이는 법보다 멈추는 기준을 배워야 합니다. 마지막 기준은 성취를 줄이는 것이 아니라 책임, 돈, 관계, 회복을 동시에 운영하는 장치를 만드는 데 있습니다.`;
  }

  return `${mbtiType} 성향은 섹션별 행동 장면으로만 짧게 연결합니다. 같은 문장을 반복하지 않고 원국의 다른 면을 생활 언어로 옮깁니다.`;
}

function getLongformClosingLine(input: {
  readonly readingId: ComprehensiveReportV2LongformReadingId;
  readonly firstTerm: string;
  readonly mbtiType: string;
}): string {
  if (input.readingId === "workMoneyStudyReading") {
    return `${input.firstTerm}과 ${input.mbtiType}의 목표 지향성이 겹치면 돈이 되는 판은 빨리 보입니다. 그래서 이 장에서는 확장보다 계약서, 정산일, 책임 범위, 철수 기준을 먼저 닫는 기준을 남깁니다.`;
  }
  if (input.readingId === "loveRelationshipReading") {
    return `${input.firstTerm}의 판단 속도와 ${input.mbtiType}의 해결 중심성이 겹치면 맞는 말이 너무 빨리 나갈 수 있습니다. 관계에서는 정확함보다 먼저 내 편이라는 확인을 건네는 순서가 오래 갑니다.`;
  }
  if (input.readingId === "peopleFamilyEnvironmentReading") {
    return `${input.firstTerm}과 ${input.mbtiType}의 역할 정리 감각이 만나면 가족과 팀에서 정리 담당이 되기 쉽습니다. 다만 맡기 전에 범위와 마감을 말해야 책임이 한 사람에게 몰리지 않습니다.`;
  }
  if (input.readingId === "riskGrowthReading") {
    return `${input.firstTerm}의 버티는 힘과 ${input.mbtiType}의 추진력이 겹치면 멈춤이 늦어질 수 있습니다. 회복은 기분이 좋아지면 하는 일이 아니라 일정표에 먼저 넣는 운영 기준입니다.`;
  }
  if (input.readingId === "sajuMbtiBridgeReading") {
    return `${input.firstTerm}은 판단의 방향을 보여주고 ${input.mbtiType}는 그 판단이 밖으로 나오는 속도를 보여줍니다. 두 근거를 함께 보면 강점은 더 선명해지고 피로 지점은 더 구체적으로 잡힙니다.`;
  }
  if (input.readingId === "finalMessage") {
    return `${input.firstTerm}의 힘을 오래 쓰려면 매일의 실행 기준이 필요합니다. 질문 하나, 기록 하나, 산책 하나처럼 작지만 반복 가능한 장치가 이 리포트의 마지막 기준입니다.`;
  }

  return `${input.firstTerm}의 결은 줄일 힘이 아니라 다루는 순서를 배울 힘입니다. 이 섹션에서는 빠른 판단을 생활 장면에 맞게 조정하는 방법을 남깁니다.`;
}

function getDomainLongformLine(
  readingId: ComprehensiveReportV2LongformReadingId,
): string {
  if (readingId === "opening") {
    return "전체 성향은 빠른 판단, 강한 책임감, 늦게 잡히는 회복 기준이 한꺼번에 보이는 구조입니다. 사용자는 일을 맡으면 판을 빨리 정리하지만, 마음의 온도와 쉬는 기준은 별도로 챙겨야 오래 갑니다.";
  }
  if (readingId === "baseSajuReading") {
    return "사주 골격에서는 일간, 일주, 오행, 십성의 균형을 먼저 읽습니다. 이 골격은 성격을 단정하는 말이 아니라 어디서 기준이 빨라지고 어디서 부담이 쌓이는지 보여주는 지도에 가깝습니다.";
  }
  if (readingId === "sajuFeatureReading") {
    return "주요 표식은 신살과 귀인의 이름을 외우는 장이 아니라 실제 생활에서 어떻게 체감되는지 확인하는 장입니다. 도움을 받는 통로, 날카로운 말, 책임의 누적, 회복의 빈자리를 각각 다른 장면으로 풀어 읽습니다.";
  }
  if (readingId === "mbtiReading") {
    return "MBTI 성향은 명리 구조를 덮어쓰지 않습니다. 다만 비효율을 못 넘기는 반응, 능력 중심의 권위 판단, 논쟁을 통해 가까워지는 방식처럼 사용자가 이미 익숙한 행동 언어를 제공해 줍니다.";
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
    return "현침살의 예리함과 빠른 결론 성향이 만나면 핵심 오류를 빨리 잡지만 말이 평가처럼 들릴 수 있습니다. 재성의 현실 감각과 목표 지향성이 겹치면 돈이 되는 판은 빨리 보지만 방어 규칙이 필요합니다. 토가 강한 구조와 책임감이 겹치면 맡은 일을 끝까지 끌고 가지만 쉬는 기준을 뒤로 미루기 쉽습니다. 화와 수가 약하면 감정이 없는 것이 아니라 부드럽게 꺼내고 식히는 통로를 의식적으로 만들어야 합니다.";
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

function buildBasicSajuFeatureChapter(
  profileTable: ComprehensiveReportV2ProfileTable,
): ComprehensiveReportV2SajuFeatureChapter {
  return {
    titleKo: "명리 특징 해석",
    subtitleKo:
      "공통 만세력표는 근거이고, 이 챕터는 원국 특징을 현실 언어로 풀어보는 해석입니다.",
    intro:
      "공통 만세력표에 표시되는 신살, 귀인, 합충, 지장간은 이름만 보면 어렵게 느껴질 수 있습니다. 이 챕터에서는 원국에 실제로 잡힌 표식을 사건 예언이 아니라 말투, 판단 속도, 도움을 요청하는 방식, 관계 반응, 회복 루틴으로 번역합니다.",
    items: getBasicFeatureItems(profileTable),
  };
}

function normalizeSajuFeatureChapter(
  chapter: ComprehensiveReportV2SajuFeatureChapter,
): ComprehensiveReportV2SajuFeatureChapter {
  return {
    ...chapter,
    items: chapter.items.map((item) => {
      const clarifier = getRawLabelClarifier(item.rawLabel);

      if (clarifier.length === 0) {
        return item;
      }

      return {
        ...item,
        plainMeaning: appendSentence(item.plainMeaning, clarifier),
        howItShowsInYou: appendSentence(item.howItShowsInYou, clarifier),
      };
    }),
  };
}

function getRawLabelClarifier(rawLabel: string): string {
  if (rawLabel.includes("양인")) {
    return "양인살은 강한 추진력, 정면 돌파, 고집, 승부 감각이 함께 올라오는 표식입니다.";
  }
  if (rawLabel.includes("현침")) {
    return "현침살은 말, 판단, 분석이 날카롭게 들어가 정밀하게 핵심을 보는 표식입니다.";
  }
  if (rawLabel.includes("천을")) {
    return "천을귀인은 도움의 통로와 위기 완충, 필요한 기회를 요청하는 감각으로 읽습니다.";
  }
  if (rawLabel.includes("화개")) {
    return "화개는 혼자 깊게 정리하고 사색하며 표현의 깊이를 만드는 표식입니다.";
  }
  if (rawLabel.includes("망신")) {
    return "망신살은 말과 행동이 밖으로 드러나는 장면에서 표현의 선을 신경 쓰게 하는 표식입니다.";
  }
  if (rawLabel.includes("백호")) {
    return "백호대살은 긴장 속 대응력과 강한 돌파력이 같이 살아나는 표식입니다.";
  }

  return "";
}

function appendSentence(text: string, sentence: string): string {
  return text.includes(sentence) ? text : `${text} ${sentence}`;
}

function getBasicFeatureItems(
  profileTable: ComprehensiveReportV2ProfileTable,
): readonly ComprehensiveReportV2SajuFeatureChapterItem[] {
  const candidates = uniqueValues([
    profileTable.dayPillar,
    ...profileTable.excessiveElements,
    ...profileTable.missingElements,
    ...profileTable.tenGodSummary,
    ...profileTable.specialPatterns,
    ...profileTable.sinsal,
    ...profileTable.gwiin,
  ]).slice(0, 5);

  const labels = candidates.length >= 3
    ? candidates
    : uniqueValues([...candidates, "사주 원국", "오행 균형", "MBTI 보조 발현"]);

  return labels.slice(0, 5).map((label) => ({
    rawLabel: label,
    userTitle: `${label}을 생활 언어로 풀어보기`,
    plainMeaning:
      `${label}은 운명을 단정하는 이름이 아니라 반복되는 반응과 선택 기준을 읽기 위한 표식입니다.`,
    howItShowsInYou:
      `${label}은 일과 관계에서 판단이 빨라지는 순간, 책임을 떠안는 방식, 감정을 밖으로 꺼내는 속도에 영향을 줄 수 있습니다.`,
    strength:
      `${label}을 잘 쓰면 기준을 빨리 세우고 복잡한 상황을 정리하는 힘으로 이어집니다.`,
    fatiguePoint:
      `${label}이 과하면 말이 빠르게 평가처럼 들리거나 쉬어야 할 때도 책임을 먼저 붙잡는 피로가 생길 수 있습니다.`,
    practicalUse:
      `${label}을 쓸 때는 결론 전에 질문을 넣고, 돈과 역할은 기록으로 남기며, 회복 루틴을 일정에 먼저 배치하세요.`,
  }));
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

function toMbtiType(value: string): MbtiType {
  return value === "" ? defaultMbtiType : value as MbtiType;
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
