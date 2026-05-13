import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import type {
  ReportPersistenceDeleteResult,
  ReportPersistenceWriteResult,
} from "@/lib/persistence/reportPersistenceAdapter";
import {
  createSupabaseReportPersistenceAdapter,
  SUPABASE_REPORT_PERSISTENCE_ADAPTER_STATUS,
} from "@/lib/persistence/supabaseReportPersistenceAdapter";
import type {
  SupabaseReportPersistenceQueryClient,
  SupabaseReportQueryResult,
  SupabaseReportRowPatch,
} from "@/lib/persistence/supabaseReportPersistenceClient";
import type { SupabaseReportRow } from "@/lib/persistence/supabaseReportPersistenceMapper";
import type {
  PersistedReportRecord,
  PublicReportResult,
} from "@/lib/persistence/reportPersistenceTypes";
import type { ReportOutput } from "@/lib/report/types";

const createdAt = "2026-01-01T00:00:00.000Z";
const laterAt = "2026-01-02T00:00:00.000Z";
const deletedAt = "2026-01-03T00:00:00.000Z";
const skeletonMarker =
  "Supabase report persistence adapter is a skeleton and is not connected yet.";

const minimalReport: ReportOutput = {
  version: "v1",
  titleKo: "Gyeol report",
  subtitleKo: "Test report",
  sections: [],
  notices: [],
};

type QueryErrorCode = Extract<
  SupabaseReportQueryResult<unknown>,
  { ok: false }
>["code"];

type FakeQueryClientCalls = {
  readonly insertRows: SupabaseReportRow[];
  readonly updates: {
    readonly reportId: string;
    readonly patch: SupabaseReportRowPatch;
  }[];
  readonly findIds: string[];
  readonly listInputs: {
    readonly limit: number;
  }[];
};

type FakeQueryClientOptions = {
  readonly insertResult?: SupabaseReportQueryResult<SupabaseReportRow>;
  readonly updateResult?: SupabaseReportQueryResult<SupabaseReportRow>;
  readonly findResult?: SupabaseReportQueryResult<SupabaseReportRow | null>;
  readonly listResult?: SupabaseReportQueryResult<readonly SupabaseReportRow[]>;
};

function createRecord(
  overrides: Partial<PersistedReportRecord> = {},
): PersistedReportRecord {
  return {
    reportId: "report_supabase_test",
    createdAt,
    updatedAt: createdAt,
    status: "generated",
    reportVersion: "v1",
    calculationVersion: "v1",
    locale: "ko",
    accessMode: "preview",
    inputSnapshot: {
      birthDate: "2024-02-04",
      birthTime: "17:27",
      birthTimeUnknown: false,
      calendarType: "SOLAR",
      timezone: "Asia/Seoul",
      mbti: "ENTJ",
    },
    reportSnapshot: {
      report: minimalReport,
      reportVersion: "v1",
      renderVersion: "v1",
      createdAt,
    },
    payment: {
      orderId: "order_test_123",
      provider: "toss",
      providerPaymentId: "payment_test_123",
      paymentStatus: "paid",
      amount: 4900,
      currency: "KRW",
      paidAt: laterAt,
      refundedAt: deletedAt,
    },
    ...overrides,
  };
}

function createRow(overrides: Partial<SupabaseReportRow> = {}): SupabaseReportRow {
  return {
    report_id: "report_supabase_test",
    status: "generated",
    access_mode: "preview",
    input_snapshot: {
      birthDate: "2024-02-04",
      birthTime: "17:27",
      birthTimeUnknown: false,
      calendarType: "SOLAR",
      timezone: "Asia/Seoul",
      mbti: "ENTJ",
    },
    report_snapshot: {
      report: minimalReport,
      reportVersion: "v1",
      renderVersion: "v1",
      createdAt,
    },
    report_version: "v1",
    calculation_version: "v1",
    locale: "ko",
    access_token_hash: null,
    access_token_created_at: null,
    access_token_rotated_at: null,
    access_token_version: null,
    payment_order_id: "order_test_123",
    payment_provider: "toss",
    payment_provider_payment_id: "payment_test_123",
    payment_status: "paid",
    payment_amount: 4900,
    payment_currency: "KRW",
    payment_paid_at: laterAt,
    payment_refunded_at: deletedAt,
    created_at: createdAt,
    updated_at: createdAt,
    deleted_at: null,
    ...overrides,
  };
}

