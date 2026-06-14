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
      "공통점은 서로 강화되는 흐름으로 설명한다.",
      "차이점은 차이, 대비, 긴장으로 설명한다.",
      "보완점과 부족한 부분은 보완 흐름으로 설명한다.",
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
      "특징 설명형이 아니라 명중형과 조언형으로 쓴다.",
      "덕민님은 이런 편입니다보다 덕민님, 이런 상황 자주 나오지 않나요? 같은 체감형 문장으로 시작한다.",
      "모든 주요 챕터는 체감형 명중 문장, 사주 근거, MBTI 보조 연결, 구체적 장면 예시, 실천 솔루션을 포함한다.",
      "사주 용어를 말한 뒤 실제 행동과 상황으로 맞춰 주고, 바로 어떻게 쓰면 좋은지 생활 조언과 운영법으로 연결한다.",
      "hitReadingLines와 solutionLines는 본문에 자연스럽게 녹일 것.",
      "이런 장면 있지 않나요 / 이렇게 쓰면 좋습니다 라벨 금지.",
      "solutionLines는 별도 체크리스트처럼 보이게 쓰지 말고 chapter body와 이어지는 자연스러운 운영법 문장으로 쓴다.",
      "출력은 comprehensive_v2_draft JSON으로 작성한다.",
      "만세력 및 명리학 표는 deterministic profileTable로 제공된다.",
      "profileTable은 시스템이 deterministic facts로 붙인다.",
      "너는 profileTable을 출력하지 않는다.",
      "너는 version, productType, openingTitle, openingSummary, coreLine, chapters, finalAdvice, safetyNotes만 출력한다.",
      "각 chapter에는 hitReadingLines를 반드시 작성한다.",
      "hitReadingLines는 “덕민님, 이런 상황 많지 않나요?”처럼 체감형 명중 문장이다.",
      "본문 첫머리도 hitReadingLines 중 하나와 자연스럽게 이어지게 작성한다.",
      "각 chapter에는 solutionLines를 반드시 작성한다.",
      "solutionLines는 사용자가 바로 써먹을 수 있는 실천 솔루션이다.",
      "일상 장면을 구체적으로 쓸 것.",
      "각 주요 챕터에는 회의, 카톡, 가족, 팀, 업무, 공부, 자격증, 전문서, 계좌, 침대, 밤 산책 같은 실제 생활 장면을 최소 2개 이상 넣는다.",
      "MBTI 보조 해석을 충분히 쓸 것.",
      "MBTI는 사주 뒤에 붙는 보조 언어지만, 각 주요 챕터에서 ENTJ식 효율, 목표, 역할 정리, 빠른 결론, 해결 중심, 지휘 욕구, 애매함을 불편해하는 패턴 중 하나 이상을 구체적으로 연결한다.",
      "입력한 MBTI 기준으로 보면, ENTJ 성향으로 설명하면, MBTI 언어로 번역하면 같은 안전한 표현을 사용한다.",
      "MBTI가 증명합니다, ENTJ라서 무조건, 공식 MBTI 검사 결과상 같은 표현은 금지한다.",
      "work_money_study hitReadingLines 예시: 일을 잡으면 초반에는 빠르게 판을 정리하지만, 쉬는 기준은 자주 뒤로 밀릴 수 있습니다.",
      "work_money_study hitReadingLines 예시: 자격증이나 전문서 공부도 왜 써먹는지가 보여야 집중력이 붙는 편입니다.",
      "work_money_study hitReadingLines 예시: 돈은 벌 아이디어보다 지킬 구조가 없을 때 더 빨리 새기 쉽습니다.",
      "love_relationships hitReadingLines 예시: 호감이 있어도 따뜻한 말보다 해결책이 먼저 나갈 수 있습니다.",
      "love_relationships hitReadingLines 예시: 상대가 감정을 말할 때, 덕민님은 위로보다 결론을 먼저 주고 싶어질 수 있습니다.",
      "love_relationships hitReadingLines 예시: 감정 기복이 큰 사람보다 말과 생활이 안정적인 사람이 오래 맞을 가능성이 큽니다.",
      "love_relationships.solutionLines는 반드시 맞는 상대, 피해야 할 상대, 보완 기운, MBTI 예시 4가지 생활 조언을 각각 포함한다.",
      "맞는 상대: 감정을 천천히 풀어주고 과열을 식혀주는 사람처럼 partner traits를 구체적으로 쓴다.",
      "피해야 할 상대: 감정 기복이 크고 책임이 흐릿한 사람처럼 bad match pattern을 구체적으로 쓴다.",
      "보완 기운: 수 부족, 화 부족, 토 과다 같은 오행 흐름과 감정 완충, 표현 온도를 연결한다.",
      "MBTI 예시: ISFP, INFP, INTP 같은 예시는 보완적으로 느껴질 수 있다고만 쓰고, MBTI만으로 궁합을 단정하지 않는다.",
      "final_message는 긴 마무리 챕터로 쓸 것.",
      "final_message는 체감형 명중보다 정리와 각인이 우선이다.",
      "final_message hitReadingLines는 있어도 되지만, 마지막 방향성을 짧고 강하게 잡아라.",
      "final_message body는 충분히 길게 쓰고, 전체 핵심 재정리, 사주 핵심 구조, MBTI 보조 해석, 일/관계/돈/회복 중 최소 3개 실천 방향, 오늘부터 할 수 있는 작은 실행 3개 이상을 포함한다.",
      "final_message.solutionLines는 최소 4개를 작성한다.",
      "final_message 좋은 예: 덕민님은 더 세게 밀어붙이는 법보다 덜 닳게 오래 가는 법을 배워야 합니다.",
      "final_message 좋은 예: 지금 필요한 건 의지력이 아니라 회복과 표현을 시스템에 넣는 일입니다.",
      "17개 섹션처럼 잘게 쪼개지 말고 8개 챕터로 작성한다.",
      "각 챕터는 긴 호흡의 해석문이어야 한다.",
      "근거 목록을 따로 보여주지 말고 본문에 녹여라.",
      "체감 장면 → 사주 근거 → MBTI 체감 번역 → 현실에서 생기는 비용 → 실제 운영법 순서로 자연스럽게 이어라.",
      "모든 챕터를 같은 구조로 쓰지 마라.",
      "모든 챕터를 덕민님, 으로 시작하지 마라.",
      "hitReadingLines를 그대로 반복하지 말고 본문 문맥에 자연스럽게 녹여라.",
      "같은 단어를 반복하지 말고 구조는 틀, 방식, 흐름, 판, 장치, 리듬, 작동 방식으로 바꿔 쓰고, 책임은 역할, 부담, 맡은 일, 짐, 담당 범위, 의무감으로 바꿔 쓴다.",
      "기준은 선, 판단선, 원칙, 규칙, 구분점으로, 회복은 식히기, 쉬는 장치, 재정비, 숨 돌리기로, 표현은 말의 온도, 드러내는 방식, 전달 방식으로 바꿔 쓴다.",
      "공부는 학생 공부뿐 아니라 자격증, 전문서, 직무 학습, 사업 학습까지 포함한다.",
      "연애는 오행적으로 필요한 사람과 MBTI 관계 스타일을 함께 풀어라.",
      "연애는 보완되는 사람, 피해야 할 패턴, MBTI 예시를 단정하지 않는 방식으로 함께 설명한다.",
      "위험과 성장 챕터는 오행 부족/과다에 따른 생활 조언을 넣는다.",
      "수 부족은 밤 산책, 수변 공간, 충분한 수분, 기록, 잠 루틴처럼 말하고, 화 부족은 햇빛, 가벼운 운동, 발표와 표현 연습처럼 말하며, 토 과다는 책임 덜어내기와 경계선 정리로 말한다.",
      "읽는 재미를 위해 비유와 실제 상황 예시를 넣어라.",
      "사용자에게 보이는 리포트 본문에 의료·심리치료·법률·투자 자문처럼 보이는 표현을 쓰지 마라.",
      "금지: 진단, 치료, 정신질환, 우울증, 불안장애, 투자 추천, 법률 자문, 반드시, 무조건, 100%, 보장, 운명 확정.",
      "리포트 본문에는 의료·심리치료 관련 단어를 쓰지 마라.",
      "특히 치료, 진단, 우울증, 불안장애, 정신질환이라는 단어는 금지한다.",
      "최종 리포트 본문에 \"치료\"라는 단어를 쓰지 마라. 회복/관리/조정/생활 루틴으로 표현하라.",
      "\"문서\", \"초안\", \"원고\", \"텍스트\" 같은 제작물 메타 표현을 쓰지 마라.",
      "영어 단어 contrast/output/draft를 쓰지 마라.",
      "정책성 disclaimer를 본문에 넣지 말고, 성향 해석과 생활 조언으로만 작성한다.",
      "치료는 관리, 조정, 생활 조언, 운영법으로 바꿔라.",
      "문서는 리포트, 결과, 해석 또는 문맥상 자연스러운 표현으로 바꿔라.",
      "처방이라는 단어도 과하게 쓰지 말고 생활 조언, 운영법, 조정법으로 바꿔라.",
      "영어 템플릿 단어 금지: contrast, output, input, profileTable, schema, JSON, draft.",
      "contrast는 차이, 대비, 긴장으로 바꿔라.",
      "성향 해석과 자기이해 목적의 참고 문장으로 작성하라.",
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
      "hitReadingLines와 solutionLines는 최종 본문에 자연스럽게 녹일 재료다. 이런 장면 있지 않나요? / 이렇게 쓰면 좋습니다 같은 라벨을 body에 쓰지 마라.",
      "profileTable 필드는 절대 출력하지 않는다.",
      "만세력 및 명리학 표는 deterministic profileTable로 제공된다.",
      "만세력 및 명리학 표/profileTable은 시스템이 deterministic facts로 붙인다.",
      "너는 narrative fields만 JSON으로 작성한다.",
      "근거를 별도 목록으로 노출하지 말고 chapter body 안에 자연스럽게 녹인다.",
      "사주 원국 요약과 MBTI 입력 요약은 화면에서 따로 정리되므로 JSON에는 narrative chapters만 충실히 쓴다.",
      "상단 만세력/MBTI 표는 시스템이 결정론적 근거로 렌더링하므로, 모델이 연주, 월주, 시주, 없는 신살, 없는 귀인을 새로 만들지 않는다.",
      "내부 JSON, 내부 식별값, 시스템 사정, 저장 상태를 본문에 쓰지 않는다.",
      "최종 사용자에게 보이는 본문에 제작 과정 표현을 쓰지 마라.",
      "금지: 초안, 원고, 작성된 글, 생성된 내용, 문서, 텍스트, JSON, 프롬프트, OpenAI.",
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
      "좋은 생활 조언 예: 결론을 바로 말하기 전에 질문을 한 번 던지세요. 그래서 지금 핵심은 뭐라고 보세요? 이 한 문장만 넣어도 날카로움이 조언으로 바뀝니다.",
      "나쁜 약한 예: 관계에서 표현을 보완하면 좋습니다.",
      "saju_identity는 일간, 일주, 오행, 십성, 신살, 귀인 중심으로 이 사람의 기본 형상을 길게 설명한다.",
      "personality_pattern은 성격, 판단 방식, 말투, 감정 처리, 내면 긴장까지 연결한다.",
      "work_money_study는 일, 직업, 돈, 자산, 공부, 자격증, 직무 학습, 사업 학습을 하나의 성장과 성과 챕터로 연결한다.",
      "work_money_study에는 공부/일 루틴, 자격증이나 전문서 접근법, 직무 학습, 사업 학습, 돈 버는 방식, 돈 지키는 방식, 번아웃 방지를 넣는다.",
      "work_money_study에는 자격증 공부를 시작했지만 목적이 안 보이면 금방 식는 장면, 전문서를 읽을 때 목차와 실전 적용 포인트부터 보는 장면, 업무에서 누가 정리하지 않으면 본인이 표와 기준을 만드는 장면, 돈을 벌 방법은 빨리 보지만 계좌 분리와 방어 규칙이 없으면 새는 장면을 구체적으로 넣는다.",
      "love_relationships는 연애, 이상형, 표현 방식, 만나는 환경, 약점과 보완 상대를 함께 설명한다.",
      "love_relationships에는 상대가 서운함을 말했는데 위로보다 해결책이 먼저 나가는 장면, 호감은 있는데 말투가 업무 보고처럼 나가는 장면, 감정 기복이 큰 사람에게 처음엔 끌려도 나중에 피곤해지는 장면, 데이트에서 분위기보다 약속 습관과 생활 리듬을 더 보게 되는 장면을 구체적으로 넣는다.",
      "love_relationships에는 부족한 수/화 기운을 보완하는 사람, 정서적 완충이 되는 사람, 피해야 할 패턴, ISFP, INFP, INTP 같은 MBTI 예시를 단정하지 않는 방식으로 넣는다.",
      "love_relationships.solutionLines에는 반드시 맞는 상대: ..., 피해야 할 상대: ..., 보완 기운: ..., MBTI 예시: ... 형식의 실천 조언을 넣는다.",
      "MBTI 예시 줄에는 MBTI만으로 궁합을 단정하지 않는다는 주의를 함께 넣는다.",
      "people_family_environment는 인간관계, 가족, 독립성, 맞는 환경, 피해야 할 환경을 다룬다.",
      "people_family_environment에는 가족이나 가까운 사람이 부탁하면 거절보다 해결이 먼저 나오는 장면, 팀 프로젝트에서 역할이 흐리면 본인이 결국 정리하게 되는 장면, 말이 자주 바뀌는 환경에서 급격히 피곤해지는 장면을 넣는다.",
      "people_family_environment에는 가까운 사람에게 더 엄격해지는 장면, 혼자 처리하고 지치는 장면, 가족과 책임 범위를 문장으로 정리하는 조언을 넣는다.",
      "risk_and_growth는 반복되는 인생 패턴, 약점, 과열, 고립, 성장 전략을 다룬다.",
      "risk_and_growth에는 침대에 누웠는데 머릿속으로 다음 일정과 문제를 계속 굴리는 장면, 피곤한데도 조금만 더 하면 끝난다고 밀어붙이는 장면, 휴식 시간을 잡아도 실제로는 일 생각을 하는 장면을 넣는다.",
      "risk_and_growth에는 밤 산책, 수변 공간, 충분한 수분, 깊은 사색과 기록, 잠 루틴, 햇빛, 가벼운 운동, 발표와 표현 연습, 책임 덜어내기, 경계선 긋기 같은 생활 조언을 넣는다.",
      "risk_and_growth 좋은 예: 덕민님은 지치기 전까지 멈추는 신호를 잘 못 보는 편일 수 있습니다.",
      "risk_and_growth 좋은 예: 문제는 체력이 약해서가 아니라, 책임을 내려놓는 기준이 늦게 생긴다는 점입니다.",
      "risk_and_growth 좋은 예: 수 부족은 쉬어도 머리가 계속 켜져 있는 식으로 나타날 수 있으니, 밤 산책·수면·기록 같은 식히는 루틴이 필요합니다.",
      "risk_and_growth 좋은 예: 화 부족은 표현을 늦게 만들 수 있으니, 짧은 칭찬과 감정 표현을 의식적으로 밖으로 내야 합니다.",
      "risk_and_growth 좋은 예: 토 과다는 책임을 쌓아두게 하므로, 맡을 일과 버릴 일을 명확히 나눠야 합니다.",
      "final_message는 짧은 위로가 아니라 방향성 있는 마무리로 쓴다.",
      "final_message는 긴 마무리 챕터로 쓰고 finalAdvice와 중복되지 않게 전체 방향을 정리한다.",
      "final_message는 체감형 명중보다 정리와 각인이 우선이다.",
      "final_message hitReadingLines는 있어도 되지만, 마지막 방향성을 짧고 강하게 잡아라.",
      "final_message body에는 사주 핵심 구조, MBTI 보조 해석, 일/관계/돈/회복 중 최소 3개 실천 방향, 오늘부터 할 수 있는 작은 실행 3개 이상을 포함한다.",
      "final_message.solutionLines는 최소 4개를 작성한다.",
      "final_message 좋은 예: 덕민님은 더 세게 밀어붙이는 법보다 덜 닳게 오래 가는 법을 배워야 합니다.",
      "final_message 좋은 예: 지금 필요한 건 의지력이 아니라 회복과 표현을 시스템에 넣는 일입니다.",
      "결정적 예언, 정확한 날짜 예언, 건강/법률/투자 보장 금지.",
      "사용자에게 보이는 리포트 본문에 의료·심리치료·법률·투자 자문처럼 보이는 표현을 쓰지 마라.",
      "금지: 진단, 치료, 정신질환, 우울증, 불안장애, 투자 추천, 법률 자문, 반드시, 무조건, 100%, 보장, 운명 확정.",
      "리포트 본문에는 의료·심리치료 관련 단어를 쓰지 마라. 특히 치료, 진단, 우울증, 불안장애, 정신질환이라는 단어는 금지한다.",
      "정책성 disclaimer를 본문에 넣지 말고 성향 해석과 생활 조언으로만 작성한다.",
      "영어 템플릿 단어 contrast, output, input, profileTable, schema, JSON, draft를 본문에 쓰지 마라.",
      "성향 해석과 자기이해 목적의 참고 문장으로 작성하라.",
      "아래 제공된 근거 JSON 안에 있는 근거만 사용한다.",
      "제공된 근거 JSON:",
      evidenceJson,
    ].join("\n"),
  };
}

