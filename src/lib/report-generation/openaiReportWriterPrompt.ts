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

const representativeSajuLeakGuardTerms = [
  "수 부족",
  "화 부족",
  "목 부족",
  "금 부족",
  "토 부족",
  "목 과다",
  "화 과다",
  "토 과다",
  "금 과다",
  "수 과다",
  "갑신일주",
  "정축일주",
  "현침살",
  "홍염살",
  "공망",
  "금여록",
  "재다신약",
  "양인살",
  "천을귀인",
  "재고귀인",
  "암록",
  "천문성",
  "원진살",
  "역마살",
  "화개살",
  "월살",
  "육해살",
] as const;

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
  const selectedFeatureTerms =
    packet.selectedSajuFeatureEvidence?.flatMap((chapter) =>
      chapter.features.flatMap((feature) => [feature.labelKo]),
    ) ?? [];

  return [
    ...new Set(
      [...selectedEntryTerms, ...primarySajuEvidenceTerms, ...selectedFeatureTerms]
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

function createForbiddenSajuTerms(input: {
  readonly allowedSajuTerms: readonly string[];
  readonly limit?: number;
}): readonly string[] {
  const limit = input.limit ?? 24;
  const allowedTerms = normalizeAllowedSajuTerms(input.allowedSajuTerms);
  const candidates = [
    ...representativeSajuLeakGuardTerms,
    ...createKnownSajuTerms(),
  ];

  return [
    ...new Set(
      candidates
        .map((term) => term.trim())
        .filter((term) => /[가-힣]/.test(term) && term.length >= 2)
        .filter((term) => !allowedTerms.has(term.replace(/\s+/g, ""))),
    ),
  ].slice(0, limit);
}

function formatSajuTermLines(terms: readonly string[]): string {
  return terms.length > 0 ? terms.map((term) => `- ${term}`).join("\n") : "- 없음";
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
      : "당신";
  const allowedSajuTerms =
    input.allowedSajuTerms ?? deriveAllowedSajuTermsFromEvidencePacket(input.evidencePacket);
  const allowedSajuTermLines = formatSajuTermLines(allowedSajuTerms);
  const forbiddenSajuTermLines = formatSajuTermLines(
    createForbiddenSajuTerms({ allowedSajuTerms }),
  );
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
      "이 리포트에서 사용할 수 있는 사주 항목은 selected/computed 목록에 있는 항목뿐이다.",
      "목록에 없는 사주 용어는 쓰지 마라.",
      "예시 문장에 나온 항목이라도 이번 원국에 없으면 절대 쓰지 마라.",
      "Do not make MBTI the primary source.",
      "Write in Korean.",
      "Use a conversational but expert tone.",
      "Be direct and vivid without insulting the reader.",
      "Korean output must be valid JSON only.",
      "차별화 모듈은 리포트를 재미있게 읽히게 하는 핵심 장치다.",
      "reportDifferentiationModules가 제공되면 제목을 그대로 복사하지 말고 각 챕터 문맥에 자연스럽게 반영하라.",
      "sajuSymbolicNickname이 제공되면 사주 한줄 별칭으로 opening 또는 saju_identity에서 자연스럽게 풀어써라.",
      "사주 한줄 별칭은 본문을 재미있고 기억에 남게 만드는 장치다. 그대로 반복만 하지 말고 상징 이미지를 생활 언어로 연결하라.",
      "지지 동물 상징은 단일 띠 풀이로 쓰지 말고 지지, 오행, 계절, 기둥 위치, 십성, 신살·귀인과 함께 묶어 설명하라.",
      "예: 돼지라서 먹을 복이 많다는 식으로 단순화하지 말고, 亥는 돼지·수·겨울의 저장성과 감정, 쉼, 자원을 품는 기운으로 설명하라.",
      "사용자님, 고객님, 유저님이라는 호칭을 쓰지 마라. 이름이 있으면 이름+님을 쓰고, 없으면 이 사주에서, 이 리포트에서, 당신은처럼 중립적으로 써라.",
      "MBTI는 공식 진단이 아니라 사용자가 직접 입력한 자기보고 성향 언어다.",
      "MBTI는 사주 구조를 이해하기 쉽게 번역하는 행동 언어 보조 레이어다.",
      "MBTI는 별도 설명 섹션으로 빼지 말고 각 챕터의 생활 장면에 자연스럽게 녹여라.",
      "MBTI 특징은 단순 E/I, T/F 설명으로 쓰지 말고, selectedMbtiKnowledge와 sajuMbtiBridgeEvidence의 구체 장면을 사용하라.",
      "사주 feature와 MBTI trait가 겹치는 부분은 이래서 더 선명하게 보인다로 설명하고, 충돌하는 부분은 그래서 운영법이 필요하다로 설명하라.",
      "종합 리포트에서는 MBTI 후보 유형 추천을 하지 마라.",
      "세운, 대운, 날짜 선택 상품에서는 MBTI를 기본 분석 근거로 쓰지 않는다.",
      "궁합, 커리어, 종합 리포트에서는 MBTI를 행동 장면과 소통 방식의 보조 설명으로만 사용한다.",
      "특히 찔리는 일상 장면과 바꾸는 스위치를 최소 1회 이상 본문에 녹여라.",
      "재미는 가벼운 농담이 아니라, 구체 장면과 비유에서 나온다.",
      "각 챕터는 같은 결론을 반복하지 말고 서로 다른 정보 역할을 가져야 한다.",
      "한눈에 보는 결: 전체 핵심과 가장 눈에 띄는 사주·MBTI 겹침.",
      "사주 핵심: 일주, 귀인, 신살, 오행 구조.",
      "성격: 판단 속도, 말투, 대화/카톡/수업/팀플에서 드러나는 장면.",
      "일·돈·공부: 돈, 계좌, 자격증, 전문서, 알바/업무, 프로젝트, 실전 적용.",
      "연애와 관계: 표현 온도, 약속 습관, 감정 처리 속도.",
      "사람·가족·환경: 가족 부탁, 친구/팀플/업무 역할, 경계선.",
      "위험과 성장: 수·화 보완, 루틴, 회복 장치.",
      "마지막 조언: 오늘부터 할 일 3개.",
      "직장인에게만 맞는 회의 장면에 치우치지 말고, 수업·팀플·카톡·친구·가족·알바·업무·돈·잠들기 전 장면을 섞어라.",
      "좋은 기운은 읽으면서 기분 좋게 느껴지도록 상징과 활용을 설명하라.",
      "주의 기운은 겁주는 대신 반복 패턴과 바꾸는 스위치로 설명하라.",
      "한눈 요약은 전체 결론, 사주 핵심은 일주·귀인·신살 구조, 성격은 판단 속도와 말투, 일·돈·공부는 계좌·자격증·전문서·업무 기준을 맡는다.",
      "연애는 표현 온도와 상대 선택 조건, 가족·환경은 역할 경계와 요청 방식, 위험·성장은 수화 보완과 루틴, 마무리는 3개 실행 계획을 맡는다.",
      "MBTI 보완 유형 추천 목록을 쓰지 말고, 현재 사용자의 MBTI를 관계 행동과 대화 방식의 보조 언어로만 사용하라.",
      "과장할 수 있는 것은 상징 이미지와 체감 장면이고, 결과 보장은 하지 마라.",
    ].join("\n"),
    developer: [
      "사주가 1차 근거다.",
      "MBTI는 보조 근거다.",
      "공통 만세력표는 시스템이 따로 렌더링하는 근거표다. writer는 표를 다시 만들지 말고, 본문에서는 신살·귀인·합충·지장간을 사용자 언어로 해석하는 sajuFeatureChapter 원칙을 지킨다.",
      "sajuFeatureChapter는 명칭, 쉬운 뜻, 내 구조에서 드러나는 방식, 잘 쓰면 강점, 과하면 피로, 실제로 쓰는 법을 모두 포함하는 장문 해석 챕터다.",
      "sajuFeatureChapter와 장문 본문에는 공통 만세력표, featureDictionary, selected evidence에 실제로 있는 feature만 사용한다.",
      "공통 만세력표에 없고 evidence builder가 구조 판단으로 명시하지 않은 신살·귀인·십이신살·합충형파해는 절대 새로 넣지 않는다.",
      "feature는 같은 층위로 섞지 말고 일주 구조, 오행 구조, 십성 구조, 신살·귀인, 합충형파해, 지장간, 구조 판단으로 구분해서 읽는다.",
      "오행 분포는 별도 생활 에너지 해석으로 풀어라. 목은 방향성과 성장, 화는 표현 온도와 즐거움, 토는 책임과 현실감, 금은 판단과 정리력, 수는 회복과 감정 완충으로 번역한다.",
      "화 0, 수 0처럼 비어 있는 오행은 결핍 예언이 아니라 의식적으로 만들어야 할 표현 온도와 회복 루틴으로 설명한다.",
      "신살·귀인·합충·지장간 raw label만 단독으로 보여주지 말고, 말투·판단 속도·관계 반응·일 처리 패턴·회복 루틴으로 번역하라.",
      "selectedMbtiKnowledge는 입력된 MBTI의 구체 행동 seed다. 별도 MBTI 섹션을 만들지 말고 각 chapter에 필요한 장면만 골라 녹여라.",
      "MBTI DB의 topic traits, function stack, keywords, reportUseCases, myeongliBridgeHints를 적극 활용하되 원문을 복붙하지 말고 명리 구조가 MBTI 성향에서 어떻게 드러나는지로 재해석하라.",
      "selectedMbtiKnowledge의 label, seed label, 단서 이름은 사용자 문장에 그대로 쓰지 말고 의미만 문장 안에 녹여라.",
      "ENTJ는..., 대담한 통솔자 성향은... 같은 별도 MBTI 설명문을 반복하지 말고 현침살, 갑신일주, 재성, 토 과다 같은 명리 구조 안에 MBTI 행동을 녹여라.",
      "좋은 예: 현침살의 예리함과 ENTJ의 빠른 결론 성향이 겹치면 틀린 구조를 그냥 못 넘긴다. 일에서는 디버깅과 기획력으로 살아나지만 관계에서는 말이 너무 빨리 꽂힐 수 있다.",
      "좋은 예: 편재의 확장 감각과 ENTJ의 목표 지향성이 겹치면 돈이 되는 판은 빨리 보이지만 계약, 정산일, 손실 한도 없이 확장하면 책임이 먼저 커진다.",
      "ENTJ 계열은 효율과 목표만 반복하지 말고 비효율을 못 넘김, 능력 기반 권위, 책임 없음에 대한 낮은 인내심, 논쟁형 친밀감, 위임보다 직접 통제하려는 경향, 감정 지능을 장기 성과 전략으로 배우는 흐름까지 분산해 녹여라.",
      "직접 체감 문장을 넣어라. 예: 비효율적인 사람을 보면 그냥 넘기기 어렵습니다. 책임 없이 말만 많은 사람에게는 호감이 있어도 금방 식을 수 있습니다. 쉬라는 말만 들으면 잘 못 쉬고, 쉬는 이유와 구조가 있어야 쉽습니다.",
      "MBTI topic traits는 섹션별로 다르게 골라라. 일·돈·공부는 career/workplace/money/study, 연애·관계는 love/marriage/relationships/communication, 사람·가족·환경은 relationships/communication/workplace, 리스크·성장은 risks/growth/stressPattern을 우선한다.",
      "각 장문 섹션은 대표 명리 feature를 의미 있게 골라라. 일·돈·공부에는 재성·관성·식상·인성·재고귀인·문창계열을 우선하고, 연애·관계에는 도화·홍염·합·해·현침을 우선하며, 리스크·성장에는 형·충·파·해·귀문·현침·오행 과다/부족을 우선한다.",
      "각 장문 섹션마다 최소 한 번은 명리 신호와 MBTI trait를 한 문장 안에서 연결하라. sajuMbtiBridgeReading에는 이런 연결 문장을 최소 4개 이상 넣어라. 예: 현침살의 예리함과 ENTJ의 Te가 만나면 문제의 핵심을 빨리 잡지만 말이 평가처럼 들릴 수 있다.",
      "조립문 금지: '{section}에서는 {feature}을 먼저 놓고', '이름을 그대로 믿는 표식이 아니라', '안에서 잘 쓰면', '과해질 때는', '속도를 한 번 낮춰야 합니다' 같은 문장 틀을 반복하지 마라.",
      "조사 오류 금지: 정재을, 편재을, 사람·가족·환경는처럼 어색한 조사를 쓰지 마라.",
      "sajuMbtiBridgeEvidence는 사주 feature와 MBTI trait가 실제로 겹치거나 긴장하는 지점이다. sentenceSeed, sceneSeed, practicalSwitch를 생활 장면과 운영법으로 풀어라.",
      "selectedMbtiKnowledge나 sajuMbtiBridgeEvidence에 없는 MBTI 해석을 새로 만들지 마라.",
      "종합 리포트에서는 compatible candidate MBTI type, 후보 유형, 추천 유형 목록을 쓰지 마라.",
      "사주를 먼저 말하고 MBTI는 뒤에 얹어라.",
      `${input.mbtiType}라서 그렇다 금지.`,
      `사주에는 이런 구조가 있고, 입력한 ${input.mbtiType} 성향도 여기에 맞물린다 식으로 써라.`,
      "공통점은 서로 강화되는 흐름으로 설명한다.",
      "차이점은 차이, 대비, 긴장으로 설명한다.",
      "보완점과 부족한 부분은 보완 흐름으로 설명한다.",
      "evidence에 없는 신살/귀인/십성/오행/일주 금지.",
      "예: 홍염살, 육해살 같은 항목은 실제 evidence에 있을 때만 쓴다. 없으면 재미를 위해 넣지 않는다.",
      "DB item label을 붙여 '단서'처럼 노출하지 않는다.",
      "가장 먼저 체감되는 기준입니다, 흐름이 생기므로, 로 힘을 얻지만, 관계와 일정의 비용이 커질 수 있습니다 같은 조립문을 쓰지 않는다.",
      "위 목록에 없는 신살, 귀인, 일주, 십성, 오행, 격국, 패턴은 절대 언급하지 마라.",
      "이 리포트에서 사용할 수 있는 사주 항목은 selected/computed 목록에 있는 항목뿐이다.",
      "목록에 없는 사주 용어는 쓰지 마라.",
      "예시 문장에 나온 항목이라도 이번 원국에 없으면 절대 쓰지 마라.",
      "제공된 명리학 feature evidence에 있는 항목만 사용하라.",
      "없는 신살·귀인·길신·일주 의미를 새로 만들지 마라.",
      "좋은 기운은 좋게 느껴지게 설명하되, 반드시/무조건/100%처럼 단정하지 마라.",
      "주의 신살은 겁주는 방식이 아니라 에너지의 쓰임과 운영법으로 풀어라.",
      "명리학 feature evidence를 설명할 때는 symbolicImage, positiveReading, cautionReading, practicalUse, sceneSeeds, phraseSeeds를 본문 재료로 삼아라.",
      "selectedSajuFeatureEvidence는 chapter별로 이미 선별된 근거다. 각 chapter는 자기 chapterId에 제공된 feature를 우선 사용한다.",
      "사주 feature spotlight는 사용자가 자신의 사주에 어떤 기운이 있는지 이해하기 위한 핵심 자료다.",
      "signature scene은 용하다 느낌을 만드는 구체 장면이다. 그대로 복붙하지 말고 자연스럽게 풀어써라.",
      "signature scene은 내부 용어이므로 최종 본문에는 signature scene, 시그니처 장면, spotlight, 스포트라이트, feature evidence, selected evidence 같은 말을 쓰지 마라.",
      "같은 질문을 반복하지 말고, 장면마다 다른 상황을 사용하라.",
      "각 chapter의 질문형 문장은 최대 2개까지만 사용하라.",
      "질문을 많이 늘어놓지 말고, 질문 뒤에는 바로 구체 장면을 설명하라.",
      "같은 형태의 ~하지 않나요? 문장을 반복하지 마라.",
      "질문 여러 개를 나열하는 대신 구체 장면을 먼저 보여줘라.",
      "사람들과 대화, 카톡이나 DM, 수업, 팀플, 가족 부탁, 친구와 약속, 알바나 업무, 계좌 분리, 전문서 공부, 연애 대화, 잠들기 전 생각이 안 꺼지는 장면을 다양하게 섞어라.",
      "내부 품질 평가 표현, 근거 선택 과정, 계산 과정, 생성 지시 같은 내부 생성 용어를 쓰지 마라.",
      "본문에서는 각 주요 chapter마다 spotlight 또는 signature scene 중 최소 1개 이상을 자연스럽게 반영하라.",
      "personality_pattern은 signature scene이 있으면 최소 1개를 반영하라.",
      "work_money_study는 돈, 일, 공부와 관련된 spotlight 또는 signature scene을 반영하라.",
      "love_relationships는 관계나 연애와 관련된 spotlight 또는 signature scene을 반영하라.",
      "risk_and_growth는 caution 또는 balance spotlight를 반영하라.",
      "final_message는 가장 강한 spotlight theme 2~3개를 다시 묶어 마무리하라.",
      "없는 feature는 절대 만들지 마라.",
      "각 chapter는 selectedSajuFeatureEvidence[chapterId]에 제공된 feature 중 최소 2개 이상을 본문에서 자연스럽게 설명하라.",
      "없는 feature를 만들지 말고 제공된 feature만 사용하라.",
      "saju_identity는 일주 feature와 신살·귀인·구조 feature 중 하나 이상을 함께 써라.",
      "saju_identity에는 일주/귀인/오행/십성/신살 중 실제 선택된 항목을 사용해 압박이 걸리는 자리, 도움을 요청하는 순간, 돈의 자리를 정하는 장면, 사람들과 대화할 때 핵심이 먼저 보이는 장면 중 최소 1개를 자연스럽게 넣어라.",
      "work_money_study는 제공된 money/work feature가 있으면 최소 1개 이상 써라.",
      "love_relationships는 제공된 relationship feature가 있으면 최소 1개 이상 써라.",
      "risk_and_growth는 제공된 caution/mixed feature가 있으면 최소 1개 이상 써라.",
      "좋은 길신/귀인은 상징 이미지와 실제 활용 방향을 반드시 1회 이상 풀어라.",
      "귀인, 신살, 십성, 오행, 일주 용어를 자연스럽게 사용한다.",
      "성격 챕터는 질문을 나열하지 말고, 구체 장면 1개를 반드시 포함하라.",
      "성격 챕터 예: 사람들과 대화할 때 상대 설명이 끝나기 전에 오류와 결론이 동시에 보이는 장면.",
      "성격 챕터 예: 카톡에서 상대는 감정을 풀고 있는데, 속으로 다음 행동이 먼저 떠오르는 장면.",
      "성격 챕터 예: 팀원이 애매하게 말하면 담당자·기준표·마감선부터 떠오르는 장면.",
      "saju_identity에는 추상어만 쓰지 말고 일주 형상과 실제 행동 장면을 함께 써라.",
      "personality_pattern에는 selected signature scene 중 personality/work/relationship 관련 장면을 최소 1개 자연스럽게 풀어써라.",
      "work_money_study에는 돈/계좌/전문서/자격증/사업 아이디어/실전 적용 중 최소 1개 장면을 자연스럽게 넣어라.",
      "love_relationships에는 상대가 서운함을 말하는 장면, 업무 보고처럼 들리는 말투, 감정 표현 속도 중 최소 1개 장면을 자연스럽게 넣어라.",
      "people_family_environment에는 가족 부탁, 팀 역할 분담, 담당자·마감·기준표 장면 중 최소 1개를 자연스럽게 넣어라.",
      "내 MBTI가 이래서 그런 줄 알았는데, 사주에도 이 구조가 있었네 느낌을 만든다.",
      "정확한 날짜 예언 금지.",
      "사주 용어를 먼저 쓰고 바로 쉬운 말로 풀어 설명한다.",
      "모든 해석 섹션은 최소 하나의 사주 용어를 쉬운 말로 풀어 설명한다.",
      "사주 용어를 단순 나열하지 말고 그 용어가 왜 행동과 관계와 돈과 일로 이어지는지 설명한다.",
      "display 섹션은 짧게 쓴다.",
      "만세력 표와 MBTI 입력 정보 섹션에서는 내부 사정 언급 금지.",
      "같은 근거를 섹션별로 다르게 풀어라.",
      "반복되는 오행/구조 근거는 섹션마다 다른 결과로 풀어라.",
      "회복과 표현, 감정 완충, 표현 온도 같은 말을 같은 문장으로 반복하지 마라.",
      "조언은 추상적으로 쓰지 말고 당장 행동으로 옮길 수 있게 구체적으로 써라.",
      "특징 설명형이 아니라 명중형과 조언형으로 쓴다.",
      "당신은 이런 편입니다처럼 단정만 하지 말고, 이런 상황 자주 나오지 않나요? 같은 체감형 장면으로 시작한다.",
      "모든 주요 챕터는 체감 장면 문장, 명리학적 흐름, MBTI 보조 연결, 구체적 장면 예시, 실천 솔루션을 포함한다.",
      "사주 용어를 말한 뒤 실제 행동과 상황으로 맞춰 주고, 바로 어떻게 쓰면 좋은지 생활 조언과 운영법으로 연결한다.",
      "hitReadingLines와 solutionLines는 본문에 자연스럽게 녹일 것.",
      "이런 장면 있지 않나요 / 이렇게 쓰면 좋습니다 라벨 금지.",
      "solutionLines는 별도 체크리스트처럼 보이게 쓰지 말고 chapter body와 이어지는 자연스러운 운영법 문장으로 쓴다.",
      "출력은 comprehensive_v2_draft JSON으로 작성한다.",
      "만세력 및 명리학 표는 deterministic profileTable로 제공된다.",
      "profileTable은 시스템이 deterministic facts로 붙인다.",
      "sajuFeatureChapter는 시스템 후처리에서도 evidence 기반으로 붙지만, writer 본문도 같은 정책으로 신살·귀인·합충·지장간을 쉬운 뜻과 실제 장면으로 풀어야 한다.",
      "너는 profileTable을 출력하지 않는다.",
      "너는 version, productType, openingTitle, openingSummary, coreLine, chapters, finalAdvice, safetyNotes만 출력한다.",
      "각 chapter에는 hitReadingLines를 반드시 작성한다.",
      "hitReadingLines는 “이런 상황 많지 않나요?”처럼 바로 와닿는 장면 문장이다.",
      "본문 첫머리도 hitReadingLines 중 하나와 자연스럽게 이어지게 작성한다.",
      "각 chapter에는 solutionLines를 반드시 작성한다.",
      "solutionLines는 사용자가 바로 써먹을 수 있는 실천 솔루션이다.",
      "일상 장면을 구체적으로 쓸 것.",
      "각 주요 챕터에는 사람들과 대화, 카톡, 수업, 팀플, 가족, 친구, 알바, 업무, 공부, 자격증, 전문서, 계좌, 침대, 밤 산책 같은 실제 생활 장면을 최소 2개 이상 넣는다.",
      "MBTI 보조 해석을 충분히 쓸 것.",
      `MBTI는 사주 뒤에 붙는 보조 언어지만, 각 주요 챕터에서 입력한 ${input.mbtiType}의 행동 언어를 판단 속도, 목표, 역할 정리, 결론 처리, 소통 방식, 애매함을 다루는 패턴 중 하나 이상으로 구체적으로 연결한다.`,
      input.mbtiType === "INTP"
        ? "입력한 INTP 성향은 담당자·마감선 장면으로 과하게 당기지 말고, 원리, 구조, 자료, 조건과 예외, 혼자 분석, 늦은 질문 장면으로 번역한다."
        : input.mbtiType === "ENTJ"
          ? "입력한 ENTJ 성향은 역할, 기준, 결론 처리, 애매함을 오래 두지 않는 장면으로 번역하되, 사주 근거 없이 모든 장면을 담당자·마감선으로 몰지 않는다."
          : `입력한 ${input.mbtiType} 성향은 고정 템플릿이 아니라 실제 사주 근거와 맞는 행동 장면으로만 번역한다.`,
      `입력한 MBTI 기준으로 보면, ${input.mbtiType} 성향으로 설명하면, MBTI 언어로 번역하면 같은 안전한 표현을 사용한다.`,
      `MBTI가 증명합니다, ${input.mbtiType}라서 무조건, 공식 MBTI 검사 결과상 같은 표현은 금지한다.`,
      "work_money_study hitReadingLines 예시: 일을 잡으면 초반에는 빠르게 판을 정리하지만, 쉬는 기준은 자주 뒤로 밀릴 수 있습니다.",
      "work_money_study hitReadingLines 예시: 자격증이나 전문서 공부도 왜 써먹는지가 보여야 집중력이 붙는 편입니다.",
      "work_money_study hitReadingLines 예시: 돈은 벌 아이디어보다 지킬 구조가 없을 때 더 빨리 새기 쉽습니다.",
      "love_relationships hitReadingLines 예시: 호감이 있어도 따뜻한 말보다 해결책이 먼저 나갈 수 있습니다.",
      "love_relationships hitReadingLines 예시: 상대가 감정을 말할 때, 당신은 위로보다 결론을 먼저 주고 싶어질 수 있습니다.",
      "love_relationships hitReadingLines 예시: 감정 기복이 큰 사람보다 말과 생활이 안정적인 사람이 오래 맞을 가능성이 큽니다.",
      "love_relationships.solutionLines는 반드시 맞는 상대, 피해야 할 상대, 보완 기운, MBTI 관계 기준 4가지 생활 조언을 각각 포함한다.",
      "맞는 상대: 감정을 천천히 풀어주고 과열을 식혀주는 사람처럼 partner traits를 구체적으로 쓴다.",
      "피해야 할 상대: 감정 기복이 크고 책임이 흐릿한 사람처럼 bad match pattern을 구체적으로 쓴다.",
      "보완 기운: 실제 제공된 오행 과다/부족 흐름과 감정 완충, 표현 온도를 연결한다.",
      "MBTI 보완 유형을 구체적으로 나열하지 마라. 아직 별도 보완 유형 scorer가 제공되지 않았으므로, 관계에서는 필요한 성향만 설명하라.",
      "MBTI 관계 기준: 감정을 천천히 풀어주는 사람, 약속을 지키는 사람, 생활 리듬이 안정적인 사람처럼 성향 기준을 설명하고 구체 MBTI type은 쓰지 않는다.",
      "연애와 관계 챕터에는 MBTI는 궁합 단정 기준이 아니라 관계 성향을 보는 보조 지표라는 한계/주의 문장을 자연스럽게 포함할 것.",
      "final_message는 긴 마무리 챕터로 쓸 것.",
      "final_message는 짧은 요약이 아니라 리포트 전체를 닫는 긴 마무리 챕터다.",
      "final_message는 최소한 일, 관계, 돈, 회복/표현 중 3개 이상을 연결해 실제 실천 방향으로 마무리하라.",
      "final_message는 단순 요약이 아니라 전체 리포트의 상징을 회수하는 장이다.",
      "제공된 일주, 가장 강한 길신/귀인, 가장 강한 주의 기운, 가장 중요한 보완 오행을 2~4개 골라 다시 묶어라.",
      "마지막에는 오늘부터 할 수 있는 3가지로 끝내라.",
      "final_message에는 '이 리포트의 마지막 핵심' 또는 '오늘부터는' 같은 닫는 문장을 넣고, 실제 선택된 사주 항목 2개 이상과 행동 문장 3개 이상을 포함하라.",
      "final_message hitReadingLines는 있어도 되지만, 마지막 방향성을 짧고 강하게 잡아라.",
      "final_message body는 충분히 길게 쓰고, 전체 핵심 재정리, 사주 핵심 구조, MBTI 보조 해석, 일/관계/돈/회복 중 최소 3개 실천 방향, 오늘부터 할 수 있는 작은 실행 3개 이상을 포함한다.",
      "final_message.solutionLines는 최소 4개를 작성한다.",
      "final_message 좋은 예: 더 세게 밀어붙이는 법보다 덜 닳게 오래 가는 법을 배워야 합니다.",
      "final_message 좋은 예: 지금 필요한 건 의지력이 아니라 회복과 표현을 시스템에 넣는 일입니다.",
      "17개 섹션처럼 잘게 쪼개지 말고 8개 챕터로 작성한다.",
      "각 챕터는 긴 호흡의 해석문이어야 한다.",
      "근거 목록을 따로 보여주지 말고 본문에 녹여라.",
      "체감 장면 → 명리학적 흐름 → MBTI 체감 번역 → 현실에서 생기는 비용 → 실제 운영법 순서로 자연스럽게 이어라.",
      "모든 챕터를 같은 구조로 쓰지 마라.",
      "모든 챕터를 같은 호칭으로 시작하지 마라.",
      "hitReadingLines를 그대로 반복하지 말고 본문 문맥에 자연스럽게 녹여라.",
      "같은 단어를 반복하지 말고 구조는 틀, 방식, 흐름, 판, 장치, 리듬, 작동 방식으로 바꿔 쓰고, 책임은 역할, 부담, 맡은 일, 짐, 담당 범위, 의무감으로 바꿔 쓴다.",
      "기준은 선, 판단선, 원칙, 규칙, 구분점으로, 회복은 식히기, 쉬는 장치, 재정비, 숨 돌리기로, 표현은 말의 온도, 드러내는 방식, 전달 방식으로 바꿔 쓴다.",
      "공부는 학생 공부뿐 아니라 자격증, 전문서, 직무 학습, 사업 학습까지 포함한다.",
      "일·돈·공부는 프로젝트, 포트폴리오, 외부 제안, 수익화, 정산일, 비용 상한선, 자격증, 전문서, 직무 학습 중 실제 장면을 넣어라.",
      "연애는 오행적으로 필요한 사람과 MBTI 관계 스타일을 함께 풀어라.",
      "연애·관계는 말의 온도, 애정 확인 방식, 책임감 없는 상대에 대한 피로, 해결책보다 감정 확인, 잘 맞는 상대와 피곤한 상대의 패턴을 포함하라.",
      "사람·가족·환경은 가족 부탁, 팀 역할, 친구 고민, 공개적인 자리, 말과 행동이 퍼지는 장면, 도움 요청 방식을 포함하라.",
      "연애는 보완되는 사람, 피해야 할 패턴, MBTI 관계 성향 기준을 단정하지 않는 방식으로 함께 설명한다.",
      "위험과 성장 챕터는 오행 부족/과다에 따른 생활 조언을 넣는다.",
      "리스크·성장은 밤 산책, 기록, 수면, 물 마시기, 식히는 루틴, 번아웃 전 중단 기준, 맡을 일과 버릴 일 구분을 포함하라.",
      "실제 제공된 부족/과다 오행이 있으면 그 항목에 맞는 생활 루틴으로 말하고, 제공되지 않은 오행 항목은 예시라도 쓰지 않는다.",
      "읽는 재미를 위해 비유와 실제 상황 예시를 넣어라.",
      "사용자에게 보이는 리포트 본문에 의료·심리치료·법률·투자 자문처럼 보이는 표현을 쓰지 마라.",
      "금지: 진단, 치료, 정신질환, 우울증, 불안장애, 투자 추천, 법률 자문, 반드시, 무조건, 100%, 보장, 운명 확정.",
      "보장 같은 단정 광고 표현 금지.",
      "사주 근거, 명리학 근거, 선택된 근거, feature evidence 같은 내부 표현 금지.",
      "리포트 본문에는 의료·심리치료 관련 단어를 쓰지 마라.",
      "특히 치료, 진단, 우울증, 불안장애, 정신질환이라는 단어는 금지한다.",
      "최종 리포트 본문에 \"치료\"라는 단어를 쓰지 마라. 회복/관리/조정/생활 루틴으로 표현하라.",
      "\"문서\", \"초안\", \"원고\", \"텍스트\" 같은 제작물 메타 표현을 쓰지 마라.",
      "\"문서\", \"초안\", \"생성된 내용\" 같은 제작 메타 표현을 쓰지 마라.",
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
      "이번 원국에서 확인되지 않은 대표 금지 항목:",
      forbiddenSajuTermLines,
      "이 리포트에서 사용할 수 있는 사주 항목은 selected/computed 목록에 있는 항목뿐이다.",
      "목록에 없는 사주 용어는 쓰지 마라.",
      "예시 문장에 나온 항목이라도 이번 원국에 없으면 절대 쓰지 마라.",
      "목록에 없는 신살, 귀인, 일주, 십성, 오행, 격국, 패턴은 절대 언급하지 마라.",
      "출력은 comprehensive_v2_draft JSON 객체 하나만 반환한다.",
      "chapters는 opening, saju_identity, personality_pattern, work_money_study, love_relationships, people_family_environment, risk_and_growth, final_message 8개를 정확히 포함한다.",
      "각 chapter는 chapterId, titleKo, headline, hitReadingLines, body, solutionLines, keyPhrases, sajuTermsUsed, mbtiTermsUsed를 포함한다.",
      "hitReadingLines는 바로 와닿는 장면 문장이고, solutionLines는 실천 솔루션이다.",
      "hitReadingLines와 solutionLines는 최종 본문에 자연스럽게 녹일 재료다. 이런 장면 있지 않나요? / 이렇게 쓰면 좋습니다 같은 라벨을 body에 쓰지 마라.",
      "profileTable 필드는 절대 출력하지 않는다.",
      "만세력 및 명리학 표는 deterministic profileTable로 제공된다.",
      "만세력 및 명리학 표/profileTable은 시스템이 deterministic facts로 붙인다.",
      "공통 만세력표는 근거표이고, 신살·귀인·합충·지장간은 sajuFeatureChapter와 본문에서 해석한다.",
      "sajuFeatureChapter 원칙: 명칭, 쉬운 뜻, 내 구조에서 드러나는 방식, 잘 쓰면 강점, 과하면 피로, 실제로 쓰는 법을 모두 담는다.",
      "MBTI DB topic traits, function stack, keywords, reportUseCases, myeongliBridgeHints는 원문 복붙이 아니라 생활 장면과 행동 발현으로 재해석한다.",
      "섹션별 MBTI topic을 다르게 쓴다. work는 career/workplace/money/study, love는 love/marriage/relationships/communication, people은 relationships/communication/workplace, risk는 risks/growth/stressPattern을 우선한다.",
      "장문 섹션은 checklist가 아니라 읽히는 문단으로 쓴다. 섹션별 대표 feature를 맞추고, 명리 신호와 MBTI 행동 단서를 한 문장 안에서 섞는다.",
      "sajuMbtiBridgeReading은 명리 feature와 MBTI trait를 직접 연결하는 문장을 4개 이상 포함한다.",
      "조립문과 조사 오류를 피한다. 금지 예: 이름을 그대로 믿는 표식이 아니라, 속도를 한 번 낮춰야 합니다, 정재을, 편재을, 사람·가족·환경는.",
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
      "좋은 예: 편관은 이 사주를 편하게 두지 않는 압박입니다. 문제가 생기면 내가 처리해야 한다는 감각이 먼저 올라옵니다. 정관은 그 압박을 공식 역할과 명예로 정리하려는 힘입니다.",
      "나쁜 예: 회복을 보완해야 합니다.",
      "좋은 예: 하루 중 아무 성과도 내지 않는 시간을 일정표에 넣어야 합니다. 이 사주에서 휴식은 감정 문제가 아니라 성능 유지 장치입니다.",
      "좋은 예: 사주상 제공된 일주와 실제 선택된 십성 구조가 먼저 보입니다. 여기에 입력한 MBTI의 행동 성향이 겹치면서, 문제를 대하는 방식이 생활 장면으로 드러납니다.",
      `나쁜 예: ${input.mbtiType}라서 리더십이 강합니다.`,
      "좋은 직설 예: 사람을 싫어하는 건 아닌데, 비효율적인 사람을 오래 기다리는 데 에너지를 많이 씁니다.",
      "좋은 명중 예: 사람들과 대화할 때 상대가 한참 설명하기 전에 이미 결론이 보이는 상황 많지 않나요? 문제는 그 결론이 맞아도 상대는 내 말을 자른다고 느낄 수 있다는 점입니다.",
      "좋은 생활 조언 예: 결론을 바로 말하기 전에 질문을 한 번 던지세요. 그래서 지금 핵심은 뭐라고 보세요? 이 한 문장만 넣어도 날카로움이 조언으로 바뀝니다.",
      "나쁜 약한 예: 관계에서 표현을 보완하면 좋습니다.",
      "saju_identity는 일간, 일주, 오행, 십성, 신살, 귀인 중심으로 이 사람의 기본 형상을 길게 설명한다.",
      "personality_pattern은 성격, 판단 방식, 말투, 감정 처리, 내면 긴장까지 연결한다.",
      "work_money_study는 일, 직업, 돈, 자산, 공부, 자격증, 직무 학습, 사업 학습을 하나의 성장과 성과 챕터로 연결한다.",
      "work_money_study에는 공부/일 루틴, 자격증이나 전문서 접근법, 직무 학습, 사업 학습, 돈 버는 방식, 돈 지키는 방식, 번아웃 방지를 넣는다.",
      "work_money_study에는 자격증 공부를 시작했지만 목적이 안 보이면 금방 식는 장면, 전문서를 읽을 때 목차와 실전 적용 포인트부터 보는 장면, 업무에서 누가 정리하지 않으면 본인이 표와 기준을 만드는 장면, 돈을 벌 방법은 빨리 보지만 계좌 분리와 방어 규칙이 없으면 새는 장면을 구체적으로 넣는다.",
      "love_relationships는 연애, 이상형, 표현 방식, 만나는 환경, 약점과 보완 상대를 함께 설명한다.",
      "love_relationships에는 상대가 서운함을 말했는데 위로보다 해결책이 먼저 나가는 장면, 호감은 있는데 말투가 업무 보고처럼 나가는 장면, 감정 기복이 큰 사람에게 처음엔 끌려도 나중에 피곤해지는 장면, 데이트에서 분위기보다 약속 습관과 생활 리듬을 더 보게 되는 장면을 구체적으로 넣는다.",
      "love_relationships에는 실제 제공된 보완 오행 흐름, 정서적 완충이 되는 사람, 피해야 할 패턴, MBTI 관계 성향 기준을 단정하지 않는 방식으로 넣는다.",
      "love_relationships.solutionLines에는 반드시 맞는 상대: ..., 피해야 할 상대: ..., 보완 기운: ..., MBTI 관계 기준: ... 형식의 실천 조언을 넣는다.",
      "MBTI 관계 기준 줄에는 구체 MBTI type을 나열하지 말고 필요한 성향과 생활 태도만 쓴다.",
      "MBTI는 궁합을 단정하는 기준이 아니라 관계에서 필요한 대화 속도, 감정 표현 방식, 약속 습관을 보는 보조 지표라고 설명한다.",
      "people_family_environment는 인간관계, 가족, 독립성, 맞는 환경, 피해야 할 환경을 다룬다.",
      "people_family_environment에는 가족이나 가까운 사람이 부탁하면 거절보다 해결이 먼저 나오는 장면, 팀 프로젝트에서 역할이 흐리면 본인이 결국 정리하게 되는 장면, 말이 자주 바뀌는 환경에서 급격히 피곤해지는 장면을 넣는다.",
      "people_family_environment에는 가까운 사람에게 더 엄격해지는 장면, 혼자 처리하고 지치는 장면, 가족과 책임 범위를 문장으로 정리하는 조언을 넣는다.",
      "risk_and_growth는 반복되는 인생 패턴, 약점, 과열, 고립, 성장 전략을 다룬다.",
      "risk_and_growth에는 침대에 누웠는데 머릿속으로 다음 일정과 문제를 계속 굴리는 장면, 피곤한데도 조금만 더 하면 끝난다고 밀어붙이는 장면, 휴식 시간을 잡아도 실제로는 일 생각을 하는 장면을 넣는다.",
      "risk_and_growth에는 밤 산책, 수변 공간, 충분한 수분, 깊은 사색과 기록, 잠 루틴, 햇빛, 가벼운 운동, 발표와 표현 연습, 책임 덜어내기, 경계선 긋기 같은 생활 조언을 넣는다.",
      "risk_and_growth 좋은 예: 지치기 전까지 멈추는 신호를 잘 못 보는 편일 수 있습니다.",
      "risk_and_growth 좋은 예: 문제는 체력이 약해서가 아니라, 책임을 내려놓는 기준이 늦게 생긴다는 점입니다.",
      "risk_and_growth 좋은 예: 실제 부족 오행이 있으면 쉬어도 머리가 계속 켜져 있는 장면, 표현이 늦어지는 장면처럼 제공된 항목에 맞게 풀어라.",
      "risk_and_growth 좋은 예: 실제 과다 오행이 있으면 책임이 쌓이거나 과열되는 장면처럼 제공된 항목에 맞게 풀어라.",
      "final_message는 짧은 위로가 아니라 방향성 있는 마무리로 쓴다.",
      "final_message는 긴 마무리 챕터로 쓰고 finalAdvice와 중복되지 않게 전체 방향을 정리한다.",
      "final_message는 단순 요약이 아니라 전체 리포트의 상징을 회수하는 장이다.",
      "제공된 일주, 가장 강한 길신/귀인, 가장 강한 주의 기운, 가장 중요한 보완 오행을 2~4개 골라 다시 묶어라.",
      "마지막에는 오늘부터 할 수 있는 3가지로 끝내라.",
      "final_message에는 '이 리포트의 마지막 핵심' 또는 '오늘부터는' 같은 닫는 문장을 넣고, 실제 선택된 사주 항목 2개 이상과 행동 문장 3개 이상을 포함하라.",
      "final_message hitReadingLines는 있어도 되지만, 마지막 방향성을 짧고 강하게 잡아라.",
      "final_message body에는 사주 핵심 구조, MBTI 보조 해석, 일/관계/돈/회복 중 최소 3개 실천 방향, 오늘부터 할 수 있는 작은 실행 3개 이상을 포함한다.",
      "final_message.solutionLines는 최소 4개를 작성한다.",
      "final_message 좋은 예: 더 세게 밀어붙이는 법보다 덜 닳게 오래 가는 법을 배워야 합니다.",
      "final_message 좋은 예: 지금 필요한 건 의지력이 아니라 회복과 표현을 시스템에 넣는 일입니다.",
      "결정적 예언, 정확한 날짜 예언, 건강/법률/투자 보장 금지.",
      "사용자에게 보이는 리포트 본문에 의료·심리치료·법률·투자 자문처럼 보이는 표현을 쓰지 마라.",
      "금지: 진단, 치료, 정신질환, 우울증, 불안장애, 투자 추천, 법률 자문, 반드시, 무조건, 100%, 보장, 운명 확정.",
      "리포트 본문에는 의료·심리치료 관련 단어를 쓰지 마라. 특히 치료, 진단, 우울증, 불안장애, 정신질환이라는 단어는 금지한다.",
      "정책성 disclaimer를 본문에 넣지 말고 성향 해석과 생활 조언으로만 작성한다.",
      "영어 템플릿 단어 contrast, output, input, profileTable, schema, JSON, draft를 본문에 쓰지 마라.",
      "성향 해석과 자기이해 목적의 참고 문장으로 작성하라.",
      "아래 제공된 근거 JSON 안에 있는 근거만 사용한다.",
      "제공된 명리학 feature evidence에 있는 항목만 사용한다.",
      "없는 신살·귀인·길신을 새로 만들지 말 것.",
      "좋은 기운은 좋게 느껴지게 설명하고, 주의 신살은 운영법으로 풀어라.",
      "selectedSajuFeatureEvidence는 V2 chapter별로 선별된 명리학 feature evidence다.",
      "사주 feature spotlight와 sajuSignatureScenes는 사용자가 체감할 핵심 기운과 용하다 느낌의 장면이다.",
      "각 주요 chapter는 spotlight 또는 signature scene 중 최소 1개 이상을 자연스럽게 반영한다.",
      "signature scene은 그대로 복붙하지 말고 자연스럽게 풀어쓴다.",
      "signature scene은 내부 용어이므로 최종 본문에는 signature scene, 시그니처 장면, spotlight, 스포트라이트, feature evidence, selected evidence 같은 말을 쓰지 않는다.",
      "같은 질문을 반복하지 말고, 장면마다 다른 상황을 사용한다.",
      "사람들과 대화, 카톡이나 DM, 수업, 팀플, 가족 부탁, 계좌 분리, 전문서 공부, 연애 대화, 잠들기 전 생각이 안 꺼지는 장면을 다양하게 섞는다.",
      "내부 품질 평가 표현, 근거 선택 과정, 계산 과정, 생성 지시 같은 내부 생성 용어를 쓰지 않는다.",
      "없는 feature는 절대 만들지 마라.",
      "각 chapter는 selectedSajuFeatureEvidence에 제공된 feature 중 최소 2개 이상을 자연스럽게 설명한다.",
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
  const allowedSajuTermLines = formatSajuTermLines(input.allowedSajuTerms);
  const forbiddenSajuTermLines = formatSajuTermLines(
    createForbiddenSajuTerms({ allowedSajuTerms: input.allowedSajuTerms }),
  );

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
      "SAJU_FEATURE_CHAPTER_MISSING이나 SAJU_FEATURE_ITEM_INCOMPLETE가 있으면 신살·귀인·합충·지장간을 raw label만 두지 말고 쉬운 뜻, 드러나는 방식, 강점, 피로, 실제 사용법으로 보강하라.",
      "목록에 없는 신살, 귀인, 일주, 십성, 오행, 격국, 패턴은 절대 언급하지 마라.",
      "이 리포트에서 사용할 수 있는 사주 항목은 selected/computed 목록에 있는 항목뿐이다.",
      "목록에 없는 사주 용어는 쓰지 마라.",
      "예시 문장에 나온 항목이라도 이번 원국에 없으면 절대 쓰지 마라.",
      "UNSUPPORTED_SAJU_TERM가 있으면 본문에 이번 원국에서 확인되지 않은 사주 항목이 들어간 것이다.",
      "해당 항목을 삭제하거나, 실제 확인된 항목으로만 바꿔라.",
      "이번 원국에서 허용된 항목 목록 외의 사주 용어를 쓰지 마라.",
      "대체가 필요하면 allowed list 안의 오행/구조/귀인만 사용하고, 문맥상 안전하지 않으면 feature명을 삭제하고 회복과 감정 완충 같은 일반 표현으로 바꿔라.",
      "본문을 더 길고 구체적으로 보강하라.",
      "사용자에게 보이는 본문에서 초안, 원고, 작성된 글, 생성된 내용, 문서, 텍스트 같은 제작/작성 메타 표현을 제거하라.",
      "같은 의미를 자연스러운 리포트 문장으로 바꿔라.",
      "예: 이 초안에서는 금지. 초안에서는, 작성된 글은, 이 문서는 같은 표현은 삭제하고 바로 해석을 시작하라.",
      "hitReadingLines를 실제 장면 중심으로 바꿔라.",
      "solutionLines를 구체적 운영법으로 바꿔라.",
      "hitReadingLines와 solutionLines는 body와 자연스럽게 이어지는 문장 재료로 작성한다.",
      "이런 장면 있지 않나요? / 이렇게 쓰면 좋습니다 같은 라벨을 본문에 쓰지 마라.",
      "일상 장면은 사람들과 대화, 카톡, 수업, 팀플, 가족, 친구, 알바, 업무, 공부, 자격증, 전문서, 계좌, 침대, 밤 산책처럼 구체적으로 보강한다.",
      `MBTI 보조 해석은 입력한 ${input.mbtiType}의 행동 언어를 판단 속도, 목표, 역할 정리, 결론 처리, 해결 방식, 애매함을 다루는 패턴 중 하나 이상으로 보강한다.`,
      input.mbtiType === "INTP"
        ? "입력한 INTP 성향은 원리, 구조, 자료, 조건과 예외, 혼자 분석, 늦은 질문 장면으로 보강하고 담당자·마감선 장면을 기본값으로 쓰지 않는다."
        : input.mbtiType === "ENTJ"
          ? "입력한 ENTJ 성향은 역할, 기준, 결론 처리 장면으로 보강하되 모든 챕터를 같은 담당자·마감선 장면으로 반복하지 않는다."
          : `입력한 ${input.mbtiType} 성향은 사주 근거와 맞는 행동 장면으로만 보강한다.`,
      "love_relationships.solutionLines는 맞는 상대, 피해야 할 상대, 보완 기운, MBTI 관계 기준을 모두 포함한다.",
      "MBTI 보완 유형을 구체적으로 나열하지 말고 필요한 성향과 생활 태도만 쓴다.",
      "SOLUTION_LINES_MISSING이 있으면 해당 chapter의 solutionLines에 실제 행동 문장 3개 이상을 넣어라.",
      "SOLUTION_LINES_MISSING: work_money_study가 있으면 일·돈·공부 챕터에는 실제 행동 문장 3개 이상을 넣어라. 돈, 공부, 업무, 프로젝트, 계좌, 기록, 루틴 중 최소 2개 이상을 포함하라.",
      "MBTI_SUPPORT_MISSING이 있으면 해당 chapter에 입력된 MBTI를 행동 언어로 1회 이상 연결하라. 다른 MBTI 유형 추천이나 공식 진단처럼 쓰지 마라.",
      "MBTI_SUPPORT_MISSING이 있으면 selectedMbtiKnowledge 또는 sajuMbtiBridgeEvidence 안의 sceneSeed와 practicalSwitch만 사용하라.",
      "MBTI_SUPPORT_MISSING: work_money_study가 있으면 일·돈·공부 챕터에는 입력된 MBTI를 일 처리, 공부 방식, 돈 관리 방식 중 하나와 연결하는 문장을 1개 이상 넣어라. 다른 MBTI 유형을 추천하지 말고, 입력된 MBTI만 행동 언어로 사용하라.",
      "MBTI_SUPPORT_MISSING: risk_and_growth가 있으면 위험과 성장 챕터에 입력된 MBTI를 회복 신호, 기록, 질문, 위임, 쉬는 기준 같은 행동 언어로 연결하라.",
      "LOVE_MBTI_CAUTION_OR_EXAMPLE_MISSING이 있으면 연애와 관계 챕터에 MBTI를 궁합 단정 기준으로 쓰지 말고 관계에서 필요한 성향과 생활 리듬을 보는 보조 지표라는 주의 문장을 자연스럽게 추가하라.",
      "구체적인 MBTI 유형명 예시는 쓰지 마라.",
      "work_money_study는 자격증, 전문서, 직무 학습, 사업 학습 중 하나 이상을 포함한다.",
      "risk_and_growth는 수/화/토 등 오행 보완 생활 조언을 포함한다.",
      "사용자에게 보이는 본문에서 진단, 치료, 정신질환, 우울증, 불안장애, 투자 추천, 법률 자문, 반드시, 무조건, 100%, 보장, 운명 확정 같은 위험 문구를 제거한다.",
      "보장 같은 단정 광고 표현을 모두 제거하라.",
      "사주 근거, 선택된 근거, feature evidence 같은 내부 표현을 쓰지 마라.",
      "DIRECT_HIT_READING_TOO_GENERIC: saju_identity가 있으면 사주 핵심 구조 챕터에 일주/귀인/오행/십성/신살 중 실제 선택된 항목을 사용해 구체적인 생활 장면을 넣어라.",
      "saju_identity가 추상적이면 압박이 걸리는 자리, 도움을 요청하는 순간, 돈의 자리를 정하는 장면, 사람들과 대화할 때 핵심이 먼저 보이는 장면 중 최소 1개로 풀어라.",
      "성격 챕터에는 사람들과 대화/카톡/수업/팀플/설명/오류/결론 같은 구체 장면을 자연스럽게 넣어라.",
      "DIRECT_HIT_READING_MISSING: work_money_study가 있으면 돈, 계좌, 전문서, 자격증, 사업 아이디어, 실전 적용 중 최소 1개 장면을 넣어라.",
      "DIRECT_HIT_READING_MISSING: love_relationships가 있으면 상대가 서운함을 말하는 장면, 업무 보고처럼 들리는 말투, 감정 표현 속도 중 최소 1개 장면을 넣어라.",
      "DIRECT_HIT_READING_MISSING: people_family_environment가 있으면 가족 부탁, 팀 역할 분담, 담당자·마감·기준표 장면 중 최소 1개를 넣어라.",
      "치료는 관리, 조정, 생활 조언, 운영법으로 바꿔라.",
      "문서는 리포트 또는 문맥상 자연스러운 표현으로 바꿔라.",
      "영어 단어 contrast는 차이, 대비, 긴장으로 바꿔라.",
      "영어 단어 output은 표현으로, draft는 리포트로 바꿔라.",
      "반복된 문장은 하나만 남기거나 서로 다른 표현으로 바꿔라.",
      "contrast, output, input, profileTable, schema, JSON, draft 같은 영어 템플릿 단어를 제거한다.",
      "성향 해석과 자기이해 목적의 참고 문장으로 고친다.",
      "risk_and_growth는 지치기 전 멈추는 신호, 책임을 내려놓는 기준, 밤 산책·수면·기록, 짧은 감정 표현, 맡을 일과 버릴 일 구분을 구체적으로 보강한다.",
      "final_message는 긴 마무리 챕터로 보강한다.",
      "final_message는 단순 요약이 아니라 전체 리포트의 상징을 회수하는 장이다.",
      "제공된 일주, 가장 강한 길신/귀인, 가장 강한 주의 기운, 가장 중요한 보완 오행을 2~4개 골라 다시 묶어라.",
      "마지막에는 오늘부터 할 수 있는 3가지로 끝내라.",
      "FINAL_MESSAGE_CLOSING_MISSING이 있으면 final_message에 '이 리포트의 마지막 핵심' 또는 '오늘부터는'으로 시작하는 closing 문장, 실제 선택된 사주 항목 2개 이상, 행동 문장 3개 이상을 추가하라.",
      "final_message body는 전체 핵심 재정리, 사주 핵심 구조, MBTI 보조 해석, 일/관계/돈/회복 중 최소 3개 실천 방향, 오늘부터 할 수 있는 작은 실행 3개 이상을 포함한다.",
      "final_message.solutionLines는 최소 4개를 작성한다.",
    ].join("\n"),
    user: [
      `사용자 이름: ${displayName}`,
      `MBTI: ${input.mbtiType}`,
      "이번 repair에서 사용할 수 있는 사주 용어:",
      allowedSajuTermLines,
      "이번 원국에서 확인되지 않은 대표 금지 항목:",
      forbiddenSajuTermLines,
      "UNSUPPORTED_SAJU_TERM가 있으면 그 항목은 삭제하거나 실제 허용된 항목으로만 바꿔라.",
      "이번 원국에서 허용된 항목 목록 외의 사주 용어를 쓰지 마라.",
      "validation errors:",
      ...input.validationErrors.map((error) => `- ${error}`),
      "수정할 기존 JSON:",
      input.draftJson,
      "위 JSON을 comprehensive_v2_draft narrative fields만 포함하는 JSON으로 다시 작성하라.",
      "sajuFeatureChapter 정책은 지키되 profileTable은 출력하지 않는다.",
      "version, productType, openingTitle, openingSummary, coreLine, chapters, finalAdvice, safetyNotes만 출력한다.",
      "chapterId, titleKo, headline, hitReadingLines, body, solutionLines, keyPhrases, sajuTermsUsed, mbtiTermsUsed를 유지한다.",
      "profileTable은 시스템이 deterministic facts로 붙이므로 절대 출력하지 않는다.",
    ].join("\n"),
  };
}
