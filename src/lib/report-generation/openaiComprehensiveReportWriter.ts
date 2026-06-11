import type { ComprehensiveReportEvidencePacket } from "../report-knowledge/comprehensiveReportEvidenceTypes";
import { comprehensiveReportDraftJsonSchema } from "./comprehensiveReportDraftSchema";
import type { ComprehensiveReportDraft } from "./comprehensiveReportDraftTypes";
import { validateComprehensiveReportDraft } from "./comprehensiveReportDraftValidator";
import {
  callOpenAIReportWriter,
  type OpenAIReportWriterClientConfig,
} from "./openaiReportWriterClient";
import { buildOpenAIComprehensiveReportWriterMessages } from "./openaiReportWriterPrompt";

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
  const messages = buildOpenAIComprehensiveReportWriterMessages({
    userDisplayName: input.userDisplayName,
    mbtiType: input.mbtiType,
    evidencePacket: input.evidencePacket,
  });
  const result = await callOpenAIReportWriter({
    config: input.config,
    messages,
    jsonSchema: comprehensiveReportDraftJsonSchema,
  });
  let parsed: unknown;

  try {
    parsed = JSON.parse(result.rawText) as unknown;
  } catch {
    throw new Error("OPENAI_REPORT_WRITER_INVALID_JSON");
  }

  const validation = validateComprehensiveReportDraft(parsed);

  if (!validation.ok || validation.value === undefined) {
    throw new Error(
      `OPENAI_REPORT_WRITER_INVALID_JSON: ${validation.errors.join("; ")}`,
    );
  }

  return {
    draft: validation.value,
    rawText: result.rawText,
    warnings: [],
  };
}
