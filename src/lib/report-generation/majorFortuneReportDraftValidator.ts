import {
  majorFortuneDomainLabels,
  type MajorFortuneDomainLabel,
  type MajorFortunePhase,
  type MajorFortuneReportDraft,
} from "./majorFortuneReportDraftTypes";

export type MajorFortuneReportDraftValidationResult = {
  readonly ok: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
  readonly value?: MajorFortuneReportDraft;
};

export type MajorFortuneDraftQualitySummary = {
  readonly hardClaimWarnings: number;
  readonly internalArtifactWarnings: number;
  readonly repeatedTerminologyWarnings: number;
  readonly annualToneWarnings: number;
  readonly decadeToneWarnings: number;
  readonly strongYearReasonWarnings: number;
  readonly cycleYearTimelineCount: number;
  readonly missingCycleYearWarnings: number;
  readonly cycleIndexLeakWarnings: number;
  readonly technicalTermWithoutExplanationWarnings: number;
  readonly smallEventOverfocusWarnings: number;
  readonly wrongCycleBasisWarnings: number;
  readonly genericTimelineWarnings: number;
  readonly repeatedSummaryWarnings: number;
  readonly weakStrategyWarnings: number;
  readonly relationshipStatusMisuseWarnings: number;
  readonly strongYearTitleRepeatWarnings: number;
  readonly repeatedThemeWarnings: number;
  readonly repeatedStrategyWarnings: number;
};

const hardClaimReplacements = [
  ["반드시", "대체로"],
  ["무조건", "상황에 따라"],
  ["합격합니다", "합격 가능성을 준비하는 흐름입니다"],
  ["불합격합니다", "결과 확인 전까지 보완이 필요한 흐름입니다"],
  ["이직합니다", "이직을 검토하는 흐름으로 나타날 수 있습니다"],
  ["퇴사합니다", "퇴사 여부를 검토하는 흐름으로 나타날 수 있습니다"],
  ["승진합니다", "승진이나 역할 변화를 준비하는 흐름으로 나타날 수 있습니다"],
  ["돈을 법니다", "돈의 흐름을 만들 가능성이 있습니다"],
  ["병이 생깁니다", "몸의 리듬을 살펴야 하는 흐름입니다"],
  ["결혼합니다", "관계를 공식화할지 검토하는 흐름으로 나타날 수 있습니다"],
  ["헤어집니다", "관계의 거리와 기준을 다시 보게 될 수 있습니다"],
  ["망합니다", "손실을 줄이는 기준이 중요합니다"],
  ["성공합니다", "성과로 이어질 가능성을 준비하는 흐름입니다"],
] as const;

const internalForbiddenWords = [
  "evidence",
  "debug",
  "diagnostic-only",
  "진단용",
  "schema",
  "fixture",
  "precomputed",
] as const;

const stemDayMasterReplacements = [
  ["甲일간", "甲(갑목) 일간"],
  ["甲 일간", "甲(갑목) 일간"],
  ["乙일간", "乙(을목) 일간"],
  ["乙 일간", "乙(을목) 일간"],
  ["丙일간", "丙(병화) 일간"],
  ["丙 일간", "丙(병화) 일간"],
  ["丁일간", "丁(정화) 일간"],
  ["丁 일간", "丁(정화) 일간"],
  ["戊일간", "戊(무토) 일간"],
  ["戊 일간", "戊(무토) 일간"],
  ["己일간", "己(기토) 일간"],
  ["己 일간", "己(기토) 일간"],
  ["庚일간", "庚(경금) 일간"],
  ["庚 일간", "庚(경금) 일간"],
  ["辛일간", "辛(신금) 일간"],
  ["辛 일간", "辛(신금) 일간"],
  ["壬일간", "壬(임수) 일간"],
  ["壬 일간", "壬(임수) 일간"],
  ["癸일간", "癸(계수) 일간"],
  ["癸 일간", "癸(계수) 일간"],
] as const;

const repeatedTerms = [
  "비견",
  "겁재",
  "식신",
  "상관",
  "편재",
  "정재",
  "편관",
  "정관",
  "편인",
  "정인",
  "충",
  "형",
  "해",
  "파",
  "육합",
  "삼합",
  "반합",
] as const;

const phaseOrder = ["early", "middle", "late"] as const satisfies readonly MajorFortunePhase[];

const annualTonePhrases = [
  "올해",
  "이번 해",
  "2026년에는",
  "올해는",
  "월별",
  "1월",
  "2월",
] as const;

const decadeToneMarkers = [
  "이 대운",
  "이 10년",
  "이 구간",
  "반복",
  "초반",
  "중반",
  "후반",
  "나이 구간",
  "연도 구간",
  "이전 대운",
  "다음 대운",
] as const;

const strongYearReasonMarkers = [
  "오행",
  "십성",
  "대운",
  "원국",
  "지지",
  "천간",
  "충",
  "합",
  "형",
  "파",
  "부족",
  "과다",
  "반복",
  "강화",
] as const;

const technicalTermPlainMarkers = [
  "즉",
  "쉽게 말해",
  "비유하면",
  "말하자면",
  "힘",
  "기준",
  "작용",
  "배경",
  "흐름",
  "테마",
  "구조",
  "역할",
  "장면",
] as const;

const technicalTerms = [
  "비견",
  "겁재",
  "식신",
  "상관",
  "편재",
  "정재",
  "편관",
  "정관",
  "편인",
  "정인",
  "충",
  "형",
  "해",
  "파",
  "육합",
  "삼합",
  "반합",
] as const;

const smallEventMarkers = [
  "오늘",
  "내일",
  "이번 주",
  "이번 달",
  "1월",
  "2월",
  "3월",
  "4월",
  "5월",
  "6월",
  "7월",
  "8월",
  "9월",
  "10월",
  "11월",
  "12월",
] as const;

const genericTimelinePhrases = [
  "대운 지지 또는 원국 지지와 강한 작용",
  "대운의 장기 과제 위에",
  "역할, 돈, 관계의 우선순위를 다시 잡아야 하는 해",
  "흐름을 봅니다",
] as const;

const repeatedStrategyLimit = 3;

const relationshipKnownClaimPhrases = [
  "솔로탈출",
  "애인",
  "배우자",
  "결혼",
] as const;

const weakStrategyPhrases = [
  "조심하세요",
  "잘 활용하세요",
  "노력하세요",
  "좋은 흐름입니다",
] as const;

