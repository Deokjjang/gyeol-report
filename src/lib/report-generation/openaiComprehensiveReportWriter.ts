import type { ComprehensiveReportEvidencePacket } from "../report-knowledge/comprehensiveReportEvidenceTypes";
import { openAIComprehensiveReportV2NarrativeDraftJsonSchema } from "./comprehensiveReportDraftSchema";
import { buildComprehensiveReportV2ProfileTable } from "./comprehensiveReportProfileTableBuilder";
import type {
  ComprehensiveReportDraft,
  ComprehensiveReportV2ProfileTable,
} from "./comprehensiveReportDraftTypes";
import {
  areAllDraftValidationErrorsRepairable,
  validateComprehensiveReportDraftAfterRepair,
  validateComprehensiveReportDraft,
} from "./comprehensiveReportDraftValidator";
import {
  callOpenAIReportWriter,
  isOpenAIReportWriterClientError,
  type OpenAIReportWriterClientConfig,
} from "./openaiReportWriterClient";
import {
  buildOpenAIComprehensiveReportRepairMessages,
  buildOpenAIComprehensiveReportWriterMessages,
  deriveAllowedSajuTermsFromEvidencePacket,
} from "./openaiReportWriterPrompt";

export type SafeReportGenerationStage =
  | "evidence"
  | "openai"
  | "json_parse"
  | "draft_validation"
  | "snapshot_save"
  | "unknown";

export type SafeReportGenerationError = {
  readonly code: string;
  readonly stage: SafeReportGenerationStage;
  readonly causeCode?: string;
  readonly validationErrors?: readonly string[];
  readonly status?: number;
  readonly errorType?: string;
  readonly errorCode?: string;
  readonly diagnosticMessage?: string;
  readonly requestId?: string;
  readonly errorParam?: string;
  readonly repairAttempted?: boolean;
  readonly repairPassed?: boolean;
};

function formatSafeReportGenerationMessage(
  input: SafeReportGenerationError,
): string {
  const lines = [
    input.code,
    `stage: ${input.stage}`,
  ];

  if (input.causeCode !== undefined) {
    lines.push(`cause: ${input.causeCode}`);
  }
  if (input.validationErrors !== undefined && input.validationErrors.length > 0) {
    lines.push("validation errors:");
    lines.push(...input.validationErrors.map((error) => `- ${error}`));
  }
  if (input.status !== undefined) {
    lines.push(`status: ${input.status}`);
  }
  if (input.errorType !== undefined) {
    lines.push(`errorType: ${input.errorType}`);
  }
  if (input.errorCode !== undefined) {
    lines.push(`errorCode: ${input.errorCode}`);
  }
  if (input.diagnosticMessage !== undefined) {
    lines.push(`message: ${input.diagnosticMessage}`);
  }
  if (input.errorParam !== undefined) {
    lines.push(`param: ${input.errorParam}`);
  }
  if (input.requestId !== undefined) {
    lines.push(`requestId: ${input.requestId}`);
  }
  if (input.repairAttempted === true) {
    lines.push("quality repair: attempted");
    lines.push(
      `quality repair: ${input.repairPassed === true ? "passed" : "failed"}`,
    );
  }

  return lines.join("\n");
}

export class SafeReportGenerationFailure
  extends Error
  implements SafeReportGenerationError
{
  readonly code: string;
  readonly stage: SafeReportGenerationStage;
  readonly causeCode?: string;
  readonly validationErrors?: readonly string[];
  readonly status?: number;
  readonly errorType?: string;
  readonly errorCode?: string;
  readonly diagnosticMessage?: string;
  readonly requestId?: string;
  readonly errorParam?: string;
  readonly repairAttempted?: boolean;
  readonly repairPassed?: boolean;

  constructor(input: SafeReportGenerationError) {
    super(formatSafeReportGenerationMessage(input));
    this.name = "SafeReportGenerationFailure";
    this.code = input.code;
    this.stage = input.stage;
    if (input.causeCode !== undefined) {
      this.causeCode = input.causeCode;
    }
    if (input.validationErrors !== undefined) {
      this.validationErrors = input.validationErrors;
    }
    if (input.status !== undefined) {
      this.status = input.status;
    }
    if (input.errorType !== undefined) {
      this.errorType = input.errorType;
    }
    if (input.errorCode !== undefined) {
      this.errorCode = input.errorCode;
    }
    if (input.diagnosticMessage !== undefined) {
      this.diagnosticMessage = input.diagnosticMessage;
    }
    if (input.requestId !== undefined) {
      this.requestId = input.requestId;
    }
    if (input.errorParam !== undefined) {
      this.errorParam = input.errorParam;
    }
    if (input.repairAttempted !== undefined) {
      this.repairAttempted = input.repairAttempted;
    }
    if (input.repairPassed !== undefined) {
      this.repairPassed = input.repairPassed;
    }
  }
}

