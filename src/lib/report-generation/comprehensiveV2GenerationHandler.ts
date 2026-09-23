import { withReportInputEvidence } from "./reportInputEvidence";
import { correctSourceParticles, comprehensiveSectionActions, buildComprehensiveNarrativePlan, buildComprehensiveNarrativeBody, buildComprehensiveActions, buildComprehensiveFinalAdvice, comprehensiveSectionFeatures, chapterReadingId, narrativeTitles } from "./comprehensiveNarrative";
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

  evidence = { ...evidence, packet: { ...evidence.packet, narrativePlan: buildComprehensiveNarrativePlan(evidence.packet) } };

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
  if (["zheng_yin", "pian_yin"].every(id => tenGodSignals.some(signal => signal.tenGod === id && signal.strength === "missing"))) {
    patterns.push("no_resource");
  }
  if (["shi_shen", "shang_guan"].every(id => tenGodSignals.some(signal => signal.tenGod === id && signal.strength === "missing"))) {
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
  const normalizedFeatures = normalizeSajuFeatureChapter(calculatedFeatures);
  const featureChapter = {
    ...normalizedFeatures,
    items: normalizedFeatures.items.map(item => ({
      ...item,
      howItShowsInYou: correctSourceParticles(item.howItShowsInYou),
      fatiguePoint: correctSourceParticles(item.fatiguePoint),
      practicalUse: correctSourceParticles(item.practicalUse),
    })),
  };
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
    finalAdvice: buildComprehensiveFinalAdvice(input.evidencePacket),
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
  const readingId = chapterReadingId[input.chapterId];
  const titleKo = chapterTitleById[input.chapterId];
  const body = buildComprehensiveNarrativeBody(input.evidencePacket, input.profileTable, readingId);
  const selected = input.evidencePacket.selectedSajuFeatureEvidence?.find(c=>c.chapterId===input.chapterId)?.features ?? [];
  const features = comprehensiveSectionFeatures(input.evidencePacket, readingId);
  const terms = features.map(f=>f.rawLabel).filter(term=>body.includes(term));
  const solutions = comprehensiveSectionActions(input.evidencePacket,readingId,["work_money_study","love_relationships","risk_and_growth"].includes(input.chapterId)?4:2);
  if(input.chapterId === "love_relationships") {
    solutions[0] = `맞는 상대를 살필 때: ${solutions[0]}`;
    solutions[1] = `피해야 할 패턴을 살필 때: ${solutions[1]}`;
    solutions[2] = `감정 완충과 표현 온도를 조율할 때: ${solutions[2]}`;
  }
  return {
    chapterId: input.chapterId, titleKo,
    headline: `${titleKo} — ${input.evidencePacket.narrativePlan?.themes[0]?.title ?? input.primaryTerms[0]}`,
    hitReadingLines: selected.slice(0,3).map(f=>`「${f.labelKo}」이 생활에서 드러나는 장면: ${f.sceneSeeds[0] ?? f.positiveReading}`),
    body,
    solutionLines: input.chapterId === "opening" ? [] : input.chapterId === "final_message" ? buildComprehensiveActions(input.evidencePacket) : solutions,
    keyPhrases: [titleKo, ...terms.slice(0,3)],
    sajuTermsUsed: terms.length ? terms : (input.evidencePacket.sajuFeatureDictionary??[]).map(f=>f.rawLabel).filter(t=>body.includes(t)).slice(0,2),
    mbtiTermsUsed: input.mbtiType ? [input.mbtiType] : [],
  };
}

function buildLocalLongformReading(input: {
  readonly readingId: ComprehensiveReportV2LongformReadingId;
  readonly mbtiType: string;
  readonly primaryTerms: readonly string[];
  readonly profileTable: ComprehensiveReportV2ProfileTable;
  readonly evidencePacket: ComprehensiveReportEvidencePacket;
}): ComprehensiveReportV2LongformReading {
  return {
    readingId: input.readingId,
    titleKo: narrativeTitles[input.readingId],
    body: buildComprehensiveNarrativeBody(input.evidencePacket,input.profileTable,input.readingId),
    linkedChapterIds: getLinkedChapterIds(input.readingId),
    sajuTermsUsed: comprehensiveSectionFeatures(input.evidencePacket,input.readingId).map(f=>f.rawLabel),
    mbtiTermsUsed: input.mbtiType ? [input.mbtiType] : [],
  };
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
