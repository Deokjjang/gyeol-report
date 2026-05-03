import { SAJU_MBTI_AXIS_RULES } from "./sajuSuggestionRules";
import type {
  MbtiAxis,
  MbtiAxisSide,
  SajuMbtiAxisSuggestion,
  SajuMbtiSuggestionEvidence,
  SajuMbtiSuggestionResult,
  SajuMbtiTypeSuggestion,
  SajuMbtiUserComparison,
} from "./sajuSuggestionTypes";
import type { MbtiType } from "./types";
import type { SajuTag, SajuTagCode } from "../saju/tags";

const AXES = ["EI", "SN", "TF", "JP"] as const satisfies readonly MbtiAxis[];

type AxisRule = (typeof SAJU_MBTI_AXIS_RULES)[number];

function createTagMap(tags: readonly SajuTag[]): Map<SajuTagCode, SajuTag> {
  const tagMap = new Map<SajuTagCode, SajuTag>();

  for (const tag of tags) {
    if (!tagMap.has(tag.code)) {
      tagMap.set(tag.code, tag);
    }
  }

  return tagMap;
}

function createEvidence(
  tagCodes: readonly SajuTagCode[],
  tagMap: ReadonlyMap<SajuTagCode, SajuTag>,
): SajuMbtiSuggestionEvidence[] {
  const evidence: SajuMbtiSuggestionEvidence[] = [];

  for (const tagCode of tagCodes) {
    const tag = tagMap.get(tagCode);

    if (tag) {
      evidence.push({
        sajuTagCode: tag.code,
        reasonKo: tag.labelKo,
      });
    }
  }

  return evidence;
}

function getSuggestionConfidence(
  evidenceLength: number,
): SajuMbtiAxisSuggestion["confidence"] {
  if (evidenceLength >= 3) {
    return "HIGH";
  }

  if (evidenceLength >= 2) {
    return "MEDIUM";
  }

  return "LOW";
}

function createAxisSuggestion(
  rule: AxisRule,
  evidence: readonly SajuMbtiSuggestionEvidence[],
): SajuMbtiAxisSuggestion {
  return {
    axis: rule.axis,
    suggestedSide: rule.suggestedSide,
    strength: rule.strength,
    confidence: getSuggestionConfidence(evidence.length),
    titleKo: rule.titleKo,
    summaryKo: rule.summaryKo,
    evidence,
  };
}

function matchRule(
  rule: AxisRule,
  tagMap: ReadonlyMap<SajuTagCode, SajuTag>,
): SajuMbtiAxisSuggestion | undefined {
  const requiredEvidence = createEvidence(rule.requiredTags, tagMap);

  if (requiredEvidence.length !== rule.requiredTags.length) {
    return undefined;
  }

  const supportingEvidence = createEvidence(rule.supportingTags ?? [], tagMap);

  return createAxisSuggestion(rule, [
    ...requiredEvidence,
    ...supportingEvidence,
  ]);
}

function getStrengthRank(strength: SajuMbtiAxisSuggestion["strength"]): number {
  switch (strength) {
    case "HIGH":
      return 3;
    case "MEDIUM":
      return 2;
    case "LOW":
      return 1;
  }
}

function getConfidenceRank(
  confidence: SajuMbtiAxisSuggestion["confidence"],
): number {
  switch (confidence) {
    case "HIGH":
      return 3;
    case "MEDIUM":
      return 2;
    case "LOW":
      return 1;
  }
}

function isBetterAxisSuggestion(
  candidate: SajuMbtiAxisSuggestion,
  current: SajuMbtiAxisSuggestion,
): boolean {
  const candidateStrength = getStrengthRank(candidate.strength);
  const currentStrength = getStrengthRank(current.strength);

  if (candidateStrength !== currentStrength) {
    return candidateStrength > currentStrength;
  }

  return getConfidenceRank(candidate.confidence) > getConfidenceRank(
    current.confidence,
  );
}

function selectAxisSuggestions(
  axisSuggestions: readonly SajuMbtiAxisSuggestion[],
): Map<MbtiAxis, SajuMbtiAxisSuggestion> {
  const selected = new Map<MbtiAxis, SajuMbtiAxisSuggestion>();

  for (const suggestion of axisSuggestions) {
    const current = selected.get(suggestion.axis);

    if (!current || isBetterAxisSuggestion(suggestion, current)) {
      selected.set(suggestion.axis, suggestion);
    }
  }

  return selected;
}

function createSuggestedType(
  selected: ReadonlyMap<MbtiAxis, SajuMbtiAxisSuggestion>,
): MbtiType {
  const ei = selected.get("EI")?.suggestedSide;
  const sn = selected.get("SN")?.suggestedSide;
  const tf = selected.get("TF")?.suggestedSide;
  const jp = selected.get("JP")?.suggestedSide;

  return `${ei}${sn}${tf}${jp}` as MbtiType;
}

function getTypeSuggestionConfidence(
  selectedSuggestions: readonly SajuMbtiAxisSuggestion[],
): SajuMbtiTypeSuggestion["confidence"] {
  if (selectedSuggestions.every((suggestion) => suggestion.confidence === "HIGH")) {
    return "HIGH";
  }

  const mediumOrHighCount = selectedSuggestions.filter(
    (suggestion) => suggestion.confidence !== "LOW",
  ).length;

  return mediumOrHighCount >= 2 ? "MEDIUM" : "LOW";
}

