import type { MbtiTypeCode } from "./mbtiKnowledgeTypes";
import type { ComputedSajuFacts } from "./sajuComputedFactsTypes";
import type { CompatibilityDeepSajuLayer } from "./compatibilityDeepSajuBridge";

export type CompatibilityCanonicalRelationshipType =
  | "love"
  | "marriage"
  | "parentChild"
  | "coworker"
  | "managerReport"
  | "businessPartner"
  | "friendship";

export type CompatibilityRelationshipType =
  | "love"
  | "marriage"
  | "some"
  | "friendship"
  | "family"
  | "business_work_partner";

export type CompatibilityLegacyRelationshipType =
  | CompatibilityRelationshipType
  | "some"
  | "dating"
  | "romance"
  | "family"
  | "parent_child"
  | "workplace_colleague"
  | "colleague"
  | "boss_subordinate"
  | "manager_report"
  | "business_work_partner"
  | "business_partner"
  | "friend_social"
  | "friend";

export type CompatibilityRelationshipCategoryInput =
  | CompatibilityCanonicalRelationshipType
  | CompatibilityLegacyRelationshipType;

export const compatibilityRelationshipTypes = [
  "love",
  "marriage",
  "parentChild",
  "coworker",
  "managerReport",
  "businessPartner",
  "friendship",
] as const satisfies readonly CompatibilityCanonicalRelationshipType[];

const compatibilityLegacyRelationshipTypeMap: Readonly<
  Record<string, CompatibilityCanonicalRelationshipType>
> = {
  love: "love",
  some: "love",
  dating: "love",
  romance: "love",
  marriage: "marriage",
  parentchild: "parentChild",
  parent_child: "parentChild",
  family: "parentChild",
  workplace_colleague: "coworker",
  workplacecolleague: "coworker",
  colleague: "coworker",
  coworker: "coworker",
  boss_subordinate: "managerReport",
  bosssubordinate: "managerReport",
  manager_report: "managerReport",
  managerreport: "managerReport",
  business_work_partner: "businessPartner",
  businessworkpartner: "businessPartner",
  business_partner: "businessPartner",
  businesspartner: "businessPartner",
  friend_social: "friendship",
  friendsocial: "friendship",
  friend: "friendship",
  friendship: "friendship",
};

function normalizeRelationshipTypeKey(input: string): string {
  return input.trim().replace(/-/gu, "_");
}

function normalizeRelationCategoryLookupKey(input: string): string {
  return normalizeRelationshipTypeKey(input).toLowerCase();
}

export function normalizeCompatibilityRelationCategory(
  input: string | null | undefined,
): CompatibilityCanonicalRelationshipType {
  if (input === null || input === undefined) {
    return "love";
  }

  return (
    compatibilityLegacyRelationshipTypeMap[
      normalizeRelationCategoryLookupKey(input)
    ] ?? "love"
  );
}

export function requireCompatibilityRelationCategory(
  input: string,
): CompatibilityCanonicalRelationshipType {
  const normalized =
    compatibilityLegacyRelationshipTypeMap[
      normalizeRelationCategoryLookupKey(input)
    ];

  if (normalized === undefined) {
    throw new Error(`Unsupported compatibility relation category: ${input}`);
  }

  return normalized;
}

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
  readonly relationshipType: CompatibilityRelationshipCategoryInput;
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
  marriage: "결혼",
  parentChild: "부모·자식",
  coworker: "직장 동료",
  managerReport: "상사·부하",
  businessPartner: "사업/협업",
  friendship: "친구/인간관계",
} as const satisfies Record<CompatibilityCanonicalRelationshipType, string>;

const compatibilityRelationshipTypeFocus = {
  love: "끌림, 감정 온도, 데이트 리듬, 대화 속도, 갈등 회복",
  marriage: "생활 리듬, 돈, 책임, 장기 안정성, 반복 갈등, 가족/현실 운영",
  parentChild: "정서 연결, 오래된 패턴, 말의 통로, 생활 리듬, 경계와 역할",
  coworker: "업무 리듬, 역할 분담, 의사소통, 피드백 방식, 오해 회복",
  managerReport: "권한과 책임, 보고 방식, 기대치 조율, 피드백, 신뢰 관리",
  businessPartner:
    "역할 분담, 의사결정, 업무 속도, 돈/책임, 신뢰, 리스크 관리, 피드백 방식",
  friendship: "대화 리듬, 거리감, 도움 방식, 의리, 오래 가는 안정성",
} as const satisfies Record<CompatibilityCanonicalRelationshipType, string>;

