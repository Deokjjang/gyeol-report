export type MbtiType =
  | "INTJ"
  | "INTP"
  | "ENTJ"
  | "ENTP"
  | "INFJ"
  | "INFP"
  | "ENFJ"
  | "ENFP"
  | "ISTJ"
  | "ISFJ"
  | "ESTJ"
  | "ESFJ"
  | "ISTP"
  | "ISFP"
  | "ESTP"
  | "ESFP";

export type MbtiTraitCode =
  | "INTROVERSION"
  | "EXTRAVERSION"
  | "INTUITION"
  | "SENSING"
  | "THINKING"
  | "FEELING"
  | "JUDGING"
  | "PERCEIVING"
  | "DIRECT_DECISION"
  | "SYSTEM_BUILDING"
  | "EFFICIENCY_ORIENTATION"
  | "ABSTRACT_PATTERNING"
  | "DETAIL_GROUNDING"
  | "RELATION_HARMONY"
  | "EMOTIONAL_ATTUNEMENT"
  | "SPONTANEOUS_ACTION"
  | "STRUCTURE_PREFERENCE"
  | "EXPLORATION_DRIVE"
  | "CONFLICT_DIRECTNESS"
  | "INTERNAL_PROCESSING";

export type MbtiTrait = {
  code: MbtiTraitCode;
  labelKo: string;
  descriptionKo: string;
};

export type MbtiProfile = {
  type: MbtiType;
  traits: readonly MbtiTrait[];
};

export const MBTI_TYPES = [
  "INTJ",
  "INTP",
  "ENTJ",
  "ENTP",
  "INFJ",
  "INFP",
  "ENFJ",
  "ENFP",
  "ISTJ",
  "ISFJ",
  "ESTJ",
  "ESFJ",
  "ISTP",
  "ISFP",
  "ESTP",
  "ESFP",
] as const satisfies readonly MbtiType[];

export const MBTI_TRAITS: Record<MbtiTraitCode, MbtiTrait> = {
  INTROVERSION: {
    code: "INTROVERSION",
    labelKo: "내향성",
    descriptionKo: "안쪽에서 생각을 정리하고 에너지를 회복하는 편입니다.",
  },
  EXTRAVERSION: {
    code: "EXTRAVERSION",
    labelKo: "외향성",
    descriptionKo: "사람과 환경에 반응하며 에너지가 살아나는 경향이 있습니다.",
  },
  INTUITION: {
    code: "INTUITION",
    labelKo: "직관형",
    descriptionKo: "구체적 사실보다 가능성과 의미를 먼저 살피는 경향이 있습니다.",
  },
  SENSING: {
    code: "SENSING",
    labelKo: "감각형",
    descriptionKo: "현재의 정보와 실제 경험을 바탕으로 판단하는 편입니다.",
  },
  THINKING: {
    code: "THINKING",
    labelKo: "사고형",
    descriptionKo: "감정보다 기준과 논리를 앞세워 판단하는 경향이 있습니다.",
  },
  FEELING: {
    code: "FEELING",
    labelKo: "감정형",
    descriptionKo: "관계와 가치의 영향을 함께 고려하는 편입니다.",
  },
  JUDGING: {
    code: "JUDGING",
    labelKo: "판단형",
    descriptionKo: "계획과 마감, 정리된 흐름을 선호하는 편입니다.",
  },
  PERCEIVING: {
    code: "PERCEIVING",
    labelKo: "인식형",
    descriptionKo: "열린 선택지와 유연한 진행을 선호하는 편입니다.",
  },
  DIRECT_DECISION: {
    code: "DIRECT_DECISION",
    labelKo: "직선적 의사결정",
    descriptionKo: "필요한 결정을 빠르게 정리하려는 경향이 있습니다.",
  },
  SYSTEM_BUILDING: {
    code: "SYSTEM_BUILDING",
    labelKo: "시스템 구축 성향",
    descriptionKo: "흐름을 구조화하고 작동 방식을 세우는 데 관심이 있습니다.",
  },
  EFFICIENCY_ORIENTATION: {
    code: "EFFICIENCY_ORIENTATION",
    labelKo: "효율 지향",
    descriptionKo: "시간과 자원을 효율적으로 쓰려는 경향이 있습니다.",
  },
  ABSTRACT_PATTERNING: {
    code: "ABSTRACT_PATTERNING",
    labelKo: "추상 패턴 인식",
    descriptionKo: "겉으로 보이는 정보 뒤의 패턴을 읽으려는 편입니다.",
  },
  DETAIL_GROUNDING: {
    code: "DETAIL_GROUNDING",
    labelKo: "세부 현실감",
    descriptionKo: "작은 단서와 실제 조건을 놓치지 않으려는 경향이 있습니다.",
  },
  RELATION_HARMONY: {
    code: "RELATION_HARMONY",
    labelKo: "관계 조화",
    descriptionKo: "사람 사이의 분위기와 균형을 중시하는 편입니다.",
  },
  EMOTIONAL_ATTUNEMENT: {
    code: "EMOTIONAL_ATTUNEMENT",
    labelKo: "정서 조율",
    descriptionKo: "감정의 흐름과 미묘한 반응을 살피는 경향이 있습니다.",
  },
  SPONTANEOUS_ACTION: {
    code: "SPONTANEOUS_ACTION",
    labelKo: "즉흥적 실행",
    descriptionKo: "상황을 보며 빠르게 움직이는 방식으로 나타날 수 있습니다.",
  },
  STRUCTURE_PREFERENCE: {
    code: "STRUCTURE_PREFERENCE",
    labelKo: "구조 선호",
    descriptionKo: "예측 가능한 규칙과 정리된 절차를 선호하는 편입니다.",
  },
  EXPLORATION_DRIVE: {
    code: "EXPLORATION_DRIVE",
    labelKo: "탐색 욕구",
    descriptionKo: "새로운 가능성과 선택지를 넓혀 보려는 경향이 있습니다.",
  },
  CONFLICT_DIRECTNESS: {
    code: "CONFLICT_DIRECTNESS",
    labelKo: "갈등 직면성",
    descriptionKo: "불편한 주제도 직접 확인하려는 방식으로 나타날 수 있습니다.",
  },
  INTERNAL_PROCESSING: {
    code: "INTERNAL_PROCESSING",
    labelKo: "내적 처리",
    descriptionKo: "겉으로 말하기 전에 안에서 충분히 정리하려는 편입니다.",
  },
};

