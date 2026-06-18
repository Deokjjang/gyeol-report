import {
  isAnnualFortuneReportMode,
  type AnnualFortuneReportDraft,
  type AnnualFortuneReportMode,
} from "./annualFortuneReportDraftTypes";

export type AnnualFortuneReportDraftValidationResult = {
  readonly ok: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
  readonly value?: AnnualFortuneReportDraft;
};

const hardClaimReplacements = [
  ["반드시", "흐름상"],
  ["무조건", "대체로"],
  ["합격합니다", "합격 가능성을 준비하게 됩니다"],
  ["불합격합니다", "결과 확인 전까지 보완이 필요합니다"],
  ["이직합니다", "이직을 검토하는 흐름으로 나타날 수 있습니다"],
  ["퇴사합니다", "퇴사를 고민하는 흐름으로 나타날 수 있습니다"],
  ["승진합니다", "승진이나 역할 확대를 준비하는 흐름이 생길 수 있습니다"],
  ["돈을 법니다", "돈의 흐름을 만들 기회가 생길 수 있습니다"],
  ["병이 생깁니다", "몸의 리듬을 더 살피는 흐름이 생길 수 있습니다"],
  ["결혼합니다", "관계를 공식화할지를 검토하는 흐름이 생길 수 있습니다"],
  ["헤어집니다", "관계의 거리와 기준을 다시 보게 될 수 있습니다"],
] as const;

const awkwardKoreanReplacements = [
  ["파트너십가", "파트너십이"],
  ["관리 부담가", "관리 부담이"],
  ["표현의 온도이", "표현의 온도가"],
  ["기준 정리이", "기준 정리가"],
  ["정화을", "정화를"],
  ["무토은", "무토는"],
  ["계수은", "계수는"],
] as const;

const internalForbiddenWords = [
  "evidence",
  "debug",
  "diagnostic-only",
  "진단용",
  "schema",
  "fixture",
] as const;

const modeToneMarkers = {
  past_review: ["그해", "회고", "그 시기", "왜", "흔들렸", "압박", "반복"],
  current_year: ["올해", "준비", "활용", "기회", "조심", "흐름을 쓰는"],
  new_year_preview: ["신년", "준비", "활용", "기회", "조심", "흐름을 쓰는"],
} as const satisfies Record<AnnualFortuneReportMode, readonly string[]>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function sanitizeAnnualFortuneKoreanCopy(text: string): string {
  const normalized = [...awkwardKoreanReplacements, ...hardClaimReplacements]
    .reduce((current, [from, to]) => current.split(from).join(to), text)
    .replace(/\b(Partner|Family) ([AB])을/g, "$1 $2를")
    .replace(/\b(Partner|Family) ([AB])은/g, "$1 $2는")
    .replace(/\b(Partner|Family) ([AB])이/g, "$1 $2가");

  return internalForbiddenWords
    .reduce(
      (current, word) => current.replace(new RegExp(word, "giu"), ""),
      normalized,
    )
    .replace(/\s{2,}/g, " ")
    .trim();
}

function sanitizeStringArray(values: readonly string[]): readonly string[] {
  return values.map(sanitizeAnnualFortuneKoreanCopy);
}

