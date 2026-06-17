import type { CompatibilityReportDraft } from "./compatibilityReportDraftTypes";
import { COMPATIBILITY_REPORT_CHAPTER_IDS } from "./compatibilityReportDraftTypes";

export type CompatibilityReportDraftValidationResult = {
  readonly ok: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
  readonly value?: CompatibilityReportDraft;
};

export type CompatibilityReportDraftValidationOptions = {
  readonly allowedSajuTerms?: readonly string[];
  readonly allowedMbtiTerms?: readonly string[];
};

const unsafeCompatibilityPhrases = [
  "천생연분 확정",
  "운명입니다",
  "운명 확정",
  "무조건",
  "반드시",
  "100%",
  "이별 확정",
  "이혼 확정",
  "소울메이트 확정",
  "임신 확정",
  "결혼 확정",
  "OpenAI",
  "JSON",
  "schema",
  "debug",
  "draft",
  "feature evidence",
  "signature scene",
] as const;

const knownMbtiTypes = [
  "INTJ",
  "INTP",
  "ENTJ",
  "ENTP",
  "INFJ",
  "INFP",
  "ENFJ",
  "ENFP",
  "ISTJ",
  "ISFJ",
  "ESTJ",
  "ESFJ",
  "ISTP",
  "ISFP",
  "ESTP",
  "ESFP",
] as const;

const representativeSajuTerms = [
  "수 부족",
  "화 부족",
  "목 부족",
  "금 부족",
  "토 부족",
  "목 과다",
  "화 과다",
  "토 과다",
  "금 과다",
  "수 과다",
  "갑신일주",
  "정축일주",
  "현침살",
  "홍염살",
  "공망",
  "금여록",
  "재다신약",
  "양인살",
  "천을귀인",
  "재고귀인",
  "암록",
  "천문성",
  "원진살",
  "역마살",
  "화개살",
  "월살",
  "육해살",
  "백호대살",
] as const;

