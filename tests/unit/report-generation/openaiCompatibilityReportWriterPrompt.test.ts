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
      "v1 관계 유형은 love, marriage, parentChild, coworker, managerReport, businessPartner, friendship 7개 canonical category만 지원한다.",
    );
    expect(promptText).toContain("love=연애");
    expect(promptText).toContain("marriage=결혼");
    expect(promptText).toContain("parentChild=부모·자식");
    expect(promptText).toContain("coworker=직장 동료");
    expect(promptText).toContain("managerReport=상사·부하");
    expect(promptText).toContain("businessPartner=사업/협업");
    expect(promptText).toContain("friendship=친구");
    expect(promptText).toContain("legacy category인 some, family, business_work_partner는 출력하지 마라.");
    expect(promptText).toContain("directFindings는 매운맛 핵심 근거");
    expect(promptText).toContain("궁합은 좋게만 돌려 말하지 않는다");
    expect(promptText).toContain("표와 요약은 짧게 쓴다. 본문은 장면, 이유, 비용, 조율 조건을 길고 구체적으로 풀어 쓴다.");
    expect(promptText).toContain("본문은 짧은 템플릿 나열이 아니라 유료 리포트처럼 읽히는 문단 중심으로 쓴다.");
    expect(promptText).toContain("MBTI source DB와 mbtiCompatibility의 성향 근거는 원문을 복붙하지 말고");
    expect(promptText).toContain("reportLine, lovePattern, marriagePattern, sharedGround, friction, repairStrategy");
    expect(promptText).toContain("ENTJ×INTP처럼 pair data가 있는 조합");
    expect(promptText).toContain("명리 근거는 표에 보이는 일간, 일지, 오행, 십성, 합충형파해, 신살/귀인을 관계 장면으로 번역하라.");
    expect(promptText).toContain("elementComplementSignals, sharedWeakElementSignals, overloadedElementSignals");
    expect(promptText).toContain("raw label만 단독으로 쓰지 마라");
    expect(promptText).toContain("대화 흐름, 성장 압박, 생활 운영 충돌, 누적 피로");
    expect(promptText).toContain("리스크 관리는 raw signal 목록이 아니라 해석 제목, 설명, 관리 방법");
    expect(promptText).toContain("A가 B에게 주는 피로와 B가 A에게 주는 피로를 분리");
    expect(promptText).toContain("A가 해결이라고 생각하는 말이 B에게 압박으로 들리는 장면");
    expect(promptText).toContain("서로의 장점이 어떻게 상대를 살릴 수 있는지와, 같은 장점이 어떻게 상대를 지치게 만들 수 있는지");
    expect(promptText).toContain("명리는 관계 구조, 반복 패턴");
    expect(promptText).toContain("MBTI는 대화 방식, 반응 속도");
    expect(promptText).toContain("명리와 MBTI를 같은 근거로 단정하지 마라");
    expect(promptText).toContain("relationshipAnalysis는 필수다");
    expect(promptText).toContain("aToBFatigue");
    expect(promptText).toContain("bToAFatigue");
    expect(promptText).toContain(
      "Different relationship types must not reuse the same report structure verbatim.",
    );
    expect(promptText).toContain(
      "relationshipType must control score labels, finalAdvice labels, scene vocabulary, and safety notes.",
    );
    expect(promptText).toContain(
      "For love, write as a romantic relationship",
    );
    expect(promptText).toContain(
      "For marriage, write as a long-term living and commitment relationship",
    );
    expect(promptText).toContain("For parentChild, write as expectation");
    expect(promptText).toContain("For coworker, write as work speed");
    expect(promptText).toContain("For managerReport, write as instruction");
    expect(promptText).toContain("For businessPartner, write as money");
    expect(promptText).toContain(
      "For friendship, write as distance, help, and conversation",
    );
    expect(promptText).toContain(
      "parentChild/coworker/managerReport/businessPartner/friendship에서는 연애, 데이트, 애인, 설렘 같은 표현을 쓰지 마라.",
    );
    expect(promptText).toContain(
      "For businessPartner/coworker/managerReport, never use dating or romance language.",
    );
    expect(promptText).toContain(
      "For parentChild/friendship, never use dating or romance language.",
    );
    expect(promptText).toContain(
      "love/marriage에서는 업무 파트너처럼만 해석하지 마라.",
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
    expect(promptText).toContain(
      "finalAdvice labels must belong to the relationship type.",
    );
    expect(promptText).toContain("If the label is 도움 요청");
    expect(promptText).toContain(
      "relationshipType controls finalAdvice labels.",
    );
    expect(promptText).toContain(
      "Never use business labels in love finalAdvice.",
    );
    expect(promptText).toContain(
      "love/marriage must not use 피드백 규칙, 의사결정, 신뢰 관리, or 업무 기준",
    );
    expect(promptText).toContain(
      "businessPartner/coworker/managerReport finalAdvice labels should use 의사결정, 역할 분담, 돈과 자원, 피드백 규칙, 갈등 조정, 신뢰 관리, 업무 기준.",
    );
    expect(promptText).toContain(
      "Never use romance vocabulary in parentChild/coworker/managerReport/businessPartner/friendship.",
    );
    expect(promptText).toContain(
      "For businessPartner/coworker/managerReport, use 협업/역할/책임/권한/피드백/기록 language.",
    );
    expect(promptText).toContain(
      "For parentChild, use 가족/생활/정서/말의 통로/역할 language.",
    );
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
    expect(promptText).toContain("businessPartner는 수익/손실 확정 금지");
    expect(promptText).toContain("friendship은 관계 단절 확정 금지");
    expect(promptText).toContain("Never output 빈 오행.");
    expect(promptText).toContain("finalAdvice labels must be unique where possible.");
    expect(promptText).toContain(
      "Do not prefix a finalAdvice body with another label such as 갈등 회복: or 도움 요청:.",
    );
    expect(promptText).toContain("업무/파트너십 어휘");
    expect(promptText).toContain("가족/생활 어휘");
    expect(promptText).toContain("정화을");
    expect(promptText).toContain("무토은");
    expect(promptText).toContain("표현의 온도이");
    expect(promptText).toContain("기준 정리이");
    expect(promptText).toContain("관리 부담가");
    expect(promptText).toContain("협업 시너지과");
    expect(promptText).toContain("Family A은");
    expect(promptText).toContain("Partner A은");
    expect(promptText).toContain("Partner A을");
    expect(promptText).toContain("Partner B을");
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
