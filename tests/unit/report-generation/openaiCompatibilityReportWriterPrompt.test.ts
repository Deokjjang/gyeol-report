import { describe, expect, it } from "vitest";

import {
  buildOpenAICompatibilityReportRepairMessages,
  buildOpenAICompatibilityReportWriterMessages,
} from "../../../src/lib/report-generation/openaiCompatibilityReportWriterPrompt";
import {
  buildCompatibilityEvidencePacketFromFixtureId,
} from "../../../src/lib/report-knowledge/compatibilityEvidenceBuilder";

describe("openaiCompatibilityReportWriterPrompt", () => {
  it("builds a policy prompt with score caution, chapter guide, and no candidate recommendation rule", () => {
    const packet = buildCompatibilityEvidencePacketFromFixtureId("deokmin-sodam-love");
    const messages = buildOpenAICompatibilityReportWriterMessages({
      evidencePacket: packet,
    });
    const promptText = `${messages.system}\n${messages.developer}\n${messages.user}`;

    expect(promptText).toContain("Use only provided compatibility evidence");
    expect(promptText).toContain("diagnostic-only feature");
    expect(promptText).toContain("백호대살");
    expect(promptText).toContain("어떤 경우에도 본문, 장면, 조언, 안전 안내에 쓰지 마라");
    expect(promptText).toContain("diagnostic-only 금지 용어");
    expect(promptText).toContain("overview:");
    expect(promptText).toContain("long_term_rules");
    expect(promptText).toContain("relationshipType");
    expect(promptText).toContain("MBTI");
    expect(promptText).toContain(
      "finalAdvice must be concrete, today-actionable, and relationship-specific.",
    );
    expect(promptText).toContain("Avoid generic finalAdvice like \"서로 이해하세요\".");
    expect(promptText).toContain("Each finalAdvice item should name a situation");
    expect(promptText).toContain(
      "Do not repeat the same advice concept in more than two sections.",
    );
  });

  it("builds repair instructions for unsafe copy, candidates, and unsupported terms", () => {
    const packet = buildCompatibilityEvidencePacketFromFixtureId("deokmin-sodam-love");
    const messages = buildOpenAICompatibilityReportRepairMessages({
      evidencePacket: packet,
      previousDraftText: "{}",
      validationErrors: [
        "UNSAFE_COMPATIBILITY_COPY: 운명 확정",
        "MBTI_CANDIDATE_RECOMMENDATION_NOT_ALLOWED: INFJ",
        "UNSUPPORTED_COMPATIBILITY_TERM: 백호대살",
      ],
    });

    expect(messages.developer).toContain("unsafe copy");
    expect(messages.developer).toContain("candidate MBTI recommendation");
    expect(messages.developer).toContain("UNSUPPORTED_COMPATIBILITY_TERM");
    expect(messages.developer).toContain("Remove every occurrence of \"백호대살\"");
    expect(messages.user).toContain("unsupported terms to remove");
    expect(messages.user).toContain("백호대살");
  });
});