function isSafeStage(value: unknown): value is SafeReportGenerationStage {
  return (
    value === "evidence" ||
    value === "openai" ||
    value === "json_parse" ||
    value === "draft_validation" ||
    value === "snapshot_save" ||
    value === "unknown"
  );
}

function isStringArray(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

export function isSafeReportGenerationError(
  value: unknown,
): value is SafeReportGenerationError {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as {
    readonly code?: unknown;
    readonly stage?: unknown;
    readonly causeCode?: unknown;
    readonly validationErrors?: unknown;
    readonly status?: unknown;
    readonly errorType?: unknown;
    readonly errorCode?: unknown;
    readonly diagnosticMessage?: unknown;
    readonly requestId?: unknown;
    readonly errorParam?: unknown;
    readonly repairAttempted?: unknown;
    readonly repairPassed?: unknown;
  };

  return (
    typeof candidate.code === "string" &&
    isSafeStage(candidate.stage) &&
    (candidate.causeCode === undefined || typeof candidate.causeCode === "string") &&
    (candidate.validationErrors === undefined ||
      isStringArray(candidate.validationErrors)) &&
    (candidate.status === undefined || typeof candidate.status === "number") &&
    (candidate.errorType === undefined || typeof candidate.errorType === "string") &&
    (candidate.errorCode === undefined || typeof candidate.errorCode === "string") &&
    (candidate.diagnosticMessage === undefined ||
      typeof candidate.diagnosticMessage === "string") &&
    (candidate.requestId === undefined || typeof candidate.requestId === "string") &&
    (candidate.errorParam === undefined || typeof candidate.errorParam === "string") &&
    (candidate.repairAttempted === undefined ||
      typeof candidate.repairAttempted === "boolean") &&
    (candidate.repairPassed === undefined ||
      typeof candidate.repairPassed === "boolean")
  );
}

function getOpenAIRequestDiagnostics(
  error: unknown,
): Pick<
  SafeReportGenerationError,
  "status" | "errorType" | "errorCode" | "diagnosticMessage" | "requestId" | "errorParam"
> {
  if (isOpenAIReportWriterClientError(error)) {
    return {
      ...(error.status === undefined ? {} : { status: error.status }),
      ...(error.errorType === undefined ? {} : { errorType: error.errorType }),
      ...(error.errorCode === undefined ? {} : { errorCode: error.errorCode }),
      ...(error.diagnosticMessage === undefined
        ? {}
        : { diagnosticMessage: error.diagnosticMessage }),
      ...(error.requestId === undefined ? {} : { requestId: error.requestId }),
      ...(error.errorParam === undefined ? {} : { errorParam: error.errorParam }),
    };
  }
  if (isSafeReportGenerationError(error)) {
    return {
      ...(error.status === undefined ? {} : { status: error.status }),
      ...(error.errorType === undefined ? {} : { errorType: error.errorType }),
      ...(error.errorCode === undefined ? {} : { errorCode: error.errorCode }),
      ...(error.diagnosticMessage === undefined
        ? {}
        : { diagnosticMessage: error.diagnosticMessage }),
      ...(error.requestId === undefined ? {} : { requestId: error.requestId }),
      ...(error.errorParam === undefined ? {} : { errorParam: error.errorParam }),
    };
  }

  return {};
}

function getSafeCauseCode(error: unknown): string {
  if (isSafeReportGenerationError(error)) {
    return error.code;
  }
  if (error instanceof Error && error.message.trim().length > 0) {
    const messageCode = error.message.split("\n")[0];

    if (
      messageCode === "OPENAI_REPORT_WRITER_DISABLED" ||
      messageCode === "OPENAI_REPORT_WRITER_CONFIG_MISSING" ||
      messageCode === "OPENAI_REPORT_WRITER_REQUEST_FAILED" ||
      messageCode === "OPENAI_REPORT_WRITER_EMPTY_RESPONSE"
    ) {
      return messageCode;
    }
  }

  return "OPENAI_REPORT_WRITER_REQUEST_FAILED";
}

function attachDeterministicProfileTable(input: {
  readonly parsed: unknown;
  readonly evidencePacket: ComprehensiveReportEvidencePacket;
  readonly mbtiType: string;
  readonly profileTable?: ComprehensiveReportV2ProfileTable;
}): unknown {
  if (
    typeof input.parsed !== "object" ||
    input.parsed === null ||
    Array.isArray(input.parsed) ||
    !("version" in input.parsed) ||
    input.parsed.version !== "comprehensive_v2_draft"
  ) {
    return input.parsed;
  }

  return {
    ...input.parsed,
    profileTable:
      input.profileTable ??
      buildComprehensiveReportV2ProfileTable({
        evidencePacket: input.evidencePacket,
        mbtiType: input.mbtiType,
      }),
  };
}

export async function generateComprehensiveReportDraft(input: {
  readonly userDisplayName?: string;
  readonly mbtiType: string;
  readonly evidencePacket: ComprehensiveReportEvidencePacket;
  readonly profileTable?: ComprehensiveReportV2ProfileTable;
  readonly config: OpenAIReportWriterClientConfig;
}): Promise<{
  readonly draft: ComprehensiveReportDraft;
  readonly rawText: string;
  readonly warnings: readonly string[];
}> {
  const allowedSajuTerms = deriveAllowedSajuTermsFromEvidencePacket(input.evidencePacket);
  const messages = buildOpenAIComprehensiveReportWriterMessages({
    userDisplayName: input.userDisplayName,
    mbtiType: input.mbtiType,
    evidencePacket: input.evidencePacket,
    allowedSajuTerms,
  });
  let result: Awaited<ReturnType<typeof callOpenAIReportWriter>>;

  try {
    result = await callOpenAIReportWriter({
      config: input.config,
      messages,
      jsonSchema: openAIComprehensiveReportV2NarrativeDraftJsonSchema,
    });
  } catch (error) {
    throw new SafeReportGenerationFailure({
      code: getSafeCauseCode(error),
      stage: "openai",
      ...getOpenAIRequestDiagnostics(error),
    });
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(result.rawText) as unknown;
  } catch {
    throw new SafeReportGenerationFailure({
      code: "OPENAI_REPORT_WRITER_INVALID_JSON",
      stage: "json_parse",
      validationErrors: ["JSON_PARSE_FAILED"],
    });
  }

  const draftCandidate = attachDeterministicProfileTable({
    parsed,
    evidencePacket: input.evidencePacket,
    mbtiType: input.mbtiType,
    profileTable: input.profileTable,
  });
  const validation = validateComprehensiveReportDraft(draftCandidate, {
    allowedSajuTerms,
    allowedMbtiTerms: [input.mbtiType],
  });

  if (!validation.ok || validation.value === undefined) {
    if (!areAllDraftValidationErrorsRepairable(validation.errors)) {
      throw new SafeReportGenerationFailure({
        code: "OPENAI_REPORT_WRITER_INVALID_JSON",
        stage: "draft_validation",
        validationErrors: validation.errors,
      });
    }

    const repairMessages = buildOpenAIComprehensiveReportRepairMessages({
      userDisplayName: input.userDisplayName,
      mbtiType: input.mbtiType,
      allowedSajuTerms,
      draftJson: JSON.stringify(parsed, null, 2),
      validationErrors: validation.errors,
    });
    let repairResult: Awaited<ReturnType<typeof callOpenAIReportWriter>>;

    try {
      repairResult = await callOpenAIReportWriter({
        config: input.config,
        messages: repairMessages,
        jsonSchema: openAIComprehensiveReportV2NarrativeDraftJsonSchema,
      });
    } catch (error) {
      throw new SafeReportGenerationFailure({
        code: getSafeCauseCode(error),
        stage: "openai",
        repairAttempted: true,
        repairPassed: false,
        ...getOpenAIRequestDiagnostics(error),
      });
    }

    let repairParsed: unknown;

    try {
      repairParsed = JSON.parse(repairResult.rawText) as unknown;
    } catch {
      throw new SafeReportGenerationFailure({
        code: "OPENAI_REPORT_WRITER_INVALID_JSON",
        stage: "json_parse",
        validationErrors: ["REPAIR_JSON_PARSE_FAILED"],
        repairAttempted: true,
        repairPassed: false,
      });
    }

    const repairDraftCandidate = attachDeterministicProfileTable({
      parsed: repairParsed,
      evidencePacket: input.evidencePacket,
      mbtiType: input.mbtiType,
      profileTable: input.profileTable,
    });
    const repairValidation = validateComprehensiveReportDraft(repairDraftCandidate, {
      allowedSajuTerms,
      allowedMbtiTerms: [input.mbtiType],
    });

    if (!repairValidation.ok || repairValidation.value === undefined) {
      const postRepairValidation = validateComprehensiveReportDraftAfterRepair(
        repairDraftCandidate,
        {
          allowedSajuTerms,
          allowedMbtiTerms: [input.mbtiType],
        },
      );

      if (postRepairValidation.ok && postRepairValidation.value !== undefined) {
        return {
          draft: postRepairValidation.value,
          rawText: repairResult.rawText,
          warnings: [
            "quality repair: attempted",
            "quality repair: passed with warnings",
            ...(postRepairValidation.warnings ?? []),
          ],
        };
      }

      throw new SafeReportGenerationFailure({
        code: "OPENAI_REPORT_WRITER_INVALID_JSON",
        stage: "draft_validation",
        validationErrors: repairValidation.errors,
        repairAttempted: true,
        repairPassed: false,
      });
    }

    const repairWarnings = repairValidation.warnings ?? [];

    return {
      draft: repairValidation.value,
      rawText: repairResult.rawText,
      warnings: [
        "quality repair: attempted",
        repairWarnings.length > 0
          ? "quality repair: passed with warnings"
          : "quality repair: passed",
        ...repairWarnings,
      ],
    };
  }

  return {
    draft: validation.value,
    rawText: result.rawText,
    warnings: validation.warnings ?? [],
  };
}
