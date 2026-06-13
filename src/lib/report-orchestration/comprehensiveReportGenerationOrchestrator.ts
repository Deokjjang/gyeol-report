import {
  generateComprehensiveReportDraft,
  isSafeReportGenerationError,
  SafeReportGenerationFailure,
  type SafeReportGenerationStage,
} from "../report-generation/openaiComprehensiveReportWriter";
import {
  isComprehensiveReportV2Draft,
  type ComprehensiveReportSnapshotVersion,
} from "../report-generation/comprehensiveReportDraftTypes";
import { validateComprehensiveReportDraft } from "../report-generation/comprehensiveReportDraftValidator";
import { buildComprehensiveReportEvidencePacketFromComputedFacts } from "../report-knowledge/comprehensiveReportEvidenceInputBuilder";
import type { MbtiType } from "../report-knowledge/mbtiKnowledgeTypes";
import type { ComputedSajuFacts } from "../report-knowledge/sajuComputedFactsTypes";
import {
  validateComprehensiveEvidencePacket,
  validateComputedSajuFactsShape,
} from "../report-knowledge/knowledgeValidators";
import { saveComprehensiveReportDraftSnapshot } from "../report-persistence/supabaseComprehensiveReportSnapshotAdapter";

export { isSafeReportGenerationError };

export type GenerateAndPersistComprehensiveReportInput = {
  readonly userDisplayName?: string;
  readonly mbtiType: MbtiType;
  readonly sajuFacts: ComputedSajuFacts;
  readonly reportId: string;
  readonly providerOrderId: string;
  readonly openAI: {
    readonly apiKey: string;
    readonly model: string;
    readonly enabled: boolean;
    readonly fetchImpl?: typeof fetch;
  };
  readonly supabase: {
    readonly url: string;
    readonly anonKey: string;
  };
};

export type GenerateAndPersistComprehensiveReportResult = {
  readonly reportId: string;
  readonly providerOrderId: string;
  readonly productType: "saju_mbti_full";
  readonly snapshotVersion: ComprehensiveReportSnapshotVersion;
  readonly status: "ready" | "generated";
  readonly generationModel: string | null;
  readonly sectionCount: number;
  readonly chapterCount: number;
  readonly coreLine: string;
  readonly openingTitle: string;
  readonly warnings: readonly string[];
};

function createOrchestratorError(
  code: string,
  stage: SafeReportGenerationStage,
  input?: {
    readonly causeCode?: string;
    readonly validationErrors?: readonly string[];
  },
): Error {
  return new SafeReportGenerationFailure({
    code,
    stage,
    ...(input?.causeCode === undefined ? {} : { causeCode: input.causeCode }),
    ...(input?.validationErrors === undefined
      ? {}
      : { validationErrors: input.validationErrors }),
  });
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidReportId(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^report_[A-Za-z0-9_-]+$/.test(value.trim())
  );
}

function validateInput(
  input: GenerateAndPersistComprehensiveReportInput,
): {
  readonly reportId: string;
  readonly providerOrderId: string;
  readonly openAIModel: string;
} {
  if (
    !isValidReportId(input.reportId) ||
    !isNonEmptyString(input.providerOrderId) ||
    !isNonEmptyString(input.openAI.apiKey) ||
    !isNonEmptyString(input.openAI.model) ||
    !isNonEmptyString(input.supabase.url) ||
    !isNonEmptyString(input.supabase.anonKey)
  ) {
    throw createOrchestratorError(
      "COMPREHENSIVE_REPORT_ORCHESTRATION_INVALID_REQUEST",
      "unknown",
    );
  }

  return {
    reportId: input.reportId.trim(),
    providerOrderId: input.providerOrderId.trim(),
    openAIModel: input.openAI.model.trim(),
  };
}

function collectWarnings(input: {
  readonly mappedWarnings: readonly string[];
  readonly unmappedFacts: readonly string[];
  readonly packetWarnings: readonly string[];
  readonly writerWarnings: readonly string[];
}): readonly string[] {
  return [
    ...new Set([
      ...input.mappedWarnings,
      ...input.unmappedFacts.map((fact) => `unmapped fact: ${fact}`),
      ...input.packetWarnings,
      ...input.writerWarnings,
    ]),
  ];
}

