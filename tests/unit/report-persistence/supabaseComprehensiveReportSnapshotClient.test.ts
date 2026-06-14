import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import type {
  ComprehensiveReportV1Draft,
  ComprehensiveReportV2Draft,
} from "../../../src/lib/report-generation/comprehensiveReportDraftTypes";
import {
  COMPREHENSIVE_REPORT_SECTION_DEFINITIONS,
  type ComprehensiveReportSectionDefinition,
} from "../../../src/lib/report-knowledge/reportSectionSchema";
import {
  createSupabaseComprehensiveReportSnapshotClient,
  saveComprehensiveReportDraftSnapshotWithSupabase,
  type ComprehensiveReportSnapshotRpcExecutor,
  type ComprehensiveReportSnapshotRpcResultRow,
} from "../../../src/lib/report-persistence/supabaseComprehensiveReportSnapshotClient";

const createdAt = "2026-06-12T00:00:00.000Z";
const updatedAt = "2026-06-12T00:00:01.000Z";

function createSection(definition: ComprehensiveReportSectionDefinition) {
  const isMbtiDisplay =
    definition.id === "mbti_core" || definition.id === "mbti_table";

  return {
    sectionId: definition.id,
    titleKo: definition.titleKo,
    oneLine: `${definition.titleKo} snapshot client fixture입니다.`,
    body:
      "갑목과 갑신일주를 먼저 놓고 ENTJ는 보조 근거로 연결하는 안전한 저장 fixture입니다.",
    evidenceSummary: ["갑목", "갑신일주", "ENTJ"],
    sajuTermsUsed:
      definition.primaryBasis === "display" && isMbtiDisplay
        ? []
        : ["갑목", "갑신일주"],
    mbtiTermsUsed: isMbtiDisplay ? ["ENTJ", "Te/Ni"] : ["ENTJ"],
    cautionLevel: "medium" as const,
  };
}

function createDraft(): ComprehensiveReportV1Draft {
  return {
    version: "comprehensive_v1_draft",
    productType: "saju_mbti_full",
    tone: ["saju_first", "conversational"],
    openingTitle: "저장 테스트 초안",
    openingSummary:
      "사주 원국의 구조를 먼저 놓고 MBTI는 사용자가 체감하는 자기상을 보조로 연결합니다.",
    coreLine: "갑목 구조와 ENTJ 성향이 성취 쪽에서 만납니다.",
    sections: COMPREHENSIVE_REPORT_SECTION_DEFINITIONS.map(createSection),
    finalAdvice:
      "성과를 만드는 힘은 살리되 휴식과 감정 표현은 의식적으로 보완해 주세요.",
    safetyNotes: ["자기이해용 참고 콘텐츠입니다."],
  };
}

