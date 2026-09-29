/** Absent on saved editions: old content and presentation remain untouched. */
export const NARRATIVE_EDITION = "mbti-library-1" as const;
export const DETAIL_NARRATIVE_EDITION = "mbti-library-2" as const;
export function hasDetailNarrative(value: unknown): boolean {
  return !!value && typeof value === "object" && "narrativeEdition" in value && value.narrativeEdition === DETAIL_NARRATIVE_EDITION;
}
export function hasNarrativeEdition(value: unknown): boolean {
  return hasDetailNarrative(value) || (!!value && typeof value === "object" && "narrativeEdition" in value && value.narrativeEdition === NARRATIVE_EDITION);
}
