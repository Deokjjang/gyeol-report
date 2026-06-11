import type { InterpretationTagId } from "./interpretationTags";
import type {
  FiveElement,
  KnowledgePhraseSeeds,
  SajuKnowledgeEntry,
  SajuKnowledgeTopic,
  SajuTopicInterpretation,
  TenGod,
} from "./sajuKnowledgeTypes";
import { SAJU_KNOWLEDGE_TOPICS } from "./sajuKnowledgeTypes";

export const FIVE_ELEMENTS = [
  "wood",
  "fire",
  "earth",
  "metal",
  "water",
] as const satisfies readonly FiveElement[];

export const TEN_GODS = [
  "bijian",
  "jie_cai",
  "shi_shen",
  "shang_guan",
  "pian_cai",
  "zheng_cai",
  "qi_sha",
  "zheng_guan",
  "pian_yin",
  "zheng_yin",
] as const satisfies readonly TenGod[];

const topicLabels: Record<SajuKnowledgeTopic, string> = {
  personality: "성격",
  strengths: "강점",
  weaknesses: "약점",
  work_career: "일과 직업",
  money_asset: "돈과 자산",
  love_relationship: "연애",
  human_relations: "인간관계",
  family_independence: "가족과 독립",
  study_growth: "학업과 성장",
  environment_luck: "환경 흐름",
  final_advice: "최종 조언",
};

type TopicWeightInput = readonly [SajuKnowledgeTopic, number][];

type EntryInput = Omit<SajuKnowledgeEntry, "phraseSeeds"> & {
  readonly phraseFocus?: string;
  readonly phraseSeeds?: KnowledgePhraseSeeds;
};

function topicWeights(
  entries: TopicWeightInput,
): Partial<Record<SajuKnowledgeTopic, number>> {
  return Object.fromEntries(entries) as Partial<Record<SajuKnowledgeTopic, number>>;
}

function fullTopicWeights(
  primary: TopicWeightInput,
  defaultWeight = 0.36,
): Partial<Record<SajuKnowledgeTopic, number>> {
  return {
    ...Object.fromEntries(
      SAJU_KNOWLEDGE_TOPICS.map((topic) => [topic, defaultWeight]),
    ),
    ...topicWeights(primary),
  } as Partial<Record<SajuKnowledgeTopic, number>>;
}

function richPhraseSeeds(labelKo: string, focus: string): KnowledgePhraseSeeds {
  return {
    analytical: [
      `${labelKo}은 ${focus}을 구조적으로 보여주는 단서입니다.`,
      `${labelKo}을 볼 때는 강점과 소모 지점을 같이 확인합니다.`,
      `${labelKo}은 사주 단독 해석에서 먼저 세워야 할 근거입니다.`,
    ],
    conversational: [
      `${labelKo}이 있으면 평소 반응이 이런 식으로 체감될 수 있습니다.`,
      `${labelKo}은 말보다 행동 패턴에서 먼저 보일 수 있습니다.`,
      `${labelKo}은 MBTI보다 앞에서 성향의 뿌리를 설명합니다.`,
    ],
    caution: [
      `${labelKo}은 강점이 과해질 때 조절이 필요합니다.`,
      `${labelKo}은 빠르게 단정하기보다 다른 원국 신호와 함께 봅니다.`,
    ],
    advice: [
      `${labelKo}은 쓸 자리와 쉬게 할 자리를 나누는 편이 좋습니다.`,
      `${labelKo}은 생활 루틴과 관계 방식으로 보완할 수 있습니다.`,
    ],
  };
}

function topicPack(labelKo: string, focus: string): SajuTopicInterpretation {
  return {
    summary: `${labelKo}은 이 주제에서 ${focus}가 드러나는 방식입니다.`,
    positive: [`${focus}를 잘 쓰면 장점이 선명해집니다.`],
    risk: [`${focus}가 과해지면 긴장이나 거리감이 생기기 쉽습니다.`],
    advice: [`${focus}를 생활 속 기준으로 조절하는 편이 좋습니다.`],
  };
}

function topicInterpretations(
  labelKo: string,
  focus: string,
  topics: readonly SajuKnowledgeTopic[] = SAJU_KNOWLEDGE_TOPICS,
): Partial<Record<SajuKnowledgeTopic, SajuTopicInterpretation>> {
  return Object.fromEntries(
    topics.map((topic) => [
      topic,
      topicPack(labelKo, `${topicLabels[topic]}에서의 ${focus}`),
    ]),
  ) as Partial<Record<SajuKnowledgeTopic, SajuTopicInterpretation>>;
}

function entry(input: EntryInput): SajuKnowledgeEntry {
  const { phraseFocus, phraseSeeds, ...rest } = input;

  return {
    ...rest,
    phraseSeeds: phraseSeeds ?? richPhraseSeeds(input.labelKo, phraseFocus ?? input.summary),
  };
}

function fiveElementEntry(input: {
  readonly id: string;
  readonly labelKo: string;
  readonly aliases: readonly string[];
  readonly coreImageKo: string;
  readonly summary: string;
  readonly meaning: string;
  readonly focus: string;
  readonly positiveTags: readonly InterpretationTagId[];
  readonly riskTags: readonly InterpretationTagId[];
  readonly mbtiBridgeTags: readonly InterpretationTagId[];
  readonly helpfulElements: readonly FiveElement[];
  readonly difficultElements: readonly FiveElement[];
}): SajuKnowledgeEntry {
  return entry({
    id: input.id,
    category: "five_element",
    labelKo: input.labelKo,
    aliases: input.aliases,
    coreImageKo: input.coreImageKo,
    summary: input.summary,
    meaning: input.meaning,
    positiveTags: input.positiveTags,
    riskTags: input.riskTags,
    topicWeights: fullTopicWeights([
      ["personality", 0.72],
      ["strengths", 0.62],
      ["weaknesses", 0.55],
      ["work_career", 0.58],
      ["money_asset", 0.54],
      ["love_relationship", 0.52],
      ["human_relations", 0.52],
      ["study_growth", 0.5],
      ["environment_luck", 0.5],
      ["final_advice", 0.56],
    ]),
    mbtiBridgeTags: input.mbtiBridgeTags,
    topicInterpretations: topicInterpretations(input.labelKo, input.focus),
    balanceHints: {
      whenExcessive: [`${input.labelKo}이 과하면 ${input.focus}가 부담으로 바뀔 수 있습니다.`],
      whenMissing: [`${input.labelKo}이 부족하면 ${input.focus}를 쓰는 속도가 늦어질 수 있습니다.`],
      usefulWhen: [`${input.labelKo}은 ${input.focus}를 건강하게 살릴 때 보완 기운이 됩니다.`],
    },
    matchingHints: {
      helpfulElements: input.helpfulElements,
      difficultElements: input.difficultElements,
      relationshipStyle: [`${input.labelKo} 기운은 관계에서 ${input.focus}를 먼저 드러냅니다.`],
    },
    careerHints: {
      favorableFields: [`${input.focus}를 쓰는 직무`],
      cautionFields: [`${input.focus}가 닫히는 반복 환경`],
      workingStyle: [`${input.focus}를 기준으로 일의 리듬을 잡습니다.`],
    },
    moneyHints: {
      earningStyle: [`${input.focus}가 돈을 버는 방식에 반영됩니다.`],
      assetStyle: [`${input.focus}를 지속 가능한 자산 관리로 연결합니다.`],
      riskStyle: [`${input.focus}가 과하면 지출과 긴장도 함께 커질 수 있습니다.`],
    },
    phraseFocus: input.focus,
  });
}

function tenGodEntry(input: {
  readonly id: string;
  readonly labelKo: string;
  readonly aliases: readonly string[];
  readonly summary: string;
  readonly meaning: string;
  readonly focus: string;
  readonly positiveTags: readonly InterpretationTagId[];
  readonly riskTags: readonly InterpretationTagId[];
  readonly weights: TopicWeightInput;
}): SajuKnowledgeEntry {
  const requiredTopics: readonly SajuKnowledgeTopic[] = [
    "personality",
    "work_career",
    "money_asset",
    "love_relationship",
    "human_relations",
    "weaknesses",
    "final_advice",
  ];

  return entry({
    id: input.id,
    category: "ten_god",
    labelKo: input.labelKo,
    aliases: input.aliases,
    summary: input.summary,
    meaning: input.meaning,
    positiveTags: input.positiveTags,
    riskTags: input.riskTags,
    topicWeights: fullTopicWeights(input.weights, 0.3),
    mbtiBridgeTags: [...input.positiveTags, ...input.riskTags].slice(0, 4),
    topicInterpretations: topicInterpretations(input.labelKo, input.focus, requiredTopics),
    careerHints: {
      favorableFields: [`${input.focus}를 역할로 쓰는 일`],
      cautionFields: [`${input.focus}가 과하게 압축되는 환경`],
      workingStyle: [`${input.labelKo}은 일에서 ${input.focus}를 반복적으로 드러냅니다.`],
    },
    moneyHints: {
      earningStyle: [`${input.labelKo}은 돈에서 ${input.focus}로 움직입니다.`],
      assetStyle: [`${input.labelKo}은 자원을 관리하는 습관을 확인해야 합니다.`],
      riskStyle: [`${input.focus}가 과하면 돈과 관계가 같이 흔들릴 수 있습니다.`],
    },
    phraseFocus: input.focus,
  });
}

