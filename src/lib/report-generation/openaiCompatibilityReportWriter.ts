import type { CompatibilityEvidencePacket } from "../report-knowledge/compatibilityEvidenceBuilder";
import type { CompatibilityReportDraft } from "./compatibilityReportDraftTypes";
import { compatibilityReportDraftJsonSchema } from "./compatibilityReportDraftSchema";
import {
  assertValidCompatibilityReportDraft,
  validateCompatibilityReportDraft,
} from "./compatibilityReportDraftValidator";
import {
  callOpenAIReportWriter,
  isOpenAIReportWriterClientError,
  type OpenAIReportWriterClientConfig,
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

export class CompatibilityReportWriterFailure extends Error {
  readonly code: string;
  readonly validationErrors?: readonly string[];

  constructor(input: {
    readonly code: string;
    readonly validationErrors?: readonly string[];
    readonly cause?: unknown;
  }) {
    super(
      [
        input.code,
        ...(input.validationErrors === undefined
          ? []
          : ["validation errors:", ...input.validationErrors.map((error) => `- ${error}`)]),
      ].join("\n"),
    );
    this.name = "CompatibilityReportWriterFailure";
    this.code = input.code;
    if (input.validationErrors !== undefined) {
      this.validationErrors = input.validationErrors;
    }
    if (input.cause !== undefined) {
      this.cause = input.cause;
    }
  }
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
    scoreSummary: input.evidencePacket.score,
    chartComparison: {
      personA: input.evidencePacket.personAChartSummary,
      personB: input.evidencePacket.personBChartSummary,
    },
  };
}

function validateAttachedDraft(input: {
  readonly parsed: unknown;
  readonly evidencePacket: CompatibilityEvidencePacket;
}): CompatibilityReportDraft {
  const allowedSajuTerms = deriveAllowedCompatibilitySajuTerms(input.evidencePacket);
  const allowedMbtiTerms = deriveAllowedCompatibilityMbtiTerms(input.evidencePacket);

  return assertValidCompatibilityReportDraft(input.parsed, {
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
    throw new CompatibilityReportWriterFailure({
      code: getClientFailureCode(error),
      cause: error,
    });
  }

  const firstParsed = attachDeterministicEvidence({
    parsed: parseJson(firstRawText),
    evidencePacket: input.evidencePacket,
  });
  const firstValidation = validateCompatibilityReportDraft(firstParsed, {
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
    previousDraftText: JSON.stringify(firstParsed),
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
