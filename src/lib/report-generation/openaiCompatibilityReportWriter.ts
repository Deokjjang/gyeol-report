import type { CompatibilityEvidencePacket } from "../report-knowledge/compatibilityEvidenceBuilder";
import {
  getCompatibilityScoreCaution,
  type CompatibilityRelationshipType,
} from "../report-knowledge/compatibilityTypes";
import type { CompatibilityReportDraft } from "./compatibilityReportDraftTypes";
import { compatibilityReportDraftJsonSchema } from "./compatibilityReportDraftSchema";
import {
  assertValidCompatibilityReportDraft,
  sanitizeCompatibilityKoreanCopy,
  validateCompatibilityReportDraft,
} from "./compatibilityReportDraftValidator";
import {
  callOpenAIReportWriter,
  isOpenAIReportWriterClientError,
  type OpenAIReportWriterClientConfig,
  type OpenAIReportWriterSafeDiagnostics,
} from "./openaiReportWriterClient";
import {
  buildOpenAICompatibilityReportRepairMessages,
  buildOpenAICompatibilityReportWriterMessages,
  deriveAllowedCompatibilityMbtiTerms,
  deriveAllowedCompatibilitySajuTerms,
} from "./openaiCompatibilityReportWriterPrompt";

export type CompatibilityReportWriterResult = {
  readonly draft: CompatibilityReportDraft;
  readonly model: string;
  readonly repaired: boolean;
};

export const compatibilityResponseFormatName = "compatibility_report_draft";

const diagnosticOnlyCompatibilityTerms = ["백호대살"] as const;

export type CompatibilityOpenAIRequestDiagnostics = OpenAIReportWriterSafeDiagnostics & {
  readonly responseFormatName: typeof compatibilityResponseFormatName;
  readonly schemaTopLevelKeys: readonly string[];
  readonly schemaApproxChars: number;
  readonly model?: string;
};

export class CompatibilityReportWriterFailure extends Error {
  readonly code: string;
  readonly validationErrors?: readonly string[];
  readonly diagnostics?: CompatibilityOpenAIRequestDiagnostics;

  constructor(input: {
    readonly code: string;
    readonly validationErrors?: readonly string[];
    readonly diagnostics?: CompatibilityOpenAIRequestDiagnostics;
    readonly cause?: unknown;
  }) {
    super(
      [
        input.code,
        ...(input.validationErrors === undefined
          ? []
          : ["validation errors:", ...input.validationErrors.map((error) => `- ${error}`)]),
        ...(input.diagnostics === undefined
          ? []
          : formatCompatibilityOpenAIRequestDiagnostics(input.diagnostics)),
      ].join("\n"),
    );
    this.name = "CompatibilityReportWriterFailure";
    this.code = input.code;
    if (input.validationErrors !== undefined) {
      this.validationErrors = input.validationErrors;
    }
    if (input.diagnostics !== undefined) {
      this.diagnostics = input.diagnostics;
    }
    if (input.cause !== undefined) {
      this.cause = input.cause;
    }
  }
}

function sanitizeDiagnosticText(value: string): string {
  return value
    .replace(/Bearer\s+[A-Za-z0-9._~+/=-]+/g, "Bearer [redacted]")
    .replace(/sk-[A-Za-z0-9._-]+/g, "sk-[redacted]")
    .replace(/Authorization\s*:\s*[^\n]+/gi, "[redacted-auth]")
    .replace(/OPENAI_API_KEY\s*=\s*[^\s]+/g, "OPENAI_API_KEY=[redacted]")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 500);
}

function getSchemaTopLevelKeys(): readonly string[] {
  return Object.keys(compatibilityReportDraftJsonSchema.properties);
}

function getSchemaApproxChars(): number {
  return JSON.stringify(compatibilityReportDraftJsonSchema).length;
}

