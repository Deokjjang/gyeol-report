import { describe, expect, it } from "vitest";

import { buildAnnualFortuneEvidence } from "../../../src/lib/report-knowledge/annualFortuneEvidence";
import {
  requireAnnualFortuneFixture,
} from "../../../src/lib/report-knowledge/annualFortuneFixtures";
import {
  buildOpenAIAnnualFortuneReportWriterMessages,
} from "../../../src/lib/report-generation/openaiAnnualFortuneReportWriterPrompt";

function buildMessagesText(): string {
  const fixture = requireAnnualFortuneFixture("deokmin-2026-current");
  const packet = buildAnnualFortuneEvidence({
    targetYear: fixture.targetYear,
    currentDate: new Date(`${fixture.currentDate}T00:00:00+09:00`),
    person: fixture.person,
  });
  const messages = buildOpenAIAnnualFortuneReportWriterMessages({
    evidencePacket: packet,
  });

  return `${messages.system}\n${messages.developer}\n${messages.user}`;
}

describe("openaiAnnualFortuneReportWriterPrompt", () => {
  it("requires evidence-only annual writing without calculation changes", () => {
    const prompt = buildMessagesText();

    expect(prompt).toContain("Use only provided evidence");
    expect(prompt).toContain("Do not invent pillars or ganji");
    expect(prompt).toContain("Do not change calculation results");
    expect(prompt).toContain("Do not manipulate calculation results");
  });

  it("requires concrete scenes and mode-specific tones", () => {
    const prompt = buildMessagesText();

    expect(prompt).toContain("Concrete scenes are required");
    expect(prompt).toContain("Past review mode rule");
    expect(prompt).toContain("Current year mode rule");
    expect(prompt).toContain("New year preview mode rule");
    expect(prompt).toContain("monthlyFlow must contain exactly 12 items");
  });

  it("forbids guaranteed outcomes and vague copy", () => {
    const prompt = buildMessagesText();

    expect(prompt).toContain("Do not guarantee outcomes");
    expect(prompt).toContain("반드시");
    expect(prompt).toContain("무조건");
    expect(prompt).toContain("합격합니다");
    expect(prompt).toContain("돈을 법니다");
    expect(prompt).toContain("올해는 책임이 커질 수 있습니다.");
    expect(prompt).toContain("Good example");
  });
});
