import type { MbtiTypeCode } from "./mbtiKnowledgeTypes";
import type { ComputedSajuFacts } from "./sajuComputedFactsTypes";
import type { CompatibilityDeepSajuLayer } from "./compatibilityDeepSajuBridge";

export type CompatibilityRelationshipType =
  | "love"
  | "marriage"
  | "some"
  | "friendship"
  | "family"
  | "business_work_partner";

export const compatibilityRelationshipTypes = [
  "love",
  "marriage",
  "some",
  "friendship",
  "family",
  "business_work_partner",
] as const satisfies readonly CompatibilityRelationshipType[];

export type CompatibilityPersonInput = {
  readonly role: "personA" | "personB";
  readonly displayName: string;
  readonly gender?: "MALE" | "FEMALE" | "OTHER" | null;
  readonly calendarType: "SOLAR" | "LUNAR";
  readonly birthDate: string;
  readonly birthTime?: string | null;
  readonly birthTimeKnown: boolean;
  readonly timezone: string;
  readonly mbti?: string | null;
};

export type CompatibilityInput = {
  readonly productType: "saju_mbti_compatibility";
  readonly productVersion: "1.0";
  readonly relationshipType: CompatibilityRelationshipType;
  readonly personA: CompatibilityPersonInput;
  readonly personB: CompatibilityPersonInput;
};

export type CompatibilityScoreBreakdown = {
  readonly attraction: number;
  readonly communication: number;
  readonly lifestyleRhythm: number;
  readonly conflictRecovery: number;
  readonly longTermStability: number;
  readonly growthComplement: number;
};

export type CompatibilityScoreCategory = keyof CompatibilityScoreBreakdown;

export type CompatibilityScoreDisplayLabels = Record<
  CompatibilityScoreCategory,
  string
>;

const compatibilityRelationshipTypeLabels = {
  love: "연애",
  marriage: "결혼/장기연애",
  some: "썸",
  friendship: "친구",
  family: "가족",
  business_work_partner: "동업/업무 파트너",
} as const satisfies Record<CompatibilityRelationshipType, string>;

const compatibilityRelationshipTypeFocus = {
  love: "끌림, 감정 온도, 데이트 리듬, 대화 속도, 갈등 회복",
  marriage: "생활 리듬, 돈, 책임, 장기 안정성, 반복 갈등, 가족/현실 운영",
  some: "호감 신호, 타이밍, 애매함 해소, 먼저 다가가는 속도, 관계 명확화",
  friendship: "대화 리듬, 거리감, 도움 방식, 의리, 오래 가는 안정성",
  family: "정서 연결, 오래된 패턴, 말의 통로, 생활 리듬, 경계와 역할",
  business_work_partner:
    "역할 분담, 의사결정, 업무 속도, 돈/책임, 신뢰, 리스크 관리, 피드백 방식",
} as const satisfies Record<CompatibilityRelationshipType, string>;

const compatibilityRelationshipTypeTone = {
  love: "감정 온도와 데이트 장면을 중심으로 부드럽게 조율한다.",
  marriage: "현실 운영과 장기 안정성을 중심으로 차분하게 조율한다.",
  some: "애매한 신호와 타이밍을 중심으로 가볍지만 구체적으로 조율한다.",
  friendship: "거리감과 의리를 중심으로 편안한 관계 언어로 조율한다.",
  family: "오래된 패턴과 역할 경계를 중심으로 조심스럽고 따뜻하게 조율한다.",
  business_work_partner:
    "역할, 책임, 의사결정을 중심으로 실무적인 관계 언어로 조율한다.",
} as const satisfies Record<CompatibilityRelationshipType, string>;