function createRequestDiagnostics(input: {
  readonly error: unknown;
  readonly model?: string;
}): CompatibilityOpenAIRequestDiagnostics {
  const base = {
    responseFormatName: compatibilityResponseFormatName,
    schemaTopLevelKeys: getSchemaTopLevelKeys(),
    schemaApproxChars: getSchemaApproxChars(),
    ...(input.model === undefined ? {} : { model: input.model }),
  } satisfies Pick<
    CompatibilityOpenAIRequestDiagnostics,
    "responseFormatName" | "schemaTopLevelKeys" | "schemaApproxChars" | "model"
  >;

  if (isOpenAIReportWriterClientError(input.error)) {
    return {
      ...base,
      ...(input.error.status === undefined ? {} : { status: input.error.status }),
      ...(input.error.errorType === undefined
        ? {}
        : { errorType: sanitizeDiagnosticText(input.error.errorType) }),
      ...(input.error.errorCode === undefined
        ? {}
        : { errorCode: sanitizeDiagnosticText(input.error.errorCode) }),
      ...(input.error.diagnosticMessage === undefined
        ? {}
        : {
            diagnosticMessage: sanitizeDiagnosticText(
              input.error.diagnosticMessage,
            ),
          }),
      ...(input.error.requestId === undefined
        ? {}
        : { requestId: sanitizeDiagnosticText(input.error.requestId) }),
      ...(input.error.errorParam === undefined
        ? {}
        : { errorParam: sanitizeDiagnosticText(input.error.errorParam) }),
    };
  }

  return {
    ...base,
    errorType: "network_error",
    diagnosticMessage: sanitizeDiagnosticText(
      input.error instanceof Error ? input.error.message : String(input.error),
    ),
  };
}

export function formatCompatibilityOpenAIRequestDiagnostics(
  diagnostics: CompatibilityOpenAIRequestDiagnostics,
): readonly string[] {
  const lines = ["OpenAI request failed:"];

  if (diagnostics.status !== undefined) {
    lines.push(`status: ${diagnostics.status}`);
  }
  if (diagnostics.errorType !== undefined) {
    lines.push(`type: ${diagnostics.errorType}`);
  }
  if (diagnostics.errorCode !== undefined) {
    lines.push(`code: ${diagnostics.errorCode}`);
  }
  if (diagnostics.diagnosticMessage !== undefined) {
    lines.push(`message: ${diagnostics.diagnosticMessage}`);
  }
  if (diagnostics.errorParam !== undefined) {
    lines.push(`param: ${diagnostics.errorParam}`);
  }
  if (diagnostics.requestId !== undefined) {
    lines.push(`requestId: ${diagnostics.requestId}`);
  }
  lines.push(`response_format name: ${diagnostics.responseFormatName}`);
  lines.push(`schema top-level keys: ${diagnostics.schemaTopLevelKeys.join(", ")}`);
  lines.push(`schema approx chars: ${diagnostics.schemaApproxChars}`);
  if (diagnostics.model !== undefined) {
    lines.push(`model: ${diagnostics.model}`);
  }

  return lines;
}

function parseJson(rawText: string): unknown {
  try {
    return JSON.parse(rawText) as unknown;
  } catch (error) {
    throw new CompatibilityReportWriterFailure({
      code: "OPENAI_COMPATIBILITY_REPORT_WRITER_INVALID_JSON",
      cause: error,
    });
  }
}

function attachDeterministicEvidence(input: {
  readonly parsed: unknown;
  readonly evidencePacket: CompatibilityEvidencePacket;
}): unknown {
  if (
    typeof input.parsed !== "object" ||
    input.parsed === null ||
    Array.isArray(input.parsed)
  ) {
    return input.parsed;
  }

  return {
    ...input.parsed,
    version: "compatibility_v1_draft",
    productType: "saju_mbti_compatibility",
    productVersion: "1.0",
    relationshipType: input.evidencePacket.input.relationshipType,
    personALabel: input.evidencePacket.input.personA.displayName,
    personBLabel: input.evidencePacket.input.personB.displayName,
    scoreSummary: buildCompatibilityDraftScoreSummary({
      score: input.evidencePacket.score,
      relationshipType: input.evidencePacket.input.relationshipType,
    }),
    chartComparison: {
      personA: input.evidencePacket.personAChartSummary,
      personB: input.evidencePacket.personBChartSummary,
    },
  };
}

