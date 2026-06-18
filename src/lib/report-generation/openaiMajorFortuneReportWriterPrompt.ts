import type { MajorFortuneEvidencePacket } from "../report-knowledge/majorFortuneTypes";

export type OpenAIMajorFortuneReportWriterMessages = {
  readonly system: string;
  readonly developer: string;
  readonly user: string;
};

function formatList(values: readonly string[]): string {
  return values.length === 0 ? "- 없음" : values.map((value) => `- ${value}`).join("\n");
}

function buildPromptPacket(packet: MajorFortuneEvidencePacket): object {
  return {
    productType: packet.productType,
    productVersion: packet.productVersion,
    personLabel: packet.personLabel,
    userContext: packet.userContext,
    currentYear: packet.currentYear,
    currentAge: packet.currentAge,
    dayMaster: packet.dayMaster,
    userPillars: packet.userPillars,
    natalLabels: packet.natalLabels,
    currentCycle: packet.currentCycle,
    previousCycle: packet.previousCycle,
    nextCycle: packet.nextCycle,
    calculationBasis: packet.calculationBasis,
    majorTenGod: packet.majorTenGod,
    elementEffect: packet.elementEffect,
    branchInteractions: packet.branchInteractions,
    lifeAreaSignals: packet.lifeAreaSignals,
    difficultySignals: packet.difficultySignals,
    opportunitySignals: packet.opportunitySignals,
    transitionSignals: packet.transitionSignals,
    strongYearsWithinCycle: packet.strongYearsWithinCycle,
    cycleYearTimeline: packet.cycleYearTimeline,
    warnings: packet.warnings,
  };
}

