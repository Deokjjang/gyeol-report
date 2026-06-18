import type { AnnualFortuneEvidencePacket } from "../report-knowledge/annualFortuneEvidence";

export type OpenAIAnnualFortuneReportWriterMessages = {
  readonly system: string;
  readonly developer: string;
  readonly user: string;
};

function formatList(values: readonly string[]): string {
  return values.length === 0 ? "- 없음" : values.map((value) => `- ${value}`).join("\n");
}

function buildPromptPacket(packet: AnnualFortuneEvidencePacket): object {
  return {
    productType: packet.productType,
    productVersion: packet.productVersion,
    targetYear: packet.targetYear,
    mode: packet.mode,
    yearAccess: packet.yearAccess,
    annualGanji: packet.annualGanji,
    userPillars: packet.userPillars,
    dayMaster: packet.dayMaster,
    annualTenGod: packet.annualTenGod,
    elementEffect: packet.elementEffect,
    branchInteractions: packet.branchInteractions,
    lifeAreaSignals: packet.lifeAreaSignals,
    difficultySignals: packet.difficultySignals,
    opportunitySignals: packet.opportunitySignals,
    warnings: packet.warnings,
  };
}

export function buildOpenAIAnnualFortuneReportWriterMessages(input: {
  readonly evidencePacket: AnnualFortuneEvidencePacket;
}): OpenAIAnnualFortuneReportWriterMessages {
  const evidenceJson = JSON.stringify(buildPromptPacket(input.evidencePacket), null, 2);

  return {
    system: [
      "You are writing a Korean paid annual Saju fortune report.",
      "Use only provided evidence.",
      "Do not invent pillars or ganji.",
      "Do not change calculation results.",
      "Do not manipulate calculation results.",
      "Do not guarantee outcomes.",
      "Write only valid JSON matching annual_fortune_report_draft.",
      "Write in Korean.",
    ].join("\n"),
    developer: [
      "상품명은 세운 리포트 v1.0이다.",
      "세운 리포트는 MBTI 중심 상품이 아니다. 명리 계산값과 생활 장면을 중심으로 쓴다.",
      "계산은 정직하게. 해석은 구체적으로. 문장은 용하게. 하지만 결과를 단정하지 않는다.",
      "Use only the provided annual fortune evidence packet.",
      "Do not invent or alter annualGanji, dayMaster, annualTenGod, elementEffect, branchInteractions, or yearAccess.",
      "Do not change targetYear, mode, ganji, ten-god, or pillar values.",
      "명리 용어를 쓸 때는 반드시 plain Korean translation을 붙여라.",
      "Avoid vague fortune-cookie language.",
      "Concrete scenes are required across work, money, relationship, family, study/certificate, and health rhythm where evidence supports them.",
      "Do not say only: 책임이 커질 수 있습니다 / 관계가 흔들릴 수 있습니다 / 좋은 기회가 올 수 있습니다 / 돈 문제가 생길 수 있습니다.",
      "Instead explain 직장·가족·돈·시험·승진·이직·관계 중 어디에서 체감될 가능성이 큰지, 실제 생활에서 어떤 장면으로 나타날 수 있는지, 왜 유독 무겁게 느껴질 수 있는지, 그 구조가 반복되면 어떤 선택 패턴으로 이어질 수 있는지.",
      "Past review mode rule: for past_review, explain why the selected year may have felt difficult, heavy, stuck, expansive, or transitional.",
      "Past review mode must use 회고 tone: 그해, 그 시기, 왜, 흔들렸, 압박, 반복 같은 문맥을 자연스럽게 쓴다.",
      "Current year mode rule: for current_year, explain what flow is entering this year, how to use it constructively, what to watch, and what preparation reduces loss.",
      "New year preview mode rule: for new_year_preview, write as 신년운세. 준비, 활용, 기회, 조심, 흐름을 쓰는 방법을 중심으로 쓴다.",
      "Every chapter must contain concrete scene candidates, not generic advice.",
      "monthlyFlow must contain exactly 12 items, one for each month from 1 to 12.",
      "chapters must contain 6 to 10 items.",
      "likelyScenes must contain 2 to 4 items per chapter.",
      "practicalAdvice must contain 2 to 4 items per chapter.",
      "finalAdvice must contain 4 to 7 concrete items.",
      "safetyNotes must contain 2 to 4 plain notes.",
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
      ]),
      "Allowed style examples:",
      formatList([
        "~였을 가능성이 큽니다",
        "~로 나타났을 수 있습니다",
        "~처럼 체감됐을 수 있습니다",
        "~로 이어지기 쉽습니다",
        "~에 가까운 흐름입니다",
      ]),
      "Internal words must never appear in user-visible text: evidence, debug, diagnostic-only, 진단용, schema, fixture.",
      "Bad example:",
      "올해는 책임이 커질 수 있습니다.",
      "Good example:",
      "이 해에는 직장·학업·가족 중 한 영역에서 ‘내가 정리해야 하는 역할’이 강해졌을 가능성이 큽니다. 특히 결과를 증명해야 하는 일, 돈이나 일정의 기준을 잡는 일, 누군가의 문제를 대신 수습하는 일이 이 흐름으로 나타났을 수 있습니다.",
    ].join("\n"),
    user: [
      "다음 annual fortune evidence packet만 사용해 AnnualFortuneReportDraft JSON을 작성하라.",
      "선택 연도 1개에 대한 세운 리포트다.",
      "계산값은 evidencePacket 값을 그대로 사용한다.",
      evidenceJson,
    ].join("\n\n"),
  };
}