const compatibilityScoreDisplayLabels = {
  love: {
    attraction: "끌림",
    communication: "대화",
    lifestyleRhythm: "생활 리듬",
    conflictRecovery: "갈등 회복",
    longTermStability: "장기 안정성",
    growthComplement: "성장 보완",
  },
  marriage: {
    attraction: "부부 온도",
    communication: "대화 습관",
    lifestyleRhythm: "생활 합",
    conflictRecovery: "갈등 회복",
    longTermStability: "장기 안정성",
    growthComplement: "역할 보완",
  },
  some: {
    attraction: "호감 신호",
    communication: "대화 신호",
    lifestyleRhythm: "타이밍",
    conflictRecovery: "애매함 해소",
    longTermStability: "발전 가능성",
    growthComplement: "서로 자극",
  },
  friendship: {
    attraction: "친밀감",
    communication: "대화 리듬",
    lifestyleRhythm: "거리감",
    conflictRecovery: "오해 회복",
    longTermStability: "오래 가는 안정성",
    growthComplement: "서로 자극",
  },
  family: {
    attraction: "정서 연결",
    communication: "말의 통로",
    lifestyleRhythm: "생활 리듬",
    conflictRecovery: "감정 회복",
    longTermStability: "가족 안정성",
    growthComplement: "역할 보완",
  },
  business_work_partner: {
    attraction: "협업 시너지",
    communication: "의사소통",
    lifestyleRhythm: "업무 리듬",
    conflictRecovery: "갈등 조정",
    longTermStability: "신뢰 지속성",
    growthComplement: "역할 보완",
  },
} as const satisfies Record<
  CompatibilityRelationshipType,
  CompatibilityScoreDisplayLabels
>;

const compatibilityScoreExplanations = {
  love: {
    attraction: "처음 당기는 힘은 강한 편입니다.",
    communication: "말의 속도와 정리 순서를 맞춰야 편합니다.",
    lifestyleRhythm: "데이트와 일상 기준을 맞추면 안정적으로 굴러갈 수 있습니다.",
    conflictRecovery: "바로 풀기보다 시간을 두고 다시 말해야 하는 조합입니다.",
    longTermStability: "역할과 책임을 나누면 길게 가기 좋습니다.",
    growthComplement: "서로의 빈칸을 자극하는 보완성이 있습니다.",
  },
  marriage: {
    attraction: "설렘보다 함께 지내는 온도를 꾸준히 관리해야 합니다.",
    communication: "대화 습관을 정하면 반복 갈등이 줄어듭니다.",
    lifestyleRhythm: "생활 기준을 맞추면 장기 안정성이 올라갑니다.",
    conflictRecovery: "감정이 가라앉은 뒤 책임 범위를 다시 정리해야 합니다.",
    longTermStability: "돈, 일정, 역할을 나누면 오래 버티는 힘이 생깁니다.",
    growthComplement: "각자 잘하는 역할을 인정할수록 현실 운영이 편해집니다.",
  },
  some: {
    attraction: "호감 신호는 분명하지만 관계를 명확히 하는 속도는 조율이 필요합니다.",
    communication: "가벼운 대화 뒤에 의도를 한 번 더 확인해야 합니다.",
    lifestyleRhythm: "타이밍이 어긋나면 좋은 신호도 애매하게 느껴질 수 있습니다.",
    conflictRecovery: "불편한 신호를 오래 숨기지 말고 작게 확인해야 합니다.",
    longTermStability: "관계를 어떻게 발전시킬지 말로 정하면 가능성이 커집니다.",
    growthComplement: "서로에게 자극은 있지만 부담으로 바뀌지 않게 속도를 봐야 합니다.",
  },
  friendship: {
    attraction: "친밀감은 있지만 서로의 공간을 인정할수록 편합니다.",
    communication: "대화 리듬이 맞으면 오래 편하게 이어질 수 있습니다.",
    lifestyleRhythm: "거리 조절이 맞으면 오래 가지만, 작은 오해는 바로 풀어야 합니다.",
    conflictRecovery: "오해가 생기면 농담으로 넘기기보다 기준을 확인해야 합니다.",
    longTermStability: "무리하지 않는 도움 방식이 오래 가는 안정성을 만듭니다.",
    growthComplement: "서로 다른 관점이 자극이 되지만 선을 넘지 않는 게 중요합니다.",
  },
  family: {
    attraction: "정서 연결은 있으나 익숙함 때문에 표현이 줄어들 수 있습니다.",
    communication: "말의 통로를 만들어야 오래된 감정이 덜 쌓입니다.",
    lifestyleRhythm: "생활 리듬을 존중하면 역할 갈등이 줄어듭니다.",
    conflictRecovery: "감정이 커지기 전에 상황 단위로 다시 말해야 합니다.",
    longTermStability: "역할과 경계를 정하면 가족 안정성이 올라갑니다.",
    growthComplement: "서로의 역할을 고정하지 않을 때 보완성이 살아납니다.",
  },
  business_work_partner: {
    attraction: "협업 에너지는 있지만 역할 정의가 있어야 성과로 이어집니다.",
    communication: "의사소통은 감보다 기준과 기록을 함께 두어야 안정됩니다.",
    lifestyleRhythm: "업무 속도와 확인 주기를 맞추면 실행력이 올라갑니다.",
    conflictRecovery: "의견 충돌이 생기면 감정보다 기준과 책임 범위를 먼저 정리해야 합니다.",
    longTermStability: "신뢰를 유지하려면 돈, 일정, 권한을 문서로 남겨야 합니다.",
    growthComplement: "역할 보완은 강하지만 결정권이 흐려지면 피로가 커집니다.",
  },
} as const satisfies Record<
  CompatibilityRelationshipType,
  CompatibilityScoreDisplayLabels
