import type { InterpretationTagId } from "./interpretationTags";
import type { MbtiKnowledgeEntry, MbtiType } from "./mbtiKnowledgeTypes";
import type { KnowledgePhraseSeeds, SajuKnowledgeTopic } from "./sajuKnowledgeTypes";

function topicWeights(
  entries: readonly [SajuKnowledgeTopic, number][],
): Partial<Record<SajuKnowledgeTopic, number>> {
  return Object.fromEntries(entries) as Partial<Record<SajuKnowledgeTopic, number>>;
}

function phraseSeeds(type: MbtiType, label: string): KnowledgePhraseSeeds {
  return {
    analytical: [`${type} ${label}은 자기보고 성향의 보조 근거입니다.`],
    conversational: [`${type}로 느껴지는 나는 이런 장면에서 선명해집니다.`],
    caution: [`${type} 성향은 사주 근거를 대신하지 않고 보조로만 씁니다.`],
    advice: [`${type} 감각은 사주 구조와 겹치는 지점에서 더 강하게 봅니다.`],
  };
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

function entry(input: Omit<MbtiKnowledgeEntry, "phraseSeeds">): MbtiKnowledgeEntry {
  return {
    ...input,
    phraseSeeds: phraseSeeds(input.type, input.labelKo),
  };
}

export const MBTI_KNOWLEDGE_BASE = [
  entry({
    type: "INTJ",
    labelKo: "전략 설계형",
    commonAliasKo: "구조 설계형",
    functionStack: ["Ni", "Te", "Fi", "Se"],
    summary: "먼저 큰 구조를 읽고, 필요한 실행 순서를 설계하려는 유형입니다.",
    traitTags: ["strategic_thinking", "precision_skill", "independence"],
    riskTags: ["relationship_distance", "emotional_dryness"],
    topicWeights: topicWeights([
      ["personality", 0.6],
      ["work_career", 0.7],
      ["study_growth", 0.55],
    ]),
    sajuBridgeTags: ["strategic_thinking", "precision_skill"],
    relationshipPreferences: relationship({
      needs: ["independence", "stability_need"],
      risks: ["relationship_distance"],
    }),
  }),
  entry({
    type: "INTP",
    labelKo: "원리 탐색형",
    commonAliasKo: "원리 탐색형",
    functionStack: ["Ti", "Ne", "Si", "Fe"],
    summary: "현상보다 원리를 따지고, 생각의 가능성을 넓히는 유형입니다.",
    traitTags: ["sharp_analysis", "strategic_thinking", "independence"],
    riskTags: ["expression_weakness", "relationship_distance"],
    topicWeights: topicWeights([
      ["personality", 0.58],
      ["study_growth", 0.7],
      ["work_career", 0.5],
    ]),
    sajuBridgeTags: ["sharp_analysis", "independence"],
    relationshipPreferences: relationship({
      needs: ["flexibility_need", "independence"],
      risks: ["expression_weakness"],
    }),
  }),
  entry({
    type: "ENTJ",
    labelKo: "전략 추진형",
    commonAliasKo: "전략 추진형",
    functionStack: ["Te", "Ni", "Se", "Fi"],
    summary: "목표를 세우고, 구조를 만들고, 빠르게 밀고 가는 추진형 자기보고 유형입니다.",
    traitTags: [
      "achievement_drive",
      "efficiency_focus",
      "leadership",
      "control_need",
      "strategic_thinking",
      "direct_speech",
      "growth_orientation",
      "responsibility_pressure",
      "workplace_romance",
      "emotional_dryness",
    ],
    riskTags: [
      "burnout_risk",
      "relationship_distance",
      "emotional_dryness",
      "control_need",
      "direct_speech",
    ],
    topicWeights: topicWeights([
      ["personality", 0.75],
      ["strengths", 0.7],
      ["weaknesses", 0.65],
      ["work_career", 0.85],
      ["money_asset", 0.65],
      ["love_relationship", 0.55],
      ["human_relations", 0.6],
      ["final_advice", 0.65],
    ]),
    sajuBridgeTags: [
      "achievement_drive",
      "efficiency_focus",
      "leadership",
      "control_need",
      "strategic_thinking",
      "direct_speech",
      "emotional_dryness",
    ],
    relationshipPreferences: relationship({
      attracts: ["leadership", "public_presence", "workplace_romance"],
      needs: ["growth_orientation", "efficiency_focus"],
      risks: ["control_need", "relationship_distance", "direct_speech"],
    }),
  }),
  entry({
    type: "ENTP",
    labelKo: "관점 전환형",
    commonAliasKo: "관점 전환형",
    functionStack: ["Ne", "Ti", "Fe", "Si"],
    summary: "새 관점과 반박을 통해 판을 흔들고 가능성을 여는 유형입니다.",
    traitTags: ["strategic_thinking", "direct_speech", "flexibility_need"],
    riskTags: ["stability_need", "relationship_distance"],
    topicWeights: topicWeights([
      ["personality", 0.6],
      ["work_career", 0.6],
      ["human_relations", 0.55],
    ]),
    sajuBridgeTags: ["direct_speech", "flexibility_need"],
    relationshipPreferences: relationship({
      attracts: ["public_presence"],
      needs: ["flexibility_need"],
      risks: ["stability_need"],
    }),
  }),
  entry({
    type: "INFJ",
    labelKo: "의미 통찰형",
    commonAliasKo: "의미 통찰형",
    functionStack: ["Ni", "Fe", "Ti", "Se"],
    summary: "사람과 상황의 이면 의미를 읽고 조심스럽게 방향을 잡는 유형입니다.",
    traitTags: ["strategic_thinking", "empathy_need", "growth_orientation"],
    riskTags: ["loneliness", "low_rest_capacity"],
    topicWeights: topicWeights([
      ["personality", 0.6],
      ["human_relations", 0.65],
      ["study_growth", 0.55],
    ]),
    sajuBridgeTags: ["empathy_need", "strategic_thinking"],
    relationshipPreferences: relationship({
      needs: ["empathy_need", "stability_need"],
      risks: ["loneliness"],
    }),
  }),
  entry({
    type: "INFP",
    labelKo: "가치 몰입형",
    commonAliasKo: "가치 몰입형",
    functionStack: ["Fi", "Ne", "Si", "Te"],
    summary: "감정, 가치, 내면 기준을 중심으로 사람과 일을 해석하는 유형입니다.",
    traitTags: ["empathy_need", "growth_orientation", "independence"],
    riskTags: ["loneliness", "expression_weakness", "low_rest_capacity"],
    topicWeights: topicWeights([
      ["personality", 0.65],
      ["love_relationship", 0.65],
      ["human_relations", 0.6],
      ["study_growth", 0.5],
    ]),
    sajuBridgeTags: ["empathy_need", "independence", "loneliness"],
    relationshipPreferences: relationship({
      attracts: ["romantic_attraction"],
      needs: ["empathy_need", "stability_need"],
      risks: ["expression_weakness", "loneliness"],
    }),
  }),
  entry({
    type: "ENFJ",
    labelKo: "관계 이끄는형",
    commonAliasKo: "관계 조율형",
    functionStack: ["Fe", "Ni", "Se", "Ti"],
    summary: "사람의 반응을 읽고 관계 안에서 방향을 만들려는 유형입니다.",
    traitTags: ["leadership", "empathy_need", "public_presence"],
    riskTags: ["responsibility_pressure", "burnout_risk"],
    topicWeights: topicWeights([
      ["human_relations", 0.75],
      ["love_relationship", 0.65],
      ["work_career", 0.55],
    ]),
    sajuBridgeTags: ["leadership", "empathy_need"],
    relationshipPreferences: relationship({
      attracts: ["public_presence", "romantic_attraction"],
      needs: ["empathy_need"],
      risks: ["responsibility_pressure"],
    }),
  }),
  entry({
    type: "ENFP",
    labelKo: "가능성 확장형",
    commonAliasKo: "가능성 확장형",
    functionStack: ["Ne", "Fi", "Te", "Si"],
    summary: "새 가능성과 사람의 온도를 함께 보며 확장하려는 유형입니다.",
    traitTags: ["growth_orientation", "public_presence", "flexibility_need"],
    riskTags: ["stability_need", "low_rest_capacity"],
    topicWeights: topicWeights([
      ["personality", 0.58],
      ["human_relations", 0.65],
      ["environment_luck", 0.55],
    ]),
    sajuBridgeTags: ["growth_orientation", "flexibility_need"],
    relationshipPreferences: relationship({
      attracts: ["public_presence"],
      needs: ["flexibility_need", "empathy_need"],
      risks: ["stability_need"],
    }),
  }),
  entry({
    type: "ISTJ",
    labelKo: "기준 보존형",
    commonAliasKo: "기준 보존형",
    functionStack: ["Si", "Te", "Fi", "Ne"],
    summary: "검증된 기준, 안정, 책임, 반복 가능한 운영을 중시하는 유형입니다.",
    traitTags: [
      "stability_need",
      "responsibility_pressure",
      "self_discipline",
      "authority_orientation",
    ],
    riskTags: ["flexibility_need", "expression_weakness"],
    topicWeights: topicWeights([
      ["work_career", 0.7],
      ["money_asset", 0.65],
      ["family_independence", 0.55],
    ]),
    sajuBridgeTags: ["stability_need", "self_discipline", "authority_orientation"],
    relationshipPreferences: relationship({
      needs: ["stability_need"],
      risks: ["expression_weakness"],
    }),
  }),
  entry({
    type: "ISFJ",
    labelKo: "생활 보호형",
    commonAliasKo: "생활 보호형",
    functionStack: ["Si", "Fe", "Ti", "Ne"],
    summary: "가까운 사람과 생활의 안정감을 섬세하게 챙기는 유형입니다.",
    traitTags: ["stability_need", "empathy_need", "self_discipline"],
    riskTags: ["low_rest_capacity", "responsibility_pressure"],
    topicWeights: topicWeights([
      ["family_independence", 0.7],
      ["human_relations", 0.65],
      ["love_relationship", 0.55],
    ]),
    sajuBridgeTags: ["stability_need", "empathy_need"],
    relationshipPreferences: relationship({
      needs: ["stability_need", "empathy_need"],
      risks: ["low_rest_capacity"],
    }),
  }),
  entry({
    type: "ESTJ",
    labelKo: "운영 정리형",
    commonAliasKo: "운영 정리형",
    functionStack: ["Te", "Si", "Ne", "Fi"],
    summary: "현실 기준과 운영 질서를 세워 일을 굴리는 유형입니다.",
    traitTags: ["leadership", "efficiency_focus", "authority_orientation"],
    riskTags: ["control_need", "direct_speech"],
    topicWeights: topicWeights([
      ["work_career", 0.8],
      ["money_asset", 0.6],
      ["human_relations", 0.5],
    ]),
    sajuBridgeTags: ["leadership", "efficiency_focus"],
    relationshipPreferences: relationship({
      attracts: ["leadership"],
      needs: ["stability_need"],
      risks: ["direct_speech", "control_need"],
    }),
  }),
  entry({
    type: "ESFJ",
    labelKo: "관계 운영형",
    commonAliasKo: "관계 운영형",
    functionStack: ["Fe", "Si", "Ne", "Ti"],
    summary: "사람과 생활 질서를 함께 챙기며 관계를 운영하는 유형입니다.",
    traitTags: ["empathy_need", "public_presence", "stability_need"],
    riskTags: ["responsibility_pressure", "low_rest_capacity"],
    topicWeights: topicWeights([
      ["human_relations", 0.75],
      ["family_independence", 0.6],
      ["love_relationship", 0.6],
    ]),
    sajuBridgeTags: ["empathy_need", "public_presence"],
    relationshipPreferences: relationship({
      attracts: ["public_presence"],
      needs: ["empathy_need", "stability_need"],
      risks: ["responsibility_pressure"],
    }),
  }),
  entry({
    type: "ISTP",
    labelKo: "실전 분석형",
    commonAliasKo: "실전 분석형",
    functionStack: ["Ti", "Se", "Ni", "Fe"],
    summary: "말보다 구조와 손에 잡히는 해결책을 선호하는 유형입니다.",
    traitTags: ["sharp_analysis", "precision_skill", "independence"],
    riskTags: ["emotional_dryness", "relationship_distance"],
    topicWeights: topicWeights([
      ["work_career", 0.65],
      ["strengths", 0.6],
      ["human_relations", 0.45],
    ]),
    sajuBridgeTags: ["sharp_analysis", "precision_skill"],
    relationshipPreferences: relationship({
      needs: ["independence", "flexibility_need"],
      risks: ["relationship_distance"],
    }),
  }),
  entry({
    type: "ISFP",
    labelKo: "감각 가치형",
    commonAliasKo: "감각 가치형",
    functionStack: ["Fi", "Se", "Ni", "Te"],
    summary: "내면 가치와 현재 감각을 기준으로 자연스럽게 반응하는 유형입니다.",
    traitTags: ["empathy_need", "romantic_attraction", "independence"],
    riskTags: ["expression_weakness", "loneliness"],
    topicWeights: topicWeights([
      ["love_relationship", 0.65],
      ["personality", 0.55],
      ["human_relations", 0.55],
    ]),
    sajuBridgeTags: ["empathy_need", "romantic_attraction"],
    relationshipPreferences: relationship({
      attracts: ["romantic_attraction"],
      needs: ["empathy_need", "independence"],
      risks: ["expression_weakness"],
    }),
  }),
  entry({
    type: "ESTP",
    labelKo: "현장 추진형",
    commonAliasKo: "현장 추진형",
    functionStack: ["Se", "Ti", "Fe", "Ni"],
    summary: "현장에서 바로 판단하고 움직이며 승부감 있게 밀어붙이는 유형입니다.",
    traitTags: ["public_presence", "competition", "direct_speech"],
    riskTags: ["stability_need", "relationship_distance"],
    topicWeights: topicWeights([
      ["work_career", 0.65],
      ["human_relations", 0.6],
      ["environment_luck", 0.55],
    ]),
    sajuBridgeTags: ["competition", "public_presence"],
    relationshipPreferences: relationship({
      attracts: ["public_presence", "romantic_attraction"],
      needs: ["flexibility_need"],
      risks: ["relationship_distance"],
    }),
  }),
  entry({
    type: "ESFP",
    labelKo: "분위기 확장형",
    commonAliasKo: "분위기 확장형",
    functionStack: ["Se", "Fi", "Te", "Ni"],
    summary: "현재 분위기와 사람의 반응을 살려 활기를 만드는 유형입니다.",
    traitTags: ["public_presence", "romantic_attraction", "flexibility_need"],
    riskTags: ["low_rest_capacity", "stability_need"],
    topicWeights: topicWeights([
      ["love_relationship", 0.7],
      ["human_relations", 0.7],
      ["environment_luck", 0.55],
    ]),
    sajuBridgeTags: ["public_presence", "romantic_attraction"],
    relationshipPreferences: relationship({
      attracts: ["public_presence", "romantic_attraction"],
      needs: ["empathy_need", "flexibility_need"],
      risks: ["low_rest_capacity"],
    }),
  }),
] as const satisfies readonly MbtiKnowledgeEntry[];

export const MBTI_KNOWLEDGE_BY_TYPE = new Map(
  MBTI_KNOWLEDGE_BASE.map((item) => [item.type, item]),
);
