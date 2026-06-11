import type { InterpretationTagId } from "./interpretationTags";
import type {
  MbtiFunctionProfile,
  MbtiKnowledgeEntry,
  MbtiPreferenceLetter,
  MbtiSajuBridge,
  MbtiTemperamentGroup,
  MbtiTopicInterpretation,
  MbtiType,
} from "./mbtiKnowledgeTypes";
import type {
  FiveElement,
  KnowledgePhraseSeeds,
  SajuKnowledgeTopic,
  TenGod,
} from "./sajuKnowledgeTypes";
import { SAJU_KNOWLEDGE_TOPICS } from "./sajuKnowledgeTypes";

const functionStacks: Record<MbtiType, readonly [string, string, string, string]> = {
  INTJ: ["Ni", "Te", "Fi", "Se"],
  INTP: ["Ti", "Ne", "Si", "Fe"],
  ENTJ: ["Te", "Ni", "Se", "Fi"],
  ENTP: ["Ne", "Ti", "Fe", "Si"],
  INFJ: ["Ni", "Fe", "Ti", "Se"],
  INFP: ["Fi", "Ne", "Si", "Te"],
  ENFJ: ["Fe", "Ni", "Se", "Ti"],
  ENFP: ["Ne", "Fi", "Te", "Si"],
  ISTJ: ["Si", "Te", "Fi", "Ne"],
  ISFJ: ["Si", "Fe", "Ti", "Ne"],
  ESTJ: ["Te", "Si", "Ne", "Fi"],
  ESFJ: ["Fe", "Si", "Ne", "Ti"],
  ISTP: ["Ti", "Se", "Ni", "Fe"],
  ISFP: ["Fi", "Se", "Ni", "Te"],
  ESTP: ["Se", "Ti", "Fe", "Ni"],
  ESFP: ["Se", "Fi", "Te", "Ni"],
};

const temperamentGroups: Record<MbtiType, MbtiTemperamentGroup> = {
  INTJ: "NT",
  INTP: "NT",
  ENTJ: "NT",
  ENTP: "NT",
  INFJ: "NF",
  INFP: "NF",
  ENFJ: "NF",
  ENFP: "NF",
  ISTJ: "SJ",
  ISFJ: "SJ",
  ESTJ: "SJ",
  ESFJ: "SJ",
  ISTP: "SP",
  ISFP: "SP",
  ESTP: "SP",
  ESFP: "SP",
};

const preferenceLettersByType: Record<MbtiType, readonly MbtiPreferenceLetter[]> = {
  INTJ: ["I", "N", "T", "J"],
  INTP: ["I", "N", "T", "P"],
  ENTJ: ["E", "N", "T", "J"],
  ENTP: ["E", "N", "T", "P"],
  INFJ: ["I", "N", "F", "J"],
  INFP: ["I", "N", "F", "P"],
  ENFJ: ["E", "N", "F", "J"],
  ENFP: ["E", "N", "F", "P"],
  ISTJ: ["I", "S", "T", "J"],
  ISFJ: ["I", "S", "F", "J"],
  ESTJ: ["E", "S", "T", "J"],
  ESFJ: ["E", "S", "F", "J"],
  ISTP: ["I", "S", "T", "P"],
  ISFP: ["I", "S", "F", "P"],
  ESTP: ["E", "S", "T", "P"],
  ESFP: ["E", "S", "F", "P"],
};

const groupFocus: Record<MbtiTemperamentGroup, string> = {
  NT: "전략, 논리, 추상화, competence",
  NF: "의미, 사람, 내면 가치, emotional interpretation",
  SJ: "책임, 안정, 질서, continuity",
  SP: "행동, 감각 반응, adaptability, present-moment execution",
};

const functionMeanings: Record<string, string> = {
  Te: "외부 기준으로 결과와 효율을 정리합니다.",
  Ti: "내부 논리로 원리와 정확성을 따집니다.",
  Ne: "가능성과 변형 아이디어를 넓게 엽니다.",
  Ni: "흐름의 방향과 장기 패턴을 압축해 봅니다.",
  Se: "현장 감각과 즉각 반응을 통해 움직입니다.",
  Si: "기억, 경험, 반복 가능한 기준을 보존합니다.",
  Fe: "사람의 반응과 관계 온도를 읽고 조율합니다.",
  Fi: "내면 가치와 진정성을 기준으로 판단합니다.",
};

function topicWeights(
  entries: readonly [SajuKnowledgeTopic, number][],
): Partial<Record<SajuKnowledgeTopic, number>> {
  return Object.fromEntries(entries) as Partial<Record<SajuKnowledgeTopic, number>>;
}

function fullTopicWeights(
  entries: readonly [SajuKnowledgeTopic, number][],
  defaultWeight = 0.35,
): Partial<Record<SajuKnowledgeTopic, number>> {
  return {
    ...Object.fromEntries(
      SAJU_KNOWLEDGE_TOPICS.map((topic) => [topic, defaultWeight]),
    ),
    ...topicWeights(entries),
  } as Partial<Record<SajuKnowledgeTopic, number>>;
}

function phraseSeeds(type: MbtiType, labelKo: string, focus: string): KnowledgePhraseSeeds {
  return {
    analytical: [
      `${type} ${labelKo}은 사주를 보조하는 자기보고 성향 근거입니다.`,
      `${type}의 ${focus}는 사주 태그와 겹칠 때 강하게 반영합니다.`,
      `${type} 데이터는 사주 원국의 구조를 대신하지 않습니다.`,
    ],
    conversational: [
      `${type}로 느껴지는 나는 ${focus}에서 선명해질 수 있습니다.`,
      `${type} 성향은 사주와 맞물릴 때 체감도가 올라갑니다.`,
      `${type}만으로 단정하지 않고 사주 신호 위에 얹어 봅니다.`,
    ],
    caution: [
      `${type} 성향은 사주 근거를 대신하지 않습니다.`,
      `${type}의 약점은 사주 부족 기운과 겹칠 때만 강하게 봅니다.`,
    ],
    advice: [
      `${type} 감각은 사주 구조와 겹치는 지점에서 활용합니다.`,
      `${type} 장점은 생활 주제별로 과하지 않게 조절합니다.`,
    ],
  };
}