>;

export function getCompatibilityRelationshipTypeLabel(
  type: CompatibilityRelationshipType,
): string {
  return compatibilityRelationshipTypeLabels[type];
}

export function getCompatibilityRelationshipTypeFocus(
  type: CompatibilityRelationshipType,
): string {
  return compatibilityRelationshipTypeFocus[type];
}

export function getCompatibilityRelationshipTypeTone(
  type: CompatibilityRelationshipType,
): string {
  return compatibilityRelationshipTypeTone[type];
}

export function getCompatibilityScoreDisplayLabels(
  relationshipType: CompatibilityRelationshipType,
): CompatibilityScoreDisplayLabels {
  return compatibilityScoreDisplayLabels[relationshipType];
}

export function getCompatibilityScoreExplanation(input: {
  readonly relationshipType: CompatibilityRelationshipType;
  readonly category: CompatibilityScoreCategory;
  readonly score: number;
}): string {
  void input.score;

  return compatibilityScoreExplanations[input.relationshipType][input.category];
}

export function adaptCompatibilityTextForRelationshipType(
  text: string,
  relationshipType: CompatibilityRelationshipType,
): string {
  if (relationshipType === "business_work_partner") {
    return text
      .split("방향을 잡은 사람은 상대가 반응할 시간을 두고, 반응하는 사람은 고마움과 자기 의견을 함께 표현해야 합니다.")
      .join("기준을 잡은 사람은 실행 담당이 검토할 시간을 두고, 실행 담당은 수정 의견을 명확히 남겨야 합니다.")
      .split("감정을 말로 바로 풀지 못할 때").join("이슈를 바로 정리하지 못할 때")
      .split("협업 분위기를 올려 대화를 열고").join("현장 피드백으로 논의를 열고")
      .split("온도를 올려 대화를 열고").join("협업 분위기를 열고")
      .split("상대가 내 빈칸을 대신 책임지는").join("상대 역할에 내 책임까지 넘기는")
      .split("파트너십이 빨리 관리표처럼 느껴지고").join("파트너십이 지나치게 관리표처럼 느껴지고")
      .split("관계가 쉽게 흩어지지 않고").join("협업 구조가 쉽게 흔들리지 않고")
      .split("상대가 내 부족한 부분을").join("상대 역할에 내 책임까지")
      .split("상대가 내 부족한 부분").join("상대 역할에 내 책임")
      .split("관계가 입체적으로 굴러갑니다").join("협업이 입체적으로 굴러갑니다")
      .split("고마움과 자기 의견").join("확인 피드백과 수정 의견")
      .split("가볍게 쉬는 시간").join("짧은 재정비 시간")
      .split("즐거움보다 의무").join("자율성보다 관리 부담")
      .split("상대가 반응할 시간").join("검토/응답 시간")
      .split("감정의 설렘").join("초기 기대감")
      .split("관계의 온도").join("협업 분위기")
      .split("마음이 식었다").join("협업 신호가 약해졌다")
      .split("관계가").join("협업 구조가")
      .split("관계의").join("협업의")
      .split("관계").join("협업 구조")
      .split("부족함").join("책임 공백")
      .split("빈칸").join("역할 공백")
      .split("온도").join("협업 분위기")
      .split("반응").join("실행 피드백")
      .split("연애").join("파트너십")
      .split("데이트").join("업무 미팅")
      .split("애인").join("파트너")
      .split("설렘").join("초기 기대감")
      .split("호감").join("협업 신호")
      .split("끌림").join("협업 시너지");
  }

  if (relationshipType === "family") {
    return text
      .split("방향을 잡은 사람은 상대가 반응할 시간을 두고, 반응하는 사람은 고마움과 자기 의견을 함께 표현해야 합니다.")
      .join("기준을 말한 사람은 상대가 받아들일 시간을 두고, 듣는 사람은 불편한 지점을 짧게 표현해야 합니다.")
      .split("협업").join("가족 안의 역할")
      .split("업무").join("생활")
      .split("방향과 구조를 잡고").join("생활 기준을 정리하고")
      .split("방향과 구조").join("생활 기준과 정리감")
      .split("온도와 반응을 살려").join("말의 통로와 정서 반응을 살려")
      .split("온도와 반응").join("말의 통로와 정서 반응")
      .split("관계가 입체적으로 굴러갑니다").join("가족 관계가 덜 막히고 편안해집니다")
      .split("관계의 온도").join("가족 안의 분위기")
      .split("연애").join("가족 관계")
      .split("데이트").join("함께 보내는 시간")
      .split("애인").join("가족")
      .split("설렘").join("정서적 반응")
      .split("호감").join("정서 연결")
      .split("끌림").join("정서 연결");
  }

  if (relationshipType === "friendship") {
    return text
      .split("연애").join("친구 관계")
      .split("데이트").join("만남")
      .split("애인").join("친구")
      .split("결혼").join("장기 관계")
      .split("설렘").join("친밀감");
  }

  return text;
}