function patternEntry(input: {
  readonly id: string;
  readonly labelKo: string;
  readonly aliases: readonly string[];
  readonly summary: string;
  readonly meaning: string;
  readonly focus: string;
  readonly positiveTags: readonly InterpretationTagId[];
  readonly riskTags: readonly InterpretationTagId[];
  readonly weights: TopicWeightInput;
}): SajuKnowledgeEntry {
  return entry({
    id: input.id,
    category: "special_pattern",
    labelKo: input.labelKo,
    aliases: input.aliases,
    summary: input.summary,
    meaning: input.meaning,
    positiveTags: input.positiveTags,
    riskTags: input.riskTags,
    topicWeights: fullTopicWeights(input.weights, 0.28),
    mbtiBridgeTags: [...input.positiveTags, ...input.riskTags].slice(0, 5),
    topicInterpretations: topicInterpretations(input.labelKo, input.focus),
    patternHints: {
      whenStrong: [`${input.labelKo}은 ${input.focus}가 반복될 때 강하게 체감됩니다.`],
      personalityResult: [`성격에서는 ${input.focus}가 기본 반응으로 올라옵니다.`],
      moneyCareerResult: [`돈과 일에서는 ${input.focus}가 성과와 소모를 함께 만듭니다.`],
      relationshipResult: [`관계에서는 ${input.focus}가 거리 조절의 쟁점이 됩니다.`],
      risk: [`${input.focus}가 과하면 회복 리듬이 무너질 수 있습니다.`],
      advice: [`${input.labelKo}은 보완 기운과 생활 루틴을 함께 잡아야 합니다.`],
    },
    phraseFocus: input.focus,
  });
}

function signalEntry(input: {
  readonly id: string;
  readonly category: "sinsal" | "nobleman";
  readonly labelKo: string;
  readonly aliases: readonly string[];
  readonly summary: string;
  readonly meaning: string;
  readonly focus: string;
  readonly positiveTags: readonly InterpretationTagId[];
  readonly riskTags: readonly InterpretationTagId[];
  readonly weights: TopicWeightInput;
}): SajuKnowledgeEntry {
  return entry({
    id: input.id,
    category: input.category,
    labelKo: input.labelKo,
    aliases: input.aliases,
    summary: input.summary,
    meaning: input.meaning,
    positiveTags: input.positiveTags,
    riskTags: input.riskTags,
    topicWeights: fullTopicWeights(input.weights, 0.25),
    mbtiBridgeTags: [...input.positiveTags, ...input.riskTags].slice(0, 5),
    topicInterpretations: topicInterpretations(input.labelKo, input.focus, [
      "personality",
      "strengths",
      "weaknesses",
      "work_career",
      "money_asset",
      "love_relationship",
      "human_relations",
      "study_growth",
      "environment_luck",
      "final_advice",
    ]),
    careerHints: {
      favorableFields: [`${input.focus}가 장점이 되는 분야`],
      cautionFields: [`${input.focus}가 과하게 드러나는 관계형 업무`],
      workingStyle: [`${input.labelKo}은 일에서 ${input.focus}로 체감됩니다.`],
    },
    moneyHints: {
      earningStyle: [`${input.focus}가 돈 흐름의 보조 단서가 됩니다.`],
      assetStyle: [`${input.focus}를 안정적 판단으로 연결해야 합니다.`],
      riskStyle: [`${input.focus}에 끌려 충동적으로 움직이지 않는 편이 좋습니다.`],
    },
    phraseFocus: input.focus,
  });
}

function dayMasterEntry(input: {
  readonly id: string;
  readonly labelKo: string;
  readonly aliases: readonly string[];
  readonly coreImageKo: string;
  readonly summary: string;
  readonly meaning: string;
  readonly focus: string;
  readonly positiveTags: readonly InterpretationTagId[];
  readonly riskTags: readonly InterpretationTagId[];
  readonly helpfulElements: readonly FiveElement[];
  readonly difficultElements: readonly FiveElement[];
}): SajuKnowledgeEntry {
  return entry({
    id: input.id,
    category: "day_master",
    labelKo: input.labelKo,
    aliases: input.aliases,
    coreImageKo: input.coreImageKo,
    summary: input.summary,
    meaning: input.meaning,
    positiveTags: input.positiveTags,
    riskTags: input.riskTags,
    topicWeights: fullTopicWeights([
      ["personality", 0.9],
      ["strengths", 0.72],
      ["weaknesses", 0.58],
      ["work_career", 0.64],
      ["love_relationship", 0.54],
      ["money_asset", 0.5],
      ["final_advice", 0.62],
    ]),
    mbtiBridgeTags: [...input.positiveTags, ...input.riskTags].slice(0, 4),
    topicInterpretations: topicInterpretations(input.labelKo, input.focus),
    matchingHints: {
      helpfulElements: input.helpfulElements,
      difficultElements: input.difficultElements,
      relationshipStyle: [`${input.labelKo}은 관계에서 ${input.focus}를 통해 호불호가 드러납니다.`],
    },
    careerHints: {
      favorableFields: [`${input.focus}가 살아나는 직무`],
      cautionFields: [`${input.focus}가 막히는 경직된 환경`],
      workingStyle: [`${input.labelKo}은 ${input.focus}를 일의 중심축으로 씁니다.`],
    },
    moneyHints: {
      earningStyle: [`${input.focus}를 현실 성과로 바꾸는 방식입니다.`],
      assetStyle: [`${input.focus}가 안정되면 축적 감각이 살아납니다.`],
      riskStyle: [`${input.focus}가 과하면 돈 판단이 조급해질 수 있습니다.`],
    },
    phraseFocus: input.focus,
  });
}

function dayPillarEntry(input: {
  readonly id: string;
  readonly labelKo: string;
  readonly aliases: readonly string[];
  readonly coreImageKo: string;
  readonly summary: string;
  readonly meaning: string;
  readonly focus: string;
  readonly positiveTags: readonly InterpretationTagId[];
  readonly riskTags: readonly InterpretationTagId[];
  readonly coreTension: readonly string[];
  readonly strength: readonly string[];
  readonly risk: readonly string[];
}): SajuKnowledgeEntry {
  return entry({
    id: input.id,
    category: "day_pillar",
    labelKo: input.labelKo,
    aliases: input.aliases,
    coreImageKo: input.coreImageKo,
    summary: input.summary,
    meaning: input.meaning,
    positiveTags: input.positiveTags,
    riskTags: input.riskTags,
    topicWeights: fullTopicWeights([
      ["personality", 0.86],
      ["strengths", 0.68],
      ["weaknesses", 0.58],
      ["work_career", 0.62],
      ["love_relationship", 0.56],
      ["human_relations", 0.56],
      ["money_asset", 0.48],
      ["final_advice", 0.58],
    ]),
    mbtiBridgeTags: [...input.positiveTags, ...input.riskTags].slice(0, 5),
    topicInterpretations: topicInterpretations(input.labelKo, input.focus),
    dayPillarHints: {
      coreTension: input.coreTension,
      strength: input.strength,
      risk: input.risk,
      loveHint: [`${input.labelKo}은 연애에서 ${input.focus}가 호감과 긴장을 함께 만듭니다.`],
      careerHint: [`${input.labelKo}은 일에서 ${input.focus}를 통해 실력을 보입니다.`],
      moneyHint: [`${input.labelKo}은 돈에서 ${input.focus}를 안정된 기준으로 바꿔야 합니다.`],
      relationshipHint: [`${input.labelKo}은 관계에서 ${input.focus}를 조절할 때 편해집니다.`],
    },
    phraseFocus: input.focus,
  });
}

const fiveElementEntries = [
  fiveElementEntry({
    id: "element_wood",
    labelKo: "목",
    aliases: ["wood", "나무", "생장"],
    coreImageKo: "위로 자라는 나무와 방향을 잡는 줄기",
    summary: "성장, 방향, 확장, 기획, 원칙, 수직 이동의 기운입니다.",
    meaning: "목은 위로 뻗고 길을 만드는 힘이라 계획, 성장 욕구, 시작의 감각과 연결됩니다.",
    focus: "성장과 방향 설정",
    positiveTags: ["growth_orientation", "strategic_thinking", "leadership"],
    riskTags: ["flexibility_need", "control_need"],
    mbtiBridgeTags: ["growth_orientation", "strategic_thinking"],
    helpfulElements: ["water", "fire"],
    difficultElements: ["metal"],
  }),
  fiveElementEntry({
    id: "element_fire",
    labelKo: "화",
    aliases: ["fire", "불", "표현"],
    coreImageKo: "빛과 열처럼 밖으로 드러나는 불",
    summary: "표현, 가시성, 매력, output, performance, self-presentation의 기운입니다.",
    meaning: "화는 밖으로 밝아지는 힘이라 말, 표정, 존재감, 빠른 반응과 연결됩니다.",
    focus: "표현과 자기 드러냄",
    positiveTags: ["public_presence", "romantic_attraction", "direct_speech"],
    riskTags: ["burnout_risk", "relationship_distance"],
    mbtiBridgeTags: ["public_presence", "direct_speech"],
    helpfulElements: ["wood", "earth"],
    difficultElements: ["water"],
  }),
  fiveElementEntry({
    id: "element_earth",
    labelKo: "토",
    aliases: ["earth", "흙", "저장"],
    coreImageKo: "담고 저장하며 현실을 붙잡는 땅",
    summary: "현실, 돈, 자산, 저장, 책임, 무게, territory의 기운입니다.",
    meaning: "토는 흐름을 받아 담는 힘이라 돈, 안정, 역할 부담, 현실 처리와 연결됩니다.",
    focus: "현실 책임과 자산화",
    positiveTags: ["asset_building", "responsibility_pressure", "stability_need"],
    riskTags: ["low_rest_capacity", "burnout_risk"],
    mbtiBridgeTags: ["asset_building", "stability_need"],
    helpfulElements: ["fire", "metal"],
    difficultElements: ["wood"],
  }),
  fiveElementEntry({
    id: "element_metal",
    labelKo: "금",
    aliases: ["metal", "쇠", "판단"],
    coreImageKo: "자르고 다듬어 기준을 세우는 금속",
    summary: "규칙, 판단, 정밀성, 권위, 절단력, standards, discipline의 기운입니다.",
    meaning: "금은 자르고 정리하는 힘이라 기준, 분석, 선 긋기, 공식 역할과 연결됩니다.",
    focus: "판단과 기준 세우기",
    positiveTags: ["sharp_analysis", "precision_skill", "authority_orientation"],
    riskTags: ["direct_speech", "relationship_distance"],
    mbtiBridgeTags: ["sharp_analysis", "precision_skill"],
    helpfulElements: ["earth", "water"],
    difficultElements: ["fire"],
  }),
  fiveElementEntry({
    id: "element_water",
    labelKo: "수",
    aliases: ["water", "물", "회복"],
    coreImageKo: "아래로 흐르며 쉬고 배우는 물",
    summary: "휴식, 지혜, 학습, 유연성, 감정 흐름, recovery, depth의 기운입니다.",
    meaning: "수는 내려가고 흐르는 힘이라 회복, 감정 처리, 공부, 적응력과 연결됩니다.",
    focus: "회복과 감정 흐름",
    positiveTags: ["flexibility_need", "growth_orientation", "empathy_need"],
    riskTags: ["loneliness", "emotional_dryness"],
    mbtiBridgeTags: ["flexibility_need", "empathy_need"],
    helpfulElements: ["metal", "wood"],
    difficultElements: ["earth"],
  }),
];