function buildCompatibilityDraftScoreSummary(input: {
  readonly score: CompatibilityReportDraft["scoreSummary"];
  readonly relationshipType: CompatibilityEvidencePacket["input"]["relationshipType"];
}): CompatibilityReportDraft["scoreSummary"] {
  if (input.score.totalScore >= 65 && input.score.totalScore <= 74) {
    return {
      ...input.score,
      scoreLabel: "조율형 궁합",
      scoreCaution: getCompatibilityScoreCaution(
        input.relationshipType,
        input.score.totalScore,
      ),
    };
  }

  return {
    ...input.score,
    scoreCaution: getCompatibilityScoreCaution(
      input.relationshipType,
      input.score.totalScore,
    ),
  };
}

function sanitizeDiagnosticTermText(input: string, removedTerms: Set<string>): string {
  const withoutDiagnosticTerms = diagnosticOnlyCompatibilityTerms
    .reduce((text, term) => {
      if (!text.includes(term)) {
        return text;
      }

      removedTerms.add(term);

      return text.split(term).join("");
    }, input)
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.!?。])/g, "$1")
    .replace(/\(\s*\)/g, "")
    .trim();

  return sanitizeCompatibilityKoreanCopy(withoutDiagnosticTerms);
}

function getSanitizedSafetyNote(
  relationshipType: CompatibilityRelationshipType | undefined,
  originalText: string,
): string {
  if (relationshipType === "family" && /MBTI|missing|미입력|입력되지/u.test(originalText)) {
    return "MBTI가 입력되지 않은 사람은 실제 대화 습관과 생활 리듬을 더 우선해서 보세요.";
  }
  if (relationshipType === "business_work_partner") {
    return "이 리포트는 파트너십의 성공이나 실패를 단정하지 않습니다.";
  }

  return "이 리포트는 관계의 성공이나 실패를 단정하지 않습니다.";
}

function sanitizeSafetyNoteText(
  input: string,
  removedTerms: Set<string>,
  relationshipType?: CompatibilityRelationshipType,
): string {
  const sanitized = sanitizeDiagnosticTermText(input, removedTerms);

  return /diagnostic-only|진단용|사용자용 본문|확정 feature|confidence warning|evidence|debug/u.test(
    sanitized,
  )
    ? getSanitizedSafetyNote(relationshipType, input)
    : sanitized;
}

function sanitizeDiagnosticTermsInValue(
  value: unknown,
  removedTerms: Set<string>,
  relationshipType?: CompatibilityRelationshipType,
): unknown {
  if (typeof value === "string") {
    return sanitizeDiagnosticTermText(value, removedTerms);
  }

  if (Array.isArray(value)) {
    return value
      .map((item) =>
        sanitizeDiagnosticTermsInValue(item, removedTerms, relationshipType),
      )
      .filter((item) => typeof item !== "string" || item.trim().length > 0);
  }

  if (typeof value !== "object" || value === null) {
    return value;
  }

  const currentRelationshipType =
    typeof (value as { readonly relationshipType?: unknown }).relationshipType === "string"
      ? ((value as { readonly relationshipType: CompatibilityRelationshipType })
          .relationshipType)
      : relationshipType;

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => {
      if (key === "safetyNotes" && Array.isArray(item)) {
        return [
          key,
          item
            .map((note) =>
              typeof note === "string"
                ? sanitizeSafetyNoteText(note, removedTerms, currentRelationshipType)
                : sanitizeDiagnosticTermsInValue(
                    note,
                    removedTerms,
                    currentRelationshipType,
                  ),
            )
            .filter((note) => typeof note !== "string" || note.trim().length > 0),
        ];
      }

      return [
        key,
        sanitizeDiagnosticTermsInValue(
          item,
          removedTerms,
          currentRelationshipType,
        ),
      ];
    }),
  );
}

