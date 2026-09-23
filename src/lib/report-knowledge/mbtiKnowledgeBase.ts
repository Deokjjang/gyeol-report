import { getMbtiSourceProfile, type MbtiTraitArea } from "./mbti/sourceRuntimeAdapter";
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

const topicAreas: Record<SajuKnowledgeTopic, readonly MbtiTraitArea[]> = {
  personality: ["identity", "thinkingStyle"], strengths: ["strengths"], weaknesses: ["risks"],
  work_career: ["career", "workplace"], money_asset: ["money", "investment"], love_relationship: ["love", "marriage"],
  human_relations: ["relationships", "communication"], family_independence: ["parenting", "child"],
  study_growth: ["study", "growth"], environment_luck: ["workplace", "relationships"], final_advice: ["growth"],
};
function topicInterpretations(type: MbtiType): Partial<Record<SajuKnowledgeTopic, MbtiTopicInterpretation>> {
  const source = getMbtiSourceProfile(type)!;
  return Object.fromEntries(Object.entries(topicAreas).map(([topic, areas]) => {
    const traits = areas.flatMap(area => (source.traits?.[area] ?? []).slice(0, 2));
    return [topic, {
      summary: traits.map(t => t.plainKo).filter(Boolean).join(" "),
      positive: traits.flatMap(t => t.positiveUse ? [t.positiveUse] : []),
      risk: traits.flatMap(t => t.risk ? [t.risk] : []),
      advice: traits.flatMap(t => t.positiveUse ? [t.positiveUse] : []),
      // Natal matching belongs to validated Fusion/Bridge, never a type-wide claim.
      sajuConnectionHints: [],
    }];
  }));
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

function entry(input: Pick<MbtiKnowledgeEntry, "type" | "traitTags" | "riskTags" | "topicWeights" | "sajuBridgeTags" | "sajuBridge" | "relationshipPreferences">): MbtiKnowledgeEntry {
  const source = getMbtiSourceProfile(input.type)!;
  const stack = ["dominant", "auxiliary", "tertiary", "inferior"].map(role => source.functionStack?.[role] ?? "") as [string, string, string, string];
  const texts = (areas: readonly MbtiTraitArea[], field: "plainKo" | "strongLine" | "positiveUse" | "risk", limit = 3) =>
    areas.flatMap(area => (source.traits?.[area] ?? []).flatMap(t => t[field] ? [t[field]!] : [])).slice(0, limit);
  const phraseSeeds: KnowledgePhraseSeeds = { analytical: texts(["identity", "thinkingStyle"], "plainKo"),
    conversational: texts(["identity", "communication"], "strongLine"), caution: texts(["risks"], "plainKo"), advice: texts(["growth"], "plainKo") };
  return { ...input, labelKo: source.titleKo, commonAliasKo: source.archetype, summary: source.summary?.identity ?? source.oneLine,
    coreTemperamentKo: source.oneLine, functionStack: stack, functionProfile: functionProfile(stack),
    preferenceLetters: Object.values(source.preferenceAxes ?? {}) as MbtiPreferenceLetter[], temperamentGroup: temperamentGroups[input.type],
    topicInterpretations: topicInterpretations(input.type), phraseSeeds,
    workStyleKo: texts(["career", "workplace"], "plainKo"), moneyStyleKo: texts(["money"], "plainKo"),
    loveStyleKo: texts(["love"], "plainKo"), relationshipStyleKo: texts(["relationships"], "plainKo"), growthAdviceKo: texts(["growth"], "plainKo") };
}

export const MBTI_KNOWLEDGE_BASE = [
  entry({
    type: "INTJ",
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
  }),
  entry({
    type: "INTP",
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
  }),
  entry({
    type: "ENTJ",
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
  }),
  entry({
    type: "ENTP",
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
  }),
  entry({
    type: "INFJ",
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
  }),
  entry({
    type: "INFP",
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
  }),
  entry({
    type: "ENFJ",
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
  }),
  entry({
    type: "ENFP",
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
  }),
  entry({
    type: "ISTJ",
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
  }),
  entry({
    type: "ISFJ",
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
  }),
  entry({
    type: "ESTJ",
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
  }),
  entry({
    type: "ESFJ",
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
  }),
  entry({
    type: "ISTP",
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
  }),
  entry({
    type: "ISFP",
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
  }),
  entry({
    type: "ESTP",
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
  }),
  entry({
    type: "ESFP",
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
  }),
] as const satisfies readonly MbtiKnowledgeEntry[];

export const MBTI_KNOWLEDGE_BY_TYPE = new Map(
  MBTI_KNOWLEDGE_BASE.map((item) => [item.type, item]),
);
