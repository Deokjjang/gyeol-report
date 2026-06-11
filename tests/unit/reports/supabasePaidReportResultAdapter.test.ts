import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import type {
  GetPaidReportResultInput,
  PaidReportResult,
} from "../../../src/lib/reports/paidReportResultTypes";
import { getPaidReportResult } from "../../../src/lib/reports/supabasePaidReportResultAdapter";
import type { SupabasePaidReportResultRpcClient } from "../../../src/lib/reports/supabasePaidReportResultClient";

const createdAt = "2026-06-12T10:00:00.000Z";
const updatedAt = "2026-06-12T10:00:01.000Z";

function createGeneratedResult(input: GetPaidReportResultInput): PaidReportResult {
  return {
    reportId: input.reportId,
    productType: "saju_mbti_full",
    status: "generated",
    snapshotStatus: "generated",
    draft: {
      version: "comprehensive_v1_draft",
      productType: "saju_mbti_full",
      tone: ["saju_first"],
      openingTitle: "생성된 종합 리포트",
      openingSummary:
        "사주 구조를 먼저 보고 MBTI는 보조로 연결한 생성 리포트입니다.",
      coreLine: "사주 근거를 중심으로 해석합니다.",
      sections: [],
      finalAdvice: "결과를 자기이해용 참고로만 사용해 주세요.",
      safetyNotes: [],
    },
    createdAt,
    updatedAt,
  };
}

function createMissingSnapshotResult(
  input: GetPaidReportResultInput,
): PaidReportResult {
  return {
    reportId: input.reportId,
    productType: "saju_mbti_full",
    status: "ready",
    snapshotStatus: "missing",
    draft: null,
    createdAt,
    updatedAt,
  };
}

function createFakeClient(
  resultFactory: (input: GetPaidReportResultInput) => PaidReportResult =
    createGeneratedResult,
): {
  readonly calls: GetPaidReportResultInput[];
  readonly client: SupabasePaidReportResultRpcClient;
} {
  const calls: GetPaidReportResultInput[] = [];

  return {
    calls,
    client: {
      async getPaidReportResult(input) {
        calls.push(input);

        return {
          ok: true,
          data: resultFactory(input),
        };
      },
    },
  };
}

function readSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("Supabase paid report result adapter", () => {
  it("loads a valid generated report result by report id", async () => {
    const fake = createFakeClient();
    const result = await getPaidReportResult({
      reportId: "report_result_adapter_test",
      client: fake.client,
    });

    expect(result).toMatchObject({
      ok: true,
      result: {
        reportId: "report_result_adapter_test",
        productType: "saju_mbti_full",
        status: "generated",
        snapshotStatus: "generated",
      },
    });
    expect(fake.calls).toEqual([
      {
        reportId: "report_result_adapter_test",
      },
    ]);
  });

  it("trims and requires a report id shaped result id", async () => {
    const fake = createFakeClient();
    const result = await getPaidReportResult({
      reportId: "  report_result_adapter_test  ",
      client: fake.client,
    });

    expect(result.ok).toBe(true);
    expect(fake.calls).toEqual([
      {
        reportId: "report_result_adapter_test",
      },
    ]);
  });

  it("rejects invalid report ids before RPC", async () => {
    const fake = createFakeClient();
    const result = await getPaidReportResult({
      reportId: "../bad",
      client: fake.client,
    });

    expect(result).toEqual({
      ok: false,
      error: {
        code: "REPORT_RESULT_INVALID_REQUEST",
        messageKo: "Paid report result request is invalid.",
      },
    });
    expect(fake.calls).toEqual([]);
  });

  it("returns safe unavailable report failures", async () => {
    const result = await getPaidReportResult({
      reportId: "report_missing_result",
      client: {
        async getPaidReportResult() {
          return {
            ok: false,
            code: "REPORT_RESULT_NOT_FOUND",
            messageKo: "Supabase paid report result RPC failed.",
          };
        },
      },
    });

    expect(result).toEqual({
      ok: false,
      error: {
        code: "REPORT_RESULT_NOT_FOUND",
        messageKo: "Supabase paid report result RPC failed.",
      },
    });
  });

  it("returns missing snapshot results safely", async () => {
    const fake = createFakeClient(createMissingSnapshotResult);
    const result = await getPaidReportResult({
      reportId: "report_result_adapter_test",
      client: fake.client,
    });

    expect(result).toEqual({
      ok: true,
      result: {
        reportId: "report_result_adapter_test",
        productType: "saju_mbti_full",
        status: "ready",
        snapshotStatus: "missing",
        draft: null,
        createdAt,
        updatedAt,
      },
    });
  });

  it("returns invalid snapshot failures safely", async () => {
    const result = await getPaidReportResult({
      reportId: "report_result_adapter_test",
      client: {
        async getPaidReportResult() {
          return {
            ok: false,
            code: "REPORT_RESULT_SNAPSHOT_INVALID",
            messageKo: "Supabase paid report result snapshot is invalid.",
          };
        },
      },
    });

    expect(result).toEqual({
      ok: false,
      error: {
        code: "REPORT_RESULT_SNAPSHOT_INVALID",
        messageKo: "Supabase paid report result snapshot is invalid.",
      },
    });
  });

  it("returns result fields without private fields", async () => {
    const fake = createFakeClient();
    const result = await getPaidReportResult({
      reportId: "report_result_adapter_test",
      client: fake.client,
    });
    const serialized = JSON.stringify(result);

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(Object.keys(result.result)).not.toContain(
        "provider" + "Payment" + "Id",
      );
      expect(Object.keys(result.result)).not.toContain("input" + "Snapshot");
      expect(Object.keys(result.result)).not.toContain("access" + "TokenHash");
      expect(Object.keys(result.result)).not.toContain("share" + "Token");
    }

    expect(serialized).not.toContain("provider_payment_id");
    expect(serialized).not.toContain("input_snapshot");
  });

  it("source does not create report content or issue links", () => {
    const source = [
      readSource("src/lib/reports/supabasePaidReportResultAdapter.ts"),
      readSource("src/lib/reports/supabasePaidReportResultClient.ts"),
    ].join("\n");
    const blockedMarkers = [
      "confirmTossPayment",
      "/v1/" + "payments/confirm",
      "createReport",
      "generateReport",
      "issueReport" + "Share" + "Token",
      "TOSS" + "_SECRET" + "_KEY",
      "SUPABASE" + "_SERVICE" + "_ROLE",
      "service" + "_role",
      "share" + "Token",
      "access" + "TokenHash",
      "provider" + "PaymentId",
      "Bar" + "num",
      "바" + "넘",
      "현" + "침살",
      "망" + "신살",
      "백" + "호대살",
      "홍" + "염살",
      "재" + "다신약",
      "제" + "다신약",
    ];

    for (const marker of blockedMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
