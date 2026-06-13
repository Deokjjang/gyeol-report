import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  generateComprehensiveReportDraft,
  isSafeReportGenerationError,
} from "../../../src/lib/report-generation/openaiComprehensiveReportWriter";
import type { ComprehensiveReportDraft } from "../../../src/lib/report-generation/comprehensiveReportDraftTypes";
import { buildComprehensiveReportEvidencePacketFromComputedFacts } from "../../../src/lib/report-knowledge/comprehensiveReportEvidenceInputBuilder";
import {
  COMPREHENSIVE_REPORT_SECTION_DEFINITIONS,
  type ComprehensiveReportSectionDefinition,
} from "../../../src/lib/report-knowledge/reportSectionSchema";
import type { ComputedSajuFacts } from "../../../src/lib/report-knowledge/sajuComputedFactsTypes";

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
  ],
  specialPatterns: ["jaeda_sinyak", "no_resource", "no_output"],
  sinsal: ["hyeonchim", "hongyeom"],
  gwiin: ["jaego"],
} as const satisfies ComputedSajuFacts;

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
      `${definition.titleKo}에서는 갑목과 갑신일주를 1차 근거로 삼고 ENTJ는 보조 근거로 연결합니다. ${definition.id} 항목은 같은 근거라도 다른 장면으로 풉니다.`,
    evidenceSummary: ["갑목", "갑신일주", "ENTJ"],
    sajuTermsUsed:
      definition.primaryBasis === "display" && isMbtiDisplay
        ? []
        : ["갑목", "갑신일주"],
    mbtiTermsUsed: isMbtiDisplay ? ["ENTJ", "Te/Ni"] : ["ENTJ"],
    cautionLevel: "medium" as const,
  };
}

function createValidDraft(): ComprehensiveReportDraft {
  return {
    version: "comprehensive_v1_draft",
    productType: "saju_mbti_full",
    tone: ["saju_first", "conversational"],
    openingTitle: "사주가 먼저 보이는 종합 리포트",
    openingSummary:
      "사주 원국의 구조를 먼저 놓고 MBTI는 체감되는 자기상을 보조로 연결합니다.",
    coreLine: "갑목 구조와 ENTJ 성향이 성취 쪽에서 만납니다.",
    sections: COMPREHENSIVE_REPORT_SECTION_DEFINITIONS.map(createSection),
    finalAdvice:
      "성과를 밀어붙이는 힘은 살리되, 휴식과 감정 표현은 의식적으로 보완해 주세요.",
    safetyNotes: ["자기이해용 참고 콘텐츠입니다."],
  };
}

function createPacket() {
  return buildComprehensiveReportEvidencePacketFromComputedFacts({
    mbtiType: "ENTJ",
    sajuFacts: deokminSampleFacts,
  }).packet;
}

function createJsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status });
}

async function expectSafeGenerationFailure(
  promise: Promise<unknown>,
): Promise<ReturnType<typeof expectSafeError>> {
  try {
    await promise;
  } catch (error) {
    return expectSafeError(error);
  }

  throw new Error("Expected safe report generation failure.");
}

function expectSafeError(error: unknown) {
  expect(isSafeReportGenerationError(error)).toBe(true);

  if (!isSafeReportGenerationError(error)) {
    throw new Error("Expected safe report generation error.");
  }

  return error;
}

