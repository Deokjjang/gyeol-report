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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
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
  if (
    basis === "fixture_precomputed" ||
    basis === "precomputed" ||
    basis.toLowerCase().includes("precomputed") ||
    basis.toLowerCase().includes("fixture")
  ) {
    return "사전 계산된 대운표 기준";
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
    translationNote: sanitizeMajorFortuneVisibleText(summary.translationNote),
  };
}

function sanitizeCalculationBasis(
  basis: MajorFortuneReportDraft["calculationBasis"],
): MajorFortuneReportDraft["calculationBasis"] {
  return {
    basisType: "precomputed_major_fortune_table",
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
    })),
    cycleYearTimeline: draft.cycleYearTimeline.map((year) => ({
      year: year.year,
      ganji: sanitizeMajorFortuneVisibleText(year.ganji),
      yearIndexInCycle: year.yearIndexInCycle,
      phase: year.phase,
      headline: sanitizeMajorFortuneVisibleText(year.headline),
      relationToMajorCycle: sanitizeMajorFortuneVisibleText(
        year.relationToMajorCycle,
      ),
      plain: sanitizeMajorFortuneVisibleText(year.plain),
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
    draft.calculationBasis.basisType === "precomputed_major_fortune_table" &&
    typeof draft.calculationBasis.displayLabel === "string" &&
    typeof draft.calculationBasis.explanation === "string" &&
    typeof draft.calculationBasis.ageBasisLabel === "string" &&
    typeof draft.calculationBasis.note === "string" &&
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
    Array.isArray(draft.cycleYearTimeline) &&
    draft.cycleYearTimeline.every(
      (year) =>
        isRecord(year) &&
        isNumber(year.year) &&
        typeof year.ganji === "string" &&
        isNumber(year.yearIndexInCycle) &&
        isPhase(year.phase) &&
        typeof year.headline === "string" &&
        typeof year.relationToMajorCycle === "string" &&
        typeof year.plain === "string",
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
    draft.userContextSummary.translationNote,
    ...Object.values(draft.cycleSummary),
    draft.calculationBasis.displayLabel,
    draft.calculationBasis.explanation,
    draft.calculationBasis.ageBasisLabel,
    draft.calculationBasis.note,
    draft.flowIndexSummary.flowTypeLabel,
    draft.flowIndexSummary.flowIndexCaution,
    ...draft.bigThemes.flatMap((theme) => [
      theme.title,
      theme.metaphor,
      theme.body,
      ...theme.likelyScenes,
      theme.strategy,
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
    ]),
    ...draft.cycleYearTimeline.flatMap((year) => [
      year.ganji,
      year.headline,
      year.relationToMajorCycle,
      year.plain,
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

function countMissingCycleYearWarnings(
  draft: MajorFortuneReportDraft,
): number {
  let warnings = 0;
  const timeline = draft.cycleYearTimeline;

  if (timeline.length !== 10) {
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

  return warnings;
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
