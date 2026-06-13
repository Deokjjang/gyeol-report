import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import type {
  ComprehensiveReportDraft,
  ComprehensiveReportV2ChapterId,
  ComprehensiveReportV2Draft,
} from "../../../src/lib/report-generation/comprehensiveReportDraftTypes";
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
  if (definition.id === "manse_table") {
    return {
      sectionId: definition.id,
      titleKo: definition.titleKo,
      oneLine: "사주 기본 구조를 정리했습니다.",
      body: "사주 원국의 기본 구조를 정리했습니다.",
      evidenceSummary: ["사주 기본 구조"],
      sajuTermsUsed: [],
      mbtiTermsUsed: [],
      cautionLevel: "low" as const,
    };
  }

  if (definition.id === "mbti_table") {
    return {
      sectionId: definition.id,
      titleKo: definition.titleKo,
      oneLine: "MBTI 입력 기준을 정리했습니다.",
      body: "입력하신 MBTI 유형을 리포트 보조 기준으로 반영했습니다.",
      evidenceSummary: ["ENTJ"],
      sajuTermsUsed: [],
      mbtiTermsUsed: ["ENTJ", "Te/Ni"],
      cautionLevel: "low" as const,
    };
  }

  const isMbtiDisplay =
    definition.id === "mbti_core";

  return {
    sectionId: definition.id,
    titleKo: definition.titleKo,
    oneLine: `${definition.titleKo} 핵심을 사주 근거로 정리합니다.`,
    body:
      `${definition.titleKo}에서는 갑목과 갑신일주를 먼저 놓고 ENTJ 성향은 보조 근거로 연결합니다. ${definition.id} 항목은 조회 후 렌더링 가능한 본문으로 둡니다.`,
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

function createV2Chapter(chapterId: ComprehensiveReportV2ChapterId, titleKo: string) {
  return {
    chapterId,
    titleKo,
    headline: `${titleKo}는 갑목과 갑신일주를 먼저 놓고 읽습니다.`,
    body:
      `${titleKo}에서는 갑목과 갑신일주를 먼저 놓고 ENTJ는 보조로만 연결합니다. ${titleKo}의 갑목은 방향을 세우는 힘이고, ${titleKo}의 갑신일주는 압박 속에서 기준을 잡는 구조입니다. ${titleKo} 본문은 저장된 V2 snapshot을 조회한 뒤 화면에서 narrative chapter로 렌더링할 수 있게 충분한 길이를 갖습니다. ${titleKo}에서는 돈과 공부, 관계와 환경이 같은 사주 구조에서 출발하더라도 서로 다른 장면으로 드러난다고 설명합니다. 그래서 ${titleKo}은 짧은 분석표가 아니라 사용자가 자기 행동을 떠올릴 수 있는 긴 호흡의 해석으로 유지되어야 합니다. ${titleKo} 문장은 저장된 snapshot 검증을 위한 예시 문장이며, 사주 용어를 본문 안에서 자연스럽게 풀어냅니다. ${titleKo}은 각 장면에서 무엇을 밀어붙이고 어디서 힘을 빼야 하는지까지 이어져야 하므로, 조회 경계에서도 충분한 narrative 밀도를 가진 문장으로 검증합니다. ${titleKo}의 마지막 흐름은 좋은 말만 덧붙이는 방식이 아니라, 실제 사용자가 일과 돈과 관계에서 어떤 선택을 바꿀 수 있는지까지 이어지는 해석이어야 합니다.`,
    keyPhrases: [titleKo, "갑목"],
    sajuTermsUsed: ["갑목", "갑신일주"],
    mbtiTermsUsed: ["ENTJ"],
  };
}

function createV2Draft(): ComprehensiveReportV2Draft {
  return {
    version: "comprehensive_v2_draft",
    productType: "saju_mbti_full",
    openingTitle: "V2 narrative result",
    openingSummary:
      "갑목과 갑신일주를 먼저 놓고 MBTI는 체감 성향을 보조하는 기준으로 연결합니다.",
    coreLine: "갑목 구조가 먼저이고 ENTJ는 그 구조를 성취 쪽으로 증폭합니다.",
    chapters: [
      createV2Chapter("opening", "처음에 보이는 결"),
      createV2Chapter("saju_identity", "사주가 보여주는 기본 형상"),
      createV2Chapter("personality_pattern", "성격과 판단 패턴"),
      createV2Chapter("work_money_study", "일, 돈, 공부가 연결되는 방식"),
      createV2Chapter("love_relationships", "연애와 관계의 온도"),
      createV2Chapter("people_family_environment", "사람, 가족, 환경"),
      createV2Chapter("risk_and_growth", "반복되는 리스크와 성장법"),
      createV2Chapter("final_message", "마지막으로 남길 말"),
    ],
    finalAdvice:
      "성과를 만드는 힘은 살리되 휴식과 감정 표현은 의식적으로 보완해 주세요.",
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
        snapshotVersion: "comprehensive_v1_draft",
        draft,
        createdAt,
        updatedAt,
      },
    });
  });

  it("maps generated V2 narrative draft rows after validating the snapshot", async () => {
    const draft = createV2Draft();
    const client = createSupabasePaidReportResultClient({
      rpcExecutor: async () => ({
        data: [
          createRow({
            snapshot_version: "comprehensive_v2_draft",
            report_snapshot: draft,
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
        status: "generated",
        snapshotStatus: "generated",
        snapshotVersion: "comprehensive_v2_draft",
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
        snapshotVersion: null,
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
