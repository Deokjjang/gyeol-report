export type ComprehensiveReportSectionId =
  | "opening_summary"
  | "manse_table"
  | "mbti_table"
  | "saju_core"
  | "mbti_core"
  | "saju_mbti_fusion"
  | "personality"
  | "strengths"
  | "weaknesses"
  | "work_career"
  | "money_asset"
  | "love_relationship"
  | "human_relations"
  | "family_independence"
  | "study_growth"
  | "environment_luck"
  | "final_advice";

export type SectionPrimaryBasis = "saju" | "mbti" | "fusion" | "display";

export type ComprehensiveReportSectionDefinition = {
  readonly id: ComprehensiveReportSectionId;
  readonly titleKo: string;
  readonly purpose: string;
  readonly primaryBasis: SectionPrimaryBasis;
  readonly sajuWeight: number;
  readonly mbtiWeight: number;
  readonly fusionWeight: number;
  readonly shouldBeCollapsible: boolean;
  readonly minimumEvidenceCount: number;
};

export const COMPREHENSIVE_REPORT_SECTION_DEFINITIONS = [
  {
    id: "opening_summary",
    titleKo: "한눈에 보는 결",
    purpose: "핵심 구조를 짧게 요약해 사용자가 바로 몰입하게 합니다.",
    primaryBasis: "fusion",
    sajuWeight: 0.5,
    mbtiWeight: 0.2,
    fusionWeight: 0.3,
    shouldBeCollapsible: false,
    minimumEvidenceCount: 1,
  },
  {
    id: "manse_table",
    titleKo: "만세력 표",
    purpose: "계산된 사주 원국과 주요 구조를 표시합니다.",
    primaryBasis: "display",
    sajuWeight: 1,
    mbtiWeight: 0,
    fusionWeight: 0,
    shouldBeCollapsible: true,
    minimumEvidenceCount: 0,
  },
  {
    id: "mbti_table",
    titleKo: "MBTI 입력 정보",
    purpose: "사용자가 입력한 자기보고 유형을 표시합니다.",
    primaryBasis: "display",
    sajuWeight: 0,
    mbtiWeight: 1,
    fusionWeight: 0,
    shouldBeCollapsible: true,
    minimumEvidenceCount: 0,
  },
  {
    id: "saju_core",
    titleKo: "사주 핵심 구조",
    purpose: "일간, 일주, 오행, 십성을 중심으로 1차 근거를 세웁니다.",
    primaryBasis: "saju",
    sajuWeight: 0.85,
    mbtiWeight: 0.05,
    fusionWeight: 0.1,
    shouldBeCollapsible: false,
    minimumEvidenceCount: 2,
  },
  {
    id: "mbti_core",
    titleKo: "MBTI 핵심 성향",
    purpose: "사용자가 체감하는 자기상을 짧고 안전하게 정리합니다.",
    primaryBasis: "mbti",
    sajuWeight: 0.15,
    mbtiWeight: 0.75,
    fusionWeight: 0.1,
    shouldBeCollapsible: true,
    minimumEvidenceCount: 1,
  },
  {
    id: "saju_mbti_fusion",
    titleKo: "사주×MBTI 연결",
    purpose: "사주 원국과 MBTI가 강화하거나 충돌하는 지점을 해석합니다.",
    primaryBasis: "fusion",
    sajuWeight: 0.45,
    mbtiWeight: 0.25,
    fusionWeight: 0.3,
    shouldBeCollapsible: false,
    minimumEvidenceCount: 2,
  },
  {
    id: "personality",
    titleKo: "성격",
    purpose: "기질, 판단 방식, 정서 반응을 사주 우선으로 설명합니다.",
    primaryBasis: "saju",
    sajuWeight: 0.6,
    mbtiWeight: 0.25,
    fusionWeight: 0.15,
    shouldBeCollapsible: false,
    minimumEvidenceCount: 2,
  },
  {
    id: "strengths",
    titleKo: "강점",
    purpose: "잘 쓰면 성과로 이어지는 힘을 정리합니다.",
    primaryBasis: "saju",
    sajuWeight: 0.6,
    mbtiWeight: 0.2,
    fusionWeight: 0.2,
    shouldBeCollapsible: false,
    minimumEvidenceCount: 2,
  },
  {
    id: "weaknesses",
    titleKo: "약점",
    purpose: "반복되는 무리, 오해, 소모 패턴을 조심스럽게 짚습니다.",
    primaryBasis: "saju",
    sajuWeight: 0.6,
    mbtiWeight: 0.2,
    fusionWeight: 0.2,
    shouldBeCollapsible: false,
    minimumEvidenceCount: 2,
  },
  {
    id: "work_career",
    titleKo: "일과 커리어",
    purpose: "역할, 조직, 성과 방식의 적합도를 해석합니다.",
    primaryBasis: "saju",
    sajuWeight: 0.58,
    mbtiWeight: 0.22,
    fusionWeight: 0.2,
    shouldBeCollapsible: false,
    minimumEvidenceCount: 2,
  },
  {
    id: "money_asset",
    titleKo: "돈과 자산",
    purpose: "돈을 벌고 지키고 쓰는 구조를 현실적으로 정리합니다.",
    primaryBasis: "saju",
    sajuWeight: 0.65,
    mbtiWeight: 0.15,
    fusionWeight: 0.2,
    shouldBeCollapsible: false,
    minimumEvidenceCount: 2,
  },
  {
    id: "love_relationship",
    titleKo: "연애와 관계",
    purpose: "호감, 거리감, 표현 방식, 관계 피로를 해석합니다.",
    primaryBasis: "saju",
    sajuWeight: 0.55,
    mbtiWeight: 0.25,
    fusionWeight: 0.2,
    shouldBeCollapsible: false,
    minimumEvidenceCount: 2,
  },
  {
    id: "human_relations",
    titleKo: "인간관계",
    purpose: "사회적 거리, 협업, 갈등 처리 방식을 봅니다.",
    primaryBasis: "saju",
    sajuWeight: 0.57,
    mbtiWeight: 0.23,
    fusionWeight: 0.2,
    shouldBeCollapsible: false,
    minimumEvidenceCount: 2,
  },
  {
    id: "family_independence",
    titleKo: "가족과 독립",
    purpose: "가까운 관계와 독립 욕구의 균형을 설명합니다.",
    primaryBasis: "saju",
    sajuWeight: 0.62,
    mbtiWeight: 0.18,
    fusionWeight: 0.2,
    shouldBeCollapsible: true,
    minimumEvidenceCount: 1,
  },
  {
    id: "study_growth",
    titleKo: "학업과 성장",
    purpose: "배움, 전문성, 자기개발의 방향을 정리합니다.",
    primaryBasis: "saju",
    sajuWeight: 0.58,
    mbtiWeight: 0.22,
    fusionWeight: 0.2,
    shouldBeCollapsible: true,
    minimumEvidenceCount: 1,
  },
  {
    id: "environment_luck",
    titleKo: "환경과 기회",
    purpose: "도움, 이동, 주변 조건을 기회 관점에서 정리합니다.",
    primaryBasis: "saju",
    sajuWeight: 0.68,
    mbtiWeight: 0.12,
    fusionWeight: 0.2,
    shouldBeCollapsible: true,
    minimumEvidenceCount: 1,
  },
  {
    id: "final_advice",
    titleKo: "마지막 조언",
    purpose: "강점 사용법과 과열 방지 루틴을 정리합니다.",
    primaryBasis: "fusion",
    sajuWeight: 0.5,
    mbtiWeight: 0.2,
    fusionWeight: 0.3,
    shouldBeCollapsible: false,
    minimumEvidenceCount: 2,
  },
] as const satisfies readonly ComprehensiveReportSectionDefinition[];

export const COMPREHENSIVE_REPORT_SECTION_IDS =
  COMPREHENSIVE_REPORT_SECTION_DEFINITIONS.map((section) => section.id);
