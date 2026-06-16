import { describe, expect, it } from "vitest";

import type { CompatibilityReportDraft } from "../../../src/lib/report-generation/compatibilityReportDraftTypes";
import {
  CompatibilityReportWriterFailure,
  generateCompatibilityReportDraft,
} from "../../../src/lib/report-generation/openaiCompatibilityReportWriter";
import { compatibilityReportDraftJsonSchema } from "../../../src/lib/report-generation/compatibilityReportDraftSchema";
import {
  buildOpenAICompatibilityReportRepairMessages,
} from "../../../src/lib/report-generation/openaiCompatibilityReportWriterPrompt";
import {
  buildCompatibilityEvidencePacketFromFixtureId,
} from "../../../src/lib/report-knowledge/compatibilityEvidenceBuilder";

function createValidCompatibilityDraft(): CompatibilityReportDraft {
  const packet = buildCompatibilityEvidencePacketFromFixtureId("deokmin-sodam-love");

  return {
    version: "compatibility_v1_draft",
    productType: "saju_mbti_compatibility",
    productVersion: "1.0",
    relationshipType: "love",
    personALabel: "덕민",
    personBLabel: "소담",
    openingTitle: "서로 다른 속도가 끌림과 조율을 함께 만드는 궁합",
    openingSummary:
      "덕민님과 소담님은 천을귀인과 재고귀인을 함께 쓰지만, ENTJ와 INTP의 움직이는 속도가 다릅니다.",
    coreLine:
      "갑신일주와 정축일주의 차이는 빠른 구조화와 조용한 검토가 만나는 장면으로 드러납니다.",
    scoreSummary: packet.score,
    chartComparison: {
      personA: packet.personAChartSummary,
      personB: packet.personBChartSummary,
    },
    keyCompatibilityPoints: {
      attractionPoints: ["천을귀인과 재고귀인이 함께 있어 막힌 일을 같이 정리하는 힘이 있습니다."],
      strengthPoints: ["ENTJ의 실행력과 INTP의 원리 검토가 역할을 나누면 도움이 됩니다."],
      frictionPoints: ["한쪽은 빠른 결론, 한쪽은 조건 확인이 필요해 대화 속도가 어긋날 수 있습니다."],
      relationshipRules: ["중요한 결정은 결론 시간과 검토 시간을 따로 정해야 합니다."],
    },
    chapters: [
      "overview",
      "attraction",
      "strengths",
      "frictions",
      "communication",
      "relationship_scenes",
      "money_lifestyle",
      "conflict_recovery",
      "long_term_rules",
    ].map((id) => ({
      id: id as CompatibilityReportDraft["chapters"][number]["id"],
      title: `궁합 ${id}`,
      headline: "두 사람의 실제 리듬을 놓고 보는 장입니다.",
      body:
        "덕민님의 갑신일주와 소담님의 정축일주는 서로 다른 방식으로 관계를 정리합니다. ENTJ는 빨리 방향을 잡고, INTP는 조건과 예외를 확인한 뒤 움직일 때 안정됩니다.",
      directHitScenes: [
        "한쪽은 바로 결론을 내고 싶고, 한쪽은 원리와 조건을 더 확인해야 움직이는 장면이 반복될 수 있습니다.",
      ],
      practicalAdvice: ["중요한 대화는 결론, 검토, 실행 시간을 나누어 정하세요."],
    })),
    finalAdvice: [
      "오늘부터 중요한 이야기는 결론부터 밀지 말고 검토 시간을 함께 정하세요.",
      "돈과 일정은 각자의 방식으로 관리하되 공유 기준만 먼저 맞추세요.",
      "감정이 올라올 때는 바로 판단하지 말고 다음 대화 시간을 정하세요.",
    ],
    safetyNotes: [
      "이 점수는 관계의 성공이나 실패를 단정하는 값이 아니라 조정 지점을 보기 위한 참고입니다.",
    ],
  };
}