const elementBalanceEntries = [
  entry({
    id: "element_earth_excess",
    category: "element_balance",
    labelKo: "토 과다",
    aliases: ["earth_excess", "토 많음", "토 강함"],
    coreImageKo: "흙이 너무 두꺼워 흐름이 무거워지는 상태",
    summary: "현실감과 책임이 강하지만 무거움과 과부하도 커질 수 있습니다.",
    meaning: "토가 강하면 결과를 남기고 자원을 묶는 힘이 좋지만, 책임을 너무 빨리 떠안을 수 있습니다.",
    positiveTags: ["asset_building", "responsibility_pressure", "stability_need"],
    riskTags: ["low_rest_capacity", "burnout_risk"],
    topicWeights: fullTopicWeights([
      ["money_asset", 0.92],
      ["work_career", 0.68],
      ["weaknesses", 0.66],
      ["final_advice", 0.58],
    ]),
    mbtiBridgeTags: ["asset_building", "efficiency_focus"],
    topicInterpretations: topicInterpretations("토 과다", "현실 책임이 무겁게 쌓이는 흐름"),
    balanceHints: {
      whenExcessive: ["책임, 돈, 소유, 역할이 너무 빨리 몸에 얹힐 수 있습니다."],
      usefulWhen: ["금과 수의 정리와 회복 방향이 부담을 낮추는 데 도움이 됩니다."],
    },
    moneyHints: {
      earningStyle: ["현실 문제를 버티며 자산화하는 방식입니다."],
      assetStyle: ["부동산, 저장, 장기 보유 감각과 잘 맞습니다."],
      riskStyle: ["책임을 돈 문제로만 끌어안으면 회복력이 낮아질 수 있습니다."],
    },
    phraseFocus: "현실 책임과 저장감",
  }),
  entry({
    id: "element_water_missing",
    category: "element_balance",
    labelKo: "수 부족",
    aliases: ["water_missing", "수 약함", "수 기운 부족"],
    coreImageKo: "물길이 얕아 회복과 감정 완충이 늦어지는 상태",
    summary: "감정의 물길과 회복 리듬이 부족해지기 쉬운 구조입니다.",
    meaning: "수 부족은 판단은 빠른데 쉬는 법, 감정 완충, 유연한 전환이 늦게 따라오는 신호입니다.",
    positiveTags: ["self_discipline"],
    riskTags: ["emotional_dryness", "flexibility_need", "low_rest_capacity"],
    topicWeights: fullTopicWeights([
      ["personality", 0.68],
      ["weaknesses", 0.9],
      ["love_relationship", 0.66],
      ["human_relations", 0.58],
      ["final_advice", 0.74],
    ]),
    mbtiBridgeTags: ["emotional_dryness", "low_rest_capacity", "flexibility_need"],
    topicInterpretations: topicInterpretations("수 부족", "회복과 감정 완충이 늦어지는 흐름"),
    balanceHints: {
      whenMissing: ["쉬는 시간, 수면, 감정 확인, 학습 리듬을 의식적으로 만들어야 합니다."],
      usefulWhen: ["금과 수의 루틴이 들어오면 판단의 건조함이 줄어듭니다."],
    },
    phraseFocus: "회복과 감정 완충 부족",
  }),
  entry({
    id: "element_fire_missing",
    category: "element_balance",
    labelKo: "화 부족",
    aliases: ["fire_missing", "화 약함", "화 기운 부족"],
    coreImageKo: "불빛이 늦게 켜져 표현 온도가 낮아지는 상태",
    summary: "표현과 온도가 늦게 켜져 겉보기와 내면 추진력이 다르게 보일 수 있습니다.",
    meaning: "화 부족은 말로 드러내는 속도보다 내부 판단이 먼저 움직이는 구조입니다.",
    positiveTags: ["strategic_thinking"],
    riskTags: ["expression_weakness", "relationship_distance"],
    topicWeights: fullTopicWeights([
      ["personality", 0.58],
      ["love_relationship", 0.68],
      ["human_relations", 0.64],
      ["weaknesses", 0.58],
      ["final_advice", 0.58],
    ]),
    mbtiBridgeTags: ["expression_weakness", "emotional_dryness"],
    topicInterpretations: topicInterpretations("화 부족", "표현 온도가 늦게 올라오는 흐름"),
    balanceHints: {
      whenMissing: ["호감, 기쁨, 불편함을 말로 늦게 표현할 수 있습니다."],
      usefulWhen: ["화의 활동, 발표, 움직임, 햇빛 루틴이 표현 보완에 도움이 됩니다."],
    },
    phraseFocus: "표현과 온기 부족",
  }),
  entry({
    id: "element_wood_missing",
    category: "element_balance",
    labelKo: "목 부족",
    aliases: ["wood_missing", "목 약함", "목 기운 부족"],
    coreImageKo: "새싹이 늦게 올라와 방향 전환이 뻣뻣해지는 상태",
    summary: "새 길을 여는 유연함보다 기존 기준을 붙잡기 쉬운 흐름입니다.",
    meaning: "목 부족은 방향 전환과 장기 확장보다 현재 책임과 규칙이 앞서는 신호입니다.",
    positiveTags: ["self_discipline"],
    riskTags: ["flexibility_need", "stability_need"],
    topicWeights: fullTopicWeights([
      ["weaknesses", 0.62],
      ["study_growth", 0.58],
      ["final_advice", 0.58],
    ]),
    mbtiBridgeTags: ["stability_need", "flexibility_need"],
    topicInterpretations: topicInterpretations("목 부족", "새 방향을 여는 힘이 늦어지는 흐름"),
    balanceHints: {
      whenMissing: ["계획을 새로 세우기보다 기존 틀을 오래 붙잡을 수 있습니다."],
      usefulWhen: ["목의 성장 루틴과 작은 시작을 반복하는 방식이 도움이 됩니다."],
    },
    phraseFocus: "방향 전환과 성장 보완",
  }),
  entry({
    id: "element_metal_strong",
    category: "element_balance",
    labelKo: "금 강함",
    aliases: ["metal_strong", "금 강세", "금 기운 강함"],
    coreImageKo: "날이 선 금속처럼 판단 기준이 선명한 상태",
    summary: "판단, 기준, 정밀성이 선명하게 살아나는 구조입니다.",
    meaning: "금이 강하면 일과 관계를 흐릿하게 두기보다 기준을 세워 정리하려 합니다.",
    positiveTags: ["sharp_analysis", "precision_skill", "authority_orientation"],
    riskTags: ["direct_speech", "relationship_distance"],
    topicWeights: fullTopicWeights([
      ["personality", 0.68],
      ["work_career", 0.78],
      ["human_relations", 0.54],
      ["weaknesses", 0.54],
    ]),
    mbtiBridgeTags: ["sharp_analysis", "direct_speech"],
    topicInterpretations: topicInterpretations("금 강함", "판단과 기준이 선명해지는 흐름"),
    balanceHints: {
      whenExcessive: ["말과 판단이 빠르게 날카로워질 수 있습니다."],
      usefulWhen: ["수의 완충과 화의 표현 온도가 들어오면 관계 압박이 줄어듭니다."],
    },
    phraseFocus: "판단 기준과 정밀성",
  }),
];

