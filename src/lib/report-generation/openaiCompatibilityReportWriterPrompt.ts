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

const compatibilityDiagnosticOnlyForbiddenTerms = [
  "백호대살",
  "괴강살",
  "도화살 확정",
  "이혼살",
  "과부살",
  "상부살",
  "단명",
  "사망",
  "사고수",
] as const;

function collectUnsupportedCompatibilityTerms(
  validationErrors: readonly string[],
): readonly string[] {
  return validationErrors
    .flatMap((error) => {
      const prefix = "UNSUPPORTED_COMPATIBILITY_TERM:";

      return error.startsWith(prefix) ? [error.slice(prefix.length).trim()] : [];
    })
    .filter((term, index, terms) => term.length > 0 && terms.indexOf(term) === index);
}

function buildPromptPacket(packet: CompatibilityEvidencePacket): object {
  return {
    input: packet.input,
    personAChartSummary: packet.personAChartSummary,
    personBChartSummary: packet.personBChartSummary,
    sajuBridge: packet.sajuBridge,
    deepSajuBridge: packet.deepSajuBridge,
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
      "절대 사용자 본문에 diagnostic-only feature를 쓰지 마라.",
      "특히 백호대살은 어떤 경우에도 본문, 장면, 조언, 안전 안내에 쓰지 마라.",
      "백호대살이 evidence/debug/diagnostic에 있어도 사용자용 리포트에서는 완전히 무시하라.",
      "diagnostic-only term이 source data에 있으면 unavailable로 처리하고, 제외 사실도 말하지 마라.",
      "Write only valid JSON matching the schema.",
      "Write in Korean.",
    ].join("\n"),
    developer: [
      "상품명은 사주×MBTI 궁합 리포트 v1.0이다.",
      "v1 관계 유형은 연애, 결혼/장기연애, 썸, 친구, 가족, 동업/업무 파트너만 지원한다.",
      "관계 유형은 love=연애, marriage=결혼/장기연애, some=썸, friendship=친구, family=가족, business_work_partner=동업/업무 파트너로 풀어써라.",
      "상대 출생시간 모름과 상대 MBTI 모름은 결함이 아니라 confidence warning으로 다뤄라.",
      "MBTI 후보 유형 추천은 이번 궁합 v1.0에서 금지한다.",
      "각 chapter는 서로 다른 각도를 새로 제시해야 한다. 같은 결론과 같은 조언 문장을 반복하지 마라.",
      "다음 표현은 전체 리포트에서 1회 이상 반복하지 마라: 연락 빈도, 약속 변경, 생활비, 숫자로 합의, 바로 결론, 하루 뒤 재검토, 혼자 쉬는 시간.",
      "한 chapter에서 쓴 규칙은 다음 chapter에서 같은 말로 반복하지 말고, 새로운 상황과 근거로 확장하라.",
      "Do not repeat the same advice concept in more than two sections.",
      "If a concept repeats, make the second use more specific and scene-based.",
      "이번 궁합 리포트는 같은 근거를 반복하지 말고, 챕터마다 다른 명리학 레이어를 사용하라.",
      "반드시 아래 범주 중 최소 5개 이상을 본문에 자연스럽게 사용하라:",
      "- 일간 관계",
      "- 서로에게 보이는 십성",
      "- 두 사람 오행 보완",
      "- 합쳐졌을 때 무거워지는 오행",
      "- 지지 삼합/반합/육합",
      "- 지지 충/해/형/파",
      "- 일지/배우자궁 관계",
      "- 월지/생활 리듬 관계",
      "- MBTI 대화 리듬",
      "천을귀인, 재고귀인, 원진살, MBTI 속도 차이만 반복하지 마라.",
      "명리학 용어를 쓸 때는 반드시 그 뜻을 먼저 생활 언어로 풀어라.",
      "계산값만 말하지 마라.",
      "Deep interpretation must match the actual relationLabel.",
      "Do not reuse 갑목/정화 examples unless the actual relation is 갑목/정화.",
      "Do not explain 상관/정인 unless the actual relationLabel contains 상관/정인.",
      "나쁜 예: 갑목이 정화를 생합니다.",
      "나쁜 예: 상관/정인 관계입니다.",
      "나쁜 예: 丑未 충이 있습니다.",
      "좋은 예: 갑목은 나무이고 정화는 작은 불입니다. 나무가 불을 살리듯, 한쪽의 방향성이 다른 쪽의 표현과 온도를 살립니다.",
      "좋은 예: 상관은 표현을 꺼내는 기운이고 정인은 의미와 기준을 붙이는 기운입니다.",
      "좋은 예: 丑未 충은 안정감을 원하는 방식이 다르게 부딪히는 그림입니다.",
      "Every chapter should contain at least one sentence that translates the saju calculation into everyday relationship language.",
      "Do not expose English/internal labels like mutual element complement.",
      "Translate all relation labels into Korean.",
      "keyCompatibilityPoints는 각 그룹 2~3개 이내로 짧고 겹치지 않게 써라.",
      "opening key points should be concise and should not repeat chapter bodies.",
      "directHitScenes는 가능하면 chapter마다 2개를 써라. 최소 1개는 반드시 있어야 한다.",
      "directHitScenes는 누가 무엇을 하는지, 상대가 무엇을 느끼는지, 어떤 사주/MBTI 구조에서 오는지, 어떤 일상 상황인지가 보여야 한다.",
      "directHitScenes는 사용자 화면에서 '반복될 수 있는 장면'으로 보일 내용이다. 공격적이거나 찌르는 말투로 쓰지 마라.",
      "나쁜 장면 예: 연락 속도가 달라서 서운한 장면.",
      "좋은 장면 예: 덕민은 대화를 끝내기 전에 결론부터 정리하려 하고, 소담은 아직 조건을 더 확인해야 해서 말이 느려지는 장면.",
      "좋은 장면 예: 덕민은 \"그래서 어떻게 할까?\"로 들어가고, 소담은 \"잠깐, 이 전제가 맞는지 먼저 봐야 해\"라고 멈추는 장면.",
      "chapter title은 paid report section title처럼 써라. functional chapter label처럼 쓰지 마라.",
      "피할 제목: 전체 리듬, 끌림 포인트, 잘 맞는 지점, 부딪히는 지점, 대화 방식, 반복될 장면, 돈과 생활 리듬, 싸운 뒤 회복, 오래 가는 규칙, 마지막 조언.",
      "좋은 제목 예: 끌림은 빠르고, 안정은 규칙에서 온다 / 서로에게 없는 결이 매력으로 보인다 / 결론형 ENTJ와 검토형 INTP의 속도 차이 / 싸운 뒤 바로 풀려고 하면 더 꼬인다 / 오늘부터 바꿀 세 가지.",
      "65~74점은 실패나 위험 점수가 아니다. 조율형 궁합으로 설명하라.",
      "69점은 안 맞는 점수가 아니라, 끌림과 보완은 있지만 속도·생활·회복 방식에 조율 장치가 필요한 궁합이라고 풀어라.",
      "relationshipType별 초점: love는 연애/애인 관계로, 끌림, 감정 온도, 데이트 리듬, 대화 속도, 갈등 회복 중심으로 본다.",
      "relationshipType별 초점: marriage는 결혼/장기연애 관계로, 생활 리듬, 돈, 책임, 장기 안정성, 반복 갈등, 현실 운영 중심으로 본다.",
      "relationshipType별 초점: some은 썸 관계로, 호감 신호, 애매함, 타이밍, 먼저 다가가는 속도, 관계를 명확히 하는 방식 중심으로 본다.",
      "relationshipType별 초점: friendship은 친구 관계로, 대화 리듬, 거리감, 도움 방식, 의리, 선 넘지 않는 경계 중심으로 본다.",
      "relationshipType별 초점: family는 가족 관계로, 오래된 패턴, 정서 연결, 말의 통로, 생활 리듬, 역할과 경계 중심으로 본다.",
      "relationshipType별 초점: business_work_partner는 동업/업무 파트너 관계로, 역할 분담, 의사결정, 업무 속도, 돈과 책임, 신뢰, 리스크 관리, 피드백 방식 중심으로 본다.",
      "Different relationship types must not reuse the same report structure verbatim.",
      "relationshipType must control score labels, finalAdvice labels, scene vocabulary, and safety notes.",
      "For love, write as a romantic relationship with 감정, 끌림, 데이트 리듬, and 갈등 회복 language.",
      "For marriage, write as a long-term living and commitment relationship with 생활, 돈, 책임, and 장기 운영 language.",
      "For some, write as timing and ambiguity with 호감 신호, 타이밍, 관계 속도, and 명확화 language.",
      "For friendship, write as distance, help, and conversation with 거리감, 도움 방식, 대화 리듬, and 경계선 language.",
      "For family, write as family rhythm, roles, and emotional passage with 생활 리듬, 역할, 정서 회복, and 말의 통로 language.",
      "For business_work_partner, write as role, responsibility, decision, and feedback with 역할 분담, 책임, 의사결정, 피드백, and 신뢰 관리 language.",
      "family/business_work_partner/friendship에서는 연애, 데이트, 애인, 설렘 같은 표현을 쓰지 마라.",
      "For business_work_partner, never use dating or romance language.",
      "For family/friendship, never use dating or romance language.",
      "business_work_partner에서는 업무 미팅, 협업 신호, 확인 피드백, 수정 의견, 검토/응답 시간, 역할과 권한 같은 업무/파트너십 어휘를 써라.",
      "family에서는 가족 관계, 함께 보내는 시간, 정서 연결, 말의 통로, 생활 리듬, 역할과 경계 같은 가족/생활 어휘를 써라.",
      "love/some/marriage에서는 업무 파트너처럼만 해석하지 마라.",
      "relationshipType에 맞지 않는 score label이나 chapter wording을 만들지 마라.",
      "Safety notes must not mention internal policy terms like diagnostic-only, 진단용, evidence, or debug.",
      "허용된 사주 용어:",
      formatList(allowedSajuTerms),
      "허용된 MBTI 용어:",
      formatList(allowedMbtiTerms),
      "diagnostic-only 금지 용어:",
      formatList(compatibilityDiagnosticOnlyForbiddenTerms),
      "위 diagnostic-only 금지 용어는 allowed evidence처럼 보이더라도 사용자용 리포트에서는 완전히 제외하라.",
      "금지 표현: 운명입니다, 운명 확정, 천생연분 확정, 이별 확정, 이혼 확정, 무조건, 반드시, 100%, 소울메이트 확정.",
      "chapter guide:",
      "overview: combined element climate + score.",
      "attraction: day master relation + cross ten-god + branch trine.",
      "strengths: element complement + good fortune.",
      "frictions: branch clash/harm + 원진살.",
      "communication: cross ten-god + MBTI.",
      "relationship_scenes: day branch/month rhythm + MBTI.",
      "money_lifestyle: combined earth + 재고귀인.",
      "conflict_recovery: branch harm/clash + recovery style.",
      "long_term_rules: element complement + branch relation + relationship type.",
      "final_message: 마지막 메시지. finalAdvice는 별도 '오늘부터 할 일' 목록으로 이어지게 써라.",
      "모든 chapter는 directHitScenes를 1개 이상 포함해야 한다.",
      "finalAdvice는 오늘부터 할 수 있는 관계 규칙 3개 이상으로 쓰되, chapter title과 같은 '마지막 조언' 표현을 반복하지 마라.",
      "finalAdvice must be concrete, today-actionable, and relationship-specific.",
      "finalAdvice labels must match content.",
      "finalAdvice labels must be unique where possible.",
      "finalAdvice labels must belong to the relationship type.",
      "relationshipType controls finalAdvice labels. love/some must not use 피드백 규칙, 의사결정, 신뢰 관리, or 업무 기준.",
      "Never use business labels in love/some finalAdvice.",
      "business_work_partner finalAdvice labels should use 의사결정, 역할 분담, 돈과 자원, 피드백 규칙, 갈등 조정, 신뢰 관리, 업무 기준.",
      "Never use romance vocabulary in business/family/friendship.",
      "For business_work_partner, use 협업/역할/책임/권한/피드백/기록 language.",
      "For family, use 가족/생활/정서/말의 통로/역할 language.",
      "Do not prefix a finalAdvice body with another label such as 갈등 회복: or 도움 요청:.",
      "If the label is 도움 요청, the item must be about asking for help, sharing what is needed, or requesting support.",
      "If the item is about 서운함, 갈등, 어긋남, or recovery, label the concept as 갈등 회복 instead of 도움 요청.",
      "Avoid generic finalAdvice like \"서로 이해하세요\".",
      "Each finalAdvice item should name a situation, not just a principle.",
      "Avoid awkward Korean such as 목·금가 or 충가 있어.",
      "Avoid awkward Korean particles such as 정화을, 무토은, Partner A이, Partner B이, 파트너십가, 협업 시너지은.",
      "Avoid awkward Korean particles such as 파트너십가, 관리 부담가, 표현의 온도이, 기준 정리이.",
      "Avoid awkward Korean particles such as 표현의 온도이, 기준 정리이, 관리 부담가, 협업 시너지과, Family A은, Family B은, Partner A은, Partner B은, Partner A을, Partner B을.",
      "Never output 빈 오행. Name the actual weak elements such as 화의 흐름, 화와 수의 흐름, 목과 금의 흐름, or 목·화·수의 흐름.",
      "Write 목과 금의 흐름이 instead of 목·금가.",
      "Write 목과 금의 흐름이 약해 instead of 목·금이 약해.",
      "Write 화와 수의 흐름이 약해 instead of 화·수가 약해.",
      "Write 충이 있어 instead of 충가 있어.",
      "좋은 finalAdvice 예: 중요한 이야기를 시작할 때 먼저 “내가 이해한 건 이거야” 한 문장으로 정리한 뒤 결론을 말하세요.",
      "나쁜 finalAdvice 예: 서로를 이해하세요.",
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
  const unsupportedTerms = collectUnsupportedCompatibilityTerms(input.validationErrors);
  const base = buildOpenAICompatibilityReportWriterMessages({
    evidencePacket: input.evidencePacket,
    allowedSajuTerms: input.allowedSajuTerms,
    allowedMbtiTerms: input.allowedMbtiTerms,
  });

  return {
    system: base.system,
    developer: [
      base.developer,
      "UNSUPPORTED_COMPATIBILITY_TERM 오류가 있으면 해당 term을 모든 필드에서 전부 삭제하라.",
      "Do not replace unsupported terms with another unsupported saju term.",
      "Rewrite affected sentences using only allowed evidence terms.",
      unsupportedTerms.length === 0
        ? "No concrete unsupported terms were parsed from the validator."
        : [
            "Concrete unsupported terms to remove from every field:",
            formatList(unsupportedTerms),
            ...unsupportedTerms.map(
              (term) =>
                `Remove every occurrence of "${term}" from openingSummary, coreLine, keyCompatibilityPoints, chapter title/headline/body, directHitScenes, practicalAdvice, finalAdvice, and safetyNotes.`,
            ),
          ].join("\n"),
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
      "unsupported terms to remove:",
      formatList(unsupportedTerms),
      "previous draft:",
      input.previousDraftText,
      "Return repaired compatibility_v1_draft JSON only.",
    ].join("\n\n"),
  };
}