const repeatedThemeWords = [
  "책임",
  "정리",
  "관리",
  "구조",
  "문서화",
  "일정",
  "고정지출",
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

function isDomainLabel(value: unknown): value is MajorFortuneDomainLabel {
  return (
    typeof value === "string" &&
    majorFortuneDomainLabels.includes(value as MajorFortuneDomainLabel)
  );
}

function isPhase(value: unknown): value is MajorFortunePhase {
  return value === "early" || value === "middle" || value === "late";
}

function clampIndex(index: number): number {
  return Math.max(0, Math.min(100, Math.round(index)));
}

export function getMajorFortuneBasisDisplayLabel(basis: string): string {
  if (basis === "manse_engine_major_fortune_table") {
    return "만세력 대운표 기준";
  }
  if (basis === "user_supplied_major_fortune_table") {
    return "입력된 대운표 기준";
  }
  if (basis === "fixture_precomputed_for_dev_only") {
    return "개발용 사전 계산 대운표 기준";
  }
  if (
    basis === "fixture_precomputed" ||
    basis === "precomputed" ||
    basis.toLowerCase().includes("precomputed") ||
    basis.toLowerCase().includes("fixture")
  ) {
    return "개발용 사전 계산 대운표 기준";
  }

  return sanitizeMajorFortuneVisibleText(basis);
}

export function sanitizeMajorFortuneVisibleText(text: string): string {
  let sanitized = text;

  for (const [from, to] of hardClaimReplacements) {
    sanitized = sanitized.split(from).join(to);
  }
  for (const [from, to] of stemDayMasterReplacements) {
    sanitized = sanitized.split(from).join(to);
  }
  for (const term of repeatedTerms) {
    sanitized = sanitized.replace(
      new RegExp(`${term}\\(${term},\\s*([^)]+)\\)`, "gu"),
      `${term}: $1`,
    );
  }

  sanitized = sanitized
    .replace(
      /([子丑寅卯辰巳午未申酉戌亥]{2}\s*(?:충|육합|삼합|반합|해|형|파))\(\1,\s*([^)]+)\)/gu,
      "$1: $2",
    )
    .replace(
      /([子丑寅卯辰巳午未申酉戌亥]{2}\s*(?:충|육합|삼합|반합|해|형|파))\((?:충|육합|삼합|반합|해|형|파),\s*([^)]+)\)/gu,
      "$1: $2",
    )
    .replace(
      /([子丑寅卯辰巳午未申酉戌亥]{2}\s*(?:충|육합|삼합|반합|해|형|파))\(([^)]+)\)/gu,
      "$1: $2",
    );

  for (const word of internalForbiddenWords) {
    sanitized = sanitized.replace(new RegExp(word, "giu"), "");
  }

  return sanitized.replace(/\s{2,}/gu, " ").trim();
}

function sanitizeStringArray(values: readonly string[]): readonly string[] {
  return values.map(sanitizeMajorFortuneVisibleText);
}

function sanitizeUserContextSummary(
  summary: MajorFortuneReportDraft["userContextSummary"],
): MajorFortuneReportDraft["userContextSummary"] {
  return {
    lifeStatusLabel: sanitizeMajorFortuneVisibleText(summary.lifeStatusLabel),
    fieldLabel:
      summary.fieldLabel === null
        ? null
        : sanitizeMajorFortuneVisibleText(summary.fieldLabel),
    relationshipStatusLabel:
      summary.relationshipStatusLabel === null
        ? null
        : sanitizeMajorFortuneVisibleText(summary.relationshipStatusLabel),
    translationNote: sanitizeMajorFortuneVisibleText(summary.translationNote),
  };
}

function sanitizeCalculationBasis(
  basis: MajorFortuneReportDraft["calculationBasis"],
): MajorFortuneReportDraft["calculationBasis"] {
  return {
    basisType: basis.basisType,
    displayLabel: getMajorFortuneBasisDisplayLabel(basis.displayLabel),
    explanation: sanitizeMajorFortuneVisibleText(basis.explanation),
    ageBasisLabel: sanitizeMajorFortuneVisibleText(basis.ageBasisLabel),
    note: sanitizeMajorFortuneVisibleText(basis.note),
  };
}

