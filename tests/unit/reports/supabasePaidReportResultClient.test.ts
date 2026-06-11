import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import type { GetPaidReportResultInput } from "../../../src/lib/reports/paidReportResultTypes";
import {
  createSupabasePaidReportResultClient,
  type PaidReportResultRpcExecutor,
  type PaidReportResultRpcResultRow,
} from "../../../src/lib/reports/supabasePaidReportResultClient";

const createdAt = "2026-06-12T10:00:00.000Z";
const updatedAt = "2026-06-12T10:00:01.000Z";

function createInput(
  overrides: Partial<GetPaidReportResultInput> = {},
): GetPaidReportResultInput {
  return {
    reportId: "report_result_client_test",
    ...overrides,
  };
}

function createRow(
  overrides: Partial<PaidReportResultRpcResultRow> = {},
): PaidReportResultRpcResultRow {
  return {
    report_id: "report_result_client_test",
    product_type: "saju_mbti_full",
    status: "ready",
    title: "사주×MBTI 종합 리포트",
    placeholder_text:
      "결제가 완료되었습니다. 사주×MBTI 종합 리포트 생성 파이프라인이 연결되었습니다.",
    created_at: createdAt,
    updated_at: updatedAt,
    ...overrides,
  };
}

function readSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("Supabase paid report result client", () => {
  it("calls get_paid_saju_mbti_report_result RPC with expected argument names", async () => {
    const calls: Array<{
      readonly functionName: string;
      readonly args: Record<string, unknown>;
    }> = [];
    const rpcExecutor: PaidReportResultRpcExecutor = async (
      functionName,
      args,
    ) => {
      calls.push({ functionName, args });

      return {
        data: [createRow()],
        error: null,
      };
    };
    const client = createSupabasePaidReportResultClient({ rpcExecutor });
    const result = await client.getPaidReportResult(createInput());

    expect(result.ok).toBe(true);
    expect(calls).toEqual([
      {
        functionName: "get_paid_saju_mbti_report_result",
        args: {
          p_report_id: "report_result_client_test",
        },
      },
    ]);
  });

  it("maps returned safe row fields", async () => {
    const client = createSupabasePaidReportResultClient({
      rpcExecutor: async () => ({ data: [createRow()], error: null }),
    });
    const result = await client.getPaidReportResult(createInput());

    expect(result).toEqual({
      ok: true,
      data: {
        reportId: "report_result_client_test",
        productType: "saju_mbti_full",
        status: "ready",
        title: "사주×MBTI 종합 리포트",
        placeholderText:
          "결제가 완료되었습니다. 사주×MBTI 종합 리포트 생성 파이프라인이 연결되었습니다.",
        createdAt,
        updatedAt,
      },
    });
  });

  it("maps unavailable report errors safely", async () => {
    const client = createSupabasePaidReportResultClient({
      rpcExecutor: async () => ({
        data: null,
        error: {
          code: "P0001",
          message: "PAID_REPORT_RESULT_NOT_FOUND",
        },
      }),
    });
    const result = await client.getPaidReportResult(createInput());

    expect(result).toEqual({
      ok: false,
      code: "PAID_REPORT_RESULT_NOT_FOUND",
      messageKo: "Supabase paid report result RPC failed.",
    });
  });

  it("rejects missing rows and malformed rows", async () => {
    const missingClient = createSupabasePaidReportResultClient({
      rpcExecutor: async () => ({ data: [], error: null }),
    });
    const malformedClient = createSupabasePaidReportResultClient({
      rpcExecutor: async () => ({
        data: [createRow({ status: "paid_unlocked" })],
        error: null,
      }),
    });

    await expect(
      missingClient.getPaidReportResult(createInput()),
    ).resolves.toEqual({
      ok: false,
      code: "PAID_REPORT_RESULT_RPC_VALIDATION_FAILED",
      messageKo: "Supabase paid report result RPC returned invalid data.",
    });
    await expect(
      malformedClient.getPaidReportResult(createInput()),
    ).resolves.toEqual({
      ok: false,
      code: "PAID_REPORT_RESULT_RPC_VALIDATION_FAILED",
      messageKo: "Supabase paid report result RPC returned invalid data.",
    });
  });

  it("does not expose private fields in result", async () => {
    const client = createSupabasePaidReportResultClient({
      rpcExecutor: async () => ({
        data: [
          {
            ...createRow(),
            ["input" + "_snapshot"]: { hidden: true },
            ["provider" + "_payment" + "_id"]: "hidden_provider_payment_id",
            ["payment" + "Key"]: "hidden_payment_key",
            ["access" + "_token" + "_hash"]: "hidden_access_hash",
            ["share" + "Token"]: "hidden_share_token",
          },
        ],
        error: null,
      }),
    });
    const result = await client.getPaidReportResult(createInput());
    const serialized = JSON.stringify(result);

    expect(result.ok).toBe(true);
    expect(serialized).not.toContain("hidden_provider_payment_id");
    expect(serialized).not.toContain("hidden_payment_key");
    expect(serialized).not.toContain("input" + "_snapshot");
    expect(serialized).not.toContain("hidden_access_hash");
    expect(serialized).not.toContain("hidden_share_token");
  });

  it("source uses RPC only and avoids unsafe result behavior", () => {
    const source = readSource(
      "src/lib/reports/supabasePaidReportResultClient.ts",
    );
    const requiredMarkers = [
      ".rpc(",
      "get_paid_saju_mbti_report_result",
      "p_report_id",
    ];
    const blockedMarkers = [
      ".from(",
      "." + "update(",
      "createReport",
      "generateReport",
      "TOSS" + "_SECRET" + "_KEY",
      "SUPABASE" + "_SERVICE" + "_ROLE",
      "service" + "_role",
      "share" + "Token",
      "access" + "TokenHash",
      "provider" + "PaymentId",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }

    for (const marker of blockedMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
