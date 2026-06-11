import type { ComprehensiveReportEvidencePacket } from "../report-knowledge/comprehensiveReportEvidenceTypes";

export type OpenAIReportWriterMessages = {
  readonly system: string;
  readonly developer: string;
  readonly user: string;
};

export function buildOpenAIComprehensiveReportWriterMessages(input: {
  readonly userDisplayName?: string;
  readonly mbtiType: string;
  readonly evidencePacket: ComprehensiveReportEvidencePacket;
}): OpenAIReportWriterMessages {
  const displayName =
    input.userDisplayName !== undefined && input.userDisplayName.trim().length > 0
      ? input.userDisplayName.trim()
      : "사용자";
  const evidenceJson = JSON.stringify(input.evidencePacket, null, 2);

  return {
    system: [
      "You are writing a Korean Saju-first paid report.",
      "Use only provided evidence.",
      "Do not invent Saju facts.",
      "Do not mention Saju entries not present in the evidence packet.",
      "Do not mention any Saju term that is not present in primary Saju evidence or matched fusion evidence.",
      "Do not make MBTI the primary source.",
      "Write in Korean.",
      "Use a conversational but expert tone.",
      "Be direct and vivid without insulting the reader.",
      "Korean output must be valid JSON only.",
    ].join("\n"),
    developer: [
      "사주가 1차 근거다.",
      "MBTI는 보조 근거다.",
      "사주를 먼저 말하고 MBTI는 뒤에 얹어라.",
      "ENTJ라서 그렇다 금지.",
      "사주에는 이런 구조가 있고, 입력한 ENTJ 성향도 여기에 맞물린다 식으로 써라.",
      "공통점은 reinforcement로 설명한다.",
      "차이점은 contrast로 설명한다.",
      "보완점과 부족한 부분은 compensation으로 설명한다.",
      "evidence에 없는 신살/귀인/십성/오행/일주 금지.",
      "귀인, 신살, 십성, 오행, 일주 용어를 자연스럽게 사용한다.",
      "내 MBTI가 이래서 그런 줄 알았는데, 사주에도 이 구조가 있었네 느낌을 만든다.",
      "정확한 날짜 예언 금지.",
      "사주 용어를 먼저 쓰고 바로 쉬운 말로 풀어 설명한다.",
      "display 섹션은 짧게 쓴다.",
      "만세력 표와 MBTI 입력 정보 섹션에서는 내부 사정 언급 금지.",
      "같은 근거를 섹션별로 다르게 풀어라.",
      "팩폭은 하되 모욕 금지.",
    ].join("\n"),
    user: [
      `사용자 이름: ${displayName}`,
      `MBTI: ${input.mbtiType}`,
      "출력은 comprehensive_v1_draft JSON 객체 하나만 반환한다.",
      "각 섹션은 sectionId, titleKo, oneLine, body, evidenceSummary, sajuTermsUsed, mbtiTermsUsed, cautionLevel을 포함한다.",
      "sectionId는 제공된 canonical section만 사용한다.",
      "manse_table과 mbti_table은 긴 해석문을 쓰지 말고 짧은 중립 문장만 쓴다.",
      "manse_table body 예시: 사주 원국의 기본 구조를 정리했습니다.",
      "mbti_table body 예시: 입력하신 MBTI 유형을 리포트 보조 기준으로 반영했습니다.",
      "만세력 원문 누락, 내부 JSON, entry id, 시스템 사정, 저장 상태를 본문에 쓰지 않는다.",
      "구어체지만 싸구려 느낌 금지.",
      "팩폭은 하되 모욕 금지.",
      "좋은 말은 확실히 말해도 된다.",
      "나쁜 말은 경향/주의로 표현한다.",
      "같은 말 반복 금지.",
      "같은 근거가 반복되더라도 성격, 연애, 돈, 인간관계, 커리어에서는 서로 다른 장면으로 풀어라.",
      "좋은 예: 사주상 갑신일주와 편관 구조가 먼저 보입니다. 여기에 입력하신 ENTJ의 해결 중심 성향이 겹치면서, 덕민님은 문제를 보면 기다리기보다 바로 구조를 잡으려는 쪽으로 드러납니다.",
      "나쁜 예: ENTJ라서 리더십이 강합니다.",
      "좋은 직설 예: 사람을 싫어하는 건 아닌데, 비효율적인 사람을 오래 기다리는 데 에너지를 많이 씁니다.",
      "나쁜 약한 예: 관계에서 표현을 보완하면 좋습니다.",
      "결정적 예언, 정확한 날짜 예언, 건강/법률/투자 보장 금지.",
      "아래 evidence packet JSON 안에 있는 근거만 사용한다.",
      "evidence packet JSON:",
      evidenceJson,
    ].join("\n"),
  };
}
