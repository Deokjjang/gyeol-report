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
    majorTenGod: packet.majorTenGod,
    elementEffect: packet.elementEffect,
    branchInteractions: packet.branchInteractions,
    lifeAreaSignals: packet.lifeAreaSignals,
    difficultySignals: packet.difficultySignals,
    opportunitySignals: packet.opportunitySignals,
    transitionSignals: packet.transitionSignals,
    strongYearsWithinCycle: packet.strongYearsWithinCycle,
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
      "phaseTimeline must contain exactly three items in this order: early, middle, late.",
      "strongYears must use provided strongYearsWithinCycle. Do not invent strong years.",
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