function sanitizeDraft(draft: AnnualFortuneReportDraft): AnnualFortuneReportDraft {
  return {
    ...draft,
    openingTitle: sanitizeAnnualFortuneKoreanCopy(draft.openingTitle),
    openingSummary: sanitizeAnnualFortuneKoreanCopy(draft.openingSummary),
    coreLine: sanitizeAnnualFortuneKoreanCopy(draft.coreLine),
    yearSummary: {
      ganji: sanitizeAnnualFortuneKoreanCopy(draft.yearSummary.ganji),
      displayTitle: sanitizeAnnualFortuneKoreanCopy(draft.yearSummary.displayTitle),
      elementLabel: sanitizeAnnualFortuneKoreanCopy(draft.yearSummary.elementLabel),
      tenGodLabel: sanitizeAnnualFortuneKoreanCopy(draft.yearSummary.tenGodLabel),
      modeLabel: sanitizeAnnualFortuneKoreanCopy(draft.yearSummary.modeLabel),
      yearTone: sanitizeAnnualFortuneKoreanCopy(draft.yearSummary.yearTone),
    },
    scoreSummary: {
      totalScore: clampScore(draft.scoreSummary.totalScore),
      scoreLabel: sanitizeAnnualFortuneKoreanCopy(draft.scoreSummary.scoreLabel),
      scoreCaution: sanitizeAnnualFortuneKoreanCopy(
        draft.scoreSummary.scoreCaution,
      ),
    },
    flowCards: draft.flowCards.map((card) => ({
      label: sanitizeAnnualFortuneKoreanCopy(card.label),
      score: clampScore(card.score),
      headline: sanitizeAnnualFortuneKoreanCopy(card.headline),
      body: sanitizeAnnualFortuneKoreanCopy(card.body),
    })),
    keySignals: draft.keySignals.map((signal) => ({
      ...signal,
      title: sanitizeAnnualFortuneKoreanCopy(signal.title),
      body: sanitizeAnnualFortuneKoreanCopy(signal.body),
      evidenceLabel: sanitizeAnnualFortuneKoreanCopy(signal.evidenceLabel),
    })),
    annualStructure: {
      ganjiExplanation: sanitizeAnnualFortuneKoreanCopy(
        draft.annualStructure.ganjiExplanation,
      ),
      tenGodExplanation: sanitizeAnnualFortuneKoreanCopy(
        draft.annualStructure.tenGodExplanation,
      ),
      elementEffectExplanation: sanitizeAnnualFortuneKoreanCopy(
        draft.annualStructure.elementEffectExplanation,
      ),
      branchInteractionExplanation: sanitizeAnnualFortuneKoreanCopy(
        draft.annualStructure.branchInteractionExplanation,
      ),
    },
    chapters: draft.chapters.map((chapter) => ({
      title: sanitizeAnnualFortuneKoreanCopy(chapter.title),
      headline: sanitizeAnnualFortuneKoreanCopy(chapter.headline),
      body: sanitizeAnnualFortuneKoreanCopy(chapter.body),
      likelyScenes: sanitizeStringArray(chapter.likelyScenes),
      practicalAdvice: sanitizeStringArray(chapter.practicalAdvice),
    })),
    monthlyFlow: draft.monthlyFlow.map((flow) => ({
      month: flow.month,
      label: sanitizeAnnualFortuneKoreanCopy(flow.label),
      headline: sanitizeAnnualFortuneKoreanCopy(flow.headline),
      ...(flow.elementFocus === undefined
        ? {}
        : { elementFocus: sanitizeAnnualFortuneKoreanCopy(flow.elementFocus) }),
      body: sanitizeAnnualFortuneKoreanCopy(flow.body),
      advice: sanitizeAnnualFortuneKoreanCopy(flow.advice),
    })),
    finalAdvice: sanitizeStringArray(draft.finalAdvice),
    safetyNotes: sanitizeStringArray(draft.safetyNotes),
  };
}

function hasDraftShape(value: unknown): value is AnnualFortuneReportDraft {
  if (!isRecord(value)) {
    return false;
  }

  const draft = value as Partial<AnnualFortuneReportDraft>;

  return (
    draft.version === "v1" &&
    draft.productType === "annual_fortune" &&
    draft.productVersion === "v1" &&
    isNumber(draft.targetYear) &&
    isAnnualFortuneReportMode(draft.mode) &&
    typeof draft.personLabel === "string" &&
    typeof draft.openingTitle === "string" &&
    typeof draft.openingSummary === "string" &&
    typeof draft.coreLine === "string" &&
    isRecord(draft.yearSummary) &&
    typeof draft.yearSummary.ganji === "string" &&
    typeof draft.yearSummary.displayTitle === "string" &&
    typeof draft.yearSummary.elementLabel === "string" &&
    typeof draft.yearSummary.tenGodLabel === "string" &&
    typeof draft.yearSummary.modeLabel === "string" &&
    typeof draft.yearSummary.yearTone === "string" &&
    isRecord(draft.scoreSummary) &&
    isNumber(draft.scoreSummary.totalScore) &&
    typeof draft.scoreSummary.scoreLabel === "string" &&
    typeof draft.scoreSummary.scoreCaution === "string" &&
    Array.isArray(draft.flowCards) &&
    Array.isArray(draft.keySignals) &&
    isRecord(draft.annualStructure) &&
    typeof draft.annualStructure.ganjiExplanation === "string" &&
    typeof draft.annualStructure.tenGodExplanation === "string" &&
    typeof draft.annualStructure.elementEffectExplanation === "string" &&
    typeof draft.annualStructure.branchInteractionExplanation === "string" &&
    Array.isArray(draft.chapters) &&
    Array.isArray(draft.monthlyFlow) &&
    isStringArray(draft.finalAdvice) &&
    isStringArray(draft.safetyNotes)
  );
}