function createQueryFailure<T>(
  code: QueryErrorCode,
): SupabaseReportQueryResult<T> {
  return {
    ok: false,
    code,
    messageKo: `Query failed: ${code}`,
  };
}

function createFakeQueryClient(
  options: FakeQueryClientOptions = {},
): {
  readonly client: SupabaseReportPersistenceQueryClient;
  readonly calls: FakeQueryClientCalls;
} {
  const calls: FakeQueryClientCalls = {
    insertRows: [],
    updates: [],
    findIds: [],
    listInputs: [],
  };

  const client: SupabaseReportPersistenceQueryClient = {
    async insertReport(row) {
      calls.insertRows.push(row);

      return options.insertResult ?? { ok: true, data: row };
    },

    async updateReport(reportId, patch) {
      calls.updates.push({ reportId, patch });

      return (
        options.updateResult ?? {
          ok: true,
          data: createRow({
            report_id: reportId,
            ...patch,
          }),
        }
      );
    },

    async findReportById(reportId) {
      calls.findIds.push(reportId);

      return options.findResult ?? { ok: true, data: createRow({ report_id: reportId }) };
    },

    async listReports(input) {
      calls.listInputs.push(input);

      return options.listResult ?? { ok: true, data: [createRow()] };
    },
  };

  return { client, calls };
}

function expectWriteSuccess(
  result: ReportPersistenceWriteResult,
): PersistedReportRecord {
  expect(result.ok).toBe(true);

  if (!result.ok) {
    throw new Error("Expected write success.");
  }

  return result.record;
}

function expectDeleteSuccess(
  result: ReportPersistenceDeleteResult,
): PersistedReportRecord {
  expect(result.ok).toBe(true);

  if (!result.ok) {
    throw new Error("Expected delete success.");
  }

  return result.record;
}

function expectFindSuccess(result: PublicReportResult): void {
  expect(result.ok).toBe(true);

  if (!result.ok) {
    throw new Error("Expected find success.");
  }
}

function expectWriteFailure(
  result: ReportPersistenceWriteResult,
  code:
    | "REPORT_STORAGE_WRITE_FAILED"
    | "REPORT_STORAGE_VALIDATION_FAILED",
): void {
  expect(result.ok).toBe(false);

  if (result.ok) {
    return;
  }

  expect(result.error.code).toBe(code);
}

function expectFindFailure(
  result: PublicReportResult,
  code:
    | "REPORT_NOT_FOUND"
    | "REPORT_DELETED"
    | "REPORT_ACCESS_DENIED"
    | "REPORT_STORAGE_ERROR",
): void {
  expect(result.ok).toBe(false);

  if (result.ok) {
    return;
  }

  expect(result.error.code).toBe(code);
}

function readSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("createSupabaseReportPersistenceAdapter", () => {
  it("exports compatibility status and adapter methods", () => {
    const adapter = createSupabaseReportPersistenceAdapter();

    expect(SUPABASE_REPORT_PERSISTENCE_ADAPTER_STATUS).toBe("skeleton");
    expect(adapter.create).toBeTypeOf("function");
    expect(adapter.update).toBeTypeOf("function");
    expect(adapter.find).toBeTypeOf("function");
    expect(adapter.softDelete).toBeTypeOf("function");
    expect(adapter.list).toBeTypeOf("function");
  });

  it("default adapter returns unavailable failures", async () => {
    const adapter = createSupabaseReportPersistenceAdapter();
    const record = createRecord();

    const createResult = await adapter.create({ record });
    const findResult = await adapter.find({ reportId: record.reportId });

    expectWriteFailure(createResult, "REPORT_STORAGE_WRITE_FAILED");
    expectFindFailure(findResult, "REPORT_STORAGE_ERROR");

    if (!createResult.ok) {
      expect(createResult.error.messageKo).toContain(skeletonMarker);
    }

    if (!findResult.ok) {
      expect(findResult.error.messageKo).toContain(skeletonMarker);
    }
  });

  it("create uses injected query client", async () => {
    const record = createRecord();
    const { client, calls } = createFakeQueryClient();
    const adapter = createSupabaseReportPersistenceAdapter({ queryClient: client });

    const result = await adapter.create({ record });
    const persisted = expectWriteSuccess(result);

    expect(calls.insertRows).toHaveLength(1);
    expect(calls.insertRows[0]).toMatchObject({
      report_id: record.reportId,
      status: record.status,
      access_mode: record.accessMode,
      input_snapshot: record.inputSnapshot,
      report_snapshot: record.reportSnapshot,
      payment_order_id: record.payment?.orderId,
      payment_provider: record.payment?.provider,
      payment_provider_payment_id: record.payment?.providerPaymentId,
      payment_status: record.payment?.paymentStatus,
      payment_amount: record.payment?.amount,
      payment_currency: record.payment?.currency,
      payment_paid_at: record.payment?.paidAt,
      payment_refunded_at: record.payment?.refundedAt,
    });
    expect(persisted).toEqual(record);
  });

  it("update uses injected query client with a controlled patch", async () => {
    const updatedRow = createRow({
      status: "paid_unlocked",
      access_mode: "paid",
      updated_at: laterAt,
    });
    const { client, calls } = createFakeQueryClient({
      updateResult: { ok: true, data: updatedRow },
    });
    const adapter = createSupabaseReportPersistenceAdapter({ queryClient: client });

    const result = await adapter.update({
      reportId: "report_supabase_test",
      patch: {
        status: "paid_unlocked",
        accessMode: "paid",
        updatedAt: laterAt,
      },
    });
    const persisted = expectWriteSuccess(result);

    expect(calls.updates).toEqual([
      {
        reportId: "report_supabase_test",
        patch: {
          status: "paid_unlocked",
          access_mode: "paid",
          updated_at: laterAt,
        },
      },
    ]);
    expect(persisted.status).toBe("paid_unlocked");
    expect(persisted.accessMode).toBe("paid");
    expect(persisted.updatedAt).toBe(laterAt);
  });

  it("find uses injected query client and handles missing rows", async () => {
    const paidRow = createRow({
      status: "paid_unlocked",
      access_mode: "paid",
    });
    const { client, calls } = createFakeQueryClient({
      findResult: { ok: true, data: paidRow },
    });
    const adapter = createSupabaseReportPersistenceAdapter({ queryClient: client });

    const result = await adapter.find({
      reportId: "report_supabase_test",
      accessMode: "paid",
    });

    expectFindSuccess(result);
    expect(calls.findIds).toEqual(["report_supabase_test"]);

    if (result.ok) {
      expect(result.record.reportId).toBe("report_supabase_test");
      expect(result.record.accessMode).toBe("paid");
      expect(result.record.report).toEqual(minimalReport);
    }

    const missing = createFakeQueryClient({
      findResult: { ok: true, data: null },
    });
    const missingAdapter = createSupabaseReportPersistenceAdapter({
      queryClient: missing.client,
    });
    const missingResult = await missingAdapter.find({
      reportId: "report_missing",
    });

    expectFindFailure(missingResult, "REPORT_NOT_FOUND");
  });

  it("softDelete uses injected query client with deleted status", async () => {
    const deletedRow = createRow({
      status: "deleted",
      deleted_at: deletedAt,
      updated_at: deletedAt,
    });
    const { client, calls } = createFakeQueryClient({
      updateResult: { ok: true, data: deletedRow },
    });
    const adapter = createSupabaseReportPersistenceAdapter({ queryClient: client });

    const result = await adapter.softDelete({
      reportId: "report_supabase_test",
      deletedAt,
    });
    const persisted = expectDeleteSuccess(result);

    expect(calls.updates).toEqual([
      {
        reportId: "report_supabase_test",
        patch: {
          status: "deleted",
          deleted_at: deletedAt,
          updated_at: deletedAt,
        },
      },
    ]);
    expect(persisted.status).toBe("deleted");
    expect(persisted.deletedAt).toBe(deletedAt);
  });

  it("list uses injected query client with bounded limits", async () => {
    const firstRow = createRow({ report_id: "report_one" });
    const secondRow = createRow({
      report_id: "report_two",
      status: "draft",
      payment_order_id: null,
      payment_provider: null,
      payment_provider_payment_id: null,
      payment_status: null,
      payment_amount: null,
      payment_currency: null,
      payment_paid_at: null,
      payment_refunded_at: null,
    });
    const { client, calls } = createFakeQueryClient({
      listResult: { ok: true, data: [firstRow, secondRow] },
    });
    const adapter = createSupabaseReportPersistenceAdapter({ queryClient: client });

    const records = await adapter.list({ limit: 500 });

    expect(calls.listInputs).toEqual([{ limit: 100 }]);
    expect(records).toHaveLength(2);
    expect(records.map((record) => record.reportId)).toEqual([
      "report_one",
      "report_two",
    ]);
  });

  it("maps query errors to adapter failures", async () => {
    const record = createRecord();
    const unavailable = createSupabaseReportPersistenceAdapter({
      queryClient: createFakeQueryClient({
        insertResult: createQueryFailure("DB_UNAVAILABLE"),
      }).client,
    });
    const duplicate = createSupabaseReportPersistenceAdapter({
      queryClient: createFakeQueryClient({
        insertResult: createQueryFailure("DUPLICATE_REPORT_ID"),
      }).client,
    });
    const notFound = createSupabaseReportPersistenceAdapter({
      queryClient: createFakeQueryClient({
        findResult: createQueryFailure("NOT_FOUND"),
      }).client,
    });
    const denied = createSupabaseReportPersistenceAdapter({
      queryClient: createFakeQueryClient({
        findResult: createQueryFailure("PERMISSION_DENIED"),
      }).client,
    });
    const unknown = createSupabaseReportPersistenceAdapter({
      queryClient: createFakeQueryClient({
        insertResult: createQueryFailure("UNKNOWN_DB_ERROR"),
      }).client,
    });

    expectWriteFailure(
      await unavailable.create({ record }),
      "REPORT_STORAGE_WRITE_FAILED",
    );
    expectWriteFailure(
      await duplicate.create({ record }),
      "REPORT_STORAGE_VALIDATION_FAILED",
    );
    expectFindFailure(
      await notFound.find({ reportId: record.reportId }),
      "REPORT_NOT_FOUND",
    );
    expectFindFailure(
      await denied.find({ reportId: record.reportId }),
      "REPORT_STORAGE_ERROR",
    );
    expectWriteFailure(
      await unknown.create({ record }),
      "REPORT_STORAGE_WRITE_FAILED",
    );
  });

  it("mapper validation failure maps to adapter failure", async () => {
    const record = createRecord();
    const invalidRow = createRow({ status: "archived" });
    const { client } = createFakeQueryClient({
      insertResult: { ok: true, data: invalidRow },
    });
    const adapter = createSupabaseReportPersistenceAdapter({ queryClient: client });

    const result = await adapter.create({ record });

    expectWriteFailure(result, "REPORT_STORAGE_VALIDATION_FAILED");
  });

  it("source avoids real Supabase client env network markers", () => {
    const sourceText = readSource(
      "src/lib/persistence/supabaseReportPersistenceAdapter.ts",
    );
    const blockedMarkers = [
      "@" + "supabase/supabase-js",
      "process" + ".env",
      "NEXT" + "_PUBLIC",
      "fetch" + "(",
      "create" + "Client",
      "service" + "_role",
      "pass" + "word",
    ];

    for (const marker of blockedMarkers) {
      expect(sourceText).not.toContain(marker);
    }
  });
});
