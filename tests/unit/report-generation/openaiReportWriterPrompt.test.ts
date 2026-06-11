import { describe, expect, it } from "vitest";

import { buildOpenAIComprehensiveReportWriterMessages } from "../../../src/lib/report-generation/openaiReportWriterPrompt";
import { buildComprehensiveReportEvidencePacketFromComputedFacts } from "../../../src/lib/report-knowledge/comprehensiveReportEvidenceInputBuilder";
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

describe("OpenAI report writer prompt", () => {
  it("builds Saju-first instructions with the evidence packet JSON", () => {
    const { packet } = buildComprehensiveReportEvidencePacketFromComputedFacts({
      mbtiType: "ENTJ",
      sajuFacts: deokminSampleFacts,
    });
    const messages = buildOpenAIComprehensiveReportWriterMessages({
      userDisplayName: "덕민",
      mbtiType: "ENTJ",
      evidencePacket: packet,
    });
    const combined = [messages.system, messages.developer, messages.user].join("\n");

    expect(combined).toContain("사주가 1차 근거");
    expect(combined).toContain("MBTI는 보조 근거");
    expect(combined).toContain("ENTJ라서 그렇다 금지");
    expect(combined).toContain("Use only provided evidence");
    expect(combined).toContain("Do not invent Saju facts");
    expect(combined).toContain("evidence에 없는 신살/귀인/십성/오행/일주 금지");
    expect(combined).toContain("display 섹션은 짧게");
    expect(combined).toContain("내부 사정 언급 금지");
    expect(combined).toContain("팩폭은 하되 모욕 금지");
    expect(combined).toContain("같은 근거를 섹션별로 다르게 풀어라");
    expect(combined).toContain("공통점");
    expect(combined).toContain("차이점");
    expect(combined).toContain("보완점");
    expect(combined).toContain("정확한 날짜 예언 금지");
    expect(combined).toContain("Korean output");
    expect(combined).toContain('"mbtiType": "ENTJ"');
    expect(combined).toContain("day_master_gabmok");
  });

  it("does not include private payment or OpenAI key markers in prompt text", () => {
    const { packet } = buildComprehensiveReportEvidencePacketFromComputedFacts({
      mbtiType: "ENTJ",
      sajuFacts: deokminSampleFacts,
    });
    const messages = buildOpenAIComprehensiveReportWriterMessages({
      mbtiType: "ENTJ",
      evidencePacket: packet,
    });
    const combined = [messages.system, messages.developer, messages.user].join("\n");
    const blockedMarkers = [
      "payment" + "Key",
      "provider" + "PaymentId",
      "OPENAI" + "_API" + "_KEY",
    ];

    for (const marker of blockedMarkers) {
      expect(combined).not.toContain(marker);
    }
  });
});
