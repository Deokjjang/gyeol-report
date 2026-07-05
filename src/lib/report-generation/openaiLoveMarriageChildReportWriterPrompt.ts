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
    productType: packet.productType,
    productVersion: packet.productVersion,
    personContext: packet.personContext,
    sajuBasis: packet.sajuBasis,
    mbtiBasis: packet.mbtiBasis,
    bridgeEvidence: packet.bridgeEvidence,
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
      "Do not invent calculations, spouse fate, child fate, medical facts, pregnancy facts, reunion probability, MBTI, or timing hints.",
      "Write in Korean.",
    ].join("\n"),
    developer: [
      "상품명은 연애·결혼·자녀 리포트다.",
      "Product policy:",
      formatList([
        "명리는 근거로 쓰고, MBTI는 행동 방식과 표현 방식의 보조 evidence로 쓴다.",
        "명리와 MBTI를 같은 것으로 단정하지 않는다.",
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
      "Good writing:",
      "정관·편관 신호는 관계에서 기준과 책임을 중요하게 보는 쪽으로 씁니다. ENTJ 성향은 그 기준을 말과 행동으로 빠르게 정리하려는 방식으로 나타날 수 있습니다. 그래서 당신은 애매한 관계보다 약속, 역할, 생활 기준이 선명한 관계에서 훨씬 안정됩니다.",
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
