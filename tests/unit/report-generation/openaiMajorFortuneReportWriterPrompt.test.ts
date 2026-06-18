import { describe, expect, it } from "vitest";

import { buildMajorFortuneEvidence } from "../../../src/lib/report-knowledge/majorFortuneEvidence";
import {
  requireMajorFortuneFixture,
} from "../../../src/lib/report-knowledge/majorFortuneFixtures";
import {
  buildOpenAIMajorFortuneReportWriterMessages,
} from "../../../src/lib/report-generation/openaiMajorFortuneReportWriterPrompt";

function promptText(): string {
  const fixture = requireMajorFortuneFixture("deokmin-current-major-fortune");
  const packet = buildMajorFortuneEvidence({
    fixtureId: fixture.id,
    currentYear: fixture.currentYear,
    person: fixture.person,
  });
  const messages = buildOpenAIMajorFortuneReportWriterMessages({
    evidencePacket: packet,
  });

  return `${messages.system}\n${messages.developer}\n${messages.user}`;
}

describe("openaiMajorFortuneReportWriterPrompt", () => {
  it("requires evidence-only major fortune writing", () => {
    const text = promptText();

    expect(text).toContain("Use only provided evidence");
    expect(text).toContain("Do not invent major fortune cycles");
    expect(text).toContain("Do not change ganji");
    expect(text).toContain("Do not create additional 대운 cycles");
  });

  it("defines 대운 as a 10-year background", () => {
    const text = promptText();

    expect(text).toContain("대운은 10년짜리 인생 배경");
    expect(text).toContain("세운은 선택한 1년의 흐름");
    expect(text).toContain("Interpret as long-term repeated themes");
    expect(text).toContain("Do not write the report like an annual fortune");
    expect(text).toContain("대운은 특정 사건 예언이 아니라 10년짜리 구조와 반복 패턴");
  });

  it("requires phase timeline and strong years explanation", () => {
    const text = promptText();

    expect(text).toContain("phaseTimeline must contain exactly three items");
    expect(text).toContain("early, middle, late");
    expect(text).toContain("초반 1~3년");
    expect(text).toContain("중반 4~7년");
    expect(text).toContain("후반 8~10년");
    expect(text).toContain("strongYears must use provided strongYearsWithinCycle");
    expect(text).toContain("Strong years must explain why that year is strong");
    expect(text).toContain("Strong years are TOP highlights only");
    expect(text).toContain("특히 강하게 체감될 수 있는 해 TOP 5");
  });

  it("requires 10-year repeated themes in every main chapter", () => {
    const text = promptText();

    expect(text).toContain("Each main chapter must explain");
    expect(text).toContain("10년 동안 반복될 장기 장면");
    expect(text).toContain("less exhaustingly");
    expect(text).toContain("bigThemes must contain 3 to 5 items");
    expect(text).toContain("Use fewer but deeper sections");
  });

  it("requires full ten-year timeline and separates highlights", () => {
    const text = promptText();

    expect(text).toContain("cycleYearTimeline must contain exactly 10 items");
    expect(text).toContain("The full 10-year timeline must appear");
    expect(text).toContain("Strong years are TOP highlights only");
    expect(text).toContain("Do not use currentCycle.index as a score");
  });

  it("requires concrete scenes and all six domains", () => {
    const text = promptText();

    expect(text).toContain("All six domains must appear");
    expect(text).toContain("일·성과");
    expect(text).toContain("돈·현실");
    expect(text).toContain("인간관계");
    expect(text).toContain("연애·가족");
    expect(text).toContain("학업·자격증");
    expect(text).toContain("몸·생활 리듬");
    expect(text).toContain("Concrete scenes must name domains");
  });

  it("uses userContext as translation layer only", () => {
    const text = promptText();

    expect(text).toContain("Use userContext.lifeStatus");
    expect(text).toContain("translation layer");
    expect(text).toContain("Do not change calculations based on userContext");
  });

  it("requires plain Korean metaphors for technical terms", () => {
    const text = promptText();

    expect(text).toContain("Every 명리 term must be translated");
    expect(text).toContain("비견: 내 기준을 세우고");
    expect(text).toContain("토 과다: 해야 할 일");
    expect(text).toContain("충: 이미 굳어 있던 방향");
    expect(text).toContain("육합: 사람·일정·역할");
  });

  it("forbids hard claims and raw fixture/precomputed wording", () => {
    const text = promptText();

    expect(text).toContain("Forbidden hard claims");
    expect(text).toContain("반드시");
    expect(text).toContain("Never write fixture_precomputed");
    expect(text).toContain("사전 계산된 대운표 기준");
  });
});