const AXIS_TRAITS_BY_LETTER = {
  I: "INTROVERSION",
  E: "EXTRAVERSION",
  N: "INTUITION",
  S: "SENSING",
  T: "THINKING",
  F: "FEELING",
  J: "JUDGING",
  P: "PERCEIVING",
} as const satisfies Record<string, MbtiTraitCode>;

const TYPE_SPECIFIC_TRAITS: Record<MbtiType, readonly MbtiTraitCode[]> = {
  INTJ: ["SYSTEM_BUILDING", "ABSTRACT_PATTERNING", "INTERNAL_PROCESSING"],
  INTP: ["ABSTRACT_PATTERNING", "EXPLORATION_DRIVE", "INTERNAL_PROCESSING"],
  ENTJ: [
    "DIRECT_DECISION",
    "SYSTEM_BUILDING",
    "EFFICIENCY_ORIENTATION",
    "CONFLICT_DIRECTNESS",
  ],
  ENTP: [
    "EXPLORATION_DRIVE",
    "ABSTRACT_PATTERNING",
    "CONFLICT_DIRECTNESS",
  ],
  INFJ: [
    "ABSTRACT_PATTERNING",
    "EMOTIONAL_ATTUNEMENT",
    "INTERNAL_PROCESSING",
  ],
  INFP: [
    "EMOTIONAL_ATTUNEMENT",
    "INTERNAL_PROCESSING",
    "EXPLORATION_DRIVE",
  ],
  ENFJ: [
    "RELATION_HARMONY",
    "EMOTIONAL_ATTUNEMENT",
    "STRUCTURE_PREFERENCE",
  ],
  ENFP: [
    "EXPLORATION_DRIVE",
    "EMOTIONAL_ATTUNEMENT",
    "SPONTANEOUS_ACTION",
  ],
  ISTJ: ["STRUCTURE_PREFERENCE", "DETAIL_GROUNDING", "INTERNAL_PROCESSING"],
  ISFJ: ["DETAIL_GROUNDING", "RELATION_HARMONY", "INTERNAL_PROCESSING"],
  ESTJ: [
    "DIRECT_DECISION",
    "STRUCTURE_PREFERENCE",
    "EFFICIENCY_ORIENTATION",
  ],
  ESFJ: [
    "RELATION_HARMONY",
    "STRUCTURE_PREFERENCE",
    "EMOTIONAL_ATTUNEMENT",
  ],
  ISTP: ["DETAIL_GROUNDING", "INTERNAL_PROCESSING", "SPONTANEOUS_ACTION"],
  ISFP: [
    "EMOTIONAL_ATTUNEMENT",
    "INTERNAL_PROCESSING",
    "SPONTANEOUS_ACTION",
  ],
  ESTP: ["SPONTANEOUS_ACTION", "DIRECT_DECISION", "DETAIL_GROUNDING"],
  ESFP: [
    "SPONTANEOUS_ACTION",
    "RELATION_HARMONY",
    "EMOTIONAL_ATTUNEMENT",
  ],
};

function getAxisTraitCode(letter: string): MbtiTraitCode {
  if (
    letter === "I" ||
    letter === "E" ||
    letter === "N" ||
    letter === "S" ||
    letter === "T" ||
    letter === "F" ||
    letter === "J" ||
    letter === "P"
  ) {
    return AXIS_TRAITS_BY_LETTER[letter];
  }

  throw new Error("Invalid MBTI axis letter.");
}

export function getMbtiProfile(type: MbtiType): MbtiProfile {
  const traitCodes: MbtiTraitCode[] = [
    getAxisTraitCode(type[0]),
    getAxisTraitCode(type[1]),
    getAxisTraitCode(type[2]),
    getAxisTraitCode(type[3]),
    ...TYPE_SPECIFIC_TRAITS[type],
  ];
  const uniqueTraitCodes = Array.from(new Set(traitCodes));

  return {
    type,
    traits: uniqueTraitCodes.map((code) => MBTI_TRAITS[code]),
  };
}
