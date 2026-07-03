import { describe, expect, it } from "vitest";

import { buildCareerReportEvidence } from "../../../src/lib/report-knowledge/careerReportEvidence";
import {
  requireCareerReportFixture,
} from "../../../src/lib/report-knowledge/careerReportFixtures";
import {
  buildOpenAICareerReportWriterMessages,
} from "../../../src/lib/report-generation/openaiCareerReportWriterPrompt";

function buildMessages() {
  const fixture = requireCareerReportFixture("deokmin-career");
  const evidencePacket = buildCareerReportEvidence({
    fixtureId: fixture.id,
    person: fixture.person,
  });

  return buildOpenAICareerReportWriterMessages({ evidencePacket });
}

describe("openaiCareerReportWriterPrompt", () => {
  it("uses Myeongli as primary and MBTI as behavior layer", () => {
    const messages = buildMessages();

    expect(messages.developer).toContain("Myeongli is primary");
    expect(messages.developer).toContain("MBTI is a behavioral/style layer");
    expect(messages.developer).toContain("Do not scientifically equate MBTI and 사주");
    expect(messages.developer).toContain("MBTI는 보조 evidence지만 체감 문장에는 적극 반영한다");
    expect(messages.developer).toContain("bridgeEvidence.forbiddenAngles");
  });

  it("keeps career money study product policy centered on innate work style", () => {
    const messages = buildMessages();

    expect(messages.developer).toContain("타고난 직업성 중심");
    expect(messages.developer).toContain("현재 직업 중심의 직무 평가 리포트로 만들지 않는다");
    expect(messages.developer).toContain("현재 직업, fieldLabel, lifeStatus는 적합도 비교용");
    expect(messages.developer).toContain("돈/투자/공부 전략은 성향, 명리 구조, 실제 생활 장면");
  });

  it("requires the stronger Gyeol writing tone and avoids weak filler", () => {
    const messages = buildMessages();

    expect(messages.developer).toContain("직접적이고 구체적인 한국어");
    expect(messages.developer).toContain("\"너 이렇지?\"");
    expect(messages.developer).toContain("강함 70 / 부드러움 20 / 안전장치 10");
    expect(messages.developer).toContain("약한 가능성 표현을 줄이고");
    expect(messages.developer).toContain("가능성이 있습니다");
    expect(messages.developer).toContain("그럴 수 있습니다");
    expect(messages.developer).toContain("도움이 될 수 있습니다");
    expect(messages.developer).toContain("중요할 수 있습니다");
  });

  it("requires actual job titles and less suitable jobs", () => {
    const messages = buildMessages();

    expect(messages.developer).toContain("Recommend actual job titles");
    expect(messages.developer).toContain("unsuitableJobs");
    expect(messages.developer).toContain("서비스 기획자");
    expect(messages.developer).toContain("PM/PO");
  });

  it("requires direct money and investment style with safety boundaries", () => {
    const messages = buildMessages();

    expect(messages.developer).toContain("Explain money earning style directly");
    expect(messages.developer).toContain("Explain investment and saving style directly but safely");
    expect(messages.developer).toContain("Do not recommend specific stocks or tickers");
    expect(messages.developer).toContain("매수하세요");
    expect(messages.developer).toContain("financial disclaimer");
    expect(messages.developer).toContain("금융 자문이 아닙니다");
  });

  it("embeds only the evidence packet in user message", () => {
    const messages = buildMessages();

    expect(messages.user).toContain("career_money_study");
    expect(messages.user).toContain("recommendedJobs");
    expect(messages.user).toContain("investmentProfile");
    expect(messages.user).toContain("bridgeEvidence");
    expect(messages.user).toContain('"productKey": "careerMoneyStudy"');
    expect(messages.system).toContain("career_money_study_report_draft");
  });

  it("forbids turning bridge angles into career guarantees", () => {
    const messages = buildMessages();

    expect(messages.developer).toContain("bridgeEvidence.primaryEvidence in core paragraphs");
    expect(messages.developer).toContain("bridgeEvidence.supportingEvidence as secondary support");
    expect(messages.developer).toContain("bridgeEvidence.cautionEvidence in risk");
    expect(messages.developer).toContain("수익 보장");
    expect(messages.developer).toContain("확정 수익");
    expect(messages.developer).toContain("합격 보장");
    expect(messages.developer).toContain("취업 보장");
    expect(messages.developer).toContain("연봉 보장");
    expect(messages.developer).toContain("직업 성공 보장");
    expect(messages.developer).toContain("질병/사고/사망 확정");
    expect(messages.developer).toContain("Never turn bridgeEvidence.forbiddenAngles");
  });

  it("keeps dense body structure and keyword block guidance", () => {
    const messages = buildMessages();

    expect(messages.developer).toContain("카드를 과도하게 쪼개지 않는다");
    expect(messages.developer).toContain("문단 밀도를 살린다");
    expect(messages.developer).toContain("키워드 블록은 유지한다");
    expect(messages.developer).toContain("직업/돈/투자/공부를 분리하되 같은 성향 흐름");
  });
});
