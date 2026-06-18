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

  it("uses user context for scene translation without changing calculations", () => {
    const prompt = buildMessagesText();

    expect(prompt).toContain("userContext");
    expect(prompt).toContain("contextTranslationHints");
    expect(prompt).toContain("Use userContext.lifeStatus");
    expect(prompt).toContain("Do not change calculations based on userContext");
    expect(prompt).toContain("All six domains must still appear");
    expect(prompt).toContain("일·성과, 돈·현실, 인간관계, 연애·가족, 학업·자격증, 몸·생활 리듬");
    expect(prompt).toContain("Still preserve each domain's identity");
    expect(prompt).toContain("Employee context should not make every domain work-only");
    expect(prompt).toContain("연인, 가족, 부모, 집안");
    expect(prompt).toContain("수면, 식사, 피로, 회복");
    expect(prompt).toContain("Do not ask the user to choose a focus area");
    expect(prompt).toContain("If employee");
    expect(prompt).toContain("보고서");
    expect(prompt).toContain("If student");
    expect(prompt).toContain("과제 제출");
    expect(prompt).toContain("If business_owner");
    expect(prompt).toContain("고객 응대");
    expect(prompt).toContain("If exam_certificate");
    expect(prompt).toContain("오답노트");
    expect(prompt).not.toContain("interestArea");
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
    expect(prompt).toContain("상반기");
    expect(prompt).toContain("하반기");
    expect(prompt).toContain("currentDate");
  });

  it("requires monthly seeds, flow index wording, and concrete event candidates", () => {
    const prompt = buildMessagesText();

    expect(prompt).toContain("monthlyFortuneSeeds");
    expect(prompt).toContain("monthlyFlow must use provided monthlyFortuneSeeds");
    expect(prompt).toContain("Do not invent monthly ganji");
    expect(prompt).toContain("calendar_month_approximation");
    expect(prompt).toContain("월별 운영 가이드");
    expect(prompt).toContain("monthGanji.ganji");
    expect(prompt).toContain("natalInteractionSummary");
    expect(prompt).toContain("one concrete work/money/relationship/study/health scene");
    expect(prompt).toContain("flowIndex");
    expect(prompt).toContain("flowTypeLabel");
    expect(prompt).toContain("flowIndexCaution");
    expect(prompt).toContain("flow indicator");
    expect(prompt).toContain("직장");
    expect(prompt).toContain("프로젝트");
    expect(prompt).toContain("정산");
    expect(prompt).toContain("자격증");
    expect(prompt).toContain("수면");
    expect(prompt).toContain("연락");
  });

  it("requires key signal balance when evidence supports it", () => {
    const prompt = buildMessagesText();

    expect(prompt).toContain("If evidence difficultySignals exist");
    expect(prompt).toContain("type difficulty");
    expect(prompt).toContain("If evidence opportunitySignals exist");
    expect(prompt).toContain("type opportunity");
    expect(prompt).toContain("type mixed");
    expect(prompt).toContain("기회 신호, 양면 신호, 부담 신호, 주의 신호, 연결 신호");
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
