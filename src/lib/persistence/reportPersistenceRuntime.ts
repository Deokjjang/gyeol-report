import { createInMemoryReportPersistenceAdapter } from "./inMemoryReportPersistenceAdapter";
import type { ReportPersistenceAdapter } from "./reportPersistenceAdapter";
import { createSupabaseReportPersistenceAdapter } from "./supabaseReportPersistenceAdapter";
import { createSupabaseReportPersistenceSdkClient } from "./supabaseReportPersistenceSdkClient";

export type ReportPersistenceRuntimeMode =
  | "preview_memory"
  | "supabase"
  | "disabled";

export type ReportPersistenceRuntimeConfig = {
  readonly mode?: ReportPersistenceRuntimeMode;
  readonly supabaseUrl?: string;
  readonly supabaseAnonKey?: string;
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
        | "SUPABASE_REPORT_PERSISTENCE_UNAVAILABLE";
      readonly messageKo: string;
    };

export type ReportPersistenceRuntimeEnvironment = Readonly<
  Record<string, string | undefined>
>;

export const REPORT_PERSISTENCE_MODE_ENV = "REPORT_PERSISTENCE_MODE";
export const SUPABASE_URL_ENV = "SUPABASE_URL";
export const SUPABASE_ANON_KEY_ENV = "SUPABASE_ANON_KEY";

let previewReportPersistenceAdapter: ReportPersistenceAdapter | undefined;

export function createPreviewReportPersistenceAdapter(): ReportPersistenceAdapter {
  previewReportPersistenceAdapter ??= createInMemoryReportPersistenceAdapter(
    [],
    {
      duplicateCreateMode: "return_existing",
    },
  );

  return previewReportPersistenceAdapter;
}

export function createProductionReportPersistenceAdapter(
  config: Pick<
    ReportPersistenceRuntimeConfig,
    "supabaseUrl" | "supabaseAnonKey"
  > = {},
): ReportPersistenceAdapter {
  const queryClient = createSupabaseReportPersistenceSdkClient(config);

  return createSupabaseReportPersistenceAdapter({ queryClient });
}

function normalizeRuntimeMode(
  mode: string | undefined,
): ReportPersistenceRuntimeMode {
  if (mode === "supabase" || mode === "disabled") {
    return mode;
  }

  return "preview_memory";
}

function createSupabaseUnavailableRuntime(
  mode: ReportPersistenceRuntimeMode,
): ReportPersistenceRuntimeResult {
  return {
    ok: false,
    mode,
    code: "SUPABASE_REPORT_PERSISTENCE_UNAVAILABLE",
    messageKo: "Supabase report persistence is unavailable.",
  };
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

  if (config.supabaseUrl === undefined || config.supabaseAnonKey === undefined) {
    return createSupabaseUnavailableRuntime(mode);
  }

  return {
    ok: true,
    mode,
    adapter: createProductionReportPersistenceAdapter({
      supabaseUrl: config.supabaseUrl,
      supabaseAnonKey: config.supabaseAnonKey,
    }),
  };
}

export function createReportPersistenceRuntimeFromEnv(
  env: ReportPersistenceRuntimeEnvironment = process.env,
): ReportPersistenceRuntimeResult {
  return createReportPersistenceRuntime({
    mode: normalizeRuntimeMode(env.REPORT_PERSISTENCE_MODE),
    supabaseUrl: env.SUPABASE_URL,
    supabaseAnonKey: env.SUPABASE_ANON_KEY,
  });
}