function sanitizeDraft(draft: MajorFortuneReportDraft): MajorFortuneReportDraft {
  return {
    version: "v1",
    productType: "major_fortune",
    productVersion: "v1",
    personLabel: sanitizeMajorFortuneVisibleText(draft.personLabel),
    openingTitle: sanitizeMajorFortuneVisibleText(draft.openingTitle),
    openingSummary: sanitizeMajorFortuneVisibleText(draft.openingSummary),
    coreLine: sanitizeMajorFortuneVisibleText(draft.coreLine),
    userContextSummary: sanitizeUserContextSummary(draft.userContextSummary),
    cycleSummary: {
      ganji: sanitizeMajorFortuneVisibleText(draft.cycleSummary.ganji),
      displayTitle: sanitizeMajorFortuneVisibleText(
        draft.cycleSummary.displayTitle,
      ),
      cycleIndexLabel: sanitizeMajorFortuneVisibleText(
        draft.cycleSummary.cycleIndexLabel,
      ),
      currentPositionLabel: sanitizeMajorFortuneVisibleText(
        draft.cycleSummary.currentPositionLabel,
      ),
      ageRangeLabel: sanitizeMajorFortuneVisibleText(
        draft.cycleSummary.ageRangeLabel,
      ),
      yearRangeLabel: sanitizeMajorFortuneVisibleText(
        draft.cycleSummary.yearRangeLabel,
      ),
      stemLabel: sanitizeMajorFortuneVisibleText(draft.cycleSummary.stemLabel),
      branchLabel: sanitizeMajorFortuneVisibleText(
        draft.cycleSummary.branchLabel,
      ),
      elementLabel: sanitizeMajorFortuneVisibleText(
        draft.cycleSummary.elementLabel,
      ),
      tenGodLabel: sanitizeMajorFortuneVisibleText(
        draft.cycleSummary.tenGodLabel,
      ),
      basisLabel: getMajorFortuneBasisDisplayLabel(
        draft.cycleSummary.basisLabel,
      ),
    },
    calculationBasis: sanitizeCalculationBasis(draft.calculationBasis),
    previousToCurrentShift: {
      previousGanji:
        draft.previousToCurrentShift.previousGanji === null
          ? null
          : sanitizeMajorFortuneVisibleText(
              draft.previousToCurrentShift.previousGanji,
            ),
      currentGanji: sanitizeMajorFortuneVisibleText(
        draft.previousToCurrentShift.currentGanji,
      ),
      plain: sanitizeMajorFortuneVisibleText(draft.previousToCurrentShift.plain),
      whatChanged: sanitizeStringArray(
        draft.previousToCurrentShift.whatChanged,
      ),
    },
    decadeArchetype: {
      label: sanitizeMajorFortuneVisibleText(draft.decadeArchetype.label),
      metaphor: sanitizeMajorFortuneVisibleText(
        draft.decadeArchetype.metaphor,
      ),
      plain: sanitizeMajorFortuneVisibleText(draft.decadeArchetype.plain),
    },
    flowIndexSummary: {
      flowIndex: clampIndex(draft.flowIndexSummary.flowIndex),
      flowTypeLabel: sanitizeMajorFortuneVisibleText(
        draft.flowIndexSummary.flowTypeLabel,
      ),
      flowIndexCaution: sanitizeMajorFortuneVisibleText(
        draft.flowIndexSummary.flowIndexCaution,
      ),
    },
    bigThemes: draft.bigThemes.map((theme) => ({
      title: sanitizeMajorFortuneVisibleText(theme.title),
      metaphor: sanitizeMajorFortuneVisibleText(theme.metaphor),
      body: sanitizeMajorFortuneVisibleText(theme.body),
      likelyScenes: sanitizeStringArray(theme.likelyScenes),
      strategy: sanitizeMajorFortuneVisibleText(theme.strategy),
    })),
    myeongliLayers: {
      tenGodLayer: {
        majorStemTenGod: sanitizeMajorFortuneVisibleText(
          draft.myeongliLayers.tenGodLayer.majorStemTenGod,
        ),
        annualStemTenGodsInCycle:
          draft.myeongliLayers.tenGodLayer.annualStemTenGodsInCycle.map(
            (item) => ({
              year: item.year,
              stem: sanitizeMajorFortuneVisibleText(item.stem),
              tenGod: sanitizeMajorFortuneVisibleText(item.tenGod),
              plain: sanitizeMajorFortuneVisibleText(item.plain),
            }),
          ),
        plain: sanitizeMajorFortuneVisibleText(
          draft.myeongliLayers.tenGodLayer.plain,
        ),
      },
      elementLayer: {
        majorElements: sanitizeStringArray(
          draft.myeongliLayers.elementLayer.majorElements,
        ),
        fillMissing: sanitizeStringArray(
          draft.myeongliLayers.elementLayer.fillMissing,
        ),
        overloadHeavy: sanitizeStringArray(
          draft.myeongliLayers.elementLayer.overloadHeavy,
        ),
        plain: sanitizeMajorFortuneVisibleText(
          draft.myeongliLayers.elementLayer.plain,
        ),
      },
      branchInteractionLayer: {
        interactions:
          draft.myeongliLayers.branchInteractionLayer.interactions.map(
            (interaction) => ({
              year: interaction.year,
              type: interaction.type,
              plainType: sanitizeMajorFortuneVisibleText(
                interaction.plainType,
              ),
              plain: sanitizeMajorFortuneVisibleText(interaction.plain),
              impactArea: interaction.impactArea,
            }),
          ),
        plain: sanitizeMajorFortuneVisibleText(
          draft.myeongliLayers.branchInteractionLayer.plain,
        ),
      },
      hiddenStemLayer: {
        majorBranchHiddenStems: sanitizeStringArray(
          draft.myeongliLayers.hiddenStemLayer.majorBranchHiddenStems,
        ),
        plain: sanitizeMajorFortuneVisibleText(
          draft.myeongliLayers.hiddenStemLayer.plain,
        ),
      },
      twelveStageLayer:
        draft.myeongliLayers.twelveStageLayer === null
          ? null
          : {
              label: sanitizeMajorFortuneVisibleText(
                draft.myeongliLayers.twelveStageLayer.label,
              ),
              plain: sanitizeMajorFortuneVisibleText(
                draft.myeongliLayers.twelveStageLayer.plain,
              ),
            },
      auxiliaryStarsLayer: draft.myeongliLayers.auxiliaryStarsLayer
        .filter((star) => !star.label.includes("백호대살"))
        .map((star) => ({
          label: sanitizeMajorFortuneVisibleText(star.label),
          plain: sanitizeMajorFortuneVisibleText(star.plain),
          caution:
            star.caution === null
              ? null
              : sanitizeMajorFortuneVisibleText(star.caution),
        })),
    },
    decadeCards: draft.decadeCards.map((card) => ({
      label: card.label,
      index: clampIndex(card.index),
      headline: sanitizeMajorFortuneVisibleText(card.headline),
      body: sanitizeMajorFortuneVisibleText(card.body),
    })),
    keySignals: draft.keySignals.map((signal) => ({
      type: signal.type,
      title: sanitizeMajorFortuneVisibleText(signal.title),
      body: sanitizeMajorFortuneVisibleText(signal.body),
      evidenceLabel: sanitizeMajorFortuneVisibleText(signal.evidenceLabel),
    })),
    majorStructure: {
      ganjiExplanation: sanitizeMajorFortuneVisibleText(
        draft.majorStructure.ganjiExplanation,
      ),
      tenGodExplanation: sanitizeMajorFortuneVisibleText(
        draft.majorStructure.tenGodExplanation,
      ),
      elementEffectExplanation: sanitizeMajorFortuneVisibleText(
        draft.majorStructure.elementEffectExplanation,
      ),
      branchInteractionExplanation: sanitizeMajorFortuneVisibleText(
        draft.majorStructure.branchInteractionExplanation,
      ),
      transitionExplanation: sanitizeMajorFortuneVisibleText(
        draft.majorStructure.transitionExplanation,
      ),
    },
    cycleChapters: draft.cycleChapters.map((chapter) => ({
      title: sanitizeMajorFortuneVisibleText(chapter.title),
      headline: sanitizeMajorFortuneVisibleText(chapter.headline),
      body: sanitizeMajorFortuneVisibleText(chapter.body),
      likelyScenes: sanitizeStringArray(chapter.likelyScenes),
      practicalAdvice: sanitizeStringArray(chapter.practicalAdvice),
    })),
    phaseTimeline: draft.phaseTimeline.map((phase) => ({
      phase: phase.phase,
      label: sanitizeMajorFortuneVisibleText(phase.label),
      headline: sanitizeMajorFortuneVisibleText(phase.headline),
      body: sanitizeMajorFortuneVisibleText(phase.body),
      advice: sanitizeMajorFortuneVisibleText(phase.advice),
    })),
    strongYears: draft.strongYears.slice(0, 5).map((year) => ({
      year: year.year,
      ganji: sanitizeMajorFortuneVisibleText(year.ganji),
      headline: sanitizeMajorFortuneVisibleText(year.headline),
      body: sanitizeMajorFortuneVisibleText(year.body),
      advice: sanitizeMajorFortuneVisibleText(year.advice),
      whyStrong: sanitizeMajorFortuneVisibleText(year.whyStrong),
      likelyArea: year.likelyArea,
      pushStrategy: sanitizeMajorFortuneVisibleText(year.pushStrategy),
      reduceStrategy: sanitizeMajorFortuneVisibleText(year.reduceStrategy),
    })),
    majorFortuneTimelineRows: draft.majorFortuneTimelineRows.map((row) => ({
      year: row.year,
      ageLabel:
        row.ageLabel === null ? null : sanitizeMajorFortuneVisibleText(row.ageLabel),
      ageBasisLabel:
        row.ageBasisLabel === null
          ? null
          : sanitizeMajorFortuneVisibleText(row.ageBasisLabel),
      yearIndexInCycle: row.yearIndexInCycle,
      phase: row.phase,
      isCurrentYear: row.isCurrentYear,
      isCycleStartYear: row.isCycleStartYear,
      isCycleEndYear: row.isCycleEndYear,
      badges: row.badges,
      majorGanji: sanitizeMajorFortuneVisibleText(row.majorGanji),
      annualGanji: sanitizeMajorFortuneVisibleText(row.annualGanji),
      annualTenGodLabel: sanitizeMajorFortuneVisibleText(
        row.annualTenGodLabel,
      ),
      keyInteractionLabel:
        row.keyInteractionLabel === null
          ? null
          : sanitizeMajorFortuneVisibleText(row.keyInteractionLabel),
      oneLine: sanitizeMajorFortuneVisibleText(row.oneLine),
      strategy: sanitizeMajorFortuneVisibleText(row.strategy),
    })),
    cycleYearTimeline: draft.cycleYearTimeline.map((year) => ({
      year: year.year,
      ganji: sanitizeMajorFortuneVisibleText(year.ganji),
      yearIndexInCycle: year.yearIndexInCycle,
      phase: year.phase,
      headline: sanitizeMajorFortuneVisibleText(year.headline),
      roleOfYearInCycle: sanitizeMajorFortuneVisibleText(
        year.roleOfYearInCycle,
      ),
      plainInterpretation: sanitizeMajorFortuneVisibleText(
        year.plainInterpretation,
      ),
      strategicFocus: sanitizeMajorFortuneVisibleText(year.strategicFocus),
      whyItMatters: sanitizeMajorFortuneVisibleText(year.whyItMatters),
    })),
    finalAdvice: draft.finalAdvice.map((advice) => ({
      label: advice.label,
      body: sanitizeMajorFortuneVisibleText(advice.body),
    })),
    safetyNotes: sanitizeStringArray(draft.safetyNotes),
  };
}