const tenGodEntries = [
  tenGodEntry({
    id: "ten_god_bijian",
    labelKo: "비견",
    aliases: ["bijian", "비견", "견줄 비견"],
    summary: "self, independence, peer, self-assertion, rivalry를 뜻합니다.",
    meaning: "비견은 나와 같은 결의 힘이라 주도성, 동료 경쟁, 독립 욕구와 연결됩니다.",
    focus: "자기 기준과 독립성",
    positiveTags: ["independence", "self_discipline"],
    riskTags: ["competition", "control_need"],
    weights: [
      ["personality", 0.72],
      ["human_relations", 0.62],
      ["work_career", 0.52],
      ["weaknesses", 0.48],
    ],
  }),
  tenGodEntry({
    id: "ten_god_jie_cai",
    labelKo: "겁재",
    aliases: ["jie_cai", "겁재"],
    summary: "competition, boldness, loss through people, strong peer pressure를 뜻합니다.",
    meaning: "겁재는 나와 비슷한 힘이 자원을 흔드는 구조라 협업과 경쟁이 함께 올라옵니다.",
    focus: "경쟁과 사람을 통한 자원 변동",
    positiveTags: ["competition", "leadership"],
    riskTags: ["money_orientation", "relationship_distance"],
    weights: [
      ["human_relations", 0.72],
      ["money_asset", 0.64],
      ["weaknesses", 0.62],
    ],
  }),
  tenGodEntry({
    id: "ten_god_shi_shen",
    labelKo: "식신",
    aliases: ["shi_shen", "식신"],
    summary: "stable expression, talent, production, enjoyment, nurturing output을 뜻합니다.",
    meaning: "식신은 내가 만들어 밖으로 내보내는 힘이라 결과물, 말, 콘텐츠, 안정적 생산성과 연결됩니다.",
    focus: "안정적 표현과 생산성",
    positiveTags: ["public_presence", "growth_orientation"],
    riskTags: ["low_rest_capacity", "stability_need"],
    weights: [
      ["work_career", 0.72],
      ["study_growth", 0.58],
      ["love_relationship", 0.52],
      ["strengths", 0.62],
    ],
  }),
  tenGodEntry({
    id: "ten_god_shang_guan",
    labelKo: "상관",
    aliases: ["shang_guan", "상관"],
    summary: "sharp expression, rebellion, creativity, rule-breaking, critique를 뜻합니다.",
    meaning: "상관은 기존 권위를 건드리는 output이라 말의 힘, 기획력, 예민한 표현과 연결됩니다.",
    focus: "날카로운 표현과 비판성",
    positiveTags: ["direct_speech", "sharp_analysis", "public_presence"],
    riskTags: ["relationship_distance", "authority_orientation"],
    weights: [
      ["personality", 0.66],
      ["work_career", 0.74],
      ["human_relations", 0.64],
      ["weaknesses", 0.56],
    ],
  }),
  tenGodEntry({
    id: "ten_god_pian_cai",
    labelKo: "편재",
    aliases: ["pian_cai", "편재", "재성"],
    summary: "large money, external opportunities, business sense, active asset movement를 뜻합니다.",
    meaning: "편재는 고정급보다 흐름 속 자원을 읽는 힘이라 사업성, 사람 자원, 기회 포착과 연결됩니다.",
    focus: "외부 기회와 큰돈 감각",
    positiveTags: ["money_orientation", "asset_building", "strategic_thinking"],
    riskTags: ["burnout_risk", "responsibility_pressure"],
    weights: [
      ["money_asset", 0.94],
      ["work_career", 0.72],
      ["love_relationship", 0.52],
      ["strengths", 0.62],
    ],
  }),
  tenGodEntry({
    id: "ten_god_zheng_cai",
    labelKo: "정재",
    aliases: ["zheng_cai", "정재", "재성"],
    summary: "stable money, salary, practical management, ownership, responsibility를 뜻합니다.",
    meaning: "정재는 예측 가능한 자원을 관리하는 힘이라 예산, 안정, 소유, 책임과 연결됩니다.",
    focus: "안정적 돈 관리와 소유 책임",
    positiveTags: ["asset_building", "stability_need", "self_discipline"],
    riskTags: ["responsibility_pressure"],
    weights: [
      ["money_asset", 0.9],
      ["family_independence", 0.58],
      ["final_advice", 0.52],
      ["strengths", 0.58],
    ],
  }),
  tenGodEntry({
    id: "ten_god_qi_sha",
    labelKo: "편관",
    aliases: ["qi_sha", "칠살", "편관", "관성"],
    summary: "pressure, challenge, charisma, survival, discipline, crisis response를 뜻합니다.",
    meaning: "편관은 긴장 속에서 기준을 세우는 힘이라 추진력, 리더십, 압박감과 연결됩니다.",
    focus: "압박 속 리더십과 생존력",
    positiveTags: ["leadership", "authority_orientation", "self_discipline"],
    riskTags: ["responsibility_pressure", "burnout_risk"],
    weights: [
      ["work_career", 0.9],
      ["weaknesses", 0.68],
      ["final_advice", 0.58],
      ["strengths", 0.66],
    ],
  }),
  tenGodEntry({
    id: "ten_god_zheng_guan",
    labelKo: "정관",
    aliases: ["zheng_guan", "정관", "관성"],
    summary: "order, honor, responsibility, system, title, social recognition을 뜻합니다.",
    meaning: "정관은 사회적 기준을 내 안에 세우는 힘이라 직함, 신뢰, 조직 감각과 연결됩니다.",
    focus: "질서와 공식 책임",
    positiveTags: ["authority_orientation", "self_discipline", "leadership"],
    riskTags: ["responsibility_pressure", "control_need"],
    weights: [
      ["work_career", 0.86],
      ["human_relations", 0.58],
      ["family_independence", 0.52],
      ["strengths", 0.62],
    ],
  }),
  tenGodEntry({
    id: "ten_god_pian_yin",
    labelKo: "편인",
    aliases: ["pian_yin", "편인", "인성"],
    summary: "unusual learning, intuition, solitude, obsession, unconventional thought를 뜻합니다.",
    meaning: "편인은 남들과 다른 방식으로 받아들이는 힘이라 직관, 연구, 고립된 집중과 연결됩니다.",
    focus: "비정형 학습과 고독한 몰입",
    positiveTags: ["strategic_thinking", "precision_skill", "independence"],
    riskTags: ["loneliness", "relationship_distance"],
    weights: [
      ["study_growth", 0.86],
      ["personality", 0.62],
      ["human_relations", 0.48],
      ["weaknesses", 0.54],
    ],
  }),
  tenGodEntry({
    id: "ten_god_zheng_yin",
    labelKo: "정인",
    aliases: ["zheng_yin", "정인", "인성"],
    summary: "learning, protection, mothering, documents, recovery, support를 뜻합니다.",
    meaning: "정인은 지식과 돌봄을 받아 내면을 채우는 힘이라 공부, 자격, 신뢰와 연결됩니다.",
    focus: "정리된 학습과 보호",
    positiveTags: ["stability_need", "self_discipline", "growth_orientation"],
    riskTags: ["low_rest_capacity"],
    weights: [
      ["study_growth", 0.82],
      ["family_independence", 0.56],
      ["final_advice", 0.52],
      ["strengths", 0.56],
    ],
  }),
];