function createV2Draft(): ComprehensiveReportV2Draft {
  const createBody = (chapterId: string) =>
    `V2 ${chapterId}에서는 갑목과 갑신일주를 먼저 놓고 읽습니다. V2 ${chapterId}의 갑목은 방향을 세우는 힘이고 갑신일주는 압박 속에서 기준을 잡는 구조입니다. ENTJ는 V2 ${chapterId}의 구조를 성취와 효율, 목표와 역할 정리 쪽으로 체감하게 만드는 보조 성향입니다. V2 ${chapterId} 본문은 저장 경계 테스트용으로 충분한 길이를 갖고, 실제 화면에서는 챕터형 리포트로 렌더링됩니다. V2 ${chapterId}에서는 회의와 메시지, 돈과 공부, 관계와 환경은 같은 근거가 서로 다른 장면으로 드러나는 방식으로 설명됩니다. V2 ${chapterId}의 조언은 결론을 바로 던지기보다 질문을 먼저 넣는 방식으로 이어집니다.`;
  const finalBody =
    "마지막으로 남길 말에서는 갑목과 갑신일주의 큰 방향, 압박 속 판단, 책임을 처리하는 방식이 한 줄로 정리됩니다. 입력한 ENTJ 성향으로 보면 효율, 목표, 역할 정리, 빠른 결론과 해결 중심을 통해 이 사주 구조가 체감됩니다. 일에서는 맡을 일과 버릴 일을 나누고, 관계에서는 조언 전에 질문을 먼저 넣고, 돈에서는 계좌와 예산을 분리하며, 회복에서는 밤 산책과 수면과 기록을 일정에 고정해야 합니다. 돈과 일은 성과를 밀어붙이는 힘으로 쓰되, 관계에서는 상대의 속도를 확인하고, 회복에서는 아무 성과도 내지 않는 시간을 먼저 확보해야 오래 갑니다. 오늘부터 할 작은 실행은 회의 전에 질문 하나 쓰기, 계좌를 용도별로 나누기, 침대에 눕기 전 내일 일정 메모를 닫기입니다. 또 하나는 메시지를 보내기 전에 말의 온도를 한 번 낮추고, 마지막 하나는 밤 산책이나 기록으로 머리를 식힌 뒤 판단을 미루는 것입니다. 오래 가는 방식은 더 세게 밀어붙이는 일이 아니라, 방향과 책임과 회복을 동시에 운영하는 장치에서 나옵니다.";

  return {
    version: "comprehensive_v2_draft",
    productType: "saju_mbti_full",
    openingTitle: "V2 저장 테스트 리포트",
    openingSummary:
      "갑목과 갑신일주를 먼저 놓고 MBTI는 체감 성향을 보조하는 기준으로 연결합니다.",
    coreLine: "갑목 구조가 먼저이고 ENTJ는 그 구조를 성취 쪽으로 증폭합니다.",
    profileTable: {
      dayMaster: "갑목",
      dayPillar: "갑신일주",
      dayPillarKeywords: ["바위 위 소나무", "압박 속 리더십"],
      fiveElementSummary: ["목 2", "화 0", "토 4", "금 2", "수 0"],
      excessiveElements: ["토 과다"],
      missingElements: ["화 부족", "수 부족"],
      tenGodSummary: ["편재", "정재", "정관", "편관"],
      specialPatterns: ["재다신약", "무인성", "무식상"],
      sinsal: ["현침살", "홍염살"],
      gwiin: ["재고귀인"],
      mbti: "ENTJ",
    },
    chapters: [
      "opening",
      "saju_identity",
      "personality_pattern",
      "work_money_study",
      "love_relationships",
      "people_family_environment",
      "risk_and_growth",
      "final_message",
    ].map((chapterId) => ({
      chapterId: chapterId as ComprehensiveReportV2Draft["chapters"][number]["chapterId"],
      titleKo: `V2 ${chapterId}`,
      headline: `V2 ${chapterId} headline은 사주를 먼저 놓고 읽습니다.`,
      hitReadingLines: [
        "덕민님, 상대가 설명을 끝내기 전에 이미 결론이 보이는 상황 자주 나오지 않나요?",
        "일을 잡으면 초반에는 빠르게 판을 정리하지만 쉬는 기준은 자주 뒤로 밀릴 수 있습니다.",
        "감정보다 기준을 먼저 세우는 편입니다.",
      ],
      body: chapterId === "final_message" ? finalBody : createBody(chapterId),
      solutionLines:
        chapterId === "opening"
          ? []
          : chapterId === "final_message"
            ? [
                "오늘 회의나 대화 전에 상대의 핵심을 한 문장으로 되받아 주세요.",
                "일에서는 맡을 일과 버릴 일을 구분해 책임의 경계선을 정하세요.",
                "돈은 계좌와 예산을 나누어 공격 계획과 방어 계획을 분리하세요.",
                "회복은 밤 산책, 수면, 기록처럼 일정에 박아 두세요.",
              ]
            : chapterId === "work_money_study"
              ? [
                  "자격증과 전문서 공부는 2주 단위 목표로 쪼개세요.",
                  "직무 학습과 사업 학습은 실전 적용 순서로 정리하세요.",
                  "돈은 계좌와 예산을 나누어 공격 계획과 방어 계획을 분리하세요.",
                  "쉬는 시간을 일정에 먼저 넣으세요.",
                ]
              : chapterId === "love_relationships"
                ? [
                    "맞는 상대: 감정을 천천히 풀어주고 과열을 식혀주는 사람을 보세요.",
                    "피해야 할 상대: 감정 기복이 크고 책임이 흐릿한 사람은 조심하세요.",
                    "보완 기운: 수 기운과 화 기운처럼 감정 완충과 표현 온도를 보태는 타입이 좋습니다.",
                    "MBTI 예시: ISFP, INFP, INTP처럼 보완적으로 느껴질 수 있으나 MBTI만으로 궁합을 단정하지 않습니다.",
                  ]
                : chapterId === "risk_and_growth"
                  ? [
                      "수 부족은 밤 산책, 수면, 기록처럼 머리를 식히는 루틴으로 보완하세요.",
                      "화 부족은 햇빛, 가벼운 운동, 짧은 표현 연습으로 밖으로 꺼내세요.",
                      "토 과다는 책임 덜어내기와 일정 정리로 맡은 일의 경계선을 세우세요.",
                      "회복은 기분 문제가 아니라 오래 가기 위한 운영 장치로 고정하세요.",
                    ]
          : [
              "결론을 바로 말하기 전에 질문을 먼저 넣으세요.",
              "책임 범위를 문장으로 정리하세요.",
              "쉬는 시간을 일정에 먼저 넣으세요.",
              "감정 표현은 짧게라도 밖으로 내세요.",
            ],
      keyPhrases: ["갑목", "갑신일주"],
      sajuTermsUsed: ["갑목", "갑신일주"],
      mbtiTermsUsed: ["ENTJ"],
    })),
    finalAdvice:
      "성과를 만드는 힘은 살리되 휴식과 감정 표현은 의식적으로 보완해 주세요.",
    safetyNotes: ["자기이해용 참고 콘텐츠입니다."],
  };
}

