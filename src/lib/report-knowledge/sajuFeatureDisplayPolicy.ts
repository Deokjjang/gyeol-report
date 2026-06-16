export type SajuFeatureVisibilityLevel =
  | "core"
  | "visible"
  | "supplementary"
  | "diagnostic"
  | "hidden";

export type SajuFeatureDisplayPolicy = {
  readonly featureId: string;
  readonly labelKo: string;
  readonly visibility: SajuFeatureVisibilityLevel;
  readonly displayGroup:
    | "core_structure"
    | "good_fortune"
    | "talent"
    | "relationship"
    | "caution"
    | "balance"
    | "diagnostic_only";
  readonly showInBasicTable: boolean;
  readonly showInSpotlight: boolean;
  readonly showInNarrative: boolean;
  readonly safetyNote?: string;
};

const sajuFeatureDisplayPolicies = [
  {
    featureId: "day_master_gabmok",
    labelKo: "갑목",
    visibility: "core",
    displayGroup: "core_structure",
    showInBasicTable: true,
    showInSpotlight: false,
    showInNarrative: true,
  },
  {
    featureId: "day_pillar_gapsin",
    labelKo: "갑신일주",
    visibility: "core",
    displayGroup: "core_structure",
    showInBasicTable: true,
    showInSpotlight: true,
    showInNarrative: true,
  },
  {
    featureId: "element_water_missing",
    labelKo: "수 부족",
    visibility: "core",
    displayGroup: "balance",
    showInBasicTable: true,
    showInSpotlight: true,
    showInNarrative: true,
  },
  {
    featureId: "element_fire_missing",
    labelKo: "화 부족",
    visibility: "core",
    displayGroup: "balance",
    showInBasicTable: true,
    showInSpotlight: true,
    showInNarrative: true,
  },
  {
    featureId: "element_earth_excess",
    labelKo: "토 과다",
    visibility: "core",
    displayGroup: "balance",
    showInBasicTable: true,
    showInSpotlight: true,
    showInNarrative: true,
  },
  {
    featureId: "structure_jaeda_sinyak",
    labelKo: "재다신약",
    visibility: "core",
    displayGroup: "caution",
    showInBasicTable: true,
    showInSpotlight: true,
    showInNarrative: true,
  },
  {
    featureId: "structure_no_resource",
    labelKo: "무인성",
    visibility: "core",
    displayGroup: "balance",
    showInBasicTable: true,
    showInSpotlight: true,
    showInNarrative: true,
  },
  {
    featureId: "structure_no_output",
    labelKo: "무식상",
    visibility: "core",
    displayGroup: "balance",
    showInBasicTable: true,
    showInSpotlight: true,
    showInNarrative: true,
  },
  {
    featureId: "gwiin_cheoneul",
    labelKo: "천을귀인",
    visibility: "visible",
    displayGroup: "good_fortune",
    showInBasicTable: true,
    showInSpotlight: true,
    showInNarrative: true,
  },
  {
    featureId: "twelve_sinsal_yeokma",
    labelKo: "역마살",
    visibility: "visible",
    displayGroup: "talent",
    showInBasicTable: true,
    showInSpotlight: true,
    showInNarrative: true,
  },
  {
    featureId: "sinsal_dohwa",
    labelKo: "도화살",
    visibility: "visible",
    displayGroup: "relationship",
    showInBasicTable: true,
    showInSpotlight: true,
    showInNarrative: true,
  },
  {
    featureId: "sinsal_hongyeom",
    labelKo: "홍염살",
    visibility: "visible",
    displayGroup: "relationship",
    showInBasicTable: true,
    showInSpotlight: true,
    showInNarrative: true,
  },
  {
    featureId: "twelve_sinsal_hwagae",
    labelKo: "화개살",
    visibility: "visible",
    displayGroup: "talent",
    showInBasicTable: true,
    showInSpotlight: true,
    showInNarrative: true,
  },
  {
    featureId: "sinsal_gongmang",
    labelKo: "공망",
    visibility: "visible",
    displayGroup: "caution",
    showInBasicTable: true,
    showInSpotlight: true,
    showInNarrative: true,
  },
  {
    featureId: "twelve_sinsal_jangseong",
    labelKo: "장성살",
    visibility: "visible",
    displayGroup: "talent",
    showInBasicTable: true,
    showInSpotlight: true,
    showInNarrative: true,
  },
  {
    featureId: "gwiin_jaego",
    labelKo: "재고귀인",
    visibility: "supplementary",
    displayGroup: "good_fortune",
    showInBasicTable: true,
    showInSpotlight: true,
    showInNarrative: true,
  },
  {
    featureId: "gwiin_geumyeorok",
    labelKo: "금여록",
    visibility: "supplementary",
    displayGroup: "good_fortune",
    showInBasicTable: true,
    showInSpotlight: true,
    showInNarrative: true,
  },
  {
    featureId: "gwiin_amrok",
    labelKo: "암록",
    visibility: "supplementary",
    displayGroup: "good_fortune",
    showInBasicTable: true,
    showInSpotlight: true,
    showInNarrative: true,
  },
  {
    featureId: "sinsal_yangin",
    labelKo: "양인살",
    visibility: "supplementary",
    displayGroup: "talent",
    showInBasicTable: true,
    showInSpotlight: true,
    showInNarrative: true,
  },
  {
    featureId: "sinsal_hyeonchim",
    labelKo: "현침살",
    visibility: "supplementary",
    displayGroup: "talent",
    showInBasicTable: true,
    showInSpotlight: true,
    showInNarrative: true,
  },
  {
    featureId: "sinsal_wonjin",
    labelKo: "원진살",
    visibility: "supplementary",
    displayGroup: "caution",
    showInBasicTable: true,
    showInSpotlight: true,
    showInNarrative: true,
  },
  {
    featureId: "sinsal_gwimun",
    labelKo: "귀문관살",
    visibility: "supplementary",
    displayGroup: "caution",
    showInBasicTable: true,
    showInSpotlight: true,
    showInNarrative: true,
  },
  {
    featureId: "twelve_sinsal_cheonsal",
    labelKo: "천살",
    visibility: "supplementary",
    displayGroup: "caution",
    showInBasicTable: true,
    showInSpotlight: true,
    showInNarrative: true,
  },
  {
    featureId: "twelve_sinsal_yukhae",
    labelKo: "육해살",
    visibility: "supplementary",
    displayGroup: "caution",
    showInBasicTable: true,
    showInSpotlight: true,
    showInNarrative: true,
  },
  {
    featureId: "twelve_sinsal_banan",
    labelKo: "반안살",
    visibility: "diagnostic",
    displayGroup: "diagnostic_only",
    showInBasicTable: false,
    showInSpotlight: false,
    showInNarrative: false,
    safetyNote: "학파와 기준지에 따라 다르게 잡힐 수 있어 기본 확정 표에서는 숨깁니다.",
  },
  {
    featureId: "sinsal_banan",
    labelKo: "반안살",
    visibility: "diagnostic",
    displayGroup: "diagnostic_only",
    showInBasicTable: false,
    showInSpotlight: false,
    showInNarrative: false,
    safetyNote: "구형 지식 ID도 반안살 diagnostic-only 정책을 따릅니다.",
  },
  {
    featureId: "sinsal_baekho",
    labelKo: "백호살/백호대살",
    visibility: "diagnostic",
    displayGroup: "diagnostic_only",
    showInBasicTable: false,
    showInSpotlight: false,
    showInNarrative: false,
    safetyNote: "백호살 계열은 기준 차이가 크므로 현재 v1.0에서는 보조 진단으로만 둡니다.",
  },
] as const satisfies readonly SajuFeatureDisplayPolicy[];

export const SAJU_FEATURE_DISPLAY_POLICIES = sajuFeatureDisplayPolicies;

const sajuFeatureDisplayPolicyById: ReadonlyMap<string, SajuFeatureDisplayPolicy> =
  new Map<string, SajuFeatureDisplayPolicy>(
    SAJU_FEATURE_DISPLAY_POLICIES.map((policy): [string, SajuFeatureDisplayPolicy] => [
      policy.featureId,
      policy,
    ]),
  );

export function getSajuFeatureDisplayPolicy(
  featureId: string,
): SajuFeatureDisplayPolicy | undefined {
  return sajuFeatureDisplayPolicyById.get(featureId);
}

export function shouldShowFeatureInBasicTable(featureId: string): boolean {
  return getSajuFeatureDisplayPolicy(featureId)?.showInBasicTable ?? true;
}

export function shouldShowFeatureInSpotlight(featureId: string): boolean {
  return getSajuFeatureDisplayPolicy(featureId)?.showInSpotlight ?? true;
}

export function shouldShowFeatureInNarrative(featureId: string): boolean {
  return getSajuFeatureDisplayPolicy(featureId)?.showInNarrative ?? true;
}
