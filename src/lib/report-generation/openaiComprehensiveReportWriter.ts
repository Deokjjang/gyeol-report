import type { ComprehensiveReportEvidencePacket } from "../report-knowledge/comprehensiveReportEvidenceTypes";
import { comprehensiveReportDraftJsonSchema } from "./comprehensiveReportDraftSchema";
import type { ComprehensiveReportDraft } from "./comprehensiveReportDraftTypes";
import { validateComprehensiveReportDraft } from "./comprehensiveReportDraftValidator";
import {
  callOpenAIReportWriter,
  type OpenAIReportWriterClientConfig,
} from "./openaiReportWriterClient";
import {
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
  };

  return (
    typeof candidate.code === "string" &&
    isSafeStage(candidate.stage) &&
    (candidate.causeCode === undefined || typeof candidate.causeCode === "string") &&
    (candidate.validationErrors === undefined ||
      isStringArray(candidate.validationErrors))
  );
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

export async function generateComprehensiveReportDraft(input: {
  readonly userDisplayName?: string;
  readonly mbtiType: string;
  readonly evidencePacket: ComprehensiveReportEvidencePacket;
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
      jsonSchema: comprehensiveReportDraftJsonSchema,
    });
  } catch (error) {
    throw new SafeReportGenerationFailure({
      code: getSafeCauseCode(error),
      stage: "openai",
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

  const validation = validateComprehensiveReportDraft(parsed, {
    allowedSajuTerms,
    allowedMbtiTerms: [input.mbtiType],
  });

  if (!validation.ok || validation.value === undefined) {
    throw new SafeReportGenerationFailure({
      code: "OPENAI_REPORT_WRITER_INVALID_JSON",
      stage: "draft_validation",
      validationErrors: validation.errors,
    });
  }

  return {
    draft: validation.value,
    rawText: result.rawText,
    warnings: [],
  };
}