function openAIResponse(rawText: string): Response {
  return new Response(JSON.stringify({ output_text: rawText }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

describe("openaiCompatibilityReportWriter", () => {
  it("builds a compatibility request and returns a validated draft", async () => {
    const packet = buildCompatibilityEvidencePacketFromFixtureId("deokmin-sodam-love");
    const requests: unknown[] = [];
    const fetchImpl: typeof fetch = async (_url, init) => {
      requests.push(JSON.parse(String(init?.body)) as unknown);

      return openAIResponse(JSON.stringify(createValidCompatibilityDraft()));
    };

    const result = await generateCompatibilityReportDraft({
      evidencePacket: packet,
      config: {
        apiKey: "sk-test",
        model: "test-model",
        enabled: true,
        fetchImpl,
      },
    });

    expect(result.draft.version).toBe("compatibility_v1_draft");
    expect(result.draft.scoreSummary.totalScore).toBe(packet.score.totalScore);
    expect(result.draft.scoreSummary.scoreLabel).toBe("조율형 궁합");
    expect(result.draft.scoreSummary.scoreCaution).toContain(
      "안 맞는 점수가 아니라",
    );
    expect(result.repaired).toBe(false);
    const requestText = JSON.stringify(requests[0]);
    expect(requestText).toContain("saju_mbti_compatibility");
    expect(requestText).toContain("덕민");
    expect(requestText).toContain("소담");
    expect(requestText).toContain("json_schema");
    expect(requestText).toContain("\"strict\":true");
    expect(requestText).toContain("\"schema\"");
    expect(requestText).not.toContain("OPENAI_API_KEY");
    expect(requestText).not.toContain("Authorization");
    expect(requestText).not.toContain("sk-test");
    expect(compatibilityReportDraftJsonSchema.properties.chartComparison.properties.personA).toEqual({
      type: "string",
    });
  });

  it("exposes safe OpenAI request diagnostics without secrets", async () => {
    const packet = buildCompatibilityEvidencePacketFromFixtureId("deokmin-sodam-love");
    const fetchImpl: typeof fetch = async () =>
      new Response(
        JSON.stringify({
          error: {
            type: "invalid_request_error",
            code: "invalid_json_schema",
            message:
              "Invalid schema for response_format compatibility_report_draft. Authorization: Bearer sk-test",
            param: "text.format.schema",
          },
        }),
        {
          status: 400,
          headers: { "content-type": "application/json" },
        },
      );

    let caught: unknown;
    try {
      await generateCompatibilityReportDraft({
        evidencePacket: packet,
        config: {
          apiKey: "sk-test",
          model: "test-model",
          enabled: true,
          fetchImpl,
        },
      });
    } catch (error) {
      caught = error;
    }

    expect(caught).toBeInstanceOf(CompatibilityReportWriterFailure);
    const error = caught as CompatibilityReportWriterFailure;
    expect(error.code).toBe("OPENAI_REPORT_WRITER_REQUEST_FAILED");
    expect(error.diagnostics).toMatchObject({
      status: 400,
      errorType: "invalid_request_error",
      errorCode: "invalid_json_schema",
      errorParam: "text.format.schema",
      responseFormatName: "compatibility_report_draft",
      model: "test-model",
    });
    expect(error.message).toContain("Invalid schema for response_format");
    expect(error.message).toContain("schema approx chars:");
    expect(error.message).not.toContain("Authorization");
    expect(error.message).not.toContain("sk-test");
    expect(error.message).not.toContain("OPENAI_API_KEY");
  });

  it("uses repair when the first draft has unsafe or candidate recommendation copy", async () => {
    const packet = buildCompatibilityEvidencePacketFromFixtureId("deokmin-sodam-love");
    const unsafeDraft = {
      ...createValidCompatibilityDraft(),
      openingSummary: "천생연분 확정입니다. INFJ가 좋습니다.",
    };
    let callCount = 0;
    const fetchImpl: typeof fetch = async () => {
      callCount += 1;

      return openAIResponse(
        JSON.stringify(callCount === 1 ? unsafeDraft : createValidCompatibilityDraft()),
      );
    };

    const result = await generateCompatibilityReportDraft({
      evidencePacket: packet,
      config: {
        apiKey: "sk-test",
        model: "test-model",
        enabled: true,
        fetchImpl,
      },
    });

    expect(result.repaired).toBe(true);
    expect(callCount).toBe(2);
  });

  it("repair prompt handles unsafe copy and candidate recommendations without secrets", () => {
    const packet = buildCompatibilityEvidencePacketFromFixtureId("deokmin-sodam-love");
    const messages = buildOpenAICompatibilityReportRepairMessages({
      evidencePacket: packet,
      previousDraftText: "{}",
      validationErrors: [
        "UNSAFE_COMPATIBILITY_COPY: 천생연분 확정",
        "MBTI_CANDIDATE_RECOMMENDATION_NOT_ALLOWED: INFJ",
      ],
    });

    expect(messages.developer).toContain("unsafe copy");
    expect(messages.developer).toContain("candidate MBTI recommendation");
    expect(`${messages.system}${messages.developer}${messages.user}`).not.toContain(
      "sk-test",
    );
  });
});