export function buildOpenAIComprehensiveReportRepairMessages(input: {
  readonly userDisplayName?: string;
  readonly mbtiType: string;
  readonly allowedSajuTerms: readonly string[];
  readonly draftJson: string;
  readonly validationErrors: readonly string[];
}): OpenAIReportWriterMessages {
  const displayName =
    input.userDisplayName !== undefined && input.userDisplayName.trim().length > 0
      ? input.userDisplayName.trim()
      : "사용자";
  const allowedSajuTermLines =
    input.allowedSajuTerms.length > 0
      ? input.allowedSajuTerms.map((term) => `- ${term}`).join("\n")
      : "- 없음";

  return {
    system: [
      "You are repairing a Korean Saju-first paid report JSON.",
      "Use the same JSON schema as the original comprehensive_v2_draft narrative output.",
      "Return valid JSON only.",
      "Do not output profileTable.",
      "Do not invent Saju facts.",
      "Use only the allowed Saju terms.",
      "Do not make MBTI the primary source.",
    ].join("\n"),
    developer: [
      "다음 JSON을 같은 schema로 다시 작성하라.",
      "절대 profileTable을 출력하지 않는다.",
      "profileTable 출력 금지.",
      "아래 validation errors만 고쳐라.",
      "사주 용어는 evidence에 있는 것만 사용하라.",
      "목록에 없는 신살, 귀인, 일주, 십성, 오행, 격국, 패턴은 절대 언급하지 마라.",
      "본문을 더 길고 구체적으로 보강하라.",
      "사용자에게 보이는 본문에서 초안, 원고, 작성된 글, 생성된 내용, 문서, 텍스트 같은 제작/작성 메타 표현을 제거하라.",
      "같은 의미를 자연스러운 리포트 문장으로 바꿔라.",
      "예: 이 초안에서는 금지. 초안에서는, 작성된 글은, 이 문서는 같은 표현은 삭제하고 바로 해석을 시작하라.",
      "hitReadingLines를 실제 장면 중심으로 바꿔라.",
      "solutionLines를 구체적 운영법으로 바꿔라.",
      "hitReadingLines와 solutionLines는 body와 자연스럽게 이어지는 문장 재료로 작성한다.",
      "이런 장면 있지 않나요? / 이렇게 쓰면 좋습니다 같은 라벨을 본문에 쓰지 마라.",
      "일상 장면은 회의, 카톡, 가족, 팀, 업무, 공부, 자격증, 전문서, 계좌, 침대, 밤 산책처럼 구체적으로 보강한다.",
      "MBTI 보조 해석은 ENTJ식 효율, 목표, 역할 정리, 빠른 결론, 해결 중심, 애매함을 불편해하는 패턴 중 하나 이상으로 보강한다.",
      "love_relationships.solutionLines는 맞는 상대, 피해야 할 상대, 보완 기운, MBTI 예시를 모두 포함한다.",
      "MBTI 예시에는 MBTI만으로 궁합을 단정하지 않는다는 주의를 넣는다.",
      "work_money_study는 자격증, 전문서, 직무 학습, 사업 학습 중 하나 이상을 포함한다.",
      "risk_and_growth는 수/화/토 등 오행 보완 생활 조언을 포함한다.",
      "사용자에게 보이는 본문에서 진단, 치료, 정신질환, 우울증, 불안장애, 투자 추천, 법률 자문, 반드시, 무조건, 100%, 보장, 운명 확정 같은 위험 문구를 제거한다.",
      "치료는 관리, 조정, 생활 조언, 운영법으로 바꿔라.",
      "문서는 리포트 또는 문맥상 자연스러운 표현으로 바꿔라.",
      "영어 단어 contrast는 차이, 대비, 긴장으로 바꿔라.",
      "영어 단어 output은 표현으로, draft는 리포트로 바꿔라.",
      "반복된 문장은 하나만 남기거나 서로 다른 표현으로 바꿔라.",
      "contrast, output, input, profileTable, schema, JSON, draft 같은 영어 템플릿 단어를 제거한다.",
      "성향 해석과 자기이해 목적의 참고 문장으로 고친다.",
      "risk_and_growth는 지치기 전 멈추는 신호, 책임을 내려놓는 기준, 밤 산책·수면·기록, 짧은 감정 표현, 맡을 일과 버릴 일 구분을 구체적으로 보강한다.",
      "final_message는 긴 마무리 챕터로 보강한다.",
      "final_message는 체감형 명중보다 정리와 각인이 우선이다.",
      "final_message body는 전체 핵심 재정리, 사주 핵심 구조, MBTI 보조 해석, 일/관계/돈/회복 중 최소 3개 실천 방향, 오늘부터 할 수 있는 작은 실행 3개 이상을 포함한다.",
      "final_message.solutionLines는 최소 4개를 작성한다.",
    ].join("\n"),
    user: [
      `사용자 이름: ${displayName}`,
      `MBTI: ${input.mbtiType}`,
      "이번 repair에서 사용할 수 있는 사주 용어:",
      allowedSajuTermLines,
      "validation errors:",
      ...input.validationErrors.map((error) => `- ${error}`),
      "수정할 기존 JSON:",
      input.draftJson,
      "위 JSON을 comprehensive_v2_draft narrative fields만 포함하는 JSON으로 다시 작성하라.",
      "version, productType, openingTitle, openingSummary, coreLine, chapters, finalAdvice, safetyNotes만 출력한다.",
      "chapterId, titleKo, headline, hitReadingLines, body, solutionLines, keyPhrases, sajuTermsUsed, mbtiTermsUsed를 유지한다.",
      "profileTable은 시스템이 deterministic facts로 붙이므로 절대 출력하지 않는다.",
    ].join("\n"),
  };
}
