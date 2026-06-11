import type { ComprehensiveReportEvidencePacket } from "../report-knowledge/comprehensiveReportEvidenceTypes";
import { SAJU_KNOWLEDGE_BASE } from "../report-knowledge/sajuKnowledgeBase";
import { comprehensiveReportDraftJsonSchema } from "./comprehensiveReportDraftSchema";
import type { ComprehensiveReportDraft } from "./comprehensiveReportDraftTypes";
import { validateComprehensiveReportDraft } from "./comprehensiveReportDraftValidator";
import {
  callOpenAIReportWriter,
  type OpenAIReportWriterClientConfig,
} from "./openaiReportWriterClient";
import { buildOpenAIComprehensiveReportWriterMessages } from "./openaiReportWriterPrompt";

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

function deriveAllowedSajuTermsFromEvidencePacket(
  packet: ComprehensiveReportEvidencePacket,
): readonly string[] {
  const selectedEntryIds = new Set(packet.sajuEntryIds);
  const selectedEntryTerms = SAJU_KNOWLEDGE_BASE.filter((entry) =>
    selectedEntryIds.has(entry.id),
  ).flatMap((entry) => [entry.labelKo, ...entry.aliases]);
  const evidenceText = packet.sections
    .flatMap((section) => section.primarySaju)
    .flatMap((item) => [item.sourceLabelKo, item.summary, item.sourceId])
    .join("\n");
  const evidenceTerms = createKnownSajuTerms().filter((term) =>
    evidenceText.includes(term),
  );

  return [
    ...new Set(
      [...selectedEntryTerms, ...evidenceTerms]
        .map((term) => term.trim())
        .filter((term) => term.length > 0),
    ),
  ];
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

  const validation = validateComprehensiveReportDraft(parsed, {
    allowedSajuTerms: deriveAllowedSajuTermsFromEvidencePacket(input.evidencePacket),
    allowedMbtiTerms: [input.mbtiType],
  });

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
