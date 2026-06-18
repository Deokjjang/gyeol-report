import type { CompatibilityReportDraft } from "./compatibilityReportDraftTypes";
import { COMPATIBILITY_REPORT_CHAPTER_IDS } from "./compatibilityReportDraftTypes";
import {
  adaptCompatibilityTextForRelationshipType,
  type CompatibilityRelationshipType,
} from "../report-knowledge/compatibilityTypes";

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
  "diagnostic-only",
  "진단용",
  "사용자용 본문",
  "확정 feature",
  "confidence warning",
  "evidence",
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

const finalAdviceLabelMismatchWarning =
  "COMPATIBILITY_FINAL_ADVICE_LABEL_MISMATCH_WARNING" as const;

const finalAdviceConflictMarkers = [
  "서운",
  "갈등",
  "어긋",
  "감정",
  "싸움",
  "불편",
  "회복",
] as const;

const finalAdviceHelpMarkers = [
  "도움",
  "필요",
  "요청",
  "공유",
] as const;

const finalAdviceDefaultLabels = [
  "대화 규칙",
  "생활 기준",
  "도움 요청",
  "갈등 회복",
] as const;

const finalAdviceKnownPrefixes = [
  "대화 규칙",
  "생활 기준",
  "도움 요청",
  "갈등 회복",
  "실행 규칙",
  "생활 리듬",
  "돈과 생활",
  "돈과 자원",
  "관계 기준",
  "관계 속도",
  "감정 표현",
  "협업 시너지",
  "데이트",
  "연애",
  "거리 조절",
  "대화 습관",
  "대화 리듬",
  "도움 방식",
  "오해 회복",
  "경계선",
  "오래 가는 규칙",
  "역할 분담",
  "장기 운영",
  "정서 회복",
  "피드백 규칙",
  "갈등 조정",
  "업무 기준",
  "의사결정",
  "신뢰 관리",
] as const;

const internalArtifactPhrases = [
  "diagnostic-only",
  "진단용",
  "사용자용 본문",
  "확정 feature",
  "confidence warning",
  "evidence",
  "debug",
] as const;

export function sanitizeCompatibilityKoreanCopy(text: string): string {
  return text
    .split("정화을").join("정화를")
    .split("표현의 온도이").join("표현의 온도가")
    .split("기준 정리이").join("기준 정리가")
    .split("무토은").join("무토는")
    .split("무토이").join("무토가")
    .split("계수은").join("계수는")
    .split("정화은").join("정화는")
    .split("경금을").join("경금을")
    .split("경금를").join("경금을")
    .replace(/\b(Partner|Family) ([AB])을/g, "$1 $2를")
    .replace(/\b(Partner|Family) ([AB])은/g, "$1 $2는")
    .replace(/\b(Partner|Family) ([AB])이/g, "$1 $2가")
    .split("Partner A을").join("Partner A를")
    .split("Partner B을").join("Partner B를")
    .split("Family A을").join("Family A를")
    .split("Family B을").join("Family B를")
    .split("Partner A이").join("Partner A가")
    .split("Partner B이").join("Partner B가")
    .split("Family A이").join("Family A가")
    .split("Family B이").join("Family B가")
    .split("파트너십가").join("파트너십이")
    .split("관리 부담가").join("관리 부담이")
    .split("협업 시너지은").join("협업 시너지는")
    .split("협업 시너지과").join("협업 시너지와")
    .split("업무 미팅와").join("업무 미팅과")
    .split("목·금가").join("목과 금의 흐름이")
    .split("토·금가").join("토와 금이")
    .split("목·금이 약해").join("목과 금의 흐름이 약해")
    .split("화·수가 약해").join("화와 수의 흐름이 약해")
    .split("충가 있어").join("충이 있어");
}

export function sanitizeCompatibilityAwkwardKoreanText(text: string): string {
  return sanitizeCompatibilityKoreanCopy(text);
}

export function sanitizeCompatibilityVisibleText(
  text: string,
  relationshipType: CompatibilityRelationshipType,
): string {
  const firstPass = adaptCompatibilityTextForRelationshipType(
    sanitizeCompatibilityKoreanCopy(text),
    relationshipType,
  );
  const secondPass = adaptCompatibilityTextForRelationshipType(
    sanitizeCompatibilityKoreanCopy(firstPass),
    relationshipType,
  );

  return sanitizeCompatibilityKoreanCopy(secondPass);
}

function containsInternalArtifactText(text: string): boolean {
  return internalArtifactPhrases.some((phrase) => text.includes(phrase));
}

function sanitizeCompatibilitySafetyNote(
  text: string,
  relationshipType: CompatibilityReportDraft["relationshipType"],
): string {
  const sanitized = sanitizeCompatibilityVisibleText(text, relationshipType);

  if (!containsInternalArtifactText(sanitized)) {
    return sanitized;
  }

  if (relationshipType === "family" && /MBTI|missing|미입력|입력되지/u.test(text)) {
    return "MBTI가 입력되지 않은 사람은 실제 대화 습관과 생활 리듬을 더 우선해서 보세요.";
  }
  if (relationshipType === "business_work_partner") {
    return "이 리포트는 파트너십의 성공이나 실패를 단정하지 않습니다.";
  }

  return "이 리포트는 관계의 성공이나 실패를 단정하지 않습니다.";
}

function sanitizeStringArray(
  values: readonly string[],
  relationshipType: CompatibilityReportDraft["relationshipType"],
): readonly string[] {
  return values.map((value) =>
    sanitizeCompatibilityVisibleText(value, relationshipType),
  );
}

