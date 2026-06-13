import type {
  ComprehensiveReportDraft,
  ComprehensiveReportDraftSection,
  ComprehensiveReportDraftTone,
} from "./comprehensiveReportDraftTypes";
import {
  COMPREHENSIVE_REPORT_SECTION_DEFINITIONS,
  COMPREHENSIVE_REPORT_SECTION_IDS,
  type ComprehensiveReportSectionId,
} from "../report-knowledge/reportSectionSchema";
import { SAJU_KNOWLEDGE_BASE } from "../report-knowledge/sajuKnowledgeBase";

export type ComprehensiveReportDraftValidationResult = {
  readonly ok: boolean;
  readonly errors: readonly string[];
  readonly value?: ComprehensiveReportDraft;
};

export type ComprehensiveReportDraftValidationOptions = {
  readonly allowedSajuTerms?: readonly string[];
  readonly allowedMbtiTerms?: readonly string[];
};

const allowedTones = [
  "saju_first",
  "conversational",
  "direct",
  "warm",
  "cautionary",
] as const satisfies readonly ComprehensiveReportDraftTone[];

const allowedCautionLevels = ["low", "medium", "high"] as const;

const forbiddenOutputPhrases = [
  "반드시 " + "결혼한다",
  "죽" + "는다",
  "사고가 " + "난다",
  "무조건 " + "이혼한다",
  "100% " + "확정",
  "절대 " + "성공한다",
  "절대 " + "실패한다",
  "몇월 " + "며칠에 " + "반드시",
] as const;

const forbiddenInternalMetaPhrases = [
  "초" + "안",
  "검증된 " + "JSON",
  "저장" + "용",
  "fix" + "ture",
  "entry " + "id",
  "entry " + "ids",
  "원문 표는 " + "없고",
  "제공된 만세력 " + "원문",
  "meta" + "data",
  "raw" + "Text",
  "schema",
  "validator",
  "Open" + "AI",
  "프롬" + "프트",
  "디버" + "그",
  "테스트" + "용",
] as const;

const privateOutputMarkers = [
  "paymentKey",
  "providerPaymentId",
  "provider_payment_id",
  "inputSnapshot",
  "input_snapshot",
  "shareToken",
  "accessTokenHash",
  "TOSS_SECRET_KEY",
  "SUPABASE_SERVICE_ROLE",
  "OPENAI_API_KEY",
] as const;

const rawOpenAIMetadataKeys = [
  "id",
  "object",
  "created",
  "created_at",
  "model",
  "usage",
  "choices",
  "output",
  "output_text",
] as const;

const draftRootKeys = [
  "version",
  "productType",
  "tone",
  "openingTitle",
  "openingSummary",
  "coreLine",
  "sections",
  "finalAdvice",
  "safetyNotes",
] as const;

const sectionKeys = [
  "sectionId",
  "titleKo",
  "oneLine",
  "body",
  "evidenceSummary",
  "sajuTermsUsed",
  "mbtiTermsUsed",
  "cautionLevel",
] as const;

const displayOnlySectionIds = ["manse_table", "mbti_table"] as const;
const mbtiFirstBodyPrefixes = [
  "MBTI상",
  "입력하신 MBTI가 먼저",
] as const;
const koreanHeavenlyStems = [
  "갑",
  "을",
  "병",
  "정",
  "무",
  "기",
  "경",
  "신",
  "임",
  "계",
] as const;
const koreanEarthlyBranches = [
  "자",
  "축",
  "인",
  "묘",
  "진",
  "사",
  "오",
  "미",
  "신",
  "유",
  "술",
  "해",
] as const;
const ganjiContextSuffixes = ["일주", "년", "월", "일", "시"] as const;

