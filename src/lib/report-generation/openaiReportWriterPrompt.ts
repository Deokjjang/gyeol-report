import type { ComprehensiveReportEvidencePacket } from "../report-knowledge/comprehensiveReportEvidenceTypes";
import { SAJU_KNOWLEDGE_BASE } from "../report-knowledge/sajuKnowledgeBase";
import type { SajuKnowledgeEntry } from "../report-knowledge/sajuKnowledgeTypes";

export type OpenAIReportWriterMessages = {
  readonly system: string;
  readonly developer: string;
  readonly user: string;
};

function isControlledSajuAlias(entry: SajuKnowledgeEntry, alias: string): boolean {
  const normalizedAlias = alias.trim();

  if (!/[가-힣]/.test(normalizedAlias) || normalizedAlias.length < 2) {
    return false;
  }
  if (normalizedAlias === entry.labelKo) {
    return true;
  }

  switch (entry.category) {
    case "day_pillar":
      return /^[갑을병정무기경신임계][자축인묘진사오미신유술해]$/.test(
        normalizedAlias,
      ) || normalizedAlias.endsWith("일주");
    case "ten_god":
    case "special_pattern":
    case "nobleman":
    case "sinsal":
    case "element_balance":
      return true;
    case "day_master":
    case "five_element":
    case "relationship":
      return false;
  }
}

function createKnownSajuTerms(): readonly string[] {
  return [
    ...new Set(
      SAJU_KNOWLEDGE_BASE.flatMap((entry) => [
        entry.labelKo,
        ...entry.aliases.filter((alias) => isControlledSajuAlias(entry, alias)),
      ])
        .map((term) => term.trim())
        .filter((term) => /[가-힣]/.test(term) && term.length >= 2)
        .sort((left, right) => right.length - left.length),
    ),
  ];
}

export function deriveAllowedSajuTermsFromEvidencePacket(
  packet: ComprehensiveReportEvidencePacket,
): readonly string[] {
  const selectedEntryIds = new Set(packet.sajuEntryIds);
  const selectedEntryTerms = SAJU_KNOWLEDGE_BASE.filter((entry) =>
    selectedEntryIds.has(entry.id),
  ).flatMap((entry) => [entry.labelKo, ...entry.aliases]);
  const primarySajuEvidenceText = packet.sections
    .flatMap((section) => [
      ...section.primarySaju,
    ])
    .flatMap((item) => [item.sourceLabelKo, item.summary, item.sourceId])
    .join("\n");
  const primarySajuEvidenceTerms = createKnownSajuTerms().filter((term) =>
    primarySajuEvidenceText.includes(term),
  );

  return [
    ...new Set(
      [...selectedEntryTerms, ...primarySajuEvidenceTerms]
        .map((term) => term.trim())
        .filter((term) => /[가-힣]/.test(term) && term.length >= 2),
    ),
  ];
}

function normalizeAllowedSajuTerms(terms: readonly string[]): ReadonlySet<string> {
  return new Set(
    terms
      .map((term) => term.trim())
      .map((term) => term.replace(/\s+/g, ""))
      .filter((term) => term.length > 0),
  );
}

function containsUnsupportedPromptSajuTerm(input: {
  readonly text: string;
  readonly allowedTerms: ReadonlySet<string>;
}): boolean {
  return createKnownSajuTerms().some((term) => {
    const normalizedTerm = term.replace(/\s+/g, "");

    return (
      normalizedTerm.length > 2 &&
      !input.allowedTerms.has(normalizedTerm) &&
      input.text.includes(term)
    );
  });
}

function buildPromptEvidencePacket(input: {
  readonly packet: ComprehensiveReportEvidencePacket;
  readonly allowedSajuTerms: readonly string[];
}): ComprehensiveReportEvidencePacket {
  const allowedTerms = normalizeAllowedSajuTerms(input.allowedSajuTerms);

  return {
    ...input.packet,
    sections: input.packet.sections.map((section) => ({
      ...section,
      fusion: section.fusion.filter((item) => {
        const text = [
          item.sourceLabelKo,
          item.summary,
        ].join("\n");

        return !containsUnsupportedPromptSajuTerm({ text, allowedTerms });
      }),
    })),
  };
}