function hasDraftShape(value: unknown): value is MajorFortuneReportDraft {
  if (!isRecord(value)) {
    return false;
  }

  const draft = value as Partial<MajorFortuneReportDraft>;

  return (
    draft.version === "v1" &&
    draft.productType === "major_fortune" &&
    draft.productVersion === "v1" &&
    typeof draft.personLabel === "string" &&
    typeof draft.openingTitle === "string" &&
    typeof draft.openingSummary === "string" &&
    typeof draft.coreLine === "string" &&
    isRecord(draft.userContextSummary) &&
    typeof draft.userContextSummary.lifeStatusLabel === "string" &&
    (typeof draft.userContextSummary.fieldLabel === "string" ||
      draft.userContextSummary.fieldLabel === null) &&
    (typeof draft.userContextSummary.relationshipStatusLabel === "string" ||
      draft.userContextSummary.relationshipStatusLabel === null) &&
    typeof draft.userContextSummary.translationNote === "string" &&
    isRecord(draft.cycleSummary) &&
    typeof draft.cycleSummary.ganji === "string" &&
    typeof draft.cycleSummary.displayTitle === "string" &&
    typeof draft.cycleSummary.cycleIndexLabel === "string" &&
    typeof draft.cycleSummary.currentPositionLabel === "string" &&
    typeof draft.cycleSummary.ageRangeLabel === "string" &&
    typeof draft.cycleSummary.yearRangeLabel === "string" &&
    typeof draft.cycleSummary.stemLabel === "string" &&
    typeof draft.cycleSummary.branchLabel === "string" &&
    typeof draft.cycleSummary.elementLabel === "string" &&
    typeof draft.cycleSummary.tenGodLabel === "string" &&
    typeof draft.cycleSummary.basisLabel === "string" &&
    isRecord(draft.calculationBasis) &&
    (draft.calculationBasis.basisType === "manse_engine_major_fortune_table" ||
      draft.calculationBasis.basisType === "user_supplied_major_fortune_table" ||
      draft.calculationBasis.basisType === "fixture_precomputed_for_dev_only") &&
    typeof draft.calculationBasis.displayLabel === "string" &&
    typeof draft.calculationBasis.explanation === "string" &&
    typeof draft.calculationBasis.ageBasisLabel === "string" &&
    typeof draft.calculationBasis.note === "string" &&
    isRecord(draft.previousToCurrentShift) &&
    (typeof draft.previousToCurrentShift.previousGanji === "string" ||
      draft.previousToCurrentShift.previousGanji === null) &&
    typeof draft.previousToCurrentShift.currentGanji === "string" &&
    typeof draft.previousToCurrentShift.plain === "string" &&
    isStringArray(draft.previousToCurrentShift.whatChanged) &&
    isRecord(draft.decadeArchetype) &&
    typeof draft.decadeArchetype.label === "string" &&
    typeof draft.decadeArchetype.metaphor === "string" &&
    typeof draft.decadeArchetype.plain === "string" &&
    isRecord(draft.flowIndexSummary) &&
    isNumber(draft.flowIndexSummary.flowIndex) &&
    typeof draft.flowIndexSummary.flowTypeLabel === "string" &&
    typeof draft.flowIndexSummary.flowIndexCaution === "string" &&
    Array.isArray(draft.bigThemes) &&
    draft.bigThemes.every(
      (theme) =>
        isRecord(theme) &&
        typeof theme.title === "string" &&
        typeof theme.metaphor === "string" &&
        typeof theme.body === "string" &&
        isStringArray(theme.likelyScenes) &&
        typeof theme.strategy === "string",
    ) &&
    isRecord(draft.myeongliLayers) &&
    isRecord(draft.myeongliLayers.tenGodLayer) &&
    typeof draft.myeongliLayers.tenGodLayer.majorStemTenGod === "string" &&
    Array.isArray(
      draft.myeongliLayers.tenGodLayer.annualStemTenGodsInCycle,
    ) &&
    draft.myeongliLayers.tenGodLayer.annualStemTenGodsInCycle.every(
      (item) =>
        isRecord(item) &&
        isNumber(item.year) &&
        typeof item.stem === "string" &&
        typeof item.tenGod === "string" &&
        typeof item.plain === "string",
    ) &&
    typeof draft.myeongliLayers.tenGodLayer.plain === "string" &&
    isRecord(draft.myeongliLayers.elementLayer) &&
    isStringArray(draft.myeongliLayers.elementLayer.majorElements) &&
    isStringArray(draft.myeongliLayers.elementLayer.fillMissing) &&
    isStringArray(draft.myeongliLayers.elementLayer.overloadHeavy) &&
    typeof draft.myeongliLayers.elementLayer.plain === "string" &&
    isRecord(draft.myeongliLayers.branchInteractionLayer) &&
    Array.isArray(draft.myeongliLayers.branchInteractionLayer.interactions) &&
    draft.myeongliLayers.branchInteractionLayer.interactions.every(
      (interaction) =>
        isRecord(interaction) &&
        (isNumber(interaction.year) || interaction.year === null) &&
        typeof interaction.type === "string" &&
        typeof interaction.plainType === "string" &&
        typeof interaction.plain === "string" &&
        typeof interaction.impactArea === "string",
    ) &&
    typeof draft.myeongliLayers.branchInteractionLayer.plain === "string" &&
    isRecord(draft.myeongliLayers.hiddenStemLayer) &&
    isStringArray(draft.myeongliLayers.hiddenStemLayer.majorBranchHiddenStems) &&
    typeof draft.myeongliLayers.hiddenStemLayer.plain === "string" &&
    (draft.myeongliLayers.twelveStageLayer === null ||
      (isRecord(draft.myeongliLayers.twelveStageLayer) &&
        typeof draft.myeongliLayers.twelveStageLayer.label === "string" &&
        typeof draft.myeongliLayers.twelveStageLayer.plain === "string")) &&
    Array.isArray(draft.myeongliLayers.auxiliaryStarsLayer) &&
    draft.myeongliLayers.auxiliaryStarsLayer.every(
      (star) =>
        isRecord(star) &&
        typeof star.label === "string" &&
        typeof star.plain === "string" &&
        (typeof star.caution === "string" || star.caution === null),
    ) &&
    Array.isArray(draft.decadeCards) &&
    draft.decadeCards.every(
      (card) =>
        isRecord(card) &&
        isDomainLabel(card.label) &&
        isNumber(card.index) &&
        typeof card.headline === "string" &&
        typeof card.body === "string",
    ) &&
    Array.isArray(draft.keySignals) &&
    isRecord(draft.majorStructure) &&
    typeof draft.majorStructure.ganjiExplanation === "string" &&
    typeof draft.majorStructure.tenGodExplanation === "string" &&
    typeof draft.majorStructure.elementEffectExplanation === "string" &&
    typeof draft.majorStructure.branchInteractionExplanation === "string" &&
    typeof draft.majorStructure.transitionExplanation === "string" &&
    Array.isArray(draft.cycleChapters) &&
    Array.isArray(draft.phaseTimeline) &&
    draft.phaseTimeline.every((phase) => isRecord(phase) && isPhase(phase.phase)) &&
    Array.isArray(draft.strongYears) &&
    draft.strongYears.every(
      (year) =>
        isRecord(year) &&
        isNumber(year.year) &&
        typeof year.ganji === "string" &&
        typeof year.headline === "string" &&
        typeof year.body === "string" &&
        typeof year.advice === "string" &&
        typeof year.whyStrong === "string" &&
        typeof year.likelyArea === "string" &&
        typeof year.pushStrategy === "string" &&
        typeof year.reduceStrategy === "string",
    ) &&
    Array.isArray(draft.majorFortuneTimelineRows) &&
    draft.majorFortuneTimelineRows.every(
      (row) =>
        isRecord(row) &&
        isNumber(row.year) &&
        (typeof row.ageLabel === "string" || row.ageLabel === null) &&
        (typeof row.ageBasisLabel === "string" || row.ageBasisLabel === null) &&
        isNumber(row.yearIndexInCycle) &&
        isPhase(row.phase) &&
        isBoolean(row.isCurrentYear) &&
        isBoolean(row.isCycleStartYear) &&
        isBoolean(row.isCycleEndYear) &&
        isStringArray(row.badges) &&
        typeof row.majorGanji === "string" &&
        typeof row.annualGanji === "string" &&
        typeof row.annualTenGodLabel === "string" &&
        (typeof row.keyInteractionLabel === "string" ||
          row.keyInteractionLabel === null) &&
        typeof row.oneLine === "string" &&
        typeof row.strategy === "string",
    ) &&
    Array.isArray(draft.cycleYearTimeline) &&
    draft.cycleYearTimeline.every(
      (year) =>
        isRecord(year) &&
        isNumber(year.year) &&
        typeof year.ganji === "string" &&
        isNumber(year.yearIndexInCycle) &&
        isPhase(year.phase) &&
        typeof year.headline === "string" &&
        typeof year.roleOfYearInCycle === "string" &&
        typeof year.plainInterpretation === "string" &&
        typeof year.strategicFocus === "string" &&
        typeof year.whyItMatters === "string",
    ) &&
    Array.isArray(draft.finalAdvice) &&
    draft.finalAdvice.every(
      (advice) =>
        isRecord(advice) &&
        isDomainLabel(advice.label) &&
        typeof advice.body === "string",
    ) &&
    isStringArray(draft.safetyNotes)
  );
}

