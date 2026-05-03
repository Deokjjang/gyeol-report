import type { SajuMbtiAxisRuleDefinition } from "./sajuSuggestionTypes";

export const SAJU_MBTI_AXIS_RULES = [
  {
    id: "SELF_EXPRESSION_TO_E",
    axis: "EI",
    suggestedSide: "E",
    strength: "MEDIUM",
    requiredTags: ["TEN_GOD_OUTPUT_STRONG"],
    supportingTags: [
      "SHINSAL_DOHWASAL",
      "SHINSAL_HONGYEOMSAL",
      "SHINSAL_MANGSINSAL",
    ],
    titleKo: "표현성과 외향 흐름",
    summaryKo:
      "식상과 대인 주목성 신호가 함께 보이면 생각과 감정을 밖으로 드러내는 흐름이 강해질 수 있습니다.",
  },
  {
    id: "INNER_PROCESSING_TO_I",
    axis: "EI",
    suggestedSide: "I",
    strength: "MEDIUM",
    requiredTags: ["SHINSAL_HWAGAE"],
    supportingTags: ["TEN_GOD_RESOURCE_WEAK", "YIN_HEAVY"],
    titleKo: "내면 처리와 독립적 숙고",
    summaryKo:
      "화개나 내면성 신호가 강하면 외부 반응보다 혼자 정리하고 깊게 생각하는 흐름이 두드러질 수 있습니다.",
  },
  {
    id: "PRACTICAL_STRUCTURE_TO_S",
    axis: "SN",
    suggestedSide: "S",
    strength: "MEDIUM",
    requiredTags: ["EARTH_STRONG"],
    supportingTags: ["WEALTH_OVERLOAD", "OFFICER_PRESSURE_HIGH"],
    titleKo: "현실 감각과 구체적 기준",
    summaryKo:
      "토 기운과 현실·책임 신호가 강하면 추상보다 실제 조건과 구체적 기준을 중시하는 흐름으로 볼 수 있습니다.",
  },
  {
    id: "ABSTRACT_SYMBOLISM_TO_N",
    axis: "SN",
    suggestedSide: "N",
    strength: "MEDIUM",
    requiredTags: ["SHINSAL_HWAGAE"],
    supportingTags: [
      "SHINSAL_MUN_CHANG_GWIIN",
      "SHINSAL_HAK_DANG_GWIIN",
      "WATER_STRONG",
    ],
    titleKo: "상징 감각과 패턴 인식",
    summaryKo:
      "화개, 문창, 학당, 수 기운이 함께 보이면 눈앞의 사실보다 의미와 패턴을 읽는 흐름이 강해질 수 있습니다.",
  },
  {
    id: "CONTROL_DECISION_TO_T",
    axis: "TF",
    suggestedSide: "T",
    strength: "MEDIUM",
    requiredTags: ["OFFICER_PRESSURE_HIGH"],
    supportingTags: [
      "BRANCH_CLASH_PRESENT",
      "SHINSAL_HYEONCHIMSAL",
      "SHINSAL_BAEKHODAESAL",
    ],
    titleKo: "판단 기준과 통제적 결정",
    summaryKo:
      "관성 구조와 예리함·강한 추진 신호가 함께 보이면 감정보다 기준과 판단을 앞세우는 흐름으로 해석할 수 있습니다.",
  },
  {
    id: "RELATION_SENSITIVITY_TO_F",
    axis: "TF",
    suggestedSide: "F",
    strength: "MEDIUM",
    requiredTags: ["SHINSAL_HONGYEOMSAL"],
    supportingTags: [
      "YIN_HEAVY",
      "SHINSAL_DOHWASAL",
      "SHINSAL_WOL_DEOK_GWIIN",
      "SHINSAL_CHEON_DEOK_GWIIN",
    ],
    titleKo: "관계 감각과 정서 반응성",
    summaryKo:
      "감정 표현, 대인 매력, 완충 신호가 함께 보이면 관계의 분위기와 정서 반응을 세밀하게 보는 흐름이 나타날 수 있습니다.",
  },
  {
    id: "STRUCTURE_RESPONSIBILITY_TO_J",
    axis: "JP",
    suggestedSide: "J",
    strength: "MEDIUM",
    requiredTags: ["OFFICER_PRESSURE_HIGH"],
    supportingTags: [
      "WEALTH_OVERLOAD",
      "EARTH_STRONG",
      "SHINSAL_CHEON_EUL_GWIIN",
    ],
    titleKo: "구조화와 책임 중심성",
    summaryKo:
      "관성, 재성, 토 기운이 함께 보이면 계획과 책임, 정리된 기준을 선호하는 흐름이 강해질 수 있습니다.",
  },
  {
    id: "FLEXIBLE_FLOW_TO_P",
    axis: "JP",
    suggestedSide: "P",
    strength: "MEDIUM",
    requiredTags: ["SHINSAL_YEOKMASAL"],
    supportingTags: [
      "TEN_GOD_OUTPUT_STRONG",
      "WATER_STRONG",
      "SHINSAL_DOHWASAL",
    ],
    titleKo: "이동성과 유연한 흐름",
    summaryKo:
      "역마와 표현성, 수 기운이 함께 보이면 고정된 방식보다 변화와 흐름에 맞춰 움직이는 경향으로 볼 수 있습니다.",
  },
] as const satisfies readonly SajuMbtiAxisRuleDefinition[];