function createRow(
  overrides: Partial<ComprehensiveReportSnapshotRpcResultRow> = {},
): ComprehensiveReportSnapshotRpcResultRow {
  return {
    report_id: "report_snapshot_client_test",
    provider_order_id: "provider_order_snapshot_client_test",
    product_type: "saju_mbti_full",
    snapshot_version: "comprehensive_v1_draft",
    generation_model: "fixture-model",
    status: "generated",
    created_at: createdAt,
    updated_at: updatedAt,
    ...overrides,
  };
}

function readSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("Supabase comprehensive report snapshot client", () => {
  it("calls save_comprehensive_report_draft_snapshot RPC with expected args", async () => {
    const calls: Array<{
      readonly functionName: string;
      readonly args: Record<string, unknown>;
    }> = [];
    const draft = createDraft();
    const rpcExecutor: ComprehensiveReportSnapshotRpcExecutor = async (
      functionName,
      args,
    ) => {
      calls.push({ functionName, args });

      return {
        data: [createRow()],
        error: null,
      };
    };
    const client = createSupabaseComprehensiveReportSnapshotClient({ rpcExecutor });
    const result = await saveComprehensiveReportDraftSnapshotWithSupabase({
      client,
      reportId: "report_snapshot_client_test",
      providerOrderId: "provider_order_snapshot_client_test",
      draft,
      generationModel: "fixture-model",
    });

    expect(result.reportId).toBe("report_snapshot_client_test");
    expect(calls).toEqual([
      {
        functionName: "save_comprehensive_report_draft_snapshot",
        args: {
          p_report_id: "report_snapshot_client_test",
          p_provider_order_id: "provider_order_snapshot_client_test",
          p_report_snapshot: draft,
          p_generation_model: "fixture-model",
          p_generation_version: "comprehensive_v1_draft",
        },
      },
    ]);
  });

  it("maps safe result metadata", async () => {
    const client = createSupabaseComprehensiveReportSnapshotClient({
      rpcExecutor: async () => ({ data: [createRow()], error: null }),
    });

    await expect(
      client.saveComprehensiveReportDraftSnapshot({
        reportId: "report_snapshot_client_test",
        providerOrderId: "provider_order_snapshot_client_test",
        draft: createDraft(),
        generationModel: "fixture-model",
      }),
    ).resolves.toEqual({
      reportId: "report_snapshot_client_test",
      providerOrderId: "provider_order_snapshot_client_test",
      productType: "saju_mbti_full",
      snapshotVersion: "comprehensive_v1_draft",
      generationModel: "fixture-model",
      status: "generated",
      createdAt,
      updatedAt,
    });
  });

  it("passes and maps V2 snapshot versions", async () => {
    const calls: Array<{
      readonly functionName: string;
      readonly args: Record<string, unknown>;
    }> = [];
    const draft = createV2Draft();
    const client = createSupabaseComprehensiveReportSnapshotClient({
      rpcExecutor: async (functionName, args) => {
        calls.push({ functionName, args });

        return {
          data: [createRow({ snapshot_version: "comprehensive_v2_draft" })],
          error: null,
        };
      },
    });
    const result = await client.saveComprehensiveReportDraftSnapshot({
      reportId: "report_snapshot_client_test",
      providerOrderId: "provider_order_snapshot_client_test",
      draft,
      generationModel: "fixture-model",
    });

    expect(calls[0]?.args.p_generation_version).toBe("comprehensive_v2_draft");
    expect(result.snapshotVersion).toBe("comprehensive_v2_draft");
  });

  it("throws safe errors for RPC error and missing row", async () => {
    const errorClient = createSupabaseComprehensiveReportSnapshotClient({
      rpcExecutor: async () => ({
        data: null,
        error: {
          code: "P0001",
          message: "REPORT_SNAPSHOT_ALREADY_EXISTS",
        },
      }),
    });
    const missingClient = createSupabaseComprehensiveReportSnapshotClient({
      rpcExecutor: async () => ({ data: [], error: null }),
    });
    const input = {
      reportId: "report_snapshot_client_test",
      providerOrderId: "provider_order_snapshot_client_test",
      draft: createDraft(),
      generationModel: "fixture-model",
    };

    await expect(
      errorClient.saveComprehensiveReportDraftSnapshot(input),
    ).rejects.toMatchObject({
      code: "REPORT_SNAPSHOT_ALREADY_EXISTS",
    });
    await expect(
      missingClient.saveComprehensiveReportDraftSnapshot(input),
    ).rejects.toMatchObject({
      code: "REPORT_SNAPSHOT_RPC_VALIDATION_FAILED",
    });
  });

  it("does not expose report snapshot or private fields in mapped result", async () => {
    const client = createSupabaseComprehensiveReportSnapshotClient({
      rpcExecutor: async () => ({
        data: [
          {
            ...createRow(),
            ["report" + "_snapshot"]: { hidden: true },
            ["provider" + "_payment" + "_id"]: "hidden_provider_payment_id",
            ["input" + "_snapshot"]: { hidden: true },
            ["share" + "Token"]: "hidden_share_token",
            ["access" + "TokenHash"]: "hidden_access_hash",
          },
        ],
        error: null,
      }),
    });
    const result = await client.saveComprehensiveReportDraftSnapshot({
      reportId: "report_snapshot_client_test",
      providerOrderId: "provider_order_snapshot_client_test",
      draft: createDraft(),
      generationModel: "fixture-model",
    });
    const serialized = JSON.stringify(result);

    expect(Object.keys(result)).not.toContain("reportSnapshot");
    expect(serialized).not.toContain("hidden_provider_payment_id");
    expect(serialized).not.toContain("input" + "_snapshot");
    expect(serialized).not.toContain("hidden_share_token");
    expect(serialized).not.toContain("hidden_access_hash");
  });

  it("source uses RPC only and avoids direct report table updates", () => {
    const source = readSource(
      "src/lib/report-persistence/supabaseComprehensiveReportSnapshotClient.ts",
    );
    const requiredMarkers = [
      ".rpc(",
      "save_comprehensive_report_draft_snapshot",
      "p_report_id",
      "p_provider_order_id",
      "p_report_snapshot",
      "p_generation_model",
      "p_generation_version",
    ];
    const blockedMarkers = [
      ".from(",
      "." + "update(",
      "reports",
      "readonly report" + "_snapshot",
      "reportSnapshot",
      "provider" + "PaymentId",
      "input" + "Snapshot",
      "share" + "Token",
      "access" + "TokenHash",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }
    for (const marker of blockedMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
