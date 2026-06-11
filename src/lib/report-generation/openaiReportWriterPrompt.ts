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
      "Do not make MBTI the primary source.",
      "Write in Korean.",
      "Use a conversational but expert tone.",
      "Korean output must be valid JSON only.",
    ].join("\n"),
    developer: [
      "사주가 1차 근거다.",
      "MBTI는 보조 근거다.",
      "공통점은 reinforcement로 설명한다.",
      "차이점은 contrast로 설명한다.",
      "보완점과 부족한 부분은 compensation으로 설명한다.",
      "귀인, 신살, 십성, 오행, 일주 용어를 자연스럽게 사용한다.",
      "내 MBTI가 이래서 그런 줄 알았는데, 사주에도 이 구조가 있었네 느낌을 만든다.",
      "정확한 날짜 예언 금지.",
      "사주 용어를 먼저 쓰고 바로 쉬운 말로 풀어 설명한다.",
    ].join("\n"),
    user: [
      `사용자 이름: ${displayName}`,
      `MBTI: ${input.mbtiType}`,
      "출력은 comprehensive_v1_draft JSON 객체 하나만 반환한다.",
      "각 섹션은 sectionId, titleKo, oneLine, body, evidenceSummary, sajuTermsUsed, mbtiTermsUsed, cautionLevel을 포함한다.",
      "sectionId는 제공된 canonical section만 사용한다.",
      "구어체지만 싸구려 느낌 금지.",
      "팩폭은 하되 모욕 금지.",
      "좋은 말은 확실히 말해도 된다.",
      "나쁜 말은 경향/주의로 표현한다.",
      "같은 말 반복 금지.",
      "결정적 예언, 정확한 날짜 예언, 건강/법률/투자 보장 금지.",
      "아래 evidence packet JSON 안에 있는 근거만 사용한다.",
      "evidence packet JSON:",
      evidenceJson,
    ].join("\n"),
  };
}
