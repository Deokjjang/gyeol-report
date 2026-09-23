import { birthTimePromptContext } from "./birthTimePublication";
import type {
  LoveMarriageChildReportEvidencePacket,
} from "../report-knowledge/loveMarriageChildReportTypes";

export type OpenAILoveMarriageChildReportWriterMessages = {
  readonly system: string;
  readonly developer: string;
  readonly user: string;
};

function formatList(values: readonly string[]): string {
  return values.length === 0
    ? "- 없음"
    : values.map((value) => `- ${value}`).join("\n");
}

function buildPromptPacket(packet: LoveMarriageChildReportEvidencePacket): object {
  return {
    ...birthTimePromptContext(packet),
    productType: packet.productType,
    productVersion: packet.productVersion,
    personContext: packet.personContext,
    sajuBasis: packet.sajuBasis,
    mbtiBasis: { ...packet.mbtiBasis, growth: packet.relationshipReading?.recoveryTraits ?? packet.mbtiBasis.growth },
    bridgeEvidence: packet.bridgeEvidence,
    relationshipReading: packet.relationshipReading,
    timingHints: packet.timingHints,
    safetyNotes: packet.safetyNotes,
  };
}

export function buildOpenAILoveMarriageChildReportWriterMessages(input: {
  readonly evidencePacket: LoveMarriageChildReportEvidencePacket;
}): OpenAILoveMarriageChildReportWriterMessages {
  const evidenceJson = JSON.stringify(
    buildPromptPacket(input.evidencePacket),
    null,
    2,
  );

  return {
    system: [
      "You are writing a Korean paid love, marriage, and parent-mode report.",
      "Use only the provided love_marriage_child evidence packet.",
      "Write only valid JSON matching love_marriage_child_report_draft.",
      "Do not invent calculations, spouse fate, child fate, medical facts, pregnancy facts, reunion probability, the user's MBTI type, or timing hints.",
      "Write in Korean.",
    ].join("\n"),
    developer: [
      "상품명은 연애·결혼·자녀 리포트다.",
      "Product policy:",
      formatList([
        "명리는 근거로 쓰고, MBTI는 행동 방식과 표현 방식의 보조 evidence로 쓴다.",
        "명리와 MBTI를 같은 것으로 단정하지 않는다.",
        "이 상품은 특정 상대와의 궁합 판정이 아니라 나의 관계 성향 리포트다.",
        "다만 읽는 재미를 위해 내가 편해지기 쉬운 관계 스타일, 잘 맞기 쉬운 MBTI 후보, 명리적으로 편한 상대 특징은 직설적으로 쓴다.",
        "내가 오래 피곤해지는 관계 스타일도 직설적으로 쓴다.",
        "추천은 후보군과 성향 기준으로만 쓰고, 특정 상대와의 실제 궁합을 단정하는 표현은 궁합 리포트 영역으로 분리한다.",
        "연애, 결혼, 자녀를 예언하지 않는다.",
        "자녀 파트는 반드시 내가 부모가 되었을 때의 역할 방식만 쓴다.",
        "실제 자녀의 성향, 운명, 건강, 임신, 출산은 다루지 않는다.",
        "이별·재회는 내 반복 패턴, 감정 처리, 관계 회복 습관까지만 쓴다.",
        "상대가 돌아오는지, 재회 확률, 결혼 여부를 단정하지 않는다.",
        "강한 톤은 쓰되 공포 조장, 낙인, 운명론을 금지한다.",
      ]),
      "Evidence usage:",
      formatList([
        "sajuBasis.dayPillar, dayBranch, spousePalaceSignal은 가까운 관계에서 반복되는 반응과 생활 기준으로 쓴다.",
        "sajuBasis love/marriage/parenting tenGod signals는 재성, 관성, 식상, 인성, 비겁의 관계 작동 방식으로 쓴다.",
        "도화·홍염은 매력, 호감, 표현성으로만 쓴다. 성적 단정은 금지한다.",
        "현침은 말의 날카로움과 피드백 방식으로 쓴다.",
        "화개는 혼자 정리하는 시간, 깊이, 거리감, 회복 리듬으로 쓴다.",
        "귀인은 도움, 완충, 멘토, 조율자 구조로 쓴다.",
        "합충형파해는 관계의 파국이 아니라 생활 기준, 거리, 속도, 말투의 조율 지점으로 쓴다.",
        "mbtiBasis love/marriage/parenting/childRole/relationships/communication/risks/growth를 행동과 표현의 재료로 쓴다.",
        "bridgeEvidence는 명리 신호와 MBTI trait이 겹치는 문장 재료로만 쓰고, 계산 결과나 증명처럼 쓰지 않는다.",
        "bridgeEvidence.forbiddenAngles는 절대 출력하지 않는다.",
        "relationshipReading의 status/question/scene에 맞춰 현재 구매 질문에 답한다. some과 marriage_preparing을 dating으로 뭉개지 않는다. unknown은 관계 상태를 추정하지 않는다.",
        "attractionPattern은 끌림, 오래 편한 행동, 조율 비용을 분리한다. 유형 예시는 relationshipReading.partnerExamples에 선택된 것만 사용하며 evidenceIds의 명리 기준과 pair 근거를 연결한다. 후보가 없으면 MBTI 추천을 만들지 않는다.",
        "growth는 relationshipReading.recoveryTraits에 선택된 관계용 자료만 쓴다. 직업·학업 조언을 이별 후 회복에 옮기지 않는다.",
        "relationshipReading.scenes는 검증된 Bridge v2 장면이다. 유형과 근거 ID를 보존하고 관계 문맥에 맞는 본문에 한 번씩 배치한다.",
        "parentMode는 실제 parentingTraits와 parentingTenGodSignals를 바탕으로 규칙/자율, 공감/해결, 교육, 기대, 실수, 독립의 장면을 구분한다. 자녀의 유형을 추정하지 않는다.",
        "MBTI 후보는 잘 맞기 쉬운 행동 언어로만 제시하고, 궁합을 단정하거나 상대를 판단하는 말로 쓰지 않는다.",
        "명리 보완형은 재성/관성/식상/인성/비겁, 귀인, 합충형파해의 관계 기준을 이용하되 상대의 실제 원국을 안다고 쓰지 않는다.",
        "십성은 evidence에 있는 이름만 쓴다. 식신이 없고 상관만 있으면 식신이라고 쓰지 않는다.",
        "합충형파해는 같은 관계를 중복해서 쓰지 않는다. 예: 甲己합과 연일 천간합 甲己가 함께 있으면 자연어로 하나만 쓴다.",
      ]),
      "Required sections:",
      formatList([
        "headline",
        "openingSummary",
        "loveStyle",
        "attractionPattern",
        "loveStrengths",
        "loveFriction",
        "marriageRhythm",
        "householdMoneyAndRoleSplit",
        "conflictRecovery",
        "parentMode",
        "breakupReunionPattern",
        "relationshipTimingHints",
        "actionPlan",
        "riskManagement",
        "safetyNotes",
      ]),
      "parentMode safety policy:",
      formatList([
        "parentMode는 내가 부모가 되었을 때의 양육 역할, 감정 반응, 생활 기준만 다룬다.",
        "childFortune, childDestiny, childAnalysis 같은 이름이나 의미를 쓰지 않는다.",
        "자식복, 실제 자녀의 운명, 실제 자녀의 MBTI, 실제 자녀의 건강, 임신, 출산은 쓰지 않는다.",
      ]),
      "breakupReunionPattern safety policy:",
      formatList([
        "breakupReunionPattern은 내 반복 패턴, 감정 처리, 회복 습관, 경계선만 다룬다.",
        "reunionProbability, willBreakup 같은 이름이나 의미를 쓰지 않는다.",
        "상대가 돌아온다, 반드시 재회, 무조건 헤어짐 같은 상대 미래 단정은 쓰지 않는다.",
      ]),
      "Writing tone and structure policy:",
      formatList([
        "문단 중심으로 쓴다.",
        "작은 카드처럼 과도하게 쪼개지 않는다.",
        "가능성이 있습니다, 그럴 수 있습니다 같은 약한 표현을 남발하지 않는다.",
        "연애 조언 앱처럼 가볍게 쓰지 않는다.",
        "배우자, 자녀, 재회 운명론을 쓰지 않는다.",
        "직접적이고 구체적인 한국어로 쓰되 저급하거나 자극적인 말투는 피한다.",
        "관계 스타일은 선택된 개인 근거에서만 설명한다. 모든 고객을 기준과 책임 중심의 성향으로 쓰지 않는다.",
        "관계의 피로는 실제 trait의 risk와 명리 관계 신호로 설명한다. 상대의 성격을 발명하지 않는다.",
        "추천 MBTI 후보를 쓸 때는 후보군으로만 쓰고, 실제 궁합은 상대 정보까지 봐야 한다는 안전선을 붙인다.",
      ]),
      "Forbidden relationship and family claims:",
      formatList([
        "무조건 헤어짐",
        "반드시 결혼",
        "결혼 못한다",
        "이혼한다",
        "배우자복 없다",
        "자식복 없다",
        "임신",
        "출산 확정",
        "건강 진단",
        "재회 확률",
        "상대가 돌아온다",
      ]),
      "Bad writing:",
      formatList([
        "당신은 반드시 결혼합니다.",
        "이 관계는 무조건 헤어집니다.",
        "자녀 운이 좋습니다.",
        "상대가 돌아올 확률이 높습니다.",
      ]),
    ].join("\n"),
    user: [
      "Write the love_marriage_child_report_draft JSON from this evidence packet.",
      "Evidence packet:",
      evidenceJson,
    ].join("\n\n"),
  };
}