export function sanitizeCompatibilityDiagnosticTerms(input: unknown): {
  readonly value: unknown;
  readonly removedTerms: readonly string[];
  readonly debugNote?: "compatibility sanitizer: diagnostic terms removed";
} {
  const removedTerms = new Set<string>();
  const value = sanitizeDiagnosticTermsInValue(input, removedTerms);
  const removed = [...removedTerms];

  return {
    value,
    removedTerms: removed,
    ...(removed.length === 0
      ? {}
      : { debugNote: "compatibility sanitizer: diagnostic terms removed" as const }),
  };
}

function validateAttachedDraft(input: {
  readonly parsed: unknown;
  readonly evidencePacket: CompatibilityEvidencePacket;
}): CompatibilityReportDraft {
  const allowedSajuTerms = deriveAllowedCompatibilitySajuTerms(input.evidencePacket);
  const allowedMbtiTerms = deriveAllowedCompatibilityMbtiTerms(input.evidencePacket);
  const sanitized = sanitizeCompatibilityDiagnosticTerms(input.parsed);

  return assertValidCompatibilityReportDraft(sanitized.value, {
    allowedSajuTerms,
    allowedMbtiTerms,
  });
}

function getClientFailureCode(error: unknown): string {
  if (isOpenAIReportWriterClientError(error)) {
    return error.code;
  }

  return "OPENAI_COMPATIBILITY_REPORT_WRITER_REQUEST_FAILED";
}

export async function generateCompatibilityReportDraft(input: {
  readonly evidencePacket: CompatibilityEvidencePacket;
  readonly config: OpenAIReportWriterClientConfig;
}): Promise<CompatibilityReportWriterResult> {
  const allowedSajuTerms = deriveAllowedCompatibilitySajuTerms(input.evidencePacket);
  const allowedMbtiTerms = deriveAllowedCompatibilityMbtiTerms(input.evidencePacket);
  const messages = buildOpenAICompatibilityReportWriterMessages({
    evidencePacket: input.evidencePacket,
    allowedSajuTerms,
    allowedMbtiTerms,
  });

  let firstRawText: string;
  let model: string;

  try {
    const result = await callOpenAIReportWriter({
      config: input.config,
      messages,
      jsonSchema: compatibilityReportDraftJsonSchema,
    });
    firstRawText = result.rawText;
    model = result.model;
  } catch (error) {
    const diagnostics = createRequestDiagnostics({
      error,
      model: input.config.model,
    });

    throw new CompatibilityReportWriterFailure({
      code: getClientFailureCode(error),
      diagnostics,
      cause: error,
    });
  }

  const firstParsed = attachDeterministicEvidence({
    parsed: parseJson(firstRawText),
    evidencePacket: input.evidencePacket,
  });
  const firstSanitized = sanitizeCompatibilityDiagnosticTerms(firstParsed);
  const firstValidation = validateCompatibilityReportDraft(firstSanitized.value, {
    allowedSajuTerms,
    allowedMbtiTerms,
  });

  if (firstValidation.ok && firstValidation.value !== undefined) {
    return {
      draft: firstValidation.value,
      model,
      repaired: false,
    };
  }

  const repairMessages = buildOpenAICompatibilityReportRepairMessages({
    previousDraftText: JSON.stringify(firstSanitized.value),
    validationErrors: firstValidation.errors,
    evidencePacket: input.evidencePacket,
    allowedSajuTerms,
    allowedMbtiTerms,
  });

  try {
    const repaired = await callOpenAIReportWriter({
      config: input.config,
      messages: repairMessages,
      jsonSchema: compatibilityReportDraftJsonSchema,
    });
    const repairedParsed = attachDeterministicEvidence({
      parsed: parseJson(repaired.rawText),
      evidencePacket: input.evidencePacket,
    });
    const draft = validateAttachedDraft({
      parsed: repairedParsed,
      evidencePacket: input.evidencePacket,
    });

    return {
      draft,
      model: repaired.model,
      repaired: true,
    };
  } catch (error) {
    throw new CompatibilityReportWriterFailure({
      code: "OPENAI_COMPATIBILITY_REPORT_WRITER_REPAIR_FAILED",
      validationErrors: firstValidation.errors,
      cause: error,
    });
  }
}