const patternEntries = [
  patternEntry({
    id: "pattern_jaeda_sinyak",
    labelKo: "재다신약",
    aliases: ["재다신약", "재성 강하고 일간 약함"],
    summary: "돈과 책임 신호가 강한데 자신을 받치는 힘은 약해질 수 있는 구조입니다.",
    meaning: "재다신약은 현실 책임과 자원 관리 압박이 커져 성취욕과 소모가 같이 올라오는 후보 구조입니다.",
    focus: "현실 책임과 회복력 사이의 긴장",
    positiveTags: ["money_orientation", "achievement_drive"],
    riskTags: ["burnout_risk", "responsibility_pressure", "low_rest_capacity"],
    weights: [
      ["money_asset", 0.94],
      ["work_career", 0.78],
      ["weaknesses", 0.82],
      ["final_advice", 0.74],
    ],
  }),
  patternEntry({
    id: "pattern_gwansal_honjob",
    labelKo: "관살혼잡",
    aliases: ["관살혼잡", "정관 편관 혼재"],
    summary: "공식 책임과 압박 책임이 함께 들어오는 구조입니다.",
    meaning: "관살혼잡은 기준은 강하지만 어느 기준을 따라야 하는지 혼선이 생기기 쉬운 후보 구조입니다.",
    focus: "책임 기준의 혼선과 압박",
    positiveTags: ["responsibility_pressure", "authority_orientation"],
    riskTags: ["control_need", "burnout_risk"],
    weights: [
      ["work_career", 0.78],
      ["weaknesses", 0.7],
      ["final_advice", 0.58],
    ],
  }),
  patternEntry({
    id: "pattern_siksang_saengjae",
    labelKo: "식상생재",
    aliases: ["식상생재", "output to money"],
    summary: "표현과 생산이 돈과 기회로 이어지는 구조입니다.",
    meaning: "식상생재는 내가 만든 결과물이 시장성, 교환, 자원 흐름으로 연결되는 후보 구조입니다.",
    focus: "결과물을 돈 흐름으로 바꾸는 힘",
    positiveTags: ["money_orientation", "public_presence", "efficiency_focus"],
    riskTags: ["burnout_risk"],
    weights: [
      ["work_career", 0.82],
      ["money_asset", 0.88],
      ["strengths", 0.68],
    ],
  }),
  patternEntry({
    id: "pattern_jaesaenggwan",
    labelKo: "재생관",
    aliases: ["재생관", "money to authority"],
    summary: "자원 관리가 역할과 신뢰로 이어지는 구조입니다.",
    meaning: "재생관은 현실 성과가 공식 역할, 직함, 책임으로 이어지는 후보 구조입니다.",
    focus: "자산 관리가 사회적 책임으로 연결되는 흐름",
    positiveTags: ["asset_building", "authority_orientation", "leadership"],
    riskTags: ["responsibility_pressure"],
    weights: [
      ["work_career", 0.78],
      ["money_asset", 0.7],
      ["environment_luck", 0.58],
    ],
  }),
  patternEntry({
    id: "pattern_salin_sangsaeng",
    labelKo: "살인상생",
    aliases: ["살인상생", "압박이 학습으로 전환"],
    summary: "압박을 공부와 전문성으로 바꾸는 구조입니다.",
    meaning: "살인상생은 긴장을 실력으로 전환할 때 강해지는 후보 구조입니다.",
    focus: "압박을 전문성으로 전환하는 힘",
    positiveTags: ["precision_skill", "self_discipline", "growth_orientation"],
    riskTags: ["responsibility_pressure"],
    weights: [
      ["study_growth", 0.84],
      ["work_career", 0.74],
      ["final_advice", 0.58],
    ],
  }),
  patternEntry({
    id: "pattern_singang",
    labelKo: "신강",
    aliases: ["신강", "일간 강함"],
    summary: "자기 중심축과 버티는 힘이 강한 구조입니다.",
    meaning: "신강은 외부 압력보다 자기 기준이 먼저 서는 후보 구조입니다.",
    focus: "자기 기준과 버티는 힘",
    positiveTags: ["independence", "self_discipline"],
    riskTags: ["control_need", "competition"],
    weights: [
      ["personality", 0.74],
      ["strengths", 0.66],
      ["weaknesses", 0.54],
    ],
  }),
  patternEntry({
    id: "pattern_sinyak",
    labelKo: "신약",
    aliases: ["신약", "일간 약함"],
    summary: "외부 역할과 환경 압력이 자기 리듬보다 크게 느껴질 수 있는 구조입니다.",
    meaning: "신약은 주변 조건을 잘 읽는 대신 회복과 자기 기준 보강이 중요해지는 후보 구조입니다.",
    focus: "외부 압력과 자기 회복 사이의 균형",
    positiveTags: ["empathy_need", "strategic_thinking"],
    riskTags: ["low_rest_capacity", "relationship_distance"],
    weights: [
      ["weaknesses", 0.74],
      ["human_relations", 0.58],
      ["final_advice", 0.68],
    ],
  }),
  patternEntry({
    id: "pattern_no_resource",
    labelKo: "무인성",
    aliases: ["무인성", "인성 부족", "resource missing"],
    summary: "받아들이고 쉬고 보호받는 인성 흐름이 약한 구조입니다.",
    meaning: "무인성은 혼자 판단하고 버티는 쪽으로 흐르기 쉬워 감정 건조와 회복 부족을 설명합니다.",
    focus: "지원 수용과 회복감 부족",
    positiveTags: ["self_discipline", "independence"],
    riskTags: ["emotional_dryness", "low_rest_capacity", "loneliness"],
    weights: [
      ["weaknesses", 0.9],
      ["study_growth", 0.62],
      ["love_relationship", 0.58],
      ["final_advice", 0.76],
    ],
  }),
  patternEntry({
    id: "pattern_no_output",
    labelKo: "무식상",
    aliases: ["무식상", "식상 부족", "output missing"],
    summary: "말, 표현, 결과물로 풀어내는 식상 흐름이 약한 구조입니다.",
    meaning: "무식상은 생각은 있는데 부드럽게 말하거나 감정을 외부화하는 속도가 늦은 흐름입니다.",
    focus: "표현과 부드러운 output 부족",
    positiveTags: ["strategic_thinking", "self_discipline"],
    riskTags: ["expression_weakness", "relationship_distance", "emotional_dryness"],
    weights: [
      ["weaknesses", 0.88],
      ["human_relations", 0.68],
      ["love_relationship", 0.62],
      ["final_advice", 0.72],
    ],
  }),
  patternEntry({
    id: "pattern_toda_maegeum",
    labelKo: "토다매금",
    aliases: ["토다매금", "토가 금을 묻음"],
    summary: "토가 너무 많아 금의 판단력과 정밀성이 묻힐 수 있는 구조입니다.",
    meaning: "토다매금은 책임과 현실 문제가 판단 속도를 누르는 후보 구조입니다.",
    focus: "책임 과부하가 판단을 누르는 흐름",
    positiveTags: ["responsibility_pressure", "asset_building"],
    riskTags: ["low_rest_capacity", "burnout_risk"],
    weights: [
      ["weaknesses", 0.76],
      ["work_career", 0.66],
      ["money_asset", 0.68],
    ],
  }),
  patternEntry({
    id: "pattern_geumda_mokjeol",
    labelKo: "금다목절",
    aliases: ["금다목절", "금이 목을 자름"],
    summary: "금의 기준이 강해 목의 성장성과 유연성이 눌릴 수 있는 구조입니다.",
    meaning: "금다목절은 원칙과 판단이 성장 욕구를 압박하는 후보 구조입니다.",
    focus: "강한 기준이 성장 욕구를 압박하는 흐름",
    positiveTags: ["precision_skill", "self_discipline"],
    riskTags: ["control_need", "flexibility_need"],
    weights: [
      ["personality", 0.68],
      ["weaknesses", 0.72],
      ["work_career", 0.62],
    ],
  }),
  patternEntry({
    id: "pattern_mokda_hwasik",
    labelKo: "목다화식",
    aliases: ["목다화식", "목이 화를 먹음"],
    summary: "목의 계획과 확장이 많아 화의 표현이 소모될 수 있는 구조입니다.",
    meaning: "목다화식은 계획은 많은데 드러내는 에너지가 따라오지 못하는 후보 구조입니다.",
    focus: "확장 욕구와 표현 에너지의 불균형",
    positiveTags: ["growth_orientation", "strategic_thinking"],
    riskTags: ["burnout_risk", "expression_weakness"],
    weights: [
      ["personality", 0.62],
      ["weaknesses", 0.68],
      ["final_advice", 0.58],
    ],
  }),
  patternEntry({
    id: "pattern_suda_mokbu",
    labelKo: "수다목부",
    aliases: ["수다목부", "물이 많아 목이 뜸"],
    summary: "수의 생각과 감정 흐름이 많아 목의 방향성이 떠버릴 수 있는 구조입니다.",
    meaning: "수다목부는 생각과 감정 정보가 많아 실행 방향을 고정하기 어려운 후보 구조입니다.",
    focus: "많은 정보와 감정이 방향성을 흔드는 흐름",
    positiveTags: ["strategic_thinking", "empathy_need"],
    riskTags: ["loneliness", "flexibility_need"],
    weights: [
      ["study_growth", 0.68],
      ["weaknesses", 0.66],
      ["final_advice", 0.6],
    ],
  }),
];

