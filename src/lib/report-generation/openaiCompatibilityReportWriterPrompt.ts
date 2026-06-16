import type { CompatibilityEvidencePacket } from "../report-knowledge/compatibilityEvidenceBuilder";

export type OpenAICompatibilityReportWriterMessages = {
  readonly system: string;
  readonly developer: string;
  readonly user: string;
};

export function deriveAllowedCompatibilitySajuTerms(
  packet: CompatibilityEvidencePacket,
): readonly string[] {
  return [
    ...new Set([
      ...packet.personAChartSummary.featureLabels,
      ...packet.personBChartSummary.featureLabels,
      packet.personAChartSummary.dayPillar,
      packet.personBChartSummary.dayPillar,
      `${packet.personAChartSummary.dayMaster}일간`,
      `${packet.personBChartSummary.dayMaster}일간`,
    ]),
  ].filter((term) => term.trim().length > 0);
}

export function deriveAllowedCompatibilityMbtiTerms(
  packet: CompatibilityEvidencePacket,
): readonly string[] {
  const terms: string[] = [];

  if (packet.personAChartSummary.mbti !== undefined) {
    terms.push(packet.personAChartSummary.mbti);
  }
  if (packet.personBChartSummary.mbti !== undefined) {
    terms.push(packet.personBChartSummary.mbti);
  }

  return terms;
}

function formatList(values: readonly string[]): string {
  return values.length === 0 ? "- 없음" : values.map((value) => `- ${value}`).join("\n");
}

function buildPromptPacket(packet: CompatibilityEvidencePacket): object {
  return {
    input: packet.input,
    personAChartSummary: packet.personAChartSummary,
    personBChartSummary: packet.personBChartSummary,
    sajuBridge: packet.sajuBridge,
    mbtiBridge: packet.mbtiBridge,
    score: packet.score,
    evidenceBySection: packet.evidenceBySection,
    warnings: packet.warnings,
  };
}

