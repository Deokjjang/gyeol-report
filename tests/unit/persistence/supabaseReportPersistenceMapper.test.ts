import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  mapPersistedReportRecordToSupabaseRow,
  mapSupabaseRowToPersistedReportRecord,
} from "@/lib/persistence/supabaseReportPersistenceMapper";
import type {
  SupabaseReportMappingResult,
  SupabaseReportRow,
} from "@/lib/persistence/supabaseReportPersistenceMapper";
import type { PersistedReportRecord } from "@/lib/persistence/reportPersistenceTypes";
import type { ReportOutput } from "@/lib/report/types";

const createdAt = "2026-01-01T00:00:00.000Z";
const updatedAt = "2026-01-02T00:00:00.000Z";
const deletedAt = "2026-01-03T00:00:00.000Z";
const paidAt = "2026-01-04T00:00:00.000Z";
const refundedAt = "2026-01-05T00:00:00.000Z";

const report: ReportOutput = {
  version: "v1",
  titleKo: "Test report",
  subtitleKo: "Test subtitle",
  sections: [],
  notices: [],
};

const inputSnapshot = {
  birthDate: "2024-02-04",
  birthTime: "17:27",
  birthTimeUnknown: false,
  calendarType: "SOLAR",
  timezone: "Asia/Seoul",
  gender: "MALE",
  mbti: "ENTJ",
} as const;

const reportSnapshot = {
  report,
  reportVersion: "v1",
  renderVersion: "v1",
  createdAt,
} as const;

function createRecord(
  overrides: Partial<PersistedReportRecord> = {},
): PersistedReportRecord {
  return {
    reportId: "report_supabase_mapper",
    createdAt,
    updatedAt,
    status: "paid_unlocked",
    reportVersion: "v1",
    calculationVersion: "calc-v1",
    locale: "ko",
    accessMode: "paid",
    inputSnapshot,
    reportSnapshot,
    payment: {
      orderId: "order_123",
      provider: "toss",
      providerPaymentId: "payment_123",
      paymentStatus: "paid",
      amount: 9900,
      currency: "KRW",
      paidAt,
      refundedAt,
    },
    deletedAt,
    ...overrides,
  };
}

function createRow(overrides: Partial<SupabaseReportRow> = {}): SupabaseReportRow {
  return {
    report_id: "report_supabase_mapper",
    status: "paid_unlocked",
    access_mode: "paid",
    input_snapshot: inputSnapshot,
    report_snapshot: reportSnapshot,
    report_version: "v1",
    calculation_version: "calc-v1",
    locale: "ko",
    access_token_hash: "hash_123",
    access_token_created_at: createdAt,
    access_token_rotated_at: null,
    access_token_version: "v1",
    payment_order_id: "order_123",
    payment_provider: "toss",
    payment_provider_payment_id: "payment_123",
    payment_status: "paid",
    payment_amount: "9900",
    payment_currency: "KRW",
    payment_paid_at: paidAt,
    payment_refunded_at: refundedAt,
    created_at: createdAt,
    updated_at: updatedAt,
    deleted_at: deletedAt,
    ...overrides,
  };
}

function expectOk<T>(result: SupabaseReportMappingResult<T>): T {
  expect(result.ok).toBe(true);

  if (!result.ok) {
    throw new Error(result.messageKo);
  }

  return result.value;
}

function expectFailureCode<T>(
  result: SupabaseReportMappingResult<T>,
  code: Exclude<SupabaseReportMappingResult<T>, { readonly ok: true }>["code"],
): void {
  expect(result.ok).toBe(false);

  if (result.ok) {
    throw new Error("Expected failure result.");
  }

  expect(result.code).toBe(code);
}

function readSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("supabase report persistence mapper", () => {
  it("maps full persisted record to Supabase row", () => {
    const record = createRecord();
    const result = mapPersistedReportRecordToSupabaseRow(record);
    const row = expectOk(result);

    expect(row).toMatchObject({
      report_id: record.reportId,
      status: record.status,
      access_mode: record.accessMode,
      input_snapshot: record.inputSnapshot,
      report_snapshot: record.reportSnapshot,
      report_version: record.reportVersion,
      calculation_version: record.calculationVersion,
      locale: record.locale,
      payment_order_id: record.payment?.orderId,
      payment_provider: record.payment?.provider,
      payment_provider_payment_id: record.payment?.providerPaymentId,
      payment_status: record.payment?.paymentStatus,
      payment_amount: record.payment?.amount,
      payment_currency: record.payment?.currency,
      payment_paid_at: record.payment?.paidAt,
      payment_refunded_at: record.payment?.refundedAt,
      created_at: record.createdAt,
      updated_at: record.updatedAt,
      deleted_at: record.deletedAt,
    });
  });

  it("maps Supabase row to persisted record", () => {
    const row = createRow();
    const result = mapSupabaseRowToPersistedReportRecord(row);
    const record = expectOk(result);

    expect(record).toMatchObject({
      reportId: row.report_id,
      status: row.status,
      accessMode: row.access_mode,
      inputSnapshot: row.input_snapshot,
      reportSnapshot: row.report_snapshot,
      reportVersion: row.report_version,
      calculationVersion: row.calculation_version,
      locale: row.locale,
      payment: {
        orderId: row.payment_order_id,
        provider: row.payment_provider,
        providerPaymentId: row.payment_provider_payment_id,
        paymentStatus: row.payment_status,
        amount: 9900,
        currency: row.payment_currency,
        paidAt: row.payment_paid_at,
        refundedAt: row.payment_refunded_at,
      },
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      deletedAt: row.deleted_at,
    });
  });

  it("handles record without payment linkage", () => {
    const record = createRecord({ payment: undefined });
    const row = expectOk(mapPersistedReportRecordToSupabaseRow(record));

    expect(row.payment_order_id).toBeNull();
    expect(row.payment_provider).toBeNull();
    expect(row.payment_provider_payment_id).toBeNull();
    expect(row.payment_status).toBeNull();
    expect(row.payment_amount).toBeNull();
    expect(row.payment_currency).toBeNull();
    expect(row.payment_paid_at).toBeNull();
    expect(row.payment_refunded_at).toBeNull();
  });

  it("handles row without payment linkage", () => {
    const row = createRow({
      payment_order_id: null,
      payment_provider: null,
      payment_provider_payment_id: null,
      payment_status: null,
      payment_amount: null,
      payment_currency: null,
      payment_paid_at: null,
      payment_refunded_at: null,
    });
    const record = expectOk(mapSupabaseRowToPersistedReportRecord(row));

    expect(record.payment).toBeUndefined();
  });

  it("preserves deleted record timestamp", () => {
    const record = createRecord({ deletedAt });
    const row = expectOk(mapPersistedReportRecordToSupabaseRow(record));
    const restoredRecord = expectOk(mapSupabaseRowToPersistedReportRecord(row));

    expect(row.deleted_at).toBe(deletedAt);
    expect(restoredRecord.deletedAt).toBe(deletedAt);
  });

  it("preserves snapshots by reference and value", () => {
    const record = createRecord();
    const row = expectOk(mapPersistedReportRecordToSupabaseRow(record));
    const restoredRecord = expectOk(mapSupabaseRowToPersistedReportRecord(row));

    expect(row.input_snapshot).toBe(record.inputSnapshot);
    expect(row.report_snapshot).toBe(record.reportSnapshot);
    expect(restoredRecord.inputSnapshot).toEqual(record.inputSnapshot);
    expect(restoredRecord.reportSnapshot).toEqual(record.reportSnapshot);
  });

  it("rejects invalid status", () => {
    const result = mapSupabaseRowToPersistedReportRecord(
      createRow({ status: "archived" }),
    );

    expectFailureCode(result, "INVALID_REPORT_STATUS");
  });

  it("rejects invalid access mode", () => {
    const result = mapSupabaseRowToPersistedReportRecord(
      createRow({ access_mode: "private" }),
    );

    expectFailureCode(result, "INVALID_ACCESS_MODE");
  });

  it("rejects invalid payment status", () => {
    const result = mapSupabaseRowToPersistedReportRecord(
      createRow({ payment_status: "captured" }),
    );

    expectFailureCode(result, "INVALID_PAYMENT_STATUS");
  });

  it("rejects invalid currency", () => {
    const result = mapSupabaseRowToPersistedReportRecord(
      createRow({ payment_currency: "EUR" }),
    );

    expectFailureCode(result, "INVALID_PAYMENT_CURRENCY");
  });

  it("rejects invalid timestamps", () => {
    const result = mapSupabaseRowToPersistedReportRecord(
      createRow({ created_at: "not-a-date" }),
    );

    expectFailureCode(result, "INVALID_TIMESTAMP");
  });

  it("source avoids unsafe implementation markers", () => {
    const source = readSource(
      "src/lib/persistence/supabaseReportPersistenceMapper.ts",
    );
    const markers = [
      "@supabase/supabase-js",
      "process.env",
      "NEXT_PUBLIC",
      "fetch(",
      "createClient",
      "raw card",
      "plaintext access token",
      "provider raw payload",
    ];

    for (const marker of markers) {
      expect(source).not.toContain(marker);
    }
  });
});
