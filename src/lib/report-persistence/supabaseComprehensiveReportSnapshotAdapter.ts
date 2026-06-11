import type { ComprehensiveReportDraft } from "../report-generation/comprehensiveReportDraftTypes";
import { validateComprehensiveReportDraft } from "../report-generation/comprehensiveReportDraftValidator";
import type { SaveComprehensiveReportSnapshotResult } from "./comprehensiveReportSnapshotTypes";
import {
  ComprehensiveReportSnapshotPersistenceError,
  createSupabaseComprehensiveReportSnapshotClient,
  saveComprehensiveReportDraftSnapshotWithSupabase,
  type SupabaseComprehensiveReportSnapshotRpcClient,
} from "./supabaseComprehensiveReportSnapshotClient";

export type SaveComprehensiveReportDraftSnapshotAdapterInput = {
  readonly supabaseUrl: string;
  readonly supabaseAnonKey: string;
  readonly reportId: string;
  readonly providerOrderId: string;
  readonly draft: ComprehensiveReportDraft;
  readonly generationModel?: string | null;
  readonly client?: SupabaseComprehensiveReportSnapshotRpcClient;
};

function createAdapterError(code: string): Error {
  return new Error(code);
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

function assertValidInput(
  input: SaveComprehensiveReportDraftSnapshotAdapterInput,
): {
  readonly reportId: string;
  readonly providerOrderId: string;
  readonly draft: ComprehensiveReportDraft;
  readonly generationModel: string | null;
} {
  if (
    !isNonEmptyString(input.supabaseUrl) ||
    !isNonEmptyString(input.supabaseAnonKey) ||
    !isValidReportId(input.reportId) ||
    !isNonEmptyString(input.providerOrderId)
  ) {
    throw createAdapterError("COMPREHENSIVE_REPORT_SNAPSHOT_INVALID_REQUEST");
  }

  const validation = validateComprehensiveReportDraft(input.draft);

  if (!validation.ok || validation.value === undefined) {
    throw createAdapterError("COMPREHENSIVE_REPORT_SNAPSHOT_INVALID_DRAFT");
  }

  return {
    reportId: input.reportId.trim(),
    providerOrderId: input.providerOrderId.trim(),
    draft: validation.value,
    generationModel: input.generationModel ?? null,
  };
}

export async function saveComprehensiveReportDraftSnapshot(
  input: SaveComprehensiveReportDraftSnapshotAdapterInput,
): Promise<SaveComprehensiveReportSnapshotResult> {
  const parsed = assertValidInput(input);
  const client =
    input.client ??
    createSupabaseComprehensiveReportSnapshotClient({
      supabaseUrl: input.supabaseUrl,
      supabaseAnonKey: input.supabaseAnonKey,
    });

  try {
    return await saveComprehensiveReportDraftSnapshotWithSupabase({
      client,
      ...parsed,
    });
  } catch (error: unknown) {
    if (error instanceof ComprehensiveReportSnapshotPersistenceError) {
      throw error;
    }

    throw createAdapterError("COMPREHENSIVE_REPORT_SNAPSHOT_SAVE_FAILED");
  }
}