const compatibilityRelationshipTypeTone = {
  love: "감정 온도와 데이트 장면을 중심으로 부드럽게 조율한다.",
  marriage: "현실 운영과 장기 안정성을 중심으로 차분하게 조율한다.",
  parentChild: "오래된 패턴과 역할 경계를 중심으로 조심스럽고 따뜻하게 조율한다.",
  coworker: "업무 리듬과 역할 조율을 중심으로 실무적인 관계 언어로 조율한다.",
  managerReport: "권한, 책임, 보고와 피드백을 중심으로 차분하게 조율한다.",
  businessPartner:
    "역할, 책임, 의사결정을 중심으로 실무적인 관계 언어로 조율한다.",
  friendship: "거리감과 의리를 중심으로 편안한 관계 언어로 조율한다.",
} as const satisfies Record<CompatibilityCanonicalRelationshipType, string>;

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
  parentChild: {
    attraction: "정서 연결",
    communication: "말의 통로",
    lifestyleRhythm: "생활 리듬",
    conflictRecovery: "감정 회복",
    longTermStability: "관계 안정성",
    growthComplement: "역할 보완",
  },
  coworker: {
    attraction: "협업 리듬",
    communication: "의사소통",
    lifestyleRhythm: "업무 리듬",
    conflictRecovery: "오해 조정",
    longTermStability: "협업 안정성",
    growthComplement: "역할 보완",
  },
  managerReport: {
    attraction: "업무 신뢰",
    communication: "보고·피드백",
    lifestyleRhythm: "업무 리듬",
    conflictRecovery: "기대치 조정",
    longTermStability: "신뢰 지속성",
    growthComplement: "역할 보완",
  },
  businessPartner: {
    attraction: "협업 시너지",
    communication: "의사소통",
    lifestyleRhythm: "업무 리듬",
    conflictRecovery: "갈등 조정",
    longTermStability: "신뢰 지속성",
    growthComplement: "역할 보완",
  },
  friendship: {
    attraction: "친밀감",
    communication: "대화 리듬",
    lifestyleRhythm: "거리감",
    conflictRecovery: "오해 회복",
    longTermStability: "오래 가는 안정성",
    growthComplement: "서로 자극",
  },
} as const satisfies Record<
  CompatibilityCanonicalRelationshipType,
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
  parentChild: {
    attraction: "정서 연결은 있으나 익숙함 때문에 표현이 줄어들 수 있습니다.",
    communication: "말의 통로를 만들어야 오래된 감정이 덜 쌓입니다.",
    lifestyleRhythm: "생활 리듬을 존중하면 역할 갈등이 줄어듭니다.",
    conflictRecovery: "감정이 커지기 전에 상황 단위로 다시 말해야 합니다.",
    longTermStability: "역할과 경계를 정하면 관계 안정성이 올라갑니다.",
    growthComplement: "서로의 역할을 고정하지 않을 때 보완성이 살아납니다.",
  },
  coworker: {
    attraction: "같이 일하는 리듬은 있지만 역할과 확인 주기를 맞춰야 합니다.",
    communication: "의사소통은 감보다 기준과 기록을 함께 두어야 안정됩니다.",
    lifestyleRhythm: "업무 속도와 확인 주기를 맞추면 실행력이 올라갑니다.",
    conflictRecovery: "작은 오해는 책임 범위와 작업 기준으로 다시 정리해야 합니다.",
    longTermStability: "무리하지 않는 협업 규칙이 오래 가는 안정성을 만듭니다.",
    growthComplement: "서로 다른 업무 방식이 자극이 되지만 선을 넘지 않는 게 중요합니다.",
  },
  managerReport: {
    attraction: "업무 신뢰는 생길 수 있지만 권한과 기대치가 분명해야 합니다.",
    communication: "보고와 피드백의 주기를 정하면 불필요한 오해가 줄어듭니다.",
    lifestyleRhythm: "업무 속도와 의사결정 단계를 맞추면 부담이 줄어듭니다.",
    conflictRecovery: "불편한 피드백은 감정보다 기준과 다음 행동으로 정리해야 합니다.",
    longTermStability: "권한, 책임, 평가 기준을 맞추면 신뢰가 오래 유지됩니다.",
    growthComplement: "상대 역할을 고정하지 않고 기대치를 조율할수록 보완성이 살아납니다.",
  },
  businessPartner: {
    attraction: "협업 에너지는 있지만 역할 정의가 있어야 성과로 이어집니다.",
    communication: "의사소통은 감보다 기준과 기록을 함께 두어야 안정됩니다.",
    lifestyleRhythm: "업무 속도와 확인 주기를 맞추면 실행력이 올라갑니다.",
    conflictRecovery: "의견 충돌이 생기면 감정보다 기준과 책임 범위를 먼저 정리해야 합니다.",
    longTermStability: "신뢰를 유지하려면 돈, 일정, 권한을 문서로 남겨야 합니다.",
    growthComplement: "역할 보완은 강하지만 결정권이 흐려지면 피로가 커집니다.",
  },
  friendship: {
    attraction: "친밀감은 있지만 서로의 공간을 인정할수록 편합니다.",
    communication: "대화 리듬이 맞으면 오래 편하게 이어질 수 있습니다.",
    lifestyleRhythm: "거리 조절이 맞으면 오래 가지만, 작은 오해는 바로 풀어야 합니다.",
    conflictRecovery: "오해가 생기면 농담으로 넘기기보다 기준을 확인해야 합니다.",
    longTermStability: "무리하지 않는 도움 방식이 오래 가는 안정성을 만듭니다.",
    growthComplement: "서로 다른 관점이 자극이 되지만 선을 넘지 않는 게 중요합니다.",
  },
} as const satisfies Record<
  CompatibilityCanonicalRelationshipType,
  CompatibilityScoreDisplayLabels