function collectVisibleStrings(draft: AnnualFortuneReportDraft): readonly string[] {
  return [
    draft.openingTitle,
    draft.openingSummary,
    draft.coreLine,
    draft.yearSummary.ganji,
    draft.yearSummary.displayTitle,
    draft.yearSummary.elementLabel,
    draft.yearSummary.tenGodLabel,
    draft.yearSummary.modeLabel,
    draft.yearSummary.yearTone,
    draft.scoreSummary.scoreLabel,
    draft.scoreSummary.scoreCaution,
    ...draft.flowCards.flatMap((card) => [
      card.label,
      card.headline,
      card.body,
    ]),
    ...draft.keySignals.flatMap((signal) => [
      signal.title,
      signal.body,
      signal.evidenceLabel,
    ]),
    draft.annualStructure.ganjiExplanation,
    draft.annualStructure.tenGodExplanation,
    draft.annualStructure.elementEffectExplanation,
    draft.annualStructure.branchInteractionExplanation,
    ...draft.chapters.flatMap((chapter) => [
      chapter.title,
      chapter.headline,
      chapter.body,
      ...chapter.likelyScenes,
      ...chapter.practicalAdvice,
    ]),
    ...draft.monthlyFlow.flatMap((flow) => [
      flow.label,
      flow.headline,
      flow.elementFocus ?? "",
      flow.body,
      flow.advice,
    ]),
    ...draft.finalAdvice,
    ...draft.safetyNotes,
  ];
}

function validateArrayLengths(
  draft: AnnualFortuneReportDraft,
  errors: string[],
): void {
  if (draft.chapters.length < 6 || draft.chapters.length > 10) {
    errors.push("ANNUAL_FORTUNE_CHAPTER_COUNT_INVALID");
  }
  for (const [index, chapter] of draft.chapters.entries()) {
    if (chapter.likelyScenes.length < 2 || chapter.likelyScenes.length > 4) {
      errors.push(`ANNUAL_FORTUNE_LIKELY_SCENES_INVALID:${index}`);
    }
    if (
      chapter.practicalAdvice.length < 2 ||
      chapter.practicalAdvice.length > 4
    ) {
      errors.push(`ANNUAL_FORTUNE_PRACTICAL_ADVICE_INVALID:${index}`);
    }
  }
  if (draft.monthlyFlow.length !== 12) {
    errors.push("ANNUAL_FORTUNE_MONTHLY_FLOW_INVALID");
  }
  if (draft.finalAdvice.length < 4 || draft.finalAdvice.length > 7) {
    errors.push("ANNUAL_FORTUNE_FINAL_ADVICE_INVALID");
  }
  if (draft.safetyNotes.length < 2 || draft.safetyNotes.length > 4) {
    errors.push("ANNUAL_FORTUNE_SAFETY_NOTES_INVALID");
  }
}

function validateModeTone(
  draft: AnnualFortuneReportDraft,
  visibleText: string,
  errors: string[],
): void {
  const markers = modeToneMarkers[draft.mode];

  if (!markers.some((marker) => visibleText.includes(marker))) {
    errors.push(`ANNUAL_FORTUNE_MODE_TONE_MISSING:${draft.mode}`);
  }
}

export function validateAnnualFortuneReportDraft(
  draft: unknown,
): AnnualFortuneReportDraftValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!hasDraftShape(draft)) {
    return {
      ok: false,
      errors: ["ANNUAL_FORTUNE_SCHEMA_INVALID"],
      warnings,
    };
  }

  const sanitizedDraft = sanitizeDraft(draft);
  validateArrayLengths(sanitizedDraft, errors);

  const visibleText = collectVisibleStrings(sanitizedDraft).join("\n");
  validateModeTone(sanitizedDraft, visibleText, errors);

  for (const word of internalForbiddenWords) {
    if (visibleText.toLowerCase().includes(word.toLowerCase())) {
      errors.push(`ANNUAL_FORTUNE_INTERNAL_WORD_VISIBLE:${word}`);
    }
  }

  return errors.length === 0
    ? { ok: true, errors: [], warnings, value: sanitizedDraft }
    : { ok: false, errors, warnings };
}

export function assertValidAnnualFortuneReportDraft(
  draft: unknown,
): AnnualFortuneReportDraft {
  const result = validateAnnualFortuneReportDraft(draft);

  if (!result.ok || result.value === undefined) {
    throw new Error(
      `Annual fortune report draft is invalid: ${result.errors.join("; ")}`,
    );
  }

  return result.value;
}
