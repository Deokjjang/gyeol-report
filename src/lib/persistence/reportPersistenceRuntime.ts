import { createInMemoryReportPersistenceAdapter } from "./inMemoryReportPersistenceAdapter";
import type { ReportPersistenceAdapter } from "./reportPersistenceAdapter";
import { createSupabaseReportPersistenceAdapter } from "./supabaseReportPersistenceAdapter";
import { createSupabaseReportPersistenceSdkClient } from "./supabaseReportPersistenceSdkClient";

export type ReportPersistenceRuntimeMode =
  | "preview_memory"
  | "production_supabase"
  | "disabled";

export type ReportPersistenceRuntimeConfig = {
  readonly mode?: ReportPersistenceRuntimeMode;
  readonly supabaseUrl?: string;
  readonly serviceRoleKey?: string;
};

export type ReportPersistenceRuntimeResult =
  | {
      readonly ok: true;
      readonly mode: ReportPersistenceRuntimeMode;
      readonly adapter: ReportPersistenceAdapter;
    }
  | {
      readonly ok: false;
      readonly mode: ReportPersistenceRuntimeMode;
      readonly code:
        | "PERSISTENCE_DISABLED"
        | "PRODUCTION_PERSISTENCE_NOT_CONFIGURED";
      readonly messageKo: string;
    };

export function createPreviewReportPersistenceAdapter(): ReportPersistenceAdapter {
  return createInMemoryReportPersistenceAdapter();
}

export function createProductionReportPersistenceAdapter(
  config: Pick<
    ReportPersistenceRuntimeConfig,
    "supabaseUrl" | "serviceRoleKey"
  > = {},
): ReportPersistenceAdapter {
  const queryClient = createSupabaseReportPersistenceSdkClient(config);

  return createSupabaseReportPersistenceAdapter({ queryClient });
}

export function createReportPersistenceRuntime(
  config: ReportPersistenceRuntimeConfig = {},
): ReportPersistenceRuntimeResult {
  const mode = config.mode ?? "preview_memory";

  // Runtime factory is server-only by design.
  // Env values should be passed in by a server-only composition layer.
  // No silent production fallback to memory.
  if (mode === "preview_memory") {
    return {
      ok: true,
      mode,
      adapter: createPreviewReportPersistenceAdapter(),
    };
  }

  if (mode === "disabled") {
    return {
      ok: false,
      mode,
      code: "PERSISTENCE_DISABLED",
      messageKo: "Report persistence runtime is disabled.",
    };
  }

  if (
    config.supabaseUrl === undefined ||
    config.serviceRoleKey === undefined
  ) {
    return {
      ok: false,
      mode,
      code: "PRODUCTION_PERSISTENCE_NOT_CONFIGURED",
      messageKo: "Production persistence is not configured.",
    };
  }

  return {
    ok: true,
    mode,
    adapter: createProductionReportPersistenceAdapter({
      supabaseUrl: config.supabaseUrl,
      serviceRoleKey: config.serviceRoleKey,
    }),
  };
}