function collectVisibleStrings(draft: MajorFortuneReportDraft): readonly string[] {
  return [
    draft.personLabel,
    draft.openingTitle,
    draft.openingSummary,
    draft.coreLine,
    draft.userContextSummary.lifeStatusLabel,
    draft.userContextSummary.fieldLabel ?? "",
    draft.userContextSummary.relationshipStatusLabel ?? "",
    draft.userContextSummary.translationNote,
    ...Object.values(draft.cycleSummary),
    draft.calculationBasis.displayLabel,
    draft.calculationBasis.explanation,
    draft.calculationBasis.ageBasisLabel,
    draft.calculationBasis.note,
    draft.previousToCurrentShift.previousGanji ?? "",
    draft.previousToCurrentShift.currentGanji,
    draft.previousToCurrentShift.plain,
    ...draft.previousToCurrentShift.whatChanged,
    draft.decadeArchetype.label,
    draft.decadeArchetype.metaphor,
    draft.decadeArchetype.plain,
    draft.flowIndexSummary.flowTypeLabel,
    draft.flowIndexSummary.flowIndexCaution,
    ...draft.bigThemes.flatMap((theme) => [
      theme.title,
      theme.metaphor,
      theme.body,
      ...theme.likelyScenes,
      theme.strategy,
    ]),
    draft.myeongliLayers.tenGodLayer.majorStemTenGod,
    draft.myeongliLayers.tenGodLayer.plain,
    ...draft.myeongliLayers.tenGodLayer.annualStemTenGodsInCycle.flatMap(
      (item) => [item.stem, item.tenGod, item.plain],
    ),
    ...draft.myeongliLayers.elementLayer.majorElements,
    ...draft.myeongliLayers.elementLayer.fillMissing,
    ...draft.myeongliLayers.elementLayer.overloadHeavy,
    draft.myeongliLayers.elementLayer.plain,
    draft.myeongliLayers.branchInteractionLayer.plain,
    ...draft.myeongliLayers.branchInteractionLayer.interactions.flatMap(
      (interaction) => [
        interaction.type,
        interaction.plainType,
        interaction.plain,
        interaction.impactArea,
      ],
    ),
    ...draft.myeongliLayers.hiddenStemLayer.majorBranchHiddenStems,
    draft.myeongliLayers.hiddenStemLayer.plain,
    draft.myeongliLayers.twelveStageLayer?.label ?? "",
    draft.myeongliLayers.twelveStageLayer?.plain ?? "",
    ...draft.myeongliLayers.auxiliaryStarsLayer.flatMap((star) => [
      star.label,
      star.plain,
      star.caution ?? "",
    ]),
    ...draft.decadeCards.flatMap((card) => [
      card.label,
      card.headline,
      card.body,
    ]),
    ...draft.keySignals.flatMap((signal) => [
      signal.title,
      signal.body,
      signal.evidenceLabel,
    ]),
    ...Object.values(draft.majorStructure),
    ...draft.cycleChapters.flatMap((chapter) => [
      chapter.title,
      chapter.headline,
      chapter.body,
      ...chapter.likelyScenes,
      ...chapter.practicalAdvice,
    ]),
    ...draft.phaseTimeline.flatMap((phase) => [
      phase.label,
      phase.headline,
      phase.body,
      phase.advice,
    ]),
    ...draft.strongYears.flatMap((year) => [
      year.ganji,
      year.headline,
      year.body,
      year.advice,
      year.whyStrong,
      year.likelyArea,
      year.pushStrategy,
      year.reduceStrategy,
    ]),
    ...draft.majorFortuneTimelineRows.flatMap((row) => [
      row.ageLabel ?? "",
      row.ageBasisLabel ?? "",
      ...row.badges,
      row.majorGanji,
      row.annualGanji,
      row.annualTenGodLabel,
      row.keyInteractionLabel ?? "",
      row.oneLine,
      row.strategy,
    ]),
    ...draft.cycleYearTimeline.flatMap((year) => [
      year.ganji,
      year.headline,
      year.roleOfYearInCycle,
      year.plainInterpretation,
      year.strategicFocus,
      year.whyItMatters,
    ]),
    ...draft.finalAdvice.flatMap((advice) => [advice.label, advice.body]),
    ...draft.safetyNotes,
  ];
}