function functionProfile(stack: readonly [string, string, string, string]): MbtiFunctionProfile {
  const [dominant, auxiliary, tertiary, inferior] = stack;

  return {
    dominant,
    auxiliary,
    tertiary,
    inferior,
    dominantMeaning: functionMeanings[dominant] ?? "주기능이 판단의 첫 반응을 만듭니다.",
    auxiliaryMeaning: functionMeanings[auxiliary] ?? "부기능이 주기능을 보완합니다.",
    tertiaryMeaning: functionMeanings[tertiary] ?? "3차 기능은 여유가 있을 때 보조 자원으로 나타납니다.",
    inferiorRisk:
      functionMeanings[inferior] === undefined
        ? "열등 기능은 스트레스 상황에서 미숙하게 드러날 수 있습니다."
        : `${functionMeanings[inferior]} 이 기능은 압박 상황에서 미숙하게 튈 수 있습니다.`,
  };
}

function topicInterpretation(
  type: MbtiType,
  topic: SajuKnowledgeTopic,
  focus: string,
  bridgeHints: readonly string[],
): MbtiTopicInterpretation {
  return {
    summary: `${type}는 ${topic} 주제에서 ${focus}가 드러나기 쉽습니다.`,
    positive: [`${focus}를 건강하게 쓰면 체감 장점이 분명해집니다.`],
    risk: [`${focus}가 과해지면 사주 약점과 겹쳐 피로가 커질 수 있습니다.`],
    advice: [`${focus}를 사주 원국의 강약과 함께 조절하는 편이 좋습니다.`],
    sajuConnectionHints: bridgeHints,
  };
}

function topicInterpretations(input: {
  readonly type: MbtiType;
  readonly focus: string;
  readonly bridgeHints: readonly string[];
  readonly overrides?: Partial<Record<SajuKnowledgeTopic, string>>;
}): Partial<Record<SajuKnowledgeTopic, MbtiTopicInterpretation>> {
  const requiredTopics = [
    "personality",
    "strengths",
    "weaknesses",
    "work_career",
    "money_asset",
    "love_relationship",
    "human_relations",
    "family_independence",
    "study_growth",
    "final_advice",
  ] as const satisfies readonly SajuKnowledgeTopic[];

  return Object.fromEntries(
    requiredTopics.map((topic) => [
      topic,
      topicInterpretation(
        input.type,
        topic,
        input.overrides?.[topic] ?? input.focus,
        input.bridgeHints,
      ),
    ]),
  ) as Partial<Record<SajuKnowledgeTopic, MbtiTopicInterpretation>>;
}

function relationship(input: {
  readonly attracts?: readonly InterpretationTagId[];
  readonly needs?: readonly InterpretationTagId[];
  readonly risks?: readonly InterpretationTagId[];
}): MbtiKnowledgeEntry["relationshipPreferences"] {
  return {
    attracts: input.attracts ?? [],
    needs: input.needs ?? [],
    risks: input.risks ?? [],
  };
}

function bridge(input: {
  readonly reinforcesTags: readonly InterpretationTagId[];
  readonly contrastsTags?: readonly InterpretationTagId[];
  readonly compensatesTags?: readonly InterpretationTagId[];
  readonly usefulSajuElements?: readonly FiveElement[];
  readonly difficultSajuElements?: readonly FiveElement[];
  readonly resonantTenGods?: readonly TenGod[];
  readonly likelySajuResonance: readonly string[];
}): MbtiSajuBridge {
  return {
    reinforcesTags: input.reinforcesTags,
    contrastsTags: input.contrastsTags ?? [],
    compensatesTags: input.compensatesTags ?? [],
    usefulSajuElements: input.usefulSajuElements,
    difficultSajuElements: input.difficultSajuElements,
    resonantTenGods: input.resonantTenGods,
    likelySajuResonance: input.likelySajuResonance,
  };
}

function entry(input: Omit<
  MbtiKnowledgeEntry,
  | "functionStack"
  | "functionProfile"
  | "preferenceLetters"
  | "temperamentGroup"
  | "topicInterpretations"
  | "phraseSeeds"
>): MbtiKnowledgeEntry {
  const stack = functionStacks[input.type];
  const temperamentGroup = temperamentGroups[input.type];
  const bridgeHints = input.sajuBridge?.likelySajuResonance ?? [
    "사주 근거와 겹칠 때만 성향 강도를 높입니다.",
  ];

  return {
    ...input,
    functionStack: stack,
    functionProfile: functionProfile(stack),
    preferenceLetters: preferenceLettersByType[input.type],
    temperamentGroup,
    topicInterpretations: topicInterpretations({
      type: input.type,
      focus: input.coreTemperamentKo ?? groupFocus[temperamentGroup],
      bridgeHints,
    }),
    phraseSeeds: phraseSeeds(
      input.type,
      input.labelKo,
      input.coreTemperamentKo ?? groupFocus[temperamentGroup],
    ),
  };
}