export function getCompatibilityScoreCaution(
  relationshipType: CompatibilityRelationshipType,
  totalScore: number,
): string {
  if (relationshipType === "love") {
    return `${totalScore}점은 안 맞는 점수가 아니라, 끌림과 보완은 있지만 속도·생활·회복 방식에 조율 장치가 필요한 궁합입니다.`;
  }
  if (relationshipType === "some") {
    return `${totalScore}점은 호감이 없다는 뜻이 아니라, 신호와 타이밍을 어떻게 맞추느냐에 따라 체감이 달라지는 궁합이라는 뜻입니다.`;
  }
  if (relationshipType === "marriage") {
    return `${totalScore}점은 장기 관계의 가능성을 단정하지 않으며, 생활·돈·책임의 운영 방식에 따라 안정감이 달라진다는 뜻입니다.`;
  }
  if (relationshipType === "friendship") {
    return `${totalScore}점은 친구 관계의 좋고 나쁨을 단정하지 않으며, 거리감과 도움 방식이 맞을수록 오래 편해지는 관계라는 뜻입니다.`;
  }
  if (relationshipType === "family") {
    return `${totalScore}점은 가족 관계를 좋고 나쁘게 판정하는 값이 아니라, 말의 통로와 생활 리듬을 어떻게 조율해야 하는지 보여 주는 참고값입니다.`;
  }

  return `${totalScore}점은 파트너십의 성공을 단정하지 않으며, 역할·권한·책임 범위를 어떻게 나누느냐에 따라 협업 체감이 달라진다는 뜻입니다.`;
}

export type CompatibilityScoreResult = {
  readonly totalScore: number;
  readonly breakdown: CompatibilityScoreBreakdown;
  readonly scoreLabel: string;
  readonly scoreCaution: string;
};

export type CompatibilityEvidenceSection =
  | "overview"
  | "two_charts"
  | "attraction"
  | "strengths"
  | "frictions"
  | "communication"
  | "relationship_scenes"
  | "long_term"
  | "money_lifestyle"
  | "conflict_recovery"
  | "final_advice";

export type CompatibilityEvidenceItem = {
  readonly section: CompatibilityEvidenceSection;
  readonly title: string;
  readonly summary: string;
  readonly deepSajuLayer?: CompatibilityDeepSajuLayer;
  readonly personAFeatureIds: readonly string[];
  readonly personBFeatureIds: readonly string[];
  readonly mbtiTraitIds: readonly string[];
  readonly sceneSeeds: readonly string[];
  readonly practicalSwitches: readonly string[];
  readonly scoreImpact: number;
};

export type CompatibilityPillars = {
  readonly year: string;
  readonly month: string;
  readonly day: string;
  readonly hour?: string;
};

export type CompatibilityPersonChartSummary = {
  readonly role: CompatibilityPersonInput["role"];
  readonly displayName: string;
  readonly mbti?: MbtiTypeCode;
  readonly birthTimeConfidence: "known" | "unknown";
  readonly pillars: CompatibilityPillars;
  readonly dayMaster: string;
  readonly dayPillar: string;
  readonly featureIds: readonly string[];
  readonly featureLabels: readonly string[];
  readonly diagnosticFeatureLabels: readonly string[];
  readonly sajuFacts: ComputedSajuFacts;
};