function countOccurrences(text: string, phrase: string): number {
  return phrase.length === 0 ? 0 : text.split(phrase).length - 1;
}

function countRepeatedTerminologyWarnings(visibleText: string): number {
  const repeatedTermPattern = new RegExp(
    `(${repeatedTerms.join("|")})\\(\\1,`,
    "gu",
  );
  const branchPattern =
    /[子丑寅卯辰巳午未申酉戌亥]{2}\s*(?:충|육합|삼합|반합|해|형|파)\(/gu;

  return (
    (visibleText.match(repeatedTermPattern)?.length ?? 0) +
    (visibleText.match(branchPattern)?.length ?? 0)
  );
}

function countAnnualToneWarnings(visibleText: string): number {
  const occurrences = annualTonePhrases.reduce(
    (count, phrase) => count + countOccurrences(visibleText, phrase),
    0,
  );

  return occurrences > 2 ? occurrences - 2 : 0;
}

function countDecadeToneWarnings(visibleText: string): number {
  const markerCount = decadeToneMarkers.filter((marker) =>
    visibleText.includes(marker),
  ).length;

  return markerCount >= 4 ? 0 : 4 - markerCount;
}

function countStrongYearReasonWarnings(
  draft: MajorFortuneReportDraft,
): number {
  return draft.strongYears.filter((year) => {
    const text = [
      year.headline,
      year.body,
      year.advice,
      year.whyStrong,
      year.pushStrategy,
      year.reduceStrategy,
    ].join("\n");

    return !strongYearReasonMarkers.some((marker) => text.includes(marker));
  }).length;
}

function expectedCycleYearPhase(
  yearIndexInCycle: number,
): MajorFortunePhase | undefined {
  if (yearIndexInCycle >= 1 && yearIndexInCycle <= 3) {
    return "early";
  }
  if (yearIndexInCycle >= 4 && yearIndexInCycle <= 7) {
    return "middle";
  }
  if (yearIndexInCycle >= 8 && yearIndexInCycle <= 10) {
    return "late";
  }

  return undefined;
}

function parseYearRangeLabel(
  yearRangeLabel: string,
): { readonly startYear: number; readonly endYear: number } | undefined {
  const match = /(\d{4})년\s*~\s*(\d{4})년/u.exec(yearRangeLabel);

  if (match === null) {
    return undefined;
  }

  return {
    startYear: Number(match[1]),
    endYear: Number(match[2]),
  };
}

function parseCurrentYearFromPosition(positionLabel: string): number | undefined {
  const match = /(\d{4})년/u.exec(positionLabel);

  return match === null ? undefined : Number(match[1]);
}

function countWrongCycleBasisWarnings(draft: MajorFortuneReportDraft): number {
  const range = parseYearRangeLabel(draft.cycleSummary.yearRangeLabel);
  const currentYear = parseCurrentYearFromPosition(
    draft.cycleSummary.currentPositionLabel,
  );

  if (range === undefined || currentYear === undefined) {
    return 1;
  }

  return range.startYear <= currentYear && currentYear <= range.endYear ? 0 : 1;
}

function countMissingCycleYearWarnings(
  draft: MajorFortuneReportDraft,
): number {
  let warnings = 0;
  const timeline = draft.cycleYearTimeline;
  const timelineRows = draft.majorFortuneTimelineRows;

  if (timeline.length !== 10) {
    warnings += 1;
  }
  if (timelineRows.length !== 10) {
    warnings += 1;
  }

  const range = parseYearRangeLabel(draft.cycleSummary.yearRangeLabel);

  for (const [index, item] of timeline.entries()) {
    const expectedIndex = index + 1;
    const expectedPhase = expectedCycleYearPhase(expectedIndex);

    if (item.yearIndexInCycle !== expectedIndex) {
      warnings += 1;
    }
    if (expectedPhase !== undefined && item.phase !== expectedPhase) {
      warnings += 1;
    }
    if (range !== undefined && item.year !== range.startYear + index) {
      warnings += 1;
    }
  }

  if (
    range !== undefined &&
    (timeline[0]?.year !== range.startYear ||
      timeline[timeline.length - 1]?.year !== range.endYear)
  ) {
    warnings += 1;
  }
  for (const [index, row] of timelineRows.entries()) {
    const expectedIndex = index + 1;

    if (row.yearIndexInCycle !== expectedIndex) {
      warnings += 1;
    }
    if (range !== undefined && row.year !== range.startYear + index) {
      warnings += 1;
    }
    if (row.majorGanji !== draft.cycleSummary.ganji) {
      warnings += 1;
    }
    if (row.annualGanji.trim().length === 0 || row.oneLine.trim().length === 0) {
      warnings += 1;
    }
  }

  return warnings;
}

function countGenericTimelineWarnings(draft: MajorFortuneReportDraft): number {
  const cycleWarnings = draft.cycleYearTimeline.reduce((count, year) => {
    const text = [
      year.headline,
      year.roleOfYearInCycle,
      year.plainInterpretation,
      year.strategicFocus,
      year.whyItMatters,
    ].join("\n");

    return (
      count +
      genericTimelinePhrases.reduce(
        (innerCount, phrase) => innerCount + countOccurrences(text, phrase),
        0,
      )
    );
  }, 0);
  const rowWarnings = draft.majorFortuneTimelineRows.reduce((count, row) => {
    const text = [row.oneLine, row.strategy].join("\n");

    return (
      count +
      genericTimelinePhrases.reduce(
        (innerCount, phrase) => innerCount + countOccurrences(text, phrase),
        0,
      )
    );
  }, 0);

  return cycleWarnings + rowWarnings;
}

function getCycleOrdinal(cycleIndexLabel: string): number | undefined {
  const match = /(\d+)/u.exec(cycleIndexLabel);

  return match === null ? undefined : Number(match[1]);
}

function countCycleIndexLeakWarnings(draft: MajorFortuneReportDraft): number {
  const cycleOrdinal = getCycleOrdinal(draft.cycleSummary.cycleIndexLabel);

  if (cycleOrdinal === undefined) {
    return 0;
  }

  const leakedFlowIndex =
    draft.flowIndexSummary.flowIndex === cycleOrdinal ? 1 : 0;
  const leakedCardIndexes = draft.decadeCards.filter(
    (card) => card.index === cycleOrdinal,
  ).length;

  return leakedFlowIndex + leakedCardIndexes;
}

function countTechnicalTermWithoutExplanationWarnings(
  visibleText: string,
): number {
  const sentences = visibleText.split(/[.!?。！？\n]/u);

  return sentences.filter((sentence) => {
    if (sentence.trim().length < 12) {
      return false;
    }

    const warningTerms = technicalTerms.filter((term) => term.length > 1);
    const hasTechnicalTerm = warningTerms.some((term) =>
      sentence.includes(term),
    );

    if (!hasTechnicalTerm) {
      return false;
    }

    const hasPlainExplanation =
      sentence.includes(":") ||
      technicalTermPlainMarkers.some((marker) => sentence.includes(marker));

    return !hasPlainExplanation;
  }).length;
}

function countSmallEventOverfocusWarnings(visibleText: string): number {
  const smallEventCount = smallEventMarkers.reduce(
    (count, marker) => count + countOccurrences(visibleText, marker),
    0,
  );

  return smallEventCount > 3 ? smallEventCount - 3 : 0;
}

function countRepeatedSummaryWarnings(visibleText: string): number {
  const normalizedSentences = visibleText
    .split(/[.!?。！？\n]/u)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 18);
  const counts = new Map<string, number>();

  for (const sentence of normalizedSentences) {
    counts.set(sentence, (counts.get(sentence) ?? 0) + 1);
  }

  return [...counts.values()].filter((count) => count > 5).length;
}

