import { describe, expect, it } from "vitest";

import type { ComprehensiveReportDraft } from "../../../src/lib/report-generation/comprehensiveReportDraftTypes";
import {
  COMPREHENSIVE_REPORT_SECTION_DEFINITIONS,
  type ComprehensiveReportSectionDefinition,
} from "../../../src/lib/report-knowledge/reportSectionSchema";
import { saveComprehensiveReportDraftSnapshot } from "../../../src/lib/report-persistence/supabaseComprehensiveReportSnapshotAdapter";
import type { SupabaseComprehensiveReportSnapshotRpcClient } from "../../../src/lib/report-persistence/supabaseComprehensiveReportSnapshotClient";

const savedResult = {
  reportId: "report_snapshot_adapter_test",
  providerOrderId: "provider_order_snapshot_adapter_test",
  productType: "saju_mbti_full",
  snapshotVersion: "comprehensive_v1_draft",
  generationModel: "fixture-model",
  status: "generated",
  createdAt: "2026-06-12T00:00:00.000Z",
  updatedAt: "2026-06-12T00:00:01.000Z",
} as const;

function createSection(definition: ComprehensiveReportSectionDefinition) {
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
      `${definition.titleKo}에서는 갑목과 갑신일주를 먼저 놓고 ENTJ는 보조 근거로 연결합니다. ${definition.id} 항목은 저장 전 검증 가능한 본문으로 둡니다.`,
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
    tone: ["saju_first", "conversational"],
    openingTitle: "어댑터 저장 테스트 리포트",
    openingSummary:
      "사주 원국의 구조를 먼저 놓고 MBTI는 사용자가 체감하는 자기상을 보조로 연결합니다.",
    coreLine: "갑목 구조와 ENTJ 성향이 성취 쪽에서 만납니다.",
    sections: COMPREHENSIVE_REPORT_SECTION_DEFINITIONS.map(createSection),
    finalAdvice:
      "성과를 만드는 힘은 살리되 휴식과 감정 표현은 의식적으로 보완해 주세요.",
    safetyNotes: ["자기이해용 참고 콘텐츠입니다."],
  };
}

function createMockClient(): {
  readonly client: SupabaseComprehensiveReportSnapshotRpcClient;
  readonly calls: ComprehensiveReportDraft[];
} {
  const calls: ComprehensiveReportDraft[] = [];

  return {
    calls,
    client: {
      async saveComprehensiveReportDraftSnapshot(input) {
        calls.push(input.draft);

        return {
          ...savedResult,
          reportId: input.reportId,
          providerOrderId: input.providerOrderId,
          generationModel: input.generationModel ?? null,
        };
      },
    },
  };
}

describe("save comprehensive report draft snapshot adapter", () => {
  it("validates and saves a safe draft", async () => {
    const { client, calls } = createMockClient();
    const result = await saveComprehensiveReportDraftSnapshot({
      supabaseUrl: "https://example.supabase.co",
      supabaseAnonKey: "anon_key",
      reportId: "report_snapshot_adapter_test",
      providerOrderId: "provider_order_snapshot_adapter_test",
      draft: createDraft(),
      generationModel: "fixture-model",
      client,
    });

    expect(result).toEqual(savedResult);
    expect(calls).toHaveLength(1);
  });

  it("rejects missing ids and invalid draft", async () => {
    const { client } = createMockClient();
    const validInput = {
      supabaseUrl: "https://example.supabase.co",
      supabaseAnonKey: "anon_key",
      reportId: "report_snapshot_adapter_test",
      providerOrderId: "provider_order_snapshot_adapter_test",
      draft: createDraft(),
      client,
    };

    await expect(
      saveComprehensiveReportDraftSnapshot({
        ...validInput,
        reportId: "",
      }),
    ).rejects.toThrow("COMPREHENSIVE_REPORT_SNAPSHOT_INVALID_REQUEST");
    await expect(
      saveComprehensiveReportDraftSnapshot({
        ...validInput,
        providerOrderId: "",
      }),
    ).rejects.toThrow("COMPREHENSIVE_REPORT_SNAPSHOT_INVALID_REQUEST");
    await expect(
      saveComprehensiveReportDraftSnapshot({
        ...validInput,
        draft: {
          ...createDraft(),
          sections: [],
        } as unknown as ComprehensiveReportDraft,
      }),
    ).rejects.toThrow("COMPREHENSIVE_REPORT_SNAPSHOT_INVALID_DRAFT");
  });

  it("rejects unsafe draft content before save", async () => {
    const { client, calls } = createMockClient();

    await expect(
      saveComprehensiveReportDraftSnapshot({
        supabaseUrl: "https://example.supabase.co",
        supabaseAnonKey: "anon_key",
        reportId: "report_snapshot_adapter_test",
        providerOrderId: "provider_order_snapshot_adapter_test",
        draft: {
          ...createDraft(),
          finalAdvice: "이 구조는 " + "100% " + "확정",
        },
        client,
      }),
    ).rejects.toThrow("COMPREHENSIVE_REPORT_SNAPSHOT_INVALID_DRAFT");
    expect(calls).toHaveLength(0);
  });

  it("returns safe metadata only", async () => {
    const { client } = createMockClient();
    const result = await saveComprehensiveReportDraftSnapshot({
      supabaseUrl: "https://example.supabase.co",
      supabaseAnonKey: "anon_key",
      reportId: "report_snapshot_adapter_test",
      providerOrderId: "provider_order_snapshot_adapter_test",
      draft: createDraft(),
      client,
    });
    const serialized = JSON.stringify(result);

    expect(serialized).not.toContain("reportSnapshot");
    expect(serialized).not.toContain("providerPaymentId");
    expect(serialized).not.toContain("inputSnapshot");
    expect(serialized).not.toContain("shareToken");
    expect(serialized).not.toContain("accessTokenHash");
  });
});