export function buildOpenAIMajorFortuneReportWriterMessages(input: {
  readonly evidencePacket: MajorFortuneEvidencePacket;
}): OpenAIMajorFortuneReportWriterMessages {
  const evidenceJson = JSON.stringify(buildPromptPacket(input.evidencePacket), null, 2);

  return {
    system: [
      "You are writing a Korean paid Saju major fortune report.",
      "Use only provided evidence.",
      "Do not invent major fortune cycles.",
      "Do not change ganji, ten-god, elements, branch interactions, pillars, or cycle years.",
      "Do not guarantee outcomes.",
      "Write only valid JSON matching major_fortune_report_draft.",
      "Write in Korean.",
    ].join("\n"),
    developer: [
      "상품명은 대운 리포트 v1.0이다.",
      "대운은 10년짜리 인생 배경과 반복 테마를 보는 상품이다.",
      "Major fortune is a 10-year background, not a single-year event.",
      "Do not write the report like an annual fortune.",
      "Do not focus on one year.",
      "대운은 특정 사건 예언이 아니라 10년짜리 구조와 반복 패턴이다.",
      "대운은 작은 사건 예측보다 큰 흐름, 인생 배경, 역할 변화, 방향 전환, 반복 테마, 준비 전략을 먼저 보여줘야 한다.",
      "Make it read like an 인생 구조 리포트, not a monthly or annual forecast.",
      "Use fewer but deeper sections. Do not overload the draft with tiny one-time event details.",
      "세운은 선택한 1년의 흐름이고, 대운은 약 10년 단위로 반복되는 장기 배경이다.",
      "계산은 정직하게. 해석은 구체적으로. 문장은 용하게. 하지만 결과를 단정하지 않는다.",
      "Use only the provided major fortune evidence packet.",
      "Do not invent or alter currentCycle, previousCycle, nextCycle, majorTenGod, elementEffect, branchInteractions, transitionSignals, or strongYearsWithinCycle.",
      "Do not create additional 대운 cycles or change the startAge, endAge, startYear, endYear, ganji, stem, branch, ten-god, or element values.",
      "Use userContext.lifeStatus and userContext.fieldLabel only as a translation layer for concrete scenes.",
      "Do not change calculations based on userContext.",
      "All six domains must appear: 일·성과, 돈·현실, 인간관계, 연애·가족, 학업·자격증, 몸·생활 리듬.",
      "대운-specific interpretation:",
      "- Explain what this decade repeatedly pushes the person to handle.",
      "- Explain what kind of role they may keep being placed in.",
      "- Explain what kind of money, work, relationship, family, study, and body rhythm pattern repeats.",
      "- Explain how early, middle, and late parts of the cycle may feel different.",
      "- Explain which strong years within the cycle may feel stronger and why.",
      "Each main chapter must explain: 1. 대운 계산값, 2. 10년 동안 반복될 장기 장면, 3. why the scene can keep repeating, 4. which domain it is felt in, 5. how to use the decade less exhaustingly.",
      "bigThemes must contain 3 to 5 items. Each big theme should have a vivid metaphor, likelyScenes, and a long-term strategy.",
      "cycleYearTimeline must contain exactly 10 items, one for every year in currentCycle.startYear through currentCycle.endYear.",
      "The full 10-year timeline must appear and must use the provided cycleYearTimeline. Do not invent timeline years.",
      "The 10-year timeline is compact year-by-year rhythm inside the current 대운 background, not a full annual fortune.",
      "phaseTimeline must contain exactly three items in this order: early, middle, late.",
      "Phase guidance: early means new roles or environments enter; middle means the role hardens and repeats; late means cleanup, transition, and preparation for the next 대운.",
      "Use user-facing phase labels: 초반 1~3년, 중반 4~7년, 후반 8~10년.",
      "strongYears must use provided strongYearsWithinCycle. Do not invent strong years.",
      "Strong years are TOP highlights only; they must not replace the full 10-year timeline.",
      "Label strong years as 특히 강하게 체감될 수 있는 해 TOP 5.",
      "Strong years must explain why that year is strong using at least one reason: same element as major cycle, same ten-god theme, annual branch interaction with major/natal branch, annual element filling missing element, or annual element overloading heavy element.",
      "Do not use currentCycle.index as a score. cycle.index is 대운 순번 only.",
      "Visible flow should be descriptive: 대운 유형, 체감 강도, 핵심 방향. Do not make 대운 flow cards look like score cards.",
      "decadeCards must contain exactly six items, one per standard domain.",
      "finalAdvice must contain exactly six domain-specific actions, one per standard domain.",
      "Each finalAdvice item body must match its label and must not mix work/family/study/money/health advice in one item.",
      "cycleChapters must contain 6 to 10 items.",
      "Each cycleChapters item must include likelyScenes 2 to 4 and practicalAdvice 2 to 4.",
      "Interpret as long-term repeated themes, not a single-year event.",
      "Avoid vague fortune-cookie language.",
      "Bad:",
      formatList([
        "이 대운은 변화가 많을 수 있습니다.",
        "책임이 커질 수 있습니다.",
        "돈 문제가 생길 수 있습니다.",
        "관계가 흔들릴 수 있습니다.",
      ]),
      "Good:",
      "이 대운은 단순히 변화가 많은 10년이라기보다, 직장 안에서 '결정권은 크지 않은데 책임은 먼저 들어오는 역할'을 반복해서 맡게 되는 흐름으로 체감될 수 있습니다. 개발·서비스 기획 기준으로는 프로젝트 방향 정리, 문서화, 상사 설득, 일정 조율처럼 보이지 않는 운영 책임이 커질 가능성이 큽니다.",
      "Concrete scenes must name domains such as 직장, 프로젝트, 상사, 동료, 보고, 문서화, 계약, 정산, 생활비, 가족, 부모, 연인, 친구, 연락, 시험, 자격증, 수면, 식사, 회복.",
      "Use 명리 terms only with plain Korean translation.",
      "Every 명리 term must be translated into a plain-life metaphor before interpretation.",
      "Metaphor examples:",
      formatList([
        "비견: 내 기준을 세우고, 남의 방식보다 내 방식으로 버티는 힘",
        "토 과다: 해야 할 일, 관리할 일, 책임질 일이 흙처럼 쌓이는 구조",
        "충: 이미 굳어 있던 방향이 부딪혀 바뀌는 장면",
        "형: 겉으로는 버티지만 안쪽에서 압박이 쌓이는 장면",
        "육합: 사람·일정·역할이 실제로 묶이는 장면",
      ]),
      "Do not repeat terms inside parentheses. Write 식신: 결과물·표현·생산성, not 식신(식신, 결과물·표현·생산성).",
      "Do not show internal words in user-visible text: evidence, debug, diagnostic-only, 진단용, schema, fixture, precomputed.",
      "If evidence says the cycle basis is fixture_precomputed, write the user-facing basis as 사전 계산된 대운표 기준.",
      "Never write fixture_precomputed, fixture, or precomputed in user-facing fields.",
      "Forbidden hard claims:",
      formatList([
        "반드시",
        "무조건",
        "합격합니다",
        "불합격합니다",
        "이직합니다",
        "퇴사합니다",
        "승진합니다",
        "돈을 법니다",
        "병이 생깁니다",
        "결혼합니다",
        "헤어집니다",
        "망합니다",
        "성공합니다",
      ]),
      "Allowed style examples:",
      formatList([
        "~였을 가능성이 큽니다",
        "~로 체감될 수 있습니다",
        "~로 이어지기 쉽습니다",
        "~에 가까운 흐름입니다",
        "~로 나타날 수 있습니다",
      ]),
    ].join("\n"),
    user: [
      "다음 major fortune evidence packet만 사용해 MajorFortuneReportDraft JSON을 작성하라.",
      "대운 계산값은 evidencePacket 값을 그대로 사용한다.",
      "대운은 10년 단위 장기 흐름 리포트다.",
      evidenceJson,
    ].join("\n\n"),
  };
}
