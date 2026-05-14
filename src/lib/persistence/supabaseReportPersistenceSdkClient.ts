import {
  createUnavailableSupabaseReportPersistenceQueryClient,
  type SupabaseReportPersistenceQueryClient,
} from "./supabaseReportPersistenceClient";

export const SUPABASE_REPORT_PERSISTENCE_SDK_CLIENT_STATUS =
  "skeleton" as const;

export type SupabaseReportPersistenceSdkClientConfig = {
  readonly supabaseUrl?: string;
  readonly serviceRoleKey?: string;
};

export function createSupabaseReportPersistenceSdkClient(
  config: SupabaseReportPersistenceSdkClientConfig = {},
): SupabaseReportPersistenceQueryClient {
  const unavailableClient =
    createUnavailableSupabaseReportPersistenceQueryClient();

  // This file is server-only by design.
  // The real SDK import is deferred until the package and connection task.
  // The service role key must stay outside client bundles.
  // The pure mapper remains SDK-free.
  if (config.supabaseUrl === undefined || config.serviceRoleKey === undefined) {
    return unavailableClient;
  }

  return unavailableClient;
}
