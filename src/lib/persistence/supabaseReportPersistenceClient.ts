import type { SupabaseReportRow } from "./supabaseReportPersistenceMapper";

export type SupabaseReportQueryResult<T> =
  | { readonly ok: true; readonly data: T }
  | {
      readonly ok: false;
      readonly code:
        | "DB_UNAVAILABLE"
        | "DUPLICATE_REPORT_ID"
        | "NOT_FOUND"
        | "PERMISSION_DENIED"
        | "UNKNOWN_DB_ERROR";
      readonly messageKo: string;
    };

export type SupabaseReportRowPatch = Partial<
  Pick<
    SupabaseReportRow,
    | "status"
    | "access_mode"
    | "input_snapshot"
    | "report_snapshot"
    | "report_version"
    | "calculation_version"
    | "locale"
    | "access_token_hash"
    | "access_token_created_at"
    | "access_token_rotated_at"
    | "access_token_version"
    | "payment_order_id"
    | "payment_provider"
    | "payment_provider_payment_id"
    | "payment_status"
    | "payment_amount"
    | "payment_currency"
    | "payment_paid_at"
    | "payment_refunded_at"
    | "updated_at"
    | "deleted_at"
  >
>;

export type SupabaseReportPersistenceQueryClient = {
  readonly insertReport: (
    row: SupabaseReportRow,
  ) => Promise<SupabaseReportQueryResult<null>>;
  readonly updateReport: (
    reportId: string,
    patch: SupabaseReportRowPatch,
  ) => Promise<SupabaseReportQueryResult<SupabaseReportRow>>;
  readonly findReportById: (
    reportId: string,
  ) => Promise<SupabaseReportQueryResult<SupabaseReportRow | null>>;
  readonly listReports: (input: {
    readonly limit: number;
  }) => Promise<SupabaseReportQueryResult<readonly SupabaseReportRow[]>>;
};

const UNAVAILABLE_MESSAGE = "Supabase reports query client is not connected.";

function createDbUnavailableResult<T>(): SupabaseReportQueryResult<T> {
  return {
    ok: false,
    code: "DB_UNAVAILABLE",
    messageKo: UNAVAILABLE_MESSAGE,
  };
}

export function createUnavailableSupabaseReportPersistenceQueryClient(): SupabaseReportPersistenceQueryClient {
  // This boundary does not import Supabase SDK.
  // A real Supabase client should adapt SDK calls to this interface later.
  // This client must not expose secrets.
  return {
    async insertReport(row): Promise<
      SupabaseReportQueryResult<null>
    > {
      void row;

      return createDbUnavailableResult();
    },

    async updateReport(
      reportId,
      patch,
    ): Promise<SupabaseReportQueryResult<SupabaseReportRow>> {
      void reportId;
      void patch;

      return createDbUnavailableResult();
    },

    async findReportById(
      reportId,
    ): Promise<SupabaseReportQueryResult<SupabaseReportRow | null>> {
      void reportId;

      return createDbUnavailableResult();
    },

    async listReports(input): Promise<
      SupabaseReportQueryResult<readonly SupabaseReportRow[]>
    > {
      void input;

      return createDbUnavailableResult();
    },
  };
}
