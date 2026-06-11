import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { generateComprehensiveReportDraft } from "../../../src/lib/report-generation/openaiComprehensiveReportWriter";
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
  const isMbtiDisplay =
    definition.id === "mbti_core" || definition.id === "mbti_table";

  return {
    sectionId: definition.id,
    titleKo: definition.titleKo,
    oneLine: `${definition.titleKo} 초안입니다.`,
    body:
      "갑목과 갑신일주를 1차 근거로 삼고 ENTJ는 보조 근거로 연결한 안전한 JSON 초안입니다.",
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
    openingTitle: "사주가 먼저 보이는 초안",
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
    await expect(
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
    ).rejects.toThrow("OPENAI_REPORT_WRITER_INVALID_JSON");
  });

  it("rejects unsafe draft JSON", async () => {
    const draft = {
      ...createValidDraft(),
      finalAdvice: "이 구조는 " + "절대 " + "성공한다",
    };

    await expect(
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
    ).rejects.toThrow("OPENAI_REPORT_WRITER_INVALID_JSON");
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