export const MBTI_KNOWLEDGE_BASE = [
  entry({
    type: "INTJ",
    labelKo: "전략 설계형",
    commonAliasKo: "구조 설계형",
    coreTemperamentKo: "전략, 독립성, 장기 설계, 비밀스러움, 효율, 감정표현 절제",
    summary: "먼저 큰 구조를 읽고, 필요한 실행 순서를 설계하려는 유형입니다.",
    traitTags: [
      "strategic_thinking",
      "precision_skill",
      "independence",
      "efficiency_focus",
    ],
    riskTags: ["relationship_distance", "emotional_dryness", "control_need"],
    topicWeights: fullTopicWeights([
      ["personality", 0.7],
      ["work_career", 0.82],
      ["study_growth", 0.66],
      ["weaknesses", 0.58],
    ]),
    sajuBridgeTags: ["strategic_thinking", "precision_skill", "independence"],
    sajuBridge: bridge({
      reinforcesTags: ["strategic_thinking", "precision_skill", "efficiency_focus"],
      contrastsTags: ["public_presence"],
      compensatesTags: ["relationship_distance"],
      usefulSajuElements: ["water", "metal"],
      difficultSajuElements: ["fire"],
      resonantTenGods: ["pian_yin", "zheng_guan"],
      likelySajuResonance: [
        "편인이나 금 기운이 강하면 장기 전략과 분석성이 강화됩니다.",
        "화 부족과 만나면 감정표현 절제가 더 강해질 수 있습니다.",
      ],
    }),
    relationshipPreferences: relationship({
      needs: ["independence", "stability_need", "strategic_thinking"],
      risks: ["relationship_distance", "emotional_dryness"],
    }),
    workStyleKo: ["장기 설계", "복잡한 문제 구조화", "혼자 깊게 파고드는 일"],
    moneyStyleKo: ["장기 계획형 자산 관리", "충동보다 시스템 선호"],
    loveStyleKo: ["신뢰와 지적 존중을 먼저 봅니다.", "감정보다 관계의 방향성을 확인합니다."],
    relationshipStyleKo: ["선택적 노출", "깊은 관계 소수 집중"],
    growthAdviceKo: ["판단 전에 감정 표현 루틴을 따로 둡니다."],
  }),
  entry({
    type: "INTP",
    labelKo: "원리 탐색형",
    commonAliasKo: "원리 탐색형",
    coreTemperamentKo: "원리 분석, 가능성 탐색, 독립 사고, 표현 지연",
    summary: "현상보다 원리를 따지고, 생각의 가능성을 넓히는 유형입니다.",
    traitTags: ["sharp_analysis", "strategic_thinking", "independence", "precision_skill"],
    riskTags: ["expression_weakness", "relationship_distance", "loneliness"],
    topicWeights: fullTopicWeights([
      ["personality", 0.64],
      ["study_growth", 0.82],
      ["work_career", 0.62],
      ["weaknesses", 0.58],
    ]),
    sajuBridgeTags: ["sharp_analysis", "independence", "strategic_thinking"],
    sajuBridge: bridge({
      reinforcesTags: ["sharp_analysis", "strategic_thinking", "independence"],
      contrastsTags: ["public_presence"],
      compensatesTags: ["expression_weakness"],
      usefulSajuElements: ["water", "metal"],
      difficultSajuElements: ["earth"],
      resonantTenGods: ["pian_yin", "shang_guan"],
      likelySajuResonance: [
        "문창귀인이나 편인이 강하면 원리 탐색과 지적 몰입이 강화됩니다.",
        "무식상과 만나면 생각을 말로 옮기는 속도가 더 늦어질 수 있습니다.",
      ],
    }),
    relationshipPreferences: relationship({
      needs: ["independence", "flexibility_need"],
      risks: ["expression_weakness", "relationship_distance"],
    }),
    workStyleKo: ["연구", "모델링", "복잡한 문제의 원리 분석"],
    moneyStyleKo: ["실험적 판단보다 이해 가능한 구조를 선호합니다."],
    loveStyleKo: ["감정보다 사고의 자유와 대화 리듬을 중시합니다."],
    relationshipStyleKo: ["느슨하지만 지적 신뢰가 있는 관계"],
    growthAdviceKo: ["생각을 너무 오래 내부에서만 돌리지 않는 편이 좋습니다."],
  }),
  entry({
    type: "ENTJ",
    labelKo: "전략 추진형",
    commonAliasKo: "전략 추진형",
    coreTemperamentKo: "성과, 주도권, 효율, 비전, 책임, 해결 중심",
    summary: "성과와 주도권을 중시하고 비효율에 예민한 전략 추진형 자기보고 유형입니다.",
    traitTags: [
      "achievement_drive",
      "efficiency_focus",
      "leadership",
      "control_need",
      "strategic_thinking",
      "money_orientation",
      "authority_orientation",
      "direct_speech",
      "responsibility_pressure",
      "growth_orientation",
      "workplace_romance",
      "emotional_dryness",
    ],
    riskTags: [
      "burnout_risk",
      "relationship_distance",
      "emotional_dryness",
      "control_need",
      "direct_speech",
      "low_rest_capacity",
    ],
    topicWeights: fullTopicWeights([
      ["personality", 0.82],
      ["strengths", 0.82],
      ["weaknesses", 0.74],
      ["work_career", 0.96],
      ["money_asset", 0.88],
      ["love_relationship", 0.68],
      ["human_relations", 0.68],
      ["study_growth", 0.62],
      ["final_advice", 0.72],
    ]),
    sajuBridgeTags: [
      "achievement_drive",
      "efficiency_focus",
      "leadership",
      "control_need",
      "strategic_thinking",
      "money_orientation",
      "authority_orientation",
      "direct_speech",
      "emotional_dryness",
      "burnout_risk",
    ],
    sajuBridge: bridge({
      reinforcesTags: [
        "achievement_drive",
        "efficiency_focus",
        "leadership",
        "money_orientation",
        "authority_orientation",
      ],
      contrastsTags: ["empathy_need", "flexibility_need"],
      compensatesTags: ["emotional_dryness", "low_rest_capacity"],
      usefulSajuElements: ["water", "fire"],
      difficultSajuElements: ["earth", "metal"],
      resonantTenGods: ["pian_cai", "zheng_cai", "qi_sha", "zheng_guan"],
      likelySajuResonance: [
        "재성 강세와 만나면 성과, 돈, 주도권 욕구가 강화됩니다.",
        "관성 강세와 만나면 책임, 권위, 조직 장악 욕구가 강화됩니다.",
        "현침살과 만나면 직설성과 문제 지적이 강화됩니다.",
        "수 부족이나 무인성과 만나면 감정 순환 약점이 강해집니다.",
      ],
    }),
    relationshipPreferences: relationship({
      attracts: ["leadership", "public_presence", "workplace_romance"],
      needs: ["growth_orientation", "efficiency_focus", "achievement_drive"],
      risks: ["control_need", "relationship_distance", "direct_speech"],
    }),
    workStyleKo: ["목표 설정", "성과 구조화", "조직 장악", "비효율 제거"],
    moneyStyleKo: ["사업성", "성과 보상", "자원 배치", "큰 목표 중심의 돈 감각"],
    loveStyleKo: [
      "연애도 성장, 비전, 능력 중심으로 보는 경향이 있습니다.",
      "일터나 협업에서 매력이 드러나기 쉽습니다.",
    ],
    relationshipStyleKo: ["감정 공감보다 해결책을 먼저 줍니다.", "느린 관계보다 목표가 있는 관계를 선호합니다."],
    growthAdviceKo: ["감정 확인을 비효율로 보지 않는 연습이 필요합니다."],
  }),
  entry({
    type: "ENTP",
    labelKo: "관점 전환형",
    commonAliasKo: "관점 전환형",
    coreTemperamentKo: "아이디어, 논쟁, 실험, 변화, 규칙 파괴, 흥미 중심",
    summary: "새 관점과 반박을 통해 판을 흔들고 가능성을 여는 유형입니다.",
    traitTags: ["strategic_thinking", "direct_speech", "flexibility_need", "public_presence"],
    riskTags: ["stability_need", "relationship_distance", "low_rest_capacity"],
    topicWeights: fullTopicWeights([
      ["personality", 0.66],
      ["work_career", 0.7],
      ["human_relations", 0.66],
      ["study_growth", 0.62],
      ["weaknesses", 0.58],
    ]),
    sajuBridgeTags: ["direct_speech", "flexibility_need", "strategic_thinking"],
    sajuBridge: bridge({
      reinforcesTags: ["strategic_thinking", "direct_speech", "public_presence"],
      contrastsTags: ["stability_need", "authority_orientation"],
      compensatesTags: ["low_rest_capacity"],
      usefulSajuElements: ["fire", "wood"],
      difficultSajuElements: ["earth"],
      resonantTenGods: ["shang_guan", "shi_shen"],
      likelySajuResonance: [
        "식상 강세와 만나면 아이디어와 표현력이 강화됩니다.",
        "토 과다와 만나면 흥미보다 책임이 앞서 답답해질 수 있습니다.",
      ],
    }),
    relationshipPreferences: relationship({
      attracts: ["public_presence", "direct_speech"],
      needs: ["flexibility_need", "growth_orientation"],
      risks: ["stability_need", "relationship_distance"],
    }),
    workStyleKo: ["실험", "토론", "새로운 판 만들기"],
    moneyStyleKo: ["기회형 수익 감각", "변동성 높은 선택에 끌릴 수 있음"],
    loveStyleKo: ["재미와 지적 자극이 중요합니다."],
    relationshipStyleKo: ["논쟁을 관계 놀이처럼 쓸 수 있습니다."],
    growthAdviceKo: ["마무리 기준을 따로 만들면 강점이 성과로 연결됩니다."],
  }),
  entry({
    type: "INFJ",
    labelKo: "의미 통찰형",
    commonAliasKo: "의미 통찰형",
    coreTemperamentKo: "의미, 사람, 장기 방향, 깊은 관계 해석",
    summary: "사람과 상황의 이면 의미를 읽고 조심스럽게 방향을 잡는 유형입니다.",
    traitTags: ["strategic_thinking", "empathy_need", "growth_orientation", "emotional_depth"],
    riskTags: ["loneliness", "low_rest_capacity", "relationship_sensitivity"],
    topicWeights: fullTopicWeights([
      ["personality", 0.68],
      ["human_relations", 0.76],
      ["love_relationship", 0.7],
      ["study_growth", 0.62],
      ["final_advice", 0.66],
    ]),
    sajuBridgeTags: ["empathy_need", "strategic_thinking", "emotional_depth"],
    sajuBridge: bridge({
      reinforcesTags: ["empathy_need", "strategic_thinking", "emotional_depth"],
      contrastsTags: ["direct_speech"],
      compensatesTags: ["low_rest_capacity"],
      usefulSajuElements: ["water", "wood"],
      difficultSajuElements: ["metal"],
      resonantTenGods: ["zheng_yin", "pian_yin"],
      likelySajuResonance: [
        "인성이나 수 기운이 강하면 의미 해석과 내면성이 강화됩니다.",
        "현침살이나 금 강세와 만나면 말은 조용해도 판단은 날카로울 수 있습니다.",
      ],
    }),
    relationshipPreferences: relationship({
      needs: ["empathy_need", "stability_need", "emotional_depth"],
      risks: ["loneliness", "relationship_sensitivity"],
    }),
    workStyleKo: ["사람과 의미를 연결하는 기획", "깊은 문제 상담과 조율"],
    moneyStyleKo: ["가치와 안정성을 함께 봅니다."],
    loveStyleKo: ["깊은 이해와 정서적 신뢰가 중요합니다."],
    relationshipStyleKo: ["넓은 관계보다 깊은 관계에 에너지를 씁니다."],
    growthAdviceKo: ["타인의 감정까지 모두 책임지지 않는 선이 필요합니다."],
  }),
  entry({
    type: "INFP",
    labelKo: "가치 몰입형",
    commonAliasKo: "가치 몰입형",
    coreTemperamentKo: "가치 중심, 내면 감정, 상처 민감, 이상과 현실 충돌, 감성형 연애",
    summary: "감정, 가치, 내면 기준을 중심으로 사람과 일을 해석하는 유형입니다.",
    traitTags: [
      "empathy_need",
      "emotional_depth",
      "relationship_sensitivity",
      "growth_orientation",
      "flexibility_need",
      "independence",
    ],
    riskTags: [
      "loneliness",
      "expression_weakness",
      "low_rest_capacity",
      "relationship_sensitivity",
    ],
    topicWeights: fullTopicWeights([
      ["personality", 0.72],
      ["love_relationship", 0.84],
      ["human_relations", 0.8],
      ["study_growth", 0.62],
      ["weaknesses", 0.7],
      ["final_advice", 0.78],
    ]),
    sajuBridgeTags: [
      "empathy_need",
      "emotional_depth",
      "relationship_sensitivity",
      "expression_weakness",
      "loneliness",
    ],
    sajuBridge: bridge({
      reinforcesTags: ["empathy_need", "emotional_depth", "relationship_sensitivity"],
      contrastsTags: ["authority_orientation", "direct_speech"],
      compensatesTags: ["expression_weakness", "low_rest_capacity"],
      usefulSajuElements: ["water", "wood"],
      difficultSajuElements: ["metal", "earth"],
      resonantTenGods: ["zheng_yin", "pian_yin"],
      likelySajuResonance: [
        "수 기운이나 인성 강세와 만나면 내면성, 감정, 상상력이 강화됩니다.",
        "화 부족과 만나면 표현하지 못하고 안으로 삭일 수 있습니다.",
        "관성 강세와 만나면 부담감과 자기검열이 커질 수 있습니다.",
      ],
    }),
    relationshipPreferences: relationship({
      attracts: ["romantic_attraction", "emotional_depth"],
      needs: ["empathy_need", "stability_need", "relationship_sensitivity"],
      risks: ["expression_weakness", "loneliness"],
    }),
    workStyleKo: ["가치가 맞는 일", "글과 창작", "사람의 감정을 섬세하게 읽는 일"],
    moneyStyleKo: ["돈보다 의미를 먼저 보다가 현실 부담을 늦게 느낄 수 있습니다."],
    loveStyleKo: ["감성형 연애", "내면을 이해받는 관계", "상처에 민감한 호감 방식"],
    relationshipStyleKo: ["마음이 열리기까지 시간이 필요합니다."],
    growthAdviceKo: ["가치와 현실 조건을 분리해서 확인하는 루틴이 필요합니다."],
  }),
  entry({
    type: "ENFJ",
    labelKo: "관계 이끄는형",
    commonAliasKo: "관계 조율형",
    coreTemperamentKo: "사람 중심 리더십, 설득, 관계 조율, 인정 욕구, 책임감",
    summary: "사람의 반응을 읽고 관계 안에서 방향을 만들려는 유형입니다.",
    traitTags: ["leadership", "empathy_need", "public_presence", "responsibility_pressure"],
    riskTags: ["burnout_risk", "relationship_sensitivity", "low_rest_capacity"],
    topicWeights: fullTopicWeights([
      ["human_relations", 0.86],
      ["love_relationship", 0.76],
      ["work_career", 0.68],
      ["strengths", 0.68],
      ["weaknesses", 0.62],
    ]),
    sajuBridgeTags: ["leadership", "empathy_need", "public_presence"],
    sajuBridge: bridge({
      reinforcesTags: ["leadership", "empathy_need", "public_presence"],
      contrastsTags: ["independence"],
      compensatesTags: ["low_rest_capacity"],
      usefulSajuElements: ["fire", "water"],
      difficultSajuElements: ["earth"],
      resonantTenGods: ["zheng_guan", "zheng_yin"],
      likelySajuResonance: [
        "정관이나 천을귀인과 만나면 사람을 이끄는 책임감이 강화됩니다.",
        "토 과다와 만나면 관계 책임을 과하게 떠안을 수 있습니다.",
      ],
    }),
    relationshipPreferences: relationship({
      attracts: ["public_presence", "romantic_attraction", "leadership"],
      needs: ["empathy_need", "stability_need"],
      risks: ["responsibility_pressure", "relationship_sensitivity"],
    }),
    workStyleKo: ["조율형 리더십", "교육", "설득과 커뮤니케이션"],
    moneyStyleKo: ["사람과 신뢰를 통해 자원을 움직입니다."],
    loveStyleKo: ["상대의 성장과 정서적 반응을 함께 봅니다."],
    relationshipStyleKo: ["관계 분위기를 먼저 읽고 맞추려 합니다."],
    growthAdviceKo: ["인정 욕구와 책임감을 분리해서 관리합니다."],
  }),
  entry({
    type: "ENFP",
    labelKo: "가능성 확장형",
    commonAliasKo: "가능성 확장형",
    coreTemperamentKo: "가능성, 표현, 관계 확장, 흥미, 일관성 부족, 감정적 설득력",
    summary: "새 가능성과 사람의 온도를 함께 보며 확장하려는 유형입니다.",
    traitTags: [
      "growth_orientation",
      "public_presence",
      "flexibility_need",
      "empathy_need",
      "romantic_attraction",
    ],
    riskTags: ["stability_need", "low_rest_capacity", "expression_weakness"],
    topicWeights: fullTopicWeights([
      ["personality", 0.66],
      ["human_relations", 0.82],
      ["love_relationship", 0.8],
      ["environment_luck", 0.62],
      ["weaknesses", 0.58],
    ]),
    sajuBridgeTags: ["growth_orientation", "flexibility_need", "public_presence"],
    sajuBridge: bridge({
      reinforcesTags: ["growth_orientation", "public_presence", "flexibility_need"],
      contrastsTags: ["stability_need", "self_discipline"],
      compensatesTags: ["low_rest_capacity"],
      usefulSajuElements: ["fire", "wood"],
      difficultSajuElements: ["earth"],
      resonantTenGods: ["shi_shen", "shang_guan"],
      likelySajuResonance: [
        "화나 식상 강세와 만나면 표현력, 인기, 대중성이 강화됩니다.",
        "토 과다와 만나면 현실 부담으로 흥미가 꺾일 수 있습니다.",
      ],
    }),
    relationshipPreferences: relationship({
      attracts: ["public_presence", "romantic_attraction"],
      needs: ["flexibility_need", "empathy_need"],
      risks: ["stability_need", "low_rest_capacity"],
    }),
    workStyleKo: ["새로운 가능성 찾기", "사람과 아이디어 연결", "설득과 콘텐츠"],
    moneyStyleKo: ["흥미 기반 수입에는 강하지만 반복 관리가 약해질 수 있습니다."],
    loveStyleKo: ["감정적 설득력과 재미가 중요합니다."],
    relationshipStyleKo: ["넓게 연결되지만 깊이 유지하는 루틴이 필요합니다."],
    growthAdviceKo: ["흥미가 식은 뒤에도 남는 구조를 만들어야 합니다."],
  }),
  entry({
    type: "ISTJ",
    labelKo: "기준 보존형",
    commonAliasKo: "기준 보존형",
    coreTemperamentKo: "신뢰, 책임, 오래 보는 연애, 거짓말 혐오, 안정 자산, 규칙과 체계",
    summary: "검증된 기준, 안정, 책임, 반복 가능한 운영을 중시하는 유형입니다.",
    traitTags: [
      "stability_need",
      "responsibility_pressure",
      "self_discipline",
      "authority_orientation",
      "precision_skill",
    ],
    riskTags: ["flexibility_need", "expression_weakness", "emotional_dryness"],
    topicWeights: fullTopicWeights([
      ["work_career", 0.86],
      ["money_asset", 0.82],
      ["family_independence", 0.68],
      ["love_relationship", 0.62],
      ["weaknesses", 0.58],
    ]),
    sajuBridgeTags: [
      "stability_need",
      "responsibility_pressure",
      "self_discipline",
      "authority_orientation",
      "precision_skill",
      "emotional_dryness",
    ],
    sajuBridge: bridge({
      reinforcesTags: ["stability_need", "responsibility_pressure", "precision_skill"],
      contrastsTags: ["flexibility_need", "public_presence"],
      compensatesTags: ["emotional_dryness"],
      usefulSajuElements: ["earth", "water"],
      difficultSajuElements: ["wood"],
      resonantTenGods: ["zheng_guan", "zheng_cai"],
      likelySajuResonance: [
        "정관과 정재가 강하면 책임, 안정, 신뢰, 장기 관리가 강화됩니다.",
        "목 부족과 만나면 융통성 약점이 강해질 수 있습니다.",
        "수 강세와 만나면 신중함과 기억력이 강화될 수 있습니다.",
      ],
    }),
    relationshipPreferences: relationship({
      needs: ["stability_need", "self_discipline"],
      risks: ["expression_weakness", "emotional_dryness"],
    }),
    workStyleKo: ["규칙 운영", "검증된 절차", "책임 있는 장기 관리"],
    moneyStyleKo: ["안정 자산", "예측 가능한 저축과 관리"],
    loveStyleKo: ["오래 보는 연애", "신뢰와 약속 중시"],
    relationshipStyleKo: ["거짓말과 불안정한 태도에 민감합니다."],
    growthAdviceKo: ["새 방식에 대한 작은 실험을 루틴에 넣는 편이 좋습니다."],
  }),
  entry({
    type: "ISFJ",
    labelKo: "생활 보호형",
    commonAliasKo: "생활 보호형",
    coreTemperamentKo: "보살핌, 안정, 신뢰, 헌신, 감정 노동, 익숙한 관계",
    summary: "가까운 사람과 생활의 안정감을 섬세하게 챙기는 유형입니다.",
    traitTags: [
      "stability_need",
      "empathy_need",
      "self_discipline",
      "responsibility_pressure",
      "relationship_sensitivity",
    ],
    riskTags: ["low_rest_capacity", "responsibility_pressure", "expression_weakness"],
    topicWeights: fullTopicWeights([
      ["family_independence", 0.82],
      ["human_relations", 0.78],
      ["love_relationship", 0.72],
      ["weaknesses", 0.64],
    ]),
    sajuBridgeTags: ["stability_need", "empathy_need", "responsibility_pressure"],
    sajuBridge: bridge({
      reinforcesTags: ["stability_need", "empathy_need", "responsibility_pressure"],
      contrastsTags: ["independence"],
      compensatesTags: ["low_rest_capacity"],
      usefulSajuElements: ["earth", "water"],
      difficultSajuElements: ["fire"],
      resonantTenGods: ["zheng_yin", "zheng_cai"],
      likelySajuResonance: [
        "정인이나 정재가 강하면 돌봄과 안정 운영이 강화됩니다.",
        "무식상과 만나면 자기 요구를 말하지 못하고 감정 노동이 쌓일 수 있습니다.",
      ],
    }),
    relationshipPreferences: relationship({
      needs: ["stability_need", "empathy_need"],
      risks: ["low_rest_capacity", "expression_weakness"],
    }),
    workStyleKo: ["세밀한 관리", "지원 업무", "반복 가능한 신뢰 구축"],
    moneyStyleKo: ["생활 안정과 예측 가능한 지출 관리"],
    loveStyleKo: ["익숙한 관계와 안정적 신뢰를 선호합니다."],
    relationshipStyleKo: ["가까운 사람을 챙기지만 자기 피로를 늦게 알아차릴 수 있습니다."],
    growthAdviceKo: ["도움과 희생의 선을 분명히 해야 합니다."],
  }),
  entry({
    type: "ESTJ",
    labelKo: "운영 정리형",
    commonAliasKo: "운영 정리형",
    coreTemperamentKo: "현실적 지휘, 규칙, 성과, 조직 관리, 책임감, 감정표현 건조",
    summary: "현실 기준과 운영 질서를 세워 일을 굴리는 유형입니다.",
    traitTags: [
      "leadership",
      "efficiency_focus",
      "authority_orientation",
      "responsibility_pressure",
      "money_orientation",
    ],
    riskTags: ["control_need", "direct_speech", "emotional_dryness"],
    topicWeights: fullTopicWeights([
      ["work_career", 0.92],
      ["money_asset", 0.76],
      ["human_relations", 0.58],
      ["weaknesses", 0.62],
    ]),
    sajuBridgeTags: ["leadership", "efficiency_focus", "authority_orientation"],
    sajuBridge: bridge({
      reinforcesTags: ["leadership", "efficiency_focus", "authority_orientation"],
      contrastsTags: ["empathy_need", "flexibility_need"],
      compensatesTags: ["emotional_dryness"],
      usefulSajuElements: ["earth", "metal"],
      difficultSajuElements: ["water"],
      resonantTenGods: ["zheng_guan", "zheng_cai", "qi_sha"],
      likelySajuResonance: [
        "정관과 정재가 강하면 조직 관리와 현실 성과가 강화됩니다.",
        "수 부족과 만나면 감정표현 건조함이 더 강해질 수 있습니다.",
      ],
    }),
    relationshipPreferences: relationship({
      attracts: ["leadership", "authority_orientation"],
      needs: ["stability_need", "self_discipline"],
      risks: ["direct_speech", "control_need"],
    }),
    workStyleKo: ["현실적 지휘", "규칙 정비", "조직 운영"],
    moneyStyleKo: ["성과와 관리가 연결된 돈 감각"],
    loveStyleKo: ["책임과 약속을 중요하게 봅니다."],
    relationshipStyleKo: ["효율적 해결을 먼저 제안할 수 있습니다."],
    growthAdviceKo: ["감정 표현을 업무 피드백처럼 다루지 않는 연습이 필요합니다."],
  }),
  entry({
    type: "ESFJ",
    labelKo: "관계 운영형",
    commonAliasKo: "관계 운영형",
    coreTemperamentKo: "관계 운영, 생활 안정, 인정 욕구, 돌봄, 사회적 조율",
    summary: "사람과 생활 질서를 함께 챙기며 관계를 운영하는 유형입니다.",
    traitTags: ["empathy_need", "public_presence", "stability_need", "relationship_sensitivity"],
    riskTags: ["responsibility_pressure", "low_rest_capacity", "burnout_risk"],
    topicWeights: fullTopicWeights([
      ["human_relations", 0.84],
      ["family_independence", 0.7],
      ["love_relationship", 0.76],
      ["weaknesses", 0.62],
    ]),
    sajuBridgeTags: ["empathy_need", "public_presence", "stability_need"],
    sajuBridge: bridge({
      reinforcesTags: ["empathy_need", "public_presence", "stability_need"],
      contrastsTags: ["independence"],
      compensatesTags: ["low_rest_capacity"],
      usefulSajuElements: ["fire", "earth"],
      difficultSajuElements: ["metal"],
      resonantTenGods: ["zheng_yin", "zheng_cai"],
      likelySajuResonance: [
        "천을귀인이나 정인이 강하면 사람을 챙기는 역할이 강화됩니다.",
        "토 과다와 만나면 관계 책임이 과해질 수 있습니다.",
      ],
    }),
    relationshipPreferences: relationship({
      attracts: ["public_presence", "empathy_need"],
      needs: ["empathy_need", "stability_need"],
      risks: ["responsibility_pressure", "relationship_sensitivity"],
    }),
    workStyleKo: ["관계 관리", "생활 운영", "고객과 조직 조율"],
    moneyStyleKo: ["가족과 생활 안정 중심의 돈 관리"],
    loveStyleKo: ["정서 확인과 생활 안정이 중요합니다."],
    relationshipStyleKo: ["주변 반응을 빠르게 읽고 맞춥니다."],
    growthAdviceKo: ["모든 관계를 직접 책임지지 않아야 합니다."],
  }),
  entry({
    type: "ISTP",
    labelKo: "실전 분석형",
    commonAliasKo: "실전 분석형",
    coreTemperamentKo: "실전 해결, 분석, 독립성, 현장 감각, 말보다 행동",
    summary: "말보다 구조와 손에 잡히는 해결책을 선호하는 유형입니다.",
    traitTags: ["sharp_analysis", "precision_skill", "independence", "self_discipline"],
    riskTags: ["emotional_dryness", "relationship_distance", "expression_weakness"],
    topicWeights: fullTopicWeights([
      ["work_career", 0.76],
      ["strengths", 0.68],
      ["human_relations", 0.5],
      ["weaknesses", 0.62],
    ]),
    sajuBridgeTags: ["sharp_analysis", "precision_skill", "independence"],
    sajuBridge: bridge({
      reinforcesTags: ["sharp_analysis", "precision_skill", "independence"],
      contrastsTags: ["empathy_need", "public_presence"],
      compensatesTags: ["expression_weakness"],
      usefulSajuElements: ["metal", "water"],
      difficultSajuElements: ["fire"],
      resonantTenGods: ["shang_guan", "pian_yin"],
      likelySajuResonance: [
        "현침살이나 금 강세와 만나면 기술적 분석과 문제 지적이 강화됩니다.",
        "화 부족과 만나면 감정 표현보다 행동 해결이 먼저 나올 수 있습니다.",
      ],
    }),
    relationshipPreferences: relationship({
      needs: ["independence", "flexibility_need"],
      risks: ["relationship_distance", "expression_weakness"],
    }),
    workStyleKo: ["기술 문제 해결", "현장 분석", "도구와 시스템 개선"],
    moneyStyleKo: ["필요한 곳에 실용적으로 쓰는 돈 감각"],
    loveStyleKo: ["말보다 행동으로 신뢰를 보이는 편입니다."],
    relationshipStyleKo: ["간섭이 적고 실질적인 관계를 선호합니다."],
    growthAdviceKo: ["감정 설명을 최소한의 언어로라도 남기는 편이 좋습니다."],
  }),
  entry({
    type: "ISFP",
    labelKo: "감각 가치형",
    commonAliasKo: "감각 가치형",
    coreTemperamentKo: "내면 가치, 현재 감각, 조용한 호감, 미감, 표현 지연",
    summary: "내면 가치와 현재 감각을 기준으로 자연스럽게 반응하는 유형입니다.",
    traitTags: [
      "empathy_need",
      "romantic_attraction",
      "independence",
      "emotional_depth",
      "relationship_sensitivity",
    ],
    riskTags: ["expression_weakness", "loneliness", "relationship_sensitivity"],
    topicWeights: fullTopicWeights([
      ["love_relationship", 0.78],
      ["personality", 0.64],
      ["human_relations", 0.68],
      ["weaknesses", 0.58],
    ]),
    sajuBridgeTags: ["empathy_need", "romantic_attraction", "emotional_depth"],
    sajuBridge: bridge({
      reinforcesTags: ["empathy_need", "romantic_attraction", "emotional_depth"],
      contrastsTags: ["authority_orientation"],
      compensatesTags: ["expression_weakness"],
      usefulSajuElements: ["water", "fire"],
      difficultSajuElements: ["metal"],
      resonantTenGods: ["shi_shen", "zheng_yin"],
      likelySajuResonance: [
        "홍염살이나 도화살과 만나면 조용한 매력이 강화됩니다.",
        "무식상과 만나면 호감을 말로 표현하는 속도가 늦어질 수 있습니다.",
      ],
    }),
    relationshipPreferences: relationship({
      attracts: ["romantic_attraction", "emotional_depth"],
      needs: ["empathy_need", "independence"],
      risks: ["expression_weakness", "relationship_sensitivity"],
    }),
    workStyleKo: ["감각과 품질을 살리는 일", "조용히 완성도를 올리는 일"],
    moneyStyleKo: ["가치와 취향에 맞는 소비에 끌릴 수 있습니다."],
    loveStyleKo: ["조용한 호감과 감각적 끌림이 중요합니다."],
    relationshipStyleKo: ["압박 없는 자연스러운 관계에서 편해집니다."],
    growthAdviceKo: ["싫고 좋은 기준을 너무 늦게 말하지 않는 편이 좋습니다."],
  }),
  entry({
    type: "ESTP",
    labelKo: "현장 추진형",
    commonAliasKo: "현장 추진형",
    coreTemperamentKo: "현장 판단, 승부감, 즉각 행동, 대인 매력, 위험 감수",
    summary: "현장에서 바로 판단하고 움직이며 승부감 있게 밀어붙이는 유형입니다.",
    traitTags: ["public_presence", "competition", "direct_speech", "flexibility_need"],
    riskTags: ["stability_need", "relationship_distance", "low_rest_capacity"],
    topicWeights: fullTopicWeights([
      ["work_career", 0.74],
      ["human_relations", 0.72],
      ["environment_luck", 0.64],
      ["love_relationship", 0.66],
      ["weaknesses", 0.58],
    ]),
    sajuBridgeTags: ["competition", "public_presence", "direct_speech"],
    sajuBridge: bridge({
      reinforcesTags: ["competition", "public_presence", "direct_speech"],
      contrastsTags: ["stability_need"],
      compensatesTags: ["low_rest_capacity"],
      usefulSajuElements: ["fire", "metal"],
      difficultSajuElements: ["earth"],
      resonantTenGods: ["jie_cai", "shang_guan"],
      likelySajuResonance: [
        "겁재나 상관이 강하면 현장 승부감과 직설성이 강화됩니다.",
        "정재나 토 과다와 만나면 자유로운 행동이 현실 책임과 충돌할 수 있습니다.",
      ],
    }),
    relationshipPreferences: relationship({
      attracts: ["public_presence", "romantic_attraction"],
      needs: ["flexibility_need", "competition"],
      risks: ["relationship_distance", "stability_need"],
    }),
    workStyleKo: ["현장 영업", "위기 대응", "빠른 판단이 필요한 일"],
    moneyStyleKo: ["기회가 보이면 빠르게 움직이는 돈 감각"],
    loveStyleKo: ["현장감과 즉각적인 끌림이 중요합니다."],
    relationshipStyleKo: ["긴 설명보다 직접 경험을 선호합니다."],
    growthAdviceKo: ["속도를 낮추고 후속 관리 기준을 두면 안정됩니다."],
  }),
  entry({
    type: "ESFP",
    labelKo: "분위기 확장형",
    commonAliasKo: "분위기 확장형",
    coreTemperamentKo: "분위기, 현재 감각, 대인 매력, 즐거움, 즉흥성",
    summary: "현재 분위기와 사람의 반응을 살려 활기를 만드는 유형입니다.",
    traitTags: [
      "public_presence",
      "romantic_attraction",
      "flexibility_need",
      "empathy_need",
    ],
    riskTags: ["low_rest_capacity", "stability_need", "relationship_sensitivity"],
    topicWeights: fullTopicWeights([
      ["love_relationship", 0.82],
      ["human_relations", 0.82],
      ["environment_luck", 0.62],
      ["weaknesses", 0.56],
    ]),
    sajuBridgeTags: ["public_presence", "romantic_attraction", "flexibility_need"],
    sajuBridge: bridge({
      reinforcesTags: ["public_presence", "romantic_attraction", "flexibility_need"],
      contrastsTags: ["self_discipline", "stability_need"],
      compensatesTags: ["low_rest_capacity"],
      usefulSajuElements: ["fire", "wood"],
      difficultSajuElements: ["earth"],
      resonantTenGods: ["shi_shen", "shang_guan"],
      likelySajuResonance: [
        "도화살이나 홍염살과 만나면 대인 매력과 분위기 장악이 강화됩니다.",
        "토 과다와 만나면 즐거움보다 현실 부담이 앞설 수 있습니다.",
      ],
    }),
    relationshipPreferences: relationship({
      attracts: ["public_presence", "romantic_attraction"],
      needs: ["empathy_need", "flexibility_need"],
      risks: ["low_rest_capacity", "stability_need"],
    }),
    workStyleKo: ["현장 분위기", "서비스", "콘텐츠와 대인 활동"],
    moneyStyleKo: ["경험과 즐거움에 지출이 열릴 수 있습니다."],
    loveStyleKo: ["함께 즐겁고 살아 있는 관계를 선호합니다."],
    relationshipStyleKo: ["사람들 사이에서 에너지가 올라옵니다."],
    growthAdviceKo: ["즐거움 뒤의 정리 루틴을 만들어야 합니다."],
  }),
] as const satisfies readonly MbtiKnowledgeEntry[];

export const MBTI_KNOWLEDGE_BY_TYPE = new Map(
  MBTI_KNOWLEDGE_BASE.map((item) => [item.type, item]),
);