function sanitizeChartSummary(
  chart: CompatibilityReportDraft["chartComparison"]["personA"],
  relationshipType: CompatibilityReportDraft["relationshipType"],
): CompatibilityReportDraft["chartComparison"]["personA"] {
  return {
    ...chart,
    displayName: sanitizeCompatibilityVisibleText(
      chart.displayName,
      relationshipType,
    ),
    dayMaster: sanitizeCompatibilityKoreanCopy(chart.dayMaster),
    dayPillar: sanitizeCompatibilityKoreanCopy(chart.dayPillar),
    featureLabels: sanitizeStringArray(chart.featureLabels, relationshipType),
    diagnosticFeatureLabels: sanitizeStringArray(
      chart.diagnosticFeatureLabels,
      relationshipType,
    ),
  };
}

function sanitizeCompatibilityDraft(
  draft: CompatibilityReportDraft,
): CompatibilityReportDraft {
  return {
    ...draft,
    openingTitle: sanitizeCompatibilityVisibleText(
      draft.openingTitle,
      draft.relationshipType,
    ),
    openingSummary: sanitizeCompatibilityVisibleText(
      draft.openingSummary,
      draft.relationshipType,
    ),
    coreLine: sanitizeCompatibilityVisibleText(
      draft.coreLine,
      draft.relationshipType,
    ),
    scoreSummary: {
      ...draft.scoreSummary,
      scoreLabel: sanitizeCompatibilityVisibleText(
        draft.scoreSummary.scoreLabel,
        draft.relationshipType,
      ),
      scoreCaution: sanitizeCompatibilityVisibleText(
        draft.scoreSummary.scoreCaution,
        draft.relationshipType,
      ),
    },
    chartComparison: {
      personA: sanitizeChartSummary(
        draft.chartComparison.personA,
        draft.relationshipType,
      ),
      personB: sanitizeChartSummary(
        draft.chartComparison.personB,
        draft.relationshipType,
      ),
    },
    keyCompatibilityPoints: {
      attractionPoints: sanitizeStringArray(
        draft.keyCompatibilityPoints.attractionPoints,
        draft.relationshipType,
      ),
      strengthPoints: sanitizeStringArray(
        draft.keyCompatibilityPoints.strengthPoints,
        draft.relationshipType,
      ),
      frictionPoints: sanitizeStringArray(
        draft.keyCompatibilityPoints.frictionPoints,
        draft.relationshipType,
      ),
      relationshipRules: sanitizeStringArray(
        draft.keyCompatibilityPoints.relationshipRules,
        draft.relationshipType,
      ),
    },
    chapters: draft.chapters.map((chapter) => ({
      ...chapter,
      title: sanitizeCompatibilityVisibleText(chapter.title, draft.relationshipType),
      headline: sanitizeCompatibilityVisibleText(
        chapter.headline,
        draft.relationshipType,
      ),
      body: sanitizeCompatibilityVisibleText(chapter.body, draft.relationshipType),
      directHitScenes: sanitizeStringArray(
        chapter.directHitScenes,
        draft.relationshipType,
      ),
      practicalAdvice: sanitizeStringArray(
        chapter.practicalAdvice,
        draft.relationshipType,
      ),
    })),
    finalAdvice: sanitizeStringArray(draft.finalAdvice, draft.relationshipType),
    safetyNotes: draft.safetyNotes.map((note) =>
      sanitizeCompatibilitySafetyNote(note, draft.relationshipType),
    ),
  };
}

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

function collectFinalAdviceLabelMismatchWarnings(
  draft: CompatibilityReportDraft,
): readonly string[] {
  const warnings: string[] = [];

  draft.finalAdvice.forEach((advice, index) => {
    const defaultLabel = finalAdviceDefaultLabels[index] ?? "실행 규칙";
    const normalized = normalizeCompatibilityFinalAdviceItemForValidation(advice);
    const label = normalized.label ?? defaultLabel;
    const body = normalized.body;

    if (
      label === "도움 요청" &&
      !finalAdviceHelpMarkers.some((marker) => body.includes(marker)) &&
      finalAdviceConflictMarkers.some((marker) => body.includes(marker))
    ) {
      warnings.push(`${finalAdviceLabelMismatchWarning}: 도움 요청`);
    }
  });

  return warnings;
}

export function normalizeCompatibilityFinalAdviceItemForValidation(item: string): {
  readonly label?: string;
  readonly body: string;
} {
  let body = sanitizeCompatibilityAwkwardKoreanText(item).trim();
  let label: string | undefined;
  let prefix = finalAdviceKnownPrefixes.find((candidate) =>
    body.startsWith(`${candidate}:`),
  );

  while (prefix !== undefined) {
    label = prefix;
    body = body.slice(prefix.length + 1).trim();
    prefix = finalAdviceKnownPrefixes.find((candidate) =>
      body.startsWith(`${candidate}:`),
    );
  }

  return label === undefined ? { body } : { label, body };
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

  const sanitizedDraft = sanitizeCompatibilityDraft(draft);

  if (!isScore(sanitizedDraft.scoreSummary.totalScore)) {
    errors.push("COMPATIBILITY_SCORE_MISSING");
  }
  validateRequiredChapters(sanitizedDraft, errors);
  if (sanitizedDraft.finalAdvice.length < 3) {
    errors.push("COMPATIBILITY_FINAL_ADVICE_MISSING");
  }
  if (sanitizedDraft.safetyNotes.length < 1) {
    errors.push("COMPATIBILITY_FINAL_ADVICE_MISSING");
  }

  const text = collectVisibleStrings(sanitizedDraft).join("\n");
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
  warnings.push(...collectRepetitionWarnings(sanitizedDraft));
  warnings.push(...collectFinalAdviceLabelMismatchWarnings(sanitizedDraft));

  return errors.length === 0
    ? { ok: true, errors: [], warnings, value: sanitizedDraft }
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