const signalEntries = [
  signalEntry({
    id: "sinsal_hyeonchim",
    category: "sinsal",
    labelKo: "현침살",
    aliases: ["현침", "현침살"],
    summary: "precision, sharp words, analysis, technical detail, self-criticism risk를 보는 신호입니다.",
    meaning: "현침살은 분석과 검수에는 강점이 되지만 말의 강도가 높아질 때 조절이 필요합니다.",
    focus: "예리한 판단과 직설 표현",
    positiveTags: ["sharp_analysis", "precision_skill"],
    riskTags: ["direct_speech", "relationship_distance"],
    weights: [
      ["personality", 0.76],
      ["work_career", 0.72],
      ["human_relations", 0.68],
      ["weaknesses", 0.66],
    ],
  }),
  signalEntry({
    id: "sinsal_hongyeom",
    category: "sinsal",
    labelKo: "홍염살",
    aliases: ["홍염", "홍염살"],
    summary: "subtle attraction, charm, romantic curiosity, aura, charisma를 보는 신호입니다.",
    meaning: "홍염살은 매력과 존재감을 키우지만 관계 기대가 빠르게 붙을 때 거리를 조절해야 합니다.",
    focus: "은근한 매력과 호감 유발",
    positiveTags: ["romantic_attraction", "public_presence"],
    riskTags: ["workplace_romance", "relationship_distance"],
    weights: [
      ["love_relationship", 0.9],
      ["human_relations", 0.66],
      ["personality", 0.5],
    ],
  }),
  signalEntry({
    id: "sinsal_mangsin",
    category: "sinsal",
    labelKo: "망신살",
    aliases: ["망신", "망신살"],
    summary: "내 모습이 외부 평가와 시선에 드러나는 신호입니다.",
    meaning: "망신살은 노출과 평가가 커지는 신호라 발표, 공개 활동, 평판 관리와 연결됩니다.",
    focus: "평판과 공개 노출",
    positiveTags: ["public_presence", "self_discipline"],
    riskTags: ["relationship_distance"],
    weights: [
      ["human_relations", 0.64],
      ["work_career", 0.6],
      ["environment_luck", 0.5],
    ],
  }),
  signalEntry({
    id: "sinsal_baekho",
    category: "sinsal",
    labelKo: "백호대살",
    aliases: ["백호", "백호대살"],
    summary: "강한 압축 에너지와 긴장성을 가진 신호입니다.",
    meaning: "백호대살은 위기 대응과 몰입에는 강하지만 몸과 마음의 긴장을 풀 루틴이 필요합니다.",
    focus: "압축된 긴장과 위기 대응",
    positiveTags: ["self_discipline", "precision_skill"],
    riskTags: ["burnout_risk", "low_rest_capacity"],
    weights: [
      ["work_career", 0.58],
      ["weaknesses", 0.7],
      ["final_advice", 0.64],
    ],
  }),
  signalEntry({
    id: "sinsal_yeokma",
    category: "sinsal",
    labelKo: "역마살",
    aliases: ["역마", "역마살"],
    summary: "movement, relocation, overseas, job change, expansion, restlessness를 보는 신호입니다.",
    meaning: "역마살은 움직임과 변화 속에서 기회가 보이는 신호라 고정된 환경만 고집하면 답답해질 수 있습니다.",
    focus: "이동과 변화 속 기회",
    positiveTags: ["flexibility_need", "growth_orientation"],
    riskTags: ["stability_need"],
    weights: [
      ["environment_luck", 0.86],
      ["work_career", 0.6],
      ["final_advice", 0.55],
    ],
  }),
  signalEntry({
    id: "sinsal_gwimun",
    category: "sinsal",
    labelKo: "귀문관살",
    aliases: ["귀문", "귀문관살"],
    summary: "sensitivity, obsession, unusual intuition, deep immersion, suspicion risk를 보는 신호입니다.",
    meaning: "귀문관살은 남들이 놓친 분위기와 단서를 잡는 대신 생각이 안쪽으로 깊게 말릴 수 있습니다.",
    focus: "예민한 몰입과 비정형 직관",
    positiveTags: ["sharp_analysis", "strategic_thinking"],
    riskTags: ["loneliness", "emotional_dryness"],
    weights: [
      ["personality", 0.64],
      ["study_growth", 0.6],
      ["weaknesses", 0.62],
    ],
  }),
  signalEntry({
    id: "sinsal_wonjin",
    category: "sinsal",
    labelKo: "원진살",
    aliases: ["원진", "원진살"],
    summary: "relationship friction, love-hate, misunderstanding, emotional distance를 보는 신호입니다.",
    meaning: "원진살은 호감과 불편함이 함께 움직일 수 있어 감정 해석을 서두르지 않는 편이 좋습니다.",
    focus: "관계 마찰과 감정 거리",
    positiveTags: ["empathy_need"],
    riskTags: ["relationship_distance", "loneliness"],
    weights: [
      ["love_relationship", 0.76],
      ["human_relations", 0.7],
      ["weaknesses", 0.62],
      ["family_independence", 0.5],
    ],
  }),
  signalEntry({
    id: "sinsal_dohwa",
    category: "sinsal",
    labelKo: "도화살",
    aliases: ["도화", "도화살"],
    summary: "visibility, popularity, attraction, public appeal, social exposure를 보는 신호입니다.",
    meaning: "도화살은 사람들의 시선과 감정 반응이 붙기 쉬워 대외 활동과 관계 매력을 함께 봅니다.",
    focus: "대외 주목성과 사회적 매력",
    positiveTags: ["romantic_attraction", "public_presence"],
    riskTags: ["workplace_romance", "relationship_distance"],
    weights: [
      ["love_relationship", 0.86],
      ["human_relations", 0.72],
      ["environment_luck", 0.58],
    ],
  }),
  signalEntry({
    id: "sinsal_hwagae",
    category: "sinsal",
    labelKo: "화개살",
    aliases: ["화개", "화개살"],
    summary: "solitude, art, religion/philosophy, depth, isolation, unique taste를 보는 신호입니다.",
    meaning: "화개살은 혼자 깊이 몰입하고 의미를 정리하는 흐름이라 예술성, 철학성, 고독감과 연결됩니다.",
    focus: "고독한 몰입과 독특한 취향",
    positiveTags: ["strategic_thinking", "precision_skill"],
    riskTags: ["loneliness", "relationship_distance"],
    weights: [
      ["study_growth", 0.72],
      ["personality", 0.64],
      ["weaknesses", 0.58],
    ],
  }),
  signalEntry({
    id: "sinsal_goegang",
    category: "sinsal",
    labelKo: "괴강살",
    aliases: ["괴강", "괴강살"],
    summary: "강한 기세, 독립성, 압도감, 단호함을 보는 신호입니다.",
    meaning: "괴강살은 밀고 나가는 기세가 강해 리더십으로 쓰이면 좋지만 관계에서는 압박으로 보일 수 있습니다.",
    focus: "강한 기세와 단호함",
    positiveTags: ["leadership", "self_discipline"],
    riskTags: ["control_need", "relationship_distance"],
    weights: [
      ["work_career", 0.7],
      ["personality", 0.66],
      ["weaknesses", 0.6],
    ],
  }),
  signalEntry({
    id: "sinsal_yangin",
    category: "sinsal",
    labelKo: "양인살",
    aliases: ["양인", "양인살"],
    summary: "강한 자기 보호, 승부성, 칼날 같은 추진을 보는 신호입니다.",
    meaning: "양인살은 방어와 결단이 강해 위기 대응에는 좋지만 부드러운 협의가 약해질 수 있습니다.",
    focus: "승부성과 자기 보호",
    positiveTags: ["competition", "self_discipline"],
    riskTags: ["direct_speech", "control_need"],
    weights: [
      ["personality", 0.64],
      ["work_career", 0.64],
      ["weaknesses", 0.66],
    ],
  }),
  signalEntry({
    id: "sinsal_cheonmun",
    category: "sinsal",
    labelKo: "천문성",
    aliases: ["천문", "천문성"],
    summary: "하늘의 문처럼 통찰, 철학, 상징 이해를 보는 신호입니다.",
    meaning: "천문성은 보이는 사건 너머의 의미와 구조를 읽으려는 감각과 연결됩니다.",
    focus: "상징과 구조를 읽는 통찰",
    positiveTags: ["strategic_thinking", "growth_orientation"],
    riskTags: ["loneliness"],
    weights: [
      ["study_growth", 0.72],
      ["personality", 0.6],
      ["final_advice", 0.56],
    ],
  }),
  signalEntry({
    id: "sinsal_wolsal",
    category: "sinsal",
    labelKo: "월살",
    aliases: ["월살", "달살"],
    summary: "정체, 대기, 방향 전환 전의 멈춤을 보는 신호입니다.",
    meaning: "월살은 속도를 낮추고 다음 선택을 기다리는 흐름이라 조급함보다 타이밍 관리가 중요합니다.",
    focus: "멈춤과 타이밍 조절",
    positiveTags: ["strategic_thinking", "stability_need"],
    riskTags: ["low_rest_capacity", "loneliness"],
    weights: [
      ["environment_luck", 0.68],
      ["final_advice", 0.62],
      ["weaknesses", 0.54],
    ],
  }),
  signalEntry({
    id: "sinsal_jangseong",
    category: "sinsal",
    labelKo: "장성살",
    aliases: ["장성", "장성살"],
    summary: "자리, 권위, 책임, 중심 역할을 보는 신호입니다.",
    meaning: "장성살은 앞으로 나서서 책임을 잡는 기운이라 조직과 역할 안에서 존재감이 커집니다.",
    focus: "중심 역할과 책임감",
    positiveTags: ["leadership", "authority_orientation"],
    riskTags: ["responsibility_pressure"],
    weights: [
      ["work_career", 0.78],
      ["strengths", 0.66],
      ["environment_luck", 0.56],
    ],
  }),
  signalEntry({
    id: "sinsal_banan",
    category: "sinsal",
    labelKo: "반안살",
    aliases: ["반안", "반안살"],
    summary: "올라타는 기회, 인정, 이동 중 상승감을 보는 신호입니다.",
    meaning: "반안살은 도움의 자리에 올라타는 흐름이라 좋은 환경과 타이밍을 활용할 때 장점이 살아납니다.",
    focus: "기회에 올라타는 상승 흐름",
    positiveTags: ["public_presence", "growth_orientation"],
    riskTags: ["stability_need"],
    weights: [
      ["environment_luck", 0.76],
      ["work_career", 0.58],
      ["final_advice", 0.54],
    ],
  }),
  signalEntry({
    id: "nobleman_cheoneul",
    category: "nobleman",
    labelKo: "천을귀인",
    aliases: ["천을", "천을귀인"],
    summary: "help in crisis, noble support, problem relief, unexpected assistance를 보는 도움 신호입니다.",
    meaning: "천을귀인은 누군가가 알아서 해결해 준다는 뜻보다 도움을 받을 태도와 연결망이 열리는 신호입니다.",
    focus: "위기 완충과 도움 연결",
    positiveTags: ["stability_need", "empathy_need"],
    riskTags: [],
    weights: [
      ["environment_luck", 0.9],
      ["strengths", 0.7],
      ["human_relations", 0.62],
      ["final_advice", 0.62],
    ],
  }),
  signalEntry({
    id: "nobleman_cheondeok",
    category: "nobleman",
    labelKo: "천덕귀인",
    aliases: ["천덕", "천덕귀인"],
    summary: "갈등을 부드럽게 낮추는 완충과 보호의 도움 신호입니다.",
    meaning: "천덕귀인은 극단으로 치닫는 흐름을 누그러뜨리는 주변 조건과 연결됩니다.",
    focus: "갈등 완충과 보호",
    positiveTags: ["stability_need", "empathy_need"],
    riskTags: [],
    weights: [
      ["environment_luck", 0.78],
      ["strengths", 0.64],
      ["human_relations", 0.56],
      ["final_advice", 0.56],
    ],
  }),
  signalEntry({
    id: "nobleman_woldeok",
    category: "nobleman",
    labelKo: "월덕귀인",
    aliases: ["월덕", "월덕귀인"],
    summary: "관계와 환경에서 부드러운 도움을 받기 쉬운 신호입니다.",
    meaning: "월덕귀인은 주변의 호의와 완충 장치가 생기기 쉬운 도움 신호입니다.",
    focus: "관계 호의와 환경 완충",
    positiveTags: ["stability_need", "public_presence"],
    riskTags: [],
    weights: [
      ["environment_luck", 0.78],
      ["strengths", 0.62],
      ["human_relations", 0.6],
      ["final_advice", 0.54],
    ],
  }),
  signalEntry({
    id: "nobleman_munchang",
    category: "nobleman",
    labelKo: "문창귀인",
    aliases: ["문창", "문창귀인"],
    summary: "writing, study, planning, documentation, language, intellectual skill을 보는 지적 도움 신호입니다.",
    meaning: "문창귀인은 생각을 정리해 말과 글로 풀어내는 능력과 연결됩니다.",
    focus: "학습과 문서화 능력",
    positiveTags: ["precision_skill", "strategic_thinking"],
    riskTags: [],
    weights: [
      ["study_growth", 0.9],
      ["work_career", 0.62],
      ["strengths", 0.66],
      ["final_advice", 0.54],
    ],
  }),
  signalEntry({
    id: "nobleman_taegeuk",
    category: "nobleman",
    labelKo: "태극귀인",
    aliases: ["태극", "태극귀인"],
    summary: "큰 흐름을 읽고 의미를 붙이는 감각의 도움 신호입니다.",
    meaning: "태극귀인은 사건보다 구조와 의미를 보려는 관점과 연결됩니다.",
    focus: "큰 의미와 구조 이해",
    positiveTags: ["strategic_thinking", "growth_orientation"],
    riskTags: ["loneliness"],
    weights: [
      ["study_growth", 0.68],
      ["environment_luck", 0.64],
      ["strengths", 0.58],
      ["final_advice", 0.54],
    ],
  }),
  signalEntry({
    id: "nobleman_jaego",
    category: "nobleman",
    labelKo: "재고귀인",
    aliases: ["재고", "재고귀인", "자산 창고"],
    summary: "stored wealth, assetization, property, money container, delayed gain을 보는 도움 신호입니다.",
    meaning: "재고귀인은 재물이 바로 튀어나오기보다 관리, 보관, 축적 감각으로 작동하는 신호입니다.",
    focus: "돈을 담아 자산화하는 감각",
    positiveTags: ["asset_building", "money_orientation"],
    riskTags: ["stability_need"],
    weights: [
      ["money_asset", 0.88],
      ["environment_luck", 0.6],
      ["strengths", 0.58],
      ["final_advice", 0.54],
    ],
  }),
  signalEntry({
    id: "gwiin_jaego",
    category: "nobleman",
    labelKo: "재고귀인",
    aliases: ["재고귀인 gwiin", "재고 도움", "money storage nobleman"],
    summary: "재고귀인을 gwiin 네이밍으로 조회하기 위한 자산 축적 도움 신호입니다.",
    meaning: "gwiin_jaego는 결제 후 리포트 evidence에서 재고귀인을 일관되게 찾기 위한 공개 지식 ID입니다.",
    focus: "자산 저장과 늦게 열리는 돈 흐름",
    positiveTags: ["asset_building", "money_orientation"],
    riskTags: ["stability_need"],
    weights: [
      ["money_asset", 0.9],
      ["environment_luck", 0.58],
      ["strengths", 0.56],
      ["final_advice", 0.54],
    ],
  }),
];