export function buildOpenAIComprehensiveReportWriterMessages(input: {
  readonly userDisplayName?: string;
  readonly mbtiType: string;
  readonly evidencePacket: ComprehensiveReportEvidencePacket;
  readonly allowedSajuTerms?: readonly string[];
}): OpenAIReportWriterMessages {
  const displayName =
    input.userDisplayName !== undefined && input.userDisplayName.trim().length > 0
      ? input.userDisplayName.trim()
      : "사용자";
  const allowedSajuTerms =
    input.allowedSajuTerms ?? deriveAllowedSajuTermsFromEvidencePacket(input.evidencePacket);
  const allowedSajuTermLines =
    allowedSajuTerms.length > 0
      ? allowedSajuTerms.map((term) => `- ${term}`).join("\n")
      : "- 없음";
  const evidenceJson = JSON.stringify(
    buildPromptEvidencePacket({
      packet: input.evidencePacket,
      allowedSajuTerms,
    }),
    null,
    2,
  );

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
      "위 목록에 없는 신살, 귀인, 일주, 십성, 오행, 격국, 패턴은 절대 언급하지 마라.",
      "귀인, 신살, 십성, 오행, 일주 용어를 자연스럽게 사용한다.",
      "내 MBTI가 이래서 그런 줄 알았는데, 사주에도 이 구조가 있었네 느낌을 만든다.",
      "정확한 날짜 예언 금지.",
      "사주 용어를 먼저 쓰고 바로 쉬운 말로 풀어 설명한다.",
      "모든 해석 섹션은 최소 하나의 사주 용어를 쉬운 말로 풀어 설명한다.",
      "사주 용어를 단순 나열하지 말고 그 용어가 왜 행동과 관계와 돈과 일로 이어지는지 설명한다.",
      "display 섹션은 짧게 쓴다.",
      "만세력 표와 MBTI 입력 정보 섹션에서는 내부 사정 언급 금지.",
      "같은 근거를 섹션별로 다르게 풀어라.",
      "수 부족, 화 부족, 무식상, 무인성 같은 반복 근거는 섹션마다 다른 결과로 풀어라.",
      "회복과 표현, 감정 완충, 표현 온도 같은 말을 같은 문장으로 반복하지 마라.",
      "조언은 추상적으로 쓰지 말고 당장 행동으로 옮길 수 있게 구체적으로 써라.",
      "특징 설명형이 아니라 명중형과 처방형으로 쓴다.",
      "덕민님은 이런 편입니다보다 덕민님, 이런 상황 자주 나오지 않나요? 같은 체감형 문장으로 시작한다.",
      "모든 주요 챕터는 체감형 명중 문장, 사주 근거, MBTI 보조 연결, 구체적 장면 예시, 실천 솔루션을 포함한다.",
      "사주 용어를 말한 뒤 실제 행동과 상황으로 맞춰 주고, 바로 어떻게 쓰면 좋은지 처방한다.",
      "각 챕터 안에 이렇게 쓰면 좋습니다, 피해야 할 패턴, 맞는 환경, 관계에서 써먹을 것, 공부/일 루틴 같은 product-facing 처방 문장을 자연스럽게 넣는다.",
      "출력은 comprehensive_v2_draft JSON으로 작성한다.",
      "profileTable은 시스템이 deterministic facts로 붙인다.",
      "너는 profileTable을 출력하지 않는다.",
      "너는 version, productType, openingTitle, openingSummary, coreLine, chapters, finalAdvice, safetyNotes만 출력한다.",
      "각 chapter에는 hitReadingLines를 반드시 작성한다.",
      "hitReadingLines는 “덕민님, 이런 상황 많지 않나요?”처럼 체감형 명중 문장이다.",
      "본문 첫머리도 hitReadingLines 중 하나와 자연스럽게 이어지게 작성한다.",
      "각 chapter에는 solutionLines를 반드시 작성한다.",
      "solutionLines는 사용자가 바로 써먹을 수 있는 실천 솔루션이다.",
      "work_money_study hitReadingLines 예시: 일을 잡으면 초반에는 빠르게 판을 정리하지만, 쉬는 기준은 자주 뒤로 밀릴 수 있습니다.",
      "work_money_study hitReadingLines 예시: 자격증이나 전문서 공부도 왜 써먹는지가 보여야 집중력이 붙는 편입니다.",
      "work_money_study hitReadingLines 예시: 돈은 벌 아이디어보다 지킬 구조가 없을 때 더 빨리 새기 쉽습니다.",
      "love_relationships hitReadingLines 예시: 호감이 있어도 따뜻한 말보다 해결책이 먼저 나갈 수 있습니다.",
      "love_relationships hitReadingLines 예시: 상대가 감정을 말할 때, 덕민님은 위로보다 결론을 먼저 주고 싶어질 수 있습니다.",
      "love_relationships hitReadingLines 예시: 감정 기복이 큰 사람보다 말과 생활이 안정적인 사람이 오래 맞을 가능성이 큽니다.",
      "final_message는 체감형 명중보다 정리와 각인이 우선이다.",
      "final_message hitReadingLines는 있어도 되지만, 마지막 방향성을 짧고 강하게 잡아라.",
      "final_message 좋은 예: 덕민님은 더 세게 밀어붙이는 법보다 덜 닳게 오래 가는 법을 배워야 합니다.",
      "final_message 좋은 예: 지금 필요한 건 의지력이 아니라 회복과 표현을 시스템에 넣는 일입니다.",
      "17개 섹션처럼 잘게 쪼개지 말고 8개 챕터로 작성한다.",
      "각 챕터는 긴 호흡의 해석문이어야 한다.",
      "근거 목록을 따로 보여주지 말고 본문에 녹여라.",
      "공부는 학생 공부뿐 아니라 자격증, 전문서, 직무 학습, 사업 학습까지 포함한다.",
      "연애는 오행적으로 필요한 사람과 MBTI 관계 스타일을 함께 풀어라.",
      "연애는 보완되는 사람, 피해야 할 패턴, MBTI 예시를 단정하지 않는 방식으로 함께 설명한다.",
      "위험과 성장 챕터는 오행 부족/과다에 따른 생활 처방을 넣는다.",
      "수 부족은 밤 산책, 수변 공간, 충분한 수분, 기록, 잠 루틴처럼 말하고, 화 부족은 햇빛, 가벼운 운동, 발표와 표현 연습처럼 말하며, 토 과다는 책임 덜어내기와 경계선 정리로 말한다.",
      "읽는 재미를 위해 비유와 실제 상황 예시를 넣어라.",
      "팩폭은 하되 모욕 금지.",
    ].join("\n"),
    user: [
      `사용자 이름: ${displayName}`,
      `MBTI: ${input.mbtiType}`,
      "이번 리포트에서 사용할 수 있는 사주 용어:",
      allowedSajuTermLines,
      "목록에 없는 신살, 귀인, 일주, 십성, 오행, 격국, 패턴은 절대 언급하지 마라.",
      "출력은 comprehensive_v2_draft JSON 객체 하나만 반환한다.",
      "chapters는 opening, saju_identity, personality_pattern, work_money_study, love_relationships, people_family_environment, risk_and_growth, final_message 8개를 정확히 포함한다.",
      "각 chapter는 chapterId, titleKo, headline, hitReadingLines, body, solutionLines, keyPhrases, sajuTermsUsed, mbtiTermsUsed를 포함한다.",
      "hitReadingLines는 체감형 명중 문장이고, solutionLines는 실천 솔루션이다.",
      "profileTable 필드는 절대 출력하지 않는다.",
      "만세력 요약/profileTable은 시스템이 deterministic facts로 붙인다.",
      "너는 narrative fields만 JSON으로 작성한다.",
      "근거를 별도 목록으로 노출하지 말고 chapter body 안에 자연스럽게 녹인다.",
      "사주 원국 요약과 MBTI 입력 요약은 화면에서 따로 정리되므로 JSON에는 narrative chapters만 충실히 쓴다.",
      "상단 만세력/MBTI 표는 시스템이 결정론적 근거로 렌더링하므로, 모델이 연주, 월주, 시주, 없는 신살, 없는 귀인을 새로 만들지 않는다.",
      "내부 JSON, 내부 식별값, 시스템 사정, 저장 상태를 본문에 쓰지 않는다.",
      "구어체지만 싸구려 느낌 금지.",
      "팩폭은 하되 모욕 금지.",
      "좋은 말은 확실히 말해도 된다.",
      "나쁜 말은 경향/주의로 표현한다.",
      "같은 말 반복 금지.",
      "같은 근거가 반복되더라도 성격, 연애, 돈, 인간관계, 커리어에서는 서로 다른 장면으로 풀어라.",
      "사주 용어를 쉬운 말로 풀어 설명하고, 섹션마다 같은 근거를 다른 결과로 풀어라.",
      "구체적인 조언을 써라. 추상적인 좋은 말로 끝내지 마라.",
      "나쁜 예: 편관과 정관은 책임과 기준입니다.",
      "좋은 예: 편관은 덕민님을 편하게 두지 않는 압박입니다. 문제가 생기면 내가 처리해야 한다는 감각이 먼저 올라옵니다. 정관은 그 압박을 공식 역할과 명예로 정리하려는 힘입니다.",
      "나쁜 예: 회복을 보완해야 합니다.",
      "좋은 예: 하루 중 아무 성과도 내지 않는 시간을 일정표에 넣어야 합니다. 덕민님에게 휴식은 감정 문제가 아니라 성능 유지 장치입니다.",
      "좋은 예: 사주상 갑신일주와 편관 구조가 먼저 보입니다. 여기에 입력하신 ENTJ의 해결 중심 성향이 겹치면서, 덕민님은 문제를 보면 기다리기보다 바로 구조를 잡으려는 쪽으로 드러납니다.",
      "나쁜 예: ENTJ라서 리더십이 강합니다.",
      "좋은 직설 예: 사람을 싫어하는 건 아닌데, 비효율적인 사람을 오래 기다리는 데 에너지를 많이 씁니다.",
      "좋은 명중 예: 덕민님, 회의나 대화에서 상대가 한참 설명하기 전에 이미 결론이 보이는 상황 많지 않나요? 문제는 그 결론이 맞아도 상대는 내 말을 자른다고 느낄 수 있다는 점입니다.",
      "좋은 처방 예: 이렇게 쓰면 좋습니다. 결론을 바로 말하기 전에 질문을 한 번 던지세요. 그래서 지금 핵심은 뭐라고 보세요? 이 한 문장만 넣어도 날카로움이 조언으로 바뀝니다.",
      "나쁜 약한 예: 관계에서 표현을 보완하면 좋습니다.",
      "saju_identity는 일간, 일주, 오행, 십성, 신살, 귀인 중심으로 이 사람의 기본 형상을 길게 설명한다.",
      "personality_pattern은 성격, 판단 방식, 말투, 감정 처리, 내면 긴장까지 연결한다.",
      "work_money_study는 일, 직업, 돈, 자산, 공부, 자격증, 직무 학습, 사업 학습을 하나의 성장과 성과 챕터로 연결한다.",
      "work_money_study에는 공부/일 루틴, 자격증이나 전문서 접근법, 직무 학습, 사업 학습, 돈 버는 방식, 돈 지키는 방식, 번아웃 방지를 넣는다.",
      "love_relationships는 연애, 이상형, 표현 방식, 만나는 환경, 약점과 보완 상대를 함께 설명한다.",
      "love_relationships에는 부족한 수/화 기운을 보완하는 사람, 정서적 완충이 되는 사람, 피해야 할 패턴, ISFP, INFP, INTP 같은 MBTI 예시를 단정하지 않는 방식으로 넣는다.",
      "people_family_environment는 인간관계, 가족, 독립성, 맞는 환경, 피해야 할 환경을 다룬다.",
      "people_family_environment에는 가까운 사람에게 더 엄격해지는 장면, 혼자 처리하고 지치는 장면, 가족과 책임 범위를 문장으로 정리하는 처방을 넣는다.",
      "risk_and_growth는 반복되는 인생 패턴, 약점, 과열, 고립, 성장 전략을 다룬다.",
      "risk_and_growth에는 밤 산책, 수변 공간, 충분한 수분, 깊은 사색과 기록, 잠 루틴, 햇빛, 가벼운 운동, 발표와 표현 연습, 책임 덜어내기, 경계선 긋기 같은 생활 처방을 넣는다.",
      "final_message는 짧은 위로가 아니라 방향성 있는 마무리로 쓴다.",
      "final_message는 체감형 명중보다 정리와 각인이 우선이다.",
      "final_message hitReadingLines는 있어도 되지만, 마지막 방향성을 짧고 강하게 잡아라.",
      "final_message 좋은 예: 덕민님은 더 세게 밀어붙이는 법보다 덜 닳게 오래 가는 법을 배워야 합니다.",
      "final_message 좋은 예: 지금 필요한 건 의지력이 아니라 회복과 표현을 시스템에 넣는 일입니다.",
      "결정적 예언, 정확한 날짜 예언, 건강/법률/투자 보장 금지.",
      "아래 제공된 근거 JSON 안에 있는 근거만 사용한다.",
      "제공된 근거 JSON:",
      evidenceJson,
    ].join("\n"),
  };
}
