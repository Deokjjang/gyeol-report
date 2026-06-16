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

    expect(promptText).toContain("궁합은 성공/실패 판정이 아니다");
    expect(promptText).toContain("점수는 재미와 비교를 위한 요약값");
    expect(promptText).toContain("입력되지 않은 MBTI 유형 후보를 추천하지 마라");
    expect(promptText).toContain("overview:");
    expect(promptText).toContain("long_term_rules");
    expect(promptText).toContain("금지 표현");
    expect(promptText).toContain("운명");
    expect(promptText).toContain("사주×MBTI 궁합 리포트 v1.0");
    expect(promptText).toContain("짧은 문자열 요약");
    expect(promptText).toContain("같은 결론과 같은 조언 문장을 반복하지 마라");
    expect(promptText).toContain("연락 빈도");
    expect(promptText).toContain("누가 무엇을 하는지");
    expect(promptText).toContain("덕민은 \"그래서 어떻게 할까?\"");
    expect(promptText).toContain("functional chapter label처럼 쓰지 마라");
    expect(promptText).toContain("결론형 ENTJ와 검토형 INTP의 속도 차이");
    expect(promptText).toContain("조율형 궁합");
    expect(promptText).toContain("69점은 안 맞는 점수가 아니라");
    expect(promptText).toContain("relationshipType별 초점: love");
    expect(promptText).toContain("relationshipType별 초점: some");
    expect(promptText).toContain("relationshipType별 초점: marriage");
    expect(promptText).toContain("relationshipType별 초점: friendship");
    expect(promptText).toContain("오늘부터 할 일");
  });

  it("builds repair instructions for unsafe copy and candidate MBTI recommendation", () => {
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
    expect(messages.developer).toContain("입력된 두 MBTI 외 유형을 모두 제거");
  });
});