const dayMasterEntries = [
  dayMasterEntry({
    id: "day_master_gabmok",
    labelKo: "갑목",
    aliases: ["甲木", "갑목", "큰 나무"],
    coreImageKo: "하늘로 곧게 자라는 큰 나무",
    summary: "큰 줄기를 세우고 위로 뻗는 시작과 지휘의 일간입니다.",
    meaning: "갑목은 방향을 세우고 앞에서 길을 내는 힘이라 성장, 기준, 리더십과 연결됩니다.",
    focus: "방향성과 지휘 욕구",
    positiveTags: ["growth_orientation", "leadership", "strategic_thinking"],
    riskTags: ["control_need", "flexibility_need"],
    helpfulElements: ["water", "fire"],
    difficultElements: ["metal"],
  }),
  dayMasterEntry({
    id: "day_master_eulmok",
    labelKo: "을목",
    aliases: ["乙木", "을목", "풀과 덩굴"],
    coreImageKo: "바람에 맞춰 휘어지는 풀과 덩굴",
    summary: "부드럽게 적응하며 성장하는 섬세한 목의 일간입니다.",
    meaning: "을목은 직접 밀기보다 틈을 찾아 자라는 힘이라 관계 감각과 적응력이 살아납니다.",
    focus: "섬세한 성장과 적응",
    positiveTags: ["flexibility_need", "growth_orientation", "empathy_need"],
    riskTags: ["relationship_distance", "stability_need"],
    helpfulElements: ["water", "fire"],
    difficultElements: ["metal"],
  }),
  dayMasterEntry({
    id: "day_master_byeonghwa",
    labelKo: "병화",
    aliases: ["丙火", "병화", "태양"],
    coreImageKo: "멀리 비추는 태양",
    summary: "밝게 드러나고 확산하는 큰 불의 일간입니다.",
    meaning: "병화는 존재감과 표현력이 강해 사람들 앞에서 분위기를 밝히는 힘과 연결됩니다.",
    focus: "밝은 표현과 대외 확산",
    positiveTags: ["public_presence", "romantic_attraction", "leadership"],
    riskTags: ["burnout_risk", "direct_speech"],
    helpfulElements: ["wood", "earth"],
    difficultElements: ["water"],
  }),
  dayMasterEntry({
    id: "day_master_jeonghwa",
    labelKo: "정화",
    aliases: ["丁火", "정화", "촛불"],
    coreImageKo: "가까운 곳을 데우는 촛불",
    summary: "작지만 집중된 온기와 감각을 가진 불의 일간입니다.",
    meaning: "정화는 섬세한 반응과 집중력을 통해 가까운 사람과 일에 온도를 줍니다.",
    focus: "섬세한 온기와 집중",
    positiveTags: ["empathy_need", "precision_skill", "public_presence"],
    riskTags: ["low_rest_capacity", "emotional_dryness"],
    helpfulElements: ["wood", "earth"],
    difficultElements: ["water"],
  }),
  dayMasterEntry({
    id: "day_master_muto",
    labelKo: "무토",
    aliases: ["戊土", "무토", "큰 산"],
    coreImageKo: "크게 버티는 산과 대지",
    summary: "중심을 잡고 크게 버티는 양토의 일간입니다.",
    meaning: "무토는 흔들리는 것을 붙잡고 큰 틀을 지키는 힘이라 안정과 책임의 중심축이 됩니다.",
    focus: "큰 안정감과 중심 잡기",
    positiveTags: ["stability_need", "responsibility_pressure", "leadership"],
    riskTags: ["control_need", "low_rest_capacity"],
    helpfulElements: ["fire", "metal"],
    difficultElements: ["wood"],
  }),
  dayMasterEntry({
    id: "day_master_gito",
    labelKo: "기토",
    aliases: ["己土", "기토", "논밭의 흙"],
    coreImageKo: "씨앗을 품고 키우는 논밭의 흙",
    summary: "현실을 받아 정리하고 키우는 섬세한 토의 일간입니다.",
    meaning: "기토는 돌보고 관리하며 현실을 재배치하는 힘이라 안정, 실무, 축적과 연결됩니다.",
    focus: "현실 관리와 숨은 감수성",
    positiveTags: ["stability_need", "asset_building", "self_discipline"],
    riskTags: ["low_rest_capacity", "emotional_dryness"],
    helpfulElements: ["fire", "water"],
    difficultElements: ["wood"],
  }),
  dayMasterEntry({
    id: "day_master_gyeonggeum",
    labelKo: "경금",
    aliases: ["庚金", "경금", "큰 쇠"],
    coreImageKo: "단단한 쇠와 도구",
    summary: "결단과 절단력이 강한 양금의 일간입니다.",
    meaning: "경금은 애매한 것을 정리하고 기준을 세우는 힘이라 판단과 실행에서 강점이 납니다.",
    focus: "결단과 기준 세우기",
    positiveTags: ["sharp_analysis", "authority_orientation", "self_discipline"],
    riskTags: ["direct_speech", "relationship_distance"],
    helpfulElements: ["earth", "water"],
    difficultElements: ["fire"],
  }),
  dayMasterEntry({
    id: "day_master_singeum",
    labelKo: "신금",
    aliases: ["辛金", "신금", "보석"],
    coreImageKo: "정교하게 다듬어진 보석",
    summary: "섬세한 선별력과 정밀 감각을 가진 음금의 일간입니다.",
    meaning: "신금은 품질, 취향, 기준을 정교하게 가르는 힘이라 디테일과 완성도에 민감합니다.",
    focus: "정교한 선별과 품질 감각",
    positiveTags: ["precision_skill", "sharp_analysis", "public_presence"],
    riskTags: ["relationship_distance", "control_need"],
    helpfulElements: ["earth", "water"],
    difficultElements: ["fire"],
  }),
  dayMasterEntry({
    id: "day_master_imsu",
    labelKo: "임수",
    aliases: ["壬水", "임수", "큰 물"],
    coreImageKo: "넓게 흐르는 바다와 강",
    summary: "큰 흐름을 읽고 멀리 확장하는 양수의 일간입니다.",
    meaning: "임수는 정보와 사람, 환경의 큰 흐름을 읽으며 유연하게 길을 찾는 힘입니다.",
    focus: "넓은 사고와 흐름 읽기",
    positiveTags: ["strategic_thinking", "flexibility_need", "growth_orientation"],
    riskTags: ["loneliness", "stability_need"],
    helpfulElements: ["metal", "wood"],
    difficultElements: ["earth"],
  }),
  dayMasterEntry({
    id: "day_master_gyesu",
    labelKo: "계수",
    aliases: ["癸水", "계수", "비와 안개"],
    coreImageKo: "작게 스며드는 비와 안개",
    summary: "섬세한 감수성과 축적된 지혜를 가진 음수의 일간입니다.",
    meaning: "계수는 작은 신호를 오래 모아 판단하는 힘이라 감정, 학습, 직감에 민감합니다.",
    focus: "섬세한 감수성과 축적",
    positiveTags: ["empathy_need", "precision_skill", "strategic_thinking"],
    riskTags: ["loneliness", "emotional_dryness"],
    helpfulElements: ["metal", "wood"],
    difficultElements: ["earth"],
  }),
];

