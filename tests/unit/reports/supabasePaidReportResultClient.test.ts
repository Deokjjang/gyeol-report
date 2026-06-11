import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import type { ComprehensiveReportDraft } from "../../../src/lib/report-generation/comprehensiveReportDraftTypes";
import type { GetPaidReportResultInput } from "../../../src/lib/reports/paidReportResultTypes";
import {
  createSupabasePaidReportResultClient,
  type PaidReportResultRpcExecutor,
  type PaidReportResultRpcResultRow,
} from "../../../src/lib/reports/supabasePaidReportResultClient";
import {
  COMPREHENSIVE_REPORT_SECTION_DEFINITIONS,
  type ComprehensiveReportSectionDefinition,
} from "../../../src/lib/report-knowledge/reportSectionSchema";

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

function createDraftSection(definition: ComprehensiveReportSectionDefinition) {
  const isMbtiDisplay =
    definition.id === "mbti_core" || definition.id === "mbti_table";

  return {
    sectionId: definition.id,
    titleKo: definition.titleKo,
    oneLine: `${definition.titleKo} 핵심을 사주 근거로 정리합니다.`,
    body:
      "갑목과 갑신일주를 먼저 놓고 ENTJ 성향은 보조 근거로만 연결하는 안전한 초안입니다.",
    evidenceSummary: ["갑목", "갑신일주", "ENTJ"],
    sajuTermsUsed:
      definition.primaryBasis === "display" && isMbtiDisplay
        ? []
        : ["갑목", "갑신일주"],
    mbtiTermsUsed: isMbtiDisplay ? ["ENTJ", "Te/Ni"] : ["ENTJ"],
    cautionLevel: "medium" as const,
  };
}

function createDraft(): ComprehensiveReportDraft {
  return {
    version: "comprehensive_v1_draft",
    productType: "saju_mbti_full",
    tone: ["saju_first", "conversational", "direct"],
    openingTitle: "사주와 MBTI가 만나는 지점",
    openingSummary:
      "사주 원국의 구조를 먼저 보고 MBTI는 사용자가 체감하는 자기상을 보조로 연결합니다.",
    coreLine: "사주 구조가 먼저이고 ENTJ는 그 구조를 증폭합니다.",
    sections: COMPREHENSIVE_REPORT_SECTION_DEFINITIONS.map(createDraftSection),
    finalAdvice:
      "강하게 드러나는 성향은 성과로 쓰되, 감정 순환과 휴식은 의식적으로 챙기는 편이 좋습니다.",
    safetyNotes: ["자기이해용 참고 콘텐츠입니다."],
  };
}

function createRow(
  overrides: Partial<PaidReportResultRpcResultRow> = {},
): PaidReportResultRpcResultRow {
  return {
    report_id: "report_result_client_test",
    product_type: "saju_mbti_full",
    status: "generated",
    snapshot_status: "generated",
    report_snapshot: createDraft(),
    created_at: createdAt,
    updated_at: updatedAt,
    ...overrides,
  };
}

function readSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("Supabase paid report result client", () => {
  it("calls get_generated_comprehensive_report_result RPC with expected argument names", async () => {
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
        functionName: "get_generated_comprehensive_report_result",
        args: {
          p_report_id: "report_result_client_test",
        },
      },
    ]);
  });

  it("maps generated draft rows after validating the snapshot", async () => {
    const draft = createDraft();
    const client = createSupabasePaidReportResultClient({
      rpcExecutor: async () => ({
        data: [createRow({ report_snapshot: draft })],
        error: null,
      }),
    });
    const result = await client.getPaidReportResult(createInput());

    expect(result).toEqual({
      ok: true,
      data: {
        reportId: "report_result_client_test",
        productType: "saju_mbti_full",
        status: "generated",
        snapshotStatus: "generated",
        draft,
        createdAt,
        updatedAt,
      },
    });
  });

  it("returns draft null for missing snapshots", async () => {
    const client = createSupabasePaidReportResultClient({
      rpcExecutor: async () => ({
        data: [
          createRow({
            status: "ready",
            snapshot_status: "missing",
            report_snapshot: null,
          }),
        ],
        error: null,
      }),
    });
    const result = await client.getPaidReportResult(createInput());

    expect(result).toEqual({
      ok: true,
      data: {
        reportId: "report_result_client_test",
        productType: "saju_mbti_full",
        status: "ready",
        snapshotStatus: "missing",
        draft: null,
        createdAt,
        updatedAt,
      },
    });
  });

  it("rejects invalid snapshots safely", async () => {
    const client = createSupabasePaidReportResultClient({
      rpcExecutor: async () => ({
        data: [
          createRow({
            report_snapshot: {
              version: "comprehensive_v1_draft",
              productType: "saju_mbti_full",
            },
          }),
        ],
        error: null,
      }),
    });
    const result = await client.getPaidReportResult(createInput());

    expect(result).toEqual({
      ok: false,
      code: "REPORT_RESULT_SNAPSHOT_INVALID",
      messageKo: "Supabase paid report result snapshot is invalid.",
    });
  });

  it("maps unavailable report errors safely", async () => {
    const client = createSupabasePaidReportResultClient({
      rpcExecutor: async () => ({
        data: null,
        error: {
          code: "P0001",
          message: "REPORT_RESULT_NOT_FOUND",
        },
      }),
    });
    const result = await client.getPaidReportResult(createInput());

    expect(result).toEqual({
      ok: false,
      code: "REPORT_RESULT_NOT_FOUND",
      messageKo: "Supabase paid report result RPC failed.",
    });
  });

  it("rejects missing rows and malformed rows", async () => {
    const missingClient = createSupabasePaidReportResultClient({
      rpcExecutor: async () => ({ data: [], error: null }),
    });
    const malformedClient = createSupabasePaidReportResultClient({
      rpcExecutor: async () => ({
        data: [createRow({ snapshot_status: "unknown" })],
        error: null,
      }),
    });

    await expect(
      missingClient.getPaidReportResult(createInput()),
    ).resolves.toEqual({
      ok: false,
      code: "REPORT_RESULT_RPC_VALIDATION_FAILED",
      messageKo: "Supabase paid report result RPC returned invalid data.",
    });
    await expect(
      malformedClient.getPaidReportResult(createInput()),
    ).resolves.toEqual({
      ok: false,
      code: "REPORT_RESULT_RPC_VALIDATION_FAILED",
      messageKo: "Supabase paid report result RPC returned invalid data.",
    });
  });

  it("does not expose raw snapshot or private fields in result", async () => {
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
    expect(serialized).not.toContain("report" + "_snapshot");
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
      "get_generated_comprehensive_report_result",
      "p_report_id",
      "validateComprehensiveReportDraft",
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
