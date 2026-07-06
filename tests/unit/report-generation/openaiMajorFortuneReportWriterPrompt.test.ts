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

  it("passes launch evidence, MBTI basis, and bridgeEvidence into the prompt", () => {
    const text = promptText();

    expect(text).toContain("currentMajorFortune");
    expect(text).toContain("tenYearFlowSummary");
    expect(text).toContain("currentAnnualCross");
    expect(text).toContain("domainFlows");
    expect(text).toContain("userContextReading");
    expect(text).toContain("currentConcern");
    expect(text).toContain("riskPatterns");
    expect(text).toContain("actionGuides");
    expect(text).toContain("mbtiBasis");
    expect(text).toContain("bridgeEvidence");
    expect(text).toContain('"productKey": "daeun"');
    expect(text).toContain('"reportUseCase": "daeunReport"');
    expect(text).toContain("10년 결과 보장");
  });

  it("prioritizes 대운 contract fields and treats MBTI as supporting evidence", () => {
    const text = promptText();

    expect(text).toContain("Evidence priority for this launch contract");
    expect(text).toContain("currentMajorFortune");
    expect(text).toContain("currentAnnualCross");
    expect(text).toContain("올해 세운은 현재 대운 위에 올라오는 단기 자극");
    expect(text).toContain("MBTI는 명리 흐름의 원인이 아니다");
    expect(text).toContain("행동 발현 방식");
    expect(text).toContain("Use bridgeEvidence.productKey === daeun as support only");
    expect(text).toContain("Never turn bridgeEvidence.forbiddenAngles into claims");
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
    expect(text).toContain("whyStrong must be interpretive copy");
    expect(text).toContain("not a slash-separated evidence list");
    expect(text).toContain("Strong year headlines must be unique");
    expect(text).toContain("Example 2029 己酉 whyStrong");
    expect(text).toContain("Example 2030 庚戌 whyStrong");
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
    expect(text).toContain("majorFortuneTimelineRows must be used");
    expect(text).toContain("majorGanji and annualGanji side by side");
    expect(text).toContain("The main body of this product is the 10-year year-by-year flow");
    expect(text).toContain("Each majorFortuneTimelineRows item must include yearDetail");
    expect(text).toContain("yearDetail must include exactly the four prose blocks");
    expect(text).toContain("coreFlow, realWorldScenes, cautionPoint, and actionStandard");
    expect(text).toContain("Do not write yearDetail as a checklist");
    expect(text).toContain("realWorldScenes blends work, money, relationship");
    expect(text).toContain("userContextReading");
    expect(text).toContain("Do not use field-assembly prose");
    expect(text).toContain("현실 장면은 따로 움직이지 않습니다");
    expect(text).toContain("Vary the MBTI angle by ten-god");
    expect(text).toContain("Do not output raw branch interaction labels alone");
    expect(text).toContain("Age labels in majorFortuneTimelineRows must use 한국나이 wording");
    expect(text).toContain("Highlight the current year row with 올해 badge");
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
    expect(text).toContain("Use userContextReading.currentRole");
    expect(text).toContain("not a calculation cause");
    expect(text).toContain("translation layer");
    expect(text).toContain("Use userContext.relationshipStatus");
    expect(text).toContain("Do not change calculations based on userContext");
    expect(text).toContain("If relationshipStatus is unknown");
    expect(text).toContain("handle it silently");
    expect(text).toContain("lifeStageContext, currentAge, lifeStatus, fieldLabel, and relationshipStatus");
  });

  it("requires aggressive strategic but non-deterministic interpretation", () => {
    const text = promptText();

    expect(text).toContain("Aggressive but non-deterministic examples");
    expect(text).toContain("가능성이 올라갑니다");
    expect(text).toContain("유리해집니다");
    expect(text).toContain("불리해집니다");
    expect(text).toContain("불리해질 수 있습니다");
    expect(text).toContain("접점이 늘어날 수 있습니다");
    expect(text).toContain("돈이 움직이는 장면이 늘어날 수 있습니다");
    expect(text).toContain("외부 프로젝트 가능성이 커질 수 있습니다");
    expect(text).toContain("관계가 현실 접점에서 열릴 수 있습니다");
    expect(text).toContain("편재 대운이라고 무조건 큰돈이 들어온다는 뜻은 아닙니다");
    expect(text).toContain("돈이 움직이는 접점이 늘어나는 흐름입니다");
    expect(text).toContain("생활 반경 안의 관계로 풀어라");
    expect(text).toContain("밀려날 수 있습니다");
    expect(text).toContain("직급은 그대로인데 책임만 먼저 커지는 상황");
    expect(text).toContain("수입 증가보다 고정지출");
    expect(text).toContain("프로젝트에서 큰 성과를 볼 가능성");
    expect(text).toContain("Do not say everything can happen");
    expect(text).toContain("how to respond");
    expect(text).toContain("Do not be timid");
    expect(text).toContain("serious but immersive 10-year strategy reading");
    expect(text).toContain("late 20s to mid 30s");
    expect(text).toContain("side-income windows");
    expect(text).toContain("Do not apply marriage, career, salary, or asset framing blindly to minors");
    expect(text).toContain("수익화 접점이 늘어날 수 있습니다");
    expect(text).toContain("이직·직무 전환을 검토하기 쉬운 흐름입니다");
    expect(text).toContain("결혼을 고민할 만한 압력이 커질 수 있습니다");
  });

  it("requires distinct big themes and year-specific strong-year strategies", () => {
    const text = promptText();

    expect(text).toContain("bigThemes must have distinct strategic angles");
    expect(text).toContain("Do not create two money/resource themes");
    expect(text).toContain("Bad: 돈과 자원 운용 / 역할과 책임 / 돈과 현실 구조");
    expect(text).toContain("Good: 돈과 자원 운용 / 역할과 책임 / 생활 리듬과 관계 경계");
    expect(text).toContain("one remaining theme must cover work-role and one must cover relationship/life/body boundary");
    expect(text).toContain("돈과 자원 운용");
    expect(text).toContain("생활 리듬과 관계 경계");
    expect(text).toContain("Strong year pushStrategy and reduceStrategy must be year-specific");
    expect(text).toContain("2027 丁未 · 일·성과");
    expect(text).toContain("2029 己酉 · 돈·현실관리");
    expect(text).toContain("과도한 보수성, 검토만 하다 놓치는 기회");
  });

  it("requires plain Korean metaphors for technical terms", () => {
    const text = promptText();

    expect(text).toContain("Every 명리 term must be translated");
    expect(text).toContain("Use expanded myeongliLayers");
    expect(text).toContain("ten-god, branch interaction, hidden stems, auxiliary stars");
    expect(text).toContain("Use auxiliary stars only when they add useful plain-life meaning");
    expect(text).toContain("Do not overload the report with 살 names");
    expect(text).toContain("생활 장면으로만 조심스럽게 참고합니다");
    expect(text).toContain("비견: 내 기준을 세우고");
    expect(text).toContain("토 과다: 해야 할 일");
    expect(text).toContain("충: 이미 굳어 있던 방향");
    expect(text).toContain("육합: 사람·일정·역할");
  });

  it("requires relationship-status-specific strategy without false certainty", () => {
    const text = promptText();

    expect(text).toContain("Relationship status rules");
    expect(text).toContain("single: 솔로탈출을 단정하지 말고");
    expect(text).toContain("dating: 일정, 돈, 연락 빈도");
    expect(text).toContain("married: 가족 비용");
    expect(text).toContain("single: 솔로라면, 이 대운은 감정만으로");
    expect(text).toContain("dating: 연애 중이라면, 감정보다 일정");
    expect(text).toContain("married: 기혼이라면, 집안 역할");
    expect(text).toContain("unknown: Do not expose the unknown status limitation");
    expect(text).toContain("Do not write 관계 상태가 미입력");
    expect(text).toContain("감정 자체보다 생활 반경");
    expect(text).not.toContain(["compli", "cated", ":"].join(""));
  });

  it("requires immersive final advice strategy blocks", () => {
    const text = promptText();

    expect(text).toContain("Each finalAdvice item body must be a real strategy block of 3 to 5 sentences");
    expect(text).toContain("what becomes more likely");
    expect(text).toContain("what to push");
    expect(text).toContain("what to avoid");
    expect(text).toContain("Do not write short generic finalAdvice summaries");
  });

  it("forbids hard claims and raw fixture/precomputed wording", () => {
    const text = promptText();

    expect(text).toContain("Forbidden hard claims");
    expect(text).toContain("반드시");
    expect(text).toContain("Never write fixture");
    expect(text).toContain("majorCycleBasis.displayLabel");
  });

  it("requires short Korean safety notes without internal terms", () => {
    const text = promptText();

    expect(text).toContain("safetyNotes must be an array of 2 to 4 short Korean strings");
    expect(text).toContain("Do not include internal terms in safetyNotes");
    expect(text).toContain("evidence, debug, fixture, precomputed, or schema");
    expect(text).toContain("이 리포트는 대운의 10년 배경과 반복 패턴을 해석한 것이며");
    expect(text).toContain("건강 관련 문장은 생활 리듬과 자기관리 관점");
  });

  it("forbids deterministic daeun claims in writer policy", () => {
    const text = promptText();

    expect(text).toContain("Forbidden daeun claims");
    expect(text).toContain("특정 사건/날짜 예언 금지");
    expect(text).toContain("질병·사고·사망 예언 금지");
    expect(text).toContain("투자 수익 보장 금지");
    expect(text).toContain("합격·승진·이직 확정 금지");
    expect(text).toContain("결혼·이혼 확정 금지");
    expect(text).toContain("공포 조장 금지");
  });
});