const dayPillarEntries = [
  dayPillarEntry({
    id: "day_pillar_gapsin",
    labelKo: "갑신일주",
    aliases: ["甲申", "갑신", "갑신일주"],
    coreImageKo: "바위 위 소나무",
    summary: "갑목 + 신금, 편관 pressure, survival tension, leadership under pressure가 함께 보이는 일주입니다.",
    meaning: "갑신일주는 성장하려는 갑목과 정리하려는 신금이 맞물려 추진과 판단이 동시에 강해지는 seed입니다.",
    focus: "압박 속 리더십과 예리한 자기관리",
    positiveTags: ["leadership", "sharp_analysis", "strategic_thinking", "self_discipline"],
    riskTags: ["direct_speech", "control_need", "responsibility_pressure"],
    coreTension: ["갑목의 성장성과 신금의 절단력이 맞물립니다.", "편관 압박이 생존 긴장을 만듭니다."],
    strength: ["압박 속에서도 방향을 세우는 리더십이 살아납니다.", "날카로운 판단과 strict self-discipline이 강점입니다."],
    risk: ["자기 기준이 너무 날카로우면 관계 압박이 생길 수 있습니다."],
  }),
  dayPillarEntry({
    id: "day_pillar_gihae",
    labelKo: "기해일주",
    aliases: ["己亥", "기해", "기해일주"],
    coreImageKo: "soft earth over deep water",
    summary: "부드러운 흙 아래 깊은 물이 있어 practicality with hidden sensitivity가 함께 보이는 일주입니다.",
    meaning: "기해일주는 현실을 관리하는 기토와 깊게 흐르는 해수가 만나 돌봄, 감정, 저장감이 섞이는 seed입니다.",
    focus: "현실성 뒤의 깊은 감수성",
    positiveTags: ["stability_need", "empathy_need", "strategic_thinking"],
    riskTags: ["loneliness", "low_rest_capacity"],
    coreTension: ["현실 안정과 숨은 불안이 함께 움직입니다.", "겉으로는 실무적이지만 안쪽은 깊게 반응합니다."],
    strength: ["섬세한 관리와 내면 깊이가 장점입니다."],
    risk: ["불안을 혼자 저장하면 회복이 늦어질 수 있습니다."],
  }),
  dayPillarEntry({
    id: "day_pillar_gabja",
    labelKo: "갑자일주",
    aliases: ["甲子", "갑자", "갑자일주"],
    coreImageKo: "큰 나무 아래 깊은 물",
    summary: "방향성과 학습성이 함께 살아나는 일주입니다.",
    meaning: "갑자일주는 성장하려는 갑목이 수의 학습과 회복을 받아 장기 방향을 세우는 구조입니다.",
    focus: "성장 방향과 지적 흡수",
    positiveTags: ["growth_orientation", "strategic_thinking"],
    riskTags: ["loneliness", "control_need"],
    coreTension: ["크게 뻗고 싶지만 생각이 깊어 속도를 조절합니다."],
    strength: ["방향을 잡고 오래 배우는 힘이 있습니다."],
    risk: ["생각이 많아 시작이 늦어질 수 있습니다."],
  }),
  dayPillarEntry({
    id: "day_pillar_gapjin",
    labelKo: "갑진일주",
    aliases: ["甲辰", "갑진", "갑진일주"],
    coreImageKo: "습한 땅 위 큰 나무",
    summary: "성장 욕구와 현실 기반이 함께 있는 일주입니다.",
    meaning: "갑진일주는 큰 방향성과 자산화 감각이 같이 움직여 현실적 리더십으로 드러납니다.",
    focus: "방향성과 현실 기반",
    positiveTags: ["leadership", "asset_building", "growth_orientation"],
    riskTags: ["responsibility_pressure", "control_need"],
    coreTension: ["크게 뻗으려는 힘과 현실을 담는 힘이 함께 작동합니다."],
    strength: ["목표를 현실 구조로 만드는 힘이 있습니다."],
    risk: ["책임을 혼자 크게 잡을 수 있습니다."],
  }),
  dayPillarEntry({
    id: "day_pillar_eulsa",
    labelKo: "을사일주",
    aliases: ["乙巳", "을사", "을사일주"],
    coreImageKo: "뜨거운 땅을 타고 오르는 덩굴",
    summary: "섬세한 적응과 표현 온도가 함께 살아나는 일주입니다.",
    meaning: "을사일주는 부드러운 감각과 빠른 반응이 맞물려 관계와 표현에서 존재감이 생깁니다.",
    focus: "섬세한 적응과 표현력",
    positiveTags: ["public_presence", "flexibility_need", "romantic_attraction"],
    riskTags: ["burnout_risk", "relationship_distance"],
    coreTension: ["부드럽게 맞추지만 내부 온도는 빠르게 올라갑니다."],
    strength: ["상황을 읽고 표현으로 전환하는 힘이 있습니다."],
    risk: ["감정 반응이 빨라 피로가 쌓일 수 있습니다."],
  }),
  dayPillarEntry({
    id: "day_pillar_byeongoh",
    labelKo: "병오일주",
    aliases: ["丙午", "병오", "병오일주"],
    coreImageKo: "한낮의 태양",
    summary: "표현, 존재감, 추진 온도가 강한 일주입니다.",
    meaning: "병오일주는 화가 선명해 대외 존재감과 빠른 추진이 강하게 드러납니다.",
    focus: "강한 표현과 현장 존재감",
    positiveTags: ["public_presence", "leadership", "romantic_attraction"],
    riskTags: ["burnout_risk", "direct_speech"],
    coreTension: ["밝게 드러나는 힘이 강해 속도 조절이 필요합니다."],
    strength: ["사람 앞에서 분위기를 열고 움직이는 힘이 큽니다."],
    risk: ["과열되면 말과 행동이 빨라질 수 있습니다."],
  }),
  dayPillarEntry({
    id: "day_pillar_jeonghae",
    labelKo: "정해일주",
    aliases: ["丁亥", "정해", "정해일주"],
    coreImageKo: "깊은 물 위 작은 불",
    summary: "섬세한 온기와 깊은 감정 흐름이 함께 있는 일주입니다.",
    meaning: "정해일주는 표현은 작지만 내면 반응이 깊어 관계와 감정에서 섬세하게 움직입니다.",
    focus: "작은 온기와 깊은 감정",
    positiveTags: ["empathy_need", "strategic_thinking"],
    riskTags: ["loneliness", "low_rest_capacity"],
    coreTension: ["따뜻함과 깊은 물의 불안이 같이 움직입니다."],
    strength: ["사람의 결을 섬세하게 읽는 힘이 있습니다."],
    risk: ["마음속으로 오래 품고 말이 늦어질 수 있습니다."],
  }),
  dayPillarEntry({
    id: "day_pillar_mujin",
    labelKo: "무진일주",
    aliases: ["戊辰", "무진", "무진일주"],
    coreImageKo: "큰 산과 습한 땅",
    summary: "무게감, 저장성, 현실 기반이 강한 일주입니다.",
    meaning: "무진일주는 큰 토의 중심성과 진토의 저장성이 만나 자원과 책임을 오래 붙잡습니다.",
    focus: "큰 안정감과 자원 저장",
    positiveTags: ["stability_need", "asset_building", "responsibility_pressure"],
    riskTags: ["low_rest_capacity", "control_need"],
    coreTension: ["버티는 힘과 무거운 책임이 함께 커집니다."],
    strength: ["자원을 모으고 기반을 만드는 힘이 있습니다."],
    risk: ["책임을 내려놓는 속도가 늦을 수 있습니다."],
  }),
  dayPillarEntry({
    id: "day_pillar_gyeongsin",
    labelKo: "경신일주",
    aliases: ["庚申", "경신", "경신일주"],
    coreImageKo: "강한 금속 위의 금속",
    summary: "판단, 절단, 실무 기준이 선명한 일주입니다.",
    meaning: "경신일주는 금의 판단력이 강해 복잡한 상황을 빠르게 자르고 기준을 세웁니다.",
    focus: "강한 판단력과 실무 기준",
    positiveTags: ["sharp_analysis", "precision_skill", "authority_orientation"],
    riskTags: ["direct_speech", "relationship_distance"],
    coreTension: ["판단이 빠른 만큼 부드러운 설명이 과제가 됩니다."],
    strength: ["실무, 검수, 기준 설정에서 강점이 큽니다."],
    risk: ["말이 차갑게 느껴질 수 있습니다."],
  }),
  dayPillarEntry({
    id: "day_pillar_sinyu",
    labelKo: "신유일주",
    aliases: ["辛酉", "신유", "신유일주"],
    coreImageKo: "정교한 보석과 칼날",
    summary: "정밀함, 취향, 선별력이 강한 일주입니다.",
    meaning: "신유일주는 세밀한 금의 힘이 강해 완성도와 기준에 민감하게 반응합니다.",
    focus: "정교한 품질 감각",
    positiveTags: ["precision_skill", "sharp_analysis", "public_presence"],
    riskTags: ["relationship_distance", "control_need"],
    coreTension: ["높은 기준과 관계의 부드러움 사이에 긴장이 생깁니다."],
    strength: ["품질, 디자인, 검수, 언어 선택에서 강점이 있습니다."],
    risk: ["작은 결함도 크게 보일 수 있습니다."],
  }),
  dayPillarEntry({
    id: "day_pillar_imja",
    labelKo: "임자일주",
    aliases: ["壬子", "임자", "임자일주"],
    coreImageKo: "큰 물 위의 깊은 물",
    summary: "지적 흐름, 이동성, 감정 깊이가 큰 일주입니다.",
    meaning: "임자일주는 수의 힘이 강해 정보, 감정, 사람의 흐름을 넓고 깊게 읽습니다.",
    focus: "넓은 정보 흐름과 감정 깊이",
    positiveTags: ["strategic_thinking", "flexibility_need", "empathy_need"],
    riskTags: ["loneliness", "stability_need"],
    coreTension: ["넓게 흐르고 싶지만 안정 기준이 흔들릴 수 있습니다."],
    strength: ["큰 흐름을 읽고 적응하는 힘이 있습니다."],
    risk: ["방향을 고정하기 어려울 수 있습니다."],
  }),
  dayPillarEntry({
    id: "day_pillar_gyemyo",
    labelKo: "계묘일주",
    aliases: ["癸卯", "계묘", "계묘일주"],
    coreImageKo: "비를 맞고 자라는 풀",
    summary: "섬세한 감수성과 성장성이 부드럽게 연결된 일주입니다.",
    meaning: "계묘일주는 작은 물과 목이 만나 감정, 학습, 관계 감각이 섬세하게 살아납니다.",
    focus: "섬세한 감수성과 관계 성장",
    positiveTags: ["empathy_need", "growth_orientation", "flexibility_need"],
    riskTags: ["loneliness", "relationship_distance"],
    coreTension: ["부드러운 성장과 예민한 감정이 함께 움직입니다."],
    strength: ["관계와 학습에서 작은 신호를 잘 읽습니다."],
    risk: ["상처를 오래 기억할 수 있습니다."],
  }),
];

export const SAJU_KNOWLEDGE_BASE = [
  ...fiveElementEntries,
  ...elementBalanceEntries,
  ...tenGodEntries,
  ...patternEntries,
  ...signalEntries,
  ...dayMasterEntries,
  ...dayPillarEntries,
] as const satisfies readonly SajuKnowledgeEntry[];

export const SAJU_KNOWLEDGE_BY_ID = new Map(
  SAJU_KNOWLEDGE_BASE.map((item) => [item.id, item]),
);
