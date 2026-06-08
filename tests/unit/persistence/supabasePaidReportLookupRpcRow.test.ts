import { describe, expect, it } from "vitest";

import {
  parseSupabasePaidReportLookupRpcResult,
  type SupabasePaidReportLookupRow,
} from "@/lib/persistence/supabasePaidReportLookupRpcRow";
import type { ReportOutput } from "@/lib/report/types";

const createdAt = "2026-01-01T00:00:00.000Z";
const updatedAt = "2026-01-01T00:01:00.000Z";

const reportFixture: ReportOutput = {
  version: "v1",
  titleKo: "Paid lookup report",
  subtitleKo: "Safe RPC row fixture",
  sections: [],
  notices: [],
};

function createSafeRpcRow(
  overrides: Partial<SupabasePaidReportLookupRow> = {},
): SupabasePaidReportLookupRow {
  return {
    report_id: "report_rpc_lookup_1",
    status: "paid_unlocked",
    access_mode: "paid",
    input_snapshot: {
      birthDate: "1996-12-06",
      birthTime: "14:15",
      birthTimeUnknown: false,
      calendarType: "SOLAR",
      timezone: "Asia/Seoul",
      gender: "FEMALE",
      mbti: "ENTJ",
    },
    report_snapshot: {
      report: reportFixture,
      reportVersion: "v1",
      renderVersion: "v1",
      createdAt,
    },
    report_version: "v1",
    calculation_version: "saju-mbti-v1",
    locale: "ko-KR",
    payment_status: "paid",
    created_at: createdAt,
    updated_at: updatedAt,
    ...overrides,
  };
}

function expectParseSuccess(
  value: unknown,
): SupabasePaidReportLookupRow | null {
  const result = parseSupabasePaidReportLookupRpcResult(value);

  expect(result.ok).toBe(true);

  if (!result.ok) {
    throw new Error("Expected RPC row parse success.");
  }

  return result.row;
}

describe("parseSupabasePaidReportLookupRpcResult", () => {
  it("validates a safe RPC row without access token hash", () => {
    const row = createSafeRpcRow();
    const parsed = expectParseSuccess(row);

    expect(parsed).toEqual(row);
    expect(JSON.stringify(parsed)).not.toContain("access" + "_token" + "_hash");
  });

  it("validates a safe RPC row without provider payment id", () => {
    const row = createSafeRpcRow();
    const parsed = expectParseSuccess([row]);

    expect(parsed).toEqual(row);
    expect(JSON.stringify(parsed)).not.toContain(
      "payment" + "_provider" + "_payment" + "_id",
    );
  });

  it("returns null for empty RPC results", () => {
    expect(expectParseSuccess([])).toBeNull();
    expect(expectParseSuccess(null)).toBeNull();
  });

  it("rejects malformed RPC rows with a storage validation code", () => {
    const invalidRow = {
      ...createSafeRpcRow(),
      report_snapshot: null,
    };
    const result = parseSupabasePaidReportLookupRpcResult(invalidRow);

    expect(result.ok).toBe(false);

    if (result.ok) {
      throw new Error("Expected RPC row parse failure.");
    }

    expect(result.code).toBe("REPORT_STORAGE_VALIDATION_FAILED");
  });
});