export function buildOpenAICompatibilityReportWriterMessages(input: {
  readonly evidencePacket: CompatibilityEvidencePacket;
  readonly allowedSajuTerms?: readonly string[];
  readonly allowedMbtiTerms?: readonly string[];
}): OpenAICompatibilityReportWriterMessages {
  const allowedSajuTerms =
    input.allowedSajuTerms ??
    deriveAllowedCompatibilitySajuTerms(input.evidencePacket);
  const allowedMbtiTerms =
    input.allowedMbtiTerms ??
    deriveAllowedCompatibilityMbtiTerms(input.evidencePacket);
  const evidenceJson = JSON.stringify(buildPromptPacket(input.evidencePacket), null, 2);

  return {
    system: [
      "You are writing a Korean Saju x MBTI compatibility paid report.",
      "궁합은 성공/실패 판정이 아니다.",
      "두 사람의 구조에서 잘 맞는 지점과 조정이 필요한 지점을 보는 리포트다.",
      "점수는 재미와 비교를 위한 요약값이지 운명 판정이 아니다.",
      "Use only provided compatibility evidence.",
      "두 사람의 실제 사주 feature와 입력된 MBTI만 사용하라.",
      "evidence에 없는 사주 용어를 새로 만들지 마라.",
      "입력되지 않은 MBTI 유형 후보를 추천하지 마라.",
      "Write only valid JSON matching the schema.",
      "Write in Korean.",
    ].join("\n"),
    developer: [
      "상품명은 사주×MBTI 궁합 리포트 v1.0이다.",
      "관계 유형은 love=연애, some=썸, marriage=결혼/장기연애, friendship=친구로 풀어써라.",
      "상대 출생시간 모름과 상대 MBTI 모름은 결함이 아니라 confidence warning으로 다뤄라.",
      "MBTI 후보 유형 추천은 이번 궁합 v1.0에서 금지한다.",
      "각 chapter는 서로 다른 각도를 새로 제시해야 한다. 같은 결론과 같은 조언 문장을 반복하지 마라.",
      "다음 표현은 전체 리포트에서 1회 이상 반복하지 마라: 연락 빈도, 약속 변경, 생활비, 숫자로 합의, 바로 결론, 하루 뒤 재검토, 혼자 쉬는 시간.",
      "한 chapter에서 쓴 규칙은 다음 chapter에서 같은 말로 반복하지 말고, 새로운 상황과 근거로 확장하라.",
      "directHitScenes는 가능하면 chapter마다 2개를 써라. 최소 1개는 반드시 있어야 한다.",
      "directHitScenes는 누가 무엇을 하는지, 상대가 무엇을 느끼는지, 어떤 사주/MBTI 구조에서 오는지, 어떤 일상 상황인지가 보여야 한다.",
      "나쁜 장면 예: 연락 속도가 달라서 서운한 장면.",
      "좋은 장면 예: 덕민은 대화를 끝내기 전에 결론부터 정리하려 하고, 소담은 아직 조건을 더 확인해야 해서 말이 느려지는 장면.",
      "좋은 장면 예: 덕민은 \"그래서 어떻게 할까?\"로 들어가고, 소담은 \"잠깐, 이 전제가 맞는지 먼저 봐야 해\"라고 멈추는 장면.",
      "chapter title은 paid report section title처럼 써라. functional chapter label처럼 쓰지 마라.",
      "피할 제목: 전체 리듬, 끌림 포인트, 잘 맞는 지점, 부딪히는 지점, 대화 방식, 반복될 장면, 돈과 생활 리듬, 싸운 뒤 회복, 오래 가는 규칙, 마지막 조언.",
      "좋은 제목 예: 끌림은 빠르고, 안정은 규칙에서 온다 / 서로에게 없는 결이 매력으로 보인다 / 결론형 ENTJ와 검토형 INTP의 속도 차이 / 싸운 뒤 바로 풀려고 하면 더 꼬인다 / 오늘부터 바꿀 세 가지.",
      "65~74점은 실패나 위험 점수가 아니다. 조율형 궁합으로 설명하라.",
      "69점은 안 맞는 점수가 아니라, 끌림과 보완은 있지만 속도·생활·회복 방식에 조율 장치가 필요한 궁합이라고 풀어라.",
      "relationshipType별 초점: love는 끌림, 데이트 리듬, 감정 온도, 소통, 갈등 회복을 본다.",
      "relationshipType별 초점: some은 초반 애매함, 타이밍, 속도 차이, 호감에서 명확함으로 넘어가는 방식을 본다.",
      "relationshipType별 초점: marriage는 장기 생활, 돈, 가족 리듬, 책임, 반복 갈등 패턴을 본다.",
      "relationshipType별 초점: friendship은 대화 리듬, 거리감, 의리, 도움 방식, 경계선을 본다.",
      "허용된 사주 용어:",
      formatList(allowedSajuTerms),
      "허용된 MBTI 용어:",
      formatList(allowedMbtiTerms),
      "금지 표현: 운명입니다, 운명 확정, 천생연분 확정, 이별 확정, 이혼 확정, 무조건, 반드시, 100%, 소울메이트 확정.",
      "chapter guide:",
      "overview: 두 사람의 전체 리듬과 점수 해석.",
      "attraction: 왜 끌리는지. 오행/십성/MBTI 대화 리듬 기반.",
      "strengths: 잘 맞는 지점.",
      "frictions: 반복적으로 부딪히는 지점.",
      "communication: 대화 속도, 감정 표현, 결론 방식.",
      "relationship_scenes: 연애/썸/장기 관계에서 반복될 장면.",
      "money_lifestyle: 돈, 생활, 약속, 시간 사용 리듬.",
      "conflict_recovery: 싸웠을 때 풀리는 방식.",
      "long_term_rules: 오래 가기 위한 관계 규칙.",
      "final_message: 마지막 메시지. finalAdvice는 별도 '오늘부터 할 일' 목록으로 이어지게 써라.",
      "모든 chapter는 directHitScenes를 1개 이상 포함해야 한다.",
      "finalAdvice는 오늘부터 할 수 있는 관계 규칙 3개 이상으로 쓰되, chapter title과 같은 '마지막 조언' 표현을 반복하지 마라.",
    ].join("\n"),
    user: [
      "다음 compatibility evidence packet만 사용해 compatibility_v1_draft JSON을 작성하라.",
      "점수는 evidence.score 값을 그대로 사용하라.",
      "chartComparison.personA/personB는 두 사람 만세력의 짧은 문자열 요약만 작성하라. 실제 표 데이터는 시스템이 evidence에서 deterministic하게 붙인다.",
      evidenceJson,
    ].join("\n\n"),
  };
}

export function buildOpenAICompatibilityReportRepairMessages(input: {
  readonly previousDraftText: string;
  readonly validationErrors: readonly string[];
  readonly evidencePacket: CompatibilityEvidencePacket;
  readonly allowedSajuTerms?: readonly string[];
  readonly allowedMbtiTerms?: readonly string[];
}): OpenAICompatibilityReportWriterMessages {
  const base = buildOpenAICompatibilityReportWriterMessages({
    evidencePacket: input.evidencePacket,
    allowedSajuTerms: input.allowedSajuTerms,
    allowedMbtiTerms: input.allowedMbtiTerms,
  });

  return {
    system: base.system,
    developer: [
      base.developer,
      "Repair only the invalid compatibility draft.",
      "missing direct-hit scenes가 있으면 해당 chapter에 실제 연애/썸/친구/생활 장면을 넣어라.",
      "unsafe copy가 있으면 확정/운명/공포 표현을 제거하라.",
      "missing final advice가 있으면 오늘부터 할 수 있는 관계 규칙을 3개 이상 넣어라.",
      "candidate MBTI recommendation이 있으면 입력된 두 MBTI 외 유형을 모두 제거하라.",
      "unsupported saju term이 있으면 허용된 사주 용어 목록 밖의 용어를 삭제하라.",
    ].join("\n"),
    user: [
      "validation errors:",
      formatList(input.validationErrors),
      "previous draft:",
      input.previousDraftText,
      "Return repaired compatibility_v1_draft JSON only.",
    ].join("\n\n"),
  };
}
