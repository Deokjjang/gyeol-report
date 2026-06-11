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

export type ComprehensiveReportDraftValidationResult = {
  readonly ok: boolean;
  readonly errors: readonly string[];
  readonly value?: ComprehensiveReportDraft;
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
      errors.push(`draft contains forbidden prophecy phrase: ${phrase}`);
    }
  }
  for (const marker of privateOutputMarkers) {
    if (text.includes(marker)) {
      errors.push(`draft contains private field marker: ${marker}`);
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
  if (!validateStringField(errors, `${sectionId}.body`, body, 20)) {
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
): ComprehensiveReportDraftValidationResult {
  const errors: string[] = [];

  appendTextSafetyErrors(errors, input);

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
): ComprehensiveReportDraft {
  const result = validateComprehensiveReportDraft(input);

  if (!result.ok || result.value === undefined) {
    throw new Error(
      `Comprehensive report draft is unsafe: ${result.errors.join("; ")}`,
    );
  }

  return result.value;
}
