/** Reviewed language metadata, not a runtime language model or text classifier. */
export const HUMAN_DESCRIPTION_TYPES = ["PERSONALITY", "BEHAVIOR_PROCESS", "DUAL_DESIRE", "VALUE", "STRENGTH_TO_SHADOW", "PERCEPTION_STYLE", "OUTER_INNER", "CRISIS_BEHAVIOR", "RELATION_PATTERN", "MONEY_VALUE", "ACHIEVEMENT_PATTERN", "RECOVERY_PATTERN"] as const;
export type HumanDescriptionType = typeof HUMAN_DESCRIPTION_TYPES[number];
export type HumanDescriptionQuality = "UNDERSTANDABLE" | "NATURAL" | "HUMAN_DESCRIPTIVE";
export const HUMAN_FORBIDDEN_LANGUAGE = /발현|양상|상호작용|사회적\s*지위|역할과\s*이름|내적\s*성찰|재정적\s*성취|복합적으로\s*작용|경향성이 있습니다|가능성이 존재합니다|해석될 여지가 있습니다|결을 가진 사람/;
export const HUMAN_ADVICE_LANGUAGE = /하세요|정하세요|두세요|나누세요|위임하세요|쉬세요|받아보세요/;
export const UNSUPPORTED_SPECIFICITY_LANGUAGE = /매주\s*일요일|회의가 끝난 뒤 항상|답장이\s*(?:세|3)\s*시간|반드시|무조건/;
export const HUMAN_GOLDEN_LANGUAGE = {
  softBelief: "생각이나 신념은 확고하지만, 말은 부드럽게 잘하는 사람입니다.",
  thinkMove: "생각을 충분히 한 뒤 결론이 나면 빠르게 움직입니다.",
  newStable: "새로운 일을 좋아하지만 생활은 안정적으로 유지하고 싶어 합니다.",
  moneyMeaning: "돈도 중요하지만, 이 일을 왜 하는지도 중요하게 생각합니다.",
  delayedPrecision: "잘하고 싶은 마음이 커서 완성도를 너무 신경 쓰다 시작이 늦어지기도 합니다.",
  precision: "남들이 충분히 잘됐다고 해도 부족한 점이나 고칠 부분부터 먼저 봅니다.",
  publicRecovery: "사람들 앞에서는 힘든 티를 잘 내지 않지만 집에 돌아오면 한꺼번에 방전되기도 합니다.",
  calmPressure: "일이 급해져도 당황하기보다 먼저 해야 할 순서를 정하고 차분하게 해결하는 편입니다.",
} as const;
export function humanLanguageErrors(text: string): string[] {
  return [...(HUMAN_FORBIDDEN_LANGUAGE.test(text) ? ["FORBIDDEN_HUMAN_LANGUAGE"] : []),
    ...(HUMAN_ADVICE_LANGUAGE.test(text) ? ["ADVICE_NOT_ALLOWED"] : []),
    ...(UNSUPPORTED_SPECIFICITY_LANGUAGE.test(text) ? ["UNSUPPORTED_SPECIFICITY"] : [])];
}
export function descriptionGenericness(quality: HumanDescriptionQuality, specificity: number, axisCount: number): number {
  const qualityFloor = quality === "UNDERSTANDABLE" ? .85 : quality === "NATURAL" ? .55 : .08;
  return Math.min(1, Math.max(qualityFloor, 1 - specificity, axisCount < 2 ? .42 : .08));
}
export const genericnessPenalty = (value: number) => value <= .30 ? 0 : value <= .50 ? 5 : value <= .70 ? 12 : 25;