function countWeakStrategyWarnings(visibleText: string): number {
  return weakStrategyPhrases.reduce(
    (count, phrase) => count + countOccurrences(visibleText, phrase),
    0,
  );
}

function countRelationshipStatusMisuseWarnings(
  draft: MajorFortuneReportDraft,
  visibleText: string,
): number {
  if (draft.userContextSummary.relationshipStatusLabel !== "미입력") {
    return 0;
  }

  return relationshipKnownClaimPhrases.reduce(
    (count, phrase) => count + countOccurrences(visibleText, phrase),
    0,
  );
}

function countStrongYearTitleRepeatWarnings(
  draft: MajorFortuneReportDraft,
): number {
  return draft.strongYears.filter((year) =>
    year.headline.includes("특히 강하게 체감될 수 있는 해 TOP 5"),
  ).length;
}

function countRepeatedThemeWarnings(visibleText: string): number {
  return repeatedThemeWords.reduce((count, word) => {
    const occurrences = countOccurrences(visibleText, word);

    return occurrences > 48 ? count + (occurrences - 48) : count;
  }, 0);
}

function countRepeatedStrategyWarnings(
  draft: MajorFortuneReportDraft,
): number {
  const counts = new Map<string, number>();

  for (const row of draft.majorFortuneTimelineRows) {
    const strategy = row.strategy.trim();

    if (strategy.length === 0) {
      continue;
    }
    counts.set(strategy, (counts.get(strategy) ?? 0) + 1);
  }

  return [...counts.values()].reduce(
    (total, count) =>
      count > repeatedStrategyLimit ? total + count - repeatedStrategyLimit : total,
    0,
  );
}

export function summarizeMajorFortuneDraftQuality(
  draft: MajorFortuneReportDraft,
): MajorFortuneDraftQualitySummary {
  const visibleText = collectVisibleStrings(draft).join("\n");
  const hardClaimWarnings = hardClaimReplacements.reduce(
    (count, [phrase]) => count + countOccurrences(visibleText, phrase),
    0,
  );
  const internalArtifactWarnings = internalForbiddenWords.reduce(
    (count, word) =>
      count + countOccurrences(visibleText.toLowerCase(), word.toLowerCase()),
    0,
  );
  const repeatedTerminologyWarnings =
    countRepeatedTerminologyWarnings(visibleText);
  const annualToneWarnings = countAnnualToneWarnings(visibleText);
  const decadeToneWarnings = countDecadeToneWarnings(visibleText);
  const strongYearReasonWarnings = countStrongYearReasonWarnings(draft);
  const missingCycleYearWarnings = countMissingCycleYearWarnings(draft);
  const cycleIndexLeakWarnings = countCycleIndexLeakWarnings(draft);
  const technicalTermWithoutExplanationWarnings =
    countTechnicalTermWithoutExplanationWarnings(visibleText);
  const smallEventOverfocusWarnings =
    countSmallEventOverfocusWarnings(visibleText);
  const wrongCycleBasisWarnings = countWrongCycleBasisWarnings(draft);
  const genericTimelineWarnings = countGenericTimelineWarnings(draft);
  const repeatedSummaryWarnings = countRepeatedSummaryWarnings(visibleText);
  const weakStrategyWarnings = countWeakStrategyWarnings(visibleText);
  const relationshipStatusMisuseWarnings =
    countRelationshipStatusMisuseWarnings(draft, visibleText);
  const strongYearTitleRepeatWarnings =
    countStrongYearTitleRepeatWarnings(draft);
  const repeatedThemeWarnings = countRepeatedThemeWarnings(visibleText);
  const repeatedStrategyWarnings = countRepeatedStrategyWarnings(draft);

  return {
    hardClaimWarnings,
    internalArtifactWarnings,
    repeatedTerminologyWarnings,
    annualToneWarnings,
    decadeToneWarnings,
    strongYearReasonWarnings,
    cycleYearTimelineCount: draft.cycleYearTimeline.length,
    missingCycleYearWarnings,
    cycleIndexLeakWarnings,
    technicalTermWithoutExplanationWarnings,
    smallEventOverfocusWarnings,
    wrongCycleBasisWarnings,
    genericTimelineWarnings,
    repeatedSummaryWarnings,
    weakStrategyWarnings,
    relationshipStatusMisuseWarnings,
    strongYearTitleRepeatWarnings,
    repeatedThemeWarnings,
    repeatedStrategyWarnings,
  };
}

function validateDomainSet(
  values: readonly MajorFortuneDomainLabel[],
  errors: string[],
  errorCode: string,
): void {
  const missing = majorFortuneDomainLabels.filter(
    (label) => !values.includes(label),
  );
  const hasDuplicates = new Set(values).size !== values.length;

  if (missing.length > 0 || hasDuplicates) {
    errors.push(errorCode);
  }
}

