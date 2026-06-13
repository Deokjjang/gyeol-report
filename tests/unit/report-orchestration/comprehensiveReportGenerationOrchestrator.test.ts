import { readFileSync } from "node:fs";
import { join } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type {
  ComprehensiveReportV1Draft,
} from "../../../src/lib/report-generation/comprehensiveReportDraftTypes";
import {
  generateComprehensiveReportDraft,
  SafeReportGenerationFailure,
} from "../../../src/lib/report-generation/openaiComprehensiveReportWriter";
import {
  generateAndPersistComprehensiveReport,
  isSafeReportGenerationError,
} from "../../../src/lib/report-orchestration/comprehensiveReportGenerationOrchestrator";
import { saveComprehensiveReportDraftSnapshot } from "../../../src/lib/report-persistence/supabaseComprehensiveReportSnapshotAdapter";
import type { ComputedSajuFacts } from "../../../src/lib/report-knowledge/sajuComputedFactsTypes";
import {
  COMPREHENSIVE_REPORT_SECTION_DEFINITIONS,
  type ComprehensiveReportSectionDefinition,
} from "../../../src/lib/report-knowledge/reportSectionSchema";

vi.mock(
  "../../../src/lib/report-generation/openaiComprehensiveReportWriter",
  async () => {
    const actual = await vi.importActual<
      typeof import("../../../src/lib/report-generation/openaiComprehensiveReportWriter")
    >("../../../src/lib/report-generation/openaiComprehensiveReportWriter");

    return {
      ...actual,
      generateComprehensiveReportDraft: vi.fn(),
    };
  },
);

vi.mock(
  "../../../src/lib/report-persistence/supabaseComprehensiveReportSnapshotAdapter",
  () => ({
    saveComprehensiveReportDraftSnapshot: vi.fn(),
  }),
);

const mockGenerateComprehensiveReportDraft = vi.mocked(
  generateComprehensiveReportDraft,
);
const mockSaveComprehensiveReportDraftSnapshot = vi.mocked(
  saveComprehensiveReportDraftSnapshot,
);
const deokminSampleFacts = {
  dayMaster: "갑",
  dayPillar: "갑신",
  fiveElementCounts: {
    wood: 2,
    fire: 0,
    earth: 4,
    metal: 2,
    water: 0,
  },
  excessiveElements: ["earth"],
  missingElements: ["fire", "water"],
  usefulElements: ["water", "wood"],
  tenGodSignals: [
    { tenGod: "pian_cai", strength: "strong" },
    { tenGod: "zheng_cai", strength: "present" },
    { tenGod: "zheng_guan", strength: "strong" },
    { tenGod: "qi_sha", strength: "strong" },
    { tenGod: "zheng_yin", strength: "missing" },
    { tenGod: "shi_shen", strength: "missing" },
  ],
  specialPatterns: ["jaeda_sinyak", "no_resource", "no_output"],
  sinsal: ["hyeonchim", "hongyeom", "gwimun", "wonjin"],
  gwiin: ["jaego"],
} as const satisfies ComputedSajuFacts;

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
      `${definition.titleKo}에서는 갑목과 갑신일주를 먼저 놓고 ENTJ 성향은 보조 근거로 연결합니다. ${definition.id} 항목은 같은 근거라도 다른 장면으로 설명합니다.`,
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

function createInput(
  overrides: Partial<Parameters<typeof generateAndPersistComprehensiveReport>[0]> = {},
): Parameters<typeof generateAndPersistComprehensiveReport>[0] {
  return {
    userDisplayName: "덕민",
    mbtiType: "ENTJ",
    sajuFacts: deokminSampleFacts,
    reportId: "report_orchestration_test",
    providerOrderId: "provider_order_orchestration_test",
    openAI: {
      apiKey: "openai_secret_for_test",
      model: "test-report-model",
      enabled: true,
    },
    supabase: {
      url: "https://supabase.example.test",
      anonKey: "supabase_anon_for_test",
    },
    ...overrides,
  };
}

function setupSuccessfulMocks(): ComprehensiveReportV1Draft {
  const draft = createDraft();

  mockGenerateComprehensiveReportDraft.mockResolvedValue({
    draft,
    rawText: JSON.stringify(draft),
    warnings: ["writer warning"],
  });
  mockSaveComprehensiveReportDraftSnapshot.mockResolvedValue({
    reportId: "report_orchestration_test",
    providerOrderId: "provider_order_orchestration_test",
    productType: "saju_mbti_full",
    snapshotVersion: "comprehensive_v1_draft",
    generationModel: "test-report-model",
    status: "generated",
    createdAt: "2026-06-12T10:00:00.000Z",
    updatedAt: "2026-06-12T10:00:01.000Z",
  });

  return draft;
}

function readSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

async function expectSafeOrchestratorFailure(promise: Promise<unknown>) {
  try {
    await promise;
  } catch (error) {
    expect(isSafeReportGenerationError(error)).toBe(true);

    if (!isSafeReportGenerationError(error)) {
      throw new Error("Expected safe report generation error.");
    }

    return error;
  }

  throw new Error("Expected orchestrator to fail.");
}

describe("generateAndPersistComprehensiveReport", () => {
  beforeEach(() => {
    mockGenerateComprehensiveReportDraft.mockReset();
    mockSaveComprehensiveReportDraftSnapshot.mockReset();
  });

  it("builds evidence, calls writer, saves the snapshot, and returns safe metadata", async () => {
    const draft = setupSuccessfulMocks();
    const result = await generateAndPersistComprehensiveReport(createInput());
    const writerInput = mockGenerateComprehensiveReportDraft.mock.calls[0]?.[0];
    const saveInput = mockSaveComprehensiveReportDraftSnapshot.mock.calls[0]?.[0];
    const serialized = JSON.stringify(result);

    expect(writerInput?.userDisplayName).toBe("덕민");
    expect(writerInput?.mbtiType).toBe("ENTJ");
    expect(writerInput?.evidencePacket.mbtiType).toBe("ENTJ");
    expect(writerInput?.evidencePacket.sajuEntryIds).toEqual(
      expect.arrayContaining([
        "day_master_gabmok",
        "day_pillar_gapsin",
        "element_earth_excess",
        "element_fire_missing",
        "element_water_missing",
        "ten_god_pian_cai",
        "pattern_jaeda_sinyak",
        "sinsal_hyeonchim",
        "gwiin_jaego",
      ]),
    );
    expect(writerInput?.profileTable).toMatchObject({
      dayMaster: "갑목",
      dayPillar: "갑신일주",
      fiveElementSummary: ["목 2", "화 0", "토 4", "금 2", "수 0"],
      excessiveElements: ["토 과다"],
      missingElements: ["화 부족", "수 부족"],
      tenGodSummary: expect.arrayContaining(["편재", "정재", "정관", "편관"]),
      sinsal: expect.arrayContaining(["현침살", "홍염살", "귀문관살", "원진살"]),
      gwiin: expect.arrayContaining(["재고귀인"]),
      mbti: "ENTJ",
    });
    expect(writerInput?.config.model).toBe("test-report-model");
    expect(saveInput).toMatchObject({
      supabaseUrl: "https://supabase.example.test",
      supabaseAnonKey: "supabase_anon_for_test",
      reportId: "report_orchestration_test",
      providerOrderId: "provider_order_orchestration_test",
      draft,
      generationModel: "test-report-model",
    });
    expect(result).toMatchObject({
      reportId: "report_orchestration_test",
      providerOrderId: "provider_order_orchestration_test",
      productType: "saju_mbti_full",
      snapshotVersion: "comprehensive_v1_draft",
      status: "generated",
      generationModel: "test-report-model",
      sectionCount: COMPREHENSIVE_REPORT_SECTION_DEFINITIONS.length,
      coreLine: draft.coreLine,
      openingTitle: draft.openingTitle,
    });
    expect(result.warnings).toEqual(expect.arrayContaining(["writer warning"]));
    expect(serialized).not.toContain("openai_secret_for_test");
    expect(serialized).not.toContain("supabase_anon_for_test");
    expect(Object.keys(result)).not.toContain("draft");
    expect(Object.keys(result)).not.toContain("rawText");
    expect(serialized).not.toContain(draft.sections[0]?.body ?? "");
  });

  it("fails on missing report id before external boundaries", async () => {
    setupSuccessfulMocks();

    await expect(
      generateAndPersistComprehensiveReport(createInput({ reportId: "" })),
    ).rejects.toThrow("COMPREHENSIVE_REPORT_ORCHESTRATION_INVALID_REQUEST");
    expect(mockGenerateComprehensiveReportDraft).not.toHaveBeenCalled();
    expect(mockSaveComprehensiveReportDraftSnapshot).not.toHaveBeenCalled();
  });

  it("fails on missing provider order id before external boundaries", async () => {
    setupSuccessfulMocks();

    await expect(
      generateAndPersistComprehensiveReport(createInput({ providerOrderId: "" })),
    ).rejects.toThrow("COMPREHENSIVE_REPORT_ORCHESTRATION_INVALID_REQUEST");
    expect(mockGenerateComprehensiveReportDraft).not.toHaveBeenCalled();
    expect(mockSaveComprehensiveReportDraftSnapshot).not.toHaveBeenCalled();
  });

  it("fails safely when the OpenAI writer fails", async () => {
    mockGenerateComprehensiveReportDraft.mockRejectedValue(
      new Error("openai_secret_for_test"),
    );

    const error = await expectSafeOrchestratorFailure(
      generateAndPersistComprehensiveReport(createInput()),
    );

    expect(error.code).toBe("COMPREHENSIVE_REPORT_GENERATION_FAILED");
    expect(error.stage).toBe("openai");
    expect(error.causeCode).toBe("OPENAI_REPORT_WRITER_REQUEST_FAILED");
    expect(JSON.stringify(error)).not.toContain("openai_secret_for_test");
    expect(mockSaveComprehensiveReportDraftSnapshot).not.toHaveBeenCalled();
  });

  it("preserves draft validation diagnostics from the writer", async () => {
    mockGenerateComprehensiveReportDraft.mockRejectedValue(
      new SafeReportGenerationFailure({
        code: "OPENAI_REPORT_WRITER_INVALID_JSON",
        stage: "draft_validation",
        validationErrors: ["UNSUPPORTED_SAJU_TERM: 도화살"],
      }),
    );

    const error = await expectSafeOrchestratorFailure(
      generateAndPersistComprehensiveReport(createInput()),
    );

    expect(error).toMatchObject({
      code: "COMPREHENSIVE_REPORT_GENERATION_FAILED",
      stage: "draft_validation",
      causeCode: "OPENAI_REPORT_WRITER_INVALID_JSON",
      validationErrors: ["UNSUPPORTED_SAJU_TERM: 도화살"],
    });
    expect(mockSaveComprehensiveReportDraftSnapshot).not.toHaveBeenCalled();
  });

  it("preserves safe OpenAI request diagnostics from the writer", async () => {
    mockGenerateComprehensiveReportDraft.mockRejectedValue(
      new SafeReportGenerationFailure({
        code: "OPENAI_REPORT_WRITER_REQUEST_FAILED",
        stage: "openai",
        status: 400,
        errorType: "invalid_request_error",
        errorCode: "schema_invalid",
        diagnosticMessage: "Response format schema is invalid.",
        errorParam: "text.format.schema",
        requestId: "req_safe_123",
      }),
    );

    const error = await expectSafeOrchestratorFailure(
      generateAndPersistComprehensiveReport(createInput()),
    );

    expect(error).toMatchObject({
      code: "COMPREHENSIVE_REPORT_GENERATION_FAILED",
      stage: "openai",
      causeCode: "OPENAI_REPORT_WRITER_REQUEST_FAILED",
      status: 400,
      errorType: "invalid_request_error",
      errorCode: "schema_invalid",
      diagnosticMessage: "Response format schema is invalid.",
      errorParam: "text.format.schema",
      requestId: "req_safe_123",
    });
    expect(JSON.stringify(error)).not.toContain("openai_secret_for_test");
    expect(mockSaveComprehensiveReportDraftSnapshot).not.toHaveBeenCalled();
  });

  it("fails safely when snapshot persistence fails", async () => {
    setupSuccessfulMocks();
    mockSaveComprehensiveReportDraftSnapshot.mockRejectedValue(
      new Error("supabase_anon_for_test"),
    );

    const error = await expectSafeOrchestratorFailure(
      generateAndPersistComprehensiveReport(createInput()),
    );

    expect(error.code).toBe("COMPREHENSIVE_REPORT_SNAPSHOT_SAVE_FAILED");
    expect(error.stage).toBe("snapshot_save");
    expect(JSON.stringify(error)).not.toContain("supabase_anon_for_test");
  });

  it("source stays server orchestration only and avoids payment wiring", () => {
    const source = readSource(
      "src/lib/report-orchestration/comprehensiveReportGenerationOrchestrator.ts",
    );
    const requiredMarkers = [
      "buildComprehensiveReportEvidencePacketFromComputedFacts",
      "generateComprehensiveReportDraft",
      "validateComprehensiveReportDraft",
      "saveComprehensiveReportDraftSnapshot",
      "stage",
      "validationErrors",
    ];
    const blockedMarkers = [
      "confirmTossPayment",
      "/v1/" + "payments/confirm",
      "payment" + "Key",
      "provider" + "PaymentId",
      "input" + "Snapshot",
      "share" + "Token",
      "access" + "TokenHash",
      "OPENAI" + "_API" + "_KEY",
      "SUPABASE" + "_SERVICE" + "_ROLE",
      "service" + "_role",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }

    for (const marker of blockedMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