function createTypeSuggestion(
  selected: ReadonlyMap<MbtiAxis, SajuMbtiAxisSuggestion>,
): SajuMbtiTypeSuggestion | undefined {
  const unresolvedAxes = AXES.filter((axis) => !selected.has(axis));

  if (unresolvedAxes.length > 0) {
    return undefined;
  }

  const selectedSuggestions = AXES.map((axis) => selected.get(axis));

  if (selectedSuggestions.some((suggestion) => !suggestion)) {
    return undefined;
  }

  const concreteSuggestions =
    selectedSuggestions as readonly SajuMbtiAxisSuggestion[];

  return {
    suggestedType: createSuggestedType(selected),
    confidence: getTypeSuggestionConfidence(concreteSuggestions),
    matchedAxes: AXES,
    unresolvedAxes: [],
    summaryKo:
      "사주 구조에서 네 가지 MBTI 축을 모두 추정할 수 있어 하나의 후보 유형으로 정리했습니다.",
  };
}

function getUserAxisSide(userType: MbtiType, axis: MbtiAxis): MbtiAxisSide {
  switch (axis) {
    case "EI":
      return userType[0] as MbtiAxisSide;
    case "SN":
      return userType[1] as MbtiAxisSide;
    case "TF":
      return userType[2] as MbtiAxisSide;
    case "JP":
      return userType[3] as MbtiAxisSide;
  }
}

function getComparisonSummary(
  direction: SajuMbtiUserComparison["direction"],
): string {
  switch (direction) {
    case "MATCH":
      return "입력한 MBTI와 사주 기반 성향 후보가 전반적으로 잘 맞습니다.";
    case "PARTIAL_MATCH":
      return "입력한 MBTI와 사주 기반 성향 후보가 일부 축에서는 맞고, 일부 축에서는 다르게 읽힙니다.";
    case "TENSION":
      return "입력한 MBTI와 사주 기반 성향 후보 사이에 차이가 있어, 실제 자기인식과 사주 구조를 함께 비교해 볼 필요가 있습니다.";
    case "UNRESOLVED":
      return "현재 사주 태그만으로는 MBTI 축을 충분히 좁히기 어렵습니다.";
  }
}

function getComparisonDirection(params: {
  selectedAxisCount: number;
  hasTypeSuggestion: boolean;
  matchingAxesCount: number;
  tensionAxesCount: number;
}): SajuMbtiUserComparison["direction"] {
  if (params.selectedAxisCount === 0) {
    return "UNRESOLVED";
  }

  if (params.tensionAxesCount === 0 && params.hasTypeSuggestion) {
    return "MATCH";
  }

  if (params.matchingAxesCount > 0 && params.tensionAxesCount > 0) {
    return "PARTIAL_MATCH";
  }

  if (params.matchingAxesCount === 0 && params.tensionAxesCount > 0) {
    return "TENSION";
  }

  return "PARTIAL_MATCH";
}

function createUserComparison(params: {
  userType: MbtiType;
  selected: ReadonlyMap<MbtiAxis, SajuMbtiAxisSuggestion>;
  typeSuggestion: SajuMbtiTypeSuggestion | undefined;
}): SajuMbtiUserComparison {
  const matchingAxes: MbtiAxis[] = [];
  const tensionAxes: MbtiAxis[] = [];

  for (const axis of AXES) {
    const suggestion = params.selected.get(axis);

    if (!suggestion) {
      continue;
    }

    if (getUserAxisSide(params.userType, axis) === suggestion.suggestedSide) {
      matchingAxes.push(axis);
    } else {
      tensionAxes.push(axis);
    }
  }

  const direction = getComparisonDirection({
    selectedAxisCount: matchingAxes.length + tensionAxes.length,
    hasTypeSuggestion: Boolean(params.typeSuggestion),
    matchingAxesCount: matchingAxes.length,
    tensionAxesCount: tensionAxes.length,
  });

  return {
    userType: params.userType,
    suggestedType: params.typeSuggestion?.suggestedType,
    direction,
    matchingAxes,
    tensionAxes,
    summaryKo: getComparisonSummary(direction),
  };
}

function unique(values: readonly string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    if (!seen.has(value)) {
      seen.add(value);
      result.push(value);
    }
  }

  return result;
}

function createNotices(typeSuggestion: SajuMbtiTypeSuggestion | undefined): string[] {
  return unique([
    ...(typeSuggestion
      ? [
          "사주 기반 MBTI 후보는 확정 판정이 아니라 자기이해를 돕기 위한 비교 기준입니다.",
        ]
      : []),
    "입력한 MBTI는 사용자의 자기보고 정보로 존중하며, 사주 기반 제안은 보조 해석으로만 사용합니다.",
  ]);
}

export function evaluateSajuMbtiSuggestion(input: {
  sajuTags: readonly SajuTag[];
  userType: MbtiType;
}): SajuMbtiSuggestionResult {
  const tagMap = createTagMap(input.sajuTags);
  const axisSuggestions: SajuMbtiAxisSuggestion[] = [];

  for (const rule of SAJU_MBTI_AXIS_RULES) {
    const suggestion = matchRule(rule, tagMap);

    if (suggestion) {
      axisSuggestions.push(suggestion);
    }
  }

  const selected = selectAxisSuggestions(axisSuggestions);
  const typeSuggestion = createTypeSuggestion(selected);
  const comparison = createUserComparison({
    userType: input.userType,
    selected,
    typeSuggestion,
  });

  return {
    userType: input.userType,
    axisSuggestions,
    typeSuggestion,
    comparison,
    notices: createNotices(typeSuggestion),
  };
}