function isDisplayOnlySectionId(
  value: ComprehensiveReportSectionId,
): boolean {
  return (displayOnlySectionIds as readonly string[]).includes(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isSectionId(value: unknown): value is ComprehensiveReportSectionId {
  return (
    typeof value === "string" &&
    (COMPREHENSIVE_REPORT_SECTION_IDS as readonly string[]).includes(value)
  );
}

function isTone(value: unknown): value is ComprehensiveReportDraftTone {
  return typeof value === "string" && (allowedTones as readonly string[]).includes(value);
}

function isCautionLevel(
  value: unknown,
): value is ComprehensiveReportDraftSection["cautionLevel"] {
  return (
    typeof value === "string" &&
    (allowedCautionLevels as readonly string[]).includes(value)
  );
}

function collectStrings(value: unknown): string[] {
  if (typeof value === "string") {
    return [value];
  }
  if (Array.isArray(value)) {
    return value.flatMap((item) => collectStrings(item));
  }
  if (isRecord(value)) {
    return Object.entries(value).flatMap(([key, item]) => [
      key,
      ...collectStrings(item),
    ]);
  }

  return [];
}

function createKnownSajuTerms(): readonly string[] {
  return [
    ...new Set(
      SAJU_KNOWLEDGE_BASE.flatMap((entry) => [
        entry.labelKo,
        ...entry.aliases,
      ])
        .map((term) => term.trim())
        .filter((term) => /[가-힣]/.test(term) && term.length >= 2)
        .sort((left, right) => right.length - left.length),
    ),
  ];
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isKoreanGanjiTerm(term: string): boolean {
  const [stem, branch, rest] = [...term];

  return (
    rest === undefined &&
    (koreanHeavenlyStems as readonly string[]).includes(stem ?? "") &&
    (koreanEarthlyBranches as readonly string[]).includes(branch ?? "")
  );
}

function isAllowedSajuTerm(
  term: string,
  allowedTerms: ReadonlySet<string>,
): boolean {
  const normalizedTerm = term.replace(/\s+/g, "");

  if (allowedTerms.has(normalizedTerm)) {
    return true;
  }

  const ganjiBase = normalizedTerm.slice(0, 2);

  if (
    normalizedTerm === `${ganjiBase}일주` &&
    isKoreanGanjiTerm(ganjiBase) &&
    allowedTerms.has(ganjiBase)
  ) {
    return true;
  }

  if (
    isKoreanGanjiTerm(normalizedTerm) &&
    allowedTerms.has(`${normalizedTerm}일주`)
  ) {
    return true;
  }

  return false;
}

function findContextualGanjiMatches(
  text: string,
  term: string,
): readonly string[] {
  const escapedTerm = escapeRegExp(term);
  const matches: string[] = [];

  for (const suffix of ganjiContextSuffixes) {
    const escapedSuffix = escapeRegExp(suffix);
    const suffixPattern =
      suffix === "일"
        ? `${escapedTerm}\\s*${escapedSuffix}(?!주)`
        : `${escapedTerm}\\s*${escapedSuffix}`;
    const regex = new RegExp(suffixPattern, "g");

    for (const match of text.matchAll(regex)) {
      matches.push(match[0].replace(/\s+/g, ""));
    }
  }

  const standaloneRegex = new RegExp(
    `(^|[^가-힣A-Za-z0-9])(${escapedTerm})(?=$|[^가-힣A-Za-z0-9])`,
    "g",
  );

  for (const match of text.matchAll(standaloneRegex)) {
    const matchedTerm = match[2];
    const termStartIndex = (match.index ?? 0) + match[1].length;
    const tail = text.slice(termStartIndex + matchedTerm.length);

    if (/^\s*(일주|년|월|일|시)/.test(tail)) {
      continue;
    }
    matches.push(matchedTerm);
  }

  return matches;
}

function findSajuTermMatches(text: string, term: string): readonly string[] {
  if (isKoreanGanjiTerm(term)) {
    return findContextualGanjiMatches(text, term);
  }

  return text.includes(term) ? [term] : [];
}

function removeLessSpecificMatches(
  matches: readonly string[],
): readonly string[] {
  const uniqueMatches = [...new Set(matches)];

  return uniqueMatches.filter(
    (match) =>
      !uniqueMatches.some(
        (other) =>
          other !== match &&
          other.length > match.length &&
          other.includes(match),
      ),
  );
}

function appendUnknownKeyErrors(
  errors: string[],
  label: string,
  value: Record<string, unknown>,
  allowedKeys: readonly string[],
): void {
  const allowed = new Set(allowedKeys);

  for (const key of Object.keys(value)) {
    if (!allowed.has(key)) {
      errors.push(`${label} contains unsupported field: ${key}`);
    }
  }
}

function appendTextSafetyErrors(errors: string[], value: unknown): void {
  const text = collectStrings(value).join("\n");

  for (const phrase of forbiddenOutputPhrases) {
    if (text.includes(phrase)) {
      errors.push(`FORBIDDEN_PROPHECY_PHRASE: ${phrase}`);
    }
  }
  for (const marker of privateOutputMarkers) {
    if (text.includes(marker)) {
      errors.push(`PRIVATE_FIELD_LEAK: ${marker}`);
    }
  }
  for (const phrase of forbiddenInternalMetaPhrases) {
    if (text.includes(phrase)) {
      errors.push(`INTERNAL_META_COPY: ${phrase}`);
    }
  }
}

function appendRawMetadataErrors(
  errors: string[],
  label: string,
  value: Record<string, unknown>,
): void {
  for (const key of rawOpenAIMetadataKeys) {
    if (Object.hasOwn(value, key)) {
      errors.push(`${label} contains raw OpenAI metadata field: ${key}`);
    }
  }
}

function validateStringField(
  errors: string[],
  label: string,
  value: unknown,
  minimumLength: number,
): value is string {
  if (typeof value !== "string") {
    errors.push(`${label} must be a string.`);
    return false;
  }
  if (value.trim().length < minimumLength) {
    errors.push(`${label} is too short.`);
    return false;
  }

  return true;
}

function appendUnsupportedSajuTermErrors(
  errors: string[],
  value: unknown,
  options: ComprehensiveReportDraftValidationOptions,
): void {
  if (options.allowedSajuTerms === undefined) {
    return;
  }

  const allowedTerms = new Set(
    options.allowedSajuTerms
      .map((term) => term.trim())
      .map((term) => term.replace(/\s+/g, ""))
      .filter((term) => term.length > 0),
  );
  const text = collectStrings(value).join("\n");
  const unsupportedMatches: string[] = [];

  for (const term of createKnownSajuTerms()) {
    for (const match of findSajuTermMatches(text, term)) {
      if (!isAllowedSajuTerm(match, allowedTerms)) {
        unsupportedMatches.push(match);
      }
    }
  }

  for (const match of removeLessSpecificMatches(unsupportedMatches)) {
    errors.push(`UNSUPPORTED_SAJU_TERM: ${match}`);
  }
}

function appendDisplaySectionErrors(
  errors: string[],
  sections: readonly ComprehensiveReportDraftSection[],
): void {
  for (const section of sections) {
    if (!isDisplayOnlySectionId(section.sectionId)) {
      continue;
    }
    if (section.body.length > 120) {
      errors.push(`DISPLAY_SECTION_TOO_LONG: ${section.sectionId}`);
    }
    if (section.evidenceSummary.length > 2) {
      errors.push(`DISPLAY_SECTION_EVIDENCE_TOO_LONG: ${section.sectionId}`);
    }
  }
}

function startsWithMbtiFirstPhrase(text: string): boolean {
  const trimmed = text.trim();

  if (/^[A-Z]{4}(는|라서)/.test(trimmed)) {
    return true;
  }

  return mbtiFirstBodyPrefixes.some((prefix) => trimmed.startsWith(prefix));
}

function appendMbtiFirstErrors(
  errors: string[],
  sections: readonly ComprehensiveReportDraftSection[],
): void {
  for (const section of sections) {
    if (section.sectionId === "mbti_core" || section.sectionId === "mbti_table") {
      continue;
    }
    if (startsWithMbtiFirstPhrase(section.body) || startsWithMbtiFirstPhrase(section.oneLine)) {
      errors.push(`MBTI_FIRST_FORBIDDEN: ${section.sectionId}`);
    }
  }
}

function splitBodySentences(body: string): readonly string[] {
  return body
    .split(/(?<=[.!?。])\s+|\n+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length >= 12);
}

function appendRepetitionErrors(
  errors: string[],
  sections: readonly ComprehensiveReportDraftSection[],
): void {
  const counts = new Map<string, number>();

  for (const section of sections) {
    if (isDisplayOnlySectionId(section.sectionId)) {
      continue;
    }
    for (const sentence of new Set(splitBodySentences(section.body))) {
      counts.set(sentence, (counts.get(sentence) ?? 0) + 1);
    }
  }

  for (const [sentence, count] of counts) {
    if (count >= 3) {
      errors.push(`REPEATED_SENTENCE: ${sentence}`);
    }
  }
}

function parseSection(
  errors: string[],
  value: unknown,
  index: number,
): ComprehensiveReportDraftSection | undefined {
  if (!isRecord(value)) {
    errors.push(`section ${index} must be an object.`);
    return undefined;
  }

  appendUnknownKeyErrors(errors, `section ${index}`, value, sectionKeys);
  appendRawMetadataErrors(errors, `section ${index}`, value);

  const sectionId = value.sectionId;
  const titleKo = value.titleKo;
  const oneLine = value.oneLine;
  const body = value.body;
  const evidenceSummary = value.evidenceSummary;
  const sajuTermsUsed = value.sajuTermsUsed;
  const mbtiTermsUsed = value.mbtiTermsUsed;
  const cautionLevel = value.cautionLevel;

  if (!isSectionId(sectionId)) {
    errors.push(`section ${index} has invalid section id.`);
    return undefined;
  }
  if (!validateStringField(errors, `${sectionId}.titleKo`, titleKo, 1)) {
    return undefined;
  }
  if (!validateStringField(errors, `${sectionId}.oneLine`, oneLine, 8)) {
    return undefined;
  }
  const bodyMinimumLength =
    isDisplayOnlySectionId(sectionId) ? 8 : 20;

  if (!validateStringField(errors, `${sectionId}.body`, body, bodyMinimumLength)) {
    return undefined;
  }
  if (!isStringArray(evidenceSummary)) {
    errors.push(`${sectionId}.evidenceSummary must be a string array.`);
    return undefined;
  }
  if (!isStringArray(sajuTermsUsed)) {
    errors.push(`${sectionId}.sajuTermsUsed must be a string array.`);
    return undefined;
  }
  if (!isStringArray(mbtiTermsUsed)) {
    errors.push(`${sectionId}.mbtiTermsUsed must be a string array.`);
    return undefined;
  }
  if (!isCautionLevel(cautionLevel)) {
    errors.push(`${sectionId}.cautionLevel is invalid.`);
    return undefined;
  }

  return {
    sectionId,
    titleKo,
    oneLine,
    body,
    evidenceSummary,
    sajuTermsUsed,
    mbtiTermsUsed,
    cautionLevel,
  };
}

function appendSectionCoverageErrors(
  errors: string[],
  sections: readonly ComprehensiveReportDraftSection[],
): void {
  const seen = new Set<ComprehensiveReportSectionId>();

  for (const section of sections) {
    if (seen.has(section.sectionId)) {
      errors.push(`draft has duplicate section: ${section.sectionId}`);
    }
    seen.add(section.sectionId);
  }
  for (const requiredSectionId of COMPREHENSIVE_REPORT_SECTION_IDS) {
    if (!seen.has(requiredSectionId)) {
      errors.push(`draft missing section: ${requiredSectionId}`);
    }
  }
}

function appendSajuFirstErrors(
  errors: string[],
  sections: readonly ComprehensiveReportDraftSection[],
): void {
  const sectionById = new Map(sections.map((section) => [section.sectionId, section]));
  const sajuFirstDefinitions = COMPREHENSIVE_REPORT_SECTION_DEFINITIONS.filter(
    (section) => section.primaryBasis !== "display" && section.id !== "mbti_core",
  );
  let mbtiDominantSections = 0;

  for (const definition of sajuFirstDefinitions) {
    const section = sectionById.get(definition.id);

    if (section === undefined) {
      continue;
    }
    if (section.sajuTermsUsed.length === 0) {
      errors.push(`${definition.id} needs Saju terms for a Saju-first draft.`);
    }
    if (section.mbtiTermsUsed.length > section.sajuTermsUsed.length) {
      mbtiDominantSections += 1;
    }
  }

  if (mbtiDominantSections > Math.floor(sajuFirstDefinitions.length / 2)) {
    errors.push("MBTI terms dominate too many Saju-first sections.");
  }
}

function parseDraft(input: unknown, errors: string[]): ComprehensiveReportDraft | undefined {
  if (!isRecord(input)) {
    errors.push("draft must be an object.");
    return undefined;
  }

  appendUnknownKeyErrors(errors, "draft", input, draftRootKeys);
  appendRawMetadataErrors(errors, "draft", input);

  if (input.version !== "comprehensive_v1_draft") {
    errors.push("draft version must be comprehensive_v1_draft.");
  }
  if (input.productType !== "saju_mbti_full") {
    errors.push("draft productType must be saju_mbti_full.");
  }
  if (!Array.isArray(input.tone) || input.tone.length === 0 || !input.tone.every(isTone)) {
    errors.push("draft tone is invalid.");
  }

  validateStringField(errors, "openingTitle", input.openingTitle, 1);
  validateStringField(errors, "openingSummary", input.openingSummary, 20);
  validateStringField(errors, "coreLine", input.coreLine, 8);
  validateStringField(errors, "finalAdvice", input.finalAdvice, 20);

  if (!isStringArray(input.safetyNotes)) {
    errors.push("safetyNotes must be a string array.");
  }
  if (!Array.isArray(input.sections)) {
    errors.push("sections must be an array.");
    return undefined;
  }

  const sections = input.sections
    .map((section, index) => parseSection(errors, section, index))
    .filter((section): section is ComprehensiveReportDraftSection => section !== undefined);

  appendSectionCoverageErrors(errors, sections);
  appendSajuFirstErrors(errors, sections);
  appendDisplaySectionErrors(errors, sections);
  appendMbtiFirstErrors(errors, sections);
  appendRepetitionErrors(errors, sections);

  if (errors.length > 0) {
    return undefined;
  }

  return {
    version: "comprehensive_v1_draft",
    productType: "saju_mbti_full",
    tone: input.tone as readonly ComprehensiveReportDraftTone[],
    openingTitle: input.openingTitle as string,
    openingSummary: input.openingSummary as string,
    coreLine: input.coreLine as string,
    sections,
    finalAdvice: input.finalAdvice as string,
    safetyNotes: input.safetyNotes as readonly string[],
  };
}

export function validateComprehensiveReportDraft(
  input: unknown,
  options: ComprehensiveReportDraftValidationOptions = {},
): ComprehensiveReportDraftValidationResult {
  const errors: string[] = [];

  appendTextSafetyErrors(errors, input);
  appendUnsupportedSajuTermErrors(errors, input, options);

  const value = parseDraft(input, errors);

  if (errors.length > 0 || value === undefined) {
    return {
      ok: false,
      errors,
    };
  }

  return {
    ok: true,
    errors: [],
    value,
  };
}

export function assertComprehensiveReportDraftIsSafe(
  input: unknown,
  options: ComprehensiveReportDraftValidationOptions = {},
): ComprehensiveReportDraft {
  const result = validateComprehensiveReportDraft(input, options);

  if (!result.ok || result.value === undefined) {
    throw new Error(
      `Comprehensive report draft is unsafe: ${result.errors.join("; ")}`,
    );
  }

  return result.value;
}