function getSafeSnapshotCauseCode(error: unknown): string {
  if (error instanceof Error) {
    const messageCode = error.message.split("\n")[0];

    if (
      messageCode === "COMPREHENSIVE_REPORT_SNAPSHOT_SAVE_FAILED" ||
      messageCode === "COMPREHENSIVE_REPORT_SNAPSHOT_INVALID_REQUEST" ||
      messageCode === "COMPREHENSIVE_REPORT_SNAPSHOT_INVALID_DRAFT"
    ) {
      return messageCode;
    }
  }

  return "SNAPSHOT_SAVE_FAILED";
}

export async function generateAndPersistComprehensiveReport(
  input: GenerateAndPersistComprehensiveReportInput,
): Promise<GenerateAndPersistComprehensiveReportResult> {
  const parsed = validateInput(input);
  const computedFactsValidation = validateComputedSajuFactsShape(input.sajuFacts);

  if (!computedFactsValidation.ok) {
    throw createOrchestratorError(
      "COMPREHENSIVE_REPORT_COMPUTED_FACTS_INVALID",
      "evidence",
      {
        validationErrors: computedFactsValidation.errors,
      },
    );
  }

  const { packet, mappedSaju } =
    buildComprehensiveReportEvidencePacketFromComputedFacts({
      mbtiType: input.mbtiType,
      sajuFacts: input.sajuFacts,
    });
  const packetValidation = validateComprehensiveEvidencePacket(packet);

  if (!packetValidation.ok) {
    throw createOrchestratorError("COMPREHENSIVE_REPORT_EVIDENCE_INVALID", "evidence", {
      validationErrors: packetValidation.errors,
    });
  }

  let generated: Awaited<ReturnType<typeof generateComprehensiveReportDraft>>;

  try {
    generated = await generateComprehensiveReportDraft({
      userDisplayName: input.userDisplayName,
      mbtiType: input.mbtiType,
      evidencePacket: packet,
      config: {
        apiKey: input.openAI.apiKey,
        model: parsed.openAIModel,
        enabled: input.openAI.enabled,
        ...(input.openAI.fetchImpl === undefined
          ? {}
          : { fetchImpl: input.openAI.fetchImpl }),
      },
    });
  } catch (error) {
    if (isSafeReportGenerationError(error)) {
      throw createOrchestratorError("COMPREHENSIVE_REPORT_GENERATION_FAILED", error.stage, {
        causeCode: error.code,
        validationErrors: error.validationErrors,
      });
    }

    throw createOrchestratorError("COMPREHENSIVE_REPORT_GENERATION_FAILED", "openai", {
      causeCode: "OPENAI_REPORT_WRITER_REQUEST_FAILED",
    });
  }

  const draftValidation = validateComprehensiveReportDraft(generated.draft);

  if (!draftValidation.ok || draftValidation.value === undefined) {
    throw createOrchestratorError("COMPREHENSIVE_REPORT_DRAFT_INVALID", "draft_validation", {
      validationErrors: draftValidation.errors,
    });
  }

  let savedSnapshot: Awaited<
    ReturnType<typeof saveComprehensiveReportDraftSnapshot>
  >;

  try {
    savedSnapshot = await saveComprehensiveReportDraftSnapshot({
      supabaseUrl: input.supabase.url,
      supabaseAnonKey: input.supabase.anonKey,
      reportId: parsed.reportId,
      providerOrderId: parsed.providerOrderId,
      draft: draftValidation.value,
      generationModel: parsed.openAIModel,
    });
  } catch (error) {
    throw createOrchestratorError(
      "COMPREHENSIVE_REPORT_SNAPSHOT_SAVE_FAILED",
      "snapshot_save",
      {
        causeCode: getSafeSnapshotCauseCode(error),
      },
    );
  }

  return {
    reportId: savedSnapshot.reportId,
    providerOrderId: savedSnapshot.providerOrderId,
    productType: savedSnapshot.productType,
    snapshotVersion: savedSnapshot.snapshotVersion,
    status: savedSnapshot.status,
    generationModel: savedSnapshot.generationModel,
    sectionCount: isComprehensiveReportV2Draft(draftValidation.value)
      ? draftValidation.value.chapters.length
      : draftValidation.value.sections.length,
    chapterCount: isComprehensiveReportV2Draft(draftValidation.value)
      ? draftValidation.value.chapters.length
      : 0,
    coreLine: draftValidation.value.coreLine,
    openingTitle: draftValidation.value.openingTitle,
    warnings: collectWarnings({
      mappedWarnings: mappedSaju.warnings,
      unmappedFacts: mappedSaju.unmappedFacts,
      packetWarnings: packet.globalWarnings,
      writerWarnings: generated.warnings,
    }),
  };
}
