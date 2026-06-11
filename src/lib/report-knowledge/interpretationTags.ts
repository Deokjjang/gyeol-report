export type InterpretationTagId =
  | "achievement_drive"
  | "efficiency_focus"
  | "leadership"
  | "control_need"
  | "strategic_thinking"
  | "money_orientation"
  | "asset_building"
  | "responsibility_pressure"
  | "sharp_analysis"
  | "direct_speech"
  | "emotional_dryness"
  | "low_rest_capacity"
  | "burnout_risk"
  | "relationship_distance"
  | "romantic_attraction"
  | "workplace_romance"
  | "growth_orientation"
  | "independence"
  | "stability_need"
  | "flexibility_need"
  | "expression_weakness"
  | "public_presence"
  | "precision_skill"
  | "loneliness"
  | "self_discipline"
  | "authority_orientation"
  | "competition"
  | "empathy_need"
  | "emotional_depth"
  | "relationship_sensitivity";

export type InterpretationTagDefinition = {
  readonly id: InterpretationTagId;
  readonly labelKo: string;
  readonly description: string;
};

export const INTERPRETATION_TAGS = [
  {
    id: "achievement_drive",
    labelKo: "성취지향",
    description: "목표와 결과를 향해 에너지가 모이는 성향입니다.",
  },
  {
    id: "efficiency_focus",
    labelKo: "효율중심",
    description: "시간, 비용, 행동을 구조화해 빠르게 정리하려는 성향입니다.",
  },
  {
    id: "leadership",
    labelKo: "리더십",
    description: "기준을 세우고 사람이나 일을 이끄는 방향성이 있습니다.",
  },
  {
    id: "control_need",
    labelKo: "통제욕",
    description: "불확실한 상황을 직접 관리하고 싶어 하는 성향입니다.",
  },
  {
    id: "strategic_thinking",
    labelKo: "전략사고",
    description: "단기 반응보다 구조와 다음 수를 함께 보는 사고입니다.",
  },
  {
    id: "money_orientation",
    labelKo: "재물감각",
    description: "자원, 이익, 현실적 교환을 민감하게 보는 성향입니다.",
  },
  {
    id: "asset_building",
    labelKo: "축적감각",
    description: "흘려보내기보다 모으고 쌓아 안정시키는 감각입니다.",
  },
  {
    id: "responsibility_pressure",
    labelKo: "책임압박",
    description: "해야 할 일과 역할 부담을 크게 느끼는 흐름입니다.",
  },
  {
    id: "sharp_analysis",
    labelKo: "예리한 분석",
    description: "허점을 빠르게 발견하고 핵심을 찌르는 감각입니다.",
  },
  {
    id: "direct_speech",
    labelKo: "직설화법",
    description: "돌려 말하기보다 바로 짚고 정리하는 표현 방식입니다.",
  },
  {
    id: "emotional_dryness",
    labelKo: "감정 건조",
    description: "감정보다 판단과 결과가 먼저 올라오는 흐름입니다.",
  },
  {
    id: "low_rest_capacity",
    labelKo: "낮은 회복력",
    description: "쉬어야 할 때도 긴장이 쉽게 풀리지 않는 상태입니다.",
  },
  {
    id: "burnout_risk",
    labelKo: "번아웃 위험",
    description: "속도와 책임이 누적될 때 에너지가 급격히 닳는 위험입니다.",
  },
  {
    id: "relationship_distance",
    labelKo: "관계 거리감",
    description: "가까운 관계에서도 정서적 간격이 생기기 쉬운 흐름입니다.",
  },
  {
    id: "romantic_attraction",
    labelKo: "이성매력",
    description: "분위기, 말투, 존재감이 관계 관심으로 연결되는 성향입니다.",
  },
  {
    id: "workplace_romance",
    labelKo: "일터 인연",
    description: "공동 목표와 역할 속에서 호감이 생기기 쉬운 패턴입니다.",
  },
  {
    id: "growth_orientation",
    labelKo: "성장지향",
    description: "정체보다 확장과 개선을 선호하는 방향성입니다.",
  },
  {
    id: "independence",
    labelKo: "독립성",
    description: "자기 기준과 자기 속도를 지키려는 성향입니다.",
  },
  {
    id: "stability_need",
    labelKo: "안정욕구",
    description: "예측 가능한 기준과 지속 가능한 생활감을 중시합니다.",
  },
  {
    id: "flexibility_need",
    labelKo: "유연성 필요",
    description: "상황 변화에 맞춰 긴장을 풀고 흐름을 바꾸는 보완점입니다.",
  },
  {
    id: "expression_weakness",
    labelKo: "표현 약점",
    description: "느끼는 것과 드러내는 것 사이에 간격이 생기는 흐름입니다.",
  },
  {
    id: "public_presence",
    labelKo: "대외 존재감",
    description: "사람들 앞에서 인상과 분위기가 선명하게 남는 성향입니다.",
  },
  {
    id: "precision_skill",
    labelKo: "정밀성",
    description: "분석, 검수, 기준 세우기에 강점이 생기는 감각입니다.",
  },
  {
    id: "loneliness",
    labelKo: "고립감",
    description: "혼자 버티는 시간이 길어질 때 느껴지는 정서적 신호입니다.",
  },
  {
    id: "self_discipline",
    labelKo: "자기관리",
    description: "루틴, 기준, 약속을 통해 자신을 조율하는 힘입니다.",
  },
  {
    id: "authority_orientation",
    labelKo: "권위지향",
    description: "역할, 책임, 공식 기준을 중요하게 여기는 성향입니다.",
  },
  {
    id: "competition",
    labelKo: "경쟁성",
    description: "비교와 승부 상황에서 에너지가 올라오는 흐름입니다.",
  },
  {
    id: "empathy_need",
    labelKo: "공감 욕구",
    description: "논리보다 정서적 확인이 먼저 필요해지는 관계 욕구입니다.",
  },
  {
    id: "emotional_depth",
    labelKo: "감정 깊이",
    description: "겉으로 드러난 반응보다 안쪽 감정의 층이 깊은 성향입니다.",
  },
  {
    id: "relationship_sensitivity",
    labelKo: "관계 민감성",
    description: "관계의 온도, 말투, 거리 변화에 민감하게 반응하는 성향입니다.",
  },
] as const satisfies readonly InterpretationTagDefinition[];

export const INTERPRETATION_TAG_IDS = INTERPRETATION_TAGS.map(
  (tag) => tag.id,
);
