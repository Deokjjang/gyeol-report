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
    expect(messages.system).toContain("career_money_study_report_draft");
  });
});