const repeatedAdviceWarningPhrases = [
  "연락",
  "약속",
  "생활비",
  "숫자",
  "재검토",
  "혼자 쉬는 시간",
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isScore(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 35 && value <= 95;
}

function isCompatibilityReportDraftShape(
  value: unknown,
): value is CompatibilityReportDraft {
  if (!isRecord(value)) {
    return false;
  }

  const candidate = value as Partial<CompatibilityReportDraft>;

  return (
    candidate.version === "compatibility_v1_draft" &&
    candidate.productType === "saju_mbti_compatibility" &&
    candidate.productVersion === "1.0" &&
    typeof candidate.relationshipType === "string" &&
    typeof candidate.personALabel === "string" &&
    typeof candidate.personBLabel === "string" &&
    typeof candidate.openingTitle === "string" &&
    typeof candidate.openingSummary === "string" &&
    typeof candidate.coreLine === "string" &&
    isRecord(candidate.scoreSummary) &&
    isScore(candidate.scoreSummary.totalScore) &&
    isRecord(candidate.scoreSummary.breakdown) &&
    isScore(candidate.scoreSummary.breakdown.attraction) &&
    isScore(candidate.scoreSummary.breakdown.communication) &&
    isScore(candidate.scoreSummary.breakdown.lifestyleRhythm) &&
    isScore(candidate.scoreSummary.breakdown.conflictRecovery) &&
    isScore(candidate.scoreSummary.breakdown.longTermStability) &&
    isScore(candidate.scoreSummary.breakdown.growthComplement) &&
    isRecord(candidate.chartComparison) &&
    isRecord(candidate.keyCompatibilityPoints) &&
    Array.isArray(candidate.chapters) &&
    isStringArray(candidate.finalAdvice) &&
    isStringArray(candidate.safetyNotes)
  );
}

function collectVisibleStrings(draft: CompatibilityReportDraft): readonly string[] {
  return [
    draft.openingTitle,
    draft.openingSummary,
    draft.coreLine,
    draft.scoreSummary.scoreLabel,
    draft.scoreSummary.scoreCaution,
    ...draft.keyCompatibilityPoints.attractionPoints,
    ...draft.keyCompatibilityPoints.strengthPoints,
    ...draft.keyCompatibilityPoints.frictionPoints,
    ...draft.keyCompatibilityPoints.relationshipRules,
    ...draft.chapters.flatMap((chapter) => [
      chapter.title,
      chapter.headline,
      chapter.body,
      ...chapter.directHitScenes,
      ...chapter.practicalAdvice,
    ]),
    ...draft.finalAdvice,
    ...draft.safetyNotes,
  ];
}

function validateRequiredChapters(
  draft: CompatibilityReportDraft,
  errors: string[],
): void {
  if (draft.chapters.length < 8) {
    errors.push("COMPATIBILITY_CHAPTER_MISSING");
  }

  const chapterIds = new Set(draft.chapters.map((chapter) => chapter.id));
  for (const requiredId of COMPATIBILITY_REPORT_CHAPTER_IDS.filter(
    (id) => id !== "final_message",
  )) {
    if (!chapterIds.has(requiredId)) {
      errors.push(`COMPATIBILITY_CHAPTER_MISSING: ${requiredId}`);
    }
  }

  for (const chapter of draft.chapters) {
    if (chapter.body.trim().length === 0) {
      errors.push(`COMPATIBILITY_CHAPTER_MISSING: ${chapter.id}`);
    }
    if (chapter.directHitScenes.length === 0) {
      errors.push(`COMPATIBILITY_DIRECT_HIT_MISSING: ${chapter.id}`);
    }
  }
}

function validateUnsafeCopy(text: string, errors: string[]): void {
  for (const phrase of unsafeCompatibilityPhrases) {
    if (text.includes(phrase)) {
      errors.push(`UNSAFE_COMPATIBILITY_COPY: ${phrase}`);
    }
  }
}

function validateMbtiCandidateRecommendations(input: {
  readonly text: string;
  readonly allowedMbtiTerms: readonly string[];
  readonly errors: string[];
}): void {
  const allowed = new Set(input.allowedMbtiTerms.map((term) => term.toUpperCase()));

  for (const mbti of knownMbtiTypes) {
    const mentionsForbiddenType = input.text.includes(mbti) && !allowed.has(mbti);
    const recommendationPattern = new RegExp(
      `${mbti}\\s*(?:가|이|은|는)?\\s*(?:좋습니다|잘 맞습니다|추천|후보)`,
      "u",
    );

    if (mentionsForbiddenType || recommendationPattern.test(input.text)) {
      input.errors.push(
        `MBTI_CANDIDATE_RECOMMENDATION_NOT_ALLOWED: ${mbti}`,
      );
    }
  }
}

function validateUnsupportedSajuTerms(input: {
  readonly text: string;
  readonly allowedSajuTerms: readonly string[];
  readonly errors: string[];
}): void {
  const allowed = new Set(input.allowedSajuTerms.map((term) => term.replace(/\s+/g, "")));

  for (const term of representativeSajuTerms) {
    if (input.text.includes(term) && !allowed.has(term.replace(/\s+/g, ""))) {
      input.errors.push(`UNSUPPORTED_COMPATIBILITY_TERM: ${term}`);
    }
  }
}

function countOccurrences(text: string, phrase: string): number {
  if (phrase.length === 0) {
    return 0;
  }

  return text.split(phrase).length - 1;
}

function collectAdviceStrings(draft: CompatibilityReportDraft): readonly string[] {
  return [
    ...draft.chapters.flatMap((chapter) => chapter.practicalAdvice),
    ...draft.finalAdvice,
  ];
}

function collectRepetitionWarnings(
  draft: CompatibilityReportDraft,
): readonly string[] {
  const adviceItems = collectAdviceStrings(draft);
  const adviceText = adviceItems.join("\n");

  return repeatedAdviceWarningPhrases.flatMap((phrase) => {
    const count = countOccurrences(adviceText, phrase);
    const itemCount = adviceItems.filter((item) => item.includes(phrase)).length;

    return count >= 3 || itemCount >= 3
      ? [`COMPATIBILITY_REPETITIVE_ADVICE_WARNING: ${phrase}`]
      : [];
  });
}

export function validateCompatibilityReportDraft(
  draft: unknown,
  options: CompatibilityReportDraftValidationOptions = {},
): CompatibilityReportDraftValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!isCompatibilityReportDraftShape(draft)) {
    return {
      ok: false,
      errors: ["COMPATIBILITY_SCHEMA_INVALID"],
      warnings: [],
    };
  }

  if (!isScore(draft.scoreSummary.totalScore)) {
    errors.push("COMPATIBILITY_SCORE_MISSING");
  }
  validateRequiredChapters(draft, errors);
  if (draft.finalAdvice.length < 3) {
    errors.push("COMPATIBILITY_FINAL_ADVICE_MISSING");
  }
  if (draft.safetyNotes.length < 1) {
    errors.push("COMPATIBILITY_FINAL_ADVICE_MISSING");
  }

  const text = collectVisibleStrings(draft).join("\n");
  validateUnsafeCopy(text, errors);
  validateMbtiCandidateRecommendations({
    text,
    allowedMbtiTerms: options.allowedMbtiTerms ?? [],
    errors,
  });
  validateUnsupportedSajuTerms({
    text,
    allowedSajuTerms: options.allowedSajuTerms ?? [],
    errors,
  });
  warnings.push(...collectRepetitionWarnings(draft));

  return errors.length === 0
    ? { ok: true, errors: [], warnings, value: draft }
    : { ok: false, errors, warnings };
}

export function assertValidCompatibilityReportDraft(
  draft: unknown,
  options: CompatibilityReportDraftValidationOptions = {},
): CompatibilityReportDraft {
  const result = validateCompatibilityReportDraft(draft, options);

  if (!result.ok || result.value === undefined) {
    throw new Error(`Compatibility report draft is invalid: ${result.errors.join("; ")}`);
  }

  return result.value;
}
