export type ComprehensiveV1QualityGate = {
  readonly hasProductVersion: boolean;
  readonly hasFourPillarGrid: boolean;
  readonly hasStemBranchHanja: boolean;
  readonly hasElementChips: boolean;
  readonly hasSymbolicNickname: boolean;
  readonly hasSpotlight: boolean;
  readonly hasDifferentiationModules: boolean;
  readonly hasUniversalScenes: boolean;
  readonly hasMbtiCaution: boolean;
  readonly hasFinalActions: boolean;
  readonly noGenericUserLabels: boolean;
  readonly noInternalArtifacts: boolean;
  readonly noUnsupportedMbtiRecommendations: boolean;
};

const productVersionMarkers = ["사주×MBTI 종합 리포트 v1.0", "종합 리포트 v1.0"] as const;
const fourPillarGridMarkers = ["시주", "일주", "월주", "연주", "천간", "지지"] as const;
const stemBranchHanjaMarkers = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸", "子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"] as const;
const elementChipMarkers = [
  "element-chip--wood",
  "element-chip--fire",
  "element-chip--earth",
  "element-chip--metal",
  "element-chip--water",
] as const;
const universalSceneMarkers = [
  "사람들과 대화",
  "카톡",
  "DM",
  "수업",
  "팀플",
  "가족",
  "친구",
  "알바",
  "업무",
  "돈",
  "계좌",
  "잠들기 전",
] as const;
const mbtiCautionMarkers = [
  "MBTI는 궁합을 단정",
  "MBTI는 공식 진단",
  "자기보고",
  "보조 지표",
  "보조 레이어",
] as const;
const finalActionMarkers = [
  "오늘부터 할 수 있는 3가지",
  "오늘부터 할 일 3개",
  "오늘부터",
] as const;
const genericUserLabels = ["사용자님", "고객님", "유저님"] as const;
const internalArtifactMarkers = [
  "feature evidence",
  "selected evidence",
  "signature scene",
  "spotlight",
  "OpenAI",
  "JSON",
  "debug",
  "draft",
  "schema",
  "시그니처 장면",
  "스포트라이트",
  "선택된 근거",
  "계산된 근거",
] as const;
const unsupportedMbtiTypeNames = ["ISFP", "INFP", "INTP"] as const;

function collectStrings(value: unknown): readonly string[] {
  if (typeof value === "string") {
    return [value];
  }
  if (Array.isArray(value)) {
    return value.flatMap((item) => collectStrings(item));
  }
  if (typeof value === "object" && value !== null) {
    return Object.values(value).flatMap((item) => collectStrings(item));
  }

  return [];
}

function toReportText(value: unknown): string {
  return typeof value === "string" ? value : collectStrings(value).join("\n");
}

function includesEvery(text: string, markers: readonly string[]): boolean {
  return markers.every((marker) => text.includes(marker));
}

function includesAny(text: string, markers: readonly string[]): boolean {
  return markers.some((marker) => text.includes(marker));
}

function containsUnsupportedMbtiRecommendation(text: string): boolean {
  const typeCount = unsupportedMbtiTypeNames.filter((typeName) =>
    text.includes(typeName),
  ).length;

  return (
    typeCount >= 2 &&
    (text.includes("유형") ||
      text.includes("추천") ||
      text.includes("궁합") ||
      text.includes("보완") ||
      text.includes("잘 맞"))
  );
}

export function evaluateComprehensiveV1QualityGate(
  reportTextOrDraft: unknown,
): ComprehensiveV1QualityGate {
  const text = toReportText(reportTextOrDraft);

  return {
    hasProductVersion: includesAny(text, productVersionMarkers),
    hasFourPillarGrid: includesEvery(text, fourPillarGridMarkers),
    hasStemBranchHanja: includesAny(text, stemBranchHanjaMarkers),
    hasElementChips: includesEvery(text, elementChipMarkers),
    hasSymbolicNickname: text.includes("사주 한줄 별칭"),
    hasSpotlight: text.includes("특히 눈에 띄는 기운"),
    hasDifferentiationModules: text.includes("읽기 전에 잡고 갈 핵심 포인트"),
    hasUniversalScenes: includesAny(text, universalSceneMarkers),
    hasMbtiCaution: includesAny(text, mbtiCautionMarkers),
    hasFinalActions: includesAny(text, finalActionMarkers),
    noGenericUserLabels: !includesAny(text, genericUserLabels),
    noInternalArtifacts: !includesAny(text, internalArtifactMarkers),
    noUnsupportedMbtiRecommendations: !containsUnsupportedMbtiRecommendation(text),
  };
}

export function summarizeComprehensiveV1QualityGate(
  gate: ComprehensiveV1QualityGate,
): string {
  const passed = Object.values(gate).filter(Boolean).length;
  const total = Object.keys(gate).length;

  return `${passed}/${total}`;
}
