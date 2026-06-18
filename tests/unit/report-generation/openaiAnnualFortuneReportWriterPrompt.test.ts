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
    expect(prompt).toContain("명리 계산값");
    expect(prompt).toContain("실제 생활 장면 후보 2개 이상");
    expect(prompt).toContain("왜 그렇게 체감될 수 있는지");
    expect(prompt).toContain("어떻게 쓰면 좋은지");
    expect(prompt).toContain("Past review mode rule");
    expect(prompt).toContain("Current year mode rule");
    expect(prompt).toContain("New year preview mode rule");
    expect(prompt).toContain("monthlyFlow must contain exactly 12 items");
    expect(prompt).toContain("일·성과");
    expect(prompt).toContain("돈·현실");
    expect(prompt).toContain("인간관계");
    expect(prompt).toContain("연애·가족");
    expect(prompt).toContain("학업·자격증");
    expect(prompt).toContain("몸·생활 리듬");
  });

  it("includes preparation-oriented current-year tone rules", () => {
    const prompt = buildMessagesText();

    expect(prompt).toContain("올해");
    expect(prompt).toContain("지금부터");
    expect(prompt).toContain("준비");
    expect(prompt).toContain("활용");
    expect(prompt).toContain("조율");
    expect(prompt).toContain("손실을 줄이기");
    expect(prompt).toContain("흐름을 쓰기");
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