>;

export function getCompatibilityRelationshipTypeLabel(
  type: CompatibilityRelationshipCategoryInput,
): string {
  return compatibilityRelationshipTypeLabels[
    normalizeCompatibilityRelationCategory(type)
  ];
}

export function getCompatibilityRelationshipTypeFocus(
  type: CompatibilityRelationshipCategoryInput,
): string {
  return compatibilityRelationshipTypeFocus[
    normalizeCompatibilityRelationCategory(type)
  ];
}

export function getCompatibilityRelationshipTypeTone(
  type: CompatibilityRelationshipCategoryInput,
): string {
  return compatibilityRelationshipTypeTone[
    normalizeCompatibilityRelationCategory(type)
  ];
}

export function getCompatibilityScoreDisplayLabels(
  relationshipType: CompatibilityRelationshipCategoryInput,
): CompatibilityScoreDisplayLabels {
  return compatibilityScoreDisplayLabels[
    normalizeCompatibilityRelationCategory(relationshipType)
  ];
}

export function getCompatibilityScoreExplanation(input: {
  readonly relationshipType: CompatibilityRelationshipCategoryInput;
  readonly category: CompatibilityScoreCategory;
  readonly score: number;
}): string {
  void input.score;

  return compatibilityScoreExplanations[
    normalizeCompatibilityRelationCategory(input.relationshipType)
  ][input.category];
}

