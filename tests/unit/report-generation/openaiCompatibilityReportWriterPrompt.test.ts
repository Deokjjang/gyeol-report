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
    expect(promptText).toContain(
      "v1 관계 유형은 연애, 결혼/장기연애, 썸, 친구, 가족, 동업/업무 파트너만 지원한다.",
    );
    expect(promptText).toContain("love=연애");
    expect(promptText).toContain("marriage=결혼/장기연애");
    expect(promptText).toContain("some=썸");
    expect(promptText).toContain("friendship=친구");
    expect(promptText).toContain("family=가족");
    expect(promptText).toContain("business_work_partner=동업/업무 파트너");
    expect(promptText).toContain("business_work_partner는 동업/업무 파트너 관계");
    expect(promptText).toContain(
      "family/business_work_partner/friendship에서는 연애, 데이트, 애인, 설렘 같은 표현을 쓰지 마라.",
    );
    expect(promptText).toContain(
      "For business_work_partner, never use dating or romance language.",
    );
    expect(promptText).toContain(
      "For family/friendship, never use dating or romance language.",
    );
    expect(promptText).toContain(
      "love/some/marriage에서는 업무 파트너처럼만 해석하지 마라.",
    );
    expect(promptText).toContain(
      "relationshipType에 맞지 않는 score label이나 chapter wording을 만들지 마라.",
    );
    expect(promptText).toContain("MBTI");
    expect(promptText).toContain(
      "finalAdvice must be concrete, today-actionable, and relationship-specific.",
    );
    expect(promptText).toContain("Avoid generic finalAdvice like \"서로 이해하세요\".");
    expect(promptText).toContain("Each finalAdvice item should name a situation");
    expect(promptText).toContain(
      "Do not repeat the same advice concept in more than two sections.",
    );
    expect(promptText).toContain("챕터마다 다른 명리학 레이어를 사용하라");
    expect(promptText).toContain("최소 5개 이상");
    expect(promptText).toContain("일간 관계");
    expect(promptText).toContain("서로에게 보이는 십성");
    expect(promptText).toContain("두 사람 오행 보완");
    expect(promptText).toContain("합쳐졌을 때 무거워지는 오행");
    expect(promptText).toContain("지지 삼합/반합/육합");
    expect(promptText).toContain("지지 충/해/형/파");
    expect(promptText).toContain("일지/배우자궁 관계");
    expect(promptText).toContain("월지/생활 리듬 관계");
    expect(promptText).toContain("MBTI 대화 리듬");
    expect(promptText).toContain(
      "천을귀인, 재고귀인, 원진살, MBTI 속도 차이만 반복하지 마라",
    );
    expect(promptText).toContain(
      "attraction: day master relation + cross ten-god + branch trine.",
    );
    expect(promptText).toContain(
      "money_lifestyle: combined earth + 재고귀인.",
    );
    expect(promptText).toContain("명리학 용어를 쓸 때는 반드시");
    expect(promptText).toContain("계산값만 말하지 마라");
    expect(promptText).toContain(
      "Deep interpretation must match the actual relationLabel.",
    );
    expect(promptText).toContain(
      "Do not reuse 갑목/정화 examples unless the actual relation is 갑목/정화.",
    );
    expect(promptText).toContain(
      "Do not explain 상관/정인 unless the actual relationLabel contains 상관/정인.",
    );
    expect(promptText).toContain("갑목이 정화를 생합니다");
    expect(promptText).toContain("상관/정인 관계입니다");
    expect(promptText).toContain("丑未 충이 있습니다");
    expect(promptText).toContain(
      "Every chapter should contain at least one sentence",
    );
    expect(promptText).toContain(
      "Do not expose English/internal labels like mutual element complement",
    );
    expect(promptText).toContain("Translate all relation labels into Korean");
    expect(promptText).toContain("반복될 수 있는 장면");
    expect(promptText).toContain("keyCompatibilityPoints는 각 그룹 2~3개 이내");
    expect(promptText).toContain("opening key points should be concise");
    expect(promptText).toContain("finalAdvice labels must match content");
    expect(promptText).toContain("If the label is 도움 요청");
    expect(promptText).toContain("label the concept as 갈등 회복");
    expect(promptText).toContain("목·금가");
    expect(promptText).toContain("목·금이 약해");
    expect(promptText).toContain("화·수가 약해");
    expect(promptText).toContain("충가 있어");
    expect(promptText).toContain("목과 금의 흐름이");
    expect(promptText).toContain("화와 수의 흐름이 약해");
    expect(promptText).toContain("충이 있어");
    expect(promptText).toContain(
      "Safety notes must not mention internal policy terms like diagnostic-only, 진단용, evidence, or debug.",
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