function validateArrayLengths(
  draft: MajorFortuneReportDraft,
  errors: string[],
): void {
  if (draft.decadeCards.length !== majorFortuneDomainLabels.length) {
    errors.push("MAJOR_FORTUNE_DECADE_CARDS_INVALID");
  }
  validateDomainSet(
    draft.decadeCards.map((card) => card.label),
    errors,
    "MAJOR_FORTUNE_DECADE_CARD_DOMAINS_INVALID",
  );
  if (draft.bigThemes.length < 3 || draft.bigThemes.length > 5) {
    errors.push("MAJOR_FORTUNE_BIG_THEMES_INVALID");
  }
  for (const [index, theme] of draft.bigThemes.entries()) {
    if (theme.likelyScenes.length < 2 || theme.likelyScenes.length > 4) {
      errors.push(`MAJOR_FORTUNE_BIG_THEME_SCENES_INVALID:${index}`);
    }
  }
  if (draft.cycleChapters.length < 6 || draft.cycleChapters.length > 10) {
    errors.push("MAJOR_FORTUNE_CHAPTER_COUNT_INVALID");
  }
  for (const [index, chapter] of draft.cycleChapters.entries()) {
    if (chapter.likelyScenes.length < 2 || chapter.likelyScenes.length > 4) {
      errors.push(`MAJOR_FORTUNE_LIKELY_SCENES_INVALID:${index}`);
    }
    if (
      chapter.practicalAdvice.length < 2 ||
      chapter.practicalAdvice.length > 4
    ) {
      errors.push(`MAJOR_FORTUNE_PRACTICAL_ADVICE_INVALID:${index}`);
    }
  }
  if (draft.phaseTimeline.length !== 3) {
    errors.push("MAJOR_FORTUNE_PHASE_TIMELINE_INVALID");
  }
  if (
    draft.phaseTimeline.length === 3 &&
    !phaseOrder.every((phase, index) => draft.phaseTimeline[index]?.phase === phase)
  ) {
    errors.push("MAJOR_FORTUNE_PHASE_TIMELINE_ORDER_INVALID");
  }
  if (draft.strongYears.length < 3 || draft.strongYears.length > 5) {
    errors.push("MAJOR_FORTUNE_STRONG_YEARS_INVALID");
  }
  if (draft.cycleYearTimeline.length !== 10) {
    errors.push("MAJOR_FORTUNE_CYCLE_YEAR_TIMELINE_INVALID");
  }
  if (draft.majorFortuneTimelineRows.length !== 10) {
    errors.push("MAJOR_FORTUNE_TIMELINE_ROWS_INVALID");
  }
  if (!draft.majorFortuneTimelineRows.some((row) => row.isCurrentYear)) {
    errors.push("MAJOR_FORTUNE_TIMELINE_CURRENT_YEAR_MISSING");
  }
  if (countMissingCycleYearWarnings(draft) > 0) {
    errors.push("MAJOR_FORTUNE_CYCLE_YEAR_TIMELINE_MISSING_YEARS");
  }
  if (draft.finalAdvice.length !== majorFortuneDomainLabels.length) {
    errors.push("MAJOR_FORTUNE_FINAL_ADVICE_INVALID");
  }
  validateDomainSet(
    draft.finalAdvice.map((advice) => advice.label),
    errors,
    "MAJOR_FORTUNE_FINAL_ADVICE_DOMAINS_INVALID",
  );
  if (draft.safetyNotes.length < 2 || draft.safetyNotes.length > 4) {
    errors.push("MAJOR_FORTUNE_SAFETY_NOTES_INVALID");
  }
}

export function validateMajorFortuneReportDraft(
  draft: unknown,
): MajorFortuneReportDraftValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!hasDraftShape(draft)) {
    return {
      ok: false,
      errors: ["MAJOR_FORTUNE_SCHEMA_INVALID"],
      warnings,
    };
  }

  const sanitizedDraft = sanitizeDraft(draft);
  validateArrayLengths(sanitizedDraft, errors);

  const visibleText = collectVisibleStrings(sanitizedDraft).join("\n");
  for (const word of internalForbiddenWords) {
    if (visibleText.toLowerCase().includes(word.toLowerCase())) {
      errors.push(`MAJOR_FORTUNE_INTERNAL_WORD_VISIBLE:${word}`);
    }
  }
  const quality = summarizeMajorFortuneDraftQuality(sanitizedDraft);

  if (quality.annualToneWarnings > 0) {
    warnings.push(`MAJOR_FORTUNE_ANNUAL_TONE_WARNING:${quality.annualToneWarnings}`);
  }
  if (quality.decadeToneWarnings > 0) {
    warnings.push(`MAJOR_FORTUNE_DECADE_TONE_WARNING:${quality.decadeToneWarnings}`);
  }
  if (quality.strongYearReasonWarnings > 0) {
    warnings.push(
      `MAJOR_FORTUNE_STRONG_YEAR_REASON_WARNING:${quality.strongYearReasonWarnings}`,
    );
  }
  if (quality.cycleIndexLeakWarnings > 0) {
    warnings.push(
      `MAJOR_FORTUNE_CYCLE_INDEX_LEAK_WARNING:${quality.cycleIndexLeakWarnings}`,
    );
  }
  if (quality.technicalTermWithoutExplanationWarnings > 0) {
    warnings.push(
      `MAJOR_FORTUNE_TECHNICAL_TERM_WARNING:${quality.technicalTermWithoutExplanationWarnings}`,
    );
  }
  if (quality.smallEventOverfocusWarnings > 0) {
    warnings.push(
      `MAJOR_FORTUNE_SMALL_EVENT_OVERFOCUS_WARNING:${quality.smallEventOverfocusWarnings}`,
    );
  }
  if (quality.wrongCycleBasisWarnings > 0) {
    warnings.push(
      `MAJOR_FORTUNE_WRONG_CYCLE_BASIS_WARNING:${quality.wrongCycleBasisWarnings}`,
    );
  }
  if (quality.genericTimelineWarnings > 0) {
    warnings.push(
      `MAJOR_FORTUNE_GENERIC_TIMELINE_WARNING:${quality.genericTimelineWarnings}`,
    );
  }
  if (quality.repeatedSummaryWarnings > 0) {
    warnings.push(
      `MAJOR_FORTUNE_REPEATED_SUMMARY_WARNING:${quality.repeatedSummaryWarnings}`,
    );
  }
  if (quality.weakStrategyWarnings > 0) {
    warnings.push(
      `MAJOR_FORTUNE_WEAK_STRATEGY_WARNING:${quality.weakStrategyWarnings}`,
    );
  }
  if (quality.relationshipStatusMisuseWarnings > 0) {
    warnings.push(
      `MAJOR_FORTUNE_RELATIONSHIP_STATUS_MISUSE_WARNING:${quality.relationshipStatusMisuseWarnings}`,
    );
  }
  if (quality.strongYearTitleRepeatWarnings > 0) {
    warnings.push(
      `MAJOR_FORTUNE_STRONG_YEAR_TITLE_REPEAT_WARNING:${quality.strongYearTitleRepeatWarnings}`,
    );
  }
  if (quality.repeatedThemeWarnings > 0) {
    warnings.push(
      `MAJOR_FORTUNE_REPEATED_THEME_WARNING:${quality.repeatedThemeWarnings}`,
    );
  }
  if (quality.repeatedStrategyWarnings > 0) {
    warnings.push(
      `MAJOR_FORTUNE_REPEATED_STRATEGY_WARNING:${quality.repeatedStrategyWarnings}`,
    );
  }

  return errors.length === 0
    ? { ok: true, errors: [], warnings, value: sanitizedDraft }
    : { ok: false, errors, warnings };
}

export function assertValidMajorFortuneReportDraft(
  draft: unknown,
): MajorFortuneReportDraft {
  const result = validateMajorFortuneReportDraft(draft);

  if (!result.ok || result.value === undefined) {
    throw new Error(
      `Major fortune report draft is invalid: ${result.errors.join("; ")}`,
    );
  }

  return result.value;
}