export function adaptCompatibilityTextForRelationshipType(
  text: string,
  relationshipType: CompatibilityRelationshipCategoryInput,
): string {
  const relationCategory = normalizeCompatibilityRelationCategory(relationshipType);

  if (
    relationCategory === "businessPartner" ||
    relationCategory === "coworker" ||
    relationCategory === "managerReport"
  ) {
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
      .split("표현의 온도").join("커뮤니케이션 분위기")
      .split("관계의 온도").join("협업 분위기")
      .split("마음이 식었다").join("협업 신호가 약해졌다")
      .split("부족함").join("책임 공백")
      .split("빈칸").join("역할 공백")
      .split("연애").join("파트너십")
      .split("데이트").join("업무 미팅")
      .split("애인").join("파트너")
      .split("설렘").join("초기 기대감")
      .split("호감").join("협업 신호")
      .split("끌림").join("협업 시너지")
      .split("협업의 협업 시너지을").join("협업 시너지를")
      .split("협업의 협업 시너지를").join("협업 시너지를")
      .split("협업의 협업 시너지").join("협업 시너지")
      .split("협업 시너지을").join("협업 시너지를")
      .split("협업 시너지은").join("협업 시너지는")
      .split("협업 시너지과").join("협업 시너지와")
      .split("현장 실행 피드백과 즉시성에 더 실행 피드백할 수 있습니다")
      .join("현장 피드백과 즉시성에 더 빠르게 반응할 수 있습니다")
      .split("현장 실행 피드백과 즉시성").join("현장 피드백과 즉시성")
      .split("표현의 협업 분위기").join("커뮤니케이션 분위기")
      .split("실행 피드백만 하는 구조").join("실행만 맡는 구조")
      .split("반응만 하는 구조").join("실행만 맡는 구조")
      .split("자기 방식으로 실행 피드백하면").join("자기 방식으로 반응하면")
      .split("현장 실행 피드백").join("현장 피드백");
  }

  if (relationCategory === "parentChild") {
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

  if (relationCategory === "friendship") {
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
  relationshipType: CompatibilityRelationshipCategoryInput,
  totalScore: number,
): string {
  const relationCategory = normalizeCompatibilityRelationCategory(relationshipType);

  if (relationCategory === "love") {
    return `${totalScore}점은 안 맞는 점수가 아니라, 끌림과 보완은 있지만 속도·생활·회복 방식에 조율 장치가 필요한 궁합입니다.`;
  }
  if (relationCategory === "marriage") {
    return `${totalScore}점은 장기 관계의 가능성을 단정하지 않으며, 생활·돈·책임의 운영 방식에 따라 안정감이 달라진다는 뜻입니다.`;
  }
  if (relationCategory === "friendship") {
    return `${totalScore}점은 친구 관계의 좋고 나쁨을 단정하지 않으며, 거리감과 도움 방식이 맞을수록 오래 편해지는 관계라는 뜻입니다.`;
  }
  if (relationCategory === "parentChild") {
    return `${totalScore}점은 부모·자식 관계를 좋고 나쁘게 판정하는 값이 아니라, 말의 통로와 생활 리듬을 어떻게 조율해야 하는지 보여 주는 참고값입니다.`;
  }
  if (relationCategory === "coworker") {
    return `${totalScore}점은 직장 동료 관계의 좋고 나쁨을 단정하지 않으며, 역할·소통·업무 리듬을 어떻게 맞춰야 하는지 보여 주는 참고값입니다.`;
  }
  if (relationCategory === "managerReport") {
    return `${totalScore}점은 상사·부하 관계의 성공을 단정하지 않으며, 권한·책임·피드백 기준을 어떻게 맞추느냐에 따라 체감이 달라진다는 뜻입니다.`;
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

export type CompatibilityEvidenceParticipant = {
  readonly role: CompatibilityPersonInput["role"];
  readonly label: "A" | "B";
  readonly name: string;
  readonly gender?: CompatibilityPersonInput["gender"];
  readonly mbtiType: MbtiTypeCode | null;
  readonly dayMaster: string;
  readonly dayPillar: string;
  readonly pillars: CompatibilityPillars;
  readonly sajuFacts: ComputedSajuFacts;
};

export type CompatibilitySajuCompatibility = {
  readonly dayMasterRelation: string | null;
  readonly dayBranchRelation: string | null;
  readonly elementBalance: readonly string[];
  readonly elementComplementSignals: readonly string[];
  readonly sharedWeakElementSignals: readonly string[];
  readonly overloadedElementSignals: readonly string[];
  readonly tenGodRelation: string | null;
  readonly branchInteractions: readonly string[];
  readonly supportSignals: readonly string[];
  readonly frictionSignals: readonly string[];
  readonly roleBalance: string | null;
  readonly gwiinSupport: readonly string[];
  readonly sinsalFriction: readonly string[];
  readonly timingHints: readonly string[];
};

export type CompatibilityMbtiCompatibilitySource =
  | "notablePairs"
  | "fallback"
  | "partial"
  | "unknown";

export type CompatibilityMbtiCompatibility = {
  readonly aType: MbtiTypeCode | null;
  readonly bType: MbtiTypeCode | null;
  readonly sharedGround: readonly string[];
  readonly friction: readonly string[];
  readonly positiveInfluence: readonly string[];
  readonly communicationPattern: readonly string[];
  readonly repairStrategy: readonly string[];
  readonly pairLabel: string | null;
  readonly reportLine: string | null;
  readonly lovePattern: string | null;
  readonly marriagePattern: string | null;
  readonly source: CompatibilityMbtiCompatibilitySource;
};

export type CompatibilityBridgeCompatibility = {
  readonly agreementSignals: readonly string[];
  readonly tensionSignals: readonly string[];
  readonly amplificationSignals: readonly string[];
  readonly cautionSignals: readonly string[];
  readonly interpretationMode: string;
};

export type CompatibilityCategoryLens = {
  readonly relationshipType: CompatibilityCanonicalRelationshipType;
  readonly focus: readonly string[];
  readonly strengthFocus: string;
  readonly frictionFocus: string;
  readonly repairFocus: string;
  readonly safetyFocus: string;
};

export type CompatibilityDirectFindingType =
  | "strength"
  | "friction"
  | "risk"
  | "repair";

export type CompatibilityDirectFindingIntensity = "low" | "medium" | "high";

export type CompatibilityDirectFinding = {
  readonly type: CompatibilityDirectFindingType;
  readonly intensity: CompatibilityDirectFindingIntensity;
  readonly title: string;
  readonly evidence: readonly string[];
  readonly interpretation: string;
  readonly safeWording: string;
};