describe("OpenAI comprehensive report writer", () => {
  it("builds prompt parses JSON validates draft and returns raw text", async () => {
    const draft = createValidDraft();
    const calls: RequestInit[] = [];
    const fetchImpl: typeof fetch = async (_input, init) => {
      if (init !== undefined) {
        calls.push(init);
      }
      return createJsonResponse({
        output_text: JSON.stringify(draft),
      });
    };

    const result = await generateComprehensiveReportDraft({
      userDisplayName: "덕민",
      mbtiType: "ENTJ",
      evidencePacket: createPacket(),
      config: {
        apiKey: "test_key",
        model: "test_model",
        enabled: true,
        fetchImpl,
      },
    });

    expect(result.draft).toEqual(draft);
    expect(result.rawText).toBe(JSON.stringify(draft));
    expect(result.warnings).toEqual([]);
    expect(JSON.stringify(calls[0].body)).toContain("사주가 1차 근거");
    expect(JSON.stringify(calls[0].body)).toContain("day_master_gabmok");
  });

  it("rejects invalid JSON responses", async () => {
    const error = await expectSafeGenerationFailure(
      generateComprehensiveReportDraft({
        mbtiType: "ENTJ",
        evidencePacket: createPacket(),
        config: {
          apiKey: "test_key",
          model: "test_model",
          enabled: true,
          fetchImpl: async () => createJsonResponse({ output_text: "not json" }),
        },
      }),
    );

    expect(error.code).toBe("OPENAI_REPORT_WRITER_INVALID_JSON");
    expect(error.stage).toBe("json_parse");
    expect(error.validationErrors).toEqual(["JSON_PARSE_FAILED"]);
  });

  it("exposes OpenAI request failures as openai stage", async () => {
    const error = await expectSafeGenerationFailure(
      generateComprehensiveReportDraft({
        mbtiType: "ENTJ",
        evidencePacket: createPacket(),
        config: {
          apiKey: "test_key",
          model: "test_model",
          enabled: true,
          fetchImpl: async () => createJsonResponse({ error: "failed" }, 500),
        },
      }),
    );

    expect(error.code).toBe("OPENAI_REPORT_WRITER_REQUEST_FAILED");
    expect(error.stage).toBe("openai");
  });

  it("rejects unsafe draft JSON", async () => {
    const draft = {
      ...createValidDraft(),
      finalAdvice: "이 구조는 " + "절대 " + "성공한다",
    };

    const error = await expectSafeGenerationFailure(
      generateComprehensiveReportDraft({
        mbtiType: "ENTJ",
        evidencePacket: createPacket(),
        config: {
          apiKey: "test_key",
          model: "test_model",
          enabled: true,
          fetchImpl: async () =>
            createJsonResponse({
              output_text: JSON.stringify(draft),
            }),
        },
      }),
    );

    expect(error.code).toBe("OPENAI_REPORT_WRITER_INVALID_JSON");
    expect(error.stage).toBe("draft_validation");
    expect(error.validationErrors?.join("\n")).toContain(
      "FORBIDDEN_PROPHECY_PHRASE",
    );
  });

  it("rejects unsupported Saju terms outside the evidence packet", async () => {
    const draft = {
      ...createValidDraft(),
      sections: createValidDraft().sections.map((section) =>
        section.sectionId === "love_relationship"
          ? {
              ...section,
              body:
                "갑목과 갑신일주를 먼저 보면서 도화살과 반안살까지 있다고 쓰면 evidence 밖의 사주 용어가 섞입니다.",
            }
          : section,
      ),
    };

    const error = await expectSafeGenerationFailure(
      generateComprehensiveReportDraft({
        mbtiType: "ENTJ",
        evidencePacket: createPacket(),
        config: {
          apiKey: "test_key",
          model: "test_model",
          enabled: true,
          fetchImpl: async () =>
            createJsonResponse({
              output_text: JSON.stringify(draft),
            }),
        },
      }),
    );

    expect(error.stage).toBe("draft_validation");
    expect(error.validationErrors?.join("\n")).toContain(
      "UNSUPPORTED_SAJU_TERM",
    );
  });

  it("rejects internal meta copy from model output", async () => {
    const draft = {
      ...createValidDraft(),
      openingSummary: "검증된 JSON으로 저장되는 내부 문장입니다.",
    };

    const error = await expectSafeGenerationFailure(
      generateComprehensiveReportDraft({
        mbtiType: "ENTJ",
        evidencePacket: createPacket(),
        config: {
          apiKey: "test_key",
          model: "test_model",
          enabled: true,
          fetchImpl: async () =>
            createJsonResponse({
              output_text: JSON.stringify(draft),
            }),
        },
      }),
    );

    expect(error.stage).toBe("draft_validation");
    expect(error.validationErrors?.join("\n")).toContain("INTERNAL_META_COPY");
  });

  it("does not include DB save payment or result render wiring in source", () => {
    const source = readFileSync(
      join(process.cwd(), "src/lib/report-generation/openaiComprehensiveReportWriter.ts"),
      "utf8",
    );
    const blockedMarkers = [
      "supabase",
      "payment",
      "reportId",
      "insert(",
      "update(",
      "fetch(\"/api/",
    ];

    for (const marker of blockedMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
